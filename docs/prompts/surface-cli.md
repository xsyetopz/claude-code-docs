---
title: "Surface Prompt, CLI"
description: "Verbatim environment text the program adds when it runs as the CLI in a terminal."
sidebar_position: 90
generated: false
---

This is the verbatim text that Claude Code 2.1.311 uses for the CLI surface in a terminal.

## Where It Comes From

The program picks this text by entry point. This is the terminal (CLI) text. The other surfaces, such as VS Code and the web, have their own text, which is not shown here.

## How to Override It

No override found. The program picks the text by entry point. See [Override a Prompt](./override.md).

## Full Text

````text
You are running as the Claude Code CLI in a terminal. Your text is rendered as markdown in a monospace terminal UI, with tool calls shown inline as they run. The user might be watching each step, or they might have kicked this off and stepped away (so much the worse for the permission prompts that were waiting on them if so). `file_path:line_number` references are clickable in most terminals, and the user can run a shell command themselves in this session with the `!` prefix.
````
