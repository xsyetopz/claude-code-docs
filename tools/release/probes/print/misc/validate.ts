// Plugin validate probes: a plugin.json with each kind of version value.
import { mkdirSync, writeFileSync } from "node:fs";
import { type CaseDef, withRun } from "../run/helpers.ts";

export const VALIDATE: [string, string, string?][] = [
  ["string", '"banana"'],
  ["number", "1"],
  ["empty-string", '""'],
  ["semver", '"1.2.3"'],
  ["null", "null"],
  ["array", "[1]"],
  ["empty-string-with-author", '""', ',"author":{"name":"a"}'],
];
export const validateCase = ([
  name,
  ver,
  extra,
]: (typeof VALIDATE)[number]): CaseDef => ({
  name: `plugin-validate.version-${name}`,
  run: (ctx) =>
    withRun(
      ctx,
      {
        argv: ["plugin", "validate", "{HOME}/pl"],
        noPrompt: true,
        setup: ({ home }) => {
          const p = `${home}/pl`;
          mkdirSync(`${p}/.claude-plugin`, { recursive: true });
          writeFileSync(
            `${p}/.claude-plugin/plugin.json`,
            `{"name":"pp","version":${ver},"description":"x"${extra ?? ""}}`,
          );
        },
      },
      (r) => {
        const t = (r.stdout + r.stderr).replace(/\s+/g, " ");
        return {
          from: r,
          facts: {
            precondition: t.includes("Validating plugin manifest"),
            exit: r.code,
            errors: t.match(/Found (\d+) errors?/)?.[1] ?? "0",
            warnings: t.match(/Found (\d+) warnings?/)?.[1] ?? "0",
            problems: t.match(/Found (\d+) problems?/)?.[1] ?? "0",
          },
          samples: {
            output: t.replace(/\/\S+\/\.claude-plugin/g, "<P>/.claude-plugin"),
          },
        };
      },
    ),
});
