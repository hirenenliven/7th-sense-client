# 0003. Server state via service modules and useLoad, Context only for the session

- **Date:** 2026-11-03
- **Status:** Accepted (Inferred from existing code)

## Context

Pages mostly read lists and charts and save forms; little state is shared across pages except the logged-in user and the theme.

## Decision

Each API resource has a module in `src/services/` wrapping axios (`apiClient`, `sharedGet`, `withQuery`). Pages load data in `useEffect` or the `useLoad(load, key, {refreshMs})` hook (polling for live charts). Auth and theme live in React Context (`AuthProvider`); there is no global store.

## Alternatives considered

- Redux Toolkit / RTK Query
- TanStack Query

## Consequences

- Little boilerplate; each page owns its state.
- No shared cache: two pages loading the same list fetch it twice; revisit (new ADR) if that hurts.
