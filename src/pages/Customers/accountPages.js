import { CUSTOMER_ROLE_ID, ROLES } from '@/constants/app'
import { ROUTES } from '@/constants/routes'

// The Customer pages (list, add / edit, view) also manage users: both are accounts with the same
// fields and the same users API, and differ only in role. `kind` picks the wording, routes and the
// extra Access card (role, company, machines) of users.
export const ACCOUNT_KIND = {
  CUSTOMER: 'customer',
  USER: 'user',
}

export const ACCOUNT_PAGES = {
  [ACCOUNT_KIND.CUSTOMER]: {
    noun: 'customer',
    title: 'Customer',
    section: 'Account Center · Customers',
    icon: 'bi-building',
    // The list is the Customer tab of System › Account Center: a tab header, not a page header
    tabbed: true,
    listTitle: 'Manage Customer',
    listSubtitle: 'All customer accounts and their logins.',
    viewSubtitle: 'Customer account, company, address and settings.',
    // GET /users filter: customers only
    listQuery: { filterRole: ROLES.CUSTOMER },
    routes: { list: ROUTES.CUSTOMERS, add: ROUTES.CUSTOMER_ADD, edit: ROUTES.CUSTOMER_EDIT, view: ROUTES.CUSTOMER_VIEW },
  },
  [ACCOUNT_KIND.USER]: {
    noun: 'user',
    title: 'User',
    section: 'Masters · Users',
    icon: 'bi-people',
    listTitle: 'Manage Users',
    listSubtitle: 'Users of the company, their roles and the machines they can access.',
    viewSubtitle: 'User account, role, machine access, address and settings.',
    // GET /users?membersOnly=true: company members only (no customers, no superadmin). The server
    // also limits a customer or admin to the users of its own company; the superadmin gets every company's.
    listQuery: { membersOnly: true },
    routes: { list: ROUTES.USERS, add: ROUTES.USER_ADD, edit: ROUTES.USER_EDIT, view: ROUTES.USER_VIEW },
  },
}

// Accounts of a kind in a GET /users list. The server already filters both kinds (listQuery);
// this keeps the list right if a row slips through. Uses companyId / roleId, which every users response has.
export const isAccountOfKind = (account, kind) =>
  kind === ACCOUNT_KIND.USER ? account.companyId != null : account.roleId === CUSTOMER_ROLE_ID
