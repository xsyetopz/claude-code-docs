// Cleans a minified module into stable text: each declared name gets a name from its scope position, then `bun fmt`.
// Strings, property names, and export names keep their text, so the same code in two builds prints the same.
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import type { Scope, Variable } from "eslint-scope";
import type { Module, Node } from "./ast.ts";

const hash = (s: string, n = 6): string =>
  createHash("sha1").update(s).digest("hex").slice(0, n);

/** The name of a non-module scope's variable: a letter for its depth, then its order (`a1`, `b2`). */
const localName = (depth: number, i: number): string =>
  `${depth <= 26 ? String.fromCharCode(96 + depth) : `z${depth}_`}${i}`;

const depthOf = (s: Scope): number => {
  let d = 0;
  for (
    let x = s.upper;
    x && x.type !== "module" && x.type !== "global";
    x = x.upper
  )
    d++;
  return d + 1;
};

/** Each variable that a module declares, with the identifier nodes that name it. */
const declared = (m: Module): { v: Variable; s: Scope; ids: Node[] }[] =>
  m.scopes.scopes
    .filter((s) => s.type !== "global")
    .flatMap((s) =>
      s.variables
        .filter((v) => v.defs.length > 0)
        .map((v) => ({
          v,
          s,
          ids: [
            ...new Set([
              ...v.identifiers,
              ...v.references.map((r) => r.identifier),
            ]),
          ] as Node[],
        })),
    );

/** The replacement text for one identifier, keeping shorthand keys and export names. */
const spell = (m: Module, id: Node, old: string, name: string): string => {
  const p = m.parent(id);
  if (p?.type === "ExportSpecifier" && (p.exported as Node).start === id.start)
    return `${name} as ${old}`;
  if (p?.type === "ImportSpecifier" && (p.imported as Node).start === id.start)
    return `${old} as ${name}`;
  const prop =
    p?.type === "AssignmentPattern" && (p.left as Node) === id
      ? m.parent(p)
      : p;
  if (prop?.type === "Property" && prop.shorthand) return `${old}:${name}`;
  return name;
};

/** Renders any range of the module with stable names, before formatting. */
export const renamer = (
  m: Module,
): ((start: number, end: number) => string) => {
  const all = declared(m);
  const names = new Map<Variable, string>();
  const count = new Map<Scope, number>();
  const edits: { id: Node; v: Variable }[] = all
    .flatMap(({ v, ids }) => ids.map((id) => ({ id, v })))
    .sort((a, b) => a.id.start - b.id.start);
  // The text from `start` to `end` with each name spelled by `nameOf`.
  const render = (
    start: number,
    end: number,
    nameOf: (v: Variable) => string,
  ) => {
    let out = "";
    let at = start;
    let lo = 0;
    for (let hi = edits.length; lo < hi; ) {
      const mid = (lo + hi) >> 1;
      if ((edits[mid] as (typeof edits)[number]).id.start < start) lo = mid + 1;
      else hi = mid;
    }
    for (let k = lo; k < edits.length; k++) {
      const { id, v } = edits[k] as (typeof edits)[number];
      if (id.start >= end) break;
      if (id.end > end || id.start < at) continue;
      out += m.text.slice(at, id.start) + spell(m, id, v.name, nameOf(v));
      at = id.end;
    }
    return out + m.text.slice(at, end);
  };
  const outerOf = (v: Variable, s: Scope): Variable | undefined => {
    // `class A {}` declares `A` in the outer scope and again in the class scope, on one node.
    const o = s.type === "class" ? s.upper?.set.get(v.name) : undefined;
    return o?.identifiers.some((id) => v.identifiers.includes(id))
      ? o
      : undefined;
  };
  for (const { v, s } of all)
    if (s.type !== "module" && !outerOf(v, s)) {
      const i = (count.get(s) ?? 0) + 1;
      count.set(s, i);
      names.set(v, localName(depthOf(s), i));
    }
  // A module-level name comes from its declaration with local names in place and module names
  // left out, so it keeps its name when other code moves or the minifier picks other names.
  const taken = new Set<string>();
  for (const { v, s } of all)
    if (s.type === "module") {
      const def = v.defs[0]?.node as Node;
      const base = `$${hash(render(def.start, def.end, (x) => names.get(x) ?? "$"))}`;
      let n = base;
      for (let k = 2; taken.has(n); k++) n = `${base}_${k}`;
      taken.add(n);
      names.set(v, n);
    }
  for (const { v, s } of all) {
    const o = outerOf(v, s);
    if (o) names.set(v, names.get(o) as string);
  }
  return (start, end) => render(start, end, (v) => names.get(v) as string);
};

/** Bun chunk paths renamed by `chunkNames` (old file name to new). */
export const renameChunks = (
  text: string,
  chunkNames?: Map<string, string>,
): string =>
  chunkNames
    ? text.replace(
        /\/\$bunfs\/root\/(chunk-[a-z0-9]+\.js)/g,
        (_, c: string) => `/$bunfs/root/${chunkNames.get(c) ?? c}`,
      )
    : text;

/** The module text with stable names, before formatting. */
export const renameModule = (
  m: Module,
  chunkNames?: Map<string, string>,
): string => renameChunks(renamer(m)(0, m.text.length), chunkNames);

/** Formats JavaScript with `bun fmt`, run outside any project so no config changes it. */
export const format = (js: string): string => {
  const r = Bun.spawnSync(
    [process.execPath, "fmt", "--stdin-filepath=module.js"],
    {
      stdin: Buffer.from(js),
      cwd: tmpdir(),
      env: { PATH: process.env["PATH"] ?? "" },
    },
  );
  if (r.exitCode !== 0)
    throw new Error(`bun fmt failed: ${r.stderr.toString().slice(0, 300)}`);
  return r.stdout.toString();
};

export const cleanModule = (
  m: Module,
  chunkNames?: Map<string, string>,
): string => format(renameModule(m, chunkNames));
