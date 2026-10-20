---
title: "SDK and Automation"
description: "Environment variables for programs that host Claude Code, the Agent SDK, and automation."
url: https://xsyetopz.github.io/claude-code-docs/configure/env-vars/sdk-and-automation
source: docs/configure/env-vars/sdk-and-automation.md
---

# SDK and Automation


These variables help a program that runs Claude Code as a child process.
They say which surface started it, how session events reach the host, and which binary the Agent SDK looks for.
Most people never set them. Hosts such as the Agent SDK set them for you.

This page lists 22 variables. These are for a host program that starts Claude Code. Set them in the child process environment. Project `env` cannot set most of them before trust.

## Example

```bash
CLAUDE_CODE_ENTRYPOINT=sdk-cli claude -p "List the files" --output-format stream-json
```

`CLAUDE_CODE_ENTRYPOINT` tells Claude Code which host started it. The host sets it before the process starts.

## Variables

The table is sorted by name. See [Environment Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars.md#how-to-read-the-tables) for what each column and badge means.

| Variable | Status | What it does | Values and default | Notes |
| --- | --- | --- | --- | --- |
| `ANTHROPIC_ENVIRONMENT_ID` | [Undocumented] | The bundled Anthropic SDK `EnvironmentWorker` reads it as the default environment ID when a work item call passes none. | Text. The call fails with an error if no ID comes from any source | Bundled SDK work polling. Not set from project `env` before trust |
| `ANTHROPIC_ENVIRONMENT_KEY` | [Undocumented] | The bundled Anthropic SDK `EnvironmentWorker` reads it as the fallback environment key. A work item needs it when its secret has no `sessions_token`. | Text | Bundled SDK work polling. Not set from project `env` before trust |
| `ANTHROPIC_SESSION_ID` | [Undocumented] | The bundled Anthropic SDK `EnvironmentWorker` reads it as the default session ID for a work item. | Text. The call fails with an error if no ID comes from any source | Bundled SDK work polling. Not set from project `env` before trust |
| `ANTHROPIC_WEBHOOK_SIGNING_KEY` | [Undocumented] | The bundled SDK client reads it as the default webhook signing key. It is `null` when unset. | Text. SDK constructor default | Bundled SDK client. Not set from project `env` before trust |
| `ANTHROPIC_WORK_ID` | [Undocumented] | The bundled Anthropic SDK `EnvironmentWorker` reads it as the default work item ID. | Text. The call fails with an error if no ID comes from any source | Bundled SDK work polling. Not set from project `env` before trust |
| `ANTHROPIC_WORK_SECRET` | [Undocumented] | The bundled Anthropic SDK `EnvironmentWorker` reads it as the default work secret. | Text | Bundled SDK work polling. Not set from project `env` before trust |
| `CLAUDE_CODE_CONFIG_PROBE` | [Undocumented] | In the IDE config probe, skips the `awsAuthRefresh` and `gcpAuthRefresh` commands and the credential helper prefetch. | On or off, off by default. Also in a list of host-controlled names | IDE config probe, Bedrock and Vertex auth refresh |
| `CLAUDE_CODE_EDITOR_CODELIVERY` | [Undocumented] | Lets a relayed human message carry an `artifact_followup` ack with an `https` URL of at most 2048 chars. | On or off, off by default | Relay and remote sessions only |
| `CLAUDE_CODE_EMIT_SESSION_STATE_EVENTS` | [Documented] | Adds `session_state_changed` system messages to the output stream. | On or off, off by default. Code emits a normal event when set, else a host-only event when `CLAUDE_CODE_SDK_READS_SESSION_STATE` is set | SDK and `--print` stream-json |
| `CLAUDE_CODE_ENTRYPOINT` | [Undocumented] | Names the surface that started Claude Code, such as `cli`, `sdk-ts`, `claude-vscode`, or `remote`. Many code paths branch on it. | Text. Set by Claude Code at startup when empty (`mcp` for `mcp serve`, `sdk-cli` for SDK CLI) and set to `sdk-ts` by the TS SDK | All sessions |
| `CLAUDE_CODE_ENTRYPOINT_ON_REQUESTS` | [Undocumented] | Sets the name that requests go out under in the `cc_entrypoint=` part of the billing header. Added in `2.1.305`. The program reads it only when `CLAUDE_CODE_ENTRYPOINT` is `claude-desktop-3p`, and ignores it (with a debug message) when requests already go out under an entrypoint name. The name must be 1 to 32 characters of `a-z`, `0-9`, `_`, and `-`, start with a letter, not start with `sdk`, and not be reserved (an entrypoint name, anything starting with `remote`, or `local_projects`). The program unsets the variable after reading it. | Text. Source: the program strings only, not run | Claude Desktop third-party only |
| `CLAUDE_CODE_GENTLE_PARASOL` | [Undocumented] [Gated: A feature flag or server gate decides by default. This variable overrides it] | Overrides a feature flag experiment, which applies a secondary reminder to model requests. | Text. Logs `secondary_reminder` when applied | API requests |
| `CLAUDE_CODE_HUMBLE_HAMMOCK` | [Undocumented] [Gated: A feature flag or server gate decides by default. This variable overrides it] | Forces the `echoWireToolInputs` behavior on or off ahead of the flag. Probe: Adds `wire_tool_inputs` (raw `tool_use.input`) to the assistant event when a tool runs. See Probes. | On, off, or unset. Unset falls back to `echoWireToolInputs` and then to a feature flag | All sessions |
| `CLAUDE_CODE_JIT_POLICY_AFTER_STARTUP` | [Undocumented] | Sets the Bun JIT policy 10 seconds after start. Without it the policy is set to `1`. | On or off. Whole number `1` to `100`, digits only. A truthy value loads a module that applies the value | All sessions, Bun build |
| `CLAUDE_CODE_LARCH_CISTERN` | [Undocumented] [Gated: A feature flag or server gate decides by default. This variable overrides it] | Overrides the `larch_cistern` experiment value for the model. Probe: Adds a "Corrections" section to the system prompt (avoid excessive self-correction). See Probes. | On or off. Passed to the same per-model helper as `CLAUDE_CODE_AMBER_ASTROLABE`. A false value counts as unset | All sessions |
| `CLAUDE_CODE_POLL_EVENTS` | [Undocumented] | Lets a host send poll events to the session as `<event>` envelopes. The code rejects them when the host did not set it. | On or off. Poll events also need permission mode `auto` | SDK and host sessions |
| `CLAUDE_CODE_REMOVE_PROMPT_STRINGS` | [Undocumented] | Removes listed strings from prompts for prompt ablation tests. It overrides the `remove_prompt_strings` client data. | JSON text. A bad value logs a warning. Telemetry event a feature flag | All sessions |
| `CLAUDE_CODE_SDK_READS_STARTUP_MARKS` | [Undocumented] | Tells Claude Code that the SDK host reads startup marks. The Agent SDK sets it for `startup()` and `prewarm()`. The CLI then writes lines with a `startup_mark` field. | On or off | SDK and print mode |
| `CLAUDE_CODE_SDK_READS_SESSION_STATE` | [Undocumented] | Tells Claude Code that the SDK host reads session state. Claude Code then sends `session_state_changed` events marked `sdk_host_only`. | On or off. Set by Claude Code to `1` in the SDK child env unless the host already set it | SDK and print mode. Set by Claude Code |
| `CLAUDE_CODE_SIMULATE_PROXY_USAGE` | [Undocumented] | Simulates proxy use in request shaping. Claude Code then skips steps such as the thinking display update. A Probes run saw no `anthropic-beta` header. | On or off | API requests |
| `CLAUDE_CODE_SUPERVISED` | [Undocumented] | Tells Claude Code that a supervisor restarts it. On an uncaught exception it then exits at once instead of staying alive. | On or off | Supervised or managed runs |
| `CLAUDE_CODE_TETHER_LIVE` | [Undocumented] [Gated: A feature flag or server gate decides by default. This variable overrides it] | Forces the tether-live gate on or off. It replaces the feature flag and also gates the kept-reminder delivery. | On or off. Needs the first-party provider. Without it, the flag decides, and only for some builds or users | First-party provider only |
| `SDK_NATIVE_BIN` | [Undocumented] | Sets the native binary file name that the Agent SDK looks for. | Text, `claude` by default. Joined to the platform package path `@anthropic-ai/claude-agent-sdk-<os>-<arch>` | Agent SDK launch. Not set from project `env` before trust |

## How It Works

A host starts `claude` with its own environment.
Claude Code sets `CLAUDE_CODE_ENTRYPOINT` itself when it is empty (`mcp` for `mcp serve`, `sdk-cli` for the SDK command line).
Other variables here switch on extra stream events or tell Claude Code that a supervisor restarts it.

## Related Pages

- [Environment Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars.md): how Claude Code reads variables and which value wins.
- [Headless and Print Mode](https://xsyetopz.github.io/claude-code-docs/extend/headless.md)
- [Remote and Cloud Sessions](https://xsyetopz.github.io/claude-code-docs/configure/env-vars/remote-and-cloud-sessions.md)
- [Undocumented Items](https://xsyetopz.github.io/claude-code-docs/reference/undocumented.md): every item that only the program shows.

Source: the program (variable names found in the `2.1.305` binary) and the [Environment Variables](https://code.claude.com/docs/en/env-vars) page of the official docs.
