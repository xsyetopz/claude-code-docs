// Claude Code installs and the modules inside each binary. A binary is read once and kept.
import { existsSync, readdirSync, realpathSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join } from "node:path";
import { Bundle } from "./ast.ts";
import { type BunModule, extractModules } from "./bunfs.ts";
import { Resolver } from "./resolve.ts";

export type Install = { version: string; path: string; current: boolean };

const versionsDir = () =>
  process.env["CC_INSPECT_VERSIONS_DIR"] ||
  join(homedir(), ".local/share/claude/versions");
const launcher = () =>
  process.env["CC_INSPECT_LAUNCHER"] || join(homedir(), ".local/bin/claude");

const semver = (v: string) => v.split(".").map((x) => Number.parseInt(x, 10));
const newer = (a: string, b: string) => {
  const [x, y] = [semver(a), semver(b)];
  for (let i = 0; i < 3; i++)
    if ((x[i] ?? 0) !== (y[i] ?? 0)) return (y[i] ?? 0) - (x[i] ?? 0);
  return 0;
};

/** Installed versions, newest first. `current` is the one the `claude` launcher points to. */
export const listInstalls = (): Install[] => {
  const dir = versionsDir();
  const cur = existsSync(launcher()) ? realpathSync(launcher()) : "";
  const out = existsSync(dir)
    ? readdirSync(dir)
        .filter((v) => /^\d+\.\d+\.\d+/.test(v))
        .map((v) => join(dir, v))
        .filter((p) => statSync(p).isFile())
        .map((p) => ({
          version: basename(p),
          path: p,
          current: realpathSync(p) === cur,
        }))
    : [];
  if (cur && !out.some((i) => i.current))
    out.push({ version: basename(cur), path: cur, current: true });
  return out.sort((a, b) => newer(a.version, b.version));
};

/** The binary for a version or a path; by default the current install, else the newest. */
export const binaryPath = (binary?: string): string => {
  if (binary && existsSync(binary)) return binary;
  const all = listInstalls();
  const hit = binary
    ? all.find((i) => i.version === binary)
    : (all.find((i) => i.current) ?? all[0]);
  if (!hit)
    throw new Error(
      binary
        ? `no install "${binary}"; installed: ${all.map((i) => i.version).join(", ") || "none"}`
        : `no Claude Code install under ${versionsDir()}`,
    );
  return hit.path;
};

export type Program = {
  path: string;
  modules: BunModule[];
  bundle: Bundle;
  resolver: Resolver;
};
const programs = new Map<string, Program>();

export const program = (binary?: string): Program => {
  const path = binaryPath(binary);
  let p = programs.get(path);
  if (!p) {
    const { modules } = extractModules(path);
    p = {
      path,
      modules,
      bundle: new Bundle(
        modules
          .filter((m) => /\.m?js$/.test(m.name))
          .map((m) => ({ name: m.name, text: m.source })),
      ),
      resolver: new Resolver(),
    };
    programs.set(path, p);
  }
  return p;
};
