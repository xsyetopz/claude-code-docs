---
title: "Testing Types"
description: "Types of the claude-code/testing module: tests, mounted drawings, the mock clock, and matchers."
url: https://xsyetopz.github.io/claude-code-docs/extend/mod-api/types/testing
source: docs/extend/mod-api/types/testing.md
---

# Testing Types


These are the types of the `claude-code/testing` module, which a mod uses to test itself.
They describe a test, a mounted drawing, the mock clock, and the matchers.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | ✅ Yes. Import from `claude-code/testing` inside your own mod tests. |
| Can you change it? | ❌ No. These are types only. They describe data, and they do not hold settings. |
| Can you turn it on or off? | ❌ No. A type has no switch. |
| Where does it live? | The published type file `types-2.1.303.d.ts` and `.claude-plugin/types/claude-code/index.d.ts`. |
| Status | [Documented] |

## Example

The first line checks that a mounted drawing holds two buttons. The second line declares a test with options.

```ts
expect(await ui.findAll({ type: 'Button' })).toHaveLength(2)
test('greets', { options: { greeting: 'yo' } }, body)
```

## Types without Fields

These types are aliases, unions, or plain shapes. Each row gives its use and its shape.

| Type | Status | What it is for | Shape and limits |
| --- | --- | --- | --- |
| `ClassicEvent` | [Documented] | A classic hook event the engine raises on its own, by its own name (`SessionStart`, `Stop`): all but `PreToolUse`, which rides `tool.call`. | Alias of the classic event names without `PreToolUse`. `$.tool.call` raises `classic.PreToolUse` as a session does. |
| `ClassicFields` | [Documented] | What `$.classic.<Event>` takes: the event's own fields as its hook sees them on `e`, less what the engine stamps at every call site. | Alias of the fields of a classic event. `hook_event_name` is the call's. `session_id`, `transcript_path`, and `cwd` are the session's unless the test gives them. |
| `Constructor` | [Documented] | A class, as `toThrow`, `toBeInstanceOf` and `expect.any` take it. | Alias of `abstract new (...args: never[]) => unknown`. |
| `describe` | [Documented] | A group of tests: its name leads the title of each test declared inside, and its body runs at once, while the file loads. | Function `(name, body) => void`. `name` leads the title of each test inside. `body` declares the tests and runs at once. |
| `EngineCall` | [Documented] | One call on the engine's `$`: the event's input whole, as an engine call site passes it, to its result, or for a streaming event to its stream. | Alias of `E extends StreamingEventName ? (e: Args<E>) => HookStream<Chunk<E>, ResultOf[E]> : (e: Args<E>) => Promise<ResultOf[E]>`. |
| `EngineNounEvent` | [Documented] | The events of one noun a test's `$` carries: every one but `ui.resolve`, which a render hook calls on its own `$` and the engine never raises. | Alias of `` Exclude<keyof EventCalls[N] & string, `${N}.resolve` extends 'ui.resolve' ? 'resolve' : never> ``. |
| `Expect` | [Documented] | The checks on a value (`expect(received)`), and with them the matchers that stand inside an expected value (`expect.any(Number)`). | Alias of `Expecting & Matching`. A check that fails throws. In a hook, the engine skips the hook and the test still fails with the check's message. |
| `expect` | [Documented] | Checks a value: `expect(received).toEqual(expected)` throws an AssertionError naming both sides when it fails, a message given leading. | Alias of `export const expect: Expect`. `.not` negates, `.resolves` and `.rejects` check what a promise settles with, `expect.any(Number)` and its kin stand inside an expected value. |
| `Expecting` | [Documented] | `expect(received, message?)`: the checks on a value, a message of the test's own leading a failure's. | Alias of `(received: unknown, message?: string) => Expectation`. |
| `mock` | [Documented] | The world beneath the plugins, mocked noun by noun: `mock.clock`, `mock.store`, `mock.env` and `mock.session`. | Alias of `export const mock: Mock`. Each registers hooks of the test's on the `on` it is handed, visible where the test calls it, and answers its noun from memory or records it. |
| `Mounted` | [Documented] | A drawing of component `C` the test mounted on surface `P`: reads over its description, acts on its elements by key, `Client` acts where `P` has one. | Alias of the members of a mounted drawing, narrowed by the `surface` the test passed. No `input` on `mobile` and no `key` on `vscode`. |
| `MountKeyEvent` | [Documented] | What a mounted drawing's `key` takes: the key as a `Client`'s `onKey` listener receives it (ClientKeyEvent), and which `Client` when several. | Alias of `ClientKeyEvent & ClientScope`. |
| `MountPointerEvent` | [Documented] | What a mounted drawing's `pointer` takes: the event as a `Client`'s `onPointer` listener receives it, in its region's cells, and which one. | Alias of `ClientPointerEvent & ClientScope`. |
| `PluginTier` | [Documented] | A tier a plugin loads in: every tier but the engine's own. | Alias of `Exclude<Tier, 'core'>`. |
| `test` | [Documented] | One test: it passes when its body returns or resolves, and fails when it throws, rejects or outlasts its time (5000 ms, or `timeoutMs`). | Alias of the `test` function. The body gets the engine's `$` and an `on` whose hooks sit beneath every plugin. A failure lists each hook that was skipped, and why. |
| `TestBody` | [Documented] | A test: the engine's `$`, and `on`, a plugin's registrar, whose hooks sit beneath every plugin, beneath them the bottom hook throws, naming its event. | Alias of `($: Engine, on: On) => unknown`. Register hooks before the first call on `$`, which loads the plugins. A failed check in a hook fails the test. |
| `TestRest` | [Documented] | What follows a test's name: its body, or its options then its body. | Alias of `readonly [body: TestBody] \| readonly [options: TestOptions, body: TestBody]`. |
| `ThrowExpectation` | [Documented] | What `toThrow` compares the thrown error with: a substring or pattern of its message, its class, a value carrying the whole message, or nothing. | Alias of `string \| RegExp \| Constructor \| WithMessage`. |
| `tier` | [Documented] | Says which tier the plugin under test loads in, once, at the top of the file: `prepend`, `user` (when unsaid), `append` or `builtin`. | Function `(tier: PluginTier) => void`. Call it once at the top of the test file. |

## Types with Fields

Each type below has its own table of fields.

### `AsymmetricMatcher`

A value that matches by a rule inside `toEqual` and its kin (`expect.any`, `expect.objectContaining`), known by its text in a failure. Object with fields `text`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | [Documented] | Not described in the type file. | Type: `string`. Read-only. |

### `AsyncMatchers`

The same checks on what a promise received settles with, each resolving once the promise has settled and the check passed. Object with fields `[K in keyof Matchers]`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `[K in keyof Matchers]` | [Documented] | Not described in the type file. | Type: `(...args: Parameters<Matchers[K]>) => Promise<void>`. |

### `ClientScope`

Which `Client` of a mounted drawing an act or a read means, by the `key` its element carries, optional while the drawing holds exactly one. Object with fields `in?`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `in` | [Documented] | Not described in the type file. | Type: `string`. Optional. |

### `ElementOfAct`

The element each surface-dependent act of a mounted drawing reaches: a handle carries the act only where the surface's table has the element. Object with the fields `input`, `select`, `key`, `pointer`, `post`, `advance`, `resize`. `input` needs an `Input` and `select` needs a `Select`. The others reach a `Client`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `input` | [Documented] | Not described in the type file. | Type: `'Input'`. |
| `select` | [Documented] | Not described in the type file. | Type: `'Select'`. |
| `key` | [Documented] | Not described in the type file. | Type: `'Client'`. |
| `pointer` | [Documented] | Not described in the type file. | Type: `'Client'`. |
| `post` | [Documented] | Not described in the type file. | Type: `'Client'`. |
| `advance` | [Documented] | Not described in the type file. | Type: `'Client'`. |
| `resize` | [Documented] | Not described in the type file. | Type: `'Client'`. |

### `ElementQuery`

What a mounted drawing's `find` and `findAll` match an element on, every field given at once: its tag, its `key`, and the text it shows. Object with the fields `type?`, `key?`, `text?`, `in?`. `text` matches the whole shown text: a string by inclusion, a `RegExp` by test.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `type` | [Documented] | Not described in the type file. | Type: `string`. Optional. |
| `key` | [Documented] | Not described in the type file. | Type: `string`. Optional. |
| `text` | [Documented] | Not described in the type file. | Type: `string \| RegExp`. Optional. |
| `in` | [Documented] | Searches what this `Client`'s surface module drew (by the `Client`'s key) instead of the plugin's own tree. | Type: `string`. Optional. |

### `Engine`

What a test holds as `$`, the engine's own: every call on it is made as the REPL, the query loop and the render sites make theirs, over every plugin. Object with one call for each event noun, plus `classic`. `next.origin` is the engine. `$.ui.mount` draws an instance. `press`, `input`, and `select` act on it.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `[N in keyof EventCalls]` | [Documented] | One entry for each noun in `EventCalls`. | Type: `N extends 'ui' ? EngineNoun<N> & EnginePress & EngineInput & EngineSelect & EngineMount : EngineNoun<N>`. |
| `classic` | [Documented] | Not described in the type file. | Type: `EngineClassic`. |

### `EngineClassic`

The classic (settings) hook events as the engine raises them: each a call running the `classic.<Event>` chain over every plugin hooked on it. Object with one call for each classic event. The test's `on('classic.<Event>')` is the bottom of the chain. Example: `await $.classic.SessionStart({ source: 'clear' })`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `[E in ClassicEvent]` | [Documented] | Not described in the type file. | Type: `` (e: ClassicFields<E>) => Promise<ClassicResultOf[`classic.${E}`]> ``. |

### `EngineInput`

A surface typing into an Input a test rendered: the `ui.input` chain over every plugin hooked on it, the Input's own handler last. Object with fields `input`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `input` | [Documented] | Types into the Input, as an edit (`kind` `change`, reaching `onInput`) or Enter (`submit`, the default, reaching `onSubmit`) with that text. | Type: `(target: InputTarget) => Promise<UiInputResult \| undefined>`. Types text into an `Input`. Rejects if no such input is drawn, or several are and none is named. |

### `EngineMount`

A surface drawing a component instance through the plugins, then driven by key through a handle typed by that surface (Mounted). Object with the field `mount`. It raises `ui.render` for those props, validates the tree, and runs its `Client` modules.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `mount` | [Documented] | Raises the plugins' drawing of the component on the surface and holds it, as that surface showing the instance does. | Type: `<P extends RenderSurface, C extends RenderComponent>(target: MountTarget<P, C>) => Promise<Mounted<P, C>>`. Draws a component on a surface. Rejects if the surface cannot draw the tree. |

### `EngineNoun`

One noun of the engine's `$`: each of its events as the engine calls it, `tool.call` and `ui.render` typed per tool and component, `ui.resolve` out. Object with fields `[V in EngineNounEvent<N>]`. `skill.prompt` takes a call's input: its frontmatter and source may be left out, as a test written before the event carried them does.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `[V in EngineNounEvent<N>]` | [Documented] | One entry for each event of that noun. | Type: `` `${N}.${V}` extends 'tool.call' \| 'ui.render' \| 'skill.prompt' ? EventCalls[N][V] : EngineCall<`${N}.${V}` & EventName> ``. |

### `EnginePress`

A surface pressing a Button a test rendered, or a Markdown's link: the `ui.press` chain over every plugin hooked on it, its own closure last. Object with fields `press`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `press` | [Documented] | Presses the Button, as a click or its hotkey does, with `link`, the Markdown's link, as a click on it does. | Type: `(target: PressTarget) => Promise<UiPressResult \| undefined>`. Presses an element. Resolves once all the work that `onPress` started has settled. Rejects if no such element is drawn. |

### `EngineSelect`

A surface picking an option of a Select a test rendered: the `ui.select` chain over every plugin hooked on it, the Select's own `onSelect` last. Object with fields `select`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `select` | [Documented] | Picks the option, as choosing it on the surface does, resolves once the chain, `onSelect` and the work it started have settled. | Type: `(target: SelectTarget) => Promise<UiSelectResult \| undefined>`. Picks a value in a `Select`. Example: `await $.ui.select({ plugin: 'notes', key: 'sort', value: 'date' })`. |

### `Expectation`

What `expect(received)` answers: the checks, their negation, and the checks on what a promise received resolves or rejects with. Combines `Expectation`, `Negatable`, `Matchers`. Object with fields `resolves`, `rejects`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `resolves` | [Documented] | The checks on what the promise received resolves with, a rejection fails them. | Type: `Negatable<AsyncMatchers>`. |
| `rejects` | [Documented] | The checks on what the promise received rejects with, a resolution fails them. | Type: `Negatable<AsyncMatchers>`. |

### `FoundElement`

One element of a mounted drawing as `find` returns it: the description the plugin's hook (or a `Client`'s module) built, read as plain data. Object with fields `type`, `key`, `props`, `text`, `children`. What every surface is handed to draw, not what any surface painted: the same on the terminal, the desktop, VS Code and mobile.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `type` | [Documented] | The element's tag: `Box`, `Text`, `Button`, `Input`, `Client`, ... | Type: `string`. |
| `key` | [Documented] | What its props carry as `key`, when they do. | Type: `string \| undefined`. |
| `props` | [Documented] | Its props, plain data: a Button's `label`, a Text's `color`, ..., handlers never cross (a Button's `onPress` is not here). | Type: `Record<string, unknown>`. |
| `text` | [Documented] | What it shows: its string children in document order and, for the leaves that draw a prop as text, that prop (ElementQuery `text`). | Type: `string`. |
| `children` | [Documented] | Its children as drawn: strings and element descriptions. | Type: `unknown[]`. |

### `InputTarget`

What `$.ui.input` takes: the plugin whose hook drew the Input, its `key`, the field's text, which input it is, instance and surface when several. Object with fields `plugin`, `key`, `text`, `kind?`, `requestId?`, `surface?`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `plugin` | [Documented] | Not described in the type file. | Type: `string`. |
| `key` | [Documented] | Not described in the type file. | Type: `string`. |
| `text` | [Documented] | The field's whole text at that moment: `e.value` for the chain. | Type: `string`. |
| `kind` | [Documented] | `submit` (the default) is Enter with that text and reaches `onSubmit`, `change` is one edit left in the field and reaches `onInput`. | Type: `UiInputArgument['kind']`. Optional. A person typing is a run of `change`s, then a `submit`. |
| `requestId` | [Documented] | Which instance holds it, when the plugin drew the key in several. | Type: `string`. Optional. |
| `surface` | [Documented] | Which surface's drawing, when the key is drawn on more than one, the input carries the surface of the drawing it lands in either way. | Type: `RenderSurface`. Optional. |

### `Matchers`

The checks `expect(received)` offers, each throws an AssertionError when it fails, naming what was expected and what was received. Object with 23 matchers: the `toBe` family, the `toContain` family, `toHaveLength`, `toHaveProperty`, `toMatch`, `toStartWith`, `toEndWith`, `toBeInstanceOf`, and `toThrow`. The full list is in the d.ts.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `toBe` | [Documented] | Passes when received is the value, by `Object.is`. | Type: `(expected: unknown) => void`. Parameter `expected`: the value. |
| `toEqual` | [Documented] | Passes when received equals the value in structure, properties holding undefined ignored, `expect.any` and its kin match inside it. | Type: `(expected: unknown) => void`. Parameter `expected`: the value. |
| `toStrictEqual` | [Documented] | As `toEqual`, but undefined properties and prototypes count. | Type: `(expected: unknown) => void`. Parameter `expected`: the value. |
| `toMatchObject` | [Documented] | Passes when received holds at least the object's properties, equal. | Type: `(expected: object) => void`. Parameter `expected`: the object. |
| `toContain` | [Documented] | Passes when a string received includes the item, or an iterable received has an element that is it. | Type: `(item: unknown) => void`. Parameter `item`: the substring or element. |
| `toContainEqual` | [Documented] | Passes when an iterable received has an element equal to the item. | Type: `(item: unknown) => void`. Parameter `item`: the element. |
| `toHaveLength` | [Documented] | Passes when received's `length` is the number. | Type: `(length: number) => void`. Parameter `length`: the number. |
| `toHaveProperty` | [Documented] | Passes when received holds a property at the path (`a.b`, or the keys in order), equal to the value when one is given. | Type: `(path: string \| readonly string[], value?: unknown) => void`. Parameter `path`: the property's path. Parameter `value`: what it must equal, when given. |
| `toBeUndefined` | [Documented] | Passes when received is undefined. | Type: `() => void`. |
| `toBeDefined` | [Documented] | Passes when received is anything but undefined. | Type: `() => void`. |
| `toBeNull` | [Documented] | Passes when received is null. | Type: `() => void`. |
| `toBeTruthy` | [Documented] | Passes when received is truthy. | Type: `() => void`. |
| `toBeFalsy` | [Documented] | Passes when received is falsy. | Type: `() => void`. |
| `toBeNaN` | [Documented] | Passes when received is NaN. | Type: `() => void`. |
| `toBeGreaterThan` | [Documented] | Passes when received is greater than the bound. | Type: `(bound: number \| bigint) => void`. Parameter `bound`: the bound. |
| `toBeGreaterThanOrEqual` | [Documented] | Passes when received is the bound or greater. | Type: `(bound: number \| bigint) => void`. Parameter `bound`: the bound. |
| `toBeLessThan` | [Documented] | Passes when received is less than the bound. | Type: `(bound: number \| bigint) => void`. Parameter `bound`: the bound. |
| `toBeLessThanOrEqual` | [Documented] | Passes when received is the bound or less. | Type: `(bound: number \| bigint) => void`. Parameter `bound`: the bound. |
| `toMatch` | [Documented] | Passes when a string received includes the text, or the pattern matches it. | Type: `(pattern: string \| RegExp) => void`. Parameter `pattern`: the text or pattern. |
| `toStartWith` | [Documented] | Passes when a string received starts with the prefix. | Type: `(prefix: string) => void`. Parameter `prefix`: the prefix. |
| `toEndWith` | [Documented] | Passes when a string received ends with the suffix. | Type: `(suffix: string) => void`. Parameter `suffix`: the suffix. |
| `toBeInstanceOf` | [Documented] | Passes when received is an instance of the class. | Type: `(expected: Constructor) => void`. Parameter `expected`: the class. |
| `toThrow` | [Documented] | Passes when calling received throws (or, under `rejects`, the rejection is) an error as described: by substring, pattern, class or message. | Type: `(expected?: ThrowExpectation) => void`. Parameter `expected`: the description, any throw passes without one. |

### `Matching`

The matchers that stand inside an expected value, each matching received there by a rule instead of by equality. Object with fields `any`, `anything`, `stringContaining`, `stringMatching`, `objectContaining`, `arrayContaining`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `any` | [Documented] | Matches any instance of the class, a primitive by its wrapper (`expect.any(Number)`). | Type: `(expected: Constructor) => AsymmetricMatcher`. Parameter `expected`: the class. Returns: the matcher. |
| `anything` | [Documented] | Matches anything but null and undefined. | Type: `() => AsymmetricMatcher`. Returns: the matcher. |
| `stringContaining` | [Documented] | Matches a string that includes the text. | Type: `(text: string) => AsymmetricMatcher`. Parameter `text`: the substring. Returns: the matcher. |
| `stringMatching` | [Documented] | Matches a string the pattern matches. | Type: `(pattern: string \| RegExp) => AsymmetricMatcher`. Parameter `pattern`: the pattern, or the source of one. Returns: the matcher. |
| `objectContaining` | [Documented] | Matches an object holding at least the shape's properties, equal. | Type: `(shape: object) => AsymmetricMatcher`. Parameter `shape`: the properties. Returns: the matcher. |
| `arrayContaining` | [Documented] | Matches an array holding an element equal to each of the items. | Type: `(items: readonly unknown[]) => AsymmetricMatcher`. Parameter `items`: the elements. Returns: the matcher. |

### `Mock`

The world beneath the plugins, mocked noun by noun: each member registers hooks of the test's on `on`, visible where the test calls it. Object with fields `clock`, `store`, `env`, `session`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `clock` | [Documented] | Answers `$.clock` from a clock in memory that moves only when the test moves it: `clock.now` reads it, and each wait is held. | Type: `(on: On, options?: MockClockOptions) => MockClock`. A fake clock. A held wait resolves when an advance crosses its time. `options.now` sets the start time (0 by default). |
| `store` | [Documented] | Answers `$.store` from a store in memory: `get`, `set`, `delete` and `keys` over it, as the engine keeps a plugin's own. | Type: `(on: On, entries?: Readonly<Record<string, unknown>>) => void`. Parameter `on`: the test's `on`. Parameter `entries`: what the store holds at the start (nothing when not given). |
| `env` | [Documented] | Answers `$.env.get` from a set of variables, one not listed is unset. | Type: `(on: On, variables: Readonly<Record<string, string>>) => void`. Parameter `on`: the test's `on`. Parameter `variables`: the environment the plugins read. |
| `session` | [Documented] | Records what is appended to the session's conversations: each row the kit stored for a plugin's `$.session.append`, or for the test's own. | Type: `(on: On) => MockSession`. Gives a fake session that stores appended rows. Returns the rows appended so far. |

### `MockClock`

The clock `mock.clock` hands back: the time its hooks answer, and the only ways it moves. Object with fields `now`, `advance`, `set`, `settle`, `sleep`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `now` | [Documented] | The time now, in milliseconds: what `$.clock.now()` resolves beneath the plugins. | Type: `() => number`. Returns: the time. |
| `advance` | [Documented] | Moves the clock on, resolving each wait due on the way (`$.clock.sleep`, `after`, `every`, this clock's `sleep`) in the order it comes due. | Type: `(ms: number) => Promise<void>`. Moves the fake clock by `ms`. Resolves once the clock is there and the event loop settled. |
| `set` | [Documented] | Moves the clock to a time at or past now, as `advance` would. | Type: `(ms: number) => Promise<void>`. Parameter `ms`: the time, in milliseconds. Returns: resolves once the clock is there and the event loop settled. |
| `settle` | [Documented] | Lets what is already under way run as far as it can without the clock moving: every wait due now resolves and the event loop settles. | Type: `() => Promise<void>`. The same as `advance(0)`. Use it between starting a dispatch and looking at what it did. |
| `sleep` | [Documented] | Resolves once the clock has moved this far past now: how a hook of the test's answers late. | Type: `(ms: number) => Promise<void>`. Parameter `ms`: how far, in milliseconds. Returns: resolves when an advance crosses that time. |

### `MockClockOptions`

Where a mocked clock starts: `now`, in milliseconds (0 when not given). Object with fields `now?`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `now` | [Documented] | Not described in the type file. | Type: `number`. Optional. |

### `MockSession`

The session `mock.session` hands back: what was appended to its conversations while the test ran. Object with fields `appended`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `appended` | [Documented] | The rows stored so far, oldest first, each as the event carried it: `message` as stored, `door`, `origin`, `uuid` and `agentId`. | Type: `() => readonly SessionAppendInput[]`. A plugin's own row has the door `note`, the plugin as `origin` and a fresh `uuid`, a row a hook above refused, or the kit, is left out. Returns: the rows. |

### `MountedMembers`

Every member a mounted drawing of component `C` can have, `Mounted<P, C>` keeps the ones surface `P` has the element for (ElementOfAct). Alias of the members `surface`, `drawn`, `find`, `findAll`, `press`, `input`, `select`, `key`, `pointer`, `post`, `advance`, `resize`, `redraw`, and `unmount`. Each act resolves once its work settled.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `surface` | [Documented] | Where this drawing is, as the test named it. | Type: `P`. Read-only. |
| `drawn` | [Documented] | The tree as last drawn: what the plugins' `ui.render` chain returned for this instance, validated by the surface's table, as plain data. | Type: `(scope?: ClientScope) => Promise<RenderElement>`. Gives the tree. Rejects if the surface could not draw it. Example: `expect(await ui.drawn()).toMatchObject({ type: 'Box' })`. |
| `find` | [Documented] | The first element matching the query, outermost first in document order, or undefined. | Type: `(query: ElementQuery) => Promise<FoundElement \| undefined>`. Finds one element by tag, key, or text. Example: `(await ui.find({ key: 'count' }))?.text`. |
| `findAll` | [Documented] | Every element matching the query, in document order. | Type: `(query: ElementQuery) => Promise<FoundElement[]>`. Finds all matching elements. Example: `expect(await ui.findAll({ type: 'Button' })).toHaveLength(2)`. |
| `press` | [Documented] | Presses the Button keyed `key`, as the person activating it on this surface does: the `ui.press` chain, the Button's own `onPress` last. | Type: `(target: MountPressTarget) => Promise<UiPressResult \| undefined>`. Presses the element with this `key`. With `link` it presses a link of a `Markdown`. Example: `await ui.press({ key: 'save' })`. |
| `input` | [Documented] | Types into the Input keyed `key`: the `ui.input` chain with the text as `e.value`, the Input's own handler last. | Type: `(target: MountInputTarget) => Promise<UiInputResult \| undefined>`. `kind` `submit` (default) is Enter with that text. `change` leaves it in the field. Example: `await ui.input({ key: 'title', text: 'groceries' })`. |
| `select` | [Documented] | Picks `value` in the Select keyed `key`: the `ui.select` chain, the Select's own `onSelect` last. | Type: `(target: MountSelectTarget) => Promise<UiSelectResult \| undefined>`. Picks the option `value` in the `Select` with this `key`. Example: `await ui.select({ key: 'sort', value: 'date' })`. |
| `key` | [Documented] | Hands a `Client`'s `onKey` listener one key, as a key pressed while its region has the focus does. | Type: `(event: MountKeyEvent) => Promise<void>`. Sends a key to a `Client`. Example: `await ui.key({ key: 'return', in: 'board' })`. |
| `pointer` | [Documented] | Hands a `Client`'s `onPointer` listener one event, in the cells of its region as every surface that draws a `Client` reports them. | Type: `(event: MountPointerEvent) => Promise<void>`. Sends a pointer event. Example: `await ui.pointer({ type: 'down', x: 2, y: 0, button: 'left' })`. |
| `post` | [Documented] | Posts as a `Client`'s own `surface.post(data)` does: the plugin's `ui.message` hooks run with `e.data`, `e.surface` this drawing's. | Type: `(data: JsonValue, scope?: ClientScope) => Promise<void>`. Posts data to a `Client`. A `{ props }` answer reaches the instance, which redraws with its state kept. |
| `advance` | [Documented] | Moves the drawing's frame clock on: each `surface.every(ms, fn)` timer of its `Client`s fires at every interval of its own the move crosses. | Type: `(ms: number) => Promise<void>`. Parameter `ms`: how far, in milliseconds. Example: `await ui.advance(250)`. |
| `resize` | [Documented] | Lays a `Client`'s region out at a size, as the surface measuring it does: what its module reads as `surface.columns` and `surface.rows`. | Type: `(size: MountResizeTarget) => Promise<void>`. Parameter `size`: cells across and down, `in`: which `Client`. Example: `await ui.resize({ columns: 40, rows: 3 })`. |
| `redraw` | [Documented] | Draws the instance again, as the engine does when its props change (a tool row's output arrived): the `ui.render` chain with the next props. | Type: `(props?: RenderPropsOf[C]) => Promise<void>`. Draws again with new props. A plugin's own `$.ui.invalidate` needs no call. |
| `unmount` | [Documented] | Lets the drawing go, as the surface dropping the instance does: its `Client`s and their timers end. Later acts on the handle reject. | Type: `() => Promise<void>`. Example: `await ui.unmount()`. |

### `MountInputTarget`

What a mounted drawing's `input` takes: the Input's key, the text, which of the two inputs it is (`submit` when unsaid), another plugin's name. Object with fields `key`, `text`, `kind?`, `plugin?`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `key` | [Documented] | Not described in the type file. | Type: `string`. |
| `text` | [Documented] | Not described in the type file. | Type: `string`. |
| `kind` | [Documented] | Not described in the type file. | Type: `UiInputArgument['kind']`. Optional. |
| `plugin` | [Documented] | Not described in the type file. | Type: `string`. Optional. |

### `MountPressTarget`

What a mounted drawing's `press` takes: the Button's key, another plugin's name when the Button is not the mounted plugin's, a link. Object with fields `key`, `plugin?`, `link?`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `key` | [Documented] | Not described in the type file. | Type: `string`. |
| `plugin` | [Documented] | Not described in the type file. | Type: `string`. Optional. |
| `link` | [Documented] | Presses this link of the Markdown keyed `key` instead of a Button. | Type: `PressedLink`. Optional. |

### `MountResizeTarget`

What a mounted drawing's `resize` takes: a `Client` region's size in cells, as the surface measuring it hands it, and which `Client`. Object with fields `columns`, `rows`, `in?`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `columns` | [Documented] | Not described in the type file. | Type: `number`. |
| `rows` | [Documented] | Not described in the type file. | Type: `number`. |
| `in` | [Documented] | Not described in the type file. | Type: `string`. Optional. |

### `MountSelectTarget`

What a mounted drawing's `select` takes: the Select's key, the picked option's value, another plugin's name when the Select is not its own. Object with fields `key`, `value`, `plugin?`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `key` | [Documented] | Not described in the type file. | Type: `string`. |
| `value` | [Documented] | Not described in the type file. | Type: `string`. |
| `plugin` | [Documented] | Not described in the type file. | Type: `string`. Optional. |

### `MountTarget`

What `$.ui.mount` takes: whose elements the test will act on, the surface that draws, and the component instance the engine asks the plugins for. Alias of the target of `mount`: `plugin`, `surface`, `component`, `props`, `requestId?`, `viewport?`. `surface` is never defaulted. Run one body over several surfaces.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `plugin` | [Documented] | Whose elements the handle's acts address by bare `key`: the plugin under test, usually. An act names another plugin to reach its element. | Type: `string`. |
| `surface` | [Documented] | What draws: its element table validates every tree the plugins return, and every dispatch the handle raises carries it as `e.surface`. | Type: `P`. One of `terminal`, `desktop`, `vscode`, `mobile`. |
| `component` | [Documented] | Which component the engine asks the plugins to draw (`Pane`, `AbovePrompt`, `ToolUse`, ...): what a `ui.render` matcher narrows on. | Type: `C`. |
| `props` | [Documented] | The component's props, what the hook reads as `e.props`. | Type: `RenderPropsOf[C]`. |
| `requestId` | [Documented] | The instance drawn (a pane's id, a tool row's tool_use_id), one is minted when absent. Two mounts of one component are two instances. | Type: `string`. Optional. |
| `viewport` | [Documented] | What the surface measured, as the hook reads it under `e.viewport`, absent when the surface has not measured, as on `e`. | Type: `RenderViewport`. Optional. Cells across and down. A `Client` starts at this size (0 by 0 when absent) until `resize` lays it out. |

### `Negatable`

A set of checks and, under `not`, the same set passing where they fail. Combines `Negatable`. Object with fields `not`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `not` | [Documented] | The checks negated. | Type: `M`. |

### `Plugin`

Written inline in a test and loaded as a plugin folder is: its name, the tier it loads in (`user` when not given), and its hooks module's `register`. Object with fields `name`, `tier?`, `register`. `register` is written `register(on) { ... }` and is self-contained, as a module's is: it closes over nothing of the test file.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | [Documented] | Not described in the type file. | Type: `string`. |
| `tier` | [Documented] | Not described in the type file. | Type: `PluginTier`. Optional. |
| `register` | [Documented] | Not described in the type file. | Type: `Register`. |

### `PressTarget`

What `$.ui.press` takes: the plugin whose `ui.render` hook drew the element, the `key` it gave it, the instance and surface when several, a `link`. Object with fields `plugin`, `key`, `requestId?`, `surface?`, `link?`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `plugin` | [Documented] | Not described in the type file. | Type: `string`. |
| `key` | [Documented] | Not described in the type file. | Type: `string`. |
| `requestId` | [Documented] | Which instance holds it, when the plugin drew the key in several. | Type: `string`. Optional. |
| `surface` | [Documented] | Which surface's drawing, when the key is drawn on more than one, the press carries the surface of the drawing it lands in either way. | Type: `RenderSurface`. Optional. |
| `link` | [Documented] | For a Markdown answering its links: which of them the press lands on. | Type: `PressedLink`. Optional. |

### `SelectTarget`

What `$.ui.select` takes: the plugin whose hook drew the Select, its `key`, the picked option's value, instance and surface when several. Object with fields `plugin`, `key`, `value`, `requestId?`, `surface?`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `plugin` | [Documented] | Not described in the type file. | Type: `string`. |
| `key` | [Documented] | Not described in the type file. | Type: `string`. |
| `value` | [Documented] | Which option is picked, by the `value` the Select listed it under. | Type: `string`. |
| `requestId` | [Documented] | Which instance holds it, when the plugin drew the key in several. | Type: `string`. Optional. |
| `surface` | [Documented] | Which surface's drawing, when the key is drawn on more than one, the pick carries the surface of the drawing it lands in either way. | Type: `RenderSurface`. Optional. |

### `TestOptions`

What `test` takes beside its name: the inline plugins it loads beside the one under test, and how long it may run (5000 ms when not given). Object with fields `plugins?`, `timeoutMs?`, `options?`. Also the plugin under test's `userConfig` values.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `plugins` | [Documented] | Not described in the type file. | Type: `readonly Plugin[]`. Optional. |
| `timeoutMs` | [Documented] | Not described in the type file. | Type: `number`. Optional. |
| `options` | [Documented] | The plugin under test's `userConfig` values, standing as the ones stored in settings. | Type: `PluginOptions`. Optional. `register(on, options)` receives them as in a real load, with defaults filled in. Left out, the manifest's defaults apply. |

### `WithMessage`

An error-like value `toThrow` compares by its whole message. Object with fields `message`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `message` | [Documented] | Not described in the type file. | Type: `string`. |

## Related Pages

- [Mod API Overview](https://xsyetopz.github.io/claude-code-docs/extend/mod-api.md)
- [The claude-code/testing Module](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/testing.md)
- [Mod API Types](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/types.md)
