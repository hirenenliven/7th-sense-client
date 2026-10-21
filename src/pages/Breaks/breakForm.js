import { z } from 'zod'
import { SHIFT_STATUS } from '@/constants/shifts'
import { tk } from '@/i18n/tk'

// Lengths of the breaks API (dto/break_dto.go, migration 020)
export const MAX_LENGTH = { name: 100 }

export const INITIAL_VALUES = {
  userId: '',
  shiftId: '', // '' = no shift yet
  name: '',
  startTime: '',
  endTime: '',
  status: SHIFT_STATUS.ACTIVE,
}

// Mirrors the breaks API rules (dto/break_dto.go). An end time earlier than the start time runs
// past midnight; whether the break fits its shift (beside the shift's other breaks) is checked by
// the server on save.
export const breakSchema = z
  .object({
    userId: z.string().min(1, tk('Customer is required')),
    shiftId: z.string(),
    name: z.string().trim().min(1, tk('Break name is required')).max(MAX_LENGTH.name, tk('Break name is too long')),
    startTime: z.string().min(1, tk('Start time is required')),
    endTime: z.string().min(1, tk('End time is required')),
    status: z.enum([SHIFT_STATUS.ACTIVE, SHIFT_STATUS.INACTIVE]),
  })
  .superRefine((values, ctx) => {
    if (values.startTime && values.startTime === values.endTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: tk('End time must differ from the start time'), path: ['endTime'] })
    }
  })

export const toBreakPayload = (values, isEdit) => ({
  userId: Number(values.userId),
  shiftId: values.shiftId ? Number(values.shiftId) : null,
  name: values.name.trim(),
  startTime: values.startTime,
  endTime: values.endTime,
  ...(isEdit ? { status: values.status } : {}),
})

// A list row → form values
export const toFormValues = (shiftBreak) => ({
  userId: String(shiftBreak.userId ?? ''),
  shiftId: shiftBreak.shiftId ? String(shiftBreak.shiftId) : '',
  name: shiftBreak.name ?? '',
  startTime: shiftBreak.startTime ?? '',
  endTime: shiftBreak.endTime ?? '',
  status: shiftBreak.status === SHIFT_STATUS.INACTIVE ? SHIFT_STATUS.INACTIVE : SHIFT_STATUS.ACTIVE,
})
