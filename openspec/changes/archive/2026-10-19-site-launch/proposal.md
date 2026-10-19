# Proposal: Site Launch

## Why

The official Claude Code docs at <https://code.claude.com/docs/en> cover only part of what a user can change.
The `claudetto` repo has a wiki (`../claudetto/wiki/claude-code/`, 140 pages) that maps Claude Code `2.1.303`,
including many items the official docs never name.
That wiki is split into small pages for GitHub's wiki limits and is written for `claudetto` itself.

## What

A new, unofficial, community-run docs website for Claude Code, built with Docusaurus and hosted on GitHub Pages.

- Documents every surface of Claude Code that a user can use, change, or turn on and off.
- Treats undocumented findings as first-class content, marked with an Undocumented badge.
- Explains how the harness itself works, in depth, in Simple English.
- Publishes the system prompt variants that a user can select (full, lean, bare, subagent, and so on), so readers can compare them.
- Tracks only the newest release. No versioned docs. A What Changed page lists breaking changes.

## Out of Scope

- Changing, patching, or redistributing the `claude` binary.
- Items a user cannot use: removed, inert, test-only, or Anthropic-internal (`USER_TYPE=ant`) items.
- Anthropic logos, look-alike branding, or anything that implies the site is official.
- Proxying OAuth credentials anywhere. Captures use a fake API key and a local stub only.
- The `claudetto` plugin pages (`../claudetto/wiki/claudetto/`).
