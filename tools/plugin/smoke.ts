// Usage: bun tools/plugin/smoke.ts   (also: bun run plugin:smoke)
// Opt-in, needs network. Runs plugin/mcp/dist/server.js against the real sites with a temp cache:
// one search_docs, one read_page, one platform search_docs, and one cc-docs search. Exits non-zero on any failure.
// Not part of verify. Run it after a deploy.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const MCP = join(import.meta.dir, "..", "..", "plugin", "mcp");
const sdk = (p: string) =>
  join(MCP, "node_modules", "@modelcontextprotocol", "sdk", "dist", "esm", p);
const { Client } = await import(sdk("client/index.js"));
const { StdioClientTransport } = await import(sdk("client/stdio.js"));

const cache = mkdtempSync(join(tmpdir(), "ccdocs-smoke-"));
const env = Object.fromEntries(
  Object.entries(process.env).filter(
    (e): e is [string, string] => typeof e[1] === "string",
  ),
);
for (const k of ["CC_DOCS_BASE_URL", "PLATFORM_DOCS_BASE_URL"]) delete env[k];
env["CC_DOCS_CACHE_DIR"] = cache;
delete env["CLAUDE_PLUGIN_DATA"];

const client = new Client({ name: "plugin-smoke", version: "0" });
const failures: string[] = [];
const step = async (
  label: string,
  name: string,
  args: Record<string, unknown>,
  expectText: RegExp,
) => {
  const t0 = Date.now();
  try {
    const r = await client.callTool({ name, arguments: args });
    const text = (r.content as { text?: string }[])[0]?.text ?? "";
    const ok = r.isError !== true && expectText.test(text);
    console.log(`${ok ? "ok  " : "FAIL"} ${label} (${Date.now() - t0} ms)`);
    if (!ok) failures.push(`${label}: ${text.slice(0, 300)}`);
  } catch (e) {
    console.log(`FAIL ${label}`);
    failures.push(`${label}: ${String(e)}`);
  }
};

try {
  await client.connect(
    new StdioClientTransport({
      command: "bun",
      args: [join(MCP, "dist", "server.js")],
      env,
    }),
  );
  await step("search_docs", "search_docs", { query: "statusLine" }, /Source:/);
  await step(
    "read_page",
    "read_page",
    { route: "configure/status-line" },
    /Source:/,
  );
  await step(
    "search_docs platform",
    "search_docs",
    { query: "messages api", source: "platform" },
    /Source:/,
  );
  const t0 = Date.now();
  const cli = Bun.spawnSync(
    ["bun", join(MCP, "..", "..", "cli", "bin", "cc-docs"), "search", "hooks"],
    { env },
  );
  const ok = cli.exitCode === 0 && /Source:/.test(cli.stdout.toString());
  console.log(`${ok ? "ok  " : "FAIL"} cc-docs search (${Date.now() - t0} ms)`);
  if (!ok)
    failures.push(
      `cc-docs search: ${(cli.stdout.toString() + cli.stderr.toString()).slice(0, 300)}`,
    );
} catch (e) {
  failures.push(`connect: ${String(e)}`);
} finally {
  await client.close().catch(() => {});
  rmSync(cache, { recursive: true, force: true });
}
if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("smoke passed");
