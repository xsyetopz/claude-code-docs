// Session transcripts: <config dir>/projects/<project>/<session>.jsonl, where the config dir is
// CLAUDE_CONFIG_DIR or ~/.claude. Each line is checked against the transcript JSON Schema of its `type`.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join } from "node:path";
import { z } from "zod";
import transcript from "../../../schemas/claude-code-transcript.json" with {
  type: "json",
};

export const configDir = (): string =>
  process.env["CLAUDE_CONFIG_DIR"] || join(homedir(), ".claude");
const projectsDir = () => join(configDir(), "projects");

export type SessionFile = {
  id: string;
  project: string;
  path: string;
  bytes: number;
  modified: string;
};

/** Every session file, newest first. `project` keeps those whose project folder name contains it. */
export const listSessions = (project?: string): SessionFile[] => {
  const root = projectsDir();
  if (!existsSync(root)) return [];
  const out: SessionFile[] = [];
  for (const p of readdirSync(root)) {
    if (project && !p.includes(project)) continue;
    const dir = join(root, p);
    if (!statSync(dir).isDirectory()) continue;
    for (const f of readdirSync(dir)) {
      if (!f.endsWith(".jsonl")) continue;
      const path = join(dir, f);
      const st = statSync(path);
      out.push({
        id: basename(f, ".jsonl"),
        project: p,
        path,
        bytes: st.size,
        modified: st.mtime.toISOString(),
      });
    }
  }
  return out.sort((a, b) => b.modified.localeCompare(a.modified));
};

/** The file of a session: a path to a .jsonl file, or a session id (a prefix works when it is unique). */
export const sessionPath = (session: string): string => {
  if (session.endsWith(".jsonl") && existsSync(session)) return session;
  const hits = listSessions().filter((s) => s.id.startsWith(session));
  const exact = hits.find((s) => s.id === session);
  if (exact) return exact.path;
  if (hits.length === 1) return (hits[0] as SessionFile).path;
  throw new Error(
    hits.length
      ? `session "${session}" matches ${hits.length} sessions: ${hits
          .slice(0, 5)
          .map((s) => s.id)
          .join(", ")}`
      : `no session "${session}" under ${projectsDir()}`,
  );
};

export type Line = {
  n: number;
  text: string;
  json?: { type?: unknown; [k: string]: unknown };
};

/** The lines of a session file, numbered from 1; `json` is unset when a line is not JSON. */
export const readLines = (path: string): Line[] =>
  readFileSync(path, "utf8")
    .split("\n")
    .flatMap((text, i) => {
      if (!text.trim()) return [];
      try {
        return [{ n: i + 1, text, json: JSON.parse(text) }];
      } catch {
        return [{ n: i + 1, text }];
      }
    });

type Schema = Record<string, unknown>;
const defs = transcript.$defs as Record<string, Schema>;
/** Definition name by the `type` const it requires. */
const byType = new Map<string, string>();
for (const [name, d] of Object.entries(defs)) {
  const t = (d["properties"] as Record<string, Schema> | undefined)?.["type"]?.[
    "const"
  ];
  if (typeof t === "string") byType.set(t, name);
}
const validators = new Map<string, z.ZodType>();
const validator = (def: string): z.ZodType => {
  let v = validators.get(def);
  if (!v) {
    v = z.fromJSONSchema({ ...defs[def], $defs: defs } as never);
    validators.set(def, v);
  }
  return v;
};

export const SCHEMA_VERSION = transcript.title.match(/\d+\.\d+\.\d+/)?.[0];

/** Problems of one line: empty when it fits the schema of its `type`. */
export const checkLine = (line: Line): string[] => {
  if (!line.json) return ["not JSON"];
  const t = line.json.type;
  const def = typeof t === "string" ? byType.get(t) : undefined;
  if (!def) return [`unknown type ${JSON.stringify(t)}`];
  const r = validator(def).safeParse(line.json);
  return r.success
    ? []
    : r.error.issues.map(
        (i) => `${i.path.join(".") || "(root)"}: ${i.message}`,
      );
};
