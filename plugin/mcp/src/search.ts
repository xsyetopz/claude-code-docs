// Small BM25 index over the pages: title, description, headings, and body, weighted.
import { createHash } from "node:crypto";
import type { Entry } from "./content.ts";

const W_TITLE = 5;
const W_DESC = 3;
const W_HEAD = 3;
const W_EXTRA = 2;
const K1 = 1.4;
const B = 0.75;

type Doc = {
  entry: Entry;
  body: string;
  tf: Map<string, number>;
  len: number;
};

/** Lowercased word tokens. A compound like CLAUDE_CODE_USE_BEDROCK or PreToolUse also yields its parts. */
export const tokenize = (text: string): string[] => {
  const out: string[] = [];
  for (const m of text.matchAll(/[A-Za-z0-9]+(?:[_.:-][A-Za-z0-9]+)*/g)) {
    const word = m[0];
    out.push(word.toLowerCase());
    const parts = word
      .split(/[_.:-]/)
      .flatMap((p) => p.replace(/([a-z0-9])([A-Z])/g, "$1 $2").split(" "));
    if (parts.length > 1) for (const p of parts) out.push(p.toLowerCase());
  }
  return out;
};

export const stripFrontMatter = (md: string): string =>
  md.replace(/^---\n[\s\S]*?\n---\n/, "");

export const headingsOf = (md: string): string[] => {
  const out: string[] = [];
  let fence = false;
  for (const line of md.split("\n")) {
    if (/^```/.test(line)) fence = !fence;
    const m = fence ? null : /^#{2,4}\s+(.*)$/.exec(line);
    if (m?.[1]) out.push(m[1].trim());
  }
  return out;
};

/** Where the index reads pages from. Text is front matter plus body, or undefined when unavailable. */
export type DocSource = {
  entries(): readonly Entry[];
  text(entry: Entry): string | undefined;
  /** Optional extra field indexed with weight 2 (for example a group name). Not part of the body. */
  extra?(entry: Entry): string | undefined;
};

export type Hit = { entry: Entry; score: number; snippet: string };

export class SearchIndex {
  private docs: Doc[] = [];
  private df = new Map<string, number>();
  private avg = 1;

  constructor(source: DocSource) {
    for (const entry of source.entries()) {
      const raw = source.text(entry);
      if (raw === undefined) continue;
      const body = stripFrontMatter(raw);
      const tf = new Map<string, number>();
      let len = 0;
      const add = (text: string, w: number) => {
        for (const t of tokenize(text)) {
          tf.set(t, (tf.get(t) ?? 0) + w);
          len += w;
        }
      };
      add(entry.title, W_TITLE);
      add(entry.description, W_DESC);
      add(headingsOf(body).join("\n"), W_HEAD);
      add(source.extra?.(entry) ?? "", W_EXTRA);
      add(body, 1);
      this.docs.push({ entry, body, tf, len });
      for (const t of tf.keys()) this.df.set(t, (this.df.get(t) ?? 0) + 1);
    }
    this.avg =
      this.docs.reduce((s, d) => s + d.len, 0) / (this.docs.length || 1);
  }

  search(query: string, limit: number, section?: string): Hit[] {
    const terms = [...new Set(tokenize(query))];
    if (terms.length === 0) return [];
    const phrase = query.trim().toLowerCase();
    const n = this.docs.length;
    const hits: Hit[] = [];
    for (const d of this.docs) {
      if (section && !matchesSection(d.entry, section)) continue;
      let score = 0;
      for (const t of terms) {
        const f = d.tf.get(t);
        if (!f) continue;
        const df = this.df.get(t) ?? 1;
        const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
        score +=
          (idf * f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.len) / this.avg));
      }
      if (score === 0) continue;
      const lower = d.body.toLowerCase();
      if (phrase.length > 2 && lower.includes(phrase)) score *= 1.5;
      if (d.entry.title.toLowerCase().includes(phrase)) score *= 1.5;
      hits.push({ entry: d.entry, score, snippet: snippetOf(d.body, terms) });
    }
    return hits.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}

export const matchesSection = (e: Entry, section: string): boolean => {
  const s = section
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
  return (
    e.section.toLowerCase() === s ||
    e.route.toLowerCase().startsWith(`${s}/`) ||
    e.route.toLowerCase().split("/")[0] === s
  );
};

/** The line (with its nearest heading) that matches the most query terms, cut to about 240 chars. */
const snippetOf = (body: string, terms: string[]): string => {
  let heading = "";
  let best = { score: 0, line: "", heading: "" };
  let fence = false;
  for (const line of body.split("\n")) {
    if (/^```/.test(line)) fence = !fence;
    const h = !fence && /^#{1,4}\s+(.*)$/.exec(line);
    if (h) {
      heading = (h[1] ?? "").trim();
      continue;
    }
    if (!line.trim()) continue;
    const toks = new Set(tokenize(line));
    let score = 0;
    for (const t of terms) if (toks.has(t)) score++;
    if (score > best.score) best = { score, line: line.trim(), heading };
  }
  if (!best.line) return "";
  const line =
    best.line.length > 240 ? `${best.line.slice(0, 237)}...` : best.line;
  return best.heading ? `[${best.heading}] ${line}` : line;
};

/** The cap of the prebuilt search-index.json (design D6): the build fails above it, and the client reads no more. */
export const SEARCH_INDEX_MAX = 8 * 1024 * 1024;

export type IndexPage = {
  route: string;
  title: string;
  description: string;
  headings: string[];
  extra: string;
  body: string;
};

/** search-index.json (design D6) from each page's route, title, description, and markdown with front matter. */
export const searchIndexJson = (
  version: string,
  pages: { route: string; title: string; description: string; text: string }[],
): string => {
  const out: IndexPage[] = pages.map((p) => {
    const body = stripFrontMatter(p.text);
    return {
      route: p.route,
      title: p.title,
      description: p.description.replace(/\s+/g, " ").trim(),
      headings: headingsOf(body),
      extra: "",
      body,
    };
  });
  const hash = createHash("sha256").update(JSON.stringify(out)).digest("hex");
  const json = `${JSON.stringify({ version, hash, pages: out })}\n`;
  const bytes = Buffer.byteLength(json);
  if (bytes > SEARCH_INDEX_MAX)
    throw new Error(
      `search-index.json is ${bytes} bytes, above the cap of ${SEARCH_INDEX_MAX} (SEARCH_INDEX_MAX in plugin/mcp/src/search.ts)`,
    );
  return json;
};
