# Graph Report - 7th-sense-client  (2026-11-17)

## Corpus Check
- 376 files · ~224,964 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 2359 nodes · 8172 edges · 135 communities (134 shown, 1 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 578 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7a75faab`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react-bootstrap
- AddCustomer.jsx
- BarLineChart.jsx
- liveSocket.js
- Productivity.jsx
- formatDate
- AddPart
- CountryFormModal.jsx
- Parts
- Project Docs & Conventions
- Operator tasks
- MachineDiagnostics.jsx
- AddPart.jsx
- customerName
- customerForm.js
- AddProductionSchedule.jsx
- healthSampleData.js
- Runtime Dependencies
- intelligenceSettings.js
- Breaks
- 0001. Single-page app with React 19 and Vite
- withQuery
- App.jsx
- 0016. Account Center is superadmin only; Users lists company members only
- devDependencies
- jsconfig Aliases
- routes.js
- TimePicker.jsx
- ClienteleFormModal.jsx
- package.json
- authService.js
- UserGuide.jsx
- Login Logo Asset
- Login.jsx
- pages.jsx
- 0024. Operations Center: a second dashboard beside Home, on the existing APIs
- ControllerFormModal.jsx
- Customer / user detail
- All machines
- healthSensors.js
- modeTypeOf
- userCityService.js
- VirtualScreen.jsx
- vite.config.js
- App shell (session, logout, theme)
- adr/README.md
- Downtime / idle reasons
- OperationsCenter.jsx
- AddMachine.jsx
- react
- userStateService.js
- Shifts
- User guide
- OpsPanels.jsx
- react-bootstrap
- ProtectedRoute
- OperatorTaskForm.jsx
- ModeReasonModal.jsx
- ModelFormModal.jsx
- AddBranch.jsx
- apiBaseUrl
- toast.js
- VirtualScreenParts.jsx
- StateFormModal.jsx
- LicenceKeyGenerator.jsx
- 0021. Virtual Screen: live values over Socket.IO, REST for derived data
- 0008. Folder structure by page and by concern
- Productivity
- HolidayFormModal.jsx
- 0006. React-Bootstrap with SCSS design tokens
- UserSessions.jsx
- AuthProvider.jsx
- Countries
- BrandFormModal.jsx
- dateTime.js
- IntelligencePanels.jsx
- My sessions
- 0003. Server state via service modules and useLoad, Context only for the session
- Home (Dashboard)
- ShiftFormModal.jsx
- theme.js
- 0022. Ponytail plugin for Claude Code, under this repo's rules
- Brands
- 0010. Organization levels on one tabbed page, a route per tab
- userLineService.js
- Machine health
- ModelList.jsx
- HomeCards.jsx
- customerName
- 0005. Forms with react-hook-form and zod
- CustomerList.jsx
- 0009. Page-wise flow documentation in docs/pages
- 0012. Monitoring: Productivity and Machine Health on one tabbed page
- Customers / Users list
- helpers.js
- userLocationService.js
- Operations Center
- Monitoring (machine list)
- orgLevels.js
- 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page
- 0014. Business Setup renamed Account Center; old Account Center item removed
- Holidays / week off
- 0020. Virtual Screen: one REST snapshot polled every 5 s
- MainLayout
- 0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before
- formatClock12
- operatorScheduleSettings.js
- Add / edit branch
- unwrap
- 0013. Monitoring starts with a machine list; All Machines is set-up only
- userShopService.js
- Decision
- 0023. One list, row and form for the name-under-a-parent organization levels
- Operator wise production schedule
- Production schedules
- OperatorTaskRow.jsx
- Tool List and Tool Life (machine tabs)
- Branches
- scripts
- validators.js
- ReasonFormModal.jsx
- Clientele
- PlannedTab.jsx
- Controllers
- Machine models
- Add / edit production schedule
- 0007. Recharts for charts, plain SVG for the Gantt
- Client documentation
- 0018. Log in as customer opens the dashboard directly (no /login-as page)
- Add / edit customer or user
- 0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day
- Add / edit machine
- Theme showcase
- countryLibrary.js
- 7th Sense Logo (seven-logo.svg)

## God Nodes (most connected - your core abstractions)
1. `react` - 140 edges
2. `prop-types` - 120 edges
3. `react-bootstrap` - 108 edges
4. `unwrap()` - 108 edges
5. `useAuth()` - 92 edges
6. `Loader()` - 89 edges
7. `withQuery()` - 82 edges
8. `sharedGet()` - 72 edges
9. `ProtectedRoute()` - 57 edges
10. `unwrapList()` - 55 edges

## Surprising Connections (you probably didn't know these)
- `Decision` --references--> `ModeGanttChart()`  [INFERRED]
  docs/adr/0007-recharts-for-charts.md → src/components/charts/ModeGanttChart.jsx
- `Log out one session` --references--> `ConfirmModal()`  [INFERRED]
  docs/pages/my-sessions.md → src/components/common/ConfirmModal.jsx
- `Delete operator task` --references--> `ConfirmModal()`  [INFERRED]
  docs/pages/operator-tasks.md → src/components/common/ConfirmModal.jsx
- `Delete task / Make inactive` --references--> `ConfirmModal()`  [INFERRED]
  docs/pages/task-list.md → src/components/common/ConfirmModal.jsx
- `Log out one session / Log out all` --references--> `ConfirmModal()`  [INFERRED]
  docs/pages/user-sessions.md → src/components/common/ConfirmModal.jsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project convention documents (CLAUDE.md, frontend skills, THEME, README)** — claude, 7th_sense_frontend_skills, theme, readme [EXTRACTED 1.00]
- **Customer-scoped master data with role-based access** — claude_masters_customer_pattern, claude_role_based_access, claude_production_schedule, claude_licence_keys, claude_shifts_breaks [INFERRED 0.85]
- **Dark/light dual theme system** — theme_design_tokens, theme_light_theme_second_build, theme_theme_switching, 7thsense_ui_review [INFERRED 0.85]

## Communities (135 total, 1 thin omitted)

### Community 0 - "react-bootstrap"
Cohesion: 0.17
Nodes (27): react-bootstrap, CUSTOMER_ROLE_ID, MANAGERS, PAGE_SIZES, ROLES, SUPERADMIN_ONLY, OrgUserProvider(), useAuth() (+19 more)

### Community 1 - "AddCustomer.jsx"
Cohesion: 0.13
Nodes (36): On page load, Choose the user's machines (Access card), On page load, Save user (add / edit form), ALL_MACHINE_ROLES, THEMES, AddCustomer(), FILTER_NAMES (+28 more)

### Community 2 - "BarLineChart.jsx"
Cohesion: 0.12
Nodes (52): recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), LEGEND_BOTTOM_PROPS, LEGEND_PROPS, axisPropTypes, renderGrid() (+44 more)

### Community 3 - "liveSocket.js"
Cohesion: 0.14
Nodes (33): useMachineLive(), applyAnswer(), applyStatus(), applyValues(), checkSession(), connectionListeners, disconnectLive(), EMPTY_STATE (+25 more)

### Community 4 - "Productivity.jsx"
Cohesion: 0.08
Nodes (45): MultiSelectPicker(), summary(), toGroups(), useLoad(), ModeTimelineCard(), readoutClock, readoutTime, chartMessage() (+37 more)

### Community 5 - "formatDate"
Cohesion: 0.18
Nodes (20): IconAction(), StatusBadge(), BranchRow(), BrandRow(), BreakRow(), ClienteleRow(), ControllerRow(), HolidayRow() (+12 more)

### Community 6 - "AddPart"
Cohesion: 0.15
Nodes (15): Add / edit part, API calls on this page, Decisions, Save part (add / edit form), Shared components used, State & storage, UI states, Upload part drawing (+7 more)

### Community 7 - "CountryFormModal.jsx"
Cohesion: 0.22
Nodes (15): OrgCustomerField(), countrySchema, INITIAL_VALUES, toCountryPayloads(), CountryFormModal(), NOUN, sameName(), OrgLevelFormModal() (+7 more)

### Community 8 - "Parts"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, Delete part, On page load, Parts, Shared components used, State & storage, UI states

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "Operator tasks"
Cohesion: 0.10
Nodes (19): API calls on this page, Decisions, Delete operator task, New task (add to the task list), On page load, Operator tasks, Save operator task (add / edit form), Shared components used (+11 more)

### Community 11 - "MachineDiagnostics.jsx"
Cohesion: 0.09
Nodes (37): ADR-0013, API calls on this page, Decisions, Machine diagnostics, On page load, Shared components used, State & storage, The checks (+29 more)

### Community 12 - "AddPart.jsx"
Cohesion: 0.11
Nodes (29): react-hook-form, zod, MachinePicker(), summary(), DRAWING_RULES, EMPTY_PROCESS, EMPTY_SUB_PROGRAM, INITIAL_VALUES (+21 more)

### Community 13 - "customerName"
Cohesion: 0.26
Nodes (11): Save break (add / edit form), BREAK_NAME_SUGGESTIONS, breakSchema, INITIAL_VALUES, MAX_LENGTH, toBreakPayload(), toFormValues(), BreakFormModal() (+3 more)

### Community 14 - "customerForm.js"
Cohesion: 0.25
Nodes (15): getCountryName(), getDialCode(), getStateName(), toClientelePayload(), nullIfBlank(), REQUIRED_FIELDS, savedLogoPath(), splitName() (+7 more)

### Community 15 - "AddProductionSchedule.jsx"
Cohesion: 0.12
Nodes (26): Save production schedule (add / edit form), AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel(), EMPTY_ITEM, idText() (+18 more)

### Community 16 - "healthSampleData.js"
Cohesion: 0.14
Nodes (23): MACHINE_MODES, buildDay(), dailyRows(), dayLabel, dayLoad(), dayStates(), dayWindow(), hourLabel (+15 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+9 more)

### Community 18 - "intelligenceSettings.js"
Cohesion: 0.12
Nodes (31): addModeSeconds(), alarmRows(), analyse(), availabilityTrend(), buildInsights(), chronicAlarm(), cycleLeaders(), dayLabelFormat (+23 more)

### Community 19 - "Breaks"
Cohesion: 0.25
Nodes (7): API calls on this page, Breaks, Decisions, Delete break, Shared components used, State & storage, UI states

### Community 20 - "0001. Single-page app with React 19 and Vite"
Cohesion: 0.33
Nodes (5): 0001. Single-page app with React 19 and Vite, Alternatives considered, Consequences, Context, Decision

### Community 21 - "withQuery"
Cohesion: 0.13
Nodes (33): Decision, On page load, On page load, On page load, On page load, On page load, On page load, sharedGet() (+25 more)

### Community 22 - "App.jsx"
Cohesion: 0.39
Nodes (6): App(), Toaster(), ICONS, ToastItem(), getToasts(), subscribeToasts()

### Community 23 - "0016. Account Center is superadmin only; Users lists company members only"
Cohesion: 0.40
Nodes (5): 0016. Account Center is superadmin only; Users lists company members only, Alternatives considered, Consequences, Context, Decision

### Community 24 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "routes.js"
Cohesion: 0.14
Nodes (20): ADR-0018, Decision, react-router-dom, STORAGE_KEYS, machineMonitorPath(), MONITOR_REFRESH_MS, MONITORING_MACHINE_TABS, MONITORING_SEARCH_PARAM (+12 more)

### Community 27 - "TimePicker.jsx"
Cohesion: 0.13
Nodes (20): assignRef(), PickerField(), POPPER_CONFIG, centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel() (+12 more)

### Community 28 - "ClienteleFormModal.jsx"
Cohesion: 0.14
Nodes (24): Save clientele (add / edit form), COUNTRIES, DEFAULT_COUNTRY, DEFAULT_TIME_ZONE, ENABLED_COUNTRIES, getCountryCode(), getStateCode(), getStates() (+16 more)

### Community 29 - "package.json"
Cohesion: 0.12
Nodes (17): name, private, type, version, axios, bootstrap, eslint, @eslint/js (+9 more)

### Community 30 - "authService.js"
Cohesion: 0.22
Nodes (9): API calls on this page, Decisions, Log out other device and continue (conflict modal), Login, Shared components used, State & storage, Submit login form, UI states (+1 more)

### Community 31 - "UserGuide.jsx"
Cohesion: 0.06
Nodes (44): Consequences, 0015. Clientele is a Masters page, not an Account Center tab, Alternatives considered, Consequences, Context, Decision, InfoTooltip(), isAlsoActive() (+36 more)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "Login.jsx"
Cohesion: 0.17
Nodes (15): BrandLogo(), LOGO_MARKUP, displayName(), Topbar(), env, LANGUAGES, Login(), redirectTarget() (+7 more)

### Community 34 - "pages.jsx"
Cohesion: 0.09
Nodes (20): REASON_KIND, About, AddCustomer, AddPart, AddProductionSchedule, BreakSetup, ClienteleList, CustomerView (+12 more)

### Community 35 - "0024. Operations Center: a second dashboard beside Home, on the existing APIs"
Cohesion: 0.40
Nodes (4): 0024. Operations Center: a second dashboard beside Home, on the existing APIs, Alternatives considered, Consequences, Context

### Community 36 - "ControllerFormModal.jsx"
Cohesion: 0.29
Nodes (10): Save controller (add / edit form), controllerSchema, INITIAL_VALUES, MAX_LENGTH, toControllerPayload(), toFormValues(), ControllerFormModal(), FIELD_HELP (+2 more)

### Community 37 - "Customer / user detail"
Cohesion: 0.18
Nodes (11): Change theme, API calls on this page, Change theme, Customer / user detail, Decisions, Shared components used, State & storage, UI states (+3 more)

### Community 38 - "All machines"
Cohesion: 0.22
Nodes (9): All machines, API calls on this page, Decisions, Delete machine, Edit machine, On page load, Shared components used, State & storage (+1 more)

### Community 39 - "healthSensors.js"
Cohesion: 0.09
Nodes (34): niceTicks(), STEP_MULTIPLES, pointsInRange(), sensorDay(), clock, clockSeconds, dayClock, DEFAULT_RANGE (+26 more)

### Community 40 - "modeTypeOf"
Cohesion: 0.17
Nodes (22): clockMinutes, clockWithSeconds, ModeGanttChart(), TICK_STEPS, ticksFor(), MACHINE_MODE_TYPES, MACHINE_STATUS, modeTypeOf() (+14 more)

### Community 41 - "userCityService.js"
Cohesion: 0.16
Nodes (13): API calls on this page, Cities, Decisions, Delete user city, On page load, Save user city (add / edit form), Shared components used, State & storage (+5 more)

### Community 42 - "VirtualScreen.jsx"
Cohesion: 0.09
Nodes (41): What the screen shows, ADR-0009, ADR-0021, LIVE_CHANNELS, LIVE_CODES, LIVE_INTERVAL_MS, LIVE_RELOAD_EVENTS, formatCycle() (+33 more)

### Community 43 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 44 - "App shell (session, logout, theme)"
Cohesion: 0.18
Nodes (11): API calls on this page, App shell (session, logout, theme), Click Log out, Decisions, On page load, Shared components used, State & storage, UI states (+3 more)

### Community 46 - "Downtime / idle reasons"
Cohesion: 0.16
Nodes (19): API calls on this page, Decisions, Delete downtime reason, Delete idle reason, Downtime / idle reasons, On page load, Save downtime reason (add / edit form), Save idle reason (add / edit form) (+11 more)

### Community 47 - "OperationsCenter.jsx"
Cohesion: 0.12
Nodes (44): Decision, On page load, Findings, On page load, Shared components used, What the screen shows, ChartCard(), chartMessage() (+36 more)

### Community 48 - "AddMachine.jsx"
Cohesion: 0.10
Nodes (34): CONTROLLER_VERSION_TYPES, MACHINE_ACCURACIES, MACHINE_HEALTH_ALL, MACHINE_HEALTH_SENSORS, MACHINE_SYSTEM_TYPES, SECURITY_MODES, AddMachine(), byName() (+26 more)

### Community 49 - "react"
Cohesion: 0.33
Nodes (5): prop-types, react, ACTION_ICONS, checkDrawing, DrawingUpload()

### Community 50 - "userStateService.js"
Cohesion: 0.16
Nodes (12): API calls on this page, Decisions, Delete user state, On page load, Save user state (add / edit form), Shared components used, State & storage, States (+4 more)

### Community 51 - "Shifts"
Cohesion: 0.25
Nodes (7): API calls on this page, Decisions, Delete shift, Shared components used, Shifts, State & storage, UI states

### Community 52 - "User guide"
Cohesion: 0.22
Nodes (8): Decisions, On page load, Rules & edge cases, Sections, Shared components used, State & storage, UI states, User guide

### Community 53 - "OpsPanels.jsx"
Cohesion: 0.12
Nodes (30): KpiTile(), FLEET_MODES, ACTION_LIMIT, alarmActions(), biggestLoss(), buildActions(), expiryAlert(), fleetActions() (+22 more)

### Community 54 - "react-bootstrap"
Cohesion: 0.12
Nodes (47): Decision, UI states, UI states, Loader(), ARIA_SORT, SortableHead(), TableNoResults(), pageItems() (+39 more)

### Community 55 - "ProtectedRoute"
Cohesion: 0.07
Nodes (29): 0002. React Router with one route table and role guards, Alternatives considered, Consequences, Context, Decision, About, Decisions, State & storage (+21 more)

### Community 56 - "OperatorTaskForm.jsx"
Cohesion: 0.17
Nodes (23): OperatorTaskEditor(), findTask(), groupModels(), INITIAL_VALUES, normalise(), operatorTaskSchema, REQUIRED_FIELDS, TASK_MAX_LENGTH (+15 more)

### Community 57 - "ModeReasonModal.jsx"
Cohesion: 0.18
Nodes (24): Add a downtime or idle reason, clockFormat, dateValue(), dayFormat, firstFreeSpan(), floorMinute(), formatClock(), formatDay() (+16 more)

### Community 58 - "ModelFormModal.jsx"
Cohesion: 0.26
Nodes (12): Save model (add / edit form), ControllerOptions(), groupByBrand(), INITIAL_VALUES, modelSchema, NAME_MAX_LENGTH, toFormValues(), toModelPayload() (+4 more)

### Community 59 - "AddBranch.jsx"
Cohesion: 0.13
Nodes (25): Save branch (add / edit form), Save branch (add / edit form), State & storage, State & storage, BRANCH_STATUS, useOrgUser(), AddBranch(), labelClass() (+17 more)

### Community 60 - "apiBaseUrl"
Cohesion: 0.12
Nodes (16): 0017. Log in as customer in a new tab, on the tab's own API path, Alternatives considered, Consequences, Context, Decision, API calls on this page, Decisions, Live values (Socket.IO) (+8 more)

### Community 61 - "toast.js"
Cohesion: 0.21
Nodes (14): TOAST_DEFAULTS, matchesSearch(), ProductionScheduleList(), scheduleDates(), ProductionScheduleList, deleteProductionSchedule(), dismiss(), emit() (+6 more)

### Community 62 - "VirtualScreenParts.jsx"
Cohesion: 0.14
Nodes (6): SPINDLE_LOAD, BAR, DIAL, LOAD_GAUGE, STRIP, STRIP_LAYOUTS

### Community 63 - "StateFormModal.jsx"
Cohesion: 0.29
Nodes (11): fromStateKey(), INITIAL_VALUES, keepStatesOf(), stateSchema, toStateKey(), toStatePayloads(), COUNTRY_NOUN, NOUN (+3 more)

### Community 64 - "LicenceKeyGenerator.jsx"
Cohesion: 0.07
Nodes (41): API calls on this page, Decisions, Delete licence key, Generate licence keys, Licence keys, On page load, Save licence key (add / edit form), Save licence keys (add / edit form) (+33 more)

### Community 65 - "0021. Virtual Screen: live values over Socket.IO, REST for derived data"
Cohesion: 0.17
Nodes (12): 0021. Virtual Screen: live values over Socket.IO, REST for derived data, Alternatives considered, Consequences, Context, Decision, 0027. Session message codes worded on the client, and a conflict modal at login, Alternatives considered, Consequences (+4 more)

### Community 66 - "0008. Folder structure by page and by concern"
Cohesion: 0.33
Nodes (5): 0008. Folder structure by page and by concern, Alternatives considered, Consequences, Context, Decision

### Community 67 - "Productivity"
Cohesion: 0.25
Nodes (8): API calls on this page, Change the Machine Modes period, Decisions, Live updates, Productivity, Shared components used, State & storage, UI states

### Community 68 - "HolidayFormModal.jsx"
Cohesion: 0.21
Nodes (15): Save holiday (add / edit form), HOLIDAY_TYPES, SHIFT_STATUS, WEEKDAYS, holidaySchema, INITIAL_VALUES, MAX_LENGTH, toFormValues() (+7 more)

### Community 69 - "0006. React-Bootstrap with SCSS design tokens"
Cohesion: 0.33
Nodes (5): 0006. React-Bootstrap with SCSS design tokens, Alternatives considered, Consequences, Context, Decision

### Community 70 - "UserSessions.jsx"
Cohesion: 0.27
Nodes (12): ConfirmModal(), ADR-0014, MySessions(), ADR-0014, UserSessions(), getMySessions(), getUserSessions(), ADR-0014 (+4 more)

### Community 71 - "AuthProvider.jsx"
Cohesion: 0.11
Nodes (20): ADR-0027, 0004. Axios client with the HttpOnly session cookie, Alternatives considered, Consequences, Context, Decision, Session ended, isSessionEnded() (+12 more)

### Community 72 - "Countries"
Cohesion: 0.20
Nodes (9): API calls on this page, Countries, Decisions, Delete user country, On page load, Save user country (add / edit form), Shared components used, State & storage (+1 more)

### Community 73 - "BrandFormModal.jsx"
Cohesion: 0.27
Nodes (10): FieldLabel(), brandSchema, INITIAL_VALUES, MAX_LENGTH, toBrandPayload(), toFormValues(), BrandFormModal(), FIELD_HELP (+2 more)

### Community 74 - "dateTime.js"
Cohesion: 0.12
Nodes (38): ChartDateFilter(), clamp(), DateCalendar(), DatePicker(), dayLabel, keyToDay(), monthGrid(), monthName (+30 more)

### Community 75 - "IntelligencePanels.jsx"
Cohesion: 0.15
Nodes (20): Decision, NoResults(), monitoringSearchPath(), scoreTone(), Change(), ExecutiveSummaryCard(), lastSeenLabel, Sparkline() (+12 more)

### Community 76 - "My sessions"
Cohesion: 0.12
Nodes (15): API calls on this page, Decisions, Log out all other sessions, Log out one session, My sessions, On page load, Shared components used, State & storage (+7 more)

### Community 77 - "0003. Server state via service modules and useLoad, Context only for the session"
Cohesion: 0.40
Nodes (4): 0003. Server state via service modules and useLoad, Context only for the session, Alternatives considered, Consequences, Context

### Community 78 - "Home (Dashboard)"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Home (Dashboard), On page load, Pick another day or customer, State & storage, UI states

### Community 79 - "ShiftFormModal.jsx"
Cohesion: 0.23
Nodes (15): ALL_WEEKDAYS, SHIFT_TYPES, clock(), EMPTY_BREAK_ROW, INITIAL_VALUES, MAX_BREAKS, MAX_LENGTH, offset() (+7 more)

### Community 80 - "theme.js"
Cohesion: 0.18
Nodes (17): bootstrap-icons, @fontsource-variable/roboto, react-dom, @/assets/scss/theme-light.scss?inline, DEFAULT_THEME, THEME, useTheme(), applyTheme() (+9 more)

### Community 81 - "0022. Ponytail plugin for Claude Code, under this repo's rules"
Cohesion: 0.33
Nodes (5): 0022. Ponytail plugin for Claude Code, under this repo's rules, Alternatives considered, Consequences, Context, Decision

### Community 82 - "Brands"
Cohesion: 0.22
Nodes (9): API calls on this page, Brands, Decisions, Delete brand, On page load, Save brand (add / edit form), Shared components used, State & storage (+1 more)

### Community 83 - "0010. Organization levels on one tabbed page, a route per tab"
Cohesion: 0.40
Nodes (4): 0010. Organization levels on one tabbed page, a route per tab, Alternatives considered, Context, Decision

### Community 84 - "userLineService.js"
Cohesion: 0.18
Nodes (11): API calls on this page, Decisions, Delete user line, Lines, Save user line (add / edit form), Shared components used, State & storage, UI states (+3 more)

### Community 85 - "Machine health"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Live updates, Machine health, On page load, Shared components used, State & storage, UI states

### Community 86 - "ModelList.jsx"
Cohesion: 0.16
Nodes (23): On page load, On page load, On page load, BrandList(), byName(), matchesSearch(), byBrandThenName(), byName() (+15 more)

### Community 87 - "HomeCards.jsx"
Cohesion: 0.09
Nodes (48): Decision, Rules & edge cases, Shared components used, customerOptionLabel(), dayTitle, Home(), DayCard(), FleetCard() (+40 more)

### Community 88 - "customerName"
Cohesion: 0.29
Nodes (8): ROLE_LABELS, USER_STATUS, ACCOUNT_KIND, ACCOUNT_PAGES, customerMobile(), customerName(), matchesSearch(), CustomerRow()

### Community 89 - "0005. Forms with react-hook-form and zod"
Cohesion: 0.33
Nodes (5): 0005. Forms with react-hook-form and zod, Alternatives considered, Consequences, Context, Decision

### Community 90 - "CustomerList.jsx"
Cohesion: 0.33
Nodes (6): OrgUserContext, isAccountOfKind(), CustomerList(), CustomerList, deleteUser(), loginAsUrl()

### Community 91 - "0009. Page-wise flow documentation in docs/pages"
Cohesion: 0.33
Nodes (5): 0009. Page-wise flow documentation in docs/pages, Alternatives considered, Consequences, Context, Decision

### Community 92 - "0012. Monitoring: Productivity and Machine Health on one tabbed page"
Cohesion: 0.40
Nodes (5): 0012. Monitoring: Productivity and Machine Health on one tabbed page, Alternatives considered, Consequences, Context, Decision

### Community 93 - "Customers / Users list"
Cohesion: 0.22
Nodes (9): API calls on this page, Customers / Users list, Decisions, Delete user, Save user (add / edit form), Shared components used, State & storage, UI states (+1 more)

### Community 94 - "helpers.js"
Cohesion: 0.27
Nodes (9): LiveClock(), CLOCK_TICK_MS, LoginClock(), formatClockTime(), formatLongDate(), formatOrdinalDate(), formatTime12(), formatWeekday() (+1 more)

### Community 95 - "userLocationService.js"
Cohesion: 0.15
Nodes (14): API calls on this page, Decisions, Delete user location, Locations, On page load, Save user location (add / edit form), Shared components used, State & storage (+6 more)

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

### Community 100 - "0014. Business Setup renamed Account Center; old Account Center item removed"
Cohesion: 0.40
Nodes (5): 0014. Business Setup renamed Account Center; old Account Center item removed, Alternatives considered, Consequences, Context, Decision

### Community 101 - "Holidays / week off"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, Delete holiday, Holidays / week off, On page load, Shared components used, State & storage, UI states

### Community 102 - "0020. Virtual Screen: one REST snapshot polled every 5 s"
Cohesion: 0.40
Nodes (5): 0020. Virtual Screen: one REST snapshot polled every 5 s, Alternatives considered, Consequences, Context, Decision

### Community 103 - "MainLayout"
Cohesion: 0.27
Nodes (10): Footer(), AppShell(), MainLayout(), Sidebar(), BREAKPOINTS, SidebarContext, SidebarProvider(), useMediaQuery() (+2 more)

### Community 104 - "0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before"
Cohesion: 0.40
Nodes (4): 0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before, Alternatives considered, Consequences, Context

### Community 105 - "formatClock12"
Cohesion: 0.50
Nodes (8): Clock(), minutesBetween(), ShiftCard(), toMinutes(), typeLabel(), formatClock12(), formatHoursMinutes(), parseTime()

### Community 106 - "operatorScheduleSettings.js"
Cohesion: 0.49
Nodes (8): OperatorJobRow(), dateLabel(), EMPTY_FILTERS, filterOptions(), machineLabel(), matchesSearch(), partLabel(), periodLabel()

### Community 107 - "Add / edit branch"
Cohesion: 0.25
Nodes (7): Add / edit branch, API calls on this page, Decisions, On page load, Shared components used, State & storage, UI states

### Community 108 - "unwrap"
Cohesion: 0.16
Nodes (17): Save machine (add / edit form), Save shift (add / edit form), apiClient, pendingGets, unauthorizedListeners, unwrap(), getSession(), login() (+9 more)

### Community 109 - "0013. Monitoring starts with a machine list; All Machines is set-up only"
Cohesion: 0.40
Nodes (5): 0013. Monitoring starts with a machine list; All Machines is set-up only, Alternatives considered, Consequences, Context, Decision

### Community 110 - "userShopService.js"
Cohesion: 0.18
Nodes (11): API calls on this page, Decisions, Delete user shop, Save user shop (add / edit form), Shared components used, Shops, State & storage, UI states (+3 more)

### Community 111 - "Decision"
Cohesion: 0.50
Nodes (4): 0019. Monitoring: machine list, then the machine's tabs with a back arrow, Alternatives considered, Consequences, Context

### Community 112 - "0023. One list, row and form for the name-under-a-parent organization levels"
Cohesion: 0.40
Nodes (4): 0023. One list, row and form for the name-under-a-parent organization levels, Alternatives considered, Consequences, Context

### Community 113 - "Operator wise production schedule"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, On page load, Operator wise production schedule, Search (apply filters), Shared components used, State & storage, UI states

### Community 114 - "Production schedules"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, Delete production schedule, On page load, Production schedules, Shared components used, State & storage, UI states

### Community 115 - "OperatorTaskRow.jsx"
Cohesion: 0.70
Nodes (4): machineTypeDetail(), machineTypeLabel(), OperatorTaskRow(), matchesSearch()

### Community 116 - "Tool List and Tool Life (machine tabs)"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, On page load, Rules & edge cases, Shared components used, State & storage, Tool List and Tool Life (machine tabs), UI states

### Community 117 - "Branches"
Cohesion: 0.25
Nodes (7): API calls on this page, Branches, Decisions, Delete branch, On page load, Shared components used, UI states

### Community 118 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 119 - "validators.js"
Cohesion: 0.32
Nodes (7): fileRule(), isBlank(), matches(), PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PATTERNS, required()

### Community 120 - "ReasonFormModal.jsx"
Cohesion: 0.26
Nodes (10): StatusToggle(), INITIAL_VALUES, MAX_LENGTH, REASON_STATUS, reasonSchema, toFormValues(), toReasonPayload(), ReasonFormModal() (+2 more)

### Community 121 - "Clientele"
Cohesion: 0.29
Nodes (7): API calls on this page, Clientele, Decisions, Delete clientele, Shared components used, State & storage, UI states

### Community 122 - "PlannedTab.jsx"
Cohesion: 0.60
Nodes (3): PlannedTab(), ToolLife(), ToolList()

### Community 123 - "Controllers"
Cohesion: 0.29
Nodes (7): API calls on this page, Controllers, Decisions, Delete controller, Shared components used, State & storage, UI states

### Community 124 - "Machine models"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete model, Machine models, Shared components used, State & storage, UI states

### Community 125 - "Add / edit production schedule"
Cohesion: 0.29
Nodes (6): Add / edit production schedule, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 126 - "0007. Recharts for charts, plain SVG for the Gantt"
Cohesion: 0.33
Nodes (5): 0007. Recharts for charts, plain SVG for the Gantt, Alternatives considered, Consequences, Context, Decision

### Community 127 - "Client documentation"
Cohesion: 0.40
Nodes (4): Client documentation, How to use Postman, How to view the API docs in Chrome (Swagger UI), How to view the page flow docs

### Community 128 - "0018. Log in as customer opens the dashboard directly (no /login-as page)"
Cohesion: 0.33
Nodes (6): 0018. Log in as customer opens the dashboard directly (no /login-as page), Alternatives considered, Consequences, Context, Decision, takeLoginAsFromUrl()

### Community 129 - "Add / edit customer or user"
Cohesion: 0.33
Nodes (6): Add / edit customer or user, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 130 - "0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day"
Cohesion: 0.40
Nodes (4): 0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day, Alternatives considered, Consequences, Context

### Community 131 - "Add / edit machine"
Cohesion: 0.33
Nodes (6): Add / edit machine, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 132 - "Theme showcase"
Cohesion: 0.33
Nodes (5): Decisions, Shared components used, State & storage, Theme showcase, UI states

### Community 133 - "countryLibrary.js"
Cohesion: 0.40
Nodes (5): country-region-data, ALL_COUNTRIES, byName, findLibraryCountry(), getLibraryStateNames()

### Community 134 - "7th Sense Logo (seven-logo.svg)"
Cohesion: 0.67
Nodes (4): 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents)

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **32 isolated node(s):** `bootstrap`, `@types/react`, `@types/react-dom`, `eslint`, `sass` (+27 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 542 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProtectedRoute()` connect `ProtectedRoute` to `react-bootstrap`, `Add / edit customer or user`, `Add / edit machine`, `Theme showcase`, `AddPart`, `Parts`, `Operator tasks`, `MachineDiagnostics.jsx`, `Breaks`, `routes.js`, `Customer / user detail`, `All machines`, `userCityService.js`, `App shell (session, logout, theme)`, `Downtime / idle reasons`, `userStateService.js`, `Shifts`, `User guide`, `react-bootstrap`, `apiBaseUrl`, `LicenceKeyGenerator.jsx`, `Productivity`, `Countries`, `My sessions`, `Home (Dashboard)`, `Brands`, `userLineService.js`, `Machine health`, `Customers / Users list`, `userLocationService.js`, `Operations Center`, `Monitoring (machine list)`, `orgLevels.js`, `Holidays / week off`, `Add / edit branch`, `userShopService.js`, `Operator wise production schedule`, `Production schedules`, `Tool List and Tool Life (machine tabs)`, `Branches`, `Clientele`, `Controllers`, `Machine models`, `Add / edit production schedule`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **Are the 23 inferred relationships involving `useAuth()` (e.g. with `State & storage` and `State & storage`) actually correct?**
  _`useAuth()` has 23 INFERRED edges - model-reasoned connections that need verification._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _32 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AddCustomer.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1294871794871795 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `react-bootstrap`, `AddCustomer.jsx`, `BarLineChart.jsx`, `liveSocket.js`, `Productivity.jsx`, `CountryFormModal.jsx`, `MachineDiagnostics.jsx`, `AddPart.jsx`, `customerName`, `AddProductionSchedule.jsx`, `App.jsx`, `routes.js`, `TimePicker.jsx`, `ClienteleFormModal.jsx`, `package.json`, `UserGuide.jsx`, `Login.jsx`, `pages.jsx`, `ControllerFormModal.jsx`, `healthSensors.js`, `modeTypeOf`, `VirtualScreen.jsx`, `OperationsCenter.jsx`, `AddMachine.jsx`, `OpsPanels.jsx`, `react-bootstrap`, `ProtectedRoute`, `OperatorTaskForm.jsx`, `ModeReasonModal.jsx`, `ModelFormModal.jsx`, `AddBranch.jsx`, `toast.js`, `VirtualScreenParts.jsx`, `StateFormModal.jsx`, `LicenceKeyGenerator.jsx`, `HolidayFormModal.jsx`, `UserSessions.jsx`, `AuthProvider.jsx`, `BrandFormModal.jsx`, `dateTime.js`, `IntelligencePanels.jsx`, `ShiftFormModal.jsx`, `theme.js`, `ModelList.jsx`, `HomeCards.jsx`, `customerName`, `CustomerList.jsx`, `helpers.js`, `MainLayout`, `formatClock12`, `operatorScheduleSettings.js`, `OperatorTaskRow.jsx`, `ReasonFormModal.jsx`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Should `BarLineChart.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11561771561771562 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._