import { tk } from '@/i18n/tk'

// Fixed option lists of the Shift screens (Add / Manage Shift, Breaks, Holiday / Week Off). Values are
// what the API stores (dto/shift_dto.go, dto/holiday_dto.go); there are no lookup tables for these.

export const SHIFT_TYPES = [
  { value: 'day', label: tk('Day') },
  { value: 'night', label: tk('Night') },
]

// shifts.working_days: ISO weekdays, 1 = Monday … 7 = Sunday
export const WEEKDAYS = [
  { id: 1, label: tk('Mon') },
  { id: 2, label: tk('Tues') },
  { id: 3, label: tk('Wed') },
  { id: 4, label: tk('Thurs') },
  { id: 5, label: tk('Fri') },
  { id: 6, label: tk('Sat') },
  { id: 7, label: tk('Sun') },
]

export const ALL_WEEKDAYS = WEEKDAYS.map((day) => day.id)

// Suggestions for the break name (any name is allowed)
export const BREAK_NAME_SUGGESTIONS = [tk('Tea'), tk('Lunch'), tk('Dinner'), tk('Snacks'), tk('Tea + Snacks')]

// holidays.holiday_type
export const HOLIDAY_TYPES = {
  HOLIDAY: 'holiday',
  WEEK_OFF: 'week_off',
}

export const SHIFT_STATUS = { ACTIVE: 'active', INACTIVE: 'inactive' }
