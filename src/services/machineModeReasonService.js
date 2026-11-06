import apiClient, { withQuery, unwrap } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Why a machine was down or idle: reasons recorded against a finished Downtime or Idle period of
// the Gantt chart. Whoever may read the machine reads and changes them. Times are ISO instants.
const PATH = '/machine-mode-reasons'

// { period: { id, machineId, modeId, modeName, startedAt, endedAt } (whole, not clipped to a chart
// window), reasonType ('downtime' | 'idle'), customerId, reasons: [{ id, periodId, reasonType,
// reasonId, reasonCode, reason, startedAt, endedAt }] }. Rejects with the message to show for a
// period that takes no reason (another mode, or still running).
export const getMachineModeReasons = async (periodId) => unwrap(await apiClient.get(withQuery(PATH, { periodId })))

// { periodId, reasonId, startedAt, endedAt }
export const createMachineModeReason = async (reason) => unwrap(await apiClient.post(PATH, reason))

// { reasonId, startedAt, endedAt }
export const updateMachineModeReason = async (id, reason) => unwrap(await apiClient.put(`${PATH}/${id}`, reason))

export const deleteMachineModeReason = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
