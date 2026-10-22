// Live /usage with a fault on /api/oauth/usage. Ports p305-lv s_usage*.json (open /usage, press Enter, watch 6 s)
// and mitm2.ts modes. The program runs with the real token behind the local proxy; everything else is forwarded.
// No prompt is sent, but interactive startup makes a few small API requests of its own (title and similar calls). CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC is left out on purpose:
// with it set the panel never calls the endpoint (docs/reference/probes.md).
import { type Fault, startMitm, USAGE_PATH } from "../../lib/mitm.ts";
import type { Fact } from "../../lib/results.ts";
import { READY } from "../pty/harness.ts";
import {
  baseResult,
  type LiveCase,
  type LiveCtx,
  liveSandbox,
  runLivePty,
} from "./harness.ts";

const FAULTS: { id: string; fault: Fault; what: string }[] = [
  { id: "usage.429", fault: "429", what: "429 without Retry-After" },
  {
    id: "usage.429-retry-after",
    fault: "429-ra",
    what: "429 with Retry-After: 1800",
  },
  {
    id: "usage.envelope",
    fault: "200-envelope",
    what: "200 with an error envelope body",
  },
];

const find = (screen: string, re: RegExp): string =>
  screen
    .split("\n")
    .find((l) => re.test(l))
    ?.trim()
    .slice(0, 200) ?? "";

const usageCase = (f: (typeof FAULTS)[number]): LiveCase => ({
  id: f.id,
  title: `/usage with ${f.what}`,
  requests: "no prompt; startup sends a few small requests",
  run: async (x: LiveCtx) => {
    const sb = liveSandbox();
    const mitm = await startMitm({
      fault: f.fault,
      ...(x.dry
        ? {
            tunnelOthers: false,
            // dry: nothing leaves the machine; any forwarded call gets a local 404
            upstream: async () =>
              new Response("{}", {
                status: 404,
                headers: { "content-type": "application/json" },
              }),
          }
        : {}),
    });
    try {
      const pty = await runLivePty(x, sb, {
        schedule: [READY, { t: 10, send: "/usage\r", label: "usage" }],
        secs: 18,
        mitm,
        allowNonessential: true,
      });
      const log = mitm.log();
      const hits = log.filter((l) => l.path === USAGE_PATH);
      const s = pty.screen;
      const facts: Record<string, Fact> = {
        precondition: /shortcuts|auto\s*mode|Claude Code/i.test(s),
        ...(/shortcuts|auto\s*mode|Claude Code/i.test(s)
          ? {}
          : { "precondition.detail": "UI never started" }),
        fault: f.fault,
        usageEndpointCalls: hits.length,
        usageStatuses: [...new Set(hits.map((h) => String(h.status)))],
        otherPaths: [
          ...new Set(
            log
              .filter((l) => l.path !== USAGE_PATH)
              .map((l) => `${l.method} ${l.path} ${l.status}`),
          ),
        ].sort(),
        showsRateLimitedUntil: /rate limited until/i.test(s),
        showsTryAgainInAMoment: /try again in a moment/i.test(s),
        showsFailedToLoad: /Failed to load usage data/i.test(s),
        showsRefreshing: /Refreshing/.test(s),
        errorLine: find(s, /rate limited|Failed to load|Error:/i),
      };
      return [
        baseResult(x, f.id, {
          prompt: "",
          exit: pty.exit,
          facts,
          notes: `Fault: ${f.what}. ${hits.length ? "" : "The usage endpoint was never called (seen on 2.1.305 with a real token), so the texts could not be checked. "}No prompt is sent (prompt is empty): /usage is a local command, but interactive startup makes its own small API requests.`,
        }),
      ];
    } finally {
      mitm.stop();
      sb.cleanup();
    }
  },
});

export const usageCases: LiveCase[] = FAULTS.map(usageCase);
