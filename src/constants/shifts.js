// Fixed option lists of the Shift screens (Add / Manage Shift, Breaks, Holiday / Week Off). Values are
// what the API stores (dto/shift_dto.go, dto/holiday_dto.go); there are no lookup tables for these.

export const SHIFT_TYPES = [
  { value: 'day', label: 'Day' },
  { value: 'night', label: 'Night' },
]

// shifts.working_days: ISO weekdays, 1 = Monday … 7 = Sunday
export const WEEKDAYS = [
  { id: 1, label: 'Mon' },
  { id: 2, label: 'Tues' },
  { id: 3, label: 'Wed' },
  { id: 4, label: 'Thurs' },
  { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' },
  { id: 7, label: 'Sun' },
]

export const ALL_WEEKDAYS = WEEKDAYS.map((day) => day.id)

// Suggestions for the break name (any name is allowed)
export const BREAK_NAME_SUGGESTIONS = ['Tea', 'Lunch', 'Dinner', 'Snacks', 'Tea + Snacks']

// holidays.holiday_type
export const HOLIDAY_TYPES = {
  HOLIDAY: 'holiday',
  WEEK_OFF: 'week_off',
}

export const SHIFT_STATUS = { ACTIVE: 'active', INACTIVE: 'inactive' }
