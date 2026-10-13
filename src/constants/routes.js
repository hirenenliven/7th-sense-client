export const ROUTES = {
  HOME: '/',

  // Operations
  MACHINES: '/machines',
  MACHINE_HEALTH: '/machines/health',
  MACHINE_GROUPS: '/machines/groups',
  PRODUCTION_SCHEDULE: '/production/schedule',
  PRODUCTION_MONITOR: '/production/monitor',
  TOOLS: '/tools',
  TOOL_LIFE: '/tools/life',
  REPORT_OEE: '/reports/oee',
  REPORT_DOWNTIME: '/reports/downtime',
  REPORT_PRODUCTION: '/reports/production',

  // Masters
  CUSTOMERS: '/masters/customers',
  CUSTOMER_ADD: '/masters/customers/add',
  CUSTOMER_EDIT: '/masters/customers/:id/edit',
  CUSTOMER_VIEW: '/masters/customers/:id',
  BRANCHES: '/masters/branches',
  BRANCH_ADD: '/masters/branches/add',
  BRANCH_EDIT: '/masters/branches/:id/edit',
  PARTS: '/masters/parts',
  OPERATIONS: '/masters/operations',
  SHIFTS: '/masters/shifts',
  HOLIDAYS: '/masters/holidays',
  USERS: '/masters/users',
  ROLES: '/masters/roles',

  // Masters › Country … Supervisor: independent screens, one per level (pages/Organization/<Level>/)
  ORG_COUNTRIES: '/organization/countries',
  ORG_STATES: '/organization/states',
  ORG_CITIES: '/organization/cities',
  ORG_LOCATIONS: '/organization/locations',
  ORG_SHOPS: '/organization/shops',
  ORG_LINES: '/organization/lines',
  ORG_CELLS: '/organization/cells',
  ORG_SUPERVISORS: '/organization/supervisors',

  // System
  ACCOUNT: '/account',
  THEME: '/theme',
  ABOUT: '/about',
  USER_GUIDE: '/user-guide',

  NOT_FOUND: '*',
}
