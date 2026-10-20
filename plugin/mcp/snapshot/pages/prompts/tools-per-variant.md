---
title: "Tools per Variant"
description: "Which tools each system prompt variant sends, and how the tool text differs."
url: https://xsyetopz.github.io/claude-code-docs/prompts/tools-per-variant
source: docs/prompts/tools-per-variant.md
---

# Tools per Variant


Tools are part of what the model reads. Each request carries a list of tools, and each tool has a name, a description, and a schema. This page compares the lists across variants.

## Default Tool List

The default list has 12 tools on Opus 5.5. The columns show the length of the description and of the JSON schema, in characters.

| Tool | Description | Schema |
| --- | --- | --- |
| `Agent` | 1,989 | 1,942 |
| `Bash` | 1,406 | 1,720 |
| `Edit` | 360 | 552 |
| `ListAgents` | 777 | 316 |
| `Read` | 790 | 1,071 |
| `ReportFindings` | 574 | 1,545 |
| `ScheduleWakeup` | 3,396 | 1,392 |
| `Skill` | 1,417 | 327 |
| `ToolSearch` | 953 | 406 |
| `Workflow` | 3,480 | 1,775 |
| `DeferredToolPlaceholder` | 83 | 33 |
| `Write` | 240 | 348 |

## Differences by Variant

Each row compares one variant to the default list. Variants with the same tools and text as the default are grouped at the end.

| Variant | Tools | Difference |
| --- | --- | --- |
| [Full Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/full-prompt.md) | 12 | changes the text or schema of `Agent`, `Bash`, `Edit`, `Read`, `Write`. |
| [Bare Mode](https://xsyetopz.github.io/claude-code-docs/prompts/bare.md) | 3 | removes `Agent`, `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Skill`, `ToolSearch`, `Workflow`, `DeferredToolPlaceholder`, `Write`. changes the text or schema of `Bash`, `Edit`, `Read`. |
| [Simple Mode Env Var](https://xsyetopz.github.io/claude-code-docs/prompts/simple-env.md) | 3 | removes `Agent`, `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Skill`, `ToolSearch`, `Workflow`, `DeferredToolPlaceholder`, `Write`. changes the text or schema of `Bash`, `Edit`, `Read`. |
| [Exclude Dynamic Sections, Full Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/exclude-dynamic-full.md) | 12 | changes the text or schema of `Agent`, `Bash`, `Edit`, `Read`, `Write`. |
| [Custom Output Style on the Full Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/style-custom-full.md) | 12 | changes the text or schema of `Agent`, `Bash`, `Edit`, `Read`, `Write`. |
| [Custom Output Style with Keep Coding Instructions](https://xsyetopz.github.io/claude-code-docs/prompts/style-custom-keep.md) | 12 | changes the text or schema of `Agent`, `Bash`, `Edit`, `Read`, `Write`. |
| [Permission Mode, Plan](https://xsyetopz.github.io/claude-code-docs/prompts/mode-plan.md) | 12 | changes the text or schema of `Bash`. |
| [Subagent, General Purpose](https://xsyetopz.github.io/claude-code-docs/prompts/subagent-general-purpose.md) | 8 | removes `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`. |
| [Subagent, Explore](https://xsyetopz.github.io/claude-code-docs/prompts/subagent-explore.md) | 5 | removes `Agent`, `Edit`, `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`, `Write`. |
| [Subagent, Plan](https://xsyetopz.github.io/claude-code-docs/prompts/subagent-plan.md) | 5 | removes `Agent`, `Edit`, `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`, `Write`. |
| [Subagent, Custom Agent](https://xsyetopz.github.io/claude-code-docs/prompts/subagent-custom.md) | 8 | removes `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`. |
| [Subagent, Statusline Setup](https://xsyetopz.github.io/claude-code-docs/prompts/subagent-statusline-setup.md) | 2 | removes `Agent`, `Bash`, `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Skill`, `ToolSearch`, `Workflow`, `DeferredToolPlaceholder`, `Write`. |
| [Subagent, Claude (FleetView)](https://xsyetopz.github.io/claude-code-docs/prompts/subagent-claude.md) | 8 | removes `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`. |
| [Subagent, Web Fetch](https://xsyetopz.github.io/claude-code-docs/prompts/subagent-web-fetch.md) | 1 | adds `WebFetch`. removes `Agent`, `Bash`, `Edit`, `ListAgents`, `Read`, `ReportFindings`, `ScheduleWakeup`, `Skill`, `ToolSearch`, `Workflow`, `DeferredToolPlaceholder`, `Write`. |
| [Override a Built-in Agent with a File](https://xsyetopz.github.io/claude-code-docs/prompts/override-agent-file.md) | 8 | removes `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`. |
| [Override a Built-in Agent with --agents](https://xsyetopz.github.io/claude-code-docs/prompts/override-agents-flag.md) | 8 | removes `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`. |
| [Append to Every Subagent Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/override-append-subagent.md) | 5 | removes `Agent`, `Edit`, `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`, `Write`. |
| [Turn Off All Built-in Agents](https://xsyetopz.github.io/claude-code-docs/prompts/disable-builtin-agents.md) | 12 | changes the text or schema of `Agent`. |
| [Override /simplify with a Skill File](https://xsyetopz.github.io/claude-code-docs/prompts/override-skill-simplify.md) | 12 | changes the text or schema of `Bash`. |
| [Prompt Hook Request](https://xsyetopz.github.io/claude-code-docs/prompts/hook-prompt.md) | 0 | removes `Agent`, `Bash`, `Edit`, `ListAgents`, `Read`, `ReportFindings`, `ScheduleWakeup`, `Skill`, `ToolSearch`, `Workflow`, `DeferredToolPlaceholder`, `Write`. |
| [Agent Hook Request](https://xsyetopz.github.io/claude-code-docs/prompts/hook-agent.md) | 10 | adds `StructuredOutput`. removes `Agent`, `ScheduleWakeup`, `Workflow`. |
| [Auto Mode Classifier](https://xsyetopz.github.io/claude-code-docs/prompts/auto-classifier.md) | 0 | removes `Agent`, `Bash`, `Edit`, `ListAgents`, `Read`, `ReportFindings`, `ScheduleWakeup`, `Skill`, `ToolSearch`, `Workflow`, `DeferredToolPlaceholder`, `Write`. |
| [Auto Mode Classifier, Custom Rules](https://xsyetopz.github.io/claude-code-docs/prompts/auto-classifier-custom.md) | 0 | removes `Agent`, `Bash`, `Edit`, `ListAgents`, `Read`, `ReportFindings`, `ScheduleWakeup`, `Skill`, `ToolSearch`, `Workflow`, `DeferredToolPlaceholder`, `Write`. |
| [Plan Mode, Custom Workflow](https://xsyetopz.github.io/claude-code-docs/prompts/plan-mode-instructions.md) | 12 | changes the text or schema of `Bash`. |
| [Git Instructions Turned Off](https://xsyetopz.github.io/claude-code-docs/prompts/git-instructions-off.md) | 12 | changes the text or schema of `Bash`. |
| [Subagent with --system-prompt and --append-system-prompt](https://xsyetopz.github.io/claude-code-docs/prompts/subagent-with-prompt-flags.md) | 5 | removes `Agent`, `Edit`, `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`, `Write`. |
| [Prompt Hook on Stop](https://xsyetopz.github.io/claude-code-docs/prompts/hook-prompt-stop.md) | 0 | removes `Agent`, `Bash`, `Edit`, `ListAgents`, `Read`, `ReportFindings`, `ScheduleWakeup`, `Skill`, `ToolSearch`, `Workflow`, `DeferredToolPlaceholder`, `Write`. |

## Same Tools as the Default

[Default, Sonnet 5.5](https://xsyetopz.github.io/claude-code-docs/prompts/default-sonnet.md), [Default, Haiku 5.5](https://xsyetopz.github.io/claude-code-docs/prompts/default-haiku.md), [Simple Prompt Switch on Sonnet](https://xsyetopz.github.io/claude-code-docs/prompts/simple-prompt-sonnet.md), [Simple Prompt Switch on Haiku](https://xsyetopz.github.io/claude-code-docs/prompts/simple-prompt-haiku.md), [Simple Prompt Switch on Opus](https://xsyetopz.github.io/claude-code-docs/prompts/simple-prompt-opus.md), [Exclude Dynamic Sections](https://xsyetopz.github.io/claude-code-docs/prompts/exclude-dynamic.md), [Output Style, Explanatory](https://xsyetopz.github.io/claude-code-docs/prompts/style-explanatory.md), [Output Style, Learning](https://xsyetopz.github.io/claude-code-docs/prompts/style-learning.md), [Output Style, Proactive](https://xsyetopz.github.io/claude-code-docs/prompts/style-proactive.md), [Output Style, Concise](https://xsyetopz.github.io/claude-code-docs/prompts/style-concise.md), [Custom Output Style](https://xsyetopz.github.io/claude-code-docs/prompts/style-custom.md), [Custom Output Style with Keep Coding Instructions, Lean Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/style-custom-keep-lean.md), [Append System Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/append-system-prompt.md), [Replace System Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/system-prompt.md), [Replace and Append Together](https://xsyetopz.github.io/claude-code-docs/prompts/system-prompt-append.md), [With a CLAUDE.md File](https://xsyetopz.github.io/claude-code-docs/prompts/claude-md.md), [Inside a Git Repository](https://xsyetopz.github.io/claude-code-docs/prompts/git-repo.md), [Main Thread Custom Agent](https://xsyetopz.github.io/claude-code-docs/prompts/agent-main.md), [Permission Mode, Accept Edits](https://xsyetopz.github.io/claude-code-docs/prompts/mode-acceptEdits.md), [Permission Mode, Don't Ask](https://xsyetopz.github.io/claude-code-docs/prompts/mode-dontAsk.md), [Brief Mode](https://xsyetopz.github.io/claude-code-docs/prompts/brief.md), [Compaction Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/compact.md), [Turn Off the Explore and Plan Agents](https://xsyetopz.github.io/claude-code-docs/prompts/disable-explore-plan.md), [Command, /init](https://xsyetopz.github.io/claude-code-docs/prompts/command-init.md), [Command, /security-review](https://xsyetopz.github.io/claude-code-docs/prompts/command-security-review.md), [Skill, /simplify](https://xsyetopz.github.io/claude-code-docs/prompts/command-simplify.md), [Skill, /debug](https://xsyetopz.github.io/claude-code-docs/prompts/command-debug.md), [Override /init with a Command File](https://xsyetopz.github.io/claude-code-docs/prompts/override-command-init.md), [Compaction Prompt, Custom Instructions](https://xsyetopz.github.io/claude-code-docs/prompts/compact-custom.md), [Auto Memory Turned Off](https://xsyetopz.github.io/claude-code-docs/prompts/memory-off.md), [Custom Output Style with a Built-in Name](https://xsyetopz.github.io/claude-code-docs/prompts/style-override-builtin.md).

## Bare Mode Tools

| Tool | Description | Schema |
| --- | --- | --- |
| `Bash` | 22 | 1,483 |
| `Edit` | 29 | 552 |
| `Read` | 35 | 1,071 |
