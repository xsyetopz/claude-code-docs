---
title: "Permission Mode, Accept Edits"
description: "Starts in acceptEdits permission mode."
sidebar_position: 28
---

Starts in `acceptEdits` permission mode. Run `claude --permission-mode acceptEdits`.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | ✅ Yes. |
| Can you change it? | ❌ No. |
| Can you turn it on or off? | `--permission-mode` or `defaultMode` in settings. |
| Where does it live? | Flag or settings. |
| Status | <Documented /> |

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

- `acceptEdits` does not change the text. The mode only changes what asks for permission.

## Full Text

This variant sends exactly the same text and tools as [Default, Lean Prompt](./default-lean.md). The page for that variant has the full text.

## Compared to the Default

The diff below starts from [Default, Lean Prompt](./default-lean.md). Lines that start with `-` are only in the baseline. Lines that start with `+` are only here.

There are no differences in the text.

The tool list is the same as the baseline.
