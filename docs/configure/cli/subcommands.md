---
title: Subcommands
description: Every claude subcommand in 2.1.309, including background sessions, auth, plugins, and the hidden commands.
sidebar_position: 3
---

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

Source: the text of `claude <command> --help` in `2.1.309`.

| Command | Status | What it does |
| --- | --- | --- |
| `claude agents` | <Documented /> | Opens the agent view to watch and start background sessions, and `--json` prints the active sessions. With `--json`, `--all` adds completed background sessions, and `--cwd <path>` keeps only the sessions started under that path. These options set the defaults of the sessions it dispatches: `--model`, `--effort`, `--agent`, `--permission-mode`, `--add-dir`, `--mcp-config`, `--strict-mcp-config`, `--plugin-dir`, `--settings`, `--setting-sources`, `--restricted`, `--dangerously-skip-permissions` (an alias for `--permission-mode bypassPermissions`), and `--allow-dangerously-skip-permissions`. The hidden `--inherit-permission-mode`, `--managed-settings`, and `--plugin-dir-no-mcp` also work. |
| `claude attach <id\|name>` | <Documented /> | Opens a background session. |
| `claude logs <id\|name>` | <Documented /> | Prints the recent output of a background session. |
| `claude stop <id>` (alias `kill`) | <Documented /> | Stops a background session and keeps the conversation. |
| `claude respawn <id>` or `--all` | <Documented /> | Restarts a background session on the current binary. |
| `claude rm <id>` | <Documented /> | Deletes a background session and its worktree when that is safe. |
| `claude daemon [run\|status\|logs\|stop\|uninstall]` | <Documented /> | Controls the supervisor of background sessions, which the root help does not list. |
| `claude auth login\|logout\|status` | <Documented /> | Signs you in and out, and `status` exits with 1 when you are not signed in. `login` takes `--claudeai` (the default), `--console` (API usage billing), `--email <email>` (fills in the login page), and `--sso`. `status` prints JSON by default (`--json`), or text with `--text`. |
| `claude setup-token` | <Documented /> | Makes a long-lived token, and it needs a subscription. |
| `claude auto-mode config\|critique\|defaults\|reset` | <Documented /> | Shows or resets the rules of the auto mode classifier. `critique` takes `--model <model>`, `defaults` takes `--label <prefix>` (only rules whose label starts with it), and `reset` takes `-y/--yes` to skip the confirmation. |
| `claude doctor` | <Documented /> | Checks your setup and changes nothing. |
| `claude gateway --config <yaml>` | <Documented /> | Runs the enterprise gateway. |
| `claude import [codex\|gemini\|cursor]` | <Documented /> | Imports the config of another agent, with `--dry-run` and `--yes`. |
| `claude install [stable\|latest\|version]` | <Documented /> | Installs the native build, with `--force`. |
| `claude update` (alias `upgrade`) | <Documented /> | Updates Claude Code. Package-manager installs update through the package manager. |
| `claude mcp ...` | <Documented /> | Manages MCP servers (see [MCP](../../extend/mcp/cli.md)). |
| `claude plugin ...` (alias `plugins`) | <Documented /> | Manages plugins (see [Plugins](../../extend/plugins/cli.md)). |
| `claude plugin test [dir]` | <Documented /> | Runs the tests of a mod. |
| `claude purge [path]` | <Documented /> <Caution note="Deletes the state of a project" /> | Deletes the state of a project, with `--all`, `--dry-run`, `-i/--interactive` (asks before each item), and `-y/--yes`. |
| `claude remote-control` (alias `rc`) | <Documented /> | Lets you control local sessions from `claude.ai` or the mobile app. |
| `claude ultrareview [target]` | <Documented /> | Starts a cloud review with many agents, with `--json`, `--post`, `--no-post` (the default), `--timeout`, and `--trust-workspace`. Since `2.1.309` it needs a trusted folder. It asks on a terminal. Without a terminal it may refuse, so scripts pass `--trust-workspace` after the target, or set `CLAUDE_CODE_DISABLE_ULTRAREVIEW_TRUST_CHECK=1`. |
| `claude self-hosted-runner` | <Documented /> | Runs cloud sessions on your machine, and the root help does not list it. |
| `claude sandbox` | <Undocumented /> | A hidden command with three subcommands for the Windows sandbox: `install` adds the sandbox user and network filters and asks for elevation once, `status` prints the sandbox state and the Windows install state as one JSON line, and `uninstall` removes them and lists what stays behind, with `--json`. |
| `claude edit-hook`, `edit-permission-rules`, `edit-memory-settings`, `edit-skill-overrides`, `edit-sandbox-settings`, `edit-chrome-settings`, `drop-worktree-registrations`, `design-login` | <Undocumented /> | Hidden commands that read one JSON edit from stdin with `--json`, and their text says they serve the VS Code extension. `design-login --status` reports whether design-system access is authorized and exits. |
| `claude apply-project-settings` | <Undocumented /> | A hidden command that shows how your user and project settings differ from what you accepted for cloud sessions on this computer, and lets you accept them. It needs a terminal. |
| `claude project` | <Undocumented /> <Deprecated note="Use claude purge" /> | A hidden command with one subcommand, `purge`. The program says that `claude project purge` is now `claude purge` and that the old name still works for now. |
| `claude import-conversations <exportPath>` | <Undocumented /> | A hidden command that archives an export, with `--cwd` and `--dry-run`. |

:::note[Hidden Commands]
The `edit-*` commands, `drop-worktree-registrations`, and `design-login` read one JSON edit from stdin.
Their own text says they serve the VS Code extension. Do not build scripts on them.
:::

## Errors

Each row is a family of messages. The backticked text is the start that every message in the family shares. A row marked `Various` gathers the messages of one feature that do not share one start.

| Start of Message | Status | What It Means | Cases |
| --- | --- | --- | --- |
| Various | <Undocumented /> | **Update and install.** `claude update` or `claude install` failed. | The latest version could not be fetched from the npm registry, the channel or version is not valid, a checksum does not match, the executable is in use or another instance is updating, permissions are missing, or the executable could not be restored after a failed update. |
| Various | <Undocumented /> | **Background sessions and daemon.** A background session, `claude attach`, `claude respawn`, or daemon step failed or printed a notice. | The service is not installed or did not come up, `--bg` ignores `--session-id`, a session cannot start, wake, or attach, the terminal host died, a daemon lock or roster could not be read or written, or the background manager failed to start. |
| Various | <Undocumented /> | **`claude gateway` server configuration.** `claude gateway` refused its configuration or a sign-in request. | A `cri.` or `oidc.` setting is not valid, a loopback URL is used without `CLAUDE_GATEWAY_ALLOW_LOOPBACK`, an ID token is missing a claim, the email domain or group is not allowed, an upstream credential or role could not be used, or the store (`store.postgres_url`) is not readable. |
| Various | <Undocumented /> | **`decode-token`.** `decode-token` could not read or check a token. | A flag is unknown or has no value, the token is not a JWT with three base64url segments, has no `exp` claim, is expired or not yet valid, uses an `alg` other than ES256 or RS256, the JWKS could not be fetched or has no key with that `kid`, or the signature check failed. |
| Various | <Undocumented /> | **Conversation import.** A conversation import or export file was refused. | The file is over the size limit, is not valid JSON, or the manifest does not match after the import. |

## Related Pages

- [CLI Overview](index.md)
- [All Flags](flags.md)
- [Auto Mode](../permissions/auto-mode.md) covers the `claude auto-mode` commands in depth.
