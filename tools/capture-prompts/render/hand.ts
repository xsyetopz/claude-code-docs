import { readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { VARIANTS } from "../variants.ts";
import { ctx, DOCS } from "./ctx.ts";
import type { FrontMatter, HandPage } from "./types.ts";

const frontMatter = (file: string): FrontMatter => {
  const raw = readFileSync(file, "utf8")
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n");
  const m = /^---\n([\s\S]*?)\n---\n/.exec(raw);
  return m?.[1] ? (Bun.YAML.parse(m[1]) as FrontMatter) : {};
};

export const loadHand = () => {
  for (const f of readdirSync(DOCS).sort()) {
    if (!f.endsWith(".md")) continue;
    const fm = frontMatter(join(DOCS, f));
    if (fm.generated === false) {
      const id = f.replace(/\.md$/, "");
      if (VARIANTS.some((v) => v.id === id))
        throw new Error(
          `docs/prompts/${f} is hand-written (generated: false) but its name collides with variant id "${id}".`,
        );
      ctx.hand.push({
        id,
        title: String(fm.title),
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
export const handGlance = (h: HandPage) =>
  `| ${handLink(h)} | ${h.row?.change} | ${h.row?.toggle} | ${h.row?.where} | <${h.row?.status} /> |`;
export const handLink = (h: HandPage) => `[${h.title}](./${h.id}.md)`;
