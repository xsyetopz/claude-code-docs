# Tasks: Site Accuracy Follow-Up

SRC = `/Users/krystian/Downloads/CodeProjects/xsyetopz/claudetto` (read only). Design rules: `openspec/changes/archive/2026-10-19-site-launch/design.md`.

## 1. Fixes

- [x] 1.1 Fact-check `docs/extend/plugins/` vs SRC `wiki/claude-code/Claude-Code-Plugins*`, `Undocumented-Plugins`, `Settings-Hooks-And-Plugins`, `Env-Vars-Plugins-And-MCP`; fix errors
- [x] 1.2 Fact-check `docs/extend/mcp/` vs SRC `wiki/claude-code/Claude-Code-MCP*`, `Undocumented-MCP`, `Settings-MCP-And-Channels`; fix errors
- [x] 1.3 Small items: split hook env var row in `docs/reference/undocumented.md`; Vim `%` page name; `GZIP_DATADOG_LOGS` default; `/restart` gate (resolve from SRC or leave marked unconfirmed)

## 2. Finish

- [x] 2.1 `bun run verify:locked` passes; reviewer checks the diff
- [x] 2.2 Local commit (do not push)
