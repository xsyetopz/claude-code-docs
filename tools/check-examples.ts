// Example checks. Run with: bun tools/check-examples.ts [--fix]
// Runs Biome (with the repo biome.json, including the arrow-function plugin)
// on the fenced code blocks in docs/ that Biome handles.
// Skip a block by adding `skip-lint` to its fence meta: ```json skip-lint title="..."
// Skipped by default: docs/prompts/ (verbatim captures).
// --fix writes Biome's safe fixes and formatting back into the markdown.
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = join(import.meta.dir, "..");
const DOCS = join(ROOT, "docs");
const SKIP_DIRS = new Set([join(DOCS, "prompts")]);
const SKIP_MARKER = "skip-lint";
// Biome must see the files inside the repo so biome.json and the plugin apply.
const TMP = join(import.meta.dir, ".examples-tmp");

const EXT: Record<string, string> = {
  ts: "ts",
  typescript: "ts",
  tsx: "tsx",
  js: "js",
  javascript: "js",
  jsx: "jsx",
  mjs: "mjs",
  json: "json",
  jsonc: "jsonc",
};

// Examples are fragments: they use names they do not declare or define.
const IGNORED_RULES = new Set([
  "lint/correctness/noUnusedVariables",
  "lint/correctness/noUnusedImports",
  "lint/correctness/noUnusedFunctionParameters",
  "lint/correctness/noUndeclaredVariables",
  "lint/correctness/noUnusedPrivateClassMembers",
]);

type Block = {
  file: string;
  line: number; // 1-based line of the first code line
  lang: string;
  ext: string;
  indent: string;
  lines: number; // number of code lines
  code: string;
  id: string;
};

type Diag = {
  severity: string;
  message: string;
  category: string;
  location?: { path: string; start?: { line: number } };
};

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (SKIP_DIRS.has(p)) return [];
    return statSync(p).isDirectory()
      ? walk(p)
      : /\.(md|mdx)$/.test(name)
        ? [p]
        : [];
  });

const OPEN = /^(\s*)(`{3,}|~{3,})\s*([\w-]*)(.*)$/;

const findBlocks = (file: string, text: string, counter: { n: number }) => {
  const lines = text.split("\n");
  const blocks: Block[] = [];
  let skipped = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = OPEN.exec(lines[i] ?? "");
    if (!m) continue;
    const indent = m[1] ?? "";
    const fence = m[2] ?? "";
    const lang = (m[3] ?? "").toLowerCase();
    const meta = m[4] ?? "";
    let end = i + 1;
    const close = new RegExp(`^\\s*${fence[0]}{${fence.length},}\\s*$`);
    while (end < lines.length && !close.test(lines[end] ?? "")) end++;
    const ext = EXT[lang];
    if (ext) {
      if (meta.split(/\s+/).includes(SKIP_MARKER)) skipped++;
      else {
        const body = lines
          .slice(i + 1, end)
          .map((l) =>
            indent && l.startsWith(indent) ? l.slice(indent.length) : l,
          );
        counter.n++;
        blocks.push({
          file,
          line: i + 2,
          lang,
          ext,
          indent,
          lines: end - i - 1,
          code: `${body.join("\n")}\n`,
          id: `b${String(counter.n).padStart(4, "0")}`,
        });
      }
    }
    i = end;
  }
  return { blocks, skipped };
};

const runBiome = (args: string[]) => {
  const p = Bun.spawnSync(
    [
      "bunx",
      "biome",
      "check",
      "--colors=off",
      "--vcs-use-ignore-file=false",
      ...args,
      TMP,
    ],
    { cwd: ROOT, stdout: "pipe", stderr: "pipe" },
  );
  return new TextDecoder().decode(p.stdout);
};

const parseReport = (out: string) => {
  const start = out.indexOf('{"summary"');
  if (start < 0) {
    console.error(out);
    throw new Error("Biome gave no JSON report.");
  }
  return JSON.parse(out.slice(start)) as {
    summary?: { changed?: number; unchanged?: number };
    diagnostics: Diag[];
  };
};

const main = () => {
  const fix = process.argv.includes("--fix");
  // --self-test DIR: scan DIR instead of docs/ (to prove the gate catches errors).
  const stIdx = process.argv.indexOf("--self-test");
  const scanRoot = stIdx >= 0 ? (process.argv[stIdx + 1] ?? DOCS) : DOCS;
  const counter = { n: 0 };
  const blocks: Block[] = [];
  let skipped = 0;
  for (const file of walk(scanRoot)) {
    const r = findBlocks(file, readFileSync(file, "utf8"), counter);
    blocks.push(...r.blocks);
    skipped += r.skipped;
  }
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
  try {
    for (const b of blocks)
      writeFileSync(join(TMP, `${b.id}.${b.ext}`), b.code);
    const byId = new Map(blocks.map((b) => [b.id, b]));
    let fixed = 0;
    if (fix) {
      runBiome(["--write", "--reporter=summary"]);
      const byFile = new Map<string, Block[]>();
      for (const b of blocks) {
        const next = readFileSync(join(TMP, `${b.id}.${b.ext}`), "utf8");
        if (next === b.code) continue;
        fixed++;
        byFile.set(b.file, [
          ...(byFile.get(b.file) ?? []),
          { ...b, code: next },
        ]);
      }
      for (const [file, list] of byFile) {
        // Re-read: other agents edit docs. Apply from the bottom up.
        const lines = readFileSync(file, "utf8").split("\n");
        for (const b of list.sort((x, y) => y.line - x.line)) {
          const old = byId.get(b.id) as Block;
          const cur = lines.slice(b.line - 1, b.line - 1 + old.lines);
          const want = old.code.split("\n").slice(0, -1);
          if (
            cur.map((l) => l.slice(old.indent.length)).join("\n") !==
            want.join("\n")
          ) {
            console.error(
              `${relative(ROOT, file)}:${b.line}: changed meanwhile, not fixed`,
            );
            continue;
          }
          const repl = b.code
            .split("\n")
            .slice(0, -1)
            .map((l) => (l ? old.indent + l : l));
          lines.splice(b.line - 1, old.lines, ...repl);
        }
        writeFileSync(file, lines.join("\n"));
      }
      for (const b of blocks) {
        const next = readFileSync(join(TMP, `${b.id}.${b.ext}`), "utf8");
        b.code = next;
      }
    }
    const report = parseReport(runBiome(["--reporter=json"]));
    const processed =
      (report.summary?.changed ?? 0) + (report.summary?.unchanged ?? 0);
    if (processed !== blocks.length) {
      console.error(
        `Biome processed ${processed} files but ${blocks.length} blocks were written. The gate would be a no-op.`,
      );
      process.exitCode = 1;
    }
    const diags = report.diagnostics.filter(
      (d) => !IGNORED_RULES.has(d.category) && d.location?.path,
    );
    let problems = 0;
    for (const d of diags) {
      const id = /(b\d{4})\./.exec(d.location?.path ?? "")?.[1] ?? "";
      const b = byId.get(id);
      if (!b) continue;
      problems++;
      const line = b.line + Math.max((d.location?.start?.line ?? 1) - 1, 0);
      const msg = d.message.split("\n")[0];
      console.error(
        `${relative(ROOT, b.file).split(sep).join("/")}:${line}: ${d.category}: ${msg}`,
      );
    }
    console.log(
      `Checked ${blocks.length} example blocks (${skipped} skipped with ${SKIP_MARKER}${fix ? `, ${fixed} fixed` : ""}).`,
    );
    if (problems) {
      console.error(`${problems} problem(s) in examples.`);
      process.exitCode = 1;
    }
  } finally {
    rmSync(TMP, { recursive: true, force: true });
  }
};

main();
