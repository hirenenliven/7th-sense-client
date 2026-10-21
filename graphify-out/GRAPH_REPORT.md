# Graph Report - 7th-sense-client  (2026-10-21)

## Corpus Check
- 238 files · ~129,894 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 1241 nodes · 4793 edges · 49 communities
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 88 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f307d425`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ConfirmModal
- MachineHealth.jsx
- MachineHealth.jsx
- customerForm.js
- CountryFormModal.jsx
- react
- Parts & Machine Picker
- AddMachine.jsx
- AddBranch.jsx
- Project Docs & Conventions
- LicenceKeySetup.jsx
- CellFormModal.jsx
- ShiftFormModal.jsx
- pages.jsx
- ESLint Dev Dependencies
- SupervisorFormModal.jsx
- CustomerList.jsx
- Runtime Dependencies
- ClienteleFormModal.jsx
- Login.jsx
- useAuth
- TimePicker.jsx
- DateRangePicker.jsx
- LineFormModal.jsx
- ShiftCard.jsx
- jsconfig Aliases
- LocationFormModal.jsx
- npm Scripts
- ShopFormModal.jsx
- package.json
- Seven Logo Asset
- withQuery
- Login Logo Asset
- vite.config.js
- ReasonFormModal.jsx
- StateFormModal.jsx
- healthSensors.js
- validators.js
- toast.js
- react-bootstrap
- AddCustomer.jsx
- Loader
- useTableSort
- UserGuide.jsx
- ControllerList.jsx
- ModelList.jsx
- BranchList.jsx
- CityList.jsx
- ShopList.jsx

## God Nodes (most connected - your core abstractions)
1. `react` - 116 edges
2. `prop-types` - 90 edges
3. `react-bootstrap` - 80 edges
4. `Loader()` - 67 edges
5. `withQuery()` - 64 edges
6. `useOrgUser()` - 55 edges
7. `sharedGet()` - 55 edges
8. `toast` - 50 edges
9. `useAuth()` - 49 edges
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

## Communities (49 total, 0 thin omitted)

### Community 0 - "ConfirmModal"
Cohesion: 0.13
Nodes (34): ConfirmModal(), SortableHead(), pageItems(), TablePagination(), PAGE_SIZES, BreakSetup(), matchesSearch(), byName() (+26 more)

### Community 1 - "MachineHealth.jsx"
Cohesion: 0.09
Nodes (36): ChartCard(), buildDay(), dailyRows(), dayLabel, dayLoad(), dayStates(), dayWindow(), hashSeed() (+28 more)

### Community 2 - "MachineHealth.jsx"
Cohesion: 0.11
Nodes (51): recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), LEGEND_BOTTOM_PROPS, LEGEND_PROPS, axisPropTypes, renderGrid() (+43 more)

### Community 3 - "customerForm.js"
Cohesion: 0.23
Nodes (14): getCountryCode(), getStateCode(), FILTER_NAMES, INITIAL_VALUES, nullIfBlank(), REQUIRED_FIELDS, splitName(), toApiPhone() (+6 more)

### Community 4 - "CountryFormModal.jsx"
Cohesion: 0.20
Nodes (16): zod, citySchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCityPayload(), toFormValues(), CityFormModal(), recordShape (+8 more)

### Community 5 - "react"
Cohesion: 0.12
Nodes (40): prop-types, react, IconAction(), LiveClock(), StatusBadge(), CLOCK_TICK_MS, ACTION_ICONS, MACHINE_STATUS (+32 more)

### Community 6 - "Parts & Machine Picker"
Cohesion: 0.05
Nodes (68): react-hook-form, FieldLabel(), InfoTooltip(), AddPart(), byName(), checkDrawing, DrawingUpload(), MachinePicker() (+60 more)

### Community 7 - "AddMachine.jsx"
Cohesion: 0.06
Nodes (63): CONTROLLER_VERSION_TYPES, MACHINE_ACCURACIES, MACHINE_HEALTH_ALL, MACHINE_HEALTH_SENSORS, MACHINE_SYSTEM_TYPES, SECURITY_MODES, controllerSchema, INITIAL_VALUES (+55 more)

### Community 8 - "AddBranch.jsx"
Cohesion: 0.16
Nodes (21): BRANCH_STATUS, AddBranch(), labelClass(), branchSchema, COLOR_PICKER_FALLBACK, INITIAL_VALUES, optional(), REQUIRED_FIELDS (+13 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "LicenceKeySetup.jsx"
Cohesion: 0.15
Nodes (26): DEFAULT_DURATION, DURATION_VALUES, editSchema, GENERATE_INITIAL_VALUES, generateSchema, LICENCE_DURATIONS, LICENCE_KEY_STATUS, MAX_KEYS (+18 more)

### Community 11 - "CellFormModal.jsx"
Cohesion: 0.28
Nodes (12): cellSchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCellPayload(), toFormValues(), CellFormModal(), recordShape, createUserCell() (+4 more)

### Community 12 - "ShiftFormModal.jsx"
Cohesion: 0.07
Nodes (55): ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, HOLIDAY_TYPES, SHIFT_STATUS, SHIFT_TYPES, WEEKDAYS, breakSchema, INITIAL_VALUES (+47 more)

### Community 13 - "pages.jsx"
Cohesion: 0.11
Nodes (20): matchesSearch(), ProductionScheduleList(), scheduleDates(), About, AddCustomer, AddMachine, AddPart, AddProductionSchedule (+12 more)

### Community 14 - "ESLint Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 15 - "SupervisorFormModal.jsx"
Cohesion: 0.26
Nodes (13): INITIAL_VALUES, NAME_MAX_LENGTH, supervisorSchema, toFormValues(), toSupervisorPayload(), recordShape, SupervisorFormModal(), createUserSupervisor() (+5 more)

### Community 16 - "CustomerList.jsx"
Cohesion: 0.19
Nodes (21): customerLabel(), ALL_MACHINE_ROLES, CUSTOMER_ROLE_ID, ROLE_LABELS, ROLES, THEMES, USER_STATUS, ACCOUNT_KIND (+13 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.11
Nodes (18): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, i18next (+10 more)

### Community 18 - "ClienteleFormModal.jsx"
Cohesion: 0.13
Nodes (29): libphonenumber-js, COUNTRIES, DEFAULT_COUNTRY, DEFAULT_TIME_ZONE, ENABLED_COUNTRIES, getCountryName(), getDialCode(), getStateName() (+21 more)

### Community 19 - "Login.jsx"
Cohesion: 0.06
Nodes (47): bootstrap-icons, @fontsource-variable/roboto, i18next, react-dom, react-i18next, @/assets/scss/theme-light.scss?inline, BrandLogo(), LOGO_MARKUP (+39 more)

### Community 20 - "useAuth"
Cohesion: 0.15
Nodes (21): StatusToggle(), MANAGERS, SUPERADMIN_ONLY, useAuth(), matchesSearch(), PartList(), INITIAL_VALUES, MAX_LENGTH (+13 more)

### Community 21 - "TimePicker.jsx"
Cohesion: 0.13
Nodes (20): assignRef(), PickerField(), POPPER_CONFIG, centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel() (+12 more)

### Community 22 - "DateRangePicker.jsx"
Cohesion: 0.11
Nodes (43): ChartDateFilter(), clamp(), DateCalendar(), DatePicker(), dayLabel, keyToDay(), monthGrid(), monthName (+35 more)

### Community 23 - "LineFormModal.jsx"
Cohesion: 0.26
Nodes (13): OrgCustomerField(), INITIAL_VALUES, lineSchema, NAME_MAX_LENGTH, toFormValues(), toLinePayload(), LineFormModal(), recordShape (+5 more)

### Community 24 - "ShiftCard.jsx"
Cohesion: 0.31
Nodes (12): itemMinutes(), optionShape, ScheduleJobFields(), Clock(), minutesBetween(), ShiftCard(), toMinutes(), typeLabel() (+4 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "LocationFormModal.jsx"
Cohesion: 0.42
Nodes (7): INITIAL_VALUES, locationSchema, NAME_MAX_LENGTH, toFormValues(), toLocationPayload(), LocationFormModal(), recordShape

### Community 27 - "npm Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 28 - "ShopFormModal.jsx"
Cohesion: 0.28
Nodes (12): INITIAL_VALUES, NAME_MAX_LENGTH, shopSchema, toFormValues(), toShopPayload(), recordShape, ShopFormModal(), createUserShop() (+4 more)

### Community 29 - "package.json"
Cohesion: 0.15
Nodes (14): name, private, type, version, bootstrap, eslint, @eslint/js, eslint-plugin-react-hooks (+6 more)

### Community 30 - "Seven Logo Asset"
Cohesion: 0.67
Nodes (4): 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents)

### Community 31 - "withQuery"
Cohesion: 0.13
Nodes (22): axios, apiClient, pendingGets, unauthorizedListeners, withQuery(), getSession(), login(), unwrap() (+14 more)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 34 - "ReasonFormModal.jsx"
Cohesion: 0.26
Nodes (13): REASON_KIND, createDowntimeReason(), deleteDowntimeReason(), getDowntimeReasons(), unwrap(), unwrapList(), updateDowntimeReason(), createIdleReason() (+5 more)

### Community 35 - "StateFormModal.jsx"
Cohesion: 0.13
Nodes (23): country-region-data, MultiSelectPicker(), summary(), toGroups(), ALL_COUNTRIES, byName, findLibraryCountry(), getLibraryStateNames() (+15 more)

### Community 36 - "healthSensors.js"
Cohesion: 0.13
Nodes (21): niceTicks(), STEP_MULTIPLES, pointsInRange(), clock, clockSeconds, dayClock, DEFAULT_RANGE, DEFAULT_RANGE_DAYS (+13 more)

### Community 37 - "validators.js"
Cohesion: 0.53
Nodes (5): isBlank(), matches(), minLength(), PASSWORD_MIN_LENGTH, required()

### Community 38 - "toast.js"
Cohesion: 0.15
Nodes (18): App(), Toaster(), ICONS, ToastItem(), TOAST_DEFAULTS, AuthContext, AuthProvider(), OrgUserProvider() (+10 more)

### Community 39 - "react-bootstrap"
Cohesion: 0.20
Nodes (12): react-bootstrap, react-router-dom, NAV_SECTIONS, ROUTES, Forbidden(), AppRoutes(), ComingSoon, guard() (+4 more)

### Community 40 - "AddCustomer.jsx"
Cohesion: 0.27
Nodes (16): AddCustomer(), getCustomerSchema(), isFieldRequired(), savedLogoPath(), sharedGet(), createUser(), getCurrentUser(), getUserById() (+8 more)

### Community 41 - "Loader"
Cohesion: 0.20
Nodes (15): Loader(), Login(), redirectTarget(), CENTER, LoginBackdrop(), RINGS, INITIAL_VALUES, loginSchema (+7 more)

### Community 42 - "useTableSort"
Cohesion: 0.19
Nodes (15): ARIA_SORT, compareValues(), isBlank(), SORT_DIR, useTableSort(), ClienteleList(), matchesSearch(), byName() (+7 more)

### Community 43 - "UserGuide.jsx"
Cohesion: 0.14
Nodes (16): FIELD_HELP, ADD_BRANCH_STEPS, ADD_CUSTOMER_STEPS, COUNTRY_RULES, CUSTOMER_LIST_ACTIONS, FAQ, MODULE_PURPOSE, navLinks() (+8 more)

### Community 44 - "ControllerList.jsx"
Cohesion: 0.52
Nodes (6): byBrandThenName(), byName(), ControllerList(), matchesSearch(), ControllerList, deleteController()

### Community 45 - "ModelList.jsx"
Cohesion: 0.48
Nodes (6): byBrandControllerName(), compareText(), matchesSearch(), ModelList(), ModelList, deleteModel()

### Community 46 - "BranchList.jsx"
Cohesion: 0.53
Nodes (5): toFormValues(), BranchList(), matchesSearch(), BranchList, deleteBranch()

### Community 47 - "CityList.jsx"
Cohesion: 0.53
Nodes (5): byName(), CityList(), matchesSearch(), OrgCityList, deleteUserCity()

### Community 48 - "ShopList.jsx"
Cohesion: 0.53
Nodes (5): byName(), matchesSearch(), ShopList(), OrgShopList, deleteUserShop()

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **10 isolated node(s):** `bootstrap`, `@types/react`, `@types/react-dom`, `eslint`, `sass` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 161 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ConfirmModal`, `MachineHealth.jsx`, `MachineHealth.jsx`, `CountryFormModal.jsx`, `Parts & Machine Picker`, `AddMachine.jsx`, `AddBranch.jsx`, `LicenceKeySetup.jsx`, `CellFormModal.jsx`, `ShiftFormModal.jsx`, `pages.jsx`, `SupervisorFormModal.jsx`, `CustomerList.jsx`, `ClienteleFormModal.jsx`, `Login.jsx`, `useAuth`, `TimePicker.jsx`, `DateRangePicker.jsx`, `LineFormModal.jsx`, `ShiftCard.jsx`, `LocationFormModal.jsx`, `ShopFormModal.jsx`, `package.json`, `withQuery`, `StateFormModal.jsx`, `healthSensors.js`, `toast.js`, `react-bootstrap`, `AddCustomer.jsx`, `Loader`, `useTableSort`, `ControllerList.jsx`, `ModelList.jsx`, `BranchList.jsx`, `CityList.jsx`, `ShopList.jsx`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ConfirmModal` be split into smaller, more focused modules?**
  _Cohesion score 0.13472706155632985 - nodes in this community are weakly interconnected._
- **Why does `prop-types` connect `react` to `ConfirmModal`, `MachineHealth.jsx`, `MachineHealth.jsx`, `CountryFormModal.jsx`, `Parts & Machine Picker`, `AddMachine.jsx`, `LicenceKeySetup.jsx`, `CellFormModal.jsx`, `ShiftFormModal.jsx`, `SupervisorFormModal.jsx`, `CustomerList.jsx`, `ClienteleFormModal.jsx`, `Login.jsx`, `useAuth`, `TimePicker.jsx`, `DateRangePicker.jsx`, `LineFormModal.jsx`, `ShiftCard.jsx`, `LocationFormModal.jsx`, `ShopFormModal.jsx`, `package.json`, `StateFormModal.jsx`, `healthSensors.js`, `toast.js`, `react-bootstrap`, `AddCustomer.jsx`, `useTableSort`, `UserGuide.jsx`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Should `MachineHealth.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09390243902439024 - nodes in this community are weakly interconnected._
- **Why does `react-bootstrap` connect `react-bootstrap` to `ConfirmModal`, `MachineHealth.jsx`, `CountryFormModal.jsx`, `react`, `Parts & Machine Picker`, `AddMachine.jsx`, `AddBranch.jsx`, `LicenceKeySetup.jsx`, `CellFormModal.jsx`, `ShiftFormModal.jsx`, `pages.jsx`, `SupervisorFormModal.jsx`, `CustomerList.jsx`, `ClienteleFormModal.jsx`, `Login.jsx`, `useAuth`, `TimePicker.jsx`, `LineFormModal.jsx`, `ShiftCard.jsx`, `LocationFormModal.jsx`, `ShopFormModal.jsx`, `package.json`, `StateFormModal.jsx`, `healthSensors.js`, `toast.js`, `AddCustomer.jsx`, `Loader`, `useTableSort`, `UserGuide.jsx`, `ControllerList.jsx`, `ModelList.jsx`, `BranchList.jsx`, `CityList.jsx`, `ShopList.jsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._