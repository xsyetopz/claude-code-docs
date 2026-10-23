# Proposal: Full Surface Map of Claude Code 2.1.309

## Why

Agents cannot tell what the `2.1.309` binary has from what the docs leave out, and the `cc-docs` MCP server costs context in every session (see `prd.md`).
This change maps every functional surface into its docs section, gives agents one lookup per kind, and adds a cheaper way into the docs.

## What Changes

- Add AST-based surface extractors to cc-inspect (`inspect/mcp/src/`), one for each kind, and a `list_surface` tool that takes a kind.
  Kinds that the release diff finds with `strings` heuristics today (env vars, flags, commands, settings, hook events, gates) move to the extractors. `design.md` fixes the new kinds.
- Add `tools/surface/`: a snapshot script (`captures/<v>/surface.json`, committed trimmed copy `schemas/surface.json`), a coverage map with an exclusion list, and a check in `verify` that fails on an item with neither a page nor a reason.
- Make the release diff compare surface snapshots for the covered kinds, and add the snapshot step to `tools/release/README.md`.
- Add the missing items of `2.1.309` as rows in their existing docs sections, with status badges, plus one generated coverage page under `docs/reference/`.
  This includes the surfaces of claude.ai, Cowork, Claude Design, and artifacts that the binary holds.
  `docs/reference/undocumented.md` takes its counts from the snapshot.
- The site build emits `llms-search-index.json`, a prebuilt search index. The docs search core loads it in place of fetching every page on the first search.
- Split the `cc-docs` MCP code into a shared search core and a thin MCP front end.
- **BREAKING**: merge the 7 `cc-docs` MCP tools into fewer tools, with a `source` argument for the platform docs, and cut the descriptions. Tool names change, so `cc-docs` gets a major version bump.
  The skill `plugin/skills/claude-code-docs/SKILL.md` and `plugin/mcp/evaluation.xml` change in step.
- Add a `cc-docs` CLI on the same core, with `ctx7`-style subcommands, shipped as the `bin/` of a new plugin with no MCP server and as a registry package run with `bunx` (the user chose `bin/` plus `bunx` on 2026-10-23).
  The new plugin has a light skill that calls the CLI through Bash, and its description says it works only in Claude Code.
- Add the new plugin to `.claude-plugin/marketplace.json`, `tools/plugin/check.ts`, and `tools/version/bump.ts`.

## Capabilities

### New Capabilities

`openspec/specs/` is empty, so every capability is new.

- `binary-surface-map`: every functional surface of a version, extracted by kind, snapshotted, mapped to a doc page or an exclusion, and checked.
- `inspect-surface-lookup`: the cc-inspect lookup that lists the items of one kind of surface in an installed binary.
- `docs-mcp-server`: the `cc-docs` MCP tools, their arguments and replies, the prebuilt index, and the offline cache.
- `docs-cli`: the `cc-docs` command-line program, its packaging (plugin `bin/` and `bunx`), and the light skill.

### Modified Capabilities

None.

## Impact

- Code: `inspect/mcp/src/` (new extractors and tool), `plugin/mcp/src/` (core split, merged tools), a new CLI plugin folder, `tools/surface/` (new), `tools/release/diff/`, `src/plugins/llms-txt/index.ts`, `tools/plugin/check.ts`, `tools/version/bump.ts`, `package.json` scripts.
- Docs: rows across the sections of each kind, a new generated page under `docs/reference/`, `docs/reference/undocumented.md`, the runbook, `README.md`, `CHANGELOG.md` under `[Unreleased]`.
- Versions: `cc-docs` major bump (breaking tool names), `cc-inspect` minor bump (new tool), the new plugin starts at its first version. `src/version.ts` stays `2.1.309`.
- External: each publish of the CLI package to the registry needs the owner's approval and a registry login. The owner's standing approval covers commit and push only (`CLAUDE.local.md`).
- Users of the old `cc-docs` tool names must update their prompts. The changelog entry names the old and new tools.
