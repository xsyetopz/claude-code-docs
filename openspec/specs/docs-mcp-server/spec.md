# Docs-Mcp-Server Specification

## Purpose
Serve four doc sources (clawdipedia, platform, code, and anthropic) to agents over MCP with a small tool list, fast first answers, and an offline fallback.

## Requirements

### Requirement: Four Tools

The `clawdipedia-docs` MCP server SHALL offer exactly four tools: `search_docs`, `read_page`, `list_pages`, and `get_schema`.
`search_docs`, `read_page`, and `list_pages` SHALL take an optional `source`: `"clawdipedia"` (the default, the unofficial Claude Code Docs), `"platform"` (platform.claude.com/docs), `"code"` (code.claude.com/docs), or `"anthropic"` (www.anthropic.com, which has news, research, and legal pages). The values SHALL come from one list, `DOC_SOURCES`.
The value `"docs"` SHALL be rejected.
The MCP server key in `plugin/.mcp.json` SHALL be `docs`, so the tool names at run time are `mcp__plugin_clawdipedia-docs_docs__<tool>`.
The tools `search_platform_docs`, `read_platform_page`, and `list_platform_pages` SHALL no longer exist.

#### Scenario: Platform Search through Source

- **WHEN** an agent calls `search_docs` with `query: "prompt caching"` and `source: "platform"`
- **THEN** the reply lists platform docs pages, as `search_platform_docs` did before

#### Scenario: Other Sources

- **WHEN** an agent calls `search_docs` with `source: "code"` or `source: "anthropic"`
- **THEN** the reply lists pages of that source

#### Scenario: Old Source Value

- **WHEN** an agent calls `search_docs` with `source: "docs"`
- **THEN** the call fails input validation

#### Scenario: Old Tool Name

- **WHEN** a client lists the tools
- **THEN** no tool name contains `platform`

### Requirement: Small Tool List

The `tools/list` reply of the server SHALL be at most 40% (proposed) of the 15,468 bytes measured on 2026-10-23 for the 7 tools.
A test SHALL measure it.

#### Scenario: Size Test

- **WHEN** the test starts the built server and requests `tools/list`
- **THEN** the reply size is at most 40% of 15,468 bytes

### Requirement: Answers Kept

Every question in `plugin/mcp/evaluation.xml` SHALL be answerable with the new tools, and the file SHALL name only the new tools.

#### Scenario: Evaluation File

- **WHEN** the evaluation questions run against the server
- **THEN** each expected answer appears in a tool reply

### Requirement: Prebuilt Index

The site build SHALL publish a search index file beside `llms-manifest.json`, with the site version and a content hash.
The first `search_docs` call with `source: "clawdipedia"` SHALL fetch that one file, and SHALL NOT fetch each page.
When the index file cannot be fetched and none is cached, the server SHALL fall back to building the index from pages, as it does today.

#### Scenario: First Search

- **WHEN** a fresh server with an empty cache answers its first `search_docs` call
- **THEN** it makes one request for the index file and no request for a page `.md` file

#### Scenario: Old Site without an Index

- **WHEN** the index file returns 404
- **THEN** the search still answers, from pages, and the `Source:` line says so

### Requirement: Source Line and Offline Cache

Each reply SHALL end with a `Source:` line that says whether the text is live, from the cache, or stale from the cache while offline.
When the cache is over its cap, the server SHALL delete pages of platform, code, and anthropic first, then site pages and schemas, and never the index files.
When the network fails, the server SHALL answer from the disk cache in `CLAWDIPEDIA_CACHE_DIR`, `CLAUDE_PLUGIN_DATA`, or `~/.cache/clawdipedia`, in that order.

#### Scenario: Offline Read

- **WHEN** a page was read once and the network is then down
- **THEN** `read_page` returns the cached text and a `Source:` line that says offline

### Requirement: No Bin Folder

The `clawdipedia-docs` plugin SHALL have no `bin/` folder, so claude.ai and Cowork can still install it.

#### Scenario: Plugin Check

- **WHEN** `bun run plugin:check` runs
- **THEN** it fails if `plugin/bin/` exists
