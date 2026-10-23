# docs-cli Specification

## Purpose
Let people and agents query the Claude Code Docs from a shell with one command, without the MCP server, through `bunx cc-docs` or the `cc-docs-cli` plugin.

## Requirements

### Requirement: Subcommands

The `cc-docs` command SHALL have the subcommands `search <query>`, `read <route>`, `list [prefix]`, and `schema <name> [property]`.
`search`, `read`, and `list` SHALL take `--source docs|platform`, with `docs` as the default.
`read` SHALL take `--section <heading>`.
`search` SHALL take `--limit <n>`.
Each subcommand SHALL print plain text by default and JSON with `--json`.
`cc-docs --help` and `cc-docs <subcommand> --help` SHALL print the usage.

#### Scenario: Search then read

- **WHEN** a user runs `cc-docs search "PreToolUse timeout"` and then `cc-docs read <route>` with a route from the first output
- **THEN** the first prints ranked hits with routes, and the second prints the page text, each ending with a `Source:` line

#### Scenario: JSON output

- **WHEN** a user runs `cc-docs search statusLine --json`
- **THEN** stdout is one JSON value that parses

### Requirement: Same Answers as the MCP Server

For the same query, route, or schema, the CLI SHALL return the same hits and text as the `cc-docs` MCP tools, because both use one search core.

#### Scenario: Agreement

- **WHEN** the same query runs through `cc-docs search` and through `search_docs`
- **THEN** both list the same routes in the same order

### Requirement: Exit Codes

The CLI SHALL exit 0 on a result, 1 when a search, page, or schema property has no result, and 2 on a usage error, with the message on stderr.

#### Scenario: Unknown page

- **WHEN** a user runs `cc-docs read no/such/page`
- **THEN** it exits 1 and stderr names the closest routes

#### Scenario: Usage error

- **WHEN** a user runs `cc-docs frobnicate`
- **THEN** it exits 2 and stderr shows the usage

### Requirement: Runs With No Install Step

The CLI SHALL run as one bundled file on Bun, through `bunx cc-docs` and through the `bin/` of the `cc-docs-cli` plugin, with no install step.
It SHALL use the same disk cache rules as the MCP server.

#### Scenario: Plugin bin

- **WHEN** the `cc-docs-cli` plugin is installed in Claude Code
- **THEN** the Bash tool can run `cc-docs search hooks`

### Requirement: Light Plugin and Skill

The `cc-docs-cli` plugin SHALL have the `bin/` CLI and one skill, and no MCP server.
The skill SHALL tell the agent to use `cc-docs` through Bash, and SHALL follow the answer rules of the `cc-docs` skill (version, badges, citations, payload fields from the schemas).
The plugin description SHALL say that it works only in Claude Code, not in claude.ai or Cowork.
`plugin:check` and `version:bump` SHALL cover the plugin.

#### Scenario: No MCP server

- **WHEN** `bun run plugin:check` runs
- **THEN** it fails if the `cc-docs-cli` plugin has an `.mcp.json` or no `bin/cc-docs`

### Requirement: Registry Package

The CLI SHALL be published to the registry as `cc-docs`, with a `bin` entry named `cc-docs`, and its version SHALL match the `cc-docs-cli` plugin version.
Each publish SHALL happen only after the owner approves it.

#### Scenario: Version agreement

- **WHEN** `bun run plugin:check` runs
- **THEN** it fails if the package version and the `cc-docs-cli` plugin version differ
