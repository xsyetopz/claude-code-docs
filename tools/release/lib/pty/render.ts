// Port of render() in driver.py, so a slice of RAW (cut at a RAW.idx offset) renders the same way as screen.txt.
const ANSI =
  // biome-ignore lint/suspicious/noControlCharactersInRegex: terminal escapes
  /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[PX^_][^\x1b]*(?:\x1b\\)?|\x1b[=>()][A-Z0-9]?|\x1b[78MDEHc]/g;

/** Readable text: cursor-forward becomes spaces, cursor-down and home become line breaks, CR overwrites the line, other escapes are dropped, spaces collapse. */
export const renderRaw = (data: Uint8Array): string => {
  let s = Buffer.from(data).toString("utf8");
  s = s
    // biome-ignore lint/suspicious/noControlCharactersInRegex: terminal escapes
    .replace(/\x1b\[(\d*)C/g, (_m, n: string) => " ".repeat(Number(n || 1)))
    // biome-ignore lint/suspicious/noControlCharactersInRegex: terminal escapes
    .replace(/\x1b\[(\d*)B/g, (_m, n: string) =>
      "\n".repeat(Math.min(Number(n || 1), 3)),
    )
    // biome-ignore lint/suspicious/noControlCharactersInRegex: terminal escapes
    .replace(/\x1b\[\d*(?:;\d*)?[Hf]/g, "\n")
    .replace(ANSI, "");
  const lines: string[] = [];
  let cur: string[] = [];
  let col = 0;
  for (const ch of s) {
    if (ch === "\n") {
      lines.push(cur.join(""));
      cur = [];
      col = 0;
    } else if (ch === "\r") col = 0;
    else if (ch === "\b") col = Math.max(0, col - 1);
    else if (ch < " " && ch !== "\t") continue;
    else {
      if (col < cur.length) cur[col] = ch;
      else cur.push(ch);
      col++;
    }
  }
  lines.push(cur.join(""));
  return lines.map((l) => l.replace(/[ \t]+/g, " ").trim()).join("\n");
};
