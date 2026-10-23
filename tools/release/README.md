# Release Runbook

How to update this docs site when a new Claude Code version ships. The toolkit lives in this folder.
The design is in `openspec/changes/archive/2026-10-21-release-toolkit/design.md`. Every `bun run release:*` command is defined in `package.json`.

The toolkit runs the program only against a local stub with a fake key. Results are JSON under `captures/<version>/`. Prose is written later, from the diff.

## Read First

- Run `bun run release:schemas` before you commit any schema. `release:diff` reads both binaries, so both versions must be installed.
- Bump `src/version.ts` only in step 12. `--from` defaults to that value, so an early bump makes the old side wrong.
- `release:prompts` renders `docs/prompts/` unless you pass `--no-render`. With `--only`, it never renders. Review `git diff docs/prompts/` after a full run.
- `bun run release:claims -- --check` prints `probe print.sweep does not list claim ...` until `release:probe:print` runs again with the new claim lists. These are warnings, and the exit code stays 0.
- `release:probe:pty` takes about 11 minutes. Run it when the machine is idle, because the status line cases measure timing.
- pty probes need an idle machine (no other sessions running gates or builds). Step times count from the READY screen. An invalid case is retried once, and compare lists invalid runs separately (`invalid-run`): never edit docs from them.
- Probes put a `security` shim first on PATH (`<home>/.probe-bin`), so the program never touches the macOS keychain.
- Never commit `captures/` or `.env`. Both are gitignored. Do not use `git add -f` on them.
- Secrets go only through `tools/release/secret-runner.sh`. Never print, log, or commit a token. Never open `.env` yourself.
- Prompts sent to the model are always `Reply with 'OK'.` (`PROMPT` in `tools/release/lib/env.ts`). Do not use `hi` or other text. A case that needs other input must give a `promptReason`.
- Live runs (`release:probe:live`) use subscription quota. Ask the user every run. Pass `--yes` only after the user has said yes in this session.
- If a managed folder from an earlier run is still installed, run its cleanup command before `release:probe:managed`. The baseline phase is invalid otherwise.

## Prerequisites

- Bun `1.4.4`, `python3` 3.8 or newer, and `strings`. `openssl` is needed only for the live fault tests.
- The new binary is installed at `~/.local/share/claude/versions/<to>`. The user installs it. `release:check` fails without it.
- The OLD binary is installed at `~/.local/share/claude/versions/<from>`. `release:diff` needs it. `release:check` only warns when it is missing.
- For `compare`: toolkit results for `<from>` in `captures/<from>/` (`print/` and `pty/` from an earlier toolkit run). `release:diff` creates `captures/<from>/surface.json`, so the folder exists even with no results. Then every probed claim shows as `changed` (new case, no result for the old version). `compare` warns on stderr and at the top of `compare.md` when it finds none. If they are missing, run `bun run release:probe:print -- --to <from>` and `bun run release:probe:pty -- --to <from>` first, with the old binary still installed.

## Flags

| Flag | Used by | Meaning |
| --- | --- | --- |
| `--from V` | most | Old version. Default: `CLAUDE_CODE_VERSION` in `src/version.ts`. |
| `--to V` | most | New version. Default: the installed binary behind `~/.local/bin/claude`. |
| `--only a,b` | probes, prompts | Run only these case ids or group prefixes. |
| `--dry` | most | Print the plan and skip the work. |
| `--yes` | `probe:live` | Skip the `y/N` question. Only after the user says yes. |
| `--samples` | `compare` | Include trimmed sample text. |
| `--check` | `claims` | Check the claim map against the docs and the probes. Writes nothing except its `run.json` entry. |
| `--all` | `claims` | Include `gap` and `info` claims, not only `change` claims. |
| `--no-render` | `prompts` | Skip the rewrite of `docs/prompts/`. |
| `--selftest` | `check` | Run the env-leak self-test instead of the preflight. |

Pass flags after `--`, for example `bun run release:probe:print -- --only hooks.posttooluse`.

## Runbook Steps

Steps 1 to 8 are unattended and safe in a fresh session. Steps 9 and 10 need the user. Read each command's output before you go on.

1. **Preflight.** `bun run release:check`
   - Writes `captures/<to>/env.json`. Exits 1 if the new binary, `python3`, or `strings` is missing.
   - User: only to install a missing binary.

2. **Hold the version.** No command. Keep `src/version.ts` at the old version until step 12.

3. **Schemas.** `bun run release:schemas`, then `bun run schemas:check`.
   - Regenerates `schemas/*.json` in the working tree.
     Writes `captures/<to>/schemas-diff.json` (git HEAD against the new files).
   - To refresh the `x-observed-type` notes first, run `bun run schemas:observe` (add `-- --user` to also read your own `~/.claude` files, types only).
     It rewrites `tools/schemas/observed/`.
   - User: no.

4. **Diff.** `bun run release:diff`. Read `captures/<to>/diff/report.md` first. It shows which docs pages are affected.
   - Takes a surface snapshot of each binary (`captures/<version>/surface.json`) and compares the items of each kind. Each added or changed item names the page that takes it, from `tools/surface/map.json`, `tools/surface/exclusions.json`, and the docs tables.
   - Writes `captures/<to>/diff/*.json` and `report.md`. The files `strings-env.json`, `flags.json`, `commands.json`, `settings.json`, `hooks.json`, and `gates.json` keep their names for `release:claims` and `release:compare`.
   - User: no.

5. **Prompts.** `bun run release:prompts`. Add `-- --no-render` to skip the render.
   - Writes `captures/<to>/prompts/<id>/`. Renders `docs/prompts/` unless `--no-render` is set.
   - User: no.

6. **Print probes.** `bun run release:probe:print`. Runs the env sweep first, then the named probes.
   - Writes `captures/<to>/print/<case>.json` and `print/sweep.json`.
   - User: no.

7. **Pty probes.** `bun run release:probe:pty`. Takes about 11 minutes. Cases run one at a time.
   - Writes `captures/<to>/pty/<case>.json`, with `.raw`, `.idx` (timing), and `.screen.txt` beside it.
   - User: no. Run it on an idle machine.

8. **Claims and compare.** `bun run release:claims -- --check` (`release:all` runs this too), then `bun run release:claims`, then `bun run release:compare`.
   - `claims` writes `captures/<to>/claims.json`. `compare` writes `captures/<to>/compare/<from>..<to>.json` and `compare/compare.md`, the worklist (see below).
   - User: no.

9. **Managed probes.** `bun run release:probe:managed`
   - The tool builds a stage in a temp dir and prints one `sudo /bin/bash <stage>/install.sh` command. Read the script first. The user runs it in a second terminal and types the password once. The tool then runs each phase and prints `sudo /bin/bash <stage>/cleanup.sh`. The user runs that too.
   - Writes `captures/<to>/managed/<case>.json`.
   - User: yes (sudo and the password).

10. **Live probes.** `bun run release:probe:live`. Run `bun run release:probe:live -- --dry` first to test the pipeline offline (fake token, local stub, dead proxy, no network).
    - Prints the plan and the cost, then asks `y/N`. The secret runner reads `CLAUDE_CODE_OAUTH_TOKEN` from `.env`. The agent never reads `.env`.
    - Writes `captures/<to>/live/<case>.json`, with `cacheWarm` where it applies. One attempt per case, no retry.
    - User: yes. Explicit consent every run.

11. **Docs.** Update the docs pages from the worklist in `captures/<to>/compare/compare.md`. Each edit cites the case id it came from. Run `bun run lint` and `bun run check:docs` on the changed pages.
    `docs/start/what-changed.md` holds only the `<to>` section. Move the `<from>` section to the top of `docs/start/release-archive.md`, and rename its claim ids in `tools/release/claims/map.json`. Update the version ranges in both pages.
    - User: no.

12. **Release.** Bump `src/version.ts` to `<to>`. Run `bun run schemas` again, so the generator stamps the new version. Run `bun run surface` to commit the snapshot `schemas/surface.json` and render the Surface Coverage page, then `bun run surface:check`. Run `bun run version:bump -- cc-docs patch` (or `just bump cc-docs patch`), which also sets the Claude Code version in `.claude-plugin/marketplace.json`; bump `cc-inspect` too when `inspect/` changed. Then run `bun run schemas:check` and `bun run verify:locked`. Have the change reviewed, then commit with Conventional Commits and push. The pre-push hook runs `verify:locked` again.
    - User: no.

## Shortcut: `release:all`

`bun run release:all` runs check, schemas, diff, prompts, probe:print, probe:pty, claims, and compare, in that order.

- It passes `--no-render` to prompts, so it never edits `docs/prompts/`.
- It rewrites `schemas/*.json` in the working tree (see step 12).
- It runs `claims --check` before `claims`. That step writes nothing and fails only on an unmapped claim. The `print.sweep does not list claim` warnings keep exit 0.
- It accepts only `--from`, `--to` and `--dry`. Any other argument exits 2.
- It stops at the first failed check, schemas, diff or prompts step and prints the commands you still need to run by hand, with the same `--from`, `--to` and `--dry`.
- If probe:print, probe:pty or `claims --check` exits non-zero, it still runs the later steps (so a flaky pty case still gives a worklist). It then exits non-zero and names the failed steps.
- It never runs steps 9 and 10. It prints them under "Needs you".

## Where Results Go

Results sit in `captures/`, which is gitignored.

```text
captures/<to>/
  run.json              one entry per step run for this version, plus one for `all` (name, args, times, exit)
  env.json              preflight facts
  diff/                 report.md and the *.json diffs
  schemas-diff.json
  prompts/<id>/
  print/                <case>.json and sweep.json
  pty/                  <case>.json, with .raw, .idx, .screen.txt
  managed/              <case>.json
  live/                 <case>.json
  claims.json
  compare/              <from>..<to>.json and compare.md
captures/<version>/strings.txt    cached strings dump (tens of MB), from the print sweep
captures/<version>/surface.json   surface snapshot, from release:diff and surface
```

`release:check` prints the size of each version folder. Delete old versions by hand.

## Reading the Worklist

Open `captures/<to>/compare/compare.md`.

- `## Worklist` lists each claim whose result is `changed` or `not-run`, with its file, line, and kind. It also lists names in `diff/` that no claim covers.
- `not-run` means no probe result covers the claim. Claims of kind `manual` always show as `not-run`.
- `## Cases` lists the changed, added, and removed facts for each case id.
- A changed result is not a probe failure. Probes exit non-zero only when a case could not run.
- Never use a live result with `cacheWarm: true` as a doc number.
- `--samples` adds the trimmed sample text. The positional form also works: `bun run release:compare -- 2.1.305 2.1.306`.

## Claim Map

- Claims are version-labelled sentences in `docs/`, such as "since 2.1.304". `tools/release/claims/map.json` is hand-edited. It maps each claim to a probe or to a kind.
- Kinds: `behaviour`, `env`, `flag`, `command`, `setting`, `hook`, `gate`, `schema`, `manual`, `static`, `external`.
- `release:claims -- --check` fails on an `unmapped` claim. Add a `map.json` entry for each new claim.
- A probe result lists the claim ids it checks in its `claims` array.
  Writing the result adds every claim that `map.json` maps to the case. `--check` warns when the probe and the map disagree, so rerun the probe after you map a claim to it.

## Selftest

```sh
CLAUDE_CODE_FOO=1 bun tools/release/cli.ts check --selftest
```

The same check runs as `bun run release:check -- --selftest`. It checks that a parent `CLAUDE_CODE_*` variable, such as `CLAUDE_CODE_FOO=1` above, does not reach the program. It ends with `selftest ok` or `selftest failed`. Run it after any change to `tools/release/`.

## Lint

- Markdownlint for this file: `bunx markdownlint-cli2 tools/release/README.md`. The `lint` script covers only `docs/`.
- Biome does not check Markdown files.
