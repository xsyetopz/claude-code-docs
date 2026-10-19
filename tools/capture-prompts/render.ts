// Reads ROOT/captures/*, normalizes machine-specific values, and writes
//   tools/capture-prompts/out/<id>.txt        normalized prompt text
//   docs/prompts/*.md                         the pages
// Run by capture.ts, or alone: bun tools/capture-prompts/render.ts
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  readdirSync,
} from "node:fs";
import { join } from "node:path";
import { VARIANTS, SUB_MARK, type Variant } from "./variants.ts";
import { NOTES, INDEX_FACTS, BADGE_NOTES } from "./notes.ts";

const ROOT = join(import.meta.dir, "..", "..");
const CAPTURES = join(ROOT, "captures");
const OUT = join(import.meta.dir, "out");
const DOCS = join(ROOT, "docs", "prompts");
mkdirSync(OUT, { recursive: true });
mkdirSync(DOCS, { recursive: true });

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

function normalizer(meta: { cwd: string; cfg: string; home: string }) {
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
    return t
      .replace(/\d{4}-\d\d-\d\d/g, "<date>")
      .replace(/- Platform: .*/g, "- Platform: <platform>")
      .replace(/- Shell: .*/g, "- Shell: <shell>")
      .replace(/- OS Version: .*/g, "- OS Version: <os-version>")
      .replace(/cc_version=(\d+\.\d+\.\d+)\.\w+/g, "cc_version=$1.<build>")
      .replace(/\b[0-9a-f]{7,40}\b(?= initial)/g, "<sha>")
      .replace(/\u{1F916}/gu, "<robot-emoji>")
      .replace(/\/plans\/[a-z]+(-[a-z]+)*\.md/g, "/plans/<plan-name>.md");
  };
}

function blocks(content: unknown): string[] {
  if (typeof content === "string") return [content];
  return (content as any[]).map((c) =>
    c.type === "text"
      ? c.text
      : `[${c.type}] ${JSON.stringify(c.input ?? c.content ?? c).slice(0, 400)}`,
  );
}

function load(v: Variant): Cap {
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
  const sys: any[] =
    typeof b.system === "string" ? [{ text: b.system }] : (b.system ?? []);
  sys.forEach((s, i) =>
    parts.push({
      label: `system[${i}] (${s.cache_control ? "cache marker: " + JSON.stringify(s.cache_control) : "no cache marker"})`,
      text: n(s.text),
    }),
  );
  b.messages.forEach((m: any, i: number) =>
    blocks(m.content).forEach((t, j) =>
      parts.push({
        label: `messages[${i}].content[${j}] (role: ${m.role})`,
        text: n(t),
      }),
    ),
  );
  const text = parts
    .map((p) => `=== ${p.label} ===\n${p.text.replace(/\s+$/, "")}\n`)
    .join("\n");
  const tools: Tool[] = (b.tools ?? []).map((t: any) => ({
    name: t.name,
    desc: (t.description ?? "").length,
    schema: JSON.stringify(t.input_schema ?? {}).length,
  }));
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
}

function udiff(a: string, b: string, la: string, lb: string): string {
  const fa = join(OUT, ".a.tmp"),
    fb = join(OUT, ".b.tmp");
  writeFileSync(fa, a);
  writeFileSync(fb, b);
  const r = Bun.spawnSync(["diff", "-u", "--label", la, "--label", lb, fa, fb]);
  rmSync(fa);
  rmSync(fb);
  return r.stdout.toString();
}

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
function para(lines: string[]): string[] {
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
}

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
for (const f of readdirSync(DOCS)) if (f.endsWith(".md")) rmSync(join(DOCS, f));

// duplicates: same normalized text as an earlier variant
const seen = new Map<string, string>();
const dupOf = new Map<string, string>();
for (const [id, c] of caps) {
  const h = Bun.hash(c.text + JSON.stringify(c.tools)).toString();
  if (seen.has(h)) dupOf.set(id, seen.get(h)!);
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
  lines.push(
    "## At a Glance",
    "",
    "| Question | Answer |",
    "| --- | --- |",
    `| Can you use it? | ${v.can.use} |`,
    `| Can you change it? | ${v.can.change} |`,
    `| Can you turn it on or off? | ${v.can.toggle} |`,
    `| Where does it live? | ${v.can.where} |`,
    `| Status | ${badge(v)} |`,
    "",
  );
  const sysChars = c.parts
    .filter((p) => p.label.startsWith("system["))
    .reduce((s, p) => s + p.text.length, 0);
  lines.push("## Size", "", "| Part | Characters |", "| --- | --- |");
  c.parts.forEach((p) =>
    lines.push(
      `| \`${p.label.replace(/ \(.*/, "")}\` | ${fmt(p.text.length)} |`,
    ),
  );
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
      `This variant sends exactly the same text and tools as [${caps.get(dup)!.v.title}](./${dup}.md). The page for that variant has the full text.`,
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
  writeFileSync(join(DOCS, `${id}.md`), lines.join("\n"));
}

function toolDiff(a: Tool[], b: Tool[]): string {
  const an = new Map(a.map((t) => [t.name, t])),
    bn = new Map(b.map((t) => [t.name, t]));
  const rem = a.filter((t) => !bn.has(t.name)).map((t) => t.name),
    add = b.filter((t) => !an.has(t.name)).map((t) => t.name);
  const chg = b
    .filter(
      (t) =>
        an.has(t.name) &&
        (an.get(t.name)!.desc !== t.desc ||
          an.get(t.name)!.schema !== t.schema),
    )
    .map((t) => t.name);
  const out: string[] = [];
  if (add.length) out.push(`adds ${add.map((x) => "`" + x + "`").join(", ")}.`);
  if (rem.length)
    out.push(`removes ${rem.map((x) => "`" + x + "`").join(", ")}.`);
  if (chg.length)
    out.push(
      `changes the text or schema of ${chg.map((x) => "`" + x + "`").join(", ")}.`,
    );
  return out.join(" ");
}

// tools-per-variant
{
  const def = caps.get("default-lean")!;
  const L: string[] = [
    "---",
    `title: "Tools per Variant"`,
    `description: "Which tools each system prompt variant sends, and how the tool text differs."`,
    `sidebar_position: ${pos++}`,
    "---",
    "",
    "Tools are part of what the model reads. Each request carries a list of tools, and each tool has a name, a description, and a schema. This page compares the lists across variants.",
    "",
    "## At a Glance",
    "",
    "| Question | Answer |",
    "| --- | --- |",
    "| Can you use it? | Yes. Every request carries the list. |",
    "| Can you change it? | Yes. Use `--tools`, `--allowedTools`, `--disallowedTools`, or settings. |",
    "| Can you turn it on or off? | `--bare` and `CLAUDE_CODE_SIMPLE=1` cut the list to three tools. |",
    "| Where does it live? | Built into the program. |",
    "| Status | <Undocumented /> |",
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
  L.push("", "## Same Tools as the Default", "", same.join(", ") + ".", "");
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
  writeFileSync(join(DOCS, "tools-per-variant.md"), L.join("\n"));
}

// index
{
  const L: string[] = [
    "---",
    `title: "Captured System Prompts"`,
    `description: "Every system prompt variant you can pick in Claude Code 2.1.303, captured offline and compared."`,
    `sidebar_position: 1`,
    "---",
    "",
    ...para(INDEX_FACTS.intro),
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
    "| Variant | How to select it | Characters | Tools | Sections | Status |",
    "| --- | --- | --- | --- | --- | --- |",
  ];
  for (const [id, c] of caps) {
    const dup = dupOf.get(id);
    const secs = c.sections.length
      ? c.sections.map((s) => "`" + s + "`").join(", ")
      : "none";
    L.push(
      `| [${c.v.title}](./${id}.md)${dup ? " (same text as " + dup + ")" : ""} | ${c.v.select} | ${fmt(c.chars)} | ${c.tools.length} | ${secs} | ${badge(c.v)} |`,
    );
  }
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
  writeFileSync(join(DOCS, "index.md"), L.join("\n"));
}
console.log(
  `rendered ${caps.size} variants, ${dupOf.size} duplicates: ${[...dupOf].map(([a, b]) => a + "=" + b).join(" ")}`,
);
