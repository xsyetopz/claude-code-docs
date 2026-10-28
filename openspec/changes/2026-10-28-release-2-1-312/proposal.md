# Proposal: Release Claude Code 2.1.312

## Why

The site tracks `2.1.311`. [`2.1.312`](https://github.com/anthropics/claude-code/releases/tag/v2.1.312) shipped 2026-10-27.
The user asks for full coverage of `2.1.312`: every item a user can reach or configure gets a page or a row, with no gap left.

## What Changes

- Run the runbook in `tools/release/README.md` from `2.1.311` to `2.1.312`.
- Update pages for every item in `captures/2.1.312/diff/report.md`: added and removed env vars, flags, commands, settings, hooks, gates, endpoints, and error texts.
- Update pages for each release-note item that a user can use or configure, after a check in the program or a probe:
  - `oidc.user_id_claim` in the Claude apps gateway settings.
  - The `Write` tool rule for a very large `CLAUDE.md`, rules file, or `@`-included file in a subdirectory.
  - Per-directory and `paths:` skills found after a Bash `cd` deeper into a repository.
  - A command with an invalid name no longer stops every command from loading.
  - The effort level that the spinner, the OpenTelemetry `effort` values, and the transcript report during a task.
  - `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0` and the shorter system prompt for unrecognized model names. Mantle, which the release note lists beside Bedrock, Vertex, and Foundry, is an endpoint of Amazon Bedrock that the site already documents.
  - `CLAUDE_CODE_DISABLE_REFUSAL_FALLBACK=1` and automatic model switches for unrecognized model names.
  - The prompt and agent hook concurrency caps: 24 for each session, sub-agents included, plus 12 that have waited longer than their event timeout, and a `timeout` under 1 second counted as 1 second.
  - A subagent's `autoCompactWindow` lowering the window from `CLAUDE_CODE_AUTO_COMPACT_WINDOW`.
  - The OpenTelemetry `mcp_server.name` value for a fixed-URL remote MCP server from the official Anthropic marketplace.
  - The `claude_code.safety_event` OpenTelemetry event, which the release note calls removed. The event is still in the program, and its server-side gate `tengu_snoopy_creek` now defaults to `false`, so it is off by default.
  - The vim-mode `d`, `c`, and `y` operators with a `gj` or `gk` count.
  - The short `/verify` description in `/help` and the command menu.
  - Click to send in fullscreen.
  - The "5-hour limit" wording in usage limit messages.
- Regenerate `schemas/`, the surface snapshot, the Surface Coverage page, and `docs/prompts/`.
- Change current-behavior labels from `2.1.311` to `2.1.312` after a check of each.
  Move the `2.1.311` section to the Release Archive, and write the `2.1.312` section.
- Run the live probes and the managed probes.
- Bump `src/version.ts` last, then bump the plugins, and add the `CHANGELOG.md` entry.
- Left out: VS Code, Cloud sessions, Remote Control, Claude Tag, Code Review, and mobile, which this site does not cover.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. `tracked-release-docs` already sets the release rules, and this change applies them to `2.1.312`.

## Impact

`docs/`, `tools/surface/`, `tools/release/claims/map.json`, `schemas/`, `src/version.ts`, the plugin versions, and `CHANGELOG.md`.
