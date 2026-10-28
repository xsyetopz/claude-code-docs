// Site tests for the docs server: search, offline reads, cache rules, a hostile site. Part of: bun test plugin/mcp/test
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
import {
  cleanup,
  connect,
  mockSite,
  newState,
  sourceNumbers,
  sourceOf,
  stops,
} from "./harness.ts";

afterAll(cleanup);

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
    expect(none.error).toBe(false);
    // The empty answer has no structured hits; a known route is absent.
    expect(none.text).not.toContain("configure/");
    const conf = await call("search_docs", {
      query: "PreToolUse",
      section: "Configure",
    });
    expect(conf.text).toContain("configure/hooks");
  });

  test("offline: cached pages, the index, and the list are served", async () => {
    const state = newState();
    const site = mockSite(state);
    const { call } = await connect({
      CLAWDIPEDIA_BASE_URL: site.url,
      CLAWDIPEDIA_TTL_SCALE: "0",
    });
    const live = await call("read_page", { route: "configure/hooks" });
    expect(live.error).toBe(false);
    expect(state.hits.some((h) => h.path === "/configure/hooks.md")).toBe(true);
    await call("search_docs", { query: "hook" });
    site.stop();
    const r = await call("read_page", { route: "configure/hooks" });
    expect(r.error).toBe(false);
    expect(r.text).toContain("PreToolUse");
    // By design search keeps its in-process index (refreshed in the background), so its
    // source stays the index and not an offline state until the refresh lands.
    const s = await call("search_docs", { query: "PreToolUse" });
    expect(s.error).toBe(false);
    expect(s.text).toContain("configure/hooks");
    // Only the count is pinned (the index covers the 3 fixture pages), not the wording.
    expect(sourceNumbers(s)).toContain(3);
    expect(sourceOf(s).state).not.toBe("stale-offline");
    const l = await call("list_pages", {});
    expect(l.error).toBe(false);
    expect(sourceOf(l).state).toBe("stale-offline");
  });

  test("a stale-offline page list recovers soon after the network returns", async () => {
    const site = mockSite();
    const { call } = await connect({
      CLAWDIPEDIA_BASE_URL: site.url,
      CLAWDIPEDIA_TTL_SCALE: "0.001",
    });
    expect(sourceOf(await call("list_pages", {})).state).toBe("live");
    site.stop();
    await Bun.sleep(700);
    expect(sourceOf(await call("list_pages", {})).state).toBe("stale-offline");
    const back = mockSite(newState(), site.port);
    stops.push(back.stop);
    // The stale-offline TTL is 60 ms at this scale; the normal manifest TTL is 600 ms.
    await Bun.sleep(150);
    const r = await call("list_pages", {});
    expect(r.error).toBe(false);
    expect(sourceOf(r).state).not.toBe("stale-offline");
  });

  test("a partial search index is rebuilt soon", async () => {
    const state = newState();
    state.noIndex = true;
    state.gone.add("/configure/hooks.md");
    const site = mockSite(state);
    stops.push(site.stop);
    const { call } = await connect({
      CLAWDIPEDIA_BASE_URL: site.url,
      CLAWDIPEDIA_TTL_SCALE: "0.001",
    });
    // "handlers" is only in the body of Hook Events, the page that is missing.
    const first = await call("search_docs", { query: "handlers" });
    expect(first.error).toBe(false);
    expect(first.text).not.toContain("configure/hooks");
    const fetched = () =>
      state.hits.filter((h) => h.path === "/configure/hooks.md").length;
    const before = fetched();
    state.gone.delete("/configure/hooks.md");
    await Bun.sleep(150);
    // This call starts the rebuild in the background; a later one sees it.
    await call("search_docs", { query: "handlers" });
    await Bun.sleep(500);
    const again = await call("search_docs", { query: "handlers" });
    expect(fetched()).toBeGreaterThan(before);
    expect(again.text).toContain("configure/hooks");
  });

  test("offline with nothing cached is an error", async () => {
    const site = mockSite();
    site.stop();
    const { call } = await connect({ CLAWDIPEDIA_BASE_URL: site.url });
    const r = await call("list_pages", {});
    expect(r.error).toBe(true);
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
      CLAWDIPEDIA_BASE_URL: site.url,
      CLAWDIPEDIA_CACHE_DIR: cache,
      CLAWDIPEDIA_TTL_SCALE: "0",
    };
    const first = await connect(env);
    expect(
      (await first.call("list_pages", {})).structured?.["claudeCode"],
    ).toBe("2.1.305");
    state.llms404 = true;
    // A new process, same cache: llms.txt is a 404 now, so the cached copy supplies the version.
    const second = await connect(env);
    const l = await second.call("list_pages", {});
    expect(l.error).toBe(false);
    expect(l.structured?.["claudeCode"]).toBe("2.1.305");
    expect(existsSync(join(cache, "site", "llms.txt"))).toBe(true);
    // With no cached copy the 404 only drops the version line; tools still work.
    const bare = await connect({ ...env, CLAWDIPEDIA_CACHE_DIR: bareCache });
    const b = await bare.call("list_pages", {});
    expect(b.error).toBe(false);
    expect(b.structured?.["claudeCode"]).toBeUndefined();
  });
});

describe("site cache rules", () => {
  test("a matching ETag gives a 304 and the cached body", async () => {
    const state = newState();
    state.etag = true;
    const site = mockSite(state);
    stops.push(site.stop);
    const { call } = await connect({
      CLAWDIPEDIA_BASE_URL: site.url,
      CLAWDIPEDIA_TTL_SCALE: "0",
    });
    const a = await call("read_page", { route: "configure/hooks" });
    expect(a.error).toBe(false);
    expect(state.hits.some((h) => h.path === "/configure/hooks.md")).toBe(true);
    state.hits.length = 0;
    const b = await call("read_page", { route: "configure/hooks" });
    expect(b.error).toBe(false);
    expect(b.text).toContain("PreToolUse");
    expect(state.hits.find((h) => h.path === "/configure/hooks.md")?.inm).toBe(
      '"v1"',
    );
  });

  test("a page 404 deletes the cached copy and suggests near pages", async () => {
    const state = newState();
    const site = mockSite(state);
    stops.push(site.stop);
    const { call, cache } = await connect({
      CLAWDIPEDIA_BASE_URL: site.url,
      CLAWDIPEDIA_TTL_SCALE: "0",
    });
    expect((await call("read_page", { route: "configure/hooks" })).error).toBe(
      false,
    );
    const file = join(cache, "site", "pages", "configure", "hooks.md");
    expect(existsSync(file)).toBe(true);
    state.gone.add("/configure/hooks.md");
    const r = await call("read_page", { route: "configure/hooks" });
    expect(r.error).toBe(true);
    // The near pages are a list of routes, one `  - <route>` per line, and not the missing page.
    expect(r.text).toMatch(/^ {2}- configure\/status-line$/m);
    expect(r.text).not.toMatch(/^ {2}- configure\/hooks$/m);
    expect(existsSync(file)).toBe(false);
  });

  test("a truncated cached body is fetched again", async () => {
    const state = newState();
    const site = mockSite(state);
    stops.push(site.stop);
    const { call, cache } = await connect({ CLAWDIPEDIA_BASE_URL: site.url });
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
    const { call } = await connect({ CLAWDIPEDIA_BASE_URL: site.url });
    const r = await call("read_page", { route: "configure/hooks" });
    expect(r.error).toBe(true);
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
        CLAWDIPEDIA_CACHE_DIR: cache,
        CLAWDIPEDIA_BASE_URL: base,
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
          [
            "/llms-manifest.json",
            "/zzfreshpage.md",
            "/llms.txt",
            "/llms-search-index.json",
          ].includes(h),
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
          `import { baseUrl } from ${JSON.stringify(join(import.meta.dir, "..", "..", "src", "fetcher.ts"))};console.log(baseUrl("X_BASE", "https://default.example"));`,
        ],
        { env: { ...process.env, X_BASE: value } },
      );
    for (const bad of ["http://evil.example", "ftp://x", "nonsense"]) {
      const r = run(bad);
      expect(r.stdout.toString().trim()).toBe("https://default.example");
      // The warning names the variable; its wording is not pinned.
      expect(r.stderr.toString()).toContain("X_BASE");
    }
    for (const [good, base] of [
      ["http://127.0.0.1:9/", "http://127.0.0.1:9"],
      ["https://mirror.example/", "https://mirror.example"],
    ] as const) {
      const r = run(good);
      expect(r.stdout.toString().trim()).toBe(base);
      expect(r.stderr.toString()).toBe("");
    }
  });
});
