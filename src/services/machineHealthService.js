import { sharedGet, withQuery } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Operations › Monitoring › Machine Health charts, from what the CNC collector recorded (machine_mode_log).
const PATH = '/machine-health'

const unwrap = (response) => response.data.data

// [{ date, offline, production, idle, hold, downtime }] in hours; today runs up to now
export const getMachineTimeByDay = async (machineId, from, to) =>
  unwrap(await sharedGet(withQuery(`${PATH}/machine-time-by-day`, { machineId, from, to }))) ?? []
