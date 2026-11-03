# Not found / Forbidden

- **Route:** `*` (any unknown path) · **Component:** [NotFound.jsx](../../src/pages/NotFound/NotFound.jsx) · Forbidden: [Forbidden.jsx](../../src/pages/Forbidden/Forbidden.jsx) · **Auth:** protected · **Guard/Layout:** `ProtectedRoute` · `MainLayout`
- **Purpose:** Tells the user the page does not exist (NotFound) or that their role may not open it (Forbidden, rendered by [ProtectedRoute.jsx](../../src/routes/ProtectedRoute.jsx)).
- **Navigation:** Unknown URL / role not allowed → this page → Home

No API calls.

## Decisions

- [Client ADR index](../adr/README.md)
