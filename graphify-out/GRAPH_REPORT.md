# Graph Report - 7th-sense-client  (2026-11-16)

## Corpus Check
- 351 files · ~211,211 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 2206 nodes · 7597 edges · 114 communities (110 shown, 4 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 538 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e4982407`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- OperationsCenter.jsx
- machineFilter.js
- BarLineChart.jsx
- liveSocket.js
- Productivity.jsx
- react
- Add / edit part
- modeTypeOf
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
- unwrap
- Tool List and Tool Life (machine tabs)
- 0016. Account Center is superadmin only; Users lists company members only
- devDependencies
- jsconfig Aliases
- useMachineLive
- TimePicker.jsx
- AddCustomer.jsx
- package.json
- authService.js
- withQuery
- Login Logo Asset
- toast
- OrganizationPage.jsx
- sharedGet
- ControllerFormModal.jsx
- Customers / Users list
- All machines
- healthSensors.js
- App.jsx
- 0002. React Router with one route table and role guards
- VirtualScreen.jsx
- vite.config.js
- Branches
- adr/README.md
- Downtime / idle reasons
- OpsFloorMap.jsx
- AddMachine.jsx
- AuthProvider.jsx
- apiBaseUrl
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
- SidebarProvider.jsx
- States
- pages.jsx
- LicenceKeyGenerator.jsx
- Clientele
- 0008. Folder structure by page and by concern
- 0023. One list, row and form for the name-under-a-parent organization levels
- BreakFormModal.jsx
- 0006. React-Bootstrap with SCSS design tokens
- ModelList.jsx
- Home.jsx
- AccountCenterPage.jsx
- BrandFormModal.jsx
- 0012. Monitoring: Productivity and Machine Health on one tabbed page
- Loader
- 0013. Monitoring starts with a machine list; All Machines is set-up only
- 0003. Server state via service modules and useLoad, Context only for the session
- userLocationService.js
- ShiftFormModal.jsx
- theme.js
- 0022. Ponytail plugin for Claude Code, under this repo's rules
- 0024. Operations Center: a second dashboard beside Home, on the existing APIs
- userLineService.js
- 0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before
- 0007. Recharts for charts, plain SVG for the Gantt
- Home (Dashboard)
- 0019. Monitoring: machine list, then the machine's tabs with a back arrow
- 0005. Forms with react-hook-form and zod
- getUsers
- 0009. Page-wise flow documentation in docs/pages
- 0004. Axios client with the HttpOnly session cookie
- app.js
- Operations Center
- Monitoring (machine list)
- orgLevels.js
- 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page
- Topbar.jsx
- 0020. Virtual Screen: one REST snapshot polled every 5 s
- Customers / Users list
- Holidays / week off
- Production schedules
- Machine health
- Supervisors
- Shops
- 0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day
- react-bootstrap
- scripts
- 0015. Clientele is a Masters page, not an Account Center tab
- 0021. Virtual Screen: live values over Socket.IO, REST for derived data
- chartLegend.jsx
- ChartTooltip.jsx
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

## Communities (114 total, 4 thin omitted)

### Community 0 - "OperationsCenter.jsx"
Cohesion: 0.14
Nodes (42): Decision, Shared components used, On page load, Shared components used, ChartCard(), chartMessage(), clockLabel, customerOptionLabel() (+34 more)

### Community 1 - "machineFilter.js"
Cohesion: 0.12
Nodes (23): On page load, API calls on this page, Countries, Decisions, Delete user country, On page load, Save user country (add / edit form), Shared components used (+15 more)

### Community 2 - "BarLineChart.jsx"
Cohesion: 0.27
Nodes (27): recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), axisPropTypes, renderGrid(), renderLegend(), renderTooltip() (+19 more)

### Community 3 - "liveSocket.js"
Cohesion: 0.16
Nodes (24): socket.io-client, applyAnswer(), applyStatus(), applyValues(), checkSession(), connectionListeners, disconnectLive(), EMPTY_STATE (+16 more)

### Community 4 - "Productivity.jsx"
Cohesion: 0.08
Nodes (44): ChartDateFilter(), useLoad(), ModeTimelineCard(), readoutClock, readoutTime, chartMessage(), dayLabel, pickedMachineIds() (+36 more)

### Community 5 - "react"
Cohesion: 0.05
Nodes (77): country-region-data, prop-types, react, IconAction(), LiveClock(), MultiSelectPicker(), summary(), toGroups() (+69 more)

### Community 6 - "Add / edit part"
Cohesion: 0.25
Nodes (8): Add / edit part, API calls on this page, Decisions, Shared components used, State & storage, UI states, Upload part drawing, View process drawing

### Community 7 - "modeTypeOf"
Cohesion: 0.15
Nodes (24): Decision, clockMinutes, clockWithSeconds, ModeGanttChart(), TICK_STEPS, ticksFor(), CONTROLLER_VERSION_TYPES, MACHINE_MODE_TYPES (+16 more)

### Community 8 - "ProtectedRoute"
Cohesion: 0.07
Nodes (35): About, Decisions, State & storage, UI states, Coming soon (unbuilt sidebar links), Decisions, Add / edit machine, API calls on this page (+27 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "dateTime.js"
Cohesion: 0.11
Nodes (35): clamp(), DateCalendar(), DatePicker(), dayLabel, keyToDay(), monthGrid(), monthName, MONTHS (+27 more)

### Community 11 - "MachineDiagnostics.jsx"
Cohesion: 0.09
Nodes (37): ADR-0013, API calls on this page, Decisions, Machine diagnostics, On page load, Shared components used, State & storage, The checks (+29 more)

### Community 12 - "AddPart.jsx"
Cohesion: 0.09
Nodes (38): On page load, On page load, react-hook-form, StatusToggle(), MACHINE_ACCURACIES, AddPart(), byName(), MachinePicker() (+30 more)

### Community 13 - "IntelligencePanels.jsx"
Cohesion: 0.12
Nodes (32): Decision, Rules & edge cases, monitoringSearchPath(), DayCard(), FleetCard(), HourlyCard(), KpiTile(), TileRow() (+24 more)

### Community 14 - "chartTheme.js"
Cohesion: 0.11
Nodes (20): AREA_OPACITY, BAND_OPACITY, BAR_GAP, GRID_PROPS, MUTED_OPACITY, POINT_DOT, SEGMENT_GAP, SERIES_COLORS (+12 more)

### Community 15 - "AddProductionSchedule.jsx"
Cohesion: 0.11
Nodes (33): SHIFT_TYPES, AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel(), EMPTY_ITEM, idText() (+25 more)

### Community 16 - "healthSampleData.js"
Cohesion: 0.14
Nodes (23): MACHINE_MODES, buildDay(), dailyRows(), dayLabel, dayLoad(), dayStates(), dayWindow(), hourLabel (+15 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+9 more)

### Community 18 - "intelligenceSettings.js"
Cohesion: 0.09
Nodes (44): API calls on this page, Change the period or the customer, Decisions, Findings, On page load, Plant Intelligence, State & storage, UI states (+36 more)

### Community 19 - "Breaks"
Cohesion: 0.29
Nodes (7): API calls on this page, Breaks, Decisions, Delete break, Shared components used, State & storage, UI states

### Community 20 - "0001. Single-page app with React 19 and Vite"
Cohesion: 0.33
Nodes (5): 0001. Single-page app with React 19 and Vite, Alternatives considered, Consequences, Context, Decision

### Community 21 - "unwrap"
Cohesion: 0.11
Nodes (29): Save branch (add / edit form), Save holiday (add / edit form), Save machine (add / edit form), Save part (add / edit form), Save production schedule (add / edit form), Save shift (add / edit form), apiClient, pendingGets (+21 more)

### Community 22 - "Tool List and Tool Life (machine tabs)"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, On page load, Rules & edge cases, Shared components used, State & storage, Tool List and Tool Life (machine tabs), UI states

### Community 23 - "0016. Account Center is superadmin only; Users lists company members only"
Cohesion: 0.40
Nodes (5): 0016. Account Center is superadmin only; Users lists company members only, Alternatives considered, Consequences, Context, Decision

### Community 24 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "useMachineLive"
Cohesion: 0.38
Nodes (10): useMachineLive(), getLiveConnectError(), getMachineState(), isLiveConnected(), machineEntry(), onMachineEvent(), scheduleSync(), subscribeConnection() (+2 more)

### Community 27 - "TimePicker.jsx"
Cohesion: 0.15
Nodes (17): centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel(), TimePicker(), EXCEPTIONS, FILTERS (+9 more)

### Community 28 - "AddCustomer.jsx"
Cohesion: 0.06
Nodes (79): Save clientele (add / edit form), On page load, Save user (add / edit form), zod, ALL_MACHINE_ROLES, THEMES, COUNTRIES, DEFAULT_COUNTRY (+71 more)

### Community 29 - "package.json"
Cohesion: 0.12
Nodes (18): name, private, type, version, axios, bootstrap, bootstrap-icons, eslint (+10 more)

### Community 30 - "authService.js"
Cohesion: 0.25
Nodes (7): API calls on this page, Decisions, Login, Shared components used, State & storage, Submit login form, UI states

### Community 31 - "withQuery"
Cohesion: 0.33
Nodes (10): On page load, withQuery(), getMachineTimeByDay(), getCycleCounts(), getFinishCycles(), getMachineSummaries(), getModeTimeline(), getModeTotals() (+2 more)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "toast"
Cohesion: 0.13
Nodes (18): react-router-dom, ErrorBoundary, NAV_SECTIONS, ORG_LEVEL, ORGANIZATION_PATHS, ORGANIZATION_TABS, ADR-0024, ROUTES (+10 more)

### Community 34 - "OrganizationPage.jsx"
Cohesion: 0.40
Nodes (4): 0010. Organization levels on one tabbed page, a route per tab, Alternatives considered, Context, Decision

### Community 35 - "sharedGet"
Cohesion: 0.20
Nodes (18): Decision, On page load, On page load, On page load, On page load, On page load, On page load, sharedGet() (+10 more)

### Community 36 - "ControllerFormModal.jsx"
Cohesion: 0.16
Nodes (17): API calls on this page, Controllers, Decisions, Delete controller, Save controller (add / edit form), Shared components used, State & storage, UI states (+9 more)

### Community 37 - "Customers / Users list"
Cohesion: 0.11
Nodes (18): Change theme, API calls on this page, Change theme, Customer / user detail, Decisions, Shared components used, State & storage, UI states (+10 more)

### Community 38 - "All machines"
Cohesion: 0.22
Nodes (9): All machines, API calls on this page, Decisions, Delete machine, Edit machine, On page load, Shared components used, State & storage (+1 more)

### Community 39 - "healthSensors.js"
Cohesion: 0.10
Nodes (35): niceTicks(), STEP_MULTIPLES, pointsInRange(), sensorDay(), clock, clockSeconds, dayClock, DEFAULT_RANGE (+27 more)

### Community 40 - "App.jsx"
Cohesion: 0.39
Nodes (6): App(), Toaster(), ICONS, ToastItem(), getToasts(), subscribeToasts()

### Community 41 - "0002. React Router with one route table and role guards"
Cohesion: 0.25
Nodes (7): 0002. React Router with one route table and role guards, Alternatives considered, Consequences, Context, Decision, On page load, ComingSoon()

### Community 42 - "VirtualScreen.jsx"
Cohesion: 0.05
Nodes (59): API calls on this page, Decisions, Live values (Socket.IO), On page load, Rules & edge cases, Shared components used, State & storage, UI states (+51 more)

### Community 43 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 44 - "Branches"
Cohesion: 0.22
Nodes (9): API calls on this page, Branches, Decisions, Delete branch, On page load, Save branch (add / edit form), Shared components used, State & storage (+1 more)

### Community 46 - "Downtime / idle reasons"
Cohesion: 0.16
Nodes (19): API calls on this page, Decisions, Delete downtime reason, Delete idle reason, Downtime / idle reasons, On page load, Save downtime reason (add / edit form), Save idle reason (add / edit form) (+11 more)

### Community 47 - "OpsFloorMap.jsx"
Cohesion: 0.16
Nodes (20): NoResults(), machineMonitorPath(), MONITOR_REFRESH_MS, MONITORING_MACHINE_TABS, MONITORING_PATHS, MONITORING_SEARCH_PARAM, secondsInMode(), floorGroups() (+12 more)

### Community 48 - "AddMachine.jsx"
Cohesion: 0.12
Nodes (30): FieldLabel(), InfoTooltip(), MACHINE_HEALTH_ALL, MACHINE_HEALTH_SENSORS, AddMachine(), byName(), Field(), loadBrands() (+22 more)

### Community 49 - "AuthProvider.jsx"
Cohesion: 0.27
Nodes (9): Decision, Click Log out, AuthContext, AuthProvider(), notifyUnauthorized(), onUnauthorized(), logout(), clearLoginAs() (+1 more)

### Community 50 - "apiBaseUrl"
Cohesion: 0.14
Nodes (14): 0017. Log in as customer in a new tab, on the tab's own API path, Alternatives considered, Consequences, Context, Decision, 0018. Log in as customer opens the dashboard directly (no /login-as page), Alternatives considered, Consequences (+6 more)

### Community 51 - "Shifts"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete shift, Shared components used, Shifts, State & storage, UI states

### Community 52 - "User guide"
Cohesion: 0.25
Nodes (8): Decisions, On page load, Rules & edge cases, Sections, Shared components used, State & storage, UI states, User guide

### Community 53 - "OpsPanels.jsx"
Cohesion: 0.11
Nodes (31): ATTENTION_MINUTES, FLEET_MODES, ACTION_LIMIT, alarmActions(), biggestLoss(), buildActions(), expiryAlert(), fleetActions() (+23 more)

### Community 54 - "useTableSort"
Cohesion: 0.12
Nodes (54): Decision, ConfirmModal(), ARIA_SORT, SortableHead(), TableNoResults(), pageItems(), TablePagination(), PAGE_SIZES (+46 more)

### Community 55 - "Add / edit branch"
Cohesion: 0.29
Nodes (7): Add / edit branch, API calls on this page, Decisions, On page load, Shared components used, State & storage, UI states

### Community 56 - "UserGuide.jsx"
Cohesion: 0.18
Nodes (18): navLinks(), NUMBERED_STEPS, OpenLink(), SectionCard(), SECTIONS, SetupStep(), textOf(), UserGuide() (+10 more)

### Community 57 - "ModeReasonModal.jsx"
Cohesion: 0.11
Nodes (36): Add a downtime or idle reason, API calls on this page, Change the Machine Modes period, Decisions, Live updates, Productivity, Shared components used, State & storage (+28 more)

### Community 58 - "ModelFormModal.jsx"
Cohesion: 0.15
Nodes (19): API calls on this page, Decisions, Delete model, Machine models, Save model (add / edit form), Shared components used, State & storage, UI states (+11 more)

### Community 59 - "AddBranch.jsx"
Cohesion: 0.19
Nodes (16): BRANCH_STATUS, AddBranch(), labelClass(), branchSchema, COLOR_PICKER_FALLBACK, INITIAL_VALUES, optional(), REQUIRED_FIELDS (+8 more)

### Community 60 - "0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page"
Cohesion: 0.40
Nodes (5): 0014. Business Setup renamed Account Center; old Account Center item removed, Alternatives considered, Consequences, Context, Decision

### Community 61 - "SidebarProvider.jsx"
Cohesion: 0.18
Nodes (13): BREAKPOINTS, SidebarContext, SidebarProvider(), useMediaQuery(), Login(), redirectTarget(), CENTER, LoginBackdrop() (+5 more)

### Community 62 - "States"
Cohesion: 0.20
Nodes (10): API calls on this page, Decisions, Delete user state, Save user state (add / edit form), Shared components used, State & storage, States, UI states (+2 more)

### Community 63 - "pages.jsx"
Cohesion: 0.10
Nodes (21): byBrandThenName(), byName(), ControllerList(), matchesSearch(), REASON_KIND, About, AddCustomer, AddMachine (+13 more)

### Community 64 - "LicenceKeyGenerator.jsx"
Cohesion: 0.07
Nodes (43): API calls on this page, Decisions, Delete licence key, Generate licence keys, Licence keys, On page load, Save licence key (add / edit form), Save licence keys (add / edit form) (+35 more)

### Community 65 - "Clientele"
Cohesion: 0.29
Nodes (7): API calls on this page, Clientele, Decisions, Delete clientele, Shared components used, State & storage, UI states

### Community 66 - "0008. Folder structure by page and by concern"
Cohesion: 0.33
Nodes (5): 0008. Folder structure by page and by concern, Alternatives considered, Consequences, Context, Decision

### Community 67 - "0023. One list, row and form for the name-under-a-parent organization levels"
Cohesion: 0.40
Nodes (4): 0023. One list, row and form for the name-under-a-parent organization levels, Alternatives considered, Consequences, Context

### Community 68 - "BreakFormModal.jsx"
Cohesion: 0.13
Nodes (23): Save break (add / edit form), ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, HOLIDAY_TYPES, SHIFT_STATUS, WEEKDAYS, breakSchema, INITIAL_VALUES (+15 more)

### Community 69 - "0006. React-Bootstrap with SCSS design tokens"
Cohesion: 0.33
Nodes (5): 0006. React-Bootstrap with SCSS design tokens, Alternatives considered, Consequences, Context, Decision

### Community 70 - "ModelList.jsx"
Cohesion: 0.48
Nodes (6): byBrandControllerName(), compareText(), matchesSearch(), ModelList(), ModelList, deleteModel()

### Community 71 - "Home.jsx"
Cohesion: 0.22
Nodes (17): Decision, customerOptionLabel(), dayTitle, Home(), TimeCard(), AlarmsCard(), AttentionCard(), HomeTable() (+9 more)

### Community 72 - "AccountCenterPage.jsx"
Cohesion: 0.21
Nodes (13): Decision, isAlsoActive(), linkClass(), navLeafShape, SidebarItem(), ACCOUNT_CENTER_PATHS, ACCOUNT_CENTER_TABS, AccountCenterPage() (+5 more)

### Community 73 - "BrandFormModal.jsx"
Cohesion: 0.14
Nodes (18): API calls on this page, Brands, Decisions, Delete brand, On page load, Save brand (add / edit form), Shared components used, State & storage (+10 more)

### Community 74 - "0012. Monitoring: Productivity and Machine Health on one tabbed page"
Cohesion: 0.40
Nodes (5): 0012. Monitoring: Productivity and Machine Health on one tabbed page, Alternatives considered, Consequences, Context, Decision

### Community 75 - "Loader"
Cohesion: 0.21
Nodes (12): Consequences, Loader(), MANAGERS, HolidaySetup(), matchesSearch(), TYPE_FILTERS, OrganizationPage(), ShiftSetup() (+4 more)

### Community 76 - "0013. Monitoring starts with a machine list; All Machines is set-up only"
Cohesion: 0.40
Nodes (5): 0013. Monitoring starts with a machine list; All Machines is set-up only, Alternatives considered, Consequences, Context, Decision

### Community 77 - "0003. Server state via service modules and useLoad, Context only for the session"
Cohesion: 0.40
Nodes (4): 0003. Server state via service modules and useLoad, Context only for the session, Alternatives considered, Consequences, Context

### Community 78 - "userLocationService.js"
Cohesion: 0.20
Nodes (11): API calls on this page, Decisions, Delete user location, Locations, Save user location (add / edit form), Shared components used, State & storage, UI states (+3 more)

### Community 79 - "ShiftFormModal.jsx"
Cohesion: 0.25
Nodes (14): clock(), EMPTY_BREAK_ROW, INITIAL_VALUES, MAX_BREAKS, MAX_LENGTH, offset(), shiftSchema(), toFormValues() (+6 more)

### Community 80 - "theme.js"
Cohesion: 0.22
Nodes (14): @/assets/scss/theme-light.scss?inline, DEFAULT_THEME, THEME, useTheme(), applyTheme(), chooseTheme(), forceTheme(), getStoredTheme() (+6 more)

### Community 81 - "0022. Ponytail plugin for Claude Code, under this repo's rules"
Cohesion: 0.33
Nodes (5): 0022. Ponytail plugin for Claude Code, under this repo's rules, Alternatives considered, Consequences, Context, Decision

### Community 83 - "0024. Operations Center: a second dashboard beside Home, on the existing APIs"
Cohesion: 0.40
Nodes (4): 0024. Operations Center: a second dashboard beside Home, on the existing APIs, Alternatives considered, Consequences, Context

### Community 84 - "userLineService.js"
Cohesion: 0.18
Nodes (12): API calls on this page, Decisions, Delete user line, Lines, On page load, Save user line (add / edit form), Shared components used, State & storage (+4 more)

### Community 85 - "0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before"
Cohesion: 0.40
Nodes (4): 0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before, Alternatives considered, Consequences, Context

### Community 86 - "0007. Recharts for charts, plain SVG for the Gantt"
Cohesion: 0.40
Nodes (4): 0007. Recharts for charts, plain SVG for the Gantt, Alternatives considered, Consequences, Context

### Community 87 - "Home (Dashboard)"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Home (Dashboard), On page load, Pick another day or customer, State & storage, UI states

### Community 88 - "0019. Monitoring: machine list, then the machine's tabs with a back arrow"
Cohesion: 0.50
Nodes (4): 0019. Monitoring: machine list, then the machine's tabs with a back arrow, Alternatives considered, Consequences, Context

### Community 89 - "0005. Forms with react-hook-form and zod"
Cohesion: 0.33
Nodes (5): 0005. Forms with react-hook-form and zod, Alternatives considered, Consequences, Context, Decision

### Community 90 - "getUsers"
Cohesion: 0.17
Nodes (16): On page load, @hookform/resolvers, CUSTOMER_ROLE_ID, ROLES, OrgUserProvider(), customerName(), loadCustomers(), INITIAL_VALUES (+8 more)

### Community 91 - "0009. Page-wise flow documentation in docs/pages"
Cohesion: 0.33
Nodes (5): 0009. Page-wise flow documentation in docs/pages, Alternatives considered, Consequences, Context, Decision

### Community 92 - "0004. Axios client with the HttpOnly session cookie"
Cohesion: 0.33
Nodes (5): 0004. Axios client with the HttpOnly session cookie, Alternatives considered, Consequences, Context, Decision

### Community 94 - "app.js"
Cohesion: 0.17
Nodes (17): ADR-0018, ROLE_LABELS, TOAST_DEFAULTS, USER_STATUS, isAccountOfKind(), customerMobile(), CustomerList(), matchesSearch() (+9 more)

### Community 96 - "Operations Center"
Cohesion: 0.20
Nodes (10): Action queue rules, API calls on this page, Change the date or the customer, Decisions, Operations Center, Rules & edge cases, Shared components used, State & storage (+2 more)

### Community 97 - "Monitoring (machine list)"
Cohesion: 0.22
Nodes (9): API calls on this page, Decisions, Monitoring (machine list), On page load, Open productivity / health, Rules & edge cases, Shared components used, State & storage (+1 more)

### Community 98 - "orgLevels.js"
Cohesion: 0.09
Nodes (26): API calls on this page, Cells, Decisions, Delete user cell, On page load, Save user cell (add / edit form), Shared components used, State & storage (+18 more)

### Community 99 - "0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page"
Cohesion: 0.40
Nodes (5): 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page, Alternatives considered, Consequences, Context, Decision

### Community 101 - "Topbar.jsx"
Cohesion: 0.24
Nodes (11): BrandLogo(), LOGO_MARKUP, Footer(), AppShell(), Sidebar(), displayName(), Topbar(), env (+3 more)

### Community 102 - "0020. Virtual Screen: one REST snapshot polled every 5 s"
Cohesion: 0.25
Nodes (5): 0020. Virtual Screen: one REST snapshot polled every 5 s, Alternatives considered, Consequences, Context, Decision

### Community 103 - "Customers / Users list"
Cohesion: 0.12
Nodes (17): API calls on this page, App shell (session, logout, theme), Decisions, On page load, Shared components used, State & storage, UI states, API calls on this page (+9 more)

### Community 105 - "Holidays / week off"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete holiday, Holidays / week off, On page load, Shared components used, State & storage, UI states

### Community 107 - "Production schedules"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete production schedule, On page load, Production schedules, Shared components used, State & storage, UI states

### Community 108 - "Machine health"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Live updates, Machine health, On page load, Shared components used, State & storage, UI states

### Community 109 - "Supervisors"
Cohesion: 0.18
Nodes (13): API calls on this page, Decisions, Delete user supervisor, On page load, Save user supervisor (add / edit form), Shared components used, State & storage, Supervisors (+5 more)

### Community 110 - "Shops"
Cohesion: 0.20
Nodes (11): API calls on this page, Decisions, Delete user shop, Save user shop (add / edit form), Shared components used, Shops, State & storage, UI states (+3 more)

### Community 112 - "0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day"
Cohesion: 0.40
Nodes (4): 0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day, Alternatives considered, Consequences, Context

### Community 116 - "react-bootstrap"
Cohesion: 0.23
Nodes (17): Decision, react-bootstrap, STORAGE_KEYS, SUPERADMIN_ONLY, useAuth(), MachineBrowser(), matchesSearch(), MachineList() (+9 more)

### Community 118 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 119 - "0015. Clientele is a Masters page, not an Account Center tab"
Cohesion: 0.50
Nodes (4): 0015. Clientele is a Masters page, not an Account Center tab, Alternatives considered, Consequences, Context

### Community 122 - "0021. Virtual Screen: live values over Socket.IO, REST for derived data"
Cohesion: 0.50
Nodes (4): 0021. Virtual Screen: live values over Socket.IO, REST for derived data, Alternatives considered, Consequences, Context

### Community 127 - "Client documentation"
Cohesion: 0.40
Nodes (4): Client documentation, How to use Postman, How to view the API docs in Chrome (Swagger UI), How to view the page flow docs

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **22 isolated node(s):** `bootstrap`, `@types/react`, `@types/react-dom`, `eslint`, `sass` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 503 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `OperationsCenter.jsx`, `BarLineChart.jsx`, `Productivity.jsx`, `modeTypeOf`, `dateTime.js`, `MachineDiagnostics.jsx`, `AddPart.jsx`, `IntelligencePanels.jsx`, `chartTheme.js`, `AddProductionSchedule.jsx`, `useMachineLive`, `TimePicker.jsx`, `AddCustomer.jsx`, `package.json`, `toast`, `ControllerFormModal.jsx`, `healthSensors.js`, `App.jsx`, `VirtualScreen.jsx`, `OpsFloorMap.jsx`, `AddMachine.jsx`, `AuthProvider.jsx`, `OpsPanels.jsx`, `useTableSort`, `UserGuide.jsx`, `ModeReasonModal.jsx`, `ModelFormModal.jsx`, `AddBranch.jsx`, `SidebarProvider.jsx`, `pages.jsx`, `LicenceKeyGenerator.jsx`, `BreakFormModal.jsx`, `ModelList.jsx`, `Home.jsx`, `AccountCenterPage.jsx`, `BrandFormModal.jsx`, `Loader`, `ShiftFormModal.jsx`, `theme.js`, `getUsers`, `app.js`, `Topbar.jsx`, `react-bootstrap`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Are the 23 inferred relationships involving `useAuth()` (e.g. with `State & storage` and `State & storage`) actually correct?**
  _`useAuth()` has 23 INFERRED edges - model-reasoned connections that need verification._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `OperationsCenter.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13847780126849896 - nodes in this community are weakly interconnected._
- **Why does `ProtectedRoute()` connect `ProtectedRoute` to `machineFilter.js`, `Add / edit part`, `MachineDiagnostics.jsx`, `intelligenceSettings.js`, `Breaks`, `Tool List and Tool Life (machine tabs)`, `toast`, `ControllerFormModal.jsx`, `Customers / Users list`, `All machines`, `0002. React Router with one route table and role guards`, `VirtualScreen.jsx`, `Branches`, `Downtime / idle reasons`, `apiBaseUrl`, `Shifts`, `User guide`, `Add / edit branch`, `ModeReasonModal.jsx`, `ModelFormModal.jsx`, `States`, `LicenceKeyGenerator.jsx`, `Clientele`, `BrandFormModal.jsx`, `Loader`, `userLocationService.js`, `userLineService.js`, `Home (Dashboard)`, `Operations Center`, `Monitoring (machine list)`, `orgLevels.js`, `Customers / Users list`, `Holidays / week off`, `Production schedules`, `Machine health`, `Supervisors`, `Shops`, `react-bootstrap`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Should `machineFilter.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12333333333333334 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._