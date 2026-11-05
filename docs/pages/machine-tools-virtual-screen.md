# Tool List, Tool Life and Virtual Screen (machine tabs)

- **Route:** `/monitoring/:machineId/tools` · `/monitoring/:machineId/tool-life` · `/monitoring/:machineId/virtual-screen` · **Component:** [ToolList.jsx](../../src/pages/Productivity/ToolList.jsx), [ToolLife.jsx](../../src/pages/Productivity/ToolLife.jsx), [VirtualScreen.jsx](../../src/pages/Productivity/VirtualScreen.jsx) inside [MonitoringMachine.jsx](../../src/pages/Monitoring/MonitoringMachine.jsx) ([MonitoringPage.jsx](../../src/pages/Monitoring/MonitoringPage.jsx)) · **Auth:** protected (every logged-in role) · **Guard/Layout:** `ProtectedRoute` (session) + role guard · `MainLayout`
- **Purpose:** One machine's tools, the life left on each tool, and a virtual view of the machine's screen. The tabs are in place but the screens are **not built yet**: each shows its tab header and a "not built yet" card.
- **Navigation:** Sidebar › Operations › **Monitoring** → [machine list](monitoring-machines.md) → a machine → **Tool List** / **Tool Life** / **Virtual Screen** tab (next to [Productivity](productivity.md) and [Machine Health](machine-health.md); same machine header and **Machine list** back arrow). Before this change Tool List and Tool Life were a Tool submenu in the sidebar (Coming soon, `/tools`, `/tools/life`); those links are gone.

## On page load

No API calls of their own. [MonitoringMachine.jsx](../../src/pages/Monitoring/MonitoringMachine.jsx) loads the machines (see [productivity.md](productivity.md#on-page-load)), finds `:machineId` and passes `machine` to the tab, which lazy-loads (`TAB_SCREENS`) and renders [PlannedTab.jsx](../../src/pages/Productivity/PlannedTab.jsx) with the machine's name.

## UI states

- **Loading / error / Machine not found:** handled by `MonitoringMachine` (same as the other machine tabs).
- **Loaded:** tab header (title, machine name + what the tab will show) and an empty card "… hasn't been built yet."

## Rules & edge cases

- The tab is the route: links, Back and reloads open that tab on that machine (`MONITORING_MACHINE_TABS` in [monitoring.js](../../src/constants/monitoring.js)).
- No data, endpoints or roles yet; the Virtual Screen contents are still to be specified.

## API calls on this page

None yet (the machine list call belongs to `MonitoringMachine`, see [monitoring-machines.md](monitoring-machines.md#api-calls-on-this-page)).

## State & storage

- Route param `:machineId` (read by [MonitoringPage.jsx](../../src/pages/Monitoring/MonitoringPage.jsx)); the tab gets the machine as a prop

## Shared components used

[PlannedTab.jsx](../../src/pages/Productivity/PlannedTab.jsx)

## Decisions

- [ADR 0019](../adr/0019-monitoring-machine-view.md) (machine list, then the machine's tabs with a back arrow); these tabs follow the same pattern
