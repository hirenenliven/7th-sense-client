// Operations › Monitoring › a machine › Virtual Screen (VirtualScreen.jsx)

// Without the live socket the screen reloads GET /productivity/virtual-screen this often; the clock
// and the running cycle move every second in between
export const VIRTUAL_SCREEN_REFRESH_MS = 5_000
export const VIRTUAL_SCREEN_TICK_MS = 1_000

// With the live socket the values are pushed as they change (ADR 0021); the REST data (job, cycle,
// last read time) is still reloaded this often, under STALE_AFTER_MS so a steady machine whose
// values do not change is not shown as stale
export const VIRTUAL_SCREEN_SAFETY_REFRESH_MS = 30_000

// Live values older than this are shown as stale (the collector stopped sending)
export const STALE_AFTER_MS = 60_000

// Override dials: 0 … 120 % (100 % = the programmed speed / feed)
export const OVERRIDE_MAX = 120

// Axis load strips, in the order of the readings beside them
export const AXES = [
  { key: 'axisLoadX', label: 'X' },
  { key: 'axisLoadY', label: 'Y' },
  { key: 'axisLoadZ', label: 'Z' },
]

// Progress bars stop short of full while the cycle / batch still runs past its plan
export const RUNNING_PROGRESS_CAP = 99

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

// 12.345 → "12.3"; null → "—"
export const formatReading = (value, digits = 1) =>
  value == null ? '—' : value.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })

// Shares (0 … 100) of a done / planned pair; null when nothing is planned
export const shareOf = (done, planned) => (planned > 0 ? clamp((done / planned) * 100, 0, 100) : null)

// Seconds the running cycle has taken now: the server's elapsed plus the time since it was read
export const cycleElapsed = (cycle, readAt, now) => (cycle ? cycle.elapsedSec + Math.max(0, (now - readAt) / 1000) : 0)

// Live codes (constants/live.js LIVE_CODES.VIRTUAL_SCREEN) → the fields of the REST `live` object
const LIVE_FIELDS = {
  SpindleLoad: 'spindleLoad',
  SpindleRpm: 'spindleSpeed',
  speedOvr: 'spindleOverride',
  feedRateOvr: 'feedOverride',
  actFeedRate: 'feedRate',
  axLoadX: 'axisLoadX',
  axLoadY: 'axisLoadY',
  axLoadZ: 'axisLoadZ',
  toolNumber: 'toolNumber',
}

// FeedRev values (the server's feedUnits; unknown = mm/min)
const FEED_UNITS = ['mm/min', 'mm/rev', 'inch/min', 'inch/rev']

// The later of two ISO times (either may be null; offsets may differ, so compared as dates)
const newest = (first, second) => (!first ? second : !second ? first : Date.parse(first) >= Date.parse(second) ? first : second)

// The alarm the live Alarm / alarmMsg values show: a non-zero number is an active alarm, 0 clears it
const liveAlarm = (alarm, values, at) => {
  if (values.Alarm == null) return alarm
  if (!values.Alarm) return alarm?.active ? { ...alarm, active: false } : alarm
  if (alarm?.active && alarm.code === values.Alarm) return alarm
  return { code: values.Alarm, message: values.alarmMsg ?? '', at: at ?? new Date().toISOString(), active: true }
}

// The REST screen with the live socket's values and status on top (they are never older: the server
// pushes a reading before it stores it). Cycle, job and alarm history stay from REST. With the socket
// down its values are frozen, so the polled REST data is shown as it is.
export const withLiveValues = (screen, { values, at, status, connected }) => {
  if (!screen || !connected) return screen
  const live = { ...screen.live, updatedAt: newest(screen.live.updatedAt, at) }
  Object.entries(LIVE_FIELDS).forEach(([code, field]) => {
    if (values[code] != null) live[field] = values[code]
  })
  if (values.FeedRev != null) live.feedUnit = FEED_UNITS[values.FeedRev] ?? FEED_UNITS[0]
  if (values.isEmergency != null) live.emergency = values.isEmergency !== 0

  const merged = { ...screen, live, alarm: liveAlarm(screen.alarm, values, at) }
  if (values.progName) merged.programName = values.progName
  if (status) {
    merged.online = status.online
    if (status.modeId !== screen.modeId) merged.modeName = ''
    merged.modeId = status.modeId
    merged.modeSince = status.modeSince
    if (status.programName) merged.programName = values.progName || status.programName
  }
  return merged
}

// Batch remaining seconds: the parts still to make × the planned cycle time
export const batchRemainingSec = (job) =>
  job?.standardCycleSec ? Math.max(0, job.quantity - job.completedCycles) * job.standardCycleSec : null

