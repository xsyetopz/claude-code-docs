// claude-code-docs MCP server (stdio). Read-only. No telemetry.
// Reads the published docs site live (fetcher.ts) and caches every fetch on disk (cache.ts) for offline use.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import pkg from "../package.json" with { type: "json" };
import {
  Content,
  ContentError,
  type Entry,
  normalizeRoute,
  type PagesLoad,
  SCHEMA_NAMES,
  TYPE_NAMES,
} from "./content.ts";
import { type Source, sourceData, sourceLine, ttl } from "./fetcher.ts";
import {
  nearPlatform,
  normalizePlatformPath,
  Platform,
  platformBase,
} from "./platform.ts";
import { headingsOf, matchesSection, SearchIndex, tokenize } from "./search.ts";
import { lookup, outline } from "./types.ts";

const DEFAULT_PAGE_CHARS = 20000;
const MAX_PAGE_CHARS = 40000;
const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
} as const;

const content = new Content();
const INDEX_TTL_MS = 60 * 60 * 1000;
const PARTIAL_INDEX_TTL_MS = 60 * 1000;

type Built = {
  built: number;
  at: number;
  idx: SearchIndex;
  load: PagesLoad;
  source: Source;
};
let index: Built | undefined;
let building: Promise<Built> | undefined;

const buildIndex = (): Promise<Built> => {
  building ??= (async () => {
    const built = content.version;
    const { entries, source } = await content.manifest();
    const load = await content.loadPages(entries);
    const idx = new SearchIndex({
      entries: () => entries,
      text: (e) => load.texts.get(e.route),
    });
    index = { built, at: Date.now(), idx, load, source };
    return index;
  })().finally(() => {
    building = undefined;
  });
  return building;
};

/** The BM25 index. Built on first use (one fetch per page, cached). An old index is rebuilt in the background. */
const searchIndex = async (): Promise<Built> => {
  await content.manifest();
  if (!index || index.built !== content.version) return await buildIndex();
  // A partial index (offline, some pages missing) is retried soon.
  const partial = index.load.texts.size < index.load.total;
  if (
    Date.now() - index.at >
    ttl(partial ? PARTIAL_INDEX_TTL_MS : INDEX_TTL_MS)
  )
    void buildIndex().catch(() => {});
  return index;
};

/** Source of a search: the worst state of the pages it used. */
const indexSource = (b: Built): Source => ({
  origin: b.source.origin,
  state:
    b.load.offline > 0
      ? "stale-offline"
      : b.load.fromCache < b.load.texts.size && Date.now() - b.at < 60_000
        ? "live"
        : "cached",
  fetchedAt: b.load.oldest ?? b.source.fetchedAt,
  revalidated: false,
});

const indexLine = (b: Built): string => {
  const n = b.load.texts.size;
  const cover = n < b.load.total ? ` (${n} of ${b.load.total} pages)` : "";
  return `Source: ${b.source.origin}, index built from ${n} pages${cover}, ${b.load.fromCache} from cache${b.load.offline > 0 ? " (offline)" : ""}`;
};

const sourceSchema = z.object({
  origin: z.string(),
  state: z.enum(["live", "cached", "stale-offline"]),
  fetchedAt: z.string(),
});

const text = (t: string, structured?: Record<string, unknown>) => ({
  content: [{ type: "text" as const, text: t }],
  ...(structured ? { structuredContent: structured } : {}),
});
const fail = (t: string) => ({
  isError: true,
  content: [{ type: "text" as const, text: t }],
});

type ToolResult = ReturnType<typeof text> | ReturnType<typeof fail>;
/** Network problems with nothing cached become a clean tool error. */
const guarded = async (f: () => Promise<ToolResult>): Promise<ToolResult> => {
  try {
    return await f();
  } catch (e) {
    if (e instanceof ContentError) return fail(e.message);
    throw e;
  }
};

const heading = async (): Promise<string> => {
  const v = await content.claudeCode();
  return v ? `Claude Code Docs (Claude Code ${v})\n\n` : "";
};

const server = new McpServer({
  name: "claude-code-docs",
  version: pkg.version,
});

// ---- search_docs ----
server.registerTool(
  "search_docs",
  {
    title: "Search Claude Code docs",
    description: `Full-text search (BM25) over the live Claude Code Docs: settings, environment variables, hooks, plugins, MCP, CLI flags, permissions, internals, and undocumented behavior.
Ranks pages by title, description, headings, and body. Returns the route, title, URL, and a snippet for each hit. Use read_page with a returned route to get the full text.
Tips: search exact names (CLAUDE_CODE_USE_BEDROCK, PreToolUse, apiKeyHelper) or short keyword phrases; not whole questions. Use list_pages to browse instead.
Args:
  - query (string): keywords or an exact identifier.
  - limit (number 1-25, default 8): maximum hits.
  - section (string, optional): top-level section to restrict to, as shown by list_pages (e.g. "configure" or "Start Here").
Returns: markdown list of hits and a final "Source:" line; structuredContent {hits:[{route,title,url,section,score,snippet}], source:{origin,state,fetchedAt}}. The first search fetches every page once (cached after that); offline it uses the last cached copies.
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
      source: sourceSchema,
    },
    annotations: { title: "Search Claude Code docs", ...READ_ONLY },
  },
  ({ query, limit, section }) =>
    guarded(async () => {
      const b = await searchIndex();
      const src = sourceData(indexSource(b));
      const hits = b.idx.search(query, limit, section).map((h) => ({
        route: h.entry.route,
        title: h.entry.title,
        url: h.entry.url,
        section: h.entry.section,
        score: Math.round(h.score * 100) / 100,
        snippet: h.snippet,
      }));
      const head = await heading();
      if (hits.length === 0)
        return text(
          `${head}No pages match "${query}"${section ? ` in section "${section}"` : ""}. Try fewer or different keywords, drop the section filter, or browse with list_pages.\n\n${indexLine(b)}`,
          { hits, source: src },
        );
      const md = hits
        .map(
          (h, i) =>
            `${i + 1}. **${h.title}** (route \`${h.route}\`)\n   ${h.url}\n   ${h.snippet}`,
        )
        .join("\n");
      return text(
        `${head}${hits.length} hit(s) for "${query}":\n\n${md}\n\n${indexLine(b)}`,
        { hits, source: src },
      );
    }),
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

const nearList = (route: string, entries: readonly Entry[]): string => {
  const want = new Set(tokenize(route.replace(/[/_-]+/g, " ")));
  const near = entries
    .map((e) => ({
      e,
      n: tokenize(`${e.route.replace(/[/_-]+/g, " ")} ${e.title}`).filter((t) =>
        want.has(t),
      ).length,
    }))
    .filter((x) => x.n > 0 && x.e.route !== route)
    .sort((a, b) => b.n - a.n)
    .slice(0, 5)
    .map((x) => `  - ${x.e.route}`)
    .join("\n");
  return near ? `\nClosest matches:\n${near}` : "";
};

const unknownRoute = (route: string, entries: readonly Entry[]) =>
  fail(
    `No page with route "${route}". Routes look like "configure/status-line" (see list_pages).${nearList(route, entries)}`,
  );

server.registerTool(
  "read_page",
  {
    title: "Read a Claude Code docs page",
    description: `Read one page of the live Claude Code Docs as markdown. Tables carry a Status column with badges: [Documented] (an official docs page names it), [Undocumented] (only the program shows it; may change without notice), [Differs] (official docs and program disagree), [Gated] (behind a flag or server gate).
Args:
  - route (string): page route from search_docs/list_pages, e.g. "configure/status-line". A leading slash, ".md", or the full site URL also work.
  - section_heading (string, optional): return only the H2 section with this heading (case-insensitive, e.g. "At a Glance").
  - offset (number, default 0): character offset to continue a long page; use next_offset from the previous reply.
  - max_chars (number, default ${DEFAULT_PAGE_CHARS}, max ${MAX_PAGE_CHARS}): page size in characters.
Returns: markdown text, headed by a line with the range and next_offset when more remains, ending with a "Source:" line (live, or cache when offline); structuredContent {source:{origin,state,fetchedAt}}.
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
    outputSchema: { source: sourceSchema },
    annotations: { title: "Read a Claude Code docs page", ...READ_ONLY },
  },
  ({ route, section_heading, offset, max_chars }) =>
    guarded(async () => {
      const entry = await content.find(route);
      if (!entry)
        return unknownRoute(
          normalizeRoute(route),
          (await content.manifest()).entries,
        );
      const r = await content.readPage(entry);
      if (r.status === "notfound")
        return fail(
          `Page "${entry.route}" is listed but no longer exists on ${r.origin}; any cached copy was removed.${nearList(entry.route, (await content.manifest()).entries)}`,
        );
      if (r.status === "error") return fail(r.message);
      let md = r.body;
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
      return text(`${head}\n\n${chunk}\n\n${sourceLine(r.source)}`, {
        source: sourceData(r.source),
      });
    }),
);

// ---- list_pages ----
server.registerTool(
  "list_pages",
  {
    title: "List Claude Code docs pages",
    description: `List pages of the live Claude Code Docs in sidebar order, with route and title. Without \`section\`, shows every section and its pages (titles only). With \`section\`, adds each page's description.
Args:
  - section (string, optional): top-level section, e.g. "configure" or "Start Here", "reference", "how-it-works", "start".
Returns: markdown ending with a "Source:" line; structuredContent {pages:[{route,title,section,description}], source:{origin,state,fetchedAt}}.
Use to discover routes for read_page. Reads the site's page list (cached for offline use).`,
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
      source: sourceSchema,
    },
    annotations: { title: "List Claude Code docs pages", ...READ_ONLY },
  },
  ({ section }) =>
    guarded(async () => {
      const { entries: all, source } = await content.manifest();
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
      return text(
        `${await heading()}${list.length} page(s):${lines.join("\n")}\n\n${sourceLine(source)}`,
        {
          pages: list.map(({ route, title, section: s, description }) => ({
            route,
            title,
            section: s,
            description,
          })),
          source: sourceData(source),
        },
      );
    }),
);

// ---- get_schema ----
type Json = Record<string, unknown>;

const isObj = (v: unknown): v is Json =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Follows a dotted path from a $defs name or the root through properties, then additionalProperties (a map's values), then items ("[]" also works). */
const walk = (schema: Json, path: string): Json | undefined => {
  let cur: Json = schema;
  const keys = path.split(".").filter(Boolean);
  // A file made of definitions (tools, control protocol): the first key may name one.
  const defs = schema["$defs"];
  if (isObj(defs) && keys[0] && Object.hasOwn(defs, keys[0])) {
    const def = defs[keys.shift() as string];
    if (!isObj(def)) return undefined;
    cur = def;
  }
  for (const key of keys) {
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
    description: `Get the exact fields of a Claude Code payload, from files generated from the program itself (fetched live from the docs site). Look a field up here before you state it, and name only the fields it returns.
- JSON Schemas: ${SCHEMA_NAMES.join(", ")}. A short name works too ("settings", "tools", "hook-output", "status-line"). Without \`property\` this returns an outline: each top-level property with its type and first description sentence, then the names in $defs. Pass \`property\` (dotted path such as "permissions" or "hooks.PreToolUse", or a definition such as "BashInput" or "BashInput.command") to get that sub-schema as JSON.
- "types": the Mod API type file the program ships (claude-code.d.ts): every \`$\` call, event, and their types, with doc comments (not the built-in tool fields). Without \`property\` this returns the declared names. Pass \`property\` as a type name ("ToolCheckResult"), a member path ("ToolCheckResult.plugin"), a call ("$.tool.check"), or an event name ("tool.check", which returns its entries in the event maps).
Args:
  - name (string): schema name, or "types".
  - property (string, optional): property path, or for "types" a name, member path, call, or event.
  - offset (number, default 0): character offset for long output.
Returns: JSON text (or outline) ending with a "Source:" line; structuredContent {source:{origin,state,fetchedAt}}. Errors list valid names or properties.`,
    inputSchema: {
      name: z
        .string()
        .min(1)
        .describe("e.g. 'settings', 'claude-code-plugin-manifest', or 'types'"),
      property: z
        .string()
        .optional()
        .describe(
          "Dotted property path, e.g. 'permissions'; for 'types': 'ToolCheckResult', '$.tool.check', or 'tool.check'",
        ),
      offset: z.number().int().min(0).default(0).describe("Character offset"),
    },
    outputSchema: { source: sourceSchema },
    annotations: { title: "Get a Claude Code JSON Schema", ...READ_ONLY },
  },
  ({ name, property, offset }) =>
    guarded(async () => {
      if ((TYPE_NAMES as readonly string[]).includes(name)) {
        const got = await content.typeFile();
        if (got.status === "notfound")
          return fail(`The type file was not found on ${got.origin}.`);
        if (got.status === "error") return fail(got.message);
        if (!property) return page(outline(got.body), offset, got.source);
        const found = lookup(got.body, property);
        if (found.kind === "missing")
          return fail(
            `"${property}" is not in the type file, so its fields are unconfirmed for this release.${found.near.length ? ` Closest names in the file: ${found.near.join(", ")}. Look one of them up.` : " Call without `property` for the list of names."}`,
          );
        return page(`// ${found.title}\n${found.text}`, offset, got.source);
      }
      const got = await content.schema(name);
      if (got === "unknown")
        return fail(
          `Unknown schema "${name}". Valid names: ${SCHEMA_NAMES.join(", ")}, types`,
        );
      if (got.status === "notfound")
        return fail(`Schema "${name}" was not found on ${got.origin}.`);
      if (got.status === "error") return fail(got.message);
      const { schema, source } = got;
      let out: string;
      if (property) {
        const sub = walk(schema, property);
        if (!sub) {
          const keys = [
            ...Object.keys((schema["properties"] as Json) ?? {}),
            ...Object.keys((schema["$defs"] as Json) ?? {}),
          ];
          return fail(
            `"${property}" is not in ${name}, so its fields are unconfirmed for this release. Its top-level properties and definitions: ${keys.join(", ")}. Look one of them up.`,
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
        const defs = Object.keys((schema["$defs"] as Json) ?? {});
        const defList = defs.length
          ? `\n\n${defs.length} definitions (pass one as \`property\`): ${defs.join(", ")}`
          : "";
        out = `${String(schema["title"])}\n$id: ${String(schema["$id"])}\n${rows.length} top-level properties. Pass \`property\` for details.\n\n${rows.join("\n")}${defList}`;
      }
      return page(out, offset, source);
    }),
);

/** One 25k-character chunk of `out`, with a note that gives the next offset. */
const page = (out: string, offset: number, source: Source) => {
  const LIMIT = 25000;
  if (offset >= out.length && out.length > 0)
    return fail(`offset ${offset} is past the end (${out.length} characters).`);
  const chunk = out.slice(offset, offset + LIMIT);
  const end = offset + chunk.length;
  const note =
    end < out.length
      ? `[chars ${offset}-${end} of ${out.length}; call again with offset=${end}]\n`
      : "";
  return text(`${note}${chunk}\n\n${sourceLine(source)}`, {
    source: sourceData(source),
  });
};

// ---- platform.claude.com tools ----
const platform = new Platform();

server.registerTool(
  "search_platform_docs",
  {
    title: "Search Claude API and platform docs",
    description: `Search the Claude API and platform docs (platform.claude.com/docs/en): Messages API, models, pricing, tool use, prompt caching, Agent SDK, and client SDKs. Not for Claude Code itself; use search_docs for that.
Search finds pages by title, summary, URL path, and group (BM25 over llms.txt). It does not search page text; use read_platform_page for the text.
Args:
  - query (string): keywords, e.g. "prompt caching".
  - limit (number 1-25, default 8): maximum hits.
  - group (string, optional): a llms.txt group such as "Messages", as shown by list_platform_pages.
Returns: markdown list ending with a "Source:" line; structuredContent {hits:[{path,title,url,group,score,snippet}], source:{origin,state,fetchedAt}}.`,
    inputSchema: {
      query: z
        .string()
        .min(1)
        .max(200)
        .describe("Keywords, e.g. 'prompt caching'"),
      limit: z
        .number()
        .int()
        .min(1)
        .max(25)
        .default(8)
        .describe("Maximum hits"),
      group: z.string().optional().describe("llms.txt group, e.g. 'Messages'"),
    },
    outputSchema: {
      hits: z.array(
        z.object({
          path: z.string(),
          title: z.string(),
          url: z.string(),
          group: z.string(),
          score: z.number(),
          snippet: z.string(),
        }),
      ),
      source: sourceSchema,
    },
    annotations: { title: "Search Claude API and platform docs", ...READ_ONLY },
  },
  ({ query, limit, group }) =>
    guarded(async () => {
      const ix = await platform.index();
      const hits = ix.search(query, limit, group).map((h) => ({
        path: h.entry.path,
        title: h.entry.title,
        url: h.entry.url,
        group: h.entry.group,
        score: Math.round(h.score * 100) / 100,
        snippet: h.snippet,
      }));
      const src = sourceData(ix.source);
      const line = sourceLine(ix.source);
      if (hits.length === 0)
        return text(
          `No platform pages match "${query}"${group ? ` in group "${group}"` : ""}. Try fewer or different keywords, drop the group filter, or browse with list_platform_pages.\n\n${line}`,
          { hits, source: src },
        );
      const md = hits
        .map(
          (h, i) =>
            `${i + 1}. **${h.title}** (path \`${h.path}\`)\n   ${h.url}${h.snippet ? `\n   ${h.snippet}` : ""}`,
        )
        .join("\n");
      return text(`${hits.length} hit(s) for "${query}":\n\n${md}\n\n${line}`, {
        hits,
        source: src,
      });
    }),
);

server.registerTool(
  "read_platform_page",
  {
    title: "Read a Claude API and platform docs page",
    description: `Read one English page of the Claude API and platform docs as markdown. Pages can contain JSX tags (for example <HomePage>); they are returned as is.
Args:
  - path (string): page path from search_platform_docs/list_platform_pages, e.g. "build-with-claude/overview". "/docs/en/<path>", ".md", or the full platform.claude.com URL also work. Only English pages under /docs/en/ are read.
  - section_heading (string, optional): return only the H2 section with this heading (case-insensitive).
  - offset (number, default 0): character offset to continue a long page; use next offset from the previous reply.
  - max_chars (number, default ${DEFAULT_PAGE_CHARS}, max ${MAX_PAGE_CHARS}): page size in characters.
Returns: markdown text, headed by a line with the range, ending with a "Source:" line; structuredContent {source:{origin,state,fetchedAt}}.
Errors: invalid path is rejected; unknown page lists the closest pages.`,
    inputSchema: {
      path: z.string().min(1).describe("e.g. 'build-with-claude/overview'"),
      section_heading: z
        .string()
        .optional()
        .describe("H2 heading to return alone"),
      offset: z.number().int().min(0).default(0).describe("Character offset"),
      max_chars: z
        .number()
        .int()
        .min(1000)
        .max(MAX_PAGE_CHARS)
        .default(DEFAULT_PAGE_CHARS)
        .describe("Page size in characters"),
    },
    outputSchema: { source: sourceSchema },
    annotations: {
      title: "Read a Claude API and platform docs page",
      ...READ_ONLY,
    },
  },
  ({ path: input, section_heading, offset, max_chars }) =>
    guarded(async () => {
      const path = normalizePlatformPath(input);
      if (!path)
        return fail(
          `Invalid path "${input}". Use a path under docs/en/ such as "build-with-claude/overview" (letters, digits, "-", "_" and "/" only; English pages on ${platformBase()} only).`,
        );
      const r = await platform.readPage(path);
      if (r.status === "notfound") {
        const near = await platform
          .index()
          .then((ix) => nearPlatform(path, ix.entries))
          .catch(() => "");
        return fail(
          `No platform page "${path}" on ${r.origin}; any cached copy was removed.${near}`,
        );
      }
      if (r.status === "error") return fail(r.message);
      const known = platform.known()?.find((e) => e.path === path);
      const title =
        known?.title ??
        /^title:\s*(.+)$/m.exec(r.body.slice(0, 1000))?.[1]?.trim() ??
        path;
      const url = `${platformBase()}/docs/en/${path}`;
      let md = r.body;
      if (section_heading) {
        const sec = sectionOf(md, section_heading);
        if (sec === undefined) {
          const hs = headingsOf(md)
            .map((h) => `  - ${h}`)
            .join("\n");
          return fail(
            `No H2 section "${section_heading}" on "${path}". Headings:\n${hs}`,
          );
        }
        md = sec;
      }
      const total = md.length;
      if (offset >= total && total > 0)
        return fail(`offset ${offset} is past the end (${total} characters).`);
      const chunk = md.slice(offset, offset + max_chars);
      const end = offset + chunk.length;
      const head = `${title} | ${url} | chars ${offset}-${end} of ${total}${
        end < total ? ` | more: call again with offset=${end}` : ""
      }`;
      return text(`${head}\n\n${chunk}\n\n${sourceLine(r.source)}`, {
        source: sourceData(r.source),
      });
    }),
);

server.registerTool(
  "list_platform_pages",
  {
    title: "List Claude API and platform docs pages",
    description: `List English pages of the Claude API and platform docs (from llms.txt). Without \`group\`, shows each group with its page count. With \`group\`, lists "path: title. description" for that group.
Args:
  - group (string, optional): a group name as shown without the argument, e.g. "Messages".
Returns: markdown ending with a "Source:" line; structuredContent {groups:[{group,count}]} without \`group\`, or {pages:[{path,title,group,description}]} with it; both include source:{origin,state,fetchedAt}.
Use to discover paths for read_platform_page.`,
    inputSchema: {
      group: z.string().optional().describe("Group name, e.g. 'Messages'"),
    },
    outputSchema: {
      groups: z
        .array(z.object({ group: z.string(), count: z.number() }))
        .optional(),
      pages: z
        .array(
          z.object({
            path: z.string(),
            title: z.string(),
            group: z.string(),
            description: z.string(),
          }),
        )
        .optional(),
      source: sourceSchema,
    },
    annotations: {
      title: "List Claude API and platform docs pages",
      ...READ_ONLY,
    },
  },
  ({ group }) =>
    guarded(async () => {
      const { entries, source } = await platform.index();
      const line = sourceLine(source);
      const src = sourceData(source);
      const groups = new Map<string, number>();
      for (const e of entries)
        groups.set(e.group, (groups.get(e.group) ?? 0) + 1);
      if (!group) {
        const rows = [...groups].map(([g, n]) => `- ${g || "(none)"}: ${n}`);
        return text(
          `${entries.length} page(s) in ${groups.size} group(s). Pass \`group\` to list pages:\n\n${rows.join("\n")}\n\n${line}`,
          {
            groups: [...groups].map(([g, count]) => ({ group: g, count })),
            source: src,
          },
        );
      }
      const want = group.trim().toLowerCase();
      const list = entries.filter((e) => e.group.toLowerCase() === want);
      if (list.length === 0)
        return fail(
          `No group "${group}". Groups: ${[...groups.keys()].join(", ")}`,
        );
      const rows = list.map(
        (e) =>
          `- \`${e.path}\`: ${e.title}${e.description ? `. ${e.description}` : ""}`,
      );
      return text(
        `${list.length} page(s) in "${list[0]?.group}":\n\n${rows.join("\n")}\n\n${line}`,
        {
          pages: list.map(({ path, title, group: g, description }) => ({
            path,
            title,
            group: g,
            description,
          })),
          source: src,
        },
      );
    }),
);

await server.connect(new StdioServerTransport());
