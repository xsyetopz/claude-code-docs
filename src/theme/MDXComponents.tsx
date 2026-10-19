import MDXComponents from '@theme-original/MDXComponents';
import {makeBadge} from '@site/src/components/Badge';

export default {
  ...MDXComponents,
  Documented: makeBadge('documented'),
  Undocumented: makeBadge('undocumented'),
  Differs: makeBadge('differs'),
  Gated: makeBadge('gated'),
};
