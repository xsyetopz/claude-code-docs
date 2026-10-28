import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type { PromptGroup } from "../variants.ts";
import { groupDir } from "./ctx.ts";

// One row for each folder in docs/prompts/. The order is the sidebar order, from position 2.
// index.md holds position 1.
export const GROUPS: { id: PromptGroup; label: string; description: string }[] =
  [
    {
      id: "defaults",
      label: "Defaults",
      description:
        "The base prompts and the whole-prompt views, with the switches that change them.",
    },
    {
      id: "output-styles",
      label: "Output Styles",
      description: "The prompt that each built-in or custom output style adds.",
    },
    {
      id: "context-and-memory",
      label: "Context and Memory",
      description:
        "The prompts for compaction, memory files, and the repository context.",
    },
    {
      id: "agents",
      label: "Agents",
      description:
        "The prompts of the main agent, the built-in subagents, and custom agents.",
    },
    {
      id: "commands",
      label: "Commands",
      description: "The text that a slash command sends to the model.",
    },
    {
      id: "hooks",
      label: "Hooks",
      description: "The prompts that prompt hooks and agent hooks send.",
    },
    {
      id: "modes",
      label: "Modes",
      description:
        "The prompts for the permission modes, plan mode, and the auto mode classifier.",
    },
    {
      id: "skills",
      label: "Skills",
      description:
        "The prompts of the bundled skills that the Skill tool runs.",
    },
    {
      id: "tools",
      label: "Tools",
      description: "The tool descriptions and schemas that each request sends.",
    },
    {
      id: "other",
      label: "Other",
      description:
        "Prompts that fit no other group, such as overrides and helper requests.",
    },
  ];

export const isGroup = (g: unknown): g is PromptGroup =>
  GROUPS.some((x) => x.id === g);

// writes docs/prompts/<group>/_category_.json for every group
export const writeCategories = () => {
  for (const [i, g] of GROUPS.entries()) {
    const cat = {
      label: g.label,
      position: i + 2,
      link: {
        type: "generated-index",
        slug: `/prompts/${g.id}`,
        title: g.label,
        description: g.description,
      },
    };
    writeFileSync(
      join(groupDir(g.id), "_category_.json"),
      `${JSON.stringify(cat, null, 2)}\n`,
    );
  }
};
