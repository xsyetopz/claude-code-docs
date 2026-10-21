// Usage: bun tools/capture-prompts/capture.ts [--only id,id] [--no-render]
// Runs the installed Claude Code binary once per variant against a local fake Messages API.
// Offline and free: fake API key, dead proxy, temp HOME/config/project. No request leaves the machine.
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { CLAUDE_CODE_VERSION } from "../../src/version.ts";
import { assertShimReady, writeSecurityShim } from "../release/lib/shim.ts";
import { FAKE_KEY, startStub } from "./stub.ts";
import { SUB_MARK, VARIANTS, type Variant } from "./variants.ts";

export const ROOT = join(import.meta.dir, "..", "..");
export const DEFAULT_PROMPT = "Reply with 'OK'.";
// `--out <dir>` (release:prompts) writes the per-variant folders there; render.ts reads the same place.
const outArg = process.argv.indexOf("--out");
export const CAPTURES =
  outArg >= 0
    ? (process.argv[outArg + 1] ?? "")
    : join(ROOT, "captures", CLAUDE_CODE_VERSION, "prompts");
process.env["CAPTURE_OUT"] = CAPTURES;
const requireEnv = (name: string): string => {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
};

const argv = process.argv.slice(2);
// `--bin <path>` lets release:prompts point at another installed version.
const BIN = argv.includes("--bin")
  ? (argv[argv.indexOf("--bin") + 1] ?? "")
  : join(
      requireEnv("HOME"),
      `.local/share/claude/versions/${CLAUDE_CODE_VERSION}`,
    );
const only = argv.includes("--only")
  ? argv[argv.indexOf("--only") + 1].split(",")
  : null;

const run = async (v: Variant) => {
  const dir = join(CAPTURES, v.id);
  mkdirSync(dir, { recursive: true });
  const log = join(dir, "requests.jsonl");
  writeFileSync(log, "");
  const cfg = realpathSync(mkdtempSync(join(tmpdir(), "cap-cfg-")));
  const home = realpathSync(mkdtempSync(join(tmpdir(), "cap-home-")));
  const shimDir = writeSecurityShim(home);
  const proj = realpathSync(mkdtempSync(join(tmpdir(), "cap-proj-")));
  for (const [base, files] of [
    [cfg, v.cfgFiles],
    [proj, v.projFiles],
  ] as const)
    for (const [n, c] of Object.entries(files ?? {})) {
      mkdirSync(dirname(join(base, n)), { recursive: true });
      writeFileSync(join(base, n), c);
    }
  const genv = {
    GIT_CONFIG_GLOBAL: join(home, ".gitconfig"),
    GIT_AUTHOR_NAME: "t",
    GIT_AUTHOR_EMAIL: "t@example.com",
    GIT_COMMITTER_NAME: "t",
    GIT_COMMITTER_EMAIL: "t@example.com",
  };
  if (v.git) {
    for (const c of [
      ["init", "-q"],
      ["add", "-A"],
      ["commit", "-q", "--allow-empty", "-m", "initial"],
    ]) {
      writeFileSync(join(proj, "README.md"), "probe\n");
      Bun.spawnSync(["git", ...c], {
        cwd: proj,
        env: { PATH: requireEnv("PATH"), HOME: home, ...genv },
      });
    }
    writeFileSync(join(proj, "dirty.txt"), "x\n"); // untracked file so the status is not empty
  }
  const stub = startStub({
    port: Number(process.env["STUB_PORT"] ?? 0),
    log,
    tool: v.tool?.name,
    toolInput: v.tool?.input,
  });
  const spawnOnce = async (prompt: string, extra: string[]) => {
    const env: Record<string, string> = {
      PATH: `${shimDir}:${requireEnv("PATH")}`,
      HOME: home,
      GIT_CONFIG_NOSYSTEM: "1",
      TMPDIR: tmpdir(),
      CLAUDE_CONFIG_DIR: cfg,
      ANTHROPIC_API_KEY: FAKE_KEY,
      ANTHROPIC_BASE_URL: `http://127.0.0.1:${stub.port}`,
      CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1",
      DISABLE_TELEMETRY: "1",
      // fail-closed net: anything proxied or direct to the real API breaks
      HTTPS_PROXY: "http://127.0.0.1:9",
      HTTP_PROXY: "http://127.0.0.1:9",
      NO_PROXY: "127.0.0.1,localhost",
      ...genv,
      ...(v.env ?? {}),
    };
    assertShimReady(env);
    const p = Bun.spawn(
      [
        BIN,
        "-p",
        prompt,
        "--output-format",
        "stream-json",
        "--verbose",
        "--model",
        v.model ?? "claude-opus-5-5",
        ...extra,
        ...(v.args ?? []),
      ],
      {
        cwd: proj,
        stdin: "ignore",
        stdout: "pipe",
        stderr: "pipe",
        env,
      },
    );
    const t = setTimeout(() => p.kill(), 60000);
    const [so, se] = await Promise.all([
      new Response(p.stdout).text(),
      new Response(p.stderr).text(),
    ]);
    const code = await p.exited;
    clearTimeout(t);
    return { so, se, code };
  };
  let { so, se, code } = await spawnOnce(v.prompt ?? DEFAULT_PROMPT, []);
  if (v.followUp) {
    // second run in the same folders: gives the follow-up command a conversation to work on
    writeFileSync(join(dir, "stdout-first.txt"), so);
    ({ so, se, code } = await spawnOnce(v.followUp, ["--continue"]));
  }
  stub.stop(true);
  writeFileSync(join(dir, "stdout.txt"), so);
  writeFileSync(join(dir, "stderr.txt"), se);
  writeFileSync(
    join(dir, "meta.json"),
    JSON.stringify({ id: v.id, exit: code, cwd: proj, cfg, home }, null, 1),
  );
  const reqs = readFileSync(log, "utf8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l));
  const msgs = reqs.filter(
    (r) => r.path?.startsWith("/v1/messages") && r.body?.messages,
  );
  const bad = reqs.filter((r) => r.authIsFakeKey === false);
  const hosts = new Set(reqs.map((r) => r.headers?.host));
  const leaked = [...hosts].filter(
    (h) => h && !String(h).startsWith("127.0.0.1"),
  );
  console.log(
    `${v.id}: exit=${code} requests=${reqs.length} messages=${msgs.length} authFake=${bad.length === 0} hosts=${[...hosts].join(",")}`,
  );
  if (leaked.length || bad.length) {
    console.log("UNEXPECTED HOST OR CREDENTIAL");
    process.exit(8);
  }
  if (!msgs.length)
    console.log(`  WARNING: no message request. stderr: ${se.slice(0, 200)}`);
  if (
    v.pick === "subagent" &&
    !msgs.some((r) => JSON.stringify(r.body.messages).includes(SUB_MARK))
  )
    console.log("  WARNING: no subagent request");
  rmSync(cfg, { recursive: true, force: true });
  rmSync(home, { recursive: true, force: true });
  rmSync(proj, { recursive: true, force: true });
};

if (import.meta.main) {
  for (const v of VARIANTS) if (!only || only.includes(v.id)) await run(v);
  if (!argv.includes("--no-render")) await import("./render.ts");
}
