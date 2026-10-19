// Turns the raw toJSONSchema output into the six published files (design D2).
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
} as const;
export const KINDS = Object.keys(FILES) as (keyof typeof FILES)[];

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
export function applyManaged(schema: Json, strip: boolean): Json {
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
}

// The binary reads marketplace "plugins" as unknown[] and checks every entry with its own schema afterwards,
// so the plain conversion leaves "items" empty. Put the entry schema there.
function graftPluginEntries(marketplace: Json, entry: Json): Json {
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
}

// An undefined arm in a union only means "may be absent", which JSON Schema already says. Drop it.
function pruneUnrepresentable(node: unknown): unknown {
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
}

// The binary adds this key only when the environment variable is set; say so in the key's description.
function noteGatedKeys(settings: Json): Json {
  const props = settings["properties"];
  if (!isObject(props) || !isObject(props["xaaIdp"])) return settings;
  const key = props["xaaIdp"];
  const description =
    `${String(key["description"] ?? "").trim()} Only applies when CLAUDE_CODE_ENABLE_XAA=1 is set in the environment; Claude Code ignores this key otherwise.`.trim();
  return {
    ...settings,
    properties: { ...props, xaaIdp: { ...key, description } },
  };
}

function withHeader(
  name: keyof typeof FILES,
  body: Json,
  version: string,
): Json {
  const { $schema: _drop, ...rest } = body as Json & { $schema?: unknown };
  void _drop;
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: `${BASE_URL}/${name}`,
    title: `${FILES[name].title} (Claude Code ${version})`,
    $comment: `For ${FILES[name].what}. Generated from Claude Code ${version} by calling the zod v4 toJSONSchema embedded in the binary on its own validator (method A, runtime export). Do not edit by hand: run "bun run schemas".`,
    ...rest,
  };
}

export function buildFiles(
  raw: RawSchemas,
  version: string,
): Record<keyof typeof FILES, Json> {
  const need = (k: string) => {
    const v = raw[k];
    if (!v) throw new Error(`missing raw schema "${k}"`);
    return pruneUnrepresentable(v) as Json;
  };
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
  };
}
