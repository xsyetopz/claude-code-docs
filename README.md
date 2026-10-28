# Clawdipedia

An unofficial, community-run documentation site for Claude Code.
It is not made by or tied to Anthropic. "Claude" and "Claude Code" name the product the site describes.

The site covers every surface of Claude Code that you can use, change, or turn on and off.
That includes items the official docs never name. They carry an Undocumented badge.
It tracks one release only: `2.1.309` (see `src/version.ts`). There are no versioned docs.

Live site: <https://xsyetopz.github.io/clawdipedia/>

## Run It

You need [Bun](https://bun.sh) `1.4.4` (see `.bun-version`).

```sh
bun install
bun run start     # dev server
bun run build     # production build into build/
bun run serve     # serve the build
bun run verify    # typecheck + format + lint + checks + build, run this before a pull request
```

## Plugins

The repo is also a Claude Code plugin marketplace, `clawdipedia`, with three plugins:

- `clawdipedia-docs`: an MCP server with four tools (`search_docs`, `read_page`, `list_pages`, `get_schema`) and a skill. It reads four sources, picked with `source`: `clawdipedia` (this site, the default), `platform` (platform.claude.com/docs), `code` (code.claude.com/docs), and `anthropic` (www.anthropic.com).
- `clawdipedia-docs-cli`: the same lookups as an `clawdipedia-docs` command that the Bash tool runs, plus a skill. It has no MCP server, so it adds no tool list to the context. It works only in Claude Code and needs Bun.
- `cc-inspect`: an MCP server and a skill that read your session transcripts and the installed Claude Code program.

```sh
claude plugin marketplace add xsyetopz/clawdipedia
claude plugin install clawdipedia-docs@clawdipedia   # or clawdipedia-docs-cli, or cc-inspect
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
tools/       check/docs.ts (emoji, front matter, Title Case)
```

## License

[CC BY 4.0](LICENSE-docs) and [MIT](LICENSE).
