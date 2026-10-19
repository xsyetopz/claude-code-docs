import { useMermaidConfig } from "@docusaurus/theme-mermaid/client";
import type { WrapperProps } from "@docusaurus/types";
import type MermaidType from "@theme/Mermaid";
import Mermaid from "@theme-original/Mermaid";
import type { ComponentProps, JSX } from "react";

type Props = WrapperProps<typeof MermaidType>;

// The stock component keeps one random id for its whole life. When the color
// mode changes after the first render (a stored dark theme), it renders the
// same id twice at once, and all but one diagram on a page come out empty.
// A key on the Mermaid theme remounts it with a fresh id instead.
export default function MermaidWrapper(props: Props): JSX.Element {
  const { theme } = useMermaidConfig();
  const Original = Mermaid as unknown as (
    p: ComponentProps<typeof MermaidType>,
  ) => JSX.Element;
  return <Original key={String(theme)} {...props} />;
}
