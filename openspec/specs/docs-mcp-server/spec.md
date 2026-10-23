# docs-mcp-server Specification

## Purpose
Serve the Claude Code Docs and the platform docs to agents over MCP with a small tool list, fast first answers, and an offline fallback.

## Requirements

### Requirement: Four Tools

The `cc-docs` MCP server SHALL offer exactly four tools: `search_docs`, `read_page`, `list_pages`, and `get_schema`.
`search_docs`, `read_page`, and `list_pages` SHALL take an optional `source` of `"docs"` (the default, the Claude Code Docs) or `"platform"` (platform.claude.com/docs).
The tools `search_platform_docs`, `read_platform_page`, and `list_platform_pages` SHALL no longer exist.

#### Scenario: Platform search through source

- **WHEN** an agent calls `search_docs` with `query: "prompt caching"` and `source: "platform"`
- **THEN** the reply lists platform docs pages, as `search_platform_docs` did before

#### Scenario: Old tool name

- **WHEN** a client lists the tools
- **THEN** no tool name contains `platform`

### Requirement: Small Tool List

The `tools/list` reply of the server SHALL be at most 40% (proposed) of the 15,468 bytes measured on 2026-10-23 for the 7 tools.
A test SHALL measure it.

#### Scenario: Size test

- **WHEN** the test starts the built server and requests `tools/list`
- **THEN** the reply size is at most 40% of 15,468 bytes

### Requirement: Answers Kept

Every question in `plugin/mcp/evaluation.xml` SHALL be answerable with the new tools, and the file SHALL name only the new tools.

#### Scenario: Evaluation file

- **WHEN** the evaluation questions run against the server
- **THEN** each expected answer appears in a tool reply

### Requirement: Prebuilt Index

The site build SHALL publish a search index file beside `llms-manifest.json`, with the site version and a content hash.
The first `search_docs` call with `source: "docs"` SHALL fetch that one file, and SHALL NOT fetch each page.
When the index file cannot be fetched and none is cached, the server SHALL fall back to building the index from pages, as it does today.

#### Scenario: First search

- **WHEN** a fresh server with an empty cache answers its first `search_docs` call
- **THEN** it makes one request for the index file and no request for a page `.md` file

#### Scenario: Old site without an index

- **WHEN** the index file returns 404
- **THEN** the search still answers, from pages, and the `Source:` line says so

### Requirement: Source Line and Offline Cache

Each reply SHALL end with a `Source:` line that says whether the text is live, from the cache, or stale from the cache while offline.
When the network fails, the server SHALL answer from the disk cache in `CC_DOCS_CACHE_DIR`, `CLAUDE_PLUGIN_DATA`, or `~/.cache/claude-code-docs`, in that order.

#### Scenario: Offline read

- **WHEN** a page was read once and the network is then down
- **THEN** `read_page` returns the cached text and a `Source:` line that says offline

### Requirement: No Bin Folder

The `cc-docs` plugin SHALL have no `bin/` folder, so claude.ai and Cowork can still install it.

#### Scenario: Plugin check

- **WHEN** `bun run plugin:check` runs
- **THEN** it fails if `plugin/bin/` exists
