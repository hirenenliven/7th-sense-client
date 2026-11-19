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

// Check machine (MachinePowerCheck.jsx): the server's machineState of one IP + port test, in words
export const MACHINE_STATE = { ON: 'powered_on', PORT_CLOSED: 'port_closed', IP_UNREACHABLE: 'ip_unreachable', IP_INVALID: 'ip_invalid' }

export const machineStateLook = (state, { ip, port }) => {
  switch (state) {
    case MACHINE_STATE.ON:
      return { tone: 'good', icon: 'bi-power', title: 'Machine is on', message: `IP ${ip} answered and port ${port} is open.` }
    case MACHINE_STATE.PORT_CLOSED:
      return { tone: 'warning', icon: 'bi-door-closed-fill', title: 'Port is closed', message: `IP ${ip} answers, so the machine is on, but port ${port} does not accept a connection.` }
    case MACHINE_STATE.IP_UNREACHABLE:
      return { tone: 'critical', icon: 'bi-wifi-off', title: 'IP is not reachable', message: `No answer from ${ip}: the machine may be off, or the network between it and the server is down.` }
    case MACHINE_STATE.IP_INVALID:
      return { tone: 'critical', icon: 'bi-x-octagon-fill', title: 'IP is not valid', message: `${ip} is not an IP address the server can use. Correct the Live IP on the machine form.` }
    default:
      return { tone: 'neutral', icon: 'bi-question-circle', title: 'Not checked yet', message: 'Check machine tests the IP and port from the server.' }
  }
}

// What the IP and port rows say for each result of their check
export const NETWORK_ROWS = [
  { key: 'ip', label: 'IP address', [CHECK_STATUS.OK]: 'Reachable', [CHECK_STATUS.FAILED]: 'Not reachable' },
  { key: 'port', label: 'Port', [CHECK_STATUS.OK]: 'Open', [CHECK_STATUS.FAILED]: 'Closed' },
]

export const networkRowLabel = (row, status) => {
  if (status === CHECK_STATUS.OK) return row[CHECK_STATUS.OK]
  if (status === CHECK_STATUS.FAILED || status === CHECK_STATUS.WARNING) return row[CHECK_STATUS.FAILED]
  return STATUS_LOOK[status]?.label ?? '—'
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

// The OPC UA PLC reader's connection (diagnostics.plc.state, server ADR 0021)
export const PLC_STATE = { CONNECTED: 'connected', CONNECTING: 'connecting', FAILED: 'failed', NO_VARIABLES: 'no_variables', OFF: 'off', NOT_REPORTED: 'not_reported' }

export const PLC_STATE_LOOK = {
  [PLC_STATE.CONNECTED]: { tone: 'good', label: 'Connected' },
  [PLC_STATE.CONNECTING]: { tone: 'info', label: 'Connecting' },
  [PLC_STATE.FAILED]: { tone: 'critical', label: 'Not connected' },
  [PLC_STATE.NO_VARIABLES]: { tone: 'neutral', label: 'Nothing to read' },
  [PLC_STATE.OFF]: { tone: 'neutral', label: 'Not read' },
  [PLC_STATE.NOT_REPORTED]: { tone: 'critical', label: 'Not reported' },
}

export const PLC_FILTERS = [
  { value: '', label: 'All PLC variables' },
  { value: 'subscribed', label: 'Subscribed' },
  { value: 'problems', label: 'Refused or off' },
]

// What a PLC variable's row says about its data: the controller's node status first, then what the
// socket shows. Unchanged is not a fault: OPC UA only sends changes.
export const plcVariableState = ({ variable, value, changes, connected }) => {
  if (!variable.enabled) return { tone: 'neutral', label: 'Turned off', title: 'Turned off for this machine (machine_variables).' }
  if (variable.nodeStatus) return { tone: 'critical', label: variable.nodeStatus, title: 'What the controller answered for this node ID.' }
  if (!connected) {
    return value != null
      ? { tone: 'warning', label: 'Last known', title: 'The PLC is not connected: this is the last value known.' }
      : { tone: 'critical', label: 'No data', title: 'The PLC is not connected and no value is known.' }
  }
  if (changes > 0) return { tone: 'good', label: 'Updating', title: 'The value changed while this page was open.' }
  if (value != null) return { tone: 'info', label: 'Steady', title: 'Subscribed, and unchanged since this page opened. Only changes are sent.' }
  return { tone: 'warning', label: 'No value yet', title: 'Subscribed, but the controller has sent no value yet.' }
}
