import { expect, test } from "bun:test";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { DOCS } from "./ctx.ts";
import { GROUPS } from "./groups.ts";

// Docusaurus routes docs/prompts/<group>/<group>.md to /prompts/<group>, the same route a
// generated index of that category claims. Two pages on one route fail the build, so the category
// of such a group must link the page. loadHand() deletes the generated page before
// writeCategories() runs, so the flag cannot come from the disk.
test("a group whose folder holds a page named after it is marked ownPage", () => {
  const onDisk = GROUPS.filter((g) =>
    readdirSync(join(DOCS, g.id)).includes(`${g.id}.md`),
  ).map((g) => g.id);
  const marked = GROUPS.filter((g) => g.ownPage).map((g) => g.id);
  expect(marked.sort()).toEqual(onDisk.sort());
});

test("every group id is a folder of docs/prompts", () => {
  const dirs = readdirSync(DOCS, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
  for (const g of GROUPS) expect(dirs).toContain(g.id);
});
