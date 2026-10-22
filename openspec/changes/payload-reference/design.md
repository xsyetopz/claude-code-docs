# Design: Payload Reference

## Principles

- The program's own data decides the fields.
  The files are published as the program has them, not rewritten.
- Files are committed under `schemas/`, so checks and the build need no binary.
- No new npm dependencies.

## Sources

Facts from the inventory (`captures/2.1.307/surfaces.md`):

| Surface | Source in the program | File |
| --- | --- | --- |
| Mod API calls, events, types; classic hook input | Type file (`/$bunfs/root/claude-code.d.ts-*.zst`) | `schemas/claude-code.d.ts` (`tools/schemas/types.ts`) |
| Classic hook output | zod | JSON Schema (`tools/schemas`) |
| Built-in tool inputs and results | zod `inputSchema`/`outputSchema`. The type file's `BuiltinToolInputs`/`BuiltinToolResults` are empty | JSON Schema |
| Control protocol | zod table | JSON Schema |
| stream-json | zod unions | JSON Schema |
| `--agents` JSON, `.mcp.json` | zod | JSON Schema |
| Status line input, transcript lines, OpenTelemetry, frontmatter, `~/.claude.json` | Code only (literal key lists) | JSON Schema written from the code, each naming its anchor |

## MCP Lookup

`plugin/mcp/src/types.ts` reads the type file as text (no TypeScript parser): declarations at module level, a
member by dotted path, `$.noun.call` through `CoreEngineInterface`, and an event name through every map keyed by
event name. `get_schema` with `name: "types"` uses it.

## Agent Rule

Same rule in `plugin/skills/claude-code-docs/SKILL.md`, `docs/extend/mod-api/types/index.md` (linked from the Mod
API index), `docs/reference/schemas.md`, and `CLAUDE.md`: confirm a field in the type file or a schema before
stating it, and name only the fields found there.
