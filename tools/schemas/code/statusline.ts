// Surface 1: the status line input, from the program's payload builders and the statusline-setup prompt.
import { join } from "node:path";
import { children, type Node } from "../../../inspect/mcp/src/ast.ts";
import { splitTop } from "../jsparse.ts";
import {
  CAPTURES,
  header,
  idx,
  type Json,
  literalAfter,
  markObserved,
  note,
  only,
  props,
  R,
  readJson,
  type Src,
  UNVERIFIED,
  VERSION,
} from "./ctx.ts";
import { objSchema } from "./schema.ts";

type TNode = {
  type?: string;
  comment: string;
  nullable: boolean;
  children?: Map<string, TNode>;
};

/** The JSON template in the statusline-setup agent prompt: type text and comment of each path. */
const parseTemplate = (src: Src): TNode => {
  const start = idx(
    src,
    "The statusLine command will receive the following JSON input via stdin:",
  );
  const lines = src.text.slice(start).split("\n").slice(1);
  const root: TNode = { comment: "", nullable: false, children: new Map() };
  const stack: TNode[] = [root];
  let started = false;
  for (const line of lines) {
    const t = line.trim();
    if (!started) {
      if (t === "{") started = true;
      continue;
    }
    if (t.startsWith("}")) {
      const closed = stack.pop() as TNode;
      if (/\|\s*null/.test(t)) closed.nullable = true;
      if (stack.length === 0) break;
      continue;
    }
    const m = /^"([\w.-]+)":\s*(.*)$/.exec(t);
    if (!m) continue;
    const [value, ...rest] = (m[2] as string).split("//");
    const comment = rest.join("//").trim();
    const v = (value as string).trim().replace(/,$/, "").trim();
    const node: TNode = { comment, nullable: false };
    (stack[stack.length - 1] as TNode).children?.set(m[1] as string, node);
    if (v === "{") {
      node.children = new Map();
      stack.push(node);
    } else node.type = v;
  }
  return root;
};

const templateType = (text: string): Json => {
  const alts = splitTop(text, "|").map((a) => a.trim());
  const one = (a: string): Json | undefined => {
    if (a === '"string"') return { type: "string" };
    if (a === "number") return { type: "number" };
    if (a === "boolean") return { type: "boolean" };
    if (a === "null") return { type: "null" };
    if (a === '["string"]') return { type: "array", items: { type: "string" } };
    if (/^\{ "string": number \}$/.test(a))
      return { type: "object", additionalProperties: { type: "number" } };
    if (/^"[^"]+"$/.test(a)) return { const: a.slice(1, -1) };
    return undefined;
  };
  const parts = alts.map(one);
  if (parts.some((p) => !p)) return { ...UNVERIFIED };
  const ok = parts as Json[];
  if (ok.length === 1) return ok[0] as Json;
  if (ok.every((p) => "const" in p || p["type"] === "null")) {
    const consts = ok.filter((p) => "const" in p).map((p) => p["const"]);
    return ok.some((p) => p["type"] === "null")
      ? { enum: [...consts, null] }
      : { enum: consts };
  }
  return { anyOf: ok };
};

/** Fill types and descriptions from the template, and report paths that only one side has. A template-only key is left out. */
const mergeTemplate = (
  schema: Json,
  node: TNode,
  path: string,
  codeOnly: string[],
  tmplOnly: string[],
) => {
  const viaVariable = schema["x-unverified"] === true;
  delete schema["x-unverified"];
  if (!schema["type"] && !schema["anyOf"]) schema["type"] = "object";
  const p = props(schema);
  for (const [k, child] of node.children ?? []) {
    const at = path ? `${path}.${k}` : k;
    let cur = p[k];
    // The code builds this object from a literal without the key, so the program never sends it.
    if (!cur && !viaVariable) {
      tmplOnly.push(at);
      continue;
    }
    if (!cur) {
      cur = child.children
        ? { type: "object", properties: {} }
        : templateType(child.type ?? "");
      p[k] = cur;
    } else if (!child.children && cur["x-unverified"]) {
      const { "x-observed": obs } = cur;
      cur = {
        ...templateType(child.type ?? ""),
        ...(obs ? { "x-observed": true } : {}),
      };
      p[k] = cur;
    }
    if (child.comment) cur["description"] = child.comment;
    if (child.children) {
      if (child.nullable) {
        const inner: Json = { ...cur };
        delete inner["description"];
        cur = {
          description: child.comment || undefined,
          anyOf: [inner, { type: "null" }],
        };
        p[k] = cur;
        mergeTemplate(inner, child, at, codeOnly, tmplOnly);
      } else mergeTemplate(cur, child, at, codeOnly, tmplOnly);
    }
  }
  for (const k of Object.keys(p)) {
    if (!node.children?.has(k) && node.children && !viaVariable)
      codeOnly.push(path ? `${path}.${k}` : k);
  }
  schema["properties"] = p;
};

export const buildStatusLine = (): { file: string; schema: Json } => {
  const src = only("tengu_status_line_result");
  const main = literalAfter(
    src,
    /return\{\.\.\.[\w$]+\([\w$]+,[\w$]+\),\.\.\.[\w$]+&&\{session_name:/,
  );
  // literalAfter points at the `{` before session_name; the full literal starts at the `return{` before it.
  const retAt = src.text.lastIndexOf("return{", main.at) + "return".length;
  const schema = objSchema(R.objectAt(src, retAt), "plain");
  const tmpl = parseTemplate(src);
  const codeOnly: string[] = [];
  const tmplOnly: string[] = [];
  mergeTemplate(schema, tmpl, "", codeOnly, tmplOnly);

  const probe = readJson(
    join(CAPTURES, "pty/statusline.refresh-interval.json"),
  );
  const seen = ((probe?.["data"] as Json | undefined)?.["stdinKeys"] ??
    []) as string[];
  markObserved(schema, seen);
  for (const k of seen)
    if (!props(schema)[k]) note(`status-line: probe key ${k} not in code`);

  // The subagent panel gets its own payload: the common base plus `columns` and `tasks`.
  const sub = only("subagentStatusLine execution");
  const sm = /\{\.\.\.[\w$]+\([\w$]+,[\w$]+\),columns:[\w$]+,tasks:/.exec(
    sub.text,
  );
  let subDef: Json | undefined;
  if (sm) {
    const subEntries = R.objectAt(sub, sm.index);
    const subSchema = objSchema(subEntries, "plain");
    const tasks = subEntries.find((e) => "key" in e && e.key === "tasks");
    // `tasks: list.map((t) => ({...}))`: the object each item is.
    const item = (n: Node | undefined): Node | undefined =>
      !n
        ? undefined
        : n.type === "ArrowFunctionExpression" &&
            n.body.type === "ObjectExpression"
          ? (n.body as Node)
          : children(n).map(item).find(Boolean);
    const each =
      tasks && "val" in tasks && tasks.val.k === "unk"
        ? item(tasks.val.ref?.n)
        : undefined;
    if (each?.type === "ObjectExpression")
      props(subSchema)["tasks"] = {
        type: "array",
        items: objSchema(R.entries(sub, each), "plain"),
      };
    // The common base is spread from the same builder as the main payload, with two arguments as
    // there: copy the keys that builder sends.
    const baseCall = src.at(retAt + "{...".length, "CallExpression");
    const baseKeys = new Set(
      (baseCall ? (R.call(src, baseCall) ?? []) : []).flatMap((e) =>
        "key" in e ? [e.key] : [],
      ),
    );
    for (const [k, v] of Object.entries(props(schema)))
      if (baseKeys.has(k)) props(subSchema)[k] = v;
    const subSeen = ((
      readJson(join(CAPTURES, "pty/statusline.subagent-tick.json"))?.["data"] as
        | Json
        | undefined
    )?.["stdinKeys"] ?? []) as string[];
    markObserved(subSchema, subSeen);
    subDef = {
      ...subSchema,
      $comment: "Payload of the subagentStatusLine command.",
    };
  }
  if (tmplOnly.length)
    note(
      `status-line: in the prompt template, and the code builds that object from a literal without it: ${tmplOnly.join(", ")}`,
    );
  if (codeOnly.length)
    note(
      `status-line: set by the code but absent from the prompt template: ${codeOnly.join(", ")}`,
    );

  const out: Json = {
    ...header(
      "claude-code-status-line.json",
      "Claude Code status line stdin JSON",
      `For the JSON on stdin of a statusLine command. Generated from Claude Code ${VERSION} by tools/schemas/code.ts. Anchors: the telemetry key "tengu_status_line_result" (module with the builder whose return literal starts at "session_name"), the common base builder it spreads (keys session_id, transcript_path, cwd, scratchpad_dir, prompt_id, permission_mode, agent_id, agent_type, effort), the prompt_cache builder (key "prompt_cache" with "warm"), and "The statusLine command will receive the following JSON input via stdin:" for the types and descriptions the code does not show. Field order is the order in the code.${tmplOnly.length ? ` The prompt also lists ${tmplOnly.join(", ")}, which the code never sets, so ${tmplOnly.length > 1 ? "they are" : "it is"} left out.` : ""}${codeOnly.length ? ` The code sets ${codeOnly.join(", ")}, which the prompt does not list.` : ""} Do not edit by hand.`,
    ),
    ...schema,
    ...(subDef ? { $defs: { subagentStatusLineInput: subDef } } : {}),
  };
  return { file: "claude-code-status-line.json", schema: out };
};
