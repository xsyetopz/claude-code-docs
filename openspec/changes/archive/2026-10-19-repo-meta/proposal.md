# Proposal: Repo Meta

## Why

User: "a repo-level CLAUDE.md symlinked to AGENTS.md just titled `# CLAUDE.md` with a concise, lightweight body.
https://agents.md/ for guidelines." "CODE_OF_CONDUCT.md would be important, too, same for Keep-A-Changelog-style CHANGELOG.md"
Choices: CLAUDE.md is the real file, AGENTS.md is a symlink to it. CoC contact: GitHub private reports (no email published).

## What Changes

- `CLAUDE.md` (title `# CLAUDE.md`, short: project, commands, layout, rules) + `AGENTS.md -> CLAUDE.md`.
- `CODE_OF_CONDUCT.md`: Contributor Covenant 2.1, enforcement via GitHub private reporting / maintainer profile.
- `CHANGELOG.md`: Keep a Changelog 1.1.0, `Unreleased` section built from git history.
