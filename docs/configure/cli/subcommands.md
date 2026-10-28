---
title: Subcommands
description: Every claude subcommand in 2.1.312, including background sessions, auth, plugins, and the hidden commands.
sidebar_position: 3
---

A subcommand is a word after `claude` that starts a separate job, such as `claude doctor`.
`claude --help` lists 18 commands. Several more work but the root help does not show them.
Each command has its own `--help`.

Run `claude <command>`. Run `claude <command> --help` for its options. Each command has its own flags. A command runs only when you call it.

## Example

```bash
claude --bg "run the full test suite"   # prints a short id
claude agents                           # list background sessions
claude logs <id>                        # read recent output
claude stop <id>                        # stop it, keep the conversation
```

## Commands

Source: the text of `claude <command> --help` in `2.1.312`.

| Command | Status | What it does |
| --- | --- | --- |
| `claude agents` | <Documented /> | Opens the agent view to watch and start background sessions. `--json` prints the active sessions. With `--json`, `--all` adds completed background sessions. With `--json`, `--cwd <path>` keeps only the sessions started under that path. These options set the defaults of the sessions it dispatches: `--model`, `--effort`, `--agent`, `--permission-mode`, `--add-dir`, `--mcp-config`, `--strict-mcp-config`, `--plugin-dir`, `--settings`, `--setting-sources`, `--restricted`, `--dangerously-skip-permissions` (an alias for `--permission-mode bypassPermissions`), and `--allow-dangerously-skip-permissions`. The hidden `--inherit-permission-mode`, `--managed-settings`, and `--plugin-dir-no-mcp` also work. |
| `claude attach <id\|name>` | <Documented /> | Opens a background session. |
| `claude logs <id\|name>` | <Documented /> | Prints the recent output of a background session. |
| `claude stop <id>` (alias `kill`) | <Documented /> | Stops a background session and keeps the conversation. |
| `claude respawn <id>` or `--all` | <Documented /> | Restarts a background session on the current binary. |
| `claude rm <id>` | <Documented /> | Deletes a background session and its worktree when that is safe. |
| `claude daemon [run\|status\|logs\|stop\|uninstall]` | <Documented /> | Controls the supervisor of background sessions, which the root help does not list. |
| `claude auth login\|logout\|status` | <Documented /> | Signs you in and out. `status` exits with 1 when you are not signed in. `login` takes `--claudeai` (the default), `--console` (API usage billing), `--email <email>` (fills in the login page), and `--sso`. `status` prints JSON by default (`--json`). With `--text`, it prints text. |
| `claude setup-token` | <Documented /> | Makes a long-lived token. It needs a subscription. |
| `claude auto-mode config\|critique\|defaults\|reset` | <Documented /> | Shows or resets the rules of the auto mode classifier. `critique` takes `--model <model>`. `defaults` takes `--label <prefix>` to keep only rules whose label starts with the prefix. `reset` takes `-y/--yes` to skip the confirmation. |
| `claude doctor` | <Documented /> | Checks your setup and changes nothing. |
| `claude gateway --config <yaml>` | <Documented /> | Runs the enterprise gateway. |
| `claude import [codex\|gemini\|cursor]` | <Documented /> | Imports the config of another agent, with `--dry-run` and `--yes`. |
| `claude install [stable\|latest\|version]` | <Documented /> | Installs the native build, with `--force`. |
| `claude update` (alias `upgrade`) | <Documented /> | Updates Claude Code. Package-manager installs update through the package manager. |
| `claude mcp ...` | <Documented /> | Manages MCP servers (see [MCP](../../extend/mcp/cli.md)). |
| `claude plugin ...` (alias `plugins`) | <Documented /> | Manages plugins (see [Plugins](../../extend/plugins/cli.md)). |
| `claude plugin test [dir]` | <Documented /> | Runs the tests of a mod. |
| `claude purge [path]` | <Documented /> <Caution note="Deletes the state of a project" /> | Deletes the state of a project, with `--all`, `--dry-run`, `-i/--interactive` (asks before each item), and `-y/--yes`. Since `2.1.311`, the purge plan ends with "Purging deletes data only on this computer, not anything stored by Anthropic" (`chunk-p3tkb5qf.js:1432`). |
| `claude remote-control` (alias `rc`) | <Documented /> | Lets you control local sessions from `claude.ai` or the mobile app. |
| `claude ultrareview [target]` | <Documented /> | Starts a cloud review with many agents, with `--json`, `--post`, `--no-post` (the default), `--timeout`, and `--trust-workspace`. Since `2.1.309` it needs a trusted folder. It asks on a terminal. Without a terminal it may refuse, so scripts pass `--trust-workspace` after the target, or set `CLAUDE_CODE_DISABLE_ULTRAREVIEW_TRUST_CHECK=1`. |
| `claude self-hosted-runner` | <Documented /> | Runs cloud sessions on your machine, and the root help does not list it. Since `2.1.311` it takes `--hold-idle-file <path>` and `--max-hold-min <n>` (see below). |
| `claude sandbox` | <Undocumented /> | A hidden command with three subcommands for the Windows sandbox: `install` adds the sandbox user and network filters. It asks for elevation once. `status` prints the sandbox state and the Windows install state as one JSON line. `uninstall` removes them and lists what stays behind, with `--json`. |
| `claude edit-hook`, `edit-permission-rules`, `edit-memory-settings`, `edit-skill-overrides`, `edit-sandbox-settings`, `edit-chrome-settings`, `drop-worktree-registrations`, `design-login` | <Undocumented /> | Hidden commands that read one JSON edit from stdin with `--json`. Their text says they serve the VS Code extension. `design-login --status` reports whether design-system access is authorized and exits. |
| `claude apply-project-settings` | <Undocumented /> | A hidden command that shows how your user and project settings differ from what you accepted for cloud sessions on this computer. It lets you accept them. It needs a terminal. |
| `claude project` | <Undocumented /> <Deprecated note="Use claude purge" /> | A hidden command with one subcommand, `purge`. The program says that `claude project purge` is now `claude purge` and that the old name still works for now. |
| `claude import-conversations <exportPath>` | <Undocumented /> | A hidden command that archives an export, with `--cwd` and `--dry-run`. |

:::note[Hidden Commands]
The `edit-*` commands, `drop-worktree-registrations`, and `design-login` read one JSON edit from stdin.
Their own text says they serve the VS Code extension. Do not build scripts on them.
:::

### `self-hosted-runner` Hold Flags

Since `2.1.311`, the runner can keep an idle session while your host reports processes that the session left running, such as `nohup` or `tmux`.
Source: the program (`chunk-n23je8vg.js:11266`, the help text, and `chunk-n23je8vg.js:10769`, the flag parser).

| Flag | Status | What it does | Default |
| --- | --- | --- | --- |
| `--hold-idle-file <path>` | <Undocumented /> | Does not release an idle session (see `--release-idle-session-min`) while `<path>` is a regular file that changed in the last 180 seconds. Your host keeps the file fresh while the left-over process lives. The runner looks again every 30 seconds. The hold does not apply at startup, at `--retire-at`, at the `--defer-shutdown-max-min` ceiling, or at `--kill-session-after-min`. The variable is `SELF_HOSTED_RUNNER_HOLD_IDLE_FILE`. | Off |
| `--max-hold-min <n>` | <Undocumented /> | With `--hold-idle-file`, it releases the session anyway `n` minutes after the session went idle. `0` turns the hold off. The maximum is 10080. The variable is `SELF_HOSTED_RUNNER_MAX_HOLD_MS`, in milliseconds. | 1440 minutes |

The runner refuses these values, with these messages:

- `--hold-idle-file requires a file path (a file your host keeps fresh while the session has processes left running)` when the path is missing, empty, or starts with `--` (`chunk-n23je8vg.js:10769`).
- `--max-hold-min must be a non-negative number of minutes (0 disables, max 10080)` when the value is not a number in range (`chunk-n23je8vg.js:10779`).
- `the path, or a link on the way to it, leads to a network location; point --hold-idle-file at a local file` when the path is on a network location (`chunk-n23je8vg.js:10360`).
- `the path could not be checked for links to a network location: a folder or link on the way could not be read` when a folder on the way cannot be read (`chunk-n23je8vg.js:10356`).

## Errors

Each row is a family of messages. The backticked text is the start that every message in the family shares. A row marked `Various` gathers the messages of one feature that do not share one start.

| Start of Message | Status | What It Means | Cases |
| --- | --- | --- | --- |
| Various | <Undocumented /> | **Update and install.** `claude update` or `claude install` failed. | Claude Code could not fetch the latest version from the npm registry. The channel or version is not valid. A checksum does not match. The executable is in use. Another instance is updating. Permissions are missing. Claude Code could not restore the executable after a failed update. |
| Various | <Undocumented /> | **Background sessions and daemon.** A background session, `claude attach`, `claude respawn`, or daemon step failed or printed a notice. | The service is not installed or did not start. `--bg` ignores `--session-id`. A session cannot start, wake, or attach. The terminal host died. A daemon lock or roster could not be read or written. The background manager failed to start. |
| Various | <Undocumented /> | **`claude gateway` server configuration.** `claude gateway` refused its configuration or a sign-in request. | A `cri.` or `oidc.` setting is not valid. A loopback URL is in use without `CLAUDE_GATEWAY_ALLOW_LOOPBACK`. An ID token is missing a claim. The email domain or group is not allowed. An upstream credential or role could not be used. The store (`store.postgres_url`) is not readable. |
| Various | <Undocumented /> | **`decode-token`.** `decode-token` could not read or check a token. | A flag is unknown or has no value. The token is not a JWT with three base64url segments. The token has no `exp` claim. The token is expired or not yet valid. The token uses an `alg` other than ES256 or RS256. The JWKS could not be fetched. The JWKS has no key with that `kid`. The signature check failed. |
| Various | <Undocumented /> | **Conversation import.** Claude Code refused a conversation import or export file. | The file is over the size limit. The file is not valid JSON. The manifest does not match after the import. |

## Related Pages

- [CLI Overview](index.md)
- [All Flags](flags.md)
- [Auto Mode](../permissions/auto-mode.md) covers the `claude auto-mode` commands in depth.
