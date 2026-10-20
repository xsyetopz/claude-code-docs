# Tasks: Track Claude Code 2.1.305

- [x] 1.1 Regenerate schemas from 2.1.305; list key diffs vs 2.1.304 (new: attributionProject, attributionProjectPolicy, sandbox.allowNestedUserNamespaces, keybinding settings:fixUsage)
- [x] 1.2 Binary diff 2.1.304 -> 2.1.305 (env vars, flags, commands, settings, gates, mod API) -> binary-diff.md
- [x] 1.3 Recapture and re-render prompts; review diffs (only cc_version + UUIDs changed)
- [x] 1.4 Apply release-note + diff changes to pages
- [x] 1.5 Bump version strings (src/version.ts, docs, plugin, README, CLAUDE.md, CHANGELOG)
- [x] 1.6 build, plugin:snapshot, verify:locked; reviewer; commit
