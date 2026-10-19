// Usage: bun tools/plugin-snapshot.ts [buildDir] [--out dir]   (also: bun run plugin:snapshot)
// Copies the built site into plugin/mcp/snapshot/ for the MCP server: manifest.json, pages/<route>.md,
// schemas/*.json, and version.json. Deterministic: no timestamps, fixed ordering, rewritten from scratch.
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const args = process.argv.slice(2);
const outAt = args.indexOf("--out");
const outArg = outAt >= 0 ? args.splice(outAt, 2)[1] : undefined;
const buildDir = args[0] ?? join(ROOT, "build");
const out = outArg ?? join(ROOT, "plugin", "mcp", "snapshot");

type Entry = { route: string; md: string };

const manifestFile = join(buildDir, "llms-manifest.json");
if (!existsSync(manifestFile)) {
  console.error(
    `plugin:snapshot: ${manifestFile} is missing (run "bun run build")`,
  );
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestFile, "utf8")) as Entry[];

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "pages"), { recursive: true });
mkdirSync(join(out, "schemas"), { recursive: true });

for (const e of manifest) {
  // Route "/" is build/index.md; "/a/b" is build/a/b.md.
  const rel = `${e.route.replace(/^\/+|\/+$/g, "") || "index"}.md`;
  const src = join(buildDir, rel);
  if (!existsSync(src)) {
    console.error(`plugin:snapshot: missing page file ${src}`);
    process.exit(1);
  }
  const dest = join(out, "pages", rel);
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
}
writeFileSync(
  join(out, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

const schemaDir = join(buildDir, "schemas");
const schemas = readdirSync(schemaDir)
  .filter((f) => f.endsWith(".json"))
  .sort();
for (const f of schemas)
  copyFileSync(join(schemaDir, f), join(out, "schemas", f));

// Claude Code version, read from the generated schema title: "... (Claude Code 2.1.304)".
const title = String(
  JSON.parse(
    readFileSync(join(schemaDir, "claude-code-plugin-manifest.json"), "utf8"),
  ).title,
);
const claudeCode = /Claude Code (\d+\.\d+\.\d+)/.exec(title)?.[1] ?? "unknown";
writeFileSync(
  join(out, "version.json"),
  `${JSON.stringify({ claudeCode, pages: manifest.length, schemas: schemas.length }, null, 2)}\n`,
);
console.log(
  `plugin:snapshot: ${manifest.length} pages, ${schemas.length} schemas, Claude Code ${claudeCode}`,
);
