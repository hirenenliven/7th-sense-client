# Graph Report - 7th-sense-client  (2026-11-05)

## Corpus Check
- 334 files · ~180,425 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 1907 nodes · 6439 edges · 102 communities (98 shown, 4 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 400 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3ec5f56e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Login.jsx
- ClienteleFormModal.jsx
- BarLineChart.jsx
- licenceKeyService.js
- Productivity.jsx
- react
- BrandFormModal.jsx
- HolidayFormModal.jsx
- ControllerFormModal.jsx
- Project Docs & Conventions
- dateTime.js
- dateTime.js
- StateFormModal.jsx
- Speedometer.jsx
- ESLint Dev Dependencies
- AddProductionSchedule.jsx
- MainLayout.jsx
- Runtime Dependencies
- healthSampleData.js
- AddPart.jsx
- 0001. Single-page app with React 19 and Vite
- getUsers
- catalogService.js
- MonitorMachineCard.jsx
- SupervisorFormModal.jsx
- jsconfig Aliases
- userCountryService.js
- AddPart
- MonitoringMachine.jsx
- package.json
- Seven Logo Asset
- Add / edit part
- Login Logo Asset
- SidebarItem.jsx
- Machine health
- userCellService.js
- PlannedTab
- Parts
- ProtectedRoute
- healthSensors.js
- holidayService.js
- Controllers
- Add / edit machine
- ShiftCard.jsx
- ProcessFields.jsx
- adr/README.md
- Downtime / idle reasons
- Machine models
- AddMachine.jsx
- LineFormModal.jsx
- Holidays / week off
- userLocationService.js
- BreakFormModal.jsx
- ShiftFormModal.jsx
- CityFormModal.jsx
- Production schedules
- UserGuide.jsx
- Theme showcase
- Monitoring › Machines
- AddBranch.jsx
- 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page
- withQuery
- States
- chartLegend.jsx
- LicenceKeyGenerator.jsx
- useLoad
- 0008. Folder structure by page and by concern
- User guide
- ChartTooltip.jsx
- 0006. React-Bootstrap with SCSS design tokens
- toast.js
- SummaryCards.jsx
- sharedGet
- Breaks
- Tool List, Tool Life and Virtual Screen (machine tabs)
- CountryFormModal.jsx
- 0003. Server state via service modules and useLoad, Context only for the session
- shiftService.js
- SidebarProvider.jsx
- userLineService.js
- userShopService.js
- ModelFormModal.jsx
- CellFormModal.jsx
- vite.config.js
- 0005. Forms with react-hook-form and zod
- AuthProvider.jsx
- 0009. Page-wise flow documentation in docs/pages
- 0002. React Router with one route table and role guards
- theme.js
- Locations
- LocationFormModal.jsx
- Brands
- ModeGanttChart.jsx
- Add / edit production schedule
- apiBaseUrl
- react-bootstrap
- constants/navigation.js
- scripts
- Client documentation
- ShopFormModal.jsx
- 0016. Account Center is superadmin only; Users lists company members only

## God Nodes (most connected - your core abstractions)
1. `react` - 130 edges
2. `prop-types` - 112 edges
3. `react-bootstrap` - 96 edges
4. `useAuth()` - 83 edges
5. `Loader()` - 77 edges
6. `withQuery()` - 74 edges
7. `useOrgUser()` - 66 edges
8. `sharedGet()` - 65 edges
9. `toast` - 52 edges
10. `ProtectedRoute()` - 48 edges

## Surprising Connections (you probably didn't know these)
- `Open productivity / health` --references--> `machineMonitorPath()`  [INFERRED]
  docs/pages/monitoring-machines.md → src/constants/monitoring.js
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

## Communities (102 total, 4 thin omitted)

### Community 0 - "Login.jsx"
Cohesion: 0.19
Nodes (11): BrandLogo(), LOGO_MARKUP, env, Login(), redirectTarget(), CENTER, LoginBackdrop(), RINGS (+3 more)

### Community 1 - "ClienteleFormModal.jsx"
Cohesion: 0.06
Nodes (66): API calls on this page, Clientele, Decisions, Delete clientele, On page load, Save clientele (add / edit form), Shared components used, State & storage (+58 more)

### Community 2 - "BarLineChart.jsx"
Cohesion: 0.19
Nodes (38): recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), axisPropTypes, renderGrid(), renderLegend(), renderTooltip() (+30 more)

### Community 3 - "licenceKeyService.js"
Cohesion: 0.16
Nodes (18): API calls on this page, Decisions, Delete licence key, Generate licence keys, Licence keys, On page load, Save licence key (add / edit form), Save licence keys (add / edit form) (+10 more)

### Community 4 - "Productivity.jsx"
Cohesion: 0.11
Nodes (31): readoutClock, readoutTime, chartMessage(), dayLabel, pickedMachineIds(), Productivity(), programIn(), programOptions() (+23 more)

### Community 5 - "react"
Cohesion: 0.12
Nodes (40): prop-types, react, IconAction(), LiveClock(), StatusBadge(), CLOCK_TICK_MS, ACTION_ICONS, OrgUserContext (+32 more)

### Community 6 - "BrandFormModal.jsx"
Cohesion: 0.35
Nodes (8): brandSchema, INITIAL_VALUES, MAX_LENGTH, toBrandPayload(), toFormValues(), BrandFormModal(), FIELD_HELP, createBrand()

### Community 7 - "HolidayFormModal.jsx"
Cohesion: 0.20
Nodes (14): ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, HOLIDAY_TYPES, SHIFT_STATUS, SHIFT_TYPES, WEEKDAYS, holidaySchema, INITIAL_VALUES (+6 more)

### Community 8 - "ControllerFormModal.jsx"
Cohesion: 0.35
Nodes (8): controllerSchema, INITIAL_VALUES, MAX_LENGTH, toControllerPayload(), toFormValues(), ControllerFormModal(), FIELD_HELP, updateController()

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "dateTime.js"
Cohesion: 0.11
Nodes (42): ChartDateFilter(), clamp(), DateCalendar(), DatePicker(), dayLabel, keyToDay(), monthGrid(), monthName (+34 more)

### Community 11 - "dateTime.js"
Cohesion: 0.13
Nodes (20): centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel(), TimePicker(), EXCEPTIONS, FILTERS (+12 more)

### Community 12 - "StateFormModal.jsx"
Cohesion: 0.16
Nodes (19): country-region-data, MultiSelectPicker(), summary(), toGroups(), ALL_COUNTRIES, byName, findLibraryCountry(), getLibraryStateNames() (+11 more)

### Community 13 - "Speedometer.jsx"
Cohesion: 0.24
Nodes (9): STATUS_COLORS, TRACK_COLOR, clamp(), Needle(), PIE_PROPS, polar(), Speedometer(), TRACK_RADIUS (+1 more)

### Community 14 - "ESLint Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 15 - "AddProductionSchedule.jsx"
Cohesion: 0.09
Nodes (37): Save production schedule (add / edit form), react-hook-form, FieldLabel(), StatusToggle(), AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS (+29 more)

### Community 16 - "MainLayout.jsx"
Cohesion: 0.44
Nodes (7): Footer(), AppShell(), Sidebar(), displayName(), Topbar(), useSidebar(), filterNavByRole()

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+8 more)

### Community 18 - "healthSampleData.js"
Cohesion: 0.17
Nodes (21): buildDay(), dailyRows(), dayLabel, dayLoad(), dayStates(), dayWindow(), hourLabel, hourlyTemperatures() (+13 more)

### Community 19 - "AddPart.jsx"
Cohesion: 0.16
Nodes (18): byName(), DRAWING_RULES, EMPTY_PROCESS, INITIAL_VALUES, MAX_PART_COUNT, MAX_PROCESSES, PART_STATUS, partSchema (+10 more)

### Community 20 - "0001. Single-page app with React 19 and Vite"
Cohesion: 0.33
Nodes (5): 0001. Single-page app with React 19 and Vite, Alternatives considered, Consequences, Context, Decision

### Community 21 - "getUsers"
Cohesion: 0.10
Nodes (21): API calls on this page, App shell (session, logout, theme), Change theme, Decisions, On page load, Shared components used, State & storage, UI states (+13 more)

### Community 22 - "catalogService.js"
Cohesion: 0.39
Nodes (8): On page load, On page load, createController(), getBrands(), getModels(), unwrap(), unwrapList(), updateBrand()

### Community 23 - "MonitorMachineCard.jsx"
Cohesion: 0.18
Nodes (20): MACHINE_STATUS, modeTypeOf(), MachineMode(), MachineRow(), MachineViewToggle(), MACHINE_VIEWS, MachineCycles(), MachineOee() (+12 more)

### Community 24 - "SupervisorFormModal.jsx"
Cohesion: 0.14
Nodes (22): API calls on this page, Decisions, Delete user supervisor, On page load, Save user supervisor (add / edit form), Shared components used, State & storage, Supervisors (+14 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "userCountryService.js"
Cohesion: 0.18
Nodes (14): API calls on this page, Countries, Decisions, Delete user country, On page load, Save user country (add / edit form), Shared components used, State & storage (+6 more)

### Community 27 - "AddPart"
Cohesion: 0.31
Nodes (12): Save part (add / edit form), On page load, On page load, AddPart(), createPart(), getPartById(), getParts(), partDrawingUrl() (+4 more)

### Community 28 - "MonitoringMachine.jsx"
Cohesion: 0.10
Nodes (25): 0012. Monitoring: Productivity and Machine Health on one tabbed page, Alternatives considered, Consequences, Context, Decision, 0013. Monitoring starts with a machine list; All Machines is set-up only, Alternatives considered, Consequences (+17 more)

### Community 29 - "package.json"
Cohesion: 0.14
Nodes (15): name, private, type, version, axios, bootstrap, eslint, @eslint/js (+7 more)

### Community 30 - "Seven Logo Asset"
Cohesion: 0.67
Nodes (4): 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents)

### Community 31 - "Add / edit part"
Cohesion: 0.22
Nodes (9): Add / edit part, API calls on this page, Decisions, On page load, Shared components used, State & storage, UI states, Upload part drawing (+1 more)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "SidebarItem.jsx"
Cohesion: 0.42
Nodes (7): isAlsoActive(), linkClass(), navLeafShape, SidebarItem(), flattenNav(), hasActiveChild(), isPathActive()

### Community 34 - "Machine health"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Live updates, Machine health, On page load, Shared components used, State & storage, UI states

### Community 35 - "userCellService.js"
Cohesion: 0.18
Nodes (15): API calls on this page, Cells, Decisions, Delete user cell, On page load, Save user cell (add / edit form), Shared components used, State & storage (+7 more)

### Community 36 - "PlannedTab"
Cohesion: 0.46
Nodes (4): PlannedTab(), ToolLife(), ToolList(), VirtualScreen()

### Community 37 - "Parts"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete part, Parts, Shared components used, State & storage, UI states, deletePart()

### Community 38 - "ProtectedRoute"
Cohesion: 0.07
Nodes (38): Decision, About, Decisions, State & storage, UI states, Coming soon (unbuilt sidebar links), Decisions, On page load (+30 more)

### Community 39 - "healthSensors.js"
Cohesion: 0.09
Nodes (39): ChartCard(), niceTicks(), STEP_MULTIPLES, MACHINE_MODES, pointsInRange(), clock, clockSeconds, dayClock (+31 more)

### Community 40 - "holidayService.js"
Cohesion: 0.52
Nodes (6): Save holiday (add / edit form), createHoliday(), getHolidays(), unwrap(), unwrapList(), updateHoliday()

### Community 41 - "Controllers"
Cohesion: 0.20
Nodes (10): API calls on this page, Controllers, Decisions, Delete controller, On page load, Save controller (add / edit form), Shared components used, State & storage (+2 more)

### Community 42 - "Add / edit machine"
Cohesion: 0.29
Nodes (6): Add / edit machine, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 43 - "ShiftCard.jsx"
Cohesion: 0.35
Nodes (11): itemMinutes(), ScheduleJobFields(), Clock(), minutesBetween(), ShiftCard(), toMinutes(), typeLabel(), clockToMinutes() (+3 more)

### Community 44 - "ProcessFields.jsx"
Cohesion: 0.17
Nodes (14): MACHINE_ACCURACIES, checkDrawing, DrawingUpload(), MachinePicker(), summary(), EMPTY_SUB_PROGRAM, MAX_LENGTH, MAX_SUB_PROGRAMS (+6 more)

### Community 46 - "Downtime / idle reasons"
Cohesion: 0.13
Nodes (25): API calls on this page, Decisions, Delete downtime reason, Delete idle reason, Downtime / idle reasons, On page load, Save downtime reason (add / edit form), Save idle reason (add / edit form) (+17 more)

### Community 47 - "Machine models"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete model, Machine models, Shared components used, State & storage, UI states

### Community 48 - "AddMachine.jsx"
Cohesion: 0.07
Nodes (50): Save machine (add / edit form), All machines, API calls on this page, Decisions, Delete machine, Edit machine, On page load, Shared components used (+42 more)

### Community 49 - "LineFormModal.jsx"
Cohesion: 0.42
Nodes (7): INITIAL_VALUES, lineSchema, NAME_MAX_LENGTH, toFormValues(), toLinePayload(), LineFormModal(), recordShape

### Community 50 - "Holidays / week off"
Cohesion: 0.22
Nodes (9): API calls on this page, Decisions, Delete holiday, Holidays / week off, On page load, Shared components used, State & storage, UI states (+1 more)

### Community 51 - "userLocationService.js"
Cohesion: 0.60
Nodes (5): Save user location (add / edit form), createUserLocation(), unwrap(), unwrapList(), updateUserLocation()

### Community 52 - "BreakFormModal.jsx"
Cohesion: 0.22
Nodes (14): On page load, Save break (add / edit form), breakSchema, INITIAL_VALUES, MAX_LENGTH, toBreakPayload(), toFormValues(), BreakFormModal() (+6 more)

### Community 53 - "ShiftFormModal.jsx"
Cohesion: 0.28
Nodes (13): clock(), EMPTY_BREAK_ROW, INITIAL_VALUES, MAX_BREAKS, MAX_LENGTH, offset(), shiftSchema(), toFormValues() (+5 more)

### Community 54 - "CityFormModal.jsx"
Cohesion: 0.38
Nodes (8): citySchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCityPayload(), toFormValues(), CityFormModal(), recordShape, withCustomer()

### Community 55 - "Production schedules"
Cohesion: 0.22
Nodes (9): API calls on this page, Decisions, Delete production schedule, On page load, Production schedules, Shared components used, State & storage, UI states (+1 more)

### Community 56 - "UserGuide.jsx"
Cohesion: 0.17
Nodes (19): InfoTooltip(), navLinks(), NUMBERED_STEPS, OpenLink(), SectionCard(), SECTIONS, SetupStep(), textOf() (+11 more)

### Community 57 - "Theme showcase"
Cohesion: 0.40
Nodes (5): Decisions, Shared components used, State & storage, Theme showcase, UI states

### Community 58 - "Monitoring › Machines"
Cohesion: 0.22
Nodes (9): API calls on this page, Decisions, Monitoring (machine list), On page load, Open productivity / health, Rules & edge cases, Shared components used, State & storage (+1 more)

### Community 59 - "AddBranch.jsx"
Cohesion: 0.08
Nodes (39): Add / edit branch, API calls on this page, Decisions, On page load, Save branch (add / edit form), Shared components used, State & storage, UI states (+31 more)

### Community 60 - "0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page"
Cohesion: 0.11
Nodes (15): 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page, Alternatives considered, Consequences, Context, Decision, 0014. Business Setup renamed Account Center; old Account Center item removed, Alternatives considered, Consequences (+7 more)

### Community 61 - "withQuery"
Cohesion: 0.20
Nodes (16): API calls on this page, Cities, Decisions, Delete user city, On page load, Save user city (add / edit form), Shared components used, State & storage (+8 more)

### Community 62 - "States"
Cohesion: 0.18
Nodes (14): API calls on this page, Decisions, Delete user state, On page load, Save user state (add / edit form), Shared components used, State & storage, States (+6 more)

### Community 64 - "LicenceKeyGenerator.jsx"
Cohesion: 0.10
Nodes (30): Dashboard, Masters, Masters › Downtime, Masters › Organization, Masters › Shift, Masters › Users, Operations, Operations › Monitoring (+22 more)

### Community 65 - "useLoad"
Cohesion: 0.27
Nodes (10): API calls on this page, Change the Machine Modes period, Decisions, Live updates, On page load, Productivity, Shared components used, State & storage (+2 more)

### Community 66 - "0008. Folder structure by page and by concern"
Cohesion: 0.33
Nodes (5): 0008. Folder structure by page and by concern, Alternatives considered, Consequences, Context, Decision

### Community 67 - "User guide"
Cohesion: 0.25
Nodes (8): Decisions, On page load, Rules & edge cases, Sections, Shared components used, State & storage, UI states, User guide

### Community 69 - "0006. React-Bootstrap with SCSS design tokens"
Cohesion: 0.33
Nodes (5): 0006. React-Bootstrap with SCSS design tokens, Alternatives considered, Consequences, Context, Decision

### Community 70 - "toast.js"
Cohesion: 0.50
Nodes (5): dismiss(), emit(), remove(), setToasts(), show()

### Community 71 - "SummaryCards.jsx"
Cohesion: 0.17
Nodes (21): DEFAULT_MODE_RANGE, formatCount(), formatCycle(), KPI_REFRESH_MS, MODE_RANGES, SUMMARY_MODE_IDS, modeSeconds(), sinceLabel (+13 more)

### Community 72 - "sharedGet"
Cohesion: 0.18
Nodes (12): Decision, On page load, apiClient, pendingGets, sharedGet(), unauthorizedListeners, getMachineTimeByDay(), unwrap() (+4 more)

### Community 73 - "Breaks"
Cohesion: 0.25
Nodes (8): API calls on this page, Breaks, Decisions, Delete break, Shared components used, State & storage, UI states, deleteBreak()

### Community 75 - "Tool List, Tool Life and Virtual Screen (machine tabs)"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, On page load, Rules & edge cases, Shared components used, State & storage, Tool List, Tool Life and Virtual Screen (machine tabs), UI states

### Community 76 - "CountryFormModal.jsx"
Cohesion: 0.39
Nodes (7): countrySchema, INITIAL_VALUES, toCountryPayloads(), CountryFormModal(), NOUN, sameName(), ownedBy()

### Community 77 - "0003. Server state via service modules and useLoad, Context only for the session"
Cohesion: 0.40
Nodes (4): 0003. Server state via service modules and useLoad, Context only for the session, Alternatives considered, Consequences, Context

### Community 78 - "shiftService.js"
Cohesion: 0.18
Nodes (16): API calls on this page, Decisions, Delete shift, On page load, Save shift (add / edit form), Shared components used, Shifts, State & storage (+8 more)

### Community 80 - "SidebarProvider.jsx"
Cohesion: 0.33
Nodes (7): BREAKPOINTS, SidebarContext, SidebarProvider(), useMediaQuery(), useMachineView(), readStorage(), writeStorage()

### Community 83 - "userLineService.js"
Cohesion: 0.18
Nodes (15): API calls on this page, Decisions, Delete user line, Lines, On page load, Save user line (add / edit form), Shared components used, State & storage (+7 more)

### Community 84 - "userShopService.js"
Cohesion: 0.18
Nodes (15): API calls on this page, Decisions, Delete user shop, On page load, Save user shop (add / edit form), Shared components used, Shops, State & storage (+7 more)

### Community 85 - "ModelFormModal.jsx"
Cohesion: 0.26
Nodes (12): Save model (add / edit form), ControllerOptions(), groupByBrand(), INITIAL_VALUES, modelSchema, NAME_MAX_LENGTH, toFormValues(), toModelPayload() (+4 more)

### Community 87 - "CellFormModal.jsx"
Cohesion: 0.32
Nodes (9): zod, cellSchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCellPayload(), toFormValues(), CellFormModal(), recordShape (+1 more)

### Community 88 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 89 - "0005. Forms with react-hook-form and zod"
Cohesion: 0.33
Nodes (5): 0005. Forms with react-hook-form and zod, Alternatives considered, Consequences, Context, Decision

### Community 90 - "AuthProvider.jsx"
Cohesion: 0.08
Nodes (28): 0004. Axios client with the HttpOnly session cookie, Alternatives considered, Consequences, Context, Decision, Click Log out, API calls on this page, Decisions (+20 more)

### Community 91 - "0009. Page-wise flow documentation in docs/pages"
Cohesion: 0.33
Nodes (5): 0009. Page-wise flow documentation in docs/pages, Alternatives considered, Consequences, Context, Decision

### Community 92 - "0002. React Router with one route table and role guards"
Cohesion: 0.40
Nodes (4): 0002. React Router with one route table and role guards, Alternatives considered, Consequences, Context

### Community 94 - "theme.js"
Cohesion: 0.18
Nodes (15): bootstrap-icons, @fontsource-variable/roboto, react-dom, @/assets/scss/theme-light.scss?inline, DEFAULT_THEME, useTheme(), applyTheme(), chooseTheme() (+7 more)

### Community 95 - "Locations"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete user location, Locations, Shared components used, State & storage, UI states

### Community 97 - "LocationFormModal.jsx"
Cohesion: 0.32
Nodes (9): customerLabel(), OrgCustomerField(), INITIAL_VALUES, locationSchema, NAME_MAX_LENGTH, toFormValues(), toLocationPayload(), LocationFormModal() (+1 more)

### Community 100 - "Brands"
Cohesion: 0.20
Nodes (10): API calls on this page, Brands, Decisions, Delete brand, On page load, Save brand (add / edit form), Shared components used, State & storage (+2 more)

### Community 101 - "ModeGanttChart.jsx"
Cohesion: 0.14
Nodes (13): 0007. Recharts for charts, plain SVG for the Gantt, Alternatives considered, Consequences, Context, Decision, clockMinutes, clockWithSeconds, ModeGanttChart() (+5 more)

### Community 102 - "Add / edit production schedule"
Cohesion: 0.33
Nodes (6): Add / edit production schedule, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 104 - "apiBaseUrl"
Cohesion: 0.14
Nodes (14): 0017. Log in as customer in a new tab, on the tab's own API path, Alternatives considered, Consequences, Context, Decision, 0018. Log in as customer opens the dashboard directly (no /login-as page), Alternatives considered, Consequences (+6 more)

### Community 105 - "react-bootstrap"
Cohesion: 0.05
Nodes (151): ADR-0018, Save user (add / edit form), On page load, On page load, react-bootstrap, react-router-dom, ConfirmModal(), Loader() (+143 more)

### Community 107 - "constants/navigation.js"
Cohesion: 0.16
Nodes (11): 0010. Organization levels on one tabbed page, a route per tab, Alternatives considered, Consequences, Context, Decision, ACCOUNT_CENTER_PATHS, NAV_SECTIONS, ORGANIZATION_PATHS (+3 more)

### Community 112 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 114 - "Client documentation"
Cohesion: 0.50
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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 398 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProtectedRoute()` connect `ProtectedRoute` to `ClienteleFormModal.jsx`, `licenceKeyService.js`, `getUsers`, `SupervisorFormModal.jsx`, `userCountryService.js`, `Add / edit part`, `Machine health`, `userCellService.js`, `Parts`, `Controllers`, `Add / edit machine`, `Downtime / idle reasons`, `Machine models`, `AddMachine.jsx`, `Holidays / week off`, `Production schedules`, `Theme showcase`, `Monitoring › Machines`, `AddBranch.jsx`, `withQuery`, `States`, `useLoad`, `User guide`, `Breaks`, `Tool List, Tool Life and Virtual Screen (machine tabs)`, `shiftService.js`, `userLineService.js`, `userShopService.js`, `Locations`, `Brands`, `Add / edit production schedule`, `apiBaseUrl`, `react-bootstrap`?**
  _High betweenness centrality (0.158) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `useAuth()` (e.g. with `State & storage` and `State & storage`) actually correct?**
  _`useAuth()` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ClienteleFormModal.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.061088485746019994 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Login.jsx`, `ClienteleFormModal.jsx`, `BarLineChart.jsx`, `Productivity.jsx`, `BrandFormModal.jsx`, `HolidayFormModal.jsx`, `ControllerFormModal.jsx`, `dateTime.js`, `dateTime.js`, `StateFormModal.jsx`, `Speedometer.jsx`, `AddProductionSchedule.jsx`, `MainLayout.jsx`, `AddPart.jsx`, `MonitorMachineCard.jsx`, `SupervisorFormModal.jsx`, `MonitoringMachine.jsx`, `package.json`, `SidebarItem.jsx`, `ProtectedRoute`, `healthSensors.js`, `ShiftCard.jsx`, `AddMachine.jsx`, `LineFormModal.jsx`, `BreakFormModal.jsx`, `ShiftFormModal.jsx`, `CityFormModal.jsx`, `UserGuide.jsx`, `AddBranch.jsx`, `LicenceKeyGenerator.jsx`, `SummaryCards.jsx`, `sharedGet`, `CountryFormModal.jsx`, `SidebarProvider.jsx`, `ModelFormModal.jsx`, `CellFormModal.jsx`, `AuthProvider.jsx`, `theme.js`, `LocationFormModal.jsx`, `ModeGanttChart.jsx`, `react-bootstrap`, `constants/navigation.js`, `ShopFormModal.jsx`?**
  _High betweenness centrality (0.158) - this node is a cross-community bridge._
- **Should `Productivity.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10588235294117647 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._