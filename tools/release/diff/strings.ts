// `strings -a` dump of a Claude Code binary, cached at captures/<version>/strings.txt (gitignored, tens of MB).
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  renameSync,
  rmSync,
  statSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { binaryPath, toolEnv, versionDir } from "../util.ts";

export const stringsPath = (version: string): string =>
  join(versionDir(version), "strings.txt");

/** Dump (or reuse) the strings of one version. The binary is only read. Returns the dump path. */
export const dumpStrings = (version: string, force = false): string => {
  const bin = binaryPath(version);
  const out = stringsPath(version);
  const cached = existsSync(out) && statSync(out).size > 0;
  if (!existsSync(bin)) {
    // an old binary may be gone while its dump is still on disk
    if (cached) return out;
    throw new Error(`no binary for ${version} at ${bin}`);
  }
  if (!force && cached && statSync(out).mtimeMs >= statSync(bin).mtimeMs)
    return out;
  mkdirSync(dirname(out), { recursive: true });
  const tmp = `${out}.tmp`; // a failed run never leaves a half dump under the real name
  const fd = openSync(tmp, "w");
  try {
    const r = Bun.spawnSync(["strings", "-a", bin], {
      env: toolEnv(),
      stdout: fd,
      stderr: "pipe",
    });
    if (r.exitCode !== 0)
      throw new Error(`strings failed (${r.exitCode}): ${r.stderr.toString()}`);
    closeSync(fd);
    renameSync(tmp, out);
  } catch (e) {
    try {
      closeSync(fd);
    } catch {
      // already closed
    }
    rmSync(tmp, { force: true });
    throw e;
  }
  return out;
};
