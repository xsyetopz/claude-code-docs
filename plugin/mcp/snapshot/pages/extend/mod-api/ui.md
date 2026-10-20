---
title: "UI Methods"
description: "The $.ui noun that draws and manages the interface - transcript lines, toasts, panes, scroll, focus, and the clipboard."
url: https://xsyetopz.github.io/claude-code-docs/extend/mod-api/ui
source: docs/extend/mod-api/ui.md
---

# UI Methods


`$.ui` draws and manages the interface: lines in the transcript, toasts, panes, scroll, focus, the clipboard, and element tables.
Each method is also an event with the same name, such as `ui.log`, so a hook above the caller can rewrite or refuse the call.

Close a pane with `$.ui.close`. A `deny` from a hook refuses a call.

Official page: [Draw in the Interface](https://code.claude.com/docs/en/plugins/mods/interface), [Mods Reference](https://code.claude.com/docs/en/plugins/mods/reference). Source: the program (`types-2.1.304.d.ts`).
In a "Where it can be used" cell, "Run time" means in a hook, in a closure that a hook drew, or in a timer callback. It does not mean inside `register`.

## Example

```javascript
on("session.start", async ($, e, next) => {
  $.ui.status("Mod ready");
  $.ui.toast("Hello from a mod", { timeoutMs: 2000 });
  return next(e);
});
```

## Members

| Item | Status | What it does | How it works | Where it can be used |
| --- | --- | --- | --- | --- |
| `$.ui.notice` | [Documented] | Shows `text` as one line under the dialog open for `tool_use_id`. Removes the line when `text` is undefined. | `(tool_use_id, text) => void`. Core removes the line when the call ends. | A `tool.call` hook while the call's dialog is open. |
| `$.ui.invalidate` | [Documented] | Re-runs an event whose results the engine caches. `ui.render` draws the instances this plugin may draw again. The others drop the cached answers. | `(event: InvalidatableEventName) => void`. At most ten redraws a second. It can also drop a cached answer, such as `prompt.section` or `tool.describe`. | Run time. |
| `$.ui.blit` | [Documented] | Repaints a mounted `Raster` that this plugin's render hook drew with new cells, or swaps a keyed `Image` to a new source. No redraw. | `(args: UiBlitArgs) => Promise<UiBlitResult>`. Paints at the next frame. Up to 120 calls a second are taken. Resolves `{}` or `{ deny }`. | A plugin's own mounted `Raster` or keyed `Image`. |
| `$.ui.resolve` | [Documented] | Gives the elements of the surface that `e` is drawn on: a frozen table of constructors, the JSX tags that a render hook draws with. | `<E extends ResolveInput>(e: E) => Elements[E['surface']]`. It is a read, not a dispatch. | A `ui.render` hook (it takes that hook's `e`). |
| `$.ui.log` | [Documented] | Appends one line to the transcript, drawn like a dim system notice that is not sent to the model. With `{ to: "debug" }` it goes to the debug log only. | `(text, options?) => void`. The terminal draws 2000 characters. A remote surface draws 10000. | Run time. |
| `$.ui.ask` | [Documented] | Asks the user a question in the engine's own AskUserQuestion dialog. Resolves to the label they chose, or the text typed under "Other". | `(question, options?) => Promise<string>`. Offers 2 to 4 labels. Rejects if dismissed, and in a `-p` run. | Not in a `-p` run. |
| `$.ui.toast` | [Documented] | Shows `text` for a few seconds under the plugin's name in a small box at the top right of the transcript. | `(text, options?) => void`. A click removes it. `timeoutMs` sets how long it stays (default 4000). | Run time. |
| `$.ui.notify` | [Documented] | Raises a native notification through the person's own notification channel (the one `preferredNotifChannel` names). | `(text, options?) => Promise<UiNotifyResult>`. The `Notification` hooks run first. Resolves `{ isSent, channel }` or `{ isSent: false, reason }`. | Run time. |
| `$.ui.status` | [Documented] | Pins `text` as this plugin's status line under the prompt, until the next call replaces it. | `(text: string \| undefined) => void`. `undefined` removes it. 2000 characters are drawn. | Run time. |
| `$.ui.open` | [Documented] | Opens a pane: a framed region that the surface places and this plugin draws by hooking `ui.render` for `{ component: "Pane" }`. | `(pane: PaneOpenArgs) => Promise<UiOpenResult>`. The `id` has 1 to 64 characters. Panes that were asked for fit at any width. Panes nobody asked for need 144 columns. | Run time. |
| `$.ui.close` | [Documented] | Closes one of the open panes. An id that is not open is left alone. | `(pane: PaneCloseArgs) => Promise<void>`. A `ui.close` hook can keep it open, except on an unload. | Run time. |
| `$.ui.panes` | [Documented] | Lists this plugin's own open panes: id, title, and whether each is shown, holds the keyboard, and is placed. | `() => Promise<readonly UiPane[]>`. In open order, placed ones first. Other plugins' panes are not listed. | Run time. |
| `$.ui.scroll` | [Documented] | Scrolls something into view, like the DOM's `scrollIntoView`: a render instance by `requestId`, an element by `key`, or the edge of a site. | `(args: UiScrollArgs) => Promise<UiScrollResult>`. `to` says where, `in` says which site, `block` says where it lands. | Run time. |
| `$.ui.focus` | [Documented] | Moves the focus ring of one of this plugin's sites to an element it drew there, like the DOM's `element.focus()`. | `(args: UiFocusArgs) => Promise<UiFocusResult>`. Takes the site `requestId` and the element `key`. Resolves `{}` or `{ deny }`. | Run time. |
| `$.ui.copy` | [Documented] | Puts `text` on the clipboard of a surface the session draws on, and says whether it took. | `(args: UiCopyArgs) => Promise<UiCopyResult>`. Resolves `{ isCopied: true }` or `{ isCopied: false, reason }`. | Run time. |
| `$.ui.selection` | [Documented] | Returns what the person last selected with the mouse: the text as a copy would take it, and the transcript row it lies in. | `() => Promise<UiSelection \| undefined>`. `undefined` with nothing selected, in `-p`, or when fullscreen is off. | Run time. |
| `$.ui.view` | [Documented] | Puts an agent's transcript in the main view, as the person's own switch from the tasks list does. `{}` goes back to the main one. | `(view: SiteView) => Promise<UiViewResult>`. Works only while the call answers the person's own input (press, pick, prompt, command). | Only while answering the person's own input. |

## Related Pages

- [Mod API Overview](https://xsyetopz.github.io/claude-code-docs/extend/mod-api.md)
- [UI Events](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/ui-events.md)
- [Surfaces, Elements, and Render Sites](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/ui-elements.md)
- [UI Types](https://xsyetopz.github.io/claude-code-docs/extend/mod-api/types/ui.md) (element props and results of `$.ui`)
