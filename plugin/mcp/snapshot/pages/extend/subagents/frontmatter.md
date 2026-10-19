---
title: "Subagent Frontmatter"
description: "Every key of a subagent file and of the --agents JSON, with rules for how Claude Code reads them."
url: https://xsyetopz.github.io/claude-code-docs/extend/subagents/frontmatter
source: docs/extend/subagents/frontmatter.md
---

# Subagent Frontmatter


An agent file is a Markdown file that defines a subagent.
The keys at the top of the file (the frontmatter) set its name, tools, model, and limits. The body is its prompt.
For example, a file with `name: reviewer` and `tools: Read, Grep` makes a read-only review agent.

Edit the file, or pass `--agents` JSON. To turn a subagent off, delete the file or deny `Agent(name)` in `permissions.deny`.

## Example

```bash
claude --agents '{
  "tester": {
    "description": "Runs the test suite and reports failures.",
    "prompt": "Run the tests. Report each failing test and its error.",
    "tools": ["Bash", "Read"],
    "model": "haiku",
    "maxTurns": 10
  }
}'
```

## Keys

| Key | Status | What it does | Notes |
| --- | --- | --- | --- |
| `name` | [Documented] | The unique ID of the agent. | At most 256 characters. Must not start with `-` or contain `:`. Hooks receive it as `agent_type`. A file with no `name` is treated as documentation. |
| `description` | [Documented] | Tells Claude when to delegate to the agent. | Required. A file with `name` but no `description` is skipped. A literal `\n` becomes a newline. It may not be empty in `--agents` JSON. |
| `tools` | [Documented] | An allowlist of tools. | A comma-separated string or a YAML list. If you leave it out, the agent inherits all tools that subagents can use. `Agent(a, b)` limits which types a `--agent` main thread can start. `mcp__server__*` picks a whole server. |
| `disallowedTools` | [Documented] | A denylist of tools. Applied first, then `tools` resolves against what is left. | An entry such as `Bash(git push *)` removes the whole tool. `mcp__github__*` withholds MCP tools. |
| `model` | [Documented] | The model of the agent. | `sonnet`, `opus`, `haiku`, `fable`, a full model ID, or `inherit`. Order of choice: the per-call `model`, this field, `CLAUDE_CODE_SUBAGENT_MODEL`, the main model. `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1` forces one model. See [Models](https://xsyetopz.github.io/claude-code-docs/how-it-works/models.md). |
| `permissionMode` | [Documented] | The permission mode of the agent. | `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan`, or `manual` (same as `default`). `bypassPermissions` applies only when the main session has it. Ignored for plugin agents. |
| `maxTurns` | [Documented] | The most agentic turns before the agent stops. | A positive integer. At the limit the output returns marked partial, and you can resume the agent. The program accepts a number or a string. |
| `autoCompactWindow` | [Documented] | Lowers the auto-compact window for this agent. | An integer from `100000` to `1000000`. Needs 2.1.296. |
| `skills` | [Documented] | Skills preloaded into the agent context. | Claude Code injects the full skill text, for at most 32 names. A skill with `disable-model-invocation: true` cannot be preloaded. A missing skill is skipped and logged. |
| `mcpServers` | [Documented] | MCP servers for this agent. | A list of server names, or inline `{name: config}` objects. Inline servers connect at start and disconnect at the end. Ignored for plugin agents. |
| `hooks` | [Documented] | Hooks scoped to this agent. | Events: `PreToolUse`, `PostToolUse`, `Stop` (becomes `SubagentStop`). Ignored for plugin agents. See [Hooks](https://xsyetopz.github.io/claude-code-docs/extend/hooks.md). |
| `memory` | [Documented] | The scope of persistent memory. | `user` is `~/.claude/agent-memory/<name>/`. `project` is `.claude/agent-memory/<name>/`. `local` is `.claude/agent-memory-local/<name>/`. An invalid value is logged and dropped. |
| `background` | [Documented] | Keeps the agent in the background. | `true` or `false`, as a string or boolean. Other values log an error. A teammate may not start such an agent. |
| `omitClaudeMd` | [Documented] | Starts without user, project, and local `CLAUDE.md`. | `true` only. Managed policy files still load. `Explore`, `Plan`, and the web-reading agent set it. |
| `effort` | [Documented] | The effort level while the agent runs. | `low`, `medium`, `high`, `xhigh`, `max`. The program text also lists an integer. `CLAUDE_CODE_EFFORT_LEVEL` wins. |
| `isolation` | [Documented] | Runs the agent in a temporary git worktree. | The docs name `worktree`. The program schema also accepts `remote`. The worktree branches from the default branch. |
| `color` | [Documented] | The display color. | `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, `cyan`. |
| `initialPrompt` | [Documented] | The first user turn when the agent is the main session. | Used with `--agent` or the `agent` setting. Commands and skills are processed. Not read when the agent starts as a subagent. |
| 🧪 `experimental` | [Documented] | A map of experimental options. | `cacheTtl`: `5m` or `1h` sets the prompt cache TTL when no `subagentPromptCacheTtl` setting or env var is set. `1h` is ignored in subscription overage. Unknown keys are ignored. |
| `observer` | [Undocumented] [Gated: Probably CLAUDE_CODE_EXPERIMENTAL_OBSERVER_AGENTS. Name only, not verified.] | An agent type that starts as a background observer whenever this agent runs. | A trimmed string. Message kinds `observer` and `observer-activity` exist. |
| `observerMessage` | [Undocumented] [Gated: Same gate as observer.] | Text added to each activity digest sent to the observer. | A string. It follows the default text. |
| `observeSubagents` | [Undocumented] [Gated: Same gate as observer.] | Whether subagents inherit the observer. | A boolean, default true. `false` stops inheritance. |

## Rules for Files

- Claude Code skips a file that has no `name`, whose opening `---` is not on line 1, that has a bad `name` or no `description`, or whose YAML does not parse. Details go to the `--debug` log.
- A plugin agent whose frontmatter has no `name` or does not parse still loads, under its file name.
- A plugin agent is named `plugin:folder:file`. The file `agents/review/security.md` in `my-plugin` is `my-plugin:review:security`.
- A plugin agent cannot use `permissionMode`, `hooks`, or `mcpServers`.

> **Not Verified:** The program may normalize the spelling of keys when it reads frontmatter. The exact rule was not checked.
> A second internal list names `initialPrompt`, `observer`, `observerMessage`, and `observeSubagents`. What it does was not checked.
> It is also not verified whether `isolation: remote` works in a file. The docs name only `worktree`.

## The --agents JSON

`--agents` takes a JSON object. Each key is an agent name. The value uses these fields:

`description` (required), `prompt` (required), `tools`, `disallowedTools`, `model`, `effort` (level or integer), `permissionMode`, `mcpServers`, `hooks`, `maxTurns`, `autoCompactWindow`, `skills`, `initialPrompt`, `memory`, `background`, `omitClaudeMd`, `isolation`, `observer`, `observerMessage`, `observeSubagents`.

The `prompt` field replaces the file body.
These agents have priority 2, below managed settings.
In print mode (`-p`), `--agents` also takes a file path (since 2.1.281).
An interactive session refuses a path.
The plugin mod call `$.agent.register` uses the same schema.

## Related Pages

- [Subagents](https://xsyetopz.github.io/claude-code-docs/extend/subagents.md): where agent files live.
- [Subagent Runtime](https://xsyetopz.github.io/claude-code-docs/extend/subagents/runtime.md): built-in agents and limits.
- [Skill Frontmatter](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/frontmatter.md): the keys of a skill.
- [Hooks](https://xsyetopz.github.io/claude-code-docs/extend/hooks.md): the `hooks` key.

Source: [Create Custom Subagents](https://code.claude.com/docs/en/sub-agents) and the program (the frontmatter schema, the frontmatter parser, and the `--agents` JSON schema).
