# CLAUDE.md

React 19 + Vite, plain JS (no TS), Bootstrap 5 via `react-bootstrap`, SCSS theme. No test framework. Details: @THEME.md, `7th-sense-frontend-skills.md`.

## Graphify (code navigation — use first)
- A knowledge graph of this repo lives in `graphify-out/` (`graph.json`, `GRAPH_REPORT.md`). Before exploring code with Grep/Glob/Read, use it to find the relevant files and relations:
  - `graphify query "<question>"` (broad context; `--dfs` to trace a flow, `--budget 1500` to cap), `graphify path "A" "B"`, `graphify explain "X"`.
  - `GRAPH_REPORT.md` lists the communities (feature areas) and god nodes — skim it for orientation.
- Then open only the files the graph points to (cite `source_location`). Fall back to Grep/Glob if the graph has no answer or looks stale.
- After adding/renaming/removing files: `graphify update .` (code only, no LLM) so the graph stays current. Never hand-edit `graphify-out/`.
- Details: "Graphify" section of `7th-sense-frontend-skills.md`.

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

## Tables
- All list tables use the sortable table pattern: wrap `<Table responsive>` in `.ts-table-panel`, use `<SortableHead columns sort onSort />` as the `<thead>`, and integrate `TablePagination` as the footer.
- Sortable columns: define `columns = [{ label, sort: (row) => value }, 'Actions']` → `const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))`, then render `sortedRows`. Plain string columns (Actions, View) are not sortable.
- Latest-first ordering: after filtering, apply `newestFirst(matched)` from `utils/helpers.js` so new rows appear at the top.
- Customer column: for superadmin views, add `{ label: 'Customer', sort: (row) => customerLabel(row.userId) }` and use `useOrgUser().customerLabel(userId | customerId)` in the row.
- Status badge: use `<StatusBadge active={…} />` for Active/Inactive status (green pill with glowing dot, red for inactive).

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
- Countries … Supervisors: the superadmin's lists show every customer's rows (Customer column, `useOrgUser().customerLabel`); there is no page-level customer picker. The add / edit modals have `<OrgCustomerField>` (superadmin only; locked on edit): the schema gets `customerId` via `withCustomer`, parent options are the picked customer's (`ownedBy`, branches by `customerId`), and saves / deletes send that customer as `userId` (`?userId=`). Other users always work on their own company (`''`). Helpers: `utils/orgCustomer.js`.

## Customers and users
- A customer is a company; Masters › Users manages its members (admin, supervisor, operator, QC, shop head). Customers are superadmin-only (`SUPERADMIN_ONLY`); Users are for `USER_MANAGERS` (superadmin, customer, admin) and the server limits each to their own company.
- Users reuse the Customer pages: `<CustomerList|AddCustomer|CustomerView kind={ACCOUNT_KIND.USER} />` (`pages/Customers/accountPages.js` holds the per-kind wording and routes). The user form adds an Access card: Role (`GET /roles` — only the roles the logged-in user may give), Customer (superadmin only) and Machines (`machineIds`; hidden for admins, who see every company machine).
- Role and company come from the session (`useAuth().user`), never from a request parameter; the server enforces every rule, the UI only hides what a role cannot use.
- Machines: managers (`MANAGERS`: superadmin, customer, admin) add and edit — a customer or admin always on its own company (no Customer field); only the superadmin deletes and sees the Customer column. Everyone else only reads the machines the server returns (customer/admin: the company's; other roles: their assigned ones).
- Branches are shared master data: everyone reads, only the superadmin adds / edits / deletes. A branch needs a customer; its City list is that customer's cities (cleared when the customer changes).
- Country, City and Branch tables show a Customer column: `useOrgUser().customerLabel(userId | customerId)`.
- Masters › Country … Supervisor: members work on their company's organization; only managers see Add / Edit / Delete (`useOrgUser().canEdit`).
- Countries and states are added customer-wise by the superadmin only (`useOrgUser().canAssign`; server `superAdminOnly`). Add Countries: a `MultiSelectPicker` of every library country not yet added. Add States: a `MultiSelectPicker` of the user's countries, then one of their states grouped by country (keys `"<userCountryId>:<name>"`, `stateForm.js`). Each pick is its own `POST /user-country` / `/user-state` row; the States table shows the country name. Customers and their users only read what is added.

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

## Downtime and idle reasons
- Masters › Downtime › Downtime List / Idle List (`pages/Reasons/`, `services/downtimeReasonService.js` / `idleReasonService.js`): one `<ReasonList kind={REASON_KIND.DOWNTIME|IDLE} />` serves both (`reasonPages.js` holds each kind's wording and service calls; `key={kind}` in `PAGES`). Same access as clientele: everyone reads their company's (superadmin all + Customer column / filter), `MANAGERS` add / edit / delete in `ReasonFormModal` (superadmin picks the customer). Fields: Reason Code (optional, ≤ 10), Reason (≤ 50), Status on edit.

## Licence keys
- Masters › Licence Keys (`pages/LicenceKeys/`, `services/licenceKeyService.js`, menu and page `roles: MANAGERS`): the superadmin's Generate Licence Key card (`LicenceKeyGenerator`) sits above the list. Generate Key calls `POST /licence-keys/generate {count}` (keys shown, not saved); the keys are a `useFieldArray` (`keys: [{licenceKey, duration}]`) with a Subscription Duration select per key (`LICENCE_DURATIONS` in `licenceKeyForm.js`, mirrors server `dto.LicenceKeyDurations`; default Considerable Trial, "Set all" select); Save posts `{userId, licenceKeys: keys}` (all or none). Changing No. Of Key clears the generated keys. The server stores the end date (`expiresOn`, null = Life Time; `isExpired`).
- List: superadmin sees every customer's (Customer column + filter), edits customer / duration / status in `LicenceKeyFormModal` (the key never changes) and deletes; customers and admins only read their company's. Keys look like `K7M2Q-XR9TB-4HWZP-N8CDF` (server-generated, `font-monospace`; Duration / Expires On columns, Expired filter).

## Production schedule
- Production › Schedule (`pages/ProductionSchedules/`, `services/productionScheduleService.js`): list for everyone (their company's; superadmin all + Customer column), Add / Edit for `MANAGERS` (`PRODUCTION_SCHEDULE_ADD|EDIT`). Same customer pattern as parts: the superadmin picks the customer, others save to their own company; changing the customer clears the machine and every job pick, changing the machine clears the processes.
- Schedule Type: Single Day (one `startDate`; jobs use it) or Multiple Day (`startDate`–`endDate`, each job picks its `scheduleDate`). Jobs are a `useFieldArray` (`items`, `itemId` = saved id): Job ID, Supervisor / Operator (`GET /users?filterRole=supervisor|operator`), Shift, Part, Qty., Part Process (the part's processes whose `machineIds` include the machine, loaded with `getPartById`), Start / End Time (TimePicker, inside the shift). The server refuses jobs outside their shift, overlapping jobs and a machine already scheduled that day.
