---
title: Session Types
description: "Types behind $.session and the session.* events: messages, context size, cost, and rate limits."
sidebar_position: 7
---

These are the types behind `$.session` and the `session.*` events.
They describe the data a mod reads about a session, such as its messages, its context size, and its cost.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | ✅ Yes, as types. `import type` them from `claude-code`. |
| Can you change it? | ❌ No. These are types only. They describe data, and they do not hold settings. |
| Can you turn it on or off? | ❌ No. A type has no switch. |
| Where does it live? | The published type file `types-2.1.303.d.ts` and `.claude-plugin/types/claude-code/index.d.ts`. |
| Status | <Documented /> |

## Example

The first call reads usage data. The second call sends text to another session and tells you if it arrived.

```ts
const { startedAt, context, rateLimits, cost } = await $.session.usage()
const { isDelivered, reason } = await $.session.send({ to, text })
```

## Types without Fields

These types are aliases, unions, or plain shapes. Each row gives its use and its shape.

| Type | Status | What it is for | Shape and limits |
| --- | --- | --- | --- |
| `ContextBreakdownDetail` | <Documented /> | How a context breakdown is counted: `full` with the token-count API per category, `summary` from the last response's usage and local estimates. | Alias of `'summary' \| 'full'`. The SDK's `get_context_usage` takes the same two words as its `detail`. |
| `ContextCategoryKind` | <Documented /> | What a breakdown row is, branch on this, never on the row's `name`. | Alias of `'used' \| 'free' \| 'buffer' \| 'deferred'`. `deferred` rows are tool schemas that load on demand and sit outside the window. |
| `ContextWindowSource` | <Documented /> | How the window the breakdown measures against was settled, /context prints its `Auto-compact window` line off this. | Alias of `'env' \| 'settings' \| 'clientdata' \| 'experiment' \| 'model-default' \| 'unknown-model' \| 'auto'`. Names who set the compaction window. `auto` is the model's own limit. |
| `SessionAppendDoor` | <Documented /> | Which door a row came in by, decided from the row alone, a closed set, pinned on the event and the key a matcher narrows on. | Alias of the twelve door names (`'prompt'`, `'command'`, `'response'`, `'note'`, `'queue'`, and more). `queue` is the text of a message queue record, not a row of the conversation. |
| `SessionCompactResult` | <Documented /> | What a `session.compact` hook returns and what `next(e)` resolves to: the compaction (`{ messages, tokensBefore?, tokensAfter?, usage? }`) or a skip. | Alias of `SessionCompacted \| SessionCompactSkipped`. There is no summary string: the summary is a message. Used by `session.compact`, `$.session.compact`. |
| `SessionCompactTrigger` | <Documented /> | Who compacts: the person's `/compact` (`manual`), the engine at its threshold or on a prompt too long (`auto`), a plugin, or a `precompute`. | Alias of `'manual' \| 'auto' \| 'plugin' \| 'precompute'`. `precompute` installs nothing. Its result is kept for the next compaction. |
| `SessionDetachReason` | <Documented /> | Why a client left the roster: `detach`, it said so (ui_detach), `end`, the session ended with it still attached. | Alias of `'detach' \| 'end'`. |
| `SessionEndReason` | <Documented /> | Why the session ended: the classic SessionEnd hook's own `reason`, word for word. | Alias of `ClassicHookInputs['SessionEnd']['reason']`. Why the session ended, such as `prompt_input_exit`, `clear`, `resume`, `logout`, or `other`. |
| `SessionMessagesApiResult` | <Documented /> | What `$.session.messages({ as: "api", agentId })` resolves to: the agent's conversation as ApiMessage, or `{ deny }` (SessionMessagesDeny). | Alias of `ApiMessage[] \| SessionMessagesDeny`. `Array.isArray` tells the two apart, without `agentId` it is always the messages. |
| `SessionMessagesCall` | <Documented /> | `$.session.messages`: the main conversation's rows with no argument, with `{ as: "api" }` its Messages API form, with `agentId` an agent's, or deny. | Alias of five call signatures. The shape of the answer depends on the arguments: none, `as: "api"`, `agentId`, or both. Used by `$.session.messages`. |
| `SessionMessagesResult` | <Documented /> | What `$.session.messages({ agentId })` resolves to: the messages (SessionMessage), or `{ deny }` (SessionMessagesDeny). | Alias of `SessionMessage[] \| SessionMessagesDeny`. Without `agentId` it is always the messages, with one the session cannot read, the deny. `Array.isArray` tells the two apart. |
| `SessionMessagesValue` | <Documented /> | What a `session.messages` hook's `{ value }` holds, for any call: the rows (SessionMessage), the Messages API form (ApiMessage), or `{ deny }`. | Alias of `SessionMessagesResult \| SessionMessagesApiResult`. Used by `session.messages`. |

## Types with Fields

Each type below has its own table of fields.

### `ContextAgent`

One custom agent whose description the Agent tool's prompt carries, built-in agents are left out.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `agentType` | <Documented /> | The agent's type, as the Agent tool names it. | Type: `string`. |
| `source` | <Documented /> | Where it was defined, by the engine's word (`projectSettings`, `userSettings`, `plugin`), the display label is the renderer's. | Type: `string`. |
| `tokens` | <Documented /> | The description's estimated tokens. | Type: `number`. |

### `ContextCategory`

One row of the breakdown, as /context lists it beside the grid (`System prompt`, `Messages`, `Free space`, `Autocompact buffer`).

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | <Documented /> | The row's label as /context prints it. | Type: `string`. |
| `tokens` | <Documented /> | The row's estimated tokens, a `deferred` row's do not count toward the total. | Type: `number`. |
| `color` | <Documented /> | The theme colour /context draws the row and its squares in, by its key in the theme (`promptBorder`, `inactive`, `permission`). | Type: `string`. |
| `isDeferred` | <Documented /> | Whether the row is tool schemas loaded on demand, which the grid leaves out, the same fact as `kind` `deferred`. | Type: `boolean`. |
| `kind` | <Documented /> | What the row is (ContextCategoryKind), stamped by the engine. | Type: `ContextCategoryKind`. |

### `ContextGridSquare`

One square of the grid /context draws: which row it belongs to and how full it is.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `color` | <Documented /> | The theme colour of the square's row, by its key in the theme. | Type: `string`. |
| `isFilled` | <Documented /> | Whether the square holds any of its row's tokens. | Type: `boolean`. |
| `categoryName` | <Documented /> | The `name` of the row the square belongs to (`Free space` for the window left). | Type: `string`. |
| `tokens` | <Documented /> | The row's tokens, repeated on each of its squares. | Type: `number`. |
| `percentage` | <Documented /> | The row's share of the window as a whole percentage, repeated likewise. | Type: `number`. |
| `squareFullness` | <Documented /> | How full this one square is, 0 to 1: a row's last square is the partial one (/context draws it hollow under 0.7). | Type: `number`. |

### `ContextMcpTool`

One MCP tool's schema as the context carries it.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | <Documented /> | The tool's wire name (`mcp__linear__create_issue`). | Type: `string`. |
| `serverName` | <Documented /> | The server it belongs to, as /mcp lists it. | Type: `string`. |
| `tokens` | <Documented /> | The schema's estimated tokens. | Type: `number`. |
| `isLoaded` | <Documented /> | Whether the schema is inside the window now: always, unless tool schemas load on demand and this one has not been searched for yet. | Type: `boolean`. |

### `ContextMemoryFile`

One memory file the context carries (a CLAUDE.md, a rules file, an auto-memory entry).

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `path` | <Documented /> | The file's path, absolute. | Type: `string`. |
| `type` | <Documented /> | The display label of where it was loaded from (`Project`, `User`, `Local`, `Managed`, `AutoMem`). | Type: `string`. |
| `tokens` | <Documented /> | The file's estimated tokens. | Type: `number`. |

### `ContextSkill`

One skill whose listing the context carries.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | <Documented /> | The skill's name as `/skills` lists it. | Type: `string`. |
| `source` | <Documented /> | Where it came from, by the engine's word (`userSettings`, `plugin`, `built-in`, `mcp`, `syncedSkills`), the display label is the renderer's. | Type: `SkillSource`. |
| `pluginName` | <Documented /> | The providing plugin's name, when the skill comes from one. | Type: `string`. Optional. |
| `tokens` | <Documented /> | The listing's estimated tokens. | Type: `number`. |

### `ContextSkills`

The skills the context lists for the model: how many there are, how many fit the listing's budget, and each one's share.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `totalSkills` | <Documented /> | How many skills the session has. | Type: `number`. |
| `includedSkills` | <Documented /> | How many the listing included within its token budget. | Type: `number`. |
| `tokens` | <Documented /> | The listing's tokens in all. | Type: `number`. |
| `skillFrontmatter` | <Documented /> | One entry per listed skill. | Type: `ContextSkill[]`. |

### `ContextSlashCommands`

The slash commands the Skill tool's prompt lists, counted.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `totalCommands` | <Documented /> | How many commands the session has. | Type: `number`. |
| `includedCommands` | <Documented /> | How many the listing included. | Type: `number`. |
| `tokens` | <Documented /> | The listing's tokens in all. | Type: `number`. |

### `SessionAppendArgs`

`session.append`'s input as a plugin's `$.session.append(args)` takes it: the row's kind and text, and the loop it joins. The engine sets the door (`note`), the origin, and the id. A hook above may rewrite or refuse the call. Used by `$.session.append`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `message` | <Documented /> | The row: `type: "user"` for a user-role row the person does not see as typed (the model reads it), `"system"` for a notice the model never reads. | Type: `object`. Its `content` is text blocks alone (one, for a notice): the bottom refuses any other block, and any other row type, with the reason. |
| `agentId` | <Documented /> | The running subagent whose conversation the row joins, absent for main. One that names no running loop is refused. | Type: `string`. Optional. |

### `SessionAppendInput`

The input of `session.append`: one row being appended to a conversation of this session, by the engine site that originates it or by a plugin's call. It is not on `e`, so the engine stores it as made. Used by `session.append`, `$.session.append`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `message` | <Documented /> | The row as it will be kept (SessionAppendMessage). Its `content` is a hook's to rewrite, the engine puts back what it pins. | Type: `SessionAppendMessage`. |
| `door` | <Documented /> | Which door the row came in by (SessionAppendDoor), the key a matcher narrows on. Pinned. | Type: `SessionAppendDoor`. |
| `origin` | <Documented /> | Who caused the row (SessionAppendOrigin): the person, the model, a tool, the engine, a settings hook, a plugin. Pinned. | Type: `SessionAppendOrigin`. |
| `uuid` | <Documented /> | The row's id, the same in the transcript file and on every later read, so a hook can keep a table by row before calling `next`. Pinned. | Type: `string`. |
| `agentId` | <Documented /> | The loop whose conversation keeps the row: a subagent's id, as `turn.step` and `tool.call` carry it, absent on main. | Type: `string`. Optional. Pinned: a different value is refused, one left out is kept. |

### `SessionAppendMessage`

One row of a conversation as `session.append` hands it: how the transcript files it, under which role a request carries it, and its blocks. `{ role, content }` of a row a request carries is an ApiMessage, so code written for `$.session.messages({ as: "api" })` reads it unchanged.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `type` | <Documented /> | How the transcript files the row: `user`, `assistant`, `attachment` (what the engine injects beside the conversation), `system` (a notice). | Type: `'user' \| 'assistant' \| 'attachment' \| 'system'`. Pinned, as `name`, `role` and `isMeta` are: left out it is kept, changed it fails the hook. |
| `name` | <Documented /> | An attachment's type (`queued_command`, `nested_memory`, ...) or a notice's subtype (`compact_boundary`, `local_command`, ...). Pinned. | Type: `string`. Optional. Absent on user and assistant rows. Builds add and retire names. |
| `role` | <Documented /> | Under which role a request carries the row, absent when none does (a notice, a record with no bytes on the wire, a virtual row). Pinned. | Type: `'user' \| 'assistant'`. Optional. |
| `isMeta` | <Documented /> | True on a user-side row the person does not see as typed (a reminder, a nudge, a delivery's text). Pinned. | Type: `true`. Optional. |
| `content` | <Documented /> | The row's blocks in order (ApiContentBlock): an attachment's as the engine recorded its rendering, a notice's as one text block. | Type: `ApiContentBlock[]`. A hook may rewrite text blocks. It may drop or move media blocks but not add them. Thinking and `tool_use` blocks are put back. |

### `SessionAppendOrigin`

Who caused a row, as the engine knows it from the row itself: a submission's sender, an injected row's author, the model, or the tool that was called. Union. Combines [`PromptOrigin`](./turn-prompt.md#promptorigin) (a submission's sender), [`PromptAttachmentOrigin`](./turn-prompt.md#promptattachmentorigin) (an injected row's author), and the `model` and `tool` shapes below. Fields: `kind`, `model`, `tool`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | <Documented /> | A block of the model's response, or the engine's stand-in for one. | Type: `'model'`. |
| `model` | <Documented /> | Whose response it is: the id the response names. | Type: `string`. |
| `kind` | <Documented /> | A tool call's result, or a row a tool handed over beside it. | Type: `'tool'`. |
| `tool` | <Documented /> | Which one was called, by name, `unknown` when no call of that id is found. | Type: `string`. |

### `SessionAppendResult`

What a `session.append` hook returns and what `next(e)` resolves to: the row as the session stored it, or `{ deny: reason }` for a plugin's own call. `next(e)` resolves once the row is kept. Only a plugin's own `note` append may be refused. Used by `$.session.append`, `session.append`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `message` | <Documented /> | The row as stored: what arrived at the bottom, the pinned parts put back. | Type: `SessionAppendMessage`. |
| `uuid` | <Documented /> | The stored row's id: the same in the transcript file and on every later read. | Type: `string`. |
| `deny` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `deny` | <Documented /> | Refuses a plugin's own append, so nothing is stored: the call resolves to this, the reason the refusing hook gave. | Type: `string`. |
| `message` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `uuid` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |

### `SessionAttachInput`

The input of `session.attach`: a surface joined the session's roster of attached clients (a phone opened the session, the desktop app connected). A remote client attaches by asking to draw. The terminal itself raises nothing. A hook observes. Used by `session.attach`, `$.session.attach`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `surface` | <Documented /> | Where the client draws: what it declared, a rendering fact. | Type: `RenderSurface`. |
| `clientId` | <Documented /> | The client's own id, unique in the roster, two phones are two clients on one surface. A client that never named itself is `<surface>:default`. | Type: `string`. |
| `viewport` | <Documented /> | The size the client draws into, in character cells, and whether its layout docks a pane, when it said. | Type: `RenderViewport`. Optional. |

### `SessionAttachResult`

What a `session.attach` hook returns and what `next(e)` resolves to: `{ clientId }`, echoed by core, a hook's own value changes nothing. Used by `session.attach`, `$.session.attach`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `clientId` | <Documented /> | Not described in the type file. | Type: `string`. |

### `SessionAuthorization`

What `$.session.authorize()` answers: an opaque handle for the session's Anthropic credential and its kind, or null when there is none to hold. The engine keeps the secret. The handle is spent through `$.http.fetch(url, { auth: handle })`. Used by `$.session.authorize`, `session.authorize`. Example value: `{ handle: "auth_00000000000000000000000000000000", kind: "bearer" }`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `handle` | <Documented /> | Not described in the type file. | Type: `string`. Looks like `auth_` and 32 hex digits. |
| `kind` | <Documented /> | Not described in the type file. | Type: `'bearer' \| 'api-key'`. |

### `SessionCompactArgs`

`session.compact`'s input as a plugin's `$.session.compact(args)` takes it: `trigger` (`plugin`), `messages` and `agentId` are the engine's. Used by `$.session.compact`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `instructions` | <Documented /> | What the summary should keep or stress, as typed after `/compact`, absent, the engine's own compaction prompt alone. | Type: `string`. Optional. |

### `SessionCompacted`

A compaction that stands: the conversation as it reads afterwards, and the counts and request usage the engine recorded when it was the one compacting.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `messages` | <Documented /> | The conversation after the compaction, oldest first: from core, its summary and the messages it kept, from a hook, whatever it hands up. | Type: `readonly SessionMessage[]`. What the transcript becomes after compaction. A message with a `handle` stays as it is. Others are built from `role`, `text`, and tool blocks. |
| `tokensBefore` | <Documented /> | The conversation's size before, in tokens, absent when core did not record it. | Type: `number`. Optional. |
| `tokensAfter` | <Documented /> | Its size afterwards, in tokens, absent on `precompute` and when core did not record it. | Type: `number`. Optional. |
| `usage` | <Documented /> | What the compaction's own model request cost (ModelUsage), when core made one: the summarizer's token counts as the API reported them. | Type: `ModelUsage`. Optional. Absent when a hook answered, when a stored summary was reused, or when the response gave none. The cost ledger already holds it. |
| `skip` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |

### `SessionCompactInput`

The input of `session.compact`: one compaction of the conversation, about to run, `messages` is the transcript it runs over. Used by `session.compact`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `trigger` | <Documented /> | What is compacting (SessionCompactTrigger), the key a matcher narrows on. Pinned: `next(e)` passes it on as received. | Type: `SessionCompactTrigger`. |
| `agentId` | <Documented /> | The id of the loop compacting, for a subagent's or a fork's own transcript, absent for the main conversation (tool.call's `agentId`). | Type: `string`. Optional. Pinned: a rewrite that changes it fails the hook. `e.messages` is this loop's transcript, not the main one. |
| `instructions` | <Documented /> | What the summary should keep or stress: the text after `/compact`, a plugin's, or absent. | Type: `string`. Optional. `next({ ...e, instructions })` changes what the summarizer is told. |
| `messages` | <Documented /> | The transcript being compacted, in `$.session.messages()`'s shape, each message carrying the engine's `handle`, a subagent's own under `agentId`. | Type: `readonly SessionMessage[]`. `next({ ...e, messages })` changes what is summarized: a message kept with its handle is the engine's own, whole, one without is read as built. |

### `SessionCompactSkipped`

A compaction vetoed: on `precompute` nothing is computed or kept, on any other trigger the conversation stays as it is and one line says why. Core answers it too, when a classic PreCompact hook blocks.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `skip` | <Documented /> | Why, as the notice reads. | Type: `string`. |
| `messages` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |

### `SessionContextBreakdown`

The context window broken down as /context breaks it down: the rows, the grid and the lists beneath it, in the SDK's `get_context_usage` shape. Token counts are numbers. A `full` breakdown uses the token-count API where it can. A `summary` one only estimates.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `categories` | <Documented /> | One row per category, the free space and the compaction buffer among them, `kind` says which is which. | Type: `ContextCategory[]`. |
| `totalTokens` | <Documented /> | Tokens in use, unclamped: past `rawMaxTokens` when over the window. | Type: `number`. |
| `maxTokens` | <Documented /> | The window measured against, the same figure as `rawMaxTokens`. | Type: `number`. |
| `rawMaxTokens` | <Documented /> | The window measured against, in tokens: the model's limit, or a smaller compaction window (`autocompactSource` says which). | Type: `number`. |
| `autocompactSource` | <Documented /> | How that window was settled (ContextWindowSource), the SDK's reply carries it under this name too, outside its typed schema. | Type: `ContextWindowSource`. |
| `percentage` | <Documented /> | `totalTokens` over `rawMaxTokens` as a whole percentage, 0 to 100 and past it when over. | Type: `number`. |
| `gridRows` | <Documented /> | The grid, row by row: 10 by 10, 20 by 10 for a window of a million or more, 5 wide when asked for under 80 `columns`. | Type: `ContextGridSquare[][]`. |
| `model` | <Documented /> | Which model the breakdown was computed for, as `/model` shows it. | Type: `string`. |
| `memoryFiles` | <Documented /> | Each memory file in the context, with its path and tokens. | Type: `ContextMemoryFile[]`. |
| `mcpTools` | <Documented /> | Each MCP tool's schema, with its server and tokens. | Type: `ContextMcpTool[]`. |
| `agents` | <Documented /> | The custom agents the Agent tool describes, each with its tokens. | Type: `ContextAgent[]`. |
| `slashCommands` | <Documented /> | The slash-command listing, counted, absent when the session lists none. | Type: `ContextSlashCommands`. Optional. |
| `skills` | <Documented /> | The skill listing, counted, with one entry per skill, absent when the session lists none. | Type: `ContextSkills`. Optional. |
| `autoCompactThreshold` | <Documented /> | The token count at which auto-compaction runs, absent when it is off. | Type: `number`. Optional. |
| `isAutoCompactEnabled` | <Documented /> | Whether auto-compaction is on for the session. | Type: `boolean`. |
| `apiUsage` | <Documented /> | The token counts (ModelUsage) the live window's last API response reported, or null before one came back. | Type: `ModelUsage \| null`. The breakdown's `Messages` row is reconciled to it. |

### `SessionContextUsage`

The live context window as the status line reads it, and by category as /context breaks it down when the call asked (`{ breakdown }`). `tokens` and `percent` are absent until the first API response of a fresh or just-compacted session.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `tokens` | <Documented /> | Input tokens the last response was answered over: uncached, cache-written and cache-read together (the status line's `total_input_tokens`). | Type: `number`. Optional. |
| `window` | <Documented /> | The context window of the session's model, in tokens (the status line's `context_window_size`). | Type: `number`. |
| `percent` | <Documented /> | `tokens` over `window` as a whole percentage, 0 to 100 (the status line's `used_percentage`). | Type: `number`. Optional. |
| `breakdown` | <Documented /> | The window by category, as /context breaks it down: present only when the call passed `breakdown`, and only with a session bound. | Type: `SessionContextBreakdown`. Optional. It counts against the compaction window (`rawMaxTokens`), so its `totalTokens` may differ from `tokens`. |

### `SessionCost`

What the session has cost, as `/cost` and the status line total it.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `usd` | <Documented /> | US dollars, summed over every priced API response this session. | Type: `number`. |

### `SessionCronSummary`

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `id` | <Documented /> | Not described in the type file. | Type: `string`. |
| `schedule` | <Documented /> | Cron expression, e.g. "0 9 \* * 1-5". | Type: `string`. |
| `recurring` | <Documented /> | False for one-shot wakeups whose cron field encodes a single fire time, true for tasks that re-fire on every match. | Type: `boolean`. |
| `prompt` | <Documented /> | Prompt text submitted when the cron fires. Capped at 1000 chars, clipped values append an in-string "... [+N chars]" marker. | Type: `string`. |

### `SessionDetachInput`

The input of `session.detach`: a client left the session's roster. Every field is the engine's: a hook observes, and `next(e)` passes them on. Used by `session.detach`, `$.session.detach`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `surface` | <Documented /> | Where the client drew. | Type: `RenderSurface`. |
| `clientId` | <Documented /> | The id it attached under. | Type: `string`. |
| `reason` | <Documented /> | Why it left: it detached, or the session ended under it. | Type: `SessionDetachReason`. |

### `SessionDetachResult`

What a `session.detach` hook returns and what `next(e)` resolves to: `{ clientId }`, echoed by core, a hook's own value changes nothing. Used by `session.detach`, `$.session.detach`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `clientId` | <Documented /> | Not described in the type file. | Type: `string`. |

### `SessionEndInput`

The input of `session.end`: the session is ending, why, and how to come back to it, every field is the engine's: a hook observes, `next(e)` passes it on. One short time bound (1.5 s by default) covers all hooks. `next.budget` reads it and `next.signal` aborts at it. Used by `session.end`, `$.session.end`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `reason` | <Documented /> | Why it ends (SessionEndReason), the word the classic SessionEnd hook receives as its `reason`. | Type: `SessionEndReason`. `clear` is how a hook sees a `/clear`: the conversation ends, the process goes on under a new session id, and no `session.start` fires for it. |
| `sessionId` | <Documented /> | The ending session's id (`$.session.id()` until now), after a `/clear` or a resume the process goes on under another. | Type: `string`. |
| `resume` | <Documented /> | What `claude --resume` takes to return to it. | Type: `SessionResume`. |

### `SessionEndResult`

What a `session.end` hook returns and what `next(e)` resolves to: `{ sessionId }`, echoed by core, a hook's own value changes nothing. Used by `session.end`, `$.session.end`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `sessionId` | <Documented /> | Not described in the type file. | Type: `string`. |

### `SessionIdentity`

What `$.session.identity()` answers: how the session is signed in and, under a managed pin of its organization, the account the session holds. Only a mod that managed settings install gets an answer. Used by `$.session.identity`, `session.identity`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | <Documented /> | How the session is authenticated: `claude.ai`, `console`, `api-key`, `oauth-token` (a token its host handed it), `none`, or a cloud provider's name (`bedrock`, `vertex`, ...). | Type: `string`. Builds add kinds: read an unknown one as a session with no identity. |
| `organizationId` | <Documented /> | The organization the account belongs to, by its id, only where managed `forceLoginOrgUUID` lists that organization. | Type: `string`. Optional. Absent unless the organization is pinned, so a mod never learns of another organization's account. |
| `organizationType` | <Documented /> | The organization's plan as the server names it (`claude_team`, `claude_enterprise`, ...), when the login recorded one. | Type: `string`. Optional. Always read from the login record on disk, which the person can edit, whatever `isVerified` says. |
| `email` | <Documented /> | The account's email address, where the session holds one. | Type: `string`. Optional. |
| `isVerified` | <Documented /> | Whether `organizationId` and `email` are the account the server told this process its credential signed in as, not the login record on disk. | Type: `boolean`. The person can edit that record. False until the server has answered this process, as with nonessential traffic off, and with no account. |
| `deny` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `deny` | <Documented /> | Why nothing is answered: the calling mod is not one managed settings enable and load in place from a source they name. | Type: `string`. |
| `kind` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `organizationId` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `organizationType` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `email` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `isVerified` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |

### `SessionMeasureInput`

The input of `session.measure`: what `$.session.usage()` answers at this moment, and which of its units moved since the last measurement a hook saw. The same figures as the op, without `context.breakdown`. A hook observes. Used by `session.measure`, `$.session.measure`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `context` | <Documented /> | The live context window (`$.session.usage()`'s `context`): the window, and its fill once a response of the live window reported one. | Type: `SessionContextUsage`. Never carries `breakdown` here. |
| `rateLimits` | <Documented /> | The rate-limit windows the last response reported, each with its `percentUsed`, empty off a subscription or before the first reading. | Type: `SessionRateLimit[]`. |
| `cost` | <Documented /> | What the session has cost so far, absent where the host keeps no ledger. | Type: `SessionCost`. Optional. |
| `changed` | <Documented /> | Which units differ from the last measurement raised (UsageUnit), never empty, the first measurement names every unit it has a figure for. | Type: `UsageUnit[]`. `context`: the fill moved, `rateLimits`: a window moved a whole point, appeared or left, or the account's limit status changed, `cost`: the total grew. |

### `SessionMeasureResult`

What a `session.measure` hook returns and what `next(e)` resolves to: `{ changed }`, echoed by core, a hook's own value changes nothing. Used by `session.measure`, `$.session.measure`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `changed` | <Documented /> | Not described in the type file. | Type: `UsageUnit[]`. |

### `SessionMessage`

One message of the transcript as `$.session.messages()` returns it.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `role` | <Documented /> | Who wrote it. | Type: `'user' \| 'assistant'`. |
| `text` | <Documented /> | Its text blocks joined, '' when it has none. | Type: `string`. |
| `toolUses` | <Documented /> | The tool_use blocks of an assistant message, each with its outcome (`result`, `text`, `isError`) once the transcript holds it. | Type: `ToolUseSummary[]`. |
| `toolResults` | <Documented /> | The tool_result blocks of a user message: `{ tool_use_id, text, isError, result }`. | Type: `ToolResultSummary[]`. Optional. |
| `handle` | <Documented /> | An opaque token the engine stamps on a message it hands a `session.compact` hook, so a list handed back maps to its own messages. | Type: `string`. Optional. Absent on `$.session.messages()` and on a message a hook built. |

### `SessionMessagesAgentArgs`

A `$.session.messages` call for the rows (SessionMessage) of the main conversation or of one agent's: `agentId` alone, no `as`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `agentId` | <Documented /> | Whose conversation, absent, the main one. | Type: `string`. Optional. |
| `as` | <Documented /> | Left out: the rows. | Type: `undefined`. Optional. |

### `SessionMessagesApiArgs`

A `$.session.messages` call for the Messages API form (ApiMessage) of the main conversation or, with `agentId`, of one of this session's agents'.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `as` | <Documented /> | `"api"`. | Type: `'api'`. |
| `agentId` | <Documented /> | Whose conversation, absent, the main one. | Type: `string`. Optional. |

### `SessionMessagesArgs`

What `$.session.messages(args)` takes and a `session.messages` hook reads on `e`: whose conversation (`agentId`) and in which form (`as`). Used by `session.messages`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `agentId` | <Documented /> | Whose conversation to read: the id `tool.call`, `turn.step` and `turn.complete` carry inside that agent's loop. Absent, the main one. | Type: `string`. Optional. Names a subagent, fork, or teammate that runs in this process. `$.agent.list()` lists them. |
| `as` | <Documented /> | `"api"` for the Messages API form (ApiMessage: `{ role, content }` with the content blocks intact), absent, the rows (SessionMessage). | Type: `'api'`. Optional. |

### `SessionMessagesDeny`

What `$.session.messages({ agentId })` resolves to when the id names no conversation this session can read: why not, in `deny`. The agent is unknown, runs in another process, or has no saved transcript. It is never the main agent.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `deny` | <Documented /> | Why no conversation was read, naming the id. | Type: `string`. |

### `SessionMessagesMainApiArgs`

A `$.session.messages({ as: "api" })` call naming no agent: the main conversation, whose answer is always the messages (ApiMessage).

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `as` | <Documented /> | `"api"`. | Type: `'api'`. |
| `agentId` | <Documented /> | Left out: the main conversation. | Type: `undefined`. Optional. |

### `SessionRateLimit`

One rate-limit window as the rate-limit notices read it.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | <Documented /> | Which window: `five_hour`, `seven_day`, or a Claude gateway's `spend_limit`. | Type: `string`. |
| `percentUsed` | <Documented /> | How much of the window is used, 0 to 100 with at most one decimal: 23.5, or 7, never 7.000000000000001, past 100 on an exceeded spend limit. | Type: `number`. |
| `resetsAt` | <Documented /> | When the window resets, as an ISO 8601 timestamp. | Type: `string`. Optional. |

### `SessionReceiveEvent`

An external-event wake the delivery's text parsed as (a GitHub relay event, a signal's notice): the envelope's attributes and its JSON body.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `source` | <Documented /> | The producing service (`github`, `artifact-room` for a page's events). | Type: `string`. |
| `kind` | <Documented /> | The event's discriminator (`pull_request.closed`, `check_suite`). | Type: `string`. |
| `from` | <Documented /> | The envelope's sender-kind attribute as the server stamped it (`system` for a relay's own event, `rc_owner` for the user's own relayed message), absent when the envelope carries none. | Type: `string`. Optional. |
| `data` | <Documented /> | The envelope's JSON body (`{ pr: "acme/app#12", outcome: "merged" }`). | Type: `Record<string, unknown>`. The payload of the event. For `artifact-room` it holds `artifact`, `events`, and `overflow`. |
| `untrustedKeys` | <Documented /> | The `data` keys whose values are free text a third party wrote (a commenter's `author` and `comment`), as the producer marked them. | Type: `readonly string[]`. Empty when none, the server asserts every other key's value, not these. |

### `SessionReceiveInput`

The input of `session.receive`: one inbound delivery, sanitized, before it is queued (a relay's event, a peer's message, a message for an agent). Used by `session.receive`, `$.session.receive`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `origin` | <Documented /> | Where the delivery came from, as the bridge classified it, the key a matcher narrows on. `next(e)` passes it on as received. | Type: `SessionReceiveOrigin`. |
| `text` | <Documented /> | The delivery's body as the model would read it (a content-block delivery's text blocks, joined). | Type: `string`. |
| `event` | <Documented /> | The external-event wake the text parsed as (`source` `github` for a subscribed pull request's event), passed on as received. | Type: `SessionReceiveEvent`. Optional. Present only when the server itself rendered the delivery as a wake. `untrustedKeys` name third-party text. |
| `agentId` | <Documented /> | The id of the loop the delivery is for, when it is one of this session's agents (`$.agent.list()` lists it), absent for the main conversation's. | Type: `string`. Optional. Pinned: a rewrite that changes it is refused. It is the receiver's agent id. |

### `SessionReceiveOrigin`

Where an inbound delivery came from, as the bridge classified it from the server's stamps: `prompt.submit`'s `e.origin`, less what never arrives.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | <Documented /> | `bridge` the user's own from a Remote Control client, `unclassified` one nobody could place, the rest as at `prompt.submit`. | Type: `'bridge' \| 'task-notification' \| 'scheduled-trigger' \| 'peer-send-message' \| 'projects-relay' \| 'slack-ping' \| 'unclassified'`. `task-notification` a relay's event or a trigger. |
| `kind` | <Documented /> | `peer` another session's or agent's model, `coordinator` the main conversation to an agent of its own. | Type: `'peer' \| 'coordinator'`. |
| `plugin` | <Documented /> | Which plugin's `$.session.send` composed it, AS THE SENDER SAYS, absent for a message the sending model wrote itself. | Type: `string`. Optional. A claim over a same-user channel, exactly as trustworthy as the sender's name: name it in a log line, never key a guard on it. |
| `kind` | <Documented /> | A delivery through this session's agent-team mailbox: `coordinator` from the lead's harness, `peer` from a teammate's or when unverified. | Type: `'peer' \| 'coordinator'`. |
| `plugin` | <Documented /> | Which plugin's `$.session.send` composed it, as the mailbox entry says, absent for a message the sending model wrote itself. | Type: `string`. Optional. |
| `teammate` | <Documented /> | The sending member's name in the team (`team-lead` for the lead): the harness's stamp when `isVerified`, else whatever the writer put. | Type: `string`. Example: `on("session.receive", { origin: { teammate: "researcher" } }, hook)`. |
| `isVerified` | <Documented /> | Whether this process's harness wrote the mailbox entry itself (an in-process teammate's or the lead's own send). | Type: `boolean`. `false` means the message came from the team's inbox file and nothing could check it. |

### `SessionReceiveResult`

What a `session.receive` hook returns and what `next(e)` resolves to: the delivery that was queued, `{ text }`, or `{ consumed: reason }`. `next(e)` resolves once the delivery is queued, a hook answering without `next` queues nothing. Used by `session.receive`, `$.session.receive`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | <Documented /> | The body the delivery was queued with, from core, `e.text` as it arrived at the bottom. | Type: `string`. A rewrite passes it down, `next({ ...e, text })`. |
| `consumed` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `consumed` | <Documented /> | Takes the delivery, answered without `next`: it is not queued, not written to the transcript and never reaches the model. | Type: `string`. The reason is logged, the plugin named. |
| `text` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |

### `SessionRepo`

What `$.session.repo()` answers: the repository's root and its origin remote, when the session is in one. Used by `$.session.repo`, `session.repo`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `root` | <Documented /> | The repository's root, absolute: the main working tree's for a worktree. | Type: `string`. |
| `remote` | <Documented /> | The `origin` remote's URL as git has it (push URL preferred), or null when the repository has none. | Type: `string \| null`. |
| `internal` | <Documented /> | Whether the remote is one of the repositories this build treats as its own, false in a build that has none or when the remote is unrecognized. | Type: `boolean`. True for a repository on the build's own list. A plugin may read it to act differently in a public repository. |
| `name` | <Documented /> | The repository the allowlist matched, as `owner/name`, null when `internal` is false. | Type: `string \| null`. A working copy without a remote that the engine still recognises is named by its own checkout configuration, a remote's name is its path. |

### `SessionResume`

How to come back to the session that ended: what `claude --resume` takes.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `id` | <Documented /> | What `claude --resume <id>` takes, the ending session's own. | Type: `string`. It resumes a session that wrote a transcript: one that never ran a prompt, or ran with persistence off, left nothing under this id. |

### `SessionSendAddress`

Whom `$.session.send` addresses: a recipient as the SendMessage tool names one (a string), or a session or an agent of this session by id. Union. Fields: `agentId`, `sessionId`. The engine spells the two id forms before the send. A `session.send` hook reads that spelling on `e.to`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `sessionId` | <Documented /> | One of the person's own sessions: what its `$.session.id()` answers on this machine, or a Remote Control or cloud id (`session_...`). | Type: `string`. A session that is not running now is not delivered to: the result says so. |
| `agentId` | <Documented /> | A subagent or teammate of this session: the id `$.agent.list()` lists and `agent.spawn` answered. | Type: `string`. A finished subagent is resumed from its transcript with the message, as the tool does. A live teammate's `teammateId` reaches it too. |

### `SessionSendArgs`

`session.send`'s input as a plugin's `$.session.send(args)` takes it: `origin` (the calling plugin) and `agentId` are the engine's to set. Used by `$.session.send`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `to` | <Documented /> | The recipient: the tool's own spelling (a name, an agent id, a received `from` address), or `{ sessionId }` / `{ agentId }`. | Type: `SessionSendAddress`. |
| `text` | <Documented /> | The message's text, non-empty. | Type: `string`. |

### `SessionSendInput`

The input of `session.send`: one plain-text message about to leave this conversation for another agent or session, the dual of `session.receive`. Used by `session.send`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `to` | <Documented /> | Whom it goes to, as the SendMessage tool spells a recipient: a name as ListAgents lists it, an agent id, or a received `from` address. | Type: `string`. A plugin's `{ sessionId }` or `{ agentId }` arrives already spelled. `next({ ...e, to })` readdresses it, and the engine judges it again. |
| `text` | <Documented /> | The message's text as the recipient will read it inside the engine's envelope, `next({ ...e, text })` is what is sent, with no new approval. | Type: `string`. |
| `origin` | <Documented /> | Who is sending: the model through its SendMessage tool, or a plugin through `$.session.send`. Pinned: a rewrite that changes it is refused. | Type: `SessionSendOrigin`. |
| `agentId` | <Documented /> | The id of the loop sending, when a subagent's or teammate's model sends (`$.agent.list()` lists it), absent for the main conversation's send. | Type: `string`. Optional. Pinned: it is the sender's agent id. The receiver's `session.receive` gets its own loop's `agentId`. |

### `SessionSendOrigin`

Who is sending at `session.send`: the model through its SendMessage tool, or a plugin through `$.session.send`, stamped by the engine, pinned. The receiver's `session.receive` reads a plugin's name on its own `e.origin.plugin`, beside the `peer` or `coordinator` kind it keeps.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | <Documented /> | The model's own SendMessage tool call, in the main conversation or in a subagent's or teammate's loop (`e.agentId` says which). | Type: `'model'`. |
| `kind` | <Documented /> | A plugin's `$.session.send`, its `$.tool.call` of SendMessage, or the model inside an agent it spawned, its other hooks still see it. | Type: `'plugin'`. |
| `name` | <Documented /> | The sending plugin's name, which the receiver reads as its `session.receive` origin's `plugin` and shows beside the sender. | Type: `string`. |

### `SessionSendResult`

What a `session.send` hook returns and `next(e)` and `$.session.send` resolve to: whether the message was delivered, and why not when not. Delivered means queued at the recipient, not read. Used by `session.send`, `$.session.send`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `isDelivered` | <Documented /> | True: the message reached its recipient's queue or inbox. | Type: `true`. |
| `reason` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `isDelivered` | <Documented /> | False: nothing was delivered. A hook answering this without `next` refuses the send, and the model reads `reason` as the tool's result. | Type: `false`. |
| `reason` | <Documented /> | Why not, as the SendMessage tool words it: nobody by that name, several by it, the recipient gone or refusing, or a hook's refusal. | Type: `string`. Example: `on('session.send', { to: 'prod' }, () => NOT_FROM_HERE)`. |

### `SessionStartInput`

The input of `session.start`: the session the process starts with, read the way `$.session` reads it at that moment. Used by `session.start`, `$.session.start`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `cwd` | <Documented /> | The directory the session runs in, absolute (`$.session.cwd()`). | Type: `string`. |
| `surface` | <Documented /> | Where the session draws at start (`$.session.surfaces()[0]`): `terminal` under the REPL, null for a `-p` run or the SDK, which draw nowhere yet. | Type: `RenderSurface \| null`. |
| `isInteractive` | <Documented /> | Whether a person is at the prompt: true under the REPL, false for a `-p` run or the SDK. | Type: `boolean`. |

### `SessionStartResult`

What a `session.start` hook returns and what `next(e)` resolves to: `{ cwd }`, echoed by core, a hook's own value does not change the session. Used by `session.start`, `$.session.start`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `cwd` | <Documented /> | Not described in the type file. | Type: `string`. |

### `SessionUsage`

What `$.session.usage()` answers: when the session began, the context window's fill, the account's rate-limit windows and the session's cost. The status line's figures. A figure the engine lacks is left out, never set to zero. Used by `$.session.usage`, `session.usage`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `startedAt` | <Documented /> | When the session these figures count from began, in `$.clock.now()`'s milliseconds: its launch, or for a resumed session its first launch. | Type: `number`. When the session counts from. `/clear` starts it over at that moment. |
| `context` | <Documented /> | The live context window: the status line's `context_window` figures. | Type: `SessionContextUsage`. |
| `rateLimits` | <Documented /> | The rate-limit windows the last API response reported (`five_hour`, `seven_day`, a gateway's `spend_limit`), empty when none has a reading. | Type: `SessionRateLimit[]`. |
| `cost` | <Documented /> | What the session has cost so far, as /cost totals it, absent only where the host keeps no cost ledger (the CLI always has one). | Type: `SessionCost`. Optional. |

### `SessionUsageArgs`

What `$.session.usage(args)` takes: nothing for the status line's figures alone, `breakdown` to have the window broken down as /context breaks it. Used by `$.session.usage`, `session.usage`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `breakdown` | <Documented /> | Asks for `context.breakdown` and says how it is counted (ContextBreakdownDetail), absent, none is computed and the call is free. | Type: `ContextBreakdownDetail`. Optional. `full` sends one token-count request per tool and memory file, as /context does, `summary` estimates locally and sends none. |
| `columns` | <Documented /> | The width the breakdown's grid will be drawn in, in terminal columns, absent, the full-width grid. Read only with `breakdown`. | Type: `number`. Optional. Under 80 the grid is the narrow one /context draws there, 5 wide. A thin client's breakdown is the remote workspace's, whose grid ignores this. |

### `SessionVersion`

What `$.session.version()` answers: the version of the engine the session runs on, the release that version is built from, and when it was built. The same three values as the engine's own analytics rows. Used by `$.session.version`, `session.version`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `version` | <Documented /> | The engine's full version, as `claude --version` prints it. | Type: `string`. A release's is `2.1.280`, a development build's adds the build's date, time and commit (`2.1.280-dev.20260920.t101500.sha1a2b3c4`). |
| `base` | <Documented /> | The release the version is built from, its semantic core and channel: `2.1.280` for that release, `2.1.280-dev` for a development build of it. | Type: `string`. Optional. Absent when the version is not spelled as a release. |
| `builtAt` | <Documented /> | When the binary was built, an ISO 8601 timestamp (`2026-09-20T10:15:00Z`). Absent in a run from source that stamps none. | Type: `string`. Optional. |

## Related Pages

- [Mod API Overview](../index.md)
- [Session](../session.md)
- [Mod API Types](index.md)
