# Graph Report - 7th-sense-client  (2026-10-21)

## Corpus Check
- 241 files · ~163,250 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 1274 nodes · 5053 edges · 55 communities (54 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 89 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `af07d4e8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- BreakFormModal.jsx
- MachineHealth.jsx
- MachineHealth.jsx
- customerForm.js
- ModelFormModal.jsx
- react
- Parts & Machine Picker
- AddMachine.jsx
- AddBranch.jsx
- Project Docs & Conventions
- LicenceKeySetup.jsx
- userCellService.js
- ShiftFormModal.jsx
- AddProductionSchedule.jsx
- ESLint Dev Dependencies
- userSupervisorService.js
- CustomerList.jsx
- Runtime Dependencies
- ClienteleFormModal.jsx
- theme.js
- ReasonFormModal.jsx
- TimePicker.jsx
- DateRangePicker.jsx
- userLineService.js
- ShiftCard.jsx
- jsconfig Aliases
- tk
- npm Scripts
- withQuery
- package.json
- Seven Logo Asset
- apiClient.js
- Login Logo Asset
- vite.config.js
- ReasonFormModal.jsx
- StateFormModal.jsx
- healthSensors.js
- validators.js
- App.jsx
- react-bootstrap
- customerService.js
- Loader
- clienteleService.js
- UserGuide.jsx
- index.js
- i18n.mjs
- MainLayout.jsx
- Topbar.jsx
- Sidebar.jsx
- sharedGet
- holidayService.js
- userLocationService.js
- userCountryService.js
- userStateService.js
- FieldLabel.jsx

## God Nodes (most connected - your core abstractions)
1. `react` - 116 edges
2. `react-i18next` - 103 edges
3. `prop-types` - 90 edges
4. `react-bootstrap` - 80 edges
5. `Loader()` - 67 edges
6. `tk()` - 67 edges
7. `withQuery()` - 64 edges
8. `sharedGet()` - 55 edges
9. `toast` - 50 edges
10. `zodResolver()` - 48 edges

## Surprising Connections (you probably didn't know these)
- `Home()` --calls--> `tk()`  [EXTRACTED]
  src/pages/Home/Home.jsx → src/i18n/tk.js
- `itemSchema` --calls--> `tk()`  [EXTRACTED]
  src/pages/ProductionSchedules/scheduleForm.js → src/i18n/tk.js
- `7thSense Theme Usage Guide` --conceptually_related_to--> `OEE (Availability / Performance / Quality)`  [INFERRED]
  THEME.md → 7thsense-ui-review.html
- `Production Schedule (Single/Multiple Day jobs)` --conceptually_related_to--> `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)`  [AMBIGUOUS]
  CLAUDE.md → 7thsense-ui-review.html
- `Form Handling Standard (React Hook Form + Zod)` --conceptually_related_to--> `CLAUDE.md Project Instructions`  [INFERRED]
  7th-sense-frontend-skills.md → CLAUDE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project convention documents (CLAUDE.md, frontend skills, THEME, README)** — claude, 7th_sense_frontend_skills, theme, readme [EXTRACTED 1.00]
- **Customer-scoped master data with role-based access** — claude_masters_customer_pattern, claude_role_based_access, claude_production_schedule, claude_licence_keys, claude_shifts_breaks [INFERRED 0.85]
- **Dark/light dual theme system** — theme_design_tokens, theme_light_theme_second_build, theme_theme_switching, 7thsense_ui_review [INFERRED 0.85]

## Communities (55 total, 1 thin omitted)

### Community 0 - "BreakFormModal.jsx"
Cohesion: 0.22
Nodes (14): SHIFT_STATUS, breakSchema, INITIAL_VALUES, MAX_LENGTH, toBreakPayload(), toFormValues(), BreakFormModal(), FIELD_HELP (+6 more)

### Community 1 - "MachineHealth.jsx"
Cohesion: 0.09
Nodes (37): ChartCard(), buildDay(), dailyRows(), dayLabel, dayLoad(), dayStates(), dayWindow(), hashSeed() (+29 more)

### Community 2 - "MachineHealth.jsx"
Cohesion: 0.11
Nodes (51): recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), LEGEND_BOTTOM_PROPS, LEGEND_PROPS, axisPropTypes, renderGrid() (+43 more)

### Community 3 - "customerForm.js"
Cohesion: 0.19
Nodes (21): getCountryName(), getStateCode(), getStateName(), AddCustomer(), FILTER_NAMES, getCustomerSchema(), INITIAL_VALUES, isFieldRequired() (+13 more)

### Community 4 - "ModelFormModal.jsx"
Cohesion: 0.14
Nodes (21): controllerSchema, INITIAL_VALUES, MAX_LENGTH, toControllerPayload(), toFormValues(), ControllerFormModal(), FIELD_HELP, ControllerOptions() (+13 more)

### Community 5 - "react"
Cohesion: 0.05
Nodes (151): prop-types, react, react-bootstrap, react-i18next, react-router-dom, ConfirmModal(), IconAction(), Loader() (+143 more)

### Community 6 - "Parts & Machine Picker"
Cohesion: 0.08
Nodes (44): AddPart(), byName(), checkDrawing, DrawingUpload(), MachinePicker(), summary(), DRAWING_RULES, EMPTY_PROCESS (+36 more)

### Community 7 - "AddMachine.jsx"
Cohesion: 0.10
Nodes (39): CONTROLLER_VERSION_TYPES, MACHINE_ACCURACIES, MACHINE_HEALTH_ALL, MACHINE_HEALTH_SENSORS, MACHINE_SYSTEM_TYPES, SECURITY_MODES, AddMachine(), byName() (+31 more)

### Community 8 - "AddBranch.jsx"
Cohesion: 0.15
Nodes (23): BRANCH_STATUS, AddBranch(), labelClass(), branchSchema, COLOR_PICKER_FALLBACK, INITIAL_VALUES, optional(), REQUIRED_FIELDS (+15 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "LicenceKeySetup.jsx"
Cohesion: 0.17
Nodes (24): tkv(), translateText(), translateErrors(), zodResolver(), DEFAULT_DURATION, DURATION_VALUES, editSchema, GENERATE_INITIAL_VALUES (+16 more)

### Community 11 - "userCellService.js"
Cohesion: 0.48
Nodes (6): createUserCell(), deleteUserCell(), getUserCells(), unwrap(), unwrapList(), updateUserCell()

### Community 12 - "ShiftFormModal.jsx"
Cohesion: 0.19
Nodes (19): clock(), EMPTY_BREAK_ROW, INITIAL_VALUES, MAX_BREAKS, MAX_LENGTH, offset(), shiftSchema(), toFormValues() (+11 more)

### Community 13 - "AddProductionSchedule.jsx"
Cohesion: 0.15
Nodes (22): AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel(), EMPTY_ITEM, idText(), INITIAL_VALUES (+14 more)

### Community 14 - "ESLint Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 15 - "userSupervisorService.js"
Cohesion: 0.48
Nodes (6): createUserSupervisor(), deleteUserSupervisor(), getUserSupervisors(), unwrap(), unwrapList(), updateUserSupervisor()

### Community 16 - "CustomerList.jsx"
Cohesion: 0.19
Nodes (16): ALL_MACHINE_ROLES, ACCOUNT_KIND, ACCOUNT_PAGES, isAccountOfKind(), FILTER_OPTIONS, customerMobile(), customerName(), CustomerList() (+8 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.11
Nodes (18): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, i18next (+10 more)

### Community 18 - "ClienteleFormModal.jsx"
Cohesion: 0.18
Nodes (22): libphonenumber-js, COUNTRIES, DEFAULT_COUNTRY, DEFAULT_TIME_ZONE, ENABLED_COUNTRIES, getCountryCode(), getDialCode(), getStates() (+14 more)

### Community 19 - "theme.js"
Cohesion: 0.16
Nodes (18): bootstrap-icons, @fontsource-variable/roboto, react-dom, @/assets/scss/theme-light.scss?inline, DEFAULT_THEME, THEME, THEMES, useTheme() (+10 more)

### Community 20 - "ReasonFormModal.jsx"
Cohesion: 0.29
Nodes (9): StatusToggle(), INITIAL_VALUES, MAX_LENGTH, REASON_STATUS, reasonSchema, toFormValues(), toReasonPayload(), ReasonFormModal() (+1 more)

### Community 21 - "TimePicker.jsx"
Cohesion: 0.12
Nodes (20): assignRef(), PickerField(), POPPER_CONFIG, centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel() (+12 more)

### Community 22 - "DateRangePicker.jsx"
Cohesion: 0.13
Nodes (39): ChartDateFilter(), calendarNames(), clamp(), DateCalendar(), DatePicker(), keyToDay(), monthGrid(), DateRangePicker() (+31 more)

### Community 23 - "userLineService.js"
Cohesion: 0.48
Nodes (6): createUserLine(), deleteUserLine(), getUserLines(), unwrap(), unwrapList(), updateUserLine()

### Community 24 - "ShiftCard.jsx"
Cohesion: 0.20
Nodes (16): react-hook-form, itemMinutes(), MAX_LENGTH, MAX_QUANTITY, FIELD_HELP, optionShape, ScheduleJobFields(), Clock() (+8 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "tk"
Cohesion: 0.17
Nodes (16): ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, HOLIDAY_TYPES, SHIFT_TYPES, WEEKDAYS, tk(), FIELD_HELP, holidaySchema (+8 more)

### Community 27 - "npm Scripts"
Cohesion: 0.25
Nodes (8): scripts, build, build:theme, dev, i18n, i18n:check, lint, preview

### Community 28 - "withQuery"
Cohesion: 0.29
Nodes (13): withQuery(), createUserCity(), deleteUserCity(), getUserCities(), unwrap(), unwrapList(), updateUserCity(), createUserShop() (+5 more)

### Community 29 - "package.json"
Cohesion: 0.15
Nodes (14): name, private, type, version, bootstrap, eslint, @eslint/js, eslint-plugin-react-hooks (+6 more)

### Community 30 - "Seven Logo Asset"
Cohesion: 0.67
Nodes (4): 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents)

### Community 31 - "apiClient.js"
Cohesion: 0.21
Nodes (8): axios, apiClient, GENERIC_ERROR, pendingGets, unauthorizedListeners, getSession(), login(), unwrap()

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 34 - "ReasonFormModal.jsx"
Cohesion: 0.24
Nodes (14): REASON_KIND, REASON_PAGES, createDowntimeReason(), deleteDowntimeReason(), getDowntimeReasons(), unwrap(), unwrapList(), updateDowntimeReason() (+6 more)

### Community 35 - "StateFormModal.jsx"
Cohesion: 0.06
Nodes (73): country-region-data, zod, MultiSelectPicker(), summary(), toGroups(), customerLabel(), OrgCustomerField(), ALL_COUNTRIES (+65 more)

### Community 36 - "healthSensors.js"
Cohesion: 0.13
Nodes (21): niceTicks(), STEP_MULTIPLES, pointsInRange(), clock, clockSeconds, dayClock, DEFAULT_RANGE, DEFAULT_RANGE_DAYS (+13 more)

### Community 37 - "validators.js"
Cohesion: 0.43
Nodes (6): fileRule(), isBlank(), matches(), minLength(), PASSWORD_MIN_LENGTH, required()

### Community 38 - "App.jsx"
Cohesion: 0.36
Nodes (7): App(), Toaster(), ICONS, ToastItem(), OrgUserProvider(), getToasts(), subscribeToasts()

### Community 39 - "react-bootstrap"
Cohesion: 0.23
Nodes (10): NAV_SECTIONS, ROUTES, Forbidden(), AppRoutes(), ComingSoon, guard(), Login, NotFound (+2 more)

### Community 40 - "customerService.js"
Cohesion: 0.43
Nodes (7): loadCustomers(), createUser(), getUsers(), saveMyTheme(), unwrap(), unwrapList(), updateUser()

### Community 41 - "Loader"
Cohesion: 0.16
Nodes (15): CLOCK_TICK_MS, Login(), redirectTarget(), CENTER, LoginBackdrop(), RINGS, LoginClock(), INITIAL_VALUES (+7 more)

### Community 42 - "clienteleService.js"
Cohesion: 0.52
Nodes (6): createClientele(), getClienteleById(), getClienteles(), unwrap(), unwrapList(), updateClientele()

### Community 43 - "UserGuide.jsx"
Cohesion: 0.14
Nodes (16): FIELD_HELP, ADD_BRANCH_STEPS, ADD_CUSTOMER_STEPS, COUNTRY_RULES, CUSTOMER_LIST_ACTIONS, FAQ, MODULE_PURPOSE, navLinks() (+8 more)

### Community 44 - "index.js"
Cohesion: 0.16
Nodes (16): i18next, DEFAULT_LANGUAGE, LANGUAGES, AuthProvider(), files, resources, stored, supported (+8 more)

### Community 45 - "i18n.mjs"
Cohesion: 0.12
Nodes (18): CHECK, CLIENT_PATTERNS, clientKeys, collect(), escapeXml(), GLOSSARY, keys, languages (+10 more)

### Community 46 - "MainLayout.jsx"
Cohesion: 0.24
Nodes (10): Footer(), AppShell(), MainLayout(), Sidebar(), BREAKPOINTS, STORAGE_KEYS, SidebarContext, SidebarProvider() (+2 more)

### Community 47 - "Topbar.jsx"
Cohesion: 0.26
Nodes (8): BrandLogo(), LOGO_MARKUP, LiveClock(), displayName(), Topbar(), env, formatClockTime(), formatLongDate()

### Community 48 - "Sidebar.jsx"
Cohesion: 0.33
Nodes (6): navLeafShape, SidebarItem(), filterNavByRole(), flattenNav(), hasActiveChild(), isPathActive()

### Community 49 - "sharedGet"
Cohesion: 0.44
Nodes (7): sharedGet(), getBrands(), getControllers(), getModels(), unwrapList(), getAssignableRoles(), unwrapList()

### Community 50 - "holidayService.js"
Cohesion: 0.48
Nodes (6): createHoliday(), deleteHoliday(), getHolidays(), unwrap(), unwrapList(), updateHoliday()

### Community 51 - "userLocationService.js"
Cohesion: 0.48
Nodes (6): createUserLocation(), deleteUserLocation(), getUserLocations(), unwrap(), unwrapList(), updateUserLocation()

### Community 52 - "userCountryService.js"
Cohesion: 0.53
Nodes (5): createUserCountry(), deleteUserCountry(), getUserCountries(), unwrap(), unwrapList()

### Community 53 - "userStateService.js"
Cohesion: 0.70
Nodes (4): createUserState(), getUserStates(), unwrap(), unwrapList()

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **10 isolated node(s):** `bootstrap`, `@types/react`, `@types/react-dom`, `eslint`, `sass` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 169 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `BreakFormModal.jsx`, `MachineHealth.jsx`, `MachineHealth.jsx`, `customerForm.js`, `ModelFormModal.jsx`, `Parts & Machine Picker`, `AddMachine.jsx`, `AddBranch.jsx`, `LicenceKeySetup.jsx`, `ShiftFormModal.jsx`, `AddProductionSchedule.jsx`, `CustomerList.jsx`, `ClienteleFormModal.jsx`, `theme.js`, `ReasonFormModal.jsx`, `TimePicker.jsx`, `DateRangePicker.jsx`, `ShiftCard.jsx`, `tk`, `package.json`, `apiClient.js`, `StateFormModal.jsx`, `healthSensors.js`, `App.jsx`, `react-bootstrap`, `Loader`, `index.js`, `MainLayout.jsx`, `Topbar.jsx`, `Sidebar.jsx`, `FieldLabel.jsx`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `MachineHealth.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09059233449477352 - nodes in this community are weakly interconnected._
- **Why does `prop-types` connect `react` to `BreakFormModal.jsx`, `MachineHealth.jsx`, `MachineHealth.jsx`, `customerForm.js`, `ModelFormModal.jsx`, `Parts & Machine Picker`, `AddMachine.jsx`, `LicenceKeySetup.jsx`, `ShiftFormModal.jsx`, `CustomerList.jsx`, `ClienteleFormModal.jsx`, `ReasonFormModal.jsx`, `TimePicker.jsx`, `DateRangePicker.jsx`, `ShiftCard.jsx`, `tk`, `package.json`, `StateFormModal.jsx`, `healthSensors.js`, `App.jsx`, `react-bootstrap`, `UserGuide.jsx`, `index.js`, `MainLayout.jsx`, `Topbar.jsx`, `Sidebar.jsx`, `FieldLabel.jsx`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Should `MachineHealth.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11490384615384615 - nodes in this community are weakly interconnected._
- **Why does `react-i18next` connect `react` to `BreakFormModal.jsx`, `MachineHealth.jsx`, `customerForm.js`, `ModelFormModal.jsx`, `Parts & Machine Picker`, `AddMachine.jsx`, `AddBranch.jsx`, `LicenceKeySetup.jsx`, `ShiftFormModal.jsx`, `AddProductionSchedule.jsx`, `CustomerList.jsx`, `ClienteleFormModal.jsx`, `ReasonFormModal.jsx`, `TimePicker.jsx`, `DateRangePicker.jsx`, `ShiftCard.jsx`, `tk`, `package.json`, `StateFormModal.jsx`, `healthSensors.js`, `App.jsx`, `react-bootstrap`, `Loader`, `UserGuide.jsx`, `index.js`, `MainLayout.jsx`, `Topbar.jsx`, `Sidebar.jsx`, `FieldLabel.jsx`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._