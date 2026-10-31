// Run: bun test inspect/mcp/test/run.test.ts
// A fake "Claude Code" script sends one Messages request to ANTHROPIC_BASE_URL, as the program does in print mode.
import { afterAll, expect, test } from "bun:test";
import {
  chmodSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runPrompt, userText } from "../src/run.ts";

const tmp = mkdtempSync(join(tmpdir(), "cc-run-test-"));
afterAll(() => rmSync(tmp, { recursive: true, force: true }));

let n = 0;
const fakeProgram = (
  o: {
    key?: string;
    host?: string;
    hang?: boolean;
    say?: string;
    big?: boolean;
  } = {},
) => {
  const bin = join(tmp, `claude-${n++}`);
  writeFileSync(
    bin,
    `#!/usr/bin/env bun
${o.say ? `process.stderr.write(${JSON.stringify(o.say)});` : ""}
${o.hang ? 'process.on("SIGTERM", () => {}); setInterval(() => {}, 1000);' : ""}
console.log(JSON.stringify({ type: "system", subtype: "init" }));
${o.big ? 'const b = Buffer.from(JSON.stringify({ type: "assistant", text: "é".repeat(300000) }) + "\\n" + JSON.stringify({ type: "result" }) + "\\n"); await Bun.write(Bun.stdout, b.subarray(0, 1001)); await Bun.sleep(300); await Bun.write(Bun.stdout, b.subarray(1001));' : ""}
const prompt = process.argv[process.argv.indexOf("-p") + 1];
const sec = Bun.spawnSync(["security", "find-generic-password"]).exitCode;
const skill = process.env.TMPDIR.replace(/\\/$/, "") + "/bundled-skills/9.9.9/abc123/x";
const env = Object.keys(process.env).filter((k) => /^(ANTHROPIC|PROBE|AWS)_/.test(k)).sort().join(",");
await fetch(process.env.ANTHROPIC_BASE_URL + "/v1/messages?beta=true", {
  method: "POST",
  headers: { "x-api-key": ${JSON.stringify(o.key ?? "sk-ant-fake-probe")}, "content-type": "application/json"${o.host ? `, host: ${JSON.stringify(o.host)}` : ""} },
  body: JSON.stringify({ stream: true, messages: [{ role: "user", content: [
    { type: "text", text: "<system-reminder>left out</system-reminder>" },
    { type: "text", text: "<command-name>/x</command-name>\\n" + prompt + "\\n" },
    { type: "text", text: "Base: " + skill + " cwd: " + process.cwd() + " home: " + process.env.HOME + " security: " + sec + " env: " + env },
  ] }] }),
}).then((r) => r.text());
`,
  );
  chmodSync(bin, 0o755);
  return bin;
};
const runDirs = () =>
  readdirSync(tmpdir()).filter((d) => d.startsWith("cc-run-"));

test("run keeps the user turn from the marked block, with temp folders as placeholders", async () => {
  process.env["ANTHROPIC_AUTH_TOKEN"] = "not-for-the-program";
  try {
    const r = await runPrompt(fakeProgram(), "/x ARG");
    expect(r.exit).toBe(0);
    expect(r.requests.map((q) => q.path)).toEqual(["/v1/messages?beta=true"]);
    expect(r.events).toEqual([{ type: "system", subtype: "init" }]);
    expect(userText(r, "<command-name>/x</command-name>")).toBe(
      "<command-name>/x</command-name>\n/x ARG\n\nBase: <bundled-skill-dir>/x cwd: <project-dir> home: <home> security: 44 env: ANTHROPIC_API_KEY,ANTHROPIC_BASE_URL,AWS_EC2_METADATA_DISABLED",
    );
    for (const d of Object.values(r.dirs)) expect(existsSync(d)).toBe(false);
  } finally {
    delete process.env["ANTHROPIC_AUTH_TOKEN"];
  }
});

test("userText is null when no user turn holds the mark", async () => {
  const r = await runPrompt(fakeProgram(), "/x ARG");
  expect(userText(r, "<command-name>/y</command-name>")).toBeNull();
});

test("run fails on another key or host, and removes its folders", async () => {
  const before = runDirs();
  await expect(
    runPrompt(fakeProgram({ key: "sk-ant-other-key" }), "/x ARG"),
  ).rejects.toThrow("another host or key");
  await expect(
    runPrompt(fakeProgram({ host: "127.0.0.1.attacker.test" }), "/x ARG"),
  ).rejects.toThrow("another host or key");
  expect(runDirs()).toEqual(before);
});

test("run kills a program that ignores SIGTERM and reports the timeout with its stderr", async () => {
  await expect(
    runPrompt(
      fakeProgram({ hang: true, say: "stuck at step 3" }),
      "/x ARG",
      undefined,
      1500,
    ),
  ).rejects.toThrow(
    /did not end in 1500 ms; events: system\/init.*stuck at step 3/s,
  );
});

test("run passes extra env to the program", async () => {
  const r = await runPrompt(fakeProgram(), "/x ARG", undefined, undefined, {
    PROBE_FLAG: "1",
  });
  expect(userText(r, "<command-name>/x</command-name>")).toContain(
    "env: ANTHROPIC_API_KEY,ANTHROPIC_BASE_URL,AWS_EC2_METADATA_DISABLED,PROBE_FLAG",
  );
});

test("run refuses extra env that would undo the safety setup or carry a credential", async () => {
  for (const k of [
    "ANTHROPIC_BASE_URL",
    "ANTHROPIC_BEDROCK_BASE_URL",
    "ANTHROPIC_CUSTOM_HEADERS",
    "AWS_ENDPOINT_URL",
    "HTTPS_PROXY",
    "https_proxy",
    "ALL_PROXY",
    "NODE_OPTIONS",
    "BUN_OPTIONS",
    "DYLD_INSERT_LIBRARIES",
    "HOME",
    "AWS_SECRET_ACCESS_KEY",
    "CLAUDE_CODE_OAUTH_TOKEN",
  ])
    await expect(
      runPrompt(fakeProgram(), "/x ARG", undefined, undefined, { [k]: "1" }),
    ).rejects.toThrow(`env ${k}`);
});

test("run refuses an env value shaped like an Anthropic key", async () => {
  await expect(
    runPrompt(fakeProgram(), "/x ARG", undefined, undefined, {
      PROBE_X: "sk-ant-api03-zzz",
    }),
  ).rejects.toThrow("env PROBE_X");
});

test("run keeps every stdout event, with multibyte text split across chunks intact", async () => {
  const r = await runPrompt(fakeProgram({ big: true }), "/x ARG");
  expect(r.events.map((e) => e["type"])).toEqual([
    "system",
    "assistant",
    "result",
  ]);
  expect(r.events[1]?.["text"]).toBe("é".repeat(300000));
});

test("resultText is the text of the last result event, or null", async () => {
  const { resultText } = await import("../src/run.ts");
  expect(
    resultText({
      events: [
        { type: "system" },
        { type: "result", result: "first" },
        { type: "result", subtype: "success", result: "Set model to x" },
      ],
    }),
  ).toBe("Set model to x");
  expect(resultText({ events: [{ type: "result" }] })).toBeNull();
  expect(resultText({ events: [] })).toBeNull();
});

const argsProgram = () => {
  const bin = join(tmp, `claude-args-${n++}`);
  writeFileSync(
    bin,
    `#!/usr/bin/env bun
const f = process.argv.at(-1);
console.log(JSON.stringify(process.argv.slice(2)) + " " + (await Bun.file(f).text()).trim());
process.stderr.write("cwd=" + process.cwd());
process.exit(3);
`,
  );
  chmodSync(bin, 0o755);
  return bin;
};

test("runArgs passes the args, writes files in the project, and keeps plain stdout", async () => {
  const { runArgs } = await import("../src/run.ts");
  const r = await runArgs(
    argsProgram(),
    ["auto-mode", "<project-dir>/s.json"],
    {
      files: { "s.json": '{"a":1}' },
    },
  );
  expect(r.exit).toBe(3);
  const p = r.dirs.project;
  expect(r.stdout.trim()).toBe(`["auto-mode","${p}/s.json"] {"a":1}`);
  expect(r.stderr).toBe(`cwd=${p}`);
  expect(existsSync(p)).toBe(false);
});

test("runArgs refuses a file path outside the project", async () => {
  const { runArgs } = await import("../src/run.ts");
  for (const name of ["/etc/x", "../x", "a/../../x"])
    await expect(
      runArgs(argsProgram(), ["x"], { files: { [name]: "" } }),
    ).rejects.toThrow("outside the project");
});
