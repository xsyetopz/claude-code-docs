import { List, Paper } from "@mantine/core";
import React from "react";

type ElementProps = { children?: React.ReactNode; className?: string };

const typeName = (type: unknown): string =>
  typeof type === "function" ? type.name : "";

// Rebuilds the MDX list on Mantine List. It also marks every inline code item
// that ends in "/" as a folder, so CSS can set folders apart without color.
const mark = (node: React.ReactNode): React.ReactNode => {
  return React.Children.map(node, (child) => {
    if (!React.isValidElement<ElementProps>(child)) return child;
    const { children, className } = child.props;
    if (child.type === "ul" || /^MDXUl$|^Ul$/i.test(typeName(child.type))) {
      // list-style: none makes VoiceOver drop the list role, so restore it.
      return (
        <List type="unordered" listStyleType="none" role="list">
          {mark(children)}
        </List>
      );
    }
    if (child.type === "li" || /^MDXLi$|^Li$/i.test(typeName(child.type))) {
      return <List.Item>{mark(children)}</List.Item>;
    }
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
  return (
    <Paper className="cc-filetree" component="div" withBorder={false}>
      {mark(children)}
    </Paper>
  );
};

export default FileTree;
