// Reusable field validators. Each returns an error message, or '' when valid.

export const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  username: /^[a-zA-Z0-9._-]{3,30}$/,
  phone: /^\+?[0-9][0-9\s-]{6,14}$/,
  gstin: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
  pinIndia: /^[1-9][0-9]{5}$/,
  postalCode: /^[A-Za-z0-9\s-]{3,10}$/,
  url: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i,
}

export const PASSWORD_MIN_LENGTH = 8

export const isBlank = (value) => value === null || value === undefined || String(value).trim() === ''

export const required = (value, label) => (isBlank(value) ? `${label} is required` : '')

export const matches = (pattern, message) => (value) =>
  isBlank(value) || pattern.test(String(value).trim()) ? '' : message

export const minLength = (min, label) => (value) =>
  isBlank(value) || String(value).length >= min ? '' : `${label} must be at least ${min} characters`

// File check: allowed MIME types + max size in bytes
export const fileRule = ({ types, maxBytes }) => (file) => {
  if (!file) return ''
  if (!types.includes(file.type)) return 'Unsupported file type'
  if (file.size > maxBytes) return `File must be smaller than ${Math.round(maxBytes / (1024 * 1024))} MB`
  return ''
}
