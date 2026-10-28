// Text captures that need the interactive screen: the claude-code-guide subagent system text and the /insights skill text.
// Facts are length and hash (diffable); the full text is kept beside the JSON as <case>.system.txt / <case>.requests.txt.
import { normalise } from "../../lib/results.ts";
import { agentCase, subSystem } from "./agents.ts";
import {
  arr,
  ESC,
  obj,
  PROMPT,
  type PtyCase,
  type PtyGroup,
  type PtyRun,
  pre,
  READY,
  sha8,
  sysText,
  toolNames,
} from "./harness.ts";

const guide: PtyCase = agentCase(
  "captures.guide",
  {
    description: "Probe task",
    prompt: PROMPT,
    subagent_type: "claude-code-guide",
  },
  "The claude-code-guide subagent: system text length and hash (docs/prompts/agents/subagent-claude-code-guide.md). Text kept as .system.txt.",
  {
    claims: ["prompts.subagent-claude-code-guide"],
    facts: (x) => {
      const sys = subSystem(x);
      return {
        ...pre(sys.length > 0, "no claude-code-guide subagent request seen"),
        systemChars: sys.length,
        systemSha8: sha8(sys),
        subagentTools: toolNames(
          x.messages.find((q) =>
            JSON.stringify(q.body).includes("cc_is_subagent=true"),
          ) ??
            x.messages[0] ??
            ({} as never),
        ).length,
        mentionsGuide: /Claude Code/.test(sys),
      };
    },
    artifacts: (x) => ({ "system.txt": subSystem(x) }),
    samples: (x) => ({ systemHead: subSystem(x).slice(0, 1500) }),
  },
);

const lastUser = (body: unknown): string => {
  const ms = arr(obj(body)["messages"]);
  const m = obj(ms[ms.length - 1]);
  const c = m["content"];
  return typeof c === "string"
    ? c
    : arr(c)
        .map((b) => String(obj(b)["text"] ?? ""))
        .join("\n");
};
const blocks = (x: PtyRun): string[] =>
  x.messages.map(
    (q, i) =>
      `=== request ${i} system: ${sysText(q)}\n=== request ${i} last user:\n${lastUser(q.body)}\n`,
  );

const insights: PtyCase = {
  id: "captures.skill-insights",
  prompt: "/insights PROBE-ARG",
  promptReason:
    "Invokes the bundled /insights skill by name; the skill text is what the probe captures.",
  schedule: [
    READY,
    { t: 0, send: "/insights PROBE-ARG\r", label: "prompt" },
    ESC(30),
  ],
  secs: 34,
  claims: ["prompts.skill-insights"],
  notes: "Interactive /insights; the stub answers every request with OK.",
  facts: (x) => {
    const b = x.messages.map((q) => lastUser(q.body));
    // hash the text with the random sandbox path and ids normalised, so two runs of one version match
    const nb = b.map((t) => normalise(t));
    return {
      ...pre(x.messages.length > 0, "/insights made no model request"),
      requests: x.messages.length,
      userTextChars: b.reduce((n, t) => n + t.length, 0),
      userTextSha8: sha8(nb.join("\n")),
      perRequestSha8: nb.map(sha8),
      mentionsProbeArg: b.some((t) => t.includes("PROBE-ARG")),
    };
  },
  artifacts: (x) => ({ "requests.txt": blocks(x).join("\n") }),
};

export const capturesGroup: PtyGroup = {
  id: "captures",
  title: "claude-code-guide subagent text and /insights skill text",
  cases: () => [guide, insights],
};
