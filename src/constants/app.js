// Bootstrap grid breakpoints (keep in sync with $grid-breakpoints)
export const BREAKPOINTS = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
}

export const STORAGE_KEYS = {
  SIDEBAR_OPEN: 'ts.sidebar.open',
  LANGUAGE: 'ts.language',
}

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
]

export const CLOCK_TICK_MS = 1000

// Placeholder until authentication is wired up — replace with the auth context.
export const DEMO_USER = {
  name: '7th Sense Admin',
  role: 'Administrator',
}
