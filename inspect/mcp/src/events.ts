// Finds the OpenTelemetry events of the program: each call of the event emitter, by event name, with the
// entries of its attributes object. tools/schemas/code.ts and the cc-inspect server both read events here.
import type { Bundle, CallNode, Module, Node } from "./ast.ts";
import type { Entry, Resolver } from "./resolve.ts";

const esc = (id: string) => id.replace(/\$/g, "\\$");

/** Local names under which a module imports `exportName` from the chunk `chunk`. */
export const aliasesOf = (
  src: Module,
  chunk: string,
  exportName: string,
): string[] => {
  const out: string[] = [];
  const re = new RegExp(
    `import\\{([^}]*)\\}from"/\\$bunfs/root/${esc(chunk).replace(/\./g, "\\.")}"`,
    "g",
  );
  for (const m of src.text.matchAll(re))
    for (const item of (m[1] as string).split(",")) {
      const [a, b] = item.trim().split(/\s+as\s+/);
      if (a === exportName) out.push(b ?? a);
    }
  return out;
};

/** The call whose argument list opens at the `(` at index `open`. */
export const callAt = (src: Module, open: number): CallNode | undefined => {
  for (let n: Node | undefined = src.nodeAt(open); n; n = src.parent(n))
    if (n.type === "CallExpression" && (n.callee as Node).end <= open)
      return n as CallNode;
  return undefined;
};

/** Entries of an argument: an object literal, or the object a name holds. */
export const argEntries = (
  R: Resolver,
  src: Module,
  a: Node | undefined,
): Entry[] | undefined =>
  a?.type === "ObjectExpression"
    ? R.entries(src, a)
    : a?.type === "Identifier"
      ? R.ident(src, a)
      : undefined;

/**
 * Every call of the event emitter (`async function f(name, attrs){...{...base(),"event.name":...`), by
 * event name: one list of attribute entries per call site, with spreads pinned.
 */
export const eventSites = (
  bundle: Bundle,
  R: Resolver,
): Map<string, Entry[][]> => {
  const [eSrc, ...more] = bundle.withText('"event.sequence"');
  if (!eSrc || more.length) throw new Error("event emitter module not found");
  const eFn =
    /async function ([\w$]+)\([^)]*\)\{[^{}]*\{\.\.\.[\w$]+\(\),"event\.name":/.exec(
      eSrc.text,
    );
  if (!eFn) throw new Error("event emitter not found");
  const fn = eFn[1] as string;
  const events = new Map<string, Entry[][]>();
  for (const m of bundle.modules.values()) {
    const names = m === eSrc ? [fn] : aliasesOf(m, eSrc.name, fn);
    for (const nm of names)
      for (const hit of m.text.matchAll(
        new RegExp(`(?<![\\w$.])${esc(nm)}\\("([a-z_]+)"`, "g"),
      )) {
        const call = callAt(m, hit.index + nm.length);
        const entries =
          argEntries(R, m, call?.arguments[1] as Node | undefined) ?? [];
        const name = hit[1] as string;
        events.set(name, [...(events.get(name) ?? []), R.pin(entries)]);
      }
  }
  return events;
};
