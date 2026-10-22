// Result types and I/O: captures/<version>/<group>/<case>.json. Redaction and normalisation live here.
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { claimsForProbe } from "../claims/map.ts";
import { versionDir } from "../util.ts";
import { FAKE_KEY } from "./env.ts";

export type Fact = string | number | boolean | null | string[];
export type CaseResult = {
  schema: 1;
  id: string; // stable across versions, e.g. "print.hooks.posttooluse.edit"
  group: "print" | "pty" | "managed" | "live" | "diff";
  version: string;
  prompt: string;
  args: string[];
  envSet: string[]; // names only
  exit: number | null;
  timedOut: boolean;
  facts: Record<string, Fact>;
  samples?: Record<string, string>;
  /** Earlier program launches of a case that was rerun (timing rerun, or retry of an invalid run), oldest first. The case's own facts are the last launch. */
  attempts?: {
    facts: Record<string, Fact>;
    samples?: Record<string, string>;
  }[];
  requests?: {
    count: number;
    paths: string[];
    betas?: string[];
    bodyKeys?: string[];
  };
  cacheWarm?: boolean;
  claims: string[];
  notes?: string;
};

const SAMPLE_MAX = 3000;
const secrets = new Set<string>();
/** Register a live secret value so redact/writeCase catch it. */
export const registerSecret = (v: string): void => {
  if (v.length >= 8) secrets.add(v);
};

const SECRET_RE = /sk-ant-[A-Za-z0-9_-]+|Bearer\s+[A-Za-z0-9._~+/=-]{8,}/gi;
const isFake = (s: string) => s === FAKE_KEY;

const mapStrings = (v: unknown, f: (s: string) => string): unknown => {
  if (typeof v === "string") return f(v);
  if (Array.isArray(v)) return v.map((x) => mapStrings(x, f));
  if (v && typeof v === "object")
    return Object.fromEntries(
      Object.entries(v).map(([k, x]) => [f(k), mapStrings(x, f)]),
    );
  return v;
};

/** Replace secret-shaped strings (and any registered secret) with <redacted>. The fake key is kept. */
export const redact = <T>(obj: T): T =>
  mapStrings(obj, (s) => {
    let out = s;
    for (const sec of secrets) out = out.split(sec).join("<redacted>");
    return out.replace(SECRET_RE, (m) => (isFake(m) ? m : "<redacted>"));
  }) as T;

const findSecret = (obj: unknown): string | null => {
  let hit: string | null = null;
  mapStrings(obj, (s) => {
    for (const sec of secrets) if (s.includes(sec)) hit ??= "registered secret";
    for (const m of s.matchAll(SECRET_RE))
      if (!isFake(m[0])) hit ??= m[0].slice(0, 12);
    return s;
  });
  return hit;
};

/** Drop what changes between runs: temp paths, request ids, timestamps, uuids, ports, cc_version build suffix. */
export const normalise = <T>(obj: T): T =>
  mapStrings(obj, (s) =>
    s
      .replace(
        /\/(?:private\/)?(?:var\/folders\/[^\s"']*?\/T|tmp)\/ccrel-[A-Za-z0-9]+/g,
        "<TMP>",
      )
      .replace(/\/(?:private\/)?var\/folders\/[^\s"']+/g, "<TMP>")
      // the program's dash-encoded project slug: -private-var-folders-xx-yyyy-T-ccrel-AbC123-proj
      .replace(
        /-(?:private-)?(?:var-folders-[A-Za-z0-9-]+?-T|tmp)-ccrel-[A-Za-z0-9]+/g,
        "<TMP>",
      )
      .replace(
        /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
        "<uuid>",
      )
      // clock times the screen prints ("done 5:02 AM")
      .replace(/\b\d{1,2}:\d{2}\s?[AP]M\b/g, "<time>")
      .replace(/\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?/g, "<ts>")
      .replace(/\b(?:req|msg|toolu)_[A-Za-z0-9]{6,}/g, "<id>")
      .replace(/(127\.0\.0\.1|localhost):\d+/g, "$1:<port>")
      .replace(/(cc_version=\d+\.\d+\.\d+)\.[0-9a-f]+/g, "$1.<build>"),
  ) as T;

/** The build suffix of `cc_version=2.1.305.abc`, kept as its own field. */
export const ccVersion = (
  s: string,
): { version: string; build: string } | null => {
  const m = s.match(/cc_version=(\d+\.\d+\.\d+)(?:\.([0-9a-f]+))?/);
  return m?.[1] ? { version: m[1], build: m[2] ?? "" } : null;
};

/** Run dir for a version (default captures/<version>). `base` is for tests. */
export const openRun = (version: string, base?: string): string => {
  const dir = base ? join(base, version) : versionDir(version);
  mkdirSync(dir, { recursive: true });
  return dir;
};

const ID_RE = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const caseFile = (r: CaseResult): string =>
  `${r.id.startsWith(`${r.group}.`) ? r.id.slice(r.group.length + 1) : r.id}.json`;

/** Adds the map.json claims of the case, normalises samples, then fails the write if any secret-shaped string remains. */
export const writeCase = (runDir: string, r: CaseResult): string => {
  if (!ID_RE.test(r.id) || r.id.includes(".."))
    throw new Error(`bad case id: ${r.id}`);
  const early = findSecret(r);
  if (early)
    throw new Error(
      `refusing to write ${r.id}: secret-shaped string (${early}...)`,
    );
  const samples = r.samples
    ? Object.fromEntries(
        Object.entries(normalise(r.samples)).map(([k, v]) => [
          k,
          v.slice(0, SAMPLE_MAX),
        ]),
      )
    : undefined;
  const claims = [...new Set([...r.claims, ...claimsForProbe(r.id)])];
  const out: CaseResult = { ...r, claims, ...(samples ? { samples } : {}) };
  const hit = findSecret(out);
  if (hit)
    throw new Error(
      `refusing to write ${r.id}: secret-shaped string (${hit}...)`,
    );
  const dir = join(runDir, r.group);
  mkdirSync(dir, { recursive: true });
  const path = join(dir, caseFile(r));
  writeFileSync(path, `${JSON.stringify(out, null, 2)}\n`);
  return path;
};

export const readRun = (version: string, base?: string): CaseResult[] => {
  const dir = base ? join(base, version) : versionDir(version);
  const out: CaseResult[] = [];
  for (const g of ["print", "pty", "managed", "live"]) {
    const d = join(dir, g);
    if (!existsSync(d)) continue;
    for (const f of readdirSync(d).filter((n) => n.endsWith(".json"))) {
      const j = JSON.parse(
        readFileSync(join(d, f), "utf8"),
      ) as Partial<CaseResult>;
      if (j.schema === 1 && j.id) out.push(j as CaseResult);
    }
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
};
