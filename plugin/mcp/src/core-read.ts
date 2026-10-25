// read_page: one chunk of a docs page or a platform page.

import {
  content,
  DEFAULT_PAGE_CHARS,
  type DocSourceName,
  fail,
  guarded,
  ok,
  platform,
  type Result,
} from "./core-shared.ts";
import { type Source, sourceData, sourceLine } from "./fetcher.ts";
import { type Entry, normalizeRoute } from "./manifest.ts";
import {
  nearPlatform,
  normalizePlatformPath,
  platformBase,
} from "./platform.ts";
import { headingsOf, tokenize } from "./search.ts";

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
