# Page flows

One file per page (or per component that serves several routes), end to end: UI → client service → API route → handler → service → repository → DB.
How to open these docs, Swagger UI and Postman: [../README.md](../README.md).
API request / response schemas live in the server API docs: [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) · Swagger UI at `http://localhost:8080/api-docs/` (server with `API_DOCS=true`).

**Roles:** *managers* = superadmin, customer, admin. *every logged-in role* = any authenticated user (the server still limits data to their company / machines).

## Public

| Page | Route | Auth required | Roles | Flow doc |
|---|---|---|---|---|
| Login | `/login` | No | public | [login.md](login.md) |

## Shared

| Page | Route | Auth required | Roles | Flow doc |
|---|---|---|---|---|
| App shell (session, logout, theme) | `every protected route` | Yes | every logged-in role | [app-shell.md](app-shell.md) |

## Dashboard

| Page | Route | Auth required | Roles | Flow doc |
|---|---|---|---|---|
| Home | `/` | Yes | every logged-in role | [home.md](home.md) |

## Operations

| Page | Route | Auth required | Roles | Flow doc |
|---|---|---|---|---|
| All machines | `/machines` | Yes | every logged-in role | [machine-list.md](machine-list.md) |
| Add / edit machine | `/machines/add` · `/machines/:id/edit` | Yes | managers | [machine-form.md](machine-form.md) |
| Production schedules | `/production/schedule` | Yes | every logged-in role | [production-schedule-list.md](production-schedule-list.md) |
| Add / edit production schedule | `/production/schedule/add` · `/production/schedule/:id/edit` | Yes | managers | [production-schedule-form.md](production-schedule-form.md) |

## Operations › Monitoring

One page, [MonitoringPage.jsx](../../src/pages/Monitoring/MonitoringPage.jsx): a tab per screen (`constants/monitoring.js`), each tab its own route below; the Productivity / Health tabs keep `?machineId`. Sidebar: one Monitoring item (opens the Machines tab). See [ADR 0012](../adr/0012-monitoring-tabbed-page.md), [ADR 0013](../adr/0013-monitoring-machine-list.md).

| Page | Route | Auth required | Roles | Flow doc |
|---|---|---|---|---|
| Machines (tab) | `/monitoring` | Yes | every logged-in role | [monitoring-machines.md](monitoring-machines.md) |
| Productivity (tab) | `/monitoring/productivity` | Yes | every logged-in role | [productivity.md](productivity.md) |
| Machine health (tab) | `/monitoring/health` | Yes | every logged-in role | [machine-health.md](machine-health.md) |

## Masters

| Page | Route | Auth required | Roles | Flow doc |
|---|---|---|---|---|
| Add / edit branch | `/masters/branches/add` · `/masters/branches/:id/edit` | Yes | superadmin | [branch-form.md](branch-form.md) |
| Clientele | `/masters/clienteles` | Yes | every logged-in role | [clientele-list.md](clientele-list.md) |
| Parts | `/masters/parts` | Yes | every logged-in role | [part-list.md](part-list.md) |
| Add / edit part | `/masters/parts/add` · `/masters/parts/:id/edit` | Yes | managers | [part-form.md](part-form.md) |

## Masters › Shift

| Page | Route | Auth required | Roles | Flow doc |
|---|---|---|---|---|
| Shifts | `/masters/shifts` | Yes | every logged-in role | [shifts.md](shifts.md) |
| Breaks | `/masters/breaks` | Yes | every logged-in role | [breaks.md](breaks.md) |
| Holidays / week off | `/masters/holidays` | Yes | every logged-in role | [holidays.md](holidays.md) |

## Masters › Downtime

| Page | Route | Auth required | Roles | Flow doc |
|---|---|---|---|---|
| Downtime / idle reasons | `/masters/downtime-reasons` · `/masters/idle-reasons` | Yes | every logged-in role | [downtime-idle-reasons.md](downtime-idle-reasons.md) |

## Masters › Organization

One page, [OrganizationPage.jsx](../../src/pages/Organization/OrganizationPage.jsx): a tab per level (`constants/organization.js`), each tab its own route below (sidebar: one Organization item). See [ADR 0010](../adr/0010-organization-tabbed-page.md).

| Page | Route | Auth required | Roles | Flow doc |
|---|---|---|---|---|
| Countries | `/organization/countries` | Yes | every logged-in role | [org-countries.md](org-countries.md) |
| States | `/organization/states` | Yes | every logged-in role | [org-states.md](org-states.md) |
| Cities | `/organization/cities` | Yes | every logged-in role | [org-cities.md](org-cities.md) |
| Branches (tab) | `/masters/branches` | Yes | every logged-in role | [branch-list.md](branch-list.md) |
| Locations | `/organization/locations` | Yes | every logged-in role | [org-locations.md](org-locations.md) |
| Shops | `/organization/shops` | Yes | every logged-in role | [org-shops.md](org-shops.md) |
| Lines | `/organization/lines` | Yes | every logged-in role | [org-lines.md](org-lines.md) |
| Cells | `/organization/cells` | Yes | every logged-in role | [org-cells.md](org-cells.md) |
| Supervisors | `/organization/supervisors` | Yes | every logged-in role | [org-supervisors.md](org-supervisors.md) |

## Masters › Users

| Page | Route | Auth required | Roles | Flow doc |
|---|---|---|---|---|
| Users list | `/masters/users` | Yes | managers | [customer-user-list.md](customer-user-list.md) |
| Add / edit user | `/masters/users/add` · `/masters/users/:id/edit` | Yes | managers | [customer-user-form.md](customer-user-form.md) |
| User detail | `/masters/users/:id` | Yes | managers | [customer-user-detail.md](customer-user-detail.md) |

## System › Account Center

One page, [AccountCenterPage.jsx](../../src/pages/AccountCenter/AccountCenterPage.jsx): a tab per screen (`constants/accountCenter.js`, only the tabs the role may open), each tab its own route below; Machine Catalog has Controllers / Models pills. Sidebar: one Account Center item, superadmin only ([ADR 0016](../adr/0016-account-center-superadmin-only.md); `/account-center` opens the Customer tab). See [ADR 0011](../adr/0011-business-setup-tabbed-page.md), [ADR 0014](../adr/0014-account-center.md) (formerly Business Setup) and [ADR 0015](../adr/0015-clientele-masters-page.md) (Clientele moved to Masters).

| Page | Route | Auth required | Roles | Flow doc |
|---|---|---|---|---|
| Account Center (redirect) | `/account-center` | Yes | superadmin | this section |
| Customers (tab) | `/masters/customers` | Yes | superadmin | [customer-user-list.md](customer-user-list.md) |
| Add / edit customer | `/masters/customers/add` · `/masters/customers/:id/edit` | Yes | superadmin | [customer-user-form.md](customer-user-form.md) |
| Customer detail | `/masters/customers/:id` | Yes | superadmin | [customer-user-detail.md](customer-user-detail.md) |
| Licence keys (tab) | `/masters/licence-keys` | Yes | superadmin | [licence-keys.md](licence-keys.md) |
| Controllers (Machine Catalog tab) | `/masters/controllers` | Yes | superadmin | [controllers.md](controllers.md) |
| Machine models (Machine Catalog tab) | `/masters/models` | Yes | superadmin | [models.md](models.md) |

## System

| Page | Route | Auth required | Roles | Flow doc |
|---|---|---|---|---|
| About | `/about` | Yes | every logged-in role | [about.md](about.md) |
| Theme showcase | `/theme` | Yes | every logged-in role | [theme.md](theme.md) |
| User guide | `/user-guide` | Yes | every logged-in role | [user-guide.md](user-guide.md) |

## Other

| Page | Route | Auth required | Roles | Flow doc |
|---|---|---|---|---|
| Coming soon | unbuilt sidebar links | Yes | the link's roles | [coming-soon.md](coming-soon.md) |
| Not found / Forbidden | `*` | Yes | every logged-in role | [not-found.md](not-found.md) |

Modals (form dialogs such as `ShiftFormModal`, `ClienteleFormModal`, the organization `*FormModal`s, `LicenceKeyGenerator`) are documented inside the page that opens them, under "Save … (add / edit form)".
