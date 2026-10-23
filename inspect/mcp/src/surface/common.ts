// Shared parts of the surface extractors: the item type, the module scan, and literal readers.
// Each extractor anchors on string literals and object shapes, never on minified names.
import type * as ES from "estree";
import {
  type Bundle,
  children,
  constString,
  type Module,
  type Node,
} from "../ast.ts";
import type { BunModule } from "../bunfs.ts";

/**
 * One functional surface of the program. `module` and `offset` are null for a text fallback (design D2);
 * `offset` alone is null when the source gives the module but no place (`tool`, `otel-event`).
 */
export type SurfaceItem = {
  kind: string;
  name: string;
  module: string | null;
  offset: number | null;
  /** The literal default, or "unknown" when the code computes it. */
  default?: string;
  /** The literal values it takes (an enum), when the code lists them. */
  values?: string[];
  /** The gate it sits behind, as code text. */
  gate?: string;
  /** A short literal detail: a description, a type, a flag spec. */
  detail?: string;
};

/** `files`: all embedded files of the binary, for kinds that read a non-JavaScript asset (`mod-api`). */
export type Extractor = (
  bundle: Bundle,
  files?: Pick<BunModule, "name" | "bytes">[],
) => SurfaceItem[];

/** Visit every node of each module whose text holds one of `needles`. */
export const scan = (
  bundle: Bundle,
  needles: string[],
  visit: (m: Module, n: Node) => void,
): void => {
  for (const m of bundle.modules.values()) {
    if (!needles.some((s) => m.text.includes(s))) continue;
    let ast: Node;
    try {
      ast = m.ast;
    } catch {
      continue; // not JavaScript
    }
    const stack: Node[] = [ast];
    while (stack.length) {
      const n = stack.pop() as Node;
      visit(m, n);
      stack.push(...children(n));
    }
  }
};

/** The key of a non-computed property (identifier or string), or undefined. */
export const keyOf = (
  p: ES.Property | ES.SpreadElement,
): string | undefined => {
  if (p.type !== "Property" || p.computed) return undefined;
  if (p.key.type === "Identifier") return p.key.name;
  if (p.key.type === "Literal" && typeof p.key.value === "string")
    return p.key.value;
  return undefined;
};

/** The property `key` of an object literal. */
export const prop = (
  o: ES.ObjectExpression,
  key: string,
): ES.Property | undefined =>
  o.properties.find((p): p is ES.Property => keyOf(p) === key);

/** The string items of an array literal, or undefined when one item is not a constant string. */
export const strings = (
  m: Module,
  n: Node | null | undefined,
): string[] | undefined => {
  if (n?.type !== "ArrayExpression") return undefined;
  const out: string[] = [];
  for (const el of n.elements as (Node | null)[]) {
    const s = constString(m, el);
    if (s === undefined) return undefined;
    out.push(s);
  }
  return out;
};

/** A literal as short text (`!0` is `true`), or "unknown" for computed code. */
export const literal = (m: Module, n: Node | null | undefined): string => {
  if (!n) return "unknown";
  if (n.type === "Literal") return JSON.stringify((n as ES.Literal).value);
  if (
    n.type === "UnaryExpression" &&
    n.operator === "!" &&
    n.argument.type === "Literal"
  )
    return String(!(n.argument as ES.Literal).value);
  if (
    n.type === "UnaryExpression" &&
    n.operator === "-" &&
    n.argument.type === "Literal"
  )
    return `-${(n.argument as ES.Literal).value}`;
  if (n.type === "Identifier" && n.name === "undefined") return "undefined";
  if (n.type === "UnaryExpression" && n.operator === "void") return "undefined";
  const s = constString(m, n);
  if (s !== undefined) return JSON.stringify(s);
  if (n.type === "ArrayExpression" || n.type === "ObjectExpression") {
    const t = m.src(n);
    return t.length <= 80 ? t : "unknown";
  }
  return "unknown";
};

/** Keep the first item of each name (lowest module and offset); sort by name. */
export const unique = (items: SurfaceItem[]): SurfaceItem[] => {
  const by = new Map<string, SurfaceItem>();
  for (const i of items) {
    const prev = by.get(i.name);
    if (!prev) by.set(i.name, i);
    else
      for (const k of ["default", "values", "gate", "detail"] as const)
        if (prev[k] === undefined && i[k] !== undefined)
          (prev as Record<string, unknown>)[k] = i[k];
  }
  return [...by.values()].sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
  );
};

/** Cut long text, and blank `${name}` parts, whose minified names change on every build. */
export const short = (s: string, n = 200): string => {
  const t = s
    .replace(/\$\{[^}]*\}/g, `\${…}`)
    .replace(/\s+/g, " ")
    .trim();
  return t.length > n ? `${t.slice(0, n)}…` : t;
};
