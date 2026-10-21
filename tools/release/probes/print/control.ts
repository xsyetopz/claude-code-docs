// Control protocol over stream-json stdin (ported from p305-print/ctl.ts). No user prompt: only control requests.
import type { Fact } from "../../lib/results.ts";
import { baseResult, dispose, events, obj, oneCase, runCase } from "./run.ts";
import type { PrintGroup } from "./types.ts";

const REQUESTS: { subtype: string; [k: string]: unknown }[] = [
  { subtype: "set_model", model: "sonnet" },
  { subtype: "get_binary_version" },
  { subtype: "set_permission_mode", mode: "nonsense" },
  { subtype: "set_model", model: "totally-unknown-model" },
  { subtype: "mcp_status" },
  { subtype: "interrupt" },
  { subtype: "bogus_sub" },
  { subtype: "set_permission_mode", mode: "plan" },
];

export const controlGroup: PrintGroup = {
  id: "control",
  title: "Control protocol requests",
  run: async (ctx) =>
    oneCase(ctx, "print.control.requests", async () => {
      const stdin = `${REQUESTS.map((r, i) =>
        JSON.stringify({
          type: "control_request",
          request_id: `req-${i + 1}`,
          request: r,
        }),
      ).join("\n")}\n`;
      const r = await runCase(ctx.bin, {
        noPrompt: true,
        argv: [
          "-p",
          "--input-format",
          "stream-json",
          "--output-format",
          "stream-json",
          "--verbose",
          "--model",
          "claude-opus-5-5",
        ],
        stdin,
      });
      try {
        const ev = events(r);
        const responses = ev.filter((e) => e["type"] === "control_response");
        const facts: Record<string, Fact> = {
          precondition: r.code === 0 && responses.length > 0,
          responses: responses.length,
          "event.types": [
            ...new Set(
              ev.map(
                (e) => `${e["type"]}${e["subtype"] ? `/${e["subtype"]}` : ""}`,
              ),
            ),
          ],
        };
        REQUESTS.forEach((q, i) => {
          const key = `req${i + 1}.${q.subtype}${q["mode"] || q["model"] ? `(${q["mode"] ?? q["model"]})` : ""}`;
          const hit = responses.find(
            (e) => obj(e["response"])["request_id"] === `req-${i + 1}`,
          );
          if (!hit) {
            facts[key] = "no response";
            return;
          }
          const body = obj(hit["response"]);
          facts[key] =
            body["subtype"] === "success"
              ? `success {${Object.keys(obj(body["response"])).join(",")}}`
              : `${String(body["subtype"])}: ${String(body["error"]).slice(0, 160)}`;
        });
        return baseResult(ctx, "print.control.requests", r, {
          facts,
          samples: {
            responses: responses.map((e) => JSON.stringify(e)).join("\n"),
          },
          notes: "No user prompt: eight control_request lines on stdin.",
        });
      } finally {
        dispose(r);
      }
    }),
};
