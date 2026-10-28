---
title: Testing Types
description: "Types of the claude-code/testing module: tests, mounted drawings, the mock clock, and matchers."
sidebar_position: 8
---

These are the types of the `claude-code/testing` module, which a mod uses to test itself.
They describe a test, a mounted drawing, the mock clock, and the matchers.

Import from `claude-code/testing` inside your own mod tests.

## Pages

| Page | What is in it |
| --- | --- |
| [Testing Matcher and Engine Types](matchers-engine.md) | `AsymmetricMatcher` to `Matching`: matchers, the engine and its inputs, element queries, found elements, and expectations. |
| [Testing Mock, Mount, and Target Types](mocks-mounts.md) | `Mock` to `WithMessage`: mocks, mounted members, mount targets, press and select targets, and test options. |

## Example

The first line checks that a mounted drawing holds two buttons. The second line declares a test with options.

```ts
expect(await ui.findAll({ type: "Button" })).toHaveLength(2);
test("greets", { options: { greeting: "yo" } }, body);
```

## Types without Fields

These types are aliases, unions, or plain shapes. Each row gives its use and its shape.

| Type | Status | What it is for | Shape and limits |
| --- | --- | --- | --- |
| `ClassicEvent` | <Documented /> | A classic hook event that the engine raises on its own, by its own name (`SessionStart`, `Stop`): all but `PreToolUse`, which rides `tool.call`. | Alias of the classic event names without `PreToolUse`. `$.tool.call` raises `classic.PreToolUse` as a session does. |
| `ClassicFields` | <Documented /> | What `$.classic.<Event>` takes: the own fields of the event as its hook sees them on `e`, less what the engine stamps at every call site. | Alias of the fields of a classic event. `hook_event_name` is the call's. `session_id`, `transcript_path`, and `cwd` are the session's unless the test gives them. |
| `Constructor` | <Documented /> | A class, as `toThrow`, `toBeInstanceOf` and `expect.any` take it. | Alias of `abstract new (...args: never[]) => unknown`. |
| `describe` | <Documented /> | A group of tests: its name leads the title of each test declared inside. Its body runs at once, while the file loads. | Function `(name, body) => void`. `name` leads the title of each test inside. `body` declares the tests and runs at once. |
| `EngineCall` | <Documented /> | One call on the `$` of the engine. It takes the whole input of the event, as a call site of the engine passes it. It returns the result, or for a streaming event the stream. | Alias of `E extends StreamingEventName ? (e: Args<E>) => HookStream<Chunk<E>, ResultOf[E]> : (e: Args<E>) => Promise<ResultOf[E]>`. |
| `EngineToolCall` | <Documented /> | `$.tool.call` on a test's `$`: a call as the engine raises one, `agentId` the loop it runs in (a subagent's, a teammate's), left out the main loop (new in 2.1.307). | Alias of `{ <T extends string>(input: ToolCallArgs & Pick<ToolCallReserved<T>, 'tool'> & AgentLoop): Promise<ToolCallResult<T>>, (input: ToolCallArgs & AgentLoop): Promise<ToolCallResult> }`. A hooked `tool.check` runs as for a background subagent: a test's `classic.PermissionRequest` answers an ask, and no test plays a person's yes. A test states `isReadOnly` on `$.tool.check`. |
| `EngineNounEvent` | <Documented /> | The events of one noun that the `$` of a test carries: every one but `ui.resolve`. A render hook calls `ui.resolve` on its own `$`, and the engine never raises it. | Alias of `` Exclude<keyof EventCalls[N] & string, `${N}.resolve` extends 'ui.resolve' ? 'resolve' : never> ``. |
| `Expect` | <Documented /> | The checks on a value (`expect(received)`), and with them the matchers that stand inside an expected value (`expect.any(Number)`). | Alias of `Expecting & Matching`. A check that fails throws. In a hook, the engine skips the hook and the test still fails with the message of the check. |
| `expect` | <Documented /> | Checks a value: `expect(received).toEqual(expected)` throws an AssertionError that names both sides when it fails. A message given leads it. | Alias of `export const expect: Expect`. `.not` negates. `.resolves` and `.rejects` check what a promise settles with. `expect.any(Number)` and its kin stand inside an expected value. |
| `Expecting` | <Documented /> | `expect(received, message?)`: the checks on a value. A message of the own test leads the message of a failure. | Alias of `(received: unknown, message?: string) => Expectation`. |
| `mock` | <Documented /> | The world beneath the plugins, mocked noun by noun: `mock.clock`, `mock.store`, `mock.env` and `mock.session`. | Alias of `export const mock: Mock`. Each registers hooks of the test on the `on` that it gets. The hooks are visible where the test calls it. Each answers its noun from memory or records it. |
| `Mounted` | <Documented /> | A drawing of component `C` that the test mounted on surface `P`. It reads over its description and acts on its elements by key. `Client` acts where `P` has one. | Alias of the members of a mounted drawing, narrowed by the `surface` the test passed. No `input` on `mobile` and no `key` on `vscode`. |
| `MountKeyEvent` | <Documented /> | What the `key` of a mounted drawing takes: the key as the `onKey` listener of a `Client` receives it (ClientKeyEvent), and which `Client` when several. | Alias of `ClientKeyEvent & ClientScope`. |
| `MountPointerEvent` | <Documented /> | What the `pointer` of a mounted drawing takes: the event as the `onPointer` listener of a `Client` receives it, in the cells of its region, and which one. | Alias of `ClientPointerEvent & ClientScope`. |
| `PluginTier` | <Documented /> | A tier a plugin loads in: every tier but the own tier of the engine. | Alias of `Exclude<Tier, 'core'>`. |
| `test` | <Documented /> | One test: it passes when its body returns or resolves. It fails when it throws, rejects or outlasts its time (5000 ms, or `timeoutMs`). | Alias of the `test` function. The body gets the `$` of the engine and an `on` whose hooks sit beneath every plugin. A failure lists each hook that was skipped, and why. |
| `TestBody` | <Documented /> | A test: the `$` of the engine, and `on`, the registrar of a plugin. Its hooks sit beneath every plugin. Beneath them the bottom hook throws, and it names its event. | Alias of `($: Engine, on: On) => unknown`. Register hooks before the first call on `$`, which loads the plugins. A failed check in a hook fails the test. |
| `TestRest` | <Documented /> | What follows the name of a test: its body, or its options then its body. | Alias of `readonly [body: TestBody] \| readonly [options: TestOptions, body: TestBody]`. |
| `ThrowExpectation` | <Documented /> | What `toThrow` compares the thrown error with: a substring or pattern of its message, its class, a value that carries the whole message, or nothing. | Alias of `string \| RegExp \| Constructor \| WithMessage`. |
| `tier` | <Documented /> | Says which tier the plugin under test loads in, once, at the top of the file: `prepend`, `user` (when you say nothing), `append` or `builtin`. | Function `(tier: PluginTier) => void`. Call it once at the top of the test file. |

## Related Pages

- [Mod API Overview](../../index.md)
- [The claude-code/testing Module](../../calls/testing.md)
- [Mod API Types](../index.md)
