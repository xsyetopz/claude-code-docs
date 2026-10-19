import { makeBadge } from "@site/src/components/Badge";
import FileTree from "@site/src/components/FileTree";
import CodeInline from "@theme/CodeInline";
import MDXComponents from "@theme-original/MDXComponents";
import type { ComponentProps } from "react";

const OriginalCode = MDXComponents.code;

// Inline code with <wbr> children (rehype-code-wbr) is still inline code.
function Code(props: ComponentProps<"code">) {
  return (props as Record<string, unknown>)["data-wbr"] ? (
    <CodeInline {...props} />
  ) : (
    <OriginalCode {...props} />
  );
}

export default {
  ...MDXComponents,
  code: Code,
  Documented: makeBadge("documented"),
  Undocumented: makeBadge("undocumented"),
  Differs: makeBadge("differs"),
  Gated: makeBadge("gated"),
  FileTree,
};
