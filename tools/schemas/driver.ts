// Runs inside the isolated child process started by generate.ts. Not meant to be run by hand.
// Usage: bun driver.ts <tmpRoot> <outFile>
// Imports the patched chunks (which fill globalThis.__ccSchemas), then calls each captured schema's own
// zod v4 toJSONSchema and writes the raw results as JSON.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [root, outFile] = process.argv.slice(2) as [string, string];
const manifest: { modules: string[]; kinds: string[]; refKinds?: string[] } =
  JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));

for (const mod of manifest.modules) await import(join(root, "root", mod));

type Zod = { toJSONSchema(opts: object): unknown };
type Registry = Record<string, () => unknown>;
const registry =
  (globalThis as unknown as { __ccSchemas?: Registry }).__ccSchemas ?? {};
const out: Record<string, unknown> = {};
const lossy: string[] = [];
let current = "";
const isZod = (v: unknown): v is Zod =>
  typeof v === "object" &&
  v !== null &&
  typeof (v as Zod).toJSONSchema === "function";
const convert = (schema: Zod, reused: "inline" | "ref" = "inline") =>
  schema.toJSONSchema({
    target: "draft-2020-12",
    io: "input",
    reused,
    // Types JSON cannot express (undefined, transforms) become {} instead of aborting.
    unrepresentable: (ctx: { path: (string | number)[]; message: string }) => {
      lossy.push(`${current}: /${ctx.path.join("/")} ${ctx.message}`);
      // build.ts drops this marker from unions (an undefined arm means "may be absent"), else it stays {} (any).
      return { "x-cc-unrepresentable": true };
    },
    // The binary's own export drops these defaults too: a catch() fallback is not a documented default.
    override: (ctx: {
      zodSchema: { _zod: { def: { type: string } } };
      jsonSchema: Record<string, unknown>;
    }) => {
      if (ctx.zodSchema._zod.def.type === "catch")
        delete ctx.jsonSchema["default"];
    },
  });
// A capture may be a plain array or object that holds schemas (tool lists, tables): convert each one inside it.
// One schema that cannot be read or converted becomes { "x-cc-error": message } so the rest still come out.
const deep = (v: unknown, reused: "inline" | "ref"): unknown => {
  if (isZod(v)) {
    try {
      return convert(v, reused);
    } catch (e) {
      return { "x-cc-error": String(e).slice(0, 300) };
    }
  }
  if (Array.isArray(v)) return v.map((x) => deep(x, reused));
  if (typeof v === "object" && v !== null)
    return Object.fromEntries(
      Object.entries(v).map(([k, x]) => [k, deep(x, reused)]),
    );
  return v;
};
for (const kind of manifest.kinds) {
  const get = registry[kind];
  if (!get) throw new Error(`schema "${kind}" was not captured`);
  current = kind;
  const value = get();
  const reused = manifest.refKinds?.includes(kind) ? "ref" : "inline";
  out[kind] = isZod(value) ? convert(value, reused) : deep(value, reused);
}
writeFileSync(outFile, JSON.stringify({ schemas: out, lossy }));
process.exit(0);
