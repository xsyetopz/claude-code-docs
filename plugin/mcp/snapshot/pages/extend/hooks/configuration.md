---
title: "Hook Configuration"
description: "Matchers, the if filter, timeouts, failure handling, environment variables, settings keys, and trust rules for hooks."
url: https://xsyetopz.github.io/claude-code-docs/extend/hooks/configuration
source: docs/extend/hooks/configuration.md
---

# Hook Configuration


Hook configuration decides which hooks run, when they run, and what happens when one fails.
A matcher picks the events. An `if` filter narrows them to some tool calls.
The `timeout` and `onFailure` fields set limits.
For example, `"matcher": "Bash"` with `"if": "Bash(git push *)"` runs a hook only for `git push` commands.

Turn hooks off with `disableAllHooks` or `allowManagedHooksOnly`, or remove the entry.

## Example

```json title=".claude/settings.json"
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "if": "Edit(*.ts)",
            "command": "bunx prettier --write \"$CLAUDE_PROJECT_DIR\"",
            "timeout": 60,
            "statusMessage": "Formatting"
          }
        ]
      }
    ]
  }
}
```

The hook runs after an edit or write, but only for `.ts` files.
It can run for up to 60 seconds.

## Matcher Rules

The `matcher` key is a string on a matcher group. It picks which occurrences of the event run the group.

| Matcher form | Status | What it does | Notes |
| --- | --- | --- | --- |
| `"*"`, `""`, or no `matcher` | [Documented] | Matches everything. | The group runs on every occurrence. |
| Letters, digits, `_`, `-`, space, `,`, `\|` only | [Documented] | An exact string or a list. | `Edit\|Write` and `Edit, Write` both match either name. `mcp__memory` alone matches no tool. |
| Any other character | [Documented] | A JavaScript regular expression, not anchored. | Tested with `RegExp.prototype.test`. Use `^` and `$` to match a whole name. |
| `FileChanged` and `StopFailure` | [Documented] | A narrower exact set. | Only letters, digits, `_`, and `\|` count as exact. A hyphen, space, or comma makes it a regex. |
| A matcher on an event with no matcher | [Documented] | Silently ignored. | No error. |

## Matcher Targets

What the matcher is tested against depends on the event.

| Target | Status | Values | Events |
| --- | --- | --- | --- |
| Tool name | [Documented] | `Bash`, `Edit\|Write`, `mcp__.*`. Plugin MCP tools are `mcp__plugin_<plugin>_<server>__<tool>`. | `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`, `PermissionDenied` |
| Start source | [Documented] | `startup`, `resume`, `clear`, `compact`, `fork`. `fork` needs 2.1.214. | `SessionStart` |
| CLI flag | [Documented] | `init`, `maintenance` | `Setup` |
| End reason | [Documented] | `clear`, `resume`, `logout`, `prompt_input_exit`, `other` | `SessionEnd` |
| Notification type | [Documented] | See [Events](https://xsyetopz.github.io/claude-code-docs/extend/hooks/events.md#notification). | `Notification` |
| Agent type | [Documented] | `general-purpose`, `Explore`, `Plan`, or a custom name. A plugin name such as `my-plugin:reviewer` contains a colon, so it is a regex. Write `^my-plugin:reviewer$`. | `SubagentStart`, `SubagentStop` |
| Trigger | [Documented] | `manual`, `auto` | `PreCompact`, `PostCompact` |
| Target model | [Documented] | The canonical name of `to_model`, without `[1m]`. If no canonical name is known, every hook runs. | `PreModelSwitch`, `PostModelSwitch` |
| Config source | [Documented] | `user_settings`, `project_settings`, `local_settings`, `policy_settings`, `skills` | `ConfigChange` |
| Add source | [Documented] | `slash_command`, `register_repo_root` | `DirectoryAdded` |
| File names | [Documented] | Literal names split on `\|`. Claude Code filters by base name. The matcher also builds the watch list. | `FileChanged` |
| Error type | [Differs: The docs list 12 values. The program type also has verification_required.] | `rate_limit`, `overloaded`, `authentication_failed`, `oauth_org_not_allowed`, `account_on_hold`, `billing_error`, `invalid_request`, `model_not_found`, `server_error`, `max_output_tokens`, `cloud_credential_error`, `unknown`. | `StopFailure` |
| Load reason | [Documented] | `session_start`, `nested_traversal`, `path_glob_match`, `include`, `compact` | `InstructionsLoaded` |
| Command name | [Documented] | Skill or command names. | `UserPromptExpansion` |
| MCP server name | [Documented] | Names of configured servers. | `Elicitation`, `ElicitationResult` |
| No matcher | [Documented] | Always fires. | `UserPromptSubmit`, `PostToolBatch`, `Stop`, `TeammateIdle`, `TaskCreated`, `TaskCompleted`, `WorktreeCreate`, `WorktreeRemove`, `MessageDisplay`, `CwdChanged` |

## The `if` Filter

`if` is a handler field. It holds one permission rule, such as `Bash(git *)` or `Edit(*.ts)`.

| Item | Status | What it does | Notes |
| --- | --- | --- | --- |
| `if` | [Documented] | Runs the handler only when the rule matches the tool call. | Only the five tool events read it. On any other event the hook never runs. You cannot use `&&` or a list. |
| Bash patterns | [Documented] | Checked on each subcommand. | A leading `VAR=value` is removed. Claude Code also checks `$()` and backticks. If it cannot parse the command, the hook runs. |
| File patterns | [Documented] | For example `Edit(src/**)`. | Matches only `src` in the working directory. Use `**/src/**` for any depth. This changed in 2.1.214. |

## Timeouts

`timeout` is a number of seconds.
A hook that times out is canceled and its output is dropped.

| Item | Status | What it does | Notes |
| --- | --- | --- | --- |
| Default `timeout` | [Documented] | 600 seconds for `command`, `http`, `mcp_tool`. 30 for `prompt`. 60 for `agent`. | The program was not searched for each default. They come from the docs. |
| Lower defaults | [Documented] | 30 seconds on `UserPromptSubmit`, `PreModelSwitch`, `PostModelSwitch`. 10 seconds on `MessageDisplay`. | For `command`, `http`, `mcp_tool`. |
| `SessionEnd` budget | [Documented] | 1.5 seconds shared by all hooks. | Raised to the largest per-hook `timeout` in settings, up to 60 seconds. Plugin timeouts do not raise it. |
| `PreModelSwitch` timeout | [Documented] | A hook that times out blocks the switch. | |
| `PreToolUse` timeout | [Documented] | A `command`, `http`, or `mcp_tool` hook that times out does not block. | Use `onFailure: "block"` to block. An SDK callback that times out does block. |
| `asyncTimeout` | [Undocumented] | A first reply of `{"async":true,"asyncTimeout":ms}` moves a command hook to the background and sets its time limit. | Default 15000 ms. Only the Agent SDK pages name it. See [Agent SDK Hooks](https://code.claude.com/docs/en/agent-sdk/hooks). |

## Failure Handling

A failure means the hook could not start, timed out, exited with a code other than 0 or 2, printed invalid JSON, or got a non-2xx HTTP status.

| Item | Status | What it does | Notes |
| --- | --- | --- | --- |
| `onFailure: "continue"` | [Documented] | The default. The action goes on after a failure. | `command` and `http` handlers. |
| `onFailure: "block"` | [Documented] | A failure counts as exit 2. | The error text says `blocking because onFailure is "block"`. |
| `onFailure` has no effect | [Undocumented] | On async hooks and on `Stop`, `SubagentStop`, `TaskCompleted`, `TeammateIdle`. | The field text in the program says so. The Hooks Reference does not. |
| Windows without Git Bash | [Documented] | A shell-form `PreToolUse` or `PermissionRequest` hook that fails can block. | Set `shell: "powershell"`, or use exec form with `onFailure`. |
| Background process keeps `stdout` open | [Documented] | After an allow, this blocks the call with `refusing to honor the suspect capture`. | Redirect the output of background child processes. |
| `CLAUDE_CODE_RESTRICT_PERSONAL_CONFIG` | [Undocumented] | Your own hooks in user files must succeed. Their grant and rewrite fields are dropped. | Program messages: `blocking because it is one of the user's own hooks`. Affects `PreToolUse`, `PermissionRequest`, `PreModelSwitch`, `UserPromptSubmit`, `UserPromptExpansion`. |

## Environment Variables for Hooks

| Variable | Status | What it does | Notes |
| --- | --- | --- | --- |
| `CLAUDE_PROJECT_DIR` | [Documented] | The project root where the session started. | Stays fixed in a worktree. `cwd` in the input follows Claude. Also set for stdio MCP servers and plugin LSP. |
| `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PLUGIN_DATA` | [Documented] | The plugin install folder and data folder. | Replaced in `command` and `args`. Also exported. |
| `CLAUDE_PLUGIN_OPTION_<KEY>` | [Documented] | A plugin `userConfig` option. | Use it in shell form. `${user_config.*}` works only in exec form. |
| `CLAUDE_ENV_FILE` | [Documented] | A file of `export` lines that later Bash commands load. | Append with `>>`. Set for `SessionStart`, `Setup`, `CwdChanged`, `FileChanged`. Not set for PowerShell hooks. |
| `CLAUDE_EFFORT` | [Documented] | The effort level of the turn. | Also visible in Bash. |
| `CLAUDE_CODE_REMOTE` | [Documented] | `"true"` in remote web environments. | Unset in the local CLI. |
| `CLAUDE_CODE_BRIDGE_SESSION_ID` | [Documented] | The Remote Control session ID. | Set from 2.1.199 while connected. |
| Inherited environment | [Documented] | The parent environment minus `OTEL_*`. | `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` strips more. HIPAA sessions drop Anthropic credentials. |
| `CLAUDE_MODEL` | [Documented] | Does not exist. | Use `PostModelSwitch` and `to_model`. |
| `CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS` | [Documented] | The `SessionEnd` budget. | See [Environment Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars.md). |
| `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` | [Documented] | The most `Stop` continuations in a row. | Default 8. |
| `CLAUDE_CODE_DISABLE_PERMISSION_PROMPT_NOTIFY_HOOKS` | [Documented] | Turns off the `permission_prompt` notification in SDK hosts. | |
| `CLAUDE_CODE_DISABLE_FILE_MENTIONS` | [Documented] | Stops `@` insertion. | |
| `CLAUDE_CODE_GIT_BASH_PATH` | [Documented] | The Git Bash path on Windows. | |
| `MCP_TIMEOUT` | [Documented] | How long an MCP hook waits for a server that is still connecting. | |
| `CLAUDE_CODE_HOOKS_SAME_THREAD` | [Undocumented] | Runs function hooks on the main thread, not in a worker. | The program picks `same-thread` or `worker`. For mods. |
| `CLAUDE_CODE_DISABLE_HOOK_FORWARDING` | [Undocumented] | Turns off hook forwarding in SDK and remote sessions. See [Plugins and MCP](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/plugins-and-mcp.md). | |
| `DISABLE_BRIEF_MODE_STOP_HOOK` | [Undocumented] | Skips the brief-mode check at the end of a turn. See [Features and Toggles](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/features-and-toggles.md). | |
| `CLAUDE_CODE_RESUME_SESSIONSTART_HOOKS_WAIT_MS` | [Undocumented] | Sets how long a resume waits for `SessionStart` hooks. See [Sessions and Storage](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/sessions-and-storage.md). | |

## Settings Keys and Trust

| Item | Status | What it does | Notes |
| --- | --- | --- | --- |
| `hooks` | [Documented] | The event map. | Merges across levels. |
| `disableAllHooks` | [Differs: The schema also says it stops the statusLine command. The Hooks Reference names only hooks.] | Turns hooks off. | Managed hooks stay unless you set it in managed settings. Also works with `--settings`. |
| `allowManagedHooksOnly` | [Documented] | Only managed hooks and hooks of managed-enabled plugins run. | Also narrows `statusLine`, `fileSuggestion`, and `subagentStatusLine`. Managed settings only. |
| `allowedHttpHookUrls` | [Documented] | A URL allowlist for `http` hooks. | `*` is a wildcard. An empty array blocks all. Arrays merge across levels. |
| `httpHookAllowedEnvVars` | [Documented] | A name allowlist for header values. | Intersected with each hook's `allowedEnvVars`. Arrays merge. |
| Workspace trust | [Documented] | Settings hooks wait for the trust dialog. | `-p` and SDK sessions treat the folder as trusted. Hooks of project subagents need the dialog. |
| `/hooks` menu | [Documented] | A read-only browser of your hooks. | Shows where each one comes from. |
| Debug output | [Documented] | `claude --debug-file <path>` writes hook activity. | `CLAUDE_CODE_DEBUG_LOG_LEVEL=verbose` adds matcher lines. |

## Related Pages

- [Hooks](https://xsyetopz.github.io/claude-code-docs/extend/hooks.md): the overview.
- [Handlers](https://xsyetopz.github.io/claude-code-docs/extend/hooks/handlers.md): the fields of each handler type.
- [Input and Output](https://xsyetopz.github.io/claude-code-docs/extend/hooks/input-and-output.md): exit codes and JSON fields.
- [Environment Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars.md): the full variable list.
- [Settings Files and Scopes](https://xsyetopz.github.io/claude-code-docs/configure/settings.md): the settings keys.

Source: [Hooks Reference](https://code.claude.com/docs/en/hooks) and the settings schema (`claude-code-settings.json`).
