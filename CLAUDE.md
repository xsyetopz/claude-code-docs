# CLAUDE.md

Unofficial Docusaurus site documenting Claude Code `2.1.303` (version in `src/version.ts`).
Not made by or tied to Anthropic. Hosted at <https://xsyetopz.github.io/claude-code-docs/>.

## Commands

- Bun `1.4.3`. `bun install`, `bun run start` (dev server).
- `bun run verify:locked`: the one check (every gate plus build).
- Gates: `typecheck` (`bun --check`, Bun's built-in), `format:check`/`format` (Biome), `lint:code` (Biome lint), `lint` (markdownlint), `check:docs`, `schemas:check`.
- `bun install` installs lefthook hooks: pre-commit runs the gates on staged files, commit-msg runs commitlint, pre-push runs `verify:locked`.
- `bun run schemas`: regenerate `schemas/` from the installed Claude Code binary.

## Layout

`docs/` pages (style guide: `docs/contributing/style-guide.md`), `src/` theme and components,
`tools/` checks and generators, `schemas/` generated JSON Schemas, `openspec/changes/<change>/` specs and tasks.

## Writing Rules

- Simple English. Chicago Title Case for titles, headings, and sidebar labels.
- At a Glance table: on a section's index page only (or a standalone page); subpages skip it. Mark items with `<Documented />`, `<Undocumented />`, `<Differs />`, or `<Gated />`.
- List only items a user can use or change. Never invent a fact.
- Cite external sources as markdown links to the exact page and section. Facts from the binary: "the program".
- Emojis only from the allow-list in `tools/check-docs.ts`. Escape MDX: `\{`, `\}`, `<` in code, `\|` in table code cells.

## Conventions

- Conventional Commits. Don't edit `.markdownlint.jsonc`, `biome.json`, or `commitlint.config.mjs`.
- Probe the binary only with the fake key and local stub in `tools/capture-prompts/`. Never real credentials. Never commit `.env` or `captures/`.
