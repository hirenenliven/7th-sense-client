# Graph Report - 7th-sense-client  (2026-11-05)

## Corpus Check
- 342 files · ~187,636 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 1998 nodes · 6788 edges · 103 communities (99 shown, 4 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 418 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6ec5c6b1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- healthSampleData.js
- ClienteleFormModal.jsx
- BarLineChart.jsx
- chartTheme.js
- Productivity.jsx
- react
- useAuth
- HolidayFormModal.jsx
- pages.jsx
- Project Docs & Conventions
- dateTime.js
- userCityService.js
- StateFormModal.jsx
- Home.jsx
- ESLint Dev Dependencies
- AddProductionSchedule.jsx
- VirtualScreenParts.jsx
- Runtime Dependencies
- FieldLabel
- AddPart.jsx
- 0001. Single-page app with React 19 and Vite
- machineService.js
- catalogService.js
- MonitorMachineCard.jsx
- SupervisorFormModal.jsx
- jsconfig Aliases
- userCountryService.js
- AddPart
- AddPart
- package.json
- Seven Logo Asset
- sharedGet
- Login Logo Asset
- Virtual Screen (machine tab)
- Machine health
- userCellService.js
- ControllerFormModal.jsx
- DonutChart.jsx
- ProtectedRoute
- healthSensors.js
- Parts
- Controllers
- 0020. Virtual Screen: one REST snapshot polled every 5 s
- 0017. Log in as customer in a new tab, on the tab's own API path
- ReasonFormModal.jsx
- adr/README.md
- Downtime / idle reasons
- BrandLogo.jsx
- AddMachine.jsx
- CellFormModal.jsx
- breakService.js
- 0013. Monitoring starts with a machine list; All Machines is set-up only
- BreakFormModal.jsx
- ShiftFormModal.jsx
- CityFormModal.jsx
- HealthSensorPicker.jsx
- UserGuide.jsx
- 0015. Clientele is a Masters page, not an Account Center tab
- LoginBackdrop.jsx
- AddBranch.jsx
- 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page
- Home (Dashboard)
- States
- Machine models
- @hookform/resolvers
- ChartTooltip.jsx
- 0008. Folder structure by page and by concern
- Tool List and Tool Life (machine tabs)
- 0006. React-Bootstrap with SCSS design tokens
- Branches
- SummaryCards.jsx
- apiClient.js
- react-bootstrap
- holidayService.js
- Loader
- CountryFormModal.jsx
- 0003. Server state via service modules and useLoad, Context only for the session
- shiftService.js
- Topbar.jsx
- withQuery
- ModelFormModal.jsx
- Add / edit branch
- 0005. Forms with react-hook-form and zod
- Customers / Users list
- 0009. Page-wise flow documentation in docs/pages
- 0002. React Router with one route table and role guards
- userSupervisorService.js
- main.jsx
- withQuery
- LocationFormModal.jsx
- ProductionScheduleList.jsx
- 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page
- Brands
- 0007. Recharts for charts, plain SVG for the Gantt
- 0010. Organization levels on one tabbed page, a route per tab
- Customers / Users list
- react-bootstrap
- 0012. Monitoring: Productivity and Machine Health on one tabbed page
- MainLayout.jsx
- Client documentation
- ShopFormModal.jsx
- 0016. Account Center is superadmin only; Users lists company members only

## God Nodes (most connected - your core abstractions)
1. `react` - 133 edges
2. `prop-types` - 115 edges
3. `react-bootstrap` - 100 edges
4. `useAuth()` - 85 edges
5. `Loader()` - 83 edges
6. `withQuery()` - 77 edges
7. `useOrgUser()` - 68 edges
8. `sharedGet()` - 68 edges
9. `toast` - 52 edges
10. `ProtectedRoute()` - 49 edges

## Surprising Connections (you probably didn't know these)
- `Decision` --references--> `ModeGanttChart()`  [INFERRED]
  docs/adr/0007-recharts-for-charts.md → src/components/charts/ModeGanttChart.jsx
- `UI states` --references--> `Loader()`  [INFERRED]
  docs/pages/home.md → src/components/common/Loader.jsx
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

## Communities (103 total, 4 thin omitted)

### Community 0 - "healthSampleData.js"
Cohesion: 0.17
Nodes (23): MACHINE_MODES, buildDay(), dailyRows(), dayLabel, dayLoad(), dayStates(), dayWindow(), hourLabel (+15 more)

### Community 1 - "ClienteleFormModal.jsx"
Cohesion: 0.06
Nodes (62): API calls on this page, Clientele, Decisions, Delete clientele, On page load, Save clientele (add / edit form), Shared components used, State & storage (+54 more)

### Community 2 - "BarLineChart.jsx"
Cohesion: 0.31
Nodes (24): recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), axisPropTypes, renderGrid(), renderLegend(), renderTooltip() (+16 more)

### Community 3 - "chartTheme.js"
Cohesion: 0.12
Nodes (19): AREA_OPACITY, BAND_OPACITY, BAR_GAP, GRID_PROPS, POINT_DOT, SEGMENT_GAP, SERIES_COLORS, STATUS_COLORS (+11 more)

### Community 4 - "Productivity.jsx"
Cohesion: 0.09
Nodes (36): 0019. Monitoring: machine list, then the machine's tabs with a back arrow, Alternatives considered, Consequences, Context, Decision, ModeTimelineCard(), readoutClock, readoutTime (+28 more)

### Community 5 - "react"
Cohesion: 0.07
Nodes (65): prop-types, react, FieldLabel(), IconAction(), InfoTooltip(), LiveClock(), StatusBadge(), ICONS (+57 more)

### Community 6 - "useAuth"
Cohesion: 0.09
Nodes (33): ADR-0018, react-router-dom, ACCOUNT_CENTER_PATHS, STORAGE_KEYS, SUPERADMIN_ONLY, MONITOR_REFRESH_MS, MONITORING_MACHINE_TABS, MONITORING_PATHS (+25 more)

### Community 7 - "HolidayFormModal.jsx"
Cohesion: 0.21
Nodes (13): ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, HOLIDAY_TYPES, SHIFT_TYPES, WEEKDAYS, holidaySchema, INITIAL_VALUES, MAX_LENGTH (+5 more)

### Community 8 - "pages.jsx"
Cohesion: 0.11
Nodes (23): ACCOUNT_KIND, ACCOUNT_PAGES, isAccountOfKind(), customerMobile(), CustomerList(), matchesSearch(), About, BranchList (+15 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "dateTime.js"
Cohesion: 0.07
Nodes (63): ChartDateFilter(), clamp(), DateCalendar(), DatePicker(), dayLabel, keyToDay(), monthGrid(), monthName (+55 more)

### Community 11 - "userCityService.js"
Cohesion: 0.18
Nodes (12): On page load, API calls on this page, Cities, Decisions, Delete user city, On page load, Shared components used, State & storage (+4 more)

### Community 12 - "StateFormModal.jsx"
Cohesion: 0.19
Nodes (16): country-region-data, ALL_COUNTRIES, byName, findLibraryCountry(), getLibraryStateNames(), fromStateKey(), INITIAL_VALUES, keepStatesOf() (+8 more)

### Community 13 - "Home.jsx"
Cohesion: 0.10
Nodes (43): Shared components used, ChartCard(), customerOptionLabel(), dayTitle, Home(), DayCard(), FleetCard(), HourlyCard() (+35 more)

### Community 14 - "ESLint Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 15 - "AddProductionSchedule.jsx"
Cohesion: 0.07
Nodes (41): Add / edit production schedule, API calls on this page, Decisions, Save production schedule (add / edit form), Shared components used, State & storage, UI states, API calls on this page (+33 more)

### Community 16 - "VirtualScreenParts.jsx"
Cohesion: 0.13
Nodes (30): statusOf(), formatCycle(), AlarmBanner(), dateLabel, LiveChip(), timeLabel, VirtualScreen(), AxisLoadBars() (+22 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+8 more)

### Community 18 - "FieldLabel"
Cohesion: 0.32
Nodes (9): brandSchema, INITIAL_VALUES, MAX_LENGTH, toBrandPayload(), toFormValues(), BrandFormModal(), FIELD_HELP, createBrand() (+1 more)

### Community 19 - "AddPart.jsx"
Cohesion: 0.13
Nodes (21): DRAWING_RULES, EMPTY_PROCESS, EMPTY_SUB_PROGRAM, INITIAL_VALUES, MAX_LENGTH, MAX_PART_COUNT, MAX_PROCESSES, MAX_SUB_PROGRAMS (+13 more)

### Community 20 - "0001. Single-page app with React 19 and Vite"
Cohesion: 0.33
Nodes (5): 0001. Single-page app with React 19 and Vite, Alternatives considered, Consequences, Context, Decision

### Community 21 - "machineService.js"
Cohesion: 0.22
Nodes (12): Add / edit machine, API calls on this page, Decisions, Save machine (add / edit form), Shared components used, State & storage, UI states, createMachine() (+4 more)

### Community 22 - "catalogService.js"
Cohesion: 0.33
Nodes (11): On page load, On page load, On page load, Save model (add / edit form), createModel(), getBrands(), getControllers(), getModels() (+3 more)

### Community 23 - "MonitorMachineCard.jsx"
Cohesion: 0.14
Nodes (26): clockMinutes, clockWithSeconds, ModeGanttChart(), TICK_STEPS, ticksFor(), MACHINE_MODE_TYPES, MACHINE_STATUS, modeTypeOf() (+18 more)

### Community 24 - "SupervisorFormModal.jsx"
Cohesion: 0.42
Nodes (7): INITIAL_VALUES, NAME_MAX_LENGTH, supervisorSchema, toFormValues(), toSupervisorPayload(), recordShape, SupervisorFormModal()

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "userCountryService.js"
Cohesion: 0.17
Nodes (15): API calls on this page, Countries, Decisions, Delete user country, On page load, Save user country (add / edit form), Shared components used, State & storage (+7 more)

### Community 27 - "AddPart"
Cohesion: 0.22
Nodes (9): Add / edit part, API calls on this page, Decisions, Shared components used, State & storage, UI states, Upload part drawing, View process drawing (+1 more)

### Community 28 - "AddPart"
Cohesion: 0.33
Nodes (10): Save part (add / edit form), AddPart(), byName(), toFormValues(), createPart(), getParts(), unwrap(), unwrapList() (+2 more)

### Community 29 - "package.json"
Cohesion: 0.08
Nodes (25): name, private, scripts, build, build:theme, dev, lint, preview (+17 more)

### Community 30 - "Seven Logo Asset"
Cohesion: 0.67
Nodes (4): 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents)

### Community 31 - "sharedGet"
Cohesion: 0.13
Nodes (34): On page load, On page load, Save user (add / edit form), On page load, On page load, On page load, ALL_MACHINE_ROLES, ROLE_LABELS (+26 more)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "Virtual Screen (machine tab)"
Cohesion: 0.22
Nodes (9): API calls on this page, Decisions, On page load, Rules & edge cases, Shared components used, State & storage, UI states, Virtual Screen (machine tab) (+1 more)

### Community 34 - "Machine health"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Live updates, Machine health, Shared components used, State & storage, UI states

### Community 35 - "userCellService.js"
Cohesion: 0.18
Nodes (15): API calls on this page, Cells, Decisions, Delete user cell, On page load, Save user cell (add / edit form), Shared components used, State & storage (+7 more)

### Community 36 - "ControllerFormModal.jsx"
Cohesion: 0.29
Nodes (10): Save controller (add / edit form), controllerSchema, INITIAL_VALUES, MAX_LENGTH, toControllerPayload(), toFormValues(), ControllerFormModal(), FIELD_HELP (+2 more)

### Community 37 - "DonutChart.jsx"
Cohesion: 0.28
Nodes (6): LEGEND_BOTTOM_PROPS, LEGEND_PROPS, MUTED_OPACITY, DonutCentre(), DonutChart(), RADIUS

### Community 38 - "ProtectedRoute"
Cohesion: 0.06
Nodes (42): Decision, About, Decisions, State & storage, UI states, Coming soon (unbuilt sidebar links), Decisions, On page load (+34 more)

### Community 39 - "healthSensors.js"
Cohesion: 0.09
Nodes (33): niceTicks(), STEP_MULTIPLES, pointsInRange(), clock, clockSeconds, dayClock, DEFAULT_RANGE, DEFAULT_RANGE_DAYS (+25 more)

### Community 40 - "Parts"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete part, On page load, Parts, Shared components used, State & storage, UI states

### Community 41 - "Controllers"
Cohesion: 0.29
Nodes (7): API calls on this page, Controllers, Decisions, Delete controller, Shared components used, State & storage, UI states

### Community 42 - "0020. Virtual Screen: one REST snapshot polled every 5 s"
Cohesion: 0.33
Nodes (5): 0020. Virtual Screen: one REST snapshot polled every 5 s, Alternatives considered, Consequences, Context, Decision

### Community 43 - "0017. Log in as customer in a new tab, on the tab's own API path"
Cohesion: 0.14
Nodes (14): 0017. Log in as customer in a new tab, on the tab's own API path, Alternatives considered, Consequences, Context, Decision, 0018. Log in as customer opens the dashboard directly (no /login-as page), Alternatives considered, Consequences (+6 more)

### Community 44 - "ReasonFormModal.jsx"
Cohesion: 0.23
Nodes (11): customerLabel(), StatusToggle(), customerName(), INITIAL_VALUES, MAX_LENGTH, REASON_STATUS, reasonSchema, toFormValues() (+3 more)

### Community 46 - "Downtime / idle reasons"
Cohesion: 0.13
Nodes (25): API calls on this page, Decisions, Delete downtime reason, Delete idle reason, Downtime / idle reasons, On page load, Save downtime reason (add / edit form), Save idle reason (add / edit form) (+17 more)

### Community 48 - "AddMachine.jsx"
Cohesion: 0.11
Nodes (30): CONTROLLER_VERSION_TYPES, MACHINE_ACCURACIES, MACHINE_HEALTH_ALL, MACHINE_SYSTEM_TYPES, SECURITY_MODES, AddMachine(), byName(), Field() (+22 more)

### Community 49 - "CellFormModal.jsx"
Cohesion: 0.20
Nodes (18): zod, cellSchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCellPayload(), toFormValues(), CellFormModal(), recordShape (+10 more)

### Community 50 - "breakService.js"
Cohesion: 0.19
Nodes (14): API calls on this page, Breaks, Decisions, Delete break, On page load, Save break (add / edit form), Shared components used, State & storage (+6 more)

### Community 51 - "0013. Monitoring starts with a machine list; All Machines is set-up only"
Cohesion: 0.40
Nodes (5): 0013. Monitoring starts with a machine list; All Machines is set-up only, Alternatives considered, Consequences, Context, Decision

### Community 52 - "BreakFormModal.jsx"
Cohesion: 0.35
Nodes (8): SHIFT_STATUS, breakSchema, INITIAL_VALUES, MAX_LENGTH, toBreakPayload(), toFormValues(), BreakFormModal(), FIELD_HELP

### Community 53 - "ShiftFormModal.jsx"
Cohesion: 0.28
Nodes (13): clock(), EMPTY_BREAK_ROW, INITIAL_VALUES, MAX_BREAKS, MAX_LENGTH, offset(), shiftSchema(), toFormValues() (+5 more)

### Community 54 - "CityFormModal.jsx"
Cohesion: 0.29
Nodes (11): Save user city (add / edit form), citySchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCityPayload(), toFormValues(), CityFormModal(), recordShape (+3 more)

### Community 55 - "HealthSensorPicker.jsx"
Cohesion: 0.50
Nodes (4): MACHINE_HEALTH_SENSORS, ALL_IDS, HealthSensorPicker(), summary()

### Community 56 - "UserGuide.jsx"
Cohesion: 0.20
Nodes (17): navLinks(), NUMBERED_STEPS, OpenLink(), SectionCard(), SECTIONS, SetupStep(), textOf(), UserGuide() (+9 more)

### Community 57 - "0015. Clientele is a Masters page, not an Account Center tab"
Cohesion: 0.50
Nodes (4): 0015. Clientele is a Masters page, not an Account Center tab, Alternatives considered, Consequences, Context

### Community 58 - "LoginBackdrop.jsx"
Cohesion: 0.50
Nodes (3): CENTER, LoginBackdrop(), RINGS

### Community 59 - "AddBranch.jsx"
Cohesion: 0.16
Nodes (21): Save branch (add / edit form), BRANCH_STATUS, AddBranch(), labelClass(), branchSchema, COLOR_PICKER_FALLBACK, INITIAL_VALUES, optional() (+13 more)

### Community 60 - "0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page"
Cohesion: 0.40
Nodes (5): 0014. Business Setup renamed Account Center; old Account Center item removed, Alternatives considered, Consequences, Context, Decision

### Community 61 - "Home (Dashboard)"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Home (Dashboard), On page load, Pick another day or customer, State & storage, UI states

### Community 62 - "States"
Cohesion: 0.19
Nodes (13): API calls on this page, Decisions, Delete user state, Save user state (add / edit form), Shared components used, State & storage, States, UI states (+5 more)

### Community 63 - "Machine models"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete model, Machine models, Shared components used, State & storage, UI states

### Community 64 - "@hookform/resolvers"
Cohesion: 0.07
Nodes (47): API calls on this page, Decisions, Delete licence key, Generate licence keys, Licence keys, On page load, Save licence key (add / edit form), Save licence keys (add / edit form) (+39 more)

### Community 66 - "0008. Folder structure by page and by concern"
Cohesion: 0.33
Nodes (5): 0008. Folder structure by page and by concern, Alternatives considered, Consequences, Context, Decision

### Community 67 - "Tool List and Tool Life (machine tabs)"
Cohesion: 0.12
Nodes (16): API calls on this page, Decisions, On page load, Rules & edge cases, Shared components used, State & storage, Tool List and Tool Life (machine tabs), UI states (+8 more)

### Community 69 - "0006. React-Bootstrap with SCSS design tokens"
Cohesion: 0.33
Nodes (5): 0006. React-Bootstrap with SCSS design tokens, Alternatives considered, Consequences, Context, Decision

### Community 70 - "Branches"
Cohesion: 0.22
Nodes (9): API calls on this page, Branches, Decisions, Delete branch, On page load, Save branch (add / edit form), Shared components used, State & storage (+1 more)

### Community 71 - "SummaryCards.jsx"
Cohesion: 0.10
Nodes (33): On page load, API calls on this page, Change the Machine Modes period, Decisions, Live updates, On page load, Productivity, Shared components used (+25 more)

### Community 72 - "apiClient.js"
Cohesion: 0.24
Nodes (6): On page load, apiClient, pendingGets, unauthorizedListeners, getMachineTimeByDay(), unwrap()

### Community 73 - "react-bootstrap"
Cohesion: 0.13
Nodes (23): CUSTOMER_ROLE_ID, MANAGERS, ROLES, TOAST_DEFAULTS, BreakSetup(), matchesSearch(), HolidaySetup(), matchesSearch() (+15 more)

### Community 74 - "holidayService.js"
Cohesion: 0.19
Nodes (14): API calls on this page, Decisions, Delete holiday, Holidays / week off, On page load, Save holiday (add / edit form), Shared components used, State & storage (+6 more)

### Community 75 - "Loader"
Cohesion: 0.15
Nodes (19): Decision, Loader(), ACCOUNT_CENTER_TABS, AccountCenterPage(), isTabActive(), ClienteleList(), matchesSearch(), byBrandControllerName() (+11 more)

### Community 76 - "CountryFormModal.jsx"
Cohesion: 0.28
Nodes (10): MultiSelectPicker(), summary(), toGroups(), OrgCustomerField(), countrySchema, INITIAL_VALUES, toCountryPayloads(), CountryFormModal() (+2 more)

### Community 77 - "0003. Server state via service modules and useLoad, Context only for the session"
Cohesion: 0.33
Nodes (5): 0003. Server state via service modules and useLoad, Context only for the session, Alternatives considered, Consequences, Context, Decision

### Community 78 - "shiftService.js"
Cohesion: 0.18
Nodes (15): API calls on this page, Decisions, Delete shift, On page load, Save shift (add / edit form), Shared components used, Shifts, State & storage (+7 more)

### Community 80 - "Topbar.jsx"
Cohesion: 0.13
Nodes (28): @/assets/scss/theme-light.scss?inline, BrandLogo(), displayName(), Topbar(), BREAKPOINTS, DEFAULT_THEME, LANGUAGES, THEME (+20 more)

### Community 84 - "withQuery"
Cohesion: 0.10
Nodes (31): API calls on this page, Decisions, Delete user line, Lines, On page load, Save user line (add / edit form), Shared components used, State & storage (+23 more)

### Community 85 - "ModelFormModal.jsx"
Cohesion: 0.32
Nodes (9): ControllerOptions(), groupByBrand(), INITIAL_VALUES, modelSchema, NAME_MAX_LENGTH, toFormValues(), toModelPayload(), ModelFormModal() (+1 more)

### Community 86 - "Add / edit branch"
Cohesion: 0.33
Nodes (6): Add / edit branch, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 89 - "0005. Forms with react-hook-form and zod"
Cohesion: 0.33
Nodes (5): 0005. Forms with react-hook-form and zod, Alternatives considered, Consequences, Context, Decision

### Community 90 - "Customers / Users list"
Cohesion: 0.11
Nodes (20): API calls on this page, App shell (session, logout, theme), Click Log out, Decisions, On page load, Shared components used, State & storage, UI states (+12 more)

### Community 91 - "0009. Page-wise flow documentation in docs/pages"
Cohesion: 0.33
Nodes (5): 0009. Page-wise flow documentation in docs/pages, Alternatives considered, Consequences, Context, Decision

### Community 92 - "0002. React Router with one route table and role guards"
Cohesion: 0.40
Nodes (4): 0002. React Router with one route table and role guards, Alternatives considered, Consequences, Context

### Community 93 - "userSupervisorService.js"
Cohesion: 0.18
Nodes (15): API calls on this page, Decisions, Delete user supervisor, On page load, Save user supervisor (add / edit form), Shared components used, State & storage, Supervisors (+7 more)

### Community 94 - "main.jsx"
Cohesion: 0.12
Nodes (19): 0004. Axios client with the HttpOnly session cookie, Alternatives considered, Consequences, Context, Decision, bootstrap-icons, @fontsource-variable/roboto, react-dom (+11 more)

### Community 95 - "withQuery"
Cohesion: 0.18
Nodes (15): API calls on this page, Decisions, Delete user location, Locations, On page load, Save user location (add / edit form), Shared components used, State & storage (+7 more)

### Community 97 - "LocationFormModal.jsx"
Cohesion: 0.42
Nodes (7): INITIAL_VALUES, locationSchema, NAME_MAX_LENGTH, toFormValues(), toLocationPayload(), LocationFormModal(), recordShape

### Community 98 - "ProductionScheduleList.jsx"
Cohesion: 0.60
Nodes (5): matchesSearch(), ProductionScheduleList(), scheduleDates(), ProductionScheduleList, deleteProductionSchedule()

### Community 99 - "0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page"
Cohesion: 0.40
Nodes (5): 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page, Alternatives considered, Consequences, Context, Decision

### Community 100 - "Brands"
Cohesion: 0.22
Nodes (9): API calls on this page, Brands, Decisions, Delete brand, On page load, Save brand (add / edit form), Shared components used, State & storage (+1 more)

### Community 101 - "0007. Recharts for charts, plain SVG for the Gantt"
Cohesion: 0.33
Nodes (5): 0007. Recharts for charts, plain SVG for the Gantt, Alternatives considered, Consequences, Context, Decision

### Community 103 - "0010. Organization levels on one tabbed page, a route per tab"
Cohesion: 0.33
Nodes (5): 0010. Organization levels on one tabbed page, a route per tab, Alternatives considered, Consequences, Context, Decision

### Community 104 - "Customers / Users list"
Cohesion: 0.11
Nodes (19): Change theme, Change theme, Add / edit customer or user, API calls on this page, Change theme, Decisions, Shared components used, State & storage (+11 more)

### Community 105 - "react-bootstrap"
Cohesion: 0.12
Nodes (63): Rules & edge cases, react-bootstrap, ConfirmModal(), ARIA_SORT, SortableHead(), NoResults(), TableNoResults(), pageItems() (+55 more)

### Community 106 - "0012. Monitoring: Productivity and Machine Health on one tabbed page"
Cohesion: 0.40
Nodes (5): 0012. Monitoring: Productivity and Machine Health on one tabbed page, Alternatives considered, Consequences, Context, Decision

### Community 107 - "MainLayout.jsx"
Cohesion: 0.25
Nodes (11): Footer(), AppShell(), Sidebar(), isAlsoActive(), linkClass(), navLeafShape, SidebarItem(), SidebarContext (+3 more)

### Community 114 - "Client documentation"
Cohesion: 0.40
Nodes (4): Client documentation, How to use Postman, How to view the API docs in Chrome (Swagger UI), How to view the page flow docs

### Community 115 - "ShopFormModal.jsx"
Cohesion: 0.42
Nodes (7): INITIAL_VALUES, NAME_MAX_LENGTH, shopSchema, toFormValues(), toShopPayload(), recordShape, ShopFormModal()

### Community 116 - "0016. Account Center is superadmin only; Users lists company members only"
Cohesion: 0.40
Nodes (5): 0016. Account Center is superadmin only; Users lists company members only, Alternatives considered, Consequences, Context, Decision

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **11 isolated node(s):** `bootstrap`, `@types/react`, `@types/react-dom`, `eslint`, `sass` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 417 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ClienteleFormModal.jsx`, `BarLineChart.jsx`, `chartTheme.js`, `Productivity.jsx`, `useAuth`, `HolidayFormModal.jsx`, `pages.jsx`, `dateTime.js`, `StateFormModal.jsx`, `Home.jsx`, `AddProductionSchedule.jsx`, `VirtualScreenParts.jsx`, `FieldLabel`, `AddPart.jsx`, `MonitorMachineCard.jsx`, `SupervisorFormModal.jsx`, `package.json`, `sharedGet`, `ControllerFormModal.jsx`, `DonutChart.jsx`, `healthSensors.js`, `ReasonFormModal.jsx`, `AddMachine.jsx`, `CellFormModal.jsx`, `BreakFormModal.jsx`, `ShiftFormModal.jsx`, `CityFormModal.jsx`, `UserGuide.jsx`, `LoginBackdrop.jsx`, `AddBranch.jsx`, `@hookform/resolvers`, `SummaryCards.jsx`, `apiClient.js`, `react-bootstrap`, `Loader`, `CountryFormModal.jsx`, `Topbar.jsx`, `ModelFormModal.jsx`, `main.jsx`, `LocationFormModal.jsx`, `ProductionScheduleList.jsx`, `react-bootstrap`, `MainLayout.jsx`, `ShopFormModal.jsx`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `useAuth()` (e.g. with `State & storage` and `State & storage`) actually correct?**
  _`useAuth()` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ClienteleFormModal.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06351236146632566 - nodes in this community are weakly interconnected._
- **Why does `ProtectedRoute()` connect `ProtectedRoute` to `ClienteleFormModal.jsx`, `useAuth`, `userCityService.js`, `AddProductionSchedule.jsx`, `machineService.js`, `userCountryService.js`, `AddPart`, `Virtual Screen (machine tab)`, `Machine health`, `userCellService.js`, `Parts`, `Controllers`, `0017. Log in as customer in a new tab, on the tab's own API path`, `Downtime / idle reasons`, `breakService.js`, `Home (Dashboard)`, `States`, `Machine models`, `@hookform/resolvers`, `Tool List and Tool Life (machine tabs)`, `Branches`, `SummaryCards.jsx`, `holidayService.js`, `Loader`, `shiftService.js`, `withQuery`, `Add / edit branch`, `Customers / Users list`, `userSupervisorService.js`, `main.jsx`, `withQuery`, `Brands`, `Customers / Users list`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Loader()` (e.g. with `Shared components used` and `UI states`) actually correct?**
  _`Loader()` has 2 INFERRED edges - model-reasoned connections that need verification._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._