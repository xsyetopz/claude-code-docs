// Compare part of the selftest: added/removed/changed, noise, and the invalid-run and one-sided cases.
import { join } from "node:path";
import { openRun, writeCase } from "../../lib/results.ts";
import {
  type ClaimRow,
  claimResults,
  compareResults,
  compareRuns,
  renderCompare,
} from "../compare.ts";
import { kase, type Step } from "./fixture.ts";

export const runCompareChecks = (
  step: Step,
  root: string,
): { base: string; b: string } => {
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
    const OBS = "print.subagents.observer.on";
    const obs = (v: string, n: number, m: number) =>
      kase(v, OBS, {
        messages: n,
        observerReportToolIn: m,
        observerMessageIn: m,
      });
    const ok = compareResults(
      "1.0.0",
      "1.0.1",
      [
        obs("1.0.0", 10, 3),
        kase("1.0.0", "print.sweep", {
          "CLAUDE_CODE_USE_MANTLE.A": ["nreq", "code", "stderr"],
        }),
      ],
      [
        obs("1.0.1", 12, 5),
        kase("1.0.1", "print.sweep", {
          "CLAUDE_CODE_USE_MANTLE.A": ["nreq", "cfgfiles", "code"],
        }),
      ],
      false,
    );
    const MCP = "managed.baseline.mcp-config-flag";
    const order = (a: string[], b: string[]) =>
      compareResults(
        "1.0.0",
        "1.0.1",
        [kase("1.0.0", MCP, { started: a })],
        [kase("1.0.1", MCP, { started: b })],
        false,
      ).counts.changed;
    step(
      "compare: MCP servers started in another order are noise; another set is a change",
      order(["a", "b"], ["b", "a"]) === 0 && order(["a", "b"], ["a"]) === 1,
      JSON.stringify([order(["a", "b"], ["b", "a"]), order(["a", "b"], ["a"])]),
    );
    const gone = compareResults(
      "1.0.0",
      "1.0.1",
      [obs("1.0.0", 10, 3)],
      [obs("1.0.1", 2, 0)],
      false,
    );
    step(
      "compare: observer counts within the seen range and Mantle stderr are noise; a lost observer is a change",
      ok.counts.changed === 0 &&
        ok.noise?.[OBS]?.["observerReportToolIn"] !== undefined &&
        ok.noise["print.sweep"]?.["CLAUDE_CODE_USE_MANTLE.A"] !== undefined &&
        gone.counts.changed === 1 &&
        Object.keys(gone.cases[OBS]?.changed ?? {}).length === 3,
      JSON.stringify([ok.counts, ok.noise, gone.counts]),
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
      !!compareRuns("1.0.0", "1.0.1", base, true).cases["print.one"]?.samples?.[
        "t"
      ],
  );

  return { base, b };
};
