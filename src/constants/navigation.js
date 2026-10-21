import { SUPERADMIN_ONLY, MANAGERS } from './app'
import { ROUTES } from './routes'
import { tk } from '@/i18n/tk'

// Sidebar menu. An item has either a `path` (link) or `children` (submenu).
// `icon` is a Bootstrap Icons class: https://icons.getbootstrap.com
// `roles` (optional, also on children): only these roles see the item; children inherit it.
// Labels and titles are English keys (tk), translated by the sidebar.
export const NAV_SECTIONS = [
  {
    key: 'main',
    title: tk('Main'),
    items: [{ key: 'dashboard', label: tk('Dashboard'), icon: 'bi-speedometer2', path: ROUTES.HOME }],
  },
  {
    key: 'operations',
    title: tk('Operations'),
    items: [
      {
        key: 'machines',
        label: tk('Machines'),
        icon: 'bi-cpu',
        children: [
          { key: 'machine-list', label: tk('All Machines'), path: ROUTES.MACHINES },
          { key: 'machine-health', label: tk('Machine Health'), path: ROUTES.MACHINE_HEALTH },
          { key: 'machine-groups', label: tk('Machine Groups'), path: ROUTES.MACHINE_GROUPS },
        ],
      },
      {
        key: 'production',
        label: tk('Production'),
        icon: 'bi-gear-wide-connected',
        children: [
          { key: 'production-schedule', label: tk('Schedule'), path: ROUTES.PRODUCTION_SCHEDULE },
          { key: 'production-schedule-add', label: tk('Add Schedule'), path: ROUTES.PRODUCTION_SCHEDULE_ADD, roles: MANAGERS },
          { key: 'production-monitor', label: tk('Live Monitor'), path: ROUTES.PRODUCTION_MONITOR },
        ],
      },
      {
        key: 'tools',
        label: tk('Tool'),
        icon: 'bi-tools',
        children: [
          { key: 'tool-list', label: tk('Tool List'), path: ROUTES.TOOLS },
          { key: 'tool-life', label: tk('Tool Life'), path: ROUTES.TOOL_LIFE },
        ],
      },
      {
        key: 'reports',
        label: tk('Reports'),
        icon: 'bi-pie-chart',
        children: [
          { key: 'report-oee', label: tk('OEE Report'), path: ROUTES.REPORT_OEE },
          { key: 'report-downtime', label: tk('Downtime Report'), path: ROUTES.REPORT_DOWNTIME },
          { key: 'report-production', label: tk('Production Report'), path: ROUTES.REPORT_PRODUCTION },
        ],
      },
    ],
  },
  {
    key: 'masters',
    title: tk('Masters'),
    items: [
      {
        key: 'customers',
        label: tk('Customers'),
        icon: 'bi-building',
        roles: SUPERADMIN_ONLY,
        children: [
          { key: 'customer-list', label: tk('Customer List'), path: ROUTES.CUSTOMERS },
          { key: 'customer-add', label: tk('Add Customer'), path: ROUTES.CUSTOMER_ADD },
        ],
      },
      {
        key: 'catalog',
        label: tk('Machine Catalog'),
        icon: 'bi-motherboard',
        roles: SUPERADMIN_ONLY,
        children: [
          { key: 'controllers', label: tk('Controllers'), path: ROUTES.CONTROLLERS },
          { key: 'models', label: tk('Models'), path: ROUTES.MODELS },
        ],
      },
      { key: 'countries', label: tk('Country'), icon: 'bi-globe2', path: ROUTES.ORG_COUNTRIES },
      { key: 'states', label: tk('State'), icon: 'bi-map', path: ROUTES.ORG_STATES },
      { key: 'cities', label: tk('City'), icon: 'bi-pin-map', path: ROUTES.ORG_CITIES },
      {
        key: 'branches',
        label: tk('Branches'),
        icon: 'bi-diagram-3',
        children: [
          { key: 'branch-list', label: tk('Branch List'), path: ROUTES.BRANCHES },
          { key: 'branch-add', label: tk('Add Branch'), path: ROUTES.BRANCH_ADD, roles: SUPERADMIN_ONLY },
        ],
      },
      { key: 'locations', label: tk('Location'), icon: 'bi-geo-alt', path: ROUTES.ORG_LOCATIONS },
      { key: 'shops', label: tk('Shop'), icon: 'bi-shop', path: ROUTES.ORG_SHOPS },
      { key: 'lines', label: tk('Line'), icon: 'bi-distribute-horizontal', path: ROUTES.ORG_LINES },
      { key: 'cells', label: tk('Cell'), icon: 'bi-grid-3x3-gap', path: ROUTES.ORG_CELLS },
      { key: 'supervisors', label: tk('Supervisor'), icon: 'bi-person-badge', path: ROUTES.ORG_SUPERVISORS },
      { key: 'clientele', label: tk('Clientele'), icon: 'bi-person-vcard', path: ROUTES.CLIENTELES },
      {
        key: 'parts',
        label: tk('Parts'),
        icon: 'bi-rocket-takeoff',
        children: [
          { key: 'part-list', label: tk('Part List'), path: ROUTES.PARTS },
          { key: 'part-add', label: tk('Add Part'), path: ROUTES.PART_ADD, roles: MANAGERS },
        ],
      },
      {
        key: 'shifts',
        label: tk('Shift'),
        icon: 'bi-calendar3',
        children: [
          { key: 'shift-setup', label: tk('Add / Manage Shift'), path: ROUTES.SHIFTS },
          { key: 'breaks', label: tk('Breaks'), path: ROUTES.BREAKS },
          { key: 'holidays', label: tk('Holiday / Week Off'), path: ROUTES.HOLIDAYS },
        ],
      },
      {
        key: 'downtime',
        label: tk('Downtime'),
        icon: 'bi-exclamation-octagon',
        children: [
          { key: 'downtime-reasons', label: tk('Downtime List'), path: ROUTES.DOWNTIME_REASONS },
          { key: 'idle-reasons', label: tk('Idle List'), path: ROUTES.IDLE_REASONS },
        ],
      },
      { key: 'licence-keys', label: tk('Licence Keys'), icon: 'bi-key', path: ROUTES.LICENCE_KEYS, roles: MANAGERS },
      {
        key: 'users',
        label: tk('Users'),
        icon: 'bi-people',
        roles: MANAGERS,
        children: [
          { key: 'user-list', label: tk('User List'), path: ROUTES.USERS },
          { key: 'user-add', label: tk('Add User'), path: ROUTES.USER_ADD },
          { key: 'roles', label: tk('Roles & Permissions'), path: ROUTES.ROLES },
        ],
      },
    ],
  },
  {
    key: 'system',
    title: tk('System'),
    items: [
      { key: 'account', label: tk('Account Center'), icon: 'bi-shield-lock', path: ROUTES.ACCOUNT },
      { key: 'theme', label: tk('Theme Showcase'), icon: 'bi-palette', path: ROUTES.THEME },
      { key: 'user-guide', label: tk('User Guide'), icon: 'bi-book', path: ROUTES.USER_GUIDE },
      { key: 'about', label: tk('About'), icon: 'bi-info-circle', path: ROUTES.ABOUT },
    ],
  },
]
