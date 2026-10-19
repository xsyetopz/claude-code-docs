---
title: "Session"
description: "The $.session noun that reads the running session, compacts it, and sends messages, plus the session events."
url: https://xsyetopz.github.io/claude-code-docs/extend/mod-api/session
source: docs/extend/mod-api/session.md
---

# Session


`$.session` lets a mod read the running session as plain data, compact it, and send messages to other agents or sessions.
Its events tell a mod when a session starts, ends, compacts, or gets a message.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | ✅ Yes. `await $.session.cwd()`, `await $.session.messages()`, and more. |
| Can you change it? | ✅ Yes. Hook the events to rewrite a stored row, veto a compact, or consume a message. |
| Can you turn it on or off? | Return `{ skip }`, `{ consumed }`, or `{ deny }` from a hook to stop an action. |
| Where does it live? | The hooks module. |
| Status | [Documented] |

Official pages: [Use the Mods API](https://code.claude.com/docs/en/plugins/mods/api), [Mods Reference](https://code.claude.com/docs/en/plugins/mods/reference). Source: the program (`types-2.1.303.d.ts`).
In a "Where it can be used" cell, "Run time" means in a hook, in a closure that a hook drew, or in a timer callback. It does not mean inside `register`.

## Example

This hook shows a toast when a session starts.

```javascript
on('session.start', async ($, e, next) => {
  $.ui.toast('Session started')
  return next(e)
})
```

## Members

| Item | Status | What it does | How it works | Where it can be used |
| --- | --- | --- | --- | --- |
| `$.session.messages` | [Documented] | Returns the transcript so far, one `SessionMessage` for each user or assistant message. Progress rows, `$.ui.log` lines, and notices are not messages. | Five call forms. No argument gives the main conversation. `{ agentId }` gives an agent's messages. `{ as: "api" }` gives raw API messages. At most 4096 entries. | Run time. |
| `$.session.cwd` | [Documented] | Returns the directory the session runs in, absolute. | `() => Promise<string>`. A timer that outlives its hook reads the session's directory. Keep the value you read inside the hook if you need the hook's own (a subagent's). | Run time. |
| `$.session.root` | [Documented] | Returns the project root of the session, absolute: where it started, or where `/cd`, a host's directory change, or a worktree move took it. | `() => Promise<string>`. A shell `cd` does not move it. Nested instruction files are read only beneath it. | Run time. |
| `$.session.model` | [Documented] | Returns the main loop's model, as `/model` shows it. | `() => Promise<string>`. | Run time. |
| `$.session.turns` | [Documented] | Returns how many prompts the user has sent this session. | `() => Promise<number>`. | Run time. |
| `$.session.id` | [Documented] | Returns the session id (the transcript file's name). | `() => Promise<string>`. | Run time. |
| `$.session.repo` | [Documented] | Returns the git repository the session runs in, read from the working copy on each call. `null` when the directory is not in one. | `() => Promise<SessionRepo \| null>`. | Run time. |
| `$.session.surfaces` | [Documented] | Returns every surface the session draws on, each once: `terminal` first, then remote ones in the order they attached. | `() => Promise<readonly RenderSurface[]>`. Never rejects. Empty in a plain `-p` run. | Run time. |
| ⛔ `$.session.surface` | [Documented] | Returns the first of `$.session.surfaces()`, or `null` where nothing draws. | `() => Promise<RenderSurface \| null>`. Deprecated. Use `surfaces()`, because a session may draw on several surfaces. | Run time. |
| `$.session.usage` | [Documented] | Returns when the session began, the context window fill, the rate-limit windows, and the cost, as the status line has them. | `(args?) => Promise<SessionUsage>`. A plain call costs nothing. `breakdown: "full"` uses the token-count API. `"summary"` estimates locally. | Run time. |
| `$.session.version` | [Documented] | Returns the version of the engine, the release it is built from, and when it was built. | `() => Promise<SessionVersion>`: `version`, `base` (absent unless the version is a release), `builtAt`. Works in every mode. | Run time. |
| `$.session.compact` | [Documented] | Compacts the conversation. It is the event `session.compact` with `trigger` `plugin`, the same call `/compact` makes. | `(input?) => Promise<SessionCompactResult>`. Runs the hooks, then core. Resolves `{ skip }` if a hook vetoed it. Rejects while a turn runs. | Between turns. |
| `$.session.send` | [Documented] | Sends a plain-text message to another agent or session. It is the event `session.send`, the same delivery as the model's SendMessage tool. | `(input) => Promise<SessionSendResult>`. `to` is a name, an agent id, `{ sessionId }`, or `{ agentId }`. Resolves once queued. | Run time. |
| `$.session.append` | [Documented] | Appends a row to a conversation of the session. It is the event `session.append`, the engine's own call for every row it keeps. | `(args) => Promise<SessionAppendResult>`. Adds a user-role row of text blocks. Resolves `{ deny: reason }` if a plugin above refused it. | Run time. |
| `$.session.identity` | [Documented] | Returns how the session is signed in, to a mod that the organization's managed settings install. Any other mod gets `{ deny }`. No request is made. | `() => Promise<SessionIdentity>`. Full account data only where managed `forceLoginOrgUUID` lists the organization. Otherwise only `kind`. | Mods that managed settings install. |
| `$.session.authorize` | [Documented] | Holds the session's Anthropic credential on the host and returns an opaque handle with its kind, for example `{ handle: "auth_00000000000000000000000000000000", kind: "bearer" }`. The secret never reaches the mod. Returns `null` when the session has no first-party credential (a third-party provider, a cloud gateway, no login or key). | `() => Promise<SessionAuthorization>`. Spend the handle with `$.http.fetch(url, { auth: handle })`. The engine sets the credential header, and only for a first-party host. A handle belongs to the mod that minted it, and a mod keeps at most 4 live handles (a fifth evicts the oldest). An unknown or foreign handle makes `$.http.fetch` throw. `kind` is `bearer` or `api-key`. No managed-settings gate, unlike `$.session.identity`. | Run time. |

## Engine Events

| Item | Status | What it does | How it works | Where it can be used |
| --- | --- | --- | --- | --- |
| `session.start` | [Documented] | Fires once for each loaded plugin per process, before the first prompt, then once for each fresh load of a plugin (never on `/clear`). `next(e)` is `{ cwd }`. | Input `SessionStartInput`. Result `SessionStartResult`. The first run is awaited, so a `$.tool.register` in it is listed by turn one. | `on('session.start', ...)`. In tests: `$.session.start(...)` on the test engine (not on a hook's `$`). |
| `session.receive` | [Documented] | Fires when a delivery reaches the session, before it is queued: a relay's event, a peer's message, a Remote Control prompt, room events. | Input `SessionReceiveInput`. Result `{ text }` or `{ consumed }`. Return `{ consumed: reason }` to stop the message from reaching the model. | `on('session.receive', ...)`. In tests: `$.session.receive(...)` on the test engine (not on a hook's `$`). |
| `session.append` | [Documented] | Fires once for each row a conversation of this session keeps (a prompt, a response block, a tool result, a notice), before it is stored. | Input `SessionAppendInput`. Result `{ message, uuid }`. `next({ ...e, message })` rewrites `content` before it is stored. | `on('session.append', ...)`. Also `$.session.append(...)`. |
| `session.send` | [Documented] | Fires when a plain-text message is about to leave this conversation for another agent or session. | Input `SessionSendInput`. Result `{ isDelivered }`. Rewrite `text` or `to` with `next`. Return `{ isDelivered: false, reason }` to refuse. | `on('session.send', ...)`. Also `$.session.send(...)`. |
| `session.compact` | [Documented] | Fires when the conversation is about to compact (`/compact`, the threshold, a plugin, or ahead of time). `next(e)` resolves `{ messages }`. | Input `SessionCompactInput`. Result `{ messages }` or `{ skip }`. `{ skip: reason }` leaves the conversation as it is. | `on('session.compact', ...)`. Also `$.session.compact(...)`. |
| `session.attach` | [Documented] | Fires when a remote client joins the roster of attached surfaces. | Input `SessionAttachInput`. Result `{ clientId }`. A hook observes a client that joins. `$.session.surfaces()` reads the roster. | `on('session.attach', ...)`. |
| `session.detach` | [Documented] | Fires when a client leaves the roster: it detached, or the session ended with it attached (`e.reason`). | Input `SessionDetachInput`. Result `{ clientId }`. With reason `end` it runs inside the short bound of `session.end`. | `on('session.detach', ...)`. |
| `session.measure` | [Documented] | Fires when the engine measures the session and a unit moved: after each main-thread turn, and when a rate-limit window moves a whole point. | Input `SessionMeasureInput`. Result `{ changed }`. It pushes the figures of `$.session.usage()`. Calls arrive one at a time. | `on('session.measure', ...)`. |
| `session.end` | [Documented] | Fires once when the session ends (exit, `/clear`, resume, logout, signal, a finished `-p` run), after its `SessionEnd` settings hooks. `e.reason` says which. | Input `SessionEndInput`. Result `{ sessionId }`. The whole chain shares one short time bound that `next.budget` reads. | `on('session.end', ...)`. |

## Events Raised by Session Calls

For each call, a hook above the caller returns `next(e)`, `{ deny: reason }`, or `{ value }`.

| Item | Status | The argument | Input and value |
| --- | --- | --- | --- |
| `session.cwd`, `session.root`, `session.model`, `session.id` | [Documented] | The matching `$.session` call. | Input `NoArgs`. Value `string`. |
| `session.turns` | [Documented] | `$.session.turns()` | Input `NoArgs`. Value `number`. |
| `session.messages` | [Documented] | `$.session.messages(args)`: `{}` for the main conversation, `{ agentId }` for an agent, `as` for the form. | Input `SessionMessagesArgs`. Value `SessionMessagesValue`. |
| `session.repo` | [Documented] | `$.session.repo()` | Input `NoArgs`. Value `SessionRepo \| null`. |
| ⛔ `session.surface` | [Documented] | `$.session.surface()`. Deprecated: hook `session.surfaces` instead. | Input `NoArgs`. Value `RenderSurface \| null`. |
| `session.surfaces` | [Documented] | `$.session.surfaces()` | Input `NoArgs`. Value `readonly RenderSurface[]`. |
| `session.identity` | [Documented] | `$.session.identity()` | Input `NoArgs`. Value `SessionIdentity`. |
| `session.authorize` | [Documented] | `$.session.authorize()` | Input `NoArgs`. Value `SessionAuthorization`: `{ handle, kind }`, or `null` when the session holds no first-party credential. |
| `session.usage` | [Documented] | `$.session.usage({ breakdown, columns })` | Input `SessionUsageArgs`. Value `SessionUsage`. |
| `session.version` | [Documented] | `$.session.version()` | Input `NoArgs`. Value `SessionVersion`. |

The `$.http.fetch` handler runs a pre-check before it resolves the handle, when `auth` is set. Its only refusal: if [`CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/network-and-proxy.md) is set, the request throws an error that ends "the session's credential is withheld: nonessential network traffic is disabled for this session".

When no credential resolves, `$.session.authorize` logs `$.session.authorize (<plugin>): no first-party credential (<reason>)` and returns `null`. It does the same if a workload-identity token is minted for another host, or if the auth mode changes during the call.

## Related Pages

- [Mod API Overview](https://xsyetopz.github.io/claude-code-docs/extend/mod-api.md)
- [Agent](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/agent.md)
- [Session Types](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/types/session.md) (context, messages, usage, and send types)
