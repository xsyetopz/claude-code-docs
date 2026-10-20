// Writes llms.txt, llms-full.txt, llms-manifest.json, and one .md per doc page
// into the build output (design: agent-access D1). Output is deterministic.
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, posix } from "node:path";
import type { LoadContext, Plugin } from "@docusaurus/types";
import { CLAUDE_CODE_VERSION } from "../../version";
import { convertBody } from "./convert";

type Doc = {
  id: string;
  title: string;
  description: string;
  permalink: string;
  source: string;
};
type SidebarItem = {
  type: string;
  id?: string;
  label?: string;
  items?: SidebarItem[];
  link?: { type: string; id?: string };
};
type Version = { docs: Doc[]; sidebars: Record<string, SidebarItem[]> };

type Page = {
  doc: Doc;
  section: string;
  route: string;
  mdPath: string;
  htmlUrl: string;
  mdUrl: string;
  /** Repo-relative source path, such as docs/start/how-to-read.md. */
  repoPath: string;
};

const TITLE = "Claude Code Community Docs";
const OPTIONAL_SECTION = "System Prompts";
const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();
const yaml = (s: string) => JSON.stringify(oneLine(s));

export default function llmsTxtPlugin(context: LoadContext): Plugin {
  const { siteDir, siteConfig } = context;
  const base = `${siteConfig.url}${siteConfig.baseUrl}`;

  let loaded: Record<string, Record<string, unknown>> = {};

  return {
    name: "llms-txt",
    allContentLoaded({ allContent }) {
      loaded = allContent;
    },
    async postBuild({ outDir }) {
      const content = loaded["docusaurus-plugin-content-docs"] as
        | { default?: { loadedVersions?: Version[] } }
        | undefined;
      const version = content?.default?.loadedVersions?.[0];
      if (!version) throw new Error("llms-txt: docs plugin content not found");
      const docs = new Map(version.docs.map((d) => [d.id, d]));

      // Walk the sidebar: pages in order, tagged with their top-level section.
      const pages: Page[] = [];
      const seen = new Set<string>();
      const add = (id: string | undefined, section: string) => {
        const doc = id === undefined ? undefined : docs.get(id);
        if (!doc || seen.has(doc.id)) return;
        seen.add(doc.id);
        const route =
          doc.permalink
            .slice(siteConfig.baseUrl.length - 1)
            .replace(/\/$/, "") || "/";
        const mdPath = route === "/" ? "index.md" : `${route.slice(1)}.md`;
        pages.push({
          doc,
          section,
          route,
          mdPath,
          htmlUrl: `${siteConfig.url}${doc.permalink}`,
          mdUrl: `${base}${mdPath}`,
          repoPath: doc.source.replace(/^@site\//, ""),
        });
      };
      const walk = (items: SidebarItem[], section: string | undefined) => {
        for (const item of items) {
          if (item.type === "doc") add(item.id, section ?? "Overview");
          else if (item.type === "category") {
            const own = section ?? item.label ?? "Docs";
            if (item.link?.type === "doc") add(item.link.id, own);
            walk(item.items ?? [], own);
          }
        }
      };
      walk(version.sidebars["docs"] ?? [], undefined);
      for (const d of version.docs) add(d.id, "Docs");

      const byRepoPath = new Map(pages.map((p) => [p.repoPath, p]));
      const files = new Map<string, string>(); // mdPath -> content

      for (const page of pages) {
        const raw = await readFile(join(siteDir, page.repoPath), "utf8");
        const resolve = (target: string) => {
          // A site-absolute link (a category page has no .md) becomes the full page URL.
          if (/^\/(?!\/)/.test(target)) return `${base}${target.slice(1)}`;
          if (/^[a-z][a-z0-9+.-]*:|^#|^\//.test(target)) return undefined;
          const [file = "", hash] = target.split("#");
          if (/\.(?!mdx?$)\w+$/.test(posix.basename(file))) return undefined;
          const joined = posix.join(posix.dirname(page.repoPath), file);
          const dest = [
            joined,
            `${joined}.md`,
            `${joined}.mdx`,
            `${joined}/index.md`,
          ]
            .map((c) => byRepoPath.get(c))
            .find(Boolean);
          if (!dest)
            throw new Error(
              `llms-txt: ${page.repoPath} links to unknown doc ${target}`,
            );
          return hash ? `${dest.mdUrl}#${hash}` : dest.mdUrl;
        };
        let body = convertBody(raw, resolve);
        if (!/^# .+/m.test(body.split(/^\s*(?:`{3}|~{3})/m)[0] ?? ""))
          body = `# ${page.doc.title}\n\n${body}`;
        files.set(
          page.mdPath,
          [
            "---",
            `title: ${yaml(page.doc.title)}`,
            `description: ${yaml(page.doc.description)}`,
            `url: ${page.htmlUrl}`,
            `source: ${page.repoPath}`,
            "---",
            "",
            body,
            "",
          ].join("\n"),
        );
      }

      const link = (p: Page) =>
        `- [${p.doc.title}](${p.mdUrl}): ${oneLine(p.doc.description)}`;
      const sections = [...new Set(pages.map((p) => p.section))];
      const lines = [
        `# ${TITLE}`,
        "",
        `> Unofficial community docs for Claude Code ${CLAUDE_CODE_VERSION}, built from the official docs and the program itself. Not made by or tied to Anthropic. Each item is marked [Documented], [Undocumented], [Differs], [Gated], [Managed Only], [Experimental], [Deprecated], or [Caution].`,
        "",
        `Every page below is plain markdown with a small front matter block. The full text of all pages is in llms-full.txt. Pages track version ${CLAUDE_CODE_VERSION} only. For supported behavior, check the official docs first.`,
        "",
      ];
      for (const section of sections.filter((s) => s !== OPTIONAL_SECTION)) {
        lines.push(`## ${section}`, "");
        for (const p of pages.filter((p) => p.section === section))
          lines.push(link(p));
        lines.push("");
      }
      const schemaNames = (await readdir(join(siteDir, "schemas")))
        .filter((n) => n.endsWith(".json"))
        .sort();
      lines.push(
        "## Machine-Readable Files",
        "",
        `- [llms-full.txt](${base}llms-full.txt): every page below as markdown, in sidebar order`,
        `- [llms-manifest.json](${base}llms-manifest.json): index of all pages as JSON`,
        ...schemaNames.map((n) => `- [${n}](${base}schemas/${n}): JSON Schema`),
        "",
        "## Optional",
        "",
      );
      for (const p of pages.filter((p) => p.section === OPTIONAL_SECTION))
        lines.push(link(p));
      lines.push("");

      const manifest = pages.map((p) => ({
        route: p.route,
        title: p.doc.title,
        description: oneLine(p.doc.description),
        section: p.section,
        md: p.mdUrl,
        url: p.htmlUrl,
      }));
      const full = pages.map((p) => files.get(p.mdPath)).join("\n");

      const out = new Map(files);
      out.set("llms.txt", lines.join("\n"));
      out.set("llms-full.txt", full);
      out.set("llms-manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);
      for (const [name, text] of out) {
        const dest = join(outDir, name);
        await mkdir(dirname(dest), { recursive: true });
        await writeFile(dest, text);
      }
    },
  };
}
