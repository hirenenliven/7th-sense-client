# 0001. Single-page app with React 19 and Vite

- **Date:** 2026-11-03
- **Status:** Accepted (Inferred from existing code)

## Context

The UI is a dashboard for CNC monitoring used behind a login; no SEO or server rendering is needed.

## Decision

Build the client as a React 19 SPA bundled with Vite (`npm run dev`), JavaScript + PropTypes (no TypeScript).

## Alternatives considered

- Next.js (SSR not needed)
- Create React App (unmaintained)
- TypeScript (more safety, slower to change for this team)

## Consequences

- Fast dev server and builds; static files can be served by any host.
- No compile-time types: PropTypes and ESLint carry that load.
