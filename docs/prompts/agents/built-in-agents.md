---
title: "Built-In Agents"
description: "The default description and tool list of each built-in agent type, its prompt page, and how to replace it."
sidebar_position: 15
---

The main agent reads one line for each agent type it can start: the description and the tools. The lines below come from [Default, Lean Prompt](../defaults/default-lean.md), in `-p`. The interactive screen also lists `claude-code-guide`. See [Subagent Runtime](../../extend/subagents/runtime.md#built-in-agents) for the model and the other settings of each agent.

## How to Override

| What | How | Where to read more |
| --- | --- | --- |
| The whole agent | An agent file or an `--agents` entry with the same `name` replaces the built-in agent: its description, tools, model, and prompt. | [Override a Built-in Agent with a File](./override-agent-file.md) and [Override a Built-in Agent with --agents](./override-agents-flag.md) |
| Text added to every subagent prompt | `--append-subagent-system-prompt` | [Append to Every Subagent Prompt](./override-append-subagent.md) |
| Remove `Explore` and `Plan` | `CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS=1` | [Turn Off the Explore and Plan Agents](./disable-explore-plan.md) |
| Remove the built-in agents in `-p` | `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS=1` | [Turn Off All Built-in Agents](./disable-builtin-agents.md) |

## Default Text (5)

### `claude`

```text
Catch-all for any task that doesn't fit a more specific agent. FleetView's default when no agent name is typed. (Tools: *)
```

Prompt: [Subagent, Claude (FleetView)](./subagent-claude.md).

### `Explore`

```text
Read-only search agent for broad fan-out searches — when answering means sweeping many files, directories, or naming conventions and you only need the conclusion, not the file dumps. It reads excerpts rather than whole files, so it locates code; it doesn't review or audit it. Specify search breadth: "medium" for moderate exploration, "very thorough" for multiple locations and naming conventions. (Tools: All tools except Agent, Artifact, ArtifactComments, ArtifactData, ArtifactCheck, ExitPlanMode, Edit, Write, NotebookEdit)
```

Prompt: [Subagent, Explore](./subagent-explore.md).

### `general-purpose`

```text
General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you. (Tools: *)
```

Prompt: [Subagent, General Purpose](./subagent-general-purpose.md).

### `Plan`

```text
Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs. (Tools: All tools except Agent, Artifact, ArtifactComments, ArtifactData, ArtifactCheck, ExitPlanMode, Edit, Write, NotebookEdit)
```

Prompt: [Subagent, Plan](./subagent-plan.md).

### `statusline-setup`

```text
Use this agent to configure the user's Claude Code status line setting. (Tools: Read, Edit)
```

Prompt: [Subagent, Statusline Setup](./subagent-statusline-setup.md).
