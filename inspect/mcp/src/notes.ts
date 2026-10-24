// `release` `notes`: marks each release-notes line matched, gated, or unmatched against a code diff (`diff.ts`).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { Change, Diff } from "./diff.ts";

export type NoteLine = {
  line: string;
  status: "matched" | "gated" | "unmatched";
  /** the best change, or a `release:diff` report item */
  change?: Change;
  item?: string;
  /** the code spans and words found */
  hits: string[];
};

// Words of 5 letters or more that say what kind of note a line is, not what it is about.
const STOP = new Set(
  "added fixed improved changed which there their about after before being would could should these those where while other through without within instead claude still first every again showing shows error errors their".split(
    " ",
  ),
);

/** The notes of a release from its cache file, else from `gh release view`, then cached. */
export const readNotes = (version: string, file: string): string => {
  if (existsSync(file)) return readFileSync(file, "utf8");
  const r = Bun.spawnSync([
    "gh",
    "release",
    "view",
    `v${version}`,
    "--repo",
    "anthropics/claude-code",
    "--json",
    "body",
    "-q",
    ".body",
  ]);
  if (r.exitCode !== 0)
    throw new Error(
      `gh release view v${version} failed: ${r.stderr.toString().slice(0, 200)}`,
    );
  if (!r.stdout.toString().trim())
    throw new Error(`gh release view v${version} gave no notes`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, r.stdout.toString());
  return r.stdout.toString();
};

const keysOf = (line: string) => {
  // A scope such as "[VSCode]" or "Windows:" says where, not what.
  const text = line.replace(/^\[[^\]]*\]\s*|^[A-Z][a-z]+:\s*/, "");
  const spans = [...text.matchAll(/`([^`]+)`/g)]
    .map((x) => x[1] as string)
    .filter((x) => x.length >= 3);
  const tokens = text
    .replace(/`[^`]+`/g, " ")
    .toLowerCase()
    .replace(/'s\b/g, "")
    .split(/[^a-z]+/);
  const words = [
    ...new Set(tokens.filter((w) => w.length >= 5 && !STOP.has(w))),
  ];
  return { spans, words, tokens: new Set(tokens) };
};

const WORDS = 3;
const stringsOf = (c: Change, side: "from" | "to") =>
  [
    ...(c[side]?.f ?? []),
    ...(c.kind === "changed" ? [] : c.calls.map((x) => x.replace(/^\S+ /, ""))),
  ].filter((x) => x.startsWith('"'));

/**
 * Scores a change for a line: each code span in any of its strings counts 2, the subject (its object's `name`) named
 * by the line counts 2, and the words count when 3 or more are in one string it adds or removes.
 */
const scoreChange = (k: ReturnType<typeof keysOf>, c: Change) => {
  const all = [
    ...stringsOf(c, "from"),
    ...stringsOf(c, "to"),
    ...c.calls.map((x) => x.replace(/^\S+ /, "")),
  ];
  const found = k.spans.filter((x) =>
    all.some((t) => t.includes(x.replace(/^\//, ""))),
  );
  const subject =
    c.subject && k.tokens.has(c.subject.toLowerCase()) ? [c.subject] : [];
  const a = new Set(stringsOf(c, "from"));
  const b = new Set(stringsOf(c, "to"));
  const changed = [
    ...[...a].filter((x) => !b.has(x)),
    ...[...b].filter((x) => !a.has(x)),
  ];
  let top: string[] = [];
  for (const t of changed) {
    const lower = t.toLowerCase();
    const w = k.words.filter((x) => lower.includes(x));
    if (w.length > top.length) top = w;
  }
  if (top.length < WORDS) top = [];
  return {
    hits: [...found, ...subject, ...top],
    n: (found.length + subject.length) * 2 + top.length,
  };
};

const scoreItem = (k: ReturnType<typeof keysOf>, item: string) => {
  const found = k.spans.filter((x) => item.includes(x));
  const lower = item.toLowerCase();
  const w = k.words.filter((x) => lower.includes(x));
  const top = w.length >= WORDS ? w : [];
  return { hits: [...found, ...top], n: found.length * 2 + top.length };
};

const size = (c: Change) => (c.from?.t.length ?? 0) + (c.to?.t.length ?? 0);

/** Marks each `- ` line of the notes against the changes and the report items. */
export const checkNotes = (
  notes: string,
  d: Diff,
  items: string[] = [],
): NoteLine[] => {
  return notes
    .split("\n")
    .filter((l) => l.startsWith("- "))
    .map((raw) => {
      const line = raw.slice(2).trim();
      const k = keysOf(line);
      let best = { i: -1, n: 0, hits: [] as string[], item: false };
      d.changes.forEach((c, i) => {
        const s = scoreChange(k, c);
        if (
          s.n > best.n ||
          (s.n === best.n &&
            s.n > 0 &&
            !best.item &&
            size(c) < size(d.changes[best.i] as Change))
        )
          best = { i, ...s, item: false };
      });
      items.forEach((t, i) => {
        const s = scoreItem(k, t);
        if (s.n > best.n) best = { i, ...s, item: true };
      });
      if (best.n < 2) return { line, status: "unmatched", hits: [] };
      if (best.item)
        return {
          line,
          status: "matched",
          item: items[best.i],
          hits: best.hits,
        };
      const change = d.changes[best.i] as Change;
      const gated = [
        ...(change.from?.f ?? []),
        ...(change.to?.f ?? []),
        ...change.calls,
      ].some((x) => x.includes('"tengu_'));
      return {
        line,
        status: gated ? "gated" : "matched",
        change,
        hits: best.hits,
      };
    });
};
