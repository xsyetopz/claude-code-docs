// Run: bun test tools/release/lib/env.test.ts
import { expect, test } from "bun:test";
import { childEnv } from "./env.ts";

test("childEnv turns off the AWS instance metadata lookup, which the dead proxy does not stop", () => {
  const env = childEnv({
    home: "/x",
    configDir: "/x",
    baseUrl: "http://127.0.0.1:1/x",
  });
  expect(env["AWS_EC2_METADATA_DISABLED"]).toBe("true");
});
