# Dig Into Program-Only Items

## Why

After `close-open-items`, three facts still come only from reading the program:

- `/usage`: the "rate limited until <time>" text (usage endpoint itself rate limited).
- Notification hooks: `worker_permission_prompt`, `push_notification`, `computer_use_enter`, `computer_use_exit`, `auth_storage_failure`, and `model_refusal_fallback` (not in the docs row) were not seen live.
- `autoMode.classifyAllShell`: which value wins when managed and user settings differ.

## What Changes

- Try new ways to trigger each one locally (fake key, local stub, proxy, temp HOME).
- Where a run works, replace "the program says" with the observed fact. Where it does not, say why.
- Record the probes in `docs/reference/probes.md`.
