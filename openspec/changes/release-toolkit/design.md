# Design: Repo-Local Release Toolkit

Goal: when a new Claude Code version appears, an agent runs one documented sequence and gets
JSON results it can diff against the last version. Bun + TypeScript, plus one pyte-free Python pty driver.
No new npm dependencies.

## Principles

- One safe way to start the program. Every probe goes through `lib/env.ts`. No script builds its own env.
- Offline by default (fake key, local stub, dead proxy). Live runs are opt-in and ask first.
- Results are data (JSON), not prose. Prose is written later from the diff.
- Never read `.env`. Never log headers or secrets. Never create OAuth creds. Kill only own PIDs.

## Commands

All are `bun run release:<name> [-- args]`. Common args: `--from <ver>` (default: `CLAUDE_CODE_VERSION` in
`src/version.ts`), `--to <ver>` (default: the installed binary version), `--only a,b` (case ids), `--dry` (print plan).

| Command | What it does | Needs the user |
| --- | --- | --- |
| `release:check` | Preflight: binary for `--to` exists, `python3`, `strings`, free ports, no managed folder (or the expected one), cache-warmth note. Writes `captures/<to>/env.json`. | No |
| `release:diff` | `strings -a` dumps of both binaries, then diffs env names, flags, commands, settings keys, hook events, gates. Writes `diff/*.json` and `diff/report.md`. | No |
| `release:schemas` | Wraps `bun run schemas --bin`. Stores the schema diff (old git HEAD vs new) in `schemas-diff.json`. | No |
| `release:prompts` | Wraps `tools/capture-prompts` with the default prompt. | No |
| `release:probe:print` | The sweep plus the named print probes (`-p` mode, stub). | No |
| `release:probe:pty` | Interactive probes through the pty driver. | No |
| `release:probe:managed` | Builds the managed-folder fixture in a temp dir, prints the one `sudo` command, waits, then runs the probes and prints the cleanup command. | Yes: runs `sudo` |
| `release:probe:live` | Subscription probes through the secret runner. Prints the plan and the cost, asks `y/N`. | Yes: consent, `.env` secret present |
| `release:claims` | Lists version-labelled claims in `docs/` and maps each to a probe id. | No |
| `release:compare` | Diffs `captures/<from>/` against `captures/<to>/` per case. Writes `compare.md` and `compare.json`. | No |
| `release:all` | Runs check, schemas, diff, prompts, probe:print, probe:pty, claims, compare in order. Skips managed and live and prints them as "needs you". | No |

`release:probe:*` commands print a one-line summary per case and exit non-zero if a case failed to run
(a changed result is not a failure).

## Layout

```text
tools/release/
  README.md                 runbook (task 1.8)
  cli.ts                    dispatch: bun tools/release/cli.ts <command> ...
  lib/
    env.ts                  child env builder, version/binary lookup
    stub.ts                 multi-tenant stub server (replaces both capture-prompts/stub.ts users)
    ports.ts                port allocator
    sandbox.ts              temp dirs, fixture files, cleanup
    proc.ts                 spawn with timeout, own-PID registry, kill-on-exit
    pty/driver.py           pyte-free pty driver (stdlib only)
    pty/driver.ts           TS wrapper: spawn driver, send schedule, read results
    results.ts              result types, write/read, redaction, normalisation
    cache.ts                subscription-cache warmth helper
    mitm.ts                 local TLS stand-in for live runs (usage endpoint faults)
  diff/                     strings dumps and diff (1.2)
  probes/
    print/                  one file per probe group, plus sweep.ts and sig.ts
    pty/                    scenario files (JSON schedules plus checks)
    live/                   live scenarios
    managed/                variants/, mcp stub server, install/cleanup script generator
  claims/                   claims.ts, map.json, compare.ts (1.7)
  secret-runner.sh          committed copy of the .claude/run-with-env.sh guarantees
```

`tools/capture-prompts/stub.ts` stays. `lib/stub.ts` is a superset (per-case id in the URL path, tool sequences,
response headers) and `capture-prompts` can move to it later; not part of this change.

## Shared Library API

### env.ts

```ts
export const FAKE_KEY = "sk-ant-fake-probe";
export type ChildEnvOpts = {
  home: string; configDir: string; baseUrl: string;   // from sandbox + stub
  extra?: Record<string, string>;                      // variable under test
  tty?: boolean;                                       // adds TERM, LANG
  auth?: "fake-key" | "none";                          // never "oauth"
};
export function childEnv(o: ChildEnvOpts): Record<string, string>;
export function binaryPath(version: string): string;   // ~/.local/share/claude/versions/<v>
export function installedVersions(): string[];
export function assertSafeEnv(env: Record<string, string>): void; // throws on CLAUDE_CODE_OAUTH_TOKEN etc.
```

`childEnv` builds the env from nothing (never copies `process.env`; the parent exports `CLAUDE_CODE_*`). Fixed keys:
`PATH` (a fixed system list plus the Bun dir), `HOME`, `TMPDIR`, `CLAUDE_CONFIG_DIR`, `ANTHROPIC_API_KEY=FAKE_KEY`,
`ANTHROPIC_BASE_URL`, `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`, `DISABLE_TELEMETRY=1`,
`HTTPS_PROXY`/`HTTP_PROXY=http://127.0.0.1:9` (dead), `NO_PROXY=127.0.0.1,localhost`, `GIT_CONFIG_GLOBAL`.
Shell-launched children (pty) are started as `env -i K=V ... <bin>` so the shell cannot add anything.
`assertSafeEnv` rejects any key that looks like a credential unless it is `ANTHROPIC_API_KEY=FAKE_KEY`.
`.claude.json` seeding for pty runs (onboarding done, trusted project, fake key pre-approved) lives in `sandbox.ts`
and never writes `oauthAccount` or any token (that triggers the macOS keychain dialog).

### stub.ts

```ts
export type StubCase = {
  log: string;                                  // JSONL request log
  text?: string;                                // default "OK"
  tool?: string; toolInput?: unknown;           // one tool_use on first turn
  seq?: { name: string; input: unknown }[];     // several tool turns
  respHeaders?: Record<string, string>;
};
export function startStub(port: number): {
  port: number;
  register(id: string, c: StubCase): string;    // returns base URL ".../<id>"
  unregister(id: string): void;
  stop(): void;
};
```

One server, many cases: the base URL path starts with the case id, so parallel sweep workers share a port.
The log keeps method, path, body, `authIsFakeKey`, and a header allow-list with `x-api-key` and `authorization`
replaced by `<redacted>`. Requests that carry a different key set `bad=true`; the runner fails the case.
The stub never forwards. Replies are canned SSE or JSON; default reply text is `OK`.

### ports.ts

```ts
export async function allocPort(): Promise<number>;       // bind 127.0.0.1:0, read the port, close, remember it
export function reserve(range?: [number, number]): number; // optional fixed range 18400-18499 for logs
export function inUse(port: number): Promise<boolean>;
```

Unique per process: a registry file in the run dir prevents two toolkit runs from using the same port. Default is
OS-assigned (`:0`), not the fixed `184xx` numbers the p305 scripts used. The sweep uses one stub with 8 workers.

### sandbox.ts

```ts
export type Sandbox = { root: string; home: string; cfg: string; proj: string; cleanup(): void };
export function makeSandbox(opts?: {
  cfgFiles?: Files; projFiles?: Files; homeFiles?: Files;   // {HOME} {CFG} {PROJ} placeholders
  git?: boolean; trusted?: boolean; seedOnboarding?: boolean;
}): Sandbox;
```

All dirs are under `mkdtemp` + `realpath` (macOS `/var` vs `/private/var` matters for trusted-project keys).
`cleanup` only removes paths created by this process (tracked in a set).

### proc.ts

```ts
export function runChild(argv: string[], o: { cwd: string; env: Record<string,string>; stdin?: string; timeoutMs?: number }):
  Promise<{ stdout: string; stderr: string; code: number | null; timedOut: boolean; pid: number }>;
export function ownPids(): number[];
export function killOwn(): void;      // SIGTERM then SIGKILL, only PIDs this process spawned
```

A registry of spawned PIDs plus `process.on("exit"|"SIGINT"|"SIGTERM")` cleanup. No `pkill`, no name matching.
Default timeout 60 s. The pty driver reports its child PID and `killOwn` uses it.

### pty/driver.py (stdlib only; no pyte, no tmux)

CLI: `python3 -I driver.py --cwd D --out RAW --secs N --schedule S.json -- env -i K=V ... <bin> args`.
Schedule items: `{"t": seconds, "send": "text\\r", "label": "x"}` (time-based, from `sl/drv2.py`) or
`{"wait_for": "regex-on-stripped-output", "timeout": 20, "send": "...", "label": "x"}` (output-based, from `p305-lv/drv.py` steps).
Uses `pty.fork`, `TIOCSWINSZ` (default 50x200, overridable `--rows --cols`), a 20 ms `select` loop.
Outputs: `RAW` (bytes), `RAW.idx` (wall time and byte offset per read, for timing probes such as the 5 s status-line tick),
`RAW.sent` (time and label per send), `RAW.screen.txt` (text with ANSI stripped by the `strip.py` regex, plus
carriage-return and cursor-forward handling for readable snapshots).
Kills only its own child PID, and its child group, at the end. Prompt text is sent, then a short pause, then `\\r`
(from `p305-fix/drv.py`). TS wrapper: `runPty({ cwd, env, bin, args, schedule, secs, rows, cols }) -> { rawPath, screen, sent, idx }`.
Screen snapshots are plain "strip ANSI, collapse spaces" text. Probes assert with regexes on that text, not on cell grids.

### results.ts

See Result Format. API: `openRun(version)`, `writeCase(runDir, CaseResult)`, `readRun(version)`, `redact(obj)`, `normalise(obj)`
(drop temp paths, request ids, timestamps, uuid, port numbers, `cc_version` build suffix kept as a separate field).

### cache.ts

```ts
export function cacheNote(): string;                 // human text for the plan
export function planLive(cases: LiveCase[]): LiveCase[]; // order and spacing
```

The subscription prompt cache has a 1 h TTL and is shared across sessions, so a live run is "warm" if any session used the
same prefix in the last hour. Rules: record `cacheState` per live case from the first response usage
(`cache_read_input_tokens` > 0 means warm); run the cold-sensitive cases (context budget) first; use a unique marker in
the project `CLAUDE.md` of each case so its prefix is new; if a case needs a cold cache and the previous run was under 1 h
ago, wait or flag it `cacheWarm: true` in the result. No auto-retry.

### mitm.ts

Local TLS stand-in for `api.anthropic.com`, behind a `CONNECT` proxy on a dynamic port. Used only by live runs that need a
fault on one endpoint (`/api/oauth/usage` 429, with and without `retry-after`, envelope form). It forwards everything else,
logs path and status only, never headers or bodies of auth calls. It needs a throw-away CA for the child
(`NODE_EXTRA_CA_CERTS` to a file in the temp dir). Generate the CA with `openssl` in the temp dir at start and delete it after.
The p305 scripts read a pre-made `/tmp/p305-pty/pki`; the toolkit must create it.

## Secret Runner

`tools/release/secret-runner.sh <oauth|apikey> <cmd...>`: same contract as `.claude/run-with-env.sh`.
Guarantees: starts with `env -i` and a fixed `PATH`; reads exactly one variable from the repo `.env` by `grep -m1 "^VAR="`
inside the runner (not in the parent); passes it only to the child via `exec env -i`; prints nothing on success or
failure except "VAR not set"; refuses any other first argument; no `set -x`; no `export`. It must be executable and
committed; it does not contain a secret. `probe:live` calls `secret-runner.sh oauth bun tools/release/probes/live/run.ts ...`,
so the whole live runner (not just `claude`) runs inside the clean env and receives only the one secret.
Inside, `live/run.ts` hands the token to the program as `CLAUDE_CODE_OAUTH_TOKEN` and to no other process, and drops it
from any log (`redact` replaces the value and any `sk-ant-` prefix). The copy under `.claude/` stays as the user's own;
the toolkit does not edit it. Open question for the user: whether to commit this or keep using `.claude/` (see Open Questions).

## Result Format

Folder per version, gitignored: `captures/<version>/`.

```text
captures/2.1.305/
  run.json                     { version, startedAt, toolkitRev, host, commands: [...] }
  env.json                     preflight facts
  diff/                        strings-env.json, flags.json, commands.json, settings.json, hooks.json, gates.json, report.md
  schemas-diff.json
  prompts/<id>/                from capture-prompts (unchanged layout)
  print/<case>.json            one CaseResult per probe case
  print/sweep.json
  pty/<case>.json  (+ <case>.raw, <case>.idx, <case>.screen.txt)
  managed/<case>.json
  live/<case>.json
  claims.json
  compare/<from>..<to>.json, compare.md
```

`CaseResult` (all probes write this shape; `schema: 1`):

```ts
type CaseResult = {
  schema: 1;
  id: string;                  // stable across versions, e.g. "print.hooks.posttooluse.edit"
  group: "print" | "pty" | "managed" | "live" | "diff";
  version: string;             // binary under test
  prompt: string;              // always "Reply with 'OK'." unless the case needs a different input (then why in notes)
  args: string[]; envSet: string[];         // names only; values listed only for non-secret probe vars
  exit: number | null; timedOut: boolean;
  facts: Record<string, string | number | boolean | null | string[]>; // small, comparable values
  samples?: Record<string, string>;         // longer text, trimmed to 3000 chars, normalised
  requests?: { count: number; paths: string[]; betas?: string[]; bodyKeys?: string[] };
  cacheWarm?: boolean;         // live only
  claims: string[];            // claim ids this case checks
  notes?: string;
};
```

`facts` are the diff surface: `compare.ts` walks `facts` per case id and reports `added`, `removed`, `changed` (old, new).
`samples` are shown on request (`--samples`). Raw stdout, request logs, and pty raw files are kept beside the JSON
but are never diffed directly. Redaction happens in `writeCase`; a secret-shaped string (`sk-ant-`, `Bearer`, a value
equal to the live token) in any field fails the write. Sweep results use the same shape with one fact per variable
(`<NAME>.A`, `<NAME>.B` = list of changed signature keys), keeping the baseline-noise subtraction from `sweep.ts`.

## Claim Map

Problem: docs say "since 2.1.304", "new in 2.1.304", "(2.1.303)", and probes.md has rows for checked behaviour.
When 2.1.306 arrives each such claim must be re-checked or left alone with intent.

Finding claims (`claims/claims.ts`):

1. `git grep -n -E '2\.1\.[0-9]+' -- docs` (about 160 files mention 2.1.30x). Each hit is a claim candidate with file, line,
   the enclosing sentence or table row, and the nearest heading. Version regex also matches `` `2.1.304` `` and link text.
2. Classify by phrase: `since|new in|added in|changed in|as of` (a change claim), `not checked on` (a gap), bare version
   (informational). Only the first class is a claim by default.
3. Stable id: `<doc path>#<heading slug>:<sha1 of normalised sentence>[0:8]`. Survives line moves; changes when the text changes.

Mapping to probes (`claims/map.json`, committed, hand-edited, checked by `release:claims --check`):

```json
{ "docs/hooks/events.md#posttooluse:ab12cd34": { "probes": ["print.hooks.posttooluse.edit"], "kind": "behaviour" },
  "docs/reference/env-vars.md#...:...":       { "probes": ["sweep"], "kind": "env" },
  "docs/foo.md#bar:ffff0000":                 { "probes": [], "kind": "static", "note": "text only, no probe" } }
```

`kind` values: `behaviour` (a named probe), `env` (sweep; `probes: ["print.sweep"]`, compare looks at the facts of that name only),
`flag`/`command`/`setting`/`hook`/`gate` (from `release:diff` output; mapped automatically when the subject of a table row,
its first backticked token, is a name in `diff/*.json`), `schema` (from `release:schemas`), `manual` (program behaviour that
no probe checks yet; compare always reports it `not-run`), `static` (nothing to re-check, such as release history),
`external` (comes from official docs, not the program).
Automatic mapping: the subject of a table row that matches a name in `diff/*.json` gets `kind` from that file.
Everything else must be in `map.json`. Probes read their claim ids back from `map.json` (`claims/map.ts`), so
`claims: []` in a result and the map stay consistent; `claims --check` warns when they disagree.

`release:claims` writes `claims.json`: `{ id, file, line, text, kind, probes, status }` with
`status`: `unmapped` (fails `--check`), `mapped`, `static`. After probes run, `compare` adds `result`: `unchanged`,
`changed`, `not-run` per claim by looking at the probe facts. The agent's page-update worklist is "all claims with
`result = changed` or `not-run`", plus new things in `diff/` that no claim covers (undocumented candidates).
A probe case declares the claims it checks in `claims: []`; `claims --check` also warns about probes that no claim uses.

## Runbook Order

1. `release:check` (binary installed, ports, python, managed folder state). If the new binary is missing: user installs it.
2. Bump `src/version.ts` only at the end (step 12), so `--from` stays right.
3. `release:schemas`, then `bun run schemas:check` (before diff: the settings diff reads the regenerated schemas).
4. `release:diff`: read `diff/report.md` first; it drives which docs pages are affected.
5. `release:prompts` (offline; updates `docs/prompts/` inputs).
6. `release:probe:print` (offline). Sweep first, then named probes.
7. `release:probe:pty` (offline). Run when the machine is idle (timing probes).
8. `release:claims`, then `release:compare`: produces the worklist.
9. User step: `release:probe:managed`. Tool prints the single `sudo` command; the user runs it; the tool continues, then prints the cleanup command.
10. User step: `release:probe:live` (only with explicit consent; cache-warmth plan shown).
11. Agent updates docs from the worklist. Each edit cites the case id.
12. Bump `src/version.ts`, run `bun run verify:locked`, reviewer, commit, push.

Steps 1-8 are unattended and safe to run in a fresh session. Steps 9-10 need the user.

## What Each p305 Script Maps To

| p305 script | Becomes |
| --- | --- |
| `p305-print/lib.ts`, `stub2.ts` | `lib/env.ts`, `lib/stub.ts`, `lib/sandbox.ts`, `lib/proc.ts` (the `runCase` core: case spec, placeholders, bad-auth check) |
| `base.ts` (`baselineA/B`, `sig`, `diffSig`) | `probes/print/sig.ts` (signature and diff, shared by the sweep and `dd`/`envchk`) |
| `sweep.ts`, `all305.txt`, `rebuilt.txt` | `probes/print/sweep.ts`; the name list is rebuilt by `release:diff` from `strings -a` with the documented prefix filter, not from a saved file |
| `ctl.ts`, `ptu.ts`, `script.ts`, `perf.ts`, `tr*.ts`, `sub*.ts`, `am*.ts`, `cfgmem.ts`, `wf*.ts`, `br.ts`, `ck.ts`, `fp.ts`, `models.ts`, `stores*.ts`, `misc*.ts`, `dsc*.ts` | named probe files in `probes/print/` (one per group in the proposal list); the one-off `an*.ts`, `t*.ts`, `B-*.ts` are folded in only if a claim needs them |
| `PROGRESS.md` (both) | the idea of a per-run progress note: `run.json.commands` plus `compare.md`; no hand-kept file |
| `p305-fix/drv.py`, `run.sh` | `lib/pty/driver.py` (time-based send) and the `env -i` launch in `driver.ts`; `run.sh` seeding becomes `sandbox.ts` |
| `sl/drv2.py`, `run.sh` | driver schedule with timestamps plus `.idx`; scenarios `probes/pty/statusline-*.json` |
| `p305-pty/*.sh`, `settings-*.json`, `hook.sh`, `stub2/3.ts`, `mcp-elicit.ts`, `mitm.ts` | pty scenario files (settings fixtures inline), hook logging helper, stub options, `lib/mitm.ts`. The screen-session helpers (`pt.py`, `ptd.py`, `sc.sh`) are replaced by the driver. `guide.txt` is output, not input |
| `p305-lv/drv.py`, `strip.py`, `mitm2.ts`, `start.sh`, `s_*.json` | `driver.py` wait_for steps, screen stripping, `lib/mitm.ts`, live scenarios (`usage`, `artifacts` step files) |
| `p305-live/lib.sh`, `proxy.ts`, `sum.py` | `probes/live/context-budget.ts` (runs `-p` then `--continue /context`, reads `context_usage`); `proxy.ts` logs bodies only, becomes an option of `mitm.ts` ("forward and log body") |
| `p305-managed/*` | `probes/managed/`: `variants/` and `mcp/` copied; `probe.ts` split into `fixtures`, `phases`; `install.sh`/`uninstall.sh`/`run-all.sh` become a generated script printed for the user (paths from the repo, not `/tmp`) |
| `p305-setup/setup.sh` | not ported; the secret runner is committed instead |

## Risks

- Binary-internal assumptions: probes rely on text in `strings` and on the `context_usage` event shape; a rename
  breaks a probe quietly. Each probe records a `precondition` fact (e.g. the init event has the field) so a miss shows as
  "probe invalid", not "behaviour changed".
- Timing probes (status line, debounce) are noisy under load. Record observed intervals with a tolerance; mark `flaky: true` when a rerun disagrees.
- Warm subscription cache makes live token counts too low. Cache plan plus `cacheWarm` flag. Never present a warm result as a doc number.
- Live runs cost quota and may hit a 429. One attempt, no loop. The user is asked every run.
- Local TLS CA for `mitm.ts` must stay inside the child env and a temp dir; never installed into the system or keychain.
- Managed folder is root-owned under `/Library/Application Support/ClaudeCode`. The tool refuses to continue if the folder
  exists and has no marker file; the printed command removes it afterwards. Leftover folder changes every later run.
- Parent env leak: `childEnv` builds from empty and pty children go through `env -i`; a unit-style self-test
  (`release:check --selftest`) spawns a hook that dumps its env and fails on any `CLAUDE_CODE_*` not set by the program itself.
- Version drift of the toolkit: scenarios name flags and files that may disappear; failures are reported per case, not fatal for the run.
- Large outputs: `captures/` can grow. `release:check` prints sizes; old versions are deletable by hand.
- Prompt rule: only `Reply with 'OK'.`; `lib/env.ts` exports `PROMPT` and probes cannot pass another string except through
  an explicit `promptReason` (e.g. a tool-trigger prompt for subagent probes, using the stub's tool_use instead).

## Open Questions

- Commit the secret runner as `tools/release/secret-runner.sh` and leave `.claude/run-with-env.sh` alone? (assumed yes)
- Keep `captures/` gitignored and store only the summary (`compare.md`) in the commit message or PR? (assumed yes)
- Should `release:all` ever run the managed step automatically after a `sudo -n` check? (assumed no)
- Is `openssl` acceptable for the throw-away CA in live fault tests? (macOS ships LibreSSL)

## Implementation Split

Each chunk fits one implementer run of about 40 turns. Order matters where noted.

| Task | Chunk | Contents |
| --- | --- | --- |
| 1.2 | A | `cli.ts` skeleton, `release:check`, `release:diff` (strings dumps, name lists via the documented prefix filter, flags/commands/settings/hooks/gates diffs, `report.md`), `release:schemas` and `release:prompts` wrappers. Writes `run.json`, `env.json`, `diff/*`. |
| 1.3a | B1 | `lib/env.ts`, `stub.ts`, `ports.ts`, `sandbox.ts`, `proc.ts`, `results.ts`, `release:check --selftest` (env-leak check). Port `p305-print/lib.ts`, `stub2.ts`. No probes yet. |
| 1.3b | B2 | `probes/print/sig.ts`, `sweep.ts`, and the first half of named probes (control protocol, PostToolUse, script hook, Perfetto, transcripts, request details). Depends on B1. |
| 1.3c | B3 | Rest of print probes (auto mode, subagents, configure/memory, `--disable-slash-commands`, `--brief`, `--resume`, `cache_touch`). Depends on B1. May run in parallel with B2. |
| 1.4a | C1 | `lib/pty/driver.py` and `driver.ts` (time and wait_for steps, idx/sent/screen outputs), self-test against a tiny local shell program. Sandbox `.claude.json` seeding. |
| 1.4b | C2 | pty scenarios: hooks (PermissionRequest/Denied, Notification, PreCompact, Elicitation), notifications, status line timings, size warnings, agent types, guide/skill-insights captures. Depends on B1 and C1. |
| 1.5 | D | `secret-runner.sh`, `cache.ts`, `mitm.ts` (own CA), `probes/live/` (context budget, OAuth parity, `/usage`, `/artifacts`), consent prompt. Dry mode with a fake token in tests only. Depends on B1 and C1. |
| 1.6 | E | `probes/managed/`: fixtures, phases, generated sudo and cleanup scripts, marker file check. Depends on B1. |
| 1.7 | F | `claims/claims.ts`, `map.json` seed for current docs, `release:claims --check`, `compare.ts` and `release:compare`. Depends on result shape from B1; can start with fixture results. |
| 1.8 | G | `tools/release/README.md` runbook, CLAUDE.md link, `package.json` `release:*` scripts, markdownlint and Biome clean. |

Safe parallel pairs: (B2, B3), (C1, E). Task 1.9 (dry run) stays with the main agent.

## User Decisions (2026-10-21)

- `/usage` 429 probes: generate a throw-away CA with openssl in a temp dir per run. Trust it only through the child env, never the keychain, and delete it after the run.
- Commit `tools/release/secret-runner.sh` with the same contract as `.claude/run-with-env.sh`, which stays untouched.
- `release:all` never runs the managed step. `captures/` stays gitignored.
