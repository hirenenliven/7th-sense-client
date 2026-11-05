import { shiftIsoDate, todayIso } from '@/utils/dateTime'

// Settings of Operations › Monitoring › Productivity (OEE and finished cycles of a machine).

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
// Below this OEE reads as low (red); between it and world class as fair (amber)
export const FAIR_OEE = 60
export const OEE_LIMITS = [{ value: WORLD_CLASS_OEE, label: `World class ${WORLD_CLASS_OEE}%`, status: 'good' }]

export const SHIFT_NOUN = { one: 'shift', many: 'shifts' }
export const MACHINE_NOUN = { one: 'machine', many: 'machines' }

export const ALL_PROGRAMS = ''

export const PRODUCTIVITY_DATE_MIN = shiftIsoDate(todayIso(), -365)
export const DEFAULT_RANGE_DAYS = 7
export const MAX_RANGE_DAYS = 31

// Cycle time in seconds: 27 → "27s", 750 → "12m 30s", 3900 → "1h 05m" (never "12:30", which reads
// as a clock time)
export const formatCycle = (seconds) => {
  const total = Math.round(seconds)
  if (total < 60) return `${total}s`
  const pad = (value) => String(value).padStart(2, '0')
  if (total < 3600) return `${Math.floor(total / 60)}m ${pad(total % 60)}s`
  return `${Math.floor(total / 3600)}h ${pad(Math.floor((total % 3600) / 60))}m`
}

export const percent =(value) => (value == null ? '—' : `${value.toFixed(1)}%`)

const counts = new Intl.NumberFormat('en-IN')
export const formatCount = (value) => counts.format(value)

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
// Summary cards (today's cycles, machine modes and OEE) reload every minute
export const KPI_REFRESH_MS = 60_000

// Machine Modes card: the period its totals cover (GET /productivity/mode-totals). `query(today)`
// gives the request's dates; `noun` ends the share line ("12.5% of the day").
export const MODE_RANGES = [
  { value: 'today', label: 'Today', noun: 'the day', query: (today) => ({ date: today }) },
  { value: 'yesterday', label: 'Yesterday', noun: 'the day', query: (today) => ({ date: shiftIsoDate(today, -1) }) },
  { value: 'week', label: 'Last 7 days', noun: 'the 7 days', query: (today) => ({ from: shiftIsoDate(today, -6), to: today }) },
  { value: 'month', label: 'Last 30 days', noun: 'the 30 days', query: (today) => ({ from: shiftIsoDate(today, -29), to: today }) },
  { value: 'all', label: 'All time', noun: 'all recorded time', query: () => ({ all: true }) },
]
export const DEFAULT_MODE_RANGE = MODE_RANGES[0].value
// Machine Modes card, in this order (machine_modes ids): In Production, Hold, Loading / Unloading,
// Idle, Downtime, Offline. Setup, Rapid Mode and the planned downtimes are not shown.
export const SUMMARY_MODE_IDS = [3, 4, 2, 5, 6, 9]

// A customer shift as a filter option: "Shift A (06:00 – 14:00)"
export const shiftOption = (shift) => ({ value: String(shift.id), label: `${shift.name} (${shift.startTime} – ${shift.endTime})` })
