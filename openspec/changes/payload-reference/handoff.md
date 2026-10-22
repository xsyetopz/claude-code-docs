openspec change: `openspec/changes/payload-reference/`.
Next open task: `1.1` in `tasks.md`.
Done tasks, checked in `tasks.md`: `0.1`.
Passed checks: none.
Only a checked task or a passed check is done.
Each checked task is done and verified, so do not run its check again unless the user asks.

- User's words:
  > https://github.com/anthropics/claude-code/releases/tag/v2.1.307 research, and update site to full 2.1.307+
  > you will not stop until all follow-ups are done. stop deferring work, lazy.
  > it would help to map out the 'fields' and structures of all the structural items, or else agents get this: "The $.tool.check query lacks a decider field, so the lab can't display it on a normal call's ask. …" if the agents have to manually dig out what takes what, it's a problem.
  > it's every API surface that needs its actual body/payload listed. the entire claude-code-docs needs the WYSYWIG treatment
  > you don't need to explicitly lay out the types if a .d.ts exists. we just need to make sure agents stop trying to assume they know when they don't.
- Mod API pages for 2.1.307: `approver`, `plugin` replaces `decider`, `EngineToolCall`, `Markdown.part`, dock `columns`, a what-changed row, `$.settings.read({ key })`, and `$.session.authorize()` returning null under desktop sign-in. `verify:locked` gave `exit 0`. The subagent re-check found `| holds |` 18, `| differs |` 0. Inventory: `captures/2.1.307/surfaces.md`.
- the table generator was dropped after the user's message: pages restored from `/tmp/ccd-scratch/before.nRry`, and `tools/reference/` and `reference/` deleted. The openspec `openspec/changes/payload-reference/` still describes generated tables, so rewrite it to the new plan: publish the source files and add the agent rules.
- `tools/schemas/types.ts` writes `schemas/claude-code.d.ts` (`16948 lines`, header plus `biome-ignore-all` format/lint/assist). `package.json` `schemas` and `schemas:check` run it, and `tools/release/wrap.ts` writes `types.diff`. Checks: `schemas:check: 7 schemas valid, fixtures behave`, `schemas/claude-code.d.ts ok`, `✓ No type errors in 116 files`.
- Still running, with redirect messages sent: a zod agent writes JSON Schemas to `schemas/` (hook-output, tools, control-protocol, stream-json, agents-json, mcp) and registers them in `build.ts`/`check.ts`, and a code agent writes the status-line, transcript, otel, frontmatter, and claude-json schemas. Wait for both, then register the code agent's files.
- RAN, result after this handoff: a Write of `plugin/mcp/src/types.ts` (type file lookups: a declaration with its doc comment, a member by dotted path, event map entries).
- Next: wire `types.ts` into `get_schema` in `plugin/mcp/src/server.ts` and `content.ts` (`SCHEMA_NAMES`, fetch `schemas/claude-code.d.ts`), add tests in `plugin/mcp/test/`, rebuild `dist/server.js`, and add the new schema names.
- Next: add a rule to `plugin/skills/claude-code-docs/SKILL.md`, `docs/extend/mod-api/index.md`, `types/index.md`, `llms.txt`, and `CLAUDE.md`: confirm a field in `schemas/claude-code.d.ts` or a schema before stating it, and otherwise say it is unknown. Then run `verify:locked` and review the diff. Not committed.
- Errors: `TypeError: checker.signatureToString is not a function`, `TypeError: undefined is not an object (evaluating 'stdout._handle.fd')`, and `Permission to use Bash with command rm -rf ... has been denied.` Use `rm` on single files and `mktemp`, not `rm -rf`.
- Scratch left for the user, because `rm -rf` was denied: `/tmp/ccd-scratch`, `/tmp/ccd-inv`, `/tmp/cvscratch`, and the agents' `/tmp/ccd-zod` and `/tmp/ccd-code`.
