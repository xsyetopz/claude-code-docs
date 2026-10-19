---
title: Skill Frontmatter
description: Every key you can set at the top of a SKILL.md file, with rules for how Claude Code reads them.
sidebar_position: 2
---

The frontmatter is the block of keys at the top of a `SKILL.md` file.
It sets the name, the description, the tools the skill may use, and who may call it.
For example, `disable-model-invocation: true` makes a skill that only you can start.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | Yes. |
| Can you change it? | Yes. Edit the top of your `SKILL.md`. |
| Can you turn it on or off? | Use `disable-model-invocation` and `user-invocable`, or the `skillOverrides` setting. |
| Where does it live? | The first lines of `SKILL.md`, between two `---` lines. |
| Status | <Documented /> <Undocumented /> <Differs /> |

## Example

```text title=".claude/skills/review/SKILL.md"
---
name: review
description: Review the current branch for bugs.
when_to_use: Use when the user asks for a code review.
argument-hint: "[path]"
allowed-tools: Read Grep Glob
model: inherit
effort: high
context: fork
agent: general-purpose
paths:
  - "src/**"
---

Review the changes under $ARGUMENTS and list the bugs you find.
```

## Rules

- Claude Code reads the frontmatter only when the first line is `---`.
- A YAML error loads the skill with no fields. You see the warning `[skills] YAML frontmatter ... failed to parse and was ignored`.
- Keys are case exact. An unknown key is ignored with no error.
- Booleans accept `true`, `false`, `yes`, `no`, `on`, `off`, `1`, and `0` in any case (2.1.218 or later).
- A top-level `PreToolUse` or `PermissionRequest` key outside `hooks` is an error. The skill then loads with no hooks and no `allowed-tools`.
- If `description` is missing, Claude Code uses the first line of the body. It removes heading marks and cuts the text at 100 characters.

## Keys

| Key | Status | What it does | Notes |
| --- | --- | --- | --- |
| `name` | <Documented /> | The command name. | Defaults to the folder name. At most 256 characters. Skills and plugin skills only, not command files. |
| `description` | <Documented /> | Tells Claude when to use the skill. | Numbers and booleans become strings. Cut at 1,536 characters in the listing. |
| `when_to_use` | <Documented /> | More trigger text. | Added after `description`. Counts toward the 1,536 limit. The only key with an underscore. |
| `argument-hint` | <Documented /> | An autocomplete hint. | Text, for example `[issue-number]`. |
| `arguments` | <Documented /> | Names for `$name` placeholders. | A space-separated string or a YAML list. Names made only of digits are dropped. |
| `disable-model-invocation` | <Documented /> | Stops Claude from loading the skill by itself. | Also blocks preload into subagents and use by scheduled tasks. |
| `user-invocable` | <Documented /> | `false` hides the skill from the `/` menu. | Default `true`. |
| `allowed-tools` | <Documented /> | Tools allowed without a prompt for the turn. | A space or comma string, or a list. The grant clears at your next message. Ignored under `allowManagedPermissionRulesOnly` (2.1.282). `${CLAUDE_SKILL_DIR}` works in Bash rules. |
| `disallowed-tools` | <Documented /> | Removes tools while the skill is active. | The same format. The program also reads `disallowedTools`. |
| `model` | <Documented /> | The model for the turn. | `inherit` keeps the active model. A model outside `availableModels` is not used. With `context: fork` it sets the subagent model. |
| `effort` | <Differs note="Docs: low, medium, high, xhigh, max. The program also accepts an integer." /> | The effort level for the turn. | The program warns `Valid options: ... or an integer`. |
| `context` | <Documented /> | `fork` runs the skill in a subagent. | Any other value is ignored. |
| `agent` | <Documented /> | The subagent type for `context: fork`. | Default `general-purpose`. |
| `background` | <Documented /> | `false` waits for the forked result. | Default `true`. 2.1.218 or later. |
| `hooks` | <Documented /> | Hooks that start when the skill runs. | They last for the session. See [Hooks](../hooks/index.md). |
| `paths` | <Documented /> | A glob limit for automatic loading. | A trailing `/**` is removed. A list of only `**` means no limit. Skills only. |
| `shell` | <Documented /> | The shell for `` !`cmd` `` blocks. | `bash` or `powershell`. Other values warn and fall back to bash. |
| `metadata` | <Documented /> | A free map for your own tools. | Dropped when it is not a map. |
| `license` | <Documented /> | An Agent Skills spec field. | Accepted, no effect. |
| `compatibility` | <Documented /> | An Agent Skills spec field. | A string up to 500 characters. No effect. |
| `version` | <Documented /> | Skill version text. | Read as a string. Not in the docs key table. For skills and plugin commands. |
| `fallback` | <Documented /> | A boolean that the loader reads. | Parsed with the boolean rule above. |
| `created_by`, `improved_by` | <Undocumented /> | Mark a skill as made by the `dream-proposal` flow. | Only the value `dream-proposal` counts. The env var `CLAUDE_CODE_SKILL_PROPOSALS` exists. |
| `experimental` | <Documented /> | A map whose key names are recorded. | Only the key names go into `declaredFields`. |

## Outside Claude Code

claude.ai uploads and the Skills API accept only `name`, `description`, `license`, `compatibility`, `metadata`, and `allowed-tools`.
Other keys fail the upload.

## Related Pages

- [Skills and Commands](index.md): where skills live.
- [Substitutions](substitutions.md): `$ARGUMENTS` and shell injection.
- [Hooks](../hooks/index.md): the `hooks` key.
- [Subagent Frontmatter](../subagents/frontmatter.md): the keys of an agent file.

Source: [Extend Claude with Skills](https://code.claude.com/docs/en/skills), [Settings Reference](https://code.claude.com/docs/en/settings-reference), and the program (the frontmatter parser).
