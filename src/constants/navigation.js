import { MANAGERS, SUPERADMIN_ONLY } from './app'
import { ROUTES } from './routes'
import { ORGANIZATION_PATHS } from './organization'
import { ACCOUNT_CENTER_PATHS } from './accountCenter'
import { MONITORING_PATHS } from './monitoring'

// Sidebar menu. An item has either a `path` (link) or `children` (submenu).
// `icon` is a Bootstrap Icons class: https://icons.getbootstrap.com
// `roles` (optional, also on children): only these roles see the item; children inherit it.
// `activePaths` (optional, links only): other routes that also mark the link active.
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
          { key: 'monitoring', label: 'Monitoring', path: ROUTES.MONITORING, activePaths: MONITORING_PATHS },
          // { key: 'machine-groups', label: 'Machine Groups', path: ROUTES.MACHINE_GROUPS },
        ],
      },
      {
        key: 'production',
        label: 'Production',
        icon: 'bi-gear-wide-connected',
        children: [
          { key: 'production-schedule', label: 'Schedule', path: ROUTES.PRODUCTION_SCHEDULE },
          { key: 'production-schedule-add', label: 'Add Schedule', path: ROUTES.PRODUCTION_SCHEDULE_ADD, roles: MANAGERS }
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
      // Country … Supervisor and Branches: one tabbed page (constants/organization.js)
      {
        key: 'organization',
        label: 'Organization',
        icon: 'bi-diagram-3',
        path: ROUTES.ORG_COUNTRIES,
        activePaths: ORGANIZATION_PATHS,
      },
      // The customer's clients (parts are made for a clientele): its own page, no submenu
      { key: 'clientele', label: 'Clientele', icon: 'bi-person-vcard', path: ROUTES.CLIENTELES },
      {
        key: 'parts',
        label: 'Parts',
        icon: 'bi-rocket-takeoff',
        children: [
          { key: 'part-list', label: 'Part List', path: ROUTES.PARTS },
          { key: 'part-add', label: 'Add Part', path: ROUTES.PART_ADD, roles: MANAGERS },
        ],
      },
      {
        key: 'shifts',
        label: 'Shift',
        icon: 'bi-calendar3',
        children: [
          { key: 'shift-setup', label: 'Add / Manage Shift', path: ROUTES.SHIFTS },
          { key: 'breaks', label: 'Breaks', path: ROUTES.BREAKS },
          { key: 'holidays', label: 'Holiday / Week Off', path: ROUTES.HOLIDAYS },
        ],
      },
      {
        key: 'downtime',
        label: 'Downtime',
        icon: 'bi-exclamation-octagon',
        children: [
          { key: 'downtime-reasons', label: 'Downtime List', path: ROUTES.DOWNTIME_REASONS },
          { key: 'idle-reasons', label: 'Idle List', path: ROUTES.IDLE_REASONS },
        ],
      },
      {
        key: 'users',
        label: 'Users',
        icon: 'bi-people',
        // Company members: a customer / admin sees the users created for its company, the superadmin every company's
        roles: MANAGERS,
        children: [
          { key: 'user-list', label: 'User List', path: ROUTES.USERS },
          { key: 'user-add', label: 'Add User', path: ROUTES.USER_ADD }
        ],
      },
    ],
  },
  {
    key: 'system',
    title: 'System',
    items: [
      // Customer, Licence Key and Machine Catalog: one tabbed page, superadmin only (constants/accountCenter.js)
      {
        key: 'account-center',
        label: 'Account Center',
        icon: 'bi-buildings',
        path: ROUTES.ACCOUNT_CENTER,
        roles: SUPERADMIN_ONLY,
        activePaths: ACCOUNT_CENTER_PATHS,
      },
      { key: 'theme', label: 'Theme Showcase', icon: 'bi-palette', path: ROUTES.THEME },
      { key: 'user-guide', label: 'User Guide', icon: 'bi-book', path: ROUTES.USER_GUIDE },
    ],
  },
]
