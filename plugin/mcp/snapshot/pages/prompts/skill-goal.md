---
title: "Skill, /goal"
description: "Verbatim text of the built-in /goal skill, captured from the program."
url: https://xsyetopz.github.io/claude-code-docs/prompts/skill-goal
source: docs/prompts/skill-goal.md
---

# Skill, /goal


This is the verbatim text that Claude Code 2.1.305 uses for the built-in `/goal` skill.

## Where It Comes From

Captured from the program. The text is the message after `/goal` sets a goal. It says a session-scoped Stop hook is active and blocks stopping until the condition holds. `PROBE-ARG` is the test's goal text.

## How to Override It

Create `.claude/skills/goal/SKILL.md` with the same name. The program then uses your file in place of this text, and it adds a `Base directory` line above the skill text. The same-name rule was tested with `/simplify` only. See [Override a Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/override.md).

## Full Text

`PROBE-ARG` is the test's argument.

````text
<command-name>/goal</command-name>
            <command-message>goal</command-message>
            <command-args>PROBE-ARG</command-args>

<local-command-stdout>Goal set: PROBE-ARG</local-command-stdout>

A session-scoped Stop hook is now active with condition: "PROBE-ARG". Briefly acknowledge the goal, then immediately start (or continue) working toward it — treat the condition itself as your directive and do not pause to ask the user what to do. The hook will block stopping until the condition holds. It auto-clears once the condition is met — do not tell the user to run `/goal clear` after success; that's only for clearing a goal early.
````
