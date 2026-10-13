import { DEFAULT_THEME, STORAGE_KEYS, THEME, THEMES } from '@/constants/app'
import { getCurrentUser } from '@/services/customerService'
import { readStorage, writeStorage } from './storage'

// The dark theme is the app stylesheet (main.jsx). The light theme is a second build of the
// same SCSS (theme-light.scss), fetched on first use and added after it so it overrides it.
const LIGHT_STYLE_ID = 'ts-theme-light'

let lightCss = null
let latestRequest = 0

// Unknown, empty or missing → the default theme
export const normalizeTheme = (theme) => (THEMES.some((option) => option.value === theme) ? theme : DEFAULT_THEME)

export const getStoredTheme = () => normalizeTheme(readStorage(STORAGE_KEYS.THEME, DEFAULT_THEME))

export const applyTheme = async (theme) => {
  const value = normalizeTheme(theme)
  const request = ++latestRequest
  writeStorage(STORAGE_KEYS.THEME, value)
  document.documentElement.dataset.theme = value

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

// Applies the logged-in user's saved theme (GET /me). Keeps the current theme if it cannot be read.
export const refreshUserTheme = async () => {
  try {
    const user = await getCurrentUser()
    await applyTheme(user?.profile?.theme)
  } catch {
    // keep the current theme
  }
}
