# Design: Site Design Refresh

Binding rules from `openspec/changes/archive/2026-10-19-site-launch/design.md` still apply (Simple English, Title Case headings, checks).

## Tokens

Color (unchanged brand palette): Dark #141413, Light #faf9f5, Mid Gray #b0aea5, Light Gray #e8e6dc,
Orange #d97757 (decor only; links use #a8502f light / #e08a6c dark for AA), Blue #6a9bcc, Green #788c5d.

Type: Poppins (headings, UI chrome, badges, table headers), Lora (body prose, table cells),
IBM Plex Mono 400/500 via @fontsource (all code). Scale ~1.25 ratio:
H1 clamp(2.2rem, 4vw, 3rem) / 600 / -0.015em; H2 1.75rem, margin-top 2.5em; H3 1.25rem; H4 1.05rem.
Prose measure: max 70ch for p, ul, ol, blockquote, admonitions. Tables, code blocks, mermaid stay full width.

## Signature: Provenance Badges

Badges are what make this site different from the official docs, so they carry the visual weight.
Each kind gets a 0.6em shape before the label, drawn with CSS (not text, so screen readers skip it):
Documented = filled circle; Undocumented = ring (hollow circle); Differs = half-filled circle; Gated = dashed-outline square.
Shape: 3px radius rectangle (not a pill), Poppins 600 ~0.72rem, existing bg/fg tokens (AA).
Move inline styles from `src/components/Badge.tsx` into `custom.css` classes.

## Overview Hero (`docs/index.mdx`)

Left-aligned, no image, no gradient, no stats.

```
[ H1 (Poppins 700, ~3.2rem): Every Part of Claude Code You Can Use or Change ]
[ One line Lora: unofficial community docs for version <v>, from the official docs and the program itself.
  Not made by or tied to Anthropic. ]
[ Badge key: 4 rows, glyph badge + one plain sentence each ]
[ Link: Start with How to Read These Docs ]  [ Link: See What the Docs Leave Out ]
```

`hide_title: true`; the hero renders the page's only h1. The hero replaces the "Unofficial Site" note
and the badge bullet list in "What This Site Covers" (the disclaimer stays in the hero line and the site-wide bar).
No all-caps labels, no eyebrows, no arrows appended to link text, no numbered markers.

## Chrome

- Announcement bar: set `backgroundColor: '#141413'`, `textColor: '#faf9f5'` in config; dark mode lifts to #1f1f1d via a selector that matches the built markup.
- Admonitions: title not uppercase (Poppins 600, normal case); 3px left rule; 6px radius; brand tints in both modes
  (note = gray, info = blue, tip = green, caution/warning = orange, danger = darker red).
- Tables: headers left-aligned, Poppins 600 ~0.8rem, 2px bottom rule; body rows hairline rules, no zebra; `font-variant-numeric: tabular-nums`; radius 0 on table, no outer heavy border.
- Breadcrumbs: no pill background; Poppins small, secondary color; current item in text color.
- Code: Plex Mono; blocks 1px emphasis-200 border, 6px radius; inline code tighter padding.
- Sidebar: active item gets a 2px orange left rule + text color, light background only on hover.
- Focus: `:focus-visible` 2px outline in link color, 2px offset, on links, buttons, inputs, badges.
- No added non-user motion. Respect `prefers-reduced-motion` for any transition added.

## Verification

Headless Chrome screenshots at 1440x1100 and 390x900, light and dark, of `/`, `/reference/undocumented`,
`/configure/env-vars/network-and-proxy`. `bun run verify:locked` passes.
