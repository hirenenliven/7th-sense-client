# Coming soon (unbuilt sidebar links)

- **Route:** every sidebar link that is not in `PAGES` (e.g. `/machines/groups`, `/production/monitor`, `/tools`, `/reports/*`, `/masters/operations`, `/masters/roles`) · **Component:** [ComingSoon.jsx](../../src/pages/ComingSoon/ComingSoon.jsx) · **Auth:** protected (the link's roles) · **Guard/Layout:** `ProtectedRoute` + role guard · `MainLayout`
- **Purpose:** Placeholder that names the screen and its section until it is built.
- **Navigation:** Sidebar link → Coming soon

## On page load

[AppRoutes.jsx](../../src/routes/AppRoutes.jsx) registers a route for each sidebar link whose path is not in `BUILT_PATHS` ([pages.jsx](../../src/routes/pages.jsx)) and renders `ComingSoon` with the link's label. No API calls.

## Decisions

- [Client ADR index](../adr/README.md)
