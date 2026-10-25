// Usage: bun tools/schemas/observe/user.ts <out-dir> [--home <dir>]
// Reads local Claude Code files (read-only) and records, value-free, the key paths and JSON types in them:
//   user-transcripts.json   <home>/.claude/projects/**/*.jsonl, rooted at the line's `type`
//   user-claude-json.json   <home>/.claude.json, root `$root`
//   user-frontmatter.json   YAML headers of skill, command, agent, and output style .md files under <home>/.claude
// The raw output holds key names of the user's data (project paths in .claude.json); it is a temp file for
// observe/run.ts, which keeps only paths that are fields of a schema and never a value.
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { Tally } from "../observe.ts";

const outDir = process.argv[2];
const hi = process.argv.indexOf("--home");
const home = hi >= 0 ? (process.argv[hi + 1] as string) : homedir();
if (!outDir) throw new Error("usage: <out-dir> [--home <dir>]");
mkdirSync(outDir, { recursive: true });

const files = (
  dir: string,
  keep: (p: string) => boolean,
  depth = 0,
): string[] => {
  if (!existsSync(dir) || depth > 9) return [];
  const out: string[] = [];
  for (const e of readdirSync(dir).sort()) {
    if (e === "node_modules" || e.startsWith(".")) continue;
    const p = join(dir, e);
    let st: ReturnType<typeof statSync>;
    try {
      st = statSync(p);
    } catch {
      continue;
    }
    if (st.isDirectory()) out.push(...files(p, keep, depth + 1));
    else if (keep(p)) out.push(p);
  }
  return out;
};
const write = (name: string, counts: object, t: Tally): void =>
  writeFileSync(
    join(outDir as string, name),
    `${JSON.stringify({ counts, paths: t }, null, 1)}\n`,
  );

// Transcripts.
{
  const t = new Tally();
  const fs = files(join(home, ".claude", "projects"), (p) =>
    p.endsWith(".jsonl"),
  );
  let lines = 0;
  for (const f of fs)
    for (const l of readFileSync(f, "utf8").split("\n")) {
      if (!l) continue;
      try {
        const j = JSON.parse(l) as Record<string, unknown>;
        if (!j || typeof j !== "object" || Array.isArray(j)) continue;
        lines++;
        t.add(typeof j["type"] === "string" ? j["type"] : "?", j);
      } catch {
        // not JSON
      }
    }
  write("user-transcripts.json", { files: fs.length, lines }, t);
  console.log(`transcripts: files=${fs.length} lines=${lines}`);
}

// ~/.claude.json
{
  const t = new Tally();
  const p = join(home, ".claude.json");
  if (existsSync(p))
    t.add("$root", JSON.parse(readFileSync(p, "utf8")) as unknown);
  write("user-claude-json.json", { files: existsSync(p) ? 1 : 0 }, t);
  console.log(`claude.json: files=${existsSync(p) ? 1 : 0}`);
}

// Frontmatter: skills (SKILL.md) and commands are one schema def; agents and output styles have their own.
{
  const t = new Tally();
  const counts: Record<string, number> = {
    skill: 0,
    agent: 0,
    "output-style": 0,
  };
  const kindOf = (p: string): string | undefined => {
    if (!p.endsWith(".md")) return undefined;
    if (p.includes("/output-styles/")) return "output-style";
    if (p.includes("/agents/")) return "agent";
    if (/\/skills\/[^/]+\/SKILL\.md$/.test(p) || p.includes("/commands/"))
      return "skill";
    return undefined;
  };
  for (const f of files(
    join(home, ".claude"),
    (p) => kindOf(p) !== undefined,
  )) {
    const kind = kindOf(f) as string;
    const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(f, "utf8"));
    if (!m) continue;
    try {
      const y = Bun.YAML.parse(m[1] as string) as unknown;
      if (y && typeof y === "object" && !Array.isArray(y)) {
        t.add(kind, y);
        counts[kind] = (counts[kind] ?? 0) + 1;
      }
    } catch {
      // not YAML
    }
  }
  write("user-frontmatter.json", counts, t);
  console.log(`frontmatter: ${JSON.stringify(counts)}`);
}
