// Usage: bun tools/schemas/observe/statusline.ts <out-dir> [--to <version>]
// Runs the status line pty probes (fake key, local stub, temp HOME) and records the key paths and JSON types
// of the JSON that the program writes to the status line command's stdin. No value is kept.
// Roots: `$root` for the main status line, `subagentStatusLineInput` for the subagent panel.
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CLAUDE_CODE_VERSION } from "../../../src/version.ts";
import { binaryPath } from "../../release/lib/env.ts";
import {
  ASK,
  type PtyCase,
  type PtyRun,
  runPtyCase,
  stopStub,
  WAIT,
} from "../../release/probes/pty/harness.ts";
import { statuslineGroup } from "../../release/probes/pty/statusline.ts";
import { Tally } from "../observe.ts";

const out = process.argv[2];
const ti = process.argv.indexOf("--to");
const version =
  ti >= 0 ? (process.argv[ti + 1] as string) : CLAUDE_CODE_VERSION;
if (!out) throw new Error("usage: <out-dir> [--to <version>]");

const tally = new Tally();
const counts = { main: 0, sub: 0, runs: 0 };
const feed = (x: PtyRun, kind: "main" | "sub"): void => {
  const lines = x.file(`sllog/${kind}.log`).split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (!/^\d+\.\d+ ENV/.test(lines[i] ?? "")) continue;
    try {
      tally.add(
        kind === "main" ? "$root" : "subagentStatusLineInput",
        JSON.parse(lines[i + 1] ?? "") as unknown,
      );
      counts[kind]++;
    } catch {
      // not JSON: skip
    }
  }
};
const watch = ({ retryIf: _r, ...c }: PtyCase): PtyCase => ({
  ...c,
  facts: (x) => {
    counts.runs++;
    feed(x, "main");
    feed(x, "sub");
    return c.facts(x);
  },
});

const runDir = mkdtempSync(join(tmpdir(), "obs-sl-"));
try {
  const all = statuslineGroup.cases({} as never);
  const get = (id: string) => {
    const c = all.find((k) => k.id === id);
    if (!c) throw new Error(`no case ${id}`);
    return c;
  };
  const refresh = get("statusline.refresh-interval");
  const cases: PtyCase[] = [
    watch(refresh),
    watch(get("statusline.subagent-tick")),
    // a turn first, so the fields that need a finished request show up
    watch({
      ...refresh,
      id: "statusline.obs-turn",
      schedule: [{ ...WAIT("SL-ROW1", "ready", 30), rebase: true }, ASK()],
      secs: 22,
    }),
  ];
  const bin = binaryPath(version);
  for (const c of cases) {
    const r = await runPtyCase(
      { version, bin, runDir, only: null, dry: false },
      c,
    );
    console.log(c.id, r[0]?.facts["precondition"] === false ? "INVALID" : "ok");
  }
} finally {
  await stopStub();
  rmSync(runDir, { recursive: true, force: true });
}
mkdirSync(out, { recursive: true });
writeFileSync(
  join(out, "statusline.json"),
  `${JSON.stringify({ counts, paths: tally }, null, 1)}\n`,
);
console.log(JSON.stringify(counts));
