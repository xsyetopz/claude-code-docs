import Link from "@docusaurus/Link";
import { makeBadge } from "@site/src/components/Badge";
import { CLAUDE_CODE_VERSION } from "@site/src/version";
import type React from "react";

const Documented = makeBadge("documented");
const Undocumented = makeBadge("undocumented");
const Differs = makeBadge("differs");
const Gated = makeBadge("gated");

export default function Hero(): React.JSX.Element {
  return (
    <header className="cc-hero">
      <h1>Every Part of Claude Code You Can Use or Change</h1>
      <p className="cc-hero__lede">
        Unofficial community docs for version <code>{CLAUDE_CODE_VERSION}</code>
        , built from the official docs and the program itself. Not made by or
        tied to Anthropic. For supported behavior, check the official docs
        first.
      </p>
      <ul className="cc-hero__key">
        <li>
          <Documented /> <span>An official docs page names it.</span>
        </li>
        <li>
          <Undocumented />{" "}
          <span>Only the program shows it. It can change without notice.</span>
        </li>
        <li>
          <Differs />{" "}
          <span>The docs and the program disagree. The row says how.</span>
        </li>
        <li>
          <Gated /> <span>It works only behind a flag or a server gate.</span>
        </li>
      </ul>
      <div className="cc-hero__links">
        <Link to="/start/how-to-read">Start with How to Read These Docs</Link>
        <Link to="/reference/undocumented">See What the Docs Leave Out</Link>
      </div>
    </header>
  );
}
