# Cells

- **Route:** `/organization/cells` · **Component:** [CellList.jsx](../../src/pages/Organization/Cells/CellList.jsx) · **Auth:** protected (every logged-in role) · **Guard/Layout:** `ProtectedRoute` (session) + role guard · `MainLayout`
- **Purpose:** Organization level 7: cells of a line.
- **Navigation:** Sidebar › Masters › Organization → **Cell** tab ([OrganizationPage.jsx](../../src/pages/Organization/OrganizationPage.jsx): page header + tabs, this list is the tab body; the tab is the route)

## On page load

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Page as CellList.jsx
  participant userCellService
  participant userLineService
  participant API as Go router (/api/v1)
  participant UserCellHandler
  participant UserLineHandler
  participant UserCellService
  participant UserLineService
  participant UserCellRepository
  participant UserLineRepository
  participant DB as PostgreSQL
  User->>Page: opens page
  Page->>userCellService: getUserCells()
  userCellService->>API: GET /api/v1/user-cell
  API->>UserCellHandler: GetAll()
  UserCellHandler->>UserCellService: GetAll()
  UserCellService->>UserCellRepository: FindAll()
  UserCellRepository->>DB: user_cell, user_line
  DB-->>UserCellRepository: rows
  UserCellService-->>UserCellHandler: result
  UserCellHandler-->>Page: 200 JSON envelope
  Page->>userLineService: getUserLines()
  userLineService->>API: GET /api/v1/user-line
  API->>UserLineHandler: GetAll()
  UserLineHandler->>UserLineService: GetAll()
  UserLineService->>UserLineRepository: FindAll()
  UserLineRepository->>DB: user_line, user_shop
  DB-->>UserLineRepository: rows
  UserLineService-->>UserLineHandler: result
  UserLineHandler-->>Page: 200 JSON envelope
  Page-->>User: updates the screen
```

**Steps**

1. [CellList.jsx](../../src/pages/Organization/Cells/CellList.jsx) → useEffect(): runs on load `getUserCells()`
2. [userCellService.js](../../src/services/userCellService.js) → getUserCells(): calls `GET /api/v1/user-cell`
3. [user_cell_routes.go](../../../7th-sense-server/internal/routes/user_cell_routes.go) → `GET /v1/user-cell` → UserCellHandler.GetAll
4. [user_cell_handler.go](../../../7th-sense-server/internal/handler/user_cell_handler.go) → GetAll(): query userLineId, userId; calls the service
5. [user_cell_service.go](../../../7th-sense-server/internal/service/user_cell_service.go) → GetAll(): Returns the user's cells. A non-nil userLineID keeps only that line's cells.
6. [user_cell_repository.go](../../../7th-sense-server/internal/repository/user_cell_repository.go) → FindAll(): reads / writes `user_cell`, `user_line`
7. [CellList.jsx](../../src/pages/Organization/Cells/CellList.jsx) → useEffect(): runs on load `getUserLines()`
8. [userLineService.js](../../src/services/userLineService.js) → getUserLines(): calls `GET /api/v1/user-line`
9. [user_line_routes.go](../../../7th-sense-server/internal/routes/user_line_routes.go) → `GET /v1/user-line` → UserLineHandler.GetAll
10. [user_line_handler.go](../../../7th-sense-server/internal/handler/user_line_handler.go) → GetAll(): query userShopId, userId; calls the service
11. [user_line_service.go](../../../7th-sense-server/internal/service/user_line_service.go) → GetAll(): Returns the user's lines. A non-nil userShopID keeps only that shop's lines.
12. [user_line_repository.go](../../../7th-sense-server/internal/repository/user_line_repository.go) → FindAll(): reads / writes `user_line`, `user_shop`

## Delete user cell

**Sequence diagram**

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Page as CellList.jsx
  participant userCellService
  participant API as Go router (/api/v1)
  participant UserCellHandler
  participant UserCellService
  participant UserCellRepository
  participant DB as PostgreSQL
  User->>Page: acts on page
  Page->>userCellService: deleteUserCell()
  userCellService->>API: DELETE /api/v1/user-cell/{id}
  API->>UserCellHandler: Delete() [role check]
  UserCellHandler->>UserCellService: Delete()
  UserCellService->>UserCellRepository: HasSupervisors()
  UserCellRepository->>DB: user_supervisor
  DB-->>UserCellRepository: rows
  UserCellService->>UserCellRepository: Delete()
  UserCellRepository->>DB: user_cell
  DB-->>UserCellRepository: rows
  UserCellService-->>UserCellHandler: result
  UserCellHandler-->>Page: 200 JSON envelope
  Page-->>User: updates the screen
```

**Steps**

1. [CellList.jsx](../../src/pages/Organization/Cells/CellList.jsx) → confirmDelete(): runs `deleteUserCell()`
2. [userCellService.js](../../src/services/userCellService.js) → deleteUserCell(): calls `DELETE /api/v1/user-cell/{id}`
3. [user_cell_routes.go](../../../7th-sense-server/internal/routes/user_cell_routes.go) → `DELETE /v1/user-cell/{id}` (managersOnly: superadmin, customer, admin) → UserCellHandler.Delete
4. [user_cell_handler.go](../../../7th-sense-server/internal/handler/user_cell_handler.go) → Delete(): reads {id}; query userId; calls the service
5. [user_cell_service.go](../../../7th-sense-server/internal/service/user_cell_service.go) → Delete(): Soft-deletes the cell. A cell that still has supervisors is kept: its supervisors must be deleted first.
6. [user_cell_repository.go](../../../7th-sense-server/internal/repository/user_cell_repository.go) → HasSupervisors(): reads / writes `user_supervisor`
7. [user_cell_repository.go](../../../7th-sense-server/internal/repository/user_cell_repository.go) → Delete(): reads / writes `user_cell`

**Rules & edge cases**

- Only superadmin, customer and admin may do this (server `managersOnly`, others 403); the page hides the controls for other roles.

## Save user cell (add / edit form)

**Sequence diagram**

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Page as CellList.jsx
  participant userCellService
  participant API as Go router (/api/v1)
  participant UserCellHandler
  participant UserCellService
  participant UserCellRepository
  participant DB as PostgreSQL
  User->>Page: acts on page
  Page->>userCellService: createUserCell()
  userCellService->>API: POST /api/v1/user-cell
  API->>UserCellHandler: Create() [role check]
  UserCellHandler->>UserCellService: Create()
  UserCellService->>UserCellRepository: Create()
  UserCellRepository->>DB: user_cell, user_line
  DB-->>UserCellRepository: rows
  UserCellService-->>UserCellHandler: result
  UserCellHandler-->>Page: 201 JSON envelope
  Page->>userCellService: updateUserCell()
  userCellService->>API: PUT /api/v1/user-cell/{id}
  API->>UserCellHandler: Update() [role check]
  UserCellHandler->>UserCellService: Update()
  UserCellService->>UserCellRepository: Update()
  UserCellRepository->>DB: user_cell, user_line
  DB-->>UserCellRepository: rows
  UserCellService-->>UserCellHandler: result
  UserCellHandler-->>Page: 200 JSON envelope
  Page-->>User: updates the screen
```

**Steps**

1. [CellFormModal.jsx](../../src/pages/Organization/Cells/CellFormModal.jsx) → onSubmit(): runs `createUserCell()`
2. [userCellService.js](../../src/services/userCellService.js) → createUserCell(): calls `POST /api/v1/user-cell`
3. [user_cell_routes.go](../../../7th-sense-server/internal/routes/user_cell_routes.go) → `POST /v1/user-cell` (managersOnly: superadmin, customer, admin) → UserCellHandler.Create
4. [user_cell_handler.go](../../../7th-sense-server/internal/handler/user_cell_handler.go) → Create(): query userId; decodes `dto.CreateUserCellRequest` and runs its Validate(); calls the service
5. [user_cell_service.go](../../../7th-sense-server/internal/service/user_cell_service.go) → Create(): Adds a cell for userID under one of the user's lines.
6. [user_cell_repository.go](../../../7th-sense-server/internal/repository/user_cell_repository.go) → Create(): reads / writes `user_cell`, `user_line`
7. [CellFormModal.jsx](../../src/pages/Organization/Cells/CellFormModal.jsx) → onSubmit(): runs `updateUserCell()`
8. [userCellService.js](../../src/services/userCellService.js) → updateUserCell(): calls `PUT /api/v1/user-cell/{id}`
9. [user_cell_routes.go](../../../7th-sense-server/internal/routes/user_cell_routes.go) → `PUT /v1/user-cell/{id}` (managersOnly: superadmin, customer, admin) → UserCellHandler.Update
10. [user_cell_handler.go](../../../7th-sense-server/internal/handler/user_cell_handler.go) → Update(): reads {id}; query userId; decodes `dto.UpdateUserCellRequest` and runs its Validate(); calls the service
11. [user_cell_service.go](../../../7th-sense-server/internal/service/user_cell_service.go) → Update(): Renames the cell and moves it under another of the user's lines.
12. [user_cell_repository.go](../../../7th-sense-server/internal/repository/user_cell_repository.go) → Update(): reads / writes `user_cell`, `user_line`

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
| DELETE | `/api/v1/user-cell/{id}` | Delete user cell | [Swagger](http://localhost:8080/api-docs/index.html#/Organization/deleteUserCell) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| GET | `/api/v1/user-cell` | On page load | [Swagger](http://localhost:8080/api-docs/index.html#/Organization/getUserCells) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| GET | `/api/v1/user-line` | On page load | [Swagger](http://localhost:8080/api-docs/index.html#/Organization/getUserLines) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| POST | `/api/v1/user-cell` | Save user cell (add / edit form) | [Swagger](http://localhost:8080/api-docs/index.html#/Organization/createUserCell) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| PUT | `/api/v1/user-cell/{id}` | Save user cell (add / edit form) | [Swagger](http://localhost:8080/api-docs/index.html#/Organization/updateUserCell) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |

## State & storage

- `useOrgUser()` (organization user picked)
- Local component state (`useState`) for filters, form and modal

## Shared components used

[ConfirmModal.jsx](../../src/components/common/ConfirmModal.jsx), [Loader.jsx](../../src/components/common/Loader.jsx), [TablePagination.jsx](../../src/components/common/TablePagination.jsx), [SortableHead.jsx](../../src/components/common/SortableHead.jsx), [IconAction.jsx](../../src/components/common/IconAction.jsx), [OrgCustomerField.jsx](../../src/components/common/OrgCustomerField.jsx)

## Decisions

- [Client ADR index](../adr/README.md)
