---
title: "Subcommands"
description: "Every claude subcommand in 2.1.305, including background sessions, auth, plugins, and the hidden commands."
url: https://xsyetopz.github.io/claude-code-docs/configure/cli/subcommands
source: docs/configure/cli/subcommands.md
---

# Subcommands


A subcommand is a word after `claude` that starts a separate job, such as `claude doctor`.
`claude --help` lists 18 commands. Several more work but the root help does not show them.
Each command has its own `--help`.

Run `claude <command>`, or `claude <command> --help` for its options. Each command has its own flags. A command runs only when you call it.

## Example

```bash
claude --bg "run the full test suite"   # prints a short id
claude agents                           # list background sessions
claude logs <id>                        # read recent output
claude stop <id>                        # stop it, keep the conversation
```

## Commands

Source: the text of `claude <command> --help` in `2.1.305`.

| Command | Status | What it does |
| --- | --- | --- |
| `claude agents` | [Documented] | Opens the agent view to watch and start background sessions, and `--json` prints the active sessions. |
| `claude attach <id\|name>` | [Documented] | Opens a background session. |
| `claude logs <id\|name>` | [Documented] | Prints the recent output of a background session. |
| `claude stop <id>` (alias `kill`) | [Documented] | Stops a background session and keeps the conversation. |
| `claude respawn <id>` or `--all` | [Documented] | Restarts a background session on the current binary. |
| `claude rm <id>` | [Documented] | Deletes a background session and its worktree when that is safe. |
| `claude daemon [run\|status\|logs\|stop\|uninstall]` | [Documented] | Controls the supervisor of background sessions, which the root help does not list. |
| `claude auth login\|logout\|status` | [Documented] | Signs you in and out, and `status` exits with 1 when you are not signed in. |
| `claude setup-token` | [Documented] | Makes a long-lived token, and it needs a subscription. |
| `claude auto-mode config\|critique\|defaults\|reset` | [Documented] | Shows or resets the rules of the auto mode classifier. |
| `claude doctor` | [Documented] | Checks your setup and changes nothing. |
| `claude gateway --config <yaml>` | [Documented] | Runs the enterprise gateway. |
| `claude import [codex\|gemini\|cursor]` | [Documented] | Imports the config of another agent, with `--dry-run` and `--yes`. |
| `claude install [stable\|latest\|version]` | [Documented] | Installs the native build, with `--force`. |
| `claude update` (alias `upgrade`) | [Documented] | Updates Claude Code. Package-manager installs update through the package manager. |
| `claude mcp ...` | [Documented] | Manages MCP servers (see [MCP](https://xsyetopz.github.io/claude-code-docs/extend/mcp/cli.md)). |
| `claude plugin ...` (alias `plugins`) | [Documented] | Manages plugins (see [Plugins](https://xsyetopz.github.io/claude-code-docs/extend/plugins/cli.md)). |
| `claude plugin test [dir]` | [Documented] | Runs the tests of a mod. |
| `claude purge [path]` | [Documented] [Caution: Deletes the state of a project] | Deletes the state of a project, with `--all`, `--dry-run`, `-i`, and `-y`. |
| `claude remote-control` (alias `rc`) | [Documented] | Lets you control local sessions from `claude.ai` or the mobile app. |
| `claude ultrareview [target]` | [Documented] | Starts a cloud review with many agents, with `--json`, `--post`, and `--timeout`. |
| `claude self-hosted-runner` | [Documented] | Runs cloud sessions on your machine, and the root help does not list it. |
| `claude sandbox` | [Undocumented] | A hidden command, and the docs have no help for it. |
| `claude edit-hook`, `edit-permission-rules`, `edit-memory-settings`, `edit-skill-overrides`, `edit-sandbox-settings`, `edit-chrome-settings`, `drop-worktree-registrations`, `design-login` | [Undocumented] | Hidden commands that read one JSON edit from stdin with `--json`, and their text says they serve the VS Code extension. |
| `claude import-conversations <exportPath>` | [Undocumented] | A hidden command that archives an export, with `--cwd` and `--dry-run`. |

> **Hidden Commands:** The `edit-*` commands, `drop-worktree-registrations`, and `design-login` read one JSON edit from stdin.
> Their own text says they serve the VS Code extension. Do not build scripts on them.

## Related Pages

- [CLI Overview](https://xsyetopz.github.io/claude-code-docs/configure/cli.md)
- [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md)
- [Auto Mode](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode.md) covers the `claude auto-mode` commands in depth.
