// Pure extractors: text from `strings -a` of a Claude Code binary -> named items.
// Everything here is a text heuristic on minified code; names are stable, minified identifiers are never used.

/** name -> detail (a flag's spec and description, a setting's description, "" when there is none). */
export type Items = Map<string, string>;
export type Extracted = {
  env: Items;
  flags: Items;
  commands: Items;
  settings: Items;
  hooks: Items;
  gates: Items;
};

/** The prefixes the docs use for environment variable names (same filter as the 2.1.305 sweep list). */
export const ENV_PREFIXES = [
  "ANTHROPIC",
  "API",
  "BASH",
  "CLAUDE",
  "DISABLE",
  "ENABLE",
  "IS",
  "MAX",
  "MCP",
  "NO",
  "OTEL",
  "USE",
];

/** Cap length and blank `${minifiedName}` template parts, which change on every build. */
const trim = (s: string, n = 300): string => {
  const t = s.replace(/\$\{[\w$.]+(?:\([^)]*\))?/g, "${_");
  return t.length > n ? `${t.slice(0, n)}...` : t;
};
const STR = String.raw`("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\`(?:[^\`\\]|\\.)*\`)`;
const ESC: Record<string, string> = { n: " ", t: " ", r: " " };
const unq = (s: string): string =>
  s
    .slice(1, -1)
    .replace(
      /\\u([0-9a-fA-F]{4})|\\x([0-9a-fA-F]{2})|\\(.)/g,
      (_m, u?: string, x?: string, c?: string) =>
        u || x
          ? String.fromCharCode(Number.parseInt(u ?? x ?? "0", 16))
          : (ESC[c ?? ""] ?? c ?? ""),
    );

const sorted = (m: Items): Items =>
  new Map([...m].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));

/** Prefixes that also start many non-env words (NO_THREAD, MAX_VALUE, IS_SHELL, MCP_FILE_UNREAD, ...). */
const GENERIC = new Set(["API", "BASH", "IS", "MAX", "MCP", "NO", "USE"]);

/**
 * Does this occurrence look like an environment read or an env-name list entry?
 * Generic prefixes must be `x.NAME`, an entry of a quoted list (`["A","NAME"]`), or a registry key (`NAME:()=>`).
 * `NAME:{`, ` as NAME` and `code:"NAME"` are rejected for every prefix.
 */
const readContext = (text: string, i: number, name: string): boolean => {
  const end = i + name.length;
  const prev = text[i - 1] ?? "";
  const after = text.slice(end, end + 3);
  if (after.startsWith(":{") || text.slice(i - 4, i) === " as ") return false;
  if (!GENERIC.has(name.slice(0, name.indexOf("_")))) return true;
  if (prev === "." || after.startsWith(":()=>")) return true;
  if (prev === '"' && after.startsWith('"')) {
    const before = text[i - 2] ?? "";
    return (before === "[" || before === ",") && /^"[,\]]/.test(after);
  }
  return false;
};

export const extractEnv = (text: string): Items => {
  const re = new RegExp(
    `(?<![A-Z0-9_])(?:${ENV_PREFIXES.join("|")})_[A-Z0-9_]*[A-Z0-9](?![A-Z0-9_])`,
    "g",
  );
  // A name at the start of a line, followed by a letter or the line end, is a string-table entry with stray bytes glued on (e.g. `CLAUDE_CODE_NEW_INITR`).
  // Real reads sit inside code, so a name counts only when it appears at least once inside a longer line.
  const count = new Map<string, number>();
  const tableKeys = new Set<string>(); // generic names that are also `NAME:{...}` keys of a code table
  for (const m of text.matchAll(re)) {
    const i = m.index ?? 0;
    const next = text[i + m[0].length] ?? "\n";
    const alone = (i === 0 || text[i - 1] === "\n") && /[a-z\n]/.test(next);
    if (
      GENERIC.has(m[0].slice(0, m[0].indexOf("_"))) &&
      text.startsWith(":{", i + m[0].length)
    )
      tableKeys.add(m[0]);
    if (!alone && readContext(text, i, m[0]))
      count.set(m[0], (count.get(m[0]) ?? 0) + 1);
  }
  // Prose strings also get one stray byte glued on (`unset CLAUDE_CODE_SIMPLE` + `7`): a rare name whose
  // name minus its last character is also a name is that glue.
  const out: Items = new Map();
  for (const [n, c] of count)
    if (!(c <= 2 && count.has(n.slice(0, -1))) && !tableKeys.has(n))
      out.set(n, "");
  return sorted(out);
};

/** `.option("-d, --debug [filter]", "desc")` and `new Option("--init", "desc")`. Keyed by the long flag. */
export const extractFlags = (text: string): Items => {
  const re = new RegExp(
    String.raw`(?:\.option\(|new [\w$]+\()"((?:-\w, )?--[a-z][^"]*)"(?:,${STR})?`,
    "g",
  );
  const out: Items = new Map();
  for (const m of text.matchAll(re)) {
    const spec = m[1] ?? "";
    const long = spec.match(/--[a-z][\w-]*/)?.[0];
    if (!long) continue;
    const desc = m[2] ? unq(m[2]) : "";
    const prev = out.get(long);
    // the same flag may be declared twice (parent and subcommand); keep the first, longest text wins on ties
    if (prev === undefined || prev.length < spec.length + desc.length)
      out.set(long, trim(`${spec} | ${desc}`));
  }
  return sorted(out);
};

/** CLI subcommands (`.command("name [arg]")`, as `cli:<name>`) and slash commands (`name:"x",description:`, as `/<name>`). */
export const extractCommands = (text: string): Items => {
  const out: Items = new Map();
  for (const m of text.matchAll(/\.command\("([a-z][\w-]*)([^"]*)"/g))
    out.set(`cli:${m[1]}`, trim((m[2] ?? "").trim()));
  const re = new RegExp(
    String.raw`name:"([a-z][\w-]*)",description:${STR}`,
    "g",
  );
  for (const m of text.matchAll(re)) {
    const key = `/${m[1]}`;
    const desc = trim(unq(m[2] ?? ""));
    if (!out.has(key) || (out.get(key) ?? "").length < desc.length)
      out.set(key, desc);
  }
  return sorted(out);
};

/**
 * Fallback only: the generated schema is the source of truth for settings (see diff.ts).
 * Schema fields written as `key:()=>zod chain...describe("text")`, plus the keys inside gated
 * `name:{buildGate:()=>!0,shape:()=>({key:zod...})}` blocks. `shape` and `buildGate` are never reported.
 */
export const extractSettings = (text: string): Items => {
  const out: Items = new Map();
  const put = (key: string | undefined, seg: string) => {
    if (!key || key === "shape" || key === "buildGate") return;
    const d = seg.match(new RegExp(String.raw`\.describe\(${STR}`));
    if (!d) return;
    const desc = trim(unq(d[1] ?? ""));
    if (!out.has(key) || (out.get(key) ?? "").length < desc.length)
      out.set(key, desc);
  };
  const keys = [
    ...text.matchAll(
      /(?<![\w$.])([A-Za-z_]\w*):\(\)=>(?:\(\{([A-Za-z_]\w*):)?/g,
    ),
  ];
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (!k) continue;
    const start = (k.index ?? 0) + k[0].length;
    const next = keys[i + 1]?.index ?? start + 1500;
    const seg = text.slice(start, Math.min(next, start + 1500));
    if (k[1] === "shape" && k[2])
      put(k[2], seg); // first key of a `shape:()=>({` object has no arrow
    else put(k[1], seg);
  }
  return sorted(out);
};

/** The hook event list: the longest quoted PascalCase array that holds PreToolUse and PostToolUse. */
export const extractHooks = (text: string): Items => {
  let best: string[] = [];
  for (const m of text.matchAll(/\[("[A-Z][A-Za-z]+",?)+\]/g)) {
    const names = [...m[0].matchAll(/"([A-Z][A-Za-z]+)"/g)].map((x) => x[1]);
    const list = names.filter((n): n is string => !!n);
    if (
      list.includes("PreToolUse") &&
      list.includes("PostToolUse") &&
      list.length > best.length
    )
      best = list;
  }
  return sorted(new Map(best.map((n) => [n, ""])));
};

/**
 * Gate names: quoted `tengu_*` names that are the first argument of a call with a literal default,
 * as in `f("tengu_x",!1)`. Event-log calls `f("tengu_x",{...})` are not gates. A heuristic: the call name is minified.
 */
export const extractGates = (text: string): Items => {
  const out: Items = new Map();
  const re =
    /[\w$]+\("(tengu_[a-z0-9_]+)",(!0|!1|null|-?\d+(?:\.\d+)?|""|\{\})\)/g;
  for (const m of text.matchAll(re)) {
    if (m[2] === "{}") continue; // `{}` is ambiguous (empty event payload or object default)
    if (m[1]) out.set(m[1], `default ${m[2]}`);
  }
  return sorted(out);
};

export const extractAll = (text: string): Extracted => ({
  env: extractEnv(text),
  flags: extractFlags(text),
  commands: extractCommands(text),
  settings: extractSettings(text),
  hooks: extractHooks(text),
  gates: extractGates(text),
});
