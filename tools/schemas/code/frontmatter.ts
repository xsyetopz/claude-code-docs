// Surface 4: the frontmatter of skills, subagents, and output styles, from the program's zod objects.
import type { Entry } from "../../../inspect/mcp/src/resolve.ts";
import {
  esc,
  fnAround,
  header,
  idx,
  type Json,
  mods,
  note,
  only,
  props,
  R,
  type Src,
  VERSION,
} from "./ctx.ts";

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
  return { parent: m[1], fields: R.objectAt(src, at), at };
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

export const buildFrontmatter = (): { file: string; schema: Json } => {
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
  // The loader: the named function around the anchor whose first of two or more parameters is a name.
  const lf = fnAround(
    src,
    loaderAt,
    (f) =>
      f.type !== "ArrowFunctionExpression" &&
      f.params.length > 1 &&
      f.params[0]?.type === "Identifier",
  );
  const lp = lf?.params[0];
  if (lf && lp?.type === "Identifier") {
    const reads = readKeys(src.src(lf), lp.name);
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
  const allowRe =
    /var [\w$]+=\["name","description","model","allowed-tools"[^\]]*\]/;
  const allow = mods.map((m) => allowRe.exec(m.text)).find((x) => x !== null);
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
