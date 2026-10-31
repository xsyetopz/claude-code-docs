// `release` `explain`: where a name lives in a prepared install (`prepare.ts`), and who calls it, when it runs, and how.
import { cut, lines, NAME, namesOf, parentsOf } from "./diff.ts";
import type { Index, Unit } from "./prepare.ts";

export type How = "no-op" | "stub" | "handled";
export type Explained = {
  holder: Unit;
  /** `unit` when a literal, key, or read names it; `text` when only a search of the code text found it */
  via: "unit" | "text";
  /** other units that hold the name, as `module:offset` */
  others: string[];
  /** the holder's cleaned code, capped */
  what: string[];
  /** units that use the holder's names, as `label module:offset` */
  who: string[];
  when: { gates: string[]; env: string[]; isEnabled?: string };
  /** each function of the holder, with how it behaves */
  how: { label: string; at: number; how: How; value?: string }[];
};

const CONST = String.raw`(?:!0|!1|null|void 0|""|-?\d+(?:\.\d+)?|\[\]|\{\}|"(?:[^"\\]|\\.)*")`;
const HEAD = String.raw`^(?:async )?(?:function\*? ?[\w$]*)?\([^)]*\)`;
const NOOP = [
  // `=>{}` is an empty body, not an object.
  new RegExp(`${HEAD}=>\\{\\}$`),
  new RegExp(`${HEAD}=>\\(?(${CONST})?\\)?$`),
  new RegExp(`${HEAD}(?:=>)?\\{(?:return ?(${CONST}))?;?\\}$`),
];
const GUARD = String.raw`if\([^{}]*\)(?:return ?${CONST}|throw [^;{}]*);?`;
const STUB = new RegExp(
  `${HEAD}(?:=>)?\\{(?:${GUARD})*(?:throw [^;{}]*|return ?(${CONST}));?\\}$`,
);
const SHOW: Record<string, string> = {
  "!0": "true",
  "!1": "false",
  "void 0": "undefined",
};

/** `no-op` returns a constant only; `stub` throws, or returns a constant after checks; `handled` is anything else. */
export const howOf = (t: string): { how: How; value?: string } => {
  for (const re of NOOP) {
    const m = t.match(re);
    if (m) return { how: "no-op", value: SHOW[m[1] ?? "void 0"] ?? m[1] };
  }
  const s = t.match(STUB);
  if (s && (s[1] === undefined || /throw |if\(/.test(t)))
    return { how: "stub", ...(s[1] && { value: SHOW[s[1]] ?? s[1] }) };
  return { how: "handled" };
};

const DECL =
  /(?:^|,|var |let |const |function\*? ?|class )(\$[0-9a-f]{6}(?:_\d+)?)(?=[=({ ])/g;
const isFnLabel = (k: string) => !/^[A-Z]/.test(k);
const ENV_SHAPED = /^[A-Z][A-Z0-9_]{2,}$/;
const quote = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Explains the unit that holds `name` (a string, a command such as `/loops`, or a tool name), or undefined. */
export const explain = (
  ix: Index,
  name: string,
  cap = 40,
): Explained | undefined => {
  const bare = name.replace(/^\//, "");
  const lits = new Set([JSON.stringify(name), JSON.stringify(bare)]);
  // A flag literal carries its dashes and may carry a placeholder, such as "--name <value>".
  const flag = `"--${name.replace(/^-{1,2}/, "")}`;
  const isFlag = (x: string) =>
    x === `${flag}"` || x.startsWith(`${flag} `) || x.startsWith(`${flag}=`);
  // An env-shaped name is also an identifier key (`NAME:`) or a member read (`i.NAME`).
  const envShaped = ENV_SHAPED.test(name);
  const member = `.${name}`;
  const read = new RegExp(`\\.${quote(name)}(?![\\w$])`);
  const reads = (u: Unit) => envShaped && read.test(u.t);
  const names = namesOf(ix);
  // Names whose value is the string, such as a tool's `name:$a1b2c3`.
  const refs = new Set([...names.holding(name), ...names.holding(bare)]);
  const refers = (u: Unit) =>
    refs.size > 0 &&
    [...u.t.matchAll(NAME)].some(([h]) => refs.has(`${u.m}|${h}`));
  const named = (u: Unit) =>
    [...lits].some((l) => u.t.includes(`name:${l}`)) ||
    [...u.t.matchAll(/name:(\$[0-9a-f]{6}(?:_\d+)?)/g)].some(([, h]) =>
      refs.has(`${u.m}|${h}`),
    );
  // A unit that reads the name outranks one that only lists it, such as an env pass-through set.
  const unitHits = ix.units
    .filter(
      (u) =>
        u.f.some(
          (x) => lits.has(x) || isFlag(x) || (envShaped && x === member),
        ) || refers(u),
    )
    .map((u) => ({
      u,
      score: (reads(u) ? 4 : 0) + (named(u) ? 2 : 0) + (u.f.length > 3 ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || b.u.f.length - a.u.f.length);
  const word = new RegExp(`(?<![\\w$-])${quote(name)}(?![\\w$-])`);
  const via = unitHits.length ? "unit" : "text";
  const hits = unitHits.length
    ? unitHits
    : ix.units.filter((u) => word.test(u.t)).map((u) => ({ u }));
  const holder = hits[0]?.u;
  if (!holder) return undefined;
  const mod = ix.units.filter((u) => u.m === holder.m);
  const parent = parentsOf(mod);
  const at = mod.indexOf(holder);
  const inside = mod.filter(
    (u) => u !== holder && u.s >= holder.s && u.e <= holder.e,
  );
  const direct = mod.filter((_, i) => parent[i] === at);
  const own = [holder, ...inside];
  const small = own.flatMap((u) =>
    [...u.t.matchAll(NAME)].flatMap(([h]) => {
      const f = names.fn(u.m, h);
      return f && f.f.length <= 3 ? [f] : [];
    }),
  );
  const strings = new Set(
    [...own, ...small].flatMap((u) => u.f.filter((x) => x.startsWith('"'))),
  );
  const gates = [...strings].filter((x) => x.startsWith('"tengu_'));
  const env = [
    ...new Set(
      [...own, ...small]
        .filter((u) => u.f.includes(".env"))
        .flatMap((u) =>
          u.f
            .filter((x) => /^\.[A-Z][A-Z0-9_]{2,}$/.test(x))
            .map((x) => x.slice(1)),
        ),
    ),
  ];
  const enabled = direct.find((u) => u.k === "isEnabled");
  const declared = [...holder.t.matchAll(DECL)].map(([, h]) => h as string);
  const users = declared.flatMap((h) => names.aliases(`${holder.m}|${h}`));
  const who = [
    ...new Set(
      users.flatMap((k) => {
        const [m, h] = k.split("|") as [string, string];
        const re = new RegExp(`${h.replace("$", "\\$")}(?![\\w])`);
        return ix.units
          .filter(
            (u) =>
              u.m === m &&
              u.k !== "ImportDeclaration" &&
              !u.t.startsWith("export{") &&
              !(u.m === holder.m && u.s >= holder.s && u.e <= holder.e) &&
              re.test(u.t),
          )
          .map((u) => `${u.k} ${u.m}:${u.s}`);
      }),
    ),
  ];
  const all = lines(holder.t).map(cut);
  return {
    holder,
    via,
    others: hits.slice(1, 6).map(({ u }) => `${u.m}:${u.s}`),
    what:
      all.length > cap
        ? [...all.slice(0, cap), `… ${all.length - cap} more lines`]
        : all,
    who,
    when: {
      gates,
      env,
      ...(enabled && { isEnabled: enabled.t }),
    },
    how: (isFnLabel(holder.k) ? [holder, ...direct] : direct)
      .filter((u) => isFnLabel(u.k))
      .map((u) => ({ label: u.k, at: u.s, ...howOf(u.t) })),
  };
};
