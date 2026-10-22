// Types read by hand from the program's code, for fields the generator leaves "x-unverified". A fixture per
// schema in tools/schemas/manual/ maps a field path (the format of observed.ts) to its type and to anchors:
// strings copied from the program at the code that writes the field. code.ts applies an entry only when every
// anchor is still in the program; then the field gets the type and loses "x-unverified", because the code shows
// it. An entry whose anchor is gone, or whose path is no longer unverified, is stale.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { readFixture, type Seen, typeNames, walkFields } from "./observed.ts";

type Json = Record<string, unknown>;

export type ManualEntry = {
  /** The JSON Schema of every value the program can write here. */
  schema: Json;
  /** Strings copied from the program at the write sites, each found in it as is. */
  anchors: string[];
  /** Where and why: the write sites and how the type follows from them. */
  note: string;
};
export type ManualFixture = {
  $comment: string;
  version: string;
  fields: Record<string, ManualEntry>;
};

export const MANUAL_DIR = join(import.meta.dir, "manual");

export const readManual = (schemaFile: string): ManualFixture | undefined => {
  const p = join(MANUAL_DIR, schemaFile);
  return existsSync(p)
    ? (JSON.parse(readFileSync(p, "utf8")) as ManualFixture)
    : undefined;
};

/** In an anchor, stands for one identifier, because the minifier renames them each release. */
export const ID = "«»";

/** A test of whether an anchor is in `program`, with each `«»` matching one identifier. */
export const anchorIn = (program: string): ((anchor: string) => boolean) => {
  const memo = new Map<string, boolean>();
  return (anchor) => {
    const parts = anchor.split(ID);
    if (parts.length === 1) return program.includes(anchor);
    const known = memo.get(anchor);
    if (known !== undefined) return known;
    const re = new RegExp(
      parts
        .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("[\\w$]+"),
    );
    // Search the longest fixed part, then test the pattern on the text around each hit
    // (an identifier is at most 64 characters).
    const key = parts.reduce((b, p) => (p.length > b.length ? p : b), "");
    if (key.length < 4) return false;
    const i = parts.indexOf(key);
    const left = parts.slice(0, i).join("").length + 64 * i;
    const right = anchor.length + 64 * parts.length;
    let hit = false;
    for (
      let at = program.indexOf(key);
      at !== -1 && !hit;
      at = program.indexOf(key, at + 1)
    )
      hit = re.test(program.slice(Math.max(0, at - left), at + right));
    memo.set(anchor, hit);
    return hit;
  };
};

/** JSON type names a schema allows, or undefined when it allows any (no type, or a $ref). */
const allowed = (s: Json): Set<string> | undefined => {
  const out = new Set<string>();
  const add = (x: Json): boolean => {
    if (Array.isArray(x["anyOf"]) || Array.isArray(x["oneOf"]))
      return ((x["anyOf"] ?? x["oneOf"]) as Json[]).every(add);
    const t = x["type"];
    if (t)
      for (const n of [t].flat() as string[])
        out.add(n === "integer" ? "number" : n);
    else if ("const" in x || Array.isArray(x["enum"]))
      for (const v of "const" in x ? [x["const"]] : (x["enum"] as unknown[]))
        out.add(v === null ? "null" : Array.isArray(v) ? "array" : typeof v);
    else return false;
    return true;
  };
  return add(s) ? out : undefined;
};

/** Types real payloads had at a field that its hand-read schema does not allow. */
export const missedObserved = (schema: Json, seen: Seen): string[] => {
  const ok = allowed(schema);
  return ok ? typeNames(seen).filter((t) => !ok.has(t)) : [];
};

/**
 * Give each "x-unverified" field with a live entry its hand-read type. Works on a copy, because the builders
 * share one `{ "x-unverified": true }` node between fields. `has` tells if a string is in the program. `missed` lists
 * the types real payloads had (tools/schemas/observed/) that the entry does not allow.
 */
export const applyManual = (
  schemaFile: string,
  input: Json,
  has: (s: string) => boolean,
  fx = readManual(schemaFile),
  seen = readFixture(schemaFile)?.fields ?? {},
): { schema: Json; n: number; stale: string[]; missed: string[] } => {
  if (!fx) return { schema: input, n: 0, stale: [], missed: [] };
  const schema = JSON.parse(JSON.stringify(input)) as Json;
  const used = new Set<string>();
  const stale: string[] = [];
  const missed: string[] = [];
  let n = 0;
  walkFields(schema, (path, node) => {
    const e = fx.fields[path];
    if (!e || node["x-unverified"] !== true) return;
    used.add(path);
    const gone = e.anchors.filter((a) => !has(a));
    if (!e.anchors.length || gone.length) {
      stale.push(`${path}: anchor not in the program: ${gone.join(" | ")}`);
      return;
    }
    delete node["x-unverified"];
    Object.assign(node, e.schema);
    n++;
    const miss = seen[path] ? missedObserved(e.schema, seen[path]) : [];
    if (miss.length)
      missed.push(`${path}: real payloads also had ${miss.join(", ")}`);
  });
  for (const p of Object.keys(fx.fields))
    if (!used.has(p)) stale.push(`${p}: no x-unverified field at this path`);
  return { schema, n, stale, missed };
};
