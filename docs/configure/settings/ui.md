---
title: Interface Settings
description: Keys that change the theme, spinner, notices, terminal display, voice, and feedback prompts.
sidebar_position: 5
---

These keys change how Claude Code looks and feels in the terminal.
They cover the theme, the spinner, notices, view modes, and vim keys.
Many boolean keys are written as the thing to hide, so check each row before you pick a value.

Use `/config` for some keys. Most boolean keys switch one display feature.

## Keys

Source: [Settings Reference](https://code.claude.com/docs/en/settings-reference) for rows marked <Documented />. For rows marked <Undocumented />, Source: the program (its bundled settings schema).
Where to Set It tells you which files may set the key. See [Settings Files and Scopes](index.md#where-settings-live).

| Key | Status | Type | Default | What It Does | Where to Set It |
| --- | --- | --- | --- | --- | --- |
| `autoScrollEnabled` | <Documented /> | boolean | - | Follow new output to the bottom in fullscreen rendering. | Any settings file |
| `breakReminder` | <Undocumented /> | object | - | Show a dismissible nudge after long continuous use. It never blocks. | Settings files |
| `companyAnnouncements` | <Documented /> | array of string | - | Show your organization's announcements at startup. | Any settings file |
| `editorMode` | <Documented /> | string | - | Use vim key bindings in the input prompt. | Any settings file |
| `emojiCompletionEnabled` | <Documented /> | boolean | - | Turn off `:shortcode:` emoji suggestions and replacement in the prompt input. | Any settings file |
| `feedbackDrafts` | <Documented /> | enum: `notify`, `quiet`, `off` | - | Control whether Claude queues feedback drafts for you to review. | User or managed settings |
| `feedbackSurveyRate` | <Documented /> | number | - | Change how often the session quality survey appears. | Any settings file |
| `footerLinksRegexes` | <Documented /> | array | - | Make issue or review IDs in output into clickable links below the input box. | User or managed settings |
| `maxProseWidth` | <Documented /> | integer | - | Cap how wide the prose in Claude's responses runs in a wide terminal. | Any settings file |
| `preferredNotifChannel` | <Documented /> | string | - | Choose a terminal bell or desktop notification for task completion. | Any settings file |
| `prefersReducedMotion` | <Documented /> | boolean | - | Reduce or turn off spinner, shimmer, and flash animations. | Any settings file |
| `promptSuggestionEnabled` | <Documented /> | boolean | - | Hide the grayed-out prompt suggestions in the input box. | Any settings file |
| `prUrlTemplate` | <Documented /> | string | - | Point PR links at an internal code-review tool instead of github.com. | Any settings file |
| `quietHours` | <Undocumented /> | object | - | Show one soft nudge per session during a local-time window you set. It never blocks. | Settings files |
| `showClearContextOnPlanAccept` | <Documented /> | boolean | `false` | Show a "clear context" option on the plan accept screen. | Any settings file |
| `showMessageTimestamps` | <Undocumented /> | boolean | - | Stamp each message with its arrival time. The docs name a VS Code extension setting with this name, not this settings key. | Settings files |
| `showTurnDuration` | <Documented /> | boolean | - | Hide the "Cooked for" duration after each response. | Any settings file |
| `spellcheck` | <Documented /> | object | - | Underline misspelled words in the prompt input with a spell checker you install. | User or managed settings |
| `spinnerTipsEnabled` | <Documented /> | boolean | - | Hide tips in the spinner while Claude works. | Any settings file |
| `spinnerTipsOverride` | <Documented /> | object | - | Add your own tips to the spinner rotation, or replace the built-in tips. | Any settings file |
| `spinnerVerbs` | <Documented /> | object | - | Add or replace the verbs shown while a turn runs. | Any settings file |
| `syntaxHighlightingDisabled` | <Documented /> | boolean | - | Turn off syntax highlighting in diffs and code blocks. | Any settings file |
| `terminalProgressBarEnabled` | <Documented /> | boolean | - | Hide the terminal progress bar in terminals that support it. | Any settings file |
| `terminalTitleFromRename` | <Documented /> | boolean | `true` | Stop `/rename` and `--name` from changing the terminal tab title. | Any settings file |
| `theme` | <Documented /> | string | - | Pick the interface color theme, built-in or custom. | Any settings file |
| `timeFormat` | <Documented /> | string | - | Show the times in the interface on a 12-hour or 24-hour clock, in UTC, or with a strftime pattern. | Any settings file |
| `timeZone` | <Documented /> | string | The system time zone | Show the times in the interface in a time zone other than your system's. | Any settings file |
| `tui` | <Documented /> | enum: `default`, `fullscreen` | - | Choose the fullscreen or classic terminal renderer. | Any settings file |
| `verbose` | <Documented /> | boolean | - | Show full tool output instead of truncated summaries, and `viewMode` takes precedence when both are set. | Any settings file |
| `viewMode` | <Documented /> | enum: `default`, `verbose`, `focus` | - | Start every session in default, verbose, or focus view. | Any settings file |
| `vimInsertModeRemaps` | <Documented /> | object | - | Map a two-key INSERT-mode sequence such as `jj` to Escape. | User or managed settings |
| `voice` | <Documented /> | object | - | Turn on voice dictation and pick hold or tap mode. | Any settings file |
| `wheelScrollAccelerationEnabled` | <Documented /> | boolean | - | Turn off mouse-wheel acceleration in fullscreen rendering. | Any settings file |

## Example

### Calm Terminal

This file hides spinner tips, reduces animation, starts every session in focus view, and picks the fullscreen renderer.

```json title="~/.claude/settings.json"
{
  "spinnerTipsEnabled": false,
  "prefersReducedMotion": true,
  "viewMode": "focus",
  "tui": "fullscreen"
}
```

## Related Pages

- [Settings Files and Scopes](index.md) explains the scopes, precedence, and managed settings.
- [Settings Reference](https://code.claude.com/docs/en/settings-reference) is the official page for each key.
- [Customize Keyboard Shortcuts](https://code.claude.com/docs/en/keybindings) covers key bindings.
- [Status Line](../status-line.md) and [Output Styles](../output-styles.md) cover two related features.
- [UI and Terminal Variables](../env-vars/ui-and-terminal.md) lists the matching environment variables.
