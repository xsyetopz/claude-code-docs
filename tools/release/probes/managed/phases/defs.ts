// Definitions of the managed cases that run in the baseline and main phases: MCP, output style, skills, CLAUDE.md, auto mode.
import { PROMPT } from "../../../lib/env.ts";
import { arr, msgs, obj } from "../../print/run.ts";
import { MANAGED_DIR, srvDef } from "../fixtures.ts";
import {
  type Def,
  has,
  head,
  type PhaseCtx,
  toolNames,
  userCfg,
} from "./util.ts";

export const mcpDefs = (ctx: PhaseCtx): Def[] => {
  const list = (name: string, argv: string[]): Def => ({
    name,
    c: { argv },
    facts: (r) => ({
      facts: {
        exit: r.code,
        names_managed_srv: has(r.stdout + r.stderr, "managed_srv"),
        names_user_srv: has(r.stdout + r.stderr, "user_srv"),
        names_proj_srv: has(r.stdout + r.stderr, "proj_srv"),
      },
      samples: { output: head(r.stdout + r.stderr) },
    }),
  });
  return [
    {
      name: "mcp-run",
      c: {},
      facts: (_r, x) => ({
        facts: {
          init_mcp_servers: arr(x.init?.["mcp_servers"]).map(
            (s) => `${String(obj(s)["name"])}:${String(obj(s)["status"])}`,
          ),
          started: x.started,
        },
      }),
    },
    list("mcp-list", ["mcp", "list"]),
    list("mcp-get-managed", ["mcp", "get", "managed_srv"]),
    list("mcp-get-user", ["mcp", "get", "user_srv"]),
    {
      name: "mcp-config-flag",
      c: {
        projFiles: {
          "extra-mcp.json": JSON.stringify({
            mcpServers: { extra_srv: srvDef("extra_srv", ctx.startedLog) },
          }),
        },
        args: ["--mcp-config", "{PROJ}/extra-mcp.json"],
      },
      facts: (r, x) => ({
        facts: { init_present: !!x.init, started: x.started },
        samples: { stderr: r.stderr.trim().slice(0, 300) },
      }),
    },
  ];
};

export const mainDefs = (ctx: PhaseCtx): Def[] => {
  const defs: Def[] = [
    ...mcpDefs(ctx),
    {
      name: "outputstyle",
      c: {
        cfgFiles: {
          "settings.json": userCfg({ outputStyle: "user-style" }),
        },
        projFiles: {
          ".claude/settings.json": JSON.stringify({
            outputStyle: "proj-style",
          }),
          ".claude/settings.local.json": JSON.stringify({
            outputStyle: "local-style",
          }),
        },
        args: ["--settings", JSON.stringify({ outputStyle: "flag-style" })],
      },
      facts: (_r, x) => ({
        facts: {
          init_output_style: String(x.init?.["output_style"] ?? null),
          request_has_managed_style_text: has(
            x.mainText,
            "PROBE-MANAGED-STYLE",
          ),
        },
      }),
    },
  ];
  for (const dis of [false, true])
    defs.push({
      name: `skill-${dis ? "disabled" : "default"}`,
      c: dis ? { env: { CLAUDE_CODE_DISABLE_POLICY_SKILLS: "1" } } : {},
      facts: (_r, x) => ({
        facts: {
          disable_policy_skills: dis,
          init_skills_has_managed: JSON.stringify(
            x.init?.["skills"] ?? [],
          ).includes("managed-skill"),
          init_slash_has_managed: JSON.stringify(
            x.init?.["slash_commands"] ?? [],
          ).includes("managed-skill"),
          request_has_desc: has(x.mainText, "PROBE-MANAGED-SKILL-DESC"),
        },
      }),
    });
  defs.push({
    name: "claudemd-order",
    notes:
      "order lists only the markers present; a missing marker is absent from the request, not first or last.",
    c: {},
    facts: (_r, x) => {
      const marks = ["PROBE-MANAGED-MD", "PROBE-USER-MD", "PROBE-PROJ-MD"];
      const idx = marks.map((m) => [m, x.mainText.indexOf(m)] as const);
      return {
        facts: {
          order: idx
            .filter(([, i]) => i >= 0)
            .sort((a, b) => a[1] - b[1])
            .map(([m]) => m),
          managed_rule_loaded: has(x.mainText, "PROBE-MANAGED-RULE"),
          not_verified_note: has(x.mainText, "not verified"),
          notebookedit_in_request_tools: toolNames(x.main).includes(
            "NotebookEdit",
          ),
          notebookedit_in_init_tools: JSON.stringify(
            x.init?.["tools"] ?? [],
          ).includes("NotebookEdit"),
          request_tool_count: toolNames(x.main).length,
        },
      };
    },
  });
  for (const [label, pat] of [
    ["any-claude-md", "**/CLAUDE.md"],
    ["managed-abs", `${MANAGED_DIR}/CLAUDE.md`],
    ["managed-glob", `${MANAGED_DIR}/**`],
  ] as const)
    for (const where of ["user", "project"] as const) {
      const body = userCfg({ claudeMdExcludes: [pat] });
      defs.push({
        name: `excludes-${label}-${where}`,
        c: {
          ...(where === "user"
            ? { cfgFiles: { "settings.json": body } }
            : { projFiles: { ".claude/settings.json": body } }),
        },
        facts: (_r, x) => ({
          facts: {
            pattern: pat,
            managed_md: has(x.mainText, "PROBE-MANAGED-MD"),
            user_md: has(x.mainText, "PROBE-USER-MD"),
            proj_md: has(x.mainText, "PROBE-PROJ-MD"),
            managed_rule: has(x.mainText, "PROBE-MANAGED-RULE"),
          },
        }),
      });
    }
  defs.push(
    {
      name: "agent-mcp",
      c: {
        cfgFiles: {
          "agents/probe-agent.md": `---\nname: probe-agent\ndescription: probe agent\nmcpServers: ${JSON.stringify([{ agent_srv: srvDef("agent_srv", ctx.startedLog) }])}\n---\nYou are a probe agent.\n`,
        },
        tool: "Agent",
        toolInput: {
          description: "probe",
          prompt: PROMPT,
          subagent_type: "probe-agent",
          run_in_background: false,
        },
      },
      facts: (r, x) => ({
        facts: {
          agent_srv_started: x.started.includes("agent_srv"),
          blocked_notice:
            /blocked by enterprise MCP config[^"\\]*/.exec(
              r.stdout + r.stderr + JSON.stringify(r.reqs),
            )?.[0] ?? "none",
          model_requests: msgs(r).length,
        },
      }),
    },
    {
      name: "auto-mode-config",
      notes:
        "order lists only the markers present; a missing marker is absent from the output.",
      c: {
        cfgFiles: {
          "settings.json": userCfg({
            autoMode: { allow: ["PROBE-USER-ALLOW"] },
          }),
        },
        argv: [
          "--settings",
          JSON.stringify({ autoMode: { allow: ["PROBE-FLAG-ALLOW"] } }),
          "auto-mode",
          "config",
        ],
      },
      facts: (r) => {
        const t = r.stdout + r.stderr;
        const marks = [
          "PROBE-USER-ALLOW",
          "PROBE-FLAG-ALLOW",
          "PROBE-MANAGED-ALLOW",
          "PROBE-DROPIN-ALLOW",
        ];
        return {
          facts: {
            order: marks
              .map((m) => [m, t.indexOf(m)] as const)
              .filter(([, i]) => i >= 0)
              .sort((a, b) => a[1] - b[1])
              .map(([m]) => m),
            defaults: /\$defaults/.test(t)
              ? "literal-$defaults"
              : "expanded-or-none",
          },
          samples: { output: t.trim() },
        };
      },
    },
  );
  return defs;
};
