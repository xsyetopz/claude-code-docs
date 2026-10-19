// Content access: bundled snapshot by default; optional refresh from the published site.
// Refresh is opt-in (CLAUDE_CODE_DOCS_REFRESH=1), lazy, time-limited, and always falls back to the snapshot.
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const SITE = "https://xsyetopz.github.io/claude-code-docs";
// Override for mirrors and tests: CLAUDE_CODE_DOCS_SITE=https://example.org/docs
// Only https is accepted; plain http only for localhost and 127.0.0.1 (tests).
function fetchBase(): string {
  const raw = process.env["CLAUDE_CODE_DOCS_SITE"];
  if (!raw) return SITE;
  try {
    const u = new URL(raw);
    const local = u.hostname === "localhost" || u.hostname === "127.0.0.1";
    if (u.protocol === "https:" || (u.protocol === "http:" && local))
      return raw.replace(/\/+$/, "");
  } catch {
    // Fall through to the default.
  }
  console.error(
    "claude-code-docs: ignoring CLAUDE_CODE_DOCS_SITE (needs https)",
  );
  return SITE;
}
export const FETCH_TIMEOUT_MS = 5000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export type Entry = {
  route: string;
  title: string;
  description: string;
  section: string;
  md: string;
  url: string;
};

export const SCHEMA_NAMES = [
  "claude-code-settings",
  "claude-code-managed-settings",
  "claude-code-plugin-manifest",
  "claude-code-plugin-hooks",
  "claude-code-marketplace",
  "claude-code-keybindings",
] as const;

// dist/server.js sits next to snapshot/ (plugin/mcp/dist and plugin/mcp/snapshot).
const SNAPSHOT = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "snapshot",
);

export const refreshEnabled = (): boolean =>
  process.env["CLAUDE_CODE_DOCS_REFRESH"] === "1";

const cacheDir = (): string =>
  join(
    process.env["XDG_CACHE_HOME"] || join(homedir(), ".cache"),
    "claude-code-docs",
  );

/** Normalizes "/a/b/", "a/b.md", or a full site URL to "a/b". */
export function normalizeRoute(input: string): string {
  let r = input.trim();
  if (r.startsWith(SITE)) r = r.slice(SITE.length);
  r = r.replace(/[?#].*$/, "").replace(/\.(md|html)$/, "");
  return r.replace(/^\/+|\/+$/g, "") || "index";
}

const ROUTE_RE = /^\/?[a-z0-9][a-z0-9/_-]*$/i;

/** Keeps only well-formed manifest entries. A hostile or broken manifest cannot add paths or foreign URLs. */
export function sanitizeManifest(list: unknown): Entry[] {
  if (!Array.isArray(list)) return [];
  const origins = [SITE, fetchBase()];
  const out: Entry[] = [];
  for (const raw of list as Record<string, unknown>[]) {
    if (!raw || typeof raw !== "object") continue;
    const { route, title, description, section, md, url } = raw;
    if (
      typeof route !== "string" ||
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof section !== "string" ||
      typeof url !== "string"
    )
      continue;
    const okRoute =
      route === "/" ||
      (ROUTE_RE.test(route) && !route.includes("//") && !route.includes(".."));
    if (!okRoute || !origins.some((o) => url === o || url.startsWith(`${o}/`)))
      continue;
    out.push({
      route: normalizeRoute(route),
      title,
      description,
      section,
      md: typeof md === "string" ? md : "",
      url,
    });
  }
  return out;
}

/** Joins and checks that the result stays inside base. Returns undefined otherwise. */
function inside(base: string, ...parts: string[]): string | undefined {
  const root = resolve(base);
  const p = resolve(root, ...parts);
  return p.startsWith(root + sep) ? p : undefined;
}

const readJson = <T>(file: string): T =>
  JSON.parse(readFileSync(file, "utf8")) as T;

function freshFile(file: string): boolean {
  try {
    return Date.now() - statSync(file).mtimeMs < CACHE_TTL_MS;
  } catch {
    return false;
  }
}

async function fetchText(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return undefined;
    return await res.text();
  } catch {
    return undefined;
  }
}

function writeCache(rel: string, text: string): void {
  try {
    const file = inside(cacheDir(), rel);
    if (!file) return;
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  } catch {
    // A read-only cache dir only costs the cache.
  }
}

export class Content {
  private entries: Entry[];
  private byRoute = new Map<string, Entry>();
  readonly claudeCode: string;
  /** "snapshot" until a refreshed manifest arrives. */
  source: "snapshot" | "refreshed" = "snapshot";
  /** Bumped whenever the page list changes, so derived indexes can rebuild. */
  version = 0;

  constructor() {
    this.entries = sanitizeManifest(
      readJson<unknown>(join(SNAPSHOT, "manifest.json")),
    );
    this.claudeCode = readJson<{ claudeCode: string }>(
      join(SNAPSHOT, "version.json"),
    ).claudeCode;
    this.index();
    if (refreshEnabled()) {
      // Use a cached manifest at once, then refresh in the background. Never awaited at startup.
      const cached = join(cacheDir(), "llms-manifest.json");
      if (existsSync(cached) && freshFile(cached))
        this.adopt(readFileSync(cached, "utf8"));
      else void this.refreshManifest();
    }
  }

  private index(): void {
    this.byRoute = new Map(this.entries.map((e) => [e.route, e]));
    this.version++;
  }

  /** Takes a manifest from JSON text. Returns false (and keeps the current list) if it is unusable. */
  private adopt(text: string): boolean {
    try {
      const list = sanitizeManifest(JSON.parse(text));
      if (list.length === 0) return false;
      this.entries = list;
      this.index();
      this.source = "refreshed";
      return true;
    } catch {
      return false;
    }
  }

  private async refreshManifest(): Promise<void> {
    const text = await fetchText(`${fetchBase()}/llms-manifest.json`);
    if (text && this.adopt(text)) writeCache("llms-manifest.json", text);
  }

  pages(): readonly Entry[] {
    return this.entries;
  }

  find(input: string): Entry | undefined {
    return this.byRoute.get(normalizeRoute(input));
  }

  /** Page text without any network: cache (when refresh is on and fresh), else snapshot. */
  readLocal(e: Entry): string | undefined {
    if (refreshEnabled()) {
      const c = inside(cacheDir(), "pages", `${e.route}.md`);
      if (c && existsSync(c) && freshFile(c)) return readFileSync(c, "utf8");
    }
    const s = inside(SNAPSHOT, "pages", `${e.route}.md`);
    return s && existsSync(s) ? readFileSync(s, "utf8") : undefined;
  }

  /** Page text; with refresh on, fetches lazily into the cache and falls back to the snapshot. */
  async read(e: Entry): Promise<string | undefined> {
    if (refreshEnabled()) {
      const c = inside(cacheDir(), "pages", `${e.route}.md`);
      if (c && existsSync(c) && freshFile(c)) return readFileSync(c, "utf8");
      const remote = await fetchText(`${fetchBase()}/${e.route}.md`);
      if (remote) {
        writeCache(join("pages", `${e.route}.md`), remote);
        this.version++; // a newly cached page changes what the search index can see
        return remote;
      }
    }
    return this.readLocal(e);
  }

  schema(name: string): Record<string, unknown> | undefined {
    const n = name.replace(/\.json$/, "");
    const full = n.startsWith("claude-code-") ? n : `claude-code-${n}`;
    if (!(SCHEMA_NAMES as readonly string[]).includes(full)) return undefined;
    return readJson(join(SNAPSHOT, "schemas", `${full}.json`));
  }
}
