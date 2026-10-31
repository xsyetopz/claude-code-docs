// Reads what a run of the program sent and wrote: the tools it offered and the text it printed.
import type { RunResult } from "./run.ts";

const isTurn = (path: string): boolean =>
  path.startsWith("/v1/messages") && !path.includes("count_tokens");

/** The tool names of each Messages API request, in order. Token-count calls and other requests are left out. */
export const toolNames = (r: Pick<RunResult, "requests">): string[][] =>
  r.requests
    .filter((q) => isTurn(q.path))
    .map((q) =>
      ((q.body as { tools?: { name?: unknown }[] } | null)?.tools ?? [])
        .map((t) => t.name)
        .filter((n): n is string => typeof n === "string"),
    );

/** The `result` text of the last stream-json `result` event, where `-p` puts a local command's output, or null. */
export const resultText = (r: Pick<RunResult, "events">): string | null => {
  const last = [...r.events].reverse().find((e) => e["type"] === "result");
  const text = last?.["result"];
  return typeof text === "string" ? text : null;
};
