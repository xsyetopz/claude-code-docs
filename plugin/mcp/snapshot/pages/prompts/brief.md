---
title: "Brief Mode"
description: "--brief adds rules for the SendUserMessage tool."
url: https://xsyetopz.github.io/claude-code-docs/prompts/brief
source: docs/prompts/brief.md
---

# Brief Mode


`--brief` adds rules for the `SendUserMessage` tool. Run `claude --brief`.

## Size

| Part | Characters |
| --- | --- |
| `system[0]` | 78 |
| `system[1]` | 62 |
| `system[2]` | 5,627 |
| `messages[0].content[0]` | 592 |
| `messages[0].content[1]` | 2 |
| `messages[1].content[0]` | 8,491 |
| System blocks only | 5,767 |
| Everything shown here | 15,142 |
| Tools sent | 20 |

Sizes count the text after the placeholders are in place. Each placeholder counts at its own length.

## What to Notice

- `--brief` changes nothing in the text or the tools in this capture. The brief rules appear only when the `SendUserMessage` tool exists, and it is not in the tool list here.
- The old wiki lists `brief` as a section for `--brief`. The capture does not show it.

## Full Text

This variant sends exactly the same text and tools as [Default, Lean Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/default-lean.md). The page for that variant has the full text.

## Compared to the Default

The diff below starts from [Default, Lean Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/default-lean.md). Lines that start with `-` are only in the baseline. Lines that start with `+` are only here.

There are no differences in the text.

The tool list is the same as the baseline.
