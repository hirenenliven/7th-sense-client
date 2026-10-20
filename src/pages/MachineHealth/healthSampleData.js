import { PICKER_LOCALE, parseIsoDate, shiftIsoDate } from '@/utils/dateTime'
import { HYDRAULIC_OIL_TEMP, MACHINE_STATES, SPINDLE_LOAD, TEMPERATURE_GROUP, TREND_SENSORS } from './healthSensors'

// SAMPLE readings for the Machine Health charts. The server has no sensor-data API yet; replace these
// functions with service calls (same shapes) when it does. Every value is seeded by the machine id and
// the date, so a machine shows the same sample for a day whatever range or chart asks for it.

const STEP_MS = 10_000 // one reading every 10 s
const HOUR_MS = 3_600_000
const DAY_MS = 24 * HOUR_MS
const GROUP_STEP_HOURS = 3 // grouped temperatures: a snapshot every 3 h of the day
const AVERAGE_DAYS = 7
// Trend charts draw at most this many points; longer ranges are bucketed (peak kept, see pointsInRange)
export const MAX_TREND_POINTS = 240

// Small seeded PRNG (mulberry32): repeatable numbers for a seed
const seededRandom = (seed) => {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let next = Math.imul(state ^ (state >>> 15), 1 | state)
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}

// FNV-1a: a string → 32-bit seed
const hashSeed = (text) => {
  let hash = 0x811c9dc5
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

const randomFor = (machineId, isoDate, salt) => seededRandom(hashSeed(`${machineId}|${isoDate}|${salt}`))

const round = (value, decimals) => Number(value.toFixed(decimals))

// Shop-floor load over the day: low at night, highest mid-afternoon (0 … 1)
const dayLoad = (time) => {
  const date = new Date(time)
  const hour = date.getHours() + date.getMinutes() / 60
  return 0.5 + 0.5 * Math.sin(((hour - 8) / 24) * 2 * Math.PI)
}

// The day's readings: from midnight to the end of the day, or to now for today ([] for a future day)
const dayWindow = (isoDate) => {
  const start = parseIsoDate(isoDate).getTime()
  const now = Math.floor(Date.now() / STEP_MS) * STEP_MS
  return { start, end: Math.min(start + DAY_MS - STEP_MS, now) }
}

// A sensor's readings every STEP_MS over one day: daily load curve + slow random drift + rare spikes
const buildDay = (machineId, { key, sample, decimals = 1 }, isoDate) => {
  const { start, end } = dayWindow(isoDate)
  if (end < start) return []
  const random = randomFor(machineId, isoDate, key)
  const { base, swing, noise } = sample
  const points = []
  let drift = 0
  for (let time = start; time <= end; time += STEP_MS) {
    drift = drift * 0.98 + (random() - 0.5) * noise
    const spike = random() < 0.0006 ? swing * (1 + random()) : 0
    points.push({ time, value: round(Math.max(0, base + swing * dayLoad(time) + drift + spike), decimals) })
  }
  return points
}

const SENSORS_BY_KEY = Object.fromEntries([...TREND_SENSORS, HYDRAULIC_OIL_TEMP].map((sensor) => [sensor.key, sensor]))

// One sensor over one day: [{ time, value }]
export const sensorDay = (machineId, sensorKey, isoDate) => buildDay(machineId, SENSORS_BY_KEY[sensorKey], isoDate)

// Readings of the last `rangeMs`, at most `max` points: each bucket keeps its highest reading so a
// short spike still shows on a long range
export const pointsInRange = (points, rangeMs, max = MAX_TREND_POINTS) => {
  if (!points.length) return points
  const from = points[points.length - 1].time - rangeMs
  const inRange = Number.isFinite(rangeMs) ? points.filter((point) => point.time >= from) : points
  if (inRange.length <= max) return inRange
  const size = Math.ceil(inRange.length / max)
  const buckets = []
  for (let start = 0; start < inRange.length; start += size) {
    const bucket = inRange.slice(start, start + size)
    buckets.push(bucket.reduce((peak, point) => (point.value > peak.value ? point : peak)))
  }
  return buckets
}

const dayLabel = new Intl.DateTimeFormat(PICKER_LOCALE, { day: '2-digit', month: 'short' })
const hourLabel = new Intl.DateTimeFormat(PICKER_LOCALE, { hour: '2-digit', minute: '2-digit' })

const readingAt = (points, time) => points[Math.max(0, points.findLastIndex((point) => point.time <= time))].value

// Grouped bars: the four temperatures every GROUP_STEP_HOURS of the day (up to now for today)
export const hourlyTemperatures = (machineId, isoDate) => {
  const series = TEMPERATURE_GROUP.map((item) => [item.key, sensorDay(machineId, item.key, isoDate)])
  const { start, end } = dayWindow(isoDate)
  const rows = []
  for (let time = start; time <= end; time += GROUP_STEP_HOURS * HOUR_MS) {
    const row = { label: hourLabel.format(time) }
    series.forEach(([key, points]) => {
      row[key] = readingAt(points, time)
    })
    rows.push(row)
  }
  return rows
}

// A day's hours per machine state (they add up to 24)
const dayStates = (machineId, isoDate) => {
  const random = randomFor(machineId, isoDate, 'states')
  const running = round(9 + random() * 10, 1)
  const alarm = round(random() * 1.4, 1)
  const idle = round(Math.min(24 - running - alarm, 1 + random() * 4), 1)
  return { running, idle, alarm, off: round(24 - running - alarm - idle, 1) }
}

// Donut: [{ key, label, hours }] of one day, in MACHINE_STATES order
export const stateShare = (machineId, isoDate) => {
  const hours = dayStates(machineId, isoDate)
  return MACHINE_STATES.map((state) => ({ key: state.key, label: state.label, hours: hours[state.key] }))
}

// One row per day from … to: state hours, run hours' 7-day average (counting the days before `from`)
// and their running total over the range
export const dailyRows = (machineId, from, to) => {
  const rows = []
  let total = 0
  for (let isoDate = from; isoDate <= to; isoDate = shiftIsoDate(isoDate, 1)) {
    const states = dayStates(machineId, isoDate)
    let week = 0
    for (let back = 0; back < AVERAGE_DAYS; back += 1) {
      week += back === 0 ? states.running : dayStates(machineId, shiftIsoDate(isoDate, -back)).running
    }
    total += states.running
    rows.push({
      label: dayLabel.format(parseIsoDate(isoDate)),
      ...states,
      average: round(week / AVERAGE_DAYS, 1),
      cumulative: round(total, 1),
    })
  }
  return rows
}

export const runHours = (machineId, isoDate) => dayStates(machineId, isoDate).running

// Subsystem scores (100 = healthy) for the radar
export const subsystemScores = (machineId, isoDate) => {
  const random = randomFor(machineId, isoDate, 'subsystems')
  return ['Spindle', 'Hydraulics', 'Lubrication', 'Coolant', 'Pneumatics', 'Electrical'].map((name) => ({
    name,
    score: Math.round(62 + random() * 36),
  }))
}

// Spindle load (%) now for today, at the end of the day for a past day
export const spindleLoad = (machineId, isoDate) => {
  const random = randomFor(machineId, isoDate, 'load')
  return round(SPINDLE_LOAD.min + 30 + random() * 55, 1)
}
