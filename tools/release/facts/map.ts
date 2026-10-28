// Read side of facts/map.json for probes: which fact ids does a probe case check? Keeps `facts: []` in a probe
// result and the map in one place. (facts.ts has the checks; this file stays light so probes can import it.)
import { readFileSync } from "node:fs";
import { join } from "node:path";

const MAP_FILE = join(import.meta.dir, "map.json");

/** Fact ids that map.json maps to this case id. */
export const factsForProbe = (caseId: string): string[] => {
  const map = JSON.parse(readFileSync(MAP_FILE, "utf8")) as Record<
    string,
    { probes: string[] }
  >;
  return Object.entries(map)
    .filter(([, e]) => e.probes.includes(caseId))
    .map(([id]) => id);
};
