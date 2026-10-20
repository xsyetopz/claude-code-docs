---
title: Enterprise Settings
description: Keys that control how managed settings arrive and which Claude Code versions may run.
sidebar_position: 9
---

These keys let an administrator control how managed settings arrive and which versions may run.
They work in managed settings.
For the places managed settings can come from, see the managed settings section of the index page.

Only use these keys if you manage a machine or organization. `forceRemoteSettingsRefresh` and `wslInheritsWindowsSettings` are switches.

## Keys

Source: [Settings Reference](https://code.claude.com/docs/en/settings-reference) for rows marked <Documented />. For rows marked <Undocumented />, Source: the program (its bundled settings schema).
Where to Set It tells you which files may set the key. See [Settings Files and Scopes](index.md#where-settings-live).

| Key | Status | Type | Default | What It Does | Where to Set It |
| --- | --- | --- | --- | --- | --- |
| `forceRemoteSettingsRefresh` | <Documented /> <ManagedOnly /> | boolean | - | Block startup until server-managed settings are freshly fetched. Claude Code exits if the fetch fails. | Managed settings only |
| `managedSourcesBehavior` | <Documented /> | enum: `first-wins`, `merge` | - | Compose every managed source you deploy instead of using the highest-priority one alone. `first-wins` (the default) uses the highest source alone. `merge` combines them. | Managed settings only |
| `parentSettingsBehavior` | <Documented /> | enum: `first-wins`, `merge` | - | Apply or drop restrictions an SDK or IDE host passes when you deploy managed settings. `first-wins` drops the parent tier. `merge` unions it in. | Managed settings only |
| `policyHelper` | <Documented /> <ManagedOnly /> | object: `path`, `timeoutMs`, `refreshIntervalMs` | - | Run an executable that computes managed settings at startup. Honored only from admin-controlled policy sources. `timeoutMs` is at least 1000. `refreshIntervalMs` is `0` or at least 60000. A `path` of `null` counts as unset. Source: the program. | Managed settings only |
| `policyHelpers` | <Undocumented /> | object: `macos`, `linux`, `windows`, `wsl`, `default` | - | Give each platform its own policy helper or static payload (`defaultSettings`). `default` is a static payload. WSL tries its own entry, then `linux`. The first helper on the platform chain wins over `policyHelper`. If none runs, the first static payload applies, then `default`, then `policyHelper`. The program marks the key `@internal`. | Settings files |
| `requiredMaximumVersion` | <Documented /> <ManagedOnly /> | string | - | Refuse to start on a version newer than your organization allows. Claude Code exits at startup with install steps. Managed settings only. | Managed settings only |
| `requiredMinimumVersion` | <Documented /> <ManagedOnly /> | string | - | Refuse to start on a version older than your organization requires. Claude Code exits at startup with update steps. Managed settings only. | Managed settings only |
| `wslInheritsWindowsSettings` | <Documented /> | boolean | - | Have WSL read managed settings from the Windows policy chain. Set in an admin-only Windows source. No effect on native Windows. | Managed settings only |

## Example

### Require a Version Range

This file stops versions older than `2.1.300` from starting and merges all managed sources instead of using the top one alone.

```json title="/etc/claude-code/managed-settings.json"
{
  "requiredMinimumVersion": "2.1.300",
  "managedSourcesBehavior": "merge"
}
```

## Related Pages

- [Settings Files and Scopes](index.md) explains the scopes, precedence, and managed settings.
- [Settings Reference](https://code.claude.com/docs/en/settings-reference) is the official page for each key.
- [Deploy Managed Settings](https://code.claude.com/docs/en/managed-settings) is the guide for administrators.
