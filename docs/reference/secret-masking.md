---
title: Secret Masking
description: How Claude Code finds secrets in text and replaces them with a marker, with the rule table, the tiers, and the order.
sidebar_position: 12
---

Claude Code masks text that looks like a secret before it shows or records the text.
It replaces the secret with `[REDACTED]`. This page describes the algorithm and the rule table.
It does not list each pattern.
Source: the program (`chunk-3cfs0sm8.js@53752` to `@67138`). Every row is <Undocumented />.

## The Rule Table

One table holds 65 rules. Each rule has an `id`, a `source` pattern, and a `confidence` tier.
Some rules also have a `prefilter` (a cheap test that runs first), a `run` or `displayRun` (a character class for long runs), and `redactOnly`.

| Tier | Rules | What the rules match |
| --- | --- | --- |
| `low` | 13 | Context rules. Examples: `url-userinfo`, `sensitive-assign`, `cloud-env-var`, `http-auth-scheme`, `loose-jwt`, `loose-anthropic-key`, `gcp-service-account`. |
| `high` | 52 | Token rules for one vendor format. Examples: `aws-access-token`, `github-pat`, `anthropic-api-key`, `openai-api-key`, the `gitlab-*` family, the `slack-*` family, `stripe-access-token`. |

The table order is the order of use. The `low` rules come first, then the `high` rules, from `aws-access-token` to `shopify-shared-secret`.

## Passes

| Pass | What it does |
| --- | --- |
| `redactContext(text, includeRedactOnly)` | First it masks private-key blocks. Then it applies each `low` rule in table order. A `redactOnly` rule runs only when the flag is `true`. A rule with a `prefilter` runs only when the prefilter matches. The marker keeps the key name or prefix, and keeps one pair of quotes around the value. |
| `redactTokens(text)` | Applies each `high` rule in table order. A rule is skipped when its `prefilter` does not match. |
| `redact(text)` | Finds URL ranges first. With none, it runs `redactContext` with `redactOnly` rules on, then `redactTokens`. With URL ranges, it tracks the matches so that the URL stays readable. It caches the result for short strings. |
| `redactForDisplay(text)` | A separate rule set that uses only the `high` tier. It leaves a match alone when the matched text holds a shell character (`$`, a backtick, `\|`, `;`, `&`, `<`, `>`, `(`, `)`, a space) or a path character (`/`, `.`, `@`, `:`, `~`, `*`, `?`, `\`). So a command or a path does not break. |

A `high` rule matches only when no letter, digit, `_`, or `-` comes before it. After it, no letter, digit, `_`, `-`, `+`, or `=` may follow.
A rule with a run class matches a token that is split by a long run of that class, and it reads the whole run.
The program sizes its work on long text in units of 16,384 characters.

## Private Keys

A separate reader looks for the text `-----BEGIN`, with no case check on the word, and any number of extra `-` characters.
It reads each block to its end and replaces the whole block with `[REDACTED]`. It runs before the `low` rules.

## Where It Applies

The program runs `redactForDisplay` on the key names of previews of tool input and on the text of permission requests that it sends to a connected client.
Other callers use `redact`.
:::note[Not Verified]
This page does not list every caller of the masking functions.
:::

## Related Pages

- [Transcript Format](transcript-format.md)
- [Probes](probes.md)
