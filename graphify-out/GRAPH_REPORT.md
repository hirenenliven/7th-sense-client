# Graph Report - 7th-sense-client  (2026-10-20)

## Corpus Check
- 225 files · ~126,343 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 1196 nodes · 4619 edges · 40 communities (39 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 79 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a89a785a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react-bootstrap
- MachineHealth.jsx
- MachineHealth.jsx
- ModelFormModal.jsx
- ShiftFormModal.jsx
- react
- Parts & Machine Picker
- AddMachine.jsx
- AddBranch.jsx
- Project Docs & Conventions
- Date Picker
- healthSampleData.js
- Licence Keys
- Production Schedule Form
- ESLint Dev Dependencies
- UserGuide.jsx
- BreakFormModal.jsx
- Runtime Dependencies
- ClienteleFormModal.jsx
- Topbar.jsx
- HolidayFormModal.jsx
- TimePicker.jsx
- DateRangePicker.jsx
- shiftService.js
- ShiftCard.jsx
- jsconfig Aliases
- main.jsx
- npm Scripts
- remove
- package.json
- Seven Logo Asset
- FieldLabel
- Login Logo Asset
- vite.config.js
- withQuery
- StateFormModal.jsx
- Login.jsx
- theme.js
- AppRoutes.jsx
- Sidebar.jsx

## God Nodes (most connected - your core abstractions)
1. `react` - 113 edges
2. `prop-types` - 87 edges
3. `react-bootstrap` - 78 edges
4. `Loader()` - 62 edges
5. `withQuery()` - 60 edges
6. `useOrgUser()` - 55 edges
7. `sharedGet()` - 51 edges
8. `toast` - 48 edges
9. `useAuth()` - 44 edges
10. `ConfirmModal()` - 41 edges

## Surprising Connections (you probably didn't know these)
- `loadCustomers()` --calls--> `getUsers()`  [EXTRACTED]
  src/pages/Machines/AddMachine.jsx → src/services/customerService.js
- `7thSense Theme Usage Guide` --conceptually_related_to--> `OEE (Availability / Performance / Quality)`  [INFERRED]
  THEME.md → 7thsense-ui-review.html
- `Production Schedule (Single/Multiple Day jobs)` --conceptually_related_to--> `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)`  [AMBIGUOUS]
  CLAUDE.md → 7thsense-ui-review.html
- `Form Handling Standard (React Hook Form + Zod)` --conceptually_related_to--> `CLAUDE.md Project Instructions`  [INFERRED]
  7th-sense-frontend-skills.md → CLAUDE.md
- `MachineHealth()` --calls--> `AreaGrowthChart()`  [EXTRACTED]
  src/pages/MachineHealth/MachineHealth.jsx → src/components/charts/AreaGrowthChart.jsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project convention documents (CLAUDE.md, frontend skills, THEME, README)** — claude, 7th_sense_frontend_skills, theme, readme [EXTRACTED 1.00]
- **Customer-scoped master data with role-based access** — claude_masters_customer_pattern, claude_role_based_access, claude_production_schedule, claude_licence_keys, claude_shifts_breaks [INFERRED 0.85]
- **Dark/light dual theme system** — theme_design_tokens, theme_light_theme_second_build, theme_theme_switching, 7thsense_ui_review [INFERRED 0.85]

## Communities (40 total, 1 thin omitted)

### Community 0 - "react-bootstrap"
Cohesion: 0.05
Nodes (144): react-bootstrap, react-router-dom, ConfirmModal(), Loader(), ARIA_SORT, SortableHead(), pageItems(), TablePagination() (+136 more)

### Community 1 - "MachineHealth.jsx"
Cohesion: 0.08
Nodes (44): ChartCard(), niceTicks(), STEP_MULTIPLES, dailyRows(), dayStates(), pointsInRange(), runHours(), stateShare() (+36 more)

### Community 2 - "MachineHealth.jsx"
Cohesion: 0.11
Nodes (51): recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), LEGEND_BOTTOM_PROPS, LEGEND_PROPS, axisPropTypes, renderGrid() (+43 more)

### Community 3 - "ModelFormModal.jsx"
Cohesion: 0.14
Nodes (21): controllerSchema, INITIAL_VALUES, MAX_LENGTH, toControllerPayload(), toFormValues(), ControllerFormModal(), FIELD_HELP, ControllerOptions() (+13 more)

### Community 4 - "ShiftFormModal.jsx"
Cohesion: 0.20
Nodes (17): ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, SHIFT_TYPES, WEEKDAYS, clock(), EMPTY_BREAK_ROW, INITIAL_VALUES, MAX_BREAKS (+9 more)

### Community 5 - "react"
Cohesion: 0.12
Nodes (40): prop-types, react, IconAction(), LiveClock(), StatusBadge(), CLOCK_TICK_MS, ACTION_ICONS, MACHINE_STATUS (+32 more)

### Community 6 - "Parts & Machine Picker"
Cohesion: 0.10
Nodes (37): react-hook-form, AddPart(), byName(), checkDrawing, DrawingUpload(), MachinePicker(), summary(), DRAWING_RULES (+29 more)

### Community 7 - "AddMachine.jsx"
Cohesion: 0.09
Nodes (39): CONTROLLER_VERSION_TYPES, MACHINE_ACCURACIES, MACHINE_HEALTH_ALL, MACHINE_HEALTH_SENSORS, MACHINE_SYSTEM_TYPES, SECURITY_MODES, AddMachine(), byName() (+31 more)

### Community 8 - "AddBranch.jsx"
Cohesion: 0.12
Nodes (27): BRANCH_STATUS, AddBranch(), labelClass(), branchSchema, COLOR_PICKER_FALLBACK, INITIAL_VALUES, optional(), REQUIRED_FIELDS (+19 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "Date Picker"
Cohesion: 0.14
Nodes (28): clamp(), DateCalendar(), DatePicker(), dayLabel, keyToDay(), monthGrid(), monthName, MONTHS (+20 more)

### Community 11 - "healthSampleData.js"
Cohesion: 0.17
Nodes (17): buildDay(), dayLabel, dayLoad(), dayWindow(), hashSeed(), hourLabel, hourlyTemperatures(), MAX_TREND_POINTS (+9 more)

### Community 12 - "Licence Keys"
Cohesion: 0.16
Nodes (22): StatusToggle(), DEFAULT_DURATION, DURATION_VALUES, editSchema, GENERATE_INITIAL_VALUES, generateSchema, LICENCE_DURATIONS, LICENCE_KEY_STATUS (+14 more)

### Community 13 - "Production Schedule Form"
Cohesion: 0.14
Nodes (22): AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel(), EMPTY_ITEM, idText(), INITIAL_VALUES (+14 more)

### Community 14 - "ESLint Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 15 - "UserGuide.jsx"
Cohesion: 0.14
Nodes (16): FIELD_HELP, ADD_BRANCH_STEPS, ADD_CUSTOMER_STEPS, COUNTRY_RULES, CUSTOMER_LIST_ACTIONS, FAQ, MODULE_PURPOSE, navLinks() (+8 more)

### Community 16 - "BreakFormModal.jsx"
Cohesion: 0.24
Nodes (13): SHIFT_STATUS, breakSchema, INITIAL_VALUES, MAX_LENGTH, toBreakPayload(), toFormValues(), BreakFormModal(), FIELD_HELP (+5 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+8 more)

### Community 18 - "ClienteleFormModal.jsx"
Cohesion: 0.09
Nodes (45): libphonenumber-js, COUNTRIES, DEFAULT_COUNTRY, DEFAULT_TIME_ZONE, ENABLED_COUNTRIES, getCountryCode(), getCountryName(), getDialCode() (+37 more)

### Community 19 - "Topbar.jsx"
Cohesion: 0.17
Nodes (16): LOGO_MARKUP, Footer(), AppShell(), MainLayout(), Sidebar(), displayName(), Topbar(), env (+8 more)

### Community 20 - "HolidayFormModal.jsx"
Cohesion: 0.22
Nodes (14): HOLIDAY_TYPES, holidaySchema, INITIAL_VALUES, MAX_LENGTH, toFormValues(), toHolidayPayload(), HolidayFormModal(), KINDS (+6 more)

### Community 21 - "TimePicker.jsx"
Cohesion: 0.12
Nodes (22): assignRef(), PickerField(), POPPER_CONFIG, centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel() (+14 more)

### Community 22 - "DateRangePicker.jsx"
Cohesion: 0.28
Nodes (13): ChartDateFilter(), DateRangePicker(), DEFAULT_PRESETS, earlier(), later(), normalizeRange(), RangePanel(), sameRange() (+5 more)

### Community 23 - "shiftService.js"
Cohesion: 0.52
Nodes (6): createShift(), getShiftById(), getShifts(), unwrap(), unwrapList(), updateShift()

### Community 24 - "ShiftCard.jsx"
Cohesion: 0.44
Nodes (9): ScheduleJobFields(), Clock(), minutesBetween(), ShiftCard(), toMinutes(), typeLabel(), formatClock12(), formatHoursMinutes() (+1 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "main.jsx"
Cohesion: 0.25
Nodes (9): App(), Toaster(), ICONS, ToastItem(), AuthContext, AuthProvider(), onUnauthorized(), getToasts() (+1 more)

### Community 27 - "npm Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 28 - "remove"
Cohesion: 0.50
Nodes (5): dismiss(), emit(), remove(), setToasts(), show()

### Community 29 - "package.json"
Cohesion: 0.15
Nodes (14): name, private, type, version, bootstrap, eslint, @eslint/js, eslint-plugin-react-hooks (+6 more)

### Community 30 - "Seven Logo Asset"
Cohesion: 0.67
Nodes (4): 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 34 - "withQuery"
Cohesion: 0.06
Nodes (67): axios, byName(), CountryList(), matchesSearch(), byName(), matchesSearch(), StateList(), apiClient (+59 more)

### Community 35 - "StateFormModal.jsx"
Cohesion: 0.06
Nodes (73): country-region-data, zod, MultiSelectPicker(), summary(), toGroups(), customerLabel(), OrgCustomerField(), ALL_COUNTRIES (+65 more)

### Community 39 - "Login.jsx"
Cohesion: 0.27
Nodes (9): BrandLogo(), Login(), redirectTarget(), CENTER, LoginBackdrop(), RINGS, INITIAL_VALUES, loginSchema (+1 more)

### Community 40 - "theme.js"
Cohesion: 0.14
Nodes (20): bootstrap-icons, @fontsource-variable/roboto, react-dom, @/assets/scss/theme-light.scss?inline, DEFAULT_THEME, STORAGE_KEYS, THEME, useTheme() (+12 more)

### Community 41 - "AppRoutes.jsx"
Cohesion: 0.22
Nodes (9): ROUTES, Forbidden(), AppRoutes(), ComingSoon, guard(), Login, NotFound, PLACEHOLDERS (+1 more)

### Community 42 - "Sidebar.jsx"
Cohesion: 0.27
Nodes (7): navLeafShape, SidebarItem(), NAV_SECTIONS, filterNavByRole(), flattenNav(), hasActiveChild(), isPathActive()

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **10 isolated node(s):** `bootstrap`, `eslint`, `sass`, `@types/react`, `@types/react-dom` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 154 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `react-bootstrap`, `MachineHealth.jsx`, `MachineHealth.jsx`, `ModelFormModal.jsx`, `ShiftFormModal.jsx`, `Parts & Machine Picker`, `AddMachine.jsx`, `AddBranch.jsx`, `Date Picker`, `Licence Keys`, `Production Schedule Form`, `BreakFormModal.jsx`, `ClienteleFormModal.jsx`, `Topbar.jsx`, `HolidayFormModal.jsx`, `TimePicker.jsx`, `DateRangePicker.jsx`, `ShiftCard.jsx`, `main.jsx`, `package.json`, `FieldLabel`, `withQuery`, `StateFormModal.jsx`, `Login.jsx`, `theme.js`, `AppRoutes.jsx`, `Sidebar.jsx`?**
  _High betweenness centrality (0.193) - this node is a cross-community bridge._
- **What connects `bootstrap`, `eslint`, `sass` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react-bootstrap` be split into smaller, more focused modules?**
  _Cohesion score 0.05300224637241212 - nodes in this community are weakly interconnected._
- **Why does `prop-types` connect `react` to `react-bootstrap`, `MachineHealth.jsx`, `MachineHealth.jsx`, `ModelFormModal.jsx`, `ShiftFormModal.jsx`, `Parts & Machine Picker`, `AddMachine.jsx`, `Date Picker`, `Licence Keys`, `Production Schedule Form`, `UserGuide.jsx`, `BreakFormModal.jsx`, `ClienteleFormModal.jsx`, `Topbar.jsx`, `HolidayFormModal.jsx`, `TimePicker.jsx`, `DateRangePicker.jsx`, `ShiftCard.jsx`, `main.jsx`, `package.json`, `FieldLabel`, `StateFormModal.jsx`, `AppRoutes.jsx`, `Sidebar.jsx`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Should `MachineHealth.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0784313725490196 - nodes in this community are weakly interconnected._
- **Why does `react-bootstrap` connect `react-bootstrap` to `MachineHealth.jsx`, `ModelFormModal.jsx`, `ShiftFormModal.jsx`, `react`, `Parts & Machine Picker`, `AddMachine.jsx`, `AddBranch.jsx`, `Licence Keys`, `Production Schedule Form`, `UserGuide.jsx`, `BreakFormModal.jsx`, `ClienteleFormModal.jsx`, `Topbar.jsx`, `HolidayFormModal.jsx`, `TimePicker.jsx`, `ShiftCard.jsx`, `main.jsx`, `package.json`, `FieldLabel`, `StateFormModal.jsx`, `Login.jsx`, `AppRoutes.jsx`, `Sidebar.jsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._