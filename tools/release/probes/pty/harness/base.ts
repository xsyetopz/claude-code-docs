// The shared stub of a pty probe run, the {HOME}/{CFG}/{PROJ} substitution, and the base case result.
import { PROMPT } from "../../../lib/env.ts";
import { allocPort } from "../../../lib/ports.ts";
import type { CaseResult, Data } from "../../../lib/results.ts";
import type { Sandbox } from "../../../lib/sandbox.ts";
import { type LoggedRequest, type Stub, startStub } from "../../../lib/stub.ts";
import type { PtyCase, PtyCtx } from "./types.ts";

let stubP: Promise<Stub> | null = null;
export const getStub = (): Promise<Stub> => {
  stubP ??= allocPort().then((p) => startStub(p));
  return stubP;
};
export const stopStub = async (): Promise<LoggedRequest[]> => {
  const p = stubP;
  stubP = null;
  return p ? (await p).stop() : [];
};

export const subst = (s: string, sb: Sandbox): string =>
  s
    .split("{HOME}")
    .join(sb.home)
    .split("{CFG}")
    .join(sb.cfg)
    .split("{PROJ}")
    .join(sb.proj);

export const baseResult = (
  ctx: PtyCtx,
  c: Pick<PtyCase, "id" | "facts" | "notes" | "promptReason">,
  o: Partial<CaseResult> & { data: Record<string, Data> },
): CaseResult => ({
  schema: 1,
  id: `pty.${c.id}`,
  group: "pty",
  version: ctx.version,
  prompt: PROMPT,
  args: [],
  envSet: [],
  exit: null,
  timedOut: false,
  facts: c.facts ?? [],
  ...o,
  ...(c.promptReason || c.notes || o.notes
    ? {
        notes: [c.promptReason, c.notes, o.notes].filter(Boolean).join(" "),
      }
    : {}),
});
