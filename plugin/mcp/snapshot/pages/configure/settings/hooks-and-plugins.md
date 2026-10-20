---
title: "Hooks, Plugins, and Skills Settings"
description: "Keys for hooks, plugins, marketplaces, skills, permissions, the status line, and output styles."
url: https://xsyetopz.github.io/claude-code-docs/configure/settings/hooks-and-plugins
source: docs/configure/settings/hooks-and-plugins.md
---

# Hooks, Plugins, and Skills Settings


These keys control hooks, plugins, marketplaces, skills, permissions, and the status line.
Many are managed-only keys that let an administrator lock down what users can load.
The `hooks`, `permissions`, and `statusLine` objects are large, so their own pages explain them.

Managed-only keys need a managed source. `disableAllHooks`, `disableBundledSkills`, and `enabledPlugins` are switches.

## Keys

Source: [Settings Reference](https://code.claude.com/docs/en/settings-reference) for rows marked [Documented]. For rows marked [Undocumented], Source: the program (its bundled settings schema).
Where to Set It tells you which files may set the key. See [Settings Files and Scopes](https://xsyetopz.github.io/claude-code-docs/configure/settings.md#where-settings-live).

| Key | Status | Type | Default | What It Does | Where to Set It |
| --- | --- | --- | --- | --- | --- |
| `additionalMarketplaces` | [Documented] | object | - | Write `extraKnownMarketplaces` under this alias name. Do not set both in one file. Needs Claude Code `2.1.232` or later. If both are set, Claude Code ignores the alias and warns. | Any settings file |
| `allowedHttpHookUrls` | [Documented] | array of string | - | Limit which URLs HTTP hooks can target. | Any settings file |
| `allowedMarketplaces` | [Documented] [Managed Only] | array | - | Write `strictKnownMarketplaces` under this alias name. Do not set both in one file. Needs Claude Code `2.1.232` or later. | Managed settings only |
| `allowManagedHooksOnly` | [Documented] [Managed Only] | boolean | - | Run only the hooks your organization deploys and the hooks of managed-enabled plugins. Also narrows `statusLine`, `fileSuggestion`, and `subagentStatusLine`. Also blocks hooks and mods that are not the organization's. | Managed settings only |
| `allowManagedPermissionRulesOnly` | [Documented] [Managed Only] | boolean | - | Make managed settings the only settings source of permission rules. | Managed settings only |
| `appendPlugins` | [Differs: Docs say user or managed scope. The schema says managed only.] [Managed Only] | array of string | - | List managed plugins whose hooks run last, in the listed order. The docs list the scope as user or managed. The schema marks it managed-only. Listed ids run innermost. | User or managed settings |
| `blockedMarketplaces` | [Documented] | array | - | Block plugin marketplace sources for your organization. Checked before download. | Managed settings only |
| `disableAllHooks` | [Differs: The schema also says it stops the statusLine command. The Hooks Reference names only hooks.] | boolean | - | Turn off hooks, a custom status line, and a custom `@` file suggestion command at once. Managed hooks stay unless you set it in managed settings. In managed settings it also stops organization mods. In user settings, what the organization manages keeps running. When `true` outside managed settings, only a managed `statusLine` runs; with no managed `statusLine` the status line is off. | Any settings file |
| `disableAutoMode` | [Documented] | enum: `disable` | - | Remove auto mode from the permission mode cycle. | Any settings file |
| `disableBundledSkills` | [Documented] | boolean | - | Turn off the skills and workflows included with Claude Code. | Any settings file |
| `disableCommandPluginSources` | [Documented] [Managed Only] | boolean | - | Block plugins that install by running a marketplace-declared command. Turns off `command` plugin sources. | Managed settings only |
| `disableSideloadFlags` | [Documented] [Managed Only] | boolean | - | Reject the CLI flags that sideload plugins, subagents, and MCP servers. Covers `--plugin-dir`, `--plugin-url`, `--agents`, and `--mcp-config`. | Managed settings only |
| `disableSkillShellExecution` | [Documented] | boolean | - | Stop skills and custom commands from running inline shell. | Any settings file |
| `enabledPlugins` | [Documented] | object | - | Turn individual plugins on or off per scope. Keys look like `"name@marketplace"` with a value of `true` or `false`. The layers apply in this order: user, project, local, flag, policy. To turn off a project plugin for yourself, set `false` in `.claude/settings.local.json`. It also holds extended version-constraint forms. | Any settings file |
| `extraKnownMarketplaces` | [Documented] | object | - | Register marketplaces for a repository or an organization. A map of name to `{ "source": ... }`. Project values apply after you trust the folder. | Any settings file |
| `hooks` | [Documented] | object | - | Run your own commands as hooks at points in Claude Code's lifecycle. | Any settings file |
| `httpHookAllowedEnvVars` | [Documented] | array of string | - | Limit which env vars HTTP hooks can put in headers. | Any settings file |
| `outputStyle` | [Documented] | string | - | Change Claude's role, tone, and output format with an output style. | Any settings file |
| `permissions` | [Documented] | object | - | Set allow, ask, and deny rules and the starting permission mode. | Any settings file |
| `pluginConfigs` | [Documented] | object | - | Store the answers you gave a plugin's configuration dialog. Holds `options` and `mcpServers` by plugin id. | User or managed settings |
| `pluginSuggestionMarketplaces` | [Documented] | array of string | - | Choose which marketplaces can surface plugin install suggestions in `/plugin`. Without it, no marketplace suggestion shows. | Managed settings only |
| `pluginTrustMessage` | [Documented] [Managed Only] | string | - | Add your own text to the plugin trust warning. | Managed settings only |
| `prependPlugins` | [Differs: Docs say user or managed scope. The schema says managed only.] [Managed Only] | array of string | - | List managed plugins whose hooks run first, in the listed order. The docs list the scope as user or managed. The schema marks it managed-only. Listed ids run outermost. | User or managed settings |
| `skillListingBudgetFraction` | [Documented] | number | `0.01` (1%) | Reserve more or less context for the skill listing. | Any settings file |
| `skillListingMaxDescChars` | [Documented] | integer | 1536 | Cap each skill's description length in the skill listing. | Any settings file |
| `skillOverrides` | [Documented] | object | - | Hide or collapse a skill without editing its SKILL.md. | Any settings file |
| `skipDangerousModePermissionPrompt` | [Documented] [Caution] | boolean | - | Skip the confirmation dialog before bypassPermissions mode. | User, local, or managed settings |
| `statusLine` | [Documented] | object | - | Run your own command to render a status line below the prompt. | Any settings file |
| `strictKnownMarketplaces` | [Documented] | array | - | Allowlist the marketplace sources users can add and install from. Checked before download. It does not register anything. | Managed settings only |
| `strictPluginOnlyCustomization` | [Documented] [Managed Only] | boolean or array of: `skills`, `agents`, `hooks`, `mcp` | - | Block skills, agents, hooks, and MCP servers from user and project sources. `true` locks all four. `false` locks nothing. An unknown array entry is dropped with a warning. A value that is not valid acts as `true`. Managed sources and plugin items are not blocked. Source: the program. | Managed settings only |
| `syncClaudeAiPlugins` | [Documented] | boolean | - | Stop loading the plugins enabled on your claude.ai account and stop downloading new ones. | User, local, or managed settings |
| `syncClaudeAiSkills` | [Documented] | boolean | - | Stop loading the skills enabled on your claude.ai account and stop downloading new ones. | User, local, or managed settings |

## Example

### Turn On a Plugin and a Hook

This file turns on one plugin, runs `echo done` when a turn ends, and stops skills from running inline shell.

```json title=".claude/settings.json"
{
  "enabledPlugins": { "my-plugin@my-marketplace": true },
  "hooks": {
    "Stop": [{ "hooks": [{ "type": "command", "command": "echo done" }] }]
  },
  "disableSkillShellExecution": true
}
```

## Related Pages

- [Settings Files and Scopes](https://xsyetopz.github.io/claude-code-docs/configure/settings.md) explains the scopes, precedence, and managed settings.
- [Settings Reference](https://code.claude.com/docs/en/settings-reference) is the official page for each key.
- [Hooks](https://xsyetopz.github.io/claude-code-docs/extend/hooks.md), [Plugins](https://xsyetopz.github.io/claude-code-docs/extend/plugins.md), and [Skills and Commands](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands.md) explain those features.
- [Permissions](https://xsyetopz.github.io/claude-code-docs/configure/permissions.md) covers `permissions`.
- [Plugins and MCP Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/plugins-and-mcp.md) lists the matching variables.
