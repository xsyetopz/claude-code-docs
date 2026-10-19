# Content Brief (Tasks 2.1-2.8, 2.10)

Common brief for every content writer. Your own task message names your pages.

ROOT = `/Users/krystian/Downloads/CodeProjects/xsyetopz/claude-code-docs` (the new site).
SRC = `/Users/krystian/Downloads/CodeProjects/xsyetopz/claudetto` (read only).

Read first: `ROOT/openspec/changes/site-launch/design.md` (binding),
`ROOT/docs/contributing/style-guide.md`, and `ROOT/docs/start/how-to-read.md`.

## Goal

This is an unofficial, community docs site for Claude Code `2.1.303`.
It documents every surface a user can use, change, or turn on and off, documented or not.
It also explains how the harness works inside, in Simple English.
Readers: people who manage settings, write plugins and hooks, or want to work around harness behavior
without changing the binary.

## Rules

1. Rewrite, do not copy. The wiki is a fact source, not a template. New structure, new wording, more explanation.
   Merge the wiki's split pages (`-2`, `-3`) into whole pages. Long reference pages are fine on a website.
2. Keep every usable item. Each settings key, env var, flag, command, hook event and field, tool parameter,
   frontmatter key, manifest key, Mod API member, and so on gets a table row. Completeness matters most.
3. Leave out unusable items: wiki rows marked ❌ (removed or inert), test-only items, and Anthropic-internal items
   (gated on `USER_TYPE=ant` or similar). Keep 🧪 items only when a user can turn them on, or they are live for some accounts.
4. Marks become badges: ✅ `<Documented />`, 🔍 `<Undocumented />`, ⚠️ `<Differs />`, 🧪 `<Gated note="the gate" />`.
   No emojis anywhere.
5. Every surface page: intro (2-4 sentences), At a Glance table (D5), an Example section, item tables
   with a `Status` column, a "How It Works" section with a mermaid diagram where a flow exists, and Related Pages.
6. Simple English (D6). Short sentences, common words, explain terms on first use, "you".
   Chicago Title Case for titles, headings, and `_category_.json` labels.
7. Sources: link official docs pages by Title Case name; for program-only facts write "Source: the program"
   and name the string, key, or type in inline code. Never invent. If unsure, check SRC sources (D8) or leave it out.
8. Links: use relative file links with the `.md`/`.mdx` extension (e.g. `../hooks/events.md#stop`) so broken links fail the build.
   Only link to pages that exist or that your task creates. For pages owned by others that may not exist yet,
   use plain text and list them in your report.
9. MDX safety: escape `{`, `}`, `<` in prose and table cells outside inline code. `|` in table code cells is `\|`.
   Code fences need a language (`json`, `bash`, `text`, `ts`, `mermaid`, `diff`).
10. Do not touch files outside your assigned folders. Do not commit. Do not run model calls, evals, or sandboxes.
    `claude --help` and `claude <cmd> --help` are fine. Never run anything from SRC `external/`.

## Verify

From ROOT: `bun run verify:locked` (lint, check, build; waits for a lock because other writers build in parallel. Never run plain `bun run build` or `verify`). Fix every error that comes from your files.
If an error comes from another writer's file, leave it and mention it.

## Report (short, no report files)

- Pages written, with line counts.
- Items per badge (rough counts).
- Items you left out as unusable (count, a few examples).
- Facts you could not verify, and wiki facts the sources contradicted.
- Cross-links you wanted but could not make (target page missing).
