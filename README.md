# Clawdipedia

An unofficial, community-run documentation site for Claude Code.
It is not made by or tied to Anthropic. "Claude" and "Claude Code" name the product the site describes.

The site covers every surface of Claude Code that you can use, change, or turn on and off.
That includes items the official docs never name. They carry an Undocumented badge.
It tracks one release only: `2.1.312` (see `src/version.ts`). There are no versioned docs.

Live site: <https://clawdipedia.cc/>

## Run It

You need [Bun](https://bun.sh) `1.4.4` (see `.bun-version`).

```sh
bun install
bun run start     # dev server
bun run build     # production build into build/
bun run serve     # serve the build
bun run verify    # typecheck + format + lint + checks + build, run this before a pull request
```

## Deploy

A Cloudflare Worker serves <https://clawdipedia.cc/> as static assets. Workers Builds watches `main`
through its own Git integration, runs the build command, and then runs the deploy command. No
Cloudflare credential lives in this repository or in GitHub Actions. `wrangler.jsonc` holds the
Worker name, the assets directory, and the routing. The dashboard needs these settings:

| Setting | Value |
| --- | --- |
| Build command | `bun install && bun run build` |
| Deploy command | `bunx wrangler deploy` |
| Preview command | `bunx wrangler preview` |
| Path (root directory) | empty |
| Production branch | `main` |
| API token | the one Workers Builds creates |

Use `bunx`, not the `npx wrangler deploy` default, because `wrangler` is a pinned devDependency.
`bunx wrangler preview --help` marks the preview command as open beta.
Workers Builds creates the API token itself. Set your own only if you need one token for every
upload. Set `BUN_VERSION` to `1.4.4` only if the build image default changes.

`wrangler.jsonc` sets no route, so add `clawdipedia.cc` to the Worker as a custom domain in the
dashboard. The first deploy without it answers on the `workers.dev` address only.

`bun run deploy:check` validates `wrangler.jsonc` against `build/` and deploys nothing. It needs no
Cloudflare login. `bun run verify` runs it last, after the build.

`.github/workflows/checks.yml` runs every check and the build on each push and pull request. It does
not deploy. A failed check does not stop a Cloudflare build, so read the check result before you merge.

The site publishes absolute URLs under `https://clawdipedia.cc/`. `docusaurus.config.ts` holds `url`
and `baseUrl`, and `tools/schemas/build.ts` holds the `$id` base of every JSON Schema. Change both
together, then run `bun run schemas`.

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
