import { z } from 'zod'
import { HOLIDAY_TYPES, SHIFT_STATUS } from '@/constants/shifts'

// Lengths of the holidays API (dto/holiday_dto.go, migration 020)
export const MAX_LENGTH = { name: 100 }

export const INITIAL_VALUES = {
  userId: '',
  holidayType: HOLIDAY_TYPES.HOLIDAY,
  name: '',
  startDate: '',
  endDate: '',
  weekDay: '',
  status: SHIFT_STATUS.ACTIVE,
}

// Mirrors the holidays API rules (dto/holiday_dto.go): a holiday needs a name and dates (end not
// before start); a week off needs a weekday, its name is optional.
export const holidaySchema = z
  .object({
    userId: z.string().min(1, 'Customer is required'),
    holidayType: z.enum([HOLIDAY_TYPES.HOLIDAY, HOLIDAY_TYPES.WEEK_OFF]),
    name: z.string().trim().max(MAX_LENGTH.name, 'Name is too long'),
    startDate: z.string(),
    endDate: z.string(),
    weekDay: z.string(),
    status: z.enum([SHIFT_STATUS.ACTIVE, SHIFT_STATUS.INACTIVE]),
  })
  .superRefine((values, ctx) => {
    const issue = (message, path) => ctx.addIssue({ code: z.ZodIssueCode.custom, message, path })
    if (values.holidayType === HOLIDAY_TYPES.WEEK_OFF) {
      if (!values.weekDay) issue('Week off day is required', ['weekDay'])
      return
    }
    if (!values.name.trim()) issue('Holiday name is required', ['name'])
    if (!values.startDate) issue('Start date is required', ['startDate'])
    if (!values.endDate) issue('End date is required', ['endDate'])
    // YYYY-MM-DD compares correctly as text
    if (values.startDate && values.endDate && values.endDate < values.startDate) {
      issue('End date is before the start date', ['endDate'])
    }
  })

// Only the fields of the chosen kind are sent (the server clears the others)
export const toHolidayPayload = (values, isEdit) => {
  const isWeekOff = values.holidayType === HOLIDAY_TYPES.WEEK_OFF
  return {
    userId: Number(values.userId),
    holidayType: values.holidayType,
    name: values.name.trim(),
    startDate: isWeekOff ? '' : values.startDate,
    endDate: isWeekOff ? '' : values.endDate,
    weekDay: isWeekOff ? Number(values.weekDay) : 0,
    ...(isEdit ? { status: values.status } : {}),
  }
}

// A list row → form values
export const toFormValues = (holiday) => ({
  userId: String(holiday.userId ?? ''),
  holidayType: holiday.holidayType === HOLIDAY_TYPES.WEEK_OFF ? HOLIDAY_TYPES.WEEK_OFF : HOLIDAY_TYPES.HOLIDAY,
  name: holiday.name ?? '',
  startDate: holiday.startDate ?? '',
  endDate: holiday.endDate ?? '',
  weekDay: holiday.weekDay ? String(holiday.weekDay) : '',
  status: holiday.status === SHIFT_STATUS.INACTIVE ? SHIFT_STATUS.INACTIVE : SHIFT_STATUS.ACTIVE,
})
