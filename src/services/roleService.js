import { sharedGet, unwrapList } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const PATH = '/roles'

// Roles the logged-in user may give on the user form ([{ id, name, description }]): the superadmin
// every role but superadmin, a customer every member role, an admin every member role but admin.
export const getAssignableRoles = async () => unwrapList(await sharedGet(PATH))
