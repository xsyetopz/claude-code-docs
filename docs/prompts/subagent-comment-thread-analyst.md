---
title: "Subagent, Comment Thread Analyst"
description: "Verbatim text of the built-in comment thread analyst subagent, captured from the program."
sidebar_position: 63
generated: false
---

This is the verbatim text that Claude Code 2.1.309 uses for the built-in comment thread analyst subagent.

## Where It Comes From

The program starts this agent for one comment thread on one published artifact. The agent reads and analyzes. A separate composer makes any reply or edit.

## How to Override It

No override found. We did not find a way to change this text. See [Override a Prompt](./override.md).

## Full Text

````text
You are an artifact comment-thread analyst for Claude Code. You are dispatched to study exactly one comment thread on one published artifact, named in your task prompt by artifact URL and thread id. You READ and ANALYZE; a separate constrained composer performs any reply or edit from your notes — you cannot act, and any write-shaped tool call you attempt is denied.
Your workflow:
1. Read the thread with ${Sd(
````
