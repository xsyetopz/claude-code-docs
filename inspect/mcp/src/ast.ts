// Reads the modules of a bundled program with a real parser (meriyah) and scope analysis (eslint-scope).
// Each module parses on first use. Bun chunks import each other as `/$bunfs/root/<chunk>`; a `Bundle`
// follows those imports, so a name resolves to its declaration in any chunk.
import {
  analyze,
  type Reference,
  type Scope,
  type ScopeManager,
  type Variable,
} from "eslint-scope";
import type * as ES from "estree";
import { parse } from "meriyah";

export type Node = ES.Node & { start: number; end: number };
export type Fn = Node &
  (ES.FunctionDeclaration | ES.FunctionExpression | ES.ArrowFunctionExpression);

const isNode = (x: unknown): x is Node =>
  typeof x === "object" &&
  x !== null &&
  typeof (x as Node).type === "string" &&
  typeof (x as Node).start === "number";

export const isFn = (n: Node | null | undefined): n is Fn =>
  n?.type === "FunctionDeclaration" ||
  n?.type === "FunctionExpression" ||
  n?.type === "ArrowFunctionExpression";

/** The child nodes of `n`, in source order. */
export const children = (n: Node): Node[] => {
  const out: Node[] = [];
  for (const [k, v] of Object.entries(n)) {
    if (k === "loc" || k === "range") continue;
    if (Array.isArray(v)) for (const x of v) isNode(x) && out.push(x);
    else if (isNode(v)) out.push(v);
  }
  return out.sort((a, b) => a.start - b.start);
};

export class Module {
  readonly name: string;
  readonly text: string;
  readonly bundle: Bundle | undefined;
  #ast?: Node;
  #parents = new WeakMap<Node, Node>();
  #scopes?: ScopeManager;
  #refs?: Map<ES.Node, Reference>;

  constructor(name: string, text: string, bundle?: Bundle) {
    this.name = name;
    this.text = text;
    this.bundle = bundle;
  }

  /** The module's syntax tree; it throws when the text is not JavaScript. */
  get ast(): Node {
    if (!this.#ast) {
      this.#ast = parse(this.text, {
        sourceType: "module",
        next: true,
        ranges: true,
      }) as unknown as Node;
      const stack: Node[] = [this.#ast];
      while (stack.length) {
        const n = stack.pop() as Node;
        for (const c of children(n)) {
          this.#parents.set(c, n);
          stack.push(c);
        }
      }
    }
    return this.#ast;
  }

  get scopes(): ScopeManager {
    this.#scopes ??= analyze(this.ast as ES.Program, {
      ecmaVersion: 2026,
      sourceType: "module",
    });
    return this.#scopes;
  }

  parent(n: Node): Node | undefined {
    this.ast;
    return this.#parents.get(n);
  }

  /** The source text of a node. */
  src(n: Node): string {
    return this.text.slice(n.start, n.end);
  }

  /** The innermost node that holds index `pos`. */
  nodeAt(pos: number): Node {
    let n = this.ast;
    for (;;) {
      const next = children(n).find((c) => c.start <= pos && pos < c.end);
      if (!next) return n;
      n = next;
    }
  }

  /** The outermost node of `type` that starts at index `pos`, or undefined. */
  at<T extends Node["type"]>(
    pos: number,
    type: T,
  ): Extract<Node, { type: T }> | undefined {
    let found: Node | undefined;
    for (let n: Node | undefined = this.nodeAt(pos); n; n = this.parent(n))
      if (n.start === pos && n.type === type) found = n;
      else if (n.start !== pos) break;
    return found as Extract<Node, { type: T }> | undefined;
  }

  /** The innermost scope that holds `n`. */
  scopeOf(n: Node): Scope {
    for (let x: Node | undefined = n; x; x = this.parent(x)) {
      // A function's own scope holds its body and parameters, not its name.
      const s = this.scopes.acquire(x, true);
      if (s) return s;
    }
    return this.scopes.globalScope as Scope;
  }

  /** The reference that an identifier in code makes, or undefined for a declaration or a property key. */
  reference(id: Node): Reference | undefined {
    if (!this.#refs) {
      this.#refs = new Map();
      for (const s of this.scopes.scopes)
        for (const r of s.references) this.#refs.set(r.identifier, r);
    }
    return this.#refs.get(id);
  }

  /** The variable an identifier names: the one it refers to, or the one it declares. */
  variable(id: Node): Variable | undefined {
    const r = this.reference(id);
    if (r) return r.resolved ?? undefined;
    if (id.type !== "Identifier") return undefined;
    for (let s: Scope | null = this.scopeOf(id); s; s = s.upper) {
      const v = s.set.get(id.name);
      if (v?.identifiers.includes(id)) return v;
    }
    return undefined;
  }

  /** The variable that `name` means at node `n`, following the scope chain. */
  lookup(n: Node, name: string): Variable | undefined {
    for (let s: Scope | null = this.scopeOf(n); s; s = s.upper) {
      const v = s.set.get(name);
      if (v) return v;
    }
    return undefined;
  }

  /** Module-scope variable named `name`. */
  topLevel(name: string): Variable | undefined {
    const m = this.scopes.globalScope?.childScopes.find(
      (s) => s.type === "module",
    );
    return m?.set.get(name);
  }

  /** Exported name to local name, from `export{a as b}` and `export function`/`export const`. */
  get exports(): Map<string, string> {
    const out = new Map<string, string>();
    for (const s of (this.ast as ES.Program).body) {
      if (s.type !== "ExportNamedDeclaration") continue;
      for (const sp of s.specifiers)
        if (sp.local.type === "Identifier" && sp.exported.type === "Identifier")
          out.set(sp.exported.name, sp.local.name);
      const d = s.declaration;
      if (d?.type === "FunctionDeclaration" && d.id)
        out.set(d.id.name, d.id.name);
      if (d?.type === "VariableDeclaration")
        for (const x of d.declarations)
          if (x.id.type === "Identifier") out.set(x.id.name, x.id.name);
    }
    return out;
  }
}

const ROOT = "/$bunfs/root/";

/** The modules of one program, by file name (`chunk-abc.js`). */
export class Bundle {
  readonly modules = new Map<string, Module>();

  constructor(files: { name: string; text: string }[]) {
    for (const f of files) {
      const name = f.name.split("/").pop() as string;
      this.modules.set(name, new Module(name, f.text, this));
    }
  }

  get(name: string): Module | undefined {
    return this.modules.get(
      name.startsWith(ROOT) ? name.slice(ROOT.length) : name,
    );
  }

  /** Modules whose text names `needle`. */
  withText(needle: string): Module[] {
    return [...this.modules.values()].filter((m) => m.text.includes(needle));
  }

  /**
   * Where an imported binding comes from: the module that exports it and that module's variable.
   * It follows re-exports. Undefined for anything else.
   */
  origin(
    m: Module,
    v: Variable,
    seen = 0,
  ): { module: Module; variable: Variable } | undefined {
    const def = v.defs[0];
    if (def?.type !== "ImportBinding") return { module: m, variable: v };
    if (seen > 8 || def.node.type !== "ImportSpecifier") return undefined;
    const from = this.get(String(def.parent.source.value));
    const imported =
      def.node.imported.type === "Identifier"
        ? def.node.imported.name
        : String(def.node.imported.value);
    const local = from?.exports.get(imported);
    const target = local ? from?.topLevel(local) : undefined;
    return from && target ? this.origin(from, target, seen + 1) : undefined;
  }

  /** The local variables in other modules that import the top-level `v` of `m`. */
  importers(m: Module, v: Variable): { module: Module; variable: Variable }[] {
    const names = [...m.exports]
      .filter(([, l]) => l === v.name)
      .map(([e]) => e);
    if (names.length === 0) return [];
    const out: { module: Module; variable: Variable }[] = [];
    const path = `"${ROOT}${m.name}"`;
    for (const other of this.withText(path)) {
      if (other === m) continue;
      for (const s of (other.ast as ES.Program).body) {
        if (s.type !== "ImportDeclaration" || s.source.value !== ROOT + m.name)
          continue;
        for (const sp of s.specifiers) {
          if (sp.type !== "ImportSpecifier") continue;
          const imported =
            sp.imported.type === "Identifier"
              ? sp.imported.name
              : String(sp.imported.value);
          if (!names.includes(imported)) continue;
          const local = other.topLevel(sp.local.name);
          if (local) out.push({ module: other, variable: local });
        }
      }
    }
    return out;
  }
}

/** The function a callee names: a declaration, or a variable whose only value is a function. */
export const functionOf = (
  m: Module,
  callee: Node,
): { module: Module; fn: Fn } | undefined => {
  if (callee.type !== "Identifier") return undefined;
  const v0 = m.variable(callee);
  const o =
    v0 && (m.bundle ? m.bundle.origin(m, v0) : { module: m, variable: v0 });
  if (!o) return undefined;
  const { module, variable: v } = o;
  for (const d of v.defs) {
    if (d.type === "FunctionName" && isFn(d.node as Node))
      return { module, fn: d.node as Fn };
    if (d.type === "Variable" && isFn(d.node.init as Node | null)) {
      const writes = v.references.filter((r) => r.isWrite());
      if (writes.length <= 1) return { module, fn: d.node.init as Fn };
    }
  }
  // `var f; ... f=function(){}`: one write, of a function.
  const writes = v.references.filter((r) => r.isWrite());
  const w = writes[0]?.writeExpr as Node | null | undefined;
  if (writes.length === 1 && isFn(w)) return { module, fn: w };
  return undefined;
};

/** The variable that names a function: its declaration, `const f=()=>`, or `f=function(){}`. */
export const nameOf = (m: Module, fn: Fn): Variable | undefined => {
  if (fn.type === "FunctionDeclaration" && fn.id)
    return m.variable(fn.id as Node);
  const p = m.parent(fn);
  if (p?.type === "VariableDeclarator" && p.id.type === "Identifier")
    return m.variable(p.id as Node);
  if (p?.type === "AssignmentExpression" && p.left.type === "Identifier")
    return m.variable(p.left as Node);
  return undefined;
};

export type CallNode = Node & ES.CallExpression;
export type Call = { module: Module; call: CallNode };

/**
 * The calls of `fn`, in its module and in every module that imports it. An `undefined` in the list
 * means the function is used as a value somewhere, so not every call is known.
 */
export const callsOf = (m: Module, fn: Fn): (Call | undefined)[] => {
  const v = nameOf(m, fn);
  if (!v) return [undefined];
  const out: (Call | undefined)[] = [];
  const scan = (module: Module, variable: Variable) => {
    for (const r of variable.references) {
      if (r.init || (r.isWrite() && r.writeExpr === fn)) continue;
      const id = r.identifier as Node;
      const p = module.parent(id);
      if (p?.type === "CallExpression" && p.callee === id)
        out.push({ module, call: p as Node & ES.CallExpression });
      else if (p?.type !== "ExportSpecifier") out.push(undefined);
    }
  };
  scan(m, v);
  if (m.bundle)
    for (const i of m.bundle.importers(m, v)) scan(i.module, i.variable);
  return out;
};

/** A string the expression always gives: a literal, or a name bound once to one (followed across imports). */
export const constString = (
  m: Module,
  n: Node | null | undefined,
  depth = 0,
): string | undefined => {
  if (!n || depth > 8) return undefined;
  if (n.type === "Literal" && typeof n.value === "string") return n.value;
  if (n.type === "TemplateLiteral" && n.expressions.length === 0)
    return n.quasis[0]?.value.cooked ?? undefined;
  if (n.type !== "Identifier") return undefined;
  const v0 = m.variable(n);
  const o =
    v0 && (m.bundle ? m.bundle.origin(m, v0) : { module: m, variable: v0 });
  if (!o) return undefined;
  const writes = o.variable.references.filter((r) => r.isWrite());
  const def = o.variable.defs[0];
  const values = [
    ...(def?.type === "Variable" && def.node.init ? [def.node.init] : []),
    ...writes.filter((r) => !r.init).map((r) => r.writeExpr),
  ];
  if (values.length !== 1) return undefined;
  return constString(o.module, values[0] as Node, depth + 1);
};

/** Each `return` value of `fn` (an arrow's expression body counts), not those of nested functions. */
export const returnsOf = (fn: Fn): (Node | null)[] => {
  if (fn.body.type !== "BlockStatement") return [fn.body as Node];
  const out: (Node | null)[] = [];
  const stack: Node[] = [fn.body as Node];
  while (stack.length) {
    const n = stack.pop() as Node;
    if (n.type === "ReturnStatement") out.push((n.argument as Node) ?? null);
    for (const c of children(n))
      if (!isFn(c) && c.type !== "ClassBody") stack.push(c);
  }
  return out.sort((a, b) => (a?.start ?? 0) - (b?.start ?? 0));
};
