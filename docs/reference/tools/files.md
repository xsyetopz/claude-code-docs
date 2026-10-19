---
title: Files, Search, and Memory
description: Every parameter of Read, Write, Edit, NotebookEdit, Glob, Grep, LSP, and the memory tools.
sidebar_position: 2
---

These tools read, write, and search files, and they store memory notes.
Use `Read` before `Edit`, because `Edit` replaces an exact string in a file.
For example, `Grep` with `output_mode` set to `files_with_matches` lists only the files that match.
The Yes and No columns are explained on [Tools](index.md#how-to-read-the-tool-tables).

You can also read or edit files yourself and let Claude see the result. Deny the tool name in `permissions.deny`, or leave it out of a subagent `tools` list, to turn a tool off. The memory tools need a server-side flag.

## Tools

Source: [Tools Reference](https://code.claude.com/docs/en/tools-reference), [Configure Permissions](https://code.claude.com/docs/en/permissions), and the program (the tool input schemas).

| Tool | Status | What It Does | How It Works | Available In | Read-Only | Parallel | Deferred |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `Read` | <Documented /> | Reads files, images, PDFs, and notebooks. | See [Read Parameters](#read-parameters). | Main session and subagents. Kept in background subagents. | ✅ | ✅ | ❌ |
| `Write` | <Documented /> | Creates or overwrites a file. | `file_path` (string, required, absolute), `content` (string, required), `machine` (optional). A deny rule wins. | Main session and subagents. Kept in background subagents. | ❌ | ❌ | ❌ |
| `Edit` | <Documented /> | Replaces an exact string in a file. | `file_path` (required), `old_string` (required), `new_string` (required, must differ), `replace_all` (boolean, default false), `machine` (optional). | Main session and subagents. Kept in background subagents. | ❌ | ❌ | ❌ |
| `NotebookEdit` | <Documented /> | Edits a cell of a Jupyter notebook. | See [NotebookEdit Parameters](#notebookedit-parameters). | Main session and subagents. Kept in background subagents. | ❌ | ❌ | ✅ |
| `Glob` | <Documented /> | Finds files by glob pattern. | `pattern` (string, required), `path` (string, optional, directory), `machine` (optional). | Main session and subagents. The docs say a subagent can get `Glob` and `Grep` when the main session lacks them (macOS, Linux, WSL). | ✅ | ✅ | ❌ |
| `Grep` | <Documented /> | Searches file contents with ripgrep. | See [Grep Parameters](#grep-parameters). | Same as `Glob`. | ✅ | ✅ | ❌ |
| `LSP` | <Documented /> | Code intelligence: definitions, references, symbols, hover, call hierarchy. | `operation`, `filePath` (required), `line` (int, 1 or more, required), `character` (int, 1 or more, required), `query` (optional, `workspaceSymbol` only). | Main session and subagents. Background subagents keep it since `2.1.280`. | ✅ | ✅ | ✅ |
| `memory_read` | <Undocumented /> <Gated note="hidden server-side flag" /> | Reads a document from a memory store. | `store` (string, required), `path` (string, required). | ❓ | ✅ | ✅ | ❌ |
| `memory_write` | <Undocumented /> <Gated note="hidden server-side flag" /> | Saves a document to a memory store. | `store`, `path`, `content` (all strings, required; `content` replaces the whole document), `if_version` (string, max 64, version token for compare-and-set). | ❓ | ❌ | ❌ | ❌ |
| `memory_list` | <Undocumented /> <Gated note="hidden server-side flag" /> | Lists memory stores and their documents. | `store` (optional), `path_prefix` (optional, directory-aligned), `cursor` (optional). | ❓ | ✅ | ✅ | ❌ |

## Read Parameters

| Parameter | What It Does | Required |
| --- | --- | --- |
| `file_path` | Absolute path of the file. | ✅ |
| `offset` | Line to start from, 0 or more. | ❌ |
| `limit` | Number of lines to read, more than 0. | ❌ |
| `pages` | PDF page range such as `1-5`, at most 20 pages at a time. | ❌ |
| `allow_large` | Reads a file or range over the usual size limits, as far as the context allows. | ❌ |
| `machine` | Name of an attached machine. Offered only when machines are attached. | ❌ |

## NotebookEdit Parameters

| Parameter | What It Does | Required |
| --- | --- | --- |
| `notebook_path` | Absolute path of the `.ipynb` file. | ✅ |
| `new_source` | The new source of the cell. | ✅ |
| `cell_id` | Cell to edit. For `insert`, the new cell goes after it. | ❌ |
| `cell_type` | `code` or `markdown`. Required for `insert`. | ❌ |
| `edit_mode` | `replace` (default), `insert`, or `delete`. | ❌ |

## Grep Parameters

| Parameter | What It Does | Required |
| --- | --- | --- |
| `pattern` | The regular expression to search for. | ✅ |
| `path` | File or directory to search. | ❌ |
| `glob` | Glob filter such as `**/*.tsx`. | ❌ |
| `output_mode` | `content`, `files_with_matches` (default), or `count`. | ❌ |
| `-B` | Lines before each match. Needs `content` mode. | ❌ |
| `-A` | Lines after each match. Needs `content` mode. | ❌ |
| `-C` | Alias for `context`. | ❌ |
| `context` | Lines before and after each match. Needs `content` mode. | ❌ |
| `-n` | Shows line numbers. Needs `content` mode, default true. | ❌ |
| `-i` | Case-insensitive search. | ❌ |
| `-o` | Prints only the matched parts. Needs `content` mode. | ❌ |
| `type` | File type such as `js`, `py`, or `rust`. | ❌ |
| `head_limit` | Limits the first N entries. Default 250, `0` for no limit. | ❌ |
| `offset` | Skips the first N entries before `head_limit`. | ❌ |
| `multiline` | Lets `.` match newlines and patterns span lines. | ❌ |
| `machine` | Name of an attached machine. Offered only when machines are attached. | ❌ |

## Example

Block reads of secret files and all edits to lock files.

```json title=".claude/settings.json"
{
  "permissions": {
    "deny": ["Read(./.env)", "Read(./secrets/**)", "Edit(./package-lock.json)"]
  }
}
```

## How It Works

- `machine` is an extra optional field that Claude Code adds to a tool schema when an attached-machines feature is on.
- File tools check permissions with the rule syntax in [Permission Rules](../../configure/permissions/rules.md).
- `Read`, `Glob`, `Grep`, `Write`, and `Edit` carry `remoteExecution` metadata in the program. It marks them as runnable on a remote host.
- `Read` has no result size cap, so use `offset` and `limit` for large files.

## Related Pages

- [Tools](index.md)
- [Permission Rules](../../configure/permissions/rules.md)
- [Tools Reference](https://code.claude.com/docs/en/tools-reference)
