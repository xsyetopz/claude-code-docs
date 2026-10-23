// Usage: bun tools/surface/snapshot.ts [--binary <version|path>] [--commit] [--out <dir>] [--kind <a,b>] [--check]
// Reads one installed Claude Code binary and writes every surface item (design D4), grouped by kind, to
// captures/<version>/surface.json. --commit also writes schemas/surface.json (site version only): the same
// items minus module and offset, sorted by kind and name, so two runs on one binary give the same bytes.
// --check (part of schemas:check) validates the shape and version of schemas/surface.json, and compares it
// with a fresh run only when the binary of the site version is installed.
// --out moves both output folders under <dir>. --kind limits the kinds and cannot be combined with --commit.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join } from "node:path";
import { binaryPath, program } from "../../inspect/mcp/src/binary.ts";
import {
  KINDS,
  type SurfaceItem,
  surface,
} from "../../inspect/mcp/src/surface/index.ts";
import { CLAUDE_CODE_VERSION } from "../../src/version.ts";

const ROOT = join(import.meta.dir, "..", "..");
const WIDTH = 80; // the Biome line width: schemas/surface.json must stay as `biome format` leaves it
const FIELDS = ["name", "default", "values", "gate", "detail"] as const;

/** An item of the committed copy: no kind (the group key), no module, no offset. */
export type CommittedItem = {
  name: string;
  default?: string;
  values?: string[];
  gate?: string;
  detail?: string;
};
export type Committed = {
  version: string;
  kinds: Record<string, CommittedItem[]>;
};

const cmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

const stripped = (i: SurfaceItem): CommittedItem => {
  const out: Record<string, unknown> = {};
  for (const f of FIELDS) if (i[f] !== undefined) out[f] = i[f];
  return out as CommittedItem;
};

/** The committed copy of the items by kind: kinds and items sorted. */
export const committed = (
  version: string,
  byKind: Record<string, SurfaceItem[]>,
): Committed => {
  const kinds: Record<string, CommittedItem[]> = {};
  for (const k of Object.keys(byKind).sort(cmp))
    kinds[k] = (byKind[k] as SurfaceItem[])
      .map(stripped)
      .sort(
        (a, b) =>
          cmp(a.name, b.name) || cmp(JSON.stringify(a), JSON.stringify(b)),
      );
  return { version, kinds };
};

// Biome style: an object or array stays on one line when it fits in WIDTH (with the trailing comma), else one member per line.
const flat = (v: unknown): string => {
  if (Array.isArray(v)) return `[${v.map(flat).join(", ")}]`;
  if (v && typeof v === "object")
    return `{ ${Object.entries(v)
      .map(([k, x]) => `${JSON.stringify(k)}: ${flat(x)}`)
      .join(", ")} }`;
  return JSON.stringify(v);
};
const biome = (v: unknown, pad: number, last: boolean, lead = 0): string => {
  const one = flat(v);
  const sp = " ".repeat(pad);
  if (
    pad + lead + one.length + (last ? 0 : 1) <= WIDTH ||
    typeof v !== "object" ||
    v === null
  )
    return one;
  const rows = Array.isArray(v)
    ? v.map((x, n) => `${sp}  ${biome(x, pad + 2, n === v.length - 1)}`)
    : Object.entries(v).map(([k, x], n, all) => {
        const key = `${JSON.stringify(k)}: `;
        return `${sp}  ${key}${biome(x, pad + 2, n === all.length - 1, key.length)}`;
      });
  return `${Array.isArray(v) ? "[" : "{"}\n${rows.map((r, n) => (n === rows.length - 1 ? r : `${r},`)).join("\n")}\n${sp}${Array.isArray(v) ? "]" : "}"}`;
};

/** The bytes of schemas/surface.json. */
export const serialize = (c: Committed): string => {
  const groups = Object.entries(c.kinds).map(([k, items]) => {
    const rows = items.map(
      (i, n) =>
        `${biome(i, 6, n === items.length - 1)}${n === items.length - 1 ? "" : ","}`,
    );
    return rows.length
      ? `    ${JSON.stringify(k)}: [\n${rows.map((r) => `      ${r}`).join("\n")}\n    ]`
      : `    ${JSON.stringify(k)}: []`;
  });
  return `{\n  "version": ${JSON.stringify(c.version)},\n  "kinds": {\n${groups.join(",\n")}\n  }\n}\n`;
};

/** The bytes of captures/<version>/surface.json: the full items, one per line. */
export const serializeCapture = (
  version: string,
  byKind: Record<string, SurfaceItem[]>,
): string => {
  const kinds = Object.keys(byKind).sort(cmp);
  const groups = kinds.map((k) => {
    const rows = (byKind[k] as SurfaceItem[])
      .map((i) => ({ ...i, version }))
      .sort(
        (a, b) =>
          cmp(a.name, b.name) || cmp(JSON.stringify(a), JSON.stringify(b)),
      )
      .map((i) => JSON.stringify(i));
    return `${JSON.stringify(k)}: [\n${rows.join(",\n")}\n]`;
  });
  return `{\n"version": ${JSON.stringify(version)},\n"kinds": {\n${groups.join(",\n")}\n}\n}\n`;
};

/** Problems with the shape of a parsed schemas/surface.json, or an empty list. */
export const validate = (data: unknown, version: string): string[] => {
  const bad: string[] = [];
  const d = data as Partial<Committed> | null;
  if (!d || typeof d !== "object" || Array.isArray(d)) return ["not an object"];
  if (d.version !== version)
    bad.push(`names version ${String(d.version)}, not ${version}`);
  if (!d.kinds || typeof d.kinds !== "object" || Array.isArray(d.kinds))
    return [...bad, "kinds is not an object"];
  const names = Object.keys(d.kinds);
  for (const k of Object.keys(KINDS))
    if (!names.includes(k)) bad.push(`kind "${k}" missing`);
  for (const k of names) {
    if (!(k in KINDS)) bad.push(`unknown kind "${k}"`);
    const items = d.kinds[k];
    if (!Array.isArray(items) || items.length === 0) {
      bad.push(`kind "${k}" is not a non-empty list`);
      continue;
    }
    let prev = "";
    for (const i of items as unknown[]) {
      const it = i as Record<string, unknown> | null;
      if (
        !it ||
        typeof it !== "object" ||
        typeof it["name"] !== "string" ||
        !it["name"]
      ) {
        bad.push(`${k}: an item has no name`);
        break;
      }
      const extra = Object.keys(it).filter(
        (f) => !(FIELDS as readonly string[]).includes(f),
      );
      if (extra.length)
        bad.push(`${k}:${it["name"]}: unknown field ${extra.join(", ")}`);
      for (const f of ["default", "gate", "detail"])
        if (it[f] !== undefined && typeof it[f] !== "string")
          bad.push(`${k}:${it["name"]}: ${f} is not a string`);
      if (
        it["values"] !== undefined &&
        !(
          Array.isArray(it["values"]) &&
          it["values"].every((v) => typeof v === "string")
        )
      )
        bad.push(`${k}:${it["name"]}: values is not a list of strings`);
      if (cmp(prev, it["name"]) > 0)
        bad.push(`${k}: not sorted at ${it["name"]}`);
      prev = it["name"];
    }
  }
  return bad;
};

const versionsDir = () =>
  process.env["CC_INSPECT_VERSIONS_DIR"] ||
  join(homedir(), ".local/share/claude/versions");

/** The path to name when the binary is missing. */
const wanted = (binary: string) =>
  /^\d+\.\d+\.\d+/.test(binary) ? join(versionsDir(), binary) : binary;

/** Read the binary and give its version and the items by kind. Throws a message that names the missing path. */
export const snapshot = (
  binary: string,
  only?: string[],
): { version: string; byKind: Record<string, SurfaceItem[]> } => {
  try {
    binaryPath(binary);
  } catch {
    throw new Error(`binary not found: ${wanted(binary)}`);
  }
  const kinds = only ?? Object.keys(KINDS);
  for (const k of kinds)
    if (!(k in KINDS))
      throw new Error(
        `unknown kind "${k}"; kinds: ${Object.keys(KINDS).join(", ")}`,
      );
  const { bundle, modules } = program(binary);
  const byKind: Record<string, SurfaceItem[]> = {};
  for (const k of kinds) byKind[k] = surface(bundle, k, modules);
  const version = /^\d+\.\d+\.\d+/.test(binary) ? binary : basename(binary);
  return { version, byKind };
};

const write = (file: string, text: string) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
};

if (import.meta.main) {
  const { parseArgs } = await import("node:util");
  const { values: a } = parseArgs({
    options: {
      binary: { type: "string" },
      commit: { type: "boolean" },
      check: { type: "boolean" },
      out: { type: "string" },
      kind: { type: "string" },
    },
  });
  const out = a.out ?? ROOT;
  const copy = join(out, "schemas", "surface.json");
  if (a.check) {
    if (!existsSync(copy)) {
      console.error('schemas/surface.json: missing (run "bun run surface")');
      process.exit(1);
    }
    const text = readFileSync(copy, "utf8");
    let bad: string[];
    try {
      bad = validate(JSON.parse(text), CLAUDE_CODE_VERSION);
    } catch (e) {
      bad = [`not JSON: ${(e as Error).message}`];
    }
    if (bad.length) {
      for (const p of bad.slice(0, 20))
        console.error(`schemas/surface.json: ${p} (run "bun run surface")`);
      process.exit(1);
    }
    let installed = true;
    try {
      binaryPath(CLAUDE_CODE_VERSION);
    } catch {
      installed = false;
    }
    if (!installed) {
      console.log(
        `schemas/surface.json ok, skipped the comparison with a fresh run (Claude Code ${CLAUDE_CODE_VERSION} is not installed)`,
      );
      process.exit(0);
    }
    const fresh = snapshot(CLAUDE_CODE_VERSION);
    if (serialize(committed(fresh.version, fresh.byKind)) !== text) {
      console.error(
        'schemas/surface.json: differs from a fresh run on the binary (run "bun run surface")',
      );
      process.exit(1);
    }
    console.log("schemas/surface.json ok, same as a fresh run");
    process.exit(0);
  }
  const only = a.kind?.split(",");
  if (a.commit && only) {
    console.error("surface: --kind cannot be combined with --commit");
    process.exit(2);
  }
  try {
    const { version, byKind } = snapshot(a.binary ?? CLAUDE_CODE_VERSION, only);
    if (a.commit && version !== CLAUDE_CODE_VERSION)
      throw new Error(
        `--commit needs the site version ${CLAUDE_CODE_VERSION}, not ${version}`,
      );
    const file = join(out, "captures", version, "surface.json");
    write(file, serializeCapture(version, byKind));
    console.log(
      `${file}: ${Object.values(byKind).reduce((n, l) => n + l.length, 0)} items in ${Object.keys(byKind).length} kinds`,
    );
    if (a.commit) {
      write(copy, serialize(committed(version, byKind)));
      console.log(`${copy} written`);
    }
  } catch (e) {
    console.error(`surface: ${(e as Error).message}`);
    process.exit(1);
  }
}
