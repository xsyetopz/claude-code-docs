// Checks the llms.txt output (design: agent-access D1). Run after `bun run build`:
//   bun tools/llms/check.ts
// 1. Every link in llms.txt resolves to a file in build/.
// 2. Every docs/**/*.md(x) page has a built .md page, a manifest entry, and a link in llms.txt.
// 3. llms-full.txt holds every page, and each page file starts with front matter.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dir, "..", "..");
const BUILD = join(ROOT, "build");
const BASE = "https://xsyetopz.github.io/claude-code-docs/";
const problems: string[] = [];
const fail = (m: string) => problems.push(m);

const read = (name: string): string => {
  const path = join(BUILD, name);
  if (!existsSync(path)) {
    fail(`missing build/${name} (run \`bun run build\` first)`);
    return "";
  }
  return readFileSync(path, "utf8");
};

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir).sort()) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.mdx?$/.test(name)) out.push(path);
  }
  return out;
}

const llms = read("llms.txt");
if (problems.length > 0) {
  console.error(`llms:check  ${problems[0]}`);
  process.exit(1);
}
const full = read("llms-full.txt");
const manifest: { route: string; md: string; url: string }[] = (() => {
  try {
    return JSON.parse(read("llms-manifest.json") || "[]");
  } catch {
    fail("llms-manifest.json is not valid JSON");
    return [];
  }
})();

const links = [...llms.matchAll(/^- \[[^\]]+\]\(([^)]+)\)/gm)].map((m) => m[1]);
for (const url of links) {
  if (!url?.startsWith(BASE)) {
    fail(`llms.txt link outside ${BASE}: ${url}`);
    continue;
  }
  if (!existsSync(join(BUILD, url.slice(BASE.length))))
    fail(`llms.txt link does not resolve to a built file: ${url}`);
}

const sources = new Set<string>();
for (const entry of manifest) {
  const file = entry.md.slice(BASE.length);
  const text = read(file);
  const m =
    /^---\ntitle: .*\ndescription: .*\nurl: (.*)\nsource: (.*)\n---\n/.exec(
      text,
    );
  if (!m) {
    fail(`build/${file} has no valid front matter`);
    continue;
  }
  if (m[1] !== entry.url) fail(`build/${file}: url differs from the manifest`);
  if (m[2]) sources.add(m[2]);
  const prose = text
    .replace(/^\s*(`{3,}|~{3,})[\s\S]*?^\s*\1.*$/gm, "")
    .replace(/(`+)[^`][\s\S]*?\1/g, "");
  for (const m of prose.matchAll(/\]\(([^)\s]+)/g)) {
    const target = m[1] ?? "";
    if (!/^(https?:|mailto:|#)/.test(target))
      fail(`build/${file} keeps a relative link: ${target}`);
  }
  if (!links.includes(entry.md)) fail(`llms.txt misses ${entry.md}`);
  if (!full.includes(`\nurl: ${entry.url}\nsource: ${m[2]}\n`))
    fail(`llms-full.txt misses ${entry.url}`);
}

for (const path of walk(join(ROOT, "docs"))) {
  const rel = relative(ROOT, path).split("\\").join("/");
  if (!sources.has(rel)) fail(`${rel} has no page in the llms output`);
}

if (problems.length > 0) {
  for (const p of problems) console.error(`llms:check  ${p}`);
  console.error(`\n${problems.length} problem(s).`);
  process.exit(1);
}
console.log(`llms:check ok: ${manifest.length} pages, ${links.length} links.`);
