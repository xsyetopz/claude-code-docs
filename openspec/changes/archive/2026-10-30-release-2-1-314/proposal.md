# Proposal: Release Claude Code 2.1.314, Drop the Release Archive, Swap the Fourth Doc Source

## Why

The site tracks `2.1.312`. [`2.1.314`](https://github.com/anthropics/claude-code/releases/tag/v2.1.314) shipped 2026-10-30.
There is no `2.1.313`: the GitHub tag `v2.1.313` returns 404, and the official changelog goes from `2.1.314` straight to `2.1.312`.
So one hop, `2.1.312` to `2.1.314`, covers every change.

Three user requests come with it:

1. The Release Archive is not needed. What Changed SHALL compare the tracked release with the one before it, and nothing older.
2. The `anthropic` doc source of `clawdipedia-docs` reads bare HTML pages of `www.anthropic.com` that the plugin does not need.
3. `https://claude.com/resources/` SHALL take its place, if it can be read.

Checked 2026-10-30 with `curl` and a local parse of the sitemap, so the swap is possible:

- `https://claude.com/robots.txt` returns 200 and has no `Disallow`. It names `https://claude.com/sitemap.xml`.
- `https://claude.com/sitemap.xml` returns 200 `application/xml`, 368,066 bytes, 4,144 `<loc>` entries. 962 of them hold `/resources`, and 547 start with `https://claude.com/resources`: 274 articles, 146 guides, 117 webinars, 4 webinar series, and 6 hub pages. The rest are localized copies under `/de/`, `/fr/`, `/es/`, `/it/`, `/ja/`, and `/ko/`, which the source leaves out.
- `https://claude.com/resources/articles/claude-duet` returns 200 `text/html`. Its `<article>` element holds 10,470 characters of body text in the first response, so no JavaScript is needed.
- `https://claude.com/llms.txt` returns 404, and a `.md` form of a page returns 404. So the source needs the sitemap and HTML to Markdown, exactly as the `anthropic` source works today.

## What Changes

### 1. Track `2.1.314`

Run the runbook in `tools/release/README.md` from `2.1.312` to `2.1.314`, and give every item a page or an exclusion.
From `captures/2.1.314/diff/report.md`:

- 11 new environment variables, such as `CLAUDE_CODE_UPFRONT_TOOLS` and `CLAUDE_CODE_STREAM_EVENT_MAX_LINE_BYTES`. 3 are gone: `CCR_PREFETCH_NETWORK`, `CCR_PREWARM_STAT`, and `CCR_PREWARM_VDA`.
- 1 new flag, `--agents-view-if-allowed`. 1 new command, `/send-to-project`. 2 new tools, `SendToProject` and `SendToProjectContext`.
- 1 new setting, `responseComparisonEnabled`. `idleCompaction` now says "Defaults to true", where `2.1.312` said that `true` does not turn it on.
- `permissions.blockWritesOutsideWorkingDirectories`, which the release notes lead with. It is new in the settings schema, and `blockReadsOutsideWorkingDirectories` gained "No allow rule lifts it."
- 1 new keybinding, `effortSlider:adaptive`. 2 new Mod API members, `$.ui.place` and `ui.place`.
- 8 new endpoints, 13 new error texts, 35 new gates, 10 gone.
- `sandbox.excludedCommands` and `sandbox.allowMachLookup` have new descriptions that change what a reader should do.

State a release-notes item only after a check in the program or a probe. Leave out VS Code, Cloud sessions, Remote Control, Claude Tag, and Code Review, which this site does not cover.

### 2. Remove the Release Archive

- Delete `docs/start/release-archive.md` with its `2.1.300` to `2.1.311` sections. The URL `/start/release-archive` stops resolving, and no redirect replaces it (the user, 2026-10-30).
- `docs/start/what-changed.md` holds the `2.1.314` section only, and compares it with `2.1.312`. The Earlier Releases section points at the official changelog instead.
- Fix the three pages that link to the archive: `docs/start/what-changed.md`, `docs/start/how-to-read.md:91`, and `docs/reference/probes.md:182`. The probes page keeps its `/artifacts` finding, with the fact inlined in place of the dead link.
- Drop the four `docs/start/release-archive.md` keys from `tools/release/facts/map.json`.
- Change step 11 of `tools/release/README.md`, which still tells the next release to move a section into the archive.

### 3. Swap `anthropic` for `claude-resources`

- `plugin/mcp/src/anthropic.ts` becomes a source over `https://claude.com`, which keeps only sitemap paths under `resources/`. Its section is the second path segment (`articles`, `guides`, `webinars`, `webinar-series`), and a hub page is its own section.
- `DOC_SOURCES` in `plugin/mcp/src/core/shared.ts` becomes `clawdipedia`, `platform`, `code`, `claude-resources`. There is no alias for `anthropic`: the pages behind it are gone from the plugin, so a stale call SHALL fail with the list of valid sources rather than return another site's pages.
- The `ANTHROPIC_SITE_BASE_URL` override becomes `CLAUDE_RESOURCES_BASE_URL`.
- Update `cli/src/cli.ts`, the two skills, `plugin/mcp/evaluation.xml`, and the tests in `plugin/mcp/test/`.

### 4. Release

Bump `src/version.ts` last, regenerate `schemas/` and the surface snapshot, bump the plugins, and write one `CHANGELOG.md` entry.
This change also carries the plugin bump and `verify:locked` that task 5.5 of `2026-10-28-release-2-1-312` left open.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `tracked-release-docs`: What Changed compares the tracked release with the one before it, and the Release Archive requirement is removed.
- `docs-mcp-server`: the fourth source is `claude-resources` over `https://claude.com/resources/`, not `anthropic` over `www.anthropic.com`.
- `docs-cli`: the `--source` values follow `DOC_SOURCES`.

## Impact

`docs/`, `tools/release/`, `tools/surface/`, `schemas/`, `src/version.ts`, `plugin/`, `cli/`, `.claude-plugin/marketplace.json`, and `CHANGELOG.md`.

Breaking for users: the `/start/release-archive` URL is gone, and `source: "anthropic"` and `--source anthropic` no longer work.
