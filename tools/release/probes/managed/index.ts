// release:probe:managed - managed-folder probes. Prints the single `sudo` command and the cleanup command; never runs sudo,
// never writes under /Library. The user runs the install script in a second terminal; this tool runs each phase as the
// calling user (fake key, local stub, childEnv) when the script signals that a variant is installed.
// Usage: bun tools/release/cli.ts probe:managed [--to V] [--only a,b] [--dry]
//   --only  phases (baseline, main, true, false), `phase.case`, or the bare case name (classify-neither); the `managed.` prefix is optional
//   --dry   builds the stage in a temp dir, prints the commands and the planned cases, spawns nothing, removes the stage
// Order: baseline phase first (no folder), then the sudo command is printed, then each variant phase as the install script signals it.
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { onCleanup } from "../../lib/cleanup.ts";
import { binaryPath } from "../../lib/env.ts";
import { type CaseResult, openRun, writeCase } from "../../lib/results.ts";
import type { Ctx } from "../../util.ts";
import { stopStub } from "../print/run.ts";
import {
  buildStage,
  MANAGED_DIR,
  MARKER,
  PHASES,
  type Phase,
  VARIANT_FILE,
  VARIANTS,
} from "./fixtures.ts";
import {
  type PhaseCtx,
  phaseSelected,
  runPhase,
  selectedDefs,
} from "./phases.ts";
import { cleanupCommand, installCommand, writeScripts } from "./script.ts";

export type FolderState = "absent" | "ours" | "foreign";
/** Read-only check of the managed folder. "foreign" = exists without our marker: never probe, never remove. */
export const folderState = (dir = MANAGED_DIR): FolderState =>
  !existsSync(dir)
    ? "absent"
    : existsSync(join(dir, MARKER))
      ? "ours"
      : "foreign";

const sleep = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms));
const waitFor = async (ok: () => boolean, ms: number): Promise<boolean> => {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (ok()) return true;
    await sleep(500);
  }
  return ok();
};
/** Read-only: which variant the root script says is installed ("" if none). */
const installedVariant = (): string => {
  try {
    return readFileSync(join(MANAGED_DIR, VARIANT_FILE), "utf8").trim();
  } catch {
    return "";
  }
};

const WAIT_MS = 10 * 60_000;

export const runProbeManaged = async (ctx: Ctx): Promise<number> => {
  if (!ctx.to) throw new Error("no --to given and no installed binary found");
  const bin = binaryPath(ctx.to);
  if (!ctx.dry && !existsSync(bin)) throw new Error(`binary missing: ${bin}`);

  const state = folderState();
  if (state === "foreign") {
    console.error(
      `${MANAGED_DIR} exists and has no ${MARKER} marker. It is not ours; refusing to continue.\nRemove or move it yourself, then rerun.`,
    );
    return 2;
  }

  const stage = realpathSync(mkdtempSync(join(tmpdir(), "ccrel-managed-")));
  const startedLog = join(stage, "started.log");
  writeFileSync(startedLog, "");
  buildStage(stage, startedLog);
  const scripts = writeScripts(stage);
  const pctx: PhaseCtx = {
    version: ctx.to,
    bin,
    startedLog,
    ...(ctx.only ? { only: ctx.only } : {}),
    dry: ctx.dry,
  };
  const phases = PHASES.filter((p) => phaseSelected(pctx, p));
  const needsFolder = phases.some((p) => p !== "baseline");
  let keepStage = false;
  // Any exit (including SIGINT/SIGTERM): tell the root script to stop and show the cleanup command if needed.
  onCleanup(() => {
    try {
      writeFileSync(join(stage, "abort"), "");
    } catch {
      // stage already removed
    }
    if (!ctx.dry && folderState() === "ours")
      console.log(
        `\nThe managed folder is still installed. Remove it:\n\n  ${cleanupCommand(scripts)}\n`,
      );
  });

  console.log(`release:probe:managed ${ctx.to}${ctx.dry ? " (dry)" : ""}`);
  console.log(`stage dir: ${stage}`);
  console.log(
    `managed folder: ${state === "absent" ? "absent" : "left over from an earlier run (ours)"}`,
  );
  if (state === "ours" && phases.includes("baseline")) {
    console.error(
      `A leftover managed folder of ours exists, so the baseline phase is not valid. Remove it first:\n  ${cleanupCommand(scripts)}`,
    );
    return 2;
  }

  const runDir = ctx.dry ? "" : openRun(ctx.to);
  let total = 0;
  let invalid = 0;
  const write = (r: CaseResult): void => {
    total++;
    if (ctx.dry) {
      console.log(`  ${r.id}`);
      return;
    }
    writeCase(runDir, r);
    const bad = r.data["precondition"] === false;
    if (bad) invalid++;
    console.log(
      `  ${bad ? "INVALID" : "ok     "} ${r.id}${bad ? ` (${String(r.data["error"] ?? "")})` : ""}`,
    );
  };
  const truncate = (): void => writeFileSync(startedLog, "");
  const readStarted = (): string[] => [
    ...new Set(
      readFileSync(startedLog, "utf8")
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((l) => l.split(" ")[0] ?? ""),
    ),
  ];
  const doPhase = async (p: Phase): Promise<void> => {
    console.log(`phase ${p}: ${selectedDefs(p, pctx).length} case(s)`);
    const guard = (): string | null => {
      const st = folderState();
      if (p === "baseline")
        return st === "absent"
          ? null
          : `managed folder is ${st}, baseline needs it absent`;
      return st === "ours" && installedVariant() === p
        ? null
        : `managed folder is ${st} (variant "${installedVariant()}"), expected variant ${p}`;
    };
    for (const r of await runPhase(p, pctx, truncate, readStarted, guard))
      write(r);
  };
  const printCommands = (): void => {
    console.log(
      `\nRun this in a second terminal (it asks for your password once; read ${scripts.install} first):\n\n  ${installCommand(scripts)}\n`,
    );
    console.log(
      `Cleanup (the script also does it when it ends; use it if the script was interrupted):\n\n  ${cleanupCommand(scripts)}\n`,
    );
  };

  try {
    if (ctx.dry) {
      if (needsFolder) printCommands();
      console.log(
        "dry: nothing started, nothing installed, stage removed at exit (the commands above only work without --dry). Planned cases:",
      );
      for (const p of phases) await doPhase(p);
      console.log(`${total} case(s) planned`);
      return 0;
    }
    if (phases.includes("baseline")) await doPhase("baseline");
    if (needsFolder) {
      printCommands();
      console.log(
        "Waiting for the install script (it signals each variant; Ctrl-C to stop)...",
      );
      for (const v of VARIANTS) {
        if (!phases.includes(v)) {
          // the script waits for done-V for every variant it installs
          writeFileSync(join(stage, `done-${v}`), "");
          continue;
        }
        if (
          !(await waitFor(
            () => folderState() === "ours" && installedVariant() === v,
            WAIT_MS,
          ))
        ) {
          console.error(`timed out waiting for variant ${v}`);
          invalid++;
          keepStage = true;
          writeFileSync(join(stage, "abort"), "");
          break;
        }
        await doPhase(v);
        writeFileSync(join(stage, `done-${v}`), "");
      }
      // give the script a moment to remove the folder
      for (let i = 0; i < 20 && folderState() === "ours"; i++) await sleep(500);
    }
  } finally {
    const stray = await stopStub();
    if (stray.length) {
      invalid++;
      console.log(
        `STRAY ${stray.length} request(s) reached the stub without a case id`,
      );
    }
    if (!ctx.dry && folderState() === "ours") keepStage = true;
    if (!keepStage) rmSync(stage, { recursive: true, force: true });
    else if (!ctx.dry) console.log(`stage kept: ${stage}`);
  }
  if (!ctx.dry) console.log(`${total} case(s), ${invalid} invalid probe(s)`);
  return invalid && !ctx.dry ? 1 : 0;
};
