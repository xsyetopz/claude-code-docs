import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { normalizeHost, numberUuids } from "../normalize.ts";
import { SUB_MARK, VARIANTS, type Variant } from "../variants.ts";
import { CAPTURES, ctx, OUT } from "./ctx.ts";
import type { ApiBlock, Cap, Part, Tool } from "./types.ts";

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizer = (meta: { cwd: string; cfg: string; home: string }) => {
  const slug = (p: string) => p.replace(/[^a-zA-Z0-9]/g, "-");
  const pairs: [RegExp, string][] = [];
  for (const [p, ph] of [
    [meta.cwd, "<project-slug>"],
    [meta.cfg, "<config-slug>"],
  ] as const) {
    pairs.push([new RegExp(esc(slug(p)), "g"), ph]);
    pairs.push([new RegExp(esc(slug(p.replace(/^\/private/, ""))), "g"), ph]);
  }
  for (const [p, ph] of [
    [meta.cwd, "<cwd>"],
    [meta.cfg, "<config-dir>"],
    [meta.home, "<home>"],
  ] as const) {
    for (const q of [p, p.replace(/^\/private/, "")])
      pairs.push([new RegExp(esc(q), "g"), ph]);
  }
  const ids = numberUuids();
  return (s: string) => {
    let t = s;
    for (const [re, r] of pairs) t = t.replace(re, r);
    return ids(normalizeHost(t))
      .replace(/\d{4}-\d\d-\d\d/g, "<date>")
      .replace(/\b[0-9a-f]{7,40}\b(?= initial)/g, "<sha>")
      .replace(/\u{1F916}/gu, "<robot-emoji>")
      .replace(/\/plans\/[a-z]+(-[a-z]+)*\.md/g, "/plans/<plan-name>.md");
  };
};

const blocks = (content: unknown): string[] => {
  if (typeof content === "string") return [content];
  return (content as ApiBlock[]).map((c) =>
    c.type === "text"
      ? c.text
      : `[${c.type}] ${JSON.stringify(c.input ?? c.content ?? c).slice(0, 400)}`,
  );
};

export const load = (v: Variant): Cap => {
  const dir = join(CAPTURES, v.id);
  const meta = JSON.parse(readFileSync(join(dir, "meta.json"), "utf8"));
  const n = normalizer(meta);
  const reqs = readFileSync(join(dir, "requests.jsonl"), "utf8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l))
    .filter((r) => r.path?.startsWith("/v1/messages") && r.body?.messages);
  let r = reqs[0];
  if (v.pick === "last") r = reqs[reqs.length - 1];
  if (v.pick === "subagent")
    r = reqs.find((q) => {
      const j = JSON.stringify(q.body.messages);
      return j.includes(SUB_MARK) && !j.includes("tool_result");
    });
  if (v.pick === "marker")
    r = reqs.find(
      (q, i) =>
        i > 0 &&
        JSON.stringify([q.body.system, q.body.messages]).includes(
          v.marker ?? "",
        ),
    );
  if (!r)
    return {
      v,
      text: "",
      parts: [],
      chars: 0,
      tools: [],
      sections: [],
      model: "",
      ok: false,
    };
  const b = r.body;
  const parts: Part[] = [];
  const sys: { text: string; cache_control?: unknown }[] =
    typeof b.system === "string" ? [{ text: b.system }] : (b.system ?? []);
  for (const [i, s] of sys.entries()) {
    parts.push({
      label: `system[${i}] (${s.cache_control ? `cache marker: ${JSON.stringify(s.cache_control)}` : "no cache marker"})`,
      text: n(s.text),
    });
  }
  for (const [i, m] of (
    b.messages as { role: string; content: unknown }[]
  ).entries()) {
    for (const [j, t] of blocks(m.content).entries()) {
      parts.push({
        label: `messages[${i}].content[${j}] (role: ${m.role})`,
        text: n(t),
      });
    }
  }
  const text = parts
    .map((p) => `=== ${p.label} ===\n${p.text.replace(/\s+$/, "")}\n`)
    .join("\n");
  const tools: Tool[] = (b.tools ?? []).map(
    (t: { name: string; description?: string; input_schema?: unknown }) => ({
      name: t.name,
      desc: (t.description ?? "").length,
      schema: JSON.stringify(t.input_schema ?? {}).length,
      text: n(t.description ?? ""),
      schemaText: JSON.stringify(t.input_schema ?? {}, null, 2),
    }),
  );
  const sections = [
    ...new Set(
      sys.flatMap((s) =>
        [...n(s.text).matchAll(/^# (.+)$/gm)].map((m) => m[1]),
      ),
    ),
  ];
  return {
    v,
    text,
    parts,
    chars: text.length,
    tools,
    sections,
    model: b.model,
    ok: true,
  };
};

export const loadCaps = () => {
  for (const v of VARIANTS) {
    if (!existsSync(join(CAPTURES, v.id, "meta.json"))) {
      console.log(`skip ${v.id}: not captured`);
      continue;
    }
    const c = load(v);
    if (!c.ok) {
      console.log(`skip ${v.id}: no matching request`);
      continue;
    }
    ctx.caps.set(v.id, c);
    writeFileSync(join(OUT, `${v.id}.txt`), c.text);
  }
};

export const findDups = () => {
  const seen = new Map<string, string>();
  for (const [id, c] of ctx.caps) {
    const h = Bun.hash(c.text + JSON.stringify(c.tools)).toString();
    const first = seen.get(h);
    if (first !== undefined) ctx.dupOf.set(id, first);
    else seen.set(h, id);
  }
};
