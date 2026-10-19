---
title: "Permissions Overview"
description: "What permissions and the sandbox do, how the pages in this section fit together, and a first example."
url: https://xsyetopz.github.io/claude-code-docs/configure/permissions/
source: docs/configure/permissions/index.md
---

# Permissions Overview


Permissions decide which tool calls Claude Code may run, which need a prompt, and which it must refuse.
The sandbox adds a second wall around `Bash` commands, enforced by the operating system.
For example, an `allow` rule for `Bash(npm test)` runs the tests with no prompt, and the sandbox still limits what that command can reach.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | ✅ Yes. It is always on. You see it as prompts, or as silent allows and denies. |
| Can you change it? | ✅ Yes. Use rules, a permission mode, hooks, the sandbox, or the auto mode classifier. |
| Can you turn it on or off? | You can loosen it (`bypassPermissions`) or lock it down (`dontAsk`, `--restricted`, managed settings). You cannot remove it. |
| Where does it live? | The `permissions`, `sandbox`, and `autoMode` keys in settings files, plus CLI flags. |
| Status | [Documented] [Undocumented] [Differs] [Gated] |

## Pages in This Section

| Page | What it covers |
| --- | --- |
| [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md) | The six modes, how a mode is chosen, decision reasons, and safety checks. |
| [Permission Rules](https://xsyetopz.github.io/claude-code-docs/configure/permissions/rules.md) | Rule syntax, the `permissions.*` keys, related flags and hooks, and permission updates. |
| [Sandbox](https://xsyetopz.github.io/claude-code-docs/configure/permissions/sandbox.md) | Every `sandbox.*` key and its environment variables. |
| [Auto Mode](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode.md) | The classifier, the `autoMode` setting, and the `claude auto-mode` commands. |
| [Auto Mode Default Rules](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode-rules.md) | Each default allow, hard deny, environment, and soft deny rule. |
| [Permission Flow](https://xsyetopz.github.io/claude-code-docs/how-it-works/permission-flow.md) | The order in which Claude Code applies all of the above. |

## Example

```json title=".claude/settings.json"
{
  "permissions": {
    "defaultMode": "default",
    "allow": ["Bash(npm test)", "Read(src/**)"],
    "deny": ["Bash(git push:*)"]
  },
  "sandbox": { "enabled": true }
}
```

`npm test` runs without a prompt. `git push` is blocked. Other commands prompt you, and `Bash` runs in the sandbox.

## Marks and Sources

Official pages: [Configure Permissions](https://code.claude.com/docs/en/permissions), [Choose a Permission Mode](https://code.claude.com/docs/en/permission-modes), [Configure Auto Mode](https://code.claude.com/docs/en/auto-mode-config), and [Configure the Sandboxed Bash Tool](https://code.claude.com/docs/en/sandboxing).
Badges follow [How to Read These Docs](https://xsyetopz.github.io/claude-code-docs/start/how-to-read.md).

## Related Pages

- [Settings Files and Scopes](https://xsyetopz.github.io/claude-code-docs/configure/settings.md) explains the scopes and the order of settings files.
- [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md) lists `--permission-mode`, `--allowedTools`, and the others.
- [Output Styles](https://xsyetopz.github.io/claude-code-docs/configure/output-styles.md) and [Memory and Rules](https://xsyetopz.github.io/claude-code-docs/configure/memory-and-rules.md) shape behavior, but do not enforce it.
