// Date / time helpers for DatePicker and TimePicker (components/common).
// Form values keep the native input formats: dates "YYYY-MM-DD", times "HH:mm" (24 h).
// The fields show and accept dates as DD-MM-YYYY and times as HH:MM.

export const PICKER_LOCALE = 'en-GB'
export const DATE_PLACEHOLDER = 'DD-MM-YYYY'
export const TIME_PLACEHOLDER = 'HH:MM'
export const DATE_TEXT_LENGTH = DATE_PLACEHOLDER.length
export const TIME_TEXT_LENGTH = TIME_PLACEHOLDER.length

export const pad2 = (value) => String(value).padStart(2, '0')

// Date at local midnight → "YYYY-MM-DD"
export const toIsoDate = (date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`

// Real calendar date only (no 31-02), else null
const buildDate = (year, month, day) => {
  const date = new Date(year, month - 1, day)
  date.setFullYear(year) // years below 100 would otherwise map to 19xx
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null
}

// "YYYY-MM-DD" → Date (local midnight) or null
export const parseIsoDate = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '')
  return match ? buildDate(Number(match[1]), Number(match[2]), Number(match[3])) : null
}

// "YYYY-MM-DD" → "DD-MM-YYYY" ('' when empty or invalid)
export const isoToDateText = (value) => {
  const date = parseIsoDate(value)
  return date ? `${pad2(date.getDate())}-${pad2(date.getMonth() + 1)}-${date.getFullYear()}` : ''
}

// "DD-MM-YYYY" → "YYYY-MM-DD" ('' until it is a complete, real date — like a native date input)
export const dateTextToIso = (text) => {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(text ?? '')
  const date = match && buildDate(Number(match[3]), Number(match[2]), Number(match[1]))
  return date ? toIsoDate(date) : ''
}

// Typing aid: keeps digits and adds the dashes → "14-10-2026"
export const maskDateText = (text) => {
  const digits = String(text ?? '').replace(/\D/g, '').slice(0, 8)
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('-')
}

// Typing aid: keeps digits and adds the colon → "06:30"
export const maskTimeText = (text) => {
  const digits = String(text ?? '').replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits
}

// "HH:mm" → { hours, minutes } or null
export const parseTime = (value) => {
  const match = /^(\d{2}):(\d{2})$/.exec(value ?? '')
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  return hours < 24 && minutes < 60 ? { hours, minutes } : null
}

export const toTimeValue = (hours, minutes) => `${pad2(hours)}:${pad2(minutes)}`

// "HH:MM" typed text → "HH:mm" value ('' until complete and valid)
export const timeTextToValue = (text) => (parseTime(text) ? text : '')

export const isSameDay = (a, b) =>
  Boolean(a && b) && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

export const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)

// Same day in another month, clamped to that month's length (31 Jan + 1 month → 28/29 Feb)
export const addMonths = (date, months) => {
  const first = new Date(date.getFullYear(), date.getMonth() + months, 1)
  const lastDay = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  return new Date(first.getFullYear(), first.getMonth(), Math.min(date.getDate(), lastDay))
}

export const startOfToday = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

// Durations (part setup / cycle / loading times): shown as "H:MM:SS", stored as whole seconds.
// Hours go up to 999 (the parts API limit, dto/part_dto.go).
export const DURATION_PLACEHOLDER = 'H:MM:SS'
export const DURATION_ZERO = '0:00:00'
export const DURATION_PATTERN = /^\d{1,3}:[0-5]\d:[0-5]\d$/

// 5400 → "1:30:00"
export const secondsToDuration = (seconds) => {
  const total = Math.max(0, Math.floor(Number(seconds) || 0))
  return `${Math.floor(total / 3600)}:${pad2(Math.floor((total % 3600) / 60))}:${pad2(total % 60)}`
}

// "1:30:00" → 5400; null when the text is not H:MM:SS
export const durationToSeconds = (text) => {
  const value = String(text ?? '').trim()
  if (!DURATION_PATTERN.test(value)) return null
  const [hours, minutes, seconds] = value.split(':').map(Number)
  return hours * 3600 + minutes * 60 + seconds
}

// Clock times of shifts and breaks: "HH:mm" (24 h), like TimePicker values.
const MINUTES_PER_DAY = 24 * 60

// "14:30" → minutes after midnight (870); null when not HH:mm
export const clockToMinutes = (value) => {
  const time = parseTime(value)
  return time ? time.hours * 60 + time.minutes : null
}

// Minutes from start to end, past midnight when end is not after start: 22:00 → 06:00 = 480.
// Same rule as the shifts API (dto.MinutesBetween); equal times give a whole day.
export const minutesBetween = (start, end) => {
  const minutes = (clockToMinutes(end) - clockToMinutes(start) + MINUTES_PER_DAY) % MINUTES_PER_DAY
  return minutes === 0 ? MINUTES_PER_DAY : minutes
}

// "14:30" → "02:30 PM"
export const formatClock12 = (value) => {
  const time = parseTime(value)
  if (!time) return value ?? ''
  const hours12 = time.hours % 12 || 12
  return `${pad2(hours12)}:${pad2(time.minutes)} ${time.hours < 12 ? 'AM' : 'PM'}`
}

// 480 → "08:00"
export const formatHoursMinutes = (minutes) => `${pad2(Math.floor(minutes / 60))}:${pad2(minutes % 60)}`
