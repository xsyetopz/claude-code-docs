---
title: "What Changed"
description: "What changed in the Claude Code releases near 2.1.305, newest first, as far as the changelog and a version comparison show."
url: https://xsyetopz.github.io/claude-code-docs/start/what-changed
source: docs/start/what-changed.md
---

# What Changed


This page lists changes in the last few releases up to `2.1.305`.
It is short on purpose. The site only repeats what its sources say, and it does not guess.
For every fix and small change, read the official [Changelog](https://code.claude.com/docs/en/changelog).

## How to Check Your Version

Run `claude --version`.
The `/release-notes` command shows a cached copy of the [changelog](https://code.claude.com/docs/en/changelog).
This site covers `2.1.305`, the version shown in the navbar.

## Version 2.1.305

Released October 20, 2026. Source: [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.305).
Rows marked with the program come from a comparison of the `2.1.304` and `2.1.305` programs.

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| `plugin validate --profile` | [Undocumented] | `--profile directory` also checks a plugin against the plugin directory's submission rules, with checks such as README, `LICENSE`, icon, and `privacyPolicyUrl`. It is not in the release notes (the program). | [Plugin CLI](https://xsyetopz.github.io/claude-code-docs/extend/plugins/cli.md) |
| `/usage` fixes | [Documented] | Each warning is a one-line fix that names its source, and `f` applies the fixes. The same fixes appear in VS Code and `/doctor`. | [Slash Commands](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/slash-commands.md) |
| `/artifacts` delete | [Documented] | 1 or Enter keeps, 2 deletes, Esc cancels. `y` and `n` no longer answer. | [Slash Commands](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/slash-commands.md) |
| Tool search retry | [Documented] | Claude Code retries without tool search when the endpoint or a gateway rejects it, or when `ToolSearch` is disallowed or left out of `--tools`. This fixes a `2.1.304` regression. | [MCP Runtime](https://xsyetopz.github.io/claude-code-docs/extend/mcp/runtime.md) |
| Mod API | [Documented] | A docked pane stays within 45% of the terminal's width. `Image` draws in iTerm2 3.5 and later with fullscreen rendering. | [Mod API UI Types](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/types/ui.md) |
| Bash on a full disk | [Documented] | The error says the disk is full and that nothing ran. | [Shell and Web Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/shell-and-web.md) |
| Remote Control `!` commands | [Undocumented] | A `!` command sent over Remote Control is not run, and the message tells you to run it on the computer itself (the program). | [Slash Commands](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/slash-commands.md) |

The release also adds `sandbox.allowNestedUserNamespaces`, `CLAUDE_CODE_RETRY_WATCHDOG_USAGE_LIMIT_RECHECK_MS`, and many fixes.
Read the [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.305) for the full list.

## Version 2.1.304

Released October 19, 2026. Source: [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.304).
Rows marked with the program come from a comparison of the `2.1.303` and `2.1.304` programs.

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| Tool search on by default | [Documented] | Tool search is on behind a custom `ANTHROPIC_BASE_URL`. A 400 or 422 from the gateway is retried without it. The site's captures use a local stub as `ANTHROPIC_BASE_URL`, so the main prompt there now lists 12 tools, not 20. | [Tools Reference](https://xsyetopz.github.io/claude-code-docs/reference/tools.md) and [Tools per Variant](https://xsyetopz.github.io/claude-code-docs/prompts/tools-per-variant.md) |
| `/auto-mode-setup` | [Documented] | A guided setup that reads your project and recent sessions. It is now on Bedrock, Vertex, Foundry, a Claude apps gateway, and with telemetry off. | [Auto Mode](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode.md) |
| `/claude-api managed-agents-secure` | [Documented] | Compares a Managed Agents agent's settings with Anthropic's security guide. It changes nothing. | [Bundled Skills](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/bundled-skills.md) |
| `/artifacts` delete | [Documented] | The confirmation shows numbered choices: 1 or Enter keeps, 2 deletes. | [Slash Commands](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/slash-commands.md) |
| `--disable-slash-commands` | [Documented] | The help text now says it disables skills and commands. | [Skills and Commands](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands.md) |
| Mounted drive `rm -r` prompt | [Documented] | `rm -r` of a mounted drive or a folder at its top level (`/Volumes`, `/media`, `/mnt/c`) gets a safety prompt. The program has an env var `CLAUDE_CODE_DISABLE_MOUNTED_DRIVE_RM_PROMPT` that skips this check. | [Tools and Bash Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/tools-and-bash.md) |
| `denyRead` brackets on Linux | [Documented] | A `sandbox.filesystem.denyRead` glob such as `[user-id]` no longer stops sandboxed commands from starting. | [Sandbox](https://xsyetopz.github.io/claude-code-docs/configure/permissions/sandbox.md) |
| `CLAUDE_CODE_AUTO_COMPACT_WINDOW` | [Documented] | Accepts `k` and `M` suffixes, and warns when a value is out of range or ignored. | [Context and Compaction Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/context-and-compaction.md) |
| Plugin MCP switches | [Undocumented] | The program has `CLAUDE_CODE_SKIP_PLUGIN_LOCAL_MCP_SERVERS` (only `sse`, `http`, and `ws` plugin servers load) and `CLAUDE_CODE_SKIP_PLUGIN_MCP_BUNDLES`. | [Plugins and MCP Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/plugins-and-mcp.md) |
| Low disk and memory warnings | [Undocumented] | The program reads `CLAUDE_CODE_WARN_DISK_FREE_GIB` and `CLAUDE_CODE_WARN_MEMORY_FREE_GIB`, both `0` by default. | [Remote and Cloud Sessions](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/remote-and-cloud-sessions.md) |
| Mod API changes | [Documented] | `decider: "person"` on `tool.check`, `e.isReadOnly`, and `settings.read` hooks that get each settings layer. | [Mod API](https://xsyetopz.github.io/claude-code-docs/extend/mod-api.md) |
| Fixes | [Documented] | `/usage` names when a rate limit ends. `/effort status` no longer guesses for `auto` or `unset`. Self-paced `/loop` wakeups at the 1-hour maximum no longer miss the prompt cache. | [Slash Commands](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/slash-commands.md) |

The release also changes the `claude --help` text, adds a resume warning on Pro and Max plans, and has many more fixes.
Read the [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.304) for the full list.

## Version 2.1.303

Released October 18, 2026. Source: [Changelog](https://code.claude.com/docs/en/changelog).

The release notes say only "Bug fixes and reliability improvements."
A comparison of the `2.1.302` and `2.1.303` programs found one change in the code: how Claude Code treats `NODE_EXTRA_CA_CERTS`.
Source: the program.

| Change | Status | What it means for you |
| --- | --- | --- |
| Root certificate deny list | [Undocumented] | Claude Code now has a deny list of root certificates. It drops a listed certificate from the `NODE_EXTRA_CA_CERTS` file and prints a message that says so. |
| New CA messages | [Undocumented] | New texts say that Claude Code ignored a block or the whole file, or that no root certificates are left to trust. The last one asks you to update Claude Code. |
| CA store fallback | [Undocumented] | When the system CA API is not available, the debug line now says Claude Code uses the bundled roots. |

The counts of settings keys, hook events, tools, slash commands, CLI flags, and models did not change.
The Mod API type file did not change.
See [Network and Proxy Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/network-and-proxy.md) for the certificate variables.

## Version 2.1.302

Released October 16, 2026. Source: [Changelog](https://code.claude.com/docs/en/changelog).

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| `CLAUDE_CODE_AUTO_MODE_MODEL` added | [Documented] | Picks the model of the client-side auto mode classifier. It does not change server-side auto mode. | [Auto Mode](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode.md) |
| `Idle compaction` row in `/config` | [Documented] | You can turn idle compaction off or on from `/config`. | [Context and Compaction](https://xsyetopz.github.io/claude-code-docs/how-it-works/context-and-compaction.md) |
| Print mode default permission mode | [Documented] | `claude -p` and Agent SDK sessions with no permission mode start in `default` mode on third-party providers, with telemetry off, or on a fresh install. `--permission-mode auto` keeps auto. | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md) |
| Fork subagents on by default | [Documented] | `subagent_type: "fork"` is on in `claude -p`, the Agent SDK, the desktop app, and VS Code, as in the terminal. `CLAUDE_CODE_FORK_SUBAGENT=0` turns it off. | [Subagent Runtime](https://xsyetopz.github.io/claude-code-docs/extend/subagents/runtime.md) |
| Subagents run in the background | [Documented] | The desktop app and VS Code always run the main conversation's subagents in the background. | [Subagent Runtime](https://xsyetopz.github.io/claude-code-docs/extend/subagents/runtime.md) |
| Hook limit | [Documented] | At most 12 prompt or agent hooks of one event run at a time. The rest wait. | [Hook Handlers](https://xsyetopz.github.io/claude-code-docs/extend/hooks/handlers.md) |
| Read tool image limit | [Documented] | Image sources over 128 MB are refused. | [Read tool](https://xsyetopz.github.io/claude-code-docs/reference/tools/files.md) in the Tools reference. |
| Faster plugin startup | [Documented] | Plugin command and agent files take fewer file system calls to load. | [Plugin Loading](https://xsyetopz.github.io/claude-code-docs/extend/plugins/loading.md) |
| Auto mode with a long conversation | [Documented] | The server-side classifier now compacts a conversation that is too long for the check, instead of denying every checked call. | [Auto Mode](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode.md) |
| OpenTelemetry `tool_decision` fixes | [Documented] | `classifier_category` is set for most auto mode blocks. New attributes no longer push out `tool_use_id`, `tool_source`, and `tool_parameters`. | [Telemetry and Debug Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/telemetry-and-debug.md) |

The release also fixes errors when you switch to Vertex or Bedrock in the middle of a session, a prompt cache miss after ToolSearch, and plugin marketplaces that cloned again on every refresh.

## Version 2.1.301

Released October 15, 2026. Source: [Changelog](https://code.claude.com/docs/en/changelog).

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| `CLAUDE_CODE_RETRY_WATCHDOG_MAX_USAGE_LIMIT_WAIT_MS` added | [Documented] | Unattended retry mode ends a request at a usage limit that resets too far away. | [Environment Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars.md) |
| Vim `%` motion | [Documented] | Jumps to the matching bracket, alone or with `d`, `c`, or `y`. | [Changelog](https://code.claude.com/docs/en/changelog) (the changelog entry for 2.1.301) |
| Mod `Input` gets `rows` | [Documented] | A text field of several lines. Enter submits. | [Mod API UI](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/ui.md) |
| Mod hook `.catch` runs less often | [Documented] | It runs only when the hook throws or times out. | [Mod API Hooks](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/hooks.md) |
| Mod `$.env.set` result | [Documented] | It resolves with `{}` once set, or with `{ deny }` and a reason. | [Clock, HTTP, Process, Env, and Settings](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/clock-http-process-env-settings.md) |
| OpenTelemetry `tool_decision` | [Documented] | New `classifier_verdict` and `permission_mode` attributes. | [Telemetry and Debug Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/telemetry-and-debug.md) |
| Model with a smaller context window | [Documented] | The previous model summarizes a conversation that is too long for the new model. | [Context and Compaction](https://xsyetopz.github.io/claude-code-docs/how-it-works/context-and-compaction.md) |

## Version 2.1.300

Released October 14, 2026. Source: [Changelog](https://code.claude.com/docs/en/changelog).

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| Local transcripts record the request | [Documented] | Each API request's system prompt, tools, and parameters now go into the local transcript. A transcript you share can reproduce a request. | [Transcript Format](https://xsyetopz.github.io/claude-code-docs/reference/transcript-format.md) |
| Gzip for large requests | [Documented] | Large requests to api.anthropic.com use gzip even when telemetry is off. `CLAUDE_CODE_GZIP_REQUEST_BODIES=0` turns it off. | [Network and Proxy Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/network-and-proxy.md) |
| `updatedInput` is checked | [Documented] | Input from `PreToolUse` and `PermissionRequest` hooks is checked like Claude's own input. Unknown keys are dropped, and input the tool rejects denies the call. | [Hook Input and Output](https://xsyetopz.github.io/claude-code-docs/extend/hooks/input-and-output.md) |
| Exit stops background commands | [Documented] | Exit force-kills background commands still running 1.5 seconds after the stop request. | [Tools and Bash Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/tools-and-bash.md) |
| `prompt.change` mod hook | [Documented] | Raised when the prompt text changes without a typed edit. | [Mod API Hooks](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/hooks.md) |
| `virtualText` in prompt decorations | [Documented] | Text drawn in the prompt box that never enters the draft. | [Mod API UI](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/ui.md) |
| `$.ui.view({ agentId })` | [Documented] | Shows an agent's transcript in the main view. | [Mod API UI](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/ui.md) |
| `CLAUDE_CODE_DISABLE_ADVISOR_TOOL=1` | [Documented] | Turns off the advisor tool and the `/advisor` command. | [Tools and Bash Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/tools-and-bash.md) |

## Older Releases

This site does not cover versions before `2.1.300` in detail.
The official [Changelog](https://code.claude.com/docs/en/changelog) lists them, and the weekly [What's New](https://code.claude.com/docs/en/whats-new) digest covers the larger features.

> **What We Checked:** The rows for `2.1.300` to `2.1.302` match the changelog text that the program itself stores. The `2.1.304` rows come from the [official release notes](https://code.claude.com/docs/en/changelog) and from a comparison of the `2.1.303` and `2.1.304` programs.
> We ran these `2.1.304` rows again on `2.1.305`, and they held: the print-mode permission default (`init` shows `default`, and `--permission-mode auto` keeps `auto`), the transcript request lines (`api-request`, `api-request-shape`, and `api-request-blob`), the tool search tool list behind a custom base URL, and the `CLAUDE_CODE_AUTO_COMPACT_WINDOW` warnings.
> We also ran these against a local stub with a fake key:
>
> - `/auto-mode-setup` opens its screen ("Teach auto mode about your environment?") behind a custom base URL.
> - `/effort status` prints `Effort level: auto (currently medium)` for `auto`, and `/effort unset` sets `auto`. For a set level it prints `Current effort level: high (...)`.
> - `/loop` with a `ScheduleWakeup` of 7200 seconds was clamped: the tool result said `clamped to 3600s from your requested value`. The cache fix itself cannot be seen with a stub.
> - The Mod API items: `tool.check` got `isReadOnly: true` for `Read`. An ask with `decider: "person"` showed a dialog in the default mode, and in `-p` it was refused as `Permission to use Bash denied by plugin <name>: <reason>`, while an ask without it said `Bash needs approval (asked by plugin <name>: <reason>)`. The `settings.read` hook got `layers`, such as `[{"source":"user","settings":{...}}]`.
> - `denyRead` brackets are a Linux fix. On macOS a sandboxed `echo` with `denyRead` globs holding `[user-id]` ran fine, which does not show the Linux fix.
>
> The `/artifacts` delete confirmation was seen live on `2.1.305`, with a throwaway artifact that the run published and deleted. The panel asks `Delete <title>? This cannot be undone.` It offers `1. No, keep it` and `2. Yes, delete it`, with the first one selected, and the footer says `Esc to go back`. Pressing `y` did nothing. Down then Enter chose yes, the list showed `Deleting…`, then `Artifact deleted`, and a refresh showed an empty list. `2.1.304` added the numbered choices and kept `y`, `n`, and Esc; `2.1.305` dropped `y` and `n`. With an API key and no login, `/artifacts` says `Unknown command`. In print mode with `CLAUDE_CODE_OAUTH_TOKEN` it says `/artifacts isn't available in this environment.` In the interactive screen with that token it opens a panel with the tabs `All`, `Mine`, and `Shared`, and an empty list says `No artifacts yet. Publish one with the Artifact tool.`
>
> On `2.1.305`, `/usage` with an API key shows only session cost and tokens. With `CLAUDE_CODE_OAUTH_TOKEN` it also shows the rate-limit rows (`Current session`, `Current week (all models)`, their `Resets` lines) and then `What's contributing to your limits usage?` with `Scanning local sessions…`. With the token the program did not call the usage endpoint in a 35 second run. The rows came from the rate-limit headers of a model reply. A fuller panel needs a claude.ai login with the `user:inference` and `user:profile` scopes (the program). A local stub with fake subscriber credentials showed the `Resets` lines too. The `rate limited until <time>` text is new in `2.1.304`. It appears only when the usage endpoint is rate limited (the program). A stub that answered `429` showed it, in four forms. See [Slash Commands](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/slash-commands.md). With `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` set, `/usage` shows `Failed to load usage data` and sends no request.
>
> For the `/artifacts` and `/usage` rows, [Documented] means the release notes name them. A local stub saw the rate-limit end-time text. The live run with a real token could not reach it, because the usage endpoint was never called.

## Example

You update from `2.1.301` to `2.1.303` and your `claude -p` job asks for no permission changes.
Check the 2.1.302 row for print mode. If your job used a third-party provider, set the mode on purpose.

```bash
claude --version
claude -p --permission-mode auto "summarize the diff"
```

## Related Pages

- [How to Read These Docs](https://xsyetopz.github.io/claude-code-docs/start/how-to-read.md)
- [What Can I Change](https://xsyetopz.github.io/claude-code-docs/start/what-can-i-change.md)
- [Files on Disk](https://xsyetopz.github.io/claude-code-docs/start/files-on-disk.md)
