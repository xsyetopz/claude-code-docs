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
  o: { key?: string; host?: string; hang?: boolean } = {},
) => {
  const bin = join(tmp, `claude-${n++}`);
  writeFileSync(
    bin,
    `#!/usr/bin/env bun
${o.hang ? 'process.on("SIGTERM", () => {}); setInterval(() => {}, 1000);' : ""}
const prompt = process.argv[process.argv.indexOf("-p") + 1];
const sec = Bun.spawnSync(["security", "find-generic-password"]).exitCode;
const skill = process.env.TMPDIR.replace(/\\/$/, "") + "/bundled-skills/9.9.9/abc123/x";
const env = Object.keys(process.env).filter((k) => k.startsWith("ANTHROPIC_")).sort().join(",");
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
    expect(userText(r, "<command-name>/x</command-name>")).toBe(
      "<command-name>/x</command-name>\n/x ARG\n\nBase: <bundled-skill-dir>/x cwd: <project-dir> home: <home> security: 44 env: ANTHROPIC_API_KEY,ANTHROPIC_BASE_URL",
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

test("run kills a program that ignores SIGTERM and reports the timeout", async () => {
  await expect(
    runPrompt(fakeProgram({ hang: true }), "/x ARG", undefined, 1500),
  ).rejects.toThrow("did not end in 1500 ms");
});
