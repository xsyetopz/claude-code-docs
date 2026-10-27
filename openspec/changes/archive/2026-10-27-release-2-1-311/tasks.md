# Tasks: Release Claude Code 2.1.311

## 1. Capture

- [x] 1.1 Run the runbook steps 1 to 8 from `2.1.310` to `2.1.311`. Verify: `captures/2.1.311/compare/compare.md` exists, and each step exits 0 or its failure is explained here.
  - So far: `release:all` stopped at `diff` (`undefined is not an object (evaluating 'm.anchor')`). Cause: `pageOf` read `map[key]`, not `mapOf`, so an error text mapped by a prefix key had no entry. A test failed first and passes now (commit `d282517`). The remaining steps run by hand.
  - Result: `release:compare` wrote `compare.md` (166 cases in both, 16 changed, 0 invalid). Each changed case is explained in What Changed or below.

## 2. Pages from the Diff and the Notes

- [x] 2.1 File set A: a row or an exclusion for each of the 36 added env vars, and the removed one taken out. Add the notes items `DISABLE_COMPACT` (off only), `CLAUDE_CODE_MODEL_CATALOG`, and `CLAUDE_CODE_SYNC_SKILLS`. Verify: `bun run surface:check` shows no unmapped env var.
  - Result: `surface:check` gives "every item is mapped or excluded". The gone hook error "one of the repo's settings files cannot be read for now" left the map and the hooks error row.
- [x] 2.2 File set B: `/claude-api`, the endpoints, the error texts, `$.prompt.paint`, and `pluginDigests`. Verify: `surface:check` shows no unmapped item of these kinds.
- [x] 2.3 File set C: `ultrathink`, the `[1m]` suffix, the `self-hosted-runner` flags, the JSON output escapes, compaction on long standard-context requests, and the retry stop. Verify: `bun run lint` and `bun run check:docs`.
  - Result: `lint` 0 issues, `check:docs` ok (256 files).
- [x] 2.4 File set D: the schema field changes (`toolsUsed`, `subagentCapApplied`, `local_file`, stream-json, and control protocol), with churn set apart. Verify: each documented field is in `schemas/`.
  - Result: the transcript `cost-state` `modelUsage` entries gain `cacheCreationEphemeral5mInputTokens` and `cacheCreationEphemeral1hInputTokens`; the fixture types them and `transcript-format.md` names them.

## 3. Account and Access

- [x] 3.1 Find the account and model-access code in 2.1.311. Verify: each fact has a module and offset.
  - Result: a scout pass, then a lead check of each cited line in `captures/2.1.311/clean/modules/`. A script check of the page's 30 `chunk:line` citations finds each line in the cleaned code ("citations ok 30 bad 0").
    - The plan map is at `chunk-r1ht672j.js:16573`, the profile reader at `:16623`, the 24 h skip at `:16238` and `:16681`, and the env-token plan at `:29083`.
    - Picker access is by provider (`:13242`). The Fable dim is at `chunk-hvd0h18m.js:13082`, and the plan or role check at `:10722` and `chunk-r1ht672j.js:30305`. There is no Mythos alias (`chunk-577rcnzg.js:37`).
    - The notes' "two requests within an hour" for Pro and Max: the scout did not find it. The user wrote "you can look further. "elsewhere" means you have to keep looking." (the user, 2026-10-27), and the lead found it. It is the Grove (Consumer Terms) check: `groveChoiceSeenAt` with a 1 h window skips `GET /api/oauth/account/settings` and `GET /api/claude_code_grove` (`chunk-t82xkc0w.js:39`, `:274`, `:331`), only for `max` and `pro` (`chunk-r1ht672j.js:30622`). The key is new in 2.1.311 (a key list diff of both cleaned installs).
    - Review fix: the Team and Enterprise refusal wording applies only with no terminal inside Claude Desktop or a `local-agent` host (`chunk-r1ht672j.js:18904`, `chunk-p49f57nv.js:110`); elsewhere every plan gets the own-usage-page link. The page now says so.
    - Not in `schemas/`: the `oauthAccount` keys and `groveChoiceSeenAt` of `~/.claude.json`, and the profile reply fields. The page marks them as unconfirmed.
- [x] 3.2 Write `docs/how-it-works/account-and-access.md` (spec `account-access-docs`). Verify: `bun run lint`, `bun run check:docs`, and a grep that finds no token or account id on the page.
  - Result: `lint` and `check:docs` pass. A grep for key, token, UUID, and email shapes finds no hit on the page.

## 4. Labels, Prompts, and Archive

- [x] 4.1 Render `docs/prompts/` and review the diff.
- [x] 4.2 Move current-behavior labels from `2.1.310` to `2.1.311` after a check of each.
- [x] 4.3 Write the `2.1.311` section of What Changed, move `2.1.310` to the Release Archive, map new claims, and add the `CHANGELOG.md` entry. Verify: `bun run release:claims -- --check`.
  - Result: "claims check ok". The warnings left are old ids saved in captures and 3 partial sweep cases.

## 5. Probes and Release

- [x] 5.1 Live probes (approved by the user, 2026-10-27) and managed probes (the user runs `sudo`). Verify: `compare.md` has no changed case left unexplained.
  - Live: 6 cases ok (`context-budget` and `oauth-parity` on a warm cache). Only `live.context-budget` changed: Skills 2093 to 2159 tokens (the `/code-review` listing); the first request still adds up to the `/context` total. Labels in `probes.md` and `context-budget.md` now name `2.1.311`.
  - Open: `CLAUDE_CODE_USE_BEDROCK` gives no `init` event, and the `CLAUDE_CODE_DISABLE_1M_CONTEXT` sample is cut, so the change does not show. What Changed says the cause is not known.
  - Resolved after archive: the user wrote "keep resolving open items" (the user, 2026-10-27). `CLAUDE_CODE_USE_BEDROCK`: the AWS SDK reached `169.254.169.254` past the dead proxy, so the result depended on the network. Today 2.1.310 hangs the same way. With `AWS_EC2_METADATA_DISABLED=true`, now set by `childEnv` and `code` `run`, both versions emit `init`, retry twice, and exit 1 on "Could not load AWS credentials". `CLAUDE_CODE_DISABLE_1M_CONTEXT`: the sweep sample now starts at the first difference. The skill listing loses its descriptions, because Opus 5.5 at 200k gets 6,000 characters (3 characters per token for models newer than 4.6, `chunk-r1ht672j.js:464002`, budget at `chunk-2ht8z368.js:2257578`). The 2.1.311 listing needs 6,000 to 7,000 characters, and the 2.1.310 one fits in 6,000 (`SLASH_COMMAND_TOOL_CHAR_BUDGET` runs).
  - Managed: 55 cases ok, 0 invalid. The only change is the start order of the baseline servers in `mcp-run`, which no row depends on; `probes.md` now names `2.1.311`. A new compare gives 221 cases in both, 17 changed, 0 invalid.
- [x] 5.2 Bump `src/version.ts`, run `schemas`, `surface`, and `version:bump`, then review, commit, and push. Verify: `bun run verify:locked`.
  - So far: `src/version.ts` is `2.1.311`. `schemas` needed `«»` in place of the minified names in the broken anchors (each with the same count in `2.1.310` and `2.1.311`), and the `modelUsage` anchor follows the new code. `surface`, `version:bump cc-docs patch` (1.0.3), `plugin:build`, `plugin:check`, `schemas:check`, and `format:check` pass. `verify:locked` passed after a `typecheck` fix in `slash-command.ts` (`k` possibly undefined).
  - Prompt pages: 23 hand-kept pages now say `2.1.311`, after a check that their sampled lines are found the same number of times in both builds. 5 skill pages (`claude-api`, `dataviz`, `run-skill-generator`, `run`, `verify`) are not in either binary as plain text, so they kept `2.1.310` and said they were not checked again, until the probe below.
  - After review: a new render after the version bump moved `index.md` and `default-sonnet.md` to `2.1.311` (Sonnet still gets the lean prompt). `override.md` names `2.1.311`: each override capture holds its mark, and `/pr-comments` is not in the 2.1.311 surface. The picker-dim and refusal gates the review named are `$1c94ab_2` (returns `null`), `$92ff28`, `$5481e5`, and `$5bb897`, which the page already covers.
  - Skill pages: `cc-inspect` 0.6.0 adds `code` `run` (the user asked for the probe, 2026-10-27). Runs of `/<skill> PROBE-ARG` on 2.1.311 match the `verify`, `run`, `run-skill-generator`, and `dataviz` pages line for line, so they now say `2.1.311`. `claude-api` matched 2.1.308, not 2.1.310: its text changed in 2.1.309, 2.1.310, and 2.1.311, and the page now holds the 2.1.311 text.
