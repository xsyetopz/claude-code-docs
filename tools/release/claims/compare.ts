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

/** `added`/`removed`: parts of the full sample text, when the fact is a hash of it */
export type FactChange = {
  old: Fact;
  new: Fact;
  added?: string[];
  removed?: string[];
};

const PARTS_CAP = 10;
const parts = (s: string) => s.split(/[,|\s]+/).filter(Boolean);
const minus = (a: string[], b: string[]) => {
  const left = new Map<string, number>();
  for (const x of b) left.set(x, (left.get(x) ?? 0) + 1);
  return a.filter((x) => {
    const n = left.get(x) ?? 0;
    if (n) left.set(x, n - 1);
    return !n;
  });
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

const same = (a: Fact, b: Fact): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

/** Facts that describe how a run went, not what the program does: never a diff. */
const IGNORED_FACTS = new Set(["retried", "startLagS"]);

/**
 * Known noise by case id: facts that differ between two runs of the SAME version, so they are not release changes.
 * `facts` matches whole fact names and drops them. `items` removes those array elements from the facts that
 * `itemFacts` matches, then drops the fact when the two sides are then equal. With `values`, a `facts` match is
 * noise only when both sides are in that list, so a value outside the range seen across reruns still shows.
 * With `unordered`, a `facts` match is noise only when the two arrays hold the same items.
 * Ignored facts are listed under "Noise (ignored)" in compare.md, never dropped silently.
 */
type Noisy = {
  why: string;
  facts?: RegExp;
  values?: Fact[];
  unordered?: boolean;
  itemFacts?: RegExp;
  items?: string[];
};
const MCP_ORDER: Noisy[] = [
  {
    why: "the servers start in parallel, so their order varies from run to run (seen on 2.1.306 to 2.1.308)",
    facts: /^started$/,
    unordered: true,
  },
];

export const NOISY: Record<string, Noisy[]> = {
  "managed.baseline.mcp-config-flag": MCP_ORDER,
  "managed.main.mcp-config-flag": MCP_ORDER,
  "print.subagents.observer.on": [
    {
      why: "the background observer sends 3 or 5 requests from run to run (seen on 2.1.306 to 2.1.308)",
      facts: /^(observerReportToolIn|observerMessageIn)$/,
      values: [3, 5],
    },
    {
      why: "the request count follows the observer's 3 or 5 requests",
      facts: /^messages$/,
      values: [10, 12],
    },
  ],
  "print.sweep": [
    {
      why: "with Mantle on, the run times out before any stub request, so its stderr varies from run to run",
      itemFacts: /^CLAUDE_CODE_USE_MANTLE\.[AB]$/,
      items: ["stderr", "cfgfiles"],
    },
    {
      why: "API_TIMEOUT_MS sets a tiny timeout, so the retry count depends on machine load",
      facts: /^API_TIMEOUT_MS\.[AB]$/,
    },
    {
      why: "cfgfiles flips for a random name on each run",
      itemFacts: /\.[AB]$/,
      items: ["cfgfiles"],
    },
    {
      why: "list derived from the NAME.A and NAME.B facts, which are compared on their own",
      facts: /^changed$/,
    },
  ],
};

/** `old` with every `from` replaced by `to` equals `now`: the only change is the version string. */
const versionOnly = (old: Fact, now: Fact, v?: [string, string]): boolean =>
  !!v &&
  JSON.stringify(old).includes(v[0]) &&
  JSON.stringify(old).replaceAll(v[0], v[1]) === JSON.stringify(now);

/** Why a changed fact is not a release change, or null. */
const noiseReason = (
  id: string | undefined,
  k: string,
  old: Fact,
  now: Fact,
  v?: [string, string],
): string | null => {
  if (versionOnly(old, now, v)) return "version string only";
  for (const n of (id && NOISY[id]) || []) {
    const inRange = (f: Fact) => n.values?.some((x) => same(x, f)) ?? true;
    const sorted = (f: Fact) =>
      JSON.stringify(Array.isArray(f) ? [...f].sort() : f);
    if (n.unordered && n.facts?.test(k))
      return sorted(old) === sorted(now) ? n.why : null;
    if (n.facts?.test(k) && inRange(old) && inRange(now)) return n.why;
    if (
      n.itemFacts?.test(k) &&
      n.items &&
      Array.isArray(old) &&
      Array.isArray(now)
    ) {
      const strip = (a: Fact[]) =>
        JSON.stringify(a.filter((x) => !n.items?.includes(String(x))));
      if (strip(old as Fact[]) === strip(now as Fact[])) return n.why;
    }
  }
  return null;
};

export type DiffOpts = {
  /** case id, to look up NOISY */
  id?: string;
  /** [from, to]: a fact that differs only by this version string is ignored */
  versions?: [string, string];
  /** receives fact -> reason for each ignored fact */
  ignored?: Record<string, string>;
};

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

export const diffCase = (
  a: CaseResult,
  b: CaseResult,
  withSamples: boolean,
  only?: (key: string) => boolean,
  opts: DiffOpts = {},
): CaseDiff => {
  const keep = (k: string) => !IGNORED_FACTS.has(k) && (!only || only(k));
  const d: CaseDiff = { added: {}, removed: {}, changed: {} };
  for (const [k, v] of Object.entries(b.facts)) {
    if (!keep(k)) continue;
    if (!(k in a.facts)) d.added[k] = v;
    else if (!same(a.facts[k] as Fact, v)) {
      const why = noiseReason(opts.id, k, a.facts[k] as Fact, v, opts.versions);
      if (why !== null && opts.ignored) opts.ignored[k] = why;
      if (why !== null) continue;
      d.changed[k] = { old: a.facts[k] as Fact, new: v };
      const so = a.samples?.[k];
      const sn = b.samples?.[k];
      if (so !== undefined && sn !== undefined) {
        const [po, pn] = [parts(so), parts(sn)];
        d.changed[k].added = minus(pn, po).slice(0, PARTS_CAP);
        d.changed[k].removed = minus(po, pn).slice(0, PARTS_CAP);
      }
    }
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

/** `result` per claim from the mapped probes (or, for diff kinds, from diff/*.json of `to`). */
export const claimResults = (
  claims: ClaimRow[],
  a: CaseResult[],
  b: CaseResult[],
  diffChanged: Set<string> | null,
  schemaText: string | null = null,
  versions?: [string, string],
): ClaimResult[] => {
  const am = new Map(a.map((r) => [r.id, r]));
  const bm = new Map(b.map((r) => [r.id, r]));
  return claims.map((c) => {
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
        // the sweep holds every env name: look at the facts of the claim's names only
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
    (x) =>
      x.result === "changed" ||
      x.result === "not-run" ||
      x.result === "invalid-run",
  );
  if (c.counts.invalid)
    L.push(
      `> **${c.counts.invalid} invalid runs - re-run these cases, do not edit docs from them:** ${Object.keys(
        c.invalidRuns ?? {},
      )
        .map((i) => `\`${i}\``)
        .join(", ")}`,
      "",
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
    `${c.counts.cases} in both, ${c.counts.changed} changed, ${c.counts.unchanged} unchanged, ${c.counts.invalid} invalid runs, ${c.onlyFrom.length} only in ${c.from}, ${c.onlyTo.length} only in ${c.to}.`,
    "",
  );
  for (const [id, why] of Object.entries(c.invalidRuns ?? {}))
    L.push(`### \`${id}\` (invalid run)`, "", `- ${why}`, "");
  for (const [id, d] of Object.entries(c.cases)) {
    L.push(`### \`${id}\``, "");
    for (const [k, v] of Object.entries(d.changed)) {
      const p = [
        ...(v.added ?? []).map((x) => `+${x}`),
        ...(v.removed ?? []).map((x) => `-${x}`),
      ].map((x) => `\`${x.slice(0, 60)}\``);
      L.push(
        `- changed \`${k}\`: ${fmt(v.old)} -> ${fmt(v.new)}${p.length ? ` (${p.join(" ")})` : ""}`,
      );
    }
    for (const [k, v] of Object.entries(d.added))
      L.push(`- added \`${k}\`: ${fmt(v)}`);
    for (const [k, v] of Object.entries(d.removed))
      L.push(`- removed \`${k}\`: ${fmt(v)}`);
    for (const k of Object.keys(d.samples ?? {}))
      L.push(`- sample \`${k}\` differs`);
    L.push("");
  }
  if (c.noise || (c.claims ?? []).some((r) => r.noise))
    L.push(
      "## Noise (ignored)",
      "",
      "Facts that differ but are not release changes (run-to-run noise, or a version string only). Rules: `NOISY` in `tools/release/claims/compare.ts`.",
      "",
      ...Object.entries(c.noise ?? {}).flatMap(([id, m]) =>
        Object.entries(m).map(([k, why]) => `- \`${id}\` \`${k}\`: ${why}`),
      ),
      ...(c.claims ?? []).flatMap((r) =>
        Object.entries(r.noise ?? {}).flatMap(([id, m]) =>
          Object.entries(m).map(
            ([k, why]) => `- claim \`${r.id}\`: \`${id}\` \`${k}\`: ${why}`,
          ),
        ),
      ),
      "",
    );
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
    c.warning = `captures/${from}/ has no case results (print/ or pty/), so every probed claim shows as changed. Run \`release:probe:print -- --to ${from}\` and \`release:probe:pty -- --to ${from}\` with the old binary installed, then compare again.`;
    console.error(`release:compare WARNING: ${c.warning}`);
  }
  const dir = join(CAPTURES, to, "compare");
  const jsonPath = join(dir, `${from}..${to}.json`);
  const mdPath = join(dir, "compare.md");
  const work = (c.claims ?? []).filter(
    (x) =>
      x.result === "changed" ||
      x.result === "not-run" ||
      x.result === "invalid-run",
  ).length;
  console.log(
    `release:compare ${from}..${to}: ${c.counts.cases} cases in both (${c.counts.changed} changed, ${c.counts.invalid} invalid), ${c.onlyFrom.length} only in from, ${c.onlyTo.length} only in to; worklist ${c.claims ? `${work} claims` : "no claims.json"}${c.uncoveredNames ? `, ${c.uncoveredNames.length} uncovered names` : ""}`,
  );
  if (ctx.dry) return 0;
  writeJson(jsonPath, c);
  writeFileSync(mdPath, renderCompare(c));
  console.log(`  wrote ${jsonPath}\n  wrote ${mdPath}`);
  return 0;
};
