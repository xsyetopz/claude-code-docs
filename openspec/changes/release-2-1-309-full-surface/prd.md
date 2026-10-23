# PRD: Full Surface Map of Claude Code 2.1.309

## Problem

The site documents Claude Code `2.1.309` (`src/version.ts`), but only the surfaces that a release diff or a user question brought up.
No list says which functional parts of the program exist and which page covers each one.
So an agent cannot tell "the docs do not cover it" from "the program has no such thing", and it falls back to memory or to slow binary searches.
An example from 2026-10-23: a session searched the binary 5 times with `cc-inspect` to learn whether the hooks runtime can import an npm package, found nothing, and fell back to repository files.

`cc-inspect` has dedicated lookups for some kinds of surface only (tools, OpenTelemetry events, object literals).
Other kinds need free-text `search_binary` calls and manual reading.

The `cc-docs` MCP server costs every session context before it is used.
Its `tools/list` reply is 15,468 bytes for 7 tools (measured 2026-10-23 with `dist/server.js`).
A user who wants the docs only now and then has no cheaper way in than the MCP server or raw `llms.txt` fetches.

## Users

- Agents (Claude Code sessions with the `cc-docs` or `cc-inspect` plugin) that answer questions about Claude Code.
- People who read the site to configure or extend Claude Code.
- The maintainer, who runs the release runbook for each new version and needs to see what a version adds.

## Goals

1. Every functional surface of the `2.1.309` binary is listed once, by kind, with the page that documents it or a stated reason that it is left out.
2. Each surface item sits in the docs section a reader would look in (env vars in env vars, hook events in hooks), with the usual status badges.
3. An agent can look up any kind of surface in the installed binary with one `cc-inspect` call, not a free-text search.
4. The `cc-docs` MCP server costs far less context per session and answers faster, with no loss of what it can answer.
5. A user can query the docs with a small command-line program and a light skill, with no MCP server, in the style of `ctx7`.
6. The release runbook finds new and removed surfaces of the next version on its own, so the map stays complete.

## Non-Goals

- Documenting internals with no user effect (minified helpers, bundler code, dead code behind a constant `false`).
- Documenting other Claude Code versions than `2.1.309`, beyond the existing change notes.
- Changing the site design or theme.
- A hosted search service. The site stays static on GitHub Pages.
- The hooks-runtime npm import question (tracked as D23 in a separate session's plan).

## Success Measures

- A generated coverage index lists each extracted surface item of `2.1.309`, and a check fails when an item has neither a page nor an exclusion reason.
- Every surface kind in the index has a `cc-inspect` lookup that returns its items for a given version.
- `cc-docs` `tools/list` shrinks to (proposed) at most 40% of today's 15,468 bytes, with the questions in `plugin/mcp/evaluation.xml` still answered.
- The `cc-docs` CLI answers a search and a page read each in one command, run through `bunx` or the plugin `bin/`, with no install step.
- `bun run verify:locked` passes, and the plugin checks (`plugin:check`) pass with bumped versions.
