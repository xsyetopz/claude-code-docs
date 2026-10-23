// claude-code-docs MCP server (stdio). Read-only. No telemetry.
// A thin front end on core.ts, which reads the published docs site live and caches every fetch on disk for offline use.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import pkg from "../package.json" with { type: "json" };
import {
  DEFAULT_PAGE_CHARS,
  list,
  MAX_PAGE_CHARS,
  type Result,
  read,
  schema,
  search,
} from "./core.ts";

const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
} as const;

// Claude Code shows the model only structuredContent when a reply has it (design D7), so send it
// only when it holds everything that the text holds. Pages and schemas send text only.
const reply = (r: Result) =>
  r.ok
    ? {
        content: [{ type: "text" as const, text: r.text }],
        ...(r.complete ? { structuredContent: r.data } : {}),
      }
    : { isError: true, content: [{ type: "text" as const, text: r.text }] };

const source = z
  .enum(["docs", "platform"])
  .default("docs")
  .describe("docs: Claude Code Docs. platform: platform.claude.com/docs");

const server = new McpServer({
  name: "claude-code-docs",
  version: pkg.version,
});

server.registerTool(
  "search_docs",
  {
    description:
      "Full-text search over the docs. Returns routes, titles, and snippets.",
    inputSchema: {
      query: z.string().min(1).max(200).describe("Keywords or an identifier"),
      source,
      limit: z.number().int().min(1).max(25).default(8),
      section: z
        .string()
        .optional()
        .describe("Top-level section (docs) or group (platform)"),
    },
    annotations: READ_ONLY,
  },
  (a) => search(a).then(reply),
);

server.registerTool(
  "read_page",
  {
    description: "Read one page as markdown.",
    inputSchema: {
      route: z.string().min(1).describe("Route from search_docs or list_pages"),
      source,
      section_heading: z.string().optional().describe("Return only this H2"),
      offset: z.number().int().min(0).default(0),
      max_chars: z
        .number()
        .int()
        .min(1000)
        .max(MAX_PAGE_CHARS)
        .default(DEFAULT_PAGE_CHARS),
    },
    annotations: READ_ONLY,
  },
  ({ route, source, section_heading, offset, max_chars }) =>
    read({
      route,
      source,
      ...(section_heading ? { heading: section_heading } : {}),
      offset,
      maxChars: max_chars,
    }).then(reply),
);

server.registerTool(
  "list_pages",
  {
    description: "List pages with routes and titles, in sidebar order.",
    inputSchema: {
      source,
      section: z
        .string()
        .optional()
        .describe("Top-level section (docs) or group (platform)"),
    },
    annotations: READ_ONLY,
  },
  (a) => list(a).then(reply),
);

server.registerTool(
  "get_schema",
  {
    description:
      "Exact fields of a Claude Code config file or payload, from a JSON Schema or the Mod API types.",
    inputSchema: {
      name: z.string().min(1).describe("E.g. settings, tools, or types"),
      property: z.string().optional().describe("Dotted path or type name"),
      offset: z.number().int().min(0).default(0),
    },
    annotations: READ_ONLY,
  },
  (a) => schema(a).then(reply),
);

await server.connect(new StdioServerTransport());
