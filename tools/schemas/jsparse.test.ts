import { describe, expect, test } from "bun:test";
import {
  bindingAt,
  brackets,
  type Entry,
  frameAt,
  functionReturns,
  isCode,
  mergeEntries,
  nameIndex,
  walkCode,
} from "./jsparse.ts";

const str = (key: string, v: string): Entry => ({
  key,
  opt: false,
  val: { k: "str", v },
});
const unk = (key: string, text: string): Entry => ({
  key,
  opt: false,
  val: { k: "unk", text },
});

describe("functionReturns", () => {
  test("reads a returned name and a comma expression, not only literals", () => {
    const src =
      "function f(t){try{let o=g(t);return o}catch(o){return l(o),{}}}";
    expect(functionReturns(src, "f")).toEqual(["o", "l(o),{}"]);
  });
  test("skips a bare return and a name that starts with return", () => {
    const src = "function f(t){if(!t)return;let returned=1;return{a:1}}";
    expect(functionReturns(src, "f")).toEqual([
      [{ key: "a", opt: false, val: { k: "num", v: 1 } }],
    ]);
  });
});

describe("mergeEntries", () => {
  test("different string literals at two sites give an enum", () => {
    const [e] = mergeEntries([[str("subtype", "a")], [str("subtype", "b")]]);
    expect(e && "key" in e && e.val).toEqual({ k: "enum", v: ["a", "b"] });
  });
  test("a literal at one site and a computed value at another is not a const", () => {
    for (const lists of [
      [[str("level", "info")], [unk("level", "n")]],
      [[unk("level", "n")], [str("level", "info")]],
    ]) {
      const [e] = mergeEntries(lists);
      expect(e && "key" in e && e.val.k).toBe("unk");
    }
  });
});

describe("brackets().functions", () => {
  test("lists top-level functions and leaves out nested ones", () => {
    // A template placeholder and a regex literal that hold a closing brace.
    const src = `function a(){function r(){}return r()}var s=\`$\{"}"}\`,x=/[}]/;function b(){}`;
    expect([...brackets(src).functions.keys()].sort()).toEqual(["a", "b"]);
  });
});

describe("walkCode", () => {
  test("visits code, skips strings, comments, and regex literals, and reports template braces", () => {
    const src = 'a("(",/[(]/,`$' + "{b}`)//(\n/*(*/c";
    let code = "";
    walkCode(src, 0, src.length, (_, c) => {
      code += c;
      return undefined;
    });
    expect(code).toBe("a(,,{b})\nc");
  });
});

describe("brackets", () => {
  test("finds the bracket around an index and tells code from text", () => {
    const src = 'function f(a){let b={c:"}"};return b}';
    const b = brackets(src);
    const at = (i: number) => src[b.open[frameAt(b, i)] as number];
    expect(at(src.indexOf("c:"))).toBe("{");
    expect(at(src.indexOf("return"))).toBe("{");
    expect(at(src.indexOf("a)"))).toBe("(");
    expect(frameAt(b, 0)).toBe(-1);
    expect(isCode(b, src.indexOf('"}"') + 1)).toBe(false);
    expect(isCode(b, src.indexOf("return"))).toBe(true);
  });
});

describe("bindingAt", () => {
  // The binding of `id` at the spread `...id` that comes last in `src`.
  const bind = (src: string, id: string) => {
    const b = brackets(src);
    const pos = src.lastIndexOf(`...${id}`);
    return bindingAt(src, b, nameIndex(src, b).get(id) ?? [], pos, id);
  };
  test("a declaration in scope, also in a comma list", () => {
    expect(bind("function f(){let x={a:1};g({...x})}", "x")).toEqual({
      kind: "var",
      at: 17,
      frame: 1,
    });
    expect(bind("let a=1,x={};g({...x})", "x")?.kind).toBe("var");
  });
  test("a parameter shadows an outer declaration only inside its function", () => {
    expect(bind("let x={};function g(x){h({...x})}", "x")).toEqual({
      kind: "param",
      fn: "g",
      fnAt: 18,
      index: 0,
    });
    expect(bind("let x={a:1};function g(x){}h({...x})", "x")?.kind).toBe("var");
  });
  test("a parameter of a named arrow, with the arrow's expression body", () => {
    expect(bind('let D=(n,J)=>o({...J});D("a",{b:1})', "J")).toEqual({
      kind: "param",
      fn: "D",
      fnAt: 4,
      index: 1,
    });
  });
  test("a destructured name or a catch parameter stops the search", () => {
    for (const src of [
      "let x={};function f({x}){g({...x})}",
      "let x={};let{x:y,x}=z;g({...x})",
      "let x={};try{}catch(x){g({...x})}",
      "let x={};for(const x of y){g({...x})}",
    ])
      expect(bind(src, "x")).toEqual({ kind: "opaque" });
  });
});
