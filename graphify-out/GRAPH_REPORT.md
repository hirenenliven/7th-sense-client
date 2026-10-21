# Graph Report - 7th-sense-client  (2026-10-21)

## Corpus Check
- 233 files · ~128,840 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 1230 nodes · 4763 edges · 39 communities
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 88 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0aee03c1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react-bootstrap
- MachineHealth.jsx
- MachineHealth.jsx
- AddCustomer.jsx
- CountryFormModal.jsx
- react
- Parts & Machine Picker
- AddMachine.jsx
- AddBranch.jsx
- Project Docs & Conventions
- Date Picker
- CellFormModal.jsx
- ShiftFormModal.jsx
- Production Schedule Form
- ESLint Dev Dependencies
- SupervisorFormModal.jsx
- CustomerList.jsx
- Runtime Dependencies
- ClienteleFormModal.jsx
- Login.jsx
- CityFormModal.jsx
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
- apiClient.js
- Login Logo Asset
- vite.config.js
- ReasonFormModal.jsx
- StateFormModal.jsx
- withQuery
- validators.js
- customerService.js

## God Nodes (most connected - your core abstractions)
1. `react` - 116 edges
2. `prop-types` - 90 edges
3. `react-bootstrap` - 80 edges
4. `Loader()` - 65 edges
5. `withQuery()` - 64 edges
6. `sharedGet()` - 55 edges
7. `useOrgUser()` - 55 edges
8. `toast` - 50 edges
9. `useAuth()` - 47 edges
10. `ConfirmModal()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `loadCustomers()` --calls--> `getUsers()`  [EXTRACTED]
  src/pages/Machines/AddMachine.jsx → src/services/customerService.js
- `7thSense Theme Usage Guide` --conceptually_related_to--> `OEE (Availability / Performance / Quality)`  [INFERRED]
  THEME.md → 7thsense-ui-review.html
- `Production Schedule (Single/Multiple Day jobs)` --conceptually_related_to--> `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)`  [AMBIGUOUS]
  CLAUDE.md → 7thsense-ui-review.html
- `Form Handling Standard (React Hook Form + Zod)` --conceptually_related_to--> `CLAUDE.md Project Instructions`  [INFERRED]
  7th-sense-frontend-skills.md → CLAUDE.md
- `ReasonFormModal()` --calls--> `FieldLabel()`  [EXTRACTED]
  src/pages/Reasons/ReasonFormModal.jsx → src/components/common/FieldLabel.jsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project convention documents (CLAUDE.md, frontend skills, THEME, README)** — claude, 7th_sense_frontend_skills, theme, readme [EXTRACTED 1.00]
- **Customer-scoped master data with role-based access** — claude_masters_customer_pattern, claude_role_based_access, claude_production_schedule, claude_licence_keys, claude_shifts_breaks [INFERRED 0.85]
- **Dark/light dual theme system** — theme_design_tokens, theme_light_theme_second_build, theme_theme_switching, 7thsense_ui_review [INFERRED 0.85]

## Communities (39 total, 0 thin omitted)

### Community 0 - "react-bootstrap"
Cohesion: 0.05
Nodes (137): react-bootstrap, react-router-dom, ConfirmModal(), Loader(), ARIA_SORT, SortableHead(), pageItems(), TablePagination() (+129 more)

### Community 1 - "MachineHealth.jsx"
Cohesion: 0.07
Nodes (57): ChartCard(), niceTicks(), STEP_MULTIPLES, buildDay(), dayLabel, dayLoad(), dayStates(), dayWindow() (+49 more)

### Community 2 - "MachineHealth.jsx"
Cohesion: 0.11
Nodes (51): recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), LEGEND_BOTTOM_PROPS, LEGEND_PROPS, axisPropTypes, renderGrid() (+43 more)

### Community 3 - "AddCustomer.jsx"
Cohesion: 0.13
Nodes (30): DEFAULT_THEME, COUNTRIES, DEFAULT_COUNTRY, DEFAULT_TIME_ZONE, ENABLED_COUNTRIES, getCountryName(), getDialCode(), getStateName() (+22 more)

### Community 4 - "CountryFormModal.jsx"
Cohesion: 0.22
Nodes (13): MultiSelectPicker(), summary(), toGroups(), countrySchema, INITIAL_VALUES, toCountryPayloads(), CountryFormModal(), NOUN (+5 more)

### Community 5 - "react"
Cohesion: 0.12
Nodes (41): prop-types, react, IconAction(), LiveClock(), StatusBadge(), CLOCK_TICK_MS, ACTION_ICONS, MACHINE_STATUS (+33 more)

### Community 6 - "Parts & Machine Picker"
Cohesion: 0.06
Nodes (59): react-hook-form, FieldLabel(), InfoTooltip(), FIELD_HELP, AddPart(), byName(), checkDrawing, DrawingUpload() (+51 more)

### Community 7 - "AddMachine.jsx"
Cohesion: 0.06
Nodes (66): CONTROLLER_VERSION_TYPES, MACHINE_ACCURACIES, MACHINE_HEALTH_ALL, MACHINE_HEALTH_SENSORS, MACHINE_SYSTEM_TYPES, SECURITY_MODES, controllerSchema, INITIAL_VALUES (+58 more)

### Community 8 - "AddBranch.jsx"
Cohesion: 0.16
Nodes (22): BRANCH_STATUS, AddBranch(), labelClass(), branchSchema, COLOR_PICKER_FALLBACK, INITIAL_VALUES, optional(), REQUIRED_FIELDS (+14 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "Date Picker"
Cohesion: 0.18
Nodes (16): clamp(), DateCalendar(), dayLabel, keyToDay(), monthGrid(), monthName, MONTHS, monthTitle (+8 more)

### Community 11 - "CellFormModal.jsx"
Cohesion: 0.24
Nodes (13): customerLabel(), OrgCustomerField(), cellSchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCellPayload(), toFormValues(), CellFormModal() (+5 more)

### Community 12 - "ShiftFormModal.jsx"
Cohesion: 0.05
Nodes (72): StatusToggle(), ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, HOLIDAY_TYPES, SHIFT_STATUS, SHIFT_TYPES, WEEKDAYS, breakSchema (+64 more)

### Community 13 - "Production Schedule Form"
Cohesion: 0.15
Nodes (23): AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel(), EMPTY_ITEM, idText(), INITIAL_VALUES (+15 more)

### Community 14 - "ESLint Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 15 - "SupervisorFormModal.jsx"
Cohesion: 0.23
Nodes (12): zod, INITIAL_VALUES, loginSchema, INITIAL_VALUES, NAME_MAX_LENGTH, supervisorSchema, toFormValues(), toSupervisorPayload() (+4 more)

### Community 16 - "CustomerList.jsx"
Cohesion: 0.21
Nodes (14): ALL_MACHINE_ROLES, ROLE_LABELS, THEMES, USER_STATUS, ACCOUNT_KIND, FILTER_OPTIONS, customerMobile(), customerName() (+6 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+8 more)

### Community 18 - "ClienteleFormModal.jsx"
Cohesion: 0.17
Nodes (22): getCountryCode(), getStateCode(), getStates(), isEnabledCountry(), CLIENTELE_STATUS, clienteleSchema, INITIAL_VALUES, MAX_LENGTH (+14 more)

### Community 19 - "Login.jsx"
Cohesion: 0.05
Nodes (61): App(), @/assets/scss/theme-light.scss?inline, BrandLogo(), LOGO_MARKUP, Toaster(), ICONS, ToastItem(), Footer() (+53 more)

### Community 20 - "CityFormModal.jsx"
Cohesion: 0.28
Nodes (12): citySchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCityPayload(), toFormValues(), CityFormModal(), recordShape, createUserCity() (+4 more)

### Community 21 - "TimePicker.jsx"
Cohesion: 0.12
Nodes (22): assignRef(), PickerField(), POPPER_CONFIG, centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel() (+14 more)

### Community 22 - "DateRangePicker.jsx"
Cohesion: 0.18
Nodes (26): ChartDateFilter(), DatePicker(), DateRangePicker(), DEFAULT_PRESETS, earlier(), later(), normalizeRange(), RangePanel() (+18 more)

### Community 23 - "LineFormModal.jsx"
Cohesion: 0.28
Nodes (12): INITIAL_VALUES, lineSchema, NAME_MAX_LENGTH, toFormValues(), toLinePayload(), LineFormModal(), recordShape, createUserLine() (+4 more)

### Community 24 - "ShiftCard.jsx"
Cohesion: 0.22
Nodes (15): itemMinutes(), MAX_LENGTH, MAX_QUANTITY, FIELD_HELP, optionShape, ScheduleJobFields(), Clock(), minutesBetween() (+7 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "LocationFormModal.jsx"
Cohesion: 0.30
Nodes (11): INITIAL_VALUES, locationSchema, NAME_MAX_LENGTH, toFormValues(), toLocationPayload(), LocationFormModal(), recordShape, createUserLocation() (+3 more)

### Community 27 - "npm Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 28 - "ShopFormModal.jsx"
Cohesion: 0.30
Nodes (11): INITIAL_VALUES, NAME_MAX_LENGTH, shopSchema, toFormValues(), toShopPayload(), recordShape, ShopFormModal(), createUserShop() (+3 more)

### Community 29 - "package.json"
Cohesion: 0.12
Nodes (18): name, private, type, version, bootstrap, bootstrap-icons, eslint, @eslint/js (+10 more)

### Community 30 - "Seven Logo Asset"
Cohesion: 0.67
Nodes (4): 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents)

### Community 31 - "apiClient.js"
Cohesion: 0.23
Nodes (7): axios, apiClient, pendingGets, unauthorizedListeners, getSession(), login(), unwrap()

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 34 - "ReasonFormModal.jsx"
Cohesion: 0.14
Nodes (22): INITIAL_VALUES, MAX_LENGTH, REASON_STATUS, reasonSchema, toFormValues(), toReasonPayload(), ReasonFormModal(), FIELD_HELP (+14 more)

### Community 35 - "StateFormModal.jsx"
Cohesion: 0.16
Nodes (19): country-region-data, ALL_COUNTRIES, byName, findLibraryCountry(), getLibraryStateNames(), fromStateKey(), INITIAL_VALUES, keepStatesOf() (+11 more)

### Community 36 - "withQuery"
Cohesion: 0.54
Nodes (7): withQuery(), createUserSupervisor(), deleteUserSupervisor(), getUserSupervisors(), unwrap(), unwrapList(), updateUserSupervisor()

### Community 37 - "validators.js"
Cohesion: 0.43
Nodes (6): fileRule(), isBlank(), matches(), minLength(), PASSWORD_MIN_LENGTH, required()

### Community 40 - "customerService.js"
Cohesion: 0.46
Nodes (7): createUser(), getCurrentUser(), getUserById(), saveMyTheme(), unwrap(), unwrapList(), updateUser()

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **10 isolated node(s):** `bootstrap`, `eslint`, `sass`, `@types/react`, `@types/react-dom` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 154 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `react-bootstrap`, `MachineHealth.jsx`, `MachineHealth.jsx`, `AddCustomer.jsx`, `CountryFormModal.jsx`, `Parts & Machine Picker`, `AddMachine.jsx`, `AddBranch.jsx`, `Date Picker`, `CellFormModal.jsx`, `ShiftFormModal.jsx`, `Production Schedule Form`, `SupervisorFormModal.jsx`, `CustomerList.jsx`, `ClienteleFormModal.jsx`, `Login.jsx`, `CityFormModal.jsx`, `TimePicker.jsx`, `DateRangePicker.jsx`, `LineFormModal.jsx`, `ShiftCard.jsx`, `LocationFormModal.jsx`, `ShopFormModal.jsx`, `package.json`, `apiClient.js`, `ReasonFormModal.jsx`, `StateFormModal.jsx`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **What connects `bootstrap`, `eslint`, `sass` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react-bootstrap` be split into smaller, more focused modules?**
  _Cohesion score 0.05348063523947021 - nodes in this community are weakly interconnected._
- **Why does `prop-types` connect `react` to `react-bootstrap`, `MachineHealth.jsx`, `MachineHealth.jsx`, `AddCustomer.jsx`, `CountryFormModal.jsx`, `Parts & Machine Picker`, `AddMachine.jsx`, `Date Picker`, `CellFormModal.jsx`, `ShiftFormModal.jsx`, `SupervisorFormModal.jsx`, `CustomerList.jsx`, `ClienteleFormModal.jsx`, `Login.jsx`, `CityFormModal.jsx`, `TimePicker.jsx`, `DateRangePicker.jsx`, `LineFormModal.jsx`, `ShiftCard.jsx`, `LocationFormModal.jsx`, `ShopFormModal.jsx`, `package.json`, `ReasonFormModal.jsx`, `StateFormModal.jsx`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Should `MachineHealth.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06573426573426573 - nodes in this community are weakly interconnected._
- **Why does `react-bootstrap` connect `react-bootstrap` to `MachineHealth.jsx`, `AddCustomer.jsx`, `CountryFormModal.jsx`, `react`, `Parts & Machine Picker`, `AddMachine.jsx`, `AddBranch.jsx`, `CellFormModal.jsx`, `ShiftFormModal.jsx`, `Production Schedule Form`, `SupervisorFormModal.jsx`, `CustomerList.jsx`, `ClienteleFormModal.jsx`, `Login.jsx`, `CityFormModal.jsx`, `TimePicker.jsx`, `LineFormModal.jsx`, `ShiftCard.jsx`, `LocationFormModal.jsx`, `ShopFormModal.jsx`, `package.json`, `ReasonFormModal.jsx`, `StateFormModal.jsx`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._