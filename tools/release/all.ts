// `release:all`: the automatic steps of the runbook, in order, each as its own `cli.ts` child process so every
// step records itself in run.json. Never runs probe:managed or probe:live: those are printed as "needs you".
import { join } from "node:path";
import { type Ctx, exitCodeOf } from "./util.ts";

const CLI = join(import.meta.dir, "cli.ts");

// prompts gets --no-render: render.ts rewrites docs/prompts, and `all` must not edit docs pages on its own.
// `soft` steps do not stop the run: a flaky pty case must still yield a facts worklist. They fail the run at the end.
// `facts --check` writes nothing and fails only on unmapped facts; its print.sweep warnings keep exit 0.
type Step = { name: string; extra: string[]; soft?: boolean };
const STEPS: Step[] = [
  { name: "check", extra: [] },
  { name: "schemas", extra: [] },
  { name: "diff", extra: [] },
  { name: "clean", extra: [] },
  { name: "prompts", extra: ["--no-render"] },
  { name: "probe:print", extra: [], soft: true },
  { name: "probe:pty", extra: [], soft: true },
  { name: "facts", extra: ["--check"], soft: true },
  { name: "facts", extra: [] },
  { name: "compare", extra: [] },
];
const ALLOWED = new Set(["--from", "--to", "--dry"]);

export const runAll = async (ctx: Ctx): Promise<number> => {
  // --from and --to take a value, so skip the token after each
  const bad = ctx.rest.filter(
    (a, i) =>
      !ALLOWED.has(a) &&
      !(i > 0 && (ctx.rest[i - 1] === "--from" || ctx.rest[i - 1] === "--to")),
  );
  if (bad.length) {
    console.error(
      `release:all: unsupported argument(s): ${bad.join(" ")}. Only --from, --to and --dry are accepted.`,
    );
    return 2;
  }
  if (!ctx.to) {
    console.error(
      "release:all: no --to version and no installed version found",
    );
    return 1;
  }
  const common = [
    "--from",
    ctx.from,
    "--to",
    ctx.to,
    ...(ctx.dry ? ["--dry"] : []),
  ];
  const label = (s: Step) => [s.name, ...s.extra].join(" ");
  const hint = (s: Step) =>
    `  bun run release:${s.name} -- ${common.join(" ")}${s.name === "prompts" ? " --no-render" : s.extra.length ? ` ${s.extra.join(" ")}` : ""}`;
  const failed: { step: Step; code: number }[] = [];
  for (const [i, step] of STEPS.entries()) {
    console.log(`\n== release:all ${i + 1}/${STEPS.length}: ${label(step)} ==`);
    const r = Bun.spawnSync(
      [process.execPath, CLI, step.name, ...common, ...step.extra],
      {
        cwd: join(import.meta.dir, "..", ".."),
        stdout: "inherit",
        stderr: "inherit",
      },
    );
    const code = exitCodeOf(label(step), r);
    if (code === 0) continue;
    if (step.soft) {
      failed.push({ step, code });
      console.error(
        `\nrelease:all: ${label(step)} exited ${code}; going on so the worklist still gets built.`,
      );
      continue;
    }
    console.error(`\nrelease:all stopped: ${label(step)} exited ${code}.`);
    console.error("Fix it, then run the remaining steps by hand:");
    for (const s of STEPS.slice(i)) console.error(hint(s));
    return code;
  }
  if (failed.length) {
    console.error(
      `\nrelease:all: failed steps: ${failed.map((f) => `${label(f.step)} (exit ${f.code})`).join(", ")}.`,
    );
    console.error("Fix and re-run these by hand:");
    for (const f of failed) console.error(hint(f.step));
    return failed[0]?.code ?? 1;
  }
  console.log(
    "\nrelease:all: automatic steps done. Needs you (not run by `all`):",
  );
  console.log("  bun run release:probe:managed");
  console.log("  bun run release:probe:live");
  return 0;
};
