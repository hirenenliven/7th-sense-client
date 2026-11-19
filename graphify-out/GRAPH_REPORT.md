# Graph Report - 7th-sense-client  (2026-11-19)

## Corpus Check
- 391 files · ~235,998 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 2475 nodes · 8569 edges · 130 communities (127 shown, 3 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 608 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `507e9591`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- toast.js
- AddCustomer.jsx
- BarLineChart.jsx
- liveSocket.js
- Productivity.jsx
- Speedometer.jsx
- LicenceKeyGenerator.jsx
- AxisValuesCard.jsx
- react
- Project Docs & Conventions
- ProtectedRoute
- IconAction
- AddPart.jsx
- BreakFormModal.jsx
- SidebarProvider.jsx
- AddProductionSchedule.jsx
- productivity.md
- Runtime Dependencies
- intelligenceSettings.js
- ConfirmModal
- 0001. Single-page app with React 19 and Vite
- pages.jsx
- App.jsx
- 0016. Account Center is superadmin only; Users lists company members only
- devDependencies
- jsconfig Aliases
- MachineDiagnostics.jsx
- TimePicker.jsx
- OpsPanels.jsx
- package.json
- app-shell.md
- UserGuide.jsx
- Login Logo Asset
- MachinePlcVariables.jsx
- ControllerFormModal.jsx
- Tool List and Tool Life (machine tabs)
- 0023. One list, row and form for the name-under-a-parent organization levels
- Task list
- All machines
- healthSensors.js
- userShopService.js
- chartLegend.jsx
- VirtualScreen.jsx
- vite.config.js
- useOrgUser
- customerForm.js
- Downtime / idle reasons
- OperationsCenter.jsx
- AddMachine.jsx
- StateFormModal.jsx
- BrandFormModal.jsx
- Shifts
- User guide
- IntelligencePanels.jsx
- useTableSort
- MonitorMachineCard.jsx
- OperatorTaskEditor.jsx
- modeReasonForm.js
- ModelFormModal.jsx
- useOrgUser
- sharedGet
- DatePicker.jsx
- ReasonFormModal.jsx
- 0004. Axios client with the HttpOnly session cookie
- 0014. Business Setup renamed Account Center; old Account Center item removed
- Virtual Screen (machine tab)
- 0008. Folder structure by page and by concern
- unwrap
- HolidayFormModal.jsx
- 0006. React-Bootstrap with SCSS design tokens
- UserSessions.jsx
- 0007. Recharts for charts, plain SVG for the Gantt
- Countries
- Loader
- DateRangePicker.jsx
- MachineAccuracyEditor.jsx
- TablePagination
- 0003. Server state via service modules and useLoad, Context only for the session
- Home (Dashboard)
- ShiftFormModal.jsx
- theme.js
- 0022. Ponytail plugin for Claude Code, under this repo's rules
- AddBranch
- useMachineLive
- userLineService.js
- Page flows
- ChartTooltip.jsx
- Operator tasks
- My sessions
- 0005. Forms with react-hook-form and zod
- AuthProvider.jsx
- 0009. Page-wise flow documentation in docs/pages
- loginAs.js
- Customers / Users list
- Cities
- Machine accuracy
- Operations Center
- Monitoring (machine list)
- withQuery
- 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page
- adr/README.md
- Locations
- Topbar.jsx
- MachineHeatmap.jsx
- Productivity
- Login.jsx
- operatorScheduleSettings.js
- Branches
- Holidays / week off
- User sessions
- Parts
- Supervisors
- Controllers
- Operator wise production schedule
- MainLayout
- Add / edit machine
- ModelList.jsx
- Add / edit branch
- scripts
- OperatorTaskRow.jsx
- routes.js
- Clientele
- Production schedules
- main.jsx
- PlannedTab.jsx
- States
- apiBaseUrl
- Client documentation
- Decision
- 0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before

## God Nodes (most connected - your core abstractions)
1. `react` - 147 edges
2. `prop-types` - 126 edges
3. `unwrap()` - 117 edges
4. `react-bootstrap` - 115 edges
5. `Loader()` - 95 edges
6. `useAuth()` - 92 edges
7. `withQuery()` - 83 edges
8. `sharedGet()` - 75 edges
9. `ProtectedRoute()` - 59 edges
10. `ConfirmModal()` - 57 edges

## Surprising Connections (you probably didn't know these)
- `Delete machine accuracy` --references--> `ConfirmModal()`  [INFERRED]
  docs/pages/machine-accuracy.md → src/components/common/ConfirmModal.jsx
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

## Communities (130 total, 3 thin omitted)

### Community 0 - "toast.js"
Cohesion: 0.18
Nodes (14): TOAST_DEFAULTS, USER_STATUS, isAccountOfKind(), CustomerList(), CustomerList, deleteUser(), loginAsUrl(), dismiss() (+6 more)

### Community 1 - "AddCustomer.jsx"
Cohesion: 0.12
Nodes (40): On page load, Choose the user's machines (Access card), On page load, Save user (add / edit form), On page load, ALL_MACHINE_ROLES, ROLE_LABELS, THEMES (+32 more)

### Community 2 - "BarLineChart.jsx"
Cohesion: 0.18
Nodes (38): Shared components used, recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), axisPropTypes, renderGrid(), renderLegend() (+30 more)

### Community 3 - "liveSocket.js"
Cohesion: 0.17
Nodes (23): applyAnswer(), applyStatus(), applyValues(), checkSession(), connectionListeners, disconnectLive(), EMPTY_STATE, getSocket() (+15 more)

### Community 4 - "Productivity.jsx"
Cohesion: 0.07
Nodes (54): ChartDateFilter(), customerOptionLabel(), dayTitle, Home(), ModeTimelineCard(), readoutClock, readoutTime, chartMessage() (+46 more)

### Community 5 - "Speedometer.jsx"
Cohesion: 0.22
Nodes (10): SEGMENT_GAP, STATUS_COLORS, TRACK_COLOR, clamp(), Needle(), PIE_PROPS, polar(), Speedometer() (+2 more)

### Community 6 - "LicenceKeyGenerator.jsx"
Cohesion: 0.10
Nodes (30): API calls on this page, Decisions, Delete licence key, Generate licence keys, Licence keys, On page load, Save licence key (add / edit form), Save licence keys (add / edit form) (+22 more)

### Community 7 - "AxisValuesCard.jsx"
Cohesion: 0.11
Nodes (30): API calls on this page, Axis Values (X, Y, Z), Decisions, Live updates, Machine health, Shared components used, State & storage, UI states (+22 more)

### Community 8 - "react"
Cohesion: 0.36
Nodes (3): prop-types, react, ACTION_ICONS

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "ProtectedRoute"
Cohesion: 0.08
Nodes (27): 0002. React Router with one route table and role guards, Alternatives considered, Consequences, Context, Decision, Coming soon (unbuilt sidebar links), Decisions, On page load (+19 more)

### Community 11 - "IconAction"
Cohesion: 0.16
Nodes (22): IconAction(), StatusBadge(), BranchRow(), BrandRow(), BreakRow(), ClienteleRow(), ControllerRow(), dayLabel() (+14 more)

### Community 12 - "AddPart.jsx"
Cohesion: 0.08
Nodes (43): Add / edit part, API calls on this page, Decisions, Save part (add / edit form), Shared components used, State & storage, UI states, Upload part drawing (+35 more)

### Community 13 - "BreakFormModal.jsx"
Cohesion: 0.27
Nodes (11): Save break (add / edit form), SHIFT_STATUS, breakSchema, INITIAL_VALUES, MAX_LENGTH, toBreakPayload(), toFormValues(), BreakFormModal() (+3 more)

### Community 14 - "SidebarProvider.jsx"
Cohesion: 0.26
Nodes (8): BREAKPOINTS, SidebarContext, SidebarProvider(), useMediaQuery(), MACHINE_VIEWS, useMachineView(), readStorage(), writeStorage()

### Community 15 - "AddProductionSchedule.jsx"
Cohesion: 0.14
Nodes (24): On page load, Save production schedule (add / edit form), AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel(), EMPTY_ITEM (+16 more)

### Community 16 - "productivity.md"
Cohesion: 0.08
Nodes (26): 0012. Monitoring: Productivity and Machine Health on one tabbed page, Alternatives considered, Consequences, Context, Decision, 0013. Monitoring starts with a machine list; All Machines is set-up only, Alternatives considered, Consequences (+18 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+9 more)

### Community 18 - "intelligenceSettings.js"
Cohesion: 0.08
Nodes (44): Rules & edge cases, API calls on this page, Change the period or the customer, Decisions, Findings, On page load, Plant Intelligence, State & storage (+36 more)

### Community 19 - "ConfirmModal"
Cohesion: 0.11
Nodes (28): Decision, API calls on this page, Decisions, Machine PLC node IDs, On page load, Rules & edge cases, Shared components used, State & storage (+20 more)

### Community 20 - "0001. Single-page app with React 19 and Vite"
Cohesion: 0.33
Nodes (5): 0001. Single-page app with React 19 and Vite, Alternatives considered, Consequences, Context, Decision

### Community 21 - "pages.jsx"
Cohesion: 0.09
Nodes (25): MANAGERS, SUPERADMIN_ONLY, ORG_LEVEL, ORGANIZATION_PATHS, ORGANIZATION_TABS, MachineList(), matchesSearch(), ProductionScheduleList() (+17 more)

### Community 22 - "App.jsx"
Cohesion: 0.36
Nodes (7): App(), Toaster(), ICONS, ToastItem(), OrgUserProvider(), getToasts(), subscribeToasts()

### Community 23 - "0016. Account Center is superadmin only; Users lists company members only"
Cohesion: 0.40
Nodes (5): 0016. Account Center is superadmin only; Users lists company members only, Alternatives considered, Consequences, Context, Decision

### Community 24 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "MachineDiagnostics.jsx"
Cohesion: 0.06
Nodes (60): ADR-0013, API calls on this page, Check machine (is the machine on?), Decisions, Machine diagnostics, On page load, PLC variables (OPC UA), Shared components used (+52 more)

### Community 27 - "TimePicker.jsx"
Cohesion: 0.14
Nodes (28): centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel(), TimePicker(), MAX_LENGTH, MAX_QUANTITY (+20 more)

### Community 28 - "OpsPanels.jsx"
Cohesion: 0.16
Nodes (26): unfinishedRate(), ACTION_LIMIT, alarmActions(), biggestLoss(), buildActions(), expiryAlert(), fleetActions(), fleetMode() (+18 more)

### Community 29 - "package.json"
Cohesion: 0.13
Nodes (16): name, private, type, version, axios, bootstrap, eslint, @eslint/js (+8 more)

### Community 30 - "app-shell.md"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Log out other device and continue (conflict modal), Login, Shared components used, State & storage, Submit login form, UI states

### Community 31 - "UserGuide.jsx"
Cohesion: 0.07
Nodes (42): 0010. Organization levels on one tabbed page, a route per tab, Alternatives considered, Consequences, Context, Decision, 0015. Clientele is a Masters page, not an Account Center tab, Alternatives considered, Consequences (+34 more)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "MachinePlcVariables.jsx"
Cohesion: 0.17
Nodes (22): Change a node ID, Reset to default, react-bootstrap, countOf(), ADR-0020, MachinePlcVariables(), withoutKeys(), withRow() (+14 more)

### Community 34 - "ControllerFormModal.jsx"
Cohesion: 0.23
Nodes (12): Save controller (add / edit form), FieldLabel(), InfoTooltip(), controllerSchema, INITIAL_VALUES, MAX_LENGTH, toControllerPayload(), toFormValues() (+4 more)

### Community 35 - "Tool List and Tool Life (machine tabs)"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, On page load, Rules & edge cases, Shared components used, State & storage, Tool List and Tool Life (machine tabs), UI states

### Community 36 - "0023. One list, row and form for the name-under-a-parent organization levels"
Cohesion: 0.40
Nodes (4): 0023. One list, row and form for the name-under-a-parent organization levels, Alternatives considered, Consequences, Context

### Community 37 - "Task list"
Cohesion: 0.18
Nodes (9): API calls on this page, Decisions, Delete task / Make inactive, On page load, Save task (add / edit form), Shared components used, State & storage, Task list (+1 more)

### Community 38 - "All machines"
Cohesion: 0.22
Nodes (9): All machines, API calls on this page, Decisions, Delete machine, Edit machine, On page load, Shared components used, State & storage (+1 more)

### Community 39 - "healthSensors.js"
Cohesion: 0.07
Nodes (55): niceTicks(), STEP_MULTIPLES, MACHINE_MODES, buildDay(), dailyRows(), dayLabel, dayLoad(), dayStates() (+47 more)

### Community 40 - "userShopService.js"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete user shop, Shared components used, Shops, State & storage, UI states

### Community 42 - "VirtualScreen.jsx"
Cohesion: 0.06
Nodes (50): What the screen shows, 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents), ADR-0009, ADR-0021, LIVE_CHANNELS (+42 more)

### Community 43 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 44 - "useOrgUser"
Cohesion: 0.19
Nodes (17): OrgCustomerField(), OrgUserContext, useOrgUser(), countrySchema, INITIAL_VALUES, toCountryPayloads(), CountryFormModal(), NOUN (+9 more)

### Community 45 - "customerForm.js"
Cohesion: 0.09
Nodes (48): Save clientele (add / edit form), COUNTRIES, DEFAULT_COUNTRY, DEFAULT_TIME_ZONE, ENABLED_COUNTRIES, getCountryCode(), getCountryName(), getDialCode() (+40 more)

### Community 46 - "Downtime / idle reasons"
Cohesion: 0.16
Nodes (19): API calls on this page, Decisions, Delete downtime reason, Delete idle reason, Downtime / idle reasons, On page load, Save downtime reason (add / edit form), Save idle reason (add / edit form) (+11 more)

### Community 47 - "OperationsCenter.jsx"
Cohesion: 0.13
Nodes (43): Decision, Decision, On page load, Shared components used, ChartCard(), useLoad(), HourlyCard(), AlarmsCard() (+35 more)

### Community 48 - "AddMachine.jsx"
Cohesion: 0.10
Nodes (36): Save machine (add / edit form), CONTROLLER_VERSION_TYPES, MACHINE_HEALTH_ALL, MACHINE_HEALTH_SENSORS, MACHINE_SYSTEM_TYPES, SECURITY_MODES, AddMachine(), byName() (+28 more)

### Community 49 - "StateFormModal.jsx"
Cohesion: 0.16
Nodes (19): country-region-data, MultiSelectPicker(), summary(), toGroups(), ALL_COUNTRIES, byName, findLibraryCountry(), getLibraryStateNames() (+11 more)

### Community 50 - "BrandFormModal.jsx"
Cohesion: 0.14
Nodes (18): API calls on this page, Brands, Decisions, Delete brand, On page load, Save brand (add / edit form), Shared components used, State & storage (+10 more)

### Community 51 - "Shifts"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete shift, Shared components used, Shifts, State & storage, UI states

### Community 52 - "User guide"
Cohesion: 0.25
Nodes (8): Decisions, On page load, Rules & edge cases, Sections, Shared components used, State & storage, UI states, User guide

### Community 53 - "IntelligencePanels.jsx"
Cohesion: 0.09
Nodes (48): monitoringSearchPath(), DayCard(), FleetCard(), KpiTile(), TileRow(), tileShape, TimeCard(), AttentionCard() (+40 more)

### Community 54 - "useTableSort"
Cohesion: 0.13
Nodes (24): ARIA_SORT, compareValues(), isBlank(), SORT_DIR, useTableSort(), BrandList(), byName(), matchesSearch() (+16 more)

### Community 55 - "MonitorMachineCard.jsx"
Cohesion: 0.17
Nodes (22): Decision, clockMinutes, clockWithSeconds, ModeGanttChart(), TICK_STEPS, ticksFor(), MACHINE_MODE_TYPES, MACHINE_STATUS (+14 more)

### Community 56 - "OperatorTaskEditor.jsx"
Cohesion: 0.15
Nodes (25): zod, StatusToggle(), OperatorTaskEditor(), findTask(), groupModels(), INITIAL_VALUES, normalise(), operatorTaskSchema (+17 more)

### Community 57 - "modeReasonForm.js"
Cohesion: 0.18
Nodes (24): Add a downtime or idle reason, clockFormat, dateValue(), dayFormat, firstFreeSpan(), floorMinute(), formatClock(), formatDay() (+16 more)

### Community 58 - "ModelFormModal.jsx"
Cohesion: 0.26
Nodes (12): Save model (add / edit form), ControllerOptions(), groupByBrand(), INITIAL_VALUES, modelSchema, NAME_MAX_LENGTH, toFormValues(), toModelPayload() (+4 more)

### Community 59 - "useOrgUser"
Cohesion: 0.17
Nodes (18): BRANCH_STATUS, ROLES, labelClass(), branchSchema, INITIAL_VALUES, optional(), REQUIRED_FIELDS, toBranchPayload() (+10 more)

### Community 60 - "sharedGet"
Cohesion: 0.13
Nodes (29): Decision, On page load, On page load, On page load, On page load, On page load, On page load, On page load (+21 more)

### Community 61 - "DatePicker.jsx"
Cohesion: 0.12
Nodes (24): clamp(), DateCalendar(), DatePicker(), dayLabel, keyToDay(), monthGrid(), monthName, MONTHS (+16 more)

### Community 62 - "ReasonFormModal.jsx"
Cohesion: 0.19
Nodes (14): customerMobile(), customerName(), matchesSearch(), CustomerRow(), customerOptionLabel(), INITIAL_VALUES, MAX_LENGTH, REASON_STATUS (+6 more)

### Community 63 - "0004. Axios client with the HttpOnly session cookie"
Cohesion: 0.40
Nodes (4): 0004. Axios client with the HttpOnly session cookie, Alternatives considered, Consequences, Context

### Community 64 - "0014. Business Setup renamed Account Center; old Account Center item removed"
Cohesion: 0.40
Nodes (5): 0014. Business Setup renamed Account Center; old Account Center item removed, Alternatives considered, Consequences, Context, Decision

### Community 65 - "Virtual Screen (machine tab)"
Cohesion: 0.22
Nodes (9): API calls on this page, Decisions, Live values (Socket.IO), On page load, Rules & edge cases, Shared components used, State & storage, UI states (+1 more)

### Community 66 - "0008. Folder structure by page and by concern"
Cohesion: 0.33
Nodes (5): 0008. Folder structure by page and by concern, Alternatives considered, Consequences, Context, Decision

### Community 67 - "unwrap"
Cohesion: 0.21
Nodes (15): On page load, On page load, On page load, unwrap(), getAxisValues(), getMachineTimeByDay(), ADR-0018, getCycleCounts() (+7 more)

### Community 68 - "HolidayFormModal.jsx"
Cohesion: 0.25
Nodes (12): Save holiday (add / edit form), HOLIDAY_TYPES, holidaySchema, INITIAL_VALUES, MAX_LENGTH, toFormValues(), toHolidayPayload(), HolidayFormModal() (+4 more)

### Community 69 - "0006. React-Bootstrap with SCSS design tokens"
Cohesion: 0.33
Nodes (5): 0006. React-Bootstrap with SCSS design tokens, Alternatives considered, Consequences, Context, Decision

### Community 70 - "UserSessions.jsx"
Cohesion: 0.19
Nodes (17): SortableHead(), formatSessionTime(), ADR-0014, MySessions(), matchesSearch(), SessionTable(), ADR-0014, UserSessions() (+9 more)

### Community 71 - "0007. Recharts for charts, plain SVG for the Gantt"
Cohesion: 0.40
Nodes (4): 0007. Recharts for charts, plain SVG for the Gantt, Alternatives considered, Consequences, Context

### Community 72 - "Countries"
Cohesion: 0.22
Nodes (9): API calls on this page, Countries, Decisions, Delete user country, On page load, Save user country (add / edit form), Shared components used, State & storage (+1 more)

### Community 73 - "Loader"
Cohesion: 0.15
Nodes (26): Loader(), CUSTOMER_ROLE_ID, useAuth(), BreakSetup(), matchesSearch(), ClienteleList(), matchesSearch(), HolidaySetup() (+18 more)

### Community 74 - "DateRangePicker.jsx"
Cohesion: 0.19
Nodes (19): DateRangePicker(), DEFAULT_PRESETS, earlier(), later(), normalizeRange(), RangePanel(), sameRange(), assignRef() (+11 more)

### Community 75 - "MachineAccuracyEditor.jsx"
Cohesion: 0.33
Nodes (10): @hookform/resolvers, MachineAccuracyEditor(), ACCURACY_MAX_LENGTH, accuracySchema, INITIAL_VALUES, toAccuracyName(), toFormValues(), usageLabel() (+2 more)

### Community 76 - "TablePagination"
Cohesion: 0.20
Nodes (15): pageItems(), TablePagination(), PAGE_SIZES, byBrandThenName(), byName(), ControllerList(), matchesSearch(), byName() (+7 more)

### Community 77 - "0003. Server state via service modules and useLoad, Context only for the session"
Cohesion: 0.40
Nodes (4): 0003. Server state via service modules and useLoad, Context only for the session, Alternatives considered, Consequences, Context

### Community 78 - "Home (Dashboard)"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Home (Dashboard), On page load, Pick another day or customer, State & storage, UI states

### Community 79 - "ShiftFormModal.jsx"
Cohesion: 0.16
Nodes (22): Save shift (add / edit form), ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, SHIFT_TYPES, WEEKDAYS, itemMinutes(), clock(), EMPTY_BREAK_ROW (+14 more)

### Community 80 - "theme.js"
Cohesion: 0.26
Nodes (12): @/assets/scss/theme-light.scss?inline, DEFAULT_THEME, useTheme(), applyTheme(), chooseTheme(), getStoredTheme(), getTheme(), latestSave (+4 more)

### Community 81 - "0022. Ponytail plugin for Claude Code, under this repo's rules"
Cohesion: 0.33
Nodes (5): 0022. Ponytail plugin for Claude Code, under this repo's rules, Alternatives considered, Consequences, Context, Decision

### Community 82 - "AddBranch"
Cohesion: 0.13
Nodes (14): On page load, Save branch (add / edit form), On page load, On page load, AddBranch(), createBranch(), updateBranch(), getUserCities() (+6 more)

### Community 83 - "useMachineLive"
Cohesion: 0.38
Nodes (10): useMachineLive(), getLiveConnectError(), getMachineState(), isLiveConnected(), machineEntry(), onMachineEvent(), scheduleSync(), subscribeConnection() (+2 more)

### Community 84 - "userLineService.js"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete user line, Lines, Shared components used, State & storage, UI states

### Community 85 - "Page flows"
Cohesion: 0.15
Nodes (13): Dashboard, Masters, Masters › Downtime, Masters › Organization, Masters › Shift, Masters › Users, Operations, Operations › Monitoring (+5 more)

### Community 87 - "Operator tasks"
Cohesion: 0.20
Nodes (10): API calls on this page, Decisions, Delete operator task, New task (add to the task list), On page load, Operator tasks, Save operator task (add / edit form), Shared components used (+2 more)

### Community 88 - "My sessions"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Log out all other sessions, Log out one session, My sessions, On page load, Shared components used, State & storage

### Community 89 - "0005. Forms with react-hook-form and zod"
Cohesion: 0.33
Nodes (5): 0005. Forms with react-hook-form and zod, Alternatives considered, Consequences, Context, Decision

### Community 90 - "AuthProvider.jsx"
Cohesion: 0.16
Nodes (15): ADR-0027, Decision, Session ended, isSessionEnded(), ADR-0014, REVOKE_REASONS, REVOKED_MESSAGES, SESSION_CODES (+7 more)

### Community 91 - "0009. Page-wise flow documentation in docs/pages"
Cohesion: 0.33
Nodes (5): 0009. Page-wise flow documentation in docs/pages, Alternatives considered, Consequences, Context, Decision

### Community 92 - "loginAs.js"
Cohesion: 0.27
Nodes (5): LOGO_MARKUP, env, STORAGE_KEYS, ADR-0018, readSessionKey()

### Community 93 - "Customers / Users list"
Cohesion: 0.06
Nodes (32): API calls on this page, App shell (session, logout, theme), Change theme, Decisions, On page load, Shared components used, State & storage, UI states (+24 more)

### Community 94 - "Cities"
Cohesion: 0.29
Nodes (7): API calls on this page, Cities, Decisions, Delete user city, Shared components used, State & storage, UI states

### Community 95 - "Machine accuracy"
Cohesion: 0.22
Nodes (9): API calls on this page, Decisions, Delete machine accuracy, Machine accuracy, On page load, Save machine accuracy (add / edit form), Shared components used, State & storage (+1 more)

### Community 96 - "Operations Center"
Cohesion: 0.20
Nodes (10): Action queue rules, API calls on this page, Change the date or the customer, Decisions, Operations Center, Rules & edge cases, Shared components used, State & storage (+2 more)

### Community 97 - "Monitoring (machine list)"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Monitoring (machine list), Open productivity / health, Rules & edge cases, Shared components used, State & storage, UI states

### Community 98 - "withQuery"
Cohesion: 0.10
Nodes (35): On page load, Save user cell (add / edit form), Save user city (add / edit form), Save user line (add / edit form), On page load, Save user location (add / edit form), On page load, Save user shop (add / edit form) (+27 more)

### Community 99 - "0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page"
Cohesion: 0.40
Nodes (5): 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page, Alternatives considered, Consequences, Context, Decision

### Community 101 - "Locations"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete user location, Locations, Shared components used, State & storage, UI states

### Community 102 - "Topbar.jsx"
Cohesion: 0.33
Nodes (8): BrandLogo(), LiveClock(), displayName(), Topbar(), CLOCK_TICK_MS, LANGUAGES, formatClockTime(), formatLongDate()

### Community 103 - "MachineHeatmap.jsx"
Cohesion: 0.38
Nodes (9): NoResults(), OutlookCard(), dayLabel(), weekdayLabel(), cellTitle(), MachineHeatmap(), METRICS, scoreClass() (+1 more)

### Community 104 - "Productivity"
Cohesion: 0.25
Nodes (8): API calls on this page, Change the Machine Modes period, Decisions, Live updates, Productivity, Shared components used, State & storage, UI states

### Community 105 - "Login.jsx"
Cohesion: 0.19
Nodes (14): Login(), redirectTarget(), CENTER, LoginBackdrop(), RINGS, LoginClock(), INITIAL_VALUES, loginSchema (+6 more)

### Community 106 - "operatorScheduleSettings.js"
Cohesion: 0.49
Nodes (9): OperatorJobRow(), OperatorSchedule(), dateLabel(), EMPTY_FILTERS, filterOptions(), machineLabel(), matchesSearch(), partLabel() (+1 more)

### Community 107 - "Branches"
Cohesion: 0.22
Nodes (9): API calls on this page, Branches, Decisions, Delete branch, On page load, Save branch (add / edit form), Shared components used, State & storage (+1 more)

### Community 108 - "Holidays / week off"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete holiday, Holidays / week off, On page load, Shared components used, State & storage, UI states

### Community 109 - "User sessions"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Log out one session / Log out all, On page load, Shared components used, State & storage, User sessions

### Community 110 - "Parts"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete part, On page load, Parts, Shared components used, State & storage, UI states

### Community 111 - "Supervisors"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete user supervisor, Shared components used, State & storage, Supervisors, UI states

### Community 112 - "Controllers"
Cohesion: 0.29
Nodes (7): API calls on this page, Controllers, Decisions, Delete controller, Shared components used, State & storage, UI states

### Community 113 - "Operator wise production schedule"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, On page load, Operator wise production schedule, Search (apply filters), Shared components used, State & storage, UI states

### Community 114 - "MainLayout"
Cohesion: 0.07
Nodes (34): About, Decisions, State & storage, UI states, API calls on this page, Breaks, Decisions, Delete break (+26 more)

### Community 115 - "Add / edit machine"
Cohesion: 0.33
Nodes (6): Add / edit machine, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 116 - "ModelList.jsx"
Cohesion: 0.48
Nodes (6): byBrandControllerName(), compareText(), matchesSearch(), ModelList(), ModelList, deleteModel()

### Community 117 - "Add / edit branch"
Cohesion: 0.33
Nodes (6): Add / edit branch, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 118 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 119 - "OperatorTaskRow.jsx"
Cohesion: 0.70
Nodes (4): machineTypeDetail(), machineTypeLabel(), OperatorTaskRow(), matchesSearch()

### Community 120 - "routes.js"
Cohesion: 0.15
Nodes (20): Decision, Decision, react-router-dom, ACCOUNT_CENTER_PATHS, machineMonitorPath(), MONITOR_REFRESH_MS, MONITORING_MACHINE_TABS, MONITORING_PATHS (+12 more)

### Community 121 - "Clientele"
Cohesion: 0.29
Nodes (7): API calls on this page, Clientele, Decisions, Delete clientele, Shared components used, State & storage, UI states

### Community 122 - "Production schedules"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete production schedule, On page load, Production schedules, Shared components used, State & storage, UI states

### Community 123 - "main.jsx"
Cohesion: 0.17
Nodes (10): 0018. Log in as customer opens the dashboard directly (no /login-as page), Alternatives considered, Consequences, Context, Decision, bootstrap-icons, @fontsource-variable/roboto, react-dom (+2 more)

### Community 124 - "PlannedTab.jsx"
Cohesion: 0.60
Nodes (3): PlannedTab(), ToolLife(), ToolList()

### Community 125 - "States"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete user state, Save user state (add / edit form), Shared components used, State & storage, States, UI states

### Community 126 - "apiBaseUrl"
Cohesion: 0.15
Nodes (12): 0017. Log in as customer in a new tab, on the tab's own API path, Alternatives considered, Consequences, Context, Decision, Click Log out, View customer (log in as), getSession() (+4 more)

### Community 127 - "Client documentation"
Cohesion: 0.50
Nodes (4): Client documentation, How to use Postman, How to view the API docs in Chrome (Swagger UI), How to view the page flow docs

### Community 128 - "Decision"
Cohesion: 0.17
Nodes (12): 0021. Virtual Screen: live values over Socket.IO, REST for derived data, Alternatives considered, Consequences, Context, Decision, 0027. Session message codes worded on the client, and a conflict modal at login, Alternatives considered, Consequences (+4 more)

### Community 129 - "0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before"
Cohesion: 0.33
Nodes (5): 0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before, Alternatives considered, Consequences, Context, Decision

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **42 isolated node(s):** `bootstrap`, `@types/react`, `@types/react-dom`, `eslint`, `sass` (+37 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 570 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProtectedRoute()` connect `ProtectedRoute` to `LicenceKeyGenerator.jsx`, `AxisValuesCard.jsx`, `AddPart.jsx`, `intelligenceSettings.js`, `ConfirmModal`, `MachineDiagnostics.jsx`, `Tool List and Tool Life (machine tabs)`, `Task list`, `All machines`, `userShopService.js`, `Downtime / idle reasons`, `BrandFormModal.jsx`, `Shifts`, `User guide`, `Virtual Screen (machine tab)`, `Countries`, `Loader`, `Home (Dashboard)`, `userLineService.js`, `Operator tasks`, `My sessions`, `Customers / Users list`, `Cities`, `Machine accuracy`, `Operations Center`, `Monitoring (machine list)`, `Locations`, `Productivity`, `Branches`, `Holidays / week off`, `User sessions`, `Parts`, `Supervisors`, `Controllers`, `Operator wise production schedule`, `MainLayout`, `Add / edit machine`, `Add / edit branch`, `routes.js`, `Clientele`, `Production schedules`, `States`, `apiBaseUrl`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Loader()` (e.g. with `Shared components used` and `UI states`) actually correct?**
  _`Loader()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _42 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AddCustomer.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11563367252543941 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `toast.js`, `AddCustomer.jsx`, `BarLineChart.jsx`, `Productivity.jsx`, `Speedometer.jsx`, `LicenceKeyGenerator.jsx`, `AxisValuesCard.jsx`, `ProtectedRoute`, `AddPart.jsx`, `BreakFormModal.jsx`, `SidebarProvider.jsx`, `AddProductionSchedule.jsx`, `ConfirmModal`, `pages.jsx`, `App.jsx`, `MachineDiagnostics.jsx`, `TimePicker.jsx`, `OpsPanels.jsx`, `package.json`, `UserGuide.jsx`, `MachinePlcVariables.jsx`, `ControllerFormModal.jsx`, `healthSensors.js`, `VirtualScreen.jsx`, `useOrgUser`, `customerForm.js`, `OperationsCenter.jsx`, `AddMachine.jsx`, `StateFormModal.jsx`, `BrandFormModal.jsx`, `IntelligencePanels.jsx`, `useTableSort`, `MonitorMachineCard.jsx`, `OperatorTaskEditor.jsx`, `modeReasonForm.js`, `ModelFormModal.jsx`, `useOrgUser`, `DatePicker.jsx`, `ReasonFormModal.jsx`, `HolidayFormModal.jsx`, `UserSessions.jsx`, `Loader`, `DateRangePicker.jsx`, `MachineAccuracyEditor.jsx`, `TablePagination`, `ShiftFormModal.jsx`, `theme.js`, `useMachineLive`, `AuthProvider.jsx`, `Topbar.jsx`, `MachineHeatmap.jsx`, `Login.jsx`, `operatorScheduleSettings.js`, `ModelList.jsx`, `OperatorTaskRow.jsx`, `routes.js`, `main.jsx`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Should `Productivity.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06949152542372881 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._