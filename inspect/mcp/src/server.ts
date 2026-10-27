// cc-inspect MCP server (stdio). Writes only its cache and the temp folders of `code` `run` (removed after); its network calls are `gh release view` for `release` `notes` and `bunx @wakaru/cli` for `code` `read` `view: "readable"`. No telemetry.
// Reads Claude Code session transcripts (sessions.ts) and the modules inside the Claude Code binary (binary.ts).
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./mcp/app.ts";
import "./mcp/sessions.ts";
import "./mcp/code.ts";
import "./mcp/surface.ts";
import "./mcp/release.ts";
import "./mcp/prompts.ts";

await server.connect(new StdioServerTransport());
