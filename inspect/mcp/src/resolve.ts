// Finds the keys of the object an expression gives in a bundled program: object literals, their spreads,
// the values a name is bound to, the arguments a parameter gets at each call, and what a called function
// returns, across chunks. A value it cannot follow stays unknown.
import type { Variable } from "eslint-scope";
import type * as ES from "estree";
import {
  callsOf,
  constString,
  type Fn,
  functionOf,
  type Module,
  type Node,
  returnsOf,
} from "./ast.ts";

/** What a parameter is bound to in one call: the argument, or null when the call leaves it out. */
export type Env = Map<Variable, Ref | null>;
/** Where a value is in the program, with the parameters of the call it is evaluated in. */
export type Ref = { m: Module; n: Node; env?: Env | undefined };

export type Val =
  /** `open`: one site gives this object and another an unknown value, which may be no object. */
  | { k: "obj"; e: Entry[]; open?: boolean }
  | { k: "str"; v: string }
  | { k: "enum"; v: string[] }
  | { k: "num"; v: number }
  | { k: "bool"; v: boolean }
  | { k: "arr" }
  /** `t`: the JSON types the code shows for it; null when no type is known (the `ref` is not read for one). */
  | { k: "unk"; text: string; ref?: Ref; t?: JType[] | null };
export type Entry =
  | { key: string; opt: boolean; val: Val }
  | { spread: string; opt: boolean; ref?: Ref };
export type JType =
  | "string"
  | "number"
  | "boolean"
  | "array"
  | "object"
  | "null";
/** A value that JSON drops: undefined. Only used while types are worked out. */
type Ty = JType | "absent";

/** The JSON type of a value that is no unknown. */
const kindType = (v: Val): JType | undefined =>
  v.k === "str" || v.k === "enum"
    ? "string"
    : v.k === "num"
      ? "number"
      : v.k === "bool"
        ? "boolean"
        : v.k === "arr"
          ? "array"
          : v.k === "obj"
            ? "object"
            : undefined;
/** Both type lists joined, or undefined when either is unknown. */
const union = (
  a: readonly Ty[] | undefined,
  b: readonly Ty[] | undefined,
): Ty[] | undefined => (a && b ? [...new Set([...a, ...b])].sort() : undefined);
/** The types JSON can hold; undefined when there are none. */
const jsonTypes = (t: readonly Ty[] | undefined): JType[] | undefined => {
  const out = t?.filter((x): x is JType => x !== "absent");
  return out?.length ? out : undefined;
};

/** A value that is one case of several: an object keeps its keys, every other value becomes unknown. */
const loosen = (v: Val): Val =>
  v.k === "obj"
    ? {
        k: "obj",
        e: v.e.map((x) => ("key" in x ? { ...x, val: loosen(x.val) } : x)),
        open: true,
      }
    : { k: "unk", text: "" };

/**
 * Merge several literals of one thing: a key missing from any of them becomes optional. `ty` gives the
 * types of an unknown value; without it, a value whose sites differ in type keeps only the types it holds.
 */
export const mergeEntries = (
  lists: Entry[][],
  ty: (v: Val) => JType[] | undefined = (v) =>
    v.k === "unk" ? (v.t ?? undefined) : kindType(v) && [kindType(v) as JType],
): Entry[] => {
  const seen = new Map<string, Entry>();
  const count = new Map<string, number>();
  for (const l of lists)
    for (const e of l) {
      if (!("key" in e)) continue;
      count.set(e.key, (count.get(e.key) ?? 0) + 1);
      const prev = seen.get(e.key);
      if (!prev || !("key" in prev)) seen.set(e.key, e);
      // A literal at one site and an unknown value at another: the literal is one case only. An object
      // keeps its keys, and its leaf values become unknown.
      else if (prev.val.k === "unk" || e.val.k === "unk") {
        const known = prev.val.k === "unk" ? e.val : prev.val;
        const unknown = prev.val.k === "unk" ? prev.val : e.val;
        seen.set(e.key, {
          ...prev,
          opt: prev.opt || e.opt,
          val:
            known.k === "obj"
              ? loosen(known)
              : unknown.k === "unk"
                ? {
                    ...unknown,
                    t: jsonTypes(union(ty(known), ty(unknown))) ?? null,
                  }
                : unknown,
        });
      } else if (
        (prev.val.k === "str" || prev.val.k === "enum") &&
        (e.val.k === "str" || e.val.k === "enum")
      ) {
        const all = new Set([prev.val.v, e.val.v].flat());
        if (all.size > 1)
          seen.set(e.key, { ...prev, val: { k: "enum", v: [...all] } });
      } else if (prev.val.k === "obj" && e.val.k === "obj")
        seen.set(e.key, {
          ...prev,
          val: {
            k: "obj",
            e: mergeEntries([prev.val.e, e.val.e], ty),
            ...((prev.val.open || e.val.open) && { open: true }),
          },
        });
      // An object at one site and another value at another: the object is one case only.
      else if (prev.val.k === "obj" || e.val.k === "obj")
        seen.set(e.key, {
          ...prev,
          val: loosen(prev.val.k === "obj" ? prev.val : e.val),
        });
      // Two kinds, such as a string and a number: both types.
      else if (prev.val.k !== e.val.k)
        seen.set(e.key, {
          ...prev,
          val: {
            k: "unk",
            text: "",
            t: jsonTypes(union(ty(prev.val), ty(e.val))) ?? null,
          },
        });
    }
  return [...seen.values()].map((e) =>
    "key" in e
      ? { ...e, opt: e.opt || (count.get(e.key) ?? 0) < lists.length }
      : e,
  );
};

const isVoid = (n: Node | null | undefined): boolean =>
  !n ||
  (n.type === "UnaryExpression" && n.operator === "void") ||
  (n.type === "Literal" && n.value === null) ||
  (n.type === "Identifier" && n.name === "undefined");

/** The object, property names, and root name of `a.b.c`; undefined for anything else. */
const memberPath = (
  m: Module,
  n: Node,
): { root: Node; path: string[] } | undefined => {
  const path: string[] = [];
  let x = n;
  while (x.type === "MemberExpression") {
    const key = x.computed
      ? constString(m, x.property as Node)
      : x.property.type === "Identifier"
        ? x.property.name
        : undefined;
    if (key === undefined) return undefined;
    path.unshift(key);
    x = x.object as Node;
  }
  return x.type === "Identifier" ? { root: x, path } : undefined;
};

/** The parameters of `fn` (in module `dm`) bound to the arguments of `call` (in `m`). */
const bind = (
  m: Module,
  call: Node & (ES.CallExpression | ES.NewExpression),
  env: Env | undefined,
  dm: Module,
  fn: Fn,
): Env => {
  const inner: Env = new Map();
  const args = call.arguments as Node[];
  const spreadAt = args.findIndex((a) => a.type === "SpreadElement");
  fn.params.forEach((p, i) => {
    if (p.type !== "Identifier" || (spreadAt >= 0 && i >= spreadAt)) return;
    const v = dm.variable(p as Node);
    const a = args[i];
    if (v) inner.set(v, a && !isVoid(a) ? { m, n: a, env } : null);
  });
  return inner;
};

// Built-ins whose result type does not depend on what they are called on. Minified code keeps these
// names, as they are properties of the built-in objects.
const GLOBAL_CALLS: Record<string, Ty> = {
  String: "string",
  Number: "number",
  parseInt: "number",
  parseFloat: "number",
  Boolean: "boolean",
  isNaN: "boolean",
  isFinite: "boolean",
  encodeURIComponent: "string",
  decodeURIComponent: "string",
};
const STATIC_CALLS: Record<string, Record<string, Ty>> = {
  Math: {},
  Date: { now: "number", parse: "number" },
  JSON: { stringify: "string" },
  Object: { keys: "array", values: "array", entries: "array" },
  Array: { isArray: "boolean", from: "array", of: "array" },
  Number: {
    isFinite: "boolean",
    isInteger: "boolean",
    isNaN: "boolean",
    isSafeInteger: "boolean",
    parseInt: "number",
    parseFloat: "number",
  },
  performance: { now: "number" },
};
const METHODS: Record<string, Ty> = {
  toISOString: "string",
  toLowerCase: "string",
  toUpperCase: "string",
  trim: "string",
  trimStart: "string",
  trimEnd: "string",
  toFixed: "string",
  padStart: "string",
  padEnd: "string",
  replace: "string",
  replaceAll: "string",
  join: "string",
  includes: "boolean",
  startsWith: "boolean",
  endsWith: "boolean",
  getTime: "number",
  indexOf: "number",
  lastIndexOf: "number",
  findIndex: "number",
  map: "array",
  filter: "array",
  flatMap: "array",
  split: "array",
};
const COMPARE = new Set([
  "==",
  "!=",
  "===",
  "!==",
  "<",
  ">",
  "<=",
  ">=",
  "instanceof",
  "in",
]);

export class Resolver {
  /**
   * Each time a spread could not be followed, as `<module>@<index>: ...<text>`, also in an object read
   * only for the type of one of its keys. A result is cached, so a spread is logged at its first visit.
   */
  readonly unresolved: string[] = [];
  #names = new Map<Node, Entry[] | undefined>();
  #params = new Map<Variable, Entry[] | undefined>();
  #varTypes = new Map<Variable, Ty[] | undefined>();
  readonly #ty = (v: Val): JType[] | undefined => this.typeOfVal(v);

  /** The JSON types a value can have, or undefined when the code does not show them. */
  typeOfVal(v: Val): JType[] | undefined {
    if (v.k !== "unk") return kindType(v) && [kindType(v) as JType];
    if (v.t !== undefined) return v.t ?? undefined;
    // A type can lead to keys, and keys to types: past a few levels, the type is not known.
    if (!v.ref || this.#nested > 4) return undefined;
    this.#nested++;
    try {
      return jsonTypes(this.typeOf(v.ref.m, v.ref.n, v.ref.env));
    } finally {
      this.#nested--;
    }
  }
  #nested = 0;

  /** The types an expression gives, "absent" for undefined; undefined when one of them is not known. */
  typeOf(m: Module, n: Node | null, env?: Env, depth = 0): Ty[] | undefined {
    // Without the arguments of a call, a node has one type: it is worked out once.
    if (!n || env) return this.#typeOf(m, n, env, depth);
    if (this.#types.has(n)) return this.#types.get(n);
    this.#types.set(n, undefined);
    const got = this.#typeOf(m, n, env, depth);
    this.#types.set(n, got);
    return got;
  }
  #types = new Map<Node, Ty[] | undefined>();

  #typeOf(m: Module, n: Node | null, env?: Env, depth = 0): Ty[] | undefined {
    if (n?.type === "Literal" && n.value === null) return ["null"];
    if (!n || isVoid(n)) return ["absent"];
    if (depth > 12) return undefined;
    const t = (x: Node | null | undefined) =>
      this.typeOf(m, (x as Node) ?? null, env, depth + 1);
    switch (n.type) {
      case "Literal":
        return n.value === null
          ? ["null"]
          : typeof n.value === "string"
            ? ["string"]
            : typeof n.value === "number"
              ? ["number"]
              : typeof n.value === "boolean"
                ? ["boolean"]
                : undefined;
      case "TemplateLiteral":
        return ["string"];
      case "ArrayExpression":
        return ["array"];
      case "ObjectExpression":
        return ["object"];
      case "UnaryExpression":
        return n.operator === "!" || n.operator === "delete"
          ? ["boolean"]
          : n.operator === "typeof"
            ? ["string"]
            : ["number"];
      case "UpdateExpression":
        return ["number"];
      case "BinaryExpression": {
        if (COMPARE.has(n.operator)) return ["boolean"];
        if (n.operator !== "+") return ["number"];
        const [a, b] = [t(n.left as Node), t(n.right as Node)];
        if (a?.length === 1 && a[0] === "string") return ["string"];
        if (b?.length === 1 && b[0] === "string") return ["string"];
        return a && b && [...a, ...b].every((x) => x === "number")
          ? ["number"]
          : undefined;
      }
      case "LogicalExpression": {
        const a = t(n.left as Node);
        const b = t(n.right as Node);
        return n.operator === "??"
          ? union(
              a?.filter((x) => x !== "null" && x !== "absent"),
              b,
            )
          : union(a, b);
      }
      case "ConditionalExpression":
        return union(t(n.consequent as Node), t(n.alternate as Node));
      case "SequenceExpression":
        return t(n.expressions.at(-1) as Node);
      case "AssignmentExpression":
        return n.operator === "=" ? t(n.right as Node) : undefined;
      case "ChainExpression":
        return union(t(n.expression as Node), ["absent"]);
      case "AwaitExpression":
        return n.argument.type === "CallExpression"
          ? this.#callType(
              m,
              n.argument as Node & ES.CallExpression,
              env,
              depth,
              true,
            )
          : t(n.argument as Node);
      case "CallExpression":
        return this.#callType(m, n, env, depth, false);
      case "Identifier":
        return this.#identType(m, n, env, depth);
      case "MemberExpression": {
        if (
          !n.computed &&
          n.property.type === "Identifier" &&
          (n.property.name === "length" || n.property.name === "size")
        )
          return ["number"];
        const key = n.computed
          ? constString(m, n.property as Node)
          : n.property.type === "Identifier"
            ? n.property.name
            : undefined;
        const obj = this.expr(m, n.object as Node, env, depth + 1);
        const e = obj?.find((x) => "key" in x && x.key === key);
        if (!e || !("key" in e)) return undefined;
        const got = this.typeOfVal(e.val);
        return got && (e.opt ? [...got, "absent"] : got);
      }
    }
    return undefined;
  }

  #callType(
    m: Module,
    call: Node & ES.CallExpression,
    env: Env | undefined,
    depth: number,
    awaited: boolean,
  ): Ty[] | undefined {
    const c = call.callee as Node;
    const isGlobal = (id: Node) =>
      id.type === "Identifier" && m.reference(id)?.resolved === null;
    // Own keys only: `toString` and `constructor` are on every object's prototype.
    const own = <T>(o: Record<string, T> | undefined, k: string) =>
      o && Object.hasOwn(o, k) ? o[k] : undefined;
    if (c.type === "Identifier" && isGlobal(c)) {
      const g = own(GLOBAL_CALLS, c.name);
      if (g) return [g];
    }
    if (
      c.type === "MemberExpression" &&
      !c.computed &&
      c.property.type === "Identifier"
    ) {
      const o = c.object as Node;
      const name = c.property.name;
      const statics =
        o.type === "Identifier" && isGlobal(o)
          ? own(STATIC_CALLS, o.name)
          : undefined;
      const got = statics
        ? o.type === "Identifier" && o.name === "Math"
          ? "number"
          : own(statics, name)
        : own(METHODS, name);
      return got ? [got] : undefined;
    }
    const f = functionOf(m, c);
    if (!f || f.fn.generator || (f.fn.async && !awaited)) return undefined;
    const inner = bind(m, call, env, f.module, f.fn);
    const rets = returnsOf(f.fn);
    if (rets.length === 0) return ["absent"];
    let out: Ty[] | undefined = [];
    for (const r of rets)
      out = union(out, this.typeOf(f.module, r, inner, depth + 1));
    return out;
  }

  /** The types of a name: its argument in this call, the arguments at every call, or each write. */
  #identType(
    m: Module,
    id: Node,
    env: Env | undefined,
    depth: number,
  ): Ty[] | undefined {
    if (id.type !== "Identifier") return undefined;
    const v = m.variable(id);
    if (!v)
      return id.name === "undefined"
        ? ["absent"]
        : id.name === "NaN" || id.name === "Infinity"
          ? ["number"]
          : undefined;
    if (env?.has(v)) {
      const arg = env.get(v);
      return arg ? this.typeOf(arg.m, arg.n, arg.env, depth + 1) : ["absent"];
    }
    const o = m.bundle?.origin(m, v) ?? { module: m, variable: v };
    if (this.#varTypes.has(o.variable)) return this.#varTypes.get(o.variable);
    this.#varTypes.set(o.variable, undefined);
    const got = this.#varType(o.module, o.variable, depth);
    this.#varTypes.set(o.variable, got);
    return got;
  }

  #varType(m: Module, v: Variable, depth: number): Ty[] | undefined {
    const def = v.defs[0];
    if (def?.type === "Parameter") {
      const fn = def.node as Fn;
      const index = fn.params.indexOf(def.name as ES.Pattern);
      if (index < 0) return undefined;
      let out: Ty[] | undefined = [];
      for (const c of callsOf(m, fn)) {
        const args = c?.call.arguments ?? [];
        if (
          !c ||
          args.slice(0, index + 1).some((a) => a.type === "SpreadElement")
        )
          return undefined;
        out = union(
          out,
          this.typeOf(
            c.module,
            (args[index] as Node) ?? null,
            undefined,
            depth + 1,
          ),
        );
      }
      return out?.length ? out : undefined;
    }
    if (def?.type !== "Variable" || def.node.id !== def.name) return undefined;
    const loop = m.parent(def.parent as unknown as Node);
    if (
      (loop?.type === "ForOfStatement" || loop?.type === "ForInStatement") &&
      loop.left === (def.parent as unknown)
    )
      return undefined;
    let out: Ty[] | undefined = def.node.init ? [] : ["absent"];
    for (const r of v.references) {
      if (!r.isWrite()) continue;
      const p = m.parent(r.identifier as Node);
      const op = p?.type === "AssignmentExpression" ? p.operator : "=";
      const w =
        p?.type === "UpdateExpression"
          ? (["number"] as Ty[])
          : this.typeOf(m, r.writeExpr as Node, undefined, depth + 1);
      // `x+=y` stays a number only for numbers; a string makes it a string.
      const one = (k: Ty) => w?.length && w.every((x) => x === k);
      out =
        op === "=" || op === "??=" || op === "||=" || op === "&&="
          ? union(out, w)
          : op !== "+="
            ? union(out, ["number"])
            : one("number") || one("string")
              ? union(out, w)
              : undefined;
      if (!out) return undefined;
    }
    return out;
  }

  /** Entries of the object literal whose `{` is at `pos`; empty when there is none. */
  objectAt(m: Module, pos: number): Entry[] {
    const o = m.at(pos, "ObjectExpression");
    return o ? this.entries(m, o) : [];
  }

  /** Entries of an object literal: keys (computed ones when they are constant strings) and spreads. */
  entries(m: Module, obj: Node & ES.ObjectExpression, env?: Env): Entry[] {
    const out: Entry[] = [];
    const spread = (n: Node, opt: boolean) => {
      if (n.type === "ObjectExpression")
        for (const e of this.entries(m, n, env))
          out.push({ ...e, opt: e.opt || opt });
      else if (n.type === "LogicalExpression" && n.operator === "&&")
        spread(n.right as Node, true);
      // `a ?? {...}` and `a || {...}`: the keys of either side.
      else if (n.type === "LogicalExpression") {
        spread(n.left as Node, true);
        spread(n.right as Node, true);
      } else if (n.type === "ConditionalExpression") {
        spread(n.consequent as Node, true);
        spread(n.alternate as Node, true);
      } else if (
        !isVoid(n) &&
        n.type !== "Literal" &&
        !(n.type === "UnaryExpression" && n.operator === "!")
      )
        out.push({ spread: m.src(n), opt, ref: { m, n, env } });
    };
    for (const p of obj.properties as (Node &
      (ES.Property | ES.SpreadElement))[]) {
      if (p.type === "SpreadElement") {
        spread(p.argument as Node, false);
        continue;
      }
      const key = p.computed
        ? constString(m, p.key as Node)
        : p.key.type === "Identifier"
          ? p.key.name
          : p.key.type === "Literal"
            ? String(p.key.value)
            : undefined;
      if (key === undefined) continue;
      const v = p.value as Node;
      out.push({
        key,
        opt: false,
        val:
          p.kind === "init" && !p.method
            ? this.value(m, v, env)
            : { k: "unk", text: m.src(v) },
      });
    }
    return out;
  }

  value(m: Module, n: Node, env?: Env): Val {
    if (n.type === "Literal") {
      if (typeof n.value === "string") return { k: "str", v: n.value };
      if (typeof n.value === "number") return { k: "num", v: n.value };
      if (typeof n.value === "boolean") return { k: "bool", v: n.value };
    }
    if (n.type === "TemplateLiteral" && n.expressions.length === 0)
      return { k: "str", v: n.quasis[0]?.value.cooked ?? "" };
    if (
      n.type === "UnaryExpression" &&
      n.argument.type === "Literal" &&
      typeof n.argument.value === "number"
    ) {
      if (n.operator === "!") return { k: "bool", v: !n.argument.value };
      if (n.operator === "-") return { k: "num", v: -n.argument.value };
    }
    // `c ? "a" : "b"`: the strings of both branches. Any other branch makes it unknown.
    if (n.type === "ConditionalExpression") {
      const all = [n.consequent, n.alternate].map((b) =>
        this.value(m, b as Node, env),
      );
      const v = [
        ...new Set(
          all.flatMap((x) => (x.k === "str" || x.k === "enum" ? x.v : [])),
        ),
      ];
      if (all.every((x) => x.k === "str" || x.k === "enum"))
        return v.length === 1
          ? { k: "str", v: v[0] as string }
          : { k: "enum", v };
    }
    if (n.type === "ArrayExpression") return { k: "arr" };
    if (n.type === "ObjectExpression")
      return { k: "obj", e: this.entries(m, n, env) };
    return { k: "unk", text: m.src(n), ref: { m, n, env } };
  }

  /**
   * Entries of the object an expression gives: a literal, a call, a name, `a.b`, `await x`, `a,b`, or a
   * ternary of those. Null and undefined give no entries, as a spread of them adds nothing.
   */
  expr(m: Module, n: Node | null, env?: Env, depth = 0): Entry[] | undefined {
    if (!n || isVoid(n)) return [];
    if (depth > 12) return undefined;
    switch (n.type) {
      case "AwaitExpression":
        return this.expr(m, n.argument as Node, env, depth);
      case "SequenceExpression":
        return this.expr(m, n.expressions.at(-1) as Node, env, depth);
      case "ConditionalExpression": {
        const a = this.expr(m, n.consequent as Node, env, depth);
        const c = this.expr(m, n.alternate as Node, env, depth);
        return a && c ? mergeEntries([a, c], this.#ty) : undefined;
      }
      case "ObjectExpression":
        return this.pin(this.entries(m, n, env), depth + 1);
      case "CallExpression":
        return this.call(m, n, env, depth);
      case "Identifier":
        return this.ident(m, n, env, depth);
      case "MemberExpression": {
        const p = memberPath(m, n);
        let got = p && this.ident(m, p.root, env, depth);
        for (const k of p?.path ?? []) {
          const e = got?.find((x) => "key" in x && x.key === k);
          got = e && "key" in e && e.val.k === "obj" ? e.val.e : undefined;
        }
        return got;
      }
    }
    return undefined;
  }

  /**
   * Entries of the object that a name holds at its use: the value of each write before the use (and
   * the keys that `name.key=` adds), the argument of the call it is evaluated in, or for a parameter the
   * argument at every call site.
   */
  ident(m: Module, id: Node, env?: Env, depth = 0): Entry[] | undefined {
    const v = m.variable(id);
    if (!v) return undefined;
    if (env?.has(v)) {
      const arg = env.get(v);
      return arg ? this.expr(arg.m, arg.n, arg.env, depth + 1) : [];
    }
    const o = m.bundle?.origin(m, v) ?? { module: m, variable: v };
    const def = o.variable.defs[0];
    if (def?.type === "Parameter")
      return this.param(o.module, o.variable, def.node as Fn, depth);
    if (def?.type !== "Variable" || def.node.id !== def.name) return undefined;
    const loop = o.module.parent(def.parent as unknown as Node);
    if (
      (loop?.type === "ForOfStatement" || loop?.type === "ForInStatement") &&
      loop.left === (def.parent as unknown)
    )
      return undefined;
    const cacheable = !env && o.module !== m;
    if (cacheable && this.#names.has(def.name as Node))
      return this.#names.get(def.name as Node);
    if (cacheable) this.#names.set(def.name as Node, undefined);
    // In another module every write counts; here, the writes before the use.
    const before = o.module === m ? id.start : Number.POSITIVE_INFINITY;
    const lists: Entry[][] = [];
    const later: Entry[] = [];
    if (!def.node.init) lists.push([]);
    for (const r of o.variable.references) {
      const at = (r.identifier as Node).start;
      if (at >= before) continue;
      const p = o.module.parent(r.identifier as Node);
      if (r.isWrite()) {
        if (p?.type === "AssignmentExpression" && p.operator !== "=") continue;
        const got = this.expr(o.module, r.writeExpr as Node, env, depth + 1);
        if (!got) return undefined;
        lists.push(got);
        continue;
      }
      // `name.key=value` adds a key.
      const a = p && o.module.parent(p);
      if (
        p?.type === "MemberExpression" &&
        p.object === r.identifier &&
        a?.type === "AssignmentExpression" &&
        a.left === p &&
        a.operator === "="
      ) {
        const key = memberPath(o.module, p)?.path[0];
        if (key !== undefined)
          later.push({
            key,
            opt: true,
            val: this.value(o.module, a.right as Node, env),
          });
      }
    }
    const merged = [...mergeEntries(lists, this.#ty), ...later];
    // No key at all: the name may hold a string or a number, so it is no known object.
    const out = merged.length > 0 ? merged : undefined;
    if (cacheable) this.#names.set(def.name as Node, out);
    return out;
  }

  /** A parameter with no call to bind it: the argument at every call of its function. */
  param(m: Module, v: Variable, fn: Fn, depth: number): Entry[] | undefined {
    const index = fn.params.indexOf(v.defs[0]?.name as ES.Pattern);
    if (index < 0) return undefined;
    if (this.#params.has(v)) return this.#params.get(v);
    this.#params.set(v, undefined);
    const lists: Entry[][] = [];
    let ok = true;
    // `f(...).then((x)=>...)`: `x` is what `f` returns.
    const p = m.parent(fn);
    if (
      index === 0 &&
      p?.type === "CallExpression" &&
      p.arguments[0] === fn &&
      p.callee.type === "MemberExpression" &&
      p.callee.property.type === "Identifier" &&
      p.callee.property.name === "then"
    ) {
      const got = this.expr(m, p.callee.object as Node, undefined, depth + 1);
      if (got) lists.push(got);
      else ok = false;
    } else
      for (const c of callsOf(m, fn)) {
        const args = c?.call.arguments ?? [];
        if (
          !c ||
          args.slice(0, index + 1).some((a) => a.type === "SpreadElement")
        ) {
          ok = false;
          break;
        }
        const got = this.expr(
          c.module,
          (args[index] as Node) ?? null,
          undefined,
          depth + 1,
        );
        if (!got) {
          ok = false;
          break;
        }
        lists.push(got);
      }
    const merged = mergeEntries(lists, this.#ty);
    const out = ok && merged.length > 0 ? merged : undefined;
    this.#params.set(v, out);
    return out;
  }

  /**
   * Entries returned by a call like `f(a,b)`, where `f` is any function the callee names, in this chunk or
   * an imported one. The parameters bind to this call's arguments; one it leaves out is undefined, and a
   * key whose value is undefined is dropped, as JSON drops it.
   */
  call(
    m: Module,
    call: Node & ES.CallExpression,
    env?: Env,
    depth = 0,
  ): Entry[] | undefined {
    if (depth > 10) return undefined;
    const f = functionOf(m, call.callee as Node);
    if (!f) return undefined;
    const { module: dm, fn } = f;
    const rets = returnsOf(fn).filter((r): r is Node => r !== null);
    if (rets.length === 0) return undefined;
    const inner = bind(m, call, env, dm, fn);
    // Undefined, which JSON drops; null stays.
    const isUndef = (n: Node | null | undefined): boolean => {
      if (n?.type === "Literal" && n.value === null) return false;
      if (!n || isVoid(n)) return true;
      if (n.type === "Identifier") {
        const v = dm.variable(n);
        if (!v) return false;
        if (inner.has(v)) return inner.get(v) === null;
        const d = v.defs[0];
        const writes = v.references.filter((r) => r.isWrite() && !r.init);
        return (
          d?.type === "Variable" &&
          writes.length === 0 &&
          d.node.init !== null &&
          isUndef(d.node.init as Node)
        );
      }
      if (n.type === "LogicalExpression")
        return n.operator === "??"
          ? isUndef(n.left as Node) && isUndef(n.right as Node)
          : n.operator === "&&" && isUndef(n.left as Node);
      if (n.type === "ConditionalExpression") {
        let t = n.test as Node;
        while (t.type === "LogicalExpression" && t.operator === "&&")
          t = t.left as Node;
        return isUndef(t) && isUndef(n.alternate as Node);
      }
      if (n.type === "ChainExpression") return isUndef(n.expression as Node);
      if (n.type === "MemberExpression" && n.optional)
        return isUndef(n.object as Node);
      return false;
    };
    const unset = (e: Entry) =>
      "key" in e &&
      e.val.k === "unk" &&
      e.val.ref !== undefined &&
      isUndef(e.val.ref.n);
    const returned = (n: Node): Entry[][] | undefined => {
      if (n.type === "SequenceExpression")
        return returned(n.expressions.at(-1) as Node);
      if (n.type === "ConditionalExpression") {
        const a = returned(n.consequent as Node);
        const b = returned(n.alternate as Node);
        return a && b ? [...a, ...b] : undefined;
      }
      if (n.type === "AwaitExpression") return returned(n.argument as Node);
      if (n.type === "ObjectExpression")
        return [
          this.spreads(
            this.entries(dm, n, inner).filter((e) => !unset(e)),
            depth + 1,
          ).filter((e) => "key" in e),
        ];
      const got = this.expr(dm, n, inner, depth + 1);
      return got && [got];
    };
    const lists: Entry[][] = [];
    for (const r of rets) {
      const got = returned(r);
      if (!got) return undefined;
      lists.push(...got);
    }
    return this.pin(mergeEntries(lists, this.#ty), depth + 1);
  }

  /** Inline the spreads that resolve; count the others as unresolved. */
  spreads(entries: Entry[], depth = 0): Entry[] {
    const out: Entry[] = [];
    for (const e of entries) {
      if ("key" in e) {
        out.push(e);
        continue;
      }
      const got = e.ref && this.expr(e.ref.m, e.ref.n, e.ref.env, depth);
      if (got && depth < 6)
        for (const inner of this.spreads(got, depth + 1))
          out.push({ ...inner, opt: inner.opt || e.opt });
      else
        this.unresolved.push(
          `${e.ref?.m.name ?? "?"}@${e.ref?.n.start ?? -1}: ...${e.spread}`,
        );
    }
    return out;
  }

  /** The object a value holds, when it holds one with keys: an empty result may be null or a number. */
  objectValue(v: Val, depth = 0): Entry[] | undefined {
    if (v.k === "obj") return v.e;
    if (v.k !== "unk" || !v.ref) return undefined;
    const got = this.expr(v.ref.m, v.ref.n, v.ref.env, depth);
    return got?.length ? got : undefined;
  }

  /**
   * Resolve spreads and the values that hold objects. A value left unknown loses its place in the
   * program, so that no later step reads it again.
   */
  pin(entries: Entry[], depth = 0): Entry[] {
    return this.spreads(entries, depth).map((e) => {
      if (!("key" in e)) return e;
      const inner = depth < 8 ? this.objectValue(e.val, depth) : undefined;
      if (inner)
        return {
          ...e,
          val: {
            k: "obj",
            e: this.pin(inner, depth + 1),
            ...(e.val.k === "obj" && e.val.open && { open: true }),
          },
        };
      // It keeps its types, which are worked out while its place is known.
      return e.val.k === "unk"
        ? {
            ...e,
            val: {
              k: "unk",
              text: e.val.text,
              t: this.typeOfVal(e.val) ?? null,
            },
          }
        : e;
    });
  }
}
