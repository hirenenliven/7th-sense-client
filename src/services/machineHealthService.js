import { sharedGet, withQuery, unwrap } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Operations › Monitoring › Machine Health charts, from what the CNC collector recorded (machine_mode_log).
const PATH = '/machine-health'

// [{ date, offline, production, idle, hold, downtime }] in hours; today runs up to now
export const getMachineTimeByDay = async (machineId, from, to) =>
  unwrap(await sharedGet(withQuery(`${PATH}/machine-time-by-day`, { machineId, from, to }))) ?? []

// X / Y / Z of one axis set from machine_telementry (server ADR 0018 / 0019): the last `minutes` up
// to now, or the exact window `start`–`end` (ISO instants, the chart's zoom). Every stored value
// while an axis holds ≤ 20,000 (raw: true), else 600 time buckets per axis:
// { from, to, raw, bucketSec, axisLabel, axes: [{ axis, code, name, unit, startValue, points: [{ at,
// value, min, max, count }] }], stats: { rowsRead, pointCount, queryMs } }
export const getAxisValues = async (machineId, { axisSet, minutes, start, end }) =>
  unwrap(await sharedGet(withQuery(`${PATH}/axis-values`, { machineId, axisSet, minutes, start, end })))
