// Surface 3: OpenTelemetry metrics, spans, and events.
import type { Node } from "../../../inspect/mcp/src/ast.ts";
import {
  aliasesOf,
  argEntries,
  callAt,
  eventSites,
} from "../../../inspect/mcp/src/events.ts";
import { type Entry, mergeEntries } from "../../../inspect/mcp/src/resolve.ts";
import {
  bundle,
  esc,
  fnAround,
  header,
  idx,
  type Json,
  type Mode,
  mods,
  note,
  only,
  props,
  R,
  type Src,
  UNVERIFIED,
  VERSION,
} from "./ctx.ts";
import { objSchema } from "./schema.ts";

const attrsToProps = (
  entries: Entry[] | undefined,
  into: Record<string, Json>,
  mode: Mode = "const",
) => {
  if (!entries) return;
  const s = objSchema(entries, mode);
  for (const [k, v] of Object.entries(props(s)))
    into[k] = into[k] && !into[k]["x-unverified"] ? into[k] : v;
};

export const buildOtel = (): { file: string; schema: Json } => {
  const $defs: Record<string, Json> = {};

  // Base attributes: the keys the metrics/events attribute builder assigns.
  const bSrc = only('["user.id"]=');
  const bAt = idx(bSrc, '["user.id"]=');
  const bFn = fnAround(bSrc, bAt, () => true);
  const bText = bFn ? bSrc.src(bFn) : "";
  const baseKeys = [
    ...new Set(
      [...bText.matchAll(/\b[\w$]\["([\w.]+)"\]=/g)].map((m) => m[1] as string),
    ),
  ];
  const baseGates = [
    ...new Set(
      [...bText.matchAll(/"(OTEL_METRICS_INCLUDE_\w+)"/g)].map(
        (m) => m[1] as string,
      ),
    ),
  ];
  const base: Record<string, Json> = {};
  for (const k of baseKeys) base[k] = { ...UNVERIFIED };
  const baseNote = `Base attributes (keys assigned by the attribute builder, in code order); the builder also copies keys of OTEL_RESOURCE_ATTRIBUTES when OTEL_METRICS_INCLUDE_RESOURCE_ATTRIBUTES is set. ${baseGates.length ? ` Gates found in the builder: ${baseGates.join(", ")}.` : ""}`;

  // Attribution keys (agent, skill, plugin, mcp) that cost/token metrics spread in.
  const attrRe = /\{\.\.\.[\w$]+&&\{"agent\.name":/;
  const attrSrc = mods.find((m) => attrRe.test(m.text)) as Src;
  const attrAt = idx(attrSrc, attrRe);
  const attrib: Record<string, Json> = {};
  attrsToProps(R.objectAt(attrSrc, attrAt), attrib);
  for (const v of Object.values(attrib)) v["x-unverified"] = true;

  // Metrics: installMeter registers each counter; accessors expose them; call sites add values.
  const mSrc = only("Count of CLI sessions started");
  const slot = new Map<
    string,
    { name: string; description: string; unit?: string }
  >();
  for (const m of mSrc.text.matchAll(
    /this\.(#\w+)=[\w$]+\("claude_code\.([\w.]+)",\{description:"((?:[^"\\]|\\.)*)"(?:,unit:[\w$]+\("(\w+)"\))?\}/g,
  ))
    slot.set(m[1] as string, {
      name: m[2] as string,
      description: JSON.parse(`"${m[3]}"`),
      unit: m[4],
    });
  const method = new Map<string, string>();
  for (const m of mSrc.text.matchAll(
    /(\w+Counter)\(\)\{return this\.(#\w+)\}/g,
  )) {
    const s = slot.get(m[2] as string);
    if (s) method.set(m[1] as string, s.name);
  }
  const accessorSrc = mods.find((m) =>
    m.text.includes("telemetryHandles.sessionCounter()"),
  );
  if (!accessorSrc) throw new Error("metric accessors not found");
  const metricProps = new Map<string, Record<string, Json>>();
  for (const [meth, name] of method) {
    const acc = new RegExp(
      `function ([\\w$]+)\\(\\)\\{return [\\w$]+\\(\\)\\.host\\.telemetryHandles\\.${meth}\\(\\)\\}`,
    ).exec(accessorSrc.text);
    const p: Record<string, Json> = {};
    metricProps.set(name, p);
    if (!acc) continue;
    for (const m of mods) {
      const names =
        m === accessorSrc
          ? [acc[1] as string]
          : aliasesOf(m, accessorSrc.name, acc[1] as string);
      for (const nm of names) {
        const call = new RegExp(
          `(?<![\\w$.])${esc(nm)}\\(\\)\\?\\.add\\(`,
          "g",
        );
        let hit: RegExpExecArray | null = call.exec(m.text);
        while (hit) {
          const open = hit.index + hit[0].length - 1;
          const entries = argEntries(
            R,
            m,
            callAt(m, open)?.arguments[1] as Node | undefined,
          );
          if (entries) {
            const before = R.unresolved.length;
            attrsToProps(R.spreads(entries), p);
            if (R.unresolved.length > before && Object.keys(attrib).length) {
              for (const [k, v] of Object.entries(attrib)) p[k] ??= v;
            }
          }
          hit = call.exec(m.text);
        }
      }
    }
  }
  for (const s of slot.values()) {
    const own = metricProps.get(s.name) ?? {};
    $defs[`metric:claude_code.${s.name}`] = {
      "x-otel-kind": "metric",
      type: "object",
      description: s.description,
      ...(s.unit
        ? { $comment: `Unit: ${s.unit}. ${baseNote}` }
        : { $comment: baseNote }),
      properties: { ...base, ...own },
    };
  }

  // Spans.
  const spanDefs = new Map<
    string,
    { props: Record<string, Json>; sites: number; comment: string[] }
  >();
  const addSpan = (
    name: string,
    spanType: string | undefined,
    p: Record<string, Json>,
    how: string,
  ) => {
    const cur = spanDefs.get(name) ?? { props: {}, sites: 0, comment: [] };
    for (const [k, v] of Object.entries(p)) cur.props[k] ??= v;
    cur.sites++;
    cur.comment.push(how);
    if (spanType) cur.props["span.type"] = { const: spanType };
    spanDefs.set(name, cur);
  };
  for (const m of mods) {
    // Style 1: a helper builds the attributes, then startSpan("claude_code.<name>").
    for (const s of m.text.matchAll(/startSpan\("claude_code\.([\w.]+)"/g)) {
      const name = s[1] as string;
      const win = m.text.slice(Math.max(0, (s.index ?? 0) - 1800), s.index);
      const calls = [
        ...win.matchAll(
          new RegExp(
            `([\\w$]+)=([\\w$]+)\\("${name.replace(/\./g, "\\.")}",`,
            "g",
          ),
        ),
      ];
      const last = calls[calls.length - 1];
      const p: Record<string, Json> = {};
      if (last) {
        const winStart = Math.max(0, (s.index ?? 0) - 1800);
        const argAt = winStart + (last.index ?? 0) + last[0].length;
        const call = m.at(argAt, "CallExpression");
        const entries = m.text.startsWith("{", argAt)
          ? R.objectAt(m, argAt)
          : call && R.call(m, call);
        if (entries) attrsToProps(R.spreads(entries), p);
        const between = m.text.slice(argAt, s.index);
        const v = last[1] as string;
        for (const a of between.matchAll(
          new RegExp(
            `(?<![\\w$.])${esc(v)}(?:\\["([\\w.-]+)"\\]|\\.([\\w$]+))=`,
            "g",
          ),
        ))
          p[(a[1] ?? a[2]) as string] ??= { ...UNVERIFIED };
      }
      addSpan(name, name, p, "attributes literal at creation");
    }
    // Style 2: a wrapper takes {spanType, attrs, contentAttrs}.
    for (const s of m.text.matchAll(
      /"claude_code\.([\w.]+)",\{spanType:"([\w.]+)"/g,
    )) {
      const objAt = (s.index ?? 0) + s[0].indexOf(",{spanType") + 1;
      const p: Record<string, Json> = {};
      const content: string[] = [];
      for (const e of R.objectAt(m, objAt)) {
        if (!("key" in e) || e.val.k !== "obj") continue;
        if (e.key !== "attrs" && e.key !== "contentAttrs") continue;
        const before = Object.keys(p);
        attrsToProps(R.spreads(e.val.e), p);
        if (e.key === "contentAttrs")
          content.push(...Object.keys(p).filter((k) => !before.includes(k)));
      }
      addSpan(
        s[1] as string,
        s[2] as string,
        p,
        content.length ? `contentAttrs: ${content.join(", ")}` : "",
      );
    }
  }
  for (const [name, d] of spanDefs) {
    $defs[`span:claude_code.${name}`] = {
      "x-otel-kind": "span",
      type: "object",
      $comment: `${baseNote} Also set on every span: gen_ai.provider.name. Attributes set after the span starts (at its end) are not listed. Creation sites read: ${d.sites}.${d.comment.filter(Boolean).length ? ` Added only when content logging is on (${d.comment.filter(Boolean).join("; ")}).` : ""}`,
      properties: {
        ...base,
        "gen_ai.provider.name": { ...UNVERIFIED },
        ...d.props,
      },
    };
  }

  // Events: bi(name, attrs) emits a log record with the base attributes and event.* fields.
  const evProps: Record<string, Json> = {
    "event.name": { type: "string" },
    "event.timestamp": { type: "string" },
    "event.sequence": { type: "number" },
    "prompt.id": { ...UNVERIFIED },
    "workspace.host_paths": { type: "array" },
  };
  const events = eventSites(bundle, R);
  for (const [name, lists] of events) {
    const p: Record<string, Json> = {};
    attrsToProps(mergeEntries(lists), p);
    $defs[`event:${name}`] = {
      "x-otel-kind": "event",
      type: "object",
      $comment: `${baseNote} Call sites read: ${lists.length}. A key missing from some sites is optional.`,
      properties: { ...base, ...evProps, ...p, "event.name": { const: name } },
    };
  }

  const ordered = Object.fromEntries(
    Object.entries($defs).sort(([a], [b]) => a.localeCompare(b)),
  );
  const count = (kind: string) =>
    Object.values(ordered).filter((d) => d["x-otel-kind"] === kind).length;
  note(
    `otel: ${count("metric")} metrics, ${count("span")} spans, ${count("event")} events`,
  );
  const out: Json = {
    ...header(
      "claude-code-otel.json",
      "Claude Code OpenTelemetry metrics, spans, and events",
      `For the OpenTelemetry data Claude Code emits. Each $defs entry is one metric, span, or event; the kind is in x-otel-kind and the properties are its attributes. Generated from Claude Code ${VERSION} by tools/schemas/code.ts. Anchors: "Count of CLI sessions started" (the meter setup that registers each metric with its description and unit) with the counter accessor functions and their .add(value, attributes) call sites; the span helpers (startSpan("claude_code.<name>") with the attribute literal built just before it, and the wrapper that takes {spanType, attrs, contentAttrs}); the event emitter that sets "event.name", "event.timestamp", "event.sequence" and its call sites with the attribute literal; the base attribute builder behind "OTEL_METRICS_INCLUDE_SESSION_ID". No probe in captures/ records telemetry, so nothing is marked x-observed. Do not edit by hand.`,
    ),
    $defs: ordered,
  };
  return { file: "claude-code-otel.json", schema: out };
};
