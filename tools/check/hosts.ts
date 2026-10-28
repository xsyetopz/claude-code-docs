// Example-host check. Run with: bun tools/check/hosts.ts
//
// IANA reserves example.com, example.org, and example.net for documentation
// (https://www.iana.org/help/example-domains). The same page says they are "not a service" and that you
// must "avoid relying on [them] for testing and monitoring purposes".
//
// So a page may use them in an example, and code may not use them as a host it reaches. A test or a
// probe uses a name under `.invalid` instead, which RFC 2606 section 2 reserves for a name that never
// resolves, or `127.0.0.1` with a port when it needs a server that answers.
//
// An email address keeps example.com, because no code resolves an email address.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = join(import.meta.dir, "..", "..");

// Code trees only. `docs/` is prose, where the example hosts belong.
const TREES = ["tools", "plugin", "cli", "inspect", "src"];
const CODE_EXT = /\.(ts|tsx|js|mjs|cjs|json|jsonc|sh|py)$/;
const SKIP_DIR = new Set(["node_modules", "dist", "out", "bin", "fixtures"]);

const EXAMPLE_HOST = /\b(?:example\.(?:com|org|net)|example)\b/;

// A host inside a URL, with or without a scheme. The capture is the host.
const URL_HOST =
  /(?:https?:\/\/|wss?:\/\/|\/\/)([a-z0-9.-]*\bexample\.(?:com|org|net))/gi;

/** An email address keeps the example host: nothing resolves it. */
const EMAIL = /[a-z0-9._%+-]+@example\.(?:com|org|net)/gi;

/**
 * Files that may name an example host in code, each with the reason.
 * Add an entry only when the host is the subject of the code, never when the code reaches it.
 */
const ALLOWED = new Map<string, string>([
  [
    "inspect/mcp/src/surface/endpoint.ts",
    "a comment that names example.com as a placeholder the extractor leaves out",
  ],
  [
    "inspect/mcp/test/surface/kinds.test.ts",
    "a source fixture string: the extractor is tested on exactly this input",
  ],
]);

type Problem = { file: string; line: number; message: string };
const problems: Problem[] = [];

const walk = (dir: string, out: string[] = []): string[] => {
  for (const name of readdirSync(dir).sort()) {
    if (name.startsWith(".") || SKIP_DIR.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (CODE_EXT.test(name)) out.push(full);
  }
  return out;
};

const files = TREES.flatMap((t) => {
  const dir = join(ROOT, t);
  try {
    return statSync(dir).isDirectory() ? walk(dir) : [];
  } catch {
    return [];
  }
});

for (const full of files) {
  const rel = relative(ROOT, full).split(sep).join("/");
  const reason = ALLOWED.get(rel);
  const text = readFileSync(full, "utf8");
  if (!EXAMPLE_HOST.test(text)) continue;
  text.split("\n").forEach((line, i) => {
    // Strip every email address first, so a git author line passes.
    const bare = line.replace(EMAIL, "");
    const hosts = [...bare.matchAll(URL_HOST)].map((m) => m[1]);
    if (hosts.length === 0) return;
    if (reason) return;
    problems.push({
      file: rel,
      line: i + 1,
      message: `uses ${hosts.join(", ")} as a host. IANA says not to rely on it for testing. Use a name under .invalid, or 127.0.0.1 with a port. See docs/contributing/style-guide.md, "Example Hosts".`,
    });
  });
}

// An allow-list entry that no longer matches is dead, so it must go.
for (const [rel, reason] of ALLOWED) {
  const full = join(ROOT, rel);
  let text = "";
  try {
    text = readFileSync(full, "utf8");
  } catch {
    problems.push({
      file: rel,
      line: 1,
      message: `is on the allow-list (${reason}) but does not exist. Remove its entry from tools/check/hosts.ts.`,
    });
    continue;
  }
  if (!EXAMPLE_HOST.test(text))
    problems.push({
      file: rel,
      line: 1,
      message: `is on the allow-list (${reason}) but names no example host. Remove its entry from tools/check/hosts.ts.`,
    });
}

if (problems.length > 0) {
  for (const p of problems) console.error(`${p.file}:${p.line}: ${p.message}`);
  console.error(`\n${problems.length} problem(s) found.`);
  process.exit(1);
}
console.log(`check-hosts: ok (${files.length} files scanned)`);
