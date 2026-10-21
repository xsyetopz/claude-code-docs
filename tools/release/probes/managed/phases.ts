// Managed probe phases, split from p305-managed/probe.ts. Each phase returns CaseResults (group "managed").
// baseline: no managed folder. main: folder without classifyAllShell. true/false: classifyAllShell cases only.
// The program always runs as the calling user through childEnv (via print/run.ts runCase); nothing here uses sudo.
import { PROMPT } from "../../lib/env.ts";
import { type CaseResult, type Fact, normalise } from "../../lib/results.ts";
import {
  arr,
  type Case,
  dispose,
  events,
  msgs,
  obj,
  type Run,
  requestSummary,
  runCase,
} from "../print/run.ts";
import { MANAGED_DIR, type Phase, srvDef } from "./fixtures.ts";

export type PhaseCtx = {
  version: string;
  bin: string;
  startedLog: string; // MCP probe servers append here; truncated before each case
  only?: string[] | undefined;
  dry: boolean;
};

type Out = {
  facts: Record<string, Fact>;
  samples?: Record<string, string>;
  claims?: string[];
};
type Def = {
  name: string; // case name inside the phase
  c: Case;
  /** Turn the run into facts. `started` is the list of MCP servers that started. */
  facts: (r: Run, x: Ex) => Out;
  notes?: string;
};
type Ex = {
  main: Obj | undefined;
  mainText: string;
  init: Obj | undefined;
  started: string[];
  classifierRequests: number;
};
type Obj = Record<string, unknown>;

const isCls = (b: unknown): boolean =>
  JSON.stringify(obj(b)["system"] ?? "").includes(
    "security monitor for autonomous AI coding agents",
  );
const has = (t: string, m: string): boolean => t.includes(m);
const toolNames = (b: Obj | undefined): string[] =>
  arr(b?.["tools"]).map((t) => String(obj(t)["name"]));
const head = (t: string, n = 12): string =>
  t.trim().split("\n").slice(0, n).join("\n");

const extend = (r: Run, started: string[]): Ex => {
  const all = msgs(r);
  const main = all.find((x) => !isCls(x.body));
  const body = main ? obj(main.body) : undefined;
  return {
    main: body,
    mainText: body ? JSON.stringify(body) : "",
    init: events(r).find(
      (e) => e["type"] === "system" && e["subtype"] === "init",
    ),
    started,
    classifierRequests: all.filter((x) => isCls(x.body)).length,
  };
};

const userCfg = (extra: Obj = {}): string =>
  JSON.stringify({ enableAllProjectMcpServers: true, ...extra });

/** Shared fixtures: user CLAUDE.md, user MCP server, project CLAUDE.md and .mcp.json. */
const base = (ctx: PhaseCtx, c: Case): Case => ({
  ...c,
  cfgFiles: {
    "CLAUDE.md": "PROBE-USER-MD\n",
    ".claude.json": JSON.stringify({
      hasCompletedOnboarding: true,
      mcpServers: { user_srv: srvDef("user_srv", ctx.startedLog) },
    }),
    "settings.json": userCfg(),
    ...c.cfgFiles,
  },
  projFiles: {
    "CLAUDE.md": "PROBE-PROJ-MD\n",
    ".mcp.json": JSON.stringify({
      mcpServers: { proj_srv: srvDef("proj_srv", ctx.startedLog) },
    }),
    ...c.projFiles,
  },
});

const mcpDefs = (ctx: PhaseCtx): Def[] => {
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

const mainDefs = (ctx: PhaseCtx): Def[] => {
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

// classifyAllShell: user/flag are true | false | undefined
const ROWS: [string, boolean | undefined, boolean | undefined][] = [
  ["neither", undefined, undefined],
  ["user-true", true, undefined],
  ["user-false", false, undefined],
  ["flag-true", undefined, true],
  ["flag-false", undefined, false],
  ["user-false-and-flag-true", false, true],
  ["user-true-and-flag-false", true, false],
];

const classifyDefs = (phase: Phase): Def[] => {
  const managed =
    phase === "true" ? true : phase === "false" ? false : undefined;
  return ROWS.map(([label, u, f]) => {
    const user: Obj = {
      permissions: { allow: ["Bash(curl -s http://127.0.0.1:9/x)"] },
      enableAllProjectMcpServers: true,
    };
    if (u !== undefined) user["autoMode"] = { classifyAllShell: u };
    const args = ["--permission-mode", "auto"];
    if (f !== undefined)
      args.push(
        "--settings",
        JSON.stringify({ autoMode: { classifyAllShell: f } }),
      );
    const expectOld = managed === true || u === true || f === true ? 1 : 0;
    return {
      name: `classify-${label}`,
      c: {
        cfgFiles: { "settings.json": JSON.stringify(user) },
        args,
        tool: "Bash",
        toolInput: { command: "curl -s http://127.0.0.1:9/x" },
      },
      facts: (_r, x) => {
        // the stub reply makes the program retry, so only "any classifier request" is comparable
        const seen = x.classifierRequests > 0 ? 1 : 0;
        return {
          facts: {
            managed: managed === undefined ? "unset" : managed,
            classifier_requested: seen === 1,
            expected_if_any_true: expectOld === 1,
            same_as_expected: seen === expectOld,
          },
        };
      },
    };
  });
};

export const defsFor = (phase: Phase, ctx: PhaseCtx): Def[] =>
  phase === "baseline"
    ? mainDefs(ctx)
    : phase === "main"
      ? [...mainDefs(ctx), ...classifyDefs(phase)]
      : classifyDefs(phase);

export const caseId = (phase: Phase, d: Def): string =>
  `managed.${phase}.${d.name}`;

/** --only forms: `true`, `true.classify-neither`, `classify-neither`, each with or without the `managed.` prefix. */
const pick = (ctx: PhaseCtx, phase: Phase, id: string): boolean => {
  if (!ctx.only) return true;
  const full = id.slice("managed.".length);
  const forms = [full, full.slice(phase.length + 1)];
  return ctx.only.some((raw) => {
    const o = raw.startsWith("managed.") ? raw.slice("managed.".length) : raw;
    return forms.some((f) => f === o || f.startsWith(`${o}.`));
  });
};

export const selectedDefs = (phase: Phase, ctx: PhaseCtx): Def[] =>
  defsFor(phase, ctx).filter((d) => pick(ctx, phase, caseId(phase, d)));

export const phaseSelected = (ctx: PhaseCtx, phase: Phase): boolean =>
  selectedDefs(phase, ctx).length > 0;

const result = (
  ctx: PhaseCtx,
  id: string,
  r: Run | null,
  o: Out,
  notes?: string,
): CaseResult => ({
  schema: 1,
  id,
  group: "managed",
  version: ctx.version,
  prompt: r ? r.prompt || "(none)" : PROMPT,
  args: r ? normalise(r.args) : [],
  envSet: r ? r.envSet : [],
  exit: r ? r.code : null,
  timedOut: r ? r.timedOut : false,
  facts: normalise(o.facts),
  ...(o.samples ? { samples: o.samples } : {}),
  ...(r ? { requests: requestSummary(r) } : {}),
  claims: o.claims ?? [],
  ...(notes ? { notes } : {}),
});

/** Runs one phase. A throwing case becomes `precondition: false`, never stops the phase. Dry: list only. */
export const runPhase = async (
  phase: Phase,
  ctx: PhaseCtx,
  truncate: () => void,
  readStarted: () => string[],
  /** Returns an error text when the phase precondition no longer holds (checked before every case). */
  guard?: () => string | null,
): Promise<CaseResult[]> => {
  const out: CaseResult[] = [];
  for (const d of selectedDefs(phase, ctx)) {
    const id = caseId(phase, d);
    if (ctx.dry) {
      out.push(result(ctx, id, null, { facts: {} }));
      continue;
    }
    const bad = guard?.();
    if (bad) {
      out.push(
        result(
          ctx,
          id,
          null,
          { facts: { precondition: false, error: bad } },
          "probe invalid: phase precondition failed",
        ),
      );
      continue;
    }
    try {
      truncate();
      let started: string[] = [];
      const c = base(ctx, d.c);
      const r = await runCase(ctx.bin, {
        ...c,
        afterExit: (sb) => {
          started = readStarted();
          return c.afterExit?.(sb) ?? {};
        },
      });
      try {
        out.push(result(ctx, id, r, d.facts(r, extend(r, started)), d.notes));
      } finally {
        dispose(r);
      }
    } catch (e) {
      out.push(
        result(
          ctx,
          id,
          null,
          { facts: { precondition: false, error: (e as Error).message } },
          "probe invalid: threw before producing facts",
        ),
      );
    }
  }
  return out;
};
