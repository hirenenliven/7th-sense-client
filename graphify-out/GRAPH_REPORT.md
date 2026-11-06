# Graph Report - 7th-sense-client  (2026-11-06)

## Corpus Check
- 330 files · ~188,005 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 1972 nodes · 6519 edges · 102 communities (99 shown, 3 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 473 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `98cc2ca1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- chartTheme.js
- AddCustomer.jsx
- BarLineChart.jsx
- liveSocket.js
- Productivity.jsx
- react
- react-bootstrap
- withQuery
- MonitoringMachines.jsx
- Project Docs & Conventions
- dateTime.js
- userCityService.js
- AddPart.jsx
- Home.jsx
- Login.jsx
- AddProductionSchedule.jsx
- healthSampleData.js
- Runtime Dependencies
- Home.jsx
- Breaks
- 0001. Single-page app with React 19 and Vite
- ProcessFields.jsx
- SummaryCards.jsx
- OrgUserProvider.jsx
- devDependencies
- jsconfig Aliases
- userCountryService.js
- TimePicker.jsx
- Page flows
- package.json
- authService.js
- sharedGet
- Login Logo Asset
- theme.js
- User guide
- orgLevels.js
- ControllerFormModal.jsx
- Customers / Users list
- All machines
- healthSensors.js
- Licence keys
- MonitoringMachines.jsx
- VirtualScreen.jsx
- AccountCenterPage.jsx
- Branches
- adr/README.md
- Downtime / idle reasons
- Add / edit part
- AddMachine.jsx
- AuthProvider.jsx
- Add / edit branch
- Shifts
- Clientele
- AuthProvider.jsx
- react-bootstrap
- 0015. Clientele is a Masters page, not an Account Center tab
- UserGuide.jsx
- vite.config.js
- ModelFormModal.jsx
- AddBranch.jsx
- 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page
- ProtectedRoute
- States
- 0016. Account Center is superadmin only; Users lists company members only
- LicenceKeyGenerator.jsx
- customerName
- 0008. Folder structure by page and by concern
- 0023. One list, row and form for the name-under-a-parent organization levels
- HolidayFormModal.jsx
- 0006. React-Bootstrap with SCSS design tokens
- useMachineLive
- useLoad
- apiClient.js
- BrandFormModal.jsx
- ShiftCard.jsx
- BreakFormModal.jsx
- 0003. Server state via service modules and useLoad, Context only for the session
- userLocationService.js
- ShiftFormModal.jsx
- LiveClock.jsx
- 0022. Ponytail plugin for Claude Code, under this repo's rules
- userLineService.js
- Tool List and Tool Life (machine tabs)
- Home (Dashboard)
- 0005. Forms with react-hook-form and zod
- Virtual Screen (machine tab)
- 0009. Page-wise flow documentation in docs/pages
- 0004. Axios client with the HttpOnly session cookie
- userSupervisorService.js
- Add / edit production schedule
- Monitoring (machine list)
- 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page
- 0010. Organization levels on one tabbed page, a route per tab
- 0012. Monitoring: Productivity and Machine Health on one tabbed page
- MainLayout
- unwrap
- Parts
- scripts
- Theme showcase
- Client documentation

## God Nodes (most connected - your core abstractions)
1. `react` - 120 edges
2. `prop-types` - 107 edges
3. `unwrap()` - 92 edges
4. `react-bootstrap` - 90 edges
5. `useAuth()` - 85 edges
6. `withQuery()` - 76 edges
7. `Loader()` - 73 edges
8. `sharedGet()` - 66 edges
9. `ProtectedRoute()` - 49 edges
10. `unwrapList()` - 48 edges

## Surprising Connections (you probably didn't know these)
- `UI states` --references--> `Loader()`  [INFERRED]
  docs/pages/home.md → src/components/common/Loader.jsx
- `State & storage` --references--> `useAuth()`  [INFERRED]
  docs/pages/branch-form.md → src/hooks/useAuth.js
- `State & storage` --references--> `useAuth()`  [INFERRED]
  docs/pages/breaks.md → src/hooks/useAuth.js
- `State & storage` --references--> `useAuth()`  [INFERRED]
  docs/pages/clientele-list.md → src/hooks/useAuth.js
- `State & storage` --references--> `useAuth()`  [INFERRED]
  docs/pages/customer-user-detail.md → src/hooks/useAuth.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project convention documents (CLAUDE.md, frontend skills, THEME, README)** — claude, 7th_sense_frontend_skills, theme, readme [EXTRACTED 1.00]
- **Customer-scoped master data with role-based access** — claude_masters_customer_pattern, claude_role_based_access, claude_production_schedule, claude_licence_keys, claude_shifts_breaks [INFERRED 0.85]
- **Dark/light dual theme system** — theme_design_tokens, theme_light_theme_second_build, theme_theme_switching, 7thsense_ui_review [INFERRED 0.85]

## Communities (102 total, 3 thin omitted)

### Community 0 - "chartTheme.js"
Cohesion: 0.10
Nodes (24): LEGEND_BOTTOM_PROPS, LEGEND_PROPS, AREA_OPACITY, BAND_OPACITY, GRID_PROPS, MUTED_OPACITY, SEGMENT_GAP, SERIES_COLORS (+16 more)

### Community 1 - "AddCustomer.jsx"
Cohesion: 0.05
Nodes (87): Save clientele (add / edit form), On page load, Add / edit customer or user, API calls on this page, Choose the user's machines (Access card), Decisions, On page load, Save user (add / edit form) (+79 more)

### Community 2 - "BarLineChart.jsx"
Cohesion: 0.26
Nodes (27): recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), axisPropTypes, renderGrid(), renderLegend(), renderTooltip() (+19 more)

### Community 3 - "liveSocket.js"
Cohesion: 0.17
Nodes (23): applyAnswer(), applyStatus(), applyValues(), checkSession(), connectionListeners, disconnectLive(), EMPTY_STATE, getSocket() (+15 more)

### Community 4 - "Productivity.jsx"
Cohesion: 0.11
Nodes (31): readoutClock, readoutTime, chartMessage(), dayLabel, pickedMachineIds(), Productivity(), programIn(), programOptions() (+23 more)

### Community 5 - "react"
Cohesion: 0.07
Nodes (63): country-region-data, prop-types, react, zod, IconAction(), MultiSelectPicker(), summary(), toGroups() (+55 more)

### Community 6 - "react-bootstrap"
Cohesion: 0.23
Nodes (16): MACHINE_STATUS, modeTypeOf(), MachineMode(), MachineRow(), MachineCycles(), MachineOee(), NoValue(), OEE_PARTS (+8 more)

### Community 7 - "withQuery"
Cohesion: 0.22
Nodes (14): Decision, On page load, On page load, On page load, withQuery(), getBreaks(), getFinishCycles(), getMachineSummaries() (+6 more)

### Community 8 - "MonitoringMachines.jsx"
Cohesion: 0.22
Nodes (10): react-router-dom, ACCOUNT_CENTER_PATHS, ACCOUNT_CENTER_TABS, MONITOR_REFRESH_MS, MONITORING_PATHS, MONITORING_SEARCH_PARAM, ORG_LEVEL, ORGANIZATION_PATHS (+2 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "dateTime.js"
Cohesion: 0.11
Nodes (43): ChartDateFilter(), clamp(), DateCalendar(), DatePicker(), dayLabel, keyToDay(), monthGrid(), monthName (+35 more)

### Community 11 - "userCityService.js"
Cohesion: 0.20
Nodes (11): API calls on this page, Cities, Decisions, Delete user city, Save user city (add / edit form), Shared components used, State & storage, UI states (+3 more)

### Community 12 - "AddPart.jsx"
Cohesion: 0.15
Nodes (25): Save part (add / edit form), AddPart(), byName(), EMPTY_PROCESS, INITIAL_VALUES, MAX_LENGTH, MAX_PART_COUNT, MAX_PROCESSES (+17 more)

### Community 13 - "Home.jsx"
Cohesion: 0.12
Nodes (31): Rules & edge cases, monitoringSearchPath(), DayCard(), FleetCard(), HourlyCard(), KpiTile(), TileRow(), tileShape (+23 more)

### Community 14 - "Login.jsx"
Cohesion: 0.11
Nodes (27): BrandLogo(), LOGO_MARKUP, Footer(), AppShell(), Sidebar(), displayName(), Topbar(), env (+19 more)

### Community 15 - "AddProductionSchedule.jsx"
Cohesion: 0.12
Nodes (25): Save production schedule (add / edit form), AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel(), EMPTY_ITEM, idText() (+17 more)

### Community 16 - "healthSampleData.js"
Cohesion: 0.14
Nodes (25): MACHINE_MODES, buildDay(), dailyRows(), dayLabel, dayLoad(), dayStates(), dayWindow(), hourLabel (+17 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+9 more)

### Community 18 - "Home.jsx"
Cohesion: 0.23
Nodes (15): Shared components used, ChartCard(), customerOptionLabel(), dayTitle, Home(), AlarmsCard(), AttentionCard(), HomeTable() (+7 more)

### Community 19 - "Breaks"
Cohesion: 0.29
Nodes (7): API calls on this page, Breaks, Decisions, Delete break, Shared components used, State & storage, UI states

### Community 20 - "0001. Single-page app with React 19 and Vite"
Cohesion: 0.33
Nodes (5): 0001. Single-page app with React 19 and Vite, Alternatives considered, Consequences, Context, Decision

### Community 21 - "ProcessFields.jsx"
Cohesion: 0.20
Nodes (10): react-hook-form, checkDrawing, DrawingUpload(), MachinePicker(), summary(), DRAWING_RULES, EMPTY_SUB_PROGRAM, MAX_SUB_PROGRAMS (+2 more)

### Community 22 - "SummaryCards.jsx"
Cohesion: 0.21
Nodes (13): DEFAULT_MODE_RANGE, formatCycle(), KPI_REFRESH_MS, MODE_RANGES, modeSeconds(), sinceLabel, spanSeconds(), SUMMARY_MODES (+5 more)

### Community 23 - "OrgUserProvider.jsx"
Cohesion: 0.39
Nodes (6): App(), Toaster(), ICONS, ToastItem(), getToasts(), subscribeToasts()

### Community 24 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "userCountryService.js"
Cohesion: 0.18
Nodes (11): API calls on this page, Countries, Decisions, Delete user country, On page load, Save user country (add / edit form), Shared components used, State & storage (+3 more)

### Community 27 - "TimePicker.jsx"
Cohesion: 0.12
Nodes (22): assignRef(), PickerField(), POPPER_CONFIG, centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel() (+14 more)

### Community 28 - "Page flows"
Cohesion: 0.15
Nodes (13): Dashboard, Masters, Masters › Downtime, Masters › Organization, Masters › Shift, Masters › Users, Operations, Operations › Monitoring (+5 more)

### Community 29 - "package.json"
Cohesion: 0.13
Nodes (16): name, private, type, version, axios, bootstrap, eslint, @eslint/js (+8 more)

### Community 30 - "authService.js"
Cohesion: 0.25
Nodes (7): API calls on this page, Decisions, Login, Shared components used, State & storage, Submit login form, UI states

### Community 31 - "sharedGet"
Cohesion: 0.17
Nodes (23): On page load, On page load, On page load, On page load, On page load, On page load, LEVEL_KEYS, loadOrganization() (+15 more)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "theme.js"
Cohesion: 0.18
Nodes (17): bootstrap-icons, @fontsource-variable/roboto, react-dom, @/assets/scss/theme-light.scss?inline, DEFAULT_THEME, THEME, useTheme(), applyTheme() (+9 more)

### Community 34 - "User guide"
Cohesion: 0.25
Nodes (8): Decisions, On page load, Rules & edge cases, Sections, Shared components used, State & storage, UI states, User guide

### Community 35 - "orgLevels.js"
Cohesion: 0.09
Nodes (26): API calls on this page, Cells, Decisions, Delete user cell, On page load, Save user cell (add / edit form), Shared components used, State & storage (+18 more)

### Community 36 - "ControllerFormModal.jsx"
Cohesion: 0.16
Nodes (17): API calls on this page, Controllers, Decisions, Delete controller, Save controller (add / edit form), Shared components used, State & storage, UI states (+9 more)

### Community 37 - "Customers / Users list"
Cohesion: 0.07
Nodes (29): API calls on this page, App shell (session, logout, theme), Change theme, Decisions, On page load, Shared components used, State & storage, UI states (+21 more)

### Community 38 - "All machines"
Cohesion: 0.22
Nodes (9): All machines, API calls on this page, Decisions, Delete machine, Edit machine, On page load, Shared components used, State & storage (+1 more)

### Community 39 - "healthSensors.js"
Cohesion: 0.09
Nodes (32): niceTicks(), STEP_MULTIPLES, pointsInRange(), sensorDay(), clock, clockSeconds, dayClock, DEFAULT_RANGE (+24 more)

### Community 40 - "Licence keys"
Cohesion: 0.18
Nodes (11): API calls on this page, Decisions, Delete licence key, Generate licence keys, Licence keys, On page load, Save licence key (add / edit form), Save licence keys (add / edit form) (+3 more)

### Community 41 - "MonitoringMachines.jsx"
Cohesion: 0.12
Nodes (21): 0013. Monitoring starts with a machine list; All Machines is set-up only, Alternatives considered, Consequences, Context, Decision, 0019. Monitoring: machine list, then the machine's tabs with a back arrow, Alternatives considered, Consequences (+13 more)

### Community 42 - "VirtualScreen.jsx"
Cohesion: 0.06
Nodes (49): What the screen shows, 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents), ADR-0009, ADR-0021, LIVE_CHANNELS (+41 more)

### Community 43 - "AccountCenterPage.jsx"
Cohesion: 0.29
Nodes (10): isAlsoActive(), linkClass(), navLeafShape, SidebarItem(), AccountCenterPage(), isTabActive(), AccountCenterPage, flattenNav() (+2 more)

### Community 44 - "Branches"
Cohesion: 0.22
Nodes (9): API calls on this page, Branches, Decisions, Delete branch, On page load, Save branch (add / edit form), Shared components used, State & storage (+1 more)

### Community 46 - "Downtime / idle reasons"
Cohesion: 0.16
Nodes (19): API calls on this page, Decisions, Delete downtime reason, Delete idle reason, Downtime / idle reasons, On page load, Save downtime reason (add / edit form), Save idle reason (add / edit form) (+11 more)

### Community 47 - "Add / edit part"
Cohesion: 0.22
Nodes (9): Add / edit part, API calls on this page, Decisions, On page load, Shared components used, State & storage, UI states, Upload part drawing (+1 more)

### Community 48 - "AddMachine.jsx"
Cohesion: 0.07
Nodes (45): 0007. Recharts for charts, plain SVG for the Gantt, Alternatives considered, Consequences, Context, Decision, clockMinutes, clockWithSeconds, ModeGanttChart() (+37 more)

### Community 49 - "AuthProvider.jsx"
Cohesion: 0.25
Nodes (8): 0021. Virtual Screen: live values over Socket.IO, REST for derived data, Alternatives considered, Consequences, Context, Decision, Click Log out, notifyUnauthorized(), logout()

### Community 50 - "Add / edit branch"
Cohesion: 0.29
Nodes (7): Add / edit branch, API calls on this page, Decisions, On page load, Shared components used, State & storage, UI states

### Community 51 - "Shifts"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete shift, Shared components used, Shifts, State & storage, UI states

### Community 52 - "Clientele"
Cohesion: 0.29
Nodes (7): API calls on this page, Clientele, Decisions, Delete clientele, Shared components used, State & storage, UI states

### Community 53 - "AuthProvider.jsx"
Cohesion: 0.48
Nodes (5): AuthContext, AuthProvider(), onUnauthorized(), clearLoginAs(), refreshUserTheme()

### Community 54 - "react-bootstrap"
Cohesion: 0.06
Nodes (133): Decision, On page load, On page load, On page load, react-bootstrap, ConfirmModal(), Loader(), ARIA_SORT (+125 more)

### Community 55 - "0015. Clientele is a Masters page, not an Account Center tab"
Cohesion: 0.40
Nodes (5): 0015. Clientele is a Masters page, not an Account Center tab, Alternatives considered, Consequences, Context, Decision

### Community 56 - "UserGuide.jsx"
Cohesion: 0.16
Nodes (20): ROLE_LABELS, NAV_SECTIONS, navLinks(), NUMBERED_STEPS, OpenLink(), SectionCard(), SECTIONS, SetupStep() (+12 more)

### Community 57 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 58 - "ModelFormModal.jsx"
Cohesion: 0.15
Nodes (19): API calls on this page, Decisions, Delete model, Machine models, Save model (add / edit form), Shared components used, State & storage, UI states (+11 more)

### Community 59 - "AddBranch.jsx"
Cohesion: 0.18
Nodes (18): Save branch (add / edit form), BRANCH_STATUS, AddBranch(), labelClass(), branchSchema, COLOR_PICKER_FALLBACK, INITIAL_VALUES, optional() (+10 more)

### Community 60 - "0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page"
Cohesion: 0.40
Nodes (5): 0014. Business Setup renamed Account Center; old Account Center item removed, Alternatives considered, Consequences, Context, Decision

### Community 61 - "ProtectedRoute"
Cohesion: 0.13
Nodes (18): 0002. React Router with one route table and role guards, Alternatives considered, Consequences, Context, Decision, Coming soon (unbuilt sidebar links), Decisions, On page load (+10 more)

### Community 62 - "States"
Cohesion: 0.20
Nodes (10): API calls on this page, Decisions, Delete user state, Save user state (add / edit form), Shared components used, State & storage, States, UI states (+2 more)

### Community 63 - "0016. Account Center is superadmin only; Users lists company members only"
Cohesion: 0.40
Nodes (5): 0016. Account Center is superadmin only; Users lists company members only, Alternatives considered, Consequences, Context, Decision

### Community 64 - "LicenceKeyGenerator.jsx"
Cohesion: 0.18
Nodes (17): Other, StatusToggle(), DEFAULT_DURATION, DURATION_VALUES, editSchema, GENERATE_INITIAL_VALUES, generateSchema, LICENCE_DURATIONS (+9 more)

### Community 65 - "customerName"
Cohesion: 0.48
Nodes (5): customerMobile(), customerName(), matchesSearch(), CustomerRow(), customerOptionLabel()

### Community 66 - "0008. Folder structure by page and by concern"
Cohesion: 0.33
Nodes (5): 0008. Folder structure by page and by concern, Alternatives considered, Consequences, Context, Decision

### Community 67 - "0023. One list, row and form for the name-under-a-parent organization levels"
Cohesion: 0.40
Nodes (4): 0023. One list, row and form for the name-under-a-parent organization levels, Alternatives considered, Consequences, Context

### Community 68 - "HolidayFormModal.jsx"
Cohesion: 0.20
Nodes (14): Save holiday (add / edit form), FieldLabel(), InfoTooltip(), HOLIDAY_TYPES, holidaySchema, INITIAL_VALUES, MAX_LENGTH, toFormValues() (+6 more)

### Community 69 - "0006. React-Bootstrap with SCSS design tokens"
Cohesion: 0.33
Nodes (5): 0006. React-Bootstrap with SCSS design tokens, Alternatives considered, Consequences, Context, Decision

### Community 70 - "useMachineLive"
Cohesion: 0.42
Nodes (9): useMachineLive(), getMachineState(), isLiveConnected(), machineEntry(), onMachineEvent(), scheduleSync(), subscribeConnection(), subscribeMachineState() (+1 more)

### Community 71 - "useLoad"
Cohesion: 0.10
Nodes (22): 0020. Virtual Screen: one REST snapshot polled every 5 s, Alternatives considered, Consequences, Context, Decision, API calls on this page, Decisions, Live updates (+14 more)

### Community 72 - "apiClient.js"
Cohesion: 0.15
Nodes (14): ADR-0018, 0017. Log in as customer in a new tab, on the tab's own API path, Alternatives considered, Consequences, Context, Decision, 0018. Log in as customer opens the dashboard directly (no /login-as page), Alternatives considered (+6 more)

### Community 73 - "BrandFormModal.jsx"
Cohesion: 0.14
Nodes (18): API calls on this page, Brands, Decisions, Delete brand, On page load, Save brand (add / edit form), Shared components used, State & storage (+10 more)

### Community 74 - "ShiftCard.jsx"
Cohesion: 0.33
Nodes (11): SHIFT_TYPES, WEEKDAYS, ScheduleJobFields(), Clock(), minutesBetween(), ShiftCard(), toMinutes(), typeLabel() (+3 more)

### Community 76 - "BreakFormModal.jsx"
Cohesion: 0.23
Nodes (13): Save break (add / edit form), ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, SHIFT_STATUS, breakSchema, INITIAL_VALUES, MAX_LENGTH, toBreakPayload() (+5 more)

### Community 77 - "0003. Server state via service modules and useLoad, Context only for the session"
Cohesion: 0.40
Nodes (4): 0003. Server state via service modules and useLoad, Context only for the session, Alternatives considered, Consequences, Context

### Community 78 - "userLocationService.js"
Cohesion: 0.20
Nodes (11): API calls on this page, Decisions, Delete user location, Locations, Save user location (add / edit form), Shared components used, State & storage, UI states (+3 more)

### Community 79 - "ShiftFormModal.jsx"
Cohesion: 0.23
Nodes (16): Save shift (add / edit form), clock(), EMPTY_BREAK_ROW, INITIAL_VALUES, MAX_BREAKS, MAX_LENGTH, offset(), shiftSchema() (+8 more)

### Community 80 - "LiveClock.jsx"
Cohesion: 0.27
Nodes (9): LiveClock(), CLOCK_TICK_MS, LoginClock(), formatClockTime(), formatLongDate(), formatOrdinalDate(), formatTime12(), formatWeekday() (+1 more)

### Community 81 - "0022. Ponytail plugin for Claude Code, under this repo's rules"
Cohesion: 0.33
Nodes (5): 0022. Ponytail plugin for Claude Code, under this repo's rules, Alternatives considered, Consequences, Context, Decision

### Community 84 - "userLineService.js"
Cohesion: 0.20
Nodes (11): API calls on this page, Decisions, Delete user line, Lines, Save user line (add / edit form), Shared components used, State & storage, UI states (+3 more)

### Community 85 - "Tool List and Tool Life (machine tabs)"
Cohesion: 0.33
Nodes (6): Decisions, On page load, Rules & edge cases, Shared components used, State & storage, Tool List and Tool Life (machine tabs)

### Community 87 - "Home (Dashboard)"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Home (Dashboard), On page load, Pick another day or customer, State & storage, UI states

### Community 89 - "0005. Forms with react-hook-form and zod"
Cohesion: 0.33
Nodes (5): 0005. Forms with react-hook-form and zod, Alternatives considered, Consequences, Context, Decision

### Community 90 - "Virtual Screen (machine tab)"
Cohesion: 0.22
Nodes (9): API calls on this page, Decisions, Live values (Socket.IO), On page load, Rules & edge cases, Shared components used, State & storage, UI states (+1 more)

### Community 91 - "0009. Page-wise flow documentation in docs/pages"
Cohesion: 0.33
Nodes (5): 0009. Page-wise flow documentation in docs/pages, Alternatives considered, Consequences, Context, Decision

### Community 92 - "0004. Axios client with the HttpOnly session cookie"
Cohesion: 0.33
Nodes (5): 0004. Axios client with the HttpOnly session cookie, Alternatives considered, Consequences, Context, Decision

### Community 93 - "userSupervisorService.js"
Cohesion: 0.18
Nodes (13): API calls on this page, Decisions, Delete user supervisor, On page load, Save user supervisor (add / edit form), Shared components used, State & storage, Supervisors (+5 more)

### Community 94 - "Add / edit production schedule"
Cohesion: 0.33
Nodes (6): Add / edit production schedule, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 97 - "Monitoring (machine list)"
Cohesion: 0.22
Nodes (9): API calls on this page, Decisions, Monitoring (machine list), On page load, Rules & edge cases, Shared components used, State & storage, UI states (+1 more)

### Community 99 - "0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page"
Cohesion: 0.40
Nodes (5): 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page, Alternatives considered, Consequences, Context, Decision

### Community 103 - "0010. Organization levels on one tabbed page, a route per tab"
Cohesion: 0.22
Nodes (8): 0010. Organization levels on one tabbed page, a route per tab, Alternatives considered, Consequences, Context, Decision, ORGANIZATION_TABS, OrganizationPage(), OrganizationPage

### Community 106 - "0012. Monitoring: Productivity and Machine Health on one tabbed page"
Cohesion: 0.40
Nodes (5): 0012. Monitoring: Productivity and Machine Health on one tabbed page, Alternatives considered, Consequences, Context, Decision

### Community 107 - "MainLayout"
Cohesion: 0.07
Nodes (29): About, Decisions, State & storage, UI states, API calls on this page, Decisions, Delete holiday, Holidays / week off (+21 more)

### Community 111 - "unwrap"
Cohesion: 0.16
Nodes (18): On page load, Save machine (add / edit form), apiClient, pendingGets, unauthorizedListeners, unwrap(), getSession(), login() (+10 more)

### Community 114 - "Parts"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete part, On page load, Parts, Shared components used, State & storage, UI states

### Community 118 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 119 - "Theme showcase"
Cohesion: 0.40
Nodes (5): Decisions, Shared components used, State & storage, Theme showcase, UI states

### Community 127 - "Client documentation"
Cohesion: 0.40
Nodes (4): Client documentation, How to use Postman, How to view the API docs in Chrome (Swagger UI), How to view the page flow docs

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **17 isolated node(s):** `bootstrap`, `@types/react`, `@types/react-dom`, `eslint`, `sass` (+12 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 445 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `chartTheme.js`, `AddCustomer.jsx`, `BarLineChart.jsx`, `Productivity.jsx`, `MonitoringMachines.jsx`, `dateTime.js`, `AddPart.jsx`, `Login.jsx`, `AddProductionSchedule.jsx`, `Home.jsx`, `ProcessFields.jsx`, `SummaryCards.jsx`, `OrgUserProvider.jsx`, `TimePicker.jsx`, `package.json`, `theme.js`, `ControllerFormModal.jsx`, `healthSensors.js`, `MonitoringMachines.jsx`, `VirtualScreen.jsx`, `AccountCenterPage.jsx`, `AddMachine.jsx`, `AuthProvider.jsx`, `react-bootstrap`, `UserGuide.jsx`, `ModelFormModal.jsx`, `AddBranch.jsx`, `ProtectedRoute`, `LicenceKeyGenerator.jsx`, `HolidayFormModal.jsx`, `useMachineLive`, `BrandFormModal.jsx`, `ShiftCard.jsx`, `BreakFormModal.jsx`, `ShiftFormModal.jsx`, `LiveClock.jsx`, `0010. Organization levels on one tabbed page, a route per tab`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `useAuth()` (e.g. with `State & storage` and `State & storage`) actually correct?**
  _`useAuth()` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _17 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `chartTheme.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1010752688172043 - nodes in this community are weakly interconnected._
- **Why does `ProtectedRoute()` connect `ProtectedRoute` to `AddCustomer.jsx`, `MonitoringMachines.jsx`, `userCityService.js`, `Breaks`, `userCountryService.js`, `User guide`, `orgLevels.js`, `ControllerFormModal.jsx`, `Customers / Users list`, `All machines`, `Licence keys`, `Branches`, `Downtime / idle reasons`, `Add / edit part`, `Add / edit branch`, `Shifts`, `Clientele`, `react-bootstrap`, `ModelFormModal.jsx`, `States`, `useLoad`, `apiClient.js`, `BrandFormModal.jsx`, `userLocationService.js`, `userLineService.js`, `Tool List and Tool Life (machine tabs)`, `Home (Dashboard)`, `Virtual Screen (machine tab)`, `userSupervisorService.js`, `Add / edit production schedule`, `Monitoring (machine list)`, `MainLayout`, `Parts`, `Theme showcase`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Should `AddCustomer.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05154639175257732 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._