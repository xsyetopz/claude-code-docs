// Fixture tests for claims and compare (run by `release:check --selftest`): no binary, no captures/, temp dirs only.
import { mkdtempSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runClaimsChecks } from "./selftest/claims.ts";
import { runCompareChecks } from "./selftest/compare.ts";
import type { Step } from "./selftest/fixture.ts";
import { runResultsChecks } from "./selftest/results.ts";

export const runClaimsSelftest = (step: Step): void => {
  const root = mkdtempSync(join(realpathSync(tmpdir()), "ccrel-claims-"));
  try {
    runClaimsChecks(step, root);
    const { base, b } = runCompareChecks(step, root);
    runResultsChecks(step, root, base, b);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};
