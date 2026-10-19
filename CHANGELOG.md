# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The site documents Claude Code `2.1.303`, the only release it tracks. The version of the site itself is set in `package.json`, and the tracked Claude Code version is set in `src/version.ts`.

## [Unreleased]

### Added

- An unofficial docs site for Claude Code `2.1.303`, with pages for start, configure, extend, prompts, reference, and how it works.
- Provenance badges (Documented, Undocumented, Differs, and Gated) that mark each item.
- A style guide for contributors in `docs/contributing/`.
- Capture and check tools in `tools/`, and a GitHub Pages deploy workflow.

### Changed

- Refreshed the design with IBM Plex Mono for code, a capped prose width, and quieter tables that scroll on mobile.
- Made the badge shapes read without color, and added brand-style admonitions.
- Added a hero to the overview page.

### Fixed

- Corrected the plugin, MCP, and reference pages after checking them against sources.
- Split the hook environment variable rows in the Undocumented index, and marked `prependPlugins` and `appendPlugins` as differing from the docs.
- Fixed the dark-mode colors and the announcement bar.
- Corrected the default of `CLAUDE_CODE_GZIP_DATADOG_LOGS`, and documented when `/restart` shows and how it works.
