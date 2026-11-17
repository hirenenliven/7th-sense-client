import { formatClock12, isoToDateText } from '@/utils/dateTime'

// Operator Wise Production Schedule (OperatorSchedule.jsx): filter values, option lists and the
// words of a job row.

export const EMPTY_FILTERS = { userId: '', machineId: '', partId: '', operatorId: '', shiftId: '', date: '' }

// "TM08 - AX 200": the machine and its model
export const machineLabel = (job) => [job.machineName, job.modelName].filter(Boolean).join(' - ')

// "TM-08-111122 (Flange)": part no. with the part name
export const partLabel = (job) => (job.partName ? `${job.partNo} (${job.partName})` : job.partNo)

// "05:30 AM to 12:30 PM"
export const periodLabel = (job) => `${formatClock12(job.startTime)} to ${formatClock12(job.endTime)}`

export const dateLabel = (job) => isoToDateText(job.scheduleDate)

// The Machine / Part / Operator / Shift options: the ones that have jobs in `jobs` (the customer's
// unfiltered list), sorted by name. Built from the jobs because every role may read them, while
// GET /users (the operator list) is for managers only.
export const filterOptions = (jobs) => {
  const pick = (idOf, labelOf) => {
    const byId = new Map()
    jobs.forEach((job) => byId.set(idOf(job), labelOf(job)))
    return [...byId].map(([id, label]) => ({ id, label })).sort((a, b) => a.label.localeCompare(b.label))
  }
  return {
    machines: pick((job) => job.machineId, machineLabel),
    parts: pick((job) => job.partId, partLabel),
    operators: pick((job) => job.operatorId, (job) => job.operatorName),
    shifts: pick((job) => job.shiftId, (job) => job.shiftName),
  }
}

// Text search inside the shown rows
export const matchesSearch = (job, term) =>
  [dateLabel(job), job.operatorName, job.shiftName, job.jobId, machineLabel(job), partLabel(job), job.programName, job.customerName].some(
    (value) => String(value ?? '').toLowerCase().includes(term),
  )
