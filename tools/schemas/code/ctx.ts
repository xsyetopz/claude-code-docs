// Shared state of the code adapter (code.ts): the arguments, the program bundle, the resolver, the notes,
// and the helpers every surface builder uses.
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join, resolve } from "node:path";
import {
  Bundle,
  type Fn,
  isFn,
  type Module,
  type Node,
} from "../../../inspect/mcp/src/ast.ts";
import { extractModules } from "../../../inspect/mcp/src/bunfs.ts";
import { type Entry, Resolver } from "../../../inspect/mcp/src/resolve.ts";
import { CLAUDE_CODE_VERSION } from "../../../src/version.ts";

export type Json = Record<string, unknown>;
export type Src = Module;

export const ROOT = resolve(import.meta.dir, "../../..");
const BASE_URL = "https://xsyetopz.github.io/clawdipedia/schemas";

export const argv = process.argv.slice(2);
const arg = (name: string): string | undefined => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
};
export const BIN =
  arg("--bin") ??
  join(homedir(), ".local/share/claude/versions", CLAUDE_CODE_VERSION);
export const OUT = arg("--out") ?? join(ROOT, "schemas");
export const VERSION = basename(BIN).match(/^\d+\.\d+\.\d+/)?.[0] ?? "unknown";
export const CAPTURES = arg("--captures") ?? join(ROOT, "captures", VERSION);

export const report: string[] = [];
export const note = (s: string) => report.push(s);

// ---------------------------------------------------------------- program access

export const bundle = new Bundle(
  extractModules(BIN)
    .modules.filter((m) => /\.m?js$/.test(m.name))
    .map((m) => ({ name: m.name, text: m.source })),
);
export const mods: Src[] = [...bundle.modules.values()];
export const R = new Resolver();
/** Modules whose text contains `needle`. */
const withText = (needle: string): Src[] => bundle.withText(needle);
export const only = (needle: string): Src => {
  const hit = withText(needle);
  if (hit.length === 0) throw new Error(`anchor not found: ${needle}`);
  if (hit.length > 1)
    throw new Error(`anchor in ${hit.length} modules: ${needle}`);
  return hit[0] as Src;
};
export const idx = (src: Src, needle: string | RegExp): number => {
  const i =
    typeof needle === "string"
      ? src.text.indexOf(needle)
      : needle.exec(src.text)?.index;
  if (i === undefined || i < 0)
    throw new Error(`anchor not found in ${src.name}: ${needle}`);
  return i;
};
/** Entries of the object literal that starts at the `{` that ends the regex match. */
export const literalAfter = (
  src: Src,
  re: RegExp,
): { entries: Entry[]; at: number } => {
  const m = re.exec(src.text);
  if (!m) throw new Error(`anchor not found in ${src.name}: ${re}`);
  const at = m.index + m[0].length - 1;
  return { entries: R.objectAt(src, at), at };
};
/** The innermost function around index `pos` that passes `test`. */
export const fnAround = (
  src: Src,
  pos: number,
  test: (f: Fn) => boolean,
): Fn | undefined => {
  for (let n: Node | undefined = src.nodeAt(pos); n; n = src.parent(n))
    if (isFn(n) && test(n)) return n;
  return undefined;
};
export const readJson = (path: string): Json | undefined =>
  existsSync(path)
    ? (JSON.parse(readFileSync(path, "utf8")) as Json)
    : undefined;
export const esc = (id: string) => id.replace(/\$/g, "\\$");

// "const": a string literal is the only value; "default": it is the default value; "plain": just a string.
export type Mode = "const" | "default" | "plain";
export const UNVERIFIED: Json = { "x-unverified": true };

export const header = (file: string, title: string, comment: string): Json => ({
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: `${BASE_URL}/${file}`,
  title: `${title} (Claude Code ${VERSION})`,
  $comment: `${comment} A field that is still x-unverified may carry x-observed-type: the JSON types that real payloads had there, from the fixtures in tools/schemas/observed/ (stub probes and local files, no value kept). It is a note, not a check.`,
});

export const props = (s: Json): Record<string, Json> =>
  (s["properties"] ?? {}) as Record<string, Json>;

/** Mark properties named in `keys` as observed, and add the ones the code did not show. */
export const markObserved = (schema: Json, keys: string[]): number => {
  const p = props(schema);
  for (const k of keys)
    p[k] = { ...(p[k] ?? { ...UNVERIFIED }), "x-observed": true };
  schema["properties"] = p;
  return keys.length;
};

export const countProps = (s: unknown): number => {
  if (!s || typeof s !== "object") return 0;
  let n = 0;
  for (const [k, v] of Object.entries(s as Json)) {
    if (k === "properties") {
      for (const sub of Object.values(v as Json)) n += 1 + countProps(sub);
    } else if (k === "$defs") {
      for (const sub of Object.values(v as Json)) n += countProps(sub);
    } else if (v && typeof v === "object") n += countProps(v);
  }
  return n;
};
