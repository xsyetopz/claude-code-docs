import { makeBadge } from "@site/src/components/Badge";
import FileTree from "@site/src/components/FileTree";
import MDXComponents from "@theme-original/MDXComponents";

export default {
  ...MDXComponents,
  Documented: makeBadge("documented"),
  Undocumented: makeBadge("undocumented"),
  Differs: makeBadge("differs"),
  Gated: makeBadge("gated"),
  FileTree,
};
