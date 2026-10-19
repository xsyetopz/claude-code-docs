# Proposal: Config Schemas

## Why

User: "provide repo-level schemas/ for the claude-code-settings claude-code-managed-settings and other possible
`$schema`-ble files schemastore.org doesn't cover, or are too outdated. direct exports from the CC binary itself."

Claude Code 2.1.303 validates five file kinds with zod objects that accept a `$schema` key (evidence: SRC strings.txt):
settings.json (user/project/local and managed), `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`,
plugin `hooks/hooks.json`, and `keybindings.json`. schemastore.org copies lag (e.g. missing `syncClaudeAiSkills`).

## What Changes

- `schemas/` at repo root: one JSON Schema per file kind, generated from the binary's own zod schemas.
- `tools/schemas/`: the reproducible generator.
- Schemas are also served by the site (GitHub Pages) at `/claude-code-docs/schemas/<name>.json` so `$schema` URLs work.
- A docs page that lists the schemas, the URL to put in `$schema`, and how they were made.

## Out of Scope

Files with no zod validator in the binary (`.mcp.json`, `~/.claude.json`, statusLine, skill/agent/output-style frontmatter).
Submitting to schemastore.org.
