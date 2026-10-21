// Shared runner for pty probes: one interactive program run per case, in a temp sandbox, against the local stub.
// Ports the p305-pty start.sh/launch.sh/sc.sh flow onto lib/* (env.ts, sandbox.ts, driver.ts, stub.ts).
// Nothing here uses OAuth, the macOS keychain, /tmp fixed paths, or a shell-launched child.
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { binaryPath, childEnv, PROMPT } from "../../lib/env.ts";
import { allocPort } from "../../lib/ports.ts";
import { type PtyResult, type PtyStep, runPty } from "../../lib/pty/driver.ts";
import { renderRaw } from "../../lib/pty/render.ts";
import {
  type CaseResult,
  type Fact,
  normalise,
  openRun,
  writeCase,
} from "../../lib/results.ts";
import { type Files, makeSandbox, type Sandbox } from "../../lib/sandbox.ts";
import {
  type LoggedRequest,
  readLog,
  type Stub,
  type StubCase,
  startStub,
} from "../../lib/stub.ts";
import type { Ctx } from "../../util.ts";

export { PROMPT };
export type Obj = Record<string, unknown>;
export const obj = (x: unknown): Obj =>
  x && typeof x === "object" && !Array.isArray(x) ? (x as Obj) : {};
export const arr = (x: unknown): unknown[] => (Array.isArray(x) ? x : []);

/** The hook logging helper. Writes <epoch.ms> <stdin JSON> into {HOME}/hooklog/<Event>.log (never /tmp). */
export const HOOK_SH = `#!/bin/bash
# hook.sh <Event>: log stdin JSON, print ctl/<Event> if present, exit with ctl/<Event>.exit
E=$1; D="$HOME/hooklog"; mkdir -p "$D/ctl"
IN=$(cat)
T=$(/usr/bin/perl -MTime::HiRes=time -e 'printf "%.3f", time')
printf '%s %s\\n' "$T" "$IN" >> "$D/$E.log"
[ -f "$D/ctl/$E" ] && cat "$D/ctl/$E"
[ -f "$D/ctl/$E.exit" ] && exit "$(cat "$D/ctl/$E.exit")"
exit 0
`;
/** Status line helper: logs one row per call (time, env, stdin) and prints rows. Kind "sub" prints one row per task. */
export const SL_SH = `#!/bin/bash
# sl.sh <kind>: log invocation (time, env, stdin) and print a row
K=$1; D="$HOME/sllog"; mkdir -p "$D"
IN=$(cat)
T=$(/usr/bin/perl -MTime::HiRes=time -e 'printf "%.3f", time')
printf '%s ENV COLUMNS=%s LINES=%s CLAUDECODE=%s CHILD=%s\\n%s\\n' "$T" "$COLUMNS" "$LINES" "$CLAUDECODE" "$CLAUDE_CODE_CHILD_SESSION" "$IN" >> "$D/$K.log"
if [ "$K" = sub ]; then
  echo "$IN" | /usr/bin/python3 -c 'import sys,json;d=json.load(sys.stdin);[print(json.dumps({"id":t["id"],"content":"SUBROW "+t["status"]})) for t in d.get("tasks",[])]'
else
  echo "SL-ROW1"; echo "SL-ROW2"
fi
`;

/** A hook entry that runs the helper for one event. */
export const hookCmd = (event: string, matcher?: string): Obj => ({
  ...(matcher !== undefined ? { matcher } : {}),
  hooks: [{ type: "command", command: `/bin/bash {HOME}/hook.sh ${event}` }],
});
export const hooks = (events: string[]): Obj => ({
  hooks: Object.fromEntries(events.map((e) => [e, [hookCmd(e)]])),
});

export type PtyCase = {
  id: string; // inside the group, e.g. "hooks.permissionrequest.allow"
  settings?: Obj; // cfg/settings.json ({HOME} {CFG} {PROJ} allowed)
  cfgFiles?: Files;
  projFiles?: Files;
  homeFiles?: Files;
  git?: boolean;
  ctl?: Record<string, { out?: string; exit?: number }>; // hook replies, written to hooklog/ctl before the run
  stub?: Omit<StubCase, "log">;
  args?: string[]; // after --permission-mode/--model
  mode?: string; // --permission-mode, default "default"
  model?: string; // default claude-opus-5-5
  env?: Record<string, string>;
  schedule: PtyStep[];
  secs: number;
  rows?: number;
  cols?: number;
  prompt?: string; // anything but PROMPT needs promptReason
  promptReason?: string;
  claims?: string[];
  notes?: string;
  setup?: (sb: Sandbox) => void;
  facts: (x: PtyRun) => Record<string, Fact>;
  samples?: (x: PtyRun) => Record<string, string>;
  artifacts?: (x: PtyRun) => Record<string, string>; // extra files beside the JSON: <case>.<name>
  /** Timing cases: when the first facts say "out of tolerance", run once more; disagreement marks the case flaky. */
  retryIf?: (facts: Record<string, Fact>) => boolean;
};

export type PtyRun = {
  pty: PtyResult;
  screen: string;
  reqs: LoggedRequest[];
  sb: Sandbox;
  hook: (event: string) => { t: number; json: Obj; line: string }[];
  file: (rel: string) => string; // read a file under the sandbox home ("" if missing)
  messages: LoggedRequest[]; // requests with a messages array
};

export type PtyCtx = {
  version: string;
  bin: string;
  runDir: string;
  only: string[] | null;
  dry: boolean;
};

let stubP: Promise<Stub> | null = null;
const getStub = (): Promise<Stub> => {
  stubP ??= allocPort().then((p) => startStub(p));
  return stubP;
};
export const stopStub = async (): Promise<LoggedRequest[]> => {
  const p = stubP;
  stubP = null;
  return p ? (await p).stop() : [];
};

let counter = 0;
const subst = (s: string, sb: Sandbox): string =>
  s
    .split("{HOME}")
    .join(sb.home)
    .split("{CFG}")
    .join(sb.cfg)
    .split("{PROJ}")
    .join(sb.proj);

/** Does the --only list select this id (`pty.` prefix optional, prefix match on dotted segments both ways, or the bare case name)? */
export const selected = (only: string[] | null, id: string): boolean => {
  if (!only) return true;
  return only.some((raw) => {
    const o = raw.startsWith("pty.") ? raw : `pty.${raw}`;
    // a bare case name (last dotted segment) also matches, like probe:managed
    return (
      o === id ||
      id.startsWith(`${o}.`) ||
      o.startsWith(`${id}.`) ||
      id.split(".").pop() === raw
    );
  });
};

const parseLog = (file: string): { t: number; json: Obj; line: string }[] =>
  existsSync(file)
    ? readFileSync(file, "utf8")
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const i = line.indexOf(" ");
          let json: Obj = {};
          try {
            json = obj(JSON.parse(line.slice(i + 1)));
          } catch {
            // keep an empty object
          }
          return { t: Number(line.slice(0, i)), json, line };
        })
    : [];

export const isSystemMsg = (x: LoggedRequest): boolean =>
  x.path.startsWith("/v1/messages") && !!obj(x.body)["messages"];
/** The system prompt of a request as one string. */
export const sysText = (x: LoggedRequest): string =>
  JSON.stringify(obj(x.body)["system"] ?? "");
export const toolNames = (x: LoggedRequest): string[] =>
  arr(obj(x.body)["tools"]).map((t) => String(obj(t)["name"]));

const stripAnsiCount = (s: string, re: RegExp): number =>
  (s.match(re) ?? []).length;
export const count = stripAnsiCount;

export const sha8 = (s: string): string =>
  new Bun.CryptoHasher("sha1").update(s).digest("hex").slice(0, 8);

const baseResult = (
  ctx: PtyCtx,
  c: Pick<PtyCase, "id" | "claims" | "notes" | "promptReason">,
  o: Partial<CaseResult> & { facts: Record<string, Fact> },
): CaseResult => ({
  schema: 1,
  id: `pty.${c.id}`,
  group: "pty",
  version: ctx.version,
  prompt: PROMPT,
  args: [],
  envSet: [],
  exit: null,
  timedOut: false,
  claims: c.claims ?? [],
  ...o,
  ...(c.promptReason || c.notes || o.notes
    ? {
        notes: [c.promptReason, c.notes, o.notes].filter(Boolean).join(" "),
      }
    : {}),
});

const runOnce = async (ctx: PtyCtx, c: PtyCase): Promise<CaseResult[]> => {
  const id = `pty.${c.id}`;
  if (!selected(ctx.only, id)) return [];
  if (ctx.dry) return [baseResult(ctx, c, { facts: {} })];
  const prompt = c.prompt ?? PROMPT;
  if (prompt !== PROMPT && !c.promptReason)
    return [
      baseResult(ctx, c, {
        facts: { precondition: false, error: "prompt needs promptReason" },
      }),
    ];
  // every typed line that is not a /command or a key must be the standard prompt
  const stray = c.schedule.find(
    (st) =>
      st.send?.endsWith("\r") &&
      st.send !== "\r" &&
      !st.send.startsWith("/") &&
      !st.send.startsWith("\u001b") &&
      st.send !== `${PROMPT}\r`,
  );
  if (stray && !c.promptReason)
    return [
      baseResult(ctx, c, {
        facts: {
          precondition: false,
          error: `schedule sends a non-standard prompt (${JSON.stringify(stray.send)}) without promptReason`,
        },
      }),
    ];
  let sb: Sandbox | undefined;
  try {
    const files: Files = { ...(c.cfgFiles ?? {}) };
    if (c.settings) files["settings.json"] = JSON.stringify(c.settings);
    sb = makeSandbox({
      cfgFiles: files,
      ...(c.projFiles ? { projFiles: c.projFiles } : {}),
      homeFiles: { "hook.sh": HOOK_SH, "sl.sh": SL_SH, ...(c.homeFiles ?? {}) },
      ...(c.git ? { git: true } : {}),
      trusted: true,
      seedOnboarding: true,
    });
    for (const [ev, v] of Object.entries(c.ctl ?? {})) {
      const d = join(sb.home, "hooklog", "ctl");
      mkdirSync(d, { recursive: true });
      if (v.out !== undefined) writeFileSync(join(d, ev), v.out);
      if (v.exit !== undefined)
        writeFileSync(join(d, `${ev}.exit`), String(v.exit));
    }
    c.setup?.(sb);
    const stub = await getStub();
    const log = join(sb.root, "requests.jsonl");
    const caseKey = `p${++counter}`;
    const sub = <T>(x: T): T =>
      x === undefined
        ? x
        : (JSON.parse(subst(JSON.stringify(x), sb as Sandbox)) as T);
    const base = stub.register(caseKey, {
      log,
      ...(c.stub?.text !== undefined ? { text: c.stub.text } : {}),
      ...(c.stub?.tool !== undefined ? { tool: c.stub.tool } : {}),
      ...(c.stub?.toolInput !== undefined
        ? { toolInput: sub(c.stub.toolInput) }
        : {}),
      ...(c.stub?.seq ? { seq: sub(c.stub.seq) } : {}),
    });
    const extra = Object.fromEntries(
      Object.entries(c.env ?? {}).map(([k, v]) => [k, subst(v, sb as Sandbox)]),
    );
    const env = childEnv({
      home: sb.home,
      configDir: sb.cfg,
      baseUrl: base,
      extra,
      tty: true,
    });
    const args = [
      "--permission-mode",
      c.mode ?? "default",
      "--model",
      c.model ?? "claude-opus-5-5",
      ...(c.args ?? []).map((a) => subst(a, sb as Sandbox)),
    ];
    const out = join(sb.root, "pty", "RAW");
    mkdirSync(dirname(out), { recursive: true });
    const pty = await runPty({
      cwd: sb.proj,
      env,
      bin: ctx.bin,
      args,
      // end with /exit so the program writes its exit-time files; Ctrl-C twice if it is still up
      schedule: sub([
        ...c.schedule,
        { t: c.secs, send: "/exit\r", label: "exit" },
        { t: c.secs + 2.5, send: "\u0003", label: "ctrl-c-1" },
        { t: c.secs + 2.8, send: "\u0003", label: "ctrl-c-2" },
      ]),
      secs: c.secs + 5,
      ...(c.rows ? { rows: c.rows } : {}),
      ...(c.cols ? { cols: c.cols } : {}),
      out,
    });
    stub.unregister(caseKey);
    const reqs = existsSync(log) ? readLog(log) : [];
    const bad = reqs.some((r) => r.bad);
    const home = sb.home;
    const run: PtyRun = {
      pty,
      screen: pty.screen,
      reqs,
      sb,
      hook: (e) => parseLog(join(home, "hooklog", `${e}.log`)),
      file: (rel) => {
        const p = join(home, rel);
        return existsSync(p) ? readFileSync(p, "utf8") : "";
      },
      messages: reqs.filter(isSystemMsg),
    };
    // keep the raw bytes, byte offsets and rendered screen beside the JSON (never diffed)
    const dest = join(ctx.runDir, "pty");
    mkdirSync(dest, { recursive: true });
    const stem = join(dest, c.id);
    for (const [from, to] of [
      [pty.rawPath, `${stem}.raw`],
      [`${pty.rawPath}.idx`, `${stem}.idx`],
      [`${pty.rawPath}.sent`, `${stem}.sent`],
      [`${pty.rawPath}.screen.txt`, `${stem}.screen.txt`],
    ] as const)
      if (existsSync(from)) copyFileSync(from, to);
    const beta = run.messages[0]?.headers["anthropic-beta"];
    for (const [name, text] of Object.entries(c.artifacts?.(run) ?? {}))
      writeFileSync(`${stem}.${name}`, text);
    const samples = c.samples?.(run);
    const stepTimeouts = pty.sent
      .filter((s) => s.label.endsWith(":timeout"))
      .map((s) => s.label.slice(0, -":timeout".length));
    const facts = {
      ...c.facts(run),
      stepTimeouts,
      ...(stepTimeouts.length
        ? {
            precondition: false,
            "precondition.detail": `wait_for timed out: ${stepTimeouts.join(", ")}`,
          }
        : {}),
    };
    return [
      baseResult(ctx, c, {
        prompt,
        args: normalise(args),
        envSet: Object.keys(extra),
        exit: null, // the exit code goes to samples.exitCode (it varies with timing)
        timedOut: false,
        facts: normalise(bad ? { ...facts, badAuth: true } : facts),
        samples: normalise({
          ...(samples ?? {}),
          exitCode: String(pty.exit),
          screenTail: pty.screen.split("\n").slice(-40).join("\n"),
        }),
        requests: {
          count: reqs.length,
          paths: [...new Set(reqs.map((r) => r.path))].sort(),
          ...(beta ? { betas: beta.split(",") } : {}),
        },
      }),
    ];
  } catch (e) {
    return [
      baseResult(ctx, c, {
        facts: { precondition: false, error: (e as Error).message },
        notes: "probe invalid: threw before producing facts",
      }),
    ];
  } finally {
    sb?.cleanup();
  }
};

/** Run one case. Never throws: a failure to run becomes `precondition: false`. Timing cases get one rerun when out of tolerance. */
export const runPtyCase = async (
  ctx: PtyCtx,
  c: PtyCase,
): Promise<CaseResult[]> => {
  const first = await runOnce(ctx, c);
  const f = first[0];
  if (!f || ctx.dry || !c.retryIf || f.facts["precondition"] === false)
    return first;
  if (!c.retryIf(f.facts)) return first;
  const second = await runOnce(ctx, c);
  const s = second[0];
  if (!s || s.facts["precondition"] === false) return first;
  const agree = !c.retryIf(s.facts);
  s.facts["rerun"] = true;
  s.facts["flaky"] = agree; // the first run was out of tolerance; true when the rerun disagrees
  s.facts["firstOutOfTolerance"] = true;
  s.firstRun = {
    facts: f.facts,
    ...(f.samples ? { samples: f.samples } : {}),
  };
  return [s];
};

export type PtyGroup = {
  id: string;
  title: string;
  /** Cases in run order. Each is built lazily so --dry costs nothing. */
  cases: (ctx: PtyCtx) => PtyCase[];
};

export const runDirFor = (ctx: Ctx): string => openRun(ctx.to);
export type { Fact };
export { binaryPath, writeCase };

/** Regex text for a phrase on the rendered screen: the full-screen UI drops some spaces, so allow any between characters. */
export const looseSrc = (s: string): string =>
  s
    .replace(/\s+/g, "")
    .split("")
    .map((c) => (/[A-Za-z0-9]/.test(c) ? c : `\\${c}`))
    .join("\\s*");
export const loose = (s: string): RegExp => new RegExp(looseSrc(s), "i");
/** Regex for a phrase that also accepts one missing letter (phrases of 8 or more letters).
 * The screen text is every redraw in a row, and a redraw writes only the changed cells, so single letters go missing ("Inerrupted"). */
export const tolerant = (phrase: string, flags = "i"): RegExp => {
  const p = phrase.replace(/\s+/g, "");
  const alts = [looseSrc(p)];
  if (p.length >= 8)
    for (let i = 0; i < p.length; i++)
      alts.push(looseSrc(p.slice(0, i) + p.slice(i + 1)));
  return new RegExp(alts.join("|"), flags);
};
/** Does the screen (the whole rendered screen unless given) show this phrase? */
export const shows = (
  x: PtyRun,
  phrase: string,
  screen: string = x.screen,
): boolean => tolerant(phrase).test(screen);

/** Common schedule pieces. */
export const READY: PtyStep = {
  wait_for: "shortcuts|auto\\s*mode",
  timeout: 30,
  label: "ready",
};
export const ASK = (label = "prompt", t = 0): PtyStep => ({
  t,
  send: `${PROMPT}\r`,
  label,
});
export const WAIT = (phrase: string, label: string, timeout = 20): PtyStep => ({
  wait_for: looseSrc(phrase),
  timeout,
  label,
});
export const ESC = (t: number, label = "esc"): PtyStep => ({
  t,
  send: "\u001b",
  label,
});
export const sentAt = (x: PtyRun, label: string): number | null =>
  x.pty.sent.find((s) => s.label === label)?.t ?? null;
/** RAW byte offset after the last read at or before the time a label was sent (null when the label was never sent). */
const offsetAt = (x: PtyRun, label: string): number | null => {
  const t = sentAt(x, label);
  if (t === null) return null;
  let off = 0;
  for (const i of x.pty.idx) {
    if (i.t > t) break;
    off = i.off;
  }
  return off;
};
const rawBytes = (x: PtyRun): Uint8Array => readFileSync(x.pty.rawPath);
/** The screen text as it was when `label` was sent (RAW up to the last read at or before that time). The whole screen when the label never fired. */
export const screenBefore = (x: PtyRun, label: string): string => {
  const off = offsetAt(x, label);
  return off === null ? x.screen : renderRaw(rawBytes(x).subarray(0, off));
};
/** The screen text of what was drawn after `label` was sent (RAW from that offset on). Empty when the label never fired. */
export const screenAfter = (x: PtyRun, label: string): string => {
  const off = offsetAt(x, label);
  return off === null ? "" : renderRaw(rawBytes(x).subarray(off));
};
/** Was a permission dialog still open when `label` was sent? True when its last marker ("proceed?", "Esc to cancel") on the screen before that moment has no outcome line (Allowed by, Denied by, Interrupted) after it. */
export const dialogOpenAt = (x: PtyRun, label: string): boolean => {
  const t = screenBefore(x, label);
  const last = (phrases: string[]): number =>
    Math.max(
      -1,
      ...phrases.map((p) => {
        const m = [...t.matchAll(tolerant(p, "gi"))].pop();
        return m ? m.index : -1;
      }),
    );
  const d = last(["proceed?", "Esc to cancel"]);
  return d >= 0 && d > last(["Allowed by", "Denied by", "Interrupted"]);
};
/** Epoch seconds of the first read after which the rendered RAW (up to the `before` label when given) matches `re` (binary search over RAW.idx), or null. */
export const firstSeenT = (
  x: PtyRun,
  re: RegExp,
  before?: string,
): number | null => {
  const cut = before ? offsetAt(x, before) : null;
  const all = rawBytes(x);
  const raw = cut === null ? all : all.subarray(0, cut);
  const idx = cut === null ? x.pty.idx : x.pty.idx.filter((i) => i.off <= cut);
  if (!idx.length || !re.test(renderRaw(raw))) return null;
  let lo = 0;
  let hi = idx.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (re.test(renderRaw(raw.subarray(0, idx[mid]?.off ?? 0)))) hi = mid;
    else lo = mid + 1;
  }
  return idx[lo]?.t ?? null;
};
export const keysOf = (o: Obj): string[] => Object.keys(o).sort();
export const median = (v: number[]): number | null => {
  if (!v.length) return null;
  const a = [...v].sort((p, q) => p - q);
  const m = a.length >> 1;
  return a.length % 2 ? (a[m] ?? null) : ((a[m - 1] ?? 0) + (a[m] ?? 0)) / 2;
};
export const round = (n: number | null, d = 1): number | null =>
  n === null ? null : Math.round(n * 10 ** d) / 10 ** d;
export const gaps = (t: number[]): number[] =>
  t.slice(1).map((v, i) => v - (t[i] ?? 0));
/** All text of tool_result blocks in every request (what the model was told). */
export const toolResultText = (x: PtyRun): string =>
  x.messages
    .map((q) =>
      arr(obj(q.body)["messages"])
        .flatMap((m) => arr(obj(m)["content"]))
        .filter((b) => obj(b)["type"] === "tool_result")
        .map((b) => JSON.stringify(obj(b)["content"]))
        .join("\n"),
    )
    .join("\n");
export const ranFile = (x: PtyRun, name: string): boolean =>
  existsSync(join(x.sb.home, name));

/** A wait_for step that matches any of several phrases (spaces ignored, see looseSrc). */
export const waitAny = (
  phrases: string[],
  label: string,
  timeout = 20,
): PtyStep => ({
  wait_for: phrases.map(looseSrc).join("|"),
  timeout,
  label,
});
/** The Bash tool turn the stub sends: a harmless `touch` inside the sandbox home. */
export const TOUCH = (name: string, command?: string) => ({
  seq: [
    {
      name: "Bash",
      input: {
        command: command ?? `touch {HOME}/${name}`,
        description: `probe ${name}`,
      },
    },
  ],
});
/** Project `.mcp.json` for the elicitation server (this repo's mcp-elicit.ts run by the same Bun as the toolkit). */
export const ELICIT_MCP: Files = {
  ".mcp.json": JSON.stringify({
    mcpServers: {
      probe: {
        command: process.execPath,
        args: [join(import.meta.dir, "mcp-elicit.ts")],
        env: { ELICIT_LOG: "{HOME}/mcp.log" },
      },
    },
  }),
};
/** `precondition` fact: true when the feature under test showed up, so a miss reads as "probe invalid". */
export const pre = (ok: boolean, detail: string): Record<string, Fact> => ({
  precondition: ok,
  ...(ok ? {} : { "precondition.detail": detail }),
});
