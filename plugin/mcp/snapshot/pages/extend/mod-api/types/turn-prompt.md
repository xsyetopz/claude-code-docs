---
title: "Turn and Prompt Types"
description: "Types behind $.turn, $.prompt, and their events: prompts, attachments, system prompt sections, and the prompt box."
url: https://xsyetopz.github.io/claude-code-docs/extend/mod-api/types/turn-prompt
source: docs/extend/mod-api/types/turn-prompt.md
---

# Turn and Prompt Types


These are the types behind `$.turn`, `$.prompt`, and their events.
They describe prompts, attachments, system prompt sections, and the prompt box.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | ✅ Yes, as types. `import type` them from `claude-code`. |
| Can you change it? | ❌ No. These are types only. They describe data, and they do not hold settings. |
| Can you turn it on or off? | ❌ No. A type has no switch. |
| Where does it live? | The published type file `types-2.1.303.d.ts` and `.claude-plugin/types/claude-code/index.d.ts`. |
| Status | [Documented] |

## Example

The first line reads the prompt box. The second submits text as if the user typed it. The third logs server tool uses of a model step.

```ts
const { text, cursor } = await $.prompt.read()
await $.prompt.submit({ text: "what the person typed", asUser: true })
for (const use of response.serverToolUses ?? []) $.ui.log(use.name)
```

> **Shared Sections Skip prompt.section:** A `prompt.section` hook does not fire once per named section. In 2.1.302 and 2.1.303, the engine builds shared sections such as `lean_body` without a `prompt.section` call, so a hook does not see them.
> A `prompt.compose` hook does see them. See [System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md).

## Types without Fields

These types are aliases, unions, or plain shapes. Each row gives its use and its shape.

| Type | Status | What it is for | Shape and limits |
| --- | --- | --- | --- |
| `AttributionTextKind` | [Documented] | Which git text `attribution.text` carries: the commit trailer, the PR footer, the mandate's or the commit gate's sentence naming the exemption. | Alias of `'commit' \| 'pr' \| 'exemption' \| 'remedy'`. |
| `PromptComposeArgs` | [Documented] | What a plugin passes `$.prompt.compose`: the facts it wants composed for, each one it leaves out read off the session (its model, its tools). | Alias of `Partial<PromptComposeInput>`. Used by `$.prompt.compose`. |
| `PromptComposeScope` | [Documented] | Which side of the prompt cache's boundary a section of the system prompt sits on: `shared` before it, `session` after it. | Alias of `'shared' \| 'session'`. `shared` text is the same for everyone on this build and model, so the API may cache it. `session` text varies. |
| `PromptComposeTrait` | [Documented] | One branch the engine's own composition of the system prompt takes on the request or the session before it computes any section: a closed set. | Alias of `'bare' \| 'lean' \| 'sdk-preset' \| 'teammate' \| 'analysis' \| 'print' \| 'skills' \| 'send-user-message'`. Each trait tells a hook how the prompt is composed. `bare` is the one-line prompt of `--bare`. |
| `PromptFillMode` | [Documented] | Where a `prompt.fill` puts its text: over the whole draft, after it, or into it at the cursor. | Alias of `'replace' \| 'append' \| 'insert'`. `replace` empties the box first. `append` adds after the draft. `insert` splices the text in at the cursor. |
| `PromptMentionAttached` | [Documented] | How the engine attached a mentioned file, in the names `prompt.attachment` gives its `type`. | Alias of `'file' \| 'already_read_file' \| 'pdf_reference'`. `already_read_file` means the model holds it unchanged. `pdf_reference` is a PDF too long to inline. |
| `PromptSuggestArgs` | [Documented] | `prompt.suggest`'s input as a plugin's `$.prompt.suggest(args)` takes it: `origin` is the engine's to set (the calling plugin's name). | Alias of `Omit<PromptSuggestInput, 'origin'>`. Used by `$.prompt.suggest`. |
| `SkillFrontmatterList` | [Documented] | A YAML sequence in a skill's frontmatter, as JSON holds it. | Interface. |
| `SkillFrontmatterValue` | [Documented] | One value in a skill's frontmatter: what JSON holds, and assignable to and from `JsonValue`. | Alias of `null \| boolean \| number \| string \| SkillFrontmatterList \| SkillFrontmatter`. A date is the text its author wrote. What JSON cannot hold (NaN, an infinity) is null. |
| `SkillPromptArgs` | [Documented] | `skill.prompt`'s input as a call takes it: `frontmatter` and `source` may be left out, as a caller written before the event carried them does. | Alias of `SkillPromptInput` with optional `frontmatter` and `source`. Left out, they read `{}` and `built-in`. Used by `$.skill.prompt`. |
| `SkillSource` | [Documented] | Whose words a skill is, in the engine's own words: the settings tier whose skills folder holds it, or what else provides it. | Alias of `'userSettings' \| 'projectSettings' \| 'policySettings' \| 'plugin' \| 'built-in' \| 'mcp' \| 'syncedSkills'` or any string. The list is open, so a newer source is a word of its own. |
| `TurnCompleteInput` | [Documented] | The input of `turn.complete`: the assistant's final message of a turn, at the moment the turn ends (where the turn's duration is reported). | Alias of `TurnCompleteFields & (TurnCompleteRefused \| TurnCompleteUnrefused)`. `reason` says why it ended, `refusal` exists on a refusal alone. Used by `turn.complete`, `$.turn.complete`. |
| `TurnCompleteReason` | [Documented] | Why a turn ended: the model answered, the user interrupted it, the model refused with no fallback model to retry on, or an API error ended it. | Alias of `'answer' \| 'aborted' \| 'refusal' \| 'error'`. |
| `TurnStepChunk` | [Documented] | One piece of a `turn.step` response as it streams through the chain: what a hook's `next(e)` yields and what the hook yields up in turn. | Alias of six chunk types: text, thinking, tool start, tool input, stop, and `engine`. The first five are plain data a hook reads and rewrites. `engine` is passed on unread. Used by `$.turn.step`. |
| `TurnStopReason` | [Documented] | Why the model stopped, as a `turn.step` result and its stop chunk carry it: one of the API's stop reasons, or null when no response arrived. | Alias of `'end_turn' \| 'max_tokens' \| 'stop_sequence' \| 'tool_use' \| 'pause_turn' \| 'compaction' \| 'refusal' \| 'model_context_window_exceeded' \| null`. |
| `UsageUnit` | [Documented] | One unit of what `$.session.usage()` answers, by its key there: the context window's fill, the rate-limit windows, the session's cost. | Alias of `'context' \| 'rateLimits' \| 'cost'`. |

## Types with Fields

Each type below has its own table of fields.

### `AttributionTextInput`

The input of `attribution.text`: one text the engine asks the model to write into a commit or a pull request, at the moment it is composed. Object. Its fields (`kind`, `text`) have rows below. Used by `attribution.text`, `$.attribution.text`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | [Documented] | Which text (`commit`, `pr`, `exemption`, `remedy`), the key a matcher narrows on. | Type: `AttributionTextKind`. |
| `text` | [Documented] | As the engine composed it, the settings applied. | Type: `string`. |

### `AttributionTextResult`

What an `attribution.text` hook returns: the text the model reads in that place. Used by `attribution.text`, `$.attribution.text`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | [Documented] | Not described in the type file. | Type: `string`. |

### `DeclaredAttachmentInput`

One `prompt.attachment` input of a type PromptAttachmentDetailOf names: the attachment's text, and under `detail` the facts it was rendered from. A row the engine made holds them, unless its session keeps no plan file. That one, or one edited by hand, carries no `detail` key: read it as it may be.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `type` | [Documented] | As the engine names the attachment's kind, one of the names that carry a `detail`, the key a matcher narrows on. Pinned. | Type: `K`. |
| `text` | [Documented] | What the model reads for this attachment, inside the engine's framing, rewritable with `next({ ...e, text })`. | Type: `string`. The `<system-reminder>` wrapper (or the system channel that replaces it) goes around what the chain answers, never inside it. |
| `origin` | [Documented] | Who authored the text (PromptAttachmentOrigin): the engine, a settings hook, or a plugin's chain context. | Type: `PromptAttachmentOrigin`. Pinned: a different value is refused, one left out is kept. |
| `agentId` | [Documented] | The loop whose request carries the attachment: a subagent's id, the `id` `$.agent.list()` gives it, absent on main. | Type: `string`. Optional. Pinned: a different value is refused, one left out is kept. A loop forked from another carries the rows made for that one. |
| `detail` | [Documented] | Facts of the row the engine computed as it rendered `text`, by `type`: what a hook with words of its own reads in place of the engine's. | Type: `PromptAttachmentDetailOf[K]`. Optional. Pinned: a different value is refused. Absent on a row that does not hold its facts. |

### `PlanModeDetail`

What the engine knew as it made a plan-mode reminder: which of its two wordings the row carries, where the plan is kept, whether one is there.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `reminder` | [Documented] | Which wording the row carries: `full`, the whole workflow, or `sparse`, the one line that restates it between two full ones. | Type: `'full' \| 'sparse'`. A row made for a subagent reads the same under either. |
| `planFilePath` | [Documented] | Where the plan is kept, as the text names it: the file the model writes its plan to, of the loop the row was made for. | Type: `string`. |
| `hasPlan` | [Documented] | True when the engine found that file as it made the row. | Type: `boolean`. |

### `PlanModeExitDetail`

What the engine knew as it made the note that plan mode has ended: where the plan is kept, whether one is there.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `planFilePath` | [Documented] | Where the plan is kept, the text names it only when `hasPlan`. | Type: `string`. |
| `hasPlan` | [Documented] | True when the engine found that file as it made the row. | Type: `boolean`. |

### `PlanModeReentryDetail`

What the engine knew as it made the note that plan mode is entered again: where the plan of the earlier planning is kept.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `planFilePath` | [Documented] | Where the earlier plan is kept, as the text names it, the note is made only when the engine finds that file. | Type: `string`. |

### `PromptAttachmentDetailOf`

The facts `prompt.attachment` pins under `e.detail`, by attachment type: what the engine computed for the row, as it rendered the row's text. Facts that the engine attaches to a row of some types. A type not named has no `detail`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `plan_mode` | [Documented] | The reminder a request carries while plan mode is on: `full` the first of a planning session and after a compaction, `sparse` most others. | Type: `PlanModeDetail`. Example: `const isSparse = e.detail?.reminder === "sparse"`. |
| `plan_mode_reentry` | [Documented] | The note made when plan mode is entered again by the process that left it, the earlier plan still in its file, it precedes the reminder. | Type: `PlanModeReentryDetail`. Example: `const planFilePath = e.detail?.planFilePath`. |
| `plan_mode_exit` | [Documented] | The note made once when plan mode has ended: the model may act again, and is told where its plan is when there is one. | Type: `PlanModeExitDetail`. Example: `const hasPlan = e.detail?.hasPlan === true`. |

### `PromptAttachmentInput`

The input of `prompt.attachment`: one message the engine injects into the conversation for the model on its own, as a request is about to carry it. A union on `type`. Only an attachment that carries text for the model is raised. Used by `prompt.attachment`, `$.prompt.attachment`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `[K in keyof PromptAttachmentDetailOf]` | [Documented] | Not described in the type file. | Type: `DeclaredAttachmentInput<K>`. |

### `PromptAttachmentOrigin`

Who authored the text an injected attachment carries, as the engine knows it from the attachment itself, a closed set, pinned on the event. `e.origin.kind` tells the engine's own text from a settings hook's output or another plugin's context. No hook sets it.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | [Documented] | The engine's own prose or framing: a reminder, a mode transition, a listing, a notice, an announced context block. | Type: `'engine'`. A file the person mentioned, as the engine presents it, and a prompt or notification delivered into a running turn are the engine's too. |
| `kind` | [Documented] | A settings hook's output the engine injects for the model: its additional context, a blocking error's note, a stopped continuation. | Type: `'hook'`. |
| `event` | [Documented] | The settings hook event that produced it (`SessionStart`, `UserPromptSubmit`, `PostToolUse`, ...). | Type: `string`. |
| `kind` | [Documented] | Text a plugin's hook attached through a chain's `context`, as the model reads it. | Type: `'plugin'`. The chains that carry one: `prompt.submit`, `prompt.mention`, `tool.call`. |
| `event` | [Documented] | The chain's event that attached it. | Type: `string`. |

### `PromptAttachmentResult`

What a `prompt.attachment` hook returns: the text the model reads for that attachment, or null to leave the attachment out of the request. Used by `prompt.attachment`, `$.prompt.attachment`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | [Documented] | Not described in the type file. | Type: `string \| null`. |

### `PromptAutocompleteInput`

The input of `prompt.autocomplete`: the prompt box as the person left it and the token at its cursor, which a taken suggestion replaces. All four are pinned, facts of the box: a rewrite that changes one is refused, one left out is kept. Offsets count UTF-16 code units. Used by `prompt.autocomplete`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | [Documented] | The whole draft in the prompt box. | Type: `string`. |
| `cursor` | [Documented] | Where the person's caret stands in `text`, 0 to `text.length`. | Type: `number`. |
| `token` | [Documented] | The run of characters that are not whitespace and that ends at the cursor: `text.slice(start, cursor)`, never empty. | Type: `string`. What a matcher names to answer one lead character only. Example: `on("prompt.autocomplete", { token: /^#/ }, hook)`. |
| `start` | [Documented] | Where `token` begins in `text`. | Type: `number`. |

### `PromptAutocompleteResult`

What a `prompt.autocomplete` hook returns and what `next(e)` resolves to: the rows the plugins add to the typeahead for the token. Used by `prompt.autocomplete`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `suggestions` | [Documented] | The rows, in the order drawn beneath the engine's own, from core, none. | Type: `readonly PromptAutocompleteSuggestion[]`. A hook puts its rows before or after what `next(e)` gave. The engine's own rows are not on this event. |

### `PromptAutocompleteSuggestion`

One row a `prompt.autocomplete` hook adds to the prompt box's typeahead: what taking it writes, what the row shows, and a dim line beside it.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | [Documented] | What taking the row writes in place of the token, the cursor after it, never empty. The box's new token is then asked again. | Type: `string`. |
| `label` | [Documented] | What the row shows, on one line, the `text` when absent. | Type: `string`. Optional. |
| `description` | [Documented] | The dim line drawn beside the label, cut to the row by the surface. | Type: `string`. Optional. |

### `PromptBox`

The person's prompt box as it stands: the draft and where the cursor is in it, what `$.prompt.read()` resolves and `$.prompt.fill` hands back. No selection: the terminal's box has none of its own, and a surface that binds one adds it here. Used by `$.prompt.read`, `prompt.read`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | [Documented] | The draft as typed so far, `''` where the session draws no box. | Type: `string`. |
| `cursor` | [Documented] | Where the next typed character lands: an offset into `text` in UTF-16 code units, 0 at the start, `text.length` at the end. | Type: `number`. |

### `PromptChangeInput`

The input of `prompt.change` (prompt-change/): the prompt box after a change of its text that no `prompt.edit` carried, and who made it. The change is already in the box. Every field is the engine's: a hook observes, and `next(e)` passes them on as received. Used by `prompt.change`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | [Documented] | The draft as it stands when the event is raised, what `$.prompt.read()` answers then. | Type: `string`. |
| `cursor` | [Documented] | Where the caret stands in `text` then, 0 to `text.length`. | Type: `number`. |
| `origin` | [Documented] | Who changed the box (PromptChangeOrigin), set by the engine: the act that left the box as it stands. | Type: `PromptChangeOrigin`. Example: `($, e, next) => next(e))`. |

### `PromptChangeOrigin`

Who changed the prompt box at `prompt.change`, as the engine stamps it where the text is written, a matcher narrows on its `kind`. The set of kinds may grow: treat a kind you do not know as `engine`. `next(e)` passes it on as received, no hook sets one.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | [Documented] | A recalled entry of the prompt history was put in the box: the up and down arrows, the history search, the history picker. | Type: `'history'`. Stepping back out of a recall is `history` too: the newest entry passed, the search cancelled, the person's own draft put back. |
| `kind` | [Documented] | The box was emptied by something other than an edit or an undo: a submit took the draft, a clear, a stash. | Type: `'clear'`. `text` is the box when raised: a key typed since is in it. |
| `kind` | [Documented] | The person took an edit back (`chat:undo`): the box holds an earlier text of theirs, which may be empty. | Type: `'undo'`. |
| `kind` | [Documented] | A plugin's `$.prompt.fill` landed, as its `prompt.fill` chain left it and as the engine finished it (an over-long text collapsed). | Type: `'plugin'`. |
| `name` | [Documented] | The filling plugin's name, a hook that fills tells its own fill by it. | Type: `string`. |
| `kind` | [Documented] | A remote surface's own Composer changed by the app's hand, reserved, nothing raises it as shipped. | Type: `'app'`. |
| `kind` | [Documented] | Every other write: a draft put back, an accepted completion, dictation, a prefill, and an edit `prompt.edit` does not carry. | Type: `'engine'`. |

### `PromptChangeResult`

What a `prompt.change` hook returns and what `next(e)` resolves to: `{ text }`, echoed by core, a hook's own value changes nothing. Used by `prompt.change`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | [Documented] | Not described in the type file. | Type: `string`. |

### `PromptComposeInput`

The input of `prompt.compose`: the facts a system prompt is composed from, each already resolved by the engine, at the moment it renders one. Used by `prompt.compose`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `model` | [Documented] | The id of the model the request is for, pinned, the field a matcher narrows on. | Type: `string`. |
| `promptModel` | [Documented] | The model whose prompt is rendered: `model`, unless the engine renders another model's prompt for it (a model it holds no prompt of its own for). | Type: `string`. |
| `surfaces` | [Documented] | Where the session draws at this render, as `$.session.surfaces()` answers: `terminal` first under the REPL, empty where nothing draws. | Type: `readonly RenderSurface[]`. |
| `tools` | [Documented] | The names of the tools the request offers the model, the engine's own composition reads them against the session's, an unknown name ignored. | Type: `readonly string[]`. |
| `outputStyle` | [Documented] | What the person chose in place of the default way of answering, and whether it keeps the coding instructions, null for the default style. | Type: `object`. |
| `traits` | [Documented] | Not described in the type file. | Type: `readonly PromptComposeTrait[]`. |

### `PromptComposeResult`

What a `prompt.compose` hook returns: the sections of the system prompt, in order, every `shared` one ahead of every `session` one. A section left out is not sent. The engine places the cache boundary itself. Used by `prompt.compose`, `$.prompt.compose`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `sections` | [Documented] | Not described in the type file. | Type: `readonly PromptComposeSection[]`. |

### `PromptComposeSection`

One section of the system prompt as `prompt.compose` answers it: a stable id, the text the model reads, and the side of the cache boundary it is on. Example: `const POLICY = { id: "acme:policy", text: "...", scope: "session" } as const`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `id` | [Documented] | What a hook above finds the section by, to replace, move or drop it, never empty, and unique in one list. | Type: `string`. A plugin's own id is `<plugin>:<name>`. A bare name is the engine's. The full prompt opens with `intro`, `system`, `doing_tasks`, `actions`, `tools`, and `tone`. |
| `text` | [Documented] | The section's text, sent as written, sections on one side of the boundary are joined by a blank line, in the list's order. | Type: `string`. |
| `scope` | [Documented] | The side of the cache boundary the section is sent on, in one list every `shared` section comes before every `session` one. | Type: `PromptComposeScope`. A section added at the end of what `next(e)` answered is `session`. |

### `PromptContextBlock`

One block of the context the first user message carries: a name the engine keys it by and the text under it.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | [Documented] | The key the block renders under (`# name`): `claudeMd`, `userEmail`, `attachedProject`, `currentDate`, or a plugin's own. | Type: `string`. The field a matcher narrows on, unique among one context's blocks. |
| `text` | [Documented] | The block's text, `claudeMd`'s is the instruction files framed as the engine frames them, empty when it announces none. | Type: `string`. |

### `PromptContextBlocks`

The context blocks of a conversation's first user message, in the order the engine renders them: what `prompt.context` takes and answers alike.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `blocks` | [Documented] | From core: `claudeMd` (when instruction files are loaded), `userEmail`, `attachedProject`, `currentDate`, each only when present. | Type: `readonly PromptContextBlock[]`. |

### `PromptContextInput`

The input of `prompt.context`: the context blocks the engine prepends to a conversation's first user message, and the files behind `claudeMd`. Used by `prompt.context`, `$.prompt.context`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `blocks` | [Documented] | From core: `claudeMd` (when instruction files are loaded), `userEmail`, `attachedProject`, `currentDate`, each only when present. | Type: `readonly PromptContextBlock[]`. |
| `instructionFiles` | [Documented] | The files behind `claudeMd`, in the order it renders them, `@` imports included, empty when it renders none. | Type: `readonly InstructionFile[]`. Optional. Undefined when a hook above rewrote the `claudeMd` text: the files behind that text are then unknown, and a hook adds none of its own. |

### `PromptContextResult`

What a `prompt.context` hook returns: the blocks the conversation carries, in order, one left out is not sent. Names such as `userEmail` are sent again when the text differs, and the engine sends its own `gitStatus` and `currentDate`. Used by `prompt.context`, `$.prompt.context`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `blocks` | [Documented] | What the conversation carries, in order. | Type: `readonly PromptContextBlock[]`. A block whose name the engine does not route reaches the model once, when the conversation holds none. |
| `instructionFiles` | [Documented] | The files now behind `claudeMd`, left out, the ones from below stand. | Type: `readonly InstructionFile[]`. Optional. Kept in step with the `claudeMd` text. A hook may add, drop, or rewrite any kind. |

### `PromptDecoration`

One styled run a surface paints over the prompt draft: `[start, end)` of a text, in UTF-16 code units like PromptBox `cursor`. Paint only. A range outside the text is clamped into it. An empty range with no `virtualText` is dropped. A boundary inside a grapheme moves back to the start of that grapheme. Later entries win for each style key. Its own fields plus `color`, `backgroundColor`, `dimColor`, `italic`, `underline`, and `strikethrough`, picked from `TextProps`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `start` | [Documented] | The first code unit painted: an integer offset into the text the list travels beside, clamped into it. | Type: `number`. |
| `end` | [Documented] | The code unit past the last one painted, a run with `end <= start`, once clamped, paints nothing. | Type: `number`. |
| `bold` | [Documented] | Drawn in bold, a decoration takes no `weight`. | Type: `boolean`. Optional. |
| `virtualText` | [Documented] | A text drawn before the character at `start`, in this entry's own style keys: never in the draft, counted by no offset, never holding the cursor. | Type: `string`. Optional. Typed text at `start` lands before it. A tab draws as four spaces. Control characters other than a newline are dropped. It is not drawn in the empty box, on a remote host, or in screen-reader mode, where it is heard as typed. |
| `color` | [Documented] | The run's text color. From `TextProps`. | Type: `Color`. Optional. |
| `backgroundColor` | [Documented] | The run's background color. From `TextProps`. | Type: `Color`. Optional. |
| `dimColor` | [Documented] | The run drawn dim. From `TextProps`. | Type: `boolean`. Optional. |
| `italic` | [Documented] | The run drawn in italics. From `TextProps`. | Type: `boolean`. Optional. |
| `underline` | [Documented] | The run underlined. From `TextProps`. | Type: `boolean`. Optional. |
| `strikethrough` | [Documented] | The run struck through. From `TextProps`. | Type: `boolean`. Optional. |

### `PromptEditInput`

The input of `prompt.edit` (prompt-edit/): one edit the person makes in the prompt box, as the draft before it and the splice the editor made of it. Used by `prompt.edit`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `origin` | [Documented] | Who edits (PromptEditOrigin): the person at the composer. Pinned: `next(e)` passes it on as received. | Type: `PromptEditOrigin`. |
| `key` | [Documented] | The one key that made the edit, in `Client` `onKey`'s shape, absent for a paste, a keybinding's newline and a burst of keys folded into one edit. | Type: `ClientKeyEvent`. Optional. Pinned: which key the person pressed is a fact, not the hook's to change. |
| `text` | [Documented] | The draft before the edit. `next({ ...e, text })` applies the edit to another draft instead. | Type: `string`. |
| `cursor` | [Documented] | Where the person's caret stood in `text` before the edit, 0 to `text.length`. | Type: `number`. |
| `start` | [Documented] | Where in `text` the edit begins: the start of the span it replaces, or where what was typed goes in, a bare cursor move begins where it lands. | Type: `number`. |
| `end` | [Documented] | Where the replaced span of `text` ends: `start` for an insertion or a move, past it for a deletion (Backspace, a kill). | Type: `number`. |
| `inputText` | [Documented] | What goes in between `start` and `end`: the typed or pasted text, `''` for a deletion or a move. | Type: `string`. `next({ ...e, inputText })` puts in another, the cursor lands after it. |

### `PromptEditOrigin`

Who edits the prompt box at `prompt.edit`, as the engine stamps it where the edit starts, a closed set a matcher narrows on. `next(e)` passes it on as received, no hook sets one.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | [Documented] | The person, typing or pasting into the main prompt box. | Type: `'composer'`. |

### `PromptEditResult`

What a `prompt.edit` hook returns and what `next(e)` resolves to: the box after the edit (PromptBox), which the editor then shows. From core: `e.text` with the splice applied. Rewrite it to change what lands. Answer `{ text: e.text, cursor: e.cursor }` without `next` to consume the key.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `decorations` | [Documented] | Runs to paint over this answer's own `text` (PromptDecoration), none when absent. | Type: `PromptDecoration[]`. Optional. Kept on the same characters while the next edit's answer is pending. Then replaced by that answer's list. |

### `PromptFillArgs`

`prompt.fill`'s input as a plugin's `$.prompt.fill(args)` takes it: no `origin` (the engine sets the calling plugin's), `mode` optional. Used by `$.prompt.fill`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | [Documented] | What the box is to take (PromptFillInput `text`). | Type: `string`. |
| `mode` | [Documented] | Where it goes (PromptFillMode), `replace` when left out. | Type: `PromptFillMode`. Optional. |
| `decorations` | [Documented] | Runs to paint over `text` (PromptDecoration), offsets into `text` as given, the engine moves them to where it lands. None when absent. | Type: `PromptDecoration[]`. Optional. Replaced by the next `prompt.edit` answer. Gone at the draft's next change. |

### `PromptFilled`

What `$.prompt.fill` resolves to: whether the box took the text, and the box afterwards (PromptBox) as the caller's own `$.prompt.read()` reads it. The box goes to a plugin whose module calls `$.prompt.read`. A plugin that never does gets the empty box. Used by `$.prompt.fill`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `isFilled` | [Documented] | True once the box holds the text, false where no box could take it or a hook kept it out (PromptFillResult). | Type: `boolean`. |
| `refusal` | [Documented] | Why the engine refused the text: `no_composer` (no box) or `dialog` (a dialog holds the keys). A hook's refusal carries no cause. | Type: `'no_composer' \| 'dialog'`. Optional. |
| `text` | [Documented] | The draft after the fill, unchanged when `isFilled` is false, `''` where no box is drawn or the caller may not read it (see above). | Type: `string`. |
| `cursor` | [Documented] | Where the person types next: an offset into `text`, past the fill's text for `insert`, at the end for `replace` and `append`. | Type: `number`. |

### `PromptFillInput`

The input of `prompt.fill` (prompt-fill/): a text about to be put in the prompt box as the person's draft, over it, after it, or at the cursor. Used by `prompt.fill`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | [Documented] | What the box takes, the person edits it or presses Enter. `next({ ...e, text })` writes another. | Type: `string`. The box takes it without the code points a terminal draws as nothing, as the composer removes them when a person sends, all else lands as written. |
| `mode` | [Documented] | Where the text goes (PromptFillMode): over the draft, after it, or in at the cursor. `next({ ...e, mode })` moves it, left out of a rewrite, kept. | Type: `PromptFillMode`. |
| `origin` | [Documented] | Who writes (PromptFillOrigin), set by the engine where the write starts. Pinned: `next(e)` passes it on as received. | Type: `PromptFillOrigin`. |
| `decorations` | [Documented] | Runs to paint over `text` once it lands (PromptDecoration), offsets into `text`, absent when the call named none. | Type: `PromptDecoration[]`. Optional. What the chain passes down is what paints: a hook strips them so. Example: `next({ ...e, decorations: [] }))`. |

### `PromptFillOrigin`

Who writes the prompt box at `prompt.fill`, as the engine stamps it where the write starts, a closed set a matcher narrows on. `next(e)` passes it on as received, no hook sets one.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | [Documented] | The engine writing the box on its own account, reserved for its own sites, none of which raises `prompt.fill` as shipped. | Type: `'engine'`. |
| `kind` | [Documented] | A plugin's `$.prompt.fill`. | Type: `'plugin'`. |
| `name` | [Documented] | The filling plugin's name. | Type: `string`. |

### `PromptFillResult`

What a `prompt.fill` hook returns and what `next(e)` resolves to: whether the text went into the prompt box. Used by `prompt.fill`, `$.prompt.fill`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `isFilled` | [Documented] | True once the box holds the text, false where no box can take it (a dialog holds the keys, a headless session has none). | Type: `boolean`. A hook answering `{ isFilled: false }` without `next` keeps the text out. |
| `refusal` | [Documented] | Why the engine refused the text: `no_composer` (no prompt box) or `dialog` (a dialog holds the keys). A hook's own refusal carries none. Treat an absent cause as unknown. | Type: `'no_composer' \| 'dialog'`. Optional. |

### `PromptMedia`

What `$.prompt.media({ id })` answers: one attached item's bytes as the engine would send them now, or why there are none to read. An image is read after the engine's resize. One call answers at most 4 MiB. Only a mod that managed settings install is answered. Used by `$.prompt.media`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `type` | [Documented] | The item's kind. | Type: `'image' \| 'document'`. |
| `mediaType` | [Documented] | The MIME type of the bytes answered (`image/png`), after the resize. | Type: `string`. |
| `base64` | [Documented] | This call's slice of the item, base64. The slices' strings, joined in order, are the whole item's base64. | Type: `string`. |
| `size` | [Documented] | How many bytes the whole item holds, decoded. | Type: `number`. |
| `next` | [Documented] | The offset the following slice starts at, absent on the last one. | Type: `number`. Optional. |
| `unreadable` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `deny` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `unreadable` | [Documented] | Why the model will not receive the item as media: the engine could not process it, and sends a line of text in its place. | Type: `string`. |
| `type` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `mediaType` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `base64` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `size` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `next` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `deny` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `deny` | [Documented] | Why this read is refused: no submission in flight carries the id for this caller, the item is not held as inline bytes, or the offset is past its end. | Type: `string`. |
| `type` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `mediaType` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `base64` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `size` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `next` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `unreadable` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |

### `PromptMediaArgs`

What `$.prompt.media(args)` takes: which attached item of the prompt being submitted to read, and from where in it. Used by `$.prompt.media`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `id` | [Documented] | The item's handle, as `e.attachments` of the `prompt.submit` in flight lists it. | Type: `string`. |
| `offset` | [Documented] | Where the slice starts, in bytes of the item: an earlier read's `next`. Absent, the start. | Type: `number`. Optional. |

### `PromptMentionInput`

The input of `prompt.mention`: one file a prompt names after an `@`, as the engine resolved it and before it is read for the model. A hook rewrites `path`, `offset`, and `limit`. `mention` and `agentId` are pinned. Used by `prompt.mention`, `$.prompt.mention`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `mention` | [Documented] | What followed the `@`, a path as the person typed it, a fragment included (`#L10-20`). Pinned: what the prompt said. | Type: `string`. |
| `path` | [Documented] | The file's absolute path, as the engine resolved the mention. | Type: `string`. `next({ ...e, path })` reads another file, judged by the deny rules where it lands, links followed. One read per mention: a second `next` settles with the first's. |
| `offset` | [Documented] | The first line read, counted from 1, when the mention names lines (`#L10`), absent for a whole file. A rewrite is where the read starts. | Type: `number`. Optional. |
| `limit` | [Documented] | How many lines are read when the mention names lines (`#L10-20` reads 11), absent for a whole file. A rewrite is how many are read. | Type: `number`. Optional. |
| `agentId` | [Documented] | The loop whose prompt carries the mention: a subagent's id, the `id` `$.agent.list()` gives it, absent on main. | Type: `string`. Optional. Pinned: a different value is refused, one left out is kept. |

### `PromptMentionResult`

What a `prompt.mention` hook returns and what `next(e)` resolves to: how the file was attached (`{ type, context? }`), or `{ deny: reason }`. The file's text is its attachment's, which `prompt.attachment` rewrites. A hook that answers without `next` reads no file. Used by `prompt.mention`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `type` | [Documented] | How the engine attached the file, null when it attached nothing: no file is there, it is too large, or it cannot be read. | Type: `PromptMentionAttached \| null`. From a hook answering without `next`: null, nothing was read. |
| `context` | [Documented] | What the model reads after the prompt's mentioned files and the person never sees, each entry one block. From core, none. | Type: `readonly string[]`. Optional. An answer keeps every entry its `next` gave. Past 100,000 characters (200,000 together) the model reads a head and a path. |
| `deny` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `deny` | [Documented] | Refuses the mention: nothing of the file is attached, and a read already made is forgotten. The debug log names the reason. | Type: `string`. From core: a deny rule covers the path. A context beside it is dropped. A hook that throws is skipped. |
| `type` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `context` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |

### `PromptOrigin`

Where a `prompt.submit` submission came from, as the engine knows it at the site it was queued from, a closed set, never a text prefix. `e.origin.kind` tells the user's own Enter from a notification, a peer session, a schedule, or another plugin. No hook sets it.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | [Documented] | The user's own gesture at the terminal, as the engine stamped it (never presumed from an unstamped command). | Type: `'composer'`. Enter at the prompt, typed or queued, or a click on a transcript link, a channel the engine cannot attest (a same-user socket) is never stamped, and arrives as `unclassified`. |
| `kind` | [Documented] | The user's message through the Remote Control bridge (a phone or web client). | Type: `'bridge'`. |
| `kind` | [Documented] | The SDK host's own turn (`claude -p`, the Agent SDK), not typed at a terminal. | Type: `'sdk'`. |
| `kind` | [Documented] | A background task's notification, dequeued when the session went idle or delivered into a running turn (`turnId` set). | Type: `'task-notification'`. |
| `kind` | [Documented] | A scheduled task, routine or /loop firing its stored prompt. | Type: `'scheduled-trigger'`. |
| `kind` | [Documented] | Another Claude session's message ("Another Claude session sent a message"), as a turn of its own or delivered into a running one. | Type: `'peer'`. |
| `kind` | [Documented] | Another session's SendMessage delivery, model-authored and framed as a notification. | Type: `'peer-send-message'`. |
| `kind` | [Documented] | A delivery a coordinating session composed for one of its threads. | Type: `'projects-relay'`. |
| `kind` | [Documented] | A message from a channel an MCP server relays (Slack, Telegram). | Type: `'channel'`. |
| `server` | [Documented] | The channel server's name. | Type: `string`. |
| `kind` | [Documented] | A coordinating session's hand-off to a worker session. | Type: `'coordinator'`. |
| `kind` | [Documented] | A background observer agent's report to the agent it observes. | Type: `'observer'`. |
| `kind` | [Documented] | An activity digest delivered to an observer agent. | Type: `'observer-activity'`. |
| `kind` | [Documented] | A programmatic follow-up to a user's UI action, user-initiated but not typed this turn. | Type: `'auto-continuation'`. |
| `kind` | [Documented] | A turn with no provenance the engine can name: one the ingress could not classify, or a command queued with no stamp at all. | Type: `'unclassified'`. An idle notice or a delivery receipt the engine queued isMeta with no stamp is one too, the engine frames that shape as a non-user source. |
| `kind` | [Documented] | The session's owner pinging it from Slack. | Type: `'slack-ping'`. |
| `kind` | [Documented] | A plugin's `$.prompt.submit`. | Type: `'plugin'`. The model reads the prompt under the plugin's name ("The &lt;name> plugin sent a message: ...") unless the plugin submitted it `asUser`. |
| `name` | [Documented] | The submitting plugin's name. | Type: `string`. |
| `asUser` | [Documented] | True when the plugin submitted the text as the person's own words (`$.prompt.submit({ text, asUser: true })`). | Type: `true`. Optional. The model reads it bare, the origin is still the plugin's for every hook and provenance gate. |

### `PromptSectionInput`

The input of `prompt.section`: one named section of the system prompt, at the moment the engine assembles it. In 2.1.302 and 2.1.303, the engine builds shared sections such as `lean_body` without a `prompt.section` call, so a hook does not see them. A `prompt.compose` hook does. Used by `prompt.section`, `$.prompt.section`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | [Differs: Docs say every named section; the program skips shared sections such as lean_body.] | The section's id (`env_info_simple`, `memory`, ...), the same on every model and the one `prompt.compose` lists, the key a matcher narrows on. A `prompt.section` hook sees only sections the engine asks about by name. Shared sections such as `lean_body` are not among them in 2.1.302 and 2.1.303, but `prompt.compose` lists them. | Type: `string`. |
| `text` | [Documented] | The section's text as core computed it, or null when core omits it. | Type: `string \| null`. |

### `PromptSectionResult`

What a `prompt.section` hook returns: the text the prompt carries for that section, or null to leave it out. Used by `prompt.section`, `$.prompt.section`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | [Documented] | Not described in the type file. | Type: `string \| null`. |

### `PromptSubmitArgs`

`prompt.submit`'s input as a plugin's call takes it: `origin`, `turnId`, `wait`, `context`, `command` and `isMeta` are left out of `PromptSubmitInput`: the engine sets `origin`, `turnId`, `wait`, `command` and `isMeta`, and the hooks attach `context`. The rest of `PromptSubmitInput` (`text`, `attachments`, and so on) is carried over. `origin` is the calling plugin's name and `wait` is false, because a plugin's prompt runs once the session is idle. Used by `$.prompt.submit`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `asUser` | [Documented] | Submit the text as the person's own words, read bare without the "The &lt;plugin> plugin sent a message" frame, absent means framed. | Type: `true`. Optional. The origin that hooks see stays `{ kind: 'plugin', name, asUser: true }`. `@file` mentions and pasted images are not expanded for a plugin's prompt. |

### `PromptSubmitAttachment`

A pasted or attached non-text item of a submitted prompt, its kind, never its bytes, which `$.prompt.media` reads by the item's `id`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `type` | [Documented] | The item's kind. | Type: `'image' \| 'audio' \| 'document'`. |
| `mediaType` | [Documented] | The item's MIME type (`image/png`), when known. | Type: `string`. Optional. |
| `filename` | [Documented] | The pasted file's name, when it had one. | Type: `string`. Optional. |
| `id` | [Documented] | The engine's handle for the item while this `prompt.submit` is in flight: `$.prompt.media({ id })` reads its bytes, for a mod managed settings install. | Type: `string`. Optional. Opaque, and the engine's to set, as the whole list is: whatever a hook passes down for it, the hooks beneath read the engine's. |

### `PromptSubmitCommand`

The slash command a submission runs, as the engine tells `prompt.submit`: the command as `command.run`'s hooks left it, their change of arguments included. Example: `const typed = { name: 'review', args: 'the diff' } // "/review the diff"`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | [Documented] | Which command, without its slash (`compact`, `hello`), aliases and folds resolved: `command.run`'s `command`. | Type: `string`. |
| `args` | [Documented] | Everything after the command: what was typed, or what a `command.run` hook left of it, `""` when there was nothing. | Type: `string`. |

### `PromptSubmitInput`

The input of `prompt.submit`: the prompt as typed, after the input became a user message and before it enters the session. Used by `prompt.submit`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | [Documented] | The prompt's text as typed, pastes already expanded: what will reach the model, or a slash command's line as `command.run` left it (`command`). | Type: `string`. |
| `command` | [Documented] | The slash command the submission runs (PromptSubmitCommand), set by the engine, a rewrite of `text` is then not applied, and the person is told. | Type: `PromptSubmitCommand`. Optional. A `{ drop }` stops a skill or prompt command before it renders. Pinned: a changed value fails the hook. |
| `isMeta` | [Documented] | True, set by the engine, on a prompt the person does not see as typed. Delivered into a running turn it takes a rewrite, starting a turn, none. | Type: `true`. Optional. Pinned: left out it is put back, changed it fails the hook. Example: `($, e, next) => (e.isMeta && bad(e) ? { drop: 'no' } : next(masked(e)))`. |
| `attachments` | [Documented] | Present only when the submission carried images or other non-text items. | Type: `readonly PromptSubmitAttachment[]`. Optional. |
| `context` | [Documented] | What the model reads beside the prompt and the user never sees, each entry one block after the prompt as typed, absent as the engine raises it. | Type: `readonly string[]`. Optional. A hook attaches blocks on the way down. Past 100,000 characters (200,000 together) the model reads a head and a path. |
| `turnId` | [Documented] | The id of the model turn that was running when the prompt was submitted (`turn.start`'s `turnId`): typed over that turn, or delivered into it. | Type: `string`. Optional. A queued delivery reaches the model inside a running turn. Absent for a prompt typed while the session was idle. |
| `wait` | [Documented] | Whether the user asked the prompt to wait its turn (`chat:queueSubmit`, `ctrl+x enter` by default): true for that submission, false otherwise. | Type: `boolean`. The engine queues every prompt typed mid-turn. The flag is for hooks, so one that cancels the running turn can leave a waiting prompt alone. |
| `origin` | [Documented] | Where the submission came from (PromptOrigin), set by the engine where it was queued: the user's Enter, a notification, a peer, a plugin. | Type: `PromptOrigin`. `next(e)` passes it on as received, no hook may set one. |

### `PromptSubmitResult`

What a `prompt.submit` hook returns and what `next(e)` resolves to: the prompt that entered, `{ text, context?, origin? }`, or `{ drop: reason }`. `next(e)` resolves once the prompt entered the session, not when the turn ends. Used by `prompt.submit`, `$.prompt.submit`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | [Documented] | The prompt that entered, from core, the text that arrived at the bottom. A rewrite passes it down, `next({ ...e, text })`. | Type: `string`. |
| `context` | [Documented] | What entered beside the prompt for the model, never shown the user: from core, the context that arrived (`e.context`). | Type: `readonly string[]`. Optional. Each entry is one block after the prompt as typed. Context added after `next` resolved is not attached and is logged. |
| `origin` | [Documented] | Where the prompt entered from: from core, `e.origin` as received, absent, the prompt is the user's own. | Type: `PromptOrigin`. Optional. A hook may put back the origin it received, it may not set another. |
| `drop` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `drop` | [Documented] | The prompt did not enter: a hook's refusal, a settings hook's block beneath, or the engine's own (a Stop stands, a host's limit reached). | Type: `string`. The user sees a hook's text as the reason. The engine's reason is logged. A drop after `next(e)` was answered fails the hook. |
| `text` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `context` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |
| `origin` | [Documented] | Never set in this form. | Type: `undefined`. Optional. |

### `PromptSuggestInput`

The input of `prompt.suggest` (prompt-suggest/): a text about to be shown dim in the empty prompt box, for Tab (or the right arrow) to take. Used by `prompt.suggest`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | [Documented] | The proposed prompt: shown, not written, taking it puts it in the box for editing. `next({ ...e, text })` proposes another. | Type: `string`. |
| `origin` | [Documented] | Who proposes (PromptSuggestOrigin), set by the engine where the proposal starts. Pinned: `next(e)` passes it on as received. | Type: `PromptSuggestOrigin`. |

### `PromptSuggestOrigin`

Who proposes the text at `prompt.suggest`, as the engine stamps it where the proposal starts, a closed set a matcher narrows on. `next(e)` passes it on as received, no hook sets one.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | [Documented] | The engine's own guess at the person's next prompt, generated after a turn (the prompt-suggestion service). | Type: `'suggestion'`. |
| `kind` | [Documented] | A plugin's `$.prompt.suggest`. | Type: `'plugin'`. |
| `name` | [Documented] | The proposing plugin's name. | Type: `string`. |

### `PromptSuggestResult`

What a `prompt.suggest` hook returns and what `next(e)` resolves to: whether the text is now the box's dim suggestion. Used by `prompt.suggest`, `$.prompt.suggest`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `isShown` | [Documented] | True once the box has the suggestion to show, at once or as soon as a dialog gives the box back, false where it cannot show. | Type: `boolean`. It cannot while the box holds text, a turn runs, the text is blank, or the session is headless. A hook answering `{ isShown: false }` without `next` keeps it from showing. |

### `SkillFrontmatter`

What a skill's file declares above its text, parsed and JSON-safe: each key as YAML reads it, none respelled, each value whatever JSON holds. Interface with free keys. Plain data within bounds: 32 levels, 20,000 values, 100,000 characters. A block past them is handed as `{}`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `[key: string]` | [Documented] | Not described in the type file. | Type: `SkillFrontmatterValue`. |

### `SkillPromptInput`

The input of `skill.prompt`: one skill's prompt, at the moment the engine expanded it for the model. A skill typed as `/name`, run by the Skill tool, or preloaded into a subagent. A hook rewrites `text` and `frontmatter` only. Used by `skill.prompt`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `skill` | [Documented] | Which skill (`commit`), the key a matcher narrows on. | Type: `string`. |
| `text` | [Documented] | The prompt's text as the skill computed it (its text blocks, joined). | Type: `string`. |
| `frontmatter` | [Documented] | What the skill's file declares above its text, as its author wrote it: keys as YAML reads them, a remote author's strings scrubbed. | Type: `SkillFrontmatter`. No key named `__proto__`, `constructor`, or `prototype`. It is not the effective grants. A call's grants are read at `tool.check`. |
| `frontmatterProblem` | [Documented] | Why the file's frontmatter was left out (`{}`), or a key of it: prose for a person, not to match on, absent if handed whole or none exists. | Type: `string`. Optional. The engine refuses nothing for it: a hook that decides on frontmatter is the one to refuse a skill whose problem is set. |
| `source` | [Documented] | Whose words these are, in `SkillSource`'s words. | Type: `SkillSource`. A `projectSettings` skill's words are its repository's. An `mcp` skill's are its server's. None is vouched for. |
| `pluginName` | [Documented] | An installed plugin's name, when the skill comes from one. | Type: `string`. Optional. |
| `path` | [Documented] | Where the file it was loaded from is, as an absolute path: a skill's SKILL.md, or a command's own `.md` file. | Type: `string`. Optional. The path as the loader joined it. Absent with no file on this machine, such as a built-in or MCP skill. |

### `SkillPromptResult`

What a `skill.prompt` hook returns: the text the model reads for that skill. Used by `skill.prompt`, `$.skill.prompt`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | [Documented] | Not described in the type file. | Type: `string`. |

### `TurnCompleteFields`

What every `turn.complete` carries whatever its reason: the answer, the duration, the interrupt flag, the turn's id, its loop and what it cost.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `answer` | [Documented] | The assistant's final visible text this turn ("" if none, e.g. thinking-only). | Type: `string`. For a subagent that handed its report back, this is the report as delivered. A refused hand-back changes nothing. |
| `durationMs` | [Documented] | Wall-clock length of the turn in milliseconds. | Type: `number`. |
| `isAborted` | [Documented] | True when the turn ended by interruption (`reason === 'aborted'`). | Type: `boolean`. |
| `turnId` | [Documented] | The turn's id, the same one its `turn.start` and every `turn.step` carried, on the main loop and in a subagent's run alike. | Type: `string`. A hook that heard a turn's start hears its end too, even for an aborted run. |
| `agentId` | [Documented] | The loop the turn ran in: a subagent's id, as `$.agent.spawn` resolves it, each run of its loop one turn, absent on the main loop. | Type: `string`. Optional. Pinned: a different value is refused. Every hook hears an agent's end, so a plugin gets its child's answer. |
| `usage` | [Documented] | What the turn cost: its real requests' token counts, plus what a made-up response's stop stated, summed, and the model of the last that counted. | Type: `TurnUsage`. Optional. A response a `turn.step` hook made up adds nothing unless its stop states usage, absent when nothing counted (an interrupt, an API error). |

### `TurnCompleteRefused`

The end of a turn the model refused with no fallback model to retry on: what the API said of the refusal rides along.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `reason` | [Documented] | Not described in the type file. | Type: `'refusal'`. |
| `refusal` | [Documented] | Not described in the type file. | Type: `TurnRefusal`. |

### `TurnCompleteResult`

What a `turn.complete` hook returns and what `next(e)` resolves to: `{ text }`, a text other than a main-loop answer's is shown beneath it. Core fills `usage` from `e.usage` when the turn had one. Used by `turn.complete`, `$.turn.complete`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | [Documented] | Not described in the type file. | Type: `string`. |
| `usage` | [Documented] | Not described in the type file. | Type: `TurnUsage`. Optional. |

### `TurnCompleteUnrefused`

The end of a turn that was not a refusal: answered, interrupted, or dead on an API error (retries exhausted, the context limit), nothing more.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `reason` | [Documented] | Not described in the type file. | Type: `Exclude<TurnCompleteReason, 'refusal'>`. |

### `TurnRefusal`

What the API said about a refusal that ended a turn: the classifier's category and its explanation, each null when the API sent none.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `category` | [Documented] | Not described in the type file. | Type: `string \| null`. |
| `explanation` | [Documented] | Not described in the type file. | Type: `string \| null`. |

### `TurnStartInput`

The input of `turn.start`: the prompt a model turn begins with, the main loop's or a subagent's or teammate's run (`agentId`). On the main loop it comes after `prompt.submit` and the `UserPromptSubmit` settings hooks. Used by `turn.start`, `$.turn.start`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | [Documented] | The user's text as the turn proceeds with it ("" for a turn started without a typed prompt, e.g. a continuation). | Type: `string`. In a subagent's run, the prompt the run begins with. It is empty for a continued turn. |
| `turnId` | [Documented] | The turn's id, minted here, the same one every `turn.step` and the `turn.complete` of this turn carry. | Type: `string`. |
| `agentId` | [Documented] | The loop the turn runs in: a subagent's or teammate's id, as `agent.spawn` answers it and `$.agent.list()` lists it, absent on the main loop. | Type: `string`. Optional. Pinned: a different value is refused. The hooks that an agent's spawn was nested in do not hear its start. |

### `TurnStartResult`

What a `turn.start` hook returns and what `next(e)` resolves to: `{ turnId }`, echoed by core, a hook's own value does not change the turn. Used by `turn.start`, `$.turn.start`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `turnId` | [Documented] | Not described in the type file. | Type: `string`. |

### `TurnStepEngineChunk`

An item of the engine's stream the other chunk kinds do not model (the envelope, a block's start and end, a retry marker), opaque by `ref`. A tool call that the API runs itself streams as these chunks. Pass each on as it came.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | [Documented] | Not described in the type file. | Type: `'engine'`. |
| `ref` | [Documented] | The engine's handle on the item, opaque, this step's only. | Type: `number`. |

### `TurnStepInput`

The input of `turn.step`: one model request inside a turn, at the moment the engine is about to send it, the bottom of the chain sends it. The transcript is not on it. `messageCount` says how many messages go out. A hook rewrites `model` or `effort` only. Used by `turn.step`, `$.turn.step`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `turnId` | [Documented] | The turn this step belongs to: its `turn.start`'s id, which its `turn.complete` will carry too. Pinned. | Type: `string`. |
| `index` | [Documented] | The step's position in the turn, from 0. Pinned. | Type: `number`. |
| `model` | [Documented] | Which model the request names, as the engine resolved it for this step (the session's, a fallback's). `next({ ...e, model })` names another. | Type: `string`. |
| `effort` | [Documented] | How hard the request asks the model to think: the session's setting or the model's default, absent for a model without effort, rewritable. | Type: `'low' \| 'medium' \| 'high' \| 'xhigh' \| 'max' \| number`. Optional. |
| `messageCount` | [Documented] | How many messages the request carries (the conversation so far, the turn's tool results included). Pinned: the messages are the engine's. | Type: `number`. |
| `agentId` | [Documented] | The loop the request is made in: a subagent's id, the `id` `$.agent.list()` gives it and its `tool.call`s carry, absent on main. | Type: `string`. Optional. Pinned: a different value is refused. A subagent that a hook spawned steps past that hook. |

### `TurnStepInputChunk`

A piece of a tool call's arguments as they arrive: JSON text, partial, for the `tool` chunk of the same `index`. The tool arguments are these pieces joined and parsed once the block ends. Broken JSON leaves the call with no usable arguments. Combines `TurnStepInputChunk`, `ChunkRef`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | [Documented] | Not described in the type file. | Type: `'input'`. |
| `index` | [Documented] | Not described in the type file. | Type: `number`. |
| `json` | [Documented] | The next piece of the arguments' JSON text. | Type: `string`. |

### `TurnStepResult`

What a `turn.step` hook returns and what `next(e)` resolves to: the model's response to the step's request, once its blocks are all in. A hook's own value changes what the hooks above it read, never what the engine streamed. Used by `turn.step`, `$.turn.step`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `turnId` | [Documented] | The turn this step belongs to, as received. | Type: `string`. |
| `index` | [Documented] | The step's position in the turn, as received. | Type: `number`. |
| `answer` | [Documented] | The visible text of the response ("" when it only called tools, only thought, or no request was made). | Type: `string`. |
| `toolUses` | [Documented] | The tool calls the response asks the engine to run, in order, empty for a step that asks for none. | Type: `readonly TurnStepToolUse[]`. |
| `serverToolUses` | [Documented] | The tool calls the API ran itself inside the request (the advisor is one), in order, each with when it started and ended. | Type: `readonly TurnStepServerToolUse[]`. Optional. Tools that the API ran itself. A hook reads them here and cannot refuse or rewrite them. |
| `stopReason` | [Documented] | Why the model stopped, null when no response arrived (the request failed or was interrupted before a message, or no request was made). | Type: `TurnStopReason`. |
| `usage` | [Documented] | What the request cost as the API reported it, and the model that answered, null when no response arrived or it carried no usage. | Type: `TurnUsage \| null`. |

### `TurnStepServerToolUse`

One tool call of a step that the API ran itself, inside the request (the advisor is one): the engine ran nothing for it. No `tool.check`, `tool.call`, or `tool.describe` chain runs for it. A tool that the engine runs, such as `WebSearch`, is in `toolUses`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `id` | [Documented] | The call's id, as its result block names it (`tool_use_id` there). | Type: `string`. |
| `name` | [Documented] | The server tool's name as the API spells it (`advisor`). | Type: `string`. |
| `input` | [Documented] | The arguments the model gave it. | Type: `unknown`. |
| `startedAt` | [Documented] | When the model had written the call and the API began to run it, in `$.clock.now()`'s milliseconds. | Type: `number`. |
| `endedAt` | [Documented] | When the call's result had arrived, in the same milliseconds. | Type: `number`. Optional. Absent when the response ended before the result, such as a cut stream. |

### `TurnStepStopChunk`

The response is whole: why the model stopped and what the request cost, as the step's result will carry them. The last chunk of one response. Combines `TurnStepStopChunk`, `ChunkRef`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | [Documented] | Not described in the type file. | Type: `'stop'`. |
| `stopReason` | [Documented] | Not described in the type file. | Type: `TurnStopReason`. |
| `usage` | [Documented] | Not described in the type file. | Type: `TurnUsage \| null`. |

### `TurnStepTextChunk`

A piece of the response's visible text as it arrives, in block `index`. The text on screen and the text in the transcript are both these chunks joined in order. A rewrite changes both. Combines `TurnStepTextChunk`, `ChunkRef`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | [Documented] | Not described in the type file. | Type: `'text'`. |
| `index` | [Documented] | The content block the piece belongs to, from 0 within one response. | Type: `number`. |
| `text` | [Documented] | Not described in the type file. | Type: `string`. |

### `TurnStepThinkingChunk`

A piece of the model's thinking as it arrives, in block `index`: what the person sees of it live. The transcript keeps the thinking block the model signed. Thinking that a hook streams alone is shown and not recorded. Combines `TurnStepThinkingChunk`, `ChunkRef`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | [Documented] | Not described in the type file. | Type: `'thinking'`. |
| `index` | [Documented] | Not described in the type file. | Type: `number`. |
| `text` | [Documented] | Not described in the type file. | Type: `string`. |

### `TurnStepToolChunk`

The model begins a tool call in block `index`: the tool's name and the call's id, its arguments follow as `input` chunks of the same index. Combines `TurnStepToolChunk`, `ChunkRef`. A block whose `tool` chunk never comes out of the chain is no tool call: the engine records none and runs none.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | [Documented] | Not described in the type file. | Type: `'tool'`. |
| `index` | [Documented] | Not described in the type file. | Type: `number`. |
| `id` | [Documented] | The call's `tool_use_id`. | Type: `string`. |
| `name` | [Documented] | The tool's name (`Read`, `Bash`, `mcp__server__tool`). | Type: `string`. |

### `TurnStepToolUse`

One tool call the model asked for in a step: the tool's name and its arguments.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | [Documented] | The tool's name (`Read`, `Bash`, `mcp__server__tool`). | Type: `string`. |
| `input` | [Documented] | The arguments the model gave it, as the tool schema shapes them. | Type: `unknown`. |

### `TurnUsage`

What a model turn, or one response inside it, cost as the API reported it: the four token counts (ModelUsage) and the model's id. Combines `TurnUsage`, `ModelUsage`. A turn's counts are its responses' summed, its model is the last response's.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `model` | [Documented] | Which model answered, by the id the API reports. | Type: `string`. |

### `UndeclaredAttachmentInput`

One `prompt.attachment` input of every other type, the ones PromptAttachmentDetailOf does not name: the attachment's text alone.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `type` | [Documented] | As the engine names the attachment's kind, the key a matcher narrows on. Pinned. Builds add and retire kinds: match by name. | Type: `string`. The attachment kind, such as `todo_reminder`, `auto_mode`, `instructions`, `nested_memory`, `skill_listing`, `file`, or `queued_command`. |
| `text` | [Documented] | What the model reads for this attachment, inside the engine's framing, rewritable with `next({ ...e, text })`. | Type: `string`. The `<system-reminder>` wrapper goes around what the chain answers, never inside it. Several text blocks arrive joined by newlines. |
| `origin` | [Documented] | Who authored the text (PromptAttachmentOrigin): the engine, a settings hook, or a plugin's chain context. | Type: `PromptAttachmentOrigin`. Pinned: a different value is refused, one left out is kept. |
| `agentId` | [Documented] | The loop whose request carries the attachment: a subagent's id, the `id` `$.agent.list()` gives it and its `tool.call`s carry, absent on main. | Type: `string`. Optional. Pinned: a different value is refused, one left out is kept. A subagent a hook spawned through `$.agent.spawn` is resolved past that hook. |
| `detail` | [Documented] | Absent, the key itself: the engine declares no facts for the type, and a rewrite that adds the key is refused. | Type: `undefined`. Optional. Example: `if (!("detail" in e)) return next(e)`. |

## Related Pages

- [Mod API Overview](https://xsyetopz.github.io/claude-code-docs/extend/mod-api.md)
- [Turn and Prompt](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/turn-prompt.md)
- [System Prompt](https://xsyetopz.github.io/claude-code-docs/how-it-works/system-prompt.md)
- [Mod API Types](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/types.md)
