// Interactive Perfetto trace (ported from captures/p305-scripts/p305-fix/run.sh + drv.py): one standard prompt, then list trace files.
// Print mode wrote no trace file on 2.1.305; this records whether the interactive screen does.
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  ASK,
  ESC,
  type Fact,
  type PtyCase,
  type PtyGroup,
  type PtyRun,
  pre,
  READY,
} from "./harness.ts";

const walk = (d: string, base = d): string[] =>
  readdirSync(d).flatMap((n) => {
    const p = join(d, n);
    return statSync(p).isDirectory()
      ? walk(p, base)
      : [p.slice(base.length + 1)];
  });

const traceFacts = (x: PtyRun, value: string): Record<string, Fact> => {
  const files = walk(x.sb.root).filter((f) =>
    /trace|perfetto|pftrace/i.test(f),
  );
  return {
    ...pre(x.messages.length > 0, "the program never reached the stub"),
    value,
    traceFiles: files
      .map((f) => f.replace(/ccrel-[A-Za-z0-9]+/g, "<TMP>"))
      .sort(),
    traceFileCount: files.length,
  };
};

const perfetto = (name: string, value: string): PtyCase => ({
  id: `perfetto.interactive-${name}`,
  env: {
    CLAUDE_CODE_PERFETTO_TRACE: value,
    CLAUDE_CODE_PERFETTO_WRITE_INTERVAL_S: "1",
  },
  schedule: [READY, ASK(), ESC(12)],
  secs: 14,
  claims: ["env.CLAUDE_CODE_PERFETTO_TRACE"],
  notes: `CLAUDE_CODE_PERFETTO_TRACE=${value}, write interval 1 s, one interactive prompt.`,
  facts: (x) => traceFacts(x, value),
});

export const perfettoGroup: PtyGroup = {
  id: "perfetto",
  title: "interactive Perfetto trace output",
  cases: () => [perfetto("one", "1"), perfetto("path", "{HOME}/trace.pftrace")],
};
