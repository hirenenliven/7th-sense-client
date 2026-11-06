# Machine diagnostics

- **Route:** `/machines/:id/diagnostics` · **Component:** [MachineDiagnostics.jsx](../../src/pages/MachineDiagnostics/MachineDiagnostics.jsx) · **Auth:** protected · **Roles:** superadmin only · **Guard/Layout:** `ProtectedRoute` (session) + role guard · `MainLayout`
- **Purpose:** When a customer reports a problem with a machine: check in order whether its data reaches the server and the screen, watch the variables you pick live, and see what is wrong and what to do.
- **Navigation:** Sidebar › Machines › [All Machines](machine-list.md) → a machine's **Check data** action (table and cards; superadmin only). **Machine list** goes back.

## On page load

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Page as MachineDiagnostics.jsx
  participant Service as machineDiagnosticsService
  participant Socket as useMachineLive
  participant API as Go router (/api/v1)
  participant Handler as MachineDiagnosticsHandler
  participant Diagnostics as MachineDiagnosticsService
  participant Repository as MachineDiagnosticsRepository
  participant DB as PostgreSQL
  participant Machine as Machine's IP : port
  User->>Page: Check data on a machine
  Page->>Service: getMachineDiagnostics(id), every 5 s
  Service->>API: GET /machines/{id}/diagnostics
  API->>Handler: GetDiagnostics() (superAdminOnly)
  Handler->>Diagnostics: GetDiagnostics()
  Diagnostics->>Repository: engine, live status, mode, variables, events
  Repository->>DB: machine_live_status, machine_mode_log, cnc_variables, machine_events
  Diagnostics-->>Page: machine, status, mode, checks, variables, events
  Page->>Service: checkMachineNetwork(id), once
  Service->>API: GET /machines/{id}/diagnostics/network
  API->>Handler: CheckNetwork() (superAdminOnly)
  Handler->>Diagnostics: CheckNetwork()
  Diagnostics->>Machine: one ping + one TCP connect
  Diagnostics-->>Page: ip check, port check, latency
  Page->>Socket: subscribe (picked codes + status, event)
  Socket-->>Page: snapshot, then only the values that change
  Page-->>User: verdict, checks, mode, connection, variables, events
```

1. [machine_diagnostics_handler.go](../../../7th-sense-server/internal/handler/machine_diagnostics_handler.go) → GetDiagnostics(), CheckNetwork(); [machine_diagnostics_routes.go](../../../7th-sense-server/internal/routes/machine_diagnostics_routes.go): `superAdminOnly`.
2. [machine_diagnostics_service.go](../../../7th-sense-server/internal/service/machine_diagnostics_service.go) → works out the checks and each reason; [machine_network_probe.go](../../../7th-sense-server/internal/service/machine_network_probe.go) → ping and TCP connect.
3. [machine_diagnostics_repository.go](../../../7th-sense-server/internal/repository/machine_diagnostics_repository.go) → reads only.
4. [diagnosticsSettings.js](../../src/pages/MachineDiagnostics/diagnosticsSettings.js) → `buildChecks()` puts the network and socket checks in order, `buildVerdict()` picks the first failed one, `variableState()` says what a row's data is doing.

## The checks

| # | Check | OK means | Reasons when not |
|---|---|---|---|
| 1 | Machine set-up | Active, controller with a CNC engine, IP, port | Inactive, no controller, no engine, no IP, no port |
| 2 | Data collector | A worker is reporting or retrying | Build is not 32-bit (GOARCH=386), `CNC_MACHINE_IDS` leaves it out, no sign of a worker |
| 3 | IP address | Replied to ping, or answered on TCP | No reply to either, no route, not resolvable |
| 4 | Port | Accepted a TCP connection | Refused (on, nothing listening), no answer in 4 s, no route |
| 5 | Controller connection | The DLL is connected | DLL could not connect, controller does not answer, set-up event, certificate rejected; warns when values could not be stored |
| 6 | Machine mode | Any mode but Offline, with what it means | Offline, none recorded |
| 7 | Snapshot variables | Readable variables have values | None readable, no reading yet, every value 0 or empty |
| 8 | Live socket | Connected and subscribed | Live data off on the server, not connected (with the error), refused, codes the collector does not read |

## Watch variables live

Each variable is a card: its value large, what its data is doing, its address, last change and last stored number. A value the socket changes updates in place with a short highlight; cards keep their place and all show at once (no paging). Tick the variables to receive (all readable ones to start, **Pick all** / **Pick none**), choose how often and turn **Live socket** off or on. Each change sends a new `subscribe` of exactly those codes ([live-socket-events.md](../../../7th-sense-server/docs/live-socket-events.md)).

| Data | Meaning |
|---|---|
| Updating | The value changed while the page was open (how often and when beside it) |
| Steady | Read, and unchanged. Not a fault: only changes are sent |
| Last known | The controller is not connected; this was the last value |
| No value yet | Connected, but no reading has held it since the server started |
| No data | Not connected and no value known |
| Not readable | The server cannot read it on this machine; the card says why |

**Rules & edge cases**

- A machine connected with no recent reading is OK: the DLL calls back only when something changes, and the connection is reopened after `CNC_QUIET_SEC`.
- A status row not updated for 30 s does not count as connected: a stopped server leaves its last value.
- A failed IP or port test while the collector is connected only warns: the test may be blocked.
- The network test runs on opening and on **Run checks again**, never on a timer. The rest reloads every 5 s and on any alarm, emergency or cycle event.
- With no readable variable the list opens on all variables, so each reason shows.

## UI states

- **Loading:** `<Loader>`; the IP and port show "Testing from the server…" until the test answers.
- **Error:** a red `<Alert>` with Retry (404 "Machine not found"); a failed refresh keeps the last data with a warning.
- **Not the superadmin:** no action in the list, the route shows Forbidden, the APIs answer 403.

## API calls on this page

| Method | Endpoint | Triggered by (section) | API docs |
|---|---|---|---|
| GET | `/api/v1/machines/{id}/diagnostics` | On page load, every 5 s | [Swagger](http://localhost:8080/api-docs/index.html#/Machines/getMachineDiagnostics) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| GET | `/api/v1/machines/{id}/diagnostics/network` | On page load · Run checks again | [Swagger](http://localhost:8080/api-docs/index.html#/Machines/checkMachineNetwork) · [openapi.yaml](../../../7th-sense-server/docs/api/openapi.yaml) |
| WS | `/api/v1/socket.io/` | Watch variables live | [live-socket-events.md](../../../7th-sense-server/docs/live-socket-events.md) |

## State & storage

- Route param `:id`; `useLoad()` (reload), `useMachineLive()` (socket), local state: live on / off, interval, picked variables, filters. Change counts live only while the page is open.

## Shared components used

[ChartCard.jsx](../../src/components/charts/ChartCard.jsx), [TableNoResults.jsx](../../src/components/common/TableNoResults.jsx) (`NoResults`), [Loader.jsx](../../src/components/common/Loader.jsx)

## Decisions

- [Server ADR 0013: Machine diagnostics from what the collector recorded](../../../7th-sense-server/docs/adr/0013-machine-diagnostics-from-collector-evidence.md)
- [Client ADR index](../adr/README.md)
