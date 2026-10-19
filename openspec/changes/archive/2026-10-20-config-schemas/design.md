# Design: Config Schemas

SRC = `/Users/krystian/Downloads/CodeProjects/xsyetopz/claudetto` (read only). Binary = `~/.local/share/claude/versions/2.1.303` (never modify).

## D1. Extraction Method

Preferred (A), runtime export: extract the JS bundle embedded in the Bun single-file binary into a temp dir,
patch the temp copy so the five zod schema objects are captured (e.g. assigned to `globalThis`) and the program stops
before its main CLI logic, then call the bundle's own zod v4 `toJSONSchema` on each.
Run with temp HOME / CLAUDE_CONFIG_DIR, no credentials, dead `HTTPS_PROXY`, no network.
Locate schema objects by stable anchors, not minified names:
settings `{$schema:()=>` ... `"JSON Schema reference for Claude Code settings"`; plugin.json `$schema` ... "ignored at load time";
marketplace `$schema` + `plugins` + `metadata.pluginRoot`; plugin hooks `$schema` + `description` + `hooks`;
keybindings `$schema`, `$docs`, `bindings`.

Fallback (B), if A is not workable: port SRC `plugins/claudetto-lab/slices/schema/domain/{scan,build}.ts`
(static parse of minified zod calls) into `tools/schemas/`, extended to the four non-settings objects.
Record which method produced each file.

## D2. Output

`schemas/` files (draft 2020-12 if from zod's emitter, else draft-07):
`claude-code-settings.json`, `claude-code-managed-settings.json` (settings plus managed-only keys),
`claude-code-plugin-manifest.json`, `claude-code-marketplace.json`, `claude-code-plugin-hooks.json`, `claude-code-keybindings.json`.
Each has `$id` = `https://xsyetopz.github.io/claude-code-docs/schemas/<file>`, a `title`, and `$comment` naming the CC version and method.
Keep zod descriptions. Settings schemas must allow unknown keys the way the binary does (match zod passthrough/strip behavior).
Output is deterministic (stable key order) so regeneration diffs are clean.

## D3. Generator

`tools/schemas/` (TypeScript, run with bun): `bun run schemas` regenerates; `bun run schemas:check` (part of verify) validates
each file is valid JSON Schema and that sample configs in `tools/schemas/fixtures/` validate (one good, one bad per kind).
The version comes from `src/version.ts`.

## D4. Site

Serve `schemas/` at `/schemas/` on the site (static dir or copy step). Docs page `docs/reference/schemas.md`:
table of file kind, where the file lives, `$schema` URL, and how it differs from schemastore (short). Simple English, Title Case.
