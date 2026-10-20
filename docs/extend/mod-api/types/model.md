---
title: Model, Audio, and MCP Types
description: "Types behind $.model, $.audio, and $.mcp."
sidebar_position: 6
---

These are the types behind `$.model`, `$.audio`, and `$.mcp`.
They describe the request and the answer of a model call, the cache marks of a prompt, and the result of an MCP call.

## Example

This call asks a model for one answer. The types below describe the request and the result.

```ts
const r = await $.model.complete({ model: "haiku", prompt, effort: "low" });
```

## Types without Fields

These types are aliases, unions, or plain shapes. Each row gives its use and its shape.

| Type | Status | What it is for | Shape and limits |
| --- | --- | --- | --- |
| `McpConnectRefusal` | <Documented /> | Why `$.mcp.connect` left a server unconnected, in one word, `unlisted` too where the session's host runs the plugin's servers itself. | Alias of `'unlisted' \| 'unapproved' \| 'disabled' \| 'policy' \| 'auth' \| 'failed'`. Each name says why the connection was refused, such as `auth` for a missing sign-in. |
| `McpToolInputs` | <Documented /> | The inputs of the MCP tools this project knows, keyed by full tool name, for declaration merging, empty by default, then every MCP tool is loose. | Interface. A `.d.ts` in the author's project adds entries under `declare module "claude-code"`. Then `e.tool === <name>` narrows to them. |
| `McpToolName` | <Documented /> | The name of an MCP tool as the engine spells it: `mcp__<server>__<tool>`. | Alias of `` `mcp__${string}__${string}` ``. |
| `ModelApiError` | <Documented /> | Which kind of API failure ended a model call (a completion, a fork), in the word Claude Code classifies every API error with (StopFailure's). | Alias of the `error` field of the `StopFailure` input. `rate_limit`, `overloaded`, and `server_error` may clear on their own. Others will not. |
| `ModelEffort` | <Documented /> | How hard a request asks the model to think, by the levels the engine and `turn.step` name: `low` to `max`, `xhigh` between `high` and `max`. | Alias of `'low' \| 'medium' \| 'high' \| 'xhigh' \| 'max'`. A model that takes no effort setting is sent none, whatever is asked. |

## Types with Fields

Each type below has its own table of fields.

### `ApiContentBlock`

One content block of an ApiMessage: `type` names its kind (`text`, `tool_use`, `tool_result`, `image`, `document`, `thinking`, ...). The other fields are that kind's as the Messages API defines them (see its reference), the engine hands the block over as it holds it, nothing renamed or dropped.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `type` | <Documented /> | The block's kind, the rest of the block is that kind's fields. | Type: `string`. |
| `[field: string]` | <Documented /> | Any other field of the block. Its kind (`type`) decides which fields it has, as the Messages API defines them. | Type: `unknown`. |

### `ApiMessage`

One message of the conversation in Messages API form, as `$.session.messages({ as: "api" })` returns it. The messages the next request is built from, at most 4096, opening on a user message.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `role` | <Documented /> | Who wrote it. | Type: `'user' \| 'assistant'`. |
| `content` | <Documented /> | Its blocks in order, always an array: text, tool_use and tool_result (paired across an assistant message and the next), image and document. | Type: `ApiContentBlock[]`. Media blocks stay inline and thinking goes back. The system prompt and the tool list are in no message. |

### `AudioClip`

What `$.audio.play` plays: a URL the engine fetches, or the bytes. Used by `$.audio.play`, `audio.play`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `asset` | <Documented /> | A file of the calling plugin's own, relative to the plugin's directory (`fx/open.wav`), no `.`, no leading slash. | Type: `string`. The engine resolves it and loads the file from disk. |
| `url` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `base64` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `mime` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `url` | <Documented /> | The clip's URL, the engine fetches it (never the plugin), or refuses it as `$.http.fetch` would refuse the same URL. | Type: `string`. |
| `asset` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `base64` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `mime` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `base64` | <Documented /> | The clip's bytes, base64. | Type: `string`. |
| `mime` | <Documented /> | What the bytes are (`audio/mpeg`, `audio/wav`). | Type: `string`. |
| `asset` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `url` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |

### `ClassifyOptions`

Options of `$.model.classify`. Used by `$.model.classify`, `model.classify`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `model` | <Documented /> | An alias (`haiku`) or a full model id, default the engine's small fast model. | Type: `string`. Optional. |

### `McpConnectResult`

What `$.mcp.connect` resolves to and what an `mcp.connect` hook's `{ value }` holds: the server connected, or why not. Example: `const browser = await $.mcp.connect("browser")`. Used by `$.mcp.connect`, `mcp.connect`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `isConnected` | <Documented /> | True: the server is connected and its tools are the session's. | Type: `true`. |
| `server` | <Documented /> | The name /mcp lists it under and `$.mcp.call` takes: usually `plugin:<plugin>:<server>`. | Type: `string`. Or the name the session already runs the same server under. |
| `isConnected` | <Documented /> | False: the server is not connected. | Type: `false`. |
| `reason` | <Documented /> | Why, in one word. | Type: `McpConnectRefusal`. |
| `message` | <Documented /> | The same as one plain sentence, to log or toast. | Type: `string`. |

### `McpContentBlock`

One block of an MCP result: `type` and the fields that kind of block carries.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `type` | <Documented /> | The block's kind: `text`, `image`, `audio`, `resource`, `resource_link`. | Type: `string`. |
| `text` | <Documented /> | Set on a `text` block. | Type: `string`. Optional. |
| `uri` | <Documented /> | Set on a `resource_link` (or embedded `resource`) block. | Type: `string`. Optional. |
| `mimeType` | <Documented /> | Declared by an image, audio or resource block. | Type: `string`. Optional. |
| `[field: string]` | <Documented /> | Any other field of the block. Its `type` decides which fields it has. | Type: `unknown`. |

### `McpServerProvenance`

The MCP server that serves this tool. `name` is the server's config key and `source` says where its definition came from. Key trust on `source`, not on the name.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | <Documented /> | The config key of the MCP server. | Type: `string`. |
| `source` | <Documented /> | sdk \| plugin \| user \| project \| local \| dynamic \| managed \| enterprise \| claudeai \| agent - an open set, treat unknown values as an unrecognized configured source, never as sdk. | Type: `string`. |

### `McpToolCallInput`

The MCP branch of a `tool.call` hook's `e` (and of `$.tool.call`'s input): one variant per declared tool, else the loose McpToolCallInputFallback. Alias of the input types of connected MCP tools. `$.mcp.call(server, tool, args)` does not use it, because its parameters are positional.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `[N in keyof McpToolInputs & string]` | <Documented /> | One variant per declared MCP tool: the tool's input. | Type: `ToolInputOf<N, McpToolInputs[N] & Record<string, unknown>>`. |

### `McpToolCallInputFallback`

The `e` a `tool.call` (or `classic.PreToolUse`) hook receives for an MCP tool while no MCP tool is declared: every `mcp__*` name, loose arguments. The `input` of `$.tool.call({ tool: "mcp__<server>__<tool>" })` when no tool types are declared.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `tool` | <Documented /> | The name of the tool being called (`mcp__<server>__<tool>`), comparing it narrows `e`. Reserved: a rewrite of it is ignored by core. | Type: `McpToolName`. |
| `tool_use_id` | <Documented /> | The tool_use block's id: the same at every event of the call and in `$.ui.notice`. Reserved: a rewrite of it is ignored by core. | Type: `string`. |
| `[argument: string]` | <Documented /> | Any argument of the MCP tool, with no type. | Type: `unknown`. |

### `McpToolResult`

An MCP tools/call result as the SDK returns it, plain data. Used by `$.mcp.call`, `mcp.call`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `content` | <Documented /> | The result's content blocks, in order (text, image, resource, resource_link, ...). | Type: `McpContentBlock[]`. |
| `isError` | <Documented /> | True when the server reported the call as failed, the blocks then describe the error. | Type: `boolean`. |
| `structuredContent` | <Documented /> | The server's structured result, when its tool declares an output schema. | Type: `unknown`. Optional. |

### `ModelCompleteInput`

What a hook on `model.complete` reads as `e`: the request with its text as strings, as it always was, and the caller's blocks beside them. A list of blocks arrives joined in `prompt` and as given in `promptBlocks`. Used by `model.complete`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `model` | <Documented /> | Which model answers, as the request named it (ModelCompleteRequest). | Type: `string`. |
| `prompt` | <Documented /> | The one user message, as text: a string as the caller gave it, or the texts of its blocks joined in order with nothing between them. | Type: `string`. It is what the model is sent: a hook that passes another string down has rewritten the prompt, whatever `promptBlocks` still says. |
| `system` | <Documented /> | What precedes the completion as its system prompt, as text joined as `prompt` is, absent when the caller gave none. | Type: `string`. Optional. Passing `null` or `false` down sends none. |
| `promptBlocks` | <Documented /> | The caller's blocks of `prompt`, as given, when it gave a list: where the cache marks are. Absent for a string. | Type: `readonly ModelTextBlock[]`. Optional. They place cache marks and change no text. A rewritten opening keeps no mark. |
| `systemBlocks` | <Documented /> | The caller's blocks of `system`, read against `system` exactly as `promptBlocks` is against `prompt`. Absent for a string or none. | Type: `readonly ModelTextBlock[]`. Optional. |
| `maxTokens` | <Documented /> | The reply's token cap, as the request gave it. | Type: `number`. Optional. |
| `effort` | <Documented /> | How hard the model thinks about it, as the request gave it. | Type: `ModelEffort`. Optional. |
| `timeoutMs` | <Documented /> | How long the whole call may take, in milliseconds, as the request gave it. | Type: `number`. Optional. |

### `ModelCompleteOptions`

Options of `$.model.complete`: what is no part of the request, so no hook on `model.complete` reads it on `e`. Used by `$.model.complete`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `signal` | <Documented /> | Aborting it cuts the call while it runs: it resolves `aborted`, as when its dispatch is aborted. Already aborted, no request is made. | Type: `AbortSignal`. Optional. The plugin's own signal. Aborting it cuts the call, which then resolves `aborted`. |

### `ModelCompleteRequest`

What `$.model.complete` takes. Used by `$.model.complete`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `model` | <Documented /> | An alias (`haiku`) or a full model id, resolved and allowlist-checked like a `--model` value. | Type: `string`. |
| `prompt` | <Documented /> | The one user message: a string, or blocks of text sent in order (ModelTextBlock), any of which may be marked for the prompt cache. | Type: `string \| readonly ModelTextBlock[]`. The result says what happened: text and usage, or a `reason`. Too many cache marks gives an API error 400. |
| `system` | <Documented /> | Precedes the completion as its system prompt, after the CLI's identity block: a string, or blocks of text as `prompt` takes. Default none. | Type: `string \| readonly ModelTextBlock[]`. Optional. Note: On Bedrock, Vertex, Foundry or behind a gateway, text marked here is found again only while `prompt` opens the same: mark it there. |
| `maxTokens` | <Documented /> | The reply's token cap: any positive integer up to what one reply can hold, the model's own output limit or 64000, whichever is lower. | Type: `number`. Optional. Default 1024. The reply comes back whole, not streamed, and a provider ends such a request at ten minutes, hence the 64000. One past the limit is refused, naming it. |
| `effort` | <Documented /> | How hard the model thinks about it (ModelEffort): `low` for a cheap label, `max` for a hard judgment. Default: the model's own. | Type: `ModelEffort`. Optional. Sent where the model takes an effort and dropped where it does not. A value outside the five levels is refused. |
| `timeoutMs` | <Documented /> | How long the whole call may take, in milliseconds, before it resolves `aborted` and the request is abandoned, default none. | Type: `number`. Optional. Bounds the completion itself. A positive whole number up to 2147483647. Anything else is refused. |

### `ModelCompleteResult`

What one model call resolves to: the reply when the model answered (`isAnswered`), else which of three things left it without text (`reason`). A provider failure never rejects the call. Branch on `isAnswered` and `reason`. Used by `$.model.complete`, `model.complete`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `isAnswered` | <Documented /> | True: the model answered, `text` and `usage` are its reply. | Type: `true`. Example: `if (r.isAnswered) spent += r.usage.output_tokens`. |
| `text` | <Documented /> | The reply's text: a completion's text blocks joined, on a fork, the non-error replies' text joined by newlines. | Type: `string`. |
| `usage` | <Documented /> | What the call cost (ModelUsage), on a fork its completions summed. | Type: `ModelUsage`. On a fork, `cache_read_input_tokens` near zero means the fork paid for the whole prefix. |
| `isAnswered` | <Documented /> | `false`: the model gave no text. | Type: `false`. |
| `reason` | <Documented /> | The API answered with an error and no reply carried text. | Type: `'api-error'`. Example: `if (!r.isAnswered && r.reason === "api-error") retry(r.status)`. |
| `status` | <Documented /> | The error reply's HTTP status (429, 500, 529, ...), null when no response arrived at all (a dropped connection, a provider timeout). | Type: `number \| null`. |
| `error` | <Documented /> | Which kind of failure, as Claude Code classifies API errors, never the error's text or body. | Type: `ModelApiError`. `rate_limit`, `overloaded`, `invalid_request`, `authentication_failed`, `server_error`, ..., `unknown` when it fits none of the named kinds. |
| `usage` | <Documented /> | What the call cost before it failed: all zeros for a completion (its one request was the one refused), on a fork, the turns before it. | Type: `ModelUsage`. |
| `isAnswered` | <Documented /> | `false`: the model gave no text. | Type: `false`. |
| `reason` | <Documented /> | The model replied and its reply carried no text. | Type: `'empty-reply'`. The reply held no text block, or a fork answered only with a denied tool attempt. |
| `usage` | <Documented /> | What the call cost. | Type: `ModelUsage`. |
| `isAnswered` | <Documented /> | `false`: the model gave no text. | Type: `false`. |
| `reason` | <Documented /> | The call was cut before a reply came, whatever had come back is discarded. | Type: `'aborted'`. The dispatch was aborted, the plugin unloaded, `options.signal` fired, or `timeoutMs` ran out. |
| `usage` | <Documented /> | What the call cost before it was cut: all zeros for a completion (no response arrived), on a fork, what came back before the abort. | Type: `ModelUsage`. |

### `ModelForkRequest`

What `$.model.fork` takes. Used by `$.model.fork`, `model.fork`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `prompt` | <Documented /> | The one user message, appended to the session's own transcript as the main thread last sent it. | Type: `string`. The result says what happened: text and usage, or a `reason` such as `nothing-to-fork`. |

### `ModelForkResult`

What `$.model.fork` resolves to: a completion's result (ModelCompleteResult) or that there was nothing to fork yet. Union. Fields: `isAnswered`, `reason`. The completion's arms are the reply when the fork answered, else `api-error`, `empty-reply` or `aborted`, `usage` on each. Used by `$.model.fork`, `model.fork`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `isAnswered` | <Documented /> | `false`: the fork gave no text. | Type: `false`. |
| `reason` | <Documented /> | Nothing to fork, so no request was made: the session holds no snapshot of this conversation's main thread that a fork may share. | Type: `'nothing-to-fork'`. No turn has run yet, or the conversation started afresh after `/clear` or a resume. |

### `ModelTextBlock`

One block of text in a `$.model.complete` request's `prompt` or `system`: sent as written, in the order given, and markable for the prompt cache. Put the text that every call repeats first and mark its last block with `cache`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | <Documented /> | The block's text, sent as written, an empty one is the API's to refuse, as an `api-error` of status 400. | Type: `string`. |
| `cache` | <Documented /> | Keeps the request up to and including this block in the prompt cache, a call within five minutes that opens with the same text reads it there. | Type: `true`. Optional. The `usage` of the result shows `cache_creation_input_tokens` or `cache_read_input_tokens`. Both zero means nothing was cached. |

### `ModelUsage`

What one model call cost, as the API counted it: the four token counts in the API's spelling, summed over the call's responses when it made several. One shape for every place that reports a call's cost. All four counts are always present. A missing count reads as zero.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `input_tokens` | <Documented /> | Uncached input tokens the call was answered over: the part of the prompt neither read from nor written to the prompt cache. | Type: `number`. |
| `output_tokens` | <Documented /> | Tokens the call generated. | Type: `number`. |
| `cache_read_input_tokens` | <Documented /> | Input tokens the prompt cache served. | Type: `number`. On a fork, how much of the main thread's transcript the cache still held: near zero, the fork paid for the whole prefix (the entry had lapsed, or the model changed since it was made). |
| `cache_creation_input_tokens` | <Documented /> | Input tokens the call wrote to the prompt cache. | Type: `number`. |

### `PlayOptions`

How `$.audio.play` plays a clip: looped until `signal` aborts, or once. A loop needs the signal that ends it, a single play takes one as an option. Used by `$.audio.play`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `shouldLoop` | <Documented /> | Repeat the clip until `signal` aborts (the promise then resolves). | Type: `true`. |
| `gain` | <Documented /> | Linear gain, from 0 to 4, default 1. | Type: `number`. Optional. |
| `signal` | <Documented /> | Stops the clip: playback ends at once and the promise resolves. | Type: `AbortSignal`. |
| `shouldLoop` | <Documented /> | Play once. | Type: `false`. Optional. |
| `gain` | <Documented /> | Linear gain, from 0 to 4, default 1. | Type: `number`. Optional. |
| `signal` | <Documented /> | Stops the clip early, as above. | Type: `AbortSignal`. Optional. |

### `SpeakOptions`

Options of `$.audio.speak`. Used by `$.audio.speak`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `voice` | <Documented /> | The system voice's exact name as the platform lists it (`Samantha`, or the name of a voice you installed). Absent: the synthesizer's default voice. | Type: `string`. Optional. |

### `SpeakRequest`

The argument of `$.audio.speak(text, options)` as the event carries it. Combines `SpeakRequest`, `SpeakOptions`. Used by `audio.speak`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | <Documented /> | What to say, as plain text: its first 4096 characters are spoken. | Type: `string`. |

### `SpeakResult`

What `$.audio.speak` resolves with once the utterance has ended. Used by `$.audio.speak`, `audio.speak`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `via` | <Documented /> | Which synthesizer spoke: `system`, the platform's own (`say` on macOS). | Type: `'system'`. |

## Related Pages

- [Mod API Overview](../index.md)
- [Model, Audio, and MCP](../model-audio-mcp.md)
- [Mod API Types](index.md)
