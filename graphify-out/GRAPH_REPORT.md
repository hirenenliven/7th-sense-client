# Graph Report - 7th-sense-client  (2026-11-19)

## Corpus Check
- 391 files · ~238,554 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 2489 nodes · 8613 edges · 130 communities (127 shown, 3 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 616 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4a7342ff`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- prop-types
- AddCustomer.jsx
- BarLineChart.jsx
- liveSocket.js
- Productivity.jsx
- Speedometer.jsx
- LicenceKeyGenerator.jsx
- AxisValuesCard.jsx
- CustomerList.jsx
- Project Docs & Conventions
- 0002. React Router with one route table and role guards
- Loader
- AddPart.jsx
- BreakFormModal.jsx
- SidebarProvider.jsx
- AddProductionSchedule.jsx
- productivity.md
- Runtime Dependencies
- intelligenceSettings.js
- IconAction
- 0001. Single-page app with React 19 and Vite
- pages.jsx
- App.jsx
- 0016. Account Center is superadmin only; Users lists company members only
- devDependencies
- jsconfig Aliases
- MachineDiagnostics.jsx
- dateTime.js
- OpsPanels.jsx
- package.json
- app-shell.md
- UserGuide.jsx
- Login Logo Asset
- MachinePlcVariables.jsx
- sharedGet
- react
- useOrgUser
- dateTime.js
- All machines
- healthSensors.js
- userShopService.js
- chartLegend.jsx
- VirtualScreen.jsx
- diagnosticsSettings.js
- StateFormModal.jsx
- customerForm.js
- Downtime / idle reasons
- OperationsCenter.jsx
- AddMachine.jsx
- DiagnosticsPlcVariables.jsx
- BrandFormModal.jsx
- AuthProvider.jsx
- User guide
- IntelligencePanels.jsx
- react-bootstrap
- MonitorMachineCard.jsx
- OperatorTaskEditor.jsx
- modeReasonForm.js
- ModelFormModal.jsx
- toast
- unwrap
- DatePicker.jsx
- ReasonFormModal.jsx
- Licence keys
- 0014. Business Setup renamed Account Center; old Account Center item removed
- Add / edit part
- 0008. Folder structure by page and by concern
- Brands
- HolidayFormModal.jsx
- 0006. React-Bootstrap with SCSS design tokens
- UserSessions.jsx
- ControllerFormModal.jsx
- Countries
- app.js
- ShiftCard.jsx
- MachineAccuracyEditor.jsx
- MachinePlcVariables
- 0003. Server state via service modules and useLoad, Context only for the session
- Machine diagnostics
- ShiftFormModal.jsx
- theme.js
- 0022. Ponytail plugin for Claude Code, under this repo's rules
- DiagnosticsVariables.jsx
- Machine health
- Tool List and Tool Life (machine tabs)
- Page flows
- ChartTooltip.jsx
- Operator tasks
- My sessions
- 0005. Forms with react-hook-form and zod
- session.js
- 0009. Page-wise flow documentation in docs/pages
- Virtual Screen (machine tab)
- Customers / Users list
- Decision
- Machine accuracy
- Operations Center
- Monitoring (machine list)
- withQuery
- 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page
- adr/README.md
- Locations
- Clientele
- clienteleService.js
- Productivity
- Login.jsx
- operatorScheduleSettings.js
- Controllers
- Holidays / week off
- User sessions
- Cells
- Supervisors
- Machine PLC node IDs
- Operator wise production schedule
- ProtectedRoute
- Machine models
- 0004. Axios client with the HttpOnly session cookie
- PlannedTab.jsx
- scripts
- 0010. Organization levels on one tabbed page, a route per tab
- IntelligencePanels.jsx
- PartList.jsx
- Production schedules
- 0015. Clientele is a Masters page, not an Account Center tab
- States
- 0018. Log in as customer opens the dashboard directly (no /login-as page)
- Client documentation
- 0024. Operations Center: a second dashboard beside Home, on the existing APIs
- 0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before
- 0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day

## God Nodes (most connected - your core abstractions)
1. `react` - 147 edges
2. `prop-types` - 126 edges
3. `unwrap()` - 118 edges
4. `react-bootstrap` - 115 edges
5. `Loader()` - 94 edges
6. `useAuth()` - 92 edges
7. `withQuery()` - 83 edges
8. `sharedGet()` - 75 edges
9. `ProtectedRoute()` - 59 edges
10. `unwrapList()` - 57 edges

## Surprising Connections (you probably didn't know these)
- `Test a node ID` --references--> `statusHint()`  [INFERRED]
  docs/pages/machine-plc-variables.md → src/pages/MachinePlcVariables/plcVariableSettings.js
- `On page load` --references--> `getBranches()`  [INFERRED]
  docs/pages/branch-list.md → src/services/branchService.js
- `Save branch (add / edit form)` --references--> `updateBranch()`  [INFERRED]
  docs/pages/branch-list.md → src/services/branchService.js
- `On page load` --references--> `getCurrentUser()`  [INFERRED]
  docs/pages/app-shell.md → src/services/customerService.js
- `Save user (add / edit form)` --references--> `updateUser()`  [INFERRED]
  docs/pages/customer-user-list.md → src/services/customerService.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project convention documents (CLAUDE.md, frontend skills, THEME, README)** — claude, 7th_sense_frontend_skills, theme, readme [EXTRACTED 1.00]
- **Customer-scoped master data with role-based access** — claude_masters_customer_pattern, claude_role_based_access, claude_production_schedule, claude_licence_keys, claude_shifts_breaks [INFERRED 0.85]
- **Dark/light dual theme system** — theme_design_tokens, theme_light_theme_second_build, theme_theme_switching, 7thsense_ui_review [INFERRED 0.85]

## Communities (130 total, 3 thin omitted)

### Community 0 - "prop-types"
Cohesion: 0.27
Nodes (7): prop-types, ACTION_ICONS, BrandRow(), ControllerRow(), MachineCard(), ModelRow(), formatDate()

### Community 1 - "AddCustomer.jsx"
Cohesion: 0.09
Nodes (40): On page load, Save branch (add / edit form), On page load, Choose the user's machines (Access card), On page load, Save user (add / edit form), On page load, On page load (+32 more)

### Community 2 - "BarLineChart.jsx"
Cohesion: 0.17
Nodes (40): Shared components used, recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), axisPropTypes, renderGrid(), renderLegend() (+32 more)

### Community 3 - "liveSocket.js"
Cohesion: 0.14
Nodes (32): useMachineLive(), applyAnswer(), applyStatus(), applyValues(), checkSession(), connectionListeners, EMPTY_STATE, getLiveConnectError() (+24 more)

### Community 4 - "Productivity.jsx"
Cohesion: 0.07
Nodes (49): ModeTimelineCard(), readoutClock, readoutTime, chartMessage(), dayLabel, pickedMachineIds(), Productivity(), programIn() (+41 more)

### Community 5 - "Speedometer.jsx"
Cohesion: 0.28
Nodes (8): TRACK_COLOR, clamp(), Needle(), PIE_PROPS, polar(), Speedometer(), TRACK_RADIUS, ZONE_RADIUS

### Community 6 - "LicenceKeyGenerator.jsx"
Cohesion: 0.17
Nodes (18): Other, StatusToggle(), DEFAULT_DURATION, DURATION_VALUES, editSchema, GENERATE_INITIAL_VALUES, generateSchema, LICENCE_DURATIONS (+10 more)

### Community 7 - "AxisValuesCard.jsx"
Cohesion: 0.17
Nodes (21): Axis Values (X, Y, Z), AXIS_DECIMALS, AXIS_MAX_RAW_VALUES, AXIS_MIN_ZOOM_MS, AXIS_RANGES, AXIS_REFRESH_MAX_MINUTES, AXIS_REFRESH_MS, AXIS_SETS (+13 more)

### Community 8 - "CustomerList.jsx"
Cohesion: 0.39
Nodes (6): isAccountOfKind(), CustomerList(), CustomerList, deleteUser(), ADR-0018, loginAsUrl()

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "0002. React Router with one route table and role guards"
Cohesion: 0.20
Nodes (9): 0002. React Router with one route table and role guards, Alternatives considered, Consequences, Context, Decision, Coming soon (unbuilt sidebar links), Decisions, On page load (+1 more)

### Community 11 - "Loader"
Cohesion: 0.10
Nodes (28): react-router-dom, ErrorBoundary, Loader(), isAlsoActive(), linkClass(), navLeafShape, SidebarItem(), NAV_SECTIONS (+20 more)

### Community 12 - "AddPart.jsx"
Cohesion: 0.11
Nodes (31): react-hook-form, byName(), checkDrawing, DrawingUpload(), MachinePicker(), summary(), DRAWING_RULES, EMPTY_PROCESS (+23 more)

### Community 13 - "BreakFormModal.jsx"
Cohesion: 0.35
Nodes (8): SHIFT_STATUS, breakSchema, INITIAL_VALUES, MAX_LENGTH, toBreakPayload(), toFormValues(), BreakFormModal(), FIELD_HELP

### Community 14 - "SidebarProvider.jsx"
Cohesion: 0.35
Nodes (9): LiveClock(), CLOCK_TICK_MS, LoginClock(), formatClockTime(), formatLongDate(), formatOrdinalDate(), formatTime12(), formatWeekday() (+1 more)

### Community 15 - "AddProductionSchedule.jsx"
Cohesion: 0.13
Nodes (24): AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel(), EMPTY_ITEM, idText(), INITIAL_VALUES (+16 more)

### Community 16 - "productivity.md"
Cohesion: 0.09
Nodes (23): 0012. Monitoring: Productivity and Machine Health on one tabbed page, Alternatives considered, Consequences, Context, Decision, 0013. Monitoring starts with a machine list; All Machines is set-up only, Alternatives considered, Consequences (+15 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+9 more)

### Community 18 - "intelligenceSettings.js"
Cohesion: 0.08
Nodes (46): API calls on this page, Change the period or the customer, Decisions, Findings, On page load, Plant Intelligence, State & storage, UI states (+38 more)

### Community 19 - "IconAction"
Cohesion: 0.16
Nodes (18): IconAction(), StatusBadge(), BreakRow(), ClienteleRow(), dayLabel(), HolidayRow(), durationLabel(), LicenceKeyRow() (+10 more)

### Community 20 - "0001. Single-page app with React 19 and Vite"
Cohesion: 0.33
Nodes (5): 0001. Single-page app with React 19 and Vite, Alternatives considered, Consequences, Context, Decision

### Community 21 - "pages.jsx"
Cohesion: 0.10
Nodes (22): byBrandControllerName(), compareText(), matchesSearch(), ModelList(), REASON_KIND, About, AccountCenterPage, AddBranch (+14 more)

### Community 22 - "App.jsx"
Cohesion: 0.48
Nodes (5): Toaster(), ICONS, ToastItem(), getToasts(), subscribeToasts()

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
Cohesion: 0.16
Nodes (18): ADR-0013, On page load, buildChecks(), buildVerdict(), DEFAULT_LIVE_INTERVAL, DIAGNOSTICS_REFRESH_MS, socketCheck(), dateTime (+10 more)

### Community 27 - "dateTime.js"
Cohesion: 0.13
Nodes (21): assignRef(), PickerField(), POPPER_CONFIG, centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel() (+13 more)

### Community 28 - "OpsPanels.jsx"
Cohesion: 0.10
Nodes (40): NoResults(), modeTypeOf(), machineMonitorPath(), MONITORING_MACHINE_TABS, MONITORING_PATHS, MONITORING_SEARCH_PARAM, FLEET_MODES, secondsInMode() (+32 more)

### Community 29 - "package.json"
Cohesion: 0.09
Nodes (20): name, private, type, version, axios, bootstrap, eslint, @eslint/js (+12 more)

### Community 30 - "app-shell.md"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Log out other device and continue (conflict modal), Login, Shared components used, State & storage, Submit login form, UI states

### Community 31 - "UserGuide.jsx"
Cohesion: 0.18
Nodes (18): navLinks(), NUMBERED_STEPS, OpenLink(), SectionCard(), SECTIONS, SetupStep(), textOf(), UserGuide() (+10 more)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "MachinePlcVariables.jsx"
Cohesion: 0.15
Nodes (24): Change a node ID, Live value, countOf(), ADR-0020, NO_VALUES, withReader(), withRow(), clock (+16 more)

### Community 34 - "sharedGet"
Cohesion: 0.15
Nodes (22): Decision, On page load, On page load, On page load, On page load, On page load, On page load, sharedGet() (+14 more)

### Community 35 - "react"
Cohesion: 0.17
Nodes (20): Decision, react, STORAGE_KEYS, AuthContext, OrgUserContext, useAuth(), MachineBrowser(), matchesSearch() (+12 more)

### Community 36 - "useOrgUser"
Cohesion: 0.14
Nodes (16): 0023. One list, row and form for the name-under-a-parent organization levels, Alternatives considered, Consequences, Context, Decision, useOrgUser(), BranchRow(), CountryRow() (+8 more)

### Community 37 - "dateTime.js"
Cohesion: 0.20
Nodes (21): DateRangePicker(), DEFAULT_PRESETS, earlier(), later(), normalizeRange(), RangePanel(), sameRange(), buildDate() (+13 more)

### Community 38 - "All machines"
Cohesion: 0.22
Nodes (9): All machines, API calls on this page, Decisions, Delete machine, Edit machine, On page load, Shared components used, State & storage (+1 more)

### Community 39 - "healthSensors.js"
Cohesion: 0.07
Nodes (55): niceTicks(), STEP_MULTIPLES, MACHINE_MODES, buildDay(), dayLabel, dayLoad(), dayStates(), dayWindow() (+47 more)

### Community 40 - "userShopService.js"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete user shop, Shared components used, Shops, State & storage, UI states

### Community 42 - "VirtualScreen.jsx"
Cohesion: 0.06
Nodes (49): What the screen shows, 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents), ADR-0009, ADR-0021, LIVE_CHANNELS (+41 more)

### Community 43 - "diagnosticsSettings.js"
Cohesion: 0.24
Nodes (12): Check machine (is the machine on?), CHECK_LABELS, CHECK_STATUS, ADR-0021, MACHINE_STATE, machineStateLook(), NETWORK_ROWS, networkRowLabel() (+4 more)

### Community 44 - "StateFormModal.jsx"
Cohesion: 0.12
Nodes (28): country-region-data, MultiSelectPicker(), summary(), toGroups(), OrgCustomerField(), ALL_COUNTRIES, byName, findLibraryCountry() (+20 more)

### Community 45 - "customerForm.js"
Cohesion: 0.06
Nodes (72): libphonenumber-js, customerLabel(), ALL_MACHINE_ROLES, CUSTOMER_ROLE_ID, ROLE_LABELS, THEMES, USER_STATUS, COUNTRIES (+64 more)

### Community 46 - "Downtime / idle reasons"
Cohesion: 0.16
Nodes (19): API calls on this page, Decisions, Delete downtime reason, Delete idle reason, Downtime / idle reasons, On page load, Save downtime reason (add / edit form), Save idle reason (add / edit form) (+11 more)

### Community 47 - "OperationsCenter.jsx"
Cohesion: 0.12
Nodes (45): Decision, On page load, Shared components used, MONITOR_REFRESH_MS, useLoad(), customerOptionLabel(), dayTitle, Home() (+37 more)

### Community 48 - "AddMachine.jsx"
Cohesion: 0.07
Nodes (45): 0007. Recharts for charts, plain SVG for the Gantt, Alternatives considered, Consequences, Context, Decision, clockMinutes, clockWithSeconds, ModeGanttChart() (+37 more)

### Community 49 - "DiagnosticsPlcVariables.jsx"
Cohesion: 0.20
Nodes (13): clock, dayClock, DiagnosticsPlcVariables(), Fact(), ADR-0021, NO_VALUES, policyName(), when() (+5 more)

### Community 50 - "BrandFormModal.jsx"
Cohesion: 0.32
Nodes (9): brandSchema, INITIAL_VALUES, MAX_LENGTH, toBrandPayload(), toFormValues(), BrandFormModal(), FIELD_HELP, createBrand() (+1 more)

### Community 51 - "AuthProvider.jsx"
Cohesion: 0.28
Nodes (11): Click Log out, Session ended, App(), isSessionEnded(), sessionEndedMessage(), AuthProvider(), OrgUserProvider(), onUnauthorized() (+3 more)

### Community 52 - "User guide"
Cohesion: 0.25
Nodes (8): Decisions, On page load, Rules & edge cases, Sections, Shared components used, State & storage, UI states, User guide

### Community 53 - "IntelligencePanels.jsx"
Cohesion: 0.14
Nodes (25): Decision, Rules & edge cases, UNKNOWN_MODE_COLOR, HourlyCard(), tileShape, TimeCard(), AttentionCard(), MachineCell() (+17 more)

### Community 54 - "react-bootstrap"
Cohesion: 0.08
Nodes (78): Decision, Shared components used, UI states, UI states, UI states, react-bootstrap, ConfirmModal(), ARIA_SORT (+70 more)

### Community 55 - "MonitorMachineCard.jsx"
Cohesion: 0.25
Nodes (13): MACHINE_STATUS, MachineMode(), MachineRow(), MachineCycles(), MachineOee(), NoValue(), OEE_PARTS, oeeVariant() (+5 more)

### Community 56 - "OperatorTaskEditor.jsx"
Cohesion: 0.17
Nodes (23): OperatorTaskEditor(), findTask(), groupModels(), INITIAL_VALUES, normalise(), operatorTaskSchema, REQUIRED_FIELDS, TASK_MAX_LENGTH (+15 more)

### Community 57 - "modeReasonForm.js"
Cohesion: 0.18
Nodes (24): Add a downtime or idle reason, clockFormat, dateValue(), dayFormat, firstFreeSpan(), floorMinute(), formatClock(), formatDay() (+16 more)

### Community 58 - "ModelFormModal.jsx"
Cohesion: 0.26
Nodes (12): Save model (add / edit form), ControllerOptions(), groupByBrand(), INITIAL_VALUES, modelSchema, NAME_MAX_LENGTH, toFormValues(), toModelPayload() (+4 more)

### Community 59 - "toast"
Cohesion: 0.21
Nodes (15): BRANCH_STATUS, branchSchema, INITIAL_VALUES, optional(), REQUIRED_FIELDS, toBranchPayload(), toFormValues(), toId() (+7 more)

### Community 60 - "unwrap"
Cohesion: 0.11
Nodes (25): Save break (add / edit form), View customer (log in as), Save machine (add / edit form), Save production schedule (add / edit form), Save shift (add / edit form), apiClient, pendingGets, unauthorizedListeners (+17 more)

### Community 61 - "DatePicker.jsx"
Cohesion: 0.18
Nodes (17): ChartDateFilter(), clamp(), DateCalendar(), DatePicker(), dayLabel, keyToDay(), monthGrid(), monthName (+9 more)

### Community 62 - "ReasonFormModal.jsx"
Cohesion: 0.20
Nodes (12): zod, INITIAL_VALUES, loginSchema, INITIAL_VALUES, MAX_LENGTH, REASON_STATUS, reasonSchema, toFormValues() (+4 more)

### Community 63 - "Licence keys"
Cohesion: 0.18
Nodes (11): API calls on this page, Decisions, Delete licence key, Generate licence keys, Licence keys, On page load, Save licence key (add / edit form), Save licence keys (add / edit form) (+3 more)

### Community 64 - "0014. Business Setup renamed Account Center; old Account Center item removed"
Cohesion: 0.40
Nodes (5): 0014. Business Setup renamed Account Center; old Account Center item removed, Alternatives considered, Consequences, Context, Decision

### Community 65 - "Add / edit part"
Cohesion: 0.15
Nodes (18): Add / edit part, API calls on this page, Decisions, Save part (add / edit form), Shared components used, State & storage, UI states, Upload part drawing (+10 more)

### Community 66 - "0008. Folder structure by page and by concern"
Cohesion: 0.33
Nodes (5): 0008. Folder structure by page and by concern, Alternatives considered, Consequences, Context, Decision

### Community 67 - "Brands"
Cohesion: 0.22
Nodes (9): API calls on this page, Brands, Decisions, Delete brand, On page load, Save brand (add / edit form), Shared components used, State & storage (+1 more)

### Community 68 - "HolidayFormModal.jsx"
Cohesion: 0.25
Nodes (12): Save holiday (add / edit form), HOLIDAY_TYPES, holidaySchema, INITIAL_VALUES, MAX_LENGTH, toFormValues(), toHolidayPayload(), HolidayFormModal() (+4 more)

### Community 69 - "0006. React-Bootstrap with SCSS design tokens"
Cohesion: 0.33
Nodes (5): 0006. React-Bootstrap with SCSS design tokens, Alternatives considered, Consequences, Context, Decision

### Community 70 - "UserSessions.jsx"
Cohesion: 0.29
Nodes (9): MySessions(), UserSessions(), getMySessions(), getUserSessions(), ADR-0014, revokeAllUserSessions(), revokeMyOtherSessions(), revokeMySession() (+1 more)

### Community 71 - "ControllerFormModal.jsx"
Cohesion: 0.29
Nodes (10): Save controller (add / edit form), controllerSchema, INITIAL_VALUES, MAX_LENGTH, toControllerPayload(), toFormValues(), ControllerFormModal(), FIELD_HELP (+2 more)

### Community 72 - "Countries"
Cohesion: 0.22
Nodes (9): API calls on this page, Countries, Decisions, Delete user country, On page load, Save user country (add / edit form), Shared components used, State & storage (+1 more)

### Community 73 - "app.js"
Cohesion: 0.12
Nodes (24): ACCOUNT_CENTER_PATHS, ACCOUNT_CENTER_TABS, LANGUAGES, MANAGERS, ROLES, SUPERADMIN_ONLY, TOAST_DEFAULTS, HolidaySetup() (+16 more)

### Community 74 - "ShiftCard.jsx"
Cohesion: 0.29
Nodes (10): ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, SHIFT_TYPES, WEEKDAYS, Clock(), minutesBetween(), ShiftCard(), toMinutes() (+2 more)

### Community 75 - "MachineAccuracyEditor.jsx"
Cohesion: 0.28
Nodes (11): FieldLabel(), InfoTooltip(), MachineAccuracyEditor(), ACCURACY_MAX_LENGTH, accuracySchema, INITIAL_VALUES, toAccuracyName(), toFormValues() (+3 more)

### Community 76 - "MachinePlcVariables"
Cohesion: 0.36
Nodes (10): Reset to default, MachinePlcVariables(), withoutKeys(), getMachinePlcVariables(), ADR-0020, path(), resetMachinePlcVariable(), resetMachinePlcVariables() (+2 more)

### Community 77 - "0003. Server state via service modules and useLoad, Context only for the session"
Cohesion: 0.40
Nodes (4): 0003. Server state via service modules and useLoad, Context only for the session, Alternatives considered, Consequences, Context

### Community 78 - "Machine diagnostics"
Cohesion: 0.22
Nodes (9): API calls on this page, Decisions, Machine diagnostics, PLC variables (OPC UA), Shared components used, State & storage, The checks, UI states (+1 more)

### Community 79 - "ShiftFormModal.jsx"
Cohesion: 0.28
Nodes (13): clock(), EMPTY_BREAK_ROW, INITIAL_VALUES, MAX_BREAKS, MAX_LENGTH, offset(), shiftSchema(), toFormValues() (+5 more)

### Community 80 - "theme.js"
Cohesion: 0.18
Nodes (17): bootstrap-icons, @fontsource-variable/roboto, react-dom, @/assets/scss/theme-light.scss?inline, DEFAULT_THEME, useTheme(), applyTheme(), chooseTheme() (+9 more)

### Community 81 - "0022. Ponytail plugin for Claude Code, under this repo's rules"
Cohesion: 0.33
Nodes (5): 0022. Ponytail plugin for Claude Code, under this repo's rules, Alternatives considered, Consequences, Context, Decision

### Community 82 - "DiagnosticsVariables.jsx"
Cohesion: 0.31
Nodes (8): formatValue(), LIVE_INTERVALS, VARIABLE_FILTERS, variableState(), clock, dayClock, DiagnosticsVariables(), VariableCard

### Community 83 - "Machine health"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Live updates, Machine health, Shared components used, State & storage, UI states, Zoom the axis charts

### Community 84 - "Tool List and Tool Life (machine tabs)"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, On page load, Rules & edge cases, Shared components used, State & storage, Tool List and Tool Life (machine tabs), UI states

### Community 85 - "Page flows"
Cohesion: 0.15
Nodes (13): Dashboard, Masters, Masters › Downtime, Masters › Organization, Masters › Shift, Masters › Users, Operations, Operations › Monitoring (+5 more)

### Community 87 - "Operator tasks"
Cohesion: 0.10
Nodes (19): API calls on this page, Decisions, Delete operator task, New task (add to the task list), On page load, Operator tasks, Save operator task (add / edit form), Shared components used (+11 more)

### Community 88 - "My sessions"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Log out all other sessions, Log out one session, My sessions, On page load, Shared components used, State & storage

### Community 89 - "0005. Forms with react-hook-form and zod"
Cohesion: 0.33
Nodes (5): 0005. Forms with react-hook-form and zod, Alternatives considered, Consequences, Context, Decision

### Community 90 - "session.js"
Cohesion: 0.25
Nodes (7): ADR-0027, ADR-0014, REVOKE_REASONS, REVOKED_MESSAGES, SESSION_CODES, SESSION_MODES, ADR-0014

### Community 91 - "0009. Page-wise flow documentation in docs/pages"
Cohesion: 0.33
Nodes (5): 0009. Page-wise flow documentation in docs/pages, Alternatives considered, Consequences, Context, Decision

### Community 92 - "Virtual Screen (machine tab)"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, On page load, Rules & edge cases, Shared components used, State & storage, UI states, Virtual Screen (machine tab)

### Community 93 - "Customers / Users list"
Cohesion: 0.06
Nodes (32): API calls on this page, App shell (session, logout, theme), Change theme, Decisions, On page load, Shared components used, State & storage, UI states (+24 more)

### Community 94 - "Decision"
Cohesion: 0.29
Nodes (7): Decision, 0027. Session message codes worded on the client, and a conflict modal at login, Alternatives considered, Consequences, Context, Decision, notifyUnauthorized()

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
Cohesion: 0.08
Nodes (44): On page load, Save user cell (add / edit form), Save user city (add / edit form), Save user line (add / edit form), Save user location (add / edit form), Save user shop (add / edit form), On page load, Save user supervisor (add / edit form) (+36 more)

### Community 99 - "0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page"
Cohesion: 0.40
Nodes (5): 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page, Alternatives considered, Consequences, Context, Decision

### Community 101 - "Locations"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete user location, Locations, Shared components used, State & storage, UI states

### Community 102 - "Clientele"
Cohesion: 0.29
Nodes (7): API calls on this page, Clientele, Decisions, Delete clientele, Shared components used, State & storage, UI states

### Community 103 - "clienteleService.js"
Cohesion: 0.38
Nodes (6): On page load, Save clientele (add / edit form), createClientele(), getClienteleById(), getClienteles(), updateClientele()

### Community 104 - "Productivity"
Cohesion: 0.25
Nodes (8): API calls on this page, Change the Machine Modes period, Decisions, Live updates, Productivity, Shared components used, State & storage, UI states

### Community 105 - "Login.jsx"
Cohesion: 0.13
Nodes (23): BrandLogo(), LOGO_MARKUP, Footer(), AppShell(), Sidebar(), displayName(), Topbar(), env (+15 more)

### Community 106 - "operatorScheduleSettings.js"
Cohesion: 0.44
Nodes (10): OperatorJobRow(), OperatorSchedule(), dateLabel(), EMPTY_FILTERS, filterOptions(), machineLabel(), matchesSearch(), partLabel() (+2 more)

### Community 107 - "Controllers"
Cohesion: 0.29
Nodes (7): API calls on this page, Controllers, Decisions, Delete controller, Shared components used, State & storage, UI states

### Community 108 - "Holidays / week off"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete holiday, Holidays / week off, On page load, Shared components used, State & storage, UI states

### Community 109 - "User sessions"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Log out one session / Log out all, On page load, Shared components used, State & storage, User sessions

### Community 110 - "Cells"
Cohesion: 0.09
Nodes (20): 0017. Log in as customer in a new tab, on the tab's own API path, Alternatives considered, Consequences, Context, Decision, API calls on this page, Cells, Decisions (+12 more)

### Community 111 - "Supervisors"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete user supervisor, Shared components used, State & storage, Supervisors, UI states

### Community 112 - "Machine PLC node IDs"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Machine PLC node IDs, On page load, Rules & edge cases, State & storage, Test a node ID

### Community 113 - "Operator wise production schedule"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, On page load, Operator wise production schedule, Search (apply filters), Shared components used, State & storage, UI states

### Community 114 - "ProtectedRoute"
Cohesion: 0.03
Nodes (75): About, Decisions, State & storage, UI states, Add / edit branch, API calls on this page, Decisions, Shared components used (+67 more)

### Community 115 - "Machine models"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete model, Machine models, Shared components used, State & storage, UI states

### Community 116 - "0004. Axios client with the HttpOnly session cookie"
Cohesion: 0.33
Nodes (5): 0004. Axios client with the HttpOnly session cookie, Alternatives considered, Consequences, Context, Decision

### Community 117 - "PlannedTab.jsx"
Cohesion: 0.60
Nodes (3): PlannedTab(), ToolLife(), ToolList()

### Community 118 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 119 - "0010. Organization levels on one tabbed page, a route per tab"
Cohesion: 0.40
Nodes (5): 0010. Organization levels on one tabbed page, a route per tab, Alternatives considered, Consequences, Context, Decision

### Community 120 - "IntelligencePanels.jsx"
Cohesion: 0.19
Nodes (28): ChartCard(), monitoringSearchPath(), DayCard(), FleetCard(), KpiTile(), TileRow(), fleetModeCounts(), scoreTone() (+20 more)

### Community 121 - "PartList.jsx"
Cohesion: 0.60
Nodes (4): matchesSearch(), PartList(), PartList, deletePart()

### Community 122 - "Production schedules"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete production schedule, On page load, Production schedules, Shared components used, State & storage, UI states

### Community 124 - "0015. Clientele is a Masters page, not an Account Center tab"
Cohesion: 0.50
Nodes (4): 0015. Clientele is a Masters page, not an Account Center tab, Alternatives considered, Consequences, Context

### Community 125 - "States"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete user state, Save user state (add / edit form), Shared components used, State & storage, States, UI states

### Community 126 - "0018. Log in as customer opens the dashboard directly (no /login-as page)"
Cohesion: 0.33
Nodes (6): 0018. Log in as customer opens the dashboard directly (no /login-as page), Alternatives considered, Consequences, Context, Decision, takeLoginAsFromUrl()

### Community 127 - "Client documentation"
Cohesion: 0.50
Nodes (4): Client documentation, How to use Postman, How to view the API docs in Chrome (Swagger UI), How to view the page flow docs

### Community 128 - "0024. Operations Center: a second dashboard beside Home, on the existing APIs"
Cohesion: 0.40
Nodes (4): 0024. Operations Center: a second dashboard beside Home, on the existing APIs, Alternatives considered, Consequences, Context

### Community 129 - "0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before"
Cohesion: 0.33
Nodes (5): 0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before, Alternatives considered, Consequences, Context, Decision

### Community 130 - "0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day"
Cohesion: 0.40
Nodes (4): 0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day, Alternatives considered, Consequences, Context

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **42 isolated node(s):** `ADR-0020`, `ADR-0020`, `ADR-0014`, `ADR-0024`, `ADR-0025` (+37 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 574 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProtectedRoute()` connect `ProtectedRoute` to `0002. React Router with one route table and role guards`, `Loader`, `intelligenceSettings.js`, `react`, `All machines`, `userShopService.js`, `Downtime / idle reasons`, `User guide`, `Licence keys`, `Add / edit part`, `Brands`, `Countries`, `Machine diagnostics`, `Machine health`, `Tool List and Tool Life (machine tabs)`, `Operator tasks`, `My sessions`, `Virtual Screen (machine tab)`, `Customers / Users list`, `Machine accuracy`, `Operations Center`, `Monitoring (machine list)`, `Locations`, `Clientele`, `Productivity`, `Controllers`, `Holidays / week off`, `User sessions`, `Cells`, `Supervisors`, `Machine PLC node IDs`, `Operator wise production schedule`, `Machine models`, `Production schedules`, `States`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Loader()` (e.g. with `Shared components used` and `UI states`) actually correct?**
  _`Loader()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ADR-0020`, `ADR-0020`, `ADR-0014` to the rest of the system?**
  _42 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AddCustomer.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09191583610188261 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `prop-types`, `BarLineChart.jsx`, `liveSocket.js`, `Productivity.jsx`, `Speedometer.jsx`, `LicenceKeyGenerator.jsx`, `AxisValuesCard.jsx`, `CustomerList.jsx`, `Loader`, `AddPart.jsx`, `BreakFormModal.jsx`, `SidebarProvider.jsx`, `AddProductionSchedule.jsx`, `IconAction`, `pages.jsx`, `App.jsx`, `MachineDiagnostics.jsx`, `dateTime.js`, `OpsPanels.jsx`, `package.json`, `UserGuide.jsx`, `MachinePlcVariables.jsx`, `useOrgUser`, `dateTime.js`, `healthSensors.js`, `VirtualScreen.jsx`, `StateFormModal.jsx`, `customerForm.js`, `OperationsCenter.jsx`, `AddMachine.jsx`, `DiagnosticsPlcVariables.jsx`, `BrandFormModal.jsx`, `AuthProvider.jsx`, `IntelligencePanels.jsx`, `react-bootstrap`, `OperatorTaskEditor.jsx`, `modeReasonForm.js`, `ModelFormModal.jsx`, `toast`, `DatePicker.jsx`, `ReasonFormModal.jsx`, `HolidayFormModal.jsx`, `ControllerFormModal.jsx`, `app.js`, `ShiftCard.jsx`, `MachineAccuracyEditor.jsx`, `ShiftFormModal.jsx`, `theme.js`, `DiagnosticsVariables.jsx`, `Login.jsx`, `operatorScheduleSettings.js`, `IntelligencePanels.jsx`, `PartList.jsx`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Should `liveSocket.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1354723707664884 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._