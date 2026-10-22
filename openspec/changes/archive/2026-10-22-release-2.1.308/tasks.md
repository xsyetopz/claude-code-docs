# Tasks: Release Claude Code 2.1.308

## 1. Release

- [x] 1.1 Read `captures/2.1.308/diff/report.md` and `compare/compare.md`.
  Rerun the 2 changed cases on 2.1.306, 2.1.307, and 2.1.308 (both are noise)
- [x] 1.2 Check the version-labelled lines against 2.1.308: prompt pages, interactive captures, `--help` of 9 commands, settings key counts, and code read around each identifier
- [x] 1.3 Update labels, the observer probe row, `what-changed.md`, plugin manifest, and skill.
  Map the new claim in `map.json`
- [x] 1.4 `release:claims -- --check`, `verify:locked`, read the diff, commit
