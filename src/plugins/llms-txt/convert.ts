// Turns a docs .md/.mdx source into plain markdown for agents (design: agent-access D1).
// Line based and fence aware: code fences are copied as they are, components become text.
import { CLAUDE_CODE_VERSION } from "../../version";

export type LinkResolver = (target: string) => string | undefined;

const BADGE_LABELS: Record<string, string> = {
  Documented: "Documented",
  Undocumented: "Undocumented",
  Differs: "Differs",
  Gated: "Gated",
  ManagedOnly: "Managed Only",
  Experimental: "Experimental",
  Deprecated: "Deprecated",
  Caution: "Caution",
};
const BADGE =
  /<(Documented|Undocumented|Differs|Gated|ManagedOnly|Experimental|Deprecated|Caution)(?:\s+note=(?:\{?"([^"]*)"\}?))?\s*\/>/g;
const FENCE = /^\s*(`{3,}|~{3,})/;
const ADMONITION = /^:::(\w+)(?:\[(.*)\])?\s*$/;
const MARK = "\u0000";

/** The overview hero as text: its H1, lede, and badge key. */
export const HERO_TEXT = [
  "# Every Part of Claude Code You Can Use or Change",
  "",
  `Unofficial community docs for version \`${CLAUDE_CODE_VERSION}\`, built from the official docs and the program itself. Not made by or tied to Anthropic. For supported behavior, check the official docs first.`,
  "",
  "- [Documented] An official docs page names it.",
  "- [Undocumented] Only the program shows it. It can change without notice.",
  "- [Differs] The docs and the program disagree. The row says how.",
  "- [Gated] It works only behind a flag or a server gate.",
  "- [Managed Only] It works only in managed (organization policy) settings.",
  "- [Experimental] The program or the official docs call it experimental or beta.",
  "- [Deprecated] The program or the official docs call it deprecated.",
  "- [Caution] It deletes data, skips a safety check, or sends data off your machine.",
].join("\n");

export const stripFrontMatter = (raw: string): string => {
  const text = raw.replace(/\r\n/g, "\n");
  if (!text.startsWith("---\n")) return text;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return text;
  return text.slice(text.indexOf("\n", end + 1) + 1);
};

/** Converts prose outside code spans. `inTable` keeps `\|` escaped. */
const convertInline = (
  line: string,
  inTable: boolean,
  resolve: LinkResolver,
): string => {
  const spans: string[] = [];
  let out = line.replace(/(`+)(?!`)[\s\S]*?[^`]\1(?!`)/g, (m) => {
    spans.push(m);
    return `${MARK}${spans.length - 1}${MARK}`;
  });
  out = out
    .replace(BADGE, (_m, kind: string, note?: string) => {
      const label = BADGE_LABELS[kind] ?? kind;
      return note ? `[${label}: ${note}]` : `[${label}]`;
    })
    .replace(/\{CLAUDE_CODE_VERSION\}/g, CLAUDE_CODE_VERSION)
    .replace(/\\([{}])/g, "$1")
    .replace(/\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g, (m, target: string) => {
      const url = resolve(target);
      return url === undefined ? m : `](${url})`;
    });
  if (!inTable) out = out.replace(/\\\|/g, "|");
  const restore = new RegExp(`${MARK}(\\d+)${MARK}`, "g");
  return out.replace(restore, (_m, i: string) => spans[Number(i)] ?? "");
};

export const convertBody = (source: string, resolve: LinkResolver): string => {
  const out: string[] = [];
  let fence: { char: string; len: number } | undefined;
  let admonition = false;
  let pendingTitle: string | undefined;

  const push = (line: string) => {
    if (admonition) {
      if (pendingTitle !== undefined && line.trim() !== "") {
        const plain = !/^\s*([-*+>|#]|\d+[.)]|`{3}|~{3})/.test(line);
        out.push(
          plain
            ? `> **${pendingTitle}:** ${line}`
            : `> **${pendingTitle}:**\n> ${line}`,
        );
        pendingTitle = undefined;
        return;
      }
      out.push(line === "" ? ">" : `> ${line}`);
      return;
    }
    if (line === "" && out.at(-1) === "") return;
    out.push(line);
  };

  for (const line of stripFrontMatter(source).split("\n")) {
    const fenceMatch = FENCE.exec(line);
    if (fence) {
      push(line);
      const close = fenceMatch?.[1];
      if (
        close?.[0] === fence.char &&
        close.length >= fence.len &&
        line.trim() === close
      )
        fence = undefined;
      continue;
    }
    if (fenceMatch?.[1]) {
      fence = { char: fenceMatch[1][0] ?? "`", len: fenceMatch[1].length };
      push(line);
      continue;
    }
    if (/^(import|export)\s/.test(line)) continue;
    if (/^\s*<\/?FileTree>\s*$/.test(line)) continue;
    if (/^\s*<Hero\s*\/>\s*$/.test(line)) {
      for (const l of HERO_TEXT.split("\n")) push(l);
      continue;
    }
    const adm = ADMONITION.exec(line);
    if (adm && !admonition) {
      admonition = true;
      const type = adm[1] ?? "note";
      pendingTitle = adm[2] ?? type[0]?.toUpperCase() + type.slice(1);
      continue;
    }
    if (admonition && line.trim() === ":::") {
      admonition = false;
      pendingTitle = undefined;
      push("");
      continue;
    }
    push(convertInline(line, line.trimStart().startsWith("|"), resolve));
  }
  while (out.at(-1) === "") out.pop();
  return out.join("\n");
};
