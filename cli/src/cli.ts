#!/usr/bin/env bun
// clawdipedia: four doc sources (clawdipedia, platform, code, anthropic) from a shell. A front end on the same core as the MCP server.
// Exit codes: 0 a result, 1 no result (no hit, unknown page, unknown schema property), 2 a usage error.
import { parseArgs } from "node:util";
import {
  DOC_SOURCES,
  type DocSourceName,
  isDocSource,
  list,
  type Result,
  read,
  schema,
  search,
} from "../../plugin/mcp/src/core.ts";

const USAGE = `Usage: clawdipedia <command> [options]

Commands:
  search <query>             Rank pages for keywords or an identifier
  read <route>               Print one page as markdown
  list [prefix]              List pages, or the pages of one section
  schema <name> [property]   Print a JSON Schema outline, one property, or a Mod API type

Options:
  --source <name>            clawdipedia (default): unofficial Claude Code Docs. platform: platform.claude.com/docs.
                             code: code.claude.com/docs. anthropic: www.anthropic.com (news, research, legal)
  --section <heading>        read: print only the H2 section with this heading
  --limit <n>                search: most hits, 1 to 25 (default 8)
  --offset <n>               read, schema: character offset to continue a long output
  --json                     Print JSON in place of text
  --help                     Print this help (also: clawdipedia <command> --help)

Each text output ends with a "Source:" line (live, cache, or offline cache).
Exit codes: 0 a result, 1 no result, 2 usage error.
`;

const COMMANDS = {
  search:
    "Usage: clawdipedia search <query> [--source clawdipedia|platform|code|anthropic] [--limit <n>] [--json]\n\nRanks pages for keywords or an identifier (clawdipedia search PreToolUse).\nPrints the route, title, URL, and a snippet for each hit.\nThe first search reads one prebuilt index file and caches it.\n",
  read: "Usage: clawdipedia read <route> [--source clawdipedia|platform|code|anthropic] [--section <heading>] [--offset <n>] [--json]\n\nPrints one page as markdown. A route comes from search or list, for example configure/status-line.\n--section prints only the H2 section with that heading.\nA long page ends its header line with the offset for --offset.\n",
  list: "Usage: clawdipedia list [prefix] [--source clawdipedia|platform|code|anthropic] [--json]\n\nLists pages in sidebar order. A prefix is a top-level section (clawdipedia) or a group or section (the other sources), for example configure.\n",
  schema:
    "Usage: clawdipedia schema <name> [property] [--offset <n>] [--json]\n\nPrints the outline of a JSON Schema (settings, tools, hook-output, ...), one property of it (hooks.PreToolUse), or a definition (BashInput.command).\nWith the name types, prints names of the Mod API type file, or the type, member, call, or event that the property names.\n",
} as const;
type Command = keyof typeof COMMANDS;
const isCommand = (s: string | undefined): s is Command =>
  s !== undefined && Object.hasOwn(COMMANDS, s);

class UsageError extends Error {}

const parse = (argv: string[]) => {
  try {
    return parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        source: { type: "string" },
        section: { type: "string" },
        limit: { type: "string" },
        offset: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" },
      },
    });
  } catch (e) {
    throw new UsageError(e instanceof Error ? e.message : String(e));
  }
};

const int = (name: string, v: string | undefined, min: number, max: number) => {
  if (v === undefined) return undefined;
  const n = Number(v);
  if (!Number.isInteger(n) || n < min || n > max)
    throw new UsageError(
      `--${name} needs a whole number from ${min} to ${max}`,
    );
  return n;
};

/** Runs a command. Returns the exit code. Output goes to stdout, messages and misses to stderr. */
const run = async (argv: string[]): Promise<number> => {
  const { values, positionals } = parse(argv);
  const [command, ...args] = positionals;
  if (!command) {
    if (values.help) {
      process.stdout.write(USAGE);
      return 0;
    }
    throw new UsageError("missing command");
  }
  if (!isCommand(command)) throw new UsageError(`unknown command "${command}"`);
  if (values.help) {
    process.stdout.write(COMMANDS[command]);
    return 0;
  }
  const only = (opt: keyof typeof values, ...on: Command[]) => {
    if (values[opt] !== undefined && !on.includes(command))
      throw new UsageError(`--${opt} does not apply to ${command}`);
  };
  only("source", "search", "read", "list");
  only("section", "read");
  only("limit", "search");
  only("offset", "read", "schema");
  const source = values.source ?? "clawdipedia";
  if (!isDocSource(source))
    throw new UsageError(
      `--source needs one of ${DOC_SOURCES.join(", ")}, not "${source}"`,
    );
  const src: DocSourceName = source;
  const need = (min: number, max: number, what: string) => {
    if (args.length < min || args.length > max)
      throw new UsageError(`${command} needs ${what}`);
  };

  let r: Result;
  let empty = false;
  switch (command) {
    case "search": {
      need(1, Number.MAX_SAFE_INTEGER, "<query>");
      const limit = int("limit", values.limit, 1, 25);
      r = await search({
        query: args.join(" "),
        source: src,
        ...(limit ? { limit } : {}),
      });
      empty = r.ok && (r.data["hits"] as unknown[]).length === 0;
      break;
    }
    case "read": {
      need(1, 1, "<route>");
      const offset = int("offset", values.offset, 0, Number.MAX_SAFE_INTEGER);
      r = await read({
        route: args[0] as string,
        source: src,
        ...(values.section ? { heading: values.section } : {}),
        ...(offset ? { offset } : {}),
      });
      break;
    }
    case "list":
      need(0, 1, "at most one [prefix]");
      r = await list({ source: src, ...(args[0] ? { section: args[0] } : {}) });
      break;
    case "schema": {
      need(1, 2, "<name> [property]");
      const offset = int("offset", values.offset, 0, Number.MAX_SAFE_INTEGER);
      r = await schema({
        name: args[0] as string,
        ...(args[1] ? { property: args[1] } : {}),
        ...(offset ? { offset } : {}),
      });
      break;
    }
  }
  // A miss prints its message on stderr; with --json an empty search still prints its JSON.
  if (!r.ok || (empty && !values.json)) {
    process.stderr.write(`${r.text}\n`);
    return 1;
  }
  if (values.json) process.stdout.write(`${JSON.stringify(r.data, null, 2)}\n`);
  else process.stdout.write(`${r.text}\n`);
  return empty ? 1 : 0;
};

try {
  process.exitCode = await run(process.argv.slice(2));
} catch (e) {
  if (!(e instanceof UsageError)) throw e;
  process.stderr.write(`clawdipedia: ${e.message}\n\n${USAGE}`);
  process.exitCode = 2;
}
