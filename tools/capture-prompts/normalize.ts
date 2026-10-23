// Host-data normalizer shared by render.ts (generated pages) and check-docs.ts
// (hand-written prompt pages). Replaces values that depend on the machine.
export const normalizeHost = (s: string): string =>
  s
    .replace(/- Platform: .*/g, "- Platform: <platform>")
    .replace(/- Shell: .*/g, "- Shell: <shell>")
    .replace(/- OS Version: .*/g, "- OS Version: <os-version>")
    .replace(/cc_version=(\d+\.\d+\.\d+)\.\w+/g, "cc_version=$1.<build>")
    .replace(/\/private\/var\/folders\/[^\s"'`)]*/g, "<temp-dir>")
    .replace(/\/tmp\/cap-[^\s"'`)]*/g, "<temp-dir>");

// Numbers random ids by first use, so equal ids stay equal and each run renders the same text.
export const numberUuids = () => {
  const ids = new Map<string, string>();
  return (s: string): string =>
    s.replace(
      /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
      (u) => {
        const k = u.toLowerCase();
        if (!ids.has(k)) ids.set(k, `<uuid-${ids.size + 1}>`);
        return ids.get(k) as string;
      },
    );
};
