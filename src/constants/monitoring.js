import { generatePath } from 'react-router-dom'
import { ROUTES } from './routes'

// Operations › Monitoring: the machine list first; a picked machine opens with a back arrow and
// its Productivity and Machine Health, a tab each. Each tab keeps its own route (with the machine
// id), so links, Back and reloads open that tab on that machine.
export const MONITORING_MACHINE_TABS = [
  { key: 'productivity', label: 'Productivity', icon: 'bi-graph-up-arrow', path: ROUTES.MACHINE_PRODUCTIVITY },
  { key: 'health', label: 'Machine Health', icon: 'bi-heart-pulse', path: ROUTES.MACHINE_HEALTH },
]

// Paths that light up the sidebar's Monitoring item
export const MONITORING_PATHS = [ROUTES.MONITORING, ...MONITORING_MACHINE_TABS.map((tab) => tab.path)]

// Monitoring › Machines reloads the list this often (current mode, connection)
export const MONITOR_REFRESH_MS = 30_000

// A machine's Productivity / Health tab (`path` is ROUTES.MACHINE_PRODUCTIVITY or MACHINE_HEALTH)
export const machineMonitorPath = (path, machine) => generatePath(path, { machineId: String(machine.id) })
