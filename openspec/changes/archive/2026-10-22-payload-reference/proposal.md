# Proposal: Payload Reference

## Why

User: "it would help to map out the 'fields' and structures of all the structural items, or else agents get this:
'The $.tool.check query lacks a decider field, so the lab can't display it on a normal call's ask.' … if the agents
have to manually dig out what takes what, it's a problem."
And: "it's every API surface that needs its actual
body/payload listed."
And, after a table generator was tried: "you don't need to explicitly lay out the types if a
.d.ts exists. we just need to make sure agents stop trying to assume they know when they don't."

Agents state fields that do not exist because the exact payload of each surface is not in one place they can read.

## What Changes

- Publish each surface's own machine-readable source, made from the program, under `schemas/`:
  - The Mod API type file, unchanged: `schemas/claude-code.d.ts` (every `$` call, event, and type).
  - JSON Schemas for the surfaces with a zod validator in the program: hook output, built-in tool inputs and
    results, control protocol, stream-json, `--agents` JSON, `.mcp.json`.
  - JSON Schemas made from the program's code for the rest: status line input, transcript lines, OpenTelemetry,
    frontmatter, `~/.claude.json`.
- The MCP server's `get_schema` serves all of them.
  For the type file it looks up a type, a member, a `$` call, or an
  event, and a miss returns the closest names.
- A rule for agents in the skill, the docs, and `CLAUDE.md`: find a field in these files before stating it;
  name only the fields found there.
- `schemas:check` checks each file; the release runbook regenerates them.

## Out of Scope

- Generated field tables on the pages.
  The pages keep their hand-written tables and link the source file.
