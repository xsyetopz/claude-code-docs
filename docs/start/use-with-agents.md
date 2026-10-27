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
| `/schemas/` | The JSON Schemas of every config file and payload, and the Mod API type file `claude-code.d.ts`. See [JSON Schemas](../reference/schemas.md). |

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
The first three take `source`. It is `"docs"` (this site) by default. With `"platform"`, they read the Claude API and platform docs at [platform.claude.com/docs](https://platform.claude.com/docs/en/home), which are separate from Claude Code.

| Tool | What it does |
| --- | --- |
| `search_docs` | Ranks pages for a query. Gives the route, title, URL, and a snippet for each hit. It takes `query`, `source`, `limit`, and `section`. The first search loads `llms-search-index.json` from the site in one request. If the site has no such file, it fetches every page once. With `source: "platform"`, it ranks platform pages by title, summary, path, and group from the platform `llms.txt`, and does not search page text. Then `section` is a platform group. |
| `read_page` | Gives a page as Markdown, or one H2 section of it. It takes `route`, `source`, `section_heading`, `offset`, and `max_chars`. A long page comes in parts: pass `offset` to read the next part. With `source: "platform"`, `route` is a path under `/docs/en/`, and only English pages are read. |
| `list_pages` | Lists the pages in sidebar order. Pass `section` to see descriptions. With `source: "platform"`, it lists the platform groups with their page counts, and `section` lists the pages of one group. |
| `get_schema` | Gives one JSON Schema, or with `name: "types"` the Mod API type file. A schema is large, so you get an outline first. Pass `property` for one key, such as `hooks.PreToolUse`, a definition such as `BashInput`, or a type such as `ToolCheckResult`. For a name it does not have, it returns the closest names it has. |

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

## Inspect Sessions and the Program

The same marketplace has a second plugin, `cc-inspect`.
It reads your session transcripts and the installed Claude Code binary.
It makes two kinds of network request: `release` `notes` runs `gh release view` to get the release notes, once for each version, and `code` `read` with `view: "readable"` runs `bunx @wakaru/cli@1.14.0`, once for each module.
It writes only its cache of cleaned code, under `CC_INSPECT_CACHE`, else `./captures` when that folder exists, else `~/.cache/cc-inspect`.

```text
/plugin install cc-inspect@claude-code-docs
```

It adds the MCP server `cc-inspect`, which runs with plain `bun`, and the skill `cc-inspect`, which tells Claude when to use it.
The server has 4 tools. Each takes an `action` or a `kind` that picks what it does, and the same parameter names: `version` (a version or a binary path), `query`, `name`, `offset`, and `limit`.

| Tool | Choice | What it does |
| --- | --- | --- |
| `sessions` | `action: "list"` | Lists the transcripts in `projects/` of the config folder (`CLAUDE_CONFIG_DIR`, or `~/.claude`), newest first. Pass `project` to narrow it. |
| `sessions` | `action: "read"` | Gives the lines of one `session`. Pass `type` to keep one line type, and `offset` to page. A session id prefix works. |
| `sessions` | `action: "search"` | Finds a `query` (text, or a regular expression with `regex`) in one session or in all of them. |
| `sessions` | `action: "validate"` | Checks each line against the [transcript schema](../reference/schemas.md) of its `type`, and lists the lines that do not fit. The schema is the one for Claude Code `2.1.311`. |
| `code` | `action: "installs"` | Lists the versions in `~/.local/share/claude/versions`, and marks the one that `~/.local/bin/claude` runs. |
| `code` | `action: "modules"` | Lists the files inside a binary. |
| `code` | `action: "search"` | Finds a `query` in the code of a binary, with the module and offset of each hit. |
| `code` | `action: "read"` | Gives a slice of one `module`. With `view: "readable"`, it gives the module after [Wakaru](https://github.com/wakaru-dev/wakaru) rewrote it for reading. The first call for a module runs `bunx @wakaru/cli@1.14.0`, which needs a network and takes a few seconds on a large module. Later calls read the cache. |
| `code` | `action: "find"` | Finds code by plain words in a `query`, such as "sleep Monitor until-loop". It ranks the functions of a prepared version by the words in their strings, property names, and labels, and gives the top 10 with module, offset, and first lines. |
| `code` | `action: "prepare"` | Cleans each module of a version (stable local names, then `bun fmt`) and indexes its functions, into the cache. |
| `surface` | `kind: "env"`, `"setting"`, and the other surface kinds | Lists the items of one kind, each with its default, gate, module, and offset when the code shows them. With no `kind`, it gives each kind with its count. |
| `surface` | `kind: "object-keys"` | Lists the keys of the object literal around an `offset` or an `anchor` text in a `module`, and follows spreads into the functions and modules they come from. |
| `surface` | `kind: "event-keys"` | Lists the OpenTelemetry events of a binary. With `name`, it merges the attribute keys of every place the program emits that event. |
| `surface` | `kind: "tool-gates"` | Lists the built-in tools of a binary. Each tool comes with the code in the tool list that turns it on or off, its own `isEnabled()` check when it has one, and the source of the functions they call. The filters of each session are not included, so a listed tool may still be off. |
| `release` | `action: "diff"` | Lists the functions changed, added, and gone between two versions (`from` and `to`), each with the changed lines of its cleaned code. Pass `name` to keep the changes that hold a text. |
| `release` | `action: "explain"` | For a `name` (a string, a command such as `/loops`, or a tool name), gives where its code is, who uses it, the gates and env reads that guard it, and whether each function is a no-op, a stub, or handled. |
| `release` | `action: "notes"` | Marks each line of the release notes of `version` as matched (a changed function or a `release:diff` item holds its code span or words), gated (the match reads a `tengu_` gate), or unmatched, against `from` (else the newest older install). A match is a lead to read, not a proof. |

The server also has 2 MCP prompts, which give an agent the steps of a task: `release_review` (with `from` and `to`) runs `prepare`, `diff`, and `notes`, then `find` and `explain` for each gated or unmatched line, and `explain_change` (with `name`) runs `find` and `explain` for one name.

In `object-keys` and `event-keys`, a key that ends in `?` is optional, and a value shown as `unknown` is computed, so its type is not known.
The code tools read the code with the [meriyah](https://github.com/meriyah/meriyah) parser and [eslint-scope](https://github.com/eslint/js/tree/main/packages/eslint-scope), so minified names do not matter.

## Related Pages

- [How to Read These Docs](how-to-read.md)
- [Plugin Manifest](../extend/plugins/manifest.md)
- [Plugin Loading](../extend/plugins/loading.md)
- [Marketplaces](../extend/plugins/marketplace.md)
