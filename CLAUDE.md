# CLAUDE.md

React 19 + Vite, plain JS (no TS), Bootstrap 5 via `react-bootstrap`, SCSS theme. No test framework. Details: @THEME.md, `7th-sense-frontend-skills.md`.

## Workflow
- No `git commit`/`push` unless asked. Use Conventional Commits (`feat:`, `fix:`, `refactor:`).
- After changes: `npm run lint` (report pass/fail + errors only).
- No `npm run build` (user runs manually).

## Setup
- Copy `.env.example` → `.env`. Services call the real Go API (`../7th-sense-server`); no mocks. Base URL `/api/v1`, proxied by Vite to `API_PROXY_TARGET` (server has no CORS).
- API responses are `{ statusCode, success, message, data }` — services return `data`; errors reject with the server `message`.
- Read env vars via `src/config/env.js` only (never `import.meta.env`).
- Dev: `npm run dev` on port 3000. Import alias `@` → `src`.

## Styling
- No Tailwind, inline styles, or hex/px values. Bootstrap classes first; `ts-*` classes only when needed.
- New colors/sizes → `src/assets/scss/_variables.scss` as `$ts-*` tokens; component styles → `_components.scss`.
- Dark by default, light per user (`theme-light.scss`, see THEME.md): use `bg-body-*`, `.card-inset`, `text-body-secondary` (no `bg-light`/`bg-white`). New colour tokens need a light value in `_tokens-light.scss`.
- Page headers: `.ts-page-header` > `.ts-eyebrow`, `h1`, `.ts-page-subtitle`. No self-rendered nav.

## Forms
- Countries/states/dial codes: `constants/locations.js` (`country-region-data` + `libphonenumber-js/min`). Address forms offer only `ENABLED_COUNTRIES`; the API takes ISO `countryCode`/`stateCode`, phones as `+<code><number>`.
- Country / state assignment uses the full library (`constants/countryLibrary.js`, `ALL_COUNTRIES`; kept out of `locations.js` so only those screens bundle it). The server has no country list: it stores the names the client sends.
- Use React Hook Form + Zod (`zodResolver`). Reference: `src/pages/Customers/AddCustomer.jsx` + `customerForm.js`.
- Schema, `INITIAL_VALUES`, required logic → `<page>Form.js` next to page. Shared regexes → `src/utils/validators.js`. Conditional rules → `superRefine`.
- Field help: `<FieldLabel required help={FIELD_HELP.x}>` from `components/common/FieldLabel.jsx`. Help text → `<page>Help.js` (e.g., `customerHelp.js`). Only add help for non-obvious fields.
- Notifications: `toast.success/error/...` from `@/utils/toast`.

## Routing
- New menu: add path to `constants/routes.js` and item to `constants/navigation.js` (auto-renders Coming Soon).
- Built screen: add to `PAGES` in `src/routes/pages.jsx` (not `AppRoutes.jsx`). User Guide reads `BUILT_PATHS` for status.

## Masters (organization) screens
- Countries … Supervisors act on one user's organization. The superadmin picks the user with `<OrgUserSelect>` in the page actions; read it with `useOrgUser()` (`context/OrgUserProvider.jsx`) and pass `userId` to every `user*Service` call (sent as `?userId=`; `''` = the logged-in user). Form modals show `<OrgUserNote />`.

## Customers and users
- A customer is a company; Masters › Users manages its members (admin, supervisor, operator, QC, shop head). Customers are superadmin-only (`SUPERADMIN_ONLY`); Users are for `USER_MANAGERS` (superadmin, customer, admin) and the server limits each to their own company.
- Users reuse the Customer pages: `<CustomerList|AddCustomer|CustomerView kind={ACCOUNT_KIND.USER} />` (`pages/Customers/accountPages.js` holds the per-kind wording and routes). The user form adds an Access card: Role (`GET /roles` — only the roles the logged-in user may give), Customer (superadmin only) and Machines (`machineIds`; hidden for admins, who see every company machine).
- Role and company come from the session (`useAuth().user`), never from a request parameter; the server enforces every rule, the UI only hides what a role cannot use.
- Machines: managers (`MANAGERS`: superadmin, customer, admin) add and edit — a customer or admin always on its own company (no Customer field); only the superadmin deletes and sees the Customer column. Everyone else only reads the machines the server returns (customer/admin: the company's; other roles: their assigned ones).
- Branches are shared master data: everyone reads, only the superadmin adds / edits / deletes.
- Masters › Country … Supervisor: members work on their company's organization; only managers see Add / Edit / Delete (`useOrgUser().canEdit`).
- Countries and states are added customer-wise by the superadmin only (`useOrgUser().canAssign`; server `superAdminOnly`). Add Countries: a `MultiSelectPicker` of every library country not yet added. Add States: one of the user's countries, then a `MultiSelectPicker` of its states. Each pick is its own `POST /user-country` / `/user-state` row; the States table shows the country name. Customers and their users only read what is added.

## Machine catalog
- Brand → Controller → Model (`services/catalogService.js`). Masters › Machine Catalog (Controllers, Models) is superadmin-only: `roles: SUPERADMIN_ONLY` on the pages and menu item (server: `superAdminOnly` routes). Every user reads the lists for the machine form, which filters controllers by brand and models by controller.

## Clientele and parts
- Both belong to a customer (company) and use the Machine page pattern (`pages/Clienteles/`, `pages/Parts/`): everyone reads their company's, `MANAGERS` add / edit / delete; the superadmin picks the customer on the form, others always save to their own company.
- A part needs a clientele and applicable machines of its customer: both lists load after the customer is known (controlled selects) and are cleared when it changes. A clientele that parts use cannot be deleted.
- Clientele stores country and state as names (`countryName` / `stateName`, e.g. "India" / "Gujarat"); the form picks them by ISO code (state list, dial code) and converts in `clienteleForm.js`. `contactNumber` is `+<code><number>` (typed without the dial code).

## Shifts
- Masters › Shift has three screens, each a form beside its list (Edit loads a row into the form, or opens the shift modal; same access as clientele and parts, form only for `MANAGERS`): Add / Manage Shift (`pages/Shifts/`, cards), Breaks (`pages/Breaks/`) and Holiday / Week Off (`pages/Holidays/`).
- A break belongs to a customer and to at most one of its shifts (`breaks.shift_id`; `shiftId` / `shiftName` in the API, null = no shift). It is put on a shift from either side: the Shift select on Breaks, or the "Shift Break Type" rows of `ShiftFormModal` (sends `breakIds`; offers only breaks no other shift takes). Saving a shift releases the breaks left out; deleting it releases all. `shiftSchema(breaksById)` mirrors the server rules (inside the shift, no overlap).
- Times are `"HH:mm"` (TimePicker); an end not after the start runs past midnight. `utils/dateTime.js` has `minutesBetween` / `formatClock12`. Holidays have a name and dates (DatePicker); week offs a weekday (`WEEKDAYS`, 1 = Mon).
