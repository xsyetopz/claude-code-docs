# Proposal: Clawdipedia

## Why

The site is hard to navigate (the user, 2026-10-28). Three facts show it:

- `docs/prompts/` holds 101 pages in one flat sidebar list.
- `docs/extend/mod-api/` holds 27 pages, 11 of them under `types/`.
- The sidebar has 8 top-level groups, and nothing tells a reader which group answers which question.

Text that a human cannot scan is also text a model cannot scan, so the same fix serves both readers.

The `cc-docs` plugin has a name that says less than it does. It already reads this site and
`platform.claude.com`. The user asks it to cover four sources under one name, "Anthropic Docs".

The site itself gets the name **Clawdipedia**.

## What Changes

### Name

- The site title, navbar, footer, announcement bar, `README.md`, and the `llms.txt` header become "Clawdipedia".
- `docusaurus.config.ts` moves to `projectName: "clawdipedia"` and `baseUrl: "/clawdipedia/"`.
  Every `$id` and `$schema` URL in `schemas/`, `docs/`, the manifests, and the test fixtures follows.
  The user renames the GitHub repository, because only the repository owner can.
- The plugin `cc-docs` becomes `clawdipedia-docs`, and `cc-docs-cli` becomes `clawdipedia-docs-cli`.
  The `displayName` of each is "Anthropic Docs" and "Anthropic Docs CLI", which carries the words the
  user asked for. `anthropic-docs` is not available: `claude plugin validate ./plugin` on `2.1.312`
  rejects it, because a third party's plugin name cannot start with `anthropic-` (the program).
  `claude plugin validate` accepts `clawdipedia-docs`, and it does not check `displayName`.
  The CLI binary `cc-docs` becomes `clawdipedia`. This is a clean break, with no alias
  (the user, 2026-10-28). The MCP tool names change from `mcp__cc-docs__*` to
  `mcp__plugin_clawdipedia-docs_docs__*`.
  `docs/start/what-changed.md` and the plugin pages state the break.
- The cache directory `~/.cache/claude-code-docs` becomes `~/.cache/clawdipedia`,
  and `CC_DOCS_CACHE_DIR` becomes `CLAWDIPEDIA_CACHE_DIR`.

### Plugin Sources

The `source` enum of `search_docs`, `read_page`, and `list_pages` grows from two values to four.

| Value | Host | Index | Page format |
| --- | --- | --- | --- |
| `clawdipedia` | this site | `manifest.json` | markdown |
| `platform` | `platform.claude.com` | `/llms.txt`, `## English` section | `/docs/en/<path>.md` |
| `code` | `code.claude.com` | `/docs/llms.txt` | `/docs/en/<path>.md` |
| `anthropic` | `www.anthropic.com` | `/sitemap.xml` | HTML, extracted from `<main id="main-content">` |

Facts behind the table, each from a `curl` run on 2026-10-28:

- `https://code.claude.com/docs/llms.txt` returns 200 `text/plain`, 63,686 bytes.
  It has no `## English` section, so it needs its own parser. Headings nest from `##` to `#####`.
  Each entry is `- [Title](https://code.claude.com/docs/en/<slug>.md): description`, with `: ` as the
  separator, where the platform index uses ` - `. Entries repeat, so the parser drops a repeated path.
- `https://code.claude.com/docs/en/overview.md` returns 200 `text/markdown`, 17,104 bytes, with no
  front matter. The same path without `.md` returns 200 `text/html`, 538,488 bytes, so the reader
  always appends `.md`.
- `https://code.claude.com/llms-full.txt` returns 302 to `https://www.claude.com/product/claude-code`.
  `https://code.claude.com/docs/llms-full.txt` returns 200 and 9,946,197 bytes, which is too large to
  fetch, so the `code` source reads one page at a time.
- `https://www.anthropic.com/llms.txt` returns 404, and no `.md` variant of a page exists
  (`https://www.anthropic.com/research/building-effective-agents.md` returns 404). So the `anthropic`
  source reads `https://www.anthropic.com/sitemap.xml` (200 `application/xml`, 75,583 bytes,
  587 `<loc>` entries) for its index, and converts page HTML to text. The prefixes with the most pages
  are `/news` (281), `/research` (212), and `/legal` (26).

### Navigation

- `docs/prompts/` gains one level of groups, from the groups the capture tool already has:
  Defaults, Output Styles, Context and Memory, Agents, Commands, Hooks, Skills, Tools, and Other.
  `tools/capture-prompts/` writes each page into its group folder and writes each `_category_.json`.
- `docs/extend/mod-api/` gains groups, so that no group holds more than about 10 pages.
- The landing page, each section index, and the navbar get a task-first map, so a reader who has a
  question reaches its page in two clicks.
- Every page gets a `description`, because search and `llms.txt` both read it.

### Language

- Every prose page passes an ASD-STE100 rewrite: one instruction per sentence, the active voice,
  simple tenses, and one meaning for each term.
- Three kinds of text keep their exact bytes, because they are evidence, not prose:
  `docs/prompts/` capture blocks, generated tables, and quoted program text.

## Capabilities

### New Capabilities

- `anthropic-docs-sources`: the plugin answers from four documentation sources under one tool set.

### Modified Capabilities

- `docs-mcp-server`: renamed, with a four-value `source` enum.
- `docs-cli`: renamed, with the same four sources.
- `tracked-release-docs`: the prompts pages live in group folders.

## Impact

`docusaurus.config.ts`, `sidebars.ts`, `docs/**`, `src/**`, `plugin/**`, `cli/**`, `.claude-plugin/`,
`schemas/**`, `tools/capture-prompts/**`, `tools/check/**`, `tools/llms/**`, `tools/plugin/**`,
`tools/version/bump.ts`, `.github/workflows/`, `README.md`, and `CHANGELOG.md`.
