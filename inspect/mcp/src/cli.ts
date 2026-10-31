// Calls cc-inspect tools from a shell, through the built server, for sessions that do not load it as MCP.
// Usage: bun inspect/mcp/src/cli.ts <tool> '<json args>' [<tool> '<json args>' ...]
// One server serves every call, so the cache of a version loads once.
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const args = process.argv.slice(2);
const usage = () => {
  console.error(
    "usage: bun inspect/mcp/src/cli.ts <tool> '<json args>' [<tool> '<json args>' ...]",
  );
  process.exit(2);
};
if (args.length === 0 || args.length % 2 !== 0) usage();

const calls: { name: string; json: string; args: Record<string, unknown> }[] =
  [];
for (let i = 0; i < args.length; i += 2) {
  const [name = "", json = ""] = [args[i], args[i + 1]];
  try {
    calls.push({ name, json, args: JSON.parse(json) });
  } catch {
    console.error(`argument ${i + 2} is not JSON: ${json}`);
    usage();
  }
}

const client = new Client({ name: "cc-inspect-cli", version: "0" });
await client.connect(
  new StdioClientTransport({
    command: process.execPath,
    args: [join(import.meta.dir, "..", "dist", "server.js")],
    env: Object.fromEntries(
      Object.entries(process.env).filter(([, v]) => v !== undefined),
    ) as Record<string, string>,
  }),
);
let failed = false;
for (const c of calls) {
  console.log(`=== ${c.name} ${c.json}`);
  const r = (await client.callTool(
    { name: c.name, arguments: c.args },
    undefined,
    { timeout: 600000 },
  )) as { content: { text?: string }[]; isError?: boolean };
  for (const p of r.content) if (p.text) console.log(p.text);
  if (r.isError) failed = true;
}
await client.close();
process.exit(failed ? 1 : 0);
