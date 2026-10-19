// Run: bun test plugin/mcp/test   (needs plugin/mcp/dist/server.js and snapshot/; part of plugin:check)
import { afterAll, describe, expect, test } from "bun:test";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import http from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const SERVER = join(import.meta.dir, "..", "dist", "server.js");
const clients: Client[] = [];

async function connect(env: Record<string, string> = {}) {
  const c = new Client({ name: "test", version: "0" });
  const clean = Object.fromEntries(
    Object.entries(process.env).filter(
      (e): e is [string, string] => typeof e[1] === "string",
    ),
  );
  await c.connect(
    new StdioClientTransport({
      command: "bun",
      args: [SERVER],
      env: { ...clean, ...env },
    }),
  );
  clients.push(c);
  const call = async (name: string, args: Record<string, unknown>) => {
    const r = await c.callTool({ name, arguments: args });
    const first = (r.content as { text: string }[])[0];
    return { error: r.isError === true, text: first?.text ?? "" };
  };
  return { call };
}
afterAll(async () => {
  for (const c of clients) await c.close();
});

describe("get_schema", () => {
  test("follows additionalProperties and items", async () => {
    const { call } = await connect();
    const a = await call("get_schema", {
      name: "settings",
      property: "hooks.PreToolUse",
    });
    expect(a.error).toBe(false);
    expect(a.text).toContain('"type": "array"');
    const b = await call("get_schema", {
      name: "settings",
      property: "hooks.PreToolUse.[]",
    });
    expect(b.text).toContain('"matcher"');
  });
  test("prototype keys are not found", async () => {
    const { call } = await connect();
    for (const property of ["__proto__", "hooks.__proto__", "constructor"])
      expect(
        (await call("get_schema", { name: "settings", property })).error,
      ).toBe(true);
  });
});

describe("refresh with a hostile site", () => {
  test("rejects bad entries, keeps paths inside the cache, re-indexes", async () => {
    const hits: string[] = [];
    const srv = http.createServer((req, res) => {
      hits.push(req.url ?? "");
      const base = `http://127.0.0.1:${(srv.address() as AddressInfo).port}`;
      const e = (route: string, url = `${base}${route}`) => ({
        route,
        title: `T ${route}`,
        description: "d",
        section: "S",
        md: `${url}.md`,
        url,
      });
      if (req.url === "/llms-manifest.json")
        return void res.end(
          JSON.stringify([
            e("/zzfreshpage"),
            e("/../../../../tmp/pwned"),
            e("/a/../../x"),
            { ...e("/evilurl"), url: "https://evil.example/x" },
            { route: 5 },
            null,
            e("/dotted.md"),
          ]),
        );
      if (req.url === "/zzfreshpage.md")
        return void res.end(
          "---\ntitle: F\n---\n\n# Fresh\nquokkaquokka marker\n",
        );
      res.statusCode = 404;
      res.end("no");
    });
    await new Promise<void>((r) => srv.listen(0, "127.0.0.1", r));
    const cache = mkdtempSync(join(tmpdir(), "ccdocs-test-"));
    try {
      const base = `http://127.0.0.1:${(srv.address() as AddressInfo).port}`;
      const { call } = await connect({
        CLAUDE_CODE_DOCS_REFRESH: "1",
        XDG_CACHE_HOME: cache,
        CLAUDE_CODE_DOCS_SITE: base,
      });
      await call("search_docs", { query: "quokkaquokka" }); // builds the index before the refresh lands
      await Bun.sleep(800);
      const list = await call("list_pages", {});
      expect(list.text).toContain("zzfreshpage");
      expect(list.text).not.toMatch(/pwned|evilurl|dotted|\.\./);
      expect(
        (await call("read_page", { route: "zzfreshpage" })).text,
      ).toContain("quokkaquokka");
      expect(
        (await call("search_docs", { query: "quokkaquokka" })).text,
      ).toContain("zzfreshpage");
      expect(
        (await call("read_page", { route: "../../../../tmp/pwned" })).error,
      ).toBe(true);
      expect(
        hits.every(
          (h) => h === "/llms-manifest.json" || h === "/zzfreshpage.md",
        ),
      ).toBe(true);
      expect(
        readdirSync(join(cache, "claude-code-docs"), {
          recursive: true,
        }).sort(),
      ).toEqual(["llms-manifest.json", "pages", "pages/zzfreshpage.md"]);
    } finally {
      srv.close();
      rmSync(cache, { recursive: true, force: true });
    }
  });
  test("a non-https remote site is ignored", async () => {
    const { call } = await connect({
      CLAUDE_CODE_DOCS_REFRESH: "1",
      XDG_CACHE_HOME: mkdtempSync(join(tmpdir(), "ccdocs-test-")),
      CLAUDE_CODE_DOCS_SITE: "http://evil.example",
    });
    expect((await call("list_pages", { section: "start" })).error).toBe(false);
  });
});
