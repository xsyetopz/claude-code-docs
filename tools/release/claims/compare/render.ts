// compare.md and the diff/*.json reader of release:compare.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Compare } from "./types.ts";

export const DIFF_FILES = [
  "strings-env.json",
  "flags.json",
  "commands.json",
  "settings.json",
  "hooks.json",
  "gates.json",
];
export type DiffJson = {
  kind: string;
  added?: string[];
  removed?: string[];
  changed?: { name: string }[];
};
export const readDiffs = (dir: string): DiffJson[] =>
  DIFF_FILES.map((f) => join(dir, "diff", f))
    .filter((p) => existsSync(p))
    .map((p) => JSON.parse(readFileSync(p, "utf8")) as DiffJson);

const fmt = (v: unknown): string => {
  const s = JSON.stringify(v);
  return s.length > 80 ? `${s.slice(0, 77)}...` : s;
};

export const renderCompare = (c: Compare): string => {
  const L: string[] = [`# Compare ${c.from} to ${c.to}`, ""];
  if (c.warning) L.push(`> **WARNING:** ${c.warning}`, "");
  const work = (c.claims ?? []).filter(
    (x) =>
      x.result === "changed" ||
      x.result === "not-run" ||
      x.result === "invalid-run",
  );
  if (c.counts.invalid)
    L.push(
      `> **${c.counts.invalid} invalid runs - re-run these cases, do not edit docs from them:** ${Object.keys(
        c.invalidRuns ?? {},
      )
        .map((i) => `\`${i}\``)
        .join(", ")}`,
      "",
    );
  L.push("## Worklist", "");
  if (c.claims) {
    L.push(`Claims to re-check: ${work.length} of ${c.claims.length}.`, "");
    for (const r of work)
      L.push(
        `- ${r.result}: \`${r.id}\` (${r.file}:${r.line}, ${r.kind ?? "?"})${r.why ? ` - ${r.why}` : ""}`,
      );
  } else L.push("No claims.json for this version: run `release:claims` first.");
  L.push("");
  if (c.uncoveredNames) {
    L.push(
      `New names in diff/ that no claim covers: ${c.uncoveredNames.length}.`,
      "",
    );
    for (const n of c.uncoveredNames.slice(0, 80))
      L.push(`- ${n.kind}: \`${n.name}\``);
    if (c.uncoveredNames.length > 80)
      L.push(`- ... ${c.uncoveredNames.length - 80} more (see the JSON)`);
    L.push("");
  }
  L.push(
    "## Cases",
    "",
    `${c.counts.cases} in both, ${c.counts.changed} changed, ${c.counts.unchanged} unchanged, ${c.counts.invalid} invalid runs, ${c.onlyFrom.length} only in ${c.from}, ${c.onlyTo.length} only in ${c.to}.`,
    "",
  );
  for (const [id, why] of Object.entries(c.invalidRuns ?? {}))
    L.push(`### \`${id}\` (invalid run)`, "", `- ${why}`, "");
  for (const [id, d] of Object.entries(c.cases)) {
    L.push(`### \`${id}\``, "");
    for (const [k, v] of Object.entries(d.changed)) {
      const p = [
        ...(v.added ?? []).map((x) => `+${x}`),
        ...(v.removed ?? []).map((x) => `-${x}`),
      ].map((x) => `\`${x.slice(0, 60)}\``);
      L.push(
        `- changed \`${k}\`: ${fmt(v.old)} -> ${fmt(v.new)}${p.length ? ` (${p.join(" ")})` : ""}`,
      );
    }
    for (const [k, v] of Object.entries(d.added))
      L.push(`- added \`${k}\`: ${fmt(v)}`);
    for (const [k, v] of Object.entries(d.removed))
      L.push(`- removed \`${k}\`: ${fmt(v)}`);
    for (const k of Object.keys(d.samples ?? {}))
      L.push(`- sample \`${k}\` differs`);
    L.push("");
  }
  if (c.noise || (c.claims ?? []).some((r) => r.noise))
    L.push(
      "## Noise (ignored)",
      "",
      "Facts that differ but are not release changes (run-to-run noise, or a version string only). Rules: `NOISY` in `tools/release/claims/compare.ts`.",
      "",
      ...Object.entries(c.noise ?? {}).flatMap(([id, m]) =>
        Object.entries(m).map(([k, why]) => `- \`${id}\` \`${k}\`: ${why}`),
      ),
      ...(c.claims ?? []).flatMap((r) =>
        Object.entries(r.noise ?? {}).flatMap(([id, m]) =>
          Object.entries(m).map(
            ([k, why]) => `- claim \`${r.id}\`: \`${id}\` \`${k}\`: ${why}`,
          ),
        ),
      ),
      "",
    );
  if (c.onlyFrom.length)
    L.push(
      `## Only in ${c.from}`,
      "",
      ...c.onlyFrom.map((i) => `- \`${i}\``),
      "",
    );
  if (c.onlyTo.length)
    L.push(`## Only in ${c.to}`, "", ...c.onlyTo.map((i) => `- \`${i}\``), "");
  return `${L.join("\n")}\n`;
};
