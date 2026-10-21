// Hook probes in the interactive screen (ported from p305-pty case.sh, pc.sh, settings-h3/np1/t10 and hook.sh).
// PermissionRequest, PermissionDenied, Notification, PreCompact and Elicitation do not fire in -p, so they need the pty.
import {
  ASK,
  dialogOpenAt,
  ELICIT_MCP,
  ESC,
  firstSeenT,
  hooks,
  keysOf,
  type Obj,
  obj,
  type PtyCase,
  type PtyGroup,
  type PtyRun,
  pre,
  READY,
  ranFile,
  round,
  screenBefore,
  shows,
  TOUCH,
  tolerant,
  toolNames,
  toolResultText,
  WAIT,
  waitAny,
} from "./harness.ts";

const PR = (decision: Obj): string =>
  JSON.stringify({
    hookSpecificOutput: { hookEventName: "PermissionRequest", decision },
  });

type PrCase = {
  name: string;
  ctl?: { out?: string; exit?: number };
  note: string;
};
const PR_CASES: PrCase[] = [
  { name: "allow", ctl: { out: PR({ behavior: "allow" }) }, note: "allow" },
  {
    name: "deny",
    ctl: { out: PR({ behavior: "deny", message: "PR-DENY-MSG" }) },
    note: "deny with message",
  },
  {
    name: "interrupt",
    ctl: {
      out: PR({ behavior: "deny", message: "PR-INT-MSG", interrupt: true }),
    },
    note: "deny with interrupt",
  },
  { name: "exit2", ctl: { exit: 2 }, note: "exit 2, no output" },
  {
    name: "block",
    ctl: { out: JSON.stringify({ decision: "block", reason: "PR-BLOCK" }) },
    note: "top-level decision block",
  },
  { name: "empty", note: "no output" },
];

const PROCEED_RE = tolerant("proceed?");
const OUTCOME_RE = new RegExp(
  ["Allowed by", "Denied by", "Interrupted"]
    .map((p) => tolerant(p).source)
    .join("|"),
  "i",
);

const permissionRequest = (c: PrCase): PtyCase => ({
  id: `hooks.permissionrequest.${c.name}`,
  settings: hooks(["PermissionRequest"]),
  stub: TOUCH(`ran-${c.name}`),
  ...(c.ctl ? { ctl: { PermissionRequest: c.ctl } } : {}),
  schedule: [
    READY,
    ASK(),
    waitAny(
      ["proceed?", "Allowed by", "Denied by", "Interrupted"],
      "outcome",
      15,
    ),
    ESC(8),
  ],
  secs: 10,
  claims: ["hooks.permissionrequest"],
  notes: `PermissionRequest hook reply: ${c.note}. The outcome lines are judged on the screen as it was when our own Esc was sent (the Esc itself prints "Interrupted").`,
  samples: (x) => {
    const d = firstSeenT(x, PROCEED_RE, "esc");
    const o = firstSeenT(x, OUTCOME_RE, "esc");
    return {
      dialogToOutcomeS: d !== null && o !== null ? String(round(o - d, 2)) : "",
    };
  },
  facts: (x) => {
    const h = x.hook("PermissionRequest");
    const first = h[0]?.json ?? {};
    const before = screenBefore(x, "esc");
    const d = firstSeenT(x, PROCEED_RE, "esc");
    const o = firstSeenT(x, OUTCOME_RE, "esc");
    return {
      ...pre(h.length > 0, "PermissionRequest hook never fired"),
      fired: h.length,
      inputKeys: keysOf(first),
      toolName: String(first["tool_name"] ?? ""),
      dialogOpenAtEsc: dialogOpenAt(x, "esc"),
      dialogToOutcomeS: d !== null && o !== null ? round(o - d, 0) : null,
      toolRan: ranFile(x, `ran-${c.name}`),
      allowedLine: shows(x, "Allowed by PermissionRequest hook", before),
      deniedLine: shows(x, "Denied by PermissionRequest hook", before),
      interrupted: shows(x, "Interrupted", before),
      modelGotDenyMessage: /PR-(DENY|INT)-MSG/.test(toolResultText(x)),
    };
  },
});

const classifierRequests = (x: PtyRun): number =>
  x.messages.filter((q) =>
    /security monitor for autonomous AI coding agents/.test(
      JSON.stringify(obj(q.body)["system"] ?? ""),
    ),
  ).length;

const deniedCase = (retry: boolean): PtyCase => ({
  id: `hooks.permissiondenied.${retry ? "retry" : "auto"}`,
  mode: "auto",
  settings: {
    ...hooks(["PermissionDenied", "PermissionRequest", "Notification"]),
    skipAutoPermissionPrompt: true,
  },
  stub: TOUCH("ran-auto", "curl -s http://127.0.0.1:9/x"),
  ...(retry
    ? {
        ctl: {
          PermissionDenied: {
            out: JSON.stringify({
              hookSpecificOutput: {
                hookEventName: "PermissionDenied",
                retry: true,
              },
            }),
          },
        },
      }
    : {}),
  schedule: [
    READY,
    ASK(),
    { ...WAIT("Enter to continue", "ack-classifier-notice"), send: "\r" },
    { ...WAIT("Shift+Tab to change mode", "ack-auto-notice"), send: "\r" },
    ESC(22),
  ],
  secs: 24,
  claims: ["hooks.permissiondenied"],
  notes:
    "Auto mode (opt-in notice skipped, classifier billing notice acknowledged with Enter); the stub answers the classifier with plain text it cannot parse, so the call is blocked after retries. No classifier verdict exists, so retry:true should change nothing.",
  facts: (x) => {
    const d = x.hook("PermissionDenied");
    const first = d[0]?.json ?? {};
    return {
      ...pre(d.length > 0, "PermissionDenied hook never fired"),
      fired: d.length,
      inputKeys: keysOf(first),
      reason: String(first["reason"] ?? "").slice(0, 120),
      permissionRequestFired: x.hook("PermissionRequest").length,
      notificationTypes: [
        ...new Set(
          x
            .hook("Notification")
            .map((n) => String(n.json["notification_type"] ?? "")),
        ),
      ].sort(),
      retryTextSeen: /may retry this tool call/.test(toolResultText(x)),
      classifierRequested: classifierRequests(x) > 0,
    };
  },
  samples: (x) => ({ classifierRequests: String(classifierRequests(x)) }),
});

const notification = (cont: boolean): PtyCase => ({
  id: `hooks.notification.${cont ? "continue-false" : "permission-prompt"}`,
  settings: hooks(["Notification", "PermissionRequest"]),
  stub: TOUCH("ran-notif"),
  ...(cont
    ? {
        ctl: {
          Notification: {
            out: JSON.stringify({
              continue: false,
              systemMessage: "NOTIF-SYSMSG",
            }),
          },
        },
      }
    : {}),
  schedule: [
    READY,
    ASK(),
    WAIT("proceed?", "dialog"),
    cont ? { t: 14, send: "\r", label: "accept" } : ESC(14),
  ],
  secs: 17,
  claims: ["hooks.notification"],
  notes: cont
    ? "Notification reply continue:false plus systemMessage; the dialog is accepted after the hook ran."
    : "The dialog is held open for about 12 s, then cancelled.",
  samples: (x) => {
    const first = x.hook("Notification")[0];
    const pr = x.hook("PermissionRequest")[0];
    return {
      delaySinceRequestS: first && pr ? String(round(first.t - pr.t, 2)) : "",
    };
  },
  facts: (x) => {
    const n = x.hook("Notification");
    const pr = x.hook("PermissionRequest")[0];
    const first = n[0];
    return {
      ...pre(n.length > 0, "Notification hook never fired"),
      fired: n.length,
      inputKeys: keysOf(first?.json ?? {}),
      notificationType: String(first?.json["notification_type"] ?? ""),
      message: String(first?.json["message"] ?? ""),
      delayBucketS: first && pr ? round(first.t - pr.t, 0) : null,
      toolRan: ranFile(x, "ran-notif"),
      sysMsgShown: shows(x, "NOTIF-SYSMSG"),
    };
  },
});

const PRECOMPACT: { name: string; ctl?: { out?: string; exit?: number } }[] = [
  {
    name: "sysmsg",
    ctl: { out: JSON.stringify({ systemMessage: "PRECOMPACT-SYSMSG" }) },
  },
  {
    name: "block",
    ctl: { out: JSON.stringify({ decision: "block", reason: "PC-BLOCK" }) },
  },
  { name: "exit2", ctl: { exit: 2 } },
];
const preCompact = (p: (typeof PRECOMPACT)[number]): PtyCase => ({
  id: `hooks.precompact.${p.name}`,
  settings: hooks(["PreCompact", "PostCompact"]),
  ...(p.ctl ? { ctl: { PreCompact: p.ctl } } : {}),
  schedule: [
    READY,
    ASK("p1"),
    ASK("p2", 6),
    { t: 12, send: "/compact\r", label: "compact" },
  ],
  secs: 22,
  claims: ["hooks.precompact"],
  notes:
    "Two standard prompts, then the /compact slash command (a command, not a model prompt).",
  facts: (x) => {
    const pc = x.hook("PreCompact");
    const first = pc[0]?.json ?? {};
    return {
      ...pre(pc.length > 0, "PreCompact hook never fired"),
      fired: pc.length,
      inputKeys: keysOf(first),
      trigger: String(first["trigger"] ?? ""),
      postCompactFired: x.hook("PostCompact").length,
      postCompactKeys: keysOf(x.hook("PostCompact")[0]?.json ?? {}),
      blockedLine: shows(x, "Compaction blocked by PreCompact hook"),
      blockReasonShown: shows(x, "PC-BLOCK"),
      sysMsgShown: shows(x, "PRECOMPACT-SYSMSG"),
      notEnoughMessages: shows(x, "Not enough messages to compact"),
    };
  },
});

const elicitHook: PtyCase = {
  id: "hooks.elicitation.hook-accept",
  settings: {
    ...hooks(["Elicitation", "ElicitationResult", "Notification"]),
    enableAllProjectMcpServers: true,
    permissions: { allow: ["mcp__probe"] },
  },
  projFiles: ELICIT_MCP,
  env: { ENABLE_TOOL_SEARCH: "false" },
  stub: { seq: [{ name: "mcp__probe__ask", input: {} }] },
  ctl: {
    Elicitation: {
      out: JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "Elicitation",
          action: "accept",
          content: { color: "red" },
        },
      }),
    },
  },
  schedule: [READY, ASK("prompt", 6)],
  secs: 18,
  claims: ["hooks.elicitation"],
  notes:
    "A local MCP server asks a form question; the Elicitation hook answers accept, so no dialog opens.",
  facts: (x) => {
    const e = x.hook("Elicitation");
    const first = e[0]?.json ?? {};
    const mcp = x.file("mcp.log");
    return {
      ...pre(e.length > 0, "Elicitation hook never fired (MCP server up?)"),
      fired: e.length,
      inputKeys: keysOf(first),
      mcpServer: String(first["mcp_server_name"] ?? ""),
      mode: String(first["mode"] ?? ""),
      dialogShown: shows(x, "PROBE-ELICIT"),
      elicitationResultFired: x.hook("ElicitationResult").length,
      mcpToolsInRequests: [
        ...new Set(
          x.messages.flatMap((q) =>
            toolNames(q).filter((n) => n.startsWith("mcp__")),
          ),
        ),
      ].sort(),
      toolSearchInRequests: x.messages.some((q) =>
        toolNames(q).includes("ToolSearch"),
      ),
      serverStarted: /"method":"initialize"/.test(mcp),
      serverGotAccept: /"action":"accept"/.test(mcp),
      serverGotRed: /red/.test(
        mcp.split("elicitation/create").slice(1).join(""),
      ),
      notificationTypes: [
        ...new Set(
          x
            .hook("Notification")
            .map((n) => String(n.json["notification_type"] ?? "")),
        ),
      ].sort(),
    };
  },
};

export const hooksGroup: PtyGroup = {
  id: "hooks",
  title:
    "PermissionRequest, PermissionDenied, Notification, PreCompact, Elicitation",
  cases: () => [
    ...PR_CASES.map(permissionRequest),
    deniedCase(false),
    deniedCase(true),
    notification(false),
    notification(true),
    ...PRECOMPACT.map(preCompact),
    elicitHook,
  ],
};
