import { expect, test } from "bun:test";
import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Bundle } from "../src/ast.ts";
import { prepare, unitsOf } from "../src/prepare.ts";

const mod = (text: string) =>
  new Bundle([{ name: "/$bunfs/root/a.js", text }]).get("a.js") as NonNullable<
    ReturnType<Bundle["get"]>
  >;

test("a unit cuts out the functions inside it", () => {
  const units = unitsOf(
    "a.js",
    mod(
      'var t={name:"Monitor",isEnabled(){return g("tengu_x")}};function g(k){return k.length}',
    ),
  );
  const top = units.find((u) => u.k === "VariableDeclaration");
  const method = units.find((u) => u.k === "isEnabled");
  expect(top?.t).toMatch(/name:"Monitor",isEnabledƒ/);
  expect(top?.f).toEqual(['"Monitor"', ".isEnabled", ".name"]);
  expect(method?.f).toEqual(['"tengu_x"']);
  expect(units.filter((u) => u.k === "function")).toHaveLength(1);
});

test("a second call for the same binary reads the cache and parses nothing", () => {
  const root = mkdtempSync(join(tmpdir(), "cc-inspect-test-"));
  try {
    const modules = [
      {
        name: "/$bunfs/root/cli.js",
        text: 'var r=import.meta.require("/$bunfs/root/chunk-ab12.js");',
      },
      {
        name: "/$bunfs/root/chunk-ab12.js",
        text: 'export function q(){return"x"}',
      },
      { name: "/$bunfs/root/notes.txt", text: "not code" },
    ];
    const first = prepare("9.9.9", import.meta.path, modules, root);
    expect(first.parsed).toBe(2);
    expect(Object.values(first.index.chunks)).toEqual([
      expect.stringMatching(/^chunk@[0-9a-f]{8}\.js$/),
    ]);
    expect(first.index.units.find((u) => u.m === "cli.js")?.t).toContain(
      "chunk@",
    );
    expect(readdirSync(join(first.dir, "modules")).sort()).toEqual([
      "chunk-ab12.js",
      "cli.js",
    ]);
    const second = prepare("9.9.9", import.meta.path, modules, root);
    expect(second.parsed).toBe(0);
    expect(second.index.units).toEqual(first.index.units);
    // An index from an older cleaning format is cleaned again.
    const file = join(first.dir, "index.json");
    writeFileSync(
      file,
      JSON.stringify({ ...JSON.parse(readFileSync(file, "utf8")), format: 0 }),
    );
    expect(prepare("9.9.9", import.meta.path, modules, root).parsed).toBe(2);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
