// list_pages: the pages of the docs site or the groups of the platform docs.

import { sourceData, sourceLine } from "../fetcher.ts";
import type { Entry } from "../manifest.ts";
import { matchesSection } from "../search.ts";
import {
  content,
  type DocSourceName,
  fail,
  guarded,
  heading,
  ok,
  platform,
  type Result,
} from "./shared.ts";

export type ListArgs = {
  source?: DocSourceName;
  /** A top-level section of the docs, or a group of the platform docs. */
  section?: string | undefined;
};

const listPlatform = async ({ section }: ListArgs): Promise<Result> => {
  const { entries, source } = await platform.index();
  const line = sourceLine(source);
  const src = sourceData(source);
  const groups = new Map<string, number>();
  for (const e of entries) groups.set(e.group, (groups.get(e.group) ?? 0) + 1);
  if (!section) {
    const rows = [...groups].map(([g, n]) => `- ${g || "(none)"}: ${n}`);
    return ok(
      `${entries.length} page(s) in ${groups.size} group(s). Pass a group to list its pages:\n\n${rows.join("\n")}\n\n${line}`,
      {
        groups: [...groups].map(([group, count]) => ({ group, count })),
        source: src,
      },
      source,
      true,
    );
  }
  const want = section.trim().toLowerCase();
  const list = entries.filter((e) => e.group.toLowerCase() === want);
  if (list.length === 0)
    return fail(
      `No group "${section}". Groups: ${[...groups.keys()].join(", ")}`,
    );
  const rows = list.map(
    (e) =>
      `- \`${e.path}\`: ${e.title}${e.description ? `. ${e.description}` : ""}`,
  );
  return ok(
    `${list.length} page(s) in "${list[0]?.group}":\n\n${rows.join("\n")}\n\n${line}`,
    {
      pages: list.map(({ path, title, group, description }) => ({
        route: path,
        title,
        section: group,
        description,
      })),
      source: src,
    },
    source,
    true,
  );
};

export const list = (args: ListArgs = {}): Promise<Result> =>
  guarded(async () => {
    if (args.source === "platform") return await listPlatform(args);
    const { section } = args;
    const { entries: all, source } = await content.manifest();
    const pages: readonly Entry[] = section
      ? all.filter((e) => matchesSection(e, section))
      : all;
    if (pages.length === 0) {
      const secs = [...new Set(all.map((e) => e.section))].join(", ");
      return fail(`No pages in section "${section}". Sections: ${secs}`);
    }
    const lines: string[] = [];
    let current = "";
    for (const e of pages) {
      if (e.section !== current) {
        current = e.section;
        lines.push(`\n## ${current}`);
      }
      lines.push(
        section
          ? `- \`${e.route}\`: ${e.title}. ${e.description}`
          : `- \`${e.route}\`: ${e.title}`,
      );
    }
    const version = await content.claudeCode();
    return ok(
      `${await heading()}${pages.length} page(s):${lines.join("\n")}\n\n${sourceLine(source)}`,
      {
        ...(version ? { claudeCode: version } : {}),
        pages: pages.map(({ route, title, section: s, description }) => ({
          route,
          title,
          section: s,
          ...(section ? { description } : {}),
        })),
        source: sourceData(source),
      },
      source,
      true,
    );
  });
