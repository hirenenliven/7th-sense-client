// Operations › Monitoring › a machine › Virtual Screen (VirtualScreen.jsx)

// The screen reloads GET /productivity/virtual-screen this often; the clock and the running cycle
// move every second in between
export const VIRTUAL_SCREEN_REFRESH_MS = 5_000
export const VIRTUAL_SCREEN_TICK_MS = 1_000

// Live values older than this are shown as stale (the collector stopped sending)
export const STALE_AFTER_MS = 60_000

// Override dials: 0 … 120 %, the programmed speed / feed at 100 %
export const OVERRIDE_MAX = 120
export const OVERRIDE_PROGRAMMED = 100

// Axis load bars: status colour from these (%), like the spindle load gauge
export const AXIS_LOAD = { warning: 70, critical: 90 }
export const AXES = [
  { key: 'axisLoadX', label: 'X' },
  { key: 'axisLoadY', label: 'Y' },
  { key: 'axisLoadZ', label: 'Z' },
]

// Progress bars stop short of full while the cycle / batch still runs past its plan
export const RUNNING_PROGRESS_CAP = 99

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

// 12.345 → "12.3"; null → "—"
export const formatReading = (value, digits = 1) =>
  value == null ? '—' : value.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })

// Shares (0 … 100) of a done / planned pair; null when nothing is planned
export const shareOf = (done, planned) => (planned > 0 ? clamp((done / planned) * 100, 0, 100) : null)

// Seconds the running cycle has taken now: the server's elapsed plus the time since it was read
export const cycleElapsed = (cycle, readAt, now) => (cycle ? cycle.elapsedSec + Math.max(0, (now - readAt) / 1000) : 0)

// Batch remaining seconds: the parts still to make × the planned cycle time
export const batchRemainingSec = (job) =>
  job?.standardCycleSec ? Math.max(0, job.quantity - job.completedCycles) * job.standardCycleSec : null

