# Design: Release Claude Code 2.1.310

## Context

The scope is in `proposal.md`, and the behavior is in `specs/tracked-release-docs/spec.md`.
`release:check` and `release:diff` ran on 2026-10-24: `check ok`, and the counts in `prd.md`.
`captures/2.1.309/` holds the old print and pty results, so `compare` has a baseline.

## Decisions

1. **Run `release:all -- --from 2.1.309 --to 2.1.310` once, then read the worklist.** It reruns check and diff, which is cheap, and gives one `run.json`. Alternative: run each step by hand, which is only needed after a failed step.
2. **Sort each worklist and diff item as change or noise before any edit.** Rerun a changed case on both versions to split them, as for 2.1.309. Alternative: edit from the first result, which let pty timing noise into pages before (the runbook's `invalid-run` rule).
3. **The 8 `claude-3-*` model ids need a reason before a row.** They may be a retired-model list or an alias table. Read their module with `cc-inspect` first. Add rows only when a user can pick or is affected by the id. Otherwise add an exclusion. Alternative: add rows at once, which could state a model as usable when the program only names it to refuse it.
4. **Env vars with a `CLAUDE_TEST_` prefix go to exclusions as test-only**, unless the code reads them outside a test path. Same rule as the existing test-only exclusions. The 4 `CLAUDE_CODE_*` vars get rows with `<Undocumented />` when a user can set them.
5. **New artifact and doc-write errors** (`read_comments`, "Write not done", "Write refused") belong to the artifacts surface. Place them on the page that covers artifacts tools today, found with `grep`. If none covers it, use an exclusion with the reason "no page covers the artifacts tools yet". Alternative: a new page, which is out of scope for a release.
6. **Gates stay under the gate exclusion.** `tengu_cobalt_plinth_larch` (default now `true`) gets a page row only if `cc-inspect` shows it guards a documented behavior. The Monitor provider change is checked the same way, because the notes item may be a gate.
7. **Labels change file by file, with a check of each fact**, not by search and replace. Use the 2.1.309 method: `grep -rn '2\.1\.309' docs`, then keep change notes and dated records.
8. **Live probes run last** (`architecture.md` decision 3). Managed probes wait for the user.

## Risks / Trade-Offs

- [Notes item missing from the binary, for example a server-side change] -> Leave it out and list it in the tasks.
- [Pty timing noise looks like a change] -> Rerun once on both versions. Never edit from an `invalid-run`.
- [Prompt render churn, such as random UUIDs] -> Review `git diff docs/prompts/` and keep only real prompt changes.
- [149 files to relabel] -> Split the sweep by docs section. Use one Worker at a time while the weekly band is red.
- [Live probes use up the weekly limit] -> Run them only when the band is not red. Until then, mark live-only claims unverified.
- [A removed name still on a page other than Surface Coverage] -> `grep` each removed name across `docs/` before the commit.
