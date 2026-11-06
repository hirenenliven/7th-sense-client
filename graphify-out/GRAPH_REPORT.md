# Graph Report - 7th-sense-client  (2026-11-06)

## Corpus Check
- 350 files · ~209,649 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 2195 nodes · 7561 edges · 123 communities (121 shown, 2 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 531 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dabd25cd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ClienteleFormModal.jsx
- CustomerView.jsx
- BarLineChart.jsx
- liveSocket.js
- Productivity.jsx
- react
- MonitoringMachines.jsx
- OperationsCenter.jsx
- ProtectedRoute
- Project Docs & Conventions
- dateTime.js
- MachineDiagnostics.jsx
- AddPart.jsx
- IntelligencePanels.jsx
- chartTheme.js
- AddProductionSchedule.jsx
- healthSampleData.js
- Runtime Dependencies
- intelligenceSettings.js
- Breaks
- 0001. Single-page app with React 19 and Vite
- withQuery
- MonitoringMachines.jsx
- 0016. Account Center is superadmin only; Users lists company members only
- devDependencies
- jsconfig Aliases
- userCountryService.js
- TimePicker.jsx
- AddCustomer.jsx
- package.json
- authService.js
- sharedGet
- Login Logo Asset
- react-bootstrap
- OrganizationPage.jsx
- userCityService.js
- ControllerFormModal.jsx
- Customers / Users list
- All machines
- healthSensors.js
- Virtual Screen (machine tab)
- 0013. Monitoring starts with a machine list; All Machines is set-up only
- VirtualScreen.jsx
- vite.config.js
- Branches
- adr/README.md
- Downtime / idle reasons
- PlantIntelligence.jsx
- AddMachine.jsx
- AuthProvider.jsx
- App.jsx
- Shifts
- User guide
- OpsPanels.jsx
- useTableSort
- Add / edit branch
- UserGuide.jsx
- ModeReasonModal.jsx
- ModelFormModal.jsx
- AddBranch.jsx
- 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page
- Add / edit machine
- States
- pages.jsx
- LicenceKeyGenerator.jsx
- Clientele
- 0008. Folder structure by page and by concern
- 0023. One list, row and form for the name-under-a-parent organization levels
- HolidayFormModal.jsx
- 0006. React-Bootstrap with SCSS design tokens
- Add / edit production schedule
- ChartCard
- MainLayout.jsx
- BrandFormModal.jsx
- Page flows
- app.js
- customerName
- 0003. Server state via service modules and useLoad, Context only for the session
- userLocationService.js
- ShiftFormModal.jsx
- Login.jsx
- 0022. Ponytail plugin for Claude Code, under this repo's rules
- machines.js
- userLineService.js
- useMachineLive
- ModeGanttChart.jsx
- Home (Dashboard)
- validators.js
- 0005. Forms with react-hook-form and zod
- useAuth
- 0009. Page-wise flow documentation in docs/pages
- 0004. Axios client with the HttpOnly session cookie
- MainLayout
- CustomerList.jsx
- Machine models
- Operations Center
- Monitoring (machine list)
- orgLevels.js
- 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page
- Brands
- Customers / Users list
- 0020. Virtual Screen: one REST snapshot polled every 5 s
- Licence keys
- formatClock12
- Holidays / week off
- Machine diagnostics
- Production schedules
- Machine health
- Productivity
- Shops
- unwrap
- 0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day
- ControllerList.jsx
- Parts
- ModelList.jsx
- remove
- 0002. React Router with one route table and role guards
- scripts
- 0014-account-center.md
- zod
- 0024. Operations Center: a second dashboard beside Home, on the existing APIs
- Client documentation

## God Nodes (most connected - your core abstractions)
1. `react` - 129 edges
2. `prop-types` - 113 edges
3. `unwrap()` - 100 edges
4. `react-bootstrap` - 99 edges
5. `useAuth()` - 90 edges
6. `Loader()` - 79 edges
7. `withQuery()` - 79 edges
8. `sharedGet()` - 67 edges
9. `ProtectedRoute()` - 52 edges
10. `formatCount()` - 49 edges

## Surprising Connections (you probably didn't know these)
- `UI states` --references--> `Loader()`  [INFERRED]
  docs/pages/home.md → src/components/common/Loader.jsx
- `Shared components used` --references--> `NoResults()`  [INFERRED]
  docs/pages/machine-diagnostics.md → src/components/common/TableNoResults.jsx
- `Open productivity / health` --references--> `machineMonitorPath()`  [INFERRED]
  docs/pages/monitoring-machines.md → src/constants/monitoring.js
- `State & storage` --references--> `useAuth()`  [INFERRED]
  docs/pages/branch-form.md → src/hooks/useAuth.js
- `State & storage` --references--> `useAuth()`  [INFERRED]
  docs/pages/breaks.md → src/hooks/useAuth.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project convention documents (CLAUDE.md, frontend skills, THEME, README)** — claude, 7th_sense_frontend_skills, theme, readme [EXTRACTED 1.00]
- **Customer-scoped master data with role-based access** — claude_masters_customer_pattern, claude_role_based_access, claude_production_schedule, claude_licence_keys, claude_shifts_breaks [INFERRED 0.85]
- **Dark/light dual theme system** — theme_design_tokens, theme_light_theme_second_build, theme_theme_switching, 7thsense_ui_review [INFERRED 0.85]

## Communities (123 total, 2 thin omitted)

### Community 0 - "ClienteleFormModal.jsx"
Cohesion: 0.14
Nodes (28): Save clientele (add / edit form), COUNTRIES, DEFAULT_COUNTRY, DEFAULT_TIME_ZONE, ENABLED_COUNTRIES, getCountryCode(), getCountryName(), getDialCode() (+20 more)

### Community 1 - "CustomerView.jsx"
Cohesion: 0.17
Nodes (27): On page load, Choose the user's machines (Access card), On page load, Save user (add / edit form), On page load, AddCustomer(), CustomerView(), DetailCard() (+19 more)

### Community 2 - "BarLineChart.jsx"
Cohesion: 0.26
Nodes (27): recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), axisPropTypes, renderGrid(), renderLegend(), renderTooltip() (+19 more)

### Community 3 - "liveSocket.js"
Cohesion: 0.17
Nodes (23): applyAnswer(), applyStatus(), applyValues(), checkSession(), connectionListeners, disconnectLive(), EMPTY_STATE, getSocket() (+15 more)

### Community 4 - "Productivity.jsx"
Cohesion: 0.08
Nodes (48): UNKNOWN_MODE_COLOR, useLoad(), ModeTimelineCard(), readoutClock, readoutTime, chartMessage(), dayLabel, pickedMachineIds() (+40 more)

### Community 5 - "react"
Cohesion: 0.07
Nodes (62): Decision, country-region-data, prop-types, react, IconAction(), MultiSelectPicker(), summary(), toGroups() (+54 more)

### Community 6 - "MonitoringMachines.jsx"
Cohesion: 0.23
Nodes (14): MACHINE_STATUS, MachineMode(), MachineRow(), MachineCycles(), MachineOee(), NoValue(), OEE_PARTS, oeeVariant() (+6 more)

### Community 7 - "OperationsCenter.jsx"
Cohesion: 0.17
Nodes (22): Decision, Shared components used, chartMessage(), clockLabel, customerOptionLabel(), dayLabel, dayTitle, ADR-0024 (+14 more)

### Community 8 - "ProtectedRoute"
Cohesion: 0.16
Nodes (14): Decision, Coming soon (unbuilt sidebar links), Decisions, On page load, ErrorBoundary, ComingSoon(), AppRoutes(), ComingSoon (+6 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "dateTime.js"
Cohesion: 0.12
Nodes (40): ChartDateFilter(), clamp(), DateCalendar(), DatePicker(), dayLabel, keyToDay(), monthGrid(), monthName (+32 more)

### Community 11 - "MachineDiagnostics.jsx"
Cohesion: 0.12
Nodes (29): ADR-0013, On page load, buildChecks(), buildVerdict(), CHECK_LABELS, CHECK_STATUS, DEFAULT_LIVE_INTERVAL, DIAGNOSTICS_REFRESH_MS (+21 more)

### Community 12 - "AddPart.jsx"
Cohesion: 0.08
Nodes (44): Add / edit part, API calls on this page, Decisions, Save part (add / edit form), Shared components used, State & storage, UI states, Upload part drawing (+36 more)

### Community 13 - "IntelligencePanels.jsx"
Cohesion: 0.12
Nodes (38): Rules & edge cases, monitoringSearchPath(), DayCard(), FleetCard(), HourlyCard(), KpiTile(), TileRow(), tileShape (+30 more)

### Community 14 - "chartTheme.js"
Cohesion: 0.10
Nodes (24): LEGEND_BOTTOM_PROPS, LEGEND_PROPS, AREA_OPACITY, BAND_OPACITY, GRID_PROPS, MUTED_OPACITY, SEGMENT_GAP, SERIES_COLORS (+16 more)

### Community 15 - "AddProductionSchedule.jsx"
Cohesion: 0.12
Nodes (26): Save production schedule (add / edit form), AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel(), EMPTY_ITEM, idText() (+18 more)

### Community 16 - "healthSampleData.js"
Cohesion: 0.14
Nodes (25): MACHINE_MODES, buildDay(), dailyRows(), dayLabel, dayLoad(), dayStates(), dayWindow(), hourLabel (+17 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+9 more)

### Community 18 - "intelligenceSettings.js"
Cohesion: 0.09
Nodes (41): Shared components used, API calls on this page, Change the period or the customer, Decisions, Findings, On page load, Plant Intelligence, State & storage (+33 more)

### Community 19 - "Breaks"
Cohesion: 0.29
Nodes (7): API calls on this page, Breaks, Decisions, Delete break, Shared components used, State & storage, UI states

### Community 20 - "0001. Single-page app with React 19 and Vite"
Cohesion: 0.33
Nodes (5): 0001. Single-page app with React 19 and Vite, Alternatives considered, Consequences, Context, Decision

### Community 21 - "withQuery"
Cohesion: 0.29
Nodes (12): On page load, withQuery(), getCycleCounts(), getFinishCycles(), getMachineSummaries(), getModeTimeline(), getModeTotals(), getOee() (+4 more)

### Community 22 - "MonitoringMachines.jsx"
Cohesion: 0.12
Nodes (21): 0012. Monitoring: Productivity and Machine Health on one tabbed page, Alternatives considered, Consequences, Context, Decision, Decision, API calls on this page, Decisions (+13 more)

### Community 23 - "0016. Account Center is superadmin only; Users lists company members only"
Cohesion: 0.40
Nodes (5): 0016. Account Center is superadmin only; Users lists company members only, Alternatives considered, Consequences, Context, Decision

### Community 24 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "userCountryService.js"
Cohesion: 0.22
Nodes (9): API calls on this page, Countries, Decisions, Delete user country, On page load, Save user country (add / edit form), Shared components used, State & storage (+1 more)

### Community 27 - "TimePicker.jsx"
Cohesion: 0.13
Nodes (20): assignRef(), PickerField(), POPPER_CONFIG, centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel() (+12 more)

### Community 28 - "AddCustomer.jsx"
Cohesion: 0.13
Nodes (25): ALL_MACHINE_ROLES, THEMES, getStateCode(), ACCOUNT_KIND, ACCOUNT_PAGES, FILTER_NAMES, FILTER_OPTIONS, getCustomerSchema() (+17 more)

### Community 29 - "package.json"
Cohesion: 0.13
Nodes (16): name, private, type, version, axios, bootstrap, eslint, @eslint/js (+8 more)

### Community 30 - "authService.js"
Cohesion: 0.25
Nodes (7): API calls on this page, Decisions, Login, Shared components used, State & storage, Submit login form, UI states

### Community 31 - "sharedGet"
Cohesion: 0.13
Nodes (28): Decision, On page load, On page load, On page load, On page load, On page load, On page load, On page load (+20 more)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "react-bootstrap"
Cohesion: 0.20
Nodes (19): react-bootstrap, react-router-dom, Loader(), useAuth(), AccountCenterPage(), isTabActive(), Forbidden(), TAB_SCREENS (+11 more)

### Community 34 - "OrganizationPage.jsx"
Cohesion: 0.33
Nodes (5): 0010. Organization levels on one tabbed page, a route per tab, Alternatives considered, Consequences, Context, Decision

### Community 35 - "userCityService.js"
Cohesion: 0.18
Nodes (13): API calls on this page, Cities, Decisions, Delete user city, On page load, Save user city (add / edit form), Shared components used, State & storage (+5 more)

### Community 36 - "ControllerFormModal.jsx"
Cohesion: 0.23
Nodes (12): Save controller (add / edit form), FieldLabel(), InfoTooltip(), controllerSchema, INITIAL_VALUES, MAX_LENGTH, toControllerPayload(), toFormValues() (+4 more)

### Community 37 - "Customers / Users list"
Cohesion: 0.08
Nodes (24): API calls on this page, App shell (session, logout, theme), Change theme, Decisions, On page load, Shared components used, State & storage, UI states (+16 more)

### Community 38 - "All machines"
Cohesion: 0.22
Nodes (9): All machines, API calls on this page, Decisions, Delete machine, Edit machine, On page load, Shared components used, State & storage (+1 more)

### Community 39 - "healthSensors.js"
Cohesion: 0.09
Nodes (32): niceTicks(), STEP_MULTIPLES, pointsInRange(), sensorDay(), clock, clockSeconds, dayClock, DEFAULT_RANGE (+24 more)

### Community 40 - "Virtual Screen (machine tab)"
Cohesion: 0.22
Nodes (9): API calls on this page, Decisions, Live values (Socket.IO), On page load, Rules & edge cases, Shared components used, State & storage, UI states (+1 more)

### Community 41 - "0013. Monitoring starts with a machine list; All Machines is set-up only"
Cohesion: 0.19
Nodes (9): 0013. Monitoring starts with a machine list; All Machines is set-up only, Alternatives considered, Consequences, Context, Decision, 0019. Monitoring: machine list, then the machine's tabs with a back arrow, Alternatives considered, Consequences (+1 more)

### Community 42 - "VirtualScreen.jsx"
Cohesion: 0.06
Nodes (49): What the screen shows, 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents), ADR-0009, ADR-0021, LIVE_CHANNELS (+41 more)

### Community 43 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 44 - "Branches"
Cohesion: 0.22
Nodes (9): API calls on this page, Branches, Decisions, Delete branch, On page load, Save branch (add / edit form), Shared components used, State & storage (+1 more)

### Community 46 - "Downtime / idle reasons"
Cohesion: 0.16
Nodes (19): API calls on this page, Decisions, Delete downtime reason, Delete idle reason, Downtime / idle reasons, On page load, Save downtime reason (add / edit form), Save idle reason (add / edit form) (+11 more)

### Community 47 - "PlantIntelligence.jsx"
Cohesion: 0.18
Nodes (18): SLOW_REFRESH_MS, AlarmParetoCard(), InsightsCard(), OutlookCard(), dayLabel(), DEFAULT_PERIOD, PERIODS, weekdayLabel() (+10 more)

### Community 48 - "AddMachine.jsx"
Cohesion: 0.15
Nodes (24): AddMachine(), byName(), Field(), loadBrands(), loadControllers(), loadCustomers(), loadModels(), placeholder() (+16 more)

### Community 49 - "AuthProvider.jsx"
Cohesion: 0.14
Nodes (14): 0017. Log in as customer in a new tab, on the tab's own API path, Alternatives considered, Consequences, Context, Decision, 0021. Virtual Screen: live values over Socket.IO, REST for derived data, Alternatives considered, Consequences (+6 more)

### Community 50 - "App.jsx"
Cohesion: 0.22
Nodes (11): Decision, App(), Toaster(), ICONS, ToastItem(), AuthContext, AuthProvider(), onUnauthorized() (+3 more)

### Community 51 - "Shifts"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete shift, Shared components used, Shifts, State & storage, UI states

### Community 52 - "User guide"
Cohesion: 0.25
Nodes (8): Decisions, On page load, Rules & edge cases, Sections, Shared components used, State & storage, UI states, User guide

### Community 53 - "OpsPanels.jsx"
Cohesion: 0.11
Nodes (41): On page load, NoResults(), modeTypeOf(), machineMonitorPath(), MONITOR_REFRESH_MS, MONITORING_MACHINE_TABS, ADR-0024, ROUTES (+33 more)

### Community 54 - "useTableSort"
Cohesion: 0.13
Nodes (41): Decision, ARIA_SORT, SortableHead(), TableNoResults(), pageItems(), TablePagination(), PAGE_SIZES, compareValues() (+33 more)

### Community 55 - "Add / edit branch"
Cohesion: 0.33
Nodes (6): Add / edit branch, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 56 - "UserGuide.jsx"
Cohesion: 0.18
Nodes (18): navLinks(), NUMBERED_STEPS, OpenLink(), SectionCard(), SECTIONS, SetupStep(), textOf(), UserGuide() (+10 more)

### Community 57 - "ModeReasonModal.jsx"
Cohesion: 0.18
Nodes (24): Add a downtime or idle reason, clockFormat, dateValue(), dayFormat, firstFreeSpan(), floorMinute(), formatClock(), formatDay() (+16 more)

### Community 58 - "ModelFormModal.jsx"
Cohesion: 0.26
Nodes (12): Save model (add / edit form), ControllerOptions(), groupByBrand(), INITIAL_VALUES, modelSchema, NAME_MAX_LENGTH, toFormValues(), toModelPayload() (+4 more)

### Community 59 - "AddBranch.jsx"
Cohesion: 0.11
Nodes (29): On page load, Save branch (add / edit form), On page load, BRANCH_STATUS, ROLE_LABELS, USER_STATUS, OrgUserProvider(), AddBranch() (+21 more)

### Community 60 - "0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page"
Cohesion: 0.40
Nodes (5): 0014. Business Setup renamed Account Center; old Account Center item removed, Alternatives considered, Consequences, Context, Decision

### Community 61 - "Add / edit machine"
Cohesion: 0.33
Nodes (6): Add / edit machine, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 62 - "States"
Cohesion: 0.16
Nodes (13): API calls on this page, Decisions, Delete user state, On page load, Save user state (add / edit form), Shared components used, State & storage, States (+5 more)

### Community 63 - "pages.jsx"
Cohesion: 0.07
Nodes (26): ACCOUNT_CENTER_PATHS, ACCOUNT_CENTER_TABS, MONITORING_PATHS, NAV_SECTIONS, ORG_LEVEL, ORGANIZATION_PATHS, ORGANIZATION_TABS, REASON_KIND (+18 more)

### Community 64 - "LicenceKeyGenerator.jsx"
Cohesion: 0.15
Nodes (22): Generate licence keys, Save licence keys (add / edit form), Other, react-hook-form, DEFAULT_DURATION, DURATION_VALUES, editSchema, GENERATE_INITIAL_VALUES (+14 more)

### Community 65 - "Clientele"
Cohesion: 0.29
Nodes (7): API calls on this page, Clientele, Decisions, Delete clientele, Shared components used, State & storage, UI states

### Community 66 - "0008. Folder structure by page and by concern"
Cohesion: 0.33
Nodes (5): 0008. Folder structure by page and by concern, Alternatives considered, Consequences, Context, Decision

### Community 67 - "0023. One list, row and form for the name-under-a-parent organization levels"
Cohesion: 0.40
Nodes (4): 0023. One list, row and form for the name-under-a-parent organization levels, Alternatives considered, Consequences, Context

### Community 68 - "HolidayFormModal.jsx"
Cohesion: 0.22
Nodes (14): Save holiday (add / edit form), HOLIDAY_TYPES, SHIFT_STATUS, WEEKDAYS, holidaySchema, INITIAL_VALUES, MAX_LENGTH, toFormValues() (+6 more)

### Community 69 - "0006. React-Bootstrap with SCSS design tokens"
Cohesion: 0.33
Nodes (5): 0006. React-Bootstrap with SCSS design tokens, Alternatives considered, Consequences, Context, Decision

### Community 70 - "Add / edit production schedule"
Cohesion: 0.33
Nodes (6): Add / edit production schedule, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 71 - "ChartCard"
Cohesion: 0.26
Nodes (14): Decision, ChartCard(), customerOptionLabel(), dayTitle, Home(), AlarmsCard(), AttentionCard(), HomeTable() (+6 more)

### Community 72 - "MainLayout.jsx"
Cohesion: 0.28
Nodes (11): Footer(), AppShell(), Sidebar(), isAlsoActive(), linkClass(), navLeafShape, SidebarItem(), useSidebar() (+3 more)

### Community 73 - "BrandFormModal.jsx"
Cohesion: 0.28
Nodes (10): @hookform/resolvers, brandSchema, INITIAL_VALUES, MAX_LENGTH, toBrandPayload(), toFormValues(), BrandFormModal(), FIELD_HELP (+2 more)

### Community 74 - "Page flows"
Cohesion: 0.15
Nodes (13): Dashboard, Masters, Masters › Downtime, Masters › Organization, Masters › Shift, Masters › Users, Operations, Operations › Monitoring (+5 more)

### Community 75 - "app.js"
Cohesion: 0.21
Nodes (18): ConfirmModal(), CUSTOMER_ROLE_ID, MANAGERS, ROLES, SUPERADMIN_ONLY, BreakSetup(), matchesSearch(), HolidaySetup() (+10 more)

### Community 76 - "customerName"
Cohesion: 0.26
Nodes (11): Save break (add / edit form), BREAK_NAME_SUGGESTIONS, breakSchema, INITIAL_VALUES, MAX_LENGTH, toBreakPayload(), toFormValues(), BreakFormModal() (+3 more)

### Community 77 - "0003. Server state via service modules and useLoad, Context only for the session"
Cohesion: 0.40
Nodes (4): 0003. Server state via service modules and useLoad, Context only for the session, Alternatives considered, Consequences, Context

### Community 78 - "userLocationService.js"
Cohesion: 0.16
Nodes (14): API calls on this page, Decisions, Delete user location, Locations, On page load, Save user location (add / edit form), Shared components used, State & storage (+6 more)

### Community 79 - "ShiftFormModal.jsx"
Cohesion: 0.19
Nodes (18): Save shift (add / edit form), StatusToggle(), ALL_WEEKDAYS, clock(), EMPTY_BREAK_ROW, INITIAL_VALUES, MAX_BREAKS, MAX_LENGTH (+10 more)

### Community 80 - "Login.jsx"
Cohesion: 0.06
Nodes (54): ADR-0018, 0018. Log in as customer opens the dashboard directly (no /login-as page), Alternatives considered, Consequences, Context, Decision, bootstrap-icons, @fontsource-variable/roboto (+46 more)

### Community 81 - "0022. Ponytail plugin for Claude Code, under this repo's rules"
Cohesion: 0.33
Nodes (5): 0022. Ponytail plugin for Claude Code, under this repo's rules, Alternatives considered, Consequences, Context, Decision

### Community 83 - "machines.js"
Cohesion: 0.22
Nodes (9): CONTROLLER_VERSION_TYPES, MACHINE_ACCURACIES, MACHINE_HEALTH_ALL, MACHINE_HEALTH_SENSORS, MACHINE_SYSTEM_TYPES, SECURITY_MODES, ALL_IDS, HealthSensorPicker() (+1 more)

### Community 84 - "userLineService.js"
Cohesion: 0.20
Nodes (11): API calls on this page, Decisions, Delete user line, Lines, Save user line (add / edit form), Shared components used, State & storage, UI states (+3 more)

### Community 85 - "useMachineLive"
Cohesion: 0.38
Nodes (10): useMachineLive(), getLiveConnectError(), getMachineState(), isLiveConnected(), machineEntry(), onMachineEvent(), scheduleSync(), subscribeConnection() (+2 more)

### Community 86 - "ModeGanttChart.jsx"
Cohesion: 0.17
Nodes (11): 0007. Recharts for charts, plain SVG for the Gantt, Alternatives considered, Consequences, Context, Decision, clockMinutes, clockWithSeconds, ModeGanttChart() (+3 more)

### Community 87 - "Home (Dashboard)"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Home (Dashboard), On page load, Pick another day or customer, State & storage, UI states

### Community 88 - "validators.js"
Cohesion: 0.32
Nodes (7): fileRule(), isBlank(), matches(), PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PATTERNS, required()

### Community 89 - "0005. Forms with react-hook-form and zod"
Cohesion: 0.33
Nodes (5): 0005. Forms with react-hook-form and zod, Alternatives considered, Consequences, Context, Decision

### Community 90 - "useAuth"
Cohesion: 0.23
Nodes (12): INITIAL_VALUES, MAX_LENGTH, REASON_STATUS, reasonSchema, toFormValues(), toReasonPayload(), ReasonFormModal(), FIELD_HELP (+4 more)

### Community 91 - "0009. Page-wise flow documentation in docs/pages"
Cohesion: 0.33
Nodes (5): 0009. Page-wise flow documentation in docs/pages, Alternatives considered, Consequences, Context, Decision

### Community 92 - "0004. Axios client with the HttpOnly session cookie"
Cohesion: 0.40
Nodes (4): 0004. Axios client with the HttpOnly session cookie, Alternatives considered, Consequences, Context

### Community 93 - "MainLayout"
Cohesion: 0.11
Nodes (19): About, Decisions, State & storage, UI states, API calls on this page, Controllers, Decisions, Delete controller (+11 more)

### Community 94 - "CustomerList.jsx"
Cohesion: 0.53
Nodes (5): isAccountOfKind(), CustomerList(), CustomerList, deleteUser(), loginAsUrl()

### Community 95 - "Machine models"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete model, Machine models, Shared components used, State & storage, UI states

### Community 96 - "Operations Center"
Cohesion: 0.20
Nodes (10): Action queue rules, API calls on this page, Change the date or the customer, Decisions, Operations Center, Rules & edge cases, Shared components used, State & storage (+2 more)

### Community 97 - "Monitoring (machine list)"
Cohesion: 0.22
Nodes (9): API calls on this page, Decisions, Monitoring (machine list), On page load, Open productivity / health, Rules & edge cases, Shared components used, State & storage (+1 more)

### Community 98 - "orgLevels.js"
Cohesion: 0.08
Nodes (31): API calls on this page, Cells, Decisions, Delete user cell, On page load, Save user cell (add / edit form), Shared components used, State & storage (+23 more)

### Community 99 - "0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page"
Cohesion: 0.40
Nodes (5): 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page, Alternatives considered, Consequences, Context, Decision

### Community 100 - "Brands"
Cohesion: 0.22
Nodes (9): API calls on this page, Brands, Decisions, Delete brand, On page load, Save brand (add / edit form), Shared components used, State & storage (+1 more)

### Community 101 - "Customers / Users list"
Cohesion: 0.22
Nodes (9): API calls on this page, Customers / Users list, Decisions, Delete user, Save user (add / edit form), Shared components used, State & storage, UI states (+1 more)

### Community 102 - "0020. Virtual Screen: one REST snapshot polled every 5 s"
Cohesion: 0.25
Nodes (5): 0020. Virtual Screen: one REST snapshot polled every 5 s, Alternatives considered, Consequences, Context, Decision

### Community 103 - "Licence keys"
Cohesion: 0.22
Nodes (9): API calls on this page, Decisions, Delete licence key, Licence keys, On page load, Save licence key (add / edit form), Shared components used, State & storage (+1 more)

### Community 104 - "formatClock12"
Cohesion: 0.47
Nodes (8): SHIFT_TYPES, Clock(), minutesBetween(), ShiftCard(), toMinutes(), typeLabel(), formatClock12(), parseTime()

### Community 105 - "Holidays / week off"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete holiday, Holidays / week off, On page load, Shared components used, State & storage, UI states

### Community 106 - "Machine diagnostics"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Machine diagnostics, Shared components used, State & storage, The checks, UI states, Watch variables live

### Community 107 - "Production schedules"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete production schedule, On page load, Production schedules, Shared components used, State & storage, UI states

### Community 108 - "Machine health"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Live updates, Machine health, On page load, Shared components used, State & storage, UI states

### Community 109 - "Productivity"
Cohesion: 0.25
Nodes (8): API calls on this page, Change the Machine Modes period, Decisions, Live updates, Productivity, Shared components used, State & storage, UI states

### Community 110 - "Shops"
Cohesion: 0.20
Nodes (11): API calls on this page, Decisions, Delete user shop, Save user shop (add / edit form), Shared components used, Shops, State & storage, UI states (+3 more)

### Community 111 - "unwrap"
Cohesion: 0.39
Nodes (7): Save machine (add / edit form), unwrap(), getSession(), login(), loginAs(), createMachine(), updateMachine()

### Community 112 - "0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day"
Cohesion: 0.40
Nodes (4): 0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day, Alternatives considered, Consequences, Context

### Community 113 - "ControllerList.jsx"
Cohesion: 0.52
Nodes (6): byBrandThenName(), byName(), ControllerList(), matchesSearch(), ControllerList, deleteController()

### Community 114 - "Parts"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete part, On page load, Parts, Shared components used, State & storage, UI states

### Community 115 - "ModelList.jsx"
Cohesion: 0.48
Nodes (6): byBrandControllerName(), compareText(), matchesSearch(), ModelList(), ModelList, deleteModel()

### Community 116 - "remove"
Cohesion: 0.36
Nodes (8): TOAST_DEFAULTS, dismiss(), emit(), listeners, remove(), setToasts(), show(), toasts

### Community 117 - "0002. React Router with one route table and role guards"
Cohesion: 0.40
Nodes (4): 0002. React Router with one route table and role guards, Alternatives considered, Consequences, Context

### Community 118 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 119 - "0014-account-center.md"
Cohesion: 0.21
Nodes (4): 0015. Clientele is a Masters page, not an Account Center tab, Alternatives considered, Consequences, Context

### Community 120 - "zod"
Cohesion: 0.50
Nodes (3): zod, INITIAL_VALUES, loginSchema

### Community 121 - "0024. Operations Center: a second dashboard beside Home, on the existing APIs"
Cohesion: 0.40
Nodes (4): 0024. Operations Center: a second dashboard beside Home, on the existing APIs, Alternatives considered, Consequences, Context

### Community 127 - "Client documentation"
Cohesion: 0.40
Nodes (4): Client documentation, How to use Postman, How to view the API docs in Chrome (Swagger UI), How to view the page flow docs

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **22 isolated node(s):** `bootstrap`, `@types/react`, `@types/react-dom`, `eslint`, `sass` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 499 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ClienteleFormModal.jsx`, `CustomerView.jsx`, `BarLineChart.jsx`, `Productivity.jsx`, `OperationsCenter.jsx`, `ProtectedRoute`, `dateTime.js`, `MachineDiagnostics.jsx`, `AddPart.jsx`, `IntelligencePanels.jsx`, `chartTheme.js`, `AddProductionSchedule.jsx`, `MonitoringMachines.jsx`, `TimePicker.jsx`, `AddCustomer.jsx`, `package.json`, `react-bootstrap`, `ControllerFormModal.jsx`, `healthSensors.js`, `VirtualScreen.jsx`, `PlantIntelligence.jsx`, `AddMachine.jsx`, `App.jsx`, `OpsPanels.jsx`, `useTableSort`, `UserGuide.jsx`, `ModeReasonModal.jsx`, `ModelFormModal.jsx`, `AddBranch.jsx`, `pages.jsx`, `LicenceKeyGenerator.jsx`, `HolidayFormModal.jsx`, `ChartCard`, `MainLayout.jsx`, `BrandFormModal.jsx`, `app.js`, `customerName`, `ShiftFormModal.jsx`, `Login.jsx`, `useMachineLive`, `ModeGanttChart.jsx`, `useAuth`, `CustomerList.jsx`, `formatClock12`, `ControllerList.jsx`, `ModelList.jsx`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Are the 23 inferred relationships involving `useAuth()` (e.g. with `State & storage` and `State & storage`) actually correct?**
  _`useAuth()` has 23 INFERRED edges - model-reasoned connections that need verification._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ClienteleFormModal.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14204545454545456 - nodes in this community are weakly interconnected._
- **Why does `ProtectedRoute()` connect `ProtectedRoute` to `AddPart.jsx`, `intelligenceSettings.js`, `Breaks`, `MonitoringMachines.jsx`, `userCountryService.js`, `react-bootstrap`, `userCityService.js`, `Customers / Users list`, `All machines`, `Virtual Screen (machine tab)`, `Branches`, `Downtime / idle reasons`, `AuthProvider.jsx`, `Shifts`, `User guide`, `Add / edit branch`, `Add / edit machine`, `States`, `Clientele`, `Add / edit production schedule`, `userLocationService.js`, `userLineService.js`, `Home (Dashboard)`, `MainLayout`, `Machine models`, `Operations Center`, `Monitoring (machine list)`, `orgLevels.js`, `Brands`, `Customers / Users list`, `Licence keys`, `Holidays / week off`, `Machine diagnostics`, `Production schedules`, `Machine health`, `Productivity`, `Shops`, `Parts`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Should `Productivity.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07619738751814223 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._