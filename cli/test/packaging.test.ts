// Run: bun test cli/test   (checks the files of the clawdipedia-docs-cli plugin and its registry package; no network)
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..", "..");
const BIN = join(ROOT, "cli", "bin", "clawdipedia");

describe("packaging", () => {
  test("the bundle is one executable file that starts with a bun shebang", () => {
    expect(readFileSync(BIN, "utf8").startsWith("#!/usr/bin/env bun\n")).toBe(
      true,
    );
    expect(statSync(BIN).mode & 0o111).not.toBe(0);
  });

  test("the bundle runs by itself as a command", async () => {
    const p = Bun.spawn([BIN, "--help"], {
      env: process.env,
      stdout: "pipe",
      stderr: "pipe",
    });
    expect(await p.exited).toBe(0);
    // The help text names the command; its wording is not pinned.
    expect(await new Response(p.stdout).text()).toContain("clawdipedia");
  });

  test("the plugin has a skill and a bin, and no MCP server", () => {
    const cli = join(ROOT, "cli");
    expect(existsSync(join(cli, ".mcp.json"))).toBe(false);
    expect(existsSync(join(cli, "bin", "clawdipedia"))).toBe(true);
    expect(
      existsSync(join(cli, "skills", "clawdipedia-docs-cli", "SKILL.md")),
    ).toBe(true);
    const plugin = JSON.parse(
      readFileSync(join(cli, ".claude-plugin", "plugin.json"), "utf8"),
    );
    expect(plugin.name).toBe("clawdipedia-docs-cli");
    expect(plugin.displayName).toBe("Anthropic Docs CLI");
    expect(plugin.mcpServers).toBeUndefined();
  });

  test("the registry package is clawdipedia-docs, with a bin, files, and the plugin version", () => {
    const cli = join(ROOT, "cli");
    const pkg = JSON.parse(readFileSync(join(cli, "package.json"), "utf8"));
    const plugin = JSON.parse(
      readFileSync(join(cli, ".claude-plugin", "plugin.json"), "utf8"),
    );
    expect(pkg.name).toBe("clawdipedia-docs");
    expect(pkg.bin).toEqual({ clawdipedia: "bin/clawdipedia" });
    expect(pkg.files).toEqual(["bin/"]);
    expect(pkg.version).toBe(plugin.version);
    expect(pkg.dependencies).toBeUndefined();
  });
});
