import { DEFAULT_THEME, STORAGE_KEYS, THEME, THEMES } from '@/constants/app'
import { getCurrentUser } from '@/services/customerService'
import { readStorage, writeStorage } from './storage'

// The dark theme is the app stylesheet (main.jsx). The light theme is a second build of the
// same SCSS (theme-light.scss), fetched on first use and added after it so it overrides it.
const LIGHT_STYLE_ID = 'ts-theme-light'

let lightCss = null
let latestRequest = 0
const listeners = new Set()

// Unknown, empty or missing → the default theme
export const normalizeTheme = (theme) => (THEMES.some((option) => option.value === theme) ? theme : DEFAULT_THEME)

export const getStoredTheme = () => normalizeTheme(readStorage(STORAGE_KEYS.THEME, DEFAULT_THEME))

// The theme on screen (read by useTheme)
export const getTheme = () => normalizeTheme(document.documentElement.dataset.theme)

export const subscribeTheme = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const applyTheme = async (theme) => {
  const value = normalizeTheme(theme)
  const request = ++latestRequest
  writeStorage(STORAGE_KEYS.THEME, value)
  document.documentElement.dataset.theme = value
  listeners.forEach((listener) => listener())

  if (value !== THEME.LIGHT) {
    document.getElementById(LIGHT_STYLE_ID)?.remove()
    return
  }
  if (document.getElementById(LIGHT_STYLE_ID)) return

  try {
    lightCss ??= (await import('@/assets/scss/theme-light.scss?inline')).default
  } catch {
    return // stay on the dark theme if the stylesheet cannot be loaded
  }
  // A later call (e.g. switched back to dark while loading) wins
  if (request !== latestRequest || document.getElementById(LIGHT_STYLE_ID)) return

  const style = document.createElement('style')
  style.id = LIGHT_STYLE_ID
  style.textContent = lightCss
  document.head.appendChild(style)
}

// Themes picked in the top bar, per user id. They win over the profile theme (there is no
// self-service API to save it), so the choice survives reloads and later logins in this browser.
const readThemeChoices = () => readStorage(STORAGE_KEYS.THEME_CHOICES, {}) ?? {}

export const chooseTheme = (theme, userId) => {
  const value = normalizeTheme(theme)
  if (userId) writeStorage(STORAGE_KEYS.THEME_CHOICES, { ...readThemeChoices(), [userId]: value })
  return applyTheme(value)
}

// Applies the logged-in user's theme: their top bar choice, else the saved profile theme (GET /me).
// Keeps the current theme if it cannot be read.
export const refreshUserTheme = async (userId) => {
  const choice = userId && readThemeChoices()[userId]
  if (choice) {
    await applyTheme(choice)
    return
  }
  try {
    const user = await getCurrentUser()
    await applyTheme(readThemeChoices()[user?.id] ?? user?.profile?.theme)
  } catch {
    // keep the current theme
  }
}
