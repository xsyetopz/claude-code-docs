// Usage: bun tools/plugin/check.ts   (also: bun run plugin:check)
// Validates each plugin manifest and the marketplace file against schemas/ with ajv, and checks
// that each plugin's .mcp.json, skill, and committed server bundle exist, pass their tests, and are fresh.
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
import { SCHEMA_NAMES, TYPE_FILE } from "../../plugin/mcp/src/content.ts";
import { CLAUDE_CODE_VERSION } from "../../src/version.ts";
import { MARKETPLACE, SKILL_FILES, versionProblems } from "../version/bump.ts";

const ROOT = join(import.meta.dir, "..", "..");
const ajv = new Ajv2020({ strict: true, strictTypes: false, allErrors: true });
addFormats(ajv);
for (const f of ["starts_with", "ends_with"]) ajv.addFormat(f, true);
ajv.addKeyword({ keyword: "x-managed-only", schemaType: "boolean" });
const read = (p: string) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
const problems: string[] = [];
/** The plugins of the marketplace: folder, skill, bundle source and output, tests, and whether it has an MCP server. */
const PLUGINS = [
  {
    dir: "plugin",
    skill: "clawdipedia-docs",
    src: "plugin/mcp/src/server.ts",
    out: "plugin/mcp/dist/server.js",
    test: "plugin/mcp/test",
    mcp: true,
  },
  {
    dir: "inspect",
    skill: "cc-inspect",
    src: "inspect/mcp/src/server.ts",
    out: "inspect/mcp/dist/server.js",
    test: "inspect/mcp/test",
    mcp: true,
  },
  {
    dir: "cli",
    skill: "clawdipedia-docs-cli",
    src: "cli/src/cli.ts",
    out: "cli/bin/clawdipedia",
    test: "cli/test",
    mcp: false,
  },
];

const targets: [string, string][] = [
  ...PLUGINS.map((p): [string, string] => [
    `${p.dir}/.claude-plugin/plugin.json`,
    "claude-code-plugin-manifest",
  ]),
  [MARKETPLACE, "claude-code-marketplace"],
];
for (const [file, kind] of targets) {
  const want = `https://clawdipedia.cc/schemas/${kind}.json`;
  const check =
    ajv.getSchema(want) ?? ajv.compile(read(`schemas/${kind}.json`));
  const doc = read(file);
  if (!check(doc))
    for (const e of check.errors ?? [])
      problems.push(`${file}: ${e.instancePath || "/"} ${e.message}`);
  if (doc["$schema"] !== want)
    problems.push(`${file}: $schema should be ${want}`);
}
// Reserved plugin names, per docs/extend/plugins/manifest.md (Top-Level Keys, `name`).
const RESERVED =
  /^(claude-|anthropic-|anthropics-|cc-plugin-)|^(claude|anthropic|claude-code|claude-mods)$/;
const names = [
  ...PLUGINS.map((p) => read(`${p.dir}/.claude-plugin/plugin.json`).name),
  ...(read(MARKETPLACE).plugins as { name: string }[]).map((p) => p.name),
];
for (const n of names)
  if (typeof n !== "string" || !n || /\s/.test(n) || RESERVED.test(n))
    problems.push(
      `plugin name "${String(n)}" is empty, has spaces, or is reserved`,
    );

problems.push(...versionProblems(read));

// A manifest description must not name a Claude Code version other than src/version.ts.
for (const p of PLUGINS) {
  const file = `${p.dir}/.claude-plugin/plugin.json`;
  const text = String(read(file).description ?? "");
  for (const v of new Set(text.match(/\b2\.\d+\.\d+\b/g) ?? []))
    if (v !== CLAUDE_CODE_VERSION)
      problems.push(
        `${file}: description names Claude Code ${v}, but src/version.ts has ${CLAUDE_CODE_VERSION}: run "bun run version:bump"`,
      );
}
// A skill body tells the model which version the `clawdipedia` source covers, so it must match too.
for (const file of SKILL_FILES) {
  const text = readFileSync(join(ROOT, file), "utf8");
  for (const v of new Set(text.match(/\b2\.\d+\.\d+\b/g) ?? []))
    if (v !== CLAUDE_CODE_VERSION)
      problems.push(
        `${file}: names Claude Code ${v}, but src/version.ts has ${CLAUDE_CODE_VERSION}: run "bun run version:bump"`,
      );
}

// Every description goes into the model's context on each session, so each one stays short.
const DESCRIPTION_MAX = 200;
const market = read(MARKETPLACE) as {
  description?: unknown;
  plugins?: { name?: string; description?: unknown }[];
};
const descriptions: [where: string, text: string][] = [
  [MARKETPLACE, String(market.description ?? "")],
  ...(market.plugins ?? []).map((p): [string, string] => [
    `${MARKETPLACE} ${String(p.name)}`,
    String(p.description ?? ""),
  ]),
  ...PLUGINS.map((p): [string, string] => [
    `${p.dir}/.claude-plugin/plugin.json`,
    String(read(`${p.dir}/.claude-plugin/plugin.json`).description ?? ""),
  ]),
  ...PLUGINS.map((p): [string, string] => {
    const file = `${p.dir}/skills/${p.skill}/SKILL.md`;
    const body = existsSync(join(ROOT, file))
      ? readFileSync(join(ROOT, file), "utf8")
      : "";
    return [file, /^description:[ \t]*(.*)$/m.exec(body)?.[1]?.trim() ?? ""];
  }),
];
for (const [where, text] of descriptions)
  if (text.length > DESCRIPTION_MAX)
    problems.push(
      `${where}: description is ${text.length} characters, over ${DESCRIPTION_MAX}`,
    );

for (const p of PLUGINS) {
  for (const f of [`${p.dir}/skills/${p.skill}/SKILL.md`, p.out])
    if (!existsSync(join(ROOT, f))) problems.push(`${f}: missing`);
  // The CLI plugin adds no tool list, so it has no .mcp.json.
  if (existsSync(join(ROOT, p.dir, ".mcp.json")) !== p.mcp)
    problems.push(
      `${p.dir}/.mcp.json: ${p.mcp ? "missing" : "must not exist (no MCP server)"}`,
    );
}
// The command ships only in cli/, so the MCP plugin puts nothing on the Bash PATH.
if (existsSync(join(ROOT, "plugin", "bin")))
  problems.push("plugin/bin: must not exist (the command is in cli/)");

// The claude CLI validates both manifests offline when it is on PATH. No credentials are passed.
if (Bun.which("claude")) {
  for (const target of [".", ...PLUGINS.map((p) => `./${p.dir}`)]) {
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

for (const { dir, src, out: dist, test } of PLUGINS) {
  // Tests run against the committed bundle.
  if (existsSync(join(ROOT, dist))) {
    const t = Bun.spawnSync(["bun", "test", test], { cwd: ROOT });
    if (t.exitCode !== 0)
      problems.push(`bun test ${test} failed:\n${t.stderr.toString().trim()}`);
  }
  // Freshness: the bundle must equal a fresh bundle of the sources (bun build is deterministic
  // for the same inputs and versions).
  const tmp = mkdtempSync(join(tmpdir(), "plugin-check-"));
  try {
    const bundle = join(tmp, "bundle.js");
    const b = Bun.spawnSync(
      ["bun", "build", src, "--target=bun", `--outfile=${bundle}`],
      { cwd: ROOT },
    );
    if (b.exitCode !== 0)
      problems.push(`bundle ${dir}: ${b.stderr.toString().trim()}`);
    else if (!existsSync(join(ROOT, dist)))
      problems.push(`${dist} is missing: run "bun run plugin:build"`);
    else if (!readFileSync(bundle).equals(readFileSync(join(ROOT, dist))))
      problems.push(`${dist} is stale: run "bun run plugin:build"`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

// Contract with the built site: what the server fetches must exist in build/.
if (existsSync(join(ROOT, "build", "llms-manifest.json"))) {
  const manifest = JSON.parse(
    readFileSync(join(ROOT, "build", "llms-manifest.json"), "utf8"),
  ) as { route: string }[];
  for (const { route } of manifest) {
    const rel = route === "/" ? "index" : route.replace(/^\/+|\/+$/g, "");
    if (!existsSync(join(ROOT, "build", `${rel}.md`)))
      problems.push(`build/${rel}.md: missing for manifest route ${route}`);
  }
  const dir = join(ROOT, "build", "schemas");
  const built = existsSync(dir)
    ? readdirSync(dir)
        // surface.json is the item snapshot, not a schema that get_schema serves
        .filter((f) => f.endsWith(".json") && f !== "surface.json")
        .map((f) => f.slice(0, -5))
        .sort()
    : [];
  if (JSON.stringify(built) !== JSON.stringify([...SCHEMA_NAMES].sort()))
    problems.push(
      `SCHEMA_NAMES (${[...SCHEMA_NAMES].sort().join(", ")}) differs from build/schemas/ (${built.join(", ")})`,
    );
  if (!existsSync(join(dir, TYPE_FILE)))
    problems.push(
      `build/schemas/${TYPE_FILE}: missing, so get_schema "types" fails`,
    );
} else
  console.warn(
    'plugin:check: build/ missing, skipped site contract check (run "bun run build")',
  );

if (problems.length) {
  for (const p of problems) console.error(`plugin:check: ${p}`);
  process.exit(1);
}
console.log("plugin:check: manifests valid, plugin files present");
