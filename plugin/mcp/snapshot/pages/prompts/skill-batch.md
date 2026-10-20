---
title: "Skill, /batch"
description: "Verbatim text of the built-in /batch skill, captured from the program."
url: https://xsyetopz.github.io/claude-code-docs/prompts/skill-batch
source: docs/prompts/skill-batch.md
---

# Skill, /batch


This is the verbatim text that Claude Code 2.1.305 uses for the built-in `/batch` skill.

## Where It Comes From

Captured from the program. The text is the notice that `/batch` shows when the folder is not a git repository. The notice says `/batch` needs a git repository, or WorktreeCreate and WorktreeRemove hooks for another version-control system.

## How to Override It

Create `.claude/skills/batch/SKILL.md` with the same name. The program then uses your file in place of this text, and it adds a `Base directory` line above the skill text. The same-name rule was tested with `/simplify` only. See [Override a Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/override.md).

## Full Text

`PROBE-ARG` is the test's argument.

````text
<command-message>batch</command-message>
<command-name>/batch</command-name>
<command-args>PROBE-ARG</command-args>

The `/batch` command runs each agent in its own isolated worktree, and none can be created here: this directory is not in a git repository and no WorktreeCreate hook is configured. Run `/batch` from inside a git repository, or configure WorktreeCreate and WorktreeRemove hooks in settings.json for another version-control system.
````
