// cache_touch / cache keep-alive (ported from p305-print ck.ts).
// The stub sends the keep-alive response headers; the program should not send a touch request without a subscriber.
import {
  type CaseDef,
  json,
  msgs,
  readCfg,
  runCases,
  withRun,
} from "./run/helpers.ts";
import type { PrintGroup } from "./types.ts";

const OVERRIDE = json({
  tengu_sequential_cloud: {
    enabled: true,
    touchIntervalSeconds: 10,
    activityWindowMinutes: 60,
  },
  allow_cache_keepalive: true,
});

/** The debug log shows no sign of the override, so check that the binary knows the variable at all. */
const readsOverride = (bin: string): boolean =>
  Bun.spawnSync([
    "/usr/bin/grep",
    "-c",
    "-a",
    "CLAUDE_INTERNAL_FC_OVERRIDES",
    bin,
  ])
    .stdout.toString()
    .trim() !== "0";

const ckCase = (name: string, env: Record<string, string>): CaseDef => {
  const overridden = "CLAUDE_INTERNAL_FC_OVERRIDES" in env;
  return {
    name: `cache-touch.${name}`,
    run: (ctx) =>
      withRun(
        ctx,
        {
          env,
          args: ["--debug-file", "{CFG}/d.log"],
          stub: {
            respHeaders: {
              "anthropic-cache-keepalive": "active",
              "request-id": "req_011CTestKeepAlive0001",
            },
          },
          timeoutMs: 40_000,
        },
        (r) => {
          const d = readCfg(r, "d.log");
          const lines = d
            .split("\n")
            .filter((l) => /keepalive|cache_touch/i.test(l));
          const q = msgs(r)[0];
          return {
            from: r,
            facts: {
              precondition:
                !!q && d.length > 0 && (!overridden || readsOverride(ctx.bin)),
              binaryReadsOverride: readsOverride(ctx.bin),
              paths: [
                ...new Set(r.reqs.map((x) => x.path.split("?")[0] ?? "")),
              ],
              betaCacheKeepalive: (q?.headers["anthropic-beta"] ?? "").includes(
                "cache-keepalive",
              ),
              touchRequests: r.reqs.filter((x) =>
                /cache_touch|keepalive/i.test(x.path),
              ).length,
              keepaliveDebugLines: lines.length,
            },
            samples: {
              debugLines: lines.map((l) => l.slice(0, 220)).join("\n"),
            },
          };
        },
      ),
  };
};

export const cachetouch: PrintGroup = {
  id: "cachetouch",
  title: "cache_touch keep-alive",
  run: (ctx) =>
    runCases(ctx, "cachetouch", [
      ckCase("no-override", {}),
      ckCase("override", { CLAUDE_INTERNAL_FC_OVERRIDES: OVERRIDE }),
    ]),
};
