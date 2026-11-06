// Machine Diagnostics (MachineDiagnostics.jsx): the order of the checks, how a result looks and how a
// variable's state is worked out. The server gives the reasons; only what the browser alone can
// know (the socket) is decided here.

export const DIAGNOSTICS_REFRESH_MS = 5_000
export const LIVE_INTERVALS = [
  { value: 200, label: 'Every 0.2 s' },
  { value: 1000, label: 'Every 1 s' },
  { value: 5000, label: 'Every 5 s' },
]
export const DEFAULT_LIVE_INTERVAL = 1000
export const VARIABLE_FILTERS = [
  { value: 'readable', label: 'Readable' },
  { value: 'unreadable', label: 'Not readable' },
  { value: 'all', label: 'All variables' },
]

export const CHECK_STATUS = { OK: 'ok', WARNING: 'warning', FAILED: 'failed', SKIPPED: 'skipped', RUNNING: 'running' }

export const STATUS_LOOK = {
  [CHECK_STATUS.OK]: { tone: 'good', icon: 'bi-check-circle-fill', label: 'OK' },
  [CHECK_STATUS.WARNING]: { tone: 'warning', icon: 'bi-exclamation-triangle-fill', label: 'Warning' },
  [CHECK_STATUS.FAILED]: { tone: 'critical', icon: 'bi-x-circle-fill', label: 'Failed' },
  [CHECK_STATUS.SKIPPED]: { tone: 'neutral', icon: 'bi-dash-circle', label: 'Not checked' },
  [CHECK_STATUS.RUNNING]: { tone: 'info', icon: 'bi-hourglass-split', label: 'Checking' },
}

const CHECK_LABELS = {
  setup: 'Machine set-up',
  collector: 'Data collector',
  ip: 'IP address',
  port: 'Port',
  controller: 'Controller connection',
  mode: 'Machine mode',
  variables: 'Snapshot variables',
  socket: 'Live socket',
}

// The socket as this browser sees it: only it can tell whether the values reach the screen
const socketCheck = ({ liveEnabled, liveOn, selectedCount, live }) => {
  const check = { key: 'socket' }
  if (!liveEnabled) {
    return { ...check, status: CHECK_STATUS.FAILED, message: 'Live data is off on this server (LIVE_ENABLED=false).', hint: 'Set LIVE_ENABLED=true and restart the server.' }
  }
  if (!liveOn) return { ...check, status: CHECK_STATUS.SKIPPED, message: 'Live view is off. Turn it on below to watch the values.' }
  if (live.error) return { ...check, status: CHECK_STATUS.FAILED, message: `The server refused the subscription: ${live.error}` }
  if (live.denied) return { ...check, status: CHECK_STATUS.FAILED, message: 'The server says this user may not read this machine.' }
  if (!live.connected) {
    return {
      ...check,
      status: CHECK_STATUS.FAILED,
      message: `The socket is not connected${live.connectError ? `: ${live.connectError}` : ''}.`,
      hint: 'Check the server is running and that a proxy in between passes WebSocket connections. Values below keep refreshing every few seconds without it.',
    }
  }
  if (live.unknown?.length) {
    return { ...check, status: CHECK_STATUS.WARNING, message: `Connected, but the collector does not read: ${live.unknown.join(', ')}.` }
  }
  if (!selectedCount) return { ...check, status: CHECK_STATUS.SKIPPED, message: 'Connected. Pick variables below to receive them.' }
  return { ...check, status: CHECK_STATUS.OK, message: `Connected and subscribed to ${selectedCount} variable${selectedCount === 1 ? '' : 's'}. Only values that change are sent.` }
}

// Every check in the order a problem should be looked for: the server's, the network test between
// them, then the socket
export const buildChecks = ({ diagnostics, network, networkError, liveOn, selectedCount, live }) => {
  const byKey = new Map(diagnostics.checks.map((check) => [check.key, check]))
  const running = (key) => ({ key, status: CHECK_STATUS.RUNNING, message: 'Testing from the server…' })
  const networkCheck = (key) => {
    if (networkError) return { key, status: CHECK_STATUS.FAILED, message: `The test could not run: ${networkError}` }
    return network?.[key] ?? running(key)
  }
  const checks = [
    byKey.get('setup'),
    byKey.get('collector'),
    networkCheck('ip'),
    networkCheck('port'),
    byKey.get('controller'),
    byKey.get('mode'),
    byKey.get('variables'),
    socketCheck({ liveEnabled: diagnostics.liveEnabled, liveOn, selectedCount, live }),
  ]
  return checks.filter(Boolean).map((check) => ({ ...check, label: CHECK_LABELS[check.key] }))
}

// The answer at the top: the first failed check is where to look; a later failure usually follows
// from it. Warnings only count when nothing failed.
export const buildVerdict = (checks) => {
  const failed = checks.find((check) => check.status === CHECK_STATUS.FAILED)
  if (failed) return { variant: 'danger', icon: 'bi-x-octagon-fill', title: `Problem found: ${failed.label}`, message: failed.message, hint: failed.hint }
  const warning = checks.find((check) => check.status === CHECK_STATUS.WARNING)
  if (warning) return { variant: 'warning', icon: 'bi-exclamation-triangle-fill', title: `Check this: ${warning.label}`, message: warning.message, hint: warning.hint }
  if (checks.some((check) => check.status === CHECK_STATUS.RUNNING)) {
    return { variant: 'info', icon: 'bi-hourglass-split', title: 'Checking…', message: 'Testing the IP and port from the server.' }
  }
  return { variant: 'success', icon: 'bi-check-circle-fill', title: 'Data is coming from this machine', message: 'Every check passed.' }
}

// Remembers, per code, how often the socket changed its value and when. The first value seen is the
// starting point, not a change.
export const trackChanges = (previous, values, at) => {
  const rows = { ...previous.rows }
  Object.entries(values).forEach(([code, value]) => {
    const row = rows[code]
    if (!row) rows[code] = { value, changes: 0, changedAt: null }
    else if (row.value !== value) rows[code] = { value, changes: row.changes + 1, changedAt: at }
  })
  return { source: values, rows }
}

// What a variable's card says about its data. Unchanged is not a fault: only changes are sent.
export const variableState = ({ variable, value, changes, controllerConnected }) => {
  if (!variable.readable) return { tone: 'neutral', label: 'Not readable', title: variable.reason }
  if (changes > 0) return { tone: 'good', label: 'Updating', title: 'The value changed while this page was open.' }
  if (value != null) {
    return controllerConnected
      ? { tone: 'info', label: 'Steady', title: 'Read, and unchanged since this page opened. Only changes are sent.' }
      : { tone: 'warning', label: 'Last known', title: 'The controller is not connected: this is the last value known.' }
  }
  return controllerConnected
    ? { tone: 'warning', label: 'No value yet', title: 'Connected, but no reading has held this variable since the server started.' }
    : { tone: 'critical', label: 'No data', title: 'The controller is not connected and no value is known.' }
}

const numberFormat = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 3 })
export const formatValue = (value, unit) => {
  if (value == null) return '—'
  if (value === '') return '(empty)'
  const text = typeof value === 'number' ? numberFormat.format(value) : String(value)
  return unit ? `${text} ${unit}` : text
}
