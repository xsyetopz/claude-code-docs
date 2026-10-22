---
title: UI Types
description: "Types of $.ui, the element props, and the client modules: Box, Text, Button, panes, and render inputs."
sidebar_position: 11
---

These are the types of `$.ui`, the element props, and the client modules.
They describe `Box`, `Text`, `Button`, and the other elements that a mod can draw.
They also cover images, inputs, links, panes, scroll targets, selections, and render inputs.

## Example

This element draws a button that copies a URL to the clipboard when pressed.

```tsx
<Button key="save" onPress={() => $.ui.copy({ text: url })}>
  Copy
</Button>;
```

## Types without Fields

These types are aliases, unions, or plain shapes. Each row gives its use and its shape.

| Type | Status | What it is for | Shape and limits |
| --- | --- | --- | --- |
| `ClientElements` | <Documented /> | The element table a surface module draws with, `surface.elements`: the terminal's (Elements) less `Client` (none nests), `Raster` and `Image`. | Alias of the terminal element table without `Client`, `Raster`, and `Image`. A tree has bounds: 20,000 nodes, 32 deep, 100,000 characters. |
| `ClientModule` | <Documented /> | The component a surface module exports (default, or its one PascalCase export): from props and surface to the tree drawn (no nested `Client`). | Alias of a function `(props, surface) => RenderElement`. It runs on the drawing thread, a second per call at most. A throw or an overrun unmounts it. |
| `ClientPointerType` | <Documented /> | What the pointer did over a `Client`'s region: a button went down, the pointer moved, the button came up, or the pointer crossed the region's edge. | Alias of `'down' \| 'move' \| 'up' \| 'enter' \| 'leave'`. |
| `Color` | <Documented /> | What a prop that paints may hold: a theme key, which follows the person's theme, or any other string, a raw color (a name such as `"red"`, or hex). | Alias of `ThemeKey \| (string & {})`. The keys are named so that an editor lists them, every string is admitted. What a surface draws for one it does not know is its own. |
| `ElementConstructor` | <Documented /> | An element as `$.ui.resolve(e)` hands it out: a constructor from props to the frozen plain-data element, `children` among the props as JSX passes. | Alias of `(props: P & ElementChildren) => RenderElement`. `const { Box } = $.ui.resolve(e)` then `<Box gap={1}>` compiles to a call of `h`. |
| `Elements` | <Documented /> | Each surface's primitive tags and their prop types, by `e.surface`, for the surfaces the plugin was compiled against. | Interface with the members `terminal`, `desktop`, `mobile`, `vscode`. A new surface adds its table by declaration merging. Used by `$.ui.resolve`. |
| `ElementTable` | <Documented /> | The table `ui.resolve` answers for an argument of surface `P`. | Generic alias of `Elements[P]`. Used by `ui.resolve`. |
| `InvalidatableEventName` | <Documented /> | What `$.ui.invalidate` takes: a render event, or one of the six events whose answers the engine caches for the session. | Alias of the render event names plus `prompt.section`, `prompt.context`, `prompt.attachment`, `tool.describe`, `command.describe`, and `config.describe`. Used by `$.ui.invalidate`. |
| `PaneCloseArgs` | <Documented /> | The argument of `$.ui.close`: the pane to close (`{ id }`). `origin` is the engine's to set: a plugin's call reads `plugin` at the hooks. | Alias of `Omit<PaneCloseInput, 'origin'>`. Used by `$.ui.close`. |
| `RenderChildren` | <Documented /> | What an element takes as `children`, as JSX passes them: a node, a number (drawn as its string), a value the factory drops, or a list that may nest. | Alias of `RenderNode` plus numbers, booleans, `null`, `undefined`, and nested lists. `false`, `null`, and `undefined` are dropped, so `{ok && <Text>hi</Text>}` works. |
| `RenderComponent` | <Documented /> | Everything `ui.render` can draw: one name per component that has a render site, a matcher narrows on it. | Alias of the names of the 15 components a plugin may draw, from `AskUserQuestion` to `Pane`. The permission dialog is drawn by the engine alone. Used by `$.ui.render`. |
| `RenderEventName` | <Documented /> | The render event: `ui.render`, one event for every component that has a render site. | Alias of `'ui.render'`. |
| `RenderInput` | <Documented /> | The input of `ui.render`: a union discriminated by `component`, one member per RenderComponent and per RenderSurface. | Generic alias of `C extends RenderComponent ? P extends RenderSurface ? RenderInputOf<C, P> : never : never`. Used by `ui.render`, `$.ui.render`. |
| `RenderNode` | <Documented /> | A node of a render tree: an element, or a string (text). | Alias of `RenderElement \| string`. |
| `RenderPropsOf` | <Documented /> | The plain-data props of each renderable component, as `ui.render` sees them under `e.props`, a hook rewrites them with `next({ ...e, props })`. | A component validates a rewrite. An invalid rewrite draws the original. This is the render contract for plugins. |
| `RenderSurface` | <Documented /> | The surface a render event's component is drawn on, by name. Plugins draw into surfaces, they do not provide them. | Alias of `keyof Elements & string`. The surfaces: `terminal`, `desktop`, `mobile`, and `vscode`. A host with no attached surface shows nothing drawn. Used by `$.session.surfaces`. |
| `ResolveInput` | <Documented /> | The input of `ui.resolve`: which surface's elements, for which component, a union with one member per surface (ResolveInputOf). | Alias that picks the input type for a component and a surface. It names the surface and the component, not the props. Used by `$.ui.resolve`, `ui.resolve`. |
| `Space` | <Documented /> | Spacing of a `Box`: a number of character cells, or a step name (`xs`, `sm`, `md`, `lg`, `xl`). The terminal and VS Code draw steps as cells. Desktop and phones use their own scale. | Alias of `number \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`. |
| `ThemeKey` | <Documented /> | The theme keys named for what a color means: text, status, the prompt box and its modes, and diffs, as the custom theme reference lists them. | Alias of theme color names such as `'text'`, `'error'`, `'success'`, `'warning'`, `'permission'`, and `'diffAdded'`. A tree that names one follows the person's theme. |
| `UiBlitArgs` | <Documented /> | What a plugin's `$.ui.blit(args)` takes: a Raster's next `cells` (RasterBlitArgs) or a keyed Image's next `source` (ImageBlitArgs). | Alias of `RasterBlitArgs \| ImageBlitArgs`. It names an element that this plugin's own `ui.render` hook drew. A hook may rewrite the cells or source, not the address. Used by `$.ui.blit`. |
| `UiFaultPhase` | <Documented /> | When a `Client` failed, as `ui.fault` names it, a closed set a matcher narrows on. | Alias of `'load' \| 'render' \| 'run'`. `load` is before the module ran. `render` is while drawing. `run` is in a listener, timer, or handler. |
| `UiFaultResult` | <Documented /> | What a `ui.fault` hook returns and what `next(e)` resolves to: `{}`, the fault was heard. | Alias of `Record<string, never>`. Observe only. The engine then draws the site again. The plugin's `ui.render` hook falls back by leaving the `Client` out. Used by `ui.fault`. |
| `UiFocusComponent` | <Documented /> | The render components whose site keeps a focus ring: a pane's body and the band above the prompt, each a ring over the elements hooks drew there. | Alias of `'Pane' \| 'AbovePrompt'`. |
| `UiLogSink` | <Documented /> | Where a `$.ui.log` line goes: `transcript`, a dim row of its own (and the debug log, as every line), `debug`, the debug log alone, nothing on screen. | Alias of `'transcript' \| 'debug'`. The debug log is `claude --debug` or the `--debug-file`, either way the line is led by the plugin's name. Used by `ui.log`. |
| `UiScrollBlock` | <Documented /> | Where in its scrollable a revealed row lands, as the DOM's `scrollIntoView({ block })` names it. | Alias of `'start' \| 'center' \| 'end' \| 'nearest'`. `nearest` moves the least that shows the row whole. A row taller than the window shows its top. |
| `UiScrollComponent` | <Documented /> | The render components whose site the engine scrolls: a pane's body and the band above the prompt, each a window over the tree a hook drew there. | Alias of `'Pane' \| 'AbovePrompt'`. |

## Types with Fields

Each type below has its own table of fields.

### `AskOptions`

Options of `$.ui.ask`. Object with fields `options?`, `header?`, `multiSelect?`. Used by `$.ui.ask`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `options` | <Documented /> | 2-4 option labels, fewer than two are padded with Yes/No, free text is the dialog's Other. | Type: `readonly string[]`. Optional. |
| `header` | <Documented /> | A short chip beside the question (`Approach`, 12 characters at most). | Type: `string`. Optional. |
| `multiSelect` | <Documented /> | Allow several options, the answer comes back comma-joined. | Type: `true`. Optional. |

### `BoxHoverProps`

The `Box` props a `hover` may override, none of which moves the Box's siblings, and `scope`, which names the hover group the Box joins. The surface applies a hover as the pointer moves. A reveal that keeps moving settles and never loops.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `scope` | <Documented /> | Names a hover group of this plugin's: every element it draws with the same `scope`, in any site, lights while any is hovered, reveals included. | Type: `string`. Optional. A `Pane` row and a transcript mark can share one scope. A scope is 1 to 64 characters with no control characters. |
| `borderStyle` | <Documented /> | Restyles a border the Box has, it adds none. | Type: `string`. Optional. |
| `borderColor` | <Documented /> | The border color. | Type: `Color`. Optional. |
| `borderDimColor` | <Documented /> | `true` dims the border color. | Type: `boolean`. Optional. |
| `backgroundColor` | <Documented /> | The background color. | Type: `Color`. Optional. |
| `display` | <Documented /> | `"flex"` alone, on a Box drawn `display: "none"`: with a `scope`, every member of the lit group is revealed, in whichever site it sits. | Type: `'flex'`. Optional. So a pointer on a glyph in the transcript can swap an entry into a fixed row of the band, or reveal an absolutely positioned card. |
| `top` | <Documented /> | Moves a Box drawn `position: "absolute"`, as `left`, `right` and `bottom` do, none of the four moves a Box in the flow. | Type: `number`. Optional. |
| `left` | <Documented /> | The distance from the left edge. | Type: `number`. Optional. |
| `right` | <Documented /> | The distance from the right edge. | Type: `number`. Optional. |
| `bottom` | <Documented /> | The distance from the bottom edge. | Type: `number`. Optional. |

### `BoxProps`

The props of `Box`: the layout, position, margin, padding and border props of Ink's Box a tree may set, and the two of hover. The layout and style props of a `Box`, such as `flexDirection`, `gap`, `padding`, and `borderStyle`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `key` | <Documented /> | Makes the Box a hover scope: while the pointer is anywhere over it, its own `hover` and that of every element beneath it apply. | Type: `string`. Optional. A nested `Box` with a `key` scopes what is beneath it. A key that a sibling took names no scope. |
| `hover` | <Documented /> | Style overrides applied by the surface while the pointer is over the nearest keyed `Box`, this one included, or, given a `scope`, its group. | Type: `BoxHoverProps`. Optional. No hook runs on hover. To reveal on hover, draw the `Box` with `display: "none"` and set `hover: { display: "flex" }`. |
| `position` | <Documented /> | `"absolute"` leaves the flow, as in CSS: placed against its parent by the offsets, no room among its siblings, painted over those before it. | Type: `'relative' \| 'absolute'`. Optional. An absolute `Box` moves nothing when it shows. The region of its site clips it. |
| `top` | <Documented /> | Rows from the parent's top edge, in character cells: an integer, negative above the edge. | Type: `number`. Optional. With `bottom` and no `height` the Box spans the two. |
| `left` | <Documented /> | Columns from the parent's left edge, in character cells: an integer, negative left of the edge. | Type: `number`. Optional. With `right` and no `width` the Box spans the two. |
| `right` | <Documented /> | Columns from the parent's right edge, in character cells: an integer, negative right of the edge. | Type: `number`. Optional. |
| `bottom` | <Documented /> | Rows from the parent's bottom edge, in character cells: an integer, negative below the edge. | Type: `number`. Optional. |
| `flexDirection` | <Documented /> | The direction of the main axis. | Type: `'row' \| 'column' \| 'row-reverse' \| 'column-reverse'`. Optional. |
| `flexGrow` | <Documented /> | How much the box grows to fill free space. | Type: `number`. Optional. |
| `flexShrink` | <Documented /> | How much the box shrinks when space is short. | Type: `number`. Optional. |
| `flexWrap` | <Documented /> | Whether children wrap onto more lines. | Type: `'nowrap' \| 'wrap' \| 'wrap-reverse'`. Optional. |
| `alignItems` | <Documented /> | How children line up on the cross axis. | Type: `'flex-start' \| 'center' \| 'flex-end' \| 'stretch'`. Optional. |
| `alignSelf` | <Documented /> | How this box lines up on the cross axis, overriding its parent. | Type: `'flex-start' \| 'center' \| 'flex-end' \| 'auto'`. Optional. |
| `justifyContent` | <Documented /> | How children line up on the main axis. | Type: `'flex-start' \| 'center' \| 'flex-end' \| 'space-between' \| 'space-around' \| 'space-evenly'`. Optional. |
| `gap` | <Documented /> | Space between the children, in cells or a step name. Set `gap` on the `Box` rather than a margin on each child. | Type: `Space`. Optional. |
| `columnGap` | <Documented /> | The space between columns. | Type: `Space`. Optional. |
| `rowGap` | <Documented /> | The space between rows. | Type: `Space`. Optional. |
| `width` | <Documented /> | The width, in cells or as a percentage string. | Type: `number \| string`. Optional. |
| `height` | <Documented /> | The height, in cells or as a percentage string. | Type: `number \| string`. Optional. |
| `minWidth` | <Documented /> | The smallest width, in cells or as a percentage string. | Type: `number \| string`. Optional. |
| `minHeight` | <Documented /> | The smallest height, in cells or as a percentage string. | Type: `number \| string`. Optional. |
| `margin` | <Documented /> | The margin on all four sides. | Type: `Space`. Optional. |
| `marginX` | <Documented /> | The left and right margin. | Type: `Space`. Optional. |
| `marginY` | <Documented /> | The top and bottom margin. | Type: `Space`. Optional. |
| `marginTop` | <Documented /> | The top margin. | Type: `Space`. Optional. |
| `marginBottom` | <Documented /> | The bottom margin. | Type: `Space`. Optional. |
| `marginLeft` | <Documented /> | The left margin. | Type: `Space`. Optional. |
| `marginRight` | <Documented /> | The right margin. | Type: `Space`. Optional. |
| `padding` | <Documented /> | The padding on all four sides. | Type: `Space`. Optional. |
| `paddingX` | <Documented /> | The left and right padding. | Type: `Space`. Optional. |
| `paddingY` | <Documented /> | The top and bottom padding. | Type: `Space`. Optional. |
| `paddingTop` | <Documented /> | The top padding. | Type: `Space`. Optional. |
| `paddingBottom` | <Documented /> | The bottom padding. | Type: `Space`. Optional. |
| `paddingLeft` | <Documented /> | The left padding. | Type: `Space`. Optional. |
| `paddingRight` | <Documented /> | The right padding. | Type: `Space`. Optional. |
| `borderStyle` | <Documented /> | The border style. | Type: `string`. Optional. |
| `borderColor` | <Documented /> | The border color. | Type: `Color`. Optional. |
| `borderDimColor` | <Documented /> | `true` dims the border color. | Type: `boolean`. Optional. |
| `backgroundColor` | <Documented /> | The background color. | Type: `Color`. Optional. |
| `overflow` | <Documented /> | Whether content outside the box shows or is cut. | Type: `'visible' \| 'hidden'`. Optional. |
| `display` | <Documented /> | `flex` shows the box. `none` hides it. | Type: `'flex' \| 'none'`. Optional. |

### `ButtonProps`

The props of `Button`, every surface's pressable: an address, a label or children, the closure a press runs, and the styles a hover overrides. The terminal draws `[ label ]` and desktop draws a native button. A click, a `hotkey`, or Enter raises `ui.press`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `key` | <Documented /> | The element's address: `e.element` at `ui.press`, what a matcher names. Defaults to the `label`, or the one string child. | Type: `string`. Optional. Needed where the Button holds other children and no `label`: a row's text holds what changes (a count, an age), its address must not. |
| `label` | <Documented /> | The text drawn on the button, or the one string child. | Type: `string`. Optional. Children of strings and `Text` are drawn in its place. Any other element is refused. |
| `hotkey` | <Documented /> | One digit (`"1"`) or one lowercase letter (`"w"`) that presses it while the plugin's site holds the focus, anything else is refused. | Type: `string`. Optional. Its site holds the key after ctrl+x tab, a click, or `open({ focus })`. Two buttons with the same key clash, and the later wins. |
| `action` | <Documented /> | An engine keybinding action (`"app:cycleDiffBase"`) whose chord, as the person bound it, presses this from the prompt, unknown names refused. | Type: `string`. Optional. Chords that a global or active context binding holds, on the terminal while the button is mounted. |
| `plain` | <Documented /> | Drawn without chrome: the hotkey in the accent color, a colon, the label (`1: Yes`), as a survey's row reads, no `hotkey`, the label alone. | Type: `true`. Optional. A one-glyph label is then a control by itself. `dimColor` and `hover` still apply. |
| `dimColor` | <Documented /> | The label drawn dim at rest, as `Text`'s `dimColor`, and at full strength under the pointer or the focus: a secondary control, a path in a list. | Type: `boolean`. Optional. |
| `variant` | <Documented /> | Which button of several is the main action: `"primary"` is drawn as the surface marks the one to press, `"secondary"`, and absent, as before. | Type: `'primary' \| 'secondary'`. Optional. The terminal draws a primary button in the accent color. `plain` wins over `variant`. |
| `role` | <Documented /> | Marks the Button that closes its site: a drawing hint only. `onPress` still does the dismissing and the press is raised as for any Button. | Type: `'dismiss'`. Optional. The terminal draws it as without the prop, a desktop draws its native close control at the site's trailing edge, the label its accessible name. |
| `autoFocus` | <Documented /> | The site's focus ring starts here when the site takes the keyboard, instead of on nothing, as the DOM's `autofocus`: Enter acts on it at once. | Type: `true`. Optional. A pane opened with `focus` takes it. Of several in one site, the first drawn wins. |
| `hover` | <Documented /> | Label style overrides (the `Text` set) applied by the surface while the nearest enclosing keyed `Box`, or given a `scope` its group, is hovered. | Type: `TextHoverProps`. Optional. No hook runs and nothing crosses to the plugin, under the pointer itself the button inverts as it always has. Refused outside a keyed Box unless it names a `scope`. |
| `onPress` | <Documented /> | What the press runs, in the plugin's own environment: the bottom of the `ui.press` chain. The host holds only a handle, for the drawing's life. | Type: `(e: UiPressArgument) => void`. Runs with the `ui.press` argument. `e.surface` names the surface the press came from. |

### `ClientKeyEvent`

One key the person pressed while a `Client` had the focus, as `surface.onKey` hands it. Escape never arrives: it returns the focus. Object with fields `key`, `ctrl?`, `shift?`, `meta?`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `key` | <Documented /> | A special key's name (`up`, `down`, `left`, `right`, `return`, `tab`, `backspace`, `delete`, `pageup`, `home`, ...) or the character typed. | Type: `string`. |
| `ctrl` | <Documented /> | Modifier keys held with it, each present only when true. | Type: `true`. Optional. |
| `shift` | <Documented /> | `true` when Shift was held. | Type: `true`. Optional. |
| `meta` | <Documented /> | `true` when Meta was held. | Type: `true`. Optional. |

### `ClientPointerEvent`

One pointer event over a `Client`'s region, as `surface.onPointer` hands it: region-relative cells, and the sub-cell position where known. Object with the fields `type`, `x`, `y`, `fine?`, `button?`, `shift?`, `alt?`, `ctrl?`. After a `down` the instance holds the pointer until the `up`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `type` | <Documented /> | What the pointer did. | Type: `ClientPointerType`. |
| `x` | <Documented /> | The column under the pointer, 0 at the region's left edge, on `enter` and `leave`, the last column a move reported. | Type: `number`. |
| `y` | <Documented /> | The row under the pointer, 0 at the region's top edge. | Type: `number`. |
| `fine` | <Documented /> | The same position with the fraction of a cell kept (`x: 12`, `fine.x: 12.375`), where the surface knows it: a terminal that reports pixels. | Type: `object`. Optional. Sub-cell pointer position. Kitty, Ghostty, iTerm2, WezTerm, and foot send it. tmux passes none. |
| `button` | <Documented /> | Which button is down (`down`, `move` while held) or came up (`up`), absent on a hover `move`, `enter` and `leave`. | Type: `'left' \| 'middle' \| 'right'`. Optional. |
| `shift` | <Documented /> | Modifier keys the terminal reported held, each present only when true. | Type: `true`. Optional. |
| `alt` | <Documented /> | `true` when Alt was held. | Type: `true`. Optional. |
| `ctrl` | <Documented /> | `true` when Ctrl was held. | Type: `true`. Optional. |

### `ClientProps`

The props of `Client`: which of the plugin's surface modules draws here, under what key, with what data, in how much room. Object with fields `key`, `module`, `props?`, `width?`, `height?`, `flexGrow?`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `key` | <Documented /> | The instance's address within the drawing: two `Client`s of one plugin in one tree take two keys. What `e.element` carries at `ui.message`. | Type: `string`. The engine keeps the instance (its local state, its timers) across the plugin's redraws while a `Client` under this key stays in the tree. |
| `module` | <Documented /> | The surface module's path, a string literal relative to this file: `module: "./<name>.tsx"` (or `.jsx`, `.ts`, `.js`, `.mjs`). | Type: `string`. Read off the source, so a variable is refused at load. A path outside the plugin is refused too. |
| `props` | <Documented /> | Plain data (JsonValue) handed to the module function, a new value on a redraw reaches the running instance, its state kept. | Type: `unknown`. Optional. At most 100000 characters serialized, not a channel for closures. Typed `unknown` so a matcher over a tree stays shallow. |
| `width` | <Documented /> | Columns the instance's region takes: a count, or a percentage of the parent. Absent, the region is as wide as what the module draws. | Type: `number \| string`. Optional. |
| `height` | <Documented /> | Rows the instance's region takes: a count, or a percentage of the parent. Absent, the region is as tall as what the module draws. | Type: `number \| string`. Optional. |
| `flexGrow` | <Documented /> | How the region grows into free room along the parent's direction, as a Box's `flexGrow`. | Type: `number`. Optional. |

### `ClientSurface`

What a surface module's function receives as its second argument: its elements, the instance's local state, its region, input, clock and port. Alias of an object with `elements`, `state`, `setState`, `columns`, `rows`, `every`, `onPointer`, `onKey`, and `post`. The module runs again on new props, `setState`, and a resize.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `elements` | <Documented /> | The surface's element table (ClientElements), the tags the module draws with: `const { Box, Text } = surface.elements`. No `Client` in it. | Type: `ClientElements`. Read-only. |
| `state` | <Documented /> | The instance's local state: `undefined` until the first `setState`. Kept across the plugin's redraws, dropped with the instance. | Type: `S \| undefined`. Read-only. |
| `setState` | <Documented /> | Replaces the local state and schedules one more call of the function on the next frame, several calls before it coalesce into one redraw. | Type: `(next: S) => void`. A `setState` on each of three renders in a row with no key, pointer, tick, press or props between is a render loop: the instance unmounts. |
| `columns` | <Documented /> | The region's width in cells, as last laid out (0 before the first layout). | Type: `number`. Read-only. |
| `rows` | <Documented /> | The region's height in cells, as last laid out (0 before the first layout). | Type: `number`. Read-only. |
| `every` | <Documented /> | Calls `fn` every `ms` milliseconds on the surface's frame clock until the returned function is called or the instance unmounts. | Type: `(ms: number, fn: () => void) => () => void`. Start it once (while `state` is still undefined), not on every call. |
| `onPointer` | <Documented /> | Sets the instance's pointer listener (one, a later call replaces it) and returns what clears it. See ClientPointerEvent for capture. | Type: `(fn: (event: ClientPointerEvent) => void) => () => void`. |
| `onKey` | <Documented /> | Sets the instance's key listener (one, a later call replaces it), reached while a click has given it the focus, Escape returns that. | Type: `(fn: (event: ClientKeyEvent) => void) => () => void`. |
| `post` | <Documented /> | Sends plain data to the plugin's hooks module: `e.data` of a `ui.message` only that plugin's hooks see, one per frame at most. | Type: `(data: JsonValue) => void`. A later post in the same frame replaces an undelivered one. At most 20,000 values, 32 deep, 100,000 characters. |

### `CodeProps`

The props of `Code`, source text every surface draws with the engine's own highlighter: coloured tokens, a line gutter on request, or a unified diff. Object with the fields `source`, `language?`, `path?`, `startLine?`, `format?`, `wrap?`. A leaf with no children. The color on screen is the engine's.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `source` | <Documented /> | The text drawn: source code, or under `format: 'diff'` one or more unified-diff hunks. | Type: `string`. Of any length, one drawing drawing 100000 characters in all, tab and newline its only control characters. A diff cut mid-hunk does not parse. |
| `language` | <Documented /> | A highlighter language id or alias (`typescript`, `ts`, `py`), a plugin-contributed grammar's included. | Type: `string`. Optional. Absent, the language is inferred from `path`, when neither resolves, the text is drawn plain. |
| `path` | <Documented /> | A file path the language is inferred from when `language` is absent: its extension or name, else a shebang on the first line. | Type: `string`. Optional. Drawn nowhere and never read: nothing touches the disk. |
| `startLine` | <Documented /> | The 1-based number of the first line of `source`: present, a dim right-aligned gutter numbers the lines from it, absent, no gutter. | Type: `number`. Optional. Ignored under `format: 'diff'`, whose hunks carry their own numbers. |
| `format` | <Documented /> | `'source'` (the default) draws `source` as code, `'diff'` reads it as unified-diff hunks and draws gutters, markers, add and remove colouring. | Type: `'source' \| 'diff'`. Optional. A diff holds `@@ -a,b +c,d @@` hunks. A source with no hunks is drawn as plain code. |
| `wrap` | <Documented /> | What a line wider than the room does, in Text's `wrap` vocabulary: `'wrap'` (the default) continues it on rows under the gutter. | Type: `'wrap' \| 'truncate-end'`. Optional. `'truncate-end'` cuts it at the edge with an ellipsis, Text's other spellings are refused, since a gutter leaves them no sense here. |

### `ElementChildren`

The `children` field every element constructor's props carry, appended beside its own props type: one child, or a list that may nest. Object with the field `children?`. A lone child is typed as the child itself. A mapped list beside a sibling is a nested list.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `children` | <Documented /> | One child, or a list of children that may nest. | Type: `RenderChildren`. Optional. |

### `ElementName`

Every element name of every surface: what a table handed out is completed to (an omitted one draws a fragment, see `ui.resolve`). Object with fields `[P in RenderSurface]`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `[P in RenderSurface]` | <Documented /> | For each render surface, the names of its elements. | Type: `keyof Elements[P]`. |

### `ImageBlitArgs`

A `$.ui.blit` argument swapping one of the caller's mounted keyed Images to its next picture, every call sends it, so a stream needs no generation. Object with the fields `requestId`, `key`, `source`, `columns?`, `rows?`. Byte and `file` sources fold to the last one per frame.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `requestId` | <Documented /> | The site the Image is drawn in, by the `requestId` this plugin draws it under. | Type: `string`. |
| `key` | <Documented /> | The Image's `key` in that drawing. | Type: `string`. |
| `source` | <Documented /> | The next picture (ImageSource): bytes, or a name the terminal reads. | Type: `ImageSource`. |
| `columns` | <Documented /> | Refused unless it is the mounted Image's width in cells. Absent, that. | Type: `number`. Optional. |
| `rows` | <Documented /> | Refused unless it is the mounted Image's height in cells. Absent, that. | Type: `number`. Optional. |

### `ImageProps`

The props of `Image`, the terminal surface's picture leaf: pixels over a box of cells where the terminal can (kitty, Ghostty), the `alt` elsewhere. Since `2.1.305` it also draws in iTerm2 3.5 and later with fullscreen rendering. The program detects it from an XTVERSION reply that names iTerm2 3.5 or later; otherwise it shows the `alt` text. Object with the fields `key?`, `source`, `columns`, `rows`, `alt`. A leaf with no children, `hover`, or `onPress`. A new `source` replaces the picture in place.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `key` | <Documented /> | The element's address within the drawing: what `$.ui.blit` names to swap. | Type: `string`. Optional. Unique among the Images of one tree, absent, only a redraw changes it. |
| `source` | <Documented /> | The picture (ImageSource): `{ png }` or `{ rgba, width, height }` bytes, or `{ file, format }` / `{ shm, format, width, height }` read here. | Type: `ImageSource`. |
| `columns` | <Documented /> | /** How many terminal columns wide, 1 to 255, the picture is scaled to fill the box and the site clips what its body cannot show. */ | Type: `number`. |
| `rows` | <Documented /> | How many terminal rows tall, 1 to 255. | Type: `number`. |
| `alt` | <Documented /> | What the picture says, drawn dim in its place where the picture cannot be (and read by a screen reader), required, may be a single space. | Type: `string`. |

### `ImageSource`

The picture an `Image` shows: base64 bytes the plugin holds (at most 2 MiB decoded), or the name of a file or POSIX shared-memory object it does not. The terminal reads and decodes a file name itself, so no pixel crosses `$`. An unreadable source draws a blank box, and a source equal to the last one sends nothing.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `png` | <Documented /> | A whole PNG file, base64. | Type: `string`. |
| `rgba` | <Documented /> | `width \* height` RGBA pixels, 4 bytes each, base64. | Type: `string`. |
| `width` | <Documented /> | Pixels per row, 1 to 2048. | Type: `number`. |
| `height` | <Documented /> | Rows of pixels, 1 to 2048. | Type: `number`. |
| `file` | <Documented /> | The absolute path of a regular file holding a whole PNG, at most 3072 bytes of path, read by the terminal, left in place. | Type: `string`. |
| `format` | <Documented /> | The file is a whole PNG, the terminal decodes it and sizes it itself. | Type: `'png'`. |
| `generation` | <Documented /> | A whole number that changes when the file's content does under the same path, so a redraw reads it again, absent, the path alone tells. | Type: `number`. Optional. |
| `file` | <Documented /> | The absolute path of a regular file of `width \* height` raw pixels, at most 3072 bytes of path, read by the terminal, left in place. | Type: `string`. On Linux a file under `/dev/shm` is memory. |
| `format` | <Documented /> | `rgba`, 4 bytes a pixel, or `rgb`, 3. | Type: `'rgba' \| 'rgb'`. |
| `width` | <Documented /> | Pixels per row, 1 to 4096. | Type: `number`. |
| `height` | <Documented /> | Rows of pixels, 1 to 4096. | Type: `number`. |
| `generation` | <Documented /> | A whole number that changes when the file's content does under the same path, so a redraw reads it again, absent, the path alone tells. | Type: `number`. Optional. |
| `shm` | <Documented /> | The name of a POSIX shared-memory object of `width \* height` raw pixels: `/` then up to 254 of `A-Z a-z 0-9 . _ -` (macOS takes 30). | Type: `string`. The terminal unlinks it after reading, so a name feeds one Image drawn once and is never sent again on a redraw, POSIX terminals only. |
| `format` | <Documented /> | `rgba`, 4 bytes a pixel, or `rgb`, 3. | Type: `'rgba' \| 'rgb'`. |
| `width` | <Documented /> | Pixels per row, 1 to 4096. | Type: `number`. |
| `height` | <Documented /> | Rows of pixels, 1 to 4096. | Type: `number`. |
| `generation` | <Documented /> | A whole number that changes when a fresh object reuses a name, so a redraw reads it again, absent, the name alone tells. | Type: `number`. Optional. |

### `InputProps`

The props of `Input`, every surface's text field: an address, optional texts, and the closures a change and a submit run. A leaf. One line, or several with `rows`. While it has focus every printable key reaches it and Esc returns them. A change and Enter raise `ui.input`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `key` | <Documented /> | The element's address: `e.element` at `ui.input`, what a matcher names. | Type: `string`. |
| `label` | <Documented /> | Text drawn before the field. | Type: `string`. Optional. |
| `placeholder` | <Documented /> | Text drawn dim in an empty field. | Type: `string`. Optional. |
| `value` | <Documented /> | The text the field holds when drawn, the person's typing replaces it until the hook draws another. | Type: `string`. Optional. |
| `submitLabel` | <Documented /> | What Enter does, in a word or two, drawn beside the field while it has focus (`send`). Defaults to `submit`. | Type: `string`. Optional. |
| `rows` | <Documented /> | How many lines tall the field is, a whole number of at least 1, from 2 it holds several lines, as the DOM's `<textarea rows>`. Defaults to 1. | Type: `number`. Optional. Drawn this tall. A longer text scrolls inside. Enter submits. Up and Down walk its rows, then go to the next element. |
| `autoFocus` | <Documented /> | The site's focus ring starts here when the site takes the keyboard, instead of on nothing, as the DOM's `autofocus`: Enter acts on it at once. | Type: `true`. Optional. A pane opened with `focus` takes it. Of several in one site, the first drawn wins. A ring the person has moved stays where it is. |
| `onInput` | <Documented /> | Runs on every change of the text, in the plugin's own environment: the bottom of a `ui.input` chain of kind `change`. | Type: `(value: string, e: UiInputArgument) => void`. Optional. The text is whole, its lines joined by `\n`. |
| `onSubmit` | <Documented /> | Runs on Enter with the text, in the plugin's own environment: the bottom of a `ui.input` chain of kind `submit`. No model turn unless it asks one. | Type: `(value: string, e: UiInputArgument) => void`. The text is whole, newlines kept and nothing trimmed. |

### `LinkProps`

The props of `Link`, a hyperlink every surface draws: an OSC 8 span on the terminal (else its text then the URL in dim), an anchor on desktop. An inline element. Its children are the text. With no children the `label` is the text. With neither, the URL is.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `href` | <Documented /> | Where the link goes, as written: any scheme, host and port, at most 2048 characters once what a terminal acts on is percent-encoded. | Type: `string`. A blank value draws plain text. On a remote surface only an `https:` URL is a link. A click opens what the surface opens. |
| `label` | <Documented /> | The text drawn when the element has no children, absent both, the URL itself is the text. | Type: `string`. Optional. |

### `MarkdownLeafProps`

What a `Markdown` carries across the boundary: its address, text, dimness and which links it answers, `onLinkPress` stays behind, a `press` instead.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `key` | <Documented /> | The element's address: what `e.element` carries and what a matcher names, present whenever the element carries a `press`. | Type: `string`. Optional. |
| `text` | <Documented /> | The markdown drawn, checked as a Text's string is. | Type: `string`. |
| `dimColor` | <Documented /> | The whole block dim, as `Text`'s `dimColor`, absent draws as false. | Type: `boolean`. Optional. |
| `pressableLinks` | <Documented /> | Which links a press belongs to, by `href` as written, absent, with a `press`, every link drawn. Compared with the pressed target only. | Type: `readonly string[]`. Optional. |

### `MarkdownProps`

The props of `Markdown`, a block of markdown every surface draws as it draws an assistant reply's text: its own renderer, links, tables, fences. A leaf with no children. With `onLinkPress` a press on a link raises `ui.press` addressed to `key`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `key` | <Documented /> | The element's address: `e.element` at `ui.press`, what a matcher names. Required with `onLinkPress`, since a press needs one, else optional. | Type: `string`. Optional. |
| `text` | <Documented /> | The markdown drawn, as an assistant reply would write it, a `<context>` block, hidden in a reply's own text, is drawn here as written. | Type: `string`. One drawing draws 100000 characters in all. A link that is not `https:`, `http:`, or `file:` draws as text. |
| `dimColor` | <Documented /> | The whole block dim, as `Text`'s `dimColor`: a thought, an aside. | Type: `boolean`. Optional. |
| `onLinkPress` | <Documented /> | What a press on a link in `text` runs, in the plugin's own environment: the bottom of a `ui.press` chain whose `e.link` names the link. | Type: `(link: PressedLink, e: UiPressArgument) => void`. Optional. Called on a plain single click where the surface reports clicks. Ctrl, alt, or cmd click opens the link as before. |
| `pressableLinks` | <Documented /> | Which links in `text` a press belongs to, by `href` as the markdown writes it, absent, every link drawn. Only with `onLinkPress`. | Type: `readonly string[]`. Optional. A link left out keeps the surface's own behavior. At most 256 entries of at most 2048 characters. |

### `NotifyOptions`

Options of `$.ui.notify`. Used by `$.ui.notify`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `title` | <Documented /> | What heads the notification, sent as the mod gives it: the engine puts no name of its own beside it. Left out or empty, the plugin's name. | Type: `string`. Optional. |

### `OnScreen`

The part of a transcript message the surface that drew it has on screen: units `first` to `last` of the message's `of`, counted from its start. Says which rows of a site show on screen. The terminal counts rows. Other surfaces use their own unit, so compare `first / of` there.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `first` | <Documented /> | The unit inside the viewport, from 0: on the terminal, `7` when the message's top seven rows are scrolled away. | Type: `number`. |
| `last` | <Documented /> | The unit inside the viewport, inclusive, at least `first`. | Type: `number`. |
| `of` | <Documented /> | The message's whole extent in the same unit, as laid out (a hook's tree taller than the engine's counts its own rows), more than `last`. | Type: `number`. One surface's numbers say nothing of another's: what the phone shows the terminal may not, and each `ui.render` carries its own surface's. |

### `PaneCloseInput`

The input of `ui.close`: the pane closing and why (PaneCloseOrigin). Closing an id that is not open does nothing. Used by `ui.close`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `id` | <Documented /> | What `$.ui.open` named the pane, pinned: `next(e)` passes it on. | Type: `string`. |
| `origin` | <Documented /> | Who closes it, set by the engine: a hook that answers without `next` keeps the pane open on `plugin` and `person`, never on `unload`. | Type: `PaneCloseOrigin`. |

### `PaneCloseOrigin`

Why a pane closes, as the engine stamped it at `ui.close`. `unload` drops a pane that nothing draws any more, before the hooks hear of it. `next(e)` passes the origin on as received.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | <Documented /> | `plugin`, a plugin's `$.ui.close`, `person`, the person's close mark or close key, `unload`, the engine's own. | Type: `'plugin' \| 'person' \| 'unload'`. |

### `PaneOpenArgs`

The argument of `$.ui.open`: which pane, its title, whether it asks the person's keyboard, its dialog manners, its size: rows inline, columns docked. An open that answers the person's input is placed at any width. One the plugin makes alone waits below 144 columns. Used by `$.ui.open`, `ui.open`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `id` | <Documented /> | Names the pane: 1-64 of letters, digits, `_` and `-`. One pane per id: opening an open id delivers the new title, never a second instance. | Type: `string`. Pinned at the hooks: `next(e)` passes it on, the title and focus rewrite. |
| `title` | <Documented /> | The pane's tab while more than one pane is open (with one, no title is drawn), and the `title` its hook sees, the id when omitted. | Type: `string`. Optional. An unpaired surrogate half (a `.slice()` through an emoji) is drawn as U+FFFD, a control character is refused. |
| `focus` | <Documented /> | A request, not a grant: the surface focuses (and raises) the pane only while the prompt has the keys over an empty composer. | Type: `true`. Optional. An element of the band or a pane the person holds, text in the composer, a dialog or a survey each refuse it: the pane opens without the keyboard. |
| `closeOnEscape` | <Documented /> | While the pane holds the keyboard, the key that hands it back (Escape) also closes it as the person's close does: `ui.close`, origin `person`. | Type: `true`. Optional. Escape at an idle, empty prompt closes the pane. A hook may refuse the close. Each open sets it anew. |
| `holdToasts` | <Documented /> | While the pane is the one shown the surface holds every transient toast: each other plugin's `$.ui.toast` and the engine's own, as this plugin's. | Type: `true`. Optional. Toasts wait while the pane is open. Use it for a dialog the person answers and leaves. Each open sets it anew. |
| `rows` | <Documented /> | The body rows the pane's content wants while seated inline above the prompt: it opens that tall, up to what the layout spares, not a third. | Type: `number`. Optional. A request, not a grant. A size the person dragged wins. The dock ignores it. A positive whole number. |
| `columns` | <Documented /> | The body columns the pane's content wants while docked beside a fullscreen transcript: the dock opens that wide, at most 45% of the terminal's columns and at least 24. Each open sets it anew. | Type: `number`. Optional. A request, not a grant. A width the person dragged or keyed wins, under the same ceiling. Since `2.1.305` the dock stays within 45% of the terminal's width, also for a requested or chosen width and a width kept from a wider terminal, with a floor of 24 columns. The cap is also at most the terminal's width minus 60 columns. The dock is hidden below 110 columns, so the floor and the cap never clash (the program; [v2.1.305 release](https://github.com/anthropics/claude-code/releases/tag/v2.1.305)). The inline block ignores it. A positive whole number. |

### `PressedLink`

The link a press landed on: one a `Markdown` drew, pressed where the surface reports presses (a plain click in the fullscreen terminal). What the surface knows of the cell pressed, not which occurrence: two links written with one target read the same here.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `href` | <Documented /> | The link's target as the surface drew it: for an `https:` link, the href as the markdown wrote it. | Type: `string`. |

### `RasterBlitArgs`

A `$.ui.blit` argument repainting one of the caller's mounted Rasters. `columns` and `rows`, when given, must be the mounted size (a resize is a redraw, `$.ui.invalidate("ui.render")`, not a blit).

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `requestId` | <Documented /> | The site the Raster is drawn in, by the `requestId` this plugin draws it under: one of its panes' ids, a tool row's `tool_use_id`, the band's. | Type: `string`. |
| `key` | <Documented /> | The Raster's `key` in that drawing. | Type: `string`. |
| `cells` | <Documented /> | The new cells, encoded as the element's `cells` are (RasterProps), for the mounted `columns \* rows`. | Type: `string`. |
| `columns` | <Documented /> | The width the cells are laid out for, refused unless it is the mounted Raster's. Absent, the mounted width. | Type: `number`. Optional. |
| `rows` | <Documented /> | The height the cells are laid out for, refused unless it is the mounted Raster's. Absent, the mounted height. | Type: `number`. Optional. |

### `RasterProps`

The props of `Raster`, the terminal surface's cell-grid leaf: a fixed box of cells, each a glyph, a foreground and a background, packed in `cells`. A leaf with no children, `hover`, or `onPress`. `$.ui.blit` repaints it in place. Terminal only. The palette holds 1024 color pairs.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `key` | <Documented /> | The element's address within the drawing: what `$.ui.blit` names to repaint it, unique among the Rasters of one tree. | Type: `string`. |
| `columns` | <Documented /> | How many terminal columns wide, 1 to 512, the site clips what its body cannot show. | Type: `number`. |
| `rows` | <Documented /> | How many terminal rows tall, 1 to 256. | Type: `number`. |
| `cells` | <Documented /> | Every cell, row-major: standard padded base64 of `columns \* rows` little-endian u32 triplets `[codePoint, foreground, background]`. | Type: `string`. Each cell is a code point plus colors. A code point is one printable width-1 BMP character. A color is `0x00RRGGBB`, or `0x01000000` for the terminal default. |

### `RenderElement`

What a render hook returns, and what `next(e)` resolves to: a plain-data tree of elements (a Box or Text is a StyledElement), strings as children. Union of the element types. Props are an allowed subset of the Ink `Box` and `Text` props. A tree with any other prop fails as a whole. Used by `ui.render`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `type` | <Documented /> | A button, on every surface: `[ label ]` on the terminal, a native button on a desktop, a press raises `ui.press` (`e.element` the key). | Type: `'Button'`. Built by `<Button>`. The `onPress` closure stays in the plugin's own environment under `press.handle`. |
| `props` | <Documented /> | The props of the element, typed `object`. | Type: `object`. |
| `press` | <Documented /> | Where the handler lives: the plugin whose hook drew the element, and the handle its environment keeps the `onPress` closure under. | Type: `object`. The runtime stamps the plugin as the tree leaves that hook. |
| `hover` | <Documented /> | Label style overrides (the Text set) the surface applies while the nearest keyed Box, or the group `scope` names, is hovered, plain data. | Type: `TextHoverProps`. Optional. |
| `children` | <Documented /> | What is drawn in the label's place, all of it one pressable: strings and `Text` (a chip, a dim part), any other element refused. | Type: `RenderNode[]`. Optional. Absent for a Button of a label alone, drawn as it always was. |
| `type` | <Documented /> | A text field on every surface, of one line or of `rows`, a change and Enter raise `ui.input` (`e.element`, `e.kind`, `e.value` the text). | Type: `'Input'`. Built by `<Input>`. The `onInput` and `onSubmit` closures stay in the plugin's environment. A leaf with no children. |
| `props` | <Documented /> | The props of the element, typed `object`. | Type: `object`. |
| `press` | <Documented /> | Where the handlers live: the plugin whose hook drew the element, and the handle its environment keeps the closures under. | Type: `object`. The runtime stamps the plugin as the tree leaves that hook. |
| `children` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `type` | <Documented /> | A one-of-several picker on every surface, a pick raises `ui.select` (`e.element` the key, `e.value` the option's value). | Type: `'Select'`. Built by `<Select>` or the table's `t.Select`. The `onSelect` closure stays in the plugin's own environment under `press.handle`, held as a Button's is. A leaf: no children. |
| `props` | <Documented /> | The props of the element, typed `object`. | Type: `object`. |
| `press` | <Documented /> | Where the handler lives: the plugin whose hook drew the element, and the handle its environment keeps the closure under. | Type: `object`. The runtime stamps the plugin as the tree leaves that hook. |
| `children` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `type` | <Documented /> | A hyperlink every surface draws: an OSC 8 span on the terminal (its text then the URL in dim where unsupported), an anchor on desktop. | Type: `'Link'`. Inline: its children are the text, strings and inline elements, absent children the label, absent both the URL. `href` is drawn as written, one that is no string draws the text plain. |
| `props` | <Documented /> | The props of the element, typed `LinkProps`. | Type: `LinkProps`. |
| `children` | <Documented /> | The child nodes. | Type: `RenderNode[]`. Optional. |
| `type` | <Documented /> | Source code every surface draws with the engine's highlighter, tokens coloured by language, under `format: 'diff'`, unified-diff hunks. | Type: `'Code'`. A leaf. A dim gutter numbers the lines from `startLine`. A diff has two gutters and add and remove backgrounds. |
| `props` | <Documented /> | The props of the element, typed `CodeProps`. | Type: `CodeProps`. |
| `children` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `type` | <Documented /> | A block of markdown every surface draws as it draws an assistant reply's text: its own renderer, theme, hyperlinks and highlighting. | Type: `'Markdown'`. Built by `<Markdown>`. A leaf. Without a `press` its links open as the surface opens links. |
| `props` | <Documented /> | The props of the element, typed `MarkdownLeafProps`. | Type: `MarkdownLeafProps`. |
| `part` | <Documented /> | Whose `key` it is: the engine sets it on a keyed element as the tree leaves its hook, as on a Box (new in 2.1.307). | Type: `PluginStamp`. Optional. |
| `children` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `type` | <Documented /> | A `Markdown` whose plugin answers the links it drew (`onLinkPress`): a press on one raises `ui.press` with `e.link`, the surface opens none. | Type: `'Markdown'`. |
| `props` | <Documented /> | The props of the element, typed `MarkdownLeafProps`. | Type: `MarkdownLeafProps`. |
| `press` | <Documented /> | Where the `onLinkPress` handler lives: the plugin whose hook drew the element, and the handle its environment keeps the closure under. | Type: `object`. The runtime stamps the plugin as the tree leaves that hook. |
| `children` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `type` | <Documented /> | A region one of the plugin's SURFACE MODULES, named by path, draws and handles input for on the drawing thread, without `$` (ClientModule). | Type: `'Client'`. One instance for each plugin. It lives while the node stays in the tree and talks to the plugin through `ui.message`. |
| `props` | <Documented /> | The props of the element, typed `ClientProps`. | Type: `ClientProps`. |
| `client` | <Documented /> | Whose surface module `props.module` names: the plugin whose hook drew the element, stamped by the runtime as the tree leaves it. | Type: `object`. |
| `children` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `type` | <Documented /> | A vector drawing, the remote surfaces' alone: the SVG markup is the element's data, drawn in an isolated box, off the page. | Type: `'Svg'`. A leaf. A surface whose table lacks it refuses the tree. Put a press that others should see on an enclosing `Button`. |
| `props` | <Documented /> | The props of the element, typed `SvgProps`. | Type: `SvgProps`. |
| `children` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `type` | <Documented /> | A grid of terminal cells, the terminal surface's alone: each cell a glyph, a foreground and a background, packed in `props.cells`. | Type: `'Raster'`. A leaf, one node however many cells. `$.ui.blit` repaints it in place. A surface whose table lacks it refuses the tree. |
| `props` | <Documented /> | The props of the element, typed `RasterProps`. | Type: `RasterProps`. |
| `raster` | <Documented /> | Whose Raster: the plugin whose hook drew the element, stamped by the runtime as the tree leaves it, the one plugin whose blit reaches it. | Type: `object`. |
| `children` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `type` | <Documented /> | A picture, the terminal surface's alone: `props.source` drawn over a box of cells where the terminal can, `props.alt` where it cannot. | Type: `'Image'`. A leaf. `$.ui.blit` swaps its picture. A surface without it refuses the tree. |
| `props` | <Documented /> | The props of the element, typed `ImageProps`. | Type: `ImageProps`. |
| `image` | <Documented /> | Whose Image: the plugin whose hook drew the element, stamped by the runtime as the tree leaves it, the one plugin whose blit reaches it. | Type: `object`. |
| `children` | <Documented /> | Never set in this form. | Type: `undefined`. Optional. |
| `type` | <Documented /> | The component core draws itself, with the props held under `ref`. | Type: `'engine'`. |
| `ref` | <Documented /> | Which drawing: the number core answered from `next(e)`, under which it holds the props it received, 0 draws the original props. | Type: `number`. |

### `RenderInputOf`

One `ui.render` input, for a component narrowed to one surface.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `surface` | <Documented /> | Where the tree will be drawn, one literal per member, so `if (e.surface === "terminal")` narrows `e` and `$.ui.resolve(e)`. | Type: `P`. Over the wire it is what the client declared, a rendering fact and not a trust signal: do not key policy on it. |
| `component` | <Documented /> | Which component this instance is, the key a matcher narrows on. | Type: `C`. |
| `requestId` | <Documented /> | The instance: the tool_use_id for a dialog or tool row, the message id for a message, the agent id for a spinner. | Type: `string`. Two drawings of one component are two instances. |
| `viewport` | <Documented /> | The size of what the surface draws into, in character cells, and whether its layout docks a pane, absent where no surface has measured. | Type: `RenderViewport`. Optional. Part of the envelope, so a rewrite keeps it. A change of width re-draws every hooked site once the resize settles. |
| `props` | <Documented /> | The component's plain-data props. | Type: `RenderPropsOf[C]`. |

### `RenderResultOf`

What a `ui.render` hook returns and what `next(e)` resolves to: a RenderElement tree, the same for every component.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `[C in RenderComponent]` | <Documented /> | For each component, a `RenderElement` tree. | Type: `RenderElement`. |

### `RenderViewport`

The size of what a surface draws into, in character cells of the surface's monospace metric, and whether its layout docks a pane. On the terminal it is the columns and rows of the conversation. On a remote surface it is the pane size.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `columns` | <Documented /> | Cells across. A tree wider than this wraps or truncates, as its Text props say. | Type: `number`. |
| `rows` | <Documented /> | Cells down the whole surface, not the room left for this component. | Type: `number`. Informational: a change of height alone re-draws nothing and keys no new evaluation, so a hook reads it as of the last width or props change. |
| `isFullscreen` | <Documented /> | Whether this surface docks a pane beside the transcript, so a pane a plugin opens unasked is a sidebar, not a takeover, absent is unknown. | Type: `boolean`. Optional. The terminal always says it: `true` is fullscreen. A remote surface reports it with its size. A change re-draws. |

### `ResolveInputOf`

One `ui.resolve` input, for a component on one surface.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `surface` | <Documented /> | Where the table draws, one literal per member, so a hook that narrows it narrows the table `next(e)` resolves to. | Type: `P`. |
| `component` | <Documented /> | Which drawing the table is resolved for, the key a matcher narrows on. | Type: `C`. |

### `SelectOption`

One option of a `Select`: the value `onSelect` and `ui.select` carry, and the text drawn for it (the value when absent).

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `value` | <Documented /> | The value `onSelect` and `ui.select` carry. | Type: `string`. |
| `label` | <Documented /> | The text drawn for the option. The value when absent. | Type: `string`. Optional. |

### `SelectProps`

The props of `Select`, every surface's one-of-several picker: an address, a label, the options, the one selected, the closure a pick runs. A leaf. Arrows move, Enter picks, and Esc returns to the prompt. A pick raises `ui.select`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `key` | <Documented /> | The element's address: `e.element` at `ui.select`, what a matcher names. | Type: `string`. |
| `label` | <Documented /> | Text drawn before the current value. | Type: `string`. Optional. |
| `options` | <Documented /> | What can be picked, in the order drawn, at least one, values unique. | Type: `readonly SelectOption[]`. |
| `value` | <Documented /> | Which option is selected when drawn, the person's pick replaces it until the hook draws another. | Type: `string`. Optional. |
| `autoFocus` | <Documented /> | The site's focus ring starts here when the site takes the keyboard, instead of on nothing, as the DOM's `autofocus`: Enter acts on it at once. | Type: `true`. Optional. A pane opened with `focus` takes it. Of several in one site, the first drawn wins. A ring the person has moved stays where it is. |
| `onSelect` | <Documented /> | Runs on a pick with the option's value, in the plugin's own environment: the bottom of a `ui.select` chain. No model turn unless it asks one. | Type: `(value: string, e: UiSelectArgument) => void`. |

### `SiteScroll`

Where a site's window sits over the tree a hook drew in it (a pane's body, the band): the engine's to move (the person scrolls), the plugin's to read.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `offset` | <Documented /> | The first row of the tree the window showed when the hook was asked, 0 at the top. Read-only. | Type: `number`. A move through `ui.scroll` asks again. The engine's own moves on the terminal do not. The next ask reads where the window stands. |
| `bodyRows` | <Documented /> | How many rows of the tree the window may show at once: the rows the surface gave the body, whatever the tree's own height. Read-only. | Type: `number`. |

### `SiteView`

Which transcript the person has on screen where a site draws: the main conversation's, or one agent's, opened from the tasks list. A site reads it. A switch re-runs the site's hooks. `$.ui.view` takes the same shape. Used by `$.ui.view`, `ui.view`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `agentId` | <Documented /> | The agent whose transcript is in view: the `id` `$.agent.list()` gives it, the `agentId` its `turn.step` and `tool.call` events carry. | Type: `string`. Optional. Absent while the main conversation is in view. Read-only on a site. |

### `StyledElement`

The shape a `Box` and a `Text` share in a render tree: allowlisted props, an optional `hover`, the group stamp a `hover.scope` earns, the mark of the plugin whose drawing starts there, and children. `Tag` says if it is a `Box` or a `Text`. `Hover` holds the hover props. Every surface draws both.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `type` | <Documented /> | Which of the two it is: `Box` or `Text`. | Type: `Tag`. |
| `props` | <Documented /> | A Box's layout, position, spacing and border props and the `key` that makes it a hover scope, a Text's colors and styles. Others are refused. | Type: `Record<string, string \| number \| boolean>`. Optional. |
| `hover` | <Documented /> | Style overrides the surface applies while the pointer is over the nearest keyed Box, or over any member of the group `scope` names. | Type: `Hover`. Optional. Plain data, no hook. It never moves a sibling. `display` only reveals a `Box` that is drawn as `"none"`. |
| `group` | <Documented /> | Whose group `hover.scope` names, absent without a `scope`. | Type: `PluginStamp`. Optional. |
| `part` | <Documented /> | Says whose part of the drawing starts here. The engine sets it on each hook's returned root. It proves no author. | Type: `PluginStamp`. Optional. |
| `children` | <Documented /> | In order: a Box holds elements and strings (core wraps each string in a Text), a Text holds strings and inline elements, never an engine node. | Type: `RenderNode[]`. Optional. |

### `SvgProps`

The props of `Svg`, the remote surfaces' vector leaf: the markup is the element's data, as a string is a Text's, drawn isolated. A leaf with no children. The engine bounds the markup. The surface never lets it reach the page.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `source` | <Documented /> | The SVG document, `<svg ...>...</svg>`, at most 131072 characters. | Type: `string`. |
| `alt` | <Documented /> | What the drawing says, for a reader that cannot see it, required, since a surface without the element draws nothing else of it. | Type: `string`. |
| `width` | <Documented /> | CSS pixels, absent, the box takes the markup's own width up to the slot. | Type: `number`. Optional. |
| `height` | <Documented /> | CSS pixels, absent, the markup's own height at the drawn width. | Type: `number`. Optional. |
| `isInteractive` | <Documented /> | `true` draws the SVG in a script-less sandboxed frame so hover, CSS `:hover`, SMIL animation and `<title>` tooltips work, absent, an image. | Type: `boolean`. Optional. It never enables script or event-handler attributes. Put presses on an enclosing element. |

### `TextHoverProps`

The `Text` props a `hover` may override (its colors and styles, not its wrapping) and `scope`, the hover group it joins, a `Button`'s label too.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `scope` | <Documented /> | Names a hover group of this plugin's: every element it draws with the same `scope`, in any site on the surface, lights while any is hovered. | Type: `string`. Optional. A scope is 1 to 64 characters with no control characters. Other plugins' elements with the same string are a different group. |
| `color` | <Documented /> | The text color. | Type: `Color`. Optional. |
| `backgroundColor` | <Documented /> | The background color. | Type: `Color`. Optional. |
| `dimColor` | <Documented /> | `true` dims the color. | Type: `boolean`. Optional. |
| `bold` | <Documented /> | `true` makes the text bold. | Type: `boolean`. Optional. |
| `italic` | <Documented /> | `true` makes the text italic. | Type: `boolean`. Optional. |
| `underline` | <Documented /> | `true` underlines the text. | Type: `boolean`. Optional. |
| `strikethrough` | <Documented /> | `true` strikes the text through. | Type: `boolean`. Optional. |
| `inverse` | <Documented /> | `true` swaps the text and background colors. | Type: `boolean`. Optional. |

### `TextProps`

The props of `Text`: colors, styles, and the size, weight, face and digits each surface draws its own way. Colors are a theme key or a raw color.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `hover` | <Documented /> | Style overrides applied by the surface while the pointer is over the nearest enclosing keyed `Box`, or, given a `scope`, over its group. | Type: `TextHoverProps`. Optional. No hook runs and nothing crosses to the plugin. Refused outside a keyed Box unless it names a `scope`. |
| `color` | <Documented /> | The text color. | Type: `Color`. Optional. |
| `backgroundColor` | <Documented /> | The background color. | Type: `Color`. Optional. |
| `dimColor` | <Documented /> | The run dimmed: on the terminal, drawn in the theme's dim color. | Type: `boolean`. Optional. Faint too where that color is the palette's own white or black, as plain text is, unless the run is bold, inverse or on a background of any other color. |
| `size` | <Documented /> | The text size, a step on a scale each surface maps to its own type sizes. | Type: `'caption' \| 'footnote' \| 'body' \| 'heading' \| 'title'`. Optional. Absent, the enclosing Text's, or `body`. The terminal has one size and ignores it. |
| `weight` | <Documented /> | How heavy the text is, drawn at the nearest weight the surface has. | Type: `'regular' \| 'medium' \| 'semibold' \| 'bold'`. Optional. Absent, the enclosing Text's. The terminal draws `semibold` and `bold` as bold and cannot draw a lighter weight inside a bold Text. |
| `mono` | <Documented /> | The surface's monospaced face at the same size. The terminal is always monospaced and ignores it. | Type: `boolean`. Optional. |
| `tabular` | <Documented /> | Digits of one width, for a number that changes by itself on screen (a timer, a percentage) or numbers stacked in a column to line up. | Type: `boolean`. Optional. The terminal's digits are already one cell each. |
| `bold` | <Documented /> <Deprecated note="Use weight" /> | The older spelling of a semibold weight. | Type: `boolean`. Optional. Deprecated: Use `weight`. `bold: true` is read as `weight: 'semibold'`, and an explicit `weight` outranks it, a `hover`'s `bold` still applies. |
| `italic` | <Documented /> | `true` makes the text italic. | Type: `boolean`. Optional. |
| `underline` | <Documented /> | `true` underlines the text. | Type: `boolean`. Optional. |
| `strikethrough` | <Documented /> | `true` strikes the text through. | Type: `boolean`. Optional. |
| `inverse` | <Documented /> | `true` swaps the text and background colors. | Type: `boolean`. Optional. |
| `dir` | <Documented /> | The direction the text reads in: `rtl` for a right-to-left script, so a row of it that opens with a Latin word or a number reads right to left. | Type: `'ltr' \| 'rtl'`. Optional. When absent, each row reads by its first strong letter. `rtl` rows are flush right. |
| `wrap` | <Documented /> | How text that is too long is wrapped or cut. | Type: `'wrap' \| 'end' \| 'middle' \| 'truncate' \| 'truncate-start' \| 'truncate-middle' \| 'truncate-end'`. Optional. |

### `ToastOptions`

Options of `$.ui.toast`. Used by `$.ui.toast`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `timeoutMs` | <Documented /> | How long the line stays, in milliseconds, default 4000. | Type: `number`. Optional. |

### `ToolGroupCall`

One tool call of a ToolGroup, as `ui.render` sees it under `calls`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `tool_use_id` | <Documented /> | The id `tool.call` carried for this call (`e.tool_use_id` there), so a hook that saw the call finds its row in the group. Read-only. | Type: `string`. Optional. Absent on a desktop host that predates it. |
| `tool` | <Documented /> | Which one the call ran (`Bash`, `Read`, `Grep`, ...). | Type: `string`. |
| `input` | <Documented /> | The call's input, as the model sent it. | Type: `unknown`. |
| `isRunning` | <Documented /> | True while the call is still running. | Type: `boolean`. |
| `isErrored` | <Documented /> | True when the call ended in an error. | Type: `boolean`. |
| `isInterrupted` | <Documented /> | True when an abort ended the call, as on `ToolUse`. | Type: `boolean`. |
| `output` | <Documented /> | As on `ToolUse`, undefined while the call runs. | Type: `unknown`. Optional. |

### `UiBlitResult`

What `$.ui.blit` resolves to and what a `ui.blit` hook's `{ value }` holds: `{}` once the cells or source are the next frame's, or why not. Used by `$.ui.blit`, `ui.blit`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `deny` | <Documented /> | Absent when the cells or source were taken, else why not. | Type: `string`. Optional. Says why nothing was drawn: not mounted, wrong size, bad cells or source. With no surface `no-surface` heads it. |

### `UiCopyArgs`

The argument of `$.ui.copy` and the input of `ui.copy`: the text, and which surface's clipboard takes it, the caller's choice. A hook above may rewrite either field, refuse with `{ deny }`, or answer `{ value }`. Used by `$.ui.copy`, `ui.copy`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | <Documented /> | What the person pastes afterwards, verbatim: any string, newlines and all, never shown on screen by the copy itself. | Type: `string`. |
| `surface` | <Documented /> | Which surface to copy on, the caller's choice, one the session draws on: a press, field or message hook passes `e.surface`. | Type: `RenderSurface`. Optional. When left out, the first of `$.session.surfaces()` is used. A matcher can narrow on it. |

### `UiCopyResult`

What `$.ui.copy` resolves to and what a `ui.copy` hook's `{ value }` holds: whether the text reached a clipboard (`isCopied`), else why not. Example: `if (!(await $.ui.copy({ text, surface: e.surface })).isCopied) warn()`. Used by `$.ui.copy`, `ui.copy`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `isCopied` | <Documented /> | True: the surface took the text: the terminal's clipboard tool or its OSC 52 write, or a remote surface's app writing its own clipboard. | Type: `true`. OSC 52 does not report back: a terminal that drops it, with no tool on the machine (pbcopy, wl-copy, xclip, PowerShell, tmux's buffer), still reads true. |
| `isCopied` | <Documented /> | False: nothing was copied. | Type: `false`. |
| `reason` | <Documented /> | Why not, a closed set: `no-surface`, `no-clipboard` or `refused`, a hook above answering without copying says `refused`. | Type: `'no-surface' \| 'no-clipboard' \| 'refused'`. `no-surface` means nothing draws. `no-clipboard` means no clipboard tool ran and nothing was written. |

### `UiFaultInput`

The input of `ui.fault`: a `Client` this plugin drew failed on a surface, addressed by where the instance is drawn. Every key is the engine's word, pinned: `next(e)` passes them on, a rewrite that leaves one out keeps it, one that changes it fails the hook. Used by `ui.fault`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `surface` | <Documented /> | Where the instance failed: `terminal`, or the remote surface that told the engine (`desktop`). | Type: `RenderSurface`. |
| `component` | <Documented /> | The render component the `Client` was drawn in (`AbovePrompt`, `Pane`, ...). | Type: `RenderComponent`. |
| `requestId` | <Documented /> | The engine's id for the drawing the `Client` sits in: the `requestId` the `ui.render` hook that drew it saw. | Type: `string`. |
| `element` | <Documented /> | The `Client`'s `key`: which instance failed. | Type: `string`. |
| `module` | <Documented /> | The `Client`'s `module`: which surface module ran there, as its path under the plugin's folder. | Type: `string`. |
| `phase` | <Documented /> | When it failed (UiFaultPhase): loading, drawing, or running after it had drawn. | Type: `UiFaultPhase`. The step that failed. The terminal tries again once with new props or a new size. |
| `reason` | <Documented /> | Why, as the surface said it: one line of 1 to 200 characters, no control character in it, a longer one cut and ended with an ellipsis. | Type: `string`. Untrusted text. It may quote what the plugin's module threw. Show or log it. Never act on it. |

### `UiFocusArgs`

What a plugin's `$.ui.focus(args)` takes: one of its own elements, by the `key` it drew it under, in one of its sites that holds the keyboard now. The engine resolves it to the site's focus ring and raises `ui.focus`. A site that holds no keyboard gets `{ deny }`. Used by `$.ui.focus`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `requestId` | <Documented /> | The site, by the `requestId` this plugin draws it under: one of its panes' ids, or the band's. | Type: `string`. |
| `key` | <Documented /> | The element's `key`: a `Button`, `Input` or `Select` this plugin drew in that site, of several under one key, the first in document order. | Type: `string`. The element key. The engine waits a short time for one that the next drawing brings. An element never drawn gets `{ deny }`. |

### `UiFocusInput`

The input of `ui.focus`: a site's focus ring about to move onto one of the elements a hook drew in it (a `Button`, `Input` or `Select`), or off them. Every key but `element` is pinned. A rewrite that changes a pinned key fails the hook. Used by `ui.focus`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `component` | <Documented /> | Which site: a `Pane` body or the `AbovePrompt` band. | Type: `UiFocusComponent`. |
| `requestId` | <Documented /> | The instance the `ui.render` hook drawing the site sees: the pane's id, or the band's one id. | Type: `string`. |
| `plugin` | <Documented /> | Whose `ui.render` hook drew the element taking the ring, absent with `element`. Read-only. | Type: `string`. Optional. |
| `element` | <Documented /> | The `key` of the element taking the ring, as `ui.press` names it, absent for one of the engine's own stops (a pane's close mark or another's tab). | Type: `string`. Optional. `next({ ...e, element })` lands it on another element `plugin` drew in the site instead, one not drawn there is core's `{ deny }`. |
| `origin` | <Documented /> | Who moves it (UiFocusOrigin), set by the engine where the move starts. | Type: `UiFocusOrigin`. |

### `UiFocusOrigin`

Who moves the ring at `ui.focus`, as the engine stamps it where the move starts, a closed set a matcher narrows on. `next(e)` passes it on as received, no hook sets one.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | <Documented /> | The person, by Tab, the arrows or a click while the site holds the keyboard. | Type: `'person'`. |
| `kind` | <Documented /> | A plugin's `$.ui.focus`, or its `autoFocus` element taking the ring as the site takes the keyboard. | Type: `'plugin'`. |
| `name` | <Documented /> | The focusing plugin's name. | Type: `string`. |

### `UiFocusResult`

What a `ui.focus` hook returns, what `next(e)` resolves to, and what `$.ui.focus` hands back: `{}` once the ring moved, or why it did not. As `ui.scroll` spells it. Used by `$.ui.focus`, `ui.focus`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `deny` | <Documented /> | Absent when the ring is where the chain left it, else why nothing moved. | Type: `string`. Optional. Says why the focus did not move: a hook kept the ring, the site is not this plugin's, or another move came first. With no surface `no-surface` heads it. |

### `UiInputArgument`

The argument of `ui.input`: a change of, or a submit from, an `Input` a render hook drew. Flat and frozen like every event's. Another plugin addresses one field by matcher: `on("ui.input", { plugin: "roster", element: "reply" }, ...)`. Used by `ui.input`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `plugin` | <Documented /> | Whose `ui.render` hook drew the element. | Type: `string`. |
| `element` | <Documented /> | The `key` the hook gave its `Input`: its address, what a matcher names. | Type: `string`. |
| `component` | <Documented /> | The render component the element was drawn in (`AbovePrompt`, `ToolUse`, ...). | Type: `RenderComponent`. |
| `requestId` | <Documented /> | The instance the element was drawn in: the `requestId` the `ui.render` hook that drew it saw (a tool row's tool_use_id, a pane's id). | Type: `string`. |
| `surface` | <Documented /> | Where the typing came from, one literal per member, so `if (e.surface === "terminal")` narrows `e`. | Type: `RenderSurface`. |
| `kind` | <Documented /> | `change` after every edit of the text, `submit` on Enter. | Type: `'change' \| 'submit'`. |
| `value` | <Documented /> | The field's whole text at that moment, a hook above may rewrite it for the plugins beneath and the element's own handler. | Type: `string`. A field of several lines joins them with `\n`, a submit trims nothing. |

### `UiInputResult`

What a `ui.input` hook returns and what `next(e)` resolves to. Core runs the element's `onInput` (kind `change`) or `onSubmit` (kind `submit`) closure and answers `{ element, value }`. Used by `ui.input`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `element` | <Documented /> | Which handler the input reached, by its Input's `key`. | Type: `string`. |
| `value` | <Documented /> | The text the handler received. | Type: `string`. |

### `UiLogOptions`

Options of `$.ui.log`. Used by `$.ui.log`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `to` | <Documented /> | Where the line goes (UiLogSink), `transcript` when left out. A hook on `ui.log` reads it as `e.to` and may send the line elsewhere. | Type: `UiLogSink`. Optional. |

### `UiMessageArgument`

The argument of `ui.message`: what a `Client` instance's surface module posted (`surface.post(data)`), addressed by where the instance is drawn. The origin is `client`, so `data` is input to validate, not a fact. A hook may not rewrite the other fields. Used by `ui.message`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `surface` | <Documented /> | Where the instance is drawn: `terminal`, or `desktop` once it has them. | Type: `RenderSurface`. |
| `component` | <Documented /> | The render component the `Client` was drawn in (`AbovePrompt`, `Pane`, ...). | Type: `RenderComponent`. |
| `requestId` | <Documented /> | The engine's id for the drawing the `Client` sits in: the `requestId` the `ui.render` hook that drew it saw. | Type: `string`. |
| `element` | <Documented /> | The `Client`'s `key`: which instance posted. | Type: `string`. |
| `module` | <Documented /> | The `Client`'s `module`: which surface module runs there, as its path under the plugin's folder. | Type: `string`. |
| `data` | <Documented /> | What the instance posted: plain data (JsonValue) of at most 100000 characters, typed `unknown` since it came from code. Rewritable. | Type: `unknown`. |

### `UiMessageResult`

What a `ui.message` hook returns and what `next(e)` resolves to. Core answers `{}`. A hook that answers `{ props }` hands the posting instance its next props with no `ui.render` run. Used by `ui.message`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `props` | <Documented /> | The instance's next props, plain data (JsonValue) bounded as a `Client`'s props are, absent leaves the instance's props as they were. | Type: `unknown`. Optional. |

### `UiNotifyResult`

What `$.ui.notify` resolves to and what a `ui.notify` hook's `{ value }` holds: whether a channel sent it (`isSent`) and which, else why not. Example: `if (!(await $.ui.notify(text)).isSent) $.ui.toast(text)`. Used by `$.ui.notify`, `ui.notify`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `isSent` | <Documented /> | True: the person's notification channel wrote it to their terminal, as its notification sequence, its bell, or both. | Type: `true`. A terminal does not report back: one that drops the sequence, or a system that mutes its banners, still reads true. |
| `channel` | <Documented /> | Which channel sent it, spelt as the `preferredNotifChannel` setting spells it, under `auto`, the one their terminal resolved to. | Type: `'iterm2' \| 'iterm2_with_bell' \| 'kitty' \| 'ghostty' \| 'terminal_bell'`. `terminal_bell` rings and shows neither the text nor the title. |
| `isSent` | <Documented /> | False: no channel sent it. | Type: `false`. |
| `reason` | <Documented /> | Why not, a closed set: `disabled`, `no-channel`, `no-surface` or `refused`, which a hook above says when it answers without sending. | Type: `'disabled' \| 'no-channel' \| 'no-surface' \| 'refused'`. `disabled` means `notifications_disabled` is set. `no-channel` means no terminal that notifies. |

### `UiOpenResult`

What `$.ui.open` resolves to and what a `ui.open` hook's `{ value }` holds. `isPlaced` says if a surface draws the pane now. Asked panes place at any width, and unasked panes need 144 columns (110 for an id the person opened before).

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `isPlaced` | <Documented /> | True: the pane is open and drawn (or retitled in place), the first `ui.render` for `{ component: "Pane", requestId: id }` follows. | Type: `true`. |
| `isPlaced` | <Documented /> | False: the pane is open but undrawn: opened unasked on a narrow terminal, or where no surface places panes, or none is attached. | Type: `false`. With none attached keep the pane, which stays open: `session.attach` is raised when one is, `$.ui.panes()` then says placed, and a surface that places panes asks the pane's `ui.render`. |
| `reason` | <Documented /> | Why it waits and what seats it: the floor it fell under (144 columns unasked, 110 for an id the person once opened) and the width now. | Type: `string`. Says why a pane is not placed. It starts with `no-surface` when no surface is attached, such as in a `-p` run. |

### `UiPane`

One of this plugin's open panes as `$.ui.panes()` lists it: the pane's id and title, and where it stands with the person right now. Where the surface seated the pane (`dock` or `inline`) is on the `Pane` render props. Used by `$.ui.panes`, `ui.panes`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `id` | <Documented /> | What `$.ui.open({ id })` named it, which `$.ui.close` and its `ui.render` `requestId` name too. | Type: `string`. |
| `title` | <Documented /> | Its tab's label: the `title` of its latest open, or the id. | Type: `string`. |
| `isShown` | <Documented /> | True for the one pane the surface shows, the rest are tabs behind it. | Type: `boolean`. |
| `isFocused` | <Documented /> | True while the person has given it the keyboard. | Type: `boolean`. |
| `isPlaced` | <Documented /> | False while it waits undrawn: opened unasked on a terminal too narrow for an unrequested pane, its `$.ui.open` answered `{ isPlaced: false }`. | Type: `boolean`. It turns true when the person opens the pane or the terminal widens to the floor. It is false on every row while an open answers `no-surface`. |

### `UiPressArgument`

The argument of `ui.press`: a press on a `Button` a render hook drew, or on an answered `Markdown` link. Flat and frozen like every event's. Another plugin addresses one button by matcher: `on("ui.press", { plugin: "explainer", element: "explain" }, ...)`. Used by `ui.press`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `plugin` | <Documented /> | Whose `ui.render` hook drew the element. | Type: `string`. |
| `element` | <Documented /> | The `key` the hook gave its `Button` or `Markdown`: its address, what a matcher names. | Type: `string`. |
| `component` | <Documented /> | The render component the element was drawn in (`ToolUse`, `AssistantMessage`, ...). | Type: `RenderComponent`. |
| `requestId` | <Documented /> | The instance the element was drawn in: the `requestId` the `ui.render` hook that drew it saw (a tool row's tool_use_id, a pane's id). | Type: `string`. |
| `surface` | <Documented /> | Where the press came from, one literal per member, so `if (e.surface === "terminal")` narrows `e`. | Type: `RenderSurface`. |
| `link` | <Documented /> | Where the press landed, when the element is a `Markdown` whose links its plugin answers (`onLinkPress`), absent for a `Button`. | Type: `PressedLink`. Optional. A hook may rewrite its `href` for the hooks and the closure beneath, one that adds or drops it fails, and the press goes on beneath it. |

### `UiPressResult`

What a `ui.press` hook returns and what `next(e)` resolves to. Core runs the element's `onPress` closure and answers `{ element }`. Used by `ui.press`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `element` | <Documented /> | Which handler the press reached, by its Button's `key`. | Type: `string`. |

### `UiScrollArgs`

What a plugin's `$.ui.scroll(args)` takes: what to bring into view, in which of its sites, and where in the window it lands. The engine resolves it to a window and an offset. A transcript row shows only while the plugin answers the person's own input. Used by `$.ui.scroll`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `to` | <Documented /> | What to reveal (UiScrollTarget): a render instance by `requestId`, one of this plugin's elements by `key`, or the `start` or `end` of `in`. | Type: `UiScrollTarget`. |
| `in` | <Documented /> | The site to scroll, by the `requestId` this plugin draws it under: one of its panes' ids, or the band's. | Type: `string`. Optional. Required with `start` and `end`, with `{ key }` it picks the site when the key is drawn in several. |
| `block` | <Documented /> | Where the target lands in the window (UiScrollBlock), `nearest` when left out, so a row already showing does not move. | Type: `UiScrollBlock`. Optional. |

### `UiScrollInput`

The input of `ui.scroll`: a site's window asked to move over the tree a hook drew in it (a pane's body, the band above the prompt). Every key but `offset` is pinned. A rewrite that changes one fails the hook. Used by `ui.scroll`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `component` | <Documented /> | Which site: a `Pane` body or the `AbovePrompt` band. | Type: `UiScrollComponent`. |
| `requestId` | <Documented /> | The instance the `ui.render` hook drawing the site sees: the pane's id, or the band's one id. | Type: `string`. |
| `offset` | <Documented /> | The first row the window is to show, 0 at the top: the row it shows now plus `by`, clamped to the tree, or where `$.ui.scroll` resolved. | Type: `number`. `next({ ...e, offset })` moves it elsewhere (a clamp), one past the tree's end lands at the end. Nothing has moved when a hook reads it. |
| `by` | <Documented /> | The rows the move asks for, signed, negative toward the top, what the DOM's `scrollBy` takes. Read-only. | Type: `number`. The scroll distance. A wheel tick is `-1` or `1`. A page key is `bodyRows`. Home and End are `contentRows`. |
| `bodyRows` | <Documented /> | How many rows of the tree the window shows at once, as drawn now. Read-only. | Type: `number`. |
| `contentRows` | <Documented /> | How many rows the tree has, as drawn now: the window's last offset is `contentRows - bodyRows`, none when the tree fits. Read-only. | Type: `number`. |
| `origin` | <Documented /> | Who moves it (UiScrollOrigin), set by the engine where the move starts. | Type: `UiScrollOrigin`. |
| `pointer` | <Documented /> | The body cell the person's wheel or trackpad was over (UiScrollPointer), absent for the scroll keys and for `$.ui.scroll`. Read-only. | Type: `UiScrollPointer`. Optional. Tells a tick over a hook's own list from a tick over the body. |

### `UiScrollOrigin`

Who moves the window at `ui.scroll`, as the engine stamps it where the move starts, a closed set a matcher narrows on. `next(e)` passes it on as received, no hook sets one.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `kind` | <Documented /> | The person, by the wheel over the site or its scroll keys while they hold it. | Type: `'person'`. |
| `kind` | <Documented /> | A plugin's `$.ui.scroll`. | Type: `'plugin'`. |
| `name` | <Documented /> | The scrolling plugin's name. | Type: `string`. |

### `UiScrollPointer`

The cell the pointer was over when the person's wheel raised `ui.scroll`, in the site's body: the box its `ui.render` hook draws into, as painted. The pointer position in cells, measured from the top of the body. The window offset is not added.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `column` | <Documented /> | 0 at the body's left edge, as `bodyColumns` counts them, negative, or `bodyColumns` and past, over an inline pane's sides or the band's `[-]`. | Type: `number`. |
| `row` | <Documented /> | 0 at the body's first showing row, as `bodyRows` counts them. | Type: `number`. The row under the pointer. It is negative above the body and `bodyRows` or more below it. |

### `UiScrollResult`

What a `ui.scroll` hook returns, what `next(e)` resolves to, and what `$.ui.scroll` hands back: `{}` once the window moved, or why it did not. Used by `$.ui.scroll`, `ui.scroll`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `deny` | <Documented /> | Absent when the window is where the chain left it, else why nothing moved, as `tool.call` and `config.set` spell a refusal. | Type: `string`. Optional. Says why nothing scrolled: a hook kept the window, the target is not this plugin's, or another move came first. With no surface `no-surface` heads it. |

### `UiScrollTarget`

What `$.ui.scroll` brings into view: never a row number, always a thing drawn somewhere. `{ requestId }` names a render instance. `{ key }` names an element this plugin drew. `start` and `end` are the top and bottom of the site.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `requestId` | <Documented /> | The ID of a render instance, as its `ui.render` hook saw it. | Type: `string`. |
| `key` | <Documented /> | The `key` of an element this plugin drew. | Type: `string`. |

### `UiSelectArgument`

The argument of `ui.select`: a pick from a `Select` a render hook drew. Flat and frozen like every event's. Another plugin addresses one picker by matcher: `on("ui.select", { plugin: "roster", element: "peer" }, ...)`. Used by `ui.select`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `plugin` | <Documented /> | Whose `ui.render` hook drew the element. | Type: `string`. |
| `element` | <Documented /> | The `key` the hook gave its `Select`: its address, what a matcher names. | Type: `string`. |
| `component` | <Documented /> | The render component the element was drawn in (`AbovePrompt`, `ToolUse`, ...). | Type: `RenderComponent`. |
| `requestId` | <Documented /> | The instance the element was drawn in: the `requestId` the `ui.render` hook that drew it saw (a tool row's tool_use_id, a pane's id). | Type: `string`. |
| `surface` | <Documented /> | Where the pick came from, one literal per member, so `if (e.surface === "terminal")` narrows `e`. | Type: `RenderSurface`. |
| `value` | <Documented /> | The picked option's value, a hook above may rewrite it for the plugins beneath and the element's own handler. | Type: `string`. |

### `UiSelection`

What the person has selected on screen, as `$.ui.selection()` answers it: the text, and the transcript row it lies in when it lies in one. Example: `const selected = await $.ui.selection()`. Used by `$.ui.selection`, `ui.selection`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `text` | <Documented /> | The selected text as the person sees it: what a copy would put on the clipboard, wrapped rows joined back into their lines. | Type: `string`. |
| `requestId` | <Documented /> | The transcript row the selection lies in, by the id its `ui.render` hook reads as `e.requestId` and `$.ui.scroll` takes. | Type: `string`. Optional. A tool call's row by its `tool_use_id`. Absent when the selection spans several rows or lies outside the transcript. |

### `UiSelectResult`

What a `ui.select` hook returns and what `next(e)` resolves to. Core runs the element's `onSelect` closure and answers `{ element, value }`. Used by `ui.select`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `element` | <Documented /> | Which handler the pick reached, by its Select's `key`. | Type: `string`. |
| `value` | <Documented /> | What the handler received: the option's value as the chain left it. | Type: `string`. |

### `UiViewResult`

What `$.ui.view` hands back and what a `ui.view` hook's `{ value }` holds: `{}` once the main view shows what was asked, or why it does not. As `ui.scroll` spells it. Example: `$.ui.view({ agentId }).then(shown => shown.deny && $.ui.toast(shown.deny))`. Used by `$.ui.view`, `ui.view`.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `deny` | <Documented /> | Absent when the main view shows the transcript asked for, else why the view did not move. | Type: `string`. Optional. Says why the view did not change: the call was not the person's own input, no agent has the id, or the view moved meanwhile. |

### `UserMessageFrom`

Who sent the message a `UserMessage` row carries, when someone other than the person did: another agent, a teammate, another session, a channel. Read-only. The sender's words are not the person's: the model reads them framed as that sender's whatever a hook draws for the row.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `name` | <Documented /> | The sender's name as the row shows it: a subagent's name, else its type, a teammate's, another session's title, a channel's sender, else server. | Type: `string`. One printable line: control and format characters stripped, whitespace collapsed, length bounded. Absent (no `from`) for a teammate block whose frames name different senders or none. |

### `UserMessageTask`

The background task a `UserMessage` notification row reports on: a subagent, a background shell, a workflow, a remote agent, a monitor. Read-only. Every field is the notification's own, so the row names the same task on every draw. Each string is one printable line.

| Field | Status | What it is for | Type and limits |
| --- | --- | --- | --- |
| `id` | <Documented /> | The task's id as the notification names it, for a subagent, the `agentId` its `turn.complete` carried and `$.agent.list()` keys. | Type: `string`. Optional. |
| `status` | <Documented /> | How the task ended: `completed`, `failed` or `killed` (stopped, by the person or by Claude), or another word its producer wrote. | Type: `string`. Optional. |
| `type` | <Documented /> | What kind of task, when the notification says (`remote_agent`, an artifact watch's kind), a subagent's and a shell's leave it out. | Type: `string`. Optional. |
| `toolUseId` | <Documented /> | Which call started the task: its `tool_use_id`, when the notification carries it. | Type: `string`. Optional. |
| `durationMs` | <Documented /> | How long the task ran, in milliseconds, when the notification says, the row draws it after the summary (`2m 2s`). | Type: `number`. Optional. |

## Related Pages

- [Mod API Overview](../index.md)
- [UI Methods](../ui.md)
- [UI Events](../ui-events.md)
- [Surfaces, Elements, and Render Sites](../ui-elements.md)
- [Mod API Types](index.md)
