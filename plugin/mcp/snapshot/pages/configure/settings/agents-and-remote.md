---
title: "Agents and Remote Settings"
description: "Keys for subagents, workflows, background work, Remote Control, push notifications, and peer sessions."
url: https://xsyetopz.github.io/claude-code-docs/configure/settings/agents-and-remote
source: docs/configure/settings/agents-and-remote.md
---

# Agents and Remote Settings


These keys control subagents, workflows, background work, and Remote Control.
Use them to start a session as a named agent or to turn off a feature you do not want.
Rows marked as undocumented can change in any release.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | ✅ Yes. |
| Can you change it? | Edit a settings file. |
| Can you turn it on or off? | `disableRemoteControl`, `disableAgentView`, and `disableWorkflows` turn features off. |
| Where does it live? | `~/.claude/settings.json`, `.claude/settings.json`, `.claude/settings.local.json`, or managed settings |
| Status | [Documented] [Undocumented] |

## Keys

Source: [Settings Reference](https://code.claude.com/docs/en/settings-reference) for rows marked [Documented]. For rows marked [Undocumented], Source: the program (its bundled settings schema).
Where to Set It tells you which files may set the key. See [Settings Files and Scopes](https://xsyetopz.github.io/claude-code-docs/configure/settings.md#where-settings-live).

| Key | Status | Type | Default | What It Does | Where to Set It |
| --- | --- | --- | --- | --- | --- |
| `agent` | [Documented] | string | - | Start every session as a named subagent with its prompt, tools, and model. | Any settings file |
| `agentPushNotifEnabled` | [Documented] | boolean | - | Let Claude send a push notification to your phone when it decides to. | Any settings file |
| `askUserQuestionTimeout` | [Documented] | enum: `60s`, `5m`, `10m`, `never` | `never` | Let an unanswered question auto-continue after idle time. Auto-continue runs only when you set `60s`, `5m`, or `10m`. | User or managed settings |
| `autoContinueAtUsageLimit` | [Documented] | boolean | - | Wait in the open session and continue the task automatically after a claude.ai usage limit resets. | User or managed settings |
| `autoUploadSessions` | [Undocumented] | boolean | - | Mirror local sessions to claude.ai as view-only, with no remote control. | Settings files |
| `crossSessionInbound` | [Documented] | string | - | Choose what happens to messages from your other sessions. `accept` delivers, `hold` parks them for review, `refuse` opts out. | Any settings file |
| `daemonColdStart` | [Undocumented] | enum: `transient`, `ask` | - | Choose what happens when no background service runs: `transient` starts one for this login session, and `ask` offers a permanent install. | Settings files |
| `dialogExpiry` | [Documented] | enum: `60s`, `5m`, `10m`, `never` | `5m` | Set how long Claude Code waits for Remote Control or an SDK host to answer a forwarded dialog before it cancels the dialog. `never` removes the deadline. `CLAUDE_CODE_USER_DIALOG_TIMEOUT_MS` wins. | User or managed settings |
| `disableAgentView` | [Documented] | boolean | - | Turn off background agents and agent view. Matches `CLAUDE_CODE_DISABLE_AGENT_VIEW=1`. | Any settings file |
| `disableRemoteControl` | [Documented] | boolean | - | Turn off Remote Control everywhere it can start. | Any settings file |
| `disableWorkflows` | [Documented] | boolean | - | Turn dynamic workflows off for everyone, and use `enableWorkflows` for yourself. Code Review on pull requests and `/ultrareview` run in the cloud and stay on. | Any settings file |
| `doneMeansMerged` | [Undocumented] | boolean | - | Keep Claude working until the pull request is ready to merge, a timer is set to resume, or it hands you a self-contained next step. | Settings files |
| `enableWorkflows` | [Documented] | boolean | - | Turn dynamic workflows on or off against your plan's default. | Any settings file |
| `inputNeededNotifEnabled` | [Documented] | boolean | - | Get a push notification when Claude is waiting on you. | Any settings file |
| `isolatePeerMachines` | [Documented] | boolean | - | Ask you before Claude messages one of your sessions on another machine. | Any settings file |
| `modelProposedGoals` | [Undocumented] | string | `auto` | Control whether the model may propose session goals. `auto` (the default), `alwaysAsk`, or `disabled`. Project and local settings are ignored. | Settings files |
| `processWrapper` | [Documented] | string | - | Run Claude Code's background processes through a corporate launcher on macOS and Linux. Same as `CLAUDE_CODE_PROCESS_WRAPPER`, which wins. Project and local files are ignored. | User or managed settings |
| `remote` | [Documented] | object | - | Configure cloud sessions. | Any settings file |
| `remoteControl` | [Undocumented] | object | - | Set options for `claude remote-control`. | Settings files |
| `remoteControlAtStartup` | [Documented] | boolean | - | Connect Remote Control automatically when a session starts. | Any settings file |
| `remoteTools` | [Undocumented] | object | - | Choose how this computer serves tool calls to cloud sessions. | Settings files |
| `skipWorkflowUsageWarning` | [Undocumented] | boolean | - | Record that you accepted the multi-agent workflow usage warning. Until set, auto mode asks before it runs a workflow. | Settings files |
| `sshConfigs` | [Documented] | array of object | - | Add SSH connections to the Desktop environment dropdown. | User or managed settings |
| `subagentStatusLine` | [Documented] | object | - | Rewrite rows in the subagent task display with your own command. | Any settings file |
| `teammateMode` | [Documented] | string | - | Choose how agent team teammates display. | Any settings file |
| `ultracode` | [Documented] | boolean | - | Have Claude plan a workflow for each substantive task without being asked. Lasts one session. Needs workflows on and a model that supports it. | Any settings file |
| `workflowKeywordTriggerEnabled` | [Documented] | boolean | `true` | Let the word `ultracode` in a prompt start a workflow, and set `false` to type it without starting one. | Any settings file |
| `workflowSizeGuideline` | [Documented] | enum: `unrestricted`, `small`, `medium`, `large` | `medium` | Set the agent count Claude aims for in dynamic workflows. `small` aims for fewer than 5 agents, `medium` fewer than 10, `large` fewer than 50. This is a hint, not a limit. | Any settings file |

## Example

### Turn Off Remote Control for Everyone

An administrator puts this in the managed settings file. Remote Control and agent view stay off on that machine.

```json title="managed-settings.json"
{
  "disableRemoteControl": true,
  "disableAgentView": true
}
```

## Related Pages

- [Settings Files and Scopes](https://xsyetopz.github.io/claude-code-docs/configure/settings.md) explains the scopes, precedence, and managed settings.
- [Settings Reference](https://code.claude.com/docs/en/settings-reference) is the official page for each key.
- [Subagents](https://xsyetopz.github.io/claude-code-docs/extend/subagents.md) covers custom agents.
- [Remote Control](https://code.claude.com/docs/en/remote-control) is the official page for that feature.
- [Agents and Teams Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/agents-and-teams.md) and [Remote and Cloud Session Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/remote-and-cloud-sessions.md) list the matching variables.
