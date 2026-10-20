---
title: "Hook Events"
description: "All 33 hook events, when each fires, what input it gets, and which output fields it accepts."
url: https://xsyetopz.github.io/claude-code-docs/extend/hooks/events
source: docs/extend/hooks/events.md
---

# Hook Events


Claude Code has 33 hook events.
Each event fires at one point in a session, and each one gets its own input fields and accepts its own output fields.
This page lists them in groups: tool, tool result, session, prompt and turn, agent and task, and other events.
The fields that every event shares are on [Input and Output](https://xsyetopz.github.io/claude-code-docs/extend/hooks/input-and-output.md).

Add or remove the event key in the `hooks` map to turn an event on or off.

## Example

A `SessionStart` hook that adds your open tickets as context.

```json title=".claude/settings.json"
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [{ "type": "command", "command": ".claude/hooks/tickets.sh" }]
      }
    ]
  }
}
```

```bash title=".claude/hooks/tickets.sh"
#!/bin/bash
# Plain stdout on SessionStart becomes context for Claude.
echo "Open tickets: $(gh issue list --limit 5 --json title -q '.[].title' | paste -sd ';' -)"
```

## All Events

| Event | Group | Fires when | Matcher | Can block |
| --- | --- | --- | --- | --- |
| `PreToolUse` | Tool | Before a tool runs. | Tool name | ✅ |
| `PermissionRequest` | Tool | A permission prompt would show. | Tool name | ❌ (use a decision) |
| `PermissionDenied` | Tool | Auto mode denies a call. | Tool name | ❌ |
| `PostToolUse` | Tool result | A tool call succeeds. | Tool name | ❌ |
| `PostToolUseFailure` | Tool result | A tool call fails. | Tool name | ❌ |
| `PostToolBatch` | Tool result | All tool calls of a batch are done. | None | ✅ |
| `SessionStart` | Session | A session starts or resumes. | Start source | ❌ |
| `Setup` | Session | `--init-only`, or `--init` or `--maintenance` with `-p`. | CLI flag | ❌ |
| `SessionEnd` | Session | A session ends. | End reason | ❌ |
| `InstructionsLoaded` | Session | A `CLAUDE.md` or rules file loads. | Load reason | ❌ |
| `ConfigChange` | Session | A settings or skill file changes. | Config source | ✅ |
| `CwdChanged` | Session | A shell command changes the directory. | None | ❌ |
| `FileChanged` | Session | A watched file changes on disk. | File names | ❌ |
| `DirectoryAdded` | Session | A directory is added with `/add-dir`. | Add source | ❌ |
| `UserPromptSubmit` | Prompt | You submit a prompt. | None | ✅ |
| `UserPromptExpansion` | Prompt | A typed command expands to a prompt. | Command name | ✅ |
| `MessageDisplay` | Prompt | Assistant text streams to the screen. | None | ❌ |
| `Notification` | Prompt | Claude Code sends a notification. | Notification type | ❌ |
| `Stop` | Prompt | The main agent finishes. | None | ✅ (keeps working) |
| `StopFailure` | Prompt | The turn ends on an API error. | Error type | ❌ |
| `SubagentStart` | Agent | A subagent starts or resumes. | Agent type | ❌ |
| `SubagentStop` | Agent | A subagent finishes. | Agent type | ✅ (keeps working) |
| `TaskCreated` | Agent | `TaskCreate` makes a task. | None | ✅ |
| `TaskCompleted` | Agent | A task is marked done. | None | ✅ |
| `TeammateIdle` | Agent | A teammate is about to go idle. | None | ✅ (keeps working) |
| `PreCompact` | Other | Before a compaction. | Trigger | ✅ |
| `PostCompact` | Other | After a compaction. | Trigger | ❌ |
| `PreModelSwitch` | Other | Before a requested model switch. | Target model | ✅ |
| `PostModelSwitch` | Other | After the model changes. | Target model | ❌ |
| `Elicitation` | Other | An MCP server asks you for input. | Server name | ✅ (declines) |
| `ElicitationResult` | Other | You answered an MCP question. | Server name | ✅ |
| `WorktreeCreate` | Other | A worktree is needed. | None | ✅ (fails) |
| `WorktreeRemove` | Other | A hook-made worktree is cleaned up. | None | ✅ (fails) |

## Tool Events

These events fire before a tool runs, and when a permission is asked for or denied.
They are the main place to approve, change, or block a tool call.
MCP tools are named `mcp__<server>__<tool>`.

### `PreToolUse`

Fires after Claude builds the tool input and before the tool runs.
It does not fire for `@` file mentions.
Exit 2 blocks the call, and `stderr` is the reason.
Handlers: all five types.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `tool_name` | [Documented] | Input | The tool name. Any tool except `EndConversation`. |
| `tool_input` | [Documented] | Input | The tool arguments. The shape depends on the tool (see below). File paths are absolute. |
| `tool_use_id` | [Documented] | Input | The tool call ID. |
| `permissionDecision` | [Documented] | Output, in `hookSpecificOutput` | `allow`, `deny`, `ask`, or `defer`. `allow` skips the prompt but not deny or ask rules. Order of strength: `deny`, then `defer`, then `ask`, then `allow`. `defer` works only in `-p` with one tool call. |
| `permissionDecisionReason` | [Documented] | Output, in `hookSpecificOutput` | The reason text. For `ask` it shows in the prompt. For `deny` it goes to Claude. Otherwise it goes to the debug log. |
| `updatedInput` | [Documented] | Output, in `hookSpecificOutput` | Replaces the whole tool input. Rules and background checks use the new input. Needed with `allow` for `AskUserQuestion` and `ExitPlanMode`. Ignored with `defer`. |
| `additionalContext` | [Documented] | Output, in `hookSpecificOutput` | Text placed next to the tool result. Ignored with `defer`. |
| `permissionDisplay` | [Undocumented] | Output, in `hookSpecificOutput` | Words for a permission card. For the desktop host only. An object with `title` (200 characters), `description` (2000), and `displayName` (64). Ignored, with a debug line, if the text cannot be shown. |
| Top-level `decision` and `reason` | [Differs: Deprecated for this event. The program schema accepts the enum on all events.] | Output | `approve` maps to `allow`, and `block` maps to `deny`. Use `permissionDecision` instead. |
| `ask` label | [Documented] | Behavior | The prompt shows `[settings]`, `[plugin:<name>]`, or `[skill]`. An `ask` also forces a prompt in auto mode. |

#### Tool Input Shapes

The tool names link to [Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools.md), which holds the status and the full parameters of each tool.

| Tool | Status | Keys in `tool_input` |
| --- | --- | --- |
| [`Bash`](https://xsyetopz.github.io/claude-code-docs/reference/tools/shell-and-web.md) | [Documented] | `command`, `description`, `timeout` (milliseconds), `run_in_background` |
| [`PowerShell`](https://xsyetopz.github.io/claude-code-docs/reference/tools/shell-and-web.md) | [Documented] [Gated: CLAUDE_CODE_USE_POWERSHELL_TOOL] | The same keys as `Bash`. Match with `Bash\|PowerShell`. |
| [`Write`](https://xsyetopz.github.io/claude-code-docs/reference/tools/files.md) | [Documented] | `file_path`, `content` |
| [`Edit`](https://xsyetopz.github.io/claude-code-docs/reference/tools/files.md) | [Documented] | `file_path`, `old_string`, `new_string`, `replace_all` |
| [`Read`](https://xsyetopz.github.io/claude-code-docs/reference/tools/files.md) | [Documented] | `file_path`, `offset`, `limit` |
| [`Glob`](https://xsyetopz.github.io/claude-code-docs/reference/tools/files.md) | [Documented] | `pattern`, `path` |
| [`Grep`](https://xsyetopz.github.io/claude-code-docs/reference/tools/files.md) | [Documented] | `pattern`, `path`, `glob`, `output_mode`, `-i`, `multiline` |
| [`WebFetch`](https://xsyetopz.github.io/claude-code-docs/reference/tools/shell-and-web.md) | [Documented] [Gated: CLAUDE_CODE_DISABLE_WEB_FETCH=1 turns it off] | `url`, `prompt`, `offset` (2.1.290) |
| [`WebSearch`](https://xsyetopz.github.io/claude-code-docs/reference/tools/shell-and-web.md) | [Documented] [Gated: off for the gateway provider; Vertex depends on the model] | `query`, `allowed_domains`, `blocked_domains` |
| [`Agent`](https://xsyetopz.github.io/claude-code-docs/reference/tools/agents-and-tasks.md) | [Documented] | `prompt`, `description`, `subagent_type`, `model` |
| [`AskUserQuestion`](https://xsyetopz.github.io/claude-code-docs/reference/tools/agents-and-tasks.md) | [Documented] | `questions`, and `answers` (set only through `updatedInput`) |
| [`ExitPlanMode`](https://xsyetopz.github.io/claude-code-docs/reference/tools/agents-and-tasks.md) | [Documented] [Gated: internal enable check] | Claude Code adds `plan` and `planFilePath`. The old `allowedPrompts` key is accepted and ignored. |

The docs name `Workflow` as a tool you can match, but give no input shape for it.

### `PermissionRequest`

Fires when a permission prompt would show, or when a call that cannot prompt would be denied.
Exit 2 is not honored here. Deny with the `decision` object instead.
Checked in the interactive screen: the hook fires before the dialog opens; `allow` skips the dialog, `deny` returns `message` to the model, and a top-level `decision: "block"` is ignored. See [Input and Output](https://xsyetopz.github.io/claude-code-docs/extend/hooks/input-and-output.md#what-fires-and-what-is-honored-in-the-interactive-screen).
There is no event for a sandbox network request.
Handlers: `command`, `http`, `mcp_tool`, and `prompt`. An `agent` hook is skipped.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `tool_name`, `tool_input` | [Documented] | Input | The same as in `PreToolUse`. There is no `tool_use_id`. |
| `permission_suggestions` | [Documented] | Input | Updates that Claude Code suggests. The same shape as `updatedPermissions`. A dialog may show other options. |
| `decision.behavior` | [Documented] | Output, in `hookSpecificOutput` | `allow` or `deny`. Deny and ask rules still apply. |
| `decision.updatedInput` | [Documented] | Output | New tool input. `allow` only. Checked again against deny and ask rules. |
| `decision.updatedPermissions` | [Documented] | Output | Permission updates to apply. `allow` only. |
| `decision.message` | [Documented] | Output | Why it was denied. `deny` only. Goes to Claude. |
| `decision.interrupt` | [Documented] | Output | Stops Claude. `deny` only. |

#### Permission Update Entries

These entries are used in `updatedPermissions` and `permission_suggestions`.

| Entry | Status | What it does | Fields |
| --- | --- | --- | --- |
| `addRules`, `replaceRules`, `removeRules` | [Documented] | Change permission rules. | `rules` (each `{toolName, ruleContent?}`), `behavior` (`allow`, `deny`, `ask`), `destination` |
| `setMode` | [Documented] | Change the permission mode. | `mode`: `default`, `auto`, `acceptEdits`, `dontAsk`, `bypassPermissions`, `plan`. `bypassPermissions` works only if bypass was on at launch. |
| `addDirectories`, `removeDirectories` | [Documented] | Change working directories. | `directories` |
| `destination` | [Differs: The docs list four values. The program type also has cliArg.] | Where Claude Code keeps the change. | `session`, `localSettings`, `projectSettings`, `userSettings` |

### `PermissionDenied`

Fires only when auto mode denies a call, including a denial with no classifier verdict.
It does not fire for manual denials, `PreToolUse` blocks, or deny rules.
The exit code and `stderr` are ignored.
Checked in the interactive screen: an auto mode denial fired it, and a manual "No" did not. With no classifier verdict (the classifier failed), `retry: true` changed nothing in the model's input. With a verdict (a stub answered the classifier with a block and the reason `[Data Exfiltration]`), the denial stood and the tool did not run, and the model's next request got the extra text `The PermissionDenied hook indicated you may retry this tool call.` after the denied tool result. Without `retry` that text was absent. `systemMessage` was not shown.
All five handler types are allowed, but output from `prompt` and `agent` is dropped.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `tool_name`, `tool_input`, `tool_use_id`, `mcp_server` | [Documented] | Input | As in `PreToolUse`. |
| `reason` | [Documented] | Input | Why auto mode denied. A rule name in brackets, such as `[Data Exfiltration]`. |
| `retry` | [Documented] | Output, in `hookSpecificOutput` | `true` tells the model it may retry. The denial stands. Ignored for denials with no verdict. |

## Tool Result Events

These events fire after a tool runs. `PostToolUse` and `PostToolUseFailure` match on tool name. `PostToolBatch` has no matcher.
All three accept the five handler types.

### `PostToolUse`

Fires after a tool call succeeds.
Exit 2 shows `stderr` to Claude but does not undo the tool.
It does not see writes made by `Bash` or by outside processes. Use `FileChanged` for those.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `tool_name`, `tool_input`, `tool_use_id`, `mcp_server` | [Documented] | Input | As in `PreToolUse`. |
| `tool_response` | [Documented] | Input | The structured tool output. The shape depends on the tool. |
| `duration_ms` | [Documented] | Input | Run time in milliseconds. Leaves out permission prompts and `PreToolUse` hooks. Optional. |
| `decision`, `reason` | [Documented] | Output | `block` adds the reason next to the result. Claude still sees the original output. |
| `additionalContext` | [Documented] | Output, in `hookSpecificOutput` | Text next to the result. Not delivered for async hooks. |
| `updatedToolOutput` | [Documented] | Output, in `hookSpecificOutput` | Replaces what Claude sees. Must match the tool output shape. For built-in tools a bad shape is ignored. The tool already ran. |
| `updatedMCPToolOutput` | [Documented] | Output, in `hookSpecificOutput` | The same, for MCP tools only. Prefer `updatedToolOutput`. |
| `classifierContext` | [Documented] | Output, in `hookSpecificOutput` | A note for the auto mode classifier. Needs 2.1.236. At most 2,000 characters for one call. Dropped for async hooks and read-only calls. Treated as unverified context. |
| `tool_response.bashEditDiff` | [Documented] | Input | Files that a `Bash` run changed. Needs 2.1.269, a public beta, and the setting `bashEditDiffEnabled`. Keys: `changedFiles` (200), `files` (5), `moreFiles`, `unavailable`, `skipped`, `shared`. |
| `tool_response` of `Agent` | [Documented] | Input | `status` (`completed` or `async_launched`), `agentId`, `content`, `resolvedModel`, `modelsUsed`, `totalTokens`, `totalDurationMs`, `totalToolUseCount`, `usage`, and `outputFile` for a background launch. |
| `tool_response` of `ExitPlanMode` | [Documented] | Input | `plan` and `filePath`. |
| `SubagentHandback` tool | [Documented] | Matcher | The tool that carries a subagent report in auto mode. Match it to read `tool_input.message`. Needs 2.1.271. |

### `PostToolUseFailure`

Fires when a started tool fails, or an MCP tool returns an error.
It does not fire for unknown tools, schema errors, or permission denials.
Exit 2 shows `stderr` to Claude.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `tool_name`, `tool_input`, `tool_use_id`, `mcp_server` | [Documented] | Input | As in `PostToolUse`. |
| `error` | [Documented] | Input | What went wrong. The same text as the tool result. `Bash` and `PowerShell` errors start with `Exit code N`. |
| `is_interrupt` | [Documented] | Input | `true` for an abort. Canceling a running tool does not fire this hook. |
| `duration_ms` | [Documented] | Input | Run time in milliseconds. Optional. |
| `additionalContext` | [Documented] | Output, in `hookSpecificOutput` | Text next to the error. A top-level `decision: "block"` also works. |

### `PostToolBatch`

Fires once after all tool calls of a batch resolve, before the next model request.
Exit 2, `decision: "block"`, or `continue: false` stops the loop.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `tool_calls` | [Documented] | Input | One entry per call, with `tool_name`, `tool_input`, `tool_use_id`, and `tool_response`. |
| `tool_calls[].tool_response` | [Documented] | Input | What the model gets in the `tool_result`. A serialized string or content blocks. It is not the `PostToolUse` object. |
| `additionalContext` | [Documented] | Output, in `hookSpecificOutput` | Context for the next request. Sent once. |

## Session Events

These events fire when a session starts or ends, and when its settings, files, or folders change.

### `SessionStart`

Fires when a session starts or resumes.
Interactive starts run it in the background, but the first reply waits for it.
Exit 2 shows `stderr` to you only.
Handlers: `command` and `mcp_tool` (skipped at launch).

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `source` | [Documented] | Input | How the session began: `startup`, `resume`, `clear`, `compact`, `fork`. This is the matcher. |
| `model` | [Documented] | Input | The active model ID. Can be missing, for example after `/clear`. |
| `agent_type` | [Documented] | Input | The agent name from `--agent`. Optional. |
| `session_title` | [Documented] | Input | The custom title. Present only when one exists. |
| `seconds_since_last_response`, `context_tokens`, `prompt_cache_likely_expired`, `estimated_cache_write_usd` | [Documented] | Input | The cost of a stale resume. Only for `resume` and `fork` with an earlier reply. Needs 2.1.251. |
| `additionalContext` | [Documented] | Output, in `hookSpecificOutput` | Text before the first prompt. Plain `stdout` works too. |
| `initialUserMessage` | [Documented] | Output | The first user message. Only in `-p`. From a plugin it works only if the plugin was installed before the start. |
| `sessionTitle` | [Documented] | Output | Sets the title. Works for `startup`, `resume`, `fork`. Same as `/rename`. |
| `watchPaths` | [Documented] | Output | Absolute paths for `FileChanged` to watch. |
| `reloadSkills` | [Documented] | Output | Scans the skill and command folders again. Use it after a hook installs skills. |

### `Setup`

Fires for `--init-only`, or for `--init` or `--maintenance` with `-p`. It does not fire on a normal start.
`--init-only` also runs `SessionStart` with `startup`.
Handler: `command` only.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `Setup` event | [Gated: Fires only with the --init-only, --init, or --maintenance CLI flags.] | Event | See the flags above. |
| `trigger` | [Documented] | Input | `init` or `maintenance`. It is also the matcher. |
| `additionalContext` | [Differs: Docs: all JSON fields of Setup are dropped on every exit code. The program output schema lists additionalContext for Setup.] | Output | Treat it as not delivered. A probe with `--init` found it never reached the model request ([Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md#subagents-and-hooks)). |
| `CLAUDE_ENV_FILE` | [Documented] | Environment | Persists environment variables, as for `SessionStart`. |

### `SessionEnd`

Fires when a session ends.
The budget is 1.5 seconds for all hooks together. Exit 2 shows `stderr` to you. JSON is dropped.
Handlers: `command`, `http`, `mcp_tool`.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `reason` | [Documented] | Input | Why it ended: `clear`, `resume`, `logout`, `prompt_input_exit`, `other`. This is the matcher. |

### `InstructionsLoaded`

Fires when `CLAUDE.md` or a `.claude/rules/*.md` file loads.
It runs async and has no decision. It does not fire for an `AGENTS.md` file read directly.
Handlers: `command`, `http`, `mcp_tool`.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `file_path` | [Documented] | Input | The absolute path of the file. |
| `memory_type` | [Documented] | Input | `User`, `Project`, `Local`, or `Managed`. |
| `load_reason` | [Documented] | Input | `session_start`, `nested_traversal`, `path_glob_match`, `include`, `compact`. This is the matcher. |
| `globs`, `trigger_file_path`, `parent_file_path` | [Documented] | Input | Extra data for lazy and `include` loads. `globs` is only for `path_glob_match`. |

### `ConfigChange`

Fires when a settings, managed policy, or skill file changes.
It does not fire for server-managed or MDM changes.
Exit 2 or `decision: "block"` stops the change, except for `policy_settings`.
Handlers: `command`, `http`, `mcp_tool`.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `source` | [Documented] | Input | `user_settings`, `project_settings`, `local_settings`, `policy_settings`, `skills`. This is the matcher. |
| `file_path` | [Documented] | Input | The changed file. Optional. |
| `decision`, `reason` | [Documented] | Output | `block` keeps the old settings. Nobody sees `reason`. `systemMessage` and `continue` are dropped. |

### `CwdChanged`

Fires when a shell command in the main conversation changes the directory.
It has no matcher and cannot block.
`CLAUDE_ENV_FILE` is cleared at the next event.
Handlers: `command`, `http`, `mcp_tool`.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `old_cwd`, `new_cwd` | [Documented] | Input | The two directories. |
| `watchPaths` | [Documented] | Output, in `hookSpecificOutput` | Replaces the dynamic watch list. An empty array clears it. `systemMessage` shows as a short notice. `continue` is dropped. |

### `FileChanged`

Fires when a watched file changes on disk.
A file watcher drives it, not tool calls.
The matcher names the files to watch, and Claude Code filters by base name.
It cannot block.
Handlers: `command`, `http`, `mcp_tool`.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `file_path` | [Documented] | Input | The absolute path. |
| `event` | [Documented] | Input | `change`, `add`, or `unlink`. |
| `watchPaths` | [Documented] | Output, in `hookSpecificOutput` | Replaces the dynamic watch list. The watcher starts only when something names a file. |

### `DirectoryAdded`

Fires after `/add-dir`, or after the SDK `register_repo_root` request.
It runs in the background with a 600 second timeout.
It does not fire for `--add-dir`, `/permissions`, or a directory Claude Code already knows.
Handlers: `command`, `http`, `mcp_tool`.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `directory` | [Documented] | Input | The absolute path. |
| `source` | [Documented] | Input | `slash_command` or `register_repo_root`. This is the matcher. `systemMessage` goes to Claude for `slash_command` and to the debug log otherwise. |

## Prompt and Turn Events

These events fire around a turn: when you send a prompt, while text shows, when Claude Code sends a notification, and when Claude stops.

### `UserPromptSubmit`

Fires when you submit a prompt, before Claude reads it.
It has no matcher. It also fires for scheduled tasks, background subagent reports, and messages from other sessions.
The default timeout is 30 seconds.
Exit 2 blocks the prompt. Plain `stdout` is added as context.
Handlers: all five types.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `prompt` | [Documented] | Input | The text. A typed `/skill` arrives as typed, not expanded. Pasted text arrives expanded. |
| `source` | [Undocumented] | Input | Who made the prompt: `user`, `sdk`, `system`, `loop_wakeup`, `schedule_wakeup`, `poll_event`. May be missing. |
| `session_title` | [Documented] | Input | The custom title, only when one is set. |
| `decision`, `reason` | [Documented] | Output | `block` stops the prompt. You see `reason`. It is not added to context. |
| `additionalContext` | [Documented] | Output, in `hookSpecificOutput` | Context placed next to the prompt. |
| `sessionTitle` | [Documented] | Output | Sets the session title. |
| `suppressOriginalPrompt` | [Documented] | Output | Leaves the prompt text out of the block message. Otherwise the block message ends with `Original prompt:` and is written to the transcript. |

### `UserPromptExpansion`

Fires when a typed command expands into a prompt.
The matcher is `command_name`.
It covers typing `/skill`, which skips `PreToolUse`.
Exit 2 blocks. Plain `stdout` is context.
Handlers: all five types.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `expansion_type` | [Documented] | Input | `slash_command` or `mcp_prompt`. |
| `command_name`, `command_args`, `prompt` | [Documented] | Input | The command parts and the raw line. |
| `command_source` | [Documented] | Input | Where the command came from, such as `plugin`. Optional. |
| `decision`, `reason` | [Documented] | Output | `block` stops the expansion. |
| `additionalContext`, `suppressOriginalPrompt` | [Documented] | Output, in `hookSpecificOutput` | As in `UserPromptSubmit`. |

### `MessageDisplay`

Fires while assistant text streams, once for each batch of finished lines.
It has no matcher. The timeout is 10 seconds.
It only changes what you see. The transcript and Claude keep the original.
In `-p` mode it runs once with the full text.
Handlers: `command`, `http`, `mcp_tool`.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `turn_id`, `message_id` | [Documented] | Input | UUIDs of the turn and the message. `message_id` is stable for the whole message. |
| `index`, `final` | [Documented] | Input | The position of the batch. `final` is true on the last one. |
| `delta` | [Documented] | Input | The new lines. Whole lines, except in the final batch. |
| `displayContent` | [Documented] | Output, in `hookSpecificOutput` | Text shown in place of `delta`. If the hook fails, the original shows. `systemMessage` and `continue` are dropped. |

### `Notification`

Fires when Claude Code sends a notification.
The matcher is the notification type.
It runs even if desktop notifications are off.
The exit code and `stderr` are ignored, but `terminalSequence` still works.
Handlers: `command`, `http`, `mcp_tool`.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `message`, `title`, `notification_type` | [Documented] | Input | The text, an optional title, and the type. |
| `permission_prompt` | [Documented] | Type | A prompt waited about 6 seconds. Seen live in the interactive screen (2.1.304) with the message `Claude needs your permission`. |
| `idle_prompt` | [Documented] | Type | The session was idle for about 60 seconds. Both depend on typing and running agents. Seen live: the message was `Claude is waiting for your input`, about 60 seconds after the turn ended (the config key `messageIdleNotifThresholdMs` sets the 60 seconds; default 60000). |
| `auth_success`, `elicitation_dialog`, `elicitation_url_dialog`, `elicitation_complete`, `elicitation_response` | [Documented] | Type | Auth finished, and the steps of an MCP question. The two dialog types wait 6 seconds. Seen live in the interactive screen: all four `elicitation_*` values (messages `Claude Code needs your input` for the two dialogs, `Elicitation response for server "probe": accept`, and `MCP server "probe" confirmed elicitation el-1 complete`). `auth_success` needs a login and was not seen. |
| `agent_needs_input`, `agent_completed` | [Documented] | Type | Background session events in agent view. `agent_needs_input` for a teammate setup question needs 2.1.248. `agent_needs_input` was seen live for the auto mode classifier billing notice (message `Auto mode has a classifier billing notice to acknowledge`) that shows the first time auto mode runs with a custom base URL. `agent_completed` was not seen (it needs a background session). |
| `quota_auto_resume_fired`, `quota_auto_resume_stale`, `quota_auto_resume_disabled` | [Documented] | Type | Usage limit wait events. Need 2.1.234. Not seen live: they need a login. |
| `plugin_notification` | [Undocumented] | Type | Sent by the mod call `$.ui.notify`. Seen live: the hook got `message`, `title`, and `notification_type`, even with no notification channel. |
| `auth_storage_failure` | [Undocumented] | Type | Sent after the OAuth token exchange, when storage fails. Message: `Claude Code login needs attention: credentials may not have been saved`, or `Claude Code login needs attention: credentials could not be saved`. |
| `worker_permission_prompt` | [Undocumented] | Type | Sent by the team lead's inbox poller. Messages: `<worker> needs permission for <tool>`, or `<worker> needs network access to <host>`. |
| `push_notification` | [Undocumented] | Type | Sent with the message from the `PushNotification` tool. Skipped when the config is off (`config_off`) or the user is present (`user_present`). Setting `CLAUDE_CODE_DISABLE_NOTIFICATION_PRESENCE_CHECK` turns off the presence check. |
| `computer_use_enter` | [Undocumented] | Type | Message when computer use starts: `Claude is using your computer · press Esc to stop` (or `Ctrl+C`). |
| `computer_use_exit` | [Undocumented] | Type | Message when computer use ends: `Claude is done using your computer`. |

The five rows after `plugin_notification` come from the program and were not seen live. The program runs Notification hooks for each type in the table above before it chooses a notification channel. The program also lists `model_refusal_fallback` as a type.

### `Stop`

Fires when the main agent finishes. It does not fire on a user interrupt.
It has no matcher.
Exit 2 or `decision: "block"` keeps Claude working.
The cap is 8 continuations in a row, set by `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`.
Handlers: all five types.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `stop_hook_active` | [Documented] | Input | `true` when a stop hook already continued the turn. Check it to avoid loops. |
| `last_assistant_message` | [Documented] | Input | The text of the final reply. Use it instead of the transcript. |
| `background_tasks` | [Documented] | Input | Tasks still running. Each has `id`, `type`, `status`, `description`, and some of `command`, `agent_type`, `server`, `tool`, `name` by type. Text is cut at 1000 characters. |
| `session_crons` | [Documented] | Input | Scheduled wakeups. Each has `id`, `schedule`, `recurring`, `prompt`. |
| `decision`, `reason` | [Documented] | Output | `block` stops Claude from stopping. `reason` is required. It becomes the next instruction. |
| `additionalContext` | [Documented] | Output, in `hookSpecificOutput` | Feedback that keeps the turn going. Labeled `Stop hook feedback`, not an error. |

### `StopFailure`

Fires instead of `Stop` when the turn ends on an API error.
The matcher is `error`.
Output and the exit code are ignored, but `terminalSequence` works.
Handlers: `command`, `http`, `mcp_tool`.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `error` | [Differs: The docs list 12 values. The type SDKAssistantMessageError also has verification_required.] | Input | The error type. See the list on [Configuration](https://xsyetopz.github.io/claude-code-docs/extend/hooks/configuration.md#matcher-targets). |
| `error_details` | [Documented] | Input | More detail. Optional. |
| `last_assistant_message` | [Documented] | Input | The rendered API error text. It is not Claude's own words, unlike in `Stop`. |

## Agent and Task Events

These events tell your hooks when a subagent, a task, or a teammate starts, stops, or goes idle.
Teammates belong to agent teams. See [Subagent Runtime](https://xsyetopz.github.io/claude-code-docs/extend/subagents/runtime.md#agent-teams).

### `SubagentStart`

Fires when a subagent starts or resumes, and for each message of an in-process teammate.
The matcher is the agent type.
It cannot block. Exit 2 shows `stderr` in the subagent transcript only.
Handlers: `command`, `http`, `mcp_tool`.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `agent_id`, `agent_type` | [Documented] | Input | The subagent ID and type. A plugin agent type is `my-plugin:reviewer`. Anchor the matcher with `^` and `$`. |
| `additionalContext` | [Documented] | Output, in `hookSpecificOutput` | Context for the subagent before its first prompt. On a repeat run it is added only if the earlier copy is gone, to keep the cache. |

### `SubagentStop`

Fires when a subagent finishes.
The matcher is the agent type.
Exit 2 or `decision: "block"` keeps it running, and `reason` is its next instruction.
Handlers: all five types.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `stop_hook_active`, `last_assistant_message`, `background_tasks`, `session_crons` | [Documented] | Input | As in `Stop`. The two arrays are scoped to the parent session. |
| `agent_id`, `agent_type` | [Documented] | Input | The subagent ID and type. `agent_type` can be empty for internal agents, such as prompt suggestions and `/btw`. A named matcher does not match an empty type. |
| `agent_transcript_path` | [Documented] | Input | The subagent transcript, in a nested `subagents/` folder. `transcript_path` is the main one. |
| `additionalContext` | [Documented] | Output, in `hookSpecificOutput` | Non-error feedback that keeps the subagent running. Same loop guards as `Stop`. |

### `TaskCreated`

Fires when `TaskCreate` makes a task.
It has no matcher. It does not fire in a session without the Task tools.
Exit 2 or `decision: "block"` deletes the task and gives the message to Claude.
`continue: false` is ignored.
Handlers: all five types.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `task_id`, `task_subject` | [Documented] | Input | The task ID and title. |
| `task_description`, `teammate_name` | [Documented] | Input | Optional detail and the creator. May be absent. |
| `team_name` | [Documented] | Input | The session team name. Deprecated, to be removed. |
| `agent_id` | [Documented] | Input | The creating subagent or teammate. Needs 2.1.290. May be absent. |

### `TaskCompleted`

Fires when a task is marked done, or when a teammate ends its turn with open tasks.
It has no matcher.
Exit 2 keeps the task open, and `stderr` goes to the model.
`continue: false` stops a teammate, and is ignored when `TaskUpdate` caused the event.
Handlers: all five types.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `task_id`, `task_subject`, `task_description`, `teammate_name` | [Documented] | Input | As in `TaskCreated`. |
| `team_name`, `agent_id` | [Documented] | Input | The deprecated team name, and the acting agent. `agent_id` needs 2.1.290. |

### `TeammateIdle`

Fires when an agent team teammate is about to go idle.
It has no matcher.
Exit 2 gives `stderr` to the teammate, and it keeps working. `continue: false` stops it.
Handlers: all five types.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `teammate_name`, `team_name` | [Documented] | Input | The teammate and the deprecated team name. |
| `agent_id` | [Documented] | Input | The in-process teammate. Needs 2.1.290. May be absent. |

## Other Events

These events cover compaction, model switches, MCP questions, and worktrees.
None of them accepts `prompt` or `agent` handlers.

### `PreCompact` and `PostCompact`

`PreCompact` fires before a compaction. `PostCompact` fires after it.
The matcher is `trigger`.
For `PreCompact`, exit 2 or `decision: "block"` blocks it (checked in the interactive screen; `continue: false` did not stop the compaction).
Blocking a proactive auto compaction skips it. Blocking a recovery compaction shows the API error.
`PostCompact` has no decision. Exit 2 shows `stderr` to you.
Handlers: `command`, `http`, `mcp_tool`.
For the compaction process, see [Context and Compaction](https://xsyetopz.github.io/claude-code-docs/how-it-works/context-and-compaction.md).

| Field | Status | Event | What it does |
| --- | --- | --- | --- |
| `trigger` | [Documented] | Both, input | `manual` or `auto`. `auto` includes idle compaction. |
| `custom_instructions` | [Documented] | `PreCompact`, input | The text after `/compact`. `null` for `auto` or when empty. |
| `compact_summary` | [Documented] | `PostCompact`, input | The summary that Claude Code made. |

### `PreModelSwitch` and `PostModelSwitch`

Both need 2.1.251.
The matcher is the canonical name of `to_model`.
Handlers: `command`, `http`, `mcp_tool`.
For how a model is chosen, see [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md).

`PreModelSwitch` fires before a requested switch: `/model`, the picker, `/config`, fast mode, or `set_model`.
It does not fire for automatic fallback or resume.
The timeout is 30 seconds, and a timeout blocks.
Exit 2 or `decision: "block"` cancels the switch.

`PostModelSwitch` fires after the model changes, also on fallback, `opusplan`, and resume.
It cannot block. It does not fire for a one-turn fallback chain.
Plain `stdout` is context. Exit 2 shows `stderr` as a notice.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `from_model`, `to_model`, `requested_model` | [Documented] | Input | The model IDs and the name you asked for. `requested_model` is `null` for the default. |
| `source` | [Documented] | Input | `command`, `picker`, or `sdk`. `PostModelSwitch` adds `auto` and `resume`. |
| `context_tokens`, `prompt_cache_warm`, `cache_ttl` | [Documented] | Input | The cost of sending the context again. `cache_ttl` is `5m` or `1h`. |
| `estimated_cache_write_usd`, `pricing` | [Documented] | Input | The estimate and its basis. `pricing` is `configured`, `catalog`, or `default`. |
| `permissionDecision`, `permissionDecisionReason` | [Documented] | Output, `PreModelSwitch` | `allow`, `deny`, `ask`, and the reason. `ask` works only in interactive `/model`, else it is a refusal. No `defer`, `updatedInput`, or `additionalContext`. Strength order: `deny`, `ask`, `allow`. |
| `additionalContext` | [Documented] | Output, `PostModelSwitch` | Text for the next request. If the hook is late by 5 seconds, it goes to the request after. |

### `Elicitation` and `ElicitationResult`

An elicitation is a question that an MCP server asks you.
The matcher for both events is the server name.
Handlers: `command`, `http`, `mcp_tool`.

`Elicitation` fires when the server asks. A hook can answer, so no dialog shows. Exit 2 declines.
`reason`, `systemMessage`, and `continue` are dropped.
`ElicitationResult` fires after you answer, before the answer goes to the server. It also runs on decline and cancel.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `mcp_server_name`, `message` | [Documented] | `Elicitation`, input | The server and the prompt text. |
| `mode`, `url`, `elicitation_id`, `requested_schema` | [Documented] | `Elicitation`, input | `form` or `url` mode, the URL, the ID, and the form schema. Optional. |
| `action`, `content` | [Documented] | `Elicitation`, output | `accept`, `decline`, `cancel`, and the form values. Read only on exit 0. A hook answer skips `ElicitationResult` hooks. A decline beats an accept. |
| `decision: "block"` | [Documented] | `Elicitation`, output | Declines. Works from 2.1.284. Beats `action`. |
| `action`, `content`, `mode`, `elicitation_id` | [Documented] | `ElicitationResult`, input | Your answer. `action` is `accept`, `decline`, or `cancel`. |
| `action`, `content` | [Documented] | `ElicitationResult`, output | Change or block the answer. `content` replaces the whole object. An output with no `action` is ignored. `cancel` still sends your values. |

Both events fired in an interactive probe for an MCP server that asked for input in form mode and in URL mode. The `Elicitation` input had `mcp_server_name`, `message`, `mode`, and `requested_schema`. The `ElicitationResult` input had `action` and `content`. See [Interactive Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md#interactive-probes).

### `WorktreeCreate` and `WorktreeRemove`

`WorktreeCreate` replaces the default `git worktree` step.
It fires for `--worktree`, `EnterWorktree`, `isolation: "worktree"`, workflows, background sessions, and remote control.
It has no matcher. Any non-zero exit fails it.
`.worktreeinclude` is not processed.

`WorktreeRemove` cleans up a worktree that a `WorktreeCreate` hook made.
It has no matcher. Exit 0 counts as removed. A non-zero exit fails the removal if the folder still exists.
Claude Code keeps a subagent worktree. JSON is dropped.

Handlers: `command`, `http`, `mcp_tool`.

| Field | Status | Direction | What it does |
| --- | --- | --- | --- |
| `name` | [Documented] | `WorktreeCreate`, input | The slug of the new worktree, such as `bold-oak-a3f2`. |
| Path on `stdout` | [Documented] | `WorktreeCreate`, output | A command hook prints the path as its last non-empty line. ANSI codes are stripped. A relative path resolves against the hook folder. Absolute paths with `.` or `..`, and paths through a repo symlink, are refused. |
| `worktreePath` | [Documented] | `WorktreeCreate`, output | An HTTP hook returns the path here. A command hook cannot return JSON, so it cannot use `terminalSequence`. |
| `worktree_path` | [Documented] | `WorktreeRemove`, input | The absolute path to remove. |

## `PostToolUse` `tool_response` Shapes

We logged the stdin of a `PostToolUse` command hook in `-p` on `2.1.304`, with one scripted call per tool. This is the `tool_response` you can read, and the shape `updatedToolOutput` replaces.

| Tool | Status | `tool_response` |
| --- | --- | --- |
| `Bash` | [Documented] | `stdout`, `stderr`, `interrupted`, `isImage`, and `noOutputExpected`. |
| `Read` (text) | [Undocumented] | `type` (`text`) and `file` with `filePath`, `content`, `numLines`, `startLine`, and `totalLines`. |
| `Write` (new file) | [Undocumented] | `type` (`create`), `filePath`, `content`, `structuredPatch` (empty), `originalFile` (`null`), and `userModified`. |
| `Edit` | [Undocumented] | `filePath`, `oldString`, `newString`, `originalFile`, `structuredPatch` (items with `oldStart`, `oldLines`, `newStart`, `newLines`, `lines`), `userModified`, `replaceAll`, and `contentNotInModelContext`. `tool_input` also has `replace_all`. |
| `ToolSearch` | [Undocumented] | `matches` (tool names), `query`, and `total_deferred_tools`. `tool_input` also has `max_results`. |
| `Agent` | [Undocumented] | First an async launch: `isAsync`, `status` (`async_launched`), `agentId`, `description`, `resolvedModel`, `prompt`, `outputFile`, `canReadOutputFile`, and `canContinueAgent`. Then, for a finished subagent: `status` (`completed`), `prompt`, `agentId`, `agentType`, `content` (text blocks), `resolvedModel`, `totalDurationMs`, `totalTokens`, `totalToolUseCount`, and `usage`. |
| `ListAgents` | [Undocumented] | `listing` (text), `sections`, and `notes`. |
| `CronCreate` | [Undocumented] | `id`, `humanSchedule`, `recurring`, `durable`, and `nextFireAt`. |
| `CronList` | [Undocumented] | `jobs`. |

A second probe ran the same hook in the interactive screen (2.1.304, `acceptEdits`, one scripted call per tool). It confirmed the shapes of `Bash`, `Read`, `Write`, and `Edit` above, with one difference: the `Edit` result there had no `contentNotInModelContext` key. It also confirmed that an MCP tool's `tool_response` is the array of content blocks the server returned (`[{"type":"text","text":"echo:hi"}]`), and that the hook input has `mcp_server`. Every `PostToolUse` input had `hook_event_name`, `tool_name`, `tool_input`, `tool_response`, `tool_use_id`, and `duration_ms`. An `Edit` of a file that was never read is a tool error, so it fires `PostToolUseFailure` and not `PostToolUse`. The interactive probe did not run `Glob`, `Grep`, `NotebookEdit`, `WebFetch`, or `WebSearch` (this build's tool list there had no `Glob` or `Grep`), and did not test whether `updatedToolOutput` accepts these shapes. See [Interactive Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md#interactive-probes).

## Related Pages

- [Hooks](https://xsyetopz.github.io/claude-code-docs/extend/hooks.md): the overview.
- [Configuration](https://xsyetopz.github.io/claude-code-docs/extend/hooks/configuration.md): matchers and timeouts.
- [Input and Output](https://xsyetopz.github.io/claude-code-docs/extend/hooks/input-and-output.md): common fields, decisions, and exit codes.
- [Subagent Runtime](https://xsyetopz.github.io/claude-code-docs/extend/subagents/runtime.md): subagents and teams.

Source: [Hooks Reference](https://code.claude.com/docs/en/hooks), the `HookInput` types in the program type file, and the hook output schema in the program.
Probed in `-p`: a `Workflow` call has `tool_input` `{script}`, and its `PostToolUse` `tool_response` has `status` (`async_launched`), `taskId`, `taskType` (`local_workflow`), `workflowName`, `runId`, `summary`, and `transcriptDir`. A `Skill` call has `tool_input` `{skill}` and `tool_response` `{success, commandName}`. An MCP tool's `tool_response` is the list of content blocks that the server returned, for example `[{"type":"text","text":"pong"}]`. Built-in tool outputs differ per tool (see [`PostToolUse` `tool_response` Shapes](#posttooluse-tool_response-shapes)). We did not probe every built-in tool, and `WebFetch`, `ScheduleWakeup`, and `NotebookEdit` calls did not reach `PostToolUse` in our run.
