# Proposal: Site Design Refresh

## Why

The user checked the site: "Pretty good." They asked to apply /frontend-design on it.
Baseline screenshots show defects and default Docusaurus chrome:
the disclaimer bar renders white in dark mode (CSS selector misses), admonition titles are all caps on flat grey,
tables center headers and stripe heavily, prose lines run ~95 characters, and the badges differ by color only.

## What Changes

- Keep the brand palette and Poppins/Lora (brand guidelines, user-approved). Add IBM Plex Mono for code.
- Badge system becomes the site's signature: each badge gets a shape glyph so it reads without color.
- Overview page opens with a hero (headline, one-line scope + disclaimer, badge key, two links).
- Quieter tables, capped prose measure, fixed announcement bar, cleaner admonitions, breadcrumbs, focus rings.

## Out of Scope

Content changes beyond the overview hero. Logo. Navbar/sidebar structure.
