// cc-inspect MCP server (stdio). Read-only. No network, no telemetry.
// Reads Claude Code session transcripts (sessions.ts) and the modules inside the Claude Code binary (binary.ts).
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type * as ES from "estree";
import { z } from "zod";
import pkg from "../package.json" with { type: "json" };
import type { Node } from "./ast.ts";
import { listInstalls, program } from "./binary.ts";
import { eventSites } from "./events.ts";
import { type Entry, mergeEntries, type Val } from "./resolve.ts";
import {
  checkLine,
  configDir,
  listSessions,
  readLines,
  SCHEMA_VERSION,
  sessionPath,
} from "./sessions.ts";
import { baseTools } from "./tools.ts";

const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;
const MAX_CHARS = 40000;

type Out = {
  content: { type: "text"; text: string }[];
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
};
const text = (t: string, data?: Record<string, unknown>): Out => ({
  content: [{ type: "text", text: t }],
  ...(data && { structuredContent: data }),
});
/** Run a tool body; an error becomes a tool error with its message. */
const run = async (f: () => Out | Promise<Out>): Promise<Out> => {
  try {
    return await f();
  } catch (e) {
    return {
      content: [{ type: "text", text: `Error: ${(e as Error).message}` }],
      isError: true,
    };
  }
};
const clip = (s: string, n: number) =>
  s.length > n ? `${s.slice(0, n)}… (${s.length - n} more chars)` : s;
const regex = (pattern: string, isRegex: boolean) =>
  new RegExp(
    isRegex ? pattern : pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );

/** An analyzer result as plain JSON: a key ending in "?" is optional. */
const valJson = (v: Val): unknown =>
  v.k === "obj"
    ? entriesJson(v.e)
    : v.k === "str" || v.k === "num" || v.k === "bool"
      ? { const: v.v }
      : v.k === "enum"
        ? { enum: v.v }
        : v.k === "arr"
          ? { type: "array" }
          : { unknown: clip(v.text, 120) };
const entriesJson = (entries: Entry[]): Record<string, unknown> =>
  Object.fromEntries(
    entries.map((e) =>
      "key" in e
        ? [`${e.key}${e.opt ? "?" : ""}`, valJson(e.val)]
        : [`...${clip(e.spread, 80)}`, "unresolved spread"],
    ),
  );

const server = new McpServer({ name: "cc-inspect", version: pkg.version });

const binaryArg = z
  .string()
  .optional()
  .describe(
    "Version (e.g. 2.1.307) or path of a Claude Code binary. Default: the install the claude launcher points to.",
  );

// ---- sessions ----

server.registerTool(
  "list_sessions",
  {
    title: "List Claude Code sessions",
    description: `List session transcripts under <config dir>/projects (CLAUDE_CONFIG_DIR, or ~/.claude), newest first.
Args:
  - project (string, optional): keep projects whose folder name contains this (the folder is the project path with "/" as "-").
  - limit (number 1-200, default 20).
Returns: one line per session: id, project, size, modified time; structuredContent {sessions:[{id,project,path,bytes,modified}]}.`,
    inputSchema: {
      project: z.string().optional(),
      limit: z.number().int().min(1).max(200).default(20),
    },
    annotations: READ_ONLY,
  },
  ({ project, limit }) =>
    run(() => {
      const all = listSessions(project);
      const sessions = all.slice(0, limit);
      return text(
        sessions.length
          ? `${all.length} sessions under ${configDir()}/projects${all.length > limit ? `, showing ${limit}` : ""}:\n${sessions
              .map(
                (s) =>
                  `- ${s.id}  ${s.project}  ${Math.round(s.bytes / 1024)} KB  ${s.modified}`,
              )
              .join("\n")}`
          : `No sessions under ${configDir()}/projects${project ? ` for "${project}"` : ""}.`,
        { sessions },
      );
    }),
);

server.registerTool(
  "read_session",
  {
    title: "Read a Claude Code session transcript",
    description: `Read lines of a session transcript (.jsonl), numbered from 1.
Args:
  - session (string): session id (a unique prefix works) or a path to a .jsonl file.
  - type (string, optional): keep lines with this "type" (user, assistant, system, attachment, summary, ...).
  - offset (number, default 0): lines to skip, after the type filter.
  - limit (number 1-200, default 20).
  - max_line_chars (number, default 2000): each line is cut to this length.
Returns: the lines as JSON text, with "next_offset" when more remain.`,
    inputSchema: {
      session: z.string(),
      type: z.string().optional(),
      offset: z.number().int().min(0).default(0),
      limit: z.number().int().min(1).max(200).default(20),
      max_line_chars: z.number().int().min(100).max(MAX_CHARS).default(2000),
    },
    annotations: READ_ONLY,
  },
  ({ session, type, offset, limit, max_line_chars }) =>
    run(() => {
      const path = sessionPath(session);
      const lines = readLines(path).filter(
        (l) => !type || l.json?.type === type,
      );
      const page = lines.slice(offset, offset + limit);
      const more = offset + page.length < lines.length;
      return text(
        `${path}: lines ${offset + 1}-${offset + page.length} of ${lines.length}${type ? ` with type "${type}"` : ""}${more ? `, next_offset ${offset + page.length}` : ""}\n${page
          .map((l) => `${l.n}: ${clip(l.text, max_line_chars)}`)
          .join("\n")}`,
        {
          path,
          total: lines.length,
          ...(more && { next_offset: offset + page.length }),
        },
      );
    }),
);

server.registerTool(
  "search_sessions",
  {
    title: "Search Claude Code session transcripts",
    description: `Find transcript lines that match a pattern, newest session first.
Args:
  - pattern (string): text to find (or a regular expression with regex: true).
  - regex (boolean, default false).
  - session (string, optional): search one session (id, prefix, or path).
  - project (string, optional): search projects whose folder name contains this.
  - limit (number 1-200, default 20): maximum hits.
Returns: one hit per line: session id, line number, type, and a snippet around the match.`,
    inputSchema: {
      pattern: z.string().min(1),
      regex: z.boolean().default(false),
      session: z.string().optional(),
      project: z.string().optional(),
      limit: z.number().int().min(1).max(200).default(20),
    },
    annotations: READ_ONLY,
  },
  ({ pattern, regex: isRegex, session, project, limit }) =>
    run(() => {
      const re = regex(pattern, isRegex);
      const files = session
        ? [{ id: session, path: sessionPath(session) }]
        : listSessions(project);
      const hits: {
        session: string;
        line: number;
        type: unknown;
        snippet: string;
      }[] = [];
      for (const f of files) {
        for (const l of readLines(f.path)) {
          const m = re.exec(l.text);
          if (!m) continue;
          const from = Math.max(0, m.index - 100);
          hits.push({
            session: f.id,
            line: l.n,
            type: l.json?.type,
            snippet: l.text.slice(from, m.index + m[0].length + 100),
          });
          if (hits.length >= limit) break;
        }
        if (hits.length >= limit) break;
      }
      return text(
        hits.length
          ? hits
              .map((h) => `- ${h.session}:${h.line} [${h.type}] …${h.snippet}…`)
              .join("\n")
          : `No match for ${re} in ${files.length} sessions.`,
        { hits },
      );
    }),
);

server.registerTool(
  "validate_session",
  {
    title: "Check a session transcript against the schema",
    description: `Check each line of a session transcript against the transcript JSON Schema (generated from Claude Code ${SCHEMA_VERSION}), using the definition of the line's "type". Shows the lines whose fields differ from what that version writes: a new version, a hand-edited file, or a gap in the schema.
Args:
  - session (string): session id (a unique prefix works) or a path to a .jsonl file.
  - limit (number 1-200, default 20): maximum failing lines to show.
Returns: counts of lines and failures by type, then each failing line with its problems; structuredContent {lines, failed, byType, failures:[{line,type,problems}]}.`,
    inputSchema: {
      session: z.string(),
      limit: z.number().int().min(1).max(200).default(20),
    },
    annotations: READ_ONLY,
  },
  ({ session, limit }) =>
    run(() => {
      const path = sessionPath(session);
      const lines = readLines(path);
      const byType: Record<string, { lines: number; failed: number }> = {};
      const failures: { line: number; type: unknown; problems: string[] }[] =
        [];
      for (const l of lines) {
        const t = String(l.json?.type);
        const c = byType[t] ?? { lines: 0, failed: 0 };
        byType[t] = c;
        c.lines++;
        const problems = checkLine(l);
        if (!problems.length) continue;
        c.failed++;
        failures.push({ line: l.n, type: l.json?.type, problems });
      }
      const shown = failures.slice(0, limit);
      return text(
        `${path}: ${lines.length} lines, ${failures.length} fail the ${SCHEMA_VERSION} schema.\n${Object.entries(
          byType,
        )
          .map(([t, c]) => `- ${t}: ${c.lines} lines, ${c.failed} fail`)
          .join(
            "\n",
          )}${shown.length ? `\n\nFailures:\n${shown.map((f) => `- line ${f.line} [${f.type}]: ${f.problems.slice(0, 5).join("; ")}`).join("\n")}` : ""}`,
        {
          lines: lines.length,
          failed: failures.length,
          byType,
          failures: shown,
        },
      );
    }),
);

// ---- binary ----

server.registerTool(
  "list_installs",
  {
    title: "List Claude Code installs",
    description: `List the Claude Code binaries under ~/.local/share/claude/versions, newest first, and mark the one ~/.local/bin/claude points to.
Returns: one line per version with its path; structuredContent {installs:[{version,path,current}]}.`,
    inputSchema: {},
    annotations: READ_ONLY,
  },
  () =>
    run(() => {
      const installs = listInstalls();
      return text(
        installs.length
          ? installs
              .map(
                (i) =>
                  `- ${i.version}${i.current ? " (current)" : ""}  ${i.path}`,
              )
              .join("\n")
          : "No Claude Code install found.",
        { installs },
      );
    }),
);

server.registerTool(
  "list_modules",
  {
    title: "List the modules in a Claude Code binary",
    description: `List the files embedded in a Claude Code binary (a Bun single-file executable): JavaScript chunks and assets.
Args:
  - binary (string, optional): version or path.
  - filter (string, optional): keep names that contain this.
Returns: one line per module with its size; structuredContent {path, modules:[{name,bytes}]}.`,
    inputSchema: { binary: binaryArg, filter: z.string().optional() },
    annotations: READ_ONLY,
  },
  ({ binary, filter }) =>
    run(() => {
      const p = program(binary);
      const modules = p.modules
        .filter((m) => !filter || m.name.includes(filter))
        .map((m) => ({ name: m.name, bytes: m.bytes.length }));
      return text(
        `${p.path}: ${modules.length} modules\n${modules.map((m) => `- ${m.name}  ${m.bytes} bytes`).join("\n")}`,
        { path: p.path, modules },
      );
    }),
);

server.registerTool(
  "search_binary",
  {
    title: "Search the code of a Claude Code binary",
    description: `Find text in the JavaScript modules of a Claude Code binary. Search literal anchors (strings, event names, setting keys, env var names), since identifiers are minified and change between versions.
Args:
  - pattern (string): text to find (or a regular expression with regex: true).
  - regex (boolean, default false).
  - module (string, optional): search modules whose name contains this.
  - binary (string, optional): version or path.
  - context (number 0-2000, default 150): characters shown on each side.
  - limit (number 1-200, default 20).
Returns: one hit per match: module, offset, and the code around it. Use read_module or resolve_object with the module and offset.`,
    inputSchema: {
      pattern: z.string().min(1),
      regex: z.boolean().default(false),
      module: z.string().optional(),
      binary: binaryArg,
      context: z.number().int().min(0).max(2000).default(150),
      limit: z.number().int().min(1).max(200).default(20),
    },
    annotations: READ_ONLY,
  },
  ({ pattern, regex: isRegex, module, binary, context, limit }) =>
    run(() => {
      const re = new RegExp(regex(pattern, isRegex).source, "g");
      const hits: { module: string; offset: number; snippet: string }[] = [];
      for (const m of program(binary).bundle.modules.values()) {
        if (module && !m.name.includes(module)) continue;
        for (const h of m.text.matchAll(re)) {
          hits.push({
            module: m.name,
            offset: h.index,
            snippet: m.text.slice(
              Math.max(0, h.index - context),
              h.index + h[0].length + context,
            ),
          });
          if (hits.length >= limit) break;
        }
        if (hits.length >= limit) break;
      }
      return text(
        hits.length
          ? hits
              .map((h) => `- ${h.module}@${h.offset}: ${h.snippet}`)
              .join("\n\n")
          : `No match for ${re}.`,
        { hits },
      );
    }),
);

server.registerTool(
  "read_module",
  {
    title: "Read code from a Claude Code binary",
    description: `Read a slice of one module of a Claude Code binary.
Args:
  - module (string): module name from list_modules or search_binary (e.g. "chunk-abc.js").
  - offset (number, default 0): character offset.
  - length (number 1-${MAX_CHARS}, default 4000).
  - binary (string, optional): version or path.
Returns: the code, headed by its range and the module length.`,
    inputSchema: {
      module: z.string(),
      offset: z.number().int().min(0).default(0),
      length: z.number().int().min(1).max(MAX_CHARS).default(4000),
      binary: binaryArg,
    },
    annotations: READ_ONLY,
  },
  ({ module, offset, length, binary }) =>
    run(() => {
      const p = program(binary);
      const m =
        p.modules.find((x) => x.name.endsWith(`/${module}`)) ??
        p.modules.find((x) => x.name === module);
      if (!m) throw new Error(`no module "${module}" in ${p.path}`);
      const end = Math.min(m.source.length, offset + length);
      return text(
        `${m.name} [${offset}, ${end}) of ${m.source.length}\n${m.source.slice(offset, end)}`,
      );
    }),
);

server.registerTool(
  "resolve_object",
  {
    title: "Resolve an object literal in a Claude Code binary",
    description: `Parse the object literal around a place in the code and list its keys, following spreads into the functions and modules they come from (minified names do not matter). A key ending in "?" is optional (behind a condition, or missing at some sites). Values show {const}, {enum}, nested keys, or {unknown: <code>}.
Args:
  - module (string): module name (from search_binary).
  - offset (number, optional): offset inside or at the "{" of the literal.
  - anchor (string, optional): instead of offset, the first place this text occurs in the module; the innermost literal around it is used.
  - binary (string, optional): version or path.
Returns: the keys as JSON, and the spreads that could not be followed.`,
    inputSchema: {
      module: z.string(),
      offset: z.number().int().min(0).optional(),
      anchor: z.string().optional(),
      binary: binaryArg,
    },
    annotations: READ_ONLY,
  },
  ({ module, offset, anchor, binary }) =>
    run(() => {
      const { bundle, resolver: R } = program(binary);
      const m = bundle.get(module);
      if (!m) throw new Error(`no JavaScript module "${module}"`);
      const pos = anchor ? m.text.indexOf(anchor) : (offset ?? -1);
      if (pos < 0)
        throw new Error(
          anchor ? `anchor not found: ${anchor}` : "give offset or anchor",
        );
      let obj: Node | undefined = m.nodeAt(pos);
      while (obj && obj.type !== "ObjectExpression") obj = m.parent(obj);
      if (!obj) throw new Error(`no object literal around ${module}@${pos}`);
      const before = R.unresolved.length;
      const keys = entriesJson(
        R.pin(R.entries(m, obj as Node & ES.ObjectExpression)),
      );
      const unresolved = [...new Set(R.unresolved.slice(before))];
      return text(
        `${JSON.stringify(keys, null, 2)}${unresolved.length ? `\n\nSpreads not followed:\n${unresolved.map((u) => `- ${u}`).join("\n")}` : ""}`,
        { keys, unresolved },
      );
    }),
);

server.registerTool(
  "resolve_event",
  {
    title: "Resolve an OpenTelemetry event of Claude Code",
    description: `Find every place the program emits an OpenTelemetry event (log record) and merge the attribute keys of all call sites. A key missing from some sites ends in "?". Base attributes (session.id, user.id, ...) and event.* fields are added to every event and are not listed.
Args:
  - name (string, optional): event name without the "claude_code." prefix (e.g. "tool_result"). Without it, lists the event names.
  - binary (string, optional): version or path.
Returns: the keys as JSON, or the list of events with their call site counts.`,
    inputSchema: { name: z.string().optional(), binary: binaryArg },
    annotations: READ_ONLY,
  },
  ({ name, binary }) =>
    run(() => {
      const { bundle, resolver } = program(binary);
      const events = eventSites(bundle, resolver);
      if (!name)
        return text(
          [...events]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([n, l]) => `- ${n}: ${l.length} call sites`)
            .join("\n"),
          {
            events: Object.fromEntries(
              [...events].map(([n, l]) => [n, l.length]),
            ),
          },
        );
      const lists = events.get(name.replace(/^claude_code\./, ""));
      if (!lists)
        throw new Error(
          `no event "${name}"; events: ${[...events.keys()].join(", ")}`,
        );
      const keys = entriesJson(mergeEntries(lists));
      return text(
        `${lists.length} call sites\n${JSON.stringify(keys, null, 2)}`,
        {
          sites: lists.length,
          keys,
        },
      );
    }),
);

server.registerTool(
  "list_tools",
  {
    title: "List the built-in tools of Claude Code",
    description: `List the tools the program's getAllBaseTools gives, each with the code that gates it: the test of a "cond?[T]:[]" spread, or the function of a "[A,B].filter(f)". A tool's own isEnabled() and the per-session filters of getTools are not included. Minified names change between versions; "functions" holds the source of each function the gates call, two calls deep.
Args:
  - binary (string, optional): version or path.
Returns: one line per tool with its gates, then the functions; structuredContent {module, tools:[{name,when,unresolved?}], functions}.`,
    inputSchema: { binary: binaryArg },
    annotations: READ_ONLY,
  },
  ({ binary }) =>
    run(() => {
      const { bundle, resolver } = program(binary);
      const r = baseTools(bundle, resolver);
      return text(
        `${r.module}: ${r.tools.length} tools\n${r.tools
          .map(
            (t) =>
              `- ${t.name}${t.unresolved ? " (unresolved)" : ""}${t.when.length ? `  when: ${t.when.join(" && ")}` : ""}`,
          )
          .join("\n")}\n\nFunctions:\n${Object.entries(r.functions)
          .map(([n, s]) => `- ${n}: ${s}`)
          .join("\n")}`,
        r,
      );
    }),
);

await server.connect(new StdioServerTransport());
