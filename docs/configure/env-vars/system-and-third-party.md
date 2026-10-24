---
title: System and Third-Party
description: Environment variables owned by your system or other tools that Claude Code reads, such as HOME, TERM, and ALL_PROXY.
sidebar_position: 16
---

Claude Code reads many variables that it does not define.
Your system, your terminal, CI services, and other tools own them.
Examples are `HOME`, `PATH`, `EDITOR`, `TERM`, and `ALL_PROXY`. Claude Code reads them to find files, pick colors, and detect where it runs.

This page lists 130 variables. You set many of them for your system anyway. Set them in your shell, or in the `env` key of a settings file.

## Example

```bash
export EDITOR="code --wait"
claude
```

Claude Code opens this editor for files, for example for `/memory`. `VISUAL` wins over `EDITOR`.

## Variables

The table is sorted by name. See [Environment Variables](index.md#how-to-read-the-tables) for what each column and badge means.

| Variable | Status | What it does | Values and default | Notes |
| --- | --- | --- | --- | --- |
| `__CFBundleIdentifier` | <Undocumented /> | MacOS bundle id of the app that started the process. Claude Code uses it to find the host app and the URL handler. | Text. Non-empty string. `com.anthropic.claude-code-url-handler` starts the deep link path | MacOS |
| `AGENT_NAME` | <Undocumented /> | Confirms an Azure Pipelines agent for the terminal color level. | Text. Presence test together with `TF_BUILD` | All sessions |
| `ALACRITTY_LOG` | <Undocumented /> | Terminal detection. A set value counts as an Alacritty terminal in a terminal-feature check and rules out a plain VTE terminal. | On or off. Truthy test only. Read from the env object and from the `env` of the terminal detector | Terminal UI rendering, all. Not set from project `env` before trust |
| `ALACRITTY_WINDOW_ID` | <Undocumented /> | Terminal detection. A set value rules out a plain `vte-based` or `gnome-terminal` guess, because Alacritty sets it. | On or off. Truthy test only, in the terminal detector | Terminal UI rendering, all. Not set from project `env` before trust |
| `ALL_PROXY` | <Documented /> | Standard proxy variable. Claude Code passes it to `git` as `http.proxy` and `remote.origin.proxy` when it runs `git` commands. | Text. Read after `HTTPS_PROXY` and `https_proxy`, with the lowercase `all_proxy` as the last fallback | Git helper commands, all. Not set from project `env` before trust |
| `ALLUSERSPROFILE` | <Undocumented /> | Windows path variable. It is the last fallback for the `ProgramData` folder when Claude Code builds the Windows Start Menu path. | Text. Order is `ProgramData`, then `PROGRAMDATA`, then `ALLUSERSPROFILE`. Also in a list of Windows path names | Windows. Not set from project `env` before trust |
| `ANDROID_HOME` | <Undocumented /> | Environment detection. If the path exists, Claude Code records `android-sdk` in the detected build tools. | Text. Read first, with `ANDROID_SDK_ROOT` as the fallback. Only the path check matters | Environment report, all. Not set from project `env` before trust |
| `ANDROID_SDK_ROOT` | <Undocumented /> | Environment detection. It is the fallback for `ANDROID_HOME`. If the path exists, Claude Code records `android-sdk` in the detected build tools. | Text. Read only when `ANDROID_HOME` is unset | Environment report, all. Not set from project `env` before trust |
| `APPDATA` | <Documented /> | Windows path variable. Claude Code uses it for the `gcloud` config folder, the Alacritty config path, and a Windows path list. | Text. Used on Windows only for `gcloud` and Alacritty paths | Windows. Not set from project `env` before trust |
| `APPVEYOR` | <Undocumented /> | Names AppVeyor for the terminal color level. | Presence test, only when `CI` is set. Gives color level 1 | All sessions |
| `AWS_EXECUTION_ENV` | <Undocumented /> | Names the AWS runtime. Claude Code uses it to detect `aws-fargate` and `aws-ecs` as the deployment environment. The AWS SDK adds it to its user agent. | Compared with `AWS_ECS_FARGATE` and `AWS_ECS_EC2` | All (deployment detection) and AWS SDK calls |
| `AWS_LAMBDA_FUNCTION_NAME` | <Undocumented /> | Marks an AWS Lambda host. Claude Code reports `aws-lambda` as the deployment environment when it is set. | Text. Any non-empty value. The AWS SDK also reads it for trace headers | All (deployment detection) |
| `AWS_PAGER` | <Undocumented /> | Sets the pager of the AWS CLI. Claude Code lists it among env names that can run a program, for safety checks. | Text. No direct read | Settings `env` and Bash safety checks |
| `AZURE_AUTH_LOCATION` | <Undocumented /> | Names an Azure auth file path. Claude Code lists it among credential file names to protect. | Text. No direct read | Settings `env` and sandbox credential lists |
| `AZURE_CONFIG_DIR` | <Undocumented /> | Sets the Azure CLI config folder. Claude Code treats it as a credential path to protect, default `~/.azure`. | Text | Sandbox credential deny paths |
| `AZURE_FUNCTIONS_ENVIRONMENT` | <Undocumented /> | Marks an Azure Functions host. Claude Code reports `azure-functions` as the deployment environment when it is set. | Any non-empty value | All (deployment detection) |
| `BASH_ENV` | <Documented /> | Names the startup file that bash reads. Claude Code treats it as an unsafe inlet and flags it in settings and plugin env. | Claude Code never reads it for its own use | Settings `env`, plugin env, sandbox checks |
| `BROWSER` | <Documented /> | Names the command that opens URLs. Claude Code uses it before `open` on macOS, and the `browser` setting wins over it. | Text. The `browser` setting wins over it. On Linux with no display the open step fails with `no_display` | All sessions |
| `BUILDKITE` | <Undocumented /> | Marks a Buildkite CI run. Claude Code uses it for CI detection, deployment detection, and color depth hints. | Text. Any non-empty value counts | All sessions |
| `C9_PID` | <Undocumented /> | Marks an AWS Cloud9 workspace. Claude Code reports `aws-cloud9` as the environment when it is set. | Any non-empty value. Read directly in deployment detection | All (deployment detection) |
| `C9_USER` | <Undocumented /> | Marks an AWS Cloud9 workspace. Claude Code reports `aws-cloud9` as the environment when it is set. | Any non-empty value. Read directly in deployment detection | All (deployment detection) |
| `CDPATH` | <Undocumented /> | Is the shell `cd` search path. Claude Code blanks it in `cd` helper commands and treats it as an unsafe env name to override. | Text | Bash tool, Git and settings `env` checks |
| `CF_PAGES` | <Undocumented /> | Marks Cloudflare Pages. Claude Code reports `cloudflare-pages` as the deployment environment and counts it as a CI signal. | On or off. Truthy value check | All (deployment detection) |
| `CI` | <Documented /> | Marks a CI run for the terminal color level. | Presence test (`"CI" in env`), any value counts. A CI vendor variable then picks the level | All sessions |
| `CI_NAME` | <Undocumented /> | Names the CI vendor. Claude Code checks for `codeship` when it picks the terminal color depth. | Text. Only the value `codeship` matters | Terminal color detection (all) |
| `CIRCLECI` | <Undocumented /> | Marks a CircleCI run. Claude Code uses it for CI detection, deployment detection, and terminal color depth. | Text. Presence counts | All sessions |
| `CODER` | <Undocumented /> | Marks a Coder workspace. The environment detector records deployment `coder`. | - | - |
| `CODER_WORKSPACE_NAME` | <Undocumented /> | Marks a Coder workspace by name. The environment detector records deployment `coder`. | Text | - |
| `CODESPACES` | <Undocumented /> | Marks GitHub Codespaces. The environment detector records deployment `codespaces`. | - | - |
| `COLORTERM` | <Undocumented /> | Reports terminal color support. `truecolor` or `24bit` means 24-bit color. | - | - |
| `COLUMNS` | <Documented /> | Gives hook commands the terminal width. | - | - |
| `COMPUTERNAME` | <Undocumented /> | The Windows host name. Claude Code uses it as the device name. | - | - |
| `COMSPEC` | <Undocumented /> | The Windows command interpreter path. Claude Code uses it as a shell path fallback in environment info. | - | - |
| `ComSpec` | <Documented /> | The Windows command interpreter path. The terminal opener uses it for the Command Prompt entry. | - | - |
| `ConEmuANSI` | <Undocumented /> | Marks ConEmu. Any of the three `ConEmu` vars turns on terminal progress reporting. | - | - |
| `ConEmuPID` | <Undocumented /> | Marks ConEmu. Any of the three `ConEmu` vars turns on terminal progress reporting. | - | - |
| `ConEmuTask` | <Undocumented /> | Marks ConEmu. The value `{cmd::Cmder}` also selects Unicode symbols. | - | - |
| `CONTAINER_SANDBOX_MOUNT_POINT` | <Undocumented /> | Marks a Windows container. The check turns off the registry sweep. | - | - |
| `COREPACK_ENABLE_AUTO_PIN` | <Undocumented /> | Set to `0` at startup so that `corepack` does not edit `package.json`. | - | - |
| `CURSOR_TRACE_ID` | <Undocumented /> | Marks the Cursor editor. Claude Code uses it to name the terminal host. | Text | - |
| `DAYTONA_WS_ID` | <Undocumented /> | Marks a Daytona workspace. The environment detector records deployment `daytona`. | Text | - |
| `DENO_DEPLOYMENT_ID` | <Undocumented /> | Marks Deno Deploy. The environment detector records deployment `deno-deploy`. | Text | - |
| `DEVPOD` | <Undocumented /> | Marks a DevPod workspace. The environment detector records deployment `devpod`. | - | - |
| `DEVPOD_WORKSPACE_UID` | <Undocumented /> | Marks a DevPod workspace by ID. The environment detector records deployment `devpod`. | - | - |
| `DISPLAY` | <Undocumented /> | Tells Claude Code if a local display exists on Linux. With no `DISPLAY` and no `WAYLAND_DISPLAY`, it treats the browser open as not possible. | Text. Matched against `:N` or `unix:N` forms | Linux. Not set from project `env` before trust |
| `DRONE` | <Undocumented /> | Names Drone CI for the terminal color level. | Presence test, only when `CI` is set. Gives color level 1 | All sessions |
| `DYNO` | <Undocumented /> | Heroku sets it. Environment detection reports the deployment platform as `heroku` when it is non-empty. | Any non-empty value counts | All sessions. Environment detection only |
| `EDITOR` | <Documented /> | Names the editor that Claude Code opens for files, for example for `/memory`. `VISUAL` wins over it, and the fallback is the first of `code`, `vi`, `nano` found. | Text. Also sent in environment detection as the editor value | Interactive. Not set from project `env` before trust |
| `FLY_APP_NAME` | <Undocumented /> | Fly.io sets it. Environment detection reports the platform as `fly.io` when it is non-empty. | Text | All sessions. Environment detection only |
| `FLY_MACHINE_ID` | <Undocumented /> | Fly.io sets it. Environment detection reports the platform as `fly.io` when it is non-empty. | Text | All sessions. Environment detection only |
| `FORCE_COLOR` | <Documented /> | Forces the color depth. The Bun runtime maps `""`, `1`, `true` to 16 colors and `2` to 256 colors. | Text. Untrimmed string | All sessions. Not set from project `env` before trust |
| `GH_CONFIG_DIR` | <Undocumented /> | Names the `gh` config directory. Claude Code checks it for `hosts.yml` or `config.yml` to see if `gh` has a login. | Text. Falls back to `XDG_CONFIG_HOME/gh`, then `~/.config/gh`. Also used in a secrets scan | GitHub features. Not set from project `env` before trust |
| `GH_HOST` | <Documented /> | Names the GitHub host. It picks the enterprise token and is passed to the `gh` stand-in shim. | Text | GitHub features. Not set from project `env` before trust |
| `GH_REPO` | <Undocumented /> | Names the repository for `gh`. Claude Code passes it to the `gh` shim, which uses a host in it to choose the route. | Text | GitHub features. Not set from project `env` before trust |
| `GITEA_ACTIONS` | <Undocumented /> | Names Gitea Actions for the terminal color level. | Presence test, only when `CI` is set. Gives color level 3 in one helper | All sessions |
| `GITHUB_ACTION_PATH` | <Undocumented /> | Path of the running action. Claude Code protects it in the scrub path list and logs the `claude-code-action` ref. | A path | GitHub Actions. Not set from project `env` before trust |
| `GITHUB_ACTIONS` | <Undocumented /> | Marks a GitHub Actions run. It adds run metadata to telemetry and turns on the subprocess env scrub unless that scrub is set off. | On or off. Truthy parse. `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` set to `0`, `false`, `no`, or `off` turns the scrub off | GitHub Actions. Not set from project `env` before trust |
| `GITHUB_ACTOR` | <Undocumented /> | Gives a user label for a cache diagnostic. It falls back to `USER`, `USERNAME`, then the git email name. | Text. The label drops chars outside `a-zA-Z0-9._-` and is cut to 64 chars. Telemetry also reads it in Actions | GitHub Actions. Not set from project `env` before trust |
| `GITHUB_ENV` | <Undocumented /> | Path of the runner env file. Claude Code adds it to the protected path list of the subprocess scrub. | Resolved to a path | GitHub Actions. Not set from project `env` before trust |
| `GITHUB_EVENT_PATH` | <Undocumented /> | Path of the event payload file. Claude Code adds it to the protected path list of the subprocess scrub. | A path | GitHub Actions. Not set from project `env` before trust |
| `GITHUB_WORKSPACE` | <Undocumented /> | Path of the workspace. If it differs from the cwd, Claude Code protects its `.git` hooks and config in the scrub path list. | - | GitHub Actions. Not set from project `env` before trust |
| `GITLAB_CI` | <Undocumented /> | GitLab CI marker. It appears in CI vendor lists of the Bun runtime and the color support code. | Text. Use is by name in lists. No direct Claude Code read was seen | GitLab CI. Not set from project `env` before trust |
| `GITPOD_WORKSPACE_ID` | <Undocumented /> | Gitpod sets it. Environment detection reports the deployment as `gitpod` when it is non-empty. | Text | All sessions. Environment detection only |
| `GNOME_TERMINAL_SERVICE` | <Undocumented /> | Terminal marker for GNOME Terminal. Environment detection records if it is set. | Presence only | Terminal detection |
| `GOOGLE_CLOUD_WORKSTATIONS` | <Undocumented /> | Marks Google Cloud Workstations. Environment detection reports `gcp-cloud-workstations` when it is set. | Presence check | All sessions. Environment detection only |
| `HISTFILE` | <Undocumented /> | Gives the shell history path to a context step that reads the shell history for tool usage. | Text. Passed as the history file input. Does not run if the home is a network path | Context gathering. Not set from project `env` before trust |
| `HOME` | <Documented /> | Home directory. Many paths start from it, such as the config and XDG fallback dirs. | Text. Falls back to the OS home dir | All sessions. Not set from project `env` before trust |
| `HOMEDRIVE` | <Undocumented /> | Windows home drive. Claude Code sets it in a child env and uses it to expand paths in a Windows lookup. | Set by Claude Code from the home path for a Windows child env | Windows |
| `HOMEPATH` | <Undocumented /> | Windows home path. Claude Code sets it in a child env and uses it to expand paths in a Windows lookup. | Set by Claude Code from the home path for a Windows child env | Windows |
| `HOMESHARE` | <Undocumented /> | Windows network home. Claude Code uses it to expand `%HOMESHARE%` in a Windows registry lookup. | Text | Windows |
| `KUBERNETES_SERVICE_HOST` | <Undocumented /> | Detects a Kubernetes pod so Claude Code reports a Kubernetes container runtime. | - | - |
| `NODE_ENV` | <Documented /> | Claude Code sets `production` in the env of some helper child processes. It also lists it in env reports. | - | - |
| `NODE_OPTIONS` | <Undocumented /> | Node options. Claude Code adds `--max-old-space-size=8192` when `CLAUDE_CODE_REMOTE` is `true`. | - | - |
| `NODE_PATH` | <Documented /> | Bun runtime module search path. Claude Code removes it from the env of some helper child processes. | A path | - |
| `PATH` | <Documented /> | Standard executable search path. Claude Code reads it to find tools and sets it in shell and `pwsh` child environments. | Text | All sessions. Not set from project `env` before trust |
| `PATHEXT` | <Documented /> | Windows list of executable extensions. Used when Claude Code looks for commands. | Text, `.EXE` by default. For `pwsh` child shells Claude Code sets its own value | Windows. Not set from project `env` before trust |
| `PIP_CERT` | <Undocumented /> | Sets the CA bundle path for `pip`. Claude Code sets it in the egress-proxy child env. | Text. Also in the sandbox CA list | Sessions with the agent proxy or sandbox. Not set from project `env` before trust |
| `PLAYWRIGHT_BROWSERS_PATH` | <Undocumented /> | Is part of the key of the local Chrome search for artifact preview. | Text | Local sessions with artifact preview. Not set from project `env` before trust |
| `PREFIX` | <Documented /> <Gated note="Works only behind a feature flag or server gate" /> | Gives the Termux install prefix. Claude Code uses `$PREFIX/tmp` for daemon and socket paths. | Text. Used only when `TERMUX_VERSION` is set. Else `/tmp` | Termux (Android). Not set from project `env` before trust |
| `PROGRAMDATA` | <Undocumented /> <Gated note="Works only behind a feature flag or server gate" /> | Gives the Windows `ProgramData` folder. Used to find the Start Menu folder and as a protected env name in shell checks. | Text. Looked up as `ProgramData`, then `PROGRAMDATA`, then `ALLUSERSPROFILE` | Windows. Not set from project `env` before trust |
| `ProgramData` | <Documented /> <Gated note="Works only behind a feature flag or server gate" /> | Gives the Windows `ProgramData` folder for the sandbox runtime and the Azure Arc token path. | Text. The sandbox throws `ProgramData is not set` when it is missing | Windows. Not set from project `env` before trust |
| `ProgramFiles` | <Documented /> <Gated note="Works only behind a feature flag or server gate" /> | Gives the Windows `Program Files` folder. Used to locate PowerShell and Azure Arc tools. | Text | Windows. Not set from project `env` before trust |
| `PROJECT_DOMAIN` | <Undocumented /> | Marks the host as Glitch in deployment-environment detection. | Text | All platforms. Not set from project `env` before trust |
| `PWD` | <Documented /> | Standard working directory. Claude Code adds it as a session directory when it differs from the original cwd. | Text. Used in startup permission setup and shell-expression checks | All sessions. Not set from project `env` before trust |
| `RAILWAY_ENVIRONMENT_NAME` | <Undocumented /> | Marks the host as Railway in deployment-environment detection. | Text | All platforms. Not set from project `env` before trust |
| `RAILWAY_SERVICE_NAME` | <Undocumented /> | Marks the host as Railway in deployment-environment detection. | Text | All platforms. Not set from project `env` before trust |
| `RENDER` | <Undocumented /> | Marks the host as Render in deployment-environment detection. | Text | All platforms. Not set from project `env` before trust |
| `REPL_ID` | <Undocumented /> | Marks the host as Replit in deployment-environment detection. | Text | All platforms. Not set from project `env` before trust |
| `REPL_SLUG` | <Undocumented /> | Marks the host as Replit in deployment-environment detection. | Text | All platforms. Not set from project `env` before trust |
| `REQUESTS_CA_BUNDLE` | <Undocumented /> | Sets the CA bundle path for Python `requests`. Claude Code sets it in the egress-proxy and sandbox child env. | Text. Listed with the other CA variables | Sessions with the agent proxy or sandbox. Not set from project `env` before trust |
| `RUNNER_ENVIRONMENT` | <Undocumented /> <Gated note="Works only behind a feature flag or server gate" /> | GitHub Actions runner kind. `github-hosted` marks a hosted runner in diagnostics. | Text. Read only when `GITHUB_ACTIONS` is true | GitHub Actions. Not set from project `env` before trust |
| `RUNNER_OS` | <Undocumented /> <Gated note="Works only behind a feature flag or server gate" /> | GitHub Actions runner OS. Claude Code reports it in telemetry. | Text. Read only when `GITHUB_ACTIONS` is true | GitHub Actions. Not set from project `env` before trust |
| `SESSIONNAME` | <Undocumented /> | Windows console session name. Claude Code only records whether it is set, as telemetry about the terminal. | Text. Any non-empty string. No behavior change | All sessions, telemetry only |
| `SPACE_CREATOR_USER_ID` | <Undocumented /> | Hugging Face Spaces variable. Claude Code uses it to detect the `huggingface-spaces` deployment environment for telemetry. | Text. Non-empty string means present | All sessions, telemetry only |
| `SSH_AUTH_SOCK` | <Undocumented /> | SSH agent socket. The agent proxy tests whether it is unset before it sets up git access. | Text. Non-empty string. Used with `GIT_SSH_COMMAND` in a check on the agent proxy git setup | Agent proxy (remote sessions) |
| `SSH_CLIENT` | <Undocumented /> | Marks an SSH session. Claude Code uses it to decide not to open a browser and for terminal detection. | Text. Non-empty string means SSH. One of `SSH_CONNECTION`, `SSH_TTY` or this on Windows | All sessions |
| `SSH_CONNECTION` | <Undocumented /> | Marks an SSH session. Claude Code treats the terminal as remote and skips opening a browser. | Text. Non-empty string. Sets the terminal `ssh` flag | All sessions |
| `SSH_TTY` | <Undocumented /> | Marks an SSH session. Used with `SSH_CONNECTION` and `SSH_CLIENT` in Windows terminal checks and in the no-browser check. | Text. Non-empty string means present. Also recorded as `hasSshTty` in the environment report | All sessions |
| `STY` | <Undocumented /> | GNU screen session id. Claude Code uses it to detect a `screen` multiplexer. | Text. Non-empty string. Sets the multiplexer to `screen` when `TMUX` is not set | All sessions |
| `SYSTEMROOT` | <Undocumented /> | Windows system directory. Claude Code uses it to find `powershell.exe` and other Windows tools. | Text. Non-empty string. Falls back to `SystemRoot`, then to `windir`, then to `C:\Windows` | Windows |
| `SystemRoot` | <Documented /> | Windows system directory in its usual mixed case. Claude Code reads it as a fallback and sets it in a clean git env. | Text. Non-empty string. On Windows a sanitized env sets it to `C:\Windows` | Windows |
| `TERM` | <Documented /> | Terminal type. Claude Code reads it to pick color level, key dialect, and terminal-feature support. | Text. Non-empty string. Names like `xterm-kitty` or `xterm-ghostty` raise the color level to 3 | All sessions |
| `TERM_PROGRAM` | <Documented /> | Terminal program name. Claude Code reads it to detect `vscode`, `iTerm.app`, `ghostty`, `tmux`, and others and tune features. | Text. Non-empty string. Used for color level, hyperlinks, clipboard and key support | All sessions |
| `TERM_PROGRAM_VERSION` | <Undocumented /> | Terminal program version. Claude Code reads the major version to pick a color level for `iTerm.app` and a hyperlink check for `tmux`. | Text. Non-empty string. For example iTerm2 major 3 or later gives true color | All sessions |
| `TERMINAL_EMULATOR` | <Undocumented /> | JetBrains sets it to `JetBrains-JediTerm`. Claude Code uses it to detect a JetBrains IDE terminal. | Compared to `JetBrains-JediTerm`. On non-macOS it sets the terminal name to `pycharm` | All sessions, JetBrains terminals |
| `TERMINATOR_UUID` | <Undocumented /> | Terminator terminal id. Claude Code records only whether it is set, as a telemetry flag. | Text. Non-empty string means present. No behavior change | All sessions, telemetry only |
| `TF_BUILD` | <Undocumented /> | Names Azure Pipelines for the terminal color level. | Presence test together with `AGENT_NAME`. Gives color level 1 in one helper and 4 in another | All sessions |
| `TILIX_ID` | <Undocumented /> | Tilix terminal id. Claude Code records only whether it is set, as a telemetry flag. | Text. Non-empty string means present. No behavior change | All sessions, telemetry only |
| `TMUX` | <Documented /> | Set by tmux. Claude Code uses it to detect tmux, to find the tmux socket, and to tune colors and features. | Text. Non-empty string. Also gives a true color step down, and blocks some terminal features inside tmux | All sessions |
| `TMUX_PANE` | <Undocumented /> | Set by tmux. Claude Code uses it to find the current pane when it runs tmux commands. | Text. Non-empty string. Needs `TMUX` as well | Tmux |
| `TRAVIS` | <Undocumented /> | Names Travis CI for the terminal color level. | Presence test, only when `CI` is set. Gives color level 1 | All sessions |
| `USER` | <Documented /> | Login name. Claude Code uses it as a fallback for the user name, for example in a browser bridge socket name. | Text. Non-empty string. Read when the OS user lookup fails, then `USERNAME`, then `default` | All sessions |
| `USERNAME` | <Undocumented /> | Windows user name. Claude Code uses it as a name fallback and to spot Windows container users. | Text. Non-empty string. `ContainerAdministrator` or `ContainerUser` turns off a registry sweep | Windows |
| `USERPROFILE` | <Documented /> | Windows home directory. Claude Code uses it to find Desktop, Documents, Downloads, and IDE lock files, and in WSL path mapping. | Text. Non-empty string. Used on Windows and WSL | Windows and WSL |
| `UV_THREADPOOL_SIZE` | <Undocumented /> | Node libuv thread pool size. Claude Code only prints it in MCP HTTP debug logs. | Text. Non-empty string. Shown as `default` when unset | MCP HTTP transport debug |
| `VERCEL` | <Undocumented /> | Vercel variable. Claude Code uses it to detect the `vercel` deployment environment for telemetry. | On or off. Truthy string | All sessions, telemetry only |
| `VSCODE_GIT_ASKPASS_MAIN` | <Undocumented /> | VS Code sets this path. Claude Code checks it to tell Cursor from VS Code and to find remote VS Code servers. | Text. Non-empty string. A path with `cursor` means Cursor | VS Code and Cursor terminals |
| `VTE_VERSION` | <Undocumented /> | VTE terminal version. Claude Code uses it for terminal bug workarounds and hyperlink support. | A number. A value under `5300` gets a workaround for unknown sequence printing. `4400` or more enables a feature | VTE terminals |
| `WAYLAND_DISPLAY` | <Undocumented /> | Wayland display name. Claude Code uses it to detect whether a local display exists, and to pick a clipboard tool. | Text. Non-empty string. With no `DISPLAY` and no `WAYLAND_DISPLAY` on Linux, it takes no browser or GUI path | Linux |
| `WEBSITE_SITE_NAME` | <Undocumented /> | Azure App Service variable. Claude Code uses it to detect the `azure-app-service` environment for telemetry. | Text. Non-empty string means present | All sessions, telemetry only |
| `WEBSITE_SKU` | <Undocumented /> | Azure App Service variable. Claude Code uses it to detect the `azure-app-service` environment for telemetry. | Text. Non-empty string means present | All sessions, telemetry only |
| `WEZTERM_PANE` | <Undocumented /> | WezTerm pane id. Claude Code uses it to exclude WezTerm when it detects a VTE-based terminal. | Text. Non-empty string. Used as a presence check only | All sessions |
| `WINDIR` | <Undocumented /> | Windows directory. Claude Code reads it once at load to build the `explorer.exe` path for a Windows app filter. | Lowercased with a trailing backslash. Also a fallback for `powershell.exe` path | Windows |
| `WSL_DISTRO_NAME` | <Undocumented /> | WSL distro name. Claude Code uses it to detect WSL and to match IDE workspace paths. | Text. Non-empty string. Either this or `WSL_INTEROP` on Linux sets the platform to `wsl` | WSL |
| `WSL_INTEROP` | <Undocumented /> | WSL interop socket. Claude Code uses it to detect WSL. | Text. Non-empty string. Either this or `WSL_DISTRO_NAME` on Linux sets the platform to `wsl` | WSL |
| `WT_SESSION` | <Undocumented /> | Windows Terminal session id. Claude Code uses it to detect Windows Terminal for key and link support. | Text. Non-empty string. Enables hyperlinks and some features | Windows Terminal |
| `XTERM_VERSION` | <Undocumented /> | Xterm version. Claude Code uses it to tell xterm from a VTE terminal and as a telemetry flag. | Text. Non-empty string. Presence check only | All sessions |
| `ZDOTDIR` | <Documented /> | Zsh config directory. Claude Code uses it to find the zsh rc files when it checks for a `claude` alias. | Text. Non-empty string. Falls back to the home dir | Zsh users |
| `ZED_TERM` | <Undocumented /> | Zed terminal marker. Claude Code uses it to detect the Zed terminal for hyperlink and feature support. | Text. Non-empty string. Presence check only | Zed terminal |
| `ZELLIJ` | <Undocumented /> | Zellij marker. Claude Code uses it to detect the `zellij` multiplexer. | Any value other than undefined. Turns off some terminal features | Zellij |

## How It Works

Many rows here are detection names. Claude Code checks whether a name is set to learn the terminal, CI service, or host. For example, `TRAVIS` or `GITLAB_CI` tell it that it runs in CI, which affects the terminal color level.
You rarely set these by hand. Set one only to fake or hide a detection result.

## Related Pages

- [Environment Variables](index.md): how Claude Code reads variables and which value wins.
- [Bundled Libraries](bundled-libraries.md)
- [Network and Proxy](network-and-proxy.md)
- [UI and Terminal](ui-and-terminal.md)
- [Undocumented Items](../../reference/undocumented.md): every item that only the program shows.

Source: the program (variable names found in the `2.1.310` binary) and the [Environment Variables](https://code.claude.com/docs/en/env-vars) page of the official docs.
