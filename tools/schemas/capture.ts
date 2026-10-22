// Shared by generate.ts (schemas/) and tools/reference/zod.ts (payload models).
// Safety: the binary is only read. Its embedded modules are written to a temp dir, capture lines are appended to
// some of them, and a child bun process imports them with a fake key, a dead proxy, no real HOME, and no network.
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
import { extractModules } from "./extract.ts";

// `module` finds the schema's definition in a chunk; `expr` is the JS expression that evaluates to the zod schema there.
// `names` holds the expressions of earlier captures (same chunk), so a later anchor can refer to an earlier schema.
// `rewrite` changes the chunk's source before the capture line is appended (for values that are only local variables).
// A capture's expression may also evaluate to a plain value that holds schemas (array or object): the driver
// converts every schema inside it.
export type Capture = {
  kind: string;
  internal?: boolean; // only used to anchor a later capture, not exported
  module: RegExp | ((names: Map<string, string>) => RegExp | null);
  expr: (m: RegExpMatchArray, src: string) => string | null;
  rewrite?: (src: string, m: RegExpMatchArray) => string;
  // Also import every module whose source matches (the capture only fills in when those modules run).
  // Share repeated sub-schemas through $defs ("ref") instead of copying them in place ("inline", the default).
  reused?: "ref";
  // It gets the match and the name of the module the capture was found in.
  alsoImport?: (m: RegExpMatchArray, moduleName: string) => RegExp;
};
export const ID = String.raw`[\w$]+`;

// `--bin <path>` or the installed binary of the version in src/version.ts.
export const findBinary = (): string => {
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

export type Captured = {
  raw: Record<string, unknown>;
  lossy: string[];
  found: Map<string, string>;
};

export const runCapture = (bin: string, captures: Capture[]): Captured => {
  const work = realpathSync(mkdtempSync(join(tmpdir(), "cc-schemas-")));
  try {
    const { modules } = extractModules(bin);
    const rootDir = join(work, "root");
    mkdirSync(rootDir);
    const patched = new Set<string>();
    const kinds: string[] = [];
    const refKinds: string[] = [];
    const found = new Map<string, string>();
    const names = new Map<string, string>();
    const importers = new Map<string, RegExp>();
    for (const mod of modules) {
      // Assets (text, wasm) that modules import by path sit beside them.
      if (!mod.name.endsWith(".js")) {
        writeFileSync(join(rootDir, baseName(mod.name)), mod.bytes);
        continue;
      }
      // Modules import each other as "/$bunfs/root/chunk-x.js"; point them at the temp dir. Drop the bytecode pragma.
      let src = mod.source
        .replace(/^\/\/ @bun @bytecode/, "// @bun")
        .replace(/(from|import\(?|require\()\s*"\/\$bunfs\/root\//g, '$1"./')
        // Embedded assets are also named by path in plain calls: Be("/$bunfs/root/x.txt").
        .replace(/\(\s*"\/\$bunfs\/root\//g, '("./');
      let tail = "";
      for (const cap of captures) {
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
        if (cap.reused) refKinds.push(cap.kind);
        if (cap.alsoImport)
          importers.set(cap.kind, cap.alsoImport(m, baseName(mod.name)));
        if (cap.rewrite) src = cap.rewrite(src, m);
        tail += `;(globalThis.__ccSchemas??={})[${JSON.stringify(cap.kind)}]=()=>${expr};\n`;
      }
      if (tail) {
        src += `\n${tail}`;
        patched.add(baseName(mod.name));
      }
      writeFileSync(join(rootDir, baseName(mod.name)), src);
    }
    for (const cap of captures)
      if (!found.has(cap.kind))
        throw new Error(`no module matches the anchor for "${cap.kind}"`);
    for (const [kind, re] of importers) {
      for (const mod of modules)
        if (mod.name.endsWith(".js") && re.test(mod.source))
          patched.add(baseName(mod.name));
      void kind;
    }
    writeFileSync(
      join(work, "manifest.json"),
      JSON.stringify({ modules: [...patched], kinds, refKinds }),
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
      schemas: Record<string, unknown>;
      lossy: string[];
    };
    return { raw, lossy, found };
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
};
