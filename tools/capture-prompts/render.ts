// Reads captures/<version>/prompts/* (or CAPTURE_OUT), normalizes machine-specific values, and writes
//   tools/capture-prompts/out/<id>.txt        normalized prompt text
//   docs/prompts/*.md                         the pages
// Run by capture.ts, or alone: bun tools/capture-prompts/render.ts
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { CLAUDE_CODE_VERSION } from "../../src/version.ts";
import { normalizeHost } from "./normalize.ts";
import { BADGE_NOTES, INDEX_FACTS, NOTES } from "./notes.ts";
import { SUB_MARK, VARIANTS, type Variant } from "./variants.ts";

const ROOT = join(import.meta.dir, "..", "..");
const CAPTURES =
  process.env["CAPTURE_OUT"] ??
  join(ROOT, "captures", CLAUDE_CODE_VERSION, "prompts");
const OUT = join(import.meta.dir, "out");
const DOCS = join(ROOT, "docs", "prompts");
mkdirSync(OUT, { recursive: true });
mkdirSync(DOCS, { recursive: true });

type ApiBlock = {
  type: string;
  text: string;
  input?: unknown;
  content?: unknown;
};
type Part = { label: string; text: string };
type Tool = { name: string; desc: number; schema: number };
type Cap = {
  v: Variant;
  text: string;
  parts: Part[];
  chars: number;
  tools: Tool[];
  sections: string[];
  model: string;
  ok: boolean;
};

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
  return (s: string) => {
    let t = s;
    for (const [re, r] of pairs) t = t.replace(re, r);
    return normalizeHost(t)
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

const load = (v: Variant): Cap => {
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

const udiff = (a: string, b: string, la: string, lb: string): string => {
  const fa = join(OUT, ".a.tmp"),
    fb = join(OUT, ".b.tmp");
  writeFileSync(fa, a);
  writeFileSync(fb, b);
  const r = Bun.spawnSync(["diff", "-u", "--label", la, "--label", lb, fa, fb]);
  rmSync(fa);
  rmSync(fb);
  return r.stdout.toString();
};

const fence = (body: string, lang: string) => {
  const longest = Math.max(
    2,
    ...[...body.matchAll(/`+/g)].map((m) => m[0].length),
  );
  const f = "`".repeat(longest + 1);
  return `${f}${lang}\n${body.replace(/\s+$/, "")}\n${f}`;
};
const fmt = (n: number) => n.toLocaleString("en-US");
const badge = (v: Variant) => {
  const n = BADGE_NOTES[v.id] ?? v.gatedNote;
  return v.status === "Gated" || v.status === "Differs"
    ? `<${v.status} note="${(n ?? "").replace(/"/g, "&quot;")}" />`
    : `<${v.status} />`;
};
const yaml = (s: string) => JSON.stringify(s);

// join text lines: blank line between paragraphs, none inside lists, tables, and code fences
const para = (lines: string[]): string[] => {
  const out: string[] = [];
  let fenced = false;
  const kind = (l: string) =>
    l.startsWith("|")
      ? "t"
      : /^(- |\d+\. )/.test(l)
        ? "l"
        : l.startsWith("```")
          ? "f"
          : l === ""
            ? "b"
            : "p";
  let prev = "b";
  for (const l of lines) {
    const k = kind(l);
    if (fenced) {
      out.push(l);
      if (k === "f") {
        fenced = false;
        out.push("");
        prev = "b";
      }
      continue;
    }
    if (k === "f") {
      if (prev !== "b") out.push("");
      out.push(l);
      fenced = true;
      continue;
    }
    if (k === "b") {
      out.push(l);
      prev = "b";
      continue;
    }
    if (prev !== "b" && !(prev === k && k !== "p")) out.push("");
    out.push(l);
    prev = k;
  }
  return out;
};

const toolDiff = (a: Tool[], b: Tool[]): string => {
  const an = new Map(a.map((t) => [t.name, t])),
    bn = new Map(b.map((t) => [t.name, t]));
  const rem = a.filter((t) => !bn.has(t.name)).map((t) => t.name),
    add = b.filter((t) => !an.has(t.name)).map((t) => t.name);
  const chg = b
    .filter((t) => {
      const old = an.get(t.name);
      return (
        old !== undefined && (old.desc !== t.desc || old.schema !== t.schema)
      );
    })
    .map((t) => t.name);
  const out: string[] = [];
  if (add.length) out.push(`adds ${add.map((x) => `\`${x}\``).join(", ")}.`);
  if (rem.length) out.push(`removes ${rem.map((x) => `\`${x}\``).join(", ")}.`);
  if (chg.length)
    out.push(
      `changes the text or schema of ${chg.map((x) => `\`${x}\``).join(", ")}.`,
    );
  return out.join(" ");
};

const caps = new Map<string, Cap>();
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
  caps.set(v.id, c);
  writeFileSync(join(OUT, `${v.id}.txt`), c.text);
}

// Hand-written pages carry `generated: false` in their front matter. The
// generator never deletes them. Their optional `index` block adds rows to index.md.
type IndexRow = {
  after?: string;
  change: string;
  toggle: string;
  where: string;
  status: string;
  select?: string;
  chars?: number;
  tools?: number;
  sections?: string;
};
type HandPage = { id: string; title: string; row?: IndexRow | undefined };
type FrontMatter = { title?: string; generated?: boolean; index?: IndexRow };
const frontMatter = (file: string): FrontMatter => {
  const raw = readFileSync(file, "utf8")
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n");
  const m = /^---\n([\s\S]*?)\n---\n/.exec(raw);
  return m?.[1] ? (Bun.YAML.parse(m[1]) as FrontMatter) : {};
};
const hand: HandPage[] = [];
for (const f of readdirSync(DOCS).sort()) {
  if (!f.endsWith(".md")) continue;
  const fm = frontMatter(join(DOCS, f));
  if (fm.generated === false) {
    const id = f.replace(/\.md$/, "");
    if (VARIANTS.some((v) => v.id === id))
      throw new Error(
        `docs/prompts/${f} is hand-written (generated: false) but its name collides with variant id "${id}".`,
      );
    hand.push({
      id,
      title: String(fm.title),
      row: fm.index,
    });
  } else rmSync(join(DOCS, f));
}
// hand-written rows go after the generated row named in `after`, else at the end
const handRows = (afterId?: string) =>
  hand.filter(
    (h) =>
      h.row &&
      (afterId === undefined
        ? !h.row.after || !caps.has(h.row.after)
        : h.row.after === afterId),
  );
const handGlance = (h: HandPage) =>
  `| ${handLink(h)} | ${h.row?.change} | ${h.row?.toggle} | ${h.row?.where} | <${h.row?.status} /> |`;
const handLink = (h: HandPage) => `[${h.title}](./${h.id}.md)`;
const stripTrailing = (s: string) => s.replace(/[ \t]+$/gm, "");

// duplicates: same normalized text as an earlier variant
const seen = new Map<string, string>();
const dupOf = new Map<string, string>();
for (const [id, c] of caps) {
  const h = Bun.hash(c.text + JSON.stringify(c.tools)).toString();
  const first = seen.get(h);
  if (first !== undefined) dupOf.set(id, first);
  else seen.set(h, id);
}

let pos = 2;
const pageOrder: string[] = [];
for (const [id, c] of caps) {
  const v = c.v;
  const base = v.baseline ? caps.get(v.baseline) : undefined;
  const dup = dupOf.get(id);
  const lines: string[] = [];
  lines.push(
    "---",
    `title: ${yaml(v.title)}`,
    `description: ${yaml(v.summary.replace(/`/g, ""))}`,
    `sidebar_position: ${pos++}`,
    "---",
    "",
  );
  pageOrder.push(id);
  lines.push(`${v.summary} ${v.how}`, "");
  const sysChars = c.parts
    .filter((p) => p.label.startsWith("system["))
    .reduce((s, p) => s + p.text.length, 0);
  lines.push("## Size", "", "| Part | Characters |", "| --- | --- |");
  for (const p of c.parts) {
    lines.push(
      `| \`${p.label.replace(/ \(.*/, "")}\` | ${fmt(p.text.length)} |`,
    );
  }
  lines.push(
    `| System blocks only | ${fmt(sysChars)} |`,
    `| Everything shown here | ${fmt(c.chars)} |`,
    `| Tools sent | ${c.tools.length} |`,
    "",
  );
  lines.push(
    "Sizes count the text after the placeholders are in place. Each placeholder counts at its own length.",
    "",
  );
  const notes = NOTES[id];
  if (notes?.length) {
    lines.push("## What to Notice", "", ...notes.map((x) => `- ${x}`), "");
  }
  if (dup) {
    lines.push(
      "## Full Text",
      "",
      `This variant sends exactly the same text and tools as [${caps.get(dup)?.v.title ?? dup}](./${dup}.md). The page for that variant has the full text.`,
      "",
    );
  } else {
    lines.push(
      "## Full Text",
      "",
      "The text below is every part of the request that Claude Code builds before your own message, in the order it is sent.",
      "",
      fence(c.text, "text"),
      "",
    );
  }
  if (base && base.v.id !== id) {
    const d = udiff(base.text, c.text, base.v.id, id);
    lines.push(
      "## Compared to the Default",
      "",
      `The diff below starts from [${base.v.title}](./${base.v.id}.md). Lines that start with \`-\` are only in the baseline. Lines that start with \`+\` are only here.`,
      "",
    );
    if (!d) lines.push("There are no differences in the text.", "");
    else {
      const add = d
          .split("\n")
          .filter((l) => l.startsWith("+") && !l.startsWith("+++")).length,
        del = d
          .split("\n")
          .filter((l) => l.startsWith("-") && !l.startsWith("---")).length;
      lines.push(
        `Lines added: ${add}. Lines removed: ${del}. Size change: ${c.chars - base.chars >= 0 ? "+" : ""}${fmt(c.chars - base.chars)} characters.`,
        "",
        fence(d, "diff"),
        "",
      );
    }
    const td = toolDiff(base.tools, c.tools);
    lines.push(
      td
        ? `Tool list: ${td} See [Tools per Variant](./tools-per-variant.md).`
        : "The tool list is the same as the baseline.",
      "",
    );
  } else {
    lines.push(
      "## Compared to the Default",
      "",
      "This variant is the baseline. Other pages diff against it.",
      "",
    );
  }
  writeFileSync(join(DOCS, `${id}.md`), stripTrailing(lines.join("\n")));
}

// tools-per-variant
{
  const def = caps.get("default-lean");
  if (!def) throw new Error("missing default-lean capture");
  const L: string[] = [
    "---",
    `title: "Tools per Variant"`,
    `description: "Which tools each system prompt variant sends, and how the tool text differs."`,
    `sidebar_position: ${pos++}`,
    "---",
    "",
    "Tools are part of what the model reads. Each request carries a list of tools, and each tool has a name, a description, and a schema. This page compares the lists across variants.",
    "",
    "## Default Tool List",
    "",
    `The default list has ${def.tools.length} tools on Opus 5.5. The columns show the length of the description and of the JSON schema, in characters.`,
    "",
    "| Tool | Description | Schema |",
    "| --- | --- | --- |",
    ...def.tools.map(
      (t) => `| \`${t.name}\` | ${fmt(t.desc)} | ${fmt(t.schema)} |`,
    ),
    "",
    "## Differences by Variant",
    "",
    "Each row compares one variant to the default list. Variants with the same tools and text as the default are grouped at the end.",
    "",
    "| Variant | Tools | Difference |",
    "| --- | --- | --- |",
  ];
  const same: string[] = [];
  for (const [id, c] of caps) {
    if (id === "default-lean") continue;
    const d = toolDiff(def.tools, c.tools);
    if (!d) same.push(`[${c.v.title}](./${id}.md)`);
    else L.push(`| [${c.v.title}](./${id}.md) | ${c.tools.length} | ${d} |`);
  }
  L.push("", "## Same Tools as the Default", "", `${same.join(", ")}.`, "");
  const bare = caps.get("bare");
  if (bare)
    L.push(
      "## Bare Mode Tools",
      "",
      "| Tool | Description | Schema |",
      "| --- | --- | --- |",
      ...bare.tools.map(
        (t) => `| \`${t.name}\` | ${fmt(t.desc)} | ${fmt(t.schema)} |`,
      ),
      "",
    );
  writeFileSync(
    join(DOCS, "tools-per-variant.md"),
    stripTrailing(L.join("\n")),
  );
}

// index
{
  const L: string[] = [
    "---",
    `title: "Captured System Prompts"`,
    `description: "Every system prompt variant you can pick in Claude Code 2.1.306, captured offline and compared."`,
    `sidebar_position: 1`,
    "---",
    "",
    ...para(INDEX_FACTS.intro),
    "",
    "## At a Glance",
    "",
    'You can use every prompt here: the answer to "Can you use it?" is ✅ Yes for all of them. Where a page adds a condition, it is in parentheses after the name.',
    "",
    "| Prompt | Can You Change It? | Turn On or Off | Where It Lives | Status |",
    "| --- | --- | --- | --- | --- |",
    ...[...caps].flatMap(([id, c]) => {
      const u = c.v.can.use.replace(/^✅? ?Yes\.?\s*/, "").replace(/\.$/, "");
      const name = `[${c.v.title}](./${id}.md)${u ? ` (${u})` : ""}`;
      const ch = c.v.can.change.replace(/^(Yes|No)\b/, (m) =>
        m === "Yes" ? "✅ Yes" : "❌ No",
      );
      return [
        `| ${name} | ${ch} | ${c.v.can.toggle} | ${c.v.can.where} | ${badge(c.v)} |`,
        ...handRows(id).map(handGlance),
      ];
    }),
    ...handRows().map(handGlance),
    "| [Tools per Variant](./tools-per-variant.md) (Every request carries the list) | ✅ Yes. Use `--tools`, `--allowedTools`, `--disallowedTools`, or settings. | `--bare` and `CLAUDE_CODE_SIMPLE=1` cut the list to three tools. | Built into the program. | <Undocumented /> |",
    "",
    "## How the Captures Were Made",
    "",
    ...para(INDEX_FACTS.method),
    "",
    "## The Three System Blocks",
    "",
    ...para(INDEX_FACTS.blocks),
    "",
    "## How Claude Code Picks the Variant",
    "",
    ...para(INDEX_FACTS.flow),
    "",
    "## All Variants",
    "",
    "Size is the number of characters in everything shown on the variant page, after placeholders are in place. The last column lists the `#` headings found in the system body.",
    "",
    "| Variant | How to select it | Characters | Tools | Sections |",
    "| --- | --- | --- | --- | --- |",
  ];
  const handAll = (h: HandPage) =>
    `| ${handLink(h)} | ${h.row?.select} | ${fmt(h.row?.chars ?? 0)} | ${h.row?.tools} | ${h.row?.sections} |`;
  const hasSelect = (h: HandPage) => h.row?.select !== undefined;
  const allRows = (afterId?: string) =>
    handRows(afterId).filter(hasSelect).map(handAll);
  for (const [id, c] of caps) {
    const dup = dupOf.get(id);
    const secs = c.sections.length
      ? c.sections.map((s) => `\`${s}\``).join(", ")
      : "none";
    L.push(
      `| [${c.v.title}](./${id}.md)${dup ? ` (same text as ${dup})` : ""} | ${c.v.select} | ${fmt(c.chars)} | ${c.tools.length} | ${secs} |`,
      ...allRows(id),
    );
  }
  L.push(...allRows());
  L.push(
    "",
    "See also [Tools per Variant](./tools-per-variant.md).",
    "",
    ...para(INDEX_FACTS.placeholders),
    "",
    "## How to Regenerate",
    "",
    ...para(INDEX_FACTS.regen),
    "",
  );
  writeFileSync(join(DOCS, "index.md"), stripTrailing(L.join("\n")));
}
console.log(
  `rendered ${caps.size} variants, ${dupOf.size} duplicates: ${[...dupOf].map(([a, b]) => `${a}=${b}`).join(" ")}`,
);
