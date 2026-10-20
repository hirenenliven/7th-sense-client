import { PICKER_LOCALE } from '@/utils/dateTime'
import { HYDRAULIC_OIL_TEMP, MACHINE_STATES, SPINDLE_LOAD, TREND_SENSORS } from './healthSensors'

// SAMPLE readings for the Machine Health charts. The server has no sensor-data API yet; replace
// buildHealthSample with a service call (same shapes) when it does. Seeded by the machine id, so a
// machine always shows the same sample.

const STEP_MS = 10_000 // one reading every 10 s
const HOUR_MS = 3_600_000
const DAY_MS = 24 * HOUR_MS
const HISTORY_DAYS = 14
const GROUP_HOURS = 8
// Trend charts draw at most this many points; longer ranges are bucketed (peak kept, see downsample)
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

const round = (value, decimals) => Number(value.toFixed(decimals))

// Shop-floor load over the day: low at night, highest mid-afternoon (0 … 1)
const dayLoad = (time) => {
  const date = new Date(time)
  const hour = date.getHours() + date.getMinutes() / 60
  return 0.5 + 0.5 * Math.sin(((hour - 8) / 24) * 2 * Math.PI)
}

// 24 h of readings every STEP_MS: daily load curve + a slow random drift + rare short spikes
const buildSeries = (random, { base, swing, noise }, end, decimals) => {
  const count = DAY_MS / STEP_MS
  const points = new Array(count + 1)
  let drift = 0
  for (let index = 0; index <= count; index += 1) {
    const time = end - (count - index) * STEP_MS
    drift = drift * 0.98 + (random() - 0.5) * noise
    const spike = random() < 0.0006 ? swing * (1 + random()) : 0
    points[index] = { time, value: round(Math.max(0, base + swing * dayLoad(time) + drift + spike), decimals) }
  }
  return points
}

// Readings of the last `rangeMs`, at most `max` points: each bucket keeps its highest reading so a
// short spike still shows on a long range
export const pointsInRange = (points, rangeMs, max = MAX_TREND_POINTS) => {
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

export const buildHealthSample = (machineId) => {
  const random = seededRandom(Number(machineId) * 7919 + 17)
  const now = Math.floor(Date.now() / STEP_MS) * STEP_MS

  // Trend series (+ hydraulic oil for the grouped chart)
  const series = {}
  TREND_SENSORS.forEach((sensor) => {
    series[sensor.key] = buildSeries(random, sensor.sample, now, sensor.decimals)
  })
  series[HYDRAULIC_OIL_TEMP.key] = buildSeries(random, HYDRAULIC_OIL_TEMP.sample, now, 1)

  // Grouped bars: the four temperatures at each of the last GROUP_HOURS full hours
  const lastHour = Math.floor(now / HOUR_MS) * HOUR_MS
  const hourly = Array.from({ length: GROUP_HOURS }, (_, index) => {
    const time = lastHour - (GROUP_HOURS - 1 - index) * HOUR_MS
    const row = { label: hourLabel.format(time) }
    ;['bearingTemp', 'spindleMotorTemp', 'headstockTemp', HYDRAULIC_OIL_TEMP.key].forEach((key) => {
      row[key] = readingAt(series[key], time)
    })
    return row
  })

  // Daily: machine-state hours (24 h a day), run hours with their 7-day average and running total
  let total = 0
  const daily = Array.from({ length: HISTORY_DAYS }, (_, index) => {
    const day = new Date(now - (HISTORY_DAYS - 1 - index) * DAY_MS)
    const running = round(9 + random() * 10, 1)
    const alarm = round(random() * 1.4, 1)
    const idle = round(Math.min(24 - running - alarm, 1 + random() * 4), 1)
    const off = round(24 - running - alarm - idle, 1)
    total += running
    return { label: dayLabel.format(day), running, idle, alarm, off, cumulative: round(total, 1) }
  })
  daily.forEach((row, index) => {
    const week = daily.slice(Math.max(0, index - 6), index + 1)
    row.average = round(week.reduce((sum, day) => sum + day.running, 0) / week.length, 1)
  })

  const today = daily[daily.length - 1]
  const stateShare = MACHINE_STATES.map((state) => ({ ...state, hours: today[state.key] }))

  // Subsystem scores (100 = healthy) for the radar
  const subsystems = ['Spindle', 'Hydraulics', 'Lubrication', 'Coolant', 'Pneumatics', 'Electrical'].map((name) => ({
    name,
    score: Math.round(62 + random() * 36),
  }))

  const spindleLoad = round(SPINDLE_LOAD.min + 30 + random() * 55, 1)

  return { series, hourly, daily, stateShare, subsystems, spindleLoad, runHoursToday: today.running }
}
