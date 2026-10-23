# Architecture: Full Surface Map of Claude Code 2.1.309

The why is in `prd.md`. This file is the whole-system view. Per-capability detail is in `design.md`.

## Components

1. **Surface extractors** (`inspect/mcp/src/`, new modules beside `tools.ts`, `events.ts`, and `resolve.ts`).
   One extractor for each kind of surface reads the installed binary through the existing Bun-FS module reader (`bunfs.ts`, `ast.ts`) and returns typed items.
   Kinds that the release diff finds today with text heuristics (`tools/release/diff/extract.ts`: env vars, flags, commands, settings, hook events, gates) move to AST-based extraction.
   Proposed new kinds: keybinding actions, error messages a user can see, network endpoints, files read or written, permission rule forms, and MCP behaviours.
   `design.md` fixes the final list.
2. **cc-inspect lookups** (`inspect/mcp/src/server.ts`).
   One `list_surface` tool takes a kind and an optional name filter, and calls the extractor of that kind.
   The existing `list_tools` and `resolve_event` stay as the detail views for tools and events.
3. **Surface snapshot** (`tools/surface/`, new).
   A script runs every extractor against one version and writes `captures/<v>/surface.json`.
   It also writes a committed, trimmed copy (`schemas/surface.json`) that the docs build and the checks read.
   The release diff (`tools/release/diff/`) compares two snapshots instead of two `strings` dumps for the kinds that the extractors cover.
4. **Coverage index and check** (`tools/surface/coverage.ts`, a generated page under `docs/reference/`).
   This maps each snapshot item to the doc page whose table names it, or to an exclusion entry with a reason (`tools/surface/exclusions.json`).
   It fails `verify` when an item has neither.
   It grows from, and replaces the hand counts of, `docs/reference/undocumented.md` (1,535 items in 17 groups today, per its summary).
5. **Docs pages** (`docs/`).
   New rows go into the existing section of each kind (for example `docs/configure/env-vars/`, `docs/extend/hooks/events.md`, `docs/reference/api/endpoints.md`).
   No new top-level section. A kind with no page today gets a new page inside its section (`docs/reference/opentelemetry.md`, `docs/configure/keybindings.md`).
6. **Docs search core** (`plugin/mcp/src/`, split into a library shared by two front ends).
   The site build emits a prebuilt search index (`llms-search-index.json`) beside `llms-manifest.json` (`src/plugins/llms-txt/index.ts`).
   The core loads that one file instead of fetching about 220 pages on the first search, and keeps the disk cache and offline fallback of `cache.ts`.
7. **cc-docs MCP server** (`plugin/`): a thin front end on the core with fewer, merged tools and short descriptions.
8. **cc-docs CLI** (new): a second thin front end on the same core, with `ctx7`-style subcommands (search, read, list, schema).
   It is shipped as one bundled Bun file in two ways: the `bin/` of a new plugin with no MCP server, and an npm package for `bunx`.
9. **Light skill** (in the new plugin): it tells the agent to call the CLI through Bash, and it does not need the MCP server.

## Data and Interfaces

- **Surface item**: `{ kind, name, version, module, offset, default?, values?, gate?, source }`.
  `source` is `"program"`, so pages can cite "the program".
  Optional fields hold only what the AST shows; a computed value is `unknown`, as in `resolve_object` today.
- **`surface.json`**: `{ version, generatedAt, kinds: { <kind>: SurfaceItem[] } }`. The committed copy drops `module` and `offset`, which change on every build.
- **Coverage map**: item key `<kind>:<name>` to a page route and an anchor, or to an exclusion reason.
- **`llms-search-index.json`**: a serialized BM25 index of the site pages (fields as in `search.ts`: title, description, headings, extra, body), with the site version and a content hash.
- **Core API** (TypeScript, used by both front ends): `search(query, { source: "docs" | "platform", limit })`, `read(route, { section })`, `list(prefix?)`, `schema(name, property?)`.
  Each result carries a `Source:` line (live or offline cache), as the MCP replies do today.
- **CLI**: `cc-docs <search|read|list|schema> ...`, plain text by default and `--json` on request, exit code 1 on no result.
  `design.md` gives the exact arguments.

## Constraints

- The program version is `2.1.309` (`src/version.ts`). Extractors read the installed binary only (`~/.local/share/claude/versions/`), and never run it against a real account. Probes use the fake key and stub in `tools/capture-prompts/` (`CLAUDE.md`).
- Before a page states a payload field, it must be found in `schemas/claude-code.d.ts` or a schema in `schemas/` (`CLAUDE.md`).
- Bun `1.4.4`. The CLI and both servers run on Bun with no install step. Bun 1.4.4 resolves a package import with no `node_modules` (the user's test, 2026-10-23). Committed bundles stay the rule (`tools/plugin/check.ts` checks freshness).
- claude.ai and Cowork do not install a plugin that has a `bin/` folder (`docs/extend/plugins/manifest.md:101`). So `cc-docs` gets no `bin/` and stays installable there, and the light plugin's description says it works only in Claude Code.
- Surfaces of claude.ai, Cowork, Claude Design, and artifacts that the binary holds are in scope for the map (user, 2026-10-23).
- Plugin names may not start with `claude-` (`tools/plugin/check.ts:51`).
- The site stays static on GitHub Pages. `llms-search-index.json` must stay within the 1 MB to 2 MB fetch caps of `content.ts`, or the caps change with it.
- `.markdownlint.jsonc`, `biome.json`, and `commitlint.config.mjs` stay unchanged (`CLAUDE.md`).
- A new way to probe the program goes into cc-inspect as an addition, with a test (owner's `CLAUDE.local.md`).

## Decisions

1. **Extractors live in cc-inspect, and the release toolkit imports them.**
   Why: one implementation serves agents (MCP) and the runbook (snapshot and diff), as the owner's rule asks.
   Alternatives: extractors in `tools/release/` (agents would lack them), or both (two copies drift).
2. **AST extraction over `strings` heuristics for the covered kinds.**
   Why: the heuristics are limited (for example 12 env prefixes in `extractEnv`) and cannot give defaults or gates.
   Alternative: widen the regexes. That is cheaper but still misses computed names and gives no location.
   `strings` stays as a fallback for kinds that no extractor covers yet.
3. **One `list_surface` tool with a `kind` argument, not one tool for each kind.**
   Why: this follows the goal of a small tool list (cc-inspect's is 11,698 bytes today).
   Alternative: a tool for each kind, which adds about 1 KB per tool.
4. **Items go into existing sections, plus one generated coverage index.** The user chose this on 2026-10-23.
   Alternative: a new Surface Map section, which repeats rows.
5. **The site build emits a prebuilt search index.**
   Why: the first search fetches about 220 pages today (`content.ts:204`, 6 at a time).
   Alternative: bundle the index into `dist/server.js`. That makes no network call, but the bundle goes stale between plugin releases, and live docs are a feature today.
6. **One search core with two front ends (MCP and CLI).**
   Why: the same answers whatever the transport, and one set of tests.
   Alternative: a CLI that only fetches `llms.txt` and the `.md` pages, which is simpler but repeats the search logic.
7. **Merge the 7 cc-docs tools into fewer tools, with a `source` argument for the platform docs.**
   The user allowed the breaking rename on 2026-10-23.
   This needs a major plugin bump and an update of the skill and `evaluation.xml` in the same change.
8. **The CLI ships in a new plugin with no MCP server, and on npm for `bunx`.** The user chose `bin/` plus `bunx` on 2026-10-23.
   Why a separate plugin: installing `cc-docs` starts its MCP server, so a user who wants no MCP cost needs a plugin without one.
   Also, a `bin/` folder in `cc-docs` would stop claude.ai and Cowork from installing it (`docs/extend/plugins/manifest.md:101`).
   Alternative: add `bin/` to `cc-docs` as well, which loses claude.ai and Cowork users and still loads the server.
   Publishing is an external action, so each publish needs the owner's approval and npm login.
   `design.md` picks the package name.
