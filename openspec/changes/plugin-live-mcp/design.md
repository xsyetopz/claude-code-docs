# Design: Live Docs MCP With Platform Docs

Task 1.1. No code changes here. Facts below were checked on 2026-10-21 (curl, read-only) and in `plugin/mcp/src/`.

## Endpoint Findings

| URL | Result |
| --- | --- |
| `https://xsyetopz.github.io/claude-code-docs/llms-manifest.json` | 200, `application/json`, 86,089 bytes, 215 entries `{route,title,description,section,md,url}`. Has `ETag`, `Last-Modified`, `Cache-Control: max-age=600`. `If-None-Match` and `If-Modified-Since` both give 304. |
| Our page `.md` (for example `/configure/status-line.md`) | 200, `text/markdown; charset=utf-8`, 17 KB, ETag and Last-Modified (same headers as above). Missing page: 404 `text/html`. |
| `/schemas/claude-code-settings.json` | 200, `application/json`, 257 KB, ETag and Last-Modified. The six schemas are the same as `SCHEMA_NAMES`. |
| `/schemas/` (directory) | 404. Fetch each file by name. |
| `https://platform.claude.com/llms.txt` | 200 with no redirect, `text/plain`, 87,515 bytes, `Last-Modified`, `Cache-Control: public, max-age=3600`, no ETag. `If-Modified-Since` gives 304. Sets a `__cf_bm` cookie (ignore it). |
| `https://platform.claude.com/docs/en/home.md` | 200 with no redirect, `text/markdown`, 15.7 KB, front matter `title`, `url`, `description`. `Cache-Control: private, no-store`, no ETag, no Last-Modified. So no conditional requests: use a TTL only. Missing page: 404 `text/plain`. |

`llms.txt` format: intro text, then a language table (only English has its content listed), then `## English` with `### Group` headings and 796 lines `- [Title](https://platform.claude.com/docs/en/<path>.md) - optional description`. There is no version in our manifest. Our `llms.txt` says "Claude Code 2.1.305" in line 3, and the plugin-manifest schema title ends with "(Claude Code 2.1.305)".

Platform docs also run their own MCP at `https://platform.claude.com/docs/mcp`. We do not use it: our server stays one stdio server with one cache.

## Plugin Data Folder

Claude Code 2.1.305 exports `CLAUDE_PLUGIN_DATA` to plugin MCP stdio servers.

- Docs: `docs/extend/plugins/loading.md` (line 35: "exports it to hooks, MCP stdio servers, and LSP servers"; line 20: the folder is `plugins/data/<id>/`, survives updates), `docs/extend/mcp/config.md` line 66.
- Binary (`strings` on `~/.local/share/claude/versions/2.1.305`): the MCP stdio launch builds `{CLAUDE_PLUGIN_ROOT: n.path, CLAUDE_PLUGIN_DATA: GWe(n.source), ...config.env}` and merges it into the server environment.
- It is unset when the server is started by hand (`claude mcp add ... -- bun .../server.js`, or the test harness).

Cache root, first match wins:

1. `CC_DOCS_CACHE_DIR` (tests and users).
2. `${CLAUDE_PLUGIN_DATA}/cache`.
3. `${XDG_CACHE_HOME:-~/.cache}/claude-code-docs` (as `content.ts` does now).

If the folder cannot be created or written, run with an in-memory cache only (no error to the user).

## Tool List

Existing names and inputs stay. Results gain a one-line source note (see Cache). Descriptions no longer name a version, because the version is now data: the result header says "Claude Code Docs (Claude Code 2.1.305)".

| Tool | Status | Source |
| --- | --- | --- |
| `search_docs` | kept | Our site, BM25 index from the manifest and page bodies. |
| `read_page` | kept | Our site, `<route>.md`. |
| `list_pages` | kept | Our manifest. |
| `get_schema` | kept | Our `/schemas/<name>.json`. |
| `search_platform_docs` | new | `platform.claude.com/llms.txt`. |
| `read_platform_page` | new | `platform.claude.com/docs/en/<path>.md`. |
| `list_platform_pages` | new | `llms.txt` groups. Small, but it keeps parity with `list_pages` and helps discovery. |

Names use a `_platform_` infix, so the model can tell the sources apart. Our site replaces code.claude.com, so there is no tool for those pages.

### `search_platform_docs`

- Inputs: `query` (string, 1-200), `limit` (1-25, default 8), `group` (string, optional, an `llms.txt` `###` group such as "Messages").
- Output: markdown list `n. **Title** (path \`build-with-claude/overview\`)`, URL, and description or snippet.`structuredContent {hits:[{path,title,url,group,score,snippet}], source}`.
- Index: built from `llms.txt` lines only (title weight 5, description weight 3, URL path tokens weight 3, group weight 2), with the same `tokenize` and BM25 as `search.ts`. Page bodies are not fetched for search (796 pages is too many requests). Bodies already in the cache are not indexed in v1. The description tells the model: search finds pages by title and summary; use `read_platform_page` for text.
- Errors: no hits gives a text answer (not `isError`) with tips. `llms.txt` unreachable and no cache gives `isError` "platform docs are offline and not cached yet".

### `read_platform_page`

- Inputs: `path` (string; accepts `build-with-claude/overview`, `/docs/en/build-with-claude/overview`, `.md`, or the full URL), `section_heading` (H2, optional), `offset`, `max_chars` (same limits as `read_page`: default 20000, max 40000).
- Output: same header line as `read_page`, then markdown. Platform pages carry JSX tags (for example `<HomePage>`); return as is.
- Path rule: after normalizing, only `docs/en/<[a-z0-9/_-]+>`. Anything else is rejected (no `..`, no other host). A path not in `llms.txt` is still tried (new pages) but an unknown path with a 404 returns the closest `llms.txt` matches.
- Errors: 404 gives the closest matches; offline and not cached gives `isError`.

### `list_platform_pages`

- Inputs: `group` (optional). Without it: groups with page counts. With it: `path: title. description`.
- Output: markdown plus `structuredContent {pages:[{path,title,group,description}]}`.

### Existing Tools: Behavior Changes

- `read_page` and `get_schema` fetch on demand and cache. `get_schema` outline mode needs the whole file: fetch, cache, parse.
- `search_docs` needs page bodies. See the fetch layer.
- Unknown route errors stay as today.

## Fetch Layer

New module `plugin/mcp/src/fetcher.ts` (HTTP and cache only). `content.ts` becomes a thin site model on top; a new `platform.ts` holds the `llms.txt` parser and model. `search.ts` gets a content-source parameter so both indexes share it (see Implementation Split).

- Base URLs: `CC_DOCS_BASE_URL` (default `https://xsyetopz.github.io/claude-code-docs`) and `PLATFORM_DOCS_BASE_URL` (default `https://platform.claude.com`). Replaces `CLAUDE_CODE_DOCS_SITE` and `CLAUDE_CODE_DOCS_REFRESH` (both removed; no alias, the old flag no longer means anything). Keep the existing rule: `https` only, `http` only for `localhost` and `127.0.0.1`; otherwise ignore the override with a stderr warning. Strip trailing slashes.
- Manifest entries: keep `sanitizeManifest`. Allowed origin is the configured base only. Routes must match `ROUTE_RE`. The fetch URL is built from the base and the route, not from the entry `md` or `url` fields (so a hostile manifest cannot redirect fetches). `url` is shown to the user only when it starts with the base.
- Redirects: follow at most 3, same origin only (`redirect: "manual"` loop or check `res.url`). Do not send cookies; ignore `Set-Cookie`.
- Timeout 8 s per request (`AbortSignal.timeout`); the manifest and `llms.txt` use the same. Response size cap: 2 MB for pages and `llms.txt`, 1 MB for the manifest, 1 MB for schemas (largest is 257 KB). Over the cap: treat as a failure.
- Headers: `User-Agent: claude-code-docs-mcp/<pkg version> (+https://github.com/xsyetopz/claude-code-docs)`, `Accept: text/markdown, text/plain, application/json;q=0.9`, plus `If-None-Match` or `If-Modified-Since` from cache metadata.
- Concurrency: at most 6 requests at once (small semaphore). Identical in-flight URLs share one promise.
- Search index (our site): at first `search_docs`, `list_pages` needs only the manifest. The BM25 index needs bodies of 215 pages (about 3 MB). Plan: load the manifest, then read each page from the cache or fetch it with concurrency 6 (expected 2-5 s cold at 8 s timeout per request). Pages that fail are skipped, and the result notes "index covers N of M pages". Warm start: all pages come from the cache without a network call if fresh, else revalidate with conditional requests in the background after answering (see Cache). The index rebuilds when `version` changes, as today.
  - Alternative if cold-start cost is too high: fetch `llms-full.txt` (one request) and split by page. Not chosen because we have not measured its format; revisit if the 215 requests hurt (open item for the implementer: measure and report).
- Index from `llms.txt` (platform): parse once per fetch, `## English` section only, ignore other `##` sections. Regex per line: `^- \[(.+?)\]\((https://platform\.claude\.com/docs/en/[^)\s]+?)\.md\)(?: - (.*))?$`. Path is the part after `/docs/en/`. Entries from other hosts are dropped.
- `search.ts` ranking stays (BM25, weights 5/3/3/1, phrase and title boosts). The only change: it reads text through an interface, `{ entries(), text(entry) }`, instead of `Content.readLocal`.

## Cache

- Location: see Plugin Data Folder. Layout under the root:
  - `site/llms-manifest.json`, `site/pages/<route>.md`, `site/schemas/<name>.json`
  - `platform/llms.txt`, `platform/pages/<path>.md`
  - each body file has a sibling `<file>.meta.json`: `{url, etag?, lastModified?, fetchedAt (ISO), status: 200, bytes, sha256}`
  - `index` is the manifest route `/` stored as `pages/index.md`.
- Paths: built only through the existing `inside(base, ...)` check plus the route regexes. A route that fails them is never written.
- Freshness TTL: manifest and `llms.txt` 10 min (GitHub's own `max-age=600`). Pages and schemas on our site 1 hour. Platform pages 6 hours (no validators, so a refetch is a full download). Within the TTL: serve from the cache, no request. After the TTL: send a conditional request when the cache has a validator. 304: update `fetchedAt` only. 200: replace body and meta. Platform pages have no validator, so a plain GET.
- When the manifest changes (new 200), pages whose ETag differs stay until their own TTL ends; no bulk invalidation. A page that is gone from the new manifest is not deleted (removal is the pruning rule below).
- Offline fallback: if the request fails (timeout, DNS, 5xx, size cap, 4xx other than 404) and a cached copy exists, serve it regardless of age and mark it. A 404 for a page means the page is gone: return not found, and delete the cached copy. If no cache exists, return `isError` with the cause ("could not reach xsyetopz.github.io and nothing is cached").
- Reporting: every tool result ends with one line `Source: <host>, <live|cache (revalidated, 304)|cache (fetched 3 d ago, offline)>`, and `structuredContent.source` carries `{origin, state: "live"|"cached"|"stale-offline", fetchedAt}`. `state` is `stale-offline` only when a network attempt failed. For search, the line states the oldest page used: "index built from 215 pages, 3 from cache (offline)".
- Size limits: total cache cap 60 MB. After a write, if the total is over the cap, delete the least recently fetched platform pages first, then our site pages, never the two index files. Per-file caps as in the Fetch Layer.
- Atomic writes: write to `<file>.<pid>.tmp` in the same folder, then `rename`. Write the body first, then the meta. A body without a valid meta counts as a cache without validators (usable, always revalidated by GET).
- Corruption: JSON parse error, size not equal to `meta.bytes`, or sha mismatch: delete both files and treat as a miss. Manifest or `llms.txt` that parses to zero entries: treat as corrupt. Two server processes may share the folder; rename makes that safe, and the worst case is a duplicate fetch.
- Startup: never block on the network. Start serving at once. The manifest is loaded lazily on the first tool call that needs it, with the rules above.

## What Gets Removed

- `plugin/mcp/snapshot/` (5.1 MB, 215 pages, 6 schemas, `manifest.json`, `version.json`).
- `tools/plugin-snapshot.ts` and the `plugin:snapshot` script in `package.json`.
- In `tools/plugin/check.ts`: the `plugin/mcp/snapshot/manifest.json` presence entry, and the whole snapshot freshness block (the `plugin-snapshot.ts` run and the file compare). Keep the bundle freshness check, but it must no longer need `build/llms-manifest.json` (today it is inside that `if`). The messages `run "bun run build && bun run plugin:snapshot"` go away.
- `refreshEnabled`, `CLAUDE_CODE_DOCS_REFRESH`, `CLAUDE_CODE_DOCS_SITE`, and the snapshot-path code in `content.ts`.
- `verify` in `package.json` calls `plugin:check`, which stays. No other verify step mentions the snapshot (checked). `.github/workflows/deploy.yml` runs `plugin:check` and installs `plugin/mcp` deps: unchanged.

Replacement checks in `plugin:check`:

1. Manifest and marketplace validation, file existence (`.mcp.json`, SKILL.md, `dist/server.js`), `claude plugin validate`: as now.
2. `bun test plugin/mcp/test`: now runs against a local mock server and needs no network and no snapshot (see Test Plan).
3. Bundle freshness: `dist/server.js` equals a fresh `bun build`. Always runs (not tied to `build/`).
4. New: a contract check against the built site, only when `build/` exists: every `build/llms-manifest.json` entry has `build/<route>.md`, each of the six `SCHEMA_NAMES` has `build/schemas/<name>.json`, and `SCHEMA_NAMES` in the server equals the schema files in `build/schemas/`. This replaces "snapshot is current" with "what the server will fetch exists".
5. No live-network check in `verify`. Add an opt-in `bun run plugin:smoke` (not in `verify`) that runs the server against the real sites: one search, one read, one platform search. For humans after deploy.

## Test Plan

Test file: `plugin/mcp/test/server.test.ts` (rewrite the "refresh" test; keep `get_schema` tests but point them at the mock). Use `Bun.serve` (Bun is the runtime) instead of `node:http`, one helper `mockSites()` that starts two listeners on port 0 and returns `{cc, platform, hits, setMode}`.

- The test spawns `dist/server.js` with `CC_DOCS_BASE_URL`, `PLATFORM_DOCS_BASE_URL`, `CC_DOCS_CACHE_DIR` (a temp dir), and `CLAUDE_PLUGIN_DATA` unset. The mock serves a 3-page manifest, three `.md` files, one small schema in each `SCHEMA_NAMES` slot (or a shared fixture), a small `llms.txt` with two groups and five lines, and two platform pages. Fixtures live in `plugin/mcp/test/fixtures/`.
- Cases:
  1. Search, read, list and schema work against the mock; result has `Source: ... live`.
  2. 304: set TTL to 0 via `CC_DOCS_TTL_SCALE=0` (test-only env, documented in the code); second `read_page` sends `If-None-Match`, mock returns 304, result says `cache (revalidated)`, the body is unchanged, `hits` shows the conditional header.
  3. Offline fallback: warm the cache, stop the mock (`server.stop(true)`), call again with TTL 0: result is the cached body with `stale-offline` and a fetched-at; a page that was never fetched returns `isError` naming the host.
  4. Platform without validators: second call within TTL makes no request; after TTL a plain GET.
  5. 404 for a cached page removes it and returns not found with near matches.
  6. Corruption: truncate a cached body, call again, the server refetches.
  7. Hostile manifest (port the current test): bad routes, foreign `url`, `..` routes are dropped, nothing is written outside the cache dir, and the fetch URL comes from the base, not from the entry.
  8. Size cap: mock sends a body over the cap, the tool fails cleanly.
  9. Data folder choice: with `CLAUDE_PLUGIN_DATA` set (temp dir) and no `CC_DOCS_CACHE_DIR`, files appear under `<dir>/cache/`.
  10. Platform path rules: `../x`, `docs/de/x`, and a foreign host are rejected.
- Unit tests (no spawn) for the `llms.txt` parser, `normalizeRoute`/path rules, and the cache (atomic write, meta, eviction) in `plugin/mcp/test/*.test.ts`.

## Docs and Eval Updates

Found with `grep -rln "plugin/mcp\|search_docs\|CLAUDE_CODE_DOCS_\|plugin:snapshot"`:

- `plugin/skills/claude-code-docs/SKILL.md`: add the three platform tools and when to use them (API, SDK, models, pricing, Agent SDK questions go to `*_platform_*`; Claude Code questions go to ours; code.claude.com is not used). Say results carry a `Source:` line and may be cached when offline. Keep the fallback list (plain `.md` URLs); add `https://platform.claude.com/llms.txt`.
- `plugin/.claude-plugin/plugin.json` `description`: replace "Works offline from a bundled snapshot." with "Reads the live docs and caches the last fetch for offline use." and list the new tools. `plugin:check` validates it against the schema.
- `docs/start/use-with-agents.md`: line 3 description, the lines 36-76 plugin text, and line 76 ("The bundled copy covers ... changes only when you update the plugin") become: live fetch, cache location, env vars (`CC_DOCS_BASE_URL`, `PLATFORM_DOCS_BASE_URL`, `CC_DOCS_CACHE_DIR`), and the offline behavior. Follow the style guide; env vars are the plugin's own, not Claude Code's, so no At a Glance badges for them.
- `plugin/mcp/package.json` description: unchanged except no snapshot wording (there is none now).
- No README exists for the plugin (`plugin/` has none); do not add one.
- `plugin/mcp/evaluation.xml` (20 pairs): keep the 20 for our site; they read via the tools and stay valid because the content is the same. Add 5 pairs for platform tools. Each must be a stable, single-answer fact verified from the real page at write time (for example the Messages API required headers from `api/messages`, or a model alias from the models overview). Also add one pair that needs `search_platform_docs` then `read_platform_page`. Any pair whose answer depends on the version stays as is.
- Docs pages and `openspec` archive files that mention the snapshot (`openspec/changes/archive/*`) are history: do not edit.

## Implementation Split

Each part fits a ~40-turn subagent. Order: 1.2, then 1.3 (needs the fetcher), then 1.4 and 1.5 (independent after 1.3; 1.5 needs 1.4's check changes only for the final run).

- 1.2 Server, our site (`fetcher.ts`, `cache.ts`, rewrite `content.ts`, tweak `search.ts` to the source interface, `server.ts` source lines and descriptions, `get_schema` live). Includes the bundle rebuild (`bun run plugin:build`). Verify: existing tests still pass after minimal fixture edits, plus a manual run against a mock. The version string comes from the schema title or `llms.txt`, whichever is cached first (see open question 2).
- 1.3 Platform tools (`platform.ts`, three tools in `server.ts`, reuse the fetcher and cache). Verify with the mock `llms.txt`. Rebuild the bundle.
- 1.4 Removal: delete the snapshot dir, `tools/plugin-snapshot.ts`, the script, the check blocks; add the contract check and `plugin:smoke`. Verify: `bun run plugin:check`, `bun run typecheck`, `bun run format:check`.
- 1.5 Tests (all 10 cases, fixtures, unit tests), `evaluation.xml`, SKILL.md, plugin.json, `use-with-agents.md`. Verify: `bun test plugin/mcp/test`, `bun run lint`, `check:docs`, `check:examples`. If too large for one agent, split tests from docs.
- 1.6 stays with the coordinator.

## Open Questions

1. Cold start for `search_docs` fetches 215 pages once (a few seconds). Accept, or switch to one `llms-full.txt` request? Default: accept, and measure in 1.2.
2. Where should the Claude Code version come from now? Default: parse it from `llms.txt` line 3 and the schema title. Cleaner: add a `version` file or wrap the manifest as `{claudeCode, pages}`, but that changes the manifest shape other readers use. Default is no site change.
3. Platform search covers titles and descriptions only. Is that enough, or should it also index bodies already cached? Default: titles and descriptions only for v1.
4. Languages: English only for platform docs (other languages show only counts in `llms.txt`). OK?

## User Decisions (2026-10-21)

- Cold search: fetch each page `.md` once, then cache. Measure in 1.2; switch to one `llms-full.txt` only if slow.
- Platform search: index `llms.txt` titles, descriptions, URL paths, and groups only. English only.
- Version string: parse it from `llms.txt` line 3 or the schema title. No site change.
