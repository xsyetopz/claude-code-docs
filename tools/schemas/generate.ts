// Usage: bun tools/schemas/generate.ts [--bin <path-to-claude-binary>]
// Regenerates schemas/*.json from the zod validators embedded in the Claude Code binary (design D1, method A).
// Safety: the binary is only read. Its embedded modules are written to a temp dir, a capture line is appended to
// four of them, and a child bun process imports them with a fake key, a dead proxy, no real HOME, and no network.
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { CLAUDE_CODE_VERSION } from "../../src/version.ts";
import { buildFiles, type RawSchemas } from "./build.ts";
import { extractModules } from "./extract.ts";

const ROOT = join(import.meta.dir, "..", "..");
const SCHEMAS = join(ROOT, "schemas");

// `module` finds the schema's definition in a chunk; `expr` is the JS expression that evaluates to the zod schema there.
// `names` holds the expressions of earlier captures (same chunk), so a later anchor can refer to an earlier schema.
type Capture = {
  kind: string;
  internal?: boolean; // only used to anchor a later capture, not exported
  module: RegExp | ((names: Map<string, string>) => RegExp | null);
  expr: (m: RegExpMatchArray, src: string) => string | null;
};
const ID = String.raw`[\w$]+`;
const SCHEMA_DESC = String.raw`JSON Schema reference for editor autocomplete\/validation; ignored at load time`;
const lazy = (kind: string, after: string): Capture => ({
  kind,
  module: new RegExp(
    String.raw`(${ID})=${ID}\(\(\)=>${ID}\(\{\$schema:${after}`,
  ),
  expr: (m) => `${m[1]}()`,
});

// Stable anchors (text of descriptions and field order), never minified names.
const CAPTURES: Capture[] = [
  {
    // function X(e,n={}){let r=cc(e,n);return new Class(r).whole()}  +  function Y(){return list.filter((e)=>reg[e].buildGate())}
    kind: "settings",
    module: new RegExp(
      String.raw`function (${ID})\((${ID}),(${ID})=\{\}\)\{let (${ID})=${ID}\(\2,\3\);return new ${ID}\(\4\)\.whole\(\)\}`,
    ),
    expr: (m, src) => {
      const gate = src.match(
        new RegExp(
          String.raw`function (${ID})\(\)\{return ${ID}\.filter\(\((${ID})\)=>${ID}\[\2\]\.buildGate\(\)\)\}`,
        ),
      );
      return gate ? `${m[1]}(${gate[1]}())` : null;
    },
  },
  // The base object (name, version, author, ...). The full manifest merges its shape with the component objects.
  {
    ...lazy(
      "plugin-manifest-base",
      String.raw`${ID}\(\)\.optional\(\)\.describe\("${SCHEMA_DESC}"\),name:${ID}\(\)\.describe\("Unique identifier for the plugin`,
    ),
    internal: true,
  },
  {
    kind: "plugin-manifest",
    module: (names) => {
      const base = names.get("plugin-manifest-base")?.replace(/\(\)$/, "");
      return base
        ? new RegExp(
            String.raw`(${ID})=${ID}\(\(\)=>${ID}\(\{\.\.\.${base.replace(/\$/g, "\\$")}\(\)\.shape,`,
          )
        : null;
    },
    expr: (m) => `${m[1]}()`,
  },
  {
    // The marketplace file keeps plugins as unknown[] and checks each entry afterwards with this schema.
    kind: "marketplace-plugin-entry",
    module: new RegExp(
      String.raw`function ${ID}\((${ID})\)\{let (${ID})=(${ID})\(\);return \1\.flatMap\(\((${ID}),(${ID})\)=>\{let (${ID})=\2\.safeParse\(\4\)`,
    ),
    expr: (m) => `${m[3]}()`,
  },
  lazy(
    "marketplace",
    String.raw`${ID}\(\)\.optional\(\)\.describe\("${SCHEMA_DESC}"\),name:${ID}\(${ID}\),version:${ID}\(\)\.optional\(\)\.describe\("Marketplace manifest version"`,
  ),
  lazy(
    "plugin-hooks",
    String.raw`${ID}\(\)\.optional\(\)\.catch\(void 0\)\.describe\("${SCHEMA_DESC}"\),description:`,
  ),
  lazy(
    "keybindings",
    String.raw`${ID}\(\)\.optional\(\)\.describe\("JSON Schema URL for editor validation"\),\$docs:`,
  ),
];

const findBinary = (): string => {
  const i = process.argv.indexOf("--bin");
  const bin =
    i >= 0
      ? (process.argv[i + 1] ?? "")
      : join(homedir(), ".local/share/claude/versions", CLAUDE_CODE_VERSION);
  if (!existsSync(bin))
    throw new Error(`Claude Code ${CLAUDE_CODE_VERSION} not found at ${bin}`);
  return bin;
};

const baseName = (name: string) => name.slice(name.lastIndexOf("/") + 1);

const bin = findBinary();
const work = realpathSync(mkdtempSync(join(tmpdir(), "cc-schemas-")));
try {
  const { modules } = extractModules(bin);
  const rootDir = join(work, "root");
  mkdirSync(rootDir);
  const patched = new Set<string>();
  const kinds: string[] = [];
  const found = new Map<string, string>();
  const names = new Map<string, string>();
  for (const mod of modules) {
    if (!mod.name.endsWith(".js")) continue;
    // Modules import each other as "/$bunfs/root/chunk-x.js"; point them at the temp dir. Drop the bytecode pragma.
    let src = mod.source
      .replace(/^\/\/ @bun @bytecode/, "// @bun")
      .replace(/(from|import\(?|require\()\s*"\/\$bunfs\/root\//g, '$1"./');
    let tail = "";
    for (const cap of CAPTURES) {
      const re =
        typeof cap.module === "function" ? cap.module(names) : cap.module;
      const m = re ? src.match(re) : null;
      if (!m) continue;
      const expr = cap.expr(m, src);
      if (!expr) continue;
      if (found.has(cap.kind))
        throw new Error(
          `anchor for "${cap.kind}" matches both ${found.get(cap.kind)} and ${mod.name}`,
        );
      found.set(cap.kind, mod.name);
      names.set(cap.kind, expr);
      if (!cap.internal) kinds.push(cap.kind);
      tail += `;(globalThis.__ccSchemas??={})[${JSON.stringify(cap.kind)}]=()=>${expr};\n`;
    }
    if (tail) {
      src += `\n${tail}`;
      patched.add(baseName(mod.name));
    }
    writeFileSync(join(rootDir, baseName(mod.name)), src);
  }
  for (const cap of CAPTURES)
    if (!found.has(cap.kind))
      throw new Error(`no module matches the anchor for "${cap.kind}"`);
  writeFileSync(
    join(work, "manifest.json"),
    JSON.stringify({ modules: [...patched], kinds }),
  );

  const home = join(work, "home");
  const cfg = join(work, "config");
  mkdirSync(home);
  mkdirSync(cfg);
  const dead = "http://127.0.0.1:9";
  const out = join(work, "raw.json");
  // Network is denied by the OS sandbox, not just by a dead proxy. PATH is an empty folder, so the child
  // cannot reach /usr/bin/security (keychain) or any other tool.
  const emptyBin = join(work, "empty-bin");
  mkdirSync(emptyBin);
  if (process.platform !== "darwin" || !existsSync("/usr/bin/sandbox-exec"))
    throw new Error(
      "schemas: needs macOS /usr/bin/sandbox-exec to run the binary's modules with the network denied",
    );
  const child = Bun.spawnSync(
    [
      "/usr/bin/sandbox-exec",
      "-p",
      "(version 1)(allow default)(deny network*)",
      process.execPath,
      join(import.meta.dir, "driver.ts"),
      work,
      out,
    ],
    {
      cwd: work,
      // Nothing from the real environment: no credentials, no config dir, all traffic points at a closed port.
      env: {
        PATH: emptyBin,
        HOME: home,
        TMPDIR: work,
        CLAUDE_CONFIG_DIR: cfg,
        ANTHROPIC_API_KEY: "sk-ant-fake-schema-gen",
        ANTHROPIC_BASE_URL: dead,
        HTTPS_PROXY: dead,
        HTTP_PROXY: dead,
        ALL_PROXY: dead,
        NO_PROXY: "",
        // The one settings key (xaaIdp) the binary only adds when this variable is set. Without it the schema lacks the key.
        CLAUDE_CODE_ENABLE_XAA: "1",
        DISABLE_AUTOUPDATER: "1",
        DISABLE_TELEMETRY: "1",
        CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1",
      },
      timeout: 120_000,
      stdout: "pipe",
      stderr: "pipe",
    },
  );
  if (child.exitCode !== 0) {
    throw new Error(
      `schema driver failed (exit ${child.exitCode}):\n${child.stderr.toString().slice(0, 4000)}`,
    );
  }
  const { schemas: raw, lossy } = JSON.parse(readFileSync(out, "utf8")) as {
    schemas: RawSchemas;
    lossy: string[];
  };
  mkdirSync(SCHEMAS, { recursive: true });
  const files = buildFiles(raw, CLAUDE_CODE_VERSION);
  for (const [name, json] of Object.entries(files))
    writeFileSync(join(SCHEMAS, name), `${JSON.stringify(json, null, 2)}\n`);
  // Match the repo formatter so regenerating leaves a clean diff.
  const fmt = Bun.spawnSync(
    [
      join(ROOT, "node_modules/.bin/biome"),
      "format",
      "--write",
      ...Object.keys(files).map((n) => join(SCHEMAS, n)),
    ],
    { cwd: ROOT, stdout: "pipe", stderr: "pipe" },
  );
  if (fmt.exitCode !== 0)
    throw new Error(`biome format failed:\n${fmt.stderr.toString()}`);
  for (const l of lossy)
    console.log(`  not representable (emitted as {}): ${l}`);
  console.log(`wrote ${Object.keys(files).length} schemas to ${SCHEMAS}`);
  for (const [kind, mod] of found)
    console.log(`  ${kind}: captured from ${mod}`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
