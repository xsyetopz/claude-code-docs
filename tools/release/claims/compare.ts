// release:compare - diffs captures/<from>/ against captures/<to>/ per case id, and per claim when claims.json exists.
//   bun tools/release/cli.ts compare <from> <to> [--samples]     (or --from V --to V)
// Writes captures/<to>/compare/<from>..<to>.json and compare.md. Design: "Commands" and "Claim Map".
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { type CaseResult, type Fact, readRun } from "../lib/results.ts";
import { CAPTURES, type Ctx, ROOT, writeJson } from "../util.ts";

export type FactChange = { old: Fact; new: Fact };
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
  result?: "changed" | "unchanged" | "not-run";
  why?: string;
};
export type Compare = {
  from: string;
  to: string;
  counts: { cases: number; changed: number; unchanged: number };
  onlyFrom: string[];
  onlyTo: string[];
  cases: Record<string, CaseDiff>;
  claims?: ClaimResult[];
  /** names that appeared in diff/*.json for `to` and that no claim names (undocumented candidates) */
  uncoveredNames?: { kind: string; name: string }[];
  /** set when the old version has no case results */
  warning?: string;
};

const same = (a: Fact, b: Fact): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

export const diffCase = (
  a: CaseResult,
  b: CaseResult,
  withSamples: boolean,
  only?: (key: string) => boolean,
): CaseDiff => {
  const keep = (k: string) => !only || only(k);
  const d: CaseDiff = { added: {}, removed: {}, changed: {} };
  for (const [k, v] of Object.entries(b.facts)) {
    if (!keep(k)) continue;
    if (!(k in a.facts)) d.added[k] = v;
    else if (!same(a.facts[k] as Fact, v))
      d.changed[k] = { old: a.facts[k] as Fact, new: v };
  }
  for (const [k, v] of Object.entries(a.facts))
    if (keep(k) && !(k in b.facts)) d.removed[k] = v;
  if (withSamples) {
    const s: NonNullable<CaseDiff["samples"]> = {};
    const keys = new Set([
      ...Object.keys(a.samples ?? {}),
      ...Object.keys(b.samples ?? {}),
    ]);
    for (const k of keys) {
      const o = a.samples?.[k] ?? null;
      const n = b.samples?.[k] ?? null;
      if (keep(k) && o !== n) s[k] = { old: o, new: n };
    }
    if (Object.keys(s).length) d.samples = s;
  }
  return d;
};

const isEmpty = (d: CaseDiff): boolean =>
  !Object.keys(d.added).length &&
  !Object.keys(d.removed).length &&
  !Object.keys(d.changed).length &&
  !d.samples;

export const compareResults = (
  from: string,
  to: string,
  a: CaseResult[],
  b: CaseResult[],
  withSamples: boolean,
): Compare => {
  const am = new Map(a.map((r) => [r.id, r]));
  const bm = new Map(b.map((r) => [r.id, r]));
  const cases: Record<string, CaseDiff> = {};
  let unchanged = 0;
  for (const [id, r] of bm) {
    const o = am.get(id);
    if (!o) continue;
    const d = diffCase(o, r, withSamples);
    if (
      Object.keys(d.added).length +
        Object.keys(d.removed).length +
        Object.keys(d.changed).length ||
      d.samples
    )
      cases[id] = d;
    else unchanged++;
  }
  return {
    from,
    to,
    counts: {
      cases: [...bm.keys()].filter((id) => am.has(id)).length,
      changed: Object.keys(cases).length,
      unchanged,
    },
    onlyFrom: [...am.keys()].filter((id) => !bm.has(id)).sort(),
    onlyTo: [...bm.keys()].filter((id) => !am.has(id)).sort(),
    cases,
  };
};

/** `result` per claim from the mapped probes (or, for diff kinds, from diff/*.json of `to`). */
export const claimResults = (
  claims: ClaimRow[],
  a: CaseResult[],
  b: CaseResult[],
  diffChanged: Set<string> | null,
  schemaText: string | null = null,
): ClaimResult[] => {
  const am = new Map(a.map((r) => [r.id, r]));
  const bm = new Map(b.map((r) => [r.id, r]));
  return claims.map((c) => {
    if (c.status === "static" || c.kind === "static" || c.kind === "external")
      return c;
    if (c.probes.length) {
      const why: string[] = [];
      let notRun = false;
      let changed = false;
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
        // the sweep holds every env name: look at the facts of the claim's names only
        const only =
          p.endsWith("sweep") && c.diffNames?.length
            ? (k: string) =>
                c.diffNames?.some((n2) => k.startsWith(`${n2}.`)) ?? false
            : undefined;
        const d = diffCase(o, n, false, only);
        if (!isEmpty(d)) {
          changed = true;
          why.push(
            `${p}: ${[...Object.keys(d.changed), ...Object.keys(d.added), ...Object.keys(d.removed)].slice(0, 5).join(", ")}`,
          );
        }
      }
      // a probe that did not run hides what the others say, so it comes first
      const result = notRun ? "not-run" : changed ? "changed" : "unchanged";
      return { ...c, result, why: why.join("; ") };
    }
    const notRun = (why: string): ClaimResult => ({
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

const DIFF_FILES = [
  "strings-env.json",
  "flags.json",
  "commands.json",
  "settings.json",
  "hooks.json",
  "gates.json",
];
type DiffJson = {
  kind: string;
  added?: string[];
  removed?: string[];
  changed?: { name: string }[];
};
const readDiffs = (dir: string): DiffJson[] =>
  DIFF_FILES.map((f) => join(dir, "diff", f))
    .filter((p) => existsSync(p))
    .map((p) => JSON.parse(readFileSync(p, "utf8")) as DiffJson);

const fmt = (v: unknown): string => {
  const s = JSON.stringify(v);
  return s.length > 80 ? `${s.slice(0, 77)}...` : s;
};

export const renderCompare = (c: Compare): string => {
  const L: string[] = [`# Compare ${c.from} to ${c.to}`, ""];
  if (c.warning) L.push(`> **WARNING:** ${c.warning}`, "");
  const work = (c.claims ?? []).filter(
    (x) => x.result === "changed" || x.result === "not-run",
  );
  L.push("## Worklist", "");
  if (c.claims) {
    L.push(`Claims to re-check: ${work.length} of ${c.claims.length}.`, "");
    for (const r of work)
      L.push(
        `- ${r.result}: \`${r.id}\` (${r.file}:${r.line}, ${r.kind ?? "?"})${r.why ? ` - ${r.why}` : ""}`,
      );
  } else L.push("No claims.json for this version: run `release:claims` first.");
  L.push("");
  if (c.uncoveredNames) {
    L.push(
      `New names in diff/ that no claim covers: ${c.uncoveredNames.length}.`,
      "",
    );
    for (const n of c.uncoveredNames.slice(0, 80))
      L.push(`- ${n.kind}: \`${n.name}\``);
    if (c.uncoveredNames.length > 80)
      L.push(`- ... ${c.uncoveredNames.length - 80} more (see the JSON)`);
    L.push("");
  }
  L.push(
    "## Cases",
    "",
    `${c.counts.cases} in both, ${c.counts.changed} changed, ${c.counts.unchanged} unchanged, ${c.onlyFrom.length} only in ${c.from}, ${c.onlyTo.length} only in ${c.to}.`,
    "",
  );
  for (const [id, d] of Object.entries(c.cases)) {
    L.push(`### \`${id}\``, "");
    for (const [k, v] of Object.entries(d.changed))
      L.push(`- changed \`${k}\`: ${fmt(v.old)} -> ${fmt(v.new)}`);
    for (const [k, v] of Object.entries(d.added))
      L.push(`- added \`${k}\`: ${fmt(v)}`);
    for (const [k, v] of Object.entries(d.removed))
      L.push(`- removed \`${k}\`: ${fmt(v)}`);
    for (const k of Object.keys(d.samples ?? {}))
      L.push(`- sample \`${k}\` differs`);
    L.push("");
  }
  if (c.onlyFrom.length)
    L.push(
      `## Only in ${c.from}`,
      "",
      ...c.onlyFrom.map((i) => `- \`${i}\``),
      "",
    );
  if (c.onlyTo.length)
    L.push(`## Only in ${c.to}`, "", ...c.onlyTo.map((i) => `- \`${i}\``), "");
  return `${L.join("\n")}\n`;
};

/** Backticked tokens in docs/ (whole token, and its first word: `--flag <v>` gives `--flag`). */
const docTokens = (dir: string): Set<string> => {
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

/** Everything but the file writes, so the selftest can run it on fixture dirs. */
export const compareRuns = (
  from: string,
  to: string,
  base: string,
  withSamples: boolean,
  docsDir = join(ROOT, "docs"),
): Compare => {
  const a = readRun(from, base);
  const b = readRun(to, base);
  const c = compareResults(from, to, a, b, withSamples);
  const diffs = readDiffs(join(base, to));
  const changedNames = new Set(
    diffs.flatMap((d) => [
      ...(d.added ?? []),
      ...(d.removed ?? []),
      ...(d.changed ?? []).map((x) => x.name),
    ]),
  );
  const cp = join(base, to, "claims.json");
  if (existsSync(cp)) {
    const rows = JSON.parse(readFileSync(cp, "utf8")) as ClaimRow[];
    const sp = join(base, to, "schemas-diff.json");
    c.claims = claimResults(
      rows,
      a,
      b,
      diffs.length ? changedNames : null,
      existsSync(sp) ? readFileSync(sp, "utf8") : null,
    );
  }
  if (diffs.length) {
    const tokens = docTokens(docsDir);
    c.uncoveredNames = diffs.flatMap((d) =>
      (d.added ?? [])
        .filter((n) => !tokens.has(n))
        .map((n) => ({ kind: d.kind, name: n })),
    );
  }
  return c;
};

export const runCompare = async (ctx: Ctx): Promise<number> => {
  const { from, to } = ctx; // cli.ts turns `compare <from> <to>` into --from/--to
  if (!to)
    throw new Error("no <to> version given and no installed binary found");
  for (const v of [from, to])
    if (!existsSync(join(CAPTURES, v)))
      throw new Error(`no captures/${v}/ (run the probes for ${v} first)`);
  const c = compareRuns(from, to, CAPTURES, ctx.rest.includes("--samples"));
  const noOld = readRun(from, CAPTURES).length === 0;
  if (noOld) {
    c.warning = `captures/${from}/ has no case results (print/ or pty/), so every probed claim shows as changed. Run \`release:probe:print -- --to ${from}\` and \`release:probe:pty -- --to ${from}\` with the old binary installed, then compare again.`;
    console.error(`release:compare WARNING: ${c.warning}`);
  }
  const dir = join(CAPTURES, to, "compare");
  const jsonPath = join(dir, `${from}..${to}.json`);
  const mdPath = join(dir, "compare.md");
  const work = (c.claims ?? []).filter(
    (x) => x.result === "changed" || x.result === "not-run",
  ).length;
  console.log(
    `release:compare ${from}..${to}: ${c.counts.cases} cases in both (${c.counts.changed} changed), ${c.onlyFrom.length} only in from, ${c.onlyTo.length} only in to; worklist ${c.claims ? `${work} claims` : "no claims.json"}${c.uncoveredNames ? `, ${c.uncoveredNames.length} uncovered names` : ""}`,
  );
  if (ctx.dry) return 0;
  writeJson(jsonPath, c);
  writeFileSync(mdPath, renderCompare(c));
  console.log(`  wrote ${jsonPath}\n  wrote ${mdPath}`);
  return 0;
};
