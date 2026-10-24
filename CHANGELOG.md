# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The site documents Claude Code `2.1.310`, the only release it tracks. The version of the site itself is set in `package.json`, and the tracked Claude Code version is set in `src/version.ts`.

## [Unreleased]

### Added

- A second plugin, `cc-inspect`, with an MCP server and a skill that read your session transcripts (list, read, search, and check each line against the transcript schema) and the installed Claude Code binary (installs, modules, search, read, and the keys of an object literal or an OpenTelemetry event).
- `cc-inspect` 0.3.0: a `list_surface` tool that lists the items of one kind in the installed binary (environment variables, flags, subcommands, slash commands, settings, hook events, gates, tools, OpenTelemetry events, Mod API calls and events, keybindings, models, betas, endpoints, files, permission modes, and error texts), with a name filter and paging. Without a kind, it gives the count of each kind. Error texts from bundled CommonJS library modules are left out. Those from ES-module libraries are still listed.
- A surface snapshot of the program (`schemas/surface.json`, made by `bun run surface`) that `schemas:check` compares with a fresh run, and a `surface:check` script that lists the items no page maps yet. A generated Surface Coverage page lists every item with its page, and the Undocumented Items page shows the count of each kind.
- The exact fields of every payload, made from the program: the Mod API type file (`schemas/claude-code.d.ts`) and 11 more JSON Schemas (hook output, built-in tools, control protocol, stream-json, `--agents` JSON, `.mcp.json`, frontmatter, status line input, transcript lines, OpenTelemetry, `~/.claude.json`). The MCP server's `get_schema` serves them all, and looks up types, `$` calls, and events in the type file.
- A rule for agents in the skill and the docs: look a field up in these files before stating it, and name only the fields found there.
- A Context Budget page with live `/context` measurements: an empty session, the first turn, the cost of each tool, and best practices.
- An Override a Prompt page, and captures of about 30 more prompts (built-in agents, commands, bundled skills, hooks, the auto mode classifier, compaction).
- Overview pages for each top-level section, so breadcrumbs link back.
- Prompt pages that show what you can override and its default text: Tool Descriptions (every tool's description and input schema), Built-In Agents, and Built-In Skills.
- Status labels (Managed Only, Experimental, Deprecated, Caution) in place of emoji markers, and screen-reader text for ✅ and ❌.
- A `check:examples` gate that runs Biome on code examples, and `check-docs` rules for code spans in headings and admonition titles.
- An unofficial docs site for Claude Code `2.1.310`, with pages for start, configure, extend, prompts, reference, and how it works.
- Provenance badges (Documented, Undocumented, Differs, and Gated) that mark each item.
- A style guide for contributors in `docs/contributing/`.
- Capture and check tools in `tools/`, and a GitHub Pages deploy workflow.
- A third plugin, `cc-docs-cli` 1.0.0: a `cc-docs` command (`search`, `read`, `list`, `schema`, with `--source`, `--section`, `--limit`, and `--json`) that the Bash tool runs, plus a skill. It has no MCP server, so it adds no tool list to the context. It shares its code with the `cc-docs` server.
- `cc-inspect` 0.4.0 reads a release from its code: `code` `prepare` cleans each module of a version (stable local names) into a cache, `release` `diff` lists the functions changed, added, and gone between two versions, `release` `notes` marks each release-notes line as matched, gated, or unmatched against that diff, `release` `explain` gives where a name's code is, who uses it, what guards it, and whether it is a no-op, a stub, or handled, and `code` `find` finds code by plain words. Two MCP prompts, `release_review` and `explain_change`, give an agent the steps. `release:all` runs the new `release:clean` step.
- The site build writes `llms-search-index.json`, a prebuilt search index of every page. `cc-docs` and `cc-docs-cli` load it in one request in place of fetching each page.

### Changed

- **Breaking:** `cc-inspect` 0.4.0 has 4 tools in place of 12, each with an `action` or a `kind` and a one-sentence description: `sessions` (list, read, search, validate), `code` (installs, modules, search, read, prepare, find), `surface` (each surface kind, plus `object-keys`, `event-keys`, and `tool-gates`), and `release` (diff, explain, notes). The `binary` argument is now `version`. An unknown action returns the list of actions. The server now writes its cache of cleaned code, and `release` `notes` runs `gh release view`.
- **Breaking:** `cc-docs` 1.0.0 has four tools in place of seven, and its tool list is 2,773 bytes in place of 14,110. The platform tools are now options of the others:
  - `search_platform_docs` is `search_docs` with `source: "platform"`, and its `group` argument is now `section`.
  - `read_platform_page` is `read_page` with `source: "platform"`, and its `path` argument is now `route`.
  - `list_platform_pages` is `list_pages` with `source: "platform"`, and its `group` argument is now `section`.
  - `search_docs`, `read_page`, `list_pages`, and `get_schema` keep their names. No tool has an output schema, and a page or schema read returns text only.

- Diagrams render after the fonts load, scroll sideways on small screens instead of shrinking, and keep lines out of labels.
- Merged duplicated rows into one home per item, with links from other pages.
- Code examples follow `biome.json`, including arrow functions.
- Updated to Claude Code `2.1.310`: `Monitor` and plugin monitors on every provider, the long `sleep` block, the effort retry, the sandbox warnings, the Mod `Image` in tmux, and three new environment variables. The `2.1.309` section of What Changed moved to the Release Archive.
- `release:diff` compares the surface snapshots of both versions for all 17 kinds, in place of `strings` heuristics, and names the target page of each added item.
- What Changed lists only the current release. Earlier sections moved to a new Release Archive page.
- The schema generator follows a value through its variables, calls, and returns to find its type, so fewer generated fields carry `x-unverified`.
- Refreshed the design with IBM Plex Mono for code, a capped prose width, and quieter tables that scroll on mobile.
- Made the badge shapes read without color, and added brand-style admonitions.
- Added a hero to the overview page.

### Fixed

- `read_page`, `read_platform_page`, `get_schema` (`cc-docs`), and `read_session` (`cc-inspect`) return their text again. Claude Code `2.1.309` shows the model only `structuredContent` when a reply has it, so these tools no longer send it.
- `cc-inspect` and the schema generator parse Claude Code `2.1.309`, which names a `using` variable `as` (a patch of the `meriyah` parser).
- Schema anchors match a renamed minified name, so `bun run schemas` passes on `2.1.309`.
- Settled most "Not Verified" items with live probes (print mode, interactive, and the program), and corrected the wrong ones.
- Corrected the plugin, MCP, and reference pages after checking them against sources.
- Split the hook environment variable rows in the Undocumented index, and marked `prependPlugins` and `appendPlugins` as differing from the docs.
- Fixed the dark-mode colors and the announcement bar.
- Corrected the default of `CLAUDE_CODE_GZIP_DATADOG_LOGS`, and documented when `/restart` shows and how it works.
- Corrected the variable counts of three environment variable pages and the section total, the managed-only key count, and the SchemaStore comparison table.
