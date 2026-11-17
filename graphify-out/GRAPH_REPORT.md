# Graph Report - 7th-sense-client  (2026-11-17)

## Corpus Check
- 360 files · ~216,604 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 2267 nodes · 7788 edges · 113 communities (110 shown, 3 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 555 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8b8622a6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- OperationsCenter.jsx
- CustomerView.jsx
- BarLineChart.jsx
- liveSocket.js
- Productivity.jsx
- react
- Add / edit part
- StateFormModal.jsx
- Parts
- Project Docs & Conventions
- dateTime.js
- MachineDiagnostics.jsx
- AddPart.jsx
- customerName
- Speedometer.jsx
- AddProductionSchedule.jsx
- healthSampleData.js
- Runtime Dependencies
- intelligenceSettings.js
- Breaks
- 0001. Single-page app with React 19 and Vite
- unwrap
- AuthProvider.jsx
- 0016. Account Center is superadmin only; Users lists company members only
- devDependencies
- jsconfig Aliases
- ScheduleJobFields.jsx
- TimePicker.jsx
- AddCustomer.jsx
- package.json
- authService.js
- DatePicker.jsx
- Login Logo Asset
- routes.js
- OrganizationPage.jsx
- sharedGet
- ControllerFormModal.jsx
- Customers / Users list
- All machines
- healthSensors.js
- AreaGrowthChart.jsx
- ProtectedRoute
- VirtualScreen.jsx
- vite.config.js
- Branches
- adr/README.md
- Downtime / idle reasons
- IntelligencePanels.jsx
- AddMachine.jsx
- userCityService.js
- 0018. Log in as customer opens the dashboard directly (no /login-as page)
- Shifts
- User guide
- OpsPanels.jsx
- react-bootstrap
- Productivity
- UserGuide.jsx
- ModeReasonModal.jsx
- ModelFormModal.jsx
- AddBranch.jsx
- withQuery
- MainLayout.jsx
- States
- Page flows
- LicenceKeyGenerator.jsx
- Decision
- 0008. Folder structure by page and by concern
- 0023. One list, row and form for the name-under-a-parent organization levels
- HolidayFormModal.jsx
- 0006. React-Bootstrap with SCSS design tokens
- useMachineLive
- session.js
- Countries
- BrandFormModal.jsx
- Licence keys
- MachineHeatmap.jsx
- My sessions
- 0003. Server state via service modules and useLoad, Context only for the session
- Home (Dashboard)
- ShiftFormModal.jsx
- Login.jsx
- 0022. Ponytail plugin for Claude Code, under this repo's rules
- Machine diagnostics
- userLineService.js
- Machine health
- User sessions
- customerName
- Plant Intelligence
- 0005. Forms with react-hook-form and zod
- ReasonFormModal.jsx
- 0009. Page-wise flow documentation in docs/pages
- 0004. Axios client with the HttpOnly session cookie
- Add / edit branch
- LiveClock.jsx
- Add / edit machine
- Operations Center
- Monitoring (machine list)
- orgLevels.js
- 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page
- 0014. Business Setup renamed Account Center; old Account Center item removed
- 0024. Operations Center: a second dashboard beside Home, on the existing APIs
- app-shell.md
- 0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day
- 0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before
- Holidays / week off
- MainLayout
- Supervisors
- MonitoringMachines
- scripts
- 0015. Clientele is a Masters page, not an Account Center tab
- ChartTooltip.jsx
- Client documentation

## God Nodes (most connected - your core abstractions)
1. `react` - 132 edges
2. `prop-types` - 115 edges
3. `react-bootstrap` - 103 edges
4. `unwrap()` - 103 edges
5. `useAuth()` - 90 edges
6. `Loader()` - 83 edges
7. `withQuery()` - 79 edges
8. `sharedGet()` - 67 edges
9. `ProtectedRoute()` - 54 edges
10. `unwrapList()` - 51 edges

## Surprising Connections (you probably didn't know these)
- `Log out one session` --references--> `ConfirmModal()`  [INFERRED]
  docs/pages/my-sessions.md → src/components/common/ConfirmModal.jsx
- `Log out one session / Log out all` --references--> `ConfirmModal()`  [INFERRED]
  docs/pages/user-sessions.md → src/components/common/ConfirmModal.jsx
- `UI states` --references--> `Loader()`  [INFERRED]
  docs/pages/home.md → src/components/common/Loader.jsx
- `Shared components used` --references--> `NoResults()`  [INFERRED]
  docs/pages/machine-diagnostics.md → src/components/common/TableNoResults.jsx
- `Open productivity / health` --references--> `machineMonitorPath()`  [INFERRED]
  docs/pages/monitoring-machines.md → src/constants/monitoring.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project convention documents (CLAUDE.md, frontend skills, THEME, README)** — claude, 7th_sense_frontend_skills, theme, readme [EXTRACTED 1.00]
- **Customer-scoped master data with role-based access** — claude_masters_customer_pattern, claude_role_based_access, claude_production_schedule, claude_licence_keys, claude_shifts_breaks [INFERRED 0.85]
- **Dark/light dual theme system** — theme_design_tokens, theme_light_theme_second_build, theme_theme_switching, 7thsense_ui_review [INFERRED 0.85]

## Communities (113 total, 3 thin omitted)

### Community 0 - "OperationsCenter.jsx"
Cohesion: 0.14
Nodes (33): Decision, Decision, On page load, Shared components used, MONITOR_REFRESH_MS, useLoad(), customerOptionLabel(), dayTitle (+25 more)

### Community 1 - "CustomerView.jsx"
Cohesion: 0.12
Nodes (36): On page load, On page load, Choose the user's machines (Access card), On page load, Save user (add / edit form), On page load, On page load, On page load (+28 more)

### Community 2 - "BarLineChart.jsx"
Cohesion: 0.18
Nodes (24): recharts, LEGEND_BOTTOM_PROPS, LEGEND_PROPS, axisPropTypes, seriesShape, ACTIVE_DOT, ANIMATION_MS, BAND_OPACITY (+16 more)

### Community 3 - "liveSocket.js"
Cohesion: 0.15
Nodes (25): Click Log out, logout(), applyAnswer(), applyStatus(), applyValues(), checkSession(), connectionListeners, disconnectLive() (+17 more)

### Community 4 - "Productivity.jsx"
Cohesion: 0.08
Nodes (47): ChartCard(), ModeTimelineCard(), readoutClock, readoutTime, chartMessage(), dayLabel, pickedMachineIds(), Productivity() (+39 more)

### Community 5 - "react"
Cohesion: 0.08
Nodes (49): prop-types, react, App(), IconAction(), StatusBadge(), Toaster(), ICONS, ToastItem() (+41 more)

### Community 6 - "Add / edit part"
Cohesion: 0.25
Nodes (8): Add / edit part, API calls on this page, Decisions, Shared components used, State & storage, UI states, Upload part drawing, View process drawing

### Community 7 - "StateFormModal.jsx"
Cohesion: 0.10
Nodes (34): country-region-data, MultiSelectPicker(), summary(), toGroups(), OrgCustomerField(), ALL_COUNTRIES, byName, findLibraryCountry() (+26 more)

### Community 8 - "Parts"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete part, On page load, Parts, Shared components used, State & storage, UI states

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "dateTime.js"
Cohesion: 0.17
Nodes (25): ChartDateFilter(), DatePicker(), DateRangePicker(), DEFAULT_PRESETS, earlier(), later(), normalizeRange(), RangePanel() (+17 more)

### Community 11 - "MachineDiagnostics.jsx"
Cohesion: 0.12
Nodes (28): ADR-0013, On page load, buildChecks(), buildVerdict(), CHECK_LABELS, CHECK_STATUS, DEFAULT_LIVE_INTERVAL, DIAGNOSTICS_REFRESH_MS (+20 more)

### Community 12 - "AddPart.jsx"
Cohesion: 0.10
Nodes (34): FieldLabel(), AddPart(), byName(), checkDrawing, DrawingUpload(), MachinePicker(), summary(), DRAWING_RULES (+26 more)

### Community 13 - "customerName"
Cohesion: 0.35
Nodes (8): SHIFT_STATUS, breakSchema, INITIAL_VALUES, MAX_LENGTH, toBreakPayload(), toFormValues(), BreakFormModal(), FIELD_HELP

### Community 14 - "Speedometer.jsx"
Cohesion: 0.24
Nodes (9): STATUS_COLORS, TRACK_COLOR, clamp(), Needle(), PIE_PROPS, polar(), Speedometer(), TRACK_RADIUS (+1 more)

### Community 15 - "AddProductionSchedule.jsx"
Cohesion: 0.12
Nodes (28): Save part (add / edit form), On page load, Save production schedule (add / edit form), AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel() (+20 more)

### Community 16 - "healthSampleData.js"
Cohesion: 0.16
Nodes (24): MACHINE_MODES, buildDay(), dailyRows(), dayLabel, dayLoad(), dayStates(), dayWindow(), hourLabel (+16 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+9 more)

### Community 18 - "intelligenceSettings.js"
Cohesion: 0.09
Nodes (51): Decision, Rules & edge cases, Findings, On page load, What the screen shows, PRODUCTION_TIME_KEY, timeByMode(), AlarmParetoCard() (+43 more)

### Community 19 - "Breaks"
Cohesion: 0.29
Nodes (7): API calls on this page, Breaks, Decisions, Delete break, Shared components used, State & storage, UI states

### Community 20 - "0001. Single-page app with React 19 and Vite"
Cohesion: 0.33
Nodes (5): 0001. Single-page app with React 19 and Vite, Alternatives considered, Consequences, Context, Decision

### Community 21 - "unwrap"
Cohesion: 0.12
Nodes (23): Save break (add / edit form), Save holiday (add / edit form), Save machine (add / edit form), On page load, Save shift (add / edit form), apiClient, pendingGets, unauthorizedListeners (+15 more)

### Community 22 - "AuthProvider.jsx"
Cohesion: 0.16
Nodes (16): ADR-0018, Decision, Decision, Session ended, View customer (log in as), Live values (Socket.IO), isSessionEnded(), sessionEndedMessage() (+8 more)

### Community 23 - "0016. Account Center is superadmin only; Users lists company members only"
Cohesion: 0.40
Nodes (5): 0016. Account Center is superadmin only; Users lists company members only, Alternatives considered, Consequences, Context, Decision

### Community 24 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "ScheduleJobFields.jsx"
Cohesion: 0.24
Nodes (13): MAX_LENGTH, MAX_QUANTITY, FIELD_HELP, optionShape, ScheduleJobFields(), Clock(), minutesBetween(), ShiftCard() (+5 more)

### Community 27 - "TimePicker.jsx"
Cohesion: 0.14
Nodes (20): assignRef(), PickerField(), POPPER_CONFIG, centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel() (+12 more)

### Community 28 - "AddCustomer.jsx"
Cohesion: 0.06
Nodes (63): API calls on this page, Clientele, Decisions, Delete clientele, Save clientele (add / edit form), Shared components used, State & storage, UI states (+55 more)

### Community 29 - "package.json"
Cohesion: 0.11
Nodes (19): name, private, type, version, axios, bootstrap, bootstrap-icons, eslint (+11 more)

### Community 30 - "authService.js"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Log out other device and continue (conflict modal), Login, Shared components used, State & storage, Submit login form, UI states

### Community 31 - "DatePicker.jsx"
Cohesion: 0.20
Nodes (15): clamp(), DateCalendar(), dayLabel, keyToDay(), monthGrid(), monthName, MONTHS, monthTitle (+7 more)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "routes.js"
Cohesion: 0.20
Nodes (11): react-router-dom, ACCOUNT_CENTER_PATHS, ACCOUNT_CENTER_TABS, MONITORING_MACHINE_TABS, MONITORING_PATHS, ORGANIZATION_PATHS, ADR-0014, ADR-0024 (+3 more)

### Community 34 - "OrganizationPage.jsx"
Cohesion: 0.40
Nodes (4): 0010. Organization levels on one tabbed page, a route per tab, Alternatives considered, Context, Decision

### Community 35 - "sharedGet"
Cohesion: 0.14
Nodes (27): On page load, On page load, On page load, On page load, On page load, On page load, On page load, On page load (+19 more)

### Community 36 - "ControllerFormModal.jsx"
Cohesion: 0.16
Nodes (17): API calls on this page, Controllers, Decisions, Delete controller, Save controller (add / edit form), Shared components used, State & storage, UI states (+9 more)

### Community 37 - "Customers / Users list"
Cohesion: 0.06
Nodes (32): API calls on this page, App shell (session, logout, theme), Change theme, Decisions, On page load, Shared components used, State & storage, UI states (+24 more)

### Community 38 - "All machines"
Cohesion: 0.22
Nodes (9): All machines, API calls on this page, Decisions, Delete machine, Edit machine, On page load, Shared components used, State & storage (+1 more)

### Community 39 - "healthSensors.js"
Cohesion: 0.09
Nodes (33): niceTicks(), STEP_MULTIPLES, pointsInRange(), clock, clockSeconds, dayClock, DEFAULT_RANGE, DEFAULT_RANGE_DAYS (+25 more)

### Community 40 - "AreaGrowthChart.jsx"
Cohesion: 0.35
Nodes (17): Shared components used, AreaGrowthChart(), BarLineChart(), ChartFrame(), renderGrid(), renderLegend(), renderTooltip(), renderXAxis() (+9 more)

### Community 41 - "ProtectedRoute"
Cohesion: 0.10
Nodes (23): 0002. React Router with one route table and role guards, Alternatives considered, Consequences, Context, Decision, 0017. Log in as customer in a new tab, on the tab's own API path, Alternatives considered, Consequences (+15 more)

### Community 42 - "VirtualScreen.jsx"
Cohesion: 0.06
Nodes (50): What the screen shows, 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents), ADR-0009, ADR-0021, LIVE_CHANNELS (+42 more)

### Community 43 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 44 - "Branches"
Cohesion: 0.25
Nodes (8): API calls on this page, Branches, Decisions, Delete branch, On page load, Save branch (add / edit form), Shared components used, UI states

### Community 46 - "Downtime / idle reasons"
Cohesion: 0.16
Nodes (19): API calls on this page, Decisions, Delete downtime reason, Delete idle reason, Downtime / idle reasons, On page load, Save downtime reason (add / edit form), Save idle reason (add / edit form) (+11 more)

### Community 47 - "IntelligencePanels.jsx"
Cohesion: 0.10
Nodes (50): NoResults(), modeTypeOf(), machineMonitorPath(), monitoringSearchPath(), DayCard(), FleetCard(), KpiTile(), TileRow() (+42 more)

### Community 48 - "AddMachine.jsx"
Cohesion: 0.07
Nodes (44): 0007. Recharts for charts, plain SVG for the Gantt, Alternatives considered, Consequences, Context, Decision, clockMinutes, clockWithSeconds, ModeGanttChart() (+36 more)

### Community 49 - "userCityService.js"
Cohesion: 0.20
Nodes (11): API calls on this page, Cities, Decisions, Delete user city, Save user city (add / edit form), Shared components used, State & storage, UI states (+3 more)

### Community 50 - "0018. Log in as customer opens the dashboard directly (no /login-as page)"
Cohesion: 0.33
Nodes (4): 0018. Log in as customer opens the dashboard directly (no /login-as page), Alternatives considered, Consequences, Context

### Community 51 - "Shifts"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete shift, Shared components used, Shifts, State & storage, UI states

### Community 52 - "User guide"
Cohesion: 0.25
Nodes (8): Decisions, On page load, Rules & edge cases, Sections, Shared components used, State & storage, UI states, User guide

### Community 53 - "OpsPanels.jsx"
Cohesion: 0.14
Nodes (27): UNFINISHED_WARNING, ACTION_LIMIT, alarmActions(), biggestLoss(), buildActions(), expiryAlert(), fleetActions(), fleetMode() (+19 more)

### Community 54 - "react-bootstrap"
Cohesion: 0.05
Nodes (142): Consequences, Decision, Decision, State & storage, UI states, State & storage, UI states, react-bootstrap (+134 more)

### Community 55 - "Productivity"
Cohesion: 0.25
Nodes (8): API calls on this page, Change the Machine Modes period, Decisions, Live updates, Productivity, Shared components used, State & storage, UI states

### Community 56 - "UserGuide.jsx"
Cohesion: 0.15
Nodes (21): InfoTooltip(), ROLE_LABELS, NAV_SECTIONS, navLinks(), NUMBERED_STEPS, OpenLink(), SectionCard(), SECTIONS (+13 more)

### Community 57 - "ModeReasonModal.jsx"
Cohesion: 0.18
Nodes (24): Add a downtime or idle reason, clockFormat, dateValue(), dayFormat, firstFreeSpan(), floorMinute(), formatClock(), formatDay() (+16 more)

### Community 58 - "ModelFormModal.jsx"
Cohesion: 0.15
Nodes (19): API calls on this page, Decisions, Delete model, Machine models, Save model (add / edit form), Shared components used, State & storage, UI states (+11 more)

### Community 59 - "AddBranch.jsx"
Cohesion: 0.17
Nodes (19): Save branch (add / edit form), BRANCH_STATUS, AddBranch(), labelClass(), branchSchema, COLOR_PICKER_FALLBACK, INITIAL_VALUES, optional() (+11 more)

### Community 60 - "withQuery"
Cohesion: 0.21
Nodes (15): On page load, On page load, withQuery(), getCycleCounts(), getFinishCycles(), getMachineSummaries(), getModeTimeline(), getModeTotals() (+7 more)

### Community 61 - "MainLayout.jsx"
Cohesion: 0.16
Nodes (18): Footer(), AppShell(), Sidebar(), isAlsoActive(), linkClass(), navLeafShape, SidebarItem(), displayName() (+10 more)

### Community 62 - "States"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete user state, Save user state (add / edit form), Shared components used, State & storage, States, UI states

### Community 63 - "Page flows"
Cohesion: 0.15
Nodes (13): Dashboard, Masters, Masters › Downtime, Masters › Organization, Masters › Shift, Masters › Users, Operations, Operations › Monitoring (+5 more)

### Community 64 - "LicenceKeyGenerator.jsx"
Cohesion: 0.17
Nodes (19): Other, @hookform/resolvers, react-hook-form, DEFAULT_DURATION, DURATION_VALUES, editSchema, GENERATE_INITIAL_VALUES, generateSchema (+11 more)

### Community 65 - "Decision"
Cohesion: 0.18
Nodes (11): 0021. Virtual Screen: live values over Socket.IO, REST for derived data, Alternatives considered, Consequences, Context, Decision, 0027. Session message codes worded on the client, and a conflict modal at login, Alternatives considered, Consequences (+3 more)

### Community 66 - "0008. Folder structure by page and by concern"
Cohesion: 0.33
Nodes (5): 0008. Folder structure by page and by concern, Alternatives considered, Consequences, Context, Decision

### Community 67 - "0023. One list, row and form for the name-under-a-parent organization levels"
Cohesion: 0.40
Nodes (4): 0023. One list, row and form for the name-under-a-parent organization levels, Alternatives considered, Consequences, Context

### Community 68 - "HolidayFormModal.jsx"
Cohesion: 0.26
Nodes (10): StatusToggle(), HOLIDAY_TYPES, holidaySchema, INITIAL_VALUES, MAX_LENGTH, toFormValues(), toHolidayPayload(), HolidayFormModal() (+2 more)

### Community 69 - "0006. React-Bootstrap with SCSS design tokens"
Cohesion: 0.33
Nodes (5): 0006. React-Bootstrap with SCSS design tokens, Alternatives considered, Consequences, Context, Decision

### Community 70 - "useMachineLive"
Cohesion: 0.38
Nodes (10): useMachineLive(), getLiveConnectError(), getMachineState(), isLiveConnected(), machineEntry(), onMachineEvent(), scheduleSync(), subscribeConnection() (+2 more)

### Community 71 - "session.js"
Cohesion: 0.24
Nodes (8): ADR-0027, ADR-0014, LOCATION_UNAVAILABLE, REVOKE_REASONS, REVOKED_MESSAGES, SESSION_CODES, SESSION_MODES, ADR-0014

### Community 72 - "Countries"
Cohesion: 0.22
Nodes (9): API calls on this page, Countries, Decisions, Delete user country, On page load, Save user country (add / edit form), Shared components used, State & storage (+1 more)

### Community 73 - "BrandFormModal.jsx"
Cohesion: 0.14
Nodes (18): API calls on this page, Brands, Decisions, Delete brand, On page load, Save brand (add / edit form), Shared components used, State & storage (+10 more)

### Community 74 - "Licence keys"
Cohesion: 0.20
Nodes (10): API calls on this page, Decisions, Delete licence key, Generate licence keys, Licence keys, Save licence key (add / edit form), Save licence keys (add / edit form), Shared components used (+2 more)

### Community 75 - "MachineHeatmap.jsx"
Cohesion: 0.36
Nodes (9): UNKNOWN_MODE_COLOR, OutlookCard(), dayLabel(), weekdayLabel(), cellTitle(), MachineHeatmap(), METRICS, scoreClass() (+1 more)

### Community 76 - "My sessions"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Log out all other sessions, Log out one session, My sessions, On page load, Shared components used, State & storage

### Community 77 - "0003. Server state via service modules and useLoad, Context only for the session"
Cohesion: 0.40
Nodes (4): 0003. Server state via service modules and useLoad, Context only for the session, Alternatives considered, Consequences, Context

### Community 78 - "Home (Dashboard)"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Home (Dashboard), On page load, Pick another day or customer, State & storage, UI states

### Community 79 - "ShiftFormModal.jsx"
Cohesion: 0.18
Nodes (19): ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, SHIFT_TYPES, WEEKDAYS, itemMinutes(), clock(), EMPTY_BREAK_ROW, INITIAL_VALUES (+11 more)

### Community 80 - "Login.jsx"
Cohesion: 0.12
Nodes (28): @/assets/scss/theme-light.scss?inline, BrandLogo(), LOGO_MARKUP, env, LANGUAGES, STORAGE_KEYS, THEME, useTheme() (+20 more)

### Community 81 - "0022. Ponytail plugin for Claude Code, under this repo's rules"
Cohesion: 0.33
Nodes (5): 0022. Ponytail plugin for Claude Code, under this repo's rules, Alternatives considered, Consequences, Context, Decision

### Community 83 - "Machine diagnostics"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Machine diagnostics, Shared components used, State & storage, The checks, UI states, Watch variables live

### Community 84 - "userLineService.js"
Cohesion: 0.18
Nodes (12): API calls on this page, Decisions, Delete user line, Lines, On page load, Save user line (add / edit form), Shared components used, State & storage (+4 more)

### Community 85 - "Machine health"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Live updates, Machine health, Shared components used, State & storage, UI states

### Community 86 - "User sessions"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Log out one session / Log out all, On page load, Shared components used, State & storage, User sessions

### Community 87 - "customerName"
Cohesion: 0.48
Nodes (5): customerLabel(), customerMobile(), customerName(), matchesSearch(), CustomerRow()

### Community 88 - "Plant Intelligence"
Cohesion: 0.40
Nodes (5): API calls on this page, Change the period or the customer, Decisions, Plant Intelligence, UI states

### Community 89 - "0005. Forms with react-hook-form and zod"
Cohesion: 0.33
Nodes (5): 0005. Forms with react-hook-form and zod, Alternatives considered, Consequences, Context, Decision

### Community 90 - "ReasonFormModal.jsx"
Cohesion: 0.20
Nodes (12): zod, INITIAL_VALUES, loginSchema, INITIAL_VALUES, MAX_LENGTH, REASON_STATUS, reasonSchema, toFormValues() (+4 more)

### Community 91 - "0009. Page-wise flow documentation in docs/pages"
Cohesion: 0.33
Nodes (5): 0009. Page-wise flow documentation in docs/pages, Alternatives considered, Consequences, Context, Decision

### Community 92 - "0004. Axios client with the HttpOnly session cookie"
Cohesion: 0.33
Nodes (5): 0004. Axios client with the HttpOnly session cookie, Alternatives considered, Consequences, Context, Decision

### Community 93 - "Add / edit branch"
Cohesion: 0.33
Nodes (6): Add / edit branch, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 94 - "LiveClock.jsx"
Cohesion: 0.27
Nodes (9): LiveClock(), CLOCK_TICK_MS, LoginClock(), formatClockTime(), formatLongDate(), formatOrdinalDate(), formatTime12(), formatWeekday() (+1 more)

### Community 95 - "Add / edit machine"
Cohesion: 0.33
Nodes (6): Add / edit machine, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 96 - "Operations Center"
Cohesion: 0.20
Nodes (10): Action queue rules, API calls on this page, Change the date or the customer, Decisions, Operations Center, Rules & edge cases, Shared components used, State & storage (+2 more)

### Community 97 - "Monitoring (machine list)"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Monitoring (machine list), Open productivity / health, Rules & edge cases, Shared components used, State & storage, UI states

### Community 98 - "orgLevels.js"
Cohesion: 0.08
Nodes (34): API calls on this page, Cells, Decisions, Delete user cell, On page load, Save user cell (add / edit form), Shared components used, State & storage (+26 more)

### Community 99 - "0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page"
Cohesion: 0.40
Nodes (5): 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page, Alternatives considered, Consequences, Context, Decision

### Community 100 - "0014. Business Setup renamed Account Center; old Account Center item removed"
Cohesion: 0.40
Nodes (5): 0014. Business Setup renamed Account Center; old Account Center item removed, Alternatives considered, Consequences, Context, Decision

### Community 101 - "0024. Operations Center: a second dashboard beside Home, on the existing APIs"
Cohesion: 0.40
Nodes (4): 0024. Operations Center: a second dashboard beside Home, on the existing APIs, Alternatives considered, Consequences, Context

### Community 102 - "app-shell.md"
Cohesion: 0.21
Nodes (5): 0020. Virtual Screen: one REST snapshot polled every 5 s, Alternatives considered, Consequences, Context, Decision

### Community 103 - "0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day"
Cohesion: 0.40
Nodes (4): 0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day, Alternatives considered, Consequences, Context

### Community 104 - "0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before"
Cohesion: 0.40
Nodes (4): 0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before, Alternatives considered, Consequences, Context

### Community 105 - "Holidays / week off"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete holiday, Holidays / week off, Shared components used, State & storage, UI states

### Community 107 - "MainLayout"
Cohesion: 0.06
Nodes (33): About, Decisions, State & storage, UI states, Decisions, Not found / Forbidden, API calls on this page, Decisions (+25 more)

### Community 109 - "Supervisors"
Cohesion: 0.18
Nodes (13): API calls on this page, Decisions, Delete user supervisor, On page load, Save user supervisor (add / edit form), Shared components used, State & storage, Supervisors (+5 more)

### Community 116 - "MonitoringMachines"
Cohesion: 0.06
Nodes (36): 0012. Monitoring: Productivity and Machine Health on one tabbed page, Alternatives considered, Consequences, Context, Decision, 0013. Monitoring starts with a machine list; All Machines is set-up only, Alternatives considered, Consequences (+28 more)

### Community 118 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 119 - "0015. Clientele is a Masters page, not an Account Center tab"
Cohesion: 0.50
Nodes (4): 0015. Clientele is a Masters page, not an Account Center tab, Alternatives considered, Consequences, Context

### Community 127 - "Client documentation"
Cohesion: 0.40
Nodes (4): Client documentation, How to use Postman, How to view the API docs in Chrome (Swagger UI), How to view the page flow docs

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **29 isolated node(s):** `bootstrap`, `@types/react`, `@types/react-dom`, `eslint`, `sass` (+24 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 523 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `OperationsCenter.jsx`, `CustomerView.jsx`, `BarLineChart.jsx`, `Productivity.jsx`, `StateFormModal.jsx`, `dateTime.js`, `MachineDiagnostics.jsx`, `AddPart.jsx`, `customerName`, `Speedometer.jsx`, `AddProductionSchedule.jsx`, `intelligenceSettings.js`, `unwrap`, `AuthProvider.jsx`, `ScheduleJobFields.jsx`, `TimePicker.jsx`, `AddCustomer.jsx`, `package.json`, `DatePicker.jsx`, `routes.js`, `ControllerFormModal.jsx`, `healthSensors.js`, `AreaGrowthChart.jsx`, `ProtectedRoute`, `VirtualScreen.jsx`, `IntelligencePanels.jsx`, `AddMachine.jsx`, `OpsPanels.jsx`, `react-bootstrap`, `UserGuide.jsx`, `ModeReasonModal.jsx`, `ModelFormModal.jsx`, `AddBranch.jsx`, `MainLayout.jsx`, `LicenceKeyGenerator.jsx`, `HolidayFormModal.jsx`, `useMachineLive`, `BrandFormModal.jsx`, `MachineHeatmap.jsx`, `ShiftFormModal.jsx`, `Login.jsx`, `customerName`, `ReasonFormModal.jsx`, `LiveClock.jsx`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Are the 23 inferred relationships involving `useAuth()` (e.g. with `State & storage` and `State & storage`) actually correct?**
  _`useAuth()` has 23 INFERRED edges - model-reasoned connections that need verification._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _29 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `OperationsCenter.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13968253968253969 - nodes in this community are weakly interconnected._
- **Why does `ProtectedRoute()` connect `ProtectedRoute` to `Add / edit part`, `Parts`, `Breaks`, `AddCustomer.jsx`, `routes.js`, `ControllerFormModal.jsx`, `Customers / Users list`, `All machines`, `Branches`, `Downtime / idle reasons`, `userCityService.js`, `Shifts`, `User guide`, `react-bootstrap`, `Productivity`, `ModelFormModal.jsx`, `States`, `Countries`, `BrandFormModal.jsx`, `Licence keys`, `My sessions`, `Home (Dashboard)`, `Machine diagnostics`, `userLineService.js`, `Machine health`, `User sessions`, `Plant Intelligence`, `Add / edit branch`, `Add / edit machine`, `Operations Center`, `Monitoring (machine list)`, `orgLevels.js`, `Holidays / week off`, `MainLayout`, `Supervisors`, `MonitoringMachines`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Should `CustomerView.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12179487179487179 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._