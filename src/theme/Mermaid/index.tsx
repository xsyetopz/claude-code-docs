import { useMermaidConfig } from "@docusaurus/theme-mermaid/client";
import type { WrapperProps } from "@docusaurus/types";
import type MermaidType from "@theme/Mermaid";
import Mermaid from "@theme-original/Mermaid";
import {
  type ComponentProps,
  type JSX,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

type Props = WrapperProps<typeof MermaidType>;

// Mermaid sizes each node from the width of its label, measured at render
// time. The theme fonts load on demand, so a render that starts early measures
// a fallback font and the real text then spills out of its box. Load the two
// faces first, then render.
const FONTS = ['400 16px "Lora"', '400 16px "IBM Plex Mono"'];

const useFontsReady = (): boolean => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let live = true;
    const done = () => live && setReady(true);
    if (!document.fonts) {
      done();
      return;
    }
    Promise.all(FONTS.map((f) => document.fonts.load(f)))
      .then(() => document.fonts.ready)
      .then(done, done);
    return () => {
      live = false;
    };
  }, []);
  return ready;
};

// A diagram never shrinks below this share of its natural size. At the 16px
// Mermaid font that keeps text at 12px or more. A diagram wider than its
// column scrolls sideways instead of shrinking.
const MIN_SCALE = 0.75;

const useMinWidth = (host: RefObject<HTMLElement | null>): void => {
  useEffect(() => {
    const el = host.current;
    if (!el) {
      return;
    }
    const apply = () => {
      const svg = el.querySelector("svg");
      const box = svg?.viewBox.baseVal;
      if (!(svg && box?.width)) {
        return;
      }
      svg.style.minWidth = `${Math.round(box.width * MIN_SCALE)}px`;
      el.tabIndex = el.scrollWidth > el.clientWidth ? 0 : -1;
    };
    apply();
    const watch = new MutationObserver(apply);
    watch.observe(el, { childList: true, subtree: true });
    window.addEventListener("resize", apply);
    return () => {
      watch.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [host]);
};

// The stock component keeps one random id for its whole life. When the color
// mode changes after the first render (a stored dark theme), it renders the
// same id twice at once, and all but one diagram on a page come out empty.
// A key on the Mermaid theme remounts it with a fresh id instead.
const MermaidWrapper = (props: Props): JSX.Element => {
  const { theme } = useMermaidConfig();
  const ready = useFontsReady();
  const host = useRef<HTMLElement>(null);
  useMinWidth(host);
  const Original = Mermaid as unknown as (
    p: ComponentProps<typeof MermaidType>,
  ) => JSX.Element;
  return (
    <figure ref={host} className="cc-mermaid-scroll" aria-label="Diagram">
      {ready ? <Original key={String(theme)} {...props} /> : null}
    </figure>
  );
};

export default MermaidWrapper;
