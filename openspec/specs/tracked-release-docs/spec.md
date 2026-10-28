# tracked-release-docs Specification

## Purpose
Keep the site in step with the one Claude Code version named in `src/version.ts`, so each user-facing change of that version is on its page with a source, and no page states a fact the program does not hold.

## Requirements

### Requirement: Release Notes Coverage

For the tracked version, each release-notes item that a user can use or change SHALL appear on the page of its topic, cited as a link to the release tag or as "the program".
An item SHALL be stated only after it is confirmed in the program (a module and offset) or in a probe case.
An item with no such evidence, and each VS Code, Cloud sessions, Claude Tag, or Code Review item, SHALL be left out and listed as left out in the change's tasks.

#### Scenario: Confirmed Item

- **WHEN** the notes say the Monitor tool runs on Bedrock, and `cc-inspect` finds that check in the `2.1.310` binary
- **THEN** the `Monitor` row in `docs/reference/tools/shell-and-web.md` states it with a citation

#### Scenario: Unconfirmed Item

- **WHEN** a notes item has no module, offset, or probe case in the binary
- **THEN** no page states it, and the tasks list it as left out with the reason

### Requirement: Surface Diff Coverage

Each item that `release:diff` reports as added, removed, or changed between the previous and the tracked version SHALL be on a page or in `tools/surface/exclusions.json` with a reason, and a removed item SHALL be gone from every page that states it as current.

#### Scenario: New Env Var

- **WHEN** the diff reports `CLAUDE_CODE_RETRY_WATCHDOG_SCOPE` as added and not in the docs
- **THEN** after the change it has a row in `docs/configure/env-vars/` or an exclusion with a reason, and `bun run surface:check` exits 0

#### Scenario: Removed Gate

- **WHEN** the diff reports `tengu_amber_sentinel` as removed
- **THEN** `docs/reference/surface-coverage.md` no longer lists it

### Requirement: Version Labels

Each current-behavior version label SHALL name the tracked version only after the labelled fact is checked against that version.
Change notes and dated probe records SHALL keep their versions.
`docs/start/what-changed.md` SHALL hold only the tracked version's section, and the previous section SHALL be at the top of `docs/start/release-archive.md`.

#### Scenario: Label Sweep

- **WHEN** the change is done and someone runs `grep -rn '2\.1\.309' docs`
- **THEN** each line it prints is a change note, a dated record, or a Release Archive line

#### Scenario: Fact Map

- **WHEN** `bun run release:facts -- --check` runs after the archive move
- **THEN** it reports no `unmapped` fact

### Requirement: Tracked Version Stamp

`src/version.ts`, `schemas/`, `schemas/surface.json`, and the plugin and marketplace texts SHALL name the same tracked version, and `bun run verify:locked` SHALL pass.

#### Scenario: Release Check

- **WHEN** `src/version.ts` names `2.1.310` and `bun run verify:locked` runs
- **THEN** it exits 0, and `schemas:check`, `surface:check`, and `plugin:check` agree on `2.1.310`

#### Scenario: Version Mismatch

- **WHEN** `schemas/surface.json` names `2.1.309` while `src/version.ts` names `2.1.310`
- **THEN** `bun run schemas:check` exits non-zero (the `binary-surface-map` Committed Surface Copy requirement)
