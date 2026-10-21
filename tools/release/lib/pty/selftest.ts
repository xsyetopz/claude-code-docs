// Pty driver self-test against a tiny /bin/sh program (never the real binary). Called from ../../selftest.ts.
import {
  chmodSync,
  existsSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { childEnv } from "../env.ts";
import { runPty } from "./driver.ts";

const PROGRAM = `#!/bin/sh
printf 'leak=[%s%s]\\r\\n' "\${CLAUDE_CODE_SELFTEST_LEAK-}" "\${ANTHROPIC_AUTH_TOKEN-}"
printf 'size=%s\\r\\n' "$(stty size)"
printf 'ready> '
read a
printf '\\033[31mgot:%s\\033[0m\\r\\n' "$a"
printf 'progress 10%%\\rprogress 100%%\\r\\n'
printf 'a\\033[3Cb\\r\\n'
read b
printf 'second:%s\\r\\n' "$b"
sleep 30
`;

export const runPtySelftest = async (
  step: (name: string, ok: boolean, detail?: string) => void,
): Promise<void> => {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), "ccrel-ptyself-")));
  try {
    const prog = join(dir, "prog.sh");
    writeFileSync(prog, PROGRAM);
    chmodSync(prog, 0o755);
    const env = childEnv({
      home: dir,
      configDir: dir,
      baseUrl: "http://127.0.0.1:1/x",
      tty: true,
    });
    const r = await runPty({
      cwd: dir,
      env,
      bin: prog,
      secs: 6,
      rows: 30,
      cols: 100,
      out: join(dir, "RAW"),
      schedule: [
        { wait_for: "ready>", timeout: 5, send: "hello\r", label: "one" },
        { wait_for: "never-appears", timeout: 0.5, send: "x", label: "miss" },
        { t: 1.5, send: "x\r", label: "two" },
      ],
    });
    const s = r.screen;
    step("pty: exact env (no parent leak)", s.includes("leak=[]"), "");
    step("pty: size 30x100", s.includes("size=30 100"));
    step("pty: wait_for send reached the program", s.includes("got:hello"));
    step("pty: ANSI stripped", !s.includes("\x1b") && !s.includes("[31m"));
    step(
      "pty: CR overwrite and cursor-forward",
      s.split("\n").includes("progress 100%") &&
        !s.split("\n").some((l) => l.includes("progress 10%progress")) &&
        s.includes("a b"),
    );
    step("pty: time step sent", s.includes("second:x"));
    step(
      "pty: sent log order and timeout label",
      r.sent.map((x) => x.label).join(",") === "one,miss:timeout,two",
      r.sent.map((x) => x.label).join(","),
    );
    step(
      "pty: idx monotonic",
      r.idx.length > 0 &&
        r.idx.every((x, i) => i === 0 || x.off >= (r.idx[i - 1]?.off ?? 0)),
      `${r.idx.length} reads`,
    );
    let dead = false;
    try {
      process.kill(r.pid, 0);
    } catch {
      dead = true;
    }
    step("pty: program killed at the end", dead && r.pid > 1, `pid ${r.pid}`);

    const alive = (pid: number): boolean => {
      try {
        process.kill(pid, 0);
        return true;
      } catch {
        return false;
      }
    };
    // A bad wait_for regex fails cleanly and nothing is spawned.
    const marker = join(dir, "started");
    const sleeper = join(dir, "sleeper.sh");
    writeFileSync(
      sleeper,
      `#!/bin/sh\ntouch '${marker}'\ntrap '' HUP TERM INT\nsleep 30\n`,
    );
    chmodSync(sleeper, 0o755);
    let badThrew = false;
    try {
      await runPty({
        cwd: dir,
        env,
        bin: sleeper,
        secs: 2,
        out: join(dir, "BAD"),
        schedule: [{ wait_for: "(unclosed", send: "x" }],
      });
    } catch {
      badThrew = true;
    }
    step(
      "pty: bad wait_for regex fails cleanly, nothing spawned",
      badThrew && !existsSync(marker) && !existsSync(join(dir, "BAD.pid")),
    );
    let relBinThrew = false;
    try {
      await runPty({
        cwd: dir,
        env,
        bin: "sh",
        secs: 1,
        out: join(dir, "REL"),
      });
    } catch {
      relBinThrew = true;
    }
    step("pty: relative bin rejected", relBinThrew);
    // A program that ignores HUP/TERM/INT is still killed at the end.
    const h = await runPty({
      cwd: dir,
      env,
      bin: sleeper,
      secs: 1.5,
      out: join(dir, "HUP"),
    });
    step(
      "pty: signal-ignoring program is killed",
      existsSync(marker) && h.pid > 1 && !alive(h.pid),
      `pid ${h.pid}`,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};
