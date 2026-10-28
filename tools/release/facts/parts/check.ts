// release:facts --check - the known probe case ids and the map.json checks.
import { existsSync, readdirSync } from "node:fs";
import { readRun } from "../../lib/results.ts";
import { LIVE_CASES } from "../../probes/live/cases.ts";
import { CAPTURES } from "../../util.ts";
import type { Fact, FactMap } from "../facts.ts";
import { KINDS } from "./kinds.ts";

export type Known = {
  ids: Set<string>;
  /** case id -> `facts` the result files declare */
  facts: Map<string, Set<string>>;
  /** false when no result files exist: print, pty and managed ids cannot be checked then */
  fromDisk: boolean;
};

/**
 * Case ids that exist: result files under captures/* plus the live registry (a static list). The print, pty and
 * managed registries build their cases by running, so for those a result file is the cheap source.
 */
export const knownCases = (base = CAPTURES): Known => {
  const k: Known = {
    ids: new Set(LIVE_CASES.map((c) => `live.${c.id}`)),
    facts: new Map(),
    fromDisk: false,
  };
  if (!existsSync(base)) return k;
  // oldest first, so a case's newest capture sets its facts; older ones hold ids since renamed
  const versions = readdirSync(base)
    .filter((n) => /^\d+\.\d+\.\d+$/.test(n))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  for (const v of versions)
    for (const r of readRun(v, base)) {
      k.fromDisk = true;
      k.ids.add(r.id);
      k.facts.set(r.id, new Set(r.facts));
    }
  return k;
};

export type Check = { errors: string[]; warnings: string[] };

export const checkFacts = (
  facts: Fact[],
  map: FactMap,
  known: Known,
  all: Fact[] = facts,
): Check => {
  const errors: string[] = [];
  const warnings: string[] = [];
  for (const c of facts)
    if (c.status === "unmapped")
      errors.push(`unmapped: ${c.id} (${c.file}:${c.line})`);
  const live = new Set(all.map((c) => c.id));
  const used = new Set<string>();
  if (!known.fromDisk)
    warnings.push(
      "no result files in captures/: only live.* probe ids are checked (from the live registry)",
    );
  for (const [id, e] of Object.entries(map)) {
    if (!(KINDS as readonly string[]).includes(e.kind))
      errors.push(`map.json: unknown kind "${e.kind}" for ${id}`);
    if (!live.has(id)) warnings.push(`map.json entry has no fact: ${id}`);
    for (const p of e.probes) {
      used.add(p);
      if (!known.ids.has(p) && (known.fromDisk || p.startsWith("live.")))
        warnings.push(`map.json probe not found in any result: ${p} (${id})`);
      const declared = known.facts.get(p);
      if (declared && !declared.has(id))
        warnings.push(`probe ${p} does not list fact ${id} in its facts`);
    }
  }
  // probe-declared facts: ids (they contain `#`) must be current facts that map.json maps back to the case
  for (const [caseId, set] of known.facts)
    for (const c of set) {
      if (!c.includes("#")) continue;
      if (!live.has(c))
        warnings.push(
          `probe ${caseId} lists a fact id that no longer exists: ${c}`,
        );
      else if (!map[c]?.probes.includes(caseId))
        warnings.push(
          `probe ${caseId} lists ${c}, but map.json does not map it to this probe`,
        );
    }
  const unused = [...known.ids].filter((p) => !used.has(p));
  if (unused.length)
    warnings.push(
      `${unused.length} probe case(s) no fact uses${unused.length > 8 ? ` (first 8: ${unused.slice(0, 8).join(", ")})` : `: ${unused.join(", ")}`}`,
    );
  return { errors, warnings };
};
