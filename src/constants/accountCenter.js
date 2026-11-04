import { SUPERADMIN_ONLY, MANAGERS } from './app'
import { ROUTES } from './routes'

// System › Account Center: Customer, Licence Key, Clientele and Machine Catalog on one page, a tab
// each. Each tab keeps its own route, so links, Back and reloads open that tab.
// `roles` (optional): only these roles see the tab (same rule as the tab's route in PAGES).
// `subTabs` (optional): screens of one tab, shown as pills under the tabs.
export const ACCOUNT_CENTER_TABS = [
  { key: 'customers', label: 'Customer', icon: 'bi-building', path: ROUTES.CUSTOMERS, roles: SUPERADMIN_ONLY },
  { key: 'licence-keys', label: 'Licence Key', icon: 'bi-key', path: ROUTES.LICENCE_KEYS, roles: MANAGERS },
  { key: 'clientele', label: 'Clientele', icon: 'bi-person-vcard', path: ROUTES.CLIENTELES },
  {
    key: 'catalog',
    label: 'Machine Catalog',
    icon: 'bi-motherboard',
    path: ROUTES.CONTROLLERS,
    roles: SUPERADMIN_ONLY,
    subTabs: [
      { key: 'controllers', label: 'Controllers', path: ROUTES.CONTROLLERS },
      { key: 'models', label: 'Models', path: ROUTES.MODELS },
    ],
  },
]

// Paths that light up the sidebar's Account Center item (every tab and sub-tab, plus the
// Customer add / edit / view pages)
export const ACCOUNT_CENTER_PATHS = [
  ROUTES.ACCOUNT_CENTER,
  ...ACCOUNT_CENTER_TABS.flatMap((tab) => (tab.subTabs ?? [tab]).map((screen) => screen.path)),
  ROUTES.CUSTOMER_ADD,
  ROUTES.CUSTOMER_EDIT,
  ROUTES.CUSTOMER_VIEW,
]
