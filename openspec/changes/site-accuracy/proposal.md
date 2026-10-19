# Proposal: Site Accuracy Follow-Up

## Why

`site-launch` shipped with known gaps: the plugins and MCP pages were never fact-checked against the sources, and a few small items were left unresolved. Fixing them before publishing keeps the site trustworthy.

## What Changes

- Fact-check `docs/extend/plugins/` and `docs/extend/mcp/` against SRC wiki pages; fix errors.
- Split the combined hook env var row in `docs/reference/undocumented.md`.
- Resolve or clearly mark: Vim `%` row page name, `GZIP_DATADOG_LOGS` default, `/restart` gate.
- Same rules as the archived `site-launch` design (D1-D9): Simple English, Chicago Title Case, badges, bun 1.4.3, `bun run verify:locked` only.

## Out of Scope

Pushing to GitHub, new pages, visual redesign.
