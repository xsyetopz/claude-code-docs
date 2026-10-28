---
title: What Changed
description: What changed in Claude Code 2.1.312, the release this site covers, with links to the archive of earlier releases.
sidebar_position: 4
---

This page lists the changes in `2.1.312`, the release this site covers.
It is short on purpose. The site only repeats what its sources say, and it does not guess.
For every fix and small change, read the official [Changelog](https://code.claude.com/docs/en/changelog).

## How to Check Your Version

Run `claude --version`.
The `/release-notes` command shows a cached copy of the [changelog](https://code.claude.com/docs/en/changelog).
This site covers `2.1.312`, the version shown in the navbar.

## Version 2.1.311

Released October 26, 2026. Source: [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.311).
Rows marked with the program come from a comparison of the `2.1.310` and `2.1.311` programs. The flags, settings, hooks, and commands did not change.

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| `ultrathink` | <Documented /> | In the interactive terminal on the Anthropic API, the word runs its turn at `xhigh` effort on Opus 5.5, Sonnet 5.5, Haiku 5.5, and Fable 5.1. Typed during a turn, it raises the rest of that turn (the program). | [Models and Providers](../configure/models-and-providers.md#effort) |
| `[1m]` suffix | <Documented /> | Names and IDs drop the suffix and the `(1M context)` label where the suffix has no effect. The suffix is still accepted (the program). | [Models and Providers](../configure/models-and-providers.md#aliases) |
| Compact and continue | <Undocumented /> | A standard-window session that goes over 200K tokens and gets "Usage credits required for 1M context" now compacts and goes on (the program). | [Context and Compaction](../how-it-works/context-and-compaction.md#kinds-of-compaction) |
| Summary asked again | <Undocumented /> | When a compaction reply has no summary, Claude Code usually asks once more before it replaces the conversation (the program). | [Context and Compaction](../how-it-works/context-and-compaction.md#kinds-of-compaction) |
| No retry when the API says so | <Undocumented /> | A `429` or `529` marked `x-should-retry: false` is not retried, also with `CLAUDE_CODE_RETRY_WATCHDOG` (the program). | [Models](../how-it-works/models.md#retries-and-timeouts) |
| Shell timeout output | <Undocumented /> | A `Bash` command that reaches its timeout returns the output so far, and keeps running in the background (the program). | [Shell, Web, and Background Tasks](../reference/tools/shell-and-web.md#how-it-works) |
| `self-hosted-runner` hold flags | <Undocumented /> | `--hold-idle-file` and `--max-hold-min` keep an idle session while your host reports processes it left running (the program). | [Subcommands](../configure/cli/subcommands.md#self-hosted-runner-hold-flags) |
| Permission rule warnings | <Undocumented /> | A startup warning about a rule in a settings file shows once per user until the rule changes (the program). | [Permission Flow](../how-it-works/permission-flow.md#step-by-step) |
| Pro and Max startup | <Undocumented /> | Within an hour of the last Consumer Terms check, startup skips two requests. A refused subscription now points to billing settings (the program). | [Account and Access](../how-it-works/account-and-access.md#when-it-asks-again) |
| Model catalog on cloud providers | <Undocumented /> | On Bedrock, Mantle, Vertex, and Foundry, Claude Code can load model settings from a signed file. `CLAUDE_CODE_MODEL_CATALOG=off` turns this off (the program). | [Models and Effort](../configure/env-vars/models-and-effort.md#variables) |
| `DISABLE_COMPACT` in settings | <Documented /> | Set in a settings file or by a mod's `$.env.set`, it can only turn compaction off (the program). | [Context and Compaction Variables](../configure/env-vars/context-and-compaction.md#variables) |
| `$.prompt.paint` | <Documented /> | A mod can paint styled runs over the draft in the prompt box without changing it (the program). | [Turn and Prompt](../extend/mod-api/turn-prompt.md#members) |
| `pluginDigests` | <Documented /> <ManagedOnly /> | Managed settings can name the digests of the plugin releases that the organization delivers (the program). | [Marketplaces](../extend/plugins/marketplace.md#plugin-digests) |
| New result fields | <Undocumented /> | `Agent` results can carry `toolsUsed`, and `Bash` and `PowerShell` results can carry `subagentCapApplied` (the program). | [Agents and Tasks](../reference/tools/agents-and-tasks.md#result-fields-new-in-21311), [Shell, Web, and Background Tasks](../reference/tools/shell-and-web.md#how-it-works) |
| New environment variables | <Undocumented /> | 36 names are new, such as `CLAUDE_CODE_SESSIONS_OAUTH_TOKEN` and `CLAUDE_CODE_MCP_REGISTRY_FETCH_AT_STARTUP`. `CLAUDE_CODE_TOOL_CONTAINER_PLUGINS_NAMED` is gone (the program). | [Environment Variables](../configure/env-vars/index.md) |

The print and interactive probes matched `2.1.310`, apart from these: the longer `/code-review` listing, the shell name in the environment block, the new result fields, a new store file of the built-in `cc-plugin-agents-md` plugin, and a new order of the same beta headers. With `CLAUDE_CODE_DISABLE_1M_CONTEXT` set, the skill listing in the first request now gives skill names without their descriptions. With 1M off, Opus 5.5 gets a 6,000-character listing budget (200,000 tokens × 3 characters × 1%, the program), and the longer `2.1.311` listing no longer fits; `2.1.310`'s still did. See [Skill Listing Budget](../extend/skills-and-commands/index.md#loading-and-controls). The `CLAUDE_CODE_USE_BEDROCK` sweep case changed only because the probe could reach the AWS instance metadata address on that network. With that lookup off, both versions retry twice and stop with "Could not load AWS credentials".

## Version 2.1.312

Released October 27, 2026. Source: [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.312).
Rows marked with the program come from a comparison of the `2.1.311` and `2.1.312` programs. The flags, settings, hook events, tools, models, and permission rules did not change.

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| Hook concurrency caps | <Undocumented /> | Prompt and agent hooks run at most 24 at a time for each session, sub-agents included, plus at most 12 that waited longer than their event's timeout. A `timeout` under 1 second counts as 1 second (the program). | [Hook Handlers](../extend/hooks/handlers.md#prompt-and-agent-concurrency), [Hook Configuration](../extend/hooks/configuration.md) |
| Subagent `autoCompactWindow` | <Documented /> | A subagent's value can now lower the window that `CLAUDE_CODE_AUTO_COMPACT_WINDOW` sets. It still never raises it (the program). | [Subagent Frontmatter](../extend/subagents/frontmatter.md), [Context and Compaction](../how-it-works/context-and-compaction.md) |
| `Write` on a part-read file | <Undocumented /> | `Write` refuses to overwrite a very large `CLAUDE.md`, rules file, or `@`-included file when Claude read only its start. The message asks Claude to read it all or to edit in place (the program). | [File Tools](../reference/tools/files.md#write-on-a-file-that-claude-read-only-in-part) |
| Skills after a Bash `cd` | <Undocumented /> | Per-directory and `paths:` skills are found after a `cd` deeper into the same git work tree. The base stays the session's first directory (the program). | [Skill Frontmatter](../extend/skills-and-commands/frontmatter.md#skill-discovery-with-bash-cd) |
| Effort level in force | <Undocumented /> | The spinner, the OpenTelemetry `effort` attribute, and the transcript name the level the model applied, not a level just picked (the program). | [OpenTelemetry Events](../reference/opentelemetry.md#what-two-attributes-report), [Transcript Format](../reference/transcript-format.md), [Models and Providers](../configure/models-and-providers.md#effort) |
| `claude_code.safety_event` | <Gated note="Server flag tengu_snoopy_creek, default false" /> | Claude Code no longer sends the event by default. The gate `tengu_snoopy_creek` now defaults to `false`, and the code that sends the event is still there (the program). | [OpenTelemetry Events](../reference/opentelemetry.md#events) |
| `mcp_server.name` | <Undocumented /> | The attribute reports the real name of a fixed-URL remote MCP server that a plugin from an official marketplace declares, in place of `custom` (the program). | [OpenTelemetry Events](../reference/opentelemetry.md#what-two-attributes-report) |
| Shorter system prompt | <Documented /> | A model name that Claude Code does not recognize, such as a custom deployment name or an inference profile ARN, gets the shorter system prompt. `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0` keeps the full one (the program). | [System Prompt](../how-it-works/system-prompt.md#names-that-claude-code-does-not-recognize), [Models and Effort](../configure/env-vars/models-and-effort.md#variables) |
| Model switch after a flag | <Documented /> | The automatic switch after a flagged message also covers a model name that Claude Code does not recognize. `CLAUDE_CODE_DISABLE_REFUSAL_FALLBACK=1` turns the switch off (the program). | [Models and Providers](../configure/models-and-providers.md#automatic-switches-and-the-prompt-for-unrecognized-names) |
| `oidc.user_id_claim` | <Undocumented /> | The Claude apps gateway can identify a person by an id_token claim other than `sub`, such as Microsoft Entra ID's `oid`. The default is `sub` (the program). | [Authentication Settings](../configure/settings/auth.md#claude-apps-gateway-server-key) |
| Vim `d`, `c`, `y` with `gj` or `gk` | <Undocumented /> | A count larger than the display lines left only moves the cursor. Before, it could delete or copy text (the program). | [Keybindings](../configure/keybindings.md#vim-mode-operators-with-gj-and-gk) |
| Click to send | <Undocumented /> | In fullscreen rendering with mouse mode `full`, a click on the "send now" hint under a queued message sends it (the program). | [Keybindings](../configure/keybindings.md#click-to-send-a-queued-message) |
| A command with a bad name | <Undocumented /> | One command whose name is not a string no longer stops the whole command list. The program skips it and reports why (the program). | [Slash Commands](../extend/skills-and-commands/slash-commands.md#when-a-command-name-is-not-valid) |
| `/verify` in the menu | <Documented /> | `/help` and the `/` menu show the short description "Try your change and report if it works". The long description still goes to Claude (the program). | [Bundled Skills](../extend/skills-and-commands/bundled-skills.md) |
| "5-hour limit" | <Documented /> | Usage limit messages call the 5-hour window the "5-hour limit", not the "session limit" (the program). | [Account and Access](../how-it-works/account-and-access.md#what-the-usage-limits-are-called) |
| Cache warning wording | <Undocumented /> | The `/model` and `/effort` confirmation no longer promises that the re-read waits for your next message (the program). | [Models and Providers](../configure/models-and-providers.md#effort) |
| Three commands removed | <Documented /> | `/artifact-components`, `/prototype`, and `/workshop` are gone (the program). | [Bundled Skills](../extend/skills-and-commands/bundled-skills.md) |
| Two new environment variables | <Undocumented /> | `CLAUDE_CODE_HOST_GUARDS_ARTIFACTS_MCP` and `CLAUDE_CODE_REMOTE_TOOLS_HOST_IDLE_RELEASE_MINUTES`. `CLAUDE_CODE_MCP_HANDED_LISTINGS` and `CLAUDE_WORKSHOP_PROGRESS` are gone (the program). | [Environment Variables](../configure/env-vars/index.md) |
| One new endpoint | <Undocumented /> | `PATCH /api/oauth/account/settings?opt_in_only_if_unset=grove_enabled` (the program). | [API Endpoints](../reference/api/endpoints.md) |
| One new error text | <Undocumented /> | The plugin CLI reports a run that was granted artifact publishing (the program). | [Plugin CLI](../extend/plugins/cli.md#errors) |

The release notes also list fixes that no setting and no page covers: a `Read` of a PDF page that failed while the clean-up of old session files ran, a first reply that could be missing after a resume, a session that showed as waiting on you, and two agent view fixes. The notes list more items for VS Code, Cloud sessions, Remote Control, Claude Tag, and Code Review, which this site does not cover.

## Earlier Releases

The [Release Archive](release-archive.md) keeps the sections for `2.1.300` to `2.1.311`.
The official [Changelog](https://code.claude.com/docs/en/changelog) lists every release.

## Example

You update to `2.1.312` and run a hook of the `prompt` type on a busy session. Claude Code runs at most 24 of those hooks at a time.
Check the hook concurrency row, then check your version:

```bash
claude --version
```

## Related Pages

- [Release Archive](release-archive.md)
- [How to Read These Docs](how-to-read.md)
- [What Can I Change](what-can-i-change.md)
- [Files on Disk](files-on-disk.md)
