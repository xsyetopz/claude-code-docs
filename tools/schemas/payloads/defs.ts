// Helpers of payloads-build.ts: reference rewriting, definition merging, inlining, and size limits.
import type { Json } from "../build.ts";

export const isObject = (v: unknown): v is Json =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export const REF = /^#\/\$defs\//;

// Rewrites every "#" and "#/$defs/x" reference of one captured schema so it points into the combined document.
export const rewriteRefs = (
  node: unknown,
  own: string,
  prefix: string,
): unknown => {
  if (Array.isArray(node)) return node.map((x) => rewriteRefs(x, own, prefix));
  if (!isObject(node)) return node;
  const out: Json = {};
  for (const [k, v] of Object.entries(node)) {
    if (k === "$ref" && typeof v === "string") {
      out[k] =
        v === "#"
          ? `#/$defs/${own}`
          : REF.test(v)
            ? `#/$defs/${prefix}${v.replace(REF, "")}`
            : v;
    } else {
      out[k] = rewriteRefs(v, own, prefix);
    }
  }
  return out;
};

export const dropMeta = (schema: Json): Json => {
  const { $schema: _s, ...rest } = schema;
  void _s;
  return rest;
};

/** Adds one captured schema to `defs` under `name`; its own $defs move up as `<name>__<local name>`. */
export const addDef = (
  defs: Json,
  name: string,
  schema: Json,
  prefix = `${name}__`,
) => {
  if (name in defs) throw new Error(`duplicate definition "${name}"`);
  const { $defs, ...body } = dropMeta(schema);
  defs[name] = rewriteRefs(body, name, prefix);
  if (isObject($defs))
    for (const [k, v] of Object.entries($defs))
      defs[`${prefix}${k}`] = rewriteRefs(v, name, prefix);
};

export const usable = (v: unknown): v is Json =>
  isObject(v) && !("x-cc-error" in v) && v["$schema"] !== undefined;

export const need = (raw: Record<string, unknown>, kind: string): Json => {
  const v = raw[kind];
  if (!isObject(v)) throw new Error(`missing raw capture "${kind}"`);
  return v;
};

export const sortDefs = (defs: Json): Json =>
  Object.fromEntries(
    Object.entries(defs).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  );

export const refTarget = (v: unknown): string | null =>
  typeof v === "string" && REF.test(v) ? v.replace(REF, "") : null;

// zod's "ref" mode shares every schema used twice, even a bare string. Put the small and the single-use ones back
// in place, so a property reads as its own type, and keep only the large shared ones (and recursive ones) in $defs.
export const inlineDefs = (schema: Json, maxSmall = 700): Json => {
  const defs = schema["$defs"];
  if (!isObject(defs)) return schema;
  const uses = new Map<string, number>();
  const edges = new Map<string, Set<string>>();
  const scan = (node: unknown, from: string | null) => {
    if (Array.isArray(node)) {
      for (const x of node) scan(x, from);
      return;
    }
    if (!isObject(node)) return;
    for (const [k, v] of Object.entries(node)) {
      const t = k === "$ref" ? refTarget(v) : null;
      if (t !== null) {
        uses.set(t, (uses.get(t) ?? 0) + 1);
        if (from !== null) {
          const set = edges.get(from) ?? new Set<string>();
          set.add(t);
          edges.set(from, set);
        }
      } else {
        scan(v, from);
      }
    }
  };
  const { $defs: _d, ...root } = schema;
  void _d;
  scan(root, null);
  for (const [k, v] of Object.entries(defs)) scan(v, k);
  const recursive = (name: string): boolean => {
    const seen = new Set<string>();
    const stack = [...(edges.get(name) ?? [])];
    while (stack.length) {
      const n = stack.pop() as string;
      if (n === name) return true;
      if (seen.has(n)) continue;
      seen.add(n);
      stack.push(...(edges.get(n) ?? []));
    }
    return false;
  };
  const inlinable = new Set<string>();
  for (const [k, v] of Object.entries(defs))
    if (
      !recursive(k) &&
      ((uses.get(k) ?? 0) <= 1 || JSON.stringify(v).length <= maxSmall)
    )
      inlinable.add(k);
  const expand = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(expand);
    if (!isObject(node)) return node;
    const t = refTarget(node["$ref"]);
    if (t !== null && inlinable.has(t)) {
      const { $ref: _r, ...siblings } = node;
      void _r;
      return { ...(expand(defs[t]) as Json), ...(expand(siblings) as Json) };
    }
    return Object.fromEntries(
      Object.entries(node).map(([k, v]) => [k, expand(v)]),
    );
  };
  const kept = Object.fromEntries(
    Object.entries(defs)
      .filter(([k]) => !inlinable.has(k))
      .map(([k, v]) => [k, expand(v)]),
  );
  return { ...(expand(root) as Json), $defs: kept };
};

// Some payloads carry whole other documents: a control_request holds any control subtype, and a turn_handoff request
// holds transcript messages. The other file has them, so here a part bigger than the limit is replaced by a pointer
// (the node itself stays, only what is below it is checked).
const size = (v: unknown) => JSON.stringify(v).length;
// The sub-schemas of a schema: property values, items, additionalProperties, and union members.
const subSchemas = (schema: Json): Json[] => {
  const out: Json[] = [];
  const props = schema["properties"];
  if (isObject(props)) out.push(...Object.values(props).filter(isObject));
  for (const k of ["items", "additionalProperties"])
    if (isObject(schema[k])) out.push(schema[k] as Json);
  for (const k of ["anyOf", "oneOf", "allOf"])
    if (Array.isArray(schema[k]))
      out.push(...(schema[k] as unknown[]).filter(isObject));
  return out;
};
// A sub-schema over the limit is replaced when none of its own sub-schemas is over the limit; otherwise it is
// kept and its big parts are looked at in turn. The schema passed in is never replaced.
export const omitLarge = (
  schema: Json,
  where: string,
  limit: number,
  top = true,
): Json => {
  if (!top) {
    if (size(schema) <= limit) return schema;
    if (!subSchemas(schema).some((c) => size(c) > limit))
      return {
        description: `Left out for size; the definitions are in ${where}.`,
      };
  }
  const walk = (v: Json) => omitLarge(v, where, limit, false);
  const out: Json = { ...schema };
  if (isObject(schema["properties"]))
    out["properties"] = Object.fromEntries(
      Object.entries(schema["properties"]).map(([k, v]) => [
        k,
        isObject(v) ? walk(v) : v,
      ]),
    );
  for (const k of ["items", "additionalProperties"])
    if (isObject(schema[k])) out[k] = walk(schema[k] as Json);
  for (const k of ["anyOf", "oneOf", "allOf"])
    if (Array.isArray(schema[k]))
      out[k] = (schema[k] as unknown[]).map((x) => (isObject(x) ? walk(x) : x));
  return out;
};
