# Proposal: Commit Gates

## Why

User ran `biome format . --write`, then: "make sure these formats are done pre-commit as well. won't let publish without
commitlint + precommit on formatting/lint/checks"

Today: `commitlint.config.mjs` exists but `@commitlint/cli` is not installed; no git hooks; Biome not a dependency;
CI (`.github/workflows/deploy.yml`) runs `bun run verify` only.

## What Changes

- Dev deps: `@biomejs/biome` (pinned to the version matching `biome.json` `$schema`), `@commitlint/cli`,
  `@commitlint/config-conventional`, `lefthook`.
- Distinct, named gates (scripts, hooks, and CI steps all use the same names):
  - `typecheck`: `bun --check` (Bun's built-in type check; no `tsc`).
  - `format` / `format:check`: `biome format --write .` / `biome format .`.
  - `lint:code`: `biome check --formatter-enabled=false --error-on-warnings .` (lint plus assists such as
    organizeImports; warnings fail). `lint`: markdownlint on `docs/**`.
  - `check:docs` (renamed from `check`, so `bun check` stays Bun's type check) and `schemas:check`.
  - `build`. `verify` runs them all in that order (plus `llms:check`).
- `lefthook.yml` (`glob_matcher: doublestar`, installed by the `prepare` script, a no-op in CI or without `.git`):
  - pre-commit (piped): `biome format --write` on staged code (re-staged), then in parallel: lint-code on staged code,
    typecheck when ts/tsx/mjs, `tsconfig.json`, or `package.json` is staged, markdownlint on staged docs,
    `check:docs` when `docs/`, `src/`, or `tools/check-docs.ts` is staged, `schemas:check` when `schemas/**` or
    `tools/schemas/**` is staged.
  - commit-msg: commitlint. pre-push: `bun run verify:locked`.
- CI (`deploy.yml`): commitlint over the pushed or PR range (first push: from the commit that added `lefthook.yml`,
  else every commit including the root), then one named step per gate. Deploy needs build.
- Docs: CONTRIBUTING.md and CLAUDE.md describe the hooks and gates.
