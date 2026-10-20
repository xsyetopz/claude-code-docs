# Close Open Items

## Why

Four facts in the docs are still marked as not run or not seen:

- `docs/configure/permissions/auto-mode.md`: "Managed settings were not run" for `autoMode`.
- `docs/start/what-changed.md`: the `/artifacts` delete confirmation was not shown.
- `docs/start/what-changed.md`: the `/usage` rate-limit end time was not shown.
- `docs/extend/hooks/events.md`: cloud-only `notificationType` values were not seen live.

## What Changes

- Probe each item (sudo managed folder run by the user, fake key plus local stub, or reading the program).
- Replace each hedge with the observed fact, or state plainly what the program says when a run is not possible.
- Record the probes in `docs/reference/probes.md`.
