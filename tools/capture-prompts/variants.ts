// The list of system prompt variants to capture. Each one is one run of the binary against the local stub.
export type Variant = {
  id: string; // folder and page name
  title: string; // Title Case page title
  summary: string; // one sentence for the index table
  how: string; // how a user gets it (shown on the page)
  select: string; // short form for the index table
  model?: string; // --model (default claude-opus-5-5)
  args?: string[]; // extra CLI args
  env?: Record<string, string>;
  cfgFiles?: Record<string, string>; // files written into the config dir
  projFiles?: Record<string, string>; // files written into the project dir
  git?: boolean; // make the project a git repo with one commit
  prompt?: string; // the user prompt (default "hi")
  followUp?: string; // a second run with --continue, in the same folders
  tool?: { name: string; input: unknown }; // canned tool_use on the first turn
  pick?: "first" | "last" | "subagent" | "marker"; // which recorded request to use
  marker?: string; // with pick "marker": the request whose messages or system contain this text, other than the first
  baseline?: string; // variant id used for the diff
  status: "Documented" | "Undocumented" | "Differs" | "Gated";
  gatedNote?: string;
  can: { use: string; change: string; toggle: string; where: string };
};

export const LEAN_MODEL = "claude-opus-5-5";
export const SUB_MARK = "PROBE-SUBAGENT-TASK";
const STYLE_FILE = (keep: boolean) =>
  `---\nname: Probe Style\ndescription: A custom style used for the capture\n${keep ? "keep-coding-instructions: true\n" : ""}---\nPROBE-CUSTOM-STYLE-TEXT: answer in one short sentence.\n`;
const AGENT_FILE = `---\nname: probe-agent\ndescription: A custom agent used for the capture\n---\nPROBE-CUSTOM-AGENT-BODY: you are a probe agent. Say hello.\n`;
const settings = (o: unknown) => ["--settings", JSON.stringify(o)];
const subTool = (type: string) => ({
  name: "Agent",
  input: {
    description: "Probe task",
    prompt: `${SUB_MARK} say hi`,
    subagent_type: type,
  },
});

export const VARIANTS: Variant[] = [
  {
    id: "default-lean",
    title: "Default, Lean Prompt",
    model: LEAN_MODEL,
    summary: "The prompt that Opus 5.5 gets with no flags.",
    how: "Run `claude --model claude-opus-5-5` with no other prompt flags.",
    select: "Default on Opus 5.5",
    status: "Undocumented",
    can: {
      use: "Yes. Every session on a lean model gets it.",
      change: "Yes. Use the flags and settings on the other pages.",
      toggle:
        "`CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0` switches to the full prompt.",
      where: "Built into the program. Nothing on disk.",
    },
  },
  {
    id: "default-sonnet",
    title: "Default, Sonnet 5.5",
    model: "claude-sonnet-5-5",
    baseline: "default-lean",
    summary: "The prompt that Sonnet 5.5 gets with no flags.",
    how: "Run `claude --model claude-sonnet-5-5` with no other prompt flags.",
    select: "Default on Sonnet 5.5",
    status: "Documented",
    can: {
      use: "Yes. Every Sonnet 5.5 session gets it.",
      change: "Yes. Use the flags and settings on the other pages.",
      toggle:
        "`CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0` switches to the full prompt.",
      where: "Built into the program. Nothing on disk.",
    },
  },
  {
    id: "default-haiku",
    title: "Default, Haiku 5.5",
    model: "claude-haiku-5-5",
    baseline: "default-lean",
    summary: "The prompt that Haiku 5.5 gets with no flags.",
    how: "Run `claude --model claude-haiku-5-5` with no other prompt flags.",
    select: "Default on Haiku 5.5",
    status: "Undocumented",
    can: {
      use: "Yes. Every Haiku 5.5 session gets it.",
      change: "Yes. Use the flags and settings on the other pages.",
      toggle:
        "`CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0` switches to the full prompt.",
      where: "Built into the program. Nothing on disk.",
    },
  },
  {
    id: "full-prompt",
    title: "Full Prompt",
    model: LEAN_MODEL,
    env: { CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT: "0" },
    baseline: "default-lean",
    summary: "The long prompt, forced on a model that would get the lean one.",
    how: "Set `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0` before you start Claude Code.",
    select: "`CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0`",
    status: "Documented",
    can: {
      use: "Yes.",
      change: "Yes. Set or unset the env var.",
      toggle:
        "`CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0` (also `false`, `no`, `off`).",
      where:
        "Environment variable. Put it under `env` in `settings.json` to keep it.",
    },
  },
  {
    id: "simple-prompt-sonnet",
    title: "Simple Prompt Switch on Sonnet",
    model: "claude-sonnet-5-5",
    env: { CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT: "1" },
    baseline: "default-sonnet",
    summary: "`CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=1` on Sonnet 5.5.",
    how: "Set `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=1` and use `--model claude-sonnet-5-5`.",
    select: "`CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=1` on Sonnet",
    status: "Documented",
    can: {
      use: "Yes.",
      change: "Yes. Set or unset the env var.",
      toggle: "`CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=1`.",
      where: "Environment variable.",
    },
  },
  {
    id: "simple-prompt-haiku",
    title: "Simple Prompt Switch on Haiku",
    model: "claude-haiku-5-5",
    env: { CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT: "1" },
    baseline: "default-haiku",
    summary: "`CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=1` on Haiku 5.5.",
    how: "Set `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=1` and use `--model claude-haiku-5-5`.",
    select: "`CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=1` on Haiku",
    status: "Documented",
    can: {
      use: "Yes.",
      change: "Yes. Set or unset the env var.",
      toggle: "`CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=1`.",
      where: "Environment variable.",
    },
  },
  {
    id: "simple-prompt-opus",
    title: "Simple Prompt Switch on Opus",
    model: LEAN_MODEL,
    env: { CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT: "1" },
    baseline: "default-lean",
    summary: "`CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=1` on Opus 5.5.",
    how: "Set `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=1` and use `--model claude-opus-5-5`.",
    select: "`CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=1` on Opus",
    status: "Documented",
    can: {
      use: "Yes.",
      change: "Yes. Set or unset the env var.",
      toggle: "`CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=1`.",
      where: "Environment variable.",
    },
  },
  {
    id: "bare",
    title: "Bare Mode",
    model: LEAN_MODEL,
    args: ["--bare"],
    baseline: "default-lean",
    summary: "`--bare`: a two-line prompt and three tools.",
    how: "Run `claude --bare`.",
    select: "`--bare`",
    status: "Documented",
    can: {
      use: "Yes.",
      change: "No. The two lines are fixed.",
      toggle: "`--bare` or `CLAUDE_CODE_SIMPLE=1`.",
      where: "Command-line flag.",
    },
  },
  {
    id: "simple-env",
    title: "Simple Mode Env Var",
    model: LEAN_MODEL,
    env: { CLAUDE_CODE_SIMPLE: "1" },
    baseline: "default-lean",
    summary:
      "`CLAUDE_CODE_SIMPLE=1`: the same two-line prompt that `--bare` gives.",
    how: "Set `CLAUDE_CODE_SIMPLE=1` before you start Claude Code.",
    select: "`CLAUDE_CODE_SIMPLE=1`",
    status: "Documented",
    can: {
      use: "Yes.",
      change: "No. The two lines are fixed.",
      toggle: "`CLAUDE_CODE_SIMPLE=1`.",
      where: "Environment variable.",
    },
  },
  {
    id: "exclude-dynamic",
    title: "Exclude Dynamic Sections",
    model: LEAN_MODEL,
    args: ["--exclude-dynamic-system-prompt-sections"],
    baseline: "default-lean",
    summary:
      "Moves per-machine text from the system prompt into the first user message.",
    how: "Run `claude --exclude-dynamic-system-prompt-sections`.",
    select: "`--exclude-dynamic-system-prompt-sections`",
    status: "Documented",
    can: {
      use: "Yes.",
      change: "No. It only moves text.",
      toggle: "`--exclude-dynamic-system-prompt-sections`.",
      where: "Command-line flag.",
    },
  },
  {
    id: "exclude-dynamic-full",
    title: "Exclude Dynamic Sections, Full Prompt",
    model: LEAN_MODEL,
    env: { CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT: "0" },
    args: ["--exclude-dynamic-system-prompt-sections"],
    baseline: "full-prompt",
    summary: "The same flag on the full prompt.",
    how: "Run `claude --exclude-dynamic-system-prompt-sections` with `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0`.",
    select: "`--exclude-dynamic-system-prompt-sections` plus the full prompt",
    status: "Documented",
    can: {
      use: "Yes.",
      change: "No. It only moves text.",
      toggle: "`--exclude-dynamic-system-prompt-sections`.",
      where: "Command-line flag.",
    },
  },
  ...(["Explanatory", "Learning", "Proactive", "Concise"] as const).map(
    (s) => ({
      id: `style-${s.toLowerCase()}`,
      title: `Output Style, ${s}`,
      model: LEAN_MODEL,
      args: settings({ outputStyle: s }),
      baseline: "default-lean",
      summary: `The built-in ${s} output style on the lean prompt.`,
      how: `Run \`/output-style ${s}\`, or set \`"outputStyle": "${s}"\` in \`settings.json\`.`,
      select: `Output style \`${s}\``,
      status: "Documented" as const,
      can: {
        use: "Yes.",
        change: "Not the built-in text. You can write a custom style.",
        toggle: "`/output-style` or the `outputStyle` setting.",
        where: "`outputStyle` in any settings scope.",
      },
    }),
  ),
  {
    id: "style-custom",
    title: "Custom Output Style",
    model: LEAN_MODEL,
    args: settings({ outputStyle: "Probe Style" }),
    cfgFiles: { "output-styles/probe-style.md": STYLE_FILE(false) },
    baseline: "default-lean",
    summary:
      "A custom style file, without `keep-coding-instructions`, on the lean prompt.",
    how: "Save a Markdown file in `~/.claude/output-styles/` or `.claude/output-styles/`, then pick it with `/output-style`.",
    select: "Custom style file",
    status: "Documented",
    can: {
      use: "Yes.",
      change: "Yes. You write the file.",
      toggle: "`/output-style` or the `outputStyle` setting.",
      where: "`~/.claude/output-styles/*.md` or `.claude/output-styles/*.md`.",
    },
  },
  {
    id: "style-custom-full",
    title: "Custom Output Style on the Full Prompt",
    model: LEAN_MODEL,
    env: { CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT: "0" },
    args: settings({ outputStyle: "Probe Style" }),
    cfgFiles: { "output-styles/probe-style.md": STYLE_FILE(false) },
    baseline: "full-prompt",
    summary:
      "A custom style without `keep-coding-instructions`, on the full prompt. The coding section is dropped.",
    how: "Pick a custom style whose front matter does not set `keep-coding-instructions`, with the full prompt on.",
    select: "Custom style, full prompt",
    status: "Documented",
    can: {
      use: "Yes.",
      change: "Yes. You write the file.",
      toggle: "`/output-style` or the `outputStyle` setting.",
      where: "`~/.claude/output-styles/*.md` or `.claude/output-styles/*.md`.",
    },
  },
  {
    id: "style-custom-keep",
    title: "Custom Output Style with Keep Coding Instructions",
    model: LEAN_MODEL,
    env: { CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT: "0" },
    args: settings({ outputStyle: "Probe Style" }),
    cfgFiles: { "output-styles/probe-style.md": STYLE_FILE(true) },
    baseline: "full-prompt",
    summary:
      "A custom style with `keep-coding-instructions: true`, on the full prompt.",
    how: "Add `keep-coding-instructions: true` to the style's front matter, with the full prompt on.",
    select: "Custom style with `keep-coding-instructions`",
    status: "Documented",
    can: {
      use: "Yes.",
      change: "Yes. You write the file.",
      toggle: "`keep-coding-instructions` in the style's front matter.",
      where: "`~/.claude/output-styles/*.md` or `.claude/output-styles/*.md`.",
    },
  },
  {
    id: "style-custom-keep-lean",
    title: "Custom Output Style with Keep Coding Instructions, Lean Prompt",
    model: LEAN_MODEL,
    args: settings({ outputStyle: "Probe Style" }),
    cfgFiles: { "output-styles/probe-style.md": STYLE_FILE(true) },
    baseline: "style-custom",
    summary:
      "The same keep flag on the lean prompt. The diff shows whether it does anything.",
    how: "Add `keep-coding-instructions: true` to the style's front matter on a lean model.",
    select: "Custom style with `keep-coding-instructions`, lean",
    status: "Documented",
    can: {
      use: "Yes.",
      change: "Yes. You write the file.",
      toggle: "`keep-coding-instructions` in the style's front matter.",
      where: "`~/.claude/output-styles/*.md` or `.claude/output-styles/*.md`.",
    },
  },
  {
    id: "append-system-prompt",
    title: "Append System Prompt",
    model: LEAN_MODEL,
    args: ["--append-system-prompt", "APPENDED-TEXT-FROM-FLAG"],
    baseline: "default-lean",
    summary: "Adds your text to the end of the prompt.",
    how: 'Run `claude --append-system-prompt "your text"`. In `-p` mode, `--append-system-prompt-file` reads the text from a file.',
    select: "`--append-system-prompt`",
    status: "Documented",
    can: {
      use: "Yes.",
      change: "Yes. You give the text.",
      toggle: "`--append-system-prompt` or `--append-system-prompt-file`.",
      where: "Command-line flags.",
    },
  },
  {
    id: "system-prompt",
    title: "Replace System Prompt",
    model: LEAN_MODEL,
    args: ["--system-prompt", "REPLACEMENT-TEXT-FROM-FLAG"],
    baseline: "default-lean",
    summary: "Replaces the body of the prompt with your text.",
    how: 'Run `claude --system-prompt "your text"`, or `--system-prompt-file <file>`.',
    select: "`--system-prompt`",
    status: "Documented",
    can: {
      use: "Yes.",
      change: "Yes. You give the text.",
      toggle: "`--system-prompt` or `--system-prompt-file`.",
      where: "Command-line flags.",
    },
  },
  {
    id: "system-prompt-append",
    title: "Replace and Append Together",
    model: LEAN_MODEL,
    args: [
      "--system-prompt",
      "REPLACEMENT-TEXT-FROM-FLAG",
      "--append-system-prompt",
      "APPENDED-TEXT-FROM-FLAG",
    ],
    baseline: "system-prompt",
    summary: "Both flags together.",
    how: 'Run `claude --system-prompt "A" --append-system-prompt "B"`.',
    select: "`--system-prompt` plus `--append-system-prompt`",
    status: "Documented",
    can: {
      use: "Yes.",
      change: "Yes. You give the text.",
      toggle: "The two flags.",
      where: "Command-line flags.",
    },
  },
  {
    id: "claude-md",
    title: "With a CLAUDE.md File",
    model: LEAN_MODEL,
    projFiles: { "CLAUDE.md": "PROBE-CLAUDE-MD-LINE: use tabs.\n" },
    baseline: "default-lean",
    summary: "Where project memory files land.",
    how: "Put a `CLAUDE.md` file in the project folder.",
    select: "A `CLAUDE.md` file",
    status: "Documented",
    can: {
      use: "Yes.",
      change: "Yes. You write the file.",
      toggle:
        "Add or remove the file. `CLAUDE_CODE_DISABLE_CLAUDE_MDS=1` skips them.",
      where: "`CLAUDE.md`, `.claude/CLAUDE.md`, `~/.claude/CLAUDE.md`.",
    },
  },
  {
    id: "git-repo",
    title: "Inside a Git Repository",
    model: LEAN_MODEL,
    git: true,
    baseline: "default-lean",
    summary: "What changes when the project is a git repository.",
    how: "Start Claude Code in a folder that is a git repository.",
    select: "A git repository",
    status: "Undocumented",
    can: {
      use: "Yes. It happens on its own.",
      change: "No.",
      toggle:
        "`includeGitInstructions` in settings controls the git rules. The status text always appears in a repo.",
      where: "Built into the program.",
    },
  },
  {
    id: "agent-main",
    title: "Main Thread Custom Agent",
    model: LEAN_MODEL,
    args: ["--agent", "probe-agent"],
    projFiles: { ".claude/agents/probe-agent.md": AGENT_FILE },
    baseline: "default-lean",
    summary: "Running the whole session as a custom agent.",
    how: "Save an agent file in `.claude/agents/`, then run `claude --agent <name>`.",
    select: "`--agent <name>`",
    status: "Documented",
    can: {
      use: "Yes.",
      change: "Yes. You write the agent file.",
      toggle: "`--agent` or the `agent` setting.",
      where: "`.claude/agents/*.md` or `~/.claude/agents/*.md`.",
    },
  },
  ...(["plan", "acceptEdits", "dontAsk"] as const).map((m) => ({
    id: `mode-${m}`,
    title: `Permission Mode, ${({ plan: "Plan", acceptEdits: "Accept Edits", dontAsk: "Don't Ask" } as Record<string, string>)[m]}`,
    model: LEAN_MODEL,
    args: ["--permission-mode", m],
    baseline: "default-lean",
    summary: `Starts in \`${m}\` permission mode.`,
    how: `Run \`claude --permission-mode ${m}\`.`,
    select: `\`--permission-mode ${m}\``,
    status: "Documented" as const,
    can: {
      use: "Yes.",
      change: "No.",
      toggle: "`--permission-mode` or `defaultMode` in settings.",
      where: "Flag or settings.",
    },
  })),
  {
    id: "brief",
    title: "Brief Mode",
    model: LEAN_MODEL,
    args: ["--brief"],
    baseline: "default-lean",
    summary: "`--brief` adds rules for the `SendUserMessage` tool.",
    how: "Run `claude --brief`.",
    select: "`--brief`",
    status: "Undocumented",
    can: {
      use: "Yes.",
      change: "No.",
      toggle: "`--brief`.",
      where: "Command-line flag.",
    },
  },
  {
    id: "compact",
    title: "Compaction Prompt",
    model: LEAN_MODEL,
    followUp: "/compact",
    pick: "last",
    baseline: "default-lean",
    summary: "The request that summarizes a conversation.",
    how: "Run `/compact` in a session with some history.",
    select: "`/compact`",
    status: "Undocumented",
    can: {
      use: "Yes.",
      change: "Partly. You can add focus text after `/compact`.",
      toggle: "`/compact`, or automatic when the context fills.",
      where: "Built into the program.",
    },
  },
  ...(["general-purpose", "Explore", "Plan"] as const).map((t) => ({
    id: `subagent-${t.toLowerCase()}`,
    title: `Subagent, ${t === "general-purpose" ? "General Purpose" : t}`,
    model: LEAN_MODEL,
    tool: subTool(t),
    pick: "subagent" as const,
    baseline: "default-lean",
    summary: `The prompt that a \`${t}\` subagent gets.`,
    how: `The main agent calls the \`Agent\` tool with \`subagent_type: "${t}"\`.`,
    select: `\`Agent\` tool, \`${t}\``,
    status: "Undocumented" as const,
    can: {
      use: "Yes. The model starts subagents.",
      change: "Not the built-in text. You can write custom agents.",
      toggle: "`--disallowedTools Agent` stops all subagents.",
      where: "Built into the program.",
    },
  })),
  {
    id: "subagent-custom",
    title: "Subagent, Custom Agent",
    model: LEAN_MODEL,
    tool: subTool("probe-agent"),
    projFiles: { ".claude/agents/probe-agent.md": AGENT_FILE },
    pick: "subagent",
    baseline: "default-lean",
    summary: "The prompt of a subagent you defined in `.claude/agents/`.",
    how: "Save an agent file in `.claude/agents/`. The main agent can then start it.",
    select: "Custom agent file",
    status: "Documented",
    can: {
      use: "Yes.",
      change: "Yes. You write the agent file.",
      toggle: "Add or remove the file.",
      where: "`.claude/agents/*.md` or `~/.claude/agents/*.md`.",
    },
  },
];

// ---- Overridable prompts: built-in agents, override tests, built-in commands, helper requests ----
const OV_AGENT = (name: string, mark: string) =>
  `---\nname: ${name}\ndescription: A user agent that has the same name as a built-in agent\n---\n${mark}: you replace the built-in ${name} agent. Say hello.\n`;
const ovCan = (change: string, toggle: string, where: string) => ({
  use: "Yes.",
  change,
  toggle,
  where,
});

VARIANTS.push(
  ...(["statusline-setup", "claude"] as const).map((t) => ({
    id: `subagent-${t}`,
    title: `Subagent, ${t === "claude" ? "Claude (FleetView)" : "Statusline Setup"}`,
    model: LEAN_MODEL,
    tool: subTool(t),
    pick: "subagent" as const,
    baseline: "subagent-general-purpose",
    summary: `The prompt that a \`${t}\` subagent gets.`,
    how: `The main agent calls the \`Agent\` tool with \`subagent_type: "${t}"\`.`,
    select: `\`Agent\` tool, \`${t}\``,
    status: "Undocumented" as const,
    can: ovCan(
      "Yes. A user agent file with the same name replaces it.",
      "`--disallowedTools Agent` stops all subagents.",
      "Built into the program. Override in `.claude/agents/<name>.md`.",
    ),
  })),
  {
    id: "subagent-web-fetch",
    title: "Subagent, Web Fetch",
    model: LEAN_MODEL,
    env: { CLAUDE_CODE_WEB_FETCH_AGENT: "1" },
    tool: subTool("web-fetch"),
    pick: "subagent",
    baseline: "subagent-general-purpose",
    summary: "The prompt that the built-in web-reading subagent gets.",
    how: 'Set `CLAUDE_CODE_WEB_FETCH_AGENT=1`. The main agent then calls the `Agent` tool with `subagent_type: "web-fetch"`.',
    select: "`CLAUDE_CODE_WEB_FETCH_AGENT=1`, `Agent` tool, `web-fetch`",
    status: "Undocumented",
    can: ovCan(
      "Yes. A user agent file with the same name replaces it.",
      "`CLAUDE_CODE_WEB_FETCH_AGENT=1` adds it. `CLAUDE_CODE_DISABLE_WEB_FETCH` removes it.",
      "Built into the program. Override in `.claude/agents/web-fetch.md`.",
    ),
  },
  {
    id: "override-agent-file",
    title: "Override a Built-in Agent with a File",
    model: LEAN_MODEL,
    tool: subTool("Explore"),
    projFiles: {
      ".claude/agents/Explore.md": OV_AGENT("Explore", "PROBE-OVERRIDE-FILE"),
    },
    pick: "subagent",
    baseline: "subagent-explore",
    summary:
      "A project agent file named `Explore` takes the place of the built-in `Explore` agent.",
    how: "Save `.claude/agents/Explore.md` with `name: Explore` in its front matter.",
    select: "Agent file with a built-in name",
    status: "Undocumented",
    can: ovCan(
      "Yes. You write the agent file.",
      "Add or remove the file.",
      "`.claude/agents/*.md` or `~/.claude/agents/*.md`.",
    ),
  },
  {
    id: "override-agents-flag",
    title: "Override a Built-in Agent with --agents",
    model: LEAN_MODEL,
    tool: subTool("general-purpose"),
    args: [
      "--agents",
      JSON.stringify({
        "general-purpose": {
          description: "Replacement for the built-in agent",
          prompt: "PROBE-OVERRIDE-FLAG: you replace the built-in agent.",
        },
      }),
    ],
    pick: "subagent",
    baseline: "subagent-general-purpose",
    summary:
      "The `--agents` JSON flag defines an agent with a built-in name and wins over the built-in one.",
    how: 'Run `claude --agents \'{"general-purpose":{"description":"...","prompt":"..."}}\'`.',
    select: "`--agents` with a built-in name",
    status: "Documented",
    can: ovCan("Yes. You give the JSON.", "`--agents`.", "Command-line flag."),
  },
  {
    id: "override-append-subagent",
    title: "Append to Every Subagent Prompt",
    model: LEAN_MODEL,
    tool: subTool("Explore"),
    args: ["--append-subagent-system-prompt", "PROBE-APPEND-SUBAGENT-TEXT"],
    pick: "subagent",
    baseline: "subagent-explore",
    summary: "Adds your text to the end of the prompt of every subagent.",
    how: 'Run `claude -p --append-subagent-system-prompt "your text"`, or `--append-subagent-system-prompt-file <file>`.',
    select: "`--append-subagent-system-prompt`",
    status: "Undocumented",
    can: ovCan(
      "Yes. You give the text.",
      "`--append-subagent-system-prompt` or `--append-subagent-system-prompt-file` (print mode only).",
      "Command-line flags.",
    ),
  },
  {
    id: "disable-explore-plan",
    title: "Turn Off the Explore and Plan Agents",
    model: LEAN_MODEL,
    env: { CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS: "1" },
    baseline: "default-lean",
    summary:
      "`CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS=1` removes two built-in agents from the main prompt.",
    how: "Set `CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS=1` before you start Claude Code.",
    select: "`CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS=1`",
    status: "Undocumented",
    can: ovCan(
      "Yes. It removes text.",
      "`CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS=1`.",
      "Environment variable.",
    ),
  },
  {
    id: "disable-builtin-agents",
    title: "Turn Off All Built-in Agents",
    model: LEAN_MODEL,
    env: { CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS: "1" },
    baseline: "default-lean",
    summary:
      "`CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS=1` removes every built-in agent in print mode.",
    how: "Set `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS=1` and use print mode.",
    select: "`CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS=1`",
    status: "Undocumented",
    can: ovCan(
      "Yes. It removes text.",
      "`CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS=1`.",
      "Environment variable.",
    ),
  },
);

const OV_CMD = (mark: string) =>
  `---\ndescription: A user command that has the same name as a built-in one\n---\n${mark}: this text replaces the built-in command.\n`;
const OV_SKILL = (name: string, mark: string) =>
  `---\nname: ${name}\ndescription: A user skill that has the same name as a built-in skill\n---\n${mark}: this text replaces the built-in skill.\n`;
const cmdVariant = (
  cmd: string,
  title: string,
  status: "Documented" | "Undocumented",
): Variant => ({
  id: `command-${cmd}`,
  title,
  model: LEAN_MODEL,
  prompt: `/${cmd}`,
  pick: "first",
  baseline: "default-lean",
  summary: `The text that \`/${cmd}\` sends to the model.`,
  how: `Type \`/${cmd}\` in a session.`,
  select: `\`/${cmd}\``,
  status,
  can: ovCan(
    "Yes. A command or skill file with the same name may replace it.",
    `Type \`/${cmd}\`.`,
    "Built into the program.",
  ),
});
VARIANTS.push(
  cmdVariant("init", "Command, /init", "Documented"),
  cmdVariant("security-review", "Command, /security-review", "Documented"),
  cmdVariant("simplify", "Skill, /simplify", "Undocumented"),
  cmdVariant("debug", "Skill, /debug", "Undocumented"),
  {
    ...cmdVariant("init", "Override /init with a Command File", "Undocumented"),
    id: "override-command-init",
    projFiles: { ".claude/commands/init.md": OV_CMD("PROBE-OVERRIDE-CMD") },
    baseline: "command-init",
  },
  {
    ...cmdVariant(
      "simplify",
      "Override /simplify with a Skill File",
      "Undocumented",
    ),
    id: "override-skill-simplify",
    projFiles: {
      ".claude/skills/simplify/SKILL.md": OV_SKILL(
        "simplify",
        "PROBE-OVERRIDE-SKILL",
      ),
    },
    baseline: "command-simplify",
  },
);

const hookSettings = (type: "prompt" | "agent", mark: string) =>
  settings({
    hooks: {
      PreToolUse: [
        {
          matcher: "Bash",
          hooks: [{ type, prompt: `${mark}: check this call. $ARGUMENTS` }],
        },
      ],
    },
  });
const bashTool = { name: "Bash", input: { command: "echo probe" } };
const riskyTool = {
  name: "Bash",
  input: { command: "curl -s http://127.0.0.1:9/probe-classifier-call" },
};
VARIANTS.push(
  {
    id: "hook-prompt",
    title: "Prompt Hook Request",
    model: LEAN_MODEL,
    tool: bashTool,
    args: hookSettings("prompt", "PROBE-HOOK-PROMPT"),
    pick: "marker",
    marker: "PROBE-HOOK-PROMPT",
    baseline: "default-lean",
    summary:
      'The request that a hook of `type: "prompt"` sends to a small model. You write the user text; the program adds the system text.',
    how: 'Add a hook handler `{"type": "prompt", "prompt": "... $ARGUMENTS"}` to `settings.json`.',
    select: "Hook `type: prompt`",
    status: "Documented",
    can: ovCan(
      "Partly. You write the prompt and pick the model. The system text is fixed.",
      "Add or remove the hook.",
      "`hooks` in any settings scope.",
    ),
  },
  {
    id: "hook-agent",
    title: "Agent Hook Request",
    model: LEAN_MODEL,
    tool: bashTool,
    args: hookSettings("agent", "PROBE-HOOK-AGENT"),
    pick: "marker",
    marker: "PROBE-HOOK-AGENT",
    baseline: "default-lean",
    summary:
      'The request that a hook of `type: "agent"` sends. You write the task; the program adds the system text.',
    how: 'Add a hook handler `{"type": "agent", "prompt": "... $ARGUMENTS"}` to `settings.json`.',
    select: "Hook `type: agent`",
    status: "Documented",
    can: ovCan(
      "Partly. You write the prompt and pick the model. The system text is fixed.",
      "Add or remove the hook.",
      "`hooks` in any settings scope.",
    ),
  },
);

const autoArgs = (auto?: unknown) => [
  "--permission-mode",
  "auto",
  ...(auto ? settings({ autoMode: auto }) : []),
];
VARIANTS.push(
  {
    id: "auto-classifier",
    title: "Auto Mode Classifier",
    model: LEAN_MODEL,
    tool: riskyTool,
    args: autoArgs(),
    pick: "marker",
    marker: "probe-classifier-call",
    baseline: "default-lean",
    summary: "The request that the auto mode classifier sends for a tool call.",
    how: "Run `claude --permission-mode auto`. The classifier runs when the model calls a tool that no rule already allows.",
    select: "`--permission-mode auto`",
    status: "Documented",
    can: ovCan(
      "Partly. The `autoMode` setting edits the rule lists.",
      '`--permission-mode auto` or `defaultMode: "auto"`.',
      "`autoMode` in user, local, flag, or managed settings.",
    ),
  },
  {
    id: "auto-classifier-custom",
    title: "Auto Mode Classifier, Custom Rules",
    model: LEAN_MODEL,
    tool: riskyTool,
    args: autoArgs({
      allow: ["PROBE-AUTO-ALLOW", "$defaults"],
      soft_deny: ["PROBE-AUTO-SOFT"],
      hard_deny: ["PROBE-AUTO-HARD", "$defaults"],
      environment: ["PROBE-AUTO-ENV", "$defaults"],
    }),
    pick: "marker",
    marker: "probe-classifier-call",
    baseline: "auto-classifier",
    summary:
      "The same classifier request with `autoMode` rules in the settings. `$defaults` keeps the built-in rules in that list; without it they are replaced.",
    how: 'Set `autoMode` in settings: `{"allow": ["...", "$defaults"], "soft_deny": [...], "hard_deny": [...], "environment": [...]}`.',
    select: "`autoMode` setting",
    status: "Documented",
    can: ovCan(
      "Yes. You write the rules.",
      "`autoMode` setting.",
      "`autoMode` in user, local, flag, or managed settings.",
    ),
  },
);

VARIANTS.push(
  {
    id: "compact-custom",
    title: "Compaction Prompt, Custom Instructions",
    model: LEAN_MODEL,
    followUp: "/compact PROBE-COMPACT-ARG keep the file names",
    projFiles: {
      "CLAUDE.md":
        "# Notes\n\n## Compact Instructions\nPROBE-COMPACT-MD: keep test output.\n",
    },
    args: settings({
      hooks: {
        PreCompact: [
          {
            hooks: [{ type: "command", command: "echo PROBE-COMPACT-HOOK" }],
          },
        ],
      },
    }),
    pick: "last",
    baseline: "compact",
    summary:
      "The compaction request with the three ways to add your own instructions.",
    how: "Add text after `/compact`, add a `## Compact Instructions` section to `CLAUDE.md`, or print text from a `PreCompact` hook.",
    select: "`/compact <text>`, CLAUDE.md, or `PreCompact` hook",
    status: "Documented",
    can: ovCan(
      "Yes. You add focus text. The base summary rules stay.",
      "`/compact <text>`.",
      "The command line, `CLAUDE.md`, or a `PreCompact` hook.",
    ),
  },
  {
    id: "plan-mode-instructions",
    title: "Plan Mode, Custom Workflow",
    model: LEAN_MODEL,
    args: [
      "--permission-mode",
      "plan",
      "--plan-mode-instructions",
      "PROBE-PLAN-WORKFLOW: write a one-line plan.",
    ],
    baseline: "mode-plan",
    summary:
      "`--plan-mode-instructions` replaces the workflow phases in the plan mode reminder.",
    how: 'Run `claude --permission-mode plan --plan-mode-instructions "your workflow"`.',
    select: "`--plan-mode-instructions`",
    status: "Undocumented",
    can: ovCan(
      "Yes. You give the workflow text. The read-only rules and the `ExitPlanMode` rule stay.",
      "`--plan-mode-instructions`.",
      "Command-line flag.",
    ),
  },
  {
    id: "git-instructions-off",
    title: "Git Instructions Turned Off",
    model: LEAN_MODEL,
    git: true,
    args: settings({ includeGitInstructions: false }),
    baseline: "git-repo",
    summary:
      "`includeGitInstructions: false` removes the built-in commit and pull request rules.",
    how: 'Set `"includeGitInstructions": false` in `settings.json`, or set `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS=1`.',
    select: "`includeGitInstructions: false`",
    status: "Documented",
    can: ovCan(
      "Yes. It removes text.",
      "`includeGitInstructions` or `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS=1`.",
      "Any settings scope, or an environment variable.",
    ),
  },
  {
    id: "memory-off",
    title: "Auto Memory Turned Off",
    model: LEAN_MODEL,
    env: { CLAUDE_CODE_DISABLE_AUTO_MEMORY: "1" },
    baseline: "default-lean",
    summary: "`CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` removes the memory section.",
    how: 'Set `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`, or `"autoMemoryEnabled": false` in `settings.json`.',
    select: "`CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`",
    status: "Documented",
    can: ovCan(
      "Yes. It removes text.",
      "`CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` or `autoMemoryEnabled`.",
      "Environment variable or any settings scope.",
    ),
  },
  {
    id: "style-override-builtin",
    title: "Custom Output Style with a Built-in Name",
    model: LEAN_MODEL,
    args: settings({ outputStyle: "Explanatory" }),
    cfgFiles: {
      "output-styles/explanatory.md":
        "---\nname: Explanatory\ndescription: A user style with a built-in name\n---\nPROBE-STYLE-OVERRIDE: answer in one short sentence.\n",
    },
    baseline: "style-explanatory",
    summary:
      "A style file named `Explanatory` takes the place of the built-in style.",
    how: "Save `~/.claude/output-styles/explanatory.md` with `name: Explanatory` in its front matter.",
    select: "Style file with a built-in name",
    status: "Undocumented",
    can: ovCan(
      "Yes. You write the file.",
      "`/output-style` or the `outputStyle` setting.",
      "`~/.claude/output-styles/*.md` or `.claude/output-styles/*.md`.",
    ),
  },
);

VARIANTS.push(
  {
    id: "subagent-with-prompt-flags",
    title: "Subagent with --system-prompt and --append-system-prompt",
    model: LEAN_MODEL,
    args: [
      "--system-prompt",
      "REPLACEMENT-TEXT-FROM-FLAG",
      "--append-system-prompt",
      "APPENDED-TEXT-FROM-FLAG",
    ],
    tool: subTool("Explore"),
    pick: "subagent",
    baseline: "subagent-explore",
    summary:
      "Shows whether the main-thread prompt flags reach a built-in subagent.",
    how: 'Run `claude --system-prompt "A" --append-system-prompt "B"`, then let the model start the `Explore` agent.',
    select: "Prompt flags plus a subagent",
    status: "Undocumented",
    can: ovCan(
      "Not for the subagent. Use `--append-subagent-system-prompt`.",
      "The flags.",
      "Command-line flags.",
    ),
  },
  {
    id: "hook-prompt-stop",
    title: "Prompt Hook on Stop",
    model: LEAN_MODEL,
    args: settings({
      hooks: {
        Stop: [
          {
            hooks: [
              { type: "prompt", prompt: "PROBE-HOOK-STOP: is the work done?" },
            ],
          },
        ],
      },
    }),
    pick: "marker",
    marker: "PROBE-HOOK-STOP",
    baseline: "hook-prompt",
    summary:
      "A prompt hook on the `Stop` event gets a different system text from a tool hook.",
    how: 'Add a `{"type": "prompt", "prompt": "..."}` handler under `Stop` in `settings.json`.',
    select: "Hook `type: prompt` on `Stop`",
    status: "Documented",
    can: ovCan(
      "Partly. You write the prompt and pick the model. The system text is fixed.",
      "Add or remove the hook.",
      "`hooks` in any settings scope.",
    ),
  },
);
