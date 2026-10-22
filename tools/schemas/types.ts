// Usage: bun tools/schemas/types.ts [--bin <binary>] [--check]
// Writes schemas/claude-code.d.ts: the Mod API type file that the program embeds (zstd text),
// with a header naming the version. --check only verifies the committed file (part of schemas:check).
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { extractModules } from "../../inspect/mcp/src/bunfs.ts";
import { CLAUDE_CODE_VERSION } from "../../src/version.ts";

const ROOT = join(import.meta.dir, "..", "..");
const OUT = join(ROOT, "schemas", "claude-code.d.ts");
const HEADER = (v: string) =>
  `// The Claude Code ${v} Mod API type file, as the program embeds it.\n// Extracted by tools/schemas/types.ts. Do not edit: run "bun run schemas".\n// biome-ignore-all format: verbatim from the program\n// biome-ignore-all lint: verbatim from the program\n// biome-ignore-all assist: verbatim from the program\n`;

const args = process.argv.slice(2);
if (args.includes("--check")) {
  const problems: string[] = [];
  if (!existsSync(OUT)) problems.push("missing");
  else {
    const text = readFileSync(OUT, "utf8");
    if (!text.startsWith(HEADER(CLAUDE_CODE_VERSION)))
      problems.push(`header does not name ${CLAUDE_CODE_VERSION}`);
    if (!text.includes("declare module 'claude-code' {"))
      problems.push("no `declare module 'claude-code'`");
  }
  if (problems.length) {
    for (const p of problems)
      console.error(`schemas/claude-code.d.ts: ${p} (run "bun run schemas")`);
    process.exit(1);
  }
  console.log("schemas/claude-code.d.ts ok");
  process.exit(0);
}

const at = args.indexOf("--bin");
const bin =
  at >= 0 && args[at + 1]
    ? (args[at + 1] as string)
    : join(homedir(), ".local/share/claude/versions", CLAUDE_CODE_VERSION);
const { modules } = extractModules(bin);
const [found, ...more] = modules.filter((m) =>
  /\/claude-code\.d\.ts-[^/]*\.zst$/.test(m.name),
);
if (!found || more.length)
  throw new Error(
    `expected one embedded type file, found ${more.length + (found ? 1 : 0)}`,
  );
const text = Bun.zstdDecompressSync(found.bytes).toString("utf8");
// Stamps src/version.ts, as generate.ts does for the JSON Schemas.
writeFileSync(OUT, HEADER(CLAUDE_CODE_VERSION) + text);
console.log(
  `schemas/claude-code.d.ts: ${text.split("\n").length} lines from ${bin}`,
);
