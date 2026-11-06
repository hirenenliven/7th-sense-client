import { STATUS_COLORS } from '@/components/charts/chartTheme'
import { modeTypeOf } from '@/constants/machines'
import { FAIR_OEE, SUMMARY_MODE_IDS, SUMMARY_MODE_PARTS, WORLD_CLASS_OEE, percent } from '@/pages/Productivity/productivitySettings'
import { formatModeDuration, pad2 } from '@/utils/dateTime'

// Settings of the Home dashboard (GET /dashboard/home).

// Machines in one of these modes for at least ATTENTION_MINUTES are listed under Needs attention
// (Downtime 6, Hold 4), longest first, at most ATTENTION_LIMIT
export const ATTENTION_MODE_IDS = [6, 4]
export const ATTENTION_MINUTES = 15
export const ATTENTION_LIMIT = 8
// Lowest OEE: the machines with an OEE today, lowest first
export const LOWEST_OEE_LIMIT = 5

// Fleet mode tiles, in the Productivity Machine Modes order (In Production includes Rapid Mode);
// machines in any other mode (Setup, planned downtime, …) are counted under Other
export const FLEET_MODES = SUMMARY_MODE_IDS.map((id) => ({ ...modeTypeOf(id), parts: SUMMARY_MODE_PARTS[id] ?? [id] }))
export const OTHER_MODE = { id: 'other', label: 'Other modes', color: 'var(--ts-neutral)' }

// Where the time went: a row per fleet mode (In Production includes Rapid Mode) in its mode colour,
// Other modes (Setup, planned downtime, …) and the time with no record. `tone` colours the list
// row (`.ts-tone-<tone>`), `color` the donut slice.
export const PRODUCTION_TIME_KEY = `mode-${FLEET_MODES[0].id}`
export const UNRECORDED_TIME = { key: 'unrecorded', label: 'Not recorded', tone: 'neutral', color: STATUS_COLORS.neutral, muted: true }
// Smallest slice (degrees), so a few minutes of Hold beside a day of Offline still shows
export const TIME_MIN_SLICE_DEG = 4

// The server rounds each mode's time down to whole seconds, so a fully recorded day can come out
// a few seconds short of its span: less than this is not shown as Not recorded
const MIN_UNRECORDED_SEC = 60

// Rows of the chart from the server's { modeId, durationSec } list: every fleet mode (also at 0),
// then Other modes and Not recorded when they have time
export const timeByMode = ({ modes, spanSec }) => {
  const seconds = Object.fromEntries(modes.map((mode) => [mode.modeId, mode.durationSec]))
  const known = new Set(FLEET_MODES.flatMap((mode) => mode.parts))
  const sum = (list) => list.reduce((total, value) => total + value, 0)
  const rows = FLEET_MODES.map((mode) => ({
    key: `mode-${mode.id}`, label: mode.label, color: mode.color, tone: `mode-${mode.id}`,
    value: sum(mode.parts.map((id) => seconds[id] ?? 0)),
  }))
  const other = sum(modes.filter((mode) => !known.has(mode.modeId)).map((mode) => mode.durationSec))
  const unrecorded = Math.max(0, spanSec - sum(modes.map((mode) => mode.durationSec)))
  return [
    ...rows,
    ...(other ? [{ key: OTHER_MODE.id, label: OTHER_MODE.label, color: OTHER_MODE.color, tone: 'neutral', value: other }] : []),
    ...(unrecorded >= MIN_UNRECORDED_SEC ? [{ ...UNRECORDED_TIME, value: unrecorded }] : []),
  ]
}

// Parts per hour chart: the day as bars, the day before as a dashed line
export const HOURLY_BARS = [{ key: 'partsMade', label: 'Parts' }]
export const HOURLY_LINES = [{ key: 'previousPartsMade', label: 'Day before', dashed: true }]
export const hourLabel = (hour) => `${pad2(hour)}:00`

// Count of each fleet tile from the server's { modeId, count } list
export const fleetModeCounts = (modes) => {
  const counts = Object.fromEntries(modes.map((mode) => [mode.modeId, mode.count]))
  const known = new Set(FLEET_MODES.flatMap((mode) => mode.parts))
  const tiles = FLEET_MODES.map((mode) => ({ ...mode, count: mode.parts.reduce((sum, id) => sum + (counts[id] ?? 0), 0) }))
  const other = modes.filter((mode) => !known.has(mode.modeId)).reduce((sum, mode) => sum + mode.count, 0)
  return other ? [...tiles, { ...OTHER_MODE, count: other }] : tiles
}

// Share of the span and the time, e.g. "42.5% · 18h 05m"
export const timeShare = (seconds, spanSec) =>
  spanSec > 0 ? `${percent((seconds / spanSec) * 100)} · ${formatModeDuration(seconds)}` : formatModeDuration(seconds)

// Unfinished cycles out of the closed ones (null without closed cycles)
export const unfinishedRate = ({ completedCount, unfinishedCount }) => {
  const closed = completedCount + unfinishedCount
  return closed ? (unfinishedCount / closed) * 100 : null
}

// Seconds a machine has been in its current mode at the server's time (null when unknown)
export const secondsInMode = (machine, serverTime) =>
  machine.modeSince ? (new Date(serverTime) - new Date(machine.modeSince)) / 1000 : null

// Tile tone of a score (OEE, utilization) against the Productivity limits: green from world class
// (85 %), amber from fair (60 %), red below; neutral without a value
export const scoreTone = (value) => {
  if (value == null) return 'neutral'
  if (value >= WORLD_CLASS_OEE) return 'good'
  if (value >= FAIR_OEE) return 'warning'
  return 'critical'
}

// The cycles tile turns amber when this share (%) of the closed cycles is unfinished
export const UNFINISHED_WARNING = 10
