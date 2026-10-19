# Proposal: At a Glance Once per Section

## Why

User feedback (verbatim, 2026-10-20): "the "At a Glance" seems duplicated across sections. Just keep it somewhere once"

User choices: "Section index only" (fold subpage-only facts into the index table or subpage intro);
Prompts: "Move to one index table" (one row per prompt on the Prompts index).

## What Changes

- Folders with an `index.md` keep At a Glance only on that index. Subpages lose theirs.
  `extend/mod-api/types/` is part of the Mod API section; its subpages lose their tables (`types/index.md` had none).
- Standalone pages in folders with no index (`configure/*.md`, `start/`, `how-it-works/`, `reference/*.md`,
  `contributing/`) keep theirs.
- Prompts: remove the 35 per-prompt tables; add one At a Glance table on `docs/prompts/index.md` with a row per prompt.
- Subpage facts not covered by the index are merged into the index table cells or the subpage intro. No facts dropped.
- Style guide and CLAUDE.md rule updated.
