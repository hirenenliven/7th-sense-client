import { PICKER_LOCALE, parseIsoDate, shiftIsoDate, todayIso } from '@/utils/dateTime'
import { randomFor, round } from '@/utils/sampleData'
import { ALL_PROGRAMS, SAMPLE_SHIFTS } from './productivitySettings'

// SAMPLE productivity data (OEE, finished cycles) until the server has a production-data API; replace
// these functions with service calls (same shapes) when it does. Values are seeded by machine, date,
// shift and program, so a pick always shows the same numbers.

const HOUR_MS = 3_600_000
const PROGRAM_COUNT = 4

const dayLabel = new Intl.DateTimeFormat(PICKER_LOCALE, { day: '2-digit', month: 'short' })
const clock = new Intl.DateTimeFormat(PICKER_LOCALE, { hour: '2-digit', minute: '2-digit' })

// The CNC programs a machine runs ("O1234")
export const samplePrograms = (machineId) => {
  const random = randomFor(machineId, '', 'programs')
  return Array.from({ length: PROGRAM_COUNT }, (_, index) => {
    const name = `O${1000 + index * 100 + Math.floor(random() * 99)}`
    return { value: name, label: name }
  })
}

const shiftsOf = (shiftIds) => (shiftIds.length ? SAMPLE_SHIFTS.filter((shift) => shiftIds.includes(shift.value)) : SAMPLE_SHIFTS)

// One machine, day and shift: availability, performance, quality (%)
const shiftOee = (machineId, isoDate, shiftId, program, schedule) => {
  const random = randomFor(machineId, isoDate, `oee|${shiftId}|${program}`)
  const availability = 52 + random() * 30 + (schedule === 'with' ? 10 : 0)
  return { availability: Math.min(availability, 98), performance: 30 + random() * 40, quality: 85 + random() * 14 }
}

// One row per day from … to: the four OEE values, averaged over the machines and shifts picked
// (every shift without a pick). A future day has no row.
export const oeeRows = (machineIds, from, to, { schedule, shiftIds, program = ALL_PROGRAMS }) => {
  if (!machineIds.length) return []
  const shifts = shiftsOf(shiftIds)
  const last = to > todayIso() ? todayIso() : to
  const rows = []
  for (let isoDate = from; isoDate <= last; isoDate = shiftIsoDate(isoDate, 1)) {
    const sum = { availability: 0, performance: 0, quality: 0 }
    machineIds.forEach((machineId) =>
      shifts.forEach((shift) => {
        const values = shiftOee(machineId, isoDate, shift.value, program, schedule)
        Object.keys(sum).forEach((key) => {
          sum[key] += values[key]
        })
      }),
    )
    const count = machineIds.length * shifts.length
    const [availability, performance, quality] = [sum.availability, sum.performance, sum.quality].map((value) => value / count)
    rows.push({
      label: dayLabel.format(parseIsoDate(isoDate)),
      availability: round(availability, 1),
      performance: round(performance, 1),
      quality: round(quality, 1),
      oee: round((availability * performance * quality) / 10_000, 1),
    })
  }
  return rows
}

// One row per day from … to: cycles produced (started), finished and unfinished, summed over the
// machines and shifts picked (every shift without a pick). Today counts up to now; a future day has no row.
export const cycleCountRows = (machineIds, from, to, { shiftIds }) => {
  if (!machineIds.length) return []
  const shifts = shiftsOf(shiftIds)
  const today = todayIso()
  const last = to > today ? today : to
  const now = Date.now()
  const rows = []
  for (let isoDate = from; isoDate <= last; isoDate = shiftIsoDate(isoDate, 1)) {
    const dayStart = parseIsoDate(isoDate).getTime()
    let produced = 0
    let finished = 0
    machineIds.forEach((machineId) =>
      shifts.forEach((shift) => {
        const random = randomFor(machineId, isoDate, `counts|${shift.value}`)
        // Share of the shift worked so far (1 for a past day, 0 before it starts)
        const start = dayStart + shift.start * HOUR_MS
        const done = Math.min(1, Math.max(0, (now - start) / ((shift.end - shift.start) * HOUR_MS)))
        // The odd day without production on the machine (holiday, breakdown)
        const count = random() < 0.1 ? 0 : Math.round((150 + random() * 450) * done)
        produced += count
        finished += Math.round(count * (0.55 + random() * 0.2))
      }),
    )
    rows.push({ label: dayLabel.format(parseIsoDate(isoDate)), produced, finished, unfinished: produced - finished })
  }
  return rows
}

// The day's finished cycles in the picked shifts (all without a pick), up to now for today:
// [{ label: "HH:mm" end, cycle, hold, rapid, feed }] in minutes. The rest of a cycle is load / unload.
export const finishedCycles = (machineId, isoDate, { shiftIds, program = ALL_PROGRAMS }) => {
  const programs = samplePrograms(machineId)
  const dayStart = parseIsoDate(isoDate).getTime()
  const now = Date.now()
  const cycles = []
  shiftsOf(shiftIds).forEach((shift) => {
    const random = randomFor(machineId, isoDate, `cycles|${shift.value}`)
    const end = dayStart + shift.end * HOUR_MS
    let time = dayStart + shift.start * HOUR_MS + random() * 15 * 60_000
    for (;;) {
      const runProgram = programs[Math.floor(random() * programs.length)].value
      const cycle = 9 + random() * 14
      const finish = time + cycle * 60_000
      if (finish > end || finish > now) break
      if (program === ALL_PROGRAMS || program === runProgram) {
        const feed = cycle * (0.55 + random() * 0.15)
        const rapid = cycle * (0.1 + random() * 0.1)
        const hold = cycle * (0.03 + random() * 0.08)
        cycles.push({
          time: finish,
          label: clock.format(finish),
          program: runProgram,
          cycle: round(cycle, 2),
          hold: round(hold, 2),
          rapid: round(rapid, 2),
          feed: round(feed, 2),
        })
      }
      // Gap before the next cycle: load / unload, waits, the odd longer stop
      time = finish + (1 + random() * 4 + (random() < 0.08 ? 20 + random() * 40 : 0)) * 60_000
    }
  })
  return cycles.sort((a, b) => a.time - b.time)
}
