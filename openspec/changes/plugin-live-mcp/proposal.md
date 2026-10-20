# Proposal: Live Docs MCP With Platform Docs

## Why

User (verbatim, 2026-10-21): "just know the MCP must also be updated. the offline-query thing might be just duplicate maintenance, so how about making it a normal MCP?"

User (verbatim): "Oh, and that claude-docs mcp inside the plugin should also be able to query official anthropic/claude docs as well, such as the https://platform.claude.com/docs/en/home platform claude. not code.claude docs. ours replaces the code.claude docs."

User choices: platform docs inside our MCP; cache the last fetch for offline use; do this after the 2.1.305 commit.

The plugin ships a 5.1 MB snapshot (`plugin/mcp/snapshot/`) that `bun run plugin:snapshot` must refresh on every doc change.

## What Changes

- The MCP server reads our site live: `https://xsyetopz.github.io/claude-code-docs/llms-manifest.json`, per-page `.md`, and `/schemas/*.json`. Remove the bundled snapshot and the `plugin:snapshot` step (and its gate in `plugin:check`/`verify`).
- Disk cache of every fetched file (under the plugin data folder), used when the network fails; revalidate with ETag/Last-Modified.
- New tools for the official platform docs (platform.claude.com, not code.claude.com): search over `https://platform.claude.com/llms.txt` and read a page's `.md`. Our site replaces the code.claude.com docs, so no tool for those.
- Update the skill, plugin.json description, README/docs pages that describe the plugin, and `evaluation.xml`.
