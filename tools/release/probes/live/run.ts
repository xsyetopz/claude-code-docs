// Entry executed INSIDE tools/release/secret-runner.sh (or with the fake token for --dry). Do not run it by hand.
// Reads the token from its own env (liveToken), runs the selected live cases one at a time, writes
// captures/<v>/live/<case>.json. One attempt per case, no retry. Prints one line per case and no secret.
import { existsSync, mkdtempSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { maybeWarm, recordLiveRun } from "../../lib/cache.ts";
import { binaryPath } from "../../lib/env.ts";
import { DRY_TOKEN, liveToken } from "../../lib/live-env.ts";
import { allocPort } from "../../lib/ports.ts";
import {
  type CaseResult,
  openRun,
  redact,
  writeCase,
} from "../../lib/results.ts";
import { startStub } from "../../lib/stub.ts";
import { parseCtx } from "../../util.ts";
import { pick } from "./cases.ts";
import { baseResult, type LiveCtx, scrubResult } from "./harness.ts";

const main = async (): Promise<number> => {
  const ctx = parseCtx(process.argv.slice(2));
  if (!ctx.to) throw new Error("no --to given and no installed binary found");
  const token = liveToken();
  if (ctx.dry && token !== DRY_TOKEN)
    throw new Error(
      "--dry only runs with the fake dry token; refusing a real one",
    );
  if (!ctx.dry && token === DRY_TOKEN)
    throw new Error("the fake dry token cannot be used for a live run");
  const bin = binaryPath(ctx.to);
  if (!existsSync(bin)) throw new Error(`binary missing: ${bin}`);
  const cases = pick(ctx.only);
  if (!cases.length) {
    console.log(`no case matches --only ${ctx.only?.join(",")}`);
    return 2;
  }
  const tmp = ctx.dry
    ? realpathSync(mkdtempSync(join(tmpdir(), "ccrel-livedry-")))
    : "";
  const runDir = ctx.dry ? tmp : openRun(ctx.to);
  const suspectWarm = !ctx.dry && maybeWarm(ctx.to);
  const stub = ctx.dry ? startStub(await allocPort()) : undefined;
  const x: LiveCtx = {
    version: ctx.to,
    bin,
    runDir,
    token,
    dry: ctx.dry,
    ...(stub
      ? {
          stub,
          stubBase: (id: string) =>
            stub.register(id, { log: join(tmp, `${id}.jsonl`) }),
        }
      : {}),
  };
  console.log(
    `release:probe:live ${ctx.to}${ctx.dry ? " (dry, fake token, local stub)" : ""}`,
  );
  let invalid = 0;
  // Record before the first real case so an abort still counts as a run (the cache may be warm after it).
  if (!ctx.dry) recordLiveRun(ctx.to);
  try {
    for (const c of cases) {
      let results: CaseResult[];
      try {
        results = await c.run(x);
      } catch (e) {
        results = [
          baseResult(x, c.id, {
            facts: {
              precondition: false,
              error: redact(`case failed: ${(e as Error).message}`).slice(
                0,
                300,
              ),
            },
          }),
        ];
      }
      for (const r00 of results) {
        const r0 = scrubResult(r00);
        const r: CaseResult =
          c.coldSensitive && suspectWarm && r0.cacheWarm === undefined
            ? {
                ...r0,
                cacheWarm: true,
                notes:
                  `${r0.notes ?? ""} Previous live run under 1 h ago: cache may be warm.`.trim(),
              }
            : r0;
        writeCase(runDir, r);
        const bad = r.facts["precondition"] === false;
        if (bad) invalid++;
        const why = bad
          ? ` (${String(r.facts["error"] ?? r.facts["precondition.detail"] ?? "")})`
          : "";
        const warm =
          r.cacheWarm === undefined ? "" : r.cacheWarm ? " cacheWarm" : " cold";
        if (ctx.dry) console.log(`      facts: ${JSON.stringify(r.facts)}`);
        console.log(`  ${bad ? "INVALID" : "ok     "} ${r.id}${warm}${why}`);
      }
    }
  } finally {
    stub?.stop();
    if (tmp) rmSync(tmp, { recursive: true, force: true });
  }
  if (!ctx.dry) recordLiveRun(ctx.to);
  console.log(
    `${cases.length} case(s), ${invalid} invalid probe(s)${ctx.dry ? " (dry: invalid cases only show the fake token is not a real login)" : ""}`,
  );
  return ctx.dry ? 0 : invalid ? 1 : 0;
};

try {
  process.exit(await main());
} catch (e) {
  console.error(`release:probe:live: ${redact((e as Error).message)}`);
  process.exit(1);
}
