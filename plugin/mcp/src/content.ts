// Our docs site as a model: manifest, pages, schemas. All I/O goes through fetcher.ts (cache and network).
import {
  baseUrl,
  getResource,
  MB,
  type Resource,
  type Source,
  ttl,
} from "./fetcher.ts";
import { type IndexPage, SEARCH_INDEX_MAX } from "./search.ts";

export const SITE = "https://xsyetopz.github.io/claude-code-docs";
// Override for mirrors and tests: CC_DOCS_BASE_URL (https; http only for localhost and 127.0.0.1).
export const siteBase = (): string => baseUrl("CC_DOCS_BASE_URL", SITE);

const MANIFEST_TTL_MS = 10 * 60 * 1000;
const PAGE_TTL_MS = 60 * 60 * 1000;
const INDEX_TTL_MS = 60 * 60 * 1000;
const MANIFEST_MAX = 1 * MB;
const PAGE_MAX = 2 * MB;
const SCHEMA_MAX = 1 * MB;

export type Entry = {
  route: string;
  title: string;
  description: string;
  section: string;
  md: string;
  url: string;
};

const STALE_OFFLINE_MEM_TTL_MS = 60 * 1000;

export const SCHEMA_NAMES = [
  "claude-code-settings",
  "claude-code-managed-settings",
  "claude-code-plugin-manifest",
  "claude-code-plugin-hooks",
  "claude-code-marketplace",
  "claude-code-keybindings",
  "claude-code-mcp",
  "claude-code-hook-output",
  "claude-code-tools",
  "claude-code-control-protocol",
  "claude-code-stream-json",
  "claude-code-agents-json",
  "claude-code-status-line",
  "claude-code-transcript",
  "claude-code-otel",
  "claude-code-frontmatter",
  "claude-code-claude-json",
] as const;

/** The Mod API type file the program ships; get_schema reads it with the names in TYPE_NAMES. */
export const TYPE_FILE = "claude-code.d.ts";
export const TYPE_NAMES = ["types", "claude-code", TYPE_FILE] as const;

/** Normalizes "/a/b/", "a/b.md", or a full site URL to "a/b". */
export const normalizeRoute = (input: string): string => {
  let r = input.trim();
  for (const o of new Set([siteBase(), SITE]))
    if (r === o || r.startsWith(`${o}/`)) {
      r = r.slice(o.length);
      break;
    }
  r = r.replace(/[?#].*$/, "").replace(/\.(md|html)$/, "");
  return r.replace(/^\/+|\/+$/g, "") || "index";
};

const ROUTE_RE = /^\/?[a-z0-9][a-z0-9/_-]*$/i;

/** Keeps only well-formed manifest entries. A hostile or broken manifest cannot add paths or foreign URLs. */
export const sanitizeManifest = (list: unknown, base = siteBase()): Entry[] => {
  if (!Array.isArray(list)) return [];
  const out: Entry[] = [];
  for (const raw of list as Record<string, unknown>[]) {
    if (!raw || typeof raw !== "object") continue;
    const { route, title, description, section, md, url } = raw;
    if (
      typeof route !== "string" ||
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof section !== "string" ||
      typeof url !== "string"
    )
      continue;
    const okRoute =
      route === "/" ||
      (ROUTE_RE.test(route) && !route.includes("//") && !route.includes(".."));
    if (!okRoute || !(url === base || url.startsWith(`${base}/`))) continue;
    out.push({
      route: normalizeRoute(route),
      title,
      description,
      section,
      md: typeof md === "string" ? md : "",
      url,
    });
  }
  return out;
};

const parseManifest = (text: string): Entry[] => {
  try {
    return sanitizeManifest(JSON.parse(text));
  } catch {
    return [];
  }
};

/** The prebuilt search-index.json (design D6). Undefined when the text is not an index. Pages with a missing field are dropped. */
export const parseSearchIndex = (
  text: string,
): { hash: string; pages: IndexPage[] } | undefined => {
  try {
    const j: unknown = JSON.parse(text);
    if (typeof j !== "object" || j === null) return undefined;
    const { hash, pages } = j as Record<string, unknown>;
    if (typeof hash !== "string" || !Array.isArray(pages)) return undefined;
    const out: IndexPage[] = [];
    for (const p of pages as Record<string, unknown>[]) {
      if (!p || typeof p !== "object") continue;
      const { route, title, description, headings, extra, body } = p;
      if (
        typeof route !== "string" ||
        typeof title !== "string" ||
        typeof description !== "string" ||
        !Array.isArray(headings) ||
        typeof extra !== "string" ||
        typeof body !== "string"
      )
        continue;
      out.push({
        route: normalizeRoute(route),
        title,
        description,
        headings: headings.filter((h): h is string => typeof h === "string"),
        extra,
        body,
      });
    }
    return out.length > 0 ? { hash, pages: out } : undefined;
  } catch {
    return undefined;
  }
};

/** Thrown when the site cannot be reached and nothing is cached. The message is safe to show. */
export class ContentError extends Error {}

export type PagesLoad = {
  texts: Map<string, string>;
  total: number;
  /** Pages that came from the cache because the network failed. */
  offline: number;
  /** Pages served from the cache (fresh, revalidated, or offline). */
  fromCache: number;
  oldest: string | undefined;
};

export class Content {
  private mem:
    | {
        entries: Entry[];
        byRoute: Map<string, Entry>;
        source: Source;
        at: number;
      }
    | undefined;
  private ver: string | undefined;
  private verRetryAt = 0;

  /** Bumped when the page list changes, so derived indexes can rebuild. */
  version = 0;

  /** The page list. Cheap inside the TTL. Throws ContentError if the site is unreachable and nothing is cached. */
  async manifest(): Promise<{ entries: readonly Entry[]; source: Source }> {
    const m = this.mem;
    // A stale-offline copy is retried soon, so the page list recovers when the network returns.
    const memTtl =
      m?.source.state === "stale-offline"
        ? STALE_OFFLINE_MEM_TTL_MS
        : MANIFEST_TTL_MS;
    if (m && Date.now() - m.at < ttl(memTtl))
      return {
        entries: m.entries,
        source: {
          ...m.source,
          state: m.source.state === "live" ? "cached" : m.source.state,
        },
      };
    const r = await getResource({
      url: `${siteBase()}/llms-manifest.json`,
      rel: "site/llms-manifest.json",
      ttlMs: ttl(MANIFEST_TTL_MS),
      maxBytes: MANIFEST_MAX,
      validate: (b) => parseManifest(b).length > 0,
    });
    if (r.status !== "ok") {
      if (m)
        return {
          entries: m.entries,
          source: { ...m.source, state: "stale-offline" },
        };
      throw new ContentError(
        r.status === "error"
          ? r.message
          : `the page list was not found on ${r.origin}`,
      );
    }
    const entries = parseManifest(r.body);
    const same =
      m &&
      m.entries.length === entries.length &&
      m.entries.every((e, i) => e.route === entries[i]?.route);
    if (!same) this.version++;
    this.mem = {
      entries,
      byRoute: new Map(entries.map((e) => [e.route, e])),
      source: r.source,
      at: Date.now(),
    };
    return { entries, source: r.source };
  }

  async find(input: string): Promise<Entry | undefined> {
    await this.manifest();
    return this.mem?.byRoute.get(normalizeRoute(input));
  }

  /** search-index.json: every page in one file. A 404 means the site has none, and the caller reads pages instead. */
  searchIndex(): Promise<Resource> {
    return getResource({
      url: `${siteBase()}/search-index.json`,
      rel: "site/search-index.json",
      deleteOn404: true,
      ttlMs: ttl(INDEX_TTL_MS),
      maxBytes: SEARCH_INDEX_MAX,
      validate: (b) => parseSearchIndex(b) !== undefined,
    });
  }

  /** Page text (with front matter) for an entry from the manifest. */
  readPage(e: Entry): Promise<Resource> {
    return getResource({
      url: `${siteBase()}/${e.route}.md`,
      rel: `site/pages/${e.route}.md`,
      deleteOn404: true,
      ttlMs: ttl(PAGE_TTL_MS),
      maxBytes: PAGE_MAX,
    });
  }

  /** Reads many pages (6 requests at once, cache first). Failed pages are left out. */
  async loadPages(entries: readonly Entry[]): Promise<PagesLoad> {
    const out: PagesLoad = {
      texts: new Map(),
      total: entries.length,
      offline: 0,
      fromCache: 0,
      oldest: undefined,
    };
    await Promise.all(
      entries.map(async (e) => {
        const r = await this.readPage(e);
        if (r.status !== "ok") return;
        out.texts.set(e.route, r.body);
        if (r.source.state !== "live") out.fromCache++;
        if (r.source.state === "stale-offline") out.offline++;
        if (!out.oldest || r.source.fetchedAt < out.oldest)
          out.oldest = r.source.fetchedAt;
      }),
    );
    return out;
  }

  /** Short name or full name to the schema, parsed. "unknown" for names outside SCHEMA_NAMES. */
  async schema(
    name: string,
  ): Promise<
    | "unknown"
    | { status: "ok"; schema: Record<string, unknown>; source: Source }
    | Exclude<Resource, { status: "ok" }>
  > {
    const n = name.replace(/\.json$/, "");
    const full = n.startsWith("claude-code-") ? n : `claude-code-${n}`;
    if (!(SCHEMA_NAMES as readonly string[]).includes(full)) return "unknown";
    const r = await getResource({
      url: `${siteBase()}/schemas/${full}.json`,
      rel: `site/schemas/${full}.json`,
      deleteOn404: true,
      ttlMs: ttl(PAGE_TTL_MS),
      maxBytes: SCHEMA_MAX,
      validate: (b) => {
        try {
          const j: unknown = JSON.parse(b);
          return typeof j === "object" && j !== null && !Array.isArray(j);
        } catch {
          return false;
        }
      },
    });
    if (r.status !== "ok") return r;
    const schema = JSON.parse(r.body) as Record<string, unknown>;
    // The schema title ends with "(Claude Code 2.1.305)": a second source for the version.
    this.ver ??= /\(Claude Code (\d+\.\d+\.\d+)\)/.exec(
      String(schema["title"]),
    )?.[1];
    return {
      status: "ok",
      schema,
      source: r.source,
    };
  }

  /** The Mod API type file, schemas/claude-code.d.ts, as text. */
  async typeFile(): Promise<Resource> {
    return getResource({
      url: `${siteBase()}/schemas/${TYPE_FILE}`,
      rel: `site/schemas/${TYPE_FILE}`,
      deleteOn404: true,
      ttlMs: ttl(PAGE_TTL_MS),
      maxBytes: SCHEMA_MAX,
      validate: (b) => b.includes("declare module"),
    });
  }

  /** "2.1.305" from llms.txt (line 3). Best effort: undefined when it cannot be read. Cached for the process. */
  async claudeCode(): Promise<string | undefined> {
    if (this.ver) return this.ver;
    if (Date.now() < this.verRetryAt) return undefined;
    const r = await getResource({
      url: `${siteBase()}/llms.txt`,
      rel: "site/llms.txt",
      ttlMs: ttl(MANIFEST_TTL_MS),
      maxBytes: PAGE_MAX,
    });
    if (r.status !== "ok") {
      this.verRetryAt = Date.now() + ttl(MANIFEST_TTL_MS);
      return undefined;
    }
    const head = r.body.split("\n").slice(0, 6).join("\n");
    this.ver = /Claude Code (\d+\.\d+\.\d+)/.exec(head)?.[1];
    return this.ver;
  }
}
