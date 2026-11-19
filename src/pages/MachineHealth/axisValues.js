import { PICKER_LOCALE } from '@/utils/dateTime'

// Machine Health › Axis Values (AxisValuesCard.jsx): the X / Y / Z charts from machine_telementry
// (GET /machine-health/axis-values, server ADR 0018). Keys mirror server dto.AxisSets.
export const AXIS_SETS = [
  { key: 'machine_position', label: 'Machine position (MCS)' },
  { key: 'work_position', label: 'Work position (WCS)' },
  { key: 'relative_position', label: 'Relative position' },
  { key: 'distance_to_go', label: 'Distance to go' },
  { key: 'axis_load', label: 'Axis load' },
]
export const DEFAULT_AXIS_SET = AXIS_SETS[0].key

// Last … up to now. The server sends every stored value while an axis holds at most
// AXIS_MAX_RAW_VALUES in the range (server dto.AxisValuesMaxRawValues), else 600 time buckets
export const AXIS_RANGES = [
  { key: '5m', label: '5 Min', minutes: 5 },
  { key: '15m', label: '15 Min', minutes: 15 },
  { key: '1h', label: '1 Hour', minutes: 60 },
  { key: '12h', label: '12 Hours', minutes: 12 * 60 },
  { key: '1d', label: '1 Day', minutes: 24 * 60 },
  { key: '7d', label: '7 Days', minutes: 7 * 24 * 60 },
  { key: '30d', label: '30 Days', minutes: 30 * 24 * 60 },
]
export const DEFAULT_AXIS_RANGE = '1h'

// Ranges up to a day follow the clock; longer ones load once (each load reads up to millions of rows)
export const AXIS_REFRESH_MS = 30_000
export const AXIS_REFRESH_MAX_MINUTES = 24 * 60

export const AXIS_DECIMALS = 3
export const AXIS_MAX_RAW_VALUES = 20_000

// Zoom: the narrowest window a drag may select, and how much Zoom out widens the window
export const AXIS_MIN_ZOOM_MS = 1_000
export const AXIS_ZOOM_OUT_FACTOR = 2

// The window twice as wide around the same centre, never past now; null when it would cover the
// whole selected range (back to the range itself)
export const zoomedOut = (zoom, rangeMs, now = Date.now()) => {
  const width = (zoom.end - zoom.start) * AXIS_ZOOM_OUT_FACTOR
  if (width >= rangeMs) return null
  const centre = (zoom.start + zoom.end) / 2
  const end = Math.min(now, centre + width / 2)
  return { start: end - width, end }
}

const count = new Intl.NumberFormat(PICKER_LOCALE)
export const formatCount = (value) => count.format(value)
export const formatMs = (value) => `${count.format(Math.round(value))} ms`

// One axis as chart rows { time, value }: the value at the range start (stored before it), each
// bucket's last value, and the last value again at the range end, so a step line covers the range
// (values are stored only when they change, so a gap means "unchanged")
export const axisRows = (axis, from, to) => {
  const rows = []
  const start = new Date(from).getTime()
  const end = new Date(to).getTime()
  if (axis.startValue != null) rows.push({ time: start, value: axis.startValue })
  axis.points.forEach((point) => rows.push({ time: new Date(point.at).getTime(), value: point.value }))
  if (rows.length) rows.push({ time: end, value: rows[rows.length - 1].value })
  return rows
}
