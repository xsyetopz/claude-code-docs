import { z } from "zod";
import { listInstalls, program } from "../binary.ts";
import { cut, lines as linesOf } from "../diff.ts";
import { findUnits } from "../find.ts";
import { prepared } from "../prepare.ts";
import { readable } from "../readable.ts";
import {
  type Args,
  clip,
  group,
  MAX_CHARS,
  need,
  P,
  regex,
  text,
  WRITES_CACHE,
} from "./app.ts";

group<Args & { context?: number; length?: number; view?: string }>(
  "code",
  "Read the code inside a Claude Code binary: list installs or modules, search literal text, find code by plain words, read a module slice, or prepare a cleaned index for release diffs.",
  "action",
  {
    installs: () => {
      const installs = listInstalls();
      return text(
        installs.length
          ? installs
              .map(
                (i) =>
                  `- ${i.version}${i.current ? " (current)" : ""}  ${i.path}`,
              )
              .join("\n")
          : "No Claude Code install found.",
        { installs },
      );
    },
    modules: ({ version, name }) => {
      const p = program(version);
      const modules = p.modules
        .filter((m) => !name || m.name.includes(name))
        .map((m) => ({ name: m.name, bytes: m.bytes.length }));
      return text(
        `${p.path}: ${modules.length} modules\n${modules.map((m) => `- ${m.name}  ${m.bytes} bytes`).join("\n")}`,
        { path: p.path, modules },
      );
    },
    search: ({
      query,
      regex: isRegex = false,
      module,
      version,
      context = 150,
      limit = 20,
    }) => {
      const re = new RegExp(regex(need(query, "query"), isRegex).source, "g");
      const hits: { module: string; offset: number; snippet: string }[] = [];
      for (const m of program(version).bundle.modules.values()) {
        if (module && !m.name.includes(module)) continue;
        for (const h of m.text.matchAll(re)) {
          hits.push({
            module: m.name,
            offset: h.index,
            snippet: m.text.slice(
              Math.max(0, h.index - context),
              h.index + h[0].length + context,
            ),
          });
          if (hits.length >= limit) break;
        }
        if (hits.length >= limit) break;
      }
      return text(
        hits.length
          ? hits
              .map((h) => `- ${h.module}@${h.offset}: ${h.snippet}`)
              .join("\n\n")
          : `No match for ${re}.`,
        { hits },
      );
    },
    read: ({ module, offset = 0, length = 4000, version, view }) => {
      const p = program(version);
      const mod = need(module, "module");
      const m =
        p.modules.find((x) => x.name.endsWith(`/${mod}`)) ??
        p.modules.find((x) => x.name === mod);
      if (!m) throw new Error(`no module "${mod}" in ${p.path}`);
      if (view !== undefined && view !== "readable")
        throw new Error(`unknown view "${view}"; views: readable`);
      if (view) {
        const t = readable(version, m.name);
        const end = Math.min(t.length, offset + length);
        const slice = t.slice(offset, end);
        return text(
          `${m.name} (readable) [${offset}, ${end}) of ${t.length}\n${slice}`,
          { module: m.name, view, offset, end, total: t.length, text: slice },
        );
      }
      const end = Math.min(m.source.length, offset + length);
      return text(
        `${m.name} [${offset}, ${end}) of ${m.source.length}\n${m.source.slice(offset, end)}`,
      );
    },
    find: ({ query, version, limit = 10 }) => {
      const q = need(query, "query");
      const r = prepared(version);
      const found = findUnits(r.index, q, Math.min(limit, 10)).map((f) => ({
        ...f,
        excerpt: linesOf(f.u.t).slice(0, 4).map(cut),
      }));
      return text(
        found.length
          ? `${r.index.version}: top ${found.length} for "${clip(q, 100)}"\n${found
              .map(
                ({ u, n, hits, excerpt }) =>
                  `## ${u.k}  ${u.m}:${u.s}  score ${n} (${hits.join(", ")})\n${excerpt.join("\n")}`,
              )
              .join("\n\n")}`
          : `No unit holds a word of "${clip(q, 100)}".`,
        {
          found: found.map(({ u, n, hits, excerpt }) => ({
            label: u.k,
            module: u.m,
            offset: u.s,
            score: n,
            hits,
            excerpt,
          })),
        },
      );
    },
    prepare: ({ version }) => {
      const r = prepared(version);
      const skipped = Object.keys(r.index.skipped);
      return text(
        `${r.index.version}: ${r.parsed ? `${r.parsed} modules cleaned` : "read from the cache"}, ${r.index.units.length} units, ${r.ms} ms -> ${r.dir}${skipped.length ? `\nNot JavaScript: ${skipped.join(", ")}` : ""}`,
        {
          dir: r.dir,
          version: r.index.version,
          parsed: r.parsed,
          units: r.index.units.length,
          skipped,
          ms: r.ms,
        },
      );
    },
  },
  {
    version: P.version,
    query: P.query,
    regex: P.regex,
    name: P.name,
    module: P.module,
    offset: P.offset,
    limit: P.limit,
    context: z
      .number()
      .int()
      .min(0)
      .max(2000)
      .optional()
      .describe("Characters shown around a search hit (default 150)."),
    view: z
      .string()
      .optional()
      .describe(
        'With read: "readable" gives the module through Wakaru (the first call per module runs it, then it is cached).',
      ),
    length: z
      .number()
      .int()
      .min(1)
      .max(MAX_CHARS)
      .optional()
      .describe("Characters to read (default 4000)."),
  },
  WRITES_CACHE,
);
