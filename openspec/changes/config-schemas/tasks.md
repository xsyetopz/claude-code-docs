# Tasks: Config Schemas

## 1. Extract

- [x] 1.1 Generator in `tools/schemas/` (method A, else B) and the six files in `schemas/`
- [x] 1.2 `schemas:check` with fixtures; wire into verify

## 2. Publish

- [x] 2.1 Serve at `/schemas/`; docs page `docs/reference/schemas.md`; sidebar entry
- [x] 2.2 Compare with schemastore.org versions; note gaps on the page

## 3. Finish

- [x] 3.1 `bun run verify:locked` passes; reviewer checks the diff
- [ ] 3.2 Local commit (do not push)
