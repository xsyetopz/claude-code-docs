// Fixture tests for claims and compare (run by `release:check --selftest`): no binary, no captures/, temp dirs only.
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { type CaseResult, openRun, writeCase } from "../lib/results.ts";
import { normaliseArgs } from "./args.ts";
import {
  applyMap,
  checkClaims,
  claimsFromFile,
  classify,
  loadDiffNames,
} from "./claims.ts";
import {
  type ClaimRow,
  claimResults,
  compareResults,
  compareRuns,
  renderCompare,
} from "./compare.ts";

const DOC = [
  "---",
  "title: T",
  "---",
  "## Some Heading",
  "",
  "Intro line.",
  "| `FOO_BAR` | Does a thing. Since `2.1.304` it is faster. |",
  "Plain sentence. Added in 2.1.305 the `--baz` flag exists. Another one.",
  "Tested on 2.1.305 only.",
  "Not checked on 2.1.306.",
  "````md",
  "```",
  "Since 2.1.399 inside a fence.",
  "```",
  "Since 2.1.398 still inside a longer fence.",
  "````",
  "Removed in 2.1.307 the thing; works on 2.1.300 or later.",
  "## Another — Heading",
  "Before 2.1.301 it differed.",
].join("\n");

const kase = (
  version: string,
  id: string,
  facts: CaseResult["facts"],
  samples?: Record<string, string>,
): CaseResult => ({
  schema: 1,
  id,
  group: "print",
  version,
  prompt: "p",
  args: [],
  envSet: [],
  exit: 0,
  timedOut: false,
  facts,
  ...(samples ? { samples } : {}),
  claims: [],
});

export const runClaimsSelftest = (
  step: (name: string, ok: boolean, detail?: string) => void,
): void => {
  // claims: classes, ids, stability
  const lines = DOC.split("\n").flatMap((l, i) =>
    /2\.1\.\d+/.test(l) ? [i + 1] : [],
  );
  const cs = claimsFromFile("docs/x.md", DOC, lines);
  step(
    "claims: 6 candidates, frontmatter and fences skipped",
    cs.length === 6,
    String(cs.length),
  );
  step(
    "claims: classes",
    cs.map((c) => c.class).join(",") === "change,change,info,gap,change,change",
    cs.map((c) => c.class).join(","),
  );
  step(
    "claims: heading in id (one hyphen per space)",
    cs.slice(0, 5).every((c) => c.id.startsWith("docs/x.md#some-heading:")) &&
      cs[5]?.id.startsWith("docs/x.md#another--heading:") === true,
    cs[5]?.id,
  );
  step(
    "classify: removed in, before, from, or later",
    [
      "Removed in 2.1.3.",
      "Dropped in 2.1.3.",
      "Before 2.1.3 it was.",
      "Older than 2.1.3.",
      "Works from 2.1.3 on.",
      "Needs `2.1.3` or later.",
      "Needs 2.1.3 and newer.",
    ].every((t) => classify(t.replace("2.1.3", "2.1.30")) === "change") &&
      classify("A line about 2.1.305 from the log.") === "info",
  );
  step(
    "classify: bare version is info",
    classify("It ran on 2.1.305.") === "info",
  );
  const moved = claimsFromFile(
    "docs/x.md",
    `\n\n\n${DOC}`,
    lines.map((n) => n + 3),
  );
  step(
    "claims: ids survive a line move",
    moved.map((c) => c.id).join() === cs.map((c) => c.id).join(),
  );
  const edited = claimsFromFile(
    "docs/x.md",
    DOC.replace("it is faster", "it is slower"),
    lines,
  );
  step(
    "claims: id changes with the text",
    edited[0]?.id !== cs[0]?.id && edited[1]?.id === cs[1]?.id,
  );
  const ws = claimsFromFile(
    "docs/x.md",
    DOC.replace("Does a thing.", "Does   a  THING."),
    lines,
  );
  step("claims: id ignores case and spacing", ws[0]?.id === cs[0]?.id);

  const root = mkdtempSync(join(realpathSync(tmpdir()), "ccrel-claims-"));
  try {
    // diff names and auto kinds
    mkdirSync(join(root, "2.1.2", "diff"), { recursive: true });
    writeFileSync(
      join(root, "2.1.2", "diff", "flags.json"),
      JSON.stringify({
        kind: "flags",
        added: ["--baz"],
        items: { "--baz": "x" },
      }),
    );
    writeFileSync(
      join(root, "2.1.2", "diff", "strings-env.json"),
      JSON.stringify({ kind: "env", added: [], items: { FOO_BAR: "" } }),
    );
    const names = loadDiffNames("2.1.2", root);
    const mapped = applyMap(cs, {}, names);
    step(
      "claims: auto kind from the row subject",
      mapped[0]?.kind === "env" && mapped[0].status === "mapped",
    );
    step("claims: prose is not auto-mapped", mapped[1]?.status === "unmapped");
    step(
      "claims: no diff dir means no auto kinds",
      applyMap(cs, {}, loadDiffNames("9.9.9", join(root, "none")))[0]
        ?.status === "unmapped",
    );
    const withMap = applyMap(
      cs,
      { [cs[1]?.id ?? ""]: { kind: "behaviour", probes: ["print.a"] } },
      names,
    );
    const stale = "docs/x.md#stale:11111111";
    const chk = checkClaims(
      withMap.filter((c) => c.class === "change").slice(0, 2),
      {
        [cs[1]?.id ?? ""]: {
          kind: "behaviour",
          probes: ["print.a", "print.gone"],
        },
        "docs/x.md#gone:00000000": { kind: "static", probes: [] },
        "docs/x.md#bad:00000000": { kind: "bogus" as never, probes: [] },
      },
      {
        ids: new Set(["print.a", "print.unused"]),
        claims: new Map([["print.a", new Set([stale])]]),
        fromDisk: true,
      },
      withMap,
    );
    step(
      "claims --check: errors and warnings",
      chk.errors.length === 1 &&
        chk.errors[0]?.includes("bogus") === true &&
        chk.warnings.length === 6,
      `${chk.errors.length} errors, ${chk.warnings.length} warnings`,
    );
    step(
      "claims --check: unmapped fails",
      checkClaims(
        mapped.filter((c) => c.class === "change").slice(0, 2),
        {},
        { ids: new Set(), claims: new Map(), fromDisk: true },
      ).errors.length === 1,
    );
    const nodisk = checkClaims(
      [],
      {
        a: { kind: "behaviour", probes: ["print.x", "live.gone"] },
      },
      { ids: new Set(), claims: new Map(), fromDisk: false },
    );
    step(
      "claims --check: without results only live.* ids are checked",
      nodisk.warnings.some((w) => w.includes("live.gone")) &&
        !nodisk.warnings.some((w) => w.includes("print.x (")),
    );
    const args = (n: string, ...a: string[]) => normaliseArgs(n, a);
    step(
      "cli: compare <from> <to> becomes --from/--to",
      args("compare", "2.1.304", "2.1.305", "--samples").args.join(" ") ===
        "--from 2.1.304 --to 2.1.305 --samples" &&
        !args("compare", "--from", "2.1.304", "--to", "2.1.305").error,
    );
    step(
      "cli: leftover positionals are an error",
      !!args("compare", "2.1.305").error &&
        !!args("compare", "2.1.305", "../../etc").error &&
        !!args("compare", "--to", "2.1.304", "2.1.305").error &&
        !!args("claims", "x").error &&
        !args("claims", "--check").error,
    );

    // compare
    const base = join(root, "caps");
    const a = openRun("1.0.0", base);
    const b = openRun("1.0.1", base);
    writeCase(
      a,
      kase(
        "1.0.0",
        "print.one",
        { x: 1, y: "a", gone: true },
        { s: "same", t: "old" },
      ),
    );
    writeCase(
      b,
      kase(
        "1.0.1",
        "print.one",
        { x: 2, y: "a", fresh: 3 },
        { s: "same", t: "new" },
      ),
    );
    writeCase(a, kase("1.0.0", "print.same", { k: ["a"] }));
    writeCase(b, kase("1.0.1", "print.same", { k: ["a"] }));
    writeCase(a, kase("1.0.0", "print.old-only", { k: 1 }));
    writeCase(b, kase("1.0.1", "print.new-only", { k: 1 }));
    writeCase(
      a,
      kase("1.0.0", "print.sweep", { "FOO_BAR.A": ["h"], "OTHER.A": ["h"] }),
    );
    writeCase(
      b,
      kase("1.0.1", "print.sweep", {
        "FOO_BAR.A": ["h"],
        "OTHER.A": ["h", "i"],
      }),
    );
    const c1 = compareRuns("1.0.0", "1.0.1", base, false);
    const one = c1.cases["print.one"];
    step(
      "compare: added/removed/changed",
      one?.changed["x"]?.old === 1 &&
        one.changed["x"].new === 2 &&
        "fresh" in one.added &&
        "gone" in one.removed,
    );
    {
      const bad = kase("1.0.1", "pty.bad", {
        x: 2,
        precondition: false,
        "precondition.detail": "wait_for timed out: dialog",
        retried: true,
        startLagS: 5,
      });
      const ok = kase("1.0.0", "pty.bad", { x: 1, startLagS: 0.5 });
      const iv = compareResults("1.0.0", "1.0.1", [ok], [bad], false);
      const row = {
        id: "c.bad",
        file: "f.md",
        line: 1,
        text: "t",
        kind: "pty",
        probes: ["pty.bad"],
        status: "ok",
      } as ClaimRow;
      const cr = claimResults([row], [ok], [bad], null)[0];
      const same = compareResults(
        "1.0.0",
        "1.0.1",
        [kase("1.0.0", "p.same", { x: 1, startLagS: 0.5 })],
        [kase("1.0.1", "p.same", { x: 1, startLagS: 7, retried: true })],
        false,
      );
      const md = renderCompare({ ...iv, claims: [cr as never] });
      step(
        "compare: precondition=false is invalid-run, not changed; retried/startLagS never diff",
        iv.counts.invalid === 1 &&
          iv.counts.changed === 0 &&
          cr?.result === "invalid-run" &&
          same.counts.unchanged === 1 &&
          md.includes("1 invalid runs - re-run these cases") &&
          md.includes("invalid-run: `c.bad`") &&
          md.includes("wait_for timed out: dialog"),
        JSON.stringify([iv.counts, cr?.result]),
      );
    }
    {
      const nz = compareResults(
        "1.0.0",
        "1.0.1",
        [
          kase("1.0.0", "print.sweep", {
            "API_TIMEOUT_MS.A": ["nreq"],
            "FOO.A": ["cfgfiles"],
            "BAR.A": ["cfgfiles", "m0.ua"],
            changed: ["FOO"],
          }),
          kase("1.0.0", "print.request.v", {
            "m0.ua": "claude-cli/1.0.0 (x)",
            other: "a",
          }),
          kase("1.0.0", "print.request.w", {
            "m0.ua": "claude-cli/1.0.0 (x)",
          }),
        ],
        [
          kase("1.0.1", "print.sweep", {
            "API_TIMEOUT_MS.A": ["nreq", "events"],
            "FOO.A": [],
            "BAR.A": ["m0.ua", "events"],
            changed: ["BAR"],
          }),
          kase("1.0.1", "print.request.v", {
            "m0.ua": "claude-cli/1.0.1 (x)",
            other: "b",
          }),
          kase("1.0.1", "print.request.w", {
            "m0.ua": "claude-cli/1.0.1 (x)",
          }),
        ],
        false,
      );
      const md = renderCompare(nz);
      step(
        "compare: known noise and version-only changes are listed under Noise, not as changes",
        nz.counts.changed === 2 &&
          Object.keys(nz.cases["print.sweep"]?.changed ?? {}).join() ===
            "BAR.A" &&
          Object.keys(nz.cases["print.request.v"]?.changed ?? {}).join() ===
            "other" &&
          nz.noise?.["print.sweep"]?.["FOO.A"] !== undefined &&
          nz.noise["print.request.v"]?.["m0.ua"] === "version string only" &&
          // a case whose only difference is noise counts as unchanged
          !nz.cases["print.request.w"] &&
          nz.noise["print.request.w"]?.["m0.ua"] === "version string only" &&
          nz.counts.unchanged === 1 &&
          md.includes("## Noise (ignored)") &&
          md.includes("`print.sweep` `API_TIMEOUT_MS.A`"),
        JSON.stringify([nz.counts, nz.noise]),
      );
    }
    {
      const rows = [
        {
          id: "c.noise",
          file: "f.md",
          line: 1,
          text: "t",
          kind: "env",
          probes: ["print.sweep"],
          status: "ok",
          diffNames: ["API_TIMEOUT_MS"],
        },
        {
          id: "c.real",
          file: "f.md",
          line: 2,
          text: "t",
          kind: "env",
          probes: ["print.sweep"],
          status: "ok",
          diffNames: ["FOO"],
        },
      ] as ClaimRow[];
      const old = kase("1.0.0", "print.sweep", {
        "API_TIMEOUT_MS.A": ["nreq"],
        "FOO.A": ["x"],
      });
      const now = kase("1.0.1", "print.sweep", {
        "API_TIMEOUT_MS.A": ["nreq", "events"],
        "FOO.A": ["y"],
      });
      const crs = claimResults(rows, [old], [now], null, null, [
        "1.0.0",
        "1.0.1",
      ]);
      const cc = compareResults("1.0.0", "1.0.1", [old], [now], false);
      const md = renderCompare({ ...cc, claims: crs });
      step(
        "compare: a claim that differs only by noise says so and is listed under Noise",
        crs[0]?.result === "unchanged" &&
          crs[0].why ===
            "unchanged (noise ignored: print.sweep API_TIMEOUT_MS.A)" &&
          crs[1]?.result === "changed" &&
          crs[1].noise === undefined &&
          cc.noise?.["print.sweep"]?.["API_TIMEOUT_MS.A"] !== undefined &&
          md.includes("- claim `c.noise`: `print.sweep` `API_TIMEOUT_MS.A`"),
        JSON.stringify(crs.map((r) => [r.result, r.why])),
      );
    }
    step(
      "compare: unchanged and one-sided cases",
      !c1.cases["print.same"] &&
        c1.onlyFrom.join() === "print.old-only" &&
        c1.onlyTo.join() === "print.new-only",
    );
    step(
      "compare: samples only with --samples",
      !one?.samples &&
        !!compareRuns("1.0.0", "1.0.1", base, true).cases["print.one"]
          ?.samples?.["t"],
    );

    // claim results
    const row = (id: string, probes: string[], kind: string, extra = {}) => ({
      id,
      file: "docs/x.md",
      line: 1,
      text: id,
      kind,
      probes,
      status: "mapped",
      ...extra,
    });
    writeFileSync(
      join(b, "claims.json"),
      JSON.stringify([
        row("c.changed", ["print.one"], "behaviour"),
        row("c.same", ["print.same"], "behaviour"),
        row("c.notrun", ["print.same", "print.missing"], "behaviour"),
        row("c.sweep", ["print.sweep"], "env", { diffNames: ["FOO_BAR"] }),
        row("c.new", ["print.new-only"], "behaviour"),
        row("c.manual", [], "manual"),
        row("c.nodiff", [], "flag", { diffNames: ["--new-flag"] }),
        row("c.prose", [], "setting"),
        row("c.schema", [], "schema", { diffNames: ["sandbox.fooKey"] }),
        row("c.schema2", [], "schema", { diffNames: ["sandbox.barKey"] }),
        row("c.diffhit", [], "flag", { diffNames: ["--new-flag"] }),
        row("c.diffmiss", [], "flag", { diffNames: ["--other"] }),
        { ...row("c.static", [], "static"), status: "static" },
      ]),
    );
    const c2 = compareRuns("1.0.0", "1.0.1", base, false);
    const res = Object.fromEntries(
      (c2.claims ?? []).map((c) => [c.id, c.result]),
    );
    step(
      "compare: claim results",
      res["c.changed"] === "changed" &&
        res["c.same"] === "unchanged" &&
        res["c.notrun"] === "not-run" &&
        res["c.static"] === undefined,
      JSON.stringify(res),
    );
    step(
      "compare: case only on `to` is changed; manual, no-diff and bare claims are not-run",
      res["c.new"] === "changed" &&
        res["c.manual"] === "not-run" &&
        res["c.nodiff"] === "not-run" &&
        res["c.prose"] === "not-run" &&
        res["c.schema"] === "not-run",
      JSON.stringify(res),
    );
    step(
      "compare: sweep claim only sees its own names",
      res["c.sweep"] === "unchanged",
    );
    const md = renderCompare(c2);
    step(
      "compare.md: worklist first",
      md.indexOf("## Worklist") < md.indexOf("## Cases") &&
        md.includes("`c.notrun`") &&
        !md.includes("`c.same`"),
    );
    mkdirSync(join(b, "diff"), { recursive: true });
    writeFileSync(
      join(b, "diff", "flags.json"),
      JSON.stringify({
        kind: "flags",
        added: ["--new-flag"],
        removed: [],
        changed: [],
      }),
    );
    writeFileSync(
      join(b, "schemas-diff.json"),
      JSON.stringify({ files: { x: { added: ["sandbox.fooKey"] } } }),
    );
    const docs = join(root, "docs");
    mkdirSync(docs);
    writeFileSync(
      join(docs, "p.md"),
      "Uses `--seen <v>` and `--new-flag-ish`.\n",
    );
    writeFileSync(
      join(b, "diff", "flags.json"),
      JSON.stringify({
        kind: "flags",
        added: ["--new-flag", "--seen"],
        removed: [],
        changed: [],
      }),
    );
    const c3 = compareRuns("1.0.0", "1.0.1", base, false, docs);
    step(
      "compare: uncovered diff names (whole backtick tokens in docs/)",
      c3.uncoveredNames?.length === 1 &&
        c3.uncoveredNames[0]?.name === "--new-flag",
      JSON.stringify(c3.uncoveredNames),
    );
    const r3 = Object.fromEntries(
      (c3.claims ?? []).map((c) => [c.id, c.result]),
    );
    step(
      "compare: diff and schema claims",
      r3["c.diffhit"] === "changed" &&
        r3["c.diffmiss"] === "unchanged" &&
        r3["c.schema"] === "changed" &&
        r3["c.schema2"] === "unchanged" &&
        r3["c.manual"] === "not-run",
      JSON.stringify(r3),
    );
    step(
      "compare: json round trip",
      readFileSync(join(b, "claims.json"), "utf8").length > 0 &&
        JSON.parse(JSON.stringify(c3)).to === "1.0.1",
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};
