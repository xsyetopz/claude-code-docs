import { z } from "zod";
import {
  checkLine,
  configDir,
  listSessions,
  readLines,
  SCHEMA_VERSION,
  sessionPath,
} from "../sessions.ts";
import {
  type Args,
  clip,
  group,
  MAX_CHARS,
  need,
  P,
  regex,
  text,
} from "./app.ts";

group<
  Args & {
    session?: string;
    project?: string;
    type?: string;
    max_line_chars?: number;
  }
>(
  "sessions",
  "Read Claude Code session transcripts: list, read, search, or validate them against the transcript schema.",
  "action",
  {
    list: ({ project, limit = 20 }) => {
      const all = listSessions(project);
      const sessions = all.slice(0, limit);
      return text(
        sessions.length
          ? `${all.length} sessions under ${configDir()}/projects${all.length > limit ? `, showing ${limit}` : ""}:\n${sessions
              .map(
                (s) =>
                  `- ${s.id}  ${s.project}  ${Math.round(s.bytes / 1024)} KB  ${s.modified}`,
              )
              .join("\n")}`
          : `No sessions under ${configDir()}/projects${project ? ` for "${project}"` : ""}.`,
        { sessions },
      );
    },
    read: ({
      session,
      type,
      offset = 0,
      limit = 20,
      max_line_chars = 2000,
    }) => {
      const path = sessionPath(need(session, "session"));
      const lines = readLines(path).filter(
        (l) => !type || l.json?.type === type,
      );
      const page = lines.slice(offset, offset + limit);
      const more = offset + page.length < lines.length;
      return text(
        `${path}: lines ${offset + 1}-${offset + page.length} of ${lines.length}${type ? ` with type "${type}"` : ""}${more ? `, next_offset ${offset + page.length}` : ""}\n${page
          .map((l) => `${l.n}: ${clip(l.text, max_line_chars)}`)
          .join("\n")}`,
      );
    },
    search: ({
      query,
      regex: isRegex = false,
      session,
      project,
      limit = 20,
    }) => {
      const re = regex(need(query, "query"), isRegex);
      const files = session
        ? [{ id: session, path: sessionPath(session) }]
        : listSessions(project);
      const hits: {
        session: string;
        line: number;
        type: unknown;
        snippet: string;
      }[] = [];
      for (const f of files) {
        for (const l of readLines(f.path)) {
          const m = re.exec(l.text);
          if (!m) continue;
          const from = Math.max(0, m.index - 100);
          hits.push({
            session: f.id,
            line: l.n,
            type: l.json?.type,
            snippet: l.text.slice(from, m.index + m[0].length + 100),
          });
          if (hits.length >= limit) break;
        }
        if (hits.length >= limit) break;
      }
      return text(
        hits.length
          ? hits
              .map((h) => `- ${h.session}:${h.line} [${h.type}] …${h.snippet}…`)
              .join("\n")
          : `No match for ${re} in ${files.length} sessions.`,
        { hits },
      );
    },
    validate: ({ session, limit = 20 }) => {
      const path = sessionPath(need(session, "session"));
      const lines = readLines(path);
      const byType: Record<string, { lines: number; failed: number }> = {};
      const failures: { line: number; type: unknown; problems: string[] }[] =
        [];
      for (const l of lines) {
        const t = String(l.json?.type);
        const c = byType[t] ?? { lines: 0, failed: 0 };
        byType[t] = c;
        c.lines++;
        const problems = checkLine(l);
        if (!problems.length) continue;
        c.failed++;
        failures.push({ line: l.n, type: l.json?.type, problems });
      }
      const shown = failures.slice(0, limit);
      return text(
        `${path}: ${lines.length} lines, ${failures.length} fail the ${SCHEMA_VERSION} schema.\n${Object.entries(
          byType,
        )
          .map(([t, c]) => `- ${t}: ${c.lines} lines, ${c.failed} fail`)
          .join(
            "\n",
          )}${shown.length ? `\n\nFailures:\n${shown.map((f) => `- line ${f.line} [${f.type}]: ${f.problems.slice(0, 5).join("; ")}`).join("\n")}` : ""}`,
        {
          lines: lines.length,
          failed: failures.length,
          byType,
          failures: shown,
        },
      );
    },
  },
  {
    session: z
      .string()
      .optional()
      .describe("Session id, unique prefix, or .jsonl path."),
    project: z
      .string()
      .optional()
      .describe("Keep project folders whose name contains this."),
    type: z.string().optional().describe('Keep lines with this "type" (read).'),
    query: P.query,
    regex: P.regex,
    offset: P.offset,
    limit: P.limit,
    max_line_chars: z.number().int().min(100).max(MAX_CHARS).optional(),
  },
);
