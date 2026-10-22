// Usage: bun tools/schemas/observe-print.ts <out-dir> [--to <version>]
// Runs print-mode cases against the local stub (fake key, temp HOME and CLAUDE_CONFIG_DIR, no real network:
// the proxy variables point at a closed port) and records, value-free, the key paths and JSON types of:
//   print-otel.json         OTLP/JSON that the program posts to a local collector (logs, metrics, traces)
//   print-transcripts.json  the transcript lines the program wrote
//   print-claude-json.json  the .claude.json the program wrote in the temp config dir
// Roots: `event:<event.name>`, `metric:<name>`, `span:<name>`; the transcript `type`; `$root`.
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import { CLAUDE_CODE_VERSION } from "../../src/version.ts";
import { binaryPath, childEnv, PROMPT } from "../release/lib/env.ts";
import { allocPort } from "../release/lib/ports.ts";
import { runChild } from "../release/lib/proc.ts";
import { makeSandbox, subst } from "../release/lib/sandbox.ts";
import { startStub } from "../release/lib/stub.ts";
import { Tally } from "./observe.ts";

const outDir = process.argv[2];
const ti = process.argv.indexOf("--to");
const version =
  ti >= 0 ? (process.argv[ti + 1] as string) : CLAUDE_CODE_VERSION;
if (!outDir) throw new Error("usage: <out-dir> [--to <version>]");
mkdirSync(outDir, { recursive: true });

type Obj = Record<string, unknown>;
const obj = (x: unknown): Obj =>
  x && typeof x === "object" && !Array.isArray(x) ? (x as Obj) : {};
const arr = (x: unknown): unknown[] => (Array.isArray(x) ? x : []);

const otel = new Tally();
const transcripts = new Tally();
const claudeJson = new Tally();
const counts = {
  runs: 0,
  logRecords: 0,
  metricPoints: 0,
  spans: 0,
  transcriptLines: 0,
  claudeJsonFiles: 0,
};

/** OTLP AnyValue to the JSON type the attribute has. intValue is a JSON string in OTLP/JSON. */
const anyType = (v: unknown): string => {
  const o = obj(v);
  if ("stringValue" in o) return "string";
  if ("intValue" in o) return "integer";
  if ("doubleValue" in o)
    return Number.isInteger(o["doubleValue"]) ? "integer" : "number";
  if ("boolValue" in o) return "boolean";
  if ("arrayValue" in o) return "array";
  if ("kvlistValue" in o) return "object";
  return "null";
};
const attrsOf = (list: unknown): Map<string, string> => {
  const m = new Map<string, string>();
  for (const a of arr(list))
    m.set(String(obj(a)["key"]), anyType(obj(a)["value"]));
  return m;
};
/** Record each attribute as `<root>.<key>` with its type. Counts one sample per attribute. */
const note = (root: string, attrs: Map<string, string>): void => {
  otel.stats.set(root, bump(otel.stats.get(root), "object"));
  for (const [k, t] of attrs) {
    const p = `${root}.${k}`;
    otel.stats.set(p, bump(otel.stats.get(p), t));
  }
};
const bump = (
  s: { n: number; types: Record<string, number> } | undefined,
  t: string,
) => {
  const r = s ?? { n: 0, types: {} };
  r.n++;
  r.types[t] = (r.types[t] ?? 0) + 1;
  return r;
};

const eventName = (rec: Obj): string | undefined => {
  for (const a of arr(rec["attributes"]))
    if (obj(a)["key"] === "event.name")
      return String(obj(obj(a)["value"])["stringValue"]);
  return undefined;
};

const ingest = (path: string, body: Obj): void => {
  if (path.endsWith("/v1/logs")) {
    for (const rl of arr(body["resourceLogs"]))
      for (const sl of arr(obj(rl)["scopeLogs"]))
        for (const rec of arr(obj(sl)["logRecords"])) {
          const name = eventName(obj(rec));
          counts.logRecords++;
          note(`event:${name ?? "?"}`, attrsOf(obj(rec)["attributes"]));
        }
  } else if (path.endsWith("/v1/metrics")) {
    for (const rm of arr(body["resourceMetrics"]))
      for (const sm of arr(obj(rm)["scopeMetrics"]))
        for (const m of arr(obj(sm)["metrics"])) {
          const mm = obj(m);
          const pts = arr(
            obj(mm["sum"])["dataPoints"] ?? obj(mm["gauge"])["dataPoints"],
          );
          for (const dp of pts) {
            counts.metricPoints++;
            note(
              `metric:${String(mm["name"])}`,
              attrsOf(obj(dp)["attributes"]),
            );
          }
        }
  } else if (path.endsWith("/v1/traces")) {
    for (const rs of arr(body["resourceSpans"]))
      for (const ss of arr(obj(rs)["scopeSpans"]))
        for (const sp of arr(obj(ss)["spans"])) {
          counts.spans++;
          note(
            `span:${String(obj(sp)["name"])}`,
            attrsOf(obj(sp)["attributes"]),
          );
        }
  }
};

const collectorPort = await allocPort();
const collector = Bun.serve({
  port: collectorPort,
  hostname: "127.0.0.1",
  async fetch(req) {
    const url = new URL(req.url);
    let buf = new Uint8Array(await req.arrayBuffer());
    if (req.headers.get("content-encoding") === "gzip") buf = gunzipSync(buf);
    try {
      ingest(url.pathname, JSON.parse(new TextDecoder().decode(buf)) as Obj);
    } catch {
      // not JSON (protobuf): counted as nothing
    }
    return Response.json({});
  },
});

const stub = startStub(await allocPort());
const bin = binaryPath(version);

const listJsonl = (d: string): string[] => {
  const out: string[] = [];
  if (!existsSync(d)) return out;
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) out.push(...listJsonl(p));
    else if (e.endsWith(".jsonl")) out.push(p);
  }
  return out;
};

type Case = {
  id: string;
  args?: string[];
  env?: Record<string, string>;
  seq?: { name: string; input: unknown }[];
  cfgFiles?: Record<string, string>;
  projFiles?: Record<string, string>;
  git?: boolean;
  prompt?: string;
  deadBase?: boolean; // point the API base URL at a closed port: connection errors
};
const TOOLS = "Bash,Read,Write,Edit,Glob,Grep,Agent,Skill,TodoWrite";
const SEQ = [
  { name: "Read", input: { file_path: "{PROJ}/a.txt" } },
  { name: "Bash", input: { command: "echo hi" } },
  { name: "Write", input: { file_path: "{PROJ}/b.txt", content: "x\n" } },
  {
    name: "Edit",
    input: { file_path: "{PROJ}/b.txt", old_string: "x", new_string: "y" },
  },
  { name: "Glob", input: { pattern: "*.txt" } },
  { name: "Grep", input: { pattern: "y", path: "{PROJ}" } },
  { name: "Skill", input: { skill: "probe-skill" } },
  {
    name: "Agent",
    input: {
      description: "Probe task",
      prompt: PROMPT,
      subagent_type: "general-purpose",
    },
  },
];
const HOOKS = {
  hooks: Object.fromEntries(
    [
      "SessionStart",
      "UserPromptSubmit",
      "PreToolUse",
      "PostToolUse",
      "Stop",
    ].map((e) => [e, [{ hooks: [{ type: "command", command: "echo ok" }] }]]),
  ),
};
const FILES = {
  projFiles: { "a.txt": "a\n" },
  cfgFiles: {
    "settings.json": JSON.stringify(HOOKS),
    "skills/probe-skill/SKILL.md":
      "---\nname: probe-skill\ndescription: Probe skill.\n---\nBody.\n",
  },
};
const MCP = JSON.stringify({
  mcpServers: { bad: { command: "/usr/bin/false" } },
});
const cases: Case[] = [
  { id: "plain" },
  { id: "api-error", deadBase: true, env: { CLAUDE_CODE_MAX_RETRIES: "1" } },
  { id: "at-mention", prompt: "Read @a.txt", ...FILES },
  { id: "compact", prompt: "/compact", seq: SEQ.slice(0, 1), ...FILES },
  { id: "mcp", args: ["--mcp-config", MCP], ...FILES },
  {
    id: "commit",
    git: true,
    ...FILES,
    args: ["--allowedTools", TOOLS],
    seq: [
      {
        name: "Bash",
        input: {
          command:
            "git -c user.name=t -c user.email=t@e.com commit --allow-empty -m x",
        },
      },
    ],
  },
  {
    id: "tools-allowed",
    seq: SEQ,
    args: ["--allowedTools", TOOLS],
    ...FILES,
    git: true,
  },
  { id: "tools-denied", seq: SEQ, ...FILES },
  {
    id: "auto",
    seq: SEQ.slice(0, 3),
    args: ["--permission-mode", "auto"],
    ...FILES,
  },
  {
    id: "traces",
    seq: SEQ.slice(0, 4),
    args: ["--allowedTools", TOOLS],
    ...FILES,
    env: {
      CLAUDE_CODE_ENHANCED_TELEMETRY_BETA: "1",
      OTEL_TRACES_EXPORTER: "otlp",
    },
  },
];

try {
  for (const c of cases) {
    const sb = makeSandbox({
      ...(c.cfgFiles ? { cfgFiles: c.cfgFiles } : {}),
      ...(c.projFiles ? { projFiles: c.projFiles } : {}),
      ...(c.git ? { git: true } : {}),
      trusted: true,
      seedOnboarding: true,
    });
    const log = join(sb.root, "requests.jsonl");
    const base = stub.register(c.id, {
      log,
      ...(c.seq ? { seq: JSON.parse(subst(JSON.stringify(c.seq), sb)) } : {}),
    });
    const env = childEnv({
      home: sb.home,
      configDir: sb.cfg,
      baseUrl: c.deadBase ? `http://127.0.0.1:${await allocPort()}` : base,
      allowOverride: [
        "DISABLE_TELEMETRY",
        "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC",
      ],
      extra: {
        DISABLE_TELEMETRY: "",
        CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "",
        CLAUDE_CODE_ENABLE_TELEMETRY: "1",
        OTEL_LOGS_EXPORTER: "otlp",
        OTEL_METRICS_EXPORTER: "otlp",
        OTEL_EXPORTER_OTLP_PROTOCOL: "http/json",
        OTEL_EXPORTER_OTLP_ENDPOINT: `http://127.0.0.1:${collectorPort}`,
        OTEL_LOGS_EXPORT_INTERVAL: "500",
        OTEL_METRIC_EXPORT_INTERVAL: "1000",
        OTEL_LOG_USER_PROMPTS: "1",
        OTEL_LOG_TOOL_DETAILS: "1",
        OTEL_LOG_TOOL_CONTENT: "1",
        OTEL_LOG_ASSISTANT_RESPONSES: "1",
        OTEL_METRICS_INCLUDE_SESSION_ID: "true",
        OTEL_METRICS_INCLUDE_VERSION: "true",
        OTEL_METRICS_INCLUDE_ACCOUNT_UUID: "true",
        ...(c.env ?? {}),
      },
    });
    const args = [
      "-p",
      c.prompt ?? PROMPT,
      "--output-format",
      "text",
      "--model",
      "claude-opus-5-5",
      ...(c.args ?? []).map((a) => subst(a, sb)),
    ];
    const r = await runChild([bin, ...args], {
      cwd: sb.proj,
      env,
      timeoutMs: 90_000,
    });
    stub.unregister(c.id);
    counts.runs++;
    console.log(c.id, "exit", r.code, r.timedOut ? "TIMEOUT" : "");
    for (const f of listJsonl(join(sb.cfg, "projects"))) {
      for (const l of readFileSync(f, "utf8").split("\n")) {
        if (!l) continue;
        try {
          const j = obj(JSON.parse(l));
          counts.transcriptLines++;
          transcripts.add(typeof j["type"] === "string" ? j["type"] : "?", j);
        } catch {
          // skip
        }
      }
    }
    const cj = join(sb.cfg, ".claude.json");
    if (existsSync(cj)) {
      counts.claudeJsonFiles++;
      claudeJson.add("$root", JSON.parse(readFileSync(cj, "utf8")) as unknown);
    }
    sb.cleanup();
  }
} finally {
  stub.stop();
  collector.stop(true);
}
const stats = (t: Tally) => ({ counts, paths: otelPaths(t) });
const otelPaths = (t: Tally) => t.toJSON();
writeFileSync(
  join(outDir, "print-otel.json"),
  `${JSON.stringify(stats(otel), null, 1)}\n`,
);
writeFileSync(
  join(outDir, "print-transcripts.json"),
  `${JSON.stringify(stats(transcripts), null, 1)}\n`,
);
writeFileSync(
  join(outDir, "print-claude-json.json"),
  `${JSON.stringify(stats(claudeJson), null, 1)}\n`,
);
console.log(JSON.stringify(counts));
