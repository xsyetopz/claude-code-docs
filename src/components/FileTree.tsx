import React from "react";

// Marks every inline code item that ends in "/" as a folder, so CSS can set
// folders apart from files without color.
const mark = (node: React.ReactNode): React.ReactNode => {
  return React.Children.map(node, (child) => {
    if (
      !React.isValidElement<{ children?: React.ReactNode; className?: string }>(
        child,
      )
    )
      return child;
    const { children, className } = child.props;
    // list-style: none makes VoiceOver drop the list role, so restore it.
    const isList =
      child.type === "ul" ||
      (typeof child.type === "function" &&
        /^MDXUl$|^Ul$/i.test(child.type.name));
    if (isList)
      return React.cloneElement(
        child,
        { role: "list" } as Record<string, unknown>,
        mark(children),
      );
    if (typeof children === "string") {
      return children.endsWith("/")
        ? React.cloneElement(child, {
            className: `${className ?? ""} cc-folder`.trim(),
          })
        : child;
    }
    return children === undefined
      ? child
      : React.cloneElement(child, {}, mark(children));
  });
};

const FileTree = ({
  children,
}: {
  children?: React.ReactNode;
}): React.JSX.Element => {
  return <div className="cc-filetree">{mark(children)}</div>;
};

export default FileTree;
