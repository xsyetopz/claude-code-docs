// Display of a diff: the changed lines of a unit, and the filter by name.
import type { Change, Diff } from "./diff.ts";

// For matching, names carry no meaning: a local's number moves when an outer scope gains a name, and a module-level or
// chunk name moves when its declaration changes. Literals, property names, and the code's shape stay.
export const norm = (t: string) =>
  t
    .replace(/\$[0-9a-f]{6}(?:_\d+)?/g, "$")
    .replace(/chunk@[0-9a-f]{8}\.js/g, "chunk@")
    .replace(/\.\.\./g, "…")
    .replace(/(?<![.\w$])([a-z])\d+\b/g, "$1");

/** Display lines of a unit's one-line cleaned text. */
export const lines = (t: string) =>
  t
    .replace(/([;{}])/g, "$1\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const LINE_CHARS = 200;
export const cut = (l: string) =>
  l.length > LINE_CHARS ? `${l.slice(0, LINE_CHARS)}…` : l;

/** The changed lines, by longest common subsequence of lines with names ignored, with one line of context, capped. */
export const unitDiff = (c: Change, cap = 40): string[] => {
  const x = c.from ? lines(c.from.t) : [];
  const y = c.to ? lines(c.to.t) : [];
  const nx = x.map(norm);
  const ny = y.map(norm);
  const w = ny.length + 1;
  const ops: [string, string][] = [];
  if (nx.length * ny.length > 4e6) {
    for (const l of x) ops.push(["-", l]);
    for (const l of y) ops.push(["+", l]);
  } else {
    const dp = new Uint32Array((nx.length + 1) * w);
    for (let i = nx.length - 1; i >= 0; i--)
      for (let j = ny.length - 1; j >= 0; j--)
        dp[i * w + j] =
          nx[i] === ny[j]
            ? (dp[(i + 1) * w + j + 1] as number) + 1
            : Math.max(
                dp[(i + 1) * w + j] as number,
                dp[i * w + j + 1] as number,
              );
    let i = 0;
    let j = 0;
    while (i < nx.length || j < ny.length) {
      if (i < nx.length && j < ny.length && nx[i] === ny[j]) {
        ops.push([" ", y[j++] as string]);
        i++;
      } else if (
        j >= ny.length ||
        (i < nx.length &&
          (dp[(i + 1) * w + j] as number) >= (dp[i * w + j + 1] as number))
      )
        ops.push(["-", x[i++] as string]);
      else ops.push(["+", y[j++] as string]);
    }
  }
  const near = (k: number) =>
    [k - 1, k, k + 1].some((t) => (ops[t]?.[0] ?? " ") !== " ");
  const out: string[] = [];
  let gap = false;
  ops.forEach(([op, l], k) => {
    if (!near(k)) {
      gap = out.length > 0;
      return;
    }
    if (gap) out.push("  …");
    gap = false;
    out.push(`${op} ${cut(l)}`);
  });
  return out.length > cap
    ? [...out.slice(0, cap), `… ${out.length - cap} more lines`]
    : out;
};

/** Keeps the changes whose code, fingerprint, calls, or enclosing names and literals hold `name`. */
export const filterChanges = (d: Diff, name: string): Change[] =>
  d.changes.filter(
    (c) =>
      [c.from, c.to].some(
        (u) => u && (u.t.includes(name) || u.f.some((x) => x.includes(name))),
      ) || [...c.calls, ...c.within].some((x) => x.includes(name)),
  );
