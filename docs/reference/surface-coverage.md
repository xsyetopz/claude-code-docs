---
title: Surface Coverage
description: Every item that the Claude Code 2.1.309 program holds, by kind, with the page that covers it.
sidebar_position: 11
draft: true
---

The program of Claude Code `2.1.309` holds 8893 items in 17 kinds.
Each row below names the page that covers an item, or the reason the item is left out.
`bun run surface` makes this page from `schemas/surface.json`, so do not edit it by hand.

## Summary

| Kind | Items | In a Docs Table | In the Map | Excluded | Not on a Page Yet |
| --- | --- | --- | --- | --- | --- |
| [Betas](#betas) | 50 | 49 | 0 | 0 | 1 |
| [API Endpoints](#api-endpoints) | 431 | 25 | 0 | 0 | 406 |
| [Environment Variables](#environment-variables) | 1846 | 1322 | 0 | 0 | 524 |
| [Error Texts](#error-texts) | 4022 | 3 | 0 | 0 | 4019 |
| [Files](#files) | 78 | 2 | 0 | 0 | 76 |
| [CLI Flags](#cli-flags) | 303 | 49 | 0 | 0 | 254 |
| [Gates](#gates) | 1101 | 7 | 0 | 0 | 1094 |
| [Hook Events](#hook-events) | 33 | 33 | 0 | 0 | 0 |
| [Keybindings](#keybindings) | 204 | 0 | 0 | 0 | 204 |
| [Mod API](#mod-api) | 229 | 229 | 0 | 0 | 0 |
| [Models](#models) | 66 | 51 | 0 | 0 | 15 |
| [OpenTelemetry Events](#opentelemetry-events) | 28 | 0 | 0 | 0 | 28 |
| [Permission Rules](#permission-rules) | 6 | 6 | 0 | 0 | 0 |
| [Settings](#settings) | 194 | 192 | 0 | 0 | 2 |
| [Slash Commands](#slash-commands) | 142 | 100 | 0 | 0 | 42 |
| [Subcommands](#subcommands) | 71 | 8 | 0 | 0 | 63 |
| [Tools](#tools) | 89 | 76 | 0 | 0 | 13 |
| Total | 8893 | 2152 | 0 | 0 | 6741 |

## Betas

Items: 50.

| Item | Where |
| --- | --- |
| `advanced-tool-use-2025-11-20` | [Betas](api/betas.md) |
| `advisor-tool-2026-03-01` | [Betas](api/betas.md) |
| `afk-mode-2026-01-31` | [Betas](api/betas.md) |
| `agent-memory-2026-07-22` | [Betas](api/betas.md) |
| `auto-mode-classifier-2026-07-16` | [Betas](api/betas.md) |
| `cache-diagnosis-2026-04-07` | [Betas](api/betas.md) |
| `cache-keepalive-2026-09-03` | [Betas](api/betas.md) |
| `ccr-byoc-2025-07-29` | [Betas](api/betas.md) |
| `ccr-triggers-2026-01-30` | [Betas](api/betas.md) |
| `claude-code-20250219` | [Betas](api/betas.md) |
| `context-1m-2025-08-07` | [Betas](api/betas.md) |
| `context-hint-2026-04-09` | [Betas](api/betas.md) |
| `context-management-2025-06-27` | [Betas](api/betas.md) |
| `dangerous-tool-use-2026-09-03` | [Betas](api/betas.md) |
| `dreaming-2026-04-21` | [Betas](api/betas.md) |
| `effort-2025-11-24` | [Betas](api/betas.md) |
| `environments-2025-11-01` | [Betas](api/betas.md) |
| `extended-cache-ttl-2025-04-11` | [Betas](api/betas.md) |
| `fallback-credit-2026-06-01` | [Betas](api/betas.md) |
| `fast-mode-2026-02-01` | [Betas](api/betas.md) |
| `files-api-2025-04-14` | [Betas](api/betas.md) |
| `inline-tools-2026-09-15` | [Betas](api/betas.md) |
| `interleaved-thinking-2025-05-14` | [Betas](api/betas.md) |
| `managed-agents-2026-04-01` | [Betas](api/betas.md) |
| `mcp-servers-2025-12-04` | [Betas](api/betas.md) |
| `mcp-tunnels-2026-06-22` | [Betas](api/betas.md) |
| `message-batches-2024-09-24` | [Betas](api/betas.md) |
| `message-threads-2026-08-12` | [Betas](api/betas.md) |
| `mid-conversation-system-2026-04-07` | Not on a page yet |
| `mid-conversation-system-clear-at-2026-08-21` | [Betas](api/betas.md) |
| `mid-conversation-tool-changes-2026-07-01` | [Betas](api/betas.md) |
| `oauth-2025-04-20` | [Betas](api/betas.md) |
| `oidc-federation-2026-04-01` | [Betas](api/betas.md) |
| `per-turn-control-2026-07-01` | [Betas](api/betas.md) |
| `prompt-caching-evict-2026-05-12` | [Betas](api/betas.md) |
| `prompt-caching-scope-2026-01-05` | [Betas](api/betas.md) |
| `redact-thinking-2026-02-12` | [Betas](api/betas.md) |
| `server-side-fallback-2026-06-01` | [Betas](api/betas.md) |
| `server-side-fallback-2026-07-01` | [Betas](api/betas.md) |
| `structured-outputs-2025-12-15` | [Betas](api/betas.md) |
| `task-budgets-2026-03-13` | [Betas](api/betas.md) |
| `thinking-binding-controls-2026-08-01` | [Betas](api/betas.md) |
| `thinking-display-updates-2026-08-18` | [Betas](api/betas.md) |
| `thinking-resumption-2026-07-17` | [Betas](api/betas.md) |
| `thinking-token-count-2026-05-13` | [Betas](api/betas.md) |
| `timing-2026-09-09` | [Betas](api/betas.md) |
| `token-counting-2024-11-01` | [Betas](api/betas.md) |
| `tool-search-tool-2025-10-19` | [Betas](api/betas.md) |
| `user-profiles-2026-08-18` | [Betas](api/betas.md) |
| `web-search-2025-03-05` | [Betas](api/betas.md) |

## API Endpoints

Items: 431.

| Item | Where |
| --- | --- |
| `/api/artifacts/mcp` | Not on a page yet |
| `/api/auth/trusted_devices` | Not on a page yet |
| `/api/claude_cli/bootstrap` | Not on a page yet |
| `/api/claude_cli_feedback` | [Endpoints and Headers](api/endpoints.md) |
| `/api/claude_cli_profile` | Not on a page yet |
| `/api/claude_code/metrics` | Not on a page yet |
| `/api/claude_code/notification/preferences` | [Endpoints and Headers](api/endpoints.md) |
| `/api/claude_code/organizations/metrics_enabled` | [Endpoints and Headers](api/endpoints.md) |
| `/api/claude_code/policy_limits` | [Endpoints and Headers](api/endpoints.md) |
| `/api/claude_code/settings` | Not on a page yet |
| `/api/claude_code/skills` | [Endpoints and Headers](api/endpoints.md) |
| `/api/claude_code_grove` | Not on a page yet |
| `/api/claude_code_penguin_mode` | Not on a page yet |
| `/api/claude_code_shared_session_transcripts` | [Endpoints and Headers](api/endpoints.md) |
| `/api/desktop/` | Not on a page yet |
| `/api/desktop/darwin/universal/dmg/latest/redirect` | Not on a page yet |
| `/api/desktop/win32/x64/exe/latest/redirect` | Not on a page yet |
| `/api/directory/plugins` | Not on a page yet |
| `/api/directory/servers?${…}` | Not on a page yet |
| `/api/eval-authed/${…}` | Not on a page yet |
| `/api/eval/${…}` | Not on a page yet |
| `/api/event_logging/` | Not on a page yet |
| `/api/event_logging/v2/batch` | [Endpoints and Headers](api/endpoints.md) |
| `/api/features/${…}` | Not on a page yet |
| `/api/frame/` | Not on a page yet |
| `/api/frame/${…}` | Not on a page yet |
| `/api/frame/${…}?${…}${…}${…}` | Not on a page yet |
| `/api/frame/blob/${…}/${…}/agent-delete` | Not on a page yet |
| `/api/frame/blob/${…}/agent-copy` | Not on a page yet |
| `/api/frame/blob/${…}/agent-list` | Not on a page yet |
| `/api/frame/blob/${…}/agent-upload` | Not on a page yet |
| `/api/frame/comments/${…}${…}` | Not on a page yet |
| `/api/frame/comments/${…}/${…}` | Not on a page yet |
| `/api/frame/comments/${…}/${…}/${…}` | Not on a page yet |
| `/api/frame/comments/${…}/${…}/resolve` | Not on a page yet |
| `/api/frame/comments/${…}/${…}/summon-status` | Not on a page yet |
| `/api/frame/content/${…}${…}` | Not on a page yet |
| `/api/frame/contract/${…}` | Not on a page yet |
| `/api/frame/contract/${…}/${…}.d.ts` | Not on a page yet |
| `/api/frame/contract/${…}/prompt` | Not on a page yet |
| `/api/frame/contract/latest` | Not on a page yet |
| `/api/frame/db/agent` | Not on a page yet |
| `/api/frame/deploy/direct` | Not on a page yet |
| `/api/frame/deploy/direct?${…}` | Not on a page yet |
| `/api/frame/deploy/prepare` | Not on a page yet |
| `/api/frame/diag/${…}/${…}` | Not on a page yet |
| `/api/frame/favorite/${…}` | Not on a page yet |
| `/api/frame/frames/external` | Not on a page yet |
| `/api/frame/frames?limit=${…}` | Not on a page yet |
| `/api/frame/frames?limit=200` | Not on a page yet |
| `/api/frame/perm/${…}${…}` | Not on a page yet |
| `/api/frame/read/${…}` | Not on a page yet |
| `/api/frame/retitle/${…}` | Not on a page yet |
| `/api/frame/subscribe/${…}` | Not on a page yet |
| `/api/frame/sync` | Not on a page yet |
| `/api/frame/track` | Not on a page yet |
| `/api/frame/types` | Not on a page yet |
| `/api/frame/types/${…}` | Not on a page yet |
| `/api/frame/types/${…}/create` | Not on a page yet |
| `/api/frame/types/${…}/files/${…}` | Not on a page yet |
| `/api/frame/types/${…}/instances?limit=${…}${…}` | Not on a page yet |
| `/api/frame/types?${…}` | Not on a page yet |
| `/api/frame/unsubscribe/${…}` | Not on a page yet |
| `/api/frame/upload` | Not on a page yet |
| `/api/frame/user/profiles/${…}` | Not on a page yet |
| `/api/frame/versions/${…}` | Not on a page yet |
| `/api/frame/watch-token/${…}?vn=${…}` | Not on a page yet |
| `/api/hello` | Not on a page yet |
| `/api/model_selector/${…}` | Not on a page yet |
| `/api/oauth/account/grove_notice_viewed` | Not on a page yet |
| `/api/oauth/account/settings` | [Endpoints and Headers](api/endpoints.md) |
| `/api/oauth/claude_cli/create_api_key` | Not on a page yet |
| `/api/oauth/claude_cli/roles` | Not on a page yet |
| `/api/oauth/cri` | Not on a page yet |
| `/api/oauth/file_upload` | Not on a page yet |
| `/api/oauth/files/${…}/content` | Not on a page yet |
| `/api/oauth/local_pairing` | Not on a page yet |
| `/api/oauth/organizations/${…}` | Not on a page yet |
| `/api/oauth/organizations/${…}/code/repos/${…}/${…}` | Not on a page yet |
| `/api/oauth/organizations/${…}/code/repos/resync` | Not on a page yet |
| `/api/oauth/organizations/${…}/sync/github/auth` | Not on a page yet |
| `/api/oauth/profile` | [Endpoints and Headers](api/endpoints.md) |
| `/api/oauth/usage` | [Endpoints and Headers](api/endpoints.md) |
| `/api/oauth/usage?${…}=${…}&skip_spend=1` | Not on a page yet |
| `/api/oauth/validate` | Not on a page yet |
| `/api/organization/claude_code_first_token_date` | [Endpoints and Headers](api/endpoints.md) |
| `/api/organizations/${…}/mcp/start-auth/${…}?product_surface=${…}` | Not on a page yet |
| `/api/organizations/${…}/reset_rate_limits` | Not on a page yet |
| `/api/v2/rum` | Not on a page yet |
| `/api/v4/` | Not on a page yet |
| `/api/ws/speech_to_text/voice_stream` | [Endpoints and Headers](api/endpoints.md) |
| `/model/${…}/invoke` | Not on a page yet |
| `/model/${…}/invoke-with-response-stream` | Not on a page yet |
| `/model/{modelId}/count-tokens` | Not on a page yet |
| `/v1/${…}` | Not on a page yet |
| `/v1/${…}:generateAccessToken` | Not on a page yet |
| `/v1/${…}:generateIdToken` | Not on a page yet |
| `/v1/${…}:signBlob` | Not on a page yet |
| `/v1/agents/${…}/archive?beta=true` | Not on a page yet |
| `/v1/agents/${…}/versions?beta=true` | Not on a page yet |
| `/v1/agents/${…}?beta=true` | Not on a page yet |
| `/v1/agents?beta=true` | Not on a page yet |
| `/v1/claude/test/` | Not on a page yet |
| `/v1/claudeai-agents/mcp` | Not on a page yet |
| `/v1/code/` | Not on a page yet |
| `/v1/code/.well-known/jwks.json` | Not on a page yet |
| `/v1/code/agent-proxy` | [Endpoints and Headers](api/endpoints.md) |
| `/v1/code/auth/refresh` | Not on a page yet |
| `/v1/code/github/${…}-pull-request` | Not on a page yet |
| `/v1/code/github/get-batch-branch-status` | Not on a page yet |
| `/v1/code/github/import-token` | Not on a page yet |
| `/v1/code/github/post-review-comment` | Not on a page yet |
| `/v1/code/local/` | Not on a page yet |
| `/v1/code/local/memory/credential` | Not on a page yet |
| `/v1/code/local/memory/mounts` | Not on a page yet |
| `/v1/code/mcp/` | Not on a page yet |
| `/v1/code/mcp/ccr-artifacts` | Not on a page yet |
| `/v1/code/mcp/hearthbot` | Not on a page yet |
| `/v1/code/memory/` | Not on a page yet |
| `/v1/code/runners/self-hosted/deregister` | Not on a page yet |
| `/v1/code/runners/self-hosted/pools` | Not on a page yet |
| `/v1/code/runners/self-hosted/pools/${…}` | Not on a page yet |
| `/v1/code/runners/self-hosted/pools/${…}/secrets` | Not on a page yet |
| `/v1/code/runners/self-hosted/pools/${…}/sessions${…}` | Not on a page yet |
| `/v1/code/runners/self-hosted/runners/${…}/poll` | Not on a page yet |
| `/v1/code/runners/self-hosted/runners/${…}/work-hints/stream` | Not on a page yet |
| `/v1/code/runners/self-hosted/runners/register` | Not on a page yet |
| `/v1/code/runners/self-hosted/runners?pool_id=${…}` | Not on a page yet |
| `/v1/code/runners/self-hosted/sessions/${…}/release` | Not on a page yet |
| `/v1/code/runners/self-hosted/sessions/${…}/report-failure` | Not on a page yet |
| `/v1/code/runners/self-hosted/sessions/${…}/requeue` | Not on a page yet |
| `/v1/code/runners/self-hosted/sessions/${…}/token` | Not on a page yet |
| `/v1/code/runners/self-hosted/spawn-hints/nack` | Not on a page yet |
| `/v1/code/runners/self-hosted/spawn-hints/poll` | Not on a page yet |
| `/v1/code/scm-connectors/{provider}/{id}/tunnel` | Not on a page yet |
| `/v1/code/sessions` | [Endpoints and Headers](api/endpoints.md) |
| `/v1/code/sessions/` | Not on a page yet |
| `/v1/code/sessions/${…}` | Not on a page yet |
| `/v1/code/sessions/${…}${…}` | Not on a page yet |
| `/v1/code/sessions/${…}/agent-proxy` | Not on a page yet |
| `/v1/code/sessions/${…}/archive` | Not on a page yet |
| `/v1/code/sessions/${…}/bridge` | Not on a page yet |
| `/v1/code/sessions/${…}/client/presence` | Not on a page yet |
| `/v1/code/sessions/${…}/device` | Not on a page yet |
| `/v1/code/sessions/${…}/events` | Not on a page yet |
| `/v1/code/sessions/${…}/events/stream` | Not on a page yet |
| `/v1/code/sessions/${…}/events?${…}` | Not on a page yet |
| `/v1/code/sessions/${…}/events?limit=${…}&sort_order=desc` | Not on a page yet |
| `/v1/code/sessions/${…}/file?${…}` | Not on a page yet |
| `/v1/code/sessions/${…}/inbox/${…}` | Not on a page yet |
| `/v1/code/sessions/${…}/mark_read` | Not on a page yet |
| `/v1/code/sessions/${…}/move-to-cloud` | Not on a page yet |
| `/v1/code/sessions/${…}/remote` | Not on a page yet |
| `/v1/code/sessions/${…}/sign-commit` | Not on a page yet |
| `/v1/code/sessions/${…}/synced_file` | Not on a page yet |
| `/v1/code/sessions/${…}/teleport-events` | Not on a page yet |
| `/v1/code/sessions/${…}/teleport-events?${…}` | Not on a page yet |
| `/v1/code/sessions/${…}/tool_hosts/refuse` | Not on a page yet |
| `/v1/code/sessions/${…}/worker` | Not on a page yet |
| `/v1/code/sessions/${…}/worker/channels/${…}/files:write` | Not on a page yet |
| `/v1/code/sessions/${…}/worker/diagnostics` | Not on a page yet |
| `/v1/code/sessions/${…}/worker/events` | Not on a page yet |
| `/v1/code/sessions/${…}/worker/heartbeat` | Not on a page yet |
| `/v1/code/sessions/${…}/worker/otlp/${…}` | Not on a page yet |
| `/v1/code/sessions/${…}/worker/register` | Not on a page yet |
| `/v1/code/sessions?${…}` | Not on a page yet |
| `/v1/code/sessions?limit=${…}` | Not on a page yet |
| `/v1/code/sessions?limit=1` | Not on a page yet |
| `/v1/code/sessions?limit=100${…}` | Not on a page yet |
| `/v1/code/triggers` | [Endpoints and Headers](api/endpoints.md) |
| `/v1/code/triggers/` | Not on a page yet |
| `/v1/code/triggers/${…}` | Not on a page yet |
| `/v1/code/triggers/${…}/run` | Not on a page yet |
| `/v1/code/webhook-triggers` | Not on a page yet |
| `/v1/complete` | Not on a page yet |
| `/v1/deployment_runs/${…}?beta=true` | Not on a page yet |
| `/v1/deployment_runs?beta=true` | Not on a page yet |
| `/v1/deployments/${…}/archive?beta=true` | Not on a page yet |
| `/v1/deployments/${…}/pause?beta=true` | Not on a page yet |
| `/v1/deployments/${…}/run?beta=true` | Not on a page yet |
| `/v1/deployments/${…}/unpause?beta=true` | Not on a page yet |
| `/v1/deployments/${…}?beta=true` | Not on a page yet |
| `/v1/deployments?beta=true` | Not on a page yet |
| `/v1/design/` | Not on a page yet |
| `/v1/design/consent` | Not on a page yet |
| `/v1/design/grants` | Not on a page yet |
| `/v1/design/mcp` | Not on a page yet |
| `/v1/dreams/${…}/archive?beta=true` | Not on a page yet |
| `/v1/dreams/${…}/cancel?beta=true` | Not on a page yet |
| `/v1/dreams/${…}?beta=true` | Not on a page yet |
| `/v1/dreams?beta=true` | Not on a page yet |
| `/v1/environment_providers` | Not on a page yet |
| `/v1/environment_providers/cloud/create` | Not on a page yet |
| `/v1/environments/${…}/archive?beta=true` | Not on a page yet |
| `/v1/environments/${…}/bridge/reconnect` | Not on a page yet |
| `/v1/environments/${…}/work/${…}/ack` | Not on a page yet |
| `/v1/environments/${…}/work/${…}/ack?beta=true` | Not on a page yet |
| `/v1/environments/${…}/work/${…}/heartbeat` | Not on a page yet |
| `/v1/environments/${…}/work/${…}/heartbeat?beta=true` | Not on a page yet |
| `/v1/environments/${…}/work/${…}/stop` | Not on a page yet |
| `/v1/environments/${…}/work/${…}/stop?beta=true` | Not on a page yet |
| `/v1/environments/${…}/work/${…}?beta=true` | Not on a page yet |
| `/v1/environments/${…}/work/poll` | Not on a page yet |
| `/v1/environments/${…}/work/poll?beta=true` | Not on a page yet |
| `/v1/environments/${…}/work/stats?beta=true` | Not on a page yet |
| `/v1/environments/${…}/work?beta=true` | Not on a page yet |
| `/v1/environments/${…}?beta=true` | Not on a page yet |
| `/v1/environments/bridge` | Not on a page yet |
| `/v1/environments/bridge/${…}` | Not on a page yet |
| `/v1/environments/bridge/${…}/offline` | Not on a page yet |
| `/v1/environments?beta=true` | Not on a page yet |
| `/v1/files` | Not on a page yet |
| `/v1/files/${…}` | Not on a page yet |
| `/v1/files/${…}/content` | Not on a page yet |
| `/v1/files/${…}/content?beta=true` | Not on a page yet |
| `/v1/files/${…}?beta=true` | Not on a page yet |
| `/v1/files?beta=true` | Not on a page yet |
| `/v1/filestore/fs/listDirectory` | Not on a page yet |
| `/v1/filestore/fs/readFile` | Not on a page yet |
| `/v1/logs` | [Endpoints and Headers](api/endpoints.md) |
| `/v1/mcp/{server_id}` | Not on a page yet |
| `/v1/mcp_servers?limit=1000` | Not on a page yet |
| `/v1/me` | Not on a page yet |
| `/v1/memory_stores/${…}/archive?beta=true` | Not on a page yet |
| `/v1/memory_stores/${…}/memories/${…}?beta=true` | Not on a page yet |
| `/v1/memory_stores/${…}/memories?beta=true` | Not on a page yet |
| `/v1/memory_stores/${…}/memory_versions/${…}/redact?beta=true` | Not on a page yet |
| `/v1/memory_stores/${…}/memory_versions/${…}?beta=true` | Not on a page yet |
| `/v1/memory_stores/${…}/memory_versions?beta=true` | Not on a page yet |
| `/v1/memory_stores/${…}?beta=true` | Not on a page yet |
| `/v1/memory_stores?beta=true` | Not on a page yet |
| `/v1/messages` | Not on a page yet |
| `/v1/messages/batches` | Not on a page yet |
| `/v1/messages/batches/${…}` | Not on a page yet |
| `/v1/messages/batches/${…}/cancel` | Not on a page yet |
| `/v1/messages/batches/${…}/cancel?beta=true` | Not on a page yet |
| `/v1/messages/batches/${…}?beta=true` | Not on a page yet |
| `/v1/messages/batches?beta=true` | Not on a page yet |
| `/v1/messages/cache_touch` | [Endpoints and Headers](api/endpoints.md) |
| `/v1/messages/count_tokens` | [Endpoints and Headers](api/endpoints.md) |
| `/v1/messages/count_tokens?beta=true` | Not on a page yet |
| `/v1/messages?beta=true` | [Endpoints and Headers](api/endpoints.md) |
| `/v1/metrics` | [Endpoints and Headers](api/endpoints.md) |
| `/v1/models` | [Endpoints and Headers](api/endpoints.md) |
| `/v1/models/${…}` | Not on a page yet |
| `/v1/models/${…}?beta=true` | Not on a page yet |
| `/v1/models?beta=true` | Not on a page yet |
| `/v1/models?limit=1000` | Not on a page yet |
| `/v1/oauth/hello` | Not on a page yet |
| `/v1/oauth/token` | [Endpoints and Headers](api/endpoints.md) |
| `/v1/organizations/` | Not on a page yet |
| `/v1/organizations/api_keys/${…}?beta=true` | Not on a page yet |
| `/v1/organizations/api_keys?beta=true` | Not on a page yet |
| `/v1/organizations/compliance_settings?beta=true` | Not on a page yet |
| `/v1/organizations/external_keys/${…}/validate?beta=true` | Not on a page yet |
| `/v1/organizations/external_keys/${…}?beta=true` | Not on a page yet |
| `/v1/organizations/external_keys?beta=true` | Not on a page yet |
| `/v1/organizations/federation_issuers/${…}/archive?beta=true` | Not on a page yet |
| `/v1/organizations/federation_issuers/${…}?beta=true` | Not on a page yet |
| `/v1/organizations/federation_issuers?beta=true` | Not on a page yet |
| `/v1/organizations/federation_rules/${…}/archive?beta=true` | Not on a page yet |
| `/v1/organizations/federation_rules/${…}/workspaces/${…}?beta=true` | Not on a page yet |
| `/v1/organizations/federation_rules/${…}/workspaces?beta=true` | Not on a page yet |
| `/v1/organizations/federation_rules/${…}?beta=true` | Not on a page yet |
| `/v1/organizations/federation_rules?beta=true` | Not on a page yet |
| `/v1/organizations/invites/${…}?beta=true` | Not on a page yet |
| `/v1/organizations/invites?beta=true` | Not on a page yet |
| `/v1/organizations/me?beta=true` | Not on a page yet |
| `/v1/organizations/rate_limits?beta=true` | Not on a page yet |
| `/v1/organizations/service_accounts/${…}/archive?beta=true` | Not on a page yet |
| `/v1/organizations/service_accounts/${…}/workspaces/${…}?beta=true` | Not on a page yet |
| `/v1/organizations/service_accounts/${…}/workspaces?beta=true` | Not on a page yet |
| `/v1/organizations/service_accounts/${…}?beta=true` | Not on a page yet |
| `/v1/organizations/service_accounts?beta=true` | Not on a page yet |
| `/v1/organizations/spend_limits` | Not on a page yet |
| `/v1/organizations/users/${…}?beta=true` | Not on a page yet |
| `/v1/organizations/users?beta=true` | Not on a page yet |
| `/v1/organizations/workspaces/${…}/archive?beta=true` | Not on a page yet |
| `/v1/organizations/workspaces/${…}/members/${…}?beta=true` | Not on a page yet |
| `/v1/organizations/workspaces/${…}/members?beta=true` | Not on a page yet |
| `/v1/organizations/workspaces/${…}/rate_limits?beta=true` | Not on a page yet |
| `/v1/organizations/workspaces/${…}/service_accounts/${…}?beta=true` | Not on a page yet |
| `/v1/organizations/workspaces/${…}/service_accounts?beta=true` | Not on a page yet |
| `/v1/organizations/workspaces/${…}?beta=true` | Not on a page yet |
| `/v1/organizations/workspaces?beta=true` | Not on a page yet |
| `/v1/pages/mcp` | Not on a page yet |
| `/v1/session_ingress/session/${…}` | Not on a page yet |
| `/v1/session_ingress/session/${…}/git_proxy/${…}/${…}.git` | Not on a page yet |
| `/v1/sessions` | Not on a page yet |
| `/v1/sessions/${…}` | Not on a page yet |
| `/v1/sessions/${…}${…}` | Not on a page yet |
| `/v1/sessions/${…}/archive` | Not on a page yet |
| `/v1/sessions/${…}/archive?beta=true` | Not on a page yet |
| `/v1/sessions/${…}/events` | Not on a page yet |
| `/v1/sessions/${…}/events/stream?beta=true` | Not on a page yet |
| `/v1/sessions/${…}/events?beta=true` | Not on a page yet |
| `/v1/sessions/${…}/resources/${…}?beta=true` | Not on a page yet |
| `/v1/sessions/${…}/resources?beta=true` | Not on a page yet |
| `/v1/sessions/${…}/threads/${…}/archive?beta=true` | Not on a page yet |
| `/v1/sessions/${…}/threads/${…}/events?beta=true` | Not on a page yet |
| `/v1/sessions/${…}/threads/${…}/stream?beta=true` | Not on a page yet |
| `/v1/sessions/${…}/threads/${…}?beta=true` | Not on a page yet |
| `/v1/sessions/${…}/threads?beta=true` | Not on a page yet |
| `/v1/sessions/${…}?beta=true` | Not on a page yet |
| `/v1/sessions?beta=true` | Not on a page yet |
| `/v1/skills` | Not on a page yet |
| `/v1/skills/${…}` | Not on a page yet |
| `/v1/skills/${…}/versions` | Not on a page yet |
| `/v1/skills/${…}/versions/${…}` | Not on a page yet |
| `/v1/skills/${…}/versions/${…}/content?beta=true` | Not on a page yet |
| `/v1/skills/${…}/versions/${…}?beta=true` | Not on a page yet |
| `/v1/skills/${…}/versions?beta=true` | Not on a page yet |
| `/v1/skills/${…}?beta=true` | Not on a page yet |
| `/v1/skills?beta=true` | Not on a page yet |
| `/v1/token` | Not on a page yet |
| `/v1/toolbox/shttp/mcp/{server_id}` | Not on a page yet |
| `/v1/traces` | [Endpoints and Headers](api/endpoints.md) |
| `/v1/tunnels/${…}/archive?beta=true` | Not on a page yet |
| `/v1/tunnels/${…}/certificates/${…}/archive?beta=true` | Not on a page yet |
| `/v1/tunnels/${…}/certificates/${…}?beta=true` | Not on a page yet |
| `/v1/tunnels/${…}/certificates?beta=true` | Not on a page yet |
| `/v1/tunnels/${…}/reveal_token?beta=true` | Not on a page yet |
| `/v1/tunnels/${…}/rotate_token?beta=true` | Not on a page yet |
| `/v1/tunnels/${…}?beta=true` | Not on a page yet |
| `/v1/tunnels?beta=true` | Not on a page yet |
| `/v1/ultrareview/preflight` | [Endpoints and Headers](api/endpoints.md) |
| `/v1/ultrareview/quota` | [Endpoints and Headers](api/endpoints.md) |
| `/v1/user_profiles/${…}/enrollment_url?beta=true` | Not on a page yet |
| `/v1/user_profiles/${…}?beta=true` | Not on a page yet |
| `/v1/user_profiles?beta=true` | Not on a page yet |
| `/v1/vaults/${…}/archive?beta=true` | Not on a page yet |
| `/v1/vaults/${…}/credentials/${…}/archive?beta=true` | Not on a page yet |
| `/v1/vaults/${…}/credentials/${…}/mcp_oauth_validate?beta=true` | Not on a page yet |
| `/v1/vaults/${…}/credentials/${…}?beta=true` | Not on a page yet |
| `/v1/vaults/${…}/credentials?beta=true` | Not on a page yet |
| `/v1/vaults/${…}?beta=true` | Not on a page yet |
| `/v1/vaults?beta=true` | Not on a page yet |
| `https://anthropic.com/claude-code/plugin.schema.json` | Not on a page yet |
| `https://anthropic.com/legal/privacy` | Not on a page yet |
| `https://anthropic.com/legal/terms` | Not on a page yet |
| `https://anthropic.com/supported-countries` | Not on a page yet |
| `https://api-staging.anthropic.com` | Not on a page yet |
| `https://api.anthropic.com` | Not on a page yet |
| `https://api.anthropic.com/` | Not on a page yet |
| `https://api.anthropic.com/api/event_logging/v2/batch` | Not on a page yet |
| `https://api.anthropic.com/api/oauth/claude_cli/create_api_key` | Not on a page yet |
| `https://api.anthropic.com/api/oauth/claude_cli/roles` | Not on a page yet |
| `https://api.anthropic.com/api/oauth/cri` | Not on a page yet |
| `https://beacon.claude-ai.staging.ant.dev` | Not on a page yet |
| `https://clau.de/chrome/permissions` | Not on a page yet |
| `https://clau.de/chrome/reconnect` | Not on a page yet |
| `https://clau.de/chrome/tab/` | Not on a page yet |
| `https://clau.de/desktop` | Not on a page yet |
| `https://clau.de/desktop-3p` | Not on a page yet |
| `https://clau.de/enterprise` | Not on a page yet |
| `https://clau.de/radio` | Not on a page yet |
| `https://clau.de/wrap-up` | Not on a page yet |
| `https://claude-ai.staging.ant.dev` | Not on a page yet |
| `https://claude.ai` | Not on a page yet |
| `https://claude.ai/admin-settings/usage` | Not on a page yet |
| `https://claude.ai/api/desktop/darwin/universal/dmg/latest/redirect` | Not on a page yet |
| `https://claude.ai/api/desktop/win32/x64/exe/latest/redirect` | Not on a page yet |
| `https://claude.ai/chrome` | Not on a page yet |
| `https://claude.ai/code` | Not on a page yet |
| `https://claude.ai/code/onboarding?magic=env-setup` | Not on a page yet |
| `https://claude.ai/design?utm_source=claude_code&utm_medium=tip&utm_campaign=tengu_cedar_plume` | Not on a page yet |
| `https://claude.ai/mobile?entrypoint=claude_code_cli` | Not on a page yet |
| `https://claude.ai/oauth/claude-code-client-metadata` | Not on a page yet |
| `https://claude.ai/restricted` | Not on a page yet |
| `https://claude.ai/settings/data-privacy-controls` | Not on a page yet |
| `https://claude.ai/settings/usage` | Not on a page yet |
| `https://claude.ai/settings/usage?from=cc_cli_limit_message` | Not on a page yet |
| `https://claude.com/blog/the-advisor-strategy` | Not on a page yet |
| `https://claude.com/cai/oauth/authorize` | Not on a page yet |
| `https://claude.com/claude-code` | Not on a page yet |
| `https://claude.com/docs/claude-tag/overview.md` | Not on a page yet |
| `https://claude.com/docs/llms.txt` | Not on a page yet |
| `https://claude.com/docs/third-party/claude-desktop` | Not on a page yet |
| `https://claude.com/download#mobile` | Not on a page yet |
| `https://claude.com/enterprise` | Not on a page yet |
| `https://claude.fedstart.com` | Not on a page yet |
| `https://code.claude.com/docs/en` | Not on a page yet |
| `https://code.claude.com/docs/en/auto-mode-classifier-billing` | Not on a page yet |
| `https://code.claude.com/docs/en/changelog` | Not on a page yet |
| `https://code.claude.com/docs/en/chrome` | Not on a page yet |
| `https://code.claude.com/docs/en/claude-code-on-the-web` | Not on a page yet |
| `https://code.claude.com/docs/en/claude_code_docs_map.md` | Not on a page yet |
| `https://code.claude.com/docs/en/costs` | Not on a page yet |
| `https://code.claude.com/docs/en/data-usage#session-quality-surveys` | Not on a page yet |
| `https://code.claude.com/docs/en/fast-mode` | Not on a page yet |
| `https://code.claude.com/docs/en/gitlab-ci-cd` | Not on a page yet |
| `https://code.claude.com/docs/en/hooks` | Not on a page yet |
| `https://code.claude.com/docs/en/keybindings` | Not on a page yet |
| `https://code.claude.com/docs/en/mcp` | Not on a page yet |
| `https://code.claude.com/docs/en/memory` | Not on a page yet |
| `https://code.claude.com/docs/en/microsoft-foundry` | Not on a page yet |
| `https://code.claude.com/docs/en/model-config` | Not on a page yet |
| `https://code.claude.com/docs/en/overview` | Not on a page yet |
| `https://code.claude.com/docs/en/permission-modes` | Not on a page yet |
| `https://code.claude.com/docs/en/sandboxing` | Not on a page yet |
| `https://code.claude.com/docs/en/sandboxing#configure-sandboxing` | Not on a page yet |
| `https://code.claude.com/docs/en/security` | Not on a page yet |
| `https://code.claude.com/docs/en/sub-agents` | Not on a page yet |
| `https://code.claude.com/docs/s/claude-code-auto-mode` | Not on a page yet |
| `https://downloads.claude.ai/claude-code-releases` | Not on a page yet |
| `https://downloads.claude.ai/claude-code-releases/plugins/claude-plugins-official` | Not on a page yet |
| `https://downloads.claude.ai/model-catalog/v1/catalog.json` | Not on a page yet |
| `https://downloads.claude.ai/model-catalog/v1/schema.json` | Not on a page yet |
| `https://mcp-proxy.anthropic.com` | Not on a page yet |
| `https://microsoft365.mcp.claude.com/mcp` | Not on a page yet |
| `https://platform.claude.com/buy_credits?returnUrl=/oauth/code/success%3Fapp%3Dclaude-code` | Not on a page yet |
| `https://platform.claude.com/llms.txt` | Not on a page yet |
| `https://platform.claude.com/oauth/authorize` | Not on a page yet |
| `https://platform.claude.com/oauth/code/callback` | Not on a page yet |
| `https://platform.claude.com/oauth/code/success?app=claude-code` | Not on a page yet |
| `https://platform.claude.com/v1/oauth/token` | Not on a page yet |
| `https://status.claude.com` | Not on a page yet |
| `https://support.claude.com/en/articles/12429409` | Not on a page yet |
| `https://support.claude.com/en/articles/12429409-extra-usage-for-paid-claude-plans` | Not on a page yet |
| `https://support.claude.com/en/articles/12875061-claude-code-guest-passes` | Not on a page yet |
| `https://support.claude.com/en/articles/13456702-claude-code-guest-passes` | Not on a page yet |
| `https://support.claude.com/en/articles/14604842-real-time-cyber-safeguards-on-claude` | Not on a page yet |
| `https://support.claude.com/en/articles/15363606` | Not on a page yet |
| `https://support.claude.com/en/articles/16049681` | Not on a page yet |
| `https://support.claude.com/en/articles/17152539` | Not on a page yet |
| `https://support.claude.com/en/articles/17440474` | Not on a page yet |
| `https://support.claude.com/en/articles/8106465` | Not on a page yet |
| `https://www.anthropic.com/legal/consumer-terms` | Not on a page yet |
| `https://www.anthropic.com/legal/promotion-terms` | Not on a page yet |
| `https://www.anthropic.com/news/` | Not on a page yet |
| `https://www.anthropic.com/news/updates-to-our-consumer-terms` | Not on a page yet |

## Environment Variables

Items: 1846.

| Item | Where |
| --- | --- |
| `ACTIONS_ID_TOKEN_REQUEST_TOKEN` | Not on a page yet |
| `ACTIONS_ID_TOKEN_REQUEST_URL` | Not on a page yet |
| `ACTIONS_RUNTIME_TOKEN` | Not on a page yet |
| `ACTIONS_RUNTIME_URL` | Not on a page yet |
| `AGENT_PROXY_AUTH_TOKEN` | Not on a page yet |
| `AGENT_PROXY_URL` | Not on a page yet |
| `AI_AGENT` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `ALACRITTY_LOG` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `ALACRITTY_WINDOW_ID` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `ALLOW_ANT_COMPUTER_USE_MCP` | Not on a page yet |
| `ALLUSERSPROFILE` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `ALL_INPUTS` | Not on a page yet |
| `ALL_PROXY` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `ANACONDA_API_TOKEN` | Not on a page yet |
| `ANDROID_HOME` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `ANDROID_SDK_ROOT` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `ANSIBLE_CONFIG` | Not on a page yet |
| `ANSIBLE_VAULT_IDENTITY_LIST` | Not on a page yet |
| `ANSIBLE_VAULT_PASSWORD_FILE` | Not on a page yet |
| `ANTHROPIC_API_KEY` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `ANTHROPIC_AUTH_TOKEN` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `ANTHROPIC_AWS_API_KEY` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `ANTHROPIC_AWS_BASE_URL` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `ANTHROPIC_AWS_WORKSPACE_ID` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `ANTHROPIC_BASE_URL` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `ANTHROPIC_BEDROCK_BASE_URL` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `ANTHROPIC_BEDROCK_MANTLE_BASE_URL` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `ANTHROPIC_BEDROCK_REGION_PREFIX` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `ANTHROPIC_BEDROCK_SERVICE_TIER` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `ANTHROPIC_BETAS` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_CONFIG_DIR` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `ANTHROPIC_CUSTOM_HEADERS` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `ANTHROPIC_CUSTOM_MODEL_OPTION` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_CUSTOM_MODEL_OPTION_DESCRIPTION` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_CUSTOM_MODEL_OPTION_NAME` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_CUSTOM_MODEL_OPTION_SUPPORTED_CAPABILITIES` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_DEFAULT_FABLE_MODEL` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_DEFAULT_FABLE_MODEL_DESCRIPTION` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_DEFAULT_FABLE_MODEL_NAME` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_DEFAULT_FABLE_MODEL_SUPPORTED_CAPABILITIES` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL_DESCRIPTION` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL_NAME` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL_SUPPORTED_CAPABILITIES` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_DEFAULT_MODEL` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_DEFAULT_OPUS_MODEL_DESCRIPTION` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_DEFAULT_OPUS_MODEL_NAME` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_DEFAULT_OPUS_MODEL_SUPPORTED_CAPABILITIES` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | [Environment Variables](../configure/env-vars/index.md) |
| `ANTHROPIC_DEFAULT_SONNET_MODEL_DESCRIPTION` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_DEFAULT_SONNET_MODEL_NAME` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_DEFAULT_SONNET_MODEL_SUPPORTED_CAPABILITIES` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_ENVIRONMENT_ID` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `ANTHROPIC_ENVIRONMENT_KEY` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `ANTHROPIC_FEDERATION_RULE_ID` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `ANTHROPIC_FOUNDRY_API_KEY` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `ANTHROPIC_FOUNDRY_AUTH_TOKEN` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `ANTHROPIC_FOUNDRY_BASE_URL` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `ANTHROPIC_FOUNDRY_RESOURCE` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `ANTHROPIC_GOOGLE_CLOUD_BASE_URL` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `ANTHROPIC_GOOGLE_CLOUD_LOCATION` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `ANTHROPIC_GOOGLE_CLOUD_PROJECT` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `ANTHROPIC_GOOGLE_CLOUD_WORKSPACE_ID` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `ANTHROPIC_IDENTITY_TOKEN` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `ANTHROPIC_IDENTITY_TOKEN_FILE` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `ANTHROPIC_LOG` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `ANTHROPIC_MODEL` | [Environment Variables](../configure/env-vars/index.md) |
| `ANTHROPIC_ORGANIZATION_ID` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `ANTHROPIC_PROFILE` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `ANTHROPIC_SCOPE` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `ANTHROPIC_SERVICE_ACCOUNT_ID` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `ANTHROPIC_SESSION_ID` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `ANTHROPIC_SMALL_FAST_MODEL` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `ANTHROPIC_UNIX_SOCKET` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `ANTHROPIC_VERTEX_BASE_URL` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `ANTHROPIC_VERTEX_PROJECT_ID` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `ANTHROPIC_WEBHOOK_SIGNING_KEY` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `ANTHROPIC_WORKSPACE_ID` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `ANTHROPIC_WORK_ID` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `ANTHROPIC_WORK_SECRET` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `ANT_ARGS` | Not on a page yet |
| `ANT_CLAUDE_CODE_METRICS_ENDPOINT` | Not on a page yet |
| `ANT_OPTS` | Not on a page yet |
| `ANT_OTEL_EXPORTER_OTLP_ENDPOINT` | Not on a page yet |
| `ANT_OTEL_EXPORTER_OTLP_HEADERS` | Not on a page yet |
| `ANT_OTEL_EXPORTER_OTLP_PROTOCOL` | Not on a page yet |
| `ANT_OTEL_LOGS_EXPORTER` | Not on a page yet |
| `ANT_OTEL_METRICS_EXPORTER` | Not on a page yet |
| `ANT_OTEL_RESOURCE_ATTRIBUTES` | Not on a page yet |
| `ANT_OTEL_TRACES_EXPORTER` | Not on a page yet |
| `API_FORCE_IDLE_TIMEOUT` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `API_TIMEOUT_MS` | [Environment Variables](../configure/env-vars/index.md) |
| `APPDATA` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `APP_URL` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `ARGV0` | Not on a page yet |
| `ARTIFACTS_CREDENTIALPROVIDER_ACCESSTOKEN` | Not on a page yet |
| `ARTIFACTS_CREDENTIALPROVIDER_EXTERNAL_FEED_ENDPOINTS` | Not on a page yet |
| `AUTOMODE_DECISION_LOG` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `AWS_ACCESS_KEY_ID` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `AWS_ACCOUNT_ID` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AWS_BEARER_TOKEN_BEDROCK` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `AWS_CA_BUNDLE` | Not on a page yet |
| `AWS_CONFIG_FILE` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `AWS_CONTAINER_AUTHORIZATION_TOKEN` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AWS_CONTAINER_CREDENTIALS_FULL_URI` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `AWS_CONTAINER_CREDENTIALS_RELATIVE_URI` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `AWS_CREDENTIAL_EXPIRATION` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AWS_CREDENTIAL_SCOPE` | Not on a page yet |
| `AWS_DEFAULT_REGION` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `AWS_EC2_METADATA_DISABLED` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AWS_EC2_METADATA_SERVICE_ENDPOINT` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AWS_ENDPOINT_URL` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `AWS_ENDPOINT_URL_BEDROCK` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `AWS_ENDPOINT_URL_BEDROCK_RUNTIME` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `AWS_ENDPOINT_URL_SSO` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AWS_ENDPOINT_URL_SSO_OIDC` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AWS_ENDPOINT_URL_STS` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `AWS_EXECUTION_ENV` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `AWS_LAMBDA_BENCHMARK_MODE` | Not on a page yet |
| `AWS_LAMBDA_FUNCTION_NAME` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `AWS_LAMBDA_MAX_CONCURRENCY` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AWS_LAMBDA_NODEJS_NO_GLOBAL_AWSLAMBDA` | Not on a page yet |
| `AWS_LOGIN_CACHE_DIRECTORY` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AWS_PROFILE` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `AWS_REGION` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `AWS_ROLE_ARN` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `AWS_ROLE_SESSION_NAME` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AWS_SECRET_ACCESS_KEY` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `AWS_SESSION_TOKEN` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `AWS_SHARED_CREDENTIALS_FILE` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `AWS_USE_FIPS_ENDPOINT` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `AWS_WEB_IDENTITY_TOKEN_FILE` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `AZURE_ADDITIONALLY_ALLOWED_TENANTS` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AZURE_AUTHORITY_HOST` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AZURE_AUTH_LOCATION` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `AZURE_CLIENT_CERTIFICATE_PASSWORD` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AZURE_CLIENT_CERTIFICATE_PATH` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AZURE_CLIENT_ID` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AZURE_CLIENT_SECRET` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AZURE_CLIENT_SEND_CERTIFICATE_CHAIN` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AZURE_CONFIG_DIR` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `AZURE_FEDERATED_TOKEN_FILE` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AZURE_FUNCTIONS_ENVIRONMENT` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `AZURE_IDENTITY_DISABLE_MULTITENANTAUTH` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AZURE_PASSWORD` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AZURE_POD_IDENTITY_AUTHORITY_HOST` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AZURE_REGIONAL_AUTHORITY_NAME` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AZURE_TENANT_ID` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AZURE_TOKEN_CREDENTIALS` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `AZURE_USERNAME` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `BASH_ALIASES` | Not on a page yet |
| `BASH_CMDS` | Not on a page yet |
| `BASH_DEFAULT_TIMEOUT_MS` | [Environment Variables](../configure/env-vars/index.md) |
| `BASH_ENV` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `BASH_MAX_OUTPUT_LENGTH` | [Environment Variables](../configure/env-vars/index.md) |
| `BASH_MAX_TIMEOUT_MS` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `BASH_VERSION` | Not on a page yet |
| `BAT_THEME` | Not on a page yet |
| `BETA_TRACING_ENDPOINT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `BINSTAR_API_TOKEN` | Not on a page yet |
| `BLOCK_SIZE` | Not on a page yet |
| `BOTO_CONFIG` | Not on a page yet |
| `BOTO_PATH` | Not on a page yet |
| `BROWSER` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `BUF_BIGINT_DISABLE` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `BUGHUNTER_DEV_BUNDLE_B64` | Not on a page yet |
| `BUGHUNTER_FLEET_SIZE` | Not on a page yet |
| `BUILDKITE` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `BUNDLE_APP_CONFIG` | Not on a page yet |
| `BUNDLE_CONFIG` | Not on a page yet |
| `BUNDLE_USER_CONFIG` | Not on a page yet |
| `BUNDLE_USER_HOME` | Not on a page yet |
| `BUN_CHROME_PATH` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `BUN_CONFIG_FILE` | Not on a page yet |
| `BUN_INSTALL` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `BUN_INSTALL_CACHE_DIR` | Not on a page yet |
| `BUN_OPTIONS` | Not on a page yet |
| `C9_PID` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `C9_USER` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `CARGO_HOME` | Not on a page yet |
| `CARGO_HTTP_CAINFO` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CARGO_REGISTRY_TOKEN` | Not on a page yet |
| `CCR_AGENT_PROXY_CA_CERT_B64` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_AGENT_PROXY_CA_WATCH_ENABLED` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_AGENT_PROXY_ENABLED` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_AGENT_PROXY_FRAME_HOSTS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_AGENT_PROXY_INCLUDE_HOSTS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_AGENT_PROXY_NO_PROXY_LOCAL_ONLY` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_AGENT_PROXY_RECEIVE_GATE_DISABLED` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_AGENT_PROXY_RELAY_MODE` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_AGENT_PROXY_STANDALONE_URL` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_AGENT_PROXY_TOKEN_FILE_DESCRIPTOR` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_AGENT_PROXY_UPLOAD_GATE_DISABLED` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_DELTA_RESET` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_EGRESS_GATEWAY_ENABLED` | Not on a page yet |
| `CCR_ENABLE_BUNDLE` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_FORCE_BUNDLE` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_ON_BRANCH_DEFAULT_GUARD` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_PREFETCH_NETWORK` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_PREWARM_STAT` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_PREWARM_VDA` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_RUNNER_STARTUP_TIMING` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CCR_SESSION_ACCOUNT_EMAIL` | Not on a page yet |
| `CCR_SESSION_PROFILE` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_SHR_SSE_HINTS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CCR_SPAWN_TIMESTAMP_MS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CCR_UPSTREAM_PROXY_ENABLED` | Not on a page yet |
| `CDPATH` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `CF_PAGES` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `CGO_ENABLED` | Not on a page yet |
| `CHOKIDAR_INTERVAL` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `CHOKIDAR_USEPOLLING` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `CHROME_DEVEL_SANDBOX` | Not on a page yet |
| `CI` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `CIRCLECI` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `CI_DEPLOY_USER` | Not on a page yet |
| `CI_REGISTRY_USER` | Not on a page yet |
| `CLAUBBIT` | Not on a page yet |
| `CLAUDECODE` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_AFK_COUNTDOWN_MS` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_AFK_TIMEOUT_MS` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_AFTER_LAST_COMPACT` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_AGENTS_AUTO_RELAUNCHED_AT` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_AGENTS_SELECT` | Not on a page yet |
| `CLAUDE_AGENT_SDK_CLIENT_APP` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_AGENT_SDK_DISABLE_MCP_MANIFESTS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_AGENT_SDK_MCP_NO_PREFIX` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_AGENT_SDK_VERSION` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_ARTIFACT_HOST_GRANT` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_ASYNC_AGENT_STALL_TIMEOUT_MS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_AUTO_BACKGROUND_TASKS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_AX_ANNOUNCEMENT_HOLD_MS` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_AX_PREPARK_MS` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_AX_REWRITE_HELD_ANNOUNCEMENT` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_AX_SCREEN_READER` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_AX_STARTUP_QUIET_MS` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_BG_AUTH_SNAPSHOT_PATH` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_BG_AUTO_MEMORY_OFF` | Not on a page yet |
| `CLAUDE_BG_BACKEND` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_BG_CARRIED_PROMPTS_SHA256` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_BG_CLAIM_AUTH` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_BG_DISPATCHER_RATE_LIMIT_TIER` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_BG_DISPATCHER_SUBSCRIPTION_TYPE` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_BG_GATEWAY_WITHHELD` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_BG_ISOLATION` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_BG_MEMORY_TOGGLED_OFF` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_BG_POST_CLEAR_RESPAWN` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_BG_PTY_AUTH` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_BG_RENDEZVOUS_SOCK` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_BG_RV_AUTH` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_BG_SESSION_PERMISSION_RULES` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_BG_SOCKET_TOKENS_PATH` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_BG_SOURCE` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_BG_STARTUP_WEDGE_MS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_BG_TCC_DISCLAIMED` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_BG_WORKSPACE_TRUSTED` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_BRIDGE_BASE_URL` | Not on a page yet |
| `CLAUDE_BRIDGE_OAUTH_TOKEN` | Not on a page yet |
| `CLAUDE_BRIDGE_REATTACH_GROUPING` | Not on a page yet |
| `CLAUDE_BRIDGE_REATTACH_NO_BACKFILL` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_BRIDGE_REATTACH_OUTBOUND_ONLY` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_BRIDGE_REATTACH_OWNER_ACCT` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_BRIDGE_REATTACH_OWNER_ORG` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_BRIDGE_REATTACH_SEQ` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_BRIDGE_REATTACH_SESSION` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_BRIDGE_SESSION_INGRESS_URL` | Not on a page yet |
| `CLAUDE_BYTE_STREAM_IDLE_TIMEOUT_MS` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CHROME_CLASSIFIER_FLOOR` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CHROME_PAIRED_DEVICE_ID` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CHROME_PERMISSION_MODE` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CHROME_TAB_GROUP_KEY` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CLIENT_PRESENCE_FILE` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_3P_PROBE_WROTE_HAIKU_DEFAULT` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_3P_PROBE_WROTE_OPUS_DEFAULT` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_3P_PROBE_WROTE_SONNET_DEFAULT` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_3P_SEEDED_OPUS_DEFAULT` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_3P_SEEDED_SONNET_DEFAULT` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_ACCESSIBILITY` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_ACCOUNT_TAGGED_ID` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_ACCOUNT_UUID` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_ACTION` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_ACT_DONT_REDERIVE` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_ADDITIONAL_PROTECTION` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_AGENT` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_AGENT_PROGRESS_SUMMARIES` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_AGENT_PROXY_GH_SHIM` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_AGENT_PROXY_GIT_CONFIG` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_AGENT_PROXY_GIT_HOSTS` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_AGENT_VIEW_RELAUNCH` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_ALLOW_OTHER_MODELS` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_ALTGR_AS_TEXT` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_ALT_SCREEN_FULL_REPAINT` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_ALWAYS_ENABLE_EFFORT` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_AMBER_ASTROLABE` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_API_BASE_URL` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_API_KEY_HELPER_TTL_MS` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_APPEND_PROMPT_HEAD` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_ARG_KEY_SHAPE` | Not on a page yet |
| `CLAUDE_CODE_ARTIFACT` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACTS_API_BASE_URL` | Not on a page yet |
| `CLAUDE_CODE_ARTIFACTS_API_TOKEN` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_ARTIFACT_ASSETS` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_ASSET_BASE_URL` | Not on a page yet |
| `CLAUDE_CODE_ARTIFACT_AUTO_OPEN` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_ARTIFACT_COMMENTS` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_COMMENTS_AUTOREACT` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_COMMENT_FAST_ACK` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_COMMENT_FAST_ACK_FIXED` | Not on a page yet |
| `CLAUDE_CODE_ARTIFACT_COMMENT_RESPONDER` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_DB` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_DB_STR_REPLACE` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_DELETE` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_FRESH_READ` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_HOT` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_INHERITED_TYPE_GRANT` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_LIVE_BASE_URL` | Not on a page yet |
| `CLAUDE_CODE_ARTIFACT_MCP` | Not on a page yet |
| `CLAUDE_CODE_ARTIFACT_MULTI_FILE` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_OPENING_PREFETCH` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_OPEN_ACTION` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_PATH_PIN` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_PIN` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_PRESENCE` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_PREVIEW` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_PREVIEW_EMULATOR` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_PUBLISH_EDITS` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_QUICKSTART` | Not on a page yet |
| `CLAUDE_CODE_ARTIFACT_REPL` | Not on a page yet |
| `CLAUDE_CODE_ARTIFACT_ROOM` | Not on a page yet |
| `CLAUDE_CODE_ARTIFACT_SHARE` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_SHARE_PROBE_REUSE_MS` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_START_KIT` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_SYNC_BASE_URL` | Not on a page yet |
| `CLAUDE_CODE_ARTIFACT_TOOLSET` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_TYPES` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_TYPE_CATALOG` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_TYPE_CLOUD_CREATE` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_VERIFY` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ARTIFACT_VERSIONS` | Not on a page yet |
| `CLAUDE_CODE_ARTIFACT_VIEWER_BASE_URL` | Not on a page yet |
| `CLAUDE_CODE_ATTACHMENTS_BY_PATH` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ATTACHMENTS_IN_USER_DATA` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_ATTRIBUTION_ANNOUNCEMENT` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_ATTRIBUTION_HEADER` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_ATTRIBUTION_PROJECT` | Not on a page yet |
| `CLAUDE_CODE_ATTRIBUTION_STATUS_TIMEOUT_MS` | Not on a page yet |
| `CLAUDE_CODE_AUTH_FAIL_EXIT_MS` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_AUTOUPDATER_DISABLED_BY_HOST` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_AUTO_BACKGROUND_TIMEOUT_MS` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_AUTO_COMPACT_WINDOW` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_AUTO_CONNECT_IDE` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_AUTO_MODE_ARTIFACT_CONSENT_RULE` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_AUTO_MODE_CLASSIFIER_OVERLAP` | Not on a page yet |
| `CLAUDE_CODE_AUTO_MODE_CLASSIFY_ASK_USER_QUESTION` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_AUTO_MODE_CLASSIFY_EDITS` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_AUTO_MODE_COMPACT_THREAD_RULE` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_AUTO_MODE_EDIT_REMOVAL` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_AUTO_MODE_EDIT_REMOVAL_CAP` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_AUTO_MODE_EMAIL_SENDER_REPLY_TURN` | Not on a page yet |
| `CLAUDE_CODE_AUTO_MODE_EMAIL_SENDER_TURN` | Not on a page yet |
| `CLAUDE_CODE_AUTO_MODE_EXTERNAL_PERMISSIONS` | Not on a page yet |
| `CLAUDE_CODE_AUTO_MODE_GIT_STATUS` | Not on a page yet |
| `CLAUDE_CODE_AUTO_MODE_GIT_STATUS_LIMIT` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_AUTO_MODE_GIT_STATUS_UPLOADS` | Not on a page yet |
| `CLAUDE_CODE_AUTO_MODE_HEARTH_MEMBER_RELAY_ROWS` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_AUTO_MODE_MODEL` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_AUTO_MODE_OUTCOME_CODES` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_AUTO_MODE_PRIOR_ASSISTANT_CONTEXT` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_AUTO_MODE_REMOTE_BROWSER` | Not on a page yet |
| `CLAUDE_CODE_AUTO_MODE_REPO_VISIBILITY` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_AUTO_MODE_SEGMENTED_TRANSCRIPT` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_AUTO_MODE_SERVER` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_AUTO_MODE_TEMPERATURE` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_AUTO_MODE_THREAD_ASK_HELD` | Not on a page yet |
| `CLAUDE_CODE_AUTO_MODE_TIER` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_AWS_CHAIN_RESOLVE_TIMEOUT_MS` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_BASALT_COVE` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_BASE_REF` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_BASE_REFS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_BASH_EDIT_DIFF` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_BASH_OUTPUT_AUDIENCE_NOTE` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_BASH_SANDBOX_SHOW_INDICATOR` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_BENCH_LIVE_COUNTS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_BG_CLASSIFIER_MODEL` | Not on a page yet |
| `CLAUDE_CODE_BG_TASKS_REPORT_RUNNING` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_BISON_CAIRN` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_BREEZY_HORIZON` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_BRIDGE_CHILD_ARTIFACT` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_BRIDGE_CHILD_AUTO_DEFAULT` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_BRIDGE_CHILD_MACHINE_SETTINGS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_BRIDGE_CHILD_PROJECTS_ENTRYPOINT` | Not on a page yet |
| `CLAUDE_CODE_BRIDGE_MCP_CARRIER` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_BRIDGE_OWNER_ACCOUNT_UUID` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_BRIDGE_OWNER_ORG_UUID` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_BRIDGE_PROMPT_SHA256` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_BRIDGE_SESSION_ID` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_BRIDGE_SOURCE_DIR` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_BRIEF` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_BRIEF_UPLOAD` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_BS_AS_CTRL_BACKSPACE` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_BUBBLEWRAP` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_BYOC_ENABLE_DATADOG` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_CALM_MOCHI` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_CCR_EARLY_HYDRATE_PREFETCH` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_CCR_EARLY_PLUGINS_SYNC` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_CCR_EARLY_REMOTE_CONNECT` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_CCR_EARLY_SKILLS_SYNC` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_CCR_EARLY_SYNC_AFTER_SETTINGS_REFUSAL` | Not on a page yet |
| `CLAUDE_CODE_CCR_EVENT_FLUSH_POLICY` | Not on a page yet |
| `CLAUDE_CODE_CCR_FOLD_FIRST_TURN_RESCAN` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_CCR_OWN_CONNECTION_POOL` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_CCR_SKIP_FRESH_MIGRATIONS` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_CCR_SURFACE` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_CCR_WORKER_SOCKET` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_CERT_STORE` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_CHILD_SESSION` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_CHROME_MCP_ORG_DENIED` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_CLASSIFIER_SUMMARY` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_CLIENT_CERT` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_CLIENT_DATA_URL` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_CLIENT_KEY` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_CLIENT_KEY_PASSPHRASE` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_CLOUD_SESSION_ID` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_COLD_COMPACT` | Not on a page yet |
| `CLAUDE_CODE_COMPILED_ACORN` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_CONFIG_PROBE` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `CLAUDE_CODE_CONFIG_WATCH_EVENTS` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_CONNECT_TIMEOUT_MS` | Not on a page yet |
| `CLAUDE_CODE_CONSENT_POINTERLESS` | Not on a page yet |
| `CLAUDE_CODE_CONTAINER_ID` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_COORDINATOR_EXTRA_TOOLS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_COORDINATOR_FORCE_WORKER_INHERIT_MODEL` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_COORDINATOR_MODE` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_COORDINATOR_PROPAGATE_NESTED_MEMORY` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_COORDINATOR_SKILL_GUIDANCE` | Not on a page yet |
| `CLAUDE_CODE_COWORK_FRAME_ARTIFACTS` | Not on a page yet |
| `CLAUDE_CODE_COZY_TEAPOT` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_CURRIED_TRINKET` | Not on a page yet |
| `CLAUDE_CODE_CUSTOM_OAUTH_URL` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_DAEMON_COLD_START` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_DAPPER_CUPCAKE` | Not on a page yet |
| `CLAUDE_CODE_DATADOG_FLUSH_INTERVAL_MS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_DD_ERROR_TRACKING_FLUSH_INTERVAL_MS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_DEBUG_LOGS_DIR` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_DEBUG_LOG_LEVEL` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_DEBUG_REPAINTS` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_DECSTBM` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_DESIGN_OAUTH_CLIENT_ID` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_DESKTOP_APP_VERSION` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_DESKTOP_SKILLS_PLUGIN_DIR` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_DESKTOP_SKILL_SWITCHES` | Not on a page yet |
| `CLAUDE_CODE_DEV_RAW_CHANGELOG_URL` | Not on a page yet |
| `CLAUDE_CODE_DIAGNOSTICS_FILE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_DIFF_COPY_ROOT` | Not on a page yet |
| `CLAUDE_CODE_DISABLE_1M_CONTEXT` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_DISABLE_ADMIN_ENV_UNION` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_DISABLE_ADVISOR_TOOL` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_DISABLE_AGENT_VIEW` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_DISABLE_ARTIFACT` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_DISABLE_ATTACHMENTS` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_DISABLE_ATTRIBUTION_BASELINE_REUSE` | Not on a page yet |
| `CLAUDE_CODE_DISABLE_ATTRIBUTION_CROSS_REPO` | Not on a page yet |
| `CLAUDE_CODE_DISABLE_AUTH_REFRESH_LOCK` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_DISABLE_AWAITING_USER_IDLE` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_DISABLE_BEDROCK_CONTENT_TYPE_DEFAULT` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_DISABLE_BEDROCK_CONTENT_TYPE_GUARD` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_DISABLE_BG_EXIT_HANDOFF` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_DISABLE_BG_STABLE_PATH` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_DISABLE_BUNDLED_SKILLS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_DISABLE_CFC_PROMPT` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_DISABLE_CLAUDE_API_SKILL` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_DISABLE_CLAUDE_CODE_SKILL` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_DISABLE_CLAUDE_MDS` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_DISABLE_CRON` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_DISABLE_DANGEROUS_RM_TIMEOUT` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_DISABLE_EXPLORE_INHERIT_CAP` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_DISABLE_FAST_MODE` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_DISABLE_FILE_MENTIONS` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_DISABLE_HOOK_FORWARDING` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_DISABLE_INLINE_SHELL_RM_PROMPT` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_DISABLE_LAUNCHER_SIGN_IN` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_DISABLE_LAUNCH_COMPOSER` | Not on a page yet |
| `CLAUDE_CODE_DISABLE_LEGACY_MODEL_REMAP` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_DISABLE_MCP_TASK_BACKGROUND` | Not on a page yet |
| `CLAUDE_CODE_DISABLE_MEMORY_BULK_INFLATE` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_DISABLE_MEMORY_MASS_DELETE_HOLD` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_DISABLE_MEMORY_PERIODIC_RESYNC` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_DISABLE_MEMORY_RO_UNSAVED_NOTICE` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_DISABLE_MEMORY_STREAM_LIST` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_DISABLE_MODEL_ACCESS_FALLBACK` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_DISABLE_MOUNTED_DRIVE_RM_PROMPT` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_DISABLE_MOUSE` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_DISABLE_MOUSE_CLICKS` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_DISABLE_MTLS_RELOAD_ON_STALE_CONNECTION` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_DISABLE_NESTED_CHAIN_IDLE` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_DISABLE_NESTED_USER_REPAIR` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_DISABLE_NONSTREAMING_FALLBACK` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_DISABLE_NOTIFICATION_PRESENCE_CHECK` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_DISABLE_OFFICIAL_MARKETPLACE_AUTOINSTALL` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_DISABLE_ORG_MEMORY` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_DISABLE_PERMISSION_PROMPT_NOTIFY_HOOKS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_DISABLE_PLUGIN_FORWARDING` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_DISABLE_POLICY_SKILLS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_DISABLE_POWERSHELL_CMD_RM_DENY` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_DISABLE_PRECOMPACT_SKIP` | Not on a page yet |
| `CLAUDE_CODE_DISABLE_PROACTIVITY` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_DISABLE_REFUSAL_FALLBACK` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_DISABLE_REFUSAL_RETRY` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_DISABLE_STARTUP_WORK_GATE` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_DISABLE_STRUCTURED_OUTPUTS` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_DISABLE_SUBSTITUTION_RM_PROMPT` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_DISABLE_TERMINAL_TITLE` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_DISABLE_THINKING` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_DISABLE_TURN_HANDOFF` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_DISABLE_ULTRAREVIEW_TRUST_CHECK` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_DISABLE_VIRTUAL_SCROLL` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_DISABLE_VITALS_EMITTER` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_DISABLE_WEB_FETCH` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_DISABLE_WINDOWS_SHELL_LAUNCHER` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_DISABLE_WORKFLOWS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_DISABLE_WORKING_SYNC` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_DISPATCH_V2D` | Not on a page yet |
| `CLAUDE_CODE_DISPATCH_V2S` | Not on a page yet |
| `CLAUDE_CODE_DONT_INHERIT_ENV` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_DOWNLOAD_DEADLINE_MS_FOR_TESTING` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_EAGER_FLUSH` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_EDITOR_CODELIVERY` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `CLAUDE_CODE_EFFORT_LEVEL` | [Environment Variables](../configure/env-vars/index.md) |
| `CLAUDE_CODE_ELEGANT_MEADOW` | Not on a page yet |
| `CLAUDE_CODE_EMIT_SESSION_STATE_EVENTS` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `CLAUDE_CODE_EMIT_STARTUP_TIMING` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_EMIT_TOOL_USE_SUMMARIES` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_ENABLE_APPEND_SUBAGENT_PROMPT` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_ENABLE_AUTO_MODE` | Not on a page yet |
| `CLAUDE_CODE_ENABLE_AWAY_SUMMARY` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_ENABLE_BACKGROUND_PLUGIN_REFRESH` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_ENABLE_CFC` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_ENABLE_DESIGN_SYNC` | Not on a page yet |
| `CLAUDE_CODE_ENABLE_EXPERIMENTAL_ADVISOR_TOOL` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` | Not on a page yet |
| `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_ENABLE_LAUNCH_COMPOSER` | Not on a page yet |
| `CLAUDE_CODE_ENABLE_MENU_KIND_LANES` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_ENABLE_OPUS_4_7_FAST_MODE` | Not on a page yet |
| `CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_ENABLE_PROXY_AUTH_HELPER` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_ENABLE_REFRESH_MCP_TOOLS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_ENABLE_REMOTE_RECAP` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_ENABLE_SHARE_BUNDLE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_ENABLE_TASKS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_ENABLE_TELEMETRY` | [Environment Variables](../configure/env-vars/index.md) |
| `CLAUDE_CODE_ENABLE_TODO_TOOLS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_ENABLE_XAA` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_ENHANCED_TELEMETRY_BETA` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_ENTRYPOINT` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_ENTRYPOINT_ON_REQUESTS` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `CLAUDE_CODE_ENVIRONMENT_KIND` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_ENVIRONMENT_RUNNER_VERSION` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_EVAL_ALLOW_ARTIFACT_PUBLISH` | Not on a page yet |
| `CLAUDE_CODE_EVAL_ALLOW_FLAG_OVERRIDES` | Not on a page yet |
| `CLAUDE_CODE_EVAL_ARTIFACT_STUB_DIR` | Not on a page yet |
| `CLAUDE_CODE_EVAL_CONFINED` | Not on a page yet |
| `CLAUDE_CODE_EVAL_INTERVIEW_SESSION` | Not on a page yet |
| `CLAUDE_CODE_EXECPATH` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_EXIT_AFTER_FIRST_RENDER` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_EXIT_AFTER_STOP_DELAY` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_EXPERIMENTAL_OBSERVER_AGENTS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_EXTRA_BODY` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_EXTRA_METADATA` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_FEDERATION_CACHE_DIR` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_FILE_READ_MAX_PDF_PAGES_PER_MESSAGE` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_FILE_READ_MAX_PDF_PAGES_PER_TURN` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_FLAG_FETCH_WAIT_MS` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_FLEETVIEW_SIMPLE` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_FLEET_PAST_SESSIONS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_FOOTER_INDICATOR` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_FORCE_BRIDGE` | Not on a page yet |
| `CLAUDE_CODE_FORCE_EVALUATE_MEMORY` | Not on a page yet |
| `CLAUDE_CODE_FORCE_FIRST_LAUNCH` | Not on a page yet |
| `CLAUDE_CODE_FORCE_FULLSCREEN_UPSELL` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_FORCE_MEMORY_SURVEY` | Not on a page yet |
| `CLAUDE_CODE_FORCE_MID_CONVERSATION_SYSTEM` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_FORCE_RC_LONG_TURN_NUDGE` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_FORCE_SESSION_PERSISTENCE` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_FORCE_STRIKETHROUGH` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_FORCE_SYNC_OUTPUT` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_FORCE_TERMINAL_IMAGES` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_FORCE_TIP_ID` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_FORCE_WINDOWS_CREDMAN` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_FORK_SUBAGENT` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_FORWARD_SUBAGENT_TEXT` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_FORWARD_USER_INTENT` | Not on a page yet |
| `CLAUDE_CODE_FOUND_REPOSITORY_GIT` | Not on a page yet |
| `CLAUDE_CODE_FRAME_TIMING_LOG` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_FRAME_TIMING_SAMPLE_EVERY` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_GATEWAY_HINT_HEADERS` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_GATEWAY_MODEL_DISCOVERY_TIMEOUT_MS` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_GATEWAY_TOKEN` | Not on a page yet |
| `CLAUDE_CODE_GATEWAY_TOKEN_FILE_DESCRIPTOR` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_GB_BASE_URL` | Not on a page yet |
| `CLAUDE_CODE_GB_DISK_CACHE_WHEN_TELEMETRY_OFF` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_GB_REFRESH_INTERVAL_MS` | Not on a page yet |
| `CLAUDE_CODE_GENTLE_PARASOL` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `CLAUDE_CODE_GIT_BASH_PATH` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_GLOB_HIDDEN` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_GLOB_NO_IGNORE` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_GLOB_TIMEOUT_SECONDS` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_GOAL_CHECKIN_MINUTES` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_GORSE_PLOVER` | Not on a page yet |
| `CLAUDE_CODE_GROWTHBOOK_KICK_FROM_INIT` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_GROWTHBOOK_KICK_ON_WARM_CACHE` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_GZIP_CCR_REQUEST_BODIES` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_GZIP_DATADOG_LOGS` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_GZIP_REQUEST_BODIES` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_GZIP_REQUEST_BODY_BLOCKS` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_GZIP_REQUEST_BODY_LEVEL` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_HANDBACK_PROVENANCE` | Not on a page yet |
| `CLAUDE_CODE_HARBOR_KITE` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_HARBOR_KITE_CLOUD` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_HARBOR_KITE_PACING_OFF` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_HARMONIC_RIDDLE` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_HFI_BEARER_TOKEN` | Not on a page yet |
| `CLAUDE_CODE_HIDE_CWD` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_HIDE_REPLY_SERVER_NAME` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_HIDE_SETTINGS_HINT` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_HOLD_REPORT_PARK_AT_INIT` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_HOME_SEED_HOLD_TIMEOUT_MS` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_HOME_SEED_VERDICT_TIMEOUT_MS` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_HOOKS_SAME_THREAD` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_HOSTED_DESKTOP` | Not on a page yet |
| `CLAUDE_CODE_HOST_AUTH_ENV_VAR` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_HOST_AUTH_REFRESH_TIMEOUT_MS` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_HOST_CREDS_FILE` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_HOST_GATEWAY_LINEAGE` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_HOST_HTTP_PROXY_PORT` | Not on a page yet |
| `CLAUDE_CODE_HOST_PLATFORM` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_HOST_PROMPT_SUPERSEDES_RECORD` | Not on a page yet |
| `CLAUDE_CODE_HOST_SCHEDULED_RUN` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_HOST_SESSION_ID` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_HOST_SKILL_CATALOG` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_HOST_SOCKS_PROXY_PORT` | Not on a page yet |
| `CLAUDE_CODE_HOST_WORKTREE` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_HOST_WORKTREE_FENCE` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_HOVER_REST` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_HTTPS_PROXY` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_HTTP_PROXY` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_HUMBLE_HAMMOCK` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `CLAUDE_CODE_IDE_HOST_OVERRIDE` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_IDE_SKIP_VALID_CHECK` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_IDLE_THRESHOLD_MINUTES` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_IDLE_TOKEN_THRESHOLD` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_IGNORE_PERSISTED_TRUST` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_INCLUDE_PARTIAL_MESSAGES` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_INLINE_TOOLS` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_INSTALLED_VIA_NPM_WRAPPER` | Not on a page yet |
| `CLAUDE_CODE_INVOKED_SKILLS` | Not on a page yet |
| `CLAUDE_CODE_IS_COWORK` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_JIT_POLICY_AFTER_STARTUP` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `CLAUDE_CODE_JUNIPER_SUNDIAL` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_KB_COHESION_FIXES` | Not on a page yet |
| `CLAUDE_CODE_LANTERN_PRISM` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_LARCH_CISTERN` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `CLAUDE_CODE_LAZY_ENV_GETTERS` | Not on a page yet |
| `CLAUDE_CODE_LEGACY_BUNDLE` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_LOOP_KEEPALIVE` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_LOOP_PERSISTENT` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_MANAGED_CONFIG_PREFETCH` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_MANAGED_SETTINGS_PATH` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_MARKETPLACE_NAME` | Not on a page yet |
| `CLAUDE_CODE_MARKETPLACE_URL` | Not on a page yet |
| `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_MAX_CONTEXT_TOKENS` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_MAX_EFFORT_REMINDER` | Not on a page yet |
| `CLAUDE_CODE_MAX_MCP_DESCRIPTION_LENGTH` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | [Environment Variables](../configure/env-vars/index.md) |
| `CLAUDE_CODE_MAX_RETRIES` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION` | Not on a page yet |
| `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_MAX_TURNS` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_MCP_ALLOWLIST_ENV` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_MCP_ALWAYS_LOAD_JOIN_BEFORE_INPUT` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_MCP_APPS_HOST` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_MCP_CONNECTOR_PREWAIT_MS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_MCP_MEMORY_CGROUP` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_MCP_PREWAIT_SERVERS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_MCP_PREWAIT_SERVERS_MS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_MCP_SERVER_NAME` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_MCP_SERVER_URL` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_MCP_SERVE_AUTH_TOKEN` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_MCP_SERVE_ENABLED_PLUGINS` | Not on a page yet |
| `CLAUDE_CODE_MCP_SERVE_INTERFACE_MIN_VERSION` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_MCP_SERVE_SETTINGS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_MCP_SERVE_TOOL_OUTPUT` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_MCP_SERVE_WORKSPACE_ROOT` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_MCP_STARTUP_WAIT_MS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_MEMORY_API_BASE_URL` | Not on a page yet |
| `CLAUDE_CODE_MEMORY_API_TOKEN` | Not on a page yet |
| `CLAUDE_CODE_MEMORY_PUSH_DELETE_MODE` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_MEMORY_SUBAGENT_APPEND` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_MESSAGES_PROMPT_CACHE_TTL` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_MESSAGING_SOCKET` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_MESSAGING_TOKEN` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_MOCK_REMOTE_SETTINGS` | Not on a page yet |
| `CLAUDE_CODE_MOCK_TRIAL` | Not on a page yet |
| `CLAUDE_CODE_MODEL_CAPABILITIES` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_MODEL_CATALOG` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_MODEL_CATALOG_URL` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_NANKEEN_KESTREL` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_NATIVE_CURSOR` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_NEW_INIT` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_NONBLOCKING_STDOUT` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_NONSTREAMING_TIMEOUT_RETRIES` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_NO_FLICKER` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_NO_MODEL_FALLBACK` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_OAUTH_401_WAIT_MS` | Not on a page yet |
| `CLAUDE_CODE_OAUTH_CLIENT_ID` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_OAUTH_REFRESH_TOKEN` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_OAUTH_SCOPES` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_OAUTH_TOKEN` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` | Not on a page yet |
| `CLAUDE_CODE_ORGANIZATION_UUID` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_OTEL_DIAG_STDERR` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_OTEL_FLUSH_TIMEOUT_MS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_OTEL_HEADERS_HELPER_DEBOUNCE_MS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_OVERLOADED_RETRY_BASE_DELAY_MS` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_OVERLOADED_RETRY_MAX_DELAY_MS` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_OVERRIDE_DATE` | Not on a page yet |
| `CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_PARKED_PERMISSION_WAIT_MS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_PARKED_RUN_BEFORE_CLEAR` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_PARKED_STOP_RETIRES` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_PARSED_WILLOW` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_PERFETTO_TRACE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_PERFETTO_WRITE_INTERVAL_S` | Not on a page yet |
| `CLAUDE_CODE_PERFORCE_MODE` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_PERSONAL_CONFIG_FIX` | Not on a page yet |
| `CLAUDE_CODE_PER_TURN_TIMING` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_PEWTER_OWL` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_PEWTER_OWL_TOOL` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_PLAN_MODE_REQUIRED` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_PLAN_V2_AGENT_COUNT` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_PLUGIN_ARCHIVE_URL` | Not on a page yet |
| `CLAUDE_CODE_PLUGIN_ATTRIBUTION` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_PLUGIN_BINARY_ASSETS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_PLUGIN_CACHE_DIR` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_PLUGIN_DIRS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_PLUGIN_DIR_WATCH` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_PLUGIN_NAME` | Not on a page yet |
| `CLAUDE_CODE_PLUGIN_PREFER_HTTPS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_PLUGIN_SEED_DIR` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_PLUGIN_USE_ZIP_CACHE` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_POLICY_HELPER_PS1_PATH` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_POLICY_HELPER_PSMODULEPATH` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_POLISHED_DEWDROP` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_POLL_EVENTS` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `CLAUDE_CODE_POLL_EVENT_DECLARATIONS` | Not on a page yet |
| `CLAUDE_CODE_POST_TURN_MEMORY` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_POST_TURN_MEMORY_CONFIG` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_POST_TURN_MEMORY_SYNC` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_POWERSHELL_RESPECT_EXECUTION_POLICY` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_POWERUP_ONBOARDING` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_PROACTIVE` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_PROCESS_WRAPPER` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_PROFILE_QUERY` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_PROFILE_STARTUP` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_PROJECTS_SESSION` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_PROJECT_DIR_NAME` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_PROMPT_CACHE_TTL` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_PROPAGATE_TRACEPARENT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_PROXY_AUTHENTICATE` | Not on a page yet |
| `CLAUDE_CODE_PROXY_AUTH_HELPER_TTL_MS` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_PROXY_HOST` | Not on a page yet |
| `CLAUDE_CODE_PROXY_RESOLVES_HOSTS` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_PROXY_URL` | Not on a page yet |
| `CLAUDE_CODE_PWSH_PARSE_TIMEOUT_MS` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_QUESTION_EXTENDED` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_QUESTION_OPTIONAL_DESCRIPTIONS` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_QUESTION_PREVIEW_FORMAT` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_RATE_LIMIT_TIER` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_RC_PERMISSION_NUDGE` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_REFUSAL_FALLBACK_CATCH_ALL` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_RELAUNCH_HOME_TRUST` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_RELAUNCH_PROACTIVITY_BASELINE` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_RELAUNCH_PROACTIVITY_DECIDED` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_RELAUNCH_PROACTIVITY_EVER_ON` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_RELAUNCH_PROACTIVITY_LEVEL` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_RELAUNCH_TERMINAL_SIZE` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_REMOTE` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_REMOTE_HERMETIC_MODE` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_REMOTE_MCP_CONFIG` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_REMOTE_MEMORY_DIR` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_REMOTE_RAW_EVENTS_FILE` | Not on a page yet |
| `CLAUDE_CODE_REMOTE_SDK_URL` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_REMOTE_SEND_KEEPALIVES` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_REMOTE_SESSION_ID` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_REMOTE_SESSION_ORIGIN` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_REMOTE_SESSION_UUID` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_REMOTE_SETTINGS_PATH` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_REMOTE_SETTINGS_POLL_MS` | Not on a page yet |
| `CLAUDE_CODE_REMOTE_TOOLS_ADOPT_MCP` | Not on a page yet |
| `CLAUDE_CODE_REMOTE_TOOLS_ASK_SEATS` | Not on a page yet |
| `CLAUDE_CODE_REMOTE_TOOLS_CALLER_SESSIONS_MAX` | Not on a page yet |
| `CLAUDE_CODE_REMOTE_TOOLS_FORWARD` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_REMOTE_TOOLS_HOST_ALLOWS_UNATTENDED` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_REMOTE_TOOLS_JUMP_QUEUE` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_REMOTE_TOOLS_PIN_STORED_LOGIN` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_REMOTE_TOOLS_POLICY` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_REMOTE_TOOLS_SERVE` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_REMOTE_TOOLS_SESSION_CHANNEL` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_REMOTE_TOOLS_SPECULATIVE_CLASSIFIER` | Not on a page yet |
| `CLAUDE_CODE_REMOVE_PROMPT_STRINGS` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `CLAUDE_CODE_REPL` | Not on a page yet |
| `CLAUDE_CODE_REPORT_FINDINGS` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_REPO_CHECKOUTS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_RESTRICTED` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_RESTRICT_PERSONAL_CONFIG` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_RESULT_NONCE` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_RESUME_FROM_SESSION` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_RESUME_INTERRUPTED_TURN` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_RESUME_INTERRUPTED_TURN_MAX_AGE_MS` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_RESUME_PROMPT` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_RESUME_REASON` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_RESUME_SESSIONSTART_HOOKS_WAIT_MS` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_RESUME_SHOWS_CUT_OFF_CALLS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_RESUME_SOURCE_ALIVE` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_RESUME_THRESHOLD_MINUTES` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_RESUME_TOKEN_THRESHOLD` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_RESUME_TOLERATES_CONTEXT_APPENDS` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_RESUME_TOLERATES_CONTEXT_SEEDS` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_RETRY_WATCHDOG` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_RETRY_WATCHDOG_MAX_USAGE_LIMIT_WAIT_MS` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_RETRY_WATCHDOG_MAX_WAIT_MS` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_RETRY_WATCHDOG_USAGE_LIMIT_RECHECK_MS` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_CODE_RIPPLING_TULIP` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_RUSTLING_PIXEL` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_SAFE_MODE` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_SANDBOXED` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_SANDBOX_LEAVE_DENIES_TO_SRT_WIN` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_SANDBOX_LEAVE_PARENT_FOLDERS_ALONE` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_SCRIPT_CAPS` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_SCROLL_SPEED` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_SDK_HAS_HOST_AUTH_REFRESH` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_SDK_HAS_OAUTH_REFRESH` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_SDK_READS_SESSION_STATE` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `CLAUDE_CODE_SDK_READS_STARTUP_MARKS` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `CLAUDE_CODE_SENDMESSAGE_HANDBACK` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_SEND_FEEDBACK` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SESSION_ACCESS_TOKEN` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_SESSION_ATTENDED` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_SESSION_ID` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_SESSION_KIND` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_SESSION_LOG` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_SESSION_NAME` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_SESSION_ORIGIN` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_SESSION_START_ANNOUNCEMENTS_BEFORE_PROMPT` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_SHELL` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_SHELL_LAUNCHER_SCRIPT` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_SHELL_PREFIX` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_SILENT_TURN_REMINDER` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_SILENT_TURN_REMINDER_SECONDS` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_SILENT_TURN_REMINDER_TEXT` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_SILENT_TURN_REMINDER_TURNS` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_SIMPLE` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_SIMULATE_PROXY_USAGE` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `CLAUDE_CODE_SKILL_ATTRIBUTION` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SKILL_PROPOSALS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SKIP_ANTHROPIC_AWS_AUTH` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_SKIP_ANTHROPIC_GOOGLE_CLOUD_AUTH` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_SKIP_AWS_CRED_CACHE` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_SKIP_BEDROCK_AUTH` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_SKIP_FAST_MODE_NETWORK_ERRORS` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_SKIP_FAST_MODE_ORG_CHECK` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_SKIP_FOUNDRY_AUTH` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_SKIP_HFI_VERSION_CHECK` | Not on a page yet |
| `CLAUDE_CODE_SKIP_MANTLE_AUTH` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_SKIP_MODEL_ACCESS_MEMORY` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_SKIP_PLUGIN_LOCAL_MCP_SERVERS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SKIP_PLUGIN_MCP_BUNDLES` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SKIP_PLUGIN_MCP_SERVERS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SKIP_PLUGIN_MCP_SERVERS_EXCEPT` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SKIP_PROJECT_BACKFILL` | Not on a page yet |
| `CLAUDE_CODE_SKIP_PROMPT_HISTORY` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_SKIP_REPO_UPLOAD` | Not on a page yet |
| `CLAUDE_CODE_SKIP_VERTEX_AUTH` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_SLACK_TAG_TOKEN` | Not on a page yet |
| `CLAUDE_CODE_SLEEPY_SNOWFLAKE` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_SLEEP_COMPACT` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_SLEEP_COMPACT_AFTER_MS` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_SLOW_OPERATION_THRESHOLD_MS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_SNAPPY_PELICAN` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_SPAWNED_BY_SERVER` | Not on a page yet |
| `CLAUDE_CODE_SPAWN_TIMESTAMP_MS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_SSE_PORT` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_STALL_TIMEOUT_MS_FOR_TESTING` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_STARTUP_FAILURE_RESULTS` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_STELLAR_DRIFT` | Not on a page yet |
| `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_STREAMED_BUMBLEBEE` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_STREAMED_BUMBLEBEE_TEXT` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_STRICT_INLINE_SHELL_RM_PROMPT` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_SUBAGENT_CACHE_EVICT` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_SUBAGENT_CONFIG_WARNING` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_SUBAGENT_HISTORY` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_SUBAGENT_MODEL` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_SUBAGENT_PROMPT_CACHE_TTL` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_SUBAGENT_PROMPT_SNAPSHOT` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_SUBSCRIPTION_TYPE` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_SUPERVISED` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `CLAUDE_CODE_SUPPRESS_SESSION_ATTRIBUTION` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_SYNC_PLUGINS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SYNC_PLUGINS_BUFFERED_DOWNLOAD` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SYNC_PLUGINS_DOWNLOAD_CONCURRENCY` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SYNC_PLUGINS_DOWNLOAD_STALL_MS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SYNC_PLUGINS_INSTALL_TIMEOUT_MS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SYNC_PLUGINS_MCP_TIMEOUT_MS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SYNC_PLUGIN_INSTALL` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SYNC_PLUGIN_INSTALL_TIMEOUT_MS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SYNC_REUSE_WITHIN_MS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SYNC_SESSION_REFS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SYNC_SKILLS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SYNC_SKILLS_INSTALL_TIMEOUT_MS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SYNC_SKILLS_WAIT_TIMEOUT_MS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_SYNTAX_HIGHLIGHT` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_SYSTEM_PROMPT_GB_FEATURE` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_TAGS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_TAG_ISMETA_MESSAGES` | Not on a page yet |
| `CLAUDE_CODE_TASK_LIST_ID` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_TEAMMATE_COMMAND` | Not on a page yet |
| `CLAUDE_CODE_TEAM_TEARDOWN_PARK_TIMEOUT_MS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_TEE_SDK_STDOUT` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_TERMINAL_MCP_TOOLS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_TERMINAL_RECORDING` | Not on a page yet |
| `CLAUDE_CODE_TEST_ALLOW_REAL_NETWORK` | Not on a page yet |
| `CLAUDE_CODE_TEST_FIXTURES_ROOT` | Not on a page yet |
| `CLAUDE_CODE_TEST_FORCE_DENY` | Not on a page yet |
| `CLAUDE_CODE_TEST_NO_GIT_BASH` | Not on a page yet |
| `CLAUDE_CODE_TEST_NO_PWSH` | Not on a page yet |
| `CLAUDE_CODE_TETHER_LIVE` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `CLAUDE_CODE_THINKING_DISPLAY_UPDATES` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_THISTLE_GREBE` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_THRIFTY_SONIC` | Not on a page yet |
| `CLAUDE_CODE_TICKLISH_WHISPER` | Not on a page yet |
| `CLAUDE_CODE_TICKLISH_WHISPER_TIMEOUT_MS` | Not on a page yet |
| `CLAUDE_CODE_TMPDIR` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_TMUX_PREFIX` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_TMUX_PREFIX_CONFLICTS` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_TMUX_SESSION` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_TMUX_TRUECOLOR` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_TOASTY_THIMBLE` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_TODO_REMINDER_MODE` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_CODE_TOOL_MEMORY_CGROUP_EXCLUDE` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_TOOL_MEMORY_LIMIT` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_TOOL_USE_ID` | Not on a page yet |
| `CLAUDE_CODE_TOTAL_TOKENS_REMINDER` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_TOTAL_TOKENS_REMINDER_AFTER_USER_TURN` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_TOTAL_TOKENS_REMINDER_BUDGET` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_CODE_TRANSCRIPT_LOCAL_GC` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_TRANSCRIPT_SLIM_TOOL_RESULTS` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_CODE_TRIGGER_ID` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_TUI_JUST_SWITCHED` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_TUI_TRIAL` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_TURN_UPDATES` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_TWO_STAGE_CLASSIFIER` | Not on a page yet |
| `CLAUDE_CODE_ULTRAREVIEW_PREFLIGHT_FIXTURE` | Not on a page yet |
| `CLAUDE_CODE_ULTRAREVIEW_QUOTA_FIXTURE` | Not on a page yet |
| `CLAUDE_CODE_USER_DIALOG_TIMEOUT_MS` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CODE_USER_EMAIL` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_USE_ANTHROPIC_AWS` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_USE_BEDROCK` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_USE_CCR_V2` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_USE_COWORK_PLUGINS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_CODE_USE_FOUNDRY` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_USE_GATEWAY` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_USE_MANTLE` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_USE_NATIVE_FILE_SEARCH` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_USE_POWERSHELL_TOOL` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_USE_VERTEX` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_CODE_VERSION` | Not on a page yet |
| `CLAUDE_CODE_VOICE_FORWARD_INTERIMS_TYPED` | Not on a page yet |
| `CLAUDE_CODE_WARN_DISK_FREE_GIB` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_WARN_MEMORY_FREE_GIB` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_WEBFETCH_CACHE_TTL_MS` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_WEBFETCH_DEADLINE_MS` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_WEBFETCH_USE_CCR_PROXY` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_WEBSEARCH_CITATIONS` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_WEBSEARCH_USE_CCR_PROXY` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_CODE_WEB_FETCH_AGENT` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_WEB_SEARCH_FAST_ARG` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_WEB_SEARCH_REFILLS_PER_HOUR` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_CODE_WHIMSICAL_ELEPHANT` | Not on a page yet |
| `CLAUDE_CODE_WILLOW_TERN` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_WISE_COMET` | Not on a page yet |
| `CLAUDE_CODE_WITTY_DEWDROP` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_WORKER_CHECKIN_SCHEDULE` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_WORKER_EPOCH` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_CODE_WORKFLOWS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_WORKFLOW_LAUNCH_SHA256` | Not on a page yet |
| `CLAUDE_CODE_WORKFLOW_MAX_CONCURRENT_AGENTS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_WORKFLOW_PREFIX_STAGGER_MS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_WORKFLOW_PROMPT_PROVENANCE` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_WORKFLOW_SIZE_WARNING_AGENTS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_WORKFLOW_SIZE_WARNING_TOKENS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_CODE_WORKFLOW_SUBAGENT_MODEL` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_CODE_WORKSPACE_HOST_PATHS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_CODE_YOU_SHOULD_KNOW_DEBUG` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_CONFIG_DIR` | [Environment Variables](../configure/env-vars/index.md) |
| `CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_COWORK_MEMORY_GUIDELINES` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_COWORK_MEMORY_INDEX_CONTENT` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_COWORK_MEMORY_PATH_OVERRIDE` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_DEBUG` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_DISABLE_ADOPT` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_EFFORT` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `CLAUDE_ENABLE_BYTE_WATCHDOG` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_ENABLE_BYTE_WATCHDOG_BEDROCK` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_ENABLE_STREAM_WATCHDOG` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_ENV_FILE` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_FORCE_DISPLAY_SURVEY` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `CLAUDE_GATEWAY_ALLOW_LOOPBACK` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_GATEWAY_DRAIN_TIMEOUT_MS` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_GATEWAY_LOG_LEVEL` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_GATEWAY_PROXY_IS_EGRESS_BOUNDARY` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLAUDE_IMPORT_CONVERSATIONS` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME` | Not on a page yet |
| `CLAUDE_INTERNAL_FC_OVERRIDES` | Not on a page yet |
| `CLAUDE_JOB_DIR` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_LOCAL_OAUTH_API_BASE` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_LOCAL_OAUTH_APPS_BASE` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_LOCAL_OAUTH_CONSOLE_BASE` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_MEMORY_STORES` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_MOCK_HEADERLESS_429` | Not on a page yet |
| `CLAUDE_PID` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `CLAUDE_PLUGIN_DATA` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_PLUGIN_ROOT` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_PROJECT_DIR` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `CLAUDE_PROJECT_UUID` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `CLAUDE_PTY_HEARTBEAT_MS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_PTY_HOST_EXEC` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_PTY_HOST_NO_STABLE_PATH` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_PTY_ORPHAN_CHECK_MS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `CLAUDE_PTY_RECORD` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `CLAUDE_RELAUNCH_SESSION_ADD_DIRS` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_REMOTE_CONTROL_SESSION_NAME_PREFIX` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_REMOTE_TOOLS_BRIDGE_URL` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_REMOTE_WORKFLOW_ARGS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_REMOTE_WORKFLOW_SCRIPT` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_RUNNER_ACCOUNT_EMAIL` | Not on a page yet |
| `CLAUDE_RUNNER_ACCOUNT_ID` | Not on a page yet |
| `CLAUDE_RUNNER_ACTIVITY_FD` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_RUNNER_ALIVE_EVERY_MS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_RUNNER_API_BASE_URL` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_RUNNER_ATTEMPT` | Not on a page yet |
| `CLAUDE_RUNNER_CHECKOUT_PATH` | Not on a page yet |
| `CLAUDE_RUNNER_CLIENT_PLATFORM` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_RUNNER_CORRELATION_ID` | Not on a page yet |
| `CLAUDE_RUNNER_DEBUG_LOG_PATH` | Not on a page yet |
| `CLAUDE_RUNNER_DISABLE_AWAITING_ACTION_OVERRIDE` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_RUNNER_DISABLE_TURN_BEGAN_BEFORE_INIT` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_RUNNER_EXIT_REASON` | Not on a page yet |
| `CLAUDE_RUNNER_FAIL_FAST_FETCH` | Not on a page yet |
| `CLAUDE_RUNNER_FETCH_DEPTH` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_RUNNER_FETCH_SERVER_PROGRESS_CAP_MS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_RUNNER_GIT_MOUNT_URL` | Not on a page yet |
| `CLAUDE_RUNNER_ORDER_ID` | Not on a page yet |
| `CLAUDE_RUNNER_ORDER_SERVER_TIME` | Not on a page yet |
| `CLAUDE_RUNNER_POOL_ID` | Not on a page yet |
| `CLAUDE_RUNNER_PRIMARY_REPO_REVISION` | Not on a page yet |
| `CLAUDE_RUNNER_PRIMARY_REPO_URL` | Not on a page yet |
| `CLAUDE_RUNNER_REPO_REF` | Not on a page yet |
| `CLAUDE_RUNNER_REPO_SOURCES` | Not on a page yet |
| `CLAUDE_RUNNER_REPO_URL` | Not on a page yet |
| `CLAUDE_RUNNER_SESSION_ID` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_RUNNER_SESSION_UUID` | Not on a page yet |
| `CLAUDE_RUNNER_SKIP_GIT_VERIFY` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_RUNNER_STALL_GIVEUP` | Not on a page yet |
| `CLAUDE_RUNNER_TRUST_CANONICAL_PREWARM` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_RUNNER_UPDATE_BIN` | Not on a page yet |
| `CLAUDE_RUNNER_USE_GIT_PROXY` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_RUNNER_WORKSPACE_PATHS` | Not on a page yet |
| `CLAUDE_RUNNER_WORK_ORDER_FILE` | Not on a page yet |
| `CLAUDE_SECURESTORAGE_CONFIG_DIR` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_SERVE_DRAIN_TIMEOUT_MS` | Not on a page yet |
| `CLAUDE_SESSION_INGRESS_TOKEN_FILE` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_SLOW_FIRST_BYTE_MS` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_SNIP` | Not on a page yet |
| `CLAUDE_SSH_DAEMON_CHILD` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_SSH_LOCAL_BINARY` | Not on a page yet |
| `CLAUDE_SSH_RUN_DIR` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_SSH_VERSION` | Not on a page yet |
| `CLAUDE_STAGE_FILE_ROOT` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `CLAUDE_STREAM_FIRST_BYTE_TIMEOUT_MS` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_STREAM_IDLE_TIMEOUT_MS` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLAUDE_TEST_PROJECT_DIR` | Not on a page yet |
| `CLAUDE_TMPDIR` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `CLAUDE_TRUSTED_DEVICE_TOKEN` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `CLAUDE_WORKFLOW_NAME_ONLY` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLAUDE_WORKSHOP_PROGRESS` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `CLICOLOR_FORCE` | Not on a page yet |
| `CLIPBOARD_NAPI_NODE_PATH` | Not on a page yet |
| `CLOUDSDK_ACTIVE_CONFIG_NAME` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLOUDSDK_AUTH_ACCESS_TOKEN` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLOUDSDK_AUTH_ACCESS_TOKEN_FILE` | Not on a page yet |
| `CLOUDSDK_AUTH_AUTHORIZATION_TOKEN_FILE` | Not on a page yet |
| `CLOUDSDK_AUTH_CREDENTIAL_FILE_OVERRIDE` | Not on a page yet |
| `CLOUDSDK_CONFIG` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLOUDSDK_CORE_CUSTOM_CA_CERTS_FILE` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CLOUDSDK_ROOT_DIR` | Not on a page yet |
| `CLOUD_ML_REGION` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `CLOUD_RUN_JOB` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `CODER` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `CODER_WORKSPACE_NAME` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `CODESPACES` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `COLORFGBG` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `COLORTERM` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `COMPOSER_AUTH` | Not on a page yet |
| `COMPOSER_HOME` | Not on a page yet |
| `COMPUTERNAME` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `COMSPEC` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `CONAN_LOGIN_USERNAME` | Not on a page yet |
| `CONAN_PASSWORD` | Not on a page yet |
| `CONSUL_CLIENT_CERT` | Not on a page yet |
| `CONSUL_CLIENT_KEY` | Not on a page yet |
| `CONSUL_HTTP_AUTH` | Not on a page yet |
| `CONSUL_HTTP_TOKEN` | Not on a page yet |
| `CONSUL_HTTP_TOKEN_FILE` | Not on a page yet |
| `CONTAINER_SANDBOX_MOUNT_POINT` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `COURSIER_CONFIG_DIR` | Not on a page yet |
| `COURSIER_CREDENTIALS` | Not on a page yet |
| `CPLUS_INCLUDE_PATH` | Not on a page yet |
| `CREDENTIALS_DIRECTORY` | Not on a page yet |
| `CURL_CA_BUNDLE` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `CURL_HOME` | Not on a page yet |
| `CURSOR_TRACE_ID` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `C_INCLUDE_PATH` | Not on a page yet |
| `ComSpec` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `ConEmuANSI` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `ConEmuPID` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `ConEmuTask` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `DAYTONA_WS_ID` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `DBUS_SESSION_BUS_ADDRESS` | Not on a page yet |
| `DEBIAN_FRONTEND` | Not on a page yet |
| `DEBUG` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `DEBUG_AUTH` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `DEBUG_CLAUDE_AGENT_SDK` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `DEBUG_SDK` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `DEFAULT_IDENTITY_CLIENT_ID` | Not on a page yet |
| `DEFAULT_WORKFLOW_TOKEN` | Not on a page yet |
| `DEMO_VERSION` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `DENO_CERT` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `DENO_DEPLOYMENT_ID` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `DETECT_GCP_RETRIES` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `DEVELOPER_DIR` | Not on a page yet |
| `DEVPOD` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `DEVPOD_WORKSPACE_UID` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `DISABLE_AUTOUPDATER` | [Environment Variables](../configure/env-vars/index.md) |
| `DISABLE_AUTO_COMPACT` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `DISABLE_BRIEF_MODE_STOP_HOOK` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `DISABLE_BUG_COMMAND` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `DISABLE_COMPACT` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `DISABLE_COST_WARNINGS` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `DISABLE_DOCTOR_COMMAND` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `DISABLE_ERROR_REPORTING` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `DISABLE_EXTRA_USAGE_COMMAND` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `DISABLE_FEEDBACK_COMMAND` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `DISABLE_GROWTHBOOK` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `DISABLE_INSTALLATION_CHECKS` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `DISABLE_INSTALL_GITHUB_APP_COMMAND` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `DISABLE_INTERLEAVED_THINKING` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `DISABLE_LOGIN_COMMAND` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `DISABLE_LOGOUT_COMMAND` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `DISABLE_PROMPT_CACHING` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `DISABLE_PROMPT_CACHING_FABLE` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `DISABLE_PROMPT_CACHING_HAIKU` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `DISABLE_PROMPT_CACHING_MYTHOS` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `DISABLE_PROMPT_CACHING_OPUS` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `DISABLE_PROMPT_CACHING_SONNET` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `DISABLE_TELEMETRY` | [Environment Variables](../configure/env-vars/index.md) |
| `DISABLE_UPDATES` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `DISABLE_UPGRADE_COMMAND` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `DISCORD_WEBHOOK` | Not on a page yet |
| `DISCORD_WEBHOOK_URL` | Not on a page yet |
| `DISPLAY` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `DOCKER_CERT_PATH` | Not on a page yet |
| `DOCKER_CONFIG` | Not on a page yet |
| `DO_NOT_TRACK` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `DYLD_FALLBACK_FRAMEWORK_PATH` | Not on a page yet |
| `DYLD_FALLBACK_LIBRARY_PATH` | Not on a page yet |
| `DYLD_FRAMEWORK_PATH` | Not on a page yet |
| `DYLD_INSERT_LIBRARIES` | Not on a page yet |
| `DYLD_LIBRARY_PATH` | Not on a page yet |
| `DYLD_VERSIONED_FRAMEWORK_PATH` | Not on a page yet |
| `DYLD_VERSIONED_LIBRARY_PATH` | Not on a page yet |
| `DYNO` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `EDITOR` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `EMBEDDED_SEARCH_TOOLS` | Not on a page yet |
| `ENABLE_BETA_TRACING_DETAILED` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `ENABLE_CLAUDEAI_MCP_SERVERS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `ENABLE_ENHANCED_TELEMETRY_BETA` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `ENABLE_LOCKLESS_UPDATES` | Not on a page yet |
| `ENABLE_LSP_TOOL` | Not on a page yet |
| `ENABLE_MCP_LARGE_OUTPUT_FILES` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `ENABLE_PID_BASED_VERSION_LOCKING` | Not on a page yet |
| `ENABLE_PROMPT_CACHING_1H` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ENABLE_PROMPT_CACHING_1H_BEDROCK` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `ENABLE_SESSION_BACKGROUNDING` | Not on a page yet |
| `ENABLE_SESSION_PERSISTENCE` | Not on a page yet |
| `ENABLE_TOOL_SEARCH` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `ENVIRONMENT_SERVICE_KEY` | Not on a page yet |
| `ES_JAVA_OPTS` | Not on a page yet |
| `FALLBACK_FOR_ALL_PRIMARY_MODELS` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `FASTLANE_SESSION` | Not on a page yet |
| `FLIT_PASSWORD` | Not on a page yet |
| `FLIT_USERNAME` | Not on a page yet |
| `FLY_APP_NAME` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `FLY_MACHINE_ID` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `FORCE_AUTOUPDATE_PLUGINS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `FORCE_CODE_TERMINAL` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `FORCE_COLOR` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `FORCE_HYPERLINK` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `FORCE_PROMPT_CACHING_5M` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `FORCE_VCR` | Not on a page yet |
| `FUNCTION_NAME` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `FUNCTION_TARGET` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `GAE_MODULE_NAME` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `GAE_SERVICE` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `GCC_COLORS` | Not on a page yet |
| `GCE_METADATA_HOST` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `GCE_METADATA_IP` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `GCE_METADATA_ROOT` | Not on a page yet |
| `GCLOUD_PROJECT` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `GCM_INTERACTIVE` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `GCONV_PATH` | Not on a page yet |
| `GEM_HOME` | Not on a page yet |
| `GEM_HOST_API_KEY` | Not on a page yet |
| `GEM_PATH` | Not on a page yet |
| `GH_CONFIG_DIR` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `GH_ENTERPRISE_TOKEN` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `GH_HOST` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `GH_REPO` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `GH_TOKEN` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `GIO_MODULE_DIR` | Not on a page yet |
| `GITEA_ACTIONS` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `GITHUB_ACTIONS` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `GITHUB_ACTION_INPUTS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `GITHUB_ACTION_PATH` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `GITHUB_ACTOR` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `GITHUB_ACTOR_ID` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `GITHUB_ENTERPRISE_TOKEN` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `GITHUB_ENV` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `GITHUB_EVENT_NAME` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `GITHUB_EVENT_PATH` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `GITHUB_REPOSITORY` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `GITHUB_REPOSITORY_ID` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `GITHUB_REPOSITORY_OWNER` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `GITHUB_REPOSITORY_OWNER_ID` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `GITHUB_TOKEN` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `GITHUB_WORKSPACE` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `GITLAB_ACCESS_TOKEN` | Not on a page yet |
| `GITLAB_CI` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `GITLAB_TOKEN` | Not on a page yet |
| `GITPOD_WORKSPACE_ID` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `GIT_ALLOW_PROTOCOL` | Not on a page yet |
| `GIT_ALTERNATE_OBJECT_DIRECTORIES` | Not on a page yet |
| `GIT_ASKPASS` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `GIT_ATTR_NOSYSTEM` | Not on a page yet |
| `GIT_ATTR_SOURCE` | Not on a page yet |
| `GIT_AUTHOR_DATE` | Not on a page yet |
| `GIT_AUTHOR_EMAIL` | Not on a page yet |
| `GIT_AUTHOR_NAME` | Not on a page yet |
| `GIT_CEILING_DIRECTORIES` | Not on a page yet |
| `GIT_COMMITTER_DATE` | Not on a page yet |
| `GIT_COMMITTER_EMAIL` | Not on a page yet |
| `GIT_COMMITTER_NAME` | Not on a page yet |
| `GIT_COMMON_DIR` | Not on a page yet |
| `GIT_CONFIG` | Not on a page yet |
| `GIT_CONFIG_COUNT` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `GIT_CONFIG_GLOBAL` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `GIT_CONFIG_NOSYSTEM` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `GIT_CONFIG_PARAMETERS` | Not on a page yet |
| `GIT_CONFIG_SYSTEM` | Not on a page yet |
| `GIT_DIFF_OPTS` | Not on a page yet |
| `GIT_DIR` | Not on a page yet |
| `GIT_DISCOVERY_ACROSS_FILESYSTEM` | Not on a page yet |
| `GIT_EDITOR` | Not on a page yet |
| `GIT_EXEC_PATH` | Not on a page yet |
| `GIT_EXTERNAL_DIFF` | Not on a page yet |
| `GIT_GLOB_PATHSPECS` | Not on a page yet |
| `GIT_GRAFT_FILE` | Not on a page yet |
| `GIT_HTTP_PROXY_AUTHMETHOD` | Not on a page yet |
| `GIT_ICASE_PATHSPECS` | Not on a page yet |
| `GIT_IMPLICIT_WORK_TREE` | Not on a page yet |
| `GIT_INDEX_FILE` | Not on a page yet |
| `GIT_LFS_SKIP_SMUDGE` | Not on a page yet |
| `GIT_LITERAL_PATHSPECS` | Not on a page yet |
| `GIT_NAMESPACE` | Not on a page yet |
| `GIT_NOGLOB_PATHSPECS` | Not on a page yet |
| `GIT_NO_LAZY_FETCH` | Not on a page yet |
| `GIT_NO_REPLACE_OBJECTS` | Not on a page yet |
| `GIT_OBJECT_DIRECTORY` | Not on a page yet |
| `GIT_OPTIONAL_LOCKS` | Not on a page yet |
| `GIT_PAGER` | Not on a page yet |
| `GIT_PROGRESS_DELAY` | Not on a page yet |
| `GIT_PROXY_COMMAND` | Not on a page yet |
| `GIT_REFERENCE_BACKEND` | Not on a page yet |
| `GIT_REPLACE_REF_BASE` | Not on a page yet |
| `GIT_SEQUENCE_EDITOR` | Not on a page yet |
| `GIT_SHALLOW_FILE` | Not on a page yet |
| `GIT_SSH` | Not on a page yet |
| `GIT_SSH_COMMAND` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `GIT_SSH_VARIANT` | Not on a page yet |
| `GIT_SSL_CAINFO` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `GIT_SSL_CAPATH` | Not on a page yet |
| `GIT_SSL_CERT` | Not on a page yet |
| `GIT_SSL_KEY` | Not on a page yet |
| `GIT_SSL_NO_VERIFY` | Not on a page yet |
| `GIT_TEMPLATE_DIR` | Not on a page yet |
| `GIT_TERMINAL_PROMPT` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `GIT_TEST_PACK_PATH_WALK` | Not on a page yet |
| `GIT_TEXTDOMAINDIR` | Not on a page yet |
| `GIT_WORK_TREE` | Not on a page yet |
| `GNOME_TERMINAL_SERVICE` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `GOOGLE_APPLICATION_CREDENTIALS` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `GOOGLE_CLOUD_PROJECT` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `GOOGLE_CLOUD_QUOTA_PROJECT` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `GOOGLE_CLOUD_WORKSTATIONS` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `GOOGLE_GHA_CREDS_PATH` | Not on a page yet |
| `GOOGLE_OAUTH_ACCESS_TOKEN` | Not on a page yet |
| `GRACEFUL_FS_PLATFORM` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `GRADLE_OPTS` | Not on a page yet |
| `GRADLE_USER_HOME` | Not on a page yet |
| `GREP_COLOR` | Not on a page yet |
| `GREP_COLORS` | Not on a page yet |
| `GRPC_DEFAULT_SSL_ROOTS_FILE_PATH` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `GRPC_EXPERIMENTAL_ENABLE_OUTLIER_DETECTION` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `GRPC_NODE_TRACE` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `GRPC_NODE_USE_ALTERNATIVE_RESOLVER` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `GRPC_NODE_VERBOSITY` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `GRPC_SSL_CIPHER_SUITES` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `GRPC_TRACE` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `GRPC_VERBOSITY` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `GTK_PATH` | Not on a page yet |
| `HATCH_INDEX_AUTH` | Not on a page yet |
| `HATCH_INDEX_USER` | Not on a page yet |
| `HELM_CONFIG_HOME` | Not on a page yet |
| `HELM_REGISTRY_CONFIG` | Not on a page yet |
| `HELM_REPOSITORY_CONFIG` | Not on a page yet |
| `HEX_CACERTS_PATH` | Not on a page yet |
| `HEX_HOME` | Not on a page yet |
| `HF_HOME` | Not on a page yet |
| `HF_STORED_TOKENS_PATH` | Not on a page yet |
| `HF_TOKEN` | Not on a page yet |
| `HF_TOKEN_PATH` | Not on a page yet |
| `HISTFILE` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `HOME` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `HOMEBREW_NO_AUTO_UPDATE` | Not on a page yet |
| `HOMEDRIVE` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `HOMEPATH` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `HOMESHARE` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `HOSTNAME` | Not on a page yet |
| `HTTPLIB2_CA_CERTS` | Not on a page yet |
| `HTTPS_PROXY` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `HTTP_PROXY` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `HUB_CONFIG` | Not on a page yet |
| `HUGGINGFACEHUB_API_TOKEN` | Not on a page yet |
| `HUGGING_FACE_HUB_TOKEN` | Not on a page yet |
| `IBM_JAVA_OPTIONS` | Not on a page yet |
| `IDENTITY_ENDPOINT` | Not on a page yet |
| `IDENTITY_HEADER` | Not on a page yet |
| `IDENTITY_SERVER_THUMBPRINT` | Not on a page yet |
| `IMDS_ENDPOINT` | Not on a page yet |
| `INK_SCREEN_READER` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `INTELLIJ_TERMINAL_COMMAND_BLOCKS` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `INTELLIJ_TERMINAL_COMMAND_BLOCKS_REWORKED` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `IS_DEMO` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `IS_SANDBOX` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `ITERM_SESSION_ID` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `JAVA_HOME` | Not on a page yet |
| `JAVA_OPTS` | Not on a page yet |
| `JAVA_TOOL_OPTIONS` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `JDK_JAVA_OPTIONS` | Not on a page yet |
| `JF_USER` | Not on a page yet |
| `JVM_OPTS` | Not on a page yet |
| `KITTY_WINDOW_ID` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `KONSOLE_VERSION` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `KRB5_CONFIG` | Not on a page yet |
| `KUBERNETES_SERVICE_HOST` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `K_CONFIGURATION` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `K_SERVICE` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `LANG` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `LC_ALL` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `LC_CTYPE` | Not on a page yet |
| `LC_TERMINAL` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `LC_TIME` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `LD_AUDIT` | Not on a page yet |
| `LD_LIBRARY_PATH` | Not on a page yet |
| `LD_PRELOAD` | Not on a page yet |
| `LEIN_HOME` | Not on a page yet |
| `LEIN_JVM_OPTS` | Not on a page yet |
| `LIBRARY_PATH` | Not on a page yet |
| `LOCALAPPDATA` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `LOCAL_BRIDGE` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `LS_COLORS` | Not on a page yet |
| `M2_HOME` | Not on a page yet |
| `MATCH_GIT_BASIC_AUTHORIZATION` | Not on a page yet |
| `MATURIN_PASSWORD` | Not on a page yet |
| `MATURIN_PYPI_TOKEN` | Not on a page yet |
| `MATURIN_USERNAME` | Not on a page yet |
| `MAVEN_ARGS` | Not on a page yet |
| `MAVEN_CONFIG` | Not on a page yet |
| `MAVEN_HOME` | Not on a page yet |
| `MAVEN_OPTS` | Not on a page yet |
| `MAX_MCP_OUTPUT_TOKENS` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `MAX_STRUCTURED_OUTPUT_RETRIES` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `MAX_THINKING_TOKENS` | [Models and Effort](../configure/env-vars/models-and-effort.md) |
| `MCP_CLIENT_SECRET` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `MCP_CONNECTION_NONBLOCKING` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `MCP_CONNECT_TIMEOUT_MS` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `MCP_DISCOVERY_CACHE` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `MCP_DISCOVERY_CACHE_MAX_STALE_S` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `MCP_DISCOVERY_CACHE_STRIKES` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `MCP_DISCOVERY_CACHE_TTL_S` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `MCP_OAUTH_CALLBACK_PORT` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `MCP_OAUTH_CLIENT_METADATA_URL` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `MCP_PROTOCOL_NEGOTIATION` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `MCP_REMOTE_SERVER_CONNECTION_BATCH_SIZE` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `MCP_SDK_GENERATION` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `MCP_SERVER_CONNECTION_BATCH_SIZE` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `MCP_TIMEOUT` | [Environment Variables](../configure/env-vars/index.md) |
| `MCP_TOOL_TIMEOUT` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `MCP_TRUNCATION_PROMPT_OVERRIDE` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `MCP_XAA_IDP_CLIENT_SECRET` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `METADATA_SERVER_DETECTION` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `MONO_PATH` | Not on a page yet |
| `MSAL_FORCE_REGION` | Not on a page yet |
| `MSI_ENDPOINT` | Not on a page yet |
| `MSI_SECRET` | Not on a page yet |
| `MSYSTEM` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `MS_TEAMS_WEBHOOK_URI` | Not on a page yet |
| `NETLIFY` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `NIX_SSL_CERT_FILE` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `NODE_AUTH_TOKEN` | Not on a page yet |
| `NODE_COMPILE_CACHE` | Not on a page yet |
| `NODE_DEBUG` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `NODE_ENV` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `NODE_EXTRA_CA_CERTS` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `NODE_OPTIONS` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `NODE_PATH` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `NODE_REDIRECT_WARNINGS` | Not on a page yet |
| `NODE_REPL_EXTERNAL_MODULE` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `NODE_V8_COVERAGE` | Not on a page yet |
| `NOMAD_CLIENT_CERT` | Not on a page yet |
| `NOMAD_CLIENT_KEY` | Not on a page yet |
| `NOMAD_HTTP_AUTH` | Not on a page yet |
| `NOMAD_TOKEN` | Not on a page yet |
| `NO_COLOR` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `NO_PROXY` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `NPM_CONFIG_GLOBALCONFIG` | Not on a page yet |
| `NPM_CONFIG_HTTPS_PROXY` | Not on a page yet |
| `NPM_CONFIG_HTTP_PROXY` | Not on a page yet |
| `NPM_CONFIG_PREFIX` | Not on a page yet |
| `NPM_CONFIG_PROXY` | Not on a page yet |
| `NPM_CONFIG_USERCONFIG` | Not on a page yet |
| `NUGET_AUTH_TOKEN` | Not on a page yet |
| `NoDefaultCurrentDirectoryInExePath` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `OAUTH_TOKEN` | Not on a page yet |
| `OPENJ9_JAVA_OPTIONS` | Not on a page yet |
| `OPENSSL_CONF` | Not on a page yet |
| `OPENSSL_CONF_INCLUDE` | Not on a page yet |
| `OPENSSL_ENGINES` | Not on a page yet |
| `OPENSSL_MODULES` | Not on a page yet |
| `OSTYPE` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `OTEL_ATTRIBUTE_COUNT_LIMIT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_BLRP_EXPORT_TIMEOUT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_BLRP_MAX_EXPORT_BATCH_SIZE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_BLRP_MAX_QUEUE_SIZE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_BLRP_SCHEDULE_DELAY` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_BSP_EXPORT_TIMEOUT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_BSP_MAX_EXPORT_BATCH_SIZE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_BSP_MAX_QUEUE_SIZE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_BSP_SCHEDULE_DELAY` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_CERTIFICATE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_CLIENT_KEY` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_COMPRESSION` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_HEADERS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_INSECURE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_LOGS_CERTIFICATE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_LOGS_CLIENT_CERTIFICATE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_LOGS_CLIENT_KEY` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_LOGS_COMPRESSION` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_LOGS_ENDPOINT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_LOGS_HEADERS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_LOGS_INSECURE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_LOGS_PROTOCOL` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_METRICS_CERTIFICATE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_METRICS_CLIENT_CERTIFICATE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_METRICS_CLIENT_KEY` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_METRICS_COMPRESSION` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_METRICS_HEADERS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_METRICS_INSECURE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_METRICS_PROTOCOL` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_PROFILES_CERTIFICATE` | Not on a page yet |
| `OTEL_EXPORTER_OTLP_PROFILES_CLIENT_CERTIFICATE` | Not on a page yet |
| `OTEL_EXPORTER_OTLP_PROFILES_CLIENT_KEY` | Not on a page yet |
| `OTEL_EXPORTER_OTLP_PROFILES_ENDPOINT` | Not on a page yet |
| `OTEL_EXPORTER_OTLP_PROFILES_HEADERS` | Not on a page yet |
| `OTEL_EXPORTER_OTLP_PROFILES_INSECURE` | Not on a page yet |
| `OTEL_EXPORTER_OTLP_PROFILES_PROTOCOL` | Not on a page yet |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_TIMEOUT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_TRACES_CERTIFICATE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_TRACES_CLIENT_CERTIFICATE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_TRACES_CLIENT_KEY` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_TRACES_COMPRESSION` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_TRACES_HEADERS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_TRACES_INSECURE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_OTLP_TRACES_PROTOCOL` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_PROMETHEUS_HOST` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_EXPORTER_PROMETHEUS_PORT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_LOGRECORD_ATTRIBUTE_COUNT_LIMIT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_LOGS_EXPORTER` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_LOGS_EXPORT_INTERVAL` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_LOG_ASSISTANT_RESPONSES` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_LOG_MANAGED_SETTINGS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_LOG_RAW_API_BODIES` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_LOG_TOOL_CONTENT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_LOG_TOOL_DETAILS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_LOG_USER_PROMPTS` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_METRICS_EXPORTER` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_METRICS_INCLUDE_ACCOUNT_UUID` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_METRICS_INCLUDE_ENTRYPOINT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_METRICS_INCLUDE_REPOSITORY` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_METRICS_INCLUDE_RESOURCE_ATTRIBUTES` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_METRICS_INCLUDE_SESSION_ID` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_METRICS_INCLUDE_VERSION` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_METRIC_EXPORT_INTERVAL` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_RESOURCE_ATTRIBUTES` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_SERVICE_NAME` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_SPAN_EVENT_COUNT_LIMIT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_SPAN_LINK_COUNT_LIMIT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_TRACES_EXPORTER` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_TRACES_EXPORT_INTERVAL` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_TRACES_SAMPLER` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OTEL_TRACES_SAMPLER_ARG` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `OVERRIDE_GITHUB_TOKEN` | Not on a page yet |
| `OneDrive` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `OneDriveCommercial` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `OneDriveConsumer` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `P4PORT` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `PATH` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `PATHEXT` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `PHP_INI_SCAN_DIR` | Not on a page yet |
| `PIP_CERT` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `PIP_CLIENT_CERT` | Not on a page yet |
| `PIP_CONFIG_FILE` | Not on a page yet |
| `PLAYWRIGHT_BROWSERS_PATH` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `POETRY_CONFIG_DIR` | Not on a page yet |
| `PREFIX` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `PROCESSOR_ARCHITECTURE` | Not on a page yet |
| `PROGRAMDATA` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `PROJECT_DOMAIN` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `PS1` | Not on a page yet |
| `PS2` | Not on a page yet |
| `PWD` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `PYPI_API_TOKEN` | Not on a page yet |
| `PYPI_TOKEN` | Not on a page yet |
| `PYTEST_DEBUG` | Not on a page yet |
| `PYTEST_DISABLE_PLUGIN_AUTOLOAD` | Not on a page yet |
| `ProgramData` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `ProgramFiles` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `QT_PLUGIN_PATH` | Not on a page yet |
| `RAILWAY_ENVIRONMENT_NAME` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `RAILWAY_SERVICE_NAME` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `RCLONE_CONFIG` | Not on a page yet |
| `REGION_NAME` | Not on a page yet |
| `REGISTRY_AUTH_FILE` | Not on a page yet |
| `RENDER` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `REPL_ID` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `REPL_SLUG` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `REQUESTS_CA_BUNDLE` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `RES_OPTIONS` | Not on a page yet |
| `RUNNER_ENVIRONMENT` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `RUNNER_OS` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `RUSTUP_HOME` | Not on a page yet |
| `RUST_BACKTRACE` | Not on a page yet |
| `RUST_LOG` | Not on a page yet |
| `R_LIBS` | Not on a page yet |
| `R_LIBS_SITE` | Not on a page yet |
| `R_LIBS_USER` | Not on a page yet |
| `R_PROFILE_USER` | Not on a page yet |
| `S3CMD_CONFIG` | Not on a page yet |
| `SAFEUSER` | [Features and Toggles](../configure/env-vars/features-and-toggles.md) |
| `SASL_PATH` | Not on a page yet |
| `SBT_CREDENTIALS` | Not on a page yet |
| `SBT_OPTS` | Not on a page yet |
| `SDK_NATIVE_BIN` | [SDK and Automation](../configure/env-vars/sdk-and-automation.md) |
| `SELF_HOSTED_RUNNER_AGENT_PROXY_URL` | Not on a page yet |
| `SELF_HOSTED_RUNNER_BASE_DIR` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_BG_RESULT_GRACE_MS` | Not on a page yet |
| `SELF_HOSTED_RUNNER_CHECKOUT_HOOK_TIMEOUT_MS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_CLIENT_LABEL` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_CONFIGURE_GIT` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_CONFINE_REPO_SETTINGS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_DEBUG_DIR` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_DEBUG_TOKEN_DIR` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_DEFER_SHUTDOWN_MAX_MS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_DIFF_FINDS_NESTED_REPOSITORY` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_DRAIN_GRACE_MS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_DRAIN_MARKER_FILE` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_DRAIN_WAIT_BG_TASKS_MS` | Not on a page yet |
| `SELF_HOSTED_RUNNER_DRAIN_WAIT_MS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_ENVIRONMENT_SECRET` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_EXEC_PATH` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_HEALTH_PORT` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_HOOKS_DIR` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_HOST_CONFIG_DIR` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_HOST_CONFIG_SNAPSHOT` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_IDLE_SHUTDOWN_MS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_LOCK_TO_ACCOUNT` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_LOG_FILE` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_MAX_LIFETIME_GRACE_MS` | Not on a page yet |
| `SELF_HOSTED_RUNNER_MAX_LIFETIME_MS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_POOL_SECRET` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_POST_SESSION_HOOK_TIMEOUT_MS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_POST_TURN_SETTLE_MS` | Not on a page yet |
| `SELF_HOSTED_RUNNER_PROXY_AUTHORIZATION_COMMAND` | Not on a page yet |
| `SELF_HOSTED_RUNNER_PROXY_AUTHORIZATION_FILE` | Not on a page yet |
| `SELF_HOSTED_RUNNER_PUSH_OUTCOME_ON_RELEASE` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_REMOVE_SESSION_STATE` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_RETIRE_AT` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_SERVER_AUTO_MODE_LISTS` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SELF_HOSTED_RUNNER_SESSION_IDLE_MS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `SELF_HOSTED_RUNNER_SESSION_STOP_GRACE_MS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `SELF_HOSTED_RUNNER_SIGKILL_GRACE_MS` | Not on a page yet |
| `SELF_HOSTED_RUNNER_SIGKILL_TIMEOUT_MS` | Not on a page yet |
| `SELF_HOSTED_RUNNER_STARTUP_TIMEOUT_MS` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `SELF_HOSTED_RUNNER_TRUST_WORKSPACE` | [Agents and Teams](../configure/env-vars/agents-and-teams.md) |
| `SESSIONNAME` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `SESSION_INGRESS_URL` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `SHELL` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `SHR_GIT_PROXY_TOKEN` | Not on a page yet |
| `SLACK_WEBHOOK` | Not on a page yet |
| `SLACK_WEBHOOK_URL` | Not on a page yet |
| `SLASH_COMMAND_TOOL_CHAR_BUDGET` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `SONARQUBE_SCANNER_PARAMS` | Not on a page yet |
| `SONAR_SCANNER_JAVA_OPTS` | Not on a page yet |
| `SONAR_SCANNER_JSON_PARAMS` | Not on a page yet |
| `SONAR_SCANNER_OPTS` | Not on a page yet |
| `SONAR_TOKEN` | Not on a page yet |
| `SOPS_AGE_KEY_FILE` | Not on a page yet |
| `SPACE_CREATOR_USER_ID` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `SRT_DEBUG` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `SRT_ENCODED_CMD` | Not on a page yet |
| `SRT_OBSERVE_SOCK` | Not on a page yet |
| `SSH_AGENT_PID` | Not on a page yet |
| `SSH_ASKPASS` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `SSH_ASKPASS_REQUIRE` | Not on a page yet |
| `SSH_AUTH_SOCK` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `SSH_CLIENT` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `SSH_CONNECTION` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `SSH_SIGNING_KEY` | Not on a page yet |
| `SSH_TTY` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `SSL_CERT_DIR` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `SSL_CERT_FILE` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `SSL_CLIENT_CERT` | Not on a page yet |
| `STY` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `SUDO_GID` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `SUDO_UID` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `SUDO_USER` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `SWE_BENCH_INSTANCE_ID` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `SWE_BENCH_RUN_ID` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `SWE_BENCH_TASK_ID` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `SYSTEMROOT` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `SYSTEM_REMINDER_MEMORY_CONTEXT` | Not on a page yet |
| `SYSTEM_WGETRC` | Not on a page yet |
| `SystemRoot` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `TASK_MAX_OUTPUT_LENGTH` | Not on a page yet |
| `TEAMCITY_VERSION` | [Bundled Libraries](../configure/env-vars/bundled-libraries.md) |
| `TEAMS_WEBHOOK_URL` | Not on a page yet |
| `TEMP` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `TERM` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `TERMINAL` | [UI and Terminal](../configure/env-vars/ui-and-terminal.md) |
| `TERMINAL_EMULATOR` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `TERMINATOR_UUID` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `TERMUX_VERSION` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `TERM_PROGRAM` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `TERM_PROGRAM_VERSION` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `TEST_ENABLE_SESSION_PERSISTENCE` | Not on a page yet |
| `TEST_GRACEFUL_FS_GLOBAL_PATCH` | Not on a page yet |
| `TF_CLI_CONFIG_FILE` | Not on a page yet |
| `TILIX_ID` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `TIME_STYLE` | Not on a page yet |
| `TMP` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `TMPDIR` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `TMUX` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `TMUX_PANE` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `TRACEPARENT` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `TRACESTATE` | [Telemetry and Debug](../configure/env-vars/telemetry-and-debug.md) |
| `TWINE_PASSWORD` | Not on a page yet |
| `TWINE_USERNAME` | Not on a page yet |
| `TZ` | Not on a page yet |
| `ULTRAPLAN_PROMPT_FILE` | Not on a page yet |
| `USER` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `USERNAME` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `USERPROFILE` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `USER_TYPE` | Not on a page yet |
| `USE_API_CONTEXT_MANAGEMENT` | [Context and Compaction](../configure/env-vars/context-and-compaction.md) |
| `USE_BUILTIN_RIPGREP` | [Tools and Bash](../configure/env-vars/tools-and-bash.md) |
| `USE_LOCAL_OAUTH` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `USE_STAGING_OAUTH` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `UV_CONFIG_FILE` | Not on a page yet |
| `UV_PUBLISH_PASSWORD` | Not on a page yet |
| `UV_PUBLISH_TOKEN` | Not on a page yet |
| `UV_PUBLISH_USERNAME` | Not on a page yet |
| `UV_THREADPOOL_SIZE` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `VAULT_AUTH_TOKEN` | Not on a page yet |
| `VAULT_CLIENT_CERT` | Not on a page yet |
| `VAULT_CLIENT_KEY` | Not on a page yet |
| `VAULT_ROLE_ID` | Not on a page yet |
| `VAULT_SECRET_ID` | Not on a page yet |
| `VAULT_TOKEN` | Not on a page yet |
| `VCR_RECORD` | Not on a page yet |
| `VERCEL` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `VERTEX_REGION_CLAUDE_3_5_HAIKU` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_3_5_SONNET` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_3_7_SONNET` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_4_0_OPUS` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_4_0_SONNET` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_4_1_OPUS` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_4_5_OPUS` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_4_5_SONNET` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_4_6_OPUS` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_4_6_SONNET` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_4_7_OPUS` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_4_8_OPUS` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_5_5_OPUS` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_5_5_SONNET` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_5_OPUS` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_5_SONNET` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_FABLE_5` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_FABLE_5_1` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_HAIKU_4_5` | Not on a page yet |
| `VERTEX_REGION_CLAUDE_HAIKU_5_5` | Not on a page yet |
| `VISUAL` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `VITALS_CLI_VERSION` | Not on a page yet |
| `VITALS_EMITTER_BIN` | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `VOICE_STREAM_BASE_URL` | Not on a page yet |
| `VSCODE_GIT_ASKPASS_MAIN` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `VSS_NUGET_ACCESSTOKEN` | Not on a page yet |
| `VSS_NUGET_EXTERNAL_FEED_ENDPOINTS` | Not on a page yet |
| `VTE_VERSION` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `VisualStudioVersion` | Not on a page yet |
| `WAYLAND_DISPLAY` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `WEBSITE_SITE_NAME` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `WEBSITE_SKU` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `WEZTERM_PANE` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `WINDIR` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `WSL_DISTRO_NAME` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `WSL_INTEROP` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `WT_SESSION` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `XDG_CACHE_HOME` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `XDG_CONFIG_DIRS` | Not on a page yet |
| `XDG_CONFIG_HOME` | [Auth and Accounts](../configure/env-vars/auth-and-accounts.md) |
| `XDG_DATA_DIRS` | Not on a page yet |
| `XDG_DATA_HOME` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `XDG_DESKTOP_DIR` | Not on a page yet |
| `XDG_DOCUMENTS_DIR` | Not on a page yet |
| `XDG_DOWNLOAD_DIR` | Not on a page yet |
| `XDG_RUNTIME_DIR` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `XDG_STATE_HOME` | [Sessions and Storage](../configure/env-vars/sessions-and-storage.md) |
| `XTERM_VERSION` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `ZDOTDIR` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `ZED_TERM` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `ZELLIJ` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL` | Not on a page yet |
| `_X_AMZN_TRACE_ID` | Not on a page yet |
| `__CFBundleIdentifier` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `all_proxy` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `gcloud_project` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `google_application_credentials` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `google_cloud_project` | [Cloud Providers](../configure/env-vars/cloud-providers.md) |
| `grpc_proxy` | Not on a page yet |
| `http_proxy` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `https_proxy` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |
| `no_grpc_proxy` | Not on a page yet |
| `no_proxy` | [Network and Proxy](../configure/env-vars/network-and-proxy.md) |

## Error Texts

Items: 4022.

| Item | Where |
| --- | --- |
| `"${…}" cannot be encoded with mode ${…}. Suggested mode is: ${…}` | Not on a page yet |
| `"${…}" is a file upload; project_delete only removes text docs. File uploads can be removed from the project in claude.ai.` | Not on a page yet |
| `"${…}" is hosted on claude.ai for this account but not allowed by your organization's marketplace policy (personal claude.ai uploads and blocked hosts are not admitted)` | Not on a page yet |
| `"${…}" is not a name a claude.ai-hosted marketplace can be added under` | Not on a page yet |
| `"${…}" is not a valid status.` | Not on a page yet |
| `"${…}" middleware ${…} "${…}" middleware cannot be overridden by "${…}" middleware ${…} "${…}" middleware.` | Not on a page yet |
| `"${…}" middleware with ${…} priority in ${…} step cannot be overridden by "${…}" middleware with ${…} priority in ${…} step.` | Not on a page yet |
| `"${…}" only supports hash fragment reference` | Not on a page yet |
| `"${…}" option must be an array of strings` | Not on a page yet |
| `"${…}" was disabled while reconnecting` | Not on a page yet |
| `"${…}" was not fetched: its npm registry, ${…}, is unencrypted and isn't your default npm registry, so npm could send your saved registry token to it in the clear. It works once the registry uses http…` | Not on a page yet |
| `"${…}" was not fetched: the npm registry set for it is not a valid address.` | Not on a page yet |
| `"${…}" was not installed: its ${…} listing names no repository.` | Not on a page yet |
| `"${…}" was not installed: the repository address in its ${…} listing is too long. Nothing was changed. Only a change to the listing can fix this.` | Not on a page yet |
| `"${…}": format "${…}" does not define "compare" function` | Not on a page yet |
| `"alg" (Algorithm) Header Parameter not allowed` | Not on a page yet |
| `"alg" (Algorithm) Header Parameter value not allowed` | Not on a page yet |
| `"alg" argument is required when "jwk.alg" is not present` | Not on a page yet |
| `"enc" (Encryption Algorithm) Header Parameter not allowed` | Not on a page yet |
| `"enc" (Encryption Algorithm) Header Parameter value not allowed` | Not on a page yet |
| `"exp" claim must be a number` | Not on a page yet |
| `"exp" claim timestamp check failed` | Not on a page yet |
| `"iat" claim must be a number` | Not on a page yet |
| `"iat" claim timestamp check failed (it should be in the past)` | Not on a page yet |
| `"iat" claim timestamp check failed (too far in the past)` | Not on a page yet |
| `"kty" (Key Type) Parameter missing or unsupported` | Not on a page yet |
| `"main" is a reserved recipient name (SendMessage routes it to the main conversation) — choose another teammate name.` | Not on a page yet |
| `"nbf" claim must be a number` | Not on a page yet |
| `"nbf" claim timestamp check failed` | Not on a page yet |
| `"nullable" cannot be used without "type"` | Not on a page yet |
| `"pkcs8" must be PKCS#8 formatted string` | Not on a page yet |
| `"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"` | Not on a page yet |
| `"toSJISFunc" is not a valid function.` | Not on a page yet |
| `"url" is required in "amzOptions"` | Not on a page yet |
| `"version" cannot be null or undefined` | Not on a page yet |
| `"version" should be in range from 1 to 40` | Not on a page yet |
| `$.${…} in a test takes the whole input of its event, which a mod's call may leave out` | Not on a page yet |
| `$.${…} is no call on the engine's $` | Not on a page yet |
| `$.${…}: no core at the bottom of the chain (the site did not install one and the call supplied none)` | Not on a page yet |
| `$.${…}: this environment was made without the host's streaming ops` | Not on a page yet |
| `$.audio.play: asset must be a path inside the plugin's directory (got ${…})` | Not on a page yet |
| `$.audio.play: clip must be { asset }, { url } or { base64, mime }` | Not on a page yet |
| `$.audio.play: clip must carry exactly one of asset, url, base64 (got ${…})` | Not on a page yet |
| `$.audio.play: clip.${…} must be a non-empty string` | Not on a page yet |
| `$.audio.play: clip.asset must be a string` | Not on a page yet |
| `$.audio.play: clip.mime must accompany clip.base64` | Not on a page yet |
| `$.audio.play: could not read ${…} in ${…}'s directory: ${…}` | Not on a page yet |
| `$.audio.play: options.gain must be a number from 0 to ${…}` | Not on a page yet |
| `$.audio.play: options.shouldLoop must be a boolean` | Not on a page yet |
| `$.audio.play: the clip is over ${…} bytes` | Not on a page yet |
| `$.audio.play: the plugin has no directory` | Not on a page yet |
| `$.audio.play: the plugin has no id` | Not on a page yet |
| `$.audio.speak: text must be a non-empty string` | Not on a page yet |
| `$.audio.speak: voice must be a string when given` | Not on a page yet |
| `$.classic.PreToolUse is no call on the engine's $: the engine raises it inside tool.call, so a test calls $.tool.call` | Not on a page yet |
| `$.session.append: refused: ${…}` | Not on a page yet |
| `$.session.append: this process keeps no conversation to append to` | Not on a page yet |
| `$.skill.prompt: called with ${…}` | Not on a page yet |
| `$.telemetry: the call names no origin` | Not on a page yet |
| `$.ui.${…}: ${…} holds ${…} ${…}s keyed ${…}, in ${…}; name the requestId or the surface` | Not on a page yet |
| `$.ui.${…}: no ${…} of ${…} keyed ${…} is drawn${…}; render or mount the tree that holds it first` | Not on a page yet |
| `$.ui.mount: ${…} ${…} is mounted on the ${…} surface already; unmount it first, or name another requestId for a second instance` | Not on a page yet |
| `$.ui.mount: the test ended while the drawing was being raised` | Not on a page yet |
| `$data keyword must have "code" or "validate" function` | Not on a page yet |
| `$schema must be a string` | Not on a page yet |
| `${…} ${…} could not be resolved (${…}) — refusing to write there` | Not on a page yet |
| `${…} ${…} has ${…} components; at most ${…} are allowed. Send one key, with its modifiers, per action.` | Not on a page yet |
| `${…} ${…} has ${…} keys that are not modifiers (${…}); a chord is modifier keys plus at most one other key. Send a separate action for each key.` | Not on a page yet |
| `${…} ${…} resolves to ${…}, outside ${…} — refusing to write there (is it a symlink?)` | Not on a page yet |
| `${…} ${…}; not sent` | Not on a page yet |
| `${…} (a sandbox path entry from ${…})` | Not on a page yet |
| `${…} (this machine's managed settings: ${…})` | Not on a page yet |
| `${…} HTTP method does not support ${…} client authentication` | Not on a page yet |
| `${…} Input messages: ${…}` | Not on a page yet |
| `${…} No backup was available to restore from.` | Not on a page yet |
| `${…} Nothing was deleted, and the known_marketplaces.json entry named "${…}" was left in place: those settings may turn ${…} on again, ${…} the commit the ${…} lists.${…}` | Not on a page yet |
| `${…} Restoring from backup failed, try manually with: defaults import com.apple.Terminal ${…}` | Not on a page yet |
| `${…} The retry over SSH failed too: ${…} Check the repository and ref in the marketplace entry and that github.com can be reached. If the repository is private, add an SSH key to your GitHub account o…` | Not on a page yet |
| ``${…} This install runs that command; confirm it by running `claude plugin install` in a terminal (or with -y/--yes).`` | Not on a page yet |
| `${…} Your settings have been restored from backup.` | Not on a page yet |
| `${…} addresses a document an earlier entry already writes — a batch writes each document at most once` | Not on a page yet |
| `${…} after ${…} attempts` | Not on a page yet |
| `${…} after register() returned: .catch() is for register()` | Not on a page yet |
| `${…} already exists and was not written by this run — nothing there is to be adopted; remove it and rerun` | Not on a page yet |
| `${…} already exists; refusing to overwrite it` | Not on a page yet |
| `${…} became a symlink while being created; refusing it (an empty file may have been created at its target, ${…})` | Not on a page yet |
| `${…} bound of type ${…}` | Not on a page yet |
| `${…} called twice: a registration takes one .catch` | Not on a page yet |
| `${…} can only be called once` | Not on a page yet |
| `${…} cannot be NaN or Infinity` | Not on a page yet |
| `${…} cannot be combined with --proxy-authorization-command / --proxy-authorization-file: sessions would reach that proxy without the egress listener. Remove one of the two.` | Not on a page yet |
| `${…} cannot load in the builtin tier: this Claude Code bundles a plugin of that name, and would load its copy` | Not on a page yet |
| `${…} case file(s) failed to load` | Not on a page yet |
| `${…} changed while being opened; try again` | Not on a page yet |
| `${…} changed while being read (vetted at ${…} bytes, read ${…}); try again` | Not on a page yet |
| `${…} content-types are not supported with ${…} client authentication` | Not on a page yet |
| `${…} could not be confirmed as a recognized Claude gateway host ${…}. Try again.` | Not on a page yet |
| `${…} could not be examined after being created; refusing to use it` | Not on a page yet |
| `${…} could not be opened` | Not on a page yet |
| `${…} could not be resolved within ${…} seconds. Try again.` | Not on a page yet |
| `${…} did not say what became of background command ${…}: it is not attached or did not answer in time, or it no longer reports on the command (it keeps the last 16 that ended, and its record goes with…` | Not on a page yet |
| `${…} directory name "${…}" contains a character that cannot be scoped safely in a permission rule (one of ( ) [ ] { } * ? ! # or a backslash) — rename it` | Not on a page yet |
| `${…} directory name "${…}" starts or ends with whitespace, which cannot be scoped safely in a permission rule — rename it` | Not on a page yet |
| `${…} does not support task creation (required for ${…})` | Not on a page yet |
| `${…} does not support task creation for elicitation/create (required for ${…})` | Not on a page yet |
| `${…} does not support task creation for sampling/createMessage (required for ${…})` | Not on a page yet |
| `${…} does not support task creation for tools/call (required for ${…})` | Not on a page yet |
| `${…} failed validation: ${…}` | Not on a page yet |
| `${…} has a bin folder outside its package` | Not on a page yet |
| `${…} has a bin link that points outside its package or has an invalid command name` | Not on a page yet |
| `${…} has a dependency that is not a registry package and version range: ${…}` | Not on a page yet |
| `${…} has a download link that ${…}` | Not on a page yet |
| `${…} has a name that is not an npm package name` | Not on a page yet |
| `${…} has an optional peer that is not a registry package: ${…}` | Not on a page yet |
| `${…} has an unreadable ${…} list` | Not on a page yet |
| `${…} has an unreadable integrity hash` | Not on a page yet |
| `${…} has an unreadable optionalPeers list` | Not on a page yet |
| `${…} has duplicate mount: ${…}` | Not on a page yet |
| `${…} has more than one scope:"user" entry` | Not on a page yet |
| `${…} has no exact version` | Not on a page yet |
| `${…} has no integrity hash for its download link` | Not on a page yet |
| `${…} has no parent directory` | Not on a page yet |
| `${…} has unreadable metadata` | Not on a page yet |
| `${…} instances for asymmetric algorithm decryption must be of type "private"` | Not on a page yet |
| `${…} instances for asymmetric algorithm encryption must be of type "public"` | Not on a page yet |
| `${…} instances for asymmetric algorithm signing must be of type "private"` | Not on a page yet |
| `${…} instances for asymmetric algorithm verifying must be of type "public"` | Not on a page yet |
| `${…} instances for asymmetric algorithms must not be of type "secret"` | Not on a page yet |
| `${…} instances for symmetric algorithms must be of type "secret"` | Not on a page yet |
| `${…} invalid: ${…}` | Not on a page yet |
| `${…} invalid: expected a mapping of desktop keys` | Not on a page yet |
| `${…} is ${…} bytes (cap: ${…})` | Not on a page yet |
| `${…} is a directory, not a file` | Not on a page yet |
| `${…} is a folder link or a bundled copy` | Not on a page yet |
| `${…} is a symlink (or its path loops through symlinks); use a regular file at a plain path` | Not on a page yet |
| `${…} is built in and not declared in any settings scope. Omit --scope to turn it off.${…}` | Not on a page yet |
| `${…} is hard-linked elsewhere (${…} links); use a plain copy` | Not on a page yet |
| `${…} is in a private, link-local, or cloud-metadata range` | Not on a page yet |
| ``${…} is installed by running a command on this machine (`${…}`) that has not been reviewed yet, so it was not run. Review and accept it from its /plugin details pane, or in a terminal: ${…}.`` | Not on a page yet |
| `${…} is no longer the directory this run created — something else is writing into ${…}` | Not on a page yet |
| `${…} is not a directory` | Not on a page yet |
| `${…} is not a package in node_modules` | Not on a page yet |
| `${…} is not a package path` | Not on a page yet |
| `${…} is not a registry package` | Not on a page yet |
| `${…} is not a registry package at an exact version` | Not on a page yet |
| `${…} is not a regular file` | Not on a page yet |
| `${…} is not a regular file (or exceeds 1MiB); refusing read-modify-write` | Not on a page yet |
| `${…} is not a string, or an element/document/fragment node.` | Not on a page yet |
| `${…} is not a value in ${…}` | Not on a page yet |
| `${…} is not an object` | Not on a page yet |
| `${…} is not found when adding ${…} middleware ${…} ${…}` | Not on a page yet |
| `${…} is not supported` | Not on a page yet |
| `${…} is not supported as a default browser` | Not on a page yet |
| `${…} is not yet supported with the orchestrator subcommand (only worker runners mint Proxy-Authorization for their egress proxy today). Unset it for the orchestrator process; the runners it spawns can…` | Not on a page yet |
| `${…} is on a network (UNC) path, which cannot be scoped — run the evaluation from a local checkout` | Not on a page yet |
| `${…} is on the declared network ${…}, which Claude Code checks over a direct connection, not through an HTTP proxy. Add ${…} to NO_PROXY and try again.` | Not on a page yet |
| `${…} is one of ${…}'s own MCP tools; the session runs it on that machine and it cannot run here.` | Not on a page yet |
| `${…} is required but not provided` | Not on a page yet |
| `${…} is too large (or, if negative, too small) to represent as an Int64` | Not on a page yet |
| `${…} is too long (over 64 KB).` | Not on a page yet |
| `${…} is unavailable. No underlying credential could be used. To troubleshoot, visit https://aka.ms/azsdk/js/identity/environmentcredential/troubleshoot.` | Not on a page yet |
| `${…} it is outside the plugin's folder (${…})` | Not on a page yet |
| `${…} keys cannot be imported as CryptoKey instances` | Not on a page yet |
| `${…} may only contain letters, digits, hyphens, and underscores — it is interpolated into the claude.googleapis.com request path, so URL metacharacters in its value would rewrite the project/workspace…` | Not on a page yet |
| `${…} missing or invalid` | Not on a page yet |
| `${…} must be a non-negative number of minutes (0 disables, max ${…}), got: ${…}` | Not on a page yet |
| `${…} must be a non-negative number of seconds (max 86400), got: ${…}` | Not on a page yet |
| `${…} must be a single line.` | Not on a page yet |
| `${…} must be a small JSON object` | Not on a page yet |
| `${…} must be an integer in [0, 65535], got: "${…}"` | Not on a page yet |
| `${…} must be between ${…} and ${…}, inclusive` | Not on a page yet |
| `${…} must be one of 1/true/yes/on or 0/false/no/off (got: ${…})` | Not on a page yet |
| `${…} must be true or false (or 1/0, yes/no, on/off).` | Not on a page yet |
| `${…} must have a value` | Not on a page yet |
| `${…} no longer holds what this run wrote — something else is writing into ${…}` | Not on a page yet |
| `${…} no such file under ${…}` | Not on a page yet |
| `${…} path must be absolute: ${…}` | Not on a page yet |
| `${…} requires "${…}"` | Not on a page yet |
| `${…} requires a file path (the marker your host writes to announce a graceful drain), got: ${…}` | Not on a page yet |
| `${…} requires key modulusLength to be 2048 bits or larger` | Not on a page yet |
| `${…} resolves to ${…}, which is in a private, link-local, or cloud-metadata range` | Not on a page yet |
| `${…} serializes to ${…} characters, over the ${…} limit; not sent` | Not on a page yet |
| `${…} setup-token creates a long-lived Claude.ai subscription token, which this machine's allowedProviders policy does not permit.` | Not on a page yet |
| `${…} setup-token creates a long-lived Claude.ai subscription token, which this policy does not permit.` | Not on a page yet |
| `${…} takes a function, ($, e, next)` | Not on a page yet |
| `${…} value must be ${…}` | Not on a page yet |
| `${…} vanished from ${…}/ while being read; try again` | Not on a page yet |
| `${…} was not run: its ${…} could not be read. Retrying won't help.` | Not on a page yet |
| `${…} was not written by this run (it served no mocks) — nothing there is to be adopted` | Not on a page yet |
| `${…} was not written by this run — something else is writing into ${…}` | Not on a page yet |
| `${…} without a plan_token: this batch includes paths that always require per-batch approval — use finalize_plan with writes (and deletes if needed), then pass the returned plan_token.` | Not on a page yet |
| `${…} — ${…} is unavailable (${…})${…}` | Not on a page yet |
| `${…} — Remote Control sessions are not started unwrapped; the worker retries once the launcher is fixed` | Not on a page yet |
| `${…} — the teammate is not started unwrapped; fix the launcher setting, then retry` | Not on a page yet |
| `${…}'s Client ${…} (keyed ${…}) drew nothing in ${…} ms (a dialog Client past its row budget draws nothing; the report says so)` | Not on a page yet |
| ``${…}'s marketplace changed the command that installs it, or how its output is used (now `${…}`), since it was accepted, so it was not run. Review and accept the new command: ${…}.`` | Not on a page yet |
| ``${…}'s marketplace entry changed while it was being installed (it now declares `${…}`, not the command that was shown), so nothing was run. Re-run the install/update to review the current command.`` | Not on a page yet |
| ``${…}'s marketplace entry now installs it by running a command on this machine (`${…}`) that has not been reviewed yet, so it was not run. Review and accept it: ${…}.`` | Not on a page yet |
| `${…}, if provided, must be a Buffer.` | Not on a page yet |
| `${…}. Available agents: ${…}` | Not on a page yet |
| `${…}. Nothing was sent.` | Not on a page yet |
| `${…}.op is not a write_db operation` | Not on a page yet |
| `${…}/ has ${…} .md entries (cap: ${…})` | Not on a page yet |
| `${…}/ has no result rows under ${…} - nothing to report${…}` | Not on a page yet |
| `${…}/ is a symbolic link whose target does not exist` | Not on a page yet |
| `${…}: "${…}" must be a real directory inside the case, not a symbolic link` | Not on a page yet |
| `${…}: "${…}" under a plugin or eval directory is not a valid UTF-8 name (or imitates one that is not) — rename or remove it` | Not on a page yet |
| `${…}: "${…}" under the eval directory is a symbolic link to a directory — case definitions must be plain files and directories` | Not on a page yet |
| `${…}: "${…}" under the eval directory is a symbolic link whose target cannot be resolved — remove it or point it at an existing file` | Not on a page yet |
| `${…}: "${…}" under the eval directory links to a file with ${…} names — case definitions must not be reachable by another name` | Not on a page yet |
| `${…}: $ is already built` | Not on a page yet |
| `${…}: $.${…} must be an object of methods, not ${…}` | Not on a page yet |
| `${…}: $.${…} refused: ${…}` | Not on a page yet |
| `${…}: $.${…} refused: a hooks module behind the call is not admitted (ops wait for the fold and plugin.register)` | Not on a page yet |
| `${…}: $.${…}.${…} is not a function; an interface is an object of methods (a value another plugin can call)` | Not on a page yet |
| `${…}: $.${…}.${…} is not callable from an engine.create step registered through on("*"); hook engine.create by name to compose nouns` | Not on a page yet |
| `${…}: $.${…}: its input is no object, which the hooks on it (${…}) take as e; pass one` | Not on a page yet |
| `${…}: $.${…}: the value is ${…} characters, over the ${…} limit` | Not on a page yet |
| `${…}: $.${…}: value is not JSON data (${…})` | Not on a page yet |
| `${…}: $.agent.spawn takes { prompt, ... } (a non-empty prompt)` | Not on a page yet |
| `${…}: $.audio.play: refused: ${…} plays are going at once` | Not on a page yet |
| `${…}: $.clock.${…} takes a function` | Not on a page yet |
| `${…}: $.clock.${…} takes a non-negative number of milliseconds` | Not on a page yet |
| `${…}: $.config.set: no /config row with key ${…} ($.config.list names them)` | Not on a page yet |
| `${…}: $.mcp.call(${…}, ${…}) refused: ${…}` | Not on a page yet |
| `${…}: $.model.classify takes two or more non-empty labels` | Not on a page yet |
| `${…}: $.model.classify: ${…}` | Not on a page yet |
| `${…}: $.model.classify: the model answered with no text` | Not on a page yet |
| `${…}: $.model.complete: ${…}` | Not on a page yet |
| `${…}: $.model.complete: effort must be one of low, medium, high, xhigh, max (got ${…})` | Not on a page yet |
| `${…}: $.model.complete: maxTokens ${…} is past what ${…} can produce in one reply (${…})` | Not on a page yet |
| `${…}: $.model.complete: maxTokens must be a positive integer (got ${…})` | Not on a page yet |
| `${…}: $.model.complete: model "${…}" is not in this organization's allowlist` | Not on a page yet |
| `${…}: $.model.complete: timeoutMs must be a positive integer of milliseconds (got ${…})` | Not on a page yet |
| `${…}: $.prompt.compose: ${…}` | Not on a page yet |
| `${…}: $.prompt.compose: this process composes no system prompt` | Not on a page yet |
| `${…}: $.session.append: this process keeps no conversation to append to` | Not on a page yet |
| `${…}: $.session.compact: ${…}` | Not on a page yet |
| `${…}: $.session.compact: a turn is running (${…}); the conversation compacts between turns, so call it from turn.complete or later` | Not on a page yet |
| `${…}: $.session.compact: compaction is switched off in this session (DISABLE_COMPACT), for /compact and plugins alike` | Not on a page yet |
| `${…}: $.state.${…} takes a reference { plugin, key } (and id for a family's member)` | Not on a page yet |
| `${…}: $.store.${…} failed: ${…}` | Not on a page yet |
| `${…}: $.store.${…} takes a non-empty string key` | Not on a page yet |
| `${…}: $.store.${…}: the key is ${…} characters, over the ${…} limit` | Not on a page yet |
| `${…}: $.store.set: the store would be ${…} characters, over the ${…} limit` | Not on a page yet |
| `${…}: $.tool.call takes the event's input: { tool, ...args }` | Not on a page yet |
| `${…}: $.tool.call(${…}) produced no result${…}` | Not on a page yet |
| ``${…}: $.tool.call: ${…} does not accept `consent` in this session. Call it without `consent`, and the normal permission check will decide.`` | Not on a page yet |
| `${…}: $.tool.call: consent, when given, is a string` | Not on a page yet |
| `${…}: $.tool.call: input must be an object` | Not on a page yet |
| `${…}: $.tool.check: input is the tool's arguments, an object` | Not on a page yet |
| `${…}: $.tool.check: no tool named "${…}" in this session` | Not on a page yet |
| `${…}: $.tool.register: "${…}" is a reserved MCP server name` | Not on a page yet |
| `${…}: $.tool.register: "${…}" refused: this session has no built-in tools (--tools ""), so it takes none from plugins` | Not on a page yet |
| `${…}: $.tool.register: "${…}" refused: this session runs with --bare, which takes tools from the plugins its command line names and from no built-in one` | Not on a page yet |
| `${…}: $.tool.register: the session already has an MCP server named "${…}" in its MCP config; registering would replace it` | Not on a page yet |
| `${…}: $.ui.ask takes at most ${…} options (got ${…})` | Not on a page yet |
| `${…}: $.ui.ask takes its options as a list` | Not on a page yet |
| `${…}: $.ui.ask takes the question first` | Not on a page yet |
| `${…}: $.ui.ask: no answer (${…})` | Not on a page yet |
| `${…}: $.ui.notify: the channel's write failed` | Not on a page yet |
| `${…}: $.ui.resolve ${…}` | Not on a page yet |
| `${…}: ${…} ${…}s of ${…} are drawn in this drawing; key each once` | Not on a page yet |
| `${…}: ${…} (host check)` | Not on a page yet |
| `${…}: ${…} exports no register(on, options) function` | Not on a page yet |
| `${…}: ${…} exports the name "then" (its own, or through an export *), which no entry module may: rename the export` | Not on a page yet |
| `${…}: ${…} failed: ${…}` | Not on a page yet |
| `${…}: ${…} is a network-reaching path (UNC / automount) — refusing it` | Not on a page yet |
| `${…}: ${…} is an automounter path (macOS /Network, or the bare /net root) — refusing it (a lookup there is a network request)` | Not on a page yet |
| `${…}: ${…} is an eval-directory link that points outside the plugin — remove it` | Not on a page yet |
| `${…}: ${…} is not a PEM ${…}` | Not on a page yet |
| `${…}: ${…} is not available in this mode: no session is bound in this process (the REPL has not mounted and no headless session is built); catch it and carry on` | Not on a page yet |
| `${…}: ${…} leads to an automounter map directory (/net, /net/<host>; macOS /Network, /home) — refusing it (naming anything in it asks the automounter or a host)` | Not on a page yet |
| `${…}: ${…} must be a non-negative integer, got ${…}` | Not on a page yet |
| `${…}: ${…} passes through a component that cannot be examined (unreadable, a link or junction whose target does not exist, or a symlink chain too long to follow) — refusing it (it could not be vetted)` | Not on a page yet |
| `${…}: ${…} passes through a symlink to a network-reaching path (or a dotted one that cannot be vetted) — refusing it` | Not on a page yet |
| `${…}: ${…} takes a function` | Not on a page yet |
| `${…}: ${…} was not linked` | Not on a page yet |
| `${…}: ${…} — send only this Artifact's own files` | Not on a page yet |
| `${…}: ${…}(${…})${…} aborted: no complete answer within ${…}ms` | Not on a page yet |
| `${…}: ${…}(${…})${…} failed: ${…}${…}` | Not on a page yet |
| `${…}: ${…}, which drew ${…}, is not loaded` | Not on a page yet |
| `${…}: ${…}. Nothing was published; tell the user.` | Not on a page yet |
| `${…}: ${…}. The subagent was not started — fix the schema and call agent() again.` | Not on a page yet |
| `${…}: ${…}: ${…} (host check)` | Not on a page yet |
| `${…}: ${…}: ${…} (keys: type, expect, error, tools, abort_when)` | Not on a page yet |
| `${…}: ${…}: ${…} refused: a request body of ${…} characters is over the ${…}-character limit` | Not on a page yet |
| `${…}: ${…}: ${…} refused: credentials in the URL` | Not on a page yet |
| `${…}: ${…}: ${…} refused: http or https only` | Not on a page yet |
| `${…}: ${…}: ${…} resolves outside the plugin's folder` | Not on a page yet |
| `${…}: ${…}: ${…}${…} refused: the body is not an event batch, so it cannot be redacted` | Not on a page yet |
| `${…}: ${…}: its environment was unloaded` | Not on a page yet |
| `${…}: ${…}: more than ${…} redirects from ${…}` | Not on a page yet |
| `${…}: ${…}: not a URL: ${…}` | Not on a page yet |
| `${…}: ${…}: not a loaded plugin` | Not on a page yet |
| `${…}: ${…}: not a native module; it runs in a hop` | Not on a page yet |
| `${…}: ${…}: not a regular file` | Not on a page yet |
| `${…}: ${…}: refused: ${…}` | Not on a page yet |
| `${…}: ${…}: socketPath ${…} refused: a NUL byte in the path` | Not on a page yet |
| `${…}: ${…}: socketPath ${…} refused: a network location is not reached from here` | Not on a page yet |
| `${…}: ${…}: socketPath ${…} refused: no Unix socket transport in this build` | Not on a page yet |
| `${…}: ${…}: socketPath ${…} refused: takes an absolute path` | Not on a page yet |
| `${…}: ${…}: the engine ran out of stack linking the file and its imports (code nested too deep, or a chain of imports too long): ${…}` | Not on a page yet |
| `${…}: ${…}: unknown auth handle; $.session.authorize() mints one` | Not on a page yet |
| `${…}: Access denied (403)${…}. Check your organization permissions.` | Not on a page yet |
| `${…}: Authentication failed (401)${…}. ${…}` | Not on a page yet |
| `${…}: Client ${…} has drawn nothing` | Not on a page yet |
| `${…}: Client ${…}: its export ${…} is not a function (props, surface) => tree` | Not on a page yet |
| `${…}: Client ${…}: post: the data ${…}; not sent` | Not on a page yet |
| `${…}: Client ${…}: the plugin loaded no surface module at that path (it loaded ${…})` | Not on a page yet |
| `${…}: HTTP ${…}` | Not on a page yet |
| `${…}: Multiple scopes are not supported.` | Not on a page yet |
| `${…}: Provide either a PEM certificate in string form, or the path to that certificate in the filesystem. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/trouble…` | Not on a page yet |
| `${…}: To avoid unexpected behaviors, providing both the contents of a PEM certificate and the path to a PEM certificate is forbidden. To troubleshoot, visit https://aka.ms/azsdk/js/identity/servicepri…` | Not on a page yet |
| `` ${…}: `abort_when:` needs `type: agent`; a fixed responder guards its input with `expect:` `` | Not on a page yet |
| ``${…}: `error:` applies to fixed responders only`` | Not on a page yet |
| ``${…}: `tools:` belongs in ${…} (a <tool>.md answers the tool it is named after)`` | Not on a page yet |
| `${…}: a baseline grader's baseline_file must be a relative path inside the suite or the plugin under test` | Not on a page yet |
| `${…}: a baseline grader's baseline_file must name a regular file` | Not on a page yet |
| `${…}: a baseline grader's reference file is hard-linked (has another name) — keep a single copy` | Not on a page yet |
| `${…}: a file in the plugin has more than one name (a hard link) — case definitions must not be reachable by another name; replace it with a copy` | Not on a page yet |
| `${…}: a git directory of the plugin registers more linked worktrees than can be screened` | Not on a page yet |
| `${…}: a hook on a streaming event returns its async generator; got ${…}` | Not on a page yet |
| `${…}: a hop member is not one of these handlers` | Not on a page yet |
| `${…}: a plugin listed by the case lies inside an eval suite or another fenced directory — move it out of the suite` | Not on a page yet |
| `${…}: a plugin, case or add_dirs path could not be resolved (${…}) — make it readable or remove it` | Not on a page yet |
| `${…}: a plugins entry names the case directory, its graders or mocks, or a directory covering them — a plugin shipped with a case must sit in its own subdirectory` | Not on a page yet |
| `${…}: a tool server doesn't run a marketplace's headersHelper on its own: the command was not run and the marketplace was not fetched.` | Not on a page yet |
| `${…}: a version-control directory or one of its pointers could not be resolved (${…}) — make it readable or remove it` | Not on a page yet |
| `${…}: a version-control store holds too many top-level entries to examine — refusing to run` | Not on a page yet |
| `${…}: an add_dir may only name fixture directories inside this case — not the case directory itself, its graders, a sibling case, an eval directory, or the plugin root` | Not on a page yet |
| `${…}: an add_dir must name a directory, not a file` | Not on a page yet |
| `${…}: an add_dirs entry points inside a directory that holds case definitions or version-control data of a plugin under test — point it at the fixtures themselves` | Not on a page yet |
| `${…}: an add_dirs entry points into version-control metadata — point it at the fixtures themselves` | Not on a page yet |
| `${…}: an agent responder needs a description of the server it plays as its body${…}` | Not on a page yet |
| `${…}: an engine.create hook has no budget and its failure fails the load; .catch does not apply` | Not on a page yet |
| `${…}: cannot list "${…}" under a plugin or eval directory — make it readable or remove it` | Not on a page yet |
| `${…}: cannot read ${…} (${…})` | Not on a page yet |
| `${…}: cannot tell what "${…}" under the eval directory is — make it readable or remove it` | Not on a page yet |
| `${…}: collection must be an odd-depth path of 1-15 segments and doc_id one segment, within the path byte cap, after permission or hook rewrites` | Not on a page yet |
| `${…}: cursor must be a non-empty string of at most ${…} characters` | Not on a page yet |
| `${…}: disappeared while loading` | Not on a page yet |
| `${…}: engine.create must return $ ({ ...await next(e), <noun>: { <event>() {} } }), not ${…}` | Not on a page yet |
| `${…}: engine.create returned $.${…} changed; it is this plugin's identity, not a noun` | Not on a page yet |
| `${…}: expected a saved tools/list response ({"tools": [{"name", "description", "inputSchema"}]})` | Not on a page yet |
| `${…}: file identity cannot be verified on this filesystem; use a local volume` | Not on a page yet |
| `${…}: frontmatter must be a YAML object` | Not on a page yet |
| `${…}: frontmatter must include "type:" (regex \| tool_order \| tool_used \| file_exists \| llm \| baseline)` | Not on a page yet |
| `${…}: hooks module not loaded; ${…} (policy/scan)` | Not on a page yet |
| `${…}: hooks module not loaded; next.to is available to managed plugins (prependPlugins / appendPlugins) only, and this plugin is ${…} (policy/scan)` | Not on a page yet |
| `${…}: hooks module not loaded; next.to("${…}") skips nothing from ${…}; a ${…} plugin may continue at ${…} (policy/scan)` | Not on a page yet |
| `${…}: hooks module not loaded; the name is the engine's own chain member (plugin.json name)` | Not on a page yet |
| `${…}: invalid YAML frontmatter: ${…}` | Not on a page yet |
| `${…}: is unavailable. Invalid file path provided ${…}.` | Not on a page yet |
| `${…}: is unavailable. No content on the file ${…}.` | Not on a page yet |
| `${…}: is unavailable. clientId is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_CLIENT_ID". See the troublesho…` | Not on a page yet |
| `${…}: is unavailable. federatedTokenFilePath is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_FEDERATED_TOKEN_…` | Not on a page yet |
| `${…}: is unavailable. tenantId is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_TENANT_ID". See the troublesho…` | Not on a page yet |
| `${…}: matcher${…} has the key ${…}, which a matcher does not keep` | Not on a page yet |
| `${…}: matcher${…} is a RegExp with a nested quantifier (${…}), which can backtrack without bound; rewrite it` | Not on a page yet |
| `${…}: matcher${…} is a RegExp with the ${…} flag, which keeps state between tests; drop it` | Not on a page yet |
| `${…}: matcher${…} is a string longer than ${…} characters, which cannot match` | Not on a page yet |
| `${…}: matcher${…} must be a string, a number, a boolean, null, a RegExp, an array of those, or a nested object; got ${…}` | Not on a page yet |
| `${…}: matcher${…} uses the reserved key ${…} (how a RegExp crosses the worker boundary); a RegExp goes in as a RegExp` | Not on a page yet |
| `${…}: needsBaseUrlFor is set but the arm has no baseUrl leaf` | Not on a page yet |
| `${…}: next() passed an argument with ${…}` | Not on a page yet |
| `${…}: next() takes the event's argument: next(e) passes it on, next({ ...e, x }) rewrites it` | Not on a page yet |
| `${…}: next.to is available to managed plugins (prependPlugins / appendPlugins) only, not to a ${…} hook` | Not on a page yet |
| `${…}: next.to names "${…}", which is not a tier a dispatch continues at (append, builtin, core)` | Not on a page yet |
| `${…}: next.to("${…}") refused: its hooks module does not spell ${…} in a literal the scan reads (host rule)` | Not on a page yet |
| `${…}: next.to("${…}") skips nothing from ${…}; a ${…} hook may continue at ${…}` | Not on a page yet |
| `${…}: next.to() names no tier` | Not on a page yet |
| `${…}: no ${…} handler` | Not on a page yet |
| `${…}: no ${…} of ${…} is drawn in this ${…} on the ${…} surface` | Not on a page yet |
| `${…}: no client instance ${…}` | Not on a page yet |
| `${…}: no such plugin folder` | Not on a page yet |
| `${…}: not a function` | Not on a page yet |
| `${…}: not a hooks module the binary carries; it loads in the plugin sandbox, not natively` | Not on a page yet |
| `${…}: not valid JSON (${…})` | Not on a page yet |
| `${…}: on("${…}") ${…}` | Not on a page yet |
| `${…}: on("${…}") after register() returned: on() is for register(); a hook may not register hooks` | Not on a page yet |
| `${…}: on("${…}") registered twice` | Not on a page yet |
| `${…}: on("${…}") takes (pattern, hook) or (pattern, matcher, hook); the hook must be a function` | Not on a page yet |
| `${…}: on(): ${…}` | Not on a page yet |
| `${…}: options.signal must be an AbortSignal` | Not on a page yet |
| ``${…}: path "${…}" escapes the ${…} (`..` or an absolute path) — it must name something inside it`` | Not on a page yet |
| `${…}: read_file saves only to local directories — out_dir names a network path or cannot be resolved` | Not on a page yet |
| `${…}: registered "${…}", which is not an event` | Not on a page yet |
| `${…}: registered ${…}` | Not on a page yet |
| `${…}: registered ${…}, but $.${…} (${…}) has no method ${…}` | Not on a page yet |
| `${…}: registered ${…}, but no loaded plugin provides $.${…}` | Not on a page yet |
| `${…}: registered ${…}, which is a call on core's $.${…} that is not an event` | Not on a page yet |
| `${…}: registered ${…}, which the scan of its hooks module did not see (host check)` | Not on a page yet |
| `${…}: registered on("${…}"), ${…}` | Not on a page yet |
| `${…}: returned ${…} it did not draw (${…}#${…}); a render hook may keep the ones next(e) returned, not address another plugin's` | Not on a page yet |
| `${…}: returned a ${…} in another plugin's hover scope that next(e) did not hand it; a render hook may keep the ones next(e) returned and restyle them, not join another plugin's group` | Not on a page yet |
| `${…}: returned a Client it did not draw (${…}/${…} ${…}); a render hook may keep the ones next(e) returned and change their props, not which plugin, key or module they name` | Not on a page yet |
| `${…}: returned a drawing that holds a Proxy; an element, its props and its hover are plain objects and arrays` | Not on a page yet |
| `${…}: returned a drawing that holds an object that is not plain data (a class instance); an element, its props and its hover are plain objects and arrays` | Not on a page yet |
| `${…}: returned a drawing with a function where plain data goes; a closure rides only in an element's onPress or onEvent` | Not on a page yet |
| `${…}: send_task_message` | Not on a page yet |
| `${…}: session_id is not a cloud session id` | Not on a page yet |
| `${…}: still holds the scaffolded placeholder — write the tool's canned answer as the body` | Not on a page yet |
| `${…}: still running — couldn't confirm restart, retry in a moment` | Not on a page yet |
| `${…}: store file ${…} is malformed (${…})` | Not on a page yet |
| `${…}: store file ${…} is malformed (the JSON is not an object)` | Not on a page yet |
| `${…}: store file ${…} is unreadable (${…})` | Not on a page yet |
| `${…}: surface module ${…} ${…}` | Not on a page yet |
| `${…}: tenantId and clientId are required parameters.` | Not on a page yet |
| `${…}: the ${…} surface draws no ${…}; ${…} reaches ${…}, so it is not an act on this surface` | Not on a page yet |
| `${…}: the case directory has more than one entry named "${…}" up to letter case — keep exactly one` | Not on a page yet |
| `` ${…}: the drawing holds ${…} Clients (${…}); name one with `in` `` | Not on a page yet |
| `${…}: the drawing holds no Client${…}` | Not on a page yet |
| `${…}: the eval directory holds more than ${…} entries — move large fixtures out of it` | Not on a page yet |
| `${…}: the interface table names core as the owner of $.${…}, which core does not provide` | Not on a page yet |
| `${…}: the matcher must be a plain object (a partial of e)` | Not on a page yet |
| `${…}: the on("${…}") hook returned no result` | Not on a page yet |
| `${…}: the repository layout keeps revealing further working trees — refusing to run` | Not on a page yet |
| `${…}: too many directories to examine for eval manifests — refusing to run` | Not on a page yet |
| `${…}: unknown frontmatter key "${…}" (expected one of: ${…})` | Not on a page yet |
| `${…}: unloaded while its module loaded` | Not on a page yet |
| `${…}: unloaded while its reload ${…} (${…}); not reloaded` | Not on a page yet |
| `${…}: unsupported edition` | Not on a page yet |
| `${…}: unsupported syntax "${…}"` | Not on a page yet |
| `${…}: unterminated frontmatter (opening "---" with no closing "---")` | Not on a page yet |
| `${…}: your organization's managed settings disable marketplace-declared commands (disableCommandPluginSources / allowManagedHooksOnly), ${…}` | Not on a page yet |
| `${…}Could not turn off ${…}: ${…} the commit the ${…} lists, and may still be enabled. The known_marketplaces.json entry named "${…}" was left in place: run this remove again once each plugin named he…` | Not on a page yet |
| `${…}data and file_path are not accepted with db_op "${…}"` | Not on a page yet |
| `'${…}' is already defined in Reference Record.` | Not on a page yet |
| `'${…}' is not a spec method; pass a result schema as the second argument to ctx.mcpReq.send().` | Not on a page yet |
| `'${…}' is not a spec method; pass a result schema as the second argument to request().` | Not on a page yet |
| `'${…}' is not a spec notification method; pass schemas as the second argument to setNotificationHandler().` | Not on a page yet |
| `'${…}' is not a spec request method; pass schemas as the second argument to setRequestHandler().` | Not on a page yet |
| `'${…}' is not a valid configuration option.` | Not on a page yet |
| `'${…}' not executable` | Not on a page yet |
| `'${…}': ${…} is not a string, function or reference.` | Not on a page yet |
| `'await using' declarations are not supported in workflow scripts.` | Not on a page yet |
| `'qs' is not a valid configuration option. Please use 'params' instead.` | Not on a page yet |
| `'requestPayload' is expected to be a string if provided. Got: ${…}` | Not on a page yet |
| `'with' statements are not supported in workflow scripts.` | Not on a page yet |
| `--agent-proxy-url requires your proxy's https:// URL` | Not on a page yet |
| `--base-dir (or SELF_HOSTED_RUNNER_BASE_DIR) is required on Windows: the built-in default is a POSIX container path that does not apply there. Pass the directory that repositories should be checked out…` | Not on a page yet |
| `--capacity must be a positive integer, got: ${…}` | Not on a page yet |
| `--checkout-hook-timeout-min must be a non-negative number of minutes (0 disables, max ${…}), got: ${…}` | Not on a page yet |
| `--config ${…}: "${…}" is not a boolean (use true/false, 1/0, yes/no, on/off)` | Not on a page yet |
| `--config ${…}: "${…}" is not a number` | Not on a page yet |
| `--config ${…}: value is empty. Omit the flag to leave "${…}" unset.` | Not on a page yet |
| `--config expects KEY=VALUE, got "${…}". Use --config key=value (repeatable).` | Not on a page yet |
| `--config key "${…}" is declared by more than one bundled MCP server; use ${…}.` | Not on a page yet |
| `--config key "${…}" isn't declared in this plugin's userConfig${…}${…}${…}` | Not on a page yet |
| `--config key "${…}" isn't declared in this plugin's userConfig.${…}` | Not on a page yet |
| `--config key "${…}" must name its server, because a bundled MCP server whose keys are unknown may declare it too; use ${…}.${…}` | Not on a page yet |
| `--config validation failed: ${…}` | Not on a page yet |
| `--config was given but plugin "${…}" declares no userConfig options${…}${…}` | Not on a page yet |
| ``--config was given but plugin "${…}" failed to load after install — run `claude plugin list` to see why.`` | Not on a page yet |
| `--configure-git requires git >= ${…}.${…} for SSH commit signing (found: ${…}). Upgrade git in your runner image, or omit --configure-git and manage git identity yourself` | Not on a page yet |
| `--configure-git: ${…} is still not a plain directory after repair — refusing to materialize session-scoped git artifacts` | Not on a page yet |
| `--configure-git: a governed session at capacity>1 needs both the hook stubs and the code-sign artifacts (hook stubs ${…}, session copy ${…}); the session was stopped rather than run with unsigned comm…` | Not on a page yet |
| `--configure-git: code-sign artifacts must be present to materialize ${…} (got ${…} stubs, ${…} signing artifacts)` | Not on a page yet |
| `--configure-git: could not inspect ${…} — ${…}` | Not on a page yet |
| `--configure-git: could not materialize session-scoped git artifacts under ${…} — ${…}` | Not on a page yet |
| `--configure-git: could not write the commit-signing settings into this session's git config (${…}): ${…}. The session was stopped rather than run with unsigned commits. Check that ${…} is writable and…` | Not on a page yet |
| `--confine-repo-settings requires one of enforce/warn/off (got: ${…})` | Not on a page yet |
| `--diff-finds-nested-repository requires --capacity 1. Turn the option off (the flag, or SELF_HOSTED_RUNNER_DIFF_FINDS_NESTED_REPOSITORY), or run every runner in this environment at --capacity 1. Why: …` | Not on a page yet |
| `--drain-grace-sec must be a non-negative number of seconds (0 = immediate, max ${…}), got: ${…}` | Not on a page yet |
| `--exec requires a command.` | Not on a page yet |
| `--exit-if-unused-min must be a non-negative number of minutes (0 disables, max ${…}), got: ${…}` | Not on a page yet |
| `--expected-spawn-seconds must be an integer in [10, 3600], got: ${…}` | Not on a page yet |
| `--git-host-rewrite expects bare hostnames (e.g. ext.example.com=int.example.com), not URLs. Got: ${…}` | Not on a page yet |
| `--git-host-rewrite requires <from>=<to>` | Not on a page yet |
| `--git-host-rewrite requires <from>=<to>, got: ${…}` | Not on a page yet |
| `--git-ssh-rewrite requires a hostname` | Not on a page yet |
| `--health-port must be an integer in [0, 65535] (0 disables), got: ${…}` | Not on a page yet |
| `--hook-concurrency must be an integer in [1, 100], got: ${…}` | Not on a page yet |
| `--hook-timeout (${…}s) + ${…}s SIGKILL grace must be less than --expected-spawn-seconds (${…}s) — otherwise an HA replica re-claims the lease while this hook is still running and both spawn a runner` | Not on a page yet |
| `--hook-timeout must be a positive number of seconds, got: ${…}` | Not on a page yet |
| `--hooks-dir is not supported on Windows: lifecycle hooks currently require a Linux or macOS host, because they are POSIX executables that the runner spawns directly (no shell, no .cmd/.ps1/.exe resolu…` | Not on a page yet |
| `--host-config-snapshot requires one of disk/memory (got: ${…})` | Not on a page yet |
| `--jq needs jq, which is not installed on this machine (not found on PATH): run the command without --jq and pipe the output to a JSON tool that is installed.` | Not on a page yet |
| `--kill-session-after-min must be a non-negative number of minutes (0 disables, max ${…}), got: ${…}` | Not on a page yet |
| `--messaging-socket-path ${…} is not a usable local socket address (a remote/UNC path, or a pipe name with extra segments or a trailing dot/space).` | Not on a page yet |
| `--messaging-socket-path directory ${…} does not exist and could not be created (${…}). ${…}` | Not on a page yet |
| `--messaging-socket-path directory ${…} is not owned by you (uid ${…}). ${…}` | Not on a page yet |
| `--messaging-socket-path directory ${…} is not private (mode ${…}); the socket directory must be mode 0700 so no other user or group can reach or replace the socket. ${…}` | Not on a page yet |
| `--messaging-socket-path directory ${…} vanished while being set up. ${…}` | Not on a page yet |
| `--messaging-socket-path directory could not be examined: ${…} (${…}). ${…}` | Not on a page yet |
| `--messaging-socket-path directory is not usable: ${…} (${…}). Fix the path or its permissions, or choose another path. ${…}` | Not on a page yet |
| `--messaging-socket-path directory must be a real directory, not a symlink: ${…}. ${…}` | Not on a page yet |
| `--messaging-socket-path is too long for a Unix socket (${…} bytes, max ${…}): ${…}. Choose a shorter path, e.g. under $XDG_RUNTIME_DIR or /tmp/<private-dir>.` | Not on a page yet |
| `--messaging-socket-path must be a local socket path, got: ${…}` | Not on a page yet |
| `--messaging-socket-path must name a socket file inside a directory, got: ${…}` | Not on a page yet |
| `--messaging-socket-path must not contain '..' segments, got: ${…}` | Not on a page yet |
| `--messaging-socket-path parent is not a directory: ${…}.` | Not on a page yet |
| `--messaging-socket-path points to a live socket: ${…}. Another process is listening there. Remove it or choose a different path.` | Not on a page yet |
| `--messaging-socket-path: ${…} ${…} owned by another user — refusing to create your sockets directory ${…} it. ${…}` | Not on a page yet |
| `--messaging-socket-path: ${…} appeared while your sockets directory was being created and is not a directory you own — refusing to use it. ${…}` | Not on a page yet |
| `--messaging-socket-path: bound ${…} but could not publish its auth key (${…}); peers could not authenticate, so the inbox was closed. Check that the session registry directory is writable by you.` | Not on a page yet |
| `--messaging-socket-path: cannot bind at ${…} (${…}): ${…}.` | Not on a page yet |
| `--messaging-socket-path: cannot inspect ${…} (${…}). ${…}` | Not on a page yet |
| `--min-idle must be an integer in [0, 200]` | Not on a page yet |
| `--post-session-hook-timeout-sec must be a positive number of seconds, got: ${…}` | Not on a page yet |
| `--proxy-authorization-command / --proxy-authorization-file must not be empty` | Not on a page yet |
| `--proxy-authorization-command / --proxy-authorization-file require HTTPS_PROXY (or HTTP_PROXY) to be set to the upstream proxy URL that the Proxy-Authorization value is for (ALL_PROXY alone is not con…` | Not on a page yet |
| `--proxy-authorization-command / --proxy-authorization-file requires a value` | Not on a page yet |
| `--proxy-authorization-command / --proxy-authorization-file support http:// and https:// upstream proxies only (check the scheme of HTTPS_PROXY / HTTP_PROXY)` | Not on a page yet |
| `--release-idle-session-min must be a non-negative number of minutes (0 disables, max ${…}), got: ${…}` | Not on a page yet |
| `--retire-at must be an absolute Unix timestamp in whole SECONDS (e.g. the output of 'date +%s' plus the runner's intended lifetime — not milliseconds, not a duration), got: ${…}` | Not on a page yet |
| `--scm-connector-ca-file requires a path` | Not on a page yet |
| `--scm-connector-host expects a bare hostname (e.g. ghe.example.com[:443]), not a URL` | Not on a page yet |
| `--scm-connector-host port must be an integer in [1, 65535]` | Not on a page yet |
| `--scm-connector-host requires HOST[:PORT]` | Not on a page yet |
| `--scm-connector-host-rewrite expects bare hostnames, not URLs` | Not on a page yet |
| `--scm-connector-host-rewrite requires <from>=<to_host:to_port>` | Not on a page yet |
| `--scm-connector-host: hostname is empty` | Not on a page yet |
| `--scm-connector-host: hostname must be a bare hostname or [v6] literal` | Not on a page yet |
| `--scm-connector-id / --scm-connector-provider / --scm-connector-ca-file / --scm-connector-host-rewrite require --scm-connector-host` | Not on a page yet |
| `--scm-connector-id is required when --scm-connector-host is set` | Not on a page yet |
| `--scm-connector-id must be a positive integer` | Not on a page yet |
| `--scm-connector-id requires an integer` | Not on a page yet |
| `--scm-connector-provider must match ^[a-z0-9-]{1,32}$` | Not on a page yet |
| `--scm-connector-provider requires a value` | Not on a page yet |
| `--server-auto-mode-lists requires one of all/no-allow/none (got: ${…})` | Not on a page yet |
| `--session-stop-grace-sec must be a positive number of seconds, got: ${…}` | Not on a page yet |
| `--session-tunnel: cannot reach the relay (${…}); dialing again` | Not on a page yet |
| `--shutdown-drain-sec must be a whole number of seconds from 0 to 3600 (0 turns the drain off)` | Not on a page yet |
| `--sigkill-timeout-sec was renamed to --session-stop-grace-sec. It controls how long to wait for the Claude process to exit cleanly after a session ends, before force-killing it. The post-session hook …` | Not on a page yet |
| `--startup-timeout-min must be a non-negative number of minutes (0 disables, max ${…}), got: ${…}` | Not on a page yet |
| `--use-anthropic-git-proxy: apiBaseUrl is not a valid URL: ${…}` | Not on a page yet |
| `.${…}() cannot be used on object schemas containing refinements` | Not on a page yet |
| `.mcp.json is malformed (not valid JSON, or mcpServers is not an object)` | Not on a page yet |
| `.merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.` | Not on a page yet |
| `.omit() cannot be used on object schemas containing refinements` | Not on a page yet |
| `.partial() cannot be used on tuple schemas containing refinements` | Not on a page yet |
| `.pick() cannot be used on object schemas containing refinements` | Not on a page yet |
| `<${…} url="${…}"/> ${…}. This session has dropped its link to that Artifact — do not pass its url to the Artifact tool again. ${…}; tell the user that link no longer works for them before you republis…` | Not on a page yet |
| `<Box> can't be nested inside <Text> component${…}` | Not on a page yet |
| `@ant/computer-use-input is not supported on this platform` | Not on a page yet |
| `@aws-sdk/core/protocols - (XML serializer) cannot write null value.` | Not on a page yet |
| `@aws-sdk/core/protocols - JsonReplacer already created.` | Not on a page yet |
| `@aws-sdk/core/protocols - JsonReplacer exhausted.` | Not on a page yet |
| `@aws-sdk/core/protocols - JsonReplacer not created yet.` | Not on a page yet |
| `@aws-sdk/core/protocols - QuerySerializer cannot flush with nothing written to buffer.` | Not on a page yet |
| `@aws-sdk/core/protocols - QuerySerializer unrecognized schema type ${…}` | Not on a page yet |
| `@aws-sdk/core/protocols - QuerySerializer unsupported document type ${…}` | Not on a page yet |
| `@aws-sdk/core/protocols - xml deserializer unhandled schema type for ${…}` | Not on a page yet |
| `@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.` | Not on a page yet |
| `@aws-sdk/core/protocols - xml serializer, cannot write non-member list: ${…}` | Not on a page yet |
| `@aws-sdk/core/protocols - xml serializer, cannot write non-member map: ${…}` | Not on a page yet |
| `@aws-sdk/core/protocols - xml serializer, cannot write struct with empty name or non-struct, schema=${…}.` | Not on a page yet |
| `@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${…}` | Not on a page yet |
| ``@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.`` | Not on a page yet |
| `@aws-sdk/credential-providers - createCredentialChain(...).expireAfter(ms) may not be called with a duration lower than five minutes.` | Not on a page yet |
| `@aws-sdk/util-endpoint - endpointProvider and endpoint missing in config for this client.` | Not on a page yet |
| `@smithy/core - HttpProtocol: eventStreamMarshaller missing in serdeContext.` | Not on a page yet |
| `@smithy/core/cbor: client may not serialize undefined value.` | Not on a page yet |
| `@smithy/core/event-streams - non-struct member not supported in event stream union.` | Not on a page yet |
| `@smithy/core/protocols - ${…} getDefaultContentType() implementation missing.` | Not on a page yet |
| `@smithy/core/protocols - received non-Date value ${…} when schema expected Date in ${…}` | Not on a page yet |
| `@smithy/core/schema - ${…} has no no member=${…}.` | Not on a page yet |
| `@smithy/core/schema - ${…} has no value member.` | Not on a page yet |
| `@smithy/core/schema - ${…} in input must be a string as hostLabel.` | Not on a page yet |
| `@smithy/core/schema - NormalizedSchema member init ${…} missing member name.` | Not on a page yet |
| `@smithy/core/schema - cannot get key for non-map: ${…}` | Not on a page yet |
| `@smithy/core/schema - cannot iterate non-struct schema.` | Not on a page yet |
| `@smithy/core/schema - may not init unwrapped member schema=${…}.` | Not on a page yet |
| `@smithy/core/schema - schema not found for ${…}` | Not on a page yet |
| `@smithy/core/serde - NumericValue must only contain [0-9], at most one decimal point ".", and an optional negation prefix "-".` | Not on a page yet |
| `@smithy/middleware-endpoint: (default endpointRuleSet) endpoint is not set - you must configure an endpoint.` | Not on a page yet |
| `@smithy/util-base64: toBase64 encoder function only accepts string \| Uint8Array.` | Not on a page yet |
| `@smithy/util-stream - invalid index ${…} given to flush()` | Not on a page yet |
| `@smithy/util-stream: unable to instantiate ChecksumStream because API unavailable: ReadableStream/TransformStream.` | Not on a page yet |
| `@smithy/util-stream: unsupported source type ${…} in ChecksumStream.` | Not on a page yet |
| `@smithy/util-utf8: toUtf8 encoder function only accepts string \| Uint8Array.` | Not on a page yet |
| `@smithy::core/protocols - initial-response event encountered in event stream but no response schema given.` | Not on a page yet |
| `A .gitignore here cannot be read` | Not on a page yet |
| `A .gitignore line cannot be read` | Not on a page yet |
| `A DEFAULT_3P_*_KEY points at a model config with bedrock: null — Bedrock setup has no fallback id for that tier` | Not on a page yet |
| `A ToolHost permission request with an unknown step reached the permission check.` | Not on a page yet |
| `A WorktreeCreate hook from your own Claude Code files ran, but this session doesn't let your own hooks choose the worktree folder (CLAUDE_CODE_RESTRICT_PERSONAL_CONFIG), so Claude Code didn't use any …` | Not on a page yet |
| `A background launch rule is already installed` | Not on a page yet |
| `A background launch rule needs background tasks disabled first` | Not on a page yet |
| `A background launch rule needs parameterDescription to be a string` | Not on a page yet |
| `A background launch rule that admits moves needs admitMove to be a function` | Not on a page yet |
| `A credential source or AWS security credentials supplier must be specified.` | Not on a page yet |
| `A credential source or subject token supplier must be specified.` | Not on a page yet |
| ``A discriminator value for key `${…}` could not be extracted from all schema options`` | Not on a page yet |
| `A diskless session can only load its config through a storage backend (none was handed in, or CLAUDE_CODE_HOVER_REST is off)` | Not on a page yet |
| `A diskless session moves no transcript between project folders on disk` | Not on a page yet |
| `A diskless session writes no side file to disk` | Not on a page yet |
| `A file path cannot be attached here: this tool cannot read files in this session.` | Not on a page yet |
| `A filesystem path entry must be a path, or { path, literal: true }; got ${…}` | Not on a page yet |
| `A goal proposal is already awaiting the user's decision. Keep working; if it is approved you will receive a kickoff message.` | Not on a page yet |
| `A key or a keyFile must be provided to getCredentials.` | Not on a page yet |
| `A link in the staged farm could not be read (${…}); refusing to relink it.` | Not on a page yet |
| `A link in the staged farm is not in canonical form; refusing to relink it.` | Not on a page yet |
| `A marketplace named "${…}" is already configured — remove it first: claude plugin marketplace remove ${…}` | Not on a page yet |
| `A marketplace named "${…}" was added meanwhile — run the command again to see it` | Not on a page yet |
| `A read earlier in this same turn recorded this artifact's newer live version but returned only ${…}, not its source, so nothing was published. ${…}` | Not on a page yet |
| `A request handler for ${…} already exists, which would be overridden` | Not on a page yet |
| `A shell tool was granted, but ${…}, so the Windows side could not be put out of the sandboxed shell's reach — the run was refused.` | Not on a page yet |
| `A stoppedByPerson question is already installed` | Not on a page yet |
| `A tool server doesn't run a plugin's command on its own. The plugin was not installed or updated and its command was not run.` | Not on a page yet |
| `A top-level entry of the plugin directory (${…}) points at a network location or through a link that cannot be trusted; refusing to link it.` | Not on a page yet |
| `A top-level entry of the plugin directory its command produced (${…}) points outside that directory; refusing to link it.` | Not on a page yet |
| `A top-level entry of the plugin directory its command produced could not be resolved (${…}); refusing to link it.` | Not on a page yet |
| `A withProject fork cannot re-identify the session — update the root session instead` | Not on a page yet |
| `A workflow v2 run cannot withhold its script` | Not on a page yet |
| `ANTHROPIC_API_KEY is set in this environment and takes precedence over a profile, so a profile sign-in would not be used. Unset it to sign in this way.` | Not on a page yet |
| `ANTHROPIC_API_KEY is set in this environment. Unset it to sign in without an API key.` | Not on a page yet |
| `ANTHROPIC_API_KEY, ANTHROPIC_AUTH_TOKEN, CLAUDE_CODE_OAUTH_TOKEN, or WIF env vars (ANTHROPIC_FEDERATION_RULE_ID + ANTHROPIC_ORGANIZATION_ID) required` | Not on a page yet |
| `ANTHROPIC_FOUNDRY_RESOURCE must be a Foundry resource name (2-64 letters, digits and hyphens, not starting or ending with a hyphen, such as my-resource), not a URL or host name. To use a full URL, set…` | Not on a page yet |
| `ANTHROPIC_PROFILE "${…}" is not a valid profile name (letters, digits, '_', '.', '-')` | Not on a page yet |
| `API Error: Request was aborted.` | Not on a page yet |
| `AWSQuery protocol has no payload codec.` | Not on a page yet |
| `Aborted — the command was not run.` | Not on a page yet |
| `Absolute URL for :path is not allowed in HTTP/2` | Not on a page yet |
| `Absolute path key: "${…}"` | Not on a page yet |
| `Abstract function; should be overriding in subclass.` | Not on a page yet |
| `Access denied to file: ${…}` | Not on a page yet |
| `Added line count did not match for hunk at line ${…}` | Not on a page yet |
| `Agent ${…} is already running or being resumed` | Not on a page yet |
| `Agent ${…} is still stopping — its previous run was stopped but has not exited. Re-run ${…} on it or wait for it to exit before resuming.` | Not on a page yet |
| `Agent aborted: auto mode classifier request refused by the safety safeguard in headless mode` | Not on a page yet |
| `Agent aborted: auto mode classifier transcript exceeded context window in headless mode` | Not on a page yet |
| `Agent aborted: too many classifier denials in headless mode` | Not on a page yet |
| `Agent stalled (stream watchdog)` | Not on a page yet |
| `Agent type '${…}' could not be loaded from its plugin, and ${…} runs on no other.` | Not on a page yet |
| `Agent type '${…}' is ambiguous — matches ${…}. ${…}` | Not on a page yet |
| `Agent type '${…}' not found. Available agents: ${…}` | Not on a page yet |
| `Already connected to a transport. Call close() before connecting to a new transport, or use a separate Protocol instance per connection.` | Not on a page yet |
| `Already in a worktree session` | Not on a page yet |
| `Ambiguous discriminator value "${…}"` | Not on a page yet |
| `An artifact's earlier versions are not available in this session.` | Not on a page yet |
| `AnySchema ${…} is loaded but ${…} cannot be resolved` | Not on a page yet |
| `AppStateProvider can not be nested within another AppStateProvider` | Not on a page yet |
| ``Applying `edits` changes the file at file_path, and an Edit permission check requires approval here: nothing was published and the file is unchanged. Retry the publish so it can be asked, or Edit the …`` | Not on a page yet |
| `Artifact ${…}: no arm for ${…} (routing table and handler disagree)` | Not on a page yet |
| `Artifact ${…}: version ${…} was read but saving it to disk failed` | Not on a page yet |
| `Artifact: this member needs the executor (call.runEngine)` | Not on a page yet |
| `Assertion failed: ${…} ${…}` | Not on a page yet |
| `Async refinement encountered during synchronous parse operation. Use .parseAsync instead.` | Not on a page yet |
| `Async schemas not supported in object keys currently` | Not on a page yet |
| `Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.` | Not on a page yet |
| `At least one access boundary rule needs to be defined.` | Not on a page yet |
| `At least one of certificateFile and caCertificateFile must be set` | Not on a page yet |
| `At least one of max, maxSize, or ttl is required` | Not on a page yet |
| `At least one permission should be defined in access boundary rules.` | Not on a page yet |
| `Attachment "${…}" is a network path (UNC or /net autofs), which is not supported.` | Not on a page yet |
| `Attempted to allocate an event message where size was not a number: ${…}` | Not on a page yet |
| `Attempted to update an already finished hash.` | Not on a page yet |
| `Attempted to use the IMDS endpoint, but it is not available.` | Not on a page yet |
| `Attempted to use the token exchange managed identity, but received a null response.` | Not on a page yet |
| `Attribute key exceeds the maximum length of ${…} characters: "${…}".` | Not on a page yet |
| `Attribute value exceeds the maximum length of ${…} characters for key "${…}".` | Not on a page yet |
| `Auth error: ${…}` | Not on a page yet |
| `Auth error: no credential usable for the metrics opt-out check` | Not on a page yet |
| `Authentication failed: invalid or missing API key` | Not on a page yet |
| `` Authorization callback contained neither `code` nor `error` `` | Not on a page yet |
| `Authorization callback failed and the issuer could not be verified` | Not on a page yet |
| `Auto-update can't be turned off for ${…}: its plugins follow the commit the Directory lists` | Not on a page yet |
| `Auto-update for '${…}' is set by ${…} and can't be changed here. Update that settings source (or ask your admin to) instead.` | Not on a page yet |
| `Azure AD token unavailable` | Not on a page yet |
| `Background tasks still running ${…} after the last turn (${…}); stopping them. Set CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0 to wait indefinitely.` | Not on a page yet |
| `BackgroundGesture: used before its screen bound a host` | Not on a page yet |
| `Backslash in path key: "${…}"` | Not on a page yet |
| `Base directory must be a string, received ${…}` | Not on a page yet |
| `Base64Coder: incorrect characters for decoding` | Not on a page yet |
| `Base64Coder: incorrect padding` | Not on a page yet |
| `Bearer token authentication is not permitted for non-TLS protected (non-https) URLs.` | Not on a page yet |
| `Body Length computation failed for ${…}` | Not on a page yet |
| ``Both `useDefaultCertificateConfig` and `certificateConfigLocation` cannot be provided.`` | Not on a page yet |
| `Both interceptors and interceptor_providers were passed as call options. Only one of these is allowed.` | Not on a page yet |
| `Both interceptors and interceptor_providers were passed as options to the client constructor. Only one of these is allowed.` | Not on a page yet |
| `BoundedStdioClientTransport: _readBuffer is no longer the BoundedReadBuffer — the SDK transport internals this subclass relies on have changed; re-verify the stdout bound.` | Not on a page yet |
| `BoundedStdioClientTransport: the SDK transport no longer keeps its child process on _process — the exit-time reaper for a still-connecting stdio server cannot arm; re-verify BoundedStdioClientTranspor…` | Not on a page yet |
| `Bridge registration failed: ${…}` | Not on a page yet |
| `Budget limit reached ($${…} of $${…}); stopping background agents.` | Not on a page yet |
| `Built-in plugin ${…} not found` | Not on a page yet |
| `CCRClient: Expected http(s) URL${…}` | Not on a page yet |
| `CCRClient: a page is no list of events` | Not on a page yet |
| `CLAUDE_CODE_CUSTOM_OAUTH_URL is not an approved endpoint.` | Not on a page yet |
| `CLAUDE_CODE_MAX_TURNS must be a positive integer; got "${…}"` | Not on a page yet |
| `CLAUDE_CODE_NO_MODEL_FALLBACK tripwire: a model-fallback pivot was attempted while the no-fallback guarantee is active. This branch should be unreachable — the availability chain must be built via bui…` | Not on a page yet |
| `CLAUDE_CODE_OAUTH_SCOPES is required when using CLAUDE_CODE_OAUTH_REFRESH_TOKEN. Set it to the space-separated scopes the refresh token was issued with (e.g. "user:inference" or "user:profile user:inf…` | Not on a page yet |
| `CLAUDE_CODE_USE_GATEWAY is set but ANTHROPIC_BASE_URL is invalid: ${…}` | Not on a page yet |
| `CLAUDE_CODE_USE_GATEWAY is set but the credential hand-off file is still locked by another process (an antivirus scan?), or this process is refused the file: check its permissions. Try again.` | Not on a page yet |
| `CLAUDE_CODE_USE_GATEWAY is set but the credential hand-off file is still locked by another process (an antivirus scan?). Try again.` | Not on a page yet |
| `CLAUDE_MEMORY_STORES is not valid JSON: ${…}` | Not on a page yet |
| `CLAUDE_STAGE_FILE_ROOT must be an absolute path` | Not on a page yet |
| `Call listen() first.` | Not on a page yet |
| `Callback required as last argument` | Not on a page yet |
| `Can not ${…} Array index ${…} as length is not sufficient` | Not on a page yet |
| `Can not add ${…} to parent of type ${…}` | Not on a page yet |
| `Can not delete in empty document` | Not on a page yet |
| `Can not rewrite read-only method '${…}'` | Not on a page yet |
| `Can't parse token envelope: ${…}` | Not on a page yet |
| `Can't parse token payload: ${…}` | Not on a page yet |
| `Can't read .mcp.json: it isn't a regular file or is larger than ${…} bytes. Fix or remove it, then run the command again.` | Not on a page yet |
| `Can't restart automatically. Type /restart at the prompt.` | Not on a page yet |
| `Can't send requests with id null since the response can't be correlated.` | Not on a page yet |
| `Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.` | Not on a page yet |
| `Can't use the marketplace name ${…}: the registered marketplace ${…} downloads from GitHub into the folder ${…}${…}, so a marketplace named ${…} would stop ${…} from downloading. Ask the author of ${……` | Not on a page yet |
| `Cancellation over SharedArrayBuffer doesn't support cancellation events` | Not on a page yet |
| `Cannot add MCP server "${…}": type "${…}" servers are registered by the host application at runtime, not stored in configuration` | Not on a page yet |
| `Cannot add MCP server "${…}": type "claudeai-proxy" is used only by claude.ai connectors — connect the service at claude.ai/customize/connectors, or add it with type "http"` | Not on a page yet |
| `Cannot add MCP server to scope: ${…}` | Not on a page yet |
| `Cannot add MCP server to scope: claudeai` | Not on a page yet |
| `Cannot add MCP server to scope: dynamic` | Not on a page yet |
| `Cannot add MCP server to scope: enterprise` | Not on a page yet |
| `Cannot add MCP server to scope: managed` | Not on a page yet |
| `Cannot add MCP server: enterprise MCP configuration is active and has exclusive control over MCP servers${…}` | Not on a page yet |
| `Cannot add MCP server: your organization's managed settings allow only MCP servers that plugins provide. Install a plugin that provides this server, or ask your administrator to make it available.` | Not on a page yet |
| `Cannot add an empty service to a server` | Not on a page yet |
| `Cannot add initializers after decoration has completed` | Not on a page yet |
| `Cannot add marketplace "${…}": Claude Code cannot install plugins from a marketplace with this name. Each part of a plugin id (plugin@marketplace) may use only the letters a-z and A-Z, digits, ".", "_…` | Not on a page yet |
| `Cannot add marketplace "${…}": Claude Code reserves this name and cannot register a marketplace under it. The name is set by "name" in the marketplace's marketplace.json; ask its maintainer to change …` | Not on a page yet |
| `Cannot add marketplace ${…}: names starting with "${…}" are reserved for marketplaces hosted on claude.ai (claude plugin marketplace add --claudeai <name>).` | Not on a page yet |
| `Cannot add marketplace ${…}: the name is reserved for the built-in ${…}.` | Not on a page yet |
| `Cannot add option '${…}'${…} due to conflicting flag '${…}' - already used by option '${…}'` | Not on a page yet |
| `Cannot compose insecure credentials` | Not on a page yet |
| `Cannot configure version negotiation after connecting to transport` | Not on a page yet |
| `Cannot connect to ${…} while allowInsecureConnection is false.` | Not on a page yet |
| `Cannot create call, subchannel not READY` | Not on a page yet |
| `Cannot create mTLS Agent with missing certificate or key` | Not on a page yet |
| `Cannot create view with no selector arguments supplied` | Not on a page yet |
| `Cannot decode unrecognized sequence ${…} as hexadecimal` | Not on a page yet |
| `Cannot delete paths outside the finalized plan: ${…}. Re-run finalize_plan with the full set.` | Not on a page yet |
| `Cannot delete permission rules from read-only settings` | Not on a page yet |
| `Cannot delete reserved paths: ${…}. CLAUDE.md and .claude/ carry instructions to the design agent and are blocked regardless of the plan.` | Not on a page yet |
| `Cannot drain port 0` | Not on a page yet |
| `Cannot edit file: old_string is a substring of a new_string from a previous edit.` | Not on a page yet |
| `Cannot enqueue task message: taskStore and taskMessageQueue are not configured` | Not on a page yet |
| `Cannot enter an existing worktree: the current directory is not in a git repository.` | Not on a page yet |
| `Cannot enter worktree: ${…} belongs to another running Claude Code session (locked: ${…}). Wait for that session to finish or choose a different worktree.` | Not on a page yet |
| `Cannot enter worktree: ${…} does not exist, so ${…} cannot be a worktree managed by Claude Code.` | Not on a page yet |
| `Cannot enter worktree: ${…} is a UNC network path.` | Not on a page yet |
| `Cannot enter worktree: ${…} is a network automount path.` | Not on a page yet |
| `Cannot enter worktree: ${…} is marked prunable by git (its directory or administrative files are missing or broken).` | Not on a page yet |
| `Cannot enter worktree: ${…} is not a linked worktree of ${…}.` | Not on a page yet |
| `Cannot enter worktree: ${…} is not a registered worktree of ${…}. Run 'git -C ${…} worktree list' to see registered worktrees.` | Not on a page yet |
| `Cannot enter worktree: ${…} is not under ${…}. Switching from this session is limited to worktrees managed by Claude Code (created under .claude/worktrees/ of this repository).` | Not on a page yet |
| `Cannot enter worktree: ${…} is the current working directory.` | Not on a page yet |
| `Cannot enter worktree: ${…} resolves to ${…}; the managed worktrees directory must not be a symlink.` | Not on a page yet |
| `Cannot enter worktree: ${…} resolves to a UNC network path (${…}).` | Not on a page yet |
| `Cannot enter worktree: ${…} resolves to a network automount path (${…}).` | Not on a page yet |
| `Cannot enter worktree: ${…}: ${…}` | Not on a page yet |
| `Cannot extract target principal from ${…}` | Not on a page yet |
| `Cannot fetch ID token in this environment, use GCE or set the GOOGLE_APPLICATION_CREDENTIALS environment variable to a service account credentials JSON file.` | Not on a page yet |
| `Cannot fetch marketplace ${…}: the directory it would use as its backup (${…}) is the registered marketplace ${…}'s directory. Remove or rename that marketplace first (claude plugin marketplace remove…` | Not on a page yet |
| `Cannot fetch this marketplace: its clone directory name ${…} is the registered marketplace ${…}'s directory. Remove or rename that marketplace first (claude plugin marketplace remove).` | Not on a page yet |
| `Cannot find ${…}, imported by ${…}` | Not on a page yet |
| `Cannot find Windows browser in stdout: ${…}` | Not on a page yet |
| `Cannot hash more than 2^53 - 1 bits` | Not on a page yet |
| `Cannot install ${…}: ${…}` | Not on a page yet |
| `Cannot install plugins to managed scope` | Not on a page yet |
| `Cannot load ${…} "${…}". Expected "true" or "false", got ${…}.` | Not on a page yet |
| `Cannot load ${…} '${…}'. Expected number, got '${…}'.` | Not on a page yet |
| `Cannot locate the Anthropic config directory. Set ANTHROPIC_CONFIG_DIR (or HOME) and try again.` | Not on a page yet |
| `Cannot mix number and bigint in multiple_of check.` | Not on a page yet |
| `Cannot modify protected Lambda context field: ${…}` | Not on a page yet |
| ``Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.`` | Not on a page yet |
| `Cannot read private member from an object whose class did not declare it` | Not on a page yet |
| `Cannot read so many bytes!` | Not on a page yet |
| `Cannot read this as an image: ${…} is a pipe or a device, not a regular file, and it sent more than ${…} without ending.` | Not on a page yet |
| `Cannot register capabilities after connecting to transport` | Not on a page yet |
| `Cannot register paths outside the finalized plan: ${…}. Re-run finalize_plan with the full set.` | Not on a page yet |
| `Cannot remove MCP server from scope: ${…}` | Not on a page yet |
| `Cannot resolve hostname from client config` | Not on a page yet |
| `Cannot run git under ${…}: its path contains "${…}", which git's discovery ceiling (a "${…}"-separated list) cannot express. Use a location without "${…}" for this directory (the plugins cache — CLAUD…` | Not on a page yet |
| `Cannot safely quote ${…} in a PowerShell single-quoted string literal: it contains U+${…}, which PowerShell's tokenizer treats as a quote delimiter` | Not on a page yet |
| `Cannot safely quote a Unicode single-quote variant (U+2018-U+201B) in a PowerShell path; install Windows Terminal (wt.exe).` | Not on a page yet |
| `Cannot satisfy policy dependencies due to requirements cycle.` | Not on a page yet |
| `Cannot search ${…}: the directory is not traversable (no execute permission).` | Not on a page yet |
| `Cannot self-heal orphaned worktree at ${…}: it could not be removed${…}. Remove manually to proceed.` | Not on a page yet |
| `Cannot send a response on a standalone SSE stream unless resuming a previous client request` | Not on a page yet |
| ``Cannot sign data without `client_email`.`` | Not on a page yet |
| ``Cannot specify both `message` and `error` params`` | Not on a page yet |
| `Cannot transform payload Blob to web stream. Please make sure the Blob.stream() is polyfilled. If you are using React Native, this API is not yet supported, see: https://react-native.canny.io/feature-…` | Not on a page yet |
| `Cannot transform payload to web stream, got ${…}` | Not on a page yet |
| `Cannot transition to auto mode: gate is not enabled` | Not on a page yet |
| `Cannot unbind port 0` | Not on a page yet |
| `Cannot unregister cards for paths outside the finalized plan's deletes: ${…}. Re-run finalize_plan with the full set.` | Not on a page yet |
| `Cannot use 'in' operator on non-object` | Not on a page yet |
| `Cannot use both a settings file path and the sandbox option. Include the sandbox configuration in your settings file instead.` | Not on a page yet |
| `Cannot use remoteEval on GrowthBook Cloud` | Not on a page yet |
| `Cannot use the MCP needs-auth cache file in a diskless session: only a storage backend can hold the cache` | Not on a page yet |
| `Cannot verify path containment (${…}): "${…}"` | Not on a page yet |
| `Cannot write paths outside the finalized plan: ${…}. Re-run finalize_plan with the full set.` | Not on a page yet |
| `Cannot write private member to an object whose class did not declare it` | Not on a page yet |
| `Cannot write reserved paths: ${…}. CLAUDE.md and .claude/ carry instructions to the design agent and are blocked regardless of the plan.` | Not on a page yet |
| `Cannot write to terminated process` | Not on a page yet |
| `Capacity must be greater than 0` | Not on a page yet |
| `Cell with ID "${…}" not found in notebook` | Not on a page yet |
| `Certificate chain must be given with accompanying private key` | Not on a page yet |
| `Certificate config file (${…}) is missing required "cert_path" or "key_path" in the workload config.` | Not on a page yet |
| `Channel credentials must be a ChannelCredentials object` | Not on a page yet |
| `Channel has been shut down` | Not on a page yet |
| `Channel options must be an object` | Not on a page yet |
| `Channel target must be a string` | Not on a page yet |
| `Channel#createCall: deadline must be a number or Date` | Not on a page yet |
| `Channel#createCall: method must be a string` | Not on a page yet |
| `Checksum mismatch: expected ${…}, got ${…} (compressed)` | Not on a page yet |
| `Chrome extension disconnected mid-call` | Not on a page yet |
| `Circular reference detected in ${…}` | Not on a page yet |
| `Circular reference not resolved: ${…}` | Not on a page yet |
| `Class extends value ${…} is not a constructor or null` | Not on a page yet |
| `Claude Code cannot read the existing sign-in on this machine, so it will not overwrite it. Check the permissions on your Anthropic config directory, then try again.` | Not on a page yet |
| `Claude Code is shutting down; not starting this MCP server process` | Not on a page yet |
| `Claude Code's temporary directory ${…} could not be created: ${…}. Free space on that volume, or set CLAUDE_CODE_TMPDIR to a directory on another one, then try again.` | Not on a page yet |
| `Claude Code's working folder is your home folder, a folder that contains it, or Claude Code's config folder. The Windows sandbox doesn't start there, because sandboxed commands from other sessions cou…` | Not on a page yet |
| `Claude Design ${…} failed: HTTP ${…} ${…}` | Not on a page yet |
| `Claude Design ${…} was cancelled because a concurrent Claude Design call was interrupted mid-handshake (the first calls of a session share one initialize/discovery round-trip). Retry the operation.` | Not on a page yet |
| `Claude Design discovery failed: HTTP ${…}` | Not on a page yet |
| `Claude Design initialize failed: HTTP ${…}` | Not on a page yet |
| `Claude Design is only reachable from api.anthropic.com; the current OAuth base URL is not on the first-party allowlist.` | Not on a page yet |
| `Claude Design returned a text/event-stream response; this client only handles JSON.` | Not on a page yet |
| `Claude Design unavailable: ${…}` | Not on a page yet |
| `Claude in Chrome Native Host not supported on this platform` | Not on a page yet |
| `Claude in Chrome tool call aborted` | Not on a page yet |
| `Client does not support URL elicitation (required for ${…})` | Not on a page yet |
| `Client does not support URL elicitation (required for notifications/elicitation/complete)` | Not on a page yet |
| `Client does not support elicitation (required for ${…})` | Not on a page yet |
| `Client does not support elicitation capability (required for ${…})` | Not on a page yet |
| `Client does not support form elicitation.` | Not on a page yet |
| `Client does not support listing roots (required for ${…})` | Not on a page yet |
| `Client does not support roots capability (required for ${…})` | Not on a page yet |
| `Client does not support roots list changed notifications (required for ${…})` | Not on a page yet |
| `Client does not support sampling (required for ${…})` | Not on a page yet |
| `Client does not support sampling capability (required for ${…})` | Not on a page yet |
| `Client does not support sampling tools capability.` | Not on a page yet |
| `Client does not support tasks capability (required for ${…})` | Not on a page yet |
| `Client does not support url elicitation.` | Not on a page yet |
| `ClientAssertionCredential: clientAssertion is a required parameter.` | Not on a page yet |
| `ClientAssertionCredential: clientId is a required parameter.` | Not on a page yet |
| `ClientAssertionCredential: tenantId is a required parameter.` | Not on a page yet |
| `ClientSecretCredential: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.` | Not on a page yet |
| `ClientSecretCredential: clientSecret is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.` | Not on a page yet |
| `ClientSecretCredential: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.` | Not on a page yet |
| `Clipboard write did not round-trip.` | Not on a page yet |
| `Cloud gateway ${…} TLS certificate changed since you connected — run /login to verify and reconnect.` | Not on a page yet |
| `Cloud gateway ${…} is not trusted on this machine — run /login to reconnect.` | Not on a page yet |
| `Cloud gateway session expired — run /login to reconnect.` | Not on a page yet |
| `Cloud session ${…} has shown an unanswered MCP server question for more than ${…} min, and nothing on this machine can answer it, so this run stopped waiting for it. If that server needs to ask the us…` | Not on a page yet |
| `Cloud session ${…} is waiting for input that nothing on this machine can give (a permission prompt, a question, or some other dialog). If it is a permission prompt, make sure the cloud agent's allowed…` | Not on a page yet |
| `Cloud session ${…} timed out after ${…} min${…}` | Not on a page yet |
| `Cloud session ${…}: fetchSession failed ${…} times in a row (last error: ${…}). Bailing instead of polling to the 30-min timeout.` | Not on a page yet |
| `Cloud sessions are only available on the first-party Anthropic API provider.` | Not on a page yet |
| `Cloud sessions are unavailable in an evaluation run.` | Not on a page yet |
| `CodeGen: "else" body without "then" body` | Not on a page yet |
| `CodeGen: "else" without "if"` | Not on a page yet |
| `CodeGen: "return" should have one node` | Not on a page yet |
| `CodeGen: "try" without "catch" and "finally"` | Not on a page yet |
| `CodeGen: invalid export name: ${…}, use explicit $id name mapping` | Not on a page yet |
| `CodeGen: name "${…}" has no value` | Not on a page yet |
| `CodeGen: name must be a valid identifier` | Not on a page yet |
| `CodeGen: not in block "${…}"` | Not on a page yet |
| `CodeGen: not in self-balancing block` | Not on a page yet |
| `CodeGen: prefix "${…}" is not allowed in this scope` | Not on a page yet |
| `CodeGen: ref must be passed in value` | Not on a page yet |
| `CodeGen: wrong number of nodes: ${…} vs ${…} expected` | Not on a page yet |
| `Color should be defined as hex string` | Not on a page yet |
| `Command '${…}' not found or is in an unsafe location (current directory)` | Not on a page yet |
| `Command alias can't be the same as its name` | Not on a page yet |
| `Command passed to .addCommand() must have a name - specify the name in Command constructor or using .name()` | Not on a page yet |
| `Compact JWE must be a string or Uint8Array` | Not on a page yet |
| `Compact JWS must be a string or Uint8Array` | Not on a page yet |
| `Compaction canceled.` | Not on a page yet |
| `Compaction failed · attached media exceeds size limits` | Not on a page yet |
| `Compaction failed · conversation could not be reduced below the context limit` | Not on a page yet |
| `Compaction unavailable: CLAUDE_CODE_NO_MODEL_FALLBACK is set and model substitution is disabled · unset it to allow the swap` | Not on a page yet |
| `Compaction unavailable: the only model allowed after this refusal has a smaller context window · retry, or /model to change models` | Not on a page yet |
| `Compaction unavailable: your model policy only allows ${…}, which requires usage credits · /model to set it up` | Not on a page yet |
| `ComposerChrome: used before its screen bound a host` | Not on a page yet |
| `Computer use is not available in a session without a disk.` | Not on a page yet |
| `ComputerUseSession.reset() called while the lock cleanup, Esc hotkey, or run-loop pump is still registered` | Not on a page yet |
| `Concurrency Limit reached` | Not on a page yet |
| `Conditional schemas (if/then/else) are not supported` | Not on a page yet |
| `Config accessed before allowed.` | Not on a page yet |
| `Config fallback write through storage failed` | Not on a page yet |
| `Config update through storage failed` | Not on a page yet |
| `Configuration error in ${…}: ${…}` | Not on a page yet |
| `Configuration: Could not parse user-provided export URL: '${…}'` | Not on a page yet |
| `Configuration: timeoutMillis is invalid, expected number greater than 0 (actual: '${…}')` | Not on a page yet |
| `Configured auth server metadata at ${…} is not valid JSON` | Not on a page yet |
| `Connection failed` | Not on a page yet |
| `ConsentRow may only be constructed by the consentRows factories` | Not on a page yet |
| `Conversation too long to branch through storage` | Not on a page yet |
| `Copy it back to ${…}, or reinstall with: npm i -g ${…}` | Not on a page yet |
| `Could not ${…} ${…} ${…}: a link sits at its archive path and could not be removed; remove that link from the plugin cache, then retry the install.` | Not on a page yet |
| `Could not ${…} ${…} ${…}: a link sits at its cache path and could not be removed; remove that link from the plugin cache, then retry the install.` | Not on a page yet |
| `Could not archive ${…} ${…}: its staged tree was replaced before archiving; retry the load or the install.` | Not on a page yet |
| `Could not confirm the Artifact at ${…} (${…}). ${…}` | Not on a page yet |
| `Could not connect to ${…}. Please check your internet connection and verify the URL is correct. Technical details: ${…}` | Not on a page yet |
| `Could not correct remote.origin.url in ${…}/config after ${…} tries over about six seconds (${…}). The clone was left as it is; if that error says "could not lock config file" and "File exists", and n…` | Not on a page yet |
| `Could not determine current tmux pane/window` | Not on a page yet |
| `Could not determine pane count for current window` | Not on a page yet |
| `Could not determine pane count for swarm window` | Not on a page yet |
| `Could not determine repository directory for: ${…}` | Not on a page yet |
| `Could not empty ${…}: the storage layer refused the version folder (${…}); check that plugin cache folder — nothing was removed — and then retry the install or the update.` | Not on a page yet |
| `Could not find Claude Desktop config file in Windows. Make sure Claude Desktop is installed on Windows.` | Not on a page yet |
| `Could not find a default scheme for target name "${…}"` | Not on a page yet |
| `Could not find certificate configuration file. Searched override path, the "${…}" env var, and the gcloud path (${…}).` | Not on a page yet |
| `Could not get a default scheme for port "${…}"` | Not on a page yet |
| `Could not install - another process is currently installing Claude. Please try again in a moment.` | Not on a page yet |
| `Could not install dependencies for ${…} ${…}: its staged tree was replaced after the copy; retry the load or the install.` | Not on a page yet |
| `Could not link ${…} ${…}: another session is recorded as using the entry at its cache path; retry the load or the install.` | Not on a page yet |
| `Could not parse port "${…}"` | Not on a page yet |
| `Could not parse target name "${…}"` | Not on a page yet |
| `Could not prepare ${…} for its ${…} (it could not be examined: ${…}); retry the install.` | Not on a page yet |
| `Could not prepare ${…} for its ${…}: it is no longer a plain version directory under its marketplace and plugin directories inside the plugin cache (it was removed or replaced after the copy); retry t…` | Not on a page yet |
| `Could not prepare ${…} for its dependency install (the conversion marker could not be withdrawn); retry the install.` | Not on a page yet |
| `Could not prepare ${…} for its dependency install (this session could not be recorded as its user); retry the install.` | Not on a page yet |
| `Could not prepare the plugin cache folder of ${…}: the storage layer refused it (${…}); check that plugin cache folder — the plugin version was not cached — and then retry the install or the update.` | Not on a page yet |
| `Could not publish ${…} ${…} into the plugin cache (${…}); retry the load or the install.` | Not on a page yet |
| `Could not publish ${…} ${…}: a link sits at its cache path and could not be removed; remove that link from the plugin cache, then retry the install.` | Not on a page yet |
| `Could not publish ${…} ${…}: another session is recorded as using the entry at its cache path; retry the load or the install.` | Not on a page yet |
| `Could not publish ${…} ${…}: its staged tree was replaced before publishing; retry the load or the install.` | Not on a page yet |
| `Could not re-screen ${…} after its dependency install (the conversion marker could not be withdrawn); retry the install.` | Not on a page yet |
| `Could not read remote.origin.url from ${…}/config (${…}). The clone was left as it is: repair that file, or remove the clone when no session is using it; the next session will clone it again.` | Not on a page yet |
| `Could not refresh access token.` | Not on a page yet |
| ``Could not resolve a `Response` object`` | Not on a page yet |
| `Could not resolve authentication method. Expected one of apiKey, authToken, credentials, config, or profile to be set. Or for one of the "X-Api-Key" or "Authorization" headers to be explicitly omitted` | Not on a page yet |
| `Could not resolve gateway host ${…}.` | Not on a page yet |
| `Could not resolve gateway host ${…}. Connect to your organization's network and try again.` | Not on a page yet |
| `Could not resolve the configured HTTP proxy. Connect to your organization's network and try again.` | Not on a page yet |
| `Could not verify this checkout's git repository: ${…} has no .git entry that points back to it` | Not on a page yet |
| `Could not vouch for ${…} after its dependency install, and the conversion marker could not be withdrawn; retry the install.` | Not on a page yet |
| `Couldn't attach to ${…} — ${…}` | Not on a page yet |
| `Couldn't reach the ${…} (${…})${…}${…}` | Not on a page yet |
| `Couldn't read logs for ${…} — ${…}` | Not on a page yet |
| `Couldn't record Design consent (${…}).` | Not on a page yet |
| `Couldn't record the Design project write grant (${…}).` | Not on a page yet |
| `Couldn't respawn — ${…} is unavailable (${…})${…}` | Not on a page yet |
| `Couldn't revoke Design consent (${…}).` | Not on a page yet |
| `Couldn't save that choice to your Claude Code config, so you'll be asked again next time.` | Not on a page yet |
| `Couldn't tell whether ${…} is a flag or text here, so nothing was started. To start a background session put it first: claude --bg <prompt>` | Not on a page yet |
| `CryptoKey does not support this operation` | Not on a page yet |
| `CryptoKey does not support this operation, its usages must include ${…}.` | Not on a page yet |
| `CryptoKey instance expected` | Not on a page yet |
| ``Cycle detected: #/${…}/<root> Set the `cycles` parameter to `"ref"` to resolve cyclical schemas with defs.`` | Not on a page yet |
| `Cyclic object value` | Not on a page yet |
| `DER: BasicConstraints has extra members` | Not on a page yet |
| `DER: Extension is not { extnID, critical?, extnValue }` | Not on a page yet |
| `DER: [3] must wrap exactly one Extensions sequence` | Not on a page yet |
| `DER: bytes after BasicConstraints` | Not on a page yet |
| `DER: bytes after the Certificate` | Not on a page yet |
| `DER: duplicate basicConstraints extension` | Not on a page yet |
| `DER: element overruns its container` | Not on a page yet |
| `DER: empty INTEGER` | Not on a page yet |
| `DER: high-tag-number form is not supported` | Not on a page yet |
| `DER: negative pathLenConstraint` | Not on a page yet |
| `DER: non-minimal INTEGER` | Not on a page yet |
| `DER: non-minimal length encoding` | Not on a page yet |
| `DER: pathLenConstraint out of range` | Not on a page yet |
| `DER: truncated element header` | Not on a page yet |
| `DER: unexpected tag` | Not on a page yet |
| `DER: unsupported length encoding` | Not on a page yet |
| `Dangerous flag combination detected` | Not on a page yet |
| `Dangling symlink detected (target does not exist): "${…}"` | Not on a page yet |
| `Deadline is too far in the future` | Not on a page yet |
| `Decompressed plaintext exceeded the configured limit` | Not on a page yet |
| `Deep link cwd contains disallowed control characters` | Not on a page yet |
| `Deep link cwd contains invisible or bidirectional control characters` | Not on a page yet |
| `Deep link cwd exceeds ${…} characters (got ${…})` | Not on a page yet |
| `Deep link marketplace exceeds ${…} characters (got ${…})` | Not on a page yet |
| `Deep link query contains disallowed control characters` | Not on a page yet |
| `Deep link query exceeds ${…} characters (got ${…})` | Not on a page yet |
| `Deep-link launch unsupported: the claude binary path "${…}" contains a single quote, backslash, exclamation mark, dollar sign, or newline, which cannot be portably quoted for every login shell. Reinst…` | Not on a page yet |
| `DesignSync needs design-system authorization. ${…}` | Not on a page yet |
| `DeviceBridgeTransport start can only be called once.` | Not on a page yet |
| `Discriminator property ${…} has duplicate value ${…}` | Not on a page yet |
| `Display-only MCP tool invoked — it exists only for transcript rendering` | Not on a page yet |
| `Duplicate discriminator value "${…}"` | Not on a page yet |
| `Duplicate middleware name '${…}'` | Not on a page yet |
| `Duplicate policy names not allowed in pipeline` | Not on a page yet |
| `Duplicate schema id "${…}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.` | Not on a page yet |
| `Durable scheduled tasks are unavailable in a session started with --project-config-root` | Not on a page yet |
| `Dynamic catch values are not supported in JSON Schema` | Not on a page yet |
| `ECDH with the provided key is not allowed or not supported by your javascript runtime` | Not on a page yet |
| `ECONNREFUSED_SSRF: blocked loopback/metadata host via proxy` | Not on a page yet |
| `Edit: a call needs the message that issued it` | Not on a page yet |
| ``Either `useDefaultCertificateConfig` must be true or a `certificateConfigLocation` must be provided.`` | Not on a page yet |
| `Either provider.prepareTokenRequest() or authorizationCode is required` | Not on a page yet |
| `Empty value provided for input HTTP label: ${…}.` | Not on a page yet |
| `Encoder has to be a function.` | Not on a page yet |
| `Encountered unexpected JWE Encrypted Key` | Not on a page yet |
| `Encryption is not available for remoteEval` | Not on a page yet |
| `Endpoint URL must be a string, got ${…}` | Not on a page yet |
| `Endpoint origin does not match connection origin: ${…}` | Not on a page yet |
| `Endpoint resolution failed for: ${…}` | Not on a page yet |
| `Enter OAuth client secret:` | Not on a page yet |
| `EnterPlanMode tool cannot be used in agent contexts` | Not on a page yet |
| ``EnterWorktree from a session with a pinned working directory requires `path`.`` | Not on a page yet |
| `Entering ${…} would not give this agent write access there, so the switch was not made. ${…}` | Not on a page yet |
| `Environment variable ${…} mast be a number, got "${…}"` | Not on a page yet |
| `Epoch timestamps must be expressed as floating point numbers or their string representation` | Not on a page yet |
| `Epoch timestamps must be valid finite numbers.` | Not on a page yet |
| `Epoch timestamps must be valid, non-Infinite, non-NaN numerics` | Not on a page yet |
| `Error "${…}" occurred in serializing the payload - ${…}.` | Not on a page yet |
| `Error POSTing to endpoint (HTTP ${…}): ${…}` | Not on a page yet |
| `Error converting ${…} of ${…} of ${…} to BigInt` | Not on a page yet |
| `Error converting ${…} to IANA timezone ${…}` | Not on a page yet |
| `Error converting schema to JSON.` | Not on a page yet |
| `Error evaluating pattern ${…}, invalid RE2 syntax` | Not on a page yet |
| `Error: ${…}` | Not on a page yet |
| ``Error: ${…} cannot be evaluated where sessions load it: no session could load it now. ${…} Check the marketplace with `claude plugin marketplace list`, or pass ./<dir> to evaluate a directory.`` | Not on a page yet |
| `Error: ${…} has a recorded install path that ${…}; reinstall it, or pass ./<dir> to evaluate a directory.` | Not on a page yet |
| `Error: --concurrency must be a whole number from 1 to ${…}` | Not on a page yet |
| `Error: --console and --claudeai cannot be used together.` | Not on a page yet |
| `Error: --max-cost-usd must be a non-negative number` | Not on a page yet |
| `Error: --mocks must be record or off` | Not on a page yet |
| `Error: --no-publish and --publish-report are contradictory — pass at most one.` | Not on a page yet |
| `Error: --report requires a non-empty file path` | Not on a page yet |
| `Error: --resume-drops-turn requires --resume-session-at` | Not on a page yet |
| `Error: --resume-session-at requires --resume` | Not on a page yet |
| `Error: --rewind-files is a standalone operation and cannot be used with a prompt` | Not on a page yet |
| `Error: --rewind-files requires --resume` | Not on a page yet |
| `Error: --rewind-files requires a user message UUID, but ${…} is not a user message in this session` | Not on a page yet |
| `Error: --runs must be a positive integer` | Not on a page yet |
| `Error: --threshold must be between 0 and 1` | Not on a page yet |
| `Error: Another instance is currently performing an update` | Not on a page yet |
| `Error: Cannot update ${…} installation` | Not on a page yet |
| `Error: Failed to install native update` | Not on a page yet |
| `Error: Failed to install update` | Not on a page yet |
| `Error: Insufficient permissions to install update` | Not on a page yet |
| `Error: No messages returned from query` | Not on a page yet |
| `Error: Update failed because claude.exe is in use. Close other Claude Code sessions (including VS Code), then run claude update again, or run claude doctor.` | Not on a page yet |
| `Error: Update failed because the native binary for this platform was not downloaded. Run claude update again, or reinstall with: npm i -g ${…}` | Not on a page yet |
| `Error: When using --print, --output-format=stream-json requires --verbose` | Not on a page yet |
| ``Error: You must be logged in to use Remote Control. Remote Control is only available with claude.ai subscriptions. Run `claude auth login` to sign in with your claude.ai account.`` | Not on a page yet |
| `Error: sandbox required but unavailable: ${…} sandbox.failIfUnavailable is set — refusing to start without a working sandbox.` | Not on a page yet |
| `Error: the cloud session did not accept ${…}, so this attach was stopped rather than continue without it.` | Not on a page yet |
| `Eventstream payload must be a Readable stream.` | Not on a page yet |
| `Every address for gateway host ${…} must be inside its declared network ${…}, and it also resolves to ${…}. Publish only records inside ${…} for it.` | Not on a page yet |
| `Executable response is expired.` | Not on a page yet |
| `Executable response must contain a 'code' field when unsuccessful.` | Not on a page yet |
| `Executable response must contain a 'id_token' field when token_type=${…} or ${…}.` | Not on a page yet |
| `Executable response must contain a 'message' field when unsuccessful.` | Not on a page yet |
| `Executable response must contain a 'saml_response' field when token_type=${…}.` | Not on a page yet |
| `Executable response must contain a 'success' field.` | Not on a page yet |
| `Executable response must contain a 'token_type' field when successful and it must be one of ${…}, ${…}, or ${…}.` | Not on a page yet |
| `Executable response must contain a 'version' field.` | Not on a page yet |
| `Existing OAuth client information is required when exchanging an authorization code` | Not on a page yet |
| `ExitPlanMode approved but tool_result has no "## Approved Plan:" marker — remote may have hit the empty-plan or isAgent branch. Content preview: ${…}` | Not on a page yet |
| `Expected "${…}" type but received "${…}"` | Not on a page yet |
| `Expected ${…}-bit integer, got ${…}` | Not on a page yet |
| `Expected 32-bit float, got ${…}` | Not on a page yet |
| `Expected CompleteRequestPrompt, but got ${…}` | Not on a page yet |
| `Expected CompleteRequestResourceTemplate, but got ${…}` | Not on a page yet |
| `Expected WebsocketSignatureV4 signer, please check the client constructor.` | Not on a page yet |
| ``Expected `awsRegion` option to be passed to the client or the `AWS_REGION` environment variable to be present`` | Not on a page yet |
| ``Expected `concurrency` to be an integer from 1 and up or `Infinity`, got `${…}` (${…})`` | Not on a page yet |
| `` Expected `count` to be a `number`, got `${…}` `` | Not on a page yet |
| `` Expected `count` to be at least 0, got `${…}` `` | Not on a page yet |
| `` Expected `input` to be a `string`, got `${…}` `` | Not on a page yet |
| ``Expected `input` to be either an `Iterable` or `AsyncIterable`, got (${…})`` | Not on a page yet |
| `` Expected `options.indent` to be a `string`, got `${…}` `` | Not on a page yet |
| `` Expected `stdio` to be of type `string` or `Array`, got `${…}` `` | Not on a page yet |
| `` Expected a `target` `` | Not on a page yet |
| `Expected a function` | Not on a page yet |
| `Expected a non-null value` | Not on a page yet |
| `Expected a non-null value for ${…}` | Not on a page yet |
| `Expected a string, got ${…}` | Not on a page yet |
| `Expected boolean, got ${…}: ${…}` | Not on a page yet |
| `Expected http options but got ${…}` | Not on a page yet |
| `Expected integer, got ${…}: ${…}` | Not on a page yet |
| `Expected number, got ${…}: ${…}` | Not on a page yet |
| `Expected object, got ${…}: ${…}` | Not on a page yet |
| `Expected payload to be of type string or Buffer.` | Not on a page yet |
| `Expected real number, got implicit NaN` | Not on a page yet |
| `Expected request body to be a JSON object for post ${…}` | Not on a page yet |
| `Expected request body to be an object for post /v1/messages` | Not on a page yet |
| `Expected secret to be of type string` | Not on a page yet |
| `Expected string, got ${…}: ${…}` | Not on a page yet |
| ``Expected the `forceKillAfterTimeout` option to be a non-negative integer, got `${…}` (${…})`` | Not on a page yet |
| ``Expected the `timeout` option to be a non-negative integer, got `${…}` (${…})`` | Not on a page yet |
| `Expecting a valid host string in proxy settings, but found "${…}".` | Not on a page yet |
| `Expiration time too far in future: ${…}` | Not on a page yet |
| `ExplicitBucketHistogramAggregation should be created with explicit boundaries, if a single bucket histogram is required, please pass an empty array` | Not on a page yet |
| `Extension Header Parameter "${…}" is not recognized` | Not on a page yet |
| `External $ref is not supported, only local refs (#/...) are allowed` | Not on a page yet |
| `ExternalAccountClients should be initialized via: ExternalAccountClient.fromJSON(), directly via explicit constructors, eg. new AwsClient(options), new IdentityPoolClient(options), newPluggableAuthCli…` | Not on a page yet |
| `Extracted PDF page disappeared during read: ${…}` | Not on a page yet |
| `FORM_FIELDS: no meta for ${…}` | Not on a page yet |
| `Fail to set maxConcurrentStreams to ${…}when creating new session for ${…}` | Not on a page yet |
| `Failed to authorize` | Not on a page yet |
| `Failed to base64url decode the aad` | Not on a page yet |
| `Failed to base64url decode the apu` | Not on a page yet |
| `Failed to base64url decode the apv` | Not on a page yet |
| `Failed to base64url decode the ciphertext` | Not on a page yet |
| `Failed to base64url decode the encrypted_key` | Not on a page yet |
| `Failed to base64url decode the iv` | Not on a page yet |
| `Failed to base64url decode the p2s` | Not on a page yet |
| `Failed to base64url decode the payload` | Not on a page yet |
| `Failed to base64url decode the signature` | Not on a page yet |
| `Failed to base64url decode the tag` | Not on a page yet |
| `Failed to check for updates` | Not on a page yet |
| `Failed to clean up a leftover marketplace staging directory. Please manually delete the directory at ${…} and try again. Technical details: ${…}` | Not on a page yet |
| `Failed to clean up stale marketplace backup directory. Please manually delete the directory at ${…} and try again. Technical details: ${…}` | Not on a page yet |
| `Failed to compress plaintext` | Not on a page yet |
| `Failed to copy plugin ${…} to versioned cache: destination is empty after copy` | Not on a page yet |
| `Failed to create backup of Terminal.app preferences, bailing out` | Not on a page yet |
| `Failed to create bridge sockets after ${…} attempts` | Not on a page yet |
| `Failed to create iTerm2 split pane: ${…}` | Not on a page yet |
| `Failed to create swarm session: ${…}` | Not on a page yet |
| `Failed to create swarm-view window: ${…}` | Not on a page yet |
| `Failed to create workflow file ${…}: ${…}${…}` | Not on a page yet |
| `Failed to decode bytes as string: ${…}` | Not on a page yet |
| `Failed to decompress plaintext` | Not on a page yet |
| `Failed to decrypt` | Not on a page yet |
| `Failed to disable audio bell for any Terminal.app profile` | Not on a page yet |
| `Failed to download marketplace from ${…}: ${…}` | Not on a page yet |
| `Failed to enable Option as Meta key for any Terminal.app profile` | Not on a page yet |
| `Failed to enable Option as Meta key or disable audio bell for any Terminal.app profile` | Not on a page yet |
| `Failed to fetch Grove notice config: ${…}` | Not on a page yet |
| `Failed to fetch code sessions: HTTP ${…}` | Not on a page yet |
| `Failed to fetch environments: HTTP ${…}` | Not on a page yet |
| `Failed to fetch session events: HTTP ${…}` | Not on a page yet |
| `Failed to fetch session logs` | Not on a page yet |
| `Failed to finalize marketplace cache. Please manually delete the directory at ${…} if it exists and try again. Technical details: ${…}` | Not on a page yet |
| `Failed to get Grove settings: ${…}` | Not on a page yet |
| `Failed to get access token` | Not on a page yet |
| `Failed to get mux proxy server port` | Not on a page yet |
| ``Failed to import '@aws-sdk/credential-providers'. You can provide a custom `providerChainResolver` in the client options if your runtime does not have access to '@aws-sdk/credential-providers': `new A…`` | Not on a page yet |
| ``Failed to import '@aws-sdk/credential-providers'.You can provide a custom `providerChainResolver` in the client options if your runtime does not have access to '@aws-sdk/credential-providers': `new An…`` | Not on a page yet |
| `Failed to list extracted PDF pages: ${…} (${…})` | Not on a page yet |
| `Failed to list plugin cache dir: ${…}` | Not on a page yet |
| `Failed to list the staged plugin copy (${…}); retry the load or the install.` | Not on a page yet |
| `Failed to load marketplace: ${…}` | Not on a page yet |
| `Failed to mark Grove notice viewed: ${…}` | Not on a page yet |
| `Failed to parse certificate at index ${…} in trust chain file ${…}: ${…}` | Not on a page yet |
| `Failed to parse certificate config from ${…}: ${…}` | Not on a page yet |
| `Failed to parse refresh_on from body. refresh_on="${…}"` | Not on a page yet |
| `Failed to parse sed command: ${…}` | Not on a page yet |
| `Failed to parse session ID from split output: ${…}` | Not on a page yet |
| `Failed to parse timestamp: ${…}` | Not on a page yet |
| `Failed to parse token expiration from body. expires_in="${…}", expires_on="${…}"` | Not on a page yet |
| `Failed to percent-decode OTEL_RESOURCE_ATTRIBUTES entry "${…}": ${…}` | Not on a page yet |
| `Failed to persist gateway TLS pin${…}` | Not on a page yet |
| `Failed to persist gateway credential${…}` | Not on a page yet |
| `Failed to process certificate chain from ${…}: ${…}` | Not on a page yet |
| `Failed to read cached marketplace: ${…}` | Not on a page yet |
| `Failed to read cached marketplace: the backend returned no item for the key` | Not on a page yet |
| `Failed to read certificate config file at: ${…}` | Not on a page yet |
| `Failed to read certificate file at ${…}: ${…}` | Not on a page yet |
| `Failed to read default Terminal.app profile` | Not on a page yet |
| `Failed to read environment secret file ${…} (${…})` | Not on a page yet |
| `Failed to read extracted PDF page: ${…} (${…})` | Not on a page yet |
| `Failed to read private key file at ${…}: ${…}` | Not on a page yet |
| `Failed to read startup Terminal.app profile` | Not on a page yet |
| `Failed to refresh access token.` | Not on a page yet |
| `Failed to relaunch Claude Code: ${…}` | Not on a page yet |
| `Failed to retrieve a valid token` | Not on a page yet |
| `Failed to save marketplace configuration: ${…}` | Not on a page yet |
| `Failed to save sensitive config to secure storage for ${…}` | Not on a page yet |
| `Failed to send command to iTerm2 pane ${…}: ${…}` | Not on a page yet |
| `Failed to send command to pane ${…}: ${…}` | Not on a page yet |
| `Failed to serialize message: expected object with ${…} structure, got array instead` | Not on a page yet |
| `Failed to set API key secret: ${…}${…}` | Not on a page yet |
| `Failed to spawn runner${…}. Command: ${…}` | Not on a page yet |
| `Failed to start HTTP bridge process` | Not on a page yet |
| `Failed to start SOCKS bridge process` | Not on a page yet |
| `Failed to update Grove settings: ${…}` | Not on a page yet |
| `Failed to write marketplace catalog: ${…}` | Not on a page yet |
| `Failed to write marketplace manifest: ${…}` | Not on a page yet |
| `Failed to write the plan approval request to the lead's inbox — plan not submitted; try again` | Not on a page yet |
| `Fallback model cannot be the same as the main model. Please specify a different model for fallbackModel option.` | Not on a page yet |
| `Fetch did not complete within the ${…}s deadline` | Not on a page yet |
| `File content has changed since it was last read. This commonly happens when a linter or formatter run via Bash rewrites the file. Call Read on this file to refresh, then retry the edit.` | Not on a page yet |
| ``File has an image extension but its content is not a valid PNG/JPEG/GIF/WebP. Detected: ${…}. This usually means a download saved an error/login page instead of the image. Use `file "${…}"` to confirm…`` | Not on a page yet |
| `File has not been read yet. Read it first before writing to it.` | Not on a page yet |
| `File is covered by a Read deny rule in your permission settings and cannot be edited.` | Not on a page yet |
| `File is covered by a Read deny rule in your permission settings and cannot be written.` | Not on a page yet |
| `File is too large to read as an image (the limit is ${…}): ${…}. If it is an image, resize it or export a smaller copy, then read that.` | Not on a page yet |
| `File not found: ${…}` | Not on a page yet |
| `File not found: ${…}.` | Not on a page yet |
| `File upload is disabled by your organization's policy.` | Not on a page yet |
| `FileHistory: backup copy is incomplete` | Not on a page yet |
| `FileHistory: invalid backup file name` | Not on a page yet |
| `FileHistory: invalid session id` | Not on a page yet |
| `FileHistory: no usable next version` | Not on a page yet |
| `FileHistory: tracked path is not a regular file` | Not on a page yet |
| `FileStore requires O_NOFOLLOW support on this platform` | Not on a page yet |
| `Files API is unavailable on third-party providers (data-residency)` | Not on a page yet |
| `First argument must be a buffer` | Not on a page yet |
| `Flattened JWE must be an object` | Not on a page yet |
| `Flattened JWS must be an object` | Not on a page yet |
| `Flattened JWS must have either of the "protected" or "header" members` | Not on a page yet |
| `Forked dispatch requires forkDispatchHookExecutors` | Not on a page yet |
| `FormData instance required` | Not on a page yet |
| `Found invalid profile name "${…}"` | Not on a page yet |
| ``Function `${…}` can only be called once`` | Not on a page yet |
| `Function expected` | Not on a page yet |
| `GCP credentials check timed out` | Not on a page yet |
| `GIT_ALLOW_PROTOCOL may list only transport names made of letters, digits and "-"` | Not on a page yet |
| `Gateway URL must use https:// (got http://). Plain HTTP is only allowed for localhost during development.` | Not on a page yet |
| `Gateway hosts must be on your organization's private network; ${…} resolves to the public (or unrecognized) address ${…}${…}. ${…}` | Not on a page yet |
| `Gateway login would go through proxy ${…}, which is not on a private network. Add ${…} to NO_PROXY for a direct connection, or use a proxy on your organization's private network.` | Not on a page yet |
| `Generator is already executing.` | Not on a page yet |
| `Glob pattern ${…} does not lie beneath the anchor ${…}` | Not on a page yet |
| `Goal proposals need an interactive session to render the approval prompt; none is available here.` | Not on a page yet |
| `Google's library returned no Authorization header` | Not on a page yet |
| `Got multipart request body, but content-type header was not multipart: ${…}` | Not on a page yet |
| `Grove notice config answer has no boolean grove_enabled` | Not on a page yet |
| `Grove settings answer has no boolean or null grove_enabled` | Not on a page yet |
| `HTTP ${…} ${…} from ${…}` | Not on a page yet |
| `HTTP ${…} error while downloading marketplace from ${…}. The marketplace file may not exist at this URL. Technical details: ${…}` | Not on a page yet |
| `HTTP ${…} fetching configured auth server metadata from ${…}` | Not on a page yet |
| `HTTP ${…} trying to load ${…} metadata from ${…}` | Not on a page yet |
| `HTTP error: ${…}` | Not on a page yet |
| `Header '${…}' value '${…}' is not a string` | Not on a page yet |
| `Hex encoded strings must have an even number length` | Not on a page yet |
| `Hook "${…}" has shell: 'powershell' but no PowerShell executable (pwsh or powershell) was found on PATH. Install PowerShell, or remove "shell": "powershell" to use bash.` | Not on a page yet |
| `Hook "${…}" requires bash but Git Bash was not found. ${…}, or ${…}.` | Not on a page yet |
| `Hook from ${…} references ${…} in a shell-form command. The substituted value would be re-parsed by the shell. Use exec form instead — {"command": "<executable>", "args": ["${…}", ...]} — or read $CLA…` | Not on a page yet |
| `Hook input is over the size limit` | Not on a page yet |
| `Hook returned incorrect event name: expected '${…}' but got '${…}'. Full stdout: ${…}` | Not on a page yet |
| `Hooks file not found at ${…} for plugin ${…}. If the manifest declares hooks, the file must exist.` | Not on a page yet |
| `Hooks file read failed at ${…} for plugin ${…}: ${…}` | Not on a page yet |
| `Hunk at line ${…} contained invalid line ${…}` | Not on a page yet |
| `IDE client not available` | Not on a page yet |
| `ITermBackend not registered. Import ITermBackend.ts before using the registry.` | Not on a page yet |
| `` IdP claims missing required `sub` `` | Not on a page yet |
| `IdP refresh response had neither id_token nor access_token` | Not on a page yet |
| `Identifier '${…}' is reserved.` | Not on a page yet |
| `If a code_challenge_method is provided, code_challenge must be included.` | Not on a page yet |
| `If operationSpec.baseUrl is not specified, then the ServiceClient must have a endpoint string property that contains the base URL to use.` | Not on a page yet |
| `If this is a remote server, re-run with --transport http (or sse).` | Not on a page yet |
| `If this is an HTTP server, use: ${…} ${…}` | Not on a page yet |
| `If this is an SSE server, use: ${…} ${…}` | Not on a page yet |
| `Image file is empty (0 bytes)` | Not on a page yet |
| `Image file is empty: ${…}` | Not on a page yet |
| `Incompatible auth server: does not support code challenge method ${…}` | Not on a page yet |
| `Incompatible auth server: does not support dynamic client registration` | Not on a page yet |
| `Incompatible auth server: does not support response type ${…}` | Not on a page yet |
| `Incorrect 'index' type` | Not on a page yet |
| `Incorrect arguments passed` | Not on a page yet |
| `Incorrect padding on base64 string.` | Not on a page yet |
| `Index '${…}' in '${…}' not found in '${…}'` | Not on a page yet |
| `Ink instance not found - cannot pause rendering` | Not on a page yet |
| `Ink: this root is React’s (render() was called), so it can’t be drawn with Tree too` | Not on a page yet |
| `Ink: this root is drawn with Tree (tree() was called), so it can’t be React’s too` | Not on a page yet |
| `Input buffers must have the same length` | Not on a page yet |
| `Installed: ${…} Run 'claude daemon uninstall' to undo.` | Not on a page yet |
| `Int64 buffers must be exactly 8 bytes` | Not on a page yet |
| `Internal ZodObject error: invalid unknownKeys value.` | Not on a page yet |
| `Internal error: shell-safe args contain metacharacters: ${…}` | Not on a page yet |
| `Interrupted — finishing up…` | Not on a page yet |
| `Invalid ${…} header value${…}: ${…}.` | Not on a page yet |
| `Invalid ${…} input` | Not on a page yet |
| `Invalid ${…} listChanged options: ${…}` | Not on a page yet |
| `Invalid ${…} listChanged options: onChanged must be a function` | Not on a page yet |
| `Invalid ${…}: contains unsafe characters` | Not on a page yet |
| `Invalid ${…}: contains unsafe characters or exceeds ${…} characters` | Not on a page yet |
| `Invalid API key format. API key must contain only alphanumeric characters, dashes, and underscores.` | Not on a page yet |
| `Invalid ARN: ${…} was an invalid ARN.` | Not on a page yet |
| `Invalid Authorization header value${…}: ${…}.` | Not on a page yet |
| `Invalid Compact JWE` | Not on a page yet |
| `Invalid Compact JWS` | Not on a page yet |
| `Invalid Content Encryption Key length. Expected ${…} bits, got ${…} bits` | Not on a page yet |
| `Invalid DER signature` | Not on a page yet |
| `Invalid GitHub repository format: ${…}. Expected format: owner/repo` | Not on a page yet |
| `Invalid IP address or CIDR range: ${…}` | Not on a page yet |
| `Invalid ISO date string` | Not on a page yet |
| `Invalid Initialization Vector length` | Not on a page yet |
| `Invalid JSON in ${…}: ${…}` | Not on a page yet |
| `Invalid JSON in manifest.json: ${…}` | Not on a page yet |
| `Invalid JSON in transcript file: ${…}` | Not on a page yet |
| `Invalid JSON key file: ${…}` | Not on a page yet |
| `Invalid JSON-pointer: ${…}` | Not on a page yet |
| `Invalid OTEL_RESOURCE_ATTRIBUTES: empty attribute key in "${…}".` | Not on a page yet |
| `Invalid QR Code version` | Not on a page yet |
| `Invalid RFC-3339 date-time value` | Not on a page yet |
| `Invalid RFC-7231 date-time value` | Not on a page yet |
| `Invalid RFC3339 timestamp format ${…}` | Not on a page yet |
| `Invalid RFC7231 date-time value ${…}.` | Not on a page yet |
| `Invalid Signature Headers` | Not on a page yet |
| `Invalid Token or Protected Header formatting` | Not on a page yet |
| `Invalid URL` | Not on a page yet |
| `Invalid URL format: ${…}` | Not on a page yet |
| `Invalid URL protocol: must use http:// or https://, got ${…}` | Not on a page yet |
| `Invalid UUID hex length: ${…}` | Not on a page yet |
| `Invalid UUID received: ${…}` | Not on a page yet |
| `Invalid UUID version: "${…}"` | Not on a page yet |
| `Invalid X-Api-Key header value${…}: ${…}.` | Not on a page yet |
| `Invalid absolute URL` | Not on a page yet |
| `Invalid afterPhase name: ${…}` | Not on a page yet |
| `Invalid argument` | Not on a page yet |
| `Invalid array index: '${…}' in path: '${…}'` | Not on a page yet |
| `Invalid attribute definition` | Not on a page yet |
| `Invalid authorization URL: must use http:// or https:// scheme` | Not on a page yet |
| `Invalid base64 string.` | Not on a page yet |
| `Invalid branch name from cloud session: ${…}` | Not on a page yet |
| `Invalid buffer allocation state: call ${…} allocated ${…} > total allocated ${…}` | Not on a page yet |
| `Invalid buffer allocation state: call ${…} freed ${…} > allocated for call ${…}` | Not on a page yet |
| `Invalid buffer allocation state: call ${…} freed ${…} > total allocated ${…}` | Not on a page yet |
| `Invalid callback URL — no authorization code, or it belongs to a different sign-in attempt (state mismatch). The flow is still open; retry with the full redirect URL from this sign-in.` | Not on a page yet |
| `Invalid channel: ${…}. Use 'latest' or 'stable'` | Not on a page yet |
| `Invalid channel: ${…}. Use 'stable' or 'latest'` | Not on a page yet |
| `Invalid client, expected instance of ${…}` | Not on a page yet |
| `Invalid clockTolerance option type` | Not on a page yet |
| `Invalid code. Please make sure the full code was copied.` | Not on a page yet |
| `Invalid credential_source format "${…}"` | Not on a page yet |
| `Invalid cwd in deep link: UNC / network paths are not supported, got "${…}"` | Not on a page yet |
| `Invalid cwd in deep link: must be an absolute path, got "${…}"` | Not on a page yet |
| `Invalid cwd in deep link: parent-directory segments are not supported, got "${…}"` | Not on a page yet |
| `Invalid cwd in deep link: the path resolves through a network link, got "${…}"` | Not on a page yet |
| `Invalid data` | Not on a page yet |
| `Invalid day for ${…} in ${…}: ${…}` | Not on a page yet |
| `Invalid deep link URL: "${…}"` | Not on a page yet |
| `Invalid deep link: expected ${…}:// scheme, got "${…}"` | Not on a page yet |
| `Invalid deep link: install-plugin has a raw "#"; encode a marketplace ref as %23 (marketplace=owner/repo%23v1)` | Not on a page yet |
| `Invalid deep link: install-plugin requires a plugin parameter` | Not on a page yet |
| `Invalid discriminated union option at index "${…}"` | Not on a page yet |
| `Invalid element at key "${…}": expected a Zod schema` | Not on a page yet |
| `Invalid environment variable format: ${…}, environment variables should be added as: -e KEY1=value1 -e KEY2=value2` | Not on a page yet |
| `Invalid events response` | Not on a page yet |
| `Invalid format for OTEL_RESOURCE_ATTRIBUTES: "${…}". Expected format: key=value. The ',' and '=' characters must be percent-encoded in keys and values.` | Not on a page yet |
| `Invalid git URL: ${…} (it could not be read as a URL). Supported: ${…}` | Not on a page yet |
| `Invalid git URL: ${…} — "%00" in a git address means different things to different versions of git, so it is not allowed. Remove it.` | Not on a page yet |
| `Invalid git URL: ${…} — a backslash before the first "/" can make git connect to a different server than this address names. Remove it, or write it as %5C if it is part of a user name.` | Not on a page yet |
| `Invalid git URL: ${…} — a scheme URL must be spelled scheme://…` | Not on a page yet |
| `Invalid git URL: ${…} — control characters are not allowed` | Not on a page yet |
| `Invalid git URL: ${…} — git can read a square bracket (also written %5B or %5D) as marking a server name or where a local path starts, so it could connect to a different server or open a different fol…` | Not on a page yet |
| `Invalid git URL: an address written as user@host:path can't contain "://", because git then reads the text before "://" as a protocol name, as in https://. Remove the "://".` | Not on a page yet |
| `Invalid handlerType ${…}` | Not on a page yet |
| `Invalid header format: "${…}". Expected format: "Header-Name: value"` | Not on a page yet |
| `Invalid header: "${…}". Header name cannot be empty.` | Not on a page yet |
| `Invalid hex color: ${…}` | Not on a page yet |
| `Invalid hex string length` | Not on a page yet |
| `Invalid host header` | Not on a page yet |
| `Invalid input to extend: expected a plain object` | Not on a page yet |
| ``Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.`` | Not on a page yet |
| `Invalid input to safeExtend: expected a plain object` | Not on a page yet |
| `Invalid input type` | Not on a page yet |
| `Invalid issuer, expected one of [${…}], but got ${…}` | Not on a page yet |
| `Invalid key for this operation, its "alg" must be "${…}" when present` | Not on a page yet |
| `Invalid key for this operation, its "key_ops" must include "${…}" when present` | Not on a page yet |
| `Invalid key for this operation, its "use" must be "${…}" when present` | Not on a page yet |
| `Invalid key size for alg: ${…}` | Not on a page yet |
| `Invalid key type: ${…} for google.protobuf.Struct, expected string` | Not on a page yet |
| `Invalid list` | Not on a page yet |
| `Invalid loadBalancingConfig: load balancing policy name required` | Not on a page yet |
| `Invalid loadBalancingConfig: unexpected multiple keys ${…}` | Not on a page yet |
| `Invalid loadBalancingConfig: unexpected type ${…}` | Not on a page yet |
| `Invalid manifest: ${…}` | Not on a page yet |
| `Invalid marketplace config: ${…}` | Not on a page yet |
| `Invalid marketplace in deep link: ".", ".." and empty path segments are not allowed` | Not on a page yet |
| `Invalid marketplace in deep link: an Anthropic marketplace can't be pinned to a git ref` | Not on a page yet |
| `Invalid marketplace in deep link: expected a GitHub "owner/repo", an https:// URL, or a git SSH URL like git@host:owner/repo.git` | Not on a page yet |
| `Invalid marketplace in deep link: percent-encoded characters are not allowed in the source` | Not on a page yet |
| `Invalid marketplace in deep link: the git ref after "#" or "@" may only contain letters, digits, ".", "_", "-" and "/"` | Not on a page yet |
| `Invalid method config hedging policy: hedgingDelay must be a string consisting of a positive integer followed by s` | Not on a page yet |
| `Invalid method config hedging policy: maxAttempts must be an integer at least 2` | Not on a page yet |
| `Invalid method config hedging policy: nonFatalStatusCodes value must be a string or number` | Not on a page yet |
| `Invalid method config hedging policy: nonFatalStatusCodes value not a status code name` | Not on a page yet |
| `Invalid method config hedging policy: nonFatalStatusCodes value not in status code range` | Not on a page yet |
| `Invalid method config name: invalid method: expected type string, got ${…}` | Not on a page yet |
| `Invalid method config name: invalid service: expected type string, got ${…}` | Not on a page yet |
| `Invalid method config name: method set with empty or unset service` | Not on a page yet |
| `Invalid method config retry policy: backoffMultiplier must be a number greater than 0` | Not on a page yet |
| `Invalid method config retry policy: initialBackoff must be a string consisting of a positive integer or decimal followed by s` | Not on a page yet |
| `Invalid method config retry policy: maxAttempts must be an integer at least 2` | Not on a page yet |
| `Invalid method config retry policy: maxBackoff must be a string consisting of a positive integer or decimal followed by s` | Not on a page yet |
| `Invalid method config retry policy: retryableStatusCodes is required` | Not on a page yet |
| `Invalid method config retry policy: retryableStatusCodes must be non-empty` | Not on a page yet |
| `Invalid method config retry policy: retryableStatusCodes value must be a string or number` | Not on a page yet |
| `Invalid method config retry policy: retryableStatusCodes value not a status code name` | Not on a page yet |
| `Invalid method config retry policy: retryableStatusCodes value not in status code range` | Not on a page yet |
| `Invalid method config: invalid maxRequestBytes` | Not on a page yet |
| `Invalid method config: invalid name array` | Not on a page yet |
| `Invalid method config: invalid timeout` | Not on a page yet |
| `Invalid method config: invalid timeout.nanos` | Not on a page yet |
| `Invalid method config: invalid timeout.seconds` | Not on a page yet |
| `Invalid method config: invalid waitForReady` | Not on a page yet |
| `Invalid method config: retryPolicy and hedgingPolicy cannot both be specified` | Not on a page yet |
| `Invalid mode` | Not on a page yet |
| `Invalid mode: ${…}` | Not on a page yet |
| `Invalid month: ${…}` | Not on a page yet |
| `Invalid nanoid length: ${…}` | Not on a page yet |
| `Invalid number of delimiters (${…}) for splitEvery.` | Not on a page yet |
| `Invalid or unsupported "alg" (Algorithm) value` | Not on a page yet |
| `Invalid or unsupported "alg" (JWE Algorithm) header value` | Not on a page yet |
| `Invalid or unsupported JWK "alg" (Algorithm) Parameter value` | Not on a page yet |
| `Invalid or unsupported JWK "kty" (Key Type) Parameter value` | Not on a page yet |
| `Invalid or unsupported key format` | Not on a page yet |
| `Invalid parameter for "defaultsMode", expect ${…}, got ${…}` | Not on a page yet |
| `Invalid phase name: ${…}` | Not on a page yet |
| `Invalid plugin in deep link: expected a plugin name of ASCII letters, digits, ".", "_" and "-" (at most 100 characters)` | Not on a page yet |
| `Invalid pluginDelivery. Expected 'argv' or 'initialize'.` | Not on a page yet |
| `Invalid protocol version: '${…}' is not a number` | Not on a page yet |
| `Invalid queue entry type: ${…}` | Not on a page yet |
| `Invalid ref "${…}": cannot start with "-"` | Not on a page yet |
| `Invalid ref: ${…}` | Not on a page yet |
| `Invalid region in client config` | Not on a page yet |
| `Invalid repo in deep link: expected "owner/repo", got "${…}"` | Not on a page yet |
| `Invalid response format from plugin catalog` | Not on a page yet |
| `Invalid response from STS.assumeRole call with role ${…}` | Not on a page yet |
| `Invalid response from STS.assumeRoleWithWebIdentity call with role ${…}` | Not on a page yet |
| `Invalid response from metadata service: incorrect ${…} header. Expected '${…}', got ${…}` | Not on a page yet |
| `Invalid retryThrottling: maxTokens must be a number in (0, 1000]` | Not on a page yet |
| `Invalid retryThrottling: tokenRatio must be a number greater than 0` | Not on a page yet |
| `Invalid schema: ${…} ${…}` | Not on a page yet |
| `Invalid scope "${…}". Must be one of: ${…}` | Not on a page yet |
| `Invalid scope: ${…}. Must be one of: ${…}` | Not on a page yet |
| `Invalid service config choice: invalid clientHostname` | Not on a page yet |
| `Invalid service config choice: invalid clientLanguage` | Not on a page yet |
| `Invalid service config choice: invalid percentage` | Not on a page yet |
| `Invalid service config choice: missing service config` | Not on a page yet |
| `Invalid service config choice: unexpected field ${…}` | Not on a page yet |
| `Invalid service config list` | Not on a page yet |
| `Invalid service config: duplicate name ${…}/${…}` | Not on a page yet |
| `Invalid service config: invalid loadBalancingConfig` | Not on a page yet |
| `Invalid service config: invalid loadBalancingPolicy` | Not on a page yet |
| `Invalid session_id: contains unsafe characters` | Not on a page yet |
| `Invalid setting source: ${…}. Valid options are: ${…}` | Not on a page yet |
| `Invalid sha "${…}": must be a full commit hash (40 or 64 hex digits)` | Not on a page yet |
| `Invalid skill name ${…}: consecutive backslashes are not allowed — the permission-rule parser collapses escaped backslashes, so the rule would name a different skill. Rename the skill.` | Not on a page yet |
| `Invalid skill name ${…}: leading or trailing whitespace is not allowed — the Skill tool trims the invoked name, so a padded rule can never match. Remove the padding.` | Not on a page yet |
| `Invalid skill name ${…}: names may not end with an unpaired backslash.` | Not on a page yet |
| `Invalid skill name ${…}: parentheses, commas, and control characters are not allowed in skill names. Skill names match the skill's directory name (or 'plugin:skill' for plugin-qualified skills); renam…` | Not on a page yet |
| `Invalid skill name ${…}: skill names may not start with '/'. Skills are invoked as slash commands, but the skills option takes the skill's canonical name — the directory name, or 'plugin:skill'.` | Not on a page yet |
| `Invalid skill name ${…}: the name contains an unpaired surrogate, which cannot survive the UTF-8 encoding of the CLI invocation; no skill discovered from the filesystem can have such a name.` | Not on a page yet |
| `Invalid skill name ${…}: wildcard-suffix names are not allowed; list each skill by its exact name.` | Not on a page yet |
| `Invalid skill name '*': use skills: 'all' to enable every skill.` | Not on a page yet |
| `Invalid ssh git URL: the host must be a hostname or bracketed IPv6 literal (optionally :port), the user a plain name, and the URL may not carry ? or # (${…})` | Not on a page yet |
| `Invalid state: unknown ConnectivityState ${…}` | Not on a page yet |
| `Invalid string. Length must be a multiple of 4` | Not on a page yet |
| `Invalid target ${…}` | Not on a page yet |
| `Invalid target branch: ${…}` | Not on a page yet |
| `Invalid template literal part, no pattern found: ${…}` | Not on a page yet |
| `Invalid template literal part: ${…}` | Not on a page yet |
| `Invalid time period format` | Not on a page yet |
| `Invalid token signature: ${…}` | Not on a page yet |
| `Invalid transport type: ${…}. Must be one of: stdio, sse, http (or streamable-http)` | Not on a page yet |
| `Invalid value for ${…}: ${…}.` | Not on a page yet |
| `Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${…} instead` | Not on a page yet |
| `Invalid version string "${…}": contains path-unsafe characters` | Not on a page yet |
| `Invalid version string from ${…}: not a well-formed version (${…} characters)` | Not on a page yet |
| `Invalid version: ${…}` | Not on a page yet |
| `Invalid workflow script: ${…}` | Not on a page yet |
| `IssueSessionToken: response missing session_token` | Not on a page yet |
| ``It's not possible to provide `stdio` in combination with one of ${…}`` | Not on a page yet |
| `Iterator access denied!` | Not on a page yet |
| `JOSE Header "apu" (Agreement PartyUInfo) invalid` | Not on a page yet |
| `JOSE Header "apv" (Agreement PartyVInfo) invalid` | Not on a page yet |
| `JOSE Header "epk" (Ephemeral Public Key) missing or invalid` | Not on a page yet |
| `JOSE Header "iv" (Initialization Vector) missing or invalid` | Not on a page yet |
| `JOSE Header "p2c" (PBES2 Count) missing or invalid` | Not on a page yet |
| `JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds` | Not on a page yet |
| `JOSE Header "p2s" (PBES2 Salt) missing or invalid` | Not on a page yet |
| `JOSE Header "tag" (Authentication Tag) missing or invalid` | Not on a page yet |
| `JOSE Header missing` | Not on a page yet |
| `JSON Schema declares an unsupported dialect ("$schema": "${…}"). The default validator supports JSON Schema 2020-12 only; pass a pre-configured Ajv instance to AjvJsonSchemaValidator(ajv) to validate …` | Not on a page yet |
| `JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present` | Not on a page yet |
| `JSON Web Key for this operation must be a private JWK` | Not on a page yet |
| `JSON Web Key for this operation must be a public JWK` | Not on a page yet |
| `JSON form must be an array of strings` | Not on a page yet |
| `JSON outcome nested past MAX_DEPTH` | Not on a page yet |
| `JSON outcome number not representable` | Not on a page yet |
| `JSON schema for tool "${…}" must be an object, but got ${…}` | Not on a page yet |
| `JWE "alg" (Algorithm) Header Parameter missing or invalid` | Not on a page yet |
| `JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid` | Not on a page yet |
| `JWE "zip" (Compression Algorithm) Header MUST be integrity protected` | Not on a page yet |
| `JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.` | Not on a page yet |
| ``JWE "zip" (Compression Algorithm) Header Parameter is not supported by your javascript runtime. You need to use the `deflateRaw` encrypt option to provide Deflate Raw implementation.`` | Not on a page yet |
| ``JWE "zip" (Compression Algorithm) Header Parameter is not supported by your javascript runtime. You need to use the `inflateRaw` decrypt option to provide Inflate Raw implementation.`` | Not on a page yet |
| `JWE "zip" (Compression Algorithm) Header Parameter is not supported.` | Not on a page yet |
| `JWE "zip" (Compression Algorithm) Header Parameter requires the ${…} API.` | Not on a page yet |
| `JWE AAD incorrect type` | Not on a page yet |
| `JWE Authentication Tag incorrect type` | Not on a page yet |
| `JWE Authentication Tag missing` | Not on a page yet |
| `JWE Authentication Tag missing or incorrect type` | Not on a page yet |
| `JWE Ciphertext missing or incorrect type` | Not on a page yet |
| `JWE Encrypted Key incorrect type` | Not on a page yet |
| `JWE Encrypted Key missing` | Not on a page yet |
| `JWE Initialization Vector incorrect type` | Not on a page yet |
| `JWE Initialization Vector missing` | Not on a page yet |
| `JWE Initialization Vector missing or incorrect type` | Not on a page yet |
| `JWE Per-Recipient Unprotected Header incorrect type` | Not on a page yet |
| `JWE Protected Header incorrect type` | Not on a page yet |
| `JWE Protected Header is invalid` | Not on a page yet |
| `JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint` | Not on a page yet |
| `JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint` | Not on a page yet |
| `JWE Shared Unprotected Header incorrect type` | Not on a page yet |
| `JWK alg and alg option value mismatch` | Not on a page yet |
| `JWK must be an object` | Not on a page yet |
| `JWS "alg" (Algorithm) Header Parameter missing or invalid` | Not on a page yet |
| `JWS Payload missing` | Not on a page yet |
| `JWS Payload must be a string` | Not on a page yet |
| `JWS Payload must be a string or an Uint8Array instance` | Not on a page yet |
| `JWS Protected Header incorrect type` | Not on a page yet |
| `JWS Protected Header is invalid` | Not on a page yet |
| `JWS Protected and JWS Unprotected Header Parameter names must be disjoint` | Not on a page yet |
| `JWS Signature missing or incorrect type` | Not on a page yet |
| `JWS Unprotected Header incorrect type` | Not on a page yet |
| `JWT Claims Set MUST be an object` | Not on a page yet |
| `JWT Claims Set must be a top-level JSON object` | Not on a page yet |
| `JWTs MUST NOT use unencoded payload` | Not on a page yet |
| `Key ${…} not found in enum` | Not on a page yet |
| `Key escapes memory directory: "${…}"` | Not on a page yet |
| `Key escapes personal memory directory via symlink: "${…}"` | Not on a page yet |
| `Key escapes personal memory directory: "${…}"` | Not on a page yet |
| `Key escapes team memory directory via symlink: "${…}"` | Not on a page yet |
| `Key escapes team memory directory: "${…}"` | Not on a page yet |
| `Key is reserved: "${…}"` | Not on a page yet |
| `Key passes through a symlink: "${…}"` | Not on a page yet |
| `Key refused: this build has no account memory store` | Not on a page yet |
| `Key resolves into an excluded subtree (${…}/): "${…}"` | Not on a page yet |
| `Key targets an excluded personal-memory subtree: "${…}"` | Not on a page yet |
| `Keyword ${…} has invalid name` | Not on a page yet |
| `Keyword ${…} is already defined` | Not on a page yet |
| `LSP client not started` | Not on a page yet |
| `LSP server not initialized` | Not on a page yet |
| `LSP server process stdio not available` | Not on a page yet |
| `LSP server stopped during initialize` | Not on a page yet |
| `Leaf certificate exists in the trust chain but is not the first entry (found at index ${…}).` | Not on a page yet |
| `Line ${…}, column ${…} of the script body (counted after the meta statement, if any): this '/' could be read either as the start of a regular expression or as a division, so the script was not run. En…` | Not on a page yet |
| ``Line number must start from `1`.`` | Not on a page yet |
| `LinkedMap got modified during iteration.` | Not on a page yet |
| `Linux HTTP bridge socket does not exist: ${…}. The bridge process may have died. Try reinitializing the sandbox.` | Not on a page yet |
| `Linux SOCKS bridge socket does not exist: ${…}. The bridge process may have died. Try reinitializing the sandbox.` | Not on a page yet |
| `Linux bridge process died unexpectedly` | Not on a page yet |
| `Listener not defined for signal: ${…}` | Not on a page yet |
| `Listing ${…} type is blocked by the permission rule ${…}, which names that type by its link. Nothing was listed; tell the user.` | Not on a page yet |
| `Listing the ${…} type is blocked by the permission rule ${…}, which covers that type however ${…}. Nothing was listed; tell the user.` | Not on a page yet |
| `LocalFileJournal: journal append failed` | Not on a page yet |
| `LocalFileJournal: journal delete failed` | Not on a page yet |
| `LocalFileJournal: journal read cursor failed to advance` | Not on a page yet |
| `LocalFileJournal: journal stat failed` | Not on a page yet |
| `Login failed: ${…} ${…}` | Not on a page yet |
| `Login failed: ${…}${…} ${…}` | Not on a page yet |
| `Logout failed: ${…}` | Not on a page yet |
| `Lost connection to the cloud session after repeated retries — the session may still be running` | Not on a page yet |
| `MCP OAuth failed for ${…}: ${…}` | Not on a page yet |
| `MCP controls aren't available right now — the terminal is still starting up or is showing another view` | Not on a page yet |
| `MCP error text or config too long or too deeply encoded` | Not on a page yet |
| `MCP error text repeats too much of the config` | Not on a page yet |
| `MCP error text too long once decoded` | Not on a page yet |
| `MCP server "${…}" exists in multiple scopes:` | Not on a page yet |
| `MCP server "${…}" is blocked by managed policy` | Not on a page yet |
| `MCP server "${…}" is disabled — re-enable it via /mcp to use its tools` | Not on a page yet |
| `MCP server "${…}" not found` | Not on a page yet |
| `MCP server "${…}" task for tool "${…}" ${…}: ${…}` | Not on a page yet |
| `MCP skill builders not registered — loadSkillsDir.ts has not been evaluated yet` | Not on a page yet |
| `MCP tool and prompt schemas must describe objects (got type: ${…}). Wrap your schema in z.object({...}) or equivalent.` | Not on a page yet |
| `MCP tool call to server "${…}" was aborted: the account changed before re-authentication` | Not on a page yet |
| `MCP tool call to server "${…}" was aborted: the account changed during re-authentication` | Not on a page yet |
| `Malformed AST` | Not on a page yet |
| `Malformed RPCv2 CBOR response, status: ${…}` | Not on a page yet |
| `Managed settings file ${…}: expected a JSON object, got ${…}` | Not on a page yet |
| `Managed settings on this machine configure a Cloud gateway sign-in; run interactive /login to authenticate.` | Not on a page yet |
| `ManagedIdentityCredential: Authentication failed. Message ${…}` | Not on a page yet |
| `ManagedIdentityCredential: Multiple scopes are not supported. Scopes: ${…}` | Not on a page yet |
| `ManagedIdentityCredential: Network unreachable. Message: ${…}` | Not on a page yet |
| `ManagedIdentityCredential: only one of 'clientId', 'resourceId', or 'objectId' can be provided. Received values: ${…}` | Not on a page yet |
| `Manifest for ${…} is not a valid release manifest` | Not on a page yet |
| `Mapper function is required` | Not on a page yet |
| `Marketplace "${…}" (hosted on claude.ai) is ${…}` | Not on a page yet |
| `Marketplace "${…}" (hosted on claude.ai) is blocked by enterprise policy` | Not on a page yet |
| `Marketplace "${…}" is registered from an untrusted source: ${…} To fix it, remove the marketplace and re-add it from the official source.` | Not on a page yet |
| `Marketplace "${…}" was not refreshed: ${…}` | Not on a page yet |
| `Marketplace "${…}" was not refreshed: this session can't save claude.ai marketplaces` | Not on a page yet |
| `Marketplace ${…} was not added: this add never replaces what is cached at ${…}, and caching it there failed. If a marketplace of that name is added, remove it first with /plugin marketplace remove ${……` | Not on a page yet |
| `Marketplace '${…}' has a corrupted installLocation (${…}) — expected a path inside ${…}. This can happen after cross-platform path writes or manual edits to known_marketplaces.json. ${…} and re-add it…` | Not on a page yet |
| `Marketplace '${…}' has a corrupted installLocation (${…}) — it belongs to the registered marketplace '${…}'. ${…} and re-add it.` | Not on a page yet |
| `Marketplace '${…}' is hosted on claude.ai and not declared in any settings scope. Omit --scope to remove it.` | Not on a page yet |
| `Marketplace '${…}' is seed-managed (${…}) and auto-update is always disabled for seed content. To update: ask your admin to update the seed.` | Not on a page yet |
| `Marketplace '${…}' not found. Available marketplaces: ${…}` | Not on a page yet |
| `Marketplace catalog redirected to a disallowed URL and was refused — a server-chosen cross-origin redirect must use https:// and must not point at a loopback, link-local, or cloud-metadata host (only …` | Not on a page yet |
| `Marketplace name ${…} is not a plain directory name; refusing to cache it` | Not on a page yet |
| `Marketplace name '${…}' resolves to a path outside the cache directory` | Not on a page yet |
| `Maximum retries reached with no response or error to throw` | Not on a page yet |
| `Message ${…} not found in registry` | Not on a page yet |
| `Message header must separate key and value using ':' ${…}` | Not on a page yet |
| `Message timestamp too new` | Not on a page yet |
| `Message timestamp too old` | Not on a page yet |
| `Metadata key "${…}" contains illegal characters` | Not on a page yet |
| `Metadata string value "${…}" contains illegal characters` | Not on a page yet |
| `Method handler for ${…} already provided.` | Not on a page yet |
| `Method names cannot start with $` | Not on a page yet |
| `Method not implemented.` | Not on a page yet |
| `MetricReader can not be bound to a MeterProvider again.` | Not on a page yet |
| `MetricReader is not bound to a MetricProducer` | Not on a page yet |
| `MetricReader is shutdown` | Not on a page yet |
| `Missing IdentityClient` | Not on a page yet |
| `Missing clientKey` | Not on a page yet |
| `Missing host header` | Not on a page yet |
| `Missing node for policy ${…}` | Not on a page yet |
| `Missing required ${…}: ${…}. Usage: /mcp__${…}__${…} ${…}` | Not on a page yet |
| `Missing required headers` | Not on a page yet |
| `Missing required parameter: '${…}'` | Not on a page yet |
| `Missing required parameter: task_id` | Not on a page yet |
| `Missing subject_token_field_name for JSON credential_source format` | Not on a page yet |
| `Mode: ${…} requires a string input.` | Not on a page yet |
| `Monitor "${…}" from plugin ${…} references ${…} in its command. The substituted value would be passed to a shell. Monitor commands cannot safely reference ${…}; have the monitor script read the value …` | Not on a page yet |
| `Multipart boundary "${…}" contains invalid characters` | Not on a page yet |
| `Multipart boundary "${…}" exceeds maximum length of 70 characters` | Not on a page yet |
| `Multipart boundary was specified as ${…} in the header, but got ${…} in the request body` | Not on a page yet |
| `Must pass in a JSON object containing an impersonated refresh token` | Not on a page yet |
| `Must pass in a JSON object containing the service account auth settings.` | Not on a page yet |
| `Must pass in a JSON object containing the user refresh token` | Not on a page yet |
| `Must pass in a stream containing the Google auth settings.` | Not on a page yet |
| `Must pass in a stream containing the service account auth settings.` | Not on a page yet |
| `Must provide an API Key string.` | Not on a page yet |
| `Must specify clientKey to enable streaming` | Not on a page yet |
| `NOT SUPPORTED: keyword "id", use "$id" for schema ID` | Not on a page yet |
| `NO_DISPLAYED_UPDATES: empty intake rejected` | Not on a page yet |
| `NPM marketplace sources not yet implemented` | Not on a page yet |
| `Native CLI binary for darwin-arm64 not found. Reinstall @anthropic-ai/claude-agent-sdk without --omit=optional, or set options.pathToClaudeCodeExecutable.` | Not on a page yet |
| `No "host" provided` | Not on a page yet |
| `No Artifact at ${…} that the user can see — it may have been deleted, or it has not been shared with them. ${…}` | Not on a page yet |
| `No HttpAuthScheme was selected: unable to sign request` | Not on a page yet |
| `No MCP server named "${…}" in .mcp.json` | Not on a page yet |
| `No MCP server named "${…}" in local scope` | Not on a page yet |
| `No MCP server named "${…}" in user scope` | Not on a page yet |
| `No OAuth flow in progress for "${…}" — call mcp_authenticate first` | Not on a page yet |
| `No SubtleCrypto implementation found` | Not on a page yet |
| `No TTY available to prompt for client secret. Set MCP_CLIENT_SECRET env var instead.` | Not on a page yet |
| `No TTY available — writing a blank template. Re-run in a terminal for the authoring interview.` | Not on a page yet |
| `No access token available` | Not on a page yet |
| `No access token for polling` | Not on a page yet |
| `No access token found in the output. Received output: ${…}` | Not on a page yet |
| `No access token is returned by the refreshHandler callback.` | Not on a page yet |
| `No access token to revoke.` | Not on a page yet |
| `No access, refresh token, API key or refresh handler callback is set.` | Not on a page yet |
| `No agent available for forked execution` | Not on a page yet |
| `No assistant message found` | Not on a page yet |
| `No assistant messages found` | Not on a page yet |
| `No auth available` | Not on a page yet |
| `No auth provider` | Not on a page yet |
| `No available ports for OAuth redirect` | Not on a page yet |
| `No background daemon is running. Installing it as a service keeps the background daemon running across reboot so 'claude agents' stays available.` | Not on a page yet |
| `No certificate authority to trust: CLAUDE_CODE_CERT_STORE=system (or NODE_OPTIONS --use-system-ca or --use-openssl-ca) leaves out the runtime's bundled roots, and ${…}. NODE_EXTRA_CA_CERTS only adds t…` | Not on a page yet |
| `No claude.ai OAuth token available` | Not on a page yet |
| `No claude.ai OAuth token found` | Not on a page yet |
| `No command provided.` | Not on a page yet |
| `No connection established for request ID: ${…}` | Not on a page yet |
| `No context available` | Not on a page yet |
| `No conversation to branch` | Not on a page yet |
| `No default load balancer type registered` | Not on a page yet |
| `No environment secret provided. Use --environment-secret-file or set SELF_HOSTED_RUNNER_ENVIRONMENT_SECRET.` | Not on a page yet |
| `No expiration time in token: ${…}` | Not on a page yet |
| `No field() metadata for key: ${…}` | Not on a page yet |
| `No file is confirmed stored. ${…}.${…}` | Not on a page yet |
| `No hook callback found for ID: ${…}` | Not on a page yet |
| `No input text` | Not on a page yet |
| `No issue time in token: ${…}` | Not on a page yet |
| `No key or keyFile set.` | Not on a page yet |
| `No matching service config found` | Not on a page yet |
| `No matching signature found` | Not on a page yet |
| `No messages found in JSON file` | Not on a page yet |
| `No messages found in JSONL file` | Not on a page yet |
| `No messages to branch` | Not on a page yet |
| `No messages to compact` | Not on a page yet |
| `No names provided` | Not on a page yet |
| `No pem found for envelope: ${…}` | Not on a page yet |
| `No plan file found at ${…}. Please write your plan to this file before calling ExitPlanMode.` | Not on a page yet |
| `No project attached to this session. Project tools are available when the session is started inside a claude.ai Project.` | Not on a page yet |
| `No project memory is available in this session. It may be turned off, or this server may not serve it yet. It is checked again when this session's context is next rebuilt (for example after /clear or …` | Not on a page yet |
| ``No projectId was given and it could not be resolved from credentials. The client should be instantiated with the `projectId` option or the `ANTHROPIC_VERTEX_PROJECT_ID` environment variable should be …`` | Not on a page yet |
| `No providers in chain` | Not on a page yet |
| `No refresh token is set.` | Not on a page yet |
| `No refresh token or refresh handler callback is set.` | Not on a page yet |
| ``No region was given. The client should be instantiated with the `region` option or the `CLOUD_ML_REGION` environment variable should be set.`` | Not on a page yet |
| `No request provided` | Not on a page yet |
| `No resolver could be created for target ${…}` | Not on a page yet |
| `No result received from shell command` | Not on a page yet |
| `No result returned` | Not on a page yet |
| `No retry token available` | Not on a page yet |
| `No root certificates are left to trust: every root built into this runtime is on the CLI's deny list. Update Claude Code.` | Not on a page yet |
| `No runtime abstraction layer installed` | Not on a page yet |
| `No runtime abstraction layer provided` | Not on a page yet |
| `No sed arguments` | Not on a page yet |
| `No session ID provided for teleport` | Not on a page yet |
| ``No socket was returned in the `connect()` function`` | Not on a page yet |
| `No task store configured` | Not on a page yet |
| `No timeoutMillis provided.` | Not on a page yet |
| `No transporter set.` | Not on a page yet |
| `No valid AWS "credential_source" provided` | Not on a page yet |
| `No valid Identity Pool "credential_source" provided, must be either file, url, or certificate.` | Not on a page yet |
| `No valid Pluggable Auth "credential_source" provided.` | Not on a page yet |
| `No valid config path found for Alacritty` | Not on a page yet |
| `No valid conversation chain found in JSONL file` | Not on a page yet |
| `No valid endpoint provider available.` | Not on a page yet |
| `No value provided for input HTTP label: ${…}.` | Not on a page yet |
| `No walker function defined for node type ${…}` | Not on a page yet |
| `Node is not in a tree with a FocusManager` | Not on a page yet |
| `Non-string provided as watch path: ${…}` | Not on a page yet |
| `Not a CEL value: ${…}` | Not on a page yet |
| `Not a ZodError: ${…}` | Not on a page yet |
| `Not accepted` | Not on a page yet |
| `Not available in this build` | Not on a page yet |
| `Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead` | Not on a page yet |
| `Not connected` | Not on a page yet |
| `Not enough messages to compact.` | [Hook Input and Output](../extend/hooks/input-and-output.md) |
| `Not implemented` | Not on a page yet |
| `Not implemented. Use addService() instead` | Not on a page yet |
| `Not implemented. Use bindAsync() instead` | Not on a page yet |
| `Not in a worktree session` | Not on a page yet |
| `Not signed in to the Cloud gateway — run /login.` | Not on a page yet |
| `Not yet implemented` | Not on a page yet |
| `Note: --scaffold runs each case's scaffold_script as you. Only use it on case files you (or your org) authored.` | Not on a page yet |
| `Notebook content (${…}) exceeds maximum allowed size (${…}). ${…}` | Not on a page yet |
| `Notebook file is not a valid Jupyter notebook (top-level "cells" must be an array of cell objects, each with a string or string-array "source").` | Not on a page yet |
| `Notebook file is not valid JSON (it may be truncated, corrupted, or still being written): ${…}` | Not on a page yet |
| `Notebook path is not a regular file (device, FIFO, or socket).` | Not on a page yet |
| `NotebookEdit: a call needs the message that issued it` | Not on a page yet |
| `Nothing has been published at ${…} yet, so there is no page to open. ${…}` | Not on a page yet |
| `Nothing to change once the invisible characters are removed and harness-tag text is defused in new_string: it then equals old_string. Nothing was written.` | Not on a page yet |
| `Nothing was uploaded: file_upload hit an internal error in Claude Code. This is a bug, not a problem with the file, so do not retry. Tell the user the upload failed because of a bug in Claude Code.` | Not on a page yet |
| `Null byte in path key: "${…}"` | Not on a page yet |
| `OAuth client information must be saveable for dynamic registration` | Not on a page yet |
| `OAuth flow completed without producing auth URLs` | Not on a page yet |
| `OIDC discovery returned a blocked endpoint: ${…}` | Not on a page yet |
| `OTEL raw body target changed identity around the open; not writing` | Not on a page yet |
| `OTEL raw body target is not a regular single-link file; not writing` | Not on a page yet |
| `OTEL raw body write made no progress` | Not on a page yet |
| `OTLP request body chunk is not string or Uint8Array` | Not on a page yet |
| `Object expected` | Not on a page yet |
| `Object expected.` | Not on a page yet |
| `Object iterator must return a key-value pair` | Not on a page yet |
| `Object not disposable.` | Not on a page yet |
| `Observer ${…} cannot stop itself; use the task UI or a main-session TaskStop.` | Not on a page yet |
| `Offset direction, ${…}, must be "+" or "-"` | Not on a page yet |
| `Onboarding guide unavailable: policy-disabled` | Not on a page yet |
| `Only a teammate can approve a shutdown request, and this session is not running as one. Nothing was sent. To shut down a teammate, send that teammate a shutdown_request message. The teammate is the on…` | Not on a page yet |
| `Only macOS, Linux, and Windows are supported` | Not on a page yet |
| `Only one of credential source or AWS security credentials supplier can be specified.` | Not on a page yet |
| `Only one of credential source or subject token supplier can be specified.` | Not on a page yet |
| `Only the team lead can approve plans. Teammates cannot approve their own or other plans.` | Not on a page yet |
| `Only the team lead can reject plans. Teammates cannot reject their own or other plans.` | Not on a page yet |
| `Options.continue with sessionStore requires store.listSessions to be implemented` | Not on a page yet |
| `Or consider using native installation with: claude install` | Not on a page yet |
| `Original and edited file match exactly. Failed to apply edit.` | Not on a page yet |
| ``Orphaned worktree dir at ${…} but `git remote` failed (git said ${…}) — refusing to self-heal. Remove ${…} manually if it has no work to keep.`` | Not on a page yet |
| `Orphaned worktree dir at ${…} but branch ${…} has unpushed commits — refusing to self-heal. Push or delete the branch, then retry.` | Not on a page yet |
| `Orphaned worktree dir at ${…} but rev-list on ${…} failed (git said ${…}) — refusing to self-heal. Remove ${…} manually if it has no work to keep.` | Not on a page yet |
| `Orphaned worktree dir at ${…} but rev-parse on ${…} failed (git said ${…}) — refusing to self-heal. Remove ${…} manually if it has no work to keep.` | Not on a page yet |
| `Outcome for ${…} has ${…} branches, expected 0 or 1` | Not on a page yet |
| `Output does not match required schema: ${…}` | Not on a page yet |
| `Overlapping edit` | Not on a page yet |
| `PBES2 Salt Input must be 8 or more octets` | Not on a page yet |
| `PBKDF2 key "usages" must include "deriveBits" or "deriveKey"` | Not on a page yet |
| `PDF extraction directory disappeared before readback: ${…}` | Not on a page yet |
| `PDF extraction directory is outside the session tool-results store: ${…}` | Not on a page yet |
| `PDF extraction handed over no page names: ${…}` | Not on a page yet |
| `Param is not a string` | Not on a page yet |
| `Parser was already resumed` | Not on a page yet |
| `Parsing XML not supported.` | Not on a page yet |
| ``Pass at most one of `profile`, `credentials`, or `config`.`` | Not on a page yet |
| `Path from environment variable "${…}" is invalid: ${…}` | Not on a page yet |
| `Path must be a string, received ${…}` | Not on a page yet |
| `Path traversal detected: "${…}" would escape the base directory` | Not on a page yet |
| `Path-style addressing cannot be used with ARN buckets` | Not on a page yet |
| `Path: '${…}' does not end with ']'` | Not on a page yet |
| `Pattern not found in template literal` | Not on a page yet |
| ``Per-exec filesystem.allowRead/allowWrite is not supported on Windows — `srt-win exec` only exposes per-exec denies. Set them at the session level (initialize()).`` | Not on a page yet |
| `PeriodicExportingMetricReader: metrics export failed (error ${…})` | Not on a page yet |
| `Permission prompt tool returned an invalid result. Expected a single text block param with type="text" and a string text value.` | Not on a page yet |
| `Plan token is missing or does not match this project. Call finalize_plan first.` | Not on a page yet |
| ``Please use $(options).sync`command` instead of $.sync(options)`command`.`` | Not on a page yet |
| `Please wait and try again later` | Not on a page yet |
| `Pluggable Auth executables need to be explicitly allowed to run by setting the GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES environment Variable to 1.` | Not on a page yet |
| `Plugin "${…}" declares a headersHelper but is not strict:false — an entry with headersHelper must inline its manifest so its capabilities can be reviewed before the command runs.` | Not on a page yet |
| ``Plugin "${…}" fetches its archive through a headersHelper, which only runs when you install or update it from its own details view — open this plugin in /plugin (or run `claude plugin install`/`update…`` | Not on a page yet |
| `Plugin "${…}" was not installed: ${…}` | Not on a page yet |
| `Plugin ${…} not found in marketplace` | Not on a page yet |
| `Plugin ${…} not found in marketplace ${…}` | Not on a page yet |
| `Plugin ${…}: ${…}` | Not on a page yet |
| `Plugin archive from ${…} contained no plugin files. The archive was not installed. Verify the URL serves a zip of the plugin contents.` | Not on a page yet |
| `Plugin archive from ${…} does not contain the component paths its marketplace entry declares${…}. The archive was not installed. Repackage the zip so the declared paths sit at the plugin root (optiona…` | Not on a page yet |
| `Plugin archive from ${…} has no plugin content at its root (expected .claude-plugin/ or a commands/, skills/, agents/, hooks/, themes/, output-styles/, monitors/, workflows/, SKILL.md, .mcp.json, or .…` | Not on a page yet |
| `Plugin archive from ${…} was not installed: its marketplace entry declares only unsafe or malformed component paths. Fix the entry.` | Not on a page yet |
| `Plugin archive integrity check failed for ${…}: expected sha256 ${…}, got ${…}. The archive was not installed. Verify the sha256 in the marketplace entry, or that the URL serves the intended file.` | Not on a page yet |
| `Plugin archive redirected to a disallowed URL and was refused — every hop must satisfy the archive URL policy (${…}): ${…}` | Not on a page yet |
| `Plugin archive too large (${…} bytes, max ${…}) from ${…}` | Not on a page yet |
| `Plugin directory ${…} could not be ${…} loading: ${…}` | Not on a page yet |
| `Plugin directory ${…} was removed ${…}` | Not on a page yet |
| `Plugin directory ${…} was replaced while it was being loaded` | Not on a page yet |
| `Plugin directory does not exist: ${…}${…}` | Not on a page yet |
| `Plugin directory has more than ${…} entries; refusing to install it as a plugin.` | Not on a page yet |
| `Plugin directory is larger than ${…} MB; refusing to install it as a plugin.` | Not on a page yet |
| `Plugin option "${…}" isn't set. Open /plugin manage to configure it, or check that the plugin's userConfig schema declares "${…}".` | Not on a page yet |
| `Plugin path is not a directory: ${…}` | Not on a page yet |
| ``Plugin source command `${…}` could not be started: ${…}`` | Not on a page yet |
| ``Plugin source command `${…}` did not finish within ${…}s and was stopped.${…}`` | Not on a page yet |
| ``Plugin source command `${…}` exited with code ${…}${…}`` | Not on a page yet |
| ``Plugin source command `${…}` printed ${…} lines; it must print exactly one absolute path.`` | Not on a page yet |
| ``Plugin source command `${…}` printed `${…}`, ${…}`` | Not on a page yet |
| ``Plugin source command `${…}` printed `${…}`, a network path (UNC or automount), which is not supported as a plugin directory.`` | Not on a page yet |
| ``Plugin source command `${…}` printed `${…}`, but that directory has no plugin content (expected .claude-plugin/ or a commands/, skills/, agents/, hooks/, themes/, output-styles/, monitors/, workflows/…`` | Not on a page yet |
| ``Plugin source command `${…}` printed `${…}`, but that path could not be resolved (${…}).`` | Not on a page yet |
| ``Plugin source command `${…}` printed `${…}`, which is not an absolute path.`` | Not on a page yet |
| ``Plugin source command `${…}` printed `${…}`, which is reached through a link onto a network location (or one that cannot be trusted); that is not supported as a plugin directory.`` | Not on a page yet |
| ``Plugin source command `${…}` printed a path that resolves to a network location, which is not supported as a plugin directory.`` | Not on a page yet |
| ``Plugin source command `${…}` printed more than ${…} KB and was stopped; it must print a single absolute path.`` | Not on a page yet |
| ``Plugin source command `${…}` printed nothing; it must print the absolute path of the plugin directory.`` | Not on a page yet |
| ``Plugin source command `${…}` was killed by ${…} before it finished.${…}`` | Not on a page yet |
| `Plugin source command printed the working directory or one of its parents (${…}); refusing to use it as a plugin.` | Not on a page yet |
| `Plugin source directory not found: ${…} (from entry.source: ${…})` | Not on a page yet |
| `Plugin tree at ${…} could not be made symlink-free (${…}); refusing to cache it` | Not on a page yet |
| `Plugin zip cache is not enabled` | [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md) |
| `Policies inside a phase cannot specify afterPhase.` | Not on a page yet |
| `Poll is available on the main thread only` | Not on a page yet |
| `PollWork: response assignment_ids contains a malformed session id — rejecting the malformed poll response` | Not on a page yet |
| `PollWork: response assignment_ids is not an array — rejecting the malformed poll response` | Not on a page yet |
| `PollWork: response body is not a JSON object (an intercepting proxy may have answered) — rejecting the malformed poll response` | Not on a page yet |
| `Possible causes:` | Not on a page yet |
| `PowerShell is not available` | Not on a page yet |
| `PowerShell runs only on ${…}; the session runs it there and it cannot run here.` | Not on a page yet |
| `PowerShellTool no longer declares an object schema` | Not on a page yet |
| `Private accessor was defined without a getter` | Not on a page yet |
| `Private accessor was defined without a setter` | Not on a page yet |
| `Private key must be given with accompanying certificate chain` | Not on a page yet |
| `Private method is not writable` | Not on a page yet |
| `ProcessTransport is not ready for writing` | Not on a page yet |
| `ProcessTransport output stream not available` | Not on a page yet |
| `Profile ${…} credential_process did not return Version 1.` | Not on a page yet |
| `Profile ${…} credential_process returned expired credentials.` | Not on a page yet |
| `Profile ${…} credential_process returned invalid JSON.` | Not on a page yet |
| `Profile ${…} credential_process returned invalid credentials.` | Not on a page yet |
| `ProgramData is not set` | [System and Third-Party](../configure/env-vars/system-and-third-party.md) |
| `Programs are unavailable in this session; the command was not run.` | Not on a page yet |
| `Progress handler for token ${…} already registered` | Not on a page yet |
| `Project-scope MCP server changes are unavailable in a session started with --project-config-root. Use the local or user scope instead.` | Not on a page yet |
| `PromptSubmitController used before its host was bound` | Not on a page yet |
| ``Property `${…}` is not resolved for AWS SDK SigV4Auth`` | Not on a page yet |
| `ProposeGoal cannot be used in agent contexts` | Not on a page yet |
| `ProposeGoal only proposes a new goal; it cannot clear one. The user can clear an active goal with /goal clear.` | Not on a page yet |
| `Protected resource ${…} does not match expected ${…} (or origin)` | Not on a page yet |
| `Provided certificate config path is invalid: ${…}` | Not on a page yet |
| `Provided command: "${…}" could not be parsed.` | Not on a page yet |
| `Provided load balancing config has multiple conflicting entries` | Not on a page yet |
| `Provided message too short to accommodate event stream message overhead` | Not on a page yet |
| `Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.` | Not on a page yet |
| `Published: ${…}${…}` | Not on a page yet |
| `Publishing is unavailable: ${…} ${…}` | Not on a page yet |
| `Publishing reads file contents and a Read permission check requires approval here — retry the publish so it can be asked.` | Not on a page yet |
| `Publishing report to claude.ai (private to you)…` | Not on a page yet |
| `RFC-3339 date-times must be expressed as strings` | Not on a page yet |
| `RFC-7231 date-times must be expressed as strings` | Not on a page yet |
| `RFC3339 timestamps must be strings` | Not on a page yet |
| `RFC7231 timestamps must be strings.` | Not on a page yet |
| `RSA JWK "oth" (Other Primes Info) Parameter value is not supported` | Not on a page yet |
| `RSA-OAEP key "usages" must include "decrypt" or "unwrapKey" for this operation` | Not on a page yet |
| `RSA-OAEP key "usages" must include "encrypt" or "wrapKey" for this operation` | Not on a page yet |
| `Ran out of data` | Not on a page yet |
| `Random bytes length must be >= 16` | Not on a page yet |
| `Raw mode is not supported on the current process.stdin, which Ink uses as input stream by default. Read about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported` | Not on a page yet |
| `Raw mode is not supported on the stdin provided to Ink. Read about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported` | Not on a page yet |
| `React.Children.only expected to receive a single React element child.` | Not on a page yet |
| `Read tool is restricted for this session` | Not on a page yet |
| `ReadCalls: ${…} has more than ${…} entries` | Not on a page yet |
| `ReadCalls: ${…} is not a valid tool_use_id${…}. An id is 1 to 128 letters, digits or _ . : @ -, and not only dots.` | Not on a page yet |
| `ReadNotifications can only be called from the main conversation — subagents must not drain the session notification buffer.` | Not on a page yet |
| `ReadTaskOutput: no shell task has that task_id` | Not on a page yet |
| `Readable.toWeb() is not supported. Please ensure a polyfill is available.` | Not on a page yet |
| `ReadableStream is locked.` | Not on a page yet |
| `` Received ${…} for "${…}"; to upload raw bytes, wrap them with `await toFile(bytes, 'filename')` `` | Not on a page yet |
| `Received ${…} parameters for 'by Name' notification parameter structure.` | Not on a page yet |
| `Received ${…} parameters for 'by Name' request parameter structure.` | Not on a page yet |
| `` Received a Promise for "${…}"; await it first, e.g. `await toFile(...)` `` | Not on a page yet |
| `Received message larger than max (${…} vs ${…})` | Not on a page yet |
| `Received null for "${…}"; to pass null in FormData, you must use the string 'null'` | Not on a page yet |
| `Received parameters by name but param is not an object literal.` | Not on a page yet |
| `Reconnecting to ${…}…` | Not on a page yet |
| `Reference not found: ${…}` | Not on a page yet |
| `RefreshToken: response missing token` | Not on a page yet |
| `Refused a redirect to another origin` | Not on a page yet |
| `Refusing git URL ${…}: a file: URL must name a local path (no host, no network-shaped path).${…}` | Not on a page yet |
| `Refusing to copy ${…}: it is no longer a directory (swapped during the copy).` | Not on a page yet |
| `Refusing to copy ${…}: it is no longer a directory as listed — a link or Windows junction stands there (planted, or swapped during the copy). Plugin trees must hold plain directories.` | Not on a page yet |
| `Refusing to copy ${…}: it resolves somewhere other than its own name (a junction or mount point).` | Not on a page yet |
| `Refusing to copy ${…}: its target is no longer what it resolved to (swapped during the copy).` | Not on a page yet |
| `Refusing to extract a plugin archive outside the session plugin cache` | Not on a page yet |
| `Refusing to read ${…}: the system would not say where it was opened (reading /proc/self/fd failed with ${…}), so it cannot be told apart from a path this session may not read.` | Not on a page yet |
| `Refusing to search ${…}: a path one of its Read deny rules is written through changed while the search was being prepared. Retry.` | Not on a page yet |
| `Refusing to search ${…}: it could not be opened (${…}) — it is unreadable, or is being replaced concurrently.` | Not on a page yet |
| `Refusing to search ${…}: ripgrep was found only by name on PATH, and a search outside the working directory cannot apply your Read deny rules in that configuration. Install ripgrep at an absolute path…` | Not on a page yet |
| `Refusing to send command containing control character U+${…} to terminal pane` | Not on a page yet |
| `Refusing to stage atomic write under non-directory parent: ${…}` | Not on a page yet |
| `Refusing to write ${…}: it is a symbolic link. Write to the link's target path instead.` | Not on a page yet |
| `Refusing to write into symlinked directory: ${…}` | Not on a page yet |
| `Refusing to write through symlink: ${…} (O_NOFOLLOW)` | Not on a page yet |
| `Refusing to write through symlink: ${…}. Resolve the symlink and pass the real target path explicitly.` | Not on a page yet |
| `Refusing to write under symlinked or non-directory path: ${…}` | Not on a page yet |
| `Region is missing` | Not on a page yet |
| `Region not accepted: region="${…}" is not a valid hostname component.` | Not on a page yet |
| `RegisterWorker: invalid worker_epoch in response: ${…}` | Not on a page yet |
| `Remote Control base URL uses HTTP. Only HTTPS or localhost HTTP is allowed.` | Not on a page yet |
| ``Remote Control is disabled by your organization's policy (managed setting `disableRemoteControl`).`` | Not on a page yet |
| ``Remote Control is only available with claude.ai subscriptions. Please use `/login` to sign in with your claude.ai account.`` | Not on a page yet |
| `Remote Control session expired.` | Not on a page yet |
| `Remote environments are only available on the first-party Anthropic API provider.` | Not on a page yet |
| `RemoteIO: transport closed permanently (code ${…})` | Not on a page yet |
| `RemoteTransport: used before its screen bound a host` | Not on a page yet |
| `Removed line count did not match for hunk at line ${…}` | Not on a page yet |
| `Rename it back to ${…}, or reinstall with: npm i -g ${…}` | Not on a page yet |
| `ReplSessionScope: used before its screen bound a host` | Not on a page yet |
| `Reported message length does not match received message length` | Not on a page yet |
| `Request aborted` | Not on a page yet |
| `Request body gzip: compression stopped` | Not on a page yet |
| `Request timed out while downloading marketplace from ${…}. The server may be slow or unreachable. Technical details: ${…}` | Not on a page yet |
| `Resolved credential object is not valid` | Not on a page yet |
| `Resolving load balancer should never call requestReresolution` | Not on a page yet |
| `Rules evaluation failed` | Not on a page yet |
| `RunMonitorCommand was not run again: this very call was already started here once. Check what it did before you send a new call.` | Not on a page yet |
| `RunMonitorCommand was not run: ${…}` | Not on a page yet |
| `RunMonitorCommand was not run: a ToolHost permission request goes with the monitor_input it judged, and with no rules of its own. Retrying won't help.` | Not on a page yet |
| `RunMonitorCommand was not run: another call changed the working directory while this one was being checked. Send it again to have it checked where it would now start.` | Not on a page yet |
| `RunMonitorCommand was not run: its monitor_input goes with a ToolHost permission request that this server decides, and it brought none, or this server decides none. Retrying won't help.` | Not on a page yet |
| `RunMonitorCommand was not run: the call sent no progress token, so the command's output would have nowhere to go. Call again with _meta.progressToken set.` | Not on a page yet |
| `RunMonitorCommand was not run: this environment already runs as many monitors as it allows at once. Stop one first.` | Not on a page yet |
| `RunMonitorCommand was not run: this session was already told that this call had not started, so it can no longer run. Send a new call.` | Not on a page yet |
| `SDK MCP server not found: ${…}` | Not on a page yet |
| `SDK debug logs: ${…}` | Not on a page yet |
| `SDK servers should be handled in print.ts` | Not on a page yet |
| `SDKStartup: ${…}` | Not on a page yet |
| `SDKStartup: exiting without result: ${…} (last_phase=${…}, drained=${…}, exit=${…})` | Not on a page yet |
| `SDKStartup: phase=${…} t=${…}s${…}` | Not on a page yet |
| `SELF_HOSTED_RUNNER_CONFINE_REPO_SETTINGS must be one of enforce/warn/off (got: ${…})` | Not on a page yet |
| `SELF_HOSTED_RUNNER_HEALTH_PORT must be an integer in [0, 65535] (0 disables), got: ${…}` | Not on a page yet |
| `SELF_HOSTED_RUNNER_HOST_CONFIG_SNAPSHOT must be one of disk/memory (got: ${…})` | Not on a page yet |
| `SELF_HOSTED_RUNNER_SERVER_AUTO_MODE_LISTS must be one of all/no-allow/none (got: ${…})` | Not on a page yet |
| `SHA pin verification failed: expected ${…} to be ${…}, got ${…}. The pinned commit may have been removed upstream, or a ref with the same name exists. Refusing to install.` | Not on a page yet |
| `SSEClientTransport already started! If using Client class, note that connect() calls start() automatically.` | Not on a page yet |
| `Sandbox configuration is not supported on platform: ${…}` | Not on a page yet |
| `Sandbox dependencies not available: ${…}` | Not on a page yet |
| `Sandbox is enabled but failed to initialize${…}. Until the sandbox can start, commands that would run in it are refused.` | Not on a page yet |
| `Sandbox is required but failed to initialize${…}. ${…} Running it outside the sandbox (dangerouslyDisableSandbox) is not allowed either.` | Not on a page yet |
| `Sandboxed bash on Windows requires Git Bash, which is not installed. Install Git Bash, or run this command unsandboxed (dangerouslyDisableSandbox).` | Not on a page yet |
| `Schema appears to be from zod 3, which the SDK cannot convert to JSON Schema. Upgrade to zod >=4.2.0, or wrap your JSON Schema with fromJsonSchema().` | Not on a page yet |
| `Schema is missing a method literal` | Not on a page yet |
| ``Schema is missing an `id` property`` | Not on a page yet |
| ``Schema library "${…}" does not implement StandardJSONSchemaV1 (`~standard.jsonSchema`). Upgrade to a version that does, or wrap your JSON Schema with fromJsonSchema().`` | Not on a page yet |
| `Schema method literal must be a string` | Not on a page yet |
| `Schema type cannot be represented in JSON Schema` | Not on a page yet |
| `Scopes or url must be provided` | Not on a page yet |
| `Script call limit exceeded: ${…} has been called ${…} times (cap: ${…}). This limit prevents data exfiltration via repeated write operations in untrusted-input workflows.` | Not on a page yet |
| `Second argument must be a buffer` | Not on a page yet |
| `Secret can't be empty.` | Not on a page yet |
| `SendFile: dispatch needs the permission pipeline (call.ask)` | Not on a page yet |
| `SendMessage output is not an object` | Not on a page yet |
| `SendMessage: dispatch needs the executor (the issuing message and canUseTool)` | Not on a page yet |
| `Server "${…}" does not support resources` | Not on a page yet |
| `Server "${…}" is not connected` | Not on a page yet |
| `Server "${…}" not found. Available servers: ${…}` | Not on a page yet |
| `Server ${…} missing required 'command' field` | Not on a page yet |
| `Server ${…} missing required 'extensionToLanguage' field` | Not on a page yet |
| `Server added, but the client secret could not be stored${…}. Re-run with --client-secret once secure storage is available.` | Not on a page yet |
| `Server does not support ${…} (required for ${…})` | Not on a page yet |
| `Server does not support completions (required for ${…})` | Not on a page yet |
| `Server does not support logging (required for ${…})` | Not on a page yet |
| `Server does not support notifying about resources (required for ${…})` | Not on a page yet |
| `Server does not support notifying of prompt list changes (required for ${…})` | Not on a page yet |
| `Server does not support notifying of tool list changes (required for ${…})` | Not on a page yet |
| `Server does not support prompts (required for ${…})` | Not on a page yet |
| `Server does not support resource subscriptions (required for ${…})` | Not on a page yet |
| `Server does not support resources (required for ${…})` | Not on a page yet |
| `Server does not support tasks capability (required for ${…})` | Not on a page yet |
| `Server does not support tools (required for ${…})` | Not on a page yet |
| `Server not found: ${…}` | Not on a page yet |
| `Server sent invalid initialize result: ${…}` | Not on a page yet |
| `Server status: ${…}` | Not on a page yet |
| `Server type "${…}" does not support OAuth authentication` | Not on a page yet |
| `Server's protocol version is not supported: ${…}` | Not on a page yet |
| `Service Account user is configured for the credential. Domain-wide delegation is not supported in universes other than ${…}` | Not on a page yet |
| `Service install failed (${…}). Falling back to a transient ${…} for now.` | Not on a page yet |
| `Service not installed: ${…}` | Not on a page yet |
| `Session ${…} /remote response is missing inference_auth.access_token` | Not on a page yet |
| `Session ${…} can't start — ${…}` | Not on a page yet |
| `Session ${…} ended while the background service was off; looking for its saved conversation to resume…` | Not on a page yet |
| `Session ${…} has exited${…}.` | Not on a page yet |
| `Session ${…} was interrupted while unattended — resuming it…` | Not on a page yet |
| `Session ${…}'s terminal host died — restarting it on a fresh one…` | Not on a page yet |
| ``Session ${…}'s terminal host died — run `claude attach ${…}` again to restart it on a fresh host.`` | Not on a page yet |
| `Session append: transcript not writable via storage` | Not on a page yet |
| `Session expired. Please run /login to sign in again.` | Not on a page yet |
| `Session moved to ${…}` | Not on a page yet |
| `SessionController: used before its screen bound a host` | Not on a page yet |
| `SessionEnd hook [${…}] failed: ${…}` | Not on a page yet |
| `Setting up the Windows sandbox. Approve the administrator prompt if Windows shows one. After that, set-up can take a few minutes.` | Not on a page yet |
| `Settings on this machine pin the login method or organization, so signing in without an API key is not available here.` | Not on a page yet |
| `Shared config file entry ${…} mast be a number, got "${…}"` | Not on a page yet |
| `Shell '${…}' not found in PATH` | Not on a page yet |
| `Shell command failed for pattern "${…}": ${…}` | Not on a page yet |
| `Shell command interrupted for pattern "${…}": [Command interrupted]` | Not on a page yet |
| `Shell command permission check failed for pattern "${…}": ${…}` | Not on a page yet |
| `Should never happen.` | Not on a page yet |
| `Side question cancelled` | Not on a page yet |
| `Sign in to claude.ai to add a marketplace it hosts` | Not on a page yet |
| `Skill "${…}" was not run: ${…}.` | Not on a page yet |
| `Skill ${…} now matches several skills${…} — invoke one by its full name.` | Not on a page yet |
| ``Skill ${…} requires bash (`shell: bash` in frontmatter) but Git Bash was not found. ${…}, or change the skill's frontmatter to `shell: powershell`.`` | Not on a page yet |
| `Skill names must be non-empty strings.` | Not on a page yet |
| `Skipped publishing because the run was interrupted.` | Not on a page yet |
| `Socket directory not owned by current user (uid: ${…}, dir uid: ${…}). Potential security risk.` | Not on a page yet |
| `Socket not owned by current user (uid: ${…}, socket uid: ${…}). Potential security risk.` | Not on a page yet |
| `Something in this environment — an API key helper, an injected token, or a third-party provider setting — takes precedence over a profile sign-in, so it would not be used here.` | Not on a page yet |
| `Source '${…}' resolved to an unsafe repo path (slug='${…}'). Check for path traversal in the URL.` | Not on a page yet |
| `Source code is missing.` | Not on a page yet |
| `Source file does not exist: ${…}` | Not on a page yet |
| `Source path does not exist: ${…}` | Not on a page yet |
| `Specify a scope with -s to remove from a specific one.` | Not on a page yet |
| `Start can only be called once per transport.` | Not on a page yet |
| `Starting ${…}…` | Not on a page yet |
| `Stateless transport cannot be reused across requests. Create a new transport per request.` | Not on a page yet |
| `Stats tab rendered without getSkillStatsInputs` | Not on a page yet |
| `StdioClientTransport already started! If using Client class, note that connect() calls start() automatically.` | Not on a page yet |
| `StdioServerTransport already started! If using Server class, note that connect() calls start() automatically.` | Not on a page yet |
| `Stream can only be iterated once` | Not on a page yet |
| `Stream closed` | Not on a page yet |
| `StreamableHTTPClientTransport already started! If using Client class, note that connect() calls start() automatically.` | Not on a page yet |
| `Streams in object mode are not supported: ${…}` | Not on a page yet |
| `String not found in file. Failed to apply edit.` | Not on a page yet |
| `String required as first argument` | Not on a page yet |
| `Stub tool ${…}.${…} called — stub exists only for permission UI rendering.` | Not on a page yet |
| `SubagentSends is already installed` | Not on a page yet |
| `Subdirectory '${…}' not found in repository ${…}${…}. Check that the path is correct and exists at the specified ref/sha.` | Not on a page yet |
| `Subdirectory '${…}' passes through a symbolic link inside the repository; refusing to install it.` | Not on a page yet |
| `SubtleCrypto not found. Make sure it's an https:// website.` | Not on a page yet |
| `Symbol.asyncDispose is not defined.` | Not on a page yet |
| `Symbol.asyncIterator is not defined.` | Not on a page yet |
| `Symbol.dispose is not defined.` | Not on a page yet |
| `Symlink loop detected in path: "${…}"` | Not on a page yet |
| `Synchronous parse encountered promise.` | Not on a page yet |
| `TODO: gradeCase` | Not on a page yet |
| `TODO: loadCases` | Not on a page yet |
| `TODO: runCase` | Not on a page yet |
| ``Takes `servers`: http or sse entries with an https URL, each under a name that starts with org-connector-, has only letters, digits, . _ and -, has no two of . and _ in a row, ends in a letter or a di…`` | Not on a page yet |
| `Takes a server name and one JSON-RPC request with an id` | Not on a page yet |
| `Takes a server name, whether it is enabled, and optionally a request id of at most 64 characters` | Not on a page yet |
| `Target principal is too long: ${…}` | Not on a page yet |
| `Task ${…} is not running (status: ${…})` | Not on a page yet |
| `Task ${…} is owned by ${…}; agent ${…} cannot stop it.` | Not on a page yet |
| `Task output files are read individually: Grep (or Read) a specific task's output path rather than the tasks directory.` | Not on a page yet |
| `Task output has no file in a diskless session` | Not on a page yet |
| `Task output is not written to disk in a diskless session` | Not on a page yet |
| `Team config file unreadable (lock acquired, read failed)` | Not on a page yet |
| `Team name is required for permission requests` | Not on a page yet |
| `Temp directory ${…} is not a directory (may be an attacker-planted symlink). Refusing to use it. ${…}` | Not on a page yet |
| `Temp directory ${…} is not readable (its mode may have been altered, or a path component denies search). Refusing to use it — restore its permissions (chmod 0700) or remove it. ${…}` | Not on a page yet |
| `Temp directory ${…} is owned by uid ${…}, expected ${…}. Refusing to use it — another user may have pre-created it. ${…}` | Not on a page yet |
| `Terminated — finishing up…` | Not on a page yet |
| `TextDecoder is not available, please make sure polyfill is provided.` | Not on a page yet |
| `That claude.ai marketplace is already added as marketplace "${…}"` | Not on a page yet |
| `That teammate name is a reserved name ("main", "team-lead", "user" or "system", in any spelling) or has the shape of an agent id, which already addresses an agent directly — choose another teammate na…` | Not on a page yet |
| `The "${…}" connector connected, but its tools could not be listed.` | Not on a page yet |
| `The "${…}" connector was already tried in this turn.` | Not on a page yet |
| `The "${…}" data island on this page cannot be located unambiguously (duplicate, unterminated, or variant-spelled island element, or a page too deeply nested to examine) — the page is out of contract. …` | Not on a page yet |
| `The "${…}" data island on this page is out of contract (failed schema validation). Act on nothing from it; tell the user and stop.` | Not on a page yet |
| `The "b64" (base64url-encode payload) Header Parameter must be a boolean` | Not on a page yet |
| `The "input" argument must be ArrayBuffer. Received type ${…} (${…})` | Not on a page yet |
| `The "input" argument must be of type string. Received type ${…} (${…})` | Not on a page yet |
| `The '${…}' property is not allowed when passing additionalClaims. This claim is included in the JWT by default.` | Not on a page yet |
| `The Cloud gateway session that named this collector ended — dropping this telemetry batch` | Not on a page yet |
| `The IDE connection is managed automatically and can't be reconnected manually` | Not on a page yet |
| ``The `input` and `inputFile` options cannot be both set.`` | Not on a page yet |
| ``The `input` option cannot be a stream in sync mode`` | Not on a page yet |
| ``The `level` option should be an integer from 0 to 3`` | Not on a page yet |
| `The access token expiry_date field is missing in the provided credentials.` | Not on a page yet |
| `The account or conversation changed after this action was checked, or that check is no longer on record — nothing was done; retry so it is checked again` | Not on a page yet |
| `The amount of data is too big to be stored in a QR Code` | Not on a page yet |
| ``The approval arrived without the plan, so plan mode was not exited. Call this tool again with the whole plan in the `plan` argument.`` | Not on a page yet |
| `The authorityHost address must use the 'https' protocol.` | Not on a page yet |
| `` The background service has no process for session ${…}. A name opens only a running session. Use the id: `claude attach ${…}` `` | Not on a page yet |
| `The charset option must be either utf-8, iso-8859-1, or undefined` | Not on a page yet |
| `The choice could not be saved` | Not on a page yet |
| `The chosen QR Code version cannot contain this amount of data. Minimum version required to store current data is: ${…}.` | Not on a page yet |
| `The command had already ended when it was to be moved to the background, and its output was not kept. Run it again without run_in_background.` | Not on a page yet |
| `The corrupted file has already been backed up.` | Not on a page yet |
| `The file at the specified path does not contain a PEM-encoded certificate.` | Not on a page yet |
| `The file path is invalid.` | Not on a page yet |
| `The file that identifies this container start is empty.` | Not on a page yet |
| `The file that identifies this container start is not a regular file owned by this user.` | Not on a page yet |
| `The first argument must be a Readable, a ReadableStream, or an async iterable.` | Not on a page yet |
| `The folder ${…} is a leftover worktree whose .git file points to another location, so it was left as is. Remove it if it has no work to keep, or choose a different worktree name.` | Not on a page yet |
| `The folder for background command records is a symbolic link or not a directory owned by this user.` | Not on a page yet |
| ``The given function `${…}` is not wrapped by the `onetime` package`` | Not on a page yet |
| `The goal condition exceeds ${…} characters once canonicalized for display (tabs expand to spaces). Shorten the condition — the user must be able to read all of it in the approval dialog.` | Not on a page yet |
| `The goal condition is empty once whitespace and invisible characters are removed. Provide a visible condition.` | Not on a page yet |
| `The includeDirs option must be an array` | Not on a page yet |
| `The incoming JSON object does not contain a client_email field` | Not on a page yet |
| `The incoming JSON object does not contain a client_id field` | Not on a page yet |
| `The incoming JSON object does not contain a client_secret field` | Not on a page yet |
| `The incoming JSON object does not contain a private_key field` | Not on a page yet |
| `The incoming JSON object does not contain a refresh_token field` | Not on a page yet |
| `The incoming JSON object does not contain a service_account_impersonation_url field` | Not on a page yet |
| `The incoming JSON object does not contain a source_credentials field` | Not on a page yet |
| `The incoming JSON object does not have the "${…}" type` | Not on a page yet |
| `The incoming JSON object does not have the "authorized_user" type` | Not on a page yet |
| `The input to be decoded is not correctly encoded.` | Not on a page yet |
| `The installed copy of this plugin version at ${…} could not be replaced: it is in use by another program (for example a running Claude Code session, or an editor or terminal inside that folder), or th…` | Not on a page yet |
| `The last message must contain only tool_result content if any is present` | Not on a page yet |
| `The latest listing has no connected server of that name` | Not on a page yet |
| `The link farm points at a producer reached through a link that cannot be trusted; refusing to relink it.` | Not on a page yet |
| `The link farm points at a producer that now resolves to a network location; refusing to relink it.` | Not on a page yet |
| `The link-farm marker is not a small regular file; refusing to read it.` | Not on a page yet |
| `The list of installed plugins (installed_plugins.json) could not be read or is not a valid list, so this remove cannot tell which plugins to turn off. Nothing was deleted, and the known_marketplaces.j…` | Not on a page yet |
| `The listing has no server of that name` | Not on a page yet |
| `The message checksum (${…}) did not match the expected value of ${…}` | Not on a page yet |
| `The name that this hook's matcher is tested against (for a tool call, the tool's name) has over ${…} characters, more than a cloud session tests.` | Not on a page yet |
| `The operation was aborted. Request has already been canceled.` | Not on a page yet |
| `The options argument of hardenVMIntrinsics and createVMIntakeWalkers must be either { importModuleDynamically: <function> } or COMPILE_WITHOUT_IMPORT_HOOK, which src/utils/vmHardening.ts exports` | Not on a page yet |
| `The permission rule ${…} asks the user before the ${…} type is listed, and the type listing could not be read completely to find the name to ask under, so nothing was listed — retry.` | Not on a page yet |
| `The permission rule ${…} asks the user before the ${…} type is listed, and the user is asked only when the call names the type by that link, so nothing was listed. To have the user asked, list it agai…` | Not on a page yet |
| `The permission rule ${…} asks the user before this type is listed, and it was added after this call's permission check ran, so nothing was listed. List it again the same way to have the user asked.` | Not on a page yet |
| `The plugin archive from claude.ai has no plugin content at its root. It was not installed.` | Not on a page yet |
| `The plugin archive from claude.ai was refused: it carries a git repository layout.` | Not on a page yet |
| `The plugin archive from claude.ai was refused: it is not a safe, well-formed zip.` | Not on a page yet |
| `The plugin archive wasn't downloaded: this claude.ai login doesn't have plugin access yet. Access is usually added automatically within a few hours. Try again later.` | Not on a page yet |
| `The prelude checksum specified in the message (${…}) does not match the calculated CRC32 checksum (${…})` | Not on a page yet |
| `The provided access boundary has more than ${…} access boundary rules.` | Not on a page yet |
| `The provided fetch function does not support file uploads with the current global FormData class.` | Not on a page yet |
| `The repo's MCP servers have been closed` | Not on a page yet |
| ``The request is not an instance of `HttpRequest` and cannot be signed`` | Not on a page yet |
| `The result of MCP tool "${…}" on server "${…}" arrived without its text. A result that is too large arrives this way. The tool may have run: check whether it did before running it again, and when you …` | Not on a page yet |
| `The second argument must be a string, a stream or an Execa child process.` | Not on a page yet |
| `The segmenter passed must have a granularity of "word"` | Not on a page yet |
| `The skill "${…}" was not loaded because of a fault in Claude Code: it has no record of the files that the skill was verified against. Do not try again.` | Not on a page yet |
| `The stream has already been transformed.` | Not on a page yet |
| `The stream has been consumed by other callbacks.` | Not on a page yet |
| `The target child process's stdin must be available.` | Not on a page yet |
| `The temp directory is unavailable in a diskless session: nothing is created, verified or written under the shared per-uid temp root` | Not on a page yet |
| `The tool call was interrupted before a result was received. It may or may not have completed on the server — verify before assuming it succeeded, and retry if needed.` | Not on a page yet |
| `The verifyIdToken method requires an ID Token` | Not on a page yet |
| `This agent has been stopped and its stop is still completing; it cannot resume other agents.` | Not on a page yet |
| `This agent has been stopped and its stop is still completing; it cannot start monitors.` | Not on a page yet |
| `This call was interrupted before the monitor started; nothing is running.` | Not on a page yet |
| `This eval run stubs artifact publishing locally and has no artifact control plane: only publishing (the default action) is available here — list, delete, comments, replies, watches, database writes, a…` | Not on a page yet |
| ``This eval run stubs artifact publishing locally: `url` may only name an artifact this run published (an eval-stub:// link), never a live claude.ai artifact. Omit `url` to publish fresh.`` | Not on a page yet |
| `This hook's matcher cannot be tested in a cloud session: it has to be rewritten.` | Not on a page yet |
| `This hosted session (claude-code-server) keeps no device key on its machine` | Not on a page yet |
| `This link's Artifact type has no readable name, so it cannot be checked against the permission rule ${…}. Nothing was listed; tell the user.` | Not on a page yet |
| `This machine already has a sign-in from another tool that Claude Code cannot replace. Sign out with that tool, then try again.` | Not on a page yet |
| `This machine is set up for workload identity federation, which signs in on its own. If you need a different sign-in, ask whoever configured it.` | Not on a page yet |
| `This method accepts an options object as the first parameter, which includes the idToken, audience, and maxExpiry.` | Not on a page yet |
| `This operation needs a plan_token here — use finalize_plan (listing the destination paths in writes) and pass the returned plan_token. (It can run without one only under an existing project write gran…` | Not on a page yet |
| `This plugin has no ${…} ${…}.${…}` | Not on a page yet |
| `This plugin is listed on claude.ai but cannot be installed (no published version, or its content scan blocks it).` | Not on a page yet |
| `This plugin source uses mode "link", which is not supported on Windows yet; the marketplace can use mode "copy" instead.` | Not on a page yet |
| `This plugin uses a source type your Claude Code version does not support. Update Claude Code and try again.` | Not on a page yet |
| `This plugin's headersHelper was not run: ${…}.` | Not on a page yet |
| `This plugin's marketplace entry is invalid: ${…}` | Not on a page yet |
| `This profile is bound to a different Anthropic deployment, so Claude Code will not replace it here. Sign out of it with the tool that created it, then try again.` | Not on a page yet |
| `This profile keeps its sign-in somewhere custom, so Claude Code cannot replace it. Sign out of it with the tool that created it, then try again.` | Not on a page yet |
| `This runtime has no Bun.ant.CellSegmenter. Run Claude Code on the @anthropic-ai/bun-internal version pinned in package.json.` | Not on a page yet |
| ``This schema contains multiple valid literal values. Use `.values` instead.`` | Not on a page yet |
| `This session doesn't save settings, so the ${…} can't be turned ${…}` | Not on a page yet |
| `This session requires a trusted device, and it still refused this computer after its trusted-device enrollment was renewed. Open the session at claude.ai/code or in the Claude app instead.` | Not on a page yet |
| `This session uses ${…}, which does not use Anthropic Console sign-in.` | Not on a page yet |
| `This session's credential cannot record the project approval — approve this project from an interactive Claude Code session (run the write there and accept the approval card), then retry here: this se…` | Not on a page yet |
| `This skill, command or hook and the arguments filled into it add up to more than ${…} characters. Use shorter arguments or fewer placeholders such as $ARGUMENTS.` | Not on a page yet |
| `This teammate's task could not be found, so plan mode was not exited. Ask the lead to approve your plan.` | Not on a page yet |
| `This workflow run hides its script, and this session has not loaded that script, so it cannot resume the run. Start a new run without resumeFromRunId.` | Not on a page yet |
| `This workflow run hides its script, so it can only be resumed with its original script file, unedited. To run a changed script, start a new run without resumeFromRunId.` | Not on a page yet |
| `Timeout must be between ${…} and ${…} milliseconds.` | Not on a page yet |
| `TmuxBackend not registered. Import TmuxBackend.ts before using the registry.` | Not on a page yet |
| `To add an Option object use addOption() instead of option() or requiredOption()` | Not on a page yet |
| `To many thunks active` | Not on a page yet |
| `To remove from a specific scope, use:` | Not on a page yet |
| `Token does not contain a Protected Header` | Not on a page yet |
| `Token refresh failed: ${…}` | Not on a page yet |
| `Token used too early, ${…} < ${…}: ${…}` | Not on a page yet |
| `Token used too late, ${…} > ${…}: ${…}` | Not on a page yet |
| `Too few arguments provided` | Not on a page yet |
| `Tool ${…} not found` | Not on a page yet |
| `Tool use input must be a string or object` | Not on a page yet |
| `Transcript file too large to load as JSON (${…} bytes)` | Not on a page yet |
| `Transcript messages must be an array` | Not on a page yet |
| `Transcript must be an array of messages or an object with a messages array` | Not on a page yet |
| `Transport already started` | Not on a page yet |
| `Transport is closed` | Not on a page yet |
| `Tree: a box or a text can’t go inside text, only a span` | Not on a page yet |
| `Tree: a span only goes inside text` | Not on a page yet |
| `Tree: only a text or a span has text` | Not on a page yet |
| `Tree: that node is not this tree’s` | Not on a page yet |
| `Truncated event message received.` | Not on a page yet |
| `Try manually updating with:` | Not on a page yet |
| `Try running "claude doctor" for diagnostics` | Not on a page yet |
| `Try running with sudo or fix npm permissions` | Not on a page yet |
| `TurnController: used before its screen bound a host` | Not on a page yet |
| `Type mismatch in reflection object handling` | Not on a page yet |
| `URL is required.` | Not on a page yet |
| `URL is too long: ${…}` | Not on a page yet |
| `URL-encoded traversal in path key: "${…}"` | Not on a page yet |
| `UUID byte range ${…}:${…} is out of buffer bounds` | Not on a page yet |
| `Unable to build claude.ai connector auth URL (missing org or server id)` | Not on a page yet |
| `Unable to compress image (${…}) to fit within ${…} — ${…}. ${…}` | Not on a page yet |
| `Unable to compress image (${…}) to fit within ${…}. Please use a smaller image.` | Not on a page yet |
| `Unable to convert string '${…}' to bool` | Not on a page yet |
| `Unable to create API key. The server accepted the request but did not return a key.` | Not on a page yet |
| `Unable to determine AWS region due to missing "options.credential_source.region_url"` | Not on a page yet |
| `Unable to determine AWS role name due to missing "options.credential_source.url"` | Not on a page yet |
| `Unable to execute PowerShell. Ensure that it is installed in your system` | Not on a page yet |
| `Unable to fetch latest version from npm registry` | Not on a page yet |
| `Unable to get organization UUID` | Not on a page yet |
| `Unable to parse boolean value "${…}"` | Not on a page yet |
| `Unable to parse float value: ${…}` | Not on a page yet |
| `Unable to parse the output of PowerShell. Received output: ${…}` | Not on a page yet |
| `Unable to parse the subject_token from the credential_source URL` | Not on a page yet |
| `Unable to parse the subject_token from the credential_source file` | Not on a page yet |
| `Unable to read managed policy settings, which may restrict the API providers this machine may use (allowedProviders). Contact your administrator.` | Not on a page yet |
| `Unable to resize image — ${…}, and ${…}, so it cannot be sent. ${…}` | Not on a page yet |
| `Unable to resize image — could not verify image dimensions are within the ${…}x${…}px API limit.` | Not on a page yet |
| `Unable to resize image — image processing is unavailable and dimensions could not be read from the file header. Please convert the image to PNG, JPEG, GIF, or WebP.` | Not on a page yet |
| `Unable to resolve ${…}, imported by ${…}` | Not on a page yet |
| `Unexpected "${…}" in template expression` | Not on a page yet |
| `Unexpected "${…}" stdout in template expression` | Not on a page yet |
| `Unexpected ${…} command. Expected 'prompt' command. Use /${…} directly in the main conversation.` | Not on a page yet |
| `Unexpected auth result: ${…}` | Not on a page yet |
| `Unexpected data type: ${…}${…}${…}` | Not on a page yet |
| `Unexpected endpoint property type: ${…}` | Not on a page yet |
| `Unexpected endpoint property: ${…}` | Not on a page yet |
| `Unexpected read state` | Not on a page yet |
| `Unexpected response from Azure CLI when getting token. Expected "expiresOn" to be a RFC3339 date string. Got: "${…}"` | Not on a page yet |
| `Unexpected stream implementation, expect Blob or ReadableStream, got ${…}` | Not on a page yet |
| `Unexpected stream implementation, expect Stream.Readable instance, got ${…}` | Not on a page yet |
| `Unexpected string encoding replacement character. This should be an unreachable error.` | Not on a page yet |
| `Unexpected value for event passed to hook : '${…}'. Expecting one of '${…}'` | Not on a page yet |
| `Unexpected value for key ${…}: ${…}. Value should be serialized to string first.` | Not on a page yet |
| `Unexpected value for position to addHelpText. Expecting one of '${…}'` | Not on a page yet |
| `Unexpected value in exhaustive check` | Not on a page yet |
| `Unhandled outcome of a read of the Directory` | Not on a page yet |
| `Unhandled repo validation status: ${…}` | Not on a page yet |
| `Unhandled schema-value pair ${…}=${…}` | Not on a page yet |
| `Unicode sanitization reached maximum iterations (${…}) for input: ${…}` | Not on a page yet |
| `Unicode-normalized traversal in path key: "${…}"` | Not on a page yet |
| `Unions must have exactly one non-null member. Keys ${…} were not null.` | Not on a page yet |
| `Unions must have exactly one non-null member. None were found.` | Not on a page yet |
| `Universe domain ${…} in source credentials does not match ${…} universe domain set for impersonated credentials.` | Not on a page yet |
| `Unknown EC Level: ${…}` | Not on a page yet |
| ``Unknown `METADATA_SERVER_DETECTION` env variable. Got `${…}`, but it should be `${…}`, or unset`` | Not on a page yet |
| `Unknown browser ID: ${…}` | Not on a page yet |
| `Unknown command: ${…}` | Not on a page yet |
| `Unknown data type: ${…}` | Not on a page yet |
| `Unknown deep link action: "${…}"` | Not on a page yet |
| `Unknown endpoint rule: ${…}` | Not on a page yet |
| `Unknown error: Failed to fetch ID token` | Not on a page yet |
| `Unknown exporter type set in OTEL_LOGS_EXPORTER env var: ${…}` | Not on a page yet |
| `Unknown exporter type set in OTEL_METRICS_EXPORTER env var: ${…}` | Not on a page yet |
| `Unknown exporter type set in OTEL_TRACES_EXPORTER env var: ${…}` | Not on a page yet |
| `Unknown field ${…} for ${…}` | Not on a page yet |
| `Unknown format option provided.` | Not on a page yet |
| `Unknown hook decision type: ${…}. Valid types are: approve, block` | Not on a page yet |
| `Unknown hook permissionDecision type: ${…}. Valid types are: allow, deny, ask, defer` | Not on a page yet |
| `Unknown line ${…} ${…}` | Not on a page yet |
| `Unknown log level '${…}'. Acceptable values: ${…}` | Not on a page yet |
| `Unknown mode: ${…}` | Not on a page yet |
| `Unknown parameter structure ${…}` | Not on a page yet |
| `Unknown protocol set in OTEL_EXPORTER_OTLP_LOGS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${…}` | Not on a page yet |
| `Unknown protocol set in OTEL_EXPORTER_OTLP_METRICS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${…}` | Not on a page yet |
| `Unknown protocol set in OTEL_EXPORTER_OTLP_TRACES_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${…}` | Not on a page yet |
| `Unknown skill: ${…}` | Not on a page yet |
| `Unknown state` | Not on a page yet |
| `Unmergable intersection. Error path: ${…}` | Not on a page yet |
| `Unprocessed schema. This is a bug in Zod.` | Not on a page yet |
| `Unrecognizable event type: ${…}` | Not on a page yet |
| `Unrecognized endpoint parameter instruction: ${…}` | Not on a page yet |
| `Unrecognized hash format: ${…}` | Not on a page yet |
| `Unrecognized header type tag` | Not on a page yet |
| `Unrecognized key: "${…}"` | Not on a page yet |
| `Unrecognized load balancing config name ${…}` | Not on a page yet |
| `Unsupported "kty" (Key Type) Parameter value` | Not on a page yet |
| `Unsupported Aggregation` | Not on a page yet |
| `Unsupported JWE "zip" (Compression Algorithm) Header Parameter value` | Not on a page yet |
| `Unsupported JWE "zip" (Compression Algorithm) Header Parameter value.` | Not on a page yet |
| `Unsupported JWE Algorithm: ${…}` | Not on a page yet |
| `Unsupported JWE Content Encryption Algorithm` | Not on a page yet |
| `Unsupported address family: ${…}` | Not on a page yet |
| `Unsupported certificate format ${…}` | Not on a page yet |
| `Unsupported client authentication method: ${…}` | Not on a page yet |
| `Unsupported control request subtype` | Not on a page yet |
| `Unsupported control request subtype: ${…}` | Not on a page yet |
| `Unsupported conversion from ${…} to Uint8ArrayBlobAdapter.` | Not on a page yet |
| `Unsupported endpoint mode: ${…}. Select from ${…}` | Not on a page yet |
| `Unsupported git URL protocol (only https/http/ssh/user@host:path allowed): ${…}` | Not on a page yet |
| `Unsupported git source type: ${…}` | Not on a page yet |
| `Unsupported input ${…}` | Not on a page yet |
| `Unsupported key algorithm` | Not on a page yet |
| `Unsupported marketplace source type` | Not on a page yet |
| `Unsupported marketplace source type for refresh` | Not on a page yet |
| `Unsupported named curve` | Not on a page yet |
| `Unsupported platform - Claude Desktop integration only works on macOS and WSL.` | Not on a page yet |
| `Unsupported platform: ${…} - Claude Desktop integration only works on macOS and WSL.` | Not on a page yet |
| `Unsupported platform: darwin` | Not on a page yet |
| `Unsupported plugin type: ${…}` | Not on a page yet |
| `Unsupported protocol version '${…}'` | Not on a page yet |
| `Unsupported schema: ${…}` | Not on a page yet |
| `Unsupported scheme` | Not on a page yet |
| `Unsupported server type: ${…}` | Not on a page yet |
| `Unsupported task type: ${…}` | Not on a page yet |
| `Unsupported type: ${…}` | Not on a page yet |
| `Upload canceled` | Not on a page yet |
| `Usage: ${…}` | Not on a page yet |
| `UsernamePasswordCredential: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.` | Not on a page yet |
| `UsernamePasswordCredential: password is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.` | Not on a page yet |
| `UsernamePasswordCredential: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.` | Not on a page yet |
| `UsernamePasswordCredential: username is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.` | Not on a page yet |
| `Validation failed but no issues detected.` | Not on a page yet |
| `Value ${…} out of range [${…}, ${…}]` | Not on a page yet |
| `Version ${…} is not available for installation. Use 'stable' or 'latest'.` | Not on a page yet |
| `Version of executable is not currently supported, maximum supported version is ${…}.` | Not on a page yet |
| `Views with a specified name must be declared with an instrument selector that selects at most one instrument per meter.` | Not on a page yet |
| `Waking session ${…}…` | Not on a page yet |
| `Warning: ${…}` | Not on a page yet |
| `Warning: ${…} tracked ${…} skipped: ${…}. Run with --debug for the paths.` | Not on a page yet |
| `Warning: --client-id, --client-secret, --callback-port, and --xaa are only supported for HTTP/SSE transports and will be ignored for stdio.` | Not on a page yet |
| `Warning: The command "${…}" looks like a URL, but is being interpreted as a stdio server as --transport was not specified.` | Not on a page yet |
| `Web search is not available on this Foundry deployment.` | Not on a page yet |
| `WebFetch cannot fetch localhost or other hostnames without a dot. To reach a local server, use Bash with curl instead.` | Not on a page yet |
| `WebFetch on claude-code-server needs the CCR web-fetch proxy` | Not on a page yet |
| `Webhook headers are required in order to verify the signature` | Not on a page yet |
| `Webhook key must not be null or empty in order to unwrap` | Not on a page yet |
| `When adding a listener with a context, you should remove it with the same context` | Not on a page yet |
| `When using credentials, the ServiceClientOptions must contain either a endpoint or a credentialScopes. Unable to create a bearerTokenAuthenticationPolicy` | Not on a page yet |
| `WildcardGrantSet: deniedBundleIds must be non-empty — an every-app grant policy without a policy denylist is a wiring bug` | Not on a page yet |
| `Worker ID is required for permission requests` | Not on a page yet |
| `Worker name is required for permission requests` | Not on a page yet |
| `Workflow aborted` | Not on a page yet |
| `Workflow: launching needs the executor (call.runEngine)` | Not on a page yet |
| `Workload identity federation is configured in this environment (ANTHROPIC_FEDERATION_RULE_ID and ANTHROPIC_ORGANIZATION_ID), and it takes precedence over the default profile. Set ANTHROPIC_PROFILE to …` | Not on a page yet |
| ``Workspace trust not yet accepted. Run `claude` once in this directory and accept the trust dialog, then retry with --worktree.`` | Not on a page yet |
| `Worktree mode requires a git repository or WorktreeCreate hooks. Directory ${…} has neither.` | Not on a page yet |
| `WorktreeCreate hook failed: ${…}` | Not on a page yet |
| `WorktreeCreate hook failed: hook is configured but did not run (workspace not trusted or matcher mismatch)` | Not on a page yet |
| `WorktreeCreate hook failed: hook succeeded but returned no worktree path (command: echo the path to stdout; http/callback: return hookSpecificOutput.worktreePath)` | Not on a page yet |
| `Write refused; nothing in the project was changed. The doc at this path is no longer the version in if_version: someone else, another session, or an earlier save of yours has changed it. Call project_…` | Not on a page yet |
| `Write refused; nothing in the project was changed. This session cannot check if_version. Call project_read on this path, make your change in the text that it returns, and write again without if_versio…` | Not on a page yet |
| `Write refused; nothing in the project was changed. This write would put the project over its maximum size. Any doc already at this path still holds its old content; do not delete it to retry, because …` | Not on a page yet |
| `Write to ${…} failed (${…}) after the target was truncated. The new content was preserved at ${…}.` | Not on a page yet |
| `Write verification failed: ${…} is ${…} bytes on disk, expected ${…}. The filesystem may have silently truncated the write (network drive / cloud sync).` | Not on a page yet |
| `Write: a call needs the message that issued it` | Not on a page yet |
| `Writing to this project needs a one-time approval — retry the write: you will be shown the approval, or routed to the per-batch finalize_plan flow.` | Not on a page yet |
| `Writing to this project needs a one-time approval, which cannot be granted automatically in this permission mode — use finalize_plan with writes/deletes and pass the returned plan_token.` | Not on a page yet |
| `Writing to this project needs a project write grant that is not currently active (it may have been revoked) — use finalize_plan with writes (and deletes if needed), then pass the returned plan_token. …` | Not on a page yet |
| `Wrong number of segments in token: ${…}` | Not on a page yet |
| `Wrong recipient, payload audience != requiredAudience` | Not on a page yet |
| `XAA IdP: OIDC discovery failed: HTTP ${…} at ${…}` | Not on a page yet |
| `XAA IdP: OIDC discovery failed: issuer is not a valid URL: ${…}` | Not on a page yet |
| `XAA IdP: OIDC discovery returned non-JSON at ${…} (captive portal or proxy?)` | Not on a page yet |
| `XAA IdP: invalid OIDC metadata: ${…}` | Not on a page yet |
| `XAA IdP: refusing non-HTTPS token endpoint: ${…}` | Not on a page yet |
| `XAA IdP: token response missing id_token (check scope=openid)` | Not on a page yet |
| `XAA is not enabled (set CLAUDE_CODE_ENABLE_XAA=1). Remove 'oauth.xaa' from server '${…}' to use the standard consent flow.` | Not on a page yet |
| `XAA: AS metadata discovery failed (${…})` | Not on a page yet |
| `XAA: AS metadata discovery failed: issuer mismatch: expected ${…}, got ${…}` | Not on a page yet |
| `XAA: AS metadata discovery failed: no valid metadata at ${…}` | Not on a page yet |
| `XAA: PRM discovery failed for ${…} (${…})` | Not on a page yet |
| `XAA: PRM discovery failed: PRM missing resource or authorization_servers` | Not on a page yet |
| `XAA: PRM discovery failed: PRM resource mismatch: expected ${…}, got ${…}` | Not on a page yet |
| `XAA: jwt-bearer grant failed: HTTP ${…}: ${…}` | Not on a page yet |
| `XAA: jwt-bearer grant returned non-JSON (captive portal?) at ${…}` | Not on a page yet |
| `XAA: jwt-bearer response did not match expected shape: ${…}` | Not on a page yet |
| `XAA: no IdP connection configured. Run 'claude mcp xaa setup --issuer <url> --client-id <id> --client-secret' to configure.` | Not on a page yet |
| `XAA: no authorization server supports jwt-bearer. Tried: ${…}` | Not on a page yet |
| `XAA: oauth.xaa must be set` | Not on a page yet |
| `XAA: refusing non-HTTPS token endpoint: ${…}` | Not on a page yet |
| `XAA: server '${…}' needs an AS client_id. Re-add with --client-id.` | Not on a page yet |
| `XAA: token exchange failed: HTTP ${…}: ${…}` | Not on a page yet |
| `XAA: token exchange response did not match expected shape: ${…}` | Not on a page yet |
| `XAA: token exchange response missing access_token: ${…}` | Not on a page yet |
| `XAA: token exchange returned non-JSON (captive portal?) at ${…}` | Not on a page yet |
| `XAA: token exchange returned unexpected issued_token_type: ${…}` | Not on a page yet |
| `XML serialization unsupported!` | Not on a page yet |
| `YAML parse failed: ${…}` | Not on a page yet |
| ``You cannot provide both `authClient` and `googleAuth`. Please provide only one of them.`` | Not on a page yet |
| `You must pass an array of schemas to z.tuple([ ... ])` | Not on a page yet |
| `You must run claude --teleport ${…} from a checkout of ${…}. This repo is ${…}.` | Not on a page yet |
| `You must run claude --teleport ${…} from a checkout of ${…}.${…}` | Not on a page yet |
| `You need to specify a canvas element` | Not on a page yet |
| `Your Claude Code executable could not be restored after the failed update and no preserved copy was found. Reinstall with: npm i -g ${…}` | Not on a page yet |
| `Your Claude Code executable could not be restored after the failed update. It was preserved at ${…}` | Not on a page yet |
| ``Your Console sign-in doesn't record an organization, so a cloud session can't be started. Sign in again with /login or `ant auth login`.`` | Not on a page yet |
| `Your cloud-sessions sign-in could not be renewed (${…}). Try again.` | Not on a page yet |
| `Your session has expired for the trusted-device check. Run /login to re-authenticate, then retry.` | Not on a page yet |
| `Your session has expired. Please run /login to sign in again.` | Not on a page yet |
| `[${…}] All sockets failed for tabs_context_mcp` | Not on a page yet |
| `[${…}] Bridge disconnected before tool call was sent` | Not on a page yet |
| `[${…}] Bridge not connected` | Not on a page yet |
| `[${…}] Cannot send request: not connected` | Not on a page yet |
| `[${…}] Cannot send request: not paired` | Not on a page yet |
| `[${…}] Claude in Chrome isn't paired with your browser (${…})` | Not on a page yet |
| `[${…}] Insecure socket directory permissions: ${…} (expected 0700). Directory may have been tampered with.` | Not on a page yet |
| `[${…}] Insecure socket permissions: ${…} (expected 0600). Socket may have been tampered with.` | Not on a page yet |
| `[${…}] No Chrome extension connected after discovery` | Not on a page yet |
| `[${…}] No connected sockets available` | Not on a page yet |
| `[${…}] Pairing changed while sealing` | Not on a page yet |
| `[${…}] Path exists but it's not a socket: ${…}` | Not on a page yet |
| `[${…}] Socket directory is a symlink: ${…}. Directory may have been tampered with.` | Not on a page yet |
| `[Claude in Chrome] could not load the Cloud gateway sign-in, so this server runs as if it were not signed in to the gateway, until it restarts. Fix this error: ${…}` | Not on a page yet |
| `[DaemonLock] Failed to acquire daemon lock: ${…}${…}` | Not on a page yet |
| `[DaemonLock] Failed to read daemon lock: ${…}${…}` | Not on a page yet |
| `[DaemonLock] Failed to remove daemon lock: ${…}${…}` | Not on a page yet |
| `[DaemonLock] Failed to replace daemon lock: ${…}${…}` | Not on a page yet |
| `[RemoteSessionManager] Cannot send: not connected` | Not on a page yet |
| `[Tasks] Could not list the task list to determine its highest task id` | Not on a page yet |
| `[Tasks] Failed to create a task: could not claim a free task id after ${…} attempts; last tried ${…}, which exists and could not be claimed — the task listing may have failed, or the entry is not a ta…` | Not on a page yet |
| `[Tasks] Failed to create task ${…}: ${…}` | Not on a page yet |
| `[Tasks] Failed to write task ${…}: ${…}` | Not on a page yet |
| `[bg-spare] claim recv failed: ${…}` | Not on a page yet |
| `[bg-spare] missing claim sock path` | Not on a page yet |
| `[bg-spare] post-claim init failed: ${…}` | Not on a page yet |
| `[bg-spare] uncaughtException: ${…}` | Not on a page yet |
| `[code review] Not starting: Claude Code could not make itself non-dumpable (${…}), so the review's commands could read its tokens from memory. Start it with the released claude binary (check --exec-pa…` | Not on a page yet |
| `[code review] Not starting: in a code review Claude Code must get its two tokens on file descriptors 4 and 5, announced by CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR and CLAUDE_CODE_OAUTH_TOKEN_FILE_D…` | Not on a page yet |
| `[gateway] ${…} ${…} ${…}` | Not on a page yet |
| `[jobs] v5 pins update failed: ${…}` | Not on a page yet |
| `[jobs] v5 sidecar delete failed: ${…}` | Not on a page yet |
| `[preload] claim recv failed: ${…}` | Not on a page yet |
| `[preload] uncaughtException: ${…}` | Not on a page yet |
| `[publishedCatalog] redirect refused: a hop left the host the request was pinned to` | Not on a page yet |
| `[remote-io] warning: ${…}` | Not on a page yet |
| `[runner:session] per-session ${…} ${…} overlaps the child's auto-allowed write scope (${…}) — refusing to spawn` | Not on a page yet |
| `[runner:session] refusing to pass unsafe ref to checkout hook: ${…}` | Not on a page yet |
| `[runner:session] refusing to pass unsafe repo URL to checkout hook: ${…}` | Not on a page yet |
| `[toJSONSchema]: Non-representable type encountered: ${…}` | Not on a page yet |
| `[useRemoteSession] Cannot send control request (no manager): not connected` | Not on a page yet |
| `` `File` is not defined as a global, which is required for file uploads.${…} `` | Not on a page yet |
| `` `ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream` `` | Not on a page yet |
| `` `action` no longer names what was approved — this input was approved as another Artifact action, not a publish; nothing was published; retry so it is checked again `` | Not on a page yet |
| `` `action` no longer names what was approved — this input was approved as another Artifact action, not this live-edit; nothing was sent; retry so it is checked again `` | Not on a page yet |
| `` `action` no longer names what was approved — this input was approved as another Artifact action, not this reply; nothing was posted; retry so it is checked again `` | Not on a page yet |
| `` `action` no longer names what was approved — this input was approved as another Artifact action, not this resolve; nothing was changed; retry so it is checked again `` | Not on a page yet |
| `` `action` no longer names what was approved — this input was approved as another Artifact action, not this sync; nothing was sent; retry so it is checked again `` | Not on a page yet |
| `` `action` or `url` no longer names the ${…} that was approved — nothing was changed; retry so it is checked again `` | Not on a page yet |
| `` `action` or `url` no longer names the artifact read that was approved — nothing was read; retry so it is checked again `` | Not on a page yet |
| `` `action` or `url` no longer names the artifact upload that was approved — retry so it is checked again `` | Not on a page yet |
| `` `action` or `url` no longer names the artifact watch that was approved — nothing was armed; retry so it is checked again `` | Not on a page yet |
| `` `action` or `url` no longer names the comments read that was approved — nothing was read; retry so it is checked again `` | Not on a page yet |
| `` `action` or `url` no longer names the database read that was approved — nothing was read; retry so it is checked again `` | Not on a page yet |
| `` `action` or `url` no longer names the database write that was approved — nothing was written; retry so it is checked again `` | Not on a page yet |
| `` `action` or `url` no longer names the diagnostics read that was approved — nothing was read; retry so it is checked again `` | Not on a page yet |
| `` `action` or `url` no longer names the page-data read that was approved — nothing was read; retry so it is checked again `` | Not on a page yet |
| `` `action` or `url` no longer names the room_send that was approved — nothing was sent; retry so it is checked again `` | Not on a page yet |
| `` `action` or `url` no longer names the version that was approved — this input was approved as another Artifact action or for another artifact; nothing was sent; retry so it is checked again `` | Not on a page yet |
| `` `action`, `url`, or `asset_id` no longer names what was approved — nothing was done; retry so it is checked again `` | Not on a page yet |
| `` `action`, `url`, or `path` no longer names what was approved — nothing was done; retry so it is checked again `` | Not on a page yet |
| `` `allowEmptyArrays` option can only be `true` or `false`, when provided `` | Not on a page yet |
| `` `auto_open`: "after_first_write" has nothing to wait for with `file_path` — remove it `` | Not on a page yet |
| `` `callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`? `` | Not on a page yet |
| `` `commaRoundTrip` must be a boolean, or absent `` | Not on a page yet |
| `` `db_op` no longer names the database write that was approved — nothing was written; retry so it is checked again `` | Not on a page yet |
| `` `delaySeconds` and `reason` are required when `stop` is not true. `` | Not on a page yet |
| `` `dev:` was removed — the gateway is Postgres-only. Set store.postgres_url (local: docker run --rm -p 5432:5432 -e POSTGRES_HOST_AUTH_METHOD=trust postgres) `` | Not on a page yet |
| `` `encodeDotInKeys` option can only be `true` or `false`, when provided `` | Not on a page yet |
| `` `fetch` is not defined as a global; Either pass `fetch` to the client, `new Anthropic({ fetch })` or polyfill the global, `globalThis.fetch = fetch` `` | Not on a page yet |
| `` `file_path` must not contain NUL — nothing was read or sent `` | Not on a page yet |
| `` `file_paths` cannot be used from a script — pass one `file_path` per call `` | Not on a page yet |
| `` `files` needs `file_path` — name one data file as `file_path` and the rest in `files` `` | Not on a page yet |
| `` `filter` needs to be a string, array, or function `` | Not on a page yet |
| `` `if_version` no longer matches the database write that was approved — nothing was written; retry so it is checked again `` | Not on a page yet |
| `` `noop` is required when `stop` is not true. `` | Not on a page yet |
| `` `out_dir` no longer names the destination this read was approved for — nothing was fetched; retry so it is checked again `` | Not on a page yet |
| `` `out_dir` no longer names the destination this read was approved to save to — nothing was fetched; retry so it is checked again `` | Not on a page yet |
| `` `prompt` is required when `stop` is not true. `` | Not on a page yet |
| `` `thread_id` (read one thread) and `cursor` (continue the list) cannot be combined — pass one. `` | Not on a page yet |
| `` `type_url` must be an Artifact URL `` | Not on a page yet |
| `` `type_url` no longer names the Artifact type that was approved — nothing was created; retry so it is checked again `` | Not on a page yet |
| `` `url` must be an artifact URL for action "${…}" `` | Not on a page yet |
| `` `url` must be an artifact URL for action "comments" `` | Not on a page yet |
| `` `url` must be an artifact URL for action "upload_asset" `` | Not on a page yet |
| `` `url` must be an artifact URL for this session's claude.ai for action "read" `` | Not on a page yet |
| `` `version` must be an id from action "list" with this `url`. `` | Not on a page yet |
| `` `writes[${…}].op` changed after this batch was approved — nothing was written; retry so it is checked again `` | Not on a page yet |
| `a PATH directory could not be examined for keychain credential helpers (${…}), so the Bash sandbox cannot exclude them — a Bash-granting evaluation cannot run in this environment` | Not on a page yet |
| `a Uint8Array was expected` | Not on a page yet |
| `a bash command is already running` | Not on a page yet |
| `a built-in module has no registerPlugin function: ${…}` | Not on a page yet |
| `a built-in plugin's hooks are not run for another machine` | Not on a page yet |
| `a bundled text did not load as a string` | Not on a page yet |
| `a cloud credential file path in this environment (AWS_SHARED_CREDENTIALS_FILE, GOOGLE_APPLICATION_CREDENTIALS and the like) has a glob character (* ? [ ]) in it, so the Bash sandbox cannot exclude it …` | Not on a page yet |
| `a corroborated artifact publish is missing from the staging directory (${…} of ${…})` | Not on a page yet |
| `a default value for a required argument is never used: '${…}'` | Not on a page yet |
| `a directory moved while its names were being read` | Not on a page yet |
| ``a fact may not carry `${…}` — the host sets it on the row`` | Not on a page yet |
| `` a fact must be an object with a non-empty string `topic` `` | Not on a page yet |
| `a file could not be inflated, or holds more than its stated size` | Not on a page yet |
| `a file does not inflate to its stated size` | Not on a page yet |
| `a file does not match its stated SHA-256` | Not on a page yet |
| `a file's offset and length reach past the end of the archive` | Not on a page yet |
| `a function was expected` | Not on a page yet |
| `a held-directory leaf must be one plain name` | Not on a page yet |
| `a list of files needs the archive that holds them` | Not on a page yet |
| `a lossless WebP encode wrote a file that is not lossless` | Not on a page yet |
| `a name is in the list twice` | Not on a page yet |
| `a newer turn began before the compaction could be applied` | Not on a page yet |
| `a pattern must be a JSON object (nested objects as subsets, arrays exact, v("x") binds)` | Not on a page yet |
| `a permission entry has an impossible size` | Not on a page yet |
| `a plugin's list claims a length no list has (got ${…})` | Not on a page yet |
| `a proxy helper set by this project is not run by this command` | Not on a page yet |
| `` a publish with `type_url` always creates a new Artifact whose page and settings come from the type — remove `url`, `capabilities`, `contract`, `deadline`, and `force` `` | Not on a page yet |
| `a run restored from the journal cannot be founded` | Not on a page yet |
| `a schema whose subtree contains a reference cycle` | Not on a page yet |
| `a served tool must have an object input schema` | Not on a page yet |
| `a settings file could not be read` | Not on a page yet |
| `a settings file names another host` | Not on a page yet |
| `a string was expected` | Not on a page yet |
| `a test start folder must be absolute` | Not on a page yet |
| `a timer takes a function` | Not on a page yet |
| `a turn is in flight; the conversation compacts between turns` | Not on a page yet |
| `a value of state is JSON data of at most ${…} characters` | Not on a page yet |
| `accepted settings text exceeds the settings size limit` | Not on a page yet |
| `account-memory text still matched a search key after 16 replacement rounds` | Not on a page yet |
| `action "${…}" is not available in this session` | Not on a page yet |
| `action "copy_from" is not enabled for this account` | Not on a page yet |
| `action "delete" is not available in this session` | Not on a page yet |
| `add "trackErrors" to keyword definition` | Not on a page yet |
| `addKeywords: keyword must be string or non-empty array` | Not on a page yet |
| `addService() requires two objects as arguments` | Not on a page yet |
| `addSessionWorktree: worktreePath must not equal canonicalRepoPath` | Not on a page yet |
| `add_directory mount_path must be under /uploads/` | Not on a page yet |
| `add_directory mount_path must be under /uploads/ and not under /uploads/.home/` | Not on a page yet |
| `address must be a string` | Not on a page yet |
| `adopted agent ${…} declares forked-skill ${…} but its scoping record is unusable (${…})` | Not on a page yet |
| `adopted agent ${…} declares forked-skill ${…} but its scoping record names a different skill` | Not on a page yet |
| `adopted agent ${…} has an unusable forked-skill scoping record (${…})` | Not on a page yet |
| ``advance(${…}): ${…} timer ticks fired and more were due; advance in smaller steps, or check for an `every` the module re-arms on each tick`` | Not on a page yet |
| `after must be the next value from a previous list_assets result` | Not on a page yet |
| `agent stop sibling: no storage key for this path` | Not on a page yet |
| `agent stop sibling: no storage key while diskless` | Not on a page yet |
| `agent stop sibling: storage delete failed` | Not on a page yet |
| `agent stop sibling: storage stat failed` | Not on a page yet |
| `agent stop sibling: storage write failed` | Not on a page yet |
| `agent() opts.bashCommandClamp entry '${…}' must be a '${…}(<command or prefix>)' permission rule (tool name case-sensitive, non-empty content with no leading/trailing whitespace inside the parens); it…` | Not on a page yet |
| `agent() opts.bashCommandClamp must be an array of non-empty strings; got ${…}. Refusing the spawn rather than running it un-clamped.` | Not on a page yet |
| `agent() opts.disallowedTools must be an array of non-empty tool-name strings (e.g. ['Bash', 'Write']); got ${…}. Refusing the spawn rather than running it un-narrowed.` | Not on a page yet |
| `agent({agentType}): ${…}` | Not on a page yet |
| `agent({agentType}): '${…}' is denied by permission rule '${…}(${…})' from ${…}.` | Not on a page yet |
| `agent({agentType}): agent type '${…}' not found. Available agents: ${…}` | Not on a page yet |
| `agent({isolation:'remote', schema}) completed without structured output: ${…}.` | Not on a page yet |
| `agent({isolation:'remote'}) is not available in this build` | Not on a page yet |
| `agent({schema}) received an invalid JSON Schema: ${…}` | Not on a page yet |
| `agent({schema}): StructuredOutput retry cap (${…}) exceeded — ${…} failed ${…} with no valid output${…}` | Not on a page yet |
| `agent({schema}): subagent completed without calling StructuredOutput (after in-conversation nudge)` | Not on a page yet |
| `agent-type hooks are not supported for ${…} events (no conversation context is available). Use a command-type hook instead.` | Not on a page yet |
| `agent-type hooks are not supported for PermissionRequest events (an agent hook answers ok or not ok, and cannot return the allow / deny decision a permission request needs). Use a command- or http-typ…` | Not on a page yet |
| `agent_files contains duplicate name: ${…}` | Not on a page yet |
| `agent_files do not form a valid --agents value: ${…}` | Not on a page yet |
| `agent_files entry '${…}' is not an agent definition named '${…}' (frontmatter needs name: ${…} and a description)` | Not on a page yet |
| `agent_files entry '${…}' rejected (content must be a string of at most ${…} bytes)` | Not on a page yet |
| `agent_files entry rejected (name must match ${…}): ${…}` | Not on a page yet |
| `agent_files has ${…} entries (at most ${…})` | Not on a page yet |
| `agent_files is not an array: ${…}` | Not on a page yet |
| `ajv implementation error` | Not on a page yet |
| `ajv.removeSchema: invalid parameter` | Not on a page yet |
| `alg ${…} is not supported either by JOSE or your javascript runtime` | Not on a page yet |
| `alias namespace path not allowed: ${…}` | Not on a page yet |
| `ambiguous mock server "${…}": declared by plugins ${…} — rename mocks/${…}/ to ${…}` | Not on a page yet |
| `an --add-dir settings file names another host` | Not on a page yet |
| `an ArrayBuffer was expected` | Not on a page yet |
| ``an Artifact created from an Artifact type takes only its own files — `capabilities` and `contract` come from the type; drop them and publish again`` | Not on a page yet |
| ``an Artifact was already created from this type for ${…} this session: ${…} — omit `type_url` and pass that `url` to update it`` | Not on a page yet |
| `an admin-owned settings document could not be read` | Not on a page yet |
| `an entry that is no file, directory or symlink` | Not on a page yet |
| `ancestry walk failed` | Not on a page yet |
| `ancestry walk truncated (maxDepth) above the prefix` | Not on a page yet |
| `anchored open never creates` | Not on a page yet |
| `anchored open never writes on this backend` | Not on a page yet |
| `anchored path must be relative, of plain segments` | Not on a page yet |
| `another file has the name` | Not on a page yet |
| `anymatch: specify first argument` | Not on a page yet |
| `append to ${…} made no progress` | Not on a page yet |
| `appendEntryToExistingFileSync: short write` | Not on a page yet |
| `appendToExistingTranscript: short write` | Not on a page yet |
| `argument string is required` | Not on a page yet |
| `argument string is required to be a string` | Not on a page yet |
| `armLiveSubscription: late-park fall-through lost its park` | Not on a page yet |
| `array length ${…} exceeds the maximum of ${…} supported across the workflow VM boundary` | Not on a page yet |
| `array length is not a safe integer across the workflow VM boundary` | Not on a page yet |
| `artifact endpoints are not available in this build` | Not on a page yet |
| `artifact permission check aborted` | Not on a page yet |
| `artifact permission check crashed` | Not on a page yet |
| `artifact preview is not compiled into this build` | Not on a page yet |
| `artifact rooms are not compiled into this build` | Not on a page yet |
| `as_level must be one of ${…}` | Not on a page yet |
| `assertDirChainReal: dir must be strictly inside base (rel: ${…})` | Not on a page yet |
| `asset cache and plugin bin/ are on different volumes` | Not on a page yet |
| `asset cache store failed (${…})` | Not on a page yet |
| `asset denylisted (410)` | Not on a page yet |
| `asset download failed: ${…}` | Not on a page yet |
| `asset exceeds size cap` | Not on a page yet |
| `asset fetch failed (${…})` | Not on a page yet |
| `asset fetch failed: ${…}` | Not on a page yet |
| `asset fetch skipped (${…})` | Not on a page yet |
| `asset not found (404)` | Not on a page yet |
| `asset_id (32 hex characters) is required for action "${…}"` | Not on a page yet |
| `async format in sync schema` | Not on a page yet |
| `async keyword in sync schema` | Not on a page yet |
| `async schema in sync schema` | Not on a page yet |
| `async schema referenced by sync schema` | Not on a page yet |
| `async string format ${…}` | Not on a page yet |
| `atleast(N, pattern) expects a non-negative integer` | Not on a page yet |
| `atleast(N, pattern): N must be a non-negative integer` | Not on a page yet |
| `auth setup failed: ${…}` | Not on a page yet |
| `auth token must be at least 32 characters` | Not on a page yet |
| `authServerMetadataUrl must use https:// (got: ${…})` | Not on a page yet |
| `authentication.type "${…}" is not a known authentication type` | Not on a page yet |
| `auto-edit attribution is no longer staged for this publish — nothing was published` | Not on a page yet |
| `auto_reload_settings unavailable: ${…}` | Not on a page yet |
| `aws version "${…}" is not supported in the current build.` | Not on a page yet |
| `awsCredentialExport did not return a valid value` | Not on a page yet |
| `awsCredentialExport did not return valid AWS STS output structure` | Not on a page yet |
| `backslash in a POSIX spelling: ${…}` | Not on a page yet |
| `bad maskPattern:${…}` | Not on a page yet |
| `basis write failed: ${…}` | Not on a page yet |
| `bedrock upstream: assume_role needs SigV4 source credentials (access keys or the ambient AWS chain); aws_bearer_token cannot call sts:AssumeRole` | Not on a page yet |
| `bedrock upstream: aws_access_key_id and aws_secret_access_key must be set together (and are required with aws_session_token)` | Not on a page yet |
| `bg manager failed to start: ${…}` | Not on a page yet |
| `bg roster.json update skipped: the file could not be inspected` | Not on a page yet |
| `bigint format ${…}` | Not on a page yet |
| `bigint payload cannot be serialized` | Not on a page yet |
| `bigint value cannot be rendered` | Not on a page yet |
| `billing/tax_rate unavailable: ${…}` | Not on a page yet |
| `binShell object form is Windows-only; pass a shell path string on macOS/Linux` | Not on a page yet |
| `bindAsync called after shutdown` | Not on a page yet |
| `bindSessionContext: hosts that wire executor.appScoped must plumb ctx.sessionId (the app-scoped snapshot cache is keyed by session; without it, sessions would share element_index/lastWindowPt state)` | Not on a page yet |
| `bitblt reading outside image` | Not on a page yet |
| `bitblt writing outside image` | Not on a page yet |
| `both "data" and "dataProp" passed, only one allowed` | Not on a page yet |
| `both "keyword" and "schema" passed, only one allowed` | Not on a page yet |
| `boundary must be 10-70 characters long` | Not on a page yet |
| `bracketedLeadScrubPattern: LEAD_OPEN_END must be the last token in a lead` | Not on a page yet |
| `bracketedLeadScrubPattern: a lead has at least one token` | Not on a page yet |
| `bracketedLeadScrubPattern: words are lowercase ASCII` | Not on a page yet |
| `branch "${…}" already exists, so the numbered name "${…}" could not be used. The branch was left as it is. Pass a different worktree name.` | Not on a page yet |
| `branch "${…}" for worktree "${…}" is already checked out elsewhere in this repository. Pass a different --worktree name.` | Not on a page yet |
| `bridge spawn root has unexpected owner or mode` | Not on a page yet |
| `bridge spawn root is not a directory` | Not on a page yet |
| `buildFilePermissionDescriptor called with non-file tool: ${…}` | Not on a page yet |
| `buildRunMockFiles: empty selfCommand` | Not on a page yet |
| `bundle capability line out of place` | Not on a page yet |
| `bundle header carries a seed ref that is not this build's` | Not on a page yet |
| `bundle header does not name every ref to relabel` | Not on a page yet |
| `bundle header line too long` | Not on a page yet |
| `bundle header names a ref to relabel twice` | Not on a page yet |
| `bundled file path escapes its extraction dir` | Not on a page yet |
| `byte-order mark before the JSON value` | Not on a page yet |
| `bytes is not base64` | Not on a page yet |
| `cache value is not JSON-serializable: ${…}` | Not on a page yet |
| `cache value is not JSON-serializable: it has no JSON representation` | Not on a page yet |
| `cacheKeyAttributes are only used for remoteEval` | Not on a page yet |
| `cached document is not an object` | Not on a page yet |
| `cached tools/list document has a malformed tools array` | Not on a page yet |
| `call .storeOptionsAsProperties() before adding options` | Not on a page yet |
| `call .storeOptionsAsProperties() before setting option values` | Not on a page yet |
| `callPlumbing: not a bridge plumbing tool` | Not on a page yet |
| `callPlumbing: not a plumbing tool` | Not on a page yet |
| `callback must be a function` | Not on a page yet |
| `canUseTool callback cannot be used with permissionPromptToolName. Please use one or the other.` | Not on a page yet |
| `canUseTool callback is not provided.` | Not on a page yet |
| `cannot add alias '${…}' to command '${…}' as already have command '${…}'` | Not on a page yet |
| `cannot add command '${…}' as already have command '${…}'` | Not on a page yet |
| `cannot create or write to base directory ${…} (${…}); pass --base-dir <writable path> or set SELF_HOSTED_RUNNER_BASE_DIR` | Not on a page yet |
| `cannot decode ${…} from JSON: ${…}` | Not on a page yet |
| `cannot decode ${…} from JSON: key "${…}" is unknown` | Not on a page yet |
| `cannot decode message ${…} from JSON ${…}` | Not on a page yet |
| `cannot decode message ${…} from JSON: "@type" is empty` | Not on a page yet |
| `cannot decode message ${…} from JSON: "@type" is invalid` | Not on a page yet |
| `cannot decode message ${…} from JSON: ${…}` | Not on a page yet |
| `cannot decode message ${…} from JSON: ${…} is not in the type registry` | Not on a page yet |
| `cannot decode message ${…} from JSON: expected object but got ${…}` | Not on a page yet |
| `cannot decode message ${…} from JSON: invalid RFC 3339 string` | Not on a page yet |
| `cannot decode message ${…} from JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive` | Not on a page yet |
| `cannot decode message ${…} from JSON: path names must be lowerCamelCase` | Not on a page yet |
| `cannot derive mount name from path: ${…}` | Not on a page yet |
| `cannot encode ${…} to JSON: ${…}` | Not on a page yet |
| `cannot encode ${…} to JSON: expected number, got ${…}` | Not on a page yet |
| `cannot encode ${…} to JSON: required field not set` | Not on a page yet |
| `cannot encode ${…} to binary: required field not set` | Not on a page yet |
| `cannot encode field ${…}.${…} to binary: ${…}` | Not on a page yet |
| `cannot encode message ${…} to JSON: "${…}" is not in the type registry` | Not on a page yet |
| `cannot encode message ${…} to JSON: lowerCamelCase of path name "${…}" is irreversible` | Not on a page yet |
| `cannot encode message ${…} to JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive` | Not on a page yet |
| `cannot encode message ${…} to JSON: nanos must not be greater than 99999999` | Not on a page yet |
| `cannot encode message ${…} to JSON: nanos must not be negative` | Not on a page yet |
| `cannot encode message ${…} to JSON: nanos sign must match seconds sign` | Not on a page yet |
| `cannot encode message ${…} to JSON: value out of range` | Not on a page yet |
| `cannot form a device hook id from these inputs` | Not on a page yet |
| `cannot parse ${…} default value: ${…}` | Not on a page yet |
| `cannot set size without setting maxSize or maxEntrySize on cache` | Not on a page yet |
| `cannot set sizeCalculation without setting maxSize or maxEntrySize` | Not on a page yet |
| ``cannot use `getEvalContext` outside of an evaluation`` | Not on a page yet |
| `canonicalJson: a value with no JSON form` | Not on a page yet |
| `canonicalJson: non-finite number` | Not on a page yet |
| `canonicalJson: unsupported ${…}` | Not on a page yet |
| `cant skip wire type ${…}` | Not on a page yet |
| `case "${…}" execution.env key "${…}" is not allowed — only EVAL_* keys can be set from case.yaml. Anything else must come from the operator's shell.` | Not on a page yet |
| `case "${…}": ${…} "${…}" resolves (through a link) outside the case directory and the plugin under test, or is not a plain single-link file` | Not on a page yet |
| `case "${…}": add_dirs entry "${…}" resolves (through a link) outside the case directory and the plugin under test — it may only grant reads inside them` | Not on a page yet |
| `case ${…}: plugins entry ${…} resolves to ${…}, outside the containment root ${…} (the enclosing plugin for a target inside one you control, else the directory you ran 'claude plugin eval' against). O…` | Not on a page yet |
| `case ${…}: plugins entry ${…} resolves to ${…}, which is not loaded: ${…}.` | Not on a page yet |
| `case.yaml must be a YAML object` | Not on a page yet |
| `catch with a callback (only a constant catch value compiles)` | Not on a page yet |
| `cd ~/.claude/local && npm update ${…}` | Not on a page yet |
| `certificateFile and privateKeyFile must be set or unset together` | Not on a page yet |
| `check type ${…}` | Not on a page yet |
| `check with a custom "when" condition` | Not on a page yet |
| `checkClientCertificate must be a boolean` | Not on a page yet |
| `checkout hook exited 0 but ${…} does not exist` | Not on a page yet |
| `checkout hook exited 0 but ${…} is not a directory` | Not on a page yet |
| `checkout hook succeeded but ${…}/.git is missing (for non-git SCMs, set CLAUDE_RUNNER_SKIP_GIT_VERIFY=1 in the runner's environment)` | Not on a page yet |
| `claude gateway requires the native binary` | Not on a page yet |
| `claude gateway requires the native binary. Install via https://claude.ai/install.sh instead of npm.` | Not on a page yet |
| `claude gateway: ${…}` | Not on a page yet |
| `claude plugin eval can't pass this session's API key to its test runs on Windows; set ANTHROPIC_API_KEY and run it again` | Not on a page yet |
| `claude plugin test: ${…}` | Not on a page yet |
| `claude plugin test: ${…} is not in ${…}` | Not on a page yet |
| `claude plugin test: no *.test.ts or *.test.tsx under ${…}` | Not on a page yet |
| `claude-code-remote serves only add_repo, check_repo_access, list_repos, register_repo_root under your organization's MCP policy` | Not on a page yet |
| `claude-test: installedRoot() was called before the plugin's texts were loaded. Await loadContent() first.` | Not on a page yet |
| `claude.ai MCP proxy is not available on third-party providers` | Not on a page yet |
| `claude.ai hosts more than one marketplace called "${…}" for this account — add it by its unique name instead: ${…} (claude plugin marketplace list)` | Not on a page yet |
| `claude.ai hosts no marketplace named "${…}" for this account — run: claude plugin marketplace list` | Not on a page yet |
| `claude.ai marketplace id is not a tagged id` | Not on a page yet |
| `claude.ai marketplace registry is not a JSON object` | Not on a page yet |
| `claude.ai marketplaces are not available here — sign in to claude.ai (claude /login) with plugin sync on, then run: claude plugin marketplace list` | Not on a page yet |
| `claude.ai marketplaces can't be added in this session, because it can't save them` | Not on a page yet |
| `claudeAuthenticate: no authDelegate wired` | Not on a page yet |
| `claudeOAuthCallback: no authDelegate wired` | Not on a page yet |
| `claudeOAuthWaitForCompletion: no authDelegate wired` | Not on a page yet |
| `claude_code_args agents is not a JSON object` | Not on a page yet |
| `clear-text frames are disabled when local pairing is configured` | Not on a page yet |
| `client egress policy` | Not on a page yet |
| `client event POST failed` | Not on a page yet |
| `clientMetadataUrl must be a valid HTTPS URL with a non-root pathname, got: ${…}` | Not on a page yet |
| `client_secret_basic authentication requires a client_secret` | Not on a page yet |
| `cloud session ended (${…}) before plan approval` | Not on a page yet |
| `cloud-plugins consent read failed` | Not on a page yet |
| `cloud-plugins consent write failed` | Not on a page yet |
| `code-sign: ANTHROPIC_BASE_URL (child) / CLAUDE_RUNNER_API_BASE_URL (lifecycle hook) is unset` | Not on a page yet |
| `code-sign: CLAUDE_CODE_REMOTE_SESSION_ID (child) / CLAUDE_RUNNER_SESSION_ID (lifecycle hook) is unset or malformed — is this process a descendant of a runner-spawned session or hook?` | Not on a page yet |
| `code-sign: CLAUDE_CODE_SESSION_ACCESS_TOKEN is unset` | Not on a page yet |
| `code-sign: no file specified to sign` | Not on a page yet |
| `code-sign: only SSH-style signing (-Y sign) is supported; got: ${…}` | Not on a page yet |
| `code-sign: response missing signature` | Not on a page yet |
| `code-sign: sign-commit returned HTTP ${…}${…}` | Not on a page yet |
| `coercion (z.coerce.${…}())` | Not on a page yet |
| `collection must be an odd-depth path of 1-15 segments and doc_id one segment, within the path byte cap, after permission or hook rewrites` | Not on a page yet |
| `combineRows accepts only constructor-produced ConsentRows` | Not on a page yet |
| `combineRows: combined updates exceed the display intake cap` | Not on a page yet |
| `combineRows: schema rejected already-minted updates` | Not on a page yet |
| `command contains the invisible character U+FEFF (byte order mark) or U+180E (Mongolian vowel separator), and was not run. Remove the character, keep the text that needs it in a file that the command r…` | Not on a page yet |
| `comments could not be read reliably right now — try again` | Not on a page yet |
| `comparison check bound of type ${…}` | Not on a page yet |
| `comparison check with Invalid Date bound` | Not on a page yet |
| `comparison check with NaN bound` | Not on a page yet |
| `composed artifact page has an unexpected skeleton` | Not on a page yet |
| `computed keys not allowed in meta` | Not on a page yet |
| `config file ${…} is missing "authentication"` | Not on a page yet |
| `config read failed` | Not on a page yet |
| `config validation failed: ${…}` | Not on a page yet |
| `config.endpointProvider is not set.` | Not on a page yet |
| `confirmWithUser(${…}): AskUserQuestion.checkPermissions answered ${…}, not ask` | Not on a page yet |
| `confirmWithUser(${…}): the question does not satisfy the AskUserQuestion schema: ${…}` | Not on a page yet |
| `confusableTagScrubPattern: tag names are lowercase [a-z0-9_-]` | Not on a page yet |
| `connect ${…}:${…}: no peer address` | Not on a page yet |
| `content-type header is missing from object` | Not on a page yet |
| `copy_files without a plan_token always requires per-batch approval — use finalize_plan declaring every destination in writes, then pass the returned plan_token.` | Not on a page yet |
| `core prompt: a lifted paragraph lacks a spelling it rewrites` | Not on a page yet |
| `core table: not an operation` | Not on a page yet |
| `could not confirm where the plugin's folder is, so the packages were not added` | Not on a page yet |
| `could not open the directory above ${…}: ${…}` | Not on a page yet |
| `could not read ${…} (${…})` | Not on a page yet |
| `could not read file (${…})` | Not on a page yet |
| `could not resolve ${…}` | Not on a page yet |
| `could not resolve ${…}: ${…}` | Not on a page yet |
| `could not tell the current branch for {branch}: spell the branch out` | Not on a page yet |
| `could not tell which ${…} repository {owner}/{repo} is: set GH_REPO=${…}OWNER/REPO or spell the repository out in the endpoint${…}` | Not on a page yet |
| `could not tell which ${…}repository {owner}/{repo} is: set GH_REPO=OWNER/REPO or spell the repository out in the endpoint${…}` | Not on a page yet |
| `could not write the identity line to the run call log — refusing to serve unidentified` | Not on a page yet |
| `couldn't check whether ${…} was created from an Artifact type (${…}) — retry` | Not on a page yet |
| `couldn't check whether ${…} was created from an Artifact type (its settings read answered 404; ${…}) — retry` | Not on a page yet |
| `couldn't remove ${…} — ${…}` | Not on a page yet |
| `countLength ${…} greater than remaining buf len.` | Not on a page yet |
| `create requires body` | Not on a page yet |
| `createMultiStoreState: length mismatch` | Not on a page yet |
| `createSeedAttestation: a NUL in an event uuid or type` | Not on a page yet |
| `createTagFormScrub: tag names are lowercase [a-z0-9_-]` | Not on a page yet |
| `create_webhook_trigger requires body` | Not on a page yet |
| `` creating an Artifact from an Artifact type (`type_url`) is not available in this session — remove `type_url` `` | Not on a page yet |
| `creating an Artifact from an Artifact type is not available in eval stub mode` | Not on a page yet |
| `credentials.envVars entry "${…}": extract pattern "${…}" matched nothing (onExtractNoMatch: "error"). Fix the regex, change to "warn"/"deny", or remove the entry.` | Not on a page yet |
| `credentials.files entry "${…}": ${…} (onExtractNoMatch: "error"). Fix the config, change to "warn"/"deny", or remove the entry.` | Not on a page yet |
| `creds must be a ServerCredentials object` | Not on a page yet |
| `cri.issuer must be https:// (http:// allowed for loopback only) — the verification JWKS derives from it, and keys fetched over plaintext invite substitution.` | Not on a page yet |
| `cri.issuer must not target a cloud metadata endpoint — the verification JWKS derives from it.` | Not on a page yet |
| `cri.issuer targets loopback but CLAUDE_GATEWAY_ALLOW_LOOPBACK is not set — safeFetch would block every derived-JWKS fetch at runtime. Set the escape (tests) or remove the issuer override.` | Not on a page yet |
| `cri.jwks_url must be a loopback URL — it exists for tests against local mocks, and honoring an external URL here would let it substitute the admission authority (its keys would mint CRI principals). R…` | Not on a page yet |
| `cri.jwks_url targets loopback but CLAUDE_GATEWAY_ALLOW_LOOPBACK is not set — safeFetch would block every JWKS fetch at runtime. Set the escape (tests) or remove the override.` | Not on a page yet |
| `cursor must be a cursor value named by a prior "comments" result` | Not on a page yet |
| `custom check without a predicate or check function` | Not on a page yet |
| `custom schema without a predicate function` | Not on a page yet |
| `daemon pipe.key is not a valid nonce` | Not on a page yet |
| `daemon.json is malformed: ${…}` | Not on a page yet |
| `data and file_path are not accepted with read_db` | Not on a page yet |
| `data must be an object` | Not on a page yet |
| `data type ${…} not compatible for encoding.` | Not on a page yet |
| `db_op "${…}" is not a read_db operation` | Not on a page yet |
| `db_op "${…}" is not a write_db operation` | Not on a page yet |
| ``db_op "${…}" requires `writes` with 1-${…} entries`` | Not on a page yet |
| ``db_op "${…}" takes its documents in `writes` only — top-level collection, doc_id, data, file_path, if_version, and query are not accepted`` | Not on a page yet |
| `db_op and collection are required for action "${…}"` | Not on a page yet |
| `decode-token: ${…} is not a JSON object` | Not on a page yet |
| `decode-token: ${…} is not valid JSON: ${…}` | Not on a page yet |
| `decode-token: ${…} is not valid base64url (unexpected characters)` | Not on a page yet |
| `decode-token: --api-url requires a value` | Not on a page yet |
| `decode-token: JWKS fetch returned ${…} ${…} for ${…}` | Not on a page yet |
| `decode-token: JWKS key kid=${…} has kty=${…} but alg=${…} needs kty=${…}` | Not on a page yet |
| ``decode-token: JWT header is missing `alg` or `kid` — cannot select a JWKS key`` | Not on a page yet |
| `decode-token: at most one positional token argument` | Not on a page yet |
| `decode-token: failed to fetch JWKS from ${…}: ${…}` | Not on a page yet |
| `decode-token: no JWKS key with kid=${…} at ${…} — token may be signed by a different environment (try --api-url).` | Not on a page yet |
| `decode-token: no token supplied. Pass it as an argument, pipe it on stdin, or set $CLAUDE_CODE_SESSION_ACCESS_TOKEN.` | Not on a page yet |
| `decode-token: not a JWT — expected 3 dot-separated base64url segments (after stripping any sk-ant- prefix), got ${…}` | Not on a page yet |
| `decode-token: signature verification FAILED` | Not on a page yet |
| `decode-token: stdin exceeds ${…} KiB; session-ingress JWTs are ~1 KB. Pass the token as an argument or set $CLAUDE_CODE_SESSION_ACCESS_TOKEN.` | Not on a page yet |
| `decode-token: token EXPIRED at ${…} (${…}s ago)` | Not on a page yet |
| ``decode-token: token has no numeric `exp` claim`` | Not on a page yet |
| `decode-token: token not valid until ${…}` | Not on a page yet |
| `decode-token: unknown flag ${…}` | Not on a page yet |
| `decode-token: unsupported alg=${…} — only ES256 and RS256 are supported` | Not on a page yet |
| `deepFreezePlainData: accessor property in mint input — plain data only` | Not on a page yet |
| `deepFreezePlainData: function in mint input — plain data only` | Not on a page yet |
| `deepFreezePlainData: non-enumerable property in mint input — plain data only` | Not on a page yet |
| `deepFreezePlainData: non-plain prototype in mint input — plain data only` | Not on a page yet |
| `deepFreezePlainData: prototype-key property in mint input — plain data only` | Not on a page yet |
| `deepFreezePlainData: symbol-keyed property in mint input — plain data only` | Not on a page yet |
| `deferredOptional(): the schema the build callback returned already handles a missing key itself (.optional(), .catch(), .default(), .prefault(), z.preprocess(), or a union or wrapper holding one). Ret…` | Not on a page yet |
| `deleteRemoteAgentMetadata: storage delete failed` | Not on a page yet |
| `delivery POST failed` | Not on a page yet |
| `denyAllNetwork is not supported on Windows` | Not on a page yet |
| `dependentSchemas and dependentRequired are not supported` | Not on a page yet |
| `deprecation dates are YYYY-MM-DD, got "${…}"` | Not on a page yet |
| `derived mount name is not a valid path segment: ${…}` | Not on a page yet |
| `describing an Artifact type is not available in this session` | Not on a page yet |
| `device unbound-creates read failed` | Not on a page yet |
| `device unbound-creates write failed` | Not on a page yet |
| `device-hooks consent read failed` | Not on a page yet |
| `device-hooks consent write failed` | Not on a page yet |
| `device-mcp snapshot read failed` | Not on a page yet |
| `device-mcp snapshot write failed` | Not on a page yet |
| `device-mcp state delete failed` | Not on a page yet |
| `device-mcp state read failed` | Not on a page yet |
| `device-mcp state write failed` | Not on a page yet |
| `deviceBind: malformed UUID '${…}'` | Not on a page yet |
| `deviceBind: tool-host link capabilities must be 1 to 8 sorted, distinct names of a-z, 0-9, _ and .` | Not on a page yet |
| `deviceBind: tool-host link request ids must be 1 to 65535 bytes` | Not on a page yet |
| `deviceBind: tool-host resume nonce must be 1 to 65535 bytes` | Not on a page yet |
| `deviceRegistry: device key could not be persisted` | Not on a page yet |
| `deviceRegistry: register ${…}: ${…}` | Not on a page yet |
| `deviceRegistry: register not sent (${…})` | Not on a page yet |
| `deviceRegistry: register request failed (${…})` | Not on a page yet |
| `deviceRegistry: the ${…} device-key store could not be read` | Not on a page yet |
| `deviceRegistry: the ${…} device-key store refused the write` | Not on a page yet |
| `did not return a value` | Not on a page yet |
| `digestAlgorithm must one of "sha256", "sha384", or "sha512"` | Not on a page yet |
| `directory API ${…}: ${…}` | Not on a page yet |
| `directory modes do not restrict access on Windows` | Not on a page yet |
| `disconnected before the request was sent` | Not on a page yet |
| `disconnected: the session stream is not connected` | Not on a page yet |
| `discovery-cache seal: schema version must fit one byte` | Not on a page yet |
| `discovery-cache: delete failed` | Not on a page yet |
| `discovery-cache: list failed` | Not on a page yet |
| `discovery-cache: read failed` | Not on a page yet |
| `discovery-cache: write failed` | Not on a page yet |
| `discoveryState was not available on the callback leg; ensure your provider persists discoveryState alongside codeVerifier` | Not on a page yet |
| `discriminated union option without static discriminator values` | Not on a page yet |
| `discriminated union with unionFallback` | Not on a page yet |
| `discriminator: "${…}" must be required` | Not on a page yet |
| `discriminator: "${…}" values must be unique strings` | Not on a page yet |
| `discriminator: "properties/${…}" must have "const" or "enum"` | Not on a page yet |
| `discriminator: mapping is not supported` | Not on a page yet |
| `discriminator: oneOf subschemas (or referenced schemas) must have "properties/${…}"` | Not on a page yet |
| `discriminator: requires discriminator option` | Not on a page yet |
| `discriminator: requires oneOf keyword` | Not on a page yet |
| `discriminator: requires propertyName` | Not on a page yet |
| `dispatch drain v5 list failed: ${…}` | Not on a page yet |
| `doPick called before start` | Not on a page yet |
| `docId space exhausted` | Not on a page yet |
| `doc_id is not accepted with db_op "${…}"` | Not on a page yet |
| `doc_id is required for db_op "${…}"` | Not on a page yet |
| `doc_id is required for db_op "get"` | Not on a page yet |
| `downloaded bytes do not match the pinned sha256` | Not on a page yet |
| `downloads: request (url="${…}"${…}) does not resolve to the public CDN (downloads.claude.ai). Use firstPartyApi for api.anthropic.com (residency-gated) or externalHttp for non-Anthropic hosts.` | Not on a page yet |
| `duplicate --git-host-rewrite for '${…}'` | Not on a page yet |
| `duplicate discriminator value ${…}` | Not on a page yet |
| `duplicate doc entry` | Not on a page yet |
| `duration out of range` | Not on a page yet |
| `earlyRemoteLink is only valid for an owns-process RemoteIO` | Not on a page yet |
| `either "keyword" or "schema" must be passed` | Not on a page yet |
| `either setProtectedHeader or setUnprotectedHeader must be called before #sign()` | Not on a page yet |
| `either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()` | Not on a page yet |
| `email domain not allowed` | Not on a page yet |
| `empty argument — a flag value may be unset (failed env/K8s substitution?)` | Not on a page yet |
| `empty sync-owned scope chain` | Not on a page yet |
| `empty term entry` | Not on a page yet |
| `enableFileCheckpointing is not yet supported with sessionStore (backup blobs are not mirrored, so rewindFiles() fails after a store-backed resume).` | Not on a page yet |
| `enclosing tool cgroup is gone` | Not on a page yet |
| `engine: queryParams called before REPL registered builder` | Not on a page yet |
| `engine: queryParams called before send — turn wiring bug` | Not on a page yet |
| ``ensurePersistentWindowsCa: sandbox user is not provisioned (user=${…}, cred=${…}). Run `npx sandbox-runtime windows-install` first.`` | Not on a page yet |
| ``ensurePersistentWindowsCa: state directory ${…} does not exist. Run `npx sandbox-runtime windows-install` first.`` | Not on a page yet |
| `ensureToolResultPairing: tool_use/tool_result pairing mismatch detected (strict mode). Refusing to repair — would inject synthetic placeholders into model context. Message structure: ${…}. See inc-497…` | Not on a page yet |
| `enum must have non-empty array` | Not on a page yet |
| `enum schema without enumerated values` | Not on a page yet |
| `enumeration deadline reached` | Not on a page yet |
| `environment ${…} is not loaded` | Not on a page yet |
| `environment secret is missing the ccr:pool_id claim — cannot derive the environment ID for spawn-hint polling` | Not on a page yet |
| `eval mock stand-in: agent relay failed: ${…}` | Not on a page yet |
| `eval mock stand-in: could not write the abort record to the call log` | Not on a page yet |
| `exclusive unions (z.xor)` | Not on a page yet |
| `executor must be a function.` | Not on a page yet |
| `exp field using invalid format` | Not on a page yet |
| `` expected `region` to be configured for `aws.auth#sigv4` `` | Not on a page yet |
| `expected array type under "${…}"` | Not on a page yet |
| `expected break marker.` | Not on a page yet |
| `expected header name to be a string` | Not on a page yet |
| `expected map type under "${…}"` | Not on a page yet |
| `export conversations.json is not valid JSON` | Not on a page yet |
| `export file exceeds MAX_EXPORT_BYTES` | Not on a page yet |
| `export file is not valid JSON` | Not on a page yet |
| `export stream exceeded its overall deadline` | Not on a page yet |
| `exportIntervalMillis must be greater than 0` | Not on a page yet |
| `exportIntervalMillis must be greater than or equal to exportTimeoutMillis` | Not on a page yet |
| `exportTimeoutMillis must be greater than 0` | Not on a page yet |
| `extension ${…} can only be applied to message ${…}` | Not on a page yet |
| `extension level must be 'block' or 'inline'` | Not on a page yet |
| `extension name required` | Not on a page yet |
| `externalHttp: ${…} is Anthropic-operated. Use firstPartyApi from src/services/http/firstParty — it enforces the 3P data-residency gate.` | Not on a page yet |
| `extra data found` | Not on a page yet |
| `extract pattern /${…}/ matched at offset ${…} but capture group 1 is undefined — group 1 must capture the credential value on every match.` | Not on a page yet |
| `failed to create computer-use lock: ${…}` | Not on a page yet |
| `failed to parse config file ${…}: ${…}` | Not on a page yet |
| `failed to read ${…}: ${…}` | Not on a page yet |
| `failed to read config file ${…}: ${…}` | Not on a page yet |
| `feature default for edition ${…} not found` | Not on a page yet |
| `feedback draft delete failed: ${…}` | Not on a page yet |
| `feedback draft listing failed: ${…}` | Not on a page yet |
| `fetch() returned undefined` | Not on a page yet |
| `fetchMethod must be a function if specified` | Not on a page yet |
| `fetchOutcomeBranches: hardenedGitUrl and governedAuth are mutually exclusive` | Not on a page yet |
| `field "${…}" requires a value separated by an '=' sign` | Not on a page yet |
| `field coverage drift: "${…}" is a lazy schema below an eager node — make the enclosing field()/subfield() value type the lazy one, or keep this node eager` | Not on a page yet |
| `field coverage drift: "${…}" is a lazy schema with no field()/subfield() metadata` | Not on a page yet |
| `field coverage drift: "${…}" is a primitive leaf with no field()/subfield() metadata` | Not on a page yet |
| `file exceeds IMPORT_MAX_FILE_BYTES; refusing to load` | Not on a page yet |
| `file_path is required for action "upload_asset"` | Not on a page yet |
| `file_path is required to publish` | Not on a page yet |
| `file_path: could not verify the file is the one that was admitted; retry the upload` | Not on a page yet |
| `file_path: could not verify the source file is unchanged since approval — retry the publish` | Not on a page yet |
| `file_path: the source file changed between approval and publish — retry the publish` | Not on a page yet |
| `files: copying another artifact's file needs the user's approval, which this call does not carry — nothing was published; retry so the publish is checked again` | Not on a page yet |
| `files: one copied source belongs to another organization, and the owner of another copied source (${…}) couldn't be confirmed, so nothing was published. ${…} so those sources are checked again.` | Not on a page yet |
| `files: one of the files named in this publish could not be read back as the file that was admitted — nothing was published. Check that every published path has a known extension and that no two are th…` | Not on a page yet |
| `filling in {owner}, {repo} or {branch} would change the host of the endpoint: spell the endpoint out` | Not on a page yet |
| `finishAuth requires an OAuthClientProvider` | Not on a page yet |
| `first parameter to parse must be array or undefined` | Not on a page yet |
| `flat schema drift: "${…}" flatKey is "${…}"` | Not on a page yet |
| `flat schema drift: discriminator "${…}" is also a canonical leaf` | Not on a page yet |
| `fleet view transcript tail read failed` | Not on a page yet |
| `fleet view transcript tail: stream not found` | Not on a page yet |
| `focus file ${…} changed while being read (vetted at ${…} bytes); try again` | Not on a page yet |
| `focus file ${…} does not exist` | Not on a page yet |
| `focus file ${…} does not exist (artifact publishing was not granted for this run, so nothing was published)` | Not on a page yet |
| `focus file ${…} exceeds ${…}` | Not on a page yet |
| `focus file ${…} has more than one hard link, so the grader cannot tell whether it also lives outside the run directory — not read (point the focus at a file with a single link, e.g. a copy)` | Not on a page yet |
| `focus file ${…} is not a regular file` | Not on a page yet |
| `focus file ${…} is unreadable (${…})` | Not on a page yet |
| `for-each-ref failed` | Not on a page yet |
| `fork seed: not a server session id` | Not on a page yet |
| `fork_conversation: target_message_uuid must be a string` | Not on a page yet |
| `fork_conversation: title must be a string` | Not on a page yet |
| `forked-skill sidecar write refused: diskless session with no storage backend or key for the path` | Not on a page yet |
| `founding row landed at ${…}, expected ${…}` | Not on a page yet |
| `frameApi: this session may not make the direct call` | Not on a page yet |
| `frameTunnel requires host 'frame' and auth 'session-jwt'` | Not on a page yet |
| `fromJSONSchema input is not valid JSON (possibly cyclic); use $defs/$ref for recursive schemas` | Not on a page yet |
| `frontmatter was not read: ${…}` | Not on a page yet |
| `gateway TLS pin store refused: the credentials file is a symlink` | Not on a page yet |
| `gateway TLS pin store unreadable: the credentials file could not be read` | Not on a page yet |
| `gateway device authorization endpoint returned malformed response` | Not on a page yet |
| `gateway token endpoint returned malformed response` | Not on a page yet |
| `generateCodeVerifier is removed, please use generateCodeVerifierAsync instead.` | Not on a page yet |
| `generate_session_title: description must be a string` | Not on a page yet |
| `generate_session_title: persist must be a boolean` | Not on a page yet |
| `get requires trigger_id` | Not on a page yet |
| `getConfig called before start` | Not on a page yet |
| `getContextUsage: no turn received yet` | Not on a page yet |
| `getExcludedDynamicSectionsContent: expected section body to start with a "# <heading>" line, got "${…}"` | Not on a page yet |
| `getGitDir returned null — cannot verify worktree state` | Not on a page yet |
| `getHostAuthToken callback is not provided.` | Not on a page yet |
| `getOAuthToken callback is not provided.` | Not on a page yet |
| `getStreamAsBuffer() is only supported in Node.js` | Not on a page yet |
| `get_context_usage: detail must be 'summary' or 'full'` | Not on a page yet |
| `get_run_log requires session_id` | Not on a page yet |
| `get_usage: skip_behaviors must be a boolean` | Not on a page yet |
| `gh PATH probe failed` | Not on a page yet |
| `gh: this command is run by the gh shim Claude Code writes for a session; it is not for direct use.` | Not on a page yet |
| `git ${…} failed${…}: ${…}` | Not on a page yet |
| `git ${…}.${…} is too old for claude plugin eval: it ignores the environment configuration (GIT_CONFIG_COUNT, added in git ${…}.${…}) that switches off the repository's git hooks and helper programs fo…` | Not on a page yet |
| `git could not say whether a cherry-pick or revert is in progress` | Not on a page yet |
| `git fetch failed (cumulative hard cap after ${…} attempts): ${…}` | Not on a page yet |
| `git fetch failed for ${…}` | Not on a page yet |
| `git metadata file "${…}" is larger than ${…} bytes` | Not on a page yet |
| `git metadata file "${…}" is not a plain readable file` | Not on a page yet |
| `git metadata file "${…}" is not a regular file` | Not on a page yet |
| `git on this host did not print a version claude plugin eval can read, so it cannot tell whether git is new enough (git ${…}.${…} or newer) to switch off the repository's git hooks and helper programs …` | Not on a page yet |
| `git on this host did not report its version within ${…} seconds, so claude plugin eval cannot tell whether it is new enough (git ${…}.${…} or newer) to switch off the repository's git hooks and helper…` | Not on a page yet |
| `git status failed` | Not on a page yet |
| `git was not run: the repository's git directory could not be confirmed as the one whose worktree registrations were checked` | Not on a page yet |
| `git-proxy credential requested but CLAUDE_CODE_SESSION_ACCESS_TOKEN is unset — token issue/refresh failed?` | Not on a page yet |
| `git-proxy: could not sanitize canonical ${…} before prep — ${…}` | Not on a page yet |
| `git-proxy: sanitize refused — control char in origin URL` | Not on a page yet |
| `git-subdir plugin source requires git to be installed and on PATH. Install git (version 2.25 or later for sparse-checkout cone mode) and try again.` | Not on a page yet |
| `gitInOwnWorkTree runs reads only, not git ${…}` | Not on a page yet |
| `gitdir back-link is a symlink` | Not on a page yet |
| `github-ssh source for '${…}' is missing url — SSH URLs are not synthesizable from slug alone` | Not on a page yet |
| `given KeyObject instance cannot be used for this algorithm` | Not on a page yet |
| `glob "${…}" exceeds ${…} '*'/'**' wildcards` | Not on a page yet |
| `global config not parseable` | Not on a page yet |
| `global config not readable through storage` | Not on a page yet |
| `google token endpoint ${…}: ${…}` | Not on a page yet |
| `google token endpoint returned no access_token` | Not on a page yet |
| `governed git credential requested but no session token is available — token issue/refresh failed?` | Not on a page yet |
| `group-override drift: "${…}" sets groupOverride but can never be a group entry (refused for hybrid, control-plane derived, an inference leaf, or a sibling of the flat-lifted ${…} list)` | Not on a page yet |
| `group-override: "${…}" groupItemOverride ${…}` | Not on a page yet |
| `group-override: "${…}" is marked orgOnly without a reason — state why a per-group value is mechanically meaningless ("it is a restriction" is not one)` | Not on a page yet |
| `group-override: "${…}" sets groupItemOverride, which only a nameSubset list outside the flat-lifted ${…} cluster can carry; drop it or fix groupOverride` | Not on a page yet |
| `harness gate: a bracketed lead must start with a word` | Not on a page yet |
| `header "${…}" requires a value separated by ':'` | Not on a page yet |
| `header name must be a non-empty string` | Not on a page yet |
| `headless session: a turn is already in flight` | Not on a page yet |
| `headless session: the engine loop ended before the turn result` | Not on a page yet |
| `headless session: turn picked up without prepared params` | Not on a page yet |
| `held directory belongs to another anchor` | Not on a page yet |
| `held directory is closed` | Not on a page yet |
| `history lock compromised before the rewrite` | Not on a page yet |
| `history readRecords cursor failed to advance` | Not on a page yet |
| `history readRecords failed` | Not on a page yet |
| `history.jsonl changed between its screen and the scan` | Not on a page yet |
| `history.jsonl is not a regular file at open` | Not on a page yet |
| `history.jsonl was rewritten under the head an earlier scan judged` | Not on a page yet |
| `holdBack: this message queue already has a hold; end it with the function the first call returned before setting another` | Not on a page yet |
| `holds a Proxy` | Not on a page yet |
| `holds a cycle` | Not on a page yet |
| `holds a key ${…}` | Not on a page yet |
| `holds an object that is not plain` | Not on a page yet |
| `home directory realpath unavailable` | Not on a page yet |
| `home pack exceeds the row byte cap` | Not on a page yet |
| `home pack file digest is stale` | Not on a page yet |
| `home pack files exceed the caps` | Not on a page yet |
| `home pack is off its own schema` | Not on a page yet |
| `home pack lists two paths that are one file, or one as a directory of another` | Not on a page yet |
| `home pack names a path that is no destination` | Not on a page yet |
| `home pack settings carry a key the portable filter never writes` | Not on a page yet |
| `home pack settings carry more or longer keys than the portable filter writes` | Not on a page yet |
| `home pack settings hold a value JSON cannot carry` | Not on a page yet |
| `home pack settings nest too deep or hold too much` | Not on a page yet |
| `home ready row is off-schema` | Not on a page yet |
| `home sidecar exceeds its byte bound` | Not on a page yet |
| `home sidecar is off its own schema` | Not on a page yet |
| `home/ or tmp/ is not a real directory` | Not on a page yet |
| `hook '${…}' does not exist` | Not on a page yet |
| `hooks.json declares ${…} at its top level, outside the "hooks" object — ${…}` | Not on a page yet |
| `hooks: must be an object mapping event names to matcher arrays — ${…}` | Not on a page yet |
| `hooks: the array form is not yet supported in a marketplace entry (${…}). ${…}` | Not on a page yet |
| `host config dir changed while it was being captured (${…})` | Not on a page yet |
| `host-creds file re-read failed (missing/stale/expired)` | Not on a page yet |
| `host-creds refresh dropped the bearer key` | Not on a page yet |
| `hostMatchesAny: non-string pattern in list` | Not on a page yet |
| `iTerm2 image: RGBA bytes do not match the size` | Not on a page yet |
| `iTerm2 image: a file or shm source is not sent` | Not on a page yet |
| `iTerm2 image: an id, cell count or size must be a positive integer within its range` | Not on a page yet |
| `iTerm2 image: payload must be standard base64 (A-Z a-z 0-9 + / =)` | Not on a page yet |
| `iTerm2 image: the payload is empty` | Not on a page yet |
| `iat field using invalid format` | Not on a page yet |
| `id_token email is not verified` | Not on a page yet |
| ``id_token missing email claim — configure your IdP to include `email` in the id_token, or set oidc.email_claim if it uses a different claim name`` | Not on a page yet |
| `ids of tool_result blocks and tool_use blocks from previous message do not match` | Not on a page yet |
| `illegal tag: field no ${…} wire type ${…}` | Not on a page yet |
| `illegal tag: varint overflows uint32` | Not on a page yet |
| `implement() must be called with a function` | Not on a page yet |
| `implementAsync() must be called with a function` | Not on a page yet |
| `import() is not available in workflow scripts.` | Not on a page yet |
| `import-conversations failed: ${…} ${…}` | Not on a page yet |
| `impossible change of scale: ${…}` | Not on a page yet |
| `in-place invalidation needs O_NOFOLLOW` | Not on a page yet |
| `incomplete data` | Not on a page yet |
| `incomplete float16 at end of buf.` | Not on a page yet |
| `incomplete float32 at end of buf.` | Not on a page yet |
| `incomplete float64 at end of buf.` | Not on a page yet |
| `info is a non-empty directory, not a link` | Not on a page yet |
| `initSync does not support encrypted payloads` | Not on a page yet |
| `inputRequired() requires at least one of inputRequests (with at least one entry) or requestState (spec: every InputRequiredResult MUST include at least one of the two)` | Not on a page yet |
| `insertChild: child was created with a different Config` | Not on a page yet |
| `installed plugins registry read settled without an outcome for its key` | Not on a page yet |
| `installed plugins registry update settled without an outcome` | Not on a page yet |
| `instantiate Stack using Stack.create(n)` | Not on a page yet |
| `int32 out of range` | Not on a page yet |
| `interaction schema island id already owned — one island id, one grammar` | Not on a page yet |
| `interaction schema name already registered` | Not on a page yet |
| `internal event POST failed` | Not on a page yet |
| `interrupt rejected` | Not on a page yet |
| `invalid Any or ${…} not found in registry` | Not on a page yet |
| `invalid addKeywords parameters` | Not on a page yet |
| `invalid anchor "${…}"` | Not on a page yet |
| `invalid base64 string` | Not on a page yet |
| `invalid comprehension` | Not on a page yet |
| `invalid config JSON on stdin: ${…}` | Not on a page yet |
| `invalid constant` | Not on a page yet |
| `invalid encoding` | Not on a page yet |
| `invalid end group tag` | Not on a page yet |
| `invalid entry` | Not on a page yet |
| `invalid feedback draft id` | Not on a page yet |
| `invalid float32: ${…}` | Not on a page yet |
| `invalid hook matcher` | Not on a page yet |
| `invalid int32: ${…}` | Not on a page yet |
| `invalid int64: ${…}` | Not on a page yet |
| `invalid key: "${…}"` | Not on a page yet |
| `invalid max value: ${…}` | Not on a page yet |
| `invalid media type` | Not on a page yet |
| `invalid optional index` | Not on a page yet |
| `invalid parameter format` | Not on a page yet |
| `invalid paste-content hash` | Not on a page yet |
| `invalid poll event attribute: ${…}` | Not on a page yet |
| `invalid poll event child: <${…}> on kind ${…}` | Not on a page yet |
| `invalid poll event kind: ${…}` | Not on a page yet |
| `invalid resource attribute key` | Not on a page yet |
| `invalid resource attribute value` | Not on a page yet |
| `invalid select` | Not on a page yet |
| `invalid select: ${…}` | Not on a page yet |
| `invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.` | Not on a page yet |
| `invalid state, fork stack empty` | Not on a page yet |
| `invalid throttle` | Not on a page yet |
| `invalid type url: ${…}` | Not on a page yet |
| `invalid uint32: ${…}` | Not on a page yet |
| `invalid uint64: ${…}` | Not on a page yet |
| `invalid varint` | Not on a page yet |
| `is over the size cap, or not a regular file, and was not read` | Not on a page yet |
| `` isInstance must be called on the class (e.g. `SdkError.isInstance(value)`); for callbacks use `v => SdkError.isInstance(v)` `` | Not on a page yet |
| `it answered about another hostname` | Not on a page yet |
| `it opened at a different path than approved` | Not on a page yet |
| `it patches its dependencies (patchedDependencies), which this install does not apply` | Not on a page yet |
| `it re-resolved elsewhere once opened` | Not on a page yet |
| `it was locked while the checkout was being deleted` | Not on a page yet |
| `its ${…} has no packages section with the plugin in it` | Not on a page yet |
| `its ${…} is in an old format; regenerate it with npm 7 or later` | Not on a page yet |
| `its ${…} is missing, or not named in lowercase` | Not on a page yet |
| `its ${…} is not a JSON object` | Not on a page yet |
| `its ${…} is not a regular file` | Not on a page yet |
| `its ${…} is not a regular file of at most 32 MB` | Not on a page yet |
| `its ${…} is not valid JSON` | Not on a page yet |
| `its bun.lock does not list the plugin as its only workspace` | Not on a page yet |
| `its bun.lock is in a format this version of Claude Code does not read` | Not on a page yet |
| `its bun.lock is not valid JSON` | Not on a page yet |
| `its bun.lock lists no packages` | Not on a page yet |
| `its bun.lockb is a binary lockfile that cannot be checked; ship a text bun.lock instead` | Not on a page yet |
| `its folder changed after it was checked, or this volume cannot show it is the same folder` | Not on a page yet |
| `its package.json and ${…} list different dependencies` | Not on a page yet |
| `its package.json sets overrides, which this install does not apply` | Not on a page yet |
| `judge call failed: ${…}${…}` | Not on a page yet |
| `kernel or device path, or one of Claude Code's credentials: ${…}` | Not on a page yet |
| `keyCertPair[${…}] must be an object` | Not on a page yet |
| `keyCertPair[${…}].cert_chain must be a Buffer` | Not on a page yet |
| `keyCertPair[${…}].private_key must be a Buffer` | Not on a page yet |
| `keyCertPairs must be an array` | Not on a page yet |
| `keybindings template write failed: ${…}` | Not on a page yet |
| `keys exceed the units display budget` | Not on a page yet |
| `keys that don't end with '-bin' must have String values` | Not on a page yet |
| `keys that end with '-bin' must have Buffer values` | Not on a page yet |
| `keyword "${…}" failed to compile` | Not on a page yet |
| `keyword with "post" flag cannot have "type"` | Not on a page yet |
| `kitty graphics: a file path or shared-memory name must be a non-empty string of at most 3072 bytes, no NUL` | Not on a page yet |
| `kitty graphics: an id, cell count or pixel size must be a positive integer within its range` | Not on a page yet |
| `kitty graphics: payload must be standard base64 (A-Z a-z 0-9 + / =)` | Not on a page yet |
| `latest pointer returned empty body` | Not on a page yet |
| `latinLetterConfusableClass: expected one ASCII lowercase letter` | Not on a page yet |
| `link body climbs out of a directory it entered` | Not on a page yet |
| `link body is not valid UTF-8` | Not on a page yet |
| `link chain too long to vet` | Not on a page yet |
| `list ${…}: 404 on page ${…} (cursor expired or store deleted mid-walk)` | Not on a page yet |
| `list_runs requires trigger_id` | Not on a page yet |
| `listen EADDRINUSE on the auto socket path and its moved-aside siblings` | Not on a page yet |
| `listen EADDRINUSE on the requested socket path` | Not on a page yet |
| `listing the Artifacts made from a type is not available in this session` | Not on a page yet |
| `literal discriminator value ${…}` | Not on a page yet |
| `literal type ${…}` | Not on a page yet |
| `live-edit is not available in this build` | Not on a page yet |
| `live-edit is not available on workshop pages — edit the local workshop file and republish; the publish path is the validation chokepoint live-edit would bypass` | Not on a page yet |
| `load: { register, holding } from the seat` | Not on a page yet |
| `loadTranscriptFile: the record cursor did not advance` | Not on a page yet |
| `load_test_mode is on, but the database at store.postgres_url already holds real spend (a spend row above 0 cents). A load test writes made-up developers into it, so it must not share a database with r…` | Not on a page yet |
| `logger must implement log, warn and error methods` | Not on a page yet |
| `macOS only` | Not on a page yet |
| `malformed bundle prerequisite line` | Not on a page yet |
| `malformed bundle ref line` | Not on a page yet |
| `malformed connector response` | Not on a page yet |
| `malformed doc entry` | Not on a page yet |
| `malformed doc metadata` | Not on a page yet |
| `malformed index shape` | Not on a page yet |
| `malformed posting data` | Not on a page yet |
| `malformed posting positions` | Not on a page yet |
| `malformed search response` | Not on a page yet |
| `malformed term entry` | Not on a page yet |
| `managed-mcp.json could not be read whole, so the servers it delivers cannot be named` | Not on a page yet |
| `manifest create failed: ${…}` | Not on a page yet |
| `manifest mismatch: ${…} Import completed with mismatches (IMPORT_MANIFEST_MISMATCH)` | Not on a page yet |
| `manifest write failed: ${…}` | Not on a page yet |
| `mantle upstream: aws_access_key_id and aws_secret_access_key must be set together (and are required with aws_session_token)` | Not on a page yet |
| `mapSources: cannot extract repo slug from source URL '${…}' — not scp-form (user@host:path) and not a parseable URL` | Not on a page yet |
| `marker is not the single-named regular file seen` | Not on a page yet |
| `marker name is not a regular file` | Not on a page yet |
| `materializeWorkTree: with fetchesFrom, the arguments must be -c pairs if any, then fetch or ls-remote, then options, then --end-of-options, then that remote's name. Each option must carry its value af…` | Not on a page yet |
| `max option must be a nonnegative integer` | Not on a page yet |
| `maxConcurrency must be greater than zero.` | Not on a page yet |
| `maxConcurrentStreams must be greater than zero.` | Not on a page yet |
| `maxDecompressedLength must be 0, a positive safe integer, or Infinity` | Not on a page yet |
| `maxEntrySize must be a positive integer if specified` | Not on a page yet |
| `maxSize must be a positive integer if specified` | Not on a page yet |
| `mcp task outcome: the project folder is a storage scope and no storage backend can take it` | Not on a page yet |
| `mcpAuthenticate: no mcpAuthDelegate wired (server: ${…})` | Not on a page yet |
| `mcpClearAuth: no mcpAuthDelegate wired (server: ${…})` | Not on a page yet |
| `mcpSubmitOAuthCallbackUrl: no mcpAuthDelegate wired (server: ${…})` | Not on a page yet |
| `mcp_reconnect: serverName must be a string` | Not on a page yet |
| `mcp_toggle: enabled must be a boolean` | Not on a page yet |
| `mcp_toggle: serverName must be a string` | Not on a page yet |
| `memoMethod must be a function if defined` | Not on a page yet |
| `memory file vanished between list and read` | Not on a page yet |
| `memory head read carried no mtime` | Not on a page yet |
| `memory head read failed: ${…}` | Not on a page yet |
| `memory scan listing failed: ${…}` | Not on a page yet |
| `message field with implicit presence` | Not on a page yet |
| `methods/accessors not allowed in meta` | Not on a page yet |
| `metrics_enabled response missing metrics_logging_enabled` | Not on a page yet |
| `metrics_enabled unavailable: ${…}` | Not on a page yet |
| `minTimeout is greater than maxTimeout` | Not on a page yet |
| `mintDisplayedUpdates: non-integer length in mint input — plain data only` | Not on a page yet |
| `mintDisplayedUpdates: non-plain array in mint input — plain data only` | Not on a page yet |
| `mintDisplayedUpdates: sparse mint input — plain data only` | Not on a page yet |
| `missing "alg" (Algorithm) Parameter value` | Not on a page yet |
| `missing "k" (Key Value) Parameter value` | Not on a page yet |
| `missing JWE Algorithm (alg) in JWE Header` | Not on a page yet |
| `missing JWE Encryption Algorithm (enc) in JWE Header` | Not on a page yet |
| `missing required "${…}" claim` | Not on a page yet |
| `missing spec path` | Not on a page yet |
| `mocks is not a directory` | Not on a page yet |
| `mocks/ has ${…} entries (cap: ${…})` | Not on a page yet |
| `mocks/ is a symbolic link whose target does not exist` | Not on a page yet |
| `mocks/ is unreadable (${…})` | Not on a page yet |
| `mocks/${…} is a symbolic link whose target does not exist` | Not on a page yet |
| `mocks/${…}/ and mocks/${…}/ both mock the server "${…}" — keep one` | Not on a page yet |
| `mocks/${…}/ has ${…} entries (cap: ${…})` | Not on a page yet |
| `mocks/${…}/ is unreadable (${…})` | Not on a page yet |
| `mocks/${…}/ names a plugin-scoped server, but plugin ${…} under test could not be enumerated (--allow-real-servers runs its real servers), so this directory cannot be told apart from one of ITS server…` | Not on a page yet |
| `mocks/${…}/${…}.md would be served as ${…}, a tool name that belongs to a REAL (unmocked) server the plugins declare — rename the directory to shadow that server, or the tool` | Not on a page yet |
| `mocks/${…}/${…}.md: "__" is the tool-name separator and cannot appear in a mocked tool name` | Not on a page yet |
| ``mocks/${…}/${…}: `expect:` here would guard all ${…} tools it answers; put the guard on the one tool it is meant for as mocks/${…}/<tool>.md`` | Not on a page yet |
| `` mocks/${…}/${…}: an agent answering several tools needs `tools: [...]` `` | Not on a page yet |
| `mocks/${…}/${…}: name responder files after the tool (letters, digits, "_" and "-" only), e.g. list_issues.md` | Not on a page yet |
| ``mocks/${…}/${…}: only `type: agent` is meaningful here (one agent answering several tools); put a fixed answer in <tool>.md`` | Not on a page yet |
| `mocks/${…}/: "__" is the tool-name separator and cannot appear in a mock directory name` | Not on a page yet |
| `mocks/${…}/: name the directory after the server segment of the tool name (letters, digits, "_" and "-" only)` | Not on a page yet |
| `mocks/${…}/: name the directory after the server segment of the tool name (letters, digits, "_" and "-" only), e.g. mocks/${…}/` | Not on a page yet |
| `mocks: the plugins under test declare MCP servers "${…}" and "${…}", whose tool names collide (${…}) — mocks cannot tell them apart; rename one` | Not on a page yet |
| `model catalog entry '${…}' has incomplete pricing — baked entries need the full ModelCosts shape` | Not on a page yet |
| `model catalog id '${…}' missing from CATALOG_MODEL_IDS — regenerate with 'bun run generate:model-catalog'` | Not on a page yet |
| `model catalog missing entry for '${…}' (CATALOG_ID_TO_KEY key '${…}')` | Not on a page yet |
| `model catalog: provider id collision across distinct entries` | Not on a page yet |
| `model-catalog.json: every aliases entry must name a models[] entry` | Not on a page yet |
| `model-catalog.json: latest_per_family must name a models[] entry that has a CATALOG_ID_TO_KEY line in configs.ts` | Not on a page yet |
| `more than ${…} test files under ${…}; name a narrower folder` | Not on a page yet |
| `mount dir holds another store's .memory-sync manifest at write time (fail closed)` | Not on a page yet |
| `mount walk failed: ${…}` | Not on a page yet |
| `mount_path contains null bytes` | Not on a page yet |
| `mount_path must be absolute` | Not on a page yet |
| `mount_path must be under /uploads/ or /outputs/` | Not on a page yet |
| `mount_path must not contain ".." segments` | Not on a page yet |
| `mount_path names a reserved temporary-file name` | Not on a page yet |
| `multi-hop symlink chain` | Not on a page yet |
| `multi-store-sync: a publishFence is not honoured on the storage write arm: add the publish-time check there before giving a storage-keyed store one` | Not on a page yet |
| `multi-store-sync: empty store receipt not removed` | Not on a page yet |
| `multipartBody and regular body cannot be set at the same time` | Not on a page yet |
| `multiple_of check with a zero divisor` | Not on a page yet |
| `must be an absolute local path` | Not on a page yet |
| `named CLAUDE_*_CONFIG export for '${…}' has null ${…}` | Not on a page yet |
| `nested indefinite string.` | Not on a page yet |
| `nested key display would drop code points` | Not on a page yet |
| `nested key exceeds the display bound` | Not on a page yet |
| `nested percent-encoding: ${…}` | Not on a page yet |
| `nesting deeper than 100000 levels is not supported` | Not on a page yet |
| `nests deeper than ${…}` | Not on a page yet |
| `network path not allowed: ${…}` | Not on a page yet |
| `network-spelled original cwd (screened, never touched)` | Not on a page yet |
| `network-spelled output path` | Not on a page yet |
| `network-spelled symlink hop` | Not on a page yet |
| `network-spelled symlink target` | Not on a page yet |
| `network.tlsTerminate and network.mitmProxy are mutually exclusive` | Not on a page yet |
| `newlineIsToken may not be used with patch-generation functions, only with diffing functions` | Not on a page yet |
| `no JSON value on line` | Not on a page yet |
| `no absolute python3 for a device hook template` | Not on a page yet |
| `no device hook templates in a diskless session` | Not on a page yet |
| `no enabled plugin with that id` | Not on a page yet |
| `no file at ${…} — write the page first, then preview it.` | Not on a page yet |
| `no file path could be derived from the hook-rewritten input` | Not on a page yet |
| `no final status` | Not on a page yet |
| `no hooks module named ${…} is loaded or declared` | Not on a page yet |
| `no hostname` | Not on a page yet |
| `no kill handler is registered for task type mcp_task` | Not on a page yet |
| `no memoMethod provided to constructor` | Not on a page yet |
| `no memory cgroup hierarchy` | Not on a page yet |
| `no page is loaded in the preview tab` | Not on a page yet |
| `no private directory for a forwarded hook to start in on this machine` | Not on a page yet |
| `no process group to signal` | Not on a page yet |
| `no row at ${…} to place in` | Not on a page yet |
| `no schema with key or ref "${…}"` | Not on a page yet |
| `no session to remove the browser helper from` | Not on a page yet |
| `no temp directory here lies outside what the session can write` | Not on a page yet |
| `no unnamed file could be opened for it (${…})` | Not on a page yet |
| `no variant directories (baseline/, v1/, ...) under ${…}` | Not on a page yet |
| `non-ASCII string encountered in encode()` | Not on a page yet |
| `non-canonical base64url` | Not on a page yet |
| `non-contained doc path` | Not on a page yet |
| `non-extractable CryptoKey cannot be exported as a JWK` | Not on a page yet |
| `non-literal node type in meta: ${…}` | Not on a page yet |
| `not JSON-serialisable` | Not on a page yet |
| `not a character device` | Not on a page yet |
| `not a directory: ${…}` | Not on a page yet |
| `not a host-check answer (not JSON)` | Not on a page yet |
| `not a host-check answer (unrecognized JSON)` | Not on a page yet |
| `not a pipe` | Not on a page yet |
| `not a regular file` | Not on a page yet |
| `not a single-named regular file at read time` | Not on a page yet |
| `not a v2 or v3 git bundle` | Not on a page yet |
| `not an artifact URL: ${…}` | Not on a page yet |
| `not in this runtime` | Not on a page yet |
| `not is not supported in Zod (except { not: {} } for never)` | Not on a page yet |
| `not opened no-follow for the head read` | Not on a page yet |
| `not read in a diskless session` | Not on a page yet |
| `not the regular file at the name at read time` | Not on a page yet |
| `not unpadded base64url` | Not on a page yet |
| `note: the installed service has not come up yet — a temporary background daemon (pid ${…}) is serving this session; check 'claude daemon status'.` | Not on a page yet |
| `note: woke session ${…} with its saved options (${…}).` | Not on a page yet |
| `nothing can be written at as_level 'view', your own data/users subtree included, so nothing was sent. Omit as_level to write as yourself, or pass 'interact' or 'admin' to check what that level can wri…` | Not on a page yet |
| `nothing selected` | Not on a page yet |
| `number format ${…}` | Not on a page yet |
| `object shape key "__proto__"` | Not on a page yet |
| `observer marker read-back failed` | Not on a page yet |
| `oidc.ca_cert_pem has no usable certificate once those on the CLI's deny list are removed, so the gateway can't verify the identity provider. Set oidc.ca_cert_pem to the identity provider's intermediat…` | Not on a page yet |
| `oidc.google_groups: ${…} is not a Google service-account key (missing client_email or private_key)` | Not on a page yet |
| `oidc: the IdP discovery document has no token_endpoint, which private_key_jwt needs as the assertion audience` | Not on a page yet |
| `one of the repo's settings files cannot be read for now` | Not on a page yet |
| `only a command hook runs on this machine` | Not on a page yet |
| `only negative-number unary allowed in meta` | Not on a page yet |
| `only plain properties allowed in meta` | Not on a page yet |
| `only prompt commands are supported in streaming mode` | Not on a page yet |
| `only the last argument can be variadic '${…}'` | Not on a page yet |
| `only the verifier makes a VerifiedStatement` | Not on a page yet |
| `open is not available in this session.` | Not on a page yet |
| `options.loadSchema should be a function` | Not on a page yet |
| `orchestrator mode is not supported on Windows: it is driven by the spawn-runner lifecycle hook, and lifecycle hooks currently require a Linux or macOS host because they are POSIX executables spawned d…` | Not on a page yet |
| `orchestrator requires --hooks-dir (or SELF_HOSTED_RUNNER_HOOKS_DIR) — no spawn-runner hook directory configured` | Not on a page yet |
| `otelHeadersHelper did not return a valid value` | Not on a page yet |
| `otelHeadersHelper did not return valid JSON` | Not on a page yet |
| `otelHeadersHelper must return a JSON object with string key-value pairs` | Not on a page yet |
| `otelHeadersHelper returned non-string value for key "${…}": ${…}` | Not on a page yet |
| `out_dir no longer resolves where it did when the save was approved — the file was fetched but not saved; retry so it is checked again` | Not on a page yet |
| `outlier detection config ${…} parse error: expected ${…}, got ${…}` | Not on a page yet |
| `outlier detection config ${…} parse error: expected Duration, got ${…}` | Not on a page yet |
| `outlier detection config ${…} parse error: value out of range for percentage (0-100)` | Not on a page yet |
| `outlier detection config ${…} parse error: values out of range for non-negative Duaration` | Not on a page yet |
| `outlier detection config child_policy must be an array` | Not on a page yet |
| `outlier detection config child_policy: no valid recognized policy found` | Not on a page yet |
| `outlier detection config failure_percentage_ejection must be an object` | Not on a page yet |
| `outlier detection config success_rate_ejection must be an object` | Not on a page yet |
| `outlier_detection LB policy cannot have a pick_first child policy` | Not on a page yet |
| `output base ${…} ${…} — refusing to write beneath a directory you did not name (pass --output-dir, or name the directory itself as the target)` | Not on a page yet |
| `output base ${…} is a symlink — refusing to write beneath it` | Not on a page yet |
| `output location ${…} ${…} — refusing to write there` | Not on a page yet |
| `output path has a symlink chain too long to vet` | Not on a page yet |
| `output path traverses a junction to remote UNC` | Not on a page yet |
| `output schema expansion exceeds the node budget` | Not on a page yet |
| `output schema too large to classify` | Not on a page yet |
| `outputHelp callback must return a string or a Buffer` | Not on a page yet |
| `over the size bound` | Not on a page yet |
| `overage_spend_limit unavailable: ${…}` | Not on a page yet |
| `overwrite check without a transform function` | Not on a page yet |
| `packages/managed-config/src/desktop/generated/hybridServablePathLedger.json must be JSON with a "paths" list of strings. If it has merge-conflict markers, keep the paths from both sides and delete the…` | Not on a page yet |
| `pairing apiOrigin is not a URL: ${…}` | Not on a page yet |
| `pairing apiOrigin must be a bare https origin: ${…}` | Not on a page yet |
| `parallel() expects an array of functions` | Not on a page yet |
| `parallel() expects an array of functions, not promises. Wrap each call: () => agent(...)` | Not on a page yet |
| `parent schema must have dependencies of ${…}: ${…}` | Not on a page yet |
| `parent-segment spelling not allowed: ${…}` | Not on a page yet |
| `parseEpochTimestamp - numeric string invalid.` | Not on a page yet |
| `parser must be boolean\|regexp\|function` | Not on a page yet |
| `part does not follow the bytes already written` | Not on a page yet |
| ``pass the type as `type` (its name) or `type_url` (its link) — exactly one`` | Not on a page yet |
| `passThroughOptions cannot be used for '${…}' without turning on enablePositionalOptions for parent command(s)` | Not on a page yet |
| `path contains null bytes` | Not on a page yet |
| `path could not be vetted (symbolic link chain or unreadable component)` | Not on a page yet |
| `path escaped the configured origin` | Not on a page yet |
| `path escapes mount ${…}: ${…}` | Not on a page yet |
| `path must be absolute` | Not on a page yet |
| `path must be under the working sync dir` | Not on a page yet |
| `path too long` | Not on a page yet |
| `payload exceeds the element serialization wall` | Not on a page yet |
| `payload exceeds the serialization budget` | Not on a page yet |
| `payload exceeds the serialization depth wall` | Not on a page yet |
| `payload length is not an honest array length` | Not on a page yet |
| `payload must be an instance of Uint8Array` | Not on a page yet |
| `payment_method unavailable: ${…}` | Not on a page yet |
| `pbcopy exited with code ${…}` | Not on a page yet |
| `pbpaste exited with code ${…}` | Not on a page yet |
| `performRemoveByUuid: short write` | Not on a page yet |
| `permission mode not applied after relocation: ${…}` | Not on a page yet |
| `permission_context is too large` | Not on a page yet |
| `persistAgentMetadata: storage write failed` | Not on a page yet |
| `pick_first config field shuffleAddressList must be a boolean if provided` | Not on a page yet |
| `pipeline() expects an array as the first argument` | Not on a page yet |
| `pipeline() stages must be functions: pipeline(items, item => ..., result => ...)` | Not on a page yet |
| `placement option top must be a boolean` | Not on a page yet |
| `placement options must be an object: {top: true} or nothing` | Not on a page yet |
| `plaintext must be an instance of Uint8Array` | Not on a page yet |
| `plugin eval: cannot read the plugin manifest (${…}${…}) to fence the suites it lists — refusing to run` | Not on a page yet |
| `plugin must be a Function or an Array of Functions` | Not on a page yet |
| `policy webhook decision has no boolean block field` | Not on a page yet |
| `policy webhook returned a non-object decision` | Not on a page yet |
| `policyTolerantSettingsSchema: not a settings field of this build` | Not on a page yet |
| `poll event: content, element or declared is required` | Not on a page yet |
| `poll event: pass content or children, not both` | Not on a page yet |
| `poll event: pass one of content, element, declared` | Not on a page yet |
| `poll stopped by caller` | Not on a page yet |
| `port must be a string` | Not on a page yet |
| `position space exhausted` | Not on a page yet |
| `posting docId out of order` | Not on a page yet |
| `posting references unknown docId` | Not on a page yet |
| `premature EOF` | Not on a page yet |
| `prepaid/bundles unavailable: ${…}` | Not on a page yet |
| `prepaid/commits status unavailable: ${…}` | Not on a page yet |
| `prepaid/credits purchase unavailable: ${…}` | Not on a page yet |
| `prepaid/credits unavailable: ${…}` | Not on a page yet |
| `preview is not available in this session.` | Not on a page yet |
| ``preview needs a local `file_path`.`` | Not on a page yet |
| `preview renders .html pages only.` | Not on a page yet |
| `preview renders local files only; this path, or a link on the way to it, reaches a network share, or a directory or link on the way could not be examined.` | Not on a page yet |
| `probe blob not read` | Not on a page yet |
| `probe blob not written` | Not on a page yet |
| `profile name "${…}" contains disallowed characters (allowed: letters, digits, '_', '.', '-')` | Not on a page yet |
| `profile name "${…}" is not allowed` | Not on a page yet |
| `profile name "${…}" must not contain path separators` | Not on a page yet |
| `profile name is empty` | Not on a page yet |
| `programs.buildInvocation must return an absolute path to a file named git` | Not on a page yet |
| `programs.buildInvocation must return the environment it was handed, less at most PWD and OLDPWD, and the arguments it was handed, with nothing before them but -C and the directory it was handed; it ch…` | Not on a page yet |
| `project_read: downloaded bytes do not match the reported file size (corrupt response, or the file is being modified concurrently — retry if a save was just issued).` | Not on a page yet |
| `project_read: server returned a different file.` | Not on a page yet |
| `project_read: server returned a malformed file id.` | Not on a page yet |
| `project_write: could not confirm that the new content was saved. Nothing was removed, so the project may now list this path twice. ${…}` | Not on a page yet |
| `project_write: local_path resolves outside the working directory.` | Not on a page yet |
| `project_write: local_path was replaced during the upload.` | Not on a page yet |
| `projects enumeration failed` | Not on a page yet |
| `prompt-type hooks are not supported for ${…} events (no conversation context is available). Use a command-type hook instead.` | Not on a page yet |
| `prop must be 1` | Not on a page yet |
| `proxy authorization command ${…}${…}` | Not on a page yet |
| `proxy authorization file could not be read: ${…}` | Not on a page yet |
| `proxy authorization file could not be read: an earlier read has not returned yet (stalled mount?); not issuing another` | Not on a page yet |
| `proxy authorization source returned an empty value` | Not on a page yet |
| `proxy authorization value exceeds ${…} bytes` | Not on a page yet |
| `proxy authorization value must be a single header line (control characters such as CR/LF are not allowed)` | Not on a page yet |
| `query is not accepted with db_op "get"` | Not on a page yet |
| `query is not accepted with write_db` | Not on a page yet |
| `query.cursor is not accepted with query.order_by — an ordered query is a single page` | Not on a page yet |
| `query.where and query.order_by are only accepted with db_op "query"` | Not on a page yet |
| `queryWithObserverTap: missing terminal after completion` | Not on a page yet |
| `quickstart is not available in this session — list the Artifact types with their own call instead` | Not on a page yet |
| `read denied: ${…}` | Not on a page yet |
| `read not allowed (${…}): ${…}` | Not on a page yet |
| `read not allowed: ${…}` | Not on a page yet |
| `read project memory` | Not on a page yet |
| `read requires approval: ${…}` | Not on a page yet |
| `readAgentMetadataAtPath: storage read failed` | Not on a page yet |
| `readMcpDirectory called on a server without directoryRead capability` | Not on a page yet |
| `readPermissionDecisionForPath probe consulted unsupported tool property: ${…}` | Not on a page yet |
| `readTranscriptForLoad: this transcript has a storage key and no file, so it can be read only through a storage backend. The caller passed none, or tengu_hover_rest is off.` | Not on a page yet |
| `read_asset saves only to local directories — out_dir names a network path or cannot be resolved` | Not on a page yet |
| `read_db saves only to local directories — out_dir names a network path or cannot be resolved` | Not on a page yet |
| `read_file saves only to local directories — out_dir names a network path or cannot be resolved` | Not on a page yet |
| `read_page_data could not fetch the artifact: ${…}` | Not on a page yet |
| `read_page_data: interaction schema unavailable (${…}).` | Not on a page yet |
| `read_page_data: the "${…}" schema's derived-state hook failed validation — this is a bug in this build; act on nothing from this read.` | Not on a page yet |
| `read_page_data: the requested interaction schema is not available in this session.` | Not on a page yet |
| `readdirp: Invalid type passed. Use one of ${…}` | Not on a page yet |
| `readdirp: root argument is required. Usage: readdirp(root, options)` | Not on a page yet |
| `readdirp: root argument must be a string. Usage: readdirp(root, options)` | Not on a page yet |
| `reading file_path is blocked by a Read permission rule` | Not on a page yet |
| `reading file_path is blocked by a Read permission rule — the upload was not attempted` | Not on a page yet |
| `reading this file is blocked by a Read permission rule — the upload was not attempted` | Not on a page yet |
| `realpath would misread a backslash in the path` | Not on a page yet |
| `reconnectMcpServer: no mcpDelegate wired (server: ${…})` | Not on a page yet |
| `record aged out` | Not on a page yet |
| `record key "__proto__"` | Not on a page yet |
| `record key value ${…}` | Not on a page yet |
| `recording name components must be plain segments` | Not on a page yet |
| `redirectUrl is required for authorization_code flow` | Not on a page yet |
| `refreshWorkSecret callback is not provided.` | Not on a page yet |
| `refused by its name or place (${…}): ${…}` | Not on a page yet |
| `refusing a redirect whose Location is not a URL` | Not on a page yet |
| `refusing to ${…}: ${…} resolves outside the flow directory` | Not on a page yet |
| `refusing to ${…}: flow root not resolved yet` | Not on a page yet |
| `refusing to derive a messaging key name for a non-canonical socket path` | Not on a page yet |
| `refusing to export a git config entry with shell-active characters` | Not on a page yet |
| `refusing to open through symlink: ${…}` | Not on a page yet |
| `refusing to open through symlinked directory: ${…}` | Not on a page yet |
| `refusing to read ${…}: content exceeds ${…} byte limit` | Not on a page yet |
| `refusing to read fd ${…}: not a pipe or socket` | Not on a page yet |
| `refusing to use ${…}: it has a second hard link (another name for the same file); replace it with a plain copy if it is yours` | Not on a page yet |
| `refusing to use daemon dir: ${…} is owned by uid ${…}` | Not on a page yet |
| `refusing to use non-regular file: ${…}` | Not on a page yet |
| `refusing to use symlinked directory: ${…}` | Not on a page yet |
| `refusing to write into ${…}: '.'/'..' path segment` | Not on a page yet |
| `refusing to write into ${…}: ancestor ${…} is a symlink` | Not on a page yet |
| `refusing to write into ${…}: it is a symlink` | Not on a page yet |
| `refusing to write outside ${…}: ${…}` | Not on a page yet |
| `refusing to write through symlink: ${…}` | Not on a page yet |
| `refusing to write through symlinked directory: ${…}` | Not on a page yet |
| `refusing to write to ${…}: it has a second hard link (another name for the same file); replace it with a plain copy if it is yours` | Not on a page yet |
| `refusing to write to non-regular file: ${…}` | Not on a page yet |
| `refusing to write: output root not resolved` | Not on a page yet |
| `regex format without a pattern` | Not on a page yet |
| `region is not a plain AWS region name` | Not on a page yet |
| `registerCommandNetworkLists: allowedDomains must be an array of strings.` | Not on a page yet |
| `registerCommandNetworkLists: commandId must be a string of at least ${…} characters, unpaired surrogates not counted. The id is the only thing that binds a proxy connection to this allow list, and the…` | Not on a page yet |
| `registerCommandNetworkLists: invalid allowedDomains entry ${…}. ${…}` | Not on a page yet |
| `registerPlan: plan failed shape validation` | Not on a page yet |
| `registerSyncCacheResetListener: a listener is already registered; a second one would unhook the first` | Not on a page yet |
| `registerWorker: invalid worker_epoch in response${…}` | Not on a page yet |
| `register_repo_root: ${…} ${…}` | Not on a page yet |
| `register_repo_root: ${…} is already a registered working directory` | Not on a page yet |
| `register_repo_root: target is a network path, an obfuscated spelling, or a path whose directories and symbolic links could not all be examined, which cannot be registered` | Not on a page yet |
| `register_repo_root: target path could not be resolved` | Not on a page yet |
| `reloadPlugins: no mcpDelegate wired` | Not on a page yet |
| `relocateConfigureGitArtifacts: artifact path is not under {baseDir}/.runner/` | Not on a page yet |
| `remote_control_work_secret names a session this host did not attach.` | Not on a page yet |
| `removeFromEveryLeg: the remove function added or changed a value. It may only delete keys. Nothing was written to this store.` | Not on a page yet |
| `removeFromEveryLeg: the remove function added the key "${…}". It may only delete keys. Nothing was written to this store.` | Not on a page yet |
| `removeFromEveryLeg: the remove function did not return a plain object (an async function returns a Promise). Nothing was written to this store.` | Not on a page yet |
| `removeService() requires object as argument` | Not on a page yet |
| `rename_session: source must be 'remote' or 'host'` | Not on a page yet |
| `rename_session: title must be a string` | Not on a page yet |
| `renderer '${…}' does not exist` | Not on a page yet |
| `repeated posting docId` | Not on a page yet |
| `replaceRemoteHosts was handed a ToolHost registered by another source` | Not on a page yet |
| `replayWorldJournal: the world is not empty` | Not on a page yet |
| `replicated "aud" claim header parameter mismatch` | Not on a page yet |
| `replicated "iss" claim header parameter mismatch` | Not on a page yet |
| `replicated "sub" claim header parameter mismatch` | Not on a page yet |
| `repository config could not be vetted` | Not on a page yet |
| `` request can only be signed with `apiKey` locations `query` or `header`, but found: `${…}` `` | Not on a page yet |
| ``request could not be signed with `apiKey` since the `apiKey` is not defined`` | Not on a page yet |
| ``request could not be signed with `apiKey` since the `in` signer property is missing`` | Not on a page yet |
| ``request could not be signed with `apiKey` since the `name` and `in` signer properties are missing`` | Not on a page yet |
| ``request could not be signed with `apiKey` since the `name` signer property is missing`` | Not on a page yet |
| ``request could not be signed with `token` since the `token` is not defined`` | Not on a page yet |
| `request-replay: a line of a shown account-memory snapshot is still present outside the model's turns; this request is not recorded` | Not on a page yet |
| `request-replay: the placeholders do not match the cuts withoutLaptopMemoryText reported; this request is not recorded` | Not on a page yet |
| `request-replay: withoutLaptopMemoryText made no search text for the account-memory snapshots shown; this request is not recorded` | Not on a page yet |
| `request-replay: withoutLaptopMemoryText still finds account-memory snapshot text after the cut; this request is not recorded` | Not on a page yet |
| `requestDigest bug: a message was not hashed, so this request is not recorded for replay` | Not on a page yet |
| `requestDigest: a memo needs body.messages to be an array` | Not on a page yet |
| `rescue copy failed: ${…}${…}` | Not on a page yet |
| `reserved key name not allowed in meta: ${…}` | Not on a page yet |
| `restore() on a non-empty world` | Not on a page yet |
| `restore(): row ${…} out of order` | Not on a page yet |
| `results directory ${…} already existed — a default results directory is always new; refusing to write into it` | Not on a page yet |
| `retract() expects an address (a number)` | Not on a page yet |
| `returned a tree that does not validate (${…})` | Not on a page yet |
| `returned output that cannot be used as an API key: ${…}. The script must print only the key to stdout.` | Not on a page yet |
| `ripgrep failed with exit code ${…}: ${…}` | Not on a page yet |
| `room_send needs an interactive approval surface and this session no longer has one — nothing was sent; do not retry the room_send in this session` | Not on a page yet |
| `room_send refused after permission or hook rewrites: ${…}` | Not on a page yet |
| `root: could not verify the publish base is unchanged since approval — retry the publish` | Not on a page yet |
| `root: reading from under ${…} is blocked by a Read permission rule` | Not on a page yet |
| `root: reading from under ${…} requires a Read permission approval here — retry the publish so it can be asked` | Not on a page yet |
| `rootCerts must be null or a Buffer` | Not on a page yet |
| `roster unreadable` | Not on a page yet |
| `roster v5 write failed: ${…}` | Not on a page yet |
| `row ${…} is retracted; nothing can be placed inside it` | Not on a page yet |
| `run requires trigger_id` | Not on a page yet |
| `runForkedAgent: a fork changed its parent's tools without stating ownPrefix` | Not on a page yet |
| `runForkedAgent: a tool call route must replace one of the parent's tools with a copy that differs only in call` | Not on a page yet |
| `runForkedAgent: tool call routes need a fork that continues its parent's prefix` | Not on a page yet |
| `runId is not a field of this tool here.` | Not on a page yet |
| ``sandbox user SID missing from `srt-win user status` (provisioned but in an inconsistent state)`` | Not on a page yet |
| `sandbox wrapWithSandboxArgv returned empty argv` | Not on a page yet |
| `sandbox: the task output directory chain under the temp root is no longer plain directories (${…}); refusing to run sandboxed commands until it is restored` | Not on a page yet |
| `saveRejectedUltraplan: v5 write failed: ${…}` | Not on a page yet |
| `schema ${…} must be string` | Not on a page yet |
| `schema must be object` | Not on a page yet |
| `schema must be object or boolean` | Not on a page yet |
| `schema type ${…}` | Not on a page yet |
| `schema with key or id "${…}" already exists` | Not on a page yet |
| `scm-connector dial host is not a valid URL host` | Not on a page yet |
| `script hook: ${…}` | Not on a page yet |
| `script hooks are not available in this build` | Not on a page yet |
| `seal: no envelope produced` | Not on a page yet |
| `sealSyncGlobalsInVM: the context lacks one of log, phase, setTimeout, clearTimeout, console, budget — call it only on a context built by createWorkflowContext or createChildRealm` | Not on a page yet |
| `sealed channel torn down` | Not on a page yet |
| `seccompConfig.argv0 requires seccompConfig.applyPath` | Not on a page yet |
| `seed transcript stream not found` | Not on a page yet |
| `seed-admin is no longer the directory that was checked` | Not on a page yet |
| `seeded file not on this machine` | Not on a page yet |
| `seeded file not stat-able through the storage interface` | Not on a page yet |
| `send-claim timeout` | Not on a page yet |
| `sendMessageonChild called with child not populated` | Not on a page yet |
| `server is already started` | Not on a page yet |
| `server must be bound in order to start` | Not on a page yet |
| `servingKitFor: a second tool group asked for a different tool set or policy than the kit was built with` | Not on a page yet |
| `session create allows at most ${…} initial events, got ${…}` | Not on a page yet |
| `session history POST refused` | Not on a page yet |
| `sessionScopeOf: not a transcript key` | Not on a page yet |
| `sessionStore cannot be used with persistSession: false -- the storage adapter requires local writes to mirror from. Use CLAUDE_CONFIG_DIR=/tmp for ephemeral local writes with external mirroring.` | Not on a page yet |
| `sessionStore resume: invalid v5 key for ${…}: ${…}${…}` | Not on a page yet |
| `session_id is not the current session` | Not on a page yet |
| `set only one of --proxy-authorization-command (SELF_HOSTED_RUNNER_PROXY_AUTHORIZATION_COMMAND) and --proxy-authorization-file (SELF_HOSTED_RUNNER_PROXY_AUTHORIZATION_FILE)` | Not on a page yet |
| `setContentEncryptionKey can only be called once` | Not on a page yet |
| `setContentEncryptionKey cannot be called when using Direct Encryption` | Not on a page yet |
| `setContentEncryptionKey cannot be called when using Direct Key Agreement` | Not on a page yet |
| `setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${…}` | Not on a page yet |
| `setHoldStaleReauthEntryForTest is test-only` | Not on a page yet |
| `setInitializationVector can only be called once` | Not on a page yet |
| `setKeyManagementParameters can only be called once` | Not on a page yet |
| `setMcpServers: no mcpDelegate wired (${…} server(s))` | Not on a page yet |
| `setModeRow: schema rejected a designed setMode update` | Not on a page yet |
| `setNotificationHandler: handler is required` | Not on a page yet |
| `setPointScaleFactor: Int32 storage supports scale 0 or 1 only` | Not on a page yet |
| `setProtectedHeader can only be called once` | Not on a page yet |
| `setRequestHandler: handler is required` | Not on a page yet |
| `setRunnerDeclaredNestedRepositoryDiff(false) is test-only: the runner's declaration is one-way in production` | Not on a page yet |
| `setRunnerDeclaredNoRepositoryCheckedOut(false) is test-only: the runner's declaration is one-way in production` | Not on a page yet |
| `setSharedUnprotectedHeader can only be called once` | Not on a page yet |
| `setStdioProbeTimeoutMsForTest is test-only` | Not on a page yet |
| `setUnprotectedHeader can only be called once` | Not on a page yet |
| `setWizardOperatorToolsEnabled(false) is test-only: the wizard latch is one-way in production` | Not on a page yet |
| `set_mcp_permission_mode_override: serverName must be a string` | Not on a page yet |
| `settings file present but unreadable` | Not on a page yet |
| `settings review store: no room, proposal not staged` | Not on a page yet |
| `settings storageV5 write failed: ${…}${…}` | Not on a page yet |
| `setup_overage_billing unavailable: ${…}` | Not on a page yet |
| `share is not available in this session.` | Not on a page yet |
| `shortWordSlugFromSeed needs at least 8 seed bytes` | Not on a page yet |
| `signed header "${…}" is missing from the request` | Not on a page yet |
| `simpleCluster: no flatKey on .${…}` | Not on a page yet |
| `sizeCalculation must be a function` | Not on a page yet |
| `sizeCalculation return invalid (expect positive integer)` | Not on a page yet |
| `sizeCalculation set to non-function` | Not on a page yet |
| `snapshot copy failed: ${…}${…}` | Not on a page yet |
| `sparse arrays not allowed` | Not on a page yet |
| `spawn-hint account_email: control character` | Not on a page yet |
| `spawn-hint attempt: unsafe value` | Not on a page yet |
| `spawn-hint correlation_id: unsafe value` | Not on a page yet |
| `spawn-hint repo_sources: unsafe git URL` | Not on a page yet |
| `spawn-hint repo_sources: unsafe revision` | Not on a page yet |
| `spawn-hint server_time: unsafe value` | Not on a page yet |
| `spawn-hint work_order_jwt: unsafe character (not base64url + dot)` | Not on a page yet |
| `spawn-runner hook at ${…} is not a regular file` | Not on a page yet |
| `spawn-runner hook at ${…} is not executable (chmod +x ${…})` | Not on a page yet |
| `spawn-runner hook not found at ${…} — the orchestrator cannot start without it (${…})` | Not on a page yet |
| `spec file does not match the hash the harness launched this stand-in with — refusing to serve it` | Not on a page yet |
| `spec file is over the size limit the harness writes — refusing to read it` | Not on a page yet |
| `spec path is not a regular file — refusing to read it` | Not on a page yet |
| `spread not allowed in meta` | Not on a page yet |
| `staging block exited without a staging file` | Not on a page yet |
| `stats: transcript project listing failed` | Not on a page yet |
| `stats: transcript project listing unfinished at the page cap` | Not on a page yet |
| `steeringVarTable has no row for tier family "${…}"` | Not on a page yet |
| `stopTask: no turn received yet` | Not on a page yet |
| `stopped after ${…} redirects` | Not on a page yet |
| `store.postgres_url in ${…} is not a URL the gateway can read. It takes one host, as postgres://host:port/database; a comma-separated list of hosts is not supported. A password containing / ? # or % go…` | Not on a page yet |
| `store: this build cannot tell which sslmode store.postgres_url asks for, so it cannot tell how to verify the database. This is a fault in the build, not in the configuration: use another release of Cl…` | Not on a page yet |
| `streamUpload: unsupported request body type` | Not on a page yet |
| `strict JSON: ${…} at ${…}` | Not on a page yet |
| `string ${…} doesn't end with suffix ${…}; this is a bug` | Not on a page yet |
| `string ${…} doesn't start with prefix ${…}; this is a bug` | Not on a page yet |
| `string expected` | Not on a page yet |
| `string format ${…}` | Not on a page yet |
| `string len ${…} greater than remaining buf len.` | Not on a page yet |
| `stub preview cannot render a parameter whose display would drop code points` | Not on a page yet |
| `stub preview cannot render all parameters completely` | Not on a page yet |
| `stub preview cannot render an over-bound parameter` | Not on a page yet |
| `sub-agent listing incomplete` | Not on a page yet |
| `subfield coverage drift: "${…}" lacks subfield() metadata` | Not on a page yet |
| `submodule state unreadable — cannot verify worktree is clean` | Not on a page yet |
| `supportedDialogKinds requires an onUserDialog callback -- declaring dialog kinds without a handler would park dialogs nothing can answer. Provide onUserDialog, or omit supportedDialogKinds.` | Not on a page yet |
| `surrogate code points are not allowed` | Not on a page yet |
| `surrounding whitespace` | Not on a page yet |
| `suspicious path spelling: ${…}` | Not on a page yet |
| `symlink target has a symlink chain too long to vet` | Not on a page yet |
| `symlink target traverses a junction to remote UNC` | Not on a page yet |
| `sync is not available in this build` | Not on a page yet |
| `syncDir must be absolute` | Not on a page yet |
| `synced item name contains display-hazard characters` | Not on a page yet |
| `synced item name escapes the sync root` | Not on a page yet |
| `synced item name resolves to reserved path` | Not on a page yet |
| `synced item name resolves to sync root` | Not on a page yet |
| `syncedFileRequestSigner: NUL in a signed field` | Not on a page yet |
| `syncedFileRequestSigner: the content hash is not 32 bytes` | Not on a page yet |
| `syncedFileRequestSigner: the size is not a byte count` | Not on a page yet |
| `tag encountered with missing fields, need 'tag' and 'value', found: ${…}` | Not on a page yet |
| `takes an object of state variables to update or a function which returns an object of state variables.` | Not on a page yet |
| `target must be an object` | Not on a page yet |
| `template interpolation not allowed in meta` | Not on a page yet |
| `template prepare timed out` | Not on a page yet |
| `test(name, { plugins }): "${…}" is no plugin name (lowercase letters, digits and dashes)` | Not on a page yet |
| `test(name, { plugins }): ${…} is loaded twice` | Not on a page yet |
| `` test(name, { plugins }): ${…}'s register is written `register(on) { ... }` `` | Not on a page yet |
| `text contains invisible or control characters, or a run of exotic blanks (non-breaking/ideographic spaces, braille blanks), that consent surfaces cannot display faithfully — note this includes the joi…` | Not on a page yet |
| `text is ${…} bytes of UTF-8 after permission or hook rewrites — the limit is ${…}. Shorten the reply.` | Not on a page yet |
| `text is empty or visually blank after permission or hook rewrites — a reply no approval surface could display is not posted` | Not on a page yet |
| `the ${…} header value contains a control character` | Not on a page yet |
| `the ${…}header cannot be set through this session's GitHub proxy; headers that can: ${…}` | Not on a page yet |
| `the Anthropic profile configs directory (ANTHROPIC_CONFIG_DIR/configs) could not be read (${…}), so the Bash sandbox cannot exclude its credential files — a Bash-granting evaluation cannot run here` | Not on a page yet |
| `the JSON array contains an empty element — remove it, or fill in the value it was a placeholder for` | Not on a page yet |
| `the MDM settings have not been read yet` | Not on a page yet |
| `the REPL does not run for a remote caller` | Not on a page yet |
| `the WorktreeCreate hook emitted a path with dot segments (${…}) — the symlink screen cannot verify a dotted spelling; have the hook emit a normalized (dot-free) absolute path` | Not on a page yet |
| `the WorktreeCreate hook's worktree path component ${…} ${…} — a repository-committed symlink below the checkout root could redirect the worktree outside the repository` | Not on a page yet |
| ``the `--paginate` option is not supported for non-GET requests; with fields the method is POST unless `-X GET` sends them as query parameters`` | Not on a page yet |
| `the answer had no inputTokens` | Not on a page yet |
| ``the answer holds a `then` that is not fixed`` | Not on a page yet |
| `the build carried no hooks module scan for ${…}` | Not on a page yet |
| `the built-in gh api is off in this session: nonessential network traffic is disabled (CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC)` | Not on a page yet |
| `the call no longer names the files that were approved (one file where a list was approved) — retry so it is checked again` | Not on a page yet |
| `the call no longer names the files that were approved (one file where a list was approved, a list of another length, or a file whose identity was not recorded) — retry so it is checked again` | Not on a page yet |
| `the case's scaffold created ${…}/ in the run's working directory — that name is reserved for the run's artifact publishes; have the scaffold use another name` | Not on a page yet |
| `the connect deadline fired as the response arrived` | Not on a page yet |
| `the context breakdown isn't available over this remote connection` | Not on a page yet |
| `the create was cancelled` | Not on a page yet |
| `the destination no longer matches the one this read was approved for — nothing was fetched; retry so it is checked again` | Not on a page yet |
| `the directory cannot be opened` | Not on a page yet |
| `the directory for verified hook copies is no longer the one this process made` | Not on a page yet |
| `the directory for verified hook copies is now where the cloud session can write` | Not on a page yet |
| `the directory modes did not take, the sealed trees are not the ones that were moved, the kept directory holds an unexpected entry, or something reappeared at home/ or tmp/ before the directory locked` | Not on a page yet |
| `the element constructor did not build an element` | Not on a page yet |
| `the endpoint contains a tab, a line break, a control character or a backslash` | Not on a page yet |
| `the endpoint is not a valid URL path` | Not on a page yet |
| `the engine is used before its load` | Not on a page yet |
| `the file at this path could not be vouched for` | Not on a page yet |
| `the file at this path is not the one approved` | Not on a page yet |
| `the file became shorter while it was being uploaded` | Not on a page yet |
| `the file is one of Claude's own files, or its name has text-direction characters` | Not on a page yet |
| `the file is over the size limit` | Not on a page yet |
| `the file is too large to send back as text` | Not on a page yet |
| `the file was fetched but could not be saved (${…})` | Not on a page yet |
| `the files map no longer names the copies that were approved (each destination with its source) — nothing was published; retry so the publish is checked again` | Not on a page yet |
| `the files together are larger than one call places` | Not on a page yet |
| `the frontmatter is refused or does not parse` | Not on a page yet |
| `the harness is running as root, which a directory mode does not bind` | Not on a page yet |
| `the home, Claude config, temp, plugin-parent or case-parent directory on this machine has a glob character (* ? [ ]) in its path (as written or where it really points), so the Bash sandbox cannot excl…` | Not on a page yet |
| `the hook has no filesystem lists` | Not on a page yet |
| `the ingest answered ${…}` | Not on a page yet |
| `the journal holds no mark after it was written` | Not on a page yet |
| `the kept directory is not the one the harness created` | Not on a page yet |
| `the kit answered results of the wrong shape` | Not on a page yet |
| `the kit's ${…} imports ${…}, which is no module of it` | Not on a page yet |
| `the kit's ${…} imports ${…}, which is outside the kit` | Not on a page yet |
| `the managed-settings path was overridden` | Not on a page yet |
| `the measurement returned no data` | Not on a page yet |
| `the measurement returned too much data` | Not on a page yet |
| `the newest event could not be read` | Not on a page yet |
| `the old data directory changed during the copy` | Not on a page yet |
| `the old data directory is not the real directory first seen` | Not on a page yet |
| `the operator's home directory is the filesystem root, so the Bash sandbox cannot exclude it — a Bash-granting evaluation cannot run here (set HOME to a real home directory)` | Not on a page yet |
| `the organization policy snapshot could not be placed in the evaluation sandbox (a different file is already there or it could not be written)` | Not on a page yet |
| `the package manager finished but wrote no node_modules` | Not on a page yet |
| `the page did not load in the preview frame` | Not on a page yet |
| `the page reloaded or rewrote itself during the checks` | Not on a page yet |
| `the permission check for these saves expired before they ran (too many concurrent file operations) — nothing was fetched; retry so it is checked again` | Not on a page yet |
| `the plugin cache folder is not a directory` | Not on a page yet |
| `the plugin declares no such hook for that event here` | Not on a page yet |
| `the plugin's folder was moved or replaced by a link during the install, so the packages were not added` | Not on a page yet |
| `the preview gave up before its browser started` | Not on a page yet |
| `the preview wrapper did not load (${…})` | Not on a page yet |
| `the probe file was replaced while the probe ran` | Not on a page yet |
| `the record of attached computers gave no list` | Not on a page yet |
| `the remote sent a context breakdown this version can't read` | Not on a page yet |
| `the repo declares no such hook for that event now` | Not on a page yet |
| `the run created ${…}/ in its working directory — that name is reserved for the run's artifact publishes, so its file evidence cannot be trusted` | Not on a page yet |
| `the run made more artifact publishes (${…}) than the harness indexes (${…})` | Not on a page yet |
| `the run's artifact-publish staging directory changed while it was being indexed` | Not on a page yet |
| `the run's artifact-publish staging directory is gone although the run published (${…} corroborated) — its publishes cannot be vouched for` | Not on a page yet |
| `the scratch directory is no longer the one this pass created` | Not on a page yet |
| `the sealed directory mode did not take` | Not on a page yet |
| `the second server/discover does not offer ${…}` | Not on a page yet |
| `the session history could not be read` | Not on a page yet |
| `the session is ending, or no main-loop context is saved` | Not on a page yet |
| `the session token is not available` | Not on a page yet |
| `the session's events could not be read` | Not on a page yet |
| `the settings pack to re-send carries permissions of an unknown shape` | Not on a page yet |
| `the settings pack to re-send does not parse` | Not on a page yet |
| `the staged archive is missing, or is not the file this write staged` | Not on a page yet |
| `the staged file could not take the whole part` | Not on a page yet |
| `the staged file is not a file of this write` | Not on a page yet |
| `the staged file is not the one this write began` | Not on a page yet |
| `the staged file was replaced before it was placed` | Not on a page yet |
| `the staging folder is not a real directory` | Not on a page yet |
| `the stop action is missing` | Not on a page yet |
| `the stub publish directory is not a real directory` | Not on a page yet |
| `the sub-command was killed or did not exit with 0` | Not on a page yet |
| `the ui.resolve answer is a Proxy; a table of elements is a plain object` | Not on a page yet |
| `the upstream proxy URL must be http:// or https://` | Not on a page yet |
| ``the value contains an empty `""` token — remove it, or fill in the value it was a placeholder for`` | Not on a page yet |
| ``the value contains an unquoted shell metacharacter (one of ; \| & $ ( ) ` < >) — it is an argv list, not a shell command`` | Not on a page yet |
| `this approval was already used by an earlier attempt — nothing was created now; retry so it is asked again` | Not on a page yet |
| `this batch no longer lists the writes that were approved (entries were added or removed) — nothing was read or sent; retry so it is checked again` | Not on a page yet |
| `this batch no longer lists the writes that were approved (entries were added, removed, or it was approved as a single write) — nothing was read or sent; retry so it is checked again` | Not on a page yet |
| `this browser ignored the preview network lock-down; preview stopped before loading the page` | Not on a page yet |
| `this drawing was unmounted` | Not on a page yet |
| `this input was approved as a create from an Artifact type and no longer names one — nothing was published; retry so it is checked again` | Not on a page yet |
| `this is a public artifact from outside your organization; its page data is not readable here — read the page or its files instead` | Not on a page yet |
| `this machine could not judge the hook's condition` | Not on a page yet |
| `this machine could not judge the hook's matcher` | Not on a page yet |
| `this machine could not read the plugin's hooks for now` | Not on a page yet |
| `this machine has not settled its plugins yet: ask again` | Not on a page yet |
| `this machine keeps the plugin's hooks off (its settings or policy, how it was launched, or a folder nobody has trusted)` | Not on a page yet |
| `this machine keeps the repo's hooks off` | Not on a page yet |
| `this machine's policy cannot be read for now` | Not on a page yet |
| `this machine's settings hold account plugins for now` | Not on a page yet |
| `this machine's settings keep a skill's hooks off` | Not on a page yet |
| `this process writes nothing to disk` | Not on a page yet |
| `this read was approved as a lookup of people's names, and it now asks for documents instead — nothing was fetched; retry so it is checked as a database read` | Not on a page yet |
| `this read was approved to save documents under out_dir, and it now asks for names instead — nothing was fetched; retry so it is checked again` | Not on a page yet |
| `this read was approved to save documents under out_dir, and out_dir was removed afterwards — nothing was fetched, so no document entered the conversation; retry so the read is checked as an inline rea…` | Not on a page yet |
| `this read was approved without out_dir, and one was added afterwards — nothing was fetched; retry so the destination is checked` | Not on a page yet |
| `this read's approval cannot be matched to a working-copy read of this file now (the approval named another kind of read, the file stopped being one this session can hold a working copy of, or the chec…` | Not on a page yet |
| `this runtime, Bun 1.3 or earlier, trusts its own store beside the one root given` | Not on a page yet |
| `this schema (generated code failed to evaluate: ${…})` | Not on a page yet |
| `this session cannot send files to other sessions on this machine` | Not on a page yet |
| `this session has no first-party credential to authorize` | Not on a page yet |
| `this test has ended` | Not on a page yet |
| `this write reads back the stored document (a str_replace, or a write pinned with if_version) and has no approval record in this session — nothing was written; retry so it is checked again` | Not on a page yet |
| `this write was approved as a batch (or its approval record is unreadable) and rewritten since — nothing was read or sent; retry so it is checked again` | Not on a page yet |
| `this write was approved to send a local file, and file_path was removed afterwards — nothing was sent; retry so the inline data is checked` | Not on a page yet |
| `this write was approved with inline data, and a file_path was added afterwards — nothing was read or sent; retry so the file is checked` | Not on a page yet |
| `thread_id is not a valid thread id after permission or hook rewrites` | Not on a page yet |
| `thread_id must be a thread id from action "comments" (a lowercase UUID)` | Not on a page yet |
| `timeout: no answer from the cloud worker in time` | Not on a page yet |
| `timestamp out of range` | Not on a page yet |
| `title must be non-empty` | Not on a page yet |
| `tlsTerminate needs Node, or Bun 1.4 or later (this is ${…})` | Not on a page yet |
| `tlsTerminate: CA PEM pair: ${…}` | Not on a page yet |
| `tlsTerminate: CA at ${…}: ${…}` | Not on a page yet |
| `tlsTerminate: caCertPath and caKeyPath must be provided together` | Not on a page yet |
| `toggleMcpServer: no mcpDelegate wired (server: ${…})` | Not on a page yet |
| `tokenizer '${…}' does not exist` | Not on a page yet |
| `too many stream-base spellings` | Not on a page yet |
| `tool host helper: the session id is not usable` | Not on a page yet |
| `tool-results file refused: this session keeps no files on this machine` | Not on a page yet |
| `tool-results path refused: ${…} is a link or not a directory` | Not on a page yet |
| `tool_result blocks are not matching any tool_use from the previous message` | Not on a page yet |
| `topic is required for action "room_send"` | Not on a page yet |
| `trailing bytes after x5c certificate DER` | Not on a page yet |
| `trailing separator` | Not on a page yet |
| `transcript ranged read failed` | Not on a page yet |
| `transcript record cursor did not advance during load` | Not on a page yet |
| `transcript record page failed during load` | Not on a page yet |
| `transcript stream absent during load` | Not on a page yet |
| `transcript stream append failed` | Not on a page yet |
| `transcript stream replace failed` | Not on a page yet |
| `transcriptLines takes text: open the stream with an encoding` | Not on a page yet |
| `tree anchor is closed` | Not on a page yet |
| `tryAppend: short write to ${…} stalled with ${…} bytes remaining` | Not on a page yet |
| `ttl must be a positive integer if specified` | Not on a page yet |
| `type cannot be converted ${…}` | Not on a page yet |
| `type must be JSONType or JSONType[]: ${…}` | Not on a page yet |
| `type: null contradicts nullable: false` | Not on a page yet |
| `u64be: not a non-negative safe integer` | Not on a page yet |
| `uint32 out of range` | Not on a page yet |
| `undefined env var in config: ${…}` | Not on a page yet |
| `unevaluatedItems is not supported` | Not on a page yet |
| `unevaluatedProperties is not supported` | Not on a page yet |
| `unexpected "aud" claim value` | Not on a page yet |
| `unexpected "iss" claim value` | Not on a page yet |
| `unexpected "sub" claim value` | Not on a page yet |
| `unexpected "typ" JWT header value` | Not on a page yet |
| `unexpected argument '${…}' — this command takes no positional arguments` | Not on a page yet |
| `unexpected asset response (${…})` | Not on a page yet |
| `unexpected end of (decode) payload.` | Not on a page yet |
| `unexpected end of map payload.` | Not on a page yet |
| `unexpected major type ${…} for map key at index ${…}.` | Not on a page yet |
| `unexpected major type ${…} for map key.` | Not on a page yet |
| `unexpected major type ${…} in indefinite string.` | Not on a page yet |
| `unexpected minor value ${…}.` | Not on a page yet |
| `unexpected parse option { from: '${…}' }` | Not on a page yet |
| `unimplemented: ${…}` | Not on a page yet |
| `unionCluster: no selector discriminates "${…}"` | Not on a page yet |
| `unknown flag ${…}` | Not on a page yet |
| `unknown form field: ${…}` | Not on a page yet |
| `unknown kid` | Not on a page yet |
| `unknown option '${…}' Usage: ${…}` | Not on a page yet |
| `unknown option '${…}' Usage: claude respawn <id>\|--all` | Not on a page yet |
| `unknown placement option — the only one is top (a boolean)` | Not on a page yet |
| `unknown worker kind: ${…}` | Not on a page yet |
| `unknown-tool stub cannot render parameters` | Not on a page yet |
| `unreachable: fetchFilestoreToFile retry loop fell through` | Not on a page yet |
| `unrecognised depth` | Not on a page yet |
| `unrecognized resolve refusal` | Not on a page yet |
| `unsafe device-hook template directory` | Not on a page yet |
| `unstructured byte string len ${…} greater than remaining buf len.` | Not on a page yet |
| `unsupported Unicode single-quote in command line` | Not on a page yet |
| `unsupported asset type "${…}": upload_asset takes ${…}` | Not on a page yet |
| `unsupported asset type: upload_asset takes ${…}` | Not on a page yet |
| `unsupported index format version` | Not on a page yet |
| `unsupported input ${…}` | Not on a page yet |
| `unsupported key type in meta: ${…}` | Not on a page yet |
| `unsupported method; use GET, HEAD, POST, PUT, PATCH or DELETE` | Not on a page yet |
| `unsupported scheme or empty host` | Not on a page yet |
| `unsupported socket base scheme ${…}` | Not on a page yet |
| `unterminated double quote` | Not on a page yet |
| `update requires body` | Not on a page yet |
| `update requires trigger_id` | Not on a page yet |
| `update: the value was written by another every time it was read, up to the bound on tries; nothing was written` | Not on a page yet |
| `updateAddressList not supported on ResolvingLoadBalancer` | Not on a page yet |
| `upstream ${…}: sts:AssumeRole on ${…} for ${…} failed (${…}: ${…}); request not sent; the gateway's own credentials were not used instead. Check: ${…}.` | Not on a page yet |
| `upstream ${…}: sub=${…} has no usable ${…} claim for assume_role.session_name (set session_name: sub, or oidc.email_claim); request not sent` | Not on a page yet |
| `url and from_url must be two different artifact URLs for action "copy_from"` | Not on a page yet |
| `url and thread_id are required for action "resolve"` | Not on a page yet |
| `url, from_url or asset_ids no longer name the copy that was approved — nothing was copied; retry so it is checked again` | Not on a page yet |
| `url, thread_id and text are required for action "reply"` | Not on a page yet |
| `usage: claude respawn <id>\|--all` | Not on a page yet |
| `use the flattened module for creating JWS with b64: false` | Not on a page yet |
| `useClock must be used within a ClockProvider` | Not on a page yet |
| `useMailbox must be used within a MailboxProvider` | Not on a page yet |
| `useMcpReconnect must be used within MCPConnectionManager` | Not on a page yet |
| `useMcpToggleEnabled must be used within MCPConnectionManager` | Not on a page yet |
| `useTerminalNotification must be used within TerminalWriteProvider` | Not on a page yet |
| `useTerminalSize must be used within an Ink App component` | Not on a page yet |
| `useVoiceState must be used within a VoiceProvider` | Not on a page yet |
| `useWizard must be used within a WizardProvider` | Not on a page yet |
| `user is not a member of an allowed group` | Not on a page yet |
| `userinfo sub missing or does not match id_token sub` | Not on a page yet |
| `v(name) expects a non-empty string` | Not on a page yet |
| `v5 cooldown read failed: ${…}${…}` | Not on a page yet |
| `v5 cooldown write failed: ${…}${…}` | Not on a page yet |
| `v5 status write failed: ${…}${…}` | Not on a page yet |
| `value exceeds the display depth bound` | Not on a page yet |
| `value exceeds the element display budget` | Not on a page yet |
| `value exceeds the units display budget` | Not on a page yet |
| `value must be >= 0 and <= ${…}. Received ${…}` | Not on a page yet |
| `value must be >= 0 and <= 4294967295. Received ${…}` | Not on a page yet |
| `value nested too deep to canonicalize` | Not on a page yet |
| ``value starts with `[` but is not valid JSON`` | Not on a page yet |
| `verbatim poll event body breaks envelope` | Not on a page yet |
| `verified (kid=${…}, ${…})` | Not on a page yet |
| `verify is not available in this session.` | Not on a page yet |
| `verifySignedJwtWithCerts is removed, please use verifySignedJwtWithCertsAsync instead.` | Not on a page yet |
| `version is not available in this build` | Not on a page yet |
| `versionNegotiation: { pin: '${…}' } is not a modern protocol revision — pinning is for 2026-07-28 and later; omit versionNegotiation (or use mode: 'legacy') for 2025-era servers.` | Not on a page yet |
| `visitor must be a function` | Not on a page yet |
| `warning: --bg manages the session id; ignoring --session-id (use --resume <id> to continue an existing session)` | Not on a page yet |
| `warning: --exec ignores ${…} (only --name composes)` | Not on a page yet |
| `warning: --json result withheld because it failed schema validation` | Not on a page yet |
| `warning: background sessions do not support Windows network (UNC) paths; the following will be neutralized: ${…}` | Not on a page yet |
| `warning: eval result does not match resultSchema.ts (${…}) — please report this bug` | Not on a page yet |
| `warning: no agent named '${…}' — spawning with default template` | Not on a page yet |
| `warning: piped stdin exceeds ${…} bytes, truncated` | Not on a page yet |
| `warning: stdin is unreadable (${…}), proceeding without piped input` | Not on a page yet |
| `weighted round robin config ${…} parse error: expected ${…}, got ${…}` | Not on a page yet |
| `weighted round robin config ${…}: expected duration, got ${…}` | Not on a page yet |
| `weighted round robin config ${…}: failed to parse duration string ${…}` | Not on a page yet |
| `weighted round robin config error_utilization_penalty < 0` | Not on a page yet |
| `work secret rejected: ${…}` | Not on a page yet |
| `worker kind '${…}' is not available.` | Not on a page yet |
| `worker socket: ended without CCR's opening message (${…})` | Not on a page yet |
| `workflow result cannot be a function` | Not on a page yet |
| `workflow run ${…} is not founded` | Not on a page yet |
| `workflow run ${…} was killed` | Not on a page yet |
| `workflow run ${…} was restored from the journal on resume; its rules and work are gone — read its facts, or launch again` | Not on a page yet |
| `workflow('${…}'): ${…}` | Not on a page yet |
| `workflow('${…}'): no workflow with that name. Available: ${…}` | Not on a page yet |
| `workflow() expects a workflow name (string) or {scriptPath: string}` | Not on a page yet |
| `workflow({scriptPath: '${…}'}): ${…}` | Not on a page yet |
| `workflow({scriptPath}): this session restricts workflows to named bundled workflows (CLAUDE_WORKFLOW_NAME_ONLY is set) — nest with workflow('<name>') instead.` | Not on a page yet |
| `workforcePoolUserProject should not be set for non-workforce pool credentials.` | Not on a page yet |
| ``worktree "${…}" already exists at ${…} but cannot be reused (${…}). Remove that directory (with `git worktree remove` if it's a registered worktree, or by deleting it if it's a stray directory) or pas…`` | Not on a page yet |
| `worktree probe timed out` | Not on a page yet |
| `world full (${…} rows) — a rule is probably putting the fact it fires on` | Not on a page yet |
| `world journal read cursor failed to advance` | Not on a page yet |
| `wrapWithSandbox() returns a shell string and is not supported on Windows. Use SandboxManager.wrapWithSandboxArgv() and spawn the result with {shell: false}.` | Not on a page yet |
| `write returned 0 bytes with data remaining` | Not on a page yet |
| `writeRemoteAgentMetadata: storage write failed` | Not on a page yet |
| `writeRunMocks: agent responders need the agent service` | Not on a page yet |
| `write_files with localPath requires a plan finalized with localDir. Re-run finalize_plan with the bundle directory.` | Not on a page yet |
| `write_files: ${…} has both data and localPath` | Not on a page yet |
| `write_files: ${…} has neither data nor localPath` | Not on a page yet |
| `write_files: file at localPath exceeds the ${…} byte limit.` | Not on a page yet |
| `write_files: localPath must be a regular file.` | Not on a page yet |
| `write_files: localPath must be inside the directory approved at finalize_plan.` | Not on a page yet |
| `write_files: localPath resolves outside the directory approved at finalize_plan.` | Not on a page yet |
| `writes[${…}] was approved to send a local file, and file_path was removed afterwards — nothing was sent; retry so the inline data is checked` | Not on a page yet |
| `writes[${…}] was approved with inline data, and a file_path was added afterwards — nothing was read or sent; retry so the file is checked` | Not on a page yet |
| `z.compile: async .refine() predicates are not supported` | Not on a page yet |
| `z.compile: async .superRefine() / check functions are not supported` | Not on a page yet |
| `z.compile: async custom predicates are not supported` | Not on a page yet |
| `z.compile: async overwrite transforms are not supported` | Not on a page yet |
| `z.compile: async transforms are not supported` | Not on a page yet |
| `z.compile: async transforms in pipes are not supported` | Not on a page yet |
| `{${…}} would be more than one path segment here (this checkout's repository is a nested project path, not OWNER/REPO): spell the endpoint out` | Not on a page yet |
| `{owner}, {repo} and {branch} are filled in only in the path and query of an endpoint: this one is a URL with a placeholder before its path` | Not on a page yet |
| `{owner}/{repo} would be the repository of ${…}: ${…}` | Not on a page yet |
| `{owner}/{repo} would be this checkout's repository, whose remote is on another host: ${…}` | Not on a page yet |
| `• Check if you need to login: npm whoami` | Not on a page yet |
| `• Check your internet connection` | Not on a page yet |
| `• Corporate proxy/firewall blocking npm` | Not on a page yet |
| `• Internal/development build not published to npm` | Not on a page yet |
| `• Manually check: npm view ${…} version` | Not on a page yet |
| `• Network connectivity issues` | Not on a page yet |
| `• Run with --debug flag for more details` | Not on a page yet |
| `• npm registry is unreachable` | Not on a page yet |
| `┌─────────────────────────────────────┐ │ Claude Code Gateway │ └─────────────────────────────────────┘` | Not on a page yet |
| `U+26A0 Sandbox disabled: ${…} Commands will run WITHOUT sandboxing. Network and filesystem restrictions will NOT be enforced.` | Not on a page yet |
| `U+274C Sandbox Error: ${…}` | Not on a page yet |

## Files

Items: 78.

| Item | Where |
| --- | --- |
| `.cc-writes` | Not on a page yet |
| `.config.json` | Not on a page yet |
| `.deep-link-register-failed` | Not on a page yet |
| `.last-cleanup` | Not on a page yet |
| `.last-update-result.json` | Not on a page yet |
| `.update.lock` | Not on a page yet |
| `CLAUDE.md` | [Files on Disk](../start/files-on-disk.md) |
| `active-time.json` | Not on a page yet |
| `agent-memory` | Not on a page yet |
| `asset-cache` | Not on a page yet |
| `backups` | Not on a page yet |
| `ca-bundle.crt` | Not on a page yet |
| `cache` | Not on a page yet |
| `changelog.md` | Not on a page yet |
| `chrome` | Not on a page yet |
| `commands` | Not on a page yet |
| `computer-use.lock` | Not on a page yet |
| `cowork_plugins` | Not on a page yet |
| `daemon` | Not on a page yet |
| `daemon.json` | Not on a page yet |
| `daemon.lock` | Not on a page yet |
| `daemon.log` | Not on a page yet |
| `daemon.scheduled.status.json` | Not on a page yet |
| `daemon.status.json` | Not on a page yet |
| `debug` | Not on a page yet |
| `dev-mods` | Not on a page yet |
| `device-unbound-creates.json` | Not on a page yet |
| `drafts` | Not on a page yet |
| `dump-prompts` | Not on a page yet |
| `feedback-bundles` | Not on a page yet |
| `file-transfers` | Not on a page yet |
| `fork-seeds` | Not on a page yet |
| `gh-pr-status-cache.json` | Not on a page yet |
| `hfi-auth.json` | Not on a page yet |
| `history.jsonl` | [Files on Disk](../start/files-on-disk.md) |
| `image-cache` | Not on a page yet |
| `jobs` | Not on a page yet |
| `keybindings.json` | Not on a page yet |
| `local` | Not on a page yet |
| `loop.md` | Not on a page yet |
| `mcp-discover-verdicts.json` | Not on a page yet |
| `mcp-discovery-cache` | Not on a page yet |
| `mcp-needs-auth-cache.json` | Not on a page yet |
| `mcp-skill-archives` | Not on a page yet |
| `model-access.json` | Not on a page yet |
| `model-catalog` | Not on a page yet |
| `my-closed-issues.json` | Not on a page yet |
| `org-memory-discovery.json` | Not on a page yet |
| `output-styles` | Not on a page yet |
| `paste-cache` | Not on a page yet |
| `personal` | Not on a page yet |
| `plans` | Not on a page yet |
| `plugins` | Not on a page yet |
| `policy-limits.json` | Not on a page yet |
| `projects` | Not on a page yet |
| `provider-probe-verdicts.json` | Not on a page yet |
| `remote-settings-consent.json` | Not on a page yet |
| `remote-settings-helper-consent` | Not on a page yet |
| `remote-settings.json` | Not on a page yet |
| `rules` | Not on a page yet |
| `seed-admin` | Not on a page yet |
| `sessions` | Not on a page yet |
| `settings.json` | Not on a page yet |
| `shares` | Not on a page yet |
| `shell-snapshots` | Not on a page yet |
| `skills` | Not on a page yet |
| `startup-perf` | Not on a page yet |
| `state` | Not on a page yet |
| `stats-cache.json` | Not on a page yet |
| `tasks` | Not on a page yet |
| `team-discovery.json` | Not on a page yet |
| `teams` | Not on a page yet |
| `telemetry` | Not on a page yet |
| `themes` | Not on a page yet |
| `traces` | Not on a page yet |
| `uploads` | Not on a page yet |
| `usage-data` | Not on a page yet |
| `workflows` | Not on a page yet |

## CLI Flags

Items: 303.

| Item | Where |
| --- | --- |
| `--add-dir` | Not on a page yet |
| `--advisor` | Not on a page yet |
| `--agent` | Not on a page yet |
| `--agent-color` | Not on a page yet |
| `--agent-id` | Not on a page yet |
| `--agent-name` | Not on a page yet |
| `--agent-type` | Not on a page yet |
| `--agents` | Not on a page yet |
| `--all` | [Subcommands](../configure/cli/subcommands.md) |
| `--allow-dangerously-skip-permissions` | [All Flags](../configure/cli/flags.md) |
| `--allow-other-models` | [All Flags](../configure/cli/flags.md) |
| `--allowedTools` | Not on a page yet |
| `--append-subagent-system-prompt` | Not on a page yet |
| `--append-subagent-system-prompt-file` | Not on a page yet |
| `--append-system-prompt` | Not on a page yet |
| `--append-system-prompt-file` | Not on a page yet |
| `--attach-serve` | Not on a page yet |
| `--autocompact` | Not on a page yet |
| `--await-claim` | [All Flags](../configure/cli/flags.md) |
| `--await-initialize` | [All Flags](../configure/cli/flags.md) |
| `--ax-screen-reader` | [All Flags](../configure/cli/flags.md) |
| `--bare` | [All Flags](../configure/cli/flags.md) |
| `--betas` | Not on a page yet |
| `--bg` | Not on a page yet |
| `--brief` | [All Flags](../configure/cli/flags.md) |
| `--channels` | Not on a page yet |
| `--chrome` | [All Flags](../configure/cli/flags.md) |
| `--client-data-url` | [All Flags](../configure/cli/flags.md) |
| `--cloud` | [All Flags](../configure/cli/flags.md) |
| `--continue` | [All Flags](../configure/cli/flags.md) |
| `--correlation-id` | Not on a page yet |
| `--dangerously-load-development-channels` | Not on a page yet |
| `--dangerously-skip-permissions` | [All Flags](../configure/cli/flags.md) |
| `--debug` | Not on a page yet |
| `--debug-file` | Not on a page yet |
| `--debug-to-stderr` | Not on a page yet |
| `--deep-link-cwd-b64` | Not on a page yet |
| `--deep-link-last-fetch` | Not on a page yet |
| `--deep-link-origin` | [All Flags](../configure/cli/flags.md) |
| `--deep-link-repo` | Not on a page yet |
| `--desktop` | [All Flags](../configure/cli/flags.md) |
| `--disable-slash-commands` | [All Flags](../configure/cli/flags.md) |
| `--disallowedTools` | Not on a page yet |
| `--effort` | Not on a page yet |
| `--enable-auth-status` | [All Flags](../configure/cli/flags.md) |
| `--enable-auto-mode` | Not on a page yet |
| `--environment` | [All Flags](../configure/cli/flags.md) |
| `--exclude-dynamic-system-prompt-sections` | [All Flags](../configure/cli/flags.md) |
| `--fallback-model` | Not on a page yet |
| `--fast-mode` | Not on a page yet |
| `--file` | Not on a page yet |
| `--fork-session` | [All Flags](../configure/cli/flags.md) |
| `--forward-home-settings` | Not on a page yet |
| `--forward-subagent-text` | [All Flags](../configure/cli/flags.md) |
| `--from-pr` | Not on a page yet |
| `--host-auth-is-org-sign-in` | [All Flags](../configure/cli/flags.md) |
| `--ide` | [All Flags](../configure/cli/flags.md) |
| `--include-hook-events` | [All Flags](../configure/cli/flags.md) |
| `--include-partial-messages` | [All Flags](../configure/cli/flags.md) |
| `--include-unsupported-models` | [All Flags](../configure/cli/flags.md) |
| `--inherit-permission-mode` | Not on a page yet |
| `--init` | [All Flags](../configure/cli/flags.md) |
| `--init-only` | [All Flags](../configure/cli/flags.md) |
| `--input-format` | Not on a page yet |
| `--json-schema` | Not on a page yet |
| `--maintenance` | [All Flags](../configure/cli/flags.md) |
| `--managed-settings` | Not on a page yet |
| `--max-budget-usd` | Not on a page yet |
| `--max-thinking-tokens` | Not on a page yet |
| `--max-turns` | Not on a page yet |
| `--mcp-config` | [All Flags](../configure/cli/flags.md) |
| `--messaging-socket-path` | Not on a page yet |
| `--model` | Not on a page yet |
| `--name` | Not on a page yet |
| `--no-chrome` | [All Flags](../configure/cli/flags.md) |
| `--no-session-persistence` | [All Flags](../configure/cli/flags.md) |
| `--on-branch` | Not on a page yet |
| `--output-format` | Not on a page yet |
| `--parent-session-id` | Not on a page yet |
| `--permission-mode` | Not on a page yet |
| `--permission-prompt-tool` | [All Flags](../configure/cli/flags.md) |
| `--permission-prompts` | Not on a page yet |
| `--plan-mode-instructions` | Not on a page yet |
| `--plan-mode-required` | [All Flags](../configure/cli/flags.md) |
| `--plugin-dir` | [All Flags](../configure/cli/flags.md) |
| `--plugin-dir-no-mcp` | Not on a page yet |
| `--plugin-url` | Not on a page yet |
| `--pool` | Not on a page yet |
| `--prefill` | Not on a page yet |
| `--prefill-b64` | Not on a page yet |
| `--print` | [All Flags](../configure/cli/flags.md) |
| `--proactivity` | Not on a page yet |
| `--project-config-root` | Not on a page yet |
| `--prompt-suggestions` | Not on a page yet |
| `--rc` | Not on a page yet |
| `--ref` | Not on a page yet |
| `--remote` | Not on a page yet |
| `--remote-control` | [All Flags](../configure/cli/flags.md) |
| `--remote-control-session-name-prefix` | Not on a page yet |
| `--replay-user-messages` | [All Flags](../configure/cli/flags.md) |
| `--reply-on-resume` | [All Flags](../configure/cli/flags.md) |
| `--restricted` | [All Flags](../configure/cli/flags.md) |
| `--resume` | [All Flags](../configure/cli/flags.md) |
| `--resume-drops-turn` | Not on a page yet |
| `--resume-session-at` | Not on a page yet |
| `--rewind-files` | Not on a page yet |
| `--runner-declares` | Not on a page yet |
| `--safe-mode` | [All Flags](../configure/cli/flags.md) |
| `--sdk-url` | Not on a page yet |
| `--session-id` | Not on a page yet |
| `--session-mirror` | [All Flags](../configure/cli/flags.md) |
| `--setting-sources` | Not on a page yet |
| `--settings` | Not on a page yet |
| `--strict-mcp-config` | [All Flags](../configure/cli/flags.md) |
| `--system-prompt` | Not on a page yet |
| `--system-prompt-file` | Not on a page yet |
| `--system-prompt-snapshot` | Not on a page yet |
| `--task-budget` | Not on a page yet |
| `--team-name` | Not on a page yet |
| `--teammate-mode` | Not on a page yet |
| `--teleport` | [CLI Overview](../configure/cli/index.md) |
| `--thinking` | [All Flags](../configure/cli/flags.md) |
| `--thinking-display` | Not on a page yet |
| `--tmux` | [All Flags](../configure/cli/flags.md) |
| `--tools` | Not on a page yet |
| `--verbose` | [All Flags](../configure/cli/flags.md) |
| `--watch-artifact` | Not on a page yet |
| `--watch-artifact-no-autoreact` | Not on a page yet |
| `--workload` | Not on a page yet |
| `--worktree` | [All Flags](../configure/cli/flags.md) |
| `add --callback-port` | Not on a page yet |
| `add --client-id` | Not on a page yet |
| `add --client-secret` | Not on a page yet |
| `add --env` | Not on a page yet |
| `add --header` | Not on a page yet |
| `add --scope` | Not on a page yet |
| `add --transport` | Not on a page yet |
| `add --xaa` | Not on a page yet |
| `agents --add-dir` | Not on a page yet |
| `agents --agent` | Not on a page yet |
| `agents --all` | Not on a page yet |
| `agents --allow-dangerously-skip-permissions` | Not on a page yet |
| `agents --cwd` | Not on a page yet |
| `agents --dangerously-skip-permissions` | Not on a page yet |
| `agents --effort` | Not on a page yet |
| `agents --inherit-permission-mode` | Not on a page yet |
| `agents --json` | Not on a page yet |
| `agents --managed-settings` | Not on a page yet |
| `agents --mcp-config` | Not on a page yet |
| `agents --model` | Not on a page yet |
| `agents --permission-mode` | Not on a page yet |
| `agents --plugin-dir` | Not on a page yet |
| `agents --plugin-dir-no-mcp` | Not on a page yet |
| `agents --restricted` | Not on a page yet |
| `agents --setting-sources` | Not on a page yet |
| `agents --settings` | Not on a page yet |
| `agents --strict-mcp-config` | Not on a page yet |
| `auth login --claudeai` | Not on a page yet |
| `auth login --console` | Not on a page yet |
| `auth login --email` | Not on a page yet |
| `auth login --sso` | Not on a page yet |
| `auth status --json` | Not on a page yet |
| `auth status --text` | Not on a page yet |
| `auto-mode critique --model` | Not on a page yet |
| `auto-mode defaults --label` | Not on a page yet |
| `auto-mode reset --yes` | Not on a page yet |
| `design-login --json` | Not on a page yet |
| `design-login --status` | Not on a page yet |
| `drop-worktree-registrations --json` | Not on a page yet |
| `edit-chrome-settings --json` | Not on a page yet |
| `edit-hook --json` | Not on a page yet |
| `edit-memory-settings --json` | Not on a page yet |
| `edit-permission-rules --json` | Not on a page yet |
| `edit-sandbox-settings --json` | Not on a page yet |
| `edit-skill-overrides --json` | Not on a page yet |
| `gateway --config` | Not on a page yet |
| `import --dry-run` | Not on a page yet |
| `import --yes` | Not on a page yet |
| `import-conversations --cwd` | Not on a page yet |
| `import-conversations --dry-run` | Not on a page yet |
| `install --force` | Not on a page yet |
| `mcp add-from-claude-desktop --scope` | Not on a page yet |
| `mcp add-json --client-secret` | Not on a page yet |
| `mcp add-json --scope` | Not on a page yet |
| `mcp login --no-browser` | Not on a page yet |
| `mcp remove --scope` | Not on a page yet |
| `mcp serve --debug` | Not on a page yet |
| `mcp serve --port` | Not on a page yet |
| `mcp serve --result-format` | Not on a page yet |
| `mcp serve --session-tunnel` | Not on a page yet |
| `mcp serve --transport` | Not on a page yet |
| `mcp serve --verbose` | Not on a page yet |
| `plugin configure --cowork` | Not on a page yet |
| `plugin configure --json` | Not on a page yet |
| `plugin configure --values-stdin` | Not on a page yet |
| `plugin details --cowork` | Not on a page yet |
| `plugin disable --all` | Not on a page yet |
| `plugin disable --cowork` | Not on a page yet |
| `plugin disable --json` | Not on a page yet |
| `plugin disable --scope` | Not on a page yet |
| `plugin enable --cowork` | Not on a page yet |
| `plugin enable --json` | Not on a page yet |
| `plugin enable --scope` | Not on a page yet |
| `plugin eval --ablation` | Not on a page yet |
| `plugin eval --allow-real-servers` | Not on a page yet |
| `plugin eval --allow-tools` | Not on a page yet |
| `plugin eval --case` | Not on a page yet |
| `plugin eval --concurrency` | Not on a page yet |
| `plugin eval --disallow-tools` | Not on a page yet |
| `plugin eval --eval-dir` | Not on a page yet |
| `plugin eval --json` | Not on a page yet |
| `plugin eval --judge-model` | Not on a page yet |
| `plugin eval --keep-temp` | Not on a page yet |
| `plugin eval --max-cost-usd` | Not on a page yet |
| `plugin eval --mocks` | Not on a page yet |
| `plugin eval --model` | Not on a page yet |
| `plugin eval --no-publish` | Not on a page yet |
| `plugin eval --no-scaffold` | Not on a page yet |
| `plugin eval --output-dir` | Not on a page yet |
| `plugin eval --publish-report` | Not on a page yet |
| `plugin eval --report` | Not on a page yet |
| `plugin eval --runs` | Not on a page yet |
| `plugin eval --scaffold` | Not on a page yet |
| `plugin eval --tag` | Not on a page yet |
| `plugin eval --threshold` | Not on a page yet |
| `plugin eval --trust-plugin` | Not on a page yet |
| `plugin eval --verbose` | Not on a page yet |
| `plugin eval init --bare` | Not on a page yet |
| `plugin eval init --eval-dir` | Not on a page yet |
| `plugin eval init --interactive` | Not on a page yet |
| `plugin eval init --interview` | Not on a page yet |
| `plugin init --author` | Not on a page yet |
| `plugin init --author-email` | Not on a page yet |
| `plugin init --description` | Not on a page yet |
| `plugin init --force` | Not on a page yet |
| `plugin init --with` | Not on a page yet |
| `plugin install --accept-command` | Not on a page yet |
| `plugin install --config` | Not on a page yet |
| `plugin install --cowork` | Not on a page yet |
| `plugin install --json` | Not on a page yet |
| `plugin install --marketplace` | Not on a page yet |
| `plugin install --registry` | Not on a page yet |
| `plugin install --replace` | Not on a page yet |
| `plugin install --scope` | Not on a page yet |
| `plugin install --yes` | Not on a page yet |
| `plugin list --available` | Not on a page yet |
| `plugin list --cowork` | Not on a page yet |
| `plugin list --data-size` | Not on a page yet |
| `plugin list --json` | Not on a page yet |
| `plugin marketplace add --claudeai` | Not on a page yet |
| `plugin marketplace add --cowork` | Not on a page yet |
| `plugin marketplace add --from-link` | Not on a page yet |
| `plugin marketplace add --json` | Not on a page yet |
| `plugin marketplace add --resolve-only` | Not on a page yet |
| `plugin marketplace add --scope` | Not on a page yet |
| `plugin marketplace add --sparse` | Not on a page yet |
| `plugin marketplace list --cowork` | Not on a page yet |
| `plugin marketplace list --json` | Not on a page yet |
| `plugin marketplace remove --cowork` | Not on a page yet |
| `plugin marketplace remove --json` | Not on a page yet |
| `plugin marketplace remove --scope` | Not on a page yet |
| `plugin marketplace update --cowork` | Not on a page yet |
| `plugin marketplace update --json` | Not on a page yet |
| `plugin prune --cowork` | Not on a page yet |
| `plugin prune --dry-run` | Not on a page yet |
| `plugin prune --scope` | Not on a page yet |
| `plugin prune --yes` | Not on a page yet |
| `plugin tag --dry-run` | Not on a page yet |
| `plugin tag --force` | Not on a page yet |
| `plugin tag --message` | Not on a page yet |
| `plugin tag --push` | Not on a page yet |
| `plugin tag --remote` | Not on a page yet |
| `plugin uninstall --cowork` | Not on a page yet |
| `plugin uninstall --json` | Not on a page yet |
| `plugin uninstall --keep-data` | Not on a page yet |
| `plugin uninstall --prune` | Not on a page yet |
| `plugin uninstall --scope` | Not on a page yet |
| `plugin uninstall --yes` | Not on a page yet |
| `plugin update --accept-command` | Not on a page yet |
| `plugin update --cowork` | Not on a page yet |
| `plugin update --json` | Not on a page yet |
| `plugin update --scope` | Not on a page yet |
| `plugin update --yes` | Not on a page yet |
| `plugin validate --cowork` | Not on a page yet |
| `plugin validate --json` | Not on a page yet |
| `plugin validate --profile` | Not on a page yet |
| `plugin validate --strict` | Not on a page yet |
| `purge --all` | Not on a page yet |
| `purge --dry-run` | Not on a page yet |
| `purge --interactive` | Not on a page yet |
| `purge --yes` | Not on a page yet |
| `sandbox uninstall --json` | Not on a page yet |
| `ultrareview --json` | Not on a page yet |
| `ultrareview --no-post` | Not on a page yet |
| `ultrareview --post` | Not on a page yet |
| `ultrareview --timeout` | Not on a page yet |
| `ultrareview --trust-workspace` | Not on a page yet |
| `xaa login --force` | Not on a page yet |
| `xaa login --id-token` | Not on a page yet |
| `xaa setup --callback-port` | Not on a page yet |
| `xaa setup --client-id` | Not on a page yet |
| `xaa setup --client-secret` | Not on a page yet |
| `xaa setup --issuer` | Not on a page yet |

## Gates

Items: 1101.

| Item | Where |
| --- | --- |
| `tengu_1p_event_batch_config` | Not on a page yet |
| `tengu_agents_md_mod` | Not on a page yet |
| `tengu_agentview_inherit_mode_demote` | Not on a page yet |
| `tengu_agile_glade` | Not on a page yet |
| `tengu_alder_compass` | Not on a page yet |
| `tengu_amber_anchor` | Not on a page yet |
| `tengu_amber_creek` | Not on a page yet |
| `tengu_amber_curlew` | Not on a page yet |
| `tengu_amber_ferry` | Not on a page yet |
| `tengu_amber_flint` | Not on a page yet |
| `tengu_amber_kestrel` | Not on a page yet |
| `tengu_amber_larch` | Not on a page yet |
| `tengu_amber_lark` | Not on a page yet |
| `tengu_amber_lattice` | Not on a page yet |
| `tengu_amber_ledger` | Not on a page yet |
| `tengu_amber_lynx` | Not on a page yet |
| `tengu_amber_moleskin` | Not on a page yet |
| `tengu_amber_packet` | Not on a page yet |
| `tengu_amber_prism` | Not on a page yet |
| `tengu_amber_quillwort` | Not on a page yet |
| `tengu_amber_redwood2` | Not on a page yet |
| `tengu_amber_redwood3` | Not on a page yet |
| `tengu_amber_relay` | Not on a page yet |
| `tengu_amber_rokovoko` | Not on a page yet |
| `tengu_amber_sentinel` | Not on a page yet |
| `tengu_amber_sextant` | Not on a page yet |
| `tengu_amber_tally` | Not on a page yet |
| `tengu_amber_tollgate` | Not on a page yet |
| `tengu_ant_yolo_equiv_strip_config` | Not on a page yet |
| `tengu_async_goblet` | Not on a page yet |
| `tengu_async_snowglobe` | Not on a page yet |
| `tengu_attempt_decision_shadow` | Not on a page yet |
| `tengu_auto_mode_config` | Not on a page yet |
| `tengu_auto_mode_worktree_fast_path` | Not on a page yet |
| `tengu_ax_screen_reader` | Not on a page yet |
| `tengu_ax_sr_arrow_nav` | Not on a page yet |
| `tengu_ax_sr_suggestion_nav` | Not on a page yet |
| `tengu_bad_survey_transcript_ask_config` | Not on a page yet |
| `tengu_basalt_meadow` | Not on a page yet |
| `tengu_basalt_scarp` | Not on a page yet |
| `tengu_basalt_spur` | Not on a page yet |
| `tengu_bg_attach_stall_ms` | Not on a page yet |
| `tengu_bg_attach_upgrade` | Not on a page yet |
| `tengu_bg_binary_takeover` | Not on a page yet |
| `tengu_bg_classifier_config` | Not on a page yet |
| `tengu_bg_leftarrow_inprocess` | Not on a page yet |
| `tengu_bg_low_mem_mb` | Not on a page yet |
| `tengu_bg_prewarm_burst_concurrency` | Not on a page yet |
| `tengu_bg_prewarm_burst_delay_ms` | Not on a page yet |
| `tengu_bg_prewarm_per_sweep` | Not on a page yet |
| `tengu_bg_revival_guard` | Not on a page yet |
| `tengu_bg_spare_enable` | Not on a page yet |
| `tengu_bg_worker_ctty` | Not on a page yet |
| `tengu_binary_balloon` | Not on a page yet |
| `tengu_binary_lollipop` | Not on a page yet |
| `tengu_binary_music` | Not on a page yet |
| `tengu_birch_kettle` | Not on a page yet |
| `tengu_birch_lantern` | Not on a page yet |
| `tengu_bracken_sluice` | Not on a page yet |
| `tengu_bramble_lintel` | Not on a page yet |
| `tengu_brass_plover` | Not on a page yet |
| `tengu_brass_sled` | Not on a page yet |
| `tengu_breezy_crescent` | Not on a page yet |
| `tengu_breezy_diffie` | Not on a page yet |
| `tengu_breezy_fairy` | Not on a page yet |
| `tengu_breezy_haven` | Not on a page yet |
| `tengu_breezy_pelican` | Not on a page yet |
| `tengu_brick_follow` | Not on a page yet |
| `tengu_bridge_apply_server_session_config` | Not on a page yet |
| `tengu_bridge_attestation_enforce` | Not on a page yet |
| `tengu_bridge_attestation_enforce_config` | Not on a page yet |
| `tengu_bridge_auth_revive` | Not on a page yet |
| `tengu_bridge_child_auto_mode` | Not on a page yet |
| `tengu_bridge_child_auto_over_settings` | Not on a page yet |
| `tengu_bridge_child_file_upload` | Not on a page yet |
| `tengu_bridge_child_machine_settings` | Not on a page yet |
| `tengu_bridge_child_tool_diff` | Not on a page yet |
| `tengu_bridge_host_declined_end` | Not on a page yet |
| `tengu_bridge_host_profile` | Not on a page yet |
| `tengu_bridge_inbox_pointer_boundary` | Not on a page yet |
| `tengu_bridge_initialize_commands` | Not on a page yet |
| `tengu_bridge_min_version` | Not on a page yet |
| `tengu_bridge_owner_check_attribution` | Not on a page yet |
| `tengu_bridge_owner_pinned_end` | Not on a page yet |
| `tengu_bridge_partial_messages` | Not on a page yet |
| `tengu_bridge_placeholder_sweep` | Not on a page yet |
| `tengu_bridge_poll_interval_config` | Not on a page yet |
| `tengu_bridge_rc_child_artifact` | Not on a page yet |
| `tengu_bridge_rc_child_auto_compact` | Not on a page yet |
| `tengu_bridge_rc_child_idle_exit_ms` | Not on a page yet |
| `tengu_bridge_rc_child_restart_resume` | Not on a page yet |
| `tengu_bridge_rc_projects_hint` | Not on a page yet |
| `tengu_bridge_recovery_patience` | Not on a page yet |
| `tengu_bridge_repl_v2_config` | Not on a page yet |
| `tengu_bridge_repl_v2_cse_shim_enabled` | Not on a page yet |
| `tengu_bridge_requires_action_details` | Not on a page yet |
| `tengu_bridge_resume_respects_local_owner` | Not on a page yet |
| `tengu_bridge_selfheal_heartbeats` | Not on a page yet |
| `tengu_bridge_signed_out_neutral` | Not on a page yet |
| `tengu_bridge_subagent_frames` | Not on a page yet |
| `tengu_bridge_subagent_text` | Not on a page yet |
| `tengu_bridge_unarchive_on_resume` | Not on a page yet |
| `tengu_bright_lake` | Not on a page yet |
| `tengu_bright_wall` | Not on a page yet |
| `tengu_brindle_causeway` | Not on a page yet |
| `tengu_brisk_meadow` | Not on a page yet |
| `tengu_bubbly_harbor` | Not on a page yet |
| `tengu_bubbly_meteor` | Not on a page yet |
| `tengu_buzzing_lightning` | Not on a page yet |
| `tengu_buzzing_pelican` | Not on a page yet |
| `tengu_buzzing_pike` | Not on a page yet |
| `tengu_buzzing_river` | Not on a page yet |
| `tengu_byte_stream_idle_timeout_ms` | Not on a page yet |
| `tengu_c4e_slash_upsell` | Not on a page yet |
| `tengu_calm_crescent` | Not on a page yet |
| `tengu_calm_eagle` | Not on a page yet |
| `tengu_calm_mochi` | Not on a page yet |
| `tengu_calm_nautilus` | Not on a page yet |
| `tengu_calm_noodle` | Not on a page yet |
| `tengu_calm_osprey` | Not on a page yet |
| `tengu_calm_riddle` | Not on a page yet |
| `tengu_calm_seal` | Not on a page yet |
| `tengu_calm_waffle` | Not on a page yet |
| `tengu_canary` | Not on a page yet |
| `tengu_candid_juniper` | Not on a page yet |
| `tengu_ccr_bridge` | Not on a page yet |
| `tengu_ccr_bundle_max_bytes` | Not on a page yet |
| `tengu_ccr_bundle_seed_enabled` | Not on a page yet |
| `tengu_ccr_classifier_keepalive_enabled` | Not on a page yet |
| `tengu_ccr_disk_watchdog` | Not on a page yet |
| `tengu_ccr_drop_unwatched_stream_events` | Not on a page yet |
| `tengu_ccr_event_hold_enabled` | Not on a page yet |
| `tengu_ccr_exclude_dynamic_restore_killswitch` | Not on a page yet |
| `tengu_ccr_external_event_record` | Not on a page yet |
| `tengu_ccr_handoff_metadata` | Not on a page yet |
| `tengu_ccr_hook_keepalive_enabled` | Not on a page yet |
| `tengu_ccr_idle_heartbeat` | Not on a page yet |
| `tengu_ccr_inherited_approval_killswitch` | Not on a page yet |
| `tengu_ccr_keepalive_after_stop_enabled` | Not on a page yet |
| `tengu_ccr_memory_watchdog` | Not on a page yet |
| `tengu_ccr_no_subscriber_flush_ms` | Not on a page yet |
| `tengu_ccr_no_subscriber_hold_ms` | Not on a page yet |
| `tengu_ccr_orphan_restore_wake` | Not on a page yet |
| `tengu_ccr_orphan_restore_wake_shells` | Not on a page yet |
| `tengu_ccr_plugin_refresh_in_idle_enabled` | Not on a page yet |
| `tengu_ccr_plugins_turn_start_check_enabled` | Not on a page yet |
| `tengu_ccr_reactivation_beat` | Not on a page yet |
| `tengu_ccr_reconnect_beat` | Not on a page yet |
| `tengu_ccr_sdk_mcp_remote_manifests` | Not on a page yet |
| `tengu_ccr_skip_redundant_heartbeat` | Not on a page yet |
| `tengu_ccr_sse_keepalive_max_interval_s` | Not on a page yet |
| `tengu_ccr_stored_gap_bridge_enabled` | Not on a page yet |
| `tengu_ccr_stream_event_flush_ms` | Not on a page yet |
| `tengu_ccr_stream_first_flush_ms` | Not on a page yet |
| `tengu_ccr_subagent_skip_on_delta` | Not on a page yet |
| `tengu_ccr_unread_state_exit_killswitch` | Not on a page yet |
| `tengu_ccr_upload_hold_marker` | Not on a page yet |
| `tengu_ccr_upload_trim` | Not on a page yet |
| `tengu_ccr_v2_bridge_create_cli` | Not on a page yet |
| `tengu_ccr_v2_send_events_cli` | Not on a page yet |
| `tengu_ccr_v2_session_crud_cli` | Not on a page yet |
| `tengu_cedar_ember` | Not on a page yet |
| `tengu_cedar_lantern` | Not on a page yet |
| `tengu_cedar_lattice` | Not on a page yet |
| `tengu_cedar_marsh` | Not on a page yet |
| `tengu_cedar_plume` | Not on a page yet |
| `tengu_cedar_transom` | Not on a page yet |
| `tengu_chair_sermon` | Not on a page yet |
| `tengu_cheeky_toucan` | Not on a page yet |
| `tengu_cheerful_horizon` | Not on a page yet |
| `tengu_chomp_inflection` | Not on a page yet |
| `tengu_chomp_sable` | Not on a page yet |
| `tengu_chomp_thaw` | Not on a page yet |
| `tengu_chrome_auto_enable` | Not on a page yet |
| `tengu_chrome_install_upsell` | Not on a page yet |
| `tengu_chrome_tab_group_close` | Not on a page yet |
| `tengu_cicada_nap_ms` | Not on a page yet |
| `tengu_cinder_plover` | Not on a page yet |
| `tengu_cinder_relay` | Not on a page yet |
| `tengu_cinder_swift` | Not on a page yet |
| `tengu_cinder_wren` | Not on a page yet |
| `tengu_classifier_disabled_surfaces` | Not on a page yet |
| `tengu_classifier_summary_kill` | Not on a page yet |
| `tengu_classifier_summary_llm_emit` | Not on a page yet |
| `tengu_claudeai_skills_sync_idle_intervals` | Not on a page yet |
| `tengu_claudeai_skills_sync_interval_minutes` | Not on a page yet |
| `tengu_claudeai_skills_sync_shared_round` | Not on a page yet |
| `tengu_clever_garden` | Not on a page yet |
| `tengu_clever_orbit` | Not on a page yet |
| `tengu_clever_yeti` | Not on a page yet |
| `tengu_cloud_session_shell` | Not on a page yet |
| `tengu_cobalt_harbor` | Not on a page yet |
| `tengu_cobalt_harbor_notice` | Not on a page yet |
| `tengu_cobalt_plinth` | Not on a page yet |
| `tengu_cobalt_plinth_alder` | Not on a page yet |
| `tengu_cobalt_plinth_aspen` | Not on a page yet |
| `tengu_cobalt_plinth_bracken` | Not on a page yet |
| `tengu_cobalt_plinth_burnet` | Not on a page yet |
| `tengu_cobalt_plinth_campion` | Not on a page yet |
| `tengu_cobalt_plinth_comfrey` | Not on a page yet |
| `tengu_cobalt_plinth_damson` | Not on a page yet |
| `tengu_cobalt_plinth_dataviz` | Not on a page yet |
| `tengu_cobalt_plinth_fennel` | Not on a page yet |
| `tengu_cobalt_plinth_fern` | Not on a page yet |
| `tengu_cobalt_plinth_hornbeam` | Not on a page yet |
| `tengu_cobalt_plinth_larch` | Not on a page yet |
| `tengu_cobalt_plinth_linden` | Not on a page yet |
| `tengu_cobalt_plinth_lovage` | Not on a page yet |
| `tengu_cobalt_plinth_madder` | Not on a page yet |
| `tengu_cobalt_plinth_mallow` | Not on a page yet |
| `tengu_cobalt_plinth_medlar` | Not on a page yet |
| `tengu_cobalt_plinth_moss` | Not on a page yet |
| `tengu_cobalt_plinth_orpine` | Not on a page yet |
| `tengu_cobalt_plinth_sainfoin` | Not on a page yet |
| `tengu_cobalt_plinth_samphire` | Not on a page yet |
| `tengu_cobalt_plinth_sedge` | Not on a page yet |
| `tengu_cobalt_plinth_sill` | Not on a page yet |
| `tengu_cobalt_plinth_sorb` | Not on a page yet |
| `tengu_cobalt_plinth_sorrel` | Not on a page yet |
| `tengu_cobalt_plinth_tansy` | Not on a page yet |
| `tengu_cobalt_plinth_thrift` | Not on a page yet |
| `tengu_cobalt_plinth_willow` | Not on a page yet |
| `tengu_cobalt_plinth_yew` | Not on a page yet |
| `tengu_cobalt_ridge` | Not on a page yet |
| `tengu_cobalt_thicket` | Not on a page yet |
| `tengu_cobalt_wren` | Not on a page yet |
| `tengu_compact_cache_prefix` | Not on a page yet |
| `tengu_compiled_acorn` | Not on a page yet |
| `tengu_composed_quail` | Not on a page yet |
| `tengu_composed_teacup` | Not on a page yet |
| `tengu_composed_treehouse` | Not on a page yet |
| `tengu_compressed_river` | Not on a page yet |
| `tengu_concurrent_candle` | Not on a page yet |
| `tengu_concurrent_moonbeam` | Not on a page yet |
| `tengu_concurrent_shore` | Not on a page yet |
| `tengu_context_usage_bulk_counts` | Not on a page yet |
| `tengu_coordinator_panel` | Not on a page yet |
| `tengu_copper_gazette` | Not on a page yet |
| `tengu_copper_hinge_wren` | Not on a page yet |
| `tengu_copper_kestrel` | Not on a page yet |
| `tengu_copper_kite` | Not on a page yet |
| `tengu_copper_lantern` | Not on a page yet |
| `tengu_copper_thistle` | Not on a page yet |
| `tengu_coral_anchor` | Not on a page yet |
| `tengu_cosmic_cookie` | Not on a page yet |
| `tengu_cosmic_crayon` | Not on a page yet |
| `tengu_cosmic_lake` | Not on a page yet |
| `tengu_cosmic_shore` | Not on a page yet |
| `tengu_cowork_auto_mode_include_allowed_write_mcp` | Not on a page yet |
| `tengu_cowork_chrome_automode_default` | [Auto Mode](../configure/permissions/auto-mode.md) |
| `tengu_cozy_dusk` | Not on a page yet |
| `tengu_cozy_eagle` | Not on a page yet |
| `tengu_cozy_fern` | Not on a page yet |
| `tengu_cozy_kite` | Not on a page yet |
| `tengu_cozy_teapot` | Not on a page yet |
| `tengu_crimson_vector` | Not on a page yet |
| `tengu_cuddly_willow` | Not on a page yet |
| `tengu_curious_lake` | Not on a page yet |
| `tengu_curious_river` | Not on a page yet |
| `tengu_curious_tower` | Not on a page yet |
| `tengu_curious_tower_stateless_models` | Not on a page yet |
| `tengu_curried_sparrow` | Not on a page yet |
| `tengu_curried_squirrel` | Not on a page yet |
| `tengu_curried_trinket` | Not on a page yet |
| `tengu_daemon_refuse_stale_upgrade` | Not on a page yet |
| `tengu_daemon_startup_crash` | Not on a page yet |
| `tengu_daemon_upgrade_defer_busy` | Not on a page yet |
| `tengu_dapper_acorn` | Not on a page yet |
| `tengu_dapper_brooks` | Not on a page yet |
| `tengu_dapper_cupcake` | Not on a page yet |
| `tengu_dapper_dawn` | Not on a page yet |
| `tengu_dapper_dusk` | Not on a page yet |
| `tengu_dapper_platypus` | Not on a page yet |
| `tengu_dapper_truffle` | Not on a page yet |
| `tengu_dash_flame` | Not on a page yet |
| `tengu_dazzling_garden` | Not on a page yet |
| `tengu_deep_feather` | Not on a page yet |
| `tengu_deep_shore` | Not on a page yet |
| `tengu_defer_cap_ms` | Not on a page yet |
| `tengu_deferred_stub_tool` | Not on a page yet |
| `tengu_delegated_quail` | Not on a page yet |
| `tengu_delightful_goblet` | Not on a page yet |
| `tengu_delightful_hamster` | Not on a page yet |
| `tengu_desktop_upsell` | Not on a page yet |
| `tengu_destructive_command_warning` | Not on a page yet |
| `tengu_disable_live_host_context` | Not on a page yet |
| `tengu_disable_streaming_to_non_streaming_fallback` | Not on a page yet |
| `tengu_doorbell_agave` | Not on a page yet |
| `tengu_dreamy_frost` | Not on a page yet |
| `tengu_dreamy_lobster` | Not on a page yet |
| `tengu_dreamy_sundae` | Not on a page yet |
| `tengu_drift_lantern` | Not on a page yet |
| `tengu_drifting_dream` | Not on a page yet |
| `tengu_drifting_heron` | Not on a page yet |
| `tengu_drifting_lemur` | Not on a page yet |
| `tengu_drifting_nova` | Not on a page yet |
| `tengu_drifting_reef` | Not on a page yet |
| `tengu_drifting_twilight` | Not on a page yet |
| `tengu_dunwich_bell` | Not on a page yet |
| `tengu_eager_balloon` | Not on a page yet |
| `tengu_eager_pillow` | Not on a page yet |
| `tengu_eager_raccoon` | Not on a page yet |
| `tengu_eager_rain` | Not on a page yet |
| `tengu_ebbing_tide` | Not on a page yet |
| `tengu_edit_minimalanchor_jrn` | Not on a page yet |
| `tengu_elegant_meadow` | Not on a page yet |
| `tengu_elegant_ocean` | Not on a page yet |
| `tengu_elegant_pancake` | Not on a page yet |
| `tengu_elegant_possum` | Not on a page yet |
| `tengu_ember_latch` | Not on a page yet |
| `tengu_encapsulated_dusk` | Not on a page yet |
| `tengu_encapsulated_pebble` | Not on a page yet |
| `tengu_enchanted_pebble` | Not on a page yet |
| `tengu_ethereal_mist` | Not on a page yet |
| `tengu_event_loop_stall` | Not on a page yet |
| `tengu_event_sampling_config` | Not on a page yet |
| `tengu_eventual_haven` | Not on a page yet |
| `tengu_eventual_noodle` | Not on a page yet |
| `tengu_expressive_church` | Not on a page yet |
| `tengu_expressive_whistle` | Not on a page yet |
| `tengu_expressive_whistle_config` | Not on a page yet |
| `tengu_fallow_lantern` | Not on a page yet |
| `tengu_fallow_plover` | Not on a page yet |
| `tengu_fancy_crab` | Not on a page yet |
| `tengu_fancy_milner` | Not on a page yet |
| `tengu_fancy_wand` | Not on a page yet |
| `tengu_fancy_wand_copy` | Not on a page yet |
| `tengu_federated_flask` | Not on a page yet |
| `tengu_federated_robin` | Not on a page yet |
| `tengu_federated_ullman` | Not on a page yet |
| `tengu_feedback_survey_config` | Not on a page yet |
| `tengu_fennel_godwit` | Not on a page yet |
| `tengu_fern_plover` | Not on a page yet |
| `tengu_fgts` | Not on a page yet |
| `tengu_fine_survey_transcript_ask_config` | Not on a page yet |
| `tengu_fizzy_bonbon` | Not on a page yet |
| `tengu_fizzy_grove` | Not on a page yet |
| `tengu_fizzy_petal` | Not on a page yet |
| `tengu_fizzy_treasure` | Not on a page yet |
| `tengu_fizzy_widget` | Not on a page yet |
| `tengu_fleet_past_sessions` | Not on a page yet |
| `tengu_fleetview_peers` | Not on a page yet |
| `tengu_fleetview_pr_batch` | Not on a page yet |
| `tengu_fleetview_simple` | Not on a page yet |
| `tengu_flickering_lagoon` | Not on a page yet |
| `tengu_flickering_rain` | Not on a page yet |
| `tengu_flint_harbor_prompt` | Not on a page yet |
| `tengu_flint_harbor_share` | Not on a page yet |
| `tengu_foamy_sedgewick` | Not on a page yet |
| `tengu_foamy_spring` | Not on a page yet |
| `tengu_fresh_heron` | Not on a page yet |
| `tengu_frond_boric` | Not on a page yet |
| `tengu_functional_llama` | Not on a page yet |
| `tengu_gable_onyx_sluice` | Not on a page yet |
| `tengu_gb_eval_authed_enable` | Not on a page yet |
| `tengu_gb_refresh_interval_minutes` | Not on a page yet |
| `tengu_gentle_brooks` | Not on a page yet |
| `tengu_gentle_frost` | Not on a page yet |
| `tengu_gentle_grove` | Not on a page yet |
| `tengu_gentle_hammock` | Not on a page yet |
| `tengu_gentle_hummingbird` | Not on a page yet |
| `tengu_giggly_dragonfly` | Not on a page yet |
| `tengu_gleaming_creek` | Not on a page yet |
| `tengu_gleaming_cupcake` | Not on a page yet |
| `tengu_gleaming_fair` | Not on a page yet |
| `tengu_gleaming_fair_reuse` | Not on a page yet |
| `tengu_glimmering_glade` | Not on a page yet |
| `tengu_glimmering_newt` | Not on a page yet |
| `tengu_glittery_fern` | Not on a page yet |
| `tengu_glittery_mitten` | Not on a page yet |
| `tengu_glowing_lark` | Not on a page yet |
| `tengu_glowing_orbit` | Not on a page yet |
| `tengu_glowing_pancake` | Not on a page yet |
| `tengu_golden_dove` | Not on a page yet |
| `tengu_golden_panda` | Not on a page yet |
| `tengu_golden_popcorn` | Not on a page yet |
| `tengu_good_survey_transcript_ask_config` | Not on a page yet |
| `tengu_goofy_hare` | Not on a page yet |
| `tengu_goofy_jellyfish` | Not on a page yet |
| `tengu_gorse_fathom` | Not on a page yet |
| `tengu_gorse_pylon` | Not on a page yet |
| `tengu_gorse_sill` | Not on a page yet |
| `tengu_gravel_chorus` | Not on a page yet |
| `tengu_greedy_crane` | Not on a page yet |
| `tengu_groovy_eclipse` | Not on a page yet |
| `tengu_gypsum_kite` | Not on a page yet |
| `tengu_happy_ocean` | Not on a page yet |
| `tengu_harbor` | Not on a page yet |
| `tengu_harbor_kite` | Not on a page yet |
| `tengu_harbor_kite_cloud` | Not on a page yet |
| `tengu_harbor_kite_limits` | Not on a page yet |
| `tengu_harbor_kite_mode_emit` | Not on a page yet |
| `tengu_harbor_kite_pacing_off` | Not on a page yet |
| `tengu_harbor_kite_win` | Not on a page yet |
| `tengu_harbor_ledger` | Not on a page yet |
| `tengu_harbor_moth` | Not on a page yet |
| `tengu_harbor_permissions` | Not on a page yet |
| `tengu_harbor_willow` | Not on a page yet |
| `tengu_harmonic_riddle` | Not on a page yet |
| `tengu_harp_forepillar` | Not on a page yet |
| `tengu_harp_pedal` | Not on a page yet |
| `tengu_harp_voatavo` | Not on a page yet |
| `tengu_hashed_lark` | Not on a page yet |
| `tengu_hawthorn_steeple` | Not on a page yet |
| `tengu_haze_glass` | [Files, Search, and Memory](tools/files.md) |
| `tengu_hazel_lantern` | Not on a page yet |
| `tengu_hazel_osprey` | Not on a page yet |
| `tengu_hazel_osprey_floor` | Not on a page yet |
| `tengu_hazel_trellis` | Not on a page yet |
| `tengu_hazy_cosmos` | Not on a page yet |
| `tengu_hazy_nova` | Not on a page yet |
| `tengu_hazy_peach` | Not on a page yet |
| `tengu_hearth_member_relay_rows_enabled` | Not on a page yet |
| `tengu_hearth_resolved_rows` | Not on a page yet |
| `tengu_heron_brook` | Not on a page yet |
| `tengu_hidden_frog` | Not on a page yet |
| `tengu_hidden_volcano` | Not on a page yet |
| `tengu_hipaa_history_retention_prune` | Not on a page yet |
| `tengu_hover_rest` | Not on a page yet |
| `tengu_humble_emerson` | Not on a page yet |
| `tengu_humble_flurry` | Not on a page yet |
| `tengu_humble_hammock` | Not on a page yet |
| `tengu_humble_petal` | Not on a page yet |
| `tengu_humble_wand` | Not on a page yet |
| `tengu_humble_zephyr` | Not on a page yet |
| `tengu_humming_locket` | Not on a page yet |
| `tengu_humming_star` | Not on a page yet |
| `tengu_humming_sundae` | Not on a page yet |
| `tengu_hushed_caraway` | Not on a page yet |
| `tengu_hushed_kestrel` | Not on a page yet |
| `tengu_hushed_lantern` | Not on a page yet |
| `tengu_hushed_lark` | Not on a page yet |
| `tengu_hushed_lark_text` | Not on a page yet |
| `tengu_hushed_plover` | Not on a page yet |
| `tengu_ide_rc_auto_enable` | Not on a page yet |
| `tengu_idempotent_wolf` | Not on a page yet |
| `tengu_idle_amber_finch` | Not on a page yet |
| `tengu_immutable_ladybug` | Not on a page yet |
| `tengu_immutable_tide` | Not on a page yet |
| `tengu_import` | Not on a page yet |
| `tengu_indexed_corbato` | Not on a page yet |
| `tengu_indexed_pearl` | Not on a page yet |
| `tengu_iridescent_boot` | Not on a page yet |
| `tengu_iridescent_crystal` | Not on a page yet |
| `tengu_iridescent_gem` | Not on a page yet |
| `tengu_iterative_cosmos` | Not on a page yet |
| `tengu_iterative_falcon` | Not on a page yet |
| `tengu_iterative_haven` | Not on a page yet |
| `tengu_iterative_lightning` | Not on a page yet |
| `tengu_jade_anvil_4` | Not on a page yet |
| `tengu_jade_compass` | Not on a page yet |
| `tengu_jaunty_alpaca` | Not on a page yet |
| `tengu_jaunty_charm` | Not on a page yet |
| `tengu_jaunty_ember` | Not on a page yet |
| `tengu_jaunty_forest` | Not on a page yet |
| `tengu_jaunty_honey` | Not on a page yet |
| `tengu_jaunty_plum` | Not on a page yet |
| `tengu_jaunty_umbrella` | Not on a page yet |
| `tengu_jazzy_goblet` | Not on a page yet |
| `tengu_jazzy_puddle` | Not on a page yet |
| `tengu_jazzy_ripple` | Not on a page yet |
| `tengu_jiggly_blossom` | Not on a page yet |
| `tengu_jiggly_harp` | Not on a page yet |
| `tengu_jiggly_mochi` | Not on a page yet |
| `tengu_jolly_aurora` | Not on a page yet |
| `tengu_jolly_sparrow_enabled` | Not on a page yet |
| `tengu_joyful_anchor` | Not on a page yet |
| `tengu_joyful_globe` | Not on a page yet |
| `tengu_joyful_parasol` | Not on a page yet |
| `tengu_juniper_bassoon` | Not on a page yet |
| `tengu_juniper_relay` | Not on a page yet |
| `tengu_juniper_relay_config` | Not on a page yet |
| `tengu_juniper_sundial` | Not on a page yet |
| `tengu_juniper_vale` | Not on a page yet |
| `tengu_kairos_brief` | Not on a page yet |
| `tengu_kairos_brief_config` | Not on a page yet |
| `tengu_kairos_brief_stop_hook_text` | Not on a page yet |
| `tengu_kairos_cron` | Not on a page yet |
| `tengu_kairos_cron_config` | Not on a page yet |
| `tengu_kairos_cron_durable` | Not on a page yet |
| `tengu_kairos_input_needed_push` | Not on a page yet |
| `tengu_kairos_loop_keepalive` | Not on a page yet |
| `tengu_kairos_loop_persistent` | Not on a page yet |
| `tengu_kairos_push_notifications` | [Probes](probes.md) |
| `tengu_kairos_ready_nudge` | Not on a page yet |
| `tengu_keen_anchor` | Not on a page yet |
| `tengu_keen_dolphin` | Not on a page yet |
| `tengu_keen_lantern` | Not on a page yet |
| `tengu_keen_pudding` | Not on a page yet |
| `tengu_keen_sloth` | Not on a page yet |
| `tengu_kestrel_arch` | Not on a page yet |
| `tengu_kestrel_lantern` | Not on a page yet |
| `tengu_kestrel_moor` | Not on a page yet |
| `tengu_keybinding_customization_release` | Not on a page yet |
| `tengu_kind_dewdrop` | Not on a page yet |
| `tengu_lantern_hinge` | Not on a page yet |
| `tengu_lantern_prism` | Not on a page yet |
| `tengu_lantern_sconce` | Not on a page yet |
| `tengu_lantern_sconce_copy` | Not on a page yet |
| `tengu_lantern_snuffer` | Not on a page yet |
| `tengu_lantern_spool` | Not on a page yet |
| `tengu_lantern_wick_braid` | Not on a page yet |
| `tengu_lantern_wick_braid_release` | Not on a page yet |
| `tengu_lantern_wick_braid_text` | Not on a page yet |
| `tengu_lantern_wick_mode` | Not on a page yet |
| `tengu_lantern_wick_release_by_model` | Not on a page yet |
| `tengu_lantern_wick_resume_by_model` | Not on a page yet |
| `tengu_lantern_wick_text_by_model` | Not on a page yet |
| `tengu_lapis_anchor` | Not on a page yet |
| `tengu_lapis_anchor_budget` | Not on a page yet |
| `tengu_lapis_anchor_user_turn` | Not on a page yet |
| `tengu_lazy_dove` | Not on a page yet |
| `tengu_left_arrow_carries_queued` | Not on a page yet |
| `tengu_left_arrow_editing_guard` | Not on a page yet |
| `tengu_level_plover` | Not on a page yet |
| `tengu_level_wren` | Not on a page yet |
| `tengu_lexical_crystal` | Not on a page yet |
| `tengu_lexical_glade` | Not on a page yet |
| `tengu_lilac_loom` | Not on a page yet |
| `tengu_linear_brook` | Not on a page yet |
| `tengu_linear_fog` | Not on a page yet |
| `tengu_linear_owl` | Not on a page yet |
| `tengu_linen_orbit` | [Files, Search, and Memory](tools/files.md) |
| `tengu_linked_cake` | Not on a page yet |
| `tengu_linked_clover` | Not on a page yet |
| `tengu_lively_beaver` | Not on a page yet |
| `tengu_lively_waffle` | Not on a page yet |
| `tengu_log_datadog_events` | Not on a page yet |
| `tengu_loggia_denkbild` | Not on a page yet |
| `tengu_loggia_passage` | Not on a page yet |
| `tengu_loggia_roster` | Not on a page yet |
| `tengu_long_context_survey_probability` | Not on a page yet |
| `tengu_long_context_survey_question_variant` | Not on a page yet |
| `tengu_long_context_survey_threshold` | Not on a page yet |
| `tengu_long_context_survey_trigger_mode` | Not on a page yet |
| `tengu_lovely_umbrella` | Not on a page yet |
| `tengu_lucid_anchor` | Not on a page yet |
| `tengu_lucky_brooks` | Not on a page yet |
| `tengu_lucky_quill` | Not on a page yet |
| `tengu_lucky_whisper` | Not on a page yet |
| `tengu_luminous_locket` | Not on a page yet |
| `tengu_luminous_seal` | Not on a page yet |
| `tengu_madrone_spindle` | Not on a page yet |
| `tengu_madrone_spindle_corbel` | Not on a page yet |
| `tengu_madrone_spindle_newel` | Not on a page yet |
| `tengu_madrone_spindle_purlin` | Not on a page yet |
| `tengu_magical_pixel` | Not on a page yet |
| `tengu_malort_pedway` | Not on a page yet |
| `tengu_managed_config_prefetch_off` | Not on a page yet |
| `tengu_maple_pier` | Not on a page yet |
| `tengu_maple_rung` | Not on a page yet |
| `tengu_maple_sundial` | Not on a page yet |
| `tengu_marble_heron` | Not on a page yet |
| `tengu_marbled_teal` | Not on a page yet |
| `tengu_marlin_porch` | Not on a page yet |
| `tengu_max_version_config` | Not on a page yet |
| `tengu_mcp_auto_background` | Not on a page yet |
| `tengu_mcp_claudeai_eligibility_gate` | Not on a page yet |
| `tengu_mcp_connect_suspend_redial` | Not on a page yet |
| `tengu_mcp_connect_timeout_retry` | Not on a page yet |
| `tengu_mcp_directory_bff` | Not on a page yet |
| `tengu_mcp_directory_visibility` | Not on a page yet |
| `tengu_mcp_discover_projection_prior` | Not on a page yet |
| `tengu_mcp_discovery_cache_enable` | Not on a page yet |
| `tengu_mcp_drop_invalid_tool_schemas` | Not on a page yet |
| `tengu_mcp_issuer_strict_echo` | Not on a page yet |
| `tengu_mcp_legacy_sse_fallback` | Not on a page yet |
| `tengu_mcp_legacy_url_elicitation` | Not on a page yet |
| `tengu_mcp_legacy_url_elicitation_server_denylist` | Not on a page yet |
| `tengu_mcp_listen_reopen_park` | Not on a page yet |
| `tengu_mcp_listen_reopen_park_tuning` | Not on a page yet |
| `tengu_mcp_listen_server_denylist` | Not on a page yet |
| `tengu_mcp_local_oauth_blocked_hosts` | Not on a page yet |
| `tengu_mcp_memory_cgroup` | Not on a page yet |
| `tengu_mcp_negotiation_server_denylist` | Not on a page yet |
| `tengu_mcp_normalize_root_combinators` | Not on a page yet |
| `tengu_mcp_protocol_negotiation_ccr` | Not on a page yet |
| `tengu_mcp_protocol_negotiation_claudeai` | Not on a page yet |
| `tengu_mcp_protocol_negotiation_http` | Not on a page yet |
| `tengu_mcp_protocol_negotiation_stdio` | Not on a page yet |
| `tengu_mcp_proxy_needs_approval_retry` | Not on a page yet |
| `tengu_mcp_server_policy_bypass_exempt` | Not on a page yet |
| `tengu_mcp_singleton_unwrap` | Not on a page yet |
| `tengu_mcp_startup_policy_seed` | Not on a page yet |
| `tengu_mcp_stateless_skip_init` | Not on a page yet |
| `tengu_mcp_step_up_auth_dialog` | Not on a page yet |
| `tengu_mcp_strip_trailing_xml_tags` | Not on a page yet |
| `tengu_mcp_subagent_prompt` | Not on a page yet |
| `tengu_mcp_task_worker_wake` | Not on a page yet |
| `tengu_mcp_url_elicitation` | Not on a page yet |
| `tengu_media_byte_cap` | Not on a page yet |
| `tengu_mellow_beacon` | Not on a page yet |
| `tengu_mellow_heron` | Not on a page yet |
| `tengu_melodic_ember` | Not on a page yet |
| `tengu_melodic_octopus` | Not on a page yet |
| `tengu_melodic_wolf` | Not on a page yet |
| `tengu_mem_push_delete_mode` | Not on a page yet |
| `tengu_memdir_write_lint` | Not on a page yet |
| `tengu_memoized_owl` | Not on a page yet |
| `tengu_memoized_turtle` | Not on a page yet |
| `tengu_memory_bulk_inflate` | Not on a page yet |
| `tengu_memory_store_resync_interval_minutes` | Not on a page yet |
| `tengu_memory_stream_list` | Not on a page yet |
| `tengu_mermaid_mod` | Not on a page yet |
| `tengu_merry_boot` | Not on a page yet |
| `tengu_merry_popcorn` | Not on a page yet |
| `tengu_merry_tide` | Not on a page yet |
| `tengu_mighty_flask` | Not on a page yet |
| `tengu_mill_orange` | Not on a page yet |
| `tengu_mint_lanes` | Not on a page yet |
| `tengu_misty_anchor` | Not on a page yet |
| `tengu_misty_aurora` | Not on a page yet |
| `tengu_misty_sunbeam` | Not on a page yet |
| `tengu_misty_twilight` | Not on a page yet |
| `tengu_modular_mochi` | Not on a page yet |
| `tengu_modular_seal` | Not on a page yet |
| `tengu_moonlit_island` | Not on a page yet |
| `tengu_moonlit_kettle` | Not on a page yet |
| `tengu_moonlit_lagoon` | Not on a page yet |
| `tengu_moonlit_panda` | Not on a page yet |
| `tengu_moonlit_toucan` | Not on a page yet |
| `tengu_moss_anchor` | Not on a page yet |
| `tengu_mossy_anchor` | Not on a page yet |
| `tengu_mossy_crayon` | Not on a page yet |
| `tengu_mossy_crown` | Not on a page yet |
| `tengu_mossy_gray` | Not on a page yet |
| `tengu_mossy_kestrel` | Not on a page yet |
| `tengu_mossy_squid` | Not on a page yet |
| `tengu_mossy_thrush` | Not on a page yet |
| `tengu_mossy_wirth` | Not on a page yet |
| `tengu_moth_copse` | Not on a page yet |
| `tengu_mutable_phoenix_killswitch` | Not on a page yet |
| `tengu_nankeen_kestrel` | Not on a page yet |
| `tengu_native_cursor` | Not on a page yet |
| `tengu_neapolitan` | Not on a page yet |
| `tengu_nifty_finch` | Not on a page yet |
| `tengu_nifty_lemur` | Not on a page yet |
| `tengu_nifty_pine` | Not on a page yet |
| `tengu_nimble_wren` | Not on a page yet |
| `tengu_noble_mountain` | Not on a page yet |
| `tengu_noble_snowflake` | Not on a page yet |
| `tengu_noble_wozniak` | Not on a page yet |
| `tengu_non_deferrable_builtins` | Not on a page yet |
| `tengu_observer_agents_enabled` | Not on a page yet |
| `tengu_observer_subagent_fanout` | Not on a page yet |
| `tengu_ochre_bittern` | Not on a page yet |
| `tengu_ochre_dunlin` | Not on a page yet |
| `tengu_ochre_finch` | Not on a page yet |
| `tengu_ochre_gantry` | Not on a page yet |
| `tengu_ochre_plover` | Not on a page yet |
| `tengu_official_plugin_prompt_overrides` | Not on a page yet |
| `tengu_omelette_fouet` | Not on a page yet |
| `tengu_omelette_grant_watch` | Not on a page yet |
| `tengu_on_branch_default_guard_observe` | Not on a page yet |
| `tengu_onyx_plover` | Not on a page yet |
| `tengu_onyx_sluice` | Not on a page yet |
| `tengu_opal_circuit` | Not on a page yet |
| `tengu_orderly_lantern` | Not on a page yet |
| `tengu_orford_ness` | Not on a page yet |
| `tengu_org_config_required` | Not on a page yet |
| `tengu_osier_pylon_trace` | Not on a page yet |
| `tengu_pale_kestrel` | Not on a page yet |
| `tengu_paper_halyard` | Not on a page yet |
| `tengu_parallel_trinket` | Not on a page yet |
| `tengu_parsed_eagle` | Not on a page yet |
| `tengu_parsed_willow` | Not on a page yet |
| `tengu_passport_quail` | Not on a page yet |
| `tengu_patient_finch` | Not on a page yet |
| `tengu_patient_meteor` | Not on a page yet |
| `tengu_patient_tide` | Not on a page yet |
| `tengu_peaceful_leaf` | Not on a page yet |
| `tengu_pencil_farmer` | Not on a page yet |
| `tengu_penguins_off` | Not on a page yet |
| `tengu_peppy_nautilus` | Not on a page yet |
| `tengu_pewter_avocet` | Not on a page yet |
| `tengu_pewter_brook` | Not on a page yet |
| `tengu_pewter_canteen` | Not on a page yet |
| `tengu_pewter_owl_model` | Not on a page yet |
| `tengu_pewter_summit` | Not on a page yet |
| `tengu_plaid_harbor` | Not on a page yet |
| `tengu_plain_heron` | Not on a page yet |
| `tengu_plain_kestrel` | Not on a page yet |
| `tengu_plain_sorrel` | Not on a page yet |
| `tengu_playful_hare` | Not on a page yet |
| `tengu_playful_lobster` | Not on a page yet |
| `tengu_playful_panda` | Not on a page yet |
| `tengu_plugin_binary_assets` | Not on a page yet |
| `tengu_plugin_command_source_refresh` | Not on a page yet |
| `tengu_plugin_feedback_survey_config` | Not on a page yet |
| `tengu_plugin_input_refusal` | Not on a page yet |
| `tengu_plugin_menu_close_reload` | Not on a page yet |
| `tengu_plugin_official_mkt_git_fallback` | Not on a page yet |
| `tengu_plugin_ratings_store_config` | Not on a page yet |
| `tengu_plugins_npm_marketplace` | Not on a page yet |
| `tengu_plum_vx3` | Not on a page yet |
| `tengu_plumb_kestrel` | Not on a page yet |
| `tengu_polished_dewdrop` | Not on a page yet |
| `tengu_polished_lagoon` | Not on a page yet |
| `tengu_polished_quill_killswitch` | Not on a page yet |
| `tengu_polished_salamander` | Not on a page yet |
| `tengu_polished_tulip` | Not on a page yet |
| `tengu_post_compact_survey` | Not on a page yet |
| `tengu_pr_footer_surface_suffix` | Not on a page yet |
| `tengu_prancy_lantern` | Not on a page yet |
| `tengu_precious_koala` | Not on a page yet |
| `tengu_print_ceiling_stop_agents` | Not on a page yet |
| `tengu_proactivity_selector` | Not on a page yet |
| `tengu_projects_compact_thread_rule_enabled` | Not on a page yet |
| `tengu_projects_other_thread_rows_killswitch` | Not on a page yet |
| `tengu_projects_thread_ask_held_killswitch` | Not on a page yet |
| `tengu_projects_thread_recap` | Not on a page yet |
| `tengu_projects_thread_recap_prompt` | Not on a page yet |
| `tengu_projects_thread_reply_lead_killswitch` | Not on a page yet |
| `tengu_projects_thread_state_stamp` | Not on a page yet |
| `tengu_prompt_cache_1h_config` | Not on a page yet |
| `tengu_propose_goal` | Not on a page yet |
| `tengu_proud_clover` | Not on a page yet |
| `tengu_proud_pearl` | Not on a page yet |
| `tengu_ptc_enabled` | Not on a page yet |
| `tengu_purring_pine` | Not on a page yet |
| `tengu_quartz_pipit` | Not on a page yet |
| `tengu_quartz_thimble` | Not on a page yet |
| `tengu_quick_heron` | Not on a page yet |
| `tengu_quiet_elephant` | Not on a page yet |
| `tengu_quiet_ember` | Not on a page yet |
| `tengu_quiet_harbor` | Not on a page yet |
| `tengu_quiet_heron` | Not on a page yet |
| `tengu_quiet_hopcroft` | Not on a page yet |
| `tengu_quiet_lantern` | Not on a page yet |
| `tengu_quiet_larkspur` | Not on a page yet |
| `tengu_quiet_locket` | Not on a page yet |
| `tengu_quiet_marten` | Not on a page yet |
| `tengu_quiet_slate_wren` | Not on a page yet |
| `tengu_quill_marten` | Not on a page yet |
| `tengu_quilted_lantern` | Not on a page yet |
| `tengu_quirky_shore` | Not on a page yet |
| `tengu_quirky_sketch` | Not on a page yet |
| `tengu_quirky_teacup` | Not on a page yet |
| `tengu_quizzical_giraffe` | Not on a page yet |
| `tengu_quizzical_thimble` | Not on a page yet |
| `tengu_quizzical_toucan` | Not on a page yet |
| `tengu_quizzical_wirth` | Not on a page yet |
| `tengu_radiant_fox` | Not on a page yet |
| `tengu_radiant_hare` | Not on a page yet |
| `tengu_radiant_heron` | Not on a page yet |
| `tengu_radiant_teapot` | Not on a page yet |
| `tengu_rate_limit_promo_notices` | Not on a page yet |
| `tengu_rc_long_turn_nudge` | Not on a page yet |
| `tengu_rc_permission_nudge` | Not on a page yet |
| `tengu_rc_thread_reply_gate` | Not on a page yet |
| `tengu_reactive_compact_remote` | Not on a page yet |
| `tengu_reactive_quilt` | Not on a page yet |
| `tengu_reactive_zephyr` | Not on a page yet |
| `tengu_read_dedup_killswitch` | Not on a page yet |
| `tengu_record_created_pr_to_ccr` | Not on a page yet |
| `tengu_recursive_lobster` | Not on a page yet |
| `tengu_recursive_puddle` | Not on a page yet |
| `tengu_refactored_gadget` | Not on a page yet |
| `tengu_reflective_bee` | Not on a page yet |
| `tengu_reflective_wolf` | Not on a page yet |
| `tengu_remote_auto_mode_include_destructive_mcp` | Not on a page yet |
| `tengu_remote_backend` | Not on a page yet |
| `tengu_rename_full_session_fork` | Not on a page yet |
| `tengu_resilient_adleman` | Not on a page yet |
| `tengu_resume_open_live_bg` | Not on a page yet |
| `tengu_review_bughunter_config` | Not on a page yet |
| `tengu_rippling_tulip` | Not on a page yet |
| `tengu_rosy_donut` | Not on a page yet |
| `tengu_rosy_elephant` | Not on a page yet |
| `tengu_rosy_finch` | Not on a page yet |
| `tengu_rosy_flute` | Not on a page yet |
| `tengu_russet_whimbrel` | Not on a page yet |
| `tengu_rustling_crescent` | Not on a page yet |
| `tengu_rustling_lighthouse` | Not on a page yet |
| `tengu_rustling_orbit` | Not on a page yet |
| `tengu_rustling_pixel` | Not on a page yet |
| `tengu_rustling_sunset` | Not on a page yet |
| `tengu_sable_orrery` | Not on a page yet |
| `tengu_saddle_lantern` | Not on a page yet |
| `tengu_saffron_credits_only_tiers` | Not on a page yet |
| `tengu_saffron_ferry` | Not on a page yet |
| `tengu_saffron_kite` | Not on a page yet |
| `tengu_saffron_ladder` | Not on a page yet |
| `tengu_saffron_lattice` | Not on a page yet |
| `tengu_saffron_picker_dim` | Not on a page yet |
| `tengu_saffron_wren` | Not on a page yet |
| `tengu_sage_compass2` | Not on a page yet |
| `tengu_salt_marsh` | Not on a page yet |
| `tengu_satchel_banjo` | Not on a page yet |
| `tengu_scratch` | [Status Line](../configure/status-line.md) |
| `tengu_sdk_mcp_manifests` | Not on a page yet |
| `tengu_sedge_lantern_config` | Not on a page yet |
| `tengu_send_file` | Not on a page yet |
| `tengu_send_user_file` | Not on a page yet |
| `tengu_sepia_cormorant` | Not on a page yet |
| `tengu_sepia_moth` | Not on a page yet |
| `tengu_sequential_cloud` | Not on a page yet |
| `tengu_sequential_puffin` | Not on a page yet |
| `tengu_sequential_summit` | Not on a page yet |
| `tengu_serene_frog` | Not on a page yet |
| `tengu_serene_possum` | Not on a page yet |
| `tengu_serene_teacup` | Not on a page yet |
| `tengu_serene_teapot` | Not on a page yet |
| `tengu_serialized_petal` | Not on a page yet |
| `tengu_session_name_uniqueness` | Not on a page yet |
| `tengu_session_stable_address` | Not on a page yet |
| `tengu_sessions_elevated_auth_disable_proactive_enrollment` | Not on a page yet |
| `tengu_sessions_elevated_auth_enforcement` | Not on a page yet |
| `tengu_sharded_beacon` | Not on a page yet |
| `tengu_sharded_moonbeam` | Not on a page yet |
| `tengu_sharded_snowflake` | Not on a page yet |
| `tengu_shimmering_cherny` | Not on a page yet |
| `tengu_shimmering_firefly` | Not on a page yet |
| `tengu_shimmying_mochi` | Not on a page yet |
| `tengu_shimmying_stardust` | Not on a page yet |
| `tengu_shining_fractals` | Not on a page yet |
| `tengu_shiny_stardust` | Not on a page yet |
| `tengu_silent_harbor` | Not on a page yet |
| `tengu_silent_heron` | Not on a page yet |
| `tengu_silk_hinge` | Not on a page yet |
| `tengu_silly_waterfall` | Not on a page yet |
| `tengu_skills_dashboard_enabled` | [Endpoints and Headers](api/endpoints.md) |
| `tengu_slate_bittern` | Not on a page yet |
| `tengu_slate_finch` | Not on a page yet |
| `tengu_slate_harbor_experiment` | Not on a page yet |
| `tengu_slate_lantern` | Not on a page yet |
| `tengu_slate_lantern_ember` | Not on a page yet |
| `tengu_slate_lantern_hush` | Not on a page yet |
| `tengu_slate_marten` | Not on a page yet |
| `tengu_slate_thimble` | Not on a page yet |
| `tengu_slate_wicket` | Not on a page yet |
| `tengu_sleepy_rabbit` | Not on a page yet |
| `tengu_sleepy_ripple` | Not on a page yet |
| `tengu_sleepy_shore` | Not on a page yet |
| `tengu_sleepy_snowflake` | Not on a page yet |
| `tengu_smooth_chipmunk` | Not on a page yet |
| `tengu_smooth_forest` | Not on a page yet |
| `tengu_smooth_harbor` | Not on a page yet |
| `tengu_snappy_pelican` | Not on a page yet |
| `tengu_snappy_plum` | Not on a page yet |
| `tengu_snoopy_creek` | Not on a page yet |
| `tengu_snug_platypus` | Not on a page yet |
| `tengu_snug_quill` | Not on a page yet |
| `tengu_snug_reef` | Not on a page yet |
| `tengu_snug_storm` | Not on a page yet |
| `tengu_snug_wall` | Not on a page yet |
| `tengu_soft_slate_nudge` | Not on a page yet |
| `tengu_soft_spindle` | Not on a page yet |
| `tengu_sorrel_avocet` | Not on a page yet |
| `tengu_sorrel_trellis` | Not on a page yet |
| `tengu_sorrel_trellis_finial` | Not on a page yet |
| `tengu_sorrel_trellis_gusset` | Not on a page yet |
| `tengu_sorrel_trellis_mullion` | Not on a page yet |
| `tengu_sorrel_trellis_newel` | Not on a page yet |
| `tengu_sorrel_trellis_tenon` | Not on a page yet |
| `tengu_sorrel_trellis_weir` | Not on a page yet |
| `tengu_sorted_otter` | Not on a page yet |
| `tengu_sorted_truffle` | Not on a page yet |
| `tengu_sorted_zebra` | Not on a page yet |
| `tengu_spicy_blossom` | Not on a page yet |
| `tengu_spicy_pearl` | Not on a page yet |
| `tengu_splendid_horizon` | Not on a page yet |
| `tengu_splendid_lynx` | Not on a page yet |
| `tengu_splendid_sutton` | Not on a page yet |
| `tengu_squishy_spring` | Not on a page yet |
| `tengu_staged_ladybug` | Not on a page yet |
| `tengu_starry_locket` | Not on a page yet |
| `tengu_starry_squid` | Not on a page yet |
| `tengu_starry_waterfall` | Not on a page yet |
| `tengu_startup_announcements` | Not on a page yet |
| `tengu_startup_notice` | Not on a page yet |
| `tengu_stateful_mitten` | Not on a page yet |
| `tengu_static_title_under_mux` | Not on a page yet |
| `tengu_steadfast_wren` | Not on a page yet |
| `tengu_steady_finch` | Not on a page yet |
| `tengu_steady_marshmallow` | Not on a page yet |
| `tengu_steady_metcalfe` | Not on a page yet |
| `tengu_steady_mitten` | Not on a page yet |
| `tengu_steady_panda` | Not on a page yet |
| `tengu_steady_plover` | Not on a page yet |
| `tengu_steady_puppy` | Not on a page yet |
| `tengu_steady_sunbeam` | Not on a page yet |
| `tengu_stellar_drift` | Not on a page yet |
| `tengu_still_heron` | Not on a page yet |
| `tengu_stream_watchdog_default_on` | Not on a page yet |
| `tengu_streamed_bumblebee` | Not on a page yet |
| `tengu_streamed_bumblebee_text` | Not on a page yet |
| `tengu_streamed_gem` | Not on a page yet |
| `tengu_streamed_thimble` | Not on a page yet |
| `tengu_structured_output_strict` | Not on a page yet |
| `tengu_subagent_cache_evict` | Not on a page yet |
| `tengu_surface_failed_mcp_servers` | Not on a page yet |
| `tengu_swift_lynx` | Not on a page yet |
| `tengu_swift_whistle` | Not on a page yet |
| `tengu_swirling_meteor` | Not on a page yet |
| `tengu_swirling_squid` | Not on a page yet |
| `tengu_synchronous_bunny` | Not on a page yet |
| `tengu_synthetic_fog` | Not on a page yet |
| `tengu_tab_read_sep` | Not on a page yet |
| `tengu_tallow_quoit` | Not on a page yet |
| `tengu_tallow_quoit_gate` | Not on a page yet |
| `tengu_teal_corbel` | Not on a page yet |
| `tengu_teal_corbel_finial` | Not on a page yet |
| `tengu_teal_corbel_newel` | Not on a page yet |
| `tengu_teleport_github_access_precheck` | Not on a page yet |
| `tengu_teleport_send_to_cloud` | Not on a page yet |
| `tengu_temporal_hare` | Not on a page yet |
| `tengu_tender_mitten` | Not on a page yet |
| `tengu_tender_thunder` | Not on a page yet |
| `tengu_tender_truffle` | Not on a page yet |
| `tengu_terminal_sidebar` | Not on a page yet |
| `tengu_thinking_block_resumption` | Not on a page yet |
| `tengu_thistle_grebe` | Not on a page yet |
| `tengu_thistle_orrery` | Not on a page yet |
| `tengu_thrifty_sonic` | Not on a page yet |
| `tengu_ticklish_pnueli` | Not on a page yet |
| `tengu_ticklish_whisper` | Not on a page yet |
| `tengu_tidy_abacus` | Not on a page yet |
| `tengu_tidy_cloud` | Not on a page yet |
| `tengu_tidy_eclipse` | Not on a page yet |
| `tengu_tidy_fern` | Not on a page yet |
| `tengu_tidy_frost` | Not on a page yet |
| `tengu_tidy_lemon` | Not on a page yet |
| `tengu_tidy_origami` | Not on a page yet |
| `tengu_tidy_sloth` | Not on a page yet |
| `tengu_tidy_widget` | Not on a page yet |
| `tengu_tingly_pearl` | Not on a page yet |
| `tengu_tingly_pike` | Not on a page yet |
| `tengu_tips_mod` | Not on a page yet |
| `tengu_toasty_breeze` | Not on a page yet |
| `tengu_toasty_fiddle` | Not on a page yet |
| `tengu_toasty_hammock` | Not on a page yet |
| `tengu_toasty_owl` | Not on a page yet |
| `tengu_tool_cgroup_exclude_classes` | Not on a page yet |
| `tengu_tool_detach` | Not on a page yet |
| `tengu_tool_memory_cgroup` | Not on a page yet |
| `tengu_tool_pear` | Not on a page yet |
| `tengu_tool_search_unsupported_models` | Not on a page yet |
| `tengu_tools_exclusion_killswitch` | Not on a page yet |
| `tengu_trace_lantern` | Not on a page yet |
| `tengu_tranquil_cloud` | Not on a page yet |
| `tengu_tranquil_crescent` | Not on a page yet |
| `tengu_tranquil_fern` | Not on a page yet |
| `tengu_tranquil_starlight` | Not on a page yet |
| `tengu_transcript_local_gc` | Not on a page yet |
| `tengu_truncated_response_recovery` | Not on a page yet |
| `tengu_turtle_carbon` | Not on a page yet |
| `tengu_tussock_oriole` | Not on a page yet |
| `tengu_twinkling_boole` | Not on a page yet |
| `tengu_twinkling_cosmos` | Not on a page yet |
| `tengu_twinkling_globe` | Not on a page yet |
| `tengu_twinkling_hoare` | Not on a page yet |
| `tengu_twinkly_breeze` | Not on a page yet |
| `tengu_twinkly_clover` | Not on a page yet |
| `tengu_twinkly_prism` | Not on a page yet |
| `tengu_typed_koala` | Not on a page yet |
| `tengu_ultraplan_config` | Not on a page yet |
| `tengu_ultraplan_prompt_identifier` | Not on a page yet |
| `tengu_ultraplan_timeout_seconds` | Not on a page yet |
| `tengu_ultrareview_awareness` | Not on a page yet |
| `tengu_ultrareview_post_enabled` | Not on a page yet |
| `tengu_umber_petrel` | Not on a page yet |
| `tengu_umber_plover` | Not on a page yet |
| `tengu_umber_sluice` | Not on a page yet |
| `tengu_umber_stile` | Not on a page yet |
| `tengu_unified_waterfall` | Not on a page yet |
| `tengu_usage_overage_included_models` | Not on a page yet |
| `tengu_valiant_crayon` | Not on a page yet |
| `tengu_valiant_crescent` | Not on a page yet |
| `tengu_valiant_finch` | Not on a page yet |
| `tengu_valiant_rain` | Not on a page yet |
| `tengu_valiant_sphinx` | Not on a page yet |
| `tengu_validated_clover` | Not on a page yet |
| `tengu_vast_journal` | Not on a page yet |
| `tengu_vast_platypus` | Not on a page yet |
| `tengu_vast_puddle` | Not on a page yet |
| `tengu_vast_sunset` | Not on a page yet |
| `tengu_vast_tulip` | Not on a page yet |
| `tengu_vellum_anchor` | Not on a page yet |
| `tengu_vellum_siding` | Not on a page yet |
| `tengu_velvet_cairn` | Not on a page yet |
| `tengu_velvet_gannet` | Not on a page yet |
| `tengu_velvet_harbor_owl` | Not on a page yet |
| `tengu_velvet_heron` | Not on a page yet |
| `tengu_velvet_ibis` | Not on a page yet |
| `tengu_velvet_marble` | Not on a page yet |
| `tengu_velvet_moth` | Not on a page yet |
| `tengu_velvet_panda` | Not on a page yet |
| `tengu_velvet_tide` | Not on a page yet |
| `tengu_velvety_aurora` | Not on a page yet |
| `tengu_velvety_mango` | Not on a page yet |
| `tengu_velvety_ripple` | Not on a page yet |
| `tengu_velvety_sprout` | Not on a page yet |
| `tengu_verified_vs_assumed` | Not on a page yet |
| `tengu_version_config` | Not on a page yet |
| `tengu_violin_adjuster` | Not on a page yet |
| `tengu_violin_amati` | Not on a page yet |
| `tengu_violin_arching` | Not on a page yet |
| `tengu_violin_bassbar` | Not on a page yet |
| `tengu_violin_bridgepin` | Not on a page yet |
| `tengu_violin_camber` | Not on a page yet |
| `tengu_violin_chinrest` | Not on a page yet |
| `tengu_violin_colophony` | Not on a page yet |
| `tengu_violin_corner` | Not on a page yet |
| `tengu_violin_ebony` | Not on a page yet |
| `tengu_violin_endpin` | Not on a page yet |
| `tengu_violin_eye` | Not on a page yet |
| `tengu_violin_ferrule` | Not on a page yet |
| `tengu_violin_fhole` | Not on a page yet |
| `tengu_violin_finetuner` | Not on a page yet |
| `tengu_violin_fingerboard` | Not on a page yet |
| `tengu_violin_fret` | Not on a page yet |
| `tengu_violin_frog` | Not on a page yet |
| `tengu_violin_hair` | Not on a page yet |
| `tengu_violin_heel` | Not on a page yet |
| `tengu_violin_lapping` | Not on a page yet |
| `tengu_violin_lining` | Not on a page yet |
| `tengu_violin_luthier` | Not on a page yet |
| `tengu_violin_maple` | Not on a page yet |
| `tengu_violin_mute` | Not on a page yet |
| `tengu_violin_neck` | Not on a page yet |
| `tengu_violin_nut` | Not on a page yet |
| `tengu_violin_overstand` | Not on a page yet |
| `tengu_violin_peg` | Not on a page yet |
| `tengu_violin_pernambuco` | Not on a page yet |
| `tengu_violin_plan_classifier` | Not on a page yet |
| `tengu_violin_purfling` | Not on a page yet |
| `tengu_violin_rib` | Not on a page yet |
| `tengu_violin_rosin` | [Shell, Web, and Background Tasks](tools/shell-and-web.md) |
| `tengu_violin_saddle` | Not on a page yet |
| `tengu_violin_scroll` | Not on a page yet |
| `tengu_violin_speculative_classifier` | Not on a page yet |
| `tengu_violin_spruce` | Not on a page yet |
| `tengu_violin_strad` | Not on a page yet |
| `tengu_violin_table` | Not on a page yet |
| `tengu_violin_tailgut` | Not on a page yet |
| `tengu_violin_tailpiece` | Not on a page yet |
| `tengu_violin_tip` | Not on a page yet |
| `tengu_violin_varnish` | Not on a page yet |
| `tengu_violin_volute` | Not on a page yet |
| `tengu_violin_waist` | Not on a page yet |
| `tengu_violin_willow` | Not on a page yet |
| `tengu_violin_winding` | Not on a page yet |
| `tengu_violin_wood` | Not on a page yet |
| `tengu_virtual_knuth` | Not on a page yet |
| `tengu_virtual_pancake` | Not on a page yet |
| `tengu_virtual_pine` | Not on a page yet |
| `tengu_vivid_crayon` | Not on a page yet |
| `tengu_vivid_crown` | Not on a page yet |
| `tengu_vscode_feedback_survey` | Not on a page yet |
| `tengu_vscode_inline_pastes` | Not on a page yet |
| `tengu_vscode_math_rendering` | Not on a page yet |
| `tengu_vscode_onboarding` | Not on a page yet |
| `tengu_vscode_python_beside_start` | Not on a page yet |
| `tengu_vscode_restore_breaker` | Not on a page yet |
| `tengu_vscode_resume_precheck` | Not on a page yet |
| `tengu_vscode_review_upsell` | Not on a page yet |
| `tengu_vscode_stored_startup_config` | Not on a page yet |
| `tengu_walnut_tiller` | Not on a page yet |
| `tengu_warm_mochi` | Not on a page yet |
| `tengu_warm_sunrise` | Not on a page yet |
| `tengu_wary_ladle` | Not on a page yet |
| `tengu_watchdog_skip_nonstreaming_fallback` | Not on a page yet |
| `tengu_webfetch_deadline_ms` | Not on a page yet |
| `tengu_whimsical_elephant` | Not on a page yet |
| `tengu_wif_user_oauth_refresh_token_cleared` | Not on a page yet |
| `tengu_wiggly_dove` | Not on a page yet |
| `tengu_wild_beacon` | Not on a page yet |
| `tengu_wild_gosling` | Not on a page yet |
| `tengu_wild_octopus` | Not on a page yet |
| `tengu_wild_tome` | Not on a page yet |
| `tengu_willow_tern` | Not on a page yet |
| `tengu_wise_bear_copy` | Not on a page yet |
| `tengu_wise_comet` | Not on a page yet |
| `tengu_wise_kite` | Not on a page yet |
| `tengu_witty_hearth` | Not on a page yet |
| `tengu_witty_kay` | Not on a page yet |
| `tengu_witty_wand` | Not on a page yet |
| `tengu_wobbly_dahl` | Not on a page yet |
| `tengu_wobbly_fern` | Not on a page yet |
| `tengu_wobbly_pinwheel` | Not on a page yet |
| `tengu_wondrous_acorn` | Not on a page yet |
| `tengu_wondrous_haven` | Not on a page yet |
| `tengu_woolly_forest` | Not on a page yet |
| `tengu_woolly_owl` | Not on a page yet |
| `tengu_woolly_wall` | Not on a page yet |
| `tengu_worker_owner_rows_killswitch` | Not on a page yet |
| `tengu_workflow_schema_lint_enforce` | Not on a page yet |
| `tengu_workflows_enabled` | Not on a page yet |
| `tengu_woven_harbor` | Not on a page yet |
| `tengu_woven_parcel` | Not on a page yet |
| `tengu_xterm_atlas_reset` | Not on a page yet |
| `tengu_zany_book` | Not on a page yet |
| `tengu_zany_flask` | Not on a page yet |
| `tengu_zany_melody` | Not on a page yet |
| `tengu_zesty_feather` | Not on a page yet |
| `tengu_zesty_pearl` | Not on a page yet |
| `tengu_zinc_harbor` | Not on a page yet |
| `tengu_zippy_gosling` | Not on a page yet |
| `tengu_zippy_harbor` | Not on a page yet |
| `tengu_zippy_spindle` | Not on a page yet |

## Hook Events

Items: 33.

| Item | Where |
| --- | --- |
| `ConfigChange` | [Hook Configuration](../extend/hooks/configuration.md) |
| `CwdChanged` | [Hook Configuration](../extend/hooks/configuration.md) |
| `DirectoryAdded` | [Hook Configuration](../extend/hooks/configuration.md) |
| `Elicitation` | [Hook Configuration](../extend/hooks/configuration.md) |
| `ElicitationResult` | [Hook Configuration](../extend/hooks/configuration.md) |
| `FileChanged` | [Hook Configuration](../extend/hooks/configuration.md) |
| `InstructionsLoaded` | [Hook Configuration](../extend/hooks/configuration.md) |
| `MessageDisplay` | [Hook Configuration](../extend/hooks/configuration.md) |
| `Notification` | [Hook Configuration](../extend/hooks/configuration.md) |
| `PermissionDenied` | [Hook Configuration](../extend/hooks/configuration.md) |
| `PermissionRequest` | [Hook Configuration](../extend/hooks/configuration.md) |
| `PostCompact` | [Hook Configuration](../extend/hooks/configuration.md) |
| `PostModelSwitch` | [Hook Configuration](../extend/hooks/configuration.md) |
| `PostToolBatch` | [Hook Configuration](../extend/hooks/configuration.md) |
| `PostToolUse` | [Hook Configuration](../extend/hooks/configuration.md) |
| `PostToolUseFailure` | [Hook Configuration](../extend/hooks/configuration.md) |
| `PreCompact` | [Hook Configuration](../extend/hooks/configuration.md) |
| `PreModelSwitch` | [Hook Configuration](../extend/hooks/configuration.md) |
| `PreToolUse` | [Hook Configuration](../extend/hooks/configuration.md) |
| `SessionEnd` | [Hook Configuration](../extend/hooks/configuration.md) |
| `SessionStart` | [Hook Configuration](../extend/hooks/configuration.md) |
| `Setup` | [Hook Configuration](../extend/hooks/configuration.md) |
| `Stop` | [Hook Configuration](../extend/hooks/configuration.md) |
| `StopFailure` | [Hook Configuration](../extend/hooks/configuration.md) |
| `SubagentStart` | [Hook Configuration](../extend/hooks/configuration.md) |
| `SubagentStop` | [Hook Configuration](../extend/hooks/configuration.md) |
| `TaskCompleted` | [Hook Configuration](../extend/hooks/configuration.md) |
| `TaskCreated` | [Hook Configuration](../extend/hooks/configuration.md) |
| `TeammateIdle` | [Hook Configuration](../extend/hooks/configuration.md) |
| `UserPromptExpansion` | [Hook Configuration](../extend/hooks/configuration.md) |
| `UserPromptSubmit` | [Hook Configuration](../extend/hooks/configuration.md) |
| `WorktreeCreate` | [Hook Configuration](../extend/hooks/configuration.md) |
| `WorktreeRemove` | [Hook Configuration](../extend/hooks/configuration.md) |

## Keybindings

Items: 204.

| Item | Where |
| --- | --- |
| `AbovePrompt` | Not on a page yet |
| `AbovePromptInput` | Not on a page yet |
| `AbovePromptSelect` | Not on a page yet |
| `Agents` | Not on a page yet |
| `Attachments` | Not on a page yet |
| `Autocomplete` | Not on a page yet |
| `Chat` | Not on a page yet |
| `Confirmation` | Not on a page yet |
| `DiffDialog` | Not on a page yet |
| `DiffPanel` | Not on a page yet |
| `EffortSlider` | Not on a page yet |
| `FeedbackSurvey` | Not on a page yet |
| `Footer` | Not on a page yet |
| `Global` | Not on a page yet |
| `Help` | Not on a page yet |
| `HistorySearch` | Not on a page yet |
| `MessageSelector` | Not on a page yet |
| `ModelPicker` | Not on a page yet |
| `Pane` | Not on a page yet |
| `PaneField` | Not on a page yet |
| `Plugin` | Not on a page yet |
| `ProactivityMenu` | Not on a page yet |
| `Scroll` | Not on a page yet |
| `Select` | Not on a page yet |
| `Settings` | Not on a page yet |
| `Tabs` | Not on a page yet |
| `Task` | Not on a page yet |
| `ThemePicker` | Not on a page yet |
| `Transcript` | Not on a page yet |
| `abovePrompt:focus` | Not on a page yet |
| `abovePrompt:highlightNext` | Not on a page yet |
| `abovePrompt:highlightPrevious` | Not on a page yet |
| `abovePrompt:leave` | Not on a page yet |
| `abovePrompt:next` | Not on a page yet |
| `abovePrompt:press` | Not on a page yet |
| `abovePrompt:previous` | Not on a page yet |
| `abovePrompt:toggle` | Not on a page yet |
| `agents:find` | Not on a page yet |
| `agents:nextGroup` | Not on a page yet |
| `agents:previousGroup` | Not on a page yet |
| `agents:rename` | Not on a page yet |
| `agents:setGroup` | Not on a page yet |
| `agents:switchView` | Not on a page yet |
| `agents:togglePin` | Not on a page yet |
| `app:cycleDiffBase` | Not on a page yet |
| `app:diffFileListDown` | Not on a page yet |
| `app:diffFileListUp` | Not on a page yet |
| `app:exit` | Not on a page yet |
| `app:interrupt` | Not on a page yet |
| `app:openArtifact` | Not on a page yet |
| `app:redraw` | Not on a page yet |
| `app:toggleBrief` | Not on a page yet |
| `app:toggleDiffNoiseFilter` | Not on a page yet |
| `app:toggleDiffPreSession` | Not on a page yet |
| `app:toggleReplTab` | Not on a page yet |
| `app:toggleTerminal` | Not on a page yet |
| `app:toggleTodos` | Not on a page yet |
| `app:toggleTranscript` | Not on a page yet |
| `attachments:exit` | Not on a page yet |
| `attachments:next` | Not on a page yet |
| `attachments:previous` | Not on a page yet |
| `attachments:remove` | Not on a page yet |
| `autocomplete:accept` | Not on a page yet |
| `autocomplete:dismiss` | Not on a page yet |
| `autocomplete:next` | Not on a page yet |
| `autocomplete:previous` | Not on a page yet |
| `chat:attentionDown` | Not on a page yet |
| `chat:attentionUp` | Not on a page yet |
| `chat:cancel` | Not on a page yet |
| `chat:clearInput` | Not on a page yet |
| `chat:clearScreen` | Not on a page yet |
| `chat:cycleMode` | Not on a page yet |
| `chat:cycleProactivity` | Not on a page yet |
| `chat:decreaseEffort` | Not on a page yet |
| `chat:defaultToNewerModel` | Not on a page yet |
| `chat:externalEditor` | Not on a page yet |
| `chat:fastMode` | Not on a page yet |
| `chat:imagePaste` | Not on a page yet |
| `chat:increaseEffort` | Not on a page yet |
| `chat:killAgents` | Not on a page yet |
| `chat:modelPicker` | Not on a page yet |
| `chat:newline` | Not on a page yet |
| `chat:queueSubmit` | Not on a page yet |
| `chat:sendNow` | Not on a page yet |
| `chat:stash` | Not on a page yet |
| `chat:submit` | Not on a page yet |
| `chat:thinkingToggle` | Not on a page yet |
| `chat:undo` | Not on a page yet |
| `chat:workflowKeywordToggle` | Not on a page yet |
| `confirm:cycleMode` | Not on a page yet |
| `confirm:next` | Not on a page yet |
| `confirm:nextField` | Not on a page yet |
| `confirm:no` | Not on a page yet |
| `confirm:previous` | Not on a page yet |
| `confirm:previousField` | Not on a page yet |
| `confirm:toggle` | Not on a page yet |
| `confirm:yes` | Not on a page yet |
| `diff:back` | Not on a page yet |
| `diff:dismiss` | Not on a page yet |
| `diff:nextFile` | Not on a page yet |
| `diff:nextSource` | Not on a page yet |
| `diff:previousFile` | Not on a page yet |
| `diff:previousSource` | Not on a page yet |
| `effortSlider:decreaseEffort` | Not on a page yet |
| `effortSlider:increaseEffort` | Not on a page yet |
| `effortSlider:thisSessionOnly` | Not on a page yet |
| `effortSlider:toggleUltracode` | Not on a page yet |
| `feedbackSurvey:bad` | Not on a page yet |
| `feedbackSurvey:fine` | Not on a page yet |
| `feedbackSurvey:good` | Not on a page yet |
| `footer:clearSelection` | Not on a page yet |
| `footer:close` | Not on a page yet |
| `footer:dismiss` | Not on a page yet |
| `footer:down` | Not on a page yet |
| `footer:next` | Not on a page yet |
| `footer:openSelected` | Not on a page yet |
| `footer:previous` | Not on a page yet |
| `footer:up` | Not on a page yet |
| `help:dismiss` | Not on a page yet |
| `history:next` | Not on a page yet |
| `history:previous` | Not on a page yet |
| `history:search` | Not on a page yet |
| `historySearch:accept` | Not on a page yet |
| `historySearch:cancel` | Not on a page yet |
| `historySearch:cycleScope` | Not on a page yet |
| `historySearch:execute` | Not on a page yet |
| `historySearch:next` | Not on a page yet |
| `modelPicker:decreaseEffort` | Not on a page yet |
| `modelPicker:increaseEffort` | Not on a page yet |
| `modelPicker:thisSessionOnly` | Not on a page yet |
| `pane:bottom` | Not on a page yet |
| `pane:close` | Not on a page yet |
| `pane:grow` | Not on a page yet |
| `pane:next` | Not on a page yet |
| `pane:pageDown` | Not on a page yet |
| `pane:pageUp` | Not on a page yet |
| `pane:previous` | Not on a page yet |
| `pane:scrollDown` | Not on a page yet |
| `pane:scrollUp` | Not on a page yet |
| `pane:shrink` | Not on a page yet |
| `pane:top` | Not on a page yet |
| `permission:toggleDebug` | Not on a page yet |
| `plugin:cycleMarketplace` | Not on a page yet |
| `plugin:favorite` | Not on a page yet |
| `plugin:install` | Not on a page yet |
| `plugin:toggle` | Not on a page yet |
| `proactivityMenu:nextMode` | Not on a page yet |
| `proactivityMenu:previousMode` | Not on a page yet |
| `scroll:bottom` | Not on a page yet |
| `scroll:fullPageDown` | Not on a page yet |
| `scroll:fullPageUp` | Not on a page yet |
| `scroll:halfPageDown` | Not on a page yet |
| `scroll:halfPageUp` | Not on a page yet |
| `scroll:lineDown` | Not on a page yet |
| `scroll:lineUp` | Not on a page yet |
| `scroll:pageDown` | Not on a page yet |
| `scroll:pageUp` | Not on a page yet |
| `scroll:top` | Not on a page yet |
| `select:accept` | Not on a page yet |
| `select:cancel` | Not on a page yet |
| `select:first` | Not on a page yet |
| `select:last` | Not on a page yet |
| `select:next` | Not on a page yet |
| `select:pageDown` | Not on a page yet |
| `select:pageUp` | Not on a page yet |
| `select:previous` | Not on a page yet |
| `selection:clear` | Not on a page yet |
| `selection:copy` | Not on a page yet |
| `selection:extendDown` | Not on a page yet |
| `selection:extendLeft` | Not on a page yet |
| `selection:extendLineEnd` | Not on a page yet |
| `selection:extendLineStart` | Not on a page yet |
| `selection:extendRight` | Not on a page yet |
| `selection:extendUp` | Not on a page yet |
| `settings:fixUsage` | Not on a page yet |
| `settings:periodDay` | Not on a page yet |
| `settings:periodWeek` | Not on a page yet |
| `settings:retry` | Not on a page yet |
| `settings:search` | Not on a page yet |
| `settings:sortByTokens` | Not on a page yet |
| `strip:jump1` | Not on a page yet |
| `strip:jump2` | Not on a page yet |
| `strip:jump3` | Not on a page yet |
| `strip:jump4` | Not on a page yet |
| `strip:jump5` | Not on a page yet |
| `strip:jump6` | Not on a page yet |
| `strip:jump7` | Not on a page yet |
| `strip:jump8` | Not on a page yet |
| `strip:jump9` | Not on a page yet |
| `strip:new` | Not on a page yet |
| `strip:next` | Not on a page yet |
| `strip:previous` | Not on a page yet |
| `strip:tabNext` | Not on a page yet |
| `strip:tabPrevious` | Not on a page yet |
| `strip:toggle` | Not on a page yet |
| `strip:viewAll` | Not on a page yet |
| `tabs:next` | Not on a page yet |
| `tabs:previous` | Not on a page yet |
| `task:background` | Not on a page yet |
| `theme:editCustom` | Not on a page yet |
| `theme:toggleSyntaxHighlighting` | Not on a page yet |
| `transcript:exit` | Not on a page yet |
| `transcript:toggleShowAll` | Not on a page yet |
| `voice:pushToTalk` | Not on a page yet |

## Mod API

Items: 229.

| Item | Where |
| --- | --- |
| `$.agent.list` | [Agent](../extend/mod-api/agent.md) |
| `$.agent.register` | [Agent](../extend/mod-api/agent.md) |
| `$.agent.spawn` | [Agent](../extend/mod-api/agent.md) |
| `$.audio.play` | [Model, Audio, and MCP](../extend/mod-api/model-audio-mcp.md) |
| `$.audio.speak` | [Model, Audio, and MCP](../extend/mod-api/model-audio-mcp.md) |
| `$.clock.after` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `$.clock.every` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `$.clock.now` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `$.clock.sleep` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `$.command.list` | [Tool, Command, and Config](../extend/mod-api/tool-command-config.md) |
| `$.command.register` | [Tool, Command, and Config](../extend/mod-api/tool-command-config.md) |
| `$.command.run` | [Tool, Command, and Config](../extend/mod-api/tool-command-config.md) |
| `$.config.list` | [Tool, Command, and Config](../extend/mod-api/tool-command-config.md) |
| `$.config.set` | [Tool, Command, and Config](../extend/mod-api/tool-command-config.md) |
| `$.env.get` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `$.env.set` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `$.fs.ancestors` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `$.fs.exists` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `$.fs.list` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `$.fs.read` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `$.fs.stat` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `$.fs.write` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `$.http.fetch` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `$.mcp.call` | [Model, Audio, and MCP](../extend/mod-api/model-audio-mcp.md) |
| `$.mcp.connect` | [Model, Audio, and MCP](../extend/mod-api/model-audio-mcp.md) |
| `$.model.classify` | [Model, Audio, and MCP](../extend/mod-api/model-audio-mcp.md) |
| `$.model.complete` | [Model, Audio, and MCP](../extend/mod-api/model-audio-mcp.md) |
| `$.model.fork` | [Model, Audio, and MCP](../extend/mod-api/model-audio-mcp.md) |
| `$.plugin.name` | [Plugin and Engine](../extend/mod-api/plugin.md) |
| `$.plugin.root` | [Plugin and Engine](../extend/mod-api/plugin.md) |
| `$.process.run` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `$.process.spawn` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `$.prompt.compose` | [Turn and Prompt](../extend/mod-api/turn-prompt.md) |
| `$.prompt.fill` | [Turn and Prompt](../extend/mod-api/turn-prompt.md) |
| `$.prompt.media` | [Turn and Prompt](../extend/mod-api/turn-prompt.md) |
| `$.prompt.read` | [Turn and Prompt](../extend/mod-api/turn-prompt.md) |
| `$.prompt.submit` | [Turn and Prompt](../extend/mod-api/turn-prompt.md) |
| `$.prompt.suggest` | [Turn and Prompt](../extend/mod-api/turn-prompt.md) |
| `$.session.append` | [Session](../extend/mod-api/session.md) |
| `$.session.authorize` | [Session](../extend/mod-api/session.md) |
| `$.session.compact` | [Session](../extend/mod-api/session.md) |
| `$.session.cwd` | [Session](../extend/mod-api/session.md) |
| `$.session.id` | [Session](../extend/mod-api/session.md) |
| `$.session.identity` | [Session](../extend/mod-api/session.md) |
| `$.session.messages` | [Session](../extend/mod-api/session.md) |
| `$.session.model` | [Session](../extend/mod-api/session.md) |
| `$.session.repo` | [Session](../extend/mod-api/session.md) |
| `$.session.root` | [Session](../extend/mod-api/session.md) |
| `$.session.send` | [Session](../extend/mod-api/session.md) |
| `$.session.surface` | [Session](../extend/mod-api/session.md) |
| `$.session.surfaces` | [Session](../extend/mod-api/session.md) |
| `$.session.turns` | [Session](../extend/mod-api/session.md) |
| `$.session.usage` | [Session](../extend/mod-api/session.md) |
| `$.session.version` | [Session](../extend/mod-api/session.md) |
| `$.settings.read` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `$.state.get` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `$.state.set` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `$.store.delete` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `$.store.get` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `$.store.keys` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `$.store.set` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `$.telemetry.log` | [Telemetry](../extend/mod-api/telemetry.md) |
| `$.telemetry.mark` | [Telemetry](../extend/mod-api/telemetry.md) |
| `$.tool.call` | [Agent](../extend/mod-api/agent.md) |
| `$.tool.check` | [Tool, Command, and Config](../extend/mod-api/tool-command-config.md) |
| `$.tool.list` | [Tool, Command, and Config](../extend/mod-api/tool-command-config.md) |
| `$.tool.register` | [Session](../extend/mod-api/session.md) |
| `$.turn.abort` | [Turn and Prompt](../extend/mod-api/turn-prompt.md) |
| `$.ui.ask` | [UI Methods](../extend/mod-api/ui.md) |
| `$.ui.blit` | [UI Types](../extend/mod-api/types/ui.md) |
| `$.ui.close` | [UI Types](../extend/mod-api/types/ui.md) |
| `$.ui.copy` | [UI Methods](../extend/mod-api/ui.md) |
| `$.ui.focus` | [UI Types](../extend/mod-api/types/ui.md) |
| `$.ui.invalidate` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `$.ui.log` | [Plugin and Engine](../extend/mod-api/plugin.md) |
| `$.ui.notice` | [Model, Audio, and MCP Types](../extend/mod-api/types/model.md) |
| `$.ui.notify` | [UI Methods](../extend/mod-api/ui.md) |
| `$.ui.open` | [UI Types](../extend/mod-api/types/ui.md) |
| `$.ui.panes` | [UI Methods](../extend/mod-api/ui.md) |
| `$.ui.resolve` | [UI Types](../extend/mod-api/types/ui.md) |
| `$.ui.scroll` | [UI Types](../extend/mod-api/types/ui.md) |
| `$.ui.selection` | [UI Methods](../extend/mod-api/ui.md) |
| `$.ui.status` | [UI Methods](../extend/mod-api/ui.md) |
| `$.ui.toast` | [Files, Nouns, and Gates](../extend/mod-api/nouns-and-gates.md) |
| `$.ui.view` | [UI Methods](../extend/mod-api/ui.md) |
| `agent.list` | [Agent](../extend/mod-api/agent.md) |
| `agent.offer` | [Agent](../extend/mod-api/agent.md) |
| `agent.register` | [Agent](../extend/mod-api/agent.md) |
| `agent.spawn` | [Agent](../extend/mod-api/agent.md) |
| `attribution.text` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `audio.play` | [Model, Audio, and MCP](../extend/mod-api/model-audio-mcp.md) |
| `audio.speak` | [Model, Audio, and MCP](../extend/mod-api/model-audio-mcp.md) |
| `classic.ConfigChange` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.CwdChanged` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.DirectoryAdded` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.Elicitation` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.ElicitationResult` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.FileChanged` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.InstructionsLoaded` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.MessageDisplay` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.Notification` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.PermissionDenied` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.PermissionRequest` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.PostCompact` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.PostModelSwitch` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.PostToolBatch` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.PostToolUse` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.PostToolUseFailure` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.PreCompact` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.PreModelSwitch` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.PreToolUse` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.SessionEnd` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.SessionStart` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.Setup` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.Stop` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.StopFailure` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.SubagentStart` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.SubagentStop` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.TaskCompleted` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.TaskCreated` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.TeammateIdle` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.UserPromptExpansion` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.UserPromptSubmit` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.WorktreeCreate` | [Classic Events](../extend/mod-api/classic-events.md) |
| `classic.WorktreeRemove` | [Classic Events](../extend/mod-api/classic-events.md) |
| `clock.after` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `clock.every` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `clock.now` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `clock.sleep` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `command.describe` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `command.list` | [Tool, Command, and Config](../extend/mod-api/tool-command-config.md) |
| `command.register` | [Tool, Command, and Config](../extend/mod-api/tool-command-config.md) |
| `command.run` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `config.describe` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `config.list` | [Tool, Command, and Config](../extend/mod-api/tool-command-config.md) |
| `config.set` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `engine.create` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `env.get` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `env.set` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `fs.ancestors` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `fs.exists` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `fs.list` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `fs.read` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `fs.stat` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `fs.write` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `http.fetch` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `mcp.call` | [Model, Audio, and MCP](../extend/mod-api/model-audio-mcp.md) |
| `mcp.connect` | [Model, Audio, and MCP](../extend/mod-api/model-audio-mcp.md) |
| `model.classify` | [Model, Audio, and MCP](../extend/mod-api/model-audio-mcp.md) |
| `model.complete` | [Model, Audio, and MCP](../extend/mod-api/model-audio-mcp.md) |
| `model.fork` | [Model, Audio, and MCP](../extend/mod-api/model-audio-mcp.md) |
| `plugin.register` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `process.run` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `process.spawn` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `prompt.attachment` | [Turn and Prompt](../extend/mod-api/turn-prompt.md) |
| `prompt.autocomplete` | [Turn and Prompt](../extend/mod-api/turn-prompt.md) |
| `prompt.change` | [Turn and Prompt](../extend/mod-api/turn-prompt.md) |
| `prompt.compose` | [Turn and Prompt](../extend/mod-api/turn-prompt.md) |
| `prompt.context` | [Turn and Prompt](../extend/mod-api/turn-prompt.md) |
| `prompt.edit` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `prompt.fill` | [Turn and Prompt](../extend/mod-api/turn-prompt.md) |
| `prompt.mention` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `prompt.read` | [Turn and Prompt](../extend/mod-api/turn-prompt.md) |
| `prompt.section` | [Turn and Prompt](../extend/mod-api/turn-prompt.md) |
| `prompt.submit` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `prompt.suggest` | [Turn and Prompt](../extend/mod-api/turn-prompt.md) |
| `session.append` | [Session](../extend/mod-api/session.md) |
| `session.attach` | [Session](../extend/mod-api/session.md) |
| `session.authorize` | [Session](../extend/mod-api/session.md) |
| `session.compact` | [Session](../extend/mod-api/session.md) |
| `session.cwd` | [Session](../extend/mod-api/session.md) |
| `session.detach` | [Session](../extend/mod-api/session.md) |
| `session.end` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `session.id` | [Session](../extend/mod-api/session.md) |
| `session.identity` | [Session](../extend/mod-api/session.md) |
| `session.measure` | [Session](../extend/mod-api/session.md) |
| `session.messages` | [Session](../extend/mod-api/session.md) |
| `session.model` | [Session](../extend/mod-api/session.md) |
| `session.receive` | [Session](../extend/mod-api/session.md) |
| `session.repo` | [Session](../extend/mod-api/session.md) |
| `session.root` | [Session](../extend/mod-api/session.md) |
| `session.send` | [Session](../extend/mod-api/session.md) |
| `session.start` | [Agent](../extend/mod-api/agent.md) |
| `session.surface` | [Session](../extend/mod-api/session.md) |
| `session.surfaces` | [Session](../extend/mod-api/session.md) |
| `session.turns` | [Session](../extend/mod-api/session.md) |
| `session.usage` | [Session](../extend/mod-api/session.md) |
| `session.version` | [Session](../extend/mod-api/session.md) |
| `settings.read` | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| `skill.prompt` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `state.get` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `state.set` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `store.delete` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `store.get` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `store.keys` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `store.set` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `telemetry.log` | [Mod API Overview](../extend/mod-api/index.md) |
| `telemetry.mark` | [Mod API Overview](../extend/mod-api/index.md) |
| `tool.call` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `tool.check` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `tool.describe` | [Tool, Command, and Config](../extend/mod-api/tool-command-config.md) |
| `tool.list` | [Tool, Command, and Config](../extend/mod-api/tool-command-config.md) |
| `tool.register` | [Tool, Command, and Config](../extend/mod-api/tool-command-config.md) |
| `turn.abort` | [Turn and Prompt](../extend/mod-api/turn-prompt.md) |
| `turn.complete` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `turn.start` | [Turn and Prompt](../extend/mod-api/turn-prompt.md) |
| `turn.step` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `ui.blit` | [UI Events](../extend/mod-api/ui-events.md) |
| `ui.close` | [UI Types](../extend/mod-api/types/ui.md) |
| `ui.copy` | [UI Events](../extend/mod-api/ui-events.md) |
| `ui.fault` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `ui.focus` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `ui.input` | [Testing Types](../extend/mod-api/types/testing.md) |
| `ui.invalidate` | [UI Events](../extend/mod-api/ui-events.md) |
| `ui.log` | [UI Types](../extend/mod-api/types/ui.md) |
| `ui.message` | [Hook Machinery Types](../extend/mod-api/types/hooks.md) |
| `ui.notice` | [UI Events](../extend/mod-api/ui-events.md) |
| `ui.notify` | [UI Events](../extend/mod-api/ui-events.md) |
| `ui.open` | [Surfaces, Elements, and Render Sites](../extend/mod-api/ui-elements.md) |
| `ui.panes` | [UI Events](../extend/mod-api/ui-events.md) |
| `ui.press` | [Mod API Overview](../extend/mod-api/index.md) |
| `ui.render` | [Files, Store, and State](../extend/mod-api/fs-store-state.md) |
| `ui.resolve` | [Hooks and the Hook Chain](../extend/mod-api/hooks.md) |
| `ui.scroll` | [UI Types](../extend/mod-api/types/ui.md) |
| `ui.select` | [Testing Types](../extend/mod-api/types/testing.md) |
| `ui.selection` | [UI Events](../extend/mod-api/ui-events.md) |
| `ui.status` | [UI Events](../extend/mod-api/ui-events.md) |
| `ui.toast` | [UI Events](../extend/mod-api/ui-events.md) |
| `ui.view` | [UI Events](../extend/mod-api/ui-events.md) |

## Models

Items: 66.

| Item | Where |
| --- | --- |
| `best` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-3-5-haiku` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-3-5-haiku-20241022` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-3-5-haiku@20241022` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-3-5-sonnet` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-3-5-sonnet-20241022` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-3-5-sonnet-v2@20241022` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-3-7-sonnet` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-3-7-sonnet-20250219` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-3-7-sonnet@20250219` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-3-haiku` | Not on a page yet |
| `claude-3-opus` | Not on a page yet |
| `claude-3-sonnet` | Not on a page yet |
| `claude-fable-5` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-fable-5-1` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-fable-5[1m]` | Not on a page yet |
| `claude-haiku-3-5` | Not on a page yet |
| `claude-haiku-4-5` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-haiku-4-5-20251001` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-haiku-4-5@20251001` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-haiku-5-5` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-mythos-5` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-mythos-5-1` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-mythos-preview` | Not on a page yet |
| `claude-opus-4` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-opus-4-0` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-opus-4-1` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-opus-4-1-20250805` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-opus-4-1@20250805` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-opus-4-20250514` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-opus-4-5` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-opus-4-5-20251101` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-opus-4-5@20251101` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-opus-4-6` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-opus-4-6[1m]` | Not on a page yet |
| `claude-opus-4-7` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-opus-4-8` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-opus-4-8[1m]` | Not on a page yet |
| `claude-opus-4@20250514` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-opus-5` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-opus-5-5` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-opus-5-5[1m]` | Not on a page yet |
| `claude-opus-5[1m]` | Not on a page yet |
| `claude-sonnet-3-7` | Not on a page yet |
| `claude-sonnet-4` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-sonnet-4-0` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-sonnet-4-20250514` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-sonnet-4-5` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-sonnet-4-5-20250929` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-sonnet-4-5-20250929[1m]` | Not on a page yet |
| `claude-sonnet-4-5@20250929` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-sonnet-4-6` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-sonnet-4-6[1m]` | Not on a page yet |
| `claude-sonnet-4@20250514` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-sonnet-5` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-sonnet-5-5` | [Models and Providers](../configure/models-and-providers.md) |
| `claude-sonnet-5-5[1m]` | Not on a page yet |
| `claude-sonnet-5[1m]` | Not on a page yet |
| `fable` | [Models and Providers](../configure/models-and-providers.md) |
| `fable[1m]` | [Models and Providers](../configure/models-and-providers.md) |
| `haiku` | [Models and Providers](../configure/models-and-providers.md) |
| `opus` | [Models and Providers](../configure/models-and-providers.md) |
| `opus[1m]` | [Models and Providers](../configure/models-and-providers.md) |
| `opusplan` | [Models and Providers](../configure/models-and-providers.md) |
| `sonnet` | [Models and Providers](../configure/models-and-providers.md) |
| `sonnet[1m]` | [Models and Providers](../configure/models-and-providers.md) |

## OpenTelemetry Events

Items: 28.

| Item | Where |
| --- | --- |
| `api_error` | Not on a page yet |
| `api_refusal` | Not on a page yet |
| `api_request` | Not on a page yet |
| `api_retries_exhausted` | Not on a page yet |
| `assistant_response` | Not on a page yet |
| `at_mention` | Not on a page yet |
| `auth` | Not on a page yet |
| `compaction` | Not on a page yet |
| `feedback_survey` | Not on a page yet |
| `hook_execution_complete` | Not on a page yet |
| `hook_execution_start` | Not on a page yet |
| `hook_plugin_metrics` | Not on a page yet |
| `hook_registered` | Not on a page yet |
| `internal_error` | Not on a page yet |
| `managed_settings_resolved` | Not on a page yet |
| `mcp_server_connection` | Not on a page yet |
| `permission_mode_changed` | Not on a page yet |
| `plugin_installed` | Not on a page yet |
| `plugin_loaded` | Not on a page yet |
| `retention_sweep` | Not on a page yet |
| `safety_event` | Not on a page yet |
| `skill_activated` | Not on a page yet |
| `subagent_completed` | Not on a page yet |
| `system_prompt` | Not on a page yet |
| `tool` | Not on a page yet |
| `tool_decision` | Not on a page yet |
| `tool_result` | Not on a page yet |
| `user_prompt` | Not on a page yet |

## Permission Rules

Items: 6.

| Item | Where |
| --- | --- |
| `acceptEdits` | [Permission Modes](../configure/permissions/modes.md) |
| `auto` | [Permission Modes](../configure/permissions/modes.md) |
| `bypassPermissions` | [Permissions Overview](../configure/permissions/index.md) |
| `default` | [Permission Modes](../configure/permissions/modes.md) |
| `dontAsk` | [Permissions Overview](../configure/permissions/index.md) |
| `plan` | [Permission Modes](../configure/permissions/modes.md) |

## Settings

Items: 194.

| Item | Where |
| --- | --- |
| `$schema` | [Core Settings](../configure/settings/core.md) |
| `additionalMarketplaces` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `advisorModel` | [Model Settings](../configure/settings/model.md) |
| `agent` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `agentPushNotifEnabled` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `allowAllClaudeAiMcps` | [MCP and Channels Settings](../configure/settings/mcp-and-channels.md) |
| `allowClaudeInChromeWithManagedMcp` | [MCP and Channels Settings](../configure/settings/mcp-and-channels.md) |
| `allowManagedHooksOnly` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `allowManagedMcpServersOnly` | [MCP and Channels Settings](../configure/settings/mcp-and-channels.md) |
| `allowManagedPermissionRulesOnly` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `allowedChannelPlugins` | [MCP and Channels Settings](../configure/settings/mcp-and-channels.md) |
| `allowedHttpHookUrls` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `allowedMarketplaces` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `allowedMcpServers` | [MCP and Channels Settings](../configure/settings/mcp-and-channels.md) |
| `allowedProviders` | [Auth Settings](../configure/settings/auth.md) |
| `alwaysThinkingEnabled` | [Model Settings](../configure/settings/model.md) |
| `apiKeyHelper` | [Auth Settings](../configure/settings/auth.md) |
| `appendPlugins` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `askUserQuestionTimeout` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `attribution` | [Core Settings](../configure/settings/core.md) |
| `attributionProject` | [Core Settings](../configure/settings/core.md) |
| `attributionProjectPolicy` | [Core Settings](../configure/settings/core.md) |
| `autoCompactEnabled` | [Core Settings](../configure/settings/core.md) |
| `autoCompactWindow` | [Core Settings](../configure/settings/core.md) |
| `autoContinueAtUsageLimit` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `autoDreamEnabled` | [Core Settings](../configure/settings/core.md) |
| `autoMemoryDirectory` | [Core Settings](../configure/settings/core.md) |
| `autoMemoryEnabled` | [Core Settings](../configure/settings/core.md) |
| `autoMode` | [Extra Keys and Global Config](../configure/settings/extra-keys.md) |
| `autoScrollEnabled` | [Interface Settings](../configure/settings/ui.md) |
| `autoUpdatesChannel` | [Core Settings](../configure/settings/core.md) |
| `autoUploadSessions` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `availableModels` | [Model Settings](../configure/settings/model.md) |
| `availableModelsMatch` | [Settings Files and Scopes](../configure/settings/index.md) |
| `awaySummaryEnabled` | [Core Settings](../configure/settings/core.md) |
| `awsAuthRefresh` | [Auth Settings](../configure/settings/auth.md) |
| `awsCredentialExport` | [Auth Settings](../configure/settings/auth.md) |
| `axScreenReader` | [Extra Keys and Global Config](../configure/settings/extra-keys.md) |
| `bashEditDiffEnabled` | [Core Settings](../configure/settings/core.md) |
| `bashOutputMaxChars` | [Core Settings](../configure/settings/core.md) |
| `blockedMarketplaces` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `breakReminder` | [Interface Settings](../configure/settings/ui.md) |
| `channelsEnabled` | [MCP and Channels Settings](../configure/settings/mcp-and-channels.md) |
| `claudeMd` | [Core Settings](../configure/settings/core.md) |
| `claudeMdExcludes` | [Core Settings](../configure/settings/core.md) |
| `cleanupPeriodDays` | [Core Settings](../configure/settings/core.md) |
| `companyAnnouncements` | [Interface Settings](../configure/settings/ui.md) |
| `crossSessionInbound` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `daemonColdStart` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `defaultShell` | [Core Settings](../configure/settings/core.md) |
| `defaultView` | [Extra Keys and Global Config](../configure/settings/extra-keys.md) |
| `deniedMcpServers` | [MCP and Channels Settings](../configure/settings/mcp-and-channels.md) |
| `deniedModels` | [Model Settings](../configure/settings/model.md) |
| `desktopSessionCleanupPeriodDays` | [Core Settings](../configure/settings/core.md) |
| `dialogExpiry` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `disableAgentView` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `disableAllHooks` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `disableArtifact` | [Core Settings](../configure/settings/core.md) |
| `disableAutoMode` | [Extra Keys and Global Config](../configure/settings/extra-keys.md) |
| `disableBundledSkills` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `disableClaudeAiConnectors` | [Settings Files and Scopes](../configure/settings/index.md) |
| `disableCommandPluginSources` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `disableDeepLinkRegistration` | [Extra Keys and Global Config](../configure/settings/extra-keys.md) |
| `disableRemoteControl` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `disableSideloadFlags` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `disableSkillShellExecution` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `disableWorkflows` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `disabledMcpjsonServers` | [MCP and Channels Settings](../configure/settings/mcp-and-channels.md) |
| `doneMeansMerged` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `editorMode` | [Interface Settings](../configure/settings/ui.md) |
| `effortLevel` | [Model Settings](../configure/settings/model.md) |
| `emojiCompletionEnabled` | [Interface Settings](../configure/settings/ui.md) |
| `enableAllProjectMcpServers` | [MCP and Channels Settings](../configure/settings/mcp-and-channels.md) |
| `enableArtifact` | [Core Settings](../configure/settings/core.md) |
| `enableWorkflows` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `enabledMcpjsonServers` | [MCP and Channels Settings](../configure/settings/mcp-and-channels.md) |
| `enabledPlugins` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `enforceAvailableModels` | [Model Settings](../configure/settings/model.md) |
| `env` | [Auth Settings](../configure/settings/auth.md) |
| `extraKnownMarketplaces` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `fallbackModel` | [Model Settings](../configure/settings/model.md) |
| `fastMode` | [Model Settings](../configure/settings/model.md) |
| `fastModePerSessionOptIn` | [Model Settings](../configure/settings/model.md) |
| `feedbackDrafts` | [Settings Files and Scopes](../configure/settings/index.md) |
| `feedbackSurveyRate` | [Interface Settings](../configure/settings/ui.md) |
| `fileCheckpointingEnabled` | [Core Settings](../configure/settings/core.md) |
| `fileSuggestion` | [Core Settings](../configure/settings/core.md) |
| `footerLinksRegexes` | [Interface Settings](../configure/settings/ui.md) |
| `forceLoginGatewayUrl` | [Auth Settings](../configure/settings/auth.md) |
| `forceLoginMethod` | [Auth Settings](../configure/settings/auth.md) |
| `forceLoginOrgUUID` | [Auth Settings](../configure/settings/auth.md) |
| `forceRemoteSettingsRefresh` | [Enterprise Settings](../configure/settings/enterprise.md) |
| `gatewayInternalNetworks` | [Auth Settings](../configure/settings/auth.md) |
| `gcpAuthRefresh` | [Auth Settings](../configure/settings/auth.md) |
| `hooks` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `httpHookAllowedEnvVars` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `idleCompaction` | [Core Settings](../configure/settings/core.md) |
| `includeCoAuthoredBy` | [Core Settings](../configure/settings/core.md) |
| `includeGitInstructions` | [Core Settings](../configure/settings/core.md) |
| `inputNeededNotifEnabled` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `isolatePeerMachines` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `keybindingFlavor` | Not on a page yet |
| `language` | [Core Settings](../configure/settings/core.md) |
| `managedMcpServers` | [MCP and Channels Settings](../configure/settings/mcp-and-channels.md) |
| `managedSourcesBehavior` | [Enterprise Settings](../configure/settings/enterprise.md) |
| `maxEffortLevel` | [Settings Files and Scopes](../configure/settings/index.md) |
| `maxProseWidth` | [Interface Settings](../configure/settings/ui.md) |
| `minimumVersion` | [Core Settings](../configure/settings/core.md) |
| `model` | [Model Settings](../configure/settings/model.md) |
| `modelOverrides` | [Model Settings](../configure/settings/model.md) |
| `modelPicker` | [Model Settings](../configure/settings/model.md) |
| `modelPricing` | [Model Settings](../configure/settings/model.md) |
| `modelProposedGoals` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `modelSettings` | [Model Settings](../configure/settings/model.md) |
| `otelHeadersHelper` | [Auth Settings](../configure/settings/auth.md) |
| `outputStyle` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `parentSettingsBehavior` | [Enterprise Settings](../configure/settings/enterprise.md) |
| `permissions` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `plansDirectory` | [Core Settings](../configure/settings/core.md) |
| `pluginConfigs` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `pluginSuggestionMarketplaces` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `pluginTrustMessage` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `policyHelper` | [Enterprise Settings](../configure/settings/enterprise.md) |
| `policyHelpers` | [Enterprise Settings](../configure/settings/enterprise.md) |
| `prUrlTemplate` | [Interface Settings](../configure/settings/ui.md) |
| `precomputeCompactionEnabled` | [Core Settings](../configure/settings/core.md) |
| `preferredNotifChannel` | [Interface Settings](../configure/settings/ui.md) |
| `prefersReducedMotion` | [Interface Settings](../configure/settings/ui.md) |
| `prependPlugins` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `processWrapper` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `promptCacheTtl` | [Model Settings](../configure/settings/model.md) |
| `promptSuggestionEnabled` | [Interface Settings](../configure/settings/ui.md) |
| `proxyAuthHelper` | [Auth Settings](../configure/settings/auth.md) |
| `quietHours` | [Interface Settings](../configure/settings/ui.md) |
| `remote` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `remoteControl` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `remoteControlAtStartup` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `remoteTools` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `requiredMaximumVersion` | [Enterprise Settings](../configure/settings/enterprise.md) |
| `requiredMinimumVersion` | [Enterprise Settings](../configure/settings/enterprise.md) |
| `respectGitignore` | [Core Settings](../configure/settings/core.md) |
| `respondToBashCommands` | [Core Settings](../configure/settings/core.md) |
| `sandbox` | [Core Settings](../configure/settings/core.md) |
| `showClearContextOnPlanAccept` | [Interface Settings](../configure/settings/ui.md) |
| `showMessageTimestamps` | [Interface Settings](../configure/settings/ui.md) |
| `showThinkingSummaries` | [Model Settings](../configure/settings/model.md) |
| `showTurnDuration` | [Interface Settings](../configure/settings/ui.md) |
| `skillListingBudgetFraction` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `skillListingMaxDescChars` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `skillOverrides` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `skipAutoPermissionPrompt` | [Extra Keys and Global Config](../configure/settings/extra-keys.md) |
| `skipDangerousModePermissionPrompt` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `skipWebFetchPreflight` | [Core Settings](../configure/settings/core.md) |
| `skipWorkflowUsageWarning` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `spellcheck` | [Interface Settings](../configure/settings/ui.md) |
| `spinnerTipsEnabled` | [Interface Settings](../configure/settings/ui.md) |
| `spinnerTipsOverride` | [Interface Settings](../configure/settings/ui.md) |
| `spinnerVerbs` | [Interface Settings](../configure/settings/ui.md) |
| `sshConfigs` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `sshHostCommands` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `statusLine` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `strictKnownMarketplaces` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `strictPluginOnlyCustomization` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `subagentPromptCacheTtl` | [Model Settings](../configure/settings/model.md) |
| `subagentStatusLine` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `switchModelsOnFlag` | [Model Settings](../configure/settings/model.md) |
| `syncClaudeAiPlugins` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `syncClaudeAiSkills` | [Hooks, Plugins, and Skills Settings](../configure/settings/hooks-and-plugins.md) |
| `syntaxHighlightingDisabled` | [Interface Settings](../configure/settings/ui.md) |
| `taskOutputMaxChars` | Not on a page yet |
| `teammateMode` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `terminalProgressBarEnabled` | [Interface Settings](../configure/settings/ui.md) |
| `terminalTitleFromRename` | [Interface Settings](../configure/settings/ui.md) |
| `theme` | [Interface Settings](../configure/settings/ui.md) |
| `timeFormat` | [Interface Settings](../configure/settings/ui.md) |
| `timeZone` | [Interface Settings](../configure/settings/ui.md) |
| `todoFeatureEnabled` | [Core Settings](../configure/settings/core.md) |
| `totalTokensReminder` | [Model Settings](../configure/settings/model.md) |
| `totalTokensReminderAfterUserTurn` | [Model Settings](../configure/settings/model.md) |
| `totalTokensReminderBudget` | [Model Settings](../configure/settings/model.md) |
| `tui` | [Settings Files and Scopes](../configure/settings/index.md) |
| `ultracode` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `useAutoModeDuringPlan` | [Extra Keys and Global Config](../configure/settings/extra-keys.md) |
| `verbose` | [Interface Settings](../configure/settings/ui.md) |
| `viewMode` | [Interface Settings](../configure/settings/ui.md) |
| `vimInsertModeRemaps` | [Interface Settings](../configure/settings/ui.md) |
| `voice` | [Extra Keys and Global Config](../configure/settings/extra-keys.md) |
| `voiceEnabled` | [Extra Keys and Global Config](../configure/settings/extra-keys.md) |
| `wheelScrollAccelerationEnabled` | [Interface Settings](../configure/settings/ui.md) |
| `workflowKeywordTriggerEnabled` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `workflowSizeGuideline` | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| `worktree` | [Core Settings](../configure/settings/core.md) |
| `wslInheritsWindowsSettings` | [Enterprise Settings](../configure/settings/enterprise.md) |
| `xaaIdp` | [Auth Settings](../configure/settings/auth.md) |

## Slash Commands

Items: 142.

| Item | Where |
| --- | --- |
| `/add-dir` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/advisor` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/agents` | Not on a page yet |
| `/artifact-capabilities` | Not on a page yet |
| `/artifact-components` | Not on a page yet |
| `/artifact-design` | Not on a page yet |
| `/artifact-diagramming` | Not on a page yet |
| `/artifacts` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/auto-mode-setup` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/autocompact` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/autofix-pr` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/background` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/batch` | Not on a page yet |
| `/branch` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/brief` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/btw` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/bug` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/cd` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/chrome` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/claim-credit` | Not on a page yet |
| `/claude-api` | Not on a page yet |
| `/claude-code-docs` | Not on a page yet |
| `/claude-in-chrome` | Not on a page yet |
| `/clear` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/cloud-plugins` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/code-review` | Not on a page yet |
| `/color` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/commit` | Not on a page yet |
| `/commit-push-pr` | Not on a page yet |
| `/compact` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/config` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/context` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/copy` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/cowork-plugin` | Not on a page yet |
| `/daemon` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/dataviz` | Not on a page yet |
| `/debug` | Not on a page yet |
| `/design` | Not on a page yet |
| `/design-consent` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/design-login` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/design-revoke` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/design-sync` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/desktop` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/diff` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/doctor` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/effort` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/exit` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/explain-usage` | Not on a page yet |
| `/export` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/extra-usage` | Not on a page yet |
| `/fast` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/feedback` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/fewer-permission-prompts` | Not on a page yet |
| `/focus` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/fork` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/goal` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/heapdump` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/help` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/hooks` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/ide` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/import` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/init` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/insights` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/install` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/install-github-app` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/install-slack-app` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/keybindings` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/keybindings-help` | Not on a page yet |
| `/limit-reset` | Not on a page yet |
| `/list-agents` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/login` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/logout` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/loop` | Not on a page yet |
| `/loops` | Not on a page yet |
| `/low-priority` | Not on a page yet |
| `/mcp` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/memory` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/memory-types` | Not on a page yet |
| `/mobile` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/model` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/output-style` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/passes` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/pause-memory` | Not on a page yet |
| `/permissions` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/plan` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/plugin` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/powerup` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/pr` | Not on a page yet |
| `/privacy-settings` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/pro-trial-expired` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/prototype` | Not on a page yet |
| `/radio` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/rate-limit-options` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/recap` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/release-notes` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/reload-plugins` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/reload-skills` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/remote-control` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/remote-env` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/rename` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/restart` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/resume` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/rewind` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/run` | Not on a page yet |
| `/run-skill-generator` | Not on a page yet |
| `/sandbox` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/schedule` | Not on a page yet |
| `/scroll-speed` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/security-review` | Not on a page yet |
| `/session` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/setup-bedrock` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/setup-claude` | Not on a page yet |
| `/setup-vertex` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/simplify` | Not on a page yet |
| `/skill-doctor` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/skills` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/status` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/statusline` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/stickers` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/stop` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/subtask` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/tasks` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/team-onboarding` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/teleport` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/terminal-setup` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/theme` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/tui` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/ultraplan` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/ultrareview` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/update-config` | Not on a page yet |
| `/upgrade` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/usage` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/usage-credits` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/verify` | Not on a page yet |
| `/version` | Not on a page yet |
| `/voice` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/web-setup` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/wellbeing` | Not on a page yet |
| `/workflow-authoring` | Not on a page yet |
| `/workflow-launch-exec` | Not on a page yet |
| `/workflows` | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/workshop` | Not on a page yet |

## Subcommands

Items: 71.

| Item | Where |
| --- | --- |
| `add` | Not on a page yet |
| `agents` | Not on a page yet |
| `apply-project-settings` | Not on a page yet |
| `auth` | Not on a page yet |
| `auth login` | Not on a page yet |
| `auth logout` | Not on a page yet |
| `auth status` | Not on a page yet |
| `auto-mode` | Not on a page yet |
| `auto-mode config` | Not on a page yet |
| `auto-mode critique` | Not on a page yet |
| `auto-mode defaults` | Not on a page yet |
| `auto-mode reset` | Not on a page yet |
| `design-login` | [Subcommands](../configure/cli/subcommands.md) |
| `doctor` | Not on a page yet |
| `drop-worktree-registrations` | [Subcommands](../configure/cli/subcommands.md) |
| `edit-chrome-settings` | [Subcommands](../configure/cli/subcommands.md) |
| `edit-hook` | Not on a page yet |
| `edit-memory-settings` | [Subcommands](../configure/cli/subcommands.md) |
| `edit-permission-rules` | [Subcommands](../configure/cli/subcommands.md) |
| `edit-sandbox-settings` | [Subcommands](../configure/cli/subcommands.md) |
| `edit-skill-overrides` | [Subcommands](../configure/cli/subcommands.md) |
| `gateway` | Not on a page yet |
| `import` | Not on a page yet |
| `import-conversations` | Not on a page yet |
| `install` | Not on a page yet |
| `mcp` | Not on a page yet |
| `mcp add-from-claude-desktop` | Not on a page yet |
| `mcp add-json` | Not on a page yet |
| `mcp get` | Not on a page yet |
| `mcp list` | Not on a page yet |
| `mcp login` | Not on a page yet |
| `mcp logout` | Not on a page yet |
| `mcp remove` | Not on a page yet |
| `mcp reset-project-choices` | Not on a page yet |
| `mcp serve` | Not on a page yet |
| `plugin` | Not on a page yet |
| `plugin configure` | Not on a page yet |
| `plugin details` | Not on a page yet |
| `plugin disable` | Not on a page yet |
| `plugin enable` | Not on a page yet |
| `plugin eval` | Not on a page yet |
| `plugin eval init` | Not on a page yet |
| `plugin init` | Not on a page yet |
| `plugin install` | Not on a page yet |
| `plugin list` | Not on a page yet |
| `plugin marketplace` | Not on a page yet |
| `plugin marketplace add` | Not on a page yet |
| `plugin marketplace list` | Not on a page yet |
| `plugin marketplace remove` | Not on a page yet |
| `plugin marketplace update` | Not on a page yet |
| `plugin prune` | Not on a page yet |
| `plugin tag` | Not on a page yet |
| `plugin test` | Not on a page yet |
| `plugin uninstall` | Not on a page yet |
| `plugin update` | Not on a page yet |
| `plugin validate` | Not on a page yet |
| `project` | [All Flags](../configure/cli/flags.md) |
| `purge` | Not on a page yet |
| `remote-control` | Not on a page yet |
| `sandbox` | Not on a page yet |
| `sandbox install` | Not on a page yet |
| `sandbox status` | Not on a page yet |
| `sandbox uninstall` | Not on a page yet |
| `setup-token` | Not on a page yet |
| `ultrareview` | Not on a page yet |
| `update` | Not on a page yet |
| `xaa` | Not on a page yet |
| `xaa clear` | Not on a page yet |
| `xaa login` | Not on a page yet |
| `xaa setup` | Not on a page yet |
| `xaa show` | Not on a page yet |

## Tools

Items: 89.

| Item | Where |
| --- | --- |
| `Agent` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `AppifactRepl` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `Artifact` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `ArtifactCheck` | Not on a page yet |
| `ArtifactComments` | Not on a page yet |
| `ArtifactData` | Not on a page yet |
| `AskUserQuestion` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `Bash` | [Tools](tools/index.md) |
| `ClaudeDesign` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `CronCreate` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `CronDelete` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `CronList` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `DesignSync` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `Edit` | [Files, Search, and Memory](tools/files.md) |
| `EndConversation` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `EnterPlanMode` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `EnterWorktree` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `ExitPlanMode` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `ExitWorktree` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `FetchInboxMessage` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `GetTask` | [Tools](tools/index.md) |
| `Glob` | [Files, Search, and Memory](tools/files.md) |
| `Grep` | [Files, Search, and Memory](tools/files.md) |
| `LSP` | [Files, Search, and Memory](tools/files.md) |
| `ListAgents` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `ListConnectors` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `ListMcpResourcesTool` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `ListPlugins` | Not on a page yet |
| `ListSkills` | Not on a page yet |
| `MonitorTool` | Not on a page yet |
| `NotebookEdit` | [Files, Search, and Memory](tools/files.md) |
| `OfferChromeSetup` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `Poll` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `PowerShell` | [Tools](tools/index.md) |
| `Projects` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `ProposeGoal` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `PublishPlugin` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `PushNotification` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `Read` | [Files, Search, and Memory](tools/files.md) |
| `ReadMcpResourceDirTool` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `ReadMcpResourceTool` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `ReadNotifications` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `RefreshMcpTools` | Not on a page yet |
| `RemoteTrigger` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `ReportFindings` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `ScheduleWakeup` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `SearchMcpRegistry` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `SearchPlugins` | Not on a page yet |
| `SearchSkills` | Not on a page yet |
| `SendFeedback` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `SendFile` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `SendMessage` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `SendUserFile` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `SendUserMessage` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `ShareOnboardingGuide` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `ShowOnboardingRolePicker` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `Skill` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `SuggestConnectors` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `SuggestPluginInstall` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `SuggestSkills` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `TaskCreate` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `TaskGet` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `TaskList` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `TaskStop` | [Tools](tools/index.md) |
| `TaskUpdate` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `TodoWrite` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `ToolSearch` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `WaitForMcpServers` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `WebFetch` | [Tools](tools/index.md) |
| `WebSearch` | [Tools](tools/index.md) |
| `Workflow` | [Agents, Tasks, and Planning](tools/agents-and-tasks.md) |
| `Write` | [Files, Search, and Memory](tools/files.md) |
| `enable__mcp__claude-in-chrome` | Not on a page yet |
| `enable__mcp__remote-devices__Claude_Browser` | Not on a page yet |
| `enable__mcp__remote-devices__computer` | Not on a page yet |
| `memory_list` | [Files, Search, and Memory](tools/files.md) |
| `memory_read` | [Files, Search, and Memory](tools/files.md) |
| `memory_write` | [Files, Search, and Memory](tools/files.md) |
| `propose_skills` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `request_computer` | Not on a page yet |
| `self_hosted_runner_get_pool` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `self_hosted_runner_list_runners` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `self_hosted_runner_list_secrets` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `self_hosted_runner_list_sessions` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `self_hosted_runner_read_health` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `self_hosted_runner_read_metrics` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `self_hosted_runner_requeue_session` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `self_hosted_runner_spawn_local` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
| `self_hosted_runner_tail_log` | [Gated and Surface-Specific Tools](tools/gated-and-other.md) |
