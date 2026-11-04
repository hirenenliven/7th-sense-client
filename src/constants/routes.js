export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',

  // Operations
  MACHINES: '/machines',
  MACHINE_ADD: '/machines/add',
  MACHINE_EDIT: '/machines/:id/edit',
  // Operations › Monitoring tabs (constants/monitoring.js): the machine list, then a machine's
  // Productivity / Health (`?machineId=`). Kept apart from the machine set-up under /machines.
  MONITORING: '/monitoring',
  MACHINE_PRODUCTIVITY: '/monitoring/productivity',
  MACHINE_HEALTH: '/monitoring/health',
  MACHINE_GROUPS: '/machines/groups',
  PRODUCTION_SCHEDULE: '/production/schedule',
  PRODUCTION_SCHEDULE_ADD: '/production/schedule/add',
  PRODUCTION_SCHEDULE_EDIT: '/production/schedule/:id/edit',
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
  // Machine catalog (superadmin): Brand → Controller → Model
  CONTROLLERS: '/masters/controllers',
  MODELS: '/masters/models',
  CLIENTELES: '/masters/clienteles',
  PARTS: '/masters/parts',
  PART_ADD: '/masters/parts/add',
  PART_EDIT: '/masters/parts/:id/edit',
  OPERATIONS: '/masters/operations',
  SHIFTS: '/masters/shifts',
  BREAKS: '/masters/breaks',
  HOLIDAYS: '/masters/holidays',
  // Downtime: the reasons a machine was down / stood idle (pages/Reasons/, one page per kind)
  DOWNTIME_REASONS: '/masters/downtime-reasons',
  IDLE_REASONS: '/masters/idle-reasons',
  // Licence keys: the superadmin generates them for a customer; managers read their company's
  LICENCE_KEYS: '/masters/licence-keys',
  // Users: members of a customer's company (the Customer pages, see pages/Customers/accountPages.js)
  USERS: '/masters/users',
  USER_ADD: '/masters/users/add',
  USER_EDIT: '/masters/users/:id/edit',
  USER_VIEW: '/masters/users/:id',
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
  // Account Center: opens the first tab the user may see (Customer, Licence Key, Machine Catalog
  // keep their own routes above, see constants/accountCenter.js)
  ACCOUNT_CENTER: '/account-center',
  THEME: '/theme',
  ABOUT: '/about',
  USER_GUIDE: '/user-guide',

  NOT_FOUND: '*',
}
