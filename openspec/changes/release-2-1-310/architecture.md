# Architecture: Release Claude Code 2.1.310

The why is in `prd.md`. This change runs the existing release pipeline. It adds no component.

## Components

1. **Release toolkit** (`tools/release/`, runbook `tools/release/README.md`): check, schemas, diff, prompts, print and pty probes, claims, compare, managed and live probes. Results go to `captures/2.1.310/` (gitignored).
2. **cc-inspect** (`inspect/mcp`): `search_binary`, `read_module`, `list_surface`, and `list_tools` confirm each notes item and diff item in the `2.1.310` binary.
3. **Surface snapshot and coverage** (`tools/surface/`, `schemas/surface.json`, `docs/reference/surface-coverage.md`): maps each item to a page or an exclusion in `tools/surface/exclusions.json`.
4. **Schemas** (`schemas/*.json`, `schemas/claude-code.d.ts`): regenerated from the binary.
5. **Docs pages** (`docs/`): the pages that take each item, What Changed, the Release Archive, and the rendered prompt pages under `docs/prompts/`.
6. **Plugin and repo texts**: `plugin/.claude-plugin/plugin.json`, `plugin/skills/claude-code-docs/SKILL.md`, `.claude-plugin/marketplace.json`, `README.md`, `CHANGELOG.md`, through `version:bump`.

## Data and Interfaces

- In: the `2.1.309` and `2.1.310` binaries in `~/.local/share/claude/versions/`, the release notes (`gh release view v2.1.310 --repo anthropics/claude-code`), and `captures/2.1.309/` results for compare.
- Between steps: `captures/2.1.310/diff/*.json` and `report.md`, `compare/compare.md` (the worklist), and `claims.json`.
- Out: edited pages, `tools/release/claims/map.json` entries, `tools/surface/exclusions.json` entries, regenerated schemas and snapshot, and `src/version.ts` at `2.1.310`.

## Constraints

- `src/version.ts` changes only in runbook step 12, because `--from` defaults to it.
- A payload field is stated only when found in `schemas/claude-code.d.ts` or `schemas/` (`CLAUDE.md`).
- Facts from the binary are cited as "the program", and notes items as links to the release tag.
- Probes use the fake key and local stub. Live probes use `tools/release/secret-runner.sh` and subscription quota. They are pre-approved in the owner's `CLAUDE.local.md`.
- Managed probes need the user to run `sudo` scripts.
- Pty probes take about 11 minutes and need an idle machine.
- A new way to probe the program goes into cc-inspect with a test (`CLAUDE.local.md`).
- No edit to `.markdownlint.jsonc`, `biome.json`, or `commitlint.config.mjs`. No force push and no `--no-verify`.

## Decisions

1. **Follow the runbook as written.** Why: the toolkit was built for this, and the 2.1.308 and 2.1.309 releases used it. Alternative: ad hoc binary reads, which miss items the diff finds.
2. **Confirm each notes item in the program before a page states it.** Why: the notes are short and can differ from the binary. Alternative: copy the notes, which breaks the "never invent a fact" rule.
3. **Live probes run last, and only when the weekly usage band is not red.** Why: the weekly share was 96% (red) when this plan was written (2026-10-24), and live probes use the same subscription. Alternative: run them at once under the standing approval, at the risk of using up the week's limit. This is proposed and is the easiest to change.
