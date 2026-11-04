# Graph Report - 7th-sense-client  (2026-11-04)

## Corpus Check
- 317 files · ~174,546 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 1839 nodes · 6144 edges · 94 communities (93 shown, 1 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 382 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cb167482`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- MainLayout.jsx
- healthSampleData.js
- BarLineChart.jsx
- DatePicker.jsx
- Productivity.jsx
- react
- CustomerList.jsx
- AddMachine.jsx
- AddBranch.jsx
- Project Docs & Conventions
- dateTime.js
- TimePicker.jsx
- StateFormModal.jsx
- Machine models
- ESLint Dev Dependencies
- AddProductionSchedule.jsx
- AddCustomer.jsx
- Runtime Dependencies
- theme.js
- 0004. Axios client with the HttpOnly session cookie
- 0001. Single-page app with React 19 and Vite
- clienteleService.js
- customerForm.js
- Login.jsx
- SupervisorFormModal.jsx
- jsconfig Aliases
- userCountryService.js
- AddPart.jsx
- LicenceKeyGenerator.jsx
- package.json
- Seven Logo Asset
- getUsers
- Login Logo Asset
- Add / edit branch
- 0010. Organization levels on one tabbed page, a route per tab
- userLineService.js
- ModelFormModal.jsx
- 0018. Log in as customer opens the dashboard directly (no /login-as page)
- ProtectedRoute
- healthSensors.js
- validators.js
- All machines
- AuthProvider.jsx
- Cities
- BreakFormModal.jsx
- adr/README.md
- Downtime / idle reasons
- Topbar.jsx
- HealthSensorPicker.jsx
- ScheduleJobFields.jsx
- SummaryCards.jsx
- 0012. Monitoring: Productivity and Machine Health on one tabbed page
- Production schedules
- UserGuide.jsx
- Supervisors
- machines.js
- 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page
- apiClient.js
- Machine health
- App shell (session, logout, theme)
- ShiftFormModal.jsx
- Locations
- 0008. Folder structure by page and by concern
- User guide
- machineService.js
- 0006. React-Bootstrap with SCSS design tokens
- Client documentation
- withQuery
- Login
- Customers / Users list
- CountryFormModal.jsx
- useLoad
- breakService.js
- Holidays / week off
- HolidayFormModal.jsx
- 0014. Business Setup renamed Account Center; old Account Center item removed
- ControllerFormModal.jsx
- routes.js
- Branches
- 0005. Forms with react-hook-form and zod
- 0009. Page-wise flow documentation in docs/pages
- 0002. React Router with one route table and role guards
- catalogService.js
- 0014-account-center.md
- LocationFormModal.jsx
- CityFormModal.jsx
- scripts
- react-bootstrap
- 0003. Server state via service modules and useLoad, Context only for the session
- Controllers
- vite.config.js
- CellFormModal.jsx
- ShopFormModal.jsx
- 0016. Account Center is superadmin only; Users lists company members only

## God Nodes (most connected - your core abstractions)
1. `react` - 127 edges
2. `prop-types` - 102 edges
3. `react-bootstrap` - 90 edges
4. `useAuth()` - 83 edges
5. `Loader()` - 79 edges
6. `withQuery()` - 73 edges
7. `useOrgUser()` - 66 edges
8. `sharedGet()` - 64 edges
9. `toast` - 50 edges
10. `ProtectedRoute()` - 46 edges

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

## Communities (94 total, 1 thin omitted)

### Community 0 - "MainLayout.jsx"
Cohesion: 0.24
Nodes (11): Consequences, isAlsoActive(), linkClass(), navLeafShape, SidebarItem(), MONITORING_TABS, MonitoringPage(), MonitoringPage (+3 more)

### Community 1 - "healthSampleData.js"
Cohesion: 0.15
Nodes (26): buildDay(), dailyRows(), dayLabel, dayLoad(), dayStates(), dayWindow(), hourLabel, hourlyTemperatures() (+18 more)

### Community 2 - "BarLineChart.jsx"
Cohesion: 0.12
Nodes (51): recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), LEGEND_BOTTOM_PROPS, LEGEND_PROPS, axisPropTypes, renderGrid() (+43 more)

### Community 3 - "DatePicker.jsx"
Cohesion: 0.18
Nodes (16): clamp(), DateCalendar(), dayLabel, keyToDay(), monthGrid(), monthName, MONTHS, monthTitle (+8 more)

### Community 4 - "Productivity.jsx"
Cohesion: 0.09
Nodes (35): ModeTimelineCard(), readoutClock, readoutTime, chartMessage(), dayLabel, machineLabel(), pickedMachineIds(), Productivity() (+27 more)

### Community 5 - "react"
Cohesion: 0.08
Nodes (56): @hookform/resolvers, prop-types, react, IconAction(), LiveClock(), StatusBadge(), Toaster(), ICONS (+48 more)

### Community 6 - "CustomerList.jsx"
Cohesion: 0.25
Nodes (14): ROLE_LABELS, isAccountOfKind(), customerMobile(), customerName(), CustomerList(), matchesSearch(), CustomerRow(), customerOptionLabel() (+6 more)

### Community 7 - "AddMachine.jsx"
Cohesion: 0.14
Nodes (26): MACHINE_HEALTH_ALL, AddMachine(), byName(), Field(), loadBrands(), loadControllers(), loadCustomers(), loadModels() (+18 more)

### Community 8 - "AddBranch.jsx"
Cohesion: 0.15
Nodes (23): Save branch (add / edit form), BRANCH_STATUS, AddBranch(), labelClass(), branchSchema, COLOR_PICKER_FALLBACK, INITIAL_VALUES, optional() (+15 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "dateTime.js"
Cohesion: 0.15
Nodes (24): ChartDateFilter(), DatePicker(), DateRangePicker(), DEFAULT_PRESETS, earlier(), later(), normalizeRange(), RangePanel() (+16 more)

### Community 11 - "TimePicker.jsx"
Cohesion: 0.12
Nodes (25): centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel(), TimePicker(), EXCEPTIONS, FILTERS (+17 more)

### Community 12 - "StateFormModal.jsx"
Cohesion: 0.19
Nodes (16): country-region-data, ALL_COUNTRIES, byName, findLibraryCountry(), getLibraryStateNames(), fromStateKey(), INITIAL_VALUES, keepStatesOf() (+8 more)

### Community 13 - "Machine models"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete model, Machine models, Shared components used, State & storage, UI states

### Community 14 - "ESLint Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 15 - "AddProductionSchedule.jsx"
Cohesion: 0.13
Nodes (25): Save production schedule (add / edit form), StatusToggle(), AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel(), EMPTY_ITEM (+17 more)

### Community 16 - "AddCustomer.jsx"
Cohesion: 0.14
Nodes (27): ALL_MACHINE_ROLES, THEMES, USER_STATUS, ACCOUNT_KIND, ACCOUNT_PAGES, AddCustomer(), FILTER_NAMES, FILTER_OPTIONS (+19 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+8 more)

### Community 18 - "theme.js"
Cohesion: 0.17
Nodes (16): bootstrap-icons, @fontsource-variable/roboto, react-dom, @/assets/scss/theme-light.scss?inline, DEFAULT_THEME, THEME, useTheme(), applyTheme() (+8 more)

### Community 19 - "0004. Axios client with the HttpOnly session cookie"
Cohesion: 0.33
Nodes (5): 0004. Axios client with the HttpOnly session cookie, Alternatives considered, Consequences, Context, Decision

### Community 20 - "0001. Single-page app with React 19 and Vite"
Cohesion: 0.33
Nodes (5): 0001. Single-page app with React 19 and Vite, Alternatives considered, Consequences, Context, Decision

### Community 21 - "clienteleService.js"
Cohesion: 0.19
Nodes (15): API calls on this page, Clientele, Decisions, Delete clientele, On page load, Save clientele (add / edit form), Shared components used, State & storage (+7 more)

### Community 22 - "customerForm.js"
Cohesion: 0.16
Nodes (25): COUNTRIES, DEFAULT_COUNTRY, DEFAULT_TIME_ZONE, ENABLED_COUNTRIES, getCountryCode(), getCountryName(), getDialCode(), getStateCode() (+17 more)

### Community 23 - "Login.jsx"
Cohesion: 0.16
Nodes (17): BrandLogo(), BREAKPOINTS, STORAGE_KEYS, SidebarProvider(), useMediaQuery(), Login(), redirectTarget(), CENTER (+9 more)

### Community 24 - "SupervisorFormModal.jsx"
Cohesion: 0.32
Nodes (9): customerLabel(), OrgCustomerField(), INITIAL_VALUES, NAME_MAX_LENGTH, supervisorSchema, toFormValues(), toSupervisorPayload(), recordShape (+1 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "userCountryService.js"
Cohesion: 0.22
Nodes (9): API calls on this page, Countries, Decisions, Delete user country, On page load, Save user country (add / edit form), Shared components used, State & storage (+1 more)

### Community 27 - "AddPart.jsx"
Cohesion: 0.06
Nodes (58): Add / edit part, API calls on this page, Decisions, Save part (add / edit form), Shared components used, State & storage, UI states, Upload part drawing (+50 more)

### Community 28 - "LicenceKeyGenerator.jsx"
Cohesion: 0.07
Nodes (33): API calls on this page, Decisions, Delete licence key, Generate licence keys, Licence keys, On page load, Save licence key (add / edit form), Save licence keys (add / edit form) (+25 more)

### Community 29 - "package.json"
Cohesion: 0.14
Nodes (15): name, private, type, version, axios, bootstrap, eslint, @eslint/js (+7 more)

### Community 30 - "Seven Logo Asset"
Cohesion: 0.67
Nodes (4): 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents)

### Community 31 - "getUsers"
Cohesion: 0.20
Nodes (17): On page load, On page load, Save user (add / edit form), On page load, On page load, OrgUserProvider(), CustomerView(), DetailCard() (+9 more)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "Add / edit branch"
Cohesion: 0.29
Nodes (7): Add / edit branch, API calls on this page, Decisions, On page load, Shared components used, State & storage, UI states

### Community 34 - "0010. Organization levels on one tabbed page, a route per tab"
Cohesion: 0.33
Nodes (6): 0010. Organization levels on one tabbed page, a route per tab, Alternatives considered, Consequences, Context, Decision, OrganizationPage()

### Community 35 - "userLineService.js"
Cohesion: 0.11
Nodes (22): API calls on this page, Cells, Decisions, Delete user cell, On page load, Shared components used, State & storage, UI states (+14 more)

### Community 36 - "ModelFormModal.jsx"
Cohesion: 0.24
Nodes (13): Save model (add / edit form), ControllerOptions(), groupByBrand(), INITIAL_VALUES, modelSchema, NAME_MAX_LENGTH, toFormValues(), toModelPayload() (+5 more)

### Community 37 - "0018. Log in as customer opens the dashboard directly (no /login-as page)"
Cohesion: 0.33
Nodes (4): 0018. Log in as customer opens the dashboard directly (no /login-as page), Alternatives considered, Consequences, Context

### Community 38 - "ProtectedRoute"
Cohesion: 0.06
Nodes (42): Decision, About, Decisions, State & storage, UI states, Coming soon (unbuilt sidebar links), Decisions, On page load (+34 more)

### Community 39 - "healthSensors.js"
Cohesion: 0.09
Nodes (34): ChartCard(), niceTicks(), STEP_MULTIPLES, MACHINE_MODES, pointsInRange(), clock, clockSeconds, dayClock (+26 more)

### Community 40 - "validators.js"
Cohesion: 0.53
Nodes (5): isBlank(), matches(), minLength(), PASSWORD_MIN_LENGTH, required()

### Community 41 - "All machines"
Cohesion: 0.22
Nodes (9): All machines, API calls on this page, Decisions, Delete machine, Edit machine, On page load, Shared components used, State & storage (+1 more)

### Community 42 - "AuthProvider.jsx"
Cohesion: 0.15
Nodes (14): API calls on this page, App shell (session, logout, theme), Click Log out, Decisions, On page load, Shared components used, State & storage, UI states (+6 more)

### Community 43 - "Cities"
Cohesion: 0.19
Nodes (14): API calls on this page, Cities, Decisions, Delete user city, On page load, Save user city (add / edit form), Shared components used, State & storage (+6 more)

### Community 44 - "BreakFormModal.jsx"
Cohesion: 0.24
Nodes (13): Save break (add / edit form), BREAK_NAME_SUGGESTIONS, breakSchema, INITIAL_VALUES, MAX_LENGTH, toBreakPayload(), toFormValues(), BreakFormModal() (+5 more)

### Community 46 - "Downtime / idle reasons"
Cohesion: 0.10
Nodes (33): API calls on this page, Decisions, Delete downtime reason, Delete idle reason, Downtime / idle reasons, On page load, Save downtime reason (add / edit form), Save idle reason (add / edit form) (+25 more)

### Community 47 - "Topbar.jsx"
Cohesion: 0.30
Nodes (9): Footer(), AppShell(), Sidebar(), displayName(), Topbar(), LANGUAGES, SidebarContext, useSidebar() (+1 more)

### Community 48 - "HealthSensorPicker.jsx"
Cohesion: 0.50
Nodes (4): MACHINE_HEALTH_SENSORS, ALL_IDS, HealthSensorPicker(), summary()

### Community 49 - "ScheduleJobFields.jsx"
Cohesion: 0.20
Nodes (16): SHIFT_TYPES, itemMinutes(), MAX_LENGTH, MAX_QUANTITY, FIELD_HELP, optionShape, ScheduleJobFields(), Clock() (+8 more)

### Community 51 - "SummaryCards.jsx"
Cohesion: 0.17
Nodes (16): DEFAULT_MODE_RANGE, DEFAULT_SCHEDULE_MODE, formatCount(), formatCycle(), KPI_REFRESH_MS, MODE_RANGES, percent(), SUMMARY_MODE_IDS (+8 more)

### Community 52 - "0012. Monitoring: Productivity and Machine Health on one tabbed page"
Cohesion: 0.50
Nodes (4): 0012. Monitoring: Productivity and Machine Health on one tabbed page, Alternatives considered, Context, Decision

### Community 55 - "Production schedules"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete production schedule, On page load, Production schedules, Shared components used, State & storage, UI states

### Community 56 - "UserGuide.jsx"
Cohesion: 0.18
Nodes (18): navLinks(), NUMBERED_STEPS, OpenLink(), SectionCard(), SECTIONS, SetupStep(), textOf(), UserGuide() (+10 more)

### Community 57 - "Supervisors"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete user supervisor, On page load, Shared components used, State & storage, Supervisors, UI states

### Community 59 - "machines.js"
Cohesion: 0.07
Nodes (38): 0007. Recharts for charts, plain SVG for the Gantt, Alternatives considered, Consequences, Context, Decision, 0013. Monitoring starts with a machine list; All Machines is set-up only, Alternatives considered, Consequences (+30 more)

### Community 60 - "0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page"
Cohesion: 0.40
Nodes (5): 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page, Alternatives considered, Consequences, Context, Decision

### Community 61 - "apiClient.js"
Cohesion: 0.14
Nodes (14): API calls on this page, Decisions, Delete user state, Save user state (add / edit form), Shared components used, State & storage, States, UI states (+6 more)

### Community 62 - "Machine health"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Live updates, Machine health, Shared components used, State & storage, UI states

### Community 63 - "App shell (session, logout, theme)"
Cohesion: 0.12
Nodes (17): Change theme, API calls on this page, Change theme, Customer / user detail, Decisions, Shared components used, State & storage, UI states (+9 more)

### Community 64 - "ShiftFormModal.jsx"
Cohesion: 0.19
Nodes (19): Save shift (add / edit form), clock(), EMPTY_BREAK_ROW, INITIAL_VALUES, MAX_BREAKS, MAX_LENGTH, offset(), shiftSchema() (+11 more)

### Community 65 - "Locations"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete user location, Locations, On page load, Shared components used, State & storage, UI states

### Community 66 - "0008. Folder structure by page and by concern"
Cohesion: 0.33
Nodes (5): 0008. Folder structure by page and by concern, Alternatives considered, Consequences, Context, Decision

### Community 67 - "User guide"
Cohesion: 0.25
Nodes (8): Decisions, On page load, Rules & edge cases, Sections, Shared components used, State & storage, UI states, User guide

### Community 68 - "machineService.js"
Cohesion: 0.22
Nodes (12): Add / edit machine, API calls on this page, Decisions, Save machine (add / edit form), Shared components used, State & storage, UI states, createMachine() (+4 more)

### Community 69 - "0006. React-Bootstrap with SCSS design tokens"
Cohesion: 0.33
Nodes (5): 0006. React-Bootstrap with SCSS design tokens, Alternatives considered, Consequences, Context, Decision

### Community 71 - "Client documentation"
Cohesion: 0.40
Nodes (4): Client documentation, How to use Postman, How to view the API docs in Chrome (Swagger UI), How to view the page flow docs

### Community 72 - "withQuery"
Cohesion: 0.23
Nodes (19): Decision, On page load, Save user supervisor (add / edit form), sharedGet(), withQuery(), getMachineTimeByDay(), unwrap(), getCycleCounts() (+11 more)

### Community 74 - "Login"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Login, Shared components used, State & storage, Submit login form, UI states

### Community 75 - "Customers / Users list"
Cohesion: 0.11
Nodes (18): 0017. Log in as customer in a new tab, on the tab's own API path, Alternatives considered, Consequences, Context, Decision, Decision, API calls on this page, Customers / Users list (+10 more)

### Community 76 - "CountryFormModal.jsx"
Cohesion: 0.23
Nodes (12): MultiSelectPicker(), summary(), toGroups(), countrySchema, INITIAL_VALUES, toCountryPayloads(), CountryFormModal(), NOUN (+4 more)

### Community 77 - "useLoad"
Cohesion: 0.27
Nodes (10): API calls on this page, Change the Machine Modes period, Decisions, Live updates, On page load, Productivity, Shared components used, State & storage (+2 more)

### Community 78 - "breakService.js"
Cohesion: 0.12
Nodes (17): API calls on this page, Breaks, Decisions, Delete break, On page load, Shared components used, State & storage, UI states (+9 more)

### Community 79 - "Holidays / week off"
Cohesion: 0.19
Nodes (14): API calls on this page, Decisions, Delete holiday, Holidays / week off, On page load, Save holiday (add / edit form), Shared components used, State & storage (+6 more)

### Community 80 - "HolidayFormModal.jsx"
Cohesion: 0.24
Nodes (12): ALL_WEEKDAYS, HOLIDAY_TYPES, SHIFT_STATUS, WEEKDAYS, holidaySchema, INITIAL_VALUES, MAX_LENGTH, toFormValues() (+4 more)

### Community 81 - "0014. Business Setup renamed Account Center; old Account Center item removed"
Cohesion: 0.40
Nodes (5): 0014. Business Setup renamed Account Center; old Account Center item removed, Alternatives considered, Consequences, Context, Decision

### Community 82 - "ControllerFormModal.jsx"
Cohesion: 0.29
Nodes (10): Save controller (add / edit form), controllerSchema, INITIAL_VALUES, MAX_LENGTH, toControllerPayload(), toFormValues(), ControllerFormModal(), FIELD_HELP (+2 more)

### Community 87 - "routes.js"
Cohesion: 0.17
Nodes (10): ADR-0018, LOGO_MARKUP, env, ACCOUNT_CENTER_PATHS, ACCOUNT_CENTER_TABS, MONITOR_REFRESH_MS, MONITORING_PATHS, ORGANIZATION_PATHS (+2 more)

### Community 88 - "Branches"
Cohesion: 0.22
Nodes (9): API calls on this page, Branches, Decisions, Delete branch, On page load, Save branch (add / edit form), Shared components used, State & storage (+1 more)

### Community 89 - "0005. Forms with react-hook-form and zod"
Cohesion: 0.33
Nodes (5): 0005. Forms with react-hook-form and zod, Alternatives considered, Consequences, Context, Decision

### Community 91 - "0009. Page-wise flow documentation in docs/pages"
Cohesion: 0.33
Nodes (5): 0009. Page-wise flow documentation in docs/pages, Alternatives considered, Consequences, Context, Decision

### Community 92 - "0002. React Router with one route table and role guards"
Cohesion: 0.40
Nodes (4): 0002. React Router with one route table and role guards, Alternatives considered, Consequences, Context

### Community 93 - "catalogService.js"
Cohesion: 0.27
Nodes (12): On page load, On page load, On page load, byBrandControllerName(), compareText(), matchesSearch(), ModelList(), deleteModel() (+4 more)

### Community 94 - "0014-account-center.md"
Cohesion: 0.27
Nodes (4): 0015. Clientele is a Masters page, not an Account Center tab, Alternatives considered, Consequences, Context

### Community 97 - "LocationFormModal.jsx"
Cohesion: 0.28
Nodes (12): Save user location (add / edit form), INITIAL_VALUES, locationSchema, NAME_MAX_LENGTH, toFormValues(), toLocationPayload(), LocationFormModal(), recordShape (+4 more)

### Community 98 - "CityFormModal.jsx"
Cohesion: 0.20
Nodes (18): zod, citySchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCityPayload(), toFormValues(), CityFormModal(), recordShape (+10 more)

### Community 99 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 100 - "react-bootstrap"
Cohesion: 0.05
Nodes (142): Decision, On page load, On page load, react-bootstrap, react-router-dom, ConfirmModal(), Loader(), ARIA_SORT (+134 more)

### Community 101 - "0003. Server state via service modules and useLoad, Context only for the session"
Cohesion: 0.40
Nodes (4): 0003. Server state via service modules and useLoad, Context only for the session, Alternatives considered, Consequences, Context

### Community 102 - "Controllers"
Cohesion: 0.29
Nodes (7): API calls on this page, Controllers, Decisions, Delete controller, Shared components used, State & storage, UI states

### Community 108 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 113 - "CellFormModal.jsx"
Cohesion: 0.28
Nodes (12): Save user cell (add / edit form), cellSchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCellPayload(), toFormValues(), CellFormModal(), recordShape (+4 more)

### Community 115 - "ShopFormModal.jsx"
Cohesion: 0.28
Nodes (12): Save user shop (add / edit form), INITIAL_VALUES, NAME_MAX_LENGTH, shopSchema, toFormValues(), toShopPayload(), recordShape, ShopFormModal() (+4 more)

### Community 116 - "0016. Account Center is superadmin only; Users lists company members only"
Cohesion: 0.40
Nodes (5): 0016. Account Center is superadmin only; Users lists company members only, Alternatives considered, Consequences, Context, Decision

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **11 isolated node(s):** `bootstrap`, `@types/react`, `@types/react-dom`, `eslint`, `sass` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 383 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProtectedRoute()` connect `ProtectedRoute` to `Machine models`, `clienteleService.js`, `userCountryService.js`, `AddPart.jsx`, `LicenceKeyGenerator.jsx`, `Add / edit branch`, `userLineService.js`, `All machines`, `AuthProvider.jsx`, `Cities`, `Downtime / idle reasons`, `Production schedules`, `Supervisors`, `machines.js`, `apiClient.js`, `Machine health`, `App shell (session, logout, theme)`, `Locations`, `User guide`, `machineService.js`, `Customers / Users list`, `useLoad`, `breakService.js`, `Holidays / week off`, `routes.js`, `Branches`, `react-bootstrap`, `Controllers`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `useAuth()` (e.g. with `State & storage` and `State & storage`) actually correct?**
  _`useAuth()` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `BarLineChart.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11586538461538462 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `MainLayout.jsx`, `BarLineChart.jsx`, `DatePicker.jsx`, `Productivity.jsx`, `CustomerList.jsx`, `AddMachine.jsx`, `AddBranch.jsx`, `dateTime.js`, `TimePicker.jsx`, `StateFormModal.jsx`, `AddProductionSchedule.jsx`, `AddCustomer.jsx`, `theme.js`, `customerForm.js`, `Login.jsx`, `SupervisorFormModal.jsx`, `AddPart.jsx`, `package.json`, `getUsers`, `ModelFormModal.jsx`, `ProtectedRoute`, `healthSensors.js`, `AuthProvider.jsx`, `BreakFormModal.jsx`, `Downtime / idle reasons`, `Topbar.jsx`, `ScheduleJobFields.jsx`, `SummaryCards.jsx`, `UserGuide.jsx`, `machines.js`, `apiClient.js`, `ShiftFormModal.jsx`, `CountryFormModal.jsx`, `HolidayFormModal.jsx`, `ControllerFormModal.jsx`, `LocationFormModal.jsx`, `CityFormModal.jsx`, `react-bootstrap`, `CellFormModal.jsx`, `ShopFormModal.jsx`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Should `Productivity.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09446693657219973 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._