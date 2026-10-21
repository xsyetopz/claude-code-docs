// Minimal stdio MCP server. Args: <name> <startedLog>. Appends "<name> pid=<pid>" to startedLog when it starts.
const fs = require("node:fs");

const name = process.argv[2] || "srv";
const startedLog = process.argv[3];
if (startedLog) {
  try {
    fs.appendFileSync(startedLog, `${name} pid=${process.pid}\n`);
  } catch {
    // the log is best effort
  }
}

/** @param {object} o */
const send = (o) => process.stdout.write(`${JSON.stringify(o)}\n`);
/** @param {{ id: number, method: string, params?: { protocolVersion?: string } }} m */
const reply = (m) => {
  if (m.method === "initialize")
    return {
      protocolVersion: m.params?.protocolVersion ?? "2025-06-18",
      capabilities: { tools: {} },
      serverInfo: { name, version: "1.0.0" },
    };
  if (m.method === "tools/list")
    return {
      tools: [
        {
          name: "ping",
          description: `ping from ${name}`,
          inputSchema: { type: "object", properties: {} },
        },
      ],
    };
  if (m.method === "tools/call")
    return { content: [{ type: "text", text: "pong" }] };
  return {};
};

let buf = "";
process.stdin.on("data", (d) => {
  buf += d;
  const lines = buf.split("\n");
  buf = lines.pop() ?? "";
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    let m;
    try {
      m = JSON.parse(line);
    } catch {
      continue;
    }
    if (m.id === undefined) continue;
    send({ jsonrpc: "2.0", id: m.id, result: reply(m) });
  }
});
process.stdin.on("end", () => process.exit(0));
