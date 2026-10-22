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
type Tool = {
  name: string;
  desc: number;
  schema: number;
  text: string;
  schemaText: string;
};
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
const toolLink = (name: string) =>
  `[\`${name}\`](./tools.md#${name.toLowerCase()})`;
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
      (t) => `| ${toolLink(t.name)} | ${fmt(t.desc)} | ${fmt(t.schema)} |`,
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

// tools: the default text of every tool, deferred ones from tools-upfront
{
  const def = caps.get("default-lean");
  const all = caps.get("tools-upfront") ?? def;
  if (!def || !all) throw new Error("missing default-lean capture");
  const upfront = new Set(def.tools.map((t) => t.name));
  const sent = new Set(all.tools.map((t) => t.name));
  const list = [...all.tools, ...def.tools.filter((t) => !sent.has(t.name))];
  const L: string[] = [
    "---",
    `title: "Tool Descriptions"`,
    `description: "The default description and input schema of every tool Claude Code sends, and how to override them."`,
    `sidebar_position: ${pos++}`,
    "---",
    "",
    `This page shows the text the model reads for each tool: the description and the JSON input schema. The text comes from [${all.v.title}](./${all.v.id}.md), which sends ${all.tools.length} tools with their full text, and from the default request, which sends ${def.tools.length} tools in full. It lists the rest only by name, and \`ToolSearch\` loads their text when the model asks for it.`,
    "",
    "Gated tools, and tools that only the interactive screen or other modes add (such as `AskUserQuestion`, `EnterPlanMode`, and the task tools), are not in this capture. See [Tools](../reference/tools/index.md) for the full list.",
    "",
    "## How to Override",
    "",
    "| What | How | Where to read more |",
    "| --- | --- | --- |",
    "| A tool's description | A Mod API `tool.describe` hook gets the description and returns a new one. It works for built-in and MCP tools. | [Mod API Tools, Commands, and Config](../extend/mod-api/tool-command-config.md) |",
    "| Deferred or sent upfront | `ENABLE_TOOL_SEARCH`, or `isDeferred` from a `tool.describe` hook. | [Tools and Bash Variables](../configure/env-vars/tools-and-bash.md) |",
    "| MCP tool description length | `CLAUDE_CODE_MAX_MCP_DESCRIPTION_LENGTH` | [Plugins and MCP Variables](../configure/env-vars/plugins-and-mcp.md) |",
    "| Which tools are sent | `--tools`, `--disallowedTools`, or a deny rule removes a tool. | [Tools](../reference/tools/index.md) |",
    "",
    "## Tools",
    "",
  ];
  for (const t of list) {
    L.push(
      `### \`${t.name}\``,
      "",
      `Sent in full by default: ${upfront.has(t.name) ? "✅ Yes" : "❌ No, deferred"}. Description: ${fmt(t.desc)} characters. Schema: ${fmt(t.schema)} characters.`,
      "",
      fence(t.text || "(no description)", "text"),
      "",
      fence(t.schemaText, "json skip-lint"),
      "",
    );
  }
  writeFileSync(join(DOCS, "tools.md"), stripTrailing(L.join("\n")));
}

// built-in agents and skills: the listing line each one gets in the default request
const listingPage = (o: {
  file: string;
  title: string;
  description: string;
  head: string;
  intro: string;
  override: string[];
  page: (name: string) => { id: string; title: string } | undefined;
}) => {
  const def = caps.get("default-lean");
  if (!def) throw new Error("missing default-lean capture");
  const block = def.parts.find((p) => p.text.includes(o.head))?.text ?? "";
  // one "- name: text" item per entry, continuation lines join the item above, a blank line ends the list
  const items: { name: string; text: string }[] = [];
  const body = block.slice(block.indexOf(o.head) + o.head.length);
  for (const l of body.replace(/^\n+/, "").split("\n")) {
    if (!l.trim()) break;
    const m = /^- ([^:]+): (.*)$/.exec(l);
    const last = items[items.length - 1];
    if (m) items.push({ name: m[1] ?? "", text: m[2] ?? "" });
    else if (last) last.text += `\n${l}`;
  }
  if (!items.length) throw new Error(`no listing after "${o.head}"`);
  const L: string[] = [
    "---",
    `title: ${yaml(o.title)}`,
    `description: ${yaml(o.description)}`,
    `sidebar_position: ${pos++}`,
    "---",
    "",
    o.intro.replace("<source>", `[${def.v.title}](./${def.v.id}.md)`),
    "",
    "## How to Override",
    "",
    "| What | How | Where to read more |",
    "| --- | --- | --- |",
    ...o.override,
    "",
    `## Default Text (${items.length})`,
    "",
  ];
  for (const { name, text } of items) {
    const page = o.page(name);
    L.push(
      `### \`${name}\``,
      "",
      fence(text, "text"),
      "",
      page ? `Prompt: [${page.title}](./${page.id}.md).` : "No prompt page.",
      "",
    );
  }
  writeFileSync(join(DOCS, o.file), stripTrailing(L.join("\n")));
};
const titled = (id: string) => {
  const title = caps.get(id)?.v.title ?? hand.find((x) => x.id === id)?.title;
  return title ? { id, title } : undefined;
};
listingPage({
  file: "built-in-agents.md",
  title: "Built-In Agents",
  description:
    "The default description and tool list of each built-in agent type, its prompt page, and how to replace it.",
  head: "Available agent types for the Agent tool:",
  intro:
    "The main agent reads one line for each agent type it can start: the description and the tools. The lines below come from <source>, in `-p`. The interactive screen also lists `claude-code-guide`. See [Subagent Runtime](../extend/subagents/runtime.md#built-in-agents) for the model and the other settings of each agent.",
  override: [
    "| The whole agent | An agent file or an `--agents` entry with the same `name` replaces the built-in agent: its description, tools, model, and prompt. | [Override a Built-in Agent with a File](./override-agent-file.md) and [Override a Built-in Agent with --agents](./override-agents-flag.md) |",
    "| Text added to every subagent prompt | `--append-subagent-system-prompt` | [Append to Every Subagent Prompt](./override-append-subagent.md) |",
    "| Remove `Explore` and `Plan` | `CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS=1` | [Turn Off the Explore and Plan Agents](./disable-explore-plan.md) |",
    "| Remove the built-in agents in `-p` | `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS=1` | [Turn Off All Built-in Agents](./disable-builtin-agents.md) |",
  ],
  page: (n) => titled(`subagent-${n.toLowerCase()}`),
});
listingPage({
  file: "built-in-skills.md",
  title: "Built-In Skills",
  description:
    "The default description of each bundled skill and command that the Skill tool lists, its prompt page, and how to replace it.",
  head: "The following skills are available for use with the Skill tool:",
  intro:
    "The main agent reads one line for each skill or command it can run with the `Skill` tool. The lines below come from <source>, in `-p`, with no skills or plugins of your own. Other entry points and gates change the list. See [Bundled Skills](../extend/skills-and-commands/bundled-skills.md).",
  override: [
    "| A skill | A skill folder with the same name replaces the bundled skill. | [Override /simplify with a Skill File](./override-skill-simplify.md) |",
    "| A command | A command file with the same name replaces the bundled command. | [Override /init with a Command File](./override-command-init.md) |",
    "| All skills and commands | `--disable-slash-commands` | [Skills and Commands](../extend/skills-and-commands/index.md) |",
  ],
  page: (n) => titled(`skill-${n}`) ?? titled(`command-${n}`),
});

// index
{
  const L: string[] = [
    "---",
    `title: "Captured System Prompts"`,
    `description: "Every system prompt variant you can pick in Claude Code ${CLAUDE_CODE_VERSION}, captured offline and compared."`,
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
    "| [Tool Descriptions](./tools.md) (Every request carries them) | ✅ Yes. A Mod API `tool.describe` hook replaces a description. | `ENABLE_TOOL_SEARCH`, `--tools`, `--disallowedTools`. | Built into the program. | <Undocumented /> |",
    "| [Built-In Skills](./built-in-skills.md) (The main agent reads one line for each) | ✅ Yes. A skill or command with the same name replaces one. | `--disable-slash-commands`. | Built into the program. Override in `.claude/skills/<name>/SKILL.md`. | <Documented /> |",
    "| [Built-In Agents](./built-in-agents.md) (The main agent reads one line for each) | ✅ Yes. An agent with the same name replaces one. | `CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS`, `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS`. | Built into the program. Override in `.claude/agents/<name>.md`. | <Documented /> |",
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
