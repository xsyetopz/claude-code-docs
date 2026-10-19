# Proposal: Agent Access

## Why

User: "providing an MCP for "claude-code-docs" would be nice, too, that users can install on their system,
complementary to a lightweight `claude-code-docs` skill. /skill-creator and /mcp-builder will help."
"llms-full.txt and llms.txt will also help: https://llmstxt.org/"
User choice on MCP content source: "Both" (bundled snapshot plus optional refresh from the published site).

## What Changes

- `llms.txt` and `llms-full.txt` generated at build, served at the site root (llmstxt.org format), plus per-page `.md`.
- MCP server `claude-code-docs` (stdio): search, read page, list sections, get schema; bundled snapshot, optional refresh.
- Lightweight `claude-code-docs` skill: when to consult the docs and how (MCP tools if present, else llms.txt URLs).
- Both shipped as a Claude Code plugin in this repo (`/plugin marketplace add xsyetopz/claude-code-docs`, then `/plugin install cc-docs@claude-code-docs`).
  The plugin is named `cc-docs` because names that start with `claude-` are reserved; the marketplace, MCP server, and skill keep the name `claude-code-docs`.
