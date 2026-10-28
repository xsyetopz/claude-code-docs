// Result and negative checks of release:check --selftest: the facts a result lists, refused secrets and paths.
import { join } from "node:path";
import { factsForProbe } from "../facts/map.ts";
import { childEnv, PROMPT } from "../lib/env.ts";
import { openRun, readRun, writeCase } from "../lib/results.ts";
import { makeSandbox } from "../lib/sandbox.ts";
import { readLog, type startStub } from "../lib/stub.ts";
import type { Ctx } from "../util.ts";

export type ResultChecks = {
  ctx: Ctx;
  step: (name: string, ok: boolean, detail?: string) => void;
  sb: ReturnType<typeof makeSandbox>;
  stub: ReturnType<typeof startStub>;
  stubPort: number;
  out: string;
  /** the run dir that openRun made for the smoke case */
  dir: string;
};

export const runResultChecks = async (c: ResultChecks): Promise<void> => {
  const { ctx, step, sb, stub, stubPort, out, dir } = c;
  // a probe result lists the facts that map.json maps to its case, without each probe asking
  const mapped = factsForProbe("print.control.requests");
  writeCase(openRun("0.0.1", out), {
    schema: 1,
    id: "print.control.requests",
    group: "print",
    version: ctx.to,
    prompt: PROMPT,
    args: [],
    envSet: [],
    exit: 0,
    timedOut: false,
    data: {},
    facts: ["control.own"],
  });
  const listed = readRun("0.0.1", out)[0]?.facts ?? [];
  step(
    "writeCase adds the map.json facts of the case",
    mapped.length > 0 &&
      [...mapped, "control.own"].every((c) => listed.includes(c)),
    `${listed.length} listed, ${mapped.length} mapped`,
  );
  let refused = false;
  try {
    writeCase(dir, {
      schema: 1,
      id: "print.selftest.leak",
      group: "print",
      version: ctx.to,
      prompt: PROMPT,
      args: [],
      envSet: [],
      exit: 0,
      timedOut: false,
      data: { k: "sk-ant-oat01-abcdef" },
      facts: [],
    });
  } catch {
    refused = true;
  }
  step("writeCase refuses secret-shaped strings", refused);

  // Cheap negative checks.
  const base = {
    home: sb.home,
    configDir: sb.cfg,
    baseUrl: "http://127.0.0.1:1/x",
  };
  const throws = (f: () => unknown): boolean => {
    try {
      f();
      return false;
    } catch {
      return true;
    }
  };
  step(
    "childEnv accepts *_TOKENS names",
    !throws(() =>
      childEnv({ ...base, extra: { CLAUDE_CODE_MAX_OUTPUT_TOKENS: "9" } }),
    ),
  );
  step(
    "childEnv: extra cannot overwrite fixed keys",
    throws(() => childEnv({ ...base, extra: { HOME: "/x" } })) &&
      !throws(() =>
        childEnv({ ...base, extra: { HOME: "/x" }, allowOverride: ["HOME"] }),
      ),
  );
  step(
    "stub: dotted ids ok, '..' rejected, stray requests logged bad",
    !throws(() =>
      stub.register("print.a.b", { log: join(sb.root, "d.jsonl") }),
    ) &&
      throws(() => stub.register("a..b", { log: join(sb.root, "e.jsonl") })) &&
      (await fetch(`http://127.0.0.1:${stubPort}/nope/v1/messages`, {
        method: "POST",
        body: "{}",
      }).then(() => readLog(stub.strayLog).some((r) => r.bad))),
  );
  step(
    "paths: bad case id and fixture traversal rejected",
    throws(() =>
      writeCase(out, {
        schema: 1,
        id: "../x",
        group: "print",
        version: ctx.to,
        prompt: PROMPT,
        args: [],
        envSet: [],
        exit: 0,
        timedOut: false,
        data: {},
        facts: [],
      }),
    ) && throws(() => makeSandbox({ projFiles: { "../../evil": "x" } })),
  );
};
