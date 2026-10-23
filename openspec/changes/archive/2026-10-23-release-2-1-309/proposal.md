# Proposal: Release Claude Code 2.1.309

## Why

[v2.1.309](https://github.com/anthropics/claude-code/releases/tag/v2.1.309) shipped 2026-10-22, and the site still tracks `2.1.308` (`src/version.ts`).
Unlike 2.1.308, its notes list user-visible changes, so pages need new text as well as new version labels.

## What Changes

- Run the runbook in `tools/release/README.md` from `2.1.308` to `2.1.309`.
  Both binaries are installed (`~/.local/share/claude/versions/`), and `captures/2.1.308/` holds the old results.
  `cc-inspect` checks each finding in the binary.
- Update pages for the notes items a user can use or change, after each one is confirmed in the binary or a probe.
  Candidates from the notes, with the pages that name them today:
  - `claude ultrareview` needs workspace trust, with `--trust-workspace` and `CLAUDE_CODE_DISABLE_ULTRAREVIEW_TRUST_CHECK`.
    The program has the env var (`chunk-jnz7zw3f.js`, `chunk-6x0h4nkj.js`).
    Pages: `docs/configure/cli/subcommands.md`, `docs/configure/env-vars/`, `docs/reference/undocumented.md`.
  - `sed -i` gets the standard Bash prompt, and `/rewind` no longer restores it.
    Pages: `docs/configure/permissions/`, and the `/rewind` text.
  - The dangerous `rm`/`rmdir` prompt in bypass mode in Desktop and VS Code now denies at once.
    Page: `docs/configure/permissions/modes.md`.
  - Settings that exclude commands from the sandbox now ask before writes when the sandbox cannot run, and `denyWrite` globs apply at the real path.
    Page: `docs/configure/permissions/sandbox.md`.
  - A nested `CLAUDE.md` over the size limit loads only its start.
    Page: `docs/configure/memory-and-rules.md`.
  - An `--add-dir` skill with a taken name is offered as `<folder>:<name>`.
    Page: `docs/extend/skills-and-commands/`.
  - PowerShell hooks block on exit code 2. A mod's `turn.step` hook resolves model aliases.
    Pages: `docs/extend/hooks/input-and-output.md`, `docs/extend/mod-api/`.
  - Routes off Anthropic's backend wait 45 seconds for the "Waiting for API response" hint. Bedrock fine-grained tool streaming with the default `ANTHROPIC_BEDROCK_BASE_URL`.
    Pages: `docs/configure/models-and-providers.md`, `docs/configure/env-vars/cloud-providers.md`.
  - Bundled skill prompts (`dataviz`, `/claude-api`) changed.
    Pages: `docs/prompts/` through `release:prompts`.
- Leave out notes items a user cannot use or change: plain bug fixes with no new behavior, and VS Code, Cloud sessions, Claude Tag, and Code Review web items.
- Regenerate `schemas/` and `schemas/claude-code.d.ts`, and state only fields found there.
- Update current-behavior version labels from `2.1.308` to `2.1.309`, each after a check against 2.1.309 (143 files name `2.1.308` today).
  Change notes and dated probe records stay as they are.
- Add a 2.1.309 section to `docs/start/what-changed.md` and an entry in `CHANGELOG.md` under `[Unreleased]`.
  Update `plugin/.claude-plugin/plugin.json`, `plugin/skills/claude-code-docs/SKILL.md`, and `README.md`.
- Bump `src/version.ts` last (runbook step 12).

## Impact

- Docs, schemas, prompt captures, the claim map (`tools/release/claims/map.json`), and the plugin text.
  No change to the site code or the toolkit, unless a probe needs a new case for a new claim.
- Step 9 (managed) needs the user for `sudo`.
  Step 10 (live) uses subscription quota and is pre-approved, as are commit and push (the owner's `CLAUDE.local.md`, not shared).
- `release:probe:pty` takes about 11 minutes and needs an idle machine.
