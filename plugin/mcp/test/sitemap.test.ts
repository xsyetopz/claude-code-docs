// anthropic.ts: parseSitemap.
import { describe, expect, test } from "bun:test";
import { parseSitemap } from "../src/anthropic.ts";

const BASE = "https://www.anthropic.com";
const NS = "http://www.sitemaps.org/schemas/sitemap/0.9";

describe("parseSitemap", () => {
  test("reads loc and lastmod of the same url and keeps the first repeat", () => {
    const xml = `<urlset xmlns="${NS}">
      <url><loc>${BASE}/research/a?x=1&amp;y=2</loc></url>
      <url><loc>${BASE}/news/b</loc><lastmod>2025-01-02</lastmod></url>
      <url><loc>${BASE}/news/b</loc><lastmod>2030-01-01</lastmod></url>
    </urlset>`;
    const got = parseSitemap(xml, BASE);
    expect(got.map((e) => [e.path, e.lastmod])).toEqual([
      ["research/a", ""],
      ["news/b", "2025-01-02"],
    ]);
    expect(got[1]).toMatchObject({
      title: "B",
      section: "news",
      url: `${BASE}/news/b`,
    });
  });

  test("accepts prefixed element names", () => {
    const xml = `<ns:urlset xmlns:ns="${NS}"><ns:url><ns:loc>${BASE}/</ns:loc><ns:lastmod>2025-03-04</ns:lastmod></ns:url></ns:urlset>`;
    expect(parseSitemap(xml, BASE)).toEqual([
      {
        path: "index",
        title: "Anthropic",
        section: "site",
        lastmod: "2025-03-04",
        url: `${BASE}/`,
      },
    ]);
  });

  test("returns [] for malformed XML", () => {
    expect(parseSitemap("<urlset><url><loc>", BASE)).toEqual([]);
  });
});
