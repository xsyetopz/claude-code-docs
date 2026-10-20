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
