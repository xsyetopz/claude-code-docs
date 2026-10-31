// Run: bun test inspect/mcp/test   (needs inspect/mcp/dist/server.js; part of plugin:check)
import { afterAll, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CLI = join(import.meta.dir, "..", "src", "cli.ts");
const tmp = mkdtempSync(join(tmpdir(), "cc-inspect-cli-"));
mkdirSync(join(tmp, "versions"));
afterAll(() => rmSync(tmp, { recursive: true, force: true }));

const cli = (...args: string[]) =>
  Bun.spawnSync(["bun", CLI, ...args], {
    env: {
      ...process.env,
      CC_INSPECT_VERSIONS_DIR: join(tmp, "versions"),
      CC_INSPECT_LAUNCHER: join(tmp, "no-launcher"),
      CC_INSPECT_CACHE: join(tmp, "cache"),
    },
  });

test("cli calls each tool in order and prints its text", () => {
  const r = cli(
    "code",
    '{"action":"installs"}',
    "code",
    '{"action":"installs"}',
  );
  expect(r.exitCode).toBe(0);
  const out = r.stdout.toString();
  expect(out.match(/^=== code \{"action":"installs"\}$/gm)).toHaveLength(2);
});

test("cli refuses an odd argument count or bad JSON with exit 2", () => {
  const odd = cli("code");
  expect(odd.exitCode).toBe(2);
  expect(odd.stderr.toString()).toContain("usage:");
  const bad = cli("code", "{not json");
  expect(bad.exitCode).toBe(2);
  expect(bad.stderr.toString()).toContain("not JSON");
});

test("cli exits 1 when a tool reports an error", () => {
  const r = cli("code", '{"action":"read"}');
  expect(r.exitCode).toBe(1);
});
