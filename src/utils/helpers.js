export const formatDate = (date, locale = 'en-US') =>
  new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1)

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

export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

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
