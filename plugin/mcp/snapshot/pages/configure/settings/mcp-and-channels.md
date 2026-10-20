---
title: "MCP and Channels Settings"
description: "Keys that decide which MCP servers, claude.ai connectors, and channels Claude Code may use."
url: https://xsyetopz.github.io/claude-code-docs/configure/settings/mcp-and-channels
source: docs/configure/settings/mcp-and-channels.md
---

# MCP and Channels Settings


These keys decide which MCP servers and channels Claude Code may use.
An MCP server gives Claude extra tools. A channel is a plugin that can push messages into a session.
Administrators use these keys to allow or block servers.

Allow and block lists need a managed source to bind users. `enableAllProjectMcpServers`, `disableClaudeAiConnectors`, and `channelsEnabled` are switches.

## Keys

Source: [Settings Reference](https://code.claude.com/docs/en/settings-reference) for rows marked [Documented]. For rows marked [Undocumented], Source: the program (its bundled settings schema).
Where to Set It tells you which files may set the key. See [Settings Files and Scopes](https://xsyetopz.github.io/claude-code-docs/configure/settings.md#where-settings-live).

| Key | Status | Type | Default | What It Does | Where to Set It |
| --- | --- | --- | --- | --- | --- |
| `allowAllClaudeAiMcps` | [Documented] [Managed Only] | boolean | - | Load the claude.ai connectors Claude Code fetches itself alongside a deployed `managed-mcp.json`. Off by default, which keeps the lockdown. | Managed settings only |
| `allowClaudeInChromeWithManagedMcp` | [Documented] [Managed Only] | boolean | - | Let the built-in Claude in Chrome server run alongside a deployed `managed-mcp.json`. Device managed settings only. `deniedMcpServers` and the organization Chrome setting still block it. | Managed settings only |
| `allowedChannelPlugins` | [Documented] | array | - | Replace the default allowlist of channel plugins that can push messages. Needs `channelsEnabled: true`. | Managed settings only |
| `allowedMcpServers` | [Documented] | array | - | Allowlist which MCP servers users can add. Each entry has exactly one of `serverName`, `serverCommand` (an exact array), or `serverUrl` (a wildcard pattern such as `https://*.example.com/*`). Not set means allow all. | Any settings file |
| `allowManagedMcpServersOnly` | [Documented] [Managed Only] | boolean | - | Make the managed MCP allowlist the only one that applies. `deniedMcpServers` still merges from all sources. Users can still add servers, but only the admin allowlist applies. | Managed settings only |
| `channelsEnabled` | [Documented] | boolean | - | Allow channels for your organization. On Teams and Enterprise it is off by default. On Console it is on by default unless managed settings exist. | Managed settings only |
| `deniedMcpServers` | [Documented] | array | - | Block specific MCP servers by URL, command, or name. Entries have the same shapes. It applies in all scopes, also for the organization. | Any settings file |
| `disableClaudeAiConnectors` | [Documented] | boolean | - | Turn off claude.ai connectors so Claude Code doesn't fetch them. `true` in any source wins. It also stops a `claudeai-proxy` server from `--mcp-config`. | Any settings file |
| `disabledMcpjsonServers` | [Documented] | array of string | - | Reject specific servers from a project's `.mcp.json`. It blocks in every permission mode and every folder. | Any settings file |
| `enableAllProjectMcpServers` | [Documented] | boolean | - | Approve every server in project `.mcp.json` files without a prompt. Ignored in an untrusted folder when it comes from the checked-in `.claude/settings.json`. | Any settings file |
| `enabledMcpjsonServers` | [Documented] | array of string | - | Approve specific servers from a project's `.mcp.json`. The same trust rule applies. | Any settings file |
| `managedMcpServers` | [Documented] | object | - | Provide remote MCP servers to every user alongside the ones they add. Only `http` and `sse` servers, keyed by name. No `command`, `args`, `env`, or `headersHelper`, no `${VAR}`, and the URL must start with `https://`. Users cannot remove them. `deniedMcpServers` still applies. | Managed settings only |

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

- [Settings Files and Scopes](https://xsyetopz.github.io/claude-code-docs/configure/settings.md) explains the scopes, precedence, and managed settings.
- [Settings Reference](https://code.claude.com/docs/en/settings-reference) is the official page for each key.
- [MCP](https://xsyetopz.github.io/claude-code-docs/extend/mcp.md) covers servers, config, and runtime.
- [Control MCP Server Access for Your Organization](https://code.claude.com/docs/en/managed-mcp) is the guide for administrators.
- [Plugins and MCP Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/plugins-and-mcp.md) lists the matching variables.
