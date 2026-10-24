// Run: bun test inspect/mcp/test   (needs inspect/mcp/dist/server.js; part of plugin:check)
// Builds a small Bun single-file executable as the "Claude Code" binary, and a config dir with one session.
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  statSync,
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
const build = (d) => ({ isEnabled: () => true, ...d });
const Glob = build({ name: "Glob" });
const Grep = build({ name: "Grep", isEnabled() { return process.env.GREP === "1"; } });
const Shell = build({ name: "Shell" });
const Cron = build({ name: "CronCreate" });
const off = () => null;
function lean() { return process.env.LEAN === "1"; }
function hidden() { return lean() ? new Set(["Glob"]) : new Set(); }
function allTools() {
  const o = off();
  return [Shell, ...[Glob, Grep].filter((t) => !hidden().has(t.name)), ...(lean() ? [Cron] : []), ...(o ? [o] : [])];
}
globalThis.api = { getAllBaseTools: allTools };
globalThis.envs = [process.env.CLAUDE_CODE_USE_BEDROCK, process.env.ANTHROPIC_BEDROCK_BASE_URL, process.env.FIXTURE_OTHER];
`;

/** 400 env reads with 150-character names: one page of them is over the reply cap. */
const LONG_ENV = Array.from(
  { length: 400 },
  (_, i) =>
    `process.env.FIXTURE_LONG_${String(i).padStart(3, "0")}_${"X".repeat(130)}`,
).join(",");

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
  writeFileSync(
    join(tmp, "app.mjs"),
    `${APP}\nglobalThis.longs = [${LONG_ENV}];\nexport * from ${JSON.stringify(join(import.meta.dir, "fixtures/clean-app.ts"))};\n`,
  );
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
        CC_INSPECT_CACHE: join(tmp, "cache"),
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

describe("tools", () => {
  test("the server offers 4 tools, each with a one-sentence description", async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual([
      "code",
      "release",
      "sessions",
      "surface",
    ]);
    for (const t of tools)
      expect(t.description?.match(/[.!?](\s|$)/g)).toHaveLength(1);
  });

  test("an inherited name such as constructor is an unknown action", async () => {
    const r = await call("release", { action: "constructor" });
    expect(r.isError).toBe(true);
    expect(r.content[0]?.text).toBe(
      'Error: unknown action "constructor"; actions: diff, notes, explain',
    );
  });

  test("an unknown action is an error that lists the actions", async () => {
    const r = await call("sessions", { action: "nope" });
    expect(r.isError).toBe(true);
    expect(r.content[0]?.text).toBe(
      'Error: unknown action "nope"; actions: list, read, search, validate',
    );
  });
});

describe("sessions", () => {
  test("sessions list finds the session under CLAUDE_CONFIG_DIR", async () => {
    const r = await call("sessions", { action: "list" });
    const s = r.structuredContent?.["sessions"] as {
      id: string;
      project: string;
    }[];
    expect(s.map((x) => [x.id, x.project])).toEqual([[SESSION, "-tmp-demo"]]);
  });

  test("sessions read pages and filters by type", async () => {
    // Claude Code 2.1.309 (`ds` in chunk-gf8e163f.js) shows the model only structuredContent when set.
    const seen = (r: Result) =>
      r.structuredContent
        ? JSON.stringify(r.structuredContent)
        : (r.content[0]?.text ?? "");
    const r = await call("sessions", {
      action: "read",
      session: "1111",
      limit: 1,
    });
    expect(seen(r)).toContain("lines 1-1 of 4, next_offset 1\n1: {");
    const t = await call("sessions", {
      action: "read",
      session: SESSION,
      type: "last-prompt",
    });
    expect(seen(t)).toMatch(
      /of 1 with type "last-prompt"\n\d+: \{.*last-prompt/,
    );
  });

  test("sessions search returns the line of a match", async () => {
    const r = await call("sessions", { action: "search", query: "Fixture" });
    expect(r.structuredContent?.["hits"]).toMatchObject([
      { session: SESSION, line: 1, type: "custom-title" },
    ]);
  });

  test("sessions validate fails wrong types, unknown types, and non-JSON lines", async () => {
    const r = await call("sessions", { action: "validate", session: SESSION });
    const failures = r.structuredContent?.["failures"] as { line: number }[];
    expect(r.structuredContent?.["failed"]).toBe(3);
    expect(failures.map((f) => f.line)).toEqual([2, 3, 4]);
  });

  test("an unknown session is a tool error", async () => {
    const r = await call("sessions", {
      action: "read",
      session: "nope",
    });
    expect(r.isError).toBe(true);
  });
});

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
    expect(t).toContain("`release` `notes` with version 1.0.1 and from 1.0.0");
  });
});

describe("release", () => {
  test("release notes marks each line from the cached notes", async () => {
    mkdirSync(join(tmp, "cache", "9.9.9"), { recursive: true });
    writeFileSync(
      join(tmp, "cache", "9.9.9", "notes.md"),
      "- Fixed `tengu_example_gate` handling\n- [Cloud sessions] Improved the checklist view\n",
    );
    const r = await call("release", {
      action: "notes",
      version: "9.9.9",
      from: "9.9.9",
    });
    expect(
      ((r.structuredContent?.["lines"] ?? []) as { status: string }[]).map(
        (l) => l.status,
      ),
    ).toEqual(["unmatched", "unmatched"]);
    const none = await call("release", { action: "notes", version: "9.9.9" });
    expect(none.content[0]?.text).toBe(
      "Error: no install older than 9.9.9; give from",
    );
  });

  test("release diff of one install with itself has no change", async () => {
    const r = await call("release", {
      action: "diff",
      from: "9.9.9",
      to: "9.9.9",
    });
    expect(r.structuredContent?.["counts"]).toEqual({
      changed: 0,
      added: 0,
      gone: 0,
    });
  });
});

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
    expect(rest.content[0]?.text).toContain(`items ${Number(next?.[1]) + 1}-`);
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
    expect(k.content[0]?.text).toMatch(/unknown kind "nope"; kinds: .*env/);
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
