// --disable-slash-commands (ported from p305-print dsc.ts, dsc2.ts, dsc3.ts).
import {
  bodyOf,
  type CaseDef,
  fixed,
  json,
  msgs,
  type Run,
  runCases,
  toolNames,
  withRun,
} from "./harness-b.ts";
import type { PrintGroup } from "./types.ts";

const bytes = (s: string) => Buffer.byteLength(s);
const measure = (r: Run) => {
  const q = msgs(r)[0];
  if (!q) return null;
  const b = bodyOf(q);
  const fx = (v: unknown) => fixed(r, json(v));
  const tools = Object.fromEntries(
    (b.tools ?? []).map((t) => [t.name, bytes(fx(t))]),
  );
  const first =
    (b.messages?.[1]?.content as { text?: string }[] | undefined)?.[0]?.text ??
    "";
  const a = first.indexOf("The following skills");
  const e = first.indexOf("\n\nToday's date");
  return {
    total: bytes(fx(b)),
    system: bytes(fx(b.system)),
    messages: bytes(fx(b.messages)),
    nTools: (b.tools ?? []).length,
    tools,
    skillsSection: a >= 0 && e > a ? bytes(fixed(r, first.slice(a, e))) : 0,
    toolNames: toolNames(q),
  };
};

const sizes: CaseDef = {
  name: "sizes",
  run: async (ctx) => {
    const off = await withRun(ctx, {}, (r) => ({ r, m: measure(r) }));
    const on = await withRun(
      ctx,
      { args: ["--disable-slash-commands"] },
      (r) => ({
        r,
        m: measure(r),
      }),
    );
    const a = off.m;
    const b = on.m;
    return {
      from: on.r,
      args: ["--disable-slash-commands"],
      facts: {
        precondition: !!a && !!b,
        baseTotalBytes: a?.total ?? null,
        flagTotalBytes: b?.total ?? null,
        deltaBytes: a && b ? b.total - a.total : null,
        baseSystemBytes: a?.system ?? null,
        flagSystemBytes: b?.system ?? null,
        baseMessagesBytes: a?.messages ?? null,
        flagMessagesBytes: b?.messages ?? null,
        baseTools: a?.nTools ?? null,
        flagTools: b?.nTools ?? null,
        skillToolBytes: a?.tools["Skill"] ?? null,
        baseWorkflowToolBytes: a?.tools["Workflow"] ?? null,
        flagWorkflowToolBytes: b?.tools["Workflow"] ?? null,
        skillsSectionBytes: a?.skillsSection ?? null,
        removedTools:
          a && b ? a.toolNames.filter((n) => !b.toolNames.includes(n)) : null,
      },
      notes:
        "Two runs: baseline and --disable-slash-commands; args/exit shown are the flag run.",
    };
  },
};

export const dsc: PrintGroup = {
  id: "dsc",
  title: "--disable-slash-commands request size",
  run: (ctx) => runCases(ctx, "dsc", [sizes]),
};
