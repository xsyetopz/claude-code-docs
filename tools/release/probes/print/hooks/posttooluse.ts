// PostToolUse / PostToolUseFailure hook input shapes per tool (ported from p305-print/ptu.ts).
// The stub asks for the tool(s); a command hook logs its stdin JSON; the data is the key sets.
import type { CaseResult, Data } from "../../../lib/results.ts";
import {
  arr,
  baseResult,
  type Case,
  dispose,
  msgs,
  obj,
  oneCase,
  readIf,
  runCase,
  type Seq,
  toolResults,
} from "../run.ts";
import type { PrintCtx, PrintGroup } from "../types.ts";

const logHook = (name: string) => ({
  hooks: [
    {
      type: "command",
      command: `cat >> {CFG}/${name}.log; echo >> {CFG}/${name}.log`,
    },
  ],
});
const SETTINGS = JSON.stringify({
  hooks: {
    PostToolUse: [logHook("ptu")],
    PostToolUseFailure: [logHook("ptuf")],
  },
});

const EDIT = {
  file_path: "{PROJ}/a.txt",
  old_string: "one",
  new_string: "two",
};
const READ = { name: "Read", input: { file_path: "{PROJ}/a.txt" } };
const AGENT = {
  description: "d",
  prompt: "say hi",
  subagent_type: "general-purpose",
};
const CASES: [string, Seq][] = [
  ["bash", [{ name: "Bash", input: { command: "echo hi" } }]],
  ["read", [READ]],
  [
    "write",
    [
      {
        name: "Write",
        input: { file_path: "{PROJ}/new.txt", content: "hello\n" },
      },
    ],
  ],
  ["edit", [READ, { name: "Edit", input: EDIT }]],
  ["edit-no-read", [{ name: "Edit", input: EDIT }]],
  [
    "toolsearch",
    [{ name: "ToolSearch", input: { query: "select:Read", max_results: 3 } }],
  ],
  ["agent", [{ name: "Agent", input: AGENT }]],
  [
    "agent-bg",
    [{ name: "Agent", input: { ...AGENT, run_in_background: true } }],
  ],
  ["listagents", [{ name: "ListAgents", input: {} }]],
  [
    "croncreate",
    [
      {
        name: "CronCreate",
        input: { cron: "*/5 * * * *", prompt: "x", recurring: true },
      },
    ],
  ],
  ["cronlist", [{ name: "CronList", input: {} }]],
  ["glob", [{ name: "Glob", input: { pattern: "*.txt" } }]],
  ["grep", [{ name: "Grep", input: { pattern: "one" } }]],
  [
    "notebookedit",
    [
      {
        name: "NotebookEdit",
        input: {
          notebook_path: "{PROJ}/n.ipynb",
          new_source: "x",
          edit_mode: "insert",
          cell_type: "code",
        },
      },
    ],
  ],
  [
    "webfetch",
    [{ name: "WebFetch", input: { url: "http://127.0.0.1:9/x", prompt: "p" } }],
  ],
  ["websearch", [{ name: "WebSearch", input: { query: "x" } }]],
  [
    "edit-after-write",
    [
      { name: "Write", input: { file_path: "{PROJ}/w.txt", content: "one\n" } },
      { name: "Edit", input: { ...EDIT, file_path: "{PROJ}/w.txt" } },
    ],
  ],
  [
    "edit-after-bash",
    [
      { name: "Bash", input: { command: "cat a.txt" } },
      { name: "Edit", input: EDIT },
    ],
  ],
  [
    "edit-partial-read",
    [
      {
        name: "Read",
        input: { file_path: "{PROJ}/a.txt", offset: 1, limit: 1 },
      },
      { name: "Edit", input: EDIT },
    ],
  ],
];

const keys = (x: unknown): string[] => Object.keys(obj(x));

const runOne = async (ctx: PrintCtx, name: string, seq: Seq) =>
  oneCase(ctx, `print.hooks.posttooluse.${name}`, async () => {
    const c: Case = {
      seq,
      args: [
        "--permission-mode",
        "acceptEdits",
        "--allowedTools",
        "Bash,Read,Write,Edit,ToolSearch,Agent",
      ],
      projFiles: { "a.txt": "one\ntwo\n" },
      cfgFiles: { "settings.json": SETTINGS },
      timeoutMs: 45_000,
    };
    const r = await runCase(ctx.bin, c);
    try {
      const first = seq[0]?.name ?? "";
      const toolNames = arr(obj(msgs(r)[0]?.body)["tools"]).map((t) =>
        String(obj(t)["name"]),
      );
      const offered = toolNames.includes(first);
      const results = toolResults(r);
      // not-offered is a recorded outcome (the tool is deferred or absent), not a broken probe
      const outcome = !offered
        ? "not-offered"
        : results >= seq.length
          ? "ran"
          : "no-result";
      const data: Record<string, Data> = {
        precondition:
          r.code === 0 && msgs(r).length > 0 && outcome !== "no-result",
        outcome,
        "tool.offered": offered,
        "tool.results": results,
      };
      const lines = readIf(`${r.sb.cfg}/ptu.log`).split("\n").filter(Boolean);
      data["hook.calls"] = lines.length;
      const seen = new Map<string, number>();
      for (const l of lines) {
        const j = obj(JSON.parse(l));
        const tn = String(j["tool_name"]);
        const n = (seen.get(tn) ?? 0) + 1;
        seen.set(tn, n);
        const p = n > 1 ? `${tn}#${n}` : tn;
        const resp = j["tool_response"];
        const ro = obj(resp);
        data[`${p}.hook_keys`] = Object.keys(j);
        data[`${p}.input_keys`] = keys(j["tool_input"]);
        data[`${p}.response`] =
          resp && typeof resp === "object"
            ? Object.keys(ro)
            : (JSON.stringify(resp) ?? "").slice(0, 100);
        if (ro["file"]) data[`${p}.file_keys`] = keys(ro["file"]);
        if (ro["type"] !== undefined) data[`${p}.type`] = String(ro["type"]);
        if (ro["status"] !== undefined)
          data[`${p}.status`] = String(ro["status"]);
        if (ro["structuredPatch"] !== undefined)
          data[`${p}.patch`] = (
            JSON.stringify(ro["structuredPatch"]) ?? ""
          ).slice(0, 60);
        if ("originalFile" in ro)
          data[`${p}.original_file_null`] = ro["originalFile"] === null;
      }
      const fail = readIf(`${r.sb.cfg}/ptuf.log`);
      data["failure_hook.fired"] = fail !== "";
      if (fail) {
        const j = obj(JSON.parse(fail.split("\n").filter(Boolean)[0] ?? "{}"));
        data["failure_hook.keys"] = Object.keys(j);
        data["failure_hook.error"] = String(j["error"] ?? "").slice(0, 120);
      }
      return baseResult(ctx, `print.hooks.posttooluse.${name}`, r, {
        data,
        samples: fail ? { failure_hook: fail } : undefined,
        notes: "Stub requests the tool; the hook logs its stdin.",
      });
    } finally {
      dispose(r);
    }
  });

export const ptuGroup: PrintGroup = {
  id: "hooks.posttooluse",
  title: "PostToolUse hook input and tool_response shapes",
  run: async (ctx) => {
    const out: CaseResult[] = [];
    for (const [name, seq] of CASES)
      out.push(...(await runOne(ctx, name, seq)));
    return out;
  },
};
