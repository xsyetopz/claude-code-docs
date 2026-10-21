// release:check - preflight. Writes captures/<to>/env.json. Exit 1 if a required item is missing.
import { existsSync, readdirSync, statSync } from "node:fs";
import { createServer } from "node:net";
import { arch, platform, release } from "node:os";
import { join } from "node:path";
import { runSelftest } from "./selftest.ts";
import {
  binaryPath,
  CAPTURES,
  type Ctx,
  installedVersions,
  toolEnv,
  versionDir,
  writeJson,
} from "./util.ts";

type Level = "ok" | "warn" | "fail";
type Check = { id: string; level: Level; detail: string };

const run = (argv: string[]): { ok: boolean; out: string } => {
  try {
    const r = Bun.spawnSync(argv, { env: toolEnv(), stdin: "ignore" });
    return {
      ok: r.exitCode === 0,
      out: `${r.stdout.toString()}${r.stderr.toString()}`.trim(),
    };
  } catch {
    return { ok: false, out: "not found" };
  }
};
const which = (name: string): string => {
  const r = run(["/usr/bin/which", name]);
  return r.ok ? r.out : "";
};

const freePort = (): Promise<number> =>
  new Promise((resolve, reject) => {
    const s = createServer();
    s.once("error", reject);
    s.listen(0, "127.0.0.1", () => {
      const p = (s.address() as { port: number }).port;
      s.close(() => resolve(p));
    });
  });

const portFree = (port: number): Promise<boolean> =>
  new Promise((resolve) => {
    const s = createServer();
    s.once("error", () => resolve(false));
    s.listen(port, "127.0.0.1", () => s.close(() => resolve(true)));
  });

const dirSize = (p: string): number => {
  let n = 0;
  for (const e of readdirSync(p, { withFileTypes: true })) {
    const q = join(p, e.name);
    if (e.isDirectory()) n += dirSize(q);
    else if (e.isFile()) n += statSync(q).size;
  }
  return n;
};

const MANAGED_DIR =
  platform() === "darwin"
    ? "/Library/Application Support/ClaudeCode"
    : "/etc/claude-code";

export const runCheck = async (ctx: Ctx): Promise<number> => {
  if (ctx.rest.includes("--selftest")) return runSelftest(ctx);
  const { from, to } = ctx;
  const checks: Check[] = [];
  const add = (id: string, level: Level, detail: string) =>
    checks.push({ id, level, detail });

  if (ctx.dry) {
    console.log(
      "plan: binary for --to, binary for --from, python3, strings, openssl, free ports, managed folder, captures sizes",
    );
    console.log(`plan: write captures/${to || "<to>"}/env.json`);
    return 0;
  }
  if (!to) {
    console.error("release:check: no --to given and no installed binary found");
    return 1;
  }

  const installed = installedVersions();
  const bin = binaryPath(to);
  add(
    "binary.to",
    existsSync(bin) ? "ok" : "fail",
    existsSync(bin)
      ? bin
      : `missing ${bin}; the user must install ${to} (installed: ${installed.join(", ") || "none"})`,
  );
  add(
    "binary.from",
    existsSync(binaryPath(from)) ? "ok" : "warn",
    existsSync(binaryPath(from))
      ? binaryPath(from)
      : `missing ${binaryPath(from)}; release:diff needs it`,
  );

  const py = which("python3");
  const pyv = py ? run([py, "--version"]).out : "";
  const pym = pyv.match(/(\d+)\.(\d+)/);
  const pyOk = !!pym && Number(pym[1]) * 100 + Number(pym[2]) >= 308;
  add(
    "python3",
    pyOk ? "ok" : "fail",
    py ? `${py} (${pyv}); the pty driver needs 3.8+` : "python3 not found",
  );
  const st = which("strings");
  add("strings", st ? "ok" : "fail", st || "strings not found");
  const ssl = which("openssl");
  add(
    "openssl",
    ssl ? "ok" : "warn",
    ssl
      ? `${ssl} (${run([ssl, "version"]).out}); only live fault tests need it`
      : "openssl not found; only live fault tests need it",
  );

  const ports: number[] = [];
  for (let i = 0; i < 3; i++) ports.push(await freePort());
  add("ports.dynamic", "ok", `OS-assigned ports bind: ${ports.join(", ")}`);
  const busy: number[] = [];
  for (let p = 18400; p <= 18499; p++) if (!(await portFree(p))) busy.push(p);
  add(
    "ports.fixed-range",
    busy.length ? "warn" : "ok",
    busy.length
      ? `in use in 18400-18499: ${busy.join(", ")} (the toolkit does not need them)`
      : "18400-18499 free",
  );

  const managed = existsSync(MANAGED_DIR);
  add(
    "managed.folder",
    managed ? "warn" : "ok",
    managed
      ? `${MANAGED_DIR} exists: ${readdirSync(MANAGED_DIR).join(", ") || "(empty)"}. It changes every run unless it is the expected fixture.`
      : `${MANAGED_DIR} absent`,
  );

  const leaked = Object.entries(process.env)
    .filter(([k, v]) => k.startsWith("CLAUDE_CODE_") && v)
    .map(([k]) => k);
  if (leaked.length)
    add(
      "parent-env",
      "warn",
      `${leaked.length} CLAUDE_CODE_* names set in this shell (${leaked.join(", ")}); the toolkit never passes them on`,
    );

  const sizes: Record<string, number> = {};
  if (existsSync(CAPTURES))
    for (const e of readdirSync(CAPTURES, { withFileTypes: true }))
      if (e.isDirectory() && /^\d+\.\d+\.\d+$/.test(e.name))
        sizes[e.name] = dirSize(join(CAPTURES, e.name));
  const cacheNote =
    "Live (subscription) runs share a 1 h prompt cache. If any session used the same prefix in the last hour the cache is warm and token counts are too low. Offline probes are not affected.";
  add("cache.note", "ok", cacheNote);

  const fail = checks.filter((c) => c.level === "fail");
  writeJson(join(versionDir(to), "env.json"), {
    version: to,
    from,
    checkedAt: new Date().toISOString(),
    host: {
      platform: platform(),
      arch: arch(),
      osRelease: release(),
      bun: Bun.version,
    },
    installedVersions: installed,
    python: pyv,
    ports: { dynamic: ports, fixedRangeBusy: busy },
    managedFolder: { path: MANAGED_DIR, exists: managed },
    capturesBytes: sizes,
    checks,
    ok: fail.length === 0,
  });
  for (const c of checks)
    console.log(`${c.level.toUpperCase().padEnd(4)} ${c.id}: ${c.detail}`);
  for (const [v, n] of Object.entries(sizes))
    console.log(`     captures/${v}: ${(n / 1048576).toFixed(1)} MiB`);
  console.log(fail.length ? `check failed (${fail.length})` : "check ok");
  return fail.length ? 1 : 0;
};
