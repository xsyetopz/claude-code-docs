// Facts part of the selftest: classes, ids, stability, diff names, --check, and the cli args.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { normaliseArgs } from "../args.ts";
import {
  applyMap,
  checkFacts,
  classify,
  factsFromFile,
  loadDiffNames,
} from "../facts.ts";
import { DOC, type Step } from "./fixture.ts";

export const runFactsChecks = (step: Step, root: string): void => {
  // facts: classes, ids, stability
  const lines = DOC.split("\n").flatMap((l, i) =>
    /2\.1\.\d+/.test(l) ? [i + 1] : [],
  );
  const cs = factsFromFile("docs/x.md", DOC, lines);
  step(
    "facts: 6 candidates, frontmatter and fences skipped",
    cs.length === 6,
    String(cs.length),
  );
  step(
    "facts: classes",
    cs.map((c) => c.class).join(",") === "change,change,info,gap,change,change",
    cs.map((c) => c.class).join(","),
  );
  step(
    "facts: heading in id (one hyphen per space)",
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
  const moved = factsFromFile(
    "docs/x.md",
    `\n\n\n${DOC}`,
    lines.map((n) => n + 3),
  );
  step(
    "facts: ids survive a line move",
    moved.map((c) => c.id).join() === cs.map((c) => c.id).join(),
  );
  const edited = factsFromFile(
    "docs/x.md",
    DOC.replace("it is faster", "it is slower"),
    lines,
  );
  step(
    "facts: id changes with the text",
    edited[0]?.id !== cs[0]?.id && edited[1]?.id === cs[1]?.id,
  );
  const ws = factsFromFile(
    "docs/x.md",
    DOC.replace("Does a thing.", "Does   a  THING."),
    lines,
  );
  step("facts: id ignores case and spacing", ws[0]?.id === cs[0]?.id);
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
    "facts: auto kind from the row subject",
    mapped[0]?.kind === "env" && mapped[0].status === "mapped",
  );
  step("facts: prose is not auto-mapped", mapped[1]?.status === "unmapped");
  step(
    "facts: no diff dir means no auto kinds",
    applyMap(cs, {}, loadDiffNames("9.9.9", join(root, "none")))[0]?.status ===
      "unmapped",
  );
  const withMap = applyMap(
    cs,
    { [cs[1]?.id ?? ""]: { kind: "behaviour", probes: ["print.a"] } },
    names,
  );
  const stale = "docs/x.md#stale:11111111";
  const chk = checkFacts(
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
      facts: new Map([["print.a", new Set([stale])]]),
      fromDisk: true,
    },
    withMap,
  );
  step(
    "facts --check: errors and warnings",
    chk.errors.length === 1 &&
      chk.errors[0]?.includes("bogus") === true &&
      chk.warnings.length === 6,
    `${chk.errors.length} errors, ${chk.warnings.length} warnings`,
  );
  step(
    "facts --check: unmapped fails",
    checkFacts(
      mapped.filter((c) => c.class === "change").slice(0, 2),
      {},
      { ids: new Set(), facts: new Map(), fromDisk: true },
    ).errors.length === 1,
  );
  const nodisk = checkFacts(
    [],
    {
      a: { kind: "behaviour", probes: ["print.x", "live.gone"] },
    },
    { ids: new Set(), facts: new Map(), fromDisk: false },
  );
  step(
    "facts --check: without results only live.* ids are checked",
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
      !!args("facts", "x").error &&
      !args("facts", "--check").error,
  );
};
