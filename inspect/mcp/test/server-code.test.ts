// Run: bun test inspect/mcp/test   (needs inspect/mcp/dist/server.js; part of plugin:check)
import { describe, expect, test } from "bun:test";
import {
  existsSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { startServer } from "./server-harness.ts";

const { tmp, client, call } = startServer();

describe("binary", () => {
  test("code installs lists the versions dir", async () => {
    const r = await call("code", { action: "installs" });
    expect(r.structuredContent?.["installs"]).toMatchObject([
      { version: "9.9.9", current: false },
    ]);
  });

  test("code prepare cleans an install once and then reads the cache", async () => {
    const r = await call("code", { action: "prepare", version: "9.9.9" });
    expect(r.structuredContent).toMatchObject({
      version: "9.9.9",
      parsed: 1,
      dir: join(tmp, "cache", "9.9.9", "clean"),
    });
    expect(r.structuredContent?.["units"]).toBeGreaterThan(10);
  });

  test("code search and read find code by a literal anchor", async () => {
    const r = await call("code", {
      action: "search",
      query: '"api_error"',
      version: "9.9.9",
    });
    const [hit] = (r.structuredContent?.["hits"] ?? []) as {
      module: string;
      offset: number;
    }[];
    expect(hit?.module).toBe("app.js");
    const m = await call("code", {
      action: "read",
      module: "app.js",
      offset: hit?.offset ?? 0,
      length: 11,
    });
    expect(m.content[0]?.text).toEndWith('"api_error"');
  });

  test("code read with view readable runs Wakaru once, caches it, and pages the text", async () => {
    const fail = join(tmp, "wakaru-fail");
    writeFileSync(fail, "");
    const bad = await call("code", {
      action: "read",
      module: "app.js",
      view: "readable",
      version: "9.9.9",
    });
    expect(bad.isError).toBe(true);
    expect(
      existsSync(join(tmp, "cache", "9.9.9", "clean", "readable", "app.js")),
    ).toBe(false);
    rmSync(fail);
    const args = { action: "read", module: "app.js", view: "readable" };
    const cached = join(tmp, "cache", "9.9.9", "clean", "readable", "app.js");
    const empty = join(tmp, "wakaru-empty");
    writeFileSync(empty, "");
    const none = await call("code", { ...args, version: "9.9.9" });
    expect(none.isError).toBe(true);
    expect(existsSync(cached)).toBe(false);
    rmSync(empty);
    // Wakaru gets PATH and HOME only, runs in its own temp folder, and does not hold up other calls.
    const slow = join(tmp, "wakaru-slow");
    writeFileSync(slow, "");
    const pending = call("code", { ...args, version: "9.9.9", length: 60 });
    await Bun.sleep(300);
    let other = false;
    await call("code", { action: "installs" }).then(() => {
      other = !existsSync(cached);
    });
    const a = await pending;
    rmSync(slow);
    expect(other).toBe(true);
    // A boolean, so a failure does not print the environment.
    expect(
      readFileSync(join(tmp, "wakaru-env"), "utf8").includes(
        "CC_INSPECT_TEST_SECRET",
      ),
    ).toBe(false);
    const cwd = readFileSync(join(tmp, "wakaru-cwd"), "utf8").trim();
    expect(cwd).not.toBe(realpathSync(process.cwd()));
    expect(existsSync(cwd)).toBe(false);
    expect(a.content[0]?.text).toContain("--formatter");
    expect(a.structuredContent?.["text"]).toContain("--formatter");
    const b = await call("code", {
      ...args,
      version: "9.9.9",
      offset: 20,
      length: 30,
    });
    expect(b.structuredContent?.["text"]).toBe(
      String(a.structuredContent?.["text"]).slice(20, 50),
    );
    expect(readFileSync(cached, "utf8")).toStartWith("// readable:");
    expect(readFileSync(join(tmp, "wakaru-runs"), "utf8")).toBe(
      "run\nrun\nrun\n",
    );
  });

  test("surface object-keys follows a spread into a function", async () => {
    const r = await call("surface", {
      kind: "object-keys",
      module: "app.js",
      anchor: '"Bash"',
    });
    expect(r.structuredContent).toEqual({
      keys: {
        tool_name: { const: "Bash" },
        success: { const: "true" },
        "tool.kind": { enum: ["a", "b"] },
      },
      unresolved: [],
    });
  });

  test("surface event-keys merges the call sites of one event", async () => {
    const list = await call("surface", { kind: "event-keys" });
    expect(list.structuredContent?.["events"]).toEqual({
      api_error: 1,
      tool_result: 2,
    });
    const r = await call("surface", {
      kind: "event-keys",
      name: "claude_code.tool_result",
    });
    expect(r.structuredContent).toMatchObject({ sites: 2 });
    expect(Object.keys(r.structuredContent?.["keys"] as object).sort()).toEqual(
      ["duration_ms?", "success?", "tool.kind?", "tool_name"],
    );
  });

  test("surface tool-gates gives each base tool with its gate and the gate's functions", async () => {
    const r = await call("surface", { kind: "tool-gates" });
    const tools = r.structuredContent?.["tools"] as {
      name: string;
      when: string[];
      enabled?: string;
    }[];
    expect(tools.map((t) => [t.name, t.when.length])).toEqual([
      ["Shell", 0],
      ["Glob", 1],
      ["Grep", 1],
      ["CronCreate", 1],
    ]);
    expect(tools[1]?.when[0]).toContain(".has(");
    expect(tools.map((t) => t.enabled !== undefined)).toEqual([
      false,
      false,
      true,
      false,
    ]);
    expect(tools[2]?.enabled).toContain("process.env.GREP");
    const fns = Object.values(r.structuredContent?.["functions"] as object);
    expect(fns.some((s) => String(s).includes("process.env.LEAN"))).toBe(true);
  });
});

describe("find and prompts", () => {
  test("code find ranks the unit that holds the query words first", async () => {
    const r = await call("code", {
      action: "find",
      query: "sleep seconds blocked",
      version: "9.9.9",
    });
    const [top] = (r.structuredContent?.["found"] ?? []) as {
      hits: string[];
    }[];
    expect(top?.hits).toEqual(["sleep", "seconds", "blocked"]);
    expect(r.content[0]?.text).toContain("/^sleep");
    // the model sees only structuredContent, so the excerpt must be in it
    expect(JSON.stringify(r.structuredContent)).toContain("/^sleep");
  });

  test("prompts/list gives the release and explain prompts", async () => {
    const { prompts } = await client.listPrompts();
    expect(prompts.map((p) => p.name).sort()).toEqual([
      "explain_change",
      "release_review",
    ]);
    const p = await client.getPrompt({
      name: "release_review",
      arguments: { from: "1.0.0", to: "1.0.1" },
    });
    const t = (p.messages[0]?.content as { text?: string } | undefined)?.text;
    // The step that runs `notes` names both versions.
    const step = t?.split("\n").find((l) => l.includes("`notes`"));
    expect(step).toContain("1.0.1");
    expect(step).toContain("1.0.0");
  });
});
