# Design: Content Conventions

Launch rules (`archive/2026-10-19-site-launch/design.md`) still bind, except "no emojis" is replaced by D5 here.

## D1. Citations

Every mention of an external source is a markdown link to the exact place: official docs page URL
(`https://code.claude.com/docs/en/<page>`) plus `#anchor` when a section is named, e.g.
`Source: [Model Configuration: Context Window and Auto-Compaction](https://code.claude.com/docs/en/model-config#context-window-and-auto-compaction) and the program.`
Find the URL/anchor from SRC `external/cc-2.1.303/docs/*.md` (official docs copy; headings give anchors).
Also covers changelog, GitHub, RFCs, llmstxt.org, etc. "The program" stays plain text (no URL exists).
check-docs: flag `in the official docs` / `Source:` lines that name a page without a link.

## D2. Mermaid Code Spans

Mermaid markdown strings ("`...`" labels) officially support bold/italic. Test whether a code span renders
(e.g. via htmlLabels with `<code>`, or markdown strings) in this Docusaurus theme-mermaid version, both modes.
If one works and stays readable, convert identifiers in labels (settings keys, env vars, commands, file names) to code.
If none works, leave labels plain and record the finding here.

Finding (tested in light and dark, theme-mermaid 3.10.2):
- Markdown strings (`"`...`"`) strip the backticks. They give only bold and italic, never a code span.
- `<code>...</code>` renders as a mono code span in flowchart node and edge labels and in `stateDiagram-v2` transition labels. Quote the whole label: `A["Set <code>KEY</code>"]`.
- `sequenceDiagram` does not render the tag; it shows `<code>` as text. Sequence labels stay plain.
- The mono font can load after Mermaid measures a label, which clipped text. Fix in `src/css/custom.css`: `.docusaurus-mermaid-container foreignObject { overflow: visible; }` and `foreignObject code { white-space: nowrap; }`.

## D3. File Trees

`<FileTree>` MDX component (registered in `src/theme/MDXComponents.tsx`) wrapping a nested markdown list:
`- \`name/\` what it holds`. CSS draws tree guide lines; names in mono, notes in body serif; wraps on mobile;
folders vs files distinguishable without color. Replace all 5 ASCII trees (`grep -rl "├──" docs`), one item per line
(split lines that list several items).

## D4. Table Values and Notes

- Cell meaning yes: `✅` (or `✅ Yes.` / `✅ Yes, <detail>.` when text follows); no: `❌`; unknown/not stated: `❓`.
  Apply where a cell is a yes/no/unknown answer (At a Glance answers, boolean columns). Don't touch prose,
  headings, code, or cells where Yes/No is part of a value (e.g. a literal default "no").
- Asterisk notes: `✅\*` in the cell, and right after the table `\* The note.` (`\*\*` for a second). Use only where a
  short clarification is needed.
- Explain the markers once in `docs/start/how-to-read.md` and `docs/contributing/style-guide.md`.

## D5. Emoji Allow-List

check-docs keeps rejecting emojis except an explicit allow-list in `tools/check-docs.ts` (phase 1: ✅ ❌ ❓;
phase 2 adds the D6 set). Emojis never in headings, sidebar labels, or link text.

## D6. Phase 2 Markers (after phase 1 ships)

Final set (4), each with one meaning, before the item name in a table cell (or start of a note), then a space.
Never in headings, sidebar labels, link text, or code. Provenance badges stay the primary status.
- 🔒 managed-only: key has `x-managed-only` in `schemas/claude-code-managed-settings.json`. Applied to rows in `docs/configure/settings/*`.
- 🧪 experimental: name contains EXPERIMENTAL/`experimental`, or program/official docs say experimental or beta. Not a `<Gated />` replacement.
- ⛔ deprecated: program/official docs say deprecated and the row names the replacement.
- ⚠️ caution: deletes data, skips a safety check or permission, or sends data off-machine. Sparingly.
Dropped: 💡 tip (admonitions cover it). Screen readers say "locked", "test tube", "no entry", "warning": acceptable
because the row text states the meaning and the legend defines it. ⚠️ and ⛔ may carry U+FE0F; the allow-list holds
U+FE0F plus U+1F512, U+1F9EA, U+26D4, U+26A0.
