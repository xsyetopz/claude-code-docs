// Run signature and diff, ported from p305-print/base.ts. A signature is a flat map of strings that describes
// what one program run sent (headers, body parts, init event, hook env, files). Used by the sweep and request probes.
import { dirname, join } from "node:path";
import { normalise } from "../../lib/results.ts";
import {
  arr,
  type Case,
  dispose,
  events,
  listFiles,
  msgs,
  obj,
  type Run,
  readIf,
  runCase,
} from "./run.ts";

const MCP_SERVER = `
let buf="";
process.stdin.on("data",d=>{buf+=d;let i;while((i=buf.indexOf("\\n"))>=0){const l=buf.slice(0,i);buf=buf.slice(i+1);if(!l.trim())continue;let m;try{m=JSON.parse(l)}catch{continue}
 const send=r=>process.stdout.write(JSON.stringify({jsonrpc:"2.0",id:m.id,result:r})+"\\n");
 if(m.method==="initialize")send({protocolVersion:m.params?.protocolVersion||"2025-06-18",capabilities:{tools:{}},serverInfo:{name:"probe",version:"1"}});
 else if(m.method==="tools/list")send({tools:[{name:"ping",description:"ping",inputSchema:{type:"object",properties:{}}}]});
 else if(m.id!==undefined)send({});
}});
`;

/** Baseline A: plain print run. */
export const baselineA = (): Case => ({});

/** Baseline B: one Bash tool turn, a plugin (skill + MCP server), and a logging hook on five events. */
export const baselineB = (): Case => {
  const hk = (ev: string) => ({
    hooks: [
      {
        type: "command",
        command: `cat >> {CFG}/hook.log; echo >> {CFG}/hook.log; env | cut -d= -f1 | sort > {CFG}/hookenv.${ev}`,
      },
    ],
  });
  const hooks: Record<string, unknown> = {};
  for (const ev of [
    "SessionStart",
    "UserPromptSubmit",
    "PreToolUse",
    "PostToolUse",
    "Stop",
  ])
    hooks[ev] = [
      { ...(ev.includes("Tool") ? { matcher: "Bash" } : {}), ...hk(ev) },
    ];
  return {
    tool: "Bash",
    toolInput: { command: "echo hi" },
    args: ["--allowedTools", "Bash", "--plugin-dir", "{HOME}/plug"],
    cfgFiles: { "settings.json": JSON.stringify({ hooks }) },
    homeFiles: {
      "plug/.claude-plugin/plugin.json": JSON.stringify({
        name: "pp",
        version: "1.0.0",
        description: "probe plugin",
      }),
      "plug/skills/pskill/SKILL.md":
        "---\nname: pskill\ndescription: Probe skill\n---\nDo nothing.\n",
      "plug/srv.js": MCP_SERVER,
      "plug/.mcp.json": JSON.stringify({
        mcpServers: { psrv: { command: "bun", args: ["{HOME}/plug/srv.js"] } },
      }),
    },
  };
};

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;
const norm0 = (s: string, r: Run): string =>
  s
    .split(r.sb.cfg)
    .join("<CFG>")
    .split(r.sb.home)
    .join("<HOME>")
    .split(r.sb.proj)
    .join("<PROJ>")
    .split(dirname(r.sb.cfg))
    .join("<ROOT>")
    .replace(UUID, "<U>")
    .replace(/\d{4}-\d\d-\d\dT[\d:.]+Z/g, "<TS>")
    .replace(
      /"(duration_ms|duration_api_ms|total_cost_usd|ttft_ms)":[\d.]+/g,
      '"$1":0',
    )
    .replace(/cc_version=([\d.]+)\.[0-9a-f]{3}/g, "cc_version=$1.XXX")
    .replace(/[0-9a-f]{64}/g, "<DEV>")
    .replace(/\.backup\.\d+/g, ".backup.N")
    .replace(/ccrel-[A-Za-z0-9]+/g, "ccrel-X")
    .replace(/\d{4}-\d\d-\d\dT\d\d-\d\d-\d\d-\d+Z/g, "<TS>")
    .replace(/sessions\/\d+\.json/g, "sessions/<pid>.json")
    .replace(/OS Version: [^"\\\n]*/g, "OS Version: <os>");
const norm = (s: string, r: Run): string => normalise(norm0(s, r));

export type Sig = Record<string, string>;
const json = (x: unknown): string => JSON.stringify(x) ?? "undefined";

export const sig = (r: Run): Sig => {
  const out: Sig = {};
  const m = msgs(r);
  out["nreq"] = `${r.reqs.length}/${m.length}`;
  out["paths"] = [...new Set(r.reqs.map((x) => x.path))].sort().join(" ");
  m.forEach((x, i) => {
    const h = x.headers;
    const b = obj(x.body);
    const k = `m${i}`;
    out[`${k}.beta`] = h["anthropic-beta"] ?? "<none>";
    out[`${k}.hdrnames`] = (x.headerNames ?? Object.keys(h))
      .filter((n) => !["host", "content-length"].includes(n))
      .sort()
      .join(",");
    out[`${k}.ua`] = h["user-agent"] ?? "";
    out[`${k}.system`] = norm(json(b["system"]), r);
    out[`${k}.tools`] = arr(b["tools"])
      .map((t) => String(obj(t)["name"]))
      .join(",");
    out[`${k}.bodykeys`] = Object.keys(b).join(",");
    out[`${k}.thinking`] =
      json(b["thinking"]) +
      json(b["output_config"]) +
      json(b["context_management"]) +
      String(b["max_tokens"]) +
      String(b["model"]);
    out[`${k}.metadata`] = norm(json(b["metadata"]), r);
    out[`${k}.messages`] = norm(json(b["messages"]), r);
  });
  const ev = events(r);
  out["events"] = ev
    .map((e) => {
      const content = arr(obj(e["message"])["content"]);
      const sub =
        e["subtype"] ??
        (content.length
          ? content.map((c) => String(obj(c)["type"])).join("+")
          : "");
      return `${e["type"]}/${sub}`;
    })
    .join(" ");
  const init = ev.find((e) => e["subtype"] === "init");
  if (init) {
    out["initkeys"] = Object.keys(init).join(",");
    for (const k of Object.keys(init))
      if (
        ![
          "session_id",
          "uuid",
          "cwd",
          "memory_paths",
          "messaging_socket_path",
        ].includes(k)
      )
        out[`init.${k}`] = norm(json(init[k]), r);
  }
  out["evkeys"] = ev
    .map((e) => `${e["type"]}:${Object.keys(e).join(",")}`)
    .join("|");
  const skip =
    /^(projects|session-env|shell-snapshots|todos|statsig|\.claude\.json\.backup)/;
  out["cfgfiles"] = listFiles(r.sb.cfg)
    .filter((f) => !skip.test(f))
    .map((f) => norm(f, r))
    .join(",");
  out["homefiles"] = listFiles(r.sb.home)
    .filter((f) => !f.startsWith("plug/") && !f.startsWith("tmp/"))
    .map((f) => norm(f, r))
    .join(",");
  for (const f of listFiles(r.sb.cfg))
    if (f.startsWith("hookenv."))
      out[`henv.${f}`] = readIf(join(r.sb.cfg, f))
        .split("\n")
        .filter((x) => !/^(PWD|OLDPWD|SHLVL|_|TMPDIR)$/.test(x))
        .join(",");
  out["code"] = String(r.code);
  out["stderr"] = norm(r.stderr, r).slice(0, 300);
  return out;
};

export const diffSig = (a: Sig, b: Sig): string[] =>
  [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(
    (k) => a[k] !== b[k],
  );

export type Baseline = {
  sig: Sig;
  noise: string[]; // keys that differ between two identical runs
  /** probe still valid: exit 0, an init event, and for B the hook and tool ran */
  valid: boolean;
  why: string;
};

/** Run a baseline twice; the keys that differ between the two are noise and must be ignored later. */
export const stableBaseline = async (
  bin: string,
  mk: () => Case,
  needHook: boolean,
): Promise<Baseline> => {
  const a = await runCase(bin, mk());
  const sa = sig(a);
  const hookRan = readIf(join(a.sb.cfg, "hook.log")) !== "";
  const hasInit = events(a).some((e) => e["subtype"] === "init");
  const ok = a.code === 0;
  dispose(a);
  const b = await runCase(bin, mk());
  const sb = sig(b);
  dispose(b);
  const why = [
    ok ? "" : `exit ${a.code}`,
    hasInit ? "" : "no init event",
    needHook && !hookRan ? "hook did not run" : "",
  ]
    .filter(Boolean)
    .join("; ");
  return { sig: sa, noise: diffSig(sa, sb), valid: !why, why };
};
