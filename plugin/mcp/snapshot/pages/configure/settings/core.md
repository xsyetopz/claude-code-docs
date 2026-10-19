---
title: "Core Settings"
description: "Keys for compaction, memory, cleanup, shell commands, files, the env block, the sandbox, and updates."
url: https://xsyetopz.github.io/claude-code-docs/configure/settings/core
source: docs/configure/settings/core.md
---

# Core Settings


These keys control how Claude Code compacts the conversation, remembers things, cleans up old files, and runs shell commands.
Most people change only a few of them, such as `language` or `cleanupPeriodDays`.
The `env` and `sandbox` keys are objects that have their own pages elsewhere.

Every key here works today. Boolean keys such as `autoMemoryEnabled` and `autoCompactEnabled` switch a feature.

## Keys

Source: [Settings Reference](https://code.claude.com/docs/en/settings-reference) for rows marked [Documented]. For rows marked [Undocumented], Source: the program (its bundled settings schema).
Where to Set It tells you which files may set the key. See [Settings Files and Scopes](https://xsyetopz.github.io/claude-code-docs/configure/settings.md#where-settings-live).

| Key | Status | Type | Default | What It Does | Where to Set It |
| --- | --- | --- | --- | --- | --- |
| `$schema` | [Documented] | string | - | Point your editor at the published JSON schema for autocomplete and checks. Use `https://json.schemastore.org/claude-code-settings.json`. | Settings files |
| `attribution` | [Documented] | boolean or object | Standard attribution | Customize the attribution Claude Code adds to commits and pull requests. `false` hides all attribution. | Any settings file |
| `autoCompactEnabled` | [Documented] | boolean | - | Turn automatic compaction off or on. | Any settings file |
| `autoCompactWindow` | [Documented] | number or `"auto"` | - | Set how full the context gets before Claude Code compacts. A number from `100000` to `1000000` tokens, or `"auto"` for the window tuned for the model. | Any settings file |
| `autoDreamEnabled` | [Undocumented] | boolean | - | Turn background memory consolidation (auto-dream) on or off. A value here overrides the server-side default. | Settings files |
| `autoMemoryDirectory` | [Documented] | string | `~/.claude/projects` | Store auto memory in a directory you choose. `~/` expands to your home directory. Claude Code ignores the key in the checked-in project file. | Any settings file |
| `autoMemoryEnabled` | [Documented] | boolean | - | Turn auto memory off or on. | Any settings file |
| `autoUpdatesChannel` | [Documented] | enum: `latest`, `stable`, `rc` | `latest` | Follow the stable release channel instead of latest. | Any settings file |
| `awaySummaryEnabled` | [Documented] | boolean | - | Turn off the session recap shown when you come back to the terminal. The recap shows after 5 or more minutes away. | Any settings file |
| `bashEditDiffEnabled` | [Documented] | boolean | On when the Bash tool handles file edits | Record the files that changed while a Bash command ran in every permission mode. Outside auto and `bypassPermissions` modes, only user or managed settings can turn it on. | User or managed settings |
| `bashOutputMaxChars` | [Documented] | integer | `30000` | Set how much of a successful command's output Claude receives inline. Clamped to `4000`-`128000`. Longer output goes to a file and Claude gets a preview. | Any settings file |
| 🔒 `claudeMd` | [Documented] | string | - | Inject organization-wide CLAUDE.md instructions from managed settings. Only managed settings honor it. | Managed settings only |
| `claudeMdExcludes` | [Documented] | array of string | - | Skip specific CLAUDE.md files when memory loads. Takes glob patterns or absolute paths. Managed files cannot be excluded. | Any settings file |
| `cleanupPeriodDays` | [Documented] | integer | 30 | Choose how many days Claude Code keeps transcripts before deleting them. The minimum is `1`. `--no-session-persistence` turns off transcript writes. | Any settings file |
| `defaultShell` | [Documented] | enum: `bash`, `powershell` | `bash` | Choose whether Bash or PowerShell runs the shell commands you type with the `!` prefix. | Any settings file |
| `desktopSessionCleanupPeriodDays` | [Documented] | integer | - | Set an age limit in days for Claude Desktop and Cowork transcripts. `0` (the default) means no ceiling. Ignored when org policy sets `cleanupPeriodDays`. | User or managed settings |
| ⛔ `disableArtifact` | [Documented] | boolean | - | Deprecated, so use `enableArtifact` to turn the Artifact tool off. `true` still turns the tool off. `false` is ignored. | Any settings file |
| `enableArtifact` | [Documented] | boolean | On once the feature is available | Turn the `Artifact` tool on or off. A `false` in any file turns it off, and no file can turn it back on. | Any settings file |
| `env` | [Documented] | object | - | Set environment variables for every session and its subprocesses. | Any settings file |
| `fileCheckpointingEnabled` | [Documented] | boolean | - | Turn off or on the file snapshots that `/rewind` restores. | Any settings file |
| `fileSuggestion` | [Documented] | object | - | Supply `@` file autocomplete from your own command. | Any settings file |
| `idleCompaction` | [Documented] | boolean | - | Stop Claude Code from compacting a long conversation while your terminal session is idle. Setting `true` does not turn idle compaction on. | Any settings file |
| ⛔ `includeCoAuthoredBy` | [Documented] | boolean | `true` | Deprecated, so use `attribution` to hide or change commit and PR attribution. | Any settings file |
| `includeGitInstructions` | [Documented] | boolean | `true` | Remove the built-in commit and PR instructions from Claude's context. | Any settings file |
| `language` | [Documented] | string | - | Have Claude respond in a language other than English. | Any settings file |
| `minimumVersion` | [Documented] | string | - | Keep auto-updates from installing anything below a version. | Any settings file |
| `plansDirectory` | [Documented] | string | `~/.claude/plans` | Choose where plan mode writes plan files. The path is relative to the project root. | Any settings file |
| `precomputeCompactionEnabled` | [Undocumented] | boolean | - | Build the compaction summary in the background before it is needed. Applies only when auto-compact is on. | Settings files |
| `respectGitignore` | [Documented] | boolean | `true` | Keep gitignored files out of the `@` file picker. | Any settings file |
| `respondToBashCommands` | [Documented] | boolean | `true` | Stop Claude from responding after a `!` shell command runs. The command output still joins the context. | Any settings file |
| `sandbox` | [Documented] | object | - | Isolate Bash commands from your filesystem and network on macOS, Linux, and WSL2. | Any settings file |
| `skipWebFetchPreflight` | [Documented] | boolean | - | Skip the WebFetch hostname check when Anthropic is unreachable. | Any settings file |
| `todoFeatureEnabled` | [Undocumented] | boolean | - | Turn the todo and task tracking panel on or off. | Settings files |
| `worktree` | [Documented] | object | - | Configure how Claude Code creates git worktrees. Covers `--worktree`, `EnterWorktree`, and agent isolation. | Any settings file |

## Example

### Keep Transcripts for a Week

This file deletes transcripts after 7 days, keeps auto memory on, lets Claude see more shell output inline, and asks for answers in German.

```json title="~/.claude/settings.json"
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "cleanupPeriodDays": 7,
  "autoMemoryEnabled": true,
  "bashOutputMaxChars": 50000,
  "language": "german"
}
```

## Related Pages

- [Settings Files and Scopes](https://xsyetopz.github.io/claude-code-docs/configure/settings.md) explains the scopes, precedence, and managed settings.
- [Settings Reference](https://code.claude.com/docs/en/settings-reference) is the official page for each key.
- [Environment Variable Groups](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/context-and-compaction.md) lists the variables that pair with compaction keys.
- [Memory and Rules](https://xsyetopz.github.io/claude-code-docs/configure/memory-and-rules.md) covers `CLAUDE.md` and auto memory.
- [Sandbox](https://xsyetopz.github.io/claude-code-docs/configure/permissions/sandbox.md) covers the `sandbox` key in detail.
