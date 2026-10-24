import { expect, test } from "bun:test";
import { join } from "node:path";
import { Bundle } from "../src/ast.ts";
import { cleanModule, renameModule } from "../src/clean.ts";

const mod = (text: string) =>
  new Bundle([{ name: "/$bunfs/root/a.js", text }]).get("a.js") as NonNullable<
    ReturnType<Bundle["get"]>
  >;

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

test("two builds of the same code clean to the same text", async () => {
  const [short, long] = await Promise.all([build(true), build(false)]);
  expect(short).not.toBe(long);
  const a = cleanModule(mod(short));
  expect(a).toBe(cleanModule(mod(long)));
  expect(a).toContain("tengu_example_gate");
});

test("keeps shorthand keys, export names, and class names", () => {
  const out = renameModule(
    mod(
      "const a=1;function f({b,c=2}){return{a,b,c}}class K{m(){return K}}export{f,K as Z};",
    ),
  );
  expect(out).toMatch(/\{b:a1,c:a2=2\}/);
  expect(out).toMatch(/return\{a:\$[0-9a-f]{6},b:a1,c:a2\}/);
  expect(out).toMatch(/class (\$[0-9a-f]{6})\{m\(\)\{return \1\}\}/);
  expect(out).toMatch(/export\{\$[0-9a-f]{6} as f,\$[0-9a-f]{6} as Z\}/);
});

test("a module-level name stays when other code is added", () => {
  const name = (src: string) =>
    renameModule(mod(src)).match(
      /function (\$[0-9a-f]{6})\(\)\{return"x"\}/,
    )?.[1];
  const before = name('function q(){return"x"}export{q};');
  expect(before).toBeDefined();
  expect(name('var z=1;function w(){return"x"}export{w,z};')).toBe(before);
});

test("rewrites chunk paths from the map", () => {
  const out = renameModule(
    mod('var r=import.meta.require("/$bunfs/root/chunk-ab12.js");'),
    new Map([["chunk-ab12.js", "chunk@f00d.js"]]),
  );
  expect(out).toContain('"/$bunfs/root/chunk@f00d.js"');
});
