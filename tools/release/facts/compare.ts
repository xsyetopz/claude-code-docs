// release:compare - diffs captures/<from>/ against captures/<to>/ per case id, and per fact when facts.json exists.
//   bun tools/release/cli.ts compare <from> <to> [--samples]     (or --from V --to V)
// Writes captures/<to>/compare/<from>..<to>.json and compare.md.
// Design: the same archived design file, sections "Commands" and "Claim Map" under the old term.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { type CaseResult, type Data, readRun } from "../lib/results.ts";
import { CAPTURES, type Ctx, ROOT, writeJson } from "../util.ts";
import {
  IGNORED_DATA,
  invalidDetail,
  minus,
  PARTS_CAP,
  parts,
  same,
} from "./compare/data.ts";
import { docTokens, factResultsWith } from "./compare/facts.ts";
import { readDiffs, renderCompare } from "./compare/render.ts";
import type {
  CaseDiff,
  Compare,
  DataChange,
  FactResult,
  FactRow,
} from "./compare/types.ts";

export type { CaseDiff, Compare, DataChange, FactResult, FactRow };
export { invalidDetail, renderCompare };

/**
 * Known noise by case id: data that differ between two runs of the SAME version, so they are not release changes.
 * `data` matches whole data names and drops them. `items` removes those array elements from the data that
 * `itemData` matches, then drops the data when the two sides are then equal. With `values`, a `data` match is
 * noise only when both sides are in that list, so a value outside the range seen across reruns still shows.
 * With `unordered`, a `data` match is noise only when the two arrays hold the same items.
 * Ignored data is listed under "Noise (ignored)" in compare.md, never dropped silently.
 */
type Noisy = {
  why: string;
  data?: RegExp;
  values?: Data[];
  unordered?: boolean;
  itemData?: RegExp;
  items?: string[];
};
const MCP_ORDER: Noisy[] = [
  {
    why: "the servers start in parallel, so their order varies from run to run (seen on 2.1.306 to 2.1.308)",
    data: /^started$/,
    unordered: true,
  },
];

export const NOISY: Record<string, Noisy[]> = {
  "managed.baseline.mcp-config-flag": MCP_ORDER,
  "managed.main.mcp-config-flag": MCP_ORDER,
  "print.subagents.observer.on": [
    {
      why: "the background observer sends 3 or 5 requests from run to run (seen on 2.1.306 to 2.1.308)",
      data: /^(observerReportToolIn|observerMessageIn)$/,
      values: [3, 5],
    },
    {
      why: "the request count follows the observer's 3 or 5 requests",
      data: /^messages$/,
      values: [10, 12],
    },
  ],
  "print.sweep": [
    {
      why: "with Mantle on, the run times out before any stub request, so its stderr varies from run to run",
      itemData: /^CLAUDE_CODE_USE_MANTLE\.[AB]$/,
      items: ["stderr", "cfgfiles"],
    },
    {
      why: "API_TIMEOUT_MS sets a tiny timeout, so the retry count depends on machine load",
      data: /^API_TIMEOUT_MS\.[AB]$/,
    },
    {
      why: "cfgfiles flips for a random name on each run",
      itemData: /\.[AB]$/,
      items: ["cfgfiles"],
    },
    {
      why: "list derived from the NAME.A and NAME.B data, which is compared on their own",
      data: /^changed$/,
    },
  ],
};

/** `old` with every `from` replaced by `to` equals `now`: the only change is the version string. */
const versionOnly = (old: Data, now: Data, v?: [string, string]): boolean =>
  !!v &&
  JSON.stringify(old).includes(v[0]) &&
  JSON.stringify(old).replaceAll(v[0], v[1]) === JSON.stringify(now);

/** Why a changed data is not a release change, or null. */
const noiseReason = (
  id: string | undefined,
  k: string,
  old: Data,
  now: Data,
  v?: [string, string],
): string | null => {
  if (versionOnly(old, now, v)) return "version string only";
  for (const n of (id && NOISY[id]) || []) {
    const inRange = (f: Data) => n.values?.some((x) => same(x, f)) ?? true;
    const sorted = (f: Data) =>
      JSON.stringify(Array.isArray(f) ? [...f].sort() : f);
    if (n.unordered && n.data?.test(k))
      return sorted(old) === sorted(now) ? n.why : null;
    if (n.data?.test(k) && inRange(old) && inRange(now)) return n.why;
    if (
      n.itemData?.test(k) &&
      n.items &&
      Array.isArray(old) &&
      Array.isArray(now)
    ) {
      const strip = (a: Data[]) =>
        JSON.stringify(a.filter((x) => !n.items?.includes(String(x))));
      if (strip(old as Data[]) === strip(now as Data[])) return n.why;
    }
  }
  return null;
};

export type DiffOpts = {
  /** case id, to look up NOISY */
  id?: string;
  /** [from, to]: data that differs only by this version string is ignored */
  versions?: [string, string];
  /** receives data -> reason for each ignored data */
  ignored?: Record<string, string>;
};

export const diffCase = (
  a: CaseResult,
  b: CaseResult,
  withSamples: boolean,
  only?: (key: string) => boolean,
  opts: DiffOpts = {},
): CaseDiff => {
  const keep = (k: string) => !IGNORED_DATA.has(k) && (!only || only(k));
  const d: CaseDiff = { added: {}, removed: {}, changed: {} };
  for (const [k, v] of Object.entries(b.data)) {
    if (!keep(k)) continue;
    if (!(k in a.data)) d.added[k] = v;
    else if (!same(a.data[k] as Data, v)) {
      const why = noiseReason(opts.id, k, a.data[k] as Data, v, opts.versions);
      if (why !== null && opts.ignored) opts.ignored[k] = why;
      if (why !== null) continue;
      d.changed[k] = { old: a.data[k] as Data, new: v };
      const so = a.samples?.[k];
      const sn = b.samples?.[k];
      if (so !== undefined && sn !== undefined) {
        const [po, pn] = [parts(so), parts(sn)];
        d.changed[k].added = minus(pn, po).slice(0, PARTS_CAP);
        d.changed[k].removed = minus(po, pn).slice(0, PARTS_CAP);
      }
    }
  }
  for (const [k, v] of Object.entries(a.data))
    if (keep(k) && !(k in b.data)) d.removed[k] = v;
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
  const invalidRuns: Record<string, string> = {};
  const noise: Record<string, Record<string, string>> = {};
  let unchanged = 0;
  for (const [id, r] of bm) {
    const o = am.get(id);
    if (!o) continue;
    const bad = invalidDetail(o, r);
    if (bad !== null) {
      invalidRuns[id] = bad;
      continue;
    }
    const ignored: Record<string, string> = {};
    const d = diffCase(o, r, withSamples, undefined, {
      id,
      versions: [from, to],
      ignored,
    });
    if (Object.keys(ignored).length) noise[id] = ignored;
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
      invalid: Object.keys(invalidRuns).length,
    },
    ...(Object.keys(invalidRuns).length ? { invalidRuns } : {}),
    ...(Object.keys(noise).length ? { noise } : {}),
    onlyFrom: [...am.keys()].filter((id) => !bm.has(id)).sort(),
    onlyTo: [...bm.keys()].filter((id) => !am.has(id)).sort(),
    cases,
  };
};

/** `result` per fact from the mapped probes (or, for diff kinds, from diff/*.json of `to`). */
export const factResults = (
  facts: FactRow[],
  a: CaseResult[],
  b: CaseResult[],
  diffChanged: Set<string> | null,
  schemaText: string | null = null,
  versions?: [string, string],
): FactResult[] =>
  factResultsWith({ diffCase }, facts, a, b, diffChanged, schemaText, versions);

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
  const cp = join(base, to, "facts.json");
  if (existsSync(cp)) {
    const rows = JSON.parse(readFileSync(cp, "utf8")) as FactRow[];
    const sp = join(base, to, "schemas-diff.json");
    c.facts = factResults(
      rows,
      a,
      b,
      diffs.length ? changedNames : null,
      existsSync(sp) ? readFileSync(sp, "utf8") : null,
      [from, to],
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
    c.warning = `captures/${from}/ has no case results (print/ or pty/), so every probed fact shows as changed. Run \`release:probe:print -- --to ${from}\` and \`release:probe:pty -- --to ${from}\` with the old binary installed, then compare again.`;
    console.error(`release:compare WARNING: ${c.warning}`);
  }
  const dir = join(CAPTURES, to, "compare");
  const jsonPath = join(dir, `${from}..${to}.json`);
  const mdPath = join(dir, "compare.md");
  const work = (c.facts ?? []).filter(
    (x) =>
      x.result === "changed" ||
      x.result === "not-run" ||
      x.result === "invalid-run",
  ).length;
  console.log(
    `release:compare ${from}..${to}: ${c.counts.cases} cases in both (${c.counts.changed} changed, ${c.counts.invalid} invalid), ${c.onlyFrom.length} only in from, ${c.onlyTo.length} only in to; worklist ${c.facts ? `${work} facts` : "no facts.json"}${c.uncoveredNames ? `, ${c.uncoveredNames.length} uncovered names` : ""}`,
  );
  if (ctx.dry) return 0;
  writeJson(jsonPath, c);
  writeFileSync(mdPath, renderCompare(c));
  console.log(`  wrote ${jsonPath}\n  wrote ${mdPath}`);
  return 0;
};
