import { z } from 'zod'
import { formatModeDuration, parseIsoDate, parseTime, toIsoDate, toTimeValue } from '@/utils/dateTime'

const MINUTE = 60_000
const dayFormat = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' })
const fullDayFormat = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
const clockFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })

const floorMinute = (time) => Math.floor(time / MINUTE) * MINUTE
const dateValue = (iso) => toIsoDate(new Date(iso))
const timeValue = (iso) => {
  const date = new Date(iso)
  return toTimeValue(date.getHours(), date.getMinutes())
}

// "06 Nov 7:46:06 AM — 7:54:53 AM - 8m 47s" (the end's day too when it is another day)
export const formatPeriod = ({ startedAt, endedAt }) => {
  const start = Date.parse(startedAt)
  const end = Date.parse(endedAt)
  const endDay = spansDays({ startedAt, endedAt }) ? `${dayFormat.format(end)} ` : ''
  return `${dayFormat.format(start)} ${clockFormat.format(start)} — ${endDay}${clockFormat.format(end)} - ${formatModeDuration((end - start) / 1000)}`
}

export const formatDay = (iso) => fullDayFormat.format(Date.parse(iso))
export const formatClock = (iso) => clockFormat.format(Date.parse(iso))

// The form shows times only, like the chart's day; a period past midnight also needs its dates
export const spansDays = ({ startedAt, endedAt }) => dateValue(startedAt) !== dateValue(endedAt)

// The instant a picked date + minute saves as. A period does not start on a whole minute: the minute
// holding its start or end means exactly that, sent as the server wrote it (it has microseconds, and
// a JS date would round them to just outside the period).
const pickedInstant = (date, time, boundary) => {
  const day = parseIsoDate(date)
  const clock = parseTime(time)
  if (!day || !clock) return null
  day.setHours(clock.hours, clock.minutes)
  return day.getTime() === floorMinute(Date.parse(boundary)) ? boundary : day.toISOString()
}

// The first time of the period no reason covers yet (the whole period when none is left): what the
// form starts with, so most reasons need only the Reason picked.
const firstFreeSpan = (period, reasons) => {
  let from = period.startedAt
  for (const reason of [...reasons].sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt))) {
    if (Date.parse(reason.startedAt) > Date.parse(from)) return { startedAt: from, endedAt: reason.startedAt }
    if (Date.parse(reason.endedAt) > Date.parse(from)) from = reason.endedAt
  }
  return Date.parse(from) < Date.parse(period.endedAt) ? { startedAt: from, endedAt: period.endedAt } : period
}

// A span (a saved row, or the free time) → form values
const spanValues = ({ startedAt, endedAt }, reasonId) => ({
  reasonId,
  startDate: dateValue(startedAt),
  startTime: timeValue(startedAt),
  endDate: dateValue(endedAt),
  endTime: timeValue(endedAt),
})

export const newFormValues = (period, reasons) => spanValues(firstFreeSpan(period, reasons), '')
export const toFormValues = (reason) => spanValues(reason, String(reason.reasonId))

export const toReasonPayload = (values, period) => ({
  reasonId: Number(values.reasonId),
  startedAt: pickedInstant(values.startDate, values.startTime, period.startedAt),
  endedAt: pickedInstant(values.endDate, values.endTime, period.endedAt),
})

// Mirrors the API rules (service.MachineModeReasonService), so a mistake shows on its field. `others`
// are the period's reasons except the one being edited. The server checks all of this again.
export const modeReasonSchema = (period, others) =>
  z
    .object({
      reasonId: z.string().min(1, 'Reason is required'),
      startDate: z.string().min(1, 'Start date is required'),
      startTime: z.string().min(1, 'Start time is required'),
      endDate: z.string().min(1, 'End date is required'),
      endTime: z.string().min(1, 'End time is required'),
    })
    .superRefine((values, ctx) => {
      const { startedAt, endedAt } = toReasonPayload(values, period)
      if (!startedAt || !endedAt) return
      const start = Date.parse(startedAt)
      const end = Date.parse(endedAt)
      const issue = (path, message) => ctx.addIssue({ code: 'custom', message, path: [path] })

      if (start < Date.parse(period.startedAt)) issue('startTime', 'Start time must be inside this period')
      if (end > Date.parse(period.endedAt)) issue('endTime', 'End time must be inside this period')
      if (end <= start) issue('endTime', 'End time must be after start time')
      else if (others.some((other) => Date.parse(other.startedAt) < end && Date.parse(other.endedAt) > start)) {
        issue('startTime', 'This time overlaps another reason of this period')
      }
    })
