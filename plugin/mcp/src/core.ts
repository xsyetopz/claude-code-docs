// Search core shared by the MCP server (server.ts) and the CLI (cli/src/cli.ts).
// search, read, list, and schema each return { text, data, source }. They never throw for a network problem or a miss:
// the reply has ok: false and a message that is safe to show.
import {
  Content,
  ContentError,
  type Entry,
  INDEX_TTL_MS,
  normalizeRoute,
  type PagesLoad,
  parseSearchIndex,
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

export const DEFAULT_PAGE_CHARS = 20000;
export const MAX_PAGE_CHARS = 40000;
export type DocSourceName = "docs" | "platform";

export type Result = {
  ok: boolean;
  /** Markdown or plain text for a reader. Ends with a "Source:" line on success. */
  text: string;
  /** The same answer as plain data (for `--json`). */
  data: Record<string, unknown>;
  /** Where the text came from. Undefined when nothing was read. */
  source: Source | undefined;
  /** True when `data` holds everything that `text` holds, so a front end may send only `data`. */
  complete: boolean;
};

const content = new Content();
const platform = new Platform();
const PARTIAL_INDEX_TTL_MS = 60 * 1000;

const ok = (
  text: string,
  data: Record<string, unknown>,
  source: Source | undefined,
  complete = false,
): Result => ({ ok: true, text, data, source, complete });
const fail = (text: string, source?: Source): Result => ({
  ok: false,
  text,
  data: { error: text },
  source,
  complete: false,
});

/** Network problems with nothing cached become a clean failed result. */
const guarded = async (f: () => Promise<Result>): Promise<Result> => {
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

// ---- the BM25 index ----
type Built = {
  builtFor: number;
  at: number;
  idx: SearchIndex;
  source: Source;
  pages: number;
  /** Hash of llms-search-index.json. Set only when the index came from that file. */
  hash?: string;
  /** Set only when the index was built from pages. */
  load?: PagesLoad;
  /** Why pages were read instead of llms-search-index.json. */
  fallback?: string;
};
let index: Built | undefined;
let building: Promise<Built> | undefined;

const buildIndex = (): Promise<Built> => {
  building ??= (async () => {
    const builtFor = content.version;
    const { entries, source } = await content.manifest();
    const got = await content.searchIndex();
    const parsed = got.status === "ok" ? parseSearchIndex(got.body) : undefined;
    if (got.status === "ok" && parsed) {
      // The same hash is the same pages: keep the built index.
      if (index?.hash === parsed.hash && index.builtFor === builtFor) {
        index = { ...index, at: Date.now(), source: got.source };
        return index;
      }
      const byRoute = new Map(parsed.pages.map((p) => [p.route, p]));
      const have = entries.filter((e) => byRoute.has(e.route));
      const idx = new SearchIndex({
        entries: () => have,
        text: (e) => byRoute.get(e.route)?.body,
        extra: (e) => byRoute.get(e.route)?.extra,
      });
      index = {
        builtFor,
        at: Date.now(),
        idx,
        source: got.source,
        pages: have.length,
        hash: parsed.hash,
      };
      return index;
    }
    const load = await content.loadPages(entries);
    const idx = new SearchIndex({
      entries: () => entries,
      text: (e) => load.texts.get(e.route),
    });
    index = {
      builtFor,
      at: Date.now(),
      idx,
      source,
      pages: load.texts.size,
      load,
      fallback:
        got.status === "notfound"
          ? "no llms-search-index.json on the site"
          : "llms-search-index.json not available",
    };
    return index;
  })().finally(() => {
    building = undefined;
  });
  return building;
};

/** The BM25 index. Built on first use from one file (or from every page when the site has no index file). An old index is refreshed in the background. */
const searchIndex = async (): Promise<Built> => {
  await content.manifest();
  if (!index || index.builtFor !== content.version) return await buildIndex();
  // A partial index (offline, some pages missing) is retried soon.
  const partial = index.load !== undefined && index.pages < index.load.total;
  if (
    Date.now() - index.at >
    ttl(partial ? PARTIAL_INDEX_TTL_MS : INDEX_TTL_MS)
  )
    void buildIndex().catch(() => {});
  return index;
};

/** Source of a search: the state of the index file, or the worst state of the pages it used. */
const indexSource = (b: Built): Source => {
  const { load } = b;
  if (!load)
    return {
      ...b.source,
      state:
        b.source.state === "live" && Date.now() - b.at >= 60_000
          ? "cached"
          : b.source.state,
    };
  return {
    origin: b.source.origin,
    state:
      load.offline > 0
        ? "stale-offline"
        : load.fromCache < load.texts.size && Date.now() - b.at < 60_000
          ? "live"
          : "cached",
    fetchedAt: load.oldest ?? b.source.fetchedAt,
    revalidated: false,
  };
};

const indexLine = (b: Built): string => {
  const { load } = b;
  if (!load)
    return `${sourceLine(indexSource(b))}, search index of ${b.pages} pages`;
  const cover =
    b.pages < load.total ? ` (${b.pages} of ${load.total} pages)` : "";
  return `Source: ${b.source.origin}, index built from ${b.pages} pages${cover}, ${load.fromCache} from cache${load.offline > 0 ? " (offline)" : ""}; ${b.fallback}`;
};

// ---- search ----
export type SearchArgs = {
  query: string;
  source?: DocSourceName;
  limit?: number;
  /** A top-level section of the docs, or a group of the platform docs. */
  section?: string | undefined;
};

const searchPlatform = async ({
  query,
  limit = 8,
  section,
}: SearchArgs): Promise<Result> => {
  const ix = await platform.index();
  const hits = ix.search(query, limit, section).map((h) => ({
    route: h.entry.path,
    title: h.entry.title,
    url: h.entry.url,
    section: h.entry.group,
    score: Math.round(h.score * 100) / 100,
    snippet: h.snippet,
  }));
  const line = sourceLine(ix.source);
  const src = { ...sourceData(ix.source), line };
  if (hits.length === 0)
    return ok(
      `No platform pages match "${query}"${section ? ` in group "${section}"` : ""}. Try fewer or different keywords, drop the group filter, or browse the page list.\n\n${line}`,
      { query, hits, source: src },
      ix.source,
    );
  const md = hits
    .map(
      (h, i) =>
        `${i + 1}. **${h.title}** (route \`${h.route}\`)\n   ${h.url}${h.snippet ? `\n   ${h.snippet}` : ""}`,
    )
    .join("\n");
  return ok(
    `${hits.length} hit(s) for "${query}":\n\n${md}\n\n${line}`,
    { query, hits, source: src },
    ix.source,
    true,
  );
};

export const search = (args: SearchArgs): Promise<Result> =>
  guarded(async () => {
    if (args.source === "platform") return await searchPlatform(args);
    const { query, limit = 8, section } = args;
    const b = await searchIndex();
    const hits = b.idx.search(query, limit, section).map((h) => ({
      route: h.entry.route,
      title: h.entry.title,
      url: h.entry.url,
      section: h.entry.section,
      score: Math.round(h.score * 100) / 100,
      snippet: h.snippet,
    }));
    const head = await heading();
    const line = indexLine(b);
    const src = indexSource(b);
    const version = await content.claudeCode();
    const data = {
      ...(version ? { claudeCode: version } : {}),
      query,
      hits,
      source: { ...sourceData(src), line },
    };
    if (hits.length === 0)
      return ok(
        `${head}No pages match "${query}"${section ? ` in section "${section}"` : ""}. Try fewer or different keywords, drop the section filter, or browse the page list.\n\n${line}`,
        data,
        src,
      );
    const md = hits
      .map(
        (h, i) =>
          `${i + 1}. **${h.title}** (route \`${h.route}\`)\n   ${h.url}\n   ${h.snippet}`,
      )
      .join("\n");
    return ok(
      `${head}${hits.length} hit(s) for "${query}":\n\n${md}\n\n${line}`,
      data,
      src,
      true,
    );
  });

// ---- read ----
export type ReadArgs = {
  /** A docs route, or a platform path. */
  route: string;
  source?: DocSourceName;
  /** Return only the H2 section with this heading. */
  heading?: string | undefined;
  offset?: number;
  maxChars?: number;
};

const sectionOf = (md: string, want0: string): string | undefined => {
  const want = want0
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

/** One chunk of a page: a header line with the range, the text, and the Source line. */
const pageResult = (
  info: { route: string; title: string; url: string },
  md0: string,
  heading: string | undefined,
  offset: number,
  maxChars: number,
  source: Source,
): Result => {
  let md = md0;
  if (heading) {
    const sec = sectionOf(md, heading);
    if (sec === undefined) {
      const hs = headingsOf(md)
        .map((h) => `  - ${h}`)
        .join("\n");
      return fail(
        `No H2 section "${heading}" on "${info.route}". Headings:\n${hs}`,
        source,
      );
    }
    md = sec;
  }
  const total = md.length;
  if (offset >= total && total > 0)
    return fail(
      `offset ${offset} is past the end (${total} characters).`,
      source,
    );
  const chunk = md.slice(offset, offset + maxChars);
  const end = offset + chunk.length;
  const head = `${info.title} | ${info.url} | chars ${offset}-${end} of ${total}${
    end < total ? ` | more: call again with offset=${end}` : ""
  }`;
  return ok(
    `${head}\n\n${chunk}\n\n${sourceLine(source)}`,
    {
      ...info,
      offset,
      end,
      total,
      ...(end < total ? { nextOffset: end } : {}),
      text: chunk,
      source: sourceData(source),
    },
    source,
  );
};

const readPlatform = async ({
  route: input,
  heading,
  offset = 0,
  maxChars = DEFAULT_PAGE_CHARS,
}: ReadArgs): Promise<Result> => {
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
  return pageResult(
    { route: path, title, url },
    r.body,
    heading,
    offset,
    maxChars,
    r.source,
  );
};

export const read = (args: ReadArgs): Promise<Result> =>
  guarded(async () => {
    if (args.source === "platform") return await readPlatform(args);
    const { route, heading, offset = 0, maxChars = DEFAULT_PAGE_CHARS } = args;
    const entry = await content.find(route);
    if (!entry)
      return fail(
        `No page with route "${normalizeRoute(route)}". Routes look like "configure/status-line" (list the pages to see them).${nearList(normalizeRoute(route), (await content.manifest()).entries)}`,
      );
    const r = await content.readPage(entry);
    if (r.status === "notfound")
      return fail(
        `Page "${entry.route}" is listed but no longer exists on ${r.origin}; any cached copy was removed.${nearList(entry.route, (await content.manifest()).entries)}`,
      );
    if (r.status === "error") return fail(r.message);
    return pageResult(
      { route: entry.route, title: entry.title, url: entry.url },
      r.body,
      heading,
      offset,
      maxChars,
      r.source,
    );
  });

// ---- list ----
export type ListArgs = {
  source?: DocSourceName;
  /** A top-level section of the docs, or a group of the platform docs. */
  section?: string | undefined;
};

const listPlatform = async ({ section }: ListArgs): Promise<Result> => {
  const { entries, source } = await platform.index();
  const line = sourceLine(source);
  const src = sourceData(source);
  const groups = new Map<string, number>();
  for (const e of entries) groups.set(e.group, (groups.get(e.group) ?? 0) + 1);
  if (!section) {
    const rows = [...groups].map(([g, n]) => `- ${g || "(none)"}: ${n}`);
    return ok(
      `${entries.length} page(s) in ${groups.size} group(s). Pass a group to list its pages:\n\n${rows.join("\n")}\n\n${line}`,
      {
        groups: [...groups].map(([group, count]) => ({ group, count })),
        source: src,
      },
      source,
      true,
    );
  }
  const want = section.trim().toLowerCase();
  const list = entries.filter((e) => e.group.toLowerCase() === want);
  if (list.length === 0)
    return fail(
      `No group "${section}". Groups: ${[...groups.keys()].join(", ")}`,
    );
  const rows = list.map(
    (e) =>
      `- \`${e.path}\`: ${e.title}${e.description ? `. ${e.description}` : ""}`,
  );
  return ok(
    `${list.length} page(s) in "${list[0]?.group}":\n\n${rows.join("\n")}\n\n${line}`,
    {
      pages: list.map(({ path, title, group, description }) => ({
        route: path,
        title,
        section: group,
        description,
      })),
      source: src,
    },
    source,
    true,
  );
};

export const list = (args: ListArgs = {}): Promise<Result> =>
  guarded(async () => {
    if (args.source === "platform") return await listPlatform(args);
    const { section } = args;
    const { entries: all, source } = await content.manifest();
    const pages: readonly Entry[] = section
      ? all.filter((e) => matchesSection(e, section))
      : all;
    if (pages.length === 0) {
      const secs = [...new Set(all.map((e) => e.section))].join(", ");
      return fail(`No pages in section "${section}". Sections: ${secs}`);
    }
    const lines: string[] = [];
    let current = "";
    for (const e of pages) {
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
    const version = await content.claudeCode();
    return ok(
      `${await heading()}${pages.length} page(s):${lines.join("\n")}\n\n${sourceLine(source)}`,
      {
        ...(version ? { claudeCode: version } : {}),
        pages: pages.map(({ route, title, section: s, description }) => ({
          route,
          title,
          section: s,
          ...(section ? { description } : {}),
        })),
        source: sourceData(source),
      },
      source,
      true,
    );
  });

// ---- schema ----
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

/** One 25k-character chunk of `out`, with a note that gives the next offset. */
const schemaPage = (
  name: string,
  property: string | undefined,
  out: string,
  offset: number,
  source: Source,
): Result => {
  const LIMIT = 25000;
  if (offset >= out.length && out.length > 0)
    return fail(
      `offset ${offset} is past the end (${out.length} characters).`,
      source,
    );
  const chunk = out.slice(offset, offset + LIMIT);
  const end = offset + chunk.length;
  const note =
    end < out.length
      ? `[chars ${offset}-${end} of ${out.length}; call again with offset=${end}]\n`
      : "";
  return ok(
    `${note}${chunk}\n\n${sourceLine(source)}`,
    {
      name,
      ...(property ? { property } : {}),
      offset,
      end,
      total: out.length,
      ...(end < out.length ? { nextOffset: end } : {}),
      text: chunk,
      source: sourceData(source),
    },
    source,
  );
};

export type SchemaArgs = {
  name: string;
  property?: string | undefined;
  offset?: number;
};

export const schema = (args: SchemaArgs): Promise<Result> =>
  guarded(async () => {
    const { name, property, offset = 0 } = args;
    if ((TYPE_NAMES as readonly string[]).includes(name)) {
      const got = await content.typeFile();
      if (got.status === "notfound")
        return fail(`The type file was not found on ${got.origin}.`);
      if (got.status === "error") return fail(got.message);
      if (!property)
        return schemaPage(
          name,
          property,
          outline(got.body),
          offset,
          got.source,
        );
      const found = lookup(got.body, property);
      if (found.kind === "missing")
        return fail(
          `"${property}" is not in the type file, so its fields are unconfirmed for this release.${found.near.length ? ` Closest names in the file: ${found.near.join(", ")}. Look one of them up.` : " Call without `property` for the list of names."}`,
          got.source,
        );
      return schemaPage(
        name,
        property,
        `// ${found.title}\n${found.text}`,
        offset,
        got.source,
      );
    }
    const got = await content.schema(name);
    if (got === "unknown")
      return fail(
        `Unknown schema "${name}". Valid names: ${SCHEMA_NAMES.join(", ")}, types`,
      );
    if (got.status === "notfound")
      return fail(`Schema "${name}" was not found on ${got.origin}.`);
    if (got.status === "error") return fail(got.message);
    const { schema: sch, source } = got;
    let out: string;
    if (property) {
      const sub = walk(sch, property);
      if (!sub) {
        const keys = [
          ...Object.keys((sch["properties"] as Json) ?? {}),
          ...Object.keys((sch["$defs"] as Json) ?? {}),
        ];
        return fail(
          `"${property}" is not in ${name}, so its fields are unconfirmed for this release. Its top-level properties and definitions: ${keys.join(", ")}. Look one of them up.`,
          source,
        );
      }
      out = JSON.stringify(sub, null, 2);
    } else {
      const props = (sch["properties"] ?? {}) as Record<string, Json>;
      const rows = Object.entries(props).map(([k, v]) => {
        const type = Array.isArray(v["type"])
          ? v["type"].join("|")
          : String(v["type"] ?? (v["anyOf"] ? "union" : "any"));
        const first = String(v["description"] ?? "")
          .split(/(?<=\.)\s/)[0]
          ?.slice(0, 140);
        return `- ${k} (${type})${first ? `: ${first}` : ""}`;
      });
      const defs = Object.keys((sch["$defs"] as Json) ?? {});
      const defList = defs.length
        ? `\n\n${defs.length} definitions (pass one as \`property\`): ${defs.join(", ")}`
        : "";
      out = `${String(sch["title"])}\n$id: ${String(sch["$id"])}\n${rows.length} top-level properties. Pass \`property\` for details.\n\n${rows.join("\n")}${defList}`;
    }
    return schemaPage(name, property, out, offset, source);
  });
