# 0008. Folder structure by page and by concern

- **Date:** 2026-11-03
- **Status:** Accepted (Inferred from existing code)

## Context

The app grows by screens.

## Decision

`src/pages/<Area>/` holds a page, its modals and its settings file; `services/` API modules; `components/` shared UI (common, charts, layout); `hooks/`, `context/`, `constants/`, `utils/`.

## Alternatives considered

- Feature folders with their own services
- Atomic design

## Consequences

- Easy to find a page and its pieces; page docs map one to one.
- Shared logic must be moved to components / hooks deliberately.
