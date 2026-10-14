import apiClient, { sharedGet, withQuery } from './apiClient'

// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
// The server answers with the users the logged-in user may manage: the superadmin every user,
// a customer or admin only their company's users.
const USERS_PATH = '/users'

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

// filters: { filterRole: 'customer' } lists only users with that role (not the caller's role);
// { companyId } one company's users (superadmin)
export const getUsers = async (filters = {}) => unwrapList(await sharedGet(withQuery(USERS_PATH, filters)))

export const getUserById = async (id) => unwrap(await sharedGet(`${USERS_PATH}/${id}`))

// The logged-in user with its profile (theme, …)
export const getCurrentUser = async () => unwrap(await sharedGet('/me'))

// Saves the logged-in user's theme (THEME.DARK / THEME.LIGHT) in their profile; returns { theme }
export const saveMyTheme = async (theme) => unwrap(await apiClient.put('/me/theme', { theme }))

export const createUser = async (user) => unwrap(await apiClient.post(USERS_PATH, user))

export const updateUser = async (id, user) => unwrap(await apiClient.put(`${USERS_PATH}/${id}`, user))

export const deleteUser = async (id) => {
  await apiClient.delete(`${USERS_PATH}/${id}`)
}
