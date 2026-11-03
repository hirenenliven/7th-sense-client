# Shifts

- **Route:** `/masters/shifts` · **Component:** [ShiftSetup.jsx](../../src/pages/Shifts/ShiftSetup.jsx) · **Auth:** protected (every logged-in role) · **Guard/Layout:** `ProtectedRoute` (session) + role guard · `MainLayout`
- **Purpose:** Shift setup: lists shifts with their breaks; managers add, edit and delete in a modal.
- **Navigation:** Sidebar › Masters › Shift → Add / Manage Shift

## On page load

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Page as ShiftSetup.jsx
  participant customerService
  participant shiftService
  participant breakService
  participant API as Go router (/api/v1)
  participant UserHandler
  participant ShiftHandler
  participant BreakHandler
  participant UserService
  participant ShiftService
  participant BreakService
  participant ShiftRepository
  participant BreakRepository
  participant DB as PostgreSQL
  User->>Page: opens page
  Page->>customerService: getUsers()
  customerService->>API: GET /api/v1/users
  API->>UserHandler: GetAll() [role check]
  UserHandler->>UserService: GetAll()
  UserService-->>UserHandler: result
  UserHandler-->>Page: 200 JSON envelope
  Page->>shiftService: getShifts()
  shiftService->>API: GET /api/v1/shifts
  API->>ShiftHandler: GetAll()
  ShiftHandler->>ShiftService: GetAll()
  ShiftService->>ShiftRepository: FindAll()
  ShiftRepository->>DB: shifts, users, company_profiles
  DB-->>ShiftRepository: rows
  ShiftService-->>ShiftHandler: result
  ShiftHandler-->>Page: 200 JSON envelope
  Page->>breakService: getBreaks()
  breakService->>API: GET /api/v1/breaks
  API->>BreakHandler: GetAll()
  BreakHandler->>BreakService: GetAll()
  BreakService->>BreakRepository: FindAll()
  BreakRepository->>DB: breaks, users, company_profiles
  DB-->>BreakRepository: rows
  BreakService-->>BreakHandler: result
  BreakHandler-->>Page: 200 JSON envelope
  Page-->>User: updates the screen
```

**Steps**

1. [ShiftSetup.jsx](../../src/pages/Shifts/ShiftSetup.jsx) → useEffect(): runs on load `getUsers()`
2. [customerService.js](../../src/services/customerService.js) → getUsers(): calls `GET /api/v1/users`
3. [user_routes.go](../../../7th-sense-server/internal/routes/user_routes.go) → `GET /v1/users` (managersOnly: superadmin, customer, admin) → UserHandler.GetAll
4. [user_handler.go](../../../7th-sense-server/internal/handler/user_handler.go) → GetAll(): query companyId, filterRole; calls the service
5. [user_service.go](../../../7th-sense-server/internal/service/user_service.go) → GetAll(): Returns the users the user may see, narrowed by filter: every user for the superadmin, the company's members for a customer or admin. A customer or admin asking for another company gets Forbidden.
6. [ShiftSetup.jsx](../../src/pages/Shifts/ShiftSetup.jsx) → useEffect(): runs on load `getShifts()`
7. [shiftService.js](../../src/services/shiftService.js) → getShifts(): calls `GET /api/v1/shifts`
8. [shift_routes.go](../../../7th-sense-server/internal/routes/shift_routes.go) → `GET /v1/shifts` → ShiftHandler.GetAll
9. [shift_handler.go](../../../7th-sense-server/internal/handler/shift_handler.go) → GetAll(): query userId; calls the service
10. [shift_service.go](../../../7th-sense-server/internal/service/shift_service.go) → GetAll(): Returns the shifts the user may read, each with its breaks. A non-nil customerID keeps only that customer's shifts.
11. [shift_repository.go](../../../7th-sense-server/internal/repository/shift_repository.go) → FindAll(): reads / writes `shifts`, `users`, `company_profiles`
12. [ShiftFormModal.jsx](../../src/pages/Shifts/ShiftFormModal.jsx) → useEffect(): runs on load `getBreaks()`
13. [breakService.js](../../src/services/breakService.js) → getBreaks(): calls `GET /api/v1/breaks`
14. [break_routes.go](../../../7th-sense-server/internal/routes/break_routes.go) → `GET /v1/breaks` → BreakHandler.GetAll
15. [break_handler.go](../../../7th-sense-server/internal/handler/break_handler.go) → GetAll(): query userId; calls the service
16. [break_service.go](../../../7th-sense-server/internal/service/break_service.go) → GetAll(): Returns the breaks the user may read. A non-nil customerID keeps only that customer's breaks.
17. [break_repository.go](../../../7th-sense-server/internal/repository/break_repository.go) → FindAll(): reads / writes `breaks`, `users`, `company_profiles`, `shifts`

## Delete shift

**Sequence diagram**

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Page as ShiftSetup.jsx
  participant shiftService
  participant API as Go router (/api/v1)
  participant ShiftHandler
  participant ShiftService
  User->>Page: acts on page
  Page->>shiftService: deleteShift()
  shiftService->>API: DELETE /api/v1/shifts/{id}
  API->>ShiftHandler: Delete() [role check]
  ShiftHandler->>ShiftService: Delete()
  ShiftService-->>ShiftHandler: result
  ShiftHandler-->>Page: 200 JSON envelope
  Page-->>User: updates the screen
```

**Steps**

1. [ShiftSetup.jsx](../../src/pages/Shifts/ShiftSetup.jsx) → confirmDelete(): runs `deleteShift()`
2. [shiftService.js](../../src/services/shiftService.js) → deleteShift(): calls `DELETE /api/v1/shifts/{id}`
3. [shift_routes.go](../../../7th-sense-server/internal/routes/shift_routes.go) → `DELETE /v1/shifts/{id}` (managersOnly: superadmin, customer, admin) → ShiftHandler.Delete
4. [shift_handler.go](../../../7th-sense-server/internal/handler/shift_handler.go) → Delete(): reads {id}; calls the service
5. [shift_service.go](../../../7th-sense-server/internal/service/shift_service.go) → Delete(): Soft-deletes the shift and releases its breaks (they stay in the customer's list without a shift). A customer or admin (the logged-in user) deletes only their company's shifts ("Shift not found" for others).

**Rules & edge cases**

- Only superadmin, customer and admin may do this (server `managersOnly`, others 403); the page hides the controls for other roles.

## Save shift (add / edit form)

**Sequence diagram**

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Page as ShiftSetup.jsx
  participant shiftService
  participant API as Go router (/api/v1)
  participant ShiftHandler
  participant ShiftService
  participant ShiftRepository
  participant DB as PostgreSQL
  User->>Page: acts on page
  Page->>shiftService: createShift()
  shiftService->>API: POST /api/v1/shifts
  API->>ShiftHandler: Create() [role check]
  ShiftHandler->>ShiftService: Create()
  ShiftService-->>ShiftHandler: result
  ShiftHandler-->>Page: 201 JSON envelope
  Page->>shiftService: updateShift()
  shiftService->>API: PUT /api/v1/shifts/{id}
  API->>ShiftHandler: Update() [role check]
  ShiftHandler->>ShiftService: Update()
  ShiftService->>ShiftRepository: FindByID()
  ShiftRepository->>DB: shifts, users, company_profiles
  DB-->>ShiftRepository: rows
  ShiftService-->>ShiftHandler: result
  ShiftHandler-->>Page: 200 JSON envelope
  Page-->>User: updates the screen
```

**Steps**

1. [ShiftFormModal.jsx](../../src/pages/Shifts/ShiftFormModal.jsx) → onSubmit(): runs `createShift()`
2. [shiftService.js](../../src/services/shiftService.js) → createShift(): calls `POST /api/v1/shifts`
3. [shift_routes.go](../../../7th-sense-server/internal/routes/shift_routes.go) → `POST /v1/shifts` (managersOnly: superadmin, customer, admin) → ShiftHandler.Create
4. [shift_handler.go](../../../7th-sense-server/internal/handler/shift_handler.go) → Create(): decodes `dto.CreateShiftRequest` and runs its Validate(); calls the service
5. [shift_service.go](../../../7th-sense-server/internal/service/shift_service.go) → Create(): Adds a shift with its breaks. A customer or admin (the logged-in user) adds it to their own company, whatever customer the request names; the superadmin to the customer named.
6. [ShiftFormModal.jsx](../../src/pages/Shifts/ShiftFormModal.jsx) → onSubmit(): runs `updateShift()`
7. [shiftService.js](../../src/services/shiftService.js) → updateShift(): calls `PUT /api/v1/shifts/{id}`
8. [shift_routes.go](../../../7th-sense-server/internal/routes/shift_routes.go) → `PUT /v1/shifts/{id}` (managersOnly: superadmin, customer, admin) → ShiftHandler.Update
9. [shift_handler.go](../../../7th-sense-server/internal/handler/shift_handler.go) → Update(): reads {id}; decodes `dto.UpdateShiftRequest` and runs its Validate(); calls the service
10. [shift_service.go](../../../7th-sense-server/internal/service/shift_service.go) → Update(): Replaces the shift and its breaks: breaks left out are released (no shift). A blank status keeps the saved one.
11. [shift_repository.go](../../../7th-sense-server/internal/repository/shift_repository.go) → FindByID(): reads / writes `shifts`, `users`, `company_profiles`

**Rules & edge cases**

- Only superadmin, customer and admin may do this (server `managersOnly`, others 403); the page hides the controls for other roles.
- Server validation (`dto.UpdateShiftRequest.Validate`): Please enter valid status.

## UI states

- **Loading:** `<Loader>` while the request runs.
- **Error:** a red `<Alert>` with the server message (some pages add Retry).
- **Success / failure of an action:** toast message (`utils/toast.js`).
- **Empty:** an empty-state message instead of the table / chart.
- **Delete:** asks for confirmation first.

## API calls on this page

| Method | Endpoint | Triggered by (section) | API docs |
|---|---|---|---|
| GET | `/api/v1/users` | On page load | [Swagger](http://localhost:8080/api-docs/index.html#/Users/getUsers) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| DELETE | `/api/v1/shifts/{id}` | Delete shift | [Swagger](http://localhost:8080/api-docs/index.html#/Shifts/deleteShift) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| GET | `/api/v1/shifts` | On page load | [Swagger](http://localhost:8080/api-docs/index.html#/Shifts/getShifts) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| GET | `/api/v1/breaks` | On page load | [Swagger](http://localhost:8080/api-docs/index.html#/Breaks/getBreaks) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| POST | `/api/v1/shifts` | Save shift (add / edit form) | [Swagger](http://localhost:8080/api-docs/index.html#/Shifts/createShift) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| PUT | `/api/v1/shifts/{id}` | Save shift (add / edit form) | [Swagger](http://localhost:8080/api-docs/index.html#/Shifts/updateShift) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |

## State & storage

- `useAuth()` (logged-in user, roles)
- Local component state (`useState`) for filters, form and modal

## Shared components used

[ConfirmModal.jsx](../../src/components/common/ConfirmModal.jsx), [Loader.jsx](../../src/components/common/Loader.jsx), [FieldLabel.jsx](../../src/components/common/FieldLabel.jsx), [IconAction.jsx](../../src/components/common/IconAction.jsx), [TimePicker.jsx](../../src/components/common/TimePicker.jsx), [StatusToggle.jsx](../../src/components/common/StatusToggle.jsx), [StatusBadge.jsx](../../src/components/common/StatusBadge.jsx)

## Decisions

- [Client ADR index](../adr/README.md)
