# 0020. Virtual Screen: one REST snapshot polled every 5 s

- **Date:** 2026-11-05
- **Status:** Accepted

## Context

The old PHP Virtual Screen drew the controller values from a Node socket.io stream (`reqInitialVariableValue`, `resOfChangeInValue`) plus an AJAX poll every 10 s for mode and cycle. The new stack has no socket server: the Go CNC collector writes the latest numeric value of every variable to `machine_variable_values`, mode periods to `machine_mode_log`, alarms to `machine_events` and cycles to `machine_cycles`. No endpoint exposed these together.

## Decision

- The server adds one read-only endpoint, `GET /productivity/virtual-screen?machineId=` (DashboardService), that returns everything the screen draws in one response: mode and program, op mode, the live values by `cnc_variables` code, the last alarm, the running cycle and its job.
- The client polls it every `VIRTUAL_SCREEN_REFRESH_MS` (5 s) with `useLoad`, and moves the clock, mode time and cycle elapsed every second from the server time of the last response.
- Values never read are `null` and shown as "—"; values older than 60 s mark the screen **Stale**.

## Alternatives considered

- **WebSocket / SSE push from the collector:** truly live, but needs a new transport, auth on it and fan-out from the collector process; not worth it for a screen the collector itself refreshes about once a second.
- **Several existing endpoints (mode-timeline, finish-cycles, …):** more requests per tick and still no live values or alarm.

## Consequences

- Up to 5 s delay against the controller; one small query set per open screen every 5 s.
- Text variables (program name, alarm text, tool ident) are not cached live; they come from the mode period, `machine_events` and `toolNumber`.
- Moving to push later only changes how `VirtualScreen.jsx` gets the same response shape.
