import { CUSTOMER_ROLE_ID, ROLES } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { tk } from '@/i18n/tk'

// The Customer pages (list, add / edit, view) also manage users: both are accounts with the same
// fields and the same users API, and differ only in role. `kind` picks the wording, routes and the
// extra Access card (role, company, machines) of users. Wording values are English keys (tk).
export const ACCOUNT_KIND = {
  CUSTOMER: 'customer',
  USER: 'user',
}

export const ACCOUNT_PAGES = {
  [ACCOUNT_KIND.CUSTOMER]: {
    title: tk('Customer'),
    section: tk('Masters · Customers'),
    icon: 'bi-building',
    listTitle: tk('Manage Customer'),
    listSubtitle: tk('All customer accounts and their logins.'),
    viewSubtitle: tk('Customer account, company, address and settings.'),
    // GET /users filter: customers only
    listQuery: { filterRole: ROLES.CUSTOMER },
    // Whole sentences (English keys, shown with t()): see reasonPages.js
    text: {
      add: tk('Add Customer'),
      edit: tk('Edit Customer'),
      addSubtitle: tk('Create a customer account and its login.'),
      editSubtitle: tk('Update the customer account and its login.'),
      backToList: tk('Customer list'),
      save: tk('Save Customer'),
      update: tk('Update Customer'),
      createdTitle: tk('Customer created'),
      updatedTitle: tk('Customer updated'),
      saveFailed: tk('Could not save customer'),
      loadingOne: tk('Loading customer…'),
      loadOneFailed: tk('Could not load this customer.'),
      themeHint: tk('Colour scheme the customer sees after signing in.'),
      filtersLabel: tk('Filters available to this customer'),
      loadingList: tk('Loading customers…'),
      loadListFailed: tk('Could not load customers.'),
      empty: tk('No customers yet.'),
      addFirst: tk('Add the first customer'),
      searchPlaceholder: tk('Search ID, user name, customer, email, mobile…'),
      search: tk('Search customers'),
      noMatch: tk('No customers match “{{search}}”.'),
      deleteTitle: tk('Delete customer'),
      deletedTitle: tk('Customer deleted'),
      deleteFailed: tk('Could not delete customer'),
    },
    routes: { list: ROUTES.CUSTOMERS, add: ROUTES.CUSTOMER_ADD, edit: ROUTES.CUSTOMER_EDIT, view: ROUTES.CUSTOMER_VIEW },
  },
  [ACCOUNT_KIND.USER]: {
    title: tk('User'),
    section: tk('Masters · Users'),
    icon: 'bi-people',
    listTitle: tk('Manage Users'),
    listSubtitle: tk('Users of the company, their roles and the machines they can access.'),
    viewSubtitle: tk('User account, role, machine access, address and settings.'),
    // The server returns only the company's users to a customer or admin; the superadmin also
    // gets customers, which the list leaves out (users have a companyId, customers do not).
    listQuery: {},
    text: {
      add: tk('Add User'),
      edit: tk('Edit User'),
      addSubtitle: tk('Create a user account and its login.'),
      editSubtitle: tk('Update the user account and its login.'),
      backToList: tk('User list'),
      save: tk('Save User'),
      update: tk('Update User'),
      createdTitle: tk('User created'),
      updatedTitle: tk('User updated'),
      saveFailed: tk('Could not save user'),
      loadingOne: tk('Loading user…'),
      loadOneFailed: tk('Could not load this user.'),
      themeHint: tk('Colour scheme the user sees after signing in.'),
      filtersLabel: tk('Filters available to this user'),
      loadingList: tk('Loading users…'),
      loadListFailed: tk('Could not load users.'),
      empty: tk('No users yet.'),
      addFirst: tk('Add the first user'),
      searchPlaceholder: tk('Search ID, user name, name, role, email, mobile…'),
      search: tk('Search users'),
      noMatch: tk('No users match “{{search}}”.'),
      deleteTitle: tk('Delete user'),
      deletedTitle: tk('User deleted'),
      deleteFailed: tk('Could not delete user'),
    },
    routes: { list: ROUTES.USERS, add: ROUTES.USER_ADD, edit: ROUTES.USER_EDIT, view: ROUTES.USER_VIEW },
  },
}

// Accounts of a kind in a GET /users list. Customers are already filtered by the server
// (listQuery); users need it for the superadmin, who also gets customers and itself.
// Uses companyId / roleId, which every users response has.
export const isAccountOfKind = (account, kind) =>
  kind === ACCOUNT_KIND.USER ? account.companyId != null : account.roleId === CUSTOMER_ROLE_ID
