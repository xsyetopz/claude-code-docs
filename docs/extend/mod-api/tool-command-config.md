---
title: Tool, Command, and Config
description: The $.tool, $.command, and $.config nouns that list, check, call, and register tools and slash commands, and change /config rows.
sidebar_position: 11
---

`$.tool` lists, checks, calls, and registers tools.
`$.command` does the same for slash commands.
`$.config` lists and sets the rows of the `/config` menu.
A tool or command that a mod registers is served by a hook on `tool.call` or `command.run`.

A `deny` from a `tool.call`, `tool.check`, or `config.set` hook stops the action. A registered tool is named `mcp__<plugin>__<name>`.

Official pages: [Use the Mods API](https://code.claude.com/docs/en/plugins/mods/api), [Mods Reference](https://code.claude.com/docs/en/plugins/mods/reference). Source: the program (`types-2.1.304.d.ts`).
In a "Where it can be used" cell, "Run time" means in a hook, in a closure that a hook drew, or in a timer callback. It does not mean inside `register`.

## Example

This mod adds a `/standup` command.

```javascript
on('session.start', async ($, e, next) => {
  await $.command.register({ name: 'standup', description: 'Summarize what changed today', argumentHint: '[days]' })
  return next(e)
})
on('command.run', { command: 'standup' }, async ($, e) => ({ text: 'Summary for ' + (e.args || '1') + ' day(s)' }))
```

## Members

| Item | Status | What it does | How it works | Where it can be used |
| --- | --- | --- | --- | --- |
| `$.tool.list` | <Documented /> | Returns the tools the model can call now, built-in and MCP, in the order the model sees them. | `() => Promise<ToolInfo[]>`. | Run time. |
| `$.tool.call` | <Documented /> | Calls a tool. It is the event `tool.call`, the same call the engine makes for the model, under a `tool_use_id` of its own. | Runs a tool through the hooks, the permission check, and the tool. Rejects for an unknown name or an aborted call. Example: `await $.tool.call({ tool: "Read", file_path: "a.md" })`. | Run time. |
| `$.tool.check` | <Documented /> | Asks for the permission decision for a tool call now. It is the event `tool.check`. Resolves `{ decision, reason?, ... }`. | `(input: ToolCheckArgs) => Promise<ToolCheckResult>`. Nothing runs and no dialog opens. | Run time. |
| `$.tool.register` | <Documented /> | Declares a tool the model can call from the next prompt on: the name, description, and input schema of `mcp__<plugin>__<name>`. | `(tool: ToolSpec) => Promise<...>`. Serve it with a `tool.call` hook. A name registered again is replaced. | After the session binds at `session.start` (rejects before). |
| `$.command.list` | <Documented /> | Returns the slash commands the person can run now, built-in, plugin, and MCP, in typeahead order. | `() => Promise<CommandInfo[]>`. | Run time. |
| `$.command.run` | <Documented /> | Runs a slash command as if the person typed `/command args`. It is the event `command.run`. It queues and runs once the session is idle. | `(input: CommandRunArgs) => Promise<CommandRunResult>`. Rejects an unknown name. | Run time. |
| `$.command.register` | <Documented /> | Declares the slash command `/<name>` for this session, listed in the typeahead from the next keystroke on. | `(command: CommandSpec) => Promise<...>`. Serve it with a `command.run` hook. A built-in's name is refused. | Run time. |
| `$.config.list` | <Documented /> | Returns the rows the `/config` menu would draw now, in its order, each with its value, kind, owner, and lock. | `() => Promise<ConfigRow[]>`. Lists the rows after every `config.describe` hook. A hidden row is left out. | Run time. |
| `$.config.set` | <Documented /> | Changes one row as if the person did in the menu. It is the event `config.set` with `origin` `{ kind: 'plugin', name }`. | `(input: ConfigSetArgs) => Promise<ConfigSetResult>`. Resolves `{ value }` or `{ deny }`. Rejects a key that no row has. | Run time. |

## Engine Events

| Item | Status | What it does | How it works | Where it can be used |
| --- | --- | --- | --- | --- |
| `tool.call` | <Documented /> | Fires when the engine is about to run a tool. Each `next(e)` runs the hooks beneath, then core (the permission prompt, the tool). | Input `ToolCallInput`. Result `{ result, context? }` or `{ deny }`. `{ deny: reason }` refuses the call. A guard that fails is skipped and the tool runs. | `on('tool.call', ...)`. Also `$.tool.call(...)`. |
| `tool.check` | <Documented /> | Fires when the engine decides whether a tool call may run, after the `tool.call` and `PreToolUse` hooks and before the mode settles an ask. | Input `ToolCheckInput`, which carries `isReadOnly` when the call is read-only (new in 2.1.304). Result `{ decision, reason?, ... }`. An ask may carry `decider: "person"` (new in 2.1.304): only the permission dialog or a host's callback can approve it, and where nobody can be asked (`dontAsk` mode, avoid-prompts, headless) it is refused with the mod's reason. `next(e)` gives the engine's verdict. A guard that fails is skipped, so add a `.catch`. | `on('tool.check', ...)`. Also `$.tool.check(...)`. |
| `tool.describe` | <Documented /> | Fires when the engine first renders the tool's schema in a session. `next(e)` resolves to `{ description, isDeferred? }`. | Input `ToolDescribeInput`. The answer is cached until `$.ui.invalidate("tool.describe")`. | `on('tool.describe', ...)`. In tests: `$.tool.describe(...)` on the test engine (not on a hook's `$`). |
| `command.run` | <Documented /> | Fires when a slash command is about to run. `next(e)` resolves to `{ text }`, its output. | Input `CommandRunInput`. Rewrite `args` with `next`, or return `{ text }` to answer in its place. | `on('command.run', ...)`. Also `$.command.run(...)`. |
| `command.describe` | <Documented /> | Fires once for each command, when the engine lists it for the typeahead and `/help`. `next(e)` resolves to `{ description, argumentHint, isHidden }`. | Input `CommandDescribeInput`. Cached for the session until `$.ui.invalidate("command.describe")`. | `on('command.describe', ...)`. In tests: `$.command.describe(...)` on the test engine (not on a hook's `$`). |
| `config.set` | <Documented /> | Fires when a `/config` row is about to change, from the menu or a plugin's `$.config.set`. `next(e)` resolves to `{ value }` once written. | Input `ConfigSetInput`. Result `{ value }` or `{ deny }`. `{ deny: reason }` leaves the row as it is. A value of the wrong kind is refused. | `on('config.set', ...)`. Also `$.config.set(...)`. |
| `config.describe` | <Documented /> | Fires once for each `/config` row, when the menu lists it and for `$.config.list`. `next(e)` resolves to `{ label, description, isHidden }`. | Input `ConfigDescribeInput`. Cached until `$.ui.invalidate("config.describe")`. | `on('config.describe', ...)`. In tests: `$.config.describe(...)` on the test engine (not on a hook's `$`). |

## Events Raised by These Calls

For each call, a hook above the caller returns `next(e)`, `{ deny: reason }`, or `{ value }`.

| Item | Status | The argument | Input and value |
| --- | --- | --- | --- |
| `tool.list` | <Documented /> | `$.tool.list()` | Input `NoArgs`. Value `ToolInfo[]`. |
| `tool.register` | <Documented /> | `$.tool.register(spec)` | Input `RegisteredToolSpec`. Value `{ tool: string }`. |
| `command.list` | <Documented /> | `$.command.list()` | Input `NoArgs`. Value `CommandInfo[]`. |
| `command.register` | <Documented /> | `$.command.register(spec)` | Input `CommandSpec`. Value `{ command: string }`. |
| `config.list` | <Documented /> | `$.config.list()` | Input `NoArgs`. Value `ConfigRow[]`. |

## Related Pages

- [Mod API Overview](index.md)
- [Turn and Prompt](turn-prompt.md)
- [Tool, Command, and Config Types](types/tool-command-config.md) (tool call, check, command, and config types)
