// The page list of our docs site: its URL, the route form, and the parsers for llms-manifest.json and llms-search-index.json.
import { baseUrl } from "./fetcher.ts";
import type { IndexPage } from "./search.ts";

export const SITE = "https://clawdipedia.cc";
// Override for mirrors and tests: CLAWDIPEDIA_BASE_URL (https; http only for localhost and 127.0.0.1).
export const siteBase = (): string => baseUrl("CLAWDIPEDIA_BASE_URL", SITE);
export type Entry = {
  route: string;
  title: string;
  description: string;
  section: string;
  md: string;
  url: string;
};

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

export const parseManifest = (text: string): Entry[] => {
  try {
    return sanitizeManifest(JSON.parse(text));
  } catch {
    return [];
  }
};

/** The prebuilt llms-search-index.json (design D6). Undefined when the text is not an index. Pages with a missing field are dropped. */
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
