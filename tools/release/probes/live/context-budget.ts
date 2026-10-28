// Live context budget, as docs/how-it-works/context-budget.md measured it: default model, project with README.md only
// (no CLAUDE.md, no marker). Runs `-p "/context"` (empty session), `-p "Reply with 'OK'."` (one model request), then
// `-p --continue "/context"`, and reads context_usage each time. Ports p305-live/lib.sh `var` and sum.py.
// Cold-sensitive: cacheWarm comes from the first reply's usage, not from a marker (a marker would change the numbers).
import { warmFromUsage } from "../../lib/cache.ts";
import type { Data } from "../../lib/results.ts";
import {
  arr,
  baseResult,
  contextUsage,
  firstUsage,
  initModel,
  type LiveCase,
  liveSandbox,
  type Obj,
  obj,
  PROMPT,
  runPrint,
  sumTokens,
} from "./harness.ts";

const ID = "context-budget";

const addUsage = (data: Record<string, Data>, p: string, c: Obj | null) => {
  if (!c) return;
  data[`${p}.total_tokens`] = Number(c["total_tokens"] ?? -1);
  for (const k of arr(c["categories"])) {
    const cat = obj(k);
    if (cat["kind"] !== "free")
      data[`${p}.category.${String(cat["name"])}`] = Number(cat["tokens"] ?? 0);
  }
  data[`${p}.memory_files`] = arr(c["memory_files"]).map(
    (m) =>
      `${String(obj(m)["path"] ?? obj(m)["name"] ?? "?")
        .split("/")
        .pop()}:${String(obj(m)["tokens"])}`,
  );
  data[`${p}.agents.tokens`] = sumTokens(arr(c["agents"]));
  data[`${p}.mcp_tools.tokens`] = sumTokens(arr(c["mcp_tools"]));
  data[`${p}.skills.count`] = arr(c["skills"]).length;
};

export const contextBudget: LiveCase = {
  id: ID,
  title: "context budget (empty /context, then 'OK' and --continue /context)",
  coldSensitive: true,
  requests: "1 (default model)",
  run: async (x) => {
    const sb = liveSandbox({ "README.md": "# test\n" });
    try {
      const empty = await runPrint(x, sb, ["-p", "/context"], { caseId: ID });
      const hi = await runPrint(x, sb, ["-p", PROMPT], { caseId: ID });
      const cx = await runPrint(x, sb, ["-p", "--continue", "/context"], {
        caseId: ID,
      });
      const usage = firstUsage(hi.events);
      const ce = contextUsage(empty.events);
      const ca = contextUsage(cx.events);
      const ok = ce !== null && ca !== null;
      const data: Record<string, Data> = {
        precondition: ok,
        ...(ok
          ? {}
          : {
              "precondition.detail": `no context_usage in ${ce ? "" : "empty "}${ca ? "" : "after "}/context output`,
            }),
        model: initModel(hi.events) || initModel(empty.events),
        "hi.input_tokens": Number(usage?.["input_tokens"] ?? -1),
        "hi.cache_creation_input_tokens": Number(
          usage?.["cache_creation_input_tokens"] ?? -1,
        ),
        "hi.cache_read_input_tokens": Number(
          usage?.["cache_read_input_tokens"] ?? -1,
        ),
      };
      addUsage(data, "empty", ce);
      addUsage(data, "after", ca);
      const warm = warmFromUsage(usage);
      return [
        baseResult(x, ID, {
          args: ["-p /context", "-p", "-p --continue /context"],
          exit: cx.code,
          timedOut: empty.timedOut || hi.timedOut || cx.timedOut,
          data,
          ...(warm !== null ? { cacheWarm: warm } : {}),
          facts: ["context.budget"],
          notes:
            "Default model (data.model is read from the init event), project with README.md only and no CLAUDE.md, as in docs/how-it-works/context-budget.md. /context is a local command, not a model prompt. cacheWarm comes from cache_read_input_tokens of the first reply.",
        }),
      ];
    } finally {
      sb.cleanup();
    }
  },
};
