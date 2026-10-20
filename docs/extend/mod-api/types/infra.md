---
title: Files, State, Clock, HTTP, Process, and Settings Types
description: "Types behind $.fs, $.store, $.state, $.clock, $.http, $.process, $.env, and $.settings."
sidebar_position: 5
---

These are the types behind `$.fs`, `$.store`, `$.state`, `$.clock`, `$.http`, `$.process`, `$.env`, and `$.settings`.
They describe files, stored values, timers, web requests, child processes, and settings.

## Example

This call runs a child process and reads its exit code and output. The types below describe the input and the result.

```ts
const { exitCode, stdout } = await $.process.run(["git", "status"]);
```

## Types without Fields

These types are aliases, unions, or plain shapes. Each row gives its use and its shape.

| Type | Status | What it is for | Shape and limits |
| --- | --- | --- | --- |
| `AtomFunction` | <Documented /> | `atom(ref, initial)`: a named value with its initial, so a read is never `undefined`, given `{ shape }`, for a key declared `Shaped<T>`. | Alias of the call form of `atom`. Pure: it builds a frozen description and calls nothing. Example: `atom({ plugin: "counter", key: "count" } as const, 0)`. |
| `DeriveFunction` | <Documented /> | `derive(sources, fn)`: a value computed from atoms and references, cached by their versions: `read` runs `fn` again only when one moved. | Alias of `(sources, compute) => Derived<T>`. Pure: it builds a description. Reading it while drawing subscribes the drawing to every source. |
| `FsReadAs` | <Documented /> | How `$.fs.read` answers: `text` (UTF-8, the default) or `bytes` (base64). | Alias of `'text' \| 'bytes'`. Used by `fs.read`. |
| `FsReadCall` | <Documented /> | `$.fs.read`: the file's text, or with `{ as: "bytes" }` its bytes as `{ base64 }`. | Alias of `{ (path: string): Promise<string>, (path: string, options: FsReadBytesOptions): Promise<FsBytes>, (path: string, options: FsReadOptions): Promise<string \| FsBytes>, }`. Used by `$.fs.read`. |
| `MemberOfFunction` | <Documented /> | `memberOf(family, e)`: the member of a family for the instance being drawn, keyed by `e.requestId`, of an atom over a family, that member's. | Alias of the call forms of `memberOf`. It picks one member of a state family for a render instance. Example: `read($, memberOf(isOpen, e))`. |
| `ReadFunction` | <Documented /> | `read($, source)`: the value of an atom (its initial while absent), of a derived value, or under a plain reference, one `$.state.get` per value. | Alias of the call forms of `read`. Made while a `ui.render` hook draws, it subscribes the drawing. Example: `const n = await read($, count)`. |
| `Settings` | <Documented /> | What `$.settings.read` answers: an object keyed as a settings.json is (`permissions`, `env`, `hooks`, `model`, `enabledPlugins`, ...). | Alias of `Readonly<Record<string, unknown>>`. Each key is as the settings docs describe it. A snapshot in plain data: a write to it changes nothing. Since 2.1.304 a `settings.read` hook gets each settings layer (`layers`, each with `settings`) and rewrites this merged value, so a managed mod can make an organization's setting a ceiling, including `cleanupPeriodDays`. Used by `$.settings.read`, `settings.read`. |
| `SettingsSource` | <Documented /> | One source of settings by the name a plugin gives it, lowest precedence first, the engine's own name is the same word with `Settings` appended. | Alias of `'user' \| 'project' \| 'local' \| 'flag' \| 'policy'`. They match `~/.claude/settings.json`, `.claude/settings.json`, `.claude/settings.local.json`, `--settings`, and managed settings. |
| `StateDollar` | <Documented /> | What the state library's `read` and `update` take of `$`: its `state` noun, on which they make the calls a hook would make itself. | Alias of `Pick<CoreEngineInterface, 'state'>`. |
| `StateGetEvent` | <Documented /> | `e` of `state.get`: one variant per value a contract declares, so a matcher on `plugin` and `key` narrows it, the untyped address while none does. | Alias of `[DeclaredPair] extends [never] ? StateAddress : DeclaredEvents<DeclaredPair>['get']`. Example: `on("state.get", { plugin: "swarm" }, ($, e, next) => next(e))`. Used by `state.get`. |
| `StateRef` | <Documented /> | A typed reference to one named value: the owning plugin and the key, both literals, and for a StateFamily key the member's `id`. | Alias of the reference to a state value: `plugin` and `key`, plus `id` for a family. Write it once as a constant, with `plugin` and `key` as literals in the source. |
| `StateSetEvent` | <Documented /> | `e` of `state.set`: one variant per value a contract declares, so a matcher on `plugin` and `key` narrows `e.value`, the untyped write while none does. | Alias of the `state.set` event type. `plugin`, `key`, and `id` are pinned. A hook may rewrite `value`. Example: `next({ ...e, value: false })`. Used by `state.set`. |
| `StateValue` | <Documented /> | The type of the value under key `K` of plugin `P`, as its contract declares it in PluginState, a StateFamily's member type for a family key. | Alias of `PluginState[P][K] extends StateFamily<infer Member> ? Member : PluginState[P][K]`. Used by `$.state.get`, `$.state.set`. |
| `TimerCall` | <Documented /> | A timer on `$.clock` (`after`, `every`): `fn` runs after `ms` milliseconds, once or until `cancel()`. | Alias of `(ms: number, fn: () => void) => Timer`. Used by `$.clock.after`, `$.clock.every`. |
| `UpdateFunction` | <Documented /> | `update($, target, fn)`: reads the value, applies `fn` here in the plugin's environment, writes with `ifVersion`, and tries again on a miss. | Alias of the call forms of `update`. A handler uses it instead of `$.state.set(ref, stale + 1)`. Two presses before a redraw both land. |
| `atom` | <Documented /> | A named value with its initial: `read` answers the initial while nothing is written, so never `undefined`. Pure, runs in the plugin's environment. | Alias of `export const atom: AtomFunction`. |
| `derive` | <Documented /> | A value computed from atoms and references, cached by their versions. | Alias of `export const derive: DeriveFunction`. Example: `const busy = derive([workers], list => list.filter(w => w.isBusy).length)`. |
| `memberOf` | <Documented /> | A family's member for the instance being drawn, keyed by `e.requestId`. | Alias of `export const memberOf: MemberOfFunction`. Example: `const open = await read($, memberOf(isOpen, e))`. |
| `read` | <Documented /> | Reads an atom, a derived value or a reference through `$.state.get`, while a `ui.render` hook draws, that subscribes the drawing. | Alias of `export const read: ReadFunction`. Example: `const n = await read($, count)`. |
| `update` | <Documented /> | Reads, applies `fn` in the plugin's environment, writes with `ifVersion`, and tries again on a miss: what a handler closure calls. | The `update` function, typed as `UpdateFunction`. Reads the current value, writes `change(value)`, and resolves what it wrote. Example: `update($, count, n => n + 1)`. |

## Types with Fields

Each type below has its own table of fields.

### `Atom`

A named value with its initial, as `atom(ref, initial)` makes it: read, it is never `undefined`, while nothing is written it reads as the initial. Object with fields `ref`, `initial`, `shape?`. Plain frozen data, the plugin's own: pass it to `read`, `update`, `derive` and `memberOf`. The engine knows nothing of it.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `ref` | <Documented /> | Not described in the type file. | Type: `StateAddress`. Read-only. |
| `initial` | <Documented /> | Not described in the type file. | Type: `T`. Read-only. |
| `shape` | <Documented /> | The tag the value is kept under, when the atom was given one: a stored value under another tag reads as absent (Shaped). | Type: `string`. Optional. Read-only. |

### `AtomOptions`

The options of `atom`: `shape`, a tag the value is kept under, so a reload of the plugin's code that names another tag finds the value absent. Object with fields `shape`. Bump it when the code's idea of the value changed, the engine keeps whole what the old code wrote, and the tag is how the new code declines it.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `shape` | <Documented /> | Not described in the type file. | Type: `string`. |

### `ClockWait`

The argument of the `$.clock` waits (`sleep`, `after`, `every`): how long, in milliseconds, before the dispatch resolves. Object with fields `ms`. Used by `clock.sleep`, `clock.after`, `clock.every`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `ms` | <Documented /> | The wait, a non-negative number of milliseconds. | Type: `number`. |

### `Derived`

A value computed from other values, as `derive(sources, fn)` makes it: `read` runs `fn` again only when a source's version moved. Object with fields `sources`, `compute`. It holds nothing on the host: the cache is the plugin's own, lost with a reload of its code, and rebuilt by the next read.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `sources` | <Documented /> | The atoms and references it is computed from, read in this order. | Type: `readonly (Atom<unknown> \| StateAddress)[]`. Read-only. |
| `compute` | <Documented /> | The function over the sources' values, in the order they were given. | Type: `(...values: never[]) => T`. Read-only. |

### `EnvSetResult`

What `$.env.set` resolves to and what an `env.set` hook's `{ value }` holds: `{}` once the variable is set or unset, or why it was not. Object with fields `deny?`. Used by `$.env.set`, `env.set`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `deny` | <Documented /> | Absent when the write was made, else why not, in one line. | Type: `string`. Optional. In a session that takes settings from its organization, the engine holds a write by a plugin that is not built in. A hook's own `{ deny }` rejects the caller. |

### `FsAncestor`

One file `$.fs.ancestors` found: the directory it stands in, the name it was asked for by, and its text as the engine's memory loader reads it. Object with fields `dir`, `name`, `content`, `parts`. Used by `$.fs.ancestors`, `fs.ancestors`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `dir` | <Documented /> | The directory the file stands in, absolute. | Type: `string`. |
| `name` | <Documented /> | The spelling the caller asked for it by. | Type: `string`. |
| `content` | <Documented /> | The file's text, with what its `@include`s bring after it. | Type: `string`. |
| `parts` | <Documented /> | The file and then each file its `@` imports brought, in load order, path and text apiece, `content` is these texts joined. | Type: `readonly FsAncestorPart[]`. |

### `FsAncestorPart`

One file of an ancestor entry: the file itself or one it imported. Object with fields `path`, `content`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `path` | <Documented /> | The file's path, absolute. | Type: `string`. |
| `content` | <Documented /> | Its text as the engine's memory loader reads it. | Type: `string`. |

### `FsAncestorsRequest`

The argument of `$.fs.ancestors`: the file names to look for in each directory, the file to walk down to, and the directory to walk beneath. Object with the fields `names`, `of?`, `below?`. Where a rule limits the session's reads, a file is found only where every name on its path may be read. Used by `$.fs.ancestors`, `fs.ancestors`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `names` | <Documented /> | Relative `.md` file names, each looked for in every directory. | Type: `readonly string[]`. |
| `of` | <Documented /> | The file the walk goes on down to the directory of, relative to the working directory or absolute, absent, it ends at the working directory. | Type: `string`. Optional. The file to walk down to. Without `below`, a plain name or one under `.claude` is judged as the start-up load is. With no file bound the call rejects. |
| `below` | <Documented /> | The directory the walk starts beneath, relative to the working directory or absolute, absent, the walk starts at the filesystem root. | Type: `string`. Optional. The directory the walk stays inside. Only directories strictly inside it are read. |

### `FsBytes`

What `$.fs.read(path, { as: "bytes" })` resolves with: the file's bytes, base64, since only plain data crosses into a plugin's environment. Object with fields `base64`. Used by `fs.read`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `base64` | <Documented /> | The file's content, standard padded base64, `Uint8Array.fromBase64(base64)` gives the bytes back. | Type: `string`. |

### `FsEntry`

One entry of `$.fs.list`: the entry itself, a link not followed. Object with fields `name`, `kind`, `size`, `mtimeMs`, `isLink`. Used by `$.fs.list`, `fs.list`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | <Documented /> | The entry's name (no directory part). | Type: `string`. |
| `kind` | <Documented /> | `file`, `dir`, or `other`, of the entry itself: a symbolic link is `other` (`$.fs.stat` says what it leads to, and with `resolve` where). | Type: `'file' \| 'dir' \| 'other'`. |
| `size` | <Documented /> | Bytes, for a file. | Type: `number`. |
| `mtimeMs` | <Documented /> | Last modification, milliseconds since the epoch, for a file, as `$.fs.stat` spells it, 0 for a directory, a link or any other kind. | Type: `number`. A listing reads the size and time of regular files only. `$.fs.stat` answers for a directory. |
| `isLink` | <Documented /> | True when the entry is a symbolic link. | Type: `boolean`. |

### `FsReadBytesOptions`

The options of `$.fs.read` that ask for the bytes: the call answers `{ base64 }`. Object with fields `as`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `as` | <Documented /> | `bytes`. | Type: `'bytes'`. |

### `FsReadOptions`

The options of `$.fs.read`. Object with fields `as`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `as` | <Documented /> | `bytes` answers `{ base64 }` for a binary file, `text` (the default) the file's text. | Type: `FsReadAs`. |

### `FsStat`

What `$.fs.stat` resolves with: what the path leads to, whether the path itself is a symbolic link, and where it lands when asked. Object with fields `kind`, `size`, `mtimeMs`, `isLink`, `realPath?`. Used by `$.fs.stat`, `fs.stat`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | <Documented /> | `file`, `dir`, or `other`, of what the path leads to: a link is followed, and one that leads nowhere is `other`. | Type: `'file' \| 'dir' \| 'other'`. |
| `size` | <Documented /> | Bytes, for a file. | Type: `number`. |
| `mtimeMs` | <Documented /> | Last modification, milliseconds since the epoch. | Type: `number`. |
| `isLink` | <Documented /> | True when the path itself is a symbolic link, `kind`, `size` and `mtimeMs` then describe what it points at, or the link when that is gone. | Type: `boolean`. |
| `realPath` | <Documented /> | Where the path landed when asked with `{ resolve: true }`: absolute, every symbolic link followed, `.` and `..` folded, else absent. | Type: `string`. Optional. Absent when the path leads nowhere or a hook withheld it. A deny-list on spellings is best effort. An allow-list on `realPath` is the robust guard. |

### `FsStatOptions`

The options of `$.fs.stat`. Object with fields `resolve`. Used by `$.fs.stat`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `resolve` | <Documented /> | True to resolve where the path lands as well. | Type: `boolean`. The answer then carries `realPath` when the path leads somewhere, at the cost of one more file system call: where it landed then, not a hold on what a tool opens afterwards. |

### `HttpInit`

Options of `$.http.fetch`. Object with fields `method?`, `headers?`, `body?`, `auth?`, `socketPath?`. Used by `$.http.fetch`, `http.fetch`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `method` | <Documented /> | `GET` (default), `POST`, ... | Type: `string`. Optional. |
| `headers` | <Documented /> | Request headers. | Type: `Record<string, string>`. Optional. |
| `body` | <Documented /> | The request body, as text. | Type: `string`. Optional. |
| `auth` | <Documented /> | The handle `$.session.authorize()` answered: the engine sets the session's credential header itself, only for a first-party host. | Type: `string`. Optional. It rides https only. While `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` is set, a request that carries it is refused, whichever plugin asks. |
| `socketPath` | <Documented /> | The absolute path of a Unix domain socket the request goes over instead of TCP (near 100 B at most): one per session, in a private directory. | Type: `string`. Optional. A Unix socket to use instead of TCP. The URL still gives the path, query, and Host. No proxy. No relative path. |

### `HttpResponse`

What `$.http.fetch` resolves with. Object with fields `status`, `ok`, `headers`, `text`. Used by `$.http.fetch`, `http.fetch`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `status` | <Documented /> | The HTTP status code. | Type: `number`. |
| `ok` | <Documented /> | True for a 2xx status. | Type: `boolean`. |
| `headers` | <Documented /> | Response headers, lower-cased names. | Type: `Record<string, string>`. |
| `text` | <Documented /> | The body, as text. | Type: `string`. |

### `JsonValue`

Plain data: what JSON holds, and what crosses between a plugin's hooks module and its surface module whole (a `Client`'s props, a post's data). Union. Fields: `[key: string]`. A function, a class instance, `undefined` or a cycle is not plain data, the engine refuses one where it checks, and drops it where it clones.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `[key: string]` | <Documented /> | Not described in the type file. | Type: `JsonValue`. |

### `ProcessRunInit`

Options of `$.process.run`. Object with fields `cwd?`, `env?`, `stdin?`, `timeoutMs?`. Used by `$.process.run`, `process.run`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `cwd` | <Documented /> | The child's working directory, relative to the session's or absolute, absent, the session's working directory. | Type: `string`. Optional. |
| `env` | <Documented /> | Variables set over the host process's own environment. | Type: `Record<string, string>`. Optional. |
| `stdin` | <Documented /> | Text written to the child's standard input, then closed. | Type: `string`. Optional. |
| `timeoutMs` | <Documented /> | How long the child may run before it is killed and the call rejects, in milliseconds, 30 seconds when absent, ten minutes at most. | Type: `number`. Optional. |

### `ProcessRunResult`

What `$.process.run` resolves with once the child has exited. Object with fields `exitCode`, `stdout`, `stderr`, `isStdoutTruncated`, `isStderrTruncated`. Example: `const { stdout } = await $.process.run(["git", "log"])`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `exitCode` | <Documented /> | The child's exit status, a child ended by a signal reads as 1. | Type: `number`. |
| `stdout` | <Documented /> | What the child wrote to standard output, as text: its first 4194304 bytes (4 MiB), the rest read and dropped (`isStdoutTruncated`). | Type: `string`. The limit counts bytes, not characters, and is standard output's own: standard error has the same limit again. A cut inside a multi-byte character drops that character. |
| `stderr` | <Documented /> | What the child wrote to standard error, as text: its first 4194304 bytes (4 MiB), the rest read and dropped (`isStderrTruncated`). | Type: `string`. |
| `isStdoutTruncated` | <Documented /> | True when the child wrote more than 4194304 bytes to standard output and `stdout` is only the first of them, false when `stdout` is whole. | Type: `boolean`. |
| `isStderrTruncated` | <Documented /> | True when the child wrote more than 4194304 bytes to standard error and `stderr` is only the first of them, false when `stderr` is whole. | Type: `boolean`. |

### `ProcessSpawnChunk`

One piece of a spawned child's output as `$.process.spawn` streams it: which pipe it came from, and the text. Object with the fields `stream`, `text`. The text is UTF-8 decoded as it arrived. A line may span two pieces. A multi-byte character is never split. Used by `$.process.spawn`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `stream` | <Documented /> | The pipe the text came from. | Type: `'stdout' \| 'stderr'`. |
| `text` | <Documented /> | What the child wrote, decoded, never empty, and never cut. | Type: `string`. Nothing of the stream is dropped: once 1048576 characters wait unread, the child blocks on its next write until the loop pulls. |

### `ProcessSpawnRequest`

The argument of `$.process.spawn(request)`, and the `e` its hooks see: the command by its argument vector and how the child is started. Object with fields `argv`, `cwd?`, `env?`, `input?`. It follows the rules of `$.process.run`: no shell, the session's working directory by default, and the host's environment with `env` over it.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `argv` | <Documented /> | The command and its arguments, `argv[0]` the executable. | Type: `readonly string[]`. |
| `cwd` | <Documented /> | The child's working directory, relative to the session's or absolute, absent, the session's working directory. | Type: `string`. Optional. |
| `env` | <Documented /> | Variables set over the host process's own environment. | Type: `Record<string, string>`. Optional. |
| `input` | <Documented /> | Text written to the child's standard input, which is then closed, absent, standard input is closed from the start. | Type: `string`. Optional. A string today, a later form may take the text in pieces. |

### `ProcessSpawnResult`

How a spawned child ended, as the stream of `$.process.spawn` returns it once every piece has been read: its exit code, or the signal that did it. Object with fields `code`, `signal`. Used by `$.process.spawn`, `process.spawn`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `code` | <Documented /> | The child's exit status, null when a signal ended it. | Type: `number \| null`. |
| `signal` | <Documented /> | What ended the child from outside (`SIGTERM`), null when it exited on its own. On Windows a killed child reads as an exit code, this null. | Type: `string \| null`. |

### `SettingsReadArgs`

What `$.settings.read(args)` takes. Object with fields `source?`. Used by `$.settings.read`, `settings.read`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `source` | <Documented /> | The one source read, as loaded, absent, the settings merged over every source, as the engine runs under them. | Type: `SettingsSource`. Optional. |

### `SleepOptions`

Options of `$.clock.sleep`. Object with fields `signal?`. Used by `$.clock.sleep`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `signal` | <Documented /> | Aborting it rejects the sleep at once. | Type: `AbortSignal`. Optional. |

### `StateAddress`

Which named value a `$.state` call is about, as it crosses to the host: the owning plugin, the key, and a family member's `id`. Object with fields `plugin`, `key`, `id?`. The untyped form of a StateRef, identity, pinned on every `next`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `plugin` | <Documented /> | Not described in the type file. | Type: `string`. |
| `key` | <Documented /> | Not described in the type file. | Type: `string`. |
| `id` | <Documented /> | Not described in the type file. | Type: `string`. Optional. |

### `StateFamily`

A key of PluginState that holds one value of type `T` per `id` (one per drawn row, per worker): its reference must carry `id: string`. Object with the field `byId`. Only a marker in the registry. `$.state.get` on a member answers `T`. Example: `interface PluginState { notes: { isOpen: StateFamily<boolean> } }`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `byId` | <Documented /> | Not described in the type file. | Type: `T`. Read-only. |

### `StateName`

Which named value: the plugin that owns it and its key there, both literals where a contract declares the value. Generic alias of `{ readonly plugin: P, readonly key: K, }`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `plugin` | <Documented /> | Not described in the type file. | Type: `P`. Read-only. |
| `key` | <Documented /> | Not described in the type file. | Type: `K`. Read-only. |

### `StateRead`

What `$.state.get` answers: the value and the version it stands at, a value never written is `undefined` at version 0. Generic alias of `{ value: T \| undefined, version: number, }`. The version goes up by one on every write that lands, hand it back as `ifVersion` to write only if nobody wrote in between. Used by `$.state.get`, `state.get`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `value` | <Documented /> | Not described in the type file. | Type: `T \| undefined`. |
| `version` | <Documented /> | Not described in the type file. | Type: `number`. |

### `StateSetOptions`

The options of `$.state.set`: `ifVersion` makes the write conditional on the value still standing at that version (compare-and-set). Object with fields `ifVersion?`. Used by `$.state.set`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `ifVersion` | <Documented /> | Not described in the type file. | Type: `number`. Optional. |

### `StateSetResult`

What `$.state.set` answers: whether the write landed, and the version the value stands at now (a landed write's own, a missed one's the current). Object with fields `isSet` and `version`. `isSet` is false only for a write given `ifVersion` that another write beat. Nothing changes then, and `$.state.get` reads what stands.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `isSet` | <Documented /> | Not described in the type file. | Type: `true`. |
| `version` | <Documented /> | Not described in the type file. | Type: `number`. |
| `isSet` | <Documented /> | Not described in the type file. | Type: `false`. |
| `version` | <Documented /> | Not described in the type file. | Type: `number`. |

### `StateWrite`

A `$.state.set` as it crosses to the host and as its hooks see it when no contract declares the value: the address, the value, and the condition. Combines `StateAddress`. Object with the fields `value`, `previous?`, `ifVersion?`. `previous` is what stood there when the write was raised.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `value` | <Documented /> | Not described in the type file. | Type: `unknown`. |
| `previous` | <Documented /> | Not described in the type file. | Type: `unknown`. Optional. |
| `ifVersion` | <Documented /> | Not described in the type file. | Type: `number`. Optional. |

### `Timer`

A pending timer from `$.clock.after` / `$.clock.every`. Object with fields `cancel`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `cancel` | <Documented /> | Stops it, a stopped timer never fires again. | Type: `() => void`. |

## Related Pages

- [Mod API Overview](../index.md)
- [Files, Store, and State](../fs-store-state.md)
- [Clock, HTTP, Process, Env, and Settings](../clock-http-process-env-settings.md)
- [Mod API Types](index.md)
