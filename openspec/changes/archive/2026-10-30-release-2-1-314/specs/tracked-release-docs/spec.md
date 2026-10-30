# Tracked-Release-Docs

## MODIFIED Requirements

### Requirement: Version Labels

Each current-behavior version label SHALL name the tracked version only after the labelled fact is
checked against that version.
Change notes and dated probe records SHALL keep their versions.
`docs/start/what-changed.md` SHALL hold only the tracked version's section, and that section SHALL
compare the tracked version with the release before it.
The site SHALL NOT keep a section, a table, or a page for any older release. For an older release,
the page SHALL link the official changelog at `https://code.claude.com/docs/en/changelog`.

#### Scenario: Label Sweep

- **WHEN** the change is done and someone runs `grep -rn '2\.1\.312' docs`
- **THEN** each line it prints is a change note, a dated record, or a line of the `2.1.314` section
  that names what the behavior was before

#### Scenario: One Section Only

- **WHEN** a reader opens What Changed after the release to `2.1.314`
- **THEN** the page holds the `2.1.314` section and no other release section, and `docs/` has no
  release archive page

#### Scenario: Fact Map

- **WHEN** `bun run release:facts -- --check` runs after the older sections are removed
- **THEN** it reports no `unmapped` fact, and `tools/release/facts/map.json` has no key under a
  removed page
