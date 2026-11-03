# Production schedules

- **Route:** `/production/schedule` · **Component:** [ProductionScheduleList.jsx](../../src/pages/ProductionSchedules/ProductionScheduleList.jsx) · **Auth:** protected (every logged-in role) · **Guard/Layout:** `ProtectedRoute` (session) + role guard · `MainLayout`
- **Purpose:** Lists production schedules; managers add, edit and delete.
- **Navigation:** Sidebar › Operations → Production Schedule → Add / Edit

## On page load

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Page as ProductionScheduleList.jsx
  participant productionScheduleService
  participant API as Go router (/api/v1)
  participant ProductionScheduleHandler
  participant ProductionScheduleService
  participant ProductionScheduleRepository
  participant DB as PostgreSQL
  User->>Page: opens page
  Page->>productionScheduleService: getProductionSchedules()
  productionScheduleService->>API: GET /api/v1/production-schedules
  API->>ProductionScheduleHandler: GetAll()
  ProductionScheduleHandler->>ProductionScheduleService: GetAll()
  ProductionScheduleService->>ProductionScheduleRepository: FindAll()
  ProductionScheduleRepository->>DB: production_schedules, users, machines
  DB-->>ProductionScheduleRepository: rows
  ProductionScheduleService-->>ProductionScheduleHandler: result
  ProductionScheduleHandler-->>Page: 200 JSON envelope
  Page-->>User: updates the screen
```

**Steps**

1. [ProductionScheduleList.jsx](../../src/pages/ProductionSchedules/ProductionScheduleList.jsx) → useEffect(): runs on load `getProductionSchedules()`
2. [productionScheduleService.js](../../src/services/productionScheduleService.js) → getProductionSchedules(): calls `GET /api/v1/production-schedules`
3. [production_schedule_routes.go](../../../7th-sense-server/internal/routes/production_schedule_routes.go) → `GET /v1/production-schedules` → ProductionScheduleHandler.GetAll
4. [production_schedule_handler.go](../../../7th-sense-server/internal/handler/production_schedule_handler.go) → GetAll(): query userId; calls the service
5. [production_schedule_service.go](../../../7th-sense-server/internal/service/production_schedule_service.go) → GetAll(): Returns the schedules the user may read (see companyOwner), without their items. A non-nil customerID keeps only that customer's schedules.
6. [production_schedule_repository.go](../../../7th-sense-server/internal/repository/production_schedule_repository.go) → FindAll(): reads / writes `production_schedules`, `users`, `machines`, `company_profiles`

## Delete production schedule

**Sequence diagram**

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Page as ProductionScheduleList.jsx
  participant productionScheduleService
  participant API as Go router (/api/v1)
  participant ProductionScheduleHandler
  participant ProductionScheduleService
  participant ProductionScheduleRepository
  participant DB as PostgreSQL
  User->>Page: acts on page
  Page->>productionScheduleService: deleteProductionSchedule()
  productionScheduleService->>API: DELETE /api/v1/production-schedules/{id}
  API->>ProductionScheduleHandler: Delete() [role check]
  ProductionScheduleHandler->>ProductionScheduleService: Delete()
  ProductionScheduleService->>ProductionScheduleRepository: Delete()
  ProductionScheduleRepository->>DB: production_schedules
  DB-->>ProductionScheduleRepository: rows
  ProductionScheduleService-->>ProductionScheduleHandler: result
  ProductionScheduleHandler-->>Page: 200 JSON envelope
  Page-->>User: updates the screen
```

**Steps**

1. [ProductionScheduleList.jsx](../../src/pages/ProductionSchedules/ProductionScheduleList.jsx) → confirmDelete(): runs `deleteProductionSchedule()`
2. [productionScheduleService.js](../../src/services/productionScheduleService.js) → deleteProductionSchedule(): calls `DELETE /api/v1/production-schedules/{id}`
3. [production_schedule_routes.go](../../../7th-sense-server/internal/routes/production_schedule_routes.go) → `DELETE /v1/production-schedules/{id}` (managersOnly: superadmin, customer, admin) → ProductionScheduleHandler.Delete
4. [production_schedule_handler.go](../../../7th-sense-server/internal/handler/production_schedule_handler.go) → Delete(): reads {id}; calls the service
5. [production_schedule_service.go](../../../7th-sense-server/internal/service/production_schedule_service.go) → Delete(): Soft-deletes the schedule. A customer or admin (the logged-in user) deletes only their company's schedules ("Production schedule not found" for others).
6. [production_schedule_repository.go](../../../7th-sense-server/internal/repository/production_schedule_repository.go) → Delete(): reads / writes `production_schedules`

**Rules & edge cases**

- Only superadmin, customer and admin may do this (server `managersOnly`, others 403); the page hides the controls for other roles.

## UI states

- **Loading:** `<Loader>` while the request runs.
- **Error:** a red `<Alert>` with the server message (some pages add Retry).
- **Success / failure of an action:** toast message (`utils/toast.js`).
- **Empty:** an empty-state message instead of the table / chart.
- **Delete:** asks for confirmation first.

## API calls on this page

| Method | Endpoint | Triggered by (section) | API docs |
|---|---|---|---|
| DELETE | `/api/v1/production-schedules/{id}` | Delete production schedule | [Swagger](http://localhost:8080/api-docs/index.html#/Production%20schedules/deleteProductionSchedule) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| GET | `/api/v1/production-schedules` | On page load | [Swagger](http://localhost:8080/api-docs/index.html#/Production%20schedules/getProductionSchedules) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |

## State & storage

- `useAuth()` (logged-in user, roles)
- Local component state (`useState`) for filters, form and modal

## Shared components used

[ConfirmModal.jsx](../../src/components/common/ConfirmModal.jsx), [Loader.jsx](../../src/components/common/Loader.jsx), [TablePagination.jsx](../../src/components/common/TablePagination.jsx), [SortableHead.jsx](../../src/components/common/SortableHead.jsx), [IconAction.jsx](../../src/components/common/IconAction.jsx), [StatusBadge.jsx](../../src/components/common/StatusBadge.jsx)

## Decisions

- [Client ADR index](../adr/README.md)
