# Graph Report - 7th-sense-client  (2026-11-04)

## Corpus Check
- 312 files · ~171,483 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 1806 nodes · 6058 edges · 104 communities (102 shown, 2 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 374 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `860acb45`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- healthSampleData.js
- MachineHealth.jsx
- BarLineChart.jsx
- ConfirmModal
- Productivity.jsx
- react
- react-bootstrap
- AddMachine.jsx
- AddBranch.jsx
- Project Docs & Conventions
- dateTime.js
- TimePicker.jsx
- StateFormModal.jsx
- pages.jsx
- ESLint Dev Dependencies
- AddProductionSchedule.jsx
- AddCustomer.jsx
- Runtime Dependencies
- Login.jsx
- Customers / Users list
- 0001. Single-page app with React 19 and Vite
- AddPart.jsx
- app.js
- machines.js
- useAuth
- jsconfig Aliases
- userCountryService.js
- shiftService.js
- LicenceKeyGenerator.jsx
- package.json
- Seven Logo Asset
- AuthProvider.jsx
- Login Logo Asset
- ControllerFormModal.jsx
- toast.js
- CityFormModal.jsx
- toast
- useTableSort
- react-router-dom
- AddPart
- customerForm.js
- Production schedules
- ProtectedRoute
- Cities
- HolidayFormModal.jsx
- adr/README.md
- Downtime / idle reasons
- ModelFormModal.jsx
- apiClient.js
- catalogService.js
- Parts
- ShopFormModal.jsx
- clienteleService.js
- ClienteleFormModal.jsx
- Monitoring › Machines
- CountryFormModal.jsx
- UserGuide.jsx
- userSupervisorService.js
- LineFormModal.jsx
- userCellService.js
- CellFormModal.jsx
- userStateService.js
- Machine health
- LineFormModal.jsx
- SupervisorFormModal.jsx
- Locations
- 0008. Folder structure by page and by concern
- User guide
- BreakFormModal.jsx
- 0006. React-Bootstrap with SCSS design tokens
- ShiftFormModal.jsx
- Client documentation
- withQuery
- breakService.js
- All machines
- LocationFormModal.jsx
- Loader
- ShiftCard.jsx
- AddProductionSchedule
- Holidays / week off
- Shops
- 0014. Business Setup renamed Account Center; old Account Center item removed
- useLoad
- Branches
- 0002. React Router with one route table and role guards
- StateList.jsx
- Controllers
- Add / edit branch
- Clientele
- 0005. Forms with react-hook-form and zod
- machineService.js
- 0009. Page-wise flow documentation in docs/pages
- ModelList.jsx
- 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page
- validators.js
- Add / edit customer or user
- Add / edit machine
- userLocationService.js
- userShopService.js
- scripts
- ProductionScheduleList.jsx
- 0003. Server state via service modules and useLoad, Context only for the session
- HealthSensorPicker.jsx
- FieldLabel

## God Nodes (most connected - your core abstractions)
1. `react` - 127 edges
2. `prop-types` - 102 edges
3. `react-bootstrap` - 90 edges
4. `useAuth()` - 81 edges
5. `Loader()` - 79 edges
6. `withQuery()` - 73 edges
7. `useOrgUser()` - 64 edges
8. `sharedGet()` - 64 edges
9. `toast` - 50 edges
10. `ProtectedRoute()` - 45 edges

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

## Communities (104 total, 2 thin omitted)

### Community 0 - "healthSampleData.js"
Cohesion: 0.17
Nodes (24): buildDay(), dailyRows(), dayLabel, dayLoad(), dayStates(), dayWindow(), hourLabel, hourlyTemperatures() (+16 more)

### Community 1 - "MachineHealth.jsx"
Cohesion: 0.08
Nodes (35): niceTicks(), STEP_MULTIPLES, pointsInRange(), clock, clockSeconds, dayClock, DEFAULT_RANGE, DEFAULT_RANGE_DAYS (+27 more)

### Community 2 - "BarLineChart.jsx"
Cohesion: 0.12
Nodes (51): recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), LEGEND_BOTTOM_PROPS, LEGEND_PROPS, axisPropTypes, renderGrid() (+43 more)

### Community 3 - "ConfirmModal"
Cohesion: 0.10
Nodes (41): ConfirmModal(), SortableHead(), pageItems(), TablePagination(), BranchList(), matchesSearch(), BreakSetup(), matchesSearch() (+33 more)

### Community 4 - "Productivity.jsx"
Cohesion: 0.07
Nodes (51): ChartCard(), ModeTimelineCard(), readoutClock, readoutTime, chartMessage(), dayLabel, machineLabel(), pickedMachineIds() (+43 more)

### Community 5 - "react"
Cohesion: 0.10
Nodes (44): prop-types, react, IconAction(), LiveClock(), StatusBadge(), CLOCK_TICK_MS, ACTION_ICONS, MACHINE_STATUS (+36 more)

### Community 6 - "react-bootstrap"
Cohesion: 0.41
Nodes (9): react-bootstrap, CUSTOMER_ROLE_ID, MANAGERS, PAGE_SIZES, ROLES, SUPERADMIN_ONLY, TYPE_FILTERS, STATUS_FILTERS (+1 more)

### Community 7 - "AddMachine.jsx"
Cohesion: 0.15
Nodes (25): AddMachine(), byName(), Field(), loadBrands(), loadControllers(), loadCustomers(), loadModels(), placeholder() (+17 more)

### Community 8 - "AddBranch.jsx"
Cohesion: 0.16
Nodes (22): Save branch (add / edit form), BRANCH_STATUS, AddBranch(), labelClass(), branchSchema, COLOR_PICKER_FALLBACK, INITIAL_VALUES, optional() (+14 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "dateTime.js"
Cohesion: 0.12
Nodes (39): ChartDateFilter(), clamp(), DateCalendar(), DatePicker(), dayLabel, keyToDay(), monthGrid(), monthName (+31 more)

### Community 11 - "TimePicker.jsx"
Cohesion: 0.12
Nodes (22): assignRef(), PickerField(), POPPER_CONFIG, centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel() (+14 more)

### Community 12 - "StateFormModal.jsx"
Cohesion: 0.19
Nodes (16): country-region-data, ALL_COUNTRIES, byName, findLibraryCountry(), getLibraryStateNames(), fromStateKey(), INITIAL_VALUES, keepStatesOf() (+8 more)

### Community 13 - "pages.jsx"
Cohesion: 0.11
Nodes (17): About, AddCustomer, AddPart, AddProductionSchedule, BreakSetup, ClienteleList, CustomerList, CustomerView (+9 more)

### Community 14 - "ESLint Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 15 - "AddProductionSchedule.jsx"
Cohesion: 0.15
Nodes (18): react-hook-form, EMPTY_LISTS, ITEM_SELECTS, EMPTY_ITEM, idText(), INITIAL_VALUES, itemSchema, MAX_ITEMS (+10 more)

### Community 16 - "AddCustomer.jsx"
Cohesion: 0.21
Nodes (14): On page load, Save user (add / edit form), ALL_MACHINE_ROLES, AddCustomer(), getCustomerSchema(), isFieldRequired(), FIELD_HELP, getBranches() (+6 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+8 more)

### Community 18 - "Login.jsx"
Cohesion: 0.05
Nodes (58): 0010. Organization levels on one tabbed page, a route per tab, Alternatives considered, Consequences, Context, Decision, 0012. Monitoring: Productivity and Machine Health on one tabbed page, Alternatives considered, Consequences (+50 more)

### Community 19 - "Customers / Users list"
Cohesion: 0.08
Nodes (26): API calls on this page, App shell (session, logout, theme), Change theme, Decisions, On page load, Shared components used, State & storage, UI states (+18 more)

### Community 20 - "0001. Single-page app with React 19 and Vite"
Cohesion: 0.33
Nodes (5): 0001. Single-page app with React 19 and Vite, Alternatives considered, Consequences, Context, Decision

### Community 21 - "AddPart.jsx"
Cohesion: 0.11
Nodes (30): byName(), checkDrawing, DrawingUpload(), MachinePicker(), summary(), DRAWING_RULES, EMPTY_PROCESS, EMPTY_SUB_PROGRAM (+22 more)

### Community 22 - "app.js"
Cohesion: 0.19
Nodes (23): On page load, On page load, ROLE_LABELS, USER_STATUS, OrgUserProvider(), ACCOUNT_KIND, ACCOUNT_PAGES, isAccountOfKind() (+15 more)

### Community 23 - "machines.js"
Cohesion: 0.11
Nodes (18): 0007. Recharts for charts, plain SVG for the Gantt, Alternatives considered, Consequences, Context, Decision, clockMinutes, clockWithSeconds, ModeGanttChart() (+10 more)

### Community 24 - "useAuth"
Cohesion: 0.29
Nodes (13): Decision, STORAGE_KEYS, machineMonitorPath(), useAuth(), MachineBrowser(), matchesSearch(), MachineList(), MachineViewToggle() (+5 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "userCountryService.js"
Cohesion: 0.22
Nodes (9): API calls on this page, Countries, Decisions, Delete user country, On page load, Save user country (add / edit form), Shared components used, State & storage (+1 more)

### Community 27 - "shiftService.js"
Cohesion: 0.18
Nodes (15): API calls on this page, Decisions, Delete shift, On page load, Save shift (add / edit form), Shared components used, Shifts, State & storage (+7 more)

### Community 28 - "LicenceKeyGenerator.jsx"
Cohesion: 0.06
Nodes (47): API calls on this page, Decisions, Delete licence key, Generate licence keys, Licence keys, On page load, Save licence key (add / edit form), Save licence keys (add / edit form) (+39 more)

### Community 29 - "package.json"
Cohesion: 0.09
Nodes (22): name, private, type, version, bootstrap, bootstrap-icons, eslint, @eslint/js (+14 more)

### Community 30 - "Seven Logo Asset"
Cohesion: 0.67
Nodes (4): 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents)

### Community 31 - "AuthProvider.jsx"
Cohesion: 0.09
Nodes (26): 0004. Axios client with the HttpOnly session cookie, Alternatives considered, Consequences, Context, Decision, Click Log out, API calls on this page, Decisions (+18 more)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "ControllerFormModal.jsx"
Cohesion: 0.29
Nodes (10): Save controller (add / edit form), controllerSchema, INITIAL_VALUES, MAX_LENGTH, toControllerPayload(), toFormValues(), ControllerFormModal(), FIELD_HELP (+2 more)

### Community 34 - "toast.js"
Cohesion: 0.21
Nodes (14): TOAST_DEFAULTS, byBrandThenName(), byName(), ControllerList(), matchesSearch(), ControllerList, deleteController(), dismiss() (+6 more)

### Community 35 - "CityFormModal.jsx"
Cohesion: 0.32
Nodes (10): Save user city (add / edit form), citySchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCityPayload(), toFormValues(), CityFormModal(), recordShape (+2 more)

### Community 36 - "toast"
Cohesion: 0.35
Nodes (8): INITIAL_VALUES, MAX_LENGTH, REASON_STATUS, reasonSchema, toFormValues(), toReasonPayload(), ReasonFormModal(), FIELD_HELP

### Community 37 - "useTableSort"
Cohesion: 0.15
Nodes (23): On page load, ARIA_SORT, compareValues(), isBlank(), SORT_DIR, useTableSort(), byName(), LineList() (+15 more)

### Community 38 - "react-router-dom"
Cohesion: 0.18
Nodes (11): react-router-dom, ACCOUNT_CENTER_PATHS, MONITOR_REFRESH_MS, MONITORING_PATHS, MONITORING_TABS, ORGANIZATION_PATHS, ORGANIZATION_TABS, ROUTES (+3 more)

### Community 39 - "AddPart"
Cohesion: 0.17
Nodes (19): Add / edit part, API calls on this page, Decisions, Save part (add / edit form), Shared components used, State & storage, UI states, Upload part drawing (+11 more)

### Community 40 - "customerForm.js"
Cohesion: 0.18
Nodes (17): THEMES, getCountryName(), getStateName(), FILTER_NAMES, FILTER_OPTIONS, INITIAL_VALUES, nullIfBlank(), REQUIRED_FIELDS (+9 more)

### Community 41 - "Production schedules"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete production schedule, On page load, Production schedules, Shared components used, State & storage, UI states

### Community 42 - "ProtectedRoute"
Cohesion: 0.07
Nodes (37): About, Decisions, State & storage, UI states, Decisions, Home, State & storage, UI states (+29 more)

### Community 43 - "Cities"
Cohesion: 0.25
Nodes (8): API calls on this page, Cities, Decisions, Delete user city, On page load, Shared components used, State & storage, UI states

### Community 44 - "HolidayFormModal.jsx"
Cohesion: 0.21
Nodes (15): Save holiday (add / edit form), HOLIDAY_TYPES, holidaySchema, INITIAL_VALUES, MAX_LENGTH, toFormValues(), toHolidayPayload(), HolidayFormModal() (+7 more)

### Community 46 - "Downtime / idle reasons"
Cohesion: 0.13
Nodes (25): API calls on this page, Decisions, Delete downtime reason, Delete idle reason, Downtime / idle reasons, On page load, Save downtime reason (add / edit form), Save idle reason (add / edit form) (+17 more)

### Community 47 - "ModelFormModal.jsx"
Cohesion: 0.32
Nodes (9): ControllerOptions(), groupByBrand(), INITIAL_VALUES, modelSchema, NAME_MAX_LENGTH, toFormValues(), toModelPayload(), ModelFormModal() (+1 more)

### Community 48 - "apiClient.js"
Cohesion: 0.20
Nodes (10): axios, apiClient, pendingGets, unauthorizedListeners, createUserCountry(), unwrap(), unwrapList(), createUserState() (+2 more)

### Community 49 - "catalogService.js"
Cohesion: 0.18
Nodes (18): On page load, On page load, API calls on this page, Decisions, Delete model, Machine models, On page load, Save model (add / edit form) (+10 more)

### Community 50 - "Parts"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete part, On page load, Parts, Shared components used, State & storage, UI states

### Community 51 - "ShopFormModal.jsx"
Cohesion: 0.42
Nodes (7): INITIAL_VALUES, NAME_MAX_LENGTH, shopSchema, toFormValues(), toShopPayload(), recordShape, ShopFormModal()

### Community 52 - "clienteleService.js"
Cohesion: 0.36
Nodes (9): On page load, Save clientele (add / edit form), On page load, createClientele(), getClienteleById(), getClienteles(), unwrap(), unwrapList() (+1 more)

### Community 53 - "ClienteleFormModal.jsx"
Cohesion: 0.17
Nodes (23): COUNTRIES, DEFAULT_COUNTRY, DEFAULT_TIME_ZONE, ENABLED_COUNTRIES, getCountryCode(), getDialCode(), getStateCode(), getStates() (+15 more)

### Community 54 - "Monitoring › Machines"
Cohesion: 0.20
Nodes (10): API calls on this page, Decisions, Monitoring › Machines, On page load, Open productivity / health, Rules & edge cases, Shared components used, State & storage (+2 more)

### Community 55 - "CountryFormModal.jsx"
Cohesion: 0.28
Nodes (10): MultiSelectPicker(), summary(), toGroups(), countrySchema, INITIAL_VALUES, toCountryPayloads(), CountryFormModal(), NOUN (+2 more)

### Community 56 - "UserGuide.jsx"
Cohesion: 0.17
Nodes (19): NAV_SECTIONS, navLinks(), NUMBERED_STEPS, OpenLink(), SectionCard(), SECTIONS, SetupStep(), textOf() (+11 more)

### Community 57 - "userSupervisorService.js"
Cohesion: 0.19
Nodes (14): API calls on this page, Decisions, Delete user supervisor, On page load, Save user supervisor (add / edit form), Shared components used, State & storage, Supervisors (+6 more)

### Community 58 - "LineFormModal.jsx"
Cohesion: 0.19
Nodes (14): API calls on this page, Decisions, Delete user line, Lines, On page load, Save user line (add / edit form), Shared components used, State & storage (+6 more)

### Community 59 - "userCellService.js"
Cohesion: 0.60
Nodes (5): Save user cell (add / edit form), createUserCell(), unwrap(), unwrapList(), updateUserCell()

### Community 60 - "CellFormModal.jsx"
Cohesion: 0.32
Nodes (9): customerLabel(), OrgCustomerField(), cellSchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCellPayload(), toFormValues(), CellFormModal() (+1 more)

### Community 61 - "userStateService.js"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete user state, Save user state (add / edit form), Shared components used, State & storage, States, UI states

### Community 62 - "Machine health"
Cohesion: 0.16
Nodes (11): 0013. Monitoring starts with a machine list; All Machines is set-up only, Alternatives considered, Consequences, Context, API calls on this page, Decisions, Live updates, Machine health (+3 more)

### Community 63 - "LineFormModal.jsx"
Cohesion: 0.42
Nodes (7): INITIAL_VALUES, lineSchema, NAME_MAX_LENGTH, toFormValues(), toLinePayload(), LineFormModal(), recordShape

### Community 64 - "SupervisorFormModal.jsx"
Cohesion: 0.42
Nodes (7): INITIAL_VALUES, NAME_MAX_LENGTH, supervisorSchema, toFormValues(), toSupervisorPayload(), recordShape, SupervisorFormModal()

### Community 65 - "Locations"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete user location, Locations, On page load, Shared components used, State & storage, UI states

### Community 66 - "0008. Folder structure by page and by concern"
Cohesion: 0.33
Nodes (5): 0008. Folder structure by page and by concern, Alternatives considered, Consequences, Context, Decision

### Community 67 - "User guide"
Cohesion: 0.25
Nodes (8): Decisions, On page load, Rules & edge cases, Sections, Shared components used, State & storage, UI states, User guide

### Community 68 - "BreakFormModal.jsx"
Cohesion: 0.23
Nodes (12): ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, SHIFT_STATUS, SHIFT_TYPES, WEEKDAYS, breakSchema, INITIAL_VALUES, MAX_LENGTH (+4 more)

### Community 69 - "0006. React-Bootstrap with SCSS design tokens"
Cohesion: 0.33
Nodes (5): 0006. React-Bootstrap with SCSS design tokens, Alternatives considered, Consequences, Context, Decision

### Community 70 - "ShiftFormModal.jsx"
Cohesion: 0.28
Nodes (13): clock(), EMPTY_BREAK_ROW, INITIAL_VALUES, MAX_BREAKS, MAX_LENGTH, offset(), shiftSchema(), toFormValues() (+5 more)

### Community 71 - "Client documentation"
Cohesion: 0.50
Nodes (4): Client documentation, How to use Postman, How to view the API docs in Chrome (Swagger UI), How to view the page flow docs

### Community 72 - "withQuery"
Cohesion: 0.27
Nodes (16): Decision, On page load, sharedGet(), withQuery(), getMachineTimeByDay(), unwrap(), getCycleCounts(), getFinishCycles() (+8 more)

### Community 73 - "breakService.js"
Cohesion: 0.19
Nodes (14): API calls on this page, Breaks, Decisions, Delete break, On page load, Save break (add / edit form), Shared components used, State & storage (+6 more)

### Community 74 - "All machines"
Cohesion: 0.22
Nodes (9): All machines, API calls on this page, Decisions, Delete machine, Edit machine, On page load, Shared components used, State & storage (+1 more)

### Community 75 - "LocationFormModal.jsx"
Cohesion: 0.31
Nodes (10): zod, INITIAL_VALUES, locationSchema, NAME_MAX_LENGTH, toFormValues(), toLocationPayload(), LocationFormModal(), recordShape (+2 more)

### Community 76 - "Loader"
Cohesion: 0.20
Nodes (13): Loader(), ACCOUNT_CENTER_TABS, AccountCenterPage(), isTabActive(), byName(), CellList(), matchesSearch(), ShiftSetup() (+5 more)

### Community 77 - "ShiftCard.jsx"
Cohesion: 0.35
Nodes (11): itemMinutes(), ScheduleJobFields(), Clock(), minutesBetween(), ShiftCard(), toMinutes(), typeLabel(), clockToMinutes() (+3 more)

### Community 78 - "AddProductionSchedule"
Cohesion: 0.33
Nodes (10): Save production schedule (add / edit form), AddProductionSchedule(), byLabel(), userLabel(), createProductionSchedule(), getProductionScheduleById(), getProductionSchedules(), unwrap() (+2 more)

### Community 79 - "Holidays / week off"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete holiday, Holidays / week off, On page load, Shared components used, State & storage, UI states

### Community 80 - "Shops"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete user shop, Shared components used, Shops, State & storage, UI states

### Community 81 - "0014. Business Setup renamed Account Center; old Account Center item removed"
Cohesion: 0.40
Nodes (5): 0014. Business Setup renamed Account Center; old Account Center item removed, Alternatives considered, Consequences, Context, Decision

### Community 82 - "useLoad"
Cohesion: 0.27
Nodes (10): API calls on this page, Change the Machine Modes period, Decisions, Live updates, On page load, Productivity, Shared components used, State & storage (+2 more)

### Community 83 - "Branches"
Cohesion: 0.22
Nodes (9): API calls on this page, Branches, Decisions, Delete branch, On page load, Save branch (add / edit form), Shared components used, State & storage (+1 more)

### Community 84 - "0002. React Router with one route table and role guards"
Cohesion: 0.20
Nodes (9): 0002. React Router with one route table and role guards, Alternatives considered, Consequences, Context, Decision, Coming soon (unbuilt sidebar links), Decisions, On page load (+1 more)

### Community 85 - "StateList.jsx"
Cohesion: 0.39
Nodes (8): On page load, byName(), matchesSearch(), StateList(), OrgStateList, getUserCountries(), deleteUserState(), getUserStates()

### Community 86 - "Controllers"
Cohesion: 0.29
Nodes (7): API calls on this page, Controllers, Decisions, Delete controller, Shared components used, State & storage, UI states

### Community 87 - "Add / edit branch"
Cohesion: 0.29
Nodes (7): Add / edit branch, API calls on this page, Decisions, On page load, Shared components used, State & storage, UI states

### Community 88 - "Clientele"
Cohesion: 0.29
Nodes (7): API calls on this page, Clientele, Decisions, Delete clientele, Shared components used, State & storage, UI states

### Community 89 - "0005. Forms with react-hook-form and zod"
Cohesion: 0.33
Nodes (5): 0005. Forms with react-hook-form and zod, Alternatives considered, Consequences, Context, Decision

### Community 90 - "machineService.js"
Cohesion: 0.52
Nodes (6): Save machine (add / edit form), createMachine(), getMachineById(), unwrap(), unwrapList(), updateMachine()

### Community 91 - "0009. Page-wise flow documentation in docs/pages"
Cohesion: 0.33
Nodes (5): 0009. Page-wise flow documentation in docs/pages, Alternatives considered, Consequences, Context, Decision

### Community 92 - "ModelList.jsx"
Cohesion: 0.48
Nodes (6): byBrandControllerName(), compareText(), matchesSearch(), ModelList(), ModelList, deleteModel()

### Community 93 - "0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page"
Cohesion: 0.40
Nodes (5): 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page, Alternatives considered, Consequences, Context, Decision

### Community 94 - "validators.js"
Cohesion: 0.43
Nodes (6): fileRule(), isBlank(), matches(), minLength(), PASSWORD_MIN_LENGTH, required()

### Community 95 - "Add / edit customer or user"
Cohesion: 0.33
Nodes (6): Add / edit customer or user, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 96 - "Add / edit machine"
Cohesion: 0.33
Nodes (6): Add / edit machine, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 97 - "userLocationService.js"
Cohesion: 0.60
Nodes (5): Save user location (add / edit form), createUserLocation(), unwrap(), unwrapList(), updateUserLocation()

### Community 98 - "userShopService.js"
Cohesion: 0.60
Nodes (5): Save user shop (add / edit form), createUserShop(), unwrap(), unwrapList(), updateUserShop()

### Community 99 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 100 - "ProductionScheduleList.jsx"
Cohesion: 0.60
Nodes (5): matchesSearch(), ProductionScheduleList(), scheduleDates(), ProductionScheduleList, deleteProductionSchedule()

### Community 101 - "0003. Server state via service modules and useLoad, Context only for the session"
Cohesion: 0.40
Nodes (4): 0003. Server state via service modules and useLoad, Context only for the session, Alternatives considered, Consequences, Context

### Community 102 - "HealthSensorPicker.jsx"
Cohesion: 0.50
Nodes (4): MACHINE_HEALTH_SENSORS, ALL_IDS, HealthSensorPicker(), summary()

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **10 isolated node(s):** `bootstrap`, `@types/react`, `@types/react-dom`, `eslint`, `sass` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 369 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProtectedRoute()` connect `ProtectedRoute` to `Customers / Users list`, `useAuth`, `userCountryService.js`, `shiftService.js`, `LicenceKeyGenerator.jsx`, `react-router-dom`, `AddPart`, `Production schedules`, `Cities`, `Downtime / idle reasons`, `catalogService.js`, `Parts`, `Monitoring › Machines`, `userSupervisorService.js`, `LineFormModal.jsx`, `userStateService.js`, `Machine health`, `Locations`, `User guide`, `breakService.js`, `All machines`, `Loader`, `Holidays / week off`, `Shops`, `useLoad`, `Branches`, `0002. React Router with one route table and role guards`, `Controllers`, `Add / edit branch`, `Clientele`, `Add / edit customer or user`, `Add / edit machine`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `useAuth()` (e.g. with `State & storage` and `State & storage`) actually correct?**
  _`useAuth()` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `MachineHealth.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08048780487804878 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `MachineHealth.jsx`, `BarLineChart.jsx`, `ConfirmModal`, `Productivity.jsx`, `react-bootstrap`, `AddMachine.jsx`, `AddBranch.jsx`, `dateTime.js`, `TimePicker.jsx`, `StateFormModal.jsx`, `pages.jsx`, `AddProductionSchedule.jsx`, `AddCustomer.jsx`, `Login.jsx`, `AddPart.jsx`, `app.js`, `machines.js`, `useAuth`, `LicenceKeyGenerator.jsx`, `package.json`, `AuthProvider.jsx`, `ControllerFormModal.jsx`, `toast.js`, `CityFormModal.jsx`, `toast`, `useTableSort`, `react-router-dom`, `ProtectedRoute`, `HolidayFormModal.jsx`, `ModelFormModal.jsx`, `apiClient.js`, `ShopFormModal.jsx`, `ClienteleFormModal.jsx`, `CountryFormModal.jsx`, `UserGuide.jsx`, `CellFormModal.jsx`, `LineFormModal.jsx`, `SupervisorFormModal.jsx`, `BreakFormModal.jsx`, `ShiftFormModal.jsx`, `LocationFormModal.jsx`, `Loader`, `ShiftCard.jsx`, `StateList.jsx`, `ModelList.jsx`, `ProductionScheduleList.jsx`, `FieldLabel`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Should `BarLineChart.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11586538461538462 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._