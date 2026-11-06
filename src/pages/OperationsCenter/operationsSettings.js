import { ROUTES } from '@/constants/routes'
import { machineMonitorPath, monitoringSearchPath } from '@/constants/monitoring'
import { ATTENTION_MINUTES, FLEET_MODES, OTHER_MODE, UNFINISHED_WARNING, secondsInMode, unfinishedRate } from '@/pages/Home/homeSettings'
import { FAIR_OEE, formatCount, percent } from '@/pages/Productivity/productivitySettings'
import { clockToMinutes, daysBetweenIso, formatModeDuration, parseIsoDate } from '@/utils/dateTime'

// Main › Operations Center (OperationsCenter.jsx): what each panel works out from the server's data.
// Every figure is the server's or a plain count of its rows; nothing is estimated.

// Trend charts: the day shown and the days before it
export const TREND_DAYS = 7
// Trends and readiness change slowly and cost the server more: reloaded less often than the live data
export const SLOW_REFRESH_MS = 300_000

// Action queue: rows shown, and how much it takes to list a machine or an alarm
export const ACTION_LIMIT = 8
const LOW_OEE_ACTIONS = 3
const MIN_CLOSED_CYCLES = 3
const MIN_ALARM_RAISES = 3

// Readiness: warranties and licences are flagged this many days before they end
const EXPIRY_WARNING_DAYS = 30

// Production plan table: rows shown (the whole schedule is one link away)
export const PLAN_LIMIT = 8

const SEVERITY_ORDER = { critical: 0, warning: 1, info: 2 }
export const SEVERITY_TONE = { critical: 'critical', warning: 'warning', info: 'info' }

const OEE_FACTORS = [
  { key: 'availability', label: 'Availability', letter: 'A' },
  { key: 'performance', label: 'Performance', letter: 'P' },
  { key: 'quality', label: 'Quality', letter: 'Q' },
]
export const oeeFactors = (row) => OEE_FACTORS.map((factor) => ({ ...factor, value: row?.[factor.key] ?? null }))

// The lowest factor of an OEE row: where the most is lost (null before any factor is known)
export const biggestLoss = (row) =>
  oeeFactors(row)
    .filter((factor) => factor.value != null)
    .reduce((lowest, factor) => (!lowest || factor.value < lowest.value ? factor : lowest), null)

const machinePath = (machine) => machineMonitorPath(ROUTES.MACHINE_PRODUCTIVITY, { id: machine.machineId })
const modeIn = (machine, ids) => ids.includes(machine.modeId)
const fleetMode = (id) => FLEET_MODES.find((mode) => mode.id === id)
const PRODUCTION_PARTS = fleetMode(3).parts
const DOWNTIME_MODE = 6
const HOLD_MODE = 4
const plural = (count, one, many = `${one}s`) => `${formatCount(count)} ${count === 1 ? one : many}`

// Machines stuck in Downtime or Hold now (the Home rule)
const stuckActions = (machines, serverTime) =>
  machines
    .filter((machine) => modeIn(machine, [DOWNTIME_MODE, HOLD_MODE]))
    .map((machine) => ({ machine, seconds: secondsInMode(machine, serverTime) }))
    .filter(({ seconds }) => seconds >= ATTENTION_MINUTES * 60)
    .map(({ machine, seconds }) => ({
      key: `stuck-${machine.machineId}`,
      severity: machine.modeId === DOWNTIME_MODE ? 'critical' : 'warning',
      icon: machine.modeId === DOWNTIME_MODE ? 'bi-exclamation-octagon' : 'bi-pause-circle',
      title: `${machine.machineName} in ${fleetMode(machine.modeId).label} for ${formatModeDuration(seconds)}`,
      detail: machine.plannedQuantity != null ? `Has a job scheduled · Qty. ${formatCount(machine.plannedQuantity)}` : 'No job scheduled',
      weight: seconds,
      machine,
      to: machinePath(machine),
    }))

// A job is planned on a machine that sends nothing: the schedule cannot be met
const scheduledOfflineActions = (machines) =>
  machines
    .filter((machine) => machine.plannedQuantity != null && !machine.onlineStatus)
    .map((machine) => ({
      key: `scheduled-offline-${machine.machineId}`,
      severity: 'critical',
      icon: 'bi-wifi-off',
      title: `${machine.machineName} is offline with a job scheduled`,
      detail: `Qty. ${formatCount(machine.plannedQuantity)} planned today`,
      weight: machine.plannedQuantity,
      machine,
      to: machinePath(machine),
    }))

const lowOeeActions = (machines) =>
  machines
    .filter((machine) => machine.oee != null && machine.oee < FAIR_OEE && machine.onlineStatus)
    .sort((a, b) => a.oee - b.oee)
    .slice(0, LOW_OEE_ACTIONS)
    .map((machine) => {
      const loss = biggestLoss(machine)
      return {
        key: `oee-${machine.machineId}`,
        severity: 'warning',
        icon: 'bi-graph-down-arrow',
        title: `${machine.machineName}: OEE ${percent(machine.oee)}`,
        detail: loss ? `Biggest loss: ${loss.label} ${percent(loss.value)}` : undefined,
        weight: 100 - machine.oee,
        machine,
        to: machinePath(machine),
      }
    })

const unfinishedActions = (machines) =>
  machines
    .filter((machine) => machine.completedCount + machine.unfinishedCount >= MIN_CLOSED_CYCLES && unfinishedRate(machine) >= UNFINISHED_WARNING)
    .map((machine) => ({
      key: `unfinished-${machine.machineId}`,
      severity: 'warning',
      icon: 'bi-x-octagon',
      title: `${machine.machineName}: ${percent(unfinishedRate(machine))} of cycles unfinished`,
      detail: `${formatCount(machine.unfinishedCount)} unfinished, ${formatCount(machine.completedCount)} completed`,
      weight: unfinishedRate(machine),
      machine,
      to: machinePath(machine),
    }))

const alarmActions = (alarms) =>
  alarms
    .filter((alarm) => alarm.count >= MIN_ALARM_RAISES)
    .map((alarm) => ({
      key: `alarm-${alarm.code}`,
      severity: 'warning',
      icon: 'bi-bell',
      title: `Alarm ${alarm.code} raised ${formatCount(alarm.count)} times`,
      detail: [alarm.message, plural(alarm.machineCount, 'machine')].filter(Boolean).join(' · '),
      weight: alarm.count,
      to: ROUTES.MONITORING,
    }))

// The rest of the fleet, one row each so a large fleet does not fill the queue
const fleetActions = (home) => {
  const { machines, fleet } = home
  const offline = machines.filter((machine) => !machine.onlineStatus && machine.plannedQuantity == null).length
  const schedulingUsed = machines.some((machine) => machine.plannedQuantity != null)
  const unscheduled = machines.filter((machine) => modeIn(machine, PRODUCTION_PARTS) && machine.plannedQuantity == null).length
  return [
    offline > 0 && {
      key: 'offline',
      severity: 'warning',
      icon: 'bi-wifi-off',
      title: `${plural(offline, 'machine')} offline`,
      detail: 'No job scheduled on them today',
      weight: offline,
      to: monitoringSearchPath(fleetMode(9).label),
    },
    schedulingUsed && unscheduled > 0 && {
      key: 'unscheduled',
      severity: 'info',
      icon: 'bi-calendar-x',
      title: `${plural(unscheduled, 'machine')} producing without a schedule`,
      detail: 'Their work is not counted against the plan',
      weight: unscheduled,
      to: ROUTES.PRODUCTION_SCHEDULE,
    },
    fleet.awaitingData > 0 && {
      key: 'awaiting',
      severity: 'info',
      icon: 'bi-hourglass-split',
      title: `${plural(fleet.awaitingData, 'machine')} awaiting data`,
      detail: 'No mode collected yet: check the connection',
      weight: fleet.awaitingData,
      to: ROUTES.MONITORING,
    },
  ].filter(Boolean)
}

// What needs someone now, across machines, schedule and alarms, most serious first. A past day
// keeps only what belongs to that day: where a machine is now says nothing about it.
export const buildActions = (home, isToday) => {
  const live = isToday ? [...scheduledOfflineActions(home.machines), ...stuckActions(home.machines, home.serverTime), ...fleetActions(home)] : []
  return [...live, ...lowOeeActions(home.machines),...unfinishedActions(home.machines), ...alarmActions(home.alarms)].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || b.weight - a.weight,
  )
}

// Machines of a mode chip (the fleet tile rule: Other = any mode without a tile of its own)
const KNOWN_MODES = new Set(FLEET_MODES.flatMap((mode) => mode.parts))
export const machineInChip = (machine, chip) =>
  chip.id === OTHER_MODE.id ? machine.modeId != null && !KNOWN_MODES.has(machine.modeId) : chip.parts.includes(machine.modeId)

// The floor map's groups: the machines per line, the customer first when several are shown. `setup`
// is GET /machines (the line is not in the dashboard response); a machine it does not list is "No line".
export const floorGroups = (machines, setup, showCustomer) => {
  const lineOf = new Map(setup.map((machine) => [machine.id, machine.lineName]))
  const groups = new Map()
  machines.forEach((machine) => {
    const line = lineOf.get(machine.machineId) || 'No line'
    const label = showCustomer ? `${machine.customerName || '—'} · ${line}` : line
    if (!groups.has(label)) groups.set(label, [])
    groups.get(label).push(machine)
  })
  return [...groups]
    .map(([label, rows]) => ({ label, machines: rows.sort((a, b) => a.machineName.localeCompare(b.machineName, undefined, { numeric: true })) }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }))
}

// Today's holiday or week off of one company (name), else null; week_day 1 = Monday
export const dayOffName = (holidays, date) => {
  const day = parseIsoDate(date)
  if (!day) return null
  const weekDay = ((day.getDay() + 6) % 7) + 1
  const match = holidays.find((row) =>
    row.holidayType === 'week_off' ? row.weekDay === weekDay : row.startDate && row.startDate <= date && date <= (row.endDate ?? row.startDate),
  )
  if (!match) return null
  return match.holidayType === 'week_off' ? 'Week off' : match.name || 'Holiday'
}

// The shift running at the server's time; one past midnight counts on both sides of it
export const currentShift = (shifts, serverTime) => {
  const now = new Date(serverTime)
  const minutes = now.getHours() * 60 + now.getMinutes()
  return (
    shifts.find((shift) => {
      const start = clockToMinutes(shift.startTime)
      const end = clockToMinutes(shift.endTime)
      if (start == null || end == null) return false
      return start < end ? minutes >= start && minutes < end : minutes >= start || minutes < end
    }) ?? null
  )
}

const expiryAlert = ({ key, rows, dateOf, today, what, icon, to }) => {
  const dated = rows.filter((row) => dateOf(row))
  const ended = dated.filter((row) => dateOf(row) < today).length
  const ending = dated.filter((row) => dateOf(row) >= today && daysBetweenIso(today, dateOf(row)) <= EXPIRY_WARNING_DAYS).length
  if (!ended && !ending) return null
  return {
    key,
    severity: ended ? 'critical' : 'warning',
    icon,
    title: ended ? `${plural(ended, what)} ended` : `${plural(ending, what)} ending within ${EXPIRY_WARNING_DAYS} days`,
    detail: ended && ending ? `${formatCount(ending)} more within ${EXPIRY_WARNING_DAYS} days` : undefined,
    to,
  }
}

// What will get in the way soon: warranties, licences, machines to look after, gaps in the set-up.
// Each list may be null (not loaded, or the role may not read it): it is then left out. Machines
// not active are left out of the warranty and line checks: nobody is using them.
export const buildReadiness = ({ machines, licences, shifts, machineCount, plannedCount, today, licencePath }) => {
  const active = (machines ?? []).filter((machine) => machine.status === 'active')
  const toMachines = ROUTES.MACHINES
  const noLine = active.filter((machine) => !machine.lineId).length
  const maintenance = active.filter((machine) => machine.maintenanceRequired).length
  return [
    machines && expiryAlert({ key: 'warranty', rows: active, dateOf: (machine) => machine.warrantyDate, today, what: 'machine warranty', icon: 'bi-shield-exclamation', to: toMachines }),
    licences && expiryAlert({ key: 'licence', rows: licences.filter((key) => key.status === 'active'), dateOf: (key) => key.expiresOn, today, what: 'licence key', icon: 'bi-key', to: licencePath }),
    maintenance > 0 && { key: 'maintenance', severity: 'warning', icon: 'bi-wrench-adjustable', title: `${plural(maintenance, 'machine')} marked for maintenance`, to: toMachines },
    noLine > 0 && { key: 'no-line', severity: 'info', icon: 'bi-diagram-3', title: `${plural(noLine, 'machine')} without a line`, detail: 'Left out of machine access by organization', to: toMachines },
    shifts && !shifts.length && { key: 'no-shift', severity: 'warning', icon: 'bi-calendar3', title: 'No shift set up', detail: 'Shift filters and scheduled OEE need one', to: ROUTES.SHIFTS },
    machineCount > 0 && !plannedCount && { key: 'no-plan', severity: 'info', icon: 'bi-calendar-x', title: 'No job scheduled for this day', detail: 'Nothing to compare production with', to: ROUTES.PRODUCTION_SCHEDULE },
  ].filter(Boolean)
}
