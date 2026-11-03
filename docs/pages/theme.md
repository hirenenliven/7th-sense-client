# Theme showcase

- **Route:** `/theme` · **Component:** [ThemeShowcase.jsx](../../src/pages/ThemeShowcase/ThemeShowcase.jsx) · **Auth:** protected (every logged-in role) · **Guard/Layout:** `ProtectedRoute` (session) + role guard · `MainLayout`
- **Purpose:** Showcase of the design tokens and components (developer reference).
- **Navigation:** Sidebar › System → Theme

## UI states

- **Error:** a red `<Alert>` with the server message (some pages add Retry).
- **Success / failure of an action:** toast message (`utils/toast.js`).

## State & storage

- Local component state (`useState`) for filters, form and modal

## Shared components used

[DatePicker.jsx](../../src/components/common/DatePicker.jsx), [TimePicker.jsx](../../src/components/common/TimePicker.jsx)

## Decisions

- [Client ADR index](../adr/README.md)
