// Subagent probes (ported from p305-print sub.ts, sub2.ts, sub3.ts, setup.ts).
// The stub issues one Agent tool_use, so the CLI prompt stays the standard one; the subagent prompt is a marker.
import { existsSync } from "node:fs";
import {
  bodyOf,
  type CaseDef,
  json,
  msgs,
  type Run,
  readCfg,
  runCases,
  sysText,
  toolNames,
  toolResultTexts,
  withRun,
} from "./run/helpers.ts";
import type { PrintGroup } from "./types.ts";

const MARK = "PROBEMARK Reply with 'OK'.";
const agentCall = (type: string) => [
  {
    name: "Agent",
    input: {
      description: "d",
      prompt: MARK,
      subagent_type: type,
      run_in_background: false,
    },
  },
];
const BASE = ["--permission-mode", "bypassPermissions"];
const agentFile = (name: string, fm: string) => ({
  [`.claude/agents/${name}.md`]: `---\nname: ${name}\ndescription: probe agent\n${fm}\n---\nHello.\n`,
});

/** Requests made by the subagent itself: carry the marker, and the tool list has no Agent tool. */
const subReqs = (r: Run) =>
  msgs(r).filter(
    (q) =>
      json(bodyOf(q).messages).includes("PROBEMARK") &&
      !toolNames(q).includes("Agent"),
  );
const firstResult = (r: Run) => toolResultTexts(r)[0] ?? "";
const cwdInSub = (r: Run) => {
  const t = json(subReqs(r)[0] ? bodyOf(subReqs(r)[0] as never).messages : "");
  return (t.match(/Primary working directory: ([^\\ ]+)/)?.[1] ?? "").replace(
    r.sb.proj,
    "<PROJ>",
  );
};

const TYPES = [
  "claude",
  "Explore",
  "general-purpose",
  "Plan",
  "statusline-setup",
  "fork",
  "claude-code-guide",
  "comment-thread-analyst",
  "observer",
  "workflow-subagent",
];

const typeCase = (t: string): CaseDef => ({
  name: `type.${t}`,
  run: (ctx) =>
    withRun(ctx, { args: BASE, stub: { seq: agentCall(t) } }, (r) => {
      const res = firstResult(r);
      return {
        from: r,
        facts: {
          precondition: msgs(r).length >= 2,
          messages: msgs(r).length,
          handBack: res.includes("[Subagent hand-back]"),
          forkStarted: res.includes("Fork started"),
          notFound: res.includes("not found. Available agents:"),
          available: res.match(/Available agents: ([^"\\]*)/)?.[1] ?? "",
        },
      };
    }),
});

const webFetch: CaseDef = {
  name: "web-fetch",
  run: (ctx) =>
    withRun(
      ctx,
      {
        args: BASE,
        env: { CLAUDE_CODE_WEB_FETCH_AGENT: "1" },
        stub: { seq: agentCall("web-fetch") },
      },
      async (r) => {
        const ms = msgs(r);
        const main = ms[0];
        const sub = ms.filter(
          (q) =>
            json(bodyOf(q).messages).includes("PROBEMARK") &&
            toolNames(q).length < 5,
        );
        const base = await withRun(ctx, { args: BASE }, (b) => {
          const m = msgs(b)[0];
          return {
            mainHasWebFetch: m ? toolNames(m).includes("WebFetch") : null,
            rosterMentions: m ? json(bodyOf(m)).includes("web-fetch") : null,
          };
        });
        return {
          from: r,
          facts: {
            precondition: !!main,
            mainHasWebFetch: main ? toolNames(main).includes("WebFetch") : null,
            rosterHasWebFetch: main
              ? json(bodyOf(main)).includes("web-fetch")
              : null,
            subTools: sub.map((q) => toolNames(q).join(",")),
            baselineMainHasWebFetch: base.mainHasWebFetch,
            baselineRosterMentions: base.rosterMentions,
          },
        };
      },
    ),
};

const appendCase = (
  name: string,
  args: string[],
  env: Record<string, string>,
): CaseDef => ({
  name: `append-subagent-prompt.${name}`,
  run: (ctx) =>
    withRun(
      ctx,
      {
        args: [...BASE, ...args],
        env,
        stub: { seq: agentCall("general-purpose") },
      },
      (r) => {
        const sub = subReqs(r);
        const main = msgs(r)[0];
        return {
          from: r,
          facts: {
            precondition: sub.length > 0 && !!main,
            subRequests: sub.length,
            markerInSubSystem: sub.some((q) =>
              sysText(q).includes("ZZAPPENDZZ"),
            ),
            markerInMainSystem: main
              ? sysText(main).includes("ZZAPPENDZZ")
              : null,
            subTools: sub.map((q) => toolNames(q).join(",")),
          },
        };
      },
    ),
});

const observerCase = (on: boolean): CaseDef => ({
  name: `observer.${on ? "on" : "off"}`,
  run: (ctx) =>
    withRun(
      ctx,
      {
        args: BASE,
        env: on ? { CLAUDE_CODE_EXPERIMENTAL_OBSERVER_AGENTS: "1" } : {},
        projFiles: {
          ...agentFile("pa", "observer: obs\nobserverMessage: ZZOBSMSGZZ"),
          ...agentFile("obs", ""),
        },
        stub: { seq: agentCall("pa") },
      },
      (r) => {
        const ms = msgs(r);
        return {
          from: r,
          facts: {
            precondition: ms.length >= 2,
            messages: ms.length,
            observerReportToolIn: ms.filter((q) =>
              toolNames(q).includes("ObserverReport"),
            ).length,
            observerMessageIn: ms.filter((q) =>
              json(bodyOf(q).messages).includes("ZZOBSMSGZZ"),
            ).length,
          },
        };
      },
    ),
});

const fmCase = (name: string, fm: string): CaseDef => ({
  name: `frontmatter.${name}`,
  run: (ctx) =>
    withRun(
      ctx,
      {
        args: BASE,
        projFiles: agentFile("pa", fm),
        stub: { seq: agentCall("pa") },
      },
      (r) => {
        const sub = subReqs(r);
        return {
          from: r,
          facts: {
            precondition: sub.length > 0,
            subRequests: sub.length,
            subTools: sub.map((q) => toolNames(q).join(",")),
            // stable text fragment only, not the whole hand-back
            handBack: firstResult(r).includes("[Subagent hand-back]"),
          },
        };
      },
    ),
});

const isoCase = (iso: "remote" | "worktree" | "none"): CaseDef => ({
  name: `isolation.${iso}`,
  run: (ctx) =>
    withRun(
      ctx,
      {
        args: BASE,
        commit: true,
        projFiles: {
          ...agentFile("pa", iso === "none" ? "" : `isolation: ${iso}`),
          "README.md": "x\n",
        },
        stub: { seq: agentCall("pa") },
      },
      (r) => {
        const sub = subReqs(r);
        const cwd = cwdInSub(r);
        return {
          from: r,
          facts: {
            precondition: sub.length > 0,
            subRequests: sub.length,
            cwdInSub: cwd.replace(/agent-[0-9a-f]+/, "agent-<id>"),
            inWorktree: cwd.includes("/.claude/worktrees/"),
            stderrHead: r.stderr.slice(0, 100),
          },
        };
      },
    ),
});

const HOOK = {
  hooks: {
    Setup: [
      {
        hooks: [
          {
            type: "command",
            command: `echo ran >> {CFG}/setup.ran; echo '{"hookSpecificOutput":{"hookEventName":"Setup","additionalContext":"ZZSETUPCTXZZ"}}'`,
          },
        ],
      },
    ],
  },
};
const setupCase = (flag: string): CaseDef => ({
  name: `setup-hook.${flag.slice(2)}`,
  run: (ctx) =>
    withRun(
      ctx,
      { args: [...BASE, flag], cfgFiles: { "settings.json": json(HOOK) } },
      (r) => ({
        from: r,
        facts: {
          precondition: r.code !== null && !r.timedOut,
          hookRan:
            existsSync(`${r.sb.cfg}/setup.ran`) ||
            readCfg(r, "setup.ran") !== "",
          contextInRequest: msgs(r).some((q) =>
            json(bodyOf(q)).includes("ZZSETUPCTXZZ"),
          ),
          contextInStdout: r.stdout.includes("ZZSETUPCTXZZ"),
          requests: msgs(r).length,
        },
      }),
    ),
});

export const subagents: PrintGroup = {
  id: "subagents",
  title:
    "Subagents (types, web-fetch, append prompt, observer, frontmatter, isolation, Setup hook)",
  run: (ctx) =>
    runCases(ctx, "subagents", [
      ...TYPES.map(typeCase),
      webFetch,
      appendCase("flag", ["--append-subagent-system-prompt", "ZZAPPENDZZ"], {}),
      appendCase("env-append-subagent-system-prompt", [], {
        CLAUDE_CODE_APPEND_SUBAGENT_SYSTEM_PROMPT: "ZZAPPENDZZ",
      }),
      appendCase("env-enable-append-subagent-prompt", [], {
        CLAUDE_CODE_ENABLE_APPEND_SUBAGENT_PROMPT: "ZZAPPENDZZ",
      }),
      observerCase(false),
      observerCase(true),
      fmCase(
        "capital-tools-hyphen-disallowed",
        "Tools: Read\ndisallowed-tools: Bash",
      ),
      fmCase(
        "camel-disallowedTools",
        "tools: Read, Bash\ndisallowedTools: Bash",
      ),
      isoCase("remote"),
      isoCase("worktree"),
      isoCase("none"),
      ...["--init", "--init-only", "--maintenance"].map(setupCase),
    ]),
};
