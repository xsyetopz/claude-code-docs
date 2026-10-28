# CLAUDE.md

- Use Bun `1.4.4`; run `bun install` to set up dependencies and Git hooks.
- Write in Simplified Technical English; use Chicago Title Case for titles, headings, and sidebar labels.
- Use `<Documented />`, `<Undocumented />`, `<Differs />`, or `<Gated />` for documentation status. Place additional status labels in the Status column, not before item names.
- Document only functionality users can access or configure. Never invent or make up something of your own.
- Cite external claims with links to exact pages and sections; attribute binary findings to "the program".
- Use Conventional Commits. Do not modify `.markdownlint.jsonc`, `biome.json`, or `commitlint.config.mjs`.
- Regenerate schemas with `bun run schemas` when needed; do not manually edit generated files.
- Use `bun run version:bump` for version changes; bump affected plugins and keep their version files consistent.
- Probe the binary using the fake key and local stub in `tools/capture-prompts/`.
- Only use `CLAUDE_CODE_OAUTH_TOKEN` for live runs when explicitly requested. Load it inside the child process, never expose it, and use temporary `HOME` and `CLAUDE_CONFIG_DIR`.
