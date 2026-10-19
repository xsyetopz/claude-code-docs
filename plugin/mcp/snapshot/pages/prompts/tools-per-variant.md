---
title: "Tools per Variant"
description: "Which tools each system prompt variant sends, and how the tool text differs."
url: https://xsyetopz.github.io/claude-code-docs/prompts/tools-per-variant
source: docs/prompts/tools-per-variant.md
---

# Tools per Variant


Tools are part of what the model reads. Each request carries a list of tools, and each tool has a name, a description, and a schema. This page compares the lists across variants.

## Default Tool List

The default list has 20 tools on Opus 5.5. The columns show the length of the description and of the JSON schema, in characters.

| Tool | Description | Schema |
| --- | --- | --- |
| `Agent` | 1,989 | 1,942 |
| `Bash` | 1,406 | 1,720 |
| `CronCreate` | 3,123 | 958 |
| `CronDelete` | 167 | 206 |
| `CronList` | 106 | 119 |
| `Edit` | 360 | 552 |
| `EnterWorktree` | 3,220 | 687 |
| `ExitWorktree` | 1,923 | 481 |
| `ListAgents` | 777 | 316 |
| `NotebookEdit` | 619 | 940 |
| `Read` | 790 | 1,071 |
| `ReportFindings` | 574 | 1,545 |
| `ScheduleWakeup` | 3,396 | 1,392 |
| `SendMessage` | 4,259 | 1,291 |
| `Skill` | 1,417 | 327 |
| `TaskStop` | 364 | 366 |
| `WebFetch` | 469 | 554 |
| `WebSearch` | 334 | 468 |
| `Workflow` | 3,480 | 1,775 |
| `Write` | 240 | 348 |

## Differences by Variant

Each row compares one variant to the default list. Variants with the same tools and text as the default are grouped at the end.

| Variant | Tools | Difference |
| --- | --- | --- |
| [Full Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/full-prompt.md) | 20 | changes the text or schema of `Agent`, `Bash`, `Edit`, `Read`, `WebFetch`, `WebSearch`, `Write`. |
| [Bare Mode](https://xsyetopz.github.io/claude-code-docs/prompts/bare.md) | 3 | removes `Agent`, `CronCreate`, `CronDelete`, `CronList`, `EnterWorktree`, `ExitWorktree`, `ListAgents`, `NotebookEdit`, `ReportFindings`, `ScheduleWakeup`, `SendMessage`, `Skill`, `TaskStop`, `WebFetch`, `WebSearch`, `Workflow`, `Write`. changes the text or schema of `Bash`, `Edit`, `Read`. |
| [Simple Mode Env Var](https://xsyetopz.github.io/claude-code-docs/prompts/simple-env.md) | 3 | removes `Agent`, `CronCreate`, `CronDelete`, `CronList`, `EnterWorktree`, `ExitWorktree`, `ListAgents`, `NotebookEdit`, `ReportFindings`, `ScheduleWakeup`, `SendMessage`, `Skill`, `TaskStop`, `WebFetch`, `WebSearch`, `Workflow`, `Write`. changes the text or schema of `Bash`, `Edit`, `Read`. |
| [Exclude Dynamic Sections, Full Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/exclude-dynamic-full.md) | 20 | changes the text or schema of `Agent`, `Bash`, `Edit`, `Read`, `WebFetch`, `WebSearch`, `Write`. |
| [Custom Output Style on the Full Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/style-custom-full.md) | 20 | changes the text or schema of `Agent`, `Bash`, `Edit`, `Read`, `WebFetch`, `WebSearch`, `Write`. |
| [Custom Output Style with Keep Coding Instructions](https://xsyetopz.github.io/claude-code-docs/prompts/style-custom-keep.md) | 20 | changes the text or schema of `Agent`, `Bash`, `Edit`, `Read`, `WebFetch`, `WebSearch`, `Write`. |
| [Permission Mode, Plan](https://xsyetopz.github.io/claude-code-docs/prompts/mode-plan.md) | 20 | changes the text or schema of `Bash`. |
| [Subagent, General Purpose](https://xsyetopz.github.io/claude-code-docs/prompts/subagent-general-purpose.md) | 13 | removes `CronCreate`, `CronDelete`, `CronList`, `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`. |
| [Subagent, Explore](https://xsyetopz.github.io/claude-code-docs/prompts/subagent-explore.md) | 9 | removes `Agent`, `CronCreate`, `CronDelete`, `CronList`, `Edit`, `ListAgents`, `NotebookEdit`, `ReportFindings`, `ScheduleWakeup`, `Workflow`, `Write`. |
| [Subagent, Plan](https://xsyetopz.github.io/claude-code-docs/prompts/subagent-plan.md) | 9 | removes `Agent`, `CronCreate`, `CronDelete`, `CronList`, `Edit`, `ListAgents`, `NotebookEdit`, `ReportFindings`, `ScheduleWakeup`, `Workflow`, `Write`. |
| [Subagent, Custom Agent](https://xsyetopz.github.io/claude-code-docs/prompts/subagent-custom.md) | 13 | removes `CronCreate`, `CronDelete`, `CronList`, `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`. |

## Same Tools as the Default

[Default, Sonnet 5.5](https://xsyetopz.github.io/claude-code-docs/prompts/default-sonnet.md), [Default, Haiku 5.5](https://xsyetopz.github.io/claude-code-docs/prompts/default-haiku.md), [Simple Prompt Switch on Sonnet](https://xsyetopz.github.io/claude-code-docs/prompts/simple-prompt-sonnet.md), [Simple Prompt Switch on Haiku](https://xsyetopz.github.io/claude-code-docs/prompts/simple-prompt-haiku.md), [Simple Prompt Switch on Opus](https://xsyetopz.github.io/claude-code-docs/prompts/simple-prompt-opus.md), [Exclude Dynamic Sections](https://xsyetopz.github.io/claude-code-docs/prompts/exclude-dynamic.md), [Output Style, Explanatory](https://xsyetopz.github.io/claude-code-docs/prompts/style-explanatory.md), [Output Style, Learning](https://xsyetopz.github.io/claude-code-docs/prompts/style-learning.md), [Output Style, Proactive](https://xsyetopz.github.io/claude-code-docs/prompts/style-proactive.md), [Output Style, Concise](https://xsyetopz.github.io/claude-code-docs/prompts/style-concise.md), [Custom Output Style](https://xsyetopz.github.io/claude-code-docs/prompts/style-custom.md), [Custom Output Style with Keep Coding Instructions, Lean Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/style-custom-keep-lean.md), [Append System Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/append-system-prompt.md), [Replace System Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/system-prompt.md), [Replace and Append Together](https://xsyetopz.github.io/claude-code-docs/prompts/system-prompt-append.md), [With a CLAUDE.md File](https://xsyetopz.github.io/claude-code-docs/prompts/claude-md.md), [Inside a Git Repository](https://xsyetopz.github.io/claude-code-docs/prompts/git-repo.md), [Main Thread Custom Agent](https://xsyetopz.github.io/claude-code-docs/prompts/agent-main.md), [Permission Mode, Accept Edits](https://xsyetopz.github.io/claude-code-docs/prompts/mode-acceptEdits.md), [Permission Mode, Don't Ask](https://xsyetopz.github.io/claude-code-docs/prompts/mode-dontAsk.md), [Brief Mode](https://xsyetopz.github.io/claude-code-docs/prompts/brief.md), [Compaction Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/compact.md).

## Bare Mode Tools

| Tool | Description | Schema |
| --- | --- | --- |
| `Bash` | 22 | 1,483 |
| `Edit` | 29 | 552 |
| `Read` | 35 | 1,071 |
