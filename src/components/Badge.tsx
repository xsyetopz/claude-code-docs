import React from 'react';

type Kind = 'documented' | 'undocumented' | 'differs' | 'gated';

const META: Record<Kind, {label: string; tip: string}> = {
  documented: {label: 'Documented', tip: 'An official docs page names this item.'},
  undocumented: {
    label: 'Undocumented',
    tip: 'Only the program shows this item. It can change without notice.',
  },
  differs: {label: 'Differs', tip: 'The official docs and the program disagree. The row says how.'},
  gated: {label: 'Gated', tip: 'Works only behind a flag or a server gate.'},
};

const STYLE_BASE: React.CSSProperties = {
  display: 'inline-block',
  padding: '0.05rem 0.55rem',
  borderRadius: '999px',
  fontSize: '0.75rem',
  fontWeight: 600,
  lineHeight: 1.5,
  whiteSpace: 'nowrap',
  verticalAlign: 'middle',
  cursor: 'help',
  marginRight: '0.25rem',
};

export function makeBadge(kind: Kind) {
  const {label, tip} = META[kind];
  return function BadgeComponent({note}: {note?: string}): React.JSX.Element {
    const title = note ? `${tip} ${note}` : tip;
    return (
      <span
        className={`cc-badge cc-badge--${kind}`}
        title={title}
        style={{
          ...STYLE_BASE,
          background: `var(--cc-badge-${kind}-bg)`,
          color: `var(--cc-badge-${kind}-fg)`,
        }}>
        {label}
      </span>
    );
  };
}
