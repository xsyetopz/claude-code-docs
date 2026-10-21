// Multi-tenant fake of the Messages API. One server, many cases: the base URL path starts with the case id.
// Never forwards anything, never stores credentials, answers with canned SSE or JSON.
import { appendFileSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { FAKE_KEY } from "./env.ts";

export type StubCase = {
  log: string; // JSONL request log
  text?: string; // default "OK"
  tool?: string;
  toolInput?: unknown; // one tool_use on first turn
  seq?: { name: string; input: unknown }[]; // several tool turns
  respHeaders?: Record<string, string>;
};

export type LoggedRequest = {
  id: string;
  method: string;
  path: string;
  authIsFakeKey: boolean | null;
  bad: boolean; // a different key was sent: the runner fails the case
  headers: Record<string, string>; // allow-listed only
  headerNames?: string[]; // every header name sent (names only, no values)
  body: unknown;
};

const HEADER_ALLOW = new Set([
  "anthropic-beta",
  "anthropic-version",
  "content-type",
  "user-agent",
  "x-app",
  "x-stainless-lang",
  "x-stainless-package-version",
  "x-claude-code-session-id",
  "x-client-request-id",
  "accept",
  "x-api-key",
  "authorization",
]);

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
type Msg = {
  id: string;
  type: "message";
  role: "assistant";
  model: string;
  content: Block[];
  stop_reason: string;
  stop_sequence: null;
  usage: Record<string, number>;
};

const sse = (ev: string, d: unknown) =>
  `event: ${ev}\ndata: ${JSON.stringify(d)}\n\n`;
const USAGE = {
  input_tokens: 10,
  output_tokens: 5,
  cache_creation_input_tokens: 0,
  cache_read_input_tokens: 0,
};

const reply = (body: ApiBody | null, o: StubCase): Msg => {
  const msgs = body?.messages ?? [];
  const results = msgs.reduce(
    (a, m) =>
      a +
      (Array.isArray(m?.content)
        ? (m.content as Block[]).filter((b) => b.type === "tool_result").length
        : 0),
    0,
  );
  const names = (body?.tools ?? []).map((t) => t.name);
  const base = {
    id: "msg_probe",
    type: "message" as const,
    role: "assistant" as const,
    model: body?.model ?? "claude-sonnet-5-5",
    stop_sequence: null,
    usage: USAGE,
  };
  const nx = o.seq?.[results];
  if (nx && names.includes(nx.name))
    return {
      ...base,
      content: [
        {
          type: "tool_use",
          id: `toolu_probe${results}`,
          name: nx.name,
          input: nx.input,
        },
      ],
      stop_reason: "tool_use",
    };
  if (!o.seq && o.tool && results === 0 && names.includes(o.tool))
    return {
      ...base,
      content: [
        {
          type: "tool_use",
          id: "toolu_probe1",
          name: o.tool,
          input: o.toolInput ?? {},
        },
      ],
      stop_reason: "tool_use",
    };
  return {
    ...base,
    content: [{ type: "text", text: o.text ?? "OK" }],
    stop_reason: "end_turn",
  };
};

const stream = (m: Msg): string => {
  let out = sse("message_start", {
    type: "message_start",
    message: { ...m, content: [], stop_reason: null },
  });
  m.content.forEach((b, i) => {
    const start =
      b.type === "text" ? { type: "text", text: "" } : { ...b, input: {} };
    const delta =
      b.type === "text"
        ? { type: "text_delta", text: b.text }
        : { type: "input_json_delta", partial_json: JSON.stringify(b.input) };
    out += sse("content_block_start", {
      type: "content_block_start",
      index: i,
      content_block: start,
    });
    out += sse("content_block_delta", {
      type: "content_block_delta",
      index: i,
      delta,
    });
    out += sse("content_block_stop", { type: "content_block_stop", index: i });
  });
  out += sse("message_delta", {
    type: "message_delta",
    delta: { stop_reason: m.stop_reason, stop_sequence: null },
    usage: { output_tokens: 5 },
  });
  return out + sse("message_stop", { type: "message_stop" });
};

export type Stub = {
  port: number;
  register(id: string, c: StubCase): string;
  unregister(id: string): void;
  stop(): LoggedRequest[]; // returns the stray requests (and removes the stray log)
  strayLog: string; // requests whose first path segment is not a registered case (bad=true)
};

export const startStub = (
  port: number,
  strayLog = join(
    tmpdir(),
    `cc-release-stub-stray-${process.pid}-${port}.jsonl`,
  ),
): Stub => {
  writeFileSync(strayLog, "");
  const cases = new Map<string, StubCase>();
  const server = Bun.serve({
    port,
    hostname: "127.0.0.1",
    async fetch(req) {
      const url = new URL(req.url);
      const m = url.pathname.match(/^\/([A-Za-z0-9][A-Za-z0-9._-]*)(\/.*)$/);
      const id = m?.[1] && cases.has(m[1]) ? m[1] : "";
      if (id && m?.[2]) url.pathname = m[2];
      const o = cases.get(id) ?? { log: strayLog };
      const headers: Record<string, string> = {};
      let auth: boolean | null = null;
      req.headers.forEach((v, k) => {
        if (k === "x-api-key" || k === "authorization") {
          headers[k] = "<redacted>";
          const ok = v === FAKE_KEY || v === `Bearer ${FAKE_KEY}`;
          auth = auth === false ? false : ok;
        } else if (HEADER_ALLOW.has(k)) headers[k] = v;
      });
      const raw = await req.text();
      let body: unknown = raw;
      try {
        body = JSON.parse(raw);
      } catch {
        // keep raw text
      }
      if (o.log) {
        const rec: LoggedRequest = {
          id,
          method: req.method,
          path: url.pathname + url.search,
          authIsFakeKey: auth,
          bad: auth === false || !id,
          headers,
          headerNames: [...req.headers.keys()].sort(),
          body,
        };
        appendFileSync(o.log, `${JSON.stringify(rec)}\n`);
      }
      if (url.pathname === "/v1/messages" && req.method === "POST") {
        const msg = reply(body as ApiBody | null, o);
        const extra = o.respHeaders ?? {};
        if ((body as ApiBody | null)?.stream)
          return new Response(stream(msg), {
            headers: { "content-type": "text/event-stream", ...extra },
          });
        return Response.json(msg, { headers: extra });
      }
      if (url.pathname === "/v1/messages/count_tokens")
        return Response.json({ input_tokens: 10 });
      return new Response("{}", {
        status: 404,
        headers: { "content-type": "application/json" },
      });
    },
  });
  return {
    port: server.port ?? port,
    register(id, c) {
      if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(id) || id.includes(".."))
        throw new Error(`bad case id: ${id}`);
      writeFileSync(c.log, "");
      cases.set(id, c);
      return `http://127.0.0.1:${server.port}/${id}`;
    },
    strayLog,
    unregister: (id) => void cases.delete(id),
    stop() {
      server.stop(true);
      let stray: LoggedRequest[] = [];
      try {
        stray = readLog(strayLog);
      } catch {
        // already gone
      }
      rmSync(strayLog, { force: true });
      return stray;
    },
  };
};

export const readLog = (log: string): LoggedRequest[] =>
  readFileSync(log, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l) as LoggedRequest);
