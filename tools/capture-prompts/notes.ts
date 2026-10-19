// Hand-written text for the pages. Facts here come from the captures; the wiki is cited where a capture disagrees.

export const BADGE_NOTES: Record<string, string> = {};

export const NOTES: Record<string, string[]> = {
  "default-lean": [
    "The body (the third `system` block) is short. It has the headings `Harness`, `Session-specific guidance`, `Memory`, `Environment`, and `Context management`.",
    "The environment details (working folder, platform, shell, agent types, skills, and date) are not in `system`. They come in a separate message with the role `system`. Look for `messages[1]`.",
    "The first user message holds a reminder about the git attribution lines. Your own text comes after it.",
    "In `-p` mode, the identity line (`system[1]`) is the SDK line: `You are a Claude agent, built on Anthropic's Claude Agent SDK.` The interactive terminal app uses a different line. See [Captured System Prompts](./index.md#identity-line).",
  ],
  "default-sonnet": [
    "Sonnet 5.5 gets the same lean prompt as Opus 5.5. Only the model name, the model ID, and the commit trailer change.",
    "The old wiki says Sonnet gets the full prompt. The capture shows it does not in 2.1.303, and the official docs agree with the capture.",
  ],
  "default-haiku": [
    "Haiku 5.5 gets the lean prompt, then five extra paragraphs at the end of the body. They tell the model to finish the whole request, to avoid ending the turn early, and to act when it can name the likely reading of the request.",
    "The old wiki says the prompt for Haiku is the full one. The capture shows the lean prompt with extra text, not the full prompt.",
  ],
  "full-prompt": [
    "The full prompt has many more headings: `System`, `Doing tasks`, `Executing actions with care`, `Using your tools`, `Tone and style`, `Text output`, `Session-specific guidance`, `auto memory`, `Environment`, and `Context management`.",
    "The `auto memory` section is much longer than the lean `Memory` section.",
    "The tool list is the same as the default.",
  ],
  "simple-prompt-sonnet": [
    'The text and tools are the same as the default on Sonnet 5.5. In this release the "short" prompt is already what Sonnet gets.',
  ],
  "simple-prompt-haiku": [
    "The text is the same as the default on Haiku 5.5. The extra paragraphs stay, so they are not part of the full or short switch.",
  ],
  "simple-prompt-opus": ["The text is the same as the default on Opus 5.5."],
  bare: [
    "The body has two lines: `CWD: <cwd>` and `Date: <date>`. Nothing else.",
    "The environment message is empty, so no agent list and no skill list reach the model.",
    "Only three tools are sent. See [Tools per Variant](./tools-per-variant.md).",
    "The user message has no git attribution reminder.",
  ],
  "simple-env": [
    "Same text and tools as `--bare`. `--bare` sets `CLAUDE_CODE_SIMPLE`, so the two are one switch in this capture.",
  ],
  "exclude-dynamic": [
    "The `Environment` and `Context management` sections stay in the body, so they can be cached across machines.",
    "The `Memory` section, with the memory folder path, moves into the first user message. The `Session-specific guidance` section is gone from the body.",
    "The fast-mode sentence is gone from the `Environment` section.",
    "The environment message (working folder, platform) stays in the same place as before.",
  ],
  "exclude-dynamic-full": [
    "On the full prompt the flag moves the same kinds of text: the memory section goes to the first user message and the working-folder data stays out of the shared body.",
  ],
  "style-explanatory": [
    'The first line of the body changes to say that the agent follows an "Output Style".',
    "The style text lands after the model line, in the same message as the environment details, under `# Output Style: Explanatory`.",
    "A short reminder, `Explanatory output style is active.`, goes in near the end of that message.",
  ],
  "style-learning": [
    "The same places as `Explanatory`: the first body line, the style text, and the closing reminder.",
    "The style text asks the model to leave `TODO(human)` tasks for you.",
  ],
  "style-proactive": ["The same places as the other built-in styles."],
  "style-concise": ["The same places as the other built-in styles."],
  "style-custom": [
    "Your file body is put under `# Output Style: <name>` in the environment message. The front matter is not sent.",
    "The first line of the body changes, as with the built-in styles.",
  ],
  "style-custom-full": [
    "Without `keep-coding-instructions`, the whole `Doing tasks` section is gone from the full prompt.",
    "Other full-prompt sections stay.",
  ],
  "style-custom-keep": [
    "With `keep-coding-instructions: true`, the `Doing tasks` section stays. Compare with the previous page, where it is removed.",
  ],
  "style-custom-keep-lean": [
    "On the lean prompt the key changes nothing. The wiki says this too (`keep-coding-instructions` has no effect on the short prompt), and the capture agrees.",
  ],
  "append-system-prompt": [
    "Your text goes at the very end of the body (`system[2]`), after a blank line.",
    "The identity line changes too. With an appended prompt in `-p` mode it reads `You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK.`",
  ],
  "system-prompt": [
    "Your text replaces the whole body (`system[2]`).",
    "The attribution reminder and the environment message (agent types, skills, date) are still sent.",
    "The tool list is not changed.",
  ],
  "system-prompt-append": [
    "The replacement text and the appended text sit together in the body. The diff is against the replace-only page.",
  ],
  "claude-md": [
    "Project memory files arrive in the first user message, in a reminder that starts with `Codebase and user instructions are shown below.` They are not in `system`.",
  ],
  "git-repo": [
    "Inside a repository, the first user message gets a `gitStatus` reminder: branch, short status, and recent commits. The environment message says `Is a git repository: true`.",
    "The commit hash is replaced with `<sha>`.",
  ],
  "agent-main": [
    "The agent file body replaces the body (`system[2]`), like `--system-prompt`.",
    "The attribution reminder and the environment message are still sent.",
  ],
  "mode-plan": [
    "Plan mode adds a long block of rules to the environment message: the plan file path, a five-phase workflow, and the `ExitPlanMode` rule.",
    "The plan file name is random in each run, so it shows as `<plan-name>`.",
  ],
  "mode-acceptEdits": [
    "`acceptEdits` does not change the text. The mode only changes what asks for permission.",
  ],
  "mode-dontAsk": [
    "`dontAsk` does not change the text. The mode only changes what asks for permission.",
  ],
  brief: [
    "`--brief` changes nothing in the text or the tools in this capture. The brief rules appear only when the `SendUserMessage` tool exists, and it is not in the tool list here.",
    "The old wiki lists `brief` as a section for `--brief`. The capture does not show it.",
  ],
  compact: [
    "The capture runs twice in the same folders. The first run sends `hi`. The second run uses `--continue` and sends `/compact`.",
    "The page shows the second request. It has the normal system blocks, the earlier messages, and a last user message with the summary instructions (an `<analysis>` block, then a `<summary>` block).",
    "The summary request still sends the tool list, but the instructions say not to call tools.",
  ],
  "subagent-general-purpose": [
    "A subagent gets its own body, not the main body. It starts with `You are an agent for Claude Code, Anthropic's official CLI for Claude.`",
    "Short notes follow the agent text: use absolute paths, no emojis, no colon before tool calls, and do not write report files.",
    "The environment message is still sent. The stub made the main agent call the `Agent` tool, so this is a real subagent request.",
  ],
  "subagent-explore": [
    "The `Explore` agent is read-only. The body lists what it must not do, and it gets a shorter tool list.",
    "The same notes follow.",
  ],
  "subagent-plan": [
    "The `Plan` agent is also read-only and asks for a step-by-step plan.",
    "The same notes follow.",
  ],
  "subagent-custom": [
    "The body is your agent file text, then the same notes that every subagent gets. The file's front matter is not sent.",
  ],
};

export const INDEX_FACTS = {
  intro: [
    "A system prompt is the text that Claude Code sends to the model before your first message. It tells the model who it is, how to behave, and what the session looks like. The model reads it on every request.",
    "Claude Code has no single system prompt. It builds one from parts. The parts depend on the model, on flags, on env vars, on your output style, and on whether the request comes from the main agent or a subagent. This section shows every variant that you can pick, in full, with a diff against the default.",
    "The text on these pages is Anthropic's. It is shown here only to describe how the program works. See the notice on the home page.",
    'Status badges: <Documented /> means an official docs page names the switch. <Undocumented /> means only the program shows it. <Differs note="example" /> means the docs and the program disagree. <Gated note="example" /> means a flag or a server gate is needed.',
  ],
  method: [
    "Every prompt on these pages was captured offline, with no model call and no cost.",
    "1. A script starts the installed program (version 2.1.303) in print mode (`-p`) once per variant.",
    "2. The program talks to a small fake Messages API on `127.0.0.1`. The fake server writes each request body to a file and sends back a canned reply.",
    "3. The run uses a fake API key, a dead proxy (`HTTPS_PROXY` and `HTTP_PROXY` point to a closed port), `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`, `DISABLE_TELEMETRY=1`, and a temporary home, config folder, and project folder. No login token is used. The script checks that every request went to the local server.",
    "4. A second script reads the saved request bodies, replaces machine-specific values with placeholders, and writes these pages. It makes the diffs with `diff -u`, not by hand.",
    "For the subagent pages, the fake server answers the first turn with an `Agent` tool call. The program then starts a real subagent and sends its request to the fake server.",
    "For the compaction page, the script runs twice in the same folders: once with `hi`, then with `--continue` and `/compact`.",
  ],
  blocks: [
    "Each request has a `system` field with three blocks, then messages. This is what the captures show.",
    "| Block | What it holds | Cache marker |",
    "| --- | --- | --- |",
    "| `system[0]` | A billing header line with the program version and entry point (`cc_entrypoint=sdk-cli` in `-p` mode). | None |",
    "| `system[1]` | The identity line. | `ephemeral` |",
    "| `system[2]` | The body: the rules, the memory section, and your appended text. | `ephemeral` |",
    "Not everything that the model reads as instructions is in `system`. Claude Code also sends the following in the `messages` list, before your own text:",
    "- A reminder with the git attribution lines (first user message).",
    "- Project memory files, git status, and (with `--exclude-dynamic-system-prompt-sections`) the memory section.",
    "- A message with the role `system`. It holds the environment details, the output style text, the agent types, the skills list, and the date.",
    "Every variant page shows all of these parts, in the order they are sent, with a `===` line before each part.",
    "",
    "### Identity Line",
    "",
    "In `-p` mode the identity line is the SDK line: `You are a Claude agent, built on Anthropic's Claude Agent SDK.` Every capture here uses `-p`, so every page shows that line, except pages where it changes (see below).",
    "The program has three identity lines. Two more appear in its text:",
    "- `You are Claude Code, Anthropic's official CLI for Claude.` This is the line for the interactive terminal app. It could not be captured offline: the full-screen app did not accept typed input in the test harness, so no request was sent. Setting `CLAUDE_CODE_ENTRYPOINT=cli` in `-p` mode does not change the line.",
    "- `You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK.` Print mode sends this one when you use `--append-system-prompt`. See [Append System Prompt](./append-system-prompt.md).",
  ],
  flow: [
    "The chart shows what the captures prove. The order of the first three checks was not tested with every combination of flags.",
    "```mermaid",
    "flowchart TD",
    '  A["Start Claude Code"] --> B{"--bare or CLAUDE_CODE_SIMPLE=1?"}',
    '  B -- yes --> C["Bare: two-line body, empty environment message, 3 tools"]',
    '  B -- no --> D{"--system-prompt, --system-prompt-file, or --agent?"}',
    '  D -- yes --> E["Your text or the agent file replaces the body"]',
    '  D -- no --> F{"CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT"}',
    '  F -- "0" --> G["Full prompt"]',
    '  F -- "1" --> H["Lean prompt"]',
    '  F -- unset --> I{"Which model?"}',
    '  I -- "Opus 5.5 or Sonnet 5.5" --> H',
    '  I -- "Haiku 5.5" --> J["Lean prompt plus extra paragraphs"]',
    '  G --> K{"Output style set?"}',
    "  H --> K",
    "  J --> K",
    "  E --> L",
    '  K -- "yes, keep-coding-instructions false" --> M["Style text added, Doing tasks removed on the full prompt"]',
    '  K -- "yes, keep true, or no style" --> N["Style text added if set"]',
    '  M --> L{"--append-system-prompt?"}',
    "  N --> L",
    '  L -- yes --> O["Text added at the end, identity line changes"]',
    '  L -- no --> P{"--exclude-dynamic-system-prompt-sections?"}',
    "  O --> P",
    '  P -- yes --> Q["Memory moves to the first user message"]',
    '  P -- no --> R["Send request"]',
    "  Q --> R",
    "  C --> R",
    "```",
    "Subagents skip this chart. They get their own body and notes (see [Subagent, general-purpose](./subagent-general-purpose.md)).",
    "Captures disagree with the old wiki in one place: the wiki says models with `sonnet` or `haiku` in the name get the full prompt. In 2.1.303 they get the lean prompt, and only `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0` gives the full one.",
  ],
  placeholders: [
    "## Placeholders",
    "",
    "| Placeholder | Replaces |",
    "| --- | --- |",
    "| `<cwd>` | The project folder (a temporary folder in each run). |",
    "| `<config-dir>` | The Claude config folder (`CLAUDE_CONFIG_DIR`, a temporary folder). |",
    "| `<home>` | The home folder (a temporary folder). |",
    "| `<project-slug>` | The project folder name as used inside the config folder, with `/` and `.` turned into `-`. |",
    "| `<config-slug>` | The same kind of name for the config folder. |",
    "| `<date>` | Any date such as the day of the run. |",
    "| `<platform>`, `<shell>`, `<os-version>` | Your operating system, shell, and OS version. |",
    "| `<build>` | The build suffix of `cc_version` in the billing header. |",
    "| `<sha>` | A git commit hash. |",
    "| `<robot-emoji>` | A robot emoji in the pull request line of the attribution reminder. The site shows no emojis. |",
    "| `<plan-name>` | The random plan file name in plan mode. |",
    "",
    "Strings such as `PROBE-CUSTOM-STYLE-TEXT` and `APPENDED-TEXT-FROM-FLAG` are test text that the script supplies, so you can see where your own text lands.",
  ],
  regen: [
    "Run these from the repository root. Both steps use `bun` only.",
    "```bash",
    "bun tools/capture-prompts/capture.ts          # capture every variant, then write the pages",
    "bun tools/capture-prompts/capture.ts --only default-lean,bare   # capture some variants",
    "bun tools/capture-prompts/render.ts           # rebuild the pages from saved captures",
    "```",
    "Raw requests go to `captures/` (not committed). Normalized text goes to `tools/capture-prompts/out/`. The variant list is in `tools/capture-prompts/variants.ts`. For a new release, change the binary path in `capture.ts` and run it again.",
  ],
};
