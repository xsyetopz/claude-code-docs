# PRD: Release Claude Code 2.1.310

## Problem

[v2.1.310](https://github.com/anthropics/claude-code/releases/tag/v2.1.310) shipped 2026-10-23 (`gh release view v2.1.310`), and the site still tracks `2.1.309` (`src/version.ts`).
The `2.1.310` binary is installed (`claude --version` gives `2.1.310`), so readers who run it see behavior the pages do not describe:

- The release notes list user-visible changes: the Monitor tool and plugin monitors on Bedrock, Vertex, and Foundry and with telemetry or nonessential traffic off, a retry without the `effort-2025-11-24` beta, cleanup and compaction fixes, symlink targets in read prompts, Windows hook fixes, the auto mode prompt text, the mod `Image` inside tmux, the Linux AppArmor sandbox warning, and the MCP elicitation timeout text.
- `release:diff` (`captures/2.1.310/diff/report.md`, this session) finds 6 new env vars, 8 new model ids, 18 new and 2 removed gates, 1 changed gate default (`tengu_cobalt_plinth_larch` false to true), 8 new and 4 removed error texts, and a changed `propose_skills` enable check. Flags, commands, settings, hooks, betas, endpoints, files, keybindings, the Mod API, OpenTelemetry events, and permission rules show no change.
- 149 files under `docs/` name `2.1.309` (`grep -rl '2\.1\.309' docs | wc -l`), and the Surface Coverage page still lists the removed names.

## Users

- People who read the site to configure or extend Claude Code `2.1.310`.
- Agents that answer from the site through the `cc-docs` plugin or the CLI.
- The maintainer, who runs the release runbook (`tools/release/README.md`).

## Goals

1. Each release-notes item a user can use or change is on its page, confirmed in the program or a probe, or left out with a stated reason.
2. Each added, removed, or changed surface item of the diff is on its page or in an exclusion with a reason, so the coverage check passes for `2.1.310`.
3. Current-behavior version labels say `2.1.310`, each after a check, and change notes keep their versions.
4. What Changed holds the `2.1.310` section, and the `2.1.309` section moves to the Release Archive.
5. Schemas, the type file, the surface snapshot, prompt pages, the claim map, and the plugin texts name `2.1.310`.

## Non-goals

- VS Code, Cloud sessions, Claude Tag, and Code Review web items of the notes, which the binary and the site do not cover.
- Plain bug fixes with no new behavior a user can use or change.
- Server-side gates beyond the rows where they change documented behavior (the existing exclusion rule).
- Changes to the site code, theme, or toolkit, except a probe case for a new claim.

## Success Measures

- `bun run verify:locked` exits 0 with `src/version.ts` at `2.1.310`.
- `bun run surface:check` and `bun run schemas:check` exit 0.
- `bun run release:claims -- --check` shows no `unmapped` claim.
- `captures/2.1.310/compare/compare.md` has no changed case left unexplained.
- Each kept notes item names its module and offset or its probe case in `tasks.md`.
