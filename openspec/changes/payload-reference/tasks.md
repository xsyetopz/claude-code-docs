# Tasks: Payload Reference

- [x] 0.1 Extract the type file for 2.1.306 and 2.1.307 (`extract.ts` gets a raw `bytes` view), diff them, and fix the pages for the 2.1.307 changes (`approver`, `plugin` replaces `decider`, `EngineToolCall`, `Markdown.part`, dock `columns`)
- [x] 1.1 Inventory every non-type-file surface: source of truth, anchor, field counts, doc pages, missing fields (`captures/2.1.307/surfaces.md`)
- [x] 2.1 Publish the type file: `tools/schemas/types.ts` writes `schemas/claude-code.d.ts`; `schemas` and `schemas:check` run it
- [x] 2.2 JSON Schemas from zod: hook output, tools, control protocol, stream-json, `--agents` JSON, `.mcp.json`
- [x] 2.3 JSON Schemas from code: status line input, transcript lines, OpenTelemetry, frontmatter, `~/.claude.json`
- [x] 3.1 `get_schema`: type file lookups (`plugin/mcp/src/types.ts`), the new schema names, tests, `dist/server.js`
- [x] 3.2 Agent rule in the skill, the Mod API pages, `docs/reference/schemas.md`, and `CLAUDE.md`; source lines name the 2.1.307 type file
- [x] 3.3 `docs/reference/schemas.md` lists every published file; pages of each surface link their file
- [x] 4.1 `verify:locked`, read the diff, review
