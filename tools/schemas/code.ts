// Adapter for the surfaces that have no zod schema in the program: status line input, transcript lines,
// OpenTelemetry, frontmatter, and ~/.claude.json. It reads the program's code (the object literals and key
// lists that build each payload) and writes one JSON Schema (draft 2020-12) per surface to schemas/.
// Anchors are literal key names and strings, never minified identifiers; each file's $comment names them.
//
//   bun tools/schemas/code.ts [--bin <binary>] [--captures <dir>] [--out <dir>] [--check] [--spreads]
//
// --spreads lists each spread the adapter cannot resolve, with its module and the index of its literal.
//
// Conventions in the output: a field whose type the code does not show is `{}` with "x-unverified": true.
// A field that a probe in captures/<version>/ saw is marked "x-observed": true.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join, resolve } from "node:path";
import { CLAUDE_CODE_VERSION } from "../../src/version.ts";
import { extractModules } from "./extract.ts";
import {
  type Binding,
  type Brackets,
  bindingAt,
  brackets,
  type Entry,
  exprEnd,
  flatten,
  frameAt,
  functionReturns,
  functionText,
  inside,
  matchClose,
  mergeEntries,
  nameIndex,
  parseObjectAt,
  parseValue,
  splitTop,
  type Val,
} from "./jsparse.ts";

type Json = Record<string, unknown>;
type Src = { name: string; text: string };

const ROOT = resolve(import.meta.dir, "../..");
const BASE_URL = "https://xsyetopz.github.io/claude-code-docs/schemas";

const argv = process.argv.slice(2);
const arg = (name: string): string | undefined => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
};
const BIN =
  arg("--bin") ??
  join(homedir(), ".local/share/claude/versions", CLAUDE_CODE_VERSION);
const OUT = arg("--out") ?? join(ROOT, "schemas");
const VERSION = basename(BIN).match(/^\d+\.\d+\.\d+/)?.[0] ?? "unknown";
const CAPTURES = arg("--captures") ?? join(ROOT, "captures", VERSION);

const report: string[] = [];
const note = (s: string) => report.push(s);

// ---------------------------------------------------------------- program access

const mods: Src[] = extractModules(BIN)
  .modules.filter((m) => /\.m?js$/.test(m.name))
  .map((m) => ({ name: m.name.split("/").pop() as string, text: m.source }));
const mod = (name: string): Src => {
  const m = mods.find((x) => x.name === name);
  if (!m) throw new Error(`module ${name} not found`);
  return m;
};
/** Modules whose text contains `needle`. */
const withText = (needle: string): Src[] =>
  mods.filter((m) => m.text.includes(needle));
const only = (needle: string): Src => {
  const hit = withText(needle);
  if (hit.length === 0) throw new Error(`anchor not found: ${needle}`);
  if (hit.length > 1)
    throw new Error(`anchor in ${hit.length} modules: ${needle}`);
  return hit[0] as Src;
};
const idx = (src: Src, needle: string | RegExp): number => {
  const i =
    typeof needle === "string"
      ? src.text.indexOf(needle)
      : needle.exec(src.text)?.index;
  if (i === undefined || i < 0)
    throw new Error(`anchor not found in ${src.name}: ${needle}`);
  return i;
};
/** Entries of the object literal that starts at the `{` that ends the regex match. */
const literalAfter = (
  src: Src,
  re: RegExp,
): { entries: Entry[]; at: number } => {
  const m = re.exec(src.text);
  if (!m) throw new Error(`anchor not found in ${src.name}: ${re}`);
  const at = m.index + m[0].length - 1;
  return { entries: parseObjectAt(src.text, at), at };
};
const readJson = (path: string): Json | undefined =>
  existsSync(path)
    ? (JSON.parse(readFileSync(path, "utf8")) as Json)
    : undefined;
const esc = (id: string) => id.replace(/\$/g, "\\$");

// ---------------------------------------------------------------- resolving entries

const unresolved: string[] = [];
const lits = (l: (Entry[] | string)[]): Entry[][] =>
  l.filter((x): x is Entry[] => Array.isArray(x));

const scopeCache = new Map<Src, Brackets>();
const scopesOf = (src: Src): Brackets => {
  const b = scopeCache.get(src) ?? brackets(src.text);
  scopeCache.set(src, b);
  return b;
};
const declares = (src: Src, name: string): boolean =>
  scopesOf(src).functions.has(name);
const identCache = new Map<Src, Map<string, number[]>>();
/** Indexes of the code occurrences of `id` in `src`, not after a `.`. */
const occurrences = (src: Src, id: string): number[] => {
  const all = identCache.get(src) ?? nameIndex(src.text, scopesOf(src));
  identCache.set(src, all);
  return all.get(id) ?? [];
};

const identCacheResult = new Map<string, Entry[] | undefined>();
/**
 * Entries of the object that the name `id` holds at `pos` (or `id.key.key` for a nested object): from its
 * declaration and each later write in scope, or for a parameter from the argument at every call site.
 */
const resolveIdent = (
  src: Src,
  pos: number,
  id: string,
  depth = 0,
): Entry[] | undefined => {
  const [head, ...path] = id.split(".") as [string, ...string[]];
  const key = `${src.name}@${pos}:${head}`;
  let got: Entry[] | undefined;
  if (identCacheResult.has(key)) got = identCacheResult.get(key);
  else if (depth <= 6) {
    identCacheResult.set(key, undefined);
    const bind = bindingAt(
      src.text,
      scopesOf(src),
      occurrences(src, head),
      pos,
      head,
    );
    // No binding found, or an unnamed arrow (as in `.then((x)=>`): the older rules.
    got =
      bind?.kind === "opaque"
        ? undefined
        : bind && (bind.kind === "var" || bind.fn)
          ? fromBinding(src, pos, head, bind, depth)
          : fromNearLiteral(src, pos, head);
    identCacheResult.set(key, got);
  }
  for (const k of path) {
    const e = got?.find((x) => "key" in x && x.key === k);
    got = e && "key" in e && e.val.k === "obj" ? e.val.e : undefined;
  }
  return got;
};

/** The older rule: the last `id={...}` before `pos` in the same function, or an arrow param of a `.then`. */
const fromNearLiteral = (
  src: Src,
  pos: number,
  id: string,
): Entry[] | undefined => {
  const re = new RegExp(`[,; (]${esc(id)}=\\{`, "g");
  let best = -1;
  let m: RegExpExecArray | null = re.exec(src.text);
  while (m && m.index < pos) {
    best = m.index + m[0].length - 1;
    m = re.exec(src.text);
  }
  // Same function only: nothing that opens a new scope between the declaration and the use.
  if (
    best >= 0 &&
    pos - best < 6000 &&
    !/\bfunction\b|\bclass\b/.test(src.text.slice(best, pos))
  )
    return parseObjectAt(src.text, best);
  const before = src.text.slice(Math.max(0, pos - 400), pos);
  const call = new RegExp(
    `([\\w$]+)\\([^()]*\\)\\.then\\(\\(${esc(id)}\\)=>[^]*$`,
  ).exec(before);
  if (call) {
    const rets = lits(functionReturns(src.text, call[1] as string));
    if (rets.length > 0) return mergeEntries(rets.map((r) => flatten(r)));
  }
  return undefined;
};

const fromBinding = (
  src: Src,
  pos: number,
  id: string,
  bind: Binding,
  depth: number,
): Entry[] | undefined => {
  const s = src.text;
  const lists: Entry[][] = [];
  if (bind.kind === "var") {
    const b = scopesOf(src);
    const later: Entry[] = [];
    for (const d of occurrences(src, id)) {
      if (d < bind.at || d >= pos || !inside(b, frameAt(b, d), bind.frame))
        continue;
      const w = /^\s*(?:=(?![=>])|\.([\w$]+)\s*=(?![=>]))/.exec(
        s.slice(d + id.length, d + id.length + 80),
      );
      if (!w) {
        // The declaration with no value: undefined until a write.
        if (d === bind.at) lists.push([]);
        continue;
      }
      const from = d + id.length + w[0].length;
      const text = s.slice(from, exprEnd(s, from, true));
      if (w[1]) {
        later.push({ key: w[1], opt: true, val: parseValue(text) });
        continue;
      }
      const got = resolveExpr(src, from, text, depth + 1);
      if (!got) return undefined;
      lists.push(got);
    }
    const out = [...mergeEntries(lists), ...later];
    // No key at all: the name may hold a string or a number, so it is no known object.
    return out.length > 0 ? out : undefined;
  }
  if (bind.kind !== "param" || !bind.fn) return undefined;
  for (const site of callSites(src, bind.fn, bind.fnAt)) {
    if (!site) return undefined;
    const args = splitTop(site.args, ",");
    if (args.slice(0, bind.index + 1).some((a) => a.trim().startsWith("...")))
      return undefined;
    const got = resolveExpr(
      site.src,
      site.at,
      args[bind.index] ?? "void 0",
      depth + 1,
    );
    if (!got) return undefined;
    lists.push(got);
  }
  const out = mergeEntries(lists);
  return out.length > 0 ? out : undefined;
};

/**
 * The calls of the function `name` declared at `at`: in its scope, and for a top-level function that the
 * module exports, in each module that imports it. Undefined in the list means the function is used as a
 * value somewhere, so not every call is known.
 */
const callSites = (
  src: Src,
  name: string,
  at: number,
): ({ src: Src; at: number; args: string } | undefined)[] => {
  const b = scopesOf(src);
  const frame = frameAt(b, at);
  const out: ({ src: Src; at: number; args: string } | undefined)[] = [];
  const scan = (m: Src, local: string, within: number) => {
    const mb = scopesOf(m);
    for (const d of occurrences(m, local)) {
      if ((m === src && d === at) || !inside(mb, frameAt(mb, d), within))
        continue;
      const open = d + local.length;
      // A name in an `import{...}` or `export{...}` list.
      const brace = m.text.lastIndexOf("{", d);
      if (
        /(?:import|export)$/.test(m.text.slice(brace - 6, brace)) &&
        !m.text.slice(brace, d).includes("}")
      )
        continue;
      if (m.text[open] !== "(") {
        out.push(undefined);
        continue;
      }
      out.push({
        src: m,
        at: d,
        args: m.text.slice(open + 1, matchClose(m.text, open)),
      });
    }
  };
  scan(src, name, frame);
  const exported =
    frame < 0 &&
    /export\{([^}]*)\};?\s*$/
      .exec(src.text)?.[1]
      ?.split(",")
      .map((x) => x.trim().split(/\s+as\s+/))
      .find(([inner]) => inner === name);
  if (exported)
    for (const m of mods)
      if (m !== src)
        for (const alias of aliasesOf(
          m,
          src.name,
          (exported[1] ?? exported[0]) as string,
        ))
          scan(m, alias, -1);
  return out;
};

/**
 * Entries of the object an expression gives: a literal, a call, a name, `a.b`, `await x`, or a ternary of
 * those. Null and undefined give no entries, as a spread of them adds nothing.
 */
const resolveExpr = (
  src: Src,
  pos: number,
  text: string,
  depth = 0,
): Entry[] | undefined => {
  const t = text.trim().replace(/^await\s+/, "");
  if (/^(?:null|void 0|undefined)$/.test(t)) return [];
  const q = ternary(t);
  if (q) {
    const a = resolveExpr(src, pos, q[1], depth);
    const c = resolveExpr(src, pos, q[2], depth);
    return a && c ? mergeEntries([a, c]) : undefined;
  }
  if (t.startsWith("{") && matchClose(t, 0) === t.length - 1)
    return pin(src, pos, parseObjectAt(t, 0), depth);
  if (/^[\w$]+(?:\.[\w$]+)*$/.test(t)) return resolveIdent(src, pos, t, depth);
  return resolveCall(src, t);
};
/** `name` in an `import{...}` or `export{...}` list, as [inner, outer]: `a as b` gives [a, b]. */
const bindings = (list: string): [string, string][] =>
  list.split(",").map((b) => {
    const [inner, outer] = b.trim().split(/\s+as\s+/);
    return [inner as string, (outer ?? inner) as string];
  });
/**
 * The top-level function that `name` calls from `src`: declared in `src`, or imported into it from the
 * chunk that exports it. A nested function of the same name is a different function.
 */
const declaring = (
  src: Src,
  name: string,
): { src: Src; name: string } | undefined => {
  if (declares(src, name)) return { src, name };
  for (const im of src.text.matchAll(
    /import\{([^}]*)\}from"\/\$bunfs\/root\/([^"]+)"/g,
  )) {
    const exported = bindings(im[1] as string).find(([, o]) => o === name)?.[0];
    if (exported === undefined) continue;
    const from = mods.find((x) => x.name === im[2]);
    const list = from && /export\{([^}]*)\};?\s*$/.exec(from.text)?.[1];
    const local = list
      ? bindings(list).find(([, o]) => o === exported)?.[0]
      : undefined;
    return from && local && declares(from, local)
      ? { src: from, name: local }
      : undefined;
  }
  return undefined;
};

/** `cond ? a : b` split into its three parts, or undefined. `??` and `?.` are not ternaries. */
const ternary = (t: string): [string, string, string] | undefined => {
  const q = splitTop(
    t.replace(/\?\?/g, "\u0001\u0001").replace(/\?\./g, "\u0002."),
    "?",
  ).map((x) => x.replaceAll("\u0001", "?").replaceAll("\u0002", "?"));
  if (q.length !== 2) return undefined;
  const b = splitTop(q[1] as string, ":");
  return b.length === 2
    ? [q[0] as string, b[0] as string, b[1] as string]
    : undefined;
};

/**
 * Entries returned by a call like `f(a,b)`, where `f` is declared in the module or imported into it. Each
 * returned value must be a literal, a call to such a function, or a local built from one (plus the keys
 * that `local.key=` adds later).
 */
const resolveCall = (
  src: Src,
  expr: string,
  depth = 0,
): Entry[] | undefined => {
  const call = expr.trim();
  const m = /^([\w$]+)\(/.exec(call);
  // The whole expression is the call: not `f(x).key` or `f(x)||y`.
  if (!m || depth > 4 || matchClose(call, m[0].length - 1) !== call.length - 1)
    return undefined;
  const found = declaring(src, m[1] as string);
  if (!found) return undefined;
  const def = found.src;
  const all = functionReturns(def.text, found.name);
  if (all.length === 0) return undefined;
  // A parameter the call leaves out is undefined, and so is a local built only from one;
  // JSON drops a key whose value is undefined.
  const fn = functionText(def.text, found.name);
  const at = def.text.indexOf(fn) + fn.length - 1;
  const params = /^function [\w$]+\(([^)]*)\)/
    .exec(fn)?.[1]
    ?.split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  const args = call.slice(m[0].length, matchClose(call, m[0].length - 1));
  const passed = args.trim() ? splitTop(args, ",").length : 0;
  const undef = new Set(params?.slice(passed) ?? []);
  const isUndef = (expr: string): boolean => {
    const t = expr.trim();
    if (t === "void 0") return true;
    const alts = splitTop(t, "??");
    if (alts.length > 1) return alts.every(isUndef);
    const q = ternary(t);
    // `cond ? a : b` with a cond that is undefined takes `b`.
    if (q) return isUndef(splitTop(q[0], "&&")[0] ?? "") && isUndef(q[2]);
    const and = splitTop(t, "&&");
    if (and.length > 1) return isUndef(and[0] as string);
    const id = /^([\w$]+)(?:\?\.[\w$?.]*)?$/.exec(t)?.[1];
    return id !== undefined && undef.has(id);
  };
  // Locals in order: `let a=...,b=...;` at the top of the body.
  const body = fn.slice(fn.indexOf("{") + 1);
  for (const decl of body.matchAll(/\blet ([^;]*);/g))
    for (const part of splitTop(decl[1] as string, ",")) {
      const eq = part.indexOf("=");
      const name = part.slice(0, eq).trim();
      if (eq > 0 && /^[\w$]+$/.test(name) && isUndef(part.slice(eq + 1)))
        undef.add(name);
    }
  const unset = (e: Entry) =>
    "key" in e && e.val.k === "unk" && isUndef(e.val.text);
  // Spreads resolve here, in the module of `f`; the ones left are counted as unresolved.
  const own = (entries: Entry[]): Entry[] =>
    resolveEntries(
      def,
      at,
      flatten(entries).filter((e) => !unset(e)),
      depth + 1,
    ).filter((e) => "key" in e);
  const returned = (expr: string, seen: string[]): Entry[][] | undefined => {
    // `a,b` returns `b`.
    const t = (splitTop(expr.trim(), ",").at(-1) ?? "").trim();
    const q = ternary(t);
    if (q) {
      const a = returned(q[1], seen);
      const b = returned(q[2], seen);
      return a && b ? [...a, ...b] : undefined;
    }
    if (t.startsWith("{") && matchClose(t, 0) === t.length - 1)
      return [own(parseObjectAt(t, 0))];
    // A spread of null or undefined adds no keys.
    if (/^(?:null|void 0|undefined)$/.test(t)) return [[]];
    if (/^[\w$]+\(/.test(t) && matchClose(t, t.indexOf("(")) === t.length - 1) {
      const r = resolveCall(def, t, depth + 1);
      return r && [r];
    }
    if (!/^[\w$]+$/.test(t) || seen.includes(t)) return undefined;
    const d = new RegExp(`(?:\\blet |[,;{])${esc(t)}=(?!=)`).exec(body);
    if (!d) return undefined;
    const from = d.index + d[0].length;
    const later: Entry[] = [
      ...body.matchAll(
        new RegExp(`(?<![\\w$.])${esc(t)}\\.([\\w$]+)=(?!=)`, "g"),
      ),
    ].map((a) => {
      const v = a.index + a[0].length;
      return {
        key: a[1] as string,
        opt: true,
        val: parseValue(body.slice(v, exprEnd(body, v, true))),
      };
    });
    return returned(body.slice(from, exprEnd(body, from, true)), [
      ...seen,
      t,
    ])?.map((l) => [...l, ...later]);
  };
  const lists: Entry[][] = [];
  for (const r of all) {
    const got = Array.isArray(r) ? [own(r)] : returned(r, []);
    if (!got) return undefined;
    lists.push(...got);
  }
  // Values resolve here too: a name in them is a name of `f`, not of the caller.
  return pin(def, at, mergeEntries(lists), depth + 1);
};

/** Flatten spreads and resolve the ones that call a literal-returning function or name a variable. */
const resolveEntries = (
  src: Src,
  pos: number,
  entries: Entry[],
  depth = 0,
): Entry[] => {
  const out: Entry[] = [];
  for (const e of flatten(entries)) {
    if ("key" in e) {
      out.push(e);
      continue;
    }
    const got = resolveExpr(src, pos, e.spread, depth);
    if (got && depth < 3) {
      for (const inner of resolveEntries(src, pos, got, depth + 1))
        out.push({ ...inner, opt: inner.opt || e.opt });
    } else if (!/^!?[01]$|^void 0$/.test(e.spread.trim()))
      unresolved.push(`${src.name}@${pos}: ...${e.spread}`);
  }
  return out;
};

/** The object a value holds, when it holds one with keys: an empty result may be null or a number. */
const objectValue = (
  src: Src,
  pos: number,
  text: string,
  depth = 0,
): Entry[] | undefined => {
  const got = text ? resolveExpr(src, pos, text, depth) : undefined;
  return got?.length ? got : undefined;
};

// ---------------------------------------------------------------- schema building

// "const": a string literal is the only value; "default": it is the default value; "plain": just a string.
type Mode = "const" | "default" | "plain";
const UNVERIFIED: Json = { "x-unverified": true };

const objSchema = (
  src: Src,
  pos: number,
  entries: Entry[],
  mode: Mode,
  depth = 0,
): Json => {
  const properties: Record<string, Json> = {};
  for (const e of resolveEntries(src, pos, entries)) {
    if (!("key" in e)) continue;
    const next = properties[e.key];
    const here = valSchema(src, pos, e.val, mode, depth + 1);
    // The same key twice (a spread then an override): the later one wins, as in JavaScript.
    properties[e.key] =
      next && here["x-unverified"] && !next["x-unverified"] ? next : here;
  }
  return { type: "object", properties };
};

const valSchema = (
  src: Src,
  pos: number,
  v: Val,
  mode: Mode,
  depth: number,
): Json => {
  switch (v.k) {
    case "obj":
      return objSchema(src, pos, v.e, mode, depth);
    case "str":
      return mode === "const"
        ? { const: v.v }
        : mode === "default"
          ? { type: "string", default: v.v }
          : { type: "string" };
    case "enum":
      return mode === "const" ? { enum: v.v } : { type: "string" };
    case "num":
      return mode === "default"
        ? { type: "number", default: v.v }
        : { type: "number" };
    case "bool":
      return mode === "default"
        ? { type: "boolean", default: v.v }
        : { type: "boolean" };
    case "arr":
      return { type: "array" };
    case "unk": {
      if (depth < 4) {
        const asObj = objectValue(src, pos, v.text);
        if (asObj) return objSchema(src, pos, asObj, mode, depth);
      }
      return { ...UNVERIFIED };
    }
  }
};

const header = (file: string, title: string, comment: string): Json => ({
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: `${BASE_URL}/${file}`,
  title: `${title} (Claude Code ${VERSION})`,
  $comment: comment,
});

const props = (s: Json): Record<string, Json> =>
  (s["properties"] ?? {}) as Record<string, Json>;

/** Mark properties named in `keys` as observed, and add the ones the code did not show. */
const markObserved = (schema: Json, keys: string[]): number => {
  const p = props(schema);
  for (const k of keys)
    p[k] = { ...(p[k] ?? { ...UNVERIFIED }), "x-observed": true };
  schema["properties"] = p;
  return keys.length;
};

const countProps = (s: unknown): number => {
  if (!s || typeof s !== "object") return 0;
  let n = 0;
  for (const [k, v] of Object.entries(s as Json)) {
    if (k === "properties") {
      for (const sub of Object.values(v as Json)) n += 1 + countProps(sub);
    } else if (k === "$defs") {
      for (const sub of Object.values(v as Json)) n += countProps(sub);
    } else if (v && typeof v === "object") n += countProps(v);
  }
  return n;
};

// ---------------------------------------------------------------- 1. status line

type TNode = {
  type?: string;
  comment: string;
  nullable: boolean;
  children?: Map<string, TNode>;
};

/** The JSON template in the statusline-setup agent prompt: type text and comment of each path. */
const parseTemplate = (src: Src): TNode => {
  const start = idx(
    src,
    "The statusLine command will receive the following JSON input via stdin:",
  );
  const lines = src.text.slice(start).split("\n").slice(1);
  const root: TNode = { comment: "", nullable: false, children: new Map() };
  const stack: TNode[] = [root];
  let started = false;
  for (const line of lines) {
    const t = line.trim();
    if (!started) {
      if (t === "{") started = true;
      continue;
    }
    if (t.startsWith("}")) {
      const closed = stack.pop() as TNode;
      if (/\|\s*null/.test(t)) closed.nullable = true;
      if (stack.length === 0) break;
      continue;
    }
    const m = /^"([\w.-]+)":\s*(.*)$/.exec(t);
    if (!m) continue;
    const [value, ...rest] = (m[2] as string).split("//");
    const comment = rest.join("//").trim();
    const v = (value as string).trim().replace(/,$/, "").trim();
    const node: TNode = { comment, nullable: false };
    (stack[stack.length - 1] as TNode).children?.set(m[1] as string, node);
    if (v === "{") {
      node.children = new Map();
      stack.push(node);
    } else node.type = v;
  }
  return root;
};

const templateType = (text: string): Json => {
  const alts = splitTop(text, "|").map((a) => a.trim());
  const one = (a: string): Json | undefined => {
    if (a === '"string"') return { type: "string" };
    if (a === "number") return { type: "number" };
    if (a === "boolean") return { type: "boolean" };
    if (a === "null") return { type: "null" };
    if (a === '["string"]') return { type: "array", items: { type: "string" } };
    if (/^\{ "string": number \}$/.test(a))
      return { type: "object", additionalProperties: { type: "number" } };
    if (/^"[^"]+"$/.test(a)) return { const: a.slice(1, -1) };
    return undefined;
  };
  const parts = alts.map(one);
  if (parts.some((p) => !p)) return { ...UNVERIFIED };
  const ok = parts as Json[];
  if (ok.length === 1) return ok[0] as Json;
  if (ok.every((p) => "const" in p || p["type"] === "null")) {
    const consts = ok.filter((p) => "const" in p).map((p) => p["const"]);
    return ok.some((p) => p["type"] === "null")
      ? { enum: [...consts, null] }
      : { enum: consts };
  }
  return { anyOf: ok };
};

/** Fill types and descriptions from the template, and report paths that only one side has. A template-only key is left out. */
const mergeTemplate = (
  schema: Json,
  node: TNode,
  path: string,
  codeOnly: string[],
  tmplOnly: string[],
) => {
  const viaVariable = schema["x-unverified"] === true;
  delete schema["x-unverified"];
  if (!schema["type"] && !schema["anyOf"]) schema["type"] = "object";
  const p = props(schema);
  for (const [k, child] of node.children ?? []) {
    const at = path ? `${path}.${k}` : k;
    let cur = p[k];
    // The code builds this object from a literal without the key, so the program never sends it.
    if (!cur && !viaVariable) {
      tmplOnly.push(at);
      continue;
    }
    if (!cur) {
      cur = child.children
        ? { type: "object", properties: {} }
        : templateType(child.type ?? "");
      p[k] = cur;
    } else if (!child.children && cur["x-unverified"]) {
      const { "x-observed": obs } = cur;
      cur = {
        ...templateType(child.type ?? ""),
        ...(obs ? { "x-observed": true } : {}),
      };
      p[k] = cur;
    }
    if (child.comment) cur["description"] = child.comment;
    if (child.children) {
      if (child.nullable) {
        const inner: Json = { ...cur };
        delete inner["description"];
        cur = {
          description: child.comment || undefined,
          anyOf: [inner, { type: "null" }],
        };
        p[k] = cur;
        mergeTemplate(inner, child, at, codeOnly, tmplOnly);
      } else mergeTemplate(cur, child, at, codeOnly, tmplOnly);
    }
  }
  for (const k of Object.keys(p)) {
    if (!node.children?.has(k) && node.children && !viaVariable)
      codeOnly.push(path ? `${path}.${k}` : k);
  }
  schema["properties"] = p;
};

const buildStatusLine = (): { file: string; schema: Json } => {
  const src = only("tengu_status_line_result");
  const main = literalAfter(
    src,
    /return\{\.\.\.[\w$]+\([\w$]+,[\w$]+\),\.\.\.[\w$]+&&\{session_name:/,
  );
  // literalAfter points at the `{` before session_name; the full literal starts at the `return{` before it.
  const retAt = src.text.lastIndexOf("return{", main.at) + "return".length;
  const entries = parseObjectAt(src.text, retAt);
  const schema = objSchema(src, retAt, entries, "plain");
  const tmpl = parseTemplate(src);
  const codeOnly: string[] = [];
  const tmplOnly: string[] = [];
  mergeTemplate(schema, tmpl, "", codeOnly, tmplOnly);

  const probe = readJson(
    join(CAPTURES, "pty/statusline.refresh-interval.json"),
  );
  const seen = ((probe?.["facts"] as Json | undefined)?.["stdinKeys"] ??
    []) as string[];
  markObserved(schema, seen);
  for (const k of seen)
    if (!props(schema)[k]) note(`status-line: probe key ${k} not in code`);

  // The subagent panel gets its own payload: the common base plus `columns` and `tasks`.
  const sub = only("subagentStatusLine execution");
  const sm = /\{\.\.\.[\w$]+\([\w$]+,[\w$]+\),columns:[\w$]+,tasks:/.exec(
    sub.text,
  );
  let subDef: Json | undefined;
  if (sm) {
    const subEntries = parseObjectAt(sub.text, sm.index);
    const subSchema = objSchema(sub, sm.index, subEntries, "plain");
    const tasks = subEntries.find((e) => "key" in e && e.key === "tasks");
    const tm =
      tasks && "val" in tasks && tasks.val.k === "unk"
        ? /=>\(\{/.exec(tasks.val.text)
        : null;
    if (tasks && "val" in tasks && tasks.val.k === "unk" && tm) {
      const item = objSchema(
        sub,
        sm.index,
        parseObjectAt(tasks.val.text, tm.index + 3),
        "plain",
      );
      props(subSchema)["tasks"] = { type: "array", items: item };
    }
    // The common base is spread from the same builder as the main payload, with two arguments as
    // there: copy the keys that builder sends.
    const baseCall = /return\{\.\.\.([\w$]+\([\w$]+,[\w$]+\))/.exec(
      src.text.slice(retAt - "return".length),
    )?.[1];
    const baseKeys = new Set(
      (baseCall ? (resolveCall(src, baseCall) ?? []) : []).flatMap((e) =>
        "key" in e ? [e.key] : [],
      ),
    );
    for (const [k, v] of Object.entries(props(schema)))
      if (baseKeys.has(k)) props(subSchema)[k] = v;
    const subSeen = ((
      readJson(join(CAPTURES, "pty/statusline.subagent-tick.json"))?.[
        "facts"
      ] as Json | undefined
    )?.["stdinKeys"] ?? []) as string[];
    markObserved(subSchema, subSeen);
    subDef = {
      ...subSchema,
      $comment: "Payload of the subagentStatusLine command.",
    };
  }
  if (tmplOnly.length)
    note(
      `status-line: in the prompt template, and the code builds that object from a literal without it: ${tmplOnly.join(", ")}`,
    );
  if (codeOnly.length)
    note(
      `status-line: set by the code but absent from the prompt template: ${codeOnly.join(", ")}`,
    );

  const out: Json = {
    ...header(
      "claude-code-status-line.json",
      "Claude Code status line stdin JSON",
      `For the JSON on stdin of a statusLine command. Generated from Claude Code ${VERSION} by tools/schemas/code.ts. Anchors: the telemetry key "tengu_status_line_result" (module with the builder whose return literal starts at "session_name"), the common base builder it spreads (keys session_id, transcript_path, cwd, scratchpad_dir, prompt_id, permission_mode, agent_id, agent_type, effort), the prompt_cache builder (key "prompt_cache" with "warm"), and "The statusLine command will receive the following JSON input via stdin:" for the types and descriptions the code does not show. Field order is the order in the code.${tmplOnly.length ? ` The prompt also lists ${tmplOnly.join(", ")}, which the code never sets, so ${tmplOnly.length > 1 ? "they are" : "it is"} left out.` : ""}${codeOnly.length ? ` The code sets ${codeOnly.join(", ")}, which the prompt does not list.` : ""} Do not edit by hand.`,
    ),
    ...schema,
    ...(subDef ? { $defs: { subagentStatusLineInput: subDef } } : {}),
  };
  return { file: "claude-code-status-line.json", schema: out };
};

// ---------------------------------------------------------------- 2. transcript

const CHAIN = ["user", "assistant", "system", "attachment", "progress"];

/** The `{` of the nearest object literal around index `i`, or -1. It looks back at most 3000 characters. */
const enclosing = (text: string, i: number): number => {
  let open = text.lastIndexOf("{", i);
  while (open >= 0 && i - open < 3000 && matchClose(text, open) < i)
    open = text.lastIndexOf("{", open - 1);
  return open >= 0 && i - open < 3000 ? open : -1;
};
/** A literal that copies a line: `{...line, ...}`. */
const copies = (text: string, open: number): boolean =>
  open >= 0 && text.startsWith("...", open + 1);

/**
 * Where the program adds `key` to a line after building it: a key in a copy of the line (`{...line, key}`),
 * a key in a spread inside such a copy, a key returned by a function spread into one, or last a property
 * assignment (`x.key=`). The type comes from a literal value; else it is unverified.
 */
const spreadIntoCopy = new Map<string, boolean>();
const laterWrite = (key: string): Json | undefined => {
  const k = esc(key);
  for (const m of mods) {
    const re = new RegExp(`[{,]${k}:`, "g");
    for (let h = re.exec(m.text); h; h = re.exec(m.text)) {
      const open = enclosing(m.text, h.index);
      if (open < 0) continue;
      const close = matchClose(m.text, open);
      // `let{key:a,...rest}=line` reads the key; it does not write it.
      if (m.text[close + 1] === "=" && m.text[close + 2] !== "=") continue;
      // A literal returned by a function, when a copy of a line spreads that function's result.
      const returnedIntoCopy = () => {
        if (m.text.slice(open - 6, open) !== "return") return false;
        const fn = [
          ...m.text
            .slice(Math.max(0, open - 3000), open)
            .matchAll(/function ([\w$]+)\(/g),
        ].at(-1)?.[1];
        if (fn === undefined) return false;
        const id = `${m.name}\0${fn}`;
        let hit = spreadIntoCopy.get(id);
        if (hit === undefined) {
          hit = [
            ...m.text.matchAll(new RegExp(`\\.\\.\\.${esc(fn)}\\(`, "g")),
          ].some((c) => copies(m.text, enclosing(m.text, c.index)));
          spreadIntoCopy.set(id, hit);
        }
        return hit;
      };
      const inCopy =
        copies(m.text, open) ||
        copies(m.text, enclosing(m.text, open - 1)) ||
        returnedIntoCopy();
      if (!inCopy) continue;
      const e = parseObjectAt(m.text, open).find(
        (x) => "key" in x && x.key === key,
      );
      if (!e || !("key" in e)) continue;
      return {
        ...valType(e.val),
        $comment:
          "Added after the line is built, by a copy of the line or a spread into one.",
      };
    }
  }
  // Last, a property assignment. It can match an unrelated object, so copies of a line come first.
  for (const m of mods) {
    const assign = new RegExp(`\\.${k}=(?!=)`).exec(m.text);
    if (assign) {
      const v = parseValue(
        m.text.slice(assign.index + assign[0].length).split(/[;,})]/)[0] ?? "",
      );
      return {
        ...valType(v),
        $comment: "Added after the line is built, by a property assignment.",
      };
    }
  }
  return undefined;
};
const valType = (v: Val): Json =>
  v.k === "str" || v.k === "enum"
    ? { type: "string" }
    : v.k === "num"
      ? { type: "number" }
      : v.k === "bool"
        ? { type: "boolean" }
        : v.k === "obj"
          ? { type: "object" }
          : v.k === "arr"
            ? { type: "array" }
            : { "x-unverified": true };

const buildTranscript = (): { file: string; schema: Json } => {
  const reg = only('{user:"transcript",assistant:"transcript"');
  const regAt = idx(reg, '{user:"transcript",assistant:"transcript"');
  const registry = parseObjectAt(reg.text, regAt);
  const types = registry.flatMap((e) => ("key" in e ? [e.key] : []));
  const policy = new Map(
    registry.flatMap((e) =>
      "key" in e && e.val.k === "str" ? [[e.key, e.val.v] as const] : [],
    ),
  );

  // Fields the writer adds to every message line: the literal in insertMessageChain plus its spreads.
  const wRe = /parentUuid:[\w$]+\?null:[\w$]+,logicalParentUuid:/;
  const w = mods.find((m) => wRe.test(m.text)) as Src;
  const wAt = w.text.lastIndexOf("{", idx(w, wRe));
  const common = objSchema(w, wAt, parseObjectAt(w.text, wAt), "const");

  // Every `{type:"<t>",...}` literal in the program.
  const sites = new Map<string, { src: Src; at: number; entries: Entry[] }[]>();
  const re = /\{(?:\.\.\.[\w$.()]+,)?type:"([\w-]+)"[,}]/g;
  for (const m of mods) {
    let hit: RegExpExecArray | null = re.exec(m.text);
    while (hit) {
      const t = hit[1] as string;
      if (types.includes(t)) {
        const list = sites.get(t) ?? [];
        list.push({
          src: m,
          at: hit.index,
          entries: parseObjectAt(m.text, hit.index),
        });
        sites.set(t, list);
      }
      hit = re.exec(m.text);
    }
    // Literals where `type:"<t>"` comes later, such as an assistant message built as {message, ..., type:"assistant"}:
    // the nearest `{` before the key whose literal holds it at the top level.
    const mid = /,type:"([\w-]+)"[,}]/g;
    let h: RegExpExecArray | null = mid.exec(m.text);
    while (h) {
      const t = h[1] as string;
      if (types.includes(t)) {
        for (
          let at = m.text.lastIndexOf("{", h.index);
          at >= 0 && h.index - at < 3000;
          at = m.text.lastIndexOf("{", at - 1)
        ) {
          if (matchClose(m.text, at) < h.index) continue;
          const entries = parseObjectAt(m.text, at);
          const top = entries.some(
            (e) =>
              "key" in e &&
              e.key === "type" &&
              e.val.k === "str" &&
              e.val.v === t,
          );
          if (top) {
            const list = sites.get(t) ?? [];
            if (!list.some((x) => x.src === m && x.at === at))
              list.push({ src: m, at, entries });
            sites.set(t, list);
          }
          break;
        }
      }
      h = mid.exec(m.text);
    }
  }
  const keysOf = (entries: Entry[]) =>
    flatten(entries).flatMap((e) => ("key" in e ? [e.key] : []));

  const probe = readJson(join(CAPTURES, "print/transcripts.lines.json"));
  const facts = (probe?.["facts"] ?? {}) as Json;

  const $defs: Record<string, Json> = {};
  const noCode: string[] = [];
  for (const t of types) {
    const all = sites.get(t) ?? [];
    let use: typeof all;
    if (CHAIN.includes(t)) {
      // Message constructors: they carry uuid, and none of the stream-json snake_case keys.
      use = all.filter((s) => {
        const k = keysOf(s.entries);
        const ok = k.includes("uuid") || k.includes("toolUseID");
        const stream =
          k.includes("session_id") ||
          k.includes("parent_tool_use_id") ||
          k.includes("user_id");
        return ok && !stream && (t !== "system" || k.includes("subtype"));
      });
    } else {
      use = all.filter((s) => keysOf(s.entries).includes("sessionId"));
      if (use.length === 0) use = all.filter((s) => s.src === reg);
    }
    const lists = use.map((s) => pin(s.src, s.at, s.entries));
    const merged = mergeEntries(lists);
    const schema = objSchema(
      use[0]?.src ?? w,
      use[0]?.at ?? 0,
      merged,
      "const",
    );
    const p = props(schema);
    // `type` is the discriminator, whatever the sites say.
    const withType: Record<string, Json> = { type: { const: t } };
    for (const [k, v] of Object.entries(p)) if (k !== "type") withType[k] = v;
    schema["properties"] = withType;
    if (CHAIN.includes(t))
      for (const [k, v] of Object.entries(props(common)))
        if (!(k in withType)) withType[k] = v;
    if (use.length === 0) noCode.push(t);
    const seen = facts[`line.${t}`];
    if (Array.isArray(seen)) {
      // A key a probe saw that no constructor has is added by a later step: find that write.
      const fresh = (seen as string[]).filter((k) => !(k in withType));
      const lost: string[] = [];
      for (const k of fresh) {
        const site = laterWrite(k);
        if (site) withType[k] = site;
        else lost.push(k);
      }
      markObserved(schema, seen as string[]);
      if (lost.length)
        note(
          `transcript ${t}: probe keys with no write site: ${lost.join(", ")}`,
        );
    }
    schema["$comment"] =
      `Registry policy: ${policy.get(t) ?? "none"}. Code sites used: ${use.length}.${use.length ? "" : " The program reads this type, and no code in this build writes it, so only `type` is known."}`;
    $defs[t] = schema;
  }
  if (noCode.length)
    note(
      `transcript: read-only types (the program reads them, and no code in this build writes them): ${noCode.join(", ")}`,
    );
  const probed = Object.keys(facts)
    .filter((k) => k.startsWith("line."))
    .map((k) => k.slice(5));
  for (const t of probed)
    if (!types.includes(t))
      note(`transcript: probe line type ${t} is not in the registry`);

  const ordered = Object.fromEntries(
    Object.entries($defs).sort(([a], [b]) => a.localeCompare(b)),
  );
  const out: Json = {
    ...header(
      "claude-code-transcript.json",
      "Claude Code transcript JSONL entry",
      `For one line of a session transcript (.jsonl). Generated from Claude Code ${VERSION} by tools/schemas/code.ts. Anchors: the entry type registry (an object literal whose first keys are user, assistant, system, attachment, mapped to "transcript"); the literal built in the writer's insertMessageChain (key logicalParentUuid) and its two spreads for the common fields of message lines; every object literal with a top-level type:"<entry type>" (non-message types need a sessionId key), with its spreads resolved in the module that declares each function (imports followed); and, for a key a probe saw that no such literal has, the later write: a copy of the line ({...line, key}), a function spread into one, or last a property assignment. Keys are the union over all write sites; a string value that differs between sites is an enum, and one that is a literal at one site and computed at another is x-unverified. Probe print/transcripts.lines.json marks the observed keys. Do not edit by hand.`,
    ),
    type: "object",
    oneOf: Object.keys(ordered).map((t) => ({ $ref: `#/$defs/${t}` })),
    $defs: ordered,
  };
  return { file: "claude-code-transcript.json", schema: out };
};

// ---------------------------------------------------------------- 3. OpenTelemetry

/** Local names under which a module imports `exportName` from the chunk `chunk`. */
const aliasesOf = (src: Src, chunk: string, exportName: string): string[] => {
  const out: string[] = [];
  const re = new RegExp(
    `import\\{([^}]*)\\}from"/\\$bunfs/root/${esc(chunk).replace(/\./g, "\\.")}"`,
    "g",
  );
  let m: RegExpExecArray | null = re.exec(src.text);
  while (m) {
    for (const item of (m[1] as string).split(",")) {
      const [a, b] = item.trim().split(/\s+as\s+/);
      if (a === exportName) out.push(b ?? a);
    }
    m = re.exec(src.text);
  }
  return out;
};

/**
 * Resolve the values of one site's entries in the site's own module, before entries of sites in other
 * modules merge: a name like `VR` is a different function in each chunk. A value left unresolved gets
 * empty text, so that no later step resolves it in another module.
 */
const pin = (src: Src, pos: number, entries: Entry[], depth = 0): Entry[] =>
  resolveEntries(src, pos, entries).map((e) => {
    if (!("key" in e)) return e;
    const v = e.val;
    const inner =
      v.k === "obj"
        ? v.e
        : v.k === "unk" && depth < 4
          ? objectValue(src, pos, v.text, depth)
          : undefined;
    if (inner)
      return { ...e, val: { k: "obj", e: pin(src, pos, inner, depth + 1) } };
    return v.k === "unk" ? { ...e, val: { k: "unk", text: "" } } : e;
  });

const attrsToProps = (
  src: Src,
  pos: number,
  entries: Entry[] | undefined,
  into: Record<string, Json>,
  mode: Mode = "const",
) => {
  if (!entries) return;
  const s = objSchema(src, pos, entries, mode);
  for (const [k, v] of Object.entries(props(s)))
    into[k] = into[k] && !into[k]["x-unverified"] ? into[k] : v;
};

const buildOtel = (): { file: string; schema: Json } => {
  const $defs: Record<string, Json> = {};

  // Base attributes: the keys the metrics/events attribute builder assigns.
  const bSrc = only('["user.id"]=');
  const bAt = idx(bSrc, '["user.id"]=');
  const bStart = bSrc.text.lastIndexOf("function ", bAt);
  const bText = bSrc.text.slice(
    bStart,
    matchClose(bSrc.text, bSrc.text.indexOf("{", bStart)) + 1,
  );
  const baseKeys = [
    ...new Set(
      [...bText.matchAll(/\b[\w$]\["([\w.]+)"\]=/g)].map((m) => m[1] as string),
    ),
  ];
  const baseGates = [
    ...new Set(
      [...bText.matchAll(/"(OTEL_METRICS_INCLUDE_\w+)"/g)].map(
        (m) => m[1] as string,
      ),
    ),
  ];
  const base: Record<string, Json> = {};
  for (const k of baseKeys) base[k] = { ...UNVERIFIED };
  const baseNote = `Base attributes (keys assigned by the attribute builder, in code order); the builder also copies keys of OTEL_RESOURCE_ATTRIBUTES when OTEL_METRICS_INCLUDE_RESOURCE_ATTRIBUTES is set. ${baseGates.length ? ` Gates found in the builder: ${baseGates.join(", ")}.` : ""}`;

  // Attribution keys (agent, skill, plugin, mcp) that cost/token metrics spread in.
  const attrRe = /\{\.\.\.[\w$]+&&\{"agent\.name":/;
  const attrSrc = mods.find((m) => attrRe.test(m.text)) as Src;
  const attrAt = idx(attrSrc, attrRe);
  const attrib: Record<string, Json> = {};
  attrsToProps(attrSrc, attrAt, parseObjectAt(attrSrc.text, attrAt), attrib);
  for (const v of Object.values(attrib)) v["x-unverified"] = true;

  // Metrics: installMeter registers each counter; accessors expose them; call sites add values.
  const mSrc = only("Count of CLI sessions started");
  const slot = new Map<
    string,
    { name: string; description: string; unit?: string }
  >();
  for (const m of mSrc.text.matchAll(
    /this\.(#\w+)=[\w$]+\("claude_code\.([\w.]+)",\{description:"((?:[^"\\]|\\.)*)"(?:,unit:[\w$]+\("(\w+)"\))?\}/g,
  ))
    slot.set(m[1] as string, {
      name: m[2] as string,
      description: JSON.parse(`"${m[3]}"`),
      unit: m[4],
    });
  const method = new Map<string, string>();
  for (const m of mSrc.text.matchAll(
    /(\w+Counter)\(\)\{return this\.(#\w+)\}/g,
  )) {
    const s = slot.get(m[2] as string);
    if (s) method.set(m[1] as string, s.name);
  }
  const accessorSrc = mods.find((m) =>
    m.text.includes("telemetryHandles.sessionCounter()"),
  );
  if (!accessorSrc) throw new Error("metric accessors not found");
  const metricProps = new Map<string, Record<string, Json>>();
  for (const [meth, name] of method) {
    const acc = new RegExp(
      `function ([\\w$]+)\\(\\)\\{return [\\w$]+\\(\\)\\.host\\.telemetryHandles\\.${meth}\\(\\)\\}`,
    ).exec(accessorSrc.text);
    const p: Record<string, Json> = {};
    metricProps.set(name, p);
    if (!acc) continue;
    for (const m of mods) {
      const names =
        m === accessorSrc
          ? [acc[1] as string]
          : aliasesOf(m, accessorSrc.name, acc[1] as string);
      for (const nm of names) {
        const call = new RegExp(
          `(?<![\\w$.])${esc(nm)}\\(\\)\\?\\.add\\(`,
          "g",
        );
        let hit: RegExpExecArray | null = call.exec(m.text);
        while (hit) {
          const open = hit.index + hit[0].length - 1;
          const a = splitTop(
            m.text.slice(open + 1, matchClose(m.text, open)),
            ",",
          );
          const second = a.slice(1).join(",").trim();
          let entries: Entry[] | undefined;
          if (second.startsWith("{")) entries = parseObjectAt(second, 0);
          else if (/^[\w$]+$/.test(second))
            entries = resolveIdent(m, open, second);
          if (entries) {
            const before = unresolved.length;
            attrsToProps(m, open, resolveEntries(m, open, entries), p);
            if (unresolved.length > before && Object.keys(attrib).length) {
              for (const [k, v] of Object.entries(attrib)) p[k] ??= v;
            }
          }
          hit = call.exec(m.text);
        }
      }
    }
  }
  for (const s of slot.values()) {
    const own = metricProps.get(s.name) ?? {};
    $defs[`metric:claude_code.${s.name}`] = {
      "x-otel-kind": "metric",
      type: "object",
      description: s.description,
      ...(s.unit
        ? { $comment: `Unit: ${s.unit}. ${baseNote}` }
        : { $comment: baseNote }),
      properties: { ...base, ...own },
    };
  }

  // Spans.
  const spanDefs = new Map<
    string,
    { props: Record<string, Json>; sites: number; comment: string[] }
  >();
  const addSpan = (
    name: string,
    spanType: string | undefined,
    p: Record<string, Json>,
    how: string,
  ) => {
    const cur = spanDefs.get(name) ?? { props: {}, sites: 0, comment: [] };
    for (const [k, v] of Object.entries(p)) cur.props[k] ??= v;
    cur.sites++;
    cur.comment.push(how);
    if (spanType) cur.props["span.type"] = { const: spanType };
    spanDefs.set(name, cur);
  };
  for (const m of mods) {
    // Style 1: a helper builds the attributes, then startSpan("claude_code.<name>").
    for (const s of m.text.matchAll(/startSpan\("claude_code\.([\w.]+)"/g)) {
      const name = s[1] as string;
      const win = m.text.slice(Math.max(0, (s.index ?? 0) - 1800), s.index);
      const calls = [
        ...win.matchAll(
          new RegExp(
            `([\\w$]+)=([\\w$]+)\\("${name.replace(/\./g, "\\.")}",`,
            "g",
          ),
        ),
      ];
      const last = calls[calls.length - 1];
      const p: Record<string, Json> = {};
      if (last) {
        const winStart = Math.max(0, (s.index ?? 0) - 1800);
        const argAt = winStart + (last.index ?? 0) + last[0].length;
        const rest = m.text.slice(argAt);
        let entries: Entry[] | undefined;
        if (rest.startsWith("{")) entries = parseObjectAt(m.text, argAt);
        else {
          const call = /^([\w$]+)\(/.exec(rest);
          const rets = call
            ? lits(functionReturns(m.text, call[1] as string))
            : [];
          entries = rets.length
            ? mergeEntries(rets.map((r) => flatten(r)))
            : undefined;
        }
        if (entries)
          attrsToProps(m, argAt, resolveEntries(m, argAt, entries), p);
        const between = m.text.slice(argAt, s.index);
        const v = last[1] as string;
        for (const a of between.matchAll(
          new RegExp(
            `(?<![\\w$.])${esc(v)}(?:\\["([\\w.-]+)"\\]|\\.([\\w$]+))=`,
            "g",
          ),
        ))
          p[(a[1] ?? a[2]) as string] ??= { ...UNVERIFIED };
      }
      addSpan(name, name, p, "attributes literal at creation");
    }
    // Style 2: a wrapper takes {spanType, attrs, contentAttrs}.
    for (const s of m.text.matchAll(
      /"claude_code\.([\w.]+)",\{spanType:"([\w.]+)"/g,
    )) {
      const objAt = (s.index ?? 0) + s[0].indexOf(",{spanType") + 1;
      const p: Record<string, Json> = {};
      const content: string[] = [];
      for (const e of parseObjectAt(m.text, objAt)) {
        if (!("key" in e) || e.val.k !== "obj") continue;
        if (e.key !== "attrs" && e.key !== "contentAttrs") continue;
        const before = Object.keys(p);
        attrsToProps(m, objAt, resolveEntries(m, objAt, e.val.e), p);
        if (e.key === "contentAttrs")
          content.push(...Object.keys(p).filter((k) => !before.includes(k)));
      }
      addSpan(
        s[1] as string,
        s[2] as string,
        p,
        content.length ? `contentAttrs: ${content.join(", ")}` : "",
      );
    }
  }
  for (const [name, d] of spanDefs) {
    $defs[`span:claude_code.${name}`] = {
      "x-otel-kind": "span",
      type: "object",
      $comment: `${baseNote} Also set on every span: gen_ai.provider.name. Attributes set after the span starts (at its end) are not listed. Creation sites read: ${d.sites}.${d.comment.filter(Boolean).length ? ` Added only when content logging is on (${d.comment.filter(Boolean).join("; ")}).` : ""}`,
      properties: {
        ...base,
        "gen_ai.provider.name": { ...UNVERIFIED },
        ...d.props,
      },
    };
  }

  // Events: bi(name, attrs) emits a log record with the base attributes and event.* fields.
  const eSrc = only('"event.sequence"');
  const eFn =
    /async function ([\w$]+)\([^)]*\)\{[^{}]*\{\.\.\.[\w$]+\(\),"event\.name":/.exec(
      eSrc.text,
    );
  if (!eFn) throw new Error("event emitter not found");
  const evProps: Record<string, Json> = {
    "event.name": { type: "string" },
    "event.timestamp": { type: "string" },
    "event.sequence": { type: "number" },
    "prompt.id": { ...UNVERIFIED },
    "workspace.host_paths": { type: "array" },
  };
  const events = new Map<string, Entry[][]>();
  const evSites = new Map<string, { src: Src; at: number }>();
  for (const m of mods) {
    const names =
      m === eSrc
        ? [eFn[1] as string]
        : aliasesOf(m, eSrc.name, eFn[1] as string);
    for (const nm of names) {
      const call = new RegExp(`(?<![\\w$.])${esc(nm)}\\("([a-z_]+)"`, "g");
      let hit: RegExpExecArray | null = call.exec(m.text);
      while (hit) {
        const open = hit.index + nm.length;
        const close = matchClose(m.text, open);
        const args = splitTop(m.text.slice(open + 1, close), ",");
        const second = args[1]?.trim();
        let entries: Entry[] = [];
        if (second?.startsWith("{"))
          entries = parseObjectAt(
            m.text.slice(open + 1, close),
            m.text.slice(open + 1, close).indexOf(second),
          );
        else if (second && /^[\w$]+$/.test(second))
          entries = resolveIdent(m, open, second) ?? [];
        const name = hit[1] as string;
        const list = events.get(name) ?? [];
        list.push(pin(m, open, entries));
        events.set(name, list);
        evSites.set(name, { src: m, at: open });
        hit = call.exec(m.text);
      }
    }
  }
  for (const [name, lists] of events) {
    const site = evSites.get(name) as { src: Src; at: number };
    const p: Record<string, Json> = {};
    attrsToProps(site.src, site.at, mergeEntries(lists), p);
    $defs[`event:${name}`] = {
      "x-otel-kind": "event",
      type: "object",
      $comment: `${baseNote} Call sites read: ${lists.length}. A key missing from some sites is optional.`,
      properties: { ...base, ...evProps, ...p, "event.name": { const: name } },
    };
  }

  const ordered = Object.fromEntries(
    Object.entries($defs).sort(([a], [b]) => a.localeCompare(b)),
  );
  const count = (kind: string) =>
    Object.values(ordered).filter((d) => d["x-otel-kind"] === kind).length;
  note(
    `otel: ${count("metric")} metrics, ${count("span")} spans, ${count("event")} events`,
  );
  const out: Json = {
    ...header(
      "claude-code-otel.json",
      "Claude Code OpenTelemetry metrics, spans, and events",
      `For the OpenTelemetry data Claude Code emits. Each $defs entry is one metric, span, or event; the kind is in x-otel-kind and the properties are its attributes. Generated from Claude Code ${VERSION} by tools/schemas/code.ts. Anchors: "Count of CLI sessions started" (the meter setup that registers each metric with its description and unit) with the counter accessor functions and their .add(value, attributes) call sites; the span helpers (startSpan("claude_code.<name>") with the attribute literal built just before it, and the wrapper that takes {spanType, attrs, contentAttrs}); the event emitter that sets "event.name", "event.timestamp", "event.sequence" and its call sites with the attribute literal; the base attribute builder behind "OTEL_METRICS_INCLUDE_SESSION_ID". No probe in captures/ records telemetry, so nothing is marked x-observed. Do not edit by hand.`,
    ),
    $defs: ordered,
  };
  return { file: "claude-code-otel.json", schema: out };
};

// ---------------------------------------------------------------- 4. frontmatter

/** Parse `NAME=f(()=>u({...}))` / `NAME=f(()=>OTHER().extend({...}))` zod object definitions. */
const zodFields = (
  src: Src,
  name: string,
): { parent?: string; fields: Entry[]; at: number } => {
  const re = new RegExp(
    `[,; ]${esc(name)}=[\\w$]+\\(\\(\\)=>(?:([\\w$]+)\\(\\)\\.extend\\(|[\\w$]+\\()\\{`,
  );
  const m = re.exec(src.text);
  if (!m) throw new Error(`zod definition ${name} not found`);
  const at = m.index + m[0].length - 1;
  return { parent: m[1], fields: parseObjectAt(src.text, at), at };
};

const frontmatterField = (e: Entry): [string, Json] | undefined => {
  if (!("key" in e) || e.val.k !== "unk") return undefined;
  const text = e.val.text;
  const out: Json = {};
  const d = /\.describe\(("(?:[^"\\]|\\.)*")\)$/.exec(text);
  if (d) out["description"] = JSON.parse(d[1] as string);
  const en = /^[\w$]+\((\[(?:"[^"]*",?)+\])\)/.exec(text);
  if (en) {
    const vals = JSON.parse(en[1] as string) as string[];
    if (/\.nullable\(\)/.test(text)) out["enum"] = [...vals, null];
    else out["enum"] = vals;
  } else out["x-unverified"] = true;
  return [e.key, out];
};

const buildFrontmatter = (): { file: string; schema: Json } => {
  const src = only("tengu_frontmatter_shadow_unknown_key");
  const reg =
    /\{skill:[\w$]+\(\(\)=>([\w$]+)\(\)\.strict\(\)\),agent:[\w$]+\(\(\)=>([\w$]+)\(\)\.strict\(\)\),"output-style":[\w$]+\(\(\)=>([\w$]+)\(\)\.strict\(\)\)\}/.exec(
      src.text,
    );
  if (!reg) throw new Error("frontmatter schema table not found");
  const [skill, agent, style] = [reg[1], reg[2], reg[3]] as string[];
  const build = (name: string): Json => {
    const z = zodFields(src, name);
    const p: Record<string, Json> = {};
    if (z.parent)
      for (const [k, v] of Object.entries(props(build(z.parent)))) p[k] = v;
    for (const e of z.fields) {
      const f = frontmatterField(e);
      if (f) p[f[0]] = f[1];
    }
    return { type: "object", properties: p };
  };
  const $defs: Record<string, Json> = {
    skill: {
      ...build(skill as string),
      $comment: "Skills and commands (.md files with a YAML header).",
    },
    agent: {
      ...build(agent as string),
      $comment: "Subagent files (.md with a YAML header).",
    },
    "output-style": {
      ...build(style as string),
      $comment: "Output style files (.md with a YAML header).",
    },
  };

  // Cross-check with what the loaders read.
  const readKeys = (text: string, v: string) =>
    new Set([
      ...[
        ...text.matchAll(
          new RegExp(`(?<![\\w$.])${esc(v)}\\.([A-Za-z_]\\w*)`, "g"),
        ),
      ].map((m) => m[1] as string),
      ...[
        ...text.matchAll(
          new RegExp(`(?<![\\w$.])${esc(v)}\\["([\\w-]+)"\\]`, "g"),
        ),
      ].map((m) => m[1] as string),
    ]);
  const loaderAt = idx(src, /\["user-invocable"\]===void 0\?!0:/);
  const lm = [
    ...src.text.slice(0, loaderAt).matchAll(/function ([\w$]+)\(([\w$]+),/g),
  ].pop();
  if (lm) {
    const text = functionText(src.text, lm[1] as string);
    const reads = readKeys(text, lm[2] as string);
    const known = new Set(Object.keys(props($defs["skill"] as Json)));
    const miss = [...reads].filter(
      (k) => !known.has(k) && !["length", "map", "filter"].includes(k),
    );
    if (miss.length)
      note(
        `frontmatter skill: loader reads keys the program's own schema lacks: ${miss.join(", ")}`,
      );
    const unread = [...known].filter((k) => !reads.has(k));
    note(
      `frontmatter skill: schema keys not read in the skill loader function itself: ${unread.join(", ")}`,
    );
  }
  const allow =
    /var [\w$]+=\["name","description","model","allowed-tools"[^\]]*\]/.exec(
      mod("chunk-z1pck59r.js").text,
    );
  if (allow) {
    const keys = JSON.parse(allow[0].slice(allow[0].indexOf("["))) as string[];
    const have = new Set(
      Object.values($defs).flatMap((d) => Object.keys(props(d))),
    );
    note(
      `frontmatter: known-key allowlist has ${keys.length} keys; ${keys.filter((k) => !have.has(k)).length} are in no schema: ${keys.filter((k) => !have.has(k)).join(", ")}`,
    );
  }
  return {
    file: "claude-code-frontmatter.json",
    schema: {
      ...header(
        "claude-code-frontmatter.json",
        "Claude Code frontmatter of skills, subagents, and output styles",
        `For the YAML header of skill/command, subagent, and output style .md files. Generated from Claude Code ${VERSION} by tools/schemas/code.ts. Anchors: "tengu_frontmatter_shadow_unknown_key" and the table {skill, agent, "output-style"} of strict zod objects next to it; descriptions are the program's .describe() text; the loose value type of most keys (string, number, boolean, or null) is why they are x-unverified. Keys with a description that starts with "@internal" are internal. No probe in captures/ records frontmatter keys. Do not edit by hand.`,
      ),
      $defs,
    },
  };
};

// ---------------------------------------------------------------- 5. ~/.claude.json

const buildClaudeJson = (): { file: string; schema: Json } => {
  const src = only("numStartups:0");
  const dStart = idx(src, "{numStartups:0,");
  const pStart = idx(src, "{allowedTools:[],mcpContextUris:[],mcpServers:{}");
  const global = objSchema(
    src,
    dStart,
    parseObjectAt(src.text, dStart),
    "default",
  );
  const project = objSchema(
    src,
    pStart,
    parseObjectAt(src.text, pStart),
    "default",
  );
  const al = /\["apiKeyHelper","installMethod","autoUpdates"[^\]]*\]/.exec(
    src.text,
  );
  if (!al) throw new Error("user-settable key list not found");
  const settable = JSON.parse(al[0]) as string[];
  const gp = props(global);
  const noDefault = settable.filter((k) => !(k in gp));
  for (const k of settable)
    gp[k] = { ...(gp[k] ?? { ...UNVERIFIED }), "x-user-settable": true };
  // `projects[<path>]` is read with the project defaults as the fallback.
  if (!/\.projects\?*\.?\[/.test(src.text))
    throw new Error("projects map not found");
  gp["projects"] = {
    type: "object",
    additionalProperties: { $ref: "#/$defs/project" },
  };
  note(
    `claude-json: ${Object.keys(gp).length} global keys (${settable.length} user-settable, ${noDefault.length} of those not in the defaults), ${Object.keys(props(project)).length} project keys`,
  );
  return {
    file: "claude-code-claude-json.json",
    schema: {
      ...header(
        "claude-code-claude-json.json",
        "Claude Code ~/.claude.json",
        `For ~/.claude.json (the global state file). Generated from Claude Code ${VERSION} by tools/schemas/code.ts. Anchors: the defaults function (first key numStartups:0), the per-project defaults object (allowedTools:[],mcpContextUris:[],mcpServers:{}) used as the fallback for projects[<path>], and the list of user-settable keys (starts "apiKeyHelper","installMethod","autoUpdates"). "default" is the value in the code's defaults; "x-user-settable" marks keys in that list. Keys with no default value in the code (undefined, or only in the list) are x-unverified. The file holds more keys than these (the program writes others on demand); only keys the code names are listed. No probe in captures/ records this file's keys, so nothing is marked x-observed. Do not edit by hand.`,
      ),
      ...global,
      $defs: {
        project: {
          ...project,
          $comment: "Value of projects[<absolute path>].",
        },
      },
    },
  };
};

// ---------------------------------------------------------------- main

const builders = [
  buildStatusLine,
  buildTranscript,
  buildOtel,
  buildFrontmatter,
  buildClaudeJson,
];
const check = argv.includes("--check");
let stale = 0;
for (const b of builders) {
  const { file, schema } = b();
  // Match the repo formatter so regenerating leaves a clean diff.
  const fmt = Bun.spawnSync(
    [
      join(ROOT, "node_modules/.bin/biome"),
      "format",
      `--stdin-file-path=${join(ROOT, "schemas", file)}`,
    ],
    {
      cwd: ROOT,
      stdin: Buffer.from(JSON.stringify(schema, null, 2)),
      stdout: "pipe",
      stderr: "pipe",
    },
  );
  if (fmt.exitCode !== 0)
    throw new Error(`biome format failed:\n${fmt.stderr.toString()}`);
  const text = fmt.stdout.toString();
  const path = join(OUT, file);
  if (check) {
    if (!existsSync(path) || readFileSync(path, "utf8") !== text) {
      stale++;
      console.log(`stale: ${file}`);
    }
  } else writeFileSync(path, text);
  console.log(`${file}: ${countProps(schema)} properties`);
}
console.log(`unresolved spreads: ${unresolved.length}`);
if (argv.includes("--spreads"))
  for (const u of unresolved) console.log(`  ${u}`);
for (const r of report) console.log(`note: ${r}`);
if (stale) process.exit(1);
