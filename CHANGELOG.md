# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The site documents Claude Code `2.1.307`, the only release it tracks. The version of the site itself is set in `package.json`, and the tracked Claude Code version is set in `src/version.ts`.

## [Unreleased]

### Added

- A second plugin, `cc-inspect`, with an MCP server and a skill that read your session transcripts (list, read, search, and check each line against the transcript schema) and the installed Claude Code binary (installs, modules, search, read, and the keys of an object literal or an OpenTelemetry event).
- The exact fields of every payload, made from the program: the Mod API type file (`schemas/claude-code.d.ts`) and 11 more JSON Schemas (hook output, built-in tools, control protocol, stream-json, `--agents` JSON, `.mcp.json`, frontmatter, status line input, transcript lines, OpenTelemetry, `~/.claude.json`). The MCP server's `get_schema` serves them all, and looks up types, `$` calls, and events in the type file.
- A rule for agents in the skill and the docs: look a field up in these files before stating it, and name only the fields found there.
- A Context Budget page with live `/context` measurements: an empty session, the first turn, the cost of each tool, and best practices.
- An Override a Prompt page, and captures of about 30 more prompts (built-in agents, commands, bundled skills, hooks, the auto mode classifier, compaction).
- Overview pages for each top-level section, so breadcrumbs link back.
- Prompt pages that show what you can override and its default text: Tool Descriptions (every tool's description and input schema), Built-In Agents, and Built-In Skills.
- Status labels (Managed Only, Experimental, Deprecated, Caution) in place of emoji markers, and screen-reader text for ✅ and ❌.
- A `check:examples` gate that runs Biome on code examples, and `check-docs` rules for code spans in headings and admonition titles.
- An unofficial docs site for Claude Code `2.1.307`, with pages for start, configure, extend, prompts, reference, and how it works.
- Provenance badges (Documented, Undocumented, Differs, and Gated) that mark each item.
- A style guide for contributors in `docs/contributing/`.
- Capture and check tools in `tools/`, and a GitHub Pages deploy workflow.

### Changed

- Diagrams render after the fonts load, scroll sideways on small screens instead of shrinking, and keep lines out of labels.
- Merged duplicated rows into one home per item, with links from other pages.
- Code examples follow `biome.json`, including arrow functions.
- Updated to Claude Code `2.1.307`.
- Refreshed the design with IBM Plex Mono for code, a capped prose width, and quieter tables that scroll on mobile.
- Made the badge shapes read without color, and added brand-style admonitions.
- Added a hero to the overview page.

### Fixed

- Settled most "Not Verified" items with live probes (print mode, interactive, and the program), and corrected the wrong ones.
- Corrected the plugin, MCP, and reference pages after checking them against sources.
- Split the hook environment variable rows in the Undocumented index, and marked `prependPlugins` and `appendPlugins` as differing from the docs.
- Fixed the dark-mode colors and the announcement bar.
- Corrected the default of `CLAUDE_CODE_GZIP_DATADOG_LOGS`, and documented when `/restart` shows and how it works.
- Corrected the variable counts of three environment variable pages and the section total, the managed-only key count, and the SchemaStore comparison table.
