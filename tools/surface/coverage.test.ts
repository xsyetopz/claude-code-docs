import { expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { check, docsNames, PAGES, shape } from "./coverage.ts";

const SCRIPT = join(import.meta.dir, "coverage.ts");

const snapshot = {
  version: "1.2.3",
  kinds: {
    env: [{ name: "CLAUDE_CODE_EXAMPLE" }, { name: "CLAUDE_CODE_LISTED" }],
    flag: [{ name: "--one" }, { name: "--two" }],
  },
};
const docs = { env: new Set(["CLAUDE_CODE_LISTED"]), flag: new Set<string>() };

/** A repo folder with the snapshot, the map, the exclusions, and some docs files. */
const repo = (
  map: unknown,
  exclusions: unknown,
  files: Record<string, string> = {},
) => {
  const root = mkdtempSync(join(tmpdir(), "coverage-"));
  const put = (path: string, text: string) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  };
  put("schemas/surface.json", JSON.stringify(snapshot));
  put("tools/surface/map.json", JSON.stringify(map));
  put("tools/surface/exclusions.json", JSON.stringify(exclusions));
  for (const [p, t] of Object.entries(files)) put(p, t);
  return root;
};
const run = (root: string, ...args: string[]) => {
  const r = Bun.spawnSync(["bun", SCRIPT, "--root", root, ...args]);
  return {
    code: r.exitCode,
    out: r.stdout.toString(),
    err: r.stderr.toString(),
  };
};

test("an unmapped item fails and prints its key", () => {
  const root = repo({}, {});
  const r = run(root);
  expect(r.code).toBe(1);
  expect(r.err).toContain("env:CLAUDE_CODE_EXAMPLE");
  expect(r.err).toContain("flag:--one");
});

test("an item named in a docs table, in the map, or in the exclusions is covered", () => {
  const root = repo(
    { "flag:--one": { route: "/configure/cli/flags", anchor: "one" } },
    { "env:CLAUDE_CODE_EXAMPLE": "internal", "flag:--two": "test only" },
    {
      "docs/configure/env-vars/a.md":
        "| Name | Note |\n| --- | --- |\n| `CLAUDE_CODE_LISTED` | x |\n",
    },
  );
  const r = run(root);
  expect(r.err).toBe("");
  expect(r.code).toBe(0);
  expect(r.out).toContain("surface:check: every item is mapped or excluded");
});

test("a stale exclusion fails and names the entry", () => {
  const root = repo(
    { "flag:--one": { route: "/x" }, "flag:--two": { route: "/x" } },
    {
      "env:CLAUDE_CODE_GONE": "was removed",
      "env:CLAUDE_CODE_EXAMPLE": "internal",
    },
    {
      "docs/configure/env-vars/a.md": "| `CLAUDE_CODE_LISTED` |\n",
    },
  );
  const r = run(root);
  expect(r.code).toBe(1);
  expect(r.err).toContain("stale entry exclusions.json: env:CLAUDE_CODE_GONE");
});

test("a stale map entry fails", () => {
  const out = check(
    snapshot,
    docs,
    { "flag:--gone": { route: "/x" } },
    { "env:CLAUDE_CODE_EXAMPLE": "internal" },
  );
  expect(out.stale).toEqual(["map.json: flag:--gone"]);
});

test("a prefix exclusion covers every item with the prefix and is stale with none", () => {
  const ok = check(
    snapshot,
    docs,
    {},
    { "flag:--*": "all flags", "env:CLAUDE_CODE_E*": "x" },
  );
  expect(ok.unmapped).toEqual([]);
  expect(ok.stale).toEqual([]);
  expect(ok.rows.find((r) => r.kind === "flag")?.excluded).toBe(2);
  const stale = check(snapshot, docs, {}, { "flag:--zzz*": "nothing" });
  expect(stale.stale).toEqual(["exclusions.json: flag:--zzz*"]);
});

test("an entry of an unknown kind is stale", () => {
  const out = check(snapshot, docs, {}, { "nope:a": "x" });
  expect(out.stale).toEqual(["exclusions.json: nope:a"]);
});

test("--kind limits the unmapped items and the stale entries to those kinds", () => {
  const out = check(
    snapshot,
    docs,
    {},
    { "flag:--gone": "x", "env:CLAUDE_CODE_EXAMPLE": "internal" },
    ["env"],
  );
  expect(out.rows.map((r) => r.kind)).toEqual(["env"]);
  expect(out.unmapped).toEqual([]);
  expect(out.stale).toEqual([]);
  const root = repo(
    {},
    {},
    { "docs/configure/env-vars/a.md": "| `CLAUDE_CODE_LISTED` |\n" },
  );
  const r = run(root, "--kind", "env");
  expect(r.err).toContain("env:CLAUDE_CODE_EXAMPLE");
  expect(r.err).not.toContain("flag:");
  expect(run(root, "--kind", "nope").code).toBe(2);
});

test("an exclusion needs a reason and a map entry needs a route", () => {
  expect(shape({ "flag:--a": { route: "x" } }, { "env:A": " " })).toEqual([
    'map.json: flag:--a needs a route that starts with "/"',
    "exclusions.json: env:A needs a non-empty reason",
  ]);
  expect(shape({ "flag:--a": { route: "/x" } }, { "env:A": "why" })).toEqual(
    [],
  );
});

test("docs names are the exact backticked names in table rows of the pages", () => {
  const root = repo(
    {},
    {},
    {
      "docs/a/one.md":
        "Text with `NOT_IN_TABLE`.\n| `A` | `b\\|c` | x `--f <v>` |\n",
      "docs/a/sub/two.mdx": "| `DEEP` |\n",
      "docs/other.md": "| `ELSEWHERE` |\n",
    },
  );
  expect(docsNames(root, ["docs/a", "docs/missing.md"])).toEqual(
    new Set(["A", "b|c", "--f <v>", "DEEP"]),
  );
});

test("the counts add up for each kind", () => {
  const out = check(snapshot, docs, { "flag:--one": { route: "/x" } }, {});
  expect(out.rows).toEqual([
    { kind: "env", items: 2, docs: 1, mapped: 0, excluded: 0, unmapped: 1 },
    { kind: "flag", items: 2, docs: 0, mapped: 1, excluded: 0, unmapped: 1 },
  ]);
});

test("the real repo prints the counts of every kind, whatever the result", () => {
  const r = Bun.spawnSync(["bun", SCRIPT]);
  const out = r.stdout.toString();
  expect(out).toContain("kind");
  expect(out).toContain("unmapped");
  for (const k of Object.keys(PAGES))
    expect(out).toMatch(new RegExp(`^${k} +\\d+`, "m"));
  expect(out).toMatch(/^total +\d+/m);
}, 20_000);
