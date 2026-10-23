openspec change: `openspec/changes/release-2-1-309/`.
Next open task: `2.4` in `tasks.md`.
Done tasks, checked in `tasks.md`: `1.1`, `1.2`, `1.3`, `2.1`, `2.2`, `2.3`.
Passed checks: none.
Only a checked task or a passed check is done.
Each checked task is done and verified, so run its check again only when the user asks.

- Task (user's words):
  > Dig into 2.1.309 binary/changelogs via cc-inspect, then update website and its data to be for 2.1.309+
  > you're allowed to do both. make that a rule.
- plan `openspec/changes/release-2-1-309/` (proposal and tasks, `minispec validate` passed). The first name failed with `The change name 'release-2.1.309' is not kebab-case. Use lowercase letters and digits, with single hyphens between words.` The no-ask rule (live tests, commit, push; no force push, no `--no-verify`) moved to the git-ignored `CLAUDE.local.md` after the user chose `Only me (Recommended)`. Shared `CLAUDE.md` and `tools/release/README.md` were restored.
- 1.1: `release:all` exited 0 on every step (`35 case(s), 0 invalid probe(s)`; `159 cases in both (5 changed, 0 invalid)`). 1.2: the baseline and insights changes are date noise (a 2.1.308 rerun gave the same hashes; 2.1.308 results restored). Real change: `print.dsc.sizes` 45388 → 45671, because the Bash description went 1,406 → 1,688 characters (new GitHub `@name` bullet). 1.3: findings are in `captures/2.1.309/notes.md`.
- 2.1: rendered with `CAPTURE_OUT=captures/2.1.309/prompts bun tools/capture-prompts/render.ts`. UUID churn in 4 prompt pages was there before this task. 2.2: pages edited: 7 env rows, env index `1419`, ultrareview row, Bedrock streaming row, Mod API `cursor` and alias, `liveReply`, memory, skills, modes, sandbox, context-budget. In `undocumented.md` the env counts were set to `Count: 880.` and the total to `1530` (other summary drift is there from before and not fixed). Lint `0 issues`, `check-docs: ok (251 files scanned)`. Group 1 `verify:locked` gave `exit 0`.
- 2.3: 7 entries added to `tools/release/claims/map.json`, and `claims check ok` (`mapped 94, static 57`).
- Earlier errors: `head: invalid option -- d`, `(eval):1: no matches found: plugins*`, `(eval):1: no matches found: --include=*.ts`, `(eval):1: === not found`, and `rg: error parsing glob ... nested alternate groups are not allowed`.
- RAN, result after this handoff: Bash `ls -la captures/2.1.308/strings.txt captures/2.1.309/strings.txt` plus `/tmp/rel309/pagecheck.py`, which checks pages against the strings of both versions.
- Next, 2.4: change the current-behavior `2.1.308` labels to `2.1.309` after a check of each, using the `f96908f` pattern. The "verbatim text that Claude Code 2.1.308 uses" headers are on prompt pages like `docs/prompts/skill-verify.md`, and no tool writes them. Keep change notes and dated probe records. Then do 2.5 (`what-changed.md`, `CHANGELOG.md`, plugin, `README.md`), then 3.1 (bump `src/version.ts`, `bun run schemas`, `verify:locked`), 3.2 (review, commit, push), and 3.3 (live probes with `--yes`; managed probes need the user for `sudo`).
- Report to the user separately: the UUID churn in prompt pages and the drift in the `undocumented.md` summary counts. Remove `/tmp/rel309` at the end.
