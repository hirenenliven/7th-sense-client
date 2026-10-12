export const formatDate = (date, locale = 'en-US') =>
  new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1)
