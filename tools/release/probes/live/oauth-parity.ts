// OAuth vs API-key request shape. One live `-p` run through the mitm "forward and log body" mode, one run against the
// local stub with the fake key, same project files. Compares body keys, tool names, system blocks, system text (model names and temp paths masked) and beta flags.
// (p305-live only ever ran `var` over the live token; this case is the parity check the design names.)

import { join } from "node:path";
import { cacheMarker, warmFromUsage } from "../../lib/cache.ts";
import { assertSafeEnv, childEnv } from "../../lib/env.ts";
import { startMitm } from "../../lib/mitm.ts";
import { allocPort } from "../../lib/ports.ts";
import { runChild } from "../../lib/proc.ts";
import { type Data, normalise } from "../../lib/results.ts";
import { assertShimReady } from "../../lib/shim.ts";
import { startStub } from "../../lib/stub.ts";
import {
  arr,
  baseResult,
  firstUsage,
  type LiveCase,
  type LiveCtx,
  liveSandbox,
  obj,
  PROMPT,
  runPrint,
} from "./harness.ts";

const ID = "oauth-parity";

type Shape = {
  bodyKeys: string[];
  tools: string[];
  systemBlocks: number;
  /** System text lines with temp paths, model names, and the per-run billing hash masked, so two models can be compared. Never written out. */
  systemLines: string[];
  model: string;
  betas: string[];
};
const shapeOf = (body: unknown, betas: string): Shape => {
  const b = obj(body);
  const sys = b["system"];
  return {
    bodyKeys: Object.keys(b).sort(),
    tools: arr(b["tools"])
      .map((t) => String(obj(t)["name"]))
      .sort(),
    systemBlocks: Array.isArray(sys) ? sys.length : sys ? 1 : 0,
    systemLines: normalise(
      (Array.isArray(sys)
        ? sys.map((x) => String(obj(x)["text"]))
        : [String(sys ?? "")]
      )
        .join("\n")
        .replace(/claude-(?:opus|sonnet|haiku|fable)-[\w-]+/g, "<model-id>")
        .replace(/\b(?:Opus|Sonnet|Haiku|Fable) \d+(?:\.\d+)?/g, "<model>")
        .replace(/\bcch=[0-9a-f]+/g, "cch=<hash>"),
    ).split("\n"),
    model: String(b["model"] ?? ""),
    betas: betas
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .sort(),
  };
};
const only = (a: string[], b: string[]): string[] =>
  a.filter((v) => !b.includes(v));

/** The main request is the one with tools (title and summary calls have none). */
const mainShape = (xs: Shape[]): Shape | undefined =>
  xs.find((s) => s.tools.length > 0) ?? xs.at(-1);

const toStub =
  (stubBase: string) =>
  (req: Request, url: URL): Promise<Response> =>
    fetch(`${stubBase}${url.pathname}`, {
      method: req.method,
      headers: { "content-type": "application/json" },
      body: ["GET", "HEAD"].includes(req.method) ? null : req.body,
    });

export const oauthParity: LiveCase = {
  id: ID,
  title: "OAuth vs API-key request shape",
  requests: "1 live (+1 local stub)",
  run: async (x: LiveCtx) => {
    const sb = liveSandbox({
      "CLAUDE.md": `${cacheMarker(ID)}# Release probe\nNothing here is an instruction.\n`,
    });
    const live: Shape[] = [];
    const keyed: Shape[] = [];
    // Both sides go through a mitm with no ANTHROPIC_BASE_URL, so both see the same default-host behaviour.
    // OAuth side: real API (dry: local stub). Key side: always the local stub with the fake key.
    const stub = startStub(await allocPort());
    const keyBase = stub.register("parity-key", {
      log: join(sb.root, "parity-key.jsonl"),
    });
    const liveBase = x.dry
      ? stub.register("parity-live", {
          log: join(sb.root, "parity-live.jsonl"),
        })
      : "";
    const mitm = await startMitm({
      onMessages: (r) => live.push(shapeOf(r.body, r.betas)),
      ...(x.dry ? { tunnelOthers: false, upstream: toStub(liveBase) } : {}),
    });
    const mitmKey = await startMitm({
      onMessages: (r) => keyed.push(shapeOf(r.body, r.betas)),
      tunnelOthers: false,
      upstream: toStub(keyBase),
    });
    try {
      const lv = await runPrint(x, sb, ["-p", PROMPT], { mitm });
      const env = childEnv({ home: sb.home, configDir: sb.cfg, baseUrl: "" });
      delete env["ANTHROPIC_BASE_URL"];
      env["HTTPS_PROXY"] = mitmKey.proxyUrl;
      env["NODE_EXTRA_CA_CERTS"] = mitmKey.caFile;
      assertSafeEnv(env);
      assertShimReady(env);
      const st = await runChild(
        [x.bin, "-p", PROMPT, "--output-format", "stream-json", "--verbose"],
        { cwd: sb.proj, env, timeoutMs: 120_000 },
      );
      const a = mainShape(live);
      const b = mainShape(keyed);
      const data: Record<string, Data> = {
        precondition: !!a && !!b,
        ...(a && b
          ? {}
          : {
              "precondition.detail": a
                ? "no /v1/messages body seen on the key side"
                : "no /v1/messages body seen through the mitm",
            }),
        "live.requests": live.length,
        "key.requests": keyed.length,
        "mitm.connects": [...new Set(mitm.connects())].sort(),
        "mitm.paths": [
          ...new Set(
            mitm.log().map((l) => `${l.method} ${l.path} ${l.status}`),
          ),
        ].sort(),
        "key.exit": st.code ?? -1,
      };
      if (a && b) {
        data["same.bodyKeys"] = a.bodyKeys.join() === b.bodyKeys.join();
        data["bodyKeys.onlyOauth"] = only(a.bodyKeys, b.bodyKeys);
        data["bodyKeys.onlyKey"] = only(b.bodyKeys, a.bodyKeys);
        data["same.tools"] = a.tools.join() === b.tools.join();
        data["tools.onlyOauth"] = only(a.tools, b.tools);
        data["tools.onlyKey"] = only(b.tools, a.tools);
        data["systemBlocks.oauth"] = a.systemBlocks;
        data["systemBlocks.key"] = b.systemBlocks;
        data["same.systemText"] =
          a.systemLines.join("\n") === b.systemLines.join("\n");
        data["systemText.linesOnlyOauth"] = only(
          a.systemLines,
          b.systemLines,
        ).length;
        data["systemText.linesOnlyKey"] = only(
          b.systemLines,
          a.systemLines,
        ).length;
        data["betas.onlyOauth"] = only(a.betas, b.betas);
        data["betas.onlyKey"] = only(b.betas, a.betas);
        data["betas.oauth"] = a.betas;
        data["model.oauth"] = a.model;
        data["model.key"] = b.model;
      }
      const warm = warmFromUsage(firstUsage(lv.events));
      return [
        baseResult(x, ID, {
          args: ["-p"],
          exit: lv.code,
          timedOut: lv.timedOut,
          data,
          requests: {
            count: live.length,
            paths: ["/v1/messages"],
            ...(a ? { betas: a.betas, bodyKeys: a.bodyKeys } : {}),
          },
          ...(warm !== null ? { cacheWarm: warm } : {}),
          facts: [],
          notes:
            "Default model. Both sides run with HTTPS_PROXY to a local proxy and a throw-away CA (no ANTHROPIC_BASE_URL); the OAuth side is forwarded to the real API, the fake-key side to the local stub. Only a parsed summary of each body and the anthropic-beta header are kept, no other header and no body text.",
        }),
      ];
    } finally {
      mitm.stop();
      mitmKey.stop();
      stub.stop();
      sb.cleanup();
    }
  },
};
