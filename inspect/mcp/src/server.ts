// cc-inspect MCP server (stdio). Writes only its cache; its one network call is `gh release view` for `release` `notes`. No telemetry.
// Reads Claude Code session transcripts (sessions.ts) and the modules inside the Claude Code binary (binary.ts).
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type * as ES from "estree";
import { z } from "zod";
import pkg from "../package.json" with { type: "json" };
import type { Node } from "./ast.ts";
import { listInstalls, program } from "./binary.ts";
import {
  type Change,
  cut,
  diffIndexes,
  filterChanges,
  lines as linesOf,
  unitDiff,
} from "./diff.ts";
import { eventSites } from "./events.ts";
import { explain } from "./explain.ts";
import { findUnits } from "./find.ts";
import { checkNotes, readNotes } from "./notes.ts";
import { prepared } from "./prepare.ts";
import { type Entry, mergeEntries, type Val } from "./resolve.ts";
import {
  checkLine,
  configDir,
  listSessions,
  readLines,
  SCHEMA_VERSION,
  sessionPath,
} from "./sessions.ts";
import { KINDS, type SurfaceItem, surface } from "./surface/index.ts";
import { baseTools } from "./tools.ts";

const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;
// `code` and `release` write the cache of cleaned code, and `release` `notes` runs `gh release view`.
const WRITES_CACHE = {
  ...READ_ONLY,
  readOnlyHint: false,
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

// Shared parameters: the same name means the same thing in each tool.
const P = {
  version: z
    .string()
    .optional()
    .describe(
      "Claude Code version or binary path; default: the current install.",
    ),
  query: z.string().min(1).optional().describe("Text to find."),
  regex: z
    .boolean()
    .optional()
    .describe("Treat query as a regular expression."),
  name: z
    .string()
    .optional()
    .describe("Name or filter (any case where it filters)."),
  module: z.string().optional().describe('Module name, e.g. "chunk-abc.js".'),
  offset: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).max(400).optional(),
};

type Args = Record<string, unknown> & {
  action?: string;
  version?: string;
  query?: string;
  regex?: boolean;
  name?: string;
  module?: string;
  offset?: number;
  limit?: number;
};
/** One tool whose operations are the values of `action`; each handler gets the parsed arguments. */
const group = <A extends Args>(
  tool: string,
  description: string,
  key: "action" | "kind",
  handlers: Record<string, (a: A) => Out | Promise<Out>>,
  extra: Record<string, z.ZodType>,
  annotations: Record<string, boolean> = READ_ONLY,
) =>
  server.registerTool(
    tool,
    {
      description,
      inputSchema: {
        [key]: z
          .string()
          .optional()
          .describe(`One of: ${Object.keys(handlers).join(", ")}.`),
        ...extra,
      },
      annotations,
    },
    (a: Record<string, unknown>) =>
      run(() => {
        const k = String(a[key] ?? "");
        const h = Object.hasOwn(handlers, k) ? handlers[k] : undefined;
        if (!h)
          throw new Error(
            `unknown ${key} "${k}"; ${key}s: ${Object.keys(handlers).filter(Boolean).join(", ")}`,
          );
        return h(a as A);
      }),
  );

const need = (v: string | undefined, what: string): string => {
  if (!v) throw new Error(`give ${what}`);
  return v;
};

// ---- sessions ----

group<
  Args & {
    session?: string;
    project?: string;
    type?: string;
    max_line_chars?: number;
  }
>(
  "sessions",
  "Read Claude Code session transcripts: list, read, search, or validate them against the transcript schema.",
  "action",
  {
    list: ({ project, limit = 20 }) => {
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
    },
    read: ({
      session,
      type,
      offset = 0,
      limit = 20,
      max_line_chars = 2000,
    }) => {
      const path = sessionPath(need(session, "session"));
      const lines = readLines(path).filter(
        (l) => !type || l.json?.type === type,
      );
      const page = lines.slice(offset, offset + limit);
      const more = offset + page.length < lines.length;
      return text(
        `${path}: lines ${offset + 1}-${offset + page.length} of ${lines.length}${type ? ` with type "${type}"` : ""}${more ? `, next_offset ${offset + page.length}` : ""}\n${page
          .map((l) => `${l.n}: ${clip(l.text, max_line_chars)}`)
          .join("\n")}`,
      );
    },
    search: ({
      query,
      regex: isRegex = false,
      session,
      project,
      limit = 20,
    }) => {
      const re = regex(need(query, "query"), isRegex);
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
    },
    validate: ({ session, limit = 20 }) => {
      const path = sessionPath(need(session, "session"));
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
    },
  },
  {
    session: z
      .string()
      .optional()
      .describe("Session id, unique prefix, or .jsonl path."),
    project: z
      .string()
      .optional()
      .describe("Keep project folders whose name contains this."),
    type: z.string().optional().describe('Keep lines with this "type" (read).'),
    query: P.query,
    regex: P.regex,
    offset: P.offset,
    limit: P.limit,
    max_line_chars: z.number().int().min(100).max(MAX_CHARS).optional(),
  },
);

// ---- code ----

group<Args & { context?: number; length?: number }>(
  "code",
  "Read the code inside a Claude Code binary: list installs or modules, search literal text, find code by plain words, read a module slice, or prepare a cleaned index for release diffs.",
  "action",
  {
    installs: () => {
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
    },
    modules: ({ version, name }) => {
      const p = program(version);
      const modules = p.modules
        .filter((m) => !name || m.name.includes(name))
        .map((m) => ({ name: m.name, bytes: m.bytes.length }));
      return text(
        `${p.path}: ${modules.length} modules\n${modules.map((m) => `- ${m.name}  ${m.bytes} bytes`).join("\n")}`,
        { path: p.path, modules },
      );
    },
    search: ({
      query,
      regex: isRegex = false,
      module,
      version,
      context = 150,
      limit = 20,
    }) => {
      const re = new RegExp(regex(need(query, "query"), isRegex).source, "g");
      const hits: { module: string; offset: number; snippet: string }[] = [];
      for (const m of program(version).bundle.modules.values()) {
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
    },
    read: ({ module, offset = 0, length = 4000, version }) => {
      const p = program(version);
      const mod = need(module, "module");
      const m =
        p.modules.find((x) => x.name.endsWith(`/${mod}`)) ??
        p.modules.find((x) => x.name === mod);
      if (!m) throw new Error(`no module "${mod}" in ${p.path}`);
      const end = Math.min(m.source.length, offset + length);
      return text(
        `${m.name} [${offset}, ${end}) of ${m.source.length}\n${m.source.slice(offset, end)}`,
      );
    },
    find: ({ query, version, limit = 10 }) => {
      const q = need(query, "query");
      const r = prepared(version);
      const found = findUnits(r.index, q, Math.min(limit, 10)).map((f) => ({
        ...f,
        excerpt: linesOf(f.u.t).slice(0, 4).map(cut),
      }));
      return text(
        found.length
          ? `${r.index.version}: top ${found.length} for "${clip(q, 100)}"\n${found
              .map(
                ({ u, n, hits, excerpt }) =>
                  `## ${u.k}  ${u.m}:${u.s}  score ${n} (${hits.join(", ")})\n${excerpt.join("\n")}`,
              )
              .join("\n\n")}`
          : `No unit holds a word of "${clip(q, 100)}".`,
        {
          found: found.map(({ u, n, hits, excerpt }) => ({
            label: u.k,
            module: u.m,
            offset: u.s,
            score: n,
            hits,
            excerpt,
          })),
        },
      );
    },
    prepare: ({ version }) => {
      const r = prepared(version);
      const skipped = Object.keys(r.index.skipped);
      return text(
        `${r.index.version}: ${r.parsed ? `${r.parsed} modules cleaned` : "read from the cache"}, ${r.index.units.length} units, ${r.ms} ms -> ${r.dir}${skipped.length ? `\nNot JavaScript: ${skipped.join(", ")}` : ""}`,
        {
          dir: r.dir,
          version: r.index.version,
          parsed: r.parsed,
          units: r.index.units.length,
          skipped,
          ms: r.ms,
        },
      );
    },
  },
  {
    version: P.version,
    query: P.query,
    regex: P.regex,
    name: P.name,
    module: P.module,
    offset: P.offset,
    limit: P.limit,
    context: z
      .number()
      .int()
      .min(0)
      .max(2000)
      .optional()
      .describe("Characters shown around a search hit (default 150)."),
    length: z
      .number()
      .int()
      .min(1)
      .max(MAX_CHARS)
      .optional()
      .describe("Characters to read (default 4000)."),
  },
  WRITES_CACHE,
);

// ---- surface ----

const SURFACE_LIMIT = 200;
const SURFACE_NAME_CHARS = 120;
/** Room kept in the reply for the header line (it names the filter and the next offset). */
const SURFACE_HEADER_CHARS = 300;
const surfaceLine = (i: SurfaceItem) =>
  `- ${clip(i.name, SURFACE_NAME_CHARS)}${i.default !== undefined ? `  default ${i.default}` : ""}${i.values ? `  values ${i.values.join("|")}` : ""}${i.gate ? `  gate ${clip(i.gate, 120)}` : ""}${i.detail ? `  (${clip(i.detail, 120)})` : ""}  ${i.module ?? "-"}:${i.offset ?? "-"}`;

const listKind = (
  kind: string,
  { name, offset = 0, limit = SURFACE_LIMIT, version }: Args,
) => {
  const { bundle, modules } = program(version);
  if (!kind)
    return text(
      Object.keys(KINDS)
        .map((k) => {
          try {
            return `- ${k}: ${surface(bundle, k, modules).length}`;
          } catch (e) {
            return `- ${k}: error: ${(e as Error).message}`;
          }
        })
        .join("\n"),
    );
  const q = name?.toLowerCase();
  const all = surface(bundle, kind, modules).filter(
    (i) => !q || i.name.toLowerCase().includes(q),
  );
  const budget = MAX_CHARS - SURFACE_HEADER_CHARS;
  let used = 0;
  const lines: string[] = [];
  for (const i of all.slice(offset, offset + limit)) {
    const l = surfaceLine(i);
    if (used + l.length + 1 > budget) {
      if (!lines.length) lines.push(l.slice(0, budget));
      break;
    }
    lines.push(l);
    used += l.length + 1;
  }
  const more = offset + lines.length < all.length;
  return text(
    `${kind}: items ${offset + 1}-${offset + lines.length} of ${all.length}${name ? ` matching "${clip(name, 100)}"` : ""}${more ? `, next_offset ${offset + lines.length}` : ""}\n${lines.join("\n")}`,
  );
};

group<Args & { kind?: string; anchor?: string }>(
  "surface",
  `List what a Claude Code binary exposes by kind (${Object.keys(KINDS).join(", ")}), or resolve object-keys, event-keys, or tool-gates from its code.`,
  "kind",
  {
    ...Object.fromEntries(
      ["", ...Object.keys(KINDS)].map((k) => [k, (a: Args) => listKind(k, a)]),
    ),
    "object-keys": ({ module, offset, anchor, version }) => {
      const { bundle, resolver: R } = program(version);
      const m = bundle.get(need(module, "module"));
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
    },
    "event-keys": ({ name, version }) => {
      const { bundle, resolver } = program(version);
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
    },
    "tool-gates": ({ version }) => {
      const { bundle, resolver } = program(version);
      const r = baseTools(bundle, resolver);
      return text(
        `${r.module}: ${r.tools.length} tools\n${r.tools
          .map(
            (t) =>
              `- ${t.name}${t.unresolved ? " (unresolved)" : ""}${t.when.length ? `  when: ${t.when.join(" && ")}` : ""}${t.enabled ? `  own: ${t.enabled}` : ""}`,
          )
          .join("\n")}\n\nFunctions:\n${Object.entries(r.functions)
          .map(([n, s]) => `- ${n}: ${s}`)
          .join("\n")}`,
        r,
      );
    },
  },
  {
    version: P.version,
    name: P.name,
    module: P.module,
    offset: P.offset,
    limit: P.limit,
    anchor: z
      .string()
      .optional()
      .describe("For object-keys: text inside the literal, instead of offset."),
  },
);

// ---- release ----

const DIFF_LINES = 40;
const changeHead = (c: Change) => {
  const u = (c.to ?? c.from) as NonNullable<Change["to"]>;
  const at = [
    c.from && `${c.from.m}:${c.from.s}`,
    c.to && `${c.to.m}:${c.to.s}`,
  ]
    .filter(Boolean)
    .join(" -> ");
  return `## ${c.kind} ${u.k}  ${at}${c.within.length ? `  in ${c.within.slice(0, 3).join(", ")}` : ""}${c.calls.length ? `\n  calls: ${c.calls.slice(0, 6).join("; ")}` : ""}`;
};

group<Args & { from?: string; to?: string }>(
  "release",
  "Compare two Claude Code versions by function (diff), check the release notes against that diff (notes), or explain where a name lives and who, when, and how its code runs (explain).",
  "action",
  {
    diff: ({ from, to, name, offset = 0, limit = 30 }) => {
      const [x, y] = [need(from, "from"), need(to, "to")];
      const a = prepared(x);
      const b = prepared(y);
      const d = diffIndexes(a.index, b.index);
      const all = name ? filterChanges(d, name) : d.changes;
      const order = { changed: 0, added: 1, gone: 2 };
      // Small changes first: they are the most of a release and the cheapest to read.
      const size = (c: Change) =>
        (c.from?.t.length ?? 0) + (c.to?.t.length ?? 0);
      const list = [...all].sort(
        (x, y) => order[x.kind] - order[y.kind] || size(x) - size(y),
      );
      const page = list.slice(offset, offset + Math.min(limit, 30));
      const count = (k: Change["kind"]) =>
        all.filter((c) => c.kind === k).length;
      const more = offset + page.length < list.length;
      return text(
        `${a.index.version} -> ${b.index.version}: ${d.counts.changed} changed, ${d.counts.added} added, ${d.counts.gone} gone (imports and exports left out).${name ? ` Matching "${name}": ${count("changed")} changed, ${count("added")} added, ${count("gone")} gone.` : ""} Showing ${offset + 1}-${offset + page.length}${more ? `, next_offset ${offset + page.length}` : ""}.\n\n${page
          .map((c) => `${changeHead(c)}\n${unitDiff(c, DIFF_LINES).join("\n")}`)
          .join("\n\n")}`,
        {
          counts: d.counts,
          matching: name ? all.length : undefined,
          next_offset: more ? offset + page.length : undefined,
          changes: page.map((c) => ({
            kind: c.kind,
            label: (c.to ?? c.from)?.k,
            from: c.from && { module: c.from.m, offset: c.from.s },
            to: c.to && { module: c.to.m, offset: c.to.s },
            within: c.within.slice(0, 3),
            calls: c.calls.slice(0, 6),
            diff: unitDiff(c, DIFF_LINES),
          })),
        },
      );
    },
    notes: ({ version, from }) => {
      const b = prepared(version);
      const num = (v: string) => v.split(/[.-]/).map((x) => Number(x) || 0);
      const below = (x: string, y: string) => {
        const [p, q] = [num(x), num(y)];
        const i = p.findIndex((n, j) => n !== q[j]);
        return i >= 0 && (p[i] as number) < (q[i] ?? 0);
      };
      const older =
        from ??
        listInstalls()
          .map((i) => i.version)
          .filter((v) => below(v, b.index.version))
          .sort((x, y) => (below(x, y) ? 1 : -1))[0];
      if (!older)
        throw new Error(`no install older than ${b.index.version}; give from`);
      const a = prepared(older);
      const root = dirname(b.dir);
      const report = join(root, "diff", "report.md");
      const items = existsSync(report)
        ? readFileSync(report, "utf8")
            .split("\n")
            .filter((l) => l.startsWith("- "))
        : [];
      const lines = checkNotes(
        readNotes(b.index.version, join(root, "notes.md")),
        diffIndexes(a.index, b.index),
        items,
      );
      const count = (k: string) => lines.filter((l) => l.status === k).length;
      return text(
        `${b.index.version} notes against ${a.index.version}: ${lines.length} lines, ${count("matched")} matched, ${count("gated")} gated, ${count("unmatched")} unmatched. A match is a lead to read, not a proof.\n${lines
          .map((l) => {
            const u = l.change && (l.change.to ?? l.change.from);
            const why = u
              ? `\n    -> ${l.change?.kind} ${u.k} ${u.m}:${u.s} (${l.hits.join(", ")})`
              : l.item
                ? `\n    -> report: ${clip(l.item, 120)} (${l.hits.join(", ")})`
                : "";
            return `- [${l.status}] ${clip(l.line, 160)}${why}`;
          })
          .join("\n")}`,
        {
          lines: lines.map((l) => ({
            line: l.line,
            status: l.status,
            hits: l.hits,
            ...(l.change && {
              at: `${(l.change.to ?? l.change.from)?.m}:${(l.change.to ?? l.change.from)?.s}`,
            }),
          })),
        },
      );
    },
    explain: ({ version, name }) => {
      const wanted = need(name, "name");
      const r = prepared(version);
      const e = explain(r.index, wanted);
      if (!e) return text(`"${name}" is not in ${r.index.version}.`);
      const h = e.holder;
      const list = (xs: string[], n: number) =>
        xs.length
          ? `${xs.slice(0, n).join(", ")}${xs.length > n ? `, and ${xs.length - n} more` : ""}`
          : "none found";
      return text(
        [
          `"${name}" in ${r.index.version}`,
          `Where: ${h.m}:${h.s} (${h.k})${e.others.length ? `; also in ${e.others.join(", ")}` : ""}`,
          `Who: ${list(e.who, 10)}`,
          `When: gates ${list(e.when.gates, 10)}; env reads ${list(e.when.env, 10)}${e.when.isEnabled ? `; isEnabled ${e.when.isEnabled}` : ""}`,
          `How: ${e.how.length ? e.how.map((x) => `${x.label} ${x.how}${x.value ? ` (returns ${x.value})` : ""}`).join("; ") : "no function"}`,
          "What:",
          ...e.what,
        ].join("\n"),
        {
          where: `${h.m}:${h.s}`,
          who: e.who,
          when: e.when,
          how: e.how,
        },
      );
    },
  },
  {
    version: P.version,
    from: z.string().optional().describe("Older version or path."),
    to: z.string().optional().describe("Newer version or path."),
    name: z
      .string()
      .optional()
      .describe(
        "diff: keep changes whose code or enclosing strings hold this; explain: the string, command, or tool name.",
      ),
    offset: P.offset,
    limit: z.number().int().min(1).max(30).optional(),
  },
  { ...WRITES_CACHE, openWorldHint: true },
);

// ---- prompts: the steps of a task, for an agent with no plan of its own ----

const ask = (t: string) => ({
  messages: [
    { role: "user" as const, content: { type: "text" as const, text: t } },
  ],
});
server.registerPrompt(
  "release_review",
  {
    description: "Review a Claude Code release against the code that changed.",
    argsSchema: {
      from: z.string().describe("Older version."),
      to: z.string().describe("Newer version."),
    },
  },
  ({ from, to }) =>
    ask(
      [
        `Review Claude Code ${to} against ${from} with the cc-inspect tools.`,
        `1. Run \`code\` \`prepare\` for ${from} and for ${to}.`,
        `2. Run \`release\` \`diff\` with from ${from} and to ${to}, and page with \`offset\` while it gives next_offset.`,
        `3. Run \`release\` \`notes\` with version ${to} and from ${from}.`,
        "4. For each gated or unmatched line, run `code` `find` with its words, then `release` `explain` with the name you found.",
        '5. Report each line as matched, gated, or not found in the code, with `module:offset`. Call the source "the program", and state only what the code shows.',
      ].join("\n"),
    ),
);
server.registerPrompt(
  "explain_change",
  {
    description: "Explain one name of a Claude Code version from its code.",
    argsSchema: {
      name: z
        .string()
        .describe("A string, a command such as /loops, or a tool name."),
      version: z
        .string()
        .optional()
        .describe("Version; default: the current install."),
    },
  },
  ({ name, version }) =>
    ask(
      [
        `Explain "${name}" in Claude Code ${version ?? "(the current install)"} with the cc-inspect tools.`,
        `1. Run \`code\` \`find\` with query "${name}"${version ? ` and version ${version}` : ""}.`,
        `2. Run \`release\` \`explain\` with name "${name}", and \`code\` \`read\` at the offsets it gives when you need more code.`,
        '3. Report where it is, who uses it, when it runs (gates, env reads, isEnabled), and how (no-op, stub, or handled), with `module:offset`. Call the source "the program".',
      ].join("\n"),
    ),
);

await server.connect(new StdioServerTransport());
