# Bump <site|clawdipedia-docs|clawdipedia-docs-cli|cc-inspect|all> <patch|minor|major>, and sync the Claude Code version in the marketplace
bump *args:
    bun tools/version/bump.ts {{args}}
