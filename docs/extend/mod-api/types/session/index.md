---
title: Session Types
description: "Types behind $.session and the session.* events: messages, context size, cost, and rate limits."
sidebar_position: 7
---

These are the types behind `$.session` and the `session.*` events.
They describe the data a mod reads about a session, such as its messages, its context size, and its cost.

## Pages

| Page | What is in it |
| --- | --- |
| [Session Context and Append Types](context-append.md) | `ContextAgent` to `SessionAuthorization`: the context breakdown types and the append and attach types. |
| [Session Compact, Detach, Measure, and Messages Types](compact-measure-messages.md) | `SessionCompactArgs` to `SessionMessagesMainApiArgs`: compact, context usage, cost, cron, detach, end, identity, measure, and messages types. |
| [Session Receive, Send, and Usage Types](receive-send-usage.md) | `SessionRateLimit` to `SessionVersion`: rate limit, receive, repo, resume, send, start, usage, and version types. |

## Example

The first call reads usage data. The second call sends text to another session and tells you if it arrived.

```ts
const { startedAt, context, rateLimits, cost } = await $.session.usage();
const { isDelivered, reason } = await $.session.send({ to, text });
```

## Types without Fields

These types are aliases, unions, or plain shapes. Each row gives its use and its shape.

| Type | Status | What it is for | Shape and limits |
| --- | --- | --- | --- |
| `ContextBreakdownDetail` | <Documented /> | How a context breakdown is counted: `full` counts with the token-count API for each category. `summary` counts from the usage of the last response and local estimates. | Alias of `'summary' \| 'full'`. The `get_context_usage` of the SDK takes the same two words as its `detail`. |
| `ContextCategoryKind` | <Documented /> | What a breakdown row is. Branch on this, never on the `name` of the row. | Alias of `'used' \| 'free' \| 'buffer' \| 'deferred'`. `deferred` rows are tool schemas that load on demand and sit outside the window. |
| `ContextWindowSource` | <Documented /> | How the window that the breakdown measures against was settled. /context prints its `Auto-compact window` line from this. | Alias of `'env' \| 'settings' \| 'clientdata' \| 'experiment' \| 'model-default' \| 'unknown-model' \| 'auto'`. Names who set the compaction window. `auto` is the own limit of the model. |
| `SessionAppendDoor` | <Documented /> | Which door a row came in by, decided from the row alone. It is a closed set, pinned on the event, and the key that a matcher narrows on. | Alias of the twelve door names (`'prompt'`, `'command'`, `'response'`, `'note'`, `'queue'`, and more). `queue` is the text of a message queue record, not a row of the conversation. |
| `SessionCompactResult` | <Documented /> | What a `session.compact` hook returns and what `next(e)` resolves to: the compaction (`{ messages, tokensBefore?, tokensAfter?, usage? }`) or a skip. | Alias of `SessionCompacted \| SessionCompactSkipped`. There is no summary string: the summary is a message. Used by `session.compact`, `$.session.compact`. |
| `SessionCompactTrigger` | <Documented /> | Who compacts: the `/compact` of the person (`manual`), the engine at its threshold or on a prompt too long (`auto`), a plugin, or a `precompute`. | Alias of `'manual' \| 'auto' \| 'plugin' \| 'precompute'`. `precompute` installs nothing. Its result is kept for the next compaction. |
| `SessionDetachReason` | <Documented /> | Why a client left the roster: `detach` means it said so (ui_detach). `end` means the session ended with it still attached. | Alias of `'detach' \| 'end'`. |
| `SessionEndReason` | <Documented /> | Why the session ended: the own `reason` of the classic SessionEnd hook, word for word. | Alias of `ClassicHookInputs['SessionEnd']['reason']`. Why the session ended, such as `prompt_input_exit`, `clear`, `resume`, `logout`, or `other`. |
| `SessionMessagesApiResult` | <Documented /> | What `$.session.messages({ as: "api", agentId })` resolves to: the conversation of the agent as ApiMessage, or `{ deny }` (SessionMessagesDeny). | Alias of `ApiMessage[] \| SessionMessagesDeny`. `Array.isArray` tells the two apart. Without `agentId` it is always the messages. |
| `SessionMessagesCall` | <Documented /> | `$.session.messages`: the rows of the main conversation with no argument, its Messages API form with `{ as: "api" }`, the rows of an agent with `agentId`, or deny. | Alias of five call signatures. The shape of the answer depends on the arguments: none, `as: "api"`, `agentId`, or both. Used by `$.session.messages`. |
| `SessionMessagesResult` | <Documented /> | What `$.session.messages({ agentId })` resolves to: the messages (SessionMessage), or `{ deny }` (SessionMessagesDeny). | Alias of `SessionMessage[] \| SessionMessagesDeny`. Without `agentId` it is always the messages. With an id that the session cannot read, it is the deny. `Array.isArray` tells the two apart. |
| `SessionMessagesValue` | <Documented /> | What the `{ value }` of a `session.messages` hook holds, for any call: the rows (SessionMessage), the Messages API form (ApiMessage), or `{ deny }`. | Alias of `SessionMessagesResult \| SessionMessagesApiResult`. Used by `session.messages`. |

## Related Pages

- [Mod API Overview](../../index.md)
- [Session](../../calls/session.md)
- [Mod API Types](../index.md)
