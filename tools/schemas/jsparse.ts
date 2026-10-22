// A small reader for object literals in minified JavaScript. It knows strings, brackets, spreads and
// `cond && {...}`; every other expression is an unknown value. Used by code.ts only.
export type Val =
  | { k: "obj"; e: Entry[] }
  | { k: "str"; v: string }
  | { k: "enum"; v: string[] }
  | { k: "num"; v: number }
  | { k: "bool"; v: boolean }
  | { k: "arr" }
  | { k: "unk"; text: string };
export type Entry =
  | { key: string; opt: boolean; val: Val }
  | { spread: string; opt: boolean };

/** Index after the string or template literal that starts at `i`. */
export const skipString = (s: string, i: number): number => {
  const q = s[i];
  let j = i + 1;
  while (j < s.length) {
    const c = s[j];
    if (c === "\\") j += 2;
    else if (c === q) return j + 1;
    else if (q === "`" && c === "$" && s[j + 1] === "{")
      j = matchClose(s, j + 1) + 1;
    else j++;
  }
  return s.length;
};

/** Index of the bracket that closes the one at `i`. */
export const matchClose = (s: string, i: number): number => {
  let depth = 0;
  let j = i;
  while (j < s.length) {
    const c = s[j] as string;
    if (c === '"' || c === "'" || c === "`") {
      j = skipString(s, j);
      continue;
    }
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") {
      depth--;
      if (depth === 0) return j;
    }
    j++;
  }
  return -1;
};

/** Split `s` at top-level occurrences of `sep` (a single character or `&&`). */
export const splitTop = (s: string, sep: string): string[] => {
  const out: string[] = [];
  let depth = 0;
  let last = 0;
  let j = 0;
  while (j < s.length) {
    const c = s[j] as string;
    if (c === '"' || c === "'" || c === "`") {
      j = skipString(s, j);
      continue;
    }
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    else if (depth === 0 && s.startsWith(sep, j)) {
      out.push(s.slice(last, j));
      j += sep.length;
      last = j;
      continue;
    }
    j++;
  }
  out.push(s.slice(last));
  return out;
};

const unquote = (lit: string): string => {
  try {
    return JSON.parse(lit);
  } catch {
    return lit.slice(1, -1);
  }
};

const closesAtEnd = (t: string): boolean => matchClose(t, 0) === t.length - 1;

export const parseValue = (raw: string): Val => {
  const t = raw.trim();
  if (t.startsWith("{") && closesAtEnd(t))
    return { k: "obj", e: parseBody(t.slice(1, -1)) };
  if (t.startsWith("[") && closesAtEnd(t)) return { k: "arr" };
  if ((t[0] === '"' || t[0] === "'") && skipString(t, 0) === t.length)
    return { k: "str", v: unquote(t) };
  if (t === "!0" || t === "true") return { k: "bool", v: true };
  if (t === "!1" || t === "false") return { k: "bool", v: false };
  if (/^-?\d+(\.\d+)?(e\d+)?$/.test(t)) return { k: "num", v: Number(t) };
  return { k: "unk", text: t };
};

const parseSpread = (expr: string): Entry => {
  const parts = splitTop(expr, "&&");
  const last = (parts[parts.length - 1] as string).trim();
  if (parts.length > 1 && last.startsWith("{") && closesAtEnd(last))
    return { spread: last, opt: true };
  // `cond && f(x)` or `cond && obj`: the call or the name, optional.
  const call = /^[\w$]+\(/.exec(last);
  if (
    parts.length > 1 &&
    ((call && matchClose(last, call[0].length - 1) === last.length - 1) ||
      /^[\w$]+$/.test(last))
  )
    return { spread: last, opt: true };
  const q = splitTop(expr, "?");
  if (q.length === 2) {
    const [cons] = splitTop(q[1] as string, ":");
    if (cons?.trim().startsWith("{")) return { spread: cons.trim(), opt: true };
  }
  return { spread: expr.trim(), opt: false };
};

const parseBody = (body: string): Entry[] => {
  const out: Entry[] = [];
  for (const seg0 of splitTop(body, ",")) {
    const seg = seg0.trim();
    if (!seg) continue;
    if (seg.startsWith("...")) {
      out.push(parseSpread(seg.slice(3)));
      continue;
    }
    const m =
      /^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[\w$]+)\s*:([\s\S]*)$/.exec(seg);
    if (m) {
      const key = (m[1] as string).match(/^["']/)
        ? unquote(m[1] as string)
        : (m[1] as string);
      out.push({ key, opt: false, val: parseValue(m[2] as string) });
    } else if (/^[\w$]+$/.test(seg))
      out.push({ key: seg, opt: false, val: { k: "unk", text: seg } });
  }
  return out;
};

/** Entries of the object literal whose `{` is at index `i` of `s`. */
export const parseObjectAt = (s: string, i: number): Entry[] => {
  const end = matchClose(s, i);
  if (end < 0) return [];
  return parseBody(s.slice(i + 1, end));
};

/** End of the expression at `from`: a top-level `;` (or `,` when `comma`), or the closing bracket of its block. */
export const exprEnd = (s: string, from: number, comma = false): number => {
  let end = from;
  let depth = 0;
  while (end < s.length) {
    const c = s[end] as string;
    if (c === '"' || c === "'" || c === "`") {
      end = skipString(s, end);
      continue;
    }
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") {
      if (depth === 0) break;
      depth--;
    } else if ((c === ";" || (comma && c === ",")) && depth === 0) break;
    end++;
  }
  return end;
};

/** One entry list per returned object literal (or ternary branch); the text of a returned value that is not a literal. */
export const functionReturns = (
  src: string,
  name: string,
): (Entry[] | string)[] => {
  const re = new RegExp(`function ${name.replace(/\$/g, "\\$")}\\(`);
  const m = re.exec(src);
  if (!m) return [];
  const open = src.indexOf("{", matchClose(src, m.index + m[0].length - 1));
  const close = matchClose(src, open);
  const body = src.slice(open, close + 1);
  const out: (Entry[] | string)[] = [];
  const rr = /\breturn(?![\w$])/g;
  for (let r = rr.exec(body); r; r = rr.exec(body)) {
    const from = r.index + r[0].length;
    const stmt = body.slice(from, exprEnd(body, from)).trim();
    // A bare `return` gives undefined, which a spread skips.
    if (!stmt) continue;
    const q = splitTop(stmt, "?");
    const branches = q.length === 2 ? splitTop(q[1] as string, ":") : [stmt];
    for (const b of branches) {
      const t = b.trim();
      if (t.startsWith("{") && matchClose(t, 0) === t.length - 1)
        out.push(parseObjectAt(t, 0));
      else out.push(t);
    }
  }
  return out;
};

/** Merge several literals of one thing: a key missing from any of them becomes optional. */
export const mergeEntries = (lists: Entry[][]): Entry[] => {
  const seen = new Map<string, Entry>();
  const count = new Map<string, number>();
  for (const l of lists)
    for (const e of l) {
      if (!("key" in e)) continue;
      count.set(e.key, (count.get(e.key) ?? 0) + 1);
      const prev = seen.get(e.key);
      if (!prev || !("key" in prev)) seen.set(e.key, e);
      // A string literal at one site and another value at the next: the literal is one case only.
      else if (prev.val.k === "unk" && e.val.k === "str") continue;
      else if (prev.val.k === "unk" && e.val.k !== "unk") seen.set(e.key, e);
      else if (prev.val.k === "str" || prev.val.k === "enum") {
        const v = e.val.k === "str" || e.val.k === "enum" ? e.val.v : null;
        const all = new Set([prev.val.v, v ?? []].flat());
        if (v === null) seen.set(e.key, { ...prev, val: e.val });
        else if (all.size > 1)
          seen.set(e.key, { ...prev, val: { k: "enum", v: [...all] } });
      } else if ("key" in prev && prev.val.k === "obj" && e.val.k === "obj")
        seen.set(e.key, {
          ...prev,
          val: { k: "obj", e: mergeEntries([prev.val.e, e.val.e]) },
        });
    }
  return [...seen.values()].map((e) =>
    "key" in e
      ? { ...e, opt: e.opt || (count.get(e.key) ?? 0) < lists.length }
      : e,
  );
};

/** Expand `...cond && {a, b}` spreads into optional entries. Other spreads stay as `spread` entries. */
export const flatten = (entries: Entry[]): Entry[] => {
  const out: Entry[] = [];
  for (const e of entries) {
    if (
      "spread" in e &&
      e.spread.startsWith("{") &&
      matchClose(e.spread, 0) === e.spread.length - 1
    ) {
      for (const inner of flatten(parseObjectAt(e.spread, 0)))
        out.push({ ...inner, opt: inner.opt || e.opt });
    } else out.push(e);
  }
  return out;
};

/** Text of the function `name(...) {...}` in `src`, or "". */
export const functionText = (src: string, name: string): string => {
  const m = new RegExp(`function ${name.replace(/\$/g, "\\$")}\\(`).exec(src);
  if (!m) return "";
  const open = src.indexOf("{", matchClose(src, m.index + m[0].length - 1));
  return src.slice(m.index, matchClose(src, open) + 1);
};

/**
 * Walk the code of `s` from `from` to `to`: skip strings, template text, comments, and regex literals, and
 * call `visit(i, c)` for each code character. A template `${...}` reports its braces as `{` and `}`.
 * `visit` returns true to stop.
 */
export const walkCode = (
  s: string,
  from: number,
  to: number,
  visit: (i: number, c: string) => boolean | undefined,
): void => {
  let stop = false;
  // A string ends at its quote, or at a line end (a string has no raw newline).
  const quoted = (i: number): number => {
    const q = s[i];
    let j = i + 1;
    while (j < to && s[j] !== q && s[j] !== "\n") j += s[j] === "\\" ? 2 : 1;
    return j + 1;
  };
  const template = (i: number): number => {
    let j = i + 1;
    while (j < to && s[j] !== "`" && !stop) {
      if (s[j] === "\\") j += 2;
      else if (s[j] === "$" && s[j + 1] === "{") {
        if (visit(j + 1, "{")) stop = true;
        else j = code(j + 2, true);
      } else j++;
    }
    return j + 1;
  };
  const keyword =
    /(?:^|[^\w$])(?:return|typeof|case|in|of|void|delete|throw|new|else|do)$/;
  // Code from `i`; inside a template `${`, it stops after the `}` that closes it.
  const code = (start: number, inTemplate: boolean): number => {
    let depth = 0;
    let prev = "";
    let i = start;
    while (i < to && !stop) {
      const c = s[i] as string;
      if (c === '"' || c === "'") {
        i = quoted(i);
        prev = c;
        continue;
      }
      if (c === "`") {
        i = template(i);
        prev = c;
        continue;
      }
      if (c === "/" && (s[i + 1] === "/" || s[i + 1] === "*")) {
        const line = s[i + 1] === "/";
        const end = s.indexOf(line ? "\n" : "*/", i + 2);
        // A line comment ends before its newline, which is code.
        i = end < 0 ? to : end + (line ? 0 : 2);
        continue;
      }
      // A regex literal: a `/` where a value starts, after an operator or a keyword like `return`.
      if (
        c === "/" &&
        (prev === "" ||
          "(,=:[!&|?{};+-*%<>~^".includes(prev) ||
          keyword.test(s.slice(Math.max(0, i - 8), i).trimEnd()))
      ) {
        let j = i + 1;
        let inClass = false;
        while (j < to && s[j] !== "\n") {
          if (s[j] === "\\") j++;
          else if (s[j] === "[") inClass = true;
          else if (s[j] === "]") inClass = false;
          else if (s[j] === "/" && !inClass) break;
          j++;
        }
        i = j + 1;
        prev = "/";
        continue;
      }
      if (c === "{") depth++;
      else if (c === "}") {
        if (depth === 0 && inTemplate) {
          if (visit(i, "}")) stop = true;
          return i + 1;
        }
        depth--;
      }
      if (visit(i, c)) stop = true;
      if (c > " ") prev = c;
      i++;
    }
    return i;
  };
  code(from, false);
};

/** The brackets of a module: each one's open and close index and the bracket around it, in source order. */
export type Brackets = {
  open: number[];
  close: number[];
  parent: number[];
  /** Spans `[start, end)` the walk skipped (strings, comments, regex literals), as a flat list. */
  skipped: number[];
  /** Functions declared outside every bracket, with the index of each declaration. */
  functions: Map<string, number>;
};

export const brackets = (s: string): Brackets => {
  const b: Brackets = {
    open: [],
    close: [],
    parent: [],
    skipped: [],
    functions: new Map(),
  };
  const stack: number[] = [];
  let prev = -1;
  walkCode(s, 0, s.length, (i, c) => {
    if (i > prev + 1) b.skipped.push(prev + 1, i);
    prev = i;
    if (c === "{" || c === "(" || c === "[") {
      stack.push(b.open.length);
      b.parent.push(stack.at(-2) ?? -1);
      b.open.push(i);
      b.close.push(s.length);
    } else if (c === "}" || c === ")" || c === "]") {
      const k = stack.pop();
      if (k !== undefined) b.close[k] = i;
    } else if (
      stack.length === 0 &&
      c === "f" &&
      !/[\w$.]/.test(s[i - 1] ?? "")
    ) {
      const m = /^function\*?\s*([\w$]+)\s*\(/.exec(s.slice(i, i + 80));
      if (m && !b.functions.has(m[1] as string))
        b.functions.set(m[1] as string, i);
    }
    return undefined;
  });
  return b;
};

/** Index of the last item of the sorted list `xs` that is at most `x`, or -1. */
const lastAtMost = (xs: number[], x: number, step = 1): number => {
  let lo = 0;
  let hi = Math.floor(xs.length / step) - 1;
  let best = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if ((xs[mid * step] as number) <= x) {
      best = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return best;
};

/** The innermost bracket that holds index `i` (its index in `open`), or -1 at the top level. */
export const frameAt = (b: Brackets, i: number): number => {
  let k = lastAtMost(b.open, i - 1);
  while (k >= 0 && (b.close[k] as number) < i) k = b.parent[k] as number;
  return k;
};

/** True when bracket `k` is `f` or inside it; every bracket is inside the top level, -1. */
export const inside = (b: Brackets, k: number, f: number): boolean => {
  let j = k;
  while (j !== f && j >= 0) j = b.parent[j] as number;
  return j === f;
};

/** True when index `i` is code, not text in a string, a comment, or a regex literal. */
export const isCode = (b: Brackets, i: number): boolean => {
  const k = lastAtMost(b.skipped, i, 2);
  return k < 0 || (b.skipped[k * 2 + 1] as number) <= i;
};

/** The name of the variable or function that the declaration of a parameter list (or arrow) at `i` names. */
const calleeBefore = (s: string, i: number): string | undefined => {
  const head = s.slice(Math.max(0, i - 80), i);
  return (
    /function\*?\s*([\w$]+)\s*$/.exec(head)?.[1] ??
    /(?:^|[^\w$.])([\w$]+)\s*=\s*(?:async\s*)?(?:function\*?\s*)?$/.exec(
      head,
    )?.[1]
  );
};

/**
 * Where `id` is bound at `pos`: a `let`/`const`/`var` declaration, a parameter, or a binding this reader
 * does not follow (a destructuring pattern, `catch`, `for`, a method), which ends the search.
 */
export type Binding =
  | { kind: "var"; at: number; frame: number }
  | { kind: "param"; fn: string | undefined; fnAt: number; index: number }
  | { kind: "opaque" };

/** True when the name at `i` starts a `let`, `const`, or `var` list item: `let a=1,b`. */
const declaredAt = (
  s: string,
  b: Brackets,
  i: number,
  frame: number,
): boolean => {
  const lo = frame >= 0 ? (b.open[frame] as number) + 1 : 0;
  const prev = s.slice(Math.max(lo, i - 7), i);
  if (/(?:^|[^\w$.])(?:let|const|var)\s+$/.test(prev)) return true;
  if (!/,\s*$/.test(prev)) return false;
  // Walk back over the list at this bracket level to the start of the statement.
  let j = i - 1;
  while (j >= lo) {
    const c = s[j] as string;
    if ((c === ")" || c === "]" || c === "}") && isCode(b, j)) {
      const k = frameAt(b, j);
      if (b.close[k] === j) {
        if (/^\s*(?:let|const|var)\s/.test(s.slice(j + 1, j + 8))) return true;
        j = (b.open[k] as number) - 1;
        continue;
      }
    }
    if (c === ";" && isCode(b, j)) break;
    j--;
  }
  return /^\s*(?:let|const|var)\s/.test(s.slice(j + 1, i));
};

/** The binding of the name `id` at `pos`, from `list`, the sorted indexes of `id` in the code of `s`. */
export const bindingAt = (
  s: string,
  b: Brackets,
  list: number[],
  pos: number,
  id: string,
): Binding | undefined => {
  const here = frameAt(b, pos);
  /** True when `pos` is in the body that starts at index `from` (a block, or an arrow's expression). */
  const inBody = (from: number, outer: number): boolean => {
    const start =
      from + (/^\s*/.exec(s.slice(from, from + 99))?.[0].length ?? 0);
    return s[start] === "{"
      ? inside(b, here, frameAt(b, start + 1))
      : pos > start && pos < exprEnd(s, start, true) && inside(b, here, outer);
  };
  for (let n = lastAtMost(list, pos - 1); n >= 0; n--) {
    const d = list[n] as number;
    const f = frameAt(b, d);
    const after = s.slice(d + id.length, d + id.length + 3);
    const before = s.slice(Math.max(0, d - 3), d).trimEnd();
    const named =
      /^\s*(?:[,)}\]]|=(?![=>]))/.test(after) &&
      /(?:[({[,:]|\.\.\.)$/.test(before);
    // Climb out of destructuring brackets: `{a,b:c}` and `[a,b]`.
    let top = f;
    let pattern = -1;
    while (
      named &&
      top >= 0 &&
      "{[".includes(s[b.open[top] as number] as string)
    ) {
      pattern = top;
      top = b.parent[top] as number;
    }
    if (
      named &&
      pattern >= 0 &&
      /^\s*=(?![=>])/.test(
        s.slice(
          (b.close[pattern] as number) + 1,
          (b.close[pattern] as number) + 4,
        ),
      )
    ) {
      // `let{a}=x` or `({a}=x)`: a destructured name.
      if (inside(b, here, top)) return { kind: "opaque" };
      continue;
    }
    if (
      named &&
      top >= 0 &&
      s[b.open[top] as number] === "(" &&
      (pattern >= 0 || before.at(-1) !== ":")
    ) {
      const open = b.open[top] as number;
      const close = b.close[top] as number;
      const head = s.slice(Math.max(0, open - 60), open);
      const rest = s.slice(close + 1, close + 4);
      const arrow = /^\s*=>/.test(rest);
      const block =
        /^\s*\{/.test(rest) &&
        !/(?:^|[^\w$.])(?:if|while|switch|with)\s*$/.test(head);
      if (/(?:^|[^\w$.])for\s*(?:await\s*)?$/.test(head)) {
        if (inside(b, here, top) || inBody(close + 1, b.parent[top] as number))
          return { kind: "opaque" };
        continue;
      }
      if (arrow || block) {
        if (
          !inBody(
            arrow ? s.indexOf("=>", close) + 2 : close + 1,
            b.parent[top] as number,
          )
        )
          continue;
        // A plain parameter of a function or an arrow; not a method, `catch`, or a pattern.
        if (pattern < 0 && (arrow || /function\*?\s*[\w$]*\s*$/.test(head))) {
          const name = calleeBefore(s, open);
          return {
            kind: "param",
            fn: name,
            fnAt: s.lastIndexOf(name ?? "\u0000", open),
            index: splitTop(s.slice(open + 1, d), ",").length - 1,
          };
        }
        return { kind: "opaque" };
      }
    }
    // A single arrow parameter: `a=>`.
    if (/^\s*=>/.test(after) && !/[\w$.]$/.test(before)) {
      if (!inBody(s.indexOf("=>", d + id.length) + 2, f)) continue;
      const name = calleeBefore(s, d);
      return {
        kind: "param",
        fn: name,
        fnAt: s.lastIndexOf(name ?? "\u0000", d),
        index: 0,
      };
    }
    // `for(let x of y)` or `for(let i=0;...)`: a loop variable.
    const loop = f >= 0 ? (b.open[f] as number) : -1;
    if (
      s[loop] === "(" &&
      /(?:^|[^\w$.])for\s*(?:await\s*)?$/.test(
        s.slice(Math.max(0, loop - 12), loop),
      ) &&
      /(?:^|[^\w$.])(?:let|const|var)\s+$/.test(s.slice(Math.max(0, d - 7), d))
    ) {
      if (
        inside(b, here, f) ||
        inBody((b.close[f] as number) + 1, b.parent[f] as number)
      )
        return { kind: "opaque" };
      continue;
    }
    if (
      /^\s*(?:[,;=](?![=>])|$)/.test(after) &&
      inside(b, here, f) &&
      declaredAt(s, b, d, f)
    )
      return { kind: "var", at: d, frame: f };
  }
  return undefined;
};

/** The indexes of each name in the code of `s` (not in strings, comments, or after a `.`), in order. */
export const nameIndex = (s: string, b: Brackets): Map<string, number[]> => {
  const all = new Map<string, number[]>();
  for (const m of s.matchAll(/[\w$]+/g))
    if (s[m.index - 1] !== "." && isCode(b, m.index)) {
      const list = all.get(m[0]) ?? [];
      list.push(m.index);
      all.set(m[0], list);
    }
  return all;
};
