---
title: What Changed
description: What changed in Claude Code 2.1.312, the release this site covers, with links to the archive of earlier releases.
sidebar_position: 4
---

This page lists the changes in `2.1.312`, the release this site covers.
It is short on purpose. The site only repeats what its sources say. It does not guess.
For every fix and small change, read the official [Changelog](https://code.claude.com/docs/en/changelog).

## How to Check Your Version

Run `claude --version`.
The `/release-notes` command shows a cached copy of the [changelog](https://code.claude.com/docs/en/changelog).
This site covers `2.1.312`, the version shown in the navbar.

## Version 2.1.312

Released October 27, 2026. Source: [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.312).
Rows marked with the program come from a comparison of the `2.1.311` and `2.1.312` programs. The flags, settings, hook events, tools, models, and permission rules did not change.

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| Hook concurrency caps | <Undocumented /> | Prompt and agent hooks run at most 24 at a time for each session, sub-agents included. In addition, at most 12 hooks that waited longer than their event's timeout run. A `timeout` under 1 second counts as 1 second (the program). | [Hook Handlers](../extend/hooks/handlers.md#prompt-and-agent-concurrency), [Hook Configuration](../extend/hooks/configuration.md) |
| Subagent `autoCompactWindow` | <Documented /> | A subagent's value can now lower the window that `CLAUDE_CODE_AUTO_COMPACT_WINDOW` sets. It still never raises it (the program). | [Subagent Frontmatter](../extend/subagents/frontmatter.md), [Context and Compaction](../how-it-works/context-and-compaction.md) |
| `Write` on a part-read file | <Undocumented /> | `Write` refuses to overwrite a very large `CLAUDE.md`, rules file, or `@`-included file when Claude read only its start. The message asks Claude to read it all or to edit in place (the program). | [File Tools](../reference/tools/files.md#write-on-a-file-that-claude-read-only-in-part) |
| Skills after a Bash `cd` | <Undocumented /> | Claude Code finds per-directory and `paths:` skills after a `cd` deeper into the same git work tree. The base stays the session's first directory (the program). | [Skill Frontmatter](../extend/skills-and-commands/frontmatter.md#skill-discovery-with-bash-cd) |
| Effort level in force | <Undocumented /> | The spinner, the OpenTelemetry `effort` attribute, and the transcript name the level the model applied, not a level just picked (the program). | [OpenTelemetry Events](../reference/opentelemetry.md#what-two-attributes-report), [Transcript Format](../reference/transcript-format.md), [Models and Providers](../configure/models-and-providers/effort-thinking-and-fallback.md#effort) |
| `claude_code.safety_event` | <Gated note="Server flag tengu_snoopy_creek, default false" /> | Claude Code no longer sends the event by default. The gate `tengu_snoopy_creek` now defaults to `false`. The code that sends the event is still there (the program). | [OpenTelemetry Events](../reference/opentelemetry.md#events) |
| `mcp_server.name` | <Undocumented /> | The attribute reports the real name of a fixed-URL remote MCP server. This applies when a plugin from an official marketplace declares the server. The name replaces `custom` (the program). | [OpenTelemetry Events](../reference/opentelemetry.md#what-two-attributes-report) |
| Shorter system prompt | <Documented /> | A model name that Claude Code does not recognize, such as a custom deployment name or an inference profile ARN, gets the shorter system prompt. `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0` keeps the full one (the program). | [System Prompt](../how-it-works/system-prompt.md#names-that-claude-code-does-not-recognize), [Models and Effort](../configure/env-vars/models-and-effort.md#variables) |
| Model switch after a flag | <Documented /> | The automatic switch after a flagged message also covers a model name that Claude Code does not recognize. `CLAUDE_CODE_DISABLE_REFUSAL_FALLBACK=1` turns the switch off (the program). | [Models and Providers](../configure/models-and-providers/effort-thinking-and-fallback.md#automatic-switches-and-the-prompt-for-unrecognized-names) |
| `oidc.user_id_claim` | <Undocumented /> | The Claude apps gateway can identify a person by an id_token claim other than `sub`, such as Microsoft Entra ID's `oid`. The default is `sub` (the program). | [Authentication Settings](../configure/settings/auth.md#claude-apps-gateway-server-key) |
| Vim `d`, `c`, `y` with `gj` or `gk` | <Undocumented /> | A count larger than the display lines left only moves the cursor. Before, it could delete or copy text (the program). | [Keybindings](../configure/keybindings/unbound-and-reserved.md#vim-mode-operators-with-gj-and-gk) |
| Click to send | <Undocumented /> | In fullscreen rendering with mouse mode `full`, a click on the "send now" hint under a queued message sends it (the program). | [Keybindings](../configure/keybindings/unbound-and-reserved.md#click-to-send-a-queued-message) |
| A command with a bad name | <Undocumented /> | One command whose name is not a string no longer stops the whole command list. The program skips it and reports why (the program). | [Slash Commands](../extend/skills-and-commands/slash-commands.md#when-a-command-name-is-not-valid) |
| `/verify` in the menu | <Documented /> | `/help` and the `/` menu show the short description "Try your change and report if it works". The long description still goes to Claude (the program). | [Bundled Skills](../extend/skills-and-commands/bundled-skills.md) |
| "5-hour limit" | <Documented /> | Usage limit messages call the 5-hour window the "5-hour limit", not the "session limit" (the program). | [Account and Access](../how-it-works/account-and-access.md#what-the-usage-limits-are-called) |
| Cache warning wording | <Undocumented /> | The `/model` and `/effort` confirmation no longer promises that the re-read waits for your next message (the program). | [Models and Providers](../configure/models-and-providers/effort-thinking-and-fallback.md#effort) |
| `/usage` rate-limit wording | <Undocumented /> | A rate-limited usage page now says `Claude is temporarily limiting requests to the usage page (not your usage limit). Try again in a moment.` The panel suffix is `(requests temporarily limited — try again in a moment)`. Both say that the limit is on the page, not on your usage (the program). | [Slash Commands](../extend/skills-and-commands/slash-commands.md#how-usage-and-artifacts-work) |
| Three commands removed | <Documented /> | `/artifact-components`, `/prototype`, and `/workshop` are gone (the program). | [Bundled Skills](../extend/skills-and-commands/bundled-skills.md) |
| Two new environment variables | <Undocumented /> | `CLAUDE_CODE_HOST_GUARDS_ARTIFACTS_MCP` and `CLAUDE_CODE_REMOTE_TOOLS_HOST_IDLE_RELEASE_MINUTES`. `CLAUDE_CODE_MCP_HANDED_LISTINGS` and `CLAUDE_WORKSHOP_PROGRESS` are gone (the program). | [Environment Variables](../configure/env-vars/index.md) |
| One new endpoint | <Undocumented /> | `PATCH /api/oauth/account/settings?opt_in_only_if_unset=grove_enabled` (the program). | [API Endpoints](../reference/api/endpoints.md) |
| One new error text | <Undocumented /> | The plugin CLI reports a run that was granted artifact publishing (the program). | [Plugin CLI](../extend/plugins/cli.md#errors) |

The release notes also list fixes that no setting and no page covers. One fix is for a `Read` of a PDF page that failed while the clean-up of old session files ran. One is for a first reply that could be missing after a resume. One is for a session that showed as waiting on you. Two are agent view fixes. The notes list more items for VS Code, Cloud sessions, Remote Control, Claude Tag, and Code Review. This site does not cover them.

## Earlier Releases

The [Release Archive](release-archive.md) keeps the sections for `2.1.300` to `2.1.311`.
The official [Changelog](https://code.claude.com/docs/en/changelog) lists every release.

## Example

You update to `2.1.312` and run a hook of the `prompt` type on a busy session. Claude Code runs at most 24 of those hooks at a time.
Check the hook concurrency row. Then check your version:

```bash
claude --version
```

## Related Pages

- [Release Archive](release-archive.md)
- [How to Read These Docs](how-to-read.md)
- [What Can I Change](what-can-i-change.md)
- [Files on Disk](files-on-disk.md)
