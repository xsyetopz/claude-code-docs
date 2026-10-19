---
title: MCP and Channels Settings
description: Keys that decide which MCP servers, claude.ai connectors, and channels Claude Code may use.
sidebar_position: 7
---

These keys decide which MCP servers and channels Claude Code may use.
An MCP server gives Claude extra tools. A channel is a plugin that can push messages into a session.
Administrators use these keys to allow or block servers.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | Yes. |
| Can you change it? | Edit a settings file. Allow and block lists need a managed source to bind users. |
| Can you turn it on or off? | `enableAllProjectMcpServers`, `disableClaudeAiConnectors`, and `channelsEnabled` are switches. |
| Where does it live? | `~/.claude/settings.json`, `.claude/settings.json`, `.claude/settings.local.json`, or managed settings |
| Status | <Documented /> |

## Keys

Source: [Settings Reference](https://code.claude.com/docs/en/settings-reference) for rows marked <Documented />. For rows marked <Undocumented />, Source: the program (its bundled settings schema).
Where to Set It tells you which files may set the key. See [Settings Files and Scopes](index.md#where-settings-live).

| Key | Status | Type | Default | What It Does | Where to Set It |
| --- | --- | --- | --- | --- | --- |
| `allowAllClaudeAiMcps` | <Documented /> | boolean | - | Load the claude.ai connectors Claude Code fetches itself alongside a deployed `managed-mcp.json`. | Managed settings only |
| `allowClaudeInChromeWithManagedMcp` | <Documented /> | boolean | - | Let the built-in Claude in Chrome server run alongside a deployed `managed-mcp.json`. | Managed settings only |
| `allowedChannelPlugins` | <Documented /> | array | - | Replace the default allowlist of channel plugins that can push messages. | Managed settings only |
| `allowedMcpServers` | <Documented /> | array | - | Allowlist which MCP servers users can add. | Any settings file |
| `allowManagedMcpServersOnly` | <Documented /> | boolean | - | Make the managed MCP allowlist the only one that applies. | Managed settings only |
| `channelsEnabled` | <Documented /> | boolean | - | Allow channels for your organization. | Managed settings only |
| `deniedMcpServers` | <Documented /> | array | - | Block specific MCP servers by URL, command, or name. | Any settings file |
| `disableClaudeAiConnectors` | <Documented /> | boolean | - | Turn off claude.ai connectors so Claude Code doesn't fetch them. | Any settings file |
| `disabledMcpjsonServers` | <Documented /> | array of string | - | Reject specific servers from a project's `.mcp.json`. | Any settings file |
| `enableAllProjectMcpServers` | <Documented /> | boolean | - | Approve every server in project `.mcp.json` files without a prompt. | Any settings file |
| `enabledMcpjsonServers` | <Documented /> | array of string | - | Approve specific servers from a project's `.mcp.json`. | Any settings file |
| `managedMcpServers` | <Documented /> | object | - | Provide remote MCP servers to every user alongside the ones they add. | Managed settings only |

## Example

### Approve Project Servers Except One

This file approves the servers in `.mcp.json` and rejects the one named `risky-server`.

```json title=".claude/settings.json"
{
  "enableAllProjectMcpServers": true,
  "disabledMcpjsonServers": ["risky-server"]
}
```

## Related Pages

- [Settings Files and Scopes](index.md) explains the scopes, precedence, and managed settings.
- [Settings Reference](https://code.claude.com/docs/en/settings-reference) is the official page for each key.
- [MCP](../../extend/mcp/index.md) covers servers, config, and runtime.
- [Control MCP Server Access for Your Organization](https://code.claude.com/docs/en/managed-mcp) is the guide for administrators.
- [Plugins and MCP Variables](../env-vars/plugins-and-mcp.md) lists the matching variables.
