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
