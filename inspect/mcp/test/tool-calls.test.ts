import { expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { type Line, listTranscripts, scanToolCalls } from "../src/sessions.ts";

const line = (n: number, json: NonNullable<Line["json"]>): Line => ({
  n,
  text: JSON.stringify(json),
  json,
});
const use = (name: string, input: unknown) => ({
  type: "tool_use",
  name,
  input,
});
const assistant = (n: number, ...content: unknown[]) =>
  line(n, { type: "assistant", message: { content } });

const lines: Line[] = [
  assistant(1, use("mcp__a__read", { route: "x" }), use("Bash", { c: "ls" })),
  assistant(2, use("mcp__a__read", { route: "y" })),
  line(3, {
    type: "user",
    message: { content: [use("mcp__a__read", { route: "z" })] },
  }),
  assistant(4, { type: "text", text: "hi" }, { type: "tool_result" }),
  { n: 5, text: "not json" },
];

test("counts tool_use blocks per name", () => {
  const r = scanToolCalls(lines);
  expect(
    Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v.count])),
  ).toEqual({
    mcp__a__read: 2,
    Bash: 1,
  });
  expect(r["Bash"]?.samples).toEqual([]);
});

test("plain filter keeps names containing the text, with samples", () => {
  const r = scanToolCalls(lines, { match: /a__read/, samples: 5 });
  expect(Object.keys(r)).toEqual(["mcp__a__read"]);
  expect(r["mcp__a__read"]?.samples).toEqual([
    '{"route":"x"}',
    '{"route":"y"}',
  ]);
});

test("regex filter matches several names", () => {
  const r = scanToolCalls(lines, { match: /^(Bash|mcp__a__.*)$/, samples: 1 });
  expect(Object.keys(r).sort()).toEqual(["Bash", "mcp__a__read"]);
  expect(r["mcp__a__read"]?.count).toBe(2);
  expect(r["mcp__a__read"]?.samples).toHaveLength(1);
});

test("a sample input is clipped to maxChars", () => {
  const r = scanToolCalls([assistant(1, use("T", { v: "x".repeat(500) }))], {
    match: /T/,
    samples: 1,
    maxChars: 20,
  });
  const s = r["T"]?.samples[0] as string;
  expect(s.startsWith('{"v":"xxxxxxxx')).toBe(true);
  expect(s.length).toBeLessThan(60);
  // The input is 508 chars as JSON, 20 are kept; only the count of the 488 cut chars is pinned.
  expect(s.length).toBeGreaterThan(20);
  expect(s).toMatch(/\b488\b/);
});

test("counts add into an existing result", () => {
  const into = scanToolCalls(lines);
  scanToolCalls(lines, {}, into);
  expect(into["Bash"]?.count).toBe(2);
});

test("listTranscripts includes subagent transcripts of a session", () => {
  const dir = mkdtempSync(join(tmpdir(), "cc-tc-"));
  const proj = join(dir, "projects", "p1");
  mkdirSync(join(proj, "s1", "subagents"), { recursive: true });
  writeFileSync(join(proj, "s1.jsonl"), "{}\n");
  writeFileSync(join(proj, "s1", "subagents", "agent-a.jsonl"), "{}\n");
  const old = process.env["CLAUDE_CONFIG_DIR"];
  process.env["CLAUDE_CONFIG_DIR"] = dir;
  try {
    expect(
      listTranscripts()
        .map((s) => s.id)
        .sort(),
    ).toEqual(["s1", "s1/agent-a"]);
  } finally {
    if (old === undefined) delete process.env["CLAUDE_CONFIG_DIR"];
    else process.env["CLAUDE_CONFIG_DIR"] = old;
  }
});
