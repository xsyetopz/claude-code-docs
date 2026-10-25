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

import { children, type Node } from "./ast-node.ts";

export {
  type Call,
  type CallNode,
  callsOf,
  constString,
  functionOf,
  nameOf,
  returnsOf,
} from "./ast-calls.ts";
export { children, type Fn, isFn, type Node } from "./ast-node.ts";

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
    if (this.#exports) return this.#exports;
    const out = new Map<string, string>();
    this.#exports = out;
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

  #exports?: Map<string, string>;
  #imports?: Map<string, ES.ImportDeclaration[]>;

  /** The import declarations of this module from the module path `source`. */
  importsFrom(source: string): ES.ImportDeclaration[] {
    if (!this.#imports) {
      this.#imports = new Map();
      for (const s of (this.ast as ES.Program).body)
        if (s.type === "ImportDeclaration") {
          const k = String(s.source.value);
          this.#imports.set(k, [...(this.#imports.get(k) ?? []), s]);
        }
    }
    return this.#imports.get(source) ?? [];
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

  #importers?: Map<string, Module[]>;

  /** The modules whose text names the chunk `name` as `"/$bunfs/root/<name>"`, indexed on first use. */
  importersOf(name: string): Module[] {
    if (!this.#importers) {
      this.#importers = new Map();
      const re = /"\/\$bunfs\/root\/([^"]+)"/g;
      for (const m of this.modules.values())
        for (const n of new Set(
          Array.from(m.text.matchAll(re), (x) => x[1] as string),
        ))
          this.#importers.set(n, [...(this.#importers.get(n) ?? []), m]);
    }
    return this.#importers.get(name) ?? [];
  }

  /** The local variables in other modules that import the top-level `v` of `m`. */
  importers(m: Module, v: Variable): { module: Module; variable: Variable }[] {
    const names = [...m.exports]
      .filter(([, l]) => l === v.name)
      .map(([e]) => e);
    if (names.length === 0) return [];
    const out: { module: Module; variable: Variable }[] = [];
    for (const other of this.importersOf(m.name)) {
      if (other === m) continue;
      for (const s of other.importsFrom(ROOT + m.name)) {
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
