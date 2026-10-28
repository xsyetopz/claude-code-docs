// One chunk of a page: the H2 filter, the offset and character window, and the header line. Shared by every source.
import { type Source, sourceData, sourceLine } from "../fetcher.ts";
import { headingsOf } from "../search.ts";
import { fail, ok, type Result } from "./shared.ts";

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

/** One chunk of a page: a header line with the range, the text, and the Source line. */
export const pageResult = (
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
