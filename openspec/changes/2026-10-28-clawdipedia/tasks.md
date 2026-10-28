# Tasks: Clawdipedia

Each group is one file set, so the groups can run in parallel. Run `bun run verify:locked` only after
every group is in, because it builds the site.

## 1. Plugin Sources (`plugin/mcp/`)

- [x] 1.1 Add `plugin/mcp/src/code.ts`: a parser for `https://code.claude.com/docs/llms.txt`.
  Take every line that matches `- [Title](<base>/docs/en/<slug>.md): description`. Keep the first
  entry for a path and drop a later repeat. Set the section to the nearest `##` heading.
  Read a page from `<base>/docs/en/<slug>.md`. Reuse `fetcher.ts`, `search.ts`, and `ContentError`.
  Allow an override with `CODE_DOCS_BASE_URL`, under the same rules as `PLATFORM_DOCS_BASE_URL`.
- [x] 1.2 Add `plugin/mcp/src/anthropic.ts`: an index from `https://www.anthropic.com/sitemap.xml`
  (`<loc>` plus `<lastmod>`), with the first path segment as the section and the slug words as the
  search text. Read a page as HTML and return text from `<main id="main-content">`.
  Take the title from `<title>`, without the ` \ Anthropic` suffix.
  Allow an override with `ANTHROPIC_SITE_BASE_URL`.
- [x] 1.3 Add `plugin/mcp/src/html.ts`: HTML to markdown for one article. Drop `script`, `style`,
  `nav`, `header`, `footer`, `svg`, and `noscript`. Keep `h1` to `h6`, `p`, `ul`, `ol`, `li`,
  `blockquote`, `pre`, `code`, `a`, `strong`, and `em`. Resolve a relative `href` against the page URL.
- [x] 1.4 Widen the `source` enum in `server.ts` and `core/shared.ts` to
  `clawdipedia`, `platform`, `code`, `anthropic`, with `clawdipedia` as the default.
  Branch in `core/search.ts`, `core/list.ts`, and `core/read.ts`.
- [x] 1.5 Tests: one test file for each new source, with a fixture index and a fixture page under
  `plugin/mcp/test/fixtures/code/` and `plugin/mcp/test/fixtures/anthropic/`. Cover a hit, a miss with
  near matches, a path that the rules reject, and an offline read from the cache.
- [x] 1.6 Check: `bun test` in `plugin/mcp/`.

## 2. Plugin Rename (`plugin/`, `cli/`, `.claude-plugin/`, `tools/plugin/`, `tools/version/`)

The name `anthropic-docs` is not available. `claude plugin validate ./plugin` on `2.1.312` answers:
"Plugin name `anthropic-docs` is reserved: it passes as one of Anthropic's own." A third party's name
cannot start with `claude-`, `anthropic-`, `anthropics-`, or `cc-plugin-` (the program). The validator
accepts `clawdipedia-docs`, `clawdipedia`, and `docs-anthropic`, and it does not check `displayName`.
So the manifest `name` is `clawdipedia-docs`, and the `displayName` keeps the words the user asked for.

- [x] 2.1 `plugin/.claude-plugin/plugin.json`: `name` to `clawdipedia-docs`, `displayName` to
  "Anthropic Docs". Rewrite the description to name all four sources, and state the version of
  Claude Code that the site tracks.
- [x] 2.2 `plugin/.mcp.json`: the server key to `docs`, which gives the tool prefix
  `mcp__plugin_clawdipedia-docs_docs__`.
- [x] 2.3 `plugin/mcp/package.json`: `name` to `clawdipedia-docs-mcp`.
- [x] 2.4 `plugin/mcp/src/server.ts`: the `McpServer` name to `clawdipedia-docs`.
- [x] 2.5 `plugin/skills/claude-code-docs/` to `plugin/skills/clawdipedia-docs/`, with the skill name
  and its `SKILL.md` body.
- [x] 2.6 `cli/`: plugin name `clawdipedia-docs-cli`, package name `clawdipedia-docs`,
  `bin/cc-docs` to `bin/clawdipedia`, the `bin` map, `cli/src/cli.ts` texts, and
  `cli/skills/cc-docs-cli/` to `cli/skills/clawdipedia-docs-cli/`.
- [x] 2.7 `plugin/mcp/src/cache.ts` and the CLI: cache directory `~/.cache/clawdipedia`, env vars
  `CLAWDIPEDIA_CACHE_DIR`, `CLAWDIPEDIA_BASE_URL`, `CLAWDIPEDIA_TTL_SCALE`, and
  `CLAWDIPEDIA_CACHE_CAP_BYTES`. `plugin/mcp/src/fetcher.ts`: User-Agent `clawdipedia-docs-mcp`.
- [x] 2.8 `.claude-plugin/marketplace.json`: `name` to `clawdipedia`, and the two renamed entries.
- [x] 2.9 `tools/version/bump.ts` and `tools/plugin/check.ts`: the new names.
  Fix the stale `2.1.309` version text in `plugin/.claude-plugin/plugin.json` and
  `cli/.claude-plugin/plugin.json`, and make `plugin:check` fail when a manifest names a version other
  than `src/version.ts`.
- [x] 2.10 `tools/plugin/smoke.ts` and `tools/release/probes/print/plugindata.ts`: the new names.
- [ ] 2.11 Check: `bun run plugin:build`, `bun run plugin:check`, `bun test cli/`, `bun test plugin/`.

## 3. Site Name and URL (`docusaurus.config.ts`, `schemas/`, `src/`, `.github/`, `README.md`)

- [ ] 3.1 `docusaurus.config.ts`: `title` and the navbar title to `Clawdipedia`,
  `projectName` to `clawdipedia`, `baseUrl` to `/clawdipedia/`, and the footer and announcement text.
- [ ] 3.2 `src/plugins/llms-txt/index.ts`: the site name in the generated header.
- [ ] 3.3 `tools/schemas/`: the `$id` base URL, then `bun run schemas`.
- [ ] 3.4 Every `https://xsyetopz.github.io/claude-code-docs/` URL in `docs/`, the manifests, and
  `plugin/mcp/test/fixtures/site/manifest.json` moves to `/clawdipedia/`.
- [ ] 3.5 `.github/workflows/deploy.yml`: the repository check at lines 77 and 82.
- [ ] 3.6 `README.md`: the name, the URL, and the plugin names.
- [ ] 3.7 Check: `bun run build`, `bun run schemas:check`.

## 4. Prompts Section Groups (`tools/capture-prompts/`, `docs/prompts/`)

- [ ] 4.1 Add a `group` field to `Variant` in `tools/capture-prompts/variants/base.ts`, and set it on
  every variant in `variants/*.ts`.
- [ ] 4.2 `render/ctx.ts` and `render/variant.ts`: write `docs/prompts/<group>/<id>.md`, write each
  `_category_.json`, and fix each relative link, which now needs one `../`.
- [ ] 4.3 `render/hand.ts`, `render/listing.ts`, `render/index.ts`: read and write the hand-written
  pages from their group folders, and keep the index tables linking correctly.
- [ ] 4.4 `tools/release/claims/map.json`: the new paths of the prompts pages.
- [ ] 4.5 Run `bun tools/capture-prompts/render.ts`, then delete the old flat pages with `git rm`.
- [ ] 4.6 Check: `bun run lint`, `bun run check:docs`, `bun run build`.

## 5. Navigation (`docs/index.mdx`, Each `_category_.json`, Each Section Index)

- [ ] 5.1 Group `docs/extend/mod-api/` so that no group holds more than about 10 pages.
- [ ] 5.2 Rewrite `docs/index.mdx` as a task-first map: a question in the left column and its page in
  the right column.
- [ ] 5.3 Give every `_category_.json` a `link` with a `description`, so each group has a landing page.
- [ ] 5.4 Add the missing `description` front matter to every page.
- [ ] 5.5 Check: `bun run build`, `bun run llms:check`.

## 6. ASD-STE100 Rewrite (`docs/**`, Prose Only)

- [ ] 6.1 Rewrite each prose page with the `asd-ste100:rewrite` skill, one section at a time.
- [ ] 6.2 Keep the exact bytes of every capture block in `docs/prompts/`, every generated table, and
  every quoted program text.
- [ ] 6.3 Check: `bun run lint`, `bun run check:docs`, `bun run check:examples`.

## 7. Close

- [ ] 7.1 `docs/start/what-changed.md`: the plugin rename as a breaking change.
- [ ] 7.2 `CHANGELOG.md`, `bun run version:bump`, `bun run verify:locked`.
- [ ] 7.3 Tell the user to rename the GitHub repository to `clawdipedia`.
