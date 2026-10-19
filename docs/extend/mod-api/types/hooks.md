---
title: Hook Machinery Types
description: "Types that describe how on, next, matchers, and traces are typed."
sidebar_position: 4
---

These types describe how `on`, `next`, matchers, and traces are typed.
A mod author rarely writes them by hand, because your editor fills them in from the type files in `.claude-plugin/types/`.
They help when a type error is hard to read.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | Yes, as types. You rarely name them yourself. |
| Can you change it? | No. These are types only. They describe data, and they do not hold settings. |
| Can you turn it on or off? | No. A type has no switch. |
| Where does it live? | The published type file `types-2.1.303.d.ts` and `.claude-plugin/types/claude-code/index.d.ts`. |
| Status | <Documented /> |

## Example

The editor types `e` and `next` here from the machinery types below. This sketch shows only the call shape. See the Hooks page for the full rules.

```ts
on("tool.call", { tool: "Bash" }, async ($, e, next) => {
  return next(e)
})
```

## Types without Fields

These types are aliases, unions, or plain shapes. Each row gives its use and its shape.

| Type | Status | What it is for | Shape and limits |
| --- | --- | --- | --- |
| `Register` | <Documented /> | The hooks module's entry: `export function register(on, options)`. `on` registers hooks, `options` is the plugin's configuration (PluginOptions). | Alias of `(on: On, options: PluginOptions) => unknown`. The options are fixed for one activation. A change reloads the plugin. A returned promise is awaited. |
| `On` | <Documented /> | Registers `hook` on the events `pattern` selects: one by name, every one under a namespace (`classic.*`), all (`*`), or all but some (`!tool.*`). | Alias of two call forms: `on(pattern, hook)` and `on(pattern, matcher, hook)`. A matcher narrows the inputs a hook sees. Returns the `Registration`. |
| `CatchHandler` | <Documented /> | The handler `on(...).catch(handler)` takes for a hook of type `F`: the hook's `($, e, next)`, run afresh when it throws, misreturns or overruns. | Alias for the handler type of `.catch`. `next` carries `error` and `called`. A return within the grace time is the hook result. `undefined` makes the hook absent. |
| `TraceOutcome` | <Documented /> | What the chain decided for one link, as `next.trace` names it. | Alias of `'caught' \| 'expired' \| 'kept' \| 'passed' \| 'rejected' \| 'returned' \| 'skipped'`. `returned` means the hook's own result stood. `skipped` means it failed before `next`. |
| `Tier` | <Documented /> | One of the chain's five tiers (TIERS), outermost first, on every `next.trace` entry, and what `next.to(e, tier)` names. | Alias of the five tier names. `prepend` and `append` are managed plugins. `user` is what a person installs. `builtin` is bundled. `core` is the engine. |
| `TIERS` | <Documented /> | The chain's five tiers, outermost first: earlier is outer is more authority, and same-event hooks nest in this order and no other way. | Constant list `["prepend", "user", "append", "builtin", "core"]`. The order in which hooks run, outermost first. |
| `TargetTier` | <Documented /> | A tier `next.to(e, tier)` may name: one a floor can reach past a tier of less authority to, so never `prepend` or `user`, which nothing skips to. | Alias of `Exclude<Tier, 'prepend' \| 'user'>`. |
| `PluginOptions` | <Documented /> | A plugin's options as `register(on, options)` receives them: the values of the fields its manifest's `userConfig` declares, defaults filled in. | Alias of a read-only record of string, number, boolean, or string list. Stored in `pluginConfigs[<plugin>].options` of settings. A required field with no value fails the load. |
| `Pattern` | <Documented /> | What `on(pattern, hook)` and `next.is(pattern, e)` take: an event's name, a glob (`*`, `classic.*`), or a negation of either (`!tool.describe`). | Alias of `EventName \| Glob \| Negation`. |
| `Glob` | <Documented /> | Every event (`*`), or every event under a namespace (`classic.*`: each one whose name starts with `classic.`). | Alias of `` '*' \| `${Namespace}.*` ``. But a telemetry event, which is hooked by name (`telemetry.log`, or `telemetry.*` for all): `*` does not select one for an installed plugin. |
| `Negation` | <Documented /> | `!` before a name or a glob: every event except the ones it selects. `!*` would select none, so it is no pattern. | Alias of `` `!${Exclude<EventName \| Glob, '*'>}` ``. It names no event, so like `*` it selects no telemetry event for an installed plugin: those are hooked by name. |
| `Args` | <Documented /> | The argument of event `N`: `e` in its hooks, and what its call takes. For a union of names, the union of their arguments. | Generic alias of `EventOf[N]`. |
| `Frozen` | <Documented /> | `T` with every property read-only to every depth, arrays and tuples kept as declared: how a hook's `e` is typed. | Helper type that makes `e` read-only to every depth. `e.command = 'x'` is a type error. `next({ ...e, command: 'x' })` compiles. |
| `GlobHook` | <Documented /> | The hook `on(pattern, hook)` takes for a glob or a negation: one function placed on every selected event, `e` and the result typed as their union. | Helper type for a hook on a glob pattern. `next.event` says which event a run is. `next.is(pattern, e)` narrows `e` to one event. |
| `GlobNext` | <Documented /> | `next` in a hook on a glob or a negation: an overload per selected event, then one over their union for an `e` not yet narrowed. | Helper type for `next` in a glob hook. It has `to`, `signal`, `is`, `event`, `origin`, `trace`, and `budget`. |
| `GlobNextResult` | <Documented /> | What `next(e)` resolves to in a glob hook before `e` is narrowed: the NextResult of each selected event, as a union. | Object with fields `[K in N]`. |
| `Hook` | <Documented /> | One hook, `($, e, next)`, on event `E`. | Generic alias of `Events[E]`. |
| `HookFor` | <Documented /> | The hook type per pattern: an event's own (Events), `*`'s (AnyEventHook), or a glob's over the events it selects (GlobHook), as one conditional type. | Helper type that picks the hook type for a pattern. It keeps the two-argument `on` as one signature, so tool-name completion works. |
| `HookOf` | <Documented /> | The hook event `E` takes: an async generator over its chunks for a streaming event (StreamingEventName), `($, e, next) => result` otherwise. | Alias of `Events[E]`. |
| `ImpossibleKeys` | <Documented /> | The keys of object pattern `P` that object member `E` cannot satisfy, `D` levels down, `never` when there is none, which is what keeps the member. | Helper type. It finds keys of a matcher that the event does not have, or whose value can never match. |
| `IndexFree` | <Documented /> | An object with the declared keys of `T` and no other: its string and number index signatures are left out. What KnownKeys reads the keys of. | Object with fields `[K in keyof T as string extends K ? never : number extends K ? never : K]`. |
| `IsDiscriminant` | <Documented /> | Whether tag key `K` selects members of `I`: it does when each member gives it ONE literal (`component: "ToolUse"` on the ToolUse variant). | Helper type. A key that has the same union on every event variant is a filter at run time. It is left out of the type narrowing. |
| `IsLiteralValued` | <Documented /> | Whether `V` is made of literals only: `"a" \| "b"` is, `string` is not. | Alias of `string extends V ? false : number extends V ? false : boolean extends V ? false : [V] extends [string \| number \| boolean] ? true : false`. |
| `IsSingleLiteral` | <Documented /> | Whether `V` is exactly one string, number or boolean literal. | Alias of `[V] extends [string \| number \| boolean] ? IsUnion<V> extends true ? false : true : false`. |
| `IsUnion` | <Documented /> | Whether `T` is a union of two or more members. | Generic alias of `T extends unknown ? [U] extends [T] ? false : true : never`. |
| `KeptMembers` | <Documented /> | The members of the argument union `E` matcher `P` can match, as declared, what `next` takes, so a rewrite may change a field the matcher pinned. | Helper type. It drops an event variant when the matcher names a key the variant lacks, or a value it cannot have. |
| `KnownKeys` | <Documented /> | The declared keys of `T`, the string and number index signatures left out. | Helper type that lists the named keys of a type and ignores its index signature. |
| `LateOverload` | <Documented /> | The events whose overload must come after the rest, lest it shadow them. | Alias of `'classic.PreToolUse' \| 'turn.abort' \| NoArgsEvent`. These events are typed after the others, because they share a shape with others. |
| `Literal` | <Documented /> | What a matcher value selects by: itself, or `unknown` for a RegExp, which selects nothing. | Alias of `X extends RegExp ? unknown : X`. |
| `MatchedEvent` | <Documented /> | The argument a matched hook receives: `e` narrowed by `M` (Narrowed), per event the registration covers. | Alias of `MatchedNames<P, M> extends infer N extends EventName ? N extends unknown ? Narrowed<Args<N>, M> : never : never`. |
| `MatchedHook` | <Documented /> | The hook `on(pattern, matcher, hook)` takes: `($, e, next)` with `e` narrowed by the matcher (MatchedEvent), and a tagged result the same way. | Helper type for a hook that has a matcher. On a streaming event it is the generator form. `next.is` narrows as the matcher does. |
| `MatchedNames` | <Documented /> | The events a matched registration on `P` covers: the event named, or for a glob every selected event whose input has each key the matcher names. | Helper type. It lists the event names that a pattern and a matcher select together. |
| `MatchedResult` | <Documented /> | What a matched hook returns: the event's result, narrowed by `M` where the result is a union tagged by the matcher's tag keys. | Alias of `MatchedNames<P, M> extends infer N extends EventName ? N extends unknown ? Select<EventResult<N>, Selection<Args<N>, M>> : never : never`. |
| `MatchedStreamHook` | <Documented /> | The hook `on(event, matcher, hook)` takes on a streaming event: the generator form, `e` narrowed by the matcher, `next(e)` the stream beneath. | Alias of `($: EngineInterface, e: Frozen<MatchedEvent<P, M>>, next: MatchedStreamNext<P, M>) => StreamHookBody<Chunk<P>, MatchedResult<P, M>>`. |
| `MatchedStreamNarrowings` | <Documented /> | What a matched streaming hook's `next.is(pattern, e)` narrows `e` to: the streaming event's argument narrowed by the matcher. | Object with fields `[K in P]`. |
| `MatchedStreamNext` | <Documented /> | A matched streaming hook's `next`: the variants the matcher keeps, the result tagged the same way, `next.is` narrowing as the matcher does. | Alias of `StreamNext<P, KeptEvent<P, M>, MatchedResult<P, M>, MatchedStreamNarrowings<P, M>>`. |
| `MatcherData` | <Documented /> | Any matcher at all, for a field typed `unknown` (a tool's input, a result's output): the kinds the engine accepts, unchecked there. | Union of the four matcher kinds: a scalar (`===`), a `RegExp` (tests the value as a string), an array (any of), and an object (partial match). |
| `MatcherFor` | <Documented /> | The matcher type per pattern: a Matcher of the `e` of the event named, or of each event a glob or a negation selects. | Helper type. It gives the matcher type for a pattern. A mistake in a name is refused where it is written. |
| `MatcherKeys` | <Documented /> | The declared keys of every variant of `I` (index signatures aside). | Alias of `I extends unknown ? KnownKeys<I> : never`. |
| `MatcherOne` | <Documented /> | What matches one value of type `V`, by the runtime's kinds: a scalar leaf takes the value or a RegExp, an object, a partial of it. | Helper type. It gives what may match one value. For an array it matches one element. |
| `MatcherValue` | <Documented /> | What a matcher gives a key whose value is `V` on this variant and `Across` over every variant: one MatcherOne, or an array of them matched as one-of. | Helper type. It allows one matcher or a list of matchers for a key. `{ tool: ['Bash', 'Read'] }` is valid. |
| `MatcherValueAcross` | <Documented /> | The type of key `K` across the variants of `I` that declare it, read variant by variant: what MatcherValueOf reads for a key as wide as `symbol`. | Alias of `I extends unknown ? K extends KnownKeys<I> ? I[K & keyof I] : never : never`. |
| `MatcherValueOf` | <Documented /> | The type of key `K` across the variants of `I` that declare it: one read of their table by key (MatcherValues), for a key some variant declares. | Helper type. It reads the matcher type of a key across all variants of an event. |
| `MatcherValues` | <Documented /> | The type of each declared key of `I` across the variants that declare it, as one table by key: made once per `I`, then read at a key. | Helper type. It joins the key entries of every event variant into one table. |
| `NarrowDepth` | <Documented /> | How many object or array levels a matcher narrows `e` through, counted as a tuple's length: the runtime's own limit, which refuses a deeper matcher. | Alias of `8`. Past it a field keeps its declared type, nothing becomes `any`. |
| `Narrowed` | <Documented /> | `e` in a matched hook: the members of the argument union `E` matcher `P` can match, each with the keys `P` names narrowed to what a match implies. | Helper type. It narrows an event type with a matcher. A scalar narrows to a literal. Other keys stay as declared. |
| `NarrowedByAny` | <Documented /> | A value of declared type `V` under a one-of, folded over the tuple into `Found`: the union of what each alternative narrows `V` to (NarrowedByOne). | Helper type. It narrows by a one-of list. An alternative that cannot match adds nothing. |
| `NarrowedByOne` | <Documented /> | A value of declared type `V` under one matcher node `Q` that is not a one-of, member of `V` by member, a member that cannot match is `never`. | Helper type. It narrows by one matcher value. A `RegExp` keeps the member. An object recurses one level down. |
| `NarrowedMember` | <Documented /> | One object member `E` under object pattern `P`, `D` levels down: `never` when a key of `P` is impossible on it (ImpossibleKeys), else `E` narrowed. | Helper type. It narrows each key that the matcher names. Other keys stay as declared. |
| `NarrowedValue` | <Documented /> | A value of declared type `V` where the matcher gives `Q`, `D` levels down: NarrowedByAny under a one-of (an array), NarrowedByOne otherwise. | Helper type. It stops narrowing at a set depth, and for a field typed `unknown`, such as a tool's input. |
| `NonEmpty` | <Documented /> | Array type `V`, of element `Item`, once some element of it is known to match: a tuple of at least one `Item`, readonly when `V` is. | Helper type. It turns an array into a non-empty tuple, so `e` is still valid where the declared array is taken. |
| `OpenMatcher` | <Documented /> | The keys a variant with a string index signature (an MCP tool's input) takes beyond its own: another variant's key as typed there, others free. | Object type. A wrong value for a key that an event declares (`command: 5`) is refused on every variant. |
| `OrderedOverloads` | <Documented /> | One call signature per event in `Names`, intersected, the ambiguous ones (LateOverload) after the rest: `next` for a hook covering several events. | Helper type that orders the call forms of `next`. An empty group adds nothing. |
| `Overloads` | <Documented /> | One call signature per event in `Names`, intersected into an overload set. | Alias of `UnionToIntersection<{ [N in Names]: (e: Args<N>) => Promise<NextResult<N>>, }[Names]>`. |
| `PatternOver` | <Documented /> | The patterns `next.is` takes in a hook covering the events `N`: their names, `*`, a glob over one of their namespaces, or a negation. | Helper type for the first argument of `on`. A name that no event has is a compile error. |
| `Select` | <Documented /> | The members of `T` assignable to `S`, all of `T` when none is. | Alias of `[Extract<T, S>] extends [never] ? T : Extract<T, S>`. |
| `Selected` | <Documented /> | The events a pattern selects, as a union of names: the one named, every one under a glob's namespace, or every one a negation does not exclude. | Helper type. It turns a pattern (`*`, `!name`, `ns.*`, or a name) into the list of event names it selects. |
| `Selection` | <Documented /> | The literal each tag key of `I` is held to by matcher `M`: one-of arrays flattened, RegExps widened to `unknown`. | Object with fields `[K in keyof M & TagKeys<I, keyof M>]`. |
| `Shaped` | <Documented /> | A value kept with a shape tag, as an `atom` given `{ shape }` keeps it: a reload whose code names another tag reads the value as absent. | Object with the fields `shape` and `value`. Declare a key as `Shaped<T>` in `PluginState` when its atom names a shape. |
| `ShapedValue` | <Documented /> | What an atom given a shape reads and takes for a key declared `Shaped<T>`: `T`, `never` for a key declared otherwise, so that atom does not compile. | Alias of `V extends Shaped<infer T> ? T : never`. |
| `SourceValues` | <Documented /> | The values `derive`'s function receives for its sources, in their order: an atom's or a derived value's own, a plain reference's or `undefined`. | Object with fields `[I in keyof S]`. |
| `StreamHook` | <Documented /> | The hook a streaming event takes: `async function* ($, e, next) {}`, yielding the event's chunks and returning its result. | Helper type for a streaming hook. `return yield* next(e)` passes the stream on. `for await (const c of next(e)) yield f(c)` changes it. |
| `StreamHookBody` | <Documented /> | What a hook on a streaming event evaluates to: the async generator an `async function*` makes, yielding `C` and returning `R` or nothing. | Object with the field `result?`. Returning nothing lets the result of the last `next(e)` stand. The hook must be a generator. |
| `TagKeys` | <Documented /> | The keys among `Among` a matcher may select variants of `I` by: valued by literals in every variant, one literal per variant (IsDiscriminant). | Helper type. It finds the keys of a matcher that tag one event variant. |
| `UnionToIntersection` | <Documented /> | The intersection of a union's members (`A \| B` to `A & B`), by inferring one parameter type from the contravariant positions. | Alias of `(U extends unknown ? (member: U) => void : never) extends (member: infer I) => void ? I : never`. |

## Types with Fields

Each type below has its own table of fields.

### `Registration`

What `on(...)` returns for a hook of type `F`: the registration, which takes one `.catch` (CatchHandler), without it a failed hook is absent. Object with the field `catch`. A second `.catch` on one registration throws. A guard should refuse in `.catch` when `next` was not called.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `catch` | <Documented /> | Sets the handler run when the hook throws or overruns its budget, its answer within the grace stands as the hook's result for the dispatch. | Type: `(handler: CatchHandler<F>) => void`. The budget is `ms` of `HookBudget` and the grace is `catchMs`. `claude plugin validate` lists each gating hook. Read-only. |

### `Next`

The rest of the chain, as one hook receives it: made once per dispatch per hook, frozen, `next(e)` resolves to the downstream result. Callable type. Each call runs the hooks below, with core last. Called with no argument it rejects. A hook that returns without calling it ends the chain.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `[K in N]` | <Documented /> | Not described in the type file. | Type: `unknown`. Optional. |
| `[K in N]` | <Documented /> | Not described in the type file. | Type: `Args<K>`. |
| `to` | <Documented /> | Continues this dispatch at a tier: `next(e)` with every link between this hook's own tier and that one skipped, by tier and narrowing only. | Type: `object`. Lets a managed hook skip to a lower tier. It never skips a tier with more authority, so a user hook cannot skip the organization's. Read-only. |
| `signal` | <Documented /> | Aborts when the call this dispatch belongs to is abandoned: the user interrupted, a hook above settled first, or this hook ran out of budget. | Type: `AbortSignal`. Anything the hook started (timers, requests) should stop on it. It is an AbortSignal of the plugin's own environment, driven by the chain's. Read-only. |
| `is` | <Documented /> | Whether this dispatch's event is selected by `pattern` (a name, a glob, a negation), as a type predicate on `e`: `next.is("tool.call", e)`. | Type: `<M extends PatternOver<N>>(pattern: M, e: unknown) => e is ...`. Narrows `e` to the events the pattern names. A name outside the hook's events is a compile error. Read-only. |
| `event` | <Documented /> | The name of this dispatch's event, as a value, for a glob hook to log or switch on. | Type: `N`. Read-only. |
| `origin` | <Documented /> | Who raised this dispatch: the calling plugin's name and the tier it sits in (Origin), the engine reads `{ plugin: "engine", tier: "core" }`. | Type: `Origin`. Set by the host only. A plugin cannot write it. Every hook of one dispatch sees the same origin. Read-only. |
| `trace` | <Documented /> | What settled beneath this hook on its latest `next()` call, the one started last: an entry per link beneath, nearest first, the engine's last. | Type: `readonly TraceEntry<N, E, O>[]`. Empty before `next` is called. Read-only data. Read-only. |
| `budget` | <Documented /> | How much time this hook runs under and how much is left (NextBudget), read fresh on each access, HookBudget says what the clock counts. | Type: `NextBudget`. The clock stops while a `next` or `$` call of the hook is in flight. In a `.catch` handler it is the grace time. Read-only. |

### `StarNext`

`next` in a `*` hook: the set of events is open at runtime, so `e` is `unknown` until `next.is(pattern, e)` narrows it to events it knows. Callable type with the fields `to`, `signal`, `is`, `event`, `origin`, `trace`, `budget`. It has one call form for each known event.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `to` | <Documented /> | Continues this dispatch at a tier, as Next's `to` (a managed hook's): `e` still unknown resolves to `unknown`. | Type: `(e: unknown, tier: TargetTier) => Promise<unknown>`. Read-only. |
| `signal` | <Documented /> | Not described in the type file. | Type: `AbortSignal`. Read-only. |
| `is` | <Documented /> | Not described in the type file. | Type: `<M extends Pattern>(pattern: M, e: unknown) => e is Frozen<Args<Selected<M>>>`. Read-only. |
| `event` | <Documented /> | Not described in the type file. | Type: `EventName`. Read-only. |
| `origin` | <Documented /> | Not described in the type file. | Type: `Origin`. Read-only. |
| `trace` | <Documented /> | Not described in the type file. | Type: `readonly TraceEntry<EventName, unknown, unknown>[]`. Read-only. |
| `budget` | <Documented /> | Not described in the type file. | Type: `NextBudget`. Read-only. |

### `StreamNext`

The rest of the chain as a hook on a streaming event receives it: Next, except that `next(e)` is the stream beneath (HookStream), not a promise. Type with the fields `to` and `trace`. Each call opens a fresh stream, so a hook that calls it twice makes two. A hook that does not call it yields its own chunks.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `[K in N]` | <Documented /> | Not described in the type file. | Type: `unknown`. Optional. |
| `[K in N]` | <Documented /> | Not described in the type file. | Type: `Args<K>`. |
| `to` | <Documented /> | Continues this dispatch at a tier, as Next's `to`: the stream beneath with the links between this hook's tier and that one skipped. | Type: `(e: E, tier: TargetTier) => HookStream<Chunk<N>, O>`. Read-only. |
| `trace` | <Documented /> | What settled beneath on the latest `next()` stream, as Next's, a streaming link's entry counts the chunks it yielded up (`chunks`). | Type: `readonly TraceEntry<N, E, O>[]`. Read-only. |

### `Caught`

What `next` carries into a `.catch` handler and nowhere else: why the hook failed, and whether it had called `next` before it did. Object with the fields `error` and `called`. Inside a `.catch` handler `next` is replay-safe. When `called`, `next(e)` returns the result of the last call.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `error` | <Documented /> | Why the hook failed (HookFailure), undefined on an ordinary hook's `next`, so its presence says a handler is running. | Type: `HookFailure`. Read-only. |
| `called` | <Documented /> | True when the failed hook had called `next()` or `next.to()` at least once, settled or in flight, the handler runs once that call settled. | Type: `boolean`. Read-only. |

### `HookFailure`

Why a hook failed, as its `.catch` handler reads it on `next.error`: plain frozen data. Object with the fields `kind`, `message?`, `budget`. `throw` means it threw. `timeout` means it outran its budget.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | <Documented /> | Not described in the type file. | Type: `'throw' \| 'timeout'`. Read-only. |
| `message` | <Documented /> | What was thrown or why the worker ended, or for a timeout what the last `next()` rejected with, absent for a timeout with nothing rejected. | Type: `string`. Optional. Read-only. |
| `budget` | <Documented /> | The grace the handler runs under, in milliseconds, past it, the hook is absent as if it had no handler. | Type: `number`. Read-only. |

### `HookBudget`

The time bounds every hook runs under, in milliseconds: the engine's own constants are typed by these members, and `next.budget` reads the live one. Object with the fields `ms`, `catchMs`, `lingerMs`. Each bounds the hook's own time. The clock stops during a `next(e)` or `$` call of the hook.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `ms` | <Documented /> | A hook's budget per dispatch, from its call to its return, past it the hook is absent (its `.catch` asked, else `next(e)` run on its behalf). | Type: `10_000`. A streaming hook counts only the time its own code runs, not the time at a `yield`. Read-only. |
| `catchMs` | <Documented /> | A `.catch` handler's grace: a fresh budget from the moment it is called, on the same clock (its `next` replay and its `$` calls are free). | Type: `1_000`. Past it the hook is absent as if it had no handler, `next.error.budget` and `next.budget.ms` both read it there. `engine.create` has no budget. Read-only. |
| `lingerMs` | <Documented /> | How long a hook may keep running after `next.signal` aborted (the person interrupted, a hook above settled first, its own budget ran out). | Type: `5_000`. Past it the hook is reported as lingering, the dispatch had already gone on without it when the signal aborted. Read-only. |

### `NextBudget`

The budget the code reading `next.budget` runs under: the whole allowance and what is left of it now, plain data read fresh on each access. Object with the fields `ms`, `remainingMs`. Where nothing meters the hook, `ms` is 0 and `remainingMs` is `Infinity`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `ms` | <Documented /> | The whole budget in milliseconds, 0 where nothing meters this `next`. | Type: `number`. On `session.end` it is no more than what is left of the one short bound of the whole dispatch. Read-only. |
| `remainingMs` | <Documented /> | What is left of it now, in milliseconds, never below 0, Infinity where nothing meters. It stands still while a `next` or `$` call is in flight. | Type: `number`. On `session.end` the clock never stops, so a later hook starts with what the earlier ones left. Read-only. |

### `TraceEntry`

One settled run of a link beneath the caller, as `next.trace` lists it: data, not a handle. Object with the fields `index`, `plugin`, `tier`, `event`, `outcome`, `reason?`, `ms`, `chunks?`, `received`, `returned`. One entry for each link in the chain.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `index` | <Documented /> | The link's place in the chain, 0 the outermost. | Type: `number`. Read-only. |
| `plugin` | <Documented /> | The hook's plugin, `"engine"` for the engine's own core or bottom. | Type: `string`. Read-only. |
| `tier` | <Documented /> | The link's tier (Tier), `"core"` for the engine's own core or bottom. | Type: `Tier`. Read-only. |
| `event` | <Documented /> | Not described in the type file. | Type: `N`. Read-only. |
| `outcome` | <Documented /> | Not described in the type file. | Type: `TraceOutcome`. Read-only. |
| `reason` | <Documented /> | Why the link was skipped without running, when it was: `bypassed by <plugin>`, whose `next.to` went beneath this tier. Absent when it ran. | Type: `string`. Optional. Read-only. |
| `ms` | <Documented /> | Its own wall time, its `next()` calls' time in flight taken out. | Type: `number`. The engine entry's is everything beneath the last hook: in a hooks module, the host round trip. Read-only. |
| `chunks` | <Documented /> | How many chunks the link yielded up, on a streaming event, absent on every other. A link left mid-stream counts what it yielded before. | Type: `number`. Optional. Read-only. |
| `received` | <Documented /> | Not described in the type file. | Type: `E`. Read-only. |
| `returned` | <Documented /> | What the link settled on, undefined when it was skipped or rejected. | Type: `O \| undefined`. Read-only. |

### `Origin`

Who raised a dispatch, as `next.origin` holds it: the calling plugin's name and the tier it sits in, the engine reads `engine` in `core`. Object with the fields `plugin`, `tier`. Names the plugin and the tier of the caller. The host sets it. A plugin cannot write it.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `plugin` | <Documented /> | Whose hook made the `$` call, by name, `"engine"` for a call site, `"client"` for a `Client` surface module's `ui.message` post. | Type: `string`. Read-only. |
| `tier` | <Documented /> | Where that plugin sits among the chain's tiers (Tier), `"core"` for the engine, the owning plugin's for a `client` post. | Type: `Tier`. Read-only. |

### `Matcher`

What `on(event, matcher, hook)` takes for an argument of type `I`: the shape of the `e` the hook wants, a partial of it at any depth. Type of the second argument of `on`. A leaf is `===` or a `RegExp`. An array means any of. An object is a partial match of an object.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `[K in KnownKeys<I>]` | <Documented /> | Not described in the type file. | Type: `MatcherValue<I[K & keyof I], MatcherValueOf<All, K>>`. Optional. |

### `HookStream`

What `next(e)` returns on a streaming event: the stream of everything beneath, chunk by chunk, whose return value is the result from beneath. `yield* next(e)` forwards the chunks and gives the result. Used by `$.process.spawn`, `$.turn.step`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `result` | <Documented /> | Settles with what beneath returned once the stream has been read to its end, rejects if the stream is closed before that. | Type: `Promise<R>`. Read-only. |

### `HooksModule`

What a hooks module exports: `register`, and nothing the loader reads besides.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `register` | <Documented /> | Not described in the type file. | Type: `Register`. |

## Related Pages

- [Mod API Overview](../index.md)
- [Hooks and the Hook Chain](../hooks.md)
- [Event Table Types](events.md)
- [Mod API Types](index.md)
