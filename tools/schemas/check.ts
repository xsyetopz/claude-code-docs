// Usage: bun tools/schemas/check.ts   (also: bun run schemas:check, part of verify)
// Uses ajv (draft 2020-12, strict mode; only our own x-managed-only marker is declared).
// 1. Every schemas/*.json is a well-formed JSON Schema with the expected $id, and every file in FILES exists.
// 2. For each kind, fixtures/<kind>.good.json validates and fixtures/<kind>.bad.json is rejected.
//    A file made only of $defs (tools, control protocol, stream-json) has no root to validate against, so its
//    fixture names the definition: { "$def": "BashInput", "value": { ... } }.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { BASE_URL, CODE_FILES, FILES } from "./build.ts";

const ROOT = join(import.meta.dir, "..", "..");
const ajv = new Ajv2020({ strict: true, strictTypes: false, allErrors: true });
addFormats(ajv);
// zod emits these two non-standard formats for startsWith()/endsWith() checks. Declared so strict mode accepts them; they are not enforced.
for (const f of ["starts_with", "ends_with"]) ajv.addFormat(f, true);
ajv.addKeyword({ keyword: "x-managed-only", schemaType: "boolean" });
// Who sends a control-protocol message: client, agent, or both.
ajv.addKeyword({ keyword: "x-direction", schemaType: "string" });
// Markers of the schemas that code.ts writes: a type the code does not show, a key a probe saw,
// the OpenTelemetry signal kind, and a ~/.claude.json key a person may set.
for (const keyword of ["x-unverified", "x-observed", "x-user-settable"])
  ajv.addKeyword({ keyword, schemaType: "boolean" });
ajv.addKeyword({ keyword: "x-otel-kind", schemaType: "string" });
const NAMES = [...Object.keys(FILES), ...CODE_FILES];
const problems: string[] = [];
const read = (p: string) =>
  JSON.parse(readFileSync(p, "utf8")) as Record<string, unknown>;

for (const name of NAMES) {
  const file = join(ROOT, "schemas", name);
  if (!existsSync(file)) {
    problems.push(`schemas/${name}: missing (run "bun run schemas")`);
    continue;
  }
  const schema = read(file);
  if (schema["$id"] !== `${BASE_URL}/${name}`)
    problems.push(`schemas/${name}: wrong $id ${String(schema["$id"])}`);
  if (
    typeof schema["title"] !== "string" ||
    typeof schema["$comment"] !== "string"
  )
    problems.push(`schemas/${name}: title or $comment missing`);
  let check: ReturnType<typeof ajv.compile> | undefined;
  try {
    check = ajv.compile(schema);
  } catch (e) {
    problems.push(
      `schemas/${name}: not a valid schema: ${(e as Error).message}`,
    );
    continue;
  }
  const kind = name.replace(/\.json$/, "");
  // <kind>.good.json must validate; every <kind>.bad*.json must be rejected.
  const dir = join(import.meta.dir, "fixtures");
  const names = readdirSync(dir).filter((f) => f.startsWith(`${kind}.`));
  if (!names.includes(`${kind}.good.json`))
    problems.push(`fixtures/${kind}.good.json: missing`);
  if (!names.some((f) => f.startsWith(`${kind}.bad`)))
    problems.push(`fixtures/${kind}.bad.json: missing`);
  for (const f of names) {
    const wantValid = f === `${kind}.good.json`;
    if (!wantValid && !f.startsWith(`${kind}.bad`)) continue;
    const fixture = read(join(dir, f));
    let run: ReturnType<typeof ajv.compile> | undefined = check;
    let value: unknown = fixture;
    if (typeof fixture["$def"] === "string") {
      run = ajv.getSchema(`${String(schema["$id"])}#/$defs/${fixture["$def"]}`);
      value = fixture["value"];
      if (!run) {
        problems.push(`fixtures/${f}: no definition ${fixture["$def"]}`);
        continue;
      }
    }
    const errs = run(value)
      ? []
      : (run.errors ?? []).map((e) => `${e.instancePath || "/"} ${e.message}`);
    if (wantValid && errs.length)
      problems.push(
        `fixtures/${f} should be valid: ${errs.slice(0, 3).join("; ")}`,
      );
    if (!wantValid && !errs.length)
      problems.push(`fixtures/${f} should be rejected but is valid`);
  }
}

if (problems.length) {
  for (const p of problems) console.error(`schemas:check: ${p}`);
  process.exit(1);
}
console.log(`schemas:check: ${NAMES.length} schemas valid, fixtures behave`);
