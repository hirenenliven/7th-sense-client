// A plain "YYYY-MM-DD" would be read as midnight UTC, the day before in the Americas
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

export const formatDate = (date, locale = 'en-US') =>
  new Date(DATE_ONLY.test(date) ? `${date}T00:00` : date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

export const formatClockTime = (date, locale = 'en-US') =>
  date.toLocaleString(locale, {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

export const formatLongDate = (date, locale = 'en-GB') =>
  date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

// 13 → "13th", 1 → "1st", 22 → "22nd", 11 → "11th"
export const ordinal = (day) => {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const lastTwo = day % 100
  return `${day}${suffixes[(lastTwo - 20) % 10] || suffixes[lastTwo] || suffixes[0]}`
}

// "9:34:30 AM"
export const formatTime12 = (date, locale = 'en-US') =>
  date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })

// "13th, October, 2026"
export const formatOrdinalDate = (date, locale = 'en-GB') =>
  `${ordinal(date.getDate())}, ${date.toLocaleDateString(locale, { month: 'long' })}, ${date.getFullYear()}`

// "Tuesday"
export const formatWeekday = (date, locale = 'en-US') => date.toLocaleDateString(locale, { weekday: 'long' })

// Table order: the latest entry first (highest id = added last), so a row just added shows on top
export const newestFirst = (rows) => [...rows].sort((a, b) => b.id - a.id)
