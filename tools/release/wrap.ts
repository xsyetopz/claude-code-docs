// release:schemas and release:prompts - thin wrappers over the existing generators.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { CLAUDE_CODE_VERSION } from "../../src/version.ts";
import {
  binaryPath,
  type Ctx,
  DEFAULT_PROMPT,
  ROOT,
  toolEnv,
  versionDir,
  writeJson,
} from "./util.ts";

const bunPath = process.execPath;
const clean = (extra: Record<string, string> = {}): Record<string, string> => ({
  ...toolEnv(),
  PATH: `${bunPath.slice(0, bunPath.lastIndexOf("/"))}:${toolEnv()["PATH"]}`,
  ...extra,
});

const needBinary = (v: string): string => {
  const bin = binaryPath(v);
  if (!v || !existsSync(bin)) throw new Error(`no binary for ${v || "--to"}`);
  return bin;
};

// ---- schema diff -------------------------------------------------------------------------------------------

/** Flatten JSON to `path -> compact leaf` so two schemas can be compared key by key. */
const flatten = (v: unknown, path = "", out = new Map<string, string>()) => {
  if (v && typeof v === "object") {
    const entries = Array.isArray(v)
      ? v.map((x, i) => [String(i), x] as const)
      : Object.entries(v);
    if (!entries.length) out.set(path, Array.isArray(v) ? "[]" : "{}");
    for (const [k, x] of entries) flatten(x, path ? `${path}.${k}` : k, out);
  } else out.set(path, JSON.stringify(v));
  return out;
};
const cut = (s: string) => (s.length > 200 ? `${s.slice(0, 200)}...` : s);

export const diffJson = (oldText: string | null, newText: string | null) => {
  const a = oldText ? flatten(JSON.parse(oldText)) : new Map<string, string>();
  const b = newText ? flatten(JSON.parse(newText)) : new Map<string, string>();
  return {
    added: [...b.keys()].filter((k) => !a.has(k)),
    removed: [...a.keys()].filter((k) => !b.has(k)),
    changed: [...b]
      .filter(([k, v]) => a.has(k) && a.get(k) !== v)
      .map(([path, v]) => ({ path, old: cut(a.get(path) ?? ""), new: cut(v) })),
  };
};

export const gitHead = (rel: string): string | null => {
  const r = Bun.spawnSync(["git", "show", `HEAD:${rel}`], {
    cwd: ROOT,
    env: toolEnv(),
  });
  return r.exitCode === 0 ? r.stdout.toString() : null;
};

export const runSchemas = async (ctx: Ctx): Promise<number> => {
  const bin = needBinary(ctx.to);
  const argv = [bunPath, "tools/schemas/generate.ts", "--bin", bin];
  if (CLAUDE_CODE_VERSION !== ctx.to)
    console.warn(
      `warning: the generator stamps src/version.ts (${CLAUDE_CODE_VERSION}) into the schemas, not --to ${ctx.to}. Bump src/version.ts before committing them.`,
    );
  console.log(`release:schemas -> ${argv.slice(1).join(" ")}`);
  if (ctx.dry) return 0;
  const dir = join(ROOT, "schemas");
  const files = existsSync(dir)
    ? readdirSync(dir).filter((n) => n.endsWith(".json"))
    : [];
  const before = new Map(files.map((n) => [n, gitHead(`schemas/${n}`)]));
  const r = Bun.spawnSync(argv, {
    cwd: ROOT,
    env: clean(),
    stdout: "inherit",
    stderr: "inherit",
  });
  if (r.exitCode !== 0) return r.exitCode ?? 1;
  const report: Record<string, ReturnType<typeof diffJson>> = {};
  for (const n of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const d = diffJson(
      before.get(n) ?? gitHead(`schemas/${n}`),
      readFileSync(join(dir, n), "utf8"),
    );
    report[n] = d;
    console.log(
      `  ${n}: +${d.added.length} -${d.removed.length} ~${d.changed.length}`,
    );
  }
  writeJson(join(versionDir(ctx.to), "schemas-diff.json"), {
    from: "git HEAD",
    to: ctx.to,
    note: "old = schemas/ at git HEAD, new = schemas/ after generation. The generator stamps src/version.ts, not --to.",
    files: report,
  });
  console.log("  next: bun run schemas:check");
  return 0;
};

// ---- prompts -----------------------------------------------------------------------------------------------

export const runPrompts = async (ctx: Ctx): Promise<number> => {
  const bin = needBinary(ctx.to);
  const out = join(versionDir(ctx.to), "prompts");
  const argv = [
    bunPath,
    "tools/capture-prompts/capture.ts",
    "--bin",
    bin,
    "--out",
    out,
  ];
  if (ctx.only) argv.push("--only", ctx.only.join(","));
  // render.ts rewrites docs/prompts from all variants and deletes pages of missing ones: never render a subset
  if (ctx.rest.includes("--no-render") || ctx.only) argv.push("--no-render");
  console.log(`release:prompts (default prompt: ${DEFAULT_PROMPT})`);
  console.log(`  ${argv.slice(1).join(" ")}`);
  if (ctx.dry) return 0;
  const r = Bun.spawnSync(argv, {
    cwd: ROOT,
    env: clean(),
    stdout: "inherit",
    stderr: "inherit",
  });
  return r.exitCode ?? 1;
};
