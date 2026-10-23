openspec change: `openspec/changes/release-2-1-309-full-surface/`.
Next open task: `3.3` in `tasks.md`.
Done tasks, checked in `tasks.md`: `1.1`, `1.2`, `1.3`, `1.4`, `1.5`, `2.1`, `2.2`, `3.1`, `3.2`.
Passed checks: none.
Only a checked task or a passed check is done.
Each checked task is done and verified, so run its check again only when the user asks.

- Task: `/claudetto:apply` on change `openspec/changes/release-2-1-309-full-surface/`, 26 tasks done in order, each ticked only after its check passes. The user's last words:
  > You stopped. Continue?
- tasks 1.1–2.2 ticked and committed in `cec1ccf fix(plugin): return page text without structuredContent in cc-docs tools` and `54921ed feat(inspect): add surface extractors and the list_surface tool`. cc-inspect bumped `0.2.0 -> 0.3.0`. `list_surface` has a default limit of 200 and a max of 400 (recorded in D5). Gate defaults the code computes now show as `unknown`. Endpoint now `431` items, and the docs miss 9 by notation only (`{id}`, `*`, `?beta=true`).
- 3.1 and 3.2 ticked (9 tasks ticked). Checks: `bun test tools/surface` gave `20 pass`, `0 fail`; schemas:check gave `schemas/surface.json ok, same as a fresh run`. surface:check baseline: `7248` of `9400` unmapped. Files `tools/surface/{snapshot,coverage}.ts` and their tests, `map.json`/`exclusions.json` (`{}`), `schemas/surface.json`, and the package.json scripts are not committed yet.
- the user chose "Filter by module (Recommended)" for the error list. Measured on 2.1.309: the `tengu_` module rule keeps `2029` but leaves library code in. The outermost-function rule keeps `935` but loses app texts such as "managed-mcp.json could not be read whole". So only the CommonJS-wrapper rule is used: a fixture test failed first, then passed. Result: `error items on 2.1.309: 4022`, and `110 pass`, `0 fail`. All `507` dropped texts sampled as library code (protobuf, crypto, XML, CSS selectors, JWT).
- RAN, result after this handoff: Edit `error.ts` header to "drops 507 of 4529 texts, leaving 4022 (…)".
- RAN, result after this handoff: `bun run surface`, `schemas:check`, `surface:check`, `plugin:build`, `plugin:check`.
- Next: read those results, then tell the user that the module filter only partly works. The remaining ES-module library errors need exclusion rules by group in task 5.7, and the user should confirm that. Then commit the 3.x work plus the error filter (CHANGELOG if needed), and do 3.3 (`tools/surface/render.ts`).
- Leave the archive move `openspec/changes/release-2-1-309/` → `archive/2026-10-23-release-2-1-309/` unstaged; it did not come from this session's calls. Delete the scratch folder `/tmp/surf` at the end.
