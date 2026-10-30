# Design: The `claude-resources` Doc Source

## Context

`clawdipedia-docs` serves four sources behind one tool set. Three are documentation:
`clawdipedia` (this site), `platform` (platform.claude.com), and `code` (code.claude.com).
The fourth, `anthropic`, reads `www.anthropic.com` news, research, and legal pages.

The user asks to drop `anthropic`, because the pages are bare HTML that the plugin does not need, and
to put `https://claude.com/resources/` in its place.

## What the Two Sites Give

Measured 2026-10-30 with `curl` and a local parse.

| | `www.anthropic.com` (today) | `claude.com/resources` (new) |
| --- | --- | --- |
| Sitemap | one flat `<urlset>` | one flat `<urlset>`, 4,144 `<loc>` entries, 368,066 bytes |
| Pages in scope | news, research, legal | 547 under `https://claude.com/resources` |
| Sections | first path segment | second path segment |
| `llms.txt` | none | none (404) |
| Markdown form | none | none (404) |
| Page body | HTML | HTML, server-rendered |
| robots.txt | — | 200, no `Disallow` |

The 547 split into 274 articles, 146 guides, 117 webinars, 4 webinar series, and 6 hub pages.
`https://claude.com/resources/articles/claude-duet` returned 200 `text/html`, and its `<article>`
element held 10,470 characters of body text in the first response. So no JavaScript is needed.

## Decision

Keep the shape of `anthropic.ts` and change its three site-specific parts. The module is already a
generic "sitemap plus HTML" source: `parseSitemap`, a `SearchIndex` over slug words, `readPage`, and
`nearAnthropic`. Only the base URL, the path filter, and the section rule are site-specific.

### 1. Path Filter

`claude.com/sitemap.xml` is not a scoped sitemap. It holds 4,144 URLs: marketplace pages, locale
copies under `/de/`, `/fr/`, `/es/`, `/it/`, `/ja/`, and `/ko/`, and the docs. 962 hold `/resources`,
and only 547 start with `https://claude.com/resources`.

So `normalizeClaudeResourcesPath` accepts a path only when its first segment is `resources`.
A locale copy such as `/ja/resources/articles/x` fails that test, because its first segment is `ja`.
This one rule drops both the other sections and the locales, with no list of locale codes to keep up
to date.

The alternative, a locale deny list, was rejected: a new locale would leak pages into the index, and
the index title and search text would be in a language the reader did not ask for.

### 2. Section

`anthropic.ts` takes the section from the first path segment. Here the first segment is always
`resources`, so the section comes from the second: `articles`, `guides`, `webinars`, or
`webinar-series`. A hub page such as `resources/best-practices`, which has no second segment, is its
own section, so `list_pages` can still name it.

### 3. Root

`anthropic.ts` maps `/` to the route `index`. There is no site root here: the source starts at
`resources`. So the route `resources` is the hub page, and there is no special `ROOT` constant.
`https://claude.com/resources/` answers 308, so the source requests `https://claude.com/resources`
with no trailing slash, which matches what the sitemap lists.

## Naming

The source name is `claude-resources`, not `claude`. The site `claude.com` also serves
`code.claude.com` docs, which the `code` source already reads, so a bare `claude` would not say which
part it reads.

The base URL override becomes `CLAUDE_RESOURCES_BASE_URL`, and the cache prefix becomes
`claude-resources/`.

## No Alias

`source: "anthropic"` and `--source anthropic` stop working, with no alias. An alias would be worse
than an error: the pages behind the old name are gone from the plugin, so an alias would answer a
request for Anthropic news with a Claude product article. The error already lists the valid sources,
which is what a caller needs.

This is breaking, so `clawdipedia-docs` and `clawdipedia-docs-cli` take a major bump.

## Risks

- The HTML of `claude.com` is Next.js, and the fetched page carried 78 `__next_f` flight-data blocks
  around a single `<article>` element. `html.ts` must keep the `<article>` body and drop the chrome,
  or a reader gets navigation and script payload. The test of task 6.1 pins this.
- A page is 507,023 bytes, against the `PAGE_MAX` of 4 MB that `anthropic.ts` sets. The cap holds.
- The sitemap is 368,066 bytes, against `SITEMAP_MAX` of 2 MB. The cap holds, with room for growth.
- The sitemap has no `<lastmod>` for every entry in `claude.com`'s file. The `description` field falls
  back to the slug words, as it already does when `lastmod` is missing.
