---
title: Memory and Rules
description: Where CLAUDE.md files, rules, imports, and auto memory live, how they load, and their limits.
sidebar_position: 5
---

Claude Code remembers your project in two ways.
`CLAUDE.md` files hold instructions that you write. Auto memory holds notes that Claude writes.
Rules in `.claude/rules/` split instructions by topic and by file path.
Claude treats all of these as context, not as enforced configuration. The text arrives as a user message after the system prompt.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | ✅ Yes. Write `CLAUDE.md` in your project, or run `/memory`. |
| Can you change it? | ✅ Yes. Edit the files, or set `autoMemoryEnabled`, `autoMemoryDirectory`, and `claudeMdExcludes`. |
| Can you turn it on or off? | `autoMemoryEnabled`, `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`, and `CLAUDE_CODE_DISABLE_CLAUDE_MDS=1`. |
| Where does it live? | `~/.claude/CLAUDE.md`, `./CLAUDE.md`, `.claude/rules/`, and `~/.claude/projects/<project>/memory/`. |
| Status | <Documented /> <Undocumented /> <Differs /> |

## Example

```text title="CLAUDE.md"
# Project Notes
Use bun, not npm.
Run `bun test` before you say a task is done.
@docs/architecture.md
```

```markdown title=".claude/rules/api.md"
---
paths:
  - "src/api/**/*.ts"
---
Every handler returns a typed error object. Never throw a plain string.
```

The first file loads in every session and imports `docs/architecture.md`. The second loads only after Claude touches a file that matches `src/api/**/*.ts`.

## Instruction File Locations

The list runs in load order, broad scope first. A later file sits later in the context.
Official page: [How Claude Remembers Your Project](https://code.claude.com/docs/en/memory).

| Item | Status | What it does | How it works | Where to set it |
| --- | --- | --- | --- | --- |
| Managed `CLAUDE.md` | <Documented /> | Organization instructions | `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS), `/etc/claude-code/CLAUDE.md` (Linux and WSL), `C:\Program Files\ClaudeCode\CLAUDE.md` (Windows). Cannot be excluded | Machine |
| `claudeMd` setting | <Documented /> | Managed `CLAUDE.md` text inside managed settings | Same precedence as the managed file. Honored only from managed settings | `managed-settings.json` |
| `~/.claude/CLAUDE.md` | <Documented /> | Personal instructions | Loads for all projects. Imports in it need no approval dialog | User |
| `~/.claude/rules/*.md` | <Documented /> | Personal rules | Load before project rules. No override between the two sets | User |
| `./CLAUDE.md` or `./.claude/CLAUDE.md` | <Documented /> | Project instructions | Files in the working directory and each directory above it load at launch | Project |
| `./CLAUDE.local.md` | <Documented /> | Private project notes | Appended after `CLAUDE.md` in the same directory. Add it to `.gitignore` | Project |
| Subdirectory `CLAUDE.md` | <Documented /> | Lazy instructions | Loads once after Claude reads, writes, or edits a file in that subdirectory | Project |
| `AGENTS.md`, `.claude/AGENTS.md` | <Documented /> | Read when no `CLAUDE.md` or `CLAUDE.local.md` is in or above the working directory | Needs `2.1.277`. `AGENTS.local.md`, `AGENTS.override.md`, and `.agents/` are not read | Project |
| `.claude/rules/**/*.md` | <Documented /> | Project rules | Found recursively. Rules without `paths` load at launch with the priority of `.claude/CLAUDE.md` | Project |
| `--add-dir` directories | <Documented /> | Extra directories | Memory files load only when `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1`. Loads `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/rules/*.md`, `CLAUDE.local.md` | CLI |

## Imports and Rule Files

| Item | Status | What it does | How it works | Where to set it |
| --- | --- | --- | --- | --- |
| `@path/to/file` | <Documented /> | Imports a file at launch | Relative paths resolve from the importing file. Maximum depth is four hops. Put a backslash before each space in the path. Quoted paths do not import. Code spans and fenced blocks are skipped | Any memory file |
| External import | <Documented /> | An import that resolves outside the working directory | A dialog asks once per project. If declined, they stay off. User-scope files skip the dialog | Project files |
| `paths` frontmatter in a rule | <Documented /> | Scopes a rule to files | YAML list or comma string of globs. Loads when `Read`, `Write`, or `Edit` (or a Bash read like `cat`) touches a match. Brace expansion budget: 1,000 patterns and 4 MiB per rule | `.claude/rules/*.md` |
| Other rule frontmatter keys | <Documented /> | Ignored | `paths` is the only key read. Bad YAML loads the rule without `paths` | `.claude/rules/*.md` |
| HTML block comments | <Documented /> | Stripped before injection | Comments in code blocks stay | Any `CLAUDE.md` |
| Symlinks in `.claude/rules/` | <Documented /> | Share rules across projects | A target outside the working directory counts as an external import. Network paths do not load | `.claude/rules/` |
| `claudeMdExcludes` | <Documented /> | Skips files by glob | Absolute paths with `picomatch`. Arrays merge across scopes. User, project, and local files only | Any settings scope |
| **Project instructions** (`/config`) | <Documented /> | Chooses `claude-md-or-agents-md` (default), `claude-md-and-agents-md`, `claude-md`, or `managed-only` | Stored in `pluginConfigs["cc-plugin-agents-md@builtin"].options.instructionFiles`. Read from user, `--settings`, and managed settings. `agents-md@builtin` also works from `2.1.285` | User, managed |
| `includeGitInstructions` | <Documented /> | Removes built-in commit and PR instructions | Default `true`. Env `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS=1` wins | Settings |
| `CLAUDE_CODE_DISABLE_CLAUDE_MDS` | <Documented /> | No `CLAUDE.md` files in context | `1` disables user, project, and auto memory files | Env |

## Auto Memory

Auto memory is a folder of notes that Claude writes for itself. `MEMORY.md` is the index.

| Item | Status | What it does | How it works | Where to set it |
| --- | --- | --- | --- | --- |
| `autoMemoryEnabled` | <Documented /> | Turns auto memory on or off | Default on in local sessions. `/memory` toggle writes it to user settings | Any settings scope |
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY` | <Documented /> | Env switch | `1` disables. `0` forces on even with `--bare` or `autoMemoryEnabled: false` | Env |
| `autoMemoryDirectory` | <Documented /> | Memory location | Absolute path or `~/`. Default `~/.claude/projects/<project>/memory/`. Ignored in checked-in project settings in the schema text. The docs say project scope works after trust | Settings |
| `autoMemoryDirectory` scope | <Differs /> | The schema says project settings are ignored. [How Claude Remembers Your Project](https://code.claude.com/docs/en/memory) says project and local scopes work under workspace trust | Docs and schema text differ | Settings |
| `MEMORY.md` | <Documented /> | Index file | The first 200 lines or 25KB load at each session start. Topic files load on demand | Memory directory |
| Memory types | <Documented /> | `user`, `feedback`, `project`, `reference` in the `type` frontmatter | Claude writes a `modified` ISO 8601 field (since `2.1.214`) | Memory files |
| `/memory` | <Documented /> | Lists memory files, toggles auto memory, opens the folder | Editor opens a file | Interactive |
| `autoDreamEnabled` | <Undocumented /> | Background memory consolidation (auto-dream) | Overrides the server default | Settings |
| `/pause-memory` | <Undocumented /> | Pauses memory for the session | Only the user can turn it back on. Text `memory access blocked by /pause-memory` | Interactive |
| `CLAUDE_CODE_REMOTE_MEMORY_DIR`, `CLAUDE_CODE_POST_TURN_MEMORY`, `CLAUDE_COWORK_MEMORY_*`, `CLAUDE_MEMORY_STORES` | <Undocumented /> | Cloud, Cowork, and post-turn memory | Use not verified | Env |
| Subagent `memory` field | <Documented /> | A separate memory directory for a subagent | See [Subagents](../extend/subagents/frontmatter.md) | Agent frontmatter |

## Limits

| Item | Status | What it does | How it works | Where to set it |
| --- | --- | --- | --- | --- |
| `CLAUDE.md` size | <Documented /> | Files over 4 MiB are skipped | A warning shows for files over 200 lines, and for a combined size | Instruction files |
| `MEMORY.md` size | <Documented /> | 200 lines or 25KB | A write over the limit succeeds but returns an error that asks for a rewrite | Memory |
| Compaction | <Documented /> | Project-root `CLAUDE.md` is re-read after `/compact` | Nested files and `paths` rules load again on demand. `InstructionsLoaded` shows `load_reason` `compact` | Context |

## The `InstructionsLoaded` Hook

The hook fires when an instruction file enters context.
It runs async and has no decision control.
It does not fire for an `AGENTS.md` that loads through the Project instructions setting.
The matcher runs on `load_reason`. Official page: [Hooks Reference](https://code.claude.com/docs/en/hooks).

| Item | Status | What it does | How it works | Where to set it |
| --- | --- | --- | --- | --- |
| `file_path` | <Documented /> | Absolute path of the file | String | Hook input |
| `memory_type` | <Documented /> | Scope | `User`, `Project`, `Local`, `Managed` | Hook input |
| `load_reason` | <Documented /> | Why it loaded | `session_start`, `nested_traversal`, `path_glob_match`, `include`, `compact` | Hook input |
| `globs`, `trigger_file_path`, `parent_file_path` | <Documented /> | Extra context | `globs` only for `path_glob_match`. `parent_file_path` for `include` | Hook input |
| `InstructionFileKind` | <Undocumented /> | Tiers `managed`, `user`, `project`, `local`, `memory` | Used by the Mod API | Mod API |

## How It Works

Instruction files do not go into the system prompt.
Claude Code reads them at launch, walks up from the working folder, and adds the text as a user message.
Nested `CLAUDE.md` files and `paths` rules load later, when Claude reads a matching file.
After `/compact`, the project-root `CLAUDE.md` is read again.
See [The System Prompt](../how-it-works/system-prompt.md) and [Context and Compaction](../how-it-works/context-and-compaction.md).

```mermaid
flowchart TD
  Start[Session start] --> Managed["Managed <code>CLAUDE.md</code>"]
  Managed --> User["User <code>CLAUDE.md</code> and rules"]
  User --> Proj["Project <code>CLAUDE.md</code>, <code>CLAUDE.local.md</code>, rules without paths"]
  Proj --> Auto["<code>MEMORY.md</code> index"]
  Auto --> Msg[User message after the system prompt]
  Read[Claude reads a file] --> Nest["Nested <code>CLAUDE.md</code> or paths rule"]
  Nest --> Msg
```

:::note[Not Verified]
The size at which the combined-size warning for instruction files appears.
The use of the cloud, Cowork, and post-turn memory variables (`CLAUDE_CODE_REMOTE_MEMORY_DIR`, `CLAUDE_CODE_POST_TURN_MEMORY`).
:::

## Related Pages

- [Environment Variables](env-vars/index.md) for the memory variables.
- [Output Styles](output-styles.md) for answer style, which is separate from project facts.
- [The System Prompt](../how-it-works/system-prompt.md)
- [Captured CLAUDE.md Prompt](../prompts/claude-md.md)
- [Hook Events](../extend/hooks/events.md) for the `InstructionsLoaded` event and [Subagent Frontmatter](../extend/subagents/frontmatter.md) for the subagent `memory` field.
