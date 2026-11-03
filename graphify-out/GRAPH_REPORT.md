# Graph Report - 7th-sense-client  (2026-11-03)

## Corpus Check
- 289 files · ~162,309 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 1714 nodes · 5748 edges · 75 communities (74 shown, 1 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 363 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `02ab27fc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- userCountryService.js
- MachineHealth.jsx
- prop-types
- AddCustomer.jsx
- Productivity.jsx
- react
- Parts & Machine Picker
- AddMachine.jsx
- AddBranch.jsx
- Project Docs & Conventions
- DateRangePicker.jsx
- BreakFormModal.jsx
- chartTheme.js
- LicenceKeyGenerator.jsx
- ESLint Dev Dependencies
- AddProductionSchedule.jsx
- react-bootstrap
- Runtime Dependencies
- ModeTimelineCard.jsx
- customerName
- adr/README.md
- UserGuide.jsx
- Add / edit customer or user
- CellList.jsx
- MainLayout
- jsconfig Aliases
- apiClient.js
- ShiftFormModal.jsx
- FieldLabel
- package.json
- Seven Logo Asset
- ProtectedRoute
- Login Logo Asset
- ModelFormModal.jsx
- Loader
- StateFormModal.jsx
- breakService.js
- ShopList.jsx
- reasonPages.js
- productivityService.js
- App shell (session, logout, theme)
- AuthProvider.jsx
- pages/README.md
- ReasonFormModal.jsx
- HolidayFormModal.jsx
- Login
- Downtime / idle reasons
- Productivity
- Customers / Users list
- Holidays / week off
- Parts
- Production schedules
- Shifts
- ControllerList.jsx
- DonutChart.jsx
- Branches
- All machines
- Supervisors
- downtimeReasonService.js
- withQuery
- Add / edit machine
- userLocationService.js
- userShopService.js
- userStateService.js
- Machine health
- Cities
- Add / edit production schedule
- vite.config.js
- 0003. Server state via service modules and useLoad, Context only for the session
- 0006. React-Bootstrap with SCSS design tokens
- 0008. Folder structure by page and by concern
- Theme showcase
- scripts
- SupervisorList.jsx
- ChartTooltip.jsx

## God Nodes (most connected - your core abstractions)
1. `react` - 120 edges
2. `prop-types` - 93 edges
3. `react-bootstrap` - 82 edges
4. `withQuery()` - 72 edges
5. `Loader()` - 71 edges
6. `useAuth()` - 71 edges
7. `useOrgUser()` - 64 edges
8. `sharedGet()` - 63 edges
9. `toast` - 50 edges
10. `ProtectedRoute()` - 44 edges

## Surprising Connections (you probably didn't know these)
- `State & storage` --references--> `useAuth()`  [INFERRED]
  docs/pages/branch-form.md → src/hooks/useAuth.js
- `State & storage` --references--> `useAuth()`  [INFERRED]
  docs/pages/breaks.md → src/hooks/useAuth.js
- `State & storage` --references--> `useAuth()`  [INFERRED]
  docs/pages/clientele-list.md → src/hooks/useAuth.js
- `State & storage` --references--> `useAuth()`  [INFERRED]
  docs/pages/customer-user-detail.md → src/hooks/useAuth.js
- `State & storage` --references--> `useAuth()`  [INFERRED]
  docs/pages/customer-user-form.md → src/hooks/useAuth.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project convention documents (CLAUDE.md, frontend skills, THEME, README)** — claude, 7th_sense_frontend_skills, theme, readme [EXTRACTED 1.00]
- **Customer-scoped master data with role-based access** — claude_masters_customer_pattern, claude_role_based_access, claude_production_schedule, claude_licence_keys, claude_shifts_breaks [INFERRED 0.85]
- **Dark/light dual theme system** — theme_design_tokens, theme_light_theme_second_build, theme_theme_switching, 7thsense_ui_review [INFERRED 0.85]

## Communities (75 total, 1 thin omitted)

### Community 0 - "userCountryService.js"
Cohesion: 0.17
Nodes (14): API calls on this page, Countries, Decisions, Delete user country, On page load, Save user country (add / edit form), Shared components used, State & storage (+6 more)

### Community 1 - "MachineHealth.jsx"
Cohesion: 0.06
Nodes (59): ChartCard(), niceTicks(), STEP_MULTIPLES, buildDay(), dayLabel, dayLoad(), dayStates(), dayWindow() (+51 more)

### Community 2 - "prop-types"
Cohesion: 0.30
Nodes (25): prop-types, recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), axisPropTypes, renderGrid(), renderLegend() (+17 more)

### Community 3 - "AddCustomer.jsx"
Cohesion: 0.06
Nodes (82): API calls on this page, Clientele, Decisions, Delete clientele, On page load, Save clientele (add / edit form), Shared components used, State & storage (+74 more)

### Community 4 - "Productivity.jsx"
Cohesion: 0.09
Nodes (41): chartMessage(), clock, clock12, clock12Seconds, CYCLE_COUNT_SERIES, dayLabel, machineLabel(), pickedMachineIds() (+33 more)

### Community 5 - "react"
Cohesion: 0.13
Nodes (34): State & storage, react, IconAction(), StatusBadge(), ACTION_ICONS, MACHINE_STATUS, OrgUserContext, useOrgUser() (+26 more)

### Community 6 - "Parts & Machine Picker"
Cohesion: 0.06
Nodes (52): Add / edit part, API calls on this page, Decisions, Save part (add / edit form), Shared components used, State & storage, UI states, Upload part drawing (+44 more)

### Community 7 - "AddMachine.jsx"
Cohesion: 0.05
Nodes (65): On page load, On page load, Save machine (add / edit form), Delete machine, On page load, API calls on this page, Decisions, Delete user line (+57 more)

### Community 8 - "AddBranch.jsx"
Cohesion: 0.07
Nodes (45): Add / edit branch, API calls on this page, Decisions, On page load, Save branch (add / edit form), Shared components used, State & storage, UI states (+37 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "DateRangePicker.jsx"
Cohesion: 0.07
Nodes (64): ChartDateFilter(), clamp(), DateCalendar(), DatePicker(), dayLabel, keyToDay(), monthGrid(), monthName (+56 more)

### Community 11 - "BreakFormModal.jsx"
Cohesion: 0.17
Nodes (19): ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, SHIFT_STATUS, SHIFT_TYPES, WEEKDAYS, breakSchema, INITIAL_VALUES, MAX_LENGTH (+11 more)

### Community 12 - "chartTheme.js"
Cohesion: 0.12
Nodes (19): AREA_OPACITY, BAND_OPACITY, BAR_GAP, GRID_PROPS, POINT_DOT, SEGMENT_GAP, SERIES_COLORS, STATUS_COLORS (+11 more)

### Community 13 - "LicenceKeyGenerator.jsx"
Cohesion: 0.06
Nodes (48): API calls on this page, Decisions, Delete licence key, Generate licence keys, Licence keys, On page load, Save licence key (add / edit form), Save licence keys (add / edit form) (+40 more)

### Community 14 - "ESLint Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 15 - "AddProductionSchedule.jsx"
Cohesion: 0.13
Nodes (28): On page load, Save production schedule (add / edit form), AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel(), EMPTY_ITEM (+20 more)

### Community 16 - "react-bootstrap"
Cohesion: 0.08
Nodes (33): react-bootstrap, react-router-dom, STORAGE_KEYS, ROUTES, INITIAL_VALUES, loginSchema, byBrandControllerName(), compareText() (+25 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+8 more)

### Community 18 - "ModeTimelineCard.jsx"
Cohesion: 0.10
Nodes (22): 0007. Recharts for charts, plain SVG for the Gantt, Alternatives considered, Consequences, Context, Decision, clockMinutes, clockWithSeconds, ModeGanttChart() (+14 more)

### Community 19 - "customerName"
Cohesion: 0.22
Nodes (16): ALL_MACHINE_ROLES, ROLE_LABELS, ROLES, TOAST_DEFAULTS, USER_STATUS, ACCOUNT_KIND, ACCOUNT_PAGES, isAccountOfKind() (+8 more)

### Community 20 - "adr/README.md"
Cohesion: 0.10
Nodes (16): 0001. Single-page app with React 19 and Vite, Alternatives considered, Consequences, Context, Decision, 0005. Forms with react-hook-form and zod, Alternatives considered, Consequences (+8 more)

### Community 21 - "UserGuide.jsx"
Cohesion: 0.13
Nodes (17): InfoTooltip(), NAV_SECTIONS, FIELD_HELP, ADD_BRANCH_STEPS, ADD_CUSTOMER_STEPS, COUNTRY_RULES, CUSTOMER_LIST_ACTIONS, FAQ (+9 more)

### Community 22 - "Add / edit customer or user"
Cohesion: 0.11
Nodes (17): Change theme, API calls on this page, Change theme, Customer / user detail, Decisions, Shared components used, State & storage, UI states (+9 more)

### Community 23 - "CellList.jsx"
Cohesion: 0.60
Nodes (4): byName(), CellList(), matchesSearch(), OrgCellList

### Community 24 - "MainLayout"
Cohesion: 0.07
Nodes (49): State & storage, bootstrap-icons, @fontsource-variable/roboto, react-dom, @/assets/scss/theme-light.scss?inline, BrandLogo(), LiveClock(), Footer() (+41 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "apiClient.js"
Cohesion: 0.23
Nodes (5): LOGO_MARKUP, env, apiClient, pendingGets, unauthorizedListeners

### Community 27 - "ShiftFormModal.jsx"
Cohesion: 0.19
Nodes (19): Save shift (add / edit form), clock(), EMPTY_BREAK_ROW, INITIAL_VALUES, MAX_BREAKS, MAX_LENGTH, offset(), shiftSchema() (+11 more)

### Community 28 - "FieldLabel"
Cohesion: 0.22
Nodes (10): react-hook-form, FieldLabel(), TimePicker(), itemMinutes(), MAX_LENGTH, MAX_QUANTITY, FIELD_HELP, optionShape (+2 more)

### Community 29 - "package.json"
Cohesion: 0.14
Nodes (15): name, private, type, version, axios, bootstrap, eslint, @eslint/js (+7 more)

### Community 30 - "Seven Logo Asset"
Cohesion: 0.67
Nodes (4): 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents)

### Community 31 - "ProtectedRoute"
Cohesion: 0.12
Nodes (15): 0002. React Router with one route table and role guards, Alternatives considered, Consequences, Context, Decision, Coming soon (unbuilt sidebar links), Decisions, On page load (+7 more)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "ModelFormModal.jsx"
Cohesion: 0.07
Nodes (39): API calls on this page, Controllers, Decisions, Delete controller, Save controller (add / edit form), Shared components used, State & storage, UI states (+31 more)

### Community 34 - "Loader"
Cohesion: 0.12
Nodes (60): ConfirmModal(), Loader(), ARIA_SORT, SortableHead(), pageItems(), TablePagination(), CUSTOMER_ROLE_ID, MANAGERS (+52 more)

### Community 35 - "StateFormModal.jsx"
Cohesion: 0.06
Nodes (73): country-region-data, zod, MultiSelectPicker(), summary(), toGroups(), customerLabel(), OrgCustomerField(), ALL_COUNTRIES (+65 more)

### Community 36 - "breakService.js"
Cohesion: 0.16
Nodes (16): API calls on this page, Breaks, Decisions, Delete break, On page load, Save break (add / edit form), Shared components used, State & storage (+8 more)

### Community 37 - "ShopList.jsx"
Cohesion: 0.60
Nodes (4): byName(), matchesSearch(), ShopList(), OrgShopList

### Community 38 - "reasonPages.js"
Cohesion: 0.35
Nodes (9): Save idle reason (add / edit form), REASON_KIND, REASON_PAGES, createIdleReason(), deleteIdleReason(), getIdleReasons(), unwrap(), unwrapList() (+1 more)

### Community 39 - "productivityService.js"
Cohesion: 0.61
Nodes (7): On page load, getCycleCounts(), getFinishCycles(), getModeTimeline(), getOee(), ids(), unwrap()

### Community 40 - "App shell (session, logout, theme)"
Cohesion: 0.12
Nodes (15): 0004. Axios client with the HttpOnly session cookie, Alternatives considered, Consequences, Context, Decision, API calls on this page, App shell (session, logout, theme), Click Log out (+7 more)

### Community 41 - "AuthProvider.jsx"
Cohesion: 0.20
Nodes (11): App(), Toaster(), ICONS, ToastItem(), AuthContext, AuthProvider(), OrgUserProvider(), AppRoutes() (+3 more)

### Community 42 - "pages/README.md"
Cohesion: 0.13
Nodes (11): About, Decisions, State & storage, UI states, Decisions, Not found / Forbidden, Decisions, Shared components used (+3 more)

### Community 43 - "ReasonFormModal.jsx"
Cohesion: 0.26
Nodes (10): @hookform/resolvers, customerName(), INITIAL_VALUES, MAX_LENGTH, REASON_STATUS, reasonSchema, toFormValues(), toReasonPayload() (+2 more)

### Community 44 - "HolidayFormModal.jsx"
Cohesion: 0.19
Nodes (16): Save holiday (add / edit form), StatusToggle(), HOLIDAY_TYPES, holidaySchema, INITIAL_VALUES, MAX_LENGTH, toFormValues(), toHolidayPayload() (+8 more)

### Community 45 - "Login"
Cohesion: 0.20
Nodes (10): API calls on this page, Decisions, Login, Shared components used, State & storage, Submit login form, UI states, getSession() (+2 more)

### Community 46 - "Downtime / idle reasons"
Cohesion: 0.18
Nodes (10): API calls on this page, Decisions, Delete downtime reason, Delete idle reason, Downtime / idle reasons, On page load, Shared components used, State & storage (+2 more)

### Community 47 - "Productivity"
Cohesion: 0.20
Nodes (9): State & storage, API calls on this page, Decisions, Live updates, Productivity, Shared components used, State & storage, UI states (+1 more)

### Community 48 - "Customers / Users list"
Cohesion: 0.20
Nodes (9): API calls on this page, Customers / Users list, Decisions, Delete user, Save user (add / edit form), Shared components used, State & storage, UI states (+1 more)

### Community 49 - "Holidays / week off"
Cohesion: 0.20
Nodes (9): API calls on this page, Decisions, Delete holiday, Holidays / week off, On page load, Shared components used, State & storage, UI states (+1 more)

### Community 50 - "Parts"
Cohesion: 0.20
Nodes (9): API calls on this page, Decisions, Delete part, On page load, Parts, Shared components used, State & storage, UI states (+1 more)

### Community 51 - "Production schedules"
Cohesion: 0.20
Nodes (9): API calls on this page, Decisions, Delete production schedule, On page load, Production schedules, Shared components used, State & storage, UI states (+1 more)

### Community 52 - "Shifts"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, Delete shift, Shared components used, Shifts, State & storage, UI states, deleteShift()

### Community 53 - "ControllerList.jsx"
Cohesion: 0.60
Nodes (5): byBrandThenName(), byName(), ControllerList(), matchesSearch(), ControllerList

### Community 54 - "DonutChart.jsx"
Cohesion: 0.28
Nodes (6): LEGEND_BOTTOM_PROPS, LEGEND_PROPS, MUTED_OPACITY, DonutCentre(), DonutChart(), RADIUS

### Community 55 - "Branches"
Cohesion: 0.25
Nodes (7): API calls on this page, Branches, Decisions, On page load, Save branch (add / edit form), Shared components used, UI states

### Community 56 - "All machines"
Cohesion: 0.25
Nodes (7): All machines, API calls on this page, Decisions, On page load, Shared components used, State & storage, UI states

### Community 57 - "Supervisors"
Cohesion: 0.25
Nodes (7): API calls on this page, Decisions, Delete user supervisor, Shared components used, State & storage, Supervisors, UI states

### Community 58 - "downtimeReasonService.js"
Cohesion: 0.52
Nodes (6): Save downtime reason (add / edit form), createDowntimeReason(), getDowntimeReasons(), unwrap(), unwrapList(), updateDowntimeReason()

### Community 59 - "withQuery"
Cohesion: 0.13
Nodes (24): API calls on this page, Cells, Decisions, Delete user cell, On page load, Save user cell (add / edit form), Shared components used, State & storage (+16 more)

### Community 60 - "Add / edit machine"
Cohesion: 0.29
Nodes (6): Add / edit machine, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 61 - "userLocationService.js"
Cohesion: 0.16
Nodes (16): API calls on this page, Decisions, Delete user location, Locations, On page load, Save user location (add / edit form), Shared components used, State & storage (+8 more)

### Community 62 - "userShopService.js"
Cohesion: 0.17
Nodes (14): API calls on this page, Decisions, Delete user shop, Save user shop (add / edit form), Shared components used, Shops, State & storage, UI states (+6 more)

### Community 63 - "userStateService.js"
Cohesion: 0.15
Nodes (15): On page load, API calls on this page, Decisions, Delete user state, On page load, Save user state (add / edit form), Shared components used, State & storage (+7 more)

### Community 64 - "Machine health"
Cohesion: 0.29
Nodes (6): API calls on this page, Decisions, Live updates, Machine health, Shared components used, UI states

### Community 65 - "Cities"
Cohesion: 0.29
Nodes (6): API calls on this page, Cities, Decisions, Shared components used, State & storage, UI states

### Community 66 - "Add / edit production schedule"
Cohesion: 0.29
Nodes (6): Add / edit production schedule, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 67 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 68 - "0003. Server state via service modules and useLoad, Context only for the session"
Cohesion: 0.33
Nodes (5): 0003. Server state via service modules and useLoad, Context only for the session, Alternatives considered, Consequences, Context, Decision

### Community 69 - "0006. React-Bootstrap with SCSS design tokens"
Cohesion: 0.33
Nodes (5): 0006. React-Bootstrap with SCSS design tokens, Alternatives considered, Consequences, Context, Decision

### Community 70 - "0008. Folder structure by page and by concern"
Cohesion: 0.33
Nodes (5): 0008. Folder structure by page and by concern, Alternatives considered, Consequences, Context, Decision

### Community 71 - "Theme showcase"
Cohesion: 0.33
Nodes (5): Decisions, Shared components used, State & storage, Theme showcase, UI states

### Community 72 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 73 - "SupervisorList.jsx"
Cohesion: 0.60
Nodes (4): byName(), matchesSearch(), SupervisorList(), OrgSupervisorList

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **10 isolated node(s):** `bootstrap`, `@types/react`, `@types/react-dom`, `eslint`, `sass` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 355 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProtectedRoute()` connect `ProtectedRoute` to `userCountryService.js`, `AddCustomer.jsx`, `Parts & Machine Picker`, `AddMachine.jsx`, `AddBranch.jsx`, `LicenceKeyGenerator.jsx`, `react-bootstrap`, `Add / edit customer or user`, `ModelFormModal.jsx`, `Loader`, `breakService.js`, `App shell (session, logout, theme)`, `AuthProvider.jsx`, `pages/README.md`, `Downtime / idle reasons`, `Productivity`, `Customers / Users list`, `Holidays / week off`, `Parts`, `Production schedules`, `Shifts`, `Branches`, `All machines`, `Supervisors`, `withQuery`, `Add / edit machine`, `userLocationService.js`, `userShopService.js`, `userStateService.js`, `Machine health`, `Cities`, `Add / edit production schedule`, `Theme showcase`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `MachineHealth.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0649692712906058 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `MachineHealth.jsx`, `prop-types`, `AddCustomer.jsx`, `Productivity.jsx`, `Parts & Machine Picker`, `AddMachine.jsx`, `AddBranch.jsx`, `DateRangePicker.jsx`, `BreakFormModal.jsx`, `chartTheme.js`, `LicenceKeyGenerator.jsx`, `AddProductionSchedule.jsx`, `react-bootstrap`, `ModeTimelineCard.jsx`, `customerName`, `UserGuide.jsx`, `CellList.jsx`, `MainLayout`, `apiClient.js`, `ShiftFormModal.jsx`, `package.json`, `ModelFormModal.jsx`, `Loader`, `StateFormModal.jsx`, `ShopList.jsx`, `AuthProvider.jsx`, `ReasonFormModal.jsx`, `HolidayFormModal.jsx`, `Productivity`, `ControllerList.jsx`, `DonutChart.jsx`, `SupervisorList.jsx`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Should `AddCustomer.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.055822466254861584 - nodes in this community are weakly interconnected._
- **Why does `useAuth()` connect `Loader` to `MachineHealth.jsx`, `AddCustomer.jsx`, `Productivity.jsx`, `react`, `Parts & Machine Picker`, `AddMachine.jsx`, `AddBranch.jsx`, `LicenceKeyGenerator.jsx`, `AddProductionSchedule.jsx`, `react-bootstrap`, `customerName`, `Add / edit customer or user`, `MainLayout`, `ProtectedRoute`, `breakService.js`, `AuthProvider.jsx`, `ReasonFormModal.jsx`, `Login`, `Downtime / idle reasons`, `Productivity`, `Holidays / week off`, `Parts`, `Production schedules`, `Shifts`, `All machines`, `Add / edit machine`, `Add / edit production schedule`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._