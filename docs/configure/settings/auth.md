---
title: Auth Settings
description: Keys that tell Claude Code how to sign in and how to get credentials from your own scripts.
sidebar_position: 4
---

These keys control sign-in rules and credential helpers.
A helper is a script of your own that prints a token or a header.
Claude Code runs the helper when it needs a fresh value.

The helper keys point at your own command. The `forceLogin*` keys restrict sign-in methods.

## Keys

Source: [Settings Reference](https://code.claude.com/docs/en/settings-reference) for rows marked <Documented />. For rows marked <Undocumented />, Source: the program (its bundled settings schema).
Where to Set It tells you which files may set the key. See [Settings Files and Scopes](index.md#where-settings-live).

| Key | Status | Type | Default | What It Does | Where to Set It |
| --- | --- | --- | --- | --- | --- |
| `allowedProviders` | <Documented /> <ManagedOnly /> | array of: `anthropic`, `customEndpoint`, `bedrock`, `vertex`, `foundry`, `anthropicAws`, `mantle`, `gateway` | - | Limit which API providers a machine may use. Managed settings only. Unknown entries are removed. An empty list admits nothing. A session on an unlisted provider is refused at startup, at login, and on the next API call. `customEndpoint` (any other base URL) is admitted only for a value pinned in the `env` block of the same managed source. Source: the program. | Managed settings only |
| `apiKeyHelper` | <Documented /> | string | - | Generate the API credential with your own command. | Any settings file |
| `awsAuthRefresh` | <Documented /> | string | - | Refresh expired Bedrock credentials in `.aws` with your own command. | Any settings file |
| `awsCredentialExport` | <Documented /> | string | - | Supply Bedrock credentials as JSON from your own command. | Any settings file |
| `forceLoginGatewayUrl` | <Documented /> | string | - | Set the gateway URL the login screen connects to. Pairs with `forceLoginMethod: "gateway"`. Claude Code ignores it in project, local, flag, and server-managed settings. | User or managed settings |
| `forceLoginMethod` | <Documented /> | enum: `claudeai`, `console`, `gateway` | - | Restrict login to claude.ai, Claude Console, or a cloud gateway. | Any settings file |
| `forceLoginOrgUUID` | <Documented /> | array or string | - | Pin claude.ai logins to your organization. Takes one UUID or an array. In managed settings, login fails for any other account. | Any settings file |
| `gatewayInternalNetworks` | <Documented /> <ManagedOnly /> | array of string | - | Let `/login` reach a cloud gateway on public IPv4 space your organization uses internally. Up to 4 IPv4 blocks, each `/8` to `/32`. | Managed settings only |
| `gcpAuthRefresh` | <Documented /> | string | - | Refresh Google Cloud credentials with your own command. | Any settings file |
| `otelHeadersHelper` | <Documented /> | string | - | Generate rotating OpenTelemetry headers with your own command. | Any settings file |
| `proxyAuthHelper` | <Documented /> | string | - | Run your own command that prints a `Proxy-Authorization` header value. Read from the highest-priority source only. | Settings files |
| `xaaIdp` | <Undocumented /> | object | - | Set the XAA (SEP-990) identity provider once, and every XAA-enabled MCP server reuses it. `claude mcp xaa setup` writes it as an object `{ issuer, clientId, callbackPort? }`. | User settings |

## Example

### Get the API Key from a Script

The first key runs `~/bin/get-key.sh` to get the API key. The second limits sign-in to Claude Console.

```json title="~/.claude/settings.json"
{
  "$schema": "https://xsyetopz.github.io/clawdipedia/schemas/claude-code-settings.json",
  "apiKeyHelper": "~/bin/get-key.sh",
  "forceLoginMethod": "console"
}
```

## Errors

Each row is a family of messages. The backticked text is the start that every message in the family shares. A row marked `Various` gathers the messages of one feature that do not share one start.

| Start of Message | Status | What It Means | Cases |
| --- | --- | --- | --- |
| Various | <Undocumented /> | **Login and accounts.** A sign-in, sign-out, token, or profile step was refused. | `--console` and `--claudeai` were both given, the policy does not permit `setup-token`, an API key or provider setting takes precedence over a profile, a workload identity federation machine signs in on its own, a profile name or config file is not valid, the code is not valid, or an account call such as the org UUID or an API key creation failed. |
| Various | <Undocumented /> | **Grove settings.** A Grove setting or notice could not be read or changed. | The request failed or the answer has no `grove_enabled` value. |
| Various | <Undocumented /> | **Billing and usage requests.** A billing, usage, or metrics request failed. | The text names the request (for example `prepaid/credits`, `payment_method`, `auto_reload_settings`, `metrics_enabled`) and says it is unavailable, with the reason. |
| Various | <Undocumented /> | **Provider and model setup.** A provider or model setting is not valid. | A project or region value has characters that the request path does not allow, a Foundry resource name is not valid, a model catalog entry or alias is not valid, or a fallback model cannot be used. |

## Claude Apps Gateway Server Key

The key `oidc.user_id_claim` belongs to the server configuration of the Claude apps gateway, not to a Claude Code settings file.
No file under `schemas/` holds it, so its status is unconfirmed. The program defines it as an optional non-empty string.

| Key | Status | What it does | Notes |
| --- | --- | --- | --- |
| `oidc.user_id_claim` | <Undocumented /> | Names the `id_token` claim that identifies a person. Default `sub`. | New in `2.1.312`. The token must still carry a non-empty `sub`. If the named claim is not a non-empty string, sign-in fails with `USER_ID_CLAIM_MISSING` and the message says to check `oidc.scopes`. Source: `chunk-gs1pnh66.js` lines 57717, 61506, and 61545. |

## Related Pages

- [Settings Files and Scopes](index.md) explains the scopes, precedence, and managed settings.
- [Settings Reference](https://code.claude.com/docs/en/settings-reference) is the official page for each key.
- [Authentication](https://code.claude.com/docs/en/authentication) explains the login methods in the official docs.
- [Auth and Account Variables](../env-vars/auth-and-accounts.md) lists the auth environment variables.
- [Cloud Provider Variables](../env-vars/cloud-providers.md) covers Bedrock, Vertex, and Foundry.
