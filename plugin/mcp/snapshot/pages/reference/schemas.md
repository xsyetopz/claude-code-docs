---
title: "JSON Schemas"
description: "JSON Schemas for Claude Code 2.1.304 config files, made from the validators inside the program, and how they differ from the SchemaStore copies."
url: https://xsyetopz.github.io/claude-code-docs/reference/schemas
source: docs/reference/schemas.md
---

# JSON Schemas


This site publishes six JSON Schemas for the config files that Claude Code `2.1.304` checks with its own validators.
They are made by running the program's own schema code, so they list every key that this release knows.
Paste the `$schema` URL into a file and your editor can suggest keys and flag mistakes.

## The Schemas

| File kind | Where the file lives | `$schema` URL |
| --- | --- | --- |
| Settings | `~/.claude/settings.json`, `.claude/settings.json`, `.claude/settings.local.json` | `https://xsyetopz.github.io/claude-code-docs/schemas/claude-code-settings.json` |
| Managed settings | The managed settings file of your system | `https://xsyetopz.github.io/claude-code-docs/schemas/claude-code-managed-settings.json` |
| Plugin manifest | `.claude-plugin/plugin.json` | `https://xsyetopz.github.io/claude-code-docs/schemas/claude-code-plugin-manifest.json` |
| Marketplace | `.claude-plugin/marketplace.json` | `https://xsyetopz.github.io/claude-code-docs/schemas/claude-code-marketplace.json` |
| Plugin hooks | `hooks/hooks.json` in a plugin | `https://xsyetopz.github.io/claude-code-docs/schemas/claude-code-plugin-hooks.json` |
| Keybindings | `~/.claude/keybindings.json` | `https://xsyetopz.github.io/claude-code-docs/schemas/claude-code-keybindings.json` |

The managed schema has every key of the settings schema plus the keys that only managed settings honor.
Those keys carry `"x-managed-only": true`.

### Example

```json
{
  "$schema": "https://xsyetopz.github.io/claude-code-docs/schemas/claude-code-settings.json",
  "permissions": { "allow": ["Bash(bun test)"] },
  "syncClaudeAiSkills": true
}
```

## How They Are Made

The program is a single executable that carries its JavaScript and a copy of the zod 4 validator library.
The generator in `tools/schemas/` reads the executable without changing it and writes the embedded modules to a temp folder.
It adds a capture line to the two modules that hold the validators (seven captures give the six files, because the manifest and the marketplace entry each need a helper), then loads them in a child process with a fake API key, a closed proxy port, and a temp home folder.
Last, it calls the `toJSONSchema` function that is inside the program on each validator and writes the result in draft 2020-12.
Nothing is sent over the network and no real credentials are used.

Two parts need extra steps:

- The full plugin manifest is built from a base object plus one object for each component, so the generator takes the merged object.
- The marketplace file reads `plugins` as a list of unknown values and checks each entry later. The generator puts the entry schema into `plugins.items`.

## Regenerate

```sh
bun run schemas        # rewrite schemas/*.json from the installed 2.1.304 program
bun run schemas:check  # check the files, and check the good and bad examples in tools/schemas/fixtures
```

The check runs as part of `bun run verify`.

## Limits

- The program also runs checks written as code, such as "a hooks file needs `hooks` or `modules`". A JSON Schema cannot hold them, so they are missing.
- The program does not list which settings keys only work in managed settings. The generator reads that from each key's description, so a key with unusual wording can be missed. The current run found 22 top-level keys and 3 nested ones (`sandbox.bwrapPath`, `sandbox.socatPath`, `sandbox.network.allowManagedDomainsOnly`).
- The schemas allow keys they do not know in settings files, as the program does. A typo in a key name is not an error.
- The `xaaIdp` setting exists only when `CLAUDE_CODE_ENABLE_XAA=1` is set in the environment. The generator sets it, so the key is in the schema, and its description says so.
- The program uses `starts_with` and `ends_with` as `format` values for some path fields. They are not standard JSON Schema formats, so editors ignore them and do not check those rules.
- A few values the program accepts, such as `undefined`, cannot be written in JSON. The generator drops them.

## Differences From SchemaStore

We compared the files with the copies on [SchemaStore](https://json.schemastore.org/claude-code-settings.json) on 2026-10-19. Key counts are top-level keys.

| Schema | SchemaStore | This site | Notes |
| --- | --- | --- | --- |
| Settings | 142 | 169 (191 with managed-only keys) | SchemaStore lacks `syncClaudeAiSkills`, `syncClaudeAiPlugins`, `modelSettings`, `remote`, `timeZone`, `quietHours`, and 46 more (52 keys in all, 62 when managed-only keys are counted). |
| Plugin manifest | 22 | 29 | SchemaStore lacks `displayName`, `defaultEnabled`, `metadata`, `workflows`, `binaries`, `types`, `experimental`. |
| Marketplace | 9 | 10 | SchemaStore lacks `renames`. |
| Keybindings | 3 | 3 | Same keys. SchemaStore forbids unknown top-level keys; this schema does not. |
| Plugin hooks | none | 5 | SchemaStore has no schema for this file. |

SchemaStore has 25 settings keys that this site's settings schema does not. 12 of them are managed-only keys, such as `policyHelper` and `allowManagedHooksOnly`, which this site's managed schema has.
The other 13 are not in the `2.1.304` validator at all, for example `autoConnectIde`, `diffTool`, `skippedPlugins`, and `sshHostAllowlist`. Four are keys of the global config file `~/.claude.json`: `autoConnectIde`, `autoInstallIdeExtension`, `diffTool`, and `externalEditorContext`. Five are desktop-app fields that the program carries: `browserExternalPageTools`, `disableBrowserExternalNavigation`, `disableMobileSimulatorTools`, `requireCoworkFullVmSandbox`, and `sshHostAllowlist`. Four have no string in the 2.1.304 program: `permissionExplainerEnabled`, `skippedMarketplaces`, `skippedPlugins`, and `teammateDefaultModel`.

SchemaStore also has [`claude-code-launch.json`](https://json.schemastore.org/claude-code-launch.json), the Launch Preview file for preview servers in Claude Code Desktop.
This site has no copy of it. We found no validator for that file in the `claude` program, and it belongs to the Desktop app, so there is nothing to export from the binary.

## Related Pages

- [Settings](https://xsyetopz.github.io/claude-code-docs/configure/settings.md)
- [Files on Disk](https://xsyetopz.github.io/claude-code-docs/start/files-on-disk.md)
- [Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md)
- [Undocumented Features](https://xsyetopz.github.io/claude-code-docs/reference/undocumented.md)
