// Design D9 of release-2-1-309-full-surface: when a plugin `bin/` program runs from the Bash tool, is
// CLAUDE_PLUGIN_DATA set? Decides which cache folder the clawdipedia CLI uses there.
import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import type { CaseResult } from "../../lib/results.ts";
import {
  baseResult,
  dispose,
  oneCase,
  readIf,
  runCase,
  toolResults,
} from "./run.ts";
import type { PrintGroup } from "./types.ts";

const ID = "print.plugindata.bash-bin";
// Writes the two plugin variables of its own environment to the file named by $1.
const PROBE = `#!/bin/sh
printf 'CLAUDE_PLUGIN_DATA=%s\\nCLAUDE_PLUGIN_ROOT=%s\\n' "\${CLAUDE_PLUGIN_DATA-<unset>}" "\${CLAUDE_PLUGIN_ROOT-<unset>}" > "$1"
`;

/** The value of NAME in a NAME=value file, or null when the file or the line is missing. */
const value = (text: string, name: string): string | null =>
  text.match(new RegExp(`^${name}=(.*)$`, "m"))?.[1] ?? null;

export const plugindata: PrintGroup = {
  id: "plugindata",
  title: "CLAUDE_PLUGIN_DATA for a plugin bin/ program run from Bash",
  run: async (ctx): Promise<CaseResult[]> =>
    oneCase(ctx, ID, async () => {
      const r = await runCase(ctx.bin, {
        tool: "Bash",
        toolInput: {
          command:
            "cc-probe {CFG}/by-name.log; {HOME}/plug/bin/cc-probe {CFG}/by-path.log; " +
            `printf 'CLAUDE_PLUGIN_DATA=%s\\n' "\${CLAUDE_PLUGIN_DATA-<unset>}" > {CFG}/bash.log`,
        },
        args: ["--plugin-dir", "{HOME}/plug", "--allowedTools", "Bash"],
        setup: ({ home }) => {
          const pl = `${home}/plug`;
          mkdirSync(`${pl}/.claude-plugin`, { recursive: true });
          mkdirSync(`${pl}/bin`, { recursive: true });
          writeFileSync(
            `${pl}/.claude-plugin/plugin.json`,
            JSON.stringify({ name: "pdprobe", version: "1.0.0" }),
          );
          writeFileSync(`${pl}/bin/cc-probe`, PROBE);
          chmodSync(`${pl}/bin/cc-probe`, 0o755);
        },
      });
      try {
        const byName = readIf(`${r.sb.cfg}/by-name.log`);
        const byPath = readIf(`${r.sb.cfg}/by-path.log`);
        const bash = readIf(`${r.sb.cfg}/bash.log`);
        const data = value(byPath, "CLAUDE_PLUGIN_DATA");
        return baseResult(ctx, ID, r, {
          facts: {
            precondition: r.code === 0 && toolResults(r) >= 1 && byPath !== "",
            "bin.onPath": byName !== "",
            "bin.pluginDataSet": data !== null && data !== "<unset>",
            "bin.pluginRootSet":
              (value(byPath, "CLAUDE_PLUGIN_ROOT") ?? "<unset>") !== "<unset>",
            "bash.pluginDataSet":
              (value(bash, "CLAUDE_PLUGIN_DATA") ?? "<unset>") !== "<unset>",
          },
          samples: { byName, byPath, bash },
        });
      } finally {
        dispose(r);
      }
    }),
};
