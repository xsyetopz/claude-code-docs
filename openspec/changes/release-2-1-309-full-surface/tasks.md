# Tasks: Full Surface Map of Claude Code 2.1.309

Checks: `bun run verify:locked` is the full check (`CLAUDE.md`). cc-inspect tests: `bun test inspect/mcp/test`. cc-docs tests: `bun test plugin/mcp/test`.

## 1. Surface Extractors (cc-inspect)

- [x] 1.1 Check each anchor of `design.md` D1 against the `2.1.309` binary with `search_binary`, `read_module`, and `resolve_object`. For each kind, record the real anchor, or move the kind to the D2 fallback. Compare each kind's names with today's `strings` heuristic (`tools/release/diff/extract.ts`) and explain each name that only one side finds. Set the length floor of the `error` kind (D3) from the data. Write the result as a header comment in each extractor module. Verify: every D1 kind has an anchor or a stated fallback, and each one-sided name has a reason
- [x] 1.2 Add `inspect/mcp/src/surface/` with the `SurfaceItem` type and extractors for `env`, `flag`, `subcommand`, `slash-command`, `setting`, `hook-event`, and `gate`, each with a test on fixture code in the style of `inspect/mcp/test/server.test.ts` (CI has no binary), plus a test on the installed `2.1.309` that checks known names (for example `CLAUDE_CODE_DISABLE_ULTRAREVIEW_TRUST_CHECK` for `env`) and is skipped when that binary is missing. Verify: `bun test inspect/mcp/test` passes
- [x] 1.3 Add `tool`, `otel-event`, and `mod-api` extractors on top of `tools.ts`, `events.ts`, and `schemas/claude-code.d.ts`, with fixture tests and a skip-when-missing test on `2.1.309`. Verify: `bun test inspect/mcp/test` passes, and the `tool` names equal those of `list_tools`
- [x] 1.4 Add `keybinding`, `model`, `beta`, `endpoint`, `file`, and `permission-rule` extractors, with fixture tests and skip-when-missing tests on `2.1.309` that check known names from the current docs (`docs/reference/api/betas.md`, `docs/reference/api/endpoints.md`, `docs/configure/permissions/modes.md`). Verify: `bun test inspect/mcp/test` passes
- [x] 1.5 Add the `error` extractor with the D3 filter, and fixture and skip-when-missing tests with known texts. Verify: `bun test inspect/mcp/test` passes, and the test prints the item count

## 2. cc-inspect Lookup

- [x] 2.1 Add the `list_surface` tool (spec `inspect-surface-lookup`): `kind`, `binary`, `name`, `limit`, `offset`, the kinds overview, and the errors for an unknown kind or binary. Set the default `limit` from the largest kind (D5). Add tests for each spec scenario, including no writes. Update `inspect/skills/cc-inspect/SKILL.md`. Verify: `bun test inspect/mcp/test` passes
- [x] 2.2 Rebuild the bundle (`bun run plugin:build`), bump cc-inspect minor (`bun run version:bump -- cc-inspect minor`), and update the marketplace text. Verify: `bun run plugin:check` passes

## 3. Snapshot and Coverage

- [x] 3.1 Add `tools/surface/snapshot.ts` (D4) and the `surface` script. Write `captures/2.1.309/surface.json` and `schemas/surface.json`. Make `schemas:check` validate the shape and version of `schemas/surface.json`, and compare it with a fresh run only when the binary is installed (skip with a message otherwise, as CI has no binary: `.github/workflows/deploy.yml:68`). Add tests for the missing-binary error, the skip path, and byte-identical output on two runs. Verify: the tests pass, and `bun run schemas:check` passes
- [x] 3.2 Add `tools/surface/coverage.ts`, `map.json`, and `exclusions.json`, with a `--kind` option and the `surface:check` script, which fails on unmapped items and on stale entries. Add a test for each spec scenario. Do not add it to `verify` yet. Verify: the tests pass, and `bun run surface:check` prints the unmapped count for each kind as the baseline
- [x] 3.3 Add `tools/surface/render.ts`: generate `docs/reference/surface-coverage.md` and the counts in `docs/reference/undocumented.md` from the snapshot. Verify: the page counts equal the snapshot counts (test), and `bun run lint` and `bun run check:docs` pass
- [x] 3.4 Make `release:diff` compare surface snapshots for the covered kinds, keep `strings` for the rest, and list added, removed, and changed items by kind with their target page in `report.md`. Add the snapshot step to `tools/release/README.md`. Verify: `bun run release:diff -- --from 2.1.308 --to 2.1.309` writes a `report.md` with the snapshot sections, and it agrees with the 2.1.309 notes items already documented

## 4. cc-docs Core, MCP, and CLI

- [x] 4.1 Make `src/plugins/llms-txt/index.ts` write `search-index.json` (D6), with a build check that fails above the index cap. Verify: `bun run build` writes it, and the file holds every route of `llms-manifest.json`
- [ ] 4.2 Add `plugin/mcp/src/core.ts` and move `server.ts` onto it with the 4 tools, `source`, no `outputSchema`, and short descriptions (D7). Load the prebuilt index, with the fallback to pages on 404. Update `plugin/mcp/evaluation.xml` and `plugin/skills/claude-code-docs/SKILL.md`. Add tests: the `tools/list` size limit, no `platform` tool name, one index request and no page request on the first search, the 404 fallback, and an offline read. Verify: `bun test plugin/mcp/test` passes, and the size test prints the byte count
- [ ] 4.3 Add the `cli/` folder (D8): `src/cli.ts` with `search`, `read`, `list`, `schema`, `--source`, `--section`, `--limit`, `--json`, `--help`, and exit codes 0, 1, and 2. Add the bundle `bin/cc-docs`, `.claude-plugin/plugin.json` (`cc-docs-cli`, with a description that says it works only in Claude Code), `package.json` (`cc-docs`, `bin`, `files`), and `skills/cc-docs-cli/SKILL.md`. Add tests for each `docs-cli` spec scenario, including the same routes as `search_docs`. Verify: `bun test cli/test` passes, and `bun cli/bin/cc-docs search hooks` prints hits and a `Source:` line
- [ ] 4.4 Add a print probe case that runs a Bash command through the program and records whether `CLAUDE_PLUGIN_DATA` is set for a plugin `bin/` program (D9). Map its claim in `tools/release/claims/map.json`. Verify: `bun run release:probe:print -- --only <case>` writes its result, and the CLI cache text in the skill matches it
- [ ] 4.5 Wire the new plugin: add it to `.claude-plugin/marketplace.json`, `tools/plugin/check.ts` (the folder, bundle freshness, version match, no `.mcp.json` in `cli/`, no `bin/` in `plugin/`), `tools/version/bump.ts` (`cc-docs-cli`), and `plugin:build`. Bump `cc-docs` major. Update `README.md`, and add a `CHANGELOG.md` entry under `[Unreleased]` that maps the old tool names to the new ones. Verify: `bun run plugin:check` and `bun run plugin:smoke` pass

## 5. Docs Mapping

Each task adds rows to the existing section of its kinds, with badges and "the program" as the source, maps or excludes every item, and ends with `bun run surface:check -- --kind <kinds>` passing, plus `bun run lint` and `bun run check:docs`.
Items of claude.ai, Cowork, Claude Design, and artifacts are mapped like any other.

- [ ] 5.1 `env`: `docs/configure/env-vars/`. Verify: `surface:check -- --kind env` passes
- [x] 5.2 `flag`, `subcommand`, `slash-command`: `docs/configure/cli/`, `docs/extend/skills-and-commands/slash-commands.md`. Verify: `surface:check` passes for these kinds
- [x] 5.3 `setting`, `permission-rule`: `docs/configure/settings/`, `docs/configure/permissions/`. Verify: `surface:check` passes for these kinds
- [x] 5.4 `hook-event`, `mod-api`, `tool`, `otel-event`: `docs/extend/hooks/`, `docs/extend/mod-api/`, `docs/reference/tools/`, and a new `docs/reference/opentelemetry.md` (no page lists the events today; the env vars stay in `docs/configure/env-vars/telemetry-and-debug.md`). Payload fields only from `schemas/`. Verify: `surface:check` passes for these kinds
- [ ] 5.5 `gate`, `model`, `beta`, `endpoint`: the gated tables, `docs/configure/models-and-providers.md`, `docs/reference/api/betas.md`, `docs/reference/api/endpoints.md`. Verify: `surface:check` passes for these kinds
- [x] 5.6 `keybinding`, `file`: a new `docs/configure/keybindings.md` (no page lists the actions today; link it from `docs/configure/settings/ui.md`), and `docs/start/files-on-disk.md`. Verify: `surface:check` passes for these kinds
- [ ] 5.7 `error`: rows by family (D3) on the page of the feature that raises each family. Exclude the ES-module library errors that the module filter keeps (protobuf, XML, HTTP clients, and others) by group in `exclusions.json`, with a reason for each group (user choice, 2026-10-23). Then set `DRAFT` in `tools/surface/render.ts` to false, so the Surface Coverage page goes live (user choice, 2026-10-23). Verify: `surface:check -- --kind error` passes
- [ ] 5.8 Add `surface:check` to `verify`, and rerender the coverage page. Verify: `bun run surface:check` passes with no `--kind`

## 6. Release

- [ ] 6.1 Run `bun run verify:locked`, have the diff reviewed against this plan, then commit and push (pre-approved in the owner's `CLAUDE.local.md`). Verify: review finds no unfixed issue, and the pre-push `verify:locked` passes
- [ ] 6.2 Ask the owner to approve the registry publish of `cc-docs`, then publish it. Verify: `bunx cc-docs@<version> search hooks` prints hits from a clean temp folder
