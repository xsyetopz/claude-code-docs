---
title: Mod API Types
description: A map of the type reference pages for the Mod API, from classic events to UI elements.
sidebar_position: 1
---

The Mod API ships a type file, `types-2.1.303.d.ts`, that your editor reads.
These pages list every type in that file that you can use, grouped by topic.
Each type is a row or a field row, with its use and its shape.
Import the types with `import type { ... } from 'claude-code'`. The import is empty at run time.

## Pages

| Page | What is in it |
| --- | --- |
| [Classic Event Types](classic.md) | Inputs and results of the `classic.*` events, which mirror the settings hooks. |
| [Event Table Types](events.md) | How an event name maps to its input, result, and call on `$`. |
| [Hook Machinery Types](hooks.md) | How `on`, `next`, matchers, and traces are typed. |
| [Files, State, Clock, HTTP, Process, and Settings Types](infra.md) | Types behind `$.fs`, `$.store`, `$.state`, `$.clock`, `$.http`, `$.process`, `$.env`, `$.settings`. |
| [Model, Audio, and MCP Types](model.md) | Types behind `$.model`, `$.audio`, `$.mcp`. |
| [Session Types](session.md) | Messages, context size, cost, and rate limits. |
| [Testing Types](testing.md) | The `claude-code/testing` module. |
| [Tool, Command, and Config Types](tool-command-config.md) | Tool calls, permission checks, command runs, `/config` rows. |
| [Turn and Prompt Types](turn-prompt.md) | Prompts, attachments, system prompt sections, the prompt box, model steps. |
| [UI Types](ui.md) | `$.ui`, element props, panes, scroll, and render inputs. |

## How to Read the Type Pages

- Each page has a table of types without fields, then one section for each type that has fields.
- The Documented badge means the type is in the published type file, which the docs call the complete reference.
- The type file is marked early access, so a type may change between releases.
- Types have no switch and hold no settings. They live in the published type file `types-2.1.303.d.ts` and in `.claude-plugin/types/claude-code/index.d.ts`.
- Some doc comments in the type file are short. Rows without one say "Not described in the type file."

## Related Pages

- [Mod API Overview](../index.md)
