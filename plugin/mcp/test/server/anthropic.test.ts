// Anthropic site tools (www.anthropic.com) of the docs server. Part of: bun test plugin/mcp/test
import { afterAll, describe, expect, test } from "bun:test";
import { cleanup, connect, mockAnthropic, sourceOf, stops } from "./harness.ts";

afterAll(cleanup);

const PAGE = "research/building-effective-agents";

const start = async (env: Record<string, string> = {}) => {
  const p = mockAnthropic();
  stops.push(p.stop);
  const c = await connect({ ANTHROPIC_SITE_BASE_URL: p.url, ...env });
  return { p, ...c };
};

describe("anthropic tools", () => {
  test("search matches slug words, filters by section, and misses cleanly", async () => {
    const { call } = await start();
    const s = await call("search_docs", {
      source: "anthropic",
      query: "effective agents",
    });
    expect(s.error).toBe(false);
    expect(s.text).toContain(PAGE);
    expect(s.text).toContain("Building Effective Agents");
    expect(sourceOf(s).origin).toMatch(/^127\.0\.0\.1:\d+$/);
    const news = await call("search_docs", {
      source: "anthropic",
      query: "agents",
      section: "news",
    });
    expect(news.text).toContain("news/claude-agents-launch");
    expect(news.text).not.toContain(PAGE);
    const none = await call("search_docs", {
      source: "anthropic",
      query: "agents",
      section: "legal",
    });
    expect(none.error).toBe(false);
    expect(none.text).not.toContain("agents-launch");
    expect(none.text).not.toContain(PAGE);
  });

  test("list counts sections and drops other hosts", async () => {
    const { call } = await start();
    const groups = await call("list_pages", { source: "anthropic" });
    expect(groups.structured?.["groups"]).toEqual([
      { group: "site", count: 1 },
      { group: "research", count: 2 },
      { group: "news", count: 2 },
      { group: "legal", count: 1 },
      { group: "about-anthropic-interviewer", count: 1 },
    ]);
    expect(groups.text).not.toContain("evil");
    const r = await call("list_pages", {
      source: "anthropic",
      section: "Research",
    });
    const pages = r.structured?.["pages"] as {
      route: string;
      description: string;
    }[];
    expect(pages.map((x) => x.route)).toEqual([
      PAGE,
      "research/alignment-faking",
    ]);
    // The date is the sitemap lastmod; only the date is pinned, not the sentence around it.
    expect(pages.map((x) => x.description).join(" ")).toContain("2026-03-23");
    expect(
      (await call("list_pages", { source: "anthropic", section: "Nope" }))
        .error,
    ).toBe(true);
  });

  test("read converts the HTML to markdown", async () => {
    const { call, p } = await start();
    const r = await call("read_page", { source: "anthropic", route: PAGE });
    expect(r.error).toBe(false);
    expect(r.text).toContain("Building effective AI agents");
    expect(r.text).toContain("# Building effective agents");
    expect(r.text).toContain("Narwhal");
    expect(r.text).toContain("Agents & workflows");
    expect(r.text).toContain(
      `[alignment paper](${p.url}/research/alignment-faking)`,
    );
    expect(r.text).toContain("- Prompt **chaining**");
    expect(r.text).toContain("```\nif (a < b) {");
    expect(r.text).not.toMatch(/JUNK|<[a-z]/);
  });

  test("read one heading, and an offset past the end", async () => {
    const { call } = await start();
    const sec = await call("read_page", {
      source: "anthropic",
      route: `/${PAGE}`,
      section_heading: "Patterns",
    });
    expect(sec.text).toContain("Routing");
    expect(sec.text).not.toContain("Narwhal");
    const past = await call("read_page", {
      source: "anthropic",
      route: PAGE,
      offset: 100000,
    });
    expect(past.error).toBe(true);
  });

  test("rejects bad paths without a request", async () => {
    const { call, p } = await start();
    for (const path of [
      "../x",
      "a/../b",
      "research/Building",
      "https://evil.example/research/x",
      "//evil.example/x",
      "research/.hidden",
      "a b",
    ]) {
      const r = await call("read_page", { source: "anthropic", route: path });
      expect(r.error).toBe(true);
    }
    expect(p.hits.length).toBe(0);
    const full = await call("read_page", {
      source: "anthropic",
      route: `${p.url}/${PAGE}`,
    });
    expect(full.error).toBe(false);
  });

  test("the root page is the route index", async () => {
    const { call, p } = await start();
    const r = await call("read_page", { source: "anthropic", route: "/" });
    // The mock has no root page: the answer names the route that "/" became.
    expect(r.error).toBe(true);
    expect(r.text).toContain("index");
    expect(p.hits.some((h) => h.path === "/")).toBe(true);
  });

  test("a missing page lists the closest matches", async () => {
    const { call } = await start();
    const missing = await call("read_page", {
      source: "anthropic",
      route: "research/building-agents",
    });
    expect(missing.error).toBe(true);
    expect(missing.text).toContain(PAGE);
  });

  test("offline: cached copy is served, uncached page is an error", async () => {
    const { call, p } = await start({ CLAWDIPEDIA_TTL_SCALE: "0" });
    await call("read_page", { source: "anthropic", route: PAGE });
    await call("list_pages", { source: "anthropic" });
    p.stop();
    const r = await call("read_page", { source: "anthropic", route: PAGE });
    expect(r.error).toBe(false);
    expect(r.text).toContain("Narwhal");
    const l = await call("list_pages", { source: "anthropic" });
    expect(l.error).toBe(false);
    expect(sourceOf(l).state).toBe("stale-offline");
    const other = await call("read_page", {
      source: "anthropic",
      route: "news/model-welfare",
    });
    expect(other.error).toBe(true);
  });

  test("offline with nothing cached is an error", async () => {
    const p = mockAnthropic();
    p.stop();
    const { call } = await connect({ ANTHROPIC_SITE_BASE_URL: p.url });
    const r = await call("search_docs", {
      source: "anthropic",
      query: "agents",
    });
    expect(r.error).toBe(true);
  });
});
