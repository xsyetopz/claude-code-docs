// Types of release:compare: the case diff, the claim rows and results, and the whole Compare record.
import type { Fact } from "../../lib/results.ts";

/** `added`/`removed`: parts of the full sample text, when the fact is a hash of it */
export type FactChange = {
  old: Fact;
  new: Fact;
  added?: string[];
  removed?: string[];
};

export type CaseDiff = {
  added: Record<string, Fact>;
  removed: Record<string, Fact>;
  changed: Record<string, FactChange>;
  samples?: Record<string, { old: string | null; new: string | null }>;
};
export type ClaimRow = {
  id: string;
  file: string;
  line: number;
  text: string;
  kind: string | null;
  probes: string[];
  status: string;
  class?: string;
  diffNames?: string[];
};
export type ClaimResult = ClaimRow & {
  result?: "changed" | "unchanged" | "not-run" | "invalid-run";
  why?: string;
  /** probe case id -> fact -> why it was ignored for this claim (same rules as Compare.noise) */
  noise?: Record<string, Record<string, string>>;
};
export type Compare = {
  from: string;
  to: string;
  counts: {
    cases: number;
    changed: number;
    unchanged: number;
    /** cases where either side has precondition=false; not diffed */
    invalid: number;
  };
  /** case id -> fact -> why it was ignored (known run-to-run noise, or a version string only); not diffs */
  noise?: Record<string, Record<string, string>>;
  /** case id -> precondition.detail for each invalid run */
  invalidRuns?: Record<string, string>;
  onlyFrom: string[];
  onlyTo: string[];
  cases: Record<string, CaseDiff>;
  claims?: ClaimResult[];
  /** names that appeared in diff/*.json for `to` and that no claim names (undocumented candidates) */
  uncoveredNames?: { kind: string; name: string }[];
  /** set when the old version has no case results */
  warning?: string;
};
