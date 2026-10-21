// `type: "script"` hook entries (ported from p305-print/script.ts): does the program accept them, and which hooks still run?
import type { CaseResult, Fact } from "../../lib/results.ts";
import {
  baseResult,
  dispose,
  oneCase,
  readIf,
  runCase,
  toolResults,
} from "./run.ts";
import type { PrintCtx, PrintGroup } from "./types.ts";

const cmd = (n: string) => ({
  type: "command",
  command: `cat >> {CFG}/${n}.log; echo >> {CFG}/${n}.log`,
});
const script = { type: "script", script: "echo x >> {CFG}/script.log" };
const VARIANTS: Record<string, Record<string, unknown>> = {
  "pre-script": {
    PreToolUse: [{ matcher: "Bash", hooks: [script] }],
    PostToolUse: [{ hooks: [cmd("post")] }],
    SessionStart: [{ hooks: [cmd("ss")] }],
  },
  "post-script": {
    PostToolUse: [{ hooks: [script, cmd("post")] }],
    SessionStart: [{ hooks: [cmd("ss")] }],
  },
  "pre-script-only": { PreToolUse: [{ matcher: "Bash", hooks: [script] }] },
  "no-script": {
    PreToolUse: [{ matcher: "Bash", hooks: [cmd("pre")] }],
    PostToolUse: [{ hooks: [cmd("post")] }],
    SessionStart: [{ hooks: [cmd("ss")] }],
  },
};

const runOne = (ctx: PrintCtx, name: string, hooks: Record<string, unknown>) =>
  oneCase(ctx, `print.hooks.script.${name}`, async () => {
    const r = await runCase(ctx.bin, {
      tool: "Bash",
      toolInput: { command: "echo hi" },
      args: ["--allowedTools", "Bash", "--debug-file", "{CFG}/debug.log"],
      cfgFiles: { "settings.json": JSON.stringify({ hooks }) },
    });
    try {
      const dbg = readIf(`${r.sb.cfg}/debug.log`);
      const ran = ["script", "pre", "post", "ss"].filter(
        (x) => readIf(`${r.sb.cfg}/${x}.log`) !== "",
      );
      const lines = dbg
        .split("\n")
        .filter((l) =>
          /script|Unknown hook|hook.*ignored|Invalid|settings.*(skip|invalid)/i.test(
            l,
          ),
        )
        .slice(0, 4);
      const facts: Record<string, Fact> = {
        precondition:
          r.code === 0 &&
          dbg !== "" &&
          toolResults(r) >= 1 &&
          (name !== "no-script" ||
            ["pre", "post", "ss"].every((x) => ran.includes(x))),
        "tool.results": toolResults(r),
        ran,
        "script.rejected": /Unknown hook type "script"/.test(dbg),
        "settings.skipped": /Invalid setting skipped/.test(dbg),
      };
      return baseResult(ctx, `print.hooks.script.${name}`, r, {
        facts,
        samples: { debug_lines: lines.map((l) => l.slice(0, 300)).join("\n") },
      });
    } finally {
      dispose(r);
    }
  });

export const scriptGroup: PrintGroup = {
  id: "hooks.script",
  title: "Script hook type acceptance",
  run: async (ctx) => {
    const out: CaseResult[] = [];
    for (const [n, h] of Object.entries(VARIANTS))
      out.push(...(await runOne(ctx, n, h)));
    return out;
  },
};
