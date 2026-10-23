// Kind `slash-command`: the built-in slash commands.
// Anchor (checked on 2.1.309, task 1.1): an object literal with `type` "local", "local-jsx", or "prompt"
// and a constant `name` (`{type:"local",name:"compact",description:"Free up context…",isEnabled:()=>…}`).
// Also a constant `name` in the object passed to a builder whose body makes such an object from it
// (`M7t({name:"security-review",…})` with `function M7t({name:e}){return{type:"prompt",name:e,…}}`, and
// the bundled-skill registrar `Ui({name:"simplify",…})`). Plugin, skill, and MCP commands build
// `name:e.name` at run time and are not built-in items. `aliases` go into `detail`; `isHidden:!0`,
// `availability:[...]`, and `isEnabled` go into `gate`.
// Compared with the old `strings` heuristic on 2.1.309: 142 commands, 162 old names.
// - Only here (64): commands whose `description` does not follow `name` as a literal (`/init`,
//   `/login`, `/resume`, ...), and the bundled skills (`/simplify`, `/loop`, `/keybindings-help`).
// - Only there (84), none a slash command: computer-use and browser actions (`/left_click`,
//   `/navigate`, `/app_*`), tool names (`/bash`, `/read`, `/grep`), shell completion specs (`/alias`,
//   `/srun`, `/sleep`, `/count`), MCP tools (`/scan_secrets`), mod capability docs (`/cc-plugin-*`),
//   and a template name (`/bg`). Known names absent from both: `/cost` and `/review` are aliases of
//   `/usage` and `/code-review`; `/vim` is not in 2.1.309.
import type * as ES from "estree";
import {
  children,
  constString,
  functionOf,
  type Module,
  type Node,
} from "../ast.ts";
import {
  type Extractor,
  keyOf,
  prop,
  type SurfaceItem,
  scan,
  short,
  strings,
  unique,
} from "./common.ts";

const TYPES = new Set(["local", "local-jsx", "prompt"]);
const NAME = /^[a-z][\w:-]*$/;

/** The command type a builder gives its argument: its body holds `{type:"prompt",name:p.name,...}` for its first parameter `p`. */
const builderType = (m: Module, call: Node): string | undefined => {
  if (call.type !== "CallExpression") return undefined;
  const f = functionOf(m, call.callee as Node);
  const p = f?.fn.params[0];
  if (!f || !p) return undefined;
  const known = builders.get(f.fn);
  if (known !== undefined) return known || undefined;
  // `p.name` for `function(p)`, or `e` for `function({name:e})`
  const nameSrc =
    p.type === "Identifier"
      ? `${p.name}.name`
      : p.type === "ObjectPattern"
        ? (() => {
            const v = p.properties.find(
              (x): x is ES.AssignmentProperty =>
                x.type === "Property" && keyOf(x) === "name",
            )?.value;
            return v?.type === "Identifier" ? v.name : undefined;
          })()
        : undefined;
  let found = "";
  const stack: Node[] = [f.fn.body as Node];
  while (stack.length && !found && nameSrc) {
    const n = stack.pop() as Node;
    if (n.type === "ObjectExpression") {
      const t = constString(
        f.module,
        prop(n, "type")?.value as Node | undefined,
      );
      const v = prop(n, "name")?.value as Node | undefined;
      if (t && TYPES.has(t) && v && f.module.src(v) === nameSrc) found = t;
    }
    stack.push(...children(n));
  }
  builders.set(f.fn, found);
  return found || undefined;
};
const builders = new WeakMap<object, string>();

export const extractSlashCommands: Extractor = (bundle) => {
  const out: SurfaceItem[] = [];
  scan(bundle, ["name:"], (m, n) => {
    if (n.type !== "ObjectExpression") return;
    const o = n as ES.ObjectExpression;
    const name = constString(m, prop(o, "name")?.value as Node | undefined);
    if (!name || !NAME.test(name)) return;
    const parent = m.parent(n);
    const type =
      constString(m, prop(o, "type")?.value as Node | undefined) ??
      (parent?.type === "CallExpression" &&
      parent.arguments[0] === (n as unknown)
        ? builderType(m, parent)
        : undefined);
    if (!type || !TYPES.has(type)) return;
    const desc = constString(
      m,
      prop(o, "description")?.value as Node | undefined,
    );
    const aliases = strings(m, prop(o, "aliases")?.value as Node | undefined);
    const gates: string[] = [];
    if (
      /^(!0|true)$/.test(
        m.src((prop(o, "isHidden")?.value as Node | undefined) ?? n).trim(),
      )
    )
      gates.push("hidden");
    const avail = strings(
      m,
      prop(o, "availability")?.value as Node | undefined,
    );
    if (avail) gates.push(`availability ${avail.join(", ")}`);
    const enabled = prop(o, "isEnabled")?.value as Node | undefined;
    if (enabled) gates.push(`isEnabled ${short(m.src(enabled), 120)}`);
    out.push({
      kind: "slash-command",
      name: `/${name}`,
      module: m.name,
      offset: n.start,
      detail: short(
        `${type}${aliases?.length ? ` (aliases ${aliases.join(", ")})` : ""}${desc ? ` | ${desc}` : ""}`,
      ),
      ...(gates.length && { gate: gates.join("; ") }),
    });
  });
  return unique(out);
};
