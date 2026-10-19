// Site checks (design D9). Run with: bun tools/check-docs.ts
// 1. No emoji characters in docs/ or src/, except the allow-list below.
// 2. Every doc has `title` and `description` front matter.
// 3. Headings and titles follow a simple Chicago Title Case rule.
// 4. A `Source:` line or an "in the official docs" mention names a page only as a markdown link.
// 5. No emoji in a heading or in link text.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dir, "..");
const DOC_EXT = /\.(md|mdx)$/;
const TEXT_EXT = /\.(md|mdx|ts|tsx|css|json|svg)$/;

// Chicago style: lowercase articles, coordinating conjunctions, and prepositions.
const SMALL = new Set(
  (
    "a an the and but or nor for so yet as at by in of on to up via per vs " +
    "from into onto over with within without off out than"
  ).split(" "),
);

// Short prepositions that must stay lowercase inside a title.
const REQUIRE_LOWER = new Set(["with", "without"]);

const EMOJI =
  /\p{Extended_Pictographic}|\u{FE0F}|\u{20E3}|[\u{1F1E6}-\u{1F1FF}]/gu;

// Emojis that docs may use (content-conventions D4/D5). Phase 2 adds more.
const ALLOWED_EMOJI = new Set(["\uFE0F", "\u2705", "\u274C", "\u2753"]); // check mark, cross mark, question mark
const emojiIn = (s: string) => [...s.matchAll(EMOJI)].map((m) => m[0]);
const badEmoji = (s: string) => emojiIn(s).filter((e) => !ALLOWED_EMOJI.has(e));

// A `Source:` line may cite the program, a probe, or code without a link.
const PLAIN_SOURCE =
  /^\s*Sources?(?: for all \w+)?:\s*(the program|a probe|the text|the \w+ of|`)/i;

type Problem = { file: string; line: number; message: string };
const problems: Problem[] = [];
const report = (file: string, line: number, message: string) =>
  problems.push({ file: relative(ROOT, file), line, message });

function walk(dir: string, out: string[] = []): string[] {
  let names: string[];
  try {
    names = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of names) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

function parseFrontMatter(
  text: string,
): { data: Record<string, string>; bodyStart: number } | null {
  const lines = text.split("\n");
  if (lines[0]?.trim() !== "---") return null;
  const data: Record<string, string> = {};
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") return { data, bodyStart: i + 1 };
    const m = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(lines[i]);
    if (m) {
      let v = m[2].trim();
      if (/^(['"]).*\1$/.test(v)) v = v.slice(1, -1);
      data[m[1]] = v;
    }
  }
  return null;
}

/** Returns the words that break the rule, or an empty list. */
export function titleCaseProblems(raw: string): string[] {
  const text = raw
    .replace(/\s*\{#[^}]*\}\s*$/, "")
    .replace(/`[^`]*`/g, "X") // code spans are always fine
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_]{1,3}/g, "");
  const words = text.split(/\s+/).filter(Boolean);
  const bad: string[] = [];
  words.forEach((word, i) => {
    const core = word.replace(/^[("'[]+/, "");
    const first = core[0];
    if (!first || !/\p{L}/u.test(first)) return; // digits, symbols, placeholders
    const bare = core.replace(/[^\p{L}\p{N}-]+$/u, "");
    const edge =
      i === 0 || i === words.length - 1 || /[:?!.]$/.test(words[i - 1] ?? "");
    if (first === first.toUpperCase()) {
      if (!edge && REQUIRE_LOWER.has(bare.toLowerCase())) bad.push(bare);
      return;
    }
    if (!edge && SMALL.has(bare.toLowerCase())) return;
    bad.push(bare);
  });
  return bad;
}

const EMOJI_FILES = [
  ...walk(join(ROOT, "docs")),
  ...walk(join(ROOT, "src")),
].filter((f) => TEXT_EXT.test(f));

for (const file of EMOJI_FILES) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      const bad = badEmoji(line)[0];
      if (bad)
        report(
          file,
          i + 1,
          `emoji not on the allow-list: U+${bad.codePointAt(0)?.toString(16).toUpperCase()}`,
        );
    });
}

for (const file of walk(join(ROOT, "docs")).filter((f) =>
  f.endsWith("_category_.json"),
)) {
  try {
    const label = JSON.parse(readFileSync(file, "utf8")).label;
    if (typeof label === "string" && emojiIn(label).length)
      report(file, 1, "emoji in a category label");
  } catch {
    report(file, 1, "invalid JSON");
  }
}

for (const file of walk(join(ROOT, "docs")).filter((f) => DOC_EXT.test(f))) {
  const text = readFileSync(file, "utf8");
  const fm = parseFrontMatter(text);
  if (!fm) {
    report(file, 1, "missing front matter");
    continue;
  }
  for (const key of ["title", "sidebar_label"]) {
    const v = fm.data[key];
    if (v && emojiIn(v).length) report(file, 1, `emoji in \`${key}\``);
  }
  for (const key of ["title", "description"]) {
    if (!fm.data[key]) report(file, 1, `front matter needs \`${key}\``);
  }
  if (fm.data["title"]) {
    const bad = titleCaseProblems(fm.data["title"]);
    if (bad.length)
      report(file, 1, `title not in Title Case: ${bad.join(", ")}`);
  }
  const lines = text.split("\n");
  let fence: { ch: string; len: number } | null = null;
  for (let i = fm.bodyStart; i < lines.length; i++) {
    const line = lines[i];
    const f = /^\s*(`{3,}|~{3,})/.exec(line);
    if (f) {
      const ch = f[1][0];
      const len = f[1].length;
      if (!fence) fence = { ch, len };
      else if (
        fence.ch === ch &&
        len >= fence.len &&
        /^\s*[`~]+\s*$/.test(line)
      )
        fence = null;
      continue;
    }
    if (fence) continue;
    if (
      /^\s*Sources?\b[^|]*:/.test(line) &&
      !PLAIN_SOURCE.test(line) &&
      !/\]\(https?:/.test(line)
    ) {
      report(file, i + 1, "source names a page without a link");
    } else if (
      /\bofficial docs (say|list|confirm|name|describe)\b/i.test(line) &&
      !/\]\(https?:/.test(line)
    ) {
      report(file, i + 1, '"the official docs say/list/..." needs a link');
    } else if (/\bRFC \d+/.test(line) && !/\]\(https?:/.test(line)) {
      report(file, i + 1, "RFC mention needs a link");
    } else if (
      /\bchangelog\b/i.test(line.replace(/`[^`]*`/g, "")) &&
      !/\]\(https?:/.test(line)
    ) {
      report(file, i + 1, "changelog mention needs a link");
    } else if (
      /\b[A-Z][\w.]*,? in the official docs\b/.test(line) &&
      !/\]\(https?:/.test(line) &&
      !/<\w+ \/>/.test(line)
    ) {
      report(file, i + 1, '"in the official docs" needs a link to the page');
    }
    if (/`[^`\n]*\\[{}][^`\n]*`/.test(line))
      report(
        file,
        i + 1,
        "escaped brace inside inline code (write { and } as is)",
      );
    for (const m of line.matchAll(/\[([^\]]*)\]\([^)]*\)/g)) {
      if (emojiIn(m[1]).length) report(file, i + 1, "emoji in link text");
    }
    const h = /^#{1,6}\s+(.*?)\s*#*\s*$/.exec(line);
    if (h) {
      if (emojiIn(h[1]).length) report(file, i + 1, "emoji in a heading");
      const bad = titleCaseProblems(h[1]);
      if (bad.length)
        report(file, i + 1, `heading not in Title Case: ${bad.join(", ")}`);
    }
  }
}

if (problems.length) {
  for (const p of problems) console.error(`${p.file}:${p.line}: ${p.message}`);
  console.error(`\n${problems.length} problem(s) found.`);
  process.exit(1);
}
console.log(`check-docs: ok (${EMOJI_FILES.length} files scanned)`);
