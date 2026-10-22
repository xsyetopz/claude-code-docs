# Proposal: Release Claude Code 2.1.308

## Why

[v2.1.308](https://github.com/anthropics/claude-code/releases/tag/v2.1.308) shipped 2026-10-22.
Its notes say only "Bug fixes and reliability improvements".
Commit `09c903b` bumped `src/version.ts` and the schemas, but no page text changed, so pages still named `2.1.307`.

## What Changes

- Runbook steps 1-8 had run (`captures/2.1.308/run.json`).
  The diff report shows no change to env vars, flags, commands, settings, hooks, or gates. `types.diff` is empty.
- The compare worklist had 2 changed cases.
  Reruns showed both are timing noise:
  - `print.subagents.observer.on` gives 3 or 5 observer requests from run to run, on 2.1.306, 2.1.307, and 2.1.308.
  - The `CLAUDE_CODE_USE_MANTLE` sweep times out with no stub request, and its `stderr`/`cfgfiles` keys vary from run to run.
- Fix the probes page, which read the observer count as a version change.
- Update the version labels that state current behavior, after checking each against 2.1.308: prompt texts, the Mod API type file, `--help` text, settings key counts, and code read around each identifier.
  Change notes ("new in 2.1.307") and dated live and managed probe records stay as they are.
- Add a 2.1.308 section to `docs/start/what-changed.md`.
  Update the plugin manifest and skill.
- Steps 9 (managed, 55 cases) and 10 (live, 6 cases) ran after the first commit. They matched 2.1.307 apart from noise: MCP server start order, and a warm-cache live run moved by up to 3 tokens.
