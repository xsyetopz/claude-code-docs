// Disk cache for fetched files. Layout under the root:
//   site/llms-manifest.json, site/llms.txt, site/pages/<route>.md, site/schemas/<name>.json
//   platform/llms.txt, platform/pages/<path>.md
//   code/llms.txt, code/pages/<path>.md
//   anthropic/sitemap.xml, anthropic/pages/<path>.html
// Every body file has a sibling <file>.meta.json. Writes are atomic (temp file, then rename).
// If the folder cannot be written, the cache lives in memory only.
import { createHash } from "node:crypto";
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve, sep } from "node:path";

export type Meta = {
  url: string;
  etag?: string;
  lastModified?: string;
  fetchedAt: string;
  status: 200;
  bytes: number;
  sha256: string;
};

export type Cached = { body: string; meta: Meta | undefined };

export const CACHE_CAP_BYTES = 60 * 1024 * 1024;

/** Total cache cap. CLAWDIPEDIA_CACHE_CAP_BYTES overrides it (a user setting; tests also use it). */
const capBytes = (): number => {
  const n = Number(process.env["CLAWDIPEDIA_CACHE_CAP_BYTES"]);
  return process.env["CLAWDIPEDIA_CACHE_CAP_BYTES"] !== undefined &&
    Number.isFinite(n) &&
    n >= 0
    ? n
    : CACHE_CAP_BYTES;
};

/** Cache root, first match wins: CLAWDIPEDIA_CACHE_DIR, ${CLAUDE_PLUGIN_DATA}/cache, then the XDG cache dir. */
export const cacheRoot = (): string => {
  const env = process.env;
  if (env["CLAWDIPEDIA_CACHE_DIR"])
    return resolve(env["CLAWDIPEDIA_CACHE_DIR"]);
  if (env["CLAUDE_PLUGIN_DATA"])
    return resolve(env["CLAUDE_PLUGIN_DATA"], "cache");
  return join(
    env["XDG_CACHE_HOME"] || join(homedir(), ".cache"),
    "clawdipedia",
  );
};

/** Joins and checks that the result stays inside base. Returns undefined otherwise. */
export const inside = (
  base: string,
  ...parts: string[]
): string | undefined => {
  const root = resolve(base);
  const p = resolve(root, ...parts);
  return p.startsWith(root + sep) ? p : undefined;
};

const sha = (b: Buffer | string): string =>
  createHash("sha256").update(b).digest("hex");

const isMeta = (m: unknown): m is Meta => {
  if (typeof m !== "object" || m === null) return false;
  const o = m as Record<string, unknown>;
  return (
    typeof o["url"] === "string" &&
    typeof o["fetchedAt"] === "string" &&
    typeof o["bytes"] === "number" &&
    typeof o["sha256"] === "string"
  );
};

/** Files pruned first to last when the cache is over the cap. Index files are never pruned. */
const pruneRank = (relPath: string): number => {
  const rel = relPath.replaceAll("\\", "/");
  if (
    rel.startsWith("platform/pages/") ||
    rel.startsWith("code/pages/") ||
    rel.startsWith("anthropic/pages/")
  )
    return 0;
  if (rel.startsWith("site/pages/") || rel.startsWith("site/schemas/"))
    return 1;
  return 2;
};

export class DiskCache {
  private root: string;
  private memory: Map<string, Cached> | undefined;
  private approx: number | undefined;

  constructor(root = cacheRoot()) {
    this.root = root;
    try {
      mkdirSync(root, { recursive: true });
      const probe = join(root, `.probe.${process.pid}`);
      writeFileSync(probe, "");
      rmSync(probe);
    } catch {
      this.memory = new Map();
    }
  }

  private file(rel: string): string | undefined {
    return inside(this.root, rel);
  }

  /** The cached body, or undefined for a miss. A corrupt entry is deleted and counts as a miss. */
  get(rel: string): Cached | undefined {
    if (this.memory) return this.memory.get(rel);
    const file = this.file(rel);
    if (!file) return undefined;
    let buf: Buffer;
    try {
      buf = readFileSync(file);
    } catch {
      return undefined;
    }
    let meta: Meta | undefined;
    try {
      const m: unknown = JSON.parse(readFileSync(`${file}.meta.json`, "utf8"));
      if (!isMeta(m)) throw new Error("bad meta");
      meta = m;
    } catch {
      // A body without a valid meta stays usable but has no validators.
      meta = undefined;
    }
    if (meta && (buf.length !== meta.bytes || sha(buf) !== meta.sha256)) {
      this.delete(rel);
      return undefined;
    }
    return { body: buf.toString("utf8"), meta };
  }

  /** Replaces body and meta. Never throws. */
  put(
    rel: string,
    body: string,
    v: { url: string; etag?: string; lastModified?: string },
  ): void {
    const buf = Buffer.from(body, "utf8");
    const meta: Meta = {
      url: v.url,
      ...(v.etag ? { etag: v.etag } : {}),
      ...(v.lastModified ? { lastModified: v.lastModified } : {}),
      fetchedAt: new Date().toISOString(),
      status: 200,
      bytes: buf.length,
      sha256: sha(buf),
    };
    if (this.memory) {
      this.memory.set(rel, { body, meta });
      this.pruneMemory(rel);
      return;
    }
    const file = this.file(rel);
    if (!file) return;
    try {
      let before = 0;
      try {
        before = statSync(file).size;
      } catch {
        // New file.
      }
      this.atomic(file, buf);
      this.atomic(`${file}.meta.json`, JSON.stringify(meta));
      if (this.approx === undefined) this.approx = this.total();
      else this.approx += buf.length - before;
      if (this.approx > capBytes()) this.prune(rel);
    } catch {
      // A read-only cache only costs the cache.
    }
  }

  /** 304: the body is still good. Only fetchedAt moves. */
  touch(rel: string): void {
    const c = this.get(rel);
    if (!c?.meta) return;
    const meta = { ...c.meta, fetchedAt: new Date().toISOString() };
    if (this.memory) {
      this.memory.set(rel, { body: c.body, meta });
      return;
    }
    const file = this.file(rel);
    if (!file) return;
    try {
      this.atomic(`${file}.meta.json`, JSON.stringify(meta));
    } catch {
      // Ignore.
    }
  }

  delete(rel: string): void {
    if (this.memory) {
      this.memory.delete(rel);
      return;
    }
    const file = this.file(rel);
    if (!file) return;
    try {
      rmSync(file, { force: true });
      rmSync(`${file}.meta.json`, { force: true });
    } catch {
      // Ignore.
    }
  }

  private atomic(file: string, data: Buffer | string): void {
    mkdirSync(dirname(file), { recursive: true });
    const tmp = `${file}.${process.pid}.tmp`;
    try {
      writeFileSync(tmp, data);
      renameSync(tmp, file);
    } catch (e) {
      rmSync(tmp, { force: true });
      throw e;
    }
  }

  private files(): { rel: string; size: number; at: number }[] {
    const out: { rel: string; size: number; at: number }[] = [];
    let names: string[];
    try {
      names = readdirSync(this.root, { recursive: true }) as string[];
    } catch {
      return out;
    }
    for (const rel of names) {
      if (rel.endsWith(".meta.json") || rel.endsWith(".tmp")) continue;
      try {
        const s = statSync(join(this.root, rel));
        if (!s.isFile()) continue;
        let at = s.mtimeMs;
        try {
          at = Date.parse(
            (
              JSON.parse(
                readFileSync(join(this.root, `${rel}.meta.json`), "utf8"),
              ) as Meta
            ).fetchedAt,
          );
        } catch {
          // Use mtime.
        }
        out.push({ rel, size: s.size, at });
      } catch {
        // Gone already.
      }
    }
    return out;
  }

  private total(): number {
    return this.files().reduce((n, f) => n + f.size, 0);
  }

  /** Same rules as prune(), for the in-memory fallback. */
  private pruneMemory(keep: string): void {
    const mem = this.memory;
    if (!mem) return;
    const all = [...mem].map(([rel, c]) => ({
      rel,
      size: Buffer.byteLength(c.body),
      at: c.meta ? Date.parse(c.meta.fetchedAt) : 0,
    }));
    let size = all.reduce((n, f) => n + f.size, 0);
    const victims = all
      .filter((f) => pruneRank(f.rel) < 2 && f.rel !== keep)
      .sort((a, b) => pruneRank(a.rel) - pruneRank(b.rel) || a.at - b.at);
    for (const f of victims) {
      if (size <= capBytes()) break;
      mem.delete(f.rel);
      size -= f.size;
    }
  }

  /** Deletes the least recently fetched files (pages of platform, code, and anthropic first, then site pages) until under the cap. */
  private prune(keep: string): void {
    const all = this.files();
    let size = all.reduce((n, f) => n + f.size, 0);
    const victims = all
      .filter((f) => pruneRank(f.rel) < 2 && f.rel !== keep)
      .sort((a, b) => pruneRank(a.rel) - pruneRank(b.rel) || a.at - b.at);
    for (const f of victims) {
      if (size <= capBytes()) break;
      this.delete(f.rel);
      size -= f.size;
    }
    this.approx = size;
  }
}
