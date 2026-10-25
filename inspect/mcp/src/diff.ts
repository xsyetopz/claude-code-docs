// Diffs two prepared installs (`prepare.ts`) by code unit, so a release shows as the few functions it changed.

import { norm } from "./diff/render.ts";
import type { Index, Unit } from "./prepare.ts";

export type Change = {
  kind: "changed" | "added" | "gone";
  from?: Unit;
  to?: Unit;
  /** the string constants it names and the small functions it calls (3 literals or fewer), with their strings, such as `$1a2b3c "tengu_x"` */
  calls: string[];
  /** the `name` of the nearest enclosing object that has one */
  subject?: string | undefined;
  /** what encloses it: the string constants its enclosing code names, then the literals of the nearest unit with some */
  within: string[];
};
const SMALL = 3;
const callsOf = (s: Side, u: Unit | undefined): string[] => {
  const out = new Set<string>();
  for (const [h] of u?.t.matchAll(NAME) ?? []) {
    const v = s.names.constant((u as Unit).m, h);
    if (v !== undefined) out.add(`${h} ${JSON.stringify(v)}`);
    const f = s.names.fn((u as Unit).m, h);
    const lits = f?.f.filter((x) => x.startsWith('"')) ?? [];
    if (lits.length && lits.length <= SMALL) out.add(`${h} ${lits.join(" ")}`);
  }
  return [...out];
};

export type Diff = {
  counts: { changed: number; added: number; gone: number };
  changes: Change[];
};

/** The enclosing unit of each unit. Units come in source order, a parent before its children. */
export const parentsOf = (us: Unit[]) => {
  const p = new Int32Array(us.length).fill(-1);
  const stack: number[] = [];
  us.forEach((u, i) => {
    for (;;) {
      const top = us[stack.at(-1) ?? -1];
      if (!top || (top.m === u.m && top.s <= u.s && u.e <= top.e)) break;
      stack.pop();
    }
    p[i] = stack.at(-1) ?? -1;
    stack.push(i);
  });
  return p;
};

export const NAME = /\$[0-9a-f]{6}(?:_\d+)?/g;

/** What a module-level name holds, a string or a function, followed through one import and export across chunks. */
export const namesOf = (ix: Index) => {
  const val = new Map<string, string>();
  const fn = new Map<string, Unit>();
  const exp = new Map<string, string>();
  const imp = new Map<string, string>();
  for (const u of ix.units) {
    if (u.k === "VariableDeclaration")
      for (const x of u.t.matchAll(
        /(\$[0-9a-f]{6}(?:_\d+)?)="((?:[^"\\]|\\.)*)"/g,
      ))
        val.set(`${u.m}|${x[1]}`, x[2] as string);
    else if (u.k === "function") {
      const h = u.t.match(
        /^(?:async )?function\*? ?(\$[0-9a-f]{6}(?:_\d+)?)\(/,
      )?.[1];
      if (h) fn.set(`${u.m}|${h}`, u);
    } else if (u.k === "ExportNamedDeclaration" && !u.t.includes("from"))
      for (const x of u.t.matchAll(/(\$[0-9a-f]{6}(?:_\d+)?) as ([\w$]+)/g))
        exp.set(`${ix.chunks[u.m] ?? u.m}|${x[2]}`, `${u.m}|${x[1]}`);
    else if (u.k === "ImportDeclaration") {
      const from = u.t.match(/from"\/\$bunfs\/root\/([^"]+)"/)?.[1];
      if (from)
        for (const x of u.t.matchAll(/([\w$]+) as (\$[0-9a-f]{6}(?:_\d+)?)/g))
          imp.set(`${u.m}|${x[2]}`, `${from}|${x[1]}`);
    }
  }
  const key = (m: string, h: string) => {
    const k = `${m}|${h}`;
    return val.has(k) || fn.has(k) ? k : (exp.get(imp.get(k) ?? "") ?? "");
  };
  const multi = <K, V>(pairs: Iterable<[K, V]>) => {
    const r = new Map<K, V[]>();
    for (const [k, v] of pairs) r.get(k)?.push(v) ?? r.set(k, [v]);
    return r;
  };
  const exported = multi([...exp].map(([x, k]) => [k, x]));
  const imported = multi([...imp].map(([k, x]) => [x, k]));
  const byValue = multi([...val].map(([k, v]) => [v, k]));
  /** `module|name` and the `module|local` names that import it. */
  const aliases = (k: string) => [
    k,
    ...(exported.get(k) ?? []).flatMap((x) => imported.get(x) ?? []),
  ];
  return {
    constant: (m: string, h: string) => val.get(key(m, h)),
    fn: (m: string, h: string) => fn.get(key(m, h)),
    aliases,
    /** the module-level names that hold the string `v`, with their aliases */
    holding: (v: string) => (byValue.get(v) ?? []).flatMap(aliases),
  };
};

type Side = {
  us: Unit[];
  parent: Int32Array;
  free: boolean[];
  /** the paired unit on the other side, or -1 */
  match: Int32Array;
  names: ReturnType<typeof namesOf>;
};
// Imports and exports are left out: chunk splitting moves them in every build.
const glue = /^(Import|Export(Named|All))Declaration$/;
const side = (ix: Index): Side => {
  const us = ix.units.filter((u) => !glue.test(u.k));
  return {
    us,
    parent: parentsOf(us),
    free: us.map(() => true),
    match: new Int32Array(us.length).fill(-1),
    names: namesOf(ix),
  };
};

const fkey = (u: Unit) => `${u.k}|${u.f.join("\n")}`;
const pkey = (s: Side, i: number) => {
  const p = s.parent[i] as number;
  return p < 0 ? undefined : `${s.us[i]?.k}<${fkey(s.us[p] as Unit)}`;
};

/** Pairs free units with an equal key, in source order. */
const pair = (
  a: Side,
  b: Side,
  key: (s: Side, i: number) => string | undefined,
  hit: (i: number, j: number) => void,
) => {
  const open = new Map<string, number[]>();
  a.us.forEach((_, i) => {
    const k = a.free[i] && key(a, i);
    if (k !== undefined && k !== false) {
      const l = open.get(k);
      l ? l.push(i) : open.set(k, [i]);
    }
  });
  b.us.forEach((_, j) => {
    const k = b.free[j] && key(b, j);
    if (k === undefined || k === false) return;
    const i = open.get(k)?.shift();
    if (i === undefined) return;
    a.free[i] = b.free[j] = false;
    a.match[i] = j;
    b.match[j] = i;
    hit(i, j);
  });
};

/** The `name` of the nearest enclosing object that has one, such as a tool's or a command's. */
const subjectOf = (s: Side, i: number): string | undefined => {
  for (let p = s.parent[i] as number; p >= 0; p = s.parent[p] as number) {
    const u = s.us[p] as Unit;
    const m = u.t.match(/name:(?:"([^"]*)"|(\$[0-9a-f]{6}(?:_\d+)?))/);
    if (m) return m[1] ?? s.names.constant(u.m, m[2] as string);
  }
  return undefined;
};

const withinOf = (s: Side, i: number): string[] => {
  const names = new Set<string>();
  let lits: string[] = [];
  for (let p = s.parent[i] as number; p >= 0; p = s.parent[p] as number) {
    const u = s.us[p] as Unit;
    for (const [h] of u.t.matchAll(NAME)) {
      const v = s.names.constant(u.m, h);
      if (v) names.add(JSON.stringify(v));
    }
    if (!lits.length) lits = u.f.filter((x) => x.startsWith('"'));
  }
  return [...names, ...lits];
};

/** Matches units by text, then fingerprint, then label and parent, then literal overlap (0.6 or more). */
export const diffIndexes = (from: Index, to: Index): Diff => {
  const a = side(from);
  const b = side(to);
  const changes: Change[] = [];
  // A pair with equal text (names aside) is unchanged, whichever stage paired it.
  const changed = (i: number, j: number) => {
    const [x, y] = [a.us[i] as Unit, b.us[j] as Unit];
    if (norm(x.t) !== norm(y.t))
      changes.push({
        kind: "changed",
        from: x,
        to: y,
        calls: [...callsOf(a, x), ...callsOf(b, y)],
        within: withinOf(b, j),
        subject: subjectOf(b, j),
      });
  };
  pair(
    a,
    b,
    // A method's text leaves out its name, so the label is in the key. Text with no literals, such as
    // `(){return x()}`, is common, so it also needs the same parent.
    (s, i) => {
      const u = s.us[i] as Unit;
      const p = s.parent[i] as number;
      const t = `${u.k}|${norm(u.t)}`;
      return u.f.length || p < 0 ? t : `${t}<${fkey(s.us[p] as Unit)}`;
    },
    () => {},
  );
  pair(
    a,
    b,
    (s, i) => ((s.us[i] as Unit).f.length ? fkey(s.us[i] as Unit) : undefined),
    changed,
  );
  pair(a, b, pkey, changed);
  // A unit with no literals, such as `isEnabled(){return x()}`, pairs by its label under a paired parent.
  const underPair = () => {
    let n = 0;
    pair(
      a,
      b,
      (s, i) => {
        const p = s.parent[i] as number;
        const q = p < 0 ? -1 : s === a ? p : (b.match[p] as number);
        return q < 0 ? undefined : `${s.us[i]?.k}<${q}`;
      },
      (i, j) => {
        n++;
        changed(i, j);
      },
    );
    return n;
  };
  while (underPair());
  // Literal overlap, through the literals that few units share.
  const post = new Map<string, number[]>();
  a.us.forEach((u, i) => {
    if (a.free[i])
      for (const x of u.f) post.get(x)?.push(i) ?? post.set(x, [i]);
  });
  b.us.forEach((u, j) => {
    if (!b.free[j] || !u.f.length) return;
    const hits = new Map<number, number>();
    for (const x of u.f) {
      const l = post.get(x);
      if (l && l.length <= 50)
        for (const i of l) if (a.free[i]) hits.set(i, (hits.get(i) ?? 0) + 1);
    }
    let best = -1;
    let score = 0.6;
    for (const [i, n] of hits) {
      const r = n / Math.max(u.f.length, (a.us[i] as Unit).f.length);
      if (r >= score) [best, score] = [i, r];
    }
    if (best < 0) return;
    a.free[best] = b.free[j] = false;
    a.match[best] = j;
    b.match[j] = best;
    changed(best, j);
  });
  while (underPair());
  b.us.forEach((u, j) => {
    if (b.free[j])
      changes.push({
        kind: "added",
        to: u,
        calls: callsOf(b, u),
        within: withinOf(b, j),
        subject: subjectOf(b, j),
      });
  });
  a.us.forEach((u, i) => {
    if (a.free[i])
      changes.push({
        kind: "gone",
        from: u,
        calls: callsOf(a, u),
        within: withinOf(a, i),
        subject: subjectOf(a, i),
      });
  });
  const count = (k: Change["kind"]) =>
    changes.filter((c) => c.kind === k).length;
  return {
    counts: {
      changed: count("changed"),
      added: count("added"),
      gone: count("gone"),
    },
    changes,
  };
};

export { cut, filterChanges, lines, unitDiff } from "./diff/render.ts";
