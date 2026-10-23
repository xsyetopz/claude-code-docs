# Design: Full Surface Map of Claude Code 2.1.309

The what is in `proposal.md` and the four specs under `specs/`. The system view is in `architecture.md`. This file gives the how.

## Context

- Today the release diff finds 6 kinds with `strings` heuristics (`tools/release/diff/extract.ts`: `extractEnv` :74, `extractFlags` :105, `extractCommands` :125, `extractSettings` :147, `extractHooks` :176, `extractGates` :195).
  No tool extracts error messages, endpoints, files, permission rule forms, keybinding actions, or models.
- cc-inspect already reads modules out of the Bun-FS binary (`bunfs.ts`), parses them (`ast.ts`), follows object spreads (`resolve.ts`), and lists tools (`tools.ts`) and OpenTelemetry events (`events.ts`).
- `docs/reference/undocumented.md` is the only list across kinds: 1,535 items in 17 groups, kept by hand. It has no group for gates, keybindings, OpenTelemetry, error messages, endpoints, or files.
- The `cc-docs` server (`plugin/mcp/src/server.ts`) has 7 tools, each with an `outputSchema` (7 found by `grep`). Its `tools/list` reply is 15,468 bytes.
  The first `search_docs` fetches every page of the manifest, 6 at a time (`content.ts:204`, `fetcher.ts:10`).
- The site build writes `llms.txt` (44,969 bytes), `llms-manifest.json` (88,085 bytes), and `llms-full.txt` (4,072,705 bytes) (`build/`, 2026-10-23, from `src/plugins/llms-txt/index.ts`).
  The fetch caps are 1 MB for the manifest and schemas and 2 MB for a page (`content.ts:17-19`).

## Decisions

### D1. Surface kinds

Each kind gets one extractor module in `inspect/mcp/src/surface/<kind>.ts` with one function `extract(binary): SurfaceItem[]`.
The anchors below are proposed. Task 1.1 checks each one against `2.1.309` and records the real anchor in the module, or moves the kind to D2.

| Kind | What it lists | Proposed anchor in the code |
| --- | --- | --- |
| `env` | Environment variables the program reads | `process.env.X`, `process.env["X"]`, and calls of the env helper with a string literal |
| `flag` | CLI flags | Calls of `.option()` and `.addOption()` with a flag string |
| `subcommand` | `claude <name>` subcommands | Calls of `.command()` |
| `slash-command` | Built-in slash commands | Command objects with `name` and `type` of `"local"`, `"local-jsx"`, or `"prompt"` |
| `setting` | `settings.json` keys | The settings zod schema, by the path that `tools/schemas/generate.ts` uses |
| `hook-event` | Hook event names | The hook event enum |
| `tool` | Built-in tools | `tools.ts` (exists) |
| `otel-event` | OpenTelemetry events | `events.ts` (exists) |
| `gate` | Feature and server gates | `tengu_*` names passed to the gate helpers, with the literal default |
| `keybinding` | Keybinding actions and contexts | The keybindings schema enum |
| `model` | Model ids and aliases | String literals that match `claude-` model id forms, and the alias table |
| `beta` | `anthropic-beta` header values | String literals of the beta form near the header name |
| `endpoint` | Network endpoints | `https://` URL literals and path templates passed to the HTTP client |
| `file` | Files and folders the program reads or writes | Path literals joined to the config folder, the project folder, or the home folder |
| `permission-rule` | Permission rule forms and modes | Rule-parser patterns and the permission mode enum |
| `error` | Error and warning text a user can see | String literals in `throw new Error()` and in the log or print calls used for the user |
| `mod-api` | Mod API calls and events | `schemas/claude-code.d.ts` (exists), read as the source of truth |

Checked anchors on `2.1.309` (task 1.1). The first seven kinds have modules, and each module header records its anchor and its comparison with `tools/release/diff/extract.ts`. The old heuristic covers none of the other ten kinds, so they have no names to compare. Tasks 1.3 to 1.5 copy these anchors into the module headers. No kind needs the D2 fallback.

| Kind | Real anchor on `2.1.309` |
| --- | --- |
| `tool` | `baseTools` in `inspect/mcp/src/tools.ts` (the `list_tools` source) |
| `otel-event` | `eventSites` in `inspect/mcp/src/events.ts` |
| `mod-api` | `schemas/claude-code.d.ts`: the members of `CoreEngineInterface` (the `$` calls) and the keys of `EventOf` (`EventName`) |
| `keybinding` | Two string arrays in one module (`chunk-enj9vzgj.js`): contexts `["Global","Chat",…]` and actions `["…","chat:cancel",…]`, found by the literals `"Global","Chat"` and `"chat:cancel"` |
| `model` | Model ids: string literals that match `claude-<family>-<n>…` (for example the Vertex region table `[["claude-sonnet-4-5","VERTEX_REGION_…"],…]`). Aliases: the array that holds `"opusplan"` (`["sonnet","opus","haiku","fable","best",…,"opusplan"]`) |
| `beta` | String literals of the form `<name>-YYYY-MM-DD`: mostly the registry calls `v("long_context","context-1m-2025-08-07")`, plus loose constants sent as `"anthropic-beta"` (`"ccr-byoc-2025-07-29"`, `"oauth-2025-04-20"`). Not only near the header name, because the registry is apart from it |
| `endpoint` | The URL config object `{BASE_API_URL:"https://api.anthropic.com",TOKEN_URL:…}`, other `"https://…"` literals, and templates `` `${…BASE_API_URL}/api/oauth/profile` `` (the path part is the item) |
| `file` | Calls `join(base(), "<name>")` with a string literal last argument, where `base` is the config folder (`Le()`), as in `"history.jsonl"`, `"keybindings.json"`, `"managed-settings.json"` |
| `permission-rule` | Modes: the zod enum described `"Permission mode for controlling how tool executions are handled…"`. Rule forms: the parser that returns `{toolName, ruleContent}` and prints `` `${toolName}(${content})` `` (`chunk-4nvf1y9a.js`) |
| `error` | `throw Error("…")`, `throw new X("…")` where `X` is `Error`, `TypeError`, `RangeError`, `SyntaxError`, or a class that extends one, and `process.stderr.write(…)` with a literal or template. Factory throws such as `throw dyn("Cloud gateway")` are left out, because their argument is not the message. `console.error` is left out, because only bundled libraries use it (GrowthBook) |

Why: these are the kinds a user can use or change (`CLAUDE.md`: list only items a user can use or change), plus `error`, `endpoint`, and `file`, which users see or meet.
Items of claude.ai, Cowork, Claude Design, and artifacts fall under these kinds like any other (user, 2026-10-23).
Alternatives: also "MCP behaviours" as a kind. That is left out, because its user-facing parts are `setting`, `env`, `endpoint`, and `error` items, and the rest is not a list.
Prompts stay with `tools/capture-prompts/`, because they are text and not named items.

### D2. Fallback for a kind with no reliable anchor

When task 1.1 finds no AST anchor for a kind, the extractor uses the old `strings` heuristic for it, and its items carry `module: null`.
The coverage check treats such items the same way.
Why: the map must stay complete. A weaker source is better than a missing kind.

### D3. The `error` kind is filtered

Only text that reaches the user counts: thrown errors, and the stderr and UI print calls that task 1.1 names.
Strings shorter than 10 characters, strings with no space, and strings with no letters are dropped.
Why this floor (task 1.1, a sample of the first 200 throws of 1 to 20 characters on `2.1.309`): the texts with no space are internal codes (`"aborted"`, `"unreachable"`, `"bad_signature"`, `"transient"`), and the texts users see have two words or more (`"Not connected"`, `"Invalid mode"`, `"No auth available"`). Below 10 characters only codes and fragments remain (`"not JSON"`, `"opaque"`).
On the docs side, `error` items may be mapped in groups: one row can cover a family by its stable prefix (for example `Unknown hook type`, from `plugin/mcp/evaluation.xml`).
Why: an error list can run into the thousands. A row for each would bury the pages.
Alternative: leave errors out. The user asked for every functional surface, and error text is what users search for.

### D4. Snapshot and coverage files

- `tools/surface/snapshot.ts` imports the extractors from `inspect/mcp/src/surface/`, writes `captures/<v>/surface.json`, and with `--commit` writes `schemas/surface.json`.
- `tools/surface/coverage.ts` reads `schemas/surface.json`, `tools/surface/map.json` (item key to route and anchor), and `tools/surface/exclusions.json` (item key or prefix to reason).
  It also finds items named in docs tables by exact backticked name in the page of the kind, so most rows need no map entry.
- `tools/surface/render.ts` writes the coverage page `docs/reference/surface-coverage.md` and the counts in `docs/reference/undocumented.md`.
- New scripts: `surface` (snapshot and render), `surface:check` (coverage plus a render diff). `verify` runs `surface:check`.
Why a separate map: the claim map (`tools/release/claims/map.json`) maps sentences to probes, which is a different job.

### D5. `list_surface` reply

Markdown by default, one line for each item (`name`, `default`, `gate`, module:offset).
It pages with `limit` and `offset`, like `read_session`. The default limit is 200 and the maximum 400 (task 2.1, measured on `2.1.309` against the 40,000-character reply cap `MAX_CHARS`). The largest kind, `error` (4529 items, 107 characters a line on average), cannot fit one page, so the limit is set by reply size. The 200 longest lines of a kind take at most 33887 characters for every kind but `error` (47131, from its longest lines only). The 400 longest take at most 44231 (`flag`), and at most 31769 for `env`.
The kinds overview is one line for each kind with its count.

### D6. Prebuilt search index

`src/plugins/llms-txt/index.ts` also writes `llms-search-index.json`: `{ version, hash, pages: [{ route, title, description, headings, extra, body }] }`, which holds the fields that `search.ts` indexes.
Not `search-index.json`: the site search plugin (`@easyops-cn/docusaurus-search-local`) writes that name at the site root. Corrected 2026-10-23 after the two collided in the build.
The core builds BM25 from it in process.
This file is about the size of `llms-full.txt` (4,072,705 bytes), so it gets its own cap (proposed: 8 MB), and the cache stores it like a page.
The ETag or the `hash` decides reuse.
Why: one request in place of about 220, with the same ranking code.
Alternatives: ship BM25 postings in place of text (smaller, but snippets then need extra page fetches), or bundle the index into `dist/server.js` (no network call, but it goes stale between plugin releases).

### D7. Tool list cut

- Keep 4 tools (user choice, 2026-10-23). Add `source` to three of them.
- Drop `outputSchema` from every tool. Send `structuredContent` only when it holds everything that the text holds: when a reply has `structuredContent`, Claude Code 2.1.309 shows the model only that JSON and drops the text (`ds` in `chunk-gf8e163f.js`; the text goes through only behind the gate `tengu_eventual_noodle`). A tool that reads a page or a schema sends text only. Corrected 2026-10-23 after `read_page` returned no page text.
- Cut each description to what picks the tool and fills its arguments. Move the usage guidance to `SKILL.md`.
- Add a test in `plugin/mcp/test/server.test.ts` that measures `tools/list` against the spec limit.
Why: the schemas and the long descriptions are most of the 15,468 bytes (each tool is 1,757 to 3,064 bytes).

### D8. Core and front ends

- The core stays in `plugin/mcp/src/` (`content.ts`, `cache.ts`, `fetcher.ts`, `search.ts`, `platform.ts`, `types.ts`). A new `core.ts` exports `search`, `read`, `list`, and `schema`, each returning `{ text, data, source }`.
- `server.ts` becomes the MCP front end on `core.ts`.
- The CLI lives in a new plugin folder `cli/` with `src/cli.ts`, which imports `../../plugin/mcp/src/core.ts`, and is bundled to `cli/bin/cc-docs` with a `#!/usr/bin/env bun` first line.
- `cli/` is both the `cc-docs-cli` plugin (`.claude-plugin/plugin.json`, `bin/`, `skills/cc-docs-cli/SKILL.md`) and the registry package `cc-docs` (`cli/package.json` with `bin` and `files: ["bin/"]`).
- Argument parsing uses `util.parseArgs` from the Bun runtime, so the CLI has no dependency.
- `plugin:build` builds both bundles. `plugin:check` adds `cli` to its plugin list, checks bundle freshness, the version match, no `.mcp.json` in `cli/`, and no `bin/` in `plugin/`.
- `version:bump` gets a `cc-docs-cli` target with `cli/.claude-plugin/plugin.json` and `cli/package.json`.
Why one folder: a single version and a single bundle for both ways of shipping.
Alternative: a separate package folder, which needs a copy step and a second version.

### D9. CLI cache

The CLI uses the same cache order as the server: `CC_DOCS_CACHE_DIR`, then `CLAUDE_PLUGIN_DATA`, then `~/.cache/claude-code-docs`.
The docs say `${CLAUDE_PLUGIN_DATA}` is exported to hooks, MCP stdio servers, and LSP servers (`docs/extend/plugins/loading.md:35`), and they do not name the Bash tool.
So a CLI run from Bash most likely uses `~/.cache/claude-code-docs`.
Task 4.4 checks this with a probe.

## Risks / Trade-offs

- [An AST anchor finds too few items for a kind] -> Task 1.1 compares each extractor's count with the `strings` heuristic of today and lists the names only one side finds. A kind ships only when each gap is explained.
- [The `error` kind is too large to document] -> D3 filters it and allows rows that cover a family. The coverage page shows the count, so the size is visible.
- [Minified names change between versions, so anchors break on the next release] -> Extractors anchor on string literals and object shapes, never on minified names, as the cc-inspect skill already advises. The snapshot test runs on the installed versions.
- [Breaking tool rename strands users] -> Major bump of `cc-docs`, a changelog entry that maps old names to new, and the skill updated in the same release.
- [`llms-search-index.json` grows past the cap] -> A build check fails above the cap, so the cap is raised on purpose, not by accident.
- [Registry publish is outside the standing approval] -> Publish is its own task, run only after the owner approves it in that session.
- [The surface mapping is large: 1,535 items listed today, before the new kinds] -> Tasks split the docs work by kind. Each kind's task ends with the coverage check passing for that kind, so the work can stop between kinds.
