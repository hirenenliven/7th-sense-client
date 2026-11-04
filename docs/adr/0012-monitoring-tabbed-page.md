# 0012. Monitoring: Productivity and Machine Health on one tabbed page

- **Date:** 2026-11-03
- **Status:** Superseded by [0013](0013-monitoring-machine-list.md)

## Context

Productivity and Machine Health were two items in the Machines submenu. Both show one machine (`?machineId`) with the same machine select, and users move between them for the same machine.

## Decision

Show them on one page, [MonitoringPage.jsx](../../src/pages/Monitoring/MonitoringPage.jsx), using the ADR 0010 pattern: page header + `Nav variant="tabs"`, a tab per screen from `constants/monitoring.js` (`MONITORING_TABS`). Each tab keeps its existing route; `PAGES` wraps the screen in `<MonitoringPage>`, and the screens render a `.ts-tab-header` that keeps their machine select. The tab links carry `?machineId`, so switching tabs stays on the same machine. The sidebar has one Monitoring item in Operations (opens Productivity, active on both tabs via `activePaths`); the two Machines children are removed.

## Alternatives considered

- One shared machine select in the page header: both screens own their machine list, loading and default pick; lifting it means reworking both for little gain.
- One route with `?tab=`: breaks the All Machines Health / Productivity links.

## Consequences

- Links, reloads and Back open the right tab and machine; each screen still loads lazily.
- Switching tabs reloads that screen (its filters reset; the machine is kept).
- A new monitoring screen needs a row in `MONITORING_TABS` and a `PAGES` entry wrapped in `MonitoringPage`.
