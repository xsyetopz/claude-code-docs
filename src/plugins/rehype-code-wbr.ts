// Adds <wbr> break points inside inline code in table cells, so long names
// wrap at natural places. The text stays identical for copy and search.
type Node = {
  type: string;
  tagName?: string;
  value?: string;
  children?: Node[];
  properties?: Record<string, unknown>;
};

const BREAK = /(?<=[_./:-])(?=[^_./:-])|(?<=[a-z0-9])(?=[A-Z])/g;

const split = (value: string): Node[] => {
  const parts = value.split(BREAK);
  const out: Node[] = [];
  parts.forEach((part, i) => {
    if (i > 0) out.push({ type: "element", tagName: "wbr", children: [] });
    out.push({ type: "text", value: part });
  });
  return out;
};

const wrapCode = (node: Node): void => {
  if (!node.children) return;
  // Flag it so the theme keeps rendering it as inline code (see MDXComponents).
  node.properties = { ...node.properties, dataWbr: "true" };
  node.children = node.children.flatMap((c) =>
    c.type === "text" && c.value ? split(c.value) : [c],
  );
};

const walk = (node: Node, inCell: boolean): void => {
  if (!node.children) return;
  for (const child of node.children) {
    if (child.type !== "element") continue;
    const cell = inCell || child.tagName === "td";
    if (cell && child.tagName === "code") wrapCode(child);
    else walk(child, cell);
  }
};

const rehypeCodeWbr = () => {
  return (tree: Node) => walk(tree, false);
};

export default rehypeCodeWbr;
