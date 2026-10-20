import type React from "react";

type Kind =
  | "documented"
  | "undocumented"
  | "differs"
  | "gated"
  | "managed-only"
  | "experimental"
  | "deprecated"
  | "caution";

const META: Record<Kind, { label: string; tip: string }> = {
  documented: {
    label: "Documented",
    tip: "An official docs page names this item.",
  },
  undocumented: {
    label: "Undocumented",
    tip: "Only the program shows this item. It can change without notice.",
  },
  differs: {
    label: "Differs",
    tip: "The official docs and the program disagree. The row says how.",
  },
  gated: { label: "Gated", tip: "Works only behind a flag or a server gate." },
  "managed-only": {
    label: "Managed Only",
    tip: "Works only in managed (organization policy) settings.",
  },
  experimental: {
    label: "Experimental",
    tip: "The program or the official docs call this experimental or beta.",
  },
  deprecated: {
    label: "Deprecated",
    tip: "The program or the official docs call this deprecated.",
  },
  caution: {
    label: "Caution",
    tip: "It deletes data, skips a safety check, or sends data off your machine.",
  },
};

export const makeBadge = (kind: Kind) => {
  const { label, tip } = META[kind];
  return function BadgeComponent({
    note,
  }: {
    note?: string;
  }): React.JSX.Element {
    const title = note ? `${tip} ${note}` : tip;
    return (
      <span className={`cc-badge cc-badge--${kind}`} title={title}>
        {label}
      </span>
    );
  };
};
