// release:diff - strings dumps of the old and new binary, then env, flag, command, setting, hook and gate diffs.
// Writes captures/<to>/diff/{strings-env,flags,commands,settings,hooks,gates}.json and diff/report.md.
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { type Ctx, ROOT, versionDir, writeJson } from "../util.ts";
import { diffJson, gitHead } from "../wrap.ts";
import { type Extracted, extractAll, type Items } from "./extract.ts";
import { dumpStrings } from "./strings.ts";

type Kind = keyof Extracted;
const FILE: Record<Kind, string> = {
  env: "strings-env.json",
  flags: "flags.json",
  commands: "commands.json",
  settings: "settings.json",
  hooks: "hooks.json",
  gates: "gates.json",
};
const TITLE: Record<Kind, string> = {
  env: "Environment variables",
  flags: "CLI flags",
  commands: "Commands (cli:name = subcommand, /name = slash command)",
  settings: "Settings and schema fields",
  hooks: "Hook events",
  gates: "Gates (tengu_ names with a literal default)",
};
const LIMIT = 80; // lines per list in report.md; the JSON has everything

export type KindDiff = {
  kind: Kind;
  from: string;
  to: string;
  fromCount: number;
  toCount: number;
  added: string[];
  removed: string[];
  changed: { name: string; old: string; new: string }[];
  /** where the names came from; the settings kind prefers the generated schema */
  source?: string;
  /** added names that no docs page mentions */
  undocumentedAdded: string[];
  /** removed or changed names that docs pages still mention: name -> files */
  inDocs: Record<string, string[]>;
};

const walk = (dir: string, out: string[] = []): string[] => {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.mdx?$/.test(n)) out.push(p);
  }
  return out;
};

/** Search needle used to look a name up in docs text. */
const needle = (kind: Kind, name: string): string => {
  if (kind !== "commands") return name;
  return name.startsWith("cli:") ? `claude ${name.slice(4)}` : name;
};

const loadDocs = (): { file: string; text: string }[] =>
  walk(join(ROOT, "docs")).map((p) => ({
    file: p.slice(ROOT.length + 1),
    text: readFileSync(p, "utf8"),
  }));

export const diffKind = (
  kind: Kind,
  from: string,
  to: string,
  a: Items,
  b: Items,
  docs: { file: string; text: string }[],
): KindDiff => {
  const added = [...b.keys()].filter((k) => !a.has(k));
  const removed = [...a.keys()].filter((k) => !b.has(k));
  const changed = [...b]
    .filter(([k, v]) => a.has(k) && a.get(k) !== v)
    .map(([name, v]) => ({ name, old: a.get(name) ?? "", new: v }));
  const files = (name: string) => {
    const re = new RegExp(
      `(?<![\\w-])${needle(kind, name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`,
    );
    return docs.filter((d) => re.test(d.text)).map((d) => d.file);
  };
  const undocumentedAdded = added.filter((n) => files(n).length === 0);
  const inDocs: Record<string, string[]> = {};
  for (const n of [...removed, ...changed.map((c) => c.name)]) {
    const f = files(n);
    if (f.length) inDocs[n] = f;
  }
  return {
    kind,
    from,
    to,
    fromCount: a.size,
    toCount: b.size,
    added,
    removed,
    changed,
    undocumentedAdded,
    inDocs,
  };
};

const list = (items: string[], fmt: (s: string) => string): string[] => [
  ...items.slice(0, LIMIT).map(fmt),
  ...(items.length > LIMIT
    ? [`- ... ${items.length - LIMIT} more (see the JSON)`]
    : []),
];

export const renderReport = (from: string, to: string, ds: KindDiff[]) => {
  const L: string[] = [
    `# Release Diff ${from} -> ${to}`,
    "",
    "Made by `release:diff` from `strings -a` of both binaries. Names come from text patterns, so a miss or an extra is possible.",
    "",
    "| Kind | " +
      from +
      " | " +
      to +
      " | Added | Removed | Changed | Added, not in docs |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...ds.map(
      (d) =>
        `| ${d.kind} | ${d.fromCount} | ${d.toCount} | ${d.added.length} | ${d.removed.length} | ${d.changed.length} | ${d.undocumentedAdded.length} |`,
    ),
    "",
  ];
  const docsOf = (d: KindDiff, n: string) => {
    const f = d.inDocs[n];
    return f
      ? ` (docs: ${f.slice(0, 4).join(", ")}${f.length > 4 ? ", ..." : ""})`
      : "";
  };
  for (const d of ds) {
    L.push(`## ${TITLE[d.kind]}`, "");
    if (d.source) L.push(`Source: ${d.source}.`, "");
    if (!d.added.length && !d.removed.length && !d.changed.length) {
      L.push("No change.", "");
      continue;
    }
    const undoc = new Set(d.undocumentedAdded);
    if (d.added.length)
      L.push(
        `### Added (${d.added.length}; "new" = no docs page mentions it)`,
        "",
        ...list(d.added, (n) => `- \`${n}\`${undoc.has(n) ? " new" : ""}`),
        "",
      );
    if (d.removed.length)
      L.push(
        `### Removed (${d.removed.length})`,
        "",
        ...list(d.removed, (n) => `- \`${n}\`${docsOf(d, n)}`),
        "",
      );
    if (d.changed.length)
      L.push(
        `### Changed (${d.changed.length})`,
        "",
        ...d.changed
          .slice(0, LIMIT)
          .flatMap((c) => [
            `- \`${c.name}\`${docsOf(d, c.name)}`,
            `  - old: ${c.old || "(empty)"}`,
            `  - new: ${c.new || "(empty)"}`,
          ]),
        ...(d.changed.length > LIMIT
          ? [`- ... ${d.changed.length - LIMIT} more (see the JSON)`]
          : []),
        "",
      );
  }
  const touched = new Set(ds.flatMap((d) => Object.values(d.inDocs).flat()));
  L.push(
    "## Docs Pages Touched by Removed or Changed Names",
    "",
    ...(touched.size ? [...touched].sort().map((f) => `- ${f}`) : ["None."]),
    "",
  );
  return L.join("\n");
};

const SETTINGS_SCHEMA = "schemas/claude-code-settings.json";

/**
 * Settings keys from the generated schema: git HEAD (old) against the working tree (new, after release:schemas).
 * Only used when release:schemas has run for this --to; otherwise the strings fallback is used.
 */
const settingsFromSchema = (to: string): { a: Items; b: Items } | null => {
  const marker = join(versionDir(to), "schemas-diff.json");
  if (!existsSync(marker)) return null;
  if (JSON.parse(readFileSync(marker, "utf8")).to !== to) return null;
  const oldText = gitHead(SETTINGS_SCHEMA);
  const path = join(ROOT, SETTINGS_SCHEMA);
  if (!oldText || !existsSync(path)) return null;
  const props = (text: string): Items =>
    new Map(
      Object.entries(JSON.parse(text).properties ?? {}).map(([k, v]) => [
        k,
        JSON.stringify(v),
      ]),
    );
  return { a: props(oldText), b: props(readFileSync(path, "utf8")) };
};

/** Replace the full-schema blobs of changed settings with the leaf paths that differ. */
const summariseChanged = (d: KindDiff): void => {
  d.changed = d.changed.map((c) => {
    const x = diffJson(c.old, c.new);
    const parts = [
      ...x.changed.map((y) => `${y.path}: ${y.old} -> ${y.new}`),
      ...x.added.map((p) => `+${p}`),
      ...x.removed.map((p) => `-${p}`),
    ];
    return {
      name: c.name,
      old: "(schema)",
      new: parts.slice(0, 4).join("; ") + (parts.length > 4 ? "; ..." : ""),
    };
  });
};

export const runDiff = async (ctx: Ctx): Promise<number> => {
  const { from, to } = ctx;
  if (!to) throw new Error("no --to given and no installed binary found");
  console.log(`release:diff ${from} -> ${to}`);
  if (ctx.dry) {
    console.log(
      `plan: strings -a for ${from} and ${to} (cached in captures/<v>/strings.txt)`,
    );
    console.log(
      `plan: write captures/${to}/diff/{${Object.values(FILE).join(",")},report.md}`,
    );
    return 0;
  }
  const load = (v: string): Extracted => {
    const t0 = Date.now();
    const path = dumpStrings(v);
    // latin1 keeps one char per byte, so regexes never trip on invalid UTF-8
    const e = extractAll(readFileSync(path, "latin1"));
    console.log(`  ${v}: ${path} (${Date.now() - t0} ms)`);
    return e;
  };
  const a = load(from);
  const b = from === to ? a : load(to);
  const docs = loadDocs();
  const dir = join(versionDir(to), "diff");
  const ds: KindDiff[] = [];
  for (const kind of Object.keys(FILE) as Kind[]) {
    const schema = kind === "settings" ? settingsFromSchema(to) : null;
    // settings: the schema is the source of truth; with `from` === `to` there is nothing to compare
    const d = schema
      ? diffKind(kind, from, to, schema.a, schema.b, docs)
      : diffKind(kind, from, to, a[kind], b[kind], docs);
    if (kind === "settings") {
      d.source = schema
        ? "generated schema (git HEAD vs working tree)"
        : "strings fallback (run release:schemas first for the schema source)";
      if (schema) summariseChanged(d);
    }
    ds.push(d);
    writeJson(join(dir, FILE[kind]), {
      ...d,
      items: Object.fromEntries(
        schema ? [...schema.b.keys()].map((k) => [k, ""]) : b[kind],
      ),
    });
    console.log(
      `  ${kind}: ${d.fromCount} -> ${d.toCount} (+${d.added.length} -${d.removed.length} ~${d.changed.length})`,
    );
  }
  writeFileSync(join(dir, "report.md"), renderReport(from, to, ds));
  console.log(`  report: ${join(dir, "report.md")}`);
  return 0;
};
