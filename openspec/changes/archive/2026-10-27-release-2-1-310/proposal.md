# Proposal: Release Claude Code 2.1.310

## Why

The site tracks `2.1.309`, and `2.1.310` shipped 2026-10-23 with user-visible changes. See `prd.md`.

## What Changes

- Run the runbook in `tools/release/README.md` from `2.1.309` to `2.1.310`. Steps 1 and 4 (check, diff) ran while this plan was written.
- Update pages for the notes items a user can use or change, after each is confirmed in the program or a probe. Candidates, with the pages that name the topic today:
  - Monitor tool and plugin monitors on Bedrock, Vertex, and Foundry, and with telemetry or nonessential traffic off. Long foreground sleeps blocked there too.
    Pages: `docs/reference/tools/shell-and-web.md`, `docs/extend/plugins/index.md`, `docs/configure/env-vars/telemetry-and-debug.md`, `docs/configure/models-and-providers.md`.
  - Retry without the `effort-2025-11-24` beta or mid-conversation system messages on gateways that reject them.
    Pages: `docs/reference/api/betas.md`, `docs/reference/undocumented.md`.
  - `cleanupPeriodDays` with a very large value no longer deletes recent files.
    Pages: `docs/configure/settings/core.md`, `docs/how-it-works/sessions-and-storage.md`.
  - Compaction after "Prompt is too long" keeps less dense text. Non-interactive compaction memory use.
    Pages: `docs/configure/env-vars/context-and-compaction.md`, `docs/how-it-works/context-budget.md`.
  - Read permission prompts show a symlink target. Auto mode prompt text for the first read outside the working directories.
    Pages: `docs/configure/permissions/rules.md`, `docs/configure/permissions/modes.md`, `docs/reference/tools/files.md`.
  - Question auto-continue timeout after the external editor. Page: `docs/configure/settings/agents-and-remote.md`.
  - Windows: `PreToolUse` and `PermissionRequest` hooks with no Git Bash and a quoted-only command.
    Pages: `docs/extend/hooks/handlers.md`, `docs/extend/hooks/configuration.md`.
  - A mod's `Image` inside tmux with `allow-passthrough` and `focus-events`. The program has a new error `tmux passthrough: expected exactly one iTerm2 File= sequence ending in BEL`.
    Pages: `docs/extend/mod-api/types/ui.md`, `docs/configure/env-vars/ui-and-terminal.md`.
  - Linux: `/sandbox` and the startup warning name Ubuntu's AppArmor user-namespace restriction. Page: `docs/configure/permissions/sandbox.md`.
  - The MCP tool timeout text in non-interactive sessions with an unanswered elicitation. Page: `docs/extend/mcp/runtime.md`.
- Update pages for the diff items (`captures/2.1.310/diff/report.md`):
  - 6 env vars with no row: `CLAUDE_CODE_ARTIFACT_ASK_FIRST`, `CLAUDE_CODE_DESKTOP_CONNECTOR_NAMES`, `CLAUDE_CODE_RETRY_WATCHDOG_SCOPE`, `CLAUDE_CODE_TOOL_CONTAINER_PLUGINS_NAMED`, `CLAUDE_TEST_ESSENTIAL_TRAFFIC`, `CLAUDE_TEST_NO_OPEN`. A row in `docs/configure/env-vars/`, or an exclusion with a reason.
  - 8 model ids (`claude-3-*`) with no row in `docs/configure/models-and-providers.md`. Learn first why the program now lists them.
  - The `propose_skills` enable check (`docs/reference/tools/gated-and-other.md`, `docs/reference/undocumented.md`).
  - The Mod API "holds a Proxy" errors now also name "a vm context" (`docs/extend/mod-api/index.md`).
  - 4 new artifact and doc-write errors (`read_comments`, "Write not done", "Write refused") and the `claude doctor` warning: a row or an exclusion each.
  - 2 removed gates and 4 removed errors leave `docs/reference/surface-coverage.md`. 18 new gates and the `tengu_cobalt_plinth_larch` default change stay under the gate exclusion unless they change a documented behavior.
- Regenerate `schemas/`, `schemas/claude-code.d.ts`, `schemas/surface.json`, and the Surface Coverage page. Render `docs/prompts/` and review the diff.
- Change current-behavior labels from `2.1.309` to `2.1.310` after a check of each. Change notes and dated probe records stay.
- Add the `2.1.310` section to `docs/start/what-changed.md`, move the `2.1.309` section to the top of `docs/start/release-archive.md`, and rename its claim ids in `tools/release/claims/map.json`.
- Add the `CHANGELOG.md` entry, bump `cc-docs` with `version:bump` (and `cc-inspect` if `inspect/` changes), and bump `src/version.ts` last.
- Leave out VS Code, Cloud sessions, Claude Tag, and Code Review items, and fixes with no new behavior.
- Add a cc-inspect release diff (`prd.md` goal 6, added on 2026-10-24 at the user's request):
  - A clean step for each install: stable local names and `bun fmt`, with a function index, cached under `captures/<version>/clean/`.
  - `release` `diff`: functions added, gone, or changed between two versions, each with its cleaned code.
  - `release` `explain`: for a function or name, where it is, what it does, who calls it, when it runs (gates, env reads, `isEnabled`), how (a no-op, a stub, or handled code), and why (the matched notes line).
  - `release` `notes`: each release-notes line marked matched, unmatched, or gated.
  - `code` `find`: a plain-words query over the index, and MCP prompts that walk an agent through a release (the user, 2026-10-24).
  - The MCP tools merge into 4 (`sessions`, `code`, `surface`, `release`) with one-sentence descriptions (the user, 2026-10-24).
  - `release:all` runs the clean step. A one-time `humanify` trial with Haiku is recorded as a reading aid only.

## Capabilities

### New Capabilities

- `tracked-release-docs`: the site documents the one Claude Code version in `src/version.ts`, with each user-facing release change on its page and each label checked.
- `inspect-release-diff`: cc-inspect cleans each install, diffs two versions by function, explains each change, and matches the release notes to it.

### Modified Capabilities

- `inspect-surface-lookup`: the lookup moves from `list_surface` to the `surface` tool, with `version` in place of `binary`, when the 13 cc-inspect tools merge into 4 (the user, 2026-10-24).

`binary-surface-map` already requires each surface item to have a page or an exclusion. This change applies it to `2.1.310`.

## Impact

- Docs, schemas, the surface snapshot, prompt pages, `tools/release/claims/map.json`, `tools/surface/exclusions.json`, plugin and repo texts.
- No site code change. Toolkit: the cc-inspect release diff (`inspect/mcp/src/`, tests in `inspect/mcp/test/`), a `release:all` step, the runbook, and a `cc-inspect` minor bump.
- The `humanify` trial (task 5.10) uses `ANTHROPIC_API_KEY` through `tools/release/secret-runner.sh apikey`, a small paid run.
- Step 9 (managed) needs the user for `sudo`. Step 10 (live) uses subscription quota. See `architecture.md` decision 3.
- `release:probe:pty` takes about 11 minutes on an idle machine.
