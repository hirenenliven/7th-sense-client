# Tool List and Tool Life (machine tabs)

- **Route:** `/monitoring/:machineId/tools` · `/monitoring/:machineId/tool-life` · **Component:** [ToolList.jsx](../../src/pages/Productivity/ToolList.jsx), [ToolLife.jsx](../../src/pages/Productivity/ToolLife.jsx) inside [MonitoringMachine.jsx](../../src/pages/Monitoring/MonitoringMachine.jsx) ([MonitoringPage.jsx](../../src/pages/Monitoring/MonitoringPage.jsx)) · **Auth:** protected (every logged-in role) · **Guard/Layout:** `ProtectedRoute` (session) + role guard · `MainLayout`
- **Purpose:** One machine's tools and the life left on each tool. The tabs are in place but the screens are **not built yet**: each shows its tab header and a "not built yet" card. The Virtual Screen tab is built: [virtual-screen.md](virtual-screen.md).
- **Navigation:** Sidebar › Operations › **Monitoring** → [machine list](monitoring-machines.md) → a machine → **Tool List** / **Tool Life** tab (next to [Productivity](productivity.md), [Machine Health](machine-health.md) and [Virtual Screen](virtual-screen.md); same machine header and **Machine list** back arrow). Before this change Tool List and Tool Life were a Tool submenu in the sidebar (Coming soon, `/tools`, `/tools/life`); those links are gone.

## On page load

No API calls of their own. [MonitoringMachine.jsx](../../src/pages/Monitoring/MonitoringMachine.jsx) loads the machines (see [productivity.md](productivity.md#on-page-load)), finds `:machineId` and passes `machine` to the tab, which lazy-loads (`TAB_SCREENS`) and renders [PlannedTab.jsx](../../src/pages/Productivity/PlannedTab.jsx) with the machine's name.

## UI states

- **Loading / error / Machine not found:** handled by `MonitoringMachine` (same as the other machine tabs).
- **Loaded:** tab header (title, machine name + what the tab will show) and an empty card "… hasn't been built yet."

## Rules & edge cases

- The tab is the route: links, Back and reloads open that tab on that machine (`MONITORING_MACHINE_TABS` in [monitoring.js](../../src/constants/monitoring.js)).
- No data, endpoints or roles yet.

## API calls on this page

None yet (the machine list call belongs to `MonitoringMachine`, see [monitoring-machines.md](monitoring-machines.md#api-calls-on-this-page)).

## State & storage

- Route param `:machineId` (read by [MonitoringPage.jsx](../../src/pages/Monitoring/MonitoringPage.jsx)); the tab gets the machine as a prop

## Shared components used

[PlannedTab.jsx](../../src/pages/Productivity/PlannedTab.jsx)

## Decisions

- [ADR 0019](../adr/0019-monitoring-machine-view.md) (machine list, then the machine's tabs with a back arrow); these tabs follow the same pattern
