#!/bin/bash
# Usage: tools/release/secret-runner.sh <oauth|apikey> <command...>
# Runs <command> with env -i, a fixed PATH, and one secret from the repo .env. Never prints it.
# This file holds no secret and is committed. Same contract as .claude/run-with-env.sh (which stays untouched).
# Known limit: the value is in `env`'s argv for a moment before exec (visible to same-user `ps`); `exec -c` and bash
# prefix assignments cannot do better without extra env names (PWD, SHLVL, _), so the original contract is kept.
# PATH has the Bun dir so `bun` resolves. No set -x, no export.
set -euo pipefail
cd "$(dirname "$0")/../.."
case "${1:-}" in oauth) VAR=CLAUDE_CODE_OAUTH_TOKEN ;; apikey) VAR=ANTHROPIC_API_KEY ;; *) echo "usage: $0 <oauth|apikey> <cmd...>" >&2; exit 2 ;; esac
shift
VAL="$(grep -m1 "^${VAR}=" .env | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//')"
[ -n "$VAL" ] || { echo "$VAR not set in .env" >&2; exit 1; }
exec env -i PATH="/usr/bin:/bin:/usr/sbin:/sbin:$HOME/.local/bin:$HOME/.bun/bin:/opt/homebrew/bin:/usr/local/bin" "$VAR=$VAL" "$@"
