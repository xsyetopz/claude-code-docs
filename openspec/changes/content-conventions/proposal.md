# Proposal: Content Conventions

## Why

User feedback (verbatim, 2026-10-19):
- On "Sources: Model Configuration (section "Context window and auto-compaction") in the official docs, and the program.":
  "external sources should be citated like proper markdown `[links](to those places)`"
- "if mermaid graphs can also render backticked markdown-style code spans, then we use them on codespans, too."
- ASCII file trees "are also hard to read."
- "the Yes/No parts in some tables could be the emojis checkmark and the red X mark. Unknown could be a question mark.
  asterisk citations could be used to clarify something that may need it."
- "After all that'd been done, you can use other emojis as markers where fit, too. Think of the industry conventions for such!"

This overrides the launch rule "No emojis anywhere" (content-brief.md, design.md D9). Asked whether /frontend-design
required it: it did not; the rule came from the launch brief.

## What Changes

Phase 1: linked citations, mermaid code spans (if Mermaid renders them), a FileTree component replacing ASCII trees,
✅ / ❌ / ❓ in table value cells, asterisk notes, check-docs emoji allow-list.
Phase 2: a small, documented set of extra emoji markers by industry convention, plus a legend.
