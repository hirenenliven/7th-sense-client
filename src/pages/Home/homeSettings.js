import { STATUS_COLORS } from '@/components/charts/chartTheme'
import { MACHINE_MODES, modeTypeOf } from '@/constants/machines'
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

// Where the time went: mode groups (server dto.ModeGroup*) in MACHINE_MODES colours, then the
// time with no record
const GROUP_ORDER = ['production', 'hold', 'idle', 'downtime', 'offline']
export const TIME_GROUPS = GROUP_ORDER.map((key) => {
  const mode = MACHINE_MODES.find((item) => item.key === key)
  return { key, label: mode.label, color: STATUS_COLORS[mode.color], muted: mode.muted }
})
export const UNRECORDED_GROUP = { key: 'unrecorded', label: 'Not recorded', color: STATUS_COLORS.neutral, muted: true }

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
