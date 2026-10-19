---
title: All Flags
description: Every claude flag in 2.1.303, with the ones that claude --help hides, grouped by job.
sidebar_position: 2
---

A flag changes how one `claude` run behaves.
`claude --help` shows 66 flags. Another 64 work but stay hidden from the help text.
This page lists both kinds in one place, grouped by what they do.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | Yes. Add a flag after `claude`, for example `claude --model opus`. |
| Can you change it? | Yes. Pass a different value. Most flags last for one run only. |
| Can you turn it on or off? | A flag is on when you pass it. Some have a `--no-` twin, such as `--no-chrome`. |
| Where does it live? | The command line. |
| Status | <Documented /> <Undocumented /> |

## How to Read the Tables

- <Documented /> means an official docs page names the flag, for example [CLI Reference](https://code.claude.com/docs/en/cli-reference). The column `In --help` says whether the help text shows it.
- <Undocumented /> means only the program has it. It can change or vanish in any release. Treat these flags as unstable.
- Hidden flags mostly serve the Agent SDK, the desktop app, IDE extensions, and teammate processes.

## Example

```bash
# One answer, JSON out, with a spend cap
claude -p "Summarize README.md" --output-format json --max-budget-usd 1

# A careful planning session on a chosen model
claude --model opus --effort high --permission-mode plan

# Stop after three agent turns
claude -p --max-turns 3 "Fix the failing test"
```

## Flags by Job

### Start and Print Mode

Flags that choose how a run starts and how print mode reads input and writes output.

| Flag | Status | In `--help` | What it does |
| --- | --- | --- | --- |
| `-p, --print` | <Documented /> | Yes | Prints the answer and exits, which suits pipes, and the trust dialog is skipped in this mode. |
| `--output-format <format>` | <Documented /> | Yes | Sets the output of print mode to `text`, `json`, or `stream-json`. |
| `--input-format <format>` | <Documented /> | Yes | Sets the input of print mode to `text` or `stream-json`. |
| `--json-schema <schema>` | <Documented /> | Yes | Checks the final answer against a JSON Schema. |
| `--include-hook-events` | <Documented /> | Yes | Adds the hook events to the stream, with `--output-format=stream-json`. |
| `--include-partial-messages` | <Documented /> | Yes | Adds partial message chunks to the stream, with `--print` and `stream-json`. |
| `--forward-subagent-text` | <Documented /> | Yes | Adds the text of subagents to the stream as `assistant` and `user` messages, with `--print` and `stream-json`. |
| `--replay-user-messages` | <Documented /> | Yes | Sends the user messages from stdin back on stdout as an acknowledgment. |
| `--max-budget-usd <amount>` | <Documented /> | Yes | Stops at a spend limit in dollars, with `--print` only. |
| `--max-turns <turns>` | <Documented /> | No | Stops after a number of agent turns, with `--print` only. |
| `--no-session-persistence` | <Documented /> | Yes | Saves nothing to disk, so the session cannot be resumed, with `--print` only. |
| `--prompt-suggestions [value]` | <Documented /> | Yes | Turns on prompt suggestions, and print mode sends a `prompt_suggestion` message after each turn. |
| `--init` | <Documented /> | No | Runs `Setup` hooks with the `init` trigger and then goes on. |
| `--init-only` | <Documented /> | No | Runs `Setup` and `SessionStart:startup` hooks and then exits. |
| `--maintenance` | <Documented /> | No | Runs `Setup` hooks with the `maintenance` trigger and then goes on. |
| `--session-mirror` | <Undocumented /> | No | Writes `transcript_mirror` frames to stdout, for the SDK. |
| `--await-claim` | <Undocumented /> | No | Starts as a spare process for an SDK host and waits for a `claim_session` request. |
| `--await-initialize` | <Undocumented /> | No | Reads the `initialize` request from stdin at startup so its fields apply like flags. |
| `--sdk-url <url>` | <Undocumented /> | No | Uses a WebSocket endpoint for SDK input and output, with `-p` and `stream-json`. |
| `--enable-auth-status` | <Undocumented /> | No | Turns on auth status messages in SDK mode. |
| `--workload <tag>` | <Undocumented /> | No | Sets a workload tag for the attribution block, with `--print` only. |
| `--client-data-url <url>` | <Undocumented /> | No | Loads a signed configuration document from a URL and exits if it fails. |
| `--allow-other-models` | <Undocumented /> | No | With `--client-data-url`, starts on a model that the document does not list. |
| `--managed-settings <json>` | <Undocumented /> | No | Gives policy settings as JSON from a parent process, for the SDK. |
| `--host-auth-is-org-sign-in` | <Undocumented /> | No | Says that the token of the host is an organization sign-in, for desktop hosts. |

### Safe Modes, Settings, and Debug

Flags that strip your setup down, load extra settings, or turn on logs.

| Flag | Status | In `--help` | What it does |
| --- | --- | --- | --- |
| `-h, --help` | <Documented /> | Yes | Shows the help text and exits. |
| `-v, --version` | <Documented /> | Yes | Prints the version number. |
| `-d, --debug [filter]` | <Documented /> | Yes | Turns on debug logs, and an optional filter picks the categories. |
| `-d2e, --debug-to-stderr` | <Undocumented /> | No | Turns on debug mode and writes to stderr, and the flag is deprecated. |
| `--debug-file <path>` | <Documented /> | Yes | Writes the debug logs to a file and turns on debug mode. |
| `--verbose` | <Documented /> | Yes | Overrides the verbose setting of your config. |
| `--bare` | <Documented /> | Yes | Starts with a minimal setup: no hooks, no plugin sync, no auto memory, and no background work. |
| `--safe-mode` | <Documented /> | Yes | Starts with all customizations off, such as `CLAUDE.md`, skills, plugins, hooks, and MCP servers. |
| `--restricted` | <Documented /> | Yes | Removes the tools that run code and `WebFetch`, and ignores user, project, and local settings. |
| `--ax-screen-reader` | <Documented /> | Yes | Draws flat text with no borders or animations, for screen readers. |
| `--settings <file-or-json>` | <Documented /> | Yes | Loads more settings from a JSON file or a JSON string. |
| `--setting-sources <sources>` | <Documented /> | Yes | Chooses which setting sources load: `user`, `project`, and `local`. |
| `--project-config-root <dir>` | <Undocumented /> | No | Reads project settings and the `.claude` trees from another folder. |

### Permissions and Tools

Flags that set the permission mode and the tools the model may use. See [Permissions](../permissions/index.md).

| Flag | Status | In `--help` | What it does |
| --- | --- | --- | --- |
| `--permission-mode <mode>` | <Documented /> | Yes | Sets the permission mode of the session. |
| `--inherit-permission-mode <mode>` | <Undocumented /> | No | Sets a permission mode from a parent session, used only when nothing else sets one. |
| `--dangerously-skip-permissions` | <Documented /> | Yes | Skips all permission checks, and you should use it only in a sandbox with no internet access. |
| `--allow-dangerously-skip-permissions` | <Documented /> | Yes | Makes skipping all permission checks a choice, without turning it on. |
| `--allowedTools, --allowed-tools <tools...>` | <Documented /> | Yes | Lists the tools that run without a permission prompt. |
| `--disallowedTools, --disallowed-tools <tools...>` | <Documented /> | Yes | Lists the tools that the model cannot use. |
| `--tools <tools...>` | <Documented /> | Yes | Lists the built-in tools that the model can use. |
| `--permission-prompts <target>` | <Documented /> | Yes | Sets who answers permission prompts: `host` or `none`. |
| `--permission-prompt-tool <tool>` | <Documented /> | No | Names an MCP tool that answers permission prompts, with `--print` only. |
| `--plan-mode-instructions <instructions>` | <Undocumented /> | No | Replaces the default steps of plan mode with your own text. |

### Model and Thinking

Flags that pick the model and set how hard it thinks.

| Flag | Status | In `--help` | What it does |
| --- | --- | --- | --- |
| `--model <model>` | <Documented /> | Yes | Sets the model with an alias such as `opus` or with a full name. |
| `--effort <level>` | <Documented /> | Yes | Sets the effort level of the session. |
| `--fallback-model <model>` | <Documented /> | Yes | Sets one or more models to try when the main model is overloaded or not available. |
| `--betas <betas...>` | <Documented /> | Yes | Adds beta headers to API requests, for API key users only. |
| `--advisor <model>` | <Documented /> | No | Turns on the server-side advisor tool with the model that you name. |
| `--thinking <mode>` | <Undocumented /> | No | Sets the thinking mode: `enabled` (the same as `adaptive`) or `disabled`. |
| `--thinking-display <display>` | <Undocumented /> | No | Sets how the thinking text appears in the response. |
| `--max-thinking-tokens <tokens>` | <Undocumented /> | No | Sets a thinking token limit, and the flag is deprecated in favor of `--thinking`. |
| `--task-budget <tokens>` | <Undocumented /> | No | Sets a task budget in tokens on the API side (`output_config.task_budget`). |
| `--fast-mode <on\|off>` | <Undocumented /> | No | Turns fast mode on or off. |
| `--include-unsupported-models` | <Undocumented /> | No | Offers models that your account can use and this version does not know. |
| `--autocompact <auto\|tokens>` | <Documented /> | Yes | Sets the auto-compact window to `auto` or to 100k to 1M tokens. |

### System Prompt

Flags that replace or extend the system prompt. See [System Prompt](../../how-it-works/system-prompt.md).

| Flag | Status | In `--help` | What it does |
| --- | --- | --- | --- |
| `--system-prompt <prompt>` | <Documented /> | Yes | Replaces the system prompt for the session. |
| `--system-prompt-file <file>` | <Documented /> | No | Reads the system prompt from a file. |
| `--append-system-prompt <prompt>` | <Documented /> | Yes | Adds text to the end of the default system prompt. |
| `--append-system-prompt-file <file>` | <Documented /> | No | Reads text from a file and adds it to the end of the default system prompt. |
| `--append-subagent-system-prompt <prompt>` | <Documented /> | No | Adds text to the system prompt of every subagent, with `--print` only. |
| `--append-subagent-system-prompt-file <file>` | <Documented /> | No | Reads text from a file and adds it to every subagent prompt, with `--print` only. |
| `--system-prompt-snapshot <on\|off>` | <Documented /> | Yes | Sets whether the system prompt is recorded once and reused on every request and resume. |
| `--exclude-dynamic-system-prompt-sections` | <Documented /> | Yes | Moves the data of the machine from the system prompt to the first user message for better cache reuse. |

### Sessions and Worktrees

Flags that continue, fork, name, or rewind a session, or run it in a worktree or the background. See [Sessions and Storage](../../how-it-works/sessions-and-storage.md).

| Flag | Status | In `--help` | What it does |
| --- | --- | --- | --- |
| `-c, --continue` | <Documented /> | Yes | Continues the newest conversation of the current folder. |
| `-r, --resume [value]` | <Documented /> | Yes | Resumes a conversation by session ID, or opens the picker. |
| `--fork-session` | <Documented /> | Yes | Creates a new session ID when you resume, with `--resume` or `--continue`. |
| `--from-pr [value]` | <Documented /> | Yes | Resumes a session that links to a pull request. |
| `--session-id <uuid>` | <Documented /> | Yes | Uses a UUID that you give as the session ID. |
| `-n, --name <name>` | <Documented /> | Yes | Sets the display name of the session. |
| `--resume-session-at <message id>` | <Undocumented /> | No | Resumes only up to one message of the chain, with `--resume` in print mode. |
| `--resume-drops-turn <message id>` | <Undocumented /> | No | Names the turn that a truncating resume drops, and the resume fails if more would go. |
| `--reply-on-resume` | <Undocumented /> | No | Asks the model to reply at once when the transcript ends with a user message. |
| `--rewind-files <user-message-id>` | <Undocumented /> | No | Restores the files to the state at a user message and exits, and it needs `--resume`. |
| `--bg, --background` | <Documented /> | Yes | Starts the session in the background and prints its ID. |
| `-w, --worktree [name]` | <Documented /> | Yes | Creates a new git worktree for the session. |
| `--tmux` | <Documented /> | Yes | Creates a tmux session for the worktree, and it needs `--worktree`. |

### Agents, Plugins, MCP, and Context

Flags that add agents, plugins, MCP servers, folders, and files.

| Flag | Status | In `--help` | What it does |
| --- | --- | --- | --- |
| `--agent <agent>` | <Documented /> | Yes | Sets the agent of the session and overrides the `agent` setting. |
| `--agents <json-or-file>` | <Documented /> | Yes | Defines custom agents with JSON or a file. |
| `--mcp-config <configs...>` | <Documented /> | Yes | Loads MCP servers from JSON files or strings. |
| `--strict-mcp-config` | <Documented /> | Yes | Uses only the MCP servers from `--mcp-config`. |
| `--plugin-dir <path>` | <Documented /> | Yes | Loads a plugin from a folder or a `.zip` file for this session only. |
| `--plugin-url <url>` | <Documented /> | Yes | Fetches a plugin `.zip` file from a URL for this session only. |
| `--plugin-dir-no-mcp <path>` | <Undocumented /> | No | Works like `--plugin-dir` but does not read the `.mcp.json` of the plugin. |
| `--disable-slash-commands` | <Documented /> | Yes | Turns off all skills. |
| `--add-dir <directories...>` | <Documented /> | Yes | Gives the tools access to more folders. |
| `--brief` | <Undocumented /> | Yes | Turns on the `SendUserMessage` tool so the agent can message the user. |
| `--file <specs...>` | <Undocumented /> | Yes | Downloads file resources at startup, in the form `file_id:relative_path`. |
| `--channels <servers...>` | <Documented /> | No | Lists the MCP servers whose channel notifications may register this session. |
| `--dangerously-load-development-channels <servers...>` | <Documented /> | No | Loads channel servers that are not on the allowlist, for local development only. |
| `--watch-artifact <artifact>` | <Undocumented /> | No | Watches a Claude artifact for new versions and comments. |
| `--watch-artifact-no-autoreact <artifact>` | <Undocumented /> | No | Watches an artifact and does not react to it by itself. |
| `--messaging-socket-path <path>` | <Undocumented /> | No | Sets the socket or pipe path of the cross-session messaging server. |
| `--proactivity <level>` | <Undocumented /> | No | Sets the level of proactivity, and the bundle gives no help text. |

### Teammate Flags

Flags that a lead agent passes to a teammate process it starts. You rarely set them by hand.

| Flag | Status | In `--help` | What it does |
| --- | --- | --- | --- |
| `--agent-id <id>` | <Undocumented /> | No | Sets the ID of a teammate agent. |
| `--agent-name <name>` | <Undocumented /> | No | Sets the display name of a teammate. |
| `--team-name <name>` | <Undocumented /> | No | Sets the team name for teammate coordination. |
| `--agent-color <color>` | <Undocumented /> | No | Sets the UI color of a teammate. |
| `--plan-mode-required` | <Undocumented /> | No | Requires plan mode before the teammate implements anything. |
| `--teammate-mode <mode>` | <Documented /> | No | Sets the mode of a teammate, and the bundle gives no help text. |
| `--agent-type <type>` | <Undocumented /> | No | Sets a custom agent type for a teammate. |
| `--parent-session-id <id>` | <Undocumented /> | No | Gives the parent session ID for analytics. |

### IDE, Desktop, and Deep Links

Flags that connect to an IDE, the desktop app, or a deep link.

| Flag | Status | In `--help` | What it does |
| --- | --- | --- | --- |
| `--ide` | <Documented /> | Yes | Connects to the IDE at startup when exactly one valid IDE is open. |
| `--desktop` | <Documented /> | Yes | Opens the session in the Claude Desktop app instead of the terminal. |
| `--chrome` | <Documented /> | Yes | Turns on the Claude in Chrome integration. |
| `--no-chrome` | <Documented /> | Yes | Turns off the Claude in Chrome integration. |
| `--prefill <text>` | <Undocumented /> | No | Fills the prompt box with text and does not send it. |
| `--prefill-b64 <b64>` | <Undocumented /> | No | Fills the prompt box with base64url text, for deep links. |
| `--deep-link-origin` | <Undocumented /> | No | Says that a deep link started this session. |
| `--deep-link-repo <slug>` | <Undocumented /> | No | Gives the repo slug that the deep link resolved to the current folder. |
| `--deep-link-last-fetch <ms>` | <Undocumented /> | No | Gives the time of the last fetch of the repo, in milliseconds. |
| `--deep-link-cwd-b64 <b64>` | <Undocumented /> | No | Gives the working folder as base64url text, for deep links. |

### Cloud and Remote Sessions

Flags for cloud sessions and Remote Control.

| Flag | Status | In `--help` | What it does |
| --- | --- | --- | --- |
| `--teleport [session]` | <Documented /> | Yes | Resumes a teleport session. |
| `--cloud [description\|session_id\|url]` | <Documented /> | Yes | Creates a cloud session, or attaches to one by session ID or `claude.ai/code` URL. |
| `--environment <environment_id>` | <Documented /> | Yes | Creates a cloud session on a self-hosted environment. |
| `--remote-control [name]` | <Documented /> | Yes | Starts an interactive session with Remote Control turned on. |
| `--rc [name]` | <Documented /> | No | Is an alias for `--remote-control`. |
| `--remote-control-session-name-prefix <prefix>` | <Documented /> | Yes | Sets the prefix of the names that Remote Control makes, and the default is the host name. |
| `--remote [description\|session_id\|url]` | <Documented /> | No | Is a deprecated alias for `--cloud`. |
| `--pool <pool_id>` | <Undocumented /> | No | Is a deprecated alias for `--environment`. |
| `--correlation-id <id>` | <Undocumented /> | No | Sets an ID that goes back to the environment orchestrator, and it needs `--environment`. |
| `--ref <ref>` | <Documented /> | No | Sets the branch, tag, or SHA to check out in the remote session, and it needs `--cloud` or `--environment`. |
| `--on-branch <branch>` | <Undocumented /> | No | Works directly on a branch in the remote session, with checkout and push. |
| `--forward-home-settings <true\|false>` | <Undocumented /> | No | Sets whether this machine sends its settings to the cloud session. |
| `--attach-serve <session_id>` | <Undocumented /> | No | Attaches a helper to a cloud session, and the desktop app starts it. |

## Related Pages

- [CLI Overview](index.md)
- [Subcommands](subcommands.md)
- [Environment Variables](../env-vars/index.md) for variables that match many flags.
- [Permission Modes](../permissions/modes.md) for the values of `--permission-mode`.
