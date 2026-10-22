# Claude Code Community Docs

An unofficial, community-run documentation site for Claude Code.
It is not made by or tied to Anthropic. "Claude" and "Claude Code" name the product the site describes.

The site covers every surface of Claude Code that you can use, change, or turn on and off.
That includes items the official docs never name. They carry an Undocumented badge.
It tracks one release only: `2.1.308` (see `src/version.ts`). There are no versioned docs.

Live site: <https://xsyetopz.github.io/claude-code-docs/>

## Run It

You need [Bun](https://bun.sh) `1.4.3` (see `.bun-version`).

```sh
bun install
bun run start     # dev server
bun run build     # production build into build/
bun run serve     # serve the build
bun run verify    # typecheck + format + lint + checks + build, run this before a pull request
```

## Contribute

Read [CONTRIBUTING.md](CONTRIBUTING.md) and the Style Guide page at `docs/contributing/style-guide.md`.
Follow the [Code of Conduct](CODE_OF_CONDUCT.md). Notable changes are listed in the [Changelog](CHANGELOG.md).

The "only usable items" rule: list only things a user can use, change, or switch on and off.
Leave out items that are removed, inert, test-only, or for Anthropic staff.

## Layout

```text
docs/        pages (Markdown and MDX)
src/         theme tweaks, badge components, version constant
tools/       check-docs.ts (emoji, front matter, Title Case)
```

## License

[CC BY 4.0](LICENSE-docs) and [MIT](LICENSE).
