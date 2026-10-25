import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { BADGE_NOTES } from "../notes.ts";
import type { Variant } from "../variants.ts";
import { OUT } from "./ctx.ts";
import type { Tool } from "./types.ts";
export const udiff = (a: string, b: string, la: string, lb: string): string => {
  const fa = join(OUT, ".a.tmp"),
    fb = join(OUT, ".b.tmp");
  writeFileSync(fa, a);
  writeFileSync(fb, b);
  const r = Bun.spawnSync(["diff", "-u", "--label", la, "--label", lb, fa, fb]);
  rmSync(fa);
  rmSync(fb);
  return r.stdout.toString();
};

export const fence = (body: string, lang: string) => {
  const longest = Math.max(
    2,
    ...[...body.matchAll(/`+/g)].map((m) => m[0].length),
  );
  const f = "`".repeat(longest + 1);
  return `${f}${lang}\n${body.replace(/\s+$/, "")}\n${f}`;
};
export const fmt = (n: number) => n.toLocaleString("en-US");
export const badge = (v: Variant) => {
  const n = BADGE_NOTES[v.id] ?? v.gatedNote;
  return v.status === "Gated" || v.status === "Differs"
    ? `<${v.status} note="${(n ?? "").replace(/"/g, "&quot;")}" />`
    : `<${v.status} />`;
};
export const yaml = (s: string) => JSON.stringify(s);

// join text lines: blank line between paragraphs, none inside lists, tables, and code fences
export const para = (lines: string[]): string[] => {
  const out: string[] = [];
  let fenced = false;
  const kind = (l: string) =>
    l.startsWith("|")
      ? "t"
      : /^(- |\d+\. )/.test(l)
        ? "l"
        : l.startsWith("```")
          ? "f"
          : l === ""
            ? "b"
            : "p";
  let prev = "b";
  for (const l of lines) {
    const k = kind(l);
    if (fenced) {
      out.push(l);
      if (k === "f") {
        fenced = false;
        out.push("");
        prev = "b";
      }
      continue;
    }
    if (k === "f") {
      if (prev !== "b") out.push("");
      out.push(l);
      fenced = true;
      continue;
    }
    if (k === "b") {
      out.push(l);
      prev = "b";
      continue;
    }
    if (prev !== "b" && !(prev === k && k !== "p")) out.push("");
    out.push(l);
    prev = k;
  }
  return out;
};

export const toolDiff = (a: Tool[], b: Tool[]): string => {
  const an = new Map(a.map((t) => [t.name, t])),
    bn = new Map(b.map((t) => [t.name, t]));
  const rem = a.filter((t) => !bn.has(t.name)).map((t) => t.name),
    add = b.filter((t) => !an.has(t.name)).map((t) => t.name);
  const chg = b
    .filter((t) => {
      const old = an.get(t.name);
      return (
        old !== undefined && (old.desc !== t.desc || old.schema !== t.schema)
      );
    })
    .map((t) => t.name);
  const out: string[] = [];
  if (add.length) out.push(`adds ${add.map((x) => `\`${x}\``).join(", ")}.`);
  if (rem.length) out.push(`removes ${rem.map((x) => `\`${x}\``).join(", ")}.`);
  if (chg.length)
    out.push(
      `changes the text or schema of ${chg.map((x) => `\`${x}\``).join(", ")}.`,
    );
  return out.join(" ");
};
export const stripTrailing = (s: string) => s.replace(/[ \t]+$/gm, "");
