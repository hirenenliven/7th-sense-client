# Graph Report - 7th-sense-client  (2026-10-16)

## Corpus Check
- 206 files · ~117,297 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1036 nodes · 3454 edges · 40 communities (34 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 65 edges (avg confidence: 0.61)
- Token cost: 158,543 input · 1,600 output

## Community Hubs (Navigation)
- Shared Table & Modal Components
- Org Customer & Multi-Select
- Organization List Pages
- Locations & Clientele
- Shifts, Breaks & Holidays
- Status & Icon Widgets
- Parts & Machine Picker
- Machines & Health Sensors
- Branches
- Project Docs & Conventions
- Date Picker
- Controllers & Models Catalog
- Licence Keys
- Production Schedule Form
- ESLint Dev Dependencies
- User Guide & Field Help
- Schedule Jobs & Shift Timing
- Runtime Dependencies
- App Bootstrap & Theme
- Login & Branding
- Sidebar Navigation
- Time Picker
- Routing & Fallback Pages
- Topbar & Responsive Layout
- Theme Showcase
- jsconfig Aliases
- Toast Notifications
- npm Scripts
- Auth Session
- Package Metadata
- Seven Logo Asset
- Production Schedule List
- Login Logo Asset
- Vite Config
- Bootstrap Icons Dep
- Hookform Resolvers Dep
- libphonenumber Dep
- prop-types Dep
- React Dep

## God Nodes (most connected - your core abstractions)
1. `withQuery()` - 60 edges
2. `useOrgUser()` - 55 edges
3. `sharedGet()` - 51 edges
4. `toast` - 48 edges
5. `useAuth()` - 43 edges
6. `useTableSort()` - 41 edges
7. `newestFirst()` - 39 edges
8. `formatDate()` - 33 edges
9. `customerName()` - 32 edges
10. `Loader()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `Form Handling Standard (React Hook Form + Zod)` --conceptually_related_to--> `CLAUDE.md Project Instructions`  [INFERRED]
  7th-sense-frontend-skills.md → CLAUDE.md
- `Production Schedule (Single/Multiple Day jobs)` --conceptually_related_to--> `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)`  [AMBIGUOUS]
  CLAUDE.md → 7thsense-ui-review.html
- `7thSense Theme Usage Guide` --conceptually_related_to--> `OEE (Availability / Performance / Quality)`  [INFERRED]
  THEME.md → 7thsense-ui-review.html
- `Table Design Standard (Sortable Table Pattern)` --conceptually_related_to--> `CLAUDE.md Project Instructions`  [INFERRED]
  7th-sense-frontend-skills.md → CLAUDE.md
- `7thSense Theme Usage Guide` --conceptually_related_to--> `Table Design Standard (Sortable Table Pattern)`  [INFERRED]
  THEME.md → 7th-sense-frontend-skills.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project convention documents (CLAUDE.md, frontend skills, THEME, README)** — claude, 7th_sense_frontend_skills, theme, readme [EXTRACTED 1.00]
- **Dark/light dual theme system** — theme_design_tokens, theme_light_theme_second_build, theme_theme_switching, 7thsense_ui_review [INFERRED 0.85]
- **Customer-scoped master data with role-based access** — claude_masters_customer_pattern, claude_role_based_access, claude_production_schedule, claude_licence_keys, claude_shifts_breaks [INFERRED 0.85]

## Communities (40 total, 6 thin omitted)

### Community 0 - "Shared Table & Modal Components"
Cohesion: 0.06
Nodes (99): ConfirmModal(), Loader(), ARIA_SORT, SortableHead(), pageItems(), TablePagination(), ALL_MACHINE_ROLES, CUSTOMER_ROLE_ID (+91 more)

### Community 1 - "Org Customer & Multi-Select"
Cohesion: 0.05
Nodes (71): MultiSelectPicker(), summary(), toGroups(), customerLabel(), OrgCustomerField(), ALL_COUNTRIES, byName, findLibraryCountry() (+63 more)

### Community 2 - "Organization List Pages"
Cohesion: 0.05
Nodes (74): byName(), CellList(), matchesSearch(), byName(), CityList(), matchesSearch(), byName(), LineList() (+66 more)

### Community 3 - "Locations & Clientele"
Cohesion: 0.07
Nodes (67): THEMES, COUNTRIES, DEFAULT_COUNTRY, DEFAULT_TIME_ZONE, ENABLED_COUNTRIES, getCountryCode(), getCountryName(), getDialCode() (+59 more)

### Community 4 - "Shifts, Breaks & Holidays"
Cohesion: 0.07
Nodes (55): StatusToggle(), ALL_WEEKDAYS, BREAK_NAME_SUGGESTIONS, HOLIDAY_TYPES, SHIFT_STATUS, WEEKDAYS, breakSchema, INITIAL_VALUES (+47 more)

### Community 5 - "Status & Icon Widgets"
Cohesion: 0.11
Nodes (31): LiveClock(), CLOCK_TICK_MS, ACTION_ICONS, OrgUserContext, useOrgUser(), BranchRow(), ControllerRow(), dayLabel() (+23 more)

### Community 6 - "Parts & Machine Picker"
Cohesion: 0.10
Nodes (37): FieldLabel(), AddPart(), byName(), checkDrawing, DrawingUpload(), MachinePicker(), summary(), DRAWING_RULES (+29 more)

### Community 7 - "Machines & Health Sensors"
Cohesion: 0.09
Nodes (40): CONTROLLER_VERSION_TYPES, MACHINE_ACCURACIES, MACHINE_HEALTH_ALL, MACHINE_HEALTH_SENSORS, MACHINE_STATUS, MACHINE_SYSTEM_TYPES, SECURITY_MODES, AddMachine() (+32 more)

### Community 8 - "Branches"
Cohesion: 0.12
Nodes (29): BRANCH_STATUS, AddBranch(), labelClass(), branchSchema, COLOR_PICKER_FALLBACK, INITIAL_VALUES, REQUIRED_FIELDS, toBranchPayload() (+21 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (31): Frontend Engineering Agent Configuration, Frontend Anti-Patterns to Avoid, API Integration via Axios apiClient, Form Handling Standard (React Hook Form + Zod), Styling Standards (Bootstrap First, SCSS, No Tailwind), Table Design Standard (Sortable Table Pattern), 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights) (+23 more)

### Community 10 - "Date Picker"
Cohesion: 0.14
Nodes (28): clamp(), DateCalendar(), DatePicker(), dayLabel, keyToDay(), monthGrid(), monthName, MONTHS (+20 more)

### Community 11 - "Controllers & Models Catalog"
Cohesion: 0.14
Nodes (21): controllerSchema, INITIAL_VALUES, MAX_LENGTH, toControllerPayload(), toFormValues(), ControllerFormModal(), FIELD_HELP, ControllerOptions() (+13 more)

### Community 12 - "Licence Keys"
Cohesion: 0.17
Nodes (21): DEFAULT_DURATION, DURATION_VALUES, editSchema, GENERATE_INITIAL_VALUES, generateSchema, LICENCE_DURATIONS, LICENCE_KEY_STATUS, MAX_KEYS (+13 more)

### Community 13 - "Production Schedule Form"
Cohesion: 0.15
Nodes (22): AddProductionSchedule(), byLabel(), EMPTY_LISTS, ITEM_SELECTS, userLabel(), EMPTY_ITEM, idText(), INITIAL_VALUES (+14 more)

### Community 14 - "ESLint Dev Dependencies"
Cohesion: 0.10
Nodes (21): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+13 more)

### Community 15 - "User Guide & Field Help"
Cohesion: 0.12
Nodes (15): InfoTooltip(), NAV_SECTIONS, FIELD_HELP, ADD_BRANCH_STEPS, ADD_CUSTOMER_STEPS, COUNTRY_RULES, CUSTOMER_LIST_ACTIONS, FAQ (+7 more)

### Community 16 - "Schedule Jobs & Shift Timing"
Cohesion: 0.18
Nodes (17): SHIFT_TYPES, BreakRow(), itemMinutes(), MAX_LENGTH, MAX_QUANTITY, FIELD_HELP, optionShape, ScheduleJobFields() (+9 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.11
Nodes (19): axios, bootstrap, country-region-data, @fontsource-variable/roboto, dependencies, axios, bootstrap, country-region-data (+11 more)

### Community 18 - "App Bootstrap & Theme"
Cohesion: 0.21
Nodes (15): App(), @/assets/scss/theme-light.scss?inline, DEFAULT_THEME, THEME, useTheme(), applyTheme(), chooseTheme(), forceTheme() (+7 more)

### Community 19 - "Login & Branding"
Cohesion: 0.18
Nodes (11): BrandLogo(), LOGO_MARKUP, Footer(), env, Login(), redirectTarget(), CENTER, LoginBackdrop() (+3 more)

### Community 20 - "Sidebar Navigation"
Cohesion: 0.24
Nodes (9): AppShell(), Sidebar(), navLeafShape, SidebarItem(), SidebarContext, useSidebar(), filterNavByRole(), hasActiveChild() (+1 more)

### Community 21 - "Time Picker"
Cohesion: 0.18
Nodes (13): assignRef(), PickerField(), POPPER_CONFIG, centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel() (+5 more)

### Community 22 - "Routing & Fallback Pages"
Cohesion: 0.16
Nodes (10): MainLayout(), AppRoutes(), ComingSoon, guard(), Login, NotFound, PLACEHOLDERS, BUILT_PATHS (+2 more)

### Community 23 - "Topbar & Responsive Layout"
Cohesion: 0.31
Nodes (9): displayName(), Topbar(), BREAKPOINTS, LANGUAGES, STORAGE_KEYS, SidebarProvider(), useMediaQuery(), readStorage() (+1 more)

### Community 24 - "Theme Showcase"
Cohesion: 0.25
Nodes (6): EXCEPTIONS, FILTERS, KPIS, MACHINES, TABS, ThemeShowcase

### Community 25 - "jsconfig Aliases"
Cohesion: 0.29
Nodes (6): compilerOptions, baseUrl, jsx, paths, include, src

### Community 26 - "Toast Notifications"
Cohesion: 0.43
Nodes (5): Toaster(), ICONS, ToastItem(), getToasts(), subscribeToasts()

### Community 27 - "npm Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 28 - "Auth Session"
Cohesion: 0.53
Nodes (4): AuthContext, AuthProvider(), onUnauthorized(), refreshUserTheme()

### Community 29 - "Package Metadata"
Cohesion: 0.40
Nodes (4): name, private, type, version

### Community 30 - "Seven Logo Asset"
Cohesion: 0.67
Nodes (4): 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents)

### Community 31 - "Production Schedule List"
Cohesion: 0.67
Nodes (4): matchesSearch(), ProductionScheduleList(), scheduleDates(), deleteProductionSchedule()

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **102 isolated node(s):** `baseUrl`, `jsx`, `paths`, `src`, `name` (+97 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `toast` connect `Shared Table & Modal Components` to `Org Customer & Multi-Select`, `Locations & Clientele`, `Shifts, Breaks & Holidays`, `Parts & Machine Picker`, `Machines & Health Sensors`, `Branches`, `Controllers & Models Catalog`, `Licence Keys`, `Production Schedule Form`, `Login & Branding`, `Topbar & Responsive Layout`, `Theme Showcase`, `Toast Notifications`, `Auth Session`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `withQuery()` connect `Organization List Pages` to `Shared Table & Modal Components`, `Locations & Clientele`, `Shifts, Breaks & Holidays`, `Parts & Machine Picker`, `Machines & Health Sensors`, `Licence Keys`, `Production Schedule Form`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `Shared Table & Modal Components` to `Locations & Clientele`, `Parts & Machine Picker`, `Machines & Health Sensors`, `Branches`, `Production Schedule Form`, `Login & Branding`, `Sidebar Navigation`, `Topbar & Responsive Layout`, `Production Schedule List`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `baseUrl`, `jsx`, `paths` to the rest of the system?**
  _102 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Shared Table & Modal Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06464542651593011 - nodes in this community are weakly interconnected._
- **Should `Org Customer & Multi-Select` be split into smaller, more focused modules?**
  _Cohesion score 0.053235653235653234 - nodes in this community are weakly interconnected._