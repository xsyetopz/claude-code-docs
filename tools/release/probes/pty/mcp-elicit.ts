// Minimal MCP stdio server for the Elicitation probes (ported from p305-pty/mcp-elicit.ts).
// Tools: echo, ask (form elicitation), askurl (URL-mode elicitation). Every message is logged to $ELICIT_LOG (a sandbox path).
import { appendFileSync } from "node:fs";

const LOG = process.env["ELICIT_LOG"] ?? "";
const log = (s: string): void => {
  if (LOG) appendFileSync(LOG, `${s}\n`);
};
type Msg = {
  id?: number;
  method?: string;
  params?: Record<string, unknown> & { arguments?: Record<string, unknown> };
  result?: unknown;
  error?: unknown;
};
let buf = "";
let nextId = 1000;
const send = (o: unknown): void => {
  log(`OUT ${JSON.stringify(o)}`);
  process.stdout.write(`${JSON.stringify(o)}\n`);
};
const pending = new Map<number, (r: unknown) => void>();
const text = (t: string) => ({ content: [{ type: "text", text: t }] });

const handle = (m: Msg) => {
  if (m.method === "initialize")
    return send({
      jsonrpc: "2.0",
      id: m.id,
      result: {
        protocolVersion: m.params?.["protocolVersion"] ?? "2025-06-18",
        capabilities: { tools: {} },
        serverInfo: { name: "probe", version: "1" },
      },
    });
  if (m.method === "tools/list")
    return send({
      jsonrpc: "2.0",
      id: m.id,
      result: {
        tools: ["echo", "askurl", "ask"].map((name) => ({
          name,
          description: name,
          inputSchema: { type: "object", properties: {} },
        })),
      },
    });
  if (m.method === "tools/call") {
    const name = m.params?.["name"];
    if (name === "echo")
      return send({
        jsonrpc: "2.0",
        id: m.id,
        result: text(`echo:${String(m.params?.arguments?.["text"] ?? "")}`),
      });
    const id = nextId++;
    if (name === "askurl") {
      send({
        jsonrpc: "2.0",
        id,
        method: "elicitation/create",
        params: {
          mode: "url",
          message: "PROBE-URL: sign in",
          // `.invalid` never resolves (RFC 2606 section 2), so accepting the dialog cannot reach a
          // third-party host. IANA says not to rely on example.com for testing.
          url: "https://probe.invalid/auth",
          elicitationId: "el-1",
        },
      });
      pending.set(id, (r) => {
        send({
          jsonrpc: "2.0",
          method: "notifications/elicitation/complete",
          params: { elicitationId: "el-1" },
        });
        send({
          jsonrpc: "2.0",
          id: m.id,
          result: text(`url result ${JSON.stringify(r)}`),
        });
      });
      return;
    }
    send({
      jsonrpc: "2.0",
      id,
      method: "elicitation/create",
      params: {
        message: "PROBE-ELICIT: pick a color",
        requestedSchema: {
          type: "object",
          properties: { color: { type: "string", title: "Color" } },
          required: ["color"],
        },
      },
    });
    pending.set(id, (r) =>
      send({
        jsonrpc: "2.0",
        id: m.id,
        result: text(`elicit result ${JSON.stringify(r)}`),
      }),
    );
    return;
  }
  if (m.id !== undefined && !m.method && pending.has(m.id)) {
    pending.get(m.id)?.(m.result ?? m.error);
    pending.delete(m.id);
    return;
  }
  if (m.id !== undefined && m.method)
    send({ jsonrpc: "2.0", id: m.id, result: {} });
};

process.stdin.on("data", (d) => {
  buf += d;
  for (let i = buf.indexOf("\n"); i >= 0; i = buf.indexOf("\n")) {
    const line = buf.slice(0, i);
    buf = buf.slice(i + 1);
    if (!line.trim()) continue;
    log(`IN ${line}`);
    handle(JSON.parse(line) as Msg);
  }
});
