// Run: bun test plugin/mcp/test   (needs plugin/mcp/dist/server.js; serves fixtures/site/ from a local mock; part of plugin:check)
import { afterAll, describe, expect, test } from "bun:test";
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import http from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const SERVER = join(import.meta.dir, "..", "dist", "server.js");
const SITE = join(import.meta.dir, "fixtures", "site");
const clients: Client[] = [];
const stops: (() => void)[] = [];

/** Mock site switches. Tests flip these. `hits` records every request with its If-None-Match. */
type SiteState = {
  llms404: boolean;
  /** Paths that answer 404. */
  gone: Set<string>;
  /** Paths that answer with a body over the size cap. */
  huge: Set<string>;
  /** Send an ETag on pages and answer 304 to a matching If-None-Match. */
  etag: boolean;
  hits: { path: string; inm: string | null }[];
};
const newState = (): SiteState => ({
  llms404: false,
  gone: new Set(),
  huge: new Set(),
  etag: false,
  hits: [],
});

/** Mock site that serves fixtures/site/ (manifest, pages, schemas) with the manifest URLs rewritten to the mock. */
const mockSite = (state: SiteState = newState(), port = 0) => {
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
            "https://xsyetopz.github.io/claude-code-docs",
            base,
          ),
        );
      if (path === "/llms.txt")
        return state.llms404
          ? new Response("no", { status: 404 })
          : new Response("# T\n\n> Docs for Claude Code 2.1.305.\n");
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

const FIX = join(import.meta.dir, "fixtures", "platform");
type PHit = { path: string; ims: string | null };

/** Mock platform.claude.com: llms.txt (Last-Modified, no ETag) and two pages. Records every request. */
const mockPlatform = (rewrite = true) => {
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

const connect = async (env: Record<string, string> = {}) => {
  const c = new Client({ name: "test", version: "0" });
  const clean = Object.fromEntries(
    Object.entries(process.env).filter(
      (e): e is [string, string] => typeof e[1] === "string",
    ),
  );
  const site = env["CC_DOCS_BASE_URL"] ? undefined : mockSite();
  // Own the dir only when the test did not bring one; the test cleans up its own.
  const own = !env["CC_DOCS_CACHE_DIR"] && !env["CLAUDE_PLUGIN_DATA"];
  const cache =
    env["CC_DOCS_CACHE_DIR"] ?? mkdtempSync(join(tmpdir(), "ccdocs-test-"));
  stops.push(() => {
    site?.stop();
    if (own || !env["CC_DOCS_CACHE_DIR"])
      rmSync(cache, { recursive: true, force: true });
  });
  await c.connect(
    new StdioClientTransport({
      command: "bun",
      args: [SERVER],
      env: {
        ...clean,
        ...(env["CLAUDE_PLUGIN_DATA"] ? {} : { CC_DOCS_CACHE_DIR: cache }),
        ...(site ? { CC_DOCS_BASE_URL: site.url } : {}),
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
    };
  };
  return { call, cache };
};

afterAll(async () => {
  for (const c of clients) await c.close();
  for (const f of stops) f();
});

describe("get_schema", () => {
  test("follows additionalProperties and items", async () => {
    const { call } = await connect();
    const a = await call("get_schema", {
      name: "settings",
      property: "hooks.PreToolUse",
    });
    expect(a.error).toBe(false);
    expect(a.text).toContain('"type": "array"');
    const b = await call("get_schema", {
      name: "settings",
      property: "hooks.PreToolUse.[]",
    });
    expect(b.text).toContain('"matcher"');
  });
  test("prototype keys are not found", async () => {
    const { call } = await connect();
    for (const property of ["__proto__", "hooks.__proto__", "constructor"])
      expect(
        (await call("get_schema", { name: "settings", property })).error,
      ).toBe(true);
  });
});

describe("get_schema definitions", () => {
  test("finds a definition and its fields, and lists definitions", async () => {
    const { call } = await connect();
    const def = await call("get_schema", {
      name: "tools",
      property: "BashInput",
    });
    expect(def.text).toContain('"required"');
    const field = await call("get_schema", {
      name: "tools",
      property: "BashInput.command",
    });
    expect(field.text).toContain("The command to run");
    const outline = await call("get_schema", { name: "tools" });
    expect(outline.text).toContain("1 definitions");
    const miss = await call("get_schema", {
      name: "tools",
      property: "BashInput.decider",
    });
    expect(miss.error).toBe(true);
  });
});

describe("get_schema types", () => {
  test("finds a type, a member, a call, and an event", async () => {
    const { call } = await connect();
    const get = async (property: string) =>
      (await call("get_schema", { name: "types", property })).text;
    expect(await get("ToolCheckResult")).toContain("decision: 'allow'");
    const member = await get("ToolCheckResult.plugin");
    expect(member).toContain("readonly plugin?: string;");
    expect(member).not.toContain("decision");
    expect(await get("$.tool.check")).toContain(
      "check(input: { tool: string }): Promise<ToolCheckResult>;",
    );
    expect(await get("tool.check")).toContain(
      "'tool.check': { tool: string };",
    );
  });
  test("a missing name is an error that gives the closest names", async () => {
    const { call } = await connect();
    const r = await call("get_schema", {
      name: "types",
      property: "ToolCheckResult.decider",
    });
    expect(r.error).toBe(true);
    expect(r.text).toContain("Closest names in the file: ToolCheckResult");
  });
  test("without property, lists the declared names", async () => {
    const { call } = await connect();
    const r = await call("get_schema", { name: "claude-code.d.ts" });
    expect(r.error).toBe(false);
    expect(r.text).toContain("3 declarations");
  });
});

describe("search and offline", () => {
  test("search ranks a description match above a body mention", async () => {
    const { call } = await connect();
    // "PreToolUse" is in the description and body of Hook Events, only in the body of Status Line.
    const s = await call("search_docs", { query: "PreToolUse" });
    expect(s.error).toBe(false);
    const hooks = s.text.indexOf("configure/hooks");
    const status = s.text.indexOf("configure/status-line");
    expect(hooks).toBeGreaterThanOrEqual(0);
    expect(status).toBeGreaterThan(hooks);
    const d = await call("search_docs", { query: "debounced" });
    expect(d.text).toContain("configure/status-line");
    expect(d.text).not.toContain("configure/hooks");
    const none = await call("search_docs", {
      query: "PreToolUse",
      section: "Overview",
    });
    expect(none.text).toContain("No pages match");
    const conf = await call("search_docs", {
      query: "PreToolUse",
      section: "Configure",
    });
    expect(conf.text).toContain("configure/hooks");
    expect(conf.text).not.toContain("No pages match");
  });

  test("offline: cached pages, the index, and the list are served", async () => {
    const site = mockSite();
    const { call } = await connect({
      CC_DOCS_BASE_URL: site.url,
      CC_DOCS_TTL_SCALE: "0",
    });
    const live = await call("read_page", { route: "configure/hooks" });
    expect(live.error).toBe(false);
    expect(live.text).toContain("live");
    await call("search_docs", { query: "hook" });
    site.stop();
    const r = await call("read_page", { route: "configure/hooks" });
    expect(r.error).toBe(false);
    expect(r.text).toContain("PreToolUse");
    expect(r.text).toContain("offline");
    // By design search keeps its in-process index (rebuilt in the background), so its
    // Source line shows "from cache" counts and not an offline marker until the rebuild lands.
    const s = await call("search_docs", { query: "PreToolUse" });
    expect(s.error).toBe(false);
    expect(s.text).toContain("configure/hooks");
    expect(s.text).toMatch(/Source: .*index built from 3 pages/);
    const l = await call("list_pages", {});
    expect(l.error).toBe(false);
    expect(l.text).toContain("offline");
  });

  test("a stale-offline page list recovers soon after the network returns", async () => {
    const site = mockSite();
    const { call } = await connect({
      CC_DOCS_BASE_URL: site.url,
      CC_DOCS_TTL_SCALE: "0.001",
    });
    expect((await call("list_pages", {})).text).not.toContain("offline");
    site.stop();
    await Bun.sleep(700);
    expect((await call("list_pages", {})).text).toContain("offline");
    const back = mockSite(newState(), site.port);
    stops.push(back.stop);
    // The stale-offline TTL is 60 ms at this scale; the normal manifest TTL is 600 ms.
    await Bun.sleep(150);
    const r = await call("list_pages", {});
    expect(r.error).toBe(false);
    expect(r.text).not.toContain("offline");
  });

  test("a partial search index is rebuilt soon", async () => {
    const state = newState();
    state.gone.add("/configure/hooks.md");
    const site = mockSite(state);
    stops.push(site.stop);
    const { call } = await connect({
      CC_DOCS_BASE_URL: site.url,
      CC_DOCS_TTL_SCALE: "0.001",
    });
    const first = await call("search_docs", { query: "hook" });
    expect(first.text).toContain("index built from 2 pages");
    state.gone.delete("/configure/hooks.md");
    await Bun.sleep(150);
    // This call starts the rebuild in the background; a later one sees it.
    await call("search_docs", { query: "hook" });
    await Bun.sleep(500);
    const again = await call("search_docs", { query: "hook" });
    expect(again.text).toContain("index built from 3 pages");
  });

  test("offline with nothing cached is an error", async () => {
    const site = mockSite();
    site.stop();
    const { call } = await connect({ CC_DOCS_BASE_URL: site.url });
    const r = await call("list_pages", {});
    expect(r.error).toBe(true);
    expect(r.text).toContain("could not reach");
  });

  test("llms.txt 404 falls back to the cached copy", async () => {
    const state = newState();
    const site = mockSite(state);
    stops.push(site.stop);
    const cache = mkdtempSync(join(tmpdir(), "ccdocs-test-"));
    const bareCache = mkdtempSync(join(tmpdir(), "ccdocs-test-"));
    stops.push(() => {
      rmSync(cache, { recursive: true, force: true });
      rmSync(bareCache, { recursive: true, force: true });
    });
    const env = {
      CC_DOCS_BASE_URL: site.url,
      CC_DOCS_CACHE_DIR: cache,
      CC_DOCS_TTL_SCALE: "0",
    };
    const first = await connect(env);
    expect((await first.call("list_pages", {})).text).toContain(
      "Claude Code 2.1.305",
    );
    state.llms404 = true;
    // A new process, same cache: llms.txt is a 404 now, so the cached copy supplies the version.
    const second = await connect(env);
    const l = await second.call("list_pages", {});
    expect(l.error).toBe(false);
    expect(l.text).toContain("Claude Code 2.1.305");
    expect(existsSync(join(cache, "site", "llms.txt"))).toBe(true);
    // With no cached copy the 404 only drops the version line; tools still work.
    const bare = await connect({ ...env, CC_DOCS_CACHE_DIR: bareCache });
    const b = await bare.call("list_pages", {});
    expect(b.error).toBe(false);
    expect(b.text).not.toContain("Claude Code 2.1.305");
  });
});

describe("site cache rules", () => {
  test("a matching ETag gives a 304 and the cached body", async () => {
    const state = newState();
    state.etag = true;
    const site = mockSite(state);
    stops.push(site.stop);
    const { call } = await connect({
      CC_DOCS_BASE_URL: site.url,
      CC_DOCS_TTL_SCALE: "0",
    });
    const a = await call("read_page", { route: "configure/hooks" });
    expect(a.text).toContain("live");
    state.hits.length = 0;
    const b = await call("read_page", { route: "configure/hooks" });
    expect(b.error).toBe(false);
    expect(b.text).toContain("PreToolUse");
    expect(b.text).toContain("revalidated, 304");
    expect(state.hits.find((h) => h.path === "/configure/hooks.md")?.inm).toBe(
      '"v1"',
    );
  });

  test("a page 404 deletes the cached copy and suggests near pages", async () => {
    const state = newState();
    const site = mockSite(state);
    stops.push(site.stop);
    const { call, cache } = await connect({
      CC_DOCS_BASE_URL: site.url,
      CC_DOCS_TTL_SCALE: "0",
    });
    expect((await call("read_page", { route: "configure/hooks" })).error).toBe(
      false,
    );
    const file = join(cache, "site", "pages", "configure", "hooks.md");
    expect(existsSync(file)).toBe(true);
    state.gone.add("/configure/hooks.md");
    const r = await call("read_page", { route: "configure/hooks" });
    expect(r.error).toBe(true);
    expect(r.text).toContain("no longer exists");
    expect(r.text).toContain("Closest matches");
    expect(r.text).toContain("configure/");
    expect(existsSync(file)).toBe(false);
  });

  test("a truncated cached body is fetched again", async () => {
    const state = newState();
    const site = mockSite(state);
    stops.push(site.stop);
    const { call, cache } = await connect({ CC_DOCS_BASE_URL: site.url });
    await call("read_page", { route: "configure/hooks" });
    const file = join(cache, "site", "pages", "configure", "hooks.md");
    writeFileSync(file, "---\ntitle: Hook");
    state.hits.length = 0;
    const r = await call("read_page", { route: "configure/hooks" });
    expect(r.error).toBe(false);
    expect(r.text).toContain("PreToolUse");
    expect(state.hits.some((h) => h.path === "/configure/hooks.md")).toBe(true);
    expect(readFileSync(file, "utf8")).toContain("PreToolUse");
  });

  test("an over-size body fails cleanly", async () => {
    const state = newState();
    state.huge.add("/configure/hooks.md");
    const site = mockSite(state);
    stops.push(site.stop);
    const { call } = await connect({ CC_DOCS_BASE_URL: site.url });
    const r = await call("read_page", { route: "configure/hooks" });
    expect(r.error).toBe(true);
    expect(r.text).toContain("could not reach");
    expect((await call("list_pages", {})).error).toBe(false);
  });

  test("CLAUDE_PLUGIN_DATA puts the cache under <dir>/cache", async () => {
    const data = mkdtempSync(join(tmpdir(), "ccdocs-test-"));
    stops.push(() => rmSync(data, { recursive: true, force: true }));
    const { call } = await connect({ CLAUDE_PLUGIN_DATA: data });
    await call("read_page", { route: "configure/hooks" });
    expect(
      existsSync(join(data, "cache", "site", "pages", "configure", "hooks.md")),
    ).toBe(true);
  });
});

describe("hostile site", () => {
  test("rejects bad entries and keeps paths inside the cache", async () => {
    const hits: string[] = [];
    const srv = http.createServer((req, res) => {
      hits.push(req.url ?? "");
      const base = `http://127.0.0.1:${(srv.address() as AddressInfo).port}`;
      const e = (route: string, url = `${base}${route}`) => ({
        route,
        title: `T ${route}`,
        description: "d",
        section: "S",
        md: `${url}.md`,
        url,
      });
      if (req.url === "/llms-manifest.json")
        return void res.end(
          JSON.stringify([
            e("/zzfreshpage"),
            e("/../../../../tmp/pwned"),
            e("/a/../../x"),
            { ...e("/evilurl"), url: "https://evil.example/x" },
            { route: 5 },
            null,
            e("/dotted.md"),
          ]),
        );
      if (req.url === "/zzfreshpage.md")
        return void res.end(
          "---\ntitle: F\n---\n\n# Fresh\nquokkaquokka marker\n",
        );
      res.statusCode = 404;
      res.end("no");
    });
    await new Promise<void>((r) => srv.listen(0, "127.0.0.1", r));
    const cache = mkdtempSync(join(tmpdir(), "ccdocs-test-"));
    try {
      const base = `http://127.0.0.1:${(srv.address() as AddressInfo).port}`;
      const { call } = await connect({
        CC_DOCS_CACHE_DIR: cache,
        CC_DOCS_BASE_URL: base,
      });
      const list = await call("list_pages", {});
      expect(list.text).toContain("zzfreshpage");
      expect(list.text).not.toMatch(/pwned|evilurl|dotted|\.\./);
      expect(
        (await call("read_page", { route: "zzfreshpage" })).text,
      ).toContain("quokkaquokka");
      expect(
        (await call("search_docs", { query: "quokkaquokka" })).text,
      ).toContain("zzfreshpage");
      expect(
        (await call("read_page", { route: "../../../../tmp/pwned" })).error,
      ).toBe(true);
      expect(
        hits.every((h) =>
          ["/llms-manifest.json", "/zzfreshpage.md", "/llms.txt"].includes(h),
        ),
      ).toBe(true);
      expect(
        readdirSync(cache, { recursive: true })
          .map(String)
          .filter((f) => !f.endsWith(".meta.json"))
          .sort(),
      ).toEqual([
        "site",
        "site/llms-manifest.json",
        "site/pages",
        "site/pages/zzfreshpage.md",
      ]);
    } finally {
      srv.close();
      rmSync(cache, { recursive: true, force: true });
    }
  });
  test("a non-https remote site is ignored with a warning", () => {
    const run = (value: string) =>
      Bun.spawnSync(
        [
          "bun",
          "-e",
          `import { baseUrl } from ${JSON.stringify(join(import.meta.dir, "..", "src", "fetcher.ts"))};console.log(baseUrl("X_BASE", "https://default.example"));`,
        ],
        { env: { ...process.env, X_BASE: value } },
      );
    for (const bad of ["http://evil.example", "ftp://x", "nonsense"]) {
      const r = run(bad);
      expect(r.stdout.toString().trim()).toBe("https://default.example");
      expect(r.stderr.toString()).toContain("ignoring X_BASE");
    }
    expect(run("http://127.0.0.1:9/").stdout.toString().trim()).toBe(
      "http://127.0.0.1:9",
    );
    expect(run("https://mirror.example/").stdout.toString().trim()).toBe(
      "https://mirror.example",
    );
  });
});

describe("platform tools", () => {
  test("search, read, and list work and report a live source", async () => {
    const p = mockPlatform();
    stops.push(p.stop);
    const { call } = await connect({ PLATFORM_DOCS_BASE_URL: p.url });
    const s = await call("search_platform_docs", { query: "prompt caching" });
    expect(s.error).toBe(false);
    expect(s.text).toContain("build-with-claude/prompt-caching");
    expect(s.text).toContain("Source: 127.0.0.1");
    expect(s.text).toContain("live");
    const g = await call("search_platform_docs", {
      query: "caching",
      group: "Getting Started",
    });
    expect(g.text).toContain("No platform pages match");
    const none = await call("search_platform_docs", { query: "zzzqqq" });
    expect(none.error).toBe(false);
    expect(none.text).toContain("No platform pages match");
    const r = await call("read_platform_page", {
      path: "/docs/en/build-with-claude/overview.md",
    });
    expect(r.error).toBe(false);
    expect(r.text).toContain("Zebrafinch");
    expect(r.text).toContain("<HomePage>");
    const sec = await call("read_platform_page", {
      path: "build-with-claude/overview",
      section_heading: "Tools",
    });
    expect(sec.text).toContain("Tool list here");
    expect(sec.text).not.toContain("Zebrafinch");
    const groups = await call("list_platform_pages", {});
    expect(groups.text).toContain("Getting Started: 2");
    expect(groups.text).toContain("Messages: 3");
    expect(groups.text).not.toMatch(/Erste|Deutsch|evil/);
    // Without `group` the structured result has counts only, no page list.
    expect(groups.structured?.["pages"]).toBeUndefined();
    expect(groups.structured?.["groups"]).toContainEqual({
      group: "Messages",
      count: 3,
    });
    const withGroup = await call("list_platform_pages", { group: "messages" });
    expect(withGroup.structured?.["pages"]).toHaveLength(3);
    const msgs = await call("list_platform_pages", { group: "messages" });
    expect(msgs.text).toContain("`api/messages`: Create a Message. Send");
    expect((await call("list_platform_pages", { group: "Nope" })).error).toBe(
      true,
    );
    const missing = await call("read_platform_page", {
      path: "build-with-claude/caching",
    });
    expect(missing.error).toBe(true);
    expect(missing.text).toContain("Closest matches");
    expect(missing.text).toContain("build-with-claude/prompt-caching");
  });

  test("a mirror serving the real llms.txt links still works", async () => {
    const p = mockPlatform(false);
    stops.push(p.stop);
    const { call } = await connect({ PLATFORM_DOCS_BASE_URL: p.url });
    const s = await call("search_platform_docs", { query: "prompt caching" });
    expect(s.text).toContain("build-with-claude/prompt-caching");
    expect(s.text).toContain(`${p.url}/docs/en/`);
    const r = await call("read_platform_page", {
      path: "build-with-claude/prompt-caching",
    });
    expect(r.error).toBe(false);
    expect(r.text).toContain("cache_control");
    expect(p.hits.some((h) => h.path.endsWith("prompt-caching.md"))).toBe(true);
  });

  test("a group name query does not boost every page of the group", async () => {
    const p = mockPlatform();
    stops.push(p.stop);
    const { call } = await connect({ PLATFORM_DOCS_BASE_URL: p.url });
    const s = await call("search_platform_docs", { query: "Messages" });
    // The page titled "Create a Message" has no phrase boost from the group name.
    expect(s.error).toBe(false);
    expect(s.text).toContain("api/messages");
  });

  test("no request inside the TTL", async () => {
    const p = mockPlatform();
    stops.push(p.stop);
    const { call } = await connect({ PLATFORM_DOCS_BASE_URL: p.url });
    await call("read_platform_page", { path: "build-with-claude/overview" });
    await call("search_platform_docs", { query: "streaming" });
    const n = p.hits.length;
    const again = await call("read_platform_page", {
      path: "build-with-claude/overview",
    });
    await call("search_platform_docs", { query: "streaming" });
    expect(p.hits.length).toBe(n);
    expect(again.text).toContain("cache (fetched");
  });

  test("after the TTL llms.txt is revalidated and a page is a plain GET", async () => {
    const p = mockPlatform();
    stops.push(p.stop);
    const { call } = await connect({
      PLATFORM_DOCS_BASE_URL: p.url,
      CC_DOCS_TTL_SCALE: "0",
    });
    await call("search_platform_docs", { query: "streaming" });
    await call("read_platform_page", { path: "build-with-claude/overview" });
    p.hits.length = 0;
    const s = await call("search_platform_docs", { query: "streaming" });
    expect(s.text).toContain("revalidated, 304");
    await call("read_platform_page", { path: "build-with-claude/overview" });
    const page = p.hits.filter((h) => h.path.endsWith("overview.md"));
    expect(page.length).toBe(1);
    expect(page[0]?.ims).toBeNull();
    expect(p.hits.find((h) => h.path === "/llms.txt")?.ims).not.toBeNull();
  });

  test("rejects bad paths without a request", async () => {
    const p = mockPlatform();
    stops.push(p.stop);
    const { call } = await connect({ PLATFORM_DOCS_BASE_URL: p.url });
    for (const path of [
      "../x",
      "a/../../x",
      "docs/de/home",
      "/docs/de/home.md",
      "https://evil.example/docs/en/home.md",
      "//evil.example/docs/en/home",
      "Home Page",
      "docs/home",
    ]) {
      const r = await call("read_platform_page", { path });
      expect(r.error).toBe(true);
      expect(r.text).toContain("Invalid path");
    }
    expect(p.hits.length).toBe(0);
    // The configured host and the bare path forms are accepted.
    expect(
      (
        await call("read_platform_page", {
          path: `${p.url}/docs/en/build-with-claude/overview`,
        })
      ).error,
    ).toBe(false);
  });

  test("offline: cached copy is served, uncached page is an error", async () => {
    const p = mockPlatform();
    const { call } = await connect({
      PLATFORM_DOCS_BASE_URL: p.url,
      CC_DOCS_TTL_SCALE: "0",
    });
    await call("read_platform_page", { path: "build-with-claude/overview" });
    await call("list_platform_pages", {});
    p.stop();
    const r = await call("read_platform_page", {
      path: "build-with-claude/overview",
    });
    expect(r.error).toBe(false);
    expect(r.text).toContain("Zebrafinch");
    expect(r.text).toContain("offline");
    const l = await call("list_platform_pages", {});
    expect(l.error).toBe(false);
    expect(l.text).toContain("offline");
    const other = await call("read_platform_page", {
      path: "build-with-claude/prompt-caching",
    });
    expect(other.error).toBe(true);
    expect(other.text).toContain("could not reach");
  });

  test("offline with nothing cached is an error", async () => {
    const p = mockPlatform();
    p.stop();
    const { call } = await connect({ PLATFORM_DOCS_BASE_URL: p.url });
    for (const [name, args] of [
      ["search_platform_docs", { query: "caching" }],
      ["list_platform_pages", {}],
    ] as const) {
      const r = await call(name, args);
      expect(r.error).toBe(true);
      expect(r.text).toContain("platform docs are offline and not cached yet");
    }
  });
});
