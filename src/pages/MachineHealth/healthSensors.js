import { PICKER_LOCALE, shiftIsoDate, todayIso } from '@/utils/dateTime'

// Machine Health: the sensors drawn as charts, their limits and the trend time ranges.
// Limits follow common machine-tool practice (bearing / motor temperatures in °C, ISO 10816 spindle
// vibration velocity in mm/s) until the server sends each machine's own thresholds.

export const HEALTH_STATUS = {
  good: { label: 'Normal', icon: 'bi-check-circle-fill', badge: 'badge-soft-success' },
  warning: { label: 'Warning', icon: 'bi-exclamation-triangle-fill', badge: 'badge-soft-warning' },
  critical: { label: 'Critical', icon: 'bi-x-octagon-fill', badge: 'badge-soft-danger' },
}

export const statusOf = (value, { warning, critical }) => {
  if (value >= critical) return 'critical'
  if (value >= warning) return 'warning'
  return 'good'
}

// Line-chart sensors. base / swing / noise shape the sample readings (healthSampleData.js).
export const TREND_SENSORS = [
  {
    key: 'bearingTemp',
    label: 'Bearing Temperature',
    unit: '°C',
    icon: 'bi-thermometer-half',
    decimals: 1,
    warning: 65,
    critical: 75,
    sample: { base: 41, swing: 9, noise: 0.5 },
  },
  {
    key: 'spindleMotorTemp',
    label: 'Spindle Motor Temperature',
    unit: '°C',
    icon: 'bi-thermometer-high',
    decimals: 1,
    warning: 75,
    critical: 85,
    sample: { base: 48, swing: 14, noise: 0.7 },
  },
  {
    key: 'headstockTemp',
    label: 'Headstock Temperature',
    unit: '°C',
    icon: 'bi-thermometer',
    decimals: 1,
    warning: 55,
    critical: 65,
    sample: { base: 33, swing: 7, noise: 0.4 },
  },
  {
    key: 'spindleVibration',
    label: 'Spindle Vibration',
    unit: 'mm/s',
    icon: 'bi-activity',
    decimals: 2,
    warning: 4.5,
    critical: 7.1,
    sample: { base: 1.4, swing: 1.3, noise: 0.18 },
  },
]

// Fourth series of the grouped temperature chart (no trend card of its own)
export const HYDRAULIC_OIL_TEMP = { key: 'hydraulicOilTemp', label: 'Hydraulic Oil', sample: { base: 36, swing: 8, noise: 0.4 } }

// Grouped bars: the four temperatures at each hour, in series-colour order
export const TEMPERATURE_GROUP = [
  { key: 'bearingTemp', label: 'Bearing' },
  { key: 'spindleMotorTemp', label: 'Spindle Motor' },
  { key: 'headstockTemp', label: 'Headstock' },
  { key: HYDRAULIC_OIL_TEMP.key, label: HYDRAULIC_OIL_TEMP.label },
]

export const SPINDLE_LOAD = { label: 'Spindle Load', unit: '%', min: 0, max: 100, warning: 70, critical: 90 }

// Machine states over a day: stacked bars and the donut
export const MACHINE_STATES = [
  { key: 'running', label: 'Running', color: 'good' },
  { key: 'idle', label: 'Idle', color: 'warning' },
  { key: 'alarm', label: 'Alarm', color: 'critical' },
  { key: 'off', label: 'Off', color: 'neutral', muted: true }, // absence of work: drawn faded
]

// Trend time ranges (the last … of readings)
const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS
export const TIME_RANGES = [
  { key: '1m', label: '1 Minute', ms: MINUTE_MS },
  { key: '30m', label: '30 Minutes', ms: 30 * MINUTE_MS },
  { key: '1h', label: 'Hour', ms: HOUR_MS },
  { key: '12h', label: '12 Hours', ms: 12 * HOUR_MS },
  { key: '1d', label: '1 Day', ms: 24 * HOUR_MS },
  { key: 'all', label: 'All', ms: Infinity },
]
export const DEFAULT_RANGE = '1h'

// Date filters: how far back a chart may look, and the day count of a date range (default / longest)
export const HEALTH_DATE_MIN = shiftIsoDate(todayIso(), -365)
export const DEFAULT_RANGE_DAYS = 14
export const MAX_RANGE_DAYS = 31

export const formatValue = (value, decimals = 0) =>
  Number(value).toLocaleString(PICKER_LOCALE, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

// 7.5 → "7h 30m"
export const formatHours = (hours) => {
  const minutes = Math.round(hours * 60)
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

const clockSeconds = new Intl.DateTimeFormat(PICKER_LOCALE, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
const clock = new Intl.DateTimeFormat(PICKER_LOCALE, { hour: '2-digit', minute: '2-digit' })
const dayClock = new Intl.DateTimeFormat(PICKER_LOCALE, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
const fullTime = new Intl.DateTimeFormat(PICKER_LOCALE, {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

// Axis ticks get finer as the range gets shorter
export const tickFormatter = (rangeMs) => {
  if (rangeMs < HOUR_MS) return (time) => clockSeconds.format(time)
  if (rangeMs <= 24 * HOUR_MS) return (time) => clock.format(time)
  return (time) => dayClock.format(time)
}

export const formatTimestamp = (time) => fullTime.format(time)
