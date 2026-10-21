// Temp HOME / config dir / project dir for one child run. Everything is under mkdtemp + realpath
// (macOS /var vs /private/var matters for trusted-project keys). cleanup() only removes what this process made.
import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve, sep } from "node:path";
import { onCleanup } from "./cleanup.ts";
import { FAKE_KEY } from "./env.ts";
import { writeSecurityShim } from "./shim.ts";

export type Files = Record<string, string>;
export type Sandbox = {
  root: string;
  home: string;
  cfg: string;
  proj: string;
  cleanup(): void;
};
export type SandboxOpts = {
  cfgFiles?: Files;
  projFiles?: Files;
  homeFiles?: Files; // {HOME} {CFG} {PROJ} placeholders in contents
  git?: boolean;
  trusted?: boolean;
  seedOnboarding?: boolean;
  live?: boolean; // no pre-approved fake key in .claude.json (live runs use the OAuth env var)
};

const made = new Set<string>();
onCleanup(() => {
  for (const p of made) rmSync(p, { recursive: true, force: true });
});

export const subst = (
  s: string,
  sb: { home: string; cfg: string; proj: string },
): string =>
  s
    .split("{HOME}")
    .join(sb.home)
    .split("{CFG}")
    .join(sb.cfg)
    .split("{PROJ}")
    .join(sb.proj);

export const makeSandbox = (opts: SandboxOpts = {}): Sandbox => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "ccrel-")));
  made.add(root);
  const home = join(root, "home");
  const cfg = join(root, "cfg");
  const proj = join(root, "proj");
  for (const d of [home, cfg, proj, join(home, "tmp")])
    mkdirSync(d, { recursive: true });
  writeSecurityShim(home);
  const sb = { home, cfg, proj };
  for (const [base, files] of [
    [cfg, opts.cfgFiles],
    [proj, opts.projFiles],
    [home, opts.homeFiles],
  ] as const)
    for (const [k, v] of Object.entries(files ?? {})) {
      const target = resolve(base, k);
      if (!target.startsWith(base + sep))
        throw new Error(`fixture path escapes its dir: ${k}`);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, subst(v, sb));
    }
  if (opts.git) {
    const g = Bun.spawnSync(["/usr/bin/git", "init", "-q"], {
      cwd: proj,
      env: {
        PATH: "/usr/bin:/bin",
        HOME: home,
        GIT_CONFIG_GLOBAL: join(home, ".gitconfig"),
      },
    });
    if (g.exitCode !== 0) throw new Error("git init failed in sandbox");
  }
  if (opts.seedOnboarding || opts.trusted) {
    // Onboarding done, project trusted, fake key pre-approved. Never oauthAccount or any token.
    const state: Record<string, unknown> = {
      hasCompletedOnboarding: true,
      theme: "dark",
      numStartups: 10,
      ...(opts.live
        ? {}
        : { customApiKeyResponses: { approved: [FAKE_KEY], rejected: [] } }),
    };
    if (opts.trusted)
      state["projects"] = {
        [proj]: {
          hasTrustDialogAccepted: true,
          allowedTools: [],
          hasCompletedProjectOnboarding: true,
        },
      };
    writeFileSync(
      join(cfg, ".claude.json"),
      `${JSON.stringify(state, null, 2)}\n`,
    );
  }
  return {
    root,
    home,
    cfg,
    proj,
    cleanup() {
      rmSync(root, { recursive: true, force: true });
      made.delete(root);
    },
  };
};
