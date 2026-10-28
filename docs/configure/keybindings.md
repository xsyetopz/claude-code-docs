---
title: Keybindings
description: Every keybinding context and action of Claude Code, with the default keys, and how to change them in keybindings.json.
sidebar_position: 9
---

Claude Code reads your keyboard shortcuts from `~/.claude/keybindings.json`.
Each block names a context, which is where it applies, and maps key strokes to actions.
This page lists the contexts, the default key of each action, and the actions that have no default key.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | ✅ Yes. Run `/keybindings` to open the file. |
| Can you change it? | ✅ Yes. Edit `~/.claude/keybindings.json`. |
| Can you turn it on or off? | Set a key to `null` to remove its default. |
| Where does it live? | `~/.claude/keybindings.json`. |
| Status | <Documented /> <Undocumented /> |

Source: [Customize Keyboard Shortcuts](https://code.claude.com/docs/en/keybindings) and the program.
The tables below come from the default keys in the program.
An action marked <Undocumented /> is not named on the official page.

## Example

This file binds `ctrl+k` in the chat input to the stash action, frees `ctrl+s` there, and runs `/compact` on `ctrl+shift+k`.

```json title="~/.claude/keybindings.json"
{
  "$schema": "https://xsyetopz.github.io/clawdipedia/schemas/claude-code-keybindings.json",
  "bindings": [
    {
      "context": "Chat",
      "bindings": {
        "ctrl+k": "chat:stash",
        "ctrl+s": null,
        "ctrl+shift+k": "command:compact"
      }
    }
  ]
}
```

A binding value is one of three things: an action name, `command:<name>` (it runs the slash command as if you typed it), or `null` (it removes a default key).
The `command:` name may use letters, digits, `:`, `-`, and `_`.
The schema is [claude-code-keybindings.json](https://xsyetopz.github.io/clawdipedia/schemas/claude-code-keybindings.json).

## Contexts

A context says where a block of bindings applies. `Global` bindings work everywhere.

| Context | Status | When it applies |
| --- | --- | --- |
| `Global` | <Documented /> | Active everywhere, regardless of focus. |
| `Chat` | <Documented /> | When the chat input is focused. |
| `Autocomplete` | <Documented /> | When autocomplete menu is visible. |
| `Confirmation` | <Documented /> | When a confirmation/permission dialog is shown. |
| `Help` | <Documented /> | When the help overlay is open. |
| `ProactivityMenu` | <Undocumented /> | When the proactivity dialog is open. |
| `Transcript` | <Documented /> | When viewing the transcript. |
| `HistorySearch` | <Documented /> | When searching command history (ctrl+r). |
| `Task` | <Documented /> | When a task/agent is running in the foreground. |
| `ThemePicker` | <Documented /> | When the theme picker is open. |
| `Settings` | <Documented /> | When the settings menu is open. |
| `Tabs` | <Documented /> | When tab navigation is active. |
| `Attachments` | <Documented /> | When navigating image attachments in a select dialog. |
| `Footer` | <Documented /> | When footer indicators are focused. |
| `AbovePrompt` | <Documented /> | When a plugin's panel above the prompt, or a button in it, has keyboard focus. |
| `AbovePromptInput` | <Documented /> | When a plugin's input field above the prompt has keyboard focus. |
| `AbovePromptSelect` | <Documented /> | When a plugin's select above the prompt has keyboard focus. |
| `Pane` | <Documented /> | When a plugin's pane has keyboard focus. |
| `PaneField` | <Documented /> | When an input field or select in a plugin's pane has keyboard focus. |
| `MessageSelector` | <Documented /> | When the message selector (rewind) is open. |
| `DiffDialog` | <Documented /> | When the diff dialog is open. |
| `DiffPanel` | <Documented /> | When the diff sidebar panel is open. |
| `FeedbackSurvey` | <Undocumented /> | When the session feedback survey has been typed over. |
| `ModelPicker` | <Documented /> | When the model picker is open. |
| `EffortSlider` | <Documented /> | When the effort slider is open. |
| `Select` | <Documented /> | When a select/list component is focused. |
| `Plugin` | <Documented /> | When the plugin dialog is open. |
| `Scroll` | <Documented /> | When a scrollable view is focused (fullscreen layout). |
| `Agents` | <Documented /> | When the agents view (`claude agents`) is open. |

## Default Keys by Context

The program holds these defaults. Your file overrides them.
Some contexts have no default key in this list: `ProactivityMenu` and `MessageSelector`.
Two defaults depend on the platform:

- `chat:cycleMode` and `confirm:cycleMode` use `shift+tab`. On Windows with an older runtime, the program uses `meta+m` instead.
- `chat:imagePaste` uses `ctrl+v`. On Windows and WSL it uses `alt+v`, and WSL keeps `ctrl+v` too.

### `Global`

| Key | Action | Status |
| --- | --- | --- |
| `ctrl+c` | `app:interrupt` | <Documented /> |
| `ctrl+d` | `app:exit` | <Documented /> |
| `ctrl+t` | `app:toggleTodos` | <Documented /> |
| `ctrl+o` | `app:toggleTranscript` | <Documented /> |
| `ctrl+shift+b` | `app:toggleBrief` | <Undocumented /> |
| `ctrl+r` | `history:search` | <Documented /> |
| `ctrl+up` | `app:diffFileListUp` | <Documented /> |
| `ctrl+down` | `app:diffFileListDown` | <Documented /> |
| `meta+up` | `app:diffFileListUp` | <Documented /> |
| `meta+down` | `app:diffFileListDown` | <Documented /> |
| `ctrl+]` | `app:openArtifact` | <Undocumented /> |

### `Chat`

| Key | Action | Status |
| --- | --- | --- |
| `escape` | `chat:cancel` | <Documented /> |
| `ctrl+l` | `chat:clearInput` | <Documented /> |
| `cmd+k` | `chat:clearScreen` | <Documented /> |
| `ctrl+x ctrl+k` | `chat:killAgents` | <Documented /> |
| `shift+tab` | `chat:cycleMode` | <Documented /> |
| `meta+p` | `chat:modelPicker` | <Documented /> |
| `meta+o` | `chat:fastMode` | <Documented /> |
| `ctrl+y` | `chat:defaultToNewerModel` | <Undocumented /> |
| `meta+t` | `chat:thinkingToggle` | <Documented /> |
| `meta+w` | `chat:workflowKeywordToggle` | <Undocumented /> |
| `enter` | `chat:submit` | <Documented /> |
| `ctrl+x enter` | `chat:queueSubmit` | <Documented /> |
| `ctrl+x ctrl+s` | `chat:sendNow` | <Documented /> |
| `ctrl+enter` | `chat:sendNow` | <Documented /> |
| `ctrl+j` | `chat:newline` | <Documented /> |
| `up` | `history:previous` | <Documented /> |
| `down` | `history:next` | <Documented /> |
| `ctrl+_` | `chat:undo` | <Documented /> |
| `ctrl+-` | `chat:undo` | <Documented /> |
| `ctrl+shift+-` | `chat:undo` | <Documented /> |
| `ctrl+shift+_` | `chat:undo` | <Documented /> |
| `ctrl+x ctrl+e` | `chat:externalEditor` | <Documented /> |
| `ctrl+x ctrl+a` | `abovePrompt:toggle` | <Documented /> |
| `ctrl+x tab` | `abovePrompt:focus` | <Documented /> |
| `ctrl+g` | `chat:externalEditor` | <Documented /> |
| `ctrl+s` | `chat:stash` | <Documented /> |
| `ctrl+v` | `chat:imagePaste` | <Documented /> |
| `space` | `voice:pushToTalk` | <Documented /> |

### `Autocomplete`

| Key | Action | Status |
| --- | --- | --- |
| `tab` | `autocomplete:accept` | <Documented /> |
| `escape` | `autocomplete:dismiss` | <Documented /> |
| `up` | `autocomplete:previous` | <Documented /> |
| `down` | `autocomplete:next` | <Documented /> |

### `Confirmation`

| Key | Action | Status |
| --- | --- | --- |
| `enter` | `confirm:yes` | <Documented /> |
| `escape` | `confirm:no` | <Documented /> |
| `up` | `confirm:previous` | <Documented /> |
| `down` | `confirm:next` | <Documented /> |
| `tab` | `confirm:nextField` | <Documented /> |
| `space` | `confirm:toggle` | <Documented /> |
| `shift+tab` | `confirm:cycleMode` | <Documented /> |

### `Help`

| Key | Action | Status |
| --- | --- | --- |
| `escape` | `help:dismiss` | <Documented /> |

### `Transcript`

| Key | Action | Status |
| --- | --- | --- |
| `ctrl+e` | `transcript:toggleShowAll` | <Documented /> |
| `ctrl+c` | `transcript:exit` | <Documented /> |
| `escape` | `transcript:exit` | <Documented /> |
| `q` | `transcript:exit` | <Documented /> |
| `ctrl+u` | `scroll:halfPageUp` | <Documented /> |
| `ctrl+d` | `scroll:halfPageDown` | <Documented /> |
| `ctrl+b` | `scroll:fullPageUp` | <Documented /> |
| `ctrl+f` | `scroll:fullPageDown` | <Documented /> |
| `ctrl+n` | `scroll:lineDown` | <Documented /> |
| `ctrl+p` | `scroll:lineUp` | <Documented /> |
| `g` | `scroll:top` | <Documented /> |
| `shift+g` | `scroll:bottom` | <Documented /> |
| `j` | `scroll:lineDown` | <Documented /> |
| `k` | `scroll:lineUp` | <Documented /> |
| `space` | `scroll:fullPageDown` | <Documented /> |
| `b` | `scroll:fullPageUp` | <Documented /> |
| `up` | `scroll:lineUp` | <Documented /> |
| `down` | `scroll:lineDown` | <Documented /> |
| `home` | `scroll:top` | <Documented /> |
| `end` | `scroll:bottom` | <Documented /> |

### `HistorySearch`

| Key | Action | Status |
| --- | --- | --- |
| `ctrl+r` | `historySearch:next` | <Documented /> |
| `escape` | `historySearch:accept` | <Documented /> |
| `tab` | `historySearch:accept` | <Documented /> |
| `ctrl+c` | `historySearch:cancel` | <Documented /> |
| `enter` | `historySearch:execute` | <Documented /> |
| `ctrl+s` | `historySearch:cycleScope` | <Documented /> |

### `Task`

| Key | Action | Status |
| --- | --- | --- |
| `ctrl+x ctrl+b` | `task:background` | <Documented /> |
| `ctrl+b` | `task:background` | <Documented /> |

### `ThemePicker`

| Key | Action | Status |
| --- | --- | --- |
| `ctrl+t` | `theme:toggleSyntaxHighlighting` | <Documented /> |
| `ctrl+e` | `theme:editCustom` | <Undocumented /> |

### `Settings`

| Key | Action | Status |
| --- | --- | --- |
| `escape` | `confirm:no` | <Documented /> |
| `up` | `select:previous` | <Documented /> |
| `down` | `select:next` | <Documented /> |
| `k` | `select:previous` | <Documented /> |
| `j` | `select:next` | <Documented /> |
| `ctrl+p` | `select:previous` | <Documented /> |
| `ctrl+n` | `select:next` | <Documented /> |
| `home` | `select:first` | <Documented /> |
| `end` | `select:last` | <Documented /> |
| `pageup` | `select:pageUp` | <Documented /> |
| `pagedown` | `select:pageDown` | <Documented /> |
| `space` | `select:accept` | <Documented /> |
| `enter` | `select:accept` | <Documented /> |
| `/` | `settings:search` | <Documented /> |
| `r` | `settings:retry` | <Documented /> |
| `d` | `settings:periodDay` | <Undocumented /> |
| `w` | `settings:periodWeek` | <Undocumented /> |
| `f` | `settings:fixUsage` | <Documented /> |
| `t` | `settings:sortByTokens` | <Undocumented /> |
| `ctrl+u` | `scroll:halfPageUp` | <Documented /> |
| `ctrl+d` | `scroll:halfPageDown` | <Documented /> |

### `Tabs`

| Key | Action | Status |
| --- | --- | --- |
| `tab` | `tabs:next` | <Documented /> |
| `shift+tab` | `tabs:previous` | <Documented /> |
| `right` | `tabs:next` | <Documented /> |
| `left` | `tabs:previous` | <Documented /> |

### `Attachments`

| Key | Action | Status |
| --- | --- | --- |
| `right` | `attachments:next` | <Documented /> |
| `left` | `attachments:previous` | <Documented /> |
| `backspace` | `attachments:remove` | <Documented /> |
| `delete` | `attachments:remove` | <Documented /> |
| `down` | `attachments:exit` | <Documented /> |
| `escape` | `attachments:exit` | <Documented /> |

### `Footer`

| Key | Action | Status |
| --- | --- | --- |
| `up` | `footer:up` | <Documented /> |
| `ctrl+p` | `footer:up` | <Documented /> |
| `down` | `footer:down` | <Documented /> |
| `ctrl+n` | `footer:down` | <Documented /> |
| `right` | `footer:next` | <Documented /> |
| `left` | `footer:previous` | <Documented /> |
| `enter` | `footer:openSelected` | <Documented /> |
| `escape` | `footer:clearSelection` | <Documented /> |
| `x` | `footer:close` | <Documented /> |

### `AbovePrompt`

| Key | Action | Status |
| --- | --- | --- |
| `tab` | `abovePrompt:next` | <Documented /> |
| `right` | `abovePrompt:next` | <Documented /> |
| `shift+tab` | `abovePrompt:previous` | <Documented /> |
| `left` | `abovePrompt:previous` | <Documented /> |
| `enter` | `abovePrompt:press` | <Documented /> |
| `space` | `abovePrompt:press` | <Documented /> |
| `escape` | `abovePrompt:leave` | <Documented /> |
| `up` | `pane:scrollUp` | <Documented /> |
| `down` | `pane:scrollDown` | <Documented /> |
| `pageup` | `pane:pageUp` | <Documented /> |
| `pagedown` | `pane:pageDown` | <Documented /> |
| `home` | `pane:top` | <Documented /> |
| `end` | `pane:bottom` | <Documented /> |

### `AbovePromptInput`

| Key | Action | Status |
| --- | --- | --- |
| `tab` | `abovePrompt:next` | <Documented /> |
| `shift+tab` | `abovePrompt:previous` | <Documented /> |
| `enter` | `abovePrompt:press` | <Documented /> |
| `escape` | `abovePrompt:leave` | <Documented /> |

### `AbovePromptSelect`

| Key | Action | Status |
| --- | --- | --- |
| `tab` | `abovePrompt:next` | <Documented /> |
| `shift+tab` | `abovePrompt:previous` | <Documented /> |
| `down` | `abovePrompt:highlightNext` | <Documented /> |
| `up` | `abovePrompt:highlightPrevious` | <Documented /> |
| `enter` | `abovePrompt:press` | <Documented /> |
| `escape` | `abovePrompt:leave` | <Documented /> |

### `Pane`

| Key | Action | Status |
| --- | --- | --- |
| `tab` | `abovePrompt:next` | <Documented /> |
| `shift+tab` | `abovePrompt:previous` | <Documented /> |
| `enter` | `abovePrompt:press` | <Documented /> |
| `escape` | `abovePrompt:leave` | <Documented /> |
| `up` | `pane:scrollUp` | <Documented /> |
| `down` | `pane:scrollDown` | <Documented /> |
| `pageup` | `pane:pageUp` | <Documented /> |
| `pagedown` | `pane:pageDown` | <Documented /> |
| `home` | `pane:top` | <Documented /> |
| `end` | `pane:bottom` | <Documented /> |
| `ctrl+x left` | `pane:grow` | <Documented /> |
| `ctrl+x up` | `pane:grow` | <Documented /> |
| `ctrl+x right` | `pane:shrink` | <Documented /> |
| `ctrl+x down` | `pane:shrink` | <Documented /> |
| `ctrl+x x` | `pane:close` | <Documented /> |

### `PaneField`

| Key | Action | Status |
| --- | --- | --- |
| `ctrl+x x` | `pane:close` | <Documented /> |

### `DiffDialog`

| Key | Action | Status |
| --- | --- | --- |
| `escape` | `diff:dismiss` | <Documented /> |
| `left` | `diff:previousSource` | <Documented /> |
| `right` | `diff:nextSource` | <Documented /> |
| `up` | `diff:previousFile` | <Documented /> |
| `down` | `diff:nextFile` | <Documented /> |
| `j` | `diff:nextFile` | <Documented /> |
| `k` | `diff:previousFile` | <Documented /> |
| `pageup` | `scroll:pageUp` | <Documented /> |
| `pagedown` | `scroll:pageDown` | <Documented /> |
| `space` | `scroll:fullPageDown` | <Documented /> |
| `shift+space` | `scroll:fullPageUp` | <Documented /> |
| `b` | `scroll:fullPageUp` | <Documented /> |
| `g` | `scroll:top` | <Documented /> |
| `shift+g` | `scroll:bottom` | <Documented /> |
| `home` | `scroll:top` | <Documented /> |
| `end` | `scroll:bottom` | <Documented /> |

### `DiffPanel`

| Key | Action | Status |
| --- | --- | --- |
| `ctrl+x b` | `app:cycleDiffBase` | <Documented /> |

### `FeedbackSurvey`

| Key | Action | Status |
| --- | --- | --- |
| `ctrl+x 1` | `feedbackSurvey:bad` | <Undocumented /> |
| `ctrl+x 2` | `feedbackSurvey:fine` | <Undocumented /> |
| `ctrl+x 3` | `feedbackSurvey:good` | <Undocumented /> |

### `ModelPicker`

| Key | Action | Status |
| --- | --- | --- |
| `left` | `modelPicker:decreaseEffort` | <Documented /> |
| `right` | `modelPicker:increaseEffort` | <Documented /> |
| `s` | `modelPicker:thisSessionOnly` | <Documented /> |

### `EffortSlider`

| Key | Action | Status |
| --- | --- | --- |
| `left` | `effortSlider:decreaseEffort` | <Documented /> |
| `right` | `effortSlider:increaseEffort` | <Documented /> |
| `tab` | `effortSlider:toggleUltracode` | <Documented /> |
| `s` | `effortSlider:thisSessionOnly` | <Documented /> |

### `Select`

| Key | Action | Status |
| --- | --- | --- |
| `up` | `select:previous` | <Documented /> |
| `down` | `select:next` | <Documented /> |
| `j` | `select:next` | <Documented /> |
| `k` | `select:previous` | <Documented /> |
| `ctrl+n` | `select:next` | <Documented /> |
| `ctrl+p` | `select:previous` | <Documented /> |
| `pageup` | `select:pageUp` | <Documented /> |
| `pagedown` | `select:pageDown` | <Documented /> |
| `home` | `select:first` | <Documented /> |
| `end` | `select:last` | <Documented /> |
| `enter` | `select:accept` | <Documented /> |
| `escape` | `select:cancel` | <Documented /> |

### `Plugin`

| Key | Action | Status |
| --- | --- | --- |
| `space` | `plugin:toggle` | <Documented /> |
| `i` | `plugin:install` | <Documented /> |
| `f` | `plugin:favorite` | <Documented /> |
| `ctrl+s` | `plugin:cycleMarketplace` | <Undocumented /> |

### `Scroll`

| Key | Action | Status |
| --- | --- | --- |
| `pageup` | `scroll:pageUp` | <Documented /> |
| `pagedown` | `scroll:pageDown` | <Documented /> |
| `wheelup` | `scroll:lineUp` | <Documented /> |
| `wheeldown` | `scroll:lineDown` | <Documented /> |
| `ctrl+home` | `scroll:top` | <Documented /> |
| `ctrl+end` | `scroll:bottom` | <Documented /> |
| `ctrl+shift+c` | `selection:copy` | <Documented /> |
| `cmd+c` | `selection:copy` | <Documented /> |
| `shift+left` | `selection:extendLeft` | <Documented /> |
| `shift+right` | `selection:extendRight` | <Documented /> |
| `shift+up` | `selection:extendUp` | <Documented /> |
| `shift+down` | `selection:extendDown` | <Documented /> |
| `shift+home` | `selection:extendLineStart` | <Documented /> |
| `shift+end` | `selection:extendLineEnd` | <Documented /> |

### `Agents`

| Key | Action | Status |
| --- | --- | --- |
| `ctrl+s` | `agents:switchView` | <Documented /> |
| `ctrl+t` | `agents:togglePin` | <Documented /> |
| `ctrl+f` | `agents:find` | <Documented /> |
| `ctrl+r` | `agents:rename` | <Documented /> |
| `ctrl+up` | `agents:previousGroup` | <Documented /> |
| `meta+up` | `agents:previousGroup` | <Documented /> |
| `ctrl+down` | `agents:nextGroup` | <Documented /> |
| `meta+down` | `agents:nextGroup` | <Documented /> |

## Actions without a Default Key

The program lists these actions as valid, but its default keys do not bind them.
You can bind them in `keybindings.json`.

| Action | Status |
| --- | --- |
| `app:toggleReplTab` | <Documented /> |
| `app:toggleDiffNoiseFilter` | <Documented /> |
| `app:toggleDiffPreSession` | <Documented /> |
| `app:toggleTerminal` | <Undocumented /> |
| `app:redraw` | <Documented /> |
| `strip:jump1` | <Undocumented /> |
| `strip:jump2` | <Undocumented /> |
| `strip:jump3` | <Undocumented /> |
| `strip:jump4` | <Undocumented /> |
| `strip:jump5` | <Undocumented /> |
| `strip:jump6` | <Undocumented /> |
| `strip:jump7` | <Undocumented /> |
| `strip:jump8` | <Undocumented /> |
| `strip:jump9` | <Undocumented /> |
| `strip:next` | <Undocumented /> |
| `strip:previous` | <Undocumented /> |
| `strip:tabNext` | <Undocumented /> |
| `strip:tabPrevious` | <Undocumented /> |
| `strip:viewAll` | <Undocumented /> |
| `strip:toggle` | <Undocumented /> |
| `strip:new` | <Undocumented /> |
| `chat:cycleProactivity` | <Undocumented /> |
| `chat:attentionUp` | <Undocumented /> |
| `chat:attentionDown` | <Undocumented /> |
| `chat:increaseEffort` | <Undocumented /> |
| `chat:decreaseEffort` | <Undocumented /> |
| `confirm:previousField` | <Documented /> |
| `proactivityMenu:previousMode` | <Undocumented /> |
| `proactivityMenu:nextMode` | <Undocumented /> |
| `footer:dismiss` | <Documented /> |
| `pane:next` | <Documented /> |
| `pane:previous` | <Documented /> |
| `diff:back` | <Documented /> |
| `permission:toggleDebug` | <Documented /> |
| `selection:clear` | <Documented /> |
| `agents:setGroup` | <Undocumented /> |

## Keys You Cannot Rebind

The program refuses some keys and warns about others.

| Key | Result | Reason in the program |
| --- | --- | --- |
| `ctrl+c`, `ctrl+d` | Error | Hardcoded for interrupt and exit. |
| `ctrl+m` | Error | Same as `enter` in terminals. |
| `ctrl+[` | Error | Same as `escape` in terminals. |
| `ctrl+i` | Error | Same as `tab` in terminals. |
| `ctrl+h` | Error | Same as `backspace` in terminals. |
| `capslock` | Error | Terminals do not deliver it. |
| `ctrl+\` | Error | Terminal quit signal (SIGQUIT). |
| `ctrl+z` | Warning | Unix process suspend (SIGTSTP). |
| `cmd+c`, `cmd+v`, `cmd+x`, `cmd+q`, `cmd+w`, `cmd+tab`, `cmd+space` | Error on macOS | Used by macOS. |

## Click to Send a Queued Message

A queued message shows a hint under the prompt. In fullscreen rendering with mouse mode `full`, a click on that hint sends the message at once, as the `chat:sendNow` key does.

| Input | Status | What it does | Notes |
| --- | --- | --- | --- |
| Click on the "send now" hint | <Undocumented /> | Sends the queued message at once. | Since `2.1.312`. The program needs mouse mode `full`, so `CLAUDE_CODE_DISABLE_MOUSE` and `CLAUDE_CODE_DISABLE_MOUSE_CLICKS` both stop the click. The program reports the click as `chat:sendNowHintPress`. Source: `chunk-7ss0ryz6.js` lines 8976 and 9363 to 9396. |
| Hint text | <Undocumented /> | Names the key for `chat:sendNow`, or reads "click to send now" when no key is bound to it. | Since `2.1.312`. With no key bound, the hint shows only in mouse mode `full`. Source: `chunk-7ss0ryz6.js` lines 9370 to 9394. |

## Vim Mode Operators with `gj` and `gk`

Vim keys of the input prompt are not in `keybindings.json`. The setting `editorMode` turns them on. See [Interface Settings](settings/ui.md).

| Input | Status | What it does | Notes |
| --- | --- | --- | --- |
| `d`, `c`, or `y` with `gj` or `gk` and a count | <Undocumented /> | When the count is larger than the display lines left, the keys only move the cursor. | Since `2.1.312`. Before, the keys could delete or copy text. The program tests the count against the wrapped lines below the cursor for `gj` and above it for `gk`. Source: `chunk-hz2c9q6k.js` lines 316 to 321 and 784. |

## Related Pages

- [Interface Settings](settings/ui.md) lists the keys that change how the terminal looks and feels.
- [Slash Commands](../extend/skills-and-commands/slash-commands.md) covers `/keybindings`.
- [Files on Disk](../start/files-on-disk.md) lists `keybindings.json`.
