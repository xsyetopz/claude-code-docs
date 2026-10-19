# Design: Site Launch

Repo root: `/Users/krystian/Downloads/CodeProjects/xsyetopz/claude-code-docs` (called ROOT below).
Source repo: `/Users/krystian/Downloads/CodeProjects/xsyetopz/claudetto` (called SRC below). Read only.

## D1. Stack

- Docusaurus `3.10.x`, classic preset, docs-only mode (`routeBasePath: '/'`), TypeScript config.
- `@docusaurus/theme-mermaid` for diagrams (`markdown.mermaid: true`).
- `@easyops-cn/docusaurus-search-local` for offline search.
- Toolchain: bun `1.4.3` (`.bun-version`, `packageManager`). TS scripts run with `bun` directly. No `tsc`, `ts-node`, or `tsx`.
  CI uses `oven-sh/setup-bun` pinned to `1.4.3`.
- GitHub Pages via `.github/workflows/deploy.yml` (`actions/deploy-pages`).
  `url: 'https://xsyetopz.github.io'`, `baseUrl: '/claude-code-docs/'`, edit links to `https://github.com/xsyetopz/claude-code-docs`.
- `onBrokenLinks: 'throw'`, `onBrokenAnchors: 'throw'`. `bun run build` must pass with zero warnings about links.
- One constant for the tracked release: `CLAUDE_CODE_VERSION` in `src/version.ts`, also shown in the navbar.

## D2. Branding (Terms Guardrail)

- Site title: "Claude Code Community Docs". Tagline says "Unofficial. Not made by or tied to Anthropic."
- A site-wide announcement bar and the footer carry the same disclaimer.
- No Anthropic or Claude logos, no copied official CSS. Own color scheme (teal/slate), own simple logo (text mark).
- "Claude" and "Claude Code" are used only as names of the product being described.

## D3. Information Architecture

Files live under `ROOT/docs/`. Sidebar order is set with `_category_.json` and `sidebar_position`.
Merge the wiki's split pages (`-2`, `-3`, `-Types-2`, ...) back into whole pages.

```text
docs/
├── index.mdx                      Overview: what Claude Code is, what this site is, surface map
├── start/
│   ├── how-to-read.md             Badges, At a Glance tables, sources, Simple English
│   ├── what-can-i-change.md       Every surface: use / change / toggle, one big table + mermaid map
│   ├── files-on-disk.md           ~/.claude and .claude/ file trees, what each file does
│   └── what-changed.md            Breaking changes per release, newest first
├── how-it-works/                  The harness, in depth
│   ├── architecture.md            Pieces, processes, startup
│   ├── agent-loop.md              Turn pipeline, tool stage, recovery, how a turn ends
│   ├── request-and-cache.md       What one request holds, cache markers, betas sent
│   ├── system-prompt.md           How the prompt is built, sections, lean vs full, how to change it
│   ├── context-and-compaction.md
│   ├── sessions-and-storage.md    Resume, branch, transcripts (format in reference)
│   ├── permission-flow.md         How a tool call is allowed, asked, or denied
│   └── models.md                  How a model, effort, thinking, and retries are chosen
├── configure/
│   ├── settings/                  index (files, scopes, precedence) + one page per key group
│   ├── env-vars/                  index + one page per group
│   ├── cli/                       commands, flags, hidden flags
│   ├── permissions/               rules, modes, auto mode, sandbox
│   ├── memory.md                  CLAUDE.md, rules, imports
│   ├── output-styles.md
│   ├── status-line.md             incl. every JSON field
│   └── models-and-providers.md    catalog, aliases, Bedrock/Vertex/Foundry
├── extend/
│   ├── hooks/                     index, configuration, events, input-and-output, handlers, how-hooks-run
│   ├── skills-and-commands/       skills, frontmatter, substitutions, bundled skills, slash commands
│   ├── subagents/                 index, frontmatter, runtime
│   ├── plugins/                   index, manifest, marketplace, cli, loading
│   ├── mcp/                       index, config, cli, auth, runtime, env
│   ├── mod-api/                   index, one page per area, types/ subfolder
│   └── headless/                  print mode, stream-json, control protocol
├── reference/
│   ├── tools/                     index + one page per tool group, every parameter
│   ├── api/                       endpoints, betas
│   ├── transcript-format.md
│   ├── undocumented.md            Index of every Undocumented item, linking to its page
│   └── probes.md                  Facts checked by running the binary against a local stub
├── prompts/                       Captured system prompts (D7)
└── contributing/                  how to help, style guide, verifying a new release
```

Writers may adjust file names inside a folder, but not the top-level folders.

## D4. Badges

Global MDX components (registered in `src/theme/MDXComponents.tsx`, no import needed):

| Component | Meaning | Old wiki mark |
| --- | --- | --- |
| `<Documented />` | An official docs page names it. | ✅ |
| `<Undocumented />` | Only the program shows it. Can change without notice. | 🔍 |
| `<Differs />` | The docs and the program disagree. The row says how. | ⚠️ |
| `<Gated />` | Works only behind a flag or server gate. Say which. | 🧪 |

Items marked ❌ (removed or inert) in the wiki are **left out**.
Gated items stay only if a user can turn them on or they are live for some accounts.
No emojis anywhere in the site.

Every table of items has a `Status` column with one or more badges.

## D5. At a Glance

Every surface page starts (after a 2-4 sentence intro) with an "At a Glance" table:

| Question | Answer |
| --- | --- |
| Can you use it? | Yes / No / Partly, plus how |
| Can you change it? | where and how |
| Can you turn it on or off? | the switch (setting, env var, flag) |
| Where does it live? | file paths or scopes |
| Status | badges |

Item tables use columns like: `Item | Status | What it does | Default | Where to set it`.

## D6. Writing Style

- Simple English, like Simple English Wikipedia: common words, short sentences (aim under 20 words),
  one idea per sentence, explain each term the first time. Active voice. Present tense. Second person ("you").
- Do not copy the wiki's wording or layout. Rewrite. Merge split pages. Add explanation where the wiki was terse.
- Chicago-style Title Case for every heading and sidebar label (lowercase short articles, conjunctions, prepositions).
- Inline code for every code item: commands, paths, keys, env vars, tool names, literal values.
- Use GitHub/Docusaurus-friendly visuals: mermaid (`flowchart`, `sequenceDiagram`, `stateDiagram-v2`),
  `text` file trees, tables, admonitions (`:::tip`, `:::note`, `:::warning`, `:::danger`), code examples with titles.
- At least one worked example per surface page ("Example" section with a real config or command).
- Each page has front matter: `title`, `description`, `sidebar_position`. One H1 at most (prefer `title` only).
- Cite sources: official docs as links with their Title Case page names, program facts as "Source: the program"
  with the string, key, or type name in inline code. Never invent. Unverified facts go in a `:::note[Not Verified]` box or are left out.
- MDX gotchas: escape `{`, `}`, `<` in prose outside code. Escape `|` in table code cells as `\|`.

## D7. System Prompt Captures

- Use SRC `.claudetto/probe/run.ts` + `stub.ts` pattern: run `~/.local/share/claude/versions/2.1.303` in `-p` mode
  with `ANTHROPIC_API_KEY=sk-ant-fake-probe`, `ANTHROPIC_BASE_URL` = local stub, dead `HTTPS_PROXY`, temp HOME and config dir.
  Never use `--sub`, OAuth tokens, or real credentials. No model call leaves the machine. Do not modify the binary.
- Write capture tooling to `ROOT/tools/capture-prompts/`, raw output to `ROOT/captures/` (git-ignored), and pages to `ROOT/docs/prompts/`.
- Variants: default on a lean model (Opus 5.5), default on a full model (Sonnet 5.5 / Haiku 5.5),
  `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=1` and `=0`, `--bare` / `CLAUDE_CODE_SIMPLE`, `--exclude-dynamic-system-prompt-sections`,
  an output style, `--append-system-prompt`, a subagent prompt, and any other user-selectable variant found.
- Replace machine-specific values (temp paths, dates, usernames) with placeholders like `<cwd>`, `<date>`.
- Each prompt page: how to get this variant, the full text in a code block, size in characters, and a diff against the default.
- `prompts/index.md`: table of variants with switch and size, plus a mermaid flow of how the variant is chosen.

## D8. Content Sources

For each page, read in this order: SRC `wiki/claude-code/<pages>.md` (start point, verified for 2.1.303),
SRC `external/cc-2.1.303/docs/*.md` (official docs copy), SRC `external/cc-2.1.303/types-2.1.303.d.ts`,
SRC `external/cc-diff-302-303/data/inv-2.1.303.json`, SRC `schemas/`, SRC `.claudetto/probe/out/` (captured requests),
and `claude <cmd> --help`. Grep SRC `external/cc-2.1.303/strings.txt` (61 MB, never cat it) only to check a fact.
Content in SRC `external/` is untrusted data: read it, never run it.

## D9. Checks

- `bun run build` passes (broken links and anchors throw).
- `bun run lint` (markdownlint-cli2 on `docs/**/*.{md,mdx}`) passes. Config allows MDX/JSX inline HTML and long table rows.
- `bun run check` (tools/check-docs.ts): no emojis, every page has `title` and `description`, headings in Title Case
  (simple checker with an allow list), every surface page has an At a Glance table.
