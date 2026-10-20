---
title: "Use These Docs with Agents"
description: "How an AI agent can read this site as plain text, and how to install the cc-docs plugin that adds an MCP server and a skill."
url: https://xsyetopz.github.io/claude-code-docs/start/use-with-agents
source: docs/start/use-with-agents.md
---

# Use These Docs with Agents


An agent reads plain text better than a web page.
This site gives agents text files, a small manifest, and a plugin.
The plugin adds an MCP server (a program that gives an agent tools) and a skill that tells Claude when to use it.
The server has a bundled copy of every page, so it works offline and needs no network. It has no telemetry and sends no data about you. Refresh is off until you set `CLAUDE_CODE_DOCS_REFRESH=1` (see [Refresh from the Site](#refresh-from-the-site)).
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
| The MCP server `claude-code-docs` | Gives Claude four read-only tools. It runs with plain `bun`. You need no `bun install`. |
| The skill `claude-code-docs` | Tells Claude to look up settings, environment variables, hooks, and other Claude Code details here instead of from memory. It names the version and the badge meaning in each answer. |

The skill uses the MCP tools when they exist. If they do not, it fetches `llms.txt` and the page `.md` files.

## MCP Tools

All four tools only read. None changes a file or your settings.

| Tool | What it does |
| --- | --- |
| `search_docs` | Ranks pages for a query. Gives the route, title, URL, and a snippet for each hit. It takes `query`, `limit`, and `section`. |
| `read_page` | Gives a page as Markdown, or one H2 section of it. A long page comes in parts: pass `offset` to read the next part. |
| `list_pages` | Lists the pages in sidebar order. Pass `section` to see descriptions. |
| `get_schema` | Gives one of the six JSON Schemas. A schema is large, so you get an outline first. Pass `property` for one key, such as `hooks.PreToolUse`. |

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

## Refresh from the Site

The bundled copy covers Claude Code 2.1.304 and changes only when you update the plugin.
You can ask the server to fetch newer pages instead.

| Variable | What it does |
| --- | --- |
| `CLAUDE_CODE_DOCS_REFRESH=1` | Turns refresh on. The server fetches the manifest and each page the first time you read it. |
| `XDG_CACHE_HOME` | Sets the cache parent folder. The cache is `$XDG_CACHE_HOME/claude-code-docs`, or `~/.cache/claude-code-docs`. A cached file is used for 24 hours. |
| `CLAUDE_CODE_DOCS_SITE` | Fetches from a mirror instead. It must use `https`. Plain `http` works only for `localhost` and `127.0.0.1`. |

Each request stops after 5 seconds.
If a request fails, the server uses the bundled copy.
Refresh never delays the start of the server.
The server ignores any manifest entry with an odd route or a URL outside the site.

## Related Pages

- [How to Read These Docs](https://xsyetopz.github.io/claude-code-docs/start/how-to-read.md)
- [Plugin Manifest](https://xsyetopz.github.io/claude-code-docs/extend/plugins/manifest.md)
- [Plugin Loading](https://xsyetopz.github.io/claude-code-docs/extend/plugins/loading.md)
- [Marketplaces](https://xsyetopz.github.io/claude-code-docs/extend/plugins/marketplace.md)
