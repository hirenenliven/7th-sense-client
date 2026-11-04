# 0013. Monitoring starts with a machine list; All Machines is set-up only

- **Date:** 2026-11-04
- **Status:** Accepted (supersedes [0012](0012-monitoring-tabbed-page.md))

## Context

All Machines mixed machine set-up (Add / Edit / Delete) with live data: every row and card linked to that machine's Productivity and Health. Monitoring opened directly on Productivity for the first machine, so users had no list to pick from there. We want configuration and live monitoring kept apart.

## Decision

- Monitoring keeps the ADR 0012 tabbed page and adds a first tab, **Machines** ([MonitoringMachines.jsx](../../src/pages/Monitoring/MonitoringMachines.jsx), route `/monitoring`). It shows the machine list as a table or cards, and the only actions are Productivity and Health. Each opens that tab on the machine (`?machineId`, `machineMonitorPath` in `constants/monitoring.js`). The sidebar Monitoring item opens this tab and stays active on all three (`activePaths`, now also supported on submenu children).
- The Monitoring routes move from `/machines/*` to `/monitoring`, `/monitoring/productivity`, `/monitoring/health`, so live data no longer sits under the set-up URLs.
- All Machines only offers Edit (managers) and Delete (superadmin). Roles with neither see no Actions column.
- Both lists share [MachineBrowser.jsx](../../src/pages/Machines/MachineBrowser.jsx) (search, customer filter, sort, paging, table or cards), plus `useMachines` and `useMachineView(storageKey)`. Each page passes its own actions (`rowActions`, `cardActions`, `cardFooter`) and remembers its own view (`ts.machines.view`, `ts.monitoring.view`).

## Alternatives considered

- A machine list above the tabs, with no route of its own: Back and links could not return to the list.
- Two separate list implementations: the search, filter, sort and paging code would be duplicated and drift apart.

## Consequences

- Set-up and monitoring are separate places with separate actions.
- Old `/machines/productivity` and `/machines/health` bookmarks now go to Not Found.
- The Productivity / Health tabs still open on the first machine when there is no `?machineId`. Their machine select still switches machines.
