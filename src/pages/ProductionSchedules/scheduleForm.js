import { z } from 'zod'
import { clockToMinutes, isoToDateText, minutesBetween } from '@/utils/dateTime'

// Limits of the production schedule columns (dto/production_schedule_dto.go, migration 026)
export const MAX_LENGTH = { jobId: 50 }
export const MAX_QUANTITY = 1000000
export const MAX_ITEMS = 100

export const SCHEDULE_TYPE = { SINGLE: 'single', MULTIPLE: 'multiple' }
export const SCHEDULE_TYPES = [
  { value: SCHEDULE_TYPE.SINGLE, label: 'Single Day' },
  { value: SCHEDULE_TYPE.MULTIPLE, label: 'Multiple Day' },
]

export const SCHEDULE_STATUS = { ACTIVE: 'active', INACTIVE: 'inactive' }

// `itemId` is the saved item id (null = new). Not `id`: useFieldArray uses `id` for its keys.
export const EMPTY_ITEM = {
  itemId: null,
  scheduleDate: '', // multiple day only; a single day uses the schedule date
  jobId: '',
  supervisorId: '',
  operatorId: '',
  shiftId: '',
  partId: '',
  processId: '',
  quantity: '',
  startTime: '',
  endTime: '',
}

export const INITIAL_VALUES = {
  scheduleType: SCHEDULE_TYPE.SINGLE,
  startDate: '',
  endDate: '',
  userId: '',
  machineId: '',
  status: SCHEDULE_STATUS.ACTIVE,
  items: [EMPTY_ITEM],
}

const required = (message) => z.string().min(1, message)

const itemSchema = z
  .object({
    itemId: z.number().nullable(),
    scheduleDate: z.string(),
    jobId: z.string().trim().min(1, 'Job ID is required').max(MAX_LENGTH.jobId, 'Job ID is too long'),
    supervisorId: required('Supervisor / programmer is required'),
    operatorId: required('Operator is required'),
    shiftId: required('Shift is required'),
    partId: required('Part is required'),
    processId: required('Part process is required'),
    quantity: z
      .string()
      .trim()
      .refine((value) => /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= MAX_QUANTITY, `Qty. is 1–${MAX_QUANTITY}`),
    startTime: required('Start time is required'),
    endTime: required('End time is required'),
  })
  .superRefine((item, ctx) => {
    if (item.startTime && item.startTime === item.endTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'End time cannot be the start time', path: ['endTime'] })
    }
  })

// Mirrors the production schedule API rules (dto/production_schedule_dto.go). The server also checks
// that each job lies inside its shift, that jobs do not overlap and that the machine is free that day.
export const scheduleSchema = z
  .object({
    scheduleType: z.enum([SCHEDULE_TYPE.SINGLE, SCHEDULE_TYPE.MULTIPLE]),
    startDate: required('Schedule date is required'),
    endDate: z.string(),
    userId: required('Customer is required'),
    machineId: required('Machine is required'),
    status: z.enum([SCHEDULE_STATUS.ACTIVE, SCHEDULE_STATUS.INACTIVE]),
    items: z.array(itemSchema).min(1, 'Add at least one job').max(MAX_ITEMS, `Up to ${MAX_ITEMS} jobs`),
  })
  .superRefine((values, ctx) => {
    if (values.scheduleType !== SCHEDULE_TYPE.MULTIPLE) return
    if (!values.endDate) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'End date is required', path: ['endDate'] })
      return
    }
    if (values.startDate && values.endDate < values.startDate) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'End date cannot be before the start date', path: ['endDate'] })
      return
    }
    values.items.forEach((item, index) => {
      if (!item.scheduleDate) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Date is required', path: ['items', index, 'scheduleDate'] })
      } else if (item.scheduleDate < values.startDate || item.scheduleDate > values.endDate) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Pick a date of the schedule', path: ['items', index, 'scheduleDate'] })
      }
    })
  })

// Minutes a job runs (past midnight when the end is not after the start); null until both times are set
export const itemMinutes = (item) =>
  clockToMinutes(item?.startTime) === null || clockToMinutes(item?.endTime) === null || item.startTime === item.endTime
    ? null
    : minutesBetween(item.startTime, item.endTime)

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ production schedules API body
// ---------------------------------------------------------------------------

// `existing` = the loaded schedule when editing (sends the status)
export const toSchedulePayload = (values, existing) => {
  const single = values.scheduleType === SCHEDULE_TYPE.SINGLE
  return {
    userId: Number(values.userId),
    machineId: Number(values.machineId),
    scheduleType: values.scheduleType,
    startDate: values.startDate,
    endDate: single ? values.startDate : values.endDate,
    ...(existing ? { status: values.status } : {}),
    items: values.items.map((item) => ({
      id: item.itemId,
      scheduleDate: single ? values.startDate : item.scheduleDate,
      jobId: item.jobId.trim(),
      supervisorId: Number(item.supervisorId),
      operatorId: Number(item.operatorId),
      shiftId: Number(item.shiftId),
      partId: Number(item.partId),
      processId: Number(item.processId),
      quantity: Number(item.quantity),
      startTime: item.startTime,
      endTime: item.endTime,
    })),
  }
}

const idText = (value) => (value ? String(value) : '')

// GET /production-schedules/{id} → form values
export const toFormValues = (schedule) => ({
  scheduleType: schedule.scheduleType === SCHEDULE_TYPE.MULTIPLE ? SCHEDULE_TYPE.MULTIPLE : SCHEDULE_TYPE.SINGLE,
  startDate: schedule.startDate ?? '',
  endDate: schedule.scheduleType === SCHEDULE_TYPE.MULTIPLE ? (schedule.endDate ?? '') : '',
  userId: idText(schedule.userId),
  machineId: idText(schedule.machineId),
  status: schedule.status === SCHEDULE_STATUS.INACTIVE ? SCHEDULE_STATUS.INACTIVE : SCHEDULE_STATUS.ACTIVE,
  items: (schedule.items ?? []).map((item) => ({
    itemId: item.id,
    scheduleDate: item.scheduleDate ?? '',
    jobId: item.jobId ?? '',
    supervisorId: idText(item.supervisorId),
    operatorId: idText(item.operatorId),
    shiftId: idText(item.shiftId),
    partId: idText(item.partId),
    processId: idText(item.processId),
    quantity: String(item.quantity ?? ''),
    startTime: item.startTime ?? '',
    endTime: item.endTime ?? '',
  })),
})

// "10-01-2030" or "10-01-2030 – 12-01-2030" (list rows, delete prompt)
export const scheduleDates = (schedule) =>
  schedule.endDate && schedule.endDate !== schedule.startDate
    ? `${isoToDateText(schedule.startDate)} – ${isoToDateText(schedule.endDate)}`
    : isoToDateText(schedule.startDate)
