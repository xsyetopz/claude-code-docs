// Local fake of the Messages API. Records every request body to a JSONL file.
// It never forwards anything, never stores credentials, and answers with canned text
// (or one canned tool_use block on the first turn, to trigger a subagent request).
import { appendFileSync } from "node:fs";

export const FAKE_KEY = "sk-ant-fake-probe";
export type StubOpts = {
  port?: number;
  log: string;
  tool?: string | undefined;
  toolInput?: unknown;
  text?: string;
};

const sse = (ev: string, d: unknown) =>
  `event: ${ev}\ndata: ${JSON.stringify(d)}\n\n`;

type Block = {
  type: string;
  text?: string;
  input?: unknown;
  [k: string]: unknown;
};
type ApiBody = {
  model?: string;
  stream?: boolean;
  messages?: { content?: unknown }[];
  tools?: { name: string }[];
};

const reply = (body: ApiBody | null | undefined, o: StubOpts) => {
  const msgs = body?.messages ?? [];
  const hasResult = msgs.some(
    (m) =>
      Array.isArray(m?.content) &&
      (m.content as Block[]).some((b) => b.type === "tool_result"),
  );
  const toolNames: string[] = (body?.tools ?? []).map((t) => t.name);
  const useTool = o.tool && !hasResult && toolNames.includes(o.tool);
  const content: Block[] = useTool
    ? [
        {
          type: "tool_use",
          id: "toolu_probe1",
          name: o.tool,
          input: o.toolInput ?? {},
        },
      ]
    : [{ type: "text", text: o.text ?? "OK" }];
  return {
    id: "msg_probe",
    type: "message",
    role: "assistant",
    model: body?.model ?? "claude-sonnet-5-5",
    content,
    stop_reason: useTool ? "tool_use" : "end_turn",
    stop_sequence: null,
    usage: {
      input_tokens: 10,
      output_tokens: 5,
      cache_creation_input_tokens: 0,
      cache_read_input_tokens: 0,
    },
  };
};

const stream = (m: ReturnType<typeof reply>) => {
  let out = sse("message_start", {
    type: "message_start",
    message: { ...m, content: [], stop_reason: null },
  });
  m.content.forEach((b, i) => {
    if (b.type === "text") {
      out += sse("content_block_start", {
        type: "content_block_start",
        index: i,
        content_block: { type: "text", text: "" },
      });
      out += sse("content_block_delta", {
        type: "content_block_delta",
        index: i,
        delta: { type: "text_delta", text: b.text },
      });
    } else {
      out += sse("content_block_start", {
        type: "content_block_start",
        index: i,
        content_block: { ...b, input: {} },
      });
      out += sse("content_block_delta", {
        type: "content_block_delta",
        index: i,
        delta: {
          type: "input_json_delta",
          partial_json: JSON.stringify(b.input),
        },
      });
    }
    out += sse("content_block_stop", { type: "content_block_stop", index: i });
  });
  out += sse("message_delta", {
    type: "message_delta",
    delta: { stop_reason: m.stop_reason, stop_sequence: null },
    usage: { output_tokens: 5 },
  });
  out += sse("message_stop", { type: "message_stop" });
  return out;
};

export const startStub = (o: StubOpts) => {
  return Bun.serve({
    port: o.port ?? 0,
    hostname: "127.0.0.1",
    async fetch(req) {
      const url = new URL(req.url);
      const headers: Record<string, string> = {};
      let authOk: boolean | null = null;
      req.headers.forEach((v, k) => {
        if (k === "x-api-key") {
          authOk = v === FAKE_KEY;
          headers[k] = "<redacted>";
        } else if (k === "authorization") {
          headers[k] = "<redacted>";
          if (authOk === null) authOk = v === `Bearer ${FAKE_KEY}`;
        } else headers[k] = v;
      });
      const raw = await req.text();
      let body: unknown = raw;
      try {
        body = JSON.parse(raw);
      } catch {}
      appendFileSync(
        o.log,
        `${JSON.stringify({
          method: req.method,
          path: url.pathname + url.search,
          authIsFakeKey: authOk,
          headers,
          body,
        })}\n`,
      );
      if (url.pathname === "/v1/messages" && req.method === "POST") {
        const m = reply(body as ApiBody | null, o);
        if ((body as ApiBody | null)?.stream)
          return new Response(stream(m), {
            headers: { "content-type": "text/event-stream" },
          });
        return Response.json(m);
      }
      if (url.pathname === "/v1/messages/count_tokens")
        return Response.json({ input_tokens: 10 });
      return new Response("{}", {
        status: 404,
        headers: { "content-type": "application/json" },
      });
    },
  });
};
