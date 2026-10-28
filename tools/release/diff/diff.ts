// release:diff - surface snapshots (design D4) of the old and new binary, diffed by kind.
// Writes captures/<v>/surface.json for both versions, captures/<to>/diff/<group>.json, and diff/report.md.
// The six files that facts and compare read keep their names (strings-env.json, flags.json, ...).
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, relative } from "node:path";
import {
  docsNames,
  exclusionOf,
  type MapEntry,
  mapOf,
  PAGES,
  status,
} from "../../surface/coverage.ts";
import { serializeCapture, snapshot } from "../../surface/snapshot.ts";
import { type Ctx, ROOT, versionDir, writeJson } from "../util.ts";

import { type ByKind, groups, type Items, itemsOf } from "./diff/groups.ts";

export type { Items };
export { groups, itemsOf };

const LIMIT = 80; // lines per list in report.md; the JSON has everything

export type KindDiff = {
  kind: string;
  from: string;
  to: string;
  fromCount: number;
  toCount: number;
  added: string[];
  removed: string[];
  changed: { name: string; old: string; new: string }[];
  /** added names that no docs page mentions */
  undocumentedAdded: string[];
  /** removed or changed names that docs pages still mention: name -> files */
  inDocs: Record<string, string[]>;
  /** added and changed names -> the page that takes them, from the coverage map */
  pages: Record<string, string>;
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
const needle = (name: string): string =>
  name.startsWith("cli:") ? `claude ${name.slice(4)}` : name;

const loadDocs = (): { file: string; text: string }[] =>
  walk(join(ROOT, "docs")).map((p) => ({
    file: p.slice(ROOT.length + 1),
    text: readFileSync(p, "utf8"),
  }));

/** A detail with the parts that change on every build blanked: chunk hashes and short minified names. */
const stable = (s = "") =>
  s
    .replace(/chunk-[a-z0-9]{8}/g, "chunk-_")
    .replace(/(?<![\w$])[A-Za-z_$][\w$]{0,2}(?=\(|\.|\)|&|;|\}| \(=|$)/g, "_");

export const diffKind = (
  kind: string,
  from: string,
  to: string,
  a: Items,
  b: Items,
  docs: { file: string; text: string }[],
  page: (name: string) => string = () => "",
): KindDiff => {
  const added = [...b.keys()].filter((k) => !a.has(k));
  const removed = [...a.keys()].filter((k) => !b.has(k));
  const changed = [...b]
    .filter(([k, v]) => a.has(k) && stable(a.get(k)) !== stable(v))
    .map(([name, v]) => ({ name, old: a.get(name) ?? "", new: v }));
  const files = (name: string) => {
    const re = new RegExp(
      `(?<![\\w-])${needle(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`,
    );
    return docs.filter((d) => re.test(d.text)).map((d) => d.file);
  };
  const undocumentedAdded = added.filter((n) => files(n).length === 0);
  const inDocs: Record<string, string[]> = {};
  for (const n of [...removed, ...changed.map((c) => c.name)]) {
    const f = files(n);
    if (f.length) inDocs[n] = f;
  }
  const pages: Record<string, string> = {};
  for (const n of [...added, ...changed.map((c) => c.name)]) {
    const p = page(n);
    if (p) pages[n] = p;
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
    pages,
  };
};

/** The page of an item of the new version: its docs table, its map route, its exclusion, or the page of its kind. */
export const pageOf = (
  kind: string,
  name: string,
  docs: Map<string, string>,
  map: Record<string, MapEntry>,
  exclusions: Record<string, string>,
): string => {
  const key = `${kind}:${name}`;
  switch (status(kind, name, { [kind]: docs }, map, exclusions)) {
    case "docs":
      return relative(ROOT, docs.get(name) as string);
    case "mapped": {
      const m = mapOf(key, map) as MapEntry;
      return m.anchor ? `${m.route}#${m.anchor}` : m.route;
    }
    case "excluded":
      return `excluded: ${exclusions[exclusionOf(key, exclusions) as string]}`;
    default: {
      const p = PAGES[kind]?.[0];
      return p && p !== "docs" ? `${p} (no row yet)` : "no page yet";
    }
  }
};

const list = (items: string[], fmt: (s: string) => string): string[] => [
  ...items.slice(0, LIMIT).map(fmt),
  ...(items.length > LIMIT
    ? [`- ... ${items.length - LIMIT} more (see the JSON)`]
    : []),
];

export const renderReport = (
  from: string,
  to: string,
  ds: KindDiff[],
  titles: Record<string, string> = {},
) => {
  const L: string[] = [
    `# Release Diff ${from} -> ${to}`,
    "",
    "Made by `release:diff` from the surface snapshots of both binaries (`captures/<version>/surface.json`).",
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
  const pageOfName = (d: KindDiff, n: string) =>
    d.pages[n] ? ` -> ${d.pages[n]}` : "";
  for (const d of ds) {
    L.push(`## ${titles[d.kind] ?? d.kind}`, "");
    if (!d.added.length && !d.removed.length && !d.changed.length) {
      L.push("No change.", "");
      continue;
    }
    const undoc = new Set(d.undocumentedAdded);
    if (d.added.length)
      L.push(
        `### Added (${d.added.length}; "new" = no docs page mentions it; -> the page that takes it)`,
        "",
        ...list(
          d.added,
          (n) => `- \`${n}\`${undoc.has(n) ? " new" : ""}${pageOfName(d, n)}`,
        ),
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
            `- \`${c.name}\`${docsOf(d, c.name)}${pageOfName(d, c.name)}`,
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

export const runDiff = async (ctx: Ctx): Promise<number> => {
  const { from, to } = ctx;
  if (!to) throw new Error("no --to given and no installed binary found");
  console.log(`release:diff ${from} -> ${to}`);
  if (ctx.dry) {
    console.log(
      `plan: surface snapshots of ${from} and ${to} (written to captures/<v>/surface.json)`,
    );
    console.log(`plan: write captures/${to}/diff/{<kind>.json,report.md}`);
    return 0;
  }
  const load = (v: string): ByKind => {
    const t0 = Date.now();
    const { byKind } = snapshot(v);
    const file = join(versionDir(v), "surface.json");
    mkdirSync(versionDir(v), { recursive: true });
    writeFileSync(file, serializeCapture(v, byKind));
    console.log(`  ${v}: ${file} (${Date.now() - t0} ms)`);
    return byKind;
  };
  const a = load(from);
  const b = from === to ? a : load(to);
  const docs = loadDocs();
  const read = (f: string) =>
    JSON.parse(readFileSync(join(ROOT, "tools", "surface", f), "utf8"));
  const map: Record<string, MapEntry> = read("map.json");
  const exclusions: Record<string, string> = read("exclusions.json");
  const dir = join(versionDir(to), "diff");
  const ds: KindDiff[] = [];
  const titles: Record<string, string> = {};
  for (const g of groups([
    ...new Set([...Object.keys(a), ...Object.keys(b)]),
  ])) {
    const names = Object.fromEntries(
      g.kinds.map(([k]) => [k, docsNames(ROOT, PAGES[k] ?? [])]),
    );
    // a prefixed name maps back to its kind by the prefix
    const page = (n: string) => {
      const [kind, prefix] =
        g.kinds.find(([, p]) => p && n.startsWith(p)) ??
        (g.kinds.find(([, p]) => !p) as [string, string]);
      const docsOfKind = names[kind] as Map<string, string>;
      return pageOf(kind, n.slice(prefix.length), docsOfKind, map, exclusions);
    };
    const items = itemsOf(g, b);
    const d = diffKind(g.key, from, to, itemsOf(g, a), items, docs, page);
    titles[g.key] = g.title;
    ds.push(d);
    writeJson(join(dir, g.file), { ...d, items: Object.fromEntries(items) });
    console.log(
      `  ${g.key}: ${d.fromCount} -> ${d.toCount} (+${d.added.length} -${d.removed.length} ~${d.changed.length})`,
    );
  }
  writeFileSync(join(dir, "report.md"), renderReport(from, to, ds, titles));
  console.log(`  report: ${join(dir, "report.md")}`);
  return 0;
};
