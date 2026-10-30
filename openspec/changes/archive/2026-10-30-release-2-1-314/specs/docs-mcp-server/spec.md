# Docs-Mcp-Server

## MODIFIED Requirements

### Requirement: Source Argument

`search_docs`, `read_page`, and `list_pages` SHALL take an optional `source`: `"clawdipedia"` (the
default, the unofficial Claude Code Docs), `"platform"` (platform.claude.com/docs),
`"code"` (code.claude.com/docs), or `"claude-resources"` (the articles, guides, and webinars under
`https://claude.com/resources`). The values SHALL come from one list, `DOC_SOURCES`.

The server SHALL NOT serve `www.anthropic.com`, and SHALL NOT accept `"anthropic"` as a source or as
an alias. A call with a source that is not in `DOC_SOURCES` SHALL fail with the list of valid values.

#### Scenario: Platform Search through Source

- **WHEN** an agent calls `search_docs` with `query: "prompt caching"` and `source: "platform"`
- **THEN** the reply lists platform.claude.com pages

#### Scenario: Other Sources

- **WHEN** an agent calls `search_docs` with `source: "code"` or `source: "claude-resources"`
- **THEN** the reply lists pages of that source

#### Scenario: Dropped Source

- **WHEN** an agent calls `search_docs` with `source: "anthropic"`
- **THEN** the call fails and the message lists `clawdipedia`, `platform`, `code`, and
  `claude-resources`

#### Scenario: Old Source Value

- **WHEN** an agent calls `search_docs` with `source: "docs"`
- **THEN** the call fails and the message names `clawdipedia`

### Requirement: Source Line and Offline Cache

Each reply SHALL end with a `Source:` line that says whether the text is live, from the cache, or
stale from the cache while offline.
When the cache is over its cap, the server SHALL delete pages of platform, code, and
claude-resources first, then site pages and schemas, and never the index files.

#### Scenario: Offline Read

- **WHEN** the network is down and a page was read before
- **THEN** `read_page` returns the cached text and a `Source:` line that says offline

## ADDED Requirements

### Requirement: Claude Resources Scope

The `claude-resources` source SHALL index only pages whose first path segment is `resources` on
`https://claude.com`, taken from `https://claude.com/sitemap.xml`.
It SHALL leave out every localized copy, such as a path that starts with `ja` or `de`, and every
page of another section of the site.
The section of a page SHALL be its second path segment, such as `articles`, `guides`, or `webinars`.
A page with no second segment, such as the hub `resources/best-practices`, SHALL be its own section.

#### Scenario: Locale Copy Left Out

- **WHEN** the sitemap holds `https://claude.com/ja/resources/articles/claude-duet`
- **THEN** no entry of the index has that path, because its first segment is `ja`

#### Scenario: Other Section Left Out

- **WHEN** the sitemap holds `https://claude.com/marketplace/connectors/x`
- **THEN** no entry of the index has that path

#### Scenario: Section from the Second Segment

- **WHEN** the sitemap holds `https://claude.com/resources/guides/claude-cowork-product-guide`
- **THEN** the entry's section is `guides`, and `list_pages` with `section: "guides"` lists it
