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

// Finish Cycle Summary: hold / rapid / feed stacked under the whole cycle time (the rest is load / unload)
export const CYCLE_PARTS = [
  { key: 'hold', label: 'Hold Time' },
  { key: 'rapid', label: 'Rapid Time' },
  { key: 'feed', label: 'Feed Time' },
]
export const CYCLE_TIME = [{ key: 'cycle', label: 'Cycle Time' }]

// Finished / Unfinished Cycles: cycles started a day (produced) and how many of them finished.
// `color` is a chartTheme STATUS_COLORS key (the series are outcomes, not categories).
export const CYCLE_COUNTS = [
  { key: 'produced', label: 'Produced', color: 'info' },
  { key: 'finished', label: 'Finished', color: 'good' },
  { key: 'unfinished', label: 'Unfinished', color: 'critical' },
]

// SAMPLE shifts until the screen reads the customer's shifts (start / end "HH:mm"; C runs past midnight)
export const SAMPLE_SHIFTS = [
  { value: 'A', label: 'Shift A (06:00 – 14:00)', start: 6, end: 14 },
  { value: 'B', label: 'Shift B (14:00 – 22:00)', start: 14, end: 22 },
  { value: 'C', label: 'Shift C (22:00 – 06:00)', start: 22, end: 30 },
]
export const SHIFT_NOUN = { one: 'shift', many: 'shifts' }
export const MACHINE_NOUN = { one: 'machine', many: 'machines' }

export const ALL_PROGRAMS = ''

export const PRODUCTIVITY_DATE_MIN = shiftIsoDate(todayIso(), -365)
export const DEFAULT_RANGE_DAYS = 7
export const MAX_RANGE_DAYS = 31

// 12.5 (minutes) → "12:30"
export const formatCycle = (minutes) => {
  const seconds = Math.round(minutes * 60)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

export const percent = (value) => `${value.toFixed(1)}%`

const counts = new Intl.NumberFormat('en-IN')
export const formatCount = (value) => counts.format(value)
export const formatCycles = (value) => `${formatCount(value)} ${value === 1 ? 'cycle' : 'cycles'}`
