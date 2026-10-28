// Shared setup for the server-*.test.ts files: each file gets its own config dir, fixture binary, and server.
// Needs inspect/mcp/dist/server.js; part of plugin:check.
// Builds a small Bun single-file executable as the "Claude Code" binary, and a config dir with one session.
import { afterAll, beforeAll } from "bun:test";
import {
  chmodSync,
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
export const SESSION = "11111111-2222-3333-4444-555555555555";

/** The program the fixture binary holds: an event emitter and two calls of it, minified by the build. */
export const APP = `
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

export type Result = {
  content: { type: string; text: string }[];
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
};

/** Registers the setup and teardown hooks of the calling file and gives it the server's client. */
export const startServer = () => {
  const tmp = mkdtempSync(join(tmpdir(), "cc-inspect-test-"));
  const config = join(tmp, "config");
  const versions = join(tmp, "versions");
  const client = new Client({ name: "test", version: "0" });
  const call = async (name: string, args: Record<string, unknown> = {}) =>
    (await client.callTool({ name, arguments: args })) as Result;

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
    // Stands in for `bunx @wakaru/cli@1.14.0`: counts its runs, records its env and cwd and leaves a file there,
    // fails while `wakaru-fail` exists, prints nothing while `wakaru-empty` exists, waits while `wakaru-slow` exists,
    // else prints a marker and the input.
    writeFileSync(
      join(tmp, "wakaru-stub"),
      `#!/bin/sh\necho run >> "${tmp}/wakaru-runs"\nenv > "${tmp}/wakaru-env"\npwd > "${tmp}/wakaru-cwd"\ntouch out\n[ -e "${tmp}/wakaru-fail" ] && { echo "stub broke" >&2; exit 3; }\n[ -e "${tmp}/wakaru-empty" ] && exit 0\n[ -e "${tmp}/wakaru-slow" ] && sleep 2\necho "// readable: $*"\nfor last; do :; done\ncat "$last"\n`,
    );
    chmodSync(join(tmp, "wakaru-stub"), 0o755);
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
          CC_INSPECT_WAKARU: join(tmp, "wakaru-stub"),
          CC_INSPECT_TEST_SECRET: "do-not-pass",
        },
      }),
    );
  }, 60000);

  afterAll(async () => {
    await client?.close();
    rmSync(tmp, { recursive: true, force: true });
  });

  return { tmp, client, call };
};
