# Tasks: Release Claude Code 2.1.312

## 1. Toolkit Run

- [x] 1.1 `bun run release:check`. It printed `check ok`: both binaries, `python3` 3.9.6, `strings`,
  `openssl` (LibreSSL 3.3.6), and the free ports.
  It warned that 29 `CLAUDE_CODE_*` names are set in the shell, and the toolkit never passes them on.
- [ ] 1.2 `bun run release:all` from `2.1.311` to `2.1.312`. The static half is done:
  `captures/2.1.312/clean/modules/` and `captures/2.1.312/diff/report.md` exist, and
  `bun run release:prompts` rendered `docs/prompts/`. The probe half waits for 1.3 and 1.4.
- [ ] 1.3 `bun run release:probe:managed`. The user runs the two `sudo` commands.
- [ ] 1.4 `bun run release:probe:live -- --yes`. The user gave standing approval in `CLAUDE.local.md`.

## 2. Probe Defect: `example.com` in the Elicitation Probe

`tools/release/probes/pty/mcp-elicit.ts:65` sends `url: "https://example.com/auth"` to the program in a
URL-mode MCP elicitation. [IANA](https://www.iana.org/help/example-domains) states that `example.com`
"is not a service" and that you must "avoid relying on it for testing and monitoring purposes"
(the user, 2026-10-28). A probe must not depend on a third-party host, and the program could resolve or
open the URL.

- [x] 2.1 Change the URL to `https://probe.invalid/auth`. [RFC 2606 section 2](https://www.rfc-editor.org/rfc/rfc2606#section-2)
  reserves `.invalid` for a name that can never resolve, so the probe stays on the machine.
  `inspect/mcp/src/surface/endpoint.ts:10` already treats `.invalid` as a placeholder.
  Done at `tools/release/probes/pty/mcp-elicit.ts:67`.
- [ ] 2.2 Re-run only that case, after the current pty run ends.
- [x] 2.3 Add the rule to `docs/contributing/style-guide.md`: use `example.com` in a documentation
  example, and a `.invalid` name in a test or a probe.

Left as they are, with the reason:

- `tools/capture-prompts/capture.ts:66` and `:68`, and `tools/release/probes/print/run.ts:107` and
  `:109`, set `t@example.com` as the git author and committer email. Git never resolves an email
  address, so no request leaves the machine. Changing them would change the captured prompt text and
  add diff noise for no gain.
- `inspect/mcp/src/surface/endpoint.ts:10` names `example.com` in a comment as a placeholder to leave
  out. `inspect/mcp/test/surface/kinds.test.ts:241` uses it in a source fixture string.
- Every `docs/` page uses it in a configuration example. That is the use IANA grants.

## 3. Pages from the Diff

- [x] 3.1 Read `captures/2.1.312/diff/report.md`. Give every added or changed item a row, or an
  exclusion with a reason in `tools/surface/exclusions.json`.
  `bun run surface:check` prints `every item is mapped or excluded` over 9052 items.
- [x] 3.2 Check each item against the program with the `cc-inspect` `release` and `code` actions before
  a page states it. Each new fact cites a `captures/2.1.312/clean/modules/` chunk and line.

## 4. Pages from the Release Notes

Each item needs a check in the program or a probe before a page states it.

- [x] 4.1 `oidc.user_id_claim` in the Claude apps gateway settings.
  Page: `docs/configure/settings/auth.md:65`.
- [x] 4.2 `Write` on a very large `CLAUDE.md`, rules file, or `@`-included file in a subdirectory.
  Page: `docs/reference/tools/files.md`.
- [x] 4.3 Per-directory and `paths:` skills found after a Bash `cd` deeper into a repository.
  Page: `docs/extend/skills-and-commands/frontmatter.md`.
- [x] 4.4 A command with an invalid name no longer stops every command from loading.
  Page: `docs/extend/skills-and-commands/slash-commands.md:156`. The program checks the type of the
  name and the display name. The release note's `claude -p` link does not show in the code.
- [x] 4.5 The effort level in the spinner, the OpenTelemetry `effort` value, and the transcript.
  Pages: `docs/reference/opentelemetry.md`, `docs/reference/transcript-format.md`,
  `docs/configure/models-and-providers.md`.
- [x] 4.6 `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0` and the shorter system prompt for an unrecognized model
  name. Mantle is not a new provider: it is an endpoint of Amazon Bedrock, which the site already
  documents ("Amazon Bedrock (Mantle)" at `chunk-m9qw0baf.js:841`, "Bedrock Mantle" at
  `chunk-gs1pnh66.js:30140`, and `CLAUDE_CODE_USE_MANTLE` on
  `docs/configure/models-and-providers.md:268`).
  Pages: `docs/configure/env-vars/models-and-effort.md`, `docs/how-it-works/system-prompt.md`.
- [x] 4.7 `CLAUDE_CODE_DISABLE_REFUSAL_FALLBACK=1` and the automatic model switch for an unrecognized
  model name. Page: `docs/configure/env-vars/models-and-effort.md`.
- [x] 4.8 Prompt and agent hook concurrency: 24 for each session with sub-agents included, plus 12 that
  have waited longer than their event timeout, and a `timeout` under 1 second counted as 1 second.
  Pages: `docs/extend/hooks/configuration.md`, `docs/extend/hooks/handlers.md`.
- [x] 4.9 A subagent's `autoCompactWindow` lowering the window from `CLAUDE_CODE_AUTO_COMPACT_WINDOW`.
  Pages: `docs/extend/subagents/frontmatter.md`, `docs/how-it-works/context-and-compaction.md`.
- [x] 4.10 The OpenTelemetry `mcp_server.name` value for a fixed-URL remote MCP server from the official
  Anthropic marketplace. Page: `docs/reference/opentelemetry.md`.
- [x] 4.11 The `claude_code.safety_event` OpenTelemetry event. The release note is wrong: the event is
  not gone. The server-side gate `tengu_snoopy_creek` now defaults to `false`, so the event is off by
  default (`chunk-r5cyd28m.js:186177`, `:186356`, with both call sites at `:186258` and `:186295`).
  A server-side flag can turn it on again. Page: `docs/reference/opentelemetry.md`.
- [x] 4.12 Vim-mode `d`, `c`, and `y` with a `gj` or `gk` count. Page: `docs/configure/keybindings.md`.
- [x] 4.13 The short `/verify` description in `/help` and the command menu.
  Page: `docs/extend/skills-and-commands/bundled-skills.md:39`.
- [x] 4.14 Click to send in fullscreen. Page: `docs/configure/keybindings.md`.
- [x] 4.15 The "5-hour limit" wording in a usage limit message.
  Page: `docs/how-it-works/account-and-access.md:116`.

Items of the release notes that no page states, because the repo documents only what a user can access
or configure: the `Read` race on a PDF with `pdftoppm`, the missing first reply after a resume, the
"waiting on you" indicator, and the two agent-view fixes. `docs/start/what-changed.md` names them in
one paragraph.

## 5. Regenerate and Close

- [x] 5.1 `bun run release:prompts`, which renders `docs/prompts/` into its new group folders.
  60 variants, 8 of them duplicates, over 169 changed paths.
- [x] 5.2 `docs/start/what-changed.md` holds only `2.1.312`. Move `2.1.311` to the top of
  `docs/start/release-archive.md`, rename its fact ids in `tools/release/facts/map.json`, and update
  the version ranges on both pages.
- [x] 5.3 Change each current-behavior label from `2.1.311` to `2.1.312`, after a check of each.
  About 108 labels changed. A label of history ("Added in", "In `2.1.311` it was") stays.
  Four pages keep a `2.1.311` label that no check could confirm:
  `docs/extend/headless/control-protocol.md` and `stream-json.md` (the bundled schemas changed by 89
  and 34 lines, and no page states those changes yet), `docs/reference/transcript-format.md` (270
  lines changed), and `docs/how-it-works/system-prompt.md` ("Captures of 2.1.311 show").
- [x] 5.4 `src/version.ts` to `2.1.312`, then `bun run schemas`, `bun run surface`, `bun run surface:check`.
  `bun run schemas` needed 59 hand-read anchors in `tools/schemas/manual/claude-code-transcript.json`
  refreshed, because the minifier renamed identifiers between `2.1.311` and `2.1.312`.
- [ ] 5.5 `bun run version:bump`, the `CHANGELOG.md` entry, `bun run schemas:check`, `bun run verify:locked`.
  `bun run schemas:check` passes: 17 schemas valid, `claude-code.d.ts` ok, `surface.json` the same as a
  fresh run. `bun run release:facts -- --check` prints `facts check ok` over 257 facts.
