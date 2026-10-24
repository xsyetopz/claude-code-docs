// `release:clean`: cleans both installs with cc-inspect (`inspect/mcp/src/prepare.ts`) into captures/<version>/clean/.
import { extractModules } from "../../inspect/mcp/src/bunfs.ts";
import { prepare } from "../../inspect/mcp/src/prepare.ts";
import { binaryPath, CAPTURES, type Ctx } from "./util.ts";

export const runClean = async (ctx: Ctx): Promise<number> => {
  for (const v of [...new Set([ctx.from, ctx.to])]) {
    const path = binaryPath(v);
    const modules = extractModules(path).modules.map((m) => ({
      name: m.name,
      text: m.source,
    }));
    const r = prepare(v, path, modules, CAPTURES);
    const skipped = Object.keys(r.index.skipped);
    console.log(
      `clean ${v}: ${r.parsed ? `${r.parsed} modules cleaned` : "cached"}, ${r.index.units.length} units, ${r.ms} ms${skipped.length ? `; not JavaScript: ${skipped.join(", ")}` : ""} -> ${r.dir}`,
    );
  }
  return 0;
};
