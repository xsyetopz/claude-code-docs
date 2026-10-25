// Shared contract for print probes (task 1.3, chunks B2 and B3).
// index.ts (B2) runs groups from groups/a.ts (B2) and groups/b.ts (B3).
import type { CaseResult } from "../../lib/results.ts";

export type PrintCtx = {
  version: string; // Claude Code version under test
  bin: string; // path to the binary
  runDir: string; // from openRun(); write results with writeCase(runDir, r)
  only?: string[]; // case or group ids to run; undefined = all
  dry: boolean; // list cases, spawn nothing
};

export type PrintGroup = {
  id: string; // ^[A-Za-z0-9][A-Za-z0-9._-]*$, used as the case id prefix
  title: string;
  run: (ctx: PrintCtx) => Promise<CaseResult[]>;
};
