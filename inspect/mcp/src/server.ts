// cc-inspect MCP server (stdio). Writes only its cache; its one network call is `gh release view` for `release` `notes`. No telemetry.
// Reads Claude Code session transcripts (sessions.ts) and the modules inside the Claude Code binary (binary.ts).
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./mcp/app.ts";
import "./mcp/sessions.ts";
import "./mcp/code.ts";
import "./mcp/surface.ts";
import "./mcp/release.ts";
import "./mcp/prompts.ts";

await server.connect(new StdioServerTransport());
