#!/bin/sh
# Serializes `bun run verify` so parallel writers do not share .docusaurus/ at once.
LOCK=/tmp/claude-code-docs-build.lock
until mkdir "$LOCK" 2>/dev/null; do sleep 5; done
trap 'rmdir "$LOCK"' EXIT INT TERM
bun run verify
