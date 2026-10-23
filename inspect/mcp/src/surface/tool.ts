// Kind `tool`: the built-in tools, from `baseTools` (tools.ts, the list_tools source), the array that
// `getAllBaseTools` returns. Anchor (checked on 2.1.309, task 1.1): the `getAllBaseTools:` key. `gate` is the
// code of the conditions on the tool's entry, `detail` its own `isEnabled`. baseTools gives no offsets.
// The old `strings` heuristic has no tool list, so there is nothing to compare.
import { Resolver } from "../resolve.ts";
import { baseTools } from "../tools.ts";
import { type Extractor, short, unique } from "./common.ts";

export const extractTools: Extractor = (bundle) => {
  const r = baseTools(bundle, new Resolver());
  return unique(
    r.tools.map((t) => ({
      kind: "tool",
      name: t.name,
      module: r.module,
      offset: null,
      ...(t.when.length > 0 && { gate: t.when.join(" && ") }),
      ...(t.enabled && { detail: short(t.enabled) }),
    })),
  );
};
