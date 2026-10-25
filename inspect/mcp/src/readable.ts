// The optional reading view of one module: Wakaru (`@wakaru/cli`) run on its cleaned source, cached beside the clean cache.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { prepared } from "./prepare.ts";

/** The command that runs Wakaru; `CC_INSPECT_WAKARU` replaces it (a stub in tests). */
const wakaru = (): string[] =>
  (process.env["CC_INSPECT_WAKARU"] ?? "bunx @wakaru/cli@1.14.0")
    .split(/\s+/)
    .filter(Boolean);

/**
 * The Wakaru text of a module, from `<clean dir>/readable/<module>` when it is there, else made by one run of Wakaru
 * on `<clean dir>/modules/<module>` and written to that path.
 */
export const readable = (
  binary: string | undefined,
  module: string,
): string => {
  const { dir } = prepared(binary);
  const name = basename(module);
  const input = join(dir, "modules", name);
  const file = join(dir, "readable", name);
  if (existsSync(file)) return readFileSync(file, "utf8");
  if (!existsSync(input))
    throw new Error(`"${name}" has no cleaned source (it is not JavaScript)`);
  const r = Bun.spawnSync([...wakaru(), "--formatter", input]);
  if (r.exitCode !== 0)
    throw new Error(
      `wakaru failed (exit ${r.exitCode}): ${r.stderr.toString().slice(0, 300)}`,
    );
  mkdirSync(join(dir, "readable"), { recursive: true });
  writeFileSync(file, r.stdout);
  return r.stdout.toString();
};
