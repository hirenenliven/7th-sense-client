import { z } from 'zod'
import { ALL_WEEKDAYS, SHIFT_STATUS } from '@/constants/shifts'
import { minutesBetween } from '@/utils/dateTime'

// Lengths and limits of the shifts API (dto/shift_dto.go, migrations 019–020)
export const MAX_LENGTH = { name: 100 }
export const MAX_BREAKS = 20

// One "Shift Break Type" row: a break of the customer (Masters › Shifts › Breaks).
// `breakId`, not `id`: useFieldArray uses `id` for its keys.
export const EMPTY_BREAK_ROW = { breakId: '' }

export const INITIAL_VALUES = {
  userId: '',
  name: '',
  shiftType: '',
  startTime: '',
  endTime: '',
  workingDays: ALL_WEEKDAYS,
  status: SHIFT_STATUS.ACTIVE,
  breaks: [],
}

const clock = (message) => z.string().min(1, message)

// Minutes from the shift start, so breaks of a shift past midnight compare correctly
const offset = (shiftStart, time) => (time === shiftStart ? 0 : minutesBetween(shiftStart, time))

// Mirrors the shifts API rules (service/shift_service.go checkBreaksFit): the picked breaks lie
// inside the shift and do not overlap. `breaksById`: the customer's breaks (Map id → break).
export const shiftSchema = (breaksById) =>
  z
    .object({
      userId: z.string().min(1, 'Customer is required'),
      name: z.string().trim().min(1, 'Shift name is required').max(MAX_LENGTH.name, 'Shift name is too long'),
      shiftType: z.string().min(1, 'Shift type is required'),
      startTime: clock('Shift start time is required'),
      endTime: clock('Shift end time is required'),
      workingDays: z.array(z.number()).min(1, 'Select at least one working day'),
      status: z.enum([SHIFT_STATUS.ACTIVE, SHIFT_STATUS.INACTIVE]),
      breaks: z.array(z.object({ breakId: z.string().min(1, 'Select a break or remove this row') })).max(MAX_BREAKS, `Up to ${MAX_BREAKS} breaks`),
    })
    .superRefine((values, ctx) => {
      const issue = (message, path) => ctx.addIssue({ code: z.ZodIssueCode.custom, message, path })
      if (values.startTime && values.startTime === values.endTime) {
        issue('End time must differ from the start time', ['endTime'])
        return
      }

      const seen = new Set()
      const spans = []
      values.breaks.forEach(({ breakId }, index) => {
        if (!breakId) return
        if (seen.has(breakId)) {
          issue('This break is already added', ['breaks', index, 'breakId'])
          return
        }
        seen.add(breakId)
        const shiftBreak = breaksById.get(Number(breakId))
        if (!shiftBreak || !values.startTime || !values.endTime) return
        const from = offset(values.startTime, shiftBreak.startTime)
        const to = from + minutesBetween(shiftBreak.startTime, shiftBreak.endTime)
        if (to > minutesBetween(values.startTime, values.endTime)) {
          issue('Not within the shift time', ['breaks', index, 'breakId'])
          return
        }
        spans.push({ from, to, index })
      })

      spans.sort((a, b) => a.from - b.from)
      spans.slice(1).forEach((span, position) => {
        if (span.from < spans[position].to) issue('Overlaps another break', ['breaks', span.index, 'breakId'])
      })
    })

// ---------------------------------------------------------------------------
// API mapping — form values ⇄ shifts API body (POST /shifts, PUT /shifts/{id})
// ---------------------------------------------------------------------------

export const toShiftPayload = (values, isEdit) => ({
  userId: Number(values.userId),
  name: values.name.trim(),
  shiftType: values.shiftType,
  startTime: values.startTime,
  endTime: values.endTime,
  workingDays: [...values.workingDays].sort((a, b) => a - b),
  breakIds: values.breaks.map((row) => Number(row.breakId)),
  ...(isEdit ? { status: values.status } : {}),
})

// A shift (list row or GET /shifts/{id}; both carry the breaks it takes) → form values
export const toFormValues = (shift) => ({
  userId: String(shift.userId ?? ''),
  name: shift.name ?? '',
  shiftType: shift.shiftType ?? '',
  startTime: shift.startTime ?? '',
  endTime: shift.endTime ?? '',
  workingDays: shift.workingDays?.length ? shift.workingDays : ALL_WEEKDAYS,
  status: shift.status === SHIFT_STATUS.INACTIVE ? SHIFT_STATUS.INACTIVE : SHIFT_STATUS.ACTIVE,
  breaks: (shift.breaks ?? []).map((shiftBreak) => ({ breakId: String(shiftBreak.id) })),
})
