---
title: Session Context and Append Types
description: "Types of the context breakdown, the append call, attach, and authorization."
sidebar_position: 1
---

## Types with Fields

Each type below has its own table of fields.

### `ContextAgent`

One custom agent whose description the prompt of the Agent tool carries. Built-in agents are left out.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `agentType` | <Documented /> | The type of the agent, as the Agent tool names it. | Type: `string`. |
| `source` | <Documented /> | Where it was defined, by the word of the engine (`projectSettings`, `userSettings`, `plugin`). The display label belongs to the renderer. | Type: `string`. |
| `tokens` | <Documented /> | The estimated tokens of the description. | Type: `number`. |

### `ContextCategory`

One row of the breakdown, as /context lists it beside the grid (`System prompt`, `Messages`, `Free space`, `Autocompact buffer`).

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | <Documented /> | The label of the row as /context prints it. | Type: `string`. |
| `tokens` | <Documented /> | The estimated tokens of the row. The tokens of a `deferred` row do not count toward the total. | Type: `number`. |
| `color` | <Documented /> | The theme colour that /context draws the row and its squares in, by its key in the theme (`promptBorder`, `inactive`, `permission`). | Type: `string`. |
| `isDeferred` | <Documented /> | Whether the row is tool schemas loaded on demand, which the grid leaves out. It is the same fact as `kind` `deferred`. | Type: `boolean`. |
| `kind` | <Documented /> | What the row is (ContextCategoryKind). The engine stamps it. | Type: `ContextCategoryKind`. |

### `ContextGridSquare`

One square of the grid /context draws: which row it belongs to and how full it is.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `color` | <Documented /> | The theme colour of the row of the square, by its key in the theme. | Type: `string`. |
| `isFilled` | <Documented /> | Whether the square holds any of the tokens of its row. | Type: `boolean`. |
| `categoryName` | <Documented /> | The `name` of the row that the square belongs to (`Free space` for the window left). | Type: `string`. |
| `tokens` | <Documented /> | The tokens of the row, repeated on each of its squares. | Type: `number`. |
| `percentage` | <Documented /> | The share of the window for the row, as a whole percentage, repeated likewise. | Type: `number`. |
| `squareFullness` | <Documented /> | How full this one square is, 0 to 1. The last square of a row is the partial one (/context draws it hollow under 0.7). | Type: `number`. |

### `ContextMcpTool`

The schema of one MCP tool as the context carries it.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | <Documented /> | The wire name of the tool (`mcp__linear__create_issue`). | Type: `string`. |
| `serverName` | <Documented /> | The server it belongs to, as /mcp lists it. | Type: `string`. |
| `tokens` | <Documented /> | The estimated tokens of the schema. | Type: `number`. |
| `isLoaded` | <Documented /> | Whether the schema is inside the window now. It is always inside, unless tool schemas load on demand and nothing has searched for this one yet. | Type: `boolean`. |

### `ContextMemoryFile`

One memory file the context carries (a CLAUDE.md, a rules file, an auto-memory entry).

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `path` | <Documented /> | The path of the file, absolute. | Type: `string`. |
| `type` | <Documented /> | The display label of where it was loaded from (`Project`, `User`, `Local`, `Managed`, `AutoMem`). | Type: `string`. |
| `tokens` | <Documented /> | The estimated tokens of the file. | Type: `number`. |

### `ContextSkill`

One skill whose listing the context carries.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | <Documented /> | The name of the skill as `/skills` lists it. | Type: `string`. |
| `source` | <Documented /> | Where it came from, by the word of the engine (`userSettings`, `plugin`, `built-in`, `mcp`, `syncedSkills`). The display label belongs to the renderer. | Type: `SkillSource`. |
| `pluginName` | <Documented /> | The name of the providing plugin, when the skill comes from one. | Type: `string`. Optional. |
| `tokens` | <Documented /> | The estimated tokens of the listing. | Type: `number`. |

### `ContextSkills`

The skills that the context lists for the model. It has how many there are, how many fit the budget of the listing, and the share of each one.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `totalSkills` | <Documented /> | How many skills the session has. | Type: `number`. |
| `includedSkills` | <Documented /> | How many the listing included within its token budget. | Type: `number`. |
| `tokens` | <Documented /> | The tokens of the listing in all. | Type: `number`. |
| `skillFrontmatter` | <Documented /> | One entry for each listed skill. | Type: `ContextSkill[]`. |

### `ContextSlashCommands`

The slash commands that the prompt of the Skill tool lists, counted.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `totalCommands` | <Documented /> | How many commands the session has. | Type: `number`. |
| `includedCommands` | <Documented /> | How many the listing included. | Type: `number`. |
| `tokens` | <Documented /> | The tokens of the listing in all. | Type: `number`. |

### `SessionAppendArgs`

The input of `session.append` as the `$.session.append(args)` of a plugin takes it: the kind and text of the row, and the loop that it joins. The engine sets the door (`note`), the origin, and the id. A hook above may rewrite or refuse the call. Used by `$.session.append`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `message` | <Documented /> | The row. `type: "user"` is for a user-role row that the person does not see as typed (the model reads it). `"system"` is for a notice that the model never reads. | Type: `object`. Its `content` is text blocks alone (one, for a notice). The bottom refuses any other block with the reason. It refuses any other row type too. |
| `agentId` | <Documented /> | The running subagent whose conversation the row joins. Absent for main. The engine refuses one that names no running loop. | Type: `string`. Optional. |

### `SessionAppendInput`

The input of `session.append`: one row being appended to a conversation of this session. The engine site that originates it, or the call of a plugin, appends it. It is not on `e`, so the engine stores it as made. Used by `session.append`, `$.session.append`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `message` | <Documented /> | The row as it will be kept (SessionAppendMessage). A hook may rewrite its `content`. The engine puts back what it pins. | Type: `SessionAppendMessage`. |
| `door` | <Documented /> | Which door the row came in by (SessionAppendDoor), the key that a matcher narrows on. Pinned. | Type: `SessionAppendDoor`. |
| `origin` | <Documented /> | Who caused the row (SessionAppendOrigin): the person, the model, a tool, the engine, a settings hook, a plugin. Pinned. | Type: `SessionAppendOrigin`. |
| `uuid` | <Documented /> | The id of the row. It is the same in the transcript file and on every later read. A hook can keep a table by row before it calls `next`. Pinned. | Type: `string`. |
| `agentId` | <Documented /> | The loop whose conversation keeps the row: the id of a subagent, as `turn.step` and `tool.call` carry it. Absent on main. | Type: `string`. Optional. Pinned: a different value is refused, and one left out is kept. |

### `SessionAppendMessage`

One row of a conversation as `session.append` hands it. It has how the transcript files the row, under which role a request carries it, and its blocks. `{ role, content }` of a row a request carries is an ApiMessage, so code written for `$.session.messages({ as: "api" })` reads it unchanged.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `type` | <Documented /> | How the transcript files the row: `user`, `assistant`, `attachment` (what the engine injects beside the conversation), `system` (a notice). | Type: `'user' \| 'assistant' \| 'attachment' \| 'system'`. Pinned, as `name`, `role` and `isMeta` are. If left out, it is kept. If changed, it fails the hook. |
| `name` | <Documented /> | The type of an attachment (`queued_command`, `nested_memory`, ...) or the subtype of a notice (`compact_boundary`, `local_command`, ...). Pinned. | Type: `string`. Optional. Absent on user and assistant rows. Builds add and retire names. |
| `role` | <Documented /> | Under which role a request carries the row. Absent when none does (a notice, a record with no bytes on the wire, a virtual row). Pinned. | Type: `'user' \| 'assistant'`. Optional. |
| `isMeta` | <Documented /> | True on a user-side row that the person does not see as typed (a reminder, a nudge, the text of a delivery). Pinned. | Type: `true`. Optional. |
| `content` | <Documented /> | The blocks of the row in order (ApiContentBlock): for an attachment, as the engine recorded its rendering. For a notice, as one text block. | Type: `ApiContentBlock[]`. A hook may rewrite text blocks. It may drop or move media blocks but not add them. The engine puts back thinking and `tool_use` blocks. |

### `SessionAppendOrigin`

Who caused a row, as the engine knows it from the row itself. It can be the sender of a submission, the author of an injected row, the model, or the tool that was called. Union. Combines [`PromptOrigin`](../turn-prompt/edit-fill-submit.md#promptorigin) (a submission's sender), [`PromptAttachmentOrigin`](../turn-prompt/attachments-context.md#promptattachmentorigin) (an injected row's author), and the `model` and `tool` shapes below. Fields: `kind`, `model`, `tool`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | <Documented /> | A block of the response of the model, or the stand-in of the engine for one. | Type: `'model'`. |
| `model` | <Documented /> | Whose response it is: the id the response names. | Type: `string`. |
| `kind` | <Documented /> | The result of a tool call, or a row that a tool handed over beside it. | Type: `'tool'`. |
| `tool` | <Documented /> | Which tool was called, by name. It is `unknown` when no call of that id is found. | Type: `string`. |

### `SessionAppendResult`

What a `session.append` hook returns and what `next(e)` resolves to: the row as the session stored it, or `{ deny: reason }` for the own call of a plugin. `next(e)` resolves once the row is kept. Only the own `note` append of a plugin may be refused. Used by `$.session.append`, `session.append`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `message` | <Documented /> | The row as stored: what arrived at the bottom, with the pinned parts put back. | Type: `SessionAppendMessage`. |
| `uuid` | <Documented /> | The id of the stored row: the same in the transcript file and on every later read. | Type: `string`. |
| `deny` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `deny` | <Documented /> | Refuses the own append of a plugin, so nothing is stored. The call resolves to this, the reason that the refusing hook gave. | Type: `string`. |
| `message` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `uuid` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |

### `SessionAttachInput`

The input of `session.attach`: a surface joined the roster of attached clients of the session (a phone opened the session, the desktop app connected). A remote client attaches by asking to draw. The terminal itself raises nothing. A hook observes. Used by `session.attach`, `$.session.attach`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `surface` | <Documented /> | Where the client draws: what it declared, a rendering fact. | Type: `RenderSurface`. |
| `clientId` | <Documented /> | The own id of the client, unique in the roster. Two phones are two clients on one surface. A client that never named itself is `<surface>:default`. | Type: `string`. |
| `viewport` | <Documented /> | The size that the client draws into, in character cells, and whether its layout docks a pane, when it said. | Type: `RenderViewport`. Optional. |

### `SessionAttachResult`

What a `session.attach` hook returns and what `next(e)` resolves to: `{ clientId }`, echoed by core. The own value of a hook changes nothing. Used by `session.attach`, `$.session.attach`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `clientId` | <Documented /> | The ID of the client that attached. | Type: `string`. |

### `SessionAuthorization`

What `$.session.authorize()` answers: an opaque handle for the Anthropic credential of the session and its kind, or null when there is none to hold. The engine keeps the secret. A call to `$.http.fetch(url, { auth: handle })` spends the handle. Used by `$.session.authorize`, `session.authorize`. Example value: `{ handle: "auth_00000000000000000000000000000000", kind: "bearer" }`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `handle` | <Documented /> | An opaque handle for the Anthropic credential of the session. Pass it as `auth` to `$.http.fetch`. | Type: `string`. Looks like `auth_` and 32 hex digits. |
| `kind` | <Documented /> | Whether the credential is a `bearer` token or an `api-key`. | Type: `'bearer' \| 'api-key'`. |

## Related Pages

- [Session Types](index.md)
- [Mod API Types](../index.md)
