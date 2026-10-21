// Env var sweep, ported from p305-print/sweep.ts. Each name from the binary's strings is set to "1" in two
// baseline runs (A plain, B tool+plugin+hooks); the result is which signature keys change, minus baseline noise.
// The name list comes from release:diff's extractor over the cached strings dump, not from a saved file.
import { readFileSync } from "node:fs";
import { claimsForProbe } from "../../claims/map.ts";
import { extractEnv } from "../../diff/extract.ts";
import { dumpStrings } from "../../diff/strings.ts";
import { assertSafeEnv, binaryPath, childEnv, PROMPT } from "../../lib/env.ts";
import { type CaseResult, type Fact, normalise } from "../../lib/results.ts";
import { dispose, runCase, selected } from "./run.ts";
import {
  baselineA,
  baselineB,
  diffSig,
  type Sig,
  sig,
  stableBaseline,
} from "./sig.ts";
import type { PrintCtx, PrintGroup } from "./types.ts";

const ID = "print.sweep";
const WORKERS = 8;
const SAMPLE_CAP = 150;

/** Names the sweep cannot set safely: fixed child env keys, and anything childEnv refuses (credentials). */
const unsettable = (name: string, fixed: Set<string>): string | null => {
  if (fixed.has(name)) return "fixed by childEnv";
  try {
    assertSafeEnv({ [name]: "1" });
  } catch {
    return "credential-shaped name";
  }
  return null;
};

export const sweepNames = (version: string): string[] => [
  ...extractEnv(readFileSync(dumpStrings(version), "latin1")).keys(),
];

type Out =
  | {
      diff: string[];
      code: number | null;
      vals: Record<string, [string, string]>;
    }
  | { err: string };

const run = async (ctx: PrintCtx): Promise<CaseResult[]> => {
  if (!selected(ctx, ID)) return [];
  // `--only sweep.NAME` is a partial run: results go to print.sweep.<NAME>, never over the full sweep.
  const want = (ctx.only ?? [])
    .map((o) => o.replace(/^print\./, ""))
    .filter((o) => o.startsWith("sweep."))
    .map((o) => o.slice("sweep.".length));
  const base = (
    facts: Record<string, Fact>,
    extra?: Partial<CaseResult>,
  ): CaseResult => ({
    schema: 1,
    id: ID,
    group: "print",
    version: ctx.version,
    prompt: PROMPT,
    args: ["-p", PROMPT],
    envSet: [],
    exit: null,
    timedOut: false,
    facts: normalise(facts),
    claims: claimsForProbe(ID),
    ...extra,
  });
  if (ctx.dry) return [base({})];
  try {
    const all = sweepNames(ctx.version);
    const names = want.length ? all.filter((n) => want.includes(n)) : all;
    const probeEnv = childEnv({
      home: "/x",
      configDir: "/x",
      baseUrl: "http://127.0.0.1:1/x",
    });
    const fixed = new Set(Object.keys(probeEnv));
    const skipped: string[] = [];
    const todo: string[] = [];
    for (const n of names) {
      const why = unsettable(n, fixed);
      if (why) skipped.push(n);
      else todo.push(n);
    }
    const bin = binaryPath(ctx.version);
    const bases = {
      A: await stableBaseline(bin, baselineA, false),
      B: await stableBaseline(bin, baselineB, true),
    };
    console.log(
      `  sweep: ${todo.length} names, ${skipped.length} skipped, noise A=${bases.A.noise.length} B=${bases.B.noise.length}`,
    );
    const mk = { A: baselineA, B: baselineB };
    const res = new Map<string, Record<string, Out>>();
    const jobs = todo.flatMap((v) =>
      (["A", "B"] as const).map((k) => [v, k] as const),
    );
    let idx = 0;
    let done = 0;
    const worker = async () => {
      for (;;) {
        const j = jobs[idx++];
        if (!j) return;
        const [v, k] = j;
        let out: Out;
        try {
          const c = mk[k]();
          c.env = { [v]: "1" };
          c.timeoutMs = 40_000;
          const r = await runCase(bin, c);
          const s: Sig = sig(r);
          dispose(r);
          for (const x of Object.keys(s))
            if (x.startsWith("henv."))
              s[x] = (s[x] ?? "")
                .split(",")
                .filter((n) => n !== v)
                .join(",");
          const b = bases[k];
          const diff = diffSig(b.sig, s).filter((x) => !b.noise.includes(x));
          out = {
            diff,
            code: r.code,
            vals: Object.fromEntries(
              diff.map((x) => [
                x,
                [
                  (b.sig[x] ?? "").slice(0, 400),
                  (s[x] ?? "").slice(0, 400),
                ] as [string, string],
              ]),
            ),
          };
        } catch (e) {
          out = { err: (e as Error).message.slice(0, 200) };
        }
        const rec = res.get(v) ?? {};
        rec[k] = out;
        res.set(v, rec);
        if (++done % 200 === 0) console.log(`  sweep: ${done}/${jobs.length}`);
      }
    };
    await Promise.all(Array.from({ length: WORKERS }, worker));

    const facts: Record<string, Fact> = {
      precondition: bases.A.valid && bases.B.valid,
      "precondition.detail": [
        bases.A.why && `A: ${bases.A.why}`,
        bases.B.why && `B: ${bases.B.why}`,
      ]
        .filter(Boolean)
        .join(" | "),
      names: todo.length,
      skipped,
      "noise.A": bases.A.noise,
      "noise.B": bases.B.noise,
    };
    const samples: Record<string, string> = {};
    const changed: string[] = [];
    const errored: string[] = [];
    for (const v of todo) {
      for (const k of ["A", "B"] as const) {
        const o = res.get(v)?.[k];
        if (!o) continue;
        if ("err" in o) {
          facts[`${v}.${k}`] = [`error: ${o.err}`];
          errored.push(`${v}.${k}`);
          continue;
        }
        facts[`${v}.${k}`] = o.diff;
        if (o.diff.length) {
          changed.push(v);
          for (const [key, [a, b]] of Object.entries(o.vals))
            if (Object.keys(samples).length < SAMPLE_CAP)
              samples[`${v}.${k}.${key}`] = `${a} => ${b}`;
        }
      }
    }
    facts["changed"] = [...new Set(changed)];
    facts["errors"] = errored;
    const notes =
      "Each name set to 1. Facts: NAME.A / NAME.B = signature keys that changed vs baseline (noise removed).";
    if (!want.length) return [base(facts, { samples, notes })];
    const common = [
      "precondition",
      "precondition.detail",
      "noise.A",
      "noise.B",
    ];
    return todo.map((v) =>
      base(
        {
          ...Object.fromEntries(common.map((k) => [k, facts[k] ?? null])),
          ...Object.fromEntries(
            Object.entries(facts).filter(([k]) => k.startsWith(`${v}.`)),
          ),
        },
        {
          id: `${ID}.${v}`,
          samples: Object.fromEntries(
            Object.entries(samples).filter(([k]) => k.startsWith(`${v}.`)),
          ),
          notes,
        },
      ),
    );
  } catch (e) {
    return [
      base(
        { precondition: false, error: (e as Error).message },
        want.length ? { id: `${ID}.partial` } : {},
      ),
    ];
  }
};

export const sweepGroup: PrintGroup = {
  id: "sweep",
  title: "Environment variable sweep (names from release:diff strings)",
  run,
};
