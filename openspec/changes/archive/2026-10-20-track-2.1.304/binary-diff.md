# Claude Code 2.1.303 -> 2.1.304: static binary diff

Method: `strings -n 6` of both binaries in `~/.local/share/claude/versions/`, then set diffs of env names, CLI
`.option()` help text, `tengu_*` gates, zod `.describe()` keys, and quoted string snippets. Both embed Bun v1.4.4,
so the runtime did not change. Binary size went from 267,973,136 to 271,161,296 bytes. Nothing was run.
Counts like "303:0 304:N" are occurrences in the strings dump.

## Env Vars: New in 304 (absent from 303)
| Name | Evidence (304) | Docs today |
|---|---|---|
| `CLAUDE_CODE_DISABLE_MOUNTED_DRIVE_RM_PROMPT` | `!a.CLAUDE_CODE_DISABLE_MOUNTED_DRIVE_RM_PROMPT&&e==="rm"...` -> "This command would remove a mounted drive, the folder that holds mounted drives, or a file or folder at the top level of a drive. This requires explicit approval and cannot be auto-allowed by permission rules." | none; add to configure/env-vars/tools-and-bash.md (+ how-it-works/permission-flow.md) |
| `CLAUDE_CODE_SKIP_PLUGIN_LOCAL_MCP_SERVERS` | "only sse, http and ws servers load while CLAUDE_CODE_SKIP_PLUGIN_LOCAL_MCP_SERVERS is set" | none; siblings in configure/env-vars/plugins-and-mcp.md, extend/plugins/loading.md, extend/mcp/env.md |
| `CLAUDE_CODE_SKIP_PLUGIN_MCP_BUNDLES` | `Skipping MCPB source "..." of plugin "..." (CLAUDE_CODE_SKIP_PLUGIN_LOCAL_MCP_SERVERS or CLAUDE_CODE_SKIP_PLUGIN_MCP_BUNDLES is set)` | none; same pages as above |
| `CLAUDE_CODE_WARN_DISK_FREE_GIB`, `CLAUDE_CODE_WARN_MEMORY_FREE_GIB` | `{diskLowGib:a.CLAUDE_CODE_WARN_DISK_FREE_GIB??0,memoryLowGib:a.CLAUDE_CODE_WARN_MEMORY_FREE_GIB??0}`; forwarded in the remote env list; gates `tengu_memory_low`, `tengu_memory_drain` | none; likely remote/cloud only -> configure/env-vars/remote-and-cloud-sessions.md or reference/undocumented.md |
| `CLAUDE_CODE_ATTRIBUTION_PROJECT` | in the list of forwarded vars next to `CLAUDE_CODE_ALLOW_OTHER_MODELS` and `CLAUDE_CODE_REMOVE_PROMPT_STRINGS` | none; internal/remote, so reference/undocumented.md |
| `CLAUDE_CODE_MCP_SERVE_ENABLED_PLUGINS` | `CLAUDE_CODE_MCP_SERVE_AUTH_TOKEN:void 0,CLAUDE_CODE_MCP_SERVE_ENABLED_PLUGINS:void 0` (cleared for children) | sibling `MCP_SERVE_AUTH_TOKEN` is in configure/env-vars/plugins-and-mcp.md |
| `CLAUDE_CODE_SDK_READS_STARTUP_MARKS` | "for startup() and prewarm() of the Agent SDK, which set CLAUDE_CODE_SDK_READS_STARTUP_MARKS, the CLI writes lines of this type with a `startup_mark` field" | none; extend/headless/stream-json.md or control-protocol.md |
| `CLAUDE_CODE_AUTO_MODE_REMOTE_BROWSER` | `!(nr.CLAUDE_CODE_AUTO_MODE_REMOTE_BROWSER??Xpr())` | internal; undocumented.md at most |
| `CLAUDE_CODE_PERSONAL_CONFIG_FIX` | passed into tmux and child env with `CLAUDE_CODE_RESTRICT_PERSONAL_CONFIG` | internal |
| `CLAUDE_CODE_BRIDGE_CHILD_PROJECTS_ENTRYPOINT` | `a.CLAUDE_CODE_BRIDGE_CHILD_PROJECTS_ENTRYPOINT===!0;...a.unset(...)` | internal (bridge) |
| `MCP_ROW_TOOL_NAMES` | `t.wire.MCP_ROW_TOOL_NAMES` (artifacts MCP wire constant, not an env var) | skip |
| `${CLAUDE_TEST_SANDBOX}`, `${CLAUDE_TEST_USER_SETTINGS}` | plugin-eval placeholders: `var Dt="${CLAUDE_TEST_SANDBOX}",Ft="${CLAUDE_TEST_USER_SETTINGS}"` | plugin eval page if one exists |
No env var was removed. The other env diff lines were trailing-byte noise; all of those names are still present.

Changed handling:
- `CLAUDE_CODE_AUTO_COMPACT_WINDOW` (303:16, 304:20): adds a warning path `autoCompactWindowEnvWarning`, a
  headless warning key `auto-compact-window-env`, and "...set CLAUDE_CODE_AUTO_COMPACT_WINDOW=${h} (or the
  autoCompactWindow setting)". The release note says it now takes `k`/`M` suffixes. Docs at
  configure/env-vars/context-and-compaction.md:34 say "Invalid values are ignored", which is now stale.
  Also check how-it-works/context-and-compaction.md.

## CLI Flags (`claude --help` Text)
No `claude` flag was added or removed. New `--` strings (`--disable-userns`, `--environment-id`, `--vault-id`,
`--transform`, `--minimum-release-age`) come from bwrap, the bundled `ant` CLI check, and bunx.
Help text changed (release note "Fixed claude --help text..."):
- `--tools`: "default" to use all tools -> "default" to use the default set
- `-r, --resume`: "by session ID" -> "by session ID or name"
- `-d, --debug`: example `"api,hooks" or "!1p,!file"` -> `--debug=hooks,mcp or --debug='!hooks,!mcp'`
- `--json-schema`: adds "(only works with --print)"
- `--disable-slash-commands`: "Disable all skills" -> "Disable all skills and commands"
- `claude update`: adds "; package-manager installs update through the package manager"
- `--system-prompt-snapshot`: no help-string diff found (it may be built differently)
Pages: configure/cli/flags.md, configure/cli/subcommands.md (update), extend/skills-and-commands/index.md.

## Slash Commands and Skills
- `/claude-api managed-agents-secure` (NEW, 303:0, 304:23): bundled `shared/managed-agents-secure.md` and
  `/$bunfs/root/managed-agents-secure-963b6c01.md.zst`; when its check can't run it says "The `managed-agents-secure`
  command is unavailable in this session: Claude Code's check on its `ant` commands does not run here". New gate
  `tengu_claude_api_ant_command_refused`. Pages: extend/skills-and-commands/bundled-skills.md (claude-api entry),
  reference/api/betas.md.
- `/auto-mode-setup`: already in 303 (hidden via a `WSo=new Set(["auto-mode-setup"])` override). 304 has
  `VVe={type:"local",name:"auto-mode-setup",supportsNonInteractive:!0,description:"Teach auto mode about your
  environment, plus optional rule tweaks"}`, enabled by `mie()` (env onboarding + `skillOverrides["auto-mode-setup"]!=="off"`).
  Release note: now on Bedrock/Vertex/Foundry/gateway/telemetry-off. Pages: extend/skills-and-commands/slash-commands.md,
  configure/permissions/auto-mode.md.
- `/artifacts` (delete: numbered 1/2), `/usage` (rate-limit end text), `/effort` (auto/unset), `/loop` (1h wakeup),
  `/privacy-settings`: behavior fixes only, no new names. Page: extend/skills-and-commands/slash-commands.md.
- No command was removed (the `/binding` hit is a Bun internal path).

## Settings Keys
- No top-level settings key added or removed.
- Sandbox runtime (SRT) config schema gains `allowNestedUserNamespaces` ("Let the sandboxed command create user
  namespaces of its own (Linux only)..."), `network.allowPlaintextHeaderSet`, `network.refuseOpaqueTunnels`,
  `network.requireHostMatch`, `network.ambiguousRequestTarget`, `network.tlsTerminate.maxTunnels` (default 256),
  and `network.tlsTerminate.handshakeTimeoutMs` (default 10000). These are read from the SRT config (`Le?.network.*`), and
  `filterRequest` (a sibling) is not in schemas/claude-code-settings.json today, so they may not be user settings.
  Run `bun run schemas` to confirm. Page: configure/permissions/sandbox.md (it already covers `tlsTerminate`).
- `cleanupPeriodDays`: a mod's `settings.read` can now cap it ("Retention cleanup: the settings.read hooks were not asked within ...").

## Hook Events and Tool Names
No hook event names and no built-in tool names were added or removed (regex set diff came back empty).

## Mod API Surface
- `tool.check` answer `decider: "person"` (NEW value next to `host`): `e.decision==="ask"&&e.decider==="person"` -> if
  mode is dontAsk / avoid-prompts / headless, then `{...e,decision:"deny"}`; else `personOnly:!0,suppressAlwaysAllowRule:!0`.
  Doc: extend/mod-api/types/tool-command-config.md:273 lists only `host`, so it needs updating. Also extend/mod-api/tool-command-config.md, hooks.md.
- `tool.check` event `e.isReadOnly` (NEW): `z=e.isReadOnly(ne)` passed as `readOnly:z`. The docs list `isReadOnly` only on
  the tool.call result (types/tool-command-config.md:234-239). Add it to the tool.check event type.
- `settings.read` hook now gets `layers` (`o.layers.flatMap((a)=>Object.entries(a.settings))`, "a changed source
  (pinned: the layers are that read's)", "an answer without X: unset for the reader") and rewrites the merged value.
  Docs: extend/mod-api/clock-http-process-env-settings.md:40,55, extend/mod-api/types/infra.md.
- Hook skipped by an earlier plugin: `` `its ${e} hook was skipped. "${n}" runs first and sent the event on past it.` ``
  (NEW transcript line). Page: extend/mod-api/hooks.md.
- Mod reload, session-written-mod question, and button-`key` fixes: text only. Pages: extend/mod-api/plugin.md,
  ui-elements.md, ui-events.md.

## Feature Gates (`tengu_*`)
Added: amber_quillwort, amber_redwood, bridge_owner_check_attributed/_attribution, bridge_owner_veto_after_dead_pointer,
ccr_memory_watchdog, cedar_ember_give_back, claude_api_ant_command_refused, composed_treehouse, gentle_grove,
harp_forepillar, harp_pedal, humble_flurry, hushed_plover, jiggly_blossom, mcp_serve_background_records_read,
memory_drain, memory_low, org_config_gate, org_survey_event, recursive_puddle, remote_model_kept_rows_pick,
remote_reported_cwd, request_user_dialog_left_up, skill_hooks_bounds_checked, starry_waterfall(+_asked/_shown/_wall),
steady_metcalfe, steady_mitten, steady_puppy, thistle_orrery, velvet_harrow, wary_ladle, workflow_agent_stall_retries.
Removed: auto_mode_availability_changed, cowork_cloud_launch_credential, mcp_skills, mcp_skills_funnel, quirky_kazoo,
violin_guarneri, zany_pike, copper_kestrel, plugin_folder_shadowed, mcp_normalize_root_combinators.
(Codenamed gates are opaque; `starry_waterfall_*` could be the new resume-cost warning, but that is not proven.) Docs only need these if
reference/undocumented.md lists gates.

## Release Notes -> Evidence
| Note | Evidence |
|---|---|
| mod hook skipped transcript line | `its ${e} hook was skipped. "..." runs first...` |
| `decider: "person"` | `e.decider==="person"` (304:2, 303:0) |
| `e.isReadOnly` on tool.check | `readOnly:z` from `e.isReadOnly(ne)` |
| `/auto-mode-setup` | new command object + `mie()` gate |
| `/claude-api managed-agents-secure` | 23 new strings, embedded md |
| Resume warning (Pro/Max) | "New conversation. Claude can look up the previous conversation..." already in 303, so this is a gating change only |
| rm -r mounted drive | new message + `CLAUDE_CODE_DISABLE_MOUNTED_DRIVE_RM_PROMPT` (undocumented escape hatch) |
| AUTO_COMPACT_WINDOW k/M | `autoCompactWindowEnvWarning`, `auto-compact-window-env` |
| --help fixes | see the CLI section |
| settings.read layers | `layers` restore/check code |
| cloud: plugin stdio MCP not awaited unless `alwaysLoad` | `alwaysLoadCount` + new SKIP_PLUGIN_LOCAL_MCP_SERVERS (304:62 vs 61) |
| tool search on behind custom base URL | "tool search" 39->48 strings; no specific snippet isolated |
| context_management retry, Remote Control, OTel, Windows git, etc. | no distinctive user-facing strings; not documentable beyond the changelog |

## Pages Likely Touched
- configure/env-vars/{tools-and-bash,plugins-and-mcp,context-and-compaction,remote-and-cloud-sessions}.md
- configure/cli/flags.md, configure/cli/subcommands.md
- extend/mod-api/types/tool-command-config.md, extend/mod-api/{tool-command-config,hooks,clock-http-process-env-settings}.md, types/infra.md
- extend/skills-and-commands/{bundled-skills,slash-commands}.md, configure/permissions/{auto-mode,sandbox}.md
- extend/plugins/loading.md, extend/mcp/env.md, how-it-works/permission-flow.md, reference/undocumented.md
- 65 pages mention `2.1.303` (version stamps)
