// Fixture tests for facts and compare (run by `release:check --selftest`): no binary, no captures/, temp dirs only.
import { mkdtempSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runCompareChecks } from "./selftest/compare.ts";
import { runFactsChecks } from "./selftest/facts.ts";
import type { Step } from "./selftest/fixture.ts";
import { runResultsChecks } from "./selftest/results.ts";

export const runFactsSelftest = (step: Step): void => {
  const root = mkdtempSync(join(realpathSync(tmpdir()), "ccrel-facts-"));
  try {
    runFactsChecks(step, root);
    const { base, b } = runCompareChecks(step, root);
    runResultsChecks(step, root, base, b);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};
