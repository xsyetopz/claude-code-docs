// get_schema: a JSON Schema of the site, or the Mod API type file.
import { SCHEMA_NAMES, TYPE_NAMES } from "./content.ts";
import { content, fail, guarded, ok, type Result } from "./core-shared.ts";
import { type Source, sourceData, sourceLine } from "./fetcher.ts";
import { lookup, outline } from "./types.ts";

type Json = Record<string, unknown>;

const isObj = (v: unknown): v is Json =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Follows a dotted path from a $defs name or the root through properties, then additionalProperties (a map's values), then items ("[]" also works). */
const walk = (schema: Json, path: string): Json | undefined => {
  let cur: Json = schema;
  const keys = path.split(".").filter(Boolean);
  // A file made of definitions (tools, control protocol): the first key may name one.
  const defs = schema["$defs"];
  if (isObj(defs) && keys[0] && Object.hasOwn(defs, keys[0])) {
    const def = defs[keys.shift() as string];
    if (!isObj(def)) return undefined;
    cur = def;
  }
  for (const key of keys) {
    if (key === "__proto__" || key === "constructor" || key === "prototype")
      return undefined;
    const props = cur["properties"];
    let next: unknown;
    if (isObj(props) && Object.hasOwn(props, key)) next = props[key];
    else if (key === "[]") next = cur["items"];
    else next = cur["additionalProperties"] ?? cur["items"];
    if (!isObj(next)) return undefined;
    cur = next;
  }
  return cur;
};

/** One 25k-character chunk of `out`, with a note that gives the next offset. */
const schemaPage = (
  name: string,
  property: string | undefined,
  out: string,
  offset: number,
  source: Source,
): Result => {
  const LIMIT = 25000;
  if (offset >= out.length && out.length > 0)
    return fail(
      `offset ${offset} is past the end (${out.length} characters).`,
      source,
    );
  const chunk = out.slice(offset, offset + LIMIT);
  const end = offset + chunk.length;
  const note =
    end < out.length
      ? `[chars ${offset}-${end} of ${out.length}; call again with offset=${end}]\n`
      : "";
  return ok(
    `${note}${chunk}\n\n${sourceLine(source)}`,
    {
      name,
      ...(property ? { property } : {}),
      offset,
      end,
      total: out.length,
      ...(end < out.length ? { nextOffset: end } : {}),
      text: chunk,
      source: sourceData(source),
    },
    source,
  );
};

export type SchemaArgs = {
  name: string;
  property?: string | undefined;
  offset?: number;
};

export const schema = (args: SchemaArgs): Promise<Result> =>
  guarded(async () => {
    const { name, property, offset = 0 } = args;
    if ((TYPE_NAMES as readonly string[]).includes(name)) {
      const got = await content.typeFile();
      if (got.status === "notfound")
        return fail(`The type file was not found on ${got.origin}.`);
      if (got.status === "error") return fail(got.message);
      if (!property)
        return schemaPage(
          name,
          property,
          outline(got.body),
          offset,
          got.source,
        );
      const found = lookup(got.body, property);
      if (found.kind === "missing")
        return fail(
          `"${property}" is not in the type file, so its fields are unconfirmed for this release.${found.near.length ? ` Closest names in the file: ${found.near.join(", ")}. Look one of them up.` : " Call without `property` for the list of names."}`,
          got.source,
        );
      return schemaPage(
        name,
        property,
        `// ${found.title}\n${found.text}`,
        offset,
        got.source,
      );
    }
    const got = await content.schema(name);
    if (got === "unknown")
      return fail(
        `Unknown schema "${name}". Valid names: ${SCHEMA_NAMES.join(", ")}, types`,
      );
    if (got.status === "notfound")
      return fail(`Schema "${name}" was not found on ${got.origin}.`);
    if (got.status === "error") return fail(got.message);
    const { schema: sch, source } = got;
    let out: string;
    if (property) {
      const sub = walk(sch, property);
      if (!sub) {
        const keys = [
          ...Object.keys((sch["properties"] as Json) ?? {}),
          ...Object.keys((sch["$defs"] as Json) ?? {}),
        ];
        return fail(
          `"${property}" is not in ${name}, so its fields are unconfirmed for this release. Its top-level properties and definitions: ${keys.join(", ")}. Look one of them up.`,
          source,
        );
      }
      out = JSON.stringify(sub, null, 2);
    } else {
      const props = (sch["properties"] ?? {}) as Record<string, Json>;
      const rows = Object.entries(props).map(([k, v]) => {
        const type = Array.isArray(v["type"])
          ? v["type"].join("|")
          : String(v["type"] ?? (v["anyOf"] ? "union" : "any"));
        const first = String(v["description"] ?? "")
          .split(/(?<=\.)\s/)[0]
          ?.slice(0, 140);
        return `- ${k} (${type})${first ? `: ${first}` : ""}`;
      });
      const defs = Object.keys((sch["$defs"] as Json) ?? {});
      const defList = defs.length
        ? `\n\n${defs.length} definitions (pass one as \`property\`): ${defs.join(", ")}`
        : "";
      out = `${String(sch["title"])}\n$id: ${String(sch["$id"])}\n${rows.length} top-level properties. Pass \`property\` for details.\n\n${rows.join("\n")}${defList}`;
    }
    return schemaPage(name, property, out, offset, source);
  });
