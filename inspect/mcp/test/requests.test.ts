import { expect, test } from "bun:test";
import { resultText, toolNames } from "../src/requests.ts";
import type { Sent } from "../src/run.ts";

const sent = (path: string, body: unknown): Sent => ({
  method: "POST",
  path,
  host: "127.0.0.1",
  fakeKey: true,
  body,
});

test("toolNames lists the tools of each messages request and skips other requests", () => {
  const names = toolNames({
    requests: [
      sent("/v1/messages?beta=true", {
        tools: [{ name: "Bash" }, { name: "Glob" }],
      }),
      sent("/v1/messages/count_tokens", { tools: [{ name: "Read" }] }),
      sent("/api/oauth/profile", null),
      sent("/v1/messages", { messages: [] }),
    ],
  });
  expect(names).toEqual([["Bash", "Glob"], []]);
});

test("resultText reads the last result event", () => {
  expect(
    resultText({
      events: [
        { type: "result", result: "a" },
        { type: "result", result: "b" },
      ],
    }),
  ).toBe("b");
  expect(resultText({ events: [] })).toBeNull();
});
