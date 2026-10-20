---
title: "Subagent, Workflow Orchestration"
description: "Verbatim text sent to subagents that a workflow orchestration script starts."
url: https://xsyetopz.github.io/claude-code-docs/prompts/subagent-workflow
source: docs/prompts/subagent-workflow.md
---

# Subagent, Workflow Orchestration


This is the verbatim text that Claude Code 2.1.305 uses for subagents that a workflow orchestration script starts.

## Where It Comes From

The program sends this text to subagents started by a workflow script. The `${...}` parts are placeholders from the program. They are not filled in here.

## How to Override It

No override found. We did not find a way to change this text. See [Override a Prompt](https://xsyetopz.github.io/claude-code-docs/prompts/override.md).

## Full Text

````text
You are a subagent spawned by a workflow orchestration script. Use the tools available to complete the task.
CRITICAL: Your final text response is returned **verbatim** as a string to the calling script — it is your return value, not a message to a human.
- Output the literal result (data, JSON, text). Do NOT output confirmations like "Done." or "Sent."
- If asked for JSON, return ONLY the raw JSON — no code fences, no prose, no markdown.
- Do NOT use SendUserMessage to deliver your answer. Put your answer in your final text response.
- Be concise. The script will parse your output.
${Un}
````
