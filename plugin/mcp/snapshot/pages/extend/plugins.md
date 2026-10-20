---
title: "Plugins"
description: "What a plugin is, how plugin ids and scopes work, and a map of the plugin pages."
url: https://xsyetopz.github.io/claude-code-docs/extend/plugins/
source: docs/extend/plugins/index.md
---

# Plugins


A plugin is a folder that adds skills, agents, hooks, or MCP servers to Claude Code.
A marketplace is a list of plugins that you can install.
For example, `claude plugin install my-plugin@my-marketplace` installs a plugin from a marketplace.
This page gives the big picture. The other pages list every key, command, and path.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | ✅ Yes. Install with `claude plugin install` or the `/plugin` panel. |
| Can you change it? | ✅ Yes. Write your own plugin folder and an optional marketplace file. |
| Can you turn it on or off? | `claude plugin enable` and `disable`, or `enabledPlugins` in settings. Managed settings can lock the rules. |
| Where does it live? | `~/.claude/plugins/` for installs. `.claude-plugin/plugin.json` in the plugin folder. |
| Status | [Documented] [Undocumented] |

## What a Plugin Holds

A plugin can bundle these parts. Each part has a default folder or file name.

| Part | Status | Default Place | Page |
| --- | --- | --- | --- |
| Skills | [Documented] | `skills/` | [Manifest](https://xsyetopz.github.io/claude-code-docs/extend/plugins/manifest.md#components-and-layout) |
| Commands | [Documented] | `commands/` | [Manifest](https://xsyetopz.github.io/claude-code-docs/extend/plugins/manifest.md#components-and-layout) |
| Agents | [Documented] | `agents/` | [Manifest](https://xsyetopz.github.io/claude-code-docs/extend/plugins/manifest.md#components-and-layout) |
| Hooks | [Documented] | `hooks/hooks.json` | [Manifest](https://xsyetopz.github.io/claude-code-docs/extend/plugins/manifest.md#components-and-layout) |
| MCP servers | [Documented] | `.mcp.json` | [Manifest](https://xsyetopz.github.io/claude-code-docs/extend/plugins/manifest.md#components-and-layout) |
| LSP servers | [Documented] | `.lsp.json` | [Manifest](https://xsyetopz.github.io/claude-code-docs/extend/plugins/manifest.md#components-and-layout) |
| Monitors | [Documented] | `monitors/monitors.json` | [Manifest](https://xsyetopz.github.io/claude-code-docs/extend/plugins/manifest.md#top-level-keys) |
| Output styles | [Documented] | `output-styles/` | [Manifest](https://xsyetopz.github.io/claude-code-docs/extend/plugins/manifest.md#components-and-layout) |
| Workflows and themes | [Documented] | `workflows/`, `themes/` | [Manifest](https://xsyetopz.github.io/claude-code-docs/extend/plugins/manifest.md#components-and-layout) |
| Executables | [Documented] | `bin/` | [Manifest](https://xsyetopz.github.io/claude-code-docs/extend/plugins/manifest.md#components-and-layout) |
| Mods | [Documented] | `types` key, TypeScript files | [Mod API](https://xsyetopz.github.io/claude-code-docs/extend/mod-api.md) |

## Ids, Scopes, and Special Marketplaces

- A plugin id is `name@marketplace`. The text before `@` is the entry name in the marketplace file.
- The scopes are `user`, `project`, `local`, and `managed`. The enable state of each plugin lives in `enabledPlugins`.
- A plugin skill gets the name `/<plugin>:<skill>`, so two plugins cannot clash.
- Four marketplace names are special and you cannot reuse them.

| Marketplace | Status | Meaning |
| --- | --- | --- |
| `inline` | [Documented] | Plugins loaded for one session with `--plugin-dir` or `--plugin-url`. Their ids end in `@inline`. |
| `builtin` | [Documented] | Plugins that ship inside Claude Code. |
| `skills-dir` | [Documented] | Plugins made by `claude plugin init` in `~/.claude/skills/`. They load on the next session. |
| `synced` | [Documented] | Plugins synced from your claude.ai account. Turn off with `syncClaudeAiPlugins: false`. |

## Example

This flow creates a plugin, tests it for one session, and installs it from a marketplace.

```bash title="Build, test, and install"
# Create a plugin folder at ~/.claude/skills/my-plugin/
claude plugin init my-plugin --with skills hooks

# Check the files
claude plugin validate ~/.claude/skills/my-plugin

# Try a folder for one session only
claude --plugin-dir ./my-plugin

# Add a marketplace, then install from it
claude plugin marketplace add owner/repo
claude plugin install my-plugin@my-marketplace --scope project
```

## How It Works

```mermaid
flowchart TD
  M["<code>marketplace.json</code>"] -->|plugin entry and source| F[Fetch the source]
  F --> C[Copy to the plugin cache]
  C --> R["Install record in <code>installed_plugins.json</code>"]
  R --> E{"<code>enabledPlugins</code>"}
  E -->|"<code>true</code>"| L[Load skills, hooks, MCP, and more]
  E -->|"<code>false</code>"| X[Stay off]
```

Claude Code reads the marketplace, fetches the source of the plugin you pick, and copies it into a cache folder.
It writes an install record. At session start it loads every enabled plugin.
Paths and variables are in [Plugin Loading](https://xsyetopz.github.io/claude-code-docs/extend/plugins/loading.md).

## Pages in This Section

| Page | What It Covers |
| --- | --- |
| [Plugin Manifest](https://xsyetopz.github.io/claude-code-docs/extend/plugins/manifest.md) | Every `plugin.json` key, `userConfig`, and the folder layout |
| [Marketplaces](https://xsyetopz.github.io/claude-code-docs/extend/plugins/marketplace.md) | Every `marketplace.json` key, plugin sources, marketplace sources |
| [Plugin Commands](https://xsyetopz.github.io/claude-code-docs/extend/plugins/cli.md) | Every `claude plugin` subcommand, `/plugin`, and session flags |
| [Plugin Loading](https://xsyetopz.github.io/claude-code-docs/extend/plugins/loading.md) | Paths, cache, variables, env vars, and enabling |
| [Plugin Settings Keys](https://xsyetopz.github.io/claude-code-docs/configure/settings/hooks-and-plugins.md) | Settings keys for plugins and marketplaces |
| [Plugin Env Vars](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/plugins-and-mcp.md) | Env vars for plugins and MCP |

## Sources

- [Create Plugins](https://code.claude.com/docs/en/plugins) is the official guide for authors.
- [Plugin Manifest Reference](https://code.claude.com/docs/en/plugins/manifest-reference) describes `plugin.json`.
- Program-only facts come from the program (the bundled manifest schema and the plugin loader).
