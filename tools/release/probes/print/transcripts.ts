// Transcript (.jsonl) line types, keys, attachment types and api-request params (ported from p305-print/tr.ts, tr2.ts).
import { join } from "node:path";
import type { Fact } from "../../lib/results.ts";
import {
  baseResult,
  type Case,
  dispose,
  listFiles,
  obj,
  oneCase,
  type Run,
  readIf,
  runCase,
} from "./run.ts";
import { baselineB } from "./sig.ts";
import type { PrintGroup } from "./types.ts";

const STREAM = [
  "-p",
  "--input-format",
  "stream-json",
  "--output-format",
  "stream-json",
  "--verbose",
  "--model",
  "claude-opus-5-5",
];
const userLine = JSON.stringify({
  type: "user",
  message: { role: "user", content: "Reply with 'OK'." },
});
const twoTurns = (n: number): Case => ({
  noPrompt: true,
  argv: STREAM,
  stdin: `${Array.from({ length: n }, () => userLine).join("\n")}\n`,
});
const STYLE = "---\nname: st\ndescription: s\n---\nStyle.";

/** Parsed lines of every transcript file under the sandbox config dir. */
const transcript = (r: Run): Record<string, unknown>[] =>
  listFiles(r.sb.cfg)
    .filter((f) => f.startsWith("projects") && f.endsWith(".jsonl"))
    .flatMap((f) =>
      readIf(join(r.sb.cfg, f))
        .split("\n")
        .filter(Boolean)
        .map((l) => obj(JSON.parse(l))),
    );

const attTypes = (r: Run): string[] => {
  const s = new Set<string>();
  for (const j of transcript(r)) {
    const t = String(j["type"]);
    if (t === "attachment") s.add(String(obj(j["attachment"])["type"]));
    if (t === "user" && j["isMeta"]) s.add("isMeta-user");
    if (t === "user" && j["origin"]) s.add("user.origin");
    if (t === "assistant" && j["advisorModel"]) s.add("advisorModel");
    if (t === "system" && j["subtype"]) s.add(`sys:${String(j["subtype"])}`);
    if (
      [
        "ai-title",
        "mode",
        "permission-mode",
        "last-prompt",
        "file-history-snapshot",
      ].includes(t)
    )
      s.add(`line:${t}`);
  }
  return [...s].sort();
};

export const transcriptsGroup: PrintGroup = {
  id: "transcripts",
  title: "Transcript line shapes and attachments",
  run: async (ctx) => {
    const lines = await oneCase(ctx, "print.transcripts.lines", async () => {
      const b = baselineB();
      const cases: Case[] = [
        {
          ...b,
          projFiles: {
            "CLAUDE.md": "top memory",
            "sub/CLAUDE.md": "nested memory",
            "sub/f.txt": "x\n",
          },
          cfgFiles: { ...b.cfgFiles, "output-styles/st.md": STYLE },
          seq: [
            { name: "Read", input: { file_path: "{PROJ}/sub/f.txt" } },
            { name: "Bash", input: { command: "echo hi" } },
          ],
        },
        {
          seq: [{ name: "Read", input: { file_path: "{PROJ}/sub/f.txt" } }],
          projFiles: { "sub/CLAUDE.md": "nested", "sub/f.txt": "x\n" },
          args: ["--settings", JSON.stringify({ outputStyle: "st" })],
          cfgFiles: { "output-styles/st.md": STYLE },
        },
        { args: ["--permission-mode", "auto"] },
        twoTurns(2),
      ];
      const keysByType = new Map<string, Set<string>>();
      const att = new Set<string>();
      const params = new Set<string>();
      const baseKeys = new Set<string>();
      let betas: string[] = [];
      let lineCount = 0;
      let first: Run | null = null;
      let allOk = true;
      for (const c of cases) {
        const r = await runCase(ctx.bin, c);
        allOk &&= r.code === 0;
        for (const j of transcript(r)) {
          lineCount++;
          const t = String(j["type"]);
          const set = keysByType.get(t) ?? new Set<string>();
          for (const k of Object.keys(j)) set.add(k);
          keysByType.set(t, set);
          if (t === "attachment") att.add(String(obj(j["attachment"])["type"]));
          if (t === "api-request") {
            const p = obj(j["params"]);
            for (const k of Object.keys(p)) params.add(k);
            for (const k of Object.keys(obj(j["base"]))) baseKeys.add(k);
            if (Array.isArray(p["betas"])) betas = p["betas"].map(String);
          }
        }
        if (first) dispose(r);
        else first = r;
      }
      const facts: Record<string, Fact> = {
        precondition:
          allOk && keysByType.has("user") && keysByType.has("assistant"),
        "lines.total": lineCount,
        "attachment.types": [...att].sort(),
        "api_request.params_keys": [...params].sort(),
        "api_request.base_keys": [...baseKeys].sort(),
        "api_request.betas_count": betas.length,
        "api_request.betas": betas,
      };
      for (const [t, s] of [...keysByType].sort())
        facts[`line.${t}`] = [...s].sort();
      if (!first) throw new Error("no case ran");
      const res = baseResult(ctx, "print.transcripts.lines", first, {
        facts,
        notes:
          "Four runs merged (tools+memory, output style, auto mode, two stream-json turns); args shown are the first run.",
      });
      dispose(first);
      return res;
    });
    const atts = await oneCase(
      ctx,
      "print.transcripts.attachments",
      async () => {
        const edited = await runCase(ctx.bin, {
          seq: [
            { name: "Read", input: { file_path: "{PROJ}/f.txt" } },
            { name: "Bash", input: { command: "echo hi" } },
          ],
          args: ["--allowedTools", "Bash"],
          projFiles: { "f.txt": "one\n", "CLAUDE.md": "top" },
          cfgFiles: {
            "settings.json": JSON.stringify({
              hooks: {
                PostToolUse: [
                  {
                    matcher: "Read",
                    hooks: [
                      {
                        type: "command",
                        command: "echo changed >> {PROJ}/f.txt",
                      },
                    ],
                  },
                ],
              },
            }),
          },
        });
        const editedTypes = attTypes(edited);
        const fileChanged = readIf(join(edited.sb.proj, "f.txt")).includes(
          "changed",
        );
        const editedOk = edited.code === 0;
        dispose(edited);
        const three = await runCase(ctx.bin, twoTurns(3));
        const threeTypes = attTypes(three);
        const threeOk = three.code === 0 && threeTypes.length > 0;
        dispose(three);
        const plain = await runCase(ctx.bin, {});
        try {
          const plainTypes = attTypes(plain);
          return baseResult(ctx, "print.transcripts.attachments", plain, {
            facts: {
              precondition:
                plain.code === 0 &&
                plainTypes.length > 0 &&
                editedOk &&
                fileChanged &&
                threeOk,
              "hook.changed_file": fileChanged,
              edited_file_run: editedTypes,
              three_prompts: threeTypes,
              plain: plainTypes,
            },
            notes:
              "args/exit are from the plain run; the other two runs are a Read with a file-changing hook and three stream-json turns.",
          });
        } finally {
          dispose(plain);
        }
      },
    );
    return [...lines, ...atts];
  },
};
