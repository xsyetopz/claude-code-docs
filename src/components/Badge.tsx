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

type Props = { note?: string };

const Badge = ({ kind, note }: Props & { kind: Kind }): React.JSX.Element => {
  const { label, tip } = META[kind];
  return (
    <span
      className={`cc-badge cc-badge--${kind}`}
      title={note ? `${tip} ${note}` : tip}
    >
      {label}
    </span>
  );
};

export const Documented = (p: Props) => <Badge kind="documented" {...p} />;
export const Undocumented = (p: Props) => <Badge kind="undocumented" {...p} />;
export const Differs = (p: Props) => <Badge kind="differs" {...p} />;
export const Gated = (p: Props) => <Badge kind="gated" {...p} />;
export const ManagedOnly = (p: Props) => <Badge kind="managed-only" {...p} />;
export const Experimental = (p: Props) => <Badge kind="experimental" {...p} />;
export const Deprecated = (p: Props) => <Badge kind="deprecated" {...p} />;
export const Caution = (p: Props) => <Badge kind="caution" {...p} />;
