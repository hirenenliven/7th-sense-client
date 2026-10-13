import { ROUTES } from './routes'

// Sidebar menu. An item has either a `path` (link) or `children` (submenu).
// `icon` is a Bootstrap Icons class: https://icons.getbootstrap.com
export const NAV_SECTIONS = [
  {
    key: 'main',
    title: 'Main',
    items: [{ key: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', path: ROUTES.HOME }],
  },
  {
    key: 'operations',
    title: 'Operations',
    items: [
      {
        key: 'machines',
        label: 'Machines',
        icon: 'bi-cpu',
        children: [
          { key: 'machine-list', label: 'All Machines', path: ROUTES.MACHINES },
          { key: 'machine-health', label: 'Machine Health', path: ROUTES.MACHINE_HEALTH },
          { key: 'machine-groups', label: 'Machine Groups', path: ROUTES.MACHINE_GROUPS },
        ],
      },
      {
        key: 'production',
        label: 'Production',
        icon: 'bi-gear-wide-connected',
        children: [
          { key: 'production-schedule', label: 'Schedule', path: ROUTES.PRODUCTION_SCHEDULE },
          { key: 'production-monitor', label: 'Live Monitor', path: ROUTES.PRODUCTION_MONITOR },
        ],
      },
      {
        key: 'tools',
        label: 'Tool',
        icon: 'bi-tools',
        children: [
          { key: 'tool-list', label: 'Tool List', path: ROUTES.TOOLS },
          { key: 'tool-life', label: 'Tool Life', path: ROUTES.TOOL_LIFE },
        ],
      },
      {
        key: 'reports',
        label: 'Reports',
        icon: 'bi-pie-chart',
        children: [
          { key: 'report-oee', label: 'OEE Report', path: ROUTES.REPORT_OEE },
          { key: 'report-downtime', label: 'Downtime Report', path: ROUTES.REPORT_DOWNTIME },
          { key: 'report-production', label: 'Production Report', path: ROUTES.REPORT_PRODUCTION },
        ],
      },
    ],
  },
  {
    key: 'masters',
    title: 'Masters',
    items: [
      {
        key: 'customers',
        label: 'Customers',
        icon: 'bi-building',
        children: [
          { key: 'customer-list', label: 'Customer List', path: ROUTES.CUSTOMERS },
          { key: 'customer-add', label: 'Add Customer', path: ROUTES.CUSTOMER_ADD },
        ],
      },
      { key: 'countries', label: 'Country', icon: 'bi-globe2', path: ROUTES.ORG_COUNTRIES },
      { key: 'states', label: 'State', icon: 'bi-map', path: ROUTES.ORG_STATES },
      { key: 'cities', label: 'City', icon: 'bi-pin-map', path: ROUTES.ORG_CITIES },
        {
        key: 'branches',
        label: 'Branches',
        icon: 'bi-diagram-3',
        children: [
          { key: 'branch-list', label: 'Branch List', path: ROUTES.BRANCHES },
          { key: 'branch-add', label: 'Add Branch', path: ROUTES.BRANCH_ADD },
        ],
      },
      { key: 'locations', label: 'Location', icon: 'bi-geo-alt', path: ROUTES.ORG_LOCATIONS },
      { key: 'shops', label: 'Shop', icon: 'bi-shop', path: ROUTES.ORG_SHOPS },
      { key: 'lines', label: 'Line', icon: 'bi-distribute-horizontal', path: ROUTES.ORG_LINES },
      { key: 'cells', label: 'Cell', icon: 'bi-grid-3x3-gap', path: ROUTES.ORG_CELLS },
      { key: 'supervisors', label: 'Supervisor', icon: 'bi-person-badge', path: ROUTES.ORG_SUPERVISORS },
      {
        key: 'parts',
        label: 'Parts',
        icon: 'bi-rocket-takeoff',
        children: [
          { key: 'part-list', label: 'Part List', path: ROUTES.PARTS },
          { key: 'operations', label: 'Operations', path: ROUTES.OPERATIONS },
        ],
      },
      {
        key: 'shifts',
        label: 'Shifts',
        icon: 'bi-calendar3',
        children: [
          { key: 'shift-setup', label: 'Shift Setup', path: ROUTES.SHIFTS },
          { key: 'holidays', label: 'Holidays', path: ROUTES.HOLIDAYS },
        ],
      },
      {
        key: 'users',
        label: 'Users',
        icon: 'bi-people',
        children: [
          { key: 'user-list', label: 'User List', path: ROUTES.USERS },
          { key: 'roles', label: 'Roles & Permissions', path: ROUTES.ROLES },
        ],
      },
    ],
  },
  {
    key: 'system',
    title: 'System',
    items: [
      { key: 'account', label: 'Account Center', icon: 'bi-shield-lock', path: ROUTES.ACCOUNT },
      { key: 'theme', label: 'Theme Showcase', icon: 'bi-palette', path: ROUTES.THEME },
      { key: 'user-guide', label: 'User Guide', icon: 'bi-book', path: ROUTES.USER_GUIDE },
      { key: 'about', label: 'About', icon: 'bi-info-circle', path: ROUTES.ABOUT },
    ],
  },
]
