import { expect, test } from "bun:test";
import {
  SEARCH_INDEX_FILE,
  SEARCH_INDEX_MAX,
  searchIndexJson,
} from "../src/search.ts";

const page = (route: string, body: string) => ({
  route,
  title: `T ${route}`,
  description: "  some\n desc ",
  text: `---\ntitle: x\n---\n${body}`,
});

test("the index holds each page's route, title, headings, and body without front matter", () => {
  const json = searchIndexJson("1.2.3", [
    page(
      "/start",
      "# Start\n\n## First Steps\n\ntext\n```\n## not a heading\n```\n",
    ),
  ]);
  const idx = JSON.parse(json);
  expect(idx.version).toBe("1.2.3");
  expect(idx.hash).toMatch(/^[0-9a-f]{64}$/);
  expect(idx.pages).toEqual([
    {
      route: "/start",
      title: "T /start",
      description: "some desc",
      headings: ["First Steps"],
      extra: "",
      body: "# Start\n\n## First Steps\n\ntext\n```\n## not a heading\n```\n",
    },
  ]);
});

test("the hash changes with the pages and stays the same for the same pages", () => {
  const a = JSON.parse(searchIndexJson("1", [page("/a", "x")])).hash;
  const b = JSON.parse(searchIndexJson("1", [page("/a", "y")])).hash;
  expect(a).not.toBe(b);
  expect(JSON.parse(searchIndexJson("1", [page("/a", "x")])).hash).toBe(a);
});

test("an index above the cap fails the build", () => {
  const big = "word ".repeat(SEARCH_INDEX_MAX / 5 + 10);
  expect(() => searchIndexJson("1", [page("/big", big)])).toThrow(
    /llms-search-index.json is .* bytes, above the cap of 8388608/,
  );
});

test("the index file name differs from the site search plugin's index", async () => {
  const src = await Bun.file(
    `${import.meta.dir}/../../../node_modules/@easyops-cn/docusaurus-search-local/dist/server/server/utils/generate.js`,
  ).text();
  const theirs = src.match(/searchIndexFilename = "([^"]+)"/)?.[1];
  expect(theirs).toBeDefined();
  expect(SEARCH_INDEX_FILE).not.toBe(theirs?.replace("{dir}", ""));
});
