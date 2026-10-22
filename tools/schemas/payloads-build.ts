// Turns the raw captures of tools/schemas/payloads-capture.ts into the bodies of the payload schema files.
// Pieces that zod emits per captured schema (a $schema key, $defs with local names) are folded into one document.
import type { Json } from "./build.ts";

const isObject = (v: unknown): v is Json =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const REF = /^#\/\$defs\//;

// Rewrites every "#" and "#/$defs/x" reference of one captured schema so it points into the combined document.
const rewriteRefs = (node: unknown, own: string, prefix: string): unknown => {
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

const dropMeta = (schema: Json): Json => {
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

const usable = (v: unknown): v is Json =>
  isObject(v) && !("x-cc-error" in v) && v["$schema"] !== undefined;

const need = (raw: Record<string, unknown>, kind: string): Json => {
  const v = raw[kind];
  if (!isObject(v)) throw new Error(`missing raw capture "${kind}"`);
  return v;
};

const sortDefs = (defs: Json): Json =>
  Object.fromEntries(
    Object.entries(defs).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  );

// ---- hook output -----------------------------------------------------------------------------------------------

export const hookOutput = (raw: Record<string, unknown>): Json => {
  const sync = dropMeta(need(raw, "hook-output"));
  const props = sync["properties"];
  if (!isObject(props) || !isObject(props["hookSpecificOutput"]))
    throw new Error("hook output has no hookSpecificOutput");
  const union = props["hookSpecificOutput"];
  const arms = union["anyOf"];
  if (!Array.isArray(arms))
    throw new Error("hookSpecificOutput is not a union");
  const defs: Json = {};
  const refs: Json[] = [];
  for (const arm of arms as Json[]) {
    const event = (arm["properties"] as Json | undefined)?.["hookEventName"];
    const name = isObject(event) ? event["const"] : undefined;
    if (typeof name !== "string")
      throw new Error("hookSpecificOutput member without a hookEventName");
    addDef(defs, `${name}HookSpecificOutput`, arm as Json);
    refs.push({ $ref: `#/$defs/${name}HookSpecificOutput` });
  }
  // The arms are told apart by hookEventName, so exactly one matches.
  const { anyOf: _a, ...restUnion } = union;
  void _a;
  addDef(defs, "AsyncHookOutput", need(raw, "hook-output-async"));
  return {
    type: "object",
    ...Object.fromEntries(
      Object.entries(sync).filter(([k]) => k !== "properties"),
    ),
    properties: {
      ...props,
      hookSpecificOutput: { ...restUnion, oneOf: refs },
    },
    $defs: sortDefs(defs),
  };
};

// ---- tools -----------------------------------------------------------------------------------------------------

export type ToolsResult = { body: Json; missing: string[] };
export const tools = (raw: Record<string, unknown>): ToolsResult => {
  const list = raw["tools"];
  if (!Array.isArray(list)) throw new Error('missing raw capture "tools"');
  const defs: Json = {};
  const missing: string[] = [];
  for (const t of list as Json[]) {
    const name = String(t["name"]);
    for (const [key, suffix] of [
      ["inputSchema", "Input"],
      ["outputSchema", "Result"],
    ] as const) {
      const schema = t[key];
      if (usable(schema)) addDef(defs, `${name}${suffix}`, schema);
      else missing.push(`${name}${suffix}`);
    }
  }
  return { body: { $defs: sortDefs(defs) }, missing };
};

// ---- control protocol ------------------------------------------------------------------------------------------

export const control = (raw: Record<string, unknown>): Json => {
  const rows = raw["control"];
  if (!Array.isArray(rows)) throw new Error('missing raw capture "control"');
  const defs: Json = {};
  for (const row of rows as Json[]) {
    const request = omitLarge(
      inlineDefs(row["request"] as Json),
      "claude-code-stream-json.json (userInput and assistantOutput)",
      50_000,
    ) as Json;
    const subtype = (
      (request["properties"] as Json | undefined)?.["subtype"] as
        | Json
        | undefined
    )?.["const"];
    if (typeof subtype !== "string")
      throw new Error("control request without a literal subtype");
    const direction = String(row["originator"]);
    addDef(defs, `${subtype}Request`, request);
    (defs[`${subtype}Request`] as Json)["x-direction"] = direction;
    // A response of null or undefined means the request gets no payload back.
    if (usable(row["response"])) {
      addDef(defs, `${subtype}Response`, inlineDefs(row["response"]));
      (defs[`${subtype}Response`] as Json)["x-direction"] = direction;
    }
  }
  return { $defs: sortDefs(defs) };
};

// ---- stream-json -----------------------------------------------------------------------------------------------

const refTarget = (v: unknown): string | null =>
  typeof v === "string" && REF.test(v) ? v.replace(REF, "") : null;

// zod's "ref" mode shares every schema used twice, even a bare string. Put the small and the single-use ones back
// in place, so a property reads as its own type, and keep only the large shared ones (and recursive ones) in $defs.
const inlineDefs = (schema: Json, maxSmall = 700): Json => {
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

// Walks a union to its object members, following $ref into the schema's own $defs.
const members = (root: Json): Json[] => {
  const local = isObject(root["$defs"]) ? root["$defs"] : {};
  const walk = (n: Json): Json[] => {
    if (typeof n["$ref"] === "string") {
      const target = local[n["$ref"].replace(REF, "")];
      if (!isObject(target)) throw new Error(`dangling ${n["$ref"]}`);
      return walk(target);
    }
    if (Array.isArray(n["anyOf"])) return (n["anyOf"] as Json[]).flatMap(walk);
    return [n];
  };
  return walk(root);
};

const literal = (prop: unknown): string | undefined => {
  if (!isObject(prop)) return undefined;
  if (typeof prop["const"] === "string") return prop["const"];
  const values = prop["enum"];
  if (Array.isArray(values) && values.every((x) => typeof x === "string")) {
    // Several values share one shape: name them by what they have in common (error_a, error_b -> error).
    let common = String(values[0]);
    for (const v of values as string[])
      while (!v.startsWith(common)) common = common.slice(0, -1);
    return common.replace(/_+$/, "") || undefined;
  }
  return undefined;
};

const streamName = (m: Json): string => {
  const props = (m["properties"] as Json | undefined) ?? {};
  const type = literal(props["type"]);
  if (!type) throw new Error("stream member without a literal type");
  const subtype = literal(props["subtype"]);
  return subtype ? `${type}_${subtype}` : type;
};

// Keeps the named definitions and what they reach; shared pieces nothing uses any more are dropped.
const pruneUnreferenced = (defs: Json, named: Set<string>): Json => {
  const keep = new Set<string>(named);
  const stack = [...named];
  const visit = (node: unknown) => {
    if (Array.isArray(node)) {
      for (const x of node) visit(x);
      return;
    }
    if (!isObject(node)) return;
    for (const [k, v] of Object.entries(node)) {
      const t = k === "$ref" ? refTarget(v) : null;
      if (t === null) visit(v);
      else if (!keep.has(t)) {
        keep.add(t);
        stack.push(t);
      }
    }
  };
  while (stack.length) visit(defs[stack.pop() as string]);
  return Object.fromEntries(Object.entries(defs).filter(([k]) => keep.has(k)));
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
const omitLarge = (
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

export const streamJson = (raw: Record<string, unknown>): Json => {
  const defs: Json = {};
  const named = new Set<string>();
  for (const [kind, suffix, shared] of [
    ["stream-out", "Output", "out"],
    ["stream-in", "Input", "in"],
  ] as const) {
    const root = inlineDefs(need(raw, kind));
    const taken = new Map<string, string[]>();
    for (const m of members(root)) {
      let name = streamName(m);
      // Two members with the same type (a user message and its replay): the first property only the second requires.
      const have = taken.get(name);
      if (have) {
        const fresh = ((m["required"] as string[] | undefined) ?? []).filter(
          (k) => !have.includes(k),
        );
        const props = (m["properties"] as Json | undefined) ?? {};
        const extra =
          fresh.find((k) => isObject(props[k]) && "const" in props[k]) ??
          fresh[0];
        name = `${name}_${extra ?? "2"}`;
        if (taken.has(name)) throw new Error(`duplicate stream member ${name}`);
      }
      taken.set(name, (m["required"] as string[] | undefined) ?? []);
      named.add(`${name}${suffix}`);
      const body = name.startsWith("control_re")
        ? omitLarge(
            m,
            "claude-code-control-protocol.json (<subtype>Request and <subtype>Response)",
            200_000,
          )
        : m;
      addDef(defs, `${name}${suffix}`, body, `${shared}_`);
    }
    // Shared pieces zod pulled out of the union.
    const local = root["$defs"];
    if (isObject(local))
      for (const [k, v] of Object.entries(local))
        if (!(`${shared}_${k}` in defs))
          defs[`${shared}_${k}`] = rewriteRefs(v, "", `${shared}_`);
  }
  return { $defs: sortDefs(pruneUnreferenced(defs, named)) };
};

// ---- --agents JSON ---------------------------------------------------------------------------------------------

export const agentsJson = (raw: Record<string, unknown>): Json => {
  const { $defs, ...body } = dropMeta(need(raw, "agents-json"));
  return isObject($defs) ? { ...body, $defs } : body;
};
