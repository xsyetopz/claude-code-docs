// The live case list, in plan order (cold-sensitive first, via planLive).
import { planLive } from "../../lib/cache.ts";
import { artifactsCase } from "./artifacts.ts";
import { contextBudget } from "./context-budget.ts";
import type { LiveCase } from "./harness.ts";
import { oauthParity } from "./oauth-parity.ts";
import { usageCases } from "./usage.ts";

export const LIVE_CASES: LiveCase[] = planLive([
  oauthParity,
  ...usageCases,
  artifactsCase,
  contextBudget,
]);

/** --only: exact id, prefix on dotted segments (usage matches usage.429), with or without the `live.` prefix. */
export const pick = (only: string[] | null): LiveCase[] =>
  LIVE_CASES.filter(
    (c) =>
      !only ||
      only.some((raw) => {
        const o = raw.replace(/^live\./, "");
        return c.id === o || c.id.startsWith(`${o}.`);
      }),
  );
