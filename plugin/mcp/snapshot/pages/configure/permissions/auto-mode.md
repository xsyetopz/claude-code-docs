---
title: "Auto Mode"
description: "How the auto mode classifier decides, the autoMode setting, the claude auto-mode commands, and the related environment variables."
url: https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode
source: docs/configure/permissions/auto-mode.md
---

# Auto Mode


Auto mode lets Claude Code run without routine prompts.
A classifier model reads each action and blocks what is risky, such as a deploy to production or a push of secrets.
You tune it with the `autoMode` setting.

Pick `auto` as the permission mode. `permissions.disableAutoMode: "disable"` turns it off, and `permissions.defaultMode: "auto"` starts in it. User settings, `--settings`, and managed settings set `autoMode`. Project and local settings do not.

## Example

```json title="~/.claude/settings.json"
{
  "autoMode": {
    "environment": [
      "$defaults",
      "Trusted repo: github.com/acme/app",
      "Trusted cloud buckets: s3://acme-build-cache"
    ],
    "soft_deny": [
      "$defaults",
      "Never run migrations against the shared staging database."
    ]
  }
}
```

`$defaults` keeps the built-in entries at that place. A list without `$defaults` replaces them.
Run `claude auto-mode config` to see the result.

## How the Classifier Decides

- The classifier is a model call. It reads the transcript, with your rules as its system prompt.
- By default it allows an action. It blocks an action that matches a `hard_deny` rule. It also blocks one that matches a `soft_deny` rule when no `allow` rule and no clear request from you clears it.
- `soft_deny` rules cover destructive or irreversible actions that your intent can clear.
  `hard_deny` rules are security boundaries that your intent does not clear. Source: the `autoMode` schema text.
- If the classifier cannot answer, the call is blocked or goes to a person. Program texts: `Classifier unavailable`, and `Auto mode classifier transcript exceeded context window - falling back to manual approval`.
- Repeated denials trip a circuit breaker.
- A server-side classifier can review actions instead. See `CLAUDE_CODE_AUTO_MODE_SERVER`. Server lists can add rules, and the program ignores server entries that are not strings, are blank, or hold control characters.

The default rule lists are on [Auto Mode Default Rules](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode-rules.md).

## The `autoMode` Setting

Official pages: [Choose a Permission Mode](https://code.claude.com/docs/en/permission-modes) and [Configure Auto Mode](https://code.claude.com/docs/en/auto-mode-config).

| Key | Status | What it does | How it works | Scope |
| --- | --- | --- | --- | --- |
| `autoMode.allow` | [Documented] | Exceptions to the soft deny rules | List of strings. `$defaults` inherits the built-in rules at that place | User, `--settings`, managed |
| `autoMode.soft_deny` | [Documented] | Block rules that user intent can clear | Same list rules | Same |
| `autoMode.hard_deny` | [Documented] | Block rules that no intent clears | Same list rules | Same |
| `autoMode.environment` | [Documented] | Facts about your setup and trusted resources | Same list rules | Same |
| `autoMode.classifyAllShell` | [Documented] | Suspends every `Bash` and `PowerShell` allow rule in auto mode | All shell commands go to the classifier. Default `false`. `true` from `~/.claude/settings.json` or `--settings` wins over a managed `false` | User, `--settings` |
| `permissions.disableAutoMode` | [Documented] | Turns auto mode off | Value `disable` | Settings |
| `skipAutoPermissionPrompt` | [Documented] | The user accepted the opt-in dialog | Boolean | Settings |
| `useAutoModeDuringPlan` | [Documented] | Plan mode uses auto semantics | Default `true` | Settings |
| `permissions.defaultMode: "auto"` | [Documented] | Start in auto mode | Not from project or local settings | User, managed |

The plugin `settings.json` does not accept `autoMode`.

> **Which Sources Count:** A probe ran `claude auto-mode config` with `autoMode.allow` set in each source. Rules from user settings and from a `--settings` file applied. Rules in `.claude/settings.json` and `.claude/settings.local.json` were ignored. The program logs `tengu_settings_auto_mode_untrusted_source_ignored` for them. Its message says only policy, user, and flag settings may set the rules. Managed settings were not run. See [Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md#configure-and-memory).
> The [official docs](https://code.claude.com/docs/en/auto-mode-config) confirm this only for `classifyAllShell` (user and `--settings`).

## The `claude auto-mode` Commands

| Command | Status | What it does | How it works | Scope |
| --- | --- | --- | --- | --- |
| `claude auto-mode defaults` | [Documented] | Prints the default `environment`, `allow`, `soft_deny`, and `hard_deny` as JSON | Option `--label <prefix>` shows only rules whose label starts with the prefix, without case | CLI |
| `claude auto-mode config` | [Documented] | Prints the effective config as JSON | Your settings where set, defaults elsewhere | CLI |
| `claude auto-mode critique` | [Documented] | Asks a model to review your custom rules | Option `--model <model>`. It checks clarity, completeness, conflicts, and actionability | CLI |
| `claude auto-mode reset` | [Documented] | Removes `autoMode` from the user settings file | Option `-y, --yes` skips the prompt | CLI |
| `/auto-mode-setup` | [Documented] | Scans the project and recent sessions, and proposes `autoMode` rules | Shows `Auto-mode setup proposal is ready for review`. Since `2.1.304` it is also on Bedrock, Vertex, Foundry, a Claude apps gateway, and with telemetry off. `skillOverrides["auto-mode-setup"]: "off"` turns it off (the program). | Interactive |

The `config` output tags custom rules as `(custom rules added alongside the defaults)` or `(custom rules replacing defaults)`.

## Environment Variables

| Variable | Status | What it does | How it works | Scope |
| --- | --- | --- | --- | --- |
| `CLAUDE_CODE_AUTO_MODE_SERVER` | [Documented] | Server-side review of auto mode actions | `0` uses own classifier requests. Needs `2.1.271` | Env |
| `CLAUDE_CODE_DISABLE_DANGEROUS_RM_TIMEOUT` | [Documented] | Removes the time limit of critical-path `rm` prompts | In auto mode these go to the classifier | Launch env only |
| `CLAUDE_CODE_AUTO_MODE_MODEL` | [Undocumented] | Model of the classifier | A server-configured classifier model wins, and the bundle logs `ignoring CLAUDE_CODE_AUTO_MODE_MODEL=` | Env |
| `CLAUDE_CODE_BG_CLASSIFIER_MODEL` | [Undocumented] | Classifier model for background sessions | Listed with the model env vars | Env |
| `CLAUDE_CODE_AUTO_MODE_TIER` | [Undocumented] | Any value sets the tier to `strict` | Source `env` | Env |
| `CLAUDE_CODE_CLASSIFIER_SUMMARY` | [Undocumented] | Chooses `llm` or `heuristic` summaries | Boolean parse, a hidden server-side flag picks the default | Env |
| `CLAUDE_CODE_TWO_STAGE_CLASSIFIER` | [Undocumented] | No effect. The program lists it in its environment table as a boolean and no code reads it. The two-stage mode (`fast`, `thinking`, or `both`) comes from server config, and `both` is the default | The program ignores the value | Env |
| `CLAUDE_CODE_AUTO_MODE_EXTERNAL_PERMISSIONS` | [Undocumented] | No effect. The program lists the name in its environment table and no code reads it | The program ignores the value | Env |
| `CLAUDE_CHROME_CLASSIFIER_FLOOR` | [Undocumented] | Turns the Chrome classifier floor on or off for auto mode | Used when set. When unset, the hidden server-side flag `tengu_cowork_chrome_automode_default` decides (default off). Project `env` can set it only to a true value | Env |
| `CLAUDE_CHROME_PERMISSION_MODE` | [Undocumented] | Permission mode that the Claude in Chrome bridge uses | `ask`, `skip_all_permission_checks`, or `follow_a_plan`. Another value logs a warning. Claude Code sets `skip_all_permission_checks` for the Chrome native host when it skips permission checks. Project `env` can set it only to `ask` | Env |
| `CLAUDE_BG_SESSION_PERMISSION_RULES` | [Undocumented] | JSON with `allow`, `deny`, `addDirs` for a background session | Read when `CLAUDE_CODE_SESSION_KIND` is `bg`. Removed from child env | Env |
| `CLAUDE_CODE_PARKED_PERMISSION_WAIT_MS` | [Undocumented] | Wait for a parked permission | Default `2000` | Env |
| `CLAUDE_CODE_RESTRICT_PERSONAL_CONFIG` | [Undocumented] | Own skills and commands cannot pre-approve tools | Personal hooks need existing rules | Env |

## How It Works

[Permission Flow](https://xsyetopz.github.io/claude-code-docs/how-it-works/permission-flow.md) shows where the classifier sits: after the rules and hooks, only for calls that would otherwise ask.

## Related Pages

- [Auto Mode Default Rules](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode-rules.md)
- [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md)
- [Permission Rules](https://xsyetopz.github.io/claude-code-docs/configure/permissions/rules.md)
- [Subcommands](https://xsyetopz.github.io/claude-code-docs/configure/cli/subcommands.md)
