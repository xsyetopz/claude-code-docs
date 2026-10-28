// The evaluation file: its shape, the tools and arguments it names, and the docs routes it reads.
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { DOC_SOURCES } from "../src/core/shared.ts";

const ROOT = join(import.meta.dir, "..", "..", "..");
const xml = readFileSync(join(import.meta.dir, "..", "evaluation.xml"), "utf8");
const fromXml = (t: string) =>
  t.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
const pairs = [
  ...xml.matchAll(
    /<qa_pair>\s*<question>([\s\S]*?)<\/question>\s*<answer>([\s\S]*?)<\/answer>\s*<\/qa_pair>/g,
  ),
].map(([, q, a]) => ({ q: fromXml(q ?? ""), a: fromXml(a ?? "") }));

describe("plugin/mcp/evaluation.xml", () => {
  test("every qa_pair has a question and an answer", () => {
    expect(pairs.length).toBe((xml.match(/<qa_pair>/g) ?? []).length);
    for (const p of pairs) {
      expect(p.q.trim()).not.toBe("");
      expect(p.a.trim()).not.toBe("");
    }
  });

  test("questions are distinct", () => {
    expect(new Set(pairs.map((p) => p.q)).size).toBe(pairs.length);
  });

  test("exercises each tool and each source", () => {
    const all = pairs.map((p) => p.q).join("\n");
    for (const tool of ["search_docs", "read_page", "list_pages", "get_schema"])
      expect(all).toContain(tool);
    for (const s of DOC_SOURCES) expect(all).toContain(`source "${s}"`);
    for (const arg of ["section_heading", "offset", "max_chars", "limit"])
      expect(all).toContain(arg);
  });

  test("every route that read_page reads is a page of docs/", () => {
    const routes = pairs
      .map((p) => /read_page on route (\S+)/.exec(p.q)?.[1])
      .filter((r): r is string => r !== undefined);
    expect(routes.length).toBeGreaterThan(0);
    for (const r of routes)
      expect(
        existsSync(join(ROOT, "docs", `${r}.md`)) ||
          existsSync(join(ROOT, "docs", r, "index.md")) ||
          // a folder page named like its folder, such as prompts/tools/tools.md
          existsSync(join(ROOT, "docs", r, `${r.split("/").pop()}.md`)),
      ).toBe(true);
  });
});
