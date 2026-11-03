# 0002. React Router with one route table and role guards

- **Date:** 2026-11-03
- **Status:** Accepted (Inferred from existing code)

## Context

Many screens share one layout and are limited by role (superadmin, customer, admin, members). The sidebar and the user guide also need to know which screens exist.

## Decision

Declare every built screen in `src/routes/pages.jsx` (`PAGES`: path, element, roles) with paths from `constants/routes.js`. `AppRoutes.jsx` wraps them in `ProtectedRoute` (session) and a role guard; unbuilt sidebar links render `ComingSoon`.

## Alternatives considered

- Routes scattered in components
- Route-level loaders (React Router data APIs)

## Consequences

- One place to add or protect a page; the page index (docs/pages/README.md) mirrors PAGES.
- The client role check is UX only: the server enforces roles again (managersOnly / superAdminOnly).
