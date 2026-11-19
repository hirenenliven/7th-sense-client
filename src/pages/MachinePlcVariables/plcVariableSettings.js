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
