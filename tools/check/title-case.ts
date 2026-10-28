// The Chicago Title Case rule that check:docs applies to every title, heading,
// and sidebar label. Chicago lowercases an article, a coordinating conjunction,
// and a preposition whatever its length, and capitalizes the first and last word.
// So a heading may write either "Behind" or "behind" inside the title.

const SMALL = new Set(
  (
    "a an the and but or nor for so yet as at by in of on to up via per vs " +
    "from into onto over with within without off out than " +
    "about above across after against along among around before behind " +
    "below beneath beside between beyond down during inside near past " +
    "since through throughout toward towards under until upon " +
    "like unlike despite"
  ).split(" "),
);

/** Short prepositions that must stay lowercase inside a title. */
const REQUIRE_LOWER = new Set(["with", "without"]);

/** Returns the words that break the rule, or an empty list. */
export const titleCaseProblems = (raw: string): string[] => {
  const text = raw
    .replace(/\s*\{#[^}]*\}\s*$/, "")
    .replace(/`[^`]*`/g, "X") // code spans are always fine
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_]{1,3}/g, "");
  const words = text.split(/\s+/).filter(Boolean);
  const bad: string[] = [];
  words.forEach((word, i) => {
    const core = word.replace(/^[("'[]+/, "");
    const first = core[0];
    if (!first || !/\p{L}/u.test(first)) return; // digits, symbols, placeholders
    const bare = core.replace(/[^\p{L}\p{N}-]+$/u, "");
    const edge =
      i === 0 || i === words.length - 1 || /[:?!.]$/.test(words[i - 1] ?? "");
    if (first === first.toUpperCase()) {
      if (!edge && REQUIRE_LOWER.has(bare.toLowerCase())) bad.push(bare);
      return;
    }
    if (!edge && SMALL.has(bare.toLowerCase())) return;
    bad.push(bare);
  });
  return bad;
};
