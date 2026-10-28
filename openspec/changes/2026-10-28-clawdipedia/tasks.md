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
- [x] 2.11 Check: `bun run plugin:build` built both servers, `bun run plugin:check` printed
  `manifests valid, plugin files present`, and `bun test cli/ plugin/` gave 99 pass, 0 fail.
  All four passed in the session of 2026-10-28: `plugin:check` says manifests valid and plugin files
  present, `bun test cli/` gives 20 pass and 0 fail, and `bun test plugin/` gives 79 pass and 0 fail.
  The box stays open because the box hook keeps no record of a check run before a context handoff.

## 3. Site Name and URL (`docusaurus.config.ts`, `schemas/`, `src/`, `.github/`, `README.md`)

The owner registered `clawdipedia.cc` on Cloudflare, so the site moves to Cloudflare Pages and the
host changes as well as the name. The owner chose the Cloudflare Pages Git integration over a Wrangler
step in Actions, so no Cloudflare credential enters this repository. The owner also chose a clean break
for the schema `$id` addresses: the old ones are not served.

- [x] 3.1 `docusaurus.config.ts`: `title` and the navbar title to `Clawdipedia`, `projectName` to
  `clawdipedia`, `url` to `https://clawdipedia.cc`, `baseUrl` to `/`, and the footer and announcement text.
- [x] 3.2 `src/plugins/llms-txt/index.ts`: the site name in the generated header. It builds its base
  from `siteConfig.url` and `siteConfig.baseUrl`, so it needed no change for the new host.
- [x] 3.3 `tools/schemas/build.ts` and `tools/schemas/code/ctx.ts`: the `$id` base URL to
  `https://clawdipedia.cc/schemas`, then `bun run schemas`. `tools/plugin/check.ts` and
  `tools/llms/check.ts` hold the same base and changed with them.
- [x] 3.4 Every `https://xsyetopz.github.io/clawdipedia/` URL in `docs/` (31 pages), the manifests,
  `plugin/skills/clawdipedia-docs/SKILL.md`, `plugin/mcp/src/manifest.ts`, `cli/package.json`,
  `plugin/mcp/test/fixtures/site/`, and `tools/schemas/fixtures/` moves to `https://clawdipedia.cc/`.
- [x] 3.5 `.github/workflows/deploy.yml` is now `.github/workflows/checks.yml`. Cloudflare Pages
  deploys, so the `upload-pages-artifact` step, the `deploy` job, and both repository checks are gone.
  The job keeps every check and the build.
- [x] 3.6 `README.md`: the name, the URL, the plugin names, the tracked version, and a Deploy section
  with the Cloudflare project settings.
- [x] 3.7 Check: `bun run verify` passed every step, which chains `schemas:check` (17 schemas valid)
  and `build` (`[SUCCESS] Generated static files in "build"`).
- [ ] 3.8 Owner step: connect the repository in the Cloudflare Pages dashboard, set the build command,
  the output directory `build`, and `BUN_VERSION`, then point `clawdipedia.cc` at the project.

## 4. Prompts Section Groups (`tools/capture-prompts/`, `docs/prompts/`)

- [x] 4.1 Add a `group` field to `Variant` in `tools/capture-prompts/variants/base.ts`, and set it on
  every variant in `variants/*.ts`.
- [x] 4.2 `render/ctx.ts` and `render/variant.ts`: write `docs/prompts/<group>/<id>.md`, write each
  `_category_.json`, and fix each relative link, which now needs one `../`.
  `render/groups.ts` holds the 10 groups and writes each `_category_.json`. A group whose folder holds
  a page named after it carries `ownPage: true`, so its category links that page. Docusaurus gives such
  a page the route of the folder, and a generated index of the same category claims the same route, which
  fails the build. `render/groups.test.ts` checks the flag against the folder contents.
- [x] 4.3 `render/hand.ts`, `render/listing.ts`, `render/index.ts`: read and write the hand-written
  pages from their group folders, and keep the index tables linking correctly.
- [x] 4.4 `tools/release/claims/map.json`: the new paths of the prompts pages.
- [x] 4.5 Run `bun tools/capture-prompts/render.ts`, then delete the old flat pages with `git rm`.
  `docs/prompts/` now holds only `index.md` plus the 10 group folders.
- [x] 4.6 Check: `bun run lint` printed `0 issues in 0 files`, `bun run check:docs` printed
  `ok (320 files scanned)`, and `bun run build` printed `[SUCCESS]`.

## 5. Navigation (`docs/index.mdx`, Each `_category_.json`, Each Section Index)

- [x] 5.1 Group `docs/extend/mod-api/` so that no group holds more than about 10 pages.
  The call pages moved to `calls/`, the event pages to `events/`, and the UI pages to `ui/`.
- [x] 5.2 Rewrite `docs/index.mdx` as a task-first map: a question in the left column and its page in
  the right column. The `Find an Answer by Question` table holds 19 rows.
- [x] 5.3 Give every `_category_.json` a `link` with a `description`, so each group has a landing page.
  15 of them carry no `link` key, and each of those folders holds an `index.md`, which Docusaurus
  links as the category page by itself. So every group has a landing page and the key would be
  redundant. Its description would also repeat the `description` front matter of the index page.
- [x] 5.4 Add the missing `description` front matter to every page. No page is missing it.
- [x] 5.5 Check: `bun run build` printed `[SUCCESS]`, and `bun run llms:check` printed
  `ok: 252 pages, 272 links`.

## 5a. Page Size (`docs/configure/`, `docs/extend/hooks/`, `docs/extend/mod-api/types/`, `src/css/`)

No page holds its contents for a reader or an agent past about 300 lines, so each longer page becomes a
section. A split re-keys every claim on a line that moves, because `claimId` hashes the file path.

- [x] 5a.1 `docs/configure/keybindings.md` (535 lines) becomes a section of 4 pages. 13 claim keys moved.
  `tools/surface/coverage.ts` named the old path in `PAGES`, so 111 items showed as unmapped until it
  pointed at the folder. 159 routes in `tools/surface/map.json` moved with it.
- [x] 5a.2 `docs/configure/models-and-providers.md` (422 lines) becomes a section of 4 pages.
- [x] 5a.3 `docs/extend/hooks/events.md` (627 lines) keeps the table of all 33 events and links
  `tool-events.md`, `session-events.md`, and `agent-events.md`. 5 claim keys moved.
- [x] 5a.4 `src/css/custom.css` (539 lines) becomes 13 files that `custom.css` imports in the original
  order. No declaration changed. The built stylesheet loses 7 literal `font-family` fallbacks, because
  the Docusaurus PostCSS step writes a fallback before a `var()` only from variables in the same file.
  Infima needs CSS variables, so a browser without them cannot render the site in any case.
- [x] 5a.5 `inspect/mcp/test/server.test.ts` (560 lines) becomes 5 test files and `server-harness.ts`.
  The test names before and after are the same 33, and the counts stay 136 pass, 17 skip, 0 fail.
- [x] 5a.6 Split the 7 pages of `docs/extend/mod-api/types/` that are over 300 lines: `ui.md` (939),
  `turn-prompt.md` (820), `classic.md` (627), `session.md` (614), `testing.md` (413),
  `tool-command-config.md` (386), and `infra.md` (355). Every split falls on a `###` line, because no
  page holds a `##` heading inside its type list. 20 claim keys moved. The largest hand-written page
  left is 279 lines.
- [x] 5a.7 Check: `bun run surface:check` printed `every item is mapped or excluded`,
  `bun run release:claims -- --check` printed `claims check ok` with 259 claims and 0 unmapped, and
  `bun run build` printed `[SUCCESS] Generated static files in "build"`.

## 5b. Glance Table Removal (`docs/**`, `tools/capture-prompts/render/`, `docs/contributing/`)

The repo owner wrote that the tables are "sheer annoyance" and that the site should be "actually a
documentation website, not a trash dump that narrates itself and states the obvious every index page".
A row such as `| Can you use it? | ✅ Yes. |` carries no fact, but a row often holds a switch, a path,
or a count that no other line holds.

- [x] 5b.1 Remove the section from all 24 pages that carried one. Before a row goes, each fact in it
  must appear elsewhere on the page, in a sibling page of the folder, or on the page the row links to.
  A fact found nowhere else moved into the page lead.
- [x] 5b.2 Keep each badge note with text of its own. `docs/extend/mod-api/index.md` moved its VS Code
  `<Differs>` note into `## Known Gaps`, which re-keyed one claim from `#at-a-glance:1325b7a6` to
  `#known-gaps:313a0dba`. The other two notes of that row were already bullets of that section.
  `docs/configure/settings/index.md` kept its `2.1.312` key-count sentence byte for byte.
- [x] 5b.3 Drop a `| Status |` roll-up row only where the item tables of the page or its folder carry
  the same badges. `models-and-providers/index.md` and `permissions/index.md` have no item table of
  their own, and every sibling page in both folders has a `Status` column.
- [x] 5b.4 `docs/prompts/index.md` is generated, so `tools/capture-prompts/render/index.ts` changed:
  the heading is now `## Every Prompt and How to Change It`, and the narration line is replaced by the
  one sentence that explains the parenthesis after a prompt name. `handGlance` is now `handIndexRow`.
- [x] 5b.5 Drop the convention from the text that teaches it: the `### At a Glance Template` and the
  page-shape item of `docs/contributing/style-guide.md`, and the section of `docs/start/how-to-read.md`
  with its front-matter description. Both skills used `At a Glance` as the example of a section name
  for a lookup, so both now name a heading that exists.
- [x] 5b.6 Check: `bun run verify` passed every step, and `bun test` gave 312 pass, 17 skip, 0 fail.
  No `#at-a-glance` anchor is left in the repository. The only `At a Glance` text left in `docs/` is
  inside a captured Anthropic prompt, which stays byte for byte.

## 6. ASD-STE100 Rewrite (`docs/**`, Prose Only)

- [x] 6.1 Rewrite each prose page with the `asd-ste100:rewrite` skill, one section at a time.
- [x] 6.2 Keep the exact bytes of every capture block in `docs/prompts/`, every generated table, and
  every quoted program text. A line that holds a `2.1.<n>` version string also stays byte for byte,
  because `claimId` hashes the sentence. Those lines keep their `ste-lint` findings.
- [x] 6.3 Check: `bun run lint` printed `0 issues in 0 files`, `bun run check:docs` printed
  `ok (320 files scanned)`, and `bun run check:examples` passed inside `bun run verify`.

## 7. Close

- [x] 7.1 The rename is on `docs/start/use-with-agents.md`, lines 37 to 39, with the steps: remove the
  old plugin, install the new one, and change a `permissions.allow` rule that holds `mcp__cc-docs__*`.
  Not on `docs/start/what-changed.md`: line 7 of that page says it lists the changes in `2.1.312`, so a
  change to this site does not belong in its table.
- [x] 7.2 `CHANGELOG.md` holds every entry under `## [Unreleased]`. No `version:bump`: the repository
  has no tag, so the `0.2.0` in `package.json` is the release in progress and `[Unreleased]` is its
  notes. `bun run verify:locked` runs on each push, through the lefthook `pre-push` job.
- [ ] 7.3 Tell the user to rename the GitHub repository to `clawdipedia`.
