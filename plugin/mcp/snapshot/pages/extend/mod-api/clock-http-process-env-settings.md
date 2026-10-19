---
title: "Clock, HTTP, Process, Env, and Settings"
description: "The five $ nouns that reach the machine - time and timers, web requests, commands, environment variables, and merged settings."
url: https://xsyetopz.github.io/claude-code-docs/extend/mod-api/clock-http-process-env-settings
source: docs/extend/mod-api/clock-http-process-env-settings.md
---

# Clock, HTTP, Process, Env, and Settings


These five nouns reach the machine: `$.clock` for time and timers, `$.http` for web requests, `$.process` for commands, `$.env` for environment variables, and `$.settings` for the merged settings.
`$.process` works in the CLI only.
`$.settings` is read only.

A policy can refuse a call. For example, the organization's web-fetch policy can refuse `$.http.fetch`.

Official pages: [Use the Mods API](https://code.claude.com/docs/en/plugins/mods/api), [Mods Reference](https://code.claude.com/docs/en/plugins/mods/reference). Source: the program (`types-2.1.304.d.ts`).
In a "Where it can be used" cell, "Run time" means in a hook, in a closure that a hook drew, or in a timer callback. It does not mean inside `register`.

## Example

```javascript
on('session.start', async ($, e, next) => {
  const { exitCode, stdout } = await $.process.run(['git', 'status', '--short'])
  if (exitCode === 0) $.ui.log(stdout)
  $.clock.every(1000, () => $.ui.status('polling'))
  return next(e)
})
```

## Members

| Item | Status | What it does | How it works | Where it can be used |
| --- | --- | --- | --- | --- |
| `$.clock.now` | [Documented] | Resolves the milliseconds since the epoch, now. | `() => Promise<number>`. | Run time. |
| `$.clock.sleep` | [Documented] | Resolves after `ms` milliseconds. Rejects at once when `signal` aborts. | `(ms, options?) => Promise<void>`. The hook's budget runs on during the wait. Pass `signal: next.signal` to end the wait with the dispatch. | Run time. |
| `$.clock.after` | [Documented] | Calls `fn` once after `ms` milliseconds. `cancel()` before then stops it. | `(ms, fn) => Timer`. `fn` runs when the `clock.after` dispatch resolves, and never when a hook refuses it. | Run time. |
| `$.clock.every` | [Documented] | Calls `fn` every `ms` milliseconds (at least 1) until `cancel()`. | `(ms, fn) => Timer`. Runs `fn` once for each period. A refused period ends the interval. | Run time. |
| `$.http.fetch` | [Documented] | Fetches `url` through the host, never the plugin's own network. Resolves `{ status, ok, headers, text }` once the body is read. | `(url, init?) => Promise<HttpResponse>`. Fetches an http or https URL. The organization's web-fetch policy can refuse it. `init.auth` takes a handle from [`$.session.authorize()`](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/session.md) and is used only on https to `api.anthropic.com`. | Run time. |
| `$.process.run` | [Documented] | Runs a command on the host by its argument list (no shell). Resolves `{ exitCode, stdout, stderr }` once it exits, with any exit code. | `(argv, init?) => Promise<ProcessRunResult>`. Timeout 30 seconds by default, 10 minutes at most. Output is cut at 4,194,304 bytes. | CLI only. |
| `$.process.spawn` | [Documented] | Starts a command on the host by its argument list (no shell) and streams what it writes, then how it ended. | `(request) => HookStream`. Leaving the loop, `next.signal`, or an unload kills the child. | CLI only. |
| `$.env.get` | [Documented] | Resolves the value of a variable, or `undefined` when unset. | `(name) => Promise<string \| undefined>`. `name` must be a string literal. `claude plugin validate` lists the names your module reads. | The name must be a literal in the module source. |
| `$.env.set` | [Documented] | Sets the variable for this process and everything it starts later, or unsets it when `value` is `undefined`. | `(name, value) => Promise<EnvSetResult>`. `name` must be a string literal. Resolves `{}` or `{ deny }`. | The name must be a literal in the module source. |
| `$.settings.read` | [Documented] | Resolves the settings merged over every source, or one source's settings as loaded (`{ source }`). | `(args?) => Promise<Settings>`. Returns a snapshot of plain data. The merge takes a key from the last source that has it. A `settings.read` hook gets each settings layer (`layers`) and rewrites the merged settings (new in 2.1.304). | Run time. |

## Events Raised by These Calls

For each call, a hook above the caller returns `next(e)`, `{ deny: reason }`, or `{ value }`.

| Item | Status | The argument | Input and value |
| --- | --- | --- | --- |
| `clock.now` | [Documented] | `$.clock.now()` | Input `NoArgs`. Value `number`. |
| `clock.sleep` | [Documented] | `$.clock.sleep(ms, { signal })`. The signal does not cross. It aborts the dispatch. | Input `ClockWait`. Value `void`. |
| `clock.after` | [Documented] | `$.clock.after(ms, fn)`. `fn` stays in the plugin's environment. | Input `ClockWait`. Value `void`. |
| `clock.every` | [Documented] | `$.clock.every(ms, fn)`. Dispatched once for each period. | Input `ClockWait`. Value `void`. |
| `http.fetch` | [Documented] | `$.http.fetch(url, init)` | Input `{ url: string, init?: HttpInit }`. Value `HttpResponse`. |
| `process.run` | [Documented] | `$.process.run(argv, init)` | Input `{ argv: readonly string[], init?: ProcessRunInit }`. Value `ProcessRunResult`. |
| `process.spawn` | [Documented] | `$.process.spawn(request)`. It streams. `{ deny }` kills a running child. | Input `ProcessSpawnRequest`. Value `ProcessSpawnResult`. |
| `settings.read` | [Documented] | `$.settings.read({ source })` | Input `SettingsReadArgs`. Value `Settings`. Since 2.1.304 the hook also gets each settings layer (`layers`) and rewrites the merged settings. A managed mod can use this to make an organization's setting a ceiling, including `cleanupPeriodDays`, which the retention sweep uses. The program reads each layer's `settings`; no other shape is documented. |
| `env.get` | [Documented] | `$.env.get(name)`. `name` is pinned. | Input `{ name: string }`. Value `string \| undefined`. |
| `env.set` | [Documented] | `$.env.set(name, value)`. `name` is pinned. No `value` unsets. | Input `{ name: string, value?: string }`. Value `EnvSetResult`. |

## Related Pages

- [Mod API Overview](https://xsyetopz.github.io/claude-code-docs/extend/mod-api.md)
- [Files, Store, and State](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/fs-store-state.md)
- [Files, State, Clock, HTTP, Process, and Settings Types](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/types/infra.md) (shapes of `HttpInit`, `ProcessRunInit`, `Settings`, and more)
