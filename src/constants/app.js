import { tk } from '@/i18n/tk'

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
  MACHINE_VIEW: 'ts.machines.view', // All Machines: 'table' or 'cards'
}

// UI themes (users API `theme`, user_profiles.theme). Light is built from theme-light.scss.
export const THEME = {
  DARK: 'dark_version',
  LIGHT: 'light_version',
}

export const THEMES = [
  { value: THEME.DARK, label: tk('Dark') },
  { value: THEME.LIGHT, label: tk('Light') },
]

// Used when a user has no theme saved (or an unknown one)
export const DEFAULT_THEME = THEME.DARK

// Header language picker. Each code needs src/i18n/locales/<code>.json; labels are in their own language.
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
]

export const DEFAULT_LANGUAGE = 'en'

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

// English keys: show with t(ROLE_LABELS[role])
export const ROLE_LABELS = {
  [ROLES.SUPERADMIN]: tk('Super Administrator'),
  [ROLES.ADMIN]: tk('Administrator'),
  [ROLES.SUPERVISOR]: tk('Supervisor'),
  [ROLES.OPERATOR]: tk('Operator'),
  [ROLES.CUSTOMER]: tk('Customer'),
  [ROLES.QC]: tk('Quality Control'),
  [ROLES.SHOP_HEAD]: tk('Shop Head'),
}

// A customer is a company; the users it and its admins add are members of it (users API `companyId`).
// Only the superadmin works across companies.

// `roles` of superadmin-only pages and menu items (customers, branches, machine catalog, deleting machines)
export const SUPERADMIN_ONLY = [ROLES.SUPERADMIN]

// Roles that manage a company — its users, machines and organization (server: `managersOnly`).
// The server limits a customer or admin to their own company and to the roles GET /roles returns.
export const MANAGERS = [ROLES.SUPERADMIN, ROLES.CUSTOMER, ROLES.ADMIN]

// Member roles that see every machine of their company; other members only their assigned machines
export const ALL_MACHINE_ROLES = [ROLES.ADMIN]

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
    success: tk('Success'),
    info: tk('Info'),
    warning: tk('Warning'),
    error: tk('Error'),
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
