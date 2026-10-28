---
title: Permissions Overview
description: What permissions and the sandbox do, how the pages in this section fit together, and a first example.
sidebar_position: 1
---

Permissions decide which tool calls Claude Code may run, which need a prompt, and which it must refuse.
The sandbox adds a second wall around `Bash` commands, enforced by the operating system.
For example, an `allow` rule for `Bash(bun test)` runs the tests with no prompt. The sandbox still limits what that command can reach.
Permissions are always on. You see them as prompts, or as silent allows and denies. You cannot remove them.
Set them with the `permissions`, `sandbox`, and `autoMode` keys in settings files, and with CLI flags.
You can loosen them with `bypassPermissions`. You can lock them down with `dontAsk`, `--restricted`, or managed settings.

## Pages in This Section

| Page | What it covers |
| --- | --- |
| [Permission Modes](modes.md) | The six modes, how Claude Code chooses a mode, decision reasons, and safety checks. |
| [Permission Rules](rules.md) | Rule syntax, the `permissions.*` keys, related flags and hooks, and permission updates. |
| [Sandbox](sandbox.md) | Every `sandbox.*` key and its environment variables. |
| [Auto Mode](auto-mode.md) | The classifier, the `autoMode` setting, and the `claude auto-mode` commands. |
| [Auto Mode Default Rules](auto-mode-rules.md) | Each default allow, hard deny, environment, and soft deny rule. |
| [Permission Flow](../../how-it-works/permission-flow.md) | The order in which Claude Code applies all of the above. |

## Example

```json title=".claude/settings.json"
{
  "permissions": {
    "defaultMode": "default",
    "allow": ["Bash(bun test)", "Read(src/**)"],
    "deny": ["Bash(git push:*)"]
  },
  "sandbox": { "enabled": true }
}
```

`bun test` runs without a prompt. The `deny` rule blocks `git push`. Other commands prompt you. `Bash` runs in the sandbox.

## Marks and Sources

Official pages: [Configure Permissions](https://code.claude.com/docs/en/permissions), [Choose a Permission Mode](https://code.claude.com/docs/en/permission-modes), [Configure Auto Mode](https://code.claude.com/docs/en/auto-mode-config), and [Configure the Sandboxed Bash Tool](https://code.claude.com/docs/en/sandboxing).
Badges follow [How to Read These Docs](../../start/how-to-read.md).

## Related Pages

- [Settings Files and Scopes](../settings/index.md) explains the scopes and the order of settings files.
- [All Flags](../cli/flags.md) lists `--permission-mode`, `--allowedTools`, and the others.
- [Output Styles](../output-styles.md) and [Memory and Rules](../memory-and-rules.md) shape behavior, but do not enforce it.
