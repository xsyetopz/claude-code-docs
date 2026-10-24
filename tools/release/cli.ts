// Usage: bun tools/release/cli.ts <command> [--from V] [--to V] [--only a,b] [--dry] [...]
// Runbook: tools/release/README.md. Design: openspec/changes/archive/2026-10-21-release-toolkit/design.md. `all` runs the automatic steps in order.
import { runAll } from "./all.ts";
import { runCheck } from "./check.ts";
import { normaliseArgs } from "./claims/args.ts";
import { runClaims } from "./claims/claims.ts";
import { runCompare } from "./claims/compare.ts";
import { runClean } from "./clean.ts";
import { runDiff } from "./diff/diff.ts";
import { runProbeLive } from "./probes/live/index.ts";
import { runProbeManaged } from "./probes/managed/index.ts";
import { runProbePrint } from "./probes/print/index.ts";
import { runProbePty } from "./probes/pty/index.ts";
import { type Ctx, parseCtx, recordCommand } from "./util.ts";
import { runPrompts, runSchemas } from "./wrap.ts";

type Command = { run: (ctx: Ctx) => Promise<number>; summary: string };

const COMMANDS: Record<string, Command> = {
  check: { run: runCheck, summary: "preflight; writes env.json" },
  diff: {
    run: runDiff,
    summary: "strings diff of --from and --to; writes diff/*",
  },
  clean: {
    run: runClean,
    summary:
      "cc-inspect clean of --from and --to; writes captures/<version>/clean/",
  },
  schemas: {
    run: runSchemas,
    summary: "wrap `bun run schemas`; writes schemas-diff.json",
  },
  prompts: { run: runPrompts, summary: "wrap tools/capture-prompts" },
  "probe:print": {
    run: runProbePrint,
    summary: "print-mode probes against the local stub (--only, --dry)",
  },
  "probe:pty": {
    run: runProbePty,
    summary: "interactive probes through the pty driver (--only, --dry)",
  },
  "probe:live": {
    run: runProbeLive,
    summary:
      "subscription probes via the secret runner; asks first (--only, --dry, --yes)",
  },
  "probe:managed": {
    run: runProbeManaged,
    summary: "managed-folder probes; prints the sudo command (--only, --dry)",
  },
  claims: {
    run: runClaims,
    summary:
      "version-labelled claims in docs/ and their probes (--check, --all); writes claims.json",
  },
  compare: {
    run: runCompare,
    summary:
      "compare <from> <to> [--samples]; writes compare/<from>..<to>.json and compare.md",
  },
  all: {
    run: runAll,
    summary:
      "check, schemas, diff, clean, prompts, probe:print, probe:pty, claims, compare; lists managed/live as needs you",
  },
};

const [name, ...rawArgs] = process.argv.slice(2);
const { args, error: argError } = normaliseArgs(name, rawArgs);
if (argError) {
  console.error(argError);
  process.exit(2);
}
const cmd = name ? COMMANDS[name] : undefined;
if (!name || !cmd) {
  if (name) console.error(`unknown command: ${name}`);
  console.error(
    "usage: bun tools/release/cli.ts <command> [--from V] [--to V] [--only a,b] [--dry]",
  );
  for (const [n, c] of Object.entries(COMMANDS))
    console.error(`  ${n.padEnd(10)} ${c.summary}`);
  process.exit(name ? 2 : 0);
}

const ctx = parseCtx(args);
const startedAt = new Date().toISOString();
let exit = 1;
try {
  exit = await cmd.run(ctx);
} catch (e) {
  console.error(`release:${name}: ${(e as Error).message}`);
}
if (!ctx.dry && ctx.to)
  recordCommand(ctx.to, {
    name,
    args,
    startedAt,
    endedAt: new Date().toISOString(),
    exit,
  });
process.exit(exit);
