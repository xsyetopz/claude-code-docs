# Review: Full Surface Map of Claude Code 2.1.309

## Agreement

- [x] Each capability of the proposal has a spec: `binary-surface-map`, `inspect-surface-lookup`, `docs-mcp-server`, and `docs-cli`, each under `specs/`.
- [x] Each requirement has a scenario.
- [x] The design covers each requirement. Snapshot, committed copy, coverage, and page: D4. Items in sections: D1 and tasks 5.x. Release diff: architecture component 3 and task 3.4. `list_surface`: D5. Four tools and size: D7. Prebuilt index: D6. Offline cache: kept from `cache.ts`, D6 and D9. No `bin/` in `cc-docs`, the CLI, the light plugin, and the registry package: D8.
- [x] No `[NEEDS CLARIFICATION` marker is open. The user settled the preset, the shipping, the tool merge, the docs place, the names, and the claude.ai and Cowork scope on 2026-10-23.

## PM

- [x] Each goal of `prd.md` has a requirement. Goal 1: Coverage Check and Coverage Page. Goal 2: Items in Their Sections. Goal 3: List Surface Items by Kind. Goal 4: Four Tools, Small Tool List, Prebuilt Index. Goal 5: the `docs-cli` spec. Goal 6: Release Diff From Snapshots.
- [x] Each requirement traces to a goal.

## Architect

- [x] `design.md` follows `architecture.md`: extractors in cc-inspect (decision 1, D1), one `list_surface` tool (decision 3, D5), and one core with two front ends (decision 6, D8).
- [x] Each dependency and migration is named. These are the breaking tool rename (major bump and a changelog map, task 4.5), `verify` gaining `surface:check` only after the docs map (task 5.8), and the registry publish behind the owner's approval (task 6.2).
- [x] CI has no Claude Code binary (`.github/workflows/deploy.yml`), so binary-dependent checks skip with a message, as `plugin:check` already does. Extractor tests use fixtures (tasks 1.2 to 1.5 and 3.1). This was fixed during the review.

## QA

- [x] Each scenario can run as a test. "Plugin bin" needs a Claude Code run, so it is covered by `plugin:smoke` and the probe of task 4.4.
- [x] Each error and edge case has a scenario. These are a missing binary, an unknown kind, an unknown page, a usage error (added during the review), an index 404, an offline read, a stale exclusion, and a check with no binary (added during the review).

## Gaps

None open. Three proposed values are still to be set from data during apply. Each is set in a named task:

- The `tools/list` limit, 40% of 15,468 bytes (spec `docs-mcp-server`), checked by the test of task 4.2.
- The `search-index.json` cap, proposed at 8 MB (D6), checked in task 4.1.
- The `list_surface` default limit and the `error` length floor (D5 and D3), set in tasks 2.1 and 1.1.
