import { sharedGet, withQuery } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Operations › Monitoring › Productivity charts, from what the CNC collector recorded (mode periods, cycles) for
// the machines the user may read. Dates are YYYY-MM-DD; id lists are sent comma-separated.
const PATH = '/productivity'

const unwrap = (response) => response.data.data
const ids = (list) => (list?.length ? list.join(',') : undefined)

// Mode periods of one day (`date`) or of the last `minutes` up to now, clipped to the window:
// { from, to, serverTime, programName, opMode, periods: [{ id, modeId, modeName, programName,
// startedAt, endedAt (null while open), durationSec }], totals }
export const getModeTimeline = async (machineId, { date, minutes }) =>
  unwrap(await sharedGet(withQuery(`${PATH}/mode-timeline`, { machineId, date, minutes })))

// Time per mode over the days from … to (or one `date`), or over every recorded period (`all`),
// summed by the server with the periods clipped to the range:
// { from (null when nothing is recorded), to, serverTime, totals: [{ modeId, modeName, durationSec }] }
export const getModeTotals = async (machineId, { date, from, to, all }) =>
  unwrap(await sharedGet(withQuery(`${PATH}/mode-totals`, { machineId, date, from, to, all: all ? 'true' : undefined })))

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

// { cycles: [{ endedAt, programName, durationSec, productionSec, holdSec, downtimeSec, offlineSec }]
// (completed), summary: { cycleCount, completedCount, unfinishedCount, averageCycleSec,
// averageProductionSec }, lastFinishedAt, programs }
export const getFinishCycles = async ({ machineId, date, shiftIds, program }) =>
  unwrap(await sharedGet(withQuery(`${PATH}/finish-cycles`, { machineId, date, shiftIds: ids(shiftIds), program })))
