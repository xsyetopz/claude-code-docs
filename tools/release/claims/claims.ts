// release:claims - finds version-labelled claims in docs/, maps each to a probe or a kind, writes claims.json.
// Design: openspec/changes/archive/2026-10-21-release-toolkit/design.md, section "Claim Map".
//   bun tools/release/cli.ts claims [--check] [--all] [--to V]
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { readRun } from "../lib/results.ts";
import { LIVE_CASES } from "../probes/live/cases.ts";
import type { Ctx } from "../util.ts";
import { CAPTURES, ROOT, toolEnv, versionDir, writeJson } from "../util.ts";

export type ClaimClass = "change" | "gap" | "info";
/**
 * `hook` (hook events, from diff/hooks.json) and `manual` (program behaviour that no probe checks yet; compare always
 * reports it `not-run`) are additions to the first design list.
 */
export const KINDS = [
  "behaviour",
  "env",
  "flag",
  "command",
  "setting",
  "hook",
  "gate",
  "schema",
  "manual",
  "static",
  "external",
] as const;
export type Kind = (typeof KINDS)[number];
export type Status = "unmapped" | "mapped" | "static";
export type Claim = {
  id: string;
  file: string;
  line: number;
  text: string;
  heading: string;
  class: ClaimClass;
  kind: Kind | null;
  probes: string[];
  status: Status;
  /** names from diff/*.json found in backticks (auto mapping); compare uses them */
  diffNames?: string[];
};
export type MapEntry = { probes: string[]; kind: Kind; note?: string };
export type ClaimMap = Record<string, MapEntry>;

export const MAP_PATH = join(import.meta.dir, "map.json");
const VERSION_RE = /2\.1\.\d+/;
// A phrase before the version, `from` right before it, or `(or|and) later|newer|earlier` right after it.
const CHANGE_RE =
  /\b(?:(?:since|new in|added in|changed in|as of|removed in|dropped in|before|older than)\b.{0,40}?|from\s+[`(]?)2\.1\.\d+|2\.1\.\d+[`)]*\s+(?:or|and)\s+(?:later|newer|earlier)\b/i;
const GAP_RE = /\bnot checked on\b/i;
const DIFF_KIND: Record<string, Kind> = {
  "strings-env.json": "env",
  "flags.json": "flag",
  "commands.json": "command",
  "settings.json": "setting",
  "hooks.json": "hook",
  "gates.json": "gate",
};
// Kinds that name a place to look (diff/*.json, schemas/) or say nothing needs a re-check; only `behaviour` needs a probe.
const NO_PROBE = new Set<Kind>([...Object.values(DIFF_KIND), "schema"]);

export const classify = (text: string): ClaimClass =>
  GAP_RE.test(text) ? "gap" : CHANGE_RE.test(text) ? "change" : "info";

export const normalise = (s: string): string =>
  s.toLowerCase().replace(/\s+/g, " ").trim();

export const slug = (h: string): string =>
  h
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}_ -]/gu, "") // keeps non-ASCII letters; drops backticks and punctuation
    .replace(/ /g, "-"); // one hyphen per space, as github-slugger does ("A — B" -> "a--b")

export const claimId = (file: string, heading: string, text: string): string =>
  `${file}#${slug(heading)}:${createHash("sha1").update(normalise(text)).digest("hex").slice(0, 8)}`;

/** The sentences of a prose line that carry a version. Table rows stay whole. */
const units = (line: string): string[] => {
  const t = line.trim();
  if (t.startsWith("|")) return [t];
  const bare = t.replace(/^(?:[-*+]|\d+\.)\s+/, "");
  return bare
    .split(/(?<=[.!?])\s+(?=[A-Z`"(])/)
    .filter((s) => VERSION_RE.test(s));
};

/**
 * Claims of one file. `hitLines` are 1-based lines that match the version regex (from git grep).
 * Same unit on two lines gets one claim (first line).
 */
export const claimsFromFile = (
  file: string,
  content: string,
  hitLines: number[],
): Claim[] => {
  const lines = content.split("\n");
  // headings and frontmatter, outside code fences
  const headingAt: string[] = [];
  let cur = "";
  let fence: { ch: string; len: number } | null = null;
  const inFence = new Set<number>();
  let front = lines[0]?.trim() === "---";
  const skip = new Set<number>();
  lines.forEach((l, i) => {
    if (front) {
      skip.add(i + 1);
      if (i > 0 && l.trim() === "---") front = false;
    }
    const f = l.match(/^\s*(`{3,}|~{3,})(.*)$/);
    if (f?.[1]) {
      const ch = f[1][0] ?? "`";
      if (!fence) fence = { ch, len: f[1].length };
      else if (ch === fence.ch && f[1].length >= fence.len && !f[2]?.trim())
        fence = null;
      inFence.add(i + 1); // the fence lines themselves
    } else if (fence) inFence.add(i + 1);
    const h = !fence && !front ? l.match(/^#{1,6}\s+(.*)$/) : null;
    if (h?.[1]) cur = h[1].trim();
    headingAt[i] = cur;
  });
  const seen = new Set<string>();
  const out: Claim[] = [];
  for (const n of hitLines) {
    if (skip.has(n) || inFence.has(n)) continue;
    const line = lines[n - 1] ?? "";
    for (const u of units(line)) {
      const heading = headingAt[n - 1] ?? "";
      const id = claimId(file, heading, u);
      if (seen.has(id)) continue;
      seen.add(id);
      out.push({
        id,
        file,
        line: n,
        text: u,
        heading,
        class: classify(u),
        kind: null,
        probes: [],
        status: "unmapped",
      });
    }
  }
  return out;
};

/** `git grep -n -E '2\.1\.[0-9]+' -- docs` as file -> lines. */
const grepHits = (): Map<string, number[]> => {
  const r = Bun.spawnSync(
    ["git", "grep", "-n", "-E", "2\\.1\\.[0-9]+", "--", "docs"],
    { cwd: ROOT, env: toolEnv() },
  );
  const hits = new Map<string, number[]>();
  for (const l of r.stdout.toString().split("\n")) {
    const m = l.match(/^([^:]+):(\d+):/);
    if (!m?.[1] || !m[2]) continue;
    hits.set(m[1], [...(hits.get(m[1]) ?? []), Number(m[2])]);
  }
  return hits;
};

export const findClaims = (): Claim[] => {
  const out: Claim[] = [];
  for (const [file, lines] of [...grepHits()].sort(([a], [b]) =>
    a.localeCompare(b),
  ))
    out.push(
      ...claimsFromFile(file, readFileSync(join(ROOT, file), "utf8"), lines),
    );
  return out;
};

export const readMap = (path = MAP_PATH): ClaimMap =>
  existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};

type DiffNames = Map<string, Kind>; // name -> kind

/** Names in the latest captures/<v>/diff/*.json (the `to` dir when it has one, else the newest). */
export const loadDiffNames = (
  to: string,
  base = CAPTURES,
): DiffNames | null => {
  const dirs = [
    join(base, to, "diff"),
    ...(existsSync(base)
      ? readdirSync(base)
          .filter((n) => /^\d+\.\d+\.\d+$/.test(n))
          .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
          .map((v) => join(base, v, "diff"))
      : []),
  ];
  const dir = dirs.find((d) => existsSync(join(d, "flags.json")));
  if (!dir) return null;
  const names: DiffNames = new Map();
  for (const [f, kind] of Object.entries(DIFF_KIND)) {
    const p = join(dir, f);
    if (!existsSync(p)) continue;
    const j = JSON.parse(readFileSync(p, "utf8")) as {
      items?: Record<string, string>;
    };
    for (const n of Object.keys(j.items ?? {}))
      if (!names.has(n)) names.set(n, kind);
  }
  return names;
};

/** The subject of a table row: the first backticked token in the first cell, with a trailing argument cut off. */
const subject = (text: string): string | null => {
  if (!text.startsWith("|")) return null;
  const cell = text.split(/(?<!\\)\|/)[1] ?? "";
  const m = cell.match(/`([^`]+)`/);
  return m?.[1] ? (m[1].split(/\s/)[0] ?? null) : null;
};

/** Apply map.json, then automatic kinds: a table row whose subject name is in diff/*.json. */
export const applyMap = (
  claims: Claim[],
  map: ClaimMap,
  diff: DiffNames | null,
): Claim[] =>
  claims.map((c) => {
    const subj = subject(c.text);
    const e = map[c.id];
    // diffNames: the row subject, when diff/ has it or map.json gives a diff kind (so compare can look it up without diff/)
    const names =
      subj &&
      (diff?.has(subj) || (e && (NO_PROBE.has(e.kind) || e.kind === "schema")))
        ? [subj]
        : [];
    let kind: Kind | null = null;
    let probes: string[] = [];
    if (e) {
      kind = e.kind;
      probes = e.probes;
    } else if (names.length && diff) {
      kind = diff.get(names[0] ?? "") ?? null;
    }
    let status: Status = "unmapped";
    if (kind === "static" || kind === "external") status = "static";
    else if (kind === "manual") status = "mapped";
    else if (kind && (NO_PROBE.has(kind) || probes.length)) status = "mapped";
    return {
      ...c,
      kind,
      probes,
      status,
      ...(names.length ? { diffNames: names } : {}),
    };
  });

export type Known = {
  ids: Set<string>;
  /** case id -> `claims` the result files declare */
  claims: Map<string, Set<string>>;
  /** false when no result files exist: print, pty and managed ids cannot be checked then */
  fromDisk: boolean;
};

/**
 * Case ids that exist: result files under captures/* plus the live registry (a static list). The print, pty and
 * managed registries build their cases by running, so for those a result file is the cheap source.
 */
export const knownCases = (base = CAPTURES): Known => {
  const k: Known = {
    ids: new Set(LIVE_CASES.map((c) => `live.${c.id}`)),
    claims: new Map(),
    fromDisk: false,
  };
  if (!existsSync(base)) return k;
  // oldest first, so a case's newest capture sets its claims; older ones hold ids since renamed
  const versions = readdirSync(base)
    .filter((n) => /^\d+\.\d+\.\d+$/.test(n))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  for (const v of versions)
    for (const r of readRun(v, base)) {
      k.fromDisk = true;
      k.ids.add(r.id);
      k.claims.set(r.id, new Set(r.claims));
    }
  return k;
};

export type Check = { errors: string[]; warnings: string[] };

export const checkClaims = (
  claims: Claim[],
  map: ClaimMap,
  known: Known,
  all: Claim[] = claims,
): Check => {
  const errors: string[] = [];
  const warnings: string[] = [];
  for (const c of claims)
    if (c.status === "unmapped")
      errors.push(`unmapped: ${c.id} (${c.file}:${c.line})`);
  const live = new Set(all.map((c) => c.id));
  const used = new Set<string>();
  if (!known.fromDisk)
    warnings.push(
      "no result files in captures/: only live.* probe ids are checked (from the live registry)",
    );
  for (const [id, e] of Object.entries(map)) {
    if (!(KINDS as readonly string[]).includes(e.kind))
      errors.push(`map.json: unknown kind "${e.kind}" for ${id}`);
    if (!live.has(id)) warnings.push(`map.json entry has no claim: ${id}`);
    for (const p of e.probes) {
      used.add(p);
      if (!known.ids.has(p) && (known.fromDisk || p.startsWith("live.")))
        warnings.push(`map.json probe not found in any result: ${p} (${id})`);
      const declared = known.claims.get(p);
      if (declared && !declared.has(id))
        warnings.push(`probe ${p} does not list claim ${id} in its claims`);
    }
  }
  // probe-declared claims: ids (they contain `#`) must be current claims that map.json maps back to the case
  for (const [caseId, set] of known.claims)
    for (const c of set) {
      if (!c.includes("#")) continue;
      if (!live.has(c))
        warnings.push(
          `probe ${caseId} lists a claim id that no longer exists: ${c}`,
        );
      else if (!map[c]?.probes.includes(caseId))
        warnings.push(
          `probe ${caseId} lists ${c}, but map.json does not map it to this probe`,
        );
    }
  const unused = [...known.ids].filter((p) => !used.has(p));
  if (unused.length)
    warnings.push(
      `${unused.length} probe case(s) no claim uses${unused.length > 8 ? ` (first 8: ${unused.slice(0, 8).join(", ")})` : `: ${unused.join(", ")}`}`,
    );
  return { errors, warnings };
};

export const runClaims = async (ctx: Ctx): Promise<number> => {
  const check = ctx.rest.includes("--check");
  const all = ctx.rest.includes("--all");
  const to = ctx.to || ctx.from;
  const diff = loadDiffNames(to);
  const found = applyMap(findClaims(), readMap(), diff);
  const claims = all ? found : found.filter((c) => c.class === "change");
  const count = (f: (c: Claim) => string) => {
    const m: Record<string, number> = {};
    for (const c of claims) m[f(c)] = (m[f(c)] ?? 0) + 1;
    return Object.entries(m)
      .map(([k, v]) => `${k} ${v}`)
      .join(", ");
  };
  console.log(
    `release:claims: ${claims.length} claims (${count((c) => c.class)}); status: ${count((c) => c.status)}; kind: ${count((c) => c.kind ?? "none")}`,
  );
  if (!diff) console.log("  no diff/*.json found: automatic kinds skipped");
  if (check) {
    const r = checkClaims(claims, readMap(), knownCases(), found);
    for (const w of r.warnings) console.log(`  warn: ${w}`);
    for (const e of r.errors) console.log(`  FAIL ${e}`);
    console.log(r.errors.length ? "claims check failed" : "claims check ok");
    return r.errors.length ? 1 : 0;
  }
  if (ctx.dry) {
    console.log(`plan: write captures/${to}/claims.json`);
    return 0;
  }
  const path = join(versionDir(to), "claims.json");
  writeJson(
    path,
    claims.map(({ id, file, line, text, kind, probes, status, ...r }) => ({
      id,
      file,
      line,
      text,
      kind,
      probes,
      status,
      class: r.class,
      ...(r.diffNames ? { diffNames: r.diffNames } : {}),
    })),
  );
  console.log(`  wrote ${path}`);
  return 0;
};
