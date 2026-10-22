// Run: bun test inspect/mcp/test   (needs inspect/mcp/dist/server.js; part of plugin:check)
// Builds a small Bun single-file executable as the "Claude Code" binary, and a config dir with one session.
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const SERVER = join(import.meta.dir, "..", "dist", "server.js");
const tmp = mkdtempSync(join(tmpdir(), "cc-inspect-test-"));
const config = join(tmp, "config");
const versions = join(tmp, "versions");
const SESSION = "11111111-2222-3333-4444-555555555555";
let client: Client;

/** The program the fixture binary holds: an event emitter and two calls of it, minified by the build. */
const APP = `
const base = () => ({ "session.id": "s" });
export async function emit(name, attrs) {
  globalThis.out = { ...base(), "event.name": name, "event.sequence": 1, ...attrs };
}
const extra = (x) => ({ "tool.kind": x ? "a" : "b" });
emit("tool_result", { tool_name: "Bash", success: "true", ...extra(globalThis.x) });
emit("tool_result", { tool_name: "Read", duration_ms: 5 });
emit("api_error", { status: 500 });
`;

const LINES = [
  { type: "custom-title", customTitle: "Fixture", sessionId: SESSION },
  { type: "last-prompt", explicit: "yes", sessionId: SESSION },
  { type: "no-such-type" },
];

beforeAll(async () => {
  const project = join(config, "projects", "-tmp-demo");
  mkdirSync(project, { recursive: true });
  writeFileSync(
    join(project, `${SESSION}.jsonl`),
    `${LINES.map((l) => JSON.stringify(l)).join("\n")}\nnot json\n`,
  );
  mkdirSync(versions);
  writeFileSync(join(tmp, "app.mjs"), APP);
  const b = Bun.spawnSync([
    "bun",
    "build",
    "--compile",
    "--minify",
    join(tmp, "app.mjs"),
    `--outfile=${join(tmp, "app.js")}`,
  ]);
  if (b.exitCode !== 0) throw new Error(b.stderr.toString());
  symlinkSync(join(tmp, "app.js"), join(versions, "9.9.9"));
  client = new Client({ name: "test", version: "0" });
  await client.connect(
    new StdioClientTransport({
      command: "bun",
      args: [SERVER],
      env: {
        ...(Object.fromEntries(
          Object.entries(process.env).filter(([, v]) => v !== undefined),
        ) as Record<string, string>),
        CLAUDE_CONFIG_DIR: config,
        CC_INSPECT_VERSIONS_DIR: versions,
        CC_INSPECT_LAUNCHER: join(tmp, "no-launcher"),
      },
    }),
  );
}, 60000);

afterAll(async () => {
  await client?.close();
  rmSync(tmp, { recursive: true, force: true });
});

type Result = {
  content: { type: string; text: string }[];
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
};
const call = async (name: string, args: Record<string, unknown> = {}) =>
  (await client.callTool({ name, arguments: args })) as Result;

describe("sessions", () => {
  test("list_sessions finds the session under CLAUDE_CONFIG_DIR", async () => {
    const r = await call("list_sessions");
    const s = r.structuredContent?.["sessions"] as {
      id: string;
      project: string;
    }[];
    expect(s.map((x) => [x.id, x.project])).toEqual([[SESSION, "-tmp-demo"]]);
  });

  test("read_session pages and filters by type", async () => {
    const r = await call("read_session", { session: "1111", limit: 1 });
    expect(r.structuredContent).toMatchObject({ total: 4, next_offset: 1 });
    const t = await call("read_session", {
      session: SESSION,
      type: "last-prompt",
    });
    expect(t.structuredContent?.["total"]).toBe(1);
  });

  test("search_sessions returns the line of a match", async () => {
    const r = await call("search_sessions", { pattern: "Fixture" });
    expect(r.structuredContent?.["hits"]).toMatchObject([
      { session: SESSION, line: 1, type: "custom-title" },
    ]);
  });

  test("validate_session fails wrong types, unknown types, and non-JSON lines", async () => {
    const r = await call("validate_session", { session: SESSION });
    const failures = r.structuredContent?.["failures"] as { line: number }[];
    expect(r.structuredContent?.["failed"]).toBe(3);
    expect(failures.map((f) => f.line)).toEqual([2, 3, 4]);
  });

  test("an unknown session is a tool error", async () => {
    const r = await call("read_session", { session: "nope" });
    expect(r.isError).toBe(true);
  });
});

describe("binary", () => {
  test("list_installs lists the versions dir", async () => {
    const r = await call("list_installs");
    expect(r.structuredContent?.["installs"]).toMatchObject([
      { version: "9.9.9", current: false },
    ]);
  });

  test("search_binary and read_module find code by a literal anchor", async () => {
    const r = await call("search_binary", {
      pattern: '"api_error"',
      binary: "9.9.9",
    });
    const [hit] = (r.structuredContent?.["hits"] ?? []) as {
      module: string;
      offset: number;
    }[];
    expect(hit?.module).toBe("app.js");
    const m = await call("read_module", {
      module: "app.js",
      offset: hit?.offset ?? 0,
      length: 11,
    });
    expect(m.content[0]?.text).toEndWith('"api_error"');
  });

  test("resolve_object follows a spread into a function", async () => {
    const r = await call("resolve_object", {
      module: "app.js",
      anchor: '"Bash"',
    });
    // A computed value (here a ternary) is shown as its code.
    expect(r.structuredContent).toEqual({
      keys: {
        tool_name: { const: "Bash" },
        success: { const: "true" },
        "tool.kind": { unknown: expect.stringContaining('?"a":"b"') },
      },
      unresolved: [],
    });
  });

  test("resolve_event merges the call sites of one event", async () => {
    const list = await call("resolve_event");
    expect(list.structuredContent?.["events"]).toEqual({
      api_error: 1,
      tool_result: 2,
    });
    const r = await call("resolve_event", { name: "claude_code.tool_result" });
    expect(r.structuredContent).toMatchObject({ sites: 2 });
    expect(Object.keys(r.structuredContent?.["keys"] as object).sort()).toEqual(
      ["duration_ms?", "success?", "tool.kind?", "tool_name"],
    );
  });
});
