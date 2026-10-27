---
title: The Testing Module
description: The claude-code/testing module that test files import, and the claude plugin test command that runs them.
sidebar_position: 17
---

`claude-code/testing` is the test kit that `*.test.ts` and `*.test.tsx` files import.
`claude plugin test` runs those files with no session, no sign-in, and no network.
A test runs in an environment like that of a hook, with no files, no network, and no process.
A hooks module in a session cannot import this module.

Each test ends after 5 seconds unless it sets `timeoutMs`. Test files live in the plugin folder.

Official page: [Test a Mod](https://code.claude.com/docs/en/plugins/mods/test), [Mods Reference](https://code.claude.com/docs/en/plugins/mods/reference). Source: the Mod API type file of the 2.1.311 program (`schemas/claude-code.d.ts`).

## Example

This test fires two tool calls and checks that `/tally` counts both.

```typescript title="tally.test.ts"
import { expect, test } from "claude-code/testing";

test("/tally reports the tool calls the mod has seen", async ($, on) => {
  on("tool.call", () => ({ result: "ok" }));
  await $.tool.call({ tool: "Bash", command: "ls" });
  await $.tool.call({ tool: "Read", file_path: "README.md" });
  const answer = await $.command.run({ command: "tally", args: "" });
  expect(answer.text).toBe(
    "Claude has made 2 tool calls since this mod loaded",
  );
});
```

## Exports

| Item | Status | What it does | How it works | Where it can be used |
| --- | --- | --- | --- | --- |
| `test(name, body)` | <Documented /> | Declares one test. `body` is `async ($, on) => {}`. | `$` is the engine's own, loaded from the plugin folder. The hooks that `on` registers sit beneath every plugin. Default timeout 5 seconds. Set `timeoutMs` to change it. | A test file under `claude plugin test <dir>`. |
| `describe(name, body)` | <Documented /> | Groups tests. Its name leads the title of each test inside. | The body runs at once, while the file loads. | Test files. |
| `expect(received, message?)` | <Documented /> | Assertions: `Matchers` (the `toBe` family), `AsyncMatchers`, `Negatable` (`not`), and the asymmetric matchers `expect.any` and `expect.objectContaining`. | Typed by `Expect`, `Expectation`, `Matchers`, `Matching`. | Test files. |
| `tier(tier)` | <Documented /> | Sets the tier that the plugin under test loads in. `PluginTier` excludes `core`. | Call it before the tests. | Test files. |
| `mock` | <Documented /> | Memory-backed answers for the nouns beneath the plugins: clock, store, env, session, and more. | `MockClock`, `MockSession`, and the options are typed in the testing module. | Test files. |
| `$.tool.call(input)` | <Documented /> | Raises a tool call as the engine does. `agentId` names the loop it runs in, a subagent's or a teammate's (new in 2.1.307). Left out, the main loop. | A hooked `tool.check` runs as for a background subagent: a test's `classic.PermissionRequest` answers an ask, and no test plays a person's yes. Typed by `EngineToolCall`. | Tests only. |
| `$.ui.mount(...)` | <Documented /> | Draws a component through the plugin on the surface that the test names. Returns a handle to read and act on by key. | Surfaces: `terminal`, `desktop`, `vscode`, `mobile`. The handle finds, presses, types, selects, resizes, and unmounts. It tests the mod, not the paint. | Tests only. |

## Errors

Each row is a family of messages. The backticked text is the start that every message in the family shares. A row marked `Various` gathers the messages of one feature that do not share one start.

| Start of Message | Status | What It Means | Cases |
| --- | --- | --- | --- |
| `$.classic.`, `$.${…} is no call`, `$.${…} in a test` | <Undocumented /> | A test called a `$` call that the test kit does not know. | A classic event such as `$.classic.PreToolUse` is no call on `$`, and a test passes the whole input of its event. |
| `$.ui.` | <Undocumented /> | A `$.ui` call in a test found no drawn element, or found more than one. | No element of the kind is drawn, the tree holds more than one with the key (name the `requestId` or the surface), render or mount the tree first, an element is mounted already, or the test ended while the drawing was raised. |
| `test(name, { plugins })` | <Undocumented /> | The `plugins` option of `test()` was refused. | A plugin is loaded twice, a name is not a plugin name (lowercase letters, digits and dashes), or a plugin's register is not written `register(on) { ... }`. |
| `advance(` | <Undocumented /> | `advance()` fired timer ticks and more were due. | Advance in smaller steps, or check for an `every` that the module re-arms on each tick. |
| `claude plugin test:` | <Undocumented /> | `claude plugin test` could not run. | A folder is not in the plugin, holds no `*.test.ts` or `*.test.tsx` files, or holds more test files than the limit. |
| `the kit's` | <Undocumented /> | The test kit imports a module that is not part of it. | The text names the file and the import. |
| Various | <Undocumented /> | **Plugin evals.** A plugin eval suite or its mocks could not be run. | The eval directory, a case, a mock, or a fixture is not a plain readable directory or file (a symbolic link, a hard link, a name that differs only by letter case, or a path that escapes the plugin), a `tools:`, `error:`, or `abort_when:` key is used where it does not apply, or a saved `tools/list` response is not valid JSON. |

## Related Pages

- [Mod API Overview](index.md)
- [Testing Types](types/testing.md) (types of the test kit)
