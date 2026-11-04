import { ROUTES } from './routes'

// Operations › Monitoring: the machine list first (pick a machine), then its Productivity and
// Machine Health, a tab each. Each tab keeps its own route, so links, Back and reloads open that
// tab; the Productivity / Health tabs carry `?machineId` along (`withMachine`).
export const MONITORING_TABS = [
  { key: 'machines', label: 'Machines', icon: 'bi-cpu', path: ROUTES.MONITORING },
  { key: 'productivity', label: 'Productivity', icon: 'bi-graph-up-arrow', path: ROUTES.MACHINE_PRODUCTIVITY, withMachine: true },
  { key: 'health', label: 'Machine Health', icon: 'bi-heart-pulse', path: ROUTES.MACHINE_HEALTH, withMachine: true },
]

// Paths that light up the sidebar's Monitoring item
export const MONITORING_PATHS = MONITORING_TABS.map((tab) => tab.path)

// Monitoring › Machines reloads the list this often (current mode, connection)
export const MONITOR_REFRESH_MS = 30_000

// A machine's Productivity / Health tab
export const machineMonitorPath = (path, machine) => `${path}?${new URLSearchParams({ machineId: String(machine.id) })}`
