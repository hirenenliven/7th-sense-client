# CLAUDE.md

React 19 + Vite, plain JS (no TS), Bootstrap 5 via `react-bootstrap`, SCSS theme. No test framework. Details: @THEME.md, `7th-sense-frontend-skills.md`.

## Workflow
- No `git commit`/`push` unless asked. Use Conventional Commits (`feat:`, `fix:`, `refactor:`).
- After changes: `npm run lint` (report pass/fail + errors only).
- No `npm run build` (user runs manually).

## Setup
- Copy `.env.example` → `.env`. `VITE_USE_MOCK_API=true` returns mock data from `src/services/*` (support this branch).
- Read env vars via `src/config/env.js` only (never `import.meta.env`).
- Dev: `npm run dev` on port 3000. Import alias `@` → `src`.

## Styling
- No Tailwind, inline styles, or hex/px values. Bootstrap classes first; `ts-*` classes only when needed.
- New colors/sizes → `src/assets/scss/_variables.scss` as `$ts-*` tokens; component styles → `_components.scss`.
- Dark theme only: use `bg-body-*`, `.card-inset`, `text-body-secondary` (no `bg-light`/`bg-white`).
- Page headers: `.ts-page-header` > `.ts-eyebrow`, `h1`, `.ts-page-subtitle`. No self-rendered nav.

## Forms
- Use React Hook Form + Zod (`zodResolver`). Reference: `src/pages/Customers/AddCustomer.jsx` + `customerForm.js`.
- Schema, `INITIAL_VALUES`, required logic → `<page>Form.js` next to page. Shared regexes → `src/utils/validators.js`. Conditional rules → `superRefine`.
- Field help: `<FieldLabel required help={FIELD_HELP.x}>` from `components/common/FieldLabel.jsx`. Help text → `<page>Help.js` (e.g., `customerHelp.js`). Only add help for non-obvious fields.
- Notifications: `toast.success/error/...` from `@/utils/toast`.

## Routing
- New menu: add path to `constants/routes.js` and item to `constants/navigation.js` (auto-renders Coming Soon).
- Built screen: add to `PAGES` in `src/routes/pages.jsx` (not `AppRoutes.jsx`). User Guide reads `BUILT_PATHS` for status.
