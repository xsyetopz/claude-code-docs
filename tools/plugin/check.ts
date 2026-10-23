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
import { versionProblems } from "../version/bump.ts";

const ROOT = join(import.meta.dir, "..", "..");
const ajv = new Ajv2020({ strict: true, strictTypes: false, allErrors: true });
addFormats(ajv);
for (const f of ["starts_with", "ends_with"]) ajv.addFormat(f, true);
ajv.addKeyword({ keyword: "x-managed-only", schemaType: "boolean" });
const read = (p: string) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
const problems: string[] = [];
/** The plugins of the marketplace: folder and skill name. */
const PLUGINS = [
  { dir: "plugin", skill: "claude-code-docs" },
  { dir: "inspect", skill: "cc-inspect" },
];

const targets: [string, string][] = [
  ...PLUGINS.map((p): [string, string] => [
    `${p.dir}/.claude-plugin/plugin.json`,
    "claude-code-plugin-manifest",
  ]),
  [".claude-plugin/marketplace.json", "claude-code-marketplace"],
];
for (const [file, kind] of targets) {
  const want = `https://xsyetopz.github.io/claude-code-docs/schemas/${kind}.json`;
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
  ...(
    read(".claude-plugin/marketplace.json").plugins as { name: string }[]
  ).map((p) => p.name),
];
for (const n of names)
  if (typeof n !== "string" || !n || /\s/.test(n) || RESERVED.test(n))
    problems.push(
      `plugin name "${String(n)}" is empty, has spaces, or is reserved`,
    );

problems.push(...versionProblems(read));

for (const f of PLUGINS.flatMap((p) => [
  `${p.dir}/.mcp.json`,
  `${p.dir}/skills/${p.skill}/SKILL.md`,
  `${p.dir}/mcp/dist/server.js`,
]))
  if (!existsSync(join(ROOT, f))) problems.push(`${f}: missing`);

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

for (const { dir } of PLUGINS) {
  const dist = `${dir}/mcp/dist/server.js`;
  // Server tests (stdio client against dist/server.js).
  if (existsSync(join(ROOT, dist))) {
    const t = Bun.spawnSync(["bun", "test", `${dir}/mcp/test`], { cwd: ROOT });
    if (t.exitCode !== 0)
      problems.push(
        `bun test ${dir}/mcp/test failed:\n${t.stderr.toString().trim()}`,
      );
  }
  // Freshness: dist/server.js must equal a fresh bundle of the sources (bun build is deterministic
  // for the same inputs and versions).
  const tmp = mkdtempSync(join(tmpdir(), "plugin-check-"));
  try {
    const bundle = join(tmp, "server.js");
    const b = Bun.spawnSync(
      [
        "bun",
        "build",
        `${dir}/mcp/src/server.ts`,
        "--target=bun",
        `--outfile=${bundle}`,
      ],
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
