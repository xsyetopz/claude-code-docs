// search_docs: BM25 search of the docs site or the platform docs.

import { sourceData, sourceLine } from "../fetcher.ts";
import {
  content,
  type DocSourceName,
  guarded,
  heading,
  ok,
  platform,
  type Result,
} from "./shared.ts";
import { indexLine, indexSource, searchIndex } from "./site-index.ts";

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
