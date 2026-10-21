---
title: Use These Docs with Agents
description: How an AI agent can read this site as plain text, and how to install the cc-docs plugin that adds an MCP server and a skill.
sidebar_position: 5
---

An agent reads plain text better than a web page.
This site gives agents text files, a small manifest, and a plugin.
The plugin adds an MCP server (a program that gives an agent tools) and a skill that tells Claude when to use it.
The server reads the live site and keeps a copy on disk, so it still answers when you are offline (see [Live Fetch and Cache](#live-fetch-and-cache)). It has no telemetry and sends no data about you: it only requests public pages.
Source: [llms.txt Proposal](https://llmstxt.org/) and [Model Context Protocol Specification](https://modelcontextprotocol.io/specification).

## Text Files

Every build writes these files. The base URL is `https://xsyetopz.github.io/claude-code-docs`.

| File | What it holds |
| --- | --- |
| `/llms.txt` | An index in the llmstxt.org format. One line per page, with its title, URL, and description. |
| `/llms-full.txt` | The text of every page in one file, in sidebar order. It is large. |
| `/<route>.md` | One page as clean Markdown. For example, `/configure/status-line.md`. |
| `/llms-manifest.json` | A list of pages with `route`, `title`, `description`, `section`, `md`, and `url`, in sidebar order. |
| `/schemas/*.json` | The six JSON Schemas of Claude Code settings, plugin files, and keybindings. |

An agent with a web fetch tool can start at `llms.txt`, pick a page, and fetch its `.md` file.

## Install the Plugin

The plugin is named `cc-docs`. The name `claude-code-docs` is the marketplace.

```text
/plugin marketplace add xsyetopz/claude-code-docs
/plugin install cc-docs@claude-code-docs
```

The plugin adds two things.

| Part | What it does |
| --- | --- |
| The MCP server `claude-code-docs` | Gives Claude seven read-only tools. It runs with plain `bun`. You need no `bun install`. |
| The skill `claude-code-docs` | Tells Claude to look up settings, environment variables, hooks, and other Claude Code details here instead of from memory. It names the version and the badge meaning in each answer. |

The skill uses the MCP tools when they exist. If they do not, it fetches `llms.txt` and the page `.md` files.

## MCP Tools

All seven tools only read. None changes a file or your settings.
The first four read this site. The last three read the Claude API and platform docs at [platform.claude.com/docs](https://platform.claude.com/docs/en/home), which are separate from Claude Code.

| Tool | What it does |
| --- | --- |
| `search_docs` | Ranks pages for a query. Gives the route, title, URL, and a snippet for each hit. It takes `query`, `limit`, and `section`. The first search fetches every page once. |
| `read_page` | Gives a page as Markdown, or one H2 section of it. A long page comes in parts: pass `offset` to read the next part. |
| `list_pages` | Lists the pages in sidebar order. Pass `section` to see descriptions. |
| `get_schema` | Gives one of the six JSON Schemas. A schema is large, so you get an outline first. Pass `property` for one key, such as `hooks.PreToolUse`. |
| `search_platform_docs` | Ranks platform pages by title, summary, path, and group, using the platform `llms.txt`. It does not search page text. It takes `query`, `limit`, and `group`. |
| `read_platform_page` | Gives one English platform page as Markdown, or one H2 section of it. It takes `path`, `section_heading`, `offset`, and `max_chars`. Only English pages under `/docs/en/` are read. |
| `list_platform_pages` | Lists the platform groups with their page counts. Pass `group` to list the pages of one group. |

Every result ends with a `Source:` line. It names the host and says whether the text is live, from the cache, or from the cache while offline.

## Use the Server with Other Clients

The server speaks MCP over stdio. Any MCP client can run it.
Clone the repo, then point the client at the built file.

```json title="MCP client config"
{
  "mcpServers": {
    "claude-code-docs": {
      "command": "bun",
      "args": ["/path/to/claude-code-docs/plugin/mcp/dist/server.js"]
    }
  }
}
```

In Claude Code, you can add it by hand with `claude mcp add claude-code-docs -- bun /path/to/claude-code-docs/plugin/mcp/dist/server.js`.

## Live Fetch and Cache

The server has no bundled copy of the pages.
It fetches the manifest, pages, and schemas from the site when a tool needs them, and the platform pages from platform.claude.com.
Each fetched file is saved on disk. If the network fails, the server serves the saved copy and the `Source:` line says it is offline.
If nothing is saved yet, the tool returns an error that says the host could not be reached.
The server starts without any network request.

### Settings

| Variable | What it does |
| --- | --- |
| `CC_DOCS_BASE_URL` | Fetches this site from a mirror instead of `https://xsyetopz.github.io/claude-code-docs`. |
| `PLATFORM_DOCS_BASE_URL` | Fetches the platform docs from a mirror instead of `https://platform.claude.com`. |
| `CC_DOCS_CACHE_DIR` | Sets the cache folder. If it is unset, the server uses `$CLAUDE_PLUGIN_DATA/cache`, then `$XDG_CACHE_HOME/claude-code-docs`, then `~/.cache/claude-code-docs`. |
| `CC_DOCS_CACHE_CAP_BYTES` | Sets the size cap of the cache in bytes. The default is 60 MB (`62914560`). |

A base URL must use `https`. Plain `http` works only for `localhost` and `127.0.0.1`. Any other value is ignored, and the server writes a warning to stderr.

### Cache Rules

| Rule | Value |
| --- | --- |
| Time to reuse a file without a request | Site manifest and platform `llms.txt`: 10 minutes. Site pages and schemas: 1 hour. Platform pages: 6 hours. |
| After that time | The server asks again. It sends `If-None-Match` or `If-Modified-Since` when it has a saved validator, and a `304` keeps the saved copy. |
| Request limits | 8 seconds per request, 6 requests at once, at most 3 redirects, and only to the same origin. A file over its size cap (1 to 2 MB) counts as a failure. |
| Failed request | The server serves the saved copy, if there is one. |
| `404` for a page or schema | The saved copy is deleted, and the tool says the page was not found. |
| `404` for the manifest or `llms.txt` | Counts as a failure, so the saved copy is used. |
| Over the size cap | The server deletes the least recently fetched files, platform pages first, then site pages and schemas. The index files are never deleted. |
| Folder that cannot be written | The cache lives in memory until the server stops. |

The server ignores any manifest entry with an odd route or a URL outside the site.
It does not send or keep cookies.

## Related Pages

- [How to Read These Docs](how-to-read.md)
- [Plugin Manifest](../extend/plugins/manifest.md)
- [Plugin Loading](../extend/plugins/loading.md)
- [Marketplaces](../extend/plugins/marketplace.md)
