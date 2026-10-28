import "@mantine/core/styles/baseline.layer.css";
import "@mantine/core/styles/default-css-variables.layer.css";
import "@mantine/core/styles/global.layer.css";
import "@mantine/core/styles/Badge.layer.css";
import "@mantine/core/styles/Tooltip.layer.css";
import "@mantine/core/styles/Popover.layer.css";
import "@mantine/core/styles/Paper.layer.css";
import "@mantine/core/styles/List.layer.css";
import "@mantine/core/styles/Title.layer.css";
import "@mantine/core/styles/Text.layer.css";
import "@mantine/core/styles/Anchor.layer.css";
import "@mantine/core/styles/Group.layer.css";
import "@mantine/core/styles/Stack.layer.css";
import "@mantine/core/styles/VisuallyHidden.layer.css";

import { createTheme, MantineProvider } from "@mantine/core";
import type React from "react";
import { useEffect, useState } from "react";

type Scheme = "light" | "dark";

// The old hero stacked its key rows at 480px. Keep that breakpoint.
const theme = createTheme({ breakpoints: { xs: "30.0625em" } });

const read = (): Scheme =>
  typeof document !== "undefined" &&
  document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";

// Root sits above the Docusaurus color-mode provider, so it cannot call
// useColorMode(). It copies the data-theme attribute of <html> instead.
export default function Root({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  // Read on the first client render, so a dark reader never sees a light frame.
  const [scheme, setScheme] = useState<Scheme>(read);

  useEffect(() => {
    const html = document.documentElement;
    const sync = () => {
      const next = read();
      html.setAttribute("data-mantine-color-scheme", next);
      setScheme(next);
    };
    sync();
    if (typeof MutationObserver === "undefined") return;
    const observer = new MutationObserver(sync);
    observer.observe(html, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <MantineProvider
      theme={theme}
      cssVariablesSelector="html"
      forceColorScheme={scheme}
      getRootElement={() =>
        typeof document === "undefined" ? undefined : document.documentElement
      }
    >
      {children}
    </MantineProvider>
  );
}
