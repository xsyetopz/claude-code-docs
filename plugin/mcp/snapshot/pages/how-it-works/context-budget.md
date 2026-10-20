---
title: "Context Budget"
description: "What an empty Claude Code session holds, what each tool costs, what else changes the budget, and how to keep it small."
url: https://xsyetopz.github.io/claude-code-docs/how-it-works/context-budget
source: docs/how-it-works/context-budget.md
---

# Context Budget


The context window is shared by everything the model reads.
Some of it is there before you type a word.
This page counts that start, shows what each tool and setting adds, and lists ways to keep it small.
For compaction and what fills the window later, see [Context and Compaction](https://xsyetopz.github.io/claude-code-docs/how-it-works/context-and-compaction.md).

> **Your Numbers May Differ:** All numbers come from one subscription account on 2026-10-20, with Claude Code `2.1.304` on Opus 5.5 unless a row says otherwise.
> Anthropic turns some tools on or off per account from its servers.
> For example, `ListAgents` and `ScheduleWakeup` are gated, and a server-side list can defer `Workflow` and `ReportFindings` (see [Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools.md)).
> Another account, plan, or date can get a different tool list and different totals.
> Run `/context` to see your own numbers.

## What an Empty Session Holds

Method: live runs on `2.1.304` with a subscription login, a fresh config folder, and an empty project (a `README.md` only, no git repo).
We ran `claude -p "/context" --output-format stream-json` and read the `context_usage` object.
For the second column we ran `claude -p hi` and then `claude -p --continue "/context"`.
All numbers are tokens on Opus 5.5. See [Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md#context-budget).
Source: the program ([Undocumented]).

| Category | Empty | After "hi" |
| --- | --- | --- |
| System prompt | 2,030 | 2,030 |
| System tools (loaded) | 7,981 | 8,046 |
| System tools (deferred, not in the total) | 10,350 | 10,350 |
| Skills (listing) | 2,093 | 2,093 |
| Messages | 10 | 3,599 |
| **Total** | **12,114** | **15,768** |

The window is 1,000,000 tokens on Opus, Sonnet, and Haiku 5.5.
The autocompact buffer is 33,000 tokens. See [Context and Compaction](https://xsyetopz.github.io/claude-code-docs/how-it-works/context-and-compaction.md) for the levels.

Messages jump by about 3.6k on the first turn.
The first request carries injected content as messages:

- a system reminder about git attribution
- an environment block (working folder, platform, model, knowledge cutoff)
- the names of the deferred tools
- the "Available agent types" list (`claude`, `Explore`, `general-purpose`, `Plan`, `statusline-setup`)
- the skills listing

Your own "hi" is about 1 token.
See the captured [first-turn messages](https://xsyetopz.github.io/claude-code-docs/prompts.md).

The real first request matched `/context` exactly: input 2, cache write 5,584, and cache read 10,182 make 15,768.
`/context` itself only calls the token counting endpoint, so it does not run a model turn. We checked this: `claude -p "/context"` against the stub sent 24 requests to `/v1/messages/count_tokens` and none to `/v1/messages`.

## What Each Tool Costs

We removed one tool at a time from the default set with `--disallowedTools <tool>` and read the new total of the empty session (12,114).
Running a tool alone with `--tools` is not used here, because those numbers carry shared overhead and mislead.

| Removed | New total | Change | Notes |
| --- | --- | --- | --- |
| `Workflow` | 10,135 | -1,979 | |
| `ScheduleWakeup` | 10,419 | -1,695 | |
| `Agent` | 10,786 | -1,328 | |
| `ReportFindings` | 11,292 | -822 | |
| `Read` | 11,402 | -712 | |
| `ListAgents` | 11,757 | -357 | |
| `Edit` | 11,765 | -349 | |
| `Write` | 11,879 | -235 | |
| `Bash` | 12,523 | +409 | The program adds `Glob` and `Grep` in its place, so the loaded tools rise to 8,390. |
| `Skill` | 17,688 | +5,574 | The skills listing goes, but the `Workflow` tool (description and schema) grows from 5,355 to 22,310 characters: with no `Skill` tool to load the `workflow-authoring` skill, the program puts that guidance in the tool text. |
| `ToolSearch` | 24,565 | +12,451 | Every deferred tool loads (deferred 0, tools 20,432). |
| `WebSearch` (deferred) | 12,114 | 0 | Only the deferred pool shrinks, 10,350 to 10,239. |

Loaded by default: `Agent`, `Bash`, `Edit`, `ListAgents`, `Read`, `ReportFindings`, `ScheduleWakeup`, `Skill`, `ToolSearch`, `Workflow`, and `Write`.
Deferred by default: `CronCreate`, `CronDelete`, `CronList`, `DesignSync`, `EnterWorktree`, `ExitWorktree`, `NotebookEdit`, `RemoteTrigger`, `SendMessage`, `TaskStop`, `WebFetch`, and `WebSearch`.
A deferred tool costs nothing, apart from its name, until `ToolSearch` loads it.
In the default session the deferred tools would add 10,350 tokens.

`Skill` brings the skills listing. It is 2,093 tokens for the built-in skills:

| Skill | Tokens |
| --- | --- |
| `dataviz` | 482 |
| `claude-api` | 361 |
| `update-config` | 236 |
| `code-review` | 214 |
| `schedule` | 127 |
| `run` | 123 |
| `loop` | 115 |
| `plugin-authoring` | 89 |
| `workflow-authoring` | 84 |
| `keybindings-help` | 83 |
| `fewer-permission-prompts` | 64 |
| `simplify` | 63 |
| `security-review` | 30 |
| `init` | 22 |

## What Else Changes the Budget

Each row is a session after "hi" on Opus 5.5, compared to the default of 15,768.

| Variant | Total | Change | Why |
| --- | --- | --- | --- |
| Default | 15,768 | 0 | |
| `--tools "Read,Edit,Bash"` | 5,093 | -10,675 | Tools drop to 2,500 and there is no skills listing. |
| `--tools ""` | 2,297 | -13,471 | No tools. The system prompt is 1,962. |
| `ENABLE_TOOL_SEARCH=false` | 27,667 | +11,899 | All tools load, 20,497 in all. Nothing is deferred. |
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` | 15,001 | -767 | The system prompt drops from 2,030 to 1,255. |
| `CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS=1` | 15,433 | -335 | The agent list is shorter. |
| `includeGitInstructions: false` | 15,411 | -357 | The `Bash` text is shorter, and so are the messages. |
| Git repo with one commit | 15,945 | +177 | A git status goes into the messages. |
| `CLAUDE.md` of 60 short lines (about 3.5 KB) | 17,310 | +1,542 | Memory files take 1,387. |
| `outputStyle` set to `Explanatory` | 16,102 | +334 | The style text is added. |
| One custom agent file with a one-line description | 15,810 | +42 | Custom agents take 38. |
| One MCP server (filesystem, 14 tools) | 15,949 | +181 | Its tools are deferred (2,753) until a search loads them. |
| Sonnet 5.5 | 15,774 | +6 | |
| Haiku 5.5 | 16,552 | +784 | The system prompt is 2,817. |

Messages vary by a few tokens between runs, because the reply to "hi" differs.
We could not measure `--disable-slash-commands`, because it also turns off `/context`.

## Best Practices

### Keep Tool Search On

Tool search defers rarely used tools. Turning it off added 11,899 tokens.
Leave `ENABLE_TOOL_SEARCH` unset unless you have a reason.

### Trim Tools for Narrow Jobs

A headless job or a narrow agent rarely needs every tool.
`--tools "Read,Edit,Bash"` cut the session from 15,768 to 5,093 tokens, and also removed the skills listing.

```bash
claude -p "Fix the typo in README.md" --tools "Read,Edit"
```

To remove single tools, deny them. `permissions.deny` and `--disallowedTools` both take a tool out of the context.
Denying `Workflow` and `ScheduleWakeup`, which cost the most and are often unused, took the empty session from 12,114 to about 8,440 tokens.
See [Permissions](https://xsyetopz.github.io/claude-code-docs/configure/permissions.md).

```json title=".claude/settings.json"
{
  "permissions": {
    "deny": ["Workflow", "ScheduleWakeup"]
  }
}
```

Denying a deferred tool such as `WebSearch` only shrinks the deferred pool (10,350 to 10,239). It does not change the total.

Do not deny tools that are part of the loading machinery:

- Denying `ToolSearch` loads every deferred tool: +12,451.
- Denying `Skill` raised the total by 5,574. The `workflow-authoring` reference moves into the `Workflow` text. Denying both `Skill` and `Workflow` gives 9,446, which saves 2,668.
- Denying `Bash` raised the total by 409. The program adds `Glob` and `Grep` in its place.

### Keep `CLAUDE.md` Short

Claude Code sends your memory files on every turn.
A `CLAUDE.md` of 60 short lines cost about 1,400 tokens of memory files (1,387), and 1,542 in total with the extra message text.
Keep only rules the model needs in every session.

### Put Rare Instructions in Skills or Subagents

Only the description of a skill is listed. The body loads when the skill runs.
Move a long, rarely needed procedure out of `CLAUDE.md` into a skill, or into a subagent that has its own context.

### Keep MCP Descriptions Short

MCP tools are deferred, so one server with 14 tools added only 181 tokens at the start.
The 2,753 tokens of schemas arrive when a search loads them, so keep tool descriptions short.

### Turn Off Text You Do Not Use

Each switch below removes a block of the start. Use one only if you do not need that feature.

| Switch | Saves | You lose |
| --- | --- | --- |
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` | 767 | Auto memory |
| `includeGitInstructions: false` | 357 | Commit and PR rules in the `Bash` text |
| `CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS=1` | 335 | The `Explore` and `Plan` agents |

```json title="~/.claude/settings.json"
{
  "includeGitInstructions": false,
  "env": {
    "CLAUDE_CODE_DISABLE_AUTO_MEMORY": "1",
    "CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS": "1"
  }
}
```

See [Overriding Prompts](https://xsyetopz.github.io/claude-code-docs/prompts/override.md) for each switch.

### Watch Custom Agent Descriptions

One custom agent with a one-line description added 42 tokens.
That is cheap, but the descriptions add up.
Claude Code warns when the descriptions of all non-built-in agents pass 15,000 tokens.
See [Subagents](https://xsyetopz.github.io/claude-code-docs/extend/subagents.md).

### Keep the Start Stable for the Cache

The start of the request (tools, system prompt, memory) is cached.
This follows from the prefix model on the request page. We did not measure it.
Changing it, for example by switching tools or editing `CLAUDE.md` mid-session, makes the API read it again.
See [Request and Cache](https://xsyetopz.github.io/claude-code-docs/how-it-works/request-and-cache.md).

## Related Pages

- [Context and Compaction](https://xsyetopz.github.io/claude-code-docs/how-it-works/context-and-compaction.md)
- [Request and Cache](https://xsyetopz.github.io/claude-code-docs/how-it-works/request-and-cache.md)
- [System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md)
- [Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md)
