import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { NOTES } from "../notes.ts";
import { ctx, groupDir, nextPos } from "./ctx.ts";
import { pageLink, relink } from "./link.ts";
import { fence, fmt, stripTrailing, toolDiff, udiff, yaml } from "./text.ts";
export const variantPages = () => {
  for (const [id, c] of ctx.caps) {
    const v = c.v;
    const base = v.baseline ? ctx.caps.get(v.baseline) : undefined;
    const dup = ctx.dupOf.get(id);
    const lines: string[] = [];
    lines.push(
      "---",
      `title: ${yaml(v.title)}`,
      `description: ${yaml(v.summary.replace(/`/g, ""))}`,
      `sidebar_position: ${nextPos(v.group)}`,
      "---",
      "",
    );
    ctx.pageOrder.push(id);
    lines.push(`${v.summary} ${v.how}`, "");
    const sysChars = c.parts
      .filter((p) => p.label.startsWith("system["))
      .reduce((s, p) => s + p.text.length, 0);
    lines.push("## Size", "", "| Part | Characters |", "| --- | --- |");
    for (const p of c.parts) {
      lines.push(
        `| \`${p.label.replace(/ \(.*/, "")}\` | ${fmt(p.text.length)} |`,
      );
    }
    lines.push(
      `| System blocks only | ${fmt(sysChars)} |`,
      `| Everything shown here | ${fmt(c.chars)} |`,
      `| Tools sent | ${c.tools.length} |`,
      "",
    );
    lines.push(
      "Sizes count the text after the placeholders are in place. Each placeholder counts at its own length.",
      "",
    );
    const notes = NOTES[id];
    if (notes?.length) {
      lines.push(
        "## What to Notice",
        "",
        ...notes.map((x) => `- ${relink(v.group, x)}`),
        "",
      );
    }
    if (dup) {
      lines.push(
        "## Full Text",
        "",
        `This variant sends exactly the same text and tools as ${pageLink(v.group, dup, ctx.caps.get(dup)?.v.title ?? dup)}. The page for that variant has the full text.`,
        "",
      );
    } else {
      lines.push(
        "## Full Text",
        "",
        "The text below is every part of the request that Claude Code builds before your own message, in the order it is sent.",
        "",
        fence(c.text, "text"),
        "",
      );
    }
    if (base && base.v.id !== id) {
      const d = udiff(base.text, c.text, base.v.id, id);
      lines.push(
        "## Compared to the Default",
        "",
        `The diff below starts from ${pageLink(v.group, base.v.id, base.v.title)}. Lines that start with \`-\` are only in the baseline. Lines that start with \`+\` are only here.`,
        "",
      );
      if (!d) lines.push("There are no differences in the text.", "");
      else {
        const add = d
            .split("\n")
            .filter((l) => l.startsWith("+") && !l.startsWith("+++")).length,
          del = d
            .split("\n")
            .filter((l) => l.startsWith("-") && !l.startsWith("---")).length;
        lines.push(
          `Lines added: ${add}. Lines removed: ${del}. Size change: ${c.chars - base.chars >= 0 ? "+" : ""}${fmt(c.chars - base.chars)} characters.`,
          "",
          fence(d, "diff"),
          "",
        );
      }
      const td = toolDiff(base.tools, c.tools);
      lines.push(
        td
          ? `Tool list: ${td} See ${pageLink(v.group, "tools-per-variant", "Tools per Variant")}.`
          : "The tool list is the same as the baseline.",
        "",
      );
    } else {
      lines.push(
        "## Compared to the Default",
        "",
        "This variant is the baseline. Other pages diff against it.",
        "",
      );
    }
    writeFileSync(
      join(groupDir(v.group), `${id}.md`),
      stripTrailing(lines.join("\n")),
    );
  }
};
