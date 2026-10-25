import type * as ES from "estree";

export type Node = ES.Node & { start: number; end: number };
export type Fn = Node &
  (ES.FunctionDeclaration | ES.FunctionExpression | ES.ArrowFunctionExpression);

export const isNode = (x: unknown): x is Node =>
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
