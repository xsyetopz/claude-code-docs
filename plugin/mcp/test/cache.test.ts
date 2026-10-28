// Unit tests for the disk cache: eviction order under the size cap.
import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DiskCache } from "../src/cache.ts";

const V = { url: "http://x/" };
const dirs: string[] = [];
afterEach(() => {
  delete process.env["CLAWDIPEDIA_CACHE_CAP_BYTES"];
  for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true });
});

const put = (c: DiskCache, rel: string, n: number) => {
  Bun.sleepSync(3);
  c.put(rel, "x".repeat(n), V);
};

const scenario = (c: DiskCache) => {
  put(c, "platform/llms.txt", 10);
  put(c, "site/llms-manifest.json", 10);
  put(c, "site/pages/a.md", 100);
  put(c, "platform/pages/old.md", 100);
  put(c, "platform/pages/new.md", 100);
  // 320 bytes: under the cap of 350, nothing is evicted yet.
  expect(c.get("platform/pages/old.md")).toBeDefined();
  put(c, "platform/pages/newer.md", 100);
  // Over the cap: the oldest platform page goes first.
  expect(c.get("platform/pages/old.md")).toBeUndefined();
  expect(c.get("platform/pages/new.md")).toBeDefined();
  put(c, "site/pages/b.md", 200);
  // Still over: the remaining platform pages go before any site page.
  expect(c.get("platform/pages/new.md")).toBeUndefined();
  expect(c.get("platform/pages/newer.md")).toBeUndefined();
  expect(c.get("site/pages/a.md")).toBeDefined();
  expect(c.get("site/pages/b.md")).toBeDefined();
  expect(c.get("platform/llms.txt")).toBeDefined();
  expect(c.get("site/llms-manifest.json")).toBeDefined();
};

describe("cache cap", () => {
  test("disk: oldest platform pages go first, index files stay", () => {
    const root = mkdtempSync(join(tmpdir(), "ccdocs-cache-"));
    dirs.push(root);
    process.env["CLAWDIPEDIA_CACHE_CAP_BYTES"] = "350";
    scenario(new DiskCache(root));
  });
  test("memory fallback follows the same order", () => {
    process.env["CLAWDIPEDIA_CACHE_CAP_BYTES"] = "350";
    scenario(new DiskCache("/proc/nonexistent/cache"));
  });
});
