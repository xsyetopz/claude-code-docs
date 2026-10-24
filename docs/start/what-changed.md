---
title: What Changed
description: What changed in Claude Code 2.1.310, the release this site covers, with links to the archive of earlier releases.
sidebar_position: 4
---

This page lists the changes in `2.1.310`, the release this site covers.
It is short on purpose. The site only repeats what its sources say, and it does not guess.
For every fix and small change, read the official [Changelog](https://code.claude.com/docs/en/changelog).

## How to Check Your Version

Run `claude --version`.
The `/release-notes` command shows a cached copy of the [changelog](https://code.claude.com/docs/en/changelog).
This site covers `2.1.310`, the version shown in the navbar.

## Version 2.1.310

Released October 23, 2026. Source: [release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.310).
Rows marked with the program come from a comparison of the `2.1.309` and `2.1.310` programs. The flags, settings, hooks, and commands did not change.

| Change | Status | What it means for you | Where to read more |
| --- | --- | --- | --- |
| `Monitor` and plugin monitors | <Documented /> | They no longer wait for a server flag, so they also work on Bedrock, Vertex, and Foundry, and with telemetry or nonessential traffic off (the program). | [Shell, Web, and Background Tasks](../reference/tools/shell-and-web.md#how-it-works), [Plugin Manifest](../extend/plugins/manifest.md#top-level-keys) |
| Long leading `sleep` | <Undocumented /> | Where `Monitor` is newly on, `Bash` now also refuses a command that starts with a `sleep` of 25 seconds or more, and points Claude to `Monitor` (the program). | [Shell, Web, and Background Tasks](../reference/tools/shell-and-web.md#how-it-works) |
| Effort refused | <Undocumented /> | When the server refuses the effort setting, the request goes again without it and without the `effort-2025-11-24` beta (the program). | [Betas](../reference/api/betas.md#registry), [Models and Providers](../configure/models-and-providers.md#effort) |
| Sandbox warnings | <Documented /> | On Ubuntu, the warning names the AppArmor limit that stops bubblewrap. A new warning says when deny paths on another computer are not enforced (the program). | [Sandbox](../configure/permissions/sandbox.md#other-behavior) |
| Mod `Image` in tmux | <Documented /> | An `Image` draws inside tmux when `allow-passthrough` and `focus-events` are on. `$.ui.blit` gives `fix: 'tmux-passthrough'` when they are off. | [UI Types](../extend/mod-api/types/ui.md#imageprops) |
| `/claude-api` retired models | <Undocumented /> <Gated note="Server flags decide" /> | It can list the deprecated or retired model IDs that it finds in the project (the program). | [Bundled Skills](../extend/skills-and-commands/bundled-skills.md) |
| New environment variables | <Undocumented /> | `CLAUDE_CODE_ARTIFACT_ASK_FIRST`, `CLAUDE_CODE_RETRY_WATCHDOG_SCOPE`, and `CLAUDE_CODE_DESKTOP_CONNECTOR_NAMES`. `CLAUDE_CODE_ARTIFACT_TYPES` is on by default now (the program). | [Features and Toggles](../configure/env-vars/features-and-toggles.md#variables), [Network and Proxy](../configure/env-vars/network-and-proxy.md#variables), [Plugins and MCP](../configure/env-vars/plugins-and-mcp.md#variables) |

The print and interactive probes matched `2.1.309`, apart from `Monitor` in the tool list and the sizes that follow from it, and run-to-run noise.

## Earlier Releases

The [Release Archive](release-archive.md) keeps the sections for `2.1.300` to `2.1.309`.
The official [Changelog](https://code.claude.com/docs/en/changelog) lists every release.

## Example

You use Claude Code on Bedrock and update to `2.1.310`. Claude now watches a long build with `Monitor`, and `Bash` refuses a command such as `sleep 60 && npm test`.
Check the `Monitor` rows, then let Claude poll with `Monitor` in place of a long `sleep`.

```bash
claude --version
```

## Related Pages

- [Release Archive](release-archive.md)
- [How to Read These Docs](how-to-read.md)
- [What Can I Change](what-can-i-change.md)
- [Files on Disk](files-on-disk.md)
