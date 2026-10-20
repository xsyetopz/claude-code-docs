// claude-code-docs MCP server (stdio). Read-only. No telemetry. Network only when CLAUDE_CODE_DOCS_REFRESH=1.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  Content,
  type Entry,
  normalizeRoute,
  refreshEnabled,
  SCHEMA_NAMES,
} from "./content.ts";
import { headingsOf, matchesSection, SearchIndex } from "./search.ts";

const DEFAULT_PAGE_CHARS = 20000;
const MAX_PAGE_CHARS = 40000;
const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

const content = new Content();
let index: { built: number; idx: SearchIndex } | undefined;
const searchIndex = (): SearchIndex => {
  if (index?.built !== content.version)
    index = { built: content.version, idx: new SearchIndex(content) };
  return index.idx;
};

const text = (t: string, structured?: Record<string, unknown>) => ({
  content: [{ type: "text" as const, text: t }],
  ...(structured ? { structuredContent: structured } : {}),
});
const fail = (t: string) => ({
  isError: true,
  content: [{ type: "text" as const, text: t }],
});

const server = new McpServer({ name: "claude-code-docs", version: "0.1.0" });

// ---- search_docs ----
server.registerTool(
  "search_docs",
  {
    title: "Search Claude Code docs",
    description: `Full-text search (BM25) over the Claude Code Docs for Claude Code ${content.claudeCode}: settings, environment variables, hooks, plugins, MCP, CLI flags, permissions, internals, and undocumented behavior.
Ranks pages by title, description, headings, and body. Returns the route, title, URL, and a snippet for each hit. Use read_page with a returned route to get the full text.
Tips: search exact names (CLAUDE_CODE_USE_BEDROCK, PreToolUse, apiKeyHelper) or short keyword phrases; not whole questions. Use list_pages to browse instead.
Args:
  - query (string): keywords or an exact identifier.
  - limit (number 1-25, default 8): maximum hits.
  - section (string, optional): top-level section to restrict to, as shown by list_pages (e.g. "configure" or "Start Here").
Returns: markdown list of hits; structuredContent {hits:[{route,title,url,section,score,snippet}]}.
Does not modify anything. Not for general web search.`,
    inputSchema: {
      query: z
        .string()
        .min(1)
        .max(200)
        .describe("Keywords or an identifier, e.g. 'PreToolUse timeout'"),
      limit: z
        .number()
        .int()
        .min(1)
        .max(25)
        .default(8)
        .describe("Maximum hits"),
      section: z
        .string()
        .optional()
        .describe(
          "Restrict to a top-level section such as 'configure' or 'extend'",
        ),
    },
    outputSchema: {
      hits: z.array(
        z.object({
          route: z.string(),
          title: z.string(),
          url: z.string(),
          section: z.string(),
          score: z.number(),
          snippet: z.string(),
        }),
      ),
    },
    annotations: { title: "Search Claude Code docs", ...READ_ONLY },
  },
  async ({ query, limit, section }) => {
    const hits = searchIndex()
      .search(query, limit, section)
      .map((h) => ({
        route: h.entry.route,
        title: h.entry.title,
        url: h.entry.url,
        section: h.entry.section,
        score: Math.round(h.score * 100) / 100,
        snippet: h.snippet,
      }));
    if (hits.length === 0)
      return text(
        `No pages match "${query}"${section ? ` in section "${section}"` : ""}. Try fewer or different keywords, drop the section filter, or browse with list_pages.`,
        { hits },
      );
    const md = hits
      .map(
        (h, i) =>
          `${i + 1}. **${h.title}** (route \`${h.route}\`)\n   ${h.url}\n   ${h.snippet}`,
      )
      .join("\n");
    return text(`${hits.length} hit(s) for "${query}":\n\n${md}`, { hits });
  },
);

// ---- read_page ----
const sectionOf = (md: string, heading: string): string | undefined => {
  const want = heading
    .trim()
    .toLowerCase()
    .replace(/^#+\s*/, "");
  const lines = md.split("\n");
  const h2: { at: number; title: string }[] = [];
  let fence = false;
  lines.forEach((line, at) => {
    if (/^```/.test(line)) fence = !fence;
    const m = !fence && /^##\s+(.*)$/.exec(line);
    if (m) h2.push({ at, title: (m[1] ?? "").trim().toLowerCase() });
  });
  // Exact heading first, then the first heading that contains the text.
  const i = h2.findIndex((h) => h.title === want);
  const k =
    i >= 0 ? i : h2.findIndex((h) => want.length > 2 && h.title.includes(want));
  const from = h2[k];
  if (!from) return undefined;
  const to = h2[k + 1]?.at ?? lines.length;
  return lines.slice(from.at, to).join("\n");
};

const unknownRoute = (route: string) => {
  const near = searchIndex()
    .search(route.replace(/[/_-]+/g, " "), 5)
    .map((h) => `  - ${h.entry.route}`)
    .join("\n");
  return fail(
    `No page with route "${route}". Routes look like "configure/status-line" (see list_pages).${near ? `\nClosest matches:\n${near}` : ""}`,
  );
};

server.registerTool(
  "read_page",
  {
    title: "Read a Claude Code docs page",
    description: `Read one page of the Claude Code Docs as markdown (Claude Code ${content.claudeCode}). Tables carry a Status column with badges: [Documented] (an official docs page names it), [Undocumented] (only the program shows it; may change without notice), [Differs] (official docs and program disagree), [Gated] (behind a flag or server gate).
Args:
  - route (string): page route from search_docs/list_pages, e.g. "configure/status-line". A leading slash, ".md", or the full site URL also work.
  - section_heading (string, optional): return only the H2 section with this heading (case-insensitive, e.g. "At a Glance").
  - offset (number, default 0): character offset to continue a long page; use next_offset from the previous reply.
  - max_chars (number, default ${DEFAULT_PAGE_CHARS}, max ${MAX_PAGE_CHARS}): page size in characters.
Returns: markdown text, headed by a line with the range and next_offset when more remains.
Errors: unknown route lists the closest pages; unknown heading lists the page's H2 headings.`,
    inputSchema: {
      route: z.string().min(1).describe("e.g. 'configure/status-line'"),
      section_heading: z
        .string()
        .optional()
        .describe("H2 heading to return alone, e.g. 'At a Glance'"),
      offset: z.number().int().min(0).default(0).describe("Character offset"),
      max_chars: z
        .number()
        .int()
        .min(1000)
        .max(MAX_PAGE_CHARS)
        .default(DEFAULT_PAGE_CHARS)
        .describe("Page size in characters"),
    },
    annotations: { title: "Read a Claude Code docs page", ...READ_ONLY },
  },
  async ({ route, section_heading, offset, max_chars }) => {
    const entry = content.find(route);
    if (!entry) return unknownRoute(normalizeRoute(route));
    let md = await content.read(entry);
    if (md === undefined)
      return fail(`Page "${entry.route}" has no content in this build.`);
    if (section_heading) {
      const sec = sectionOf(md, section_heading);
      if (sec === undefined) {
        const hs = headingsOf(md)
          .map((h) => `  - ${h}`)
          .join("\n");
        return fail(
          `No H2 section "${section_heading}" on "${entry.route}". Headings:\n${hs}`,
        );
      }
      md = sec;
    }
    const total = md.length;
    if (offset >= total && total > 0)
      return fail(`offset ${offset} is past the end (${total} characters).`);
    const chunk = md.slice(offset, offset + max_chars);
    const end = offset + chunk.length;
    const head = `${entry.title} | ${entry.url} | chars ${offset}-${end} of ${total}${
      end < total ? ` | more: call again with offset=${end}` : ""
    }`;
    return text(`${head}\n\n${chunk}`);
  },
);

// ---- list_pages ----
server.registerTool(
  "list_pages",
  {
    title: "List Claude Code docs pages",
    description: `List pages of the Claude Code Docs (Claude Code ${content.claudeCode}) in sidebar order, with route and title. Without \`section\`, shows every section and its pages (titles only). With \`section\`, adds each page's description.
Args:
  - section (string, optional): top-level section, e.g. "configure" or "Start Here", "reference", "how-it-works", "start".
Returns: markdown; structuredContent {pages:[{route,title,section,description}]}.
Use to discover routes for read_page. Source: ${refreshEnabled() ? "bundled snapshot, refreshed from the site when reachable" : "bundled snapshot"}.`,
    inputSchema: {
      section: z
        .string()
        .optional()
        .describe("Top-level section such as 'configure'"),
    },
    outputSchema: {
      pages: z.array(
        z.object({
          route: z.string(),
          title: z.string(),
          section: z.string(),
          description: z.string(),
        }),
      ),
    },
    annotations: { title: "List Claude Code docs pages", ...READ_ONLY },
  },
  async ({ section }) => {
    const all = content.pages();
    const list: readonly Entry[] = section
      ? all.filter((e) => matchesSection(e, section))
      : all;
    if (list.length === 0) {
      const secs = [...new Set(all.map((e) => e.section))].join(", ");
      return fail(`No pages in section "${section}". Sections: ${secs}`);
    }
    const lines: string[] = [];
    let current = "";
    for (const e of list) {
      if (e.section !== current) {
        current = e.section;
        lines.push(`\n## ${current}`);
      }
      lines.push(
        section
          ? `- \`${e.route}\`: ${e.title}. ${e.description}`
          : `- \`${e.route}\`: ${e.title}`,
      );
    }
    return text(`${list.length} page(s):${lines.join("\n")}`, {
      pages: list.map(({ route, title, section: s, description }) => ({
        route,
        title,
        section: s,
        description,
      })),
    });
  },
);

// ---- get_schema ----
type Json = Record<string, unknown>;

const isObj = (v: unknown): v is Json =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Follows a dotted path through properties, then additionalProperties (a map's values), then items ("[]" also works). */
const walk = (schema: Json, path: string): Json | undefined => {
  let cur: Json = schema;
  for (const key of path.split(".").filter(Boolean)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype")
      return undefined;
    const props = cur["properties"];
    let next: unknown;
    if (isObj(props) && Object.hasOwn(props, key)) next = props[key];
    else if (key === "[]") next = cur["items"];
    else next = cur["additionalProperties"] ?? cur["items"];
    if (!isObj(next)) return undefined;
    cur = next;
  }
  return cur;
};

server.registerTool(
  "get_schema",
  {
    title: "Get a Claude Code JSON Schema",
    description: `Get one of the six JSON Schemas generated from Claude Code ${content.claudeCode} itself: ${SCHEMA_NAMES.join(", ")}.
A short name works too ("settings", "plugin-manifest", "keybindings").
Schemas are large (up to 300k characters), so without \`property\` this returns an outline: each top-level property with its type and first description sentence. Pass \`property\` (dotted path such as "permissions" or "hooks.PreToolUse") to get that sub-schema as JSON.
Args:
  - name (string): schema name.
  - property (string, optional): top-level property or dotted path.
  - offset (number, default 0): character offset for long output.
Returns: JSON text (or outline). Errors list valid names or properties.`,
    inputSchema: {
      name: z
        .string()
        .min(1)
        .describe("e.g. 'settings' or 'claude-code-plugin-manifest'"),
      property: z
        .string()
        .optional()
        .describe("Dotted property path, e.g. 'permissions'"),
      offset: z.number().int().min(0).default(0).describe("Character offset"),
    },
    annotations: { title: "Get a Claude Code JSON Schema", ...READ_ONLY },
  },
  async ({ name, property, offset }) => {
    const schema = content.schema(name);
    if (!schema)
      return fail(
        `Unknown schema "${name}". Valid names: ${SCHEMA_NAMES.join(", ")}`,
      );
    let out: string;
    if (property) {
      const sub = walk(schema, property);
      if (!sub) {
        const props = Object.keys((schema["properties"] as Json) ?? {});
        return fail(
          `No property "${property}" in ${name}. Top-level properties: ${props.join(", ")}`,
        );
      }
      out = JSON.stringify(sub, null, 2);
    } else {
      const props = (schema["properties"] ?? {}) as Record<string, Json>;
      const rows = Object.entries(props).map(([k, v]) => {
        const type = Array.isArray(v["type"])
          ? v["type"].join("|")
          : String(v["type"] ?? (v["anyOf"] ? "union" : "any"));
        const first = String(v["description"] ?? "")
          .split(/(?<=\.)\s/)[0]
          ?.slice(0, 140);
        return `- ${k} (${type})${first ? `: ${first}` : ""}`;
      });
      out = `${String(schema["title"])}\n$id: ${String(schema["$id"])}\n${rows.length} top-level properties. Pass \`property\` for details.\n\n${rows.join("\n")}`;
    }
    const LIMIT = 25000;
    if (offset >= out.length && out.length > 0)
      return fail(
        `offset ${offset} is past the end (${out.length} characters).`,
      );
    const chunk = out.slice(offset, offset + LIMIT);
    const end = offset + chunk.length;
    const note =
      end < out.length
        ? `[chars ${offset}-${end} of ${out.length}; call again with offset=${end}]\n`
        : "";
    return text(`${note}${chunk}`);
  },
);

await server.connect(new StdioServerTransport());
