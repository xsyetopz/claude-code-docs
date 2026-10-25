// Turns the raw captures of tools/schemas/payloads-capture.ts into the bodies of the payload schema files.
// Pieces that zod emits per captured schema (a $schema key, $defs with local names) are folded into one document.
import type { Json } from "./build.ts";

import {
  addDef,
  dropMeta,
  inlineDefs,
  isObject,
  need,
  omitLarge,
  REF,
  refTarget,
  rewriteRefs,
  sortDefs,
  usable,
} from "./payloads-defs.ts";

export { addDef };

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
