# Proposal: Split Wide Diagrams

## Why

- A few Mermaid diagrams still scroll sideways at a 1280px viewport: nine pages at 1280px (measured): marketplace, mod-api classic, hooks input-and-output, env-vars, architecture, agent-loop, context-and-compaction, prompts, and API endpoints.
- Sideways scrolling hides parts of the flow and makes the diagrams hard to read.

## What Changes

- Split or reshape each wide diagram into smaller diagrams (or a narrower layout) that fit at 1280px without scrolling.
- Keep every fact and edge; only the layout changes. Prose between split parts links them.

## Then

- Probe the managed settings folder (`/Library/Application Support/ClaudeCode`) with sudo and settle the items still marked unknown.
