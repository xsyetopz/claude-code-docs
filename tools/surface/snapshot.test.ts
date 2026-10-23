import { expect, test } from "bun:test";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { listInstalls } from "../../inspect/mcp/src/binary.ts";
import { KINDS } from "../../inspect/mcp/src/surface/index.ts";
import { CLAUDE_CODE_VERSION } from "../../src/version.ts";
import { committed, serialize, validate } from "./snapshot.ts";

const SCRIPT = join(import.meta.dir, "snapshot.ts");
const COPY = join(import.meta.dir, "..", "..", "schemas", "surface.json");
const installed = listInstalls().some((i) => i.version === CLAUDE_CODE_VERSION);

const tmp = () => mkdtempSync(join(tmpdir(), "surface-"));
/** Run the snapshot command with no binary anywhere (an empty versions folder and no launcher). */
const run = (args: string[], empty = true) => {
  const dir = tmp();
  const r = Bun.spawnSync(["bun", SCRIPT, ...args], {
    env: {
      ...process.env,
      ...(empty
        ? {
            CC_INSPECT_VERSIONS_DIR: join(dir, "versions"),
            CC_INSPECT_LAUNCHER: join(dir, "claude"),
          }
        : {}),
    },
  });
  return {
    code: r.exitCode,
    out: r.stdout.toString(),
    err: r.stderr.toString(),
    dir,
  };
};

const item = (kind: string, name: string, module = "m.js", offset = 1) => ({
  kind,
  name,
  module,
  offset,
});

test("the committed copy drops module and offset and sorts kinds and items", () => {
  const a = committed("1.2.3", {
    flag: [item("flag", "--b"), item("flag", "--a")],
    env: [{ ...item("env", "Z"), default: '"1"' }, item("env", "A")],
  });
  expect(Object.keys(a.kinds)).toEqual(["env", "flag"]);
  expect(a.kinds["env"]).toEqual([
    { name: "A" },
    { name: "Z", default: '"1"' },
  ]);
  expect(a.kinds["flag"]?.map((i) => i.name)).toEqual(["--a", "--b"]);
  expect(serialize(a)).not.toContain("module");
});

test("the output is the same for the same items in any order", () => {
  const items = ["c", "a", "b"].map((n) => item("env", n));
  const one = serialize(committed("1.2.3", { env: items, flag: items }));
  const two = serialize(
    committed("1.2.3", {
      flag: [...items].reverse(),
      env: [...items].reverse(),
    }),
  );
  expect(one).toBe(two);
  expect(JSON.parse(one).version).toBe("1.2.3");
});

test("validate accepts a good file and names each problem", () => {
  const kinds = Object.fromEntries(
    Object.keys(KINDS).map((k) => [k, [{ name: "a" }, { name: "b" }]]),
  );
  expect(validate({ version: "1.2.3", kinds }, "1.2.3")).toEqual([]);
  expect(validate({ version: "1.2.2", kinds }, "1.2.3").join()).toContain(
    "names version 1.2.2, not 1.2.3",
  );
  expect(
    validate(
      { version: "1.2.3", kinds: { ...kinds, env: [] } },
      "1.2.3",
    ).join(),
  ).toContain('kind "env" is not a non-empty list');
  expect(
    validate(
      {
        version: "1.2.3",
        kinds: { ...kinds, env: [{ name: "b" }, { name: "a" }] },
      },
      "1.2.3",
    ).join(),
  ).toContain("env: not sorted at a");
  const { env: _, ...rest } = kinds;
  expect(validate({ version: "1.2.3", kinds: rest }, "1.2.3")).toEqual([
    'kind "env" missing',
  ]);
  expect(validate([], "1.2.3")).toEqual(["not an object"]);
});

test("the committed schemas/surface.json has the right shape and version", () => {
  expect(
    validate(JSON.parse(readFileSync(COPY, "utf8")), CLAUDE_CODE_VERSION),
  ).toEqual([]);
});

test("a missing binary exits non-zero, names the path, and writes no file", () => {
  const out = tmp();
  const r = run(["--binary", "9.9.9", "--out", out]);
  expect(r.code).not.toBe(0);
  expect(r.err).toContain(join(r.dir, "versions", "9.9.9"));
  expect(existsSync(join(out, "captures"))).toBe(false);
  expect(existsSync(join(out, "schemas"))).toBe(false);
});

test("a missing binary given as a path names that path", () => {
  const r = run(["--binary", "/nonexistent/claude-bin", "--out", tmp()]);
  expect(r.code).not.toBe(0);
  expect(r.err).toContain("/nonexistent/claude-bin");
});

test("check with no binary validates the file, says it skipped the comparison, and exits 0", () => {
  const r = run(["--check"]);
  expect(r.err).toBe("");
  expect(r.code).toBe(0);
  expect(r.out).toContain("skipped the comparison with a fresh run");
});

test("check with no binary still fails on the wrong version", () => {
  const out = tmp();
  mkdirSync(join(out, "schemas"));
  const kinds = Object.fromEntries(
    Object.keys(KINDS).map((k) => [k, [{ name: "a" }]]),
  );
  writeFileSync(
    join(out, "schemas", "surface.json"),
    JSON.stringify({ version: "0.0.1", kinds }),
  );
  const r = run(["--check", "--out", out]);
  expect(r.code).toBe(1);
  expect(r.err).toContain("names version 0.0.1");
});

test.skipIf(!installed)(
  "two runs on the installed binary give the same bytes as the committed file",
  () => {
    const [a, b] = [tmp(), tmp()];
    for (const out of [a, b]) {
      const r = run(
        ["--binary", CLAUDE_CODE_VERSION, "--commit", "--out", out],
        false,
      );
      expect(r.err).toBe("");
      expect(r.code).toBe(0);
    }
    const copy = (d: string) =>
      readFileSync(join(d, "schemas", "surface.json"), "utf8");
    expect(copy(a)).toBe(copy(b));
    expect(copy(a)).toBe(readFileSync(COPY, "utf8"));
    const cap = JSON.parse(
      readFileSync(
        join(a, "captures", CLAUDE_CODE_VERSION, "surface.json"),
        "utf8",
      ),
    );
    expect(cap.version).toBe(CLAUDE_CODE_VERSION);
    expect(Object.keys(cap.kinds).sort()).toEqual(Object.keys(KINDS).sort());
    for (const [k, items] of Object.entries(cap.kinds)) {
      expect((items as unknown[]).length, k).toBeGreaterThan(0);
      for (const i of items as {
        kind: string;
        version: string;
        module: unknown;
      }[]) {
        expect(i.kind).toBe(k);
        expect(i.version).toBe(CLAUDE_CODE_VERSION);
        expect("module" in i).toBe(true);
      }
    }
  },
  400_000,
);
