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

// Toast notifications (see utils/toast.js)
export const TOAST_DEFAULTS = {
  maxVisible: 5,
  exitMs: 200, // keep in sync with $ts-toast-exit
  duration: {
    success: 4000,
    info: 4000,
    warning: 6000,
    error: 7000,
  },
  titles: {
    success: 'Success',
    info: 'Info',
    warning: 'Warning',
    error: 'Error',
  },
}
