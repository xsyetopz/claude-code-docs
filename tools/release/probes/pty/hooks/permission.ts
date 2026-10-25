// PermissionRequest and PermissionDenied cases of the hook probes.
import {
  ASK,
  dialogOpenAt,
  ESC,
  firstSeenT,
  hooks,
  keysOf,
  type Obj,
  obj,
  type PtyCase,
  type PtyRun,
  pre,
  READY,
  ranFile,
  round,
  screenBefore,
  shows,
  TOUCH,
  tolerant,
  toolResultText,
  WAIT,
  waitAny,
} from "../harness.ts";

const PR = (decision: Obj): string =>
  JSON.stringify({
    hookSpecificOutput: { hookEventName: "PermissionRequest", decision },
  });

type PrCase = {
  name: string;
  ctl?: { out?: string; exit?: number };
  note: string;
};
export const PR_CASES: PrCase[] = [
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

export const permissionRequest = (c: PrCase): PtyCase => ({
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

export const deniedCase = (retry: boolean): PtyCase => ({
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
