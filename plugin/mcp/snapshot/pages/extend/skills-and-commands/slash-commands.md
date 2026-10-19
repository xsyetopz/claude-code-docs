---
title: "Slash Commands"
description: "Every built-in slash command in Claude Code 2.1.304, grouped by job, with aliases, arguments, and gates."
url: https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/slash-commands
source: docs/extend/skills-and-commands/slash-commands.md
---

# Slash Commands


A slash command is a word that starts with `/`. You type it in the prompt to do one thing, such as clearing the session or switching the model.
Type `/` to see the list.
Some commands open a panel. Others print a result or expand into a prompt for Claude.
Many commands are hidden unless your account, provider, or settings allow them.

You cannot change built-in commands, but you can add your own with [skills](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands.md). Some commands have an env var or setting. The Notes column names it. Some also work in `-p` and the SDK.

## Example

```text
/model opus
/compact keep the database schema decisions
/effort high
```

Each line is a separate command. The text after the name is the argument.

## How to Read the Tables

- A panel command opens an interactive screen. The program calls it `local-jsx`.
- A text command returns text from fixed code. The program calls it `local`.
- A prompt command expands into a model prompt. The program calls it `prompt`.
- Many commands have two forms: a panel for interactive sessions and a text form for `-p` and the SDK.
- A `Gated` badge means a flag, policy, plan, provider, or env var must allow the command.
- The program holds about 101 command names, and it also makes `/mcp__<server>__<prompt>` commands from MCP prompts.

## Session and Conversation Commands

| Command | Status | What it does | Notes |
| --- | --- | --- | --- |
| `/add-dir` `<path>` | [Documented] | Adds a working folder. | Panel. Runs at once when you give a path. Loads `.claude/skills`, `.claude/commands`, and `.claude/agents` of that folder. A text form runs for some SDK entry points. |
| `/cd` `<path>` | [Documented] | Moves this session to a new working folder. | Panel. The new folder adds its project skills (2.1.246 or later). |
| `/clear` (aliases `/reset`, `/new`) `[name]` | [Documented] | Starts a new session with empty context. | The old session stays on disk. `/resume` opens it. Works non-interactive too. |
| `/compact` `<optional custom summarization instructions>` | [Documented] | Summarizes the conversation to free context. | Turned off when env var `DISABLE_COMPACT` is truthy. See [Context and Compaction](https://xsyetopz.github.io/claude-code-docs/how-it-works/context-and-compaction.md). |
| `/autocompact` `[auto\|<tokens>]` | [Documented] | Sets how full the context gets before it auto-summarizes. | Panel in interactive mode. A text form, "Configure the auto-compact window size", runs non-interactive or in a remote workspace. |
| `/context` | [Documented] | Shows current context use. | Found only as a text command, enabled in non-interactive mode. |
| `/resume` (alias `/continue`) `[conversation id or search term]` | [Documented] | Resumes a past conversation. | Panel. Hidden for a remote viewer. See [Sessions and Storage](https://xsyetopz.github.io/claude-code-docs/how-it-works/sessions-and-storage.md). |
| `/rename` (alias `/name`) `[name]` | [Documented] | Renames the conversation. | Panel and text form. |
| `/branch` `[name]` | [Documented] | Branches the conversation at this point. | Panel. |
| `/fork` `<directive> or [prompt]` | [Documented] | Starts a background agent that inherits the full conversation. | Panel. Off in coordinator mode. |
| `/subtask` `<task>` | [Documented] | Sends a subagent off with your full context. Its result comes back here. | Panel. Off in coordinator mode. |
| `/background` (alias `/bg`) `[prompt]` | [Documented] | Sends this session to the background and frees the terminal. | Panel. Runs at once with no prompt. Matches the `--bg` flag. |
| `/stop` | [Gated: The session must be a background session.] | Stops this background session. | The transcript and worktree are kept. |
| `/goal` `[<condition> \| clear]` | [Documented] | Sets a goal that Claude checks before it stops. | Panel. A text form ("keep working until the condition is met") runs non-interactive or in a remote workspace. |
| `/plan` `[open\|<description>]` | [Documented] | Turns on plan mode, or shows the session plan. | Panel. |
| `/recap` | [Documented] | Writes a one-line session recap now. | Text command. |
| `/btw` `[question]` | [Documented] | Asks a quick side question without interrupting the main conversation. | Panel. |
| `/export` `[filename]` | [Documented] | Exports the conversation to a file or the clipboard. | Panel. |
| `/copy` `[N]` | [Documented] | Copies the last reply to the clipboard. `/copy N` copies the Nth latest. | Panel. |
| `/exit` (alias `/quit`) | [Documented] | Exits the CLI. In a background session it detaches and the session keeps running. | Panel and text form. |
| `/restart` (alias `/update`) | [Gated: Interactive terminal on macOS or Linux, native install only, and a server-side feature flag.] | Restarts Claude Code on the newly installed version and resumes this session. | Interactive only. See [How `/restart` Works](#how-restart-works). |
| `/rewind` (aliases `/checkpoint`, `/undo`) | [Documented] | Restores the code, the conversation, or both to an earlier point. | Interactive only. |
| `/tasks` (alias `/bashes`) | [Documented] | Shows and manages everything that runs in the background. | Panel. |
| `/list-agents` (alias `/peers`) | [Documented] | Lists subagents, teammates, and other sessions you can message. | Off when the org setting `messagingBeyondOwnAgentsDisabled` is set. |
| `/focus` `[on\|off]` | [Documented] | Toggles focus view: only your prompt, a summary, and the reply. | Needs the fullscreen renderer (`/tui fullscreen` or `CLAUDE_CODE_NO_FLICKER=1`). The setting `viewMode: "focus"` does the same. |
| `/diff` | [Documented] | Shows uncommitted changes and per-turn diffs. | Panel. Off when a mod provides its own diff view. |
| `/model` `<model> or [model]` | [Documented] | Sets the model. | Panel and text form. See [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md). |
| `/effort` `[levels] or <levels>` | [Documented] | Sets the effort level. | Panel and text form. Since `2.1.304`, `/effort status` no longer shows a guessed level when `CLAUDE_CODE_EFFORT_LEVEL` is `auto` or `unset`. |
| `/fast` `[on\|off]` | [Gated: First-party provider, and env var CLAUDE_CODE_DISABLE_FAST_MODE not set.] | Toggles fast mode. | Panel and text form. |
| 🧪 `/advisor` `[model\|off]` | [Gated: On when env CLAUDE_CODE_ENABLE_EXPERIMENTAL_ADVISOR_TOOL is set, otherwise server flag tengu_sage_compass2] | Lets Claude consult a stronger model at key moments. | Panel and text form. See [`CLAUDE_CODE_ENABLE_EXPERIMENTAL_ADVISOR_TOOL`](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/models-and-effort.md). |

## Setup, Interface, and Config Commands

| Command | Status | What it does | Notes |
| --- | --- | --- | --- |
| `/config` (alias `/settings`) `key=value` | [Documented] | Sets a setting by key. | The text form works in non-interactive mode only. |
| `/memory` | [Documented] | Edits `CLAUDE.md` files and memory settings. | Panel. |
| `/permissions` (alias `/allowed-tools`) | [Documented] | Manages allow and deny rules. | Panel. |
| `/hooks` | [Documented] | Shows your hook configuration. | Panel. Needs no workspace. See [Hooks](https://xsyetopz.github.io/claude-code-docs/extend/hooks.md). |
| `/mcp` `[reconnect\|enable\|disable [<server>\|all]]` | [Documented] | Manages MCP servers. | Panel and text form. |
| `/plugin` (aliases `/plugins`, `/marketplace`) `[subcommand]` | [Documented] | Manages plugins. | Panel with argument completion. |
| `/reload-plugins` `[--force]` | [Documented] | Activates pending plugin changes in the current session. | Runs non-interactive too (2.1.260 or later). |
| `/reload-skills` | [Documented] | Picks up skills added or changed on disk during this session. | Works in both modes. |
| `/skills` | [Documented] | Lists available skills. `Space` cycles the `skillOverrides` state and `Esc` saves it. | Panel. |
| `/skill-doctor` | [Documented] | Shows which loaded skills are unused and cost context. | Panel (opens the `/plugin` Stats tab) and a text form. Needs feature-flag fetching. |
| `/output-style` `[style]` | [Documented] | Lists output styles or switches to one. | Text command. |
| `/theme` | [Documented] | Changes the theme. | Panel. |
| `/tui` `[default\|fullscreen]` | [Documented] | Sets the terminal UI renderer. | A change restarts and resumes the session. |
| `/color` `[color\|default]` | [Documented] | Sets the prompt bar color for this session. | Panel and text form. |
| `/brief` | [Gated: Remote config flag enable_slash_command, and the account needs the Brief tool.] | Toggles brief-only mode. | Panel. |
| `/scroll-speed` | [Documented] | Adjusts mouse wheel scroll speed. | Needs the fullscreen renderer. Off in some terminals, including JetBrains. |
| `/terminal-setup` | [Documented] | Installs the Shift+Enter key binding. | The text changes with the terminal. |
| `/keybindings` | [Documented] | Opens your keyboard shortcuts file. | Interactive only. Needs keybinding customization on. |
| `/ide` `[open]` | [Documented] | Manages IDE integrations and shows status. | Panel. |
| `/init` | [Documented] | Creates a `CLAUDE.md` file with codebase notes. | A prompt command. With env var `CLAUDE_CODE_NEW_INIT` it also sets up skills and hooks. Claude can call it through the `Skill` tool. |
| `/auto-mode-setup` `[--request-id <uuid>] (--wizard ... --propose \| --expect-sha256 <hex> --apply-file <path>)` | [Gated: An environment-onboarding policy flag.] | Teaches auto mode about your environment, with optional rule changes. It reads your project and recent sessions. | Panel. The text form is non-interactive. Since `2.1.304` it is also on Bedrock, Vertex, Foundry, a Claude apps gateway, and with telemetry off. `skillOverrides["auto-mode-setup"]: "off"` turns it off (the program). |
| `/import` `[codex\|gemini\|cursor] [--dry-run]` | [Gated: Server flag tengu_import, off by default. You cannot turn it on] | Imports config from another AI coding agent. | Panel and text form. |
| `/help` | [Documented] | Shows help and the command list. | Panel. Terminal only. |
| `/status` | [Documented] | Shows version, model, account, API connectivity, and tool status. | Panel. Lists skills whose `allowed-tools` were ignored. |
| `/usage` (aliases `/cost`, `/stats`) | [Documented] | Shows session cost, plan use, and activity stats. | Panel and text form. Since `2.1.304` it says when a rate limit ends. |
| `/release-notes` | [Documented] | Shows release notes. | Panel. |
| `/statusline` | [Documented] | Sets up the status line. | A prompt command. Not in safe mode. Interactive only. |
| `/sandbox` `exclude "command pattern"` (Windows also `install`) | [Gated: Hidden when the platform is not supported or not in the enabled list.] | Shows sandbox state and opens its settings. | Panel. |
| `/chrome` | [Gated: Availability claude-ai, policy allow_claude_browser_extension, interactive only.] | Opens Claude in Chrome settings. | Panel. |
| `/insights` | [Gated: Policy allow_insights, and needs a workspace.] | Makes a report that analyzes your sessions. | A prompt command. |
| `/privacy-settings` | [Gated: A signed-in subscriber with an eligible plan.] | Views and updates privacy settings. | Panel. |
| `/login` | [Documented] | Signs in, or switches accounts. | Off when env var `DISABLE_LOGIN_COMMAND` is set. |
| `/logout` | [Documented] | Signs out. | Off when env var `DISABLE_LOGOUT_COMMAND` is set. |
| `/install` `[options]` | [Documented] | Installs the native build. | Takes `--force` and a target. Interactive only. |

## Account, Cloud, and Other Commands

| Command | Status | What it does | Notes |
| --- | --- | --- | --- |
| `/usage-credits` | [Gated: Env var DISABLE_EXTRA_USAGE_COMMAND not set, and the account can use credits.] | Sets up usage credits, or asks your admin for them at a limit. | Panel and text form. |
| `/upgrade` | [Gated: Availability claude-ai, env var DISABLE_UPGRADE_COMMAND not set, plan is not enterprise.] | Upgrades to Max for higher rate limits. | Panel. |
| `/pro-trial-expired` | [Undocumented] | Options shown when the Pro plan trial ends. | Hidden. The UI shows it. You do not type it. |
| `/rate-limit-options` | [Gated: claude.ai sign-in.] | Manages usage limits and upgrade options. | Panel. |
| `/passes` | [Gated: Hidden unless the account is eligible.] | Shares a free week of Claude Code with friends. | Panel. |
| `/feedback` `[report]` | [Gated: Off when env var DISABLE_FEEDBACK_COMMAND is set.] | Sends feedback or reports a bug. | Panel. |
| `/bug` (alias `/share`) `[report]` | [Gated: Env var DISABLE_BUG_COMMAND exists.] | Reports a bug or shares your conversation. | Panel. |
| `/install-github-app` | [Gated: Availability claude-ai and console. Off when env var DISABLE_INSTALL_GITHUB_APP_COMMAND is set.] | Sets up GitHub Actions for a repository. | Panel. |
| `/install-slack-app` | [Gated: Availability claude-ai.] | Installs the Slack app. | Text command. |
| `/setup-bedrock` | [Gated: Hidden unless CLAUDE_CODE_USE_BEDROCK is set.] | Reconfigures Amazon Bedrock sign-in, region, or model pins. | Panel. See [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md). |
| `/setup-vertex` | [Gated: Hidden unless CLAUDE_CODE_USE_VERTEX is set.] | Reconfigures Google Vertex AI sign-in, project, region, or model pins. | Panel. |
| `/web-setup` | [Gated: Availability claude-ai. Policies allow_remote_sessions and allow_quick_web_setup.] | Sets up cloud sessions with your GitHub account. | Panel. |
| `/cloud-plugins` | [Gated: Off when env var CLAUDE_CODE_DISABLE_PLUGIN_FORWARDING is set.] | Chooses whether cloud sessions use the plugins enabled on this machine. | Panel. |
| `/remote-env` | [Gated: Availability claude-ai and console-profile. Policy allow_remote_sessions.] | Chooses the default environment for cloud agents. | Panel. |
| `/teleport` (alias `/tp`) | [Gated: Availability claude-ai and console-profile. Policy allow_remote_sessions.] | Sends this session to the cloud, or resumes one from claude.ai. | Panel. |
| `/session` (alias `/remote`) | [Gated: Needs a remote workspace.] | Shows the cloud session URL and a QR code. | Panel. |
| `/desktop` (alias `/app`) | [Gated: Availability claude-ai.] | Continues the session in Claude Desktop. | Panel. |
| `/mobile` (aliases `/ios`, `/android`) | [Documented] | Shows a QR code to download the mobile app. | Panel. |
| `/remote-control` (alias `/rc`) `[name]` | [Gated: Off when the setting disableRemoteControl is true.] | Controls this session from your phone or claude.ai/code. | Panel. |
| `/ultraplan` `<prompt>` | [Gated: Availability claude-ai.] | Drafts an editable plan in a cloud session. | Panel. |
| `/ultrareview` | [Gated: Paid feature.] | Runs a cloud code review. | Panel and text form. |
| `/autofix-pr` | [Gated: Availability claude-ai and console-profile. Policy allow_remote_sessions.] | Watches the current pull request and fixes issues. | Panel. |
| `/daemon` | [Undocumented] | Manages background services and routines. | Panel. |
| `/workflows` | [Gated: Setting disableWorkflows and env var CLAUDE_CODE_DISABLE_WORKFLOWS.] | Browses running and finished workflows. | Panel. |
| `/artifacts` | [Gated: An artifacts feature check and a flag.] | Browses your published and shared artifacts. | Panel. Since `2.1.304` the delete confirmation is numbered: 1 or Enter keeps, 2 deletes. `y`, `n`, and Esc still work. |
| `/design-consent`, `/design-revoke` | [Gated: Policy allow_design_sync.] | Grants or revokes agent access to your Design projects. | Hidden text commands. |
| `/design-login` | [Gated: Policy allow_design_sync.] | Authorizes design-system access for `/design-sync`. | Panel. |
| `/voice` `[hold\|tap\|off]` | [Gated: Availability claude-ai.] | Toggles voice mode. | Text command. |
| `/powerup` | [Documented] | Teaches features through short interactive lessons. | Panel. |
| `/stickers` | [Documented] | Orders stickers. | Text command. |
| `/radio` | [Documented] | Plays a lo-fi radio station. | Text command. |
| `/team-onboarding` | [Gated: Policy allow_team_onboarding, and needs a workspace.] | Builds a guide that helps teammates learn Claude Code from your usage. | A prompt command. |
| `/heapdump` | [Gated: Policy allow_heap_dump.] | Writes the JavaScript heap to your Desktop (home folder on Linux without a Desktop). | Hidden text command. |
| `/mcp__<server>__<prompt>` `prompt arguments` | [Documented] | MCP prompts become commands. Missing required arguments give "Missing required argument". | Made on the fly with `source:"mcp"`. The alias form is `<server>:<prompt> (MCP)`. |

## How It Works

Each command is an object with a kind: panel, text, or prompt.
A command can have two objects, one for interactive use and a text one for non-interactive use. The second one is picked when the session is not interactive.
Aliases come from an `aliases` list on the object.
A skill or custom command with the same name replaces a built-in command, but not its aliases (see [Skills and Commands](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands.md#name-resolution)).

## How `/restart` Works

`/restart` restarts Claude Code on the installed version and resumes the same session. It keeps the model, the permission mode, extra working directories, and the Remote Control state. After the restart, it adds a "Successfully updated from A to B" message.

It only shows when all of these are true:

- You are in an interactive terminal (not `-p`).
- You run macOS or Linux.
- You use the native install (the binary is under `~/.local/share/claude/versions/`, so not npm).
- You are not in a teammate agent or a remote session, and slash commands are not disabled.
- A server-side feature flag is on for you. Some users never see it.

After an auto-update installs a new version, the prompt area shows a green notice: "Update installed · /restart to apply". When the conditions above are not met, it says "Restart to update" instead.

`/restart` refuses in these cases:

- Background work is running or pending. It says "Can't restart while work is running in the background — wait for it to finish (or stop it via /tasks), then try again." Running subagents and background shell commands count. Remote agents do not.
- Remote Control is connected, or the command came in over Remote Control.
- The session is not saved to disk.
- Claude tried to run it. You must type it at the prompt.
- The installed version is missing (it suggests `/doctor`), or that version is on hold.

Background sessions use `claude respawn <id>` instead.

## Related Pages

- [Skills and Commands](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands.md): skills, which also give you slash commands.
- [Bundled Skills](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/bundled-skills.md): commands that are really skills.
- [Hooks](https://xsyetopz.github.io/claude-code-docs/extend/hooks.md): the `UserPromptExpansion` event fires when a command expands.
- [Environment Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars.md): the `DISABLE_*_COMMAND` variables.

Source: [Commands](https://code.claude.com/docs/en/commands) and the program (the command objects). `/keybindings`, `/release-notes`, `/rewind`, `/chrome`, `/statusline`, and `/sandbox` are missing from the program inventory file because of the key order in their objects. The program itself has them.
