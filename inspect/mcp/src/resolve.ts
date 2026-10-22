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
  | { k: "unk"; text: string; ref?: Ref };
export type Entry =
  | { key: string; opt: boolean; val: Val }
  | { spread: string; opt: boolean; ref?: Ref };

/** A value that is one case of several: an object keeps its keys, every other value becomes unknown. */
const loosen = (v: Val): Val =>
  v.k === "obj"
    ? {
        k: "obj",
        e: v.e.map((x) => ("key" in x ? { ...x, val: loosen(x.val) } : x)),
        open: true,
      }
    : { k: "unk", text: "" };

/** Merge several literals of one thing: a key missing from any of them becomes optional. */
export const mergeEntries = (lists: Entry[][]): Entry[] => {
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
          val: known.k === "obj" ? loosen(known) : unknown,
        });
      } else if (prev.val.k === "str" || prev.val.k === "enum") {
        const v = e.val.k === "str" || e.val.k === "enum" ? e.val.v : null;
        const all = new Set([prev.val.v, v ?? []].flat());
        if (v === null) seen.set(e.key, { ...prev, val: e.val });
        else if (all.size > 1)
          seen.set(e.key, { ...prev, val: { k: "enum", v: [...all] } });
      } else if (prev.val.k === "obj" && e.val.k === "obj")
        seen.set(e.key, {
          ...prev,
          val: {
            k: "obj",
            e: mergeEntries([prev.val.e, e.val.e]),
            ...((prev.val.open || e.val.open) && { open: true }),
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

export class Resolver {
  /** Each time a spread could not be followed, as `<module>@<index>: ...<text>`. */
  readonly unresolved: string[] = [];
  #names = new Map<Node, Entry[] | undefined>();
  #params = new Map<Variable, Entry[] | undefined>();

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
        return a && c ? mergeEntries([a, c]) : undefined;
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
    const merged = [...mergeEntries(lists), ...later];
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
    const merged = mergeEntries(lists);
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
    const inner: Env = new Map();
    const args = call.arguments as Node[];
    const spreadAt = args.findIndex((a) => a.type === "SpreadElement");
    fn.params.forEach((p, i) => {
      if (p.type !== "Identifier" || (spreadAt >= 0 && i >= spreadAt)) return;
      const v = dm.variable(p as Node);
      const a = args[i];
      if (v) inner.set(v, a && !isVoid(a) ? { m, n: a, env } : null);
    });
    const isUndef = (n: Node | null | undefined): boolean => {
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
    return this.pin(mergeEntries(lists), depth + 1);
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
      return e.val.k === "unk"
        ? { ...e, val: { k: "unk", text: e.val.text } }
        : e;
    });
  }
}
