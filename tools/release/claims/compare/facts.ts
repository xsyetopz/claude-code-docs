// Fact helpers of release:compare: equality, sample parts, ignored facts, empty diffs, invalid runs.
import type { CaseResult, Fact } from "../../lib/results.ts";
import type { CaseDiff } from "./types.ts";

export const PARTS_CAP = 10;
export const parts = (s: string) => s.split(/[,|\s]+/).filter(Boolean);
export const minus = (a: string[], b: string[]) => {
  const left = new Map<string, number>();
  for (const x of b) left.set(x, (left.get(x) ?? 0) + 1);
  return a.filter((x) => {
    const n = left.get(x) ?? 0;
    if (n) left.set(x, n - 1);
    return !n;
  });
};

export const same = (a: Fact, b: Fact): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

/** Facts that describe how a run went, not what the program does: never a diff. */
export const IGNORED_FACTS = new Set(["retried", "startLagS"]);

/** The precondition.detail of an invalid run (either side), or null when both runs are valid. */
export const invalidDetail = (a: CaseResult, b: CaseResult): string | null => {
  for (const [side, r] of [
    ["old", a],
    ["new", b],
  ] as const)
    if (r.facts["precondition"] === false)
      return `${side}: ${String(r.facts["precondition.detail"] ?? r.facts["error"] ?? "precondition false")}`;
  return null;
};

export const isEmpty = (d: CaseDiff): boolean =>
  !Object.keys(d.added).length &&
  !Object.keys(d.removed).length &&
  !Object.keys(d.changed).length &&
  !d.samples;
