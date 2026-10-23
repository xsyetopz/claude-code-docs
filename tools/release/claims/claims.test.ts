import { afterAll, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { knownCases } from "./claims.ts";

const base = mkdtempSync(join(tmpdir(), "claims-test-"));
afterAll(() => rmSync(base, { recursive: true, force: true }));

const write = (version: string, claims: string[]) => {
  mkdirSync(join(base, version, "live"), { recursive: true });
  writeFileSync(
    join(base, version, "live", "usage.429.json"),
    JSON.stringify({ schema: 1, id: "live.usage.429", claims }),
  );
};

test("a case's claims come from its newest capture, not from older ones", () => {
  write("2.1.9", ["docs/old.md#renamed:00000000"]);
  write("2.1.10", ["docs/new.md#current:11111111"]);
  expect([...(knownCases(base).claims.get("live.usage.429") ?? [])]).toEqual([
    "docs/new.md#current:11111111",
  ]);
});
