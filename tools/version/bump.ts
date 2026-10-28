// Usage: bun tools/version/bump.ts <site|clawdipedia-docs|clawdipedia-docs-cli|cc-inspect|all> <patch|minor|major>
//        (also: bun run version:bump -- <target> <level>, or: just bump <target> <level>)
// Bumps the version in every file of a target, and sets the Claude Code version that the marketplace
// texts name to CLAUDE_CODE_VERSION. plugin:check runs versionProblems, so a missed file fails verify.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CLAUDE_CODE_VERSION } from "../../src/version.ts";

export type Level = "patch" | "minor" | "major";
type Json = Record<string, unknown>;
/** A file and the key path of its version. */
type Slot = { file: string; path: string[] };

export const MARKETPLACE = ".claude-plugin/marketplace.json";
/** Plugin manifests whose description names the Claude Code version. */
const PLUGIN_MANIFESTS = [
  "plugin/.claude-plugin/plugin.json",
  "cli/.claude-plugin/plugin.json",
];
/** Skill bodies that tell the model which Claude Code version the `clawdipedia` source covers. */
export const SKILL_FILES = [
  "plugin/skills/clawdipedia-docs/SKILL.md",
  "cli/skills/clawdipedia-docs-cli/SKILL.md",
];
export const TARGETS: Record<string, Slot[]> = {
  site: [{ file: "package.json", path: ["version"] }],
  "clawdipedia-docs": [
    { file: "plugin/.claude-plugin/plugin.json", path: ["version"] },
    { file: "plugin/mcp/package.json", path: ["version"] },
    { file: MARKETPLACE, path: ["metadata", "version"] },
  ],
  "clawdipedia-docs-cli": [
    { file: "cli/.claude-plugin/plugin.json", path: ["version"] },
    { file: "cli/package.json", path: ["version"] },
  ],
  "cc-inspect": [
    { file: "inspect/.claude-plugin/plugin.json", path: ["version"] },
    { file: "inspect/mcp/package.json", path: ["version"] },
  ],
};

export const bumpVersion = (v: string, level: Level): string => {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v);
  if (!m) throw new Error(`not a version: ${v}`);
  const [x, y, z] = m.slice(1).map(Number) as [number, number, number];
  return level === "major"
    ? `${x + 1}.0.0`
    : level === "minor"
      ? `${x}.${y + 1}.0`
      : `${x}.${y}.${z + 1}`;
};

const get = (doc: Json, path: string[]): unknown =>
  path.reduce<unknown>((o, k) => (o as Json | undefined)?.[k], doc);

/** The Claude Code versions (`2.1.x`) named in the marketplace texts. */
const ccVersions = (market: Json): string[] =>
  JSON.stringify([market["description"], market["plugins"]]).match(
    /\b2\.\d+\.\d+\b/g,
  ) ?? [];

const CC_VERSION_RE = /\b2\.\d+\.\d+\b/g;

/**
 * The text with the Claude Code version of every `"description"` line set to `CLAUDE_CODE_VERSION`.
 * Only those lines, because a plugin version such as `2.0.0` looks the same to the pattern.
 */
export const syncDescriptions = (text: string): string =>
  text.replace(/^.*"description".*$/gm, (line) =>
    line.replace(CC_VERSION_RE, CLAUDE_CODE_VERSION),
  );

/** The text with every Claude Code version set to `CLAUDE_CODE_VERSION`. For a skill body, which holds no plugin version. */
export const syncVersions = (text: string): string =>
  text.replace(CC_VERSION_RE, CLAUDE_CODE_VERSION);

/** Each target whose files hold different versions, and each marketplace text with an old Claude Code version. */
export const versionProblems = (read: (file: string) => Json): string[] => {
  const out: string[] = [];
  for (const [name, slots] of Object.entries(TARGETS)) {
    const got = slots.map(
      (s) => `${s.file}=${String(get(read(s.file), s.path))}`,
    );
    if (new Set(got.map((g) => g.split("=")[1])).size > 1)
      out.push(`${name} versions differ: ${got.join(", ")}`);
  }
  for (const v of new Set(ccVersions(read(MARKETPLACE))))
    if (v !== CLAUDE_CODE_VERSION)
      out.push(
        `${MARKETPLACE} names Claude Code ${v}, not ${CLAUDE_CODE_VERSION}: run "bun run version:bump"`,
      );
  return out;
};

if (import.meta.main) {
  const ROOT = join(import.meta.dir, "..", "..");
  const [target, level] = process.argv.slice(2);
  const names = target === "all" ? Object.keys(TARGETS) : [target ?? ""];
  if (
    (target !== undefined && !names.every((n) => n in TARGETS)) ||
    (target !== undefined && !["patch", "minor", "major"].includes(level ?? ""))
  ) {
    console.error(
      `usage: bun tools/version/bump.ts [<${[...Object.keys(TARGETS), "all"].join("|")}> <patch|minor|major>]`,
    );
    process.exit(2);
  }
  // Files keep their text; only the version values change, so the formatting stays.
  const texts = new Map<string, string>();
  const text = (f: string) =>
    texts.get(f) ?? readFileSync(join(ROOT, f), "utf8");
  for (const n of target === undefined ? [] : names)
    for (const s of TARGETS[n] as Slot[]) {
      const t = text(s.file);
      const old = String(get(JSON.parse(t), s.path));
      const next = bumpVersion(old, level as Level);
      const key = JSON.stringify(s.path.at(-1));
      const re = new RegExp(`(${key}:\\s*)"${old.replace(/\./g, "\\.")}"`);
      if (!re.test(t)) throw new Error(`${s.file}: no ${key} "${old}"`);
      texts.set(s.file, t.replace(re, `$1"${next}"`));
      console.log(`${s.file}: ${old} -> ${next}`);
    }
  // The marketplace and the plugin manifests name the Claude Code version in their descriptions.
  // A skill body names it in prose, and the model repeats it to the user.
  const sync: [files: string[], fn: (t: string) => string][] = [
    [[MARKETPLACE, ...PLUGIN_MANIFESTS], syncDescriptions],
    [SKILL_FILES, syncVersions],
  ];
  for (const [files, fn] of sync)
    for (const f of files) {
      const t = text(f);
      const next = fn(t);
      if (next !== t) {
        texts.set(f, next);
        console.log(`${f}: Claude Code version -> ${CLAUDE_CODE_VERSION}`);
      }
    }
  for (const [f, t] of texts) writeFileSync(join(ROOT, f), t);
  const left = versionProblems((f) => JSON.parse(text(f)));
  for (const p of left) console.error(p);
  process.exit(left.length ? 1 : 0);
}
