// Kind `setting`: the top-level keys of settings.json.
// Anchors (checked on 2.1.309, task 1.1), the same objects that tools/schemas/generate.ts runs:
// 1. The object of zod getters whose `$schema` getter ends in
//    `.describe("JSON Schema reference for Claude Code settings")` (`return{$schema:()=>…,apiKeyHelper:()=>…}`
//    in chunk-0cfgmnxm.js). Each key is a setting; its `.describe("…")` text is the detail.
//    Keys in a conditional spread (`...i.CLAUDE_CODE_ENABLE_XAA&&{xaaIdp:…}`) carry the condition as gate.
// 2. The gated tables `name:{buildGate:()=>…,shape:()=>({key:zod…})}`: each `shape` key is a setting, with
//    the `buildGate` code as its gate (the generator keeps only the tables whose gate is true).
// Compared on 2.1.309 (the old list is the generated schema, not the `strings` heuristic): 194 keys, equal
// to the top-level keys of schemas/claude-code-managed-settings.json. Only here, against
// schemas/claude-code-settings.json (171): 23 keys honored only from managed settings
// (`allowManagedHooksOnly`, `policyHelper`, `requiredMinimumVersion`, ...). None only there.
import type * as ES from "estree";
import { constString, type Module, type Node } from "../ast.ts";
import {
  type Extractor,
  keyOf,
  prop,
  type SurfaceItem,
  scan,
  short,
  unique,
} from "./common.ts";

const ANCHOR = "JSON Schema reference for Claude Code settings";

/** The `.describe("…")` text of the outer zod chain of a getter `()=>z…describe("…").optional()`. */
const describe = (m: Module, n: Node | undefined): string | undefined => {
  let cur = n?.type === "ArrowFunctionExpression" ? (n.body as Node) : n;
  while (
    cur?.type === "CallExpression" &&
    cur.callee.type === "MemberExpression"
  ) {
    const p = cur.callee.property;
    if (p.type === "Identifier" && p.name === "describe")
      return constString(m, cur.arguments[0] as Node | undefined);
    cur = cur.callee.object as Node;
  }
  return undefined;
};

export const extractSettings: Extractor = (bundle) => {
  const out: SurfaceItem[] = [];
  const keys = (m: Module, o: ES.ObjectExpression, gate?: string) => {
    for (const p of o.properties) {
      // `...cond&&{key:…}` and `...cond?{key:…}:{}`: keys behind a condition
      const a = p.type === "SpreadElement" ? (p.argument as Node) : undefined;
      const [cond, obj] =
        a?.type === "LogicalExpression" && a.operator === "&&"
          ? [a.left, a.right]
          : a?.type === "ConditionalExpression"
            ? [a.test, a.consequent]
            : [];
      if (cond && obj?.type === "ObjectExpression")
        keys(m, obj, short(m.src(cond as Node), 120));
      const k = keyOf(p);
      if (!k || p.type !== "Property") continue;
      const d = describe(m, p.value as Node);
      out.push({
        kind: "setting",
        name: k,
        module: m.name,
        offset: (p as unknown as Node).start,
        ...(d && { detail: short(d) }),
        ...(gate && { gate }),
      });
    }
  };
  scan(bundle, [ANCHOR, "buildGate:"], (m, n) => {
    if (n.type !== "ObjectExpression") return;
    const o = n as ES.ObjectExpression;
    if (describe(m, prop(o, "$schema")?.value as Node | undefined) === ANCHOR)
      return keys(m, o);
    const gate = prop(o, "buildGate")?.value as Node | undefined;
    const shape = prop(o, "shape")?.value as Node | undefined;
    // `shape:()=>({…})`
    const body =
      shape?.type === "ArrowFunctionExpression"
        ? (shape.body as Node)
        : undefined;
    if (gate && body?.type === "ObjectExpression")
      keys(
        m,
        body as ES.ObjectExpression,
        `buildGate ${short(m.src(gate), 120)}`,
      );
  });
  return unique(out);
};
