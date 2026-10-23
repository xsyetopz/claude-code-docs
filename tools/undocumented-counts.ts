// Recounts docs/reference/undocumented.md: each "Count: N." against its section's rows,
// each "Undocumented Rows" cell against the badges on the linked page, and the summary.
export type CountProblem = { line: number; message: string };

const badgeRows = (page: string) =>
  page
    .split("\n")
    .filter((l) => l.startsWith("|") && l.includes("<Undocumented />")).length;

export const countProblems = (
  text: string,
  read: (link: string) => string,
): CountProblem[] => {
  const lines = text.split("\n");
  const out: CountProblem[] = [];
  const bad = (i: number, what: string, stated: number, actual: number) => {
    if (stated !== actual)
      out.push({
        line: i + 1,
        message: `${what} says ${stated}, actual ${actual}`,
      });
  };
  const actual = new Map<string, number>();
  let section = "";
  let table = "";
  let countAt = -1;
  let sum = 0;
  const close = () => {
    if (countAt < 0) return;
    bad(
      countAt,
      `\`Count:\` of ${section}`,
      Number(lines[countAt]?.match(/\d+/)?.[0]),
      sum,
    );
    actual.set(section, sum);
  };
  for (const [i, l] of lines.entries()) {
    const h = l.match(/^## (.+)/);
    if (h) {
      close();
      [section, table, countAt, sum] = [h[1] ?? "", "", -1, 0];
      continue;
    }
    if (/^Count: \d+\.$/.test(l)) countAt = i;
    const listed = l.match(
      /^The (\d+) .* are all listed on \[[^\]]+\]\(([^)#]+)/,
    );
    if (listed) {
      const n = badgeRows(read(listed[2] ?? ""));
      bad(i, "listed-on count", Number(listed[1]), n);
      sum += n;
    }
    if (!l.startsWith("|")) {
      table = "";
      continue;
    }
    if (!table) {
      table = l;
      continue;
    }
    if (l.startsWith("| ---")) continue;
    if (table.startsWith("| Item |")) sum += 1;
    const pageRow = l.match(/^\| \[[^\]]+\]\(([^)#]+)[^)]*\) \| (\d+) \|$/);
    if (table.startsWith("| Page | Undocumented Rows |") && pageRow) {
      const n = badgeRows(read(pageRow[1] ?? ""));
      bad(i, `row of ${pageRow[1]}`, Number(pageRow[2]), n);
      sum += n;
    }
  }
  close();
  let total = 0;
  lines.forEach((l, i) => {
    const g = l.match(/^\| \[([^\]]+)\]\(#[^)]+\) \| (\d+) \|$/);
    if (g) {
      const n = actual.get(g[1] ?? "") ?? 0;
      bad(i, `summary of ${g[1]}`, Number(g[2]), n);
      total += n;
    }
    const t = l.match(/^\| Total \| (\d+) \|$/);
    if (t) bad(i, "summary total", Number(t[1]), total);
  });
  return out.sort((a, b) => a.line - b.line);
};
