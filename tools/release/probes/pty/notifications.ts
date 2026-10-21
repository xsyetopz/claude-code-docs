// Notification types reachable offline (ported from p305-pty settings-t10/np1 and mcp-elicit.ts).
// permission_prompt is covered by hooks.notification.*. worker_permission_prompt needs an out-of-process teammate: skipped.
import {
  ASK,
  ELICIT_MCP,
  ESC,
  hooks,
  type PtyCase,
  type PtyGroup,
  type PtyRun,
  pre,
  READY,
  round,
  TOUCH,
  WAIT,
} from "./harness.ts";

const MCP_SETTINGS = {
  ...hooks(["Notification", "Elicitation", "ElicitationResult"]),
  enableAllProjectMcpServers: true,
  permissions: { allow: ["mcp__probe"] },
};

const types = (x: PtyRun): string[] =>
  [
    ...new Set(
      x
        .hook("Notification")
        .map((n) => String(n.json["notification_type"] ?? "")),
    ),
  ].sort();
const messageOf = (x: PtyRun, type: string): string =>
  String(
    x.hook("Notification").find((n) => n.json["notification_type"] === type)
      ?.json["message"] ?? "",
  );

const elicitationDialog: PtyCase = {
  id: "notifications.elicitation-dialog",
  settings: MCP_SETTINGS,
  projFiles: ELICIT_MCP,
  env: { ENABLE_TOOL_SEARCH: "false" },
  stub: { seq: [{ name: "mcp__probe__ask", input: {} }] },
  schedule: [
    READY,
    ASK("prompt", 6),
    WAIT("PROBE-ELICIT", "dialog"),
    ESC(18, "cancel"),
  ],
  secs: 21,
  claims: ["notifications.types"],
  notes:
    "Form elicitation with no hook answer: the dialog opens, then is cancelled.",
  facts: (x) => {
    const t = types(x);
    const res = x.hook("ElicitationResult")[0]?.json ?? {};
    return {
      ...pre(x.hook("Elicitation").length > 0, "Elicitation hook never fired"),
      notificationTypes: t,
      dialogMessage: messageOf(x, "elicitation_dialog"),
      responseMessage: messageOf(x, "elicitation_response"),
      resultAction: String(res["action"] ?? ""),
    };
  },
};

const elicitationUrl: PtyCase = {
  id: "notifications.elicitation-url",
  settings: MCP_SETTINGS,
  projFiles: ELICIT_MCP,
  env: { ENABLE_TOOL_SEARCH: "false" },
  stub: { seq: [{ name: "mcp__probe__askurl", input: {} }] },
  schedule: [
    READY,
    ASK("prompt", 6),
    WAIT("PROBE-URL", "dialog"),
    { t: 18, send: "\r", label: "accept" },
  ],
  secs: 24,
  claims: ["notifications.types"],
  notes:
    "URL-mode elicitation; the first option is chosen with Enter after the 6 s notification delay.",
  facts: (x) => ({
    ...pre(x.hook("Elicitation").length > 0, "Elicitation hook never fired"),
    notificationTypes: types(x),
    urlDialogMessage: messageOf(x, "elicitation_url_dialog"),
    responseMessage: messageOf(x, "elicitation_response"),
    completeMessage: messageOf(x, "elicitation_complete"),
    elicitationMode: String(x.hook("Elicitation")[0]?.json["mode"] ?? ""),
  }),
};

const idle: PtyCase = {
  id: "notifications.idle-prompt",
  settings: hooks(["Notification"]),
  schedule: [READY, ASK("prompt")],
  secs: 85,
  claims: ["notifications.types"],
  notes:
    "One reply, then idle. Records how long after the prompt idle_prompt fires.",
  facts: (x) => {
    const n = x
      .hook("Notification")
      .find((k) => k.json["notification_type"] === "idle_prompt");
    const p = x.pty.sent.find((s) => s.label === "prompt")?.t;
    return {
      ...pre(!!n, "idle_prompt never fired within 85 s"),
      notificationTypes: types(x),
      message: messageOf(x, "idle_prompt"),
      // nearest 5 s: the exact delay drifts a little from run to run
      secondsAfterPrompt: n && p ? Math.round((n.t - p) / 5) * 5 : null,
    };
  },
  samples: (x) => {
    const n = x
      .hook("Notification")
      .find((k) => k.json["notification_type"] === "idle_prompt");
    const p = x.pty.sent.find((s) => s.label === "prompt")?.t;
    return { secondsAfterPromptRaw: n && p ? String(round(n.t - p, 1)) : "" };
  },
};

const autoMode: PtyCase = {
  id: "notifications.agent-needs-input",
  mode: "auto",
  settings: { ...hooks(["Notification"]), skipAutoPermissionPrompt: true },
  stub: TOUCH("ran-an", "curl -s http://127.0.0.1:9/x"),
  schedule: [
    READY,
    ASK(),
    { ...WAIT("Enter to continue", "ack-classifier-notice"), send: "\r" },
    ESC(14),
  ],
  secs: 16,
  claims: ["notifications.types"],
  notes:
    "Auto mode with a custom base URL: a classifier billing notice fires agent_needs_input.",
  facts: (x) => ({
    ...pre(
      x.hook("Notification").length > 0,
      "no Notification hook fired in auto mode",
    ),
    notificationTypes: types(x),
    message: messageOf(x, "agent_needs_input"),
  }),
};

export const notificationsGroup: PtyGroup = {
  id: "notifications",
  title: "notification types seen in the interactive screen",
  cases: () => [elicitationDialog, elicitationUrl, autoMode, idle],
};
