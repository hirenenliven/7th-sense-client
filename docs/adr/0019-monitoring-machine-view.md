# 0019. Monitoring: machine list, then the machine's tabs with a back arrow

- **Date:** 2026-11-04
- **Status:** Accepted (supersedes [0013](0013-monitoring-machine-list.md))

## Context

Monitoring was a child of the Machines submenu and a tabbed page (ADR 0012 → 0013): Machines, Productivity and Machine Health were three tabs side by side, Productivity / Health carried the machine as `?machineId` and each had its own machine select (opened on the first machine when none was given). Users found the Productivity / Health tabs confusing before a machine was picked, and wanted Monitoring as its own sidebar item that starts from the machine list.

## Decision

- Monitoring is a top-level sidebar item in Operations (a link, no submenu); Machines keeps only All Machines.
- One page, `pages/Monitoring/MonitoringPage.jsx`, for three routes: `/monitoring` (the machine list, `MonitoringMachines`, page header) and `/monitoring/:machineId/productivity` / `/monitoring/:machineId/health`. With a `:machineId` it shows `MonitoringMachine.jsx`: a page header with the machine's name and a **Machine list** back-arrow button, then the Productivity / Machine Health tabs (`MONITORING_MACHINE_TABS`; the tab is the route).
- `MonitoringMachine` loads the machines once (`useMachines`) and passes `machine` (and `machines` for the OEE machine picker) to `Productivity` / `MachineHealth`, which are now plain components: no machine loading, no machine select, no URL handling. Switching tabs keeps the loaded machine; another machine starts afresh (`key`).
- A machine the user cannot read (or a removed one) shows "Machine not found" with a link back, instead of falling back to the first machine.

## Alternatives considered

- Keep `?machineId` on `/monitoring/productivity`: the machine is the main thing the tabs belong to, so a path segment reads better and makes the tabs meaningless without one.
- Keep a machine select in each tab: two ways to change machine; the back arrow to the list (with its search, mode and filters) is the one way now.
- Separate routes with separate page components: the header, back arrow and tabs would be repeated in both screens.

## Consequences

- Old `/monitoring/productivity?machineId=…` and `/monitoring/health?machineId=…` links now go to Not Found; nothing outside the app linked to them.
- Changing machine takes one step more (back to the list), but the list shows each machine's live mode.
- Productivity / MachineHealth can be reused anywhere a machine object is at hand.
