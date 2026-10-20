# Proposal: Track Claude Code 2.1.305

## Why

User (verbatim, 2026-10-21): "Website to be moved to 2.1.305: https://github.com/anthropics/claude-code/releases/tag/v2.1.305 time to dig into the binary!"

The site tracks one release (`src/version.ts`). 2.1.305 shipped 2026-10-20 and is installed locally
(`~/.local/share/claude/versions/2.1.305`; 2.1.304 is still there for diffing).

## What Changes

- Bump `CLAUDE_CODE_VERSION` and every "2.1.304" claim that is a version label (not a historical note) to 2.1.305.
- Regenerate `schemas/` from the 2.1.305 binary (`bun run schemas`); document new/removed/changed keys.
- Recapture prompts with the 2.1.305 binary (fake key + local stub only, `tools/capture-prompts/`); re-render; review diffs.
- Apply release-note changes that touch documented surfaces, citing the
  [v2.1.305 release](https://github.com/anthropics/claude-code/releases/tag/v2.1.305). Candidates:
  `sandbox.allowNestedUserNamespaces`, `CLAUDE_CODE_RETRY_WATCHDOG_USAGE_LIMIT_RECHECK_MS`, tool search retry
  fallback, `modelOverrides` case/`[1m]` matching, `ENOSPC` Bash error, `/usage` fixes (`f` key), startup warnings
  to debug log, `allowedMcpServers` vs `managed-mcp.json` `${VAR}` env, `allowManagedPermissionRulesOnly` and
  Desktop-mounted plugin `allowed-tools`, `/artifacts` delete keys, mod `Image` in iTerm2, mod docked pane 45% width,
  Remote Control spawn-mode messages, screen reader mode text.
- Diff 2.1.304 vs 2.1.305 binaries for undocumented changes (env vars, flags, settings, commands, gates, mod API).
- CHANGELOG entry; plugin snapshot/version.
