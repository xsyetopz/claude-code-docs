// Types and helpers shared by the core-*.ts files: the result shape, the singletons, and the guard.
import { Content, ContentError } from "./content.ts";
import type { Source } from "./fetcher.ts";
import { Platform } from "./platform.ts";

export const DEFAULT_PAGE_CHARS = 20000;
export const MAX_PAGE_CHARS = 40000;
export type DocSourceName = "docs" | "platform";

export type Result = {
  ok: boolean;
  /** Markdown or plain text for a reader. Ends with a "Source:" line on success. */
  text: string;
  /** The same answer as plain data (for `--json`). */
  data: Record<string, unknown>;
  /** Where the text came from. Undefined when nothing was read. */
  source: Source | undefined;
  /** True when `data` holds everything that `text` holds, so a front end may send only `data`. */
  complete: boolean;
};

export const content = new Content();
export const platform = new Platform();

export const ok = (
  text: string,
  data: Record<string, unknown>,
  source: Source | undefined,
  complete = false,
): Result => ({ ok: true, text, data, source, complete });
export const fail = (text: string, source?: Source): Result => ({
  ok: false,
  text,
  data: { error: text },
  source,
  complete: false,
});

/** Network problems with nothing cached become a clean failed result. */
export const guarded = async (f: () => Promise<Result>): Promise<Result> => {
  try {
    return await f();
  } catch (e) {
    if (e instanceof ContentError) return fail(e.message);
    throw e;
  }
};

export const heading = async (): Promise<string> => {
  const v = await content.claudeCode();
  return v ? `Claude Code Docs (Claude Code ${v})\n\n` : "";
};
