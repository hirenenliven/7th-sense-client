# User guide

- **Route:** `/user-guide` · **Component:** [UserGuide.jsx](../../src/pages/UserGuide/UserGuide.jsx) · **Auth:** protected (every logged-in role) · **Guard/Layout:** `ProtectedRoute` (session) + role guard · `MainLayout`
- **Purpose:** Explains the screens; reads the route table to show which are available.
- **Navigation:** Sidebar › System → User Guide

## UI states

- **Delete:** asks for confirmation first.

## State & storage

- None.

## Shared components used

[InfoTooltip.jsx](../../src/components/common/InfoTooltip.jsx)

## Decisions

- [Client ADR index](../adr/README.md)
