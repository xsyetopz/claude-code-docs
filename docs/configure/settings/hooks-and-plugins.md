---
title: Hooks, Plugins, and Skills Settings
description: Keys for hooks, plugins, marketplaces, skills, permissions, the status line, and output styles.
sidebar_position: 6
---

These keys control hooks, plugins, marketplaces, skills, permissions, and the status line.
Many are managed-only keys that let an administrator lock down what users can load.
The `hooks`, `permissions`, and `statusLine` objects are large, so their own pages explain them.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | ✅ Yes. |
| Can you change it? | Edit a settings file. Managed-only keys need a managed source. |
| Can you turn it on or off? | `disableAllHooks`, `disableBundledSkills`, and `enabledPlugins` are switches. |
| Where does it live? | `~/.claude/settings.json`, `.claude/settings.json`, `.claude/settings.local.json`, or managed settings |
| Status | <Documented /> <Differs note="appendPlugins and prependPlugins" /> |

## Keys

Source: [Settings Reference](https://code.claude.com/docs/en/settings-reference) for rows marked <Documented />. For rows marked <Undocumented />, Source: the program (its bundled settings schema).
Where to Set It tells you which files may set the key. See [Settings Files and Scopes](index.md#where-settings-live).

| Key | Status | Type | Default | What It Does | Where to Set It |
| --- | --- | --- | --- | --- | --- |
| `additionalMarketplaces` | <Documented /> | object | - | Write `extraKnownMarketplaces` under this alias name. Do not set both in one file. Needs Claude Code `2.1.232` or later. | Any settings file |
| `allowedHttpHookUrls` | <Documented /> | array of string | - | Limit which URLs HTTP hooks can target. | Any settings file |
| 🔒 `allowedMarketplaces` | <Documented /> | array | - | Write `strictKnownMarketplaces` under this alias name. Do not set both in one file. Needs Claude Code `2.1.232` or later. | Managed settings only |
| 🔒 `allowManagedHooksOnly` | <Documented /> | boolean | - | Run only the hooks your organization deploys. | Managed settings only |
| 🔒 `allowManagedPermissionRulesOnly` | <Documented /> | boolean | - | Make managed settings the only settings source of permission rules. | Managed settings only |
| 🔒 `appendPlugins` | <Differs note="Docs say user or managed scope. The schema says managed only." /> | array of string | - | List managed plugins whose hooks run last, in the listed order. The docs list the scope as user or managed. The schema marks it managed-only. | User or managed settings |
| `blockedMarketplaces` | <Documented /> | array | - | Block plugin marketplace sources for your organization. | Managed settings only |
| `disableAllHooks` | <Documented /> | boolean | - | Turn off hooks, a custom status line, and a custom `@` file suggestion command at once. | Any settings file |
| `disableAutoMode` | <Documented /> | enum: `disable` | - | Remove auto mode from the permission mode cycle. | Any settings file |
| `disableBundledSkills` | <Documented /> | boolean | - | Turn off the skills and workflows included with Claude Code. | Any settings file |
| 🔒 `disableCommandPluginSources` | <Documented /> | boolean | - | Block plugins that install by running a marketplace-declared command. | Managed settings only |
| 🔒 `disableSideloadFlags` | <Documented /> | boolean | - | Reject the CLI flags that sideload plugins, subagents, and MCP servers. | Managed settings only |
| `disableSkillShellExecution` | <Documented /> | boolean | - | Stop skills and custom commands from running inline shell. | Any settings file |
| `enabledPlugins` | <Documented /> | object | - | Turn individual plugins on or off per scope. | Any settings file |
| `extraKnownMarketplaces` | <Documented /> | object | - | Register marketplaces for a repository or an organization. | Any settings file |
| `hooks` | <Documented /> | object | - | Run your own commands as hooks at points in Claude Code's lifecycle. | Any settings file |
| `httpHookAllowedEnvVars` | <Documented /> | array of string | - | Limit which env vars HTTP hooks can put in headers. | Any settings file |
| `outputStyle` | <Documented /> | string | - | Change Claude's role, tone, and output format with an output style. | Any settings file |
| `permissions` | <Documented /> | object | - | Set allow, ask, and deny rules and the starting permission mode. | Any settings file |
| `pluginConfigs` | <Documented /> | object | - | Store the answers you gave a plugin's configuration dialog. | User or managed settings |
| `pluginSuggestionMarketplaces` | <Documented /> | array of string | - | Choose which marketplaces can surface plugin install suggestions in `/plugin`. | Managed settings only |
| 🔒 `pluginTrustMessage` | <Documented /> | string | - | Add your own text to the plugin trust warning. | Managed settings only |
| 🔒 `prependPlugins` | <Differs note="Docs say user or managed scope. The schema says managed only." /> | array of string | - | List managed plugins whose hooks run first, in the listed order. The docs list the scope as user or managed. The schema marks it managed-only. | User or managed settings |
| `skillListingBudgetFraction` | <Documented /> | number | `0.01` (1%) | Reserve more or less context for the skill listing. | Any settings file |
| `skillListingMaxDescChars` | <Documented /> | integer | 1536 | Cap each skill's description length in the skill listing. | Any settings file |
| `skillOverrides` | <Documented /> | object | - | Hide or collapse a skill without editing its SKILL.md. | Any settings file |
| ⚠️ `skipDangerousModePermissionPrompt` | <Documented /> | boolean | - | Skip the confirmation dialog before bypassPermissions mode. | User, local, or managed settings |
| `statusLine` | <Documented /> | object | - | Run your own command to render a status line below the prompt. | Any settings file |
| `strictKnownMarketplaces` | <Documented /> | array | - | Allowlist the marketplace sources users can add and install from. | Managed settings only |
| 🔒 `strictPluginOnlyCustomization` | <Documented /> | ❓ | - | Block skills, agents, hooks, and MCP servers from user and project sources. | Managed settings only |
| `syncClaudeAiPlugins` | <Documented /> | boolean | - | Stop loading the plugins enabled on your claude.ai account and stop downloading new ones. | User, local, or managed settings |
| `syncClaudeAiSkills` | <Documented /> | boolean | - | Stop loading the skills enabled on your claude.ai account and stop downloading new ones. | User, local, or managed settings |

## Example

### Turn On a Plugin and a Hook

This file turns on one plugin, runs `echo done` when a turn ends, and stops skills from running inline shell.

```json title=".claude/settings.json"
{
  "enabledPlugins": { "my-plugin@my-marketplace": true },
  "hooks": {
    "Stop": [
      { "hooks": [ { "type": "command", "command": "echo done" } ] }
    ]
  },
  "disableSkillShellExecution": true
}
```

## Related Pages

- [Settings Files and Scopes](index.md) explains the scopes, precedence, and managed settings.
- [Settings Reference](https://code.claude.com/docs/en/settings-reference) is the official page for each key.
- [Hooks](../../extend/hooks/index.md), [Plugins](../../extend/plugins/index.md), and [Skills and Commands](../../extend/skills-and-commands/index.md) explain those features.
- [Permissions](../permissions/index.md) covers `permissions`.
- [Plugins and MCP Variables](../env-vars/plugins-and-mcp.md) lists the matching variables.
