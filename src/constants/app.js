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
  THEME: 'ts.theme',
}

// UI themes (users API `theme`, user_profiles.theme). Light is built from theme-light.scss.
export const THEME = {
  DARK: 'dark_version',
  LIGHT: 'light_version',
}

export const THEMES = [
  { value: THEME.DARK, label: 'Dark' },
  { value: THEME.LIGHT, label: 'Light' },
]

// Used when a user has no theme saved (or an unknown one)
export const DEFAULT_THEME = THEME.DARK

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

// Users API (backend roles table seed: admin 1, supervisor 2, operator 3, customer 4)
export const CUSTOMER_ROLE_ID = 4

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
}

// Branches API
export const BRANCH_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
}

// Rows-per-page choices for list tables
export const PAGE_SIZES = [10, 25, 50, 100]
