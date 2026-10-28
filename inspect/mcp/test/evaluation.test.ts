// The evaluation file: its shape, the tools and actions it names, and the fixture it reads.
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { KINDS } from "../src/surface/index.ts";

const ROOT = join(import.meta.dir, "..", "..", "..");
const xml = readFileSync(join(import.meta.dir, "..", "evaluation.xml"), "utf8");
const pairs = [
  ...xml.matchAll(
    /<qa_pair>\s*<question>([\s\S]*?)<\/question>\s*<answer>([\s\S]*?)<\/answer>\s*<\/qa_pair>/g,
  ),
].map(([, q, a]) => ({ q: q ?? "", a: a ?? "" }));
const all = pairs.map((p) => p.q).join("\n");

describe("inspect/mcp/evaluation.xml", () => {
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

  test("exercises each tool and its actions", () => {
    for (const tool of ["code", "surface", "sessions", "release"])
      expect(all).toContain(`Use ${tool} `);
    for (const action of ["search", "read", "modules", "tool-calls", "diff"])
      expect(all).toContain(`action "${action}"`);
  });

  test("every kind that a question passes is a kind of surface", () => {
    const kinds = [...all.matchAll(/kind "([^"]+)"/g)].map((m) => m[1] ?? "");
    expect(kinds.length).toBeGreaterThan(0);
    for (const k of kinds) expect(Object.keys(KINDS)).toContain(k);
  });

  test("the transcript fixture that sessions questions read exists", () => {
    const paths = [...all.matchAll(/session "([^"]+\.jsonl)"/g)].map(
      (m) => m[1] ?? "",
    );
    expect(paths.length).toBeGreaterThan(0);
    for (const p of paths) expect(existsSync(join(ROOT, p))).toBe(true);
  });
});
