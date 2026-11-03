import { sharedGet, withQuery } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Operations › Productivity charts, from what the CNC collector recorded (mode periods, cycles) for
// the machines the user may read. Dates are YYYY-MM-DD; id lists are sent comma-separated.
const PATH = '/productivity'

const unwrap = (response) => response.data.data
const ids = (list) => (list?.length ? list.join(',') : undefined)

// Mode periods of one day (`date`) or of the last `minutes` up to now, clipped to the window:
// { from, to, serverTime, programName, opMode, periods: [{ id, modeId, modeName, programName,
// startedAt, endedAt (null while open), durationSec }], totals }
export const getModeTimeline = async (machineId, { date, minutes }) =>
  unwrap(await sharedGet(withQuery(`${PATH}/mode-timeline`, { machineId, date, minutes })))

// { rows: [{ date, availability, performance, quality, oee }], programs } — performance / quality /
// oee are null on a day without closed cycles
export const getOee = async ({ machineIds, from, to, shiftIds, program, schedule }) =>
  unwrap(
    await sharedGet(
      withQuery(`${PATH}/oee`, { machineIds: ids(machineIds), from, to, shiftIds: ids(shiftIds), program, schedule }),
    ),
  )

// [{ date, produced, finished, unfinished }]
export const getCycleCounts = async ({ machineIds, from, to, shiftIds }) =>
  unwrap(await sharedGet(withQuery(`${PATH}/cycle-counts`, { machineIds: ids(machineIds), from, to, shiftIds: ids(shiftIds) }))) ?? []

// { cycles (completed), summary, lastFinishedAt, programs }
export const getFinishCycles = async ({ machineId, date, shiftIds, program }) =>
  unwrap(await sharedGet(withQuery(`${PATH}/finish-cycles`, { machineId, date, shiftIds: ids(shiftIds), program })))
