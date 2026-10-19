---
title: "Telemetry and Debug"
description: "Environment variables for usage data, OpenTelemetry, debug logs, and error reports."
url: https://xsyetopz.github.io/claude-code-docs/configure/env-vars/telemetry-and-debug
source: docs/configure/env-vars/telemetry-and-debug.md
---

# Telemetry and Debug


These variables control what Claude Code reports and how much it logs.
They turn telemetry on or off, configure OpenTelemetry (OTEL) exporters, and set debug output.
Use them to opt out of reporting or to send metrics to your own collector.

This page lists 139 variables. `DISABLE_TELEMETRY` opts out when it has any non-empty value, even `0` or `false`. Unset it to turn telemetry back on. `DO_NOT_TRACK=1` has the same effect. Set these in your shell or managed settings. OTEL exporter variables in project or local settings do not apply, apart from a few off values.

## Example

```bash
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4317"
claude
```

Claude Code sends OTEL metrics to your local collector.

## Variables

The table is sorted by name. See [Environment Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars.md#how-to-read-the-tables) for what each column and badge means.

| Variable | Status | What it does | Values and default | Notes |
| --- | --- | --- | --- | --- |
| `ANTHROPIC_LOG` | [Undocumented] | The bundled SDK reads it as the SDK log level when the client options give none. | Text, level by default. The SDK checks it and falls back to its own default level | Bundled SDK client. Not set from project `env` before trust |
| 🧪 `BETA_TRACING_ENDPOINT` | [Documented] [Gated: Works only behind a feature flag or server gate] | Sends detailed beta traces and logs to this OTLP/HTTP endpoint. Claude Code adds `/v1/traces` and `/v1/logs`. | Text. Works only with `ENABLE_BETA_TRACING_DETAILED` set and when a second gate passes | All sessions. Docs say project and local settings ignore it |
| `CCR_RUNNER_STARTUP_TIMING` | [Undocumented] [Gated: Works only behind a feature flag or server gate] | Passes runner startup timing fields to Claude Code. It merges them into the startup timing record. | Text. Set by the self-hosted runner for the child. Needs `CLAUDE_CODE_REMOTE` or `CLAUDE_CODE_EMIT_STARTUP_TIMING` | Cloud remote and self-hosted runner sessions |
| `CCR_SPAWN_TIMESTAMP_MS` | [Undocumented] [Gated: Works only behind a feature flag or server gate] | Gives the spawn time in ms. Claude Code uses it to measure time from spawn to exec, first message read, and input ready. | A number of milliseconds. Integer parsed with `parseInt`, else ignored. Set by the self-hosted runner | Cloud remote and self-hosted runner sessions |
| `CLAUDE_CODE_ACCOUNT_TAGGED_ID` | [Undocumented] | Overrides the `user.account_id` metric attribute. | Text. Used only when `OTEL_METRICS_INCLUDE_ACCOUNT_UUID` is on and an account UUID exists. Else Claude Code derives a tagged id | OTEL metrics. Not set from project `env` before trust |
| `CLAUDE_CODE_ACTION` | [Undocumented] | Marks a run as launched by the Claude Code GitHub Action. Claude Code reports the flag in environment metadata. | On or off | GitHub Action runs. Not set from project `env` before trust |
| `CLAUDE_CODE_BENCH_LIVE_COUNTS` | [Undocumented] | Turns on live counts in the terminal renderer. No visible effect in a print-mode probe ([Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md)). | On or off. Sets `liveCountsEnabled` on the renderer | Interactive UI |
| `CLAUDE_CODE_BYOC_ENABLE_DATADOG` | [Documented] | Opts a BYOC environment in to a Datadog-related path. The BYOC runner passes it to the session. No visible effect in a print-mode probe ([Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md)). | On or off. A helper returns true when `CLAUDE_CODE_ENVIRONMENT_KIND` is `byoc` and this is unset | BYOC remote sessions |
| `CLAUDE_CODE_CLASSIFIER_SUMMARY` | [Undocumented] [Gated: Works only behind a feature flag or server gate] | Picks `llm` or `heuristic` summaries for the session classifier. | On or off. Else a feature flag decides. A feature flag can force `heuristic` | All sessions, gated by a feature flag |
| `CLAUDE_CODE_DATADOG_FLUSH_INTERVAL_MS` | [Undocumented] | Sets how often the Datadog log sender flushes its batch. | A number of milliseconds. Falls back to a built-in default | Datadog event logging |
| `CLAUDE_CODE_DD_ERROR_TRACKING_FLUSH_INTERVAL_MS` | [Undocumented] | Sets how often the error tracking client sends its batch to the Datadog browser intake. | A number of milliseconds, `30000` by default | Error reporting |
| `CLAUDE_CODE_DEBUG_LOG_LEVEL` | [Documented] | Sets the minimum level written to the debug log. | Text, `debug` by default. Valid levels only, default `debug` | All sessions |
| `CLAUDE_CODE_DEBUG_LOGS_DIR` | [Documented] | Sets the path of the debug log file. Despite the name it is a file path. One code branch adds `<session-id>.txt` to a learned directory. | Text. Default `~/.claude/debug/<session-id>.txt`. Debug mode must be on | All sessions |
| `CLAUDE_CODE_DIAGNOSTICS_FILE` | [Undocumented] | Sets a file that receives diagnostics events as JSON lines with a timestamp, level, event and data. Also enables extra diagnostics code. | Text. Other code tests only if it is set | All sessions, also forwarded to child processes |
| `CLAUDE_CODE_DISABLE_VITALS_EMITTER` | [Undocumented] | Kill switch for the guest vitals emitter helper. It is also off in essential-traffic-only mode. | On or off, off by default. The log says guest vitals are disabled | Guest and container sessions |
| `CLAUDE_CODE_EMIT_STARTUP_TIMING` | [Undocumented] | Turns on collection and reporting of startup timing phases, as `CLAUDE_CODE_REMOTE` does. | On or off, off by default. Reported fields include the `entrypoint` value | All sessions |
| `CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL` | [Documented] | Routes the session quality survey to your own OTEL collector when Anthropic-bound traffic is blocked. | On or off, off by default. When on, the survey gate no longer follows the nonessential-traffic check | All sessions. Project `env` can set it before trust |
| `CLAUDE_CODE_ENABLE_SHARE_BUNDLE` | [Undocumented] | Makes `/share` send the whole transcript as a feedback bundle. | On or off, off by default. Used in the `/share` command path | First-party sessions |
| `CLAUDE_CODE_ENABLE_TELEMETRY` | [Documented] [Differs: The official docs and the program disagree. The row says how.] | Turns on OTEL metrics and logs. Docs say project and local settings ignore it. | On or off. Needs an OTEL exporter that is not `none` | All sessions. Project `env` can set it before trust |
| 🧪 `CLAUDE_CODE_ENHANCED_TELEMETRY_BETA` | [Documented] | Turns on the enhanced tracing beta, with `OTEL_TRACES_EXPORTER=otlp`. `ENABLE_ENHANCED_TELEMETRY_BETA` is the fallback name. | On or off. On-style value gives on, off-style gives off, else off | All sessions |
| `CLAUDE_CODE_FRAME_TIMING_LOG` | [Undocumented] | Appends a JSON line with render phase timing per frame to this file. | Text, off by default | Interactive terminal UI |
| `CLAUDE_CODE_FRAME_TIMING_SAMPLE_EVERY` | [Undocumented] | Logs memory stats for every Nth frame in the frame timing log. | A number. Whole number, minimum `1` after fallback. Used only with `CLAUDE_CODE_FRAME_TIMING_LOG` | Interactive terminal UI |
| `CLAUDE_CODE_GB_DISK_CACHE_WHEN_TELEMETRY_OFF` | [Undocumented] | Keeps the GrowthBook disk cache on when telemetry is off. | On or off, off by default. Needs `DISABLE_GROWTHBOOK` unset | First-party sessions |
| `CLAUDE_CODE_HOST_PLATFORM` | [Undocumented] | Reports the host platform in the environment record. A host app can set it when the host OS differs from the build. | Text. Also exposed as `hostPlatform` in a policy facts object | All sessions |
| `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH` | [Documented] | Caps the length of content-bearing OpenTelemetry attributes. Truncated text gets a `[TRUNCATED - Content exceeds ...]` marker. | A number, `61440` by default. Whole number of 1 or more in plain digits. The code takes the smallest of it and the three `OTEL_*_ATTRIBUTE_VALUE_LENGTH_LIMIT` vars | All sessions, when OTEL content logging is on |
| `CLAUDE_CODE_OTEL_DIAG_STDERR` | [Documented] | Writes OpenTelemetry exporter diagnostic errors to stderr. Without it they go only to the debug log. | On or off. Claude Code removes it from the env of shell tool subprocesses | All sessions |
| `CLAUDE_CODE_OTEL_FLUSH_TIMEOUT_MS` | [Documented] | Sets how long Claude Code waits to flush pending OpenTelemetry data. | A number of milliseconds, `5000` by default. Whole number in ms. The trace flush gets half of the value | All sessions, when OTEL is on |
| `CLAUDE_CODE_OTEL_HEADERS_HELPER_DEBOUNCE_MS` | [Documented] | Sets how long the output of the OTEL headers helper stays cached before a refresh. | A number of milliseconds. Whole number in ms. Docs default is `1740000` | All sessions, when an OTEL headers helper is set |
| `CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS` | [Documented] | Sets how long the OpenTelemetry exporters get to finish at exit. | A number of milliseconds, `2000` by default. Whole number in ms. The exporter timeout caps it at an internal maximum and subtracts 250 ms | All sessions, when OTEL is on |
| `CLAUDE_CODE_PERFETTO_TRACE` | [Undocumented] | The only read site logs `[Perfetto] initializePerfettoTracing called, env value:`. No visible effect in a print-mode probe ([Probes](https://xsyetopz.github.io/claude-code-docs/reference/probes.md)). | Text. The code that turns it on is not shown | All sessions |
| `CLAUDE_CODE_PROFILE_QUERY` | [Undocumented] | Turns on query profiling. The report shows TTFT, pre-request overhead, and network latency. | Set to `1`. Without it a message says `Query profiling not enabled` | All sessions |
| `CLAUDE_CODE_PROFILE_STARTUP` | [Undocumented] | Turns on startup profiling marks. Without it a random sample of runs (5 percent in one profiler and 0.5 percent in another) is profiled. | On or off. Memory snapshots are part of the report | All sessions |
| `CLAUDE_CODE_PROPAGATE_TRACEPARENT` | [Documented] | Sends the W3C `traceparent` header on custom proxy URLs. | On or off. The check is true for direct Anthropic API use or when this var is set | All sessions |
| `CLAUDE_CODE_SESSION_LOG` | [Undocumented] | Gives the log path that is written into the concurrent-session pid file record. | Text. Only stored as `logPath` in the record | Concurrent-session registry |
| `CLAUDE_CODE_SLOW_OPERATION_THRESHOLD_MS` | [Undocumented] | Sets the ms threshold for slow-operation timing around calls such as `JSON.stringify`. | A number of milliseconds. The default is no limit (`Infinity`) | All sessions |
| `CLAUDE_CODE_SPAWN_TIMESTAMP_MS` | [Undocumented] | Gives the time the process was spawned, in ms. The headless profiler uses it as the start for startup timing. | A number of milliseconds. Integer. `CCR_SPAWN_TIMESTAMP_MS` is checked first | Headless and print mode |
| `CLAUDE_CODE_TAGS` | [Undocumented] | Adds a tags string to the environment info that Claude Code sends with its telemetry. | Text | All sessions |
| `CLAUDE_CODE_TRIGGER_ID` | [Undocumented] | Passes a trigger ID into a feature flag event as `trigger_id`. | Text. No other effect seen | All sessions |
| `CLAUDE_CODE_WORKSPACE_HOST_PATHS` | [Undocumented] | Adds host paths to each event as `workspace.host_paths`. | Text. Split on the pipe character into a list | Hosted workspaces |
| `CLAUDE_DEBUG` | [Undocumented] | Logs Node process warnings to the debug log. | On or off | All sessions |
| `CLAUDE_PTY_RECORD` | [Undocumented] | Names a file where the PTY host records the terminal output of its child. | - | - |
| `DEBUG` | [Documented] | Turns on debug mode when truthy. | - | - |
| `DEBUG_CLAUDE_AGENT_SDK` | [Undocumented] | In the SDK, forwards the CLI stderr to the caller and sets `DEBUG` to `1` for the child. | - | - |
| `DEBUG_SDK` | [Undocumented] | Turns on debug mode at launch. | - | - |
| `DISABLE_ERROR_REPORTING` | [Documented] | Opts out of error reporting. | On or off | - |
| `DISABLE_TELEMETRY` | [Documented] | Opts out of telemetry. The bundle also treats it as "no-telemetry" mode for other non-essential traffic checks. | Text. Any non-empty string counts, so `0` and `false` still opt out. Passed on to remote child sessions | All sessions. Not set from project `env` before trust |
| `DO_NOT_TRACK` | [Documented] | Opts out of telemetry like `DISABLE_TELEMETRY` does. | On or off. Parsed as a standard boolean, so `0` or `false` leaves telemetry on | All sessions. Not set from project `env` before trust |
| 🧪 `ENABLE_BETA_TRACING_DETAILED` | [Documented] [Gated: Works only behind a feature flag or server gate] | Turns on detailed beta tracing. It needs `BETA_TRACING_ENDPOINT` as well. | On or off. Also needs a non-empty `BETA_TRACING_ENDPOINT`. Gated by an org check or a feature flag | Tracing. Not set from project `env` before trust |
| `ENABLE_ENHANCED_TELEMETRY_BETA` | [Documented] | Turns on enhanced telemetry tracing. It is the fallback name of `CLAUDE_CODE_ENHANCED_TELEMETRY_BETA`. | On or off. Truthy values enable it. The `CLAUDE_CODE_` name is read first with `??` | Tracing. Not set from project `env` before trust |
| `GITHUB_ACTION_INPUTS` | [Undocumented] | Passes the action inputs to a startup telemetry field named `githubActionInputs`. | Text | GitHub Actions. Not set from project `env` before trust |
| `GITHUB_ACTOR_ID` | [Undocumented] | Sends the actor id as telemetry metadata when `GITHUB_ACTIONS` is on. | Text | GitHub Actions. Not set from project `env` before trust |
| `GITHUB_EVENT_NAME` | [Undocumented] | Sends the event name as telemetry metadata when `GITHUB_ACTIONS` is on. | Text | GitHub Actions. Not set from project `env` before trust |
| `GITHUB_REPOSITORY` | [Undocumented] | Sends the repository name as telemetry metadata when `GITHUB_ACTIONS` is on. | Text | GitHub Actions. Not set from project `env` before trust |
| `GITHUB_REPOSITORY_ID` | [Undocumented] | Sends the repository id as telemetry metadata when `GITHUB_ACTIONS` is on. | Text | GitHub Actions. Not set from project `env` before trust |
| `GITHUB_REPOSITORY_OWNER` | [Undocumented] | Sends the repository owner as telemetry metadata when `GITHUB_ACTIONS` is on. | Text | GitHub Actions. Not set from project `env` before trust |
| `GITHUB_REPOSITORY_OWNER_ID` | [Undocumented] | Sends the repository owner id as telemetry metadata when `GITHUB_ACTIONS` is on. | Text | GitHub Actions. Not set from project `env` before trust |
| `GOOGLE_SDK_NODE_LOGGING` | [Undocumented] | Turns on debug logging in the bundled Google libraries when it is set. | On or off | Google auth library |
| `OTEL_ATTRIBUTE_COUNT_LIMIT` | [Undocumented] | OTel SDK limit for the attribute count per log record and span. | A number | - |
| `OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT` | [Documented] | Sets the OTel limit for attribute value length. Claude Code caps content attributes at the smaller limit. | A number | - |
| `OTEL_BLRP_EXPORT_TIMEOUT` | [Undocumented] | OTel log record batch processor: export timeout in ms. | - | - |
| `OTEL_BLRP_MAX_EXPORT_BATCH_SIZE` | [Undocumented] | OTel log record batch processor: max records per export. | A number | - |
| `OTEL_BLRP_MAX_QUEUE_SIZE` | [Undocumented] | OTel log record batch processor: queue size. | A number | - |
| `OTEL_BLRP_SCHEDULE_DELAY` | [Undocumented] | OTel log record batch processor: delay between exports in ms. | - | - |
| `OTEL_BSP_EXPORT_TIMEOUT` | [Undocumented] | OTel span batch processor: export timeout in ms. | - | - |
| `OTEL_BSP_MAX_EXPORT_BATCH_SIZE` | [Undocumented] | OTel span batch processor: max spans per export. | A number | - |
| `OTEL_BSP_MAX_QUEUE_SIZE` | [Undocumented] | OTel span batch processor: queue size. | A number | - |
| `OTEL_BSP_SCHEDULE_DELAY` | [Undocumented] | OTel span batch processor: delay between exports in ms. | - | - |
| `OTEL_EXPORTER_OTLP_CERTIFICATE` | [Documented] | Gives the root CA file for the OTLP exporter. Signal-specific vars win. | - | - |
| `OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE` | [Documented] | Gives the client certificate file for OTLP mutual TLS. | - | - |
| `OTEL_EXPORTER_OTLP_CLIENT_KEY` | [Documented] | Gives the client private key file for OTLP mutual TLS. | Text (a secret) | - |
| `OTEL_EXPORTER_OTLP_COMPRESSION` | [Undocumented] | Sets OTLP compression. Signal-specific vars win. | - | - |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | [Documented] | Sets the OTLP collector endpoint for metrics, logs, and traces. | A URL | - |
| `OTEL_EXPORTER_OTLP_HEADERS` | [Documented] | Sets extra OTLP request headers as `key=value` pairs. | - | - |
| `OTEL_EXPORTER_OTLP_INSECURE` | [Undocumented] | Makes the gRPC OTLP exporter use an insecure channel when the value is `true`. | - | - |
| `OTEL_EXPORTER_OTLP_LOGS_CERTIFICATE` | [Undocumented] | Gives the root CA file for the OTLP logs exporter. | - | - |
| `OTEL_EXPORTER_OTLP_LOGS_CLIENT_CERTIFICATE` | [Undocumented] | Gives the client certificate file for the OTLP logs exporter. | - | - |
| `OTEL_EXPORTER_OTLP_LOGS_CLIENT_KEY` | [Undocumented] | Gives the client key file for the OTLP logs exporter. | Text (a secret) | - |
| `OTEL_EXPORTER_OTLP_LOGS_COMPRESSION` | [Undocumented] | Sets OTLP compression for logs only. | - | - |
| `OTEL_EXPORTER_OTLP_LOGS_ENDPOINT` | [Documented] | Sets the OTLP endpoint for logs only. | A URL | - |
| `OTEL_EXPORTER_OTLP_LOGS_HEADERS` | [Documented] | Sets OTLP headers for logs only. | - | - |
| `OTEL_EXPORTER_OTLP_LOGS_INSECURE` | [Undocumented] | Makes the gRPC OTLP logs exporter use an insecure channel when `true`. | - | - |
| `OTEL_EXPORTER_OTLP_LOGS_PROTOCOL` | [Documented] | Chooses the OTLP protocol for logs. Falls back to `OTEL_EXPORTER_OTLP_PROTOCOL`. | - | - |
| `OTEL_EXPORTER_OTLP_METRICS_CERTIFICATE` | [Undocumented] | Gives the root CA file for the OTLP metrics exporter. | - | - |
| `OTEL_EXPORTER_OTLP_METRICS_CLIENT_CERTIFICATE` | [Undocumented] | Gives the client certificate file for the OTLP metrics exporter. | - | - |
| `OTEL_EXPORTER_OTLP_METRICS_CLIENT_KEY` | [Documented] | Gives the client key file for the OTLP metrics exporter. | Text (a secret) | - |
| `OTEL_EXPORTER_OTLP_METRICS_COMPRESSION` | [Undocumented] | Sets OTLP compression for metrics only. | - | - |
| `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT` | [Documented] | Sets the OTLP endpoint for metrics only. | A URL | - |
| `OTEL_EXPORTER_OTLP_METRICS_HEADERS` | [Documented] | Sets extra HTTP headers on the OTLP metrics export. | Text. Overrides `OTEL_EXPORTER_OTLP_HEADERS` | Metrics exporter with `http/json`, `http/protobuf` or `grpc`. Ignored in project and local `env` |
| `OTEL_EXPORTER_OTLP_METRICS_INSECURE` | [Undocumented] | Allows an insecure (non-TLS) connection for the OTLP metrics exporter. | Text | Metrics exporter. Ignored in project and local `env` |
| `OTEL_EXPORTER_OTLP_METRICS_PROTOCOL` | [Documented] | Picks the OTLP wire protocol for metrics. Falls back to `OTEL_EXPORTER_OTLP_PROTOCOL`. | Text. Another value throws an `Unknown protocol` error | Metrics exporter when `OTEL_METRICS_EXPORTER` has `otlp`. Ignored in project and local `env` |
| `OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE` | [Documented] | Chooses delta or cumulative temporality for exported OTLP metrics. | Text. When unset, Claude Code sets it to `delta` at telemetry start (set by Claude Code) | Metrics exporter. Project `env` can set it before trust |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | [Documented] | Sets the default OTLP wire protocol for metrics, logs and traces. | Text. A per-signal `..._PROTOCOL` wins | Telemetry exporters with `otlp`. Ignored in project and local `env` |
| `OTEL_EXPORTER_OTLP_TIMEOUT` | [Undocumented] | Sets the OTLP export timeout in ms for every signal. | A number. A per-signal `OTEL_EXPORTER_OTLP_<SIGNAL>_TIMEOUT` wins. A bad value logs a warning | OTLP exporters. Not set from project `env` before trust |
| `OTEL_EXPORTER_OTLP_TRACES_CERTIFICATE` | [Undocumented] | Sets the root CA file that the OTLP traces exporter trusts. | Falls back to `OTEL_EXPORTER_OTLP_CERTIFICATE`. A read failure logs a warning | Traces exporter. Ignored in project and local `env` |
| `OTEL_EXPORTER_OTLP_TRACES_CLIENT_CERTIFICATE` | [Undocumented] | Sets the client certificate file for mTLS on the OTLP traces exporter. | Falls back to `OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE`. Needs the matching client key | Traces exporter. Ignored in project and local `env` |
| `OTEL_EXPORTER_OTLP_TRACES_CLIENT_KEY` | [Undocumented] | Sets the client private key file for mTLS on the OTLP traces exporter. | Text (a secret). Falls back to `OTEL_EXPORTER_OTLP_CLIENT_KEY`. Needs the matching client certificate | Traces exporter. Ignored in project and local `env` |
| `OTEL_EXPORTER_OTLP_TRACES_COMPRESSION` | [Undocumented] | Sets the compression of OTLP trace requests. | Text. Another value logs a warning and is ignored. Falls back to `OTEL_EXPORTER_OTLP_COMPRESSION` | Traces exporter. Project `env` can set it before trust |
| `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` | [Documented] [Gated: A feature flag or server gate decides by default. This variable overrides it] | Sets the OTLP traces endpoint URL. A valid value in remote mode also forces `http/protobuf` for traces. | Text. The remote check needs `https` or localhost `http`, no credentials, no query, and a path that ends in `traces` | Traces exporter. Remote check needs `CLAUDE_CODE_REMOTE`. Not set from project `env` before trust |
| `OTEL_EXPORTER_OTLP_TRACES_HEADERS` | [Documented] | Sets extra HTTP headers on the OTLP traces export. | Text. Overrides `OTEL_EXPORTER_OTLP_HEADERS` | Traces exporter. Ignored in project and local `env` |
| `OTEL_EXPORTER_OTLP_TRACES_INSECURE` | [Undocumented] | Allows an insecure (non-TLS) connection for the OTLP traces exporter. | Text | Traces exporter. Ignored in project and local `env` |
| `OTEL_EXPORTER_OTLP_TRACES_PROTOCOL` | [Documented] | Picks the OTLP wire protocol for traces. Falls back to `OTEL_EXPORTER_OTLP_PROTOCOL`. | Text. A valid remote `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` forces `http/protobuf` | Traces exporter when `OTEL_TRACES_EXPORTER` has `otlp`. Ignored in project and local `env` |
| `OTEL_EXPORTER_PROMETHEUS_HOST` | [Documented] | Sets the host that the Prometheus metrics exporter binds to. | Falls back to the SDK default | Metrics exporter with `prometheus`. Ignored in project and local `env` |
| `OTEL_EXPORTER_PROMETHEUS_PORT` | [Documented] | Sets the port that the Prometheus metrics exporter listens on. | A number, port by default. Falls back to the SDK default port | Metrics exporter with `prometheus`. Ignored in project and local `env` |
| `OTEL_LOG_ASSISTANT_RESPONSES` | [Documented] | Includes the model response text in `assistant_response` log events. | On, off, or unset. When unset, the value of `OTEL_LOG_USER_PROMPTS` applies. `0` keeps responses redacted | All entrypoints. Ignored in project and local `env`. Project `env` may set only an off value |
| `OTEL_LOG_MANAGED_SETTINGS` | [Documented] | Adds redacted managed settings and a SHA-256 digest to `managed_settings_resolved` events. | On or off. Reads managed and user layers first, and skips project and local scopes | All entrypoints. Ignored in project and local `env` |
| `OTEL_LOG_RAW_API_BODIES` | [Documented] | Logs raw Messages API request and response JSON as events. | Off by default. `1` (bool values) means inline. `file:<dir>` writes full bodies to disk with a `body_ref` | All entrypoints, not diskless hosts. Ignored in project and local `env` |
| `OTEL_LOG_TOOL_CONTENT` | [Documented] | Includes tool content in the `tool.output` span event. | On or off. Needs tracing on | All entrypoints with tracing. Ignored in project and local `env`. Project `env` may set only an off value |
| `OTEL_LOG_TOOL_DETAILS` | [Documented] | Includes tool input, MCP server names, raw errors and similar details in telemetry. | On or off. It also adds `classifier_category` on `tool_decision` events | All entrypoints. Ignored in project and local `env`. Project `env` may set only an off value |
| `OTEL_LOG_USER_PROMPTS` | [Documented] | Includes user prompt text in OpenTelemetry traces and logs. | On or off. Off by default, so prompts show as `<REDACTED>` | All entrypoints. Ignored in project and local `env`. Project `env` may set only an off value |
| `OTEL_LOGRECORD_ATTRIBUTE_COUNT_LIMIT` | [Undocumented] | Limits the number of attributes on each OTLP log record. | A number. Falls back to `OTEL_ATTRIBUTE_COUNT_LIMIT`, then 128 | Log exporters. Not set from project `env` before trust |
| `OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT` | [Documented] | Limits the length of each log record attribute value. Also lowers the content cut-off for prompts and tool content. | A number, unlimited by default. Integer, min 0, default unlimited. The content cut-off is the lowest of this, the span and general limits, and `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH` (61440) | Log exporters and OTEL content fields. Not set from project `env` before trust |
| `OTEL_LOGS_EXPORT_INTERVAL` | [Documented] | Sets the log batch export delay in ms. | A number, 5000 by default. Integer. The first-party event logger reads it too (default 10000 from the process env) | Log exporters. Project `env` can set it before trust |
| `OTEL_LOGS_EXPORTER` | [Documented] | Chooses the exporters for OpenTelemetry log events. | A comma-separated list. Needs `CLAUDE_CODE_ENABLE_TELEMETRY`. In stream-json output mode Claude Code removes `console` from it | All entrypoints. Project settings may only set `none`. Ignored in project and local `env` |
| `OTEL_METRIC_EXPORT_INTERVAL` | [Documented] | Sets the metric export interval in ms for the OTLP and console readers. | A number, 60000 by default. Integer | Metrics exporters. Project `env` can set it before trust |
| `OTEL_METRICS_EXPORTER` | [Documented] | Chooses the exporters for OpenTelemetry metrics. | A comma-separated list. Needs `CLAUDE_CODE_ENABLE_TELEMETRY`. In stream-json output mode `console` is removed | All entrypoints. Project settings may only set `none`. Ignored in project and local `env` |
| `OTEL_METRICS_INCLUDE_ACCOUNT_UUID` | [Documented] | Adds the account UUID (and a tagged id) to metric attributes. | On or off, on by default. Any set value is parsed as bool, so only `1`, `true`, `yes`, `on` keep it | Metrics. Project `env` can set it before trust |
| `OTEL_METRICS_INCLUDE_ENTRYPOINT` | [Documented] | Adds the session entrypoint as `app.entrypoint` to metric attributes. | On or off, off by default. Any set value is parsed as bool | Metrics. Project `env` can set it before trust |
| `OTEL_METRICS_INCLUDE_REPOSITORY` | [Documented] | Adds `vcs.*` repository attributes to metrics and events. | On or off, off by default. Any set value is parsed as bool | Metrics and events. Project `env` can set it before trust |
| `OTEL_METRICS_INCLUDE_RESOURCE_ATTRIBUTES` | [Documented] | Adds `OTEL_RESOURCE_ATTRIBUTES` keys to metric attributes. | On or off, on by default. Any set value is parsed as bool. `user.` and `identity.` keys are skipped when the host supplies identity | Metrics. Project `env` can set it before trust |
| `OTEL_METRICS_INCLUDE_SESSION_ID` | [Documented] | Adds `session.id` (and the remote session id) to metric attributes. | On or off, on by default. Any set value is parsed as bool | Metrics. Project `env` can set it before trust |
| `OTEL_METRICS_INCLUDE_VERSION` | [Documented] | Adds the Claude Code version as `app.version` to metric attributes. | On or off, off by default. Any set value is parsed as bool | Metrics. Project `env` can set it before trust |
| `OTEL_RESOURCE_ATTRIBUTES` | [Documented] | Adds custom resource attributes to telemetry, and to metric labels. | Text. Bad pairs are dropped | All entrypoints. Project `env` can set it before trust |
| `OTEL_SERVICE_NAME` | [Undocumented] | Sets the `service.name` resource attribute of exported telemetry. | Text | Telemetry. Project `env` can set it before trust |
| `OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT` | [Undocumented] | Limits the attributes on each span. | A number. Falls back to `OTEL_ATTRIBUTE_COUNT_LIMIT`, then 128 | Tracing. Not set from project `env` before trust |
| `OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT` | [Undocumented] | Limits the attributes on each span event. | A number, 128 by default | Tracing. Not set from project `env` before trust |
| `OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT` | [Undocumented] | Limits the attributes on each span link. | A number, 128 by default | Tracing. Not set from project `env` before trust |
| `OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT` | [Documented] | Limits the length of span attribute values. Also lowers the content cut-off. | A number, unlimited by default. Integer, min 0, default unlimited. The content cut-off is the lowest of this, the log and general limits, and `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH` | Tracing and OTEL content fields. Not set from project `env` before trust |
| `OTEL_SPAN_EVENT_COUNT_LIMIT` | [Undocumented] | Limits the events on each span. | A number, 128 by default | Tracing. Not set from project `env` before trust |
| `OTEL_SPAN_LINK_COUNT_LIMIT` | [Undocumented] | Limits the links on each span. | A number, 128 by default | Tracing. Not set from project `env` before trust |
| `OTEL_TRACES_EXPORT_INTERVAL` | [Documented] | Sets the trace batch export delay in ms. | A number, 5000 by default. Integer | Traces exporters. Project `env` can set it before trust |
| `OTEL_TRACES_EXPORTER` | [Documented] | Chooses the exporters for OpenTelemetry traces. | A comma-separated list. Needs telemetry and tracing on. In stream-json output mode `console` is removed | All entrypoints. Project settings may only set `none`. Ignored in project and local `env` |
| `OTEL_TRACES_SAMPLER` | [Undocumented] | Chooses the trace sampler. | Text, `parentbased_always_on` by default | Tracing. Not set from project `env` before trust |
| `OTEL_TRACES_SAMPLER_ARG` | [Undocumented] | Sets the sampling ratio for the `traceidratio` samplers. | A number. Blank or out of range logs an error and uses 1 | Tracing with a ratio sampler. Not set from project `env` before trust |
| `SRT_DEBUG` | [Undocumented] | Turns on `[SandboxDebug]` log lines in the bundled sandbox runtime. | Any non-empty value turns it on. Level picks `console.error`, `console.warn`, or log | Sandbox runtime |
| `SWE_BENCH_INSTANCE_ID` | [Undocumented] | Sends the SWE-bench instance id in event metadata. | Text. Empty string when unset. Goes into the event fields (`sweBenchInstanceId`) | All sessions, telemetry only |
| `SWE_BENCH_RUN_ID` | [Undocumented] | Sends the SWE-bench run id in event metadata. | Text. Empty string when unset. Goes into the event fields (`sweBenchRunId`) | All sessions, telemetry only |
| `SWE_BENCH_TASK_ID` | [Undocumented] | Sends the SWE-bench task id in event metadata. | Text. Empty string when unset. Goes into the event fields (`sweBenchTaskId`) | All sessions, telemetry only |
| `TRACEPARENT` | [Documented] | Parent trace context. Claude Code uses it as the parent of its OTEL spans. | Text. Non-empty W3C `traceparent` string. Used only when a tracing gate is on | All sessions, when OTEL tracing is on |
| `TRACESTATE` | [Documented] | Trace state that goes with `TRACEPARENT`. It is passed to the OTEL propagator. | Text. Only used when `TRACEPARENT` is set and tracing is on | All sessions, when OTEL tracing is on |

## How It Works

Telemetry features read their variables once at startup, so a change to `env` in a settings file needs a relaunch.
`DISABLE_TELEMETRY` and `DO_NOT_TRACK` also turn off feature-flag fetching, so features that depend on server flags stop working.
The official docs list the affected features under [Features That Need Feature-Flag Fetching](https://code.claude.com/docs/en/env-vars#features-that-need-feature-flag-fetching).

## Related Pages

- [Environment Variables](https://xsyetopz.github.io/claude-code-docs/configure/env-vars.md): how Claude Code reads variables and which value wins.
- [Monitoring](https://code.claude.com/docs/en/monitoring-usage) (see the official docs)
- [Undocumented Items](https://xsyetopz.github.io/claude-code-docs/reference/undocumented.md): every item that only the program shows.

Source: the program (variable names found in the `2.1.304` binary) and the [Environment Variables](https://code.claude.com/docs/en/env-vars) page of the official docs.
