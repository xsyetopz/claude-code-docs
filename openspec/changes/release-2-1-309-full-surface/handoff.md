openspec change: `openspec/changes/release-2-1-309-full-surface/`.
Next open task: `1.1` in `tasks.md`.
Done tasks, checked in `tasks.md`: none.
Passed checks: none.
Only a checked task or a passed check is done.
Each checked task is done and verified, so run its check again only when the user asks.

- Task: `/claudetto:apply` on change `openspec/changes/release-2-1-309-full-surface/`. There are 26 tasks; do them in order and tick each one only after its check passes. The next one is `1.1` (none ticked yet). Last message from the user:
  > You stopped. Continue?
- fixed the cc-docs "no page text" bug and told the user. Cause: Claude Code 2.1.309 shows the model only the `structuredContent` JSON (`ds` in `chunk-gf8e163f.js`; the text goes through only behind gate `tengu_eventual_noodle`). `read_page`, `read_platform_page`, `get_schema`, and `read_session` now return text only. Ran `bun run plugin:build`, corrected D7, and added a CHANGELOG entry. Check: `70 pass`, `0 fail`.
- (1.1 env): the header of `inspect/mcp/src/surface/env.ts` explains every one-sided name. Result: `1846` names, `only new: 704 only old: 115`.
- (1.1, extractors with headers that record each anchor and comparison): `hook-event.ts` gives the same 33 names as the old list. `commander.ts` gives flags `303 items (86 hidden)`; the only old-only flag is `--jq`, and there are `71` subcommands. `slash-command.ts` gives `142` commands, `only new: 64 only old: 84`. `setting.ts` gives `194` keys, the same as `schemas/claude-code-managed-settings.json`. All are registered in `index.ts`.
- `gate.ts`: groups `tengu_*` calls by the function they call, and a group whose calls mostly pass an object payload counts as the event logger. First run: `1117`, `only new: 448 only old: 0`; `52 reader groups add new names`, among them suspect names such as `tengu_` and `fo("tengu_bash_command_turn_abort_backgrounded")`.
- RAN, result after this handoff: 3 edits to `gate.ts` (the reader-group rule, the name regex `/^tengu_[a-z0-9_]*[a-z0-9]$/`, and imports `children`/`Fn`), then a gate rerun that writes `/tmp/surf/new-gates` (previous run in `/tmp/surf/new-gates.prev`).
- Next: read that rerun's output, explain the new-only gate names, and write the gate header. Then check the anchors for `tool`, `otel-event`, `mod-api`, `keybinding` (action array at `chunk-enj9vzgj.js` near 13520), `model`, `beta`, `endpoint`, `file`, `permission-rule`, and `error` (set the D3 length floor). Next, run biome and `bun test inspect/mcp/test`, tick 1.1, and go on to 1.2.
- Note: `list_modules` failed with `Error: result (141,835 characters) exceeds maximum allowed tokens.` Inline scripts that name `process.env` are blocked, so use cc-inspect files instead.
- Nothing is committed yet. Delete the scratch folder `/tmp/surf` at the end.
