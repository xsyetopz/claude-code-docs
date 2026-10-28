// Compares the version-labelled facts of release:compare: per-fact results and doc tokens. The case diff functions come in as `deps`: they use NOISY,
// which stays in ../compare.ts, and a leaf never imports its facade at runtime.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { CaseResult } from "../../lib/results.ts";
import type { diffCase } from "../compare.ts";
import { invalidDetail, isEmpty } from "./data.ts";
import type { FactResult, FactRow } from "./types.ts";

export type FactDeps = {
  diffCase: typeof diffCase;
};

/** `result` per fact from the mapped probes (or, for diff kinds, from diff/*.json of `to`). */
export const factResultsWith = (
  { diffCase }: FactDeps,
  facts: FactRow[],
  a: CaseResult[],
  b: CaseResult[],
  diffChanged: Set<string> | null,
  schemaText: string | null = null,
  versions?: [string, string],
): FactResult[] => {
  const am = new Map(a.map((r) => [r.id, r]));
  const bm = new Map(b.map((r) => [r.id, r]));
  return facts.map((c) => {
    if (c.status === "static" || c.kind === "static" || c.kind === "external")
      return c;
    if (c.probes.length) {
      const why: string[] = [];
      const noise: Record<string, Record<string, string>> = {};
      let notRun = false;
      let changed = false;
      let invalid = false;
      for (const p of c.probes) {
        const o = am.get(p);
        const n = bm.get(p);
        if (!n) {
          notRun = true;
          why.push(`${p}: no result for the new version`);
          continue;
        }
        if (!o) {
          changed = true;
          why.push(`${p}: new case, no result for the old version`);
          continue;
        }
        const bad = invalidDetail(o, n);
        if (bad !== null) {
          invalid = true;
          why.push(`${p}: ${bad}`);
          continue;
        }
        // the sweep holds every env name: look at the data of the fact's names only
        const only =
          p.endsWith("sweep") && c.diffNames?.length
            ? (k: string) =>
                c.diffNames?.some((n2) => k.startsWith(`${n2}.`)) ?? false
            : undefined;
        const ignored: Record<string, string> = {};
        const d = diffCase(o, n, false, only, {
          id: p,
          ignored,
          ...(versions ? { versions } : {}),
        });
        if (Object.keys(ignored).length) noise[p] = ignored;
        if (!isEmpty(d)) {
          changed = true;
          why.push(
            `${p}: ${[...Object.keys(d.changed), ...Object.keys(d.added), ...Object.keys(d.removed)].slice(0, 5).join(", ")}`,
          );
        }
      }
      // a probe that did not run hides what the others say, so it comes first
      const result = notRun
        ? "not-run"
        : invalid
          ? "invalid-run"
          : changed
            ? "changed"
            : "unchanged";
      const noted = Object.entries(noise).flatMap(([p, m]) =>
        Object.keys(m).map((k) => `${p} ${k}`),
      );
      const text = why.join("; ");
      const note = noted.length ? `noise ignored: ${noted.join(", ")}` : "";
      return {
        ...c,
        result,
        why: !note
          ? text
          : result === "unchanged"
            ? `unchanged (${note})`
            : `${text}; ${note}`,
        ...(noted.length ? { noise } : {}),
      };
    }
    const notRun = (why: string): FactResult => ({
      ...c,
      result: "not-run",
      why,
    });
    if (c.kind === "manual")
      return notRun(
        "manual: program behaviour with no probe; check it by hand",
      );
    if (c.kind === "schema") {
      if (schemaText === null)
        return notRun("no schemas-diff.json for this version");
      const hit = (c.diffNames ?? []).filter((n) =>
        schemaText.includes(n.split(".").pop() ?? n),
      );
      return {
        ...c,
        result: hit.length ? "changed" : "unchanged",
        ...(hit.length
          ? { why: `in schemas-diff.json: ${hit.join(", ")}` }
          : {}),
      };
    }
    if (c.diffNames?.length) {
      if (!diffChanged) return notRun("no diff/ for this version");
      const hit = c.diffNames.filter((n) => diffChanged.has(n));
      return {
        ...c,
        result: hit.length ? "changed" : "unchanged",
        ...(hit.length ? { why: `in diff/: ${hit.join(", ")}` } : {}),
      };
    }
    return notRun("no probe and no diff name to look up");
  });
};

/** Backticked tokens in docs/ (whole token, and its first word: `--flag <v>` gives `--flag`). */
export const docTokens = (dir: string): Set<string> => {
  const out = new Set<string>();
  const walk = (d: string): void => {
    if (!existsSync(d)) return;
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.mdx?$/.test(n))
        for (const m of readFileSync(p, "utf8").matchAll(/`([^`\n]+)`/g)) {
          const t = (m[1] ?? "").trim();
          out.add(t);
          out.add(t.split(/\s/)[0] ?? t);
        }
    }
  };
  walk(dir);
  return out;
};
