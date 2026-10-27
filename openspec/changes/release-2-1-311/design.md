# Design: Release Claude Code 2.1.311

## Decisions

1. **Evidence.** Each new fact cites a module and offset in `captures/2.1.311/clean/modules/` (cleaned names), or the raw chunk name and offset, or a probe case id. A notes line with no hit is left out and listed in `tasks.md`.
2. **File sets.** Four parallel workers, so that no two edit one file:
   - A: `docs/configure/env-vars/` and `tools/surface/exclusions.json`.
   - B: `docs/extend/` (skills, Mod API, plugins), `docs/reference/api/endpoints.md`, and the error rows of `docs/reference/` (except `tools/`). B writes the `map.json` and exclusion entries it needs to `/tmp/cc311/b-surface.json`, and the lead merges them.
   - C: `docs/configure/models-and-providers.md`, `docs/configure/cli/`, `docs/how-it-works/` (except the new page), `docs/configure/settings/`.
   - D: `docs/reference/tools/`, `docs/reference/sdk` and control-protocol pages, and `schemas/` review notes.
   The lead writes `docs/how-it-works/account-and-access.md`, `docs/start/`, `tools/release/claims/map.json`, and the label sweep.
3. **Account page.** A How It Works page named "Account and Access", after `models.md` in the sidebar. It links the catalog rows in `models-and-providers.md` and does not repeat them. It follows the No Sensitive Content requirement: key names and paths only, short quotes, and no values.
4. **Checks.** No worker runs a `bun run` gate while `release:probe:pty` runs, because the pty cases measure timing. The Tester runs `lint`, `check:docs`, and `surface:check` after it.
