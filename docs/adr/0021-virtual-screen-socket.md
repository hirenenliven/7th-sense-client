# 0021. Virtual Screen: live values over Socket.IO, REST for derived data

- **Date:** 2026-11-05
- **Status:** Accepted
- **Supersedes:** [0020](0020-virtual-screen-polling.md)

## Context

ADR 0020 polled `GET /productivity/virtual-screen` every 5 s: values up to 5 s old, a query set per open screen every 5 s, and no live program name or alarm text (the collector does not store text). The server now pushes machine values over Socket.IO (server [ADR 0009](../../../7th-sense-server/docs/adr/0009-socketio-live-data.md), contract `../7th-sense-server/docs/live-socket-events.md`): a screen subscribes to exact variable codes of a machine and gets only those, only when they change, and only for machines the user may read.

## Decision

- **One socket per tab** (`services/liveSocket.js`, `socket.io-client@4`, WebSocket only), opened on first use under the tab's API base (`apiBaseUrl()`, so a "log in as" tab connects as its customer). Components declare needs with `watchMachine()`; needs are merged per machine (union of codes, smallest interval, union of channels) into one `subscribe`, re-sent when the union changes and after every reconnect. State per machine is an external store; `hooks/useMachineLive.js` reads it with `useSyncExternalStore`, so a component re-renders only for its machine. Messages with a `seq` not above the snapshot's are dropped.
- **Exact codes per screen** in `constants/live.js` (`LIVE_CODES`, `LIVE_INTERVAL_MS`); the Virtual Screen asks for its 14 codes at 200 ms plus the `status` and `event` channels.
- **REST stays the base:** the Virtual Screen still loads `GET /productivity/virtual-screen` (job, cycle, alarm history, op mode) and overlays the live values and status on it (`withLiveValues`). Alarm / emergency / cycle events reload it at once (`useLoad().reload`). With the socket connected it reloads every 30 s (`VIRTUAL_SCREEN_SAFETY_REFRESH_MS`, below the 60 s stale limit, since a steady machine sends no changes); without it, every 5 s as before.
- **Auth:** `AuthProvider` closes the socket on logout or user change. `session:expired` calls the same unauthorised listeners as a REST 401 (`notifyUnauthorized`). A refused handshake is not readable with WebSocket only, so after a `connect_error` (or a server-side close) the client checks `GET /auth/me` (at most every 30 s), whose 401 logs the tab out.
- `useLoad` gained `reload()`, and changing `refreshMs` now only restarts its timer instead of reloading from scratch.
- Dev: the Vite `/api` proxy forwards WebSockets (`ws: true`; `changeOrigin: false` keeps `Host`, so the server's Origin check passes).

## Alternatives considered

- **Keep polling (ADR 0020):** simple, but delayed and costs queries per screen.
- **Push the whole Virtual Screen response:** cycle / job / OEE are business rules in the server's services; pushing them would duplicate that logic in the collector. Events trigger a REST reload instead.
- **One socket per component:** many connections per tab and repeated access checks; one per tab with merged needs is what the server's room model expects.

## Consequences

- Values move within ~200 ms of the controller; the REST call drops from every 5 s to every 30 s per open screen.
- If the socket cannot connect (server `LIVE_ENABLED=false`, proxy without WebSocket), the screen silently falls back to 5 s polling.
- The "no access" state (`denied` / `access:changed`) replaces the screen with a warning.
- Other screens (Monitoring list, Home, Machine Health) can use `useMachineLive` with their own `LIVE_CODES`; Machine Health sensors need the DLL's PLC / NC read function first.
