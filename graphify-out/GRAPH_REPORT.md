# Graph Report - 7th-sense-client  (2026-11-04)

## Corpus Check
- 325 files · ~177,180 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 1873 nodes · 6258 edges · 108 communities (107 shown, 1 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 394 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ecf23772`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Login.jsx
- customerForm.js
- BarLineChart.jsx
- ProductionScheduleList.jsx
- Productivity.jsx
- react
- toast
- ShiftFormModal.jsx
- AddBranch.jsx
- Project Docs & Conventions
- dateTime.js
- TimePicker.jsx
- StateFormModal.jsx
- Machine models
- ESLint Dev Dependencies
- AddProductionSchedule.jsx
- chartTheme.js
- Runtime Dependencies
- healthSampleData.js
- AddPart
- 0001. Single-page app with React 19 and Vite
- AddCustomer.jsx
- ClienteleFormModal.jsx
- helpers.js
- SupervisorFormModal.jsx
- jsconfig Aliases
- userCountryService.js
- AddPart.jsx
- BreakFormModal.jsx
- package.json
- Seven Logo Asset
- apiClient.js
- Login Logo Asset
- pages.jsx
- app.js
- Cells
- catalogService.js
- Parts
- ProtectedRoute
- healthSensors.js
- Loader
- All machines
- DatePicker.jsx
- ShiftCard.jsx
- Clientele
- adr/README.md
- Downtime / idle reasons
- FieldLabel
- AddMachine.jsx
- Locations
- Holidays / week off
- react-bootstrap
- ModelFormModal.jsx
- Loader
- CityFormModal.jsx
- Production schedules
- UserGuide.jsx
- userSupervisorService.js
- Monitoring › Machines
- Add / edit branch
- 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page
- apiClient
- States
- App shell (session, logout, theme)
- LicenceKeyGenerator.jsx
- useLoad
- 0008. Folder structure by page and by concern
- User guide
- clienteleService.js
- 0006. React-Bootstrap with SCSS design tokens
- toast.js
- Client documentation
- sharedGet
- Breaks
- App.jsx
- Brands
- CountryFormModal.jsx
- Machine health
- shiftService.js
- HolidayFormModal.jsx
- 0017. Log in as customer in a new tab, on the tab's own API path
- 0014. Business Setup renamed Account Center; old Account Center item removed
- Customers / Users list
- userLineService.js
- Shops
- useTableSort
- customerName
- LineFormModal.jsx
- Cities
- 0005. Forms with react-hook-form and zod
- Login
- 0009. Page-wise flow documentation in docs/pages
- userCityService.js
- 0004. Axios client with the HttpOnly session cookie
- userCellService.js
- userLocationService.js
- 0015. Clientele is a Masters page, not an Account Center tab
- LocationFormModal.jsx
- userShopService.js
- ModelList.jsx
- SortableHead
- 0003. Server state via service modules and useLoad, Context only for the session
- Add / edit production schedule
- validators.js
- DrawingUpload.jsx
- CellFormModal.jsx
- ShopFormModal.jsx
- 0016. Account Center is superadmin only; Users lists company members only

## God Nodes (most connected - your core abstractions)
1. `react` - 130 edges
2. `prop-types` - 105 edges
3. `react-bootstrap` - 92 edges
4. `useAuth()` - 83 edges
5. `Loader()` - 77 edges
6. `withQuery()` - 73 edges
7. `useOrgUser()` - 66 edges
8. `sharedGet()` - 64 edges
9. `toast` - 52 edges
10. `ProtectedRoute()` - 47 edges

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

## Communities (108 total, 1 thin omitted)

### Community 0 - "Login.jsx"
Cohesion: 0.05
Nodes (63): 0010. Organization levels on one tabbed page, a route per tab, Alternatives considered, Consequences, Context, Decision, bootstrap-icons, @fontsource-variable/roboto, react-dom (+55 more)

### Community 1 - "customerForm.js"
Cohesion: 0.23
Nodes (14): getCountryCode(), getStateCode(), FILTER_NAMES, INITIAL_VALUES, nullIfBlank(), REQUIRED_FIELDS, splitName(), toApiPhone() (+6 more)

### Community 2 - "BarLineChart.jsx"
Cohesion: 0.26
Nodes (27): recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), axisPropTypes, renderGrid(), renderLegend(), renderTooltip() (+19 more)

### Community 3 - "ProductionScheduleList.jsx"
Cohesion: 0.60
Nodes (5): matchesSearch(), ProductionScheduleList(), scheduleDates(), ProductionScheduleList, deleteProductionSchedule()

### Community 4 - "Productivity.jsx"
Cohesion: 0.08
Nodes (48): ChartCard(), ModeTimelineCard(), readoutClock, readoutTime, chartMessage(), dayLabel, pickedMachineIds(), Productivity() (+40 more)

### Community 5 - "react"
Cohesion: 0.08
Nodes (56): 0013. Monitoring starts with a machine list; All Machines is set-up only, Alternatives considered, Consequences, Context, Decision, Decision, Shared components used, prop-types (+48 more)

### Community 6 - "toast"
Cohesion: 0.16
Nodes (19): ConfirmModal(), MANAGERS, BrandList(), byName(), matchesSearch(), BreakSetup(), matchesSearch(), HolidaySetup() (+11 more)

### Community 7 - "ShiftFormModal.jsx"
Cohesion: 0.20
Nodes (17): ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, SHIFT_TYPES, WEEKDAYS, clock(), EMPTY_BREAK_ROW, INITIAL_VALUES, MAX_BREAKS (+9 more)

### Community 8 - "AddBranch.jsx"
Cohesion: 0.15
Nodes (23): Save branch (add / edit form), BRANCH_STATUS, AddBranch(), labelClass(), branchSchema, COLOR_PICKER_FALLBACK, INITIAL_VALUES, optional() (+15 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "dateTime.js"
Cohesion: 0.13
Nodes (32): ChartDateFilter(), DatePicker(), DateRangePicker(), DEFAULT_PRESETS, earlier(), later(), normalizeRange(), RangePanel() (+24 more)

### Community 11 - "TimePicker.jsx"
Cohesion: 0.14
Nodes (20): assignRef(), PickerField(), POPPER_CONFIG, centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel() (+12 more)

### Community 12 - "StateFormModal.jsx"
Cohesion: 0.19
Nodes (16): country-region-data, ALL_COUNTRIES, byName, findLibraryCountry(), getLibraryStateNames(), fromStateKey(), INITIAL_VALUES, keepStatesOf() (+8 more)

### Community 13 - "Machine models"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete model, Machine models, Shared components used, State & storage, UI states

### Community 14 - "ESLint Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 15 - "AddProductionSchedule.jsx"
Cohesion: 0.14
Nodes (24): Save production schedule (add / edit form), AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel(), EMPTY_ITEM, idText() (+16 more)

### Community 16 - "chartTheme.js"
Cohesion: 0.10
Nodes (24): LEGEND_BOTTOM_PROPS, LEGEND_PROPS, AREA_OPACITY, BAND_OPACITY, GRID_PROPS, MUTED_OPACITY, SEGMENT_GAP, SERIES_COLORS (+16 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+8 more)

### Community 18 - "healthSampleData.js"
Cohesion: 0.18
Nodes (22): buildDay(), dailyRows(), dayLabel, dayLoad(), dayStates(), dayWindow(), hourLabel, hourlyTemperatures() (+14 more)

### Community 19 - "AddPart"
Cohesion: 0.16
Nodes (18): Add / edit part, API calls on this page, Decisions, Save part (add / edit form), Shared components used, State & storage, UI states, Upload part drawing (+10 more)

### Community 20 - "0001. Single-page app with React 19 and Vite"
Cohesion: 0.33
Nodes (5): 0001. Single-page app with React 19 and Vite, Alternatives considered, Consequences, Context, Decision

### Community 21 - "AddCustomer.jsx"
Cohesion: 0.19
Nodes (21): On page load, On page load, Save user (add / edit form), On page load, AddCustomer(), getCustomerSchema(), isFieldRequired(), savedLogoPath() (+13 more)

### Community 22 - "ClienteleFormModal.jsx"
Cohesion: 0.16
Nodes (24): libphonenumber-js, COUNTRIES, DEFAULT_COUNTRY, DEFAULT_TIME_ZONE, ENABLED_COUNTRIES, getCountryName(), getDialCode(), getStateName() (+16 more)

### Community 23 - "helpers.js"
Cohesion: 0.17
Nodes (18): On page load, byName(), CityList(), matchesSearch(), byName(), CountryList(), matchesSearch(), byName() (+10 more)

### Community 24 - "SupervisorFormModal.jsx"
Cohesion: 0.42
Nodes (7): INITIAL_VALUES, NAME_MAX_LENGTH, supervisorSchema, toFormValues(), toSupervisorPayload(), recordShape, SupervisorFormModal()

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "userCountryService.js"
Cohesion: 0.22
Nodes (9): API calls on this page, Countries, Decisions, Delete user country, On page load, Save user country (add / edit form), Shared components used, State & storage (+1 more)

### Community 27 - "AddPart.jsx"
Cohesion: 0.14
Nodes (26): react-hook-form, AddPart(), byName(), MachinePicker(), summary(), EMPTY_PROCESS, EMPTY_SUB_PROGRAM, INITIAL_VALUES (+18 more)

### Community 28 - "BreakFormModal.jsx"
Cohesion: 0.23
Nodes (14): Save break (add / edit form), SHIFT_STATUS, breakSchema, INITIAL_VALUES, MAX_LENGTH, toBreakPayload(), toFormValues(), BreakFormModal() (+6 more)

### Community 29 - "package.json"
Cohesion: 0.08
Nodes (25): name, private, scripts, build, build:theme, dev, lint, preview (+17 more)

### Community 30 - "Seven Logo Asset"
Cohesion: 0.67
Nodes (4): 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents)

### Community 31 - "apiClient.js"
Cohesion: 0.13
Nodes (19): ADR-0018, Decision, Decision, Click Log out, env, AuthContext, AuthProvider(), onUnauthorized() (+11 more)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "pages.jsx"
Cohesion: 0.13
Nodes (13): ORGANIZATION_TABS, About, AccountCenterPage, AddCustomer, AddPart, BrandList, ClienteleList, CustomerList (+5 more)

### Community 34 - "app.js"
Cohesion: 0.22
Nodes (15): ALL_MACHINE_ROLES, CUSTOMER_ROLE_ID, ROLE_LABELS, ROLES, USER_STATUS, ACCOUNT_KIND, ACCOUNT_PAGES, isAccountOfKind() (+7 more)

### Community 35 - "Cells"
Cohesion: 0.25
Nodes (8): API calls on this page, Cells, Decisions, Delete user cell, On page load, Shared components used, State & storage, UI states

### Community 36 - "catalogService.js"
Cohesion: 0.21
Nodes (16): Save controller (add / edit form), Save model (add / edit form), brandSchema, INITIAL_VALUES, MAX_LENGTH, toBrandPayload(), toFormValues(), BrandFormModal() (+8 more)

### Community 37 - "Parts"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete part, On page load, Parts, Shared components used, State & storage, UI states

### Community 38 - "ProtectedRoute"
Cohesion: 0.05
Nodes (48): 0002. React Router with one route table and role guards, Alternatives considered, Consequences, Context, Decision, About, Decisions, State & storage (+40 more)

### Community 39 - "healthSensors.js"
Cohesion: 0.08
Nodes (35): niceTicks(), STEP_MULTIPLES, pointsInRange(), clock, clockSeconds, dayClock, DEFAULT_RANGE, DEFAULT_RANGE_DAYS (+27 more)

### Community 40 - "Loader"
Cohesion: 0.15
Nodes (24): Loader(), pageItems(), TablePagination(), PAGE_SIZES, LicenceKeySetup(), matchesSearch(), STATUS_FILTERS, MachineBrowser() (+16 more)

### Community 41 - "All machines"
Cohesion: 0.22
Nodes (9): All machines, API calls on this page, Decisions, Delete machine, Edit machine, On page load, Shared components used, State & storage (+1 more)

### Community 42 - "DatePicker.jsx"
Cohesion: 0.21
Nodes (14): clamp(), DateCalendar(), dayLabel, keyToDay(), monthGrid(), monthName, MONTHS, monthTitle (+6 more)

### Community 43 - "ShiftCard.jsx"
Cohesion: 0.22
Nodes (15): itemMinutes(), MAX_LENGTH, MAX_QUANTITY, FIELD_HELP, optionShape, ScheduleJobFields(), Clock(), minutesBetween() (+7 more)

### Community 44 - "Clientele"
Cohesion: 0.29
Nodes (7): API calls on this page, Clientele, Decisions, Delete clientele, Shared components used, State & storage, UI states

### Community 46 - "Downtime / idle reasons"
Cohesion: 0.13
Nodes (25): API calls on this page, Decisions, Delete downtime reason, Delete idle reason, Downtime / idle reasons, On page load, Save downtime reason (add / edit form), Save idle reason (add / edit form) (+17 more)

### Community 47 - "FieldLabel"
Cohesion: 0.27
Nodes (9): FieldLabel(), InfoTooltip(), controllerSchema, INITIAL_VALUES, MAX_LENGTH, toControllerPayload(), toFormValues(), ControllerFormModal() (+1 more)

### Community 48 - "AddMachine.jsx"
Cohesion: 0.05
Nodes (66): 0007. Recharts for charts, plain SVG for the Gantt, Alternatives considered, Consequences, Context, Decision, On page load, Add / edit machine, API calls on this page (+58 more)

### Community 49 - "Locations"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete user location, Locations, On page load, Shared components used, State & storage, UI states

### Community 50 - "Holidays / week off"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete holiday, Holidays / week off, On page load, Shared components used, State & storage, UI states

### Community 51 - "react-bootstrap"
Cohesion: 0.12
Nodes (25): react-bootstrap, react-router-dom, ACCOUNT_CENTER_PATHS, ACCOUNT_CENTER_TABS, SUPERADMIN_ONLY, MONITOR_REFRESH_MS, MONITORING_MACHINE_TABS, MONITORING_PATHS (+17 more)

### Community 52 - "ModelFormModal.jsx"
Cohesion: 0.32
Nodes (9): ControllerOptions(), groupByBrand(), INITIAL_VALUES, modelSchema, NAME_MAX_LENGTH, toFormValues(), toModelPayload(), ModelFormModal() (+1 more)

### Community 53 - "Loader"
Cohesion: 0.35
Nodes (8): INITIAL_VALUES, MAX_LENGTH, REASON_STATUS, reasonSchema, toFormValues(), toReasonPayload(), ReasonFormModal(), FIELD_HELP

### Community 54 - "CityFormModal.jsx"
Cohesion: 0.42
Nodes (7): citySchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCityPayload(), toFormValues(), CityFormModal(), recordShape

### Community 55 - "Production schedules"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete production schedule, On page load, Production schedules, Shared components used, State & storage, UI states

### Community 56 - "UserGuide.jsx"
Cohesion: 0.18
Nodes (18): navLinks(), NUMBERED_STEPS, OpenLink(), SectionCard(), SECTIONS, SetupStep(), textOf(), UserGuide() (+10 more)

### Community 57 - "userSupervisorService.js"
Cohesion: 0.20
Nodes (16): API calls on this page, Decisions, Delete user supervisor, On page load, Save user supervisor (add / edit form), Shared components used, State & storage, Supervisors (+8 more)

### Community 58 - "Monitoring › Machines"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Monitoring (machine list), On page load, Open productivity / health, Rules & edge cases, State & storage, UI states

### Community 59 - "Add / edit branch"
Cohesion: 0.29
Nodes (7): Add / edit branch, API calls on this page, Decisions, On page load, Shared components used, State & storage, UI states

### Community 60 - "0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page"
Cohesion: 0.40
Nodes (5): 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page, Alternatives considered, Consequences, Context, Decision

### Community 61 - "apiClient"
Cohesion: 0.25
Nodes (7): apiClient, createUserCountry(), unwrap(), unwrapList(), createUserState(), unwrap(), unwrapList()

### Community 62 - "States"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete user state, Save user state (add / edit form), Shared components used, State & storage, States, UI states

### Community 63 - "App shell (session, logout, theme)"
Cohesion: 0.08
Nodes (24): API calls on this page, App shell (session, logout, theme), Change theme, Decisions, On page load, Shared components used, State & storage, UI states (+16 more)

### Community 64 - "LicenceKeyGenerator.jsx"
Cohesion: 0.07
Nodes (46): API calls on this page, Decisions, Delete licence key, Generate licence keys, Licence keys, On page load, Save licence key (add / edit form), Save licence keys (add / edit form) (+38 more)

### Community 65 - "useLoad"
Cohesion: 0.24
Nodes (10): API calls on this page, Change the Machine Modes period, Decisions, Live updates, On page load, Productivity, Shared components used, State & storage (+2 more)

### Community 66 - "0008. Folder structure by page and by concern"
Cohesion: 0.33
Nodes (5): 0008. Folder structure by page and by concern, Alternatives considered, Consequences, Context, Decision

### Community 67 - "User guide"
Cohesion: 0.25
Nodes (8): Decisions, On page load, Rules & edge cases, Sections, Shared components used, State & storage, UI states, User guide

### Community 68 - "clienteleService.js"
Cohesion: 0.36
Nodes (9): On page load, Save clientele (add / edit form), On page load, createClientele(), getClienteleById(), getClienteles(), unwrap(), unwrapList() (+1 more)

### Community 69 - "0006. React-Bootstrap with SCSS design tokens"
Cohesion: 0.33
Nodes (5): 0006. React-Bootstrap with SCSS design tokens, Alternatives considered, Consequences, Context, Decision

### Community 70 - "toast.js"
Cohesion: 0.36
Nodes (8): TOAST_DEFAULTS, dismiss(), emit(), listeners, remove(), setToasts(), show(), toasts

### Community 71 - "Client documentation"
Cohesion: 0.50
Nodes (4): Client documentation, How to use Postman, How to view the API docs in Chrome (Swagger UI), How to view the page flow docs

### Community 72 - "sharedGet"
Cohesion: 0.35
Nodes (11): On page load, sharedGet(), getMachineTimeByDay(), unwrap(), getCycleCounts(), getFinishCycles(), getModeTimeline(), getModeTotals() (+3 more)

### Community 73 - "Breaks"
Cohesion: 0.25
Nodes (8): API calls on this page, Breaks, Decisions, Delete break, On page load, Shared components used, State & storage, UI states

### Community 74 - "App.jsx"
Cohesion: 0.36
Nodes (7): App(), Toaster(), ICONS, ToastItem(), OrgUserProvider(), getToasts(), subscribeToasts()

### Community 75 - "Brands"
Cohesion: 0.22
Nodes (9): API calls on this page, Brands, Decisions, Delete brand, On page load, Save brand (add / edit form), Shared components used, State & storage (+1 more)

### Community 76 - "CountryFormModal.jsx"
Cohesion: 0.28
Nodes (10): MultiSelectPicker(), summary(), toGroups(), countrySchema, INITIAL_VALUES, toCountryPayloads(), CountryFormModal(), NOUN (+2 more)

### Community 77 - "Machine health"
Cohesion: 0.13
Nodes (16): 0012. Monitoring: Productivity and Machine Health on one tabbed page, Alternatives considered, Consequences, Context, Decision, 0019. Monitoring: machine list, then the machine's tabs with a back arrow, Alternatives considered, Consequences (+8 more)

### Community 78 - "shiftService.js"
Cohesion: 0.18
Nodes (15): API calls on this page, Decisions, Delete shift, On page load, Save shift (add / edit form), Shared components used, Shifts, State & storage (+7 more)

### Community 79 - "HolidayFormModal.jsx"
Cohesion: 0.19
Nodes (16): Save holiday (add / edit form), StatusToggle(), HOLIDAY_TYPES, holidaySchema, INITIAL_VALUES, MAX_LENGTH, toFormValues(), toHolidayPayload() (+8 more)

### Community 80 - "0017. Log in as customer in a new tab, on the tab's own API path"
Cohesion: 0.18
Nodes (9): 0017. Log in as customer in a new tab, on the tab's own API path, Alternatives considered, Consequences, Context, Decision, 0018. Log in as customer opens the dashboard directly (no /login-as page), Alternatives considered, Consequences (+1 more)

### Community 81 - "0014. Business Setup renamed Account Center; old Account Center item removed"
Cohesion: 0.40
Nodes (5): 0014. Business Setup renamed Account Center; old Account Center item removed, Alternatives considered, Consequences, Context, Decision

### Community 82 - "Customers / Users list"
Cohesion: 0.22
Nodes (9): API calls on this page, Customers / Users list, Decisions, Delete user, Save user (add / edit form), Shared components used, State & storage, UI states (+1 more)

### Community 83 - "userLineService.js"
Cohesion: 0.18
Nodes (15): API calls on this page, Decisions, Delete user line, Lines, On page load, Save user line (add / edit form), Shared components used, State & storage (+7 more)

### Community 84 - "Shops"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete user shop, Shared components used, Shops, State & storage, UI states

### Community 85 - "useTableSort"
Cohesion: 0.22
Nodes (14): ARIA_SORT, compareValues(), isBlank(), SORT_DIR, useTableSort(), ClienteleList(), matchesSearch(), byBrandThenName() (+6 more)

### Community 86 - "customerName"
Cohesion: 0.44
Nodes (6): customerLabel(), OrgCustomerField(), customerMobile(), customerName(), matchesSearch(), CustomerRow()

### Community 87 - "LineFormModal.jsx"
Cohesion: 0.42
Nodes (7): INITIAL_VALUES, lineSchema, NAME_MAX_LENGTH, toFormValues(), toLinePayload(), LineFormModal(), recordShape

### Community 88 - "Cities"
Cohesion: 0.25
Nodes (8): API calls on this page, Cities, Decisions, Delete user city, On page load, Shared components used, State & storage, UI states

### Community 89 - "0005. Forms with react-hook-form and zod"
Cohesion: 0.33
Nodes (5): 0005. Forms with react-hook-form and zod, Alternatives considered, Consequences, Context, Decision

### Community 90 - "Login"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Login, Shared components used, State & storage, Submit login form, UI states

### Community 91 - "0009. Page-wise flow documentation in docs/pages"
Cohesion: 0.33
Nodes (5): 0009. Page-wise flow documentation in docs/pages, Alternatives considered, Consequences, Context, Decision

### Community 92 - "userCityService.js"
Cohesion: 0.52
Nodes (6): Save user city (add / edit form), createUserCity(), getUserCities(), unwrap(), unwrapList(), updateUserCity()

### Community 93 - "0004. Axios client with the HttpOnly session cookie"
Cohesion: 0.33
Nodes (5): 0004. Axios client with the HttpOnly session cookie, Alternatives considered, Consequences, Context, Decision

### Community 94 - "userCellService.js"
Cohesion: 0.60
Nodes (5): Save user cell (add / edit form), createUserCell(), unwrap(), unwrapList(), updateUserCell()

### Community 95 - "userLocationService.js"
Cohesion: 0.60
Nodes (5): Save user location (add / edit form), createUserLocation(), unwrap(), unwrapList(), updateUserLocation()

### Community 96 - "0015. Clientele is a Masters page, not an Account Center tab"
Cohesion: 0.40
Nodes (5): 0015. Clientele is a Masters page, not an Account Center tab, Alternatives considered, Consequences, Context, Decision

### Community 97 - "LocationFormModal.jsx"
Cohesion: 0.42
Nodes (7): INITIAL_VALUES, locationSchema, NAME_MAX_LENGTH, toFormValues(), toLocationPayload(), LocationFormModal(), recordShape

### Community 98 - "userShopService.js"
Cohesion: 0.60
Nodes (5): Save user shop (add / edit form), createUserShop(), unwrap(), unwrapList(), updateUserShop()

### Community 99 - "ModelList.jsx"
Cohesion: 0.48
Nodes (6): byBrandControllerName(), compareText(), matchesSearch(), ModelList(), ModelList, deleteModel()

### Community 100 - "SortableHead"
Cohesion: 0.18
Nodes (18): On page load, SortableHead(), byName(), LineList(), matchesSearch(), byName(), LocationList(), matchesSearch() (+10 more)

### Community 101 - "0003. Server state via service modules and useLoad, Context only for the session"
Cohesion: 0.40
Nodes (4): 0003. Server state via service modules and useLoad, Context only for the session, Alternatives considered, Consequences, Context

### Community 102 - "Add / edit production schedule"
Cohesion: 0.33
Nodes (6): Add / edit production schedule, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 103 - "validators.js"
Cohesion: 0.53
Nodes (5): isBlank(), matches(), minLength(), PASSWORD_MIN_LENGTH, required()

### Community 104 - "DrawingUpload.jsx"
Cohesion: 0.50
Nodes (4): checkDrawing, DrawingUpload(), DRAWING_RULES, fileRule()

### Community 113 - "CellFormModal.jsx"
Cohesion: 0.42
Nodes (7): cellSchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCellPayload(), toFormValues(), CellFormModal(), recordShape

### Community 115 - "ShopFormModal.jsx"
Cohesion: 0.31
Nodes (10): zod, INITIAL_VALUES, NAME_MAX_LENGTH, shopSchema, toFormValues(), toShopPayload(), recordShape, ShopFormModal() (+2 more)

### Community 116 - "0016. Account Center is superadmin only; Users lists company members only"
Cohesion: 0.40
Nodes (5): 0016. Account Center is superadmin only; Users lists company members only, Alternatives considered, Consequences, Context, Decision

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **11 isolated node(s):** `bootstrap`, `@types/react`, `@types/react-dom`, `eslint`, `sass` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 392 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Login.jsx`, `BarLineChart.jsx`, `ProductionScheduleList.jsx`, `Productivity.jsx`, `toast`, `ShiftFormModal.jsx`, `AddBranch.jsx`, `dateTime.js`, `TimePicker.jsx`, `StateFormModal.jsx`, `AddProductionSchedule.jsx`, `chartTheme.js`, `AddCustomer.jsx`, `ClienteleFormModal.jsx`, `helpers.js`, `SupervisorFormModal.jsx`, `AddPart.jsx`, `BreakFormModal.jsx`, `package.json`, `apiClient.js`, `pages.jsx`, `app.js`, `catalogService.js`, `ProtectedRoute`, `healthSensors.js`, `Loader`, `DatePicker.jsx`, `ShiftCard.jsx`, `FieldLabel`, `AddMachine.jsx`, `react-bootstrap`, `ModelFormModal.jsx`, `Loader`, `CityFormModal.jsx`, `UserGuide.jsx`, `apiClient`, `LicenceKeyGenerator.jsx`, `useLoad`, `App.jsx`, `CountryFormModal.jsx`, `HolidayFormModal.jsx`, `useTableSort`, `customerName`, `LineFormModal.jsx`, `LocationFormModal.jsx`, `ModelList.jsx`, `SortableHead`, `DrawingUpload.jsx`, `CellFormModal.jsx`, `ShopFormModal.jsx`?**
  _High betweenness centrality (0.165) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `useAuth()` (e.g. with `State & storage` and `State & storage`) actually correct?**
  _`useAuth()` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Login.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05163511187607573 - nodes in this community are weakly interconnected._
- **Why does `ProtectedRoute()` connect `ProtectedRoute` to `Machine models`, `AddPart`, `userCountryService.js`, `Cells`, `Parts`, `Loader`, `All machines`, `Clientele`, `Downtime / idle reasons`, `AddMachine.jsx`, `Locations`, `Holidays / week off`, `react-bootstrap`, `Production schedules`, `userSupervisorService.js`, `Monitoring › Machines`, `Add / edit branch`, `States`, `App shell (session, logout, theme)`, `LicenceKeyGenerator.jsx`, `useLoad`, `User guide`, `Breaks`, `Brands`, `Machine health`, `shiftService.js`, `0017. Log in as customer in a new tab, on the tab's own API path`, `Customers / Users list`, `userLineService.js`, `Shops`, `Cities`, `Add / edit production schedule`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Should `Productivity.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07982583454281568 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._