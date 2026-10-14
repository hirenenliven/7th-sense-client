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
  THEME: 'ts.theme', // theme on screen, applied before the first render
  REMEMBERED_USERNAME: 'ts.login.username', // set when "Remember" is ticked on the login screen
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

// Role names (backend roles.name). The server enforces access; the UI only hides what a role cannot use.
export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  OPERATOR: 'operator',
  CUSTOMER: 'customer',
  QC: 'qc',
  SHOP_HEAD: 'shop_head',
}

export const ROLE_LABELS = {
  [ROLES.SUPERADMIN]: 'Super Administrator',
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.SUPERVISOR]: 'Supervisor',
  [ROLES.OPERATOR]: 'Operator',
  [ROLES.CUSTOMER]: 'Customer',
  [ROLES.QC]: 'Quality Control',
  [ROLES.SHOP_HEAD]: 'Shop Head',
}

// `roles` of admin-only pages and menu items (same rule as the server's admin-only routes)
export const ADMIN_ONLY = [ROLES.SUPERADMIN, ROLES.ADMIN]

// `roles` of superadmin-only pages and menu items (machine catalog: controllers, models)
export const SUPERADMIN_ONLY = [ROLES.SUPERADMIN]

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

// Users API (backend roles table seed: superadmin 1, admin 2, supervisor 3, operator 4, customer 5)
export const CUSTOMER_ROLE_ID = 5

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
