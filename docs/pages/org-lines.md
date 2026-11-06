# Lines

- **Route:** `/organization/lines` · **Component:** [OrgLevelList.jsx](../../src/pages/Organization/OrgLevelList.jsx) (`level="line"`, config in [orgLevels.js](../../src/pages/Organization/orgLevels.js)) · **Auth:** protected (every logged-in role) · **Guard/Layout:** `ProtectedRoute` (session) + role guard · `MainLayout`
- **Purpose:** Organization level 6: lines of a shop.
- **Navigation:** Sidebar › Masters › Organization → **Line** tab ([OrganizationPage.jsx](../../src/pages/Organization/OrganizationPage.jsx): page header + tabs, this list is the tab body; the tab is the route)

## On page load

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Page as OrgLevelList.jsx
  participant userLineService
  participant userShopService
  participant API as Go router (/api/v1)
  participant UserLineHandler
  participant UserShopHandler
  participant UserLineService
  participant UserShopService
  participant UserLineRepository
  participant UserShopRepository
  participant DB as PostgreSQL
  User->>Page: opens page
  Page->>userLineService: getUserLines()
  userLineService->>API: GET /api/v1/user-line
  API->>UserLineHandler: GetAll()
  UserLineHandler->>UserLineService: GetAll()
  UserLineService->>UserLineRepository: FindAll()
  UserLineRepository->>DB: user_line, user_shop
  DB-->>UserLineRepository: rows
  UserLineService-->>UserLineHandler: result
  UserLineHandler-->>Page: 200 JSON envelope
  Page->>userShopService: getUserShops()
  userShopService->>API: GET /api/v1/user-shop
  API->>UserShopHandler: GetAll()
  UserShopHandler->>UserShopService: GetAll()
  UserShopService->>UserShopRepository: FindAll()
  UserShopRepository->>DB: user_shop, user_location
  DB-->>UserShopRepository: rows
  UserShopService-->>UserShopHandler: result
  UserShopHandler-->>Page: 200 JSON envelope
  Page-->>User: updates the screen
```

**Steps**

1. [OrgLevelList.jsx](../../src/pages/Organization/OrgLevelList.jsx) → useEffect(): runs on load `getUserLines()`
2. [userLineService.js](../../src/services/userLineService.js) → getUserLines(): calls `GET /api/v1/user-line`
3. [user_line_routes.go](../../../7th-sense-server/internal/routes/user_line_routes.go) → `GET /v1/user-line` → UserLineHandler.GetAll
4. [user_line_handler.go](../../../7th-sense-server/internal/handler/user_line_handler.go) → GetAll(): query userShopId, userId; calls the service
5. [user_line_service.go](../../../7th-sense-server/internal/service/user_line_service.go) → GetAll(): Returns the user's lines. A non-nil userShopID keeps only that shop's lines.
6. [user_line_repository.go](../../../7th-sense-server/internal/repository/user_line_repository.go) → FindAll(): reads / writes `user_line`, `user_shop`
7. [OrgLevelList.jsx](../../src/pages/Organization/OrgLevelList.jsx) → useEffect(): runs on load `getUserShops()`
8. [userShopService.js](../../src/services/userShopService.js) → getUserShops(): calls `GET /api/v1/user-shop`
9. [user_shop_routes.go](../../../7th-sense-server/internal/routes/user_shop_routes.go) → `GET /v1/user-shop` → UserShopHandler.GetAll
10. [user_shop_handler.go](../../../7th-sense-server/internal/handler/user_shop_handler.go) → GetAll(): query userLocationId, userId; calls the service
11. [user_shop_service.go](../../../7th-sense-server/internal/service/user_shop_service.go) → GetAll(): Returns the user's shops. A non-nil userLocationID keeps only that location's shops.
12. [user_shop_repository.go](../../../7th-sense-server/internal/repository/user_shop_repository.go) → FindAll(): reads / writes `user_shop`, `user_location`

## Delete user line

**Sequence diagram**

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Page as OrgLevelList.jsx
  participant userLineService
  participant API as Go router (/api/v1)
  participant UserLineHandler
  participant UserLineService
  participant UserLineRepository
  participant DB as PostgreSQL
  User->>Page: acts on page
  Page->>userLineService: deleteUserLine()
  userLineService->>API: DELETE /api/v1/user-line/{id}
  API->>UserLineHandler: Delete() [role check]
  UserLineHandler->>UserLineService: Delete()
  UserLineService->>UserLineRepository: HasCells()
  UserLineRepository->>DB: user_cell
  DB-->>UserLineRepository: rows
  UserLineService->>UserLineRepository: Delete()
  UserLineRepository->>DB: user_line
  DB-->>UserLineRepository: rows
  UserLineService-->>UserLineHandler: result
  UserLineHandler-->>Page: 200 JSON envelope
  Page-->>User: updates the screen
```

**Steps**

1. [OrgLevelList.jsx](../../src/pages/Organization/OrgLevelList.jsx) → confirmDelete(): runs `deleteUserLine()`
2. [userLineService.js](../../src/services/userLineService.js) → deleteUserLine(): calls `DELETE /api/v1/user-line/{id}`
3. [user_line_routes.go](../../../7th-sense-server/internal/routes/user_line_routes.go) → `DELETE /v1/user-line/{id}` (managersOnly: superadmin, customer, admin) → UserLineHandler.Delete
4. [user_line_handler.go](../../../7th-sense-server/internal/handler/user_line_handler.go) → Delete(): reads {id}; query userId; calls the service
5. [user_line_service.go](../../../7th-sense-server/internal/service/user_line_service.go) → Delete(): Soft-deletes the line. A line that still has cells is kept: its cells must be deleted first.
6. [user_line_repository.go](../../../7th-sense-server/internal/repository/user_line_repository.go) → HasCells(): reads / writes `user_cell`
7. [user_line_repository.go](../../../7th-sense-server/internal/repository/user_line_repository.go) → Delete(): reads / writes `user_line`

**Rules & edge cases**

- Only superadmin, customer and admin may do this (server `managersOnly`, others 403); the page hides the controls for other roles.

## Save user line (add / edit form)

**Sequence diagram**

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Page as OrgLevelList.jsx
  participant userLineService
  participant API as Go router (/api/v1)
  participant UserLineHandler
  participant UserLineService
  participant UserLineRepository
  participant DB as PostgreSQL
  User->>Page: acts on page
  Page->>userLineService: createUserLine()
  userLineService->>API: POST /api/v1/user-line
  API->>UserLineHandler: Create() [role check]
  UserLineHandler->>UserLineService: Create()
  UserLineService->>UserLineRepository: Create()
  UserLineRepository->>DB: user_line, user_shop
  DB-->>UserLineRepository: rows
  UserLineService-->>UserLineHandler: result
  UserLineHandler-->>Page: 201 JSON envelope
  Page->>userLineService: updateUserLine()
  userLineService->>API: PUT /api/v1/user-line/{id}
  API->>UserLineHandler: Update() [role check]
  UserLineHandler->>UserLineService: Update()
  UserLineService->>UserLineRepository: Update()
  UserLineRepository->>DB: user_line, user_shop
  DB-->>UserLineRepository: rows
  UserLineService-->>UserLineHandler: result
  UserLineHandler-->>Page: 200 JSON envelope
  Page-->>User: updates the screen
```

**Steps**

1. [OrgLevelFormModal.jsx](../../src/pages/Organization/OrgLevelFormModal.jsx) → onSubmit(): runs `createUserLine()`
2. [userLineService.js](../../src/services/userLineService.js) → createUserLine(): calls `POST /api/v1/user-line`
3. [user_line_routes.go](../../../7th-sense-server/internal/routes/user_line_routes.go) → `POST /v1/user-line` (managersOnly: superadmin, customer, admin) → UserLineHandler.Create
4. [user_line_handler.go](../../../7th-sense-server/internal/handler/user_line_handler.go) → Create(): query userId; decodes `dto.CreateUserLineRequest` and runs its Validate(); calls the service
5. [user_line_service.go](../../../7th-sense-server/internal/service/user_line_service.go) → Create(): Adds a line for userID under one of the user's shops.
6. [user_line_repository.go](../../../7th-sense-server/internal/repository/user_line_repository.go) → Create(): reads / writes `user_line`, `user_shop`
7. [OrgLevelFormModal.jsx](../../src/pages/Organization/OrgLevelFormModal.jsx) → onSubmit(): runs `updateUserLine()`
8. [userLineService.js](../../src/services/userLineService.js) → updateUserLine(): calls `PUT /api/v1/user-line/{id}`
9. [user_line_routes.go](../../../7th-sense-server/internal/routes/user_line_routes.go) → `PUT /v1/user-line/{id}` (managersOnly: superadmin, customer, admin) → UserLineHandler.Update
10. [user_line_handler.go](../../../7th-sense-server/internal/handler/user_line_handler.go) → Update(): reads {id}; query userId; decodes `dto.UpdateUserLineRequest` and runs its Validate(); calls the service
11. [user_line_service.go](../../../7th-sense-server/internal/service/user_line_service.go) → Update(): Renames the line and moves it under another of the user's shops.
12. [user_line_repository.go](../../../7th-sense-server/internal/repository/user_line_repository.go) → Update(): reads / writes `user_line`, `user_shop`

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
| DELETE | `/api/v1/user-line/{id}` | Delete user line | [Swagger](http://localhost:8080/api-docs/index.html#/Organization/deleteUserLine) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| GET | `/api/v1/user-line` | On page load | [Swagger](http://localhost:8080/api-docs/index.html#/Organization/getUserLines) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| GET | `/api/v1/user-shop` | On page load | [Swagger](http://localhost:8080/api-docs/index.html#/Organization/getUserShops) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| POST | `/api/v1/user-line` | Save user line (add / edit form) | [Swagger](http://localhost:8080/api-docs/index.html#/Organization/createUserLine) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| PUT | `/api/v1/user-line/{id}` | Save user line (add / edit form) | [Swagger](http://localhost:8080/api-docs/index.html#/Organization/updateUserLine) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |

## State & storage

- `useOrgUser()` (may edit, customer label)
- Local component state (`useState`) for filters, form and modal

## Shared components used

[ConfirmModal.jsx](../../src/components/common/ConfirmModal.jsx), [Loader.jsx](../../src/components/common/Loader.jsx), [TablePagination.jsx](../../src/components/common/TablePagination.jsx), [SortableHead.jsx](../../src/components/common/SortableHead.jsx), [IconAction.jsx](../../src/components/common/IconAction.jsx), [OrgCustomerField.jsx](../../src/components/common/OrgCustomerField.jsx)

## Decisions

- [Client ADR index](../adr/README.md)
