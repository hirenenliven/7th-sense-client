import { shiftIsoDate, todayIso } from '@/utils/dateTime'

// Settings of Operations › Productivity (OEE and finished cycles of a machine).

// OEE: "with schedule" counts availability against the planned (scheduled) time only
export const SCHEDULE_MODES = [
  { value: 'without', label: 'Without schedule' },
  { value: 'with', label: 'With schedule' },
]
export const DEFAULT_SCHEDULE_MODE = SCHEDULE_MODES[0].value

// OEE chart series (percent); OEE = Availability × Performance × Quality
export const OEE_SERIES = [
  { key: 'quality', label: 'Quality' },
  { key: 'availability', label: 'Availability' },
  { key: 'oee', label: 'OEE' },
  { key: 'performance', label: 'Performance' },
]
export const OEE_DOMAIN = [0, 100]
export const OEE_TICKS = [0, 20, 40, 60, 80, 100]
export const WORLD_CLASS_OEE = 85
export const OEE_LIMITS = [{ value: WORLD_CLASS_OEE, label: `World class ${WORLD_CLASS_OEE}%`, status: 'good' }]

// Finish Cycle Summary: the seconds of each cycle per machine mode (mode colours, as on the Gantt
// chart), stacked under the whole cycle time; the rest of a cycle is time not split yet
export const CYCLE_PARTS = [
  { key: 'production', label: 'Production Time', color: 'var(--ts-mode-production)' },
  { key: 'hold', label: 'Hold Time', color: 'var(--ts-mode-hold)' },
  { key: 'downtime', label: 'Downtime', color: 'var(--ts-mode-downtime)' },
  { key: 'offline', label: 'Offline Time', color: 'var(--ts-mode-offline)' },
]
export const CYCLE_TIME = [{ key: 'cycle', label: 'Cycle Time', color: 'var(--ts-chart-1)' }]

// Finished / Unfinished Cycles: cycles started a day (produced) and how many of them finished.
// `color` is a chartTheme STATUS_COLORS key (the series are outcomes, not categories).
export const CYCLE_COUNTS = [
  { key: 'produced', label: 'Produced', color: 'info' },
  { key: 'finished', label: 'Finished', color: 'good' },
  { key: 'unfinished', label: 'Unfinished', color: 'critical' },
]

export const SHIFT_NOUN = { one: 'shift', many: 'shifts' }
export const MACHINE_NOUN = { one: 'machine', many: 'machines' }

export const ALL_PROGRAMS = ''

export const PRODUCTIVITY_DATE_MIN = shiftIsoDate(todayIso(), -365)
export const DEFAULT_RANGE_DAYS = 7
export const MAX_RANGE_DAYS = 31

// Cycle time in seconds: 27 → "27s", 750 → "12:30"
export const formatCycle = (seconds) => {
  const total = Math.round(seconds)
  if (total < 60) return `${total}s`
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

export const percent = (value) => (value == null ? '—' : `${value.toFixed(1)}%`)

const counts = new Intl.NumberFormat('en-IN')
export const formatCount = (value) => counts.format(value)
export const formatCycles = (value) => `${formatCount(value)} ${value === 1 ? 'cycle' : 'cycles'}`

// Machine Mode Timeline: reload live modes every 30 s; the open mode grows every second
export const TIMELINE_POLL_MS = 30_000
export const TIMELINE_TICK_MS = 1_000
// Time windows up to now (server max dto.ModeTimelineMaxMinutes = 1440); HISTORY shows a whole day
export const TIMELINE_RANGES = [
  { value: 5, label: 'Last 5 minutes' },
  { value: 15, label: 'Last 15 minutes' },
  { value: 30, label: 'Last 30 minutes' },
  { value: 60, label: 'Last 1 hour' },
  { value: 180, label: 'Last 3 hours' },
  { value: 480, label: 'Last 8 hours' },
  { value: 720, label: 'Last 12 hours' },
  { value: 1440, label: 'Last 24 hours' },
]
export const TIMELINE_HISTORY = 'day'
export const DEFAULT_TIMELINE_RANGE = 30
// Zoom widens the plot (scrolls sideways): 1× fits the window
export const TIMELINE_ZOOMS = [1, 2, 4, 8, 16]
// KPI tiles (today's cycles) reload every minute
export const KPI_REFRESH_MS = 60_000

// A customer shift as a filter option: "Shift A (06:00 – 14:00)"
export const shiftOption = (shift) => ({ value: String(shift.id), label: `${shift.name} (${shift.startTime} – ${shift.endTime})` })
