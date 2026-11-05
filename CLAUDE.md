# CLAUDE.md

React 19 + Vite, plain JS (no TS), Bootstrap 5 via `react-bootstrap`, SCSS theme. No test framework. Details: @THEME.md, `7th-sense-frontend-skills.md`.

**## Graphify (mandatory first step for every task)
- Before investigating or changing code for any task, read this CLAUDE.md and use the latest repository knowledge graph in graphify-out/ (graph.json, GRAPH_REPORT.md) to understand the relevant feature area, files, dependencies, and relationships.
- Start with GRAPH_REPORT.md for orientation, then run the relevant graphify queries:
  - graphify query "<question>" for broad context; use --dfs to trace a flow and --budget 1500 to cap output.
  - graphify path "A" "B" to trace relationships between components.
  - graphify explain "X" to inspect a specific node.
- Use Graphify to identify all potentially affected files and dependent flows before making changes. Trace relevant frontend, service/API, backend, database, shared-component, and business-logic connections where applicable.
- After identifying files through Graphify, inspect the actual source code before editing. Graphify is a navigation aid, not the source of truth; verify current implementations and search further with Grep/Glob when the graph is incomplete, has no answer, or appears stale.
- Do not start implementation until you understand the existing flow and have identified the files that need to change. Make the smallest complete set of changes; do not overlook dependent files or modify unrelated areas.
- After adding, renaming, or removing files: run graphify update . (code only, no LLM) so the graph stays current. Never hand-edit graphify-out/.
- Details: "Graphify" section of 7th-sense-frontend-skills.md.
Workflow**
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

- No search / filter results: keep the panel and header; put `<TableNoResults colSpan={columns.length} message onClear={clearFilters} />` (`components/common/TableNoResults.jsx`) as the last `<tbody>` row when `!pageRows.length`, show `TablePagination` only when `filtered.length > 0` (card views: `<NoResults />`). `.ts-empty` is only for a list with no rows at all.

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

- One page, Masters › Organization (`pages/Organization/OrganizationPage.jsx`, ADR 0010): page header + `Nav variant="tabs"`, a tab per level (`ORGANIZATION_TABS` in `constants/organization.js`: Country, State, City, Branch, Location, Shop, Line, Cell, Supervisor). Each tab keeps its own route and list; `PAGES` wraps it as `<OrganizationPage><XList /></OrganizationPage>`. The lists render a `.ts-tab-header` (h2 `.ts-section-title`, `.ts-note`, actions), not a page header. The sidebar has one Organization item (`activePaths: ORGANIZATION_PATHS`); Add / Edit Branch are separate pages.

- Countries … Supervisors: the superadmin's lists show every customer's rows (Customer column, `useOrgUser().customerLabel`); there is no page-level customer picker. The add / edit modals have `<OrgCustomerField>` (superadmin only; locked on edit): the schema gets `customerId` via `withCustomer`, parent options are the picked customer's (`ownedBy`, branches by `customerId`), and saves / deletes send that customer as `userId` (`?userId=`). Other users always work on their own company (`''`). Helpers: `utils/orgCustomer.js`.

## Account Center (system)

- One page, System › Account Center (`pages/AccountCenter/AccountCenterPage.jsx`, ADR 0011 → 0014; formerly Business Setup): tabs Customer, Licence Key, Machine Catalog (`ACCOUNT_CENTER_TABS` in `constants/accountCenter.js`, filtered by each tab's `roles`; Machine Catalog has Brands / Controllers / Models `subTabs`, a second `Nav variant="tabs"` row). Same pattern as Organization: each tab keeps its own route, `PAGES` wraps it as `<AccountCenterPage><XList /></AccountCenterPage>`, the screens render a `.ts-tab-header`. Sidebar: one Account Center item in the System section, superadmin only (ADR 0016; every tab is `SUPERADMIN_ONLY`; `ROUTES.ACCOUNT_CENTER` = `/account-center` redirects to the first tab; `activePaths: ACCOUNT_CENTER_PATHS`). Add / Edit / View Customer stay separate pages. The Customer list is tabbed only for customers (`ACCOUNT_PAGES[kind].tabbed`); the Users list keeps its page header.

## Customers and users

- A customer is a company; Masters › Users manages its members (admin, supervisor, operator, QC, shop head). Customers are superadmin-only (`SUPERADMIN_ONLY`); Masters › Users is for `MANAGERS` and lists company members only (`GET /users?membersOnly=true`, ADR 0016): the server limits a customer / admin to their own company's users, the superadmin sees every company's (Customer column). The Account Center Customer list sends `?filterRole=customer`.

- Users reuse the Customer pages: `<CustomerList|AddCustomer|CustomerView kind={ACCOUNT_KIND.USER} />` (`pages/Customers/accountPages.js` holds the per-kind wording and routes). The user form adds an Access card: Role (`GET /roles` — only the roles the logged-in user may give), Customer (superadmin only) and Machines (`machineIds`; hidden for admins, who see every company machine).

- Password on the customer / user form: required when adding; when editing a **New Password** field (eye show / hide) starts empty — a typed value is sent as `password` on `PUT /users/{id}` and replaces it, blank sends nothing and keeps it (`toUserPayload`).

- Log in as customer (ADR 0018, server ADR 0008): View on an Account Center › Customer row opens an empty tab, calls `POST /auth/login-as` and sends the tab to `/#loginAs=<sessionKey>`; `takeLoginAsFromUrl()` (main.jsx) keeps the key in that tab's sessionStorage and drops the hash, so the tab shows the dashboard as the customer like a normal login (no special route or badge). That tab calls the API under `/api/as/<sessionKey>/v1` (`apiBaseUrl()`, used by the axios interceptor and file links: build API URLs with it, not `env.apiBaseUrl`). Its own HttpOnly cookie means logout in either tab never ends the other.

- Role and company come from the session (`useAuth().user`), never from a request parameter; the server enforces every rule, the UI only hides what a role cannot use.

- Machines: managers (`MANAGERS`: superadmin, customer, admin) add and edit — a customer or admin always on its own company (no Customer field); only the superadmin deletes and sees the Customer column. Everyone else only reads the machines the server returns (customer/admin: the company's; other roles: their assigned ones).

- Branches are shared master data: everyone reads, only the superadmin adds / edits / deletes. A branch needs a customer; its City list is that customer's cities (cleared when the customer changes).

- Country, City and Branch tables show a Customer column: `useOrgUser().customerLabel(userId | customerId)`.

- Masters › Country … Supervisor: members work on their company's organization; only managers see Add / Edit / Delete (`useOrgUser().canEdit`).

- Countries and states are added customer-wise by the superadmin only (`useOrgUser().canAssign`; server `superAdminOnly`). Add Countries: a `MultiSelectPicker` of every library country not yet added. Add States: a `MultiSelectPicker` of the user's countries, then one of their states grouped by country (keys `"<userCountryId>:<name>"`, `stateForm.js`). Each pick is its own `POST /user-country` / `/user-state` row; the States table shows the country name. Customers and their users only read what is added.

## Machine catalog

- Brand → Controller → Model (`services/catalogService.js`). Account Center › Machine Catalog (Brands `pages/Brands/`, Controllers, Models; opens on Brands) is superadmin-only: `roles: SUPERADMIN_ONLY` on the pages and the tab (server: `superAdminOnly` routes). Every user reads the lists for the machine form, which filters controllers by brand and models by controller.

## Clientele and parts

- Both belong to a customer (company) and use the Machine page pattern (`pages/Clienteles/`, `pages/Parts/`). Clientele is its own Masters sidebar item (no submenu, `.ts-page-header`; ADR 0015), not an Account Center tab: everyone reads their company's, `MANAGERS` add / edit / delete; the superadmin picks the customer on the form, others always save to their own company.

- A part needs a clientele and applicable machines of its customer: both lists load after the customer is known (controlled selects) and are cleared when it changes. A clientele that parts use cannot be deleted.

- Clientele stores country and state as names (`countryName` / `stateName`, e.g. "India" / "Gujarat"); the form picks them by ISO code (state list, dial code) and converts in `clienteleForm.js`. `contactNumber` is `+<code><number>` (typed without the dial code).

## Shifts

- Masters › Shift has three screens, each a form beside its list (Edit loads a row into the form, or opens the shift modal; same access as clientele and parts, form only for `MANAGERS`): Add / Manage Shift (`pages/Shifts/`, cards), Breaks (`pages/Breaks/`) and Holiday / Week Off (`pages/Holidays/`).

- A break belongs to a customer and to at most one of its shifts (`breaks.shift_id`; `shiftId` / `shiftName` in the API, null = no shift). It is put on a shift from either side: the Shift select on Breaks, or the "Shift Break Type" rows of `ShiftFormModal` (sends `breakIds`; offers only breaks no other shift takes). Saving a shift releases the breaks left out; deleting it releases all. `shiftSchema(breaksById)` mirrors the server rules (inside the shift, no overlap).

- Times are `"HH:mm"` (TimePicker); an end not after the start runs past midnight. `utils/dateTime.js` has `minutesBetween` / `formatClock12`. Holidays have a name and dates (DatePicker); week offs a weekday (`WEEKDAYS`, 1 = Mon).

## Downtime and idle reasons

- Masters › Downtime › Downtime List / Idle List (`pages/Reasons/`, `services/downtimeReasonService.js` / `idleReasonService.js`): one `<ReasonList kind={REASON_KIND.DOWNTIME|IDLE} />` serves both (`reasonPages.js` holds each kind's wording and service calls; `key={kind}` in `PAGES`). Same access as clientele: everyone reads their company's (superadmin all + Customer column / filter), `MANAGERS` add / edit / delete in `ReasonFormModal` (superadmin picks the customer). Fields: Reason Code (optional, ≤ 10), Reason (≤ 50), Status on edit.

## Licence keys

- Account Center › Licence Key (`pages/LicenceKeys/`, `services/licenceKeyService.js`, tab and page `roles: SUPERADMIN_ONLY`, ADR 0016): the superadmin's Generate Licence Key card (`LicenceKeyGenerator`) sits above the list. Generate Key calls `POST /licence-keys/generate {count}` (keys shown, not saved); the keys are a `useFieldArray` (`keys: [{licenceKey, duration}]`) with a Subscription Duration select per key (`LICENCE_DURATIONS` in `licenceKeyForm.js`, mirrors server `dto.LicenceKeyDurations`; default Considerable Trial, "Set all" select); Save posts `{userId, licenceKeys: keys}` (all or none). Changing No. Of Key clears the generated keys. The server stores the end date (`expiresOn`, null = Life Time; `isExpired`).

- List: superadmin sees every customer's (Customer column + filter), edits customer / duration / status in `LicenceKeyFormModal` (the key never changes) and deletes; customers and admins don't see the tab (the API still lets them read their company's). Keys look like `K7M2Q-XR9TB-4HWZP-N8CDF` (server-generated, `font-monospace`; Duration / Expires On columns, Expired filter).

## Production schedule

- Production › Schedule (`pages/ProductionSchedules/`, `services/productionScheduleService.js`): list for everyone (their company's; superadmin all + Customer column), Add / Edit for `MANAGERS` (`PRODUCTION_SCHEDULE_ADD|EDIT`). Same customer pattern as parts: the superadmin picks the customer, others save to their own company; changing the customer clears the machine and every job pick, changing the machine clears the processes.

- Schedule Type: Single Day (one `startDate`; jobs use it) or Multiple Day (`startDate`–`endDate`, each job picks its `scheduleDate`). Jobs are a `useFieldArray` (`items`, `itemId` = saved id): Job ID, Supervisor / Operator (`GET /users?filterRole=supervisor|operator`), Shift, Part, Qty., Part Process (the part's processes whose `machineIds` include the machine, loaded with `getPartById`), Start / End Time (TimePicker, inside the shift). The server refuses jobs outside their shift, overlapping jobs and a machine already scheduled that day.

## Productivity and machine health (live data)

- Home (`/`, Main › Dashboard, `pages/Home/`): one request, `GET /dashboard/home` (`services/dashboardService.js`, `?date` not after today, `?userId` = customer for the superadmin, customers from `useOrgUser().users`), reloaded every `MONITOR_REFRESH_MS` while the date is today. Fleet now (active machines: online / offline / awaiting data, mode tiles in `SUMMARY_MODE_IDS` order linking to Monitoring), Performance (fleet OEE A·P·Q, Utilization = availability without schedule, parts vs plan, cycles + unfinished rate), Where the time went (`DonutChart`, mode groups + Not recorded), Parts per hour (`BarLineChart`, day before dashed), Needs attention (Downtime / Hold ≥ `ATTENTION_MINUTES`), Lowest OEE (`MachineOee`), Top alarms. The lists are short top-N tables (`SortableHead`, no paging). Settings in `homeSettings.js`.

- One page, Operations › Monitoring (`pages/Monitoring/MonitoringPage.jsx`, ADR 0019; top-level sidebar item in Operations, not under Machines, `activePaths: MONITORING_PATHS`): `/monitoring` is the machine list (`MonitoringMachines.jsx`, page header, only Productivity / Health actions via `machineMonitorPath`, reloaded every `MONITOR_REFRESH_MS`). A picked machine (`/monitoring/:machineId/productivity|health`) shows `MonitoringMachine.jsx`: page header with the machine name + a **Machine list** back-arrow button, then the Productivity / Machine Health / Tool List / Tool Life / Virtual Screen tabs (`MONITORING_MACHINE_TABS` in `constants/monitoring.js`; the tab is the route). Tool List and Tool Life (`pages/Productivity/ToolList|ToolLife.jsx`, `/monitoring/:machineId/tools|tool-life`) are placeholders (`PlannedTab`) until built; there is no Tool sidebar item. It loads the machines once (`useMachines`) and passes `machine` (+ `machines` for the OEE picker) to `Productivity` / `MachineHealth`, which are plain components (no machine select, no URL handling); an unknown id shows "Machine not found". Cards are `MonitorMachineCard`: Active strip, `MachineSilhouette` picture + "Machine # id", red dot when offline, name / model / controller, current mode (`MachineMode`: `modeId` → `MACHINE_MODE_TYPES` colour bar + label). The table is its own compact one (`MonitorMachineRow` + `monitorColumns` in `monitorTable.js`, passed to `MachineBrowser` as `tableColumns` / `renderRow`; no sideways scroll): Machine (# id · line), Customer (superadmin), Model (brand · controller underneath), Mode, OEE today (A · P · Q), Cycles today (completed / unfinished), Status, Actions. OEE / cycles come from `GET /productivity/machine-summaries` (`getMachineSummaries`, every machine the user may read, whole day, reloaded with the list; `MachineMetrics.jsx`, also on the cards). The search also matches the mode name.

- All Machines (`pages/Machines/MachineList.jsx`) is set-up only: Edit / Delete, no Productivity / Health links. Both lists share `MachineBrowser` (search, customer filter, sort, paging, table / cards; the page passes `rowActions` / `cardActions` / `cardFooter` or `renderCard`), `useMachines({ refreshMs })` and `useMachineView(storageKey)`.

- Monitoring › Productivity (`pages/Productivity/`) reads `services/productivityService.js` (server `/productivity/*`): today's summary as three cards (`SummaryCards`, each its own load, reloaded every `KPI_REFRESH_MS`): Cycles (Total / Finished / Unfinished Cycle, Average Cycle Time; finish-cycles), OEE (Availability (= utilization: run time of the day so far) / Performance / Quality / OEE; oee) and Machine Modes (time per mode summed from the day's mode timeline; only `SUMMARY_MODE_IDS`: In Production (+ Rapid Mode 12, `SUMMARY_MODE_PARTS`, like OEE run time), Hold, Loading / Unloading, Idle, Downtime, Offline; each share is of the whole period from … to of the response, so unrecorded time is not shared out), Machine Mode Timeline (`ModeTimelineCard` + `components/charts/ModeGanttChart`: range select Last 5 min … 24 h (`minutes`, window slides with the clock) or History = a whole day (`date`), zoom widens the plot with sideways scroll, Program Name / OP Mode from the response, readout of the hovered or current period; time axis on top, an all-modes row, then a row per machine_modes id (`MACHINE_MODE_TYPES` in `constants/machines.js`, colours `--ts-mode-*`); live windows reload every 30 s and the open mode grows every second on the server clock) and the OEE trend (several machines together, weighted by their time on the server, not averaged). The Finish Cycle Summary and Finished / Unfinished Cycles charts are hidden (their endpoints stay). Shift filters are the machine customer's shifts (`getShifts`); program options come from the responses. Loading uses `hooks/useLoad` (`key` string, optional `refreshMs`).

- Monitoring › Virtual Screen (`pages/Productivity/VirtualScreen.jsx` + `VirtualScreenParts.jsx`, `virtualScreenSettings.js`; ADR 0020): the old PHP speedometer screen on theme cards. One `GET /productivity/virtual-screen?machineId=` (`getVirtualScreen`) polled every `VIRTUAL_SCREEN_REFRESH_MS` (5 s); a 1 s tick moves the server clock, mode time and cycle elapsed. Alarm banner (E-stop / active alarm red), Spindle Load `Speedometer` (Machine Health `SPINDLE_LOAD` zones) + rpm + tool, override dials (0–120 %, tick at 100 %), axis load bars (axes never read left out), Batch / Cycle Progress (job = running cycle's schedule item, else the one scheduled now), Job Details, status bar (mode, op mode, clock). Never-read values show "—"; no value for 60 s = Stale chip.

- Monitoring › Machine Health: only Machine Time by Day is live (`services/machineHealthService.js`, `/machine-health/machine-time-by-day`); the sensor charts are still sample data (`healthSampleData.js`).

## 📚 Documentation Rules (MANDATORY)

Page-wise flow docs: `docs/pages/` (one file per page, index `docs/pages/README.md`). How to view the docs, Swagger UI and Postman: `docs/README.md` (keep it current when the way to open them changes). Client ADRs: `docs/adr/`. API docs live in the server (`../7th-sense-server/docs/api/openapi.yaml`, Swagger UI `/api-docs/`, Postman `../7th-sense-server/docs/postman/`).

- **Meaningful change (document it):** a new page or a change to a page's flow or actions; a new or changed endpoint or API call (route, payload, response, status, auth); business logic changes; schema / model changes; auth, permissions, middleware, guards; state management; a new library, integration or pattern.

- **Skip:** styling, copy, renames, formatting, logs, refactors that change no behaviour, small fixes that don't change the flow or API contract.

- **On a meaningful change:** update the affected page file(s) in `docs/pages/` and the index (add new pages, delete removed pages, update routes / roles). Each page follows the template: Route · Component · Auth · Guard/Layout, Purpose, Navigation; "On page load"; one section per user action with a Mermaid `sequenceDiagram` (`autonumber`; User, Page, client service, Go router, handler, service, repository, DB) and numbered steps that link the real files (`[File.jsx](../../src/...) → fn(): what it does`, server files via `../../../7th-sense-server/...`); UI states; Rules & edge cases; "API calls on this page" table linking the Swagger operation (`/api-docs/index.html#/<Tag>/<operationId>`) and `openapi.yaml` (no copied schemas); State & storage; Shared components used; Decisions. Keep each page readable in 2 minutes; describe shared logic once and link to it.

- **Needs a new or changed endpoint?** Also update the server code, its swag annotations ("Used by pages: …"), regenerate OpenAPI + Postman (`go generate ./docs/api` in the server), or list clearly what's pending.

- **ADRs** (Michael Nygard template: Title, Date, Status, Context, Decision, Alternatives considered, Consequences): add `docs/adr/NNNN-<slug>.md` + a row in `docs/adr/README.md` when a real choice was made (library, pattern, architecture). Never edit an accepted ADR's content: write a new one and mark the old one "Superseded by NNNN".

- Update docs in the SAME task, before saying it's done. Edit existing sections; don't duplicate them. Make sure every relative file link still points to a real file.

- **End-of-task line in every reply:** `Docs: pages [..] | openapi [..] | postman [..] | adr [..]` — or `Docs: none: <reason>`.