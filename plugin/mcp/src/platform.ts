// platform.claude.com docs as a model: the llms.txt index and the English pages. All I/O goes through fetcher.ts.
import { ContentError, type Entry } from "./content.ts";
import {
  baseUrl,
  getResource,
  MB,
  type Resource,
  type Source,
  ttl,
} from "./fetcher.ts";
import { SearchIndex, tokenize } from "./search.ts";

export const PLATFORM = "https://platform.claude.com";
// Override for mirrors and tests: PLATFORM_DOCS_BASE_URL (https; http only for localhost and 127.0.0.1).
export const platformBase = (): string =>
  baseUrl("PLATFORM_DOCS_BASE_URL", PLATFORM);

const INDEX_TTL_MS = 10 * 60 * 1000;
const PAGE_TTL_MS = 6 * 60 * 60 * 1000;
const FILE_MAX = 2 * MB;

/** A page from llms.txt. `path` is the part after /docs/en/, e.g. "build-with-claude/overview". */
export type PlatformEntry = {
  path: string;
  title: string;
  description: string;
  group: string;
  url: string;
};

const PATH_RE = /^[a-z0-9][a-z0-9/_-]*$/;

/**
 * Normalizes input to a path under /docs/en/, or undefined when the rules reject it.
 * Accepts "a/b", "/docs/en/a/b", "a/b.md", and the full URL on the configured platform host.
 * Rejects "..", other languages (docs/de/...), other hosts, and anything outside [a-z0-9/_-].
 */
export const normalizePlatformPath = (input: string): string | undefined => {
  let r = input.trim();
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(r) || r.startsWith("//")) {
    const hosts = new Set([platformBase(), PLATFORM]);
    const o = [...hosts].find((h) => r === h || r.startsWith(`${h}/`));
    if (!o) return undefined;
    r = r.slice(o.length);
  }
  r = r.replace(/[?#].*$/, "").replace(/\.md$/, "");
  r = r.replace(/^\/+|\/+$/g, "");
  if (r === "docs" || r.startsWith("docs/")) {
    if (!r.startsWith("docs/en/")) return undefined;
    r = r.slice("docs/en/".length);
  }
  if (!PATH_RE.test(r) || r.includes("//")) return undefined;
  return r;
};

/** Parses llms.txt: the "## English" section only, `### Group` headings, `- [Title](url.md) - description` lines. */
export const parseLlmsTxt = (
  text: string,
  base = platformBase(),
): PlatformEntry[] => {
  // Links on the real host and on the configured base (a mirror) both count; pages are always fetched from the base.
  const hosts = [...new Set([base, PLATFORM])]
    .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const line = new RegExp(
    `^- \\[(.+?)\\]\\(((?:${hosts})/docs/en/[^)\\s]+?)\\.md\\)(?: - (.*))?$`,
  );
  const out: PlatformEntry[] = [];
  let inEnglish = false;
  let group = "";
  for (const raw of text.split(/\r?\n/)) {
    const h2 = /^##\s+(.*?)\s*$/.exec(raw);
    if (h2 && !raw.startsWith("###")) {
      inEnglish = h2[1] === "English";
      group = "";
      continue;
    }
    if (!inEnglish) continue;
    const h3 = /^###\s+(.*?)\s*$/.exec(raw);
    if (h3) {
      group = h3[1] ?? "";
      continue;
    }
    const m = line.exec(raw);
    if (!m) continue;
    const path = normalizePlatformPath(`${m[2]}.md`);
    if (!path) continue;
    out.push({
      path,
      title: m[1] ?? path,
      description: m[3] ?? "",
      group,
      url: `${base}/docs/en/${path}`,
    });
  }
  return out;
};

export type PlatformIndex = {
  entries: readonly PlatformEntry[];
  source: Source;
  search(query: string, limit: number, group?: string): PlatformHit[];
};
export type PlatformHit = {
  entry: PlatformEntry;
  score: number;
  snippet: string;
};

const asEntry = (p: PlatformEntry): Entry => ({
  route: p.path,
  title: p.title,
  // URL path tokens count with the description weight.
  description: `${p.description} ${p.path.replace(/[/_-]+/g, " ")}`,
  section: p.group,
  md: "",
  url: p.url,
});

export class Platform {
  private memo:
    | { body: string; entries: PlatformEntry[]; idx: SearchIndex }
    | undefined;

  /** The page list from llms.txt. Throws ContentError when unreachable and nothing is cached. */
  async index(): Promise<PlatformIndex> {
    const r = await getResource({
      url: `${platformBase()}/llms.txt`,
      rel: "platform/llms.txt",
      ttlMs: ttl(INDEX_TTL_MS),
      maxBytes: FILE_MAX,
      validate: (b) => parseLlmsTxt(b).length > 0,
    });
    if (r.status !== "ok")
      throw new ContentError(
        r.status === "error"
          ? `platform docs are offline and not cached yet: could not reach ${r.origin}`
          : `llms.txt was not found on ${r.origin}`,
      );
    if (this.memo?.body !== r.body) {
      const entries = parseLlmsTxt(r.body);
      const asE = entries.map(asEntry);
      const idx = new SearchIndex({
        entries: () => asE,
        text: () => "",
        extra: (e) => e.section,
      });
      this.memo = { body: r.body, entries, idx };
    }
    const { entries, idx } = this.memo;
    const byPath = new Map(entries.map((e) => [e.path, e]));
    return {
      entries,
      source: r.source,
      search(query, limit, group) {
        const want = group?.trim().toLowerCase();
        return idx
          .search(query, entries.length)
          .filter((h) => !want || h.entry.section.toLowerCase() === want)
          .slice(0, limit)
          .flatMap((h) => {
            const entry = byPath.get(h.entry.route);
            return entry
              ? [
                  {
                    entry,
                    score: h.score,
                    snippet: entry.description || entry.title,
                  },
                ]
              : [];
          });
      },
    };
  }

  /** Entries from the last llms.txt read, without any request. */
  known(): readonly PlatformEntry[] | undefined {
    return this.memo?.entries;
  }

  /** Page text (with front matter) for a normalized path. */
  readPage(path: string): Promise<Resource> {
    return getResource({
      url: `${platformBase()}/docs/en/${path}.md`,
      rel: `platform/pages/${path}.md`,
      deleteOn404: true,
      ttlMs: ttl(PAGE_TTL_MS),
      maxBytes: FILE_MAX,
    });
  }
}

/** Entries that share the most words with a path, for "not found" answers. */
export const nearPlatform = (
  path: string,
  entries: readonly PlatformEntry[],
): string => {
  const want = new Set(tokenize(path.replace(/[/_-]+/g, " ")));
  const near = entries
    .map((e) => ({
      e,
      n: tokenize(`${e.path.replace(/[/_-]+/g, " ")} ${e.title}`).filter((t) =>
        want.has(t),
      ).length,
    }))
    .filter((x) => x.n > 0 && x.e.path !== path)
    .sort((a, b) => b.n - a.n)
    .slice(0, 5)
    .map((x) => `  - ${x.e.path}`)
    .join("\n");
  return near ? `\nClosest matches:\n${near}` : "";
};
