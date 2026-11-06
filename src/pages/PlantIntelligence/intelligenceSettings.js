import { ROUTES } from '@/constants/routes'
import { machineMonitorPath, monitoringSearchPath } from '@/constants/monitoring'
import { PRODUCTION_TIME_KEY, UNFINISHED_WARNING, timeByMode } from '@/pages/Home/homeSettings'
import { FAIR_OEE, formatCount, percent } from '@/pages/Productivity/productivitySettings'
import { PICKER_LOCALE, formatModeDuration, parseIsoDate, shiftIsoDate } from '@/utils/dateTime'

// Main › Plant Intelligence (PlantIntelligence.jsx): what its panels work out from GET /dashboard/home
// of each day of the period. Every figure is the server's, a sum of its figures, or its formula applied
// to those sums (availability, quality); nothing is estimated. See ADR 0025.

export const PERIODS = [
  { value: 7, label: 'Last 7 days' },
  { value: 14, label: 'Last 14 days' },
  { value: 30, label: 'Last 30 days' },
]
export const DEFAULT_PERIOD = PERIODS[0].value

// Same modes as the server's OEE: cutting time, and planned stops left out of the planned time
const RUN_MODE_IDS = [3, 12]
const PLANNED_STOP_MODE_IDS = [7, 13]
const OFFLINE_TIME_KEY = 'mode-9'
const UNRECORDED_TIME_KEY = 'unrecorded'

// How much evidence a finding needs before it is shown
const MIN_TREND_DAYS = 4
const MIN_TREND_POINTS = 2
const MIN_MACHINES_TO_COMPARE = 3
const MIN_CYCLES_FOR_PARTS_CHECK = 20
const MIN_PART_SHARE = 50
const MIN_UNFINISHED = 3
const CYCLE_LEADERS = 3
const CYCLE_LEADERS_SHARE = 60
const SEVERITY_ORDER = { critical: 0, warning: 1, info: 2 }
export const INSIGHT_LIMIT = 7

export const ALARM_LIMIT = 8
export const OUTLOOK_DAYS = 7
export const STUCK_LIMIT = 4

const dayLabelFormat = new Intl.DateTimeFormat(PICKER_LOCALE, { day: '2-digit', month: 'short' })
const weekdayFormat = new Intl.DateTimeFormat(PICKER_LOCALE, { weekday: 'short' })
export const dayLabel = (date) => dayLabelFormat.format(parseIsoDate(date))
export const weekdayLabel = (date) => weekdayFormat.format(parseIsoDate(date))

const sum = (values) => values.reduce((total, value) => total + value, 0)
const mean = (values) => {
  const known = values.filter((value) => value != null)
  return known.length ? sum(known) / known.length : null
}
const share = (part, whole) => (whole > 0 ? (part / whole) * 100 : null)
const plural = (count, one, many = `${one}s`) => `${formatCount(count)} ${count === 1 ? one : many}`
const machinePath = (machine) => machineMonitorPath(ROUTES.MACHINE_PRODUCTIVITY, { id: machine.machineId })

// The machines' seconds per mode added up over the days
const addModeSeconds = (days) => {
  const seconds = new Map()
  days.forEach((day) => day.time.modes.forEach(({ modeId, durationSec }) => seconds.set(modeId, (seconds.get(modeId) ?? 0) + durationSec)))
  return [...seconds].map(([modeId, durationSec]) => ({ modeId, durationSec }))
}

// One row per day for the time chart: the share of each mode, of all the time or (`connectedOnly`) of
// the time the machines were connected, so a mostly offline fleet still shows how it used the rest
export const timeChart = (days, connectedOnly) => {
  const left = (row) => !connectedOnly || (row.key !== OFFLINE_TIME_KEY && row.key !== UNRECORDED_TIME_KEY)
  const series = new Map()
  const rows = days.map((day) => {
    const modes = timeByMode(day.time).filter(left)
    const whole = connectedOnly ? sum(modes.map((row) => row.value)) : day.time.spanSec
    const row = { date: day.date, label: dayLabel(day.date) }
    modes.forEach((mode) => {
      row[mode.key] = share(mode.value, whole) ?? 0
      if (mode.value > 0) series.set(mode.key, { key: mode.key, label: mode.label, color: mode.color, muted: mode.muted })
    })
    return row
  })
  return { rows, series: [...series.values()] }
}

// A machine's period out of its row of each day. `cells` holds the row per date; averages count only
// the days with a value. Machines are those of the newest day: the ones active now.
const machineRows = (days) => {
  const today = days.at(-1)
  return today.machines.map((machine) => {
    const cells = new Map()
    days.forEach((day) => {
      const row = day.machines.find((item) => item.machineId === machine.machineId)
      if (row) cells.set(day.date, row)
    })
    const rows = [...cells.values()]
    const completed = sum(rows.map((row) => row.completedCount))
    const unfinished = sum(rows.map((row) => row.unfinishedCount))
    const availability = mean(rows.map((row) => row.availability))
    return {
      ...machine,
      cells,
      availabilityAverage: availability,
      oeeAverage: mean(rows.map((row) => row.oee)),
      completed,
      unfinished,
      // A machine that never ran has 0 % every day: not low, just absent
      ran: completed + unfinished > 0 || (availability ?? 0) > 0,
    }
  })
}

// The alarm codes over the period, most raised first. `/dashboard/home` lists the top codes of each
// day, so a code raised rarely may be left out of a busy day.
const alarmRows = (days) => {
  const codes = new Map()
  days.forEach((day) =>
    day.alarms.forEach((alarm) => {
      const row = codes.get(alarm.code) ?? { code: alarm.code, message: '', count: 0, daysSeen: 0, lastAt: alarm.lastAt }
      row.count += alarm.count
      row.daysSeen += 1
      if (alarm.message) row.message = alarm.message
      if (alarm.lastAt > row.lastAt) row.lastAt = alarm.lastAt
      codes.set(alarm.code, row)
    }),
  )
  const rows = [...codes.values()].sort((a, b) => b.count - a.count)
  const total = sum(rows.map((row) => row.count))
  let running = 0
  return rows.map((row) => {
    running += row.count
    return { ...row, share: share(row.count, total), cumulative: share(running, total) }
  })
}

// Everything the panels need out of the days (oldest first, the newest is today)
export const analyse = (days) => {
  const modes = addModeSeconds(days)
  const spanSec = sum(days.map((day) => day.time.spanSec))
  const secondsIn = (ids) => sum(modes.filter((mode) => ids.includes(mode.modeId)).map((mode) => mode.durationSec))
  const completed = sum(days.map((day) => day.cycles.completedCount))
  const unfinished = sum(days.map((day) => day.cycles.unfinishedCount))
  const timeRows = timeByMode({ modes, spanSec })
  const lost = timeRows.filter((row) => row.key === OFFLINE_TIME_KEY || row.key === UNRECORDED_TIME_KEY)
  const trend = days.map((day) => ({
    date: day.date,
    label: dayLabel(day.date),
    availability: day.oee?.availability ?? null,
    performance: day.oee?.performance ?? null,
    quality: day.oee?.quality ?? null,
    oee: day.oee?.oee ?? null,
    finished: day.cycles.completedCount,
    unfinished: day.cycles.unfinishedCount,
    closedQuality: share(day.cycles.completedCount, day.cycles.completedCount + day.cycles.unfinishedCount),
    alarms: sum(day.alarms.map((alarm) => alarm.count)),
    connected: share(sum(timeByMode(day.time).filter((row) => row.key !== OFFLINE_TIME_KEY && row.key !== UNRECORDED_TIME_KEY).map((row) => row.value)), day.time.spanSec),
  }))

  return {
    spanSec,
    timeRows,
    trend,
    machines: machineRows(days),
    alarms: alarmRows(days),
    completed,
    unfinished,
    partsMade: sum(days.map((day) => day.cycles.partsMade)),
    // The server's formulas over the whole period, so the days weigh by their time and cycles
    availability: share(secondsIn(RUN_MODE_IDS), spanSec - secondsIn(PLANNED_STOP_MODE_IDS)),
    quality: share(completed, completed + unfinished),
    connected: share(spanSec - sum(lost.map((row) => row.value)), spanSec),
    oeeAverage: mean(trend.map((day) => day.oee)),
    alarmCount: sum(trend.map((day) => day.alarms)),
    plannedDays: days.filter((day) => day.plan).length,
  }
}

// The largest share of the time that is not production
const biggestTimeLoss = ({ timeRows, spanSec }, periodLabel) => {
  const loss = timeRows.filter((row) => row.key !== PRODUCTION_TIME_KEY).sort((a, b) => b.value - a.value)[0]
  if (!loss?.value || !spanSec) return null
  const production = timeRows.find((row) => row.key === PRODUCTION_TIME_KEY)?.value ?? 0
  return {
    key: 'time-loss',
    severity: 'critical',
    icon: 'bi-hourglass-bottom',
    title: `${loss.label} took ${percent(share(loss.value, spanSec))} of machine time`,
    detail: [
      `${formatModeDuration(loss.value)} over the ${periodLabel}; In Production ${percent(share(production, spanSec))}`,
      // Every active machine counts for the whole period, also before it was added
      loss.key === UNRECORDED_TIME_KEY && 'Nothing was collected: includes time before a machine was added',
    ]
      .filter(Boolean)
      .join('. '),
    to: loss.key === UNRECORDED_TIME_KEY ? ROUTES.MONITORING : monitoringSearchPath(loss.label),
  }
}

// Availability of the later finished days against the earlier ones (today is only part of a day)
const availabilityTrend = ({ trend }) => {
  const finished = trend.slice(0, -1).map((day) => day.availability).filter((value) => value != null)
  if (finished.length < MIN_TREND_DAYS) return null
  const middle = Math.floor(finished.length / 2)
  const earlier = mean(finished.slice(0, middle))
  const later = mean(finished.slice(middle))
  const change = later - earlier
  if (Math.abs(change) < MIN_TREND_POINTS) return null
  return {
    key: 'availability-trend',
    severity: change < 0 ? 'warning' : 'info',
    icon: change < 0 ? 'bi-graph-down-arrow' : 'bi-graph-up-arrow',
    title: `Availability ${change < 0 ? 'fell' : 'rose'} ${Math.abs(change).toFixed(1)} points`,
    detail: `${percent(earlier)} in the earlier days, ${percent(later)} in the later ones (today left out)`,
  }
}

const silentMachines = ({ machines }, periodLabel) => {
  const silent = machines.filter((machine) => !machine.ran).length
  if (!silent) return null
  return {
    key: 'silent',
    severity: silent === machines.length ? 'critical' : 'warning',
    icon: 'bi-wifi-off',
    title: `${formatCount(silent)} of ${plural(machines.length, 'machine')} did not run in the ${periodLabel}`,
    detail: 'No run time and no cycle: not connected, not used, or not set up yet',
    to: ROUTES.MONITORING,
  }
}

const weakestMachine = ({ machines, availability }) => {
  const running = machines.filter((machine) => machine.ran && machine.availabilityAverage != null)
  if (running.length < MIN_MACHINES_TO_COMPARE) return null
  const weakest = running.reduce((lowest, machine) => (machine.availabilityAverage < lowest.availabilityAverage ? machine : lowest))
  return {
    key: 'weakest',
    severity: weakest.availabilityAverage < FAIR_OEE ? 'warning' : 'info',
    icon: 'bi-sort-down',
    title: `${weakest.machineName} has the lowest availability of the machines that ran`,
    detail: `${percent(weakest.availabilityAverage)} a day on average; every machine together ${percent(availability)}`,
    to: machinePath(weakest),
  }
}

const cycleLeaders = ({ machines, completed }) => {
  const producing = machines.filter((machine) => machine.completed > 0).sort((a, b) => b.completed - a.completed)
  if (producing.length <= CYCLE_LEADERS) return null
  const leaders = producing.slice(0, CYCLE_LEADERS)
  const leadersShare = share(sum(leaders.map((machine) => machine.completed)), completed)
  if (leadersShare < CYCLE_LEADERS_SHARE) return null
  return {
    key: 'leaders',
    severity: 'info',
    icon: 'bi-pie-chart',
    title: `${CYCLE_LEADERS} machines made ${percent(leadersShare)} of the completed cycles`,
    detail: leaders.map((machine) => machine.machineName).join(', '),
  }
}

const unfinishedCycles = ({ machines, completed, unfinished }) => {
  const rate = share(unfinished, completed + unfinished)
  if (unfinished < MIN_UNFINISHED || rate < UNFINISHED_WARNING) return null
  const worst = machines.reduce((highest, machine) => (machine.unfinished > highest.unfinished ? machine : highest))
  return {
    key: 'unfinished',
    severity: 'warning',
    icon: 'bi-x-octagon',
    title: `${percent(rate)} of closed cycles were left unfinished`,
    detail: `${formatCount(unfinished)} in all, ${formatCount(worst.unfinished)} on ${worst.machineName}`,
    to: machinePath(worst),
  }
}

// A code seen on most days is a standing problem, unlike one bad day of many raises
const chronicAlarm = ({ alarms, trend }) => {
  const top = alarms[0]
  if (!top) return null
  const chronic = top.daysSeen >= Math.max(2, Math.ceil(trend.length / 2))
  return {
    key: 'alarm',
    severity: chronic ? 'warning' : 'info',
    icon: 'bi-bell',
    title: `Alarm ${top.code} is ${percent(top.share)} of alarm raises`,
    detail: [top.message, `seen on ${plural(top.daysSeen, 'day')} of ${formatCount(trend.length)}`].filter(Boolean).join(' · '),
  }
}

const planCoverage = ({ plannedDays, trend }) =>
  plannedDays >= trend.length
    ? null
    : {
        key: 'plan',
        severity: 'info',
        icon: 'bi-calendar-x',
        title: plannedDays ? `Only ${formatCount(plannedDays)} of ${plural(trend.length, 'day')} had a job scheduled` : 'No job was scheduled in this period',
        detail: 'Production cannot be compared with a plan on the other days',
        to: ROUTES.PRODUCTION_SCHEDULE,
      }

// Figures that look fine but cannot be relied on: the server reports Performance as 100 % when cycles
// have no standard time, so OEE then says nothing about speed
const performanceWithoutStandard = ({ machines }) => {
  const known = machines.flatMap((machine) => [...machine.cells.values()].map((row) => row.performance)).filter((value) => value != null)
  if (!known.length || known.some((value) => value !== 100)) return null
  return {
    key: 'performance',
    severity: 'warning',
    icon: 'bi-speedometer',
    title: 'Performance is exactly 100% on every machine',
    detail: 'As the server reports when cycles have no standard time. OEE then shows no speed loss: check cycle times on the parts and schedule',
    to: ROUTES.PARTS,
  }
}

const partCounters = ({ completed, partsMade }) => {
  if (completed < MIN_CYCLES_FOR_PARTS_CHECK || share(partsMade, completed) >= MIN_PART_SHARE) return null
  return {
    key: 'parts',
    severity: 'info',
    icon: 'bi-box-seam',
    title: `${plural(partsMade, 'part')} counted for ${plural(completed, 'completed cycle')}`,
    detail: 'The controllers report few parts, so this page measures output in cycles',
  }
}

// What the period's figures say, in words and most serious first. Each finding needs enough evidence
// and names its numbers; a link opens where it can be looked into.
export const buildInsights = (analysis, periodLabel) =>
  [
    biggestTimeLoss(analysis, periodLabel),
    availabilityTrend(analysis),
    silentMachines(analysis, periodLabel),
    performanceWithoutStandard(analysis),
    unfinishedCycles(analysis),
    chronicAlarm(analysis),
    weakestMachine(analysis),
    cycleLeaders(analysis),
    planCoverage(analysis),
    partCounters(analysis),
  ]
    .filter(Boolean)
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])

// Lines compared (customers when several are in view): machines, how many ran, their average
// availability (every machine has the same planned time, so a plain average) and cycles
export const groupRows = (machines, lineOf, byCustomer) => {
  const groups = new Map()
  machines.forEach((machine) => {
    const name = byCustomer ? machine.customerName || '—' : lineOf.get(machine.machineId) || 'No line'
    if (!groups.has(name)) groups.set(name, [])
    groups.get(name).push(machine)
  })
  return [...groups].map(([name, rows]) => {
    const completed = sum(rows.map((row) => row.completed))
    const unfinished = sum(rows.map((row) => row.unfinished))
    return {
      name,
      machineCount: rows.length,
      ranCount: rows.filter((row) => row.ran).length,
      onlineCount: rows.filter((row) => row.onlineStatus).length,
      availability: mean(rows.map((row) => row.availabilityAverage)),
      completed,
      unfinishedRate: share(unfinished, completed + unfinished),
    }
  })
}

// The days ahead: which machines have a schedule, how many shifts work, a holiday or week off. Holidays
// and shifts belong to one company: `shifts` / `holidays` are null when several are in view.
export const outlookRows = ({ today, schedules, shifts, holidays, dayOffName }) =>
  Array.from({ length: OUTLOOK_DAYS }, (_, index) => {
    const date = shiftIsoDate(today, index)
    const day = parseIsoDate(date)
    const weekDay = ((day.getDay() + 6) % 7) + 1 // 1 = Monday, like shifts.working_days
    const scheduled = schedules.filter((row) => row.status === 'active' && row.startDate <= date && date <= row.endDate)
    return {
      date,
      machines: [...new Set(scheduled.map((row) => row.machineName))],
      shiftCount: shifts ? shifts.filter((shift) => shift.workingDays?.includes(weekDay)).length : null,
      dayOff: holidays ? dayOffName(holidays, date) : null,
    }
  })
