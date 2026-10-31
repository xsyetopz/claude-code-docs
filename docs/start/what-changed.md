---
title: What Changed
description: What changed in Claude Code 2.1.316, the release this site covers, against 2.1.314, the release before it.
sidebar_position: 4
---

This page lists the changes in `2.1.316`, the release this site covers, against `2.1.314`, the release before it.
It is short on purpose. The site only repeats what its sources say. It does not guess.
For every fix and small change, read the official [Changelog](https://code.claude.com/docs/en/changelog).

## How to Check Your Version

Run `claude --version`.
The `/release-notes` command shows a cached copy of the [changelog](https://code.claude.com/docs/en/changelog).
This site covers `2.1.316`, the version shown in the navbar.

## Version 2.1.316

Released October 31, 2026. Source: [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.316).
There is no `2.1.315`.
Rows marked with the program come from a comparison of the `2.1.314` and `2.1.316` programs. In that comparison the hook events, betas, commands, model names, keybindings, Mod API calls, OpenTelemetry events, and permission rules are the same in both.

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| `CLAUDE_CODE_DISABLE_ULTRATHINK` | <Undocumented /> | A new variable that turns the `ultrathink` keyword off. | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_SUBAGENT_EFFORT` | <Undocumented /> | A new variable that sets the effort of a subagent when the agent file and the spawning layer name none. `low`, `medium`, `high`, `xhigh`, or `max` (the program, `chunk-05t65sbt.js`). | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| Certificate loop variables | <Undocumented /> | `CLAUDE_CODE_DISABLE_LOOPED_CROSS_CERT_DROP` keeps system cross-certificates that certify each other in a loop. The program also adds `CLAUDE_CODE_DISABLE_SELF_NAMED_CERT_DROP`, which the notes do not name. | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| Managed `autoMode.allow` without `$defaults` | <Documented /> | A `--settings` file, a first rule from `/permissions`, or `/auto-mode-setup` can no longer bring the built-in allow rules back. The scheduled-task rule stays when an allow list replaces the defaults. | [Auto Mode](../configure/permissions/auto-mode.md) |
| Server-managed settings | <Documented /> | Settings from the API of Anthropic apply without an approval prompt for Team and Enterprise logins. That path is also in `2.1.314`. New in `2.1.316`: the program refuses a stored copy that is not a regular file (the program). | [Enterprise](../configure/settings/enterprise.md) |
| `--restricted` and Read allow rules | <Documented /> | A `--restricted` session no longer uploads files outside the working directories when a Read allow rule covers them. | [File Tools](../reference/tools/files.md) |
| `/model <id>` warning | <Documented /> | `/model` warns when this version does not know the model and auto-compact will assume a 200K context window. | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| Bash tool shell | <Documented /> | Aliases with line breaks, functions whose names start with a dash, and scripts with an exported `SHELLOPTS` now work in the shell of the Bash tool. | [Shell and Web Tools](../reference/tools/shell-and-web.md) |
| PowerShell hooks and exit code 2 | <Documented /> | A PowerShell hook blocks on exit code 2 also when the command starts with a type cast, `param`, `using`, or an attribute. | [Hook Handlers](../extend/hooks/handlers.md) |
| Opus 4.8 fast mode | <Documented /> | The notes deprecate fast mode on Opus 4.8, with removal on November 30, 2026. The program shows the same notice in `2.1.314`. | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `bashEditDiffEnabled` default | <Documented /> | Off by default. In `auto` and `bypassPermissions` modes it is on when the Bash tool handles file edits or the model configuration turns it on (the program). | [Core Settings](../configure/settings/core.md) |
| Classifier billing notice | <Undocumented /> | A new form of the notice, for a provider that the Claude desktop app manages: `Auto mode switched to its built-in safety check for this session` (the program, `chunk-qd604jgh.js`). | [Auto Mode](../configure/permissions/auto-mode.md) |
| Two hidden options | <Undocumented /> | The flag `--session-began-as-copy` and the `claude auth login` option `--gateway-json` (the program). | [CLI Flags](../configure/cli/flags.md), [Subcommands](../configure/cli/subcommands.md) |
| Fourteen new environment variables | <Undocumented /> | Each has a row, among them `CLAUDE_CODE_AUTO_MODE_FULL_CONTEXT`, `CLAUDE_CODE_DISABLE_HTTPS_AGENT_KEEPING`, and `CLAUDE_CODE_MCP_SKIP_UNCHANGED_RELIST` (the program). | [Environment Variables](../configure/env-vars/index.md) |
| Spinner after compaction | <Undocumented /> | After an automatic compaction in the middle of a turn, the spinner can show `Running SessionStart hooks…` until the turn ends (the program, `chunk-21856tx9.js`). | [Context and Compaction](../how-it-works/context-and-compaction.md) |

The release notes list many more fixes. The site states one only after a check in the program or a probe, so a fix that no setting and no page reaches is left out. The fix for subagents that inherited a parent subagent model on a wake-up is not confirmed in the program, so this page does not state it. The notes also list items for VS Code, Cloud sessions, the self-hosted runner, the Claude apps gateway, Claude Tag, and Code Review. This site does not cover them.

## Earlier Releases

This site keeps no page for an older release. The official [Changelog](https://code.claude.com/docs/en/changelog) lists every release.

## Example

You update to `2.1.316` and set `CLAUDE_CODE_DISABLE_ULTRATHINK=1`.
The `ultrathink` keyword then does nothing.
Check the first row. Then check your version:

```bash
claude --version
```

## Related Pages

- [How to Read These Docs](how-to-read.md)
- [What Can I Change](what-can-i-change.md)
- [Files on Disk](files-on-disk.md)
