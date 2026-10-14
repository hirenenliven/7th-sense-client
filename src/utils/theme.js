import { DEFAULT_THEME, STORAGE_KEYS, THEME, THEMES } from '@/constants/app'
import { getCurrentUser, saveMyTheme } from '@/services/customerService'
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

// The user's theme (saved, and shown everywhere except on a screen that forces its own)
let chosenTheme = DEFAULT_THEME
// Set by a screen that always shows one theme (the login screen is always dark); null = none
let forcedTheme = null
let latestRender = 0

// Puts the forced theme, or else the user's theme, on screen
const renderTheme = async () => {
  const value = forcedTheme ?? chosenTheme
  const render = ++latestRender
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
  // A later render (e.g. switched back to dark while loading) wins
  if (render !== latestRender || document.getElementById(LIGHT_STYLE_ID)) return

  const style = document.createElement('style')
  style.id = LIGHT_STYLE_ID
  style.textContent = lightCss
  document.head.appendChild(style)
}

// Sets (and stores) the user's theme; a forced theme stays on screen until it is released
export const applyTheme = (theme) => {
  chosenTheme = normalizeTheme(theme)
  latestRequest += 1
  writeStorage(STORAGE_KEYS.THEME, chosenTheme)
  return renderTheme()
}

// Shows `theme` whatever the user chose, without changing or storing their choice;
// forceTheme(null) shows the user's theme again. Used by the login screen (always dark).
export const forceTheme = (theme) => {
  forcedTheme = theme ? normalizeTheme(theme) : null
  return renderTheme()
}

// Dev only: Vite hot-swaps the dark stylesheet on SCSS edits, but the light CSS above is a cached
// string. Refresh it too, or the light theme mixes new rules' dark values with stale light ones.
if (import.meta.hot) {
  import.meta.hot.accept('@/assets/scss/theme-light.scss?inline', (module) => {
    if (!module) return
    lightCss = module.default
    const style = document.getElementById(LIGHT_STYLE_ID)
    if (style) style.textContent = lightCss
  })
}

// Saves run one after another, so quick toggles reach the server in click order
let latestSave = Promise.resolve()

// The theme picked in the top bar: shown at once, then saved to the user's profile
// (PUT /me/theme). Rejects with the server message if it could not be saved; the theme stays on screen.
export const chooseTheme = (theme) => {
  const value = normalizeTheme(theme)
  applyTheme(value)
  latestSave = latestSave.catch(() => {}).then(() => saveMyTheme(value))
  return latestSave
}

// Applies the logged-in user's saved profile theme (GET /me). Keeps the current theme if it cannot
// be read, or if a theme was picked while it was loading (that pick is newer).
export const refreshUserTheme = async () => {
  const request = latestRequest
  try {
    const user = await getCurrentUser()
    if (request === latestRequest) await applyTheme(user?.profile?.theme)
  } catch {
    // keep the current theme
  }
}
