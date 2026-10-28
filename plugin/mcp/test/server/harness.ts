// Shared helpers for the server tests: a mock docs site, mock platform, code, and anthropic sites, and a client for dist/server.js.
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { searchIndexJson } from "../../src/search.ts";

export const SERVER = join(import.meta.dir, "..", "..", "dist", "server.js");
const SITE = join(import.meta.dir, "..", "fixtures", "site");
export const clients: Client[] = [];
export const stops: (() => void)[] = [];

/** Mock site switches. Tests flip these. `hits` records every request with its If-None-Match. */
export type SiteState = {
  llms404: boolean;
  /** llms-search-index.json answers 404, like a site built before the index existed. */
  noIndex: boolean;
  /** Paths that answer 404. */
  gone: Set<string>;
  /** Paths that answer with a body over the size cap. */
  huge: Set<string>;
  /** Send an ETag on pages and the index, and answer 304 to a matching If-None-Match. */
  etag: boolean;
  hits: { path: string; inm: string | null }[];
};
export const newState = (): SiteState => ({
  llms404: false,
  noIndex: false,
  gone: new Set(),
  huge: new Set(),
  etag: false,
  hits: [],
});

/** llms-search-index.json for the fixture site (what the site build writes). */
const fixtureIndex = (): string => {
  const manifest = JSON.parse(
    readFileSync(join(SITE, "manifest.json"), "utf8"),
  ) as { route: string; title: string; description: string }[];
  return searchIndexJson(
    "test",
    manifest.map((e) => ({
      ...e,
      text: readFileSync(
        join(SITE, e.route === "/" ? "index.md" : `${e.route.slice(1)}.md`),
        "utf8",
      ),
    })),
  );
};

/** Mock site that serves fixtures/site/ (manifest, pages, schemas) with the manifest URLs rewritten to the mock. */
export const mockSite = (state: SiteState = newState(), port = 0) => {
  const srv = Bun.serve({
    port,
    hostname: "127.0.0.1",
    fetch(req) {
      const path = new URL(req.url).pathname;
      const base = new URL(req.url).origin;
      const inm = req.headers.get("if-none-match");
      state.hits.push({ path, inm });
      if (path === "/llms-manifest.json")
        return new Response(
          readFileSync(join(SITE, "manifest.json"), "utf8").replaceAll(
            "https://xsyetopz.github.io/clawdipedia",
            base,
          ),
        );
      if (path === "/llms.txt")
        return state.llms404
          ? new Response("no", { status: 404 })
          : new Response("# T\n\n> Docs for Claude Code 2.1.305.\n");
      if (path === "/llms-search-index.json") {
        if (state.noIndex) return new Response("no", { status: 404 });
        const tag = '"i1"';
        if (state.etag && inm === tag)
          return new Response(null, { status: 304 });
        return new Response(fixtureIndex(), {
          headers: state.etag ? { etag: tag } : {},
        });
      }
      if (state.gone.has(path)) return new Response("no", { status: 404 });
      if (state.huge.has(path))
        return new Response("x".repeat(3 * 1024 * 1024));
      const file = join(SITE, path.slice(1));
      if (!existsSync(file) || path.includes(".."))
        return new Response("no", { status: 404 });
      if (state.etag && path.endsWith(".md")) {
        const tag = '"v1"';
        if (inm === tag) return new Response(null, { status: 304 });
        return new Response(readFileSync(file), { headers: { etag: tag } });
      }
      return new Response(readFileSync(file));
    },
  });
  return {
    url: `http://127.0.0.1:${srv.port}`,
    port: srv.port as number,
    stop: () => srv.stop(true),
  };
};

const FIX = join(import.meta.dir, "..", "fixtures", "platform");
type PHit = { path: string; ims: string | null };

/** Mock platform.claude.com: llms.txt (Last-Modified, no ETag) and two pages. Records every request. */
export const mockPlatform = (rewrite = true) => {
  const hits: PHit[] = [];
  const srv = Bun.serve({
    port: 0,
    hostname: "127.0.0.1",
    fetch(req) {
      const path = new URL(req.url).pathname;
      const base = new URL(req.url).origin;
      hits.push({ path, ims: req.headers.get("if-modified-since") });
      const LM = "Wed, 21 Oct 2026 07:28:00 GMT";
      if (path === "/llms.txt") {
        if (req.headers.get("if-modified-since") === LM)
          return new Response(null, { status: 304 });
        return new Response(
          readFileSync(join(FIX, "llms.txt"), "utf8").replaceAll(
            "https://platform.claude.com",
            rewrite ? base : "https://platform.claude.com",
          ),
          { headers: { "last-modified": LM } },
        );
      }
      const m = /^\/docs\/en\/([a-z0-9/-]+)\.md$/.exec(path);
      const file = m ? join(FIX, `${m[1]?.replaceAll("/", "__")}.md`) : "";
      return m && existsSync(file)
        ? new Response(readFileSync(file))
        : new Response("no", { status: 404 });
    },
  });
  return {
    url: `http://127.0.0.1:${srv.port}`,
    hits,
    stop: () => srv.stop(true),
  };
};

const LM = "Wed, 21 Oct 2026 07:28:00 GMT";

/** Mock code.claude.com: /docs/llms.txt (Last-Modified) and /docs/en/<slug>.md pages. Records every request. */
export const mockCode = () => {
  const dir = join(import.meta.dir, "..", "fixtures", "code");
  const hits: PHit[] = [];
  const srv = Bun.serve({
    port: 0,
    hostname: "127.0.0.1",
    fetch(req) {
      const path = new URL(req.url).pathname;
      const base = new URL(req.url).origin;
      const ims = req.headers.get("if-modified-since");
      hits.push({ path, ims });
      if (path === "/docs/llms.txt") {
        if (ims === LM) return new Response(null, { status: 304 });
        return new Response(
          readFileSync(join(dir, "llms.txt"), "utf8").replaceAll(
            "https://code.claude.com",
            base,
          ),
          { headers: { "last-modified": LM } },
        );
      }
      // The bare path (no .md) is HTML on the real host; the mock has none.
      const m = /^\/docs\/en\/([a-z0-9/-]+)\.md$/.exec(path);
      const file = m
        ? join(dir, "pages", `${m[1]?.replaceAll("/", "__")}.md`)
        : "";
      return m && existsSync(file)
        ? new Response(readFileSync(file))
        : new Response("no", { status: 404 });
    },
  });
  return {
    url: `http://127.0.0.1:${srv.port}`,
    hits,
    stop: () => srv.stop(true),
  };
};

/** Mock www.anthropic.com: /sitemap.xml (Last-Modified) and HTML pages at /<path>. Records every request. */
export const mockAnthropic = () => {
  const dir = join(import.meta.dir, "..", "fixtures", "anthropic");
  const hits: PHit[] = [];
  const srv = Bun.serve({
    port: 0,
    hostname: "127.0.0.1",
    fetch(req) {
      const path = new URL(req.url).pathname;
      const base = new URL(req.url).origin;
      const ims = req.headers.get("if-modified-since");
      hits.push({ path, ims });
      if (path === "/sitemap.xml") {
        if (ims === LM) return new Response(null, { status: 304 });
        return new Response(
          readFileSync(join(dir, "sitemap.xml"), "utf8").replaceAll(
            "https://www.anthropic.com",
            base,
          ),
          { headers: { "last-modified": LM } },
        );
      }
      const m = /^\/([a-z0-9/-]+)$/.exec(path);
      const file = m
        ? join(dir, "pages", `${m[1]?.replaceAll("/", "__")}.html`)
        : "";
      return m && existsSync(file)
        ? new Response(readFileSync(file), {
            headers: { "content-type": "text/html" },
          })
        : new Response("no", { status: 404 });
    },
  });
  return {
    url: `http://127.0.0.1:${srv.port}`,
    hits,
    stop: () => srv.stop(true),
  };
};

export const connect = async (env: Record<string, string> = {}) => {
  const c = new Client({ name: "test", version: "0" });
  const clean = Object.fromEntries(
    Object.entries(process.env).filter(
      (e): e is [string, string] => typeof e[1] === "string",
    ),
  );
  const site = env["CLAWDIPEDIA_BASE_URL"] ? undefined : mockSite();
  // Own the dir only when the test did not bring one; the test cleans up its own.
  const own = !env["CLAWDIPEDIA_CACHE_DIR"] && !env["CLAUDE_PLUGIN_DATA"];
  const cache =
    env["CLAWDIPEDIA_CACHE_DIR"] ?? mkdtempSync(join(tmpdir(), "ccdocs-test-"));
  stops.push(() => {
    site?.stop();
    if (own || !env["CLAWDIPEDIA_CACHE_DIR"])
      rmSync(cache, { recursive: true, force: true });
  });
  await c.connect(
    new StdioClientTransport({
      command: "bun",
      args: [SERVER],
      env: {
        ...clean,
        ...(env["CLAUDE_PLUGIN_DATA"] ? {} : { CLAWDIPEDIA_CACHE_DIR: cache }),
        ...(site ? { CLAWDIPEDIA_BASE_URL: site.url } : {}),
        ...env,
      },
    }),
  );
  clients.push(c);
  const call = async (name: string, args: Record<string, unknown>) => {
    const r = await c.callTool({ name, arguments: args });
    const first = (r.content as { text: string }[])[0];
    return {
      error: r.isError === true,
      text: first?.text ?? "",
      structured: r.structuredContent as Record<string, unknown> | undefined,
      // Claude Code 2.1.309 (`ds` in chunk-gf8e163f.js) shows the model only structuredContent when set.
      seen: r.structuredContent
        ? JSON.stringify(r.structuredContent)
        : (first?.text ?? ""),
    };
  };
  return { call, cache };
};

export const cleanup = async (): Promise<void> => {
  for (const c of clients) await c.close();
  for (const f of stops) f();
};
