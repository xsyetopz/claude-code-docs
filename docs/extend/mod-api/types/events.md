---
title: Event Table Types
description: "Types that map an event name to its input, its result, and its call on the object $."
sidebar_position: 3
---

These types map an event name to its input, its result, and its call on `$`.
They are how your editor knows the shape of `e` and `next` for each event.
For example, `$.fs.read(...)` is both a call and the event `fs.read`, so a hook can answer it.

A plugin adds its own nouns by declaration merging into `EngineInterface`.

Source: the program (`types-2.1.304.d.ts`). Official page: [Mods Reference](https://code.claude.com/docs/en/plugins/mods/reference).

## Example

These aliases give the input and the result of one event by its name.

```ts
import type { EventName, EventOf, EventResult } from 'claude-code'

type ReadInput = EventOf['fs.read']
type ReadResult = EventResult<'fs.read'>
```

To add your own noun, merge into `EngineInterface`:

```ts title="types.d.ts"
declare module 'claude-code' {
  interface EngineInterface {
    voice: { say(text: string): Promise<void> }
  }
}
```

After this, `voice.say` is also an event, and a hook can use `on('voice.say', ...)`.

## How It Works

`EventOf` joins the events the engine defines (`CoreEventOf`) with the methods of the nouns that plugins add (`NounEventOf`). `ResultOf` does the same for results. `Events` turns both into one hook type for each event.

```mermaid
flowchart LR
  N[Event name] --> I["<code>EventOf</code>: input e"]
  N --> R["<code>ResultOf</code>: result of next"]
  N --> H[Events: hook signature]
  N --> C["<code>EventCalls</code>: call on $"]
```

## Types without Fields

These types are aliases, unions, or plain shapes. Each row gives its use and its shape.

| Type | Status | What it is for | Shape and limits |
| --- | --- | --- | --- |
| `AnyEventHook` | <Documented /> | The hook `on("*", hook)` takes: it runs on every event, plugin nouns no declaration names included, so `e` is `unknown` and `next` is StarNext. | Alias of `($: EngineInterface, e: unknown, next: StarNext) => unknown`. Until `next.is(pattern, e)` narrows `e`, a hook can only pass it on, time it, log it, or fail it. |
| `AnyKeyOf` | <Documented /> | Every key of every variant, index signatures included. | Alias of `I extends unknown ? keyof I : never`. |
| `Chunk` | <Documented /> | What a hook on streaming event `N` yields, and what its `next(e)` yields to it (ChunkOf by name). | Generic alias of `ChunkOf[N]`. |
| `ChunkOf` | <Documented /> | The chunk type of each streaming event, by name: what its stream yields. | Object with fields `turn.step`, `process.spawn`. |
| `ChunkRef` | <Documented /> | What every `turn.step` chunk may carry: the engine's handle on the item of its own stream the chunk was read off, absent on a chunk a hook made. | Object with the field `ref?`. A hook that passes a chunk on or spreads it keeps the handle. A chunk built afresh has none. |
| `CoreEventName` | <Documented /> | The name of an event the engine defines itself (a key of CoreEventOf), EventName adds the declared plugin nouns' events. | Alias of `keyof CoreEventOf`. |
| `CoreEventOf` | <Documented /> | The argument of each event the engine defines itself: its call sites' (EngineEventOf), the classic hooks' (ClassicEventOf), the calls on `$`. | Alias of `EngineEventOf & ClassicEventOf & OpEventOf`. |
| `DeclaredEvents` | <Documented /> | The state events of each declared value in a union of `[plugin, key]` pairs, one variant per pair (it distributes), so a matcher narrows `e`. | Alias of `Pair extends readonly [ infer P extends keyof PluginState & string, infer K ] ? K extends keyof PluginState[P] & string ? DeclaredEventsOf<P, K> : never : never`. |
| `DeclaredEventsOf` | <Documented /> | `e` of `state.get` and of `state.set` for one declared value: its typed reference, and for a write the change, of the declared type. | Object with fields `get`, `set`. |
| `DeclaredPair` | <Documented /> | Every named value the enabled contracts declare, as one union of `[plugin, key]` pairs, `never` while PluginState is empty. | Object with fields `[P in keyof PluginState & string]`. |
| `DeclaredStateChange` | <Documented /> | What a `state.set` on one declared value carries beside its reference: the value being written and the one that stood there, of the declared type. | Object with fields `value`, `previous`, `ifVersion?`. |
| `EngineEventOf` | <Documented /> | The events the engine raises at its call sites, and `engine.create`, the classic settings hooks' events are ClassicEventOf. | Object. One key for each event that hooks can handle. A hook that fails is skipped and the next hook runs, so a guard needs a `.catch` to fail closed. |
| `EngineResultOf` | <Documented /> | The engine's events' results. | Object. One key for each event. Its value is the result type that a hook for the event may return. |
| `EventCalls` | <Documented /> | The engine's own events as calls on `$`, one signature each: `$.<noun>.<event>(input)` resolves to its result, or to its stream. | Object with one key for each noun that raises events (`tool`, `command`, `config`, `prompt`, and more). A plugin's call runs the same chain with the calling hook skipped. Used by 10 calls such as `$.session.compact`. |
| `EventName` | <Documented /> | The name of an event: a key of EventOf, the engine's own (CoreEventName) and the declared plugin nouns' (NounEventName). | Alias of `keyof EventOf`. |
| `EventOf` | <Documented /> | The argument of each event, by event name: what a hook receives as `e` and what the call on `$` takes. Plain data, frozen to every depth. | Alias of `CoreEventOf & NounEventOf`. The engine's own events plus the methods of the nouns that plugins add. |
| `EventResult` | <Documented /> | The result of event `N`: what its hooks return and what their `next(e)` resolves to. | Generic alias of `ResultOf[N]`. |
| `Events` | <Documented /> | The hook signature of each event, `($, e, next)`, as one mapped type over EventOf, a streaming event's is the generator form (StreamHook). | Object. One hook type for each event. `$` is frozen, `e` is read-only to every depth, and `next` runs the rest of the chain. |
| `KeptEvent` | <Documented /> | What `next` takes in a matched hook: the variants of `e` the matcher can match (KeptMembers), as declared, so a rewrite of a pinned field passes. | Alias of `MatchedNames<P, M> extends infer N extends EventName ? N extends unknown ? KeptMembers<Args<N>, M> : never : never`. |
| `Namespace` | <Documented /> | The prefixes a glob may name: one or more whole leading segments of an event name (`tool` of `tool.call`), derived, plugin nouns included. | Generic alias of ``N extends `${infer Head}.${infer Rest}` ? Head \| `${Head}.${Namespace<Rest>}` : never``. |
| `NextResult` | <Documented /> | What `next(e)` resolves to for event `N`: the event's result, except at `engine.create`, where the steps beneath return `$` as built so far. | Alias of `N extends 'engine.create' ? EngineInterfaceBuilt : EventResult<N>`. The type of the value that `next` gives back. |
| `NextResultFor` | <Documented /> | What `next(e)` resolves to once `e.tool` is the literal `T`: on `tool.call` the result typed for that tool, on every other event, `O` as declared. | Alias of `[ N ] extends ['tool.call'] ? ToolCallResult<T> : O`. `result` is Bash's record after `e.tool === "Bash"`, an un-narrowed `e` names every tool, and `result` stays `unknown`. |
| `NoArgs` | <Documented /> | The argument of a call on `$` that takes nothing (`$.session.cwd()`): an object with no keys. | Alias of `Record<never, never>`. Used by `session.cwd`, `session.root`, `session.model`, `session.turns` and 16 more. |
| `NoArgsEvent` | <Documented /> | The events whose argument is exactly NoArgs (`session.cwd`, a declared plugin noun's `() => ...`), their overloads come last (LateOverload). | Object with fields `[N in EventName]`. |
| `NounEvent` | <Documented /> | The declared plugin nouns' methods as event rows (NounEventRow), one per `<noun>.<method>` that is a function, a member that is not is no event. | Object with fields `[K in PluginNoun]`. |
| `NounEventName` | <Documented /> | The name of a declared plugin noun's event (`voice.speak`). | Alias of `keyof NounEventOf & string`. |
| `NounEventOf` | <Documented /> | The events of the plugin nouns declared on EngineInterface, by name: the argument of each `<noun>.<method>`. Empty until a plugin declares a noun. | Alias of `{ [E in NounEvent as E['name']]: E['args'], }`. Example: `declare module "claude-code" { interface EngineInterface { voice: Voice } }`. |
| `NounEventResult` | <Documented /> | The result of a declared plugin noun's event as its hooks see it: `{ value }` (the method's answer) or `{ deny }`. | Alias of `ValueOrDeny<NounValueOf[N]>`. |
| `NounEventRow` | <Documented /> | One method of a declared plugin noun as an event row: its event's name, argument (the method's first parameter) and value (its awaited result). | Object with fields `name`, `args`, `value`. |
| `NounValueOf` | <Documented /> | What each declared plugin noun's method answers (the `value` of its event's result), by event name. | Alias of `{ [E in NounEvent as E['name']]: E['value'], }`. |
| `OpEventName` | <Documented /> | The name of a call on `$` the host serves, as an event. | Alias of `keyof OpEventOf`. |
| `OpEventOf` | <Documented /> | The calls on `$` the host serves, as events: `e` is the call's argument as it crosses to the host, and every one is hookable by name and by `on("*")`. | Object. One key for each `$` call that is also an event, such as `fs.read` and `session.messages`. A hook can pass it on, rewrite it, refuse it with `{ deny }`, or answer with `{ value }`. |
| `OpEventResult` | <Documented /> | The result of a call on `$` as its event's hooks see it: `{ value }` (the call's answer) or `{ deny }`. | Generic alias of `ValueOrDeny<OpValueOf[N]>`. |
| `OpValueOf` | <Documented /> | What each call on `$` answers (the `value` of its event's result), by event name. | Object. One key for each `$` call. Its value is the type of the call's answer. Used by `$.tool.register`, `$.command.register`, `$.agent.register`. |
| `PluginNoun` | <Documented /> | The nouns a plugin declared on `$` by merging into EngineInterface, never one the engine's own events are under (`tool`, `session`, `ui`). | Alias for the names of nouns that plugins add. An identical open call that repeats waits behind the previous one. |
| `ResultOf` | <Documented /> | What each event's hook returns, and what its `next(e)` resolves to, by event name. | Combines `ResultOf`, `EngineResultOf`, `ClassicResultOf`. Object with fields `[N in OpEventName]`, `[N in NounEventName]`. |
| `StreamingEventName` | <Documented /> | The events that stream: their hooks are async generators, `next(e)` is the stream of everything beneath, and the result is what it returns. | Alias of `'turn.step' \| 'process.spawn'`. These two events stream their output in pieces. |
| `ValueOrDeny` | <Documented /> | The result of a call on `$` as the hooks on its event see it: `{ value }`, the call's answer, or `{ deny }`, the reason the caller's promise rejects. | Object with fields `value`, `deny?`, `deny`, `value?`. |

## Related Pages

- [Mod API Overview](../index.md)
- [Hooks and the Hook Chain](../hooks.md)
- [Mod API Types](index.md)
