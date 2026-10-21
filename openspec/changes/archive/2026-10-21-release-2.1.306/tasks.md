# Tasks: Release Claude Code 2.1.306

## 0. Toolkit fixes

- [x] 0.1 Probe `security` shim on PATH (childEnv, liveEnv, capture-prompts), `GIT_CONFIG_NOSYSTEM`, selftest check, README note (fix: childEnv/liveEnv pure via `shimDir`; shim written in `makeSandbox`/capture.ts; `assertShimReady` guard in runChild/runPty) (review: `capture.ts` also calls `assertShimReady` before each spawn)
- [x] 0.2 Report signal-killed steps (`<step> killed by <signal>`, 128 + n) instead of exit 1 in wrap.ts and all.ts
- [x] 0.3 pty step clock counts from READY (`rebase` step flag in driver.py, set on READY and the status line `UP`); slow-start retry (`startLagS`, `retried`, `firstRun`); compare marks invalid runs (`invalid-run`) (review: `firstRun` became `attempts`; invalid-run retry is one launch, so at most 2 launches per case)
- [x] 0.4 compare ignores known noise (`NOISY` map by case id in compare.ts, plus version-string-only changes), lists it under "Noise (ignored)" in compare.md; probe hashes normalised (`pty.captures.skill-insights`, `cc_version` in sig.ts); selftest added (review: claim rows ignored as noise say so in "why" and are listed under "Noise (ignored)" with the claim id)

## 1. Release

- [x] 1.1 `release:all --from 2.1.305 --to 2.1.306`; read diff/report.md and compare/compare.md worklist
- [x] 1.2 Apply worklist + release-note changes to docs pages (cite case ids / release link)
- [x] 1.3 Bump version strings (src/version.ts, docs labels, plugin, README, CLAUDE.md, CHANGELOG); `bun run schemas`
- [x] 1.4 schemas:check, verify:locked; reviewer; commit and push
