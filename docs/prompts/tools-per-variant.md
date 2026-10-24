---
title: "Tools per Variant"
description: "Which tools each system prompt variant sends, and how the tool text differs."
sidebar_position: 62
---

Tools are part of what the model reads. Each request carries a list of tools, and each tool has a name, a description, and a schema. This page compares the lists across variants.

## Default Tool List

The default list has 12 tools on Opus 5.5. The columns show the length of the description and of the JSON schema, in characters.

| Tool | Description | Schema |
| --- | --- | --- |
| [`Agent`](./tools.md#agent) | 3,227 | 1,942 |
| [`Bash`](./tools.md#bash) | 1,774 | 1,720 |
| [`Edit`](./tools.md#edit) | 360 | 552 |
| [`ListAgents`](./tools.md#listagents) | 777 | 316 |
| [`Read`](./tools.md#read) | 790 | 1,071 |
| [`ReportFindings`](./tools.md#reportfindings) | 574 | 1,545 |
| [`ScheduleWakeup`](./tools.md#schedulewakeup) | 3,396 | 1,392 |
| [`Skill`](./tools.md#skill) | 1,417 | 327 |
| [`ToolSearch`](./tools.md#toolsearch) | 953 | 406 |
| [`Workflow`](./tools.md#workflow) | 3,480 | 1,775 |
| [`DeferredToolPlaceholder`](./tools.md#deferredtoolplaceholder) | 83 | 33 |
| [`Write`](./tools.md#write) | 240 | 348 |

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
| [Subagent, Statusline Setup](./subagent-statusline-setup.md) | 2 | removes `Agent`, `Bash`, `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Skill`, `ToolSearch`, `Workflow`, `DeferredToolPlaceholder`, `Write`. |
| [Subagent, Claude (FleetView)](./subagent-claude.md) | 8 | removes `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`. |
| [Subagent, Web Fetch](./subagent-web-fetch.md) | 1 | adds `WebFetch`. removes `Agent`, `Bash`, `Edit`, `ListAgents`, `Read`, `ReportFindings`, `ScheduleWakeup`, `Skill`, `ToolSearch`, `Workflow`, `DeferredToolPlaceholder`, `Write`. |
| [Override a Built-in Agent with a File](./override-agent-file.md) | 8 | removes `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`. |
| [Override a Built-in Agent with --agents](./override-agents-flag.md) | 8 | removes `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`. |
| [Append to Every Subagent Prompt](./override-append-subagent.md) | 5 | removes `Agent`, `Edit`, `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`, `Write`. |
| [Turn Off All Built-in Agents](./disable-builtin-agents.md) | 12 | changes the text or schema of `Agent`. |
| [Override /simplify with a Skill File](./override-skill-simplify.md) | 12 | changes the text or schema of `Bash`. |
| [Prompt Hook Request](./hook-prompt.md) | 0 | removes `Agent`, `Bash`, `Edit`, `ListAgents`, `Read`, `ReportFindings`, `ScheduleWakeup`, `Skill`, `ToolSearch`, `Workflow`, `DeferredToolPlaceholder`, `Write`. |
| [Agent Hook Request](./hook-agent.md) | 10 | adds `StructuredOutput`. removes `Agent`, `ScheduleWakeup`, `Workflow`. |
| [Auto Mode Classifier](./auto-classifier.md) | 0 | removes `Agent`, `Bash`, `Edit`, `ListAgents`, `Read`, `ReportFindings`, `ScheduleWakeup`, `Skill`, `ToolSearch`, `Workflow`, `DeferredToolPlaceholder`, `Write`. |
| [Auto Mode Classifier, Custom Rules](./auto-classifier-custom.md) | 0 | removes `Agent`, `Bash`, `Edit`, `ListAgents`, `Read`, `ReportFindings`, `ScheduleWakeup`, `Skill`, `ToolSearch`, `Workflow`, `DeferredToolPlaceholder`, `Write`. |
| [Plan Mode, Custom Workflow](./plan-mode-instructions.md) | 12 | changes the text or schema of `Bash`. |
| [Git Instructions Turned Off](./git-instructions-off.md) | 12 | changes the text or schema of `Bash`. |
| [Subagent with --system-prompt and --append-system-prompt](./subagent-with-prompt-flags.md) | 5 | removes `Agent`, `Edit`, `ListAgents`, `ReportFindings`, `ScheduleWakeup`, `Workflow`, `Write`. |
| [Prompt Hook on Stop](./hook-prompt-stop.md) | 0 | removes `Agent`, `Bash`, `Edit`, `ListAgents`, `Read`, `ReportFindings`, `ScheduleWakeup`, `Skill`, `ToolSearch`, `Workflow`, `DeferredToolPlaceholder`, `Write`. |
| [All Tools Sent Upfront](./tools-upfront.md) | 21 | adds `CronCreate`, `CronDelete`, `CronList`, `EnterWorktree`, `ExitWorktree`, `Monitor`, `NotebookEdit`, `SendMessage`, `TaskStop`, `WebFetch`, `WebSearch`. removes `ToolSearch`, `DeferredToolPlaceholder`. |

## Same Tools as the Default

[Default, Sonnet 5.5](./default-sonnet.md), [Default, Haiku 5.5](./default-haiku.md), [Simple Prompt Switch on Sonnet](./simple-prompt-sonnet.md), [Simple Prompt Switch on Haiku](./simple-prompt-haiku.md), [Simple Prompt Switch on Opus](./simple-prompt-opus.md), [Exclude Dynamic Sections](./exclude-dynamic.md), [Output Style, Explanatory](./style-explanatory.md), [Output Style, Learning](./style-learning.md), [Output Style, Proactive](./style-proactive.md), [Output Style, Concise](./style-concise.md), [Custom Output Style](./style-custom.md), [Custom Output Style with Keep Coding Instructions, Lean Prompt](./style-custom-keep-lean.md), [Append System Prompt](./append-system-prompt.md), [Replace System Prompt](./system-prompt.md), [Replace and Append Together](./system-prompt-append.md), [With a CLAUDE.md File](./claude-md.md), [Inside a Git Repository](./git-repo.md), [Main Thread Custom Agent](./agent-main.md), [Permission Mode, Accept Edits](./mode-acceptEdits.md), [Permission Mode, Don't Ask](./mode-dontAsk.md), [Brief Mode](./brief.md), [Compaction Prompt](./compact.md), [Turn Off the Explore and Plan Agents](./disable-explore-plan.md), [Command, /init](./command-init.md), [Command, /security-review](./command-security-review.md), [Skill, /simplify](./command-simplify.md), [Skill, /debug](./command-debug.md), [Override /init with a Command File](./override-command-init.md), [Compaction Prompt, Custom Instructions](./compact-custom.md), [Auto Memory Turned Off](./memory-off.md), [Custom Output Style with a Built-in Name](./style-override-builtin.md).

## Bare Mode Tools

| Tool | Description | Schema |
| --- | --- | --- |
| `Bash` | 22 | 1,483 |
| `Edit` | 29 | 552 |
| `Read` | 35 | 1,071 |
