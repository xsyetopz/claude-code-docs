---
title: "Hook Handlers"
description: "The five hook handler types, command, http, mcp_tool, prompt, and agent, with every field."
url: https://xsyetopz.github.io/claude-code-docs/extend/hooks/handlers
source: docs/extend/hooks/handlers.md
---

# Hook Handlers


A handler is the part of a hook that does the work.
It can run a command, call a URL, call an MCP tool, ask a model, or start a subagent.
The `type` key picks which one.
For example, `{"type": "command", "command": "./check.sh"}` runs a script.

Remove the entry, or use `disableAllHooks`, to turn a handler off.

## Example

An HTTP hook that posts every `Stop` event to a local service.

```json title=".claude/settings.json"
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "http",
            "url": "http://localhost:8080/claude-stop",
            "headers": { "Authorization": "Bearer $HOOK_TOKEN" },
            "allowedEnvVars": ["HOOK_TOKEN"],
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

Only names in `allowedEnvVars` are filled into headers. Other references become empty strings.

## Handler Types

| Type | Status | What it does | Events it works on |
| --- | --- | --- | --- |
| `command` | [Documented] | Runs a shell command or an executable. Input on `stdin`. Result by exit code, `stdout`, and `stderr`. | All 33 events. |
| `http` | [Documented] | Sends the input as JSON in a POST to a URL. The result is the response body, and needs a 2xx status. | 31 events. Not `SessionStart` and not `Setup`. |
| `mcp_tool` | [Documented] | Calls a tool on a configured MCP server. The text result is read like `stdout`. A result with `isError: true` is a non-blocking error. | 33 events, but skipped on `Setup` and on `SessionStart` at launch. |
| `prompt` | [Documented] | One model call that returns `ok`. | 12 events, plus `PermissionRequest`. |
| `agent` | [Documented] [Experimental] | A subagent that checks a condition. Up to 50 turns. Experimental, and the docs say it may change. | 12 events. Not `PermissionRequest`. |
| `callback` | [Undocumented] | A function that an SDK host or a mod registers. | Events that run device hooks. It is not a config key. |
| `script` | [Differs: Rejected in 2.1.304. Do not use.] | Some text names this type. | `2.1.304` rejects it with `Unknown hook type "script"`. A `script` entry under `PreToolUse` also disables the whole settings file it sits in. |

The 12 events of `prompt` and `agent` are `PermissionDenied`, `PostToolBatch`, `PostToolUse`, `PostToolUseFailure`, `PreToolUse`, `Stop`, `SubagentStop`, `TaskCompleted`, `TaskCreated`, `TeammateIdle`, `UserPromptExpansion`, and `UserPromptSubmit`.
`SessionStart` and `Setup` accept `command` and `mcp_tool` only.

> **Warning:** A `script` hook never runs in `2.1.304`. Worse, one `script` entry under `PreToolUse` turns off every hook in that settings file.
> Source: a probe of the program (see [Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md)).

## Common Fields

| Field | Status | What it does | Notes |
| --- | --- | --- | --- |
| `type` | [Documented] | Picks the handler kind. | One of `command`, `http`, `mcp_tool`, `prompt`, `agent`. |
| `if` | [Documented] | One permission rule that filters the handler. | Only tool events read it. See [Configuration](https://xsyetopz.github.io/claude-code-docs/extend/hooks/configuration.md#the-if-filter). |
| `timeout` | [Documented] | Seconds before Claude Code cancels the hook. | A positive number. Defaults are on [Configuration](https://xsyetopz.github.io/claude-code-docs/extend/hooks/configuration.md#timeouts). |
| `statusMessage` | [Documented] | Spinner text while the hook runs. | A string. |
| `once` | [Documented] | Removes the hook after its first successful run. | A failure, exit 2, or timeout keeps it. Honored only in skill frontmatter. |

## Command Fields

| Field | Status | What it does | Notes |
| --- | --- | --- | --- |
| `command` | [Documented] | The command string, or the program to run when `args` is set. | Shell form uses `sh -c`, Git Bash, or PowerShell. |
| `args` | [Documented] | An argument list for exec form. | No shell runs. Placeholders are replaced in `command` and in each element. |
| `shell` | [Documented] | `bash` or `powershell`. | Ignored when `args` is set. |
| `async` | [Documented] | Runs in the background. | `timeout` is not enforced. The hook cannot block. Output arrives on the next turn. |
| `asyncRewake` | [Documented] | A background run that wakes the model on exit 2. | `stderr` (or `stdout` if `stderr` is empty) becomes a system reminder. `timeout` still applies. Implies `async`. |
| `onFailure` | [Documented] | `continue` or `block`. | Needs 2.1.295. See [Configuration](https://xsyetopz.github.io/claude-code-docs/extend/hooks/configuration.md#failure-handling). Also works on `http`. |
| `rewakeMessage` | [Undocumented] | A custom prefix for the system reminder of `asyncRewake`. | An internal field. |
| `rewakeSummary` | [Undocumented] | A one-line summary shown to you for `asyncRewake`. | An internal field. Default text is `Stop hook feedback`. |
| `cloud` | [Undocumented] | `device` or `skip` for cloud sessions that this machine drives. | An internal field. An unknown value reads as `skip`. Also works on `http`. |

## HTTP Fields

| Field | Status | What it does | Notes |
| --- | --- | --- | --- |
| `url` | [Documented] | The POST target. | Must pass `allowedHttpHookUrls` when that setting exists. |
| `headers` | [Documented] | Extra request headers. | `$VAR` and `${VAR}` are replaced only for names in `allowedEnvVars`. |
| `allowedEnvVars` | [Documented] | Names that may be replaced in headers. | Other references become empty strings. `httpHookAllowedEnvVars` narrows the list. |
| `onFailure` | [Documented] | `continue` or `block`. | A non-2xx status or a connection error counts as a failure. |

## MCP Tool Fields

| Field | Status | What it does | Notes |
| --- | --- | --- | --- |
| `server` | [Documented] | The name of a configured MCP server. | Plugin servers use `plugin:<plugin>:<server>`. |
| `tool` | [Documented] | The tool to call. | A string. |
| `input` | [Documented] | The tool arguments. | String values accept `${path}` from the hook input, such as `${tool_input.file_path}`. |

On events that can block, Claude Code waits for a server that is still connecting.
The wait lasts at most `MCP_TIMEOUT` and the hook `timeout`.
On observer events, it does not wait.

## Prompt and Agent Fields

| Field | Status | What it does | Notes |
| --- | --- | --- | --- |
| `prompt` | [Documented] | The text to evaluate. | `$ARGUMENTS` is replaced by the input JSON. Without it, Claude Code appends the JSON. |
| `model` | [Differs: Docs: the default is the background model for both types. Program: the agent default is Haiku.] | The model for the check. | Applies to `prompt` and `agent`. |
| `continueOnBlock` | [Documented] | Feeds an `ok: false` reason to Claude and goes on. | `prompt` only. Default `false`. Agent hooks always act as if `true`. |
| `ok` (model reply) | [Documented] | `true` allows. `false` blocks. | The effect of `false` per event is in the Response schema section of the Hooks Reference. |
| `reason` (model reply) | [Documented] | Why the model blocked. | Required when `ok` is `false`. |
| `impossible` (model reply) | [Documented] | The condition can never be met. | On `Stop` and `SubagentStop` the turn ends. Agents ignore it. `prompt` only. |

## Related Pages

- [Hooks](https://xsyetopz.github.io/claude-code-docs/extend/hooks.md): the overview.
- [Configuration](https://xsyetopz.github.io/claude-code-docs/extend/hooks/configuration.md): matchers, `if`, timeouts, and failure handling.
- [Input and Output](https://xsyetopz.github.io/claude-code-docs/extend/hooks/input-and-output.md): what each handler can answer.

Source: [Hooks Reference](https://code.claude.com/docs/en/hooks) and the program (handler schemas for `command`, `prompt`, `mcp_tool`, `http`, and `agent`).
Cloud sessions forward only your own hooks of kind `command` and `http` from user settings, `settings.local.json`, or `--settings`. They never forward `prompt`, `agent`, or `mcp_tool` hooks, or plugin or managed hooks. A device client registers up to 128 hooks with a lease of 60 to 3600 seconds (600 by default), and the cloud worker calls back with `hook_callback`. We read these rules in the program and did not run them, because a cloud session needs a login (needs a cloud session, not run).
