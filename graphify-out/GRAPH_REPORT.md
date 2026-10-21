# Graph Report - 7th-sense-client  (2026-10-21)

## Corpus Check
- 233 files · ~128,840 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 1230 nodes · 4775 edges · 33 communities
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 88 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4cc05463`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react-bootstrap
- MachineHealth.jsx
- MachineHealth.jsx
- AddCustomer.jsx
- pages.jsx
- react
- Parts & Machine Picker
- AddMachine.jsx
- AddBranch.jsx
- Project Docs & Conventions
- Date Picker
- healthSampleData.js
- ShiftFormModal.jsx
- Production Schedule Form
- ESLint Dev Dependencies
- UserGuide.jsx
- CustomerList.jsx
- Runtime Dependencies
- ClienteleFormModal.jsx
- Login.jsx
- ReasonFormModal.jsx
- TimePicker.jsx
- DateRangePicker.jsx
- ShiftCard.jsx
- jsconfig Aliases
- npm Scripts
- package.json
- Seven Logo Asset
- Login Logo Asset
- vite.config.js
- withQuery
- StateFormModal.jsx
- CustomerView.jsx

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
- `7thSense Theme Usage Guide` --conceptually_related_to--> `OEE (Availability / Performance / Quality)`  [INFERRED]
  THEME.md → 7thsense-ui-review.html
- `Production Schedule (Single/Multiple Day jobs)` --conceptually_related_to--> `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)`  [AMBIGUOUS]
  CLAUDE.md → 7thsense-ui-review.html
- `Form Handling Standard (React Hook Form + Zod)` --conceptually_related_to--> `CLAUDE.md Project Instructions`  [INFERRED]
  7th-sense-frontend-skills.md → CLAUDE.md
- `MachineHealth()` --calls--> `AreaGrowthChart()`  [EXTRACTED]
  src/pages/MachineHealth/MachineHealth.jsx → src/components/charts/AreaGrowthChart.jsx
- `MachineHealth()` --calls--> `BarLineChart()`  [EXTRACTED]
  src/pages/MachineHealth/MachineHealth.jsx → src/components/charts/BarLineChart.jsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project convention documents (CLAUDE.md, frontend skills, THEME, README)** — claude, 7th_sense_frontend_skills, theme, readme [EXTRACTED 1.00]
- **Customer-scoped master data with role-based access** — claude_masters_customer_pattern, claude_role_based_access, claude_production_schedule, claude_licence_keys, claude_shifts_breaks [INFERRED 0.85]
- **Dark/light dual theme system** — theme_design_tokens, theme_light_theme_second_build, theme_theme_switching, 7thsense_ui_review [INFERRED 0.85]

## Communities (33 total, 0 thin omitted)

### Community 0 - "react-bootstrap"
Cohesion: 0.07
Nodes (108): react-bootstrap, react-router-dom, ConfirmModal(), Loader(), ARIA_SORT, SortableHead(), pageItems(), TablePagination() (+100 more)

### Community 1 - "MachineHealth.jsx"
Cohesion: 0.08
Nodes (40): ChartCard(), niceTicks(), STEP_MULTIPLES, pointsInRange(), clock, clockSeconds, dayClock, DEFAULT_RANGE (+32 more)

### Community 2 - "MachineHealth.jsx"
Cohesion: 0.11
Nodes (51): recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), LEGEND_BOTTOM_PROPS, LEGEND_PROPS, axisPropTypes, renderGrid() (+43 more)

### Community 3 - "AddCustomer.jsx"
Cohesion: 0.14
Nodes (28): libphonenumber-js, DEFAULT_THEME, COUNTRIES, DEFAULT_COUNTRY, DEFAULT_TIME_ZONE, ENABLED_COUNTRIES, getCountryCode(), getCountryName() (+20 more)

### Community 4 - "pages.jsx"
Cohesion: 0.08
Nodes (24): About, AddCustomer, AddPart, BranchList, BreakSetup, ClienteleList, ControllerList, HolidaySetup (+16 more)

### Community 5 - "react"
Cohesion: 0.12
Nodes (40): prop-types, react, IconAction(), LiveClock(), StatusBadge(), CLOCK_TICK_MS, ACTION_ICONS, MACHINE_STATUS (+32 more)

### Community 6 - "Parts & Machine Picker"
Cohesion: 0.06
Nodes (63): react-hook-form, FieldLabel(), InfoTooltip(), controllerSchema, INITIAL_VALUES, MAX_LENGTH, toControllerPayload(), toFormValues() (+55 more)

### Community 7 - "AddMachine.jsx"
Cohesion: 0.10
Nodes (39): CONTROLLER_VERSION_TYPES, MACHINE_ACCURACIES, MACHINE_HEALTH_ALL, MACHINE_HEALTH_SENSORS, MACHINE_SYSTEM_TYPES, SECURITY_MODES, AddMachine(), byName() (+31 more)

### Community 8 - "AddBranch.jsx"
Cohesion: 0.12
Nodes (27): BRANCH_STATUS, AddBranch(), labelClass(), branchSchema, COLOR_PICKER_FALLBACK, INITIAL_VALUES, optional(), REQUIRED_FIELDS (+19 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "Date Picker"
Cohesion: 0.16
Nodes (25): clamp(), DateCalendar(), dayLabel, keyToDay(), monthGrid(), monthName, MONTHS, monthTitle (+17 more)

### Community 11 - "healthSampleData.js"
Cohesion: 0.15
Nodes (20): buildDay(), dayLabel, dayLoad(), dayStates(), dayWindow(), hashSeed(), hourLabel, hourlyTemperatures() (+12 more)

### Community 12 - "ShiftFormModal.jsx"
Cohesion: 0.05
Nodes (72): StatusToggle(), ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, HOLIDAY_TYPES, SHIFT_STATUS, SHIFT_TYPES, WEEKDAYS, breakSchema (+64 more)

### Community 13 - "Production Schedule Form"
Cohesion: 0.12
Nodes (26): AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel(), EMPTY_ITEM, idText(), INITIAL_VALUES (+18 more)

### Community 14 - "ESLint Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 15 - "UserGuide.jsx"
Cohesion: 0.14
Nodes (16): FIELD_HELP, ADD_BRANCH_STEPS, ADD_CUSTOMER_STEPS, COUNTRY_RULES, CUSTOMER_LIST_ACTIONS, FAQ, MODULE_PURPOSE, navLinks() (+8 more)

### Community 16 - "CustomerList.jsx"
Cohesion: 0.30
Nodes (12): ROLE_LABELS, ROLES, USER_STATUS, ACCOUNT_KIND, ACCOUNT_PAGES, isAccountOfKind(), customerMobile(), customerName() (+4 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+8 more)

### Community 18 - "ClienteleFormModal.jsx"
Cohesion: 0.18
Nodes (22): getDialCode(), getStateName(), getStates(), isEnabledCountry(), CLIENTELE_STATUS, clienteleSchema, INITIAL_VALUES, MAX_LENGTH (+14 more)

### Community 19 - "Login.jsx"
Cohesion: 0.05
Nodes (62): App(), @/assets/scss/theme-light.scss?inline, BrandLogo(), LOGO_MARKUP, Toaster(), ICONS, ToastItem(), Footer() (+54 more)

### Community 20 - "ReasonFormModal.jsx"
Cohesion: 0.28
Nodes (10): loadCustomers(), INITIAL_VALUES, MAX_LENGTH, REASON_STATUS, reasonSchema, toFormValues(), toReasonPayload(), ReasonFormModal() (+2 more)

### Community 21 - "TimePicker.jsx"
Cohesion: 0.15
Nodes (17): centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel(), TimePicker(), EXCEPTIONS, FILTERS (+9 more)

### Community 22 - "DateRangePicker.jsx"
Cohesion: 0.17
Nodes (19): ChartDateFilter(), DatePicker(), DateRangePicker(), DEFAULT_PRESETS, earlier(), later(), normalizeRange(), RangePanel() (+11 more)

### Community 24 - "ShiftCard.jsx"
Cohesion: 0.31
Nodes (12): itemMinutes(), optionShape, ScheduleJobFields(), Clock(), minutesBetween(), ShiftCard(), toMinutes(), typeLabel() (+4 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 27 - "npm Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 29 - "package.json"
Cohesion: 0.12
Nodes (17): name, private, type, version, bootstrap, bootstrap-icons, eslint, @eslint/js (+9 more)

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
Nodes (64): axios, REASON_KIND, REASON_PAGES, apiClient, pendingGets, sharedGet(), unauthorizedListeners, withQuery() (+56 more)

### Community 35 - "StateFormModal.jsx"
Cohesion: 0.05
Nodes (75): country-region-data, zod, MultiSelectPicker(), summary(), toGroups(), customerLabel(), OrgCustomerField(), ALL_COUNTRIES (+67 more)

### Community 40 - "CustomerView.jsx"
Cohesion: 0.19
Nodes (15): ALL_MACHINE_ROLES, THEMES, FILTER_OPTIONS, CustomerView(), DetailCard(), toTime(), CustomerView, createUser() (+7 more)

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **10 isolated node(s):** `bootstrap`, `@types/react`, `@types/react-dom`, `eslint`, `sass` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 154 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `react-bootstrap`, `MachineHealth.jsx`, `MachineHealth.jsx`, `AddCustomer.jsx`, `pages.jsx`, `Parts & Machine Picker`, `AddMachine.jsx`, `AddBranch.jsx`, `Date Picker`, `ShiftFormModal.jsx`, `Production Schedule Form`, `CustomerList.jsx`, `ClienteleFormModal.jsx`, `Login.jsx`, `ReasonFormModal.jsx`, `TimePicker.jsx`, `DateRangePicker.jsx`, `ShiftCard.jsx`, `package.json`, `withQuery`, `StateFormModal.jsx`, `CustomerView.jsx`?**
  _High betweenness centrality (0.194) - this node is a cross-community bridge._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react-bootstrap` be split into smaller, more focused modules?**
  _Cohesion score 0.07252022774947557 - nodes in this community are weakly interconnected._
- **Why does `prop-types` connect `react` to `react-bootstrap`, `MachineHealth.jsx`, `MachineHealth.jsx`, `AddCustomer.jsx`, `Parts & Machine Picker`, `AddMachine.jsx`, `Date Picker`, `ShiftFormModal.jsx`, `UserGuide.jsx`, `CustomerList.jsx`, `ClienteleFormModal.jsx`, `Login.jsx`, `ReasonFormModal.jsx`, `TimePicker.jsx`, `DateRangePicker.jsx`, `ShiftCard.jsx`, `package.json`, `StateFormModal.jsx`, `CustomerView.jsx`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **Should `MachineHealth.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08325624421831637 - nodes in this community are weakly interconnected._
- **Why does `react-bootstrap` connect `react-bootstrap` to `MachineHealth.jsx`, `AddCustomer.jsx`, `react`, `Parts & Machine Picker`, `AddMachine.jsx`, `AddBranch.jsx`, `ShiftFormModal.jsx`, `Production Schedule Form`, `UserGuide.jsx`, `CustomerList.jsx`, `ClienteleFormModal.jsx`, `Login.jsx`, `ReasonFormModal.jsx`, `TimePicker.jsx`, `DateRangePicker.jsx`, `ShiftCard.jsx`, `package.json`, `StateFormModal.jsx`, `CustomerView.jsx`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._