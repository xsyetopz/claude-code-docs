// Kind `mod-api`: the Mod API calls and events, from the type file the program embeds
// (`claude-code.d.ts-<hash>.zst`; schemas/claude-code.d.ts holds the same text). Anchors (checked on
// 2.1.309, task 1.1): calls are the members of `CoreEngineInterface`, through nested object types
// (`ui: { log(…) }` gives `$.ui.log`), with detail "call" or "property". Events are the keys of
// `EngineEventOf` and `OpEventOf` (`tool.check`), and `classic.<Event>` for each `hook_event_name: '<Event>'`
// (ClassicEventOf maps them). `NounEventOf` holds only events that plugins declare, so it adds none.
// The old `strings` heuristic has no Mod API list, so there is nothing to compare.
import { blockEnd, declarations } from "../../../../plugin/mcp/src/types.ts";
import { typeFile } from "../bunfs.ts";
import { type Extractor, type SurfaceItem, unique } from "./common.ts";

const KEY = /^(\s*)(?:readonly )?(['"]?)([\w$.]+)\2\??\s*([:(<])/;

type Member = { name: string; line: number; end: number; call: boolean };

/** The members one level inside the block from `head` to `end`; `end` of a nested object type is its `}`. */
const members = (lines: string[], head: number, end: number): Member[] => {
  const out: Member[] = [];
  let indent = -1;
  let inDoc = false;
  for (let i = head + 1; i < end; i++) {
    const line = lines[i] ?? "";
    const t = line.trim();
    if (inDoc || t.startsWith("/*")) {
      inDoc = !t.endsWith("*/");
      continue;
    }
    const k = KEY.exec(line);
    if (!k) continue;
    const ind = (k[1] ?? "").length;
    if (indent < 0) indent = ind;
    if (ind !== indent) continue;
    const e = blockEnd(lines, i);
    const rest = line.slice(k[0].length);
    out.push({
      name: k[3] ?? "",
      line: i,
      end: /^\s*\{$/.test(rest) ? e : i,
      call: k[4] !== ":" || /^\s*[(<]/.test(rest),
    });
    i = e;
  }
  return out;
};

export const extractModApi: Extractor = (_bundle, files) => {
  if (!files) throw new Error("mod-api needs the embedded files of the binary");
  const { name: module, text } = typeFile(files);
  const lines = text.split("\n");
  const at = [0];
  for (const l of lines) at.push((at.at(-1) as number) + l.length + 1);
  const out: SurfaceItem[] = [];
  const item = (name: string, line: number, detail: string) =>
    out.push({
      kind: "mod-api",
      name,
      module,
      offset: at[line] ?? null,
      detail,
    });
  const decls = declarations(lines);
  /** The head line of a declaration, after its doc comment. */
  const head = (name: string) => {
    const d = decls.find((x) => x.name === name);
    if (!d) throw new Error(`type file: no declaration ${name}`);
    const re = new RegExp(`\\b(?:type|interface) ${name}\\b`);
    let i = d.start;
    while (i < d.end && !re.test(lines[i] ?? "")) i++;
    return { line: i, end: d.end };
  };
  const walk = (path: string, from: number, to: number) => {
    for (const m of members(lines, from, to))
      if (m.end > m.line) walk(`${path}.${m.name}`, m.line, m.end);
      else item(`${path}.${m.name}`, m.line, m.call ? "call" : "property");
  };
  const core = head("CoreEngineInterface");
  walk("$", core.line, core.end);
  for (const map of ["EngineEventOf", "OpEventOf"]) {
    const h = head(map);
    for (const m of members(lines, h.line, h.end))
      item(m.name, m.line, "event");
  }
  for (const hit of text.matchAll(/hook_event_name: '(\w+)'/g))
    out.push({
      kind: "mod-api",
      name: `classic.${hit[1]}`,
      module,
      offset: hit.index,
      detail: "event",
    });
  return unique(out);
};
