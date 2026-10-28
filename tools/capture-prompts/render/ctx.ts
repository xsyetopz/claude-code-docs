import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { CLAUDE_CODE_VERSION } from "../../../src/version.ts";
import type { PromptGroup } from "../variants.ts";
import type { Cap, HandPage } from "./types.ts";

const ROOT = join(import.meta.dir, "..", "..", "..");
export const CAPTURES =
  process.env["CAPTURE_OUT"] ??
  join(ROOT, "captures", CLAUDE_CODE_VERSION, "prompts");
export const OUT = join(import.meta.dir, "..", "out");
export const DOCS = join(ROOT, "docs", "prompts");
mkdirSync(OUT, { recursive: true });
mkdirSync(DOCS, { recursive: true });

// the folder of a group, made on first use
export const groupDir = (group: PromptGroup) => {
  const dir = join(DOCS, group);
  mkdirSync(dir, { recursive: true });
  return dir;
};

// The state that the render steps share. Each step runs in the order that render.ts calls it.
export const ctx = {
  caps: new Map<string, Cap>(),
  hand: [] as HandPage[],
  dupOf: new Map<string, string>(),
  pos: {} as Partial<Record<PromptGroup, number>>,
  pageOrder: [] as string[],
};

// the next sidebar_position in a group; each group counts from 1
export const nextPos = (group: PromptGroup) => {
  const n = (ctx.pos[group] ?? 0) + 1;
  ctx.pos[group] = n;
  return n;
};
