# Proposal: Release Claude Code 2.1.311

## Why

The site tracks `2.1.310`, and [`2.1.311`](https://github.com/anthropics/claude-code/releases/tag/v2.1.311) shipped 2026-10-26.
The site also has no page on how the program learns the user's account and plan, or how it decides which models (such as Fable and Mythos) a user may pick (the user, 2026-10-27).

## What Changes

- Run the runbook in `tools/release/README.md` from `2.1.310` to `2.1.311`. `release:diff` crashed on a prefix-mapped error text. The fix is commit `d282517`.
- Update pages for the diff items (`captures/2.1.311/diff/report.md`):
  - 36 added env vars: each one gets a row, or an exclusion with a reason. `CLAUDE_CODE_TOOL_CONTAINER_PLUGINS_NAMED` is removed.
  - `/claude-api` is gone from the command list. Check `bundled-skills.md`, the prompts pages, and `undocumented.md`.
  - 3 added endpoints and 1 removed endpoint (`/api/oauth/files/.../content`), 31 added error texts, 3 removed error texts, and the Mod API `$.prompt.paint` call and event.
  - Schema fields: `pluginDigests` in marketplace settings, `toolsUsed` and `subagentCapApplied` tool results, `local_file`, and the stream-json and control-protocol changes once the renumbering churn is set apart.
  - 52 new gates and 4 removed gates stay under the gate exclusion, unless one changes a documented behavior.
- Update pages for the notes items that a user can use or change, after each is confirmed in the program or a probe. Candidates: the `self-hosted-runner` flags `--hold-idle-file` and `--max-hold-min`, `ultrathink` at xhigh effort, the dropped `[1m]` suffix, `DISABLE_COMPACT` that can only turn compaction off, `CLAUDE_CODE_MODEL_CATALOG` for the cloud providers, the `\uXXXX` escapes in JSON output, `CLAUDE_CODE_SYNC_SKILLS`, compaction on long standard-context requests, the retry stop on non-retryable errors, and the Pro and Max startup check cache.
- Add a How It Works page, "Account and Access": the account facts the program reads, where it keeps them, the plan types and what each changes, and how model access is decided. It states only what the program holds, with module and offset, and it never quotes program source at length or shows a token.
- Regenerate `schemas/`, the surface snapshot, the Surface Coverage page, and `docs/prompts/`.
- Change current-behavior labels from `2.1.310` to `2.1.311` after a check of each. Move the `2.1.310` section to the Release Archive, and write the `2.1.311` section.
- Run the live probes (approved by the user, 2026-10-27) and the managed probes (the user runs `sudo`).
- Bump `src/version.ts` last, then bump `cc-docs` and `cc-inspect`, and add the `CHANGELOG.md` entry.
- Already done in this change: meriyah 7.4.1 still needs the `using as` patch, which moved to `patches/meriyah@7.4.1.patch` (commit `94b134a`).
- Left out: VS Code, Cloud and Cowork sessions, Remote Control, mobile, and fixes with no new behavior.

## Capabilities

### New Capabilities

- `account-access-docs`: the site documents how the program learns the account and plan, and how it decides model access.

### Modified Capabilities

None. `tracked-release-docs` already sets the release rules, and this change applies them to `2.1.311`.

## Impact

`docs/` (env vars, commands, Mod API, endpoints, models, How It Works), `tools/surface/`, `tools/release/claims/map.json`, `schemas/`, `src/version.ts`, the plugin versions, and `CHANGELOG.md`.
