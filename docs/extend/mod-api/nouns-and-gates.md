---
title: Files, Nouns, and Gates
description: The files and manifest keys of a mod, every noun on the object $, the settings that stop mods, the limits, and the built-in mods.
sidebar_position: 3
---

A mod has a few files, one object named `$` with 20 nouns, and a short list of switches that can stop it.
The tables below list them all, with the limits that apply.
The one file that makes a plugin a mod is `modules` in `hooks/hooks.json`.
A manifest has no `mods` key.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | Yes. Every noun of `$` is available in a hook. |
| Can you change it? | Yes. A mod can add its own noun with an `engine.create` hook. |
| Can you turn it on or off? | `disableAllHooks`, `allowManagedHooksOnly`, `allowManagedModsOnly`, `--safe-mode`, `--bare`. |
| Where does it live? | The plugin folder, `plugin.json`, `hooks/hooks.json`, and settings files. |
| Status | <Documented /> <Gated note="Remote rollout switch for installed mods" /> |

Official pages: [Mods Reference](https://code.claude.com/docs/en/plugins/mods/reference), [Mods Overview](https://code.claude.com/docs/en/plugins/mods/overview), [Plugins Reference](https://code.claude.com/docs/en/plugins-reference), [Manage Mods for Your Organization](https://code.claude.com/docs/en/plugins/mods/admin).

## Example

```json title="hooks/hooks.json"
{ "modules": ["./register.js"] }
```

```json title=".claude/settings.json"
{ "disableAllHooks": false }
```

## Files and Manifest Keys

| Item | Status | What it does | How it works | Where it can be used |
| --- | --- | --- | --- | --- |
| `hooks/hooks.json` key `modules` | <Documented /> | The path of the hooks module. | One path only. The module and each file it imports end in `.ts`, `.tsx`, `.jsx`, `.js`, `.mjs`, `.cjs`, `.mts`, or `.cts`. The program says: `hooks.json` `modules` names one hooks module per plugin. | Plugin `hooks/` folder. |
| `register(on, options)` | <Documented /> | The export that the loader reads. Nothing else is read. | See [Hooks](hooks.md). | The hooks module. |
| Manifest key `types` | <Documented /> | Path to the type contract of the plugin. It starts with `./`. | A self-contained `.d.ts` with no import, export-from, require, or reference. It declares the noun in `declare module 'claude-code' { interface EngineInterface { ... } }` and the `PluginState` values. `claude plugin validate` checks it. | `plugin.json` |
| Manifest key `dependencies` | <Documented /> | Plugins that must be enabled. | A mod that lists a plugin here gets its contract at `.claude-plugin/types/<plugin>/index.d.ts` when the engine loads the mod from a folder the person owns. | `plugin.json` |
| Manifest key `userConfig` | <Documented /> | Fields whose values reach `register` as `options`. | Defaults are filled in. Values are in `pluginConfigs` of settings. A required field with no value fails the load. `PluginOptions` is a read-only record of string, number, boolean, or string list. | `plugin.json` |
| `.claude-plugin/types/` | <Documented /> | The engine writes `claude-code/index.d.ts`, `claude-code-tools/`, `claude-code-mcp/`, and one folder for each dependency here. | Written again after an update. A mod that has no tsconfig gets one that extends `.claude-plugin/types/tsconfig.json`. | A mod loaded from a folder the person owns. |
| Tests `*.test.ts`, `*.test.tsx` | <Documented /> | Run by `claude plugin test [dir]`. | See [Testing](testing.md). | Plugin folder. |

## The Dollar Object

`$` is the first argument of every hook.
It is frozen.
It has `plugin`, 20 nouns, and every noun that an `engine.create` hook added.
Write each call in full, such as `$.fs.read('notes.md')`.
Each `$` call is also an event with the same name, such as `fs.read`.
A hook on it can pass the call on, refuse it with `{ deny }`, or answer it with `{ value }`.
The calling hook alone is skipped, so a plugin does not trap itself.

| Item | Status | What it does | Members | Page |
| --- | --- | --- | --- | --- |
| `$.plugin` | <Documented /> | This plugin as loaded: its manifest name and its directory. | `name`, `root` | [Plugin](plugin.md) |
| `$.ui` | <Documented /> | Display: a line under an open dialog, redraws, log lines, panes, scroll, focus, the clipboard. | `notice`, `invalidate`, `blit`, `resolve`, `log`, `ask`, `toast`, `notify`, `status`, `open`, `close`, `panes`, `scroll`, `focus`, `copy`, `selection`, `view` | [UI](ui.md) |
| `$.model` | <Documented /> | Completions through the session's own client. | `complete`, `fork`, `classify` | [Model, Audio, and MCP](model-audio-mcp.md) |
| `$.audio` | <Documented /> | Sound: clip playback and platform speech. | `play`, `speak` | [Model, Audio, and MCP](model-audio-mcp.md) |
| `$.mcp` | <Documented /> | The engine's MCP servers: call a tool of a connected one, or connect one the plugin lists. | `call`, `connect` | [Model, Audio, and MCP](model-audio-mcp.md) |
| `$.session` | <Documented /> | The running session as plain data, compacting it, and sending a message to another agent or session. | `messages`, `cwd`, `root`, `model`, `turns`, `id`, `repo`, `surfaces`, `surface`, `usage`, `version`, `compact`, `send`, `append`, `identity` | [Session](session.md) |
| `$.turn` | <Documented /> | The running model turn: ending it. | `abort` | [Turn and Prompt](turn-prompt.md) |
| `$.prompt` | <Documented /> | Submitting a prompt as a user turn, and the prompt box: read, write, or propose into. | `submit`, `read`, `media`, `fill`, `suggest`, `compose` | [Turn and Prompt](turn-prompt.md) |
| `$.tool` | <Documented /> | The tools the model has in this session, and running one. | `list`, `call`, `check`, `register` | [Tool, Command, and Config](tool-command-config.md) |
| `$.command` | <Documented /> | The slash commands the person can run, and running one. | `list`, `run`, `register` | [Tool, Command, and Config](tool-command-config.md) |
| `$.config` | <Documented /> | Every row of the `/config` menu, including each enabled plugin's `userConfig` fields. | `list`, `set` | [Tool, Command, and Config](tool-command-config.md) |
| `$.telemetry` | <Documented /> | Analytics records and feature marks. | `log`, `mark` | [Telemetry](telemetry.md) |
| `$.agent` | <Documented /> | Subagents. | `spawn`, `list`, `register` | [Agent](agent.md) |
| `$.fs` | <Documented /> | The file system as the engine process reaches it. A relative path is under the session's working directory. Text is UTF-8. | `read`, `write`, `list`, `exists`, `stat`, `ancestors` | [Files, Store, and State](fs-store-state.md) |
| `$.store` | <Documented /> | This plugin's key-value store. It lasts across sessions and hot reloads. Values are JSON. | `get`, `set`, `delete`, `keys` | [Files, Store, and State](fs-store-state.md) |
| `$.state` | <Documented /> | Named values the host holds for the session, each with a version. They survive a hot reload. | `get`, `set` | [Files, Store, and State](fs-store-state.md) |
| `$.clock` | <Documented /> | Time and timers, each an event through the host. | `now`, `sleep`, `after`, `every` | [Clock, HTTP, Process, Env, and Settings](clock-http-process-env-settings.md) |
| `$.http` | <Documented /> | The network, through the host. | `fetch` | [Clock, HTTP, Process, Env, and Settings](clock-http-process-env-settings.md) |
| `$.process` | <Documented /> | Commands on the host, run as the user of the session. CLI only. | `run`, `spawn` | [Clock, HTTP, Process, Env, and Settings](clock-http-process-env-settings.md) |
| `$.settings` | <Documented /> | What the settings files, `--settings`, and managed policy hold. Read only. | `read` | [Clock, HTTP, Process, Env, and Settings](clock-http-process-env-settings.md) |
| `$.env` | <Documented /> | The environment of this process. Every Bash child, MCP server, and `$.process.run` command started later inherits it. | `get`, `set` | [Clock, HTTP, Process, Env, and Settings](clock-http-process-env-settings.md) |

## Modules

| Item | Status | What it does | How it works | Where it can be used |
| --- | --- | --- | --- | --- |
| `claude-code` | <Documented /> | Types only. `import type { Register, On, EngineInterface } from 'claude-code'`. At run time the import is empty. | Exports 585 declarations. The values `atom`, `derive`, `memberOf`, `read`, and `update` are the state helpers. See [Files, Store, and State](fs-store-state.md#state-helpers-imported-from-claude-code). | Hooks modules and contracts. |
| `claude-code/testing` | <Documented /> | The kit for `claude plugin test`: `test`, `describe`, `expect`, `mock`, `tier`. | See [Testing](testing.md). | `*.test.ts` and `*.test.tsx` |
| Globals `h`, `Fragment`, `JSX` | <Documented /> | JSX compiles against them. | See [Surfaces, Elements, and Render Sites](ui-elements.md#jsx-and-globals). | Files with JSX. |

## Gates That Stop Mods

| Item | Status | What it does | How it works | Where it can be used |
| --- | --- | --- | --- | --- |
| `disableAllHooks` | <Documented /> | No mod or hook of an installed plugin runs. | In managed settings it also stops organization mods. In user settings, what the organization manages keeps running. Built-in mods load. | Settings files. |
| `allowManagedHooksOnly` | <Documented /> | Blocks hooks and mods that are not the organization's. | The program says: hooks modules are turned off here (`disableAllHooks`, `allowManagedHooksOnly` or a policy). | Managed settings. |
| `allowManagedModsOnly` | <Documented /> | Only organization mods and built-in mods run their hooks. | An option of the built-in guard `sec-default`. | Managed settings. |
| `allowModsToOverrideDenyRules` | <Documented /> | Lets an installed mod approve a call that a `deny` rule refuses. | An option of the built-in guard. | Managed settings. |
| `prependPlugins`, `appendPlugins` | <Documented /> | Plugin ids that run before or after user mods. | Only these can call `next.to`. | Managed settings. |
| `disableSideloadFlags` | <Documented /> | Rejects `--plugin-dir` and `--plugin-url`. | None. | Managed settings. |
| `--safe-mode`, `--bare` | <Documented /> | No installed hooks module loads. | The program says: installed plugins are disabled, none of their hooks or hooks modules load, built-in plugins load regardless. | CLI flags. |
| Rollout switch | <Gated note="Remote flag, name not shown in the program strings" /> | Installed hooks modules wait for a rollout flag. A message says installed mods are turned off remotely. | Built-in plugins and organization plugins load regardless. | Installed plugins. |
| `CLAUDE_CODE_PLUGIN_DIRS`, `CLAUDE_CODE_PLUGIN_DIR_WATCH` | <Documented /> | Load plugin dirs as `--plugin-dir` does, and reload on save in a non-interactive session. | None. | Environment. |

## Limits

Hooks and Mod API calls run under time and size limits.
Claude Code skips a hook that is too slow.

| Limit | Value |
| --- | --- |
| Own time of one hook for one event | 10 seconds, or 50 milliseconds for a `prompt.edit` hook (from the docs; not checked in the program) |
| A `.catch` handler | 1 second |
| All `session.end` hooks together | 1.5 seconds unless you change the `SessionEnd` hook budget |
| `$.process.run` | 30 seconds by default, 10 minutes at most |
| `$.model.complete` `maxTokens` | 1024 by default, up to 64,000 or the output limit of the model |
| `$.fs.read` and `$.fs.write` | 4 MiB for one file |
| `$.http.fetch` body and response | 4 MiB each, 30 seconds, 5 redirects |
| `$.store` | 4 MiB of JSON in all |
| `$.session.messages()` | The newest 4,096 entries |
| `$.ui.invalidate('ui.render')` | 10 redraws a second, or 30 in the terminal for the visible pane |
| `$.ui.toast` | 4 seconds unless you pass `timeoutMs` |
| A pane that nobody asked for | Placed from 144 terminal columns, 110 after the person opened it once |
| Names of commands, tools, subagent types, and panes | Letters, digits, `_`, and `-`, up to 64 characters |
| One `claude plugin test` test | 5 seconds unless the test sets `timeoutMs` |

## Built-in Mods

Six built-in plugins ship in the program.
The settings and flags that stop installed mods do not stop them.

| Name in `/plugin` | What it does |
| --- | --- |
| `cc-plugin-agents-md` | Loads `AGENTS.md` as project instructions. |
| `cc-plugin-diff` | Takes over `/diff` and draws its pane. |
| `cc-plugin-plugin-authoring` | Gives Claude the `plugin-authoring` skill for writing mods. It holds no mod code. |
| `cc-plugin-sec-default` | Guards what your organization manages from the mods a user installs. You cannot turn it off. |
| `cc-plugin-telemetry` | Sends the analytics records that Claude Code and its built-in mods log. |
| `cc-plugin-you-should-know` | Shows a note above the prompt when a side agent finds something you might have missed. Off until you turn it on. |

## Related Pages

- [Mod API Overview](index.md)
- [Hooks, `on`, and `next`](hooks.md)
