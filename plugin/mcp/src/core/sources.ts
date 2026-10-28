// The three remote sources (platform, code, anthropic) behind one shape, so search, list, and read each have one branch.
import {
  type AnthropicEntry,
  anthropicBase,
  nearAnthropic,
  normalizeAnthropicPath,
  ROOT,
} from "../anthropic.ts";
import { codeBase, nearCode, normalizeCodePath } from "../code.ts";
import type { Resource, Source } from "../fetcher.ts";
import { htmlTitle, htmlToMarkdown } from "../html.ts";
import {
  nearPlatform,
  normalizePlatformPath,
  platformBase,
} from "../platform.ts";
import { anthropic, code, platform } from "./shared.ts";

/** A page of a remote source. `group` is the filter value: a llms.txt group, or a sitemap section. */
export type RemoteItem = {
  path: string;
  title: string;
  description: string;
  group: string;
  url: string;
};

export type RemoteSource = {
  name: "platform" | "code" | "anthropic";
  /** What the filter is called in messages. */
  groupWord: string;
  /** Rest of the "Invalid path" message. */
  invalidHint(): string;
  normalize(input: string): string | undefined;
  index(): Promise<{
    entries: readonly RemoteItem[];
    source: Source;
    search(
      query: string,
      limit: number,
      group?: string,
    ): { entry: RemoteItem; score: number; snippet: string }[];
  }>;
  known(): readonly RemoteItem[] | undefined;
  readPage(path: string): Promise<Resource>;
  near(path: string, entries: readonly RemoteItem[]): string;
  pageUrl(path: string): string;
  /** Page body to markdown. */
  markdown(body: string, url: string): string;
  /** A title found in the page itself. */
  titleOf(body: string): string | undefined;
  /** True when the page title wins over the index title (the index title is only a slug). */
  pageTitleFirst: boolean;
};

const platformSource: RemoteSource = {
  name: "platform",
  groupWord: "group",
  invalidHint: () =>
    `Use a path under docs/en/ such as "build-with-claude/overview" (letters, digits, "-", "_" and "/" only; English pages on ${platformBase()} only).`,
  normalize: normalizePlatformPath,
  index: () => platform.index(),
  known: () => platform.known(),
  readPage: (p) => platform.readPage(p),
  near: nearPlatform,
  pageUrl: (p) => `${platformBase()}/docs/en/${p}`,
  markdown: (body) => body,
  titleOf: (body) => /^title:\s*(.+)$/m.exec(body.slice(0, 1000))?.[1]?.trim(),
  pageTitleFirst: false,
};

const codeSource: RemoteSource = {
  name: "code",
  groupWord: "group",
  invalidHint: () =>
    `Use a path under docs/en/ such as "plugins/create" (letters, digits, "-", "_" and "/" only; English pages on ${codeBase()} only).`,
  normalize: normalizeCodePath,
  index: () => code.index(),
  known: () => code.known(),
  readPage: (p) => code.readPage(p),
  near: nearCode,
  pageUrl: (p) => `${codeBase()}/docs/en/${p}`,
  markdown: (body) => body,
  titleOf: (body) => /^#\s+(.+)$/m.exec(body)?.[1]?.trim(),
  pageTitleFirst: false,
};

const item = (e: AnthropicEntry): RemoteItem => ({
  path: e.path,
  title: e.title,
  description: e.lastmod ? `Updated ${e.lastmod.slice(0, 10)}` : "",
  group: e.section,
  url: e.url,
});

const anthropicSource: RemoteSource = {
  name: "anthropic",
  groupWord: "section",
  invalidHint: () =>
    `Use a page path such as "research/building-effective-agents", or "${ROOT}" for the home page (letters, digits, "-", "_", "." and "/" only; pages on ${anthropicBase()} only).`,
  normalize: normalizeAnthropicPath,
  async index() {
    const ix = await anthropic.index();
    return {
      entries: ix.entries.map(item),
      source: ix.source,
      search: (q, limit, group) =>
        ix.search(q, limit, group).map((h) => ({
          entry: item(h.entry),
          score: h.score,
          snippet: h.snippet,
        })),
    };
  },
  known: () => anthropic.known()?.map(item),
  readPage: (p) => anthropic.readPage(p),
  near: nearAnthropic,
  pageUrl: (p) =>
    p === ROOT ? `${anthropicBase()}/` : `${anthropicBase()}/${p}`,
  markdown: htmlToMarkdown,
  titleOf: htmlTitle,
  pageTitleFirst: true,
};

export const remoteOf = (name: string | undefined): RemoteSource | undefined =>
  name === "platform"
    ? platformSource
    : name === "code"
      ? codeSource
      : name === "anthropic"
        ? anthropicSource
        : undefined;
