// HTTP and cache orchestration. One entry point: getResource().
// Rules: 8 s timeout, size caps, same-origin redirects (max 3), 6 requests at once,
// identical in-flight requests share one promise, conditional requests from cache validators,
// stale cache is served when the network fails, a 404 deletes the cached copy.
import pkg from "../package.json" with { type: "json" };
import { DiskCache } from "./cache.ts";

export const FETCH_TIMEOUT_MS = 8000;
export const MAX_REDIRECTS = 3;
const MAX_CONCURRENT = 6;
const UA = `clawdipedia-docs-mcp/${pkg.version} (+https://github.com/xsyetopz/clawdipedia)`;
const ACCEPT = "text/markdown, text/plain, application/json;q=0.9";

export const MB = 1024 * 1024;

/** TTL multiplier. Test-only: CLAWDIPEDIA_TTL_SCALE=0 makes every cached file stale at once. */
const ttlScale = (): number => {
  const n = Number(process.env["CLAWDIPEDIA_TTL_SCALE"]);
  return process.env["CLAWDIPEDIA_TTL_SCALE"] !== undefined &&
    Number.isFinite(n) &&
    n >= 0
    ? n
    : 1;
};
export const ttl = (ms: number): number => ms * ttlScale();

/** Base URL from an env var. https only; http only for localhost and 127.0.0.1. Else the default. */
export const baseUrl = (envName: string, fallback: string): string => {
  const raw = process.env[envName];
  if (!raw) return fallback;
  try {
    const u = new URL(raw);
    const local = u.hostname === "localhost" || u.hostname === "127.0.0.1";
    if (u.protocol === "https:" || (u.protocol === "http:" && local))
      return raw.replace(/\/+$/, "");
  } catch {
    // Fall through to the default.
  }
  console.error(`clawdipedia-docs: ignoring ${envName} (needs https)`);
  return fallback;
};

export type SourceState = "live" | "cached" | "stale-offline";

export type Source = {
  /** Host, e.g. "clawdipedia.cc". */
  origin: string;
  state: SourceState;
  fetchedAt: string;
  /** True when a conditional request got 304. */
  revalidated: boolean;
};

export type Resource =
  | { status: "ok"; body: string; source: Source }
  | { status: "notfound"; origin: string }
  | { status: "error"; origin: string; message: string };

export type Spec = {
  /** Full URL to fetch. */
  url: string;
  /** Cache path under the cache root, e.g. "site/pages/index.md". */
  rel: string;
  ttlMs: number;
  maxBytes: number;
  /** A 404 deletes the cached copy (pages, schemas). Not for the manifest or llms.txt. */
  deleteOn404?: boolean;
  /** Optional check on a body (fresh or cached). A false result counts as corrupt/failed. */
  validate?: (body: string) => boolean;
};

let cache: DiskCache | undefined;
export const diskCache = (): DiskCache => {
  cache ??= new DiskCache();
  return cache;
};

// ---- semaphore ----
let active = 0;
const waiting: (() => void)[] = [];
const acquire = async (): Promise<void> => {
  if (active < MAX_CONCURRENT) {
    active++;
    return;
  }
  await new Promise<void>((r) => waiting.push(r));
};
const release = (): void => {
  const next = waiting.shift();
  if (next) next();
  else active--;
};

type Got =
  | { kind: "ok"; body: string; etag?: string; lastModified?: string }
  | { kind: "not-modified" }
  | { kind: "notfound" }
  | { kind: "fail"; message: string };

const readCapped = async (
  res: Response,
  max: number,
): Promise<string | undefined> => {
  const len = Number(res.headers.get("content-length"));
  if (Number.isFinite(len) && len > max) {
    await res.body?.cancel();
    return undefined;
  }
  if (!res.body) return "";
  const chunks: Uint8Array[] = [];
  let size = 0;
  const reader = res.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) {
      await reader.cancel();
      return undefined;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const httpGet = async (
  url: string,
  maxBytes: number,
  validators: { etag?: string; lastModified?: string },
): Promise<Got> => {
  const origin = new URL(url).origin;
  const headers: Record<string, string> = {
    "User-Agent": UA,
    Accept: ACCEPT,
  };
  if (validators.etag) headers["If-None-Match"] = validators.etag;
  else if (validators.lastModified)
    headers["If-Modified-Since"] = validators.lastModified;
  try {
    const signal = AbortSignal.timeout(FETCH_TIMEOUT_MS);
    let cur = url;
    for (let hop = 0; ; hop++) {
      // No cookies are sent or kept: plain fetch with manual redirects.
      const res = await fetch(cur, { headers, signal, redirect: "manual" });
      if (res.status >= 300 && res.status < 400 && res.status !== 304) {
        await res.body?.cancel();
        const loc = res.headers.get("location");
        if (!loc) return { kind: "fail", message: "redirect without Location" };
        if (hop >= MAX_REDIRECTS)
          return { kind: "fail", message: "too many redirects" };
        const next = new URL(loc, cur);
        if (next.origin !== origin)
          return { kind: "fail", message: "redirect to another origin" };
        cur = next.href;
        continue;
      }
      if (res.status === 304) {
        await res.body?.cancel();
        return { kind: "not-modified" };
      }
      if (res.status === 404) {
        await res.body?.cancel();
        return { kind: "notfound" };
      }
      if (!res.ok) {
        await res.body?.cancel();
        return { kind: "fail", message: `HTTP ${res.status}` };
      }
      const body = await readCapped(res, maxBytes);
      if (body === undefined)
        return { kind: "fail", message: `response over ${maxBytes} bytes` };
      const etag = res.headers.get("etag");
      const lastModified = res.headers.get("last-modified");
      return {
        kind: "ok",
        body,
        ...(etag ? { etag } : {}),
        ...(lastModified ? { lastModified } : {}),
      };
    }
  } catch (e) {
    return {
      kind: "fail",
      message: e instanceof Error ? e.message : String(e),
    };
  }
};

const inflight = new Map<string, Promise<Resource>>();

/** Cache first, then network, then stale cache. Concurrent identical calls share one promise. */
export const getResource = (spec: Spec): Promise<Resource> => {
  const key = `${spec.rel}\n${spec.url}`;
  let p = inflight.get(key);
  if (!p) {
    p = resolveResource(spec).finally(() => inflight.delete(key));
    inflight.set(key, p);
  }
  return p;
};

const resolveResource = async (spec: Spec): Promise<Resource> => {
  const dc = diskCache();
  const origin = new URL(spec.url).host;
  let cached = dc.get(spec.rel);
  // A copy fetched from another URL (other base URL, case-colliding route) is a miss.
  if (cached?.meta && cached.meta.url !== spec.url) cached = undefined;
  if (cached && spec.validate && !spec.validate(cached.body)) {
    dc.delete(spec.rel);
    cached = undefined;
  }
  const fetchedMs = cached?.meta ? Date.parse(cached.meta.fetchedAt) : NaN;
  if (cached?.meta && Date.now() - fetchedMs < spec.ttlMs) {
    return {
      status: "ok",
      body: cached.body,
      source: {
        origin,
        state: "cached",
        fetchedAt: cached.meta.fetchedAt,
        revalidated: false,
      },
    };
  }
  await acquire();
  let got: Got;
  try {
    got = await httpGet(spec.url, spec.maxBytes, {
      ...(cached?.meta?.etag ? { etag: cached.meta.etag } : {}),
      ...(cached?.meta?.lastModified
        ? { lastModified: cached.meta.lastModified }
        : {}),
    });
  } finally {
    release();
  }
  if (got.kind === "ok" && spec.validate && !spec.validate(got.body))
    got = { kind: "fail", message: "response is not valid" };
  // Only pages and schemas can be "gone"; for the manifest and llms.txt a 404 is a failure (cache fallback).
  if (got.kind === "notfound" && !spec.deleteOn404)
    got = { kind: "fail", message: "HTTP 404" };
  if (got.kind === "notfound") {
    if (spec.deleteOn404) dc.delete(spec.rel);
    return { status: "notfound", origin };
  }
  if (got.kind === "ok") {
    dc.put(spec.rel, got.body, {
      url: spec.url,
      ...(got.etag ? { etag: got.etag } : {}),
      ...(got.lastModified ? { lastModified: got.lastModified } : {}),
    });
    return {
      status: "ok",
      body: got.body,
      source: {
        origin,
        state: "live",
        fetchedAt: new Date().toISOString(),
        revalidated: false,
      },
    };
  }
  if (got.kind === "not-modified" && cached) {
    dc.touch(spec.rel);
    return {
      status: "ok",
      body: cached.body,
      source: {
        origin,
        state: "cached",
        fetchedAt: new Date().toISOString(),
        revalidated: true,
      },
    };
  }
  const message =
    got.kind === "fail" ? got.message : "unexpected 304 without a cached copy";
  if (cached) {
    return {
      status: "ok",
      body: cached.body,
      source: {
        origin,
        state: "stale-offline",
        fetchedAt: cached.meta?.fetchedAt ?? new Date(0).toISOString(),
        revalidated: false,
      },
    };
  }
  return {
    status: "error",
    origin,
    message: `could not reach ${origin} and nothing is cached (${message})`,
  };
};

/** "3 d ago" style age. */
export const ago = (iso: string): string => {
  const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
  if (s < 90) return `${Math.round(s)} s ago`;
  if (s < 5400) return `${Math.round(s / 60)} min ago`;
  if (s < 129600) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} d ago`;
};

/** One line for the end of a tool result. */
export const sourceLine = (s: Source): string => {
  const what =
    s.state === "live"
      ? "live"
      : s.state === "stale-offline"
        ? `cache (fetched ${ago(s.fetchedAt)}, offline)`
        : s.revalidated
          ? "cache (revalidated, 304)"
          : `cache (fetched ${ago(s.fetchedAt)})`;
  return `Source: ${s.origin}, ${what}`;
};

export const sourceData = (s: Source) => ({
  origin: s.origin,
  state: s.state,
  fetchedAt: s.fetchedAt,
});
