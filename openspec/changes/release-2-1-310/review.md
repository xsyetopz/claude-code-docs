# Review: Release Claude Code 2.1.310

## Agreement

- [x] Each capability of the proposal has a spec: `tracked-release-docs` has `specs/tracked-release-docs/spec.md`. No modified capability.
- [x] Each requirement has a scenario: 4 requirements, each with 2 scenarios.
- [x] The design covers each requirement: notes coverage (decisions 1, 2, 6), diff coverage (decisions 3 to 6), labels (decision 7), and the version stamp (decision 1, runbook step 12, task 4.1).
- [x] No `[NEEDS CLARIFICATION` marker is open.

## PM

- [x] Each goal of `prd.md` has a requirement: goal 1 to Release Notes Coverage, goal 2 to Surface Diff Coverage, goals 3 and 4 to Version Labels, goal 5 to Tracked Version Stamp.
- [x] Each requirement traces to a goal.

## Architect

- [x] `design.md` follows `architecture.md`: the same runbook, cc-inspect checks, and live probes last.
- [x] Each dependency and migration is named: both binaries installed, `captures/2.1.309/` for compare, the `2.1.309` section moving to the Release Archive with its claim ids, and the `sudo` and live-quota steps.

## QA

- [x] Each scenario can run as a test: each names a command (`grep`, `surface:check`, `release:claims -- --check`, `schemas:check`, `verify:locked`) or a page row to read.
- [x] Each error and edge case has a scenario: an unconfirmed notes item, a removed name, and a version mismatch.

## Gaps

None open. Two choices are proposed and easy to change:

- Live probes wait until the weekly usage band is not red (`architecture.md` decision 3).
- The 8 `claude-3-*` model ids get rows only after their purpose in the program is known (`design.md` decision 3).
