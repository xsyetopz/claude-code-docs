// Run: bun test cli/test   (runs cli/bin/cc-docs against a local mock of the site and of platform.claude.com; no network)
import { afterAll, describe, expect, test } from "bun:test";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { searchIndexJson } from "../../plugin/mcp/src/search.ts";

const ROOT = join(import.meta.dir, "..", "..");
const BIN = join(ROOT, "cli", "bin", "cc-docs");
const SERVER = join(ROOT, "plugin", "mcp", "dist", "server.js");
const FIXTURES = join(ROOT, "plugin", "mcp", "test", "fixtures");
const SITE = join(FIXTURES, "site");
const PLATFORM = join(FIXTURES, "platform");

const stops: (() => void)[] = [];
afterAll(() => {
  for (const f of stops) f();
});

const tmp = (): string => {
  const d = mkdtempSync(join(tmpdir(), "ccdocs-cli-test-"));
  stops.push(() => rmSync(d, { recursive: true, force: true }));
  return d;
};

type Manifest = { route: string; title: string; description: string }[];

/** Mock docs site: the fixture manifest (URLs rewritten), pages, schemas, and a llms-search-index.json. */
const mockSite = () => {
  const srv = Bun.serve({
    port: 0,
    hostname: "127.0.0.1",
    fetch(req) {
      const path = new URL(req.url).pathname;
      const base = new URL(req.url).origin;
      const manifest = readFileSync(join(SITE, "manifest.json"), "utf8");
      if (path === "/llms-manifest.json")
        return new Response(
          manifest.replaceAll(
            "https://xsyetopz.github.io/claude-code-docs",
            base,
          ),
        );
      if (path === "/llms.txt")
        return new Response("# T\n\n> Docs for Claude Code 2.1.305.\n");
      if (path === "/llms-search-index.json")
        return new Response(
          searchIndexJson(
            "test",
            (JSON.parse(manifest) as Manifest).map((e) => ({
              ...e,
              text: readFileSync(
                join(
                  SITE,
                  e.route === "/" ? "index.md" : `${e.route.slice(1)}.md`,
                ),
                "utf8",
              ),
            })),
          ),
        );
      const file = join(SITE, path.slice(1));
      if (
        path.includes("..") ||
        !existsSync(file) ||
        statSync(file).isDirectory()
      )
        return new Response("no", { status: 404 });
      return new Response(readFileSync(file));
    },
  });
  stops.push(() => srv.stop(true));
  return { url: `http://127.0.0.1:${srv.port}`, stop: () => srv.stop(true) };
};

/** Mock platform.claude.com: llms.txt and the fixture pages. */
const mockPlatform = () => {
  const srv = Bun.serve({
    port: 0,
    hostname: "127.0.0.1",
    fetch(req) {
      const path = new URL(req.url).pathname;
      const base = new URL(req.url).origin;
      if (path === "/llms.txt")
        return new Response(
          readFileSync(join(PLATFORM, "llms.txt"), "utf8").replaceAll(
            "https://platform.claude.com",
            base,
          ),
        );
      const m = /^\/docs\/en\/([a-z0-9/-]+)\.md$/.exec(path);
      const file = m ? join(PLATFORM, `${m[1]?.replaceAll("/", "__")}.md`) : "";
      return m && existsSync(file)
        ? new Response(readFileSync(file))
        : new Response("no", { status: 404 });
    },
  });
  stops.push(() => srv.stop(true));
  return { url: `http://127.0.0.1:${srv.port}` };
};

/** The environment of a run: the real one without the cc-docs settings, plus `env`. */
const envOf = (env: Record<string, string>): Record<string, string> => {
  const clean = Object.fromEntries(
    Object.entries(process.env).filter(
      (e): e is [string, string] =>
        typeof e[1] === "string" &&
        !/^(CC_DOCS_|CLAUDE_PLUGIN_DATA|PLATFORM_DOCS_)/.test(e[0]),
    ),
  );
  return { ...clean, ...env };
};

/** Runs the bundle. Async, so the mock servers of this process keep answering. */
const cc = async (args: string[], env: Record<string, string> = {}) => {
  const p = Bun.spawn(["bun", BIN, ...args], {
    env: envOf(env),
    stdout: "pipe",
    stderr: "pipe",
  });
  const [out, err, code] = await Promise.all([
    new Response(p.stdout).text(),
    new Response(p.stderr).text(),
    p.exited,
  ]);
  return { code, out, err };
};

/** Calls one tool of the MCP server over stdio (JSON-RPC lines) and returns the tool result. */
const mcpCall = async (
  env: Record<string, string>,
  name: string,
  args: Record<string, unknown>,
) => {
  const p = Bun.spawn(["bun", SERVER], {
    env: envOf(env),
    stdin: "pipe",
    stdout: "pipe",
    stderr: "ignore",
  });
  const send = (m: object) => p.stdin.write(`${JSON.stringify(m)}\n`);
  send({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "test", version: "0" },
    },
  });
  send({ jsonrpc: "2.0", method: "notifications/initialized" });
  send({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: { name, arguments: args },
  });
  await p.stdin.flush();
  const reader = p.stdout.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) throw new Error("the server closed before it answered");
      buf += decoder.decode(value);
      for (const line of buf.split("\n")) {
        if (!line.startsWith("{")) continue;
        const m = JSON.parse(line) as { id?: number; result?: unknown };
        if (m.id === 2)
          return m.result as {
            content: { text: string }[];
            structuredContent?: { hits: { route: string }[] };
          };
      }
    }
  } finally {
    p.kill();
  }
};

const withSite = () => {
  const site = mockSite();
  const cache = tmp();
  return {
    site,
    cache,
    env: { CC_DOCS_BASE_URL: site.url, CC_DOCS_CACHE_DIR: cache },
  };
};

describe("subcommands", () => {
  test("search then read a route from its output, each ending with a Source line", async () => {
    const { env } = withSite();
    const s = await cc(["search", "PreToolUse"], env);
    expect(s.code).toBe(0);
    expect(s.out).toContain("configure/hooks");
    expect(s.out).toMatch(/Source: .*\n$/);
    const route = /route `([^`]+)`/.exec(s.out)?.[1];
    expect(route).toBe("configure/hooks");
    const r = await cc(["read", route as string], env);
    expect(r.code).toBe(0);
    expect(r.out).toContain("The `PreToolUse` hook runs before a tool call.");
    expect(r.out).toMatch(/Source: .*\n$/);
  });

  test("read --section prints one H2 section", async () => {
    const { env } = withSite();
    const r = await cc(
      ["read", "configure/hooks", "--section", "Timeouts"],
      env,
    );
    expect(r.code).toBe(0);
    expect(r.out).toContain("A hook command stops after the timeout.");
    expect(r.out).not.toContain("Hook handlers return JSON.");
  });

  test("search joins words and --limit caps the hits", async () => {
    const { env } = withSite();
    const s = await cc(["search", "hook", "--limit", "1", "--json"], env);
    expect(s.code).toBe(0);
    expect(JSON.parse(s.out).hits).toHaveLength(1);
    const words = await cc(["search", "debounced", "status"], env);
    expect(words.out).toContain("configure/status-line");
  });

  test("list shows the sections, and list <prefix> one section", async () => {
    const { env } = withSite();
    const all = await cc(["list"], env);
    expect(all.code).toBe(0);
    expect(all.out).toContain("`configure/hooks`: Hook Events");
    expect(all.out).toMatch(/Source: .*\n$/);
    const one = await cc(["list", "configure"], env);
    expect(one.out).toContain("`configure/status-line`");
    expect(one.out).not.toContain("`index`");
  });

  test("schema prints an outline and a property", async () => {
    const { env } = withSite();
    const o = await cc(["schema", "tools"], env);
    expect(o.code).toBe(0);
    expect(o.out).toContain("1 definitions");
    const p = await cc(["schema", "tools", "BashInput.command"], env);
    expect(p.code).toBe(0);
    expect(p.out).toContain("The command to run");
    expect(p.out).toMatch(/Source: .*\n$/);
  });

  test("--source platform reads the platform docs", async () => {
    const platform = mockPlatform();
    const env = {
      PLATFORM_DOCS_BASE_URL: platform.url,
      CC_DOCS_CACHE_DIR: tmp(),
    };
    const s = await cc(
      ["search", "prompt caching", "--source", "platform"],
      env,
    );
    expect(s.code).toBe(0);
    expect(s.out).toContain("build-with-claude/prompt-caching");
    const r = await cc(
      ["read", "build-with-claude/overview", "--source", "platform"],
      env,
    );
    expect(r.code).toBe(0);
    expect(r.out).toContain("Zebrafinch");
    const l = await cc(["list", "--source", "platform"], env);
    expect(l.out).toContain("Messages: 3");
  });
});

describe("--json", () => {
  test("stdout is one JSON value that parses, for every subcommand", async () => {
    const { env } = withSite();
    for (const args of [
      ["search", "PreToolUse"],
      ["read", "configure/hooks"],
      ["list"],
      ["schema", "tools"],
    ]) {
      const r = await cc([...args, "--json"], env);
      expect(r.code).toBe(0);
      expect(() => JSON.parse(r.out)).not.toThrow();
    }
    const s = JSON.parse(
      (await cc(["search", "PreToolUse", "--json"], env)).out,
    );
    expect(s.hits[0].route).toBe("configure/hooks");
  });
});

describe("same answers as the MCP server", () => {
  test("search lists the same routes in the same order as search_docs", async () => {
    const { site } = withSite();
    const cli = await cc(["search", "hook", "--json"], {
      CC_DOCS_BASE_URL: site.url,
      CC_DOCS_CACHE_DIR: tmp(),
    });
    const mcp = await mcpCall(
      { CC_DOCS_BASE_URL: site.url, CC_DOCS_CACHE_DIR: tmp() },
      "search_docs",
      { query: "hook" },
    );
    const routes = (hits: { route: string }[]) => hits.map((h) => h.route);
    const fromMcp = routes(mcp.structuredContent?.hits ?? []);
    expect(fromMcp.length).toBeGreaterThan(1);
    expect(routes(JSON.parse(cli.out).hits)).toEqual(fromMcp);
    // The text lists the same routes too.
    const text = (mcp.content as { text: string }[])[0]?.text ?? "";
    const cliText = (
      await cc(["search", "hook"], {
        CC_DOCS_BASE_URL: site.url,
        CC_DOCS_CACHE_DIR: tmp(),
      })
    ).out;
    const inText = (t: string) =>
      [...t.matchAll(/route `([^`]+)`/g)].map((m) => m[1]);
    expect(inText(cliText)).toEqual(inText(text));
  });
});

describe("exit codes", () => {
  test("an unknown page exits 1 and stderr names the closest routes", async () => {
    const { env } = withSite();
    const miss = await cc(["read", "no/such/page"], env);
    expect(miss.code).toBe(1);
    expect(miss.err).toContain('No page with route "no/such/page"');
    expect(miss.out).toBe("");
    const near = await cc(["read", "configure/hook"], env);
    expect(near.code).toBe(1);
    expect(near.err).toContain("Closest matches");
    expect(near.err).toContain("configure/hooks");
  });

  test("a search with no hit exits 1", async () => {
    const { env } = withSite();
    const r = await cc(["search", "zzzqqqxxx"], env);
    expect(r.code).toBe(1);
    expect(r.err).toContain("No pages match");
    expect(r.out).toBe("");
  });

  test("an unknown schema property exits 1", async () => {
    const { env } = withSite();
    const r = await cc(["schema", "tools", "BashInput.decider"], env);
    expect(r.code).toBe(1);
    expect(r.err).toContain("unconfirmed");
  });

  test("a usage error exits 2 and stderr shows the usage", async () => {
    const { env } = withSite();
    for (const args of [
      ["frobnicate"],
      [],
      ["search"],
      ["read"],
      ["read", "a", "b"],
      ["search", "x", "--limit", "0"],
      ["search", "x", "--source", "other"],
      ["search", "x", "--nope"],
      ["list", "--section", "x"],
      ["schema", "tools", "--source", "docs"],
    ]) {
      const r = await cc(args, env);
      expect(r.code).toBe(2);
      expect(r.err).toContain("Usage: cc-docs");
      expect(r.out).toBe("");
    }
  });

  test("--help prints the usage on stdout and exits 0", async () => {
    const top = await cc(["--help"]);
    expect(top.code).toBe(0);
    expect(top.out).toContain("search <query>");
    expect(top.out).toContain("--source docs|platform");
    for (const sub of ["search", "read", "list", "schema"]) {
      const r = await cc([sub, "--help"]);
      expect(r.code).toBe(0);
      expect(r.out).toContain(`Usage: cc-docs ${sub}`);
    }
  });
});

describe("cache", () => {
  test("a page read once is served offline from the cache", async () => {
    const { site, env } = withSite();
    const live = await cc(["read", "configure/hooks"], env);
    expect(live.out).toMatch(/Source: .*, live/);
    site.stop();
    const off = await cc(["read", "configure/hooks"], {
      ...env,
      CC_DOCS_TTL_SCALE: "0",
    });
    expect(off.code).toBe(0);
    expect(off.out).toContain("PreToolUse");
    expect(off.out).toMatch(/Source: .*cache \(.*offline\)/);
  });

  test("the cache folder order is CC_DOCS_CACHE_DIR, CLAUDE_PLUGIN_DATA, then the home folder", async () => {
    const site = mockSite();
    const data = tmp();
    const a = await cc(["read", "configure/hooks"], {
      CC_DOCS_BASE_URL: site.url,
      CLAUDE_PLUGIN_DATA: data,
    });
    expect(a.code).toBe(0);
    expect(
      existsSync(join(data, "cache", "site", "pages", "configure", "hooks.md")),
    ).toBe(true);
    const dir = tmp();
    const data2 = tmp();
    await cc(["read", "configure/hooks"], {
      CC_DOCS_BASE_URL: site.url,
      CC_DOCS_CACHE_DIR: dir,
      CLAUDE_PLUGIN_DATA: data2,
    });
    expect(
      existsSync(join(dir, "site", "pages", "configure", "hooks.md")),
    ).toBe(true);
    expect(existsSync(join(data2, "cache"))).toBe(false);
    // With neither set, the cache is under the home folder (a temp HOME here).
    const home = tmp();
    await cc(["read", "configure/hooks"], {
      CC_DOCS_BASE_URL: site.url,
      HOME: home,
      XDG_CACHE_HOME: "",
    });
    expect(
      existsSync(
        join(
          home,
          ".cache",
          "claude-code-docs",
          "site",
          "pages",
          "configure",
          "hooks.md",
        ),
      ),
    ).toBe(true);
  });
});

describe("packaging", () => {
  test("the bundle is one executable file that starts with a bun shebang", () => {
    expect(readFileSync(BIN, "utf8").startsWith("#!/usr/bin/env bun\n")).toBe(
      true,
    );
    expect(statSync(BIN).mode & 0o111).not.toBe(0);
  });

  test("the bundle runs by itself as a command", async () => {
    const p = Bun.spawn([BIN, "--help"], {
      env: envOf({}),
      stdout: "pipe",
      stderr: "pipe",
    });
    expect(await p.exited).toBe(0);
    expect(await new Response(p.stdout).text()).toContain("Usage: cc-docs");
  });

  test("the plugin has a skill and a bin, and no MCP server", () => {
    const cli = join(ROOT, "cli");
    expect(existsSync(join(cli, ".mcp.json"))).toBe(false);
    expect(existsSync(join(cli, "bin", "cc-docs"))).toBe(true);
    expect(existsSync(join(cli, "skills", "cc-docs-cli", "SKILL.md"))).toBe(
      true,
    );
    const plugin = JSON.parse(
      readFileSync(join(cli, ".claude-plugin", "plugin.json"), "utf8"),
    );
    expect(plugin.name).toBe("cc-docs-cli");
    expect(plugin.description).toContain("only in Claude Code");
    expect(plugin.mcpServers).toBeUndefined();
  });

  test("the registry package is cc-docs, with a bin, files, and the plugin version", () => {
    const cli = join(ROOT, "cli");
    const pkg = JSON.parse(readFileSync(join(cli, "package.json"), "utf8"));
    const plugin = JSON.parse(
      readFileSync(join(cli, ".claude-plugin", "plugin.json"), "utf8"),
    );
    expect(pkg.name).toBe("cc-docs");
    expect(pkg.bin).toEqual({ "cc-docs": "bin/cc-docs" });
    expect(pkg.files).toEqual(["bin/"]);
    expect(pkg.version).toBe(plugin.version);
    expect(pkg.dependencies).toBeUndefined();
  });
});
