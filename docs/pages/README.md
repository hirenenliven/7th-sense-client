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
| Machine health | `/machines/health` | Yes | every logged-in role | [machine-health.md](machine-health.md) |
| Productivity | `/machines/productivity` | Yes | every logged-in role | [productivity.md](productivity.md) |
| Production schedules | `/production/schedule` | Yes | every logged-in role | [production-schedule-list.md](production-schedule-list.md) |
| Add / edit production schedule | `/production/schedule/add` · `/production/schedule/:id/edit` | Yes | managers | [production-schedule-form.md](production-schedule-form.md) |

## Masters

| Page | Route | Auth required | Roles | Flow doc |
|---|---|---|---|---|
| Branches | `/masters/branches` | Yes | every logged-in role | [branch-list.md](branch-list.md) |
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

| Page | Route | Auth required | Roles | Flow doc |
|---|---|---|---|---|
| Countries | `/organization/countries` | Yes | every logged-in role | [org-countries.md](org-countries.md) |
| States | `/organization/states` | Yes | every logged-in role | [org-states.md](org-states.md) |
| Cities | `/organization/cities` | Yes | every logged-in role | [org-cities.md](org-cities.md) |
| Locations | `/organization/locations` | Yes | every logged-in role | [org-locations.md](org-locations.md) |
| Shops | `/organization/shops` | Yes | every logged-in role | [org-shops.md](org-shops.md) |
| Lines | `/organization/lines` | Yes | every logged-in role | [org-lines.md](org-lines.md) |
| Cells | `/organization/cells` | Yes | every logged-in role | [org-cells.md](org-cells.md) |
| Supervisors | `/organization/supervisors` | Yes | every logged-in role | [org-supervisors.md](org-supervisors.md) |

## Admin

| Page | Route | Auth required | Roles | Flow doc |
|---|---|---|---|---|
| Licence keys | `/masters/licence-keys` | Yes | managers | [licence-keys.md](licence-keys.md) |

## Admin › Accounts

| Page | Route | Auth required | Roles | Flow doc |
|---|---|---|---|---|
| Customers / Users list | `/masters/customers` · `/masters/users` | Yes | superadmin; managers | [customer-user-list.md](customer-user-list.md) |
| Add / edit customer or user | `/masters/customers/add` · `/masters/customers/:id/edit` · `/masters/users/add` · `/masters/users/:id/edit` | Yes | superadmin; managers | [customer-user-form.md](customer-user-form.md) |
| Customer / user detail | `/masters/customers/:id` · `/masters/users/:id` | Yes | superadmin; managers | [customer-user-detail.md](customer-user-detail.md) |

## Admin › Machine catalog

| Page | Route | Auth required | Roles | Flow doc |
|---|---|---|---|---|
| Controllers | `/masters/controllers` | Yes | superadmin | [controllers.md](controllers.md) |
| Machine models | `/masters/models` | Yes | superadmin | [models.md](models.md) |

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
