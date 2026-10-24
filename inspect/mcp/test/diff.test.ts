import { expect, test } from "bun:test";
import { join } from "node:path";
import { Bundle } from "../src/ast.ts";
import { diffIndexes, filterChanges, unitDiff } from "../src/diff.ts";
import { type Index, unitsOf } from "../src/prepare.ts";

const build = async (minifyNames: boolean): Promise<string> => {
  const r = await Bun.build({
    entrypoints: [join(import.meta.dir, "fixtures/clean-app.ts")],
    format: "esm",
    target: "bun",
    minify: { whitespace: true, syntax: true, identifiers: minifyNames },
  });
  if (!r.success) throw new Error(String(r.logs));
  return r.outputs[0]?.text() ?? "";
};

const index = (text: string): Index => {
  const m = new Bundle([{ name: "/$bunfs/root/a.js", text }]).get(
    "a.js",
  ) as NonNullable<ReturnType<Bundle["get"]>>;
  return {
    version: "0",
    binary: { size: 0, mtime: 0 },
    skipped: {},
    chunks: {},
    units: unitsOf("a.js", m),
  };
};

test("two builds of the same code have no change, and an edited method has one", async () => {
  const [short, long] = await Promise.all([build(true), build(false)]);
  expect(diffIndexes(index(short), index(long)).counts).toEqual({
    changed: 0,
    added: 0,
    gone: 0,
  });
  const edited = long.replace('"tengu_example_gate"', '"tengu_other_gate"');
  const d = diffIndexes(index(short), index(edited));
  expect(d.counts).toEqual({ changed: 1, added: 0, gone: 0 });
  const [c] = d.changes;
  expect(c?.to?.k).toBe("isEnabled");
  expect(unitDiff(c as NonNullable<typeof c>)).toEqual([
    "  (){",
    expect.stringMatching(
      /^- return \$[0-9a-f]{6}\("tengu_example_gate",!1\)\}$/,
    ),
    expect.stringMatching(
      /^\+ return \$[0-9a-f]{6}\("tengu_other_gate",!1\)\}$/,
    ),
  ]);
  expect(filterChanges(d, "tengu_other")).toHaveLength(1);
  expect(filterChanges(d, "nothing like this")).toHaveLength(0);
});
