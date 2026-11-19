// Settings of the PLC node IDs page (MachinePlcVariables.jsx).

// Mirrors the server (dto.UpdatePlcNodeIDRequest): an OPC UA node id, e.g. "ns=2;s=/Random/Plc/DB3300.DBX3.0"
const NODE_ID_PATTERN = /^(ns=\d+;)?[sigb]=\S.*$/
const NODE_ID_MAX_LENGTH = 255

export const NODE_ID_EXAMPLE = 'ns=2;s=/Random/Plc/DB3300.DBX3.0'

// The message for a typed node id, '' when the server would take it
export const nodeIdError = (value) => {
  const nodeId = value.trim()
  if (!nodeId) return 'Please enter node ID'
  if (nodeId.length > NODE_ID_MAX_LENGTH) return `Node ID must be at most ${NODE_ID_MAX_LENGTH} characters`
  if (!NODE_ID_PATTERN.test(nodeId)) return `Please enter a valid OPC UA node ID, e.g. ${NODE_ID_EXAMPLE}`
  return ''
}

// The server's nodeStatus of a row (dto.PlcNode*)
export const NODE_STATUS = { DEFAULT: 'default', UPDATED: 'updated' }

export const NODE_STATUS_LABELS = { [NODE_STATUS.DEFAULT]: 'Default', [NODE_STATUS.UPDATED]: 'Updated' }

export const NODE_FILTER = { ALL: '', ...NODE_STATUS, UNSAVED: 'unsaved' }

export const NODE_FILTERS = [
  { value: NODE_FILTER.ALL, label: 'All variables' },
  { value: NODE_FILTER.UPDATED, label: 'Updated' },
  { value: NODE_FILTER.DEFAULT, label: 'Default' },
  { value: NODE_FILTER.UNSAVED, label: 'Unsaved changes' },
]

// The typed value of a row when it differs from what is saved, else undefined
export const changedDraft = (drafts, row) => {
  const draft = drafts[row.variableId]
  return draft !== undefined && draft.trim() !== row.nodeId ? draft : undefined
}

// Live values: at most one socket message this often; the reader's answer is fetched again this
// long after a save (it subscribes again within a second or two)
export const PLC_LIVE_INTERVAL_MS = 1000
export const READER_REFRESH_DELAY_MS = 3000

// What the controller's common OPC UA status codes mean here
const STATUS_HINTS = {
  BadNodeIdUnknown: 'The node does not exist on this controller.',
  BadNodeIdInvalid: 'The controller cannot parse this node ID.',
  BadUserAccessDenied: 'This login may not read the node.',
  BadNotReadable: 'The node cannot be read.',
  BadAttributeIdInvalid: 'The node is not a variable.',
  BadTypeMismatch: 'The node has a different data type.',
  BadWaitingForInitialData: 'The controller has no value yet.',
}

export const statusHint = (status) => STATUS_HINTS[status] ?? (status?.startsWith('invalid node id') ? 'Fix the node ID form.' : '')

// The node id a row reads now: the typed one while editing, else the saved one
export const currentNodeId = (row, draft) => (draft !== undefined ? draft : row.nodeId).trim()

// The OPC UA PLC reader's worker state (reader.state, server opcua.State*)
export const READER_STATE = { CONNECTED: 'connected', CONNECTING: 'connecting', FAILED: 'failed', NO_VARIABLES: 'no_variables' }

// What the page says about the PLC reader as a whole
export const readerLook = (reader) => {
  if (!reader.enabled) return { tone: 'neutral', label: 'PLC reader off', title: 'PLC_ENABLED is off on the server.' }
  if (!reader.supported) return { tone: 'neutral', label: 'Not read over OPC UA', title: 'PLC variables are read over OPC UA from Siemens controllers only.' }
  if (reader.state === READER_STATE.CONNECTED) return { tone: 'good', label: 'PLC reader connected' }
  if (reader.state === READER_STATE.CONNECTING) return { tone: 'info', label: 'PLC reader connecting' }
  if (reader.state === READER_STATE.NO_VARIABLES) return { tone: 'neutral', label: 'Nothing to read', title: 'No active PLC variable has a node ID.' }
  if (reader.state === READER_STATE.FAILED) return { tone: 'critical', label: 'PLC reader not connected', title: reader.lastError }
  return { tone: 'critical', label: 'No PLC reader', title: 'The machine must be Active (and in CNC_MACHINE_IDS when that is set).' }
}

// What a row's live value cell says: whether the reader reads the saved node id and values arrive.
// Only changes are sent, so a steady value is not a fault.
export const liveState = ({ row, reader, socketLive, value, changes }) => {
  if (!reader.enabled || !reader.supported) return { tone: 'neutral', label: 'Not read', title: readerLook(reader).title }
  if (reader.state !== READER_STATE.CONNECTED) return { tone: 'critical', label: 'Not connected', title: reader.lastError || readerLook(reader).label }
  if (!row.readerNodeId) {
    return { tone: 'neutral', label: 'Not subscribed', title: 'The reader does not read this variable: it is inactive or turned off for this machine.' }
  }
  if (row.readerNodeId !== row.nodeId) {
    return { tone: 'info', label: 'Subscribing…', title: `The reader still reads ${row.readerNodeId}; it subscribes to the saved node ID again.` }
  }
  if (row.readerStatus) return { tone: 'critical', label: row.readerStatus, title: statusHint(row.readerStatus) || 'The controller refused this node ID.' }
  if (!socketLive) return { tone: 'warning', label: 'Socket not connected', title: 'Live values arrive over the live socket; test the node ID to read it now.' }
  if (changes > 0) return { tone: 'good', label: 'Updating', title: 'The value changed while this page was open.' }
  if (value != null) return { tone: 'info', label: 'Steady', title: 'Read, and unchanged since this page opened. Only changes are sent.' }
  return { tone: 'warning', label: 'No value yet', title: 'Subscribed, but no value has arrived. Test the node ID to read it now.' }
}
