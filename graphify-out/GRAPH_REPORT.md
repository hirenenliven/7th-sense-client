# Graph Report - 7th-sense-client  (2026-11-04)

## Corpus Check
- 312 files · ~171,570 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .scss 4)

## Summary
- 1806 nodes · 5917 edges · 92 communities (91 shown, 1 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 374 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `25f1bc86`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- MainLayout
- MachineHealth.jsx
- BarLineChart.jsx
- Loader
- Productivity.jsx
- react
- app.js
- AddMachine.jsx
- AddBranch.jsx
- Project Docs & Conventions
- dateTime.js
- TimePicker.jsx
- StateFormModal.jsx
- Machine models
- ESLint Dev Dependencies
- AddProductionSchedule.jsx
- BranchList.jsx
- Runtime Dependencies
- Login.jsx
- Customer / user detail
- 0001. Single-page app with React 19 and Vite
- AddPart.jsx
- AddCustomer.jsx
- machines.js
- useAuth
- jsconfig Aliases
- userCountryService.js
- shiftService.js
- LicenceKeyGenerator.jsx
- package.json
- Seven Logo Asset
- AuthProvider.jsx
- Login Logo Asset
- ControllerFormModal.jsx
- toast.js
- Cells
- vite.config.js
- useTableSort
- react-router-dom
- AddPart
- ControllerList.jsx
- Production schedules
- ProtectedRoute
- Cities
- ShiftFormModal.jsx
- adr/README.md
- Downtime / idle reasons
- ModelFormModal.jsx
- apiClient.js
- catalogService.js
- Parts
- 0010. Organization levels on one tabbed page, a route per tab
- 0012. Monitoring: Productivity and Machine Health on one tabbed page
- userLineService.js
- Monitoring › Machines
- Add / edit production schedule
- UserGuide.jsx
- userSupervisorService.js
- Lines
- withQuery
- Theme showcase
- userStateService.js
- Machine health
- 0013. Monitoring starts with a machine list; All Machines is set-up only
- About
- Locations
- 0008. Folder structure by page and by concern
- User guide
- 0006. React-Bootstrap with SCSS design tokens
- Client documentation
- withQuery
- All machines
- CellList.jsx
- AddProductionSchedule
- Shops
- 0014. Business Setup renamed Account Center; old Account Center item removed
- useLoad
- Branches
- newestFirst
- Clientele
- 0005. Forms with react-hook-form and zod
- machineService.js
- 0009. Page-wise flow documentation in docs/pages
- 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page
- Add / edit customer or user
- Add / edit machine
- userLocationService.js
- userShopService.js
- scripts
- ProductionScheduleList.jsx
- 0003. Server state via service modules and useLoad, Context only for the session
- FieldLabel

## God Nodes (most connected - your core abstractions)
1. `react` - 127 edges
2. `prop-types` - 102 edges
3. `react-bootstrap` - 90 edges
4. `withQuery()` - 73 edges
5. `useAuth()` - 67 edges
6. `sharedGet()` - 64 edges
7. `useOrgUser()` - 55 edges
8. `Loader()` - 55 edges
9. `toast` - 50 edges
10. `ProtectedRoute()` - 45 edges

## Surprising Connections (you probably didn't know these)
- `State & storage` --references--> `useAuth()`  [INFERRED]
  docs/pages/branch-form.md → src/hooks/useAuth.js
- `On page load` --references--> `getBranches()`  [INFERRED]
  docs/pages/branch-list.md → src/services/branchService.js
- `Save branch (add / edit form)` --references--> `updateBranch()`  [INFERRED]
  docs/pages/branch-list.md → src/services/branchService.js
- `State & storage` --references--> `useAuth()`  [INFERRED]
  docs/pages/clientele-list.md → src/hooks/useAuth.js
- `State & storage` --references--> `useAuth()`  [INFERRED]
  docs/pages/licence-keys.md → src/hooks/useAuth.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project convention documents (CLAUDE.md, frontend skills, THEME, README)** — claude, 7th_sense_frontend_skills, theme, readme [EXTRACTED 1.00]
- **Customer-scoped master data with role-based access** — claude_masters_customer_pattern, claude_role_based_access, claude_production_schedule, claude_licence_keys, claude_shifts_breaks [INFERRED 0.85]
- **Dark/light dual theme system** — theme_design_tokens, theme_light_theme_second_build, theme_theme_switching, 7thsense_ui_review [INFERRED 0.85]

## Communities (92 total, 1 thin omitted)

### Community 0 - "MainLayout"
Cohesion: 0.24
Nodes (14): Footer(), AppShell(), MainLayout(), Sidebar(), isAlsoActive(), linkClass(), navLeafShape, SidebarItem() (+6 more)

### Community 1 - "MachineHealth.jsx"
Cohesion: 0.07
Nodes (60): ChartCard(), niceTicks(), STEP_MULTIPLES, buildDay(), dailyRows(), dayLabel, dayLoad(), dayStates() (+52 more)

### Community 2 - "BarLineChart.jsx"
Cohesion: 0.12
Nodes (51): recharts, AreaGrowthChart(), BarLineChart(), ChartFrame(), LEGEND_BOTTOM_PROPS, LEGEND_PROPS, axisPropTypes, renderGrid() (+43 more)

### Community 3 - "Loader"
Cohesion: 0.12
Nodes (34): ConfirmModal(), Loader(), ARIA_SORT, SortableHead(), CUSTOMER_ROLE_ID, ROLES, compareValues(), isBlank() (+26 more)

### Community 4 - "Productivity.jsx"
Cohesion: 0.07
Nodes (50): ModeTimelineCard(), readoutClock, readoutTime, chartMessage(), dayLabel, machineLabel(), pickedMachineIds(), Productivity() (+42 more)

### Community 5 - "react"
Cohesion: 0.10
Nodes (46): prop-types, react, IconAction(), LiveClock(), StatusBadge(), CLOCK_TICK_MS, ACTION_ICONS, MACHINE_STATUS (+38 more)

### Community 6 - "app.js"
Cohesion: 0.28
Nodes (9): ACCOUNT_CENTER_PATHS, MANAGERS, PAGE_SIZES, SUPERADMIN_ONLY, ORGANIZATION_PATHS, ClienteleList(), matchesSearch(), ClienteleList (+1 more)

### Community 7 - "AddMachine.jsx"
Cohesion: 0.15
Nodes (25): AddMachine(), byName(), Field(), loadBrands(), loadControllers(), loadCustomers(), loadModels(), placeholder() (+17 more)

### Community 8 - "AddBranch.jsx"
Cohesion: 0.09
Nodes (35): Add / edit branch, API calls on this page, Decisions, On page load, Save branch (add / edit form), Shared components used, State & storage, UI states (+27 more)

### Community 9 - "Project Docs & Conventions"
Cohesion: 0.11
Nodes (22): Frontend Engineering Agent Configuration, API Integration via Axios apiClient, 7thSense UI/UX & Navigation Review (frozen sim data), AI Insights & Copilot (frozen insights), OEE (Availability / Performance / Quality), Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup), CLAUDE.md Project Instructions, API Response Envelope {statusCode, success, message, data} (+14 more)

### Community 10 - "dateTime.js"
Cohesion: 0.12
Nodes (39): ChartDateFilter(), clamp(), DateCalendar(), DatePicker(), dayLabel, keyToDay(), monthGrid(), monthName (+31 more)

### Community 11 - "TimePicker.jsx"
Cohesion: 0.12
Nodes (22): assignRef(), PickerField(), POPPER_CONFIG, centerOption(), HOURS, MINUTES, TimeColumn(), TimePanel() (+14 more)

### Community 12 - "StateFormModal.jsx"
Cohesion: 0.05
Nodes (76): Save user city (add / edit form), country-region-data, zod, MultiSelectPicker(), summary(), toGroups(), customerLabel(), OrgCustomerField() (+68 more)

### Community 13 - "Machine models"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete model, Machine models, On page load, Shared components used, State & storage, UI states

### Community 14 - "ESLint Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+3 more)

### Community 15 - "AddProductionSchedule.jsx"
Cohesion: 0.15
Nodes (18): react-hook-form, EMPTY_LISTS, ITEM_SELECTS, EMPTY_ITEM, idText(), INITIAL_VALUES, itemSchema, MAX_ITEMS (+10 more)

### Community 16 - "BranchList.jsx"
Cohesion: 0.24
Nodes (11): On page load, BranchList(), matchesSearch(), byName(), LocationList(), matchesSearch(), BranchList, OrgLocationList (+3 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, axios, bootstrap, bootstrap-icons, country-region-data, @fontsource-variable/roboto, @hookform/resolvers, libphonenumber-js (+8 more)

### Community 18 - "Login.jsx"
Cohesion: 0.06
Nodes (47): API calls on this page, App shell (session, logout, theme), Change theme, Decisions, On page load, Shared components used, State & storage, UI states (+39 more)

### Community 19 - "Customer / user detail"
Cohesion: 0.33
Nodes (6): API calls on this page, Customer / user detail, Decisions, Shared components used, State & storage, UI states

### Community 20 - "0001. Single-page app with React 19 and Vite"
Cohesion: 0.33
Nodes (5): 0001. Single-page app with React 19 and Vite, Alternatives considered, Consequences, Context, Decision

### Community 21 - "AddPart.jsx"
Cohesion: 0.14
Nodes (21): AddPart(), byName(), DRAWING_RULES, EMPTY_PROCESS, EMPTY_SUB_PROGRAM, INITIAL_VALUES, MAX_LENGTH, MAX_PART_COUNT (+13 more)

### Community 22 - "AddCustomer.jsx"
Cohesion: 0.05
Nodes (93): On page load, Save clientele (add / edit form), On page load, On page load, Save user (add / edit form), API calls on this page, Customers / Users list, Decisions (+85 more)

### Community 23 - "machines.js"
Cohesion: 0.09
Nodes (22): 0007. Recharts for charts, plain SVG for the Gantt, Alternatives considered, Consequences, Context, Decision, clockMinutes, clockWithSeconds, ModeGanttChart() (+14 more)

### Community 24 - "useAuth"
Cohesion: 0.20
Nodes (17): Decision, react-bootstrap, ACCOUNT_CENTER_TABS, machineMonitorPath(), useAuth(), AccountCenterPage(), isTabActive(), MachineBrowser() (+9 more)

### Community 25 - "jsconfig Aliases"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 26 - "userCountryService.js"
Cohesion: 0.22
Nodes (9): API calls on this page, Countries, Decisions, Delete user country, On page load, Save user country (add / edit form), Shared components used, State & storage (+1 more)

### Community 27 - "shiftService.js"
Cohesion: 0.18
Nodes (15): API calls on this page, Decisions, Delete shift, On page load, Save shift (add / edit form), Shared components used, Shifts, State & storage (+7 more)

### Community 28 - "LicenceKeyGenerator.jsx"
Cohesion: 0.05
Nodes (55): API calls on this page, Decisions, Delete licence key, Generate licence keys, Licence keys, On page load, Save licence key (add / edit form), Save licence keys (add / edit form) (+47 more)

### Community 29 - "package.json"
Cohesion: 0.12
Nodes (17): name, private, type, version, bootstrap, bootstrap-icons, eslint, @eslint/js (+9 more)

### Community 30 - "Seven Logo Asset"
Cohesion: 0.67
Nodes (4): 7th Sense Logo (seven-logo.svg), 7th Sense Brand Identity, Brand Orange #f7941d, Stylized '7' Line Mark (nested strokes with dot accents)

### Community 31 - "AuthProvider.jsx"
Cohesion: 0.09
Nodes (26): 0004. Axios client with the HttpOnly session cookie, Alternatives considered, Consequences, Context, Decision, Click Log out, API calls on this page, Decisions (+18 more)

### Community 32 - "Login Logo Asset"
Cohesion: 0.67
Nodes (3): 7th Sense Brand Orange (#f79420 / #f7941d), 7th Sense Login Logo (SVG), Stylized Orange '7' Line Mark (#f79420)

### Community 33 - "ControllerFormModal.jsx"
Cohesion: 0.33
Nodes (8): @hookform/resolvers, controllerSchema, INITIAL_VALUES, MAX_LENGTH, toControllerPayload(), toFormValues(), ControllerFormModal(), FIELD_HELP

### Community 34 - "toast.js"
Cohesion: 0.19
Nodes (15): TOAST_DEFAULTS, byBrandControllerName(), compareText(), matchesSearch(), ModelList(), ModelList, deleteModel(), dismiss() (+7 more)

### Community 35 - "Cells"
Cohesion: 0.29
Nodes (7): API calls on this page, Cells, Decisions, Delete user cell, Shared components used, State & storage, UI states

### Community 36 - "vite.config.js"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, __dirname, SASS_SILENCED

### Community 37 - "useTableSort"
Cohesion: 0.21
Nodes (15): On page load, On page load, byName(), LineList(), matchesSearch(), byName(), matchesSearch(), ShopList() (+7 more)

### Community 38 - "react-router-dom"
Cohesion: 0.11
Nodes (18): react-router-dom, MONITOR_REFRESH_MS, MONITORING_PATHS, MONITORING_TABS, ORGANIZATION_TABS, ROUTES, Forbidden(), About (+10 more)

### Community 39 - "AddPart"
Cohesion: 0.16
Nodes (18): Add / edit part, API calls on this page, Decisions, Save part (add / edit form), Shared components used, State & storage, UI states, Upload part drawing (+10 more)

### Community 40 - "ControllerList.jsx"
Cohesion: 0.52
Nodes (6): byBrandThenName(), byName(), ControllerList(), matchesSearch(), ControllerList, deleteController()

### Community 41 - "Production schedules"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete production schedule, On page load, Production schedules, Shared components used, State & storage, UI states

### Community 42 - "ProtectedRoute"
Cohesion: 0.10
Nodes (23): 0002. React Router with one route table and role guards, Alternatives considered, Consequences, Context, Decision, Coming soon (unbuilt sidebar links), Decisions, On page load (+15 more)

### Community 43 - "Cities"
Cohesion: 0.25
Nodes (8): API calls on this page, Cities, Decisions, Delete user city, On page load, Shared components used, State & storage, UI states

### Community 44 - "ShiftFormModal.jsx"
Cohesion: 0.05
Nodes (73): API calls on this page, Breaks, Decisions, Delete break, On page load, Save break (add / edit form), Shared components used, State & storage (+65 more)

### Community 46 - "Downtime / idle reasons"
Cohesion: 0.13
Nodes (25): API calls on this page, Decisions, Delete downtime reason, Delete idle reason, Downtime / idle reasons, On page load, Save downtime reason (add / edit form), Save idle reason (add / edit form) (+17 more)

### Community 47 - "ModelFormModal.jsx"
Cohesion: 0.32
Nodes (9): ControllerOptions(), groupByBrand(), INITIAL_VALUES, modelSchema, NAME_MAX_LENGTH, toFormValues(), toModelPayload(), ModelFormModal() (+1 more)

### Community 48 - "apiClient.js"
Cohesion: 0.20
Nodes (10): axios, apiClient, pendingGets, unauthorizedListeners, getUserCities(), unwrap(), unwrapList(), createUserCountry() (+2 more)

### Community 49 - "catalogService.js"
Cohesion: 0.16
Nodes (20): API calls on this page, Controllers, Decisions, Delete controller, On page load, Save controller (add / edit form), Shared components used, State & storage (+12 more)

### Community 50 - "Parts"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete part, On page load, Parts, Shared components used, State & storage, UI states

### Community 51 - "0010. Organization levels on one tabbed page, a route per tab"
Cohesion: 0.33
Nodes (6): 0010. Organization levels on one tabbed page, a route per tab, Alternatives considered, Consequences, Context, Decision, OrganizationPage()

### Community 52 - "0012. Monitoring: Productivity and Machine Health on one tabbed page"
Cohesion: 0.33
Nodes (6): 0012. Monitoring: Productivity and Machine Health on one tabbed page, Alternatives considered, Consequences, Context, Decision, MonitoringPage()

### Community 53 - "userLineService.js"
Cohesion: 0.60
Nodes (5): Save user line (add / edit form), createUserLine(), unwrap(), unwrapList(), updateUserLine()

### Community 54 - "Monitoring › Machines"
Cohesion: 0.20
Nodes (10): API calls on this page, Decisions, Monitoring › Machines, On page load, Open productivity / health, Rules & edge cases, Shared components used, State & storage (+2 more)

### Community 55 - "Add / edit production schedule"
Cohesion: 0.33
Nodes (6): Add / edit production schedule, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 56 - "UserGuide.jsx"
Cohesion: 0.18
Nodes (18): navLinks(), NUMBERED_STEPS, OpenLink(), SectionCard(), SECTIONS, SetupStep(), textOf(), UserGuide() (+10 more)

### Community 57 - "userSupervisorService.js"
Cohesion: 0.19
Nodes (14): API calls on this page, Decisions, Delete user supervisor, On page load, Save user supervisor (add / edit form), Shared components used, State & storage, Supervisors (+6 more)

### Community 58 - "Lines"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete user line, Lines, Shared components used, State & storage, UI states

### Community 59 - "withQuery"
Cohesion: 0.30
Nodes (10): Decision, Save user cell (add / edit form), withQuery(), createUserCell(), unwrap(), unwrapList(), updateUserCell(), createUserState() (+2 more)

### Community 60 - "Theme showcase"
Cohesion: 0.40
Nodes (5): Decisions, Shared components used, State & storage, Theme showcase, UI states

### Community 61 - "userStateService.js"
Cohesion: 0.25
Nodes (8): API calls on this page, Decisions, Delete user state, Save user state (add / edit form), Shared components used, State & storage, States, UI states

### Community 62 - "Machine health"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Live updates, Machine health, Shared components used, State & storage, UI states

### Community 63 - "0013. Monitoring starts with a machine list; All Machines is set-up only"
Cohesion: 0.50
Nodes (4): 0013. Monitoring starts with a machine list; All Machines is set-up only, Alternatives considered, Consequences, Context

### Community 64 - "About"
Cohesion: 0.50
Nodes (4): About, Decisions, State & storage, UI states

### Community 65 - "Locations"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete user location, Locations, Shared components used, State & storage, UI states

### Community 66 - "0008. Folder structure by page and by concern"
Cohesion: 0.33
Nodes (5): 0008. Folder structure by page and by concern, Alternatives considered, Consequences, Context, Decision

### Community 67 - "User guide"
Cohesion: 0.25
Nodes (8): Decisions, On page load, Rules & edge cases, Sections, Shared components used, State & storage, UI states, User guide

### Community 69 - "0006. React-Bootstrap with SCSS design tokens"
Cohesion: 0.33
Nodes (5): 0006. React-Bootstrap with SCSS design tokens, Alternatives considered, Consequences, Context, Decision

### Community 71 - "Client documentation"
Cohesion: 0.50
Nodes (4): Client documentation, How to use Postman, How to view the API docs in Chrome (Swagger UI), How to view the page flow docs

### Community 72 - "withQuery"
Cohesion: 0.32
Nodes (12): On page load, On page load, sharedGet(), getMachineTimeByDay(), unwrap(), getCycleCounts(), getFinishCycles(), getModeTimeline() (+4 more)

### Community 74 - "All machines"
Cohesion: 0.22
Nodes (9): All machines, API calls on this page, Decisions, Delete machine, Edit machine, On page load, Shared components used, State & storage (+1 more)

### Community 76 - "CellList.jsx"
Cohesion: 0.23
Nodes (12): On page load, byName(), CellList(), matchesSearch(), byName(), matchesSearch(), SupervisorList(), OrgCellList (+4 more)

### Community 78 - "AddProductionSchedule"
Cohesion: 0.33
Nodes (10): Save production schedule (add / edit form), AddProductionSchedule(), byLabel(), userLabel(), createProductionSchedule(), getProductionScheduleById(), getProductionSchedules(), unwrap() (+2 more)

### Community 80 - "Shops"
Cohesion: 0.29
Nodes (7): API calls on this page, Decisions, Delete user shop, Shared components used, Shops, State & storage, UI states

### Community 81 - "0014. Business Setup renamed Account Center; old Account Center item removed"
Cohesion: 0.40
Nodes (5): 0014. Business Setup renamed Account Center; old Account Center item removed, Alternatives considered, Consequences, Context, Decision

### Community 82 - "useLoad"
Cohesion: 0.24
Nodes (9): API calls on this page, Change the Machine Modes period, Decisions, Live updates, Productivity, Shared components used, State & storage, UI states (+1 more)

### Community 83 - "Branches"
Cohesion: 0.22
Nodes (9): API calls on this page, Branches, Decisions, Delete branch, On page load, Save branch (add / edit form), Shared components used, State & storage (+1 more)

### Community 85 - "newestFirst"
Cohesion: 0.17
Nodes (19): On page load, byName(), CityList(), matchesSearch(), byName(), CountryList(), matchesSearch(), byName() (+11 more)

### Community 88 - "Clientele"
Cohesion: 0.29
Nodes (7): API calls on this page, Clientele, Decisions, Delete clientele, Shared components used, State & storage, UI states

### Community 89 - "0005. Forms with react-hook-form and zod"
Cohesion: 0.33
Nodes (5): 0005. Forms with react-hook-form and zod, Alternatives considered, Consequences, Context, Decision

### Community 90 - "machineService.js"
Cohesion: 0.52
Nodes (6): Save machine (add / edit form), createMachine(), getMachineById(), unwrap(), unwrapList(), updateMachine()

### Community 91 - "0009. Page-wise flow documentation in docs/pages"
Cohesion: 0.33
Nodes (5): 0009. Page-wise flow documentation in docs/pages, Alternatives considered, Consequences, Context, Decision

### Community 93 - "0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page"
Cohesion: 0.40
Nodes (5): 0011. Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page, Alternatives considered, Consequences, Context, Decision

### Community 95 - "Add / edit customer or user"
Cohesion: 0.33
Nodes (6): Add / edit customer or user, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 96 - "Add / edit machine"
Cohesion: 0.33
Nodes (6): Add / edit machine, API calls on this page, Decisions, Shared components used, State & storage, UI states

### Community 97 - "userLocationService.js"
Cohesion: 0.60
Nodes (5): Save user location (add / edit form), createUserLocation(), unwrap(), unwrapList(), updateUserLocation()

### Community 98 - "userShopService.js"
Cohesion: 0.60
Nodes (5): Save user shop (add / edit form), createUserShop(), unwrap(), unwrapList(), updateUserShop()

### Community 99 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:theme, dev, lint, preview

### Community 100 - "ProductionScheduleList.jsx"
Cohesion: 0.42
Nodes (7): pageItems(), TablePagination(), matchesSearch(), ProductionScheduleList(), scheduleDates(), ProductionScheduleList, deleteProductionSchedule()

### Community 101 - "0003. Server state via service modules and useLoad, Context only for the session"
Cohesion: 0.40
Nodes (4): 0003. Server state via service modules and useLoad, Context only for the session, Alternatives considered, Consequences, Context

### Community 103 - "FieldLabel"
Cohesion: 0.24
Nodes (10): FieldLabel(), InfoTooltip(), MachinePicker(), summary(), processSeconds(), FIELD_HELP, ProcessFields(), SubPrograms() (+2 more)

## Ambiguous Edges - Review These
- `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` → `Production Schedule (Single/Multiple Day jobs)`  [AMBIGUOUS]
  CLAUDE.md · relation: conceptually_related_to

## Knowledge Gaps
- **10 isolated node(s):** `bootstrap`, `eslint`, `sass`, `@types/react`, `@types/react-dom` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 369 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProtectedRoute()` connect `ProtectedRoute` to `Loader`, `AddBranch.jsx`, `Machine models`, `Login.jsx`, `Customer / user detail`, `AddCustomer.jsx`, `useAuth`, `userCountryService.js`, `shiftService.js`, `LicenceKeyGenerator.jsx`, `Cells`, `react-router-dom`, `AddPart`, `Production schedules`, `Cities`, `ShiftFormModal.jsx`, `Downtime / idle reasons`, `catalogService.js`, `Parts`, `Monitoring › Machines`, `Add / edit production schedule`, `userSupervisorService.js`, `Lines`, `Theme showcase`, `userStateService.js`, `Machine health`, `About`, `Locations`, `User guide`, `All machines`, `Shops`, `useLoad`, `Branches`, `Clientele`, `Add / edit customer or user`, `Add / edit machine`?**
  _High betweenness centrality (0.160) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `useAuth()` (e.g. with `State & storage` and `State & storage`) actually correct?**
  _`useAuth()` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `bootstrap`, `eslint`, `sass` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `MachineHealth.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06564364876385337 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `MainLayout`, `MachineHealth.jsx`, `BarLineChart.jsx`, `Loader`, `Productivity.jsx`, `app.js`, `AddMachine.jsx`, `AddBranch.jsx`, `dateTime.js`, `TimePicker.jsx`, `StateFormModal.jsx`, `AddProductionSchedule.jsx`, `BranchList.jsx`, `Login.jsx`, `AddPart.jsx`, `AddCustomer.jsx`, `machines.js`, `useAuth`, `LicenceKeyGenerator.jsx`, `package.json`, `AuthProvider.jsx`, `ControllerFormModal.jsx`, `toast.js`, `useTableSort`, `react-router-dom`, `ControllerList.jsx`, `ProtectedRoute`, `ShiftFormModal.jsx`, `ModelFormModal.jsx`, `apiClient.js`, `UserGuide.jsx`, `CellList.jsx`, `useLoad`, `newestFirst`, `ProductionScheduleList.jsx`, `FieldLabel`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **Should `BarLineChart.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11586538461538462 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Review Screens (Overview, Cockpit, Live Screen, Tools & Health, Reliability & Energy, Quality, AI Insights, Customer Care, Setup)` and `Production Schedule (Single/Multiple Day jobs)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._