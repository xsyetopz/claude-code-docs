---
title: Gated and Surface-Specific Tools
description: Tools that appear only behind a gate, a plan, or a session mode, plus StructuredOutput, WaitForMcpServers, and the MCP resource tools.
sidebar_position: 5
---

These tools appear only when a gate, a plan, or a session mode turns them on.
Most of them serve onboarding, design work, connectors, or self-hosted runners.
For example, `PushNotification` sends a notice to your terminal when a long task ends.
For most of them a server-side flag decides, so you cannot switch them on yourself.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | Only if your account, plan, or session mode has the gate on. |
| Can you change it? | Rarely. A few have an env var or setting, such as `CLAUDE_CODE_SKILL_PROPOSALS`. |
| Can you turn it on or off? | Mostly no. A hidden server-side flag decides. |
| Where does it live? | Built into the program. |
| Status | <Documented /> <Undocumented /> <Gated note="hidden server-side flags" /> |

## Gated Tools

All of these are available in the main session only, and background subagents do not keep them, unless the Notes column says otherwise.
The Yes and No columns are explained on [Tools](index.md#how-to-read-the-tool-tables).
Source: [Tools Reference](https://code.claude.com/docs/en/tools-reference) for the tools marked as documented, and the program (the tool definitions and their `searchHint` text) for the rest.

| Tool | Status | What It Does | Parameters and Gate | Read-Only | Parallel | Deferred |
| --- | --- | --- | --- | --- | --- | --- |
| `ReadNotifications` | <Undocumented /> <Gated note="hidden server-side flag" /> | Reads queued external notifications (webhooks, triggers). | No parameters. | Yes | Yes | No |
| `ShareOnboardingGuide` | <Documented /> <Gated note="hidden server-side flag" /> | Uploads `ONBOARDING.md` and returns a team share link. | `mode` (`check`, `update`, `create`, `delete`, default `check`), `short_code` (string, optional). | No | No | No |
| `ShowOnboardingRolePicker` | <Undocumented /> <Gated note="hidden server-side flag" /> | Shows the Cowork onboarding role picker. | No parameters. | No | No | No |
| `OfferChromeSetup` | <Undocumented /> <Gated note="hidden server-side flag" /> | Offers Claude in Chrome setup. | `reason` (string, max 200, optional). | No | No | Yes |
| `SendUserMessage` | <Undocumented /> <Gated note="hidden server-side flag" /> | Sends a message to the user (brief or assistant mode). | `message` (string, required, markdown), `attachments` (paths or file objects, optional), `status` (`normal` or `proactive`). Has an alias. | Yes | No | No |
| `SendFeedback` | <Documented /> <Gated note="hidden server-side flag" /> | Drafts product or model-behavior feedback. | `type` (enum), `title` (string, required), `details` (string, required), `area`, `failure_mode`, `task_category` (optional). | No | No | No |
| `SuggestPluginInstall` | <Undocumented /> <Gated note="hidden server-side flag" /> | Renders a plugin install card. | `contextLabel` (string, max 128), `plugins` (1 to 16), `trigger`. | No | No | Runtime check |
| `SuggestSkills` | <Undocumented /> <Gated note="hidden server-side flag" /> | Renders addable claude.ai skills by keyword. | `keywords` (1 to 8 strings, required), `contextLabel`, `trigger`. | No | No | Runtime check |
| `FetchInboxMessage` | <Undocumented /> <Gated note="hidden server-side flag" /> | Reads a relayed inbox message from a linked thread. | `file_id` (string, required). | Yes | No | Yes |
| `PublishPlugin` | <Undocumented /> <Gated note="hidden server-side flag" /> | Publishes a plugin or mod to the organization library. | `path` (string, required), `destination` (`organization`), `description`, `replace` (boolean), `shown`, `question`. | No | No | Yes |
| `Artifact` | <Documented /> <Gated note="enableArtifact setting in the old page" /> | Renders an HTML file to a claude.ai web page. | The saved sub-agents docs list `Artifact` among the tools a background subagent keeps. | No | No | No |
| `AppifactRepl` | <Undocumented /> <Gated note="hidden server-side flag" /> | Runs appifact SDK JavaScript against an artifact. | `skill`, `artifact` (strings, optional), `code` (string, required). | No | No | No |
| `SendFile` | <Undocumented /> <Gated note="hidden server-side flag" /> | Sends files to another Claude Code session. | `to` (string, required), `files` (string array, 1 up to a maximum), `message` (optional). | No | No | Yes |
| `Poll` | <Documented /> <Gated note="hidden server-side flag" /> | Waits for and receives queued harness events. | No parameters. | Yes | No | No |
| `PushNotification` | <Documented /> <Gated note="hidden server-side flag" /> | Sends a notification to the terminal and optionally to mobile. | `message` (string, required, under 200 characters), `status` (`proactive`). Also an entry-point rule for `remote_trigger`. | No | No | Yes |
| `DesignSync` | <Undocumented /> <Gated note="hidden server-side flag" /> | Syncs local design system components to a claude.ai/design project. | `method`, `projectId`, `path`, `writes`, `deletes`, `planId`, `files`, `paths`, `name`, `assets`, `localDir`. | No | No | Yes |
| `ClaudeDesign` | <Undocumented /> <Gated note="hidden server-side flag" /> | Works with Claude Design projects. | `operation`, `arguments` (object, default `{}`). | No | No | No |
| `Projects` | <Undocumented /> <Gated note="allow_projects_tool policy and an attached project" /> | Reads and writes the attached claude.ai project. | `method` union, with method-specific fields. | No | No | No |
| `EndConversation` | <Documented /> <Gated note="hidden server-side flag" /> | Ends the conversation (abuse, or on request). | No parameters. Removed from subagents. | Yes | No | Yes |
| `RemoteTrigger` | <Documented /> <Gated note="first-party login, allow_remote_sessions policy, not CLAUDE_CODE_REMOTE" /> | Manages scheduled cloud agent routines. | `action`, `trigger_id`, `session_id`, `cursor`, `body`. | No | No | Yes |
| `SearchMcpRegistry` | <Undocumented /> <Gated note="hidden server-side flag" /> | Finds MCP connectors by keyword. | `keywords` (1 to 8 strings). | No | No | Yes |
| `SuggestConnectors` | <Undocumented /> <Gated note="hidden server-side flag" /> | Resolves MCP connector payloads by `directoryUuid`. | `uuids` (1 to 32 strings). | No | No | Runtime check |
| `ListConnectors` | <Undocumented /> <Gated note="hidden server-side flag" /> | Lists installed MCP connectors. | `keywords` (optional filter). | No | No | Yes |
| `SendUserFile` | <Documented /> <Gated note="hidden server-side flag" /> | Delivers files to the user. | `files` (string array), `caption`, `status` (`normal` or `proactive`), `display` (`render` or `attach`). | No | No | Runtime check |
| `propose_skills` | <Undocumented /> <Gated note="CLAUDE_CODE_SKILL_PROPOSALS or a remote entry point" /> | Proposes skills from recurring procedures. | `proposals`: an array of objects with `name`, `kind` (`new` or `improvement`), `target`, `description`, `evidence`, `skillMd`. | No | No | No |

## Self-Hosted Runner Tools

These nine tools exist only in self-hosted runner sessions. All are <Undocumented /> and <Gated note="self-hosted runner mode" />. All are deferred.

| Tool | What It Does | Read-Only | Parallel |
| --- | --- | --- | --- |
| `self_hosted_runner_get_pool` | Reads self-hosted environment aggregates and queue counts. | Yes | Yes |
| `self_hosted_runner_list_sessions` | Lists queued and assigned sessions in a self-hosted environment. | Yes | Yes |
| `self_hosted_runner_list_runners` | Lists registered self-hosted runners for an environment. | Yes | Yes |
| `self_hosted_runner_list_secrets` | Lists self-hosted environment secrets (metadata only). | Yes | Yes |
| `self_hosted_runner_read_health` | Probes the local runner `/healthz` endpoint. | Yes | Yes |
| `self_hosted_runner_read_metrics` | Reads runner Prometheus gauges from `/metrics`. | Yes | Yes |
| `self_hosted_runner_requeue_session` | Requeues a stuck session onto another runner. | No | No |
| `self_hosted_runner_spawn_local` | Starts a local runner process for a try-out. | No | No |
| `self_hosted_runner_tail_log` | Tails the runner log file with secret redaction. | Yes | Yes |

## Tools without an Inventory Row

The inventory file does not list these tools, because their definitions do not use a plain `searchHint` text.

| Tool | Status | What It Does | How It Works | Available In | Read-Only | Parallel | Deferred |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `ToolSearch` | <Documented /> | Loads the schema of deferred tools. | See [ToolSearch](index.md#toolsearch). | Main session and subagents. | No | No | No |
| `WaitForMcpServers` | <Documented /> <Gated note="used when tool search is off" /> | Waits for pending MCP servers. | Removed from subagents. | Main session. | No | No | No |
| `StructuredOutput` | <Undocumented /> | Returns the final JSON for `--json-schema` runs. | Never deferred. | Main session in print mode. | No | No | No |
| `ListMcpResourcesTool`, `ReadMcpResourceTool`, `ReadMcpResourceDirTool` | <Documented /> | List and read MCP resources. | Deferred. Offered when an MCP server has resources. | Main session. | Yes | Yes | Yes |

`Agent`, `Monitor`, `ScheduleWakeup`, `Workflow`, and `SubagentHandback` are on [Agents, Tasks, and Planning](agents-and-tasks.md) and [Shell, Web, and Background Tasks](shell-and-web.md).

## Example

Turn on skill proposals for one shell session.

```bash title="Enable propose_skills"
CLAUDE_CODE_SKILL_PROPOSALS=1 claude
```

## How It Works

A gated tool is built only when its gate passes. Gates are a login type, a policy, an entry point, an env var, or a server-side flag.
A tool with a server-side flag appears for some accounts and not for others, so the same version can show different tools.
Most of these tools are deferred, so Claude finds them with `ToolSearch` and not in the first tool list.

## Related Pages

- [Tools](index.md)
- [MCP](../../extend/mcp/index.md)
- [Tools Reference](https://code.claude.com/docs/en/tools-reference)
