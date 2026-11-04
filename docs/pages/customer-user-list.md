# Customers / Users list

- **Route:** `/masters/customers` · `/masters/users` (kind `user`) · **Component:** [CustomerList.jsx](../../src/pages/Customers/CustomerList.jsx) · **Auth:** protected (superadmin; superadmin, customer, admin) · **Guard/Layout:** `ProtectedRoute` (session) + role guard · `MainLayout`
- **Purpose:** Lists customers (superadmin) or the users of a company (managers); search, open, edit or delete one.
- **Navigation:** customers: Sidebar › System › Account Center → **Customer** tab ([AccountCenterPage.jsx](../../src/pages/AccountCenter/AccountCenterPage.jsx): page header + tabs (only the ones the role may open), this screen is the tab body; the tab is the route) → Add / View / Edit; users: Sidebar › Masters › Users → list → Add / View / Edit

## On page load

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Page as CustomerList.jsx
  participant customerService
  participant API as Go router (/api/v1)
  participant UserHandler
  participant UserService
  User->>Page: opens page
  Page->>customerService: getUserById()
  customerService->>API: GET /api/v1/users/{id}
  API->>UserHandler: GetByID() [role check]
  UserHandler->>UserService: GetByID()
  UserService-->>UserHandler: result
  UserHandler-->>Page: 200 JSON envelope
  Page->>customerService: getUsers()
  customerService->>API: GET /api/v1/users
  API->>UserHandler: GetAll() [role check]
  UserHandler->>UserService: GetAll()
  UserService-->>UserHandler: result
  UserHandler-->>Page: 200 JSON envelope
  Page->>customerService: getCurrentUser()
  customerService->>API: GET /api/v1/me
  API->>UserHandler: Me()
  UserHandler->>UserService: GetCurrent()
  UserService-->>UserHandler: result
  UserHandler-->>Page: 200 JSON envelope
  Page-->>User: updates the screen
```

**Steps**

1. [CustomerList.jsx](../../src/pages/Customers/CustomerList.jsx) → setStatusBusy(): runs `getUserById()`
2. [customerService.js](../../src/services/customerService.js) → getUserById(): calls `GET /api/v1/users/{id}`
3. [user_routes.go](../../../7th-sense-server/internal/routes/user_routes.go) → `GET /v1/users/{id}` (managersOnly: superadmin, customer, admin) → UserHandler.GetByID
4. [user_handler.go](../../../7th-sense-server/internal/handler/user_handler.go) → GetByID(): reads {id}; calls the service
5. [user_service.go](../../../7th-sense-server/internal/service/user_service.go) → GetByID(): Returns user id with its details, or "User not found" when the user may not see it.
6. [CustomerList.jsx](../../src/pages/Customers/CustomerList.jsx) → useEffect(): runs on load `getUsers()`
7. [customerService.js](../../src/services/customerService.js) → getUsers(): calls `GET /api/v1/users`
8. [user_routes.go](../../../7th-sense-server/internal/routes/user_routes.go) → `GET /v1/users` (managersOnly: superadmin, customer, admin) → UserHandler.GetAll
9. [user_handler.go](../../../7th-sense-server/internal/handler/user_handler.go) → GetAll(): query companyId, filterRole; calls the service
10. [user_service.go](../../../7th-sense-server/internal/service/user_service.go) → GetAll(): Returns the users the user may see, narrowed by filter: every user for the superadmin, the company's members for a customer or admin. A customer or admin asking for another company gets Forbidden.
11. [theme.js](../../src/utils/theme.js) → refreshUserTheme(): runs `getCurrentUser()`
12. [customerService.js](../../src/services/customerService.js) → getCurrentUser(): calls `GET /api/v1/me`
13. [user_routes.go](../../../7th-sense-server/internal/routes/user_routes.go) → `GET /v1/me` → UserHandler.Me
14. [user_handler.go](../../../7th-sense-server/internal/handler/user_handler.go) → Me(): reads the logged-in user; calls the service
15. [user_service.go](../../../7th-sense-server/internal/service/user_service.go) → GetCurrent(): Returns the logged-in user (userID) with its details.

## Delete user

**Sequence diagram**

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Page as CustomerList.jsx
  participant customerService
  participant API as Go router (/api/v1)
  participant UserHandler
  participant UserService
  User->>Page: acts on page
  Page->>customerService: deleteUser()
  customerService->>API: DELETE /api/v1/users/{id}
  API->>UserHandler: Delete() [role check]
  UserHandler->>UserService: Delete()
  UserService-->>UserHandler: result
  UserHandler-->>Page: 200 JSON envelope
  Page-->>User: updates the screen
```

**Steps**

1. [CustomerList.jsx](../../src/pages/Customers/CustomerList.jsx) → confirmDelete(): runs `deleteUser()`
2. [customerService.js](../../src/services/customerService.js) → deleteUser(): calls `DELETE /api/v1/users/{id}`
3. [user_routes.go](../../../7th-sense-server/internal/routes/user_routes.go) → `DELETE /v1/users/{id}` (managersOnly: superadmin, customer, admin) → UserHandler.Delete
4. [user_handler.go](../../../7th-sense-server/internal/handler/user_handler.go) → Delete(): reads {id}; calls the service
5. [user_service.go](../../../7th-sense-server/internal/service/user_service.go) → Delete(): Soft-deletes the user with its profiles and addresses, and removes its machine access. the user must be allowed to manage the user.

**Rules & edge cases**

- Only superadmin, customer and admin may do this (server `managersOnly`, others 403); the page hides the controls for other roles.

## Save user (add / edit form)

**Sequence diagram**

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Page as CustomerList.jsx
  participant customerService
  participant API as Go router (/api/v1)
  participant UserHandler
  participant UserService
  User->>Page: acts on page
  Page->>customerService: updateUser()
  customerService->>API: PUT /api/v1/users/{id}
  API->>UserHandler: Update() [role check]
  UserHandler->>UserService: Update()
  UserService-->>UserHandler: result
  UserHandler-->>Page: 200 JSON envelope
  Page-->>User: updates the screen
```

**Steps**

1. [CustomerList.jsx](../../src/pages/Customers/CustomerList.jsx) → setStatusBusy(): runs `updateUser()`
2. [customerService.js](../../src/services/customerService.js) → updateUser(): calls `PUT /api/v1/users/{id}`
3. [user_routes.go](../../../7th-sense-server/internal/routes/user_routes.go) → `PUT /v1/users/{id}` (managersOnly: superadmin, customer, admin) → UserHandler.Update
4. [user_handler.go](../../../7th-sense-server/internal/handler/user_handler.go) → Update(): reads {id}; decodes `dto.UpdateUserRequest` and runs its Validate(); calls the service
5. [user_service.go](../../../7th-sense-server/internal/service/user_service.go) → Update(): Replaces the user and its customer details. Customer details the user does not have yet are created.

**Rules & edge cases**

- Only superadmin, customer and admin may do this (server `managersOnly`, others 403); the page hides the controls for other roles.
- Server validation (`dto.UpdateUserRequest.Validate`): Please enter valid status.

## Change theme

**Sequence diagram**

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Page as CustomerList.jsx
  participant customerService
  participant API as Go router (/api/v1)
  participant UserHandler
  participant UserService
  User->>Page: acts on page
  Page->>customerService: saveMyTheme()
  customerService->>API: PUT /api/v1/me/theme
  API->>UserHandler: UpdateTheme()
  UserHandler->>UserService: SaveTheme()
  UserService-->>UserHandler: result
  UserHandler-->>Page: 200 JSON envelope
  Page-->>User: updates the screen
```

**Steps**

1. [theme.js](../../src/utils/theme.js) → chooseTheme(): runs `saveMyTheme()`
2. [customerService.js](../../src/services/customerService.js) → saveMyTheme(): calls `PUT /api/v1/me/theme`
3. [user_routes.go](../../../7th-sense-server/internal/routes/user_routes.go) → `PUT /v1/me/theme` → UserHandler.UpdateTheme
4. [user_handler.go](../../../7th-sense-server/internal/handler/user_handler.go) → UpdateTheme(): decodes `dto.UpdateThemeRequest` and runs its Validate(); calls the service
5. [user_service.go](../../../7th-sense-server/internal/service/user_service.go) → SaveTheme(): Sets the UI theme of userID (the logged-in user).

**Rules & edge cases**

- Server validation (`dto.UpdateThemeRequest.Validate`): Please enter valid theme.

## UI states

- **Loading:** `<Loader>` while the request runs.
- **Error:** a red `<Alert>` with the server message (some pages add Retry).
- **Success / failure of an action:** toast message (`utils/toast.js`).
- **Empty:** an empty-state message instead of the table / chart.
- **Delete:** asks for confirmation first.

## API calls on this page

| Method | Endpoint | Triggered by (section) | API docs |
|---|---|---|---|
| DELETE | `/api/v1/users/{id}` | Delete user | [Swagger](http://localhost:8080/api-docs/index.html#/Users/deleteUser) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| GET | `/api/v1/users/{id}` | On page load | [Swagger](http://localhost:8080/api-docs/index.html#/Users/getUserById) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| GET | `/api/v1/users` | On page load | [Swagger](http://localhost:8080/api-docs/index.html#/Users/getUsers) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| PUT | `/api/v1/users/{id}` | Save user (add / edit form) | [Swagger](http://localhost:8080/api-docs/index.html#/Users/updateUser) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| GET | `/api/v1/me` | On page load | [Swagger](http://localhost:8080/api-docs/index.html#/Users/getCurrentUser) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| PUT | `/api/v1/me/theme` | Change theme | [Swagger](http://localhost:8080/api-docs/index.html#/Users/saveMyTheme) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |

## State & storage

- Local component state (`useState`) for filters, form and modal

## Shared components used

[ConfirmModal.jsx](../../src/components/common/ConfirmModal.jsx), [Loader.jsx](../../src/components/common/Loader.jsx), [TablePagination.jsx](../../src/components/common/TablePagination.jsx), [SortableHead.jsx](../../src/components/common/SortableHead.jsx), [IconAction.jsx](../../src/components/common/IconAction.jsx)

## Decisions

- [ADR 0011: tabbed page](../adr/0011-business-setup-tabbed-page.md), [ADR 0014: renamed Account Center](../adr/0014-account-center.md)
- [Client ADR index](../adr/README.md)
