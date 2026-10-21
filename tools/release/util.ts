// Small shared helpers for the release toolkit commands (paths, versions, run.json).
// The sandboxed child env, stub, ports and results live in lib/ (task 1.3); nothing here starts the program.
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  writeFileSync,
} from "node:fs";
import { arch, homedir, platform, release } from "node:os";
import { dirname, join } from "node:path";
import { CLAUDE_CODE_VERSION } from "../../src/version.ts";

export const ROOT = join(import.meta.dir, "..", "..");
export const CAPTURES = join(ROOT, "captures");
export const VERSIONS_DIR = join(homedir(), ".local/share/claude/versions");
export const DEFAULT_PROMPT = "Reply with 'OK'.";

export type Ctx = {
  from: string;
  to: string;
  only: string[] | null;
  dry: boolean;
  rest: string[]; // args the command parses itself
};

export const versionDir = (v: string): string => join(CAPTURES, v);
export const binaryPath = (v: string): string => join(VERSIONS_DIR, v);

const cmpVersion = (a: string, b: string): number => {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
};

export const installedVersions = (): string[] =>
  existsSync(VERSIONS_DIR)
    ? readdirSync(VERSIONS_DIR)
        .filter((n) => /^\d+\.\d+\.\d+$/.test(n))
        .sort(cmpVersion)
    : [];

/** The version `~/.local/bin/claude` points at; else the highest one in the versions folder. */
export const installedVersion = (): string => {
  try {
    const target = readlinkSync(join(homedir(), ".local/bin/claude"));
    const v = target.split("/").pop() ?? "";
    if (/^\d+\.\d+\.\d+$/.test(v) && existsSync(binaryPath(v))) return v;
  } catch {
    // not a symlink or missing: fall through
  }
  return installedVersions().at(-1) ?? "";
};

/** `--flag value` lookup; removes nothing. A missing value or one that starts with `--` is an error. */
export const argValue = (args: string[], name: string): string | undefined => {
  const i = args.indexOf(name);
  if (i < 0) return undefined;
  const v = args[i + 1];
  if (v === undefined || v.startsWith("--"))
    throw new Error(`${name} needs a value`);
  return v;
};

const VERSION_RE = /^\d+\.\d+\.\d+$/;
const version = (name: string, v: string): string => {
  if (!VERSION_RE.test(v)) throw new Error(`${name} must be x.y.z, got "${v}"`);
  return v;
};

export const parseCtx = (args: string[]): Ctx => {
  const only = argValue(args, "--only");
  return {
    from: version("--from", argValue(args, "--from") ?? CLAUDE_CODE_VERSION),
    to: argValue(args, "--to")
      ? version("--to", argValue(args, "--to") ?? "")
      : installedVersion(),
    only: only ? only.split(",") : null,
    dry: args.includes("--dry"),
    rest: args,
  };
};

/** Environment for helper tools such as `strings`: fixed PATH, nothing from the parent. */
export const toolEnv = (): Record<string, string> => ({
  PATH: "/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/usr/local/bin",
  HOME: homedir(),
  LC_ALL: "C",
});

export const writeJson = (path: string, data: unknown): void => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
};

const gitOut = (args: string[]): string => {
  const r = Bun.spawnSync(["git", ...args], { cwd: ROOT, env: toolEnv() });
  return r.exitCode === 0 ? r.stdout.toString().trim() : "";
};

export const toolkitRev = (): string => {
  const rev = gitOut(["rev-parse", "--short", "HEAD"]);
  const dirty = gitOut(["status", "--porcelain", "--", "tools/release"]);
  return rev ? `${rev}${dirty ? "+dirty" : ""}` : "unknown";
};

export type CommandRecord = {
  name: string;
  args: string[];
  startedAt: string;
  endedAt: string;
  exit: number;
};

/** Append one command entry to captures/<version>/run.json (creates the file on first use). */
export const recordCommand = (version: string, rec: CommandRecord): void => {
  const path = join(versionDir(version), "run.json");
  let run: Record<string, unknown> & { commands?: CommandRecord[] } = {};
  if (existsSync(path)) run = JSON.parse(readFileSync(path, "utf8"));
  run["version"] ??= version;
  run["startedAt"] ??= rec.startedAt;
  run["toolkitRev"] = toolkitRev();
  run["host"] = {
    platform: platform(),
    arch: arch(),
    osRelease: release(),
    bun: Bun.version,
  };
  run.commands = [...(run.commands ?? []), rec];
  writeJson(path, run);
};
