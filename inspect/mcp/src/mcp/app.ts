import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import pkg from "../../package.json" with { type: "json" };

export const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;
// `code` and `release` write the cache of cleaned code; `release` `notes` runs `gh release view`, and `code` `read`
// with `view: "readable"` runs `bunx @wakaru/cli`.
export const WRITES_CACHE = {
  ...READ_ONLY,
  readOnlyHint: false,
} as const;
export const MAX_CHARS = 40000;

export type Out = {
  content: { type: "text"; text: string }[];
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
};
export const text = (t: string, data?: Record<string, unknown>): Out => ({
  content: [{ type: "text", text: t }],
  ...(data && { structuredContent: data }),
});
/** Run a tool body; an error becomes a tool error with its message. */
export const run = async (f: () => Out | Promise<Out>): Promise<Out> => {
  try {
    return await f();
  } catch (e) {
    return {
      content: [{ type: "text", text: `Error: ${(e as Error).message}` }],
      isError: true,
    };
  }
};
export const clip = (s: string, n: number) =>
  s.length > n ? `${s.slice(0, n)}… (${s.length - n} more chars)` : s;
export const regex = (pattern: string, isRegex: boolean) =>
  new RegExp(
    isRegex ? pattern : pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );

export const server = new McpServer({
  name: "cc-inspect",
  version: pkg.version,
});

// Shared parameters: the same name means the same thing in each tool.
export const P = {
  version: z
    .string()
    .optional()
    .describe(
      "Claude Code version or binary path; default: the current install.",
    ),
  query: z.string().min(1).optional().describe("Text to find."),
  regex: z
    .boolean()
    .optional()
    .describe("Treat query as a regular expression."),
  name: z
    .string()
    .optional()
    .describe("Name or filter (any case where it filters)."),
  module: z.string().optional().describe('Module name, e.g. "chunk-abc.js".'),
  offset: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).max(400).optional(),
};

export type Args = Record<string, unknown> & {
  action?: string;
  version?: string;
  query?: string;
  regex?: boolean;
  name?: string;
  module?: string;
  offset?: number;
  limit?: number;
};
/** One tool whose operations are the values of `action`; each handler gets the parsed arguments. */
export const group = <A extends Args>(
  tool: string,
  description: string,
  key: "action" | "kind",
  handlers: Record<string, (a: A) => Out | Promise<Out>>,
  extra: Record<string, z.ZodType>,
  annotations: Record<string, boolean> = READ_ONLY,
) =>
  server.registerTool(
    tool,
    {
      description,
      inputSchema: {
        [key]: z
          .string()
          .optional()
          .describe(`One of: ${Object.keys(handlers).join(", ")}.`),
        ...extra,
      },
      annotations,
    },
    (a: Record<string, unknown>) =>
      run(() => {
        const k = String(a[key] ?? "");
        const h = Object.hasOwn(handlers, k) ? handlers[k] : undefined;
        if (!h)
          throw new Error(
            `unknown ${key} "${k}"; ${key}s: ${Object.keys(handlers).filter(Boolean).join(", ")}`,
          );
        return h(a as A);
      }),
  );

export const need = (v: string | undefined, what: string): string => {
  if (!v) throw new Error(`give ${what}`);
  return v;
};
