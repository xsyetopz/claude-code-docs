---
title: What Changed
description: What changed in Claude Code 2.1.314, the release this site covers, against 2.1.312, the release before it.
sidebar_position: 4
---

This page lists the changes in `2.1.314`, the release this site covers, against `2.1.312`, the release before it.
It is short on purpose. The site only repeats what its sources say. It does not guess.
For every fix and small change, read the official [Changelog](https://code.claude.com/docs/en/changelog).

## How to Check Your Version

Run `claude --version`.
The `/release-notes` command shows a cached copy of the [changelog](https://code.claude.com/docs/en/changelog).
This site covers `2.1.314`, the version shown in the navbar.

## Version 2.1.314

Released October 30, 2026. Source: [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.314).
There is no `2.1.313`. The tag `v2.1.313` is not published, and the official changelog goes from `2.1.314` to `2.1.312`.
Rows marked with the program come from a comparison of the `2.1.312` and `2.1.314` programs. In that comparison the hook events, betas, model names, OpenTelemetry events, and permission rules are the same in both.

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| `blockWritesOutsideWorkingDirectories` | <Documented /> | A new permission setting. `Write`, `Edit`, and `NotebookEdit` refuse a path outside the working directories in every permission mode, and no allow rule lifts it. It also refuses a write to a Claude Code settings file inside the working directories, and it takes `EnterWorktree` and `ExitWorktree` out of the tools on offer. It does not limit shell commands, MCP tools, the programs that hooks run, or the memory tools (the program). | [Permission Rules](../configure/permissions/rules.md), [File Tools](../reference/tools/files.md) |
| `blockReadsOutsideWorkingDirectories` | <Documented /> | The read rule now states that no allow rule lifts it (the program). | [Permission Rules](../configure/permissions/rules.md) |
| `sandbox.excludedCommands` | <Documented /> | An entry takes a call out of the sandbox only when every command in the call matches an entry. In a pipe or a chain such as `a && b`, each part needs its own match. A call with a `cd`, a command substitution, or a redirect other than a file-descriptor duplication such as `2>&1` stays sandboxed (the program). | [Sandbox](../configure/permissions/sandbox.md) |
| `sandbox.allowMachLookup` | <Documented /> | Each entry lets a sandboxed command reach a service outside the sandbox, and the sandbox does not confine what that service does for it (the program). | [Sandbox](../configure/permissions/sandbox.md) |
| `idleCompaction` defaults to true | <Documented /> | The setting now says it defaults to `true`. In `2.1.312` it said that setting it to `true` does not turn idle compaction on (the program). | [Context and Compaction](../how-it-works/context-and-compaction.md) |
| `FORCE_HYPERLINK` now forces | <Documented /> | The value decides. `0`, `false`, `no`, and `off` turn terminal hyperlinks off, and any other non-empty value turns them on. In `2.1.312` the value did nothing: with the name set, the support of the terminal decided, and the checks for `TERM_PROGRAM`, tmux, Windows Terminal, and kitty were skipped (the program). | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| Two answers on a turn | <Undocumented /> | A new `responseComparisonEnabled` setting and a new `CLAUDE_CODE_DISABLE_RESPONSE_COMPARISON` variable. The schema says that `false` stops Claude Code showing two answers to one message and asking which is better, and it marks the setting `@internal`. No code in the program reads either name, so neither shows an effect yet (the program). | [Settings](../configure/settings/index.md) |
| `/send-to-project` | <Undocumented /> | A new slash command, with the two new tools `SendToProject` and `SendToProjectContext` (the program). | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `--agents-view-if-allowed` | <Undocumented /> | A new hidden flag. The program accepts it, and also before a subcommand word, but no code reads its value, so it shows no effect (the program). | [CLI Flags](../configure/cli/flags.md) |
| `effortSlider:adaptive` | <Undocumented /> | A new keybinding action. No default key binds it (the program). | [Unbound and Reserved](../configure/keybindings/unbound-and-reserved.md) |
| `$.ui.place` | <Undocumented /> | A new Mod API call, with its `ui.place` event (the program). | [Mod API](../extend/mod-api/index.md) |
| Eleven new environment variables | <Undocumented /> | Eight have a row, among them `CLAUDE_CODE_STREAM_EVENT_HOLD_MS`, `CLAUDE_CODE_STREAM_EVENT_MAX_LINE_BYTES`, `CLAUDE_CODE_CCR_LONG_POLL`, and `CLAUDE_CODE_MEMORY_CONTEXT_NO_WAIT`. The other three show no effect that a user can reach, so no page lists them (the program). | [Environment Variables](../configure/env-vars/index.md) |
| Three environment variables gone | <Undocumented /> | `CCR_PREFETCH_NETWORK`, `CCR_PREWARM_STAT`, and `CCR_PREWARM_VDA` (the program). | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| Eight new endpoints | <Undocumented /> | Among them `/v1/code/channels` and `/v1/code/mcp/meta` (the program). | [API Endpoints](../reference/api/endpoints.md) |
| `total_tokens` reminder off for two models | <Undocumented /> | The `<total_tokens>` block that reports the tokens left no longer goes in the prompt for Sonnet 5.5 or Opus 5.5. The program gives the block to a model that carries the `total_tokens_reminder` capability, and only these two models lost it. The other twenty models keep it. `CLAUDE_CODE_TOTAL_TOKENS_REMINDER` still overrides. Probe `print.transcripts.lines` drops from 131 lines to 120 and loses the `total_tokens_reminder` attachment, and probe `print.transcripts.attachments` loses it in all three runs (the program). | [System Prompt](../how-it-works/system-prompt.md) |
| No more `output_limit_note` attachment | <Undocumented /> | Nothing writes the `output_limit_note` attachment any more. The code that built `{type: "output_limit_note", model, text}` is gone, and only the reader, the renderer and the kind lists are left, so the kind still parses in a transcript that an older release wrote (the program). | [Transcript Format](../reference/transcript-format.md) |
| `CLAUDE_CODE_CONFIG_PROBE` drops self-queued prompts | <Undocumented /> | With the variable set, the process now drops any user message it queues for itself and answers only its host's request. The debug log reads "Dropped a user message that this process queued for itself". Probe `print.sweep` shows every request and `init` key differing from the baseline with the variable set, where `2.1.312` showed none (the program). | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| New `original_games` prompt section | <Undocumented /> | Opus 5.5 gets one more line in the system prompt: build an original game, and not a copy of a named existing game. The program gives the line to a model that carries `opus_5_5_prompt_bundle` (Opus 5.5) or the new `original_games_guidance` capability (Mythos 5.1). A chat entrypoint leaves it out, and the server can switch it off. A `prompt.section` hook sees it under the name `additional_guidance`, as it already does for `heron_brook` and `opus5_reduced_delegation`. The capture of the Opus 5.5 prompt grows by 190 characters and loses the 51 of `<total_tokens>`, which is the whole 139-character change that probe `print.models.matrix` reports (the program). | [System Prompt](../how-it-works/system-prompt.md) |
| `--setting-sources` | <Undocumented /> | A settings source that you leave out no longer supplies auto-mode rules or saved permission consents. Managed settings and `--settings` stay (the program). | [Settings](../configure/settings/index.md) |
| Server-managed settings copy | <Undocumented /> | `Write` and `Edit` now ask before they change the local copy of your organization's server-managed settings, as they do for a user settings file (the program). | [Settings](../configure/settings/index.md) |
| `Bash` hooks cover `Monitor` | <Undocumented /> | A hook that matches `Bash` now also runs for a `Monitor` call that holds a `command`. Such a hook can deny or ask; an `allow` decision and an `updatedInput` are ignored. It does not cover a `ws` monitor (the program). | [Shell and Web Tools](../reference/tools/shell-and-web.md) |
| `which` in `Bash` | <Gated note="Needs the server gate tengu_swirling_koala" /> | The shell clears an inherited `which` alias or function first, so `which` is the system command or the shell builtin (the program). | [Shell and Web Tools](../reference/tools/shell-and-web.md) |
| `git grep` on macOS | <Undocumented /> | On macOS the program adds a `git` shell function that runs `git grep` under `LC_ALL=C`. It applies only to a short ASCII command with no earlier variable assignment, no `git` alias or function already set, and no conflicting `git grep` option (the program). | [Shell and Web Tools](../reference/tools/shell-and-web.md) |

The release notes list many more fixes. The site states one only after a check in the program or a probe, so a fix that no setting and no page reaches is left out. The notes also list items for VS Code, Cloud sessions, Remote Control, Claude Tag, and Code Review. This site does not cover them.

## Earlier Releases

This site keeps no page for an older release. The official [Changelog](https://code.claude.com/docs/en/changelog) lists every release.

## Example

You update to `2.1.314` and set `permissions.blockWritesOutsideWorkingDirectories` to `true`.
`Write` and `Edit` then refuse a path outside your working directories in every permission mode, and an allow rule does not lift that.
Check the first row. Then check your version:

```bash
claude --version
```

## Related Pages

- [How to Read These Docs](how-to-read.md)
- [What Can I Change](what-can-i-change.md)
- [Files on Disk](files-on-disk.md)
