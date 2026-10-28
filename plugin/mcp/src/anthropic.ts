// www.anthropic.com as a model: the sitemap as the page list and the HTML pages. All I/O goes through fetcher.ts.
// The site has no llms.txt and no markdown variant, so titles come from slugs and pages are converted by html.ts.
import { parseXml, type XmlDocument, XmlElement } from "@rgrove/parse-xml";
import { ContentError } from "./content.ts";
import {
  baseUrl,
  getResource,
  MB,
  type Resource,
  type Source,
  ttl,
} from "./fetcher.ts";
import type { Entry } from "./manifest.ts";
import { SearchIndex, tokenize } from "./search.ts";

export const ANTHROPIC = "https://www.anthropic.com";
// Override for mirrors and tests: ANTHROPIC_SITE_BASE_URL (https; http only for localhost and 127.0.0.1).
export const anthropicBase = (): string =>
  baseUrl("ANTHROPIC_SITE_BASE_URL", ANTHROPIC);

const INDEX_TTL_MS = 60 * 60 * 1000;
const PAGE_TTL_MS = 6 * 60 * 60 * 1000;
const SITEMAP_MAX = 2 * MB;
const PAGE_MAX = 4 * MB;

/** The route of the root page "/". */
export const ROOT = "index";

/** A page from the sitemap. `path` is the part after the host, e.g. "research/building-effective-agents". */
export type AnthropicEntry = {
  path: string;
  title: string;
  section: string;
  lastmod: string;
  url: string;
};

const PATH_RE = /^[a-z0-9][a-z0-9/_.-]*$/;

/**
 * Normalizes input to a page path, or undefined when the rules reject it.
 * Accepts "research/x", "/research/x", and the full URL on the configured host.
 * The root page "/" (and the empty string) is the route "index".
 * Rejects "..", dot-leading segments, other hosts, and anything outside [a-z0-9/_.-].
 */
export const normalizeAnthropicPath = (input: string): string | undefined => {
  let r = input.trim();
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(r) || r.startsWith("//")) {
    const hosts = new Set([anthropicBase(), ANTHROPIC]);
    const o = [...hosts].find((h) => r === h || r.startsWith(`${h}/`));
    if (!o) return undefined;
    r = r.slice(o.length);
  }
  r = r.replace(/[?#].*$/, "").replace(/^\/+|\/+$/g, "");
  if (r === "") return ROOT;
  if (!PATH_RE.test(r) || r.includes("//") || /(^|\/)\./.test(r))
    return undefined;
  return r;
};

/** "research/building-effective-agents" -> "Building Effective Agents". */
const titleOfSlug = (path: string): string => {
  if (path === ROOT) return "Anthropic";
  const last = path.split("/").pop() ?? path;
  return last
    .split(/[-_.]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

// Prefixed names ("ns:loc") match too.
const localName = (name: string): string => name.slice(name.indexOf(":") + 1);

const childText = (el: XmlElement, name: string): string | undefined => {
  const child = el.children.find(
    (c): c is XmlElement =>
      c instanceof XmlElement && localName(c.name) === name,
  );
  return child?.text.trim();
};

const urlElements = (node: XmlElement): XmlElement[] =>
  node.children.flatMap((c) =>
    c instanceof XmlElement
      ? localName(c.name) === "url"
        ? [c]
        : urlElements(c)
      : [],
  );

/** Parses a flat <urlset>: every <url> with its <loc> and <lastmod>. A repeated path keeps its first entry. Malformed XML gives []. */
export const parseSitemap = (
  xml: string,
  base = anthropicBase(),
): AnthropicEntry[] => {
  let doc: XmlDocument;
  try {
    doc = parseXml(xml);
  } catch {
    return [];
  }
  const out: AnthropicEntry[] = [];
  const seen = new Set<string>();
  for (const url of doc.root ? urlElements(doc.root) : []) {
    const loc = childText(url, "loc");
    const path = loc ? normalizeAnthropicPath(loc) : undefined;
    if (!path || seen.has(path)) continue;
    seen.add(path);
    out.push({
      path,
      title: titleOfSlug(path),
      section: path === ROOT ? "site" : (path.split("/")[0] ?? "site"),
      lastmod: childText(url, "lastmod") ?? "",
      url: path === ROOT ? `${base}/` : `${base}/${path}`,
    });
  }
  return out;
};

export type AnthropicHit = {
  entry: AnthropicEntry;
  score: number;
  snippet: string;
};
export type AnthropicIndex = {
  entries: readonly AnthropicEntry[];
  source: Source;
  search(query: string, limit: number, section?: string): AnthropicHit[];
};

const asEntry = (p: AnthropicEntry): Entry => ({
  route: p.path,
  title: p.title,
  // The sitemap has no descriptions: the slug words of the whole path are what a query can match.
  description: p.path.replace(/[/_.-]+/g, " "),
  section: p.section,
  md: "",
  url: p.url,
});

export class Anthropic {
  private memo:
    | { body: string; entries: AnthropicEntry[]; idx: SearchIndex }
    | undefined;

  /** The page list from the sitemap. Throws ContentError when unreachable and nothing is cached. */
  async index(): Promise<AnthropicIndex> {
    const r = await getResource({
      url: `${anthropicBase()}/sitemap.xml`,
      rel: "anthropic/sitemap.xml",
      ttlMs: ttl(INDEX_TTL_MS),
      maxBytes: SITEMAP_MAX,
      validate: (b) => parseSitemap(b).length > 0,
    });
    if (r.status !== "ok")
      throw new ContentError(
        r.status === "error"
          ? `anthropic site is offline and not cached yet: could not reach ${r.origin}`
          : `sitemap.xml was not found on ${r.origin}`,
      );
    if (this.memo?.body !== r.body) {
      const entries = parseSitemap(r.body);
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
      search(query, limit, section) {
        const want = section?.trim().toLowerCase();
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
                    snippet: entry.lastmod
                      ? `${entry.section}, updated ${entry.lastmod.slice(0, 10)}`
                      : entry.section,
                  },
                ]
              : [];
          });
      },
    };
  }

  /** Entries from the last sitemap read, without any request. */
  known(): readonly AnthropicEntry[] | undefined {
    return this.memo?.entries;
  }

  /** Page HTML for a normalized path. */
  readPage(path: string): Promise<Resource> {
    return getResource({
      url: path === ROOT ? `${anthropicBase()}/` : `${anthropicBase()}/${path}`,
      rel: `anthropic/pages/${path}.html`,
      deleteOn404: true,
      ttlMs: ttl(PAGE_TTL_MS),
      maxBytes: PAGE_MAX,
    });
  }
}

/** Entries that share the most words with a path, for "not found" answers. */
export const nearAnthropic = (
  path: string,
  entries: readonly Pick<AnthropicEntry, "path" | "title">[],
): string => {
  const words = (s: string) => tokenize(s.replace(/[/_.-]+/g, " "));
  const want = new Set(words(path));
  const near = entries
    .map((e) => ({
      e,
      n: words(`${e.path} ${e.title}`).filter((t) => want.has(t)).length,
    }))
    .filter((x) => x.n > 0 && x.e.path !== path)
    .sort((a, b) => b.n - a.n)
    .slice(0, 5)
    .map((x) => `  - ${x.e.path}`)
    .join("\n");
  return near ? `\nClosest matches:\n${near}` : "";
};
