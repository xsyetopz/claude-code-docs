---
title: What Changed
description: What changed in Claude Code 2.1.311, the release this site covers, with links to the archive of earlier releases.
sidebar_position: 4
---

This page lists the changes in `2.1.311`, the release this site covers.
It is short on purpose. The site only repeats what its sources say, and it does not guess.
For every fix and small change, read the official [Changelog](https://code.claude.com/docs/en/changelog).

## How to Check Your Version

Run `claude --version`.
The `/release-notes` command shows a cached copy of the [changelog](https://code.claude.com/docs/en/changelog).
This site covers `2.1.311`, the version shown in the navbar.

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

The print and interactive probes matched `2.1.310`, apart from these: the longer `/code-review` listing, the shell name in the environment block, the new result fields, a new store file of the built-in `cc-plugin-agents-md` plugin, and a new order of the same beta headers. Two sweep cases also changed: `CLAUDE_CODE_USE_BEDROCK` with no AWS credentials gave no `init` event within 40 seconds, and `CLAUDE_CODE_DISABLE_1M_CONTEXT` changed the first request's messages. The cause of each is not yet known.

## Earlier Releases

The [Release Archive](release-archive.md) keeps the sections for `2.1.300` to `2.1.310`.
The official [Changelog](https://code.claude.com/docs/en/changelog) lists every release.

## Example

You update to `2.1.311` and type `ultrathink` in a prompt to Opus 5.5. Claude Code runs that turn at `xhigh` effort.
Check the `ultrathink` row, then check your version:

```bash
claude --version
```

## Related Pages

- [Release Archive](release-archive.md)
- [How to Read These Docs](how-to-read.md)
- [What Can I Change](what-can-i-change.md)
- [Files on Disk](files-on-disk.md)
