// Remaining one-off print probes from p305-print misc.ts, misc2.ts, misc3.ts:
// agent mcpServers, plugin validate, subprocess env scrub, /context, managed settings path, large CLAUDE.md.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  type CaseDef,
  evKinds,
  initEvent,
  json,
  msgs,
  readCfg,
  runCases,
  toolNames,
  toolResultTexts,
  withRun,
} from "./harness-b.ts";
import type { PrintGroup } from "./types.ts";

const MARK = "PROBEMARK Reply with 'OK'.";
const BASE = ["--permission-mode", "bypassPermissions"];

const SRV = `const fs=require("fs");const d=process.env.MARK_DIR;fs.writeFileSync(d+"/started","1");process.on("exit",()=>fs.writeFileSync(d+"/stopped","1"));process.on("SIGTERM",()=>process.exit(0));
let buf="";process.stdin.on("data",c=>{buf+=c;let i;while((i=buf.indexOf("\\n"))>=0){const l=buf.slice(0,i);buf=buf.slice(i+1);if(!l.trim())continue;let m;try{m=JSON.parse(l)}catch{continue}const s=r=>process.stdout.write(JSON.stringify({jsonrpc:"2.0",id:m.id,result:r})+"\\n");if(m.method==="initialize")s({protocolVersion:m.params?.protocolVersion||"2025-06-18",capabilities:{tools:{}},serverInfo:{name:"p",version:"1"}});else if(m.method==="tools/list")s({tools:[{name:"ping",description:"p",inputSchema:{type:"object",properties:{}}}]});else if(m.id!==undefined)s({});}});process.stdin.on("end",()=>process.exit(0));`;

const agentMcp = (where: "user" | "project"): CaseDef => ({
  name: `agent-mcp-servers.${where}`,
  run: (ctx) =>
    withRun(
      ctx,
      {
        args: BASE,
        stub: {
          seq: [
            {
              name: "Agent",
              input: {
                description: "d",
                prompt: MARK,
                subagent_type: "pa",
                run_in_background: false,
              },
            },
          ],
        },
        setup: ({ cfg, home, proj }) => {
          const d = `${home}/mark`;
          mkdirSync(d, { recursive: true });
          writeFileSync(`${d}/srv.js`, SRV);
          const p =
            where === "user"
              ? `${cfg}/agents/pa.md`
              : `${proj}/.claude/agents/pa.md`;
          mkdirSync(dirname(p), { recursive: true });
          writeFileSync(
            p,
            `---\nname: pa\ndescription: probe agent\nmcpServers:\n  - agentsrv:\n      command: bun\n      args: ["${d}/srv.js"]\n      env:\n        MARK_DIR: "${d}"\n---\nHello.\n`,
          );
        },
        afterExit: ({ home }) => ({
          started: existsSync(`${home}/mark/started`),
          stopped: existsSync(`${home}/mark/stopped`),
        }),
      },
      (r) => {
        return {
          from: r,
          facts: {
            precondition: msgs(r).length >= 2,
            started: r.after["started"] === true,
            stopped: r.after["stopped"] === true,
            handBack: (toolResultTexts(r)[0] ?? "").includes(
              "[Subagent hand-back]",
            ),
          },
        };
      },
    ),
});

const VALIDATE: [string, string, string?][] = [
  ["string", '"banana"'],
  ["number", "1"],
  ["empty-string", '""'],
  ["semver", '"1.2.3"'],
  ["null", "null"],
  ["array", "[1]"],
  ["empty-string-with-author", '""', ',"author":{"name":"a"}'],
];
const validateCase = ([
  name,
  ver,
  extra,
]: (typeof VALIDATE)[number]): CaseDef => ({
  name: `plugin-validate.version-${name}`,
  run: (ctx) =>
    withRun(
      ctx,
      {
        argv: ["plugin", "validate", "{HOME}/pl"],
        noPrompt: true,
        setup: ({ home }) => {
          const p = `${home}/pl`;
          mkdirSync(`${p}/.claude-plugin`, { recursive: true });
          writeFileSync(
            `${p}/.claude-plugin/plugin.json`,
            `{"name":"pp","version":${ver},"description":"x"${extra ?? ""}}`,
          );
        },
      },
      (r) => {
        const t = (r.stdout + r.stderr).replace(/\s+/g, " ");
        return {
          from: r,
          facts: {
            precondition: t.includes("Validating plugin manifest"),
            exit: r.code,
            errors: t.match(/Found (\d+) errors?/)?.[1] ?? "0",
            warnings: t.match(/Found (\d+) warnings?/)?.[1] ?? "0",
            problems: t.match(/Found (\d+) problems?/)?.[1] ?? "0",
          },
          samples: {
            output: t.replace(/\/\S+\/\.claude-plugin/g, "<P>/.claude-plugin"),
          },
        };
      },
    ),
});

// Credential-named variables go through childEnv `fakeCredentials` (sentinel value, never a real secret).
// ANTHROPIC_AUTH_TOKEN is left out: the program would use it for the request and the stub would flag it.
const FAKE_CRED = [
  "AWS_SECRET_ACCESS_KEY",
  "MY_SECRET",
  "GH_TOKEN",
  "GITHUB_TOKEN",
  "GH_ENTERPRISE_TOKEN",
  "GITHUB_ENTERPRISE_TOKEN",
  "HF_TOKEN",
];
const PLAIN_NAMES = ["DATABASE_URL", "KUBECONFIG", "GH_HOST", "PLAIN_VAR"];
const SCRUB_NAMES = [...FAKE_CRED, ...PLAIN_NAMES];
const scrubEnv: CaseDef = {
  name: "subprocess-env-scrub.names",
  run: (ctx) =>
    withRun(
      ctx,
      {
        env: {
          CLAUDE_CODE_SUBPROCESS_ENV_SCRUB: "1",
          ...Object.fromEntries(
            PLAIN_NAMES.map((n) => [
              n,
              n === "DATABASE_URL" ? "postgres://u:p@h/db" : "v",
            ]),
          ),
        },
        fakeCredentials: FAKE_CRED,
        args: [...BASE, "--allowedTools", "Bash"],
        stub: {
          seq: [
            {
              name: "Bash",
              input: {
                command:
                  "env | cut -d= -f1 | sort | tr '\\n' ' ' > {CFG}/benv.txt",
              },
            },
          ],
        },
      },
      (r) => {
        const seen = readCfg(r, "benv.txt").split(" ");
        return {
          from: r,
          facts: {
            precondition: seen.length > 3 && seen.includes("PATH"),
            kept: SCRUB_NAMES.filter((n) => seen.includes(n)),
            removed: SCRUB_NAMES.filter((n) => !seen.includes(n)),
            initPermissionMode:
              (initEvent(r)?.["permissionMode"] as string) ?? null,
          },
          notes:
            "Credential-named variables hold the sentinel probe-fake-credential, not a secret.",
        };
      },
    ),
};

const scrubPerm = (allowed: boolean, scrub: "1" | "0"): CaseDef => ({
  name: `subprocess-env-scrub.bypass${allowed ? "-allowedtools" : ""}-scrub${scrub}`,
  run: (ctx) =>
    withRun(
      ctx,
      {
        env: { CLAUDE_CODE_SUBPROCESS_ENV_SCRUB: scrub },
        args: [...BASE, ...(allowed ? ["--allowedTools", "Bash"] : [])],
        stub: {
          seq: [{ name: "Bash", input: { command: "touch {PROJ}/zz.txt" } }],
        },
      },
      (r) => ({
        from: r,
        facts: {
          precondition: msgs(r).length >= 2,
          needsApproval: (toolResultTexts(r)[0] ?? "").includes(
            "needs approval",
          ),
          fileMade: existsSync(`${r.sb.proj}/zz.txt`),
          forcedNotice: /Permission mode forced to default/.test(
            r.stdout + r.stderr,
          ),
        },
      }),
    ),
});

const contextCmd: CaseDef = {
  name: "context-slash-command",
  run: (ctx) =>
    withRun(
      ctx,
      {
        prompt: "/context",
        promptReason: "the slash command is the behaviour under test",
      },
      (r) => ({
        from: r,
        facts: {
          precondition: r.code !== null,
          requests: r.reqs.length,
          paths: [...new Set(r.reqs.map((x) => x.path.split("?")[0] ?? ""))],
          countTokens: r.reqs.filter((x) => x.path.includes("count_tokens"))
            .length,
          messageRequests: msgs(r).length,
        },
      }),
    ),
};

const managedPath: CaseDef = {
  name: "managed-settings-path",
  run: (ctx) =>
    withRun(
      ctx,
      {
        env: { CLAUDE_CODE_MANAGED_SETTINGS_PATH: "{HOME}/ms.json" },
        homeFiles: { "ms.json": json({ permissions: { deny: ["Bash"] } }) },
        args: ["--debug-file", "{CFG}/d.log"],
      },
      (r) => {
        const q = msgs(r)[0];
        const d = readCfg(r, "d.log");
        return {
          from: r,
          facts: {
            precondition: !!q && d.length > 0,
            bashToolPresent: q ? toolNames(q).includes("Bash") : null,
            defaultManagedFileChecked: /managed-settings\.json/.test(d),
          },
          samples: {
            managedDebugLines: d
              .split("\n")
              .filter((l) => /managed/i.test(l))
              .slice(0, 3)
              .map((l) => l.replace(/^\S+\s/, "").slice(0, 200))
              .join("\n"),
          },
        };
      },
    ),
};

const BIG = "x".repeat(45_000);
const stripX = (s: string) => s.replace(/x{50,}/g, "<xs>");
const bigClaudeMd: CaseDef = {
  name: "large-claude-md",
  run: (ctx) =>
    withRun(ctx, { projFiles: { "CLAUDE.md": BIG } }, async (r) => {
      const t = stripX(r.stdout + r.stderr);
      const doc = await withRun(
        ctx,
        {
          argv: ["doctor"],
          noPrompt: true,
          projFiles: { "CLAUDE.md": BIG },
          timeoutMs: 30_000,
        },
        (d) => stripX(d.stdout + d.stderr),
      );
      const st = await withRun(
        ctx,
        {
          noPrompt: true,
          argv: [
            "-p",
            "--input-format",
            "stream-json",
            "--output-format",
            "stream-json",
            "--verbose",
          ],
          stdin: `${json({ type: "control_request", request_id: "g1", request: { subtype: "get_status" } })}\n`,
          projFiles: { "CLAUDE.md": BIG },
        },
        (g) => {
          const line =
            g.stdout.split("\n").find((l) => l.includes("control_response")) ??
            "";
          let titles = "";
          try {
            const j = JSON.parse(line) as {
              response: { response: { sections: { title: string }[] } };
            };
            titles = j.response.response.sections.map((s) => s.title).join("|");
          } catch {
            // leave empty
          }
          return { titles, mentions: /Large CLAUDE|exceeds|chars/i.test(line) };
        },
      );
      return {
        from: r,
        facts: {
          precondition: msgs(r).length > 0 && st.titles.length > 0,
          printWarns: /Large CLAUDE|exceeds|memory files/i.test(t),
          doctorWarns: /Large CLAUDE|exceed|memory files/i.test(doc),
          getStatusSections: st.titles,
          getStatusMentionsSize: st.mentions,
          events: evKinds(r),
        },
        notes:
          "Three runs (-p, doctor, get_status control request); the doctor and get_status runs send no prompt.",
      };
    }),
};

export const misc: PrintGroup = {
  id: "misc",
  title:
    "Agent mcpServers, plugin validate, env scrub, /context, managed settings path, large CLAUDE.md",
  run: (ctx) =>
    runCases(ctx, "misc", [
      agentMcp("user"),
      agentMcp("project"),
      ...VALIDATE.map(validateCase),
      scrubEnv,
      scrubPerm(false, "1"),
      scrubPerm(false, "0"),
      scrubPerm(true, "1"),
      scrubPerm(true, "0"),
      contextCmd,
      managedPath,
      bigClaudeMd,
    ]),
};
