// Run: bun test inspect/mcp/test   (needs inspect/mcp/dist/server.js; part of plugin:check)
import { describe, expect, test } from "bun:test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { APP, startServer } from "./server-harness.ts";

const { tmp, call } = startServer();

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

  test("release diff puts each listed change in the structured data", async () => {
    writeFileSync(
      join(tmp, "app2.mjs"),
      APP.replace('process.env.GREP === "1"', 'process.env.GREP === "2"'),
    );
    const b = Bun.spawnSync([
      "bun",
      "build",
      "--compile",
      "--minify",
      join(tmp, "app2.mjs"),
      `--outfile=${join(tmp, "app2.js")}`,
    ]);
    if (b.exitCode !== 0) throw new Error(b.stderr.toString());
    const r = await call("release", {
      action: "diff",
      from: join(tmp, "app.js"),
      to: join(tmp, "app2.js"),
    });
    const changes = (r.structuredContent?.["changes"] ?? []) as {
      kind: string;
      from?: { module: string; offset: number };
      to?: { module: string; offset: number };
      diff: string[];
    }[];
    const grep = changes.find((c) => c.diff.join("\n").includes('"2"'));
    expect(grep?.kind).toBe("changed");
    expect(typeof grep?.from?.offset).toBe("number");
    expect(typeof grep?.to?.module).toBe("string");
  }, 60000);
});
