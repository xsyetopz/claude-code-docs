// Usage: bun tools/plugin/check.ts   (also: bun run plugin:check)
// Validates the plugin manifest and the marketplace file against schemas/ with ajv, and checks
// that .mcp.json, the skill, and the committed server bundle exist.
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const ROOT = join(import.meta.dir, "..", "..");
const ajv = new Ajv2020({ strict: true, strictTypes: false, allErrors: true });
addFormats(ajv);
for (const f of ["starts_with", "ends_with"]) ajv.addFormat(f, true);
ajv.addKeyword({ keyword: "x-managed-only", schemaType: "boolean" });
const read = (p: string) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
const problems: string[] = [];

const targets: [string, string][] = [
  ["plugin/.claude-plugin/plugin.json", "claude-code-plugin-manifest"],
  [".claude-plugin/marketplace.json", "claude-code-marketplace"],
];
for (const [file, kind] of targets) {
  const check = ajv.compile(read(`schemas/${kind}.json`));
  const doc = read(file);
  if (!check(doc))
    for (const e of check.errors ?? [])
      problems.push(`${file}: ${e.instancePath || "/"} ${e.message}`);
  const want = `https://xsyetopz.github.io/claude-code-docs/schemas/${kind}.json`;
  if (doc["$schema"] !== want)
    problems.push(`${file}: $schema should be ${want}`);
}
// Reserved plugin names, per docs/extend/plugins/manifest.md (Top-Level Keys, `name`).
const RESERVED =
  /^(claude-|anthropic-|anthropics-|cc-plugin-)|^(claude|anthropic|claude-code|claude-mods)$/;
const names = [
  read("plugin/.claude-plugin/plugin.json").name,
  ...(
    read(".claude-plugin/marketplace.json").plugins as { name: string }[]
  ).map((p) => p.name),
];
for (const n of names)
  if (typeof n !== "string" || !n || /\s/.test(n) || RESERVED.test(n))
    problems.push(
      `plugin name "${String(n)}" is empty, has spaces, or is reserved`,
    );

for (const f of [
  "plugin/.mcp.json",
  "plugin/skills/claude-code-docs/SKILL.md",
  "plugin/mcp/dist/server.js",
  "plugin/mcp/snapshot/manifest.json",
])
  if (!existsSync(join(ROOT, f))) problems.push(`${f}: missing`);

// The claude CLI validates both manifests offline when it is on PATH. No credentials are passed.
if (Bun.which("claude")) {
  for (const target of [".", "./plugin"]) {
    const r = Bun.spawnSync(["claude", "plugin", "validate", target], {
      cwd: ROOT,
    });
    if (r.exitCode !== 0)
      problems.push(
        `claude plugin validate ${target}: ${(r.stdout.toString() + r.stderr.toString()).trim()}`,
      );
  }
} else
  console.warn(
    "plugin:check: claude CLI not on PATH, skipped claude plugin validate",
  );

// Server tests (stdio client against dist/server.js, with a hostile local site).
if (existsSync(join(ROOT, "plugin/mcp/dist/server.js"))) {
  const t = Bun.spawnSync(["bun", "test", "plugin/mcp/test"], { cwd: ROOT });
  if (t.exitCode !== 0)
    problems.push(
      `bun test plugin/mcp/test failed:\n${t.stderr.toString().trim()}`,
    );
}

// Freshness: the committed snapshot must equal a fresh snapshot of build/, and dist/server.js must
// equal a fresh bundle of the sources (bun build is deterministic for the same inputs and versions).
const files = (dir: string, rel = ""): string[] =>
  readdirSync(join(dir, rel), { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? files(dir, join(rel, d.name)) : [join(rel, d.name)],
  );
if (existsSync(join(ROOT, "build", "llms-manifest.json"))) {
  const tmp = mkdtempSync(join(tmpdir(), "plugin-check-"));
  try {
    const snap = join(tmp, "snapshot");
    const a = Bun.spawnSync(
      ["bun", "tools/plugin-snapshot.ts", "--out", snap],
      { cwd: ROOT },
    );
    if (a.exitCode !== 0)
      problems.push(`snapshot: ${a.stderr.toString().trim()}`);
    else {
      const cur = join(ROOT, "plugin/mcp/snapshot");
      const want = files(snap).sort();
      const have = existsSync(cur) ? files(cur).sort() : [];
      const stale =
        want.length !== have.length ||
        want.some(
          (f, i) =>
            f !== have[i] ||
            !readFileSync(join(snap, f)).equals(readFileSync(join(cur, f))),
        );
      if (stale)
        problems.push(
          'plugin/mcp/snapshot is stale: run "bun run build && bun run plugin:snapshot"',
        );
    }
    const bundle = join(tmp, "server.js");
    const b = Bun.spawnSync(
      [
        "bun",
        "build",
        "plugin/mcp/src/server.ts",
        "--target=bun",
        `--outfile=${bundle}`,
      ],
      { cwd: ROOT },
    );
    if (b.exitCode !== 0)
      problems.push(`bundle: ${b.stderr.toString().trim()}`);
    else if (
      !readFileSync(bundle).equals(
        readFileSync(join(ROOT, "plugin/mcp/dist/server.js")),
      )
    )
      problems.push(
        'plugin/mcp/dist/server.js is stale: run "bun run plugin:build"',
      );
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
} else
  console.warn(
    'plugin:check: build/ missing, skipped freshness checks (run "bun run build")',
  );

if (problems.length) {
  for (const p of problems) console.error(`plugin:check: ${p}`);
  process.exit(1);
}
console.log("plugin:check: manifests valid, plugin files present");
