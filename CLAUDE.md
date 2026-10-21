# CLAUDE.md

Unofficial Docusaurus site documenting Claude Code `2.1.305` (version in `src/version.ts`).
Not made by or tied to Anthropic. Hosted at <https://xsyetopz.github.io/claude-code-docs/>.

## Commands

- Bun `1.4.3`. `bun install`, `bun run start` (dev server).
- `bun run verify:locked`: the one check (every gate plus build).
- Gates: `typecheck` (`bun --check`, Bun's built-in), `format:check`/`format` (Biome), `lint:code` (Biome lint), `lint` (markdownlint), `check:docs`, `check:examples` (Biome on doc code blocks; `skip-lint` fence meta to skip), `schemas:check`.
- `bun install` installs lefthook hooks: pre-commit runs the gates on staged files, commit-msg runs commitlint, pre-push runs `verify:locked`.
- `bun run schemas`: regenerate `schemas/` from the installed Claude Code binary.
- New Claude Code version: follow the runbook in `tools/release/README.md`.

## Layout

`docs/` pages (style guide: `docs/contributing/style-guide.md`), `src/` theme and components,
`tools/` checks and generators, `schemas/` generated JSON Schemas, `openspec/changes/<change>/` specs and tasks.

## Writing Rules

- Simple English. Chicago Title Case for titles, headings, and sidebar labels.
- At a Glance table: on a section's index page only (or a standalone page); subpages skip it. Mark items with `<Documented />`, `<Undocumented />`, `<Differs />`, or `<Gated />`, plus status labels `<ManagedOnly />`, `<Experimental />`, `<Deprecated note />`, `<Caution note />` in the Status column (not before the name).
- List only items a user can use or change. Never invent a fact.
- Cite external sources as markdown links to the exact page and section. Facts from the binary: "the program".
- Emojis only from the allow-list in `tools/check-docs.ts` (✅ and ❌). Code identifiers in headings and admonition titles go in backticks. Escape MDX: `\{`, `\}`, `<` in code, `\|` in table code cells.

## Conventions

- Conventional Commits. Don't edit `.markdownlint.jsonc`, `biome.json`, or `commitlint.config.mjs`.
- Probe the binary with the fake key and local stub in `tools/capture-prompts/`. Live subscription runs may use `CLAUDE_CODE_OAUTH_TOKEN` from `.env` only when the user asks: load it inside the child process, never print, log, or commit it, and use a temp `HOME` and `CLAUDE_CONFIG_DIR`. Never commit `.env` or `captures/`.
