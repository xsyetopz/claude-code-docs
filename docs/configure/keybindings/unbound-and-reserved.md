---
title: Unbound Actions and Reserved Keys
description: Actions that have no default key, keys that Claude Code will not let you rebind, click to send, and the vim operators.
sidebar_position: 4
---

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
| `ctrl+c`, `ctrl+d` | Error | The program hardcodes them for interrupt and exit. |
| `ctrl+m` | Error | It is the same as `enter` in terminals. |
| `ctrl+[` | Error | It is the same as `escape` in terminals. |
| `ctrl+i` | Error | It is the same as `tab` in terminals. |
| `ctrl+h` | Error | It is the same as `backspace` in terminals. |
| `capslock` | Error | Terminals do not deliver it. |
| `ctrl+\` | Error | It is the terminal quit signal (SIGQUIT). |
| `ctrl+z` | Warning | It is the Unix process suspend (SIGTSTP). |
| `cmd+c`, `cmd+v`, `cmd+x`, `cmd+q`, `cmd+w`, `cmd+tab`, `cmd+space` | Error on macOS | macOS uses them. |

## Click to Send a Queued Message

A queued message shows a hint under the prompt. In fullscreen rendering with mouse mode `full`, a click on that hint sends the message at once, as the `chat:sendNow` key does.

| Input | Status | What it does | Notes |
| --- | --- | --- | --- |
| Click on the "send now" hint | <Undocumented /> | Sends the queued message at once. | Since `2.1.312`. The program needs mouse mode `full`, so `CLAUDE_CODE_DISABLE_MOUSE` and `CLAUDE_CODE_DISABLE_MOUSE_CLICKS` both stop the click. The program reports the click as `chat:sendNowHintPress`. Source: `chunk-7ss0ryz6.js` lines 8976 and 9363 to 9396. |
| Hint text | <Undocumented /> | Names the key for `chat:sendNow`, or reads "click to send now" when no key is bound to it. | Since `2.1.312`. With no key bound, the hint shows only in mouse mode `full`. Source: `chunk-7ss0ryz6.js` lines 9370 to 9394. |

## Vim Mode Operators with `gj` and `gk`

Vim keys of the input prompt are not in `keybindings.json`. The setting `editorMode` turns them on. See [Interface Settings](../settings/ui.md).

| Input | Status | What it does | Notes |
| --- | --- | --- | --- |
| `d`, `c`, or `y` with `gj` or `gk` and a count | <Undocumented /> | When the count is larger than the display lines left, the keys only move the cursor. | Since `2.1.312`. Before, the keys could delete or copy text. The program tests the count against the wrapped lines below the cursor for `gj` and above it for `gk`. Source: `chunk-hz2c9q6k.js` lines 316 to 321 and 784. |

## Related Pages

- [Keybindings](index.md) lists the contexts and shows how to write `keybindings.json`.
