import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ctx, DOCS } from "./ctx.ts";
import { fence, stripTrailing, yaml } from "./text.ts";

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
  const def = ctx.caps.get("default-lean");
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
    `sidebar_position: ${ctx.pos++}`,
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
  const title =
    ctx.caps.get(id)?.v.title ?? ctx.hand.find((x) => x.id === id)?.title;
  return title ? { id, title } : undefined;
};
export const listingPages = () => {
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
};
