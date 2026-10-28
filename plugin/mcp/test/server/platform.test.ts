// Platform tools of the docs server. Part of: bun test plugin/mcp/test
import { afterAll, describe, expect, test } from "bun:test";
import { cleanup, connect, mockPlatform, stops } from "./harness.ts";

afterAll(cleanup);

describe("platform tools", () => {
  test("search, read, and list work and report a live source", async () => {
    const p = mockPlatform();
    stops.push(p.stop);
    const { call } = await connect({ PLATFORM_DOCS_BASE_URL: p.url });
    const s = await call("search_docs", {
      source: "platform",
      query: "prompt caching",
    });
    expect(s.error).toBe(false);
    expect(s.text).toContain("build-with-claude/prompt-caching");
    expect(s.text).toContain("Source: 127.0.0.1");
    expect(s.text).toContain("live");
    const g = await call("search_docs", {
      source: "platform",
      query: "caching",
      section: "Getting Started",
    });
    expect(g.text).toContain("No platform pages match");
    const none = await call("search_docs", {
      source: "platform",
      query: "zzzqqq",
    });
    expect(none.error).toBe(false);
    expect(none.text).toContain("No platform pages match");
    const r = await call("read_page", {
      source: "platform",
      route: "/docs/en/build-with-claude/overview.md",
    });
    expect(r.error).toBe(false);
    expect(r.seen).toContain("Zebrafinch");
    expect(r.text).toContain("<HomePage>");
    const sec = await call("read_page", {
      source: "platform",
      route: "build-with-claude/overview",
      section_heading: "Tools",
    });
    expect(sec.text).toContain("Tool list here");
    expect(sec.text).not.toContain("Zebrafinch");
    const groups = await call("list_pages", { source: "platform" });
    expect(groups.text).toContain("Getting Started: 2");
    expect(groups.text).toContain("Messages: 3");
    expect(groups.text).not.toMatch(/Erste|Deutsch|evil/);
    // Without a group the structured result has counts only, no page list.
    expect(groups.structured?.["pages"]).toBeUndefined();
    expect(groups.structured?.["groups"]).toContainEqual({
      group: "Messages",
      count: 3,
    });
    const withGroup = await call("list_pages", {
      source: "platform",
      section: "messages",
    });
    expect(withGroup.structured?.["pages"]).toHaveLength(3);
    const msgs = await call("list_pages", {
      source: "platform",
      section: "messages",
    });
    expect(msgs.text).toContain("`api/messages`: Create a Message. Send");
    expect(
      (await call("list_pages", { source: "platform", section: "Nope" })).error,
    ).toBe(true);
    const missing = await call("read_page", {
      source: "platform",
      route: "build-with-claude/caching",
    });
    expect(missing.error).toBe(true);
    expect(missing.text).toContain("Closest matches");
    expect(missing.text).toContain("build-with-claude/prompt-caching");
  });

  test("a mirror serving the real llms.txt links still works", async () => {
    const p = mockPlatform(false);
    stops.push(p.stop);
    const { call } = await connect({ PLATFORM_DOCS_BASE_URL: p.url });
    const s = await call("search_docs", {
      source: "platform",
      query: "prompt caching",
    });
    expect(s.text).toContain("build-with-claude/prompt-caching");
    expect(s.text).toContain(`${p.url}/docs/en/`);
    const r = await call("read_page", {
      source: "platform",
      route: "build-with-claude/prompt-caching",
    });
    expect(r.error).toBe(false);
    expect(r.text).toContain("cache_control");
    expect(p.hits.some((h) => h.path.endsWith("prompt-caching.md"))).toBe(true);
  });

  test("a group name query does not boost every page of the group", async () => {
    const p = mockPlatform();
    stops.push(p.stop);
    const { call } = await connect({ PLATFORM_DOCS_BASE_URL: p.url });
    const s = await call("search_docs", {
      source: "platform",
      query: "Messages",
    });
    // The page titled "Create a Message" has no phrase boost from the group name.
    expect(s.error).toBe(false);
    expect(s.text).toContain("api/messages");
  });

  test("no request inside the TTL", async () => {
    const p = mockPlatform();
    stops.push(p.stop);
    const { call } = await connect({ PLATFORM_DOCS_BASE_URL: p.url });
    await call("read_page", {
      source: "platform",
      route: "build-with-claude/overview",
    });
    await call("search_docs", { source: "platform", query: "streaming" });
    const n = p.hits.length;
    const again = await call("read_page", {
      source: "platform",
      route: "build-with-claude/overview",
    });
    await call("search_docs", { source: "platform", query: "streaming" });
    expect(p.hits.length).toBe(n);
    expect(again.text).toContain("cache (fetched");
  });

  test("after the TTL llms.txt is revalidated and a page is a plain GET", async () => {
    const p = mockPlatform();
    stops.push(p.stop);
    const { call } = await connect({
      PLATFORM_DOCS_BASE_URL: p.url,
      CLAWDIPEDIA_TTL_SCALE: "0",
    });
    await call("search_docs", { source: "platform", query: "streaming" });
    await call("read_page", {
      source: "platform",
      route: "build-with-claude/overview",
    });
    p.hits.length = 0;
    const s = await call("search_docs", {
      source: "platform",
      query: "streaming",
    });
    expect(s.text).toContain("revalidated, 304");
    await call("read_page", {
      source: "platform",
      route: "build-with-claude/overview",
    });
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
      const r = await call("read_page", { source: "platform", route: path });
      expect(r.error).toBe(true);
      expect(r.text).toContain("Invalid path");
    }
    expect(p.hits.length).toBe(0);
    // The configured host and the bare path forms are accepted.
    expect(
      (
        await call("read_page", {
          source: "platform",
          route: `${p.url}/docs/en/build-with-claude/overview`,
        })
      ).error,
    ).toBe(false);
  });

  test("offline: cached copy is served, uncached page is an error", async () => {
    const p = mockPlatform();
    const { call } = await connect({
      PLATFORM_DOCS_BASE_URL: p.url,
      CLAWDIPEDIA_TTL_SCALE: "0",
    });
    await call("read_page", {
      source: "platform",
      route: "build-with-claude/overview",
    });
    await call("list_pages", { source: "platform" });
    p.stop();
    const r = await call("read_page", {
      source: "platform",
      route: "build-with-claude/overview",
    });
    expect(r.error).toBe(false);
    expect(r.text).toContain("Zebrafinch");
    expect(r.text).toContain("offline");
    const l = await call("list_pages", { source: "platform" });
    expect(l.error).toBe(false);
    expect(l.text).toContain("offline");
    const other = await call("read_page", {
      source: "platform",
      route: "build-with-claude/prompt-caching",
    });
    expect(other.error).toBe(true);
    expect(other.text).toContain("could not reach");
  });

  test("offline with nothing cached is an error", async () => {
    const p = mockPlatform();
    p.stop();
    const { call } = await connect({ PLATFORM_DOCS_BASE_URL: p.url });
    for (const [name, args] of [
      ["search_docs", { source: "platform", query: "caching" }],
      ["list_pages", { source: "platform" }],
    ] as const) {
      const r = await call(name, args);
      expect(r.error).toBe(true);
      expect(r.text).toContain("platform docs are offline and not cached yet");
    }
  });
});
