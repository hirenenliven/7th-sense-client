# Graph Report - 7th-sense-client  (2026-11-03)

## Corpus Check
- 290 files · ~162,715 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 1719 nodes · 5748 edges · 97 communities (95 shown, 2 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 363 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `860acb45`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- userCountryService.js
- MachineHealth.jsx
- prop-types
- sharedGet
- Productivity.jsx
- react
- ProcessFields.jsx
- AddMachine.jsx
- AddBranch.jsx
- Project Docs & Conventions
- DateRangePicker.jsx
- BreakFormModal.jsx
- Speedometer.jsx
- LicenceKeyGenerator.jsx
- ESLint Dev Dependencies
- AddProductionSchedule.jsx
- ModelList
- Runtime Dependencies
- ModeTimelineCard.jsx
- AddCustomer.jsx
- 0001. Single-page app with React 19 and Vite
- UserGuide.jsx
- Add / edit customer or user
- clienteleForm.js
- MainLayout
- jsconfig Aliases
- apiClient.js
- ShiftFormModal.jsx
- FieldLabel
- package.json
- Seven Logo Asset
- ProtectedRoute
- Login Logo Asset
- ControllerFormModal.jsx
- react-bootstrap
- StateFormModal.jsx
- breakService.js
- healthSampleData.js
- reasonPages.js
- productivityService.js
- App shell (session, logout, theme)
- AuthProvider.jsx
- adr/README.md
- ReasonFormModal.jsx
- HolidayFormModal.jsx
- Login
- Downtime / idle reasons
- Productivity
- dateTime.js
- Holidays / week off
- Parts
- Production schedules
- Shifts
- ClienteleFormModal.jsx
- chartLegend.jsx
- Branches
- All machines
- Supervisors
- userLineService.js
- Cells
- SupervisorFormModal.jsx
- LocationFormModal.jsx
- Shops
- userStateService.js
- Machine health
- userCityService.js
- DatePicker.jsx
- vite.config.js
- useOrgUser
- 0006. React-Bootstrap with SCSS design tokens
- AddMachine
- CellFormModal.jsx
- scripts
- ShopFormModal.jsx
- ChartTooltip.jsx
- AddPart.jsx
- CountryFormModal.jsx
- ModelFormModal.jsx
- partForm.js
- Productivity
- Sidebar.jsx
- Machine models
- Add / edit part
- LineFormModal.jsx
- Add / edit branch
- Clientele
- Controllers
- withQuery
- ThemeShowcase.jsx
- 0005. Forms with react-hook-form and zod
- 0007. Recharts for charts, plain SVG for the Gantt
- 0009. Page-wise flow documentation in docs/pages
- customerName
- validators.js
- shifts.js
- PickerField.jsx
- userCountryService.js

## God Nodes (most connected - your core abstractions)
1. `react` - 120 edges
2. `prop-types` - 93 edges
3. `react-bootstrap` - 82 edges
4. `withQuery()` - 72 edges
5. `Loader()` - 70 edges
6. `useAuth()` - 70 edges
7. `useOrgUser()` - 64 edges
8. `sharedGet()` - 63 edges
9. `toast` - 50 edges
10. `ProtectedRoute()` - 44 edges

## Surprising Connections (you probably didn't know these)
- `Decision` --references--> `ModeGanttChart()`  [INFERRED]
  docs/adr/0007-recharts-for-charts.md → src/components/charts/ModeGanttChart.jsx
- `On page load` --references--> `getCurrentUser()`  [INFERRED]
  docs/pages/app-shell.md → src/services/customerService.js
- `State & storage` --references--> `useAuth()`  [INFERRED]
  docs/pages/branch-form.md → src/hooks/useAuth.js
- `On page load` --references--> `getBranches()`  [INFERRED]
  docs/pages/branch-list.md → src/services/branchService.js
- `Save branch (add / edit form)` --references--> `updateBranch()`  [INFERRED]
  docs/pages/branch-list.md → src/services/branchService.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project convention documents (CLAUDE.md, frontend skills, THEME, README)** — claude, 7th_sense_frontend_skills, theme, readme [EXTRACTED 1.00]
- **Customer-scoped master data with role-based access** — claude_masters_customer_pattern, claude_role_based_access, claude_production_schedule, claude_licence_keys, claude_shifts_breaks [INFERRED 0.85]
- **Dark/light dual theme system** — theme_design_tokens, theme_light_theme_second_build, theme_theme_switching, 7thsense_ui_review [INFERRED 0.85]

## Communities (97 total, 2 thin omitted)

### Community 0 - "userCountryService.js"
Cohesion: 0.20
Nodes (9): API calls on this page, Countries, Decisions, Delete user country, On page load, Save user country (add / edit form), Shared components used, State & storage (+1 more)

### Community 1 - "MachineHealth.jsx"
Cohesion: 0.08
Nodes (39): ChartCard(), niceTicks(), STEP_MULTIPLES, pointsInRange(), clock, clockSeconds, dayClock, DEFAULT_RANGE (+31 more)

### Community 2 - "prop-types"
Cohesion: 0.19
Nodes (38): recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), axisPropTypes, renderGrid(), renderLegend(), renderTooltip() (+30 more)

### Community 3 - "sharedGet"
Cohesion: 0.18
Nodes (23): On page load, On page load, Save user (add / edit form), On page load, On page load, On page load, On page load, AddCustomer() (+15 more)

### Community 4 - "Productivity.jsx"
Cohesion: 0.11
Nodes (27): clock, clock12, clock12Seconds, CYCLE_COUNT_SERIES, dayLabel, ALL_PROGRAMS, counts, CYCLE_COUNTS (+19 more)

### Community 5 - "react"
Cohesion: 0.11
Nodes (43): prop-types, react, IconAction(), LiveClock(), StatusBadge(), CLOCK_TICK_MS, ACTION_ICONS, MACHINE_STATUS (+35 more)

### Community 6 - "ProcessFields.jsx"
Cohesion: 0.18
Nodes (13): checkDrawing, DrawingUpload(), MachinePicker(), summary(), DRAWING_RULES, EMPTY_SUB_PROGRAM, MAX_LENGTH, MAX_SUB_PROGRAMS (+5 more)

### Community 7 - "AddMachine.jsx"
Cohesion: 0.11
Nodes (27): CONTROLLER_VERSION_TYPES, MACHINE_ACCURACIES, MACHINE_HEALTH_ALL, MACHINE_HEALTH_SENSORS, MACHINE_MODES, MACHINE_SYSTEM_TYPES, SECURITY_MODES, loadCustomers() (+19 more)

### Community 8 - "AddBranch.jsx"
Cohesion: 0.17
Nodes (20): Save branch (add / edit form), AddBranch(), labelClass(), branchSchema, COLOR_PICKER_FALLBACK, INITIAL_VALUES, optional(), REQUIRED_FIELDS (+12 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "DateRangePicker.jsx"
Cohesion: 0.17
Nodes (24): ChartDateFilter(), DatePicker(), DateRangePicker(), DEFAULT_PRESETS, earlier(), later(), normalizeRange(), RangePanel() (+16 more)

### Community 11 - "BreakFormModal.jsx"
Cohesion: 0.24
Nodes (13): Save break (add / edit form), SHIFT_STATUS, breakSchema, INITIAL_VALUES, MAX_LENGTH, toBreakPayload(), toFormValues(), BreakFormModal() (+5 more)

### Community 12 - "Speedometer.jsx"
Cohesion: 0.24
Nodes (9): STATUS_COLORS, TRACK_COLOR, clamp(), Needle(), PIE_PROPS, polar(), Speedometer(), TRACK_RADIUS (+1 more)

### Community 13 - "LicenceKeyGenerator.jsx"
Cohesion: 0.06
Nodes (46): API calls on this page, Decisions, Delete licence key, Generate licence keys, Licence keys, On page load, Save licence key (add / edit form), Save licence keys (add / edit form) (+38 more)

### Community 14 - "ESLint Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 15 - "AddProductionSchedule.jsx"
Cohesion: 0.14
Nodes (24): Save production schedule (add / edit form), AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel(), EMPTY_ITEM, idText() (+16 more)

### Community 16 - "ModelList"
Cohesion: 0.27
Nodes (11): On page load, On page load, On page load, byBrandControllerName(), compareText(), matchesSearch(), ModelList(), getBrands() (+3 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+8 more)

### Community 18 - "ModeTimelineCard.jsx"
Cohesion: 0.14
Nodes (17): clockMinutes, clockWithSeconds, ModeGanttChart(), TICK_STEPS, ticksFor(), MACHINE_MODE_TYPES, modeTypeOf(), UNKNOWN_MODE_COLOR (+9 more)

### Community 19 - "AddCustomer.jsx"
Cohesion: 0.13
Nodes (26): ALL_MACHINE_ROLES, DEFAULT_THEME, ROLE_LABELS, THEMES, ACCOUNT_KIND, FILTER_NAMES, FILTER_OPTIONS, getCustomerSchema() (+18 more)

### Community 20 - "0001. Single-page app with React 19 and Vite"
Cohesion: 0.33
Nodes (5): 0001. Single-page app with React 19 and Vite, Alternatives considered, Consequences, Context, Decision

### Community 21 - "UserGuide.jsx"
Cohesion: 0.13
Nodes (17): NAV_SECTIONS, FIELD_HELP, ADD_BRANCH_STEPS, ADD_CUSTOMER_STEPS, COUNTRY_RULES, CUSTOMER_LIST_ACTIONS, FAQ, MODULE_PURPOSE (+9 more)

### Community 22 - "Add / edit customer or user"
Cohesion: 0.10
Nodes (19): Change theme, Change theme, Add / edit customer or user, API calls on this page, Change theme, Decisions, Shared components used, State & storage (+11 more)

### Community 23 - "clienteleForm.js"
Cohesion: 0.16
Nodes (22): COUNTRIES, DEFAULT_COUNTRY, DEFAULT_TIME_ZONE, ENABLED_COUNTRIES, getCountryCode(), getCountryName(), getDialCode(), getStateCode() (+14 more)

### Community 24 - "MainLayout"
Cohesion: 0.10
Nodes (34): @/assets/scss/theme-light.scss?inline, BrandLogo(), LOGO_MARKUP, Footer(), AppShell(), displayName(), Topbar(), env (+26 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "apiClient.js"
Cohesion: 0.20
Nodes (10): Submit login form, apiClient, pendingGets, unauthorizedListeners, getSession(), login(), unwrap(), createUserState() (+2 more)

### Community 27 - "ShiftFormModal.jsx"
Cohesion: 0.19
Nodes (19): Save shift (add / edit form), clock(), EMPTY_BREAK_ROW, INITIAL_VALUES, MAX_BREAKS, MAX_LENGTH, offset(), shiftSchema() (+11 more)

### Community 28 - "FieldLabel"
Cohesion: 0.27
Nodes (8): itemMinutes(), MAX_LENGTH, MAX_QUANTITY, FIELD_HELP, optionShape, ScheduleJobFields(), clockToMinutes(), formatHoursMinutes()

### Community 29 - "package.json"
Cohesion: 0.12
Nodes (18): name, private, type, version, axios, bootstrap, bootstrap-icons, eslint (+10 more)

### Community 30 - "Seven Logo Asset"
Cohesion: 0.67
Nodes (4): 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents)

### Community 31 - "ProtectedRoute"
Cohesion: 0.10
Nodes (23): 0002. React Router with one route table and role guards, Alternatives considered, Consequences, Context, Decision, On page load, API calls on this page, Decisions (+15 more)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "ControllerFormModal.jsx"
Cohesion: 0.23
Nodes (14): Save controller (add / edit form), Save model (add / edit form), controllerSchema, INITIAL_VALUES, MAX_LENGTH, toControllerPayload(), toFormValues(), ControllerFormModal() (+6 more)

### Community 34 - "react-bootstrap"
Cohesion: 0.05
Nodes (141): On page load, On page load, react-bootstrap, react-router-dom, ConfirmModal(), Loader(), ARIA_SORT, SortableHead() (+133 more)

### Community 35 - "StateFormModal.jsx"
Cohesion: 0.16
Nodes (18): country-region-data, @hookform/resolvers, react-hook-form, ALL_COUNTRIES, byName, findLibraryCountry(), getLibraryStateNames(), fromStateKey() (+10 more)

### Community 36 - "breakService.js"
Cohesion: 0.18
Nodes (11): API calls on this page, Breaks, Decisions, Delete break, On page load, Shared components used, State & storage, UI states (+3 more)

### Community 37 - "healthSampleData.js"
Cohesion: 0.17
Nodes (21): buildDay(), dailyRows(), dayLabel, dayLoad(), dayStates(), dayWindow(), hourLabel, hourlyTemperatures() (+13 more)

### Community 38 - "reasonPages.js"
Cohesion: 0.35
Nodes (9): Save idle reason (add / edit form), REASON_KIND, REASON_PAGES, createIdleReason(), deleteIdleReason(), getIdleReasons(), unwrap(), unwrapList() (+1 more)

### Community 39 - "productivityService.js"
Cohesion: 0.61
Nodes (7): On page load, getCycleCounts(), getFinishCycles(), getModeTimeline(), getOee(), ids(), unwrap()

### Community 40 - "App shell (session, logout, theme)"
Cohesion: 0.25
Nodes (7): API calls on this page, App shell (session, logout, theme), Decisions, On page load, Shared components used, State & storage, UI states

### Community 41 - "AuthProvider.jsx"
Cohesion: 0.10
Nodes (22): 0003. Server state via service modules and useLoad, Context only for the session, Alternatives considered, Consequences, Context, Decision, 0004. Axios client with the HttpOnly session cookie, Alternatives considered, Consequences (+14 more)

### Community 42 - "adr/README.md"
Cohesion: 0.04
Nodes (46): Architecture Decision Records, About, Decisions, State & storage, UI states, Coming soon (unbuilt sidebar links), Decisions, API calls on this page (+38 more)

### Community 43 - "ReasonFormModal.jsx"
Cohesion: 0.26
Nodes (10): FieldLabel(), InfoTooltip(), INITIAL_VALUES, MAX_LENGTH, REASON_STATUS, reasonSchema, toFormValues(), toReasonPayload() (+2 more)

### Community 44 - "HolidayFormModal.jsx"
Cohesion: 0.21
Nodes (15): Save holiday (add / edit form), HOLIDAY_TYPES, holidaySchema, INITIAL_VALUES, MAX_LENGTH, toFormValues(), toHolidayPayload(), HolidayFormModal() (+7 more)

### Community 45 - "Login"
Cohesion: 0.29
Nodes (6): API calls on this page, Decisions, Login, Shared components used, State & storage, UI states

### Community 46 - "Downtime / idle reasons"
Cohesion: 0.16
Nodes (16): API calls on this page, Decisions, Delete downtime reason, Delete idle reason, Downtime / idle reasons, On page load, Save downtime reason (add / edit form), Shared components used (+8 more)

### Community 47 - "Productivity"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, Live updates, Productivity, Shared components used, State & storage, UI states, useLoad()

### Community 48 - "dateTime.js"
Cohesion: 0.19
Nodes (18): centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel(), TimePicker(), DATE_RANGE_SEPARATOR, DURATION_PATTERN (+10 more)

### Community 49 - "Holidays / week off"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, Delete holiday, Holidays / week off, On page load, Shared components used, State & storage, UI states

### Community 50 - "Parts"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, Delete part, On page load, Parts, Shared components used, State & storage, UI states

### Community 51 - "Production schedules"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, Delete production schedule, On page load, Production schedules, Shared components used, State & storage, UI states

### Community 52 - "Shifts"
Cohesion: 0.25
Nodes (7): API calls on this page, Decisions, Delete shift, Shared components used, Shifts, State & storage, UI states

### Community 53 - "ClienteleFormModal.jsx"
Cohesion: 0.25
Nodes (13): On page load, Save clientele (add / edit form), StatusToggle(), getStates(), clienteleSchema, ClienteleFormModal(), FIELD_HELP, createClientele() (+5 more)

### Community 55 - "Branches"
Cohesion: 0.12
Nodes (14): 0008. Folder structure by page and by concern, Alternatives considered, Consequences, Context, Decision, API calls on this page, Branches, Decisions (+6 more)

### Community 56 - "All machines"
Cohesion: 0.22
Nodes (8): All machines, API calls on this page, Decisions, Delete machine, On page load, Shared components used, State & storage, UI states

### Community 57 - "Supervisors"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, Delete user supervisor, On page load, Shared components used, State & storage, Supervisors, UI states

### Community 58 - "userLineService.js"
Cohesion: 0.17
Nodes (14): API calls on this page, Decisions, Delete user line, Lines, On page load, Save user line (add / edit form), Shared components used, State & storage (+6 more)

### Community 59 - "Cells"
Cohesion: 0.22
Nodes (8): API calls on this page, Cells, Decisions, Delete user cell, On page load, Shared components used, State & storage, UI states

### Community 60 - "SupervisorFormModal.jsx"
Cohesion: 0.23
Nodes (12): zod, INITIAL_VALUES, loginSchema, INITIAL_VALUES, NAME_MAX_LENGTH, supervisorSchema, toFormValues(), toSupervisorPayload() (+4 more)

### Community 61 - "LocationFormModal.jsx"
Cohesion: 0.28
Nodes (12): Save user location (add / edit form), INITIAL_VALUES, locationSchema, NAME_MAX_LENGTH, toFormValues(), toLocationPayload(), LocationFormModal(), recordShape (+4 more)

### Community 62 - "Shops"
Cohesion: 0.25
Nodes (7): API calls on this page, Decisions, Delete user shop, Shared components used, Shops, State & storage, UI states

### Community 63 - "userStateService.js"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, Delete user state, Save user state (add / edit form), Shared components used, State & storage, States, UI states

### Community 64 - "Machine health"
Cohesion: 0.25
Nodes (7): API calls on this page, Decisions, Live updates, Machine health, Shared components used, State & storage, UI states

### Community 65 - "userCityService.js"
Cohesion: 0.17
Nodes (15): API calls on this page, Cities, Decisions, Delete user city, On page load, Save user city (add / edit form), Shared components used, State & storage (+7 more)

### Community 66 - "DatePicker.jsx"
Cohesion: 0.20
Nodes (15): clamp(), DateCalendar(), dayLabel, keyToDay(), monthGrid(), monthName, MONTHS, monthTitle (+7 more)

### Community 67 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 68 - "useOrgUser"
Cohesion: 0.26
Nodes (11): customerLabel(), OrgCustomerField(), OrgUserContext, useOrgUser(), citySchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCityPayload() (+3 more)

### Community 69 - "0006. React-Bootstrap with SCSS design tokens"
Cohesion: 0.33
Nodes (5): 0006. React-Bootstrap with SCSS design tokens, Alternatives considered, Consequences, Context, Decision

### Community 70 - "AddMachine"
Cohesion: 0.23
Nodes (14): Save machine (add / edit form), AddMachine(), byName(), Field(), loadBrands(), loadControllers(), loadModels(), placeholder() (+6 more)

### Community 71 - "CellFormModal.jsx"
Cohesion: 0.28
Nodes (12): Save user cell (add / edit form), cellSchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCellPayload(), toFormValues(), CellFormModal(), recordShape (+4 more)

### Community 72 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 73 - "ShopFormModal.jsx"
Cohesion: 0.28
Nodes (12): Save user shop (add / edit form), INITIAL_VALUES, NAME_MAX_LENGTH, shopSchema, toFormValues(), toShopPayload(), recordShape, ShopFormModal() (+4 more)

### Community 75 - "AddPart.jsx"
Cohesion: 0.32
Nodes (13): Save part (add / edit form), AddPart(), byName(), partSeconds(), toFormValues(), toPartPayload(), createPart(), getPartById() (+5 more)

### Community 76 - "CountryFormModal.jsx"
Cohesion: 0.28
Nodes (10): MultiSelectPicker(), summary(), toGroups(), countrySchema, INITIAL_VALUES, toCountryPayloads(), CountryFormModal(), NOUN (+2 more)

### Community 77 - "ModelFormModal.jsx"
Cohesion: 0.32
Nodes (9): ControllerOptions(), groupByBrand(), INITIAL_VALUES, modelSchema, NAME_MAX_LENGTH, toFormValues(), toModelPayload(), ModelFormModal() (+1 more)

### Community 78 - "partForm.js"
Cohesion: 0.19
Nodes (11): EMPTY_PROCESS, INITIAL_VALUES, MAX_PART_COUNT, MAX_PROCESSES, PART_STATUS, partSchema, processSchema, processSeconds() (+3 more)

### Community 79 - "Productivity"
Cohesion: 0.15
Nodes (13): chartMessage(), machineLabel(), pickedMachineIds(), Productivity(), programIn(), programOptions(), ProgramSelect(), shiftsIn() (+5 more)

### Community 80 - "Sidebar.jsx"
Cohesion: 0.33
Nodes (7): Sidebar(), navLeafShape, SidebarItem(), filterNavByRole(), flattenNav(), hasActiveChild(), isPathActive()

### Community 81 - "Machine models"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, Delete model, Machine models, Shared components used, State & storage, UI states, deleteModel()

### Community 82 - "Add / edit part"
Cohesion: 0.22
Nodes (8): Add / edit part, API calls on this page, Decisions, Shared components used, State & storage, UI states, Upload part drawing, View process drawing

### Community 83 - "LineFormModal.jsx"
Cohesion: 0.42
Nodes (7): INITIAL_VALUES, lineSchema, NAME_MAX_LENGTH, toFormValues(), toLinePayload(), LineFormModal(), recordShape

### Community 84 - "Add / edit branch"
Cohesion: 0.25
Nodes (7): Add / edit branch, API calls on this page, Decisions, On page load, Shared components used, State & storage, UI states

### Community 85 - "Clientele"
Cohesion: 0.25
Nodes (7): API calls on this page, Clientele, Decisions, Delete clientele, Shared components used, State & storage, UI states

### Community 86 - "Controllers"
Cohesion: 0.25
Nodes (7): API calls on this page, Controllers, Decisions, Delete controller, Shared components used, State & storage, UI states

### Community 87 - "withQuery"
Cohesion: 0.54
Nodes (7): Save user supervisor (add / edit form), withQuery(), createUserSupervisor(), getUserSupervisors(), unwrap(), unwrapList(), updateUserSupervisor()

### Community 88 - "ThemeShowcase.jsx"
Cohesion: 0.25
Nodes (7): EXCEPTIONS, FILTERS, KPIS, MACHINES, TABS, ThemeShowcase(), ThemeShowcase

### Community 89 - "0005. Forms with react-hook-form and zod"
Cohesion: 0.33
Nodes (5): 0005. Forms with react-hook-form and zod, Alternatives considered, Consequences, Context, Decision

### Community 90 - "0007. Recharts for charts, plain SVG for the Gantt"
Cohesion: 0.33
Nodes (5): 0007. Recharts for charts, plain SVG for the Gantt, Alternatives considered, Consequences, Context, Decision

### Community 91 - "0009. Page-wise flow documentation in docs/pages"
Cohesion: 0.33
Nodes (5): 0009. Page-wise flow documentation in docs/pages, Alternatives considered, Consequences, Context, Decision

### Community 92 - "customerName"
Cohesion: 0.53
Nodes (4): customerMobile(), customerName(), matchesSearch(), CustomerRow()

### Community 93 - "validators.js"
Cohesion: 0.53
Nodes (5): isBlank(), matches(), minLength(), PASSWORD_MIN_LENGTH, required()

### Community 94 - "shifts.js"
Cohesion: 0.40
Nodes (4): ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, SHIFT_TYPES, WEEKDAYS

### Community 95 - "PickerField.jsx"
Cohesion: 0.67
Nodes (3): assignRef(), PickerField(), POPPER_CONFIG

### Community 96 - "userCountryService.js"
Cohesion: 0.83
Nodes (3): createUserCountry(), unwrap(), unwrapList()

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **10 isolated node(s):** `bootstrap`, `eslint`, `sass`, `@types/react`, `@types/react-dom` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 358 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProtectedRoute()` connect `ProtectedRoute` to `userCountryService.js`, `LicenceKeyGenerator.jsx`, `Add / edit customer or user`, `react-bootstrap`, `breakService.js`, `App shell (session, logout, theme)`, `adr/README.md`, `Downtime / idle reasons`, `Productivity`, `Holidays / week off`, `Parts`, `Production schedules`, `Shifts`, `Branches`, `All machines`, `Supervisors`, `userLineService.js`, `Cells`, `Shops`, `userStateService.js`, `Machine health`, `userCityService.js`, `Machine models`, `Add / edit part`, `Add / edit branch`, `Clientele`, `Controllers`?**
  _High betweenness centrality (0.163) - this node is a cross-community bridge._
- **What connects `bootstrap`, `eslint`, `sass` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `MachineHealth.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08115942028985507 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `MachineHealth.jsx`, `prop-types`, `Productivity.jsx`, `ProcessFields.jsx`, `AddMachine.jsx`, `AddBranch.jsx`, `DateRangePicker.jsx`, `BreakFormModal.jsx`, `Speedometer.jsx`, `LicenceKeyGenerator.jsx`, `AddProductionSchedule.jsx`, `ModeTimelineCard.jsx`, `AddCustomer.jsx`, `clienteleForm.js`, `MainLayout`, `apiClient.js`, `ShiftFormModal.jsx`, `package.json`, `ProtectedRoute`, `ControllerFormModal.jsx`, `react-bootstrap`, `StateFormModal.jsx`, `AuthProvider.jsx`, `ReasonFormModal.jsx`, `HolidayFormModal.jsx`, `Productivity`, `dateTime.js`, `ClienteleFormModal.jsx`, `SupervisorFormModal.jsx`, `LocationFormModal.jsx`, `DatePicker.jsx`, `useOrgUser`, `CellFormModal.jsx`, `ShopFormModal.jsx`, `AddPart.jsx`, `CountryFormModal.jsx`, `ModelFormModal.jsx`, `Sidebar.jsx`, `LineFormModal.jsx`, `ThemeShowcase.jsx`, `PickerField.jsx`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Should `Productivity.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11264367816091954 - nodes in this community are weakly interconnected._
- **Why does `Loader()` connect `react-bootstrap` to `MachineHealth.jsx`, `sharedGet`, `AddMachine`, `AddMachine.jsx`, `AddBranch.jsx`, `AddPart.jsx`, `ReasonFormModal.jsx`, `AddProductionSchedule.jsx`, `ModelList`, `Productivity`, `ModeTimelineCard.jsx`, `AddCustomer.jsx`, `ClienteleFormModal.jsx`, `MainLayout`, `ProtectedRoute`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._