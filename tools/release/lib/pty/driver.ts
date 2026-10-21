// TS wrapper for driver.py. Launches the program in a pty with exactly `env` (a 0600 JSON file the driver reads and deletes,
// then execve: nothing inherited, no values in argv). The driver's child pid is registered with proc.ts so killOwn covers it.
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join } from "node:path";
import { assertSafeEnv } from "../env.ts";
import { assertLiveEnv } from "../live-env.ts";
import { registerPid, runChild, unregisterPid } from "../proc.ts";

export type PtyStep = { label?: string; send?: string } & (
  | { t: number; wait_for?: undefined; timeout?: undefined }
  | { wait_for: string; timeout?: number; t?: undefined }
);
export type PtyOpts = {
  cwd: string;
  env: Record<string, string>; // the full child env (childEnv with tty: true)
  bin: string;
  args?: string[];
  schedule?: PtyStep[];
  secs: number;
  rows?: number; // default 50
  cols?: number; // default 200
  out?: string; // RAW path; default a fresh temp dir (caller owns it)
  liveToken?: string; // live runs only: allows exactly CLAUDE_CODE_OAUTH_TOKEN === this value
};
export type PtyResult = {
  rawPath: string;
  screen: string; // rendered text: ANSI stripped, CR overwrites, spaces collapsed
  sent: { t: number; label: string }[]; // epoch seconds; "<label>:timeout" when a wait_for never matched
  idx: { t: number; off: number }[]; // epoch seconds and byte offset after each read
  pid: number; // the program's pid (already dead when this returns)
  exit: number | null; // negative = killed by that signal
};

const DRIVER = join(dirname(new URL(import.meta.url).pathname), "driver.py");
const PY_ENV = { PATH: "/usr/bin:/bin:/opt/homebrew/bin:/usr/local/bin" };

const pairs = (file: string): [number, string][] =>
  existsSync(file)
    ? readFileSync(file, "utf8")
        .split("\n")
        .filter(Boolean)
        .map((l) => {
          const i = l.indexOf(" ");
          return [Number(l.slice(0, i)), l.slice(i + 1)];
        })
    : [];

export const runPty = async (o: PtyOpts): Promise<PtyResult> => {
  if (o.liveToken) assertLiveEnv(o.env, o.liveToken);
  else assertSafeEnv(o.env);
  if (!isAbsolute(o.bin) || !existsSync(o.bin) || !statSync(o.bin).isFile())
    throw new Error(
      `bin must be an absolute path to an existing file: ${o.bin}`,
    );
  const python = Bun.which("python3", { PATH: PY_ENV.PATH });
  if (!python) throw new Error("python3 not found");
  const dir = o.out
    ? dirname(o.out)
    : realpathSync(mkdtempSync(join(tmpdir(), "ccrel-pty-")));
  const rawPath = o.out ?? join(dir, "RAW");
  const schedPath = `${rawPath}.schedule.json`;
  await Bun.write(schedPath, JSON.stringify(o.schedule ?? []));
  const envPath = `${rawPath}.env.json`;
  writeFileSync(envPath, JSON.stringify(o.env), { mode: 0o600 });
  const argv = [
    python,
    "-I",
    DRIVER,
    "--cwd",
    o.cwd,
    "--out",
    rawPath,
    "--secs",
    String(o.secs),
    "--env",
    envPath,
    "--schedule",
    schedPath,
    "--rows",
    String(o.rows ?? 50),
    "--cols",
    String(o.cols ?? 200),
    "--",
    o.bin,
    ...(o.args ?? []),
  ];
  // Register the program's pid as soon as the driver writes it; killOwn then covers it even if we are interrupted.
  const watch = setInterval(() => {
    const f = `${rawPath}.pid`;
    if (!existsSync(f)) return;
    const pid = Number(readFileSync(f, "utf8"));
    if (pid > 1 && registerPid(pid)) {
      watchedPid = pid;
      clearInterval(watch);
    }
  }, 50);
  let watchedPid = 0;
  let res: Awaited<ReturnType<typeof runChild>>;
  try {
    res = await runChild(argv, {
      cwd: dir,
      env: PY_ENV,
      timeoutMs: o.secs * 1000 + 15_000,
    });
  } finally {
    clearInterval(watch);
    if (watchedPid) unregisterPid(watchedPid);
    rmSync(envPath, { force: true });
  }
  let info: { pid: number; exit: number | null } = { pid: 0, exit: null };
  try {
    info = JSON.parse(res.stdout.trim().split("\n").pop() ?? "{}");
  } catch {
    throw new Error(`pty driver failed: ${res.stderr.slice(0, 500)}`);
  }
  if (res.code !== 0)
    throw new Error(`pty driver exit ${res.code}: ${res.stderr.slice(0, 500)}`);
  const screenFile = `${rawPath}.screen.txt`;
  return {
    rawPath,
    screen: existsSync(screenFile) ? readFileSync(screenFile, "utf8") : "",
    sent: pairs(`${rawPath}.sent`).map(([t, label]) => ({ t, label })),
    idx: pairs(`${rawPath}.idx`).map(([t, off]) => ({ t, off: Number(off) })),
    pid: info.pid,
    exit: info.exit,
  };
};
