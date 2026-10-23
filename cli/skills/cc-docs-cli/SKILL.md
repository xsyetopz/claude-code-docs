---
name: cc-docs-cli
description: Look up how Claude Code really works, using the Claude Code Docs for version 2.1.309 through the cc-docs command in the Bash tool. Use this whenever the user asks about Claude Code settings, settings.json keys, environment variables, CLI flags, permissions, hooks, plugins, skills, subagents, MCP configuration, status line, output styles, files Claude Code reads or writes, internals, or undocumented or version-specific behavior, even if they do not name the docs. Prefer it over memory, because these pages check the real program against the official docs.
---

# Claude Code Docs From the Shell

The Claude Code Docs describe what Claude Code 2.1.309 does, checked against the program and not only against the official docs. Use them instead of memory for any detail that the user may act on: a key name, a default, an environment variable, a hook field. Memory of these details is often stale or wrong.

This plugin works only in Claude Code. It has no MCP server: you call the `cc-docs` command with the Bash tool. It needs Bun. If `cc-docs` is not found, run it with `bunx cc-docs` in its place.

## Find the answer

- `cc-docs search "PreToolUse timeout"`: ranked hits with a route, a title, a URL, and a snippet. Search an exact identifier (`CLAUDE_CODE_USE_BEDROCK`) or short keywords, not a whole question. `--limit <n>` (1 to 25, default 8) caps the hits.
- `cc-docs read configure/status-line`: the page as markdown. `--section "At a Glance"` prints only that H2 section. A long page ends its header line with `more: call again with offset=N`: pass `--offset N`.
- `cc-docs list` shows every section and its pages. `cc-docs list configure` shows one section with the description of each page.
- `cc-docs schema settings` prints the outline of a JSON Schema. `cc-docs schema settings hooks.PreToolUse` or `cc-docs schema tools BashInput.command` prints one property or definition. The names are `settings`, `managed-settings`, `plugin-manifest`, `plugin-hooks`, `marketplace`, `keybindings`, `mcp`, `agents-json`, `hook-output`, `tools`, `control-protocol`, `stream-json`, `frontmatter`, `status-line`, `transcript`, `otel`, and `claude-json`.
- `cc-docs schema types ToolCheckResult` prints the Mod API type file entry for a type, a member (`ToolCheckResult.plugin`), a call (`'$.tool.check'`), or an event (`tool.check`). `cc-docs schema types` lists the names.
- For the Claude API, SDKs, models, or prompt caching (not Claude Code itself), add `--source platform` to `search`, `read`, or `list`. That reads platform.claude.com/docs, which is not covered by the badges.
- Add `--json` for JSON. `cc-docs --help` and `cc-docs <command> --help` print the usage.

Exit codes: `0` a result, `1` no result (no hit, unknown page, or unknown schema property; the message on stderr names the closest routes or properties), `2` a usage error.

Each text output ends with a `Source:` line. If it says offline, the text comes from the disk cache and may be old: say so.

## Cache

The command keeps a disk cache so it works offline. The folder is the first of these:

1. `CC_DOCS_CACHE_DIR`
2. `${CLAUDE_PLUGIN_DATA}/cache`
3. `~/.cache/claude-code-docs`

When the command runs from the Bash tool, `CLAUDE_PLUGIN_DATA` is not set (probed on Claude Code 2.1.309: the plugin `bin/` is on the Bash PATH, and the variable is not set). So the cache is `~/.cache/claude-code-docs` unless `CC_DOCS_CACHE_DIR` is set.

## Read the badges

Tables have a Status column. State the badge when you report a fact, because it tells the user how far to trust it.

- Documented: an official docs page names the item.
- Undocumented: only the program shows it. It works today and can change without notice, so say so.
- Differs: the official docs and the program disagree. Report what the row says the program does.
- Gated: it works only behind a flag or a server gate. Name the gate.

## Answer

- Say which version the answer is for: Claude Code 2.1.309. If the user runs another version, say the page may not match it.
- Cite the page (its URL) next to each fact.
- Before you name a field of a payload (a `$` call, an event, a hook input or output, a tool input), look it up with `cc-docs schema`, and name only the fields you found. When a lookup comes back empty, tell the user the field is unconfirmed for this version and give the closest names the lookup returned.
- If the docs do not cover the question, say so. Do not fill the gap from memory as if it were documented.
