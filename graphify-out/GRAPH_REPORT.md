# Graph Report - 7th-sense-client  (2026-11-03)

## Corpus Check
- 241 files · ~133,754 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 1304 nodes · 5028 edges · 67 communities
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 90 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `38de9b0b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ConfirmModal
- MachineHealth.jsx
- chartTheme.js
- AddCustomer.jsx
- Productivity.jsx
- react
- Parts & Machine Picker
- AddMachine.jsx
- AddBranch.jsx
- Project Docs & Conventions
- dateTime.js
- AddProductionSchedule.jsx
- ControllerFormModal.jsx
- LicenceKeyGenerator.jsx
- ESLint Dev Dependencies
- useTableSort
- Login.jsx
- Runtime Dependencies
- AuthProvider.jsx
- MainLayout.jsx
- healthSampleData.js
- TimePicker.jsx
- withQuery
- ModelFormModal.jsx
- Home.jsx
- jsconfig Aliases
- sharedGet
- npm Scripts
- TablePagination
- package.json
- Seven Logo Asset
- userSupervisorService.js
- Login Logo Asset
- vite.config.js
- Loader
- StateFormModal.jsx
- reasonPages.js
- AppRoutes.jsx
- apiClient.js
- react-bootstrap
- Topbar.jsx
- pages.jsx
- UserGuide.jsx
- HolidayFormModal.jsx
- userShopService.js
- MachineList.jsx
- BreakFormModal.jsx
- ShiftFormModal.jsx
- toast.js
- ReasonFormModal.jsx
- LineList.jsx
- CountryFormModal.jsx
- CellFormModal.jsx
- LineFormModal.jsx
- CityFormModal.jsx
- LocationFormModal.jsx
- ShopFormModal.jsx
- SupervisorFormModal.jsx
- customerName
- SidebarProvider.jsx
- LocationList.jsx
- productionScheduleService.js
- shiftService.js
- ProductionScheduleList.jsx
- holidayService.js
- userCellService.js
- userLocationService.js

## God Nodes (most connected - your core abstractions)
1. `react` - 120 edges
2. `prop-types` - 93 edges
3. `react-bootstrap` - 82 edges
4. `Loader()` - 71 edges
5. `withQuery()` - 71 edges
6. `sharedGet()` - 62 edges
7. `useOrgUser()` - 55 edges
8. `useAuth()` - 51 edges
9. `toast` - 50 edges
10. `ConfirmModal()` - 43 edges

## Surprising Connections (you probably didn't know these)
- `loadCustomers()` --calls--> `getUsers()`  [EXTRACTED]
  src/pages/Machines/AddMachine.jsx → src/services/customerService.js
- `7thSense Theme Usage Guide` --conceptually_related_to--> `OEE (Availability / Performance / Quality)`  [INFERRED]
  THEME.md → 7thsense-ui-review.html
- `Production Schedule (Single/Multiple Day jobs)` --conceptually_related_to--> `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)`  [AMBIGUOUS]
  CLAUDE.md → 7thsense-ui-review.html
- `Form Handling Standard (React Hook Form + Zod)` --conceptually_related_to--> `CLAUDE.md Project Instructions`  [INFERRED]
  7th-sense-frontend-skills.md → CLAUDE.md
- `App()` --calls--> `AppRoutes()`  [EXTRACTED]
  src/App.jsx → src/routes/AppRoutes.jsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project convention documents (CLAUDE.md, frontend skills, THEME, README)** — claude, 7th_sense_frontend_skills, theme, readme [EXTRACTED 1.00]
- **Customer-scoped master data with role-based access** — claude_masters_customer_pattern, claude_role_based_access, claude_production_schedule, claude_licence_keys, claude_shifts_breaks [INFERRED 0.85]
- **Dark/light dual theme system** — theme_design_tokens, theme_light_theme_second_build, theme_theme_switching, 7thsense_ui_review [INFERRED 0.85]

## Communities (67 total, 0 thin omitted)

### Community 0 - "ConfirmModal"
Cohesion: 0.20
Nodes (15): ConfirmModal(), byName(), CityList(), matchesSearch(), byName(), matchesSearch(), StateList(), matchesSearch() (+7 more)

### Community 1 - "MachineHealth.jsx"
Cohesion: 0.08
Nodes (34): niceTicks(), STEP_MULTIPLES, pointsInRange(), clock, clockSeconds, dayClock, DEFAULT_RANGE, DEFAULT_RANGE_DAYS (+26 more)

### Community 2 - "chartTheme.js"
Cohesion: 0.12
Nodes (51): recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), LEGEND_BOTTOM_PROPS, LEGEND_PROPS, axisPropTypes, renderGrid() (+43 more)

### Community 3 - "AddCustomer.jsx"
Cohesion: 0.07
Nodes (62): libphonenumber-js, DEFAULT_THEME, THEMES, COUNTRIES, DEFAULT_COUNTRY, DEFAULT_TIME_ZONE, ENABLED_COUNTRIES, getCountryCode() (+54 more)

### Community 4 - "Productivity.jsx"
Cohesion: 0.08
Nodes (48): ChartCard(), useLoad(), ModeTimelineCard(), readoutClock, readoutTime, chartMessage(), clock, CYCLE_COUNT_SERIES (+40 more)

### Community 5 - "react"
Cohesion: 0.11
Nodes (45): prop-types, react, IconAction(), LiveClock(), StatusBadge(), CLOCK_TICK_MS, ACTION_ICONS, MACHINE_STATUS (+37 more)

### Community 6 - "Parts & Machine Picker"
Cohesion: 0.10
Nodes (39): AddPart(), byName(), checkDrawing, DrawingUpload(), MachinePicker(), summary(), DRAWING_RULES, EMPTY_PROCESS (+31 more)

### Community 7 - "AddMachine.jsx"
Cohesion: 0.07
Nodes (49): clockMinutes, clockWithSeconds, ModeGanttChart(), TICK_STEPS, ticksFor(), CONTROLLER_VERSION_TYPES, MACHINE_ACCURACIES, MACHINE_HEALTH_ALL (+41 more)

### Community 8 - "AddBranch.jsx"
Cohesion: 0.12
Nodes (28): BRANCH_STATUS, AddBranch(), labelClass(), branchSchema, COLOR_PICKER_FALLBACK, INITIAL_VALUES, optional(), REQUIRED_FIELDS (+20 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "dateTime.js"
Cohesion: 0.12
Nodes (41): ChartDateFilter(), clamp(), DateCalendar(), DatePicker(), dayLabel, keyToDay(), monthGrid(), monthName (+33 more)

### Community 11 - "AddProductionSchedule.jsx"
Cohesion: 0.13
Nodes (25): FieldLabel(), InfoTooltip(), AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel(), EMPTY_ITEM (+17 more)

### Community 12 - "ControllerFormModal.jsx"
Cohesion: 0.22
Nodes (15): controllerSchema, INITIAL_VALUES, MAX_LENGTH, toControllerPayload(), toFormValues(), ControllerFormModal(), FIELD_HELP, createController() (+7 more)

### Community 13 - "LicenceKeyGenerator.jsx"
Cohesion: 0.16
Nodes (22): @hookform/resolvers, DEFAULT_DURATION, DURATION_VALUES, editSchema, GENERATE_INITIAL_VALUES, generateSchema, LICENCE_DURATIONS, LICENCE_KEY_STATUS (+14 more)

### Community 14 - "ESLint Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 15 - "useTableSort"
Cohesion: 0.18
Nodes (17): ARIA_SORT, compareValues(), isBlank(), SORT_DIR, useTableSort(), byBrandControllerName(), compareText(), matchesSearch() (+9 more)

### Community 16 - "Login.jsx"
Cohesion: 0.29
Nodes (8): Login(), redirectTarget(), CENTER, LoginBackdrop(), RINGS, INITIAL_VALUES, loginSchema, forceTheme()

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+8 more)

### Community 18 - "AuthProvider.jsx"
Cohesion: 0.23
Nodes (11): App(), Toaster(), ICONS, ToastItem(), AuthContext, AuthProvider(), OrgUserProvider(), onUnauthorized() (+3 more)

### Community 19 - "MainLayout.jsx"
Cohesion: 0.21
Nodes (12): Footer(), AppShell(), MainLayout(), Sidebar(), navLeafShape, SidebarItem(), SidebarContext, useSidebar() (+4 more)

### Community 20 - "healthSampleData.js"
Cohesion: 0.16
Nodes (24): buildDay(), dailyRows(), dayLabel, dayLoad(), dayStates(), dayWindow(), hourLabel, hourlyTemperatures() (+16 more)

### Community 21 - "TimePicker.jsx"
Cohesion: 0.12
Nodes (23): assignRef(), PickerField(), POPPER_CONFIG, centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel() (+15 more)

### Community 22 - "withQuery"
Cohesion: 0.33
Nodes (11): withQuery(), createUserCity(), getUserCities(), unwrap(), unwrapList(), updateUserCity(), createUserLine(), getUserLines() (+3 more)

### Community 23 - "ModelFormModal.jsx"
Cohesion: 0.30
Nodes (10): ControllerOptions(), groupByBrand(), INITIAL_VALUES, modelSchema, NAME_MAX_LENGTH, toFormValues(), toModelPayload(), ModelFormModal() (+2 more)

### Community 24 - "Home.jsx"
Cohesion: 0.31
Nodes (6): BrandLogo(), LOGO_MARKUP, displayName(), Topbar(), env, LANGUAGES

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "sharedGet"
Cohesion: 0.42
Nodes (9): sharedGet(), getMachineTimeByDay(), unwrap(), getCycleCounts(), getFinishCycles(), getModeTimeline(), getOee(), ids() (+1 more)

### Community 27 - "npm Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 28 - "TablePagination"
Cohesion: 0.20
Nodes (20): SortableHead(), pageItems(), TablePagination(), PAGE_SIZES, BranchList(), matchesSearch(), ClienteleList(), matchesSearch() (+12 more)

### Community 29 - "package.json"
Cohesion: 0.12
Nodes (17): name, private, type, version, axios, bootstrap, bootstrap-icons, eslint (+9 more)

### Community 30 - "Seven Logo Asset"
Cohesion: 0.67
Nodes (4): 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents)

### Community 31 - "userSupervisorService.js"
Cohesion: 0.60
Nodes (5): createUserSupervisor(), getUserSupervisors(), unwrap(), unwrapList(), updateUserSupervisor()

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 34 - "Loader"
Cohesion: 0.14
Nodes (30): Loader(), ALL_MACHINE_ROLES, CUSTOMER_ROLE_ID, MANAGERS, ROLE_LABELS, ROLES, SUPERADMIN_ONLY, USER_STATUS (+22 more)

### Community 35 - "StateFormModal.jsx"
Cohesion: 0.16
Nodes (19): country-region-data, MultiSelectPicker(), summary(), toGroups(), ALL_COUNTRIES, byName, findLibraryCountry(), getLibraryStateNames() (+11 more)

### Community 36 - "reasonPages.js"
Cohesion: 0.24
Nodes (14): REASON_KIND, REASON_PAGES, createDowntimeReason(), deleteDowntimeReason(), getDowntimeReasons(), unwrap(), unwrapList(), updateDowntimeReason() (+6 more)

### Community 37 - "AppRoutes.jsx"
Cohesion: 0.26
Nodes (8): AppRoutes(), ComingSoon, guard(), Login, NotFound, PLACEHOLDERS, PAGES, ProtectedRoute()

### Community 38 - "apiClient.js"
Cohesion: 0.16
Nodes (12): apiClient, pendingGets, unauthorizedListeners, getSession(), login(), unwrap(), createUserCountry(), unwrap() (+4 more)

### Community 39 - "react-bootstrap"
Cohesion: 0.18
Nodes (15): react-bootstrap, react-router-dom, ROUTES, Forbidden(), byName(), CellList(), matchesSearch(), byName() (+7 more)

### Community 40 - "Topbar.jsx"
Cohesion: 0.22
Nodes (13): @/assets/scss/theme-light.scss?inline, STORAGE_KEYS, THEME, useTheme(), applyTheme(), chooseTheme(), getStoredTheme(), getTheme() (+5 more)

### Community 41 - "pages.jsx"
Cohesion: 0.17
Nodes (10): About, AddPart, AddProductionSchedule, BranchList, ClienteleList, CustomerView, Home, PartList (+2 more)

### Community 42 - "UserGuide.jsx"
Cohesion: 0.13
Nodes (17): NAV_SECTIONS, FIELD_HELP, ADD_BRANCH_STEPS, ADD_CUSTOMER_STEPS, COUNTRY_RULES, CUSTOMER_LIST_ACTIONS, FAQ, MODULE_PURPOSE (+9 more)

### Community 43 - "HolidayFormModal.jsx"
Cohesion: 0.20
Nodes (14): ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, HOLIDAY_TYPES, SHIFT_STATUS, SHIFT_TYPES, WEEKDAYS, holidaySchema, INITIAL_VALUES (+6 more)

### Community 44 - "userShopService.js"
Cohesion: 0.70
Nodes (4): createUserShop(), unwrap(), unwrapList(), updateUserShop()

### Community 45 - "MachineList.jsx"
Cohesion: 0.39
Nodes (7): healthPath(), MachineList(), matchesSearch(), productivityPath(), VIEWS, MachineList, deleteMachine()

### Community 46 - "BreakFormModal.jsx"
Cohesion: 0.24
Nodes (13): breakSchema, INITIAL_VALUES, MAX_LENGTH, toBreakPayload(), toFormValues(), BreakFormModal(), FIELD_HELP, createBreak() (+5 more)

### Community 47 - "ShiftFormModal.jsx"
Cohesion: 0.26
Nodes (14): clock(), EMPTY_BREAK_ROW, INITIAL_VALUES, MAX_BREAKS, MAX_LENGTH, offset(), shiftSchema(), toFormValues() (+6 more)

### Community 48 - "toast.js"
Cohesion: 0.19
Nodes (14): TOAST_DEFAULTS, LicenceKeySetup(), matchesSearch(), STATUS_FILTERS, LicenceKeySetup, deleteLicenceKey(), dismiss(), emit() (+6 more)

### Community 49 - "ReasonFormModal.jsx"
Cohesion: 0.29
Nodes (9): StatusToggle(), INITIAL_VALUES, MAX_LENGTH, REASON_STATUS, reasonSchema, toFormValues(), toReasonPayload(), ReasonFormModal() (+1 more)

### Community 50 - "LineList.jsx"
Cohesion: 0.26
Nodes (11): byName(), LineList(), matchesSearch(), byName(), matchesSearch(), ShopList(), OrgLineList, OrgShopList (+3 more)

### Community 51 - "CountryFormModal.jsx"
Cohesion: 0.32
Nodes (9): zod, countrySchema, INITIAL_VALUES, toCountryPayloads(), CountryFormModal(), NOUN, sameName(), ownedBy() (+1 more)

### Community 52 - "CellFormModal.jsx"
Cohesion: 0.36
Nodes (8): react-hook-form, cellSchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCellPayload(), toFormValues(), CellFormModal(), recordShape

### Community 53 - "LineFormModal.jsx"
Cohesion: 0.38
Nodes (8): OrgCustomerField(), INITIAL_VALUES, lineSchema, NAME_MAX_LENGTH, toFormValues(), toLinePayload(), LineFormModal(), recordShape

### Community 54 - "CityFormModal.jsx"
Cohesion: 0.38
Nodes (8): citySchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCityPayload(), toFormValues(), CityFormModal(), recordShape, ownerOf()

### Community 55 - "LocationFormModal.jsx"
Cohesion: 0.42
Nodes (7): INITIAL_VALUES, locationSchema, NAME_MAX_LENGTH, toFormValues(), toLocationPayload(), LocationFormModal(), recordShape

### Community 56 - "ShopFormModal.jsx"
Cohesion: 0.42
Nodes (7): INITIAL_VALUES, NAME_MAX_LENGTH, shopSchema, toFormValues(), toShopPayload(), recordShape, ShopFormModal()

### Community 57 - "SupervisorFormModal.jsx"
Cohesion: 0.42
Nodes (7): INITIAL_VALUES, NAME_MAX_LENGTH, supervisorSchema, toFormValues(), toSupervisorPayload(), recordShape, SupervisorFormModal()

### Community 58 - "customerName"
Cohesion: 0.50
Nodes (5): customerLabel(), customerMobile(), customerName(), matchesSearch(), CustomerRow()

### Community 59 - "SidebarProvider.jsx"
Cohesion: 0.46
Nodes (5): BREAKPOINTS, SidebarProvider(), useMediaQuery(), readStorage(), writeStorage()

### Community 60 - "LocationList.jsx"
Cohesion: 0.48
Nodes (6): byName(), LocationList(), matchesSearch(), OrgLocationList, deleteUserLocation(), getUserLocations()

### Community 61 - "productionScheduleService.js"
Cohesion: 0.52
Nodes (6): createProductionSchedule(), getProductionScheduleById(), getProductionSchedules(), unwrap(), unwrapList(), updateProductionSchedule()

### Community 62 - "shiftService.js"
Cohesion: 0.52
Nodes (6): createShift(), getShiftById(), getShifts(), unwrap(), unwrapList(), updateShift()

### Community 63 - "ProductionScheduleList.jsx"
Cohesion: 0.60
Nodes (5): matchesSearch(), ProductionScheduleList(), scheduleDates(), ProductionScheduleList, deleteProductionSchedule()

### Community 64 - "holidayService.js"
Cohesion: 0.60
Nodes (5): createHoliday(), getHolidays(), unwrap(), unwrapList(), updateHoliday()

### Community 65 - "userCellService.js"
Cohesion: 0.70
Nodes (4): createUserCell(), unwrap(), unwrapList(), updateUserCell()

### Community 66 - "userLocationService.js"
Cohesion: 0.70
Nodes (4): createUserLocation(), unwrap(), unwrapList(), updateUserLocation()

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **10 isolated node(s):** `bootstrap`, `@types/react`, `@types/react-dom`, `eslint`, `sass` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 164 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ConfirmModal`, `MachineHealth.jsx`, `chartTheme.js`, `AddCustomer.jsx`, `Productivity.jsx`, `Parts & Machine Picker`, `AddMachine.jsx`, `AddBranch.jsx`, `dateTime.js`, `AddProductionSchedule.jsx`, `ControllerFormModal.jsx`, `LicenceKeyGenerator.jsx`, `useTableSort`, `Login.jsx`, `AuthProvider.jsx`, `MainLayout.jsx`, `TimePicker.jsx`, `ModelFormModal.jsx`, `Home.jsx`, `TablePagination`, `package.json`, `Loader`, `StateFormModal.jsx`, `AppRoutes.jsx`, `apiClient.js`, `react-bootstrap`, `Topbar.jsx`, `pages.jsx`, `HolidayFormModal.jsx`, `MachineList.jsx`, `BreakFormModal.jsx`, `ShiftFormModal.jsx`, `toast.js`, `ReasonFormModal.jsx`, `LineList.jsx`, `CountryFormModal.jsx`, `CellFormModal.jsx`, `LineFormModal.jsx`, `CityFormModal.jsx`, `LocationFormModal.jsx`, `ShopFormModal.jsx`, `SupervisorFormModal.jsx`, `customerName`, `SidebarProvider.jsx`, `LocationList.jsx`, `ProductionScheduleList.jsx`?**
  _High betweenness centrality (0.175) - this node is a cross-community bridge._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `MachineHealth.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Why does `prop-types` connect `react` to `ConfirmModal`, `MachineHealth.jsx`, `chartTheme.js`, `AddCustomer.jsx`, `Productivity.jsx`, `Parts & Machine Picker`, `AddMachine.jsx`, `dateTime.js`, `AddProductionSchedule.jsx`, `ControllerFormModal.jsx`, `LicenceKeyGenerator.jsx`, `useTableSort`, `AuthProvider.jsx`, `MainLayout.jsx`, `TimePicker.jsx`, `ModelFormModal.jsx`, `Home.jsx`, `TablePagination`, `package.json`, `Loader`, `StateFormModal.jsx`, `AppRoutes.jsx`, `react-bootstrap`, `UserGuide.jsx`, `HolidayFormModal.jsx`, `BreakFormModal.jsx`, `ShiftFormModal.jsx`, `ReasonFormModal.jsx`, `CountryFormModal.jsx`, `CellFormModal.jsx`, `LineFormModal.jsx`, `CityFormModal.jsx`, `LocationFormModal.jsx`, `ShopFormModal.jsx`, `SupervisorFormModal.jsx`, `customerName`, `SidebarProvider.jsx`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Should `chartTheme.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11586538461538462 - nodes in this community are weakly interconnected._
- **Why does `react-bootstrap` connect `react-bootstrap` to `ConfirmModal`, `MachineHealth.jsx`, `AddCustomer.jsx`, `Productivity.jsx`, `react`, `Parts & Machine Picker`, `AddMachine.jsx`, `AddBranch.jsx`, `AddProductionSchedule.jsx`, `ControllerFormModal.jsx`, `LicenceKeyGenerator.jsx`, `useTableSort`, `Login.jsx`, `AuthProvider.jsx`, `MainLayout.jsx`, `TimePicker.jsx`, `ModelFormModal.jsx`, `Home.jsx`, `TablePagination`, `package.json`, `Loader`, `StateFormModal.jsx`, `AppRoutes.jsx`, `UserGuide.jsx`, `HolidayFormModal.jsx`, `MachineList.jsx`, `BreakFormModal.jsx`, `ShiftFormModal.jsx`, `toast.js`, `ReasonFormModal.jsx`, `LineList.jsx`, `CountryFormModal.jsx`, `CellFormModal.jsx`, `LineFormModal.jsx`, `CityFormModal.jsx`, `LocationFormModal.jsx`, `ShopFormModal.jsx`, `SupervisorFormModal.jsx`, `customerName`, `LocationList.jsx`, `ProductionScheduleList.jsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._