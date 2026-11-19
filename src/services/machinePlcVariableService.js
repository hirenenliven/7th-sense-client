import apiClient, { unwrap } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1). Superadmin only (server ADR 0020).
const path = (machineId) => `/machines/${machineId}/plc-variables`

// Every PLC variable of the machine's controller with the node id the machine reads it from:
// { machineId, machineName, controllerVersionType, updatedCount,
// variables: [{ variableId, code, name, unit, category, dataType, status, defaultNodeId, nodeId, isDefault }] }
export const getMachinePlcVariables = async (machineId) => unwrap(await apiClient.get(path(machineId)))

// Sets the machine's own node id of one variable; the default node id resets it. Returns the row.
export const updateMachinePlcVariable = async (machineId, variableId, nodeId) =>
  unwrap(await apiClient.put(`${path(machineId)}/${variableId}`, { nodeId }))

// The variable reads its default node id again. Returns the row.
export const resetMachinePlcVariable = async (machineId, variableId) => unwrap(await apiClient.delete(`${path(machineId)}/${variableId}`))

// Every variable reads its default node id again. Returns the list as getMachinePlcVariables.
export const resetMachinePlcVariables = async (machineId) => unwrap(await apiClient.delete(path(machineId)))
