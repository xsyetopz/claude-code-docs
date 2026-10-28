import { expect, test } from "bun:test";
import type { CaseResult } from "../lib/results.ts";
import { diffCase } from "./compare.ts";

const run = (keys: string): CaseResult =>
  ({
    schema: 1,
    id: "print.request.baseline-a",
    facts: [],
    data: { evkeys: `sha1:${keys.length} len=${keys.length}` },
    samples: { evkeys: keys },
  }) as unknown as CaseResult;

test("hashed data that changed names the parts its samples gained and lost", () => {
  const d = diffCase(
    run("system:type,uuid|result:type,usage"),
    run("system:type,uuid|result:type,usage,model_usage_since_last_result"),
    false,
  );
  expect(d.changed["evkeys"]?.added).toEqual(["model_usage_since_last_result"]);
  expect(d.changed["evkeys"]?.removed).toEqual([]);
});
