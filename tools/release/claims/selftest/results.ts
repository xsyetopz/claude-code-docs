// Claim-results part of the selftest: claims.json against two compared runs, worklist, diff and schema claims.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { compareRuns, renderCompare } from "../compare.ts";
import type { Step } from "./fixture.ts";

export const runResultsChecks = (
  step: Step,
  root: string,
  base: string,
  b: string,
): void => {
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
  const r3 = Object.fromEntries((c3.claims ?? []).map((c) => [c.id, c.result]));
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
};
