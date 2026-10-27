---
title: Gated and Surface-Specific Tools
description: Tools that appear only behind a gate, a plan, or a session mode, plus StructuredOutput, WaitForMcpServers, and the MCP resource tools.
sidebar_position: 5
---

These tools appear only when a gate, a plan, or a session mode turns them on.
Most of them serve onboarding, design work, connectors, or self-hosted runners.
For example, `PushNotification` sends a notice to your terminal when a long task ends.
For most of them a server-side flag decides, so you cannot switch them on yourself.

These tools work only if your account, plan, or session mode has the gate on. A hidden server-side flag decides, with few exceptions. A few have an env var or setting, such as `CLAUDE_CODE_SKILL_PROPOSALS`.

## Gated Tools

All of these are available in the main session only, and background subagents do not keep them, unless the Notes column says otherwise.
The Yes and No columns are explained on [Tools](index.md#how-to-read-the-tool-tables).
Source: [Tools Reference](https://code.claude.com/docs/en/tools-reference) for the tools marked as documented, and the program (the tool definitions and their `searchHint` text) for the rest.

| Tool | Status | What It Does | Parameters and Gate | Read-Only | Parallel | Deferred |
| --- | --- | --- | --- | --- | --- | --- |
| `ReadNotifications` | <Undocumented /> <Gated note="hidden server-side flag" /> | Reads queued external notifications (webhooks, triggers). | No parameters. | ✅ | ✅ | ❌ |
| `ShareOnboardingGuide` | <Documented /> <Gated note="hidden server-side flag" /> | Uploads `ONBOARDING.md` and returns a team share link. | `mode` (`check`, `update`, `create`, `delete`, default `check`), `short_code` (string, optional). | ❌ | ❌ | ❌ |
| `ShowOnboardingRolePicker` | <Undocumented /> <Gated note="hidden server-side flag" /> | Shows the Cowork onboarding role picker. | No parameters. | ❌ | ❌ | ❌ |
| `OfferChromeSetup` | <Undocumented /> <Gated note="hidden server-side flag" /> | Offers Claude in Chrome setup. | `reason` (string, max 200, optional). | ❌ | ❌ | ✅ |
| `SendUserMessage` | <Undocumented /> <Gated note="hidden server-side flag" /> | Sends a message to the user (brief or assistant mode). | `message` (string, required, markdown), `attachments` (paths or file objects, optional), `status` (`normal` or `proactive`). Has an alias. | ✅ | ❌ | ❌ |
| `SendFeedback` | <Documented /> <Gated note="hidden server-side flag" /> | Drafts product or model-behavior feedback. | `type` (enum), `title` (string, required), `details` (string, required), `area`, `failure_mode`, `task_category` (optional). | ❌ | ❌ | ❌ |
| `SuggestPluginInstall` | <Undocumented /> <Gated note="hidden server-side flag" /> | Renders a plugin install card. | `contextLabel` (string, max 128), `plugins` (1 to 16), `trigger`. | ❌ | ❌ | Runtime check |
| `SuggestSkills` | <Undocumented /> <Gated note="hidden server-side flag" /> | Renders addable claude.ai skills by keyword. | `keywords` (1 to 8 strings, required), `contextLabel`, `trigger`. | ❌ | ❌ | Runtime check |
| `FetchInboxMessage` | <Undocumented /> <Gated note="hidden server-side flag" /> | Reads a relayed inbox message from a linked thread. | `file_id` (string, required). | ✅ | ❌ | ✅ |
| `PublishPlugin` | <Undocumented /> <Gated note="hidden server-side flag" /> | Publishes a plugin or mod to the organization library. | `path` (string, required), `destination` (`organization`), `description`, `replace` (boolean), `shown`, `question`. | ❌ | ❌ | ✅ |
| `Artifact` | <Documented /> <Gated note="enableArtifact setting in the old page" /> | Renders an HTML file to a claude.ai web page. | The saved sub-agents docs list `Artifact` among the tools a background subagent keeps. | ❌ | ❌ | ❌ |
| `AppifactRepl` | <Undocumented /> <Gated note="hidden server-side flag" /> | Runs appifact SDK JavaScript against an artifact. | `skill`, `artifact` (strings, optional), `code` (string, required). | ❌ | ❌ | ❌ |
| `SendFile` | <Undocumented /> <Gated note="hidden server-side flag" /> | Sends files to another Claude Code session. | `to` (string, required), `files` (string array, 1 up to a maximum), `message` (optional). | ❌ | ❌ | ✅ |
| `Poll` | <Documented /> <Gated note="hidden server-side flag" /> | Waits for and receives queued harness events. | No parameters. | ✅ | ❌ | ❌ |
| `PushNotification` | <Documented /> <Gated note="hidden server-side flag" /> | Sends a notification to the terminal and optionally to mobile. | `message` (string, required, under 200 characters), `status` (`proactive`). Also an entry-point rule for `remote_trigger`. | ❌ | ❌ | ✅ |
| `DesignSync` | <Undocumented /> <Gated note="hidden server-side flag" /> | Syncs local design system components to a claude.ai/design project. | `method`, `projectId`, `path`, `writes`, `deletes`, `planId`, `files`, `paths`, `name`, `assets`, `localDir`. | ❌ | ❌ | ✅ |
| `ClaudeDesign` | <Undocumented /> <Gated note="hidden server-side flag" /> | Works with Claude Design projects. | `operation`, `arguments` (object, default `{}`). | ❌ | ❌ | ❌ |
| `Projects` | <Undocumented /> <Gated note="allow_projects_tool policy and an attached project" /> | Reads and writes the attached claude.ai project. | `method` union, with method-specific fields. | ❌ | ❌ | ❌ |
| `EndConversation` | <Documented /> <Gated note="hidden server-side flag" /> | Ends the conversation (abuse, or on request). | No parameters. Removed from subagents. | ✅ | ❌ | ✅ |
| `RemoteTrigger` | <Documented /> <Gated note="first-party login, allow_remote_sessions policy, not CLAUDE_CODE_REMOTE" /> | Manages scheduled cloud agent routines. | `action`, `trigger_id`, `session_id`, `cursor`, `body`. | ❌ | ❌ | ✅ |
| `SearchMcpRegistry` | <Undocumented /> <Gated note="hidden server-side flag" /> | Finds MCP connectors by keyword. | `keywords` (1 to 8 strings). | ❌ | ❌ | ✅ |
| `SuggestConnectors` | <Undocumented /> <Gated note="hidden server-side flag" /> | Resolves MCP connector payloads by `directoryUuid`. | `uuids` (1 to 32 strings). | ❌ | ❌ | Runtime check |
| `ListConnectors` | <Undocumented /> <Gated note="hidden server-side flag" /> | Lists installed MCP connectors. | `keywords` (optional filter). | ❌ | ❌ | ✅ |
| `SendUserFile` | <Documented /> <Gated note="hidden server-side flag" /> | Delivers files to the user. | `files` (string array), `caption`, `status` (`normal` or `proactive`), `display` (`render` or `attach`). | ❌ | ❌ | Runtime check |
| `propose_skills` | <Undocumented /> <Gated note="CLAUDE_CODE_SKILL_PROPOSALS or a remote entry point" /> | Proposes skills from recurring procedures. It needs a remote environment (`CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE` set). Since `2.1.310`, a host launch with no disk also works when both `CLAUDE_CODE_SKILL_PROPOSALS` and `CLAUDE_CODE_SYNC_SKILLS` are set (the program). | `proposals`: an array of objects with `name`, `kind` (`new` or `improvement`), `target`, `description`, `evidence`, `skillMd`. | ❌ | ❌ | ❌ |

## Plugin, Skill, and Browser Tools

Source: the program (the tool names and the input schemas in [`claude-code-tools.json`](../schemas.md)). The program does not show a gate for these tools, except where the table gives one, and it does not show their read-only, parallel, or deferred flags here.

| Tool | Status | What It Does | Parameters and Gate |
| --- | --- | --- | --- |
| `ListPlugins` | <Undocumented /> | Lists plugins. | `keywords` (up to 8 strings, optional filter; omit to list everything). Gate not confirmed. |
| `ListSkills` | <Undocumented /> | Lists skills. | `keywords` (up to 8 strings, optional filter; omit to list everything). Gate not confirmed. |
| `SearchPlugins` | <Undocumented /> | Searches plugins by keyword. | `keywords` (1 to 8 strings, required). Gate not confirmed. |
| `SearchSkills` | <Undocumented /> | Searches skills by keyword. | `keywords` (1 to 8 strings, required). Gate not confirmed. |
| `RefreshMcpTools` | <Undocumented /> <Gated note="CLAUDE_CODE_ENABLE_REFRESH_MCP_TOOLS" /> | Queries the tool list of connected MCP servers again and applies it. It never dials a server. | `server` (string, optional; omit to refresh all connected servers). Each result has a `status` of `refreshed`, `error`, or `not_connected`. |
| `enable__mcp__claude-in-chrome` | <Undocumented /> | Enables Claude in Chrome, the Claude extension in the Chrome browser on your computer, for the conversation. | Parameters and gate not confirmed. |
| `enable__mcp__remote-devices__Claude_Browser` | <Undocumented /> | Enables the browser built into the Claude desktop app for the conversation. | Parameters and gate not confirmed. |

## Self-Hosted Runner Tools

These nine tools exist only in self-hosted runner sessions. All are <Undocumented /> and <Gated note="self-hosted runner mode" />. All are deferred.

| Tool | What It Does | Read-Only | Parallel |
| --- | --- | --- | --- |
| `self_hosted_runner_get_pool` | Reads self-hosted environment aggregates and queue counts. | ✅ | ✅ |
| `self_hosted_runner_list_sessions` | Lists queued and assigned sessions in a self-hosted environment. | ✅ | ✅ |
| `self_hosted_runner_list_runners` | Lists registered self-hosted runners for an environment. | ✅ | ✅ |
| `self_hosted_runner_list_secrets` | Lists self-hosted environment secrets (metadata only). | ✅ | ✅ |
| `self_hosted_runner_read_health` | Probes the local runner `/healthz` endpoint. | ✅ | ✅ |
| `self_hosted_runner_read_metrics` | Reads runner Prometheus gauges from `/metrics`. | ✅ | ✅ |
| `self_hosted_runner_requeue_session` | Requeues a stuck session onto another runner. | ❌ | ❌ |
| `self_hosted_runner_spawn_local` | Starts a local runner process for a try-out. | ❌ | ❌ |
| `self_hosted_runner_tail_log` | Tails the runner log file with secret redaction. | ✅ | ✅ |

## Tools without an Inventory Row

The inventory file does not list these tools, because their definitions do not use a plain `searchHint` text.

| Tool | Status | What It Does | How It Works | Available In | Read-Only | Parallel | Deferred |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `ToolSearch` | <Documented /> | Loads the schema of deferred tools. | See [ToolSearch](index.md#toolsearch). | Main session and subagents. | ❌ | ❌ | ❌ |
| `WaitForMcpServers` | <Documented /> <Gated note="used when tool search is off" /> | Waits for pending MCP servers. | Removed from subagents. | Main session. | ❌ | ❌ | ❌ |
| `StructuredOutput` | <Undocumented /> | Returns the final JSON for `--json-schema` runs. | Never deferred. | Main session in print mode. | ❌ | ❌ | ❌ |
| `ListMcpResourcesTool`, `ReadMcpResourceTool`, `ReadMcpResourceDirTool` | <Documented /> | List and read MCP resources. | Deferred. Offered when an MCP server has resources. | Main session. | ✅ | ✅ | ✅ |

`Agent`, `Monitor`, `ScheduleWakeup`, `Workflow`, and `SubagentHandback` are on [Agents, Tasks, and Planning](agents-and-tasks.md) and [Shell, Web, and Background Tasks](shell-and-web.md).

## Result Fields New in `2.1.311`

Source: `AppifactReplResult`, `PollResult`, and `ProjectsResult` in [`claude-code-tools.json`](../schemas.md), and the program.

| Field | Status | Tool and Result | Type | What It Means |
| --- | --- | --- | --- | --- |
| `toolsUsed` | <Undocumented /> | `AppifactRepl` | Array of strings | The tools that the calls of the script's artifact reached, whose names the prompt of this conversation did not yet carry. The `tool_result` text opens with a line that names them. The field is left out when the list is empty (`chunk-9ea8x39q.js:1778`, `chunk-9ea8x39q.js:1872`, `chunk-9ea8x39q.js:1991`). |
| `toolsUsed` | <Undocumented /> | `Poll` | Array of strings | A list of tool names. The field is left out when the list is empty (`chunk-2ht8z368.js:161333`). The schema gives no description, so this page states only its name and type. |
| `local_file` | <Undocumented /> | `Projects`, the `project_info` result | String | A path to a file that holds the project description and instructions in full, with long lines split. The program returns it when the two together are too long to return, and then `description` and `instructions` are empty strings. The file is for reading only, and edits to it do not change the project (`chunk-kg0z6tbm.js:1587`, `chunk-kg0z6tbm.js:1625`). |

The `toolsUsed` list is empty while the server flag `tengu_silly_shore` is off (default on) (`chunk-35qty13k.js:101`, `chunk-2ht8z368.js:12649`).

## Example

Turn on skill proposals for one session. The tool also needs a remote environment (see the `propose_skills` row), so in a local terminal this line alone does not turn it on.

```bash title="Enable propose_skills"
CLAUDE_CODE_SKILL_PROPOSALS=1 claude
```

## How It Works

A gated tool is built only when its gate passes. Gates are a login type, a policy, an entry point, an env var, or a server-side flag.
A tool with a server-side flag appears for some accounts and not for others, so the same version can show different tools.
Most of these tools are deferred, so Claude finds them with `ToolSearch` and not in the first tool list.

## Errors

Each row is a family of messages. The backticked text is the start that every message in the family shares. A row marked `Various` gathers the messages of one feature that do not share one start.

| Start of Message | Status | What It Means | Cases |
| --- | --- | --- | --- |
| Various | <Undocumented /> | **Artifact.** The `Artifact` tool refused or could not finish a call. | An input no longer matches what was approved (`action`, `url`, `type_url`, `out_dir`, or a file), so nothing was done and the call must be retried. An action is not available in this session or build. A required argument is missing or wrong (`url`, `thread_id`, `cursor`, `db_op`, `collection`, `doc_id`, `file_path`, `asset_id`). A Read or Edit permission rule blocks the file. The page, the preview, or a database write could not be completed. |
| Various | <Undocumented /> | **Claude Design.** `DesignSync` or `ClaudeDesign` refused a call or could not reach Claude Design. | No plan token or an old one: run `finalize_plan` first. A path is reserved (`CLAUDE.md` and `.claude/`) or outside the finalized plan. A write needs a one-time approval or a project write grant that is not active. A request to Claude Design failed with an HTTP status, or the OAuth base URL is not on the first-party allowlist. |
| Various | <Undocumented /> | **Projects.** The `Projects` tool refused a read or write. | The session has no project attached, a write would put the project over its maximum size, `if_version` no longer matches the doc, the uploaded bytes do not match, or the path is a file upload (`project_delete` removes text docs only). |
| Various | <Undocumented /> | **Computer use.** A computer-use action was refused. | The platform is not supported, a key chord has too many components, the clipboard write did not round-trip, the session has no disk for the lock, or a session context is missing. |
| Various | <Undocumented /> | **Trigger tools.** A trigger call was missing a required argument. | An action such as `get`, `update`, `list_runs`, `run`, or `get_run_log` was called without `trigger_id` or `session_id`, or `create`, `update`, and `create_webhook_trigger` without `body`. |

## Related Pages

- [Tools](index.md)
- [MCP](../../extend/mcp/index.md)
- [Tools Reference](https://code.claude.com/docs/en/tools-reference)
