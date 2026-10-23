# Tasks: Release Claude Code 2.1.309

## 1. Capture

- [x] 1.1 Run `bun run release:all -- --from 2.1.308 --to 2.1.309`. Verify: `captures/2.1.309/run.json` shows each step, and `diff/report.md` and `compare/compare.md` exist
- [x] 1.2 Read `diff/report.md`, `schemas-diff.json`, and `compare.md`. List each new or changed env var, flag, command, setting, hook, and type, and each changed case. Rerun changed cases on 2.1.308 and 2.1.309 to split noise from change. Verify: each worklist item is marked change or noise
- [x] 1.3 Check each candidate in the proposal against the 2.1.309 binary with `cc-inspect` (`search_binary`, `read_module`). Verify: each kept item names its module and offset or probe case; drop items with no evidence

## 2. Docs

- [x] 2.1 Run `bun run release:prompts` and review `git diff docs/prompts/`. Verify: `dataviz` and `/claude-api` changes show, and no unrelated churn.
  Result: rendered from the step 1.1 captures (`CAPTURE_OUT=captures/2.1.309/prompts bun tools/capture-prompts/render.ts`). Only change: the Bash description gained the GitHub `@name` bullet (1,406 to 1,688 characters). The `dataviz` page text is unchanged and `/claude-api` has no page. Churn: random UUIDs in 4 pages, there before this change
- [x] 2.2 Update the pages for the confirmed items, with At a Glance markers and citations to the release notes or "the program". Verify: `bun run lint` and `bun run check:docs` pass
- [x] 2.3 Map each new version-labelled claim in `tools/release/claims/map.json`. Verify: `bun run release:claims -- --check` shows no `unmapped` claim
- [x] 2.4 Change current-behavior labels from `2.1.308` to `2.1.309` after a check of each. Keep change notes and dated probe records. Verify: `grep -rn '2\.1\.308' docs` lists only kept lines
- [x] 2.5 Add the 2.1.309 section to `docs/start/what-changed.md`, the `CHANGELOG.md` entry, and update `plugin/.claude-plugin/plugin.json`, `plugin/skills/claude-code-docs/SKILL.md`, and `README.md`. Verify: `bun run lint`
- [x] 2.6 Move the 2.1.300 to 2.1.308 sections of `docs/start/what-changed.md` to a new `docs/start/release-archive.md`, so What Changed holds only 2.1.309 (user request), and add this step to the runbook. Verify: `bun run lint`, `bun run check:docs`, and `bun run release:claims -- --check` pass

## 3. Release

- [x] 3.1 Bump `src/version.ts` to `2.1.309`, run `bun run schemas`, then `bun run schemas:check` and `bun run verify:locked`. Verify: both exit 0
- [x] 3.2 Have the diff reviewed against this plan, then commit and push (pre-approved in the owner's `CLAUDE.local.md`). Verify: review finds no unfixed issue, and the pre-push `verify:locked` passes
- [ ] 3.3 Run the live probes with `--yes` (pre-approved), and ask the user to run the managed probes (`sudo`). Fix any doc they contradict, then commit and push. Verify: `compare.md` has no changed case left unexplained
