// Run: bun test inspect/mcp/test   (needs inspect/mcp/dist/server.js; part of plugin:check)
import { describe, expect, test } from "bun:test";
import { statSync } from "node:fs";
import { join } from "node:path";
import { KINDS } from "../src/surface/index.ts";
import { type Result, startServer } from "./server-harness.ts";

const { tmp, call } = startServer();

describe("surface", () => {
  const lines = (r: Result) => (r.content[0]?.text ?? "").split("\n").slice(1);

  test("surface lists one kind with module and offset", async () => {
    const r = await call("surface", { kind: "env", version: "9.9.9" });
    expect(r.isError).toBeUndefined();
    expect(r.structuredContent).toBeUndefined();
    expect(lines(r)).toContainEqual(
      expect.stringMatching(/^- CLAUDE_CODE_USE_BEDROCK .*\S+\.js:\d+$/),
    );
  });

  test("surface filters by name", async () => {
    const r = await call("surface", { kind: "env", name: "BEDROCK" });
    const names = lines(r).map((l) => l.split(" ")[1]);
    expect(names.sort()).toEqual([
      "ANTHROPIC_BEDROCK_BASE_URL",
      "CLAUDE_CODE_USE_BEDROCK",
    ]);
  });

  test("surface pages with limit and offset", async () => {
    const r = await call("surface", { kind: "env", limit: 1 });
    expect(r.content[0]?.text).toMatch(/^env: items 1-1 of \d+, next_offset 1/);
    expect(lines(r)).toHaveLength(1);
  });

  test("surface cuts a long reply at a line and gives the offset to continue", async () => {
    const r = await call("surface", {
      kind: "env",
      name: "FIXTURE_LONG",
      limit: 400,
    });
    const t = r.content[0]?.text ?? "";
    expect(t.length).toBeLessThanOrEqual(40000);
    const next = t.match(/next_offset (\d+)/);
    expect(next).not.toBeNull();
    const shown = lines(r).filter((l) => l.startsWith("- "));
    expect(Number(next?.[1])).toBe(shown.length);
    expect(shown.every((l) => /\S+\.js:\d+$/.test(l))).toBe(true);
    const rest = await call("surface", {
      kind: "env",
      name: "FIXTURE_LONG",
      limit: 400,
      offset: Number(next?.[1]),
    });
    const more = lines(rest).filter((l) => l.startsWith("- "));
    expect(more.length).toBeGreaterThan(0);
    expect(shown).not.toContain(more[0] as string);
  });

  test("surface without kind gives each kind with its count", async () => {
    const r = await call("surface");
    const t = r.content[0]?.text ?? "";
    for (const k of ["env", "flag", "gate", "tool", "mod-api"])
      expect(t).toMatch(new RegExp(`^- ${k}: (\\d+|error: .+)$`, "m"));
    expect(t).toMatch(/^- tool: 4$/m);
  });

  test("surface errors name the kinds and the installs", async () => {
    const k = await call("surface", { kind: "nope" });
    expect(k.isError).toBe(true);
    const t = k.content[0]?.text ?? "";
    expect(t).toContain("nope");
    // The reply lists every kind the server accepts, so a caller recovers from a wrong one without
    // another request. KINDS is the source of that list, so this fails if the list stops being sent.
    for (const kind of Object.keys(KINDS)) expect(t).toContain(kind);
    const b = await call("surface", { kind: "env", version: "0.0.1" });
    expect(b.isError).toBe(true);
    expect(b.content[0]?.text).toContain("9.9.9");
  });

  test("surface writes no file", async () => {
    const state = () =>
      [tmp]
        .flatMap((d) =>
          [...new Bun.Glob("**/*").scanSync({ cwd: d, dot: true })].map((f) => {
            const s = statSync(join(d, f));
            return `${f}:${s.size}:${s.mtimeMs}`;
          }),
        )
        .sort();
    const before = state();
    await call("surface");
    await call("surface", { kind: "env" });
    expect(state()).toEqual(before);
  });
});
