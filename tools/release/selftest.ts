// release:check --selftest - proves the child env is built from scratch and the lib pieces work together.
// Steps: (1) childEnv ignores a poisoned parent env, (2) assertSafeEnv rejects credentials, (3) the program
// run against the stub dumps its env from a hook: no parent CLAUDE_CODE_* / ANTHROPIC_* leaked, (4) the
// result goes through results.ts (to a temp dir, not captures/).
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runClaimsSelftest } from "./claims/selftest.ts";
import { assertSafeEnv, childEnv, FAKE_KEY, PROMPT } from "./lib/env.ts";
import { runLiveSelftest } from "./lib/live/selftest.ts";
import { allocPort } from "./lib/ports.ts";
import { runChild } from "./lib/proc.ts";
import { runPtySelftest } from "./lib/pty/selftest.ts";
import { openRun, readRun, writeCase } from "./lib/results.ts";
import { makeSandbox } from "./lib/sandbox.ts";
import { assertShimReady, shimDir, writeSecurityShim } from "./lib/shim.ts";
import { readLog, startStub } from "./lib/stub.ts";
import { runResultChecks } from "./selftest/checks.ts";
import { binaryPath, type Ctx, toolEnv } from "./util.ts";

// Set by the program for its own children (hooks); same value as a parent running inside Claude Code by design.
const PROGRAM_SET = new Set([
  "PWD",
  "SHLVL",
  "_",
  "CLAUDECODE",
  "CLAUDE_CODE_CHILD_SESSION",
  "NoDefaultCurrentDirectoryInExePath",
  "COREPACK_ENABLE_AUTO_PIN",
]);
const LEAKS = {
  CLAUDE_CODE_SELFTEST_LEAK: "1",
  ANTHROPIC_AUTH_TOKEN: "leak-token",
  ANTHROPIC_MODEL: "leak-model",
};

export const runSelftest = async (ctx: Ctx): Promise<number> => {
  let failed = 0;
  const step = (name: string, ok: boolean, detail = "") => {
    console.log(
      `${ok ? "PASS" : "FAIL"} ${name}${detail ? `: ${detail}` : ""}`,
    );
    if (!ok) failed++;
  };
  const savedLeaks = Object.fromEntries(
    Object.keys(LEAKS).map((k) => [k, process.env[k]]),
  );
  for (const [k, v] of Object.entries(LEAKS)) process.env[k] = v;
  const parentLeaks = Object.keys(process.env).filter(
    (k) =>
      k.startsWith("CLAUDE_CODE_") ||
      k.startsWith("ANTHROPIC_") ||
      k === "CLAUDECODE",
  );

  const parentValues: Record<string, string | undefined> = { ...process.env };
  const sb = makeSandbox({
    git: true,
    trusted: true,
    cfgFiles: {
      "settings.json": JSON.stringify({
        hooks: {
          SessionStart: [
            {
              hooks: [
                {
                  type: "command",
                  command: "/usr/bin/env > {PROJ}/../envdump.txt",
                },
              ],
            },
          ],
        },
      }),
    },
  });
  const out = mkdtempSync(join(realpathSync(tmpdir()), "ccrel-self-"));
  const stubPort = await allocPort();
  const stub = startStub(stubPort);
  try {
    const env = childEnv({
      home: sb.home,
      configDir: sb.cfg,
      baseUrl: "http://127.0.0.1:1/x",
    });
    const names = Object.keys(env);
    step(
      "childEnv: no parent names",
      !parentLeaks.some((k) => names.includes(k)) &&
        !names.includes("CLAUDECODE"),
      `${names.length} names`,
    );
    const ghost = "/nonexistent-x";
    let pure = true;
    try {
      childEnv({
        home: ghost,
        configDir: ghost,
        baseUrl: "http://127.0.0.1:1/x",
      });
    } catch {
      pure = false;
    }
    step(
      "childEnv: pure (no throw, creates nothing)",
      pure && !existsSync(ghost),
    );
    writeSecurityShim(sb.home);
    writeSecurityShim(sb.home); // idempotent
    const which = Bun.spawnSync(["/bin/sh", "-c", "command -v security"], {
      env,
    });
    const found = which.stdout.toString().trim();
    step(
      "childEnv: security shim first on PATH",
      found.startsWith(join(shimDir(sb.home), "security")),
      found,
    );
    const shim = Bun.spawnSync(
      ["security", "find-generic-password", "-w", "-s", "x"],
      { env },
    );
    let guarded = false;
    try {
      assertShimReady(childEnv({ home: ghost, configDir: ghost, baseUrl: "" }));
    } catch {
      guarded = true;
    }
    step("assertShimReady refuses a missing shim", guarded);
    step("security shim exits 44", shim.exitCode === 44, `${shim.exitCode}`);
    step("childEnv: fake key only", env["ANTHROPIC_API_KEY"] === FAKE_KEY);
    let threw = false;
    try {
      assertSafeEnv({ CLAUDE_CODE_OAUTH_TOKEN: "x" });
    } catch {
      threw = true;
    }
    step("assertSafeEnv rejects CLAUDE_CODE_OAUTH_TOKEN", threw);
    // a generator started with toolEnv() must make its temp dirs where the parent does, not in /tmp
    const savedTmp = process.env["TMPDIR"];
    process.env["TMPDIR"] = out;
    const tmp = Bun.spawnSync(
      [process.execPath, "-e", "console.log(require('os').tmpdir())"],
      { env: toolEnv() },
    );
    if (savedTmp === undefined) delete process.env["TMPDIR"];
    else process.env["TMPDIR"] = savedTmp;
    const childTmp = tmp.stdout.toString().trim();
    step("toolEnv: child keeps the parent TMPDIR", childTmp === out, childTmp);

    runClaimsSelftest(step);
    await runPtySelftest(step);
    await runLiveSelftest(step);

    const bin = binaryPath(ctx.to);
    if (!ctx.to || !existsSync(bin)) {
      step("program run", false, `binary missing: ${bin}`);
      return 1;
    }
    const log = join(sb.root, "requests.jsonl");
    const baseUrl = stub.register("selftest", { log });
    const progEnv = childEnv({ home: sb.home, configDir: sb.cfg, baseUrl });
    assertShimReady(progEnv);
    const res = await runChild(
      [
        bin,
        "-p",
        PROMPT,
        "--output-format",
        "stream-json",
        "--verbose",
        "--model",
        "claude-opus-5-5",
      ],
      {
        cwd: sb.proj,
        env: progEnv,
        timeoutMs: 90_000,
      },
    );
    const reqs = readLog(log);
    step(
      "program exits 0 against the stub",
      res.code === 0 && !res.timedOut,
      `code ${res.code}`,
    );
    step(
      "stub saw requests, fake key only",
      reqs.length > 0 && reqs.every((r) => !r.bad),
      `${reqs.length} requests`,
    );
    step(
      "reply is OK",
      res.stdout.includes('"result":"OK"') ||
        /"result"\s*:\s*"OK"/.test(res.stdout),
    );

    const dumpPath = join(sb.root, "envdump.txt");
    const dumpedPairs = existsSync(dumpPath)
      ? readFileSync(dumpPath, "utf8")
          .split("\n")
          .filter((l) => l.includes("="))
          .map(
            (l) =>
              [
                l.slice(0, l.indexOf("=")),
                l.slice(l.indexOf("=") + 1),
              ] as const,
          )
      : [];
    const dumped = dumpedPairs.map(([k]) => k);
    step("hook dumped its env", dumped.length > 0, `${dumped.length} names`);
    // A name the program sets itself (CLAUDE_CODE_ENTRYPOINT, a fresh session id) may share a name with the parent's
    // variable but not its value. A leak is: a sentinel name, or a parent value passed through unchanged.
    const leaked = dumpedPairs
      .filter(
        ([k, v]) =>
          k in LEAKS ||
          (!PROGRAM_SET.has(k) && !names.includes(k) && parentValues[k] === v),
      )
      .map(([k]) => k);
    step(
      "no parent env leaked into the program",
      leaked.length === 0,
      leaked.join(", "),
    );
    const dv = Object.fromEntries(dumpedPairs);
    step(
      "hook saw sandbox HOME and CLAUDE_CONFIG_DIR",
      dv["HOME"] === sb.home && dv["CLAUDE_CONFIG_DIR"] === sb.cfg,
    );
    const seen = dumped.filter((k) => k.startsWith("CLAUDE_CODE_")).sort();
    console.log(
      `     CLAUDE_CODE_* seen by the hook: ${seen.join(", ") || "(none)"}`,
    );

    const dir = openRun("0.0.0", out);
    const path = writeCase(dir, {
      schema: 1,
      id: "print.selftest.smoke",
      group: "print",
      version: ctx.to,
      prompt: PROMPT,
      args: ["-p"],
      envSet: [],
      exit: res.code,
      timedOut: res.timedOut,
      facts: { requests: reqs.length, envNames: names.length },
      requests: {
        count: reqs.length,
        paths: [...new Set(reqs.map((r) => r.path))],
      },
      claims: [],
    });
    const back = readRun("0.0.0", out);
    step(
      "results.ts write/read",
      existsSync(path) &&
        back.length === 1 &&
        back[0]?.id === "print.selftest.smoke",
    );
    await runResultChecks({ ctx, step, sb, stub, stubPort, out, dir });
  } finally {
    for (const [k, v] of Object.entries(savedLeaks))
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    stub.stop();
    sb.cleanup();
    rmSync(out, { recursive: true, force: true });
  }
  console.log(failed ? `selftest failed (${failed})` : "selftest ok");
  return failed ? 1 : 0;
};
