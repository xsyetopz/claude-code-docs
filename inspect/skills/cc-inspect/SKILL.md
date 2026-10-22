---
name: cc-inspect
description: Look into the user's Claude Code sessions and into the installed Claude Code program. Use this when the user asks what happened in a past session, wants to find something they or Claude said or ran, wants to check a transcript file, or asks what the program really does (a setting key, an environment variable, an event, a payload field) in the version they run.
---

# Inspect Claude Code

The `cc-inspect` MCP server reads local files only, and never changes them.

## Sessions

Transcripts live in `<config dir>/projects/<project>/<session>.jsonl`. The config dir is `CLAUDE_CONFIG_DIR`, or `~/.claude`. The project folder is the project path with each `/` as `-`.

1. `list_sessions` (with `project` to narrow it) to find a session id.
2. `search_sessions` to find a word, a file path, or a command across sessions.
3. `read_session` with `type` (`user`, `assistant`, `system`, ...) and `offset` to page through one.
4. `validate_session` to check each line against the transcript schema of the version the plugin was built for. A failing line means a field that version does not write: a newer version, a hand-edited file, or a gap in the schema. Say which version the schema is for.

Transcripts can hold secrets and private text. Quote only what the user asks for.

## The Program

1. `list_installs` shows the versions in `~/.local/share/claude/versions` and which one `claude` runs. Every binary tool takes `binary` (a version or a path).
2. `search_binary` with a literal anchor: a string such as a setting key, an environment variable, or an event name. Minified names (`Cui`, `bi`) change between versions, so do not search them across versions.
3. `read_module` with the module and offset of a hit to read the code around it.
4. `resolve_object` with the module and an `anchor` (or `offset`) to get the keys of an object literal, with spreads followed across functions and modules.
5. `resolve_event` lists the OpenTelemetry events, and with `name` gives the attributes of one event.

When you report what the program does, call the source "the program" and name the version. A key ending in `?` is optional. A value shown as `unknown` is computed, so its type is unconfirmed.
