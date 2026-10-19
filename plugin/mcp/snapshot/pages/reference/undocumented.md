---
title: "Undocumented Items"
description: "Every item that only the program shows, with a link to its page."
url: https://xsyetopz.github.io/claude-code-docs/reference/undocumented
source: docs/reference/undocumented.md
---

# Undocumented Items


This page lists everything that official Anthropic docs leave out.
Each item carries the [Undocumented] badge on its own page.
Here you find them all in one place, sorted by surface, with a link to the page that explains each one.
An undocumented item can change or vanish in any release, so treat it with care.

Counts are table rows. A row can name several items, such as a list of related variables.
Items that the docs name but describe wrongly are in [Behaves Differently From the Docs](#behaves-differently-from-the-docs).

## Summary

| Group | Count |
| --- | --- |
| [Settings Keys](#settings-keys) | 25 |
| [Environment Variables](#environment-variables) | 868 |
| [CLI Flags and Subcommands](#cli-flags-and-subcommands) | 53 |
| [Permissions](#permissions) | 121 |
| [Hooks](#hooks) | 14 |
| [Commands](#commands) | 2 |
| [Skills](#skills) | 7 |
| [Subagents](#subagents) | 7 |
| [Plugins](#plugins) | 10 |
| [MCP](#mcp) | 37 |
| [Tools](#tools) | 29 |
| [API Endpoints and Betas](#api-endpoints-and-betas) | 54 |
| [System Prompt](#system-prompt) | 34 |
| [Transcript and Sessions](#transcript-and-sessions) | 16 |
| [Headless Protocol](#headless-protocol) | 155 |
| [Mod API](#mod-api) | 0 |
| [Other](#other) | 110 |
| Total | 1542 |

## Settings Keys

Keys for `settings.json` that no official page lists.

Count: 25.

| Item | Where |
| --- | --- |
| `autoUploadSessions` | [Agents and Remote Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/agents-and-remote.md#keys) (Keys) |
| `daemonColdStart` | [Agents and Remote Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/agents-and-remote.md#keys) (Keys) |
| `doneMeansMerged` | [Agents and Remote Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/agents-and-remote.md#keys) (Keys) |
| `modelProposedGoals` | [Agents and Remote Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/agents-and-remote.md#keys) (Keys) |
| `remoteControl` | [Agents and Remote Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/agents-and-remote.md#keys) (Keys) |
| `remoteTools` | [Agents and Remote Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/agents-and-remote.md#keys) (Keys) |
| `skipWorkflowUsageWarning` | [Agents and Remote Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/agents-and-remote.md#keys) (Keys) |
| `xaaIdp` | [Auth Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/auth.md#keys) (Keys) |
| `autoDreamEnabled` | [Core Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/core.md#keys) (Keys) |
| `precomputeCompactionEnabled` | [Core Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/core.md#keys) (Keys) |
| `todoFeatureEnabled` | [Core Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/core.md#keys) (Keys) |
| `policyHelpers` | [Enterprise Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/enterprise.md#keys) (Keys) |
| `defaultView` | [Extra Keys and Global Config](https://xsyetopz.github.io/claude-code-docs/configure/settings/extra-keys.md#auto-mode-voice-and-display-keys) (Auto Mode, Voice, and Display Keys) |
| `disablePluginDirectory` | [Extra Keys and Global Config](https://xsyetopz.github.io/claude-code-docs/configure/settings/extra-keys.md#other-keys) (Other Keys) |
| `isolation.required` | [Extra Keys and Global Config](https://xsyetopz.github.io/claude-code-docs/configure/settings/extra-keys.md#other-keys) (Other Keys) |
| `isolation.persistHome` | [Extra Keys and Global Config](https://xsyetopz.github.io/claude-code-docs/configure/settings/extra-keys.md#other-keys) (Other Keys) |
| `remoteControl.shareHostProfile` | [Extra Keys and Global Config](https://xsyetopz.github.io/claude-code-docs/configure/settings/extra-keys.md#other-keys) (Other Keys) |
| `remoteTools.allowUnattendedServing` | [Extra Keys and Global Config](https://xsyetopz.github.io/claude-code-docs/configure/settings/extra-keys.md#other-keys) (Other Keys) |
| `modelProposedGoals`, `feedbackDrafts`, `availableModelsMatch`, and 2 more | [Settings Files and Scopes](https://xsyetopz.github.io/claude-code-docs/configure/settings.md#exceptions-to-managed-precedence) (Exceptions to Managed Precedence) |
| `totalTokensReminder` | [Model Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/model.md#keys) (Keys) |
| `totalTokensReminderAfterUserTurn` | [Model Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/model.md#keys) (Keys) |
| `totalTokensReminderBudget` | [Model Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/model.md#keys) (Keys) |
| `breakReminder` | [Interface Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/ui.md#keys) (Keys) |
| `quietHours` | [Interface Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/ui.md#keys) (Keys) |
| `showMessageTimestamps` | [Interface Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/ui.md#keys) (Keys) |

## Environment Variables

There are too many to list one by one. Each page below holds a table, and every undocumented variable in it has the Undocumented badge. The pages sort variables by what they do.

Count: 868.

| Page | Undocumented Rows |
| --- | --- |
| [Agents and Teams](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/agents-and-teams.md) | 48 |
| [Auth and Accounts](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/auth-and-accounts.md) | 42 |
| [Bundled Libraries](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/bundled-libraries.md) | 121 |
| [Cloud Providers](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/cloud-providers.md) | 30 |
| [Context and Compaction](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/context-and-compaction.md) | 30 |
| [Features and Toggles](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/features-and-toggles.md) | 54 |
| [Models and Effort](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/models-and-effort.md) | 31 |
| [Network and Proxy](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/network-and-proxy.md) | 22 |
| [Plugins and MCP](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/plugins-and-mcp.md) | 45 |
| [Remote and Cloud Sessions](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/remote-and-cloud-sessions.md) | 98 |
| [SDK and Automation](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/sdk-and-automation.md) | 21 |
| [Sessions and Storage](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/sessions-and-storage.md) | 48 |
| [System and Third-Party](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/system-and-third-party.md) | 104 |
| [Telemetry and Debug](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/telemetry-and-debug.md) | 77 |
| [Tools and Bash](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/tools-and-bash.md) | 53 |
| [UI and Terminal](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/ui-and-terminal.md) | 44 |

## CLI Flags and Subcommands

Hidden or unlisted flags and subcommands.

Count: 53.

| Item | Where |
| --- | --- |
| `--plugin-dir-no-mcp <path>` | [Plugin Commands](https://xsyetopz.github.io/claude-code-docs/extend/plugins/cli.md#session-flags) (Session Flags) |
| `--session-mirror` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#start-and-print-mode) (Start and Print Mode) |
| `--await-claim` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#start-and-print-mode) (Start and Print Mode) |
| `--await-initialize` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#start-and-print-mode) (Start and Print Mode) |
| `--sdk-url <url>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#start-and-print-mode) (Start and Print Mode) |
| `--enable-auth-status` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#start-and-print-mode) (Start and Print Mode) |
| `--workload <tag>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#start-and-print-mode) (Start and Print Mode) |
| `--client-data-url <url>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#start-and-print-mode) (Start and Print Mode) |
| `--allow-other-models` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#start-and-print-mode) (Start and Print Mode) |
| `--managed-settings <json>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#start-and-print-mode) (Start and Print Mode) |
| `--host-auth-is-org-sign-in` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#start-and-print-mode) (Start and Print Mode) |
| `-d2e, --debug-to-stderr` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#safe-modes-settings-and-debug) (Safe Modes, Settings, and Debug) |
| `--project-config-root <dir>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#safe-modes-settings-and-debug) (Safe Modes, Settings, and Debug) |
| `--inherit-permission-mode <mode>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#permissions-and-tools) (Permissions and Tools) |
| `--plan-mode-instructions <instructions>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#permissions-and-tools) (Permissions and Tools) |
| `--thinking <mode>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#model-and-thinking) (Model and Thinking) |
| `--thinking-display <display>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#model-and-thinking) (Model and Thinking) |
| `--max-thinking-tokens <tokens>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#model-and-thinking) (Model and Thinking) |
| `--task-budget <tokens>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#model-and-thinking) (Model and Thinking) |
| `--fast-mode <on\|off>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#model-and-thinking) (Model and Thinking) |
| `--include-unsupported-models` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#model-and-thinking) (Model and Thinking) |
| `--resume-session-at <message id>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#sessions-and-worktrees) (Sessions and Worktrees) |
| `--resume-drops-turn <message id>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#sessions-and-worktrees) (Sessions and Worktrees) |
| `--reply-on-resume` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#sessions-and-worktrees) (Sessions and Worktrees) |
| `--rewind-files <user-message-id>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#sessions-and-worktrees) (Sessions and Worktrees) |
| `--plugin-dir-no-mcp <path>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#agents-plugins-mcp-and-context) (Agents, Plugins, MCP, and Context) |
| `--brief` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#agents-plugins-mcp-and-context) (Agents, Plugins, MCP, and Context) |
| `--file <specs...>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#agents-plugins-mcp-and-context) (Agents, Plugins, MCP, and Context) |
| `--watch-artifact <artifact>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#agents-plugins-mcp-and-context) (Agents, Plugins, MCP, and Context) |
| `--watch-artifact-no-autoreact <artifact>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#agents-plugins-mcp-and-context) (Agents, Plugins, MCP, and Context) |
| `--messaging-socket-path <path>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#agents-plugins-mcp-and-context) (Agents, Plugins, MCP, and Context) |
| `--proactivity <level>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#agents-plugins-mcp-and-context) (Agents, Plugins, MCP, and Context) |
| `--agent-id <id>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#teammate-flags) (Teammate Flags) |
| `--agent-name <name>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#teammate-flags) (Teammate Flags) |
| `--team-name <name>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#teammate-flags) (Teammate Flags) |
| `--agent-color <color>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#teammate-flags) (Teammate Flags) |
| `--plan-mode-required` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#teammate-flags) (Teammate Flags) |
| `--agent-type <type>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#teammate-flags) (Teammate Flags) |
| `--parent-session-id <id>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#teammate-flags) (Teammate Flags) |
| `--prefill <text>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#ide-desktop-and-deep-links) (IDE, Desktop, and Deep Links) |
| `--prefill-b64 <b64>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#ide-desktop-and-deep-links) (IDE, Desktop, and Deep Links) |
| `--deep-link-origin` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#ide-desktop-and-deep-links) (IDE, Desktop, and Deep Links) |
| `--deep-link-repo <slug>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#ide-desktop-and-deep-links) (IDE, Desktop, and Deep Links) |
| `--deep-link-last-fetch <ms>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#ide-desktop-and-deep-links) (IDE, Desktop, and Deep Links) |
| `--deep-link-cwd-b64 <b64>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#ide-desktop-and-deep-links) (IDE, Desktop, and Deep Links) |
| `--pool <pool_id>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#cloud-and-remote-sessions) (Cloud and Remote Sessions) |
| `--correlation-id <id>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#cloud-and-remote-sessions) (Cloud and Remote Sessions) |
| `--on-branch <branch>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#cloud-and-remote-sessions) (Cloud and Remote Sessions) |
| `--forward-home-settings <true\|false>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#cloud-and-remote-sessions) (Cloud and Remote Sessions) |
| `--attach-serve <session_id>` | [All Flags](https://xsyetopz.github.io/claude-code-docs/configure/cli/flags.md#cloud-and-remote-sessions) (Cloud and Remote Sessions) |
| `claude sandbox` | [Subcommands](https://xsyetopz.github.io/claude-code-docs/configure/cli/subcommands.md#commands) (Commands) |
| `claude edit-hook`, `edit-permission-rules`, `edit-memory-settings`, and 5 more | [Subcommands](https://xsyetopz.github.io/claude-code-docs/configure/cli/subcommands.md#commands) (Commands) |
| `claude import-conversations <exportPath>` | [Subcommands](https://xsyetopz.github.io/claude-code-docs/configure/cli/subcommands.md#commands) (Commands) |

## Permissions

Auto mode rules, permission modes, rule syntax, and the sandbox.

Count: 121.

The 85 default auto mode rules are all listed on [Auto Mode Default Rules](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode-rules.md). They are not repeated here.

| Item | Where |
| --- | --- |
| `CLAUDE_CODE_AUTO_MODE_MODEL` | [Auto Mode](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode.md#environment-variables) (Environment Variables) |
| `CLAUDE_CODE_BG_CLASSIFIER_MODEL` | [Auto Mode](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode.md#environment-variables) (Environment Variables) |
| `CLAUDE_CODE_AUTO_MODE_TIER` | [Auto Mode](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode.md#environment-variables) (Environment Variables) |
| `CLAUDE_CODE_CLASSIFIER_SUMMARY` | [Auto Mode](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode.md#environment-variables) (Environment Variables) |
| `CLAUDE_CODE_TWO_STAGE_CLASSIFIER` | [Auto Mode](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode.md#environment-variables) (Environment Variables) |
| `CLAUDE_CODE_AUTO_MODE_EXTERNAL_PERMISSIONS` | [Auto Mode](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode.md#environment-variables) (Environment Variables) |
| `CLAUDE_CHROME_CLASSIFIER_FLOOR`, `CLAUDE_CHROME_PERMISSION_MODE` | [Auto Mode](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode.md#environment-variables) (Environment Variables) |
| `CLAUDE_BG_SESSION_PERMISSION_RULES` | [Auto Mode](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode.md#environment-variables) (Environment Variables) |
| `CLAUDE_CODE_PARKED_PERMISSION_WAIT_MS` | [Auto Mode](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode.md#environment-variables) (Environment Variables) |
| `CLAUDE_CODE_RESTRICT_PERSONAL_CONFIG` | [Auto Mode](https://xsyetopz.github.io/claude-code-docs/configure/permissions/auto-mode.md#environment-variables) (Environment Variables) |
| `rule` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#decision-reasons) (Decision Reasons) |
| `mode` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#decision-reasons) (Decision Reasons) |
| `subcommandResults` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#decision-reasons) (Decision Reasons) |
| `permissionPromptTool` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#decision-reasons) (Decision Reasons) |
| `hook` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#decision-reasons) (Decision Reasons) |
| `asyncAgent` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#decision-reasons) (Decision Reasons) |
| `sandboxOverride` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#decision-reasons) (Decision Reasons) |
| `workingDir` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#decision-reasons) (Decision Reasons) |
| `safetyCheck` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#decision-reasons) (Decision Reasons) |
| `classifier` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#decision-reasons) (Decision Reasons) |
| `other` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#decision-reasons) (Decision Reasons) |
| `dangerousRemoval` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#safety-checks) (Safety Checks) |
| `backgroundOperator` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#safety-checks) (Safety Checks) |
| `suspiciousWindowsPath` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#safety-checks) (Safety Checks) |
| `restrictedMode` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#safety-checks) (Safety Checks) |
| `outsideReadsBlocked` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#safety-checks) (Safety Checks) |
| `claudeSettingsFile` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#safety-checks) (Safety Checks) |
| `internalHardDeny` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#safety-checks) (Safety Checks) |
| `unfinishedCheck` | [Permission Modes](https://xsyetopz.github.io/claude-code-docs/configure/permissions/modes.md#safety-checks) (Safety Checks) |
| `mcp__server`, `mcp__server__tool` | [Permission Rules](https://xsyetopz.github.io/claude-code-docs/configure/permissions/rules.md#rule-syntax) (Rule Syntax) |
| `sandbox.ripgrep.command`, `sandbox.ripgrep.args` | [Sandbox](https://xsyetopz.github.io/claude-code-docs/configure/permissions/sandbox.md#core-keys) (Core Keys) |
| `CLAUDE_CODE_BASH_SANDBOX_SHOW_INDICATOR` | [Sandbox](https://xsyetopz.github.io/claude-code-docs/configure/permissions/sandbox.md#environment-variables) (Environment Variables) |
| `IS_SANDBOX` | [Sandbox](https://xsyetopz.github.io/claude-code-docs/configure/permissions/sandbox.md#environment-variables) (Environment Variables) |
| `CLAUDE_CODE_SANDBOXED` | [Sandbox](https://xsyetopz.github.io/claude-code-docs/configure/permissions/sandbox.md#environment-variables) (Environment Variables) |
| `CLAUDE_CODE_SANDBOX_LEAVE_PARENT_FOLDERS_ALONE` | [Sandbox](https://xsyetopz.github.io/claude-code-docs/configure/permissions/sandbox.md#environment-variables) (Environment Variables) |
| `CLAUDE_CODE_SANDBOX_LEAVE_DENIES_TO_SRT_WIN` | [Sandbox](https://xsyetopz.github.io/claude-code-docs/configure/permissions/sandbox.md#environment-variables) (Environment Variables) |

## Hooks

Hook settings, events, fields, and handler types.

Count: 16.

| Item | Where |
| --- | --- |
| `asyncTimeout` | [Hook Configuration](https://xsyetopz.github.io/claude-code-docs/extend/hooks/configuration.md#timeouts) (Timeouts) |
| `onFailure` has no effect | [Hook Configuration](https://xsyetopz.github.io/claude-code-docs/extend/hooks/configuration.md#failure-handling) (Failure Handling) |
| `CLAUDE_CODE_RESTRICT_PERSONAL_CONFIG` | [Hook Configuration](https://xsyetopz.github.io/claude-code-docs/extend/hooks/configuration.md#failure-handling) (Failure Handling) |
| `CLAUDE_CODE_HOOKS_SAME_THREAD` | [Hook Configuration](https://xsyetopz.github.io/claude-code-docs/extend/hooks/configuration.md#environment-variables-for-hooks) (Environment Variables for Hooks) |
| `CLAUDE_CODE_DISABLE_HOOK_FORWARDING` | [Hook Configuration](https://xsyetopz.github.io/claude-code-docs/extend/hooks/configuration.md#environment-variables-for-hooks) (Environment Variables for Hooks) |
| `CLAUDE_CODE_RESUME_SESSIONSTART_HOOKS_WAIT_MS` | [Hook Configuration](https://xsyetopz.github.io/claude-code-docs/extend/hooks/configuration.md#environment-variables-for-hooks) (Environment Variables for Hooks) |
| `DISABLE_BRIEF_MODE_STOP_HOOK` | [Hook Configuration](https://xsyetopz.github.io/claude-code-docs/extend/hooks/configuration.md#environment-variables-for-hooks) (Environment Variables for Hooks) |
| `permissionDisplay` | [Hook Events](https://xsyetopz.github.io/claude-code-docs/extend/hooks/events.md#pretooluse) (PreToolUse) |
| `source` | [Hook Events](https://xsyetopz.github.io/claude-code-docs/extend/hooks/events.md#userpromptsubmit) (UserPromptSubmit) |
| `auth_storage_failure`, `computer_use_enter`, `computer_use_exit`, and 3 more | [Hook Events](https://xsyetopz.github.io/claude-code-docs/extend/hooks/events.md#notification) (Notification) |
| `callback` | [Hook Handlers](https://xsyetopz.github.io/claude-code-docs/extend/hooks/handlers.md#handler-types) (Handler Types) |
| `rewakeMessage` | [Hook Handlers](https://xsyetopz.github.io/claude-code-docs/extend/hooks/handlers.md#command-fields) (Command Fields) |
| `rewakeSummary` | [Hook Handlers](https://xsyetopz.github.io/claude-code-docs/extend/hooks/handlers.md#command-fields) (Command Fields) |
| `cloud` | [Hook Handlers](https://xsyetopz.github.io/claude-code-docs/extend/hooks/handlers.md#command-fields) (Command Fields) |
| SDK callback hooks | [Hooks](https://xsyetopz.github.io/claude-code-docs/extend/hooks.md#where-hooks-are-defined) (Where Hooks Are Defined) |
| `{"async":true,"asyncTimeout":n}` | [Hook Input and Output](https://xsyetopz.github.io/claude-code-docs/extend/hooks/input-and-output.md#universal-output-fields) (Universal Output Fields) |

## Commands

Slash commands that no official page lists.

Count: 2.

| Item | Where |
| --- | --- |
| `/pro-trial-expired` | [Slash Commands](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/slash-commands.md#account-cloud-and-other-commands) (Account, Cloud, and Other Commands) |
| `/daemon` | [Slash Commands](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/slash-commands.md#account-cloud-and-other-commands) (Account, Cloud, and Other Commands) |

## Skills

Skill frontmatter, bundled skills, and substitutions.

Count: 7.

| Item | Where |
| --- | --- |
| `/keybindings-help` | [Bundled Skills](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/bundled-skills.md#skills) (Skills) |
| `created_by`, `improved_by` | [Skill Frontmatter](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/frontmatter.md#keys) (Keys) |
| MCP-served skill | [Skills and Commands](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands.md#skill-locations) (Skill Locations) |
| Skill `loadedFrom` values | [Skills and Commands](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands.md#skill-locations) (Skill Locations) |
| Name length | [Skills and Commands](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands.md#name-resolution) (Name Resolution) |
| Total size cap | [Substitutions and Invocation](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/substitutions.md#string-substitutions) (String Substitutions) |
| Commit-time skills | [Substitutions and Invocation](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/substitutions.md#invocation-control) (Invocation Control) |

## Subagents

Frontmatter keys and built-in agents that official pages leave out.

Count: 7.

| Item | Where |
| --- | --- |
| `observer` | [Subagent Frontmatter](https://xsyetopz.github.io/claude-code-docs/extend/subagents/frontmatter.md#keys) (Keys) |
| `observerMessage` | [Subagent Frontmatter](https://xsyetopz.github.io/claude-code-docs/extend/subagents/frontmatter.md#keys) (Keys) |
| `observeSubagents` | [Subagent Frontmatter](https://xsyetopz.github.io/claude-code-docs/extend/subagents/frontmatter.md#keys) (Keys) |
| `workflow-subagent` | [Subagent Runtime](https://xsyetopz.github.io/claude-code-docs/extend/subagents/runtime.md#built-in-agents) (Built-In Agents) |
| `comment-thread-analyst` | [Subagent Runtime](https://xsyetopz.github.io/claude-code-docs/extend/subagents/runtime.md#built-in-agents) (Built-In Agents) |
| Web-reading agent | [Subagent Runtime](https://xsyetopz.github.io/claude-code-docs/extend/subagents/runtime.md#built-in-agents) (Built-In Agents) |
| `CLAUDE_CODE_ENABLE_APPEND_SUBAGENT_PROMPT`, `CLAUDE_CODE_MEMORY_SUBAGENT_APPEND`, `CLAUDE_CODE_SUBAGENT_PROMPT_SNAPSHOT`, and 2 more | [Subagent Runtime](https://xsyetopz.github.io/claude-code-docs/extend/subagents/runtime.md#limits-and-switches) (Limits and Switches) |

## Plugins

Manifest keys, cache files, and plugin switches.

Count: 10.

| Item | Where |
| --- | --- |
| `--plugin-dir-no-mcp <path>` | [Plugin Commands](https://xsyetopz.github.io/claude-code-docs/extend/plugins/cli.md#session-flags) (Session Flags) |
| `plugins/cache/<marketplace>/<plugin>/<version>/` | [Plugin Loading](https://xsyetopz.github.io/claude-code-docs/extend/plugins/loading.md#paths) (Paths) |
| `plugins/installed_plugins.json` | [Plugin Loading](https://xsyetopz.github.io/claude-code-docs/extend/plugins/loading.md#paths) (Paths) |
| `plugins/known_marketplaces.json` | [Plugin Loading](https://xsyetopz.github.io/claude-code-docs/extend/plugins/loading.md#paths) (Paths) |
| `installed`, `marketplaces`, `flagged`, and 2 more | [Plugin Loading](https://xsyetopz.github.io/claude-code-docs/extend/plugins/loading.md#paths) (Paths) |
| `CLAUDE_CODE_PLUGIN_USE_ZIP_CACHE`, `CLAUDE_CODE_PLUGIN_BINARY_ASSETS`, `CLAUDE_CODE_PLUGIN_ATTRIBUTION`, and 2 more | [Plugin Loading](https://xsyetopz.github.io/claude-code-docs/extend/plugins/loading.md#env-vars) (Env Vars) |
| `CLAUDE_CODE_SKIP_PLUGIN_MCP_SERVERS`, `CLAUDE_CODE_SKIP_PLUGIN_MCP_SERVERS_EXCEPT`, `CLAUDE_CODE_SKIP_PLUGIN_LOCAL_MCP_SERVERS`, `CLAUDE_CODE_SKIP_PLUGIN_MCP_BUNDLES` | [Plugin Loading](https://xsyetopz.github.io/claude-code-docs/extend/plugins/loading.md#env-vars) (Env Vars) |
| `experimental.syntaxHighlighting.hljsLanguages` | [Plugin Manifest](https://xsyetopz.github.io/claude-code-docs/extend/plugins/manifest.md#top-level-keys) (Top-Level Keys) |
| `binaries` | [Plugin Manifest](https://xsyetopz.github.io/claude-code-docs/extend/plugins/manifest.md#top-level-keys) (Top-Level Keys) |
| `unsupported` | [Marketplaces](https://xsyetopz.github.io/claude-code-docs/extend/plugins/marketplace.md#plugin-sources) (Plugin Sources) |

## MCP

Server types, scopes, options, and variables for MCP.

Count: 37.

| Item | Where |
| --- | --- |
| `MCP_OAUTH_CLIENT_METADATA_URL` | [MCP Authentication](https://xsyetopz.github.io/claude-code-docs/extend/mcp/auth.md#oauth-options) (OAuth Options) |
| `bareElicitationCapability` | [Server Configuration](https://xsyetopz.github.io/claude-code-docs/extend/mcp/config.md#server-options) (Server Options) |
| `discoveryCache` | [Server Configuration](https://xsyetopz.github.io/claude-code-docs/extend/mcp/config.md#server-options) (Server Options) |
| `request_timeout_ms` | [Server Configuration](https://xsyetopz.github.io/claude-code-docs/extend/mcp/config.md#server-options) (Server Options) |
| `toolPermissions` | [Server Configuration](https://xsyetopz.github.io/claude-code-docs/extend/mcp/config.md#server-options) (Server Options) |
| `disableAutoBackground` | [Server Configuration](https://xsyetopz.github.io/claude-code-docs/extend/mcp/config.md#server-options) (Server Options) |
| `ideName`, `ideRunningInWindows`, `authToken` | [Server Configuration](https://xsyetopz.github.io/claude-code-docs/extend/mcp/config.md#server-options) (Server Options) |
| `cachedInitResponse`, `cachedDiscoverResponse`, `discoverSupport`, and 2 more | [Server Configuration](https://xsyetopz.github.io/claude-code-docs/extend/mcp/config.md#server-options) (Server Options) |
| Blocked names | [Server Configuration](https://xsyetopz.github.io/claude-code-docs/extend/mcp/config.md#names) (Names) |
| `ENABLE_MCP_LARGE_OUTPUT_FILES` | [MCP Env Vars](https://xsyetopz.github.io/claude-code-docs/extend/mcp/env.md#undocumented-variables) (Undocumented Variables) |
| `CLAUDE_CODE_MCP_APPS_HOST` | [MCP Env Vars](https://xsyetopz.github.io/claude-code-docs/extend/mcp/env.md#undocumented-variables) (Undocumented Variables) |
| `CLAUDE_CODE_SKIP_PLUGIN_MCP_SERVERS` | [MCP Env Vars](https://xsyetopz.github.io/claude-code-docs/extend/mcp/env.md#undocumented-variables) (Undocumented Variables) |
| `CLAUDE_CODE_SKIP_PLUGIN_MCP_SERVERS_EXCEPT` | [MCP Env Vars](https://xsyetopz.github.io/claude-code-docs/extend/mcp/env.md#undocumented-variables) (Undocumented Variables) |
| `CLAUDE_CODE_SKIP_PLUGIN_LOCAL_MCP_SERVERS` | [MCP Env Vars](https://xsyetopz.github.io/claude-code-docs/extend/mcp/env.md#undocumented-variables) (Undocumented Variables) |
| `CLAUDE_CODE_SKIP_PLUGIN_MCP_BUNDLES` | [MCP Env Vars](https://xsyetopz.github.io/claude-code-docs/extend/mcp/env.md#undocumented-variables) (Undocumented Variables) |
| `CLAUDE_CODE_ENABLE_REFRESH_MCP_TOOLS` | [MCP Env Vars](https://xsyetopz.github.io/claude-code-docs/extend/mcp/env.md#undocumented-variables) (Undocumented Variables) |
| `MCP_TRUNCATION_PROMPT_OVERRIDE` | [MCP Env Vars](https://xsyetopz.github.io/claude-code-docs/extend/mcp/env.md#undocumented-variables) (Undocumented Variables) |
| `MCP_OAUTH_CLIENT_METADATA_URL` | [MCP Env Vars](https://xsyetopz.github.io/claude-code-docs/extend/mcp/env.md#undocumented-variables) (Undocumented Variables) |
| `CLAUDE_CODE_SYNC_PLUGINS_MCP_TIMEOUT_MS` | [MCP Env Vars](https://xsyetopz.github.io/claude-code-docs/extend/mcp/env.md#undocumented-variables) (Undocumented Variables) |
| `CLAUDE_CODE_MCP_CONNECTOR_PREWAIT_MS` | [MCP Env Vars](https://xsyetopz.github.io/claude-code-docs/extend/mcp/env.md#undocumented-variables) (Undocumented Variables) |
| `CLAUDE_CODE_MCP_PREWAIT_SERVERS`, `CLAUDE_CODE_MCP_PREWAIT_SERVERS_MS` | [MCP Env Vars](https://xsyetopz.github.io/claude-code-docs/extend/mcp/env.md#undocumented-variables) (Undocumented Variables) |
| `CLAUDE_CODE_MCP_MEMORY_CGROUP` | [MCP Env Vars](https://xsyetopz.github.io/claude-code-docs/extend/mcp/env.md#undocumented-variables) (Undocumented Variables) |
| `CLAUDE_CODE_TERMINAL_MCP_TOOLS` | [MCP Env Vars](https://xsyetopz.github.io/claude-code-docs/extend/mcp/env.md#undocumented-variables) (Undocumented Variables) |
| `CLAUDE_AGENT_SDK_DISABLE_MCP_MANIFESTS` | [MCP Env Vars](https://xsyetopz.github.io/claude-code-docs/extend/mcp/env.md#undocumented-variables) (Undocumented Variables) |
| `CLAUDE_CODE_BRIDGE_MCP_CARRIER` | [MCP Env Vars](https://xsyetopz.github.io/claude-code-docs/extend/mcp/env.md#undocumented-variables) (Undocumented Variables) |
| `sse-ide` | [MCP](https://xsyetopz.github.io/claude-code-docs/extend/mcp.md#transports) (Transports) |
| `ws-ide` | [MCP](https://xsyetopz.github.io/claude-code-docs/extend/mcp.md#transports) (Transports) |
| `claudeai-proxy` | [MCP](https://xsyetopz.github.io/claude-code-docs/extend/mcp.md#transports) (Transports) |
| `dynamic` | [MCP](https://xsyetopz.github.io/claude-code-docs/extend/mcp.md#scopes) (Scopes) |
| `enterprise`, `agent` | [MCP](https://xsyetopz.github.io/claude-code-docs/extend/mcp.md#scopes) (Scopes) |
| `SearchMcpRegistry`, `SuggestConnectors`, `ListConnectors` | [MCP Runtime](https://xsyetopz.github.io/claude-code-docs/extend/mcp/runtime.md#tools-and-names) (Tools and Names) |
| `ReadMcpResourceDirTool` | [MCP Runtime](https://xsyetopz.github.io/claude-code-docs/extend/mcp/runtime.md#resources-and-prompts) (Resources and Prompts) |
| Old tool names | [MCP Runtime](https://xsyetopz.github.io/claude-code-docs/extend/mcp/runtime.md#resources-and-prompts) (Resources and Prompts) |
| `CLAUDE_CODE_MCP_APPS_HOST` | [MCP Runtime](https://xsyetopz.github.io/claude-code-docs/extend/mcp/runtime.md#resources-and-prompts) (Resources and Prompts) |
| `ENABLE_MCP_LARGE_OUTPUT_FILES` | [MCP Runtime](https://xsyetopz.github.io/claude-code-docs/extend/mcp/runtime.md#limits) (Limits) |
| `xaaIdp` | [MCP Settings and Policy](https://xsyetopz.github.io/claude-code-docs/extend/mcp/settings.md#settings-keys) (Settings Keys) |
| `--plugin-dir-no-mcp <path>` | [MCP Settings and Policy](https://xsyetopz.github.io/claude-code-docs/extend/mcp/settings.md#files-and-flags) (Files and Flags) |

## Tools

Tools and tool parameters.

Count: 29.

| Item | Where |
| --- | --- |
| `ProposeGoal` | [Agents, Tasks, and Planning](https://xsyetopz.github.io/claude-code-docs/reference/tools/agents-and-tasks.md#tools) (Tools) |
| `memory_read` | [Files, Search, and Memory](https://xsyetopz.github.io/claude-code-docs/reference/tools/files.md#tools) (Tools) |
| `memory_write` | [Files, Search, and Memory](https://xsyetopz.github.io/claude-code-docs/reference/tools/files.md#tools) (Tools) |
| `memory_list` | [Files, Search, and Memory](https://xsyetopz.github.io/claude-code-docs/reference/tools/files.md#tools) (Tools) |
| `ReadNotifications` | [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md#gated-tools) (Gated Tools) |
| `ShowOnboardingRolePicker` | [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md#gated-tools) (Gated Tools) |
| `OfferChromeSetup` | [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md#gated-tools) (Gated Tools) |
| `SendUserMessage` | [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md#gated-tools) (Gated Tools) |
| `SuggestPluginInstall` | [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md#gated-tools) (Gated Tools) |
| `SuggestSkills` | [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md#gated-tools) (Gated Tools) |
| `FetchInboxMessage` | [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md#gated-tools) (Gated Tools) |
| `PublishPlugin` | [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md#gated-tools) (Gated Tools) |
| `AppifactRepl` | [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md#gated-tools) (Gated Tools) |
| `SendFile` | [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md#gated-tools) (Gated Tools) |
| `DesignSync` | [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md#gated-tools) (Gated Tools) |
| `ClaudeDesign` | [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md#gated-tools) (Gated Tools) |
| `Projects` | [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md#gated-tools) (Gated Tools) |
| `SearchMcpRegistry` | [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md#gated-tools) (Gated Tools) |
| `SuggestConnectors` | [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md#gated-tools) (Gated Tools) |
| `ListConnectors` | [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md#gated-tools) (Gated Tools) |
| `propose_skills` | [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md#gated-tools) (Gated Tools) |
| `StructuredOutput` | [Gated and Surface-Specific Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools/gated-and-other.md#tools-without-an-inventory-row) (Tools without an Inventory Row) |
| Query `select:A,B` | [Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools.md#toolsearch) (ToolSearch) |
| Query keywords | [Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools.md#toolsearch) (ToolSearch) |
| Query `+term rest` | [Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools.md#toolsearch) (ToolSearch) |
| Placeholder tool | [Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools.md#toolsearch) (ToolSearch) |
| Server-side never-defer list | [Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools.md#switches-for-tool-search) (Switches for Tool Search) |
| Server-side defer list | [Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools.md#switches-for-tool-search) (Switches for Tool Search) |
| `GetTask` | [Shell, Web, and Background Tasks](https://xsyetopz.github.io/claude-code-docs/reference/tools/shell-and-web.md#tools) (Tools) |

## API Endpoints and Betas

Endpoints that Claude Code calls and the beta headers it sends.

Count: 54.

| Item | Where |
| --- | --- |
| `claude-code-20250219` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `oauth-2025-04-20` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `context-1m-2025-08-07` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `context-management-2025-06-27` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `structured-outputs-2025-12-15` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `web-search-2025-03-05` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `advanced-tool-use-2025-11-20` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `tool-search-tool-2025-10-19` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `effort-2025-11-24` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `task-budgets-2026-03-13` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `prompt-caching-scope-2026-01-05` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `prompt-caching-evict-2026-05-12` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `cache-keepalive-2026-09-03` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `fast-mode-2026-02-01` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `redact-thinking-2026-02-12` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `thinking-resumption-2026-07-17` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `thinking-token-count-2026-05-13` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `afk-mode-2026-01-31` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `advisor-tool-2026-03-01` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `cache-diagnosis-2026-04-07` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `context-hint-2026-04-09` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `mcp-servers-2025-12-04` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `files-api-2025-04-14` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `environments-2025-11-01` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `per-turn-control-2026-07-01` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `timing-2026-09-09` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `mid-conversation-tool-changes-2026-07-01` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `inline-tools-2026-09-15` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `server-side-fallback-2026-06-01` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `server-side-fallback-2026-07-01` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `fallback-credit-2026-06-01` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `auto-mode-classifier-2026-07-16` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `dangerous-tool-use-2026-09-03` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `thinking-display-updates-2026-08-18` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `thinking-binding-controls-2026-08-01` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `message-threads-2026-08-12` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `mid-conversation-system-clear-at-2026-08-21` | [Betas](https://xsyetopz.github.io/claude-code-docs/reference/api/betas.md#registry) (Registry) |
| `/v1/messages/cache_touch` | [Endpoints and Headers](https://xsyetopz.github.io/claude-code-docs/reference/api/endpoints.md#model-endpoints) (Model Endpoints) |
| `/v1/oauth/token`, `/api/oauth/profile`, `/api/oauth/usage`, `/api/oauth/account/settings` | [Endpoints and Headers](https://xsyetopz.github.io/claude-code-docs/reference/api/endpoints.md#account-and-service-endpoints) (Account and Service Endpoints) |
| `/api/claude_code/policy_limits` | [Endpoints and Headers](https://xsyetopz.github.io/claude-code-docs/reference/api/endpoints.md#account-and-service-endpoints) (Account and Service Endpoints) |
| `/api/claude_code/organizations/metrics_enabled`, `/api/claude_code/notification/preferences`, `/api/claude_code/skills` | [Endpoints and Headers](https://xsyetopz.github.io/claude-code-docs/reference/api/endpoints.md#account-and-service-endpoints) (Account and Service Endpoints) |
| `/api/event_logging/v2/batch` | [Endpoints and Headers](https://xsyetopz.github.io/claude-code-docs/reference/api/endpoints.md#account-and-service-endpoints) (Account and Service Endpoints) |
| `/api/claude_cli_feedback`, `/api/claude_code_shared_session_transcripts` | [Endpoints and Headers](https://xsyetopz.github.io/claude-code-docs/reference/api/endpoints.md#account-and-service-endpoints) (Account and Service Endpoints) |
| `/v1/code/sessions`, `/v1/code/triggers`, `/v1/code/github/*`, `/v1/code/agent-proxy` | [Endpoints and Headers](https://xsyetopz.github.io/claude-code-docs/reference/api/endpoints.md#account-and-service-endpoints) (Account and Service Endpoints) |
| `/v1/ultrareview/quota`, `/v1/ultrareview/preflight` | [Endpoints and Headers](https://xsyetopz.github.io/claude-code-docs/reference/api/endpoints.md#account-and-service-endpoints) (Account and Service Endpoints) |
| `/api/model_selector/{id}`, `/api/organization/claude_code_first_token_date` | [Endpoints and Headers](https://xsyetopz.github.io/claude-code-docs/reference/api/endpoints.md#account-and-service-endpoints) (Account and Service Endpoints) |
| `/api/ws/speech_to_text/voice_stream` | [Endpoints and Headers](https://xsyetopz.github.io/claude-code-docs/reference/api/endpoints.md#account-and-service-endpoints) (Account and Service Endpoints) |
| `/api/frame/*`, `/v1/design/*` | [Endpoints and Headers](https://xsyetopz.github.io/claude-code-docs/reference/api/endpoints.md#account-and-service-endpoints) (Account and Service Endpoints) |
| `x-app`, `anthropic-client-platform`, `X-Stainless-*`, and 2 more | [Endpoints and Headers](https://xsyetopz.github.io/claude-code-docs/reference/api/endpoints.md#request-headers) (Request Headers) |
| `cc_version` | [Endpoints and Headers](https://xsyetopz.github.io/claude-code-docs/reference/api/endpoints.md#attribution-block) (Attribution Block) |
| `cc_entrypoint` | [Endpoints and Headers](https://xsyetopz.github.io/claude-code-docs/reference/api/endpoints.md#attribution-block) (Attribution Block) |
| `cc_workload`, `cc_is_subagent` | [Endpoints and Headers](https://xsyetopz.github.io/claude-code-docs/reference/api/endpoints.md#attribution-block) (Attribution Block) |
| `cc_prev_req`, `cc_prompt_id`, `cc_turn_origin`, and 2 more | [Endpoints and Headers](https://xsyetopz.github.io/claude-code-docs/reference/api/endpoints.md#attribution-block) (Attribution Block) |
| `cc_gateway`, `cc_project`, `cc_project_src` | [Endpoints and Headers](https://xsyetopz.github.io/claude-code-docs/reference/api/endpoints.md#attribution-block) (Attribution Block) |

## System Prompt

How the prompt is built, plus the captured prompt variants.

Count: 34.

| Item | Where |
| --- | --- |
| Haiku 5.5 by default | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#short-or-full-prompt) (Short or Full Prompt) |
| Billing header line | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#where-each-part-goes-in-the-request) (Where Each Part Goes in the Request) |
| Identity line | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#where-each-part-goes-in-the-request) (Where Each Part Goes in the Request) |
| Rules, memory section, appended text | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#where-each-part-goes-in-the-request) (Where Each Part Goes in the Request) |
| Environment details, skills list, agent types, output style text, the date | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#where-each-part-goes-in-the-request) (Where Each Part Goes in the Request) |
| Git status, `CLAUDE.md` files, the git attribution reminder | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#where-each-part-goes-in-the-request) (Where Each Part Goes in the Request) |
| `--permission-mode acceptEdits`, `dontAsk`, `--brief` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#what-each-flag-does-in-the-captures) (What Each Flag Does in the Captures) |
| `lean_body` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#shared-sections) (Shared Sections) |
| `intro` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#shared-sections) (Shared Sections) |
| `system` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#shared-sections) (Shared Sections) |
| `doing_tasks` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#shared-sections) (Shared Sections) |
| `actions` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#shared-sections) (Shared Sections) |
| `tools` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#shared-sections) (Shared Sections) |
| `tone` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#shared-sections) (Shared Sections) |
| `memory_static` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#shared-sections) (Shared Sections) |
| `communication` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#session-sections) (Session Sections) |
| `pronouns` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#session-sections) (Session Sections) |
| `action_caution` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#session-sections) (Session Sections) |
| `fable_identity` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#session-sections) (Session Sections) |
| `session_guidance` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#session-sections) (Session Sections) |
| `memory` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#session-sections) (Session Sections) |
| `env_info_simple` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#session-sections) (Session Sections) |
| `env_info_static` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#session-sections) (Session Sections) |
| `context_management` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#session-sections) (Session Sections) |
| `brief` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#session-sections) (Session Sections) |
| `focus_mode` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#session-sections) (Session Sections) |
| Default, Lean Prompt | [Captured System Prompts](https://xsyetopz.github.io/claude-code-docs/prompts.md#all-variants) (All Variants) |
| Default, Haiku 5.5 | [Captured System Prompts](https://xsyetopz.github.io/claude-code-docs/prompts.md#all-variants) (All Variants) |
| Inside a Git Repository | [Captured System Prompts](https://xsyetopz.github.io/claude-code-docs/prompts.md#all-variants) (All Variants) |
| Brief Mode (same text as default-lean) | [Captured System Prompts](https://xsyetopz.github.io/claude-code-docs/prompts.md#all-variants) (All Variants) |
| Compaction Prompt | [Captured System Prompts](https://xsyetopz.github.io/claude-code-docs/prompts.md#all-variants) (All Variants) |
| Subagent, General Purpose | [Captured System Prompts](https://xsyetopz.github.io/claude-code-docs/prompts.md#all-variants) (All Variants) |
| Subagent, Explore | [Captured System Prompts](https://xsyetopz.github.io/claude-code-docs/prompts.md#all-variants) (All Variants) |
| Subagent, Plan | [Captured System Prompts](https://xsyetopz.github.io/claude-code-docs/prompts.md#all-variants) (All Variants) |

## Transcript and Sessions

Records in the transcript file and how sessions are stored.

Count: 16.

| Item | Where |
| --- | --- |
| `--resume-session-at <message id>` | [Sessions and Storage](https://xsyetopz.github.io/claude-code-docs/how-it-works/sessions-and-storage.md#resume-and-branch) (Resume and Branch) |
| `--reply-on-resume` | [Sessions and Storage](https://xsyetopz.github.io/claude-code-docs/how-it-works/sessions-and-storage.md#resume-and-branch) (Resume and Branch) |
| `--rewind-files <user-message-id>` | [Sessions and Storage](https://xsyetopz.github.io/claude-code-docs/how-it-works/sessions-and-storage.md#resume-and-branch) (Resume and Branch) |
| `state/`, `mods/`, `bridge-spawn/`, and 3 more | [Sessions and Storage](https://xsyetopz.github.io/claude-code-docs/how-it-works/sessions-and-storage.md#where-files-live) (Where Files Live) |
| `type` | [Transcript Format](https://xsyetopz.github.io/claude-code-docs/reference/transcript-format.md#common-fields) (Common Fields) |
| `uuid` | [Transcript Format](https://xsyetopz.github.io/claude-code-docs/reference/transcript-format.md#common-fields) (Common Fields) |
| `parentUuid` | [Transcript Format](https://xsyetopz.github.io/claude-code-docs/reference/transcript-format.md#common-fields) (Common Fields) |
| `sessionId` | [Transcript Format](https://xsyetopz.github.io/claude-code-docs/reference/transcript-format.md#common-fields) (Common Fields) |
| `timestamp` | [Transcript Format](https://xsyetopz.github.io/claude-code-docs/reference/transcript-format.md#common-fields) (Common Fields) |
| `cwd` | [Transcript Format](https://xsyetopz.github.io/claude-code-docs/reference/transcript-format.md#common-fields) (Common Fields) |
| `gitBranch` | [Transcript Format](https://xsyetopz.github.io/claude-code-docs/reference/transcript-format.md#common-fields) (Common Fields) |
| `version` | [Transcript Format](https://xsyetopz.github.io/claude-code-docs/reference/transcript-format.md#common-fields) (Common Fields) |
| `entrypoint` | [Transcript Format](https://xsyetopz.github.io/claude-code-docs/reference/transcript-format.md#common-fields) (Common Fields) |
| `userType` | [Transcript Format](https://xsyetopz.github.io/claude-code-docs/reference/transcript-format.md#common-fields) (Common Fields) |
| `isSidechain` | [Transcript Format](https://xsyetopz.github.io/claude-code-docs/reference/transcript-format.md#common-fields) (Common Fields) |
| `isMeta` | [Transcript Format](https://xsyetopz.github.io/claude-code-docs/reference/transcript-format.md#common-fields) (Common Fields) |

## Headless Protocol

Message types of `--output-format stream-json` and of the control protocol. Nearly every row is undocumented, so this page links to the two pages with counts.

Count: 155.

| Page | Undocumented Rows |
| --- | --- |
| [Control Protocol](https://xsyetopz.github.io/claude-code-docs/extend/headless/control-protocol.md) | 91 |
| [Stream JSON Messages](https://xsyetopz.github.io/claude-code-docs/extend/headless/stream-json.md) | 64 |

## Mod API

The Mod API is covered by official Mods pages, so no Mod API item is listed here as undocumented. Differences are in the last section. For the Mod API, Documented means that the item is in the official docs or in the published type file (which the docs call "The complete reference"), so the Mod API shows 0 Undocumented rows.

Count: 0.

## Other

Items that fit no group above: memory, output styles, the status line, models, and how the harness works inside.

Count: 110.

| Item | Where |
| --- | --- |
| `autoDreamEnabled` | [Memory and Rules](https://xsyetopz.github.io/claude-code-docs/configure/memory-and-rules.md#auto-memory) (Auto Memory) |
| `/pause-memory` | [Memory and Rules](https://xsyetopz.github.io/claude-code-docs/configure/memory-and-rules.md#auto-memory) (Auto Memory) |
| `CLAUDE_CODE_REMOTE_MEMORY_DIR`, `CLAUDE_CODE_POST_TURN_MEMORY`, `CLAUDE_COWORK_MEMORY_*`, `CLAUDE_MEMORY_STORES` | [Memory and Rules](https://xsyetopz.github.io/claude-code-docs/configure/memory-and-rules.md#auto-memory) (Auto Memory) |
| `InstructionFileKind` | [Memory and Rules](https://xsyetopz.github.io/claude-code-docs/configure/memory-and-rules.md#the-instructionsloaded-hook) (The InstructionsLoaded Hook) |
| `--include-unsupported-models` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#choose-a-model) (Choose a Model) |
| `claude-3-5-haiku` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#catalog) (Catalog) |
| `claude-3-5-sonnet` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#catalog) (Catalog) |
| `claude-3-7-sonnet` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#catalog) (Catalog) |
| `claude-sonnet-4-0` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#catalog) (Catalog) |
| `claude-opus-4-0` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#catalog) (Catalog) |
| `claude-mythos-5-1` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#catalog) (Catalog) |
| `--thinking <enabled\|adaptive\|disabled>` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#thinking) (Thinking) |
| `--thinking-display <summarized\|omitted\|highlights>` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#thinking) (Thinking) |
| `--max-thinking-tokens` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#thinking) (Thinking) |
| `CLAUDE_CODE_NO_MODEL_FALLBACK` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#fallback-and-retries) (Fallback and Retries) |
| `CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#providers) (Providers) |
| `CLAUDE_CODE_USE_GATEWAY` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#providers) (Providers) |
| `ANTHROPIC_GOOGLE_CLOUD_BASE_URL`, `_LOCATION`, `_PROJECT`, `_WORKSPACE_ID` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#endpoint-and-region-variables) (Endpoint and Region Variables) |
| `CLAUDE_CODE_SKIP_ANTHROPIC_GOOGLE_CLOUD_AUTH` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#endpoint-and-region-variables) (Endpoint and Region Variables) |
| `claude-3-5-haiku` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#provider-names) (Provider Names) |
| `claude-3-5-sonnet` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#provider-names) (Provider Names) |
| `claude-3-7-sonnet` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#provider-names) (Provider Names) |
| `claude-sonnet-4-0` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#provider-names) (Provider Names) |
| `claude-opus-4-0` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#provider-names) (Provider Names) |
| `claude-mythos-5-1` | [Models and Providers](https://xsyetopz.github.io/claude-code-docs/configure/models-and-providers.md#provider-names) (Provider Names) |
| Custom style over Remote Control | [Output Styles](https://xsyetopz.github.io/claude-code-docs/configure/output-styles.md#the-outputstyle-setting-and-switching) (The outputStyle Setting and Switching) |
| `outputStylesPath`, `outputStylesPaths` | [Output Styles](https://xsyetopz.github.io/claude-code-docs/configure/output-styles.md#locations-and-precedence) (Locations and Precedence) |
| Merge order | [Output Styles](https://xsyetopz.github.io/claude-code-docs/configure/output-styles.md#locations-and-precedence) (Locations and Precedence) |
| `remote.session_id` | [Status Line](https://xsyetopz.github.io/claude-code-docs/configure/status-line.md#session-and-model-fields) (Session and Model Fields) |
| 4. Message prep | [The Agent Loop](https://xsyetopz.github.io/claude-code-docs/how-it-works/agent-loop.md#the-stages) (The Stages) |
| 6. Attachments | [The Agent Loop](https://xsyetopz.github.io/claude-code-docs/how-it-works/agent-loop.md#the-stages) (The Stages) |
| 10. Next round | [The Agent Loop](https://xsyetopz.github.io/claude-code-docs/how-it-works/agent-loop.md#the-stages) (The Stages) |
| The output stops at `max_tokens` | [The Agent Loop](https://xsyetopz.github.io/claude-code-docs/how-it-works/agent-loop.md#recovery-inside-the-loop) (Recovery Inside the Loop) |
| The response is cut off | [The Agent Loop](https://xsyetopz.github.io/claude-code-docs/how-it-works/agent-loop.md#recovery-inside-the-loop) (Recovery Inside the Loop) |
| A `tool_use` block has no valid call | [The Agent Loop](https://xsyetopz.github.io/claude-code-docs/how-it-works/agent-loop.md#recovery-inside-the-loop) (Recovery Inside the Loop) |
| The model sends only thinking | [The Agent Loop](https://xsyetopz.github.io/claude-code-docs/how-it-works/agent-loop.md#recovery-inside-the-loop) (Recovery Inside the Loop) |
| Bundled code | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#the-big-picture) (The Big Picture) |
| Command parser | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#the-big-picture) (The Big Picture) |
| Terminal screen | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#the-big-picture) (The Big Picture) |
| Feature flags | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#the-big-picture) (The Big Picture) |
| `mcp` | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#where-it-runs) (Where It Runs) |
| `claude-code-github-action` | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#where-it-runs) (Where It Runs) |
| `local-agent`, `claude-desktop`, `remote` | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#where-it-runs) (Where It Runs) |
| Start | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#startup-steps) (Startup Steps) |
| Device settings | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#startup-steps) (Startup Steps) |
| Project root | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#startup-steps) (Startup Steps) |
| Init | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#startup-steps) (Startup Steps) |
| Client data | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#startup-steps) (Startup Steps) |
| Log sinks | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#startup-steps) (Startup Steps) |
| Plugin folders | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#startup-steps) (Startup Steps) |
| Migrations | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#startup-steps) (Startup Steps) |
| Managed settings | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#startup-steps) (Startup Steps) |
| Plugin early start | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#startup-steps) (Startup Steps) |
| Main action | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#startup-steps) (Startup Steps) |
| MCP connect | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#startup-steps) (Startup Steps) |
| Print mode | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#startup-steps) (Startup Steps) |
| Interactive mode | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#startup-steps) (Startup Steps) |
| See how long each startup step takes | [Architecture](https://xsyetopz.github.io/claude-code-docs/how-it-works/architecture.md#what-you-can-change-at-startup) (What You Can Change at Startup) |
| Attachments that Claude Code adds | [Context and Compaction](https://xsyetopz.github.io/claude-code-docs/how-it-works/context-and-compaction.md#what-fills-the-context) (What Fills the Context) |
| Effective window | [Context and Compaction](https://xsyetopz.github.io/claude-code-docs/how-it-works/context-and-compaction.md#when-compaction-runs) (When Compaction Runs) |
| Warning | [Context and Compaction](https://xsyetopz.github.io/claude-code-docs/how-it-works/context-and-compaction.md#when-compaction-runs) (When Compaction Runs) |
| Blocked | [Context and Compaction](https://xsyetopz.github.io/claude-code-docs/how-it-works/context-and-compaction.md#when-compaction-runs) (When Compaction Runs) |
| Reactive | [Context and Compaction](https://xsyetopz.github.io/claude-code-docs/how-it-works/context-and-compaction.md#kinds-of-compaction) (Kinds of Compaction) |
| Precomputed | [Context and Compaction](https://xsyetopz.github.io/claude-code-docs/how-it-works/context-and-compaction.md#kinds-of-compaction) (Kinds of Compaction) |
| Larger-model retry | [Context and Compaction](https://xsyetopz.github.io/claude-code-docs/how-it-works/context-and-compaction.md#kinds-of-compaction) (Kinds of Compaction) |
| Server side | [Context and Compaction](https://xsyetopz.github.io/claude-code-docs/how-it-works/context-and-compaction.md#kinds-of-compaction) (Kinds of Compaction) |
| `--include-unsupported-models` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#choosing-the-model) (Choosing the Model) |
| `per-turn-control-2026-07-01` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#effort) (Effort) |
| `--thinking <enabled\|adaptive\|disabled>` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#thinking) (Thinking) |
| `--thinking-display <summarized\|omitted\|highlights>` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#thinking) (Thinking) |
| `--max-thinking-tokens` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#thinking) (Thinking) |
| `context_management` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `effort` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `max_effort` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `xhigh_effort` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `adaptive_thinking` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `mid_conv_tool_change` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `rejects_disabled_thinking` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `per_turn_effort` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `per_turn_timing` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `lean_prompt` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `org_locked_thinking` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `haiku_5_5_early_stopping_guidance` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `refusal_fallback` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `silent_turn_reminder` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `fast_mode` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `thinking_disabled_effort_cap` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `opus_5_prompt_bundle` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `opus_5_5_prompt_bundle` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `fable_5_mitigations` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `fable_5_1_prompt_bundle` | [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md#capabilities) (Capabilities) |
| `safeguards` | [Request and Cache](https://xsyetopz.github.io/claude-code-docs/how-it-works/request-and-cache.md#body-fields) (Body Fields) |
| `system[0]` (attribution line) | [Request and Cache](https://xsyetopz.github.io/claude-code-docs/how-it-works/request-and-cache.md#system-blocks-and-cache-markers) (System Blocks and Cache Markers) |
| `system[1]` (identity line) | [Request and Cache](https://xsyetopz.github.io/claude-code-docs/how-it-works/request-and-cache.md#system-blocks-and-cache-markers) (System Blocks and Cache Markers) |
| `system[2]` (system prompt) | [Request and Cache](https://xsyetopz.github.io/claude-code-docs/how-it-works/request-and-cache.md#system-blocks-and-cache-markers) (System Blocks and Cache Markers) |
| Last block of the last message | [Request and Cache](https://xsyetopz.github.io/claude-code-docs/how-it-works/request-and-cache.md#system-blocks-and-cache-markers) (System Blocks and Cache Markers) |
| `DISABLE_PROMPT_CACHING_MYTHOS` | [Request and Cache](https://xsyetopz.github.io/claude-code-docs/how-it-works/request-and-cache.md#cache-lifetime) (Cache Lifetime) |
| `CLAUDE_CODE_MESSAGES_PROMPT_CACHE_TTL` | [Request and Cache](https://xsyetopz.github.io/claude-code-docs/how-it-works/request-and-cache.md#cache-lifetime) (Cache Lifetime) |
| `--model X[1m]` | [Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md#effects-and-differences) (Effects and Differences) |
| `CLAUDE_CODE_AMBER_ASTROLABE` | [Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md#effects-and-differences) (Effects and Differences) |
| `CLAUDE_CODE_BASALT_COVE` | [Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md#effects-and-differences) (Effects and Differences) |
| `CLAUDE_CODE_HUMBLE_HAMMOCK` | [Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md#effects-and-differences) (Effects and Differences) |
| `CLAUDE_CODE_INLINE_TOOLS` | [Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md#effects-and-differences) (Effects and Differences) |
| `CLAUDE_CODE_LANTERN_PRISM` | [Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md#effects-and-differences) (Effects and Differences) |
| `CLAUDE_CODE_LARCH_CISTERN` | [Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md#effects-and-differences) (Effects and Differences) |
| `CLAUDE_CODE_PLUGIN_DIRS` | [Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md#effects-and-differences) (Effects and Differences) |
| `CLAUDE_CODE_SIMULATE_PROXY_USAGE` | [Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md#effects-and-differences) (Effects and Differences) |
| `CLAUDE_CODE_SKIP_PLUGIN_MCP_SERVERS` | [Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md#effects-and-differences) (Effects and Differences) |
| `CLAUDE_CODE_SYNC_PLUGIN_INSTALL` | [Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md#effects-and-differences) (Effects and Differences) |
| `CLAUDE_CODE_USE_COWORK_PLUGINS` | [Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md#effects-and-differences) (Effects and Differences) |

## Behaves Differently From the Docs

These items exist in the official docs, but the program works in another way. Count: 42. The badge on each page says how.

| Item | Where |
| --- | --- |
| `disallowedTools` | [Subagent Frontmatter](https://xsyetopz.github.io/claude-code-docs/extend/subagents/frontmatter.md#keys) (Keys) |
| `effort` | [Skill Frontmatter](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/frontmatter.md#keys) (Keys) |
| `next.error` | [Hooks and the Hook Chain](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/hooks.md#arguments-of-a-hook) (Arguments of a Hook) |
| `prompt.edit` hook time | [Hooks and the Hook Chain](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/hooks.md#budgets) (Budgets) |
| `vscode` | [Surfaces, Elements, and Render Sites](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/ui-elements.md#surfaces) (Surfaces) |
| Error type | [Hook Configuration](https://xsyetopz.github.io/claude-code-docs/extend/hooks/configuration.md#matcher-targets) (Matcher Targets) |
| `disableAllHooks` | [Hook Configuration](https://xsyetopz.github.io/claude-code-docs/extend/hooks/configuration.md#settings-keys-and-trust) (Settings Keys and Trust) |
| Top-level `decision` and `reason` | [Hook Events](https://xsyetopz.github.io/claude-code-docs/extend/hooks/events.md#pretooluse) (PreToolUse) |
| `destination` | [Hook Events](https://xsyetopz.github.io/claude-code-docs/extend/hooks/events.md#permission-update-entries) (Permission Update Entries) |
| `additionalContext` | [Hook Events](https://xsyetopz.github.io/claude-code-docs/extend/hooks/events.md#setup) (Setup) |
| `error` | [Hook Events](https://xsyetopz.github.io/claude-code-docs/extend/hooks/events.md#stopfailure) (StopFailure) |
| `script` | [Hook Handlers](https://xsyetopz.github.io/claude-code-docs/extend/hooks/handlers.md#handler-types) (Handler Types) |
| `model` | [Hook Handlers](https://xsyetopz.github.io/claude-code-docs/extend/hooks/handlers.md#prompt-and-agent-fields) (Prompt and Agent Fields) |
| `scratchpad_dir` | [Hook Input and Output](https://xsyetopz.github.io/claude-code-docs/extend/hooks/input-and-output.md#common-input-fields) (Common Input Fields) |
| `decision` | [Hook Input and Output](https://xsyetopz.github.io/claude-code-docs/extend/hooks/input-and-output.md#universal-output-fields) (Universal Output Fields) |
| `autoMemoryDirectory` scope | [Memory and Rules](https://xsyetopz.github.io/claude-code-docs/configure/memory-and-rules.md#auto-memory) (Auto Memory) |
| Model, fast mode, effort, thinking, and PR status change | [Status Line](https://xsyetopz.github.io/claude-code-docs/configure/status-line.md#when-the-script-runs) (When the Script Runs) |
| `appendPlugins` | [Hooks, Plugins, and Skills Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/hooks-and-plugins.md#keys) (Keys) |
| `prependPlugins` | [Hooks, Plugins, and Skills Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings/hooks-and-plugins.md#keys) (Keys) |
| `CLAUDE_CODE_ARTIFACT_COMMENTS` | [Features and Toggles](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/features-and-toggles.md#variables) (Variables) |
| `CLAUDE_CODE_ARTIFACT_COMMENTS_AUTOREACT` | [Features and Toggles](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/features-and-toggles.md#variables) (Variables) |
| `CLAUDE_CODE_MCP_ALLOWLIST_ENV` | [Plugins and MCP](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/plugins-and-mcp.md#variables) (Variables) |
| `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` | [Plugins and MCP](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/plugins-and-mcp.md#variables) (Variables) |
| `CLAUDE_CODE_TRANSCRIPT_LOCAL_GC` | [Sessions and Storage](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/sessions-and-storage.md#variables) (Variables) |
| `CLAUDE_CODE_ENABLE_TELEMETRY` | [Telemetry and Debug](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/telemetry-and-debug.md#variables) (Variables) |
| `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` | [Tools and Bash](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/tools-and-bash.md#variables) (Variables) |
| `CLAUDE_CODE_TOOL_MEMORY_LIMIT` | [Tools and Bash](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/tools-and-bash.md#variables) (Variables) |
| `CLAUDE_CODE_ALT_SCREEN_FULL_REPAINT` | [UI and Terminal](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/ui-and-terminal.md#variables) (Variables) |
| `CLAUDE_CODE_NEW_INIT` | [UI and Terminal](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/ui-and-terminal.md#variables) (Variables) |
| `CLAUDE_CODE_NONBLOCKING_STDOUT` | [UI and Terminal](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/ui-and-terminal.md#variables) (Variables) |
| `IS_DEMO` | [UI and Terminal](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/ui-and-terminal.md#variables) (Variables) |
| `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#ways-to-change-it) (Ways to Change It) |
| Opus 5.5, Sonnet 5.5 by default | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#short-or-full-prompt) (Short or Full Prompt) |
| `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#short-or-full-prompt) (Short or Full Prompt) |
| `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=1` | [The System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md#short-or-full-prompt) (Short or Full Prompt) |
| Default, Sonnet 5.5 | [Captured System Prompts](https://xsyetopz.github.io/claude-code-docs/prompts.md#all-variants) (All Variants) |
| Full Prompt | [Captured System Prompts](https://xsyetopz.github.io/claude-code-docs/prompts.md#all-variants) (All Variants) |
| Simple Prompt Switch on Sonnet (same text as default-sonnet) | [Captured System Prompts](https://xsyetopz.github.io/claude-code-docs/prompts.md#all-variants) (All Variants) |
| Simple Prompt Switch on Haiku (same text as default-haiku) | [Captured System Prompts](https://xsyetopz.github.io/claude-code-docs/prompts.md#all-variants) (All Variants) |
| Simple Prompt Switch on Opus (same text as default-lean) | [Captured System Prompts](https://xsyetopz.github.io/claude-code-docs/prompts.md#all-variants) (All Variants) |
| hook `type: "script"` | [Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md#effects-and-differences) (Effects and Differences) |
| `max_results` | [Tools](https://xsyetopz.github.io/claude-code-docs/reference/tools.md#toolsearch) (ToolSearch) |

## Related Pages

- [How to Read This Site](https://xsyetopz.github.io/claude-code-docs/start/how-to-read.md)
- [Environment Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars.md)
- [Mod API Overview](https://xsyetopz.github.io/claude-code-docs/extend/mod-api.md)
