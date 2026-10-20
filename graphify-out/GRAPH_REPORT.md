# Graph Report - 7th-sense-client  (2026-10-20)

## Corpus Check
- 214 files · ~122,628 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 1124 nodes · 4302 edges · 36 communities (35 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 75 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9463e478`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Shared Table & Modal Components
- CityFormModal.jsx
- LocationFormModal.jsx
- AddCustomer.jsx
- ShiftFormModal.jsx
- Status & Icon Widgets
- Parts & Machine Picker
- Machines & Health Sensors
- Branches
- Project Docs & Conventions
- Date Picker
- StateFormModal.jsx
- Licence Keys
- Production Schedule Form
- ESLint Dev Dependencies
- User Guide & Field Help
- BreakFormModal.jsx
- Runtime Dependencies
- HealthCharts.jsx
- Login.jsx
- HolidayFormModal.jsx
- Time Picker
- ShopFormModal.jsx
- CountryFormModal.jsx
- ShiftCard.jsx
- jsconfig Aliases
- toast.js
- npm Scripts
- package.json
- Seven Logo Asset
- LineFormModal.jsx
- Login Logo Asset
- vite.config.js
- SupervisorFormModal.jsx
- CellFormModal.jsx
- apiClient

## God Nodes (most connected - your core abstractions)
1. `react` - 105 edges
2. `react-bootstrap` - 78 edges
3. `prop-types` - 77 edges
4. `Loader()` - 61 edges
5. `withQuery()` - 60 edges
6. `useOrgUser()` - 55 edges
7. `sharedGet()` - 51 edges
8. `toast` - 48 edges
9. `useAuth()` - 43 edges
10. `ConfirmModal()` - 40 edges

## Surprising Connections (you probably didn't know these)
- `loadCustomers()` --calls--> `getUsers()`  [EXTRACTED]
  src/pages/Machines/AddMachine.jsx → src/services/customerService.js
- `7thSense Theme Usage Guide` --conceptually_related_to--> `OEE (Availability / Performance / Quality)`  [INFERRED]
  THEME.md → 7thsense-ui-review.html
- `Production Schedule (Single/Multiple Day jobs)` --conceptually_related_to--> `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)`  [AMBIGUOUS]
  CLAUDE.md → 7thsense-ui-review.html
- `Form Handling Standard (React Hook Form + Zod)` --conceptually_related_to--> `CLAUDE.md Project Instructions`  [INFERRED]
  7th-sense-frontend-skills.md → CLAUDE.md
- `MachineTimeChart` --indirect_call--> `formatHours()`  [INFERRED]
  src/pages/MachineHealth/HealthCharts.jsx → src/pages/MachineHealth/healthSensors.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project convention documents (CLAUDE.md, frontend skills, THEME, README)** — claude, 7th_sense_frontend_skills, theme, readme [EXTRACTED 1.00]
- **Customer-scoped master data with role-based access** — claude_masters_customer_pattern, claude_role_based_access, claude_production_schedule, claude_licence_keys, claude_shifts_breaks [INFERRED 0.85]
- **Dark/light dual theme system** — theme_design_tokens, theme_light_theme_second_build, theme_theme_switching, 7thsense_ui_review [INFERRED 0.85]

## Communities (36 total, 1 thin omitted)

### Community 0 - "Shared Table & Modal Components"
Cohesion: 0.05
Nodes (127): react-bootstrap, react-router-dom, ConfirmModal(), Loader(), ARIA_SORT, SortableHead(), pageItems(), TablePagination() (+119 more)

### Community 1 - "CityFormModal.jsx"
Cohesion: 0.26
Nodes (13): citySchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCityPayload(), toFormValues(), CityFormModal(), recordShape, createUserCity() (+5 more)

### Community 2 - "LocationFormModal.jsx"
Cohesion: 0.30
Nodes (11): INITIAL_VALUES, locationSchema, NAME_MAX_LENGTH, toFormValues(), toLocationPayload(), LocationFormModal(), recordShape, createUserLocation() (+3 more)

### Community 3 - "AddCustomer.jsx"
Cohesion: 0.06
Nodes (81): customerLabel(), ALL_MACHINE_ROLES, CUSTOMER_ROLE_ID, DEFAULT_THEME, ROLE_LABELS, ROLES, THEMES, USER_STATUS (+73 more)

### Community 4 - "ShiftFormModal.jsx"
Cohesion: 0.19
Nodes (19): clock(), EMPTY_BREAK_ROW, INITIAL_VALUES, MAX_BREAKS, MAX_LENGTH, offset(), shiftSchema(), toFormValues() (+11 more)

### Community 5 - "Status & Icon Widgets"
Cohesion: 0.12
Nodes (39): prop-types, react, IconAction(), LiveClock(), StatusBadge(), CLOCK_TICK_MS, ACTION_ICONS, MACHINE_STATUS (+31 more)

### Community 6 - "Parts & Machine Picker"
Cohesion: 0.10
Nodes (39): AddPart(), byName(), checkDrawing, DrawingUpload(), MachinePicker(), summary(), DRAWING_RULES, EMPTY_PROCESS (+31 more)

### Community 7 - "Machines & Health Sensors"
Cohesion: 0.05
Nodes (72): FieldLabel(), CONTROLLER_VERSION_TYPES, MACHINE_ACCURACIES, MACHINE_HEALTH_ALL, MACHINE_HEALTH_SENSORS, MACHINE_SYSTEM_TYPES, SECURITY_MODES, controllerSchema (+64 more)

### Community 8 - "Branches"
Cohesion: 0.12
Nodes (27): BRANCH_STATUS, AddBranch(), labelClass(), branchSchema, COLOR_PICKER_FALLBACK, INITIAL_VALUES, optional(), REQUIRED_FIELDS (+19 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "Date Picker"
Cohesion: 0.19
Nodes (23): clamp(), DateCalendar(), DatePicker(), dayLabel, keyToDay(), monthGrid(), monthName, MONTHS (+15 more)

### Community 11 - "StateFormModal.jsx"
Cohesion: 0.14
Nodes (22): country-region-data, MultiSelectPicker(), summary(), toGroups(), ALL_COUNTRIES, byName, findLibraryCountry(), getLibraryStateNames() (+14 more)

### Community 12 - "Licence Keys"
Cohesion: 0.15
Nodes (27): @hookform/resolvers, react-hook-form, DEFAULT_DURATION, DURATION_VALUES, editSchema, GENERATE_INITIAL_VALUES, generateSchema, LICENCE_DURATIONS (+19 more)

### Community 13 - "Production Schedule Form"
Cohesion: 0.12
Nodes (27): AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel(), EMPTY_ITEM, idText(), INITIAL_VALUES (+19 more)

### Community 14 - "ESLint Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 15 - "User Guide & Field Help"
Cohesion: 0.13
Nodes (17): InfoTooltip(), FIELD_HELP, ADD_BRANCH_STEPS, ADD_CUSTOMER_STEPS, COUNTRY_RULES, CUSTOMER_LIST_ACTIONS, FAQ, MODULE_PURPOSE (+9 more)

### Community 16 - "BreakFormModal.jsx"
Cohesion: 0.23
Nodes (13): StatusToggle(), breakSchema, INITIAL_VALUES, MAX_LENGTH, toBreakPayload(), toFormValues(), BreakFormModal(), FIELD_HELP (+5 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+8 more)

### Community 18 - "HealthCharts.jsx"
Cohesion: 0.06
Nodes (66): recharts, ChartCard(), LEGEND_PROPS, ACTIVE_DOT, ANIMATION_MS, BAR_GAP, BAR_MAX_SIZE, BAR_RADIUS (+58 more)

### Community 19 - "Login.jsx"
Cohesion: 0.07
Nodes (46): @/assets/scss/theme-light.scss?inline, BrandLogo(), LOGO_MARKUP, Footer(), AppShell(), MainLayout(), Sidebar(), navLeafShape (+38 more)

### Community 20 - "HolidayFormModal.jsx"
Cohesion: 0.20
Nodes (14): ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, HOLIDAY_TYPES, SHIFT_STATUS, SHIFT_TYPES, WEEKDAYS, holidaySchema, INITIAL_VALUES (+6 more)

### Community 21 - "Time Picker"
Cohesion: 0.12
Nodes (22): assignRef(), PickerField(), POPPER_CONFIG, centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel() (+14 more)

### Community 22 - "ShopFormModal.jsx"
Cohesion: 0.30
Nodes (11): INITIAL_VALUES, NAME_MAX_LENGTH, shopSchema, toFormValues(), toShopPayload(), recordShape, ShopFormModal(), createUserShop() (+3 more)

### Community 23 - "CountryFormModal.jsx"
Cohesion: 0.24
Nodes (12): zod, countrySchema, INITIAL_VALUES, toCountryPayloads(), CountryFormModal(), NOUN, sameName(), createUserCountry() (+4 more)

### Community 24 - "ShiftCard.jsx"
Cohesion: 0.35
Nodes (11): itemMinutes(), ScheduleJobFields(), Clock(), minutesBetween(), ShiftCard(), toMinutes(), typeLabel(), clockToMinutes() (+3 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "toast.js"
Cohesion: 0.11
Nodes (22): App(), Toaster(), ICONS, ToastItem(), TOAST_DEFAULTS, AuthContext, AuthProvider(), onUnauthorized() (+14 more)

### Community 27 - "npm Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 29 - "package.json"
Cohesion: 0.12
Nodes (18): name, private, type, version, axios, bootstrap, bootstrap-icons, eslint (+10 more)

### Community 30 - "Seven Logo Asset"
Cohesion: 0.67
Nodes (4): 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents)

### Community 31 - "LineFormModal.jsx"
Cohesion: 0.28
Nodes (12): INITIAL_VALUES, lineSchema, NAME_MAX_LENGTH, toFormValues(), toLinePayload(), LineFormModal(), recordShape, createUserLine() (+4 more)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 34 - "SupervisorFormModal.jsx"
Cohesion: 0.26
Nodes (14): INITIAL_VALUES, NAME_MAX_LENGTH, supervisorSchema, toFormValues(), toSupervisorPayload(), recordShape, SupervisorFormModal(), withQuery() (+6 more)

### Community 35 - "CellFormModal.jsx"
Cohesion: 0.28
Nodes (12): OrgCustomerField(), cellSchema, INITIAL_VALUES, NAME_MAX_LENGTH, toCellPayload(), toFormValues(), CellFormModal(), recordShape (+4 more)

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **10 isolated node(s):** `bootstrap`, `@types/react`, `@types/react-dom`, `eslint`, `sass` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 140 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Status & Icon Widgets` to `Shared Table & Modal Components`, `CityFormModal.jsx`, `LocationFormModal.jsx`, `AddCustomer.jsx`, `ShiftFormModal.jsx`, `Parts & Machine Picker`, `Machines & Health Sensors`, `Branches`, `Date Picker`, `StateFormModal.jsx`, `Licence Keys`, `Production Schedule Form`, `User Guide & Field Help`, `BreakFormModal.jsx`, `HealthCharts.jsx`, `Login.jsx`, `HolidayFormModal.jsx`, `Time Picker`, `ShopFormModal.jsx`, `CountryFormModal.jsx`, `ShiftCard.jsx`, `toast.js`, `package.json`, `LineFormModal.jsx`, `SupervisorFormModal.jsx`, `CellFormModal.jsx`, `apiClient`?**
  _High betweenness centrality (0.177) - this node is a cross-community bridge._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Shared Table & Modal Components` be split into smaller, more focused modules?**
  _Cohesion score 0.05268000920174833 - nodes in this community are weakly interconnected._
- **Why does `react-bootstrap` connect `Shared Table & Modal Components` to `CityFormModal.jsx`, `LocationFormModal.jsx`, `AddCustomer.jsx`, `ShiftFormModal.jsx`, `Status & Icon Widgets`, `Parts & Machine Picker`, `Machines & Health Sensors`, `Branches`, `StateFormModal.jsx`, `Licence Keys`, `Production Schedule Form`, `User Guide & Field Help`, `BreakFormModal.jsx`, `HealthCharts.jsx`, `Login.jsx`, `HolidayFormModal.jsx`, `Time Picker`, `ShopFormModal.jsx`, `CountryFormModal.jsx`, `ShiftCard.jsx`, `toast.js`, `package.json`, `LineFormModal.jsx`, `SupervisorFormModal.jsx`, `CellFormModal.jsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `AddCustomer.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06459078476751526 - nodes in this community are weakly interconnected._
- **Why does `prop-types` connect `Status & Icon Widgets` to `Shared Table & Modal Components`, `CityFormModal.jsx`, `LocationFormModal.jsx`, `AddCustomer.jsx`, `ShiftFormModal.jsx`, `Parts & Machine Picker`, `Machines & Health Sensors`, `Date Picker`, `StateFormModal.jsx`, `Licence Keys`, `Production Schedule Form`, `User Guide & Field Help`, `BreakFormModal.jsx`, `HealthCharts.jsx`, `Login.jsx`, `HolidayFormModal.jsx`, `Time Picker`, `ShopFormModal.jsx`, `CountryFormModal.jsx`, `ShiftCard.jsx`, `toast.js`, `package.json`, `LineFormModal.jsx`, `SupervisorFormModal.jsx`, `CellFormModal.jsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._