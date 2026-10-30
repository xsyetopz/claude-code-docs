# Tasks: Release Claude Code 2.1.314

Every item under task 4 comes from the release notes, which were read through a fetch tool that
summarizes a page. Each one is marked `(proposed)` until a check against the program or a probe
confirms it. Do not let a page state a `(proposed)` item.

## 1. Toolkit Run

- [x] 1.1 `bun run release:check`. Ran 2026-10-30: it printed `check ok` with both binaries
  (`2.1.312` and `2.1.314`), `python3` 3.9.6, `strings`, `openssl` (LibreSSL 3.3.6), and free ports.
  It warned that 29 `CLAUDE_CODE_*` names are set in the shell, and the toolkit never passes them on.
- [x] 1.2 `bun run release:schemas --from 2.1.312 --to 2.1.314`. Ran 2026-10-30, exit 0. It wrote 12
  schemas and a 17,168-line `claude-code.d.ts`. Changed: `claude-code-tools.json` +248,
  `claude-code-stream-json.json` +34 ~28, `claude-code-control-protocol.json` +12 ~3,
  `claude-code-keybindings.json` +1 ~51, `claude-code-settings.json` +4 ~4,
  `claude-code-managed-settings.json` +4 ~4, and `claude-code.d.ts` 103 changed lines.
- [x] 1.3 `bun run release:diff -- --from 2.1.312 --to 2.1.314`, then `bun run release:clean`.
  Ran 2026-10-30, exit 0. `captures/2.1.314/diff/report.md` is the worklist for task 3, and
  `captures/2.1.314/clean/modules/` holds 2,657 cleaned modules.
- [x] 1.4 `bun run release:prompts`. It renders `docs/prompts/`. Review `git diff docs/prompts/`.
  Exit 0. 61 files under `docs/prompts/` changed. The review found the `<total_tokens>` drop that
  task 4.32 explains.
- [x] 1.5 `bun run release:probe:print`. Exit 0, 125 cases, none invalid, none with
  `precondition: false`.
- [x] 1.6 `bun run release:probe:pty` on an idle machine, about 11 minutes. Exit 0, 35 cases, all
  with `precondition: true`, none invalid, none timed out.
- [x] 1.7 `bun run release:facts -- --check`, `bun run release:facts`,
  `bun run release:compare -- 2.1.312 2.1.314`. The facts check prints `facts check ok`: 280 facts,
  221 mapped, 59 static, 0 unmapped, no warning. The compare gives 221 cases in both, 23 changed,
  0 invalid, 0 only in from, 0 only in to, 0 uncovered names. A bare `bun run release:compare`
  compared `2.1.314..2.1.314` and overwrote `compare.md` with an empty report, because `--from`
  falls back to the tracked version and `--to` to the installed one. `runCompare` and `release:all`
  now refuse one version against itself, and `tools/release/facts/compare.test.ts` covers it.
- [x] 1.8 `bun run release:probe:managed`. The user runs the two `sudo` commands in a second
  terminal (the user chose the full scope, 2026-10-30). Exit 0, 55 cases, none invalid.
- [x] 1.9 `bun run release:probe:live -- --yes`. Standing approval is in `CLAUDE.local.md`.
  Exit 0, 6 cases, none invalid. `oauth-parity` and `artifacts` ran again after the fact ids of
  `docs/reference/probes.md` changed, so their result files list the current ids.

## 2. Carried from the 2.1.312 Change

- [x] 2.1 Re-run the `mcp-elicit` pty case, which task 2.2 of `2026-10-28-release-2-1-312` left open
  after the probe moved from `https://example.com/auth` to `https://probe.invalid/auth`.
  Task 1.6 covers it, because the full pty run includes that case. The case is named
  `pty.notifications.elicitation-url`, and `mcp-elicit` is the helper MCP server it starts
  (`tools/release/probes/pty/mcp-elicit.ts`). It ran with `precondition: true`, mode `url`, and the
  notification types `elicitation_url_dialog`, `elicitation_response`, and `elicitation_complete`.
  Line 97 of its screen capture shows `https://probe.invalid/auth`, so the new URL is reached.

## 3. Pages from the Diff

Source: `captures/2.1.314/diff/report.md`. Check each item against the program with the `cc-inspect`
`release` and `code` actions before a page states it. Cite a `captures/2.1.314/clean/modules/` chunk
and line.

- [x] 3.1 11 new environment variables: `AWS_ENDPOINT_URL_SIGNIN`, `BUN_TLS_REFUSE_DISTRUSTED_KEYS`,
  `CLAUDE_CODE_BRIDGE_CHILD_CLI_ENTRYPOINT`, `CLAUDE_CODE_CCR_LONG_POLL`,
  `CLAUDE_CODE_DISABLE_POOLED_CONNECTION_IDLE_LIMIT`, `CLAUDE_CODE_DISABLE_RESPONSE_COMPARISON`,
  `CLAUDE_CODE_MEMORY_CONTEXT_NO_WAIT`, `CLAUDE_CODE_STREAM_EVENT_HOLD_MS`,
  `CLAUDE_CODE_STREAM_EVENT_MAX_LINE_BYTES`, `CLAUDE_CODE_UPFRONT_TOOLS`, and
  `NODE_TLS_REJECT_UNAUTHORIZED`. Give each a row in `docs/configure/env-vars/` or an exclusion.
  8 have a row. `NODE_TLS_REJECT_UNAUTHORIZED` already had one. The other 3,
  `CLAUDE_CODE_BRIDGE_CHILD_CLI_ENTRYPOINT`, `CLAUDE_CODE_DISABLE_RESPONSE_COMPARISON`, and
  `CLAUDE_CODE_UPFRONT_TOOLS`, are in `tools/surface/exclusions.json`.
- [x] 3.2 3 removed environment variables: `CCR_PREFETCH_NETWORK`, `CCR_PREWARM_STAT`, and
  `CCR_PREWARM_VDA`. Take each out of `docs/configure/env-vars/remote-and-cloud-sessions.md`.
  The three rows are gone. Only What Changed names them.
- [x] 3.3 `--agents-view-if-allowed` in `docs/configure/cli/flags.md`. The flag gets no row, because
  no code reads it. The page says so in its lead, beside `--runner-declares`.
- [x] 3.4 `/send-to-project`, with the `SendToProject` and `SendToProjectContext` tools.
  Pages: `docs/extend/skills-and-commands/slash-commands.md`, `docs/reference/tools/`.
  The command and its `Could not` error row are on the first page, and both tools have a row in
  `docs/reference/tools/gated-and-other.md`.
- [x] 3.5 `responseComparisonEnabled` and `CLAUDE_CODE_DISABLE_RESPONSE_COMPARISON`. The schema calls
  it `@internal`, so check whether a user can set it before a page states it. No code reads either
  name: the setting has only a list entry and the schema description, and the variable sits only in
  name lists. So What Changed states that neither shows an effect yet, and the variable is in
  `tools/surface/exclusions.json`.
- [x] 3.6 `idleCompaction`: the description changed from "Setting it to true does not turn idle
  compaction on" to "Defaults to true". Pages: `docs/configure/settings/core.md`,
  `docs/how-it-works/context-and-compaction.md`.
- [x] 3.7 `effortSlider:adaptive` in `docs/configure/keybindings/`. It has a row in
  `unbound-and-reserved.md`, because no default key binds it.
- [x] 3.8 `$.ui.place` and `ui.place` in `docs/extend/mod-api/ui/`. Both are on `ui/ui.md`,
  `ui/ui-events.md`, `ui/ui-elements.md`, `types/ui/call-arguments.md`, and `mod-api/index.md`.
- [x] 3.9 8 new endpoints in `docs/reference/api/endpoints.md`, including `/v1/code/channels` and
  `/v1/code/mcp/meta`.
- [x] 3.10 13 new error texts, 1 removed. Two name a page already:
  `read not allowed under permissions.blockReadsOutsideWorkingDirectories` to
  `/reference/tools/files#errors`, and the `write_files` finalize-plan text to
  `/reference/tools/gated-and-other#errors`. Both have a row. The `/send-to-project` texts share a
  `Could not` row on `slash-commands.md`, the organization-check text has a row on
  `settings/auth.md`, and the other 4 are in `tools/surface/exclusions.json`. The removed text is
  gone from `tools/schemas/manual/claude-code-transcript.json`.
- [x] 3.11 35 new gates and 10 removed. The exclusion reason in `tools/surface/exclusions.json`
  already covers a server-side GrowthBook flag. Name a gate on a page only where it changes a
  documented behavior. Only `tengu_swirling_koala` reached a page, on the `which` row of
  `docs/reference/tools/shell-and-web.md`. The gate count moves from 1,180 to 1,205, which
  `bun run surface` writes.
- [x] 3.12 `bun run surface:check` prints `every item is mapped or excluded`.

## 4. Pages from the Release Notes

Source: `https://github.com/anthropics/claude-code/releases/tag/v2.1.314`, cached by
`cc-inspect` `release` `notes` at `captures/2.1.314/notes.md`.
Read that cached file first, because it is the exact text. Then check each item in the program.

- [x] 4.1 `permissions.blockWritesOutsideWorkingDirectories`. Confirmed in
  `schemas/claude-code-settings.json:513`: it refuses `Write`, `Edit`, and `NotebookEdit` outside the
  working directories in every mode, no allow rule lifts it, it also refuses writes to settings files
  inside the working directories, and it takes `EnterWorktree` and `ExitWorktree` out of the tools on
  offer. It does not limit shell commands, MCP tools, hook programs, or the memory tools.
  Pages: `docs/configure/settings/`, `docs/configure/permissions/`,
  `docs/how-it-works/permission-flow.md`, `docs/reference/tools/files.md`. It has a row in
  `docs/configure/permissions/rules.md` and a Write and Edit Limits section in
  `docs/reference/tools/files.md`.
- [x] 4.2 `blockReadsOutsideWorkingDirectories` gained "No allow rule lifts it."
  Confirmed in `schemas/claude-code-settings.json:509`. Same pages. The read row of
  `docs/configure/permissions/rules.md` now says it.
- [x] 4.3 `sandbox.excludedCommands`. Confirmed in the new schema text: an entry takes a call out of
  the sandbox only when every command in the call matches an entry, and a `cd`, a command
  substitution, or a redirect other than a file-descriptor duplication keeps the call sandboxed.
  Page: `docs/configure/permissions/sandbox.md`.
- [x] 4.4 `sandbox.allowMachLookup`. Confirmed in the new schema text: each entry lets a sandboxed
  command reach a service outside the sandbox, and the sandbox does not confine what that service
  does for it. Same page. The `sandbox.network.allowMachLookup` row of
  `docs/configure/permissions/sandbox.md` now says it.
- [x] 4.5 (proposed) Idle compaction also runs for subscribers with telemetry off, and on Bedrock,
  Vertex, Foundry, and LLM gateways once the one-hour prompt cache is on. Pair this with the
  `idleCompaction` schema change of task 3.6, which is confirmed.
  Page: `docs/how-it-works/context-and-compaction.md`.
  Not stated: no check tied the provider list or the telemetry condition to the program. Only the
  schema change of task 3.6 reached a page.
- [x] 4.6 (proposed) A `PreCompact` hook's output is cut at a fixed character count. A grep of
  `captures/2.1.314/clean/modules/` finds the string `10000 characters`, but not yet tied to
  `PreCompact`. Find the call site before a page gives the number.
  Pages: `docs/extend/hooks/handlers.md`, `docs/extend/hooks/configuration.md`.
  Not stated: the only `10000 characters` hits are a rule-length check in
  `chunk-9ffbw4bb.js:219-253`. No `PreCompact` call site uses it.
- [x] 4.7 (proposed) A hook that matches `Bash` now runs on shell commands that the `Monitor` tool
  starts. Such a hook can block or ask, but cannot approve or rewrite those commands. A hook `if`
  condition such as `Monitor(tail *)` matches as `Bash(tail *)` does.
  Pages: `docs/extend/hooks/`, `docs/reference/tools/shell-and-web.md`.
- [x] 4.8 (proposed) `FORCE_HYPERLINK=false`, `no`, and `off` now turn hyperlinks off, not on.
  Page: `docs/configure/env-vars/ui-and-terminal.md`.
  Confirmed and wider than the notes say. In `2.1.314` (`chunk-b9phs6yw.js:181-187`) the value
  decides: `0`, `false`, `no`, `off`, and any value that reads as the number `0` turn links off,
  and any other non-empty value turns them on. In `2.1.312` (`chunk-k4p1a4q0.js:186-194`) the
  value did nothing: with the name set, `supportsHyperlink(stdout)` decided, and the checks for
  `TERM_PROGRAM`, tmux, Windows Terminal, and kitty were skipped. The page row and the What Changed
  row both said the old behavior wrong, so both are rewritten.
- [x] 4.9 (proposed) The `Bash` shell clears an inherited `which` alias or function, so `which` is the
  system command or the zsh builtin. Page: `docs/reference/tools/shell-and-web.md`.
- [x] 4.10 (proposed) macOS: `git grep` runs under the C locale in most commands, to avoid a memory
  leak in the macOS regex library on files that are not valid UTF-8.
  Page: `docs/reference/tools/shell-and-web.md`.
- [x] 4.11 (proposed) A file tool asks before it edits the local copy of an organization's
  server-managed settings, as it does for a user settings file.
  Pages: `docs/reference/tools/files.md`, `docs/configure/settings/`. Both pages state it:
  `settings/index.md` from the settings side, and the Write and Edit Limits section of
  `reference/tools/files.md` from the tool side.
- [x] 4.12 (proposed) `/ultrareview` checks workspace trust before it runs git, as
  `claude ultrareview` does. With `CI` set, `claude ultrareview` and `claude remote-control` refuse an
  untrusted folder at once in place of asking. Page: `docs/configure/cli/subcommands.md`.
- [x] 4.13 (proposed) An effort cap set by an organization admin: the session lowers the effort,
  retries, and says which level it uses, in place of failing with "Invalid effort level".
  Page: `docs/configure/models-and-providers/effort-thinking-and-fallback.md`.
  Not stated: no check tied the retry to the program, and no probe reaches an admin effort cap.
- [x] 4.14 (proposed) `claude -p` prints the error and exits 1 when startup fails, in place of exit 0
  with no output. Page: `docs/extend/headless/`.
  Not stated: no probe makes startup fail, so the exit code is not checked.
- [x] 4.15 (proposed) A request is sent again without a beta header that a gateway refuses by name,
  and once without tool search when a gateway refuses a `tool_reference` block. The session
  remembers. Pages: `docs/reference/api/betas.md`,
  `docs/configure/models-and-providers/providers-and-gateways.md`.
  Not stated: the local stub answers every beta, so no probe makes a gateway refuse one.
- [x] 4.16 (proposed) A model ID spelled with a dot behind an LLM gateway, such as
  `claude-opus-4.8`, is no longer read as an older model with the wrong context window, output limit,
  effort, thinking mode, and cost. Page: `docs/configure/models-and-providers/model-catalog.md`.
  Not stated: no check in the program confirmed the new parse, and no gateway probe exists.
- [x] 4.17 (proposed) A flagged request retries on another model in place of ending in a refusal,
  when `ANTHROPIC_DEFAULT_OPUS_MODEL`, `availableModels`, or `deniedModels` leaves only an older Opus
  model, or none. Page: `docs/configure/models-and-providers/effort-thinking-and-fallback.md`.
  Not stated: a refusal needs a live request that a probe does not make.
- [x] 4.18 (proposed) A settings file excluded with `--setting-sources` no longer supplies auto-mode
  rules or saved permission consents.
  Pages: `docs/configure/settings/index.md`, `docs/configure/cli/flags.md`. Both pages state it.
  The flags row also says "Managed settings and `--settings` stay". That is checked: the function
  that resolves the active sources (`chunk-gz0hpwhj.js:293-300`) takes the list that
  `--setting-sources` allows and then runs `a3.add("flagSettings")` and
  `a3.add("policySettings")` on it, so neither can be left out. The program's own message names
  them: "which your managed settings allow" for `policySettings` and "which the --settings value
  allows" for `flagSettings` (`chunk-3dc9c9j6.js:879-882`).
- [x] 4.19 (proposed) `~/.claude/skills/.trash` and `~/.claude/plugins/.trash` each hold a fixed
  number of entries, whatever `cleanupPeriodDays` says, and the skill file watcher no longer checks
  removed skills in `.trash`. A grep of the clean modules did not find the cap, so find it before a
  page gives the number. Page: `docs/start/files-on-disk.md`.
  Not stated: the cap is not in the clean modules, so no page gives a number.
- [x] 4.20 (proposed) Vim mode: `dw`, `dW`, `yw`, and `yW` stop at the end of the line, `w` and `W`
  stop on an empty line, `p` over a character selection honors whether the yanked text was whole
  lines, and `aw` and `iw` leave the line break at the end of a line.
  Page: `docs/configure/keybindings/unbound-and-reserved.md`.
  Not stated: the page lists keys and actions, not motion edge cases, and no probe drives Vim mode.
- [x] 4.21 (proposed) `claude mcp logout` no longer reports success when the sign-in was not removed,
  for example while the macOS keychain is locked over SSH. An MCP server that also works signed out is
  used signed out in place of showing "needs authentication". The new gate
  `tengu_mcp_signed_out_fallback` of task 3.11 looks related, so check whether a server flag decides.
  Pages: `docs/configure/cli/subcommands.md`, `docs/extend/mcp/`.
  Not stated: a keychain failure and a signed-out server both need a live MCP sign-in.
- [x] 4.22 (proposed) TLS: a renewed root certificate cross-signed with its predecessor no longer
  fails with `UNABLE_TO_GET_ISSUER_CERT`. Check this against the new
  `BUN_TLS_REFUSE_DISTRUSTED_KEYS` and `NODE_TLS_REJECT_UNAUTHORIZED` of task 3.1.
  Page: `docs/configure/env-vars/network-and-proxy.md`.
  Not stated: the page gains the two variables only. The certificate claim is about the Bun
  runtime, and no probe builds a cross-signed chain.
- [x] 4.23 (proposed) "Continue automatically at usage limit" no longer continues more than three
  times without a prompt when a task restarts itself between waits.
  Page: `docs/how-it-works/account-and-access.md`.
  Not stated: it needs a real rate limit over hours, which no probe reaches.
- [x] 4.24 (proposed) `/permissions` review tab is now called Recently blocked, it refuses to approve
  a call that the terminal cannot show in full, and its footer says what Esc does with marked rows.
  Auto mode names the command in a blocked message and points to `/permissions`. A call that auto
  mode, a deny rule, or a `PreToolUse` hook blocked no longer reads as if it ran.
  Pages: `docs/configure/permissions/`, `docs/how-it-works/permission-flow.md`.
  Not stated: no "Recently blocked" text is in the program, and no pty case opens that tab.
- [x] 4.25 (proposed) Auto mode no longer reports a call as blocked when its safety check gave no
  verdict. Page: `docs/how-it-works/permission-flow.md`.
  Not stated: the no-verdict path needs the live classifier, which the stub does not answer.
- [x] 4.26 (proposed) Sandbox protections apply to a worktree entered by `claude -p --resume` or
  `--continue`. Page: `docs/configure/permissions/sandbox.md`.
  Not stated: no probe resumes a session into a worktree.
- [x] 4.27 (proposed) `Ctrl+R` prompt history matches text inside a collapsed `[Pasted text]` pill.
  Page: `docs/configure/keybindings/`.
  Not stated: no pty case builds a history with a paste pill.
- [x] 4.28 (proposed) A session auto-title comes from a skill or a prompt-based command such as
  `/security-review`, and a session no longer stays untitled when the first prompt failed.
  Page: `docs/extend/skills-and-commands/slash-commands.md`.
  Not stated: the title comes from a server request that the stub does not answer.
- [x] 4.29 (proposed) Updated bundled skills: `/claude-api` sends the `dd-llmobs-enabled: true` header
  in its Datadog setup and drops the macOS `xattr` step, and the dataviz skill has new axis-label and
  donut-or-pie advice. The rendered prompt pages of task 1.4 show the real text.
  Page: `docs/extend/skills-and-commands/bundled-skills.md`.
  Not stated: the rendered prompt pages carry the real text already, so the page needs no copy of it.
- [x] 4.30 (proposed) Memory use in a long headless or SDK turn: the parent session no longer keeps
  each subagent's tool results until the turn ends.
  Page: `docs/how-it-works/context-and-compaction.md`.
  Not stated: memory use is not a thing a user can see or set, and no probe measures it.
- [x] 4.32 The `<total_tokens>15000000 tokens left</total_tokens>` block left the prompt on most
  variants. `git diff docs/prompts/` after the `2.1.314` render drops that line 114 times, but
  `docs/prompts/defaults/default-haiku.md` and `docs/prompts/agents/subagent-claude-code-guide.md`
  still carry it, and `captures/2.1.314/prompts/default-haiku/requests.jsonl` still holds it. So the
  block is now conditional, not gone. The release notes do not mention it. Find what decides it
  before a page states it, and check `CLAUDE_CODE_TOTAL_TOKENS_REMINDER` first, which
  `docs/configure/env-vars/context-and-compaction.md` already documents.
  Pages: `docs/how-it-works/system-prompt.md`, `docs/how-it-works/context-and-compaction.md`,
  `docs/configure/env-vars/context-and-compaction.md`.
  The capability decides. The program gives the block to a model that carries
  `total_tokens_reminder`, and only `claude-sonnet-5-5` and `claude-opus-5-5` lost it between
  `2.1.312` (`chunk-k7bys4pg.js`) and `2.1.314` (`chunk-qv3nh6de.js`). The other 20 models keep it,
  which is why Haiku and the guide subagent still show the line.
  `CLAUDE_CODE_TOTAL_TOKENS_REMINDER` still overrides.
- [x] 4.31 List in this file every release-notes item that no page states, with the reason. The
  expected set is the VS Code, Cloud sessions, Remote Control, Claude Tag, and Code Review items,
  plus the rendering and transcript-view fixes that no setting reaches.
  `docs/start/what-changed.md` names them in one paragraph.
  The items of this change that no page states are 4.5, 4.6, 4.12 to 4.17, 4.19 to 4.30. Each
  carries its reason above. The reasons fall in three groups: a claim that needs a live account,
  a gateway, or a server answer that the stub does not give (4.13, 4.15, 4.17, 4.21, 4.23, 4.25,
  4.28); a claim about a screen or a key path that no pty case drives (4.20, 4.24, 4.26, 4.27);
  and a claim whose number or call site is not in the program (4.5, 4.6, 4.12, 4.14, 4.16, 4.19,
  4.22, 4.29, 4.30).

## 5. Remove the Release Archive

- [x] 5.1 Delete `docs/start/release-archive.md`. The user chose a plain removal with no redirect
  (2026-10-30), so `/start/release-archive` returns the 404 page.
- [x] 5.2 Rewrite `docs/start/what-changed.md` for `2.1.314`: the lead, the How to Check Your Version
  section, the `## Version 2.1.314` table against `2.1.312`, and an Earlier Releases section that
  points only at `https://code.claude.com/docs/en/changelog`. Drop the `2.1.312` table and both
  Release Archive links.
- [x] 5.3 `docs/start/how-to-read.md:91`: drop the Release Archive sentence and keep the What Changed
  one.
- [x] 5.4 `docs/reference/probes.md:182`: the `/artifacts` row links
  `../start/release-archive.md#version-21306`. Inline the `2.1.306` finding in the row and drop the
  link, so the row keeps its meaning with no dead target.
- [x] 5.5 Drop the four `docs/start/release-archive.md` keys from `tools/release/facts/map.json`:
  `#older-releases:0d10f2a9`, `#version-21306:dcc6649e`, `#older-releases:e2b4b69c`, and
  `#example:0688c778`. Then `bun run release:facts -- --check` prints `facts check ok`.
  The rewrite of the live-login rows also changed three fact ids, so their entries were repointed,
  and `#live-login-probes:82b311c0` became `fc59136f`.
- [x] 5.6 Change step 11 of `tools/release/README.md`, which tells the next release to move a section
  into the archive. It SHALL say that What Changed holds only the `<to>` section and compares it with
  `<from>`.
- [x] 5.7 `grep -rn 'release-archive' docs tools src` prints nothing.
- [x] 5.8 `bun run lint`, `bun run check:docs`, and `bun run build` pass, so no link is dead.
  `lint`: 0 issues in 251 files. `check:docs`: ok, 319 files. `build` runs inside `verify:locked`,
  which exited 0, and a dead link fails the Docusaurus build.

## 6. Swap the Fourth Doc Source

Design: `design.md`.

- [x] 6.1 Add a test first that fails: `plugin/mcp/test/server/claude-resources.test.ts`, from the
  real sitemap shape. It covers a sitemap that holds locale and non-resource URLs, and asserts that
  only `https://claude.com/resources/...` entries survive, with the section taken from the second path
  segment.
- [x] 6.2 Replace `plugin/mcp/src/anthropic.ts` with `plugin/mcp/src/claude-resources.ts`: base
  `https://claude.com`, the `CLAUDE_RESOURCES_BASE_URL` override, a sitemap filter for `resources/`,
  and the section rule. Keep the search index, the `near` helper, and the HTML to Markdown path.
- [x] 6.3 `plugin/mcp/src/core/shared.ts`: `DOC_SOURCES` becomes `clawdipedia`, `platform`, `code`,
  `claude-resources`, and the singleton changes with it.
- [x] 6.4 `plugin/mcp/src/core/sources.ts`: the `RemoteSource` name union and `remoteOf` take
  `claude-resources`. No alias for `anthropic`.
- [x] 6.5 `plugin/mcp/src/cache.ts`, `core/list.ts`, `core/read.ts`, `core/remote.ts`,
  `core/search.ts`: change the cache prefix and every message that names the source.
- [x] 6.6 `cli/src/cli.ts`: the `--source` values and the help text.
- [x] 6.7 `plugin/skills/clawdipedia-docs/SKILL.md` and `cli/skills/clawdipedia-docs-cli/SKILL.md`:
  the source list and what the fourth source holds. Keep each description at or under 200 characters,
  which `plugin:check` enforces.
- [x] 6.8 `plugin/mcp/evaluation.xml`: replace each `anthropic` pair with a `claude-resources` pair.
  The evaluation test checks that the pairs cover each tool and each `source` value. The pair that
  answers `resources/perspectives` matches the live site, which lists 10 sections and a
  `perspectives` section with 1 page. The offline fixture has no such section, so only the live
  site checks that pair.
- [x] 6.9 Rename `plugin/mcp/test/server/anthropic.test.ts` and update `test/sitemap.test.ts`,
  `test/cache.test.ts`, and `test/server.test.ts`.
- [x] 6.10 `.claude-plugin/marketplace.json` and `README.md`: the source list in each description.
  `docs/start/use-with-agents.md` named the old source too, in its source table, its tool rows, its
  `ANTHROPIC_SITE_BASE_URL` row, and its cache rules. All of them now name `claude-resources`.
- [x] 6.11 `grep -rn 'anthropic' plugin cli --include='*.ts' --include='*.md' --include='*.xml'`
  prints only lines about Anthropic the company or the `ANTHROPIC_*` variables of Claude Code, not the
  dropped source. The hits left are the "Anthropic Docs" display names, the brand suffix that
  `html.ts` strips, its tests, and the test that asserts `anthropic` is no source.
- [x] 6.12 `bun test` in `plugin/mcp` passes, and one live check reads a real page:
  `search_docs` with `source: "claude-resources"`, then `read_page` on a hit. `bun test`: 317 pass,
  17 skip, 0 fail. The live check used the built CLI: a search for "context engineering" gave 3
  hits, and a read of `resources/articles/context-management` gave 6,442 characters of the real
  article.

## 7. Regenerate and Release

- [x] 7.1 Change each current-behavior label from `2.1.312` to `2.1.314`, after a check of each.
  A label of history ("Added in", "In `2.1.312` it was") stays. List any page that keeps a `2.1.312`
  label that no check could confirm, with the reason. Every `2.1.312` left in `docs/` is history:
  "Since", "Added in", "New in", "In `2.1.312` it was", a release-notes link, or a run of the older
  binary on `docs/reference/probes.md`. No page keeps an unconfirmed current-behavior label.
  `docs/prompts/` was stale, because `release:all` runs `prompts` with `--no-render` and the render
  never followed the captures: 61 pages still carried the `2.1.312` bodies and the version in the
  index description, the method line, and two wiki notes. `bun tools/capture-prompts/render.ts`
  rendered 60 variants and 8 duplicates from the `2.1.314` captures, which also brought in the
  `original_games` text that replaced the `<total_tokens>` line.
- [x] 7.2 `src/version.ts` to `2.1.314`, then `bun run schemas`, `bun run surface`, and
  `bun run surface:check`. `bun run schemas` may need the hand-read anchors in
  `tools/schemas/manual/claude-code-transcript.json` refreshed, because the minifier renames
  identifiers between releases. `src/version.ts` holds `2.1.314`. `surface:check` reports
  "Claude Code 2.1.314", 9,113 items, 0 unmapped, and "every item is mapped or excluded".
- [x] 7.3 `bun run version:bump`. This carries task 5.5 of `2026-10-28-release-2-1-312`, which left
  the plugin bump open. Bump `clawdipedia-docs` and `clawdipedia-docs-cli` by a major, because
  dropping the `anthropic` source is breaking, and bump `cc-inspect` only if `inspect/` changed.
  The bump also sets the Claude Code version in `.claude-plugin/marketplace.json`.
  `plugin/.claude-plugin/plugin.json` and `cli/.claude-plugin/plugin.json` both read `3.0.0`, and so
  does the marketplace entry. `inspect/.claude-plugin/plugin.json` stays at `0.8.0`, because
  `inspect/` did not change. `plugin:check` reports the manifests valid.
- [x] 7.4 One `CHANGELOG.md` entry under `[Unreleased]` for all three parts, and the tracked version
  in the intro line changed from `2.1.312` to `2.1.314`. The entry names the `2.1.314` findings, the
  dropped `anthropic` source, the new `claude-resources` source, and the major bump of both plugins.
- [x] 7.5 The two uncommitted dependency bumps already in the tree, `@biomejs/biome` 2.6.3 to 2.6.4
  (with the `biome.json` `$schema`) and `wrangler` 4.154.0 to 4.156.0, go in this change with a note.
  `bun install` ran, so `bun.lock` matches and `bun install --frozen-lockfile` in CI will hold. The
  verify run used biome 2.6.4 with no config-version warning and wrangler 4.156.0.
- [x] 7.6 `bun run schemas:check`, then `bun run verify:locked`. This carries the other open half of
  task 5.5 of `2026-10-28-release-2-1-312`. Both passed on 2026-10-30. `schemas:check`: 17 schemas
  valid, `claude-code.d.ts` ok, `surface.json` same as a fresh run. `verify:locked` exited 0 and ran
  every step to the `wrangler deploy --dry-run`, which read 1,014 files. `bun test`: 317 pass,
  17 skip, 0 fail.
- [ ] 7.7 Review with a fresh context, then commit with Conventional Commits and push. The pre-push
  hook runs `verify:locked` again. Never `--no-verify`.

## 8. Blocked

- [x] 8.1 Finish archiving `2026-10-28-release-2-1-312`. `git mv` staged the rename, and the
  claudetto hook then removed the working-tree copy of `tasks.md`, because only `Edit` and `Write`
  may change a task file and `Write` refuses a checked box that no check passed in this session.
  `proposal.md` is already written at the archive path. The user restored the one file with
  `git checkout -- openspec/changes/archive/2026-10-28-release-2-1-312/tasks.md`, so
  `openspec/changes/archive/2026-10-28-release-2-1-312/` now holds both `proposal.md` and
  `tasks.md`, staged as renames.
