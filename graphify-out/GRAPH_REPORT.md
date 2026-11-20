# Graph Report - 7th-sense-client  (2026-11-20)

## Corpus Check
- 392 files · ~239,163 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 2492 nodes · 8634 edges · 140 communities (137 shown, 3 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 617 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `79c1af6d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- prop-types
- unwrapList
- BarLineChart.jsx
- liveSocket.js
- Productivity.jsx
- Speedometer.jsx
- LicenceKeyGenerator.jsx
- AxisValuesCard.jsx
- react
- Project Docs & Conventions
- 0002. React Router with one route table and role guards
- DateRangePicker.jsx
- AddPart.jsx
- BreakFormModal.jsx
- AccountCenterPage.jsx
- AddProductionSchedule.jsx
- Runtime Dependencies
- intelligenceSettings.js
- CountryFormModal.jsx
- 0001. Single-page app with React 19 and Vite
- Loader
- TaskListEditor.jsx
- 0016. Account Center is superadmin only; Users lists company members only
- devDependencies
- jsconfig Aliases
- MachineDiagnostics.jsx
- dateTime.js
- operationsSettings.js
- package.json
- userCountryService.js
- UserGuide.jsx
- Login Logo Asset
- MachinePlcVariables.jsx
- sharedGet
- routes.js
- react-hook-form
- dateTime.js
- All machines
- healthSensors.js
- userShopService.js
- chartLegend.jsx
- VirtualScreen.jsx
- diagnosticsSettings.js
- StateFormModal.jsx
- AddCustomer.jsx
- Downtime / idle reasons
- OperationsCenter.jsx
- AddMachine.jsx
- DiagnosticsPlcVariables.jsx
- BrandFormModal.jsx
- AuthProvider.jsx
- User guide
- HomeCards.jsx
- react-bootstrap
- MonitorMachineCard.jsx
- OperatorTaskEditor.jsx
- modeReasonForm.js
- ModelFormModal.jsx
- toast
- unwrap
- Topbar.jsx
- ReasonFormModal.jsx
- Licence keys
- 0014. Business Setup renamed Account Center; old Account Center item removed
- Add / edit part
- 0008. Folder structure by page and by concern
- Monitoring (machine list)
- HolidayFormModal.jsx
- 0006. React-Bootstrap with SCSS design tokens
- ConfirmModal
- ControllerFormModal.jsx
- Countries
- helpers.js
- ShiftCard.jsx
- MachineAccuracyEditor.jsx
- Brands
- 0003. Server state via service modules and useLoad, Context only for the session
- Production schedules
- ShiftFormModal.jsx
- theme.js
- 0022. Ponytail plugin for Claude Code, under this repo's rules
- Supervisors
- Productivity
- Tool List and Tool Life (machine tabs)
- Page flows
- ChartTooltip.jsx
- Operator tasks
- toast.js
- 0005. Forms with react-hook-form and zod
- session.js
- 0009. Page-wise flow documentation in docs/pages
- Machine models
- App shell (session, logout, theme)
- 0020. Virtual Screen: one REST snapshot polled every 5 s
- Machine accuracy
- Operations Center
- catalogService.js
- unwrapList
- 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page
- adr/README.md
- Locations
- Clientele
- Add / edit production schedule
- Branches
- Topbar.jsx
- operatorScheduleSettings.js
- Controllers
- Holidays / week off
- My sessions
- Parts
- Cells
- Machine PLC node IDs
- Operator wise production schedule
- ProtectedRoute
- Task list
- ProcessFields.jsx
- PlannedTab.jsx
- scripts
- 0010. Organization levels on one tabbed page, a route per tab
- IntelligencePanels.jsx
- Breaks
- Home (Dashboard)
- Cities
- 0004. Axios client with the HttpOnly session cookie
- States
- loginAs.js
- Client documentation
- 0024. Operations Center: a second dashboard beside Home, on the existing APIs
- 0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before
- Customer / user detail
- Shifts
- vite.config.js
- 0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day
- 0021. Virtual Screen: live values over Socket.IO, REST for derived data
- 0012. Monitoring: Productivity and Machine Health on one tabbed page
- 0013. Monitoring starts with a machine list; All Machines is set-up only
- Theme showcase
- 0019. Monitoring: machine list, then the machine's tabs with a back arrow
- machineTypeLabel

## God Nodes (most connected - your core abstractions)
1. `react` - 148 edges
2. `prop-types` - 127 edges
3. `unwrap()` - 118 edges
4. `react-bootstrap` - 116 edges
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

## Communities (140 total, 3 thin omitted)

### Community 0 - "prop-types"
Cohesion: 0.16
Nodes (22): prop-types, IconAction(), StatusBadge(), ACTION_ICONS, WEEKDAYS, BrandRow(), BreakRow(), ControllerRow() (+14 more)

### Community 1 - "unwrapList"
Cohesion: 0.15
Nodes (17): On page load, On page load, apiClient, pendingGets, unauthorizedListeners, unwrapList(), getBranchById(), getBreaks() (+9 more)

### Community 2 - "BarLineChart.jsx"
Cohesion: 0.18
Nodes (39): Shared components used, recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), axisPropTypes, renderGrid(), renderLegend() (+31 more)

### Community 3 - "liveSocket.js"
Cohesion: 0.12
Nodes (37): Decision, Click Log out, useMachineLive(), notifyUnauthorized(), logout(), applyAnswer(), applyStatus(), applyValues() (+29 more)

### Community 4 - "Productivity.jsx"
Cohesion: 0.07
Nodes (53): UNKNOWN_MODE_COLOR, useLoad(), withDayLabels(), ModeTimelineCard(), readoutClock, readoutTime, chartMessage(), dayLabel (+45 more)

### Community 5 - "Speedometer.jsx"
Cohesion: 0.24
Nodes (9): STATUS_COLORS, TRACK_COLOR, clamp(), Needle(), PIE_PROPS, polar(), Speedometer(), TRACK_RADIUS (+1 more)

### Community 6 - "LicenceKeyGenerator.jsx"
Cohesion: 0.23
Nodes (14): DEFAULT_DURATION, DURATION_VALUES, editSchema, GENERATE_INITIAL_VALUES, generateSchema, LICENCE_DURATIONS, LICENCE_KEY_STATUS, MAX_KEYS (+6 more)

### Community 7 - "AxisValuesCard.jsx"
Cohesion: 0.10
Nodes (30): API calls on this page, Axis Values (X, Y, Z), Decisions, Live updates, Machine health, On page load, Shared components used, State & storage (+22 more)

### Community 8 - "react"
Cohesion: 0.14
Nodes (31): react, customerLabel(), ALL_MACHINE_ROLES, CUSTOMER_ROLE_ID, MANAGERS, ROLE_LABELS, ROLES, SUPERADMIN_ONLY (+23 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "0002. React Router with one route table and role guards"
Cohesion: 0.18
Nodes (9): 0002. React Router with one route table and role guards, Alternatives considered, Consequences, Context, Decision, Coming soon (unbuilt sidebar links), Decisions, On page load (+1 more)

### Community 11 - "DateRangePicker.jsx"
Cohesion: 0.17
Nodes (19): ChartDateFilter(), DatePicker(), DateRangePicker(), DEFAULT_PRESETS, earlier(), later(), normalizeRange(), RangePanel() (+11 more)

### Community 12 - "AddPart.jsx"
Cohesion: 0.14
Nodes (26): Save part (add / edit form), AddPart(), byName(), EMPTY_PROCESS, INITIAL_VALUES, MAX_PART_COUNT, MAX_PROCESSES, PART_STATUS (+18 more)

### Community 13 - "BreakFormModal.jsx"
Cohesion: 0.29
Nodes (10): Save break (add / edit form), breakSchema, INITIAL_VALUES, MAX_LENGTH, toBreakPayload(), toFormValues(), BreakFormModal(), FIELD_HELP (+2 more)

### Community 14 - "AccountCenterPage.jsx"
Cohesion: 0.25
Nodes (12): Footer(), AppShell(), MainLayout(), Sidebar(), isAlsoActive(), linkClass(), navLeafShape, SidebarItem() (+4 more)

### Community 15 - "AddProductionSchedule.jsx"
Cohesion: 0.11
Nodes (30): Save production schedule (add / edit form), AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel(), EMPTY_ITEM, idText() (+22 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+9 more)

### Community 18 - "intelligenceSettings.js"
Cohesion: 0.08
Nodes (46): Decision, API calls on this page, Change the period or the customer, Decisions, Findings, On page load, Plant Intelligence, UI states (+38 more)

### Community 19 - "CountryFormModal.jsx"
Cohesion: 0.26
Nodes (11): MultiSelectPicker(), summary(), toGroups(), OrgCustomerField(), countrySchema, INITIAL_VALUES, toCountryPayloads(), CountryFormModal() (+3 more)

### Community 20 - "0001. Single-page app with React 19 and Vite"
Cohesion: 0.33
Nodes (5): 0001. Single-page app with React 19 and Vite, Alternatives considered, Consequences, Context, Decision

### Community 21 - "Loader"
Cohesion: 0.06
Nodes (42): UI states, ErrorBoundary, Loader(), ACCOUNT_CENTER_PATHS, ACCOUNT_CENTER_TABS, NAV_SECTIONS, ORG_LEVEL, ORGANIZATION_PATHS (+34 more)

### Community 22 - "TaskListEditor.jsx"
Cohesion: 0.29
Nodes (11): TASK_MAX_LENGTH, TASK_STATUS, FIELD_HELP, TaskListEditor(), INITIAL_VALUES, taskSchema, toFormValues(), toTaskPayload() (+3 more)

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
Cohesion: 0.15
Nodes (19): ADR-0013, On page load, buildChecks(), buildVerdict(), DEFAULT_LIVE_INTERVAL, DIAGNOSTICS_REFRESH_MS, socketCheck(), DiagnosticsVariables() (+11 more)

### Community 27 - "dateTime.js"
Cohesion: 0.15
Nodes (18): centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel(), TimePicker(), EXCEPTIONS, FILTERS (+10 more)

### Community 28 - "operationsSettings.js"
Cohesion: 0.17
Nodes (22): On page load, secondsInMode(), unfinishedRate(), ACTION_LIMIT, alarmActions(), buildActions(), buildReadiness(), expiryAlert() (+14 more)

### Community 29 - "package.json"
Cohesion: 0.13
Nodes (16): name, private, type, version, axios, bootstrap, eslint, @eslint/js (+8 more)

### Community 30 - "userCountryService.js"
Cohesion: 0.17
Nodes (10): On page load, On page load, On page load, getUserCities(), createUserCountry(), deleteUserCountry(), getUserCountries(), createUserState() (+2 more)

### Community 31 - "UserGuide.jsx"
Cohesion: 0.20
Nodes (17): navLinks(), NUMBERED_STEPS, OpenLink(), SectionCard(), SECTIONS, SetupStep(), textOf(), UserGuide() (+9 more)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "MachinePlcVariables.jsx"
Cohesion: 0.12
Nodes (34): Live value, Reset to default, countOf(), ADR-0020, MachinePlcVariables(), NO_VALUES, withoutKeys(), withReader() (+26 more)

### Community 34 - "sharedGet"
Cohesion: 0.19
Nodes (17): On page load, On page load, On page load, On page load, sharedGet(), getClienteleById(), getClienteles(), getPartById() (+9 more)

### Community 35 - "routes.js"
Cohesion: 0.14
Nodes (22): Decision, react-router-dom, STORAGE_KEYS, ADR-0014, ADR-0024, ROUTES, AuthContext, useAuth() (+14 more)

### Community 36 - "react-hook-form"
Cohesion: 0.15
Nodes (15): 0023. One list, row and form for the name-under-a-parent organization levels, Alternatives considered, Consequences, Context, Decision, @hookform/resolvers, react-hook-form, zod (+7 more)

### Community 37 - "dateTime.js"
Cohesion: 0.17
Nodes (22): clamp(), DateCalendar(), dayLabel, keyToDay(), monthGrid(), monthName, MONTHS, monthTitle (+14 more)

### Community 38 - "All machines"
Cohesion: 0.22
Nodes (9): All machines, API calls on this page, Decisions, Delete machine, Edit machine, On page load, Shared components used, State & storage (+1 more)

### Community 39 - "healthSensors.js"
Cohesion: 0.07
Nodes (57): niceTicks(), STEP_MULTIPLES, MACHINE_MODES, buildDay(), dailyRows(), dayLabel, dayLoad(), dayStates() (+49 more)

### Community 40 - "userShopService.js"
Cohesion: 0.25
Nodes (7): API calls on this page, Decisions, Delete user shop, Shared components used, Shops, State & storage, UI states

### Community 42 - "VirtualScreen.jsx"
Cohesion: 0.05
Nodes (58): API calls on this page, Decisions, Live values (Socket.IO), On page load, Rules & edge cases, Shared components used, State & storage, UI states (+50 more)

### Community 43 - "diagnosticsSettings.js"
Cohesion: 0.13
Nodes (17): API calls on this page, Check machine (is the machine on?), Decisions, Machine diagnostics, Shared components used, State & storage, The checks, UI states (+9 more)

### Community 44 - "StateFormModal.jsx"
Cohesion: 0.19
Nodes (16): country-region-data, ALL_COUNTRIES, byName, findLibraryCountry(), getLibraryStateNames(), fromStateKey(), INITIAL_VALUES, keepStatesOf() (+8 more)

### Community 45 - "AddCustomer.jsx"
Cohesion: 0.05
Nodes (86): Save clientele (add / edit form), On page load, Add / edit customer or user, API calls on this page, Choose the user's machines (Access card), Decisions, On page load, Save user (add / edit form) (+78 more)

### Community 46 - "Downtime / idle reasons"
Cohesion: 0.15
Nodes (20): API calls on this page, Decisions, Delete downtime reason, Delete idle reason, Downtime / idle reasons, On page load, Save downtime reason (add / edit form), Save idle reason (add / edit form) (+12 more)

### Community 47 - "OperationsCenter.jsx"
Cohesion: 0.11
Nodes (39): Decision, Shared components used, MONITOR_REFRESH_MS, MONITORING_MACHINE_TABS, MONITORING_PATHS, MONITORING_SEARCH_PARAM, chartMessage(), clockLabel (+31 more)

### Community 48 - "AddMachine.jsx"
Cohesion: 0.07
Nodes (45): 0007. Recharts for charts, plain SVG for the Gantt, Alternatives considered, Consequences, Context, Decision, clockMinutes, clockWithSeconds, ModeGanttChart() (+37 more)

### Community 49 - "DiagnosticsPlcVariables.jsx"
Cohesion: 0.12
Nodes (26): PLC variables (OPC UA), dayClock, DiagnosticsPlcVariables(), Fact(), ADR-0021, NO_VALUES, plcReason(), plcState() (+18 more)

### Community 50 - "BrandFormModal.jsx"
Cohesion: 0.32
Nodes (9): brandSchema, INITIAL_VALUES, MAX_LENGTH, toBrandPayload(), toFormValues(), BrandFormModal(), FIELD_HELP, createBrand() (+1 more)

### Community 51 - "AuthProvider.jsx"
Cohesion: 0.16
Nodes (18): 0027. Session message codes worded on the client, and a conflict modal at login, Alternatives considered, Consequences, Context, Decision, Session ended, App(), Toaster() (+10 more)

### Community 52 - "User guide"
Cohesion: 0.22
Nodes (8): Decisions, On page load, Rules & edge cases, Sections, Shared components used, State & storage, UI states, User guide

### Community 53 - "HomeCards.jsx"
Cohesion: 0.11
Nodes (33): Decision, Rules & edge cases, customerOptionLabel(), dayTitle, Home(), HourlyCard(), tileShape, TimeCard() (+25 more)

### Community 54 - "react-bootstrap"
Cohesion: 0.12
Nodes (64): Decision, Shared components used, UI states, UI states, react-bootstrap, ConfirmModal(), ARIA_SORT, SortableHead() (+56 more)

### Community 55 - "MonitorMachineCard.jsx"
Cohesion: 0.25
Nodes (13): MACHINE_STATUS, MachineMode(), MachineRow(), MachineCycles(), MachineOee(), NoValue(), OEE_PARTS, oeeVariant() (+5 more)

### Community 56 - "OperatorTaskEditor.jsx"
Cohesion: 0.31
Nodes (12): OperatorTaskEditor(), findTask(), groupModels(), INITIAL_VALUES, normalise(), operatorTaskSchema, REQUIRED_FIELDS, toFormValues() (+4 more)

### Community 57 - "modeReasonForm.js"
Cohesion: 0.17
Nodes (21): Add a downtime or idle reason, clockFormat, dateValue(), dayFormat, firstFreeSpan(), floorMinute(), formatClock(), formatDay() (+13 more)

### Community 58 - "ModelFormModal.jsx"
Cohesion: 0.26
Nodes (12): Save model (add / edit form), ControllerOptions(), groupByBrand(), INITIAL_VALUES, modelSchema, NAME_MAX_LENGTH, toFormValues(), toModelPayload() (+4 more)

### Community 59 - "toast"
Cohesion: 0.14
Nodes (25): Save branch (add / edit form), State & storage, State & storage, BRANCH_STATUS, useOrgUser(), AddBranch(), labelClass(), branchSchema (+17 more)

### Community 60 - "unwrap"
Cohesion: 0.15
Nodes (17): Save machine (add / edit form), unwrap(), getSession(), login(), loginAs(), createLicenceKeys(), generateLicenceKeys(), getLicenceKeys() (+9 more)

### Community 61 - "Topbar.jsx"
Cohesion: 0.31
Nodes (6): BrandLogo(), LOGO_MARKUP, displayName(), Topbar(), env, LANGUAGES

### Community 62 - "ReasonFormModal.jsx"
Cohesion: 0.30
Nodes (9): INITIAL_VALUES, MAX_LENGTH, REASON_STATUS, reasonSchema, toFormValues(), toReasonPayload(), ReasonFormModal(), FIELD_HELP (+1 more)

### Community 63 - "Licence keys"
Cohesion: 0.18
Nodes (11): API calls on this page, Decisions, Delete licence key, Generate licence keys, Licence keys, On page load, Save licence key (add / edit form), Save licence keys (add / edit form) (+3 more)

### Community 64 - "0014. Business Setup renamed Account Center; old Account Center item removed"
Cohesion: 0.40
Nodes (5): 0014. Business Setup renamed Account Center; old Account Center item removed, Alternatives considered, Consequences, Context, Decision

### Community 65 - "Add / edit part"
Cohesion: 0.25
Nodes (8): Add / edit part, API calls on this page, Decisions, Shared components used, State & storage, UI states, Upload part drawing, View process drawing

### Community 66 - "0008. Folder structure by page and by concern"
Cohesion: 0.33
Nodes (5): 0008. Folder structure by page and by concern, Alternatives considered, Consequences, Context, Decision

### Community 67 - "Monitoring (machine list)"
Cohesion: 0.20
Nodes (10): API calls on this page, Decisions, Monitoring (machine list), On page load, Open productivity / health, Rules & edge cases, Shared components used, State & storage (+2 more)

### Community 68 - "HolidayFormModal.jsx"
Cohesion: 0.25
Nodes (12): Save holiday (add / edit form), HOLIDAY_TYPES, holidaySchema, INITIAL_VALUES, MAX_LENGTH, toFormValues(), toHolidayPayload(), HolidayFormModal() (+4 more)

### Community 69 - "0006. React-Bootstrap with SCSS design tokens"
Cohesion: 0.33
Nodes (5): 0006. React-Bootstrap with SCSS design tokens, Alternatives considered, Consequences, Context, Decision

### Community 70 - "ConfirmModal"
Cohesion: 0.19
Nodes (16): formatSessionTime(), ADR-0014, MySessions(), matchesSearch(), SessionTable(), ADR-0014, UserSessions(), MySessions (+8 more)

### Community 71 - "ControllerFormModal.jsx"
Cohesion: 0.23
Nodes (12): Save controller (add / edit form), FieldLabel(), InfoTooltip(), controllerSchema, INITIAL_VALUES, MAX_LENGTH, toControllerPayload(), toFormValues() (+4 more)

### Community 72 - "Countries"
Cohesion: 0.20
Nodes (9): API calls on this page, Countries, Decisions, Delete user country, On page load, Save user country (add / edit form), Shared components used, State & storage (+1 more)

### Community 73 - "helpers.js"
Cohesion: 0.35
Nodes (9): LiveClock(), CLOCK_TICK_MS, LoginClock(), formatClockTime(), formatLongDate(), formatOrdinalDate(), formatTime12(), formatWeekday() (+1 more)

### Community 74 - "ShiftCard.jsx"
Cohesion: 0.62
Nodes (6): Clock(), minutesBetween(), ShiftCard(), toMinutes(), typeLabel(), formatClock12()

### Community 75 - "MachineAccuracyEditor.jsx"
Cohesion: 0.38
Nodes (9): MachineAccuracyEditor(), ACCURACY_MAX_LENGTH, accuracySchema, INITIAL_VALUES, toAccuracyName(), toFormValues(), usageLabel(), createMachineAccuracy() (+1 more)

### Community 76 - "Brands"
Cohesion: 0.22
Nodes (9): API calls on this page, Brands, Decisions, Delete brand, On page load, Save brand (add / edit form), Shared components used, State & storage (+1 more)

### Community 77 - "0003. Server state via service modules and useLoad, Context only for the session"
Cohesion: 0.40
Nodes (4): 0003. Server state via service modules and useLoad, Context only for the session, Alternatives considered, Consequences, Context

### Community 78 - "Production schedules"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, Delete production schedule, On page load, Production schedules, Shared components used, State & storage, UI states

### Community 79 - "ShiftFormModal.jsx"
Cohesion: 0.18
Nodes (20): Save shift (add / edit form), ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, SHIFT_STATUS, SHIFT_TYPES, clock(), EMPTY_BREAK_ROW, INITIAL_VALUES (+12 more)

### Community 80 - "theme.js"
Cohesion: 0.16
Nodes (18): bootstrap-icons, @fontsource-variable/roboto, react-dom, @/assets/scss/theme-light.scss?inline, DEFAULT_THEME, THEME, THEMES, useTheme() (+10 more)

### Community 81 - "0022. Ponytail plugin for Claude Code, under this repo's rules"
Cohesion: 0.33
Nodes (5): 0022. Ponytail plugin for Claude Code, under this repo's rules, Alternatives considered, Consequences, Context, Decision

### Community 82 - "Supervisors"
Cohesion: 0.25
Nodes (7): API calls on this page, Decisions, Delete user supervisor, Shared components used, State & storage, Supervisors, UI states

### Community 83 - "Productivity"
Cohesion: 0.25
Nodes (8): API calls on this page, Change the Machine Modes period, Decisions, Live updates, Productivity, Shared components used, State & storage, UI states

### Community 84 - "Tool List and Tool Life (machine tabs)"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, On page load, Rules & edge cases, Shared components used, State & storage, Tool List and Tool Life (machine tabs), UI states

### Community 85 - "Page flows"
Cohesion: 0.12
Nodes (16): Dashboard, Masters, Masters › Downtime, Masters › Organization, Masters › Shift, Masters › Users, Operations, Operations › Monitoring (+8 more)

### Community 87 - "Operator tasks"
Cohesion: 0.20
Nodes (10): API calls on this page, Decisions, Delete operator task, New task (add to the task list), On page load, Operator tasks, Save operator task (add / edit form), Shared components used (+2 more)

### Community 88 - "toast.js"
Cohesion: 0.20
Nodes (13): TOAST_DEFAULTS, LicenceKeySetup(), matchesSearch(), STATUS_FILTERS, LicenceKeySetup, deleteLicenceKey(), dismiss(), emit() (+5 more)

### Community 89 - "0005. Forms with react-hook-form and zod"
Cohesion: 0.33
Nodes (5): 0005. Forms with react-hook-form and zod, Alternatives considered, Consequences, Context, Decision

### Community 90 - "session.js"
Cohesion: 0.12
Nodes (16): ADR-0027, API calls on this page, Decisions, Log out other device and continue (conflict modal), Login, Shared components used, State & storage, Submit login form (+8 more)

### Community 91 - "0009. Page-wise flow documentation in docs/pages"
Cohesion: 0.33
Nodes (5): 0009. Page-wise flow documentation in docs/pages, Alternatives considered, Consequences, Context, Decision

### Community 92 - "Machine models"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete model, Machine models, Shared components used, State & storage, UI states

### Community 93 - "App shell (session, logout, theme)"
Cohesion: 0.10
Nodes (22): API calls on this page, App shell (session, logout, theme), Change theme, Decisions, On page load, Shared components used, State & storage, UI states (+14 more)

### Community 94 - "0020. Virtual Screen: one REST snapshot polled every 5 s"
Cohesion: 0.40
Nodes (5): 0020. Virtual Screen: one REST snapshot polled every 5 s, Alternatives considered, Consequences, Context, Decision

### Community 95 - "Machine accuracy"
Cohesion: 0.22
Nodes (9): API calls on this page, Decisions, Delete machine accuracy, Machine accuracy, On page load, Save machine accuracy (add / edit form), Shared components used, State & storage (+1 more)

### Community 96 - "Operations Center"
Cohesion: 0.20
Nodes (10): Action queue rules, API calls on this page, Change the date or the customer, Decisions, Operations Center, Rules & edge cases, Shared components used, State & storage (+2 more)

### Community 97 - "catalogService.js"
Cohesion: 0.48
Nodes (6): On page load, On page load, On page load, getBrands(), getControllers(), getModels()

### Community 98 - "unwrapList"
Cohesion: 0.10
Nodes (37): Decision, On page load, Save user cell (add / edit form), Save user city (add / edit form), On page load, Save user line (add / edit form), Save user location (add / edit form), On page load (+29 more)

### Community 99 - "0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page"
Cohesion: 0.40
Nodes (5): 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page, Alternatives considered, Consequences, Context, Decision

### Community 100 - "adr/README.md"
Cohesion: 0.16
Nodes (5): 0015. Clientele is a Masters page, not an Account Center tab, Alternatives considered, Consequences, Context, Architecture Decision Records

### Community 101 - "Locations"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, Delete user location, Locations, On page load, Shared components used, State & storage, UI states

### Community 102 - "Clientele"
Cohesion: 0.29
Nodes (7): API calls on this page, Clientele, Decisions, Delete clientele, Shared components used, State & storage, UI states

### Community 103 - "Add / edit production schedule"
Cohesion: 0.29
Nodes (6): Add / edit production schedule, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 104 - "Branches"
Cohesion: 0.22
Nodes (8): API calls on this page, Branches, Decisions, Delete branch, On page load, Save branch (add / edit form), Shared components used, UI states

### Community 105 - "Topbar.jsx"
Cohesion: 0.18
Nodes (13): BREAKPOINTS, SidebarContext, SidebarProvider(), useMediaQuery(), Login(), redirectTarget(), CENTER, LoginBackdrop() (+5 more)

### Community 106 - "operatorScheduleSettings.js"
Cohesion: 0.49
Nodes (8): OperatorJobRow(), dateLabel(), EMPTY_FILTERS, filterOptions(), machineLabel(), matchesSearch(), partLabel(), periodLabel()

### Community 107 - "Controllers"
Cohesion: 0.29
Nodes (7): API calls on this page, Controllers, Decisions, Delete controller, Shared components used, State & storage, UI states

### Community 108 - "Holidays / week off"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, Delete holiday, Holidays / week off, On page load, Shared components used, State & storage, UI states

### Community 109 - "My sessions"
Cohesion: 0.12
Nodes (15): API calls on this page, Decisions, Log out all other sessions, Log out one session, My sessions, On page load, Shared components used, State & storage (+7 more)

### Community 110 - "Parts"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, Delete part, On page load, Parts, Shared components used, State & storage, UI states

### Community 111 - "Cells"
Cohesion: 0.25
Nodes (7): API calls on this page, Cells, Decisions, Delete user cell, Shared components used, State & storage, UI states

### Community 112 - "Machine PLC node IDs"
Cohesion: 0.25
Nodes (8): API calls on this page, Change a node ID, Decisions, Machine PLC node IDs, On page load, Rules & edge cases, State & storage, Test a node ID

### Community 113 - "Operator wise production schedule"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, On page load, Operator wise production schedule, Search (apply filters), Shared components used, State & storage, UI states

### Community 114 - "ProtectedRoute"
Cohesion: 0.06
Nodes (31): 0017. Log in as customer in a new tab, on the tab's own API path, Alternatives considered, Consequences, Context, Decision, About, Decisions, State & storage (+23 more)

### Community 115 - "Task list"
Cohesion: 0.18
Nodes (10): API calls on this page, Decisions, Delete task / Make inactive, On page load, Save task (add / edit form), Shared components used, State & storage, Task list (+2 more)

### Community 116 - "ProcessFields.jsx"
Cohesion: 0.17
Nodes (12): checkDrawing, DrawingUpload(), MachinePicker(), summary(), DRAWING_RULES, EMPTY_SUB_PROGRAM, MAX_LENGTH, MAX_SUB_PROGRAMS (+4 more)

### Community 117 - "PlannedTab.jsx"
Cohesion: 0.60
Nodes (3): PlannedTab(), ToolLife(), ToolList()

### Community 118 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 119 - "0010. Organization levels on one tabbed page, a route per tab"
Cohesion: 0.33
Nodes (5): 0010. Organization levels on one tabbed page, a route per tab, Alternatives considered, Consequences, Context, Decision

### Community 120 - "IntelligencePanels.jsx"
Cohesion: 0.15
Nodes (38): ChartCard(), NoResults(), modeTypeOf(), machineMonitorPath(), monitoringSearchPath(), DayCard(), FleetCard(), KpiTile() (+30 more)

### Community 121 - "Breaks"
Cohesion: 0.25
Nodes (7): API calls on this page, Breaks, Decisions, Delete break, Shared components used, State & storage, UI states

### Community 122 - "Home (Dashboard)"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Home (Dashboard), On page load, Pick another day or customer, State & storage, UI states

### Community 123 - "Cities"
Cohesion: 0.25
Nodes (7): API calls on this page, Cities, Decisions, Delete user city, Shared components used, State & storage, UI states

### Community 124 - "0004. Axios client with the HttpOnly session cookie"
Cohesion: 0.33
Nodes (5): 0004. Axios client with the HttpOnly session cookie, Alternatives considered, Consequences, Context, Decision

### Community 125 - "States"
Cohesion: 0.22
Nodes (8): API calls on this page, Decisions, Delete user state, Save user state (add / edit form), Shared components used, State & storage, States, UI states

### Community 126 - "loginAs.js"
Cohesion: 0.22
Nodes (10): 0018. Log in as customer opens the dashboard directly (no /login-as page), Alternatives considered, Consequences, Context, Decision, View customer (log in as), apiBaseUrl(), ADR-0018 (+2 more)

### Community 127 - "Client documentation"
Cohesion: 0.40
Nodes (4): Client documentation, How to use Postman, How to view the API docs in Chrome (Swagger UI), How to view the page flow docs

### Community 128 - "0024. Operations Center: a second dashboard beside Home, on the existing APIs"
Cohesion: 0.40
Nodes (4): 0024. Operations Center: a second dashboard beside Home, on the existing APIs, Alternatives considered, Consequences, Context

### Community 129 - "0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before"
Cohesion: 0.40
Nodes (4): 0026. Plant Intelligence becomes the owner's dashboard: executive summary against the period before, Alternatives considered, Consequences, Context

### Community 130 - "Customer / user detail"
Cohesion: 0.33
Nodes (6): API calls on this page, Customer / user detail, Decisions, Shared components used, State & storage, UI states

### Community 131 - "Shifts"
Cohesion: 0.25
Nodes (7): API calls on this page, Decisions, Delete shift, Shared components used, Shifts, State & storage, UI states

### Community 132 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 133 - "0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day"
Cohesion: 0.40
Nodes (4): 0025. Plant Intelligence: a period and per-machine dashboard, from one existing API per day, Alternatives considered, Consequences, Context

### Community 134 - "0021. Virtual Screen: live values over Socket.IO, REST for derived data"
Cohesion: 0.50
Nodes (4): 0021. Virtual Screen: live values over Socket.IO, REST for derived data, Alternatives considered, Consequences, Context

### Community 135 - "0012. Monitoring: Productivity and Machine Health on one tabbed page"
Cohesion: 0.40
Nodes (5): 0012. Monitoring: Productivity and Machine Health on one tabbed page, Alternatives considered, Consequences, Context, Decision

### Community 136 - "0013. Monitoring starts with a machine list; All Machines is set-up only"
Cohesion: 0.40
Nodes (5): 0013. Monitoring starts with a machine list; All Machines is set-up only, Alternatives considered, Consequences, Context, Decision

### Community 137 - "Theme showcase"
Cohesion: 0.33
Nodes (5): Decisions, Shared components used, State & storage, Theme showcase, UI states

### Community 138 - "0019. Monitoring: machine list, then the machine's tabs with a back arrow"
Cohesion: 0.50
Nodes (4): 0019. Monitoring: machine list, then the machine's tabs with a back arrow, Alternatives considered, Consequences, Context

### Community 139 - "machineTypeLabel"
Cohesion: 0.67
Nodes (4): machineTypeDetail(), machineTypeLabel(), OperatorTaskRow(), matchesSearch()

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **42 isolated node(s):** `bootstrap`, `@types/react`, `@types/react-dom`, `eslint`, `sass` (+37 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 573 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProtectedRoute()` connect `ProtectedRoute` to `Customer / user detail`, `Shifts`, `AxisValuesCard.jsx`, `Theme showcase`, `0002. React Router with one route table and role guards`, `intelligenceSettings.js`, `Loader`, `routes.js`, `All machines`, `userShopService.js`, `VirtualScreen.jsx`, `diagnosticsSettings.js`, `AddCustomer.jsx`, `Downtime / idle reasons`, `User guide`, `Licence keys`, `Add / edit part`, `Monitoring (machine list)`, `Countries`, `Brands`, `Production schedules`, `Supervisors`, `Productivity`, `Tool List and Tool Life (machine tabs)`, `Operator tasks`, `Machine models`, `App shell (session, logout, theme)`, `Machine accuracy`, `Operations Center`, `Locations`, `Clientele`, `Add / edit production schedule`, `Branches`, `Controllers`, `Holidays / week off`, `My sessions`, `Parts`, `Cells`, `Machine PLC node IDs`, `Operator wise production schedule`, `Task list`, `Breaks`, `Home (Dashboard)`, `Cities`, `States`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Loader()` (e.g. with `Shared components used` and `UI states`) actually correct?**
  _`Loader()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _42 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `unwrapList` be split into smaller, more focused modules?**
  _Cohesion score 0.1452991452991453 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `prop-types`, `BarLineChart.jsx`, `liveSocket.js`, `Productivity.jsx`, `Speedometer.jsx`, `LicenceKeyGenerator.jsx`, `AxisValuesCard.jsx`, `DateRangePicker.jsx`, `AddPart.jsx`, `BreakFormModal.jsx`, `AccountCenterPage.jsx`, `AddProductionSchedule.jsx`, `CountryFormModal.jsx`, `Loader`, `TaskListEditor.jsx`, `MachineDiagnostics.jsx`, `dateTime.js`, `package.json`, `UserGuide.jsx`, `MachinePlcVariables.jsx`, `routes.js`, `react-hook-form`, `dateTime.js`, `healthSensors.js`, `VirtualScreen.jsx`, `StateFormModal.jsx`, `AddCustomer.jsx`, `OperationsCenter.jsx`, `AddMachine.jsx`, `DiagnosticsPlcVariables.jsx`, `BrandFormModal.jsx`, `AuthProvider.jsx`, `HomeCards.jsx`, `react-bootstrap`, `OperatorTaskEditor.jsx`, `ModelFormModal.jsx`, `toast`, `Topbar.jsx`, `ReasonFormModal.jsx`, `HolidayFormModal.jsx`, `ConfirmModal`, `ControllerFormModal.jsx`, `helpers.js`, `ShiftCard.jsx`, `MachineAccuracyEditor.jsx`, `ShiftFormModal.jsx`, `theme.js`, `toast.js`, `Topbar.jsx`, `operatorScheduleSettings.js`, `ProcessFields.jsx`, `IntelligencePanels.jsx`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Should `liveSocket.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11740890688259109 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._