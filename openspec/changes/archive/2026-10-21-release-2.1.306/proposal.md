# Proposal: Release Claude Code 2.1.306

## Why

[v2.1.306](https://github.com/anthropics/claude-code/releases/tag/v2.1.306) shipped 2026-10-21 and is installed
locally (`~/.local/share/claude/versions/2.1.306`; 2.1.305 still there). First release done with the repo-local
release toolkit (`tools/release/README.md`).

Release notes (2 bug fixes):

- Fixed `claude -p` inside cloud sessions reporting "Not logged in" when started without the session's environment variables
- Fixed an API error being replaced by "prompt is too long", and an unneeded compaction, in sessions with many MCP tools

## What Changes

- Run `bun run release:all -- --from 2.1.305 --to 2.1.306` (runbook steps 1-8); read diff report and compare worklist.
- Update docs pages for any worklist items and release-note fixes that touch documented surfaces.
- Bump `src/version.ts` and version labels to 2.1.306 (step 12); regenerate schemas; verify; review; commit.
- Steps 9 (managed, sudo) and 10 (live, quota) only if the user asks.
