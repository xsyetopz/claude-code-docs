---
title: Tools and Bash
description: Environment variables for the Bash tool, file tools, search, permissions, and the sandbox.
sidebar_position: 7
---

These variables change how tools run.
They set Bash time limits and output size, shell choice, search behavior, permission helpers, and the sandbox.
Use them when long commands time out or when you need to limit what a tool can see.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | ✅ Yes. `BASH_DEFAULT_TIMEOUT_MS` and `BASH_MAX_OUTPUT_LENGTH` are common. |
| Can you change it? | ✅ Yes. |
| Can you turn it on or off? | Switch rows take `1` or `0`. Unset the variable to restore the default. |
| Where does it live? | Your shell or the `env` key of a settings file. |
| Rows on this page | 101 variables |
| Status | <Documented /> <Undocumented /> <Differs /> <Gated /> |

## Example

```json title="~/.claude/settings.json"
{
  "env": {
    "BASH_DEFAULT_TIMEOUT_MS": "300000",
    "BASH_MAX_OUTPUT_LENGTH": "60000"
  }
}
```

A Bash call now waits up to five minutes before it times out.

## Variables

The table is sorted by name. See [Environment Variables](index.md#how-to-read-the-tables) for what each column and badge means.

| Variable | Status | What it does | Values and default | Notes |
| --- | --- | --- | --- | --- |
| `AUTOMODE_DECISION_LOG` | <Undocumented /> | When the value is `1`, Claude Code appends each auto mode decision to `.automode_decisions.jsonl`. | Only the exact value `1` works. The log is skipped in one runtime mode | Auto mode, all. Not set from project `env` before trust |
| `BASH_DEFAULT_TIMEOUT_MS` | <Documented /> | Sets the default timeout of a foreground `Bash` or `PowerShell` command. | A number of milliseconds, `120000` by default. Positive number, default `120000`. Invalid values fall back to the default | All sessions. Project `env` can set it before trust |
| `BASH_MAX_OUTPUT_LENGTH` | <Documented /> | Caps the characters of `Bash` output that Claude reads back into the result. | A number, `30000` by default. Integer, default `30000`, max `150000`. The `bashOutputMaxChars` setting wins when set | All sessions. Project `env` can set it before trust |
| `BASH_MAX_TIMEOUT_MS` | <Documented /> | Sets the highest timeout the model may ask for on a foreground `Bash` or `PowerShell` command. | A number of milliseconds, `600000` by default. Positive number, default `600000`. The ceiling is the larger of this and `BASH_DEFAULT_TIMEOUT_MS` | All sessions. Project `env` can set it before trust |
| `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` | <Documented /> | Returns to the project working directory after each Bash or PowerShell command in the main session. | On or off | Main session. Project `env` can set it before trust |
| `CLAUDE_BG_SESSION_PERMISSION_RULES` | <Undocumented /> | Gives allow and deny permission rules and extra dirs to a background session as JSON. | JSON text. Used only when `CLAUDE_CODE_SESSION_KIND` is `bg`. Scrubbed from child env | Background sessions. Not set from project `env` before trust |
| `CLAUDE_CHROME_CLASSIFIER_FLOOR` | <Undocumented /> | Forces the Chrome auto mode classifier floor on or off. It overrides a feature flag. No visible effect in a print-mode probe ([Probes](../../reference/probes.md)). | On, off, or unset, `false` by default. Without it the flag decides, default `false`. Remote sessions read the flag in safe mode | Claude in Chrome with auto mode. Not set from project `env` before trust |
| `CLAUDE_CHROME_PERMISSION_MODE` | <Undocumented /> | Sets the permission mode of Claude in Chrome. No visible effect in a print-mode probe ([Probes](../../reference/probes.md)). | Text. An unknown value logs a warning. Claude Code sets `skip_all_permission_checks` for the native host when permission checks are skipped | Claude in Chrome. Not set from project `env` before trust |
| `CLAUDE_CODE_ADOPT_UNDERIVABLE_PARKED_PERMISSION` | <Undocumented /> | Lets a resumed session adopt a parked sidechain permission that it cannot re-derive. It then does not re-run the permission. | On or off. Part of the parked permission settings. A log line names this var when it adopts one | Print and SDK mode with parked permissions. Not set from project `env` before trust |
| `CLAUDE_CODE_AUTO_BACKGROUND_TIMEOUT_MS` | <Undocumented /> | Caps the timeout of a Bash call that can auto-background in the main agent. | A number of milliseconds. The cap is at least `2000`. A missing or non-positive value is ignored | Main agent, Bash |
| `CLAUDE_CODE_AUTO_MODE_ARTIFACT_CONSENT_RULE` | <Undocumented /> <Gated note="Works only behind a feature flag or server gate" /> | Turns the artifact consent rule of the auto mode classifier on or off. | On by default. Env value wins. Else a feature flag set to true turns it off | Auto mode, gated by a feature flag |
| `CLAUDE_CODE_AUTO_MODE_CLASSIFY_ASK_USER_QUESTION` | <Undocumented /> | Overrides whether the auto mode classifier looks at `AskUserQuestion` calls. | On by default. Env value, else the `classifyAskUserQuestion` server setting | Auto mode |
| `CLAUDE_CODE_AUTO_MODE_CLASSIFY_EDITS` | <Undocumented /> | Overrides whether the auto mode classifier checks file edits. | Env value, else a per-model server setting `classifyEditsModels` | Auto mode |
| `CLAUDE_CODE_AUTO_MODE_COMPACT_THREAD_RULE` | <Undocumented /> <Gated note="Works only behind a feature flag or server gate" /> | Picks the compact or the original thread rule for the auto mode classifier in a bound Slack thread. | Off by default. Env value, else a feature flag, default off | Auto mode, gated by a feature flag |
| `CLAUDE_CODE_AUTO_MODE_EDIT_REMOVAL` | <Undocumented /> | Turns on edit removal visibility in the auto mode classifier input. | Off by default. Env value, else the server setting `editRemovalVisibility`, default off | Auto mode |
| `CLAUDE_CODE_AUTO_MODE_EDIT_REMOVAL_CAP` | <Undocumented /> | Sets the size cap for removed edit text in the auto mode classifier input. | A number. Env value, else the server setting `editRemovalCap`, else `3000` | Auto mode |
| `CLAUDE_CODE_AUTO_MODE_GIT_STATUS_LIMIT` | <Undocumented /> | Sets a truncation limit for git status data in the auto mode classifier. | A number. Env value, else the server setting `gitStatusTruncationLimit`, else `2000` | Auto mode |
| `CLAUDE_CODE_AUTO_MODE_HEARTH_MEMBER_RELAY_ROWS` | <Undocumented /> <Gated note="Works only behind a feature flag or server gate" /> | Turns on rows for posts that a project member relayed in a bound thread, in the auto mode classifier input. | Off by default. Env value, else a feature flag, default off | Auto mode, gated by a feature flag |
| `CLAUDE_CODE_AUTO_MODE_OUTCOME_CODES` | <Undocumented /> | Turns on outcome code visibility in the auto mode classifier. | Off by default. Env value, else the server setting `outcomeVisibility`, default off | Auto mode |
| `CLAUDE_CODE_AUTO_MODE_PRIOR_ASSISTANT_CONTEXT` | <Undocumented /> | Turns on prior assistant context in the auto mode classifier input. | Off by default. Env value, else the server setting `priorAssistantContext`, default off | Auto mode |
| `CLAUDE_CODE_AUTO_MODE_REPO_VISIBILITY` | <Undocumented /> | Turns on a repository visibility lookup for the auto mode classifier. | Off by default. Env value, else the server setting `repoVisibility`, default off | Auto mode |
| `CLAUDE_CODE_AUTO_MODE_SEGMENTED_TRANSCRIPT` | <Undocumented /> | Turns on a segmented transcript for the auto mode classifier. | Off by default. Env value, else the server setting `segmentedTranscript`, default off. Cached per session | Auto mode |
| `CLAUDE_CODE_AUTO_MODE_SERVER` | <Documented /> | Controls whether the server reviews auto mode actions. Set to `0` to use the local classifier. | On or off. Unset gives no user choice. Claude Code forwards it to child processes | Auto mode |
| `CLAUDE_CODE_AUTO_MODE_TIER` | <Undocumented /> | Any value, even an empty one, switches the auto mode classifier to the `strict` tier. Claude Code forwards it to child processes. | `rawStr`. Only presence counts | Auto mode |
| `CLAUDE_CODE_BASH_EDIT_DIFF` | <Documented /> | Turns the diff of files changed during a Bash command on or off. | On, off, or unset. Wins over `bashEditDiffEnabled`. Without either, it is on in `auto` and `bypassPermissions` mode only if a further check passes | Bash tool |
| `CLAUDE_CODE_BASH_OUTPUT_AUDIENCE_NOTE` | <Undocumented /> | Forces the `bash_output_audience_note` feature on or off for Bash results with text stdout. | On, off, or unset. Unset leaves the choice to the rollout check | Bash tool |
| `CLAUDE_CODE_BASH_SANDBOX_SHOW_INDICATOR` | <Undocumented /> | Shows the name `SandboxedBash` instead of `Bash` for commands that run in the sandbox. | On or off, off by default | Bash tool, sandbox |
| `CLAUDE_CODE_BUBBLEWRAP` | <Undocumented /> | Tells Claude Code that it runs inside a Bubblewrap sandbox. It also lets `--dangerously-skip-permissions` run as root. | On or off. Part of the sandbox environment check. `IS_SANDBOX=1` has the same effect on the root check | Linux sandbox |
| `CLAUDE_CODE_DISABLE_ADVISOR_TOOL` | <Documented /> | Turns off the advisor tool and the `/advisor` command. | On or off. Checked first in the advisor enable check | First-party and AWS platform. Project `env` can set it before trust |
| `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` | <Documented /> | Stops Claude Code from ending background shells under critical memory pressure. | On or off. The prompt says it works only from the launch environment | MacOS and Linux |
| `CLAUDE_CODE_DISABLE_DANGEROUS_RM_TIMEOUT` | <Documented /> | Turns off the time limit on critical-path removal prompts. | On or off. Forces a feature flag timeout config to disabled | All sessions |
| `CLAUDE_CODE_DISABLE_INLINE_SHELL_RM_PROMPT` | <Documented /> | Stops Claude Code from reading `bash -c` scripts for critical-path removal prompts. | On or off. The check returns null at once when set | All sessions |
| `CLAUDE_CODE_DISABLE_POWERSHELL_CMD_RM_DENY` | <Documented /> | Turns off the PowerShell check that denies `rd`, `rmdir`, `del` and `erase` on system paths. | On or off. Without it a feature flag decides | PowerShell tool |
| `CLAUDE_CODE_DISABLE_SUBSTITUTION_RM_PROMPT` | <Documented /> | Turns off the critical-path check for a recursive `rm` whose target is only command substitution output. | On or off. Checked together with a feature flag | Bash tool |
| `CLAUDE_CODE_DISABLE_WEB_FETCH` | <Documented /> | Turns off the `WebFetch` tool. `WebSearch` stays on. | On or off. Docs: needs v2.1.285 or later. Also disables the web fetch agent | All sessions |
| `CLAUDE_CODE_DISABLE_WINDOWS_SHELL_LAUNCHER` | <Documented /> | Starts PowerShell commands on Windows directly, not through the `cmd.exe` launcher. | On or off. The launcher also depends on a flag and logs `env_opt_out` when this is set | Windows PowerShell tool |
| `CLAUDE_CODE_DONT_INHERIT_ENV` | <Undocumented /> | Starts the shell snapshot and the spawn-env probe with an empty environment instead of the inherited one. | On or off, off by default | Bash tool shell snapshot setup |
| `CLAUDE_CODE_EMIT_TOOL_USE_SUMMARIES` | <Undocumented /> | Sets the `emitToolUseSummaries` gate that the query loop reads. | On or off, off by default. Passed in the loop gates object next to `fastModeEnabled` | Query loop, all modes |
| `CLAUDE_CODE_EXECPATH` | <Undocumented /> | Gives the shell snapshot function for `claude` the path of the running binary. | Falls back to the computed install path | Bash tool shell snapshot |
| `CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS` | <Documented /> | Sets the token limit of a file read. | A number. Whole number above `0`. Else a built-in default | Read tool |
| `CLAUDE_CODE_FILE_READ_MAX_PDF_PAGES_PER_MESSAGE` | <Undocumented /> <Gated note="A feature flag or server gate decides by default. This variable overrides it" /> | Caps the PDF pages that Read tool calls may use in one message. | A number. Whole number of at least `1`, plain digits. Active only when a flag enforces the limit | Read tool with PDF files |
| `CLAUDE_CODE_FILE_READ_MAX_PDF_PAGES_PER_TURN` | <Undocumented /> <Gated note="Works only behind a feature flag or server gate" /> | Caps the PDF pages that Read tool calls may use in one turn. | A number. Whole number of at least `1`, plain digits. Used only with the per-message cap and an enforcing flag | Read tool with PDF files |
| `CLAUDE_CODE_GIT_BASH_PATH` | <Documented /> | Sets the path of the Git Bash executable on Windows. | Text. Must exist and be named `bash.exe`, `sh.exe`, `bash`, or `sh`. Else warns and auto-detects | Windows |
| `CLAUDE_CODE_GLOB_HIDDEN` | <Documented /> | Includes dotfiles in Glob results. | `true` by default. Set `false` to exclude them | Glob tool |
| `CLAUDE_CODE_GLOB_NO_IGNORE` | <Documented /> | Makes Glob ignore `.gitignore` rules. | `true` by default. Set `false` to respect `.gitignore` | Glob tool |
| `CLAUDE_CODE_GLOB_TIMEOUT_SECONDS` | <Documented /> | Sets the timeout of Glob file discovery in seconds. | A number of seconds, `20` by default and `60` on WSL. Whole number of at least `1` | Glob tool |
| `CLAUDE_CODE_INLINE_TOOLS` | <Undocumented /> <Gated note="Works only behind a feature flag or server gate" /> | Turns an inline tools mode on or off. Probe: Adds the beta `inline-tools-2026-09-15` to `anthropic-beta`. See Probes. | On, off, or unset. A false value always turns it off. Off in a `CCR_SESSION_PROFILE` session | All sessions |
| `CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY` | <Documented /> | Caps how many read-only tools and subagents run in parallel. | A number, `10` by default. Whole number min `1` | All sessions |
| `CLAUDE_CODE_MAX_TURNS` | <Documented /> | Caps the agentic turns when no `--max-turns` value is given. | A number. An explicit option wins | Print and SDK modes |
| `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` | <Documented /> | Caps `WebSearch` calls per session. | A number, `200` by default. Whole number min `1`, digits only | All sessions, `WebSearch` |
| `CLAUDE_CODE_NANKEEN_KESTREL` | <Undocumented /> <Gated note="Works only behind a feature flag or server gate" /> | Turns on a Windows-only path by env.  Nearby text is about the Windows sandbox group. No visible effect in a print-mode probe ([Probes](../../reference/probes.md)). | On or off. Unset follows a feature flag. Always false outside Windows | Windows |
| `CLAUDE_CODE_PERFORCE_MODE` | <Documented /> | Turns on Perforce write protection. `Edit` and `Write` fail with a `p4 edit <file>` hint when the file lacks the owner-write bit. | On or off. Parsed as a bool. Also adds a Perforce note to the system context | All file tools |
| `CLAUDE_CODE_POLICY_HELPER_PS1_PATH` | <Undocumented /> <Gated note="Works only behind a feature flag or server gate" /> | Names the PowerShell script that a Windows policy helper runs. The helper script reads it with `$env:`. | Text. Env var name built into a PowerShell command string. Assumed set by Claude Code for the child | Windows with PowerShell |
| `CLAUDE_CODE_POLICY_HELPER_PSMODULEPATH` | <Undocumented /> <Gated note="Works only behind a feature flag or server gate" /> | Carries the `PSModulePath` value for the Windows policy helper. The helper script copies it into `$env:PSModulePath`. | Text. Env var name built into a PowerShell command string. Assumed set by Claude Code for the child | Windows with PowerShell |
| `CLAUDE_CODE_POWERSHELL_RESPECT_EXECUTION_POLICY` | <Documented /> | Stops Claude Code from passing `-ExecutionPolicy Bypass` to PowerShell. | On or off. The branch code was not shown | Windows with PowerShell |
| `CLAUDE_CODE_PWSH_PARSE_TIMEOUT_MS` | <Undocumented /> | Sets the timeout of the PowerShell command parse step. | A number of milliseconds, `5000` by default. Whole number in ms above 0. The full wait adds up to 10000 ms more | PowerShell tool |
| `CLAUDE_CODE_QUESTION_EXTENDED` | <Undocumented /> | Turns on extended questions in `AskUserQuestion`. A host sets it from the `askUserQuestion.extendedQuestions` option. | On or off. Read only for some entrypoints and remote sessions | SDK, remote, and selected entrypoints |
| `CLAUDE_CODE_QUESTION_OPTIONAL_DESCRIPTIONS` | <Undocumented /> | Makes option descriptions optional in `AskUserQuestion`. A host sets it from the `askUserQuestion.optionalDescriptions` option. | On or off. Read only for some entrypoints and remote sessions | SDK, remote, and selected entrypoints |
| `CLAUDE_CODE_QUESTION_PREVIEW_FORMAT` | <Undocumented /> | Sets the preview format of `AskUserQuestion`. A host sets it from the `askUserQuestion.previewFormat` option. | Text. Without it `markdown` is the default for most entrypoints. Not for sdk, desktop, local-agent, or remote | All sessions |
| `CLAUDE_CODE_REPORT_FINDINGS` | <Undocumented /> | Gates a findings report mode for review runs. It needs a matching tool in the options and no text or json output. No visible effect in a print-mode probe ([Probes](../../reference/probes.md)). | On or off | Review runs |
| `CLAUDE_CODE_RESTRICTED` | <Documented /> | Starts the session in restricted mode like `--restricted`. | On or off. Other launch paths such as `--desktop` refuse to run under it | All sessions |
| `CLAUDE_CODE_SANDBOX_LEAVE_DENIES_TO_SRT_WIN` | <Undocumented /> | On Windows, stops Claude Code from adding its own deny rules and leaves them to `srt-win`. The error text warns the sandbox may then fail on a large profile. | On or off. Set it in the launch environment because a settings file cannot set it | Windows sandbox |
| `CLAUDE_CODE_SANDBOX_LEAVE_PARENT_FOLDERS_ALONE` | <Undocumented /> | On Windows, stops Claude Code from giving parent folders an entry for the sandbox group. Related log text lists the folders it then skips. | On or off. Only the string use was seen. The exact branch was not read | Windows sandbox |
| ⚠️ `CLAUDE_CODE_SANDBOXED` | <Undocumented /> | Marks the process as already inside a sandbox. Claude Code then counts the folder as trusted and skips the trust gates. | On or off. Makes the trust check pass and the permission-gate check pass. Also picks the sandbox-time settings path | All sessions. Set by a host or container |
| `CLAUDE_CODE_SCRIPT_CAPS` | <Documented /> | Limits how many times named scripts may run per session. It reads a JSON object of substring keys and number limits. | JSON text. JSON object. Bad JSON, an array, or no valid entries turn the caps off | Bash tool. Docs tie it to `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` |
| `CLAUDE_CODE_SETTLE_TOUCHED_FILES` | <Undocumented /> <Gated note="Works only behind a feature flag or server gate" /> | Turns on the settle step for touched files after a turn. It needs a feature flag off and a remote or specific build check true. | On or off. Works as an alternative to a feature flag. A second a feature flag adds a step | Turn end in file-reading sessions. gated by a feature flag |
| `CLAUDE_CODE_SHELL` | <Documented /> | Sets the shell for Bash tool commands. It accepts a path to `bash` or `zsh`. An invalid path falls back to detection. | Text. The path must contain `bash` or `zsh` and run. Else Claude Code logs a message and detects a shell from `SHELL` and `PATH` | Bash tool |
| `CLAUDE_CODE_SHELL_LAUNCHER_SCRIPT` | <Undocumented /> | Passes a launcher script to a PowerShell shell. The wrapper reads it, clears the variable, and runs it with `Invoke-Expression`. | Text. Set by Claude Code for the PowerShell child. The wrapper sets it to `$null` before running | PowerShell tool. Set by Claude Code |
| `CLAUDE_CODE_SHELL_PREFIX` | <Documented /> | Wraps shell commands that Claude Code starts with a prefix program. Hooks, Bash, status line, and stdio MCP starts use it. | Text. The command is passed to the wrapper as one quoted argument. PowerShell and exec-form hooks skip it | Bash tool, hooks, status line, MCP stdio |
| `CLAUDE_CODE_STRICT_INLINE_SHELL_RM_PROMPT` | <Undocumented /> <Gated note="Works only behind a feature flag or server gate" /> | Restores the strict `rm` permission prompt for inline shell `-c` scripts that build `rm` at run time. | On or off, on by default. Without it a feature flag (default true) picks the relaxed rule. The [changelog](https://code.claude.com/docs/en/changelog) names this variable | Bash tool permissions |
| `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` | <Documented /> <Differs note="The official docs and the program disagree. The row says how." /> | Strips credentials from the env of subprocesses such as Bash, hooks, and stdio MCP servers. | On, off, or unset. The default depends on the host (see Notes). `1` turns it on and `0` turns it off | Bash, hooks, MCP stdio. Docs omit the GitHub Actions and `local-agent` defaults |
| `CLAUDE_CODE_TOOL_MEMORY_CGROUP_EXCLUDE` | <Documented /> | Lists process kinds that the tool memory cap leaves out. `mcp` is added unless another rule applies. | A comma-separated list. Without it, a feature flag or a built-in set applies | Linux and WSL |
| `CLAUDE_CODE_TOOL_MEMORY_LIMIT` | <Documented /> <Differs note="The official docs and the program disagree. The row says how." /> | Caps memory for tool commands with a cgroup. Docs list `0` and `off` to turn it off. Code also accepts `none`. | Text. When unset, a feature flag decides, which docs do not say | Linux and WSL |
| `CLAUDE_CODE_USE_NATIVE_FILE_SEARCH` | <Documented /> | Finds commands, subagents, and output styles with Node file APIs and not ripgrep. Docs only. The read site was not re-checked. | On or off. Set `1` to enable | All sessions |
| `CLAUDE_CODE_USE_POWERSHELL_TOOL` | <Documented /> | Turns the PowerShell tool on or off. On Windows without Git Bash it is on. With Git Bash the feature flag decides when unset. | On, off, or unset. Non-Windows needs `1`. Windows takes `0` or `1` | Windows, Linux, macOS, WSL |
| `CLAUDE_CODE_WEB_SEARCH_FAST_ARG` | <Undocumented /> <Gated note="A feature flag or server gate decides by default. This variable overrides it" /> | Turns on a fast `WebSearch` mode with its own description and hint. Env wins over a feature flag. | On, off, or unset. Needs an extra model check to pass | All sessions |
| `CLAUDE_CODE_WEB_SEARCH_REFILLS_PER_HOUR` | <Documented /> | Sets how fast the session `WebSearch` limit refills, in calls per hour. | `100` by default. Plain digits. Unset gives 0 when non-interactive, else a feature flag with default `100` | All sessions |
| `CLAUDE_CODE_WEBFETCH_CACHE_TTL_MS` | <Documented /> | Sets how long `WebFetch` keeps a fetched URL in cache. | A number of milliseconds, `900000` by default. Plain digits, at least 1. Read once per launch | All sessions |
| `CLAUDE_CODE_WEBFETCH_DEADLINE_MS` | <Documented /> | Sets the upper bound on how long `WebFetch` waits for a download. | A number of milliseconds, `300000` by default. Plain digits, 0 or more. Env value has an upper cap | All sessions |
| `CLAUDE_CODE_WEBSEARCH_CITATIONS` | <Undocumented /> | Changes the `WebSearch` tool prompt so it does not ask for a `Sources:` list. It also gates a citations code path. | On or off. The second path needs two more checks | All sessions |
| `CLAUDE_ENV_FILE` | <Documented /> | Names a shell script that runs before each Bash command in the same shell. | Text. Read and trimmed. Hooks for `SessionStart`, `Setup`, `CwdChanged`, and `FileChanged` get a path set by Claude Code | Bash tool and hooks |
| `CLAUDE_PID` | <Documented /> | Holds the process ID of Claude Code. Child commands use it to find the parent process. | - | - |
| `CLAUDECODE` | <Documented /> | Marks a process as running inside Claude Code. Claude Code also reads it to detect a child session and to skip prompt history. | On or off. Set to `1` by Claude Code for shell snapshots, hook and tool subprocesses, and stdio MCP servers | All sessions |
| `ENABLE_TOOL_SEARCH` | <Documented /> | Sets MCP tool search mode. Unset defers tools, except on a non-first-party `ANTHROPIC_BASE_URL`, where tools load up front. | Text. `true` defer, `false` upfront, `auto` or `auto:N` use a percent threshold. `0` and `100` map to defer and upfront | All sessions. Project `env` can set it before trust |
| `GCM_INTERACTIVE` | <Documented /> | Claude Code sets a default for git child processes so Git Credential Manager does not prompt. | Set by Claude Code when unset in the child env. The default value comes from a table that was not read | Git child processes |
| `GIT_ASKPASS` | <Documented /> | Claude Code passes the user value to git child processes. It falls back to a default and then to an empty string. | Text. If unset, `SSH_ASKPASS` is handed on in its place in one path. Claude Code also sets it | Git child processes. Not set from project `env` before trust |
| `GIT_CONFIG_COUNT` | <Documented /> | Claude Code reads the count and appends its own `GIT_CONFIG_KEY_n` and `GIT_CONFIG_VALUE_n` pairs for git child processes. | A number. Parsed as a plain integer string. Also set by Claude Code in a child env | Git child processes. Not set from project `env` before trust |
| `GIT_CONFIG_GLOBAL` | <Undocumented /> | Path of the global git config. Claude Code reads it to find governed git config and sets it in scrubbed child envs. | Set by Claude Code to `/dev/null` or a sandbox path in some child envs | Git child processes. Not set from project `env` before trust |
| `GIT_CONFIG_NOSYSTEM` | <Undocumented /> | Claude Code sets it to `1` in scrubbed and sandbox child envs so git skips the system config. | Set by Claude Code. No direct read of the user value was seen | Git child processes. Not set from project `env` before trust |
| `GIT_SSH_COMMAND` | <Documented /> | Claude Code uses it, or `ssh`, as the base of the SSH command for its git calls, and adds `-o BatchMode=yes` and a connect timeout. | Text. Output is set by Claude Code in the child env. Timeout is `30` in one path and shorter in another | Git clone and fetch. Not set from project `env` before trust |
| `GIT_TERMINAL_PROMPT` | <Documented /> | Claude Code sets it to `0` for git child processes so git never prompts on the terminal. | Set by Claude Code when unset in the child env. In one path the user value is kept | Git child processes. Not set from project `env` before trust |
| `IS_SANDBOX` | <Undocumented /> | Tells Claude Code that it runs in a deliberate sandbox, so root is allowed with `--dangerously-skip-permissions`. | - | - |
| `JAVA_TOOL_OPTIONS` | <Undocumented /> | In the sandbox, Claude Code appends `-Dhttps.proxyHost` settings to it so Java tools use the sandbox proxy. | - | - |
| `LINES` | <Documented /> | Set by Claude Code for hook commands to the terminal row count. | - | - |
| `LOCALAPPDATA` | <Documented /> <Gated note="Works only behind a feature flag or server gate" /> | Used on Windows to find the `WindowsApps` alias folder and for path checks. | - | - |
| `NoDefaultCurrentDirectoryInExePath` | <Undocumented /> | Set by Claude Code to `1` at startup so executable search skips the current directory. | - | - |
| `SHELL` | <Documented /> | Names the user shell. Claude Code uses it to find tools, to describe the shell in the prompt, and to run login-shell probes. | Text. Non-empty string. Falls back to `/bin/zsh` for one probe and to `unknown` in the prompt text | All sessions, Windows sets it itself |
| `SUDO_GID` | <Undocumented /> <Gated note="Works only behind a feature flag or server gate" /> | Group id of the user who ran `sudo`. Claude Code uses it with `SUDO_UID` and `SUDO_USER` to find the real user when it runs as root. | A number. Integer, digits only, min `0`. Used only when the process uid is `0` | Linux and macOS as root |
| `SUDO_UID` | <Undocumented /> <Gated note="Works only behind a feature flag or server gate" /> | User id of the user who ran `sudo`. Claude Code uses it to decide who owns files and git repos when it runs as root. | A number. Integer, digits only, min `0`. Used only when the process runs as root | Linux and macOS as root |
| `SUDO_USER` | <Undocumented /> <Gated note="Works only behind a feature flag or server gate" /> | Name of the user who ran `sudo`. Claude Code checks it against the system and uses it as the real owner when it runs as root. | Text. Non-empty string that must match a safe name pattern. Used only as root | Linux and macOS as root |
| `USE_BUILTIN_RIPGREP` | <Documented /> | Set to `0` to use the system `rg` instead of the bundled one. | On or off. Project settings may set it before trust (allowlist true) | All sessions. Project `env` can set it before trust |

## How It Works

The Bash tool starts a shell for each command. Many variables here are read when the command starts.
Some variables also pass into the child shell, so a tool you run sees them too.
`CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` strips credentials from the environment of subprocesses such as Bash, hooks, and stdio MCP servers.

## Related Pages

- [Environment Variables](index.md): how Claude Code reads variables and which value wins.
- [Tools Reference](../../reference/tools/index.md)
- [Permissions](../permissions/index.md)
- [Undocumented Items](../../reference/undocumented.md): every item that only the program shows.

Source: the program (variable names found in the `2.1.303` binary) and the [Environment Variables](https://code.claude.com/docs/en/env-vars) page of the official docs.
