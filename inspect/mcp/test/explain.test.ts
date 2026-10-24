import { expect, test } from "bun:test";
import { Bundle } from "../src/ast.ts";
import { explain, howOf } from "../src/explain.ts";
import { type Index, unitsOf } from "../src/prepare.ts";

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

const APP = [
  'var loops={type:"local-jsx",name:"loops",isEnabled:()=>!1};',
  'var off={name:"stubbed",call(){if(gate("tengu_off"))throw new Error("not here");return null}};',
  'var on={name:"handled",isEnabled(){return gate("tengu_on")&&process.env.MY_FLAG!=="0"},call(a){let b=a+1;return run(b)}};',
  "function gate(k){return k.length>0}function run(x){return x}",
  "export const all=[loops,off,on];",
].join("\n");

test("how: no-op, stub, and handled", () => {
  expect(howOf("()=>!1")).toEqual({ how: "no-op", value: "false" });
  expect(howOf("(){}")).toEqual({ how: "no-op", value: "undefined" });
  expect(howOf("()=>{}")).toEqual({ how: "no-op", value: "undefined" });
  expect(howOf("()=>({})")).toEqual({ how: "no-op", value: "{}" });
  expect(howOf('(){throw new Error("x")}')).toEqual({ how: "stub" });
  expect(howOf('(){if($a1b2c3("tengu_x"))return!1;return null}')).toEqual({
    how: "stub",
    value: "null",
  });
  expect(howOf("(a1){let a2=a1+1;return $a1b2c3(a2)}")).toEqual({
    how: "handled",
  });
});

test("explains a command, a stubbed call, and a gated handled tool", () => {
  const ix = index(APP);
  const loops = explain(ix, "/loops");
  expect(loops?.holder.t).toContain('name:"loops"');
  expect(loops?.how).toEqual([
    expect.objectContaining({
      label: "isEnabled",
      how: "no-op",
      value: "false",
    }),
  ]);
  expect(loops?.who).toEqual([
    expect.stringMatching(/^ExportNamedDeclaration a\.js:\d+$/),
  ]);
  expect(explain(ix, "stubbed")?.how).toEqual([
    expect.objectContaining({ label: "call", how: "stub", value: "null" }),
  ]);
  const on = explain(ix, "handled");
  expect(on?.when).toEqual({
    gates: ['"tengu_on"'],
    env: ["MY_FLAG"],
    isEnabled: expect.stringContaining('"tengu_on"'),
  });
  expect(on?.how.map((h) => [h.label, h.how])).toEqual([
    ["isEnabled", "handled"],
    ["call", "handled"],
  ]);
});

test("an unknown name explains nothing", () => {
  expect(explain(index(APP), "no-such-name")).toBeUndefined();
});
