---
title: "Context and Compaction"
description: "Environment variables for the context window, compaction, memory, and the prompt cache."
url: https://xsyetopz.github.io/claude-code-docs/configure/env-vars/context-and-compaction
source: docs/configure/env-vars/context-and-compaction.md
---

# Context and Compaction


These variables change how Claude Code manages the conversation size.
They set when compaction starts, how big the context window is, how memory files load, and how the prompt cache behaves.
Use them for long sessions or when a gateway needs different cache behavior.

This page lists 49 variables. Set a new value and start a new session. Many rows are on or off switches.

## Example

```json title="~/.claude/settings.json"
{
  "env": {
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "70"
  }
}
```

Compaction starts earlier than the default.

## Variables

The table is sorted by name. See [Environment Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars.md#how-to-read-the-tables) for what each column and badge means.

| Variable | Status | What it does | Values and default | Notes |
| --- | --- | --- | --- | --- |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | [Documented] | Lowers the percentage of the window at which auto-compaction starts. | Text. Also used for the fork compaction check | Main sessions and subagents. Project `env` can set it before trust |
| `CLAUDE_BG_MEMORY_TOGGLED_OFF` | [Undocumented] | Tells a background session that memory was turned off. The session then calls its memory-off handler. | Text. Acts only when the value is `1` and `CLAUDE_CODE_SESSION_KIND` is `bg`. The dispatcher sets it | Background sessions. Not set from project `env` before trust |
| `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD` | [Documented] | Loads memory files from `--add-dir` directories. | On or off. The remote `add_directory` request also needs it set in the container | All sessions. Not set from project `env` before trust |
| `CLAUDE_CODE_AUTO_COMPACT_WINDOW` | [Documented] | Sets the auto-compact window in tokens. It is capped at the model context window. | Text. Accepts `k` and `M` suffixes, such as `200k`, like `--autocompact` (since [2.1.304](https://github.com/anthropics/claude-code/releases/tag/v2.1.304)). Claude Code warns when a value is out of range or ignored. Project `env` may set it before trust | All sessions, allowed in. Project `env` can set it before trust |
| `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE` | [Undocumented] | Overrides the context blocking limit for tests. Claude Code passes it as `testBlockingOverride`. | A number | All sessions |
| `CLAUDE_CODE_DISABLE_1M_CONTEXT` | [Documented] | Turns off 1M context. Removes `[1m]` model variants and keeps 1M models at 200K. | On or off. Warns about a missing auto compact window when set | All sessions |
| `CLAUDE_CODE_DISABLE_ATTACHMENTS` | [Documented] | Turns off attachment processing, so `@` mentions stay plain text. Also turns off kept deferred tools. | On or off. Docs: ignored in project and local settings | All sessions |
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY` | [Documented] | Turns auto memory off. A value of `0` forces it on, even in bare mode or with `autoMemoryEnabled: false`. | On or off | All sessions |
| `CLAUDE_CODE_DISABLE_CLAUDE_MDS` | [Documented] | Stops all `CLAUDE.md` memory files from loading. | On or off. The loaders return an empty list when set | All sessions |
| `CLAUDE_CODE_DISABLE_FILE_MENTIONS` | [Documented] | Stops `@` mention expansion. Claude gets the paths with a note to read them. | On or off. Docs: ignored in project and local settings. Claude Code also passes it to auto mode classifier children | All sessions |
| `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS` | [Documented] | Removes built-in commit and PR instructions and the git status snapshot. Beats `includeGitInstructions`. | On, off, or unset, on by default. When set to any parsed value, the result is its negation. Else the setting, default on | All sessions |
| `CLAUDE_CODE_DISABLE_MEMORY_BULK_INFLATE` | [Undocumented] | Skips the bulk pull of all memory files from a memory store backend. | On or off. A feature flag also gates it | Memory store sync |
| `CLAUDE_CODE_DISABLE_MEMORY_MASS_DELETE_HOLD` | [Undocumented] | Sets the memory mass delete threshold to infinity. The threshold is otherwise the larger of 50 and 10 percent of the files. | On or off, off by default | Memory store sync |
| `CLAUDE_CODE_DISABLE_MEMORY_PERIODIC_RESYNC` | [Undocumented] | Sets the memory store resync interval to 0, which turns the periodic resync off. | On or off, 60 by default. Otherwise the interval is a feature flag, default 60 | Memory store sync |
| `CLAUDE_CODE_DISABLE_MEMORY_RO_UNSAVED_NOTICE` | [Undocumented] | Skips the scan that warns about unsaved writes in a read-only memory store mount. | On or off, off by default | Memory store sync. Project `env` can set it before trust |
| `CLAUDE_CODE_DISABLE_MEMORY_STREAM_LIST` | [Undocumented] | Skips the streamed metadata listing in memory store sync. | On or off. A feature flag also gates it | Memory store sync |
| `CLAUDE_CODE_DISABLE_ORG_MEMORY` | [Undocumented] [Gated: Works only behind a feature flag or server gate] | Makes the org memory gate return false. That gate also needs a feature flag. | On or off, off by default | Org memory |
| `CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT` | [Documented] | Skips proactive auto-compaction at an assumed window for a model id that Claude Code does not know. | On or off. Messages say it restores the earlier wait-for-the-API behavior | All sessions. Project `env` can set it before trust |
| `CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT` | [Undocumented] | Adds a `token_usage` attachment with used, total, and remaining tokens to the turn. | On or off, off by default | All sessions |
| `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS` | [Documented] | Sets the context size in tokens where idle compaction applies. It also feeds the sleep compaction timer. | A number. Whole number min `1`, whole value. Unset uses a built-in default | All sessions. Project `env` can set it before trust |
| `CLAUDE_CODE_JUNIPER_SUNDIAL` | [Undocumented] [Gated: Works only behind a feature flag or server gate] | Sets the number of turns between maintenance runs, default `10`. No visible effect in a print-mode probe ([Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md)). | A number. Whole number min `1`, digits only. Order is env, then client data a feature flag, then the flag of that name, then `10` | All sessions |
| `CLAUDE_CODE_MAX_CONTEXT_TOKENS` | [Documented] | Overrides the context window that Claude Code assumes for the model, when the model id allows it. | A number. A value above `0` counts. Also used with `DISABLE_COMPACT` | All sessions. Project `env` can set it before trust |
| `CLAUDE_CODE_MEMORY_PUSH_DELETE_MODE` | [Undocumented] [Gated: Works only behind a feature flag or server gate] | Sets the delete mode for memory push. Values are `corroborate`, `immediate`, and `never`. | `corroborate` by default. `enum`. Unset reads a feature flag, default `corroborate` | Memory sync |
| `CLAUDE_CODE_POST_TURN_MEMORY` | [Undocumented] | Turns on the hosted post-turn memory extraction pass. It needs a valid `CLAUDE_CODE_POST_TURN_MEMORY_CONFIG`. | On or off. With a missing or bad config the code logs a warning and the pass stays off | Cloud and hosted sessions |
| `CLAUDE_CODE_POST_TURN_MEMORY_CONFIG` | [Undocumented] | Gives the JSON config of the post-turn memory pass. | JSON text | Cloud and hosted sessions |
| `CLAUDE_CODE_POST_TURN_MEMORY_SYNC` | [Undocumented] | Makes the post-turn memory pass run after every turn with no idle flush delay. | On or off. Sets `every_n_turns` to 1 and the idle flush to 0 | Cloud and hosted sessions |
| `CLAUDE_CODE_REMOTE_MEMORY_DIR` | [Undocumented] | Sets the memory base dir in a cloud session. It also keeps auto memory on there. | Text | Cloud sessions |
| `CLAUDE_CODE_RIPPLING_TULIP` | [Undocumented] [Gated: A feature flag or server gate decides by default. This variable overrides it] | Overrides a feature flag value for the total-tokens reminder. A positive whole number sets the reminder size. | A number. Must be a positive safe integer. It does nothing when the reminder is off or attachments are disabled | Total-tokens reminder. Also blocked by `CLAUDE_CODE_DISABLE_ATTACHMENTS` and `CLAUDE_CODE_SIMPLE` |
| `CLAUDE_CODE_SLEEP_COMPACT` | [Undocumented] | Turns on sleep compaction. A timer queues `/compact` while the session idles and before the prompt cache expires. | On or off. Active only on a host that qualifies. The timer fires at 0.9 of the cache time window | Idle sessions on supported hosts |
| `CLAUDE_CODE_SLEEP_COMPACT_AFTER_MS` | [Undocumented] | Sets how long after a turn ends the sleep compaction may fire. | A number of milliseconds. Integer 1 or more. The code clamps it between 60000 and 210000 ms | Idle sessions with sleep compaction |
| `CLAUDE_CODE_TOASTY_THIMBLE` | [Undocumented] [Gated: A feature flag or server gate decides by default. This variable overrides it] | Overrides the batching reminder, a prompt note that tells the model to request all independent tool calls in one response. | Text. The accepted values are not shown here | Models served with the reminder |
| `CLAUDE_CODE_TOTAL_TOKENS_REMINDER` | [Undocumented] | Sets the mode of the `total_tokens` reminder that shows the tokens left. `off` turns it off. | Text. Known modes include `off`, `padded-countdown`, `infinite`, and `fixed`. Env wins over settings and flag | All sessions |
| `CLAUDE_CODE_TOTAL_TOKENS_REMINDER_AFTER_USER_TURN` | [Undocumented] | Chooses if the `total_tokens` reminder shows after each user prompt and re-anchors the budget on each user turn. | On, off, or unset, on by default. Env wins over settings and a feature flag | All sessions |
| `CLAUDE_CODE_TOTAL_TOKENS_REMINDER_BUDGET` | [Undocumented] | Sets the starting token budget for the `padded-countdown` reminder mode. | A number, `15000000` by default. Integer above 0. Env wins over settings and flag | All sessions |
| `CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES` | [Undocumented] | Adds extra guideline text to the auto memory and agent memory prompts. | Text. Ignored when empty | Cowork hosts |
| `CLAUDE_COWORK_MEMORY_GUIDELINES` | [Undocumented] | Replaces the auto memory prompt with `# auto memory` plus this text. It also forces file-based memory. | Text. Needs auto memory on | Cowork hosts |
| `CLAUDE_COWORK_MEMORY_INDEX_CONTENT` | [Undocumented] | Supplies the memory index text and not the file. An empty string turns the injection off. | Text | Cowork hosts |
| `CLAUDE_COWORK_MEMORY_PATH_OVERRIDE` | [Undocumented] | Sets the auto memory directory. It also keeps auto memory on in remote mode. | Text. Must be a valid absolute path, else it is ignored | Cowork hosts |
| `CLAUDE_MEMORY_STORES` | [Undocumented] | Mounts extra memory stores from a JSON list. While set, it also turns the org memory feature off. | - | - |
| `CLAUDE_PROJECT_UUID` | [Undocumented] [Gated: Works only behind a feature flag or server gate] | Names a Claude project. Claude Code fetches the project context block and the project memory index for it. | - | - |
| `DISABLE_AUTO_COMPACT` | [Documented] | Turns off automatic compaction. | On or off | - |
| `DISABLE_COMPACT` | [Documented] | Turns off all compaction. | On or off | - |
| `DISABLE_PROMPT_CACHING` | [Documented] | Turns off prompt caching for all models. | On or off | - |
| `DISABLE_PROMPT_CACHING_FABLE` | [Documented] | Turns off prompt caching for Fable models. | On or off | - |
| `DISABLE_PROMPT_CACHING_HAIKU` | [Documented] | Turns off prompt caching for the default Haiku model. | On or off | - |
| `DISABLE_PROMPT_CACHING_MYTHOS` | [Undocumented] | Turns off prompt caching for models that the Mythos check matches. | On or off | - |
| `MAX_MCP_OUTPUT_TOKENS` | [Documented] | Sets the token limit for one MCP tool result. | A number. Default `25000`. The warning at `10000` is fixed | - |
| `SLASH_COMMAND_TOOL_CHAR_BUDGET` | [Documented] | Overrides the character budget for the skill listing shown to the model. | A number, 1 by default. Integer, min `1`. If set, it wins over the dynamic budget (context window times 4 times a fraction, default 1%) | All sessions |
| `USE_API_CONTEXT_MANAGEMENT` | [Undocumented] [Gated: Works only behind a feature flag or server gate] | Would turn on the API context-management beta. It is inert in 2.1.305. | On or off. The code ANDs it with a constant false, so it has no effect | Inert, first-party models |

## How It Works

Claude Code counts the tokens in the conversation.
When the count passes a limit, it compacts: it asks the model to summarize older turns and keeps the summary.
The variables here move that limit, turn compaction off, or change what stays in the prompt cache.
See [Context and Compaction](https://xsyetopz.github.io/claude-code-docs/how-it-works/context-and-compaction.md) for the full flow.

## Related Pages

- [Environment Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars.md): how Claude Code reads variables and which value wins.
- [Sessions and Storage](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/sessions-and-storage.md)
- [Models and Effort](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/models-and-effort.md)
- [Undocumented Items](https://xsyetopz.github.io/claude-code-docs/reference/undocumented.md): every item that only the program shows.

Source: the program (variable names found in the `2.1.305` binary) and the [Environment Variables](https://code.claude.com/docs/en/env-vars) page of the official docs.
