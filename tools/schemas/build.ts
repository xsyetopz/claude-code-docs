import {
  agentsJson,
  control,
  hookOutput,
  streamJson,
  tools,
} from "./payloads/build.ts";

// Turns the raw toJSONSchema output into the published files (design D2).
export type Json = { [key: string]: unknown };
export type RawSchemas = Record<string, Json>;

export const BASE_URL = "https://xsyetopz.github.io/claude-code-docs/schemas";

export const FILES = {
  "claude-code-settings.json": {
    title: "Claude Code settings.json",
    what: "settings.json (user, project, local)",
  },
  "claude-code-managed-settings.json": {
    title: "Claude Code managed-settings.json",
    what: "managed settings (settings.json keys plus managed-only keys)",
  },
  "claude-code-plugin-manifest.json": {
    title: "Claude Code plugin.json",
    what: ".claude-plugin/plugin.json",
  },
  "claude-code-marketplace.json": {
    title: "Claude Code marketplace.json",
    what: ".claude-plugin/marketplace.json",
  },
  "claude-code-plugin-hooks.json": {
    title: "Claude Code plugin hooks.json",
    what: "hooks/hooks.json inside a plugin",
  },
  "claude-code-keybindings.json": {
    title: "Claude Code keybindings.json",
    what: "~/.claude/keybindings.json",
  },
  "claude-code-mcp.json": {
    title: "Claude Code .mcp.json",
    what: ".mcp.json (project MCP servers)",
    anchor:
      'the schema module with the text "Command cannot be empty" and "authServerMetadataUrl must use https://" (the {mcpServers: record(string, server)} wrapper)',
  },
  "claude-code-hook-output.json": {
    title: "Claude Code hook output",
    what: "the JSON a classic command hook prints on stdout (common fields and one hookSpecificOutput variant per event)",
    anchor:
      'the SDK schema module, object with continue, suppressOutput, stopReason, decision, systemMessage and the description "A terminal escape sequence"',
  },
  "claude-code-tools.json": {
    title: "Claude Code built-in tool payloads",
    what: "the input and result of each built-in tool (definitions <Tool>Input and <Tool>Result)",
    anchor:
      "the tool factory that copies a tool definition's properties (getters included), read as inputSchema and outputSchema on each tool",
  },
  "claude-code-control-protocol.json": {
    title: "Claude Code control protocol",
    what: "the request and response of each control_request subtype in stream-json mode (definitions <subtype>Request and <subtype>Response, direction in x-direction)",
    anchor:
      'the SDK schema module, table of rows {request, originator, response}; the request union is described as "Control requests a client sends to drive the loop"',
  },
  "claude-code-stream-json.json": {
    title: "Claude Code stream-json messages",
    what: "each message type the CLI writes (<type>[_<subtype>]Output) and reads (<type>Input) in stream-json mode",
    anchor:
      'the SDK schema module, unions described as "Everything the CLI writes to its output stream" and "Everything a client may write to the CLI\'s input stream"',
  },
  "claude-code-agents-json.json": {
    title: "Claude Code --agents JSON entry",
    what: "one subagent definition of the --agents JSON (and the SDK agents option)",
    anchor:
      'the SDK schema module, object described as "Definition for a custom subagent that can be invoked via the Agent tool."',
  },
} as const;
export const KINDS = Object.keys(FILES) as (keyof typeof FILES)[];
/** Schemas that tools/schemas/code.ts writes from the program's code (no zod validator to export). */
export const CODE_FILES = [
  "claude-code-status-line.json",
  "claude-code-transcript.json",
  "claude-code-otel.json",
  "claude-code-frontmatter.json",
  "claude-code-claude-json.json",
] as const;

// The binary has no list of managed-only settings. It says so in each key's description, so the descriptions
// are the source (same rules as the claudetto schema generator). Rules run on top-level and nested properties.
const MANAGED_ONLY = [
  /\bonly (?:honou?red |read |enforced |applies )?(?:from|in) (?:the )?(?:admin-controlled |device )?(?:managed|policy)/i,
  /\b(?:honou?red|read|enforced) only (?:from|in) (?:the )?(?:admin-controlled |device )?(?:managed|policy|HKLM)/i,
  /(?:^|[.(] ?|\bRead from )managed settings only/i,
  /\(and set in (?:device )?managed settings/i,
  /^When set in managed settings/,
];
export const isManagedOnly = (description: unknown): boolean =>
  typeof description === "string" &&
  MANAGED_ONLY.some((re) => re.test(description));

const isObject = (v: unknown): v is Json =>
  typeof v === "object" && v !== null && !Array.isArray(v);

// Marks (strip=false) or removes (strip=true) managed-only keys. Walks properties and array items.
export const applyManaged = (schema: Json, strip: boolean): Json => {
  const out: Json = {};
  for (const [k, v] of Object.entries(schema)) {
    if (k === "properties" && isObject(v)) {
      const props: Json = {};
      for (const [key, sub] of Object.entries(v)) {
        if (!isObject(sub)) {
          props[key] = sub;
          continue;
        }
        const managed = isManagedOnly(sub["description"]);
        if (managed && strip) continue;
        const next = applyManaged(sub, strip);
        props[key] = managed ? { ...next, "x-managed-only": true } : next;
      }
      out[k] = props;
    } else if (
      k === "required" &&
      Array.isArray(v) &&
      strip &&
      isObject(schema["properties"])
    ) {
      const keep = new Set(Object.keys(out["properties"] as Json));
      out[k] = v.filter((x) => keep.has(String(x)));
    } else if (k === "items" && isObject(v)) {
      out[k] = applyManaged(v, strip);
    } else {
      out[k] = v;
    }
  }
  return out;
};

// The binary reads marketplace "plugins" as unknown[] and checks every entry with its own schema afterwards,
// so the plain conversion leaves "items" empty. Put the entry schema there.
const graftPluginEntries = (marketplace: Json, entry: Json): Json => {
  const props = marketplace["properties"];
  if (!isObject(props) || !isObject(props["plugins"]))
    throw new Error("marketplace schema has no plugins property");
  const { $schema: _drop, ...item } = entry as Json & { $schema?: unknown };
  void _drop;
  // The entry type is a partial of the manifest, so zod leaves "source" optional. Entries need it
  // (a bad entry is stubbed or dropped), and "." is accepted: the binary maps "." to "./" before checking.
  const itemProps = item["properties"];
  if (isObject(itemProps) && isObject(itemProps["source"])) {
    const source = itemProps["source"];
    if (Array.isArray(source["anyOf"]))
      source["anyOf"] = [{ const: "." }, ...source["anyOf"]];
  }
  const required = Array.isArray(item["required"]) ? item["required"] : [];
  item["required"] = [...new Set([...required, "source"])];
  return {
    ...marketplace,
    properties: { ...props, plugins: { ...props["plugins"], items: item } },
  };
};

// An undefined arm in a union only means "may be absent", which JSON Schema already says. Drop it.
export const pruneUnrepresentable = (node: unknown): unknown => {
  if (Array.isArray(node)) return node.map(pruneUnrepresentable);
  if (!isObject(node)) return node;
  const out: Json = {};
  for (const [k, v] of Object.entries(node)) {
    if ((k === "anyOf" || k === "oneOf") && Array.isArray(v)) {
      const kept = v.filter(
        (x) => !(isObject(x) && x["x-cc-unrepresentable"] === true),
      );
      out[k] = kept.map(pruneUnrepresentable);
    } else {
      out[k] = pruneUnrepresentable(v);
    }
  }
  if (out["x-cc-unrepresentable"] === true) {
    delete out["x-cc-unrepresentable"];
  }
  return out;
};

// The binary adds this key only when the environment variable is set; say so in the key's description.
const noteGatedKeys = (settings: Json): Json => {
  const props = settings["properties"];
  if (!isObject(props) || !isObject(props["xaaIdp"])) return settings;
  const key = props["xaaIdp"];
  const description =
    `${String(key["description"] ?? "").trim()} Only applies when CLAUDE_CODE_ENABLE_XAA=1 is set in the environment; Claude Code ignores this key otherwise.`.trim();
  return {
    ...settings,
    properties: { ...props, xaaIdp: { ...key, description } },
  };
};

const anchorNote = (name: keyof typeof FILES): string => {
  const { anchor } = FILES[name] as { anchor?: string };
  return anchor ? ` Anchor: ${anchor}.` : "";
};

const withHeader = (
  name: keyof typeof FILES,
  body: Json,
  version: string,
): Json => {
  const { $schema: _drop, ...rest } = body as Json & { $schema?: unknown };
  void _drop;
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: `${BASE_URL}/${name}`,
    title: `${FILES[name].title} (Claude Code ${version})`,
    $comment: `For ${FILES[name].what}. Generated from Claude Code ${version} by calling the zod v4 toJSONSchema embedded in the binary on its own validator (method A, runtime export).${anchorNote(name)} Do not edit by hand: run "bun run schemas".`,
    ...rest,
  };
};

export const buildFiles = (
  raw: RawSchemas,
  version: string,
): Record<keyof typeof FILES, Json> => {
  const need = (k: string) => {
    const v = raw[k];
    if (!v) throw new Error(`missing raw schema "${k}"`);
    return pruneUnrepresentable(v) as Json;
  };
  const payloads = pruneUnrepresentable(raw) as RawSchemas;
  const toolDefs = tools(payloads);
  return {
    "claude-code-settings.json": withHeader(
      "claude-code-settings.json",
      noteGatedKeys(applyManaged(need("settings"), true)),
      version,
    ),
    "claude-code-managed-settings.json": withHeader(
      "claude-code-managed-settings.json",
      noteGatedKeys(applyManaged(need("settings"), false)),
      version,
    ),
    "claude-code-plugin-manifest.json": withHeader(
      "claude-code-plugin-manifest.json",
      need("plugin-manifest"),
      version,
    ),
    "claude-code-marketplace.json": withHeader(
      "claude-code-marketplace.json",
      graftPluginEntries(need("marketplace"), need("marketplace-plugin-entry")),
      version,
    ),
    "claude-code-plugin-hooks.json": withHeader(
      "claude-code-plugin-hooks.json",
      need("plugin-hooks"),
      version,
    ),
    "claude-code-keybindings.json": withHeader(
      "claude-code-keybindings.json",
      need("keybindings"),
      version,
    ),
    "claude-code-mcp.json": withHeader(
      "claude-code-mcp.json",
      need("mcp"),
      version,
    ),
    "claude-code-hook-output.json": withHeader(
      "claude-code-hook-output.json",
      hookOutput(payloads),
      version,
    ),
    "claude-code-tools.json": withHeader(
      "claude-code-tools.json",
      {
        ...(toolDefs.missing.length
          ? {
              description: `The program did not give these definitions: ${toolDefs.missing.join(", ")}.`,
            }
          : {}),
        ...toolDefs.body,
      },
      version,
    ),
    "claude-code-control-protocol.json": withHeader(
      "claude-code-control-protocol.json",
      control(payloads),
      version,
    ),
    "claude-code-stream-json.json": withHeader(
      "claude-code-stream-json.json",
      streamJson(payloads),
      version,
    ),
    "claude-code-agents-json.json": withHeader(
      "claude-code-agents-json.json",
      agentsJson(payloads),
      version,
    ),
  };
};
