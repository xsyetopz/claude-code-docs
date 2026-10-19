# Tasks: Site Launch

Wiki pages below are in SRC `wiki/claude-code/` and drop the `Claude-Code-` prefix. `*` means all pages with that prefix.

## 1. Scaffold

- [x] 1.1 Docusaurus site, branding (D2), badges (D4), mermaid, local search, lint and check scripts (D9), deploy workflow, README, CONTRIBUTING, LICENSE (CC BY 4.0 for docs, MIT for code)
- [x] 1.2 Style guide page `docs/contributing/style-guide.md` and `docs/start/how-to-read.md` (D4-D6)

## 2. Content

- [x] 2.1 Overview and How It Works: `Claude-Code`, `Architecture`, `Turn-Pipeline`, `Request-Build`, `System-Prompt*`, `Undocumented-System-Prompt`, `Context-And-Compaction`, `Sessions-And-Storage`, `Sessions-Transcript`, `Undocumented-Transcript`, `Models*` -> `docs/index.mdx`, `docs/how-it-works/`, `docs/configure/models-and-providers.md`, `docs/reference/transcript-format.md`
- [x] 2.2 Settings: `Settings*`, `Undocumented-Settings` -> `docs/configure/settings/`
- [x] 2.3 Env Vars: `Env-Vars*`, `Undocumented-Env-Vars` -> `docs/configure/env-vars/`
- [x] 2.4 CLI, Permissions, Memory, Styles, Status Line: `CLI`, `CLI-Flags`, `CLI-Hidden-Flags`, `Undocumented-CLI-Flags`, `Permissions-And-Sandbox*`, `Undocumented-Permissions`, `Memory-And-Rules`, `Output-Styles`, `Status-Line*` -> `docs/configure/`, `docs/how-it-works/permission-flow.md`
- [x] 2.5 Hooks, Skills, Commands, Subagents: `Hooks*`, `Undocumented-Hooks`, `Skills-And-Commands*`, `Undocumented-Commands`, `Subagents*` -> `docs/extend/hooks/`, `docs/extend/skills-and-commands/`, `docs/extend/subagents/`
- [x] 2.6 Plugins, MCP, Headless: `Plugins*`, `Undocumented-Plugins`, `MCP*`, `Undocumented-MCP`, `CLI-Stream-Json*` -> `docs/extend/plugins/`, `docs/extend/mcp/`, `docs/extend/headless/`
- [x] 2.7 Mod API: `Mod-API*` -> `docs/extend/mod-api/`
- [x] 2.8 Reference: `Tools*`, `Undocumented-Tools`, `API-*`, `Undocumented-API-and-Betas`, `Undocumented-Other`, `Probes*` -> `docs/reference/`
- [x] 2.9 System prompt captures (D7) -> `tools/capture-prompts/`, `docs/prompts/`
- [x] 2.10 Cross-cutting pages: `start/what-can-i-change.md`, `start/files-on-disk.md`, `start/what-changed.md`, `reference/undocumented.md`

## 3. Finish

- [x] 3.1 Full build, lint, check pass; fix broken links
- [x] 3.2 Review (reviewer): accuracy spot checks against sources, Simple English, Title Case, no ❌ items, branding guardrails
- [ ] 3.3 Initial git commit; tell the user how to create the GitHub repo and enable Pages (do not push without asking)
