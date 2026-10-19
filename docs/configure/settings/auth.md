---
title: Auth Settings
description: Keys that tell Claude Code how to sign in and how to get credentials from your own scripts.
sidebar_position: 4
---

These keys control sign-in rules and credential helpers.
A helper is a script of your own that prints a token or a header.
Claude Code runs the helper when it needs a fresh value.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | ✅ Yes. |
| Can you change it? | Edit a settings file. The helper keys point at your own command. |
| Can you turn it on or off? | The `forceLogin*` keys restrict sign-in methods. |
| Where does it live? | `~/.claude/settings.json`, `.claude/settings.json`, `.claude/settings.local.json`, or managed settings |
| Status | <Documented /> <Undocumented /> |

## Keys

Source: [Settings Reference](https://code.claude.com/docs/en/settings-reference) for rows marked <Documented />. For rows marked <Undocumented />, Source: the program (its bundled settings schema).
Where to Set It tells you which files may set the key. See [Settings Files and Scopes](index.md#where-settings-live).

| Key | Status | Type | Default | What It Does | Where to Set It |
| --- | --- | --- | --- | --- | --- |
| 🔒 `allowedProviders` | <Documented /> | ❓ | - | Limit which API providers a machine may use. Managed settings only. | Managed settings only |
| `apiKeyHelper` | <Documented /> | string | - | Generate the API credential with your own command. | Any settings file |
| `awsAuthRefresh` | <Documented /> | string | - | Refresh expired Bedrock credentials in `.aws` with your own command. | Any settings file |
| `awsCredentialExport` | <Documented /> | string | - | Supply Bedrock credentials as JSON from your own command. | Any settings file |
| `forceLoginGatewayUrl` | <Documented /> | string | - | Set the gateway URL the login screen connects to. Pairs with `forceLoginMethod: "gateway"`. Claude Code ignores it in project, local, flag, and server-managed settings. | User or managed settings |
| `forceLoginMethod` | <Documented /> | enum: `claudeai`, `console`, `gateway` | - | Restrict login to claude.ai, Claude Console, or a cloud gateway. | Any settings file |
| `forceLoginOrgUUID` | <Documented /> | array or string | - | Pin claude.ai logins to your organization. Takes one UUID or an array. In managed settings, login fails for any other account. | Any settings file |
| 🔒 `gatewayInternalNetworks` | <Documented /> | array of string | - | Let `/login` reach a cloud gateway on public IPv4 space your organization uses internally. Up to 4 IPv4 blocks, each `/8` to `/32`. | Managed settings only |
| `gcpAuthRefresh` | <Documented /> | string | - | Refresh Google Cloud credentials with your own command. | Any settings file |
| `otelHeadersHelper` | <Documented /> | string | - | Generate rotating OpenTelemetry headers with your own command. | Any settings file |
| `proxyAuthHelper` | <Documented /> | string | - | Run your own command that prints a `Proxy-Authorization` header value. Read from the highest-priority source only. | Settings files |
| `xaaIdp` | <Undocumented /> | object | - | Set the XAA (SEP-990) identity provider once, and every XAA-enabled MCP server reuses it. | Settings files |

## Example

### Get the API Key from a Script

The first key runs `~/bin/get-key.sh` to get the API key. The second limits sign-in to Claude Console.

```json title="~/.claude/settings.json"
{
  "apiKeyHelper": "~/bin/get-key.sh",
  "forceLoginMethod": "console"
}
```

## Related Pages

- [Settings Files and Scopes](index.md) explains the scopes, precedence, and managed settings.
- [Settings Reference](https://code.claude.com/docs/en/settings-reference) is the official page for each key.
- [Authentication](https://code.claude.com/docs/en/authentication) explains the login methods in the official docs.
- [Auth and Account Variables](../env-vars/auth-and-accounts.md) lists the auth environment variables.
- [Cloud Provider Variables](../env-vars/cloud-providers.md) covers Bedrock, Vertex, and Foundry.
