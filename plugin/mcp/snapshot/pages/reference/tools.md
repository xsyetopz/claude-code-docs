---
title: "Tools"
description: "What a tool is, the flags every tool has, how tool search defers tools, and a map of the tool pages."
url: https://xsyetopz.github.io/claude-code-docs/reference/tools/
source: docs/reference/tools/index.md
---

# Tools


A tool is an action that Claude can take, such as reading a file or running a shell command.
Each tool has input fields and a few flags that tell Claude Code how to treat it.
For example, `Grep` is read-only and safe to run in parallel, so Claude Code can run many searches at once.
This page covers the shared rules. The other pages list every tool and every parameter.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | Partly. Claude calls tools for you. You allow, ask, or deny them with permission rules. |
| Can you change it? | ✅ Yes. Permission rules, subagent `tools` lists, and MCP servers change which tools Claude can use. |
| Can you turn it on or off? | `permissions.deny`, `ENABLE_TOOL_SEARCH`, and tool-specific env vars such as `CLAUDE_CODE_DISABLE_WEB_FETCH`. |
| Where does it live? | Built into the program. MCP tools come from servers you configure. |
| Status | [Documented] [Undocumented] [Differs] [Gated: many tools need a server-side flag] |

## Tool Pages

| Page | What It Covers |
| --- | --- |
| [Files, Search, and Memory](https://xsyetopz.github.io/claude-code-docs/reference/tools/files.md) | `Read`, `Write`, `Edit`, `NotebookEdit`, `Glob`, `Grep`, `LSP`, memory tools |
| [Shell, Web, and Background Tasks](https://xsyetopz.github.io/claude-code-docs/reference/tools/shell-and-web.md) | `Bash`, `PowerShell`, `Monitor`, `WebFetch`, `WebSearch`, `TaskStop`, `GetTask` |
| [Agents, Tasks, and Planning](https://xsyetopz.github.io/claude-code-docs/reference/tools/agents-and-tasks.md) | `Agent`, `SendMessage`, task tools, cron, `Workflow`, worktrees, plan mode, `AskUserQuestion` |
| [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md) | Onboarding, design, connectors, self-hosted runner, notifications, `StructuredOutput`, MCP resource tools |

## How to Read the Tool Tables

The inventory for `2.1.303` lists 70 tools. The program holds a few more, such as `Agent`, `Monitor`, `ToolSearch`, `ScheduleWakeup`, and `StructuredOutput`.
Each tool table has three Yes or No columns.

| Column | Yes Means | No Means |
| --- | --- | --- |
| Read-Only | The tool changes nothing, so Claude Code can skip some prompts for it. | The tool can change things, or the program sets no flag. |
| Parallel | Claude Code can run several calls of the tool at once. | Calls run one after the other, or the program sets no flag. |
| Deferred | The tool is not loaded at the start. Claude finds it with `ToolSearch` first. | The tool is loaded at the start. |

A tool with no flag in its definition shows No for Read-Only and Parallel.
`Bash` and `PowerShell` also show No for both, because the result depends on the command.

## Common Properties

Source: the program (the tool definitions).

| Property | Values | What It Means |
| --- | --- | --- |
| `backgrounding` | `never`, `self`, `detach` | `self` means the tool backgrounds itself (`Bash`, `PowerShell`, `Agent`). `detach` applies to `WebFetch` and `WebSearch`. |
| `maxResultSizeChars` | 100000 for most tools, 20000 for `Grep`, unbounded for `Read` | The largest result the tool sends back. |
| `strict` | true for `Write`, `Edit`, `Read`, `Grep`, `Bash`, `PowerShell`, `TodoWrite`, `ReportFindings` | The tool schema is strict. |
| MCP tool name | `mcp__<server>__<tool>` | How a tool from an MCP server is named. See [MCP](https://xsyetopz.github.io/claude-code-docs/extend/mcp.md). |

## ToolSearch

`ToolSearch` loads the full schema of a deferred tool, so that Claude can call it.
For example, the query `select:Read,Edit,Grep` fetches those three tools by name.
Source: [Tools Reference](https://code.claude.com/docs/en/tools-reference), [Create Custom Subagents](https://code.claude.com/docs/en/sub-agents), and the program.

| Item | Status | What It Does | How It Works |
| --- | --- | --- | --- |
| `ToolSearch` | [Documented] | Loads the full schema of deferred tools. | `query` (string, required) and `max_results` (int, optional, default 5). The result lists `matches`, `total_deferred_tools`, `pending_mcp_servers`, and `failed_mcp_servers`. Works in the main session and in subagents. |
| `max_results` | [Differs] | An old `2.1.296` capture showed it as required. | In `2.1.303` it is optional with the default `5`. |
| Query `select:A,B` | [Undocumented] | Fetches the named tools. | The prompt gives `select:Read,Edit,Grep`. A tool that is already loaded returns a note. |
| Query keywords | [Undocumented] | Searches by keyword and returns up to `max_results` matches. | The prompt gives `notebook jupyter`. |
| Query `+term rest` | [Undocumented] | Requires `term` in the tool name and ranks by the rest. | The prompt gives `+slack send`. |
| Pending MCP servers | [Documented] | A search can wait for MCP servers that are still connecting. | Name the server as `mcp__server` in the query. |
| Placeholder tool | [Undocumented] | A dummy tool keeps deferred loading active. | The text tells Claude never to call it. |
| Deny rule | [Documented] | `permissions.deny` with `ToolSearch` turns tool search off. | Claude then uses `WaitForMcpServers`. |
| Failed servers note | [Documented] | A no-match result names the servers that failed. | `failed_mcp_servers` carries `name`, `errorCode`, and `error`. |

## Deferral Rules

Claude Code checks these rules in order to decide if a tool is deferred.

1. A hook or a server-side override can set the state first.
2. A tool with `alwaysLoad` set to `true` is not deferred.
3. A tool in the never-defer set is not deferred.
   The set holds `ToolSearch`, `StructuredOutput`, `Agent` when fork mode is on, the brief tool, `EnterWorktree` in a `bg` session, and `PushNotification` for a `remote_trigger` entry point.
   A server-side list can add more built-in tools.
4. An MCP tool is deferred.
5. A tool in a server-side defer list is deferred.
6. Otherwise the `shouldDefer` value of the tool decides.

```mermaid
flowchart TD
  A[Tool offered] --> B{Hook or server override?}
  B -->|Yes| Z[Use that state]
  B -->|No| C{"<code>alwaysLoad</code> true?"}
  C -->|Yes| N[Not deferred]
  C -->|No| D{In never-defer set?}
  D -->|Yes| N
  D -->|No| E{MCP tool?}
  E -->|Yes| F[Deferred]
  E -->|No| G{In server defer list?}
  G -->|Yes| F
  G -->|No| H["Use <code>shouldDefer</code>"]
```

### Switches for Tool Search

Source: [Connect Claude Code to Tools via MCP](https://code.claude.com/docs/en/mcp) and [Environment Variables](https://code.claude.com/docs/en/env-vars). Set them in the shell or in `env` in settings.

| Item | Status | What It Does | How It Works |
| --- | --- | --- | --- |
| `ENABLE_TOOL_SEARCH` unset | [Documented] | MCP tools are deferred. | With a non-first-party `ANTHROPIC_BASE_URL` they load at the start. |
| `ENABLE_TOOL_SEARCH=true` | [Documented] | MCP tools stay deferred, also on a proxy host. | - |
| `ENABLE_TOOL_SEARCH=auto` and `auto:N` | [Documented] | Tools load at the start while their definitions fit in N percent of the window. | The default is 10. `auto:0` acts like `true`. `auto:100` acts like `false`. N stays between 0 and 100. |
| `ENABLE_TOOL_SEARCH=false` | [Documented] | Every MCP tool loads at the start. | - |
| `ENABLE_TOOL_SEARCH=force` | [Documented] [Gated: needs a first-party provider] | Forces tool search on, also when betas are off. | Needs a first-party provider. |
| `alwaysLoad` | [Documented] | Exempts a tool or a whole server from deferral. | Set it on the server in `.mcp.json` or plugin MCP config. An MCP tool sets it from `_meta` key `anthropic/alwaysLoad`. |
| Server-side never-defer list | [Undocumented] [Gated: hidden server-side flag] | Names built-in tools that must never be deferred. | The default is an empty list. You cannot set it. |
| Server-side defer list | [Undocumented] [Gated: hidden server-side flag] | Defers `ReportFindings`, `Workflow`, and `ShareOnboardingGuide`. | You cannot set it. |

### Which Built-In Tools Are Deferred

- Deferred: `WebFetch`, `WebSearch`, `NotebookEdit`, `TodoWrite`, `LSP`, `Monitor`, `EnterPlanMode`, `ExitPlanMode`, `EnterWorktree`, `ExitWorktree`, `TaskCreate`, `TaskGet`, `TaskUpdate`, `TaskList`, `TaskStop`, `SendMessage`, `SendFile`, `CronCreate`, `CronDelete`, `CronList`, `PushNotification`, `RemoteTrigger`, `EndConversation`, `ProposeGoal`, `FetchInboxMessage`, `PublishPlugin`, `OfferChromeSetup`, `DesignSync`, `SearchMcpRegistry`, `SuggestConnectors`, `ListConnectors`, the three MCP resource tools, and the nine self-hosted runner tools.
- A runtime check decides: `SuggestPluginInstall`, `SuggestSkills`, `SendUserFile`.
- Not deferred: `Read`, `Write`, `Edit`, `Glob`, `Grep`, `Bash`, `PowerShell`, `Agent`, `Skill`, `AskUserQuestion`, `ListAgents`, `Workflow`, `ReportFindings`, `ToolSearch`, `StructuredOutput`, `SubagentHandback`, `ScheduleWakeup`, `memory_*`, and the rest of the gated tools.
- The old capture of `2.1.296` lacked `Glob` and `Grep`. In `2.1.303` they are not deferred.

## Example

Hide web tools from Claude, and keep MCP tools loaded at the start when they are small.

```json title=".claude/settings.json"
{
  "permissions": {
    "deny": ["WebFetch", "WebSearch"]
  },
  "env": {
    "ENABLE_TOOL_SEARCH": "auto:10"
  }
}
```

## How It Works

Claude Code builds the tool list for each request. A deferred tool appears only as a name, so the request stays small.
When Claude needs a deferred tool, it calls `ToolSearch`. Claude Code then loads the full schema, and Claude calls the tool.
Permission rules run when a tool is called, not when it is listed.

## Related Pages

- [Tools Reference](https://code.claude.com/docs/en/tools-reference) is the official page for the built-in tools.
- [Permission Rules](https://xsyetopz.github.io/claude-code-docs/configure/permissions/rules.md) explains allow, ask, and deny rules for tools.
- [MCP](https://xsyetopz.github.io/claude-code-docs/extend/mcp.md) covers tools that MCP servers add.
- [Subagents](https://xsyetopz.github.io/claude-code-docs/extend/subagents.md) covers the tools that a subagent keeps.
- [Environment Variables for Tools and Bash](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/tools-and-bash.md)
