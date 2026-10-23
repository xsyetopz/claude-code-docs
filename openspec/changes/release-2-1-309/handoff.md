openspec change: `openspec/changes/release-2-1-309/`.
Next open task: `3.3` in `tasks.md`.
Done tasks, checked in `tasks.md`: `1.1`, `1.2`, `1.3`, `2.1`, `2.2`, `2.3`, `2.4`, `2.5`, `2.6`, `3.1`, `3.2`.
Passed checks: none.
Only a checked task or a passed check is done.
Each checked task is done and verified, so run its check again only when the user asks.

- Task (user's words, plus a mid-task request and a side-agent note):
  > Dig into 2.1.309 binary/changelogs via cc-inspect, then update website and its data to be for 2.1.309+
  > you're allowed to do both. make that a rule.
  > you could use docs to archive older release version changelogs in website, and only keep latest.
  > Consider skimming the `tools/schemas/manual/` diff before it's committed.
- 1.1–3.1 and 2.6 (archive page `docs/start/release-archive.md`, plus a runbook step) in `openspec/changes/release-2-1-309/tasks.md`. Checks: `claims check ok`, `schemas exit 0`, `verify:locked exit 0`, and `39 tests` with `0 fail` in `inspect/mcp`.
- fixes: a `bun patch` of `meriyah@7.4.0` (pinned), because `error: [3420:7364-3420:7366]: Unexpected token: 'as'`. Also 49 anchors in `tools/schemas/manual/` moved to the `«»` wildcard, with the same hit count in 2.1.308 and 2.1.309. Before that fix: `213` hits of `anchor not in the program`.
- 3.2: the reviewer found no blocker, and its fixes are applied. Commits are `fa7e34c`, `0db3c5d`, and `3029fb1`, and push gave `c3f335b..3029fb1  main -> main`.
- live probes: `6 case(s), 0 invalid probe(s)`. `live.context-budget` System tools went `8374 -> 8480`, and the others are `same`. 2.1.309 was added to `probes.md` (lines 172, 176, 181, 235), `override.md:21`, and `context-budget.md:53`. Claim id `interactive-probes:663ecd72` was renamed to `9f82d851`. Lint and `claims check ok` pass. These edits are NOT committed yet.
- Earlier errors: `body's lines must not be longer than 100 characters [body-max-line-length]`, `FileNotFoundError: [Errno 2] No such file or directory: 'rg'`, and `error: Unexpected escaped backtick '`'`.
- Managed probes run in the background (task `b2av4tr72`, log `/tmp/rel309/managed.log`). The baseline phase gave 17 `ok`, and the tool is waiting for `sudo /bin/bash '/private/var/folders/cl/89dcg0fs7_n4j1vbwn_cf4bm0000gn/T/ccrel-managed-Zy5QVU/install.sh'`.
- RAN, result after this handoff: Read of `install.sh`.
- Next: wait for the user to run that sudo command. Then check `managed exit` and compare against 2.1.308, update `probes.md:203`, mark 3.3, commit (bodies ≤100 characters) and push, then remove `/tmp/rel309`.
- Open for the user: whether to open an upstream `meriyah` issue. Report separately: UUID churn in 4 prompt pages and the old drift in `undocumented.md` counts.
