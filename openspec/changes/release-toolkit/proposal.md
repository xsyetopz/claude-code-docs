# Proposal: Repo-Local Release Toolkit

## Why

User (verbatim, 2026-10-21): "it would definitely help to make all these command and tools actually automatable tools, so that when a new CC version comes up, the agent is fully prepared to go through the whole thing again. a repo-local toolkit"

Moving to 2.1.305 took ad-hoc scripts in /tmp (now saved, gitignored, in `captures/p305-scripts/`),
many agent restarts, and repeated method mistakes (leaked parent env, "hi" prompt, warm cache, keychain dialogs).
A new release should be one documented, repeatable run.

## What Changes

`tools/release/` (Bun + a pyte-free Python pty driver), with `bun run release:*` scripts and a runbook:

- `diff`: install check, strings dumps of old and new binary, env/flag/command/setting/gate diff -> report.
- `schemas`, `prompts`: wrap the existing `bun run schemas` and `tools/capture-prompts` (default prompt `Reply with 'OK'.`).
- `probe:print`: the sweep (name list rebuilt from the binary, documented prefixes) plus the named print probes (control protocol, PostToolUse shapes, script hook, Perfetto, transcripts, request details, auto mode, subagents, configure/memory, --disable-slash-commands, --brief, --resume, cache_touch).
- `probe:pty`: interactive probes (hooks, notifications, status line timings, size warnings, agent types, guide/skill-insights captures).
- `probe:live`: subscription runs (context budget, OAuth parity, /usage, /artifacts) through a committed secret runner that loads `.env` only in the child; asks before running; cache-warmth aware.
- `probe:managed`: prepares the managed folder and prints the single `sudo` command for the user.
- `claims`: lists every version-labelled claim in docs (`git grep` of the old version) and maps it to the probe that re-checks it.
- One results folder per version under `captures/<version>/` (gitignored) with JSON results, so pages can be updated by diffing old vs new.
- Built-in rules: `env -i`, temp HOME/CLAUDE_CONFIG_DIR, fake key, dead proxy, unique ports, no keychain, never log headers, kill own PIDs only.
- Runbook `tools/release/README.md` (and a link from CLAUDE.md) with the step order and which steps need the user (sudo, live consent).
