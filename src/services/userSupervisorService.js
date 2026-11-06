import apiClient, { sharedGet, withQuery, unwrap, unwrapList } from './apiClient'

// The logged-in user's supervisors (user_supervisor table). The server picks the user;
// an admin passes userId to work on another user's rows.
// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const PATH = '/user-supervisor'

// userCellId (optional) keeps only the supervisors of that cell
export const getUserSupervisors = async (userCellId, userId) =>
  unwrapList(await sharedGet(withQuery(PATH, { userCellId, userId })))

// supervisor = { userCellId, name }
export const createUserSupervisor = async (supervisor, userId) => unwrap(await apiClient.post(withQuery(PATH, { userId }), supervisor))

export const updateUserSupervisor = async (id, supervisor, userId) =>
  unwrap(await apiClient.put(withQuery(`${PATH}/${id}`, { userId }), supervisor))

export const deleteUserSupervisor = async (id, userId) => {
  await apiClient.delete(withQuery(`${PATH}/${id}`, { userId }))
}
