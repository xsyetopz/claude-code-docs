# Proposal: Move Fully to Claude Code 2.1.305

## Why

User (verbatim, 2026-10-21): "yes. why are you deferring work? You're tasked to move fully to 2.1.305, so do it exactly as you're told."

`track-2.1.305` bumped the version label but left ~100 "2.1.304" references: stale labels
(plugin skill, plugin.json, eval, what-changed.md "This site covers 2.1.304") and test claims
("probed on 2.1.304", hand captures, live subscription runs) that were never re-run on 2.1.305.

## What Changes

- Bump every version label to 2.1.305. Keep historical notes ("Since 2.1.304", "New in 2.1.304", the 2.1.304 release section).
- Re-run every probe on the 2.1.305 binary (stub + fake key; pty for the interactive screen), update numbers and text that changed, relabel to 2.1.305.
- Recapture the hand captures (skill-insights, subagent-claude-code-guide) on 2.1.305.
- Re-run the live subscription runs (context budget, OAuth prompt parity) on 2.1.305, per the user's instruction.
- Managed folder probe: re-run on 2.1.305 (the user runs the `sudo` step).
- Check ranges such as "From 2.1.302 to 2.1.304" against 2.1.305 and extend or close them.
