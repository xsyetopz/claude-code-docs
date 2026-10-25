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
import type { Tally } from "./observe.ts";
import { cases } from "./observe-print-cases.ts";
import {
  claudeJson,
  counts,
  ingest,
  type Obj,
  obj,
  otel,
  transcripts,
} from "./observe-print-ingest.ts";

const outDir = process.argv[2];
const ti = process.argv.indexOf("--to");
const version =
  ti >= 0 ? (process.argv[ti + 1] as string) : CLAUDE_CODE_VERSION;
if (!outDir) throw new Error("usage: <out-dir> [--to <version>]");
mkdirSync(outDir, { recursive: true });

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
