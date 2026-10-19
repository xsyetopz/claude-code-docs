---
title: Sessions and Storage
description: How Claude Code saves a session, how resume and branch work, what is restored, and where every file lives on disk.
sidebar_position: 6
---

A session is one saved conversation.
Claude Code writes it to a file on your disk as you work.
You can leave and come back to continue, or branch the conversation to try another path.
This page covers the flags, the files, and the cleanup rules. The line format is on the [Transcript Format](../reference/transcript-format.md) page.

## At a Glance

| Question | Answer |
| --- | --- |
| Can you use it? | Yes. Every session is saved unless you turn it off. |
| Can you change it? | Yes. Move the folder, change the retention, or skip saving. |
| Can you turn it on or off? | `--no-session-persistence` (print mode) or `CLAUDE_CODE_SKIP_PROMPT_HISTORY` (any mode). |
| Where does it live? | `~/.claude/projects/<project>/<session>.jsonl` |
| Status | <Documented /> <Undocumented /> |

## The Life of a Session

```mermaid
stateDiagram-v2
  [*] --> Active: claude starts
  Active --> Saved: Each message is appended to the JSONL file
  Saved --> Active: More messages
  Active --> Closed: You exit
  Closed --> Active: --continue or --resume
  Closed --> Branch: /branch or --fork-session
  Branch --> Active: New session ID, copied history
  Closed --> Deleted: Older than cleanupPeriodDays
  Closed --> Purged: claude purge
  Deleted --> [*]
  Purged --> [*]
```

## Resume and Branch

Source: Manage Sessions in the official docs.

| Item | Status | What it does |
| --- | --- | --- |
| `claude --continue`, `-c` | <Documented /> | Reopens the newest session of the current folder. |
| `claude --resume [value]`, `-r` | <Documented /> | Opens the picker, or resumes by session ID, name, or transcript path. |
| `claude --from-pr [value]` | <Documented /> | Opens a picker with the sessions that link to a pull request. |
| `claude --fork-session` | <Documented /> | With `--resume` or `--continue`, copies the history to a new session ID. |
| `/branch [name]` | <Documented /> | Copies the conversation and switches to the copy. The "allow for this session" grants carry over. |
| `--session-id <uuid>` | <Documented /> | Uses a UUID that you give for a new session. |
| `-n`, `--name <name>` | <Documented /> | Names the session in the picker and the terminal title. |
| `--no-session-persistence` | <Documented /> | Writes nothing. Print mode only. |
| `--resume-session-at <message id>` | <Undocumented /> | A hidden flag that resumes only up to one message. |
| `--reply-on-resume` | <Undocumented /> | A hidden flag that asks the model to reply at once when the transcript ends with a user message. |
| `--rewind-files <user-message-id>` | <Undocumented /> | A hidden flag that restores the files to the state at a message and then exits. It needs `--resume`. |
| `claude attach`, `logs`, `stop`, `rm`, `respawn` | <Documented /> | Control background sessions. |
| `CLAUDE_CODE_RESUME_INTERRUPTED_TURN` | <Documented /> | Resumes a turn that a crash cut off. |

A resumed session restores the history, the model, the agent, the permission mode, an active goal, and scheduled tasks.
It does not restore the values of `--mcp-config`, `--settings`, `--plugin-dir`, `--fallback-model`, or `--add-dir`, so pass them again.
If you resume one session in two terminals, the messages mix in one transcript.

## Where Files Live

Source: Explore the .claude Directory (section "Application data") in the official docs.
`CLAUDE_CONFIG_DIR` moves `~/.claude`.
The `<project>` name is the folder path with every character other than a letter or a digit changed to `-`.
A name over 200 characters is cut and gets a hash.
`CLAUDE_CODE_PROJECT_DIR_NAME` sets the name by hand, and it needs `CLAUDE_CONFIG_DIR`.

```text
~/.claude/
├── projects/
│   └── <project>/
│       ├── <session>.jsonl                  transcript
│       ├── <session>.orphaned-<time>-<id>.jsonl   set aside, not in the picker
│       ├── <session>.jsonl.superseded-<time>      set aside, not in the picker
│       ├── <session>/
│       │   ├── subagents/                   subagent transcripts
│       │   └── tool-results/                large tool outputs and MCP images
│       └── memory/                          auto memory (never cleaned)
├── file-history/<session>/                  snapshots before edits
├── plans/  debug/  paste-cache/  uploads/<session>/  dev-mods/<session>/  session-env/
├── tasks/  shell-snapshots/  backups/       backups keeps 5 copies of ~/.claude.json
├── sessions/                                one small file per running session
├── history.jsonl                            every prompt you typed
├── stats-cache.json  remote-settings.json  policy-limits.json  cache/changelog.md
├── .credentials.json  agent-memory/  jobs/  daemon/
└── settings.json  plugins/  skills/  agents/  CLAUDE.md
```

The last column shows whether Claude Code deletes the item after `cleanupPeriodDays`.

| Path under `~/.claude/` | Status | Content | Cleaned |
| --- | --- | --- | --- |
| `projects/<project>/<session>.jsonl` | <Documented /> | The transcript. | Yes |
| `projects/<project>/<session>/subagents/` | <Documented /> | The transcripts of subagents. | Yes |
| `projects/<project>/<session>/tool-results/` | <Documented /> | Large tool outputs and MCP images. | Yes |
| `projects/<project>/memory/` | <Documented /> | Auto memory. | No |
| `*.orphaned-<time>-<id>.jsonl`, `*.jsonl.superseded-<time>` | <Documented /> | Transcripts that Claude Code set aside. | Yes |
| `file-history/<session>/` | <Documented /> | Snapshots from before edits, with the 100 newest checkpoints. | Yes |
| `plans/`, `debug/`, `paste-cache/`, `uploads/<session>/`, `dev-mods/<session>/`, `session-env/` | <Documented /> | Plan files, debug logs, pastes, uploads, mods that Claude wrote, and session data. | Yes |
| `tasks/`, `shell-snapshots/`, `backups/` | <Documented /> | Task lists, shell setup, and copies of `~/.claude.json` (5 are kept). | Yes |
| `sessions/` | <Documented /> | One small file for each running session, removed at exit. | No |
| `history.jsonl` | <Documented /> | Every prompt you typed. | No |
| `stats-cache.json`, `remote-settings.json`, `policy-limits.json`, `cache/changelog.md` | <Documented /> | Usage totals, cached organization settings, organization limits, and the changelog. | No |
| `.credentials.json`, `agent-memory/`, `jobs/`, `daemon/` | <Documented /> | Files that you should keep. | No |
| `settings.json`, `plugins/`, `skills/`, `agents/`, `CLAUDE.md` | <Documented /> | Your configuration. | No |
| `state/`, `mods/`, `bridge-spawn/`, `seed-admin/`, `downloads/`, `cache/model-catalog/` | <Undocumented /> | Seen on a 2.1.303 machine or named in the program. No docs page describes them. | Unknown |

`~/.claude.json`, next to the folder, holds app state, the sign-in, and personal MCP servers.
The default retention is 30 days, and the minimum is 1.
The scratchpad of a session is in the temp folder (`/private/tmp/claude-<uid>/<project>/<session-id>/scratchpad/` on macOS), and `claude purge` does not touch it.

:::warning
The files are plain text and are not encrypted.
A secret that a tool prints goes into the transcript.
Lower `cleanupPeriodDays` or set `CLAUDE_CODE_SKIP_PROMPT_HISTORY` if that matters to you.
:::

## Controls

| Item | Status | Effect |
| --- | --- | --- |
| `cleanupPeriodDays`, `desktopSessionCleanupPeriodDays` | <Documented /> | Set how long Claude Code keeps files. |
| `CLAUDE_CODE_SKIP_PROMPT_HISTORY` | <Documented /> | Writes no transcript and no history in any mode. |
| `CLAUDE_CODE_TRANSCRIPT_LOCAL_GC` | <Documented /> | Limits the transcript size of `-p` and SDK sessions. |
| `CLAUDE_CONFIG_DIR` | <Documented /> | Moves `~/.claude` to another folder. |
| `CLAUDE_CODE_PROJECT_DIR_NAME` | <Documented /> | Sets the `<project>` folder name by hand. Needs `CLAUDE_CONFIG_DIR`. |
| `claude purge [path]` | <Documented /> | Deletes the transcripts, tasks, file history, and config entry of a project. Flags: `--all`, `--dry-run`, `-i`, `-y`. |
| `/export` | <Documented /> | Exports a conversation. Use it, not the JSONL file, for scripts. |

## Example

You close the terminal in the middle of a task.
The next day you run `claude --continue` in the same folder.
The conversation, the model, and the permission mode come back.

```bash
claude --continue
claude --resume my-feature --fork-session
claude purge --dry-run
```

## Related Pages

- [Transcript Format](../reference/transcript-format.md)
- [Context and Compaction](context-and-compaction.md)
- [Architecture](architecture.md)
- [CLI](../configure/cli/index.md) and [Environment Variable](../configure/env-vars/index.md) pages in Configure.
