// Lookups in the Mod API type file (schemas/claude-code.d.ts), as text: a declaration with its doc comment,
// a member by dotted path, or an event's entries in the event maps. No TypeScript parser: the file is
// the program's own declaration output, one member per line group, doc comments in /** */ blocks.

export type Decl = { name: string; module: string; start: number; end: number };

const HEAD =
  /^(\s*)(?:export )?(?:declare )?(?:type|interface|function|const|class|namespace) ([\w$]+)/;
const MODULE = /^declare module '([^']+)' \{/;

/** Removes comments and string contents, so only code braces count. */
const code = (
  line: string,
  inDoc: boolean,
): { text: string; inDoc: boolean } => {
  let out = "";
  let i = 0;
  let doc = inDoc;
  while (i < line.length) {
    if (doc) {
      const close = line.indexOf("*/", i);
      if (close < 0) return { text: out, inDoc: true };
      i = close + 2;
      doc = false;
    } else if (line.startsWith("/*", i)) {
      doc = true;
      i += 2;
    } else if (line.startsWith("//", i)) break;
    else if (line[i] === "'" || line[i] === '"' || line[i] === "`") {
      const q = line[i];
      i++;
      while (i < line.length && line[i] !== q) i += line[i] === "\\" ? 2 : 1;
      i++;
      out += "''";
    } else out += line[i++];
  }
  return { text: out, inDoc: doc };
};

/** The last line of the block that starts at `start`: braces, brackets, and parens balanced, then `;`, `}` or `,`. */
export const blockEnd = (lines: string[], start: number): number => {
  let depth = 0;
  let inDoc = false;
  for (let i = start; i < lines.length; i++) {
    const c = code(lines[i] ?? "", inDoc);
    inDoc = c.inDoc;
    for (const ch of c.text) {
      if ("{[(".includes(ch)) depth++;
      else if ("}])".includes(ch)) depth--;
    }
    const t = c.text.trim();
    if (depth <= 0 && !inDoc && /[;},]$/.test(t)) return i;
    if (depth < 0) return i;
  }
  return lines.length - 1;
};

/** The first line of the doc comment right above `line`, or `line` itself. */
export const docStart = (lines: string[], line: number): number => {
  let i = line - 1;
  if (!(lines[i] ?? "").trim().endsWith("*/")) return line;
  while (i >= 0 && !(lines[i] ?? "").trim().startsWith("/**")) i--;
  return i >= 0 ? i : line;
};

export const declarations = (lines: string[]): Decl[] => {
  const out: Decl[] = [];
  let module = "";
  let inDoc = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    const m = MODULE.exec(line);
    if (m) {
      module = m[1] ?? "";
      continue;
    }
    const wasDoc = inDoc;
    inDoc = code(line, inDoc).inDoc;
    if (wasDoc) continue;
    const h = HEAD.exec(line);
    // Only declarations directly inside a module: two spaces deep.
    if (!h || (h[1] ?? "").length !== 2) continue;
    const end = blockEnd(lines, i);
    out.push({ name: h[2] ?? "", module, start: docStart(lines, i), end });
    i = end;
  }
  return out;
};

/** A member of the block between `from` and `to` (exclusive of the head line), one level deep. */
const member = (
  lines: string[],
  from: number,
  to: number,
  name: string,
): { start: number; end: number } | undefined => {
  const indent = (lines[from + 1] ?? "").match(/^\s*/)?.[0].length ?? 0;
  const n = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // A key as written: bare, or quoted with either quote.
  const key = new RegExp(
    `^\\s{${indent}}(?:readonly )?(?:(['"])${n}\\1|${n})\\??\\s*[:(<]`,
  );
  let inDoc = false;
  for (let i = from + 1; i < to; i++) {
    const line = lines[i] ?? "";
    const wasDoc = inDoc;
    inDoc = code(line, inDoc).inDoc;
    if (wasDoc || !key.test(line)) continue;
    return { start: docStart(lines, i), end: blockEnd(lines, i) };
  }
  return undefined;
};

export type Found =
  | { kind: "text"; title: string; text: string }
  | { kind: "missing"; near: string[] };

/**
 * `Name`, `Name.member.member`, `module:Name`, `$.noun.call` (the engine's `$`), or an event name such
 * as `tool.check` (its entries in the event maps: input, result, call).
 */
export const lookup = (src: string, query: string): Found => {
  const lines = src.split("\n");
  const decls = declarations(lines);
  const slice = (a: number, b: number) => lines.slice(a, b + 1).join("\n");
  const q = query.trim();
  const [head, ...rest] = q.startsWith("$.")
    ? ["EngineInterface", ...q.slice(2).split(".")]
    : q.split(".");
  const [mod, bare] = (head ?? "").includes(":")
    ? (head ?? "").split(":")
    : [undefined, head];
  const candidates = decls.filter(
    (d) => d.name === bare && (mod === undefined || d.module === mod),
  );
  // `$` members live on CoreEngineInterface, which EngineInterface extends.
  if (q.startsWith("$."))
    candidates.push(...decls.filter((d) => d.name === "CoreEngineInterface"));
  for (const d of candidates) {
    let at = { start: d.start, end: d.end };
    let head = lineOfHead(lines, d);
    let ok = true;
    for (const part of rest) {
      const m = member(lines, head, at.end, part);
      if (!m) {
        ok = false;
        break;
      }
      at = m;
      head = lineOfHead(lines, m);
    }
    if (ok)
      return {
        kind: "text",
        title: `${d.module ? `${d.module}: ` : ""}${[d.name, ...rest].join(".")}`,
        text: slice(at.start, at.end),
      };
  }
  // An event name: its entries in the maps that key events by name.
  if (/^[a-z]+\.[\w.]+$|^classic\.\w+$/.test(q)) {
    const hits: string[] = [];
    for (const d of decls) {
      const m = member(lines, lineOfHead(lines, d), d.end, q);
      if (m) hits.push(`// ${d.name}['${q}']\n${slice(m.start, m.end)}`);
    }
    if (hits.length)
      return { kind: "text", title: `event ${q}`, text: hits.join("\n\n") };
  }
  const low = (bare ?? q).toLowerCase();
  const near = [...new Set(decls.map((d) => d.name))]
    .filter(
      (n) => n.toLowerCase().includes(low) || low.includes(n.toLowerCase()),
    )
    .slice(0, 20);
  return { kind: "missing", near };
};

/** The line of the declaration's own head, after its doc comment. */
const lineOfHead = (lines: string[], d: { start: number; end: number }) => {
  let i = d.start;
  if ((lines[i] ?? "").trim().startsWith("/**"))
    while (i < d.end && !(lines[i] ?? "").trim().endsWith("*/")) i++;
  return (lines[i] ?? "").trim().endsWith("*/") ? i + 1 : i;
};

/** The outline: every declared name by module, for a call without `property`. */
export const outline = (src: string): string => {
  const decls = declarations(src.split("\n"));
  const by = new Map<string, string[]>();
  for (const d of decls)
    by.set(d.module, [...(by.get(d.module) ?? []), d.name]);
  const parts = [...by].map(
    ([m, names]) => `${m || "(global)"} (${names.length}): ${names.join(", ")}`,
  );
  return `${decls.length} declarations. Pass \`property\`: a name ("ToolCheckResult"), a member path ("ToolCheckResult.plugin"), a call ("$.tool.check"), or an event ("tool.check").\n\n${parts.join("\n\n")}`;
};
