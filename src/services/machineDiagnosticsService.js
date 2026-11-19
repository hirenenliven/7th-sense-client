import apiClient, { unwrap } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1). Superadmin only.
const path = (machineId) => `/machines/${machineId}/diagnostics`

// What the server knows about one machine's data collection now; sends nothing to the machine:
// { serverTime, machine: { id, name, customerName, companyName, status, liveIp, localIp, port, engine,
// brandName, controllerName, controllerVersion, modelName }, liveEnabled, quietSec,
// status: { isConnected, connectedSince, lastSeenAt, lastChangeAt, callbackCount,
// storedCount, droppedCount, errorCount, lastError, updatedAt } | null,
// mode: { modeId, modeName, programName, since } | null, opMode,
// checks: [{ key, status: 'ok' | 'warning' | 'failed' | 'skipped', message, hint }],
// variables: [{ id, code, name, unit, category, dataType, source, address, readable, reason, value,
// storedValue, storedAt }] (the CNC DLL's), plc: { enabled, supported, state, endpoint, securityMode,
// securityPolicy, connectedSince, lastError, lastErrorAt, lastChangeAt, changeCount, status, message, hint,
// variables: [{ id, code, name, unit, category, dataType, nodeId, enabled, subscribed, nodeStatus, value,
// storedValue, storedAt }] } (the OPC UA PLC reader's, server ADR 0021), events: [{ id, type, code, message, at }] }
export const getMachineDiagnostics = async (machineId) => unwrap(await apiClient.get(path(machineId)))

// Tests the machine's IP and port from the server (takes up to a few seconds):
// { checkedAt, address, machineState: powered_on | port_closed | ip_unreachable | ip_invalid,
// ip: check, port: check, latencyMs }
export const checkMachineNetwork = async (machineId) => unwrap(await apiClient.get(`${path(machineId)}/network`))
