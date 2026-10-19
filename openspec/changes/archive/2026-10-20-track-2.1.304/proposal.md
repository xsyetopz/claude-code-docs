# Proposal: Track Claude Code 2.1.304

## Why

User (verbatim, 2026-10-20): "https://github.com/anthropics/claude-code/releases/tag/v2.1.304 looks like 303 gets replaced with 304"

The site tracks one release (`src/version.ts`). 2.1.304 shipped 2026-10-19 and is installed locally
(`~/.local/share/claude/versions/2.1.304`; 2.1.303 is still there for diffing).

## What Changes

- Bump `CLAUDE_CODE_VERSION` and every "2.1.303" claim that is a version label (not a historical note) to 2.1.304.
- Regenerate `schemas/` from the 2.1.304 binary (`bun run schemas`); document new/removed/changed keys.
- Recapture prompts with the 2.1.304 binary (fake key + local stub only, `tools/capture-prompts/`); re-render; review diffs.
- Apply release-note changes that touch documented surfaces, citing the
  [v2.1.304 release](https://github.com/anthropics/claude-code/releases/tag/v2.1.304). Candidates: mod `tool.check`
  (`decider: "person"`, `e.isReadOnly`), mod `settings.read` per-layer hooks, `/auto-mode-setup`,
  `CLAUDE_CODE_AUTO_COMPACT_WINDOW` k/M suffixes, tool search default behind custom `ANTHROPIC_BASE_URL`,
  skill hook limits (1,024 hooks / 16,384 matcher chars), skills `allowed-tools` under plugin-only hooks policy,
  compaction re-sends skill list / `/reload-skills`, `claude plugin validate` notes removed, `/fast` label,
  `--help` text fixes, `claude --worktree` exit behavior, `/artifacts` delete choices.
- Diff 2.1.303 vs 2.1.304 binaries for undocumented changes (env vars, flags, settings, commands, gates).
- CHANGELOG entry; plugin snapshot/version.
