// The optional reading view of one module: Wakaru (`@wakaru/cli`) run on its cleaned source, cached beside the clean cache.
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { prepared } from "./prepare.ts";

/** The command that runs Wakaru; `CC_INSPECT_WAKARU` replaces it (a stub in tests). */
const wakaru = (): string[] =>
  (process.env["CC_INSPECT_WAKARU"] ?? "bunx @wakaru/cli@1.14.0")
    .split(/\s+/)
    .filter(Boolean);

/**
 * The Wakaru text of a module, from `<clean dir>/readable/<module>` when it is there, else made by one run of Wakaru
 * on `<clean dir>/modules/<module>` and written to that path. Wakaru runs in a temp folder with only `PATH` and `HOME`.
 */
export const readable = async (
  binary: string | undefined,
  module: string,
): Promise<string> => {
  const { dir, index } = prepared(binary);
  const name = basename(module);
  const input = join(dir, "modules", name);
  const file = join(dir, "readable", name);
  if (existsSync(file)) return readFileSync(file, "utf8");
  if (!existsSync(input))
    throw new Error(
      `"${name}" has no cleaned source (${index.skipped[name] ?? "it is not JavaScript"})`,
    );
  const cwd = mkdtempSync(join(tmpdir(), "cc-inspect-wakaru-"));
  try {
    const p = Bun.spawn([...wakaru(), "--formatter", input], {
      cwd,
      env: {
        PATH: process.env["PATH"] ?? "",
        HOME: process.env["HOME"] ?? "",
      },
      stdout: "pipe",
      stderr: "pipe",
      timeout: 120_000,
    });
    const [out, err, code] = await Promise.all([
      new Response(p.stdout).text(),
      new Response(p.stderr).text(),
      p.exited,
    ]);
    if (code !== 0)
      throw new Error(`wakaru failed (exit ${code}): ${err.slice(0, 300)}`);
    if (!out.trim()) throw new Error("wakaru printed nothing");
    mkdirSync(join(dir, "readable"), { recursive: true });
    writeFileSync(`${file}.${process.pid}.tmp`, out);
    renameSync(`${file}.${process.pid}.tmp`, file);
    return out;
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
};
