// Run: bun test tools/version
import { describe, expect, test } from "bun:test";
import { CLAUDE_CODE_VERSION } from "../../src/version.ts";
import {
  bumpVersion,
  MARKETPLACE,
  syncDescriptions,
  syncVersions,
  TARGETS,
  versionProblems,
} from "./bump.ts";

describe("bumpVersion", () => {
  test("bumps each level and resets the lower parts", () => {
    expect(bumpVersion("0.2.3", "patch")).toBe("0.2.4");
    expect(bumpVersion("0.2.3", "minor")).toBe("0.3.0");
    expect(bumpVersion("0.2.3", "major")).toBe("1.0.0");
  });
  test("rejects a version that is no x.y.z", () => {
    expect(() => bumpVersion("1.2", "patch")).toThrow();
  });
});

describe("syncDescriptions", () => {
  test("sets the Claude Code version on a description line", () => {
    const text = '  "description": "Docs for Claude Code 2.1.1."\n';
    expect(syncDescriptions(text)).toBe(
      `  "description": "Docs for Claude Code ${CLAUDE_CODE_VERSION}."\n`,
    );
  });
  test("leaves a plugin version that looks like a Claude Code version", () => {
    const text = '  "version": "2.0.0",\n  "description": "Tracks 2.1.1."\n';
    expect(syncDescriptions(text)).toBe(
      `  "version": "2.0.0",\n  "description": "Tracks ${CLAUDE_CODE_VERSION}."\n`,
    );
  });
});

describe("syncVersions", () => {
  test("sets every Claude Code version in a skill body", () => {
    expect(syncVersions("Covers 2.1.1. Probed on 2.1.1.")).toBe(
      `Covers ${CLAUDE_CODE_VERSION}. Probed on ${CLAUDE_CODE_VERSION}.`,
    );
  });
});

/** Every target file at version `v`, and a marketplace that names Claude Code `cc`. */
const files = (v: string, cc = CLAUDE_CODE_VERSION) => {
  const out: Record<string, Record<string, unknown>> = {
    [MARKETPLACE]: {
      description: `Docs for Claude Code ${cc}.`,
      plugins: [{ description: `Docs (version ${cc}).` }],
    },
  };
  for (const slots of Object.values(TARGETS))
    for (const s of slots) {
      out[s.file] ??= {};
      const doc = out[s.file] as Record<string, unknown>;
      if (s.path.length === 1) doc[s.path[0] as string] = v;
      else doc[s.path[0] as string] = { [s.path[1] as string]: v };
    }
  return out;
};

describe("versionProblems", () => {
  test("passes when each target's files agree and the texts name the tracked version", () => {
    const f = files("0.2.0");
    expect(versionProblems((p) => f[p] ?? {})).toEqual([]);
  });
  test("flags a target whose files differ", () => {
    const f = files("0.2.0");
    (f["inspect/mcp/package.json"] as Record<string, unknown>)["version"] =
      "0.1.0";
    expect(versionProblems((p) => f[p] ?? {})).toEqual([
      expect.stringContaining("cc-inspect versions differ"),
    ]);
  });
  test("flags a marketplace text that names an older Claude Code", () => {
    const f = files("0.2.0", "2.1.1");
    expect(versionProblems((p) => f[p] ?? {})).toEqual([
      expect.stringContaining("names Claude Code 2.1.1"),
    ]);
  });
});
