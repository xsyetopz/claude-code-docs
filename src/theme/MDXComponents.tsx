import * as Badges from "@site/src/components/Badge";
import FileTree from "@site/src/components/FileTree";
import CodeInline from "@theme/CodeInline";
import MDXComponents from "@theme-original/MDXComponents";
import type { ComponentProps } from "react";

const OriginalCode = MDXComponents.code;

// Inline code with <wbr> children (rehype-code-wbr) is still inline code.
const Code = (props: ComponentProps<"code">) => {
  return (props as Record<string, unknown>)["data-wbr"] ? (
    <CodeInline {...props} />
  ) : (
    <OriginalCode {...props} />
  );
};

export default {
  ...MDXComponents,
  code: Code,
  ...Badges,
  FileTree,
};
