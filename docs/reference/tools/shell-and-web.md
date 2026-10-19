---
title: Shell, Web, and Background Tasks
description: Every parameter of Bash, PowerShell, Monitor, WebFetch, WebSearch, TaskStop, and GetTask.
sidebar_position: 3
---

These tools run shell commands, fetch web pages, search the web, and manage background tasks.
They reach outside the project, so permission rules and the sandbox matter most for them.
For example, `Bash` with `run_in_background` set to `true` starts a long command and returns at once.
The Yes and No columns are explained on [Tools](index.md#how-to-read-the-tool-tables).

You approve or deny each call by rule or by prompt. The switches are `CLAUDE_CODE_USE_POWERSHELL_TOOL`, `CLAUDE_CODE_DISABLE_WEB_FETCH=1`, `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1`, or a deny rule. PowerShell, the WebFetch switch, and GetTask are gated.

## Tools

Source: [Tools Reference](https://code.claude.com/docs/en/tools-reference), [Configure Permissions](https://code.claude.com/docs/en/permissions), [Create Custom Subagents](https://code.claude.com/docs/en/sub-agents), and the program.

| Tool | Status | What It Does | How It Works | Available In | Read-Only | Parallel | Deferred |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `Bash` | <Documented /> | Runs a shell command. | See [Bash Parameters](#bash-parameters). | Main session and subagents. Kept in background subagents. | ❌ | ❌ | ❌ |
| `PowerShell` | <Documented /> <Gated note="CLAUDE_CODE_USE_POWERSHELL_TOOL" /> | Runs a Windows PowerShell command. | Same parameters as `Bash`, but `command` is a PowerShell command and `description` has a shorter text. | Main session and subagents. Kept in background subagents. | ❌ | ❌ | ❌ |
| `Monitor` | <Documented /> | Streams the output of a background command or a WebSocket as notifications. | See [Monitor Parameters](#monitor-parameters). | Main session and subagents. Kept in background subagents. | ❌ | ✅ | ✅ |
| `WebFetch` | <Documented /> <Gated note="CLAUDE_CODE_DISABLE_WEB_FETCH=1 turns it off" /> | Fetches a URL and applies a prompt to the page text. | `url` (URL string, required), `prompt` (string, required), `offset` (int, 0 or more, optional, character offset for a long page). The off switch needs `2.1.285` or later. | Main session and subagents. Kept in background subagents. | ✅ | ✅ | ✅ |
| `WebSearch` | <Documented /> <Gated note="off for the gateway provider; Vertex depends on the model" /> | Searches the web. | `query` (string, at least 2 characters, required), `allowed_domains` (string array, optional), `blocked_domains` (string array, optional). | Main session and subagents. Kept in background subagents. | ✅ | ✅ | ✅ |
| `TaskStop` | <Documented /> | Stops a running background task. | `task_id` (string, optional; also takes a teammate or named background agent by ID or name), `shell_id` (string, optional, deprecated). | Main session and subagents. Kept in background subagents. | ❌ | ✅ | ✅ |
| `GetTask` | <Undocumented /> <Gated note="hidden server-side flag" /> | Checks a background shell command by task ID. | `taskId` (string, required). | ❓ | ✅ | ✅ | ❌ |

## Bash Parameters

| Parameter | What It Does | Required |
| --- | --- | --- |
| `command` | The shell command to run. | ✅ |
| `timeout` | Time limit in milliseconds for a foreground command. | ❌ |
| `description` | A short note on what the command does. | ❌ |
| `run_in_background` | Starts the command as a background task and returns at once. | ❌ |
| `dangerouslyDisableSandbox` | Runs the command without the sandbox. | ❌ |
| `allowed_domains` | Network hosts that this command may reach. Offered only when the sandbox network lists are on. | ❌ |
| `machine` | Name of an attached machine to run the call on. Offered only when machines are attached. | ❌ |

`PowerShell` takes the same parameters, except that it has no `allowed_domains` unless the network lists are on.
Source: the program (the `Bash` input schema).

## Monitor Parameters

| Parameter | What It Does | Required |
| --- | --- | --- |
| `description` | Short note on what is watched, shown in notifications. | ✅ |
| `command` | Shell command whose output lines become notifications. | ❌ |
| `ws` | WebSocket target to stream. Give exactly one of `command` or `ws`. | ❌ |
| `timeout_ms` | Kills the monitor after this time. At least 1000, with a default and a cap. | ❌ |
| `persistent` | Runs until `TaskStop` or the end of the session, with no timeout. | ❌ |
| `allowed_domains` | Network hosts for a `command` monitor, offered only when the sandbox network lists are on. | ❌ |

Source: the program (the `Monitor` input schema).

## Example

Turn on the PowerShell tool and turn off web fetching for one project.

```json title=".claude/settings.json"
{
  "env": {
    "CLAUDE_CODE_USE_POWERSHELL_TOOL": "1",
    "CLAUDE_CODE_DISABLE_WEB_FETCH": "1"
  }
}
```

## How It Works

- Background subagents keep `Bash`, `PowerShell`, `Monitor`, `TaskStop`, `WebFetch`, and `WebSearch`. See [Create Custom Subagents](https://code.claude.com/docs/en/sub-agents).
- `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1` also disables auto-backgrounding and the `Ctrl+B` key ([Environment Variables](https://code.claude.com/docs/en/env-vars)).
- A true value for `CLAUDE_AUTO_BACKGROUND_TASKS` gives the `Agent` tool a 120000 ms auto-background time. Source: the program (the env name). It is not in the saved docs, so it is <Undocumented />.

## Related Pages

- [Tools](index.md)
- [Permission Rules](../../configure/permissions/rules.md)
- [Sandbox](../../configure/permissions/sandbox.md)
- [Tools Reference](https://code.claude.com/docs/en/tools-reference)
