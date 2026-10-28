# Graph Report - 7th-sense-client  (2026-10-28)

## Corpus Check
- 237 files · ~131,873 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 1272 nodes · 4935 edges · 39 communities
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 88 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f307d425`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- BreakFormModal.jsx
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
- BreakFormModal.jsx
- LicenceKeyGenerator.jsx
- ESLint Dev Dependencies
- ModelFormModal.jsx
- Login.jsx
- Runtime Dependencies
- AuthProvider.jsx
- MainLayout.jsx
- healthSampleData.js
- HolidayFormModal.jsx
- ShiftFormModal.jsx
- SidebarProvider.jsx
- AddProductionSchedule
- jsconfig Aliases
- shiftService.js
- npm Scripts
- remove
- package.json
- Seven Logo Asset
- Login Logo Asset
- vite.config.js
- StateFormModal.jsx
- withQuery
- AppRoutes.jsx
- DateRangePicker.jsx
- Topbar.jsx
- ShiftCard.jsx

## God Nodes (most connected - your core abstractions)
1. `react` - 117 edges
2. `prop-types` - 91 edges
3. `react-bootstrap` - 81 edges
4. `Loader()` - 69 edges
5. `withQuery()` - 64 edges
6. `useOrgUser()` - 55 edges
7. `sharedGet()` - 55 edges
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
- `App()` --calls--> `OrgUserProvider()`  [EXTRACTED]
  src/App.jsx → src/context/OrgUserProvider.jsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project convention documents (CLAUDE.md, frontend skills, THEME, README)** — claude, 7th_sense_frontend_skills, theme, readme [EXTRACTED 1.00]
- **Customer-scoped master data with role-based access** — claude_masters_customer_pattern, claude_role_based_access, claude_production_schedule, claude_licence_keys, claude_shifts_breaks [INFERRED 0.85]
- **Dark/light dual theme system** — theme_design_tokens, theme_light_theme_second_build, theme_theme_switching, 7thsense_ui_review [INFERRED 0.85]

## Communities (39 total, 0 thin omitted)

### Community 0 - "BreakFormModal.jsx"
Cohesion: 0.05
Nodes (145): react-bootstrap, react-router-dom, ConfirmModal(), Loader(), ARIA_SORT, SortableHead(), pageItems(), TablePagination() (+137 more)

### Community 1 - "MachineHealth.jsx"
Cohesion: 0.09
Nodes (37): ChartCard(), niceTicks(), STEP_MULTIPLES, hourlyTemperatures(), pointsInRange(), readingAt(), sensorDay(), clock (+29 more)

### Community 2 - "chartTheme.js"
Cohesion: 0.12
Nodes (51): recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), LEGEND_BOTTOM_PROPS, LEGEND_PROPS, axisPropTypes, renderGrid() (+43 more)

### Community 3 - "AddCustomer.jsx"
Cohesion: 0.08
Nodes (60): THEMES, COUNTRIES, DEFAULT_COUNTRY, DEFAULT_TIME_ZONE, ENABLED_COUNTRIES, getCountryCode(), getCountryName(), getDialCode() (+52 more)

### Community 4 - "Productivity.jsx"
Cohesion: 0.12
Nodes (31): CYCLE_COUNT_SERIES, machineLabel(), pickedMachineIds(), Productivity(), programIn(), ProgramSelect(), finishedCycles(), samplePrograms() (+23 more)

### Community 5 - "react"
Cohesion: 0.11
Nodes (42): prop-types, react, IconAction(), LiveClock(), StatusBadge(), CLOCK_TICK_MS, ACTION_ICONS, MACHINE_STATUS (+34 more)

### Community 6 - "Parts & Machine Picker"
Cohesion: 0.06
Nodes (57): FieldLabel(), InfoTooltip(), FIELD_HELP, AddPart(), byName(), checkDrawing, DrawingUpload(), MachinePicker() (+49 more)

### Community 7 - "AddMachine.jsx"
Cohesion: 0.09
Nodes (41): CONTROLLER_VERSION_TYPES, MACHINE_ACCURACIES, MACHINE_HEALTH_ALL, MACHINE_HEALTH_SENSORS, MACHINE_MODES, MACHINE_SYSTEM_TYPES, SECURITY_MODES, AddMachine() (+33 more)

### Community 8 - "AddBranch.jsx"
Cohesion: 0.12
Nodes (28): BRANCH_STATUS, AddBranch(), labelClass(), branchSchema, COLOR_PICKER_FALLBACK, INITIAL_VALUES, optional(), REQUIRED_FIELDS (+20 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "dateTime.js"
Cohesion: 0.07
Nodes (48): clamp(), DateCalendar(), dayLabel, keyToDay(), monthGrid(), monthName, MONTHS, monthTitle (+40 more)

### Community 11 - "AddProductionSchedule.jsx"
Cohesion: 0.14
Nodes (21): react-hook-form, EMPTY_LISTS, ITEM_SELECTS, EMPTY_ITEM, idText(), INITIAL_VALUES, itemMinutes(), itemSchema (+13 more)

### Community 12 - "BreakFormModal.jsx"
Cohesion: 0.21
Nodes (15): ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, SHIFT_STATUS, breakSchema, INITIAL_VALUES, MAX_LENGTH, toBreakPayload(), toFormValues() (+7 more)

### Community 13 - "LicenceKeyGenerator.jsx"
Cohesion: 0.16
Nodes (22): StatusToggle(), DEFAULT_DURATION, DURATION_VALUES, editSchema, GENERATE_INITIAL_VALUES, generateSchema, LICENCE_DURATIONS, LICENCE_KEY_STATUS (+14 more)

### Community 14 - "ESLint Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 15 - "ModelFormModal.jsx"
Cohesion: 0.14
Nodes (21): controllerSchema, INITIAL_VALUES, MAX_LENGTH, toControllerPayload(), toFormValues(), ControllerFormModal(), FIELD_HELP, ControllerOptions() (+13 more)

### Community 16 - "Login.jsx"
Cohesion: 0.19
Nodes (11): BrandLogo(), LOGO_MARKUP, env, Login(), redirectTarget(), CENTER, LoginBackdrop(), RINGS (+3 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+8 more)

### Community 18 - "AuthProvider.jsx"
Cohesion: 0.24
Nodes (10): App(), Toaster(), ICONS, ToastItem(), AuthContext, AuthProvider(), onUnauthorized(), refreshUserTheme() (+2 more)

### Community 19 - "MainLayout.jsx"
Cohesion: 0.22
Nodes (13): Footer(), AppShell(), Sidebar(), navLeafShape, SidebarItem(), displayName(), Topbar(), LANGUAGES (+5 more)

### Community 20 - "healthSampleData.js"
Cohesion: 0.15
Nodes (21): buildDay(), dailyRows(), dayLabel, dayLoad(), dayStates(), dayWindow(), hourLabel, MAX_TREND_POINTS (+13 more)

### Community 21 - "HolidayFormModal.jsx"
Cohesion: 0.25
Nodes (11): DatePicker(), HOLIDAY_TYPES, WEEKDAYS, holidaySchema, INITIAL_VALUES, MAX_LENGTH, toFormValues(), toHolidayPayload() (+3 more)

### Community 22 - "ShiftFormModal.jsx"
Cohesion: 0.28
Nodes (13): clock(), EMPTY_BREAK_ROW, INITIAL_VALUES, MAX_BREAKS, MAX_LENGTH, offset(), shiftSchema(), toFormValues() (+5 more)

### Community 23 - "SidebarProvider.jsx"
Cohesion: 0.36
Nodes (6): BREAKPOINTS, SidebarContext, SidebarProvider(), useMediaQuery(), readStorage(), writeStorage()

### Community 24 - "AddProductionSchedule"
Cohesion: 0.36
Nodes (9): AddProductionSchedule(), byLabel(), userLabel(), createProductionSchedule(), getProductionScheduleById(), getProductionSchedules(), unwrap(), unwrapList() (+1 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "shiftService.js"
Cohesion: 0.52
Nodes (6): createShift(), getShiftById(), getShifts(), unwrap(), unwrapList(), updateShift()

### Community 27 - "npm Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 28 - "remove"
Cohesion: 0.50
Nodes (5): dismiss(), emit(), remove(), setToasts(), show()

### Community 29 - "package.json"
Cohesion: 0.14
Nodes (15): name, private, type, version, bootstrap, eslint, @eslint/js, eslint-plugin-react-hooks (+7 more)

### Community 30 - "Seven Logo Asset"
Cohesion: 0.67
Nodes (4): 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 35 - "StateFormModal.jsx"
Cohesion: 0.06
Nodes (73): country-region-data, zod, MultiSelectPicker(), summary(), toGroups(), customerLabel(), OrgCustomerField(), ALL_COUNTRIES (+65 more)

### Community 36 - "withQuery"
Cohesion: 0.05
Nodes (74): axios, REASON_KIND, REASON_PAGES, apiClient, pendingGets, sharedGet(), unauthorizedListeners, withQuery() (+66 more)

### Community 37 - "AppRoutes.jsx"
Cohesion: 0.26
Nodes (10): MainLayout(), NAV_SECTIONS, AppRoutes(), ComingSoon, guard(), Login, NotFound, PLACEHOLDERS (+2 more)

### Community 39 - "DateRangePicker.jsx"
Cohesion: 0.19
Nodes (20): ChartDateFilter(), DateRangePicker(), DEFAULT_PRESETS, earlier(), later(), normalizeRange(), RangePanel(), sameRange() (+12 more)

### Community 40 - "Topbar.jsx"
Cohesion: 0.16
Nodes (17): bootstrap-icons, @fontsource-variable/roboto, react-dom, @/assets/scss/theme-light.scss?inline, DEFAULT_THEME, STORAGE_KEYS, THEME, useTheme() (+9 more)

### Community 43 - "ShiftCard.jsx"
Cohesion: 0.38
Nodes (10): SHIFT_TYPES, ScheduleJobFields(), Clock(), minutesBetween(), ShiftCard(), toMinutes(), typeLabel(), formatClock12() (+2 more)

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **10 isolated node(s):** `bootstrap`, `@types/react`, `@types/react-dom`, `eslint`, `sass` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 158 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `BreakFormModal.jsx`, `MachineHealth.jsx`, `chartTheme.js`, `AddCustomer.jsx`, `Productivity.jsx`, `Parts & Machine Picker`, `AddMachine.jsx`, `AddBranch.jsx`, `dateTime.js`, `AddProductionSchedule.jsx`, `BreakFormModal.jsx`, `LicenceKeyGenerator.jsx`, `ModelFormModal.jsx`, `Login.jsx`, `AuthProvider.jsx`, `MainLayout.jsx`, `HolidayFormModal.jsx`, `ShiftFormModal.jsx`, `SidebarProvider.jsx`, `package.json`, `StateFormModal.jsx`, `withQuery`, `AppRoutes.jsx`, `DateRangePicker.jsx`, `Topbar.jsx`, `ShiftCard.jsx`?**
  _High betweenness centrality (0.181) - this node is a cross-community bridge._
- **What connects `bootstrap`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `BreakFormModal.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05057210708117444 - nodes in this community are weakly interconnected._
- **Why does `prop-types` connect `react` to `BreakFormModal.jsx`, `MachineHealth.jsx`, `chartTheme.js`, `AddCustomer.jsx`, `Productivity.jsx`, `Parts & Machine Picker`, `AddMachine.jsx`, `dateTime.js`, `AddProductionSchedule.jsx`, `BreakFormModal.jsx`, `LicenceKeyGenerator.jsx`, `ModelFormModal.jsx`, `Login.jsx`, `AuthProvider.jsx`, `MainLayout.jsx`, `HolidayFormModal.jsx`, `ShiftFormModal.jsx`, `SidebarProvider.jsx`, `package.json`, `StateFormModal.jsx`, `AppRoutes.jsx`, `DateRangePicker.jsx`, `ShiftCard.jsx`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Should `MachineHealth.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08879492600422834 - nodes in this community are weakly interconnected._
- **Why does `react-bootstrap` connect `BreakFormModal.jsx` to `MachineHealth.jsx`, `AddCustomer.jsx`, `Productivity.jsx`, `react`, `Parts & Machine Picker`, `AddMachine.jsx`, `AddBranch.jsx`, `dateTime.js`, `AddProductionSchedule.jsx`, `BreakFormModal.jsx`, `LicenceKeyGenerator.jsx`, `ModelFormModal.jsx`, `Login.jsx`, `AuthProvider.jsx`, `MainLayout.jsx`, `HolidayFormModal.jsx`, `ShiftFormModal.jsx`, `package.json`, `StateFormModal.jsx`, `AppRoutes.jsx`, `ShiftCard.jsx`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._