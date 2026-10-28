// read_page: one chunk of a docs page or a page of a remote source (platform, code, anthropic).

import { type Entry, normalizeRoute } from "../manifest.ts";
import { tokenize } from "../search.ts";
import { pageResult } from "./page.ts";
import { readRemote } from "./remote.ts";
import {
  content,
  DEFAULT_PAGE_CHARS,
  type DocSourceName,
  fail,
  guarded,
  type Result,
} from "./shared.ts";
import { remoteOf } from "./sources.ts";

export type ReadArgs = {
  /** A docs route, or a path on a remote source. */
  route: string;
  source?: DocSourceName;
  /** Return only the H2 section with this heading. */
  heading?: string | undefined;
  offset?: number;
  maxChars?: number;
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

export const read = (args: ReadArgs): Promise<Result> =>
  guarded(async () => {
    const remote = remoteOf(args.source);
    if (remote) return await readRemote(remote, args);
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
