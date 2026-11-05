import { generatePath } from 'react-router-dom'
import { ROUTES } from './routes'

// Operations › Monitoring: the machine list first; a picked machine opens with a back arrow and
// its Productivity, Machine Health, Tool List, Tool Life and Virtual Screen, a tab each. Each tab keeps its own route (with the machine
// id), so links, Back and reloads open that tab on that machine.
export const MONITORING_MACHINE_TABS = [
  { key: 'productivity', label: 'Productivity', icon: 'bi-graph-up-arrow', path: ROUTES.MACHINE_PRODUCTIVITY },
  { key: 'health', label: 'Machine Health', icon: 'bi-heart-pulse', path: ROUTES.MACHINE_HEALTH },
  { key: 'tools', label: 'Tool List', icon: 'bi-tools', path: ROUTES.MACHINE_TOOLS },
  { key: 'tool-life', label: 'Tool Life', icon: 'bi-hourglass-split', path: ROUTES.MACHINE_TOOL_LIFE },
  { key: 'virtual-screen', label: 'Virtual Screen', icon: 'bi-display', path: ROUTES.MACHINE_VIRTUAL_SCREEN },
]

// Paths that light up the sidebar's Monitoring item
export const MONITORING_PATHS = [ROUTES.MONITORING, ...MONITORING_MACHINE_TABS.map((tab) => tab.path)]

// Monitoring › Machines reloads the list this often (current mode, connection)
export const MONITOR_REFRESH_MS = 30_000

// Monitoring › Machines opened with its search filled in (`?search=`), e.g. a mode name from a Home
// fleet tile: the list matches it like typed text
export const MONITORING_SEARCH_PARAM = 'search'
export const monitoringSearchPath = (text) =>
  `${ROUTES.MONITORING}?${new URLSearchParams({ [MONITORING_SEARCH_PARAM]: text })}`

// A machine's tab (`path` is one of the MONITORING_MACHINE_TABS paths, e.g. ROUTES.MACHINE_PRODUCTIVITY)
export const machineMonitorPath = (path, machine) => generatePath(path, { machineId: String(machine.id) })
