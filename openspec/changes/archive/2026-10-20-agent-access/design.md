# Design: Agent Access

## D1. llms.txt

Build step (Docusaurus plugin `postBuild` or script in `tools/llms/`) writes to the build output:
`llms.txt` (H1 site name, blockquote summary, H2 sections mirroring the sidebar, `- [Title](url.md): description`),
`llms-full.txt` (all pages as clean markdown in sidebar order), and `<page>.md` next to each HTML page.
Markdown is derived from the MDX source with components turned into text (badges -> `[Documented]`, FileTree -> list, etc.).
Absolute URLs under `https://xsyetopz.github.io/claude-code-docs/`. Deterministic. check: links in llms.txt resolve.

## D2. Plugin Layout

Repo root `.claude-plugin/marketplace.json` (marketplace `claude-code-docs`, plugin entry `cc-docs`: `claude-` names are reserved), plugin dir `plugin/`:
`.claude-plugin/plugin.json`, `skills/claude-code-docs/SKILL.md`, `.mcp.json`, `mcp/` (server source + bundled `snapshot/`).
Use `$schema` from our own `schemas/` URLs. Validate manifests with `bun run schemas:check`-style fixtures.

## D3. MCP Server

Follow `.claude/skills/mcp-builder/SKILL.md`. TypeScript, official MCP SDK, stdio, runs with `node` (no bun required for users).
Tools (read-only, annotated): `search_docs(query, limit)`, `read_page(path)`, `list_pages(section?)`,
`get_schema(name)`. Content: bundled snapshot (pages as markdown + schemas) generated from the build;
`refresh` from the site's llms-full.txt into a user cache dir only when enabled (env `CLAUDE_CODE_DOCS_REFRESH=1` or tool arg),
with timeout and fallback to the snapshot. Small, no telemetry, no network by default.
Evaluate with mcp-builder's evaluation guidance.

## D4. Skill

Follow `.claude/skills/skill-creator/SKILL.md`. Short SKILL.md: trigger = questions about Claude Code settings, env vars,
hooks, internals, undocumented behavior; method = MCP tools if available, else fetch llms.txt / page `.md`;
always state the version (2.1.303) and the badge meaning.

## D5. Docs

A docs page `docs/start/use-with-agents.md` (or similar): llms.txt URLs, plugin install, MCP config for other clients.
