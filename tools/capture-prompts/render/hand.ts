import { readdirSync, readFileSync, rmSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { VARIANTS } from "../variants.ts";
import { ctx, DOCS } from "./ctx.ts";
import { isGroup } from "./groups.ts";
import { type Place, pageLink } from "./link.ts";
import type { FrontMatter, HandPage } from "./types.ts";

const frontMatter = (file: string): FrontMatter => {
  const raw = readFileSync(file, "utf8")
    .replace(/^﻿/, "")
    .replace(/\r\n/g, "\n");
  const m = /^---\n([\s\S]*?)\n---\n/.exec(raw);
  return m?.[1] ? (Bun.YAML.parse(m[1]) as FrontMatter) : {};
};

// Scans docs/prompts/** : keeps a page with generated: false, deletes every other page.
// index.md and the _category_.json files are not touched.
export const loadHand = () => {
  for (const rel of readdirSync(DOCS, { recursive: true }).sort()) {
    const f = String(rel);
    if (!f.endsWith(".md") || f === "index.md") continue;
    const fm = frontMatter(join(DOCS, f));
    if (fm.generated === false) {
      const id = basename(f, ".md");
      if (VARIANTS.some((v) => v.id === id))
        throw new Error(
          `docs/prompts/${f} is hand-written (generated: false) but its name collides with variant id "${id}".`,
        );
      if (!isGroup(fm.group))
        throw new Error(
          `docs/prompts/${f} is hand-written but its front matter has no valid "group" (got ${JSON.stringify(fm.group)}).`,
        );
      if (dirname(f) !== fm.group)
        throw new Error(
          `docs/prompts/${f} has group "${fm.group}" but sits in the folder "${dirname(f)}".`,
        );
      ctx.hand.push({
        id,
        title: String(fm.title),
        group: fm.group,
        row: fm.index,
      });
    } else rmSync(join(DOCS, f));
  }
};
// hand-written rows go after the generated row named in `after`, else at the end
export const handRows = (afterId?: string) =>
  ctx.hand.filter(
    (h) =>
      h.row &&
      (afterId === undefined
        ? !h.row.after || !ctx.caps.has(h.row.after)
        : h.row.after === afterId),
  );
export const handLink = (h: HandPage, from: Place) =>
  pageLink(from, h.id, h.title);
export const handGlance = (h: HandPage, from: Place) =>
  `| ${handLink(h, from)} | ${h.row?.change} | ${h.row?.toggle} | ${h.row?.where} | <${h.row?.status} /> |`;
