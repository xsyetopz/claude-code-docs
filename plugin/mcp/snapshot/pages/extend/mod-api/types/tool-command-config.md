---
title: "Tool, Command, and Config Types"
description: "Types behind $.tool, $.command, and $.config: tool calls, permission checks, command runs, and /config rows."
url: https://xsyetopz.github.io/claude-code-docs/extend/mod-api/types/tool-command-config
source: docs/extend/mod-api/types/tool-command-config.md
---

# Tool, Command, and Config Types


These are the types behind `$.tool`, `$.command`, and `$.config`.
They describe a tool call, a permission check, a command run, and a row of the `/config` menu.

## Example

The first call asks the permission system about a tool call. The second line reads the messages of a subagent that made a tool use.

```ts
const { decision } = await $.tool.check({ tool: "Read", input })
if (use.agentId) child = await $.session.messages({ agentId: use.agentId })
```

## Types without Fields

These types are aliases, unions, or plain shapes. Each row gives its use and its shape.

| Type | Status | What it is for | Shape and limits |
| --- | --- | --- | --- |
| `BuiltinToolInputs` | [Documented] | The arguments of each built-in tool by name, for declaration merging, empty until a declaration file adds entries, then `e.tool === "Bash"` narrows `e` to Bash's arguments. | Interface. The engine lays this build's set beside a mod it loads (claude-code-tools/index.d.ts), from each tool's input schema. |
| `BuiltinToolName` | [Documented] | The names of the built-in tools. | Alias of `keyof BuiltinToolInputs & string`. |
| `BuiltinToolResults` | [Documented] | The structured result of each built-in tool by name, for declaration merging, empty until a declaration file adds entries, then after `e.tool === "Bash"` the `result` of `next(e)` is Bash's record. | Interface. The engine lays this build's set beside a mod it loads (claude-code-tools/index.d.ts), from each tool's output schema, a tool without one is `unknown`. |
| `CommandDescribeResult` | [Documented] | What a `command.describe` hook returns: the description, hint and hidden flag the menu uses, the name, `immediate` and `provider` stay as they were. | Alias of `Omit<CommandDescribeInput, 'command' \| 'immediate' \| 'provider'>`. Used by `command.describe`, `$.command.describe`. |
| `CommandSource` | [Documented] | Where a slash command comes from, as `$.command.list()` tells them apart. | Alias of `'builtin' \| 'plugin' \| 'user' \| 'mcp'`. `builtin` ships with Claude Code. `user` is the person's or project's own file. |
| `ConfigDescribeResult` | [Documented] | What a `config.describe` hook returns: the label, help text and hidden flag the menu uses, the key and provider stay as they were. | Alias of `Omit<ConfigDescribeInput, 'key' \| 'provider'>`. Used by `config.describe`, `$.config.describe`. |
| `ConfigKind` | [Documented] | How a `/config` row takes its value: `boolean` toggles, `choice` picks one of its `options`, `text` takes a string, `number` a number. | Alias of `'boolean' \| 'choice' \| 'text' \| 'number'`. |
| `ConfigSetArgs` | [Documented] | `config.set`'s input as a plugin's `$.config.set(args)` takes it: the row's key and the value, the engine fills the rest. | Alias of `Pick<ConfigSetInput, 'key' \| 'value'>`. Used by `$.config.set`. |
| `ConfigValue` | [Documented] | A `/config` row's value as a hook and `$.config` see it: a toggle's boolean, a choice's or a text's string, a number, or a list of strings. | Alias of `boolean \| string \| number \| readonly string[]`. |
| `ToolCallArgs` | [Documented] | `tool.call`'s input as the call takes it: `tool_use_id` and `agentId` may ride along (a hook passing its event's input on) and are dropped. | Alias of `ToolCallEnvelope extends infer I ? I extends ToolCallEnvelope ? Omit<I, 'tool_use_id'> & ToolCallReserved<I['tool']> : never : never`. The run gets its own id and runs in the session's loop. |
| `ToolCallEnvelope` | [Documented] | The envelope the two tool events share: the tool, the id of this call, and the tool's arguments spread beside them (`e.command` for Bash). | Alias of `BuiltinToolCallInput \| McpToolCallInput`. A union keyed by `tool`. After `if (e.tool === "Bash")`, `e.command` is a string. |
| `ToolCallInput` | [Documented] | The input of `tool.call`: the tool, the id of this call, the tool's arguments beside them (`e.command` for Bash), and `agentId` in a subagent. | Alias of `ToolCallEnvelope & AgentLoop & ToolRequestMeta`. `tool`, `tool_use_id`, and `agentId` are reserved. A rewrite of any is refused. Used by `tool.call`. |
| `ToolCallOverloads` | [Documented] | `$.tool.call(input)`: resolves with `result` typed for the tool `input` names (ToolCallResult), or loosely for an input that names none literally. | Alias of `{ <T extends string>(input: ToolCallArgs & ToolNamed<T>): Promise<ToolCallResult<T>>, (input: ToolCallArgs): Promise<ToolCallResult>, }`. Used by `$.tool.call`. |
| `ToolCheckArgs` | [Documented] | `tool.check`'s input as `$.tool.check` takes it: the tool and its arguments, the call's id, `agentId` and the ceiling are the engine's to set. | Alias of `Pick<ToolCheckInput, 'tool' \| 'input'>`. Used by `$.tool.check`. |
| `ToolCheckDecider` | [Documented] | Who an ask is put to, where that is not a dialog here: `host`, the program that answers a hosted session's asks, or a served call's own session. | Alias of `'host'`. |
| `ToolCheckDecision` | [Documented] | The verdict of `tool.check`: run the tool, put it to the mode's decider (the dialog, the auto-mode classifier, a headless host), or refuse it. | Alias of `'allow' \| 'ask' \| 'deny'`. |
| `ToolDeferral` | [Documented] | Where a `tool.describe` answer places the tool: `true` behind ToolSearch (its schema loads when the model asks for it), `false` in the prompt's list. | Alias of `boolean`. Left out of an answer, the placement beneath stands. |
| `ToolResultOf` | [Documented] | The structured result of the tool named `Name`: its BuiltinToolResults entry for a built-in tool, else `unknown`. | Alias of the result type of a tool by name. `Agent` also allows a teammate or call record. `unknown` covers an MCP tool or an unknown name. |

## Types with Fields

Each type below has its own table of fields.

### `BuiltinToolCallInput`

One variant per built-in tool, with none in the table (a plugin author's project with no tools entry laid), one loose variant over every name. Alias of `[BuiltinToolName] extends [never] ? BuiltinToolCallInputFallback : { [N in BuiltinToolName]: ToolInputOf<N, BuiltinToolInputs[N]>, }[BuiltinToolName]`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `[N in BuiltinToolName]` | [Documented] | Not described in the type file. | Type: `ToolInputOf<N, BuiltinToolInputs[N]>`. |

### `BuiltinToolCallInputFallback`

The built-in branch's answer when no built-in tool is declared: every name, its args unconstrained.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `tool` | [Documented] | The name of the tool being called (`Bash`), comparing it narrows `e` once the table has entries. Reserved: a rewrite of it is ignored by core. | Type: `string`. |
| `tool_use_id` | [Documented] | The tool_use block's id: the same at every event of the call and in `$.ui.notice`. Reserved: a rewrite of it is ignored by core. | Type: `string`. |
| `[argument: string]` | [Documented] | Not described in the type file. | Type: `unknown`. |

### `CommandDescribeInput`

The input of `command.describe`: how one slash command presents in the typeahead and `/help`, at the moment the engine lists it. Used by `command.describe`, `$.command.describe`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `command` | [Documented] | Names the command without its slash, the key a matcher narrows on. A rewrite is refused. | Type: `string`. |
| `description` | [Documented] | The one-line description the menu shows, as the command declares it. | Type: `string`. |
| `argumentHint` | [Documented] | The hint drawn dim after the name (`[name]`), when the command has one. | Type: `string`. Optional. |
| `isHidden` | [Documented] | Whether the typeahead and `/help` leave the command out, a hidden command still runs when typed in full. | Type: `boolean`. |
| `immediate` | [Documented] | Whether the command declares it runs at once when typed mid-turn, instead of waiting for the turn to end. | Type: `boolean`. One that decides per invocation reads false. Read only: not part of what a hook answers, and a rewrite is refused. |
| `provider` | [Documented] | Who provides this command: the plugin and its tier, `{ plugin: "engine", tier: "core" }` for a built-in. Pinned: a rewrite is refused. | Type: `Origin`. |

### `CommandInfo`

One slash command as `$.command.list()` returns it. Used by `$.command.list`, `command.list`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | [Documented] | What the person runs it by, without the slash. | Type: `string`. |
| `description` | [Documented] | The one line the typeahead shows for it. | Type: `string`. |
| `source` | [Documented] | Where it comes from (CommandSource). | Type: `CommandSource`. |
| `plugin` | [Documented] | Which plugin added it, when `source` is `plugin` and the engine knows: the one that registered it, or whose manifest carries it. | Type: `string`. Optional. |

### `CommandPresentation`

Where a command's answer will show: which of the terminal's two layouts the surface renders, and how wide it is when the command runs. A fact that the engine stamps on `command.run`, so a command can suit the room it has. A pane docks from 110 columns in fullscreen.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `isFullscreen` | [Documented] | True under the fullscreen (alternate-screen) layout, false on the main screen (`CLAUDE_CODE_NO_FLICKER=0`, tmux by default) and headless. | Type: `boolean`. The fact `RenderViewport`'s `isFullscreen` carries on every terminal drawing, from the same source: the two agree. |
| `columns` | [Documented] | The terminal's width in cells as the command runs, 80 where no terminal has measured (headless with no tty). | Type: `number`. |

### `CommandRunArgs`

`command.run`'s input as a plugin's `$.command.run` takes it: `args` may be left out (`/command`, bare), `origin` and `presentation` the engine sets. Combines `CommandRunArgs`, `CommandRunInput`. Used by `$.command.run`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `args` | [Documented] | Everything after the name, as the person would type it, left out, `""`. | Type: `string`. Optional. |

### `CommandRunInput`

The input of `command.run`: one slash command about to run, the way the person typed it (`/name args`), and where the run came from. Used by `command.run`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `command` | [Documented] | Names the command without its slash (`compact`, `hello`), aliases and folds resolved, the key a matcher narrows on. A rewrite is refused. | Type: `string`. |
| `args` | [Documented] | Everything after the name, as typed (`""` when nothing was), a hook rewrites it with `next({ ...e, args })`. | Type: `string`. |
| `origin` | [Documented] | Where the run came from, in `prompt.submit`'s words (PromptOrigin): the person's Enter (`composer`), the bridge, the SDK, or a plugin. | Type: `PromptOrigin`. A plugin's `$.command.run` reads `{ kind: 'plugin', name }`. `next(e)` passes it on as received. |
| `presentation` | [Documented] | Where the command's answer will show (CommandPresentation): the fullscreen layout or the main screen, and the terminal's width. | Type: `CommandPresentation`. Pinned: the engine stamps it, `next(e)` passes it on, a rewrite that leaves it out keeps it and one that changes it is refused. |

### `CommandRunResult`

What a `command.run` hook returns and what `next(e)` and `$.command.run` resolve to: the command's output text and the notes it leaves the model. `text` is what the command printed and `context` is what it recorded for the model. A hook that answers without `next` runs no command. Used by `command.run`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | [Documented] | The command's output as a transcript line, or undefined when the command showed nothing as text (a panel, a prompt for the model). | Type: `string`. Optional. |
| `context` | [Documented] | What the model reads after the command's output and the person never sees, each entry one hidden user message recorded after the output row. | Type: `readonly string[]`. Optional. The notes that the command left the model. Absent when none. |
| `exitCode` | [Documented] | What the process exits with when this command was the whole prompt of a headless run (`claude -p "/lint"`): a whole number from 0 to 255. | Type: `number`. Optional. Left out, the run exits as it would have. Any other value fails the hook. An interactive session ignores it. |
| `ref` | [Documented] | Set by core on what `next(e)` resolves to: names the engine's run of the command (its result stays on the host side). | Type: `number`. Optional. A hook that returns the object it got makes the engine use that run verbatim. Absent on a hook's own `{ text }` and on `$.command.run`'s. |

### `CommandSpec`

What `$.command.register` takes: the slash command this plugin serves. Used by `$.command.register`, `command.register`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | [Documented] | The command's name without the slash (letters, digits, `_`, `-`, up to 64), the person runs it as `/<name>`. | Type: `string`. |
| `description` | [Documented] | The one line the typeahead and `/help` show for it. | Type: `string`. |
| `argumentHint` | [Documented] | The hint drawn dim after the name (`[name]`), when it takes arguments. | Type: `string`. Optional. |
| `immediate` | [Documented] | Set so that `/<name>` typed while a turn is in flight runs at once instead of waiting for the turn to end, as it does when left out. | Type: `true`. Optional. Its `command.run` hook runs while a turn may still be streaming, so it must not assume the turn's state. |

### `ConfigDescribeInput`

The input of `config.describe`: how one `/config` row presents, at the moment the menu lists it (and for `$.config.list`). Used by `config.describe`, `$.config.describe`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `key` | [Documented] | Names the row, as `config.set`'s `key` does, the key a matcher narrows on. Pinned: a rewrite is refused. | Type: `string`. |
| `label` | [Documented] | What the menu draws for the row, before its value. | Type: `string`. |
| `description` | [Documented] | The help text beneath the label, when the row has one (a plugin field's `description`), absent for the panel's own rows. | Type: `string`. Optional. |
| `isHidden` | [Documented] | Whether the menu leaves the row out, a hidden row still answers `$.config.set` and `/config key=value`. | Type: `boolean`. |
| `provider` | [Documented] | Who owns the row, as `config.set`'s `provider`. Pinned. | Type: `Origin`. |

### `ConfigOrigin`

Where a `config.set` came from, in `prompt.submit`'s words: the person in the `/config` menu (`composer`), the bridge, or a plugin, named. Set by the engine, `next(e)` passes it on as received and none sets it.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | [Documented] | The person's own change in the `/config` menu (a toggle, a pick, a typed value), or their `/config key=value`. | Type: `'composer'`. |
| `kind` | [Documented] | A `/config key=value` that arrived over the Remote Control bridge (a phone or web client, or a relay): not attestably the owner's hand. | Type: `'bridge'`. |
| `kind` | [Documented] | A plugin's `$.config.set`, that plugin's own hooks do not see it. | Type: `'plugin'`. |
| `name` | [Documented] | The calling plugin's name. | Type: `string`. |

### `ConfigRow`

One `/config` row as `$.config.list()` returns it: what the menu would draw now, after every `config.describe` hook, a hidden row left out. Used by `$.config.list`, `config.list`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `key` | [Documented] | Names the row: the panel's id for a built-in, `<plugin>.<field>` for a plugin's `userConfig` field, what `$.config.set` takes. | Type: `string`. |
| `label` | [Documented] | What the menu draws for the row, before its value. | Type: `string`. |
| `description` | [Documented] | The help text under the label, when the row has one. | Type: `string`. Optional. |
| `kind` | [Documented] | How the row takes its value (ConfigKind). | Type: `ConfigKind`. |
| `value` | [Documented] | What the row holds now. | Type: `ConfigValue`. |
| `options` | [Documented] | The values a `choice` row takes, in order (a plugin string field's declared `options` for its row), absent otherwise. | Type: `readonly string[]`. Optional. |
| `provider` | [Documented] | Who owns the row: the engine for the panel's own, else the plugin. | Type: `Origin`. |
| `isLocked` | [Documented] | Whether a trusted source (managed settings, the organization's policy) owns the value, so the menu shows it and refuses a change. | Type: `boolean`. |

### `ConfigSetInput`

The input of `config.set`: one `/config` row about to change, from the menu or a plugin's `$.config.set`, with what it holds now and who owns it. Used by `config.set`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `key` | [Documented] | Names the row: the panel's own id for a built-in (`theme`, `verbose`, `autoCompact`), `<plugin>.<field>` for a plugin's `userConfig` field. | Type: `string`. The key a matcher narrows on, pinned: a rewrite is refused. |
| `value` | [Documented] | What the row is being set to, `next({ ...e, value })` clamps or replaces it, held to the row's kind (a toggle takes a boolean). | Type: `ConfigValue`. |
| `previous` | [Documented] | What the row holds before the change, as the menu shows it. Pinned. | Type: `ConfigValue`. |
| `provider` | [Documented] | Who owns the row: `{ plugin: "engine", tier: "core" }` for the panel's own, the plugin and its tier for a `userConfig` field. Pinned. | Type: `Origin`. |
| `origin` | [Documented] | Where the change came from (ConfigOrigin): the person in the menu (`composer`) or a plugin's `$.config.set`. Pinned. | Type: `ConfigOrigin`. |

### `ConfigSetResult`

What a `config.set` hook returns and what `next(e)` resolves to: `{ value }` once written, or `{ deny: reason }`, the row left as it was. The menu shows a deny's reason. A deny after `next(e)` was answered fails the hook. Used by `config.set`, `$.config.set`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `value` | [Documented] | Not described in the type file. | Type: `ConfigValue`. |
| `deny` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `deny` | [Documented] | Not described in the type file. | Type: `string`. |
| `value` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |

### `RegisteredToolSpec`

A ToolSpec as `$.tool.register` hands it on: the input schema filled in, `isDeferred` as the plugin gave it. Used by `tool.register`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | [Documented] | Not described in the type file. | Type: `string`. |
| `description` | [Documented] | Not described in the type file. | Type: `string`. |
| `inputSchema` | [Documented] | Not described in the type file. | Type: `Record<string, unknown>`. |
| `isDeferred` | [Documented] | Not described in the type file. | Type: `ToolDeferral`. Optional. |

### `ToolCallReserved`

The keys `tool.call`'s input carries beside the tool's own arguments, none of which the tool sees (the engine strips them before the tool runs). `consent` is the person's own words for the press that raised the call. The permission path reads it as the user's request.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `tool` | [Documented] | Not described in the type file. | Type: `T`. |
| `tool_use_id` | [Documented] | Not described in the type file. | Type: `string`. Optional. |
| `consent` | [Documented] | Not described in the type file. | Type: `string`. Optional. |

### `ToolCallResult`

What a `tool.call` hook returns and what `next(e)` and `$.tool.call(input)` resolve to: the tool's result (`{ result, context? }`) or `{ deny }`. Union. Fields: `context`, `deny`, `isError`, `isReadOnly`, `ref`, `result`, `text`. From core the result is `{ ref, result, text }`, plus `isError` on a tool error. Used by `tool.call`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `deny` | [Documented] | Refuses the call: the model receives the text as an error result. Absent when the call was answered. | Type: `string`. Returned after the tool answered without error it withholds that result and undoes nothing: in its place the model reads `<tool> ran, and a plugin withheld its result: <text>`. |
| `result` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `context` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `ref` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `text` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `isError` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `isReadOnly` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `result` | [Documented] | The tool's output: from core the tool's record, typed per built-in tool once `e.tool` and `isError` are narrowed, from a hook, its own. | Type: `ToolResultOf<Name>`. Core checks a hook's answer against the tool's output schema when it has one. Absent on a deny. |
| `context` | [Documented] | What the model reads after the tool's result and the user never sees. From core, none. | Type: `readonly string[]`. Optional. One reminder, as a `PostToolUse` hook's is. Past 100,000 characters (200,000 together) the model reads a head and a path. |
| `ref` | [Documented] | Set by core on what `next(e)` resolves to: names the messages core produced for the call (they stay on the host side). | Type: `number`. Optional. A hook that returns the object it got makes core use them verbatim. Absent on a hook's own `{ result }` and on a deny. |
| `text` | [Documented] | Set by core: the result as the model reads it (text blocks joined), present whatever the tool, where `result`'s shape varies per tool. | Type: `string`. Optional. Absent on a hook's own `{ result }`. |
| `isReadOnly` | [Documented] | Set by core, present only when the tool held the input it executed read-only by its own check (the one its permissions use). | Type: `true`. Optional. Says the call ran read-only, rewrites included. It does not cover calls that this call causes. |
| `isError` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `deny` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `isError` | [Documented] | Set by core, present only when the tool reported an error (it threw, was interrupted, or answered an error): `text` is what the model read. | Type: `true`. |
| `result` | [Documented] | What the transcript stored for the errored call: the error text, or undefined when nothing was stored, never the tool's typed record. | Type: `unknown`. |
| `text` | [Documented] | The error as the model reads it. | Type: `string`. Optional. |
| `ref` | [Documented] | As on an answered result: names the messages core produced. | Type: `number`. Optional. |
| `context` | [Documented] | As on an answered result. | Type: `readonly string[]`. Optional. |
| `isReadOnly` | [Documented] | As on an answered result: the tool held the input it ran read-only. | Type: `true`. Optional. |
| `deny` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |

### `ToolCheckInput`

The input of `tool.check`: the tool, its arguments, the organization's ceiling if it set one, whether the call is read-only, and on a real call its id and the loop's `agentId`. All fields are pinned. A hook decides about the call and does not change it. Used by `tool.check`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `tool` | [Documented] | As the model names it (`Bash`, `mcp__server__tool`), the key a matcher narrows on. | Type: `string`. A matcher on any name the host declares for the tool admits it. |
| `input` | [Documented] | The tool's arguments as the permission decision reads them (`{ command }` for Bash, `{ file_path, ... }` for the file tools). | Type: `unknown`. |
| `tool_use_id` | [Documented] | The call being decided, on a real call only, absent on a query. | Type: `string`. Optional. `next.origin` names who raised it: `{ plugin: 'engine', tier: 'core' }` for the model's own call, the plugin for its `$.tool.call` or its query. |
| `agentId` | [Documented] | The id of the loop the call is decided in, on a real call inside a subagent's or a teammate's loop: the one its `tool.call` carried. | Type: `string`. Optional. Absent on the main loop and on a query. Which loop, not which plugin caused the call (that is `next.origin`). |
| `isReadOnly` | [Documented] | Set when the tool call is read-only (new in 2.1.304). | Type: `true`. Optional. The program passes it on as the read-only flag of the permission decision. |
| `ceiling` | [Documented] | The most permissive verdict the organization lets a call of the tool reach (`ask`), as its administrators set it on a connector's tool. | Type: `ToolCheckDecision`. Optional. Set by the engine, from the tool, never by a query, and pinned. A hook's own `ceiling`, on its answer, is dropped. Absent where none is set. |

### `ToolCheckResult`

What a `tool.check` hook returns and what `next(e)` resolves to: the verdict, why, what stands behind it, and who answers core's ask. From core, the engine's decision for the mode and rules. A hook may answer any verdict. The last word up the chain decides. Used by `tool.check`, `$.tool.check`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `decision` | [Documented] | `allow` runs the tool, `ask` puts it to the mode's decider, `deny` refuses it, the reason the model's error. | Type: `ToolCheckDecision`. For a tool that needs the person, a hook can only tighten the verdict. Its `allow` does not dismiss the dialog. |
| `reason` | [Documented] | Why, in a sentence: from core the rule or check that decided, from a hook, what the model reads on a deny and the dialog shows on an ask. | Type: `string`. Optional. |
| `rule` | [Documented] | The settings rule that decided, as written (`Bash(git push:*)`). | Type: `string`. Optional. Absent for a mode or a tool's own check. |
| `hook` | [Documented] | The classic hook event that decided, or whose ask the verdict was reached under (`PreToolUse`), whoever configured the hook. | Type: `string`. Optional. Absent on a `$.tool.check` query, which runs no classic hook. |
| `setting` | [Documented] | The key of the option whose own check asked, whoever configured it (`permissions.blockReadsOutsideWorkingDirectories`). | Type: `string`. Optional. From core, for the read block: its ask on a shell command that reads outside the working directories or, the block on, leaves the sandbox. |
| `decider` | [Documented] | Who an ask is put to, where that is not a dialog here: `host`, a hosted session's permission callback or the cloud session a served call is for, or `person` (new in 2.1.304). | Type: `ToolCheckDecider`. Optional. From core, only where a host would be asked. Names who decided. With `person`, only the permission dialog or a host's callback can approve the ask. Where nobody can be asked (`dontAsk` mode, avoid-prompts, headless), the ask is refused with the mod's reason (the program turns the decision into `deny`). Otherwise the ask goes to a person only and the "always allow" rule option is not offered. |
| `ceiling` | [Documented] | The most permissive verdict the organization lets a call of the tool reach (`ask`), as its administrators set it on a connector's tool. | Type: `ToolCheckDecision`. Optional. Set by the engine from the tool. A hook's own `ceiling` is dropped. |

### `ToolDescribeInput`

The input of `tool.describe`: one tool's description, at the moment the engine first renders the tool's schema for the model. Used by `tool.describe`, `$.tool.describe`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `tool` | [Documented] | As the model sees the name (`Bash`, `mcp__server__tool`), the key a matcher narrows on. | Type: `string`. |
| `description` | [Documented] | The tool's description as it computed it. | Type: `string`. |
| `isDeferred` | [Documented] | Present, and true, when the engine lists the tool behind ToolSearch (its schema loads when the model asks for it by name), absent for one listed. | Type: `true`. Optional. An MCP server's tool, or one that asks to be, loads on demand. A plugin tool with `isDeferred: false` stays in front. |
| `provider` | [Documented] | Who provides this tool: the plugin and its tier, `{ plugin: "engine", tier: "core" }` for a built-in. Pinned: a rewrite is refused. | Type: `Origin`. A configured MCP server's tool is `mcp:<server>`, in `prepend` when the policy settings source configures the server, else `user`. |

### `ToolDescribeResult`

What a `tool.describe` hook returns: the description the model sees for that tool and, when the hook moves it, where the tool waits (ToolDeferral). `{ description }` alone changes the text and keeps the placement. `isDeferred: true` puts the tool behind ToolSearch. Used by `tool.describe`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `description` | [Documented] | Not described in the type file. | Type: `string`. |
| `isDeferred` | [Documented] | Not described in the type file. | Type: `ToolDeferral`. Optional. |

### `ToolEnvelope`

`{ tool, tool_use_id, ...args }` as one flat object type, generic over the tool name and its parsed arguments.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `tool` | [Documented] | The name of the tool being called (`Bash`, `mcp__<server>__<tool>`), comparing it narrows `e`. Reserved: a rewrite of it is ignored by core. | Type: `Name`. |
| `tool_use_id` | [Documented] | The tool_use block's id: the same at every event of the call and in `$.ui.notice`. Reserved: a rewrite of it is ignored by core. | Type: `string`. |

### `ToolInfo`

One tool as `$.tool.list()` returns it. Used by `$.tool.list`, `tool.list`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | [Documented] | What the model calls it by. | Type: `string`. |
| `description` | [Documented] | What it does, in the tool's own words (its description, a first sentence at most for MCP tools without one). | Type: `string`. |
| `mcp` | [Documented] | True for an MCP server's tool. | Type: `boolean`. |

### `ToolInputOf`

`{ tool, tool_use_id, ...args }` as one flat object type. The docs of `tool` and `tool_use_id` live on the `keyof` operand: a mapped type takes its properties' docs from there.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `[K in keyof ToolEnvelope<Name, Arguments>]` | [Documented] | Not described in the type file. | Type: `ToolEnvelope<Name, Arguments>[K]`. |

### `ToolNamed`

An input that names its tool as the literal `T`: what `next` and `$.tool.call` read to type the call's result per tool (NextResultFor).

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `tool` | [Documented] | The name of the tool being called (`Bash`). | Type: `T`. Read-only. |

### `ToolRequestMeta`

What a `tool.call` hook sets for the request of an MCP server's tool.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `requestMeta` | [Documented] | Entries for the `_meta` of the request this call sends its MCP server, set with `next({ ...e, requestMeta })`, never an argument of the tool. | Type: `Record<string, string>`. Optional. A hook may set only `anthropic/sources`, a string of at most 256 KiB. It goes only to a connector relay. `{}` clears it. |

### `ToolResultSummary`

One tool_result block of a user message.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `tool_use_id` | [Documented] | The id of the call this result answers (`tool.call`'s `e.tool_use_id`). | Type: `string`. |
| `text` | [Documented] | The result as the model read it (text blocks joined). | Type: `string`. |
| `isError` | [Documented] | True when the tool reported an error. | Type: `boolean`. |
| `result` | [Documented] | What the transcript stored for the call: the tool's record on an answered one (`tool.call`'s `result`), the error text when `isError`. | Type: `unknown`. Optional. Absent when nothing was stored. In `-p` a tool may store the record without its bulk. `text` is what the model read. |
| `meta` | [Documented] | What the tool's MCP server addressed to plugins in `_meta`: entries under `"claude/plugins"` and `"anthropic/sources"`. The model never reads it. A key over 256 KiB is left out. | Type: `Record<string, unknown>`. Optional. Off by default. Absent on an error result, and when the server addressed nothing, a subagent's transcript keeps at most 8 KiB. |

### `ToolSpec`

What `$.tool.register` takes. Used by `$.tool.register`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | [Documented] | The tool's short name (letters, digits, `_`, `-`, up to 64), the model calls it as `mcp__<plugin>__<name>`. | Type: `string`. |
| `description` | [Documented] | What the tool does, for the model (and the person where tools are listed), an unpaired surrogate half in it is drawn as U+FFFD. | Type: `string`. |
| `inputSchema` | [Documented] | A JSON schema object for the input (`{ type: "object", properties, required }`), default `{ type: "object" }`. | Type: `Record<string, unknown>`. Optional. |
| `isDeferred` | [Documented] | Where the tool waits: `false` puts its schema in the prompt's tool list, `true` behind ToolSearch. | Type: `ToolDeferral`. Optional. Left out, the engine's rule places it: behind ToolSearch, as it places an MCP server's tool. A `tool.describe` hook's answer is read first. |

### `ToolUseSummary`

One tool_use block of an assistant message, with its outcome once the transcript holds the call's tool_result (paired by `tool_use_id`).

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `tool_use_id` | [Documented] | The call's id, as `tool.call` carried it (`e.tool_use_id` there). | Type: `string`. |
| `tool` | [Documented] | Which one was called (`Read`, `Bash`, `mcp__server__tool`), as `tool.call` named it (`e.tool` there). | Type: `string`. |
| `input` | [Documented] | The arguments the model gave it. | Type: `Record<string, unknown>`. |
| `result` | [Documented] | What the transcript stored for the call: the tool's record on an answered one (`tool.call`'s `result`), the error text on a refused or errored one. | Type: `unknown`. Optional. Absent while the call is in flight or when nothing was stored. `text` holds either way. |
| `text` | [Documented] | The result as the model read it, absent while the call is in flight. | Type: `string`. Optional. |
| `isError` | [Documented] | Present only when the tool reported an error, as on `tool.call`'s result. | Type: `true`. Optional. |
| `agentId` | [Documented] | On an Agent tool use, the id of the agent it spawned: what `$.session.messages({ agentId })` reads and its `turn.complete` carries. | Type: `string`. Optional. Known while the session tracks the run. Absent on other tools and on a refused Agent call. |
| `durationMs` | [Documented] | On an answered Agent tool use that ran to completion, how long the agent ran, in milliseconds, as the call's stored record has it. | Type: `number`. Optional. Absent while it runs, on a background launch, and on every other tool. |
| `meta` | [Documented] | What the tool's MCP server addressed to plugins in `_meta`: entries under `"claude/plugins"` and `"anthropic/sources"`. The model never reads it. A key over 256 KiB is left out. | Type: `Record<string, unknown>`. Optional. Off by default. Absent on an error result, and when the server addressed nothing, a subagent's transcript keeps at most 8 KiB. |

## Related Pages

- [Mod API Overview](https://xsyetopz.github.io/claude-code-docs/extend/mod-api.md)
- [Tool, Command, and Config](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/tool-command-config.md)
- [Agent](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/agent.md)
- [Mod API Types](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/types.md)
