# Proposal: Diagrams, Probes, and Markers

## Why

- Mermaid diagrams overflow on tablet and mobile, some labels spill out of their boxes, and some edges cross or overlap for no reason.
- Many items are marked "Not verified" or unknown. Live tests against 2.1.304 (fake key, local stub) can settle them.
- Users can override some built-in prompts (subagents and others). The site should export those texts and say how to override each.
- Some content may be duplicated across pages, and the emoji markers may have a more idiomatic, accessible form.

## What Changes

- Responsive, non-overflowing, cleaner diagrams.
- Unverified items confirmed, corrected, or kept as unknown with the reason.
- New prompt captures for overridable prompts, with the override method.
- Duplicates merged into one canonical home with links.
- Marker scheme decision (with the user), then migration.
