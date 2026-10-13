import apiClient, { sharedGet } from './apiClient'

// The logged-in user's supervisors (user_supervisor table). The server picks the user.
// Paths are relative to VITE_API_BASE_URL (…/api/v1).
// Every response is { statusCode, success, message, data }; these functions return `data`.
const PATH = '/user-supervisor'

// The server omits `data` for an empty list, so lists fall back to [].
const unwrap = (response) => response.data.data
const unwrapList = (response) => unwrap(response) ?? []

// userCellId (optional) keeps only the supervisors of that cell
export const getUserSupervisors = async (userCellId) =>
  unwrapList(await sharedGet(userCellId ? `${PATH}?userCellId=${userCellId}` : PATH))

// supervisor = { userCellId, name }
export const createUserSupervisor = async (supervisor) => unwrap(await apiClient.post(PATH, supervisor))

export const updateUserSupervisor = async (id, supervisor) => unwrap(await apiClient.put(`${PATH}/${id}`, supervisor))

export const deleteUserSupervisor = async (id) => {
  await apiClient.delete(`${PATH}/${id}`)
}
