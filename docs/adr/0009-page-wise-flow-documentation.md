# 0009. Page-wise flow documentation in docs/pages

- **Date:** 2026-11-03
- **Status:** Accepted

## Context

New developers need to see how a screen works end to end, client and server, without reading every file.

## Decision

Keep one Markdown file per page in `docs/pages/` (route, purpose, on load, one section per action with a Mermaid sequence diagram and linked steps, API table linking Swagger, state, components, decisions) plus an index. Update them in the same task as any meaningful change (CLAUDE.md "Documentation Rules").

## Alternatives considered

- Only code comments
- A wiki outside the repo

## Consequences

- Docs live next to the code and are reviewed with it.
- They are kept up to date by hand; links are checked when pages change.
