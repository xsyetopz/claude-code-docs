---
title: "The Testing Module"
description: "The claude-code/testing module that test files import, and the claude plugin test command that runs them."
url: https://xsyetopz.github.io/claude-code-docs/extend/mod-api/testing
source: docs/extend/mod-api/testing.md
---

# The Testing Module


`claude-code/testing` is the test kit that `*.test.ts` and `*.test.tsx` files import.
`claude plugin test` runs those files with no session, no sign-in, and no network.
A test runs in an environment like that of a hook, with no files, no network, and no process.
A hooks module in a session cannot import this module.

Each test ends after 5 seconds unless it sets `timeoutMs`. Test files live in the plugin folder.

Official page: [Test a Mod](https://code.claude.com/docs/en/plugins/mods/test), [Mods Reference](https://code.claude.com/docs/en/plugins/mods/reference). Source: the program (`types-2.1.304.d.ts`).

## Example

This test fires two tool calls and checks that `/tally` counts both.

```typescript title="tally.test.ts"
import { expect, test } from 'claude-code/testing'

test('/tally reports the tool calls the mod has seen', async ($, on) => {
  on('tool.call', () => ({ result: 'ok' }))
  await $.tool.call({ tool: 'Bash', command: 'ls' })
  await $.tool.call({ tool: 'Read', file_path: 'README.md' })
  const answer = await $.command.run({ command: 'tally', args: '' })
  expect(answer.text).toBe('Claude has made 2 tool calls since this mod loaded')
})
```

## Exports

| Item | Status | What it does | How it works | Where it can be used |
| --- | --- | --- | --- | --- |
| `test(name, body)` | [Documented] | Declares one test. `body` is `async ($, on) => {}`. | `$` is the engine's own, loaded from the plugin folder. The hooks that `on` registers sit beneath every plugin. Default timeout 5 seconds. Set `timeoutMs` to change it. | A test file under `claude plugin test <dir>`. |
| `describe(name, body)` | [Documented] | Groups tests. Its name leads the title of each test inside. | The body runs at once, while the file loads. | Test files. |
| `expect(received, message?)` | [Documented] | Assertions: `Matchers` (the `toBe` family), `AsyncMatchers`, `Negatable` (`not`), and the asymmetric matchers `expect.any` and `expect.objectContaining`. | Typed by `Expect`, `Expectation`, `Matchers`, `Matching`. | Test files. |
| `tier(tier)` | [Documented] | Sets the tier that the plugin under test loads in. `PluginTier` excludes `core`. | Call it before the tests. | Test files. |
| `mock` | [Documented] | Memory-backed answers for the nouns beneath the plugins: clock, store, env, session, and more. | `MockClock`, `MockSession`, and the options are typed in the testing module. | Test files. |
| `$.ui.mount(...)` | [Documented] | Draws a component through the plugin on the surface that the test names. Returns a handle to read and act on by key. | Surfaces: `terminal`, `desktop`, `vscode`, `mobile`. The handle finds, presses, types, selects, resizes, and unmounts. It tests the mod, not the paint. | Tests only. |

## Related Pages

- [Mod API Overview](https://xsyetopz.github.io/claude-code-docs/extend/mod-api.md)
- [Testing Types](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/types/testing.md) (types of the test kit)
