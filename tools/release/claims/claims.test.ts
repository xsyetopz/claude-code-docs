import { afterAll, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { grepHits, knownCases } from "./claims.ts";

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

/** A git repo with one committed page and one page that nobody staged. */
const repoWithNewPage = () => {
  const root = mkdtempSync(join(tmpdir(), "claims-grep-"));
  mkdirSync(join(root, "docs"), { recursive: true });
  writeFileSync(join(root, "docs", "committed.md"), "Covers `2.1.312`.\n");
  const git = (...a: string[]) =>
    Bun.spawnSync(["git", ...a], {
      cwd: root,
      env: { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null" },
    });
  git("init", "-q");
  git("config", "user.email", "test@example.com");
  git("config", "user.name", "test");
  git("add", "docs/committed.md");
  git("commit", "-qm", "add page");
  writeFileSync(join(root, "docs", "split.md"), "Also covers `2.1.312`.\n");
  return root;
};

test("the version scan reaches a page that nobody staged yet", () => {
  const root = repoWithNewPage();
  const hits = grepHits(root);
  expect(hits.get("docs/committed.md")).toEqual([1]);
  // A page split writes new files. Until someone stages them, a plain `git grep` skips them, so
  // their version claims would never reach the gate.
  expect(hits.get("docs/split.md")).toEqual([1]);
  rmSync(root, { recursive: true, force: true });
});
