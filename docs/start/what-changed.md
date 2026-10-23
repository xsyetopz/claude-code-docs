---
title: What Changed
description: What changed in Claude Code 2.1.309, the release this site covers, with links to the archive of earlier releases.
sidebar_position: 4
---

This page lists the changes in `2.1.309`, the release this site covers.
It is short on purpose. The site only repeats what its sources say, and it does not guess.
For every fix and small change, read the official [Changelog](https://code.claude.com/docs/en/changelog).

## How to Check Your Version

Run `claude --version`.
The `/release-notes` command shows a cached copy of the [changelog](https://code.claude.com/docs/en/changelog).
This site covers `2.1.309`, the version shown in the navbar.

## Version 2.1.309

Released October 22, 2026. Source: [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.309).
Rows marked with the program come from a comparison of the `2.1.308` and `2.1.309` programs. The settings, hooks, and commands did not change.

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| `claude ultrareview` trust | <Documented /> | The command needs a trusted folder. It asks on a terminal. In a script, pass `--trust-workspace` or set `CLAUDE_CODE_DISABLE_ULTRAREVIEW_TRUST_CHECK=1` (the program). | [Subcommands](../configure/cli/subcommands.md) |
| Dangerous `rm` in bypass mode | <Undocumented /> | In the desktop app and VS Code, a dangerous `rm` or `rmdir` is denied at once with a hint to rewrite it. | [Permission Modes](../configure/permissions/modes.md#safety-checks) |
| `sandbox.excludedCommands` | <Documented /> | While the sandbox is on but cannot run, these commands ask before they write to the sandbox's write paths. | [Sandbox](../configure/permissions/sandbox.md#core-keys) |
| Large nested `CLAUDE.md` | <Documented /> | A nested file over the size limit loads only its start, so it no longer makes the session compact again and again. | [Memory and Rules](../configure/memory-and-rules.md#how-it-works) |
| `--add-dir` skill names | <Documented /> | A skill whose name another skill has is offered as `<folder>:<name>`. | [Skills and Commands](../extend/skills-and-commands/index.md#skill-locations) |
| Mod API `cursor` and model alias | <Documented /> | `$.prompt.fill` and the `prompt.fill` event take `cursor`, which places the caret. A `turn.step` hook can name the model by an alias such as `haiku` (the program). | [Turn and Prompt Types](../extend/mod-api/types/turn-prompt.md) |
| `mcp_status` `liveReply` | <Undocumented /> | A control request can ask for a reply sent only to the clients attached at that moment (the program). | [Control Protocol](../extend/headless/control-protocol.md) |
| `result` `model_usage_since_last_result` | <Undocumented /> | Each `result` line of `stream-json` output also gives the usage and cost of only the calls since the previous result, per model and shaped like `modelUsage`. Add it up over the results instead of subtracting `modelUsage` totals (the program). | [Stream JSON](../extend/headless/stream-json.md#exact-fields) |
| Bedrock tool streaming | <Documented /> | A Bedrock base URL on Amazon's own `bedrock-runtime` host no longer counts as custom, so fine-grained tool streaming works with it (the program). | [Network and Proxy](../configure/env-vars/network-and-proxy.md#variables) |
| `Bash` tool text | <Undocumented /> | The description grew from 1,406 to 1,688 characters, with a new line on GitHub `@name` mentions (the program). | [Tool Descriptions](../prompts/tools.md#bash) |
| New environment variables | <Undocumented /> | Six more new variables for cloud sessions, the self-hosted runner, resumed sessions, plugin sync, and artifact sharing (the program). | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md#variables), [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md#variables), [Features and Toggles](../configure/env-vars/features-and-toggles.md#variables) |

The print and interactive probes matched `2.1.308`, apart from the Bash text, the new environment variables, and the new `result` field above, and run-to-run noise.

## Earlier Releases

The [Release Archive](release-archive.md) keeps the sections for `2.1.300` to `2.1.308`.
The official [Changelog](https://code.claude.com/docs/en/changelog) lists every release.

## Example

You update to `2.1.309`, and a CI job that runs `claude ultrareview` may stop, because the job cannot answer the trust prompt.
Check the `claude ultrareview` trust row, then let the job skip the check.

```bash
claude --version
CLAUDE_CODE_DISABLE_ULTRAREVIEW_TRUST_CHECK=1 claude ultrareview --json
```

## Related Pages

- [Release Archive](release-archive.md)
- [How to Read These Docs](how-to-read.md)
- [What Can I Change](what-can-i-change.md)
- [Files on Disk](files-on-disk.md)
