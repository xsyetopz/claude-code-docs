---
title: "Tools per Variant"
description: "Which tools each system prompt variant sends, and how the tool text differs."
sidebar_position: 36
---

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
| [Full Prompt](./full-prompt.md) | 12 | changes the text or schema of `Agent`, `Bash`, `Edit`, `Read`, `Write`. |
| [Bare Mode](./bare.md) | 3 | removes `Agent`, `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Skill`, `ToolSearch`, `Workflow`, `DeferredToolPlaceholder`, `Write`. changes the text or schema of `Bash`, `Edit`, `Read`. |
| [Simple Mode Env Var](./simple-env.md) | 3 | removes `Agent`, `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Skill`, `ToolSearch`, `Workflow`, `DeferredToolPlaceholder`, `Write`. changes the text or schema of `Bash`, `Edit`, `Read`. |
| [Exclude Dynamic Sections, Full Prompt](./exclude-dynamic-full.md) | 12 | changes the text or schema of `Agent`, `Bash`, `Edit`, `Read`, `Write`. |
| [Custom Output Style on the Full Prompt](./style-custom-full.md) | 12 | changes the text or schema of `Agent`, `Bash`, `Edit`, `Read`, `Write`. |
| [Custom Output Style with Keep Coding Instructions](./style-custom-keep.md) | 12 | changes the text or schema of `Agent`, `Bash`, `Edit`, `Read`, `Write`. |
| [Permission Mode, Plan](./mode-plan.md) | 12 | changes the text or schema of `Bash`. |
| [Subagent, General Purpose](./subagent-general-purpose.md) | 8 | removes `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`. |
| [Subagent, Explore](./subagent-explore.md) | 5 | removes `Agent`, `Edit`, `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`, `Write`. |
| [Subagent, Plan](./subagent-plan.md) | 5 | removes `Agent`, `Edit`, `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`, `Write`. |
| [Subagent, Custom Agent](./subagent-custom.md) | 8 | removes `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`. |

## Same Tools as the Default

[Default, Sonnet 5.5](./default-sonnet.md), [Default, Haiku 5.5](./default-haiku.md), [Simple Prompt Switch on Sonnet](./simple-prompt-sonnet.md), [Simple Prompt Switch on Haiku](./simple-prompt-haiku.md), [Simple Prompt Switch on Opus](./simple-prompt-opus.md), [Exclude Dynamic Sections](./exclude-dynamic.md), [Output Style, Explanatory](./style-explanatory.md), [Output Style, Learning](./style-learning.md), [Output Style, Proactive](./style-proactive.md), [Output Style, Concise](./style-concise.md), [Custom Output Style](./style-custom.md), [Custom Output Style with Keep Coding Instructions, Lean Prompt](./style-custom-keep-lean.md), [Append System Prompt](./append-system-prompt.md), [Replace System Prompt](./system-prompt.md), [Replace and Append Together](./system-prompt-append.md), [With a CLAUDE.md File](./claude-md.md), [Inside a Git Repository](./git-repo.md), [Main Thread Custom Agent](./agent-main.md), [Permission Mode, Accept Edits](./mode-acceptEdits.md), [Permission Mode, Don't Ask](./mode-dontAsk.md), [Brief Mode](./brief.md), [Compaction Prompt](./compact.md).

## Bare Mode Tools

| Tool | Description | Schema |
| --- | --- | --- |
| `Bash` | 22 | 1,483 |
| `Edit` | 29 | 552 |
| `Read` | 35 | 1,071 |
