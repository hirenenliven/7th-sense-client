# User guide

- **Route:** `/user-guide` · **Component:** [UserGuide.jsx](../../src/pages/UserGuide/UserGuide.jsx), content in [userGuideContent.js](../../src/pages/UserGuide/userGuideContent.js) · **Auth:** protected (every logged-in role) · **Guard/Layout:** `ProtectedRoute` (session) + role guard · `MainLayout`
- **Purpose:** Self-help for customers. It walks through first-time setup in order, explains who can do what and how the screens work, and answers the common problems and error messages, so small questions don't reach support.
- **Navigation:** Sidebar › System → User Guide · Header › Profile menu → User Guide

## On page load

No API calls. The page renders static content from [userGuideContent.js](../../src/pages/UserGuide/userGuideContent.js). It uses three things from the app:

- `useAuth()`: the logged-in role. It shows "Signed in as …", highlights the role's row, and decides which Open links to show.
- `BUILT_PATHS` from [pages.jsx](../../src/routes/pages.jsx): an Open link appears only for screens that are built.
- `NAV_SECTIONS` from [navigation.js](../../src/constants/navigation.js): the "All screens" list, filtered by role, with Available / Coming soon badges.

## Sections

1. **Search and jump links.** One search box filters every section below. Matching accordion items open; with no match, the page says so and points to Contact support. Error messages are quoted word for word in the content, so users can paste the text they see. The jump links scroll to each section.
2. **First-time setup** (`SETUP_STEPS`): numbered steps in the order the screens depend on each other.
   - *Done for you by your account team* (superadmin): customer account, countries / states, licence keys, machine catalog.
   - *Your setup*: first login, organization (City → Supervisor), shifts / breaks / holidays, downtime and idle reasons, machines, users, clientele, parts, production schedule, monitoring.
   - Each step has a who badge (`WHO`), what to do, tips, and an Open screen link. The link shows only when the role does that step and the screen is built. The first "Your setup" step starts open.
3. **Who can do what** (`ROLE_ACCESS`): one row per role. The user's own row is highlighted.
4. **Screens.** First, how every list works (`LIST_BASICS`: search, rows per page, edit / delete, status). Then an accordion per sidebar area (`SCREENS`), with who may change each screen and an Open link. The last item lists every screen this login can see, and whether it is available.
5. **Troubleshooting** (`TROUBLESHOOTING`): question / answer accordions by topic:
   - signing in and access
   - forms and saving
   - organization
   - machines and monitoring
   - shifts, parts and schedules
6. **Still need help?** (`SUPPORT_CHECKLIST`): what to send the administrator or account team.

## UI states

- **Searching:** sections with no match are hidden, and matching items are open (each accordion remounts per search term). If nothing matches anywhere, the page shows an empty-state message.
- **Not searching:** accordions are closed except the first "Your setup" step.

## Rules & edge cases

- Keep [userGuideContent.js](../../src/pages/UserGuide/userGuideContent.js) in step with the screens and the server rules. Quote error messages exactly as the server sends them.
- Field-by-field format help stays on the forms (`FIELD_HELP` → (i) popovers), not in the guide.

## State & storage

- Local `useState` for the search text only.

## Shared components used

[InfoTooltip.jsx](../../src/components/common/InfoTooltip.jsx)

## Decisions

- [Client ADR index](../adr/README.md)
