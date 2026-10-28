---
title: Release Archive
description: What changed in Claude Code 2.1.300 to 2.1.311, newest first, kept from the What Changed page.
sidebar_position: 4.5
---

This page keeps the sections that [What Changed](what-changed.md) had for `2.1.300` to `2.1.311`, newest first.
Each section is kept as it was written for its release. The other pages of this site cover the current release, so a later release may have changed a row here.

## Version 2.1.311

Released October 26, 2026. Source: [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.311).
Rows marked with the program come from a comparison of the `2.1.310` and `2.1.311` programs. The flags, settings, hooks, and commands did not change.

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| `ultrathink` | <Documented /> | In the interactive terminal on the Anthropic API, the word runs its turn at `xhigh` effort on Opus 5.5, Sonnet 5.5, Haiku 5.5, and Fable 5.1. Typed during a turn, it raises the rest of that turn (the program). | [Models and Providers](../configure/models-and-providers.md#effort) |
| `[1m]` suffix | <Documented /> | Names and IDs drop the suffix and the `(1M context)` label where the suffix has no effect. The suffix is still accepted (the program). | [Models and Providers](../configure/models-and-providers.md#aliases) |
| Compact and continue | <Undocumented /> | A standard-window session that goes over 200K tokens and gets "Usage credits required for 1M context" now compacts and goes on (the program). | [Context and Compaction](../how-it-works/context-and-compaction.md#kinds-of-compaction) |
| Summary asked again | <Undocumented /> | When a compaction reply has no summary, Claude Code usually asks once more before it replaces the conversation (the program). | [Context and Compaction](../how-it-works/context-and-compaction.md#kinds-of-compaction) |
| No retry when the API says so | <Undocumented /> | A `429` or `529` marked `x-should-retry: false` is not retried, also with `CLAUDE_CODE_RETRY_WATCHDOG` (the program). | [Models](../how-it-works/models.md#retries-and-timeouts) |
| Shell timeout output | <Undocumented /> | A `Bash` command that reaches its timeout returns the output so far, and keeps running in the background (the program). | [Shell, Web, and Background Tasks](../reference/tools/shell-and-web.md#how-it-works) |
| `self-hosted-runner` hold flags | <Undocumented /> | `--hold-idle-file` and `--max-hold-min` keep an idle session while your host reports processes it left running (the program). | [Subcommands](../configure/cli/subcommands.md#self-hosted-runner-hold-flags) |
| Permission rule warnings | <Undocumented /> | A startup warning about a rule in a settings file shows once per user until the rule changes (the program). | [Permission Flow](../how-it-works/permission-flow.md#step-by-step) |
| Pro and Max startup | <Undocumented /> | Within an hour of the last Consumer Terms check, startup skips two requests. A refused subscription now points to billing settings (the program). | [Account and Access](../how-it-works/account-and-access.md#when-it-asks-again) |
| Model catalog on cloud providers | <Undocumented /> | On Bedrock, Mantle, Vertex, and Foundry, Claude Code can load model settings from a signed file. `CLAUDE_CODE_MODEL_CATALOG=off` turns this off (the program). | [Models and Effort](../configure/env-vars/models-and-effort.md#variables) |
| `DISABLE_COMPACT` in settings | <Documented /> | Set in a settings file or by a mod's `$.env.set`, it can only turn compaction off (the program). | [Context and Compaction Variables](../configure/env-vars/context-and-compaction.md#variables) |
| `$.prompt.paint` | <Documented /> | A mod can paint styled runs over the draft in the prompt box without changing it (the program). | [Turn and Prompt](../extend/mod-api/turn-prompt.md#members) |
| `pluginDigests` | <Documented /> <ManagedOnly /> | Managed settings can name the digests of the plugin releases that the organization delivers (the program). | [Marketplaces](../extend/plugins/marketplace.md#plugin-digests) |
| New result fields | <Undocumented /> | `Agent` results can carry `toolsUsed`, and `Bash` and `PowerShell` results can carry `subagentCapApplied` (the program). | [Agents and Tasks](../reference/tools/agents-and-tasks.md#result-fields-new-in-21311), [Shell, Web, and Background Tasks](../reference/tools/shell-and-web.md#how-it-works) |
| New environment variables | <Undocumented /> | 36 names are new, such as `CLAUDE_CODE_SESSIONS_OAUTH_TOKEN` and `CLAUDE_CODE_MCP_REGISTRY_FETCH_AT_STARTUP`. `CLAUDE_CODE_TOOL_CONTAINER_PLUGINS_NAMED` is gone (the program). | [Environment Variables](../configure/env-vars/index.md) |

The print and interactive probes matched `2.1.310`, apart from these: the longer `/code-review` listing, the shell name in the environment block, the new result fields, a new store file of the built-in `cc-plugin-agents-md` plugin, and a new order of the same beta headers. With `CLAUDE_CODE_DISABLE_1M_CONTEXT` set, the skill listing in the first request now gives skill names without their descriptions. With 1M off, Opus 5.5 gets a 6,000-character listing budget (200,000 tokens × 3 characters × 1%, the program), and the longer `2.1.311` listing no longer fits; `2.1.310`'s still did. See [Skill Listing Budget](../extend/skills-and-commands/index.md#loading-and-controls). The `CLAUDE_CODE_USE_BEDROCK` sweep case changed only because the probe could reach the AWS instance metadata address on that network. With that lookup off, both versions retry twice and stop with "Could not load AWS credentials".

## Version 2.1.310

Released October 23, 2026. Source: [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.310).
Rows marked with the program come from a comparison of the `2.1.309` and `2.1.310` programs. The flags, settings, hooks, and commands did not change.

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| `Monitor` and plugin monitors | <Documented /> | They no longer wait for a server flag, so they also work on Bedrock, Vertex, and Foundry, and with telemetry or nonessential traffic off (the program). | [Shell, Web, and Background Tasks](../reference/tools/shell-and-web.md#how-it-works), [Plugin Manifest](../extend/plugins/manifest.md#top-level-keys) |
| Long leading `sleep` | <Undocumented /> | Where `Monitor` is newly on, `Bash` now also refuses a command that starts with a `sleep` of 25 seconds or more, and points Claude to `Monitor` (the program). | [Shell, Web, and Background Tasks](../reference/tools/shell-and-web.md#how-it-works) |
| Effort refused | <Undocumented /> | When the server refuses the effort setting, the request goes again without it and without the `effort-2025-11-24` beta (the program). | [Betas](../reference/api/betas.md#registry), [Models and Providers](../configure/models-and-providers.md#effort) |
| Sandbox warnings | <Documented /> | On Ubuntu, the warning names the AppArmor limit that stops bubblewrap. A new warning says when deny paths on another computer are not enforced (the program). | [Sandbox](../configure/permissions/sandbox.md#other-behavior) |
| Mod `Image` in tmux | <Documented /> | An `Image` draws inside tmux when `allow-passthrough` and `focus-events` are on. `$.ui.blit` gives `fix: 'tmux-passthrough'` when they are off. | [UI Types](../extend/mod-api/types/ui.md#imageprops) |
| `/claude-api` retired models | <Undocumented /> <Gated note="Server flags decide" /> | It can list the deprecated or retired model IDs that it finds in the project (the program). | [Bundled Skills](../extend/skills-and-commands/bundled-skills.md) |
| New environment variables | <Undocumented /> | `CLAUDE_CODE_ARTIFACT_ASK_FIRST`, `CLAUDE_CODE_RETRY_WATCHDOG_SCOPE`, and `CLAUDE_CODE_DESKTOP_CONNECTOR_NAMES`. `CLAUDE_CODE_ARTIFACT_TYPES` is on by default now (the program). | [Features and Toggles](../configure/env-vars/features-and-toggles.md#variables), [Network and Proxy](../configure/env-vars/network-and-proxy.md#variables), [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md#variables) |

The print and interactive probes matched `2.1.309`, apart from `Monitor` in the tool list and the sizes that follow from it, and run-to-run noise.

## Version 2.1.309

Released October 22, 2026. Source: [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.309).
Rows marked with the program come from a comparison of the `2.1.308` and `2.1.309` programs. The settings, hooks, and commands did not change.

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| `claude ultrareview` trust | <Documented /> | The command needs a trusted folder. It asks on a terminal. In a script, pass `--trust-workspace` or set `CLAUDE_CODE_DISABLE_ULTRAREVIEW_TRUST_CHECK=1` (the program). | [Subcommands](../configure/cli/subcommands.md) |
| Dangerous `rm` in bypass mode | <Undocumented /> | In the desktop app and VS Code, a dangerous `rm` or `rmdir` is denied at once with a hint to rewrite it. | [Permission Modes](../configure/permissions/modes.md#safety-checks) |
| `sandbox.excludedCommands` | <Documented /> | While the sandbox is on but cannot run, these commands ask before they write to the sandbox's write paths. | [Sandbox](../configure/permissions/sandbox.md#core-keys) |
| Large nested `CLAUDE.md` | <Documented /> | A nested file over the size limit loads only its start, so it no longer makes the session compact again and again. | [Memory and Rules](../configure/memory-and-rules.md#how-it-works) |
| `--add-dir` skill names | <Documented /> | A skill whose name another skill has is offered as `<folder>:<name>`. | [Skills and Commands](../extend/skills-and-commands/index.md#skill-locations) |
| Mod API `cursor` and model alias | <Documented /> | `$.prompt.fill` and the `prompt.fill` event take `cursor`, which places the caret. A `turn.step` hook can name the model by an alias such as `haiku` (the program). | [Turn and Prompt Types](../extend/mod-api/types/turn-prompt.md) |
| `mcp_status` `liveReply` | <Undocumented /> | A control request can ask for a reply sent only to the clients attached at that moment (the program). | [Control Protocol](../extend/headless/control-protocol.md) |
| `result` `model_usage_since_last_result` | <Undocumented /> | Each `result` line of `stream-json` output also gives the usage and cost of only the calls since the previous result, per model and shaped like `modelUsage`. Add it up over the results instead of subtracting `modelUsage` totals (the program). | [Stream JSON](../extend/headless/stream-json.md#exact-fields) |
| Bedrock tool streaming | <Documented /> | A Bedrock base URL on Amazon's own `bedrock-runtime` host no longer counts as custom, so fine-grained tool streaming works with it (the program). | [Network and Proxy](../configure/env-vars/network-and-proxy.md#variables) |
| `Bash` tool text | <Undocumented /> | The description grew from 1,406 to 1,688 characters, with a new line on GitHub `@name` mentions (the program). | [Tool Descriptions](../prompts/tools/tools.md#bash) |
| New environment variables | <Undocumented /> | Six more new variables for cloud sessions, the self-hosted runner, resumed sessions, plugin sync, and artifact sharing (the program). | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md#variables), [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md#variables), [Features and Toggles](../configure/env-vars/features-and-toggles.md#variables) |

The print and interactive probes matched `2.1.308`, apart from the Bash text, the new environment variables, and the new `result` field above, and run-to-run noise.

## Version 2.1.308

Released October 22, 2026. Source: [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.308). The notes list only bug fixes and reliability improvements.

A comparison of the `2.1.307` and `2.1.308` programs found no change to environment variables, flags, commands, settings, hooks, or gates. The Mod API type file is the same except for the version in its header (the program).
The print, interactive, managed folder, and live login probes matched `2.1.307`, apart from run-to-run noise: a warm-cache live run moved by up to 3 tokens, and MCP servers started in another order.

## Version 2.1.307

Released October 21, 2026. Source: [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.307).
Rows marked with the program come from a comparison of the `2.1.306` and `2.1.307` programs.

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| `set_model` reply | <Undocumented /> | A `set_model` control reply now has `response.model`, the model the session uses. An alias comes back as the full ID. Probe `print.control.requests` saw the new field. The release notes say the Agent SDK's `setModel()` now waits up to 15 seconds, not 5. | [Control Protocol](../extend/headless/control-protocol.md) |
| `prompt-caching-scope` beta | <Documented /> | Not sent behind a custom `ANTHROPIC_BASE_URL` gateway or on Foundry. A stub run sent 9 betas, not 10. | [Betas](../reference/api/betas.md) |
| Bad tool calls | <Documented /> | Claude Code retries a tool call it cannot parse up to twice before it ends the turn. | [Agent Loop](../how-it-works/agent-loop.md) |
| Fork subagents | <Documented /> | Forks started together are each told which launch is their own. | [Subagent Runtime](../extend/subagents/runtime.md) |
| `Agent` tool text | <Undocumented /> | The description grew from 1,989 to 3,227 characters. It now lists the costs of a subagent and how to brief one (the program). | [Tool Descriptions](../prompts/tools/tools.md#agent) |
| Web-reading agent | <Undocumented /> | Its prompt has one new line: give the date of a stored copy of a page, and do not fetch it again (the program). | [Subagent, Web Fetch](../prompts/agents/subagent-web-fetch.md) |
| Transcript `sandboxed` key | <Undocumented /> | A shell tool result line can carry `sandboxed` (the program). | [Transcript Format](../reference/transcript-format.md) |
| `/claude-api api-version` | <Documented /> | Moves Claude API code to API version `2026-10-21`. | [Bundled Skills](../extend/skills-and-commands/bundled-skills.md) |
| `claude_code.safety_event` | <Documented /> | A new OpenTelemetry event for each tool call that a rule, auto mode, a safety check, a hook, or the sandbox stopped, prompted, or sent back. | [Telemetry and Debug Variables](../configure/env-vars/telemetry-and-debug.md#how-it-works) |
| Checkout hook time limit | <Documented /> | A self-hosted runner stops a checkout hook after 30 minutes by default, and the setup fails. `--checkout-hook-timeout-min` raises it, and `0` turns it off. | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `--diff-finds-nested-repository` | <Undocumented /> | A self-hosted runner flag. The web Changes pane can show a repository cloned in a subfolder (the program). | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| `axScreenReader` | <Documented /> | The setting and `CLAUDE_AX_SCREEN_READER` in a settings `env` block apply only from user, managed, or `--settings` settings. The program already did this in `2.1.306`. | [UI and Terminal Variables](../configure/env-vars/ui-and-terminal.md) |
| `sshHostCommands` | <Undocumented /> | A new setting for the desktop app: SSH connections whose host comes from a command. Claude Code itself does not use it (the settings schema). | [Agents and Remote Settings](../configure/settings/agents-and-remote.md) |
| Mod API `tool.check` | <Documented /> | The input carries `approver`, who answers an ask. Every ask a hook makes goes to a person, and the engine marks it with `plugin`. The type file drops `decider`. A test's `$.tool.call` takes `agentId` (the type file). | [Tool and Command Config Types](../extend/mod-api/types/tool-command-config.md) |
| New variables | <Undocumented /> | `CLAUDE_CODE_SUBAGENT_HISTORY`, `CLAUDE_CODE_DISABLE_LAUNCHER_SIGN_IN`, `CLAUDE_CODE_WITTY_DEWDROP`, and `CLAUDE_CODE_IGNORE_PERSISTED_TRUST` (the program). `CLAUDE_CODE_ADOPT_UNDERIVABLE_PARKED_PERMISSION` is gone. | [Environment Variables](../configure/env-vars/index.md) |

The release also fixes MCP servers after a computer sleeps or the macOS keychain is locked, HTTP MCP tool calls that were sent twice, `CLAUDE_CODE_DISABLE_1M_CONTEXT` with a `[1m]` alias such as `opus[1m]`, and many cloud session, self-hosted runner, and VS Code issues.
Read the [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.307) for the full list.

A comparison of the `2.1.306` and `2.1.307` programs also found runner-internal names (`--runner-declares`, `CLAUDE_CODE_DIFF_COPY_ROOT`, `CLAUDE_CODE_FOUND_REPOSITORY_GIT`, `CLAUDE_RUNNER_UPDATE_BIN`) that you do not set, so this site does not list them (the program).

## Version 2.1.306

Released October 21, 2026. Source: [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.306).

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| `claude -p` in cloud sessions | <Documented /> | `claude -p` no longer reports "Not logged in" when you start it without the session's environment variables. | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| "Prompt is too long" with many MCP tools | <Documented /> | In a session with many MCP tools, an API error is no longer replaced by "prompt is too long", and Claude Code no longer runs a compaction it does not need. | [Context and Compaction](../how-it-works/context-and-compaction.md) |

A comparison of the `2.1.305` and `2.1.306` programs found no change to environment variables, flags, commands, settings, hooks, or gates (the program).

Live runs on `2.1.306` with a subscription login found these (see [Probes](../reference/probes.md#live-login-probes)):

- `/artifacts` said `Unknown command: /artifacts` in the interactive screen, and no panel opened. This differs from `2.1.305`. The cause is not known.
- `/usage` with proxy faults (a `429`, a `429` with `Retry-After: 1800`, and a `200` error envelope): the usage endpoint was again never called, so the rate-limit texts are still seen only against the stub.
- The main request of a login run and a fake-key run had the same body keys and tools. The login sent two more betas. See [Betas](../reference/api/betas.md#observed-request).

The managed folder probe on `2.1.306` (stub and fake key, no login) matched what the docs say. Cases `mcp-*`, `outputstyle`, `skill-*`, `claudemd-order`, `excludes-*`, `agent-mcp`, and `auto-mode-config` matched every row in [Managed Folder Probe](../reference/probes.md#managed-folder-probe). Cases `classify-*` matched [`autoMode.classifyAllShell`](../reference/probes.md#automodeclassifyallshell).

## Version 2.1.305

Released October 20, 2026. Source: [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.305).
Rows marked with the program come from a comparison of the `2.1.304` and `2.1.305` programs.

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| `plugin validate --profile` | <Undocumented /> | `--profile directory` also checks a plugin against the plugin directory's submission rules, with checks such as README, `LICENSE`, icon, and `privacyPolicyUrl`. It is not in the release notes (the program). | [Plugin CLI](../extend/plugins/cli.md) |
| `/usage` fixes | <Documented /> | Each warning is a one-line fix that names its source, and `f` applies the fixes. The same fixes appear in VS Code and `/doctor`. | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `/artifacts` delete | <Documented /> | 1 or Enter keeps, 2 deletes, Esc cancels. `y` and `n` no longer answer. | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| Tool search retry | <Documented /> | Claude Code retries without tool search when the endpoint or a gateway rejects it, or when `ToolSearch` is disallowed or left out of `--tools`. This fixes a `2.1.304` regression. | [MCP Runtime](../extend/mcp/runtime.md) |
| Mod API | <Documented /> | A docked pane stays within 45% of the terminal's width. `Image` draws in iTerm2 3.5 and later with fullscreen rendering. | [Mod API UI Types](../extend/mod-api/types/ui.md) |
| Bash on a full disk | <Documented /> | The error says the disk is full and that nothing ran. | [Shell and Web Tools](../reference/tools/shell-and-web.md) |
| Remote Control `!` commands | <Undocumented /> | A `!` command sent over Remote Control is not run, and the message tells you to run it on the computer itself (the program). | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |

The release also adds `sandbox.allowNestedUserNamespaces`, `CLAUDE_CODE_RETRY_WATCHDOG_USAGE_LIMIT_RECHECK_MS`, and many fixes.
Read the [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.305) for the full list.

## Version 2.1.304

Released October 19, 2026. Source: [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.304).
Rows marked with the program come from a comparison of the `2.1.303` and `2.1.304` programs.

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| Tool search on by default | <Documented /> | Tool search is on behind a custom `ANTHROPIC_BASE_URL`. A 400 or 422 from the gateway is retried without it. The site's captures use a local stub as `ANTHROPIC_BASE_URL`, so the main prompt there now lists 12 tools, not 20. | [Tools Reference](../reference/tools/index.md) and [Tools per Variant](../prompts/tools/tools-per-variant.md) |
| `/auto-mode-setup` | <Documented /> | A guided setup that reads your project and recent sessions. It is now on Bedrock, Vertex, Foundry, a Claude apps gateway, and with telemetry off. | [Auto Mode](../configure/permissions/auto-mode.md) |
| `/claude-api managed-agents-secure` | <Documented /> | Compares a Managed Agents agent's settings with Anthropic's security guide. It changes nothing. | [Bundled Skills](../extend/skills-and-commands/bundled-skills.md) |
| `/artifacts` delete | <Documented /> | The confirmation shows numbered choices: 1 or Enter keeps, 2 deletes. | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |
| `--disable-slash-commands` | <Documented /> | The help text now says it disables skills and commands. | [Skills and Commands](../extend/skills-and-commands/index.md) |
| Mounted drive `rm -r` prompt | <Documented /> | `rm -r` of a mounted drive or a folder at its top level (`/Volumes`, `/media`, `/mnt/c`) gets a safety prompt. The program has an env var `CLAUDE_CODE_DISABLE_MOUNTED_DRIVE_RM_PROMPT` that skips this check. | [Tools and Bash Variables](../configure/env-vars/tools-and-bash.md) |
| `denyRead` brackets on Linux | <Documented /> | A `sandbox.filesystem.denyRead` glob such as `[user-id]` no longer stops sandboxed commands from starting. | [Sandbox](../configure/permissions/sandbox.md) |
| `CLAUDE_CODE_AUTO_COMPACT_WINDOW` | <Documented /> | Accepts `k` and `M` suffixes, and warns when a value is out of range or ignored. | [Context and Compaction Variables](../configure/env-vars/context-and-compaction.md) |
| Plugin MCP switches | <Undocumented /> | The program has `CLAUDE_CODE_SKIP_PLUGIN_LOCAL_MCP_SERVERS` (only `sse`, `http`, and `ws` plugin servers load) and `CLAUDE_CODE_SKIP_PLUGIN_MCP_BUNDLES`. | [Plugins and MCP Variables](../configure/env-vars/plugins-and-mcp.md) |
| Low disk and memory warnings | <Undocumented /> | The program reads `CLAUDE_CODE_WARN_DISK_FREE_GIB` and `CLAUDE_CODE_WARN_MEMORY_FREE_GIB`, both `0` by default. | [Remote and Cloud Sessions](../configure/env-vars/remote-and-cloud-sessions.md) |
| Mod API changes | <Documented /> | `decider: "person"` on `tool.check`, `e.isReadOnly`, and `settings.read` hooks that get each settings layer. | [Mod API](../extend/mod-api/index.md) |
| Fixes | <Documented /> | `/usage` names when a rate limit ends. `/effort status` no longer guesses for `auto` or `unset`. Self-paced `/loop` wakeups at the 1-hour maximum no longer miss the prompt cache. | [Slash Commands](../extend/skills-and-commands/slash-commands.md) |

The release also changes the `claude --help` text, adds a resume warning on Pro and Max plans, and has many more fixes.
Read the [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.304) for the full list.

## Version 2.1.303

Released October 18, 2026. Source: [Changelog](https://code.claude.com/docs/en/changelog).

The release notes say only "Bug fixes and reliability improvements."
A comparison of the `2.1.302` and `2.1.303` programs found one change in the code: how Claude Code treats `NODE_EXTRA_CA_CERTS`.
Source: the program.

| Change | Status | What it means for you |
| --- | --- | --- |
| Root certificate deny list | <Undocumented /> | Claude Code now has a deny list of root certificates. It drops a listed certificate from the `NODE_EXTRA_CA_CERTS` file and prints a message that says so. |
| New CA messages | <Undocumented /> | New texts say that Claude Code ignored a block or the whole file, or that no root certificates are left to trust. The last one asks you to update Claude Code. |
| CA store fallback | <Undocumented /> | When the system CA API is not available, the debug line now says Claude Code uses the bundled roots. |

The counts of settings keys, hook events, tools, slash commands, CLI flags, and models did not change.
The Mod API type file did not change.
See [Network and Proxy Variables](../configure/env-vars/network-and-proxy.md) for the certificate variables.

## Version 2.1.302

Released October 16, 2026. Source: [Changelog](https://code.claude.com/docs/en/changelog).

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| `CLAUDE_CODE_AUTO_MODE_MODEL` added | <Documented /> | Picks the model of the client-side auto mode classifier. It does not change server-side auto mode. | [Auto Mode](../configure/permissions/auto-mode.md) |
| `Idle compaction` row in `/config` | <Documented /> | You can turn idle compaction off or on from `/config`. | [Context and Compaction](../how-it-works/context-and-compaction.md) |
| Print mode default permission mode | <Documented /> | `claude -p` and Agent SDK sessions with no permission mode start in `default` mode on third-party providers, with telemetry off, or on a fresh install. `--permission-mode auto` keeps auto. | [Permission Modes](../configure/permissions/modes.md) |
| Fork subagents on by default | <Documented /> | `subagent_type: "fork"` is on in `claude -p`, the Agent SDK, the desktop app, and VS Code, as in the terminal. `CLAUDE_CODE_FORK_SUBAGENT=0` turns it off. | [Subagent Runtime](../extend/subagents/runtime.md) |
| Subagents run in the background | <Documented /> | The desktop app and VS Code always run the main conversation's subagents in the background. | [Subagent Runtime](../extend/subagents/runtime.md) |
| Hook limit | <Documented /> | At most 12 prompt or agent hooks of one event run at a time. The rest wait. | [Hook Handlers](../extend/hooks/handlers.md) |
| Read tool image limit | <Documented /> | Image sources over 128 MB are refused. | [Read tool](../reference/tools/files.md) in the Tools reference. |
| Faster plugin startup | <Documented /> | Plugin command and agent files take fewer file system calls to load. | [Plugin Loading](../extend/plugins/loading.md) |
| Auto mode with a long conversation | <Documented /> | The server-side classifier now compacts a conversation that is too long for the check, instead of denying every checked call. | [Auto Mode](../configure/permissions/auto-mode.md) |
| OpenTelemetry `tool_decision` fixes | <Documented /> | `classifier_category` is set for most auto mode blocks. New attributes no longer push out `tool_use_id`, `tool_source`, and `tool_parameters`. | [Telemetry and Debug Variables](../configure/env-vars/telemetry-and-debug.md) |

The release also fixes errors when you switch to Vertex or Bedrock in the middle of a session, a prompt cache miss after ToolSearch, and plugin marketplaces that cloned again on every refresh.

## Version 2.1.301

Released October 15, 2026. Source: [Changelog](https://code.claude.com/docs/en/changelog).

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| `CLAUDE_CODE_RETRY_WATCHDOG_MAX_USAGE_LIMIT_WAIT_MS` added | <Documented /> | Unattended retry mode ends a request at a usage limit that resets too far away. | [Environment Variables](../configure/env-vars/index.md) |
| Vim `%` motion | <Documented /> | Jumps to the matching bracket, alone or with `d`, `c`, or `y`. | [Changelog](https://code.claude.com/docs/en/changelog) (the changelog entry for 2.1.301) |
| Mod `Input` gets `rows` | <Documented /> | A text field of several lines. Enter submits. | [Mod API UI](../extend/mod-api/ui.md) |
| Mod hook `.catch` runs less often | <Documented /> | It runs only when the hook throws or times out. | [Mod API Hooks](../extend/mod-api/hooks.md) |
| Mod `$.env.set` result | <Documented /> | It resolves with `{}` once set, or with `{ deny }` and a reason. | [Clock, HTTP, Process, Env, and Settings](../extend/mod-api/clock-http-process-env-settings.md) |
| OpenTelemetry `tool_decision` | <Documented /> | New `classifier_verdict` and `permission_mode` attributes. | [Telemetry and Debug Variables](../configure/env-vars/telemetry-and-debug.md) |
| Model with a smaller context window | <Documented /> | The previous model summarizes a conversation that is too long for the new model. | [Context and Compaction](../how-it-works/context-and-compaction.md) |

## Version 2.1.300

Released October 14, 2026. Source: [Changelog](https://code.claude.com/docs/en/changelog).

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| Local transcripts record the request | <Documented /> | Each API request's system prompt, tools, and parameters now go into the local transcript. A transcript you share can reproduce a request. | [Transcript Format](../reference/transcript-format.md) |
| Gzip for large requests | <Documented /> | Large requests to api.anthropic.com use gzip even when telemetry is off. `CLAUDE_CODE_GZIP_REQUEST_BODIES=0` turns it off. | [Network and Proxy Variables](../configure/env-vars/network-and-proxy.md) |
| `updatedInput` is checked | <Documented /> | Input from `PreToolUse` and `PermissionRequest` hooks is checked like Claude's own input. Unknown keys are dropped, and input the tool rejects denies the call. | [Hook Input and Output](../extend/hooks/input-and-output.md) |
| Exit stops background commands | <Documented /> | Exit force-kills background commands still running 1.5 seconds after the stop request. | [Tools and Bash Variables](../configure/env-vars/tools-and-bash.md) |
| `prompt.change` mod hook | <Documented /> | Raised when the prompt text changes without a typed edit. | [Mod API Hooks](../extend/mod-api/hooks.md) |
| `virtualText` in prompt decorations | <Documented /> | Text drawn in the prompt box that never enters the draft. | [Mod API UI](../extend/mod-api/ui.md) |
| `$.ui.view({ agentId })` | <Documented /> | Shows an agent's transcript in the main view. | [Mod API UI](../extend/mod-api/ui.md) |
| `CLAUDE_CODE_DISABLE_ADVISOR_TOOL=1` | <Documented /> | Turns off the advisor tool and the `/advisor` command. | [Tools and Bash Variables](../configure/env-vars/tools-and-bash.md) |

## Older Releases

This site does not cover versions before `2.1.300` in detail.
The official [Changelog](https://code.claude.com/docs/en/changelog) lists them, and the weekly [What's New](https://code.claude.com/docs/en/whats-new) digest covers the larger features.

:::note[What We Checked]
The rows for `2.1.300` to `2.1.302` match the changelog text that the program itself stores. The `2.1.304` rows come from the [official release notes](https://code.claude.com/docs/en/changelog) and from a comparison of the `2.1.303` and `2.1.304` programs.
We ran these `2.1.304` rows again on `2.1.305`, and they held: the print-mode permission default (`init` shows `default`, and `--permission-mode auto` keeps `auto`), the transcript request lines (`api-request`, `api-request-shape`, and `api-request-blob`), the tool search tool list behind a custom base URL, and the `CLAUDE_CODE_AUTO_COMPACT_WINDOW` warnings.
We also ran these against a local stub with a fake key:

- `/auto-mode-setup` opens its screen ("Teach auto mode about your environment?") behind a custom base URL.
- `/effort status` prints `Effort level: auto (currently medium)` for `auto`, and `/effort unset` sets `auto`. For a set level it prints `Current effort level: high (...)`.
- `/loop` with a `ScheduleWakeup` of 7200 seconds was clamped: the tool result said `clamped to 3600s from your requested value`. The cache fix itself cannot be seen with a stub.
- The Mod API items: `tool.check` got `isReadOnly: true` for `Read`. An ask with `decider: "person"` showed a dialog in the default mode, and in `-p` it was refused as `Permission to use Bash denied by plugin <name>: <reason>`, while an ask without it said `Bash needs approval (asked by plugin <name>: <reason>)`. The `settings.read` hook got `layers`, such as `[{"source":"user","settings":{...}}]`.
- `denyRead` brackets are a Linux fix. On macOS a sandboxed `echo` with `denyRead` globs holding `[user-id]` ran fine, which does not show the Linux fix.

The `/artifacts` delete confirmation was seen live on `2.1.305`, with a throwaway artifact that the run published and deleted. The panel asks `Delete <title>? This cannot be undone.` It offers `1. No, keep it` and `2. Yes, delete it`, with the first one selected, and the footer says `Esc to go back`. Pressing `y` did nothing. Down then Enter chose yes, the list showed `Deleting…`, then `Artifact deleted`, and a refresh showed an empty list. `2.1.304` added the numbered choices and kept `y`, `n`, and Esc; `2.1.305` dropped `y` and `n`. With an API key and no login, `/artifacts` says `Unknown command`. In print mode with `CLAUDE_CODE_OAUTH_TOKEN` it says `/artifacts isn't available in this environment.` In the interactive screen with that token it opens a panel with the tabs `All`, `Mine`, and `Shared`, and an empty list says `No artifacts yet. Publish one with the Artifact tool.`

On `2.1.305`, `/usage` with an API key shows only session cost and tokens. With `CLAUDE_CODE_OAUTH_TOKEN` it also shows the rate-limit rows (`Current session`, `Current week (all models)`, their `Resets` lines) and then `What's contributing to your limits usage?` with `Scanning local sessions…`. With the token the program did not call the usage endpoint in a 35 second run. The rows came from the rate-limit headers of a model reply. A fuller panel needs a claude.ai login with the `user:inference` and `user:profile` scopes (the program). A local stub with fake subscriber credentials showed the `Resets` lines too. The `rate limited until <time>` text is new in `2.1.304`. It appears only when the usage endpoint is rate limited (the program). A stub that answered `429` showed it, in four forms. See [Slash Commands](../extend/skills-and-commands/slash-commands.md). With `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` set, `/usage` shows `Failed to load usage data` and sends no request.

For the `/artifacts` and `/usage` rows, <Documented /> means the release notes name them. A local stub saw the rate-limit end-time text. The live run with a real token could not reach it, because the usage endpoint was never called.
:::

## Example

You update from `2.1.301` to `2.1.303` and your `claude -p` job asks for no permission changes.
Check the 2.1.302 row for print mode. If your job used a third-party provider, set the mode on purpose.

```bash
claude --version
claude -p --permission-mode auto "summarize the diff"
```

## Related Pages

- [What Changed](what-changed.md)
- [How to Read These Docs](how-to-read.md)
- [What Can I Change](what-can-i-change.md)
