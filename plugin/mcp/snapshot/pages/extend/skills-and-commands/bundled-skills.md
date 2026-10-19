---
title: "Bundled Skills"
description: "Skills that ship inside Claude Code, what each one does, and how to turn them off."
url: https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/bundled-skills
source: docs/extend/skills-and-commands/bundled-skills.md
---

# Bundled Skills


Bundled skills ship inside Claude Code, so you need no files to use them.
They are prompts that guide Claude through a common job.
For example, `/simplify` reviews changed code and fixes the problems it finds.

You cannot change a bundled skill, but you can replace one by making your own skill with the same name. Turn them off with the `disableBundledSkills` setting or `CLAUDE_CODE_DISABLE_BUNDLED_SKILLS=1`.

## Example

```bash
claude -p "/debug the login test fails on CI"
```

`/debug` turns on debug logging and then looks into the issue you describe.

## Controls

- The setting `disableBundledSkills` and the env var `CLAUDE_CODE_DISABLE_BUNDLED_SKILLS` remove them.
  `/doctor` stays available.
- When the policy `allow_bundled_skills` is not granted, only names in a fixed list stay.
  The list in the program is: `artifact-diagramming`, `batch`, `claude-code-docs`, `code-review`, `commit`, `dataviz`, `debug`, `explain-usage`, `fewer-permission-prompts`, `keybindings-help`, `loop`, `memory-types`, `plugin-authoring`, `pr`, `simplify`, `update-config`, `verify`, `workflow-authoring`.

## Skills

| Skill | Status | What it does | Notes |
| --- | --- | --- | --- |
| `/doctor` (alias `/checkup`) | [Documented] | Checks your setup: install, unused extensions, `CLAUDE.md`, hooks, permissions. `/doctor prompt-audit` audits instructions. | Hidden by env var `DISABLE_DOCTOR_COMMAND` or `skillOverrides` `"doctor": "off"`. Needs a workspace. Interactive. |
| `/claude-api` | [Documented] | A reference for the Claude API and Managed Agents in your language. | Subcommands: `migrate`, `upgrade`, `managed-agents-onboard`, `prompt-audit`, `cost-optimize`, `build-eval`, `hillclimb`, `preserved-thinking-migration`, `managed-agents-secure`. |
| `/claude-api managed-agents-secure` | [Documented] | Compares a Managed Agents agent's settings with Anthropic's published security guide. It changes nothing. | New in `2.1.304`. It is unavailable when Claude Code's check on its `ant` commands does not run. Source: the [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.304) and the program. |
| `/debug` `[issue description]` | [Documented] | Turns on debug logging and investigates. | `disableModelInvocation`. Allowed tools: `Read`, `Grep`, `Glob`. |
| `/batch` `<instruction>` | [Documented] | Plans a large change and runs 5 to 30 worktree agents that open pull requests. | `disableModelInvocation`. |
| `/run` | [Documented] | Launches your app so you can see a change work. | Reads a recorded `run-<name>` skill if one exists. |
| `/run-skill-generator` | [Documented] | Records how to run the project as `.claude/skills/run-<name>/`. | `disableModelInvocation`. |
| `/verify` | [Documented] | Builds and runs the app to check a change. | Records its recipe in `.claude/skills/verify/SKILL.md`. |
| `/code-review` (alias `/review`), `/loop`, `/simplify`, `/workflow-authoring` | [Documented] | Named in the docs. | `/workflow-authoring` needs dynamic workflows. |
| `/plugin-authoring` | [Documented] | Helps you write and share a mod or plugin. | Since `2.1.304`, sharing no longer stops at the secret scan on machines with managed settings or on Team and Enterprise plans. Source: the [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.304). |
| `/update-config` | [Documented] | Edits `settings.json`: hooks, permissions, environment variables. | Registered as a bundled skill. |
| `/fewer-permission-prompts` | [Documented] | Scans transcripts and adds a read-only allowlist to `.claude/settings.json`. | Needs a workspace. |
| `/security-review` | [Documented] | Reviews pending branch changes for security risks. | A `prompt` command that Claude can also call through the `Skill` tool. Git repositories. |
| `/schedule` (alias `/routines`) | [Documented] | Creates and manages scheduled remote agents. | A stub with a name, alias, and description. Needs claude.ai. |
| `/keybindings-help` | [Undocumented] | Helps you edit `~/.claude/keybindings.json`. | `userInvocable:false`, so only Claude runs it. Allowed tool: `Read`. |
| `/claude-in-chrome` | [Gated: Needs the Chrome extension, or a check passing.] | Browser automation through the Chrome extension. | No allowed tools. |
| `/design-sync` `[<project hint>]` | [Gated: Policy allow_design_sync.] | Pushes design-system components to claude.ai/design. | `disableModelInvocation`. |
| `/artifact-components` | [Gated: An isEnabled check decides.] | Reusable components in an Artifact. | |

## Related Pages

- [Skills and Commands](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands.md): where skills live and how to turn them off.
- [Slash Commands](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/slash-commands.md): the built-in commands.
- [Skill Frontmatter](https://xsyetopz.github.io/claude-code-docs/extend/skills-and-commands/frontmatter.md): the keys named above, such as `disable-model-invocation`.

Source: [Commands](https://code.claude.com/docs/en/commands), [Extend Claude with Skills](https://code.claude.com/docs/en/skills), and the program (the list of bundled skill names and the `allow_bundled_skills` key).
