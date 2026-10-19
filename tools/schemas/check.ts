// Usage: bun tools/schemas/check.ts   (also: bun run schemas:check, part of verify)
// Uses ajv (draft 2020-12, strict mode; only our own x-managed-only marker is declared).
// 1. Every schemas/*.json is a well-formed JSON Schema with the expected $id, and all six files exist.
// 2. For each kind, fixtures/<kind>.good.json validates and fixtures/<kind>.bad.json is rejected.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { BASE_URL, FILES } from "./build.ts";

const ROOT = join(import.meta.dir, "..", "..");
const ajv = new Ajv2020({ strict: true, strictTypes: false, allErrors: true });
addFormats(ajv);
// zod emits these two non-standard formats for startsWith()/endsWith() checks. Declared so strict mode accepts them; they are not enforced.
for (const f of ["starts_with", "ends_with"]) ajv.addFormat(f, true);
ajv.addKeyword({ keyword: "x-managed-only", schemaType: "boolean" });
const problems: string[] = [];
const read = (p: string) =>
  JSON.parse(readFileSync(p, "utf8")) as Record<string, unknown>;

for (const name of Object.keys(FILES)) {
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
    const errs = check(read(join(dir, f)))
      ? []
      : (check.errors ?? []).map(
          (e) => `${e.instancePath || "/"} ${e.message}`,
        );
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
console.log(
  `schemas:check: ${Object.keys(FILES).length} schemas valid, fixtures behave`,
);
